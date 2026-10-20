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
  const res = await client.query(`
    SELECT DISTINCT era_block, count(m.id) as card_count
    FROM card_sets s
    JOIN master_cards m ON m.set_id = s.id
    WHERE s.language = 'jp'
    GROUP BY era_block;
  `);
  console.table(res.rows);
  await client.end();
}

main().catch(console.error);
