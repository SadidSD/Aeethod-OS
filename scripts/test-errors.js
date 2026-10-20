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
    SELECT m.official_name, m.card_number, s.name as set_name, v.finish, v.print_run, v.is_error, v.error_details
    FROM card_variants v
    JOIN master_cards m ON v.card_id = m.id
    JOIN card_sets s ON m.set_id = s.id
    WHERE v.is_error = true
    ORDER BY s.set_code, m.card_number;
  `);
  console.table(res.rows.map(r => ({
    card: `${r.official_name} (#${r.card_number})`,
    set: r.set_name,
    finish: r.finish,
    print_run: r.print_run,
    error: r.error_details
  })));
  await client.end();
}

main().catch(console.error);
