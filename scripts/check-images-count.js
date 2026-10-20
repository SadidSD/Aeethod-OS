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
  const res = await client.query(`
    SELECT language, count(*) as total, count(image_front_url) as with_images 
    FROM card_variants 
    GROUP BY language
  `);
  console.table(res.rows);
  await client.end();
}

run().catch(console.error);
