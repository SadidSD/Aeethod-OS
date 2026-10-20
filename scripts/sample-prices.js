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
      m.clean_name,
      m.card_number,
      s.name as set_name,
      s.language,
      v.finish,
      v.print_run,
      v.stamp,
      p.tcgplayer_market_cents,
      p.tcgplayer_low_cents,
      p.buylist_market_cents
    FROM card_market_prices p
    JOIN card_variants v ON p.variant_id = v.id
    JOIN master_cards m ON v.card_id = m.id
    JOIN card_sets s ON m.set_id = s.id
    WHERE m.clean_name ILIKE '%Charizard%' OR m.clean_name ILIKE '%Pikachu%'
    ORDER BY p.tcgplayer_market_cents DESC
    LIMIT 10;
  `);

  console.log('Top Priced Sample Cards (Charizard / Pikachu):');
  console.table(res.rows.map(r => ({
    name: r.clean_name,
    number: r.card_number,
    set: r.set_name,
    lang: r.language,
    finish: r.finish,
    print_run: r.print_run,
    market_usd: `$${(r.tcgplayer_market_cents / 100).toFixed(2)}`,
    low_usd: `$${(r.tcgplayer_low_cents / 100).toFixed(2)}`,
    buylist_usd: `$${(r.buylist_market_cents / 100).toFixed(2)}`
  })));

  // Sample Japanese 151 Master Ball vs Poke Ball cards
  const jpSample = await client.query(`
    SELECT 
      m.clean_name,
      m.card_number,
      s.name as set_name,
      v.finish,
      p.tcgplayer_market_cents,
      p.buylist_market_cents
    FROM card_market_prices p
    JOIN card_variants v ON p.variant_id = v.id
    JOIN master_cards m ON v.card_id = m.id
    JOIN card_sets s ON m.set_id = s.id
    WHERE s.set_code = 'SV2a' AND v.finish IN ('masterball_foil', 'pokeball_foil', 'reverse_holo')
    LIMIT 6;
  `);
  console.log('\nSample Japanese 151 Mirror Foil Prices:');
  console.table(jpSample.rows.map(r => ({
    name: r.clean_name,
    number: r.card_number,
    finish: r.finish,
    market_usd: `$${(r.tcgplayer_market_cents / 100).toFixed(2)}`,
    buylist_usd: `$${(r.buylist_market_cents / 100).toFixed(2)}`
  })));

  await client.end();
}

run().catch(console.error);
