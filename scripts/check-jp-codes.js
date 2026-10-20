async function checkJp() {
  const res = await fetch('https://tcgcsv.com/tcgplayer/85/groups', {
    headers: { 'User-Agent': 'AeethodOS/1.0.0 (admin@aeethod.internal)' }
  });
  const data = await res.json();
  const searchCodes = ['S12a', 'SV1V', 'S11', 'S10b', 'SV2a', 'SV8a', 'sv3a', 'PMCG1'];
  for (const code of searchCodes) {
    const matched = data.results.filter(g => 
      (g.abbreviation && g.abbreviation.toLowerCase() === code.toLowerCase()) ||
      g.name.toLowerCase().includes(code.toLowerCase())
    );
    console.log(`=== Matches for code "${code}": ===`);
    console.log(matched.map(g => `${g.groupId}: ${g.name} (${g.abbreviation})`));
  }
}

checkJp().catch(console.error);
