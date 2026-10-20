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
  const cols = await client.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'card_variants'
    ORDER BY ordinal_position
  `);
  console.log('Columns of card_variants:');
  console.table(cols.rows);

  const sample = await client.query(`
    SELECT v.id as variant_id, v.finish, v.stamp, v.print_run, v.card_back_type, m.card_number, m.clean_name, s.set_code, s.name as set_name, s.language
    FROM card_variants v
    JOIN master_cards m ON v.card_id = m.id
    JOIN card_sets s ON m.set_id = s.id
    LIMIT 5
  `);
  console.log('Sample card_variants:');
  console.table(sample.rows);

  await client.end();
}

run().catch(console.error);
