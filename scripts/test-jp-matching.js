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
    .replace(/^pokemon\s+(japan\s+)?/i, '')
    .replace(/^pokémon\s+(japan\s+)?/i, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

async function testJp() {
  await client.connect();
  const dbSetsRes = await client.query("SELECT id, set_code, name, slug FROM card_sets WHERE language = 'jp'");
  const dbSets = dbSetsRes.rows;
  console.log(`Loaded ${dbSets.length} Japanese sets from Supabase.`);

  const res = await fetch('https://tcgcsv.com/tcgplayer/85/groups', {
    headers: { 'User-Agent': 'AeethodOS/1.0.0 (admin@aeethod.internal)' }
  });
  const tcgGroups = (await res.json()).results;
  console.log(`Loaded ${tcgGroups.length} Japanese groups from TCGCSV.`);

  let matched = 0;
  const matchedList = [];
  const unmatched = [];

  for (const dbSet of dbSets) {
    const normDbName = normalize(dbSet.name);
    const normDbCode = normalize(dbSet.set_code);

    const found = tcgGroups.find(g => {
      const normGroup = normalize(g.name);
      const normAbbr = normalize(g.abbreviation);
      return (
        normGroup === normDbName ||
        (normAbbr && (normAbbr === normDbCode || normDbCode.includes(normAbbr))) ||
        (normGroup.includes(normDbName) && normDbName.length > 3) ||
        (normDbName.includes(normGroup) && normGroup.length > 3)
      );
    });

    if (found) {
      matched++;
      matchedList.push({ db: dbSet.name, tcg: found.name, abbr: found.abbreviation });
    } else {
      unmatched.push(dbSet);
    }
  }

  console.log(`Matched: ${matched} / ${dbSets.length} Japanese sets (${((matched / dbSets.length) * 100).toFixed(1)}%)`);
  console.log(`Sample matches (first 10):`, matchedList.slice(0, 10));
  console.log(`Sample unmatched (first 10):`, unmatched.slice(0, 10).map(s => `${s.set_code}: ${s.name}`));

  await client.end();
}

testJp().catch(console.error);
