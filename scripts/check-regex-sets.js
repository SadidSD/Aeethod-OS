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
    SELECT set_code, name, count(m.id) as cards
    FROM card_sets s
    JOIN master_cards m ON m.set_id = s.id
    WHERE s.language = 'jp'
      AND (
        set_code ~* '^(BW|XY|DP|PCG|ADV|L|E)[0-9]' OR
        set_code ~* '^(SM|S|SV)[0-9]'
      )
    GROUP BY set_code, name
    ORDER BY set_code
    LIMIT 40;
  `);
  console.table(res.rows);
  await client.end();
}

main().catch(console.error);
