import fs from 'fs';
import path from 'path';
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

function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function cleanCardName(name) {
  return String(name)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents (Flabébé -> Flabebe)
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .trim();
}

async function runEnglishImport() {
  console.log('=== STARTING ENGLISH POKÉMON TCG IMPORT ===\n');
  await client.connect();

  try {
    // 1. Get Pokémon Game ID
    const gameRes = await client.query(`SELECT id FROM games WHERE slug = 'pokemon'`);
    if (gameRes.rows.length === 0) {
      throw new Error('Pokemon game row not found in games table!');
    }
    const pokemonGameId = gameRes.rows[0].id;
    console.log(`✓ Attached to Pokémon Game (ID: ${pokemonGameId})`);

    // 2. Read Sets JSON
    const setsPath = path.resolve('data/pokemon-tcg-data/sets/en.json');
    if (!fs.existsSync(setsPath)) {
      throw new Error(`Sets file not found at ${setsPath}`);
    }
    const setsData = JSON.parse(fs.readFileSync(setsPath, 'utf8'));
    console.log(`✓ Found ${setsData.length} English sets to process.\n`);

    // 3. Upsert Sets in Batch
    console.log('Inserting / Updating all 176 card_sets...');
    const setDbMap = new Map(); // set_code -> db uuid

    for (const s of setsData) {
      const releaseDate = s.releaseDate ? s.releaseDate.replace(/\//g, '-') : null;
      const setSlug = `pokemon-${slugify(s.name)}-${s.id}`;
      
      const res = await client.query(`
        INSERT INTO card_sets (game_id, set_code, slug, name, release_date, total_printed_cards, set_type, language, era_block)
        VALUES ($1, $2, $3, $4, $5, $6, $7, 'en', $8)
        ON CONFLICT (game_id, set_code) DO UPDATE SET
          name = EXCLUDED.name,
          release_date = EXCLUDED.release_date,
          total_printed_cards = EXCLUDED.total_printed_cards,
          set_type = EXCLUDED.set_type,
          era_block = EXCLUDED.era_block
        RETURNING id, set_code;
      `, [
        pokemonGameId,
        s.id,
        setSlug,
        s.name,
        releaseDate,
        s.printedTotal || s.total || 0,
        s.series || 'expansion',
        s.series || null
      ]);

      setDbMap.set(s.id, res.rows[0].id);
    }
    console.log(`✓ Successfully synced ${setDbMap.size} sets into card_sets.\n`);

    // 4. Iterate over set card files
    const cardsDir = path.resolve('data/pokemon-tcg-data/cards/en');
    const files = fs.readdirSync(cardsDir).filter(f => f.endsWith('.json'));
    console.log(`Starting card ingestion from ${files.length} set files...\n`);

    let totalCardsImported = 0;
    let totalVariantsImported = 0;
    const startTime = Date.now();

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const setCode = path.basename(file, '.json');
      const setId = setDbMap.get(setCode);

      if (!setId) {
        console.warn(`[SKIP] Set ID not found for file ${file}`);
        continue;
      }

      const filePath = path.join(cardsDir, file);
      const cards = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      if (!Array.isArray(cards) || cards.length === 0) continue;

      const setReleaseYear = cards[0]?.set?.releaseDate ? parseInt(cards[0].set.releaseDate.slice(0, 4)) : 2020;
      const isBaseSet = (setCode === 'base1');

      // We process cards in sub-batches of 50
      for (let b = 0; b < cards.length; b += 50) {
        const batch = cards.slice(b, b + 50);

        // Build Master Cards Batch
        for (const card of batch) {
          const cardNum = String(card.number || b);
          const cleanName = cleanCardName(card.name);
          const offName = card.name;
          const rarity = card.rarity || 'Common';
          const artist = card.artist || null;
          const supertype = card.supertype || 'Pokémon';
          const subtypes = Array.isArray(card.subtypes) ? card.subtypes : [];
          
          const metadata = {
            hp: card.hp || null,
            types: card.types || [],
            attacks: card.attacks || [],
            weaknesses: card.weaknesses || [],
            resistances: card.resistances || [],
            retreatCost: card.retreatCost || [],
            flavorText: card.flavorText || null,
            nationalPokedexNumbers: card.nationalPokedexNumbers || [],
            regulationMark: card.regulationMark || null,
            legalities: card.legalities || {}
          };

          const cardRes = await client.query(`
            INSERT INTO master_cards (
              game_id, set_id, card_number, clean_name, official_name,
              rarity, artist, supertype, subtypes, game_metadata
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            ON CONFLICT (set_id, card_number) DO UPDATE SET
              clean_name = EXCLUDED.clean_name,
              official_name = EXCLUDED.official_name,
              rarity = EXCLUDED.rarity,
              artist = EXCLUDED.artist,
              game_metadata = EXCLUDED.game_metadata
            RETURNING id;
          `, [
            pokemonGameId, setId, cardNum, cleanName, offName,
            rarity, artist, supertype, subtypes, JSON.stringify(metadata)
          ]);

          const cardId = cardRes.rows[0].id;
          totalCardsImported++;

          // Build Variants for this Card
          const finishes = [];
          if (isBaseSet) {
            const isHolo = rarity.toLowerCase().includes('holo');
            const f = isHolo ? 'holo' : 'regular';
            finishes.push({ finish: f, print_run: '1st_edition' });
            finishes.push({ finish: f, print_run: 'shadowless' });
            finishes.push({ finish: f, print_run: 'unlimited' });
            finishes.push({ finish: f, print_run: '4th_print_1999_2000' });
          } else if (setReleaseYear < 2002) {
            // WotC Vintage
            const isHolo = rarity.toLowerCase().includes('holo');
            const f = isHolo ? 'holo' : 'regular';
            finishes.push({ finish: f, print_run: '1st_edition' });
            finishes.push({ finish: f, print_run: 'unlimited' });
          } else {
            // Modern (2002+)
            const isSpecialHolo = rarity.toLowerCase().includes('illustration') || 
                                  rarity.toLowerCase().includes('secret') || 
                                  rarity.toLowerCase().includes('ultra') ||
                                  rarity.toLowerCase().includes('double') ||
                                  rarity.toLowerCase().includes('radiant');

            if (isSpecialHolo) {
              finishes.push({ finish: 'holo', print_run: 'unlimited' });
            } else {
              finishes.push({ finish: 'regular', print_run: 'unlimited' });
              finishes.push({ finish: 'reverse_holo', print_run: 'unlimited' });
            }
          }

          // Insert Variants & Initial Prices
          const frontUrl = card.images?.large || card.images?.small || null;
          const barcode = card.tcgplayer?.url || null;

          for (const variant of finishes) {
            const variantSlug = `pkmn-${setCode}-${slugify(cardNum)}-${variant.finish}-${variant.print_run}`.slice(0, 290);
            
            const varRes = await client.query(`
              INSERT INTO card_variants (
                card_id, slug, finish, stamp, print_run, language,
                barcode, image_front_url
              ) VALUES ($1, $2, $3, 'none', $4, 'en', $5, $6)
              ON CONFLICT (card_id, finish, stamp, print_run) DO UPDATE SET
                slug = EXCLUDED.slug,
                image_front_url = EXCLUDED.image_front_url
              RETURNING id;
            `, [
              cardId, variantSlug, variant.finish, variant.print_run,
              barcode, frontUrl
            ]);

            const variantId = varRes.rows[0].id;
            totalVariantsImported++;

            // Initial price if available
            let priceCents = null;
            if (card.tcgplayer?.prices) {
              const pObj = card.tcgplayer.prices;
              const pVal = pObj.holofoil?.market || pObj.reverseHolofoil?.market || pObj.normal?.market || pObj['1stEditionHolofoil']?.market;
              if (pVal) {
                priceCents = Math.round(pVal * 100);
              }
            }

            if (priceCents) {
              await client.query(`
                INSERT INTO card_market_prices (variant_id, tcgplayer_market_cents)
                VALUES ($1, $2)
                ON CONFLICT (variant_id) DO UPDATE SET
                  tcgplayer_market_cents = EXCLUDED.tcgplayer_market_cents,
                  updated_at = now();
              `, [variantId, priceCents]);
            }
          }
        }
      }

      if ((i + 1) % 10 === 0 || i === files.length - 1) {
        const elapsedSec = ((Date.now() - startTime) / 1000).toFixed(1);
        console.log(`[${i + 1}/${files.length}] Processed ${setCode.padEnd(10)} | Cards: ${totalCardsImported} | Variants: ${totalVariantsImported} | Elapsed: ${elapsedSec}s`);
      }
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`\n================ IMPORT COMPLETE ================`);
    console.log(`Total English Master Cards: ${totalCardsImported}`);
    console.log(`Total English Variants:     ${totalVariantsImported}`);
    console.log(`Total Duration:             ${duration}s`);

  } catch (err) {
    console.error('Import error:', err);
  } finally {
    await client.end();
  }
}

runEnglishImport();
