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
    SELECT count(m.id) as eligible_1ed_cards
    FROM card_sets s
    JOIN master_cards m ON m.set_id = s.id
    WHERE s.language = 'jp'
      AND (
        s.set_code ILIKE 'ADV%' OR
        s.set_code ILIKE 'PCG%' OR
        s.set_code ILIKE 'DP%' OR
        s.set_code ILIKE 'L%' OR
        s.set_code ILIKE 'BW%' OR
        s.set_code ILIKE 'XY%' OR
        s.set_code ILIKE 'E%'
      );
  `);
  console.log('Eligible Japanese 1ED cards by set_code pattern:', res.rows[0].eligible_1ed_cards);
  await client.end();
}

main().catch(console.error);
