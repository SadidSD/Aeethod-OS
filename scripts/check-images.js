import pg from 'pg';
const client = new pg.Client({
  host: 'aws-0-us-east-1.pooler.supabase.com',
  port: 5432,
  user: 'postgres.hwwspxwrctxiiutujmlh',
  password: 'itsyourSD@123',
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  await client.connect();
  const vRes = await client.query(`SELECT image_front_url, image_back_url FROM card_variants WHERE image_front_url IS NOT NULL LIMIT 5`);
  console.log('Sample variant images:', vRes.rows);

  const mRes = await client.query(`SELECT game_metadata FROM master_cards LIMIT 5`);
  console.log('Sample master card metadata:', mRes.rows);

  await client.end();
}

run().catch(console.error);
