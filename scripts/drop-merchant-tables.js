import pg from 'pg';
const { Client } = pg;

const client = new Client({
  host: 'aws-0-us-east-1.pooler.supabase.com',
  port: 5432,
  user: 'postgres.hwwspxwrctxiiutujmlh',
  password: 'itsyourSD@123',
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  await client.connect();
  console.log('Dropping inventory_items, merchant_members, and merchants...');
  await client.query('DROP TABLE IF EXISTS inventory_items CASCADE;');
  await client.query('DROP TABLE IF EXISTS merchant_members CASCADE;');
  await client.query('DROP TABLE IF EXISTS merchants CASCADE;');
  
  const res = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
    ORDER BY table_name;
  `);
  console.log('Current remaining tables in database:');
  console.log(res.rows.map(r => r.table_name));
  await client.end();
}

run().catch(console.error);
