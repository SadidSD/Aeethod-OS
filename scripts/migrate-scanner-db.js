import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from '../api/_db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  console.log('=== AEETHOD OS: SCANNER DATABASE MIGRATION & ENRICHMENT ===\n');

  try {
    // 1. EXTENSIONS
    console.log('1. Checking PostgreSQL extensions...');
    await pool.query('CREATE EXTENSION IF NOT EXISTS vector;');
    await pool.query('CREATE EXTENSION IF NOT EXISTS pg_trgm;');
    console.log('   ✓ pgvector & pg_trgm confirmed active.');

    // 2. CARD FINGERPRINTS (Vector & pHash)
    console.log('\n2. Creating card_fingerprints table & HNSW index...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS card_fingerprints (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        variant_id UUID NOT NULL REFERENCES card_variants(id) ON DELETE CASCADE,
        image_url TEXT NOT NULL,
        visual_embedding vector(512) NOT NULL,
        phash BIT(64),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        CONSTRAINT uq_variant_fingerprint UNIQUE (variant_id)
      );
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_card_embeddings_hnsw 
      ON card_fingerprints 
      USING hnsw (visual_embedding vector_cosine_ops)
      WITH (m = 16, ef_construction = 64);
    `);
    console.log('   ✓ card_fingerprints table & HNSW cosine index created successfully.');

    // 3. SET METADATA ENRICHMENT COLUMNS
    console.log('\n3. Adding symbol_url, logo_url, and ptcgo_code to card_sets...');
    await pool.query(`
      ALTER TABLE card_sets 
      ADD COLUMN IF NOT EXISTS symbol_url TEXT,
      ADD COLUMN IF NOT EXISTS logo_url TEXT,
      ADD COLUMN IF NOT EXISTS ptcgo_code VARCHAR(16);
    `);
    console.log('   ✓ card_sets columns added.');

    // 4. BACKFILL SET METADATA FROM LOCAL CACHE
    console.log('\n4. Backfilling set metadata from local cache...');
    const enSetsPath = path.resolve(__dirname, '../data/pokemon-tcg-data/sets/en.json');
    let backfilledCount = 0;

    if (fs.existsSync(enSetsPath)) {
      const enSets = JSON.parse(fs.readFileSync(enSetsPath, 'utf8'));
      console.log(`   Found ${enSets.length} sets in en.json cache.`);

      for (const s of enSets) {
        const symbolUrl = s.images?.symbol || null;
        const logoUrl = s.images?.logo || null;
        const ptcgoCode = s.ptcgoCode || null;

        const updateRes = await pool.query(`
          UPDATE card_sets 
          SET 
            symbol_url = COALESCE($1, symbol_url),
            logo_url = COALESCE($2, logo_url),
            ptcgo_code = COALESCE($3, ptcgo_code)
          WHERE set_code = $4 OR set_code ILIKE $4
        `, [symbolUrl, logoUrl, ptcgoCode, s.id]);

        if (updateRes.rowCount > 0) {
          backfilledCount += updateRes.rowCount;
        }
      }
      console.log(`   ✓ Backfilled set symbols, logos, and ptcgo_codes for ${backfilledCount} set records.`);
    } else {
      console.log('   ⚠ Warning: en.json not found, skipping local backfill.');
    }

    // 5. CARD NUMBER OCR OPTIMIZATION INDEX
    console.log('\n5. Creating optimized OCR indexes on card_number...');
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_master_cards_clean_num 
      ON master_cards (set_id, TRIM(LEADING '0' FROM card_number));
    `);
    console.log('   ✓ Trimmed leading-zero card_number index active.');

    // 6. SCANNER STAGING & SESSION TABLES
    console.log('\n6. Creating scanner staging & bulk session tables...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS scan_sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(128) NOT NULL,
        total_cards INT DEFAULT 0,
        total_value_cents BIGINT DEFAULT 0,
        status VARCHAR(32) DEFAULT 'in_progress',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS scan_session_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        session_id UUID NOT NULL REFERENCES scan_sessions(id) ON DELETE CASCADE,
        variant_id UUID NOT NULL REFERENCES card_variants(id),
        detected_finish VARCHAR(32) NOT NULL DEFAULT 'regular',
        detected_condition VARCHAR(16) DEFAULT 'NM',
        confidence_score NUMERIC(5, 2),
        captured_price_cents BIGINT NOT NULL DEFAULT 0,
        status VARCHAR(32) DEFAULT 'pending_review',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_scan_items_session ON scan_session_items(session_id);
    `);
    console.log('   ✓ scan_sessions and scan_session_items tables verified.');

    // 7. FINAL AUDIT & SUMMARY
    console.log('\n7. Running database verification audit...');
    const fpTable = await pool.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_name IN ('card_fingerprints', 'scan_sessions', 'scan_session_items')
    `);
    console.log('   Created Tables:', fpTable.rows.map(r => r.table_name));

    const setsEnriched = await pool.query(`
      SELECT 
        COUNT(*) as total_sets,
        COUNT(symbol_url) as with_symbol,
        COUNT(logo_url) as with_logo,
        COUNT(ptcgo_code) as with_ptcgo
      FROM card_sets
    `);
    console.log('   card_sets enrichment stats:');
    console.table(setsEnriched.rows);

    const sampleSet = await pool.query(`
      SELECT name, set_code, ptcgo_code, symbol_url, logo_url 
      FROM card_sets 
      WHERE symbol_url IS NOT NULL 
      LIMIT 3
    `);
    console.log('   Sample enriched sets:');
    console.table(sampleSet.rows);

    console.log('\n=== MIGRATION COMPLETED SUCCESSFULLY WITH ZERO ERRORS ===');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Migration failed:', err);
    process.exit(1);
  }
}

runMigration();
