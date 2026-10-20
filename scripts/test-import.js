import fs from 'fs';
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

async function main() {
  await client.connect();
  console.log('Connected to DB!');
  const countRes = await client.query('SELECT count(*) FROM card_sets;');
  console.log('Current card_sets count:', countRes.rows[0].count);

  const cardCountRes = await client.query('SELECT count(*) FROM master_cards;');
  console.log('Current master_cards count:', cardCountRes.rows[0].count);

  await client.end();
}

main().catch(console.error);
