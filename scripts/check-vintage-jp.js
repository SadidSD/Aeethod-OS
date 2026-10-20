async function checkVintageJp() {
  const res = await fetch('https://tcgcsv.com/tcgplayer/85/groups', {
    headers: { 'User-Agent': 'AeethodOS/1.0.0 (admin@aeethod.internal)' }
  });
  const data = await res.json();
  const searchTerms = ['base', 'jungle', 'fossil', 'rocket', 'neo', 'web', 'vs', 'vending', 'gym'];
  for (const term of searchTerms) {
    const matched = data.results.filter(g => g.name.toLowerCase().includes(term));
    console.log(`=== Matches for "${term}": ===`);
    console.log(matched.map(g => `${g.groupId}: ${g.name} (${g.abbreviation})`));
  }
}

checkVintageJp().catch(console.error);
