import fs from 'fs';
import path from 'path';
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
    SELECT 
      s.id,
      s.set_code,
      s.slug,
      s.name,
      s.language,
      s.era_block,
      s.release_date,
      s.total_printed_cards,
      count(DISTINCT m.id) as actual_card_count,
      count(DISTINCT v.id) as variant_count,
      COALESCE(sum(p.tcgplayer_market_cents), 0) as total_valuation_cents
    FROM card_sets s
    LEFT JOIN master_cards m ON m.set_id = s.id
    LEFT JOIN card_variants v ON v.card_id = m.id
    LEFT JOIN card_market_prices p ON p.variant_id = v.id
    GROUP BY s.id
    ORDER BY s.release_date DESC NULLS LAST, s.name ASC
  `);

  console.log(`Fetched ${res.rows.length} sets.`);
  const outputPath = path.resolve('src/data/prebundledSets.json');
  fs.writeFileSync(outputPath, JSON.stringify(res.rows));
  const stats = fs.statSync(outputPath);
  console.log(`Saved pre-bundled sets JSON to ${outputPath} (${(stats.size / 1024).toFixed(1)} KB)`);

  await client.end();
}

run().catch(console.error);
