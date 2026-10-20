import fs from 'fs';
import path from 'path';

const CACHE_DIR = path.resolve('data/tcgplayer_cache');

async function fetchWithRetry(url, retries = 3, delay = 500) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'AeethodOS/1.0.0 (admin@aeethod.internal)' }
      });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      return await res.json();
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(r => setTimeout(r, delay * (i + 1)));
    }
  }
}

async function cacheCategory(catId, catName) {
  const catDir = path.join(CACHE_DIR, `cat_${catId}`);
  fs.mkdirSync(catDir, { recursive: true });

  console.log(`\n=== Fetching Groups for Category ${catId} (${catName}) ===`);
  const groupsUrl = `https://tcgcsv.com/tcgplayer/${catId}/groups`;
  const groupsData = await fetchWithRetry(groupsUrl);
  if (!groupsData || !groupsData.results) {
    console.error(`Failed to fetch groups for Category ${catId}`);
    return;
  }

  const groups = groupsData.results;
  fs.writeFileSync(path.join(catDir, 'groups.json'), JSON.stringify(groups, null, 2));
  console.log(`Saved ${groups.length} groups to groups.json.`);

  let downloaded = 0;
  let skipped = 0;
  const concurrency = 8;

  for (let i = 0; i < groups.length; i += concurrency) {
    const batch = groups.slice(i, i + concurrency);
    await Promise.all(batch.map(async (g) => {
      const prodPath = path.join(catDir, `${g.groupId}_products.json`);
      const pricePath = path.join(catDir, `${g.groupId}_prices.json`);

      // Check if already cached
      if (fs.existsSync(prodPath) && fs.existsSync(pricePath)) {
        skipped++;
        return;
      }

      try {
        const [prods, prices] = await Promise.all([
          fetchWithRetry(`https://tcgcsv.com/tcgplayer/${catId}/${g.groupId}/products`),
          fetchWithRetry(`https://tcgcsv.com/tcgplayer/${catId}/${g.groupId}/prices`)
        ]);

        if (prods && prods.results) {
          fs.writeFileSync(prodPath, JSON.stringify(prods.results));
        }
        if (prices && prices.results) {
          fs.writeFileSync(pricePath, JSON.stringify(prices.results));
        }
        downloaded++;
      } catch (err) {
        console.error(`Error fetching group ${g.groupId} (${g.name}):`, err.message);
      }
    }));

    if ((i + concurrency) % 40 === 0 || i + concurrency >= groups.length) {
      console.log(`Progress [Cat ${catId}]: ${Math.min(i + concurrency, groups.length)} / ${groups.length} groups (Downloaded: ${downloaded}, Cached: ${skipped})`);
    }
  }

  console.log(`Category ${catId} complete! (New downloads: ${downloaded}, Pre-cached: ${skipped})`);
}

async function main() {
  const start = Date.now();
  console.log('Starting TCGplayer complete market pricing sync...');

  // Category 3 = English Pokemon
  await cacheCategory(3, 'Pokemon (English)');

  // Category 85 = Japanese Pokemon
  await cacheCategory(85, 'Pokemon Japan');

  console.log(`\nAll pricing feeds successfully downloaded and cached in ${((Date.now() - start) / 1000).toFixed(1)}s!`);
}

main().catch(console.error);
