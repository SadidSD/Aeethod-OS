import pg from 'pg';
const { Client } = pg;

const client = new Client({
  host: 'aws-0-us-east-1.pooler.supabase.com',
  port: 5432,
  user: 'postgres.hwwspxwrctxiiutujmlh',
  password: 'itsyourSD@123',
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
});

async function runRemainingEnrichment() {
  console.log('=== ENRICHING REMAINING HIGH-VALUE JAPANESE & ENGLISH VARIANTS ===\n');
  await client.connect();

  try {
    const start = Date.now();
    let totalEnriched = 0;

    // 1. JAPANESE MODERN MIRROR / REVERSE HOLOS (S, SM, SV Series)
    console.log('1. Generating Japanese Modern Reverse / Mirror Holo finishes (S, SM, SV eras)...');
    const jpModernRes = await client.query(`
      SELECT 
        v.card_id, 
        v.barcode, 
        v.image_front_url, 
        v.slug,
        s.set_code
      FROM card_variants v
      JOIN master_cards m ON v.card_id = m.id
      JOIN card_sets s ON m.set_id = s.id
      WHERE s.language = 'jp'
        AND (s.set_code ~* '^(S|SM|SV)[0-9]' OR s.set_code ~* '^(S|SM|SV)[A-Z]')
        AND v.finish = 'regular'
        AND NOT EXISTS (
          SELECT 1 FROM card_variants v2 
          WHERE v2.card_id = v.card_id 
            AND v2.finish = 'reverse_holo'
        );
    `);

    console.log(`   Found ${jpModernRes.rows.length.toLocaleString()} Japanese Modern cards eligible for Reverse/Mirror Holos.`);

    if (jpModernRes.rows.length > 0) {
      const batchSize = 100;
      for (let i = 0; i < jpModernRes.rows.length; i += batchSize) {
        const batch = jpModernRes.rows.slice(i, i + batchSize);
        const values = [];
        const params = [];
        let p = 1;

        for (const row of batch) {
          const newSlug = `${row.slug}-rev-holo`.slice(0, 280);
          values.push(`($${p}, $${p+1}, 'reverse_holo', 'none', 'unlimited', 'jp', $${p+2}, $${p+3})`);
          params.push(row.card_id, newSlug, row.barcode, row.image_front_url);
          p += 4;
        }

        const insertSql = `
          INSERT INTO card_variants (
            card_id, slug, finish, stamp, print_run, language, barcode, image_front_url
          ) VALUES ${values.join(', ')}
          ON CONFLICT (card_id, finish, stamp, print_run) DO NOTHING;
        `;
        const res = await client.query(insertSql, params);
        totalEnriched += res.rowCount || batch.length;
      }
      console.log(`   ✓ Added Japanese Modern Reverse Holo variants.`);
    }

    // 2. JAPANESE 1ST EDITIONS (E-Card, PCG, Neo)
    console.log('\n2. Generating Japanese Vintage 1st Edition prints (E-Series, PCG, Neo)...');
    const jpVintage1edRes = await client.query(`
      SELECT 
        v.card_id, 
        v.finish,
        v.barcode, 
        v.image_front_url, 
        v.slug,
        s.set_code
      FROM card_variants v
      JOIN master_cards m ON v.card_id = m.id
      JOIN card_sets s ON m.set_id = s.id
      WHERE s.language = 'jp'
        AND (s.set_code ~* '^(E|PCG)[0-9]' OR s.set_code ILIKE 'neo%')
        AND v.print_run = 'unlimited'
        AND NOT EXISTS (
          SELECT 1 FROM card_variants v2 
          WHERE v2.card_id = v.card_id 
            AND v2.print_run = '1st_edition'
            AND v2.finish = v.finish
        );
    `);

    console.log(`   Found ${jpVintage1edRes.rows.length.toLocaleString()} Japanese Vintage cards eligible for 1st Edition prints.`);

    if (jpVintage1edRes.rows.length > 0) {
      const batchSize = 100;
      for (let i = 0; i < jpVintage1edRes.rows.length; i += batchSize) {
        const batch = jpVintage1edRes.rows.slice(i, i + batchSize);
        const values = [];
        const params = [];
        let p = 1;

        for (const row of batch) {
          const newSlug = `${row.slug}-1ed`.slice(0, 280);
          values.push(`($${p}, $${p+1}, $${p+2}, 'none', '1st_edition', 'jp', $${p+3}, $${p+4})`);
          params.push(row.card_id, newSlug, row.finish, row.barcode, row.image_front_url);
          p += 5;
        }

        const insertSql = `
          INSERT INTO card_variants (
            card_id, slug, finish, stamp, print_run, language, barcode, image_front_url
          ) VALUES ${values.join(', ')}
          ON CONFLICT (card_id, finish, stamp, print_run) DO NOTHING;
        `;
        const res = await client.query(insertSql, params);
        totalEnriched += res.rowCount || batch.length;
      }
      console.log(`   ✓ Added Japanese Vintage 1st Edition variants.`);
    }

    // 3. ENGLISH POKÉMON CENTER & LEAGUE STAMPS
    console.log('\n3. Generating English Pokémon Center & League Stamped Promos...');
    const enPcRes = await client.query(`
      SELECT 
        v.card_id, 
        v.finish,
        v.barcode, 
        v.image_front_url, 
        v.slug,
        s.set_code
      FROM card_variants v
      JOIN master_cards m ON v.card_id = m.id
      JOIN card_sets s ON m.set_id = s.id
      WHERE s.language = 'en'
        AND s.release_date >= '2019-01-01'
        AND v.finish = 'reverse_holo'
        AND v.stamp = 'none'
        AND NOT EXISTS (
          SELECT 1 FROM card_variants v2 
          WHERE v2.card_id = v.card_id 
            AND v2.stamp = 'pokemon_center'
        )
      LIMIT 2500;
    `);

    console.log(`   Found ${enPcRes.rows.length.toLocaleString()} English modern cards eligible for Pokémon Center / League stamps.`);

    if (enPcRes.rows.length > 0) {
      const batchSize = 100;
      for (let i = 0; i < enPcRes.rows.length; i += batchSize) {
        const batch = enPcRes.rows.slice(i, i + batchSize);
        const values = [];
        const params = [];
        let p = 1;

        for (const row of batch) {
          const newSlug = `${row.slug}-pkmn-center`.slice(0, 280);
          values.push(`($${p}, $${p+1}, $${p+2}, 'pokemon_center', 'unlimited', 'en', $${p+3}, $${p+4})`);
          params.push(row.card_id, newSlug, row.finish, row.barcode, row.image_front_url);
          p += 5;
        }

        const insertSql = `
          INSERT INTO card_variants (
            card_id, slug, finish, stamp, print_run, language, barcode, image_front_url
          ) VALUES ${values.join(', ')}
          ON CONFLICT (card_id, finish, stamp, print_run) DO NOTHING;
        `;
        const res = await client.query(insertSql, params);
        totalEnriched += res.rowCount || batch.length;
      }
      console.log(`   ✓ Added Pokémon Center stamped variants.`);
    }

    const duration = ((Date.now() - start) / 1000).toFixed(1);
    console.log(`\n================ REMAINING ENRICHMENT COMPLETE ================`);
    console.log(`Total New Variants Added: ${totalEnriched.toLocaleString()}`);
    console.log(`Execution Time:           ${duration}s`);

  } catch (err) {
    console.error('Remaining Enrichment Error:', err);
  } finally {
    await client.end();
  }
}

runRemainingEnrichment();
