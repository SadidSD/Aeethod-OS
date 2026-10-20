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

function cleanCardName(name) {
  return String(name)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .trim();
}

async function bulkImportEnglish() {
  console.log('=== ULTRA-FAST BULK IMPORT: ENGLISH POKÉMON TCG ===\n');
  await client.connect();

  try {
    const gameRes = await client.query(`SELECT id FROM games WHERE slug = 'pokemon'`);
    const pokemonGameId = gameRes.rows[0].id;

    // Load set ID map
    const setRes = await client.query(`SELECT id, set_code FROM card_sets WHERE game_id = $1`, [pokemonGameId]);
    const setMap = new Map();
    for (const r of setRes.rows) {
      setMap.set(r.set_code, r.id);
    }
    console.log(`✓ Loaded ${setMap.size} existing sets from database.\n`);

    const cardsDir = path.resolve('data/pokemon-tcg-data/cards/en');
    const files = fs.readdirSync(cardsDir).filter(f => f.endsWith('.json'));
    console.log(`Starting bulk import across ${files.length} set files...\n`);

    let totalCardsCount = 0;
    let totalVariantsCount = 0;
    const globalStart = Date.now();

    for (let fIdx = 0; fIdx < files.length; fIdx++) {
      const file = files[fIdx];
      const setCode = path.basename(file, '.json');
      const setId = setMap.get(setCode);

      if (!setId) {
        continue;
      }

      const filePath = path.join(cardsDir, file);
      const rawCards = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      if (!Array.isArray(rawCards) || rawCards.length === 0) continue;

      // Ensure every card in this set has a unique card_number
      const seenCardNumbers = new Set();
      const cards = [];
      for (let idx = 0; idx < rawCards.length; idx++) {
        const rc = rawCards[idx];
        let cNum = String(rc.number || rc.id || idx + 1).trim();
        if (cNum === '') cNum = String(idx + 1);

        if (seenCardNumbers.has(cNum)) {
          let suffix = 2;
          while (seenCardNumbers.has(`${cNum}_v${suffix}`)) {
            suffix++;
          }
          cNum = `${cNum}_v${suffix}`;
        }
        seenCardNumbers.add(cNum);
        cards.push({ ...rc, resolved_card_number: cNum });
      }

      const setReleaseYear = cards[0]?.set?.releaseDate ? parseInt(cards[0].set.releaseDate.slice(0, 4)) : 2020;
      const isBaseSet = (setCode === 'base1');

      // Process in batches of 70 cards
      const chunkSize = 70;
      for (let c = 0; c < cards.length; c += chunkSize) {
        const chunk = cards.slice(c, c + chunkSize);

        const cardValues = [];
        const cardParams = [];
        let pIdx = 1;

        for (const card of chunk) {
          const cardNum = card.resolved_card_number;
          const cleanName = cleanCardName(card.name);
          const offName = card.name;
          const rarity = card.rarity || 'Common';
          const artist = card.artist || null;
          const supertype = card.supertype || 'Pokémon';
          const subtypes = Array.isArray(card.subtypes) ? card.subtypes : [];
          const metadata = JSON.stringify({
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
          });

          cardValues.push(`($${pIdx}, $${pIdx+1}, $${pIdx+2}, $${pIdx+3}, $${pIdx+4}, $${pIdx+5}, $${pIdx+6}, $${pIdx+7}, $${pIdx+8}, $${pIdx+9})`);
          cardParams.push(pokemonGameId, setId, cardNum, cleanName, offName, rarity, artist, supertype, subtypes, metadata);
          pIdx += 10;
        }

        const insertCardSql = `
          INSERT INTO master_cards (
            game_id, set_id, card_number, clean_name, official_name,
            rarity, artist, supertype, subtypes, game_metadata
          ) VALUES ${cardValues.join(', ')}
          ON CONFLICT (set_id, card_number) DO UPDATE SET
            clean_name = EXCLUDED.clean_name,
            official_name = EXCLUDED.official_name,
            rarity = EXCLUDED.rarity,
            artist = EXCLUDED.artist,
            game_metadata = EXCLUDED.game_metadata
          RETURNING id, card_number;
        `;

        const insertedCardsRes = await client.query(insertCardSql, cardParams);
        const cardIdByNumber = new Map();
        for (const r of insertedCardsRes.rows) {
          cardIdByNumber.set(r.card_number, r.id);
        }
        totalCardsCount += insertedCardsRes.rows.length;

        // 2. BATCH INSERT VARIANTS FOR THIS CHUNK
        const varValues = [];
        const varParams = [];
        const seenVariantKeys = new Set();
        const seenSlugs = new Set();
        let vIdx = 1;

        const priceBySlug = new Map();

        for (const card of chunk) {
          const cardId = cardIdByNumber.get(card.resolved_card_number);
          if (!cardId) continue;

          const rarity = card.rarity || 'Common';
          const cardRawId = card.id || `${setCode}-${card.resolved_card_number}`;
          const finishes = [];

          if (isBaseSet) {
            const isHolo = rarity.toLowerCase().includes('holo');
            const f = isHolo ? 'holo' : 'regular';
            finishes.push({ finish: f, print_run: '1st_edition' });
            finishes.push({ finish: f, print_run: 'shadowless' });
            finishes.push({ finish: f, print_run: 'unlimited' });
            finishes.push({ finish: f, print_run: '4th_print_1999_2000' });
          } else if (setReleaseYear < 2002) {
            const isHolo = rarity.toLowerCase().includes('holo');
            const f = isHolo ? 'holo' : 'regular';
            finishes.push({ finish: f, print_run: '1st_edition' });
            finishes.push({ finish: f, print_run: 'unlimited' });
          } else {
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

          const frontUrl = card.images?.large || card.images?.small || null;
          const barcode = card.tcgplayer?.url || null;

          for (const variant of finishes) {
            const varKey = `${cardId}_${variant.finish}_none_${variant.print_run}`;
            if (seenVariantKeys.has(varKey)) continue;
            seenVariantKeys.add(varKey);

            let variantSlug = `pkmn-${cardRawId}-${variant.finish}-${variant.print_run}`.toLowerCase().replace(/[^a-z0-9-]/g, '-').slice(0, 280);
            if (seenSlugs.has(variantSlug)) {
              variantSlug = `${variantSlug}-${Math.random().toString(36).slice(2, 6)}`;
            }
            seenSlugs.add(variantSlug);
            
            varValues.push(`($${vIdx}, $${vIdx+1}, $${vIdx+2}, 'none', $${vIdx+3}, 'en', $${vIdx+4}, $${vIdx+5})`);
            varParams.push(cardId, variantSlug, variant.finish, variant.print_run, barcode, frontUrl);
            vIdx += 6;

            if (card.tcgplayer?.prices) {
              const pObj = card.tcgplayer.prices;
              const pVal = pObj.holofoil?.market || pObj.reverseHolofoil?.market || pObj.normal?.market || pObj['1stEditionHolofoil']?.market;
              if (pVal) {
                priceBySlug.set(variantSlug, Math.round(pVal * 100));
              }
            }
          }
        }

        if (varValues.length > 0) {
          const insertVarSql = `
            INSERT INTO card_variants (
              card_id, slug, finish, stamp, print_run, language,
              barcode, image_front_url
            ) VALUES ${varValues.join(', ')}
            ON CONFLICT (card_id, finish, stamp, print_run) DO UPDATE SET
              slug = EXCLUDED.slug,
              image_front_url = EXCLUDED.image_front_url
            RETURNING id, slug;
          `;
          const insertedVarsRes = await client.query(insertVarSql, varParams);
          totalVariantsCount += insertedVarsRes.rows.length;

          // 3. BATCH INSERT PRICES
          const priceValues = [];
          const priceParams = [];
          const seenVariantIdsForPrice = new Set();
          let prIdx = 1;

          for (const vr of insertedVarsRes.rows) {
            if (seenVariantIdsForPrice.has(vr.id)) continue;
            const priceCents = priceBySlug.get(vr.slug);
            if (priceCents) {
              seenVariantIdsForPrice.add(vr.id);
              priceValues.push(`($${prIdx}, $${prIdx+1})`);
              priceParams.push(vr.id, priceCents);
              prIdx += 2;
            }
          }

          if (priceValues.length > 0) {
            const insertPriceSql = `
              INSERT INTO card_market_prices (variant_id, tcgplayer_market_cents)
              VALUES ${priceValues.join(', ')}
              ON CONFLICT (variant_id) DO UPDATE SET
                tcgplayer_market_cents = EXCLUDED.tcgplayer_market_cents,
                updated_at = now();
            `;
            await client.query(insertPriceSql, priceParams);
          }
        }
      }

      if ((fIdx + 1) % 15 === 0 || fIdx === files.length - 1) {
        const elapsedSec = ((Date.now() - globalStart) / 1000).toFixed(1);
        console.log(`[${fIdx + 1}/${files.length}] Sets Processed | Cards: ${totalCardsCount.toLocaleString()} | Variants: ${totalVariantsCount.toLocaleString()} | Time: ${elapsedSec}s`);
      }
    }

    const totalTime = ((Date.now() - globalStart) / 1000).toFixed(1);
    console.log(`\n================ BATCH IMPORT FINISHED ================`);
    console.log(`Total English Master Cards: ${totalCardsCount.toLocaleString()}`);
    console.log(`Total English Variants:     ${totalVariantsCount.toLocaleString()}`);
    console.log(`Total Execution Time:       ${totalTime}s`);

  } catch (err) {
    console.error('Batch Import Error:', err);
  } finally {
    await client.end();
  }
}

bulkImportEnglish();
