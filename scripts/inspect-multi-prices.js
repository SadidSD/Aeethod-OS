async function inspectPikaPrices() {
  const pricesData = await fetch('https://tcgcsv.com/tcgplayer/3/23237/prices', { headers: { 'User-Agent': 'AeethodOS/1.0.0 (admin@aeethod.internal)' } }).then(r => r.json());
  const pikaPrices = pricesData.results.filter(p => p.productId === 517033);
  console.log('Pikachu 025/165 prices in 151:');
  console.table(pikaPrices);
}

inspectPikaPrices().catch(console.error);
