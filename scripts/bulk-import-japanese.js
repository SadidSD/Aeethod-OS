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

async function bulkImportJapanese() {
  console.log('=== ULTRA-FAST BATCH IMPORT: JAPANESE POKÉMON TCG ===\n');
  await client.connect();

  try {
    const gameRes = await client.query(`SELECT id FROM games WHERE slug = 'pokemon'`);
    const pokemonGameId = gameRes.rows[0].id;

    console.log('1. Fetching all Japanese sets from TCGdex API...');
    const setsResp = await fetch('https://api.tcgdex.net/v2/ja/sets');
    const jpSets = await setsResp.json();
    console.log(`✓ Retrieved ${jpSets.length} Japanese expansions.\n`);

    const jpSetMap = new Map(); // set_code -> id
    console.log('2. Syncing Japanese card_sets...');
    
    for (const s of jpSets) {
      const setCode = s.id;
      const setName = s.name || s.id;
      const setSlug = `pokemon-jp-${slugify(setCode)}`;
      
      const res = await client.query(`
        INSERT INTO card_sets (game_id, set_code, slug, name, total_printed_cards, set_type, language, era_block)
        VALUES ($1, $2, $3, $4, $5, 'expansion', 'jp', 'Japanese Series')
        ON CONFLICT (game_id, set_code) DO UPDATE SET
          name = EXCLUDED.name,
          total_printed_cards = EXCLUDED.total_printed_cards,
          language = 'jp'
        RETURNING id, set_code;
      `, [
        pokemonGameId,
        setCode,
        setSlug,
        setName,
        s.cardCount?.official || s.cardCount?.total || 0
      ]);

      jpSetMap.set(setCode, res.rows[0].id);
    }
    console.log(`✓ Synced ${jpSetMap.size} Japanese card_sets into database.\n`);

    // 3. Ingest Cards in concurrent batches of 4 sets
    console.log(`3. Starting card ingestion for ${jpSets.length} Japanese sets...`);
    let totalJpCards = 0;
    let totalJpVariants = 0;
    const globalStart = Date.now();

    const concurrency = 4;
    for (let i = 0; i < jpSets.length; i += concurrency) {
      const setBatch = jpSets.slice(i, i + concurrency);

      await Promise.all(setBatch.map(async (s) => {
        const setCode = s.id;
        const setId = jpSetMap.get(setCode);
        if (!setId) return;

        try {
          const detailRes = await fetch(`https://api.tcgdex.net/v2/ja/sets/${setCode}`);
          if (!detailRes.ok) return;
          const setDetail = await detailRes.json();
          const cards = setDetail.cards;
          if (!Array.isArray(cards) || cards.length === 0) return;

          // Deduplicate card numbers for this set
          const seenNumbers = new Set();
          const cleanCards = [];
          for (let idx = 0; idx < cards.length; idx++) {
            const c = cards[idx];
            let num = String(c.localId || c.id || idx + 1).trim();
            if (num === '') num = String(idx + 1);

            if (seenNumbers.has(num)) {
              let suffix = 2;
              while (seenNumbers.has(`${num}_v${suffix}`)) {
                suffix++;
              }
              num = `${num}_v${suffix}`;
            }
            seenNumbers.add(num);
            cleanCards.push({ ...c, resolved_num: num });
          }

          // Batch insert master cards
          const cardValues = [];
          const cardParams = [];
          let pIdx = 1;

          for (const card of cleanCards) {
            const cardNum = card.resolved_num;
            const offName = card.name || 'Unknown';
            const cleanName = offName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
            const metadata = JSON.stringify({
              tcgdex_id: card.id,
              language: 'jp'
            });

            cardValues.push(`($${pIdx}, $${pIdx+1}, $${pIdx+2}, $${pIdx+3}, $${pIdx+4}, 'Common', 'Pokémon', '{}'::text[], $${pIdx+5})`);
            cardParams.push(pokemonGameId, setId, cardNum, cleanName, offName, metadata);
            pIdx += 6;
          }

          if (cardValues.length > 0) {
            const insertCardSql = `
              INSERT INTO master_cards (
                game_id, set_id, card_number, clean_name, official_name,
                rarity, supertype, subtypes, game_metadata
              ) VALUES ${cardValues.join(', ')}
              ON CONFLICT (set_id, card_number) DO UPDATE SET
                clean_name = EXCLUDED.clean_name,
                official_name = EXCLUDED.official_name
              RETURNING id, card_number;
            `;

            const insertedRes = await client.query(insertCardSql, cardParams);
            const cardIdMap = new Map();
            for (const r of insertedRes.rows) {
              cardIdMap.set(r.card_number, r.id);
            }
            totalJpCards += insertedRes.rows.length;

            // Batch insert variants
            const varValues = [];
            const varParams = [];
            const seenVarKeys = new Set();
            const seenSlugs = new Set();
            let vIdx = 1;

            const is151 = (setCode.toUpperCase() === 'SV2A');

            for (const card of cleanCards) {
              const cardId = cardIdMap.get(card.resolved_num);
              if (!cardId) continue;

              const finishes = [
                { finish: 'regular', print_run: 'unlimited', stamp: 'none' }
              ];

              if (is151) {
                finishes.push({ finish: 'reverse_holo', print_run: 'unlimited', stamp: 'pokeball' });
                finishes.push({ finish: 'masterball_foil', print_run: 'unlimited', stamp: 'masterball' });
              }

              const frontUrl = card.image ? `${card.image}/high.png` : null;

              for (const vf of finishes) {
                const varKey = `${cardId}_${vf.finish}_${vf.stamp}_${vf.print_run}`;
                if (seenVarKeys.has(varKey)) continue;
                seenVarKeys.add(varKey);

                let slug = `pkmn-jp-${setCode}-${card.resolved_num}-${vf.finish}-${vf.stamp}`.toLowerCase().replace(/[^a-z0-9-]/g, '-').slice(0, 280);
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
        } catch (e) {
          // ignore set error and continue
        }
      }));

      const elapsed = ((Date.now() - globalStart) / 1000).toFixed(1);
      const processedCount = Math.min(i + concurrency, jpSets.length);
      if (processedCount % 16 === 0 || processedCount === jpSets.length) {
        console.log(`[${processedCount}/${jpSets.length}] Japanese Sets Processed | Cards: ${totalJpCards.toLocaleString()} | Variants: ${totalJpVariants.toLocaleString()} | Time: ${elapsed}s`);
      }
    }

    const totalDuration = ((Date.now() - globalStart) / 1000).toFixed(1);
    console.log(`\n================ JAPANESE IMPORT FINISHED ================`);
    console.log(`Total Japanese Master Cards: ${totalJpCards.toLocaleString()}`);
    console.log(`Total Japanese Variants:     ${totalJpVariants.toLocaleString()}`);
    console.log(`Total Execution Time:        ${totalDuration}s`);

  } catch (err) {
    console.error('Japanese Import Error:', err);
  } finally {
    await client.end();
  }
}

bulkImportJapanese();
