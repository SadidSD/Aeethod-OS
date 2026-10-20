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

  console.log('--- JAPANESE PIKACHU SEARCH ---');
  const jpPika = await client.query(`
    SELECT s.name AS set_name, s.set_code, s.language, m.official_name, m.card_number, v.finish, v.image_front_url
    FROM card_variants v
    JOIN master_cards m ON v.card_id = m.id
    JOIN card_sets s ON m.set_id = s.id
    WHERE s.language = 'jp' AND m.official_name LIKE '%ピカチュウ%'
    LIMIT 5;
  `);
  console.table(jpPika.rows);

  console.log('--- JAPANESE CHARIZARD (リザードン) SEARCH ---');
  const jpZard = await client.query(`
    SELECT s.name AS set_name, s.set_code, s.language, m.official_name, m.card_number, v.finish, v.image_front_url
    FROM card_variants v
    JOIN master_cards m ON v.card_id = m.id
    JOIN card_sets s ON m.set_id = s.id
    WHERE s.language = 'jp' AND m.official_name LIKE '%リザードン%'
    LIMIT 5;
  `);
  console.table(jpZard.rows);

  await client.end();
}

main().catch(console.error);
