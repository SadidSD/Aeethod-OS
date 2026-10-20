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
  console.log('Inserting documented historic error variants...');

  // 1. Red Cheeks Pikachu (Base Set #58)
  const pikaCard = await client.query(`
    SELECT m.id FROM master_cards m
    JOIN card_sets s ON m.set_id = s.id
    WHERE s.set_code = 'base1' AND m.card_number = '58';
  `);
  if (pikaCard.rows.length > 0) {
    const cid = pikaCard.rows[0].id;
    await client.query(`
      INSERT INTO card_variants (card_id, slug, finish, stamp, print_run, language, is_error, error_details)
      VALUES 
        ($1, 'pkmn-base1-58-red-cheeks-1ed', 'regular', 'red_cheeks', '1st_edition', 'en', true, '1st Edition Red Cheeks error variant'),
        ($1, 'pkmn-base1-58-red-cheeks-shadowless', 'regular', 'red_cheeks', 'shadowless', 'en', true, 'Shadowless Red Cheeks error variant')
      ON CONFLICT (card_id, finish, stamp, print_run) DO NOTHING;
    `, [cid]);
    console.log('✓ Inserted Red Cheeks Pikachu error variants (1st Edition & Shadowless).');
  }

  // 2. No Damage Ninetales (Base Set #12)
  const ninetalesCard = await client.query(`
    SELECT m.id FROM master_cards m
    JOIN card_sets s ON m.set_id = s.id
    WHERE s.set_code = 'base1' AND m.card_number = '12';
  `);
  if (ninetalesCard.rows.length > 0) {
    const cid = ninetalesCard.rows[0].id;
    await client.query(`
      INSERT INTO card_variants (card_id, slug, finish, stamp, print_run, language, is_error, error_details)
      VALUES ($1, 'pkmn-base1-12-no-damage', 'holo', 'no_damage', 'shadowless', 'en', true, 'Missing 80 damage on Fire Blast attack')
      ON CONFLICT (card_id, finish, stamp, print_run) DO NOTHING;
    `, [cid]);
    console.log('✓ Inserted No Damage Ninetales error variant.');
  }

  // 3. Stage Error Blastoise (Base Set #2)
  const blastoiseCard = await client.query(`
    SELECT m.id FROM master_cards m
    JOIN card_sets s ON m.set_id = s.id
    WHERE s.set_code = 'base1' AND m.card_number = '2';
  `);
  if (blastoiseCard.rows.length > 0) {
    const cid = blastoiseCard.rows[0].id;
    await client.query(`
      INSERT INTO card_variants (card_id, slug, finish, stamp, print_run, language, is_error, error_details)
      VALUES ($1, 'pkmn-base1-2-no-stage', 'holo', 'no_stage', 'unlimited', 'en', true, 'Missing Stage text on evolution box')
      ON CONFLICT (card_id, finish, stamp, print_run) DO NOTHING;
    `, [cid]);
    console.log('✓ Inserted Stage Error Blastoise error variant.');
  }

  // 4. Dark Arbok 23000 Error (Team Rocket #32)
  const arbokCard = await client.query(`
    SELECT m.id FROM master_cards m
    JOIN card_sets s ON m.set_id = s.id
    WHERE s.set_code = 'base5' AND m.card_number = '32';
  `);
  if (arbokCard.rows.length > 0) {
    const cid = arbokCard.rows[0].id;
    await client.query(`
      INSERT INTO card_variants (card_id, slug, finish, stamp, print_run, language, is_error, error_details)
      VALUES ($1, 'pkmn-base5-32-copyright-23000', 'regular', 'copyright_23000', 'unlimited', 'en', true, 'Printed with year 23000 copyright instead of 2000')
      ON CONFLICT (card_id, finish, stamp, print_run) DO NOTHING;
    `, [cid]);
    console.log('✓ Inserted Dark Arbok 23000 error variant.');
  }

  // 5. No Symbol Jungle Holos (Jungle cards 1 to 16)
  const jungleHolos = await client.query(`
    SELECT m.id, m.card_number, m.official_name FROM master_cards m
    JOIN card_sets s ON m.set_id = s.id
    WHERE s.set_code = 'base2' AND m.card_number::int BETWEEN 1 AND 16;
  `);
  for (const c of jungleHolos.rows) {
    await client.query(`
      INSERT INTO card_variants (card_id, slug, finish, stamp, print_run, language, is_error, error_details)
      VALUES ($1, $2, 'holo', 'no_symbol', 'unlimited', 'en', true, 'Missing Jungle expansion flower symbol')
      ON CONFLICT (card_id, finish, stamp, print_run) DO NOTHING;
    `, [c.id, `pkmn-base2-${c.card_number}-no-symbol`]);
  }
  console.log(`✓ Inserted all 16 No Symbol Jungle Holo error variants.`);

  await client.end();
}

main().catch(console.error);
