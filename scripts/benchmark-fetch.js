async function benchmark() {
  const start = Date.now();
  const testGroups = [
    { cat: 3, id: 604 },    // Base Set
    { cat: 3, id: 1663 },   // Base Set Shadowless
    { cat: 3, id: 605 },    // Base Set 2
    { cat: 3, id: 22873 },  // SV01
    { cat: 3, id: 23237 },  // SV 151
    { cat: 85, id: 23645 }, // S12a VSTAR Universe
    { cat: 85, id: 23606 }, // SV1V Violet ex
    { cat: 85, id: 23599 }, // SV2a 151
    { cat: 85, id: 23730 }, // Base Expansion Pack JP
    { cat: 85, id: 23722 }  // Jungle JP
  ];
  console.log(`Testing batch fetch of ${testGroups.length} groups...`);

  const results = await Promise.all(testGroups.map(async ({ cat, id }) => {
    const [pRes, prRes] = await Promise.all([
      fetch(`https://tcgcsv.com/tcgplayer/${cat}/${id}/products`, { headers: { 'User-Agent': 'AeethodOS/1.0.0 (admin@aeethod.internal)' } }),
      fetch(`https://tcgcsv.com/tcgplayer/${cat}/${id}/prices`, { headers: { 'User-Agent': 'AeethodOS/1.0.0 (admin@aeethod.internal)' } })
    ]);
    if (!pRes.ok || !prRes.ok) {
      return { id, cat, status: `${pRes.status}/${prRes.status}` };
    }
    const prods = await pRes.json();
    const prices = await prRes.json();
    return { id, cat, prods: prods.results.length, prices: prices.results.length };
  }));

  console.log(`Fetched ${results.length} groups in ${Date.now() - start}ms.`);
  console.table(results);
}

benchmark().catch(console.error);
