async function checkNames() {
  const res = await fetch('https://tcgcsv.com/tcgplayer/3/groups', {
    headers: { 'User-Agent': 'AeethodOS/1.0.0 (admin@aeethod.internal)' }
  });
  const data = await res.json();
  const searchTerms = ['promo', 'ruby', 'pearl', 'best of', 'trainer kit'];
  for (const term of searchTerms) {
    const matched = data.results.filter(g => g.name.toLowerCase().includes(term));
    console.log(`=== Matches for "${term}": ===`);
    console.log(matched.map(g => `${g.groupId}: ${g.name} (${g.abbreviation})`));
  }
}

checkNames().catch(console.error);
