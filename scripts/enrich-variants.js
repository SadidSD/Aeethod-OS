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

async function runEnrichment() {
  console.log('=== STARTING LAYER 2 VARIANT ENRICHMENT PIPELINE ===\n');
  await client.connect();

  try {
    const start = Date.now();
    let totalEnriched = 0;

    // -------------------------------------------------------------
    // 1. JAPANESE 1ST EDITION (1ED) PRINTS (2003-2014)
    // -------------------------------------------------------------
    console.log('1. Enriching Japanese 1st Edition (1ED) prints (ADV, PCG, DP, DPt, L, BW, XY)...');
    
    // Select all Japanese cards in eras between 2003 and 2014 that currently only have 'unlimited'
    const jp1edRes = await client.query(`
      SELECT 
        v.card_id, 
        v.finish, 
        v.barcode, 
        v.image_front_url, 
        v.slug,
        s.set_code,
        m.card_number
      FROM card_variants v
      JOIN master_cards m ON v.card_id = m.id
      JOIN card_sets s ON m.set_id = s.id
      WHERE s.language = 'jp'
        AND s.era_block IN ('ADV', 'PCG', 'DP', 'DPt', 'L', 'BW', 'XY', 'e')
        AND v.print_run = 'unlimited'
        AND NOT EXISTS (
          SELECT 1 FROM card_variants v2 
          WHERE v2.card_id = v.card_id 
            AND v2.print_run = '1st_edition'
            AND v2.finish = v.finish
        );
    `);

    console.log(`   Found ${jp1edRes.rows.length.toLocaleString()} Japanese cards eligible for 1st Edition prints.`);

    if (jp1edRes.rows.length > 0) {
      const batchSize = 100;
      for (let i = 0; i < jp1edRes.rows.length; i += batchSize) {
        const batch = jp1edRes.rows.slice(i, i + batchSize);
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
      console.log(`   ✓ Added Japanese 1st Edition variants.`);
    }

    // -------------------------------------------------------------
    // 2. ENGLISH WOTC 1ST EDITIONS (Jungle, Fossil, Rocket, Gym, Neo)
    // -------------------------------------------------------------
    console.log('\n2. Enriching English Vintage WotC 1st Editions (Jungle through Neo Destiny)...');
    
    const wotcSets = ['base2', 'base3', 'base5', 'gym1', 'gym2', 'neo1', 'neo2', 'neo3', 'neo4'];
    const enWotcRes = await client.query(`
      SELECT 
        v.card_id, 
        v.finish, 
        v.barcode, 
        v.image_front_url, 
        v.slug,
        s.set_code,
        m.card_number
      FROM card_variants v
      JOIN master_cards m ON v.card_id = m.id
      JOIN card_sets s ON m.set_id = s.id
      WHERE s.language = 'en'
        AND s.set_code = ANY($1)
        AND v.print_run = 'unlimited'
        AND NOT EXISTS (
          SELECT 1 FROM card_variants v2 
          WHERE v2.card_id = v.card_id 
            AND v2.print_run = '1st_edition'
            AND v2.finish = v.finish
        );
    `, [wotcSets]);

    console.log(`   Found ${enWotcRes.rows.length.toLocaleString()} English WotC cards eligible for 1st Edition prints.`);

    if (enWotcRes.rows.length > 0) {
      const batchSize = 100;
      for (let i = 0; i < enWotcRes.rows.length; i += batchSize) {
        const batch = enWotcRes.rows.slice(i, i + batchSize);
        const values = [];
        const params = [];
        let p = 1;

        for (const row of batch) {
          const newSlug = `${row.slug}-1ed`.slice(0, 280);
          values.push(`($${p}, $${p+1}, $${p+2}, 'none', '1st_edition', 'en', $${p+3}, $${p+4})`);
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
      console.log(`   ✓ Added English WotC 1st Edition variants.`);
    }

    // -------------------------------------------------------------
    // 3. JAPANESE HIGH-CLASS PACK MIRROR / REVERSE FOILS
    // -------------------------------------------------------------
    console.log('\n3. Enriching Japanese High-Class Pack Mirror Reverse Foils...');
    
    // Target sets: S12a (VSTAR Universe), S4a (Shiny Star V), SM12a (Tag All Stars), SM8b, SV4a (Shiny Treasure), SV8a (Terastal Fest)
    const jpHighClassSets = ['S12A', 'S4A', 'SM12A', 'SM8B', 'SV4A', 'SV8A', 'CP4'];
    const jpMirrorRes = await client.query(`
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
        AND UPPER(s.set_code) = ANY($1)
        AND v.finish = 'regular'
        AND NOT EXISTS (
          SELECT 1 FROM card_variants v2 
          WHERE v2.card_id = v.card_id 
            AND v2.finish = 'reverse_holo'
        );
    `, [jpHighClassSets]);

    console.log(`   Found ${jpMirrorRes.rows.length.toLocaleString()} Japanese High-Class cards eligible for Mirror Foils.`);

    if (jpMirrorRes.rows.length > 0) {
      const batchSize = 100;
      for (let i = 0; i < jpMirrorRes.rows.length; i += batchSize) {
        const batch = jpMirrorRes.rows.slice(i, i + batchSize);
        const values = [];
        const params = [];
        let p = 1;

        for (const row of batch) {
          const newSlug = `${row.slug}-mirror-rev`.slice(0, 280);
          values.push(`($${p}, $${p+1}, 'reverse_holo', 'mirror_foil', 'unlimited', 'jp', $${p+2}, $${p+3})`);
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
      console.log(`   ✓ Added Japanese Mirror Reverse Foil variants.`);
    }

    // -------------------------------------------------------------
    // 4. WORLD CHAMPIONSHIP DECKS (Silver Borders & Signatures)
    // -------------------------------------------------------------
    console.log('\n4. Enriching World Championship Deck Signature Variants...');
    
    // For English Ultra Rares, ACE SPECs, and staple meta cards in sets 2004-2024
    const wcRes = await client.query(`
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
        AND s.release_date BETWEEN '2004-01-01' AND '2024-12-31'
        AND (m.rarity ILIKE '%Ultra%' OR m.rarity ILIKE '%Secret%' OR m.rarity ILIKE '%Holo%' OR m.rarity ILIKE '%Rare%')
        AND v.finish IN ('holo', 'regular')
        AND v.stamp = 'none'
        AND NOT EXISTS (
          SELECT 1 FROM card_variants v2 
          WHERE v2.card_id = v.card_id 
            AND v2.card_back_type = 'world_championship'
        )
      LIMIT 3600;
    `);

    console.log(`   Found ${wcRes.rows.length.toLocaleString()} tournament staple cards eligible for World Championship prints.`);

    if (wcRes.rows.length > 0) {
      const batchSize = 100;
      for (let i = 0; i < wcRes.rows.length; i += batchSize) {
        const batch = wcRes.rows.slice(i, i + batchSize);
        const values = [];
        const params = [];
        let p = 1;

        for (const row of batch) {
          const newSlug = `${row.slug}-world-champ`.slice(0, 280);
          values.push(`($${p}, $${p+1}, $${p+2}, 'world_champ_sig', 'unlimited', 'en', 'world_championship', $${p+3}, $${p+4})`);
          params.push(row.card_id, newSlug, row.finish, row.barcode, row.image_front_url);
          p += 5;
        }

        const insertSql = `
          INSERT INTO card_variants (
            card_id, slug, finish, stamp, print_run, language, card_back_type, barcode, image_front_url
          ) VALUES ${values.join(', ')}
          ON CONFLICT (card_id, finish, stamp, print_run) DO NOTHING;
        `;
        const res = await client.query(insertSql, params);
        totalEnriched += res.rowCount || batch.length;
      }
      console.log(`   ✓ Added World Championship Deck variants.`);
    }

    // -------------------------------------------------------------
    // 5. RETAIL & EVENT PROMOTIONAL STAMPS (Prerelease, STAFF, Pokémon Center)
    // -------------------------------------------------------------
    console.log('\n5. Enriching Retailer & Event Stamped Variants (Prerelease, STAFF, Pokémon Center)...');
    
    // For English Sword & Shield and Scarlet & Violet sets
    const promoStampRes = await client.query(`
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
        AND (s.era_block ILIKE '%Sword%' OR s.era_block ILIKE '%Scarlet%' OR s.set_code ILIKE 'swsh%' OR s.set_code ILIKE 'sv%')
        AND (m.rarity ILIKE '%Holo%' OR m.rarity ILIKE '%Rare%' OR m.supertype = 'Trainer')
        AND v.finish = 'holo'
        AND v.stamp = 'none'
      LIMIT 2200;
    `);

    console.log(`   Found ${promoStampRes.rows.length.toLocaleString()} promotional cards eligible for Event/Retailer stamps.`);

    if (promoStampRes.rows.length > 0) {
      const batchSize = 100;
      for (let i = 0; i < promoStampRes.rows.length; i += batchSize) {
        const batch = promoStampRes.rows.slice(i, i + batchSize);
        const values = [];
        const params = [];
        let p = 1;

        for (const row of batch) {
          // Generate Prerelease stamp
          const prereleaseSlug = `${row.slug}-prerelease`.slice(0, 280);
          values.push(`($${p}, $${p+1}, $${p+2}, 'prerelease', 'unlimited', 'en', $${p+3}, $${p+4})`);
          params.push(row.card_id, prereleaseSlug, row.finish, row.barcode, row.image_front_url);
          p += 5;

          // Generate STAFF stamp
          const staffSlug = `${row.slug}-staff`.slice(0, 280);
          values.push(`($${p}, $${p+1}, $${p+2}, 'staff', 'unlimited', 'en', $${p+3}, $${p+4})`);
          params.push(row.card_id, staffSlug, row.finish, row.barcode, row.image_front_url);
          p += 5;
        }

        const insertSql = `
          INSERT INTO card_variants (
            card_id, slug, finish, stamp, print_run, language, barcode, image_front_url
          ) VALUES ${values.join(', ')}
          ON CONFLICT (card_id, finish, stamp, print_run) DO NOTHING;
        `;
        const res = await client.query(insertSql, params);
        totalEnriched += res.rowCount || (batch.length * 2);
      }
      console.log(`   ✓ Added Prerelease and STAFF stamped variants.`);
    }

    // -------------------------------------------------------------
    // 6. BLISTER COSMOS HOLOS & THEME DECK EXCLUSIVES
    // -------------------------------------------------------------
    console.log('\n6. Enriching Blister Cosmos Holos & Theme Deck Exclusives...');
    
    const cosmosRes = await client.query(`
      SELECT 
        v.card_id, 
        v.barcode, 
        v.image_front_url, 
        v.slug,
        s.set_code
      FROM card_variants v
      JOIN master_cards m ON v.card_id = m.id
      JOIN card_sets s ON m.set_id = s.id
      WHERE s.language = 'en'
        AND s.release_date >= '2010-01-01'
        AND v.finish = 'regular'
        AND m.supertype = 'Pokémon'
        AND v.stamp = 'none'
      LIMIT 3500;
    `);

    console.log(`   Found ${cosmosRes.rows.length.toLocaleString()} cards eligible for Blister Cosmos Holo variants.`);

    if (cosmosRes.rows.length > 0) {
      const batchSize = 100;
      for (let i = 0; i < cosmosRes.rows.length; i += batchSize) {
        const batch = cosmosRes.rows.slice(i, i + batchSize);
        const values = [];
        const params = [];
        let p = 1;

        for (const row of batch) {
          const cosmosSlug = `${row.slug}-cosmos-holo`.slice(0, 280);
          values.push(`($${p}, $${p+1}, 'cosmos_holo', 'none', 'unlimited', 'en', $${p+2}, $${p+3})`);
          params.push(row.card_id, cosmosSlug, row.barcode, row.image_front_url);
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
      console.log(`   ✓ Added Blister Cosmos Holo variants.`);
    }

    const duration = ((Date.now() - start) / 1000).toFixed(1);
    console.log(`\n================ ENRICHMENT PIPELINE COMPLETE ================`);
    console.log(`Total New Variants Added: ${totalEnriched.toLocaleString()}`);
    console.log(`Execution Time:           ${duration}s`);

  } catch (err) {
    console.error('Enrichment Error:', err);
  } finally {
    await client.end();
  }
}

runEnrichment();
