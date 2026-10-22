import { pipeline } from '@xenova/transformers';
import { pool } from '../api/_db.js';

async function main() {
  console.log('=== AEETHOD OS: LIVE HIGH-THROUGHPUT CATALOG VECTORIZER ===\n');

  // Pre-warm connection pool
  await pool.query('SELECT 1');

  // Load CLIP model once
  console.log('1. Loading CLIP Vision Extractor...');
  const extractor = await pipeline('image-feature-extraction', 'Xenova/clip-vit-base-patch32');
  console.log('   ✓ CLIP model resident in memory.');

  // Total status check
  const totalStats = await pool.query(`
    SELECT 
      (SELECT COUNT(*) FROM card_variants WHERE image_front_url IS NOT NULL AND image_front_url != '') as total_target,
      (SELECT COUNT(*) FROM card_fingerprints) as already_done
  `);
  const totalTarget = parseInt(totalStats.rows[0].total_target);
  let totalDone = parseInt(totalStats.rows[0].already_done);
  console.log(`\n2. Catalog Status: ${totalDone} / ${totalTarget} variants vectorized (${((totalDone / totalTarget) * 100).toFixed(1)}%).`);

  const startTime = Date.now();
  let sessionVariants = 0;
  let sessionImages = 0;
  let failedImagesCount = 0;
  const BATCH_SIZE = 50;

  // Keyset cursor pagination by UUID
  let lastSeenId = '00000000-0000-0000-0000-000000000000';

  console.log('\n3. Starting keyset streaming pipeline...\n');

  while (true) {
    const batchT0 = Date.now();

    // Fetch next batch using keyset pagination (v.id > lastSeenId)
    const { rows } = await pool.query(`
      SELECT v.id AS variant_id, v.image_front_url
      FROM card_variants v
      LEFT JOIN card_fingerprints f ON v.id = f.variant_id
      WHERE v.id > $1 
        AND f.id IS NULL 
        AND v.image_front_url IS NOT NULL 
        AND v.image_front_url != ''
      ORDER BY v.id ASC
      LIMIT $2
    `, [lastSeenId, BATCH_SIZE]);

    if (!rows || rows.length === 0) {
      console.log('\n✅ Reached end of catalog! Keyset streaming complete.');
      break;
    }

    // Always advance the keyset cursor forward so we NEVER get stuck on 404s
    lastSeenId = rows[rows.length - 1].variant_id;

    // Deduplicate unique image URLs in this batch
    const urlMap = new Map();
    for (const r of rows) {
      if (!urlMap.has(r.image_front_url)) {
        urlMap.set(r.image_front_url, []);
      }
      urlMap.get(r.image_front_url).push(r.variant_id);
    }

    const uniqueUrls = Array.from(urlMap.keys());

    // Extract vectors in parallel
    const extractResults = await Promise.allSettled(
      uniqueUrls.map(async (url) => {
        const out = await extractor(url);
        return {
          url,
          vector: Array.from(out.data)
        };
      })
    );

    // Build multi-row bulk insert
    const insertValues = [];
    const params = [];
    let pIdx = 1;

    for (const res of extractResults) {
      if (res.status === 'fulfilled') {
        const { url, vector } = res.value;
        const variantIds = urlMap.get(url) || [];
        const vecStr = '[' + vector.join(',') + ']';

        for (const vid of variantIds) {
          insertValues.push(`($${pIdx}, $${pIdx + 1}, $${pIdx + 2}::vector)`);
          params.push(vid, url, vecStr);
          pIdx += 3;
          sessionVariants++;
          totalDone++;
        }
        sessionImages++;
      } else {
        failedImagesCount++;
        const failedUrl = res.reason?.url || 'unknown';
        console.warn(`   [Skip 404] Remote image missing: ${failedUrl.slice(0, 55)}...`);
      }
    }

    // Flush batch to DB
    if (insertValues.length > 0) {
      const sql = `
        INSERT INTO card_fingerprints (variant_id, image_url, visual_embedding)
        VALUES ${insertValues.join(', ')}
        ON CONFLICT (variant_id) DO NOTHING;
      `;
      try {
        await pool.query(sql, params);
      } catch (dbErr) {
        console.error('   [DB Error] Batch write failed:', dbErr.message);
      }
    }

    // Calculate metrics
    const batchElapsedMs = Date.now() - batchT0;
    const totalElapsedSec = (Date.now() - startTime) / 1000;
    const speedVariantsPerSec = (sessionVariants / totalElapsedSec).toFixed(1);
    const speedImagesPerSec = (sessionImages / totalElapsedSec).toFixed(1);
    const pct = ((totalDone / totalTarget) * 100).toFixed(2);
    const remaining = totalTarget - totalDone;
    const etaMin = speedVariantsPerSec > 0 ? (remaining / speedVariantsPerSec / 60).toFixed(1) : '?';

    console.log(
      `[${pct}%] ${totalDone}/${totalTarget} variants | ` +
      `Batch: ${rows.length} vars (${uniqueUrls.length} imgs) in ${batchElapsedMs}ms | ` +
      `Speed: ${speedVariantsPerSec} var/s (${speedImagesPerSec} img/s) | ` +
      `ETA: ${etaMin} min | ` +
      `Skips: ${failedImagesCount}`
    );
  }

  const finalMin = ((Date.now() - startTime) / 60000).toFixed(1);
  console.log(`\n=== CATALOG VECTORIZATION RUN FINISHED IN ${finalMin} MINUTES ===`);
  console.log(`Total Variants Done: ${totalDone}`);
  console.log(`Total 404 Images Skipped: ${failedImagesCount}`);
  process.exit(0);
}

main().catch(err => {
  console.error('Fatal runner error:', err);
  process.exit(1);
});
