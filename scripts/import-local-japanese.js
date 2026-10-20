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

async function runLocalJapaneseImport() {
  console.log('=== ULTRA-FAST LOCAL IMPORT: JAPANESE POKÉMON TCG ===\n');
  await client.connect();

  try {
    const gameRes = await client.query(`SELECT id FROM games WHERE slug = 'pokemon'`);
    const pokemonGameId = gameRes.rows[0].id;

    const baseDir = path.resolve('data/tcgdex-cards-database/data-asia');
    const eraEntries = fs.readdirSync(baseDir, { withFileTypes: true });
    const eras = eraEntries.filter(e => e.isDirectory() && !e.name.startsWith('.')).map(e => e.name);

    console.log(`Found ${eras.length} Japanese series/era directories.`);

    // Preload all existing card_sets
    const setsRes = await client.query(`SELECT id, set_code FROM card_sets WHERE game_id = $1`, [pokemonGameId]);
    const setDbMap = new Map();
    for (const r of setsRes.rows) {
      setDbMap.set(r.set_code.toUpperCase(), r.id);
    }
    console.log(`Loaded ${setDbMap.size} existing sets from database.\n`);

    let totalJpCards = 0;
    let totalJpVariants = 0;
    const globalStart = Date.now();

    for (const era of eras) {
      const eraDir = path.join(baseDir, era);
      const setEntries = fs.readdirSync(eraDir, { withFileTypes: true });
      const setDirs = setEntries.filter(e => e.isDirectory()).map(e => e.name);

      for (const setCode of setDirs) {
        const setFolderPath = path.join(eraDir, setCode);
        const cardFiles = fs.readdirSync(setFolderPath).filter(f => f.endsWith('.ts'));
        if (cardFiles.length === 0) continue;

        // Ensure set exists in card_sets
        let setId = setDbMap.get(setCode.toUpperCase());
        if (!setId) {
          const setSlug = `pokemon-jp-${slugify(setCode)}`;
          const setName = `${setCode} (${era})`;
          const sRes = await client.query(`
            INSERT INTO card_sets (game_id, set_code, slug, name, total_printed_cards, set_type, language, era_block)
            VALUES ($1, $2, $3, $4, $5, 'expansion', 'jp', $6)
            ON CONFLICT (game_id, set_code) DO UPDATE SET language = 'jp'
            RETURNING id;
          `, [pokemonGameId, setCode, setSlug, setName, cardFiles.length, era]);
          setId = sRes.rows[0].id;
          setDbMap.set(setCode.toUpperCase(), setId);
        }

        // Parse cards locally
        const parsedCards = [];
        const seenCardNumbers = new Set();

        for (const cf of cardFiles) {
          const cNumRaw = path.basename(cf, '.ts');
          let cNum = cNumRaw;
          if (seenCardNumbers.has(cNum)) {
            let sfx = 2;
            while (seenCardNumbers.has(`${cNum}_v${sfx}`)) sfx++;
            cNum = `${cNum}_v${sfx}`;
          }
          seenCardNumbers.add(cNum);

          const content = fs.readFileSync(path.join(setFolderPath, cf), 'utf8');

          const jaNameMatch = content.match(/ja:\s*["']([^"']+)["']/);
          const enNameMatch = content.match(/id:\s*["']([^"']+)["']/);
          const hpMatch = content.match(/hp:\s*(\d+)/);
          const catMatch = content.match(/category:\s*["']([^"']+)["']/);
          const illusMatch = content.match(/illustrator:\s*["']([^"']+)["']/);
          const stageMatch = content.match(/stage:\s*["']([^"']+)["']/);

          const offName = jaNameMatch ? jaNameMatch[1] : (enNameMatch ? enNameMatch[1] : `Card ${cNumRaw}`);
          const cleanName = enNameMatch ? enNameMatch[1] : offName;

          parsedCards.push({
            cardNumber: cNum,
            originalNumber: cNumRaw,
            officialName: offName,
            cleanName: cleanName,
            hp: hpMatch ? parseInt(hpMatch[1]) : null,
            supertype: catMatch ? catMatch[1] : 'Pokémon',
            artist: illusMatch ? illusMatch[1] : null,
            subtypes: stageMatch ? [stageMatch[1]] : [],
            era: era,
            setCode: setCode
          });
        }

        // Batch insert cards in chunks of 70
        const chunkSize = 70;
        for (let c = 0; c < parsedCards.length; c += chunkSize) {
          const chunk = parsedCards.slice(c, c + chunkSize);

          const cardValues = [];
          const cardParams = [];
          let pIdx = 1;

          for (const card of chunk) {
            const metadata = JSON.stringify({
              hp: card.hp,
              language: 'jp',
              era: card.era
            });

            cardValues.push(`($${pIdx}, $${pIdx+1}, $${pIdx+2}, $${pIdx+3}, $${pIdx+4}, 'Common', $${pIdx+5}, $${pIdx+6}, $${pIdx+7}, $${pIdx+8})`);
            cardParams.push(
              pokemonGameId, setId, card.cardNumber, card.cleanName, card.officialName,
              card.artist, card.supertype, card.subtypes, metadata
            );
            pIdx += 9;
          }

          const insertCardSql = `
            INSERT INTO master_cards (
              game_id, set_id, card_number, clean_name, official_name,
              rarity, artist, supertype, subtypes, game_metadata
            ) VALUES ${cardValues.join(', ')}
            ON CONFLICT (set_id, card_number) DO UPDATE SET
              clean_name = EXCLUDED.clean_name,
              official_name = EXCLUDED.official_name,
              artist = EXCLUDED.artist,
              game_metadata = EXCLUDED.game_metadata
            RETURNING id, card_number;
          `;

          const insertedCardsRes = await client.query(insertCardSql, cardParams);
          const cardIdMap = new Map();
          for (const r of insertedCardsRes.rows) {
            cardIdMap.set(r.card_number, r.id);
          }
          totalJpCards += insertedCardsRes.rows.length;

          // Batch insert variants
          const varValues = [];
          const varParams = [];
          const seenVarKeys = new Set();
          const seenSlugs = new Set();
          let vIdx = 1;

          const is151 = (setCode.toUpperCase() === 'SV2A');

          for (const card of chunk) {
            const cardId = cardIdMap.get(card.cardNumber);
            if (!cardId) continue;

            const finishes = [
              { finish: 'regular', print_run: 'unlimited', stamp: 'none' }
            ];

            if (is151) {
              finishes.push({ finish: 'reverse_holo', print_run: 'unlimited', stamp: 'pokeball' });
              finishes.push({ finish: 'masterball_foil', print_run: 'unlimited', stamp: 'masterball' });
            }

            const frontUrl = `https://assets.tcgdex.net/ja/${card.era}/${card.setCode}/${card.originalNumber}/high.png`;

            for (const vf of finishes) {
              const varKey = `${cardId}_${vf.finish}_${vf.stamp}_${vf.print_run}`;
              if (seenVarKeys.has(varKey)) continue;
              seenVarKeys.add(varKey);

              let slug = `pkmn-jp-${setCode}-${card.cardNumber}-${vf.finish}-${vf.stamp}`.toLowerCase().replace(/[^a-z0-9-]/g, '-').slice(0, 280);
              if (seenSlugs.has(slug)) {
                slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
              }
              seenSlugs.add(slug);

              varValues.push(`($${vIdx}, $${vIdx+1}, $${vIdx+2}, $${vIdx+3}, $${vIdx+4}, 'jp', $${vIdx+5})`);
              varParams.push(cardId, slug, vf.finish, vf.stamp, vf.print_run, frontUrl);
              vIdx += 6;
            }
          }

          if (varValues.length > 0) {
            const insertVarSql = `
              INSERT INTO card_variants (
                card_id, slug, finish, stamp, print_run, language,
                image_front_url
              ) VALUES ${varValues.join(', ')}
              ON CONFLICT (card_id, finish, stamp, print_run) DO UPDATE SET
                slug = EXCLUDED.slug,
                image_front_url = EXCLUDED.image_front_url;
            `;
            await client.query(insertVarSql, varParams);
            totalJpVariants += varValues.length;
          }
        }

        const elapsed = ((Date.now() - globalStart) / 1000).toFixed(1);
        if (totalJpCards % 1000 === 0 || setCode === setDirs[setDirs.length - 1]) {
          console.log(`[${era} / ${setCode.padEnd(8)}] Processed | Cards: ${totalJpCards.toLocaleString()} | Variants: ${totalJpVariants.toLocaleString()} | Time: ${elapsed}s`);
        }
      }
    }

    const totalDuration = ((Date.now() - globalStart) / 1000).toFixed(1);
    console.log(`\n================ JAPANESE IMPORT COMPLETE ================`);
    console.log(`Total Japanese Master Cards: ${totalJpCards.toLocaleString()}`);
    console.log(`Total Japanese Variants:     ${totalJpVariants.toLocaleString()}`);
    console.log(`Total Execution Time:        ${totalDuration}s`);

  } catch (err) {
    console.error('Local Japanese Import Error:', err);
  } finally {
    await client.end();
  }
}

runLocalJapaneseImport();
