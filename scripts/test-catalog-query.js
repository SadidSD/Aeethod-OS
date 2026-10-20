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
  const start = Date.now();
  const res = await client.query(`
    SELECT 
      m.id,
      m.card_number,
      m.clean_name,
      m.official_name,
      m.rarity,
      m.supertype,
      m.subtypes,
      m.artist,
      m.game_metadata,
      COALESCE(
        json_agg(
          json_build_object(
            'variant_id', v.id,
            'finish', v.finish,
            'stamp', v.stamp,
            'print_run', v.print_run,
            'is_error', v.is_error,
            'error_details', v.error_details,
            'market_cents', p.tcgplayer_market_cents,
            'low_cents', p.tcgplayer_low_cents,
            'buylist_cents', p.buylist_market_cents,
            'pc_cents', p.pricecharting_cents,
            'psa_10_pop', p.psa_10_pop
          )
        ) FILTER (WHERE v.id IS NOT NULL),
        '[]'::json
      ) as variants
    FROM master_cards m
    LEFT JOIN card_variants v ON v.card_id = m.id
    LEFT JOIN card_market_prices p ON p.variant_id = v.id
    WHERE m.set_id = (SELECT id FROM card_sets WHERE set_code = 'base1' LIMIT 1)
    GROUP BY m.id
    ORDER BY LPAD(regexp_replace(m.card_number, '[^0-9]', '', 'g'), 10, '0') ASC, m.card_number ASC
    LIMIT 5;
  `);

  console.log(`Query took ${Date.now() - start}ms. Returned ${res.rows.length} cards.`);
  console.log('Sample card:', {
    name: res.rows[0].clean_name,
    number: res.rows[0].card_number,
    rarity: res.rows[0].rarity,
    images: res.rows[0].game_metadata?.images,
    variants: res.rows[0].variants
  });

  await client.end();
}

run().catch(console.error);
