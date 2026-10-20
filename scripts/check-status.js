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
  console.log('--- DATABASE STATUS ---');
  
  const setsRes = await client.query('SELECT count(*), language FROM card_sets GROUP BY language;');
  console.log('Sets by language:');
  console.table(setsRes.rows);

  const cardsRes = await client.query(`
    SELECT count(*), s.language 
    FROM master_cards m
    JOIN card_sets s ON m.set_id = s.id
    GROUP BY s.language;
  `);
  console.log('Master Cards by language:');
  console.table(cardsRes.rows);

  const varRes = await client.query(`
    SELECT count(*), language 
    FROM card_variants 
    GROUP BY language;
  `);
  console.log('Variants by language:');
  console.table(varRes.rows);

  await client.end();
}

main().catch(console.error);
