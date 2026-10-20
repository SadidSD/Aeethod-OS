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

async function runMigration() {
  console.log('Connecting to Supabase PostgreSQL 17 database...');
  await client.connect();
  console.log('Connected! Starting schema migration...\n');

  try {
    // 1. EXTENSIONS
    console.log('1. Enabling extensions (vector, pg_trgm, unaccent, pgcrypto)...');
    await client.query(`
      CREATE EXTENSION IF NOT EXISTS "vector";
      CREATE EXTENSION IF NOT EXISTS "pg_trgm";
      CREATE EXTENSION IF NOT EXISTS "unaccent";
      CREATE EXTENSION IF NOT EXISTS "pgcrypto";
    `);
    console.log('   ✓ Extensions successfully enabled.');

    // 2. UUIDv7 GENERATOR FUNCTION
    console.log('2. Installing uuid_generate_v7() function...');
    await client.query(`
      CREATE OR REPLACE FUNCTION uuid_generate_v7()
      RETURNS uuid AS $$
      DECLARE
        v_time timestamp with time zone := clock_timestamp();
        v_millis bigint := (extract(epoch from v_time) * 1000)::bigint;
        v_uuid text;
      BEGIN
        v_uuid := lpad(to_hex(v_millis), 12, '0') || 
                  '7' || 
                  substr(md5(random()::text), 2, 3) || 
                  to_hex((floor(random() * 4) + 8)::int) || 
                  substr(md5(random()::text), 2, 3) || 
                  substr(md5(random()::text), 1, 12);
        RETURN v_uuid::uuid;
      END;
      $$ LANGUAGE plpgsql VOLATILE;
    `);
    console.log('   ✓ uuid_generate_v7() installed.');

    // 3. MULTI-TENANT MERCHANTS & MEMBERS
    console.log('3. Creating multi-tenant tables (merchants, merchant_members)...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS merchants (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
        name VARCHAR(150) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        currency VARCHAR(3) DEFAULT 'USD',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS merchant_members (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
        merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        role VARCHAR(20) DEFAULT 'owner' CHECK (role IN ('owner', 'admin', 'staff')),
        created_at TIMESTAMPTZ DEFAULT now(),
        UNIQUE (merchant_id, user_id)
      );
    `);
    console.log('   ✓ Multi-tenant anchor tables created.');

    // 4. MASTER CATALOG TABLES
    console.log('4. Creating 5 Master Catalog tables...');
    
    // 4a. Games
    await client.query(`
      CREATE TABLE IF NOT EXISTS games (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
        slug VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        code VARCHAR(20) UNIQUE NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT now()
      );
    `);

    // 4b. Card Sets
    await client.query(`
      CREATE TABLE IF NOT EXISTS card_sets (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
        game_id UUID NOT NULL REFERENCES games(id) ON DELETE RESTRICT,
        set_code VARCHAR(50) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        name VARCHAR(150) NOT NULL,
        release_date DATE,
        total_printed_cards INT,
        set_type VARCHAR(50) DEFAULT 'expansion',
        created_at TIMESTAMPTZ DEFAULT now(),
        UNIQUE (game_id, set_code)
      );
    `);

    // 4c. Master Cards
    await client.query(`
      CREATE TABLE IF NOT EXISTS master_cards (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
        game_id UUID NOT NULL REFERENCES games(id) ON DELETE RESTRICT,
        set_id UUID NOT NULL REFERENCES card_sets(id) ON DELETE RESTRICT,
        card_number VARCHAR(50) NOT NULL,
        clean_name VARCHAR(255) NOT NULL,
        official_name VARCHAR(255) NOT NULL,
        rarity VARCHAR(50),
        artist VARCHAR(100),
        supertype VARCHAR(50),
        subtypes TEXT[],
        game_metadata JSONB DEFAULT '{}'::jsonb,
        embedding vector(512),
        created_at TIMESTAMPTZ DEFAULT now(),
        UNIQUE (set_id, card_number)
      );
    `);

    // 4d. Card Variants (with 14 fingerprints & limited edition counts)
    await client.query(`
      CREATE TABLE IF NOT EXISTS card_variants (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
        card_id UUID NOT NULL REFERENCES master_cards(id) ON DELETE CASCADE,
        slug VARCHAR(300) UNIQUE NOT NULL,
        finish VARCHAR(50) NOT NULL,
        stamp VARCHAR(50) DEFAULT 'none',
        print_run VARCHAR(50) DEFAULT 'unlimited',
        is_promo BOOLEAN DEFAULT false,
        is_error BOOLEAN DEFAULT false,
        error_details TEXT,
        barcode VARCHAR(50),
        image_front_url TEXT,
        image_back_url TEXT,
        total_copies_produced INT,
        print_count_type VARCHAR(20) DEFAULT 'unlimited' CHECK (print_count_type IN ('exact_official', 'estimated', 'unknown', 'unlimited')),
        distribution_event TEXT,
        created_at TIMESTAMPTZ DEFAULT now(),
        UNIQUE (card_id, finish, stamp, print_run)
      );
    `);

    // 4e. Card Market Prices (1:1 with variant, BIGINT cents)
    await client.query(`
      CREATE TABLE IF NOT EXISTS card_market_prices (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
        variant_id UUID UNIQUE NOT NULL REFERENCES card_variants(id) ON DELETE CASCADE,
        tcgplayer_market_cents BIGINT,
        tcgplayer_low_cents BIGINT,
        pricecharting_cents BIGINT,
        cardmarket_cents BIGINT,
        buylist_market_cents BIGINT,
        psa_10_pop INT,
        psa_9_pop INT,
        bgs_9_5_pop INT,
        updated_at TIMESTAMPTZ DEFAULT now()
      );
    `);
    console.log('   ✓ 5 Master Catalog tables created.');

    // 5. SAAS INVENTORY TABLE
    console.log('5. Creating merchant inventory table (inventory_items)...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS inventory_items (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
        merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
        variant_id UUID NOT NULL REFERENCES card_variants(id) ON DELETE RESTRICT,
        condition VARCHAR(20) NOT NULL CHECK (condition IN ('NM', 'LP', 'MP', 'HP', 'DMG')),
        language VARCHAR(10) DEFAULT 'en',
        is_graded BOOLEAN DEFAULT false,
        grading_company VARCHAR(20) CHECK (grading_company IS NULL OR grading_company IN ('PSA', 'BGS', 'CGC', 'TAG', 'ARS')),
        grade NUMERIC(3,1),
        slab_cert_number VARCHAR(50),
        serial_number INT,
        serial_total INT,
        cost_cents BIGINT,
        list_price_cents BIGINT NOT NULL,
        quantity INT NOT NULL DEFAULT 1 CHECK (quantity >= 0),
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now()
      );
    `);
    console.log('   ✓ inventory_items created with ON DELETE RESTRICT on card_variants.');

    // 6. INDEXES
    console.log('6. Building performance indexes (pg_trgm, HNSW vector, B-Trees)...');
    await client.query(`
      -- Trigram search on clean_name and official_name
      CREATE INDEX IF NOT EXISTS idx_master_cards_clean_name_trgm ON master_cards USING gin (clean_name gin_trgm_ops);
      CREATE INDEX IF NOT EXISTS idx_master_cards_official_name_trgm ON master_cards USING gin (official_name gin_trgm_ops);
      
      -- Foreign key B-Trees
      CREATE INDEX IF NOT EXISTS idx_card_sets_game_id ON card_sets(game_id);
      CREATE INDEX IF NOT EXISTS idx_master_cards_game_id ON master_cards(game_id);
      CREATE INDEX IF NOT EXISTS idx_master_cards_set_id ON master_cards(set_id);
      CREATE INDEX IF NOT EXISTS idx_master_cards_metadata ON master_cards USING gin (game_metadata);
      CREATE INDEX IF NOT EXISTS idx_card_variants_card_id ON card_variants(card_id);
      CREATE INDEX IF NOT EXISTS idx_card_variants_barcode ON card_variants(barcode) WHERE barcode IS NOT NULL;
      CREATE INDEX IF NOT EXISTS idx_card_variants_total_copies ON card_variants(total_copies_produced) WHERE total_copies_produced IS NOT NULL;
      
      -- AI Visual vector index (HNSW for sub-15ms camera matching)
      CREATE INDEX IF NOT EXISTS idx_master_cards_embedding ON master_cards USING hnsw (embedding vector_cosine_ops);
      
      -- Merchant stock query indexes
      CREATE INDEX IF NOT EXISTS idx_inventory_merchant_variant ON inventory_items(merchant_id, variant_id);
      CREATE INDEX IF NOT EXISTS idx_inventory_slab_cert ON inventory_items(slab_cert_number) WHERE slab_cert_number IS NOT NULL;
    `);
    console.log('   ✓ Performance indexes successfully created.');

    // 7. ROW LEVEL SECURITY (RLS) POLICIES
    console.log('7. Configuring Row Level Security (RLS)...');
    await client.query(`
      -- Enable RLS
      ALTER TABLE games ENABLE ROW LEVEL SECURITY;
      ALTER TABLE card_sets ENABLE ROW LEVEL SECURITY;
      ALTER TABLE master_cards ENABLE ROW LEVEL SECURITY;
      ALTER TABLE card_variants ENABLE ROW LEVEL SECURITY;
      ALTER TABLE card_market_prices ENABLE ROW LEVEL SECURITY;
      ALTER TABLE merchants ENABLE ROW LEVEL SECURITY;
      ALTER TABLE merchant_members ENABLE ROW LEVEL SECURITY;
      ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;

      -- Catalog tables: Public read
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read games') THEN
          CREATE POLICY "Public read games" ON games FOR SELECT USING (true);
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read card_sets') THEN
          CREATE POLICY "Public read card_sets" ON card_sets FOR SELECT USING (true);
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read master_cards') THEN
          CREATE POLICY "Public read master_cards" ON master_cards FOR SELECT USING (true);
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read card_variants') THEN
          CREATE POLICY "Public read card_variants" ON card_variants FOR SELECT USING (true);
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read card_market_prices') THEN
          CREATE POLICY "Public read card_market_prices" ON card_market_prices FOR SELECT USING (true);
        END IF;
      END $$;
    `);
    console.log('   ✓ RLS configured.');

    // 8. SEED CORE DATA (GAMES, SETS, MASTER CARDS, VARIANTS, PRICES)
    console.log('8. Seeding initial game catalog & sample data...');
    
    // Seed Games
    await client.query(`
      INSERT INTO games (slug, name, code) VALUES
        ('pokemon', 'Pokémon TCG', 'PKMN'),
        ('mtg', 'Magic: The Gathering', 'MTG'),
        ('one-piece', 'One Piece Card Game', 'OP'),
        ('lorcana', 'Disney Lorcana', 'LORC'),
        ('yugioh', 'Yu-Gi-Oh! TCG', 'YGO')
      ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, code = EXCLUDED.code;
    `);

    // Get Pokémon game_id
    const gameRes = await client.query(`SELECT id FROM games WHERE slug = 'pokemon'`);
    const pokemonGameId = gameRes.rows[0].id;

    // Seed 151 Set
    const setRes = await client.query(`
      INSERT INTO card_sets (game_id, set_code, slug, name, release_date, total_printed_cards, set_type)
      VALUES ($1, 'sv03.5', 'pokemon-scarlet-violet-151', 'Scarlet & Violet: 151', '2023-09-22', 165, 'special')
      ON CONFLICT (game_id, set_code) DO UPDATE SET name = EXCLUDED.name
      RETURNING id;
    `, [pokemonGameId]);
    const set151Id = setRes.rows[0].id;

    // Seed Pikachu Master Card
    const cardRes = await client.query(`
      INSERT INTO master_cards (game_id, set_id, card_number, clean_name, official_name, rarity, artist, supertype, subtypes, game_metadata)
      VALUES ($1, $2, '025/165', 'Pikachu', 'Pikachu', 'Common', 'Hiroyuki Yamamoto', 'Pokémon', ARRAY['Basic'], '{"hp": 60, "types": ["Lightning"], "deck_limit": 4}'::jsonb)
      ON CONFLICT (set_id, card_number) DO UPDATE SET clean_name = EXCLUDED.clean_name
      RETURNING id;
    `, [pokemonGameId, set151Id]);
    const pikachuCardId = cardRes.rows[0].id;

    // Seed Pikachu Variants: Regular, Reverse Holo, Masterball Foil, and Raincoat Limited 100 Promo!
    const var1 = await client.query(`
      INSERT INTO card_variants (card_id, slug, finish, stamp, print_run, print_count_type)
      VALUES ($1, 'pkmn-sv03.5-025-regular', 'regular', 'none', 'unlimited', 'unlimited')
      ON CONFLICT (card_id, finish, stamp, print_run) DO UPDATE SET slug = EXCLUDED.slug
      RETURNING id;
    `, [pikachuCardId]);

    const var2 = await client.query(`
      INSERT INTO card_variants (card_id, slug, finish, stamp, print_run, print_count_type)
      VALUES ($1, 'pkmn-sv03.5-025-reverse-holo', 'reverse_holo', 'none', 'unlimited', 'unlimited')
      ON CONFLICT (card_id, finish, stamp, print_run) DO UPDATE SET slug = EXCLUDED.slug
      RETURNING id;
    `, [pikachuCardId]);

    const var3 = await client.query(`
      INSERT INTO card_variants (card_id, slug, finish, stamp, print_run, print_count_type)
      VALUES ($1, 'pkmn-sv03.5-025-masterball-foil', 'masterball_foil', 'none', 'unlimited', 'unlimited')
      ON CONFLICT (card_id, finish, stamp, print_run) DO UPDATE SET slug = EXCLUDED.slug
      RETURNING id;
    `, [pikachuCardId]);

    // Raincoat Pikachu (Special Limited 100 copies world promo)
    const var4 = await client.query(`
      INSERT INTO card_variants (card_id, slug, finish, stamp, print_run, is_promo, total_copies_produced, print_count_type, distribution_event)
      VALUES ($1, 'pkmn-sv03.5-025-raincoat-ltd100', 'holo', 'lottery_winner', 'unlimited', true, 100, 'exact_official', 'Distributed via official Pokémon Center lottery limited to exactly 100 copies worldwide')
      ON CONFLICT (card_id, finish, stamp, print_run) DO UPDATE SET total_copies_produced = 100, distribution_event = EXCLUDED.distribution_event
      RETURNING id;
    `, [pikachuCardId]);

    // Seed Market Prices ($ in cents)
    await client.query(`
      INSERT INTO card_market_prices (variant_id, tcgplayer_market_cents, buylist_market_cents, psa_10_pop)
      VALUES 
        ($1, 35, 10, 120),       -- Regular: $0.35
        ($2, 120, 50, 450),      -- Reverse Holo: $1.20
        ($3, 4500, 2800, 68),    -- Masterball Foil: $45.00
        ($4, 450000, 320000, 12) -- Raincoat Pikachu Limited 100: $4,500.00 (12 graded PSA 10)
      ON CONFLICT (variant_id) DO UPDATE SET 
        tcgplayer_market_cents = EXCLUDED.tcgplayer_market_cents,
        buylist_market_cents = EXCLUDED.buylist_market_cents,
        psa_10_pop = EXCLUDED.psa_10_pop;
    `, [var1.rows[0].id, var2.rows[0].id, var3.rows[0].id, var4.rows[0].id]);

    console.log('   ✓ Seed data inserted (5 Games, 151 Set, Pikachu variants & Raincoat 100-copy promo).');

    // 9. VERIFICATION QUERY (Simulating Live App Read)
    console.log('\n9. Running live verification join...');
    const verifyRes = await client.query(`
      SELECT 
        g.name AS game,
        s.name AS set_name,
        m.official_name,
        m.card_number,
        v.finish,
        v.stamp,
        v.total_copies_produced,
        p.tcgplayer_market_cents,
        p.psa_10_pop
      FROM card_variants v
      JOIN master_cards m ON v.card_id = m.id
      JOIN card_sets s ON m.set_id = s.id
      JOIN games g ON s.game_id = g.id
      LEFT JOIN card_market_prices p ON p.variant_id = v.id
      WHERE m.clean_name = 'Pikachu';
    `);

    console.log('\n================ MIGRATION SUCCESSFUL! ================');
    console.table(verifyRes.rows.map(r => ({
      game: r.game,
      set: r.set_name,
      card: `${r.official_name} (${r.card_number})`,
      finish: r.finish,
      stamp: r.stamp,
      world_copies: r.total_copies_produced || 'Unlimited',
      price: `$${(r.tcgplayer_market_cents / 100).toFixed(2)}`,
      psa_10_pop: r.psa_10_pop
    })));

  } catch (err) {
    console.error('MIGRATION FAILED:', err);
  } finally {
    await client.end();
  }
}

runMigration();
