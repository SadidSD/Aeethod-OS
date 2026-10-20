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
  console.log('--- CARD MARKET PRICES STATUS ---');
  
  const totalPricesRes = await client.query('SELECT count(*) FROM card_market_prices;');
  console.log('Total rows in card_market_prices:', totalPricesRes.rows[0].count);

  const priceStatsRes = await client.query(`
    SELECT 
      count(p.id) as priced_variants,
      s.language,
      count(*) FILTER (WHERE p.tcgplayer_market_cents IS NOT NULL) as has_tcgplayer,
      count(*) FILTER (WHERE p.cardmarket_cents IS NOT NULL) as has_cardmarket,
      min(p.tcgplayer_market_cents) as min_cents,
      max(p.tcgplayer_market_cents) as max_cents,
      avg(p.tcgplayer_market_cents)::int as avg_cents
    FROM card_market_prices p
    JOIN card_variants v ON p.variant_id = v.id
    JOIN master_cards m ON v.card_id = m.id
    JOIN card_sets s ON m.set_id = s.id
    GROUP BY s.language;
  `);
  console.table(priceStatsRes.rows);

  const unpricedVariantsRes = await client.query(`
    SELECT 
      count(v.id) as total_variants,
      count(p.id) as variants_with_price_row,
      count(v.id) - count(p.id) as variants_missing_price_row,
      s.language
    FROM card_variants v
    JOIN master_cards m ON v.card_id = m.id
    JOIN card_sets s ON m.set_id = s.id
    LEFT JOIN card_market_prices p ON p.variant_id = v.id
    GROUP BY s.language;
  `);
  console.log('Variants Pricing Coverage:');
  console.table(unpricedVariantsRes.rows);

  await client.end();
}

main().catch(console.error);
