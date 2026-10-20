const { Client } = require('pg');
require('dotenv').config({ path: '.env' });

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  await client.connect();
  const res = await client.query("SELECT id, set_code, slug, name, language, total_printed_cards FROM card_sets WHERE language = 'jp' ORDER BY name LIMIT 25");
  console.log(`Found ${res.rows.length} sample JP sets:`);
  console.table(res.rows);

  const totalRes = await client.query("SELECT language, count(*) FROM card_sets GROUP BY language");
  console.table(totalRes.rows);

  await client.end();
}

run().catch(console.error);
