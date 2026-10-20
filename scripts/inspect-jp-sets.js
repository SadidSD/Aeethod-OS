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

async function run() {
  await client.connect();
  const res = await client.query("SELECT id, set_code, name, era_block FROM card_sets WHERE language = 'jp' AND set_code ILIKE '%sv%' LIMIT 15");
  console.table(res.rows);

  const swordShield = await client.query("SELECT id, set_code, name, era_block FROM card_sets WHERE language = 'jp' AND set_code ILIKE '%s1%' LIMIT 15");
  console.table(swordShield.rows);

  await client.end();
}

run().catch(console.error);
