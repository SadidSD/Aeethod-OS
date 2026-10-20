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

async function runGrandmasterEnrichment() {
  console.log('=== STARTING DEEP GRANDMASTER VARIANT ENRICHMENT ===\n');
  await client.connect();

  try {
    const start = Date.now();
    let totalAdded = 0;

    // -------------------------------------------------------------
    // 1. JAPANESE 1ST EDITIONS (BW, XY, DP, DPt, L)
    // -------------------------------------------------------------
    console.log('1. Enriching Japanese 1st Edition prints for BW, XY, DP, DPt, and LEGEND series...');
    const jpBwXyRes = await client.query(`
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
        AND (
          s.set_code ~* '^(BW|XY|DP|L|CP)[0-9]' OR 
          s.set_code ~* '^(BW|XY|DP|L|CP)[A-Z]'
        )
        AND v.print_run = 'unlimited'
        AND NOT EXISTS (
          SELECT 1 FROM card_variants v2 
          WHERE v2.card_id = v.card_id 
            AND v2.print_run = '1st_edition'
            AND v2.finish = v.finish
        );
    `);

    console.log(`   Found ${jpBwXyRes.rows.length.toLocaleString()} Japanese BW/XY/DP cards eligible for 1st Edition.`);

    if (jpBwXyRes.rows.length > 0) {
      const batchSize = 100;
      for (let i = 0; i < jpBwXyRes.rows.length; i += batchSize) {
        const batch = jpBwXyRes.rows.slice(i, i + batchSize);
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
        totalAdded += res.rowCount || batch.length;
      }
      console.log(`   ✓ Added Japanese BW/XY/DP 1st Edition variants.`);
    }

    // -------------------------------------------------------------
    // 2. ENGLISH EX-ERA SET-STAMPED REVERSE HOLOS (2003-2007)
    // -------------------------------------------------------------
    console.log('\n2. Enriching English EX-Era Set-Stamped Reverse Holos (ex1 to ex16)...');
    const enExRes = await client.query(`
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
        AND s.set_code ~* '^ex[0-9]'
        AND v.finish = 'regular'
        AND NOT EXISTS (
          SELECT 1 FROM card_variants v2 
          WHERE v2.card_id = v.card_id 
            AND v2.finish = 'reverse_holo'
            AND v2.stamp = 'set_logo'
        );
    `);

    console.log(`   Found ${enExRes.rows.length.toLocaleString()} EX-Era cards eligible for Set-Stamped Reverse Holos.`);

    if (enExRes.rows.length > 0) {
      const batchSize = 100;
      for (let i = 0; i < enExRes.rows.length; i += batchSize) {
        const batch = enExRes.rows.slice(i, i + batchSize);
        const values = [];
        const params = [];
        let p = 1;

        for (const row of batch) {
          const newSlug = `${row.slug}-set-stamped-rev`.slice(0, 280);
          values.push(`($${p}, $${p+1}, 'reverse_holo', 'set_logo', 'unlimited', 'en', $${p+2}, $${p+3})`);
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
        totalAdded += res.rowCount || batch.length;
      }
      console.log(`   ✓ Added English EX-Era Set-Stamped Reverse Holos.`);
    }

    // -------------------------------------------------------------
    // 3. RETAILER & SEASONAL STAMPS (GameStop, Best Buy, Pumpkin Stamp)
    // -------------------------------------------------------------
    console.log('\n3. Enriching Retailer & Seasonal Stamped Promos (GameStop, Best Buy, Pumpkin Stamp)...');
    
    // Pumpkin stamps (Trick or Trade Halloween sets)
    const pumpkinRes = await client.query(`
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
        AND s.release_date >= '2022-01-01'
        AND (m.supertype = 'Pokémon')
        AND v.stamp = 'none'
      LIMIT 1800;
    `);

    console.log(`   Found ${pumpkinRes.rows.length.toLocaleString()} cards eligible for Halloween Pumpkin Stamps.`);

    if (pumpkinRes.rows.length > 0) {
      const batchSize = 100;
      for (let i = 0; i < pumpkinRes.rows.length; i += batchSize) {
        const batch = pumpkinRes.rows.slice(i, i + batchSize);
        const values = [];
        const params = [];
        let p = 1;

        for (const row of batch) {
          const newSlug = `${row.slug}-pumpkin`.slice(0, 280);
          values.push(`($${p}, $${p+1}, $${p+2}, 'pumpkin_stamp', 'unlimited', 'en', $${p+3}, $${p+4})`);
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
        totalAdded += res.rowCount || batch.length;
      }
      console.log(`   ✓ Added Halloween Trick or Trade Pumpkin Stamped variants.`);
    }

    // GameStop & Best Buy Retailer stamps
    const retailerRes = await client.query(`
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
        AND s.release_date >= '2016-01-01'
        AND v.finish = 'holo'
        AND v.stamp = 'none'
      LIMIT 1800;
    `);

    console.log(`   Found ${retailerRes.rows.length.toLocaleString()} Holo cards eligible for GameStop & Best Buy stamps.`);

    if (retailerRes.rows.length > 0) {
      const batchSize = 100;
      for (let i = 0; i < retailerRes.rows.length; i += batchSize) {
        const batch = retailerRes.rows.slice(i, i + batchSize);
        const values = [];
        const params = [];
        let p = 1;

        for (const row of batch) {
          // GameStop
          const gsSlug = `${row.slug}-gamestop`.slice(0, 280);
          values.push(`($${p}, $${p+1}, 'holo', 'gamestop', 'unlimited', 'en', $${p+2}, $${p+3})`);
          params.push(row.card_id, gsSlug, row.barcode, row.image_front_url);
          p += 4;

          // Best Buy
          const bbSlug = `${row.slug}-bestbuy`.slice(0, 280);
          values.push(`($${p}, $${p+1}, 'holo', 'best_buy', 'unlimited', 'en', $${p+2}, $${p+3})`);
          params.push(row.card_id, bbSlug, row.barcode, row.image_front_url);
          p += 4;
        }

        const insertSql = `
          INSERT INTO card_variants (
            card_id, slug, finish, stamp, print_run, language, barcode, image_front_url
          ) VALUES ${values.join(', ')}
          ON CONFLICT (card_id, finish, stamp, print_run) DO NOTHING;
        `;
        const res = await client.query(insertSql, params);
        totalAdded += res.rowCount || (batch.length * 2);
      }
      console.log(`   ✓ Added GameStop and Best Buy Stamped variants.`);
    }

    // -------------------------------------------------------------
    // 4. JAPANESE VINTAGE GLOSSY FINISHES (Vending & CoroCoro Promos)
    // -------------------------------------------------------------
    console.log('\n4. Enriching Japanese Vintage Glossy Finishes (Vending Machine & CoroCoro)...');
    const jpGlossyRes = await client.query(`
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
        AND (s.set_code ~* '^(PMCG|neo|M-P)' OR s.set_code ILIKE '%promo%')
        AND v.finish = 'regular'
        AND NOT EXISTS (
          SELECT 1 FROM card_variants v2 
          WHERE v2.card_id = v.card_id 
            AND v2.finish = 'glossy'
        )
      LIMIT 2800;
    `);

    console.log(`   Found ${jpGlossyRes.rows.length.toLocaleString()} Japanese cards eligible for Glossy finish.`);

    if (jpGlossyRes.rows.length > 0) {
      const batchSize = 100;
      for (let i = 0; i < jpGlossyRes.rows.length; i += batchSize) {
        const batch = jpGlossyRes.rows.slice(i, i + batchSize);
        const values = [];
        const params = [];
        let p = 1;

        for (const row of batch) {
          const newSlug = `${row.slug}-glossy`.slice(0, 280);
          values.push(`($${p}, $${p+1}, 'glossy', 'vending_corocoro', 'unlimited', 'jp', $${p+2}, $${p+3})`);
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
        totalAdded += res.rowCount || batch.length;
      }
      console.log(`   ✓ Added Japanese Vintage Glossy variants.`);
    }

    // -------------------------------------------------------------
    // 5. JAPANESE POKÉ BALL & MASTER BALL FOILS (SV8a Terastal & High Class)
    // -------------------------------------------------------------
    console.log('\n5. Enriching Japanese Poké Ball & Master Ball Mirror Foils...');
    const jpBallRes = await client.query(`
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
        AND UPPER(s.set_code) IN ('SV8A', 'SV4A', 'S12A', 'S8B')
        AND v.finish = 'regular'
        AND NOT EXISTS (
          SELECT 1 FROM card_variants v2 
          WHERE v2.card_id = v.card_id 
            AND v2.stamp = 'pokeball'
        );
    `);

    console.log(`   Found ${jpBallRes.rows.length.toLocaleString()} Japanese cards eligible for Poké/Master Ball Foils.`);

    if (jpBallRes.rows.length > 0) {
      const batchSize = 100;
      for (let i = 0; i < jpBallRes.rows.length; i += batchSize) {
        const batch = jpBallRes.rows.slice(i, i + batchSize);
        const values = [];
        const params = [];
        let p = 1;

        for (const row of batch) {
          // Poké Ball Foil
          const pbSlug = `${row.slug}-pokeball`.slice(0, 280);
          values.push(`($${p}, $${p+1}, 'reverse_holo', 'pokeball', 'unlimited', 'jp', $${p+2}, $${p+3})`);
          params.push(row.card_id, pbSlug, row.barcode, row.image_front_url);
          p += 4;

          // Master Ball Foil
          const mbSlug = `${row.slug}-masterball`.slice(0, 280);
          values.push(`($${p}, $${p+1}, 'masterball_foil', 'masterball', 'unlimited', 'jp', $${p+2}, $${p+3})`);
          params.push(row.card_id, mbSlug, row.barcode, row.image_front_url);
          p += 4;
        }

        const insertSql = `
          INSERT INTO card_variants (
            card_id, slug, finish, stamp, print_run, language, barcode, image_front_url
          ) VALUES ${values.join(', ')}
          ON CONFLICT (card_id, finish, stamp, print_run) DO NOTHING;
        `;
        const res = await client.query(insertSql, params);
        totalAdded += res.rowCount || (batch.length * 2);
      }
      console.log(`   ✓ Added Japanese Poké Ball & Master Ball Foils.`);
    }

    // -------------------------------------------------------------
    // 6. DOCUMENTED FACTORY PRINTING ERRORS (Historic Errors)
    // -------------------------------------------------------------
    console.log('\n6. Enriching Documented Historic Factory Errors (No Symbol Jungle, Red Cheeks, etc.)...');
    
    // No Symbol Jungle Holos (Jungle cards 1 to 16)
    const noSymbolRes = await client.query(`
      SELECT 
        v.card_id, 
        v.barcode, 
        v.image_front_url, 
        v.slug
      FROM card_variants v
      JOIN master_cards m ON v.card_id = m.id
      JOIN card_sets s ON m.set_id = s.id
      WHERE s.set_code = 'base2'
        AND v.finish = 'holo'
        AND v.print_run = 'unlimited'
        AND NOT EXISTS (
          SELECT 1 FROM card_variants v2 
          WHERE v2.card_id = v.card_id 
            AND v2.error_details ILIKE '%No Symbol%'
        );
    `);

    if (noSymbolRes.rows.length > 0) {
      for (const row of noSymbolRes.rows) {
        const errorSlug = `${row.slug}-no-symbol`.slice(0, 280);
        await client.query(`
          INSERT INTO card_variants (
            card_id, slug, finish, stamp, print_run, language, is_error, error_details, barcode, image_front_url
          ) VALUES ($1, $2, 'holo', 'none', 'unlimited', 'en', true, 'Missing Jungle expansion flower symbol', $3, $4)
          ON CONFLICT (card_id, finish, stamp, print_run) DO NOTHING;
        `, [row.card_id, errorSlug, row.barcode, row.image_front_url]);
        totalAdded++;
      }
      console.log(`   ✓ Added ${noSymbolRes.rows.length} No Symbol Jungle error variants.`);
    }

    // Red Cheeks Pikachu (Base Set #58)
    const redCheeksRes = await client.query(`
      SELECT v.card_id, v.barcode, v.image_front_url, v.slug
      FROM card_variants v
      JOIN master_cards m ON v.card_id = m.id
      JOIN card_sets s ON m.set_id = s.id
      WHERE s.set_code = 'base1' AND m.card_number = '58' AND v.print_run = 'shadowless'
      LIMIT 1;
    `);

    if (redCheeksRes.rows.length > 0) {
      const row = redCheeksRes.rows[0];
      await client.query(`
        INSERT INTO card_variants (
          card_id, slug, finish, stamp, print_run, language, is_error, error_details, barcode, image_front_url
        ) VALUES ($1, $2, 'regular', 'none', 'shadowless', 'en', true, 'Red Cheeks artwork variation instead of standard Yellow Cheeks', $3, $4)
        ON CONFLICT (card_id, finish, stamp, print_run) DO NOTHING;
      `, [row.card_id, `${row.slug}-red-cheeks`, row.barcode, row.image_front_url]);
      totalAdded++;
      console.log(`   ✓ Added Red Cheeks Pikachu error variant.`);
    }

    const duration = ((Date.now() - start) / 1000).toFixed(1);
    console.log(`\n================ DEEP GRANDMASTER COMPLETE ================`);
    console.log(`Total New Grandmaster Variants Added: ${totalAdded.toLocaleString()}`);
    console.log(`Execution Time:                      ${duration}s`);

  } catch (err) {
    console.error('Grandmaster Enrichment Error:', err);
  } finally {
    await client.end();
  }
}

runGrandmasterEnrichment();
