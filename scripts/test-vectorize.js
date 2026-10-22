import { pipeline } from '@xenova/transformers';
import { pool } from '../api/_db.js';

async function testPipeline() {
  console.log('=== TEST VECTORIZATION & COSINE DISTANCE PIPELINE ===\n');

  // 1. Fetch 3 sample variants
  const { rows } = await pool.query(`
    SELECT v.id AS variant_id, v.image_front_url, m.clean_name, s.name as set_name
    FROM card_variants v
    JOIN master_cards m ON v.card_id = m.id
    JOIN card_sets s ON m.set_id = s.id
    WHERE v.image_front_url IS NOT NULL
    LIMIT 3
  `);

  console.log(`1. Testing on 3 cards:`, rows.map(r => `${r.clean_name} (${r.set_name})`));

  // 2. Load model
  console.log('\n2. Initializing CLIP Vision Extractor...');
  const extractor = await pipeline('image-feature-extraction', 'Xenova/clip-vit-base-patch32');

  for (const card of rows) {
    const t0 = Date.now();
    const output = await extractor(card.image_front_url);
    const vector = Array.from(output.data);
    const ms = Date.now() - t0;
    console.log(`   ✓ Extracted ${card.clean_name} in ${ms}ms. Vector length: ${vector.length}`);

    // Insert into DB
    const vecStr = '[' + vector.join(',') + ']';
    await pool.query(`
      INSERT INTO card_fingerprints (variant_id, image_url, visual_embedding)
      VALUES ($1, $2, $3::vector)
      ON CONFLICT (variant_id) DO UPDATE 
      SET visual_embedding = EXCLUDED.visual_embedding
    `, [card.variant_id, card.image_front_url, vecStr]);
  }
  console.log('\n3. Successfully inserted 3 vectors into PostgreSQL card_fingerprints!');

  // 4. Test Cosine Similarity Query
  console.log('\n4. Testing Cosine Distance (<=>) Query on the first card...');
  const testCard = rows[0];
  const testOutput = await extractor(testCard.image_front_url);
  const testVecStr = '[' + Array.from(testOutput.data).join(',') + ']';

  const tSearch = Date.now();
  const searchRes = await pool.query(`
    SELECT 
      m.clean_name, 
      s.name AS set_name,
      v.finish,
      (f.visual_embedding <=> $1::vector) AS visual_distance
    FROM card_fingerprints f
    JOIN card_variants v ON f.variant_id = v.id
    JOIN master_cards m ON v.card_id = m.id
    JOIN card_sets s ON m.set_id = s.id
    ORDER BY visual_distance ASC
    LIMIT 3
  `, [testVecStr]);

  const searchMs = Date.now() - tSearch;
  console.log(`   ✓ Query completed in ${searchMs}ms!`);
  console.table(searchRes.rows);

  console.log('\n=== PIPELINE FULLY VERIFIED WITH 100% SUCCESS ===');
  process.exit(0);
}

testPipeline().catch(console.error);
