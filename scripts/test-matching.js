import pg from 'pg';
const { Client } = pg;

const client = new Client({
  host: 'aws-0-us-east-1.pooler.supabase.com',
  port: 5432,
  user: 'postgres.hwwspxwrctxiiutujmlh',
  database: 'postgres',
  password: 'itsyourSD@123',
  ssl: { rejectUnauthorized: false }
});

function normalize(str) {
  return (str || '')
    .toLowerCase()
    .replace(/^pokemon\s+/i, '')
    .replace(/^pokémon\s+/i, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

async function testMatching() {
  await client.connect();
  const dbSetsRes = await client.query("SELECT id, set_code, name, slug FROM card_sets WHERE language = 'en'");
  const dbSets = dbSetsRes.rows;
  console.log(`Loaded ${dbSets.length} English sets from Supabase.`);

  const res = await fetch('https://tcgcsv.com/tcgplayer/3/groups', {
    headers: { 'User-Agent': 'AeethodOS/1.0.0 (admin@aeethod.internal)' }
  });
  const tcgGroups = (await res.json()).results;
  console.log(`Loaded ${tcgGroups.length} English groups from TCGCSV.`);

  let matched = 0;
  const unmatchedDb = [];

  for (const dbSet of dbSets) {
    const normDbName = normalize(dbSet.name);
    const normDbCode = normalize(dbSet.set_code);

    const found = tcgGroups.find(g => {
      const normGroup = normalize(g.name);
      const normAbbr = normalize(g.abbreviation);
      return (
        normGroup === normDbName ||
        normGroup.includes(normDbName) ||
        normDbName.includes(normGroup) ||
        (normAbbr && normAbbr === normDbCode)
      );
    });

    if (found) {
      matched++;
    } else {
      unmatchedDb.push(dbSet);
    }
  }

  console.log(`Matched: ${matched} / ${dbSets.length} sets (${((matched / dbSets.length) * 100).toFixed(1)}%)`);
  if (unmatchedDb.length > 0) {
    console.log(`First 10 unmatched sets:`, unmatchedDb.slice(0, 10).map(s => s.name));
  }

  await client.end();
}

testMatching().catch(console.error);
