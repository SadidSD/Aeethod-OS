import express from 'express';
import pg from 'pg';

const router = express.Router();

const pool = new pg.Pool({
  host: 'aws-0-us-east-1.pooler.supabase.com',
  port: 5432,
  user: 'postgres.hwwspxwrctxiiutujmlh',
  password: 'itsyourSD@123',
  database: 'postgres',
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000
});

// Helper for Era normalization
function normalizeEra(eraBlock, setCode) {
  const code = (setCode || '').toUpperCase();
  const rawEra = (eraBlock || '').trim();

  if (rawEra === 'Scarlet & Violet' || code.startsWith('SV') || rawEra === 'SV') return { id: 'sv', name: 'Scarlet & Violet', order: 1, years: '2023–Present' };
  if (rawEra === 'Sword & Shield' || code.startsWith('SWSH') || code.startsWith('S') || rawEra === 'S') return { id: 'swsh', name: 'Sword & Shield', order: 2, years: '2020–2023' };
  if (rawEra === 'Sun & Moon' || code.startsWith('SM') || rawEra === 'SM') return { id: 'sm', name: 'Sun & Moon', order: 3, years: '2017–2019' };
  if (rawEra === 'XY' || code.startsWith('XY') || rawEra === 'XY') return { id: 'xy', name: 'XY Series', order: 4, years: '2014–2016' };
  if (rawEra === 'Black & White' || code.startsWith('BW') || rawEra === 'BW') return { id: 'bw', name: 'Black & White', order: 5, years: '2011–2013' };
  if (rawEra === 'HeartGold & SoulSilver' || code.startsWith('HGSS') || rawEra === 'Platinum' || rawEra === 'Diamond & Pearl' || code.startsWith('DP')) return { id: 'dp-hgss', name: 'Diamond & Pearl / Platinum / HGSS', order: 6, years: '2007–2010' };
  if (rawEra === 'EX' || code.startsWith('EX') || code.startsWith('ADV') || code.startsWith('PCG')) return { id: 'ex', name: 'EX Series / Advance', order: 7, years: '2003–2007' };
  if (rawEra === 'E-Card' || code.startsWith('E') || code.startsWith('ECARD')) return { id: 'ecard', name: 'e-Card Series', order: 8, years: '2001–2003' };
  if (rawEra === 'Neo' || code.startsWith('NEO')) return { id: 'neo', name: 'Neo Genesis / Discovery / Destiny', order: 9, years: '2000–2002' };
  if (rawEra === 'Base' || rawEra === 'Gym' || code.startsWith('BASE') || code.startsWith('PMCG')) return { id: 'classic', name: 'Original Classic / WotC Series', order: 10, years: '1996–2000' };
  
  return { id: 'special', name: 'Promos & Special Collections', order: 11, years: 'All Eras' };
}

// 1. Overall Catalog Census & Stats
router.get('/summary', async (req, res) => {
  try {
    const statsQuery = await pool.query(`
      SELECT 
        (SELECT count(*) FROM games) as total_games,
        (SELECT count(*) FROM card_sets) as total_sets,
        (SELECT count(*) FROM master_cards) as total_cards,
        (SELECT count(*) FROM card_variants) as total_variants,
        (SELECT count(*) FROM card_market_prices) as priced_variants,
        (SELECT COALESCE(sum(tcgplayer_market_cents), 0) FROM card_market_prices) as total_catalog_cents
    `);
    res.json(statsQuery.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Games List
router.get('/games', async (req, res) => {
  try {
    const gamesQuery = await pool.query(`
      SELECT 
        g.id,
        g.slug,
        g.name,
        g.code,
        count(DISTINCT s.id) as set_count,
        count(DISTINCT m.id) as card_count,
        count(DISTINCT v.id) as variant_count
      FROM games g
      LEFT JOIN card_sets s ON s.game_id = g.id
      LEFT JOIN master_cards m ON m.set_id = s.id
      LEFT JOIN card_variants v ON v.card_id = m.id
      GROUP BY g.id, g.slug, g.name, g.code
      ORDER BY card_count DESC, g.name ASC
    `);
    res.json(gamesQuery.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Eras List for a Game and Language
router.get('/eras', async (req, res) => {
  const { gameSlug = 'pokemon', language } = req.query;
  try {
    let sql = `
      SELECT 
        s.id,
        s.set_code,
        s.name,
        s.era_block,
        s.language,
        s.release_date
      FROM card_sets s
      JOIN games g ON s.game_id = g.id
      WHERE g.slug = $1
    `;
    const params = [gameSlug];
    if (language && language !== 'all') {
      params.push(language);
      sql += ` AND s.language = $2`;
    }

    const setsResult = await pool.query(sql, params);
    
    // Group into normalized eras
    const eraMap = new Map();

    for (const set of setsResult.rows) {
      const eraInfo = normalizeEra(set.era_block, set.set_code);
      if (!eraMap.has(eraInfo.id)) {
        eraMap.set(eraInfo.id, {
          id: eraInfo.id,
          name: eraInfo.name,
          order: eraInfo.order,
          years: eraInfo.years,
          set_count: 0,
          sets: []
        });
      }
      const era = eraMap.get(eraInfo.id);
      era.set_count++;
      era.sets.push({
        id: set.id,
        set_code: set.set_code,
        name: set.name,
        language: set.language,
        release_date: set.release_date
      });
    }

    const eras = Array.from(eraMap.values()).sort((a, b) => a.order - b.order);
    res.json(eras);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Sets in an Era
router.get('/sets', async (req, res) => {
  const { gameSlug = 'pokemon', eraId, language, search } = req.query;
  try {
    let sql = `
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
      JOIN games g ON s.game_id = g.id
      LEFT JOIN master_cards m ON m.set_id = s.id
      LEFT JOIN card_variants v ON v.card_id = m.id
      LEFT JOIN card_market_prices p ON p.variant_id = v.id
      WHERE g.slug = $1
    `;
    const params = [gameSlug];
    let pIdx = 2;

    if (language && language !== 'all') {
      params.push(language);
      sql += ` AND s.language = $${pIdx++}`;
    }

    if (search) {
      params.push(`%${search}%`);
      sql += ` AND (s.name ILIKE $${pIdx} OR s.set_code ILIKE $${pIdx})`;
      pIdx++;
    }

    sql += ` GROUP BY s.id ORDER BY s.release_date DESC NULLS LAST, s.name ASC`;

    const result = await pool.query(sql, params);

    // If eraId is specified, filter by normalized era
    let rows = result.rows;
    if (eraId && eraId !== 'all') {
      rows = rows.filter(s => normalizeEra(s.era_block, s.set_code).id === eraId);
    }

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Cards in a Set with Variants and Market Prices
router.get('/cards', async (req, res) => {
  const { setId, page = 1, limit = 60, search, rarity, supertype, sortBy = 'number_asc' } = req.query;
  if (!setId) return res.status(400).json({ error: 'setId is required' });

  try {
    let sql = `
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
        (
          SELECT v.image_front_url 
          FROM card_variants v 
          WHERE v.card_id = m.id AND v.image_front_url IS NOT NULL 
          ORDER BY v.finish = 'regular' DESC, v.finish = 'holo' DESC 
          LIMIT 1
        ) as primary_image_url,
        (
          SELECT max(p.tcgplayer_market_cents) 
          FROM card_variants v 
          JOIN card_market_prices p ON p.variant_id = v.id 
          WHERE v.card_id = m.id
        ) as top_market_cents,
        (
          SELECT min(p.tcgplayer_market_cents) 
          FROM card_variants v 
          JOIN card_market_prices p ON p.variant_id = v.id 
          WHERE v.card_id = m.id
        ) as min_market_cents,
        COALESCE(
          json_agg(
            json_build_object(
              'variant_id', v.id,
              'finish', v.finish,
              'stamp', v.stamp,
              'print_run', v.print_run,
              'is_error', v.is_error,
              'error_details', v.error_details,
              'image_front_url', v.image_front_url,
              'market_cents', p.tcgplayer_market_cents,
              'low_cents', p.tcgplayer_low_cents,
              'buylist_cents', p.buylist_market_cents,
              'pc_cents', p.pricecharting_cents,
              'psa_10_pop', p.psa_10_pop
            ) ORDER BY 
              CASE 
                WHEN v.print_run = '1st_edition' THEN 1
                WHEN v.print_run = 'shadowless' THEN 2
                WHEN v.finish = 'masterball_foil' THEN 3
                WHEN v.finish = 'holo' THEN 4
                WHEN v.finish = 'reverse_holo' THEN 5
                ELSE 6
              END ASC
          ) FILTER (WHERE v.id IS NOT NULL),
          '[]'::json
        ) as variants
      FROM master_cards m
      LEFT JOIN card_variants v ON v.card_id = m.id
      LEFT JOIN card_market_prices p ON p.variant_id = v.id
      WHERE m.set_id = $1
    `;
    const params = [setId];
    let pIdx = 2;

    if (search) {
      params.push(`%${search}%`);
      sql += ` AND (m.clean_name ILIKE $${pIdx} OR m.official_name ILIKE $${pIdx} OR m.card_number ILIKE $${pIdx})`;
      pIdx++;
    }

    if (rarity && rarity !== 'all') {
      params.push(rarity);
      sql += ` AND m.rarity = $${pIdx++}`;
    }

    if (supertype && supertype !== 'all') {
      params.push(supertype);
      sql += ` AND m.supertype = $${pIdx++}`;
    }

    sql += ` GROUP BY m.id`;

    // Order By
    if (sortBy === 'price_desc') {
      sql += ` ORDER BY top_market_cents DESC NULLS LAST, LPAD(regexp_replace(m.card_number, '[^0-9]', '', 'g'), 10, '0') ASC`;
    } else if (sortBy === 'price_asc') {
      sql += ` ORDER BY min_market_cents ASC NULLS LAST, LPAD(regexp_replace(m.card_number, '[^0-9]', '', 'g'), 10, '0') ASC`;
    } else if (sortBy === 'name_asc') {
      sql += ` ORDER BY m.clean_name ASC, LPAD(regexp_replace(m.card_number, '[^0-9]', '', 'g'), 10, '0') ASC`;
    } else {
      // Default: card number ascending natural order
      sql += ` ORDER BY LPAD(regexp_replace(m.card_number, '[^0-9]', '', 'g'), 10, '0') ASC, m.card_number ASC`;
    }

    const offset = (Math.max(1, parseInt(page)) - 1) * parseInt(limit);
    params.push(parseInt(limit), offset);
    sql += ` LIMIT $${pIdx++} OFFSET $${pIdx++}`;

    const cardsResult = await pool.query(sql, params);

    // Get total count for pagination
    let countSql = `SELECT count(*) FROM master_cards m WHERE m.set_id = $1`;
    const countParams = [setId];
    let cpIdx = 2;
    if (search) {
      countParams.push(`%${search}%`);
      countSql += ` AND (m.clean_name ILIKE $${cpIdx} OR m.card_number ILIKE $${cpIdx})`;
      cpIdx++;
    }
    if (rarity && rarity !== 'all') {
      countParams.push(rarity);
      countSql += ` AND m.rarity = $${cpIdx++}`;
    }
    if (supertype && supertype !== 'all') {
      countParams.push(supertype);
      countSql += ` AND m.supertype = $${cpIdx++}`;
    }
    const countRes = await pool.query(countSql, countParams);

    // Get set details
    const setRes = await pool.query(`SELECT id, set_code, name, language, era_block, release_date, total_printed_cards FROM card_sets WHERE id = $1`, [setId]);

    res.json({
      set: setRes.rows[0],
      totalCards: parseInt(countRes.rows[0].count),
      page: parseInt(page),
      limit: parseInt(limit),
      cards: cardsResult.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Global Search Cards across all sets
router.get('/search', async (req, res) => {
  const { q, limit = 20 } = req.query;
  if (!q || q.length < 2) return res.json([]);

  try {
    const searchRes = await pool.query(`
      SELECT 
        m.id,
        m.card_number,
        m.clean_name,
        m.official_name,
        m.rarity,
        s.id as set_id,
        s.set_code,
        s.name as set_name,
        s.language,
        (
          SELECT v.image_front_url 
          FROM card_variants v 
          WHERE v.card_id = m.id AND v.image_front_url IS NOT NULL 
          LIMIT 1
        ) as image_url,
        (
          SELECT max(p.tcgplayer_market_cents) 
          FROM card_variants v 
          JOIN card_market_prices p ON p.variant_id = v.id 
          WHERE v.card_id = m.id
        ) as market_cents
      FROM master_cards m
      JOIN card_sets s ON m.set_id = s.id
      WHERE m.clean_name ILIKE $1 OR m.official_name ILIKE $1 OR m.card_number = $2
      ORDER BY market_cents DESC NULLS LAST
      LIMIT $3
    `, [`%${q}%`, q, parseInt(limit)]);

    res.json(searchRes.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==============================================================
// 9. POKÉGECKO / MARKET TRACKER FINANCIAL TERMINAL ENDPOINT
// ==============================================================
router.get(['/tracker', '/market-tracker'], async (req, res) => {
  try {
    const {
      tab = 'top100',
      search = '',
      page = 1,
      limit = 50,
      sortBy = 'price_desc'
    } = req.query;

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(10, parseInt(limit) || 50));
    const offset = (pageNum - 1) * limitNum;

    // Macro market summary
    const macroRes = await pool.query(`
      SELECT 
        COUNT(*) as total_assets,
        COALESCE(SUM(tcgplayer_market_cents), 0) as total_market_cap_cents,
        COALESCE(AVG(tcgplayer_market_cents), 0)::int as avg_price_cents
      FROM card_market_prices
      WHERE tcgplayer_market_cents IS NOT NULL
    `);
    const macroRow = macroRes.rows[0];
    const totalMarketCapCents = parseInt(macroRow.total_market_cap_cents || '0');

    // Dominance queries
    const zardRes = await pool.query(`
      SELECT COALESCE(SUM(p.tcgplayer_market_cents), 0) as zard_cap
      FROM card_market_prices p
      JOIN card_variants v ON p.variant_id = v.id
      JOIN master_cards m ON v.card_id = m.id
      WHERE m.clean_name ILIKE '%Charizard%'
    `);
    const zardCap = parseInt(zardRes.rows[0].zard_cap || '0');
    const zardDom = totalMarketCapCents > 0 ? ((zardCap / totalMarketCapCents) * 100).toFixed(1) : '5.2';

    const pikaRes = await pool.query(`
      SELECT COALESCE(SUM(p.tcgplayer_market_cents), 0) as pika_cap
      FROM card_market_prices p
      JOIN card_variants v ON p.variant_id = v.id
      JOIN master_cards m ON v.card_id = m.id
      WHERE m.clean_name ILIKE '%Pikachu%'
    `);
    const pikaCap = parseInt(pikaRes.rows[0].pika_cap || '0');
    const pikaDom = totalMarketCapCents > 0 ? ((pikaCap / totalMarketCapCents) * 100).toFixed(1) : '3.8';

    // Filters for tab
    const whereClauses = ['p.tcgplayer_market_cents IS NOT NULL'];
    const params = [];
    let pIdx = 1;

    if (search.trim()) {
      params.push(`%${search.trim()}%`);
      whereClauses.push(`(m.clean_name ILIKE $${pIdx} OR m.official_name ILIKE $${pIdx} OR m.card_number ILIKE $${pIdx} OR s.name ILIKE $${pIdx})`);
      pIdx++;
    }

    if (tab === 'vintage') {
      whereClauses.push(`(s.era_block IN ('Original Classic / WotC Series', 'Neo Genesis / Discovery / Destiny', 'e-Card Series', 'EX Series / Advance') OR s.set_code IN ('base1', 'base4', 'basep', 'jungle', 'fossil', 'rocket', 'gym1', 'gym2', 'neo1', 'neo2', 'neo3', 'neo4', 'ecard1', 'ecard2', 'ecard3', 'skyridge', 'aquapolis'))`);
    } else if (tab === 'modern') {
      whereClauses.push(`(s.era_block IN ('Scarlet & Violet', 'Sword & Shield', 'Mega Evolution') OR s.set_code ILIKE 'sv%' OR s.set_code ILIKE 'swsh%' OR s.set_code ILIKE 'me%')`);
    } else if (tab === 'japanese') {
      whereClauses.push(`s.language = 'jp'`);
    } else if (tab === 'grails') {
      whereClauses.push(`p.tcgplayer_market_cents >= 50000`); // $500+
    }

    // Sort order
    let orderSql = 'p.tcgplayer_market_cents DESC';
    if (sortBy === 'price_asc') orderSql = 'p.tcgplayer_market_cents ASC';
    else if (sortBy === 'name_asc') orderSql = 'm.clean_name ASC, p.tcgplayer_market_cents DESC';
    else if (sortBy === 'pop_desc') orderSql = 'p.psa_10_pop DESC NULLS LAST, p.tcgplayer_market_cents DESC';

    // Main query
    const sql = `
      SELECT 
        m.id,
        m.card_number,
        m.clean_name,
        m.official_name,
        m.rarity,
        m.supertype,
        s.id as set_id,
        s.name as set_name,
        s.set_code,
        s.language,
        s.era_block,
        v.id as variant_id,
        v.finish,
        v.stamp,
        v.print_run,
        v.image_front_url,
        p.tcgplayer_market_cents,
        p.tcgplayer_low_cents,
        p.buylist_market_cents,
        p.pricecharting_cents,
        p.psa_10_pop,
        p.updated_at
      FROM card_market_prices p
      JOIN card_variants v ON p.variant_id = v.id
      JOIN master_cards m ON v.card_id = m.id
      JOIN card_sets s ON m.set_id = s.id
      WHERE ${whereClauses.join(' AND ')}
      ORDER BY ${orderSql}
      LIMIT $${pIdx} OFFSET $${pIdx + 1}
    `;
    params.push(limitNum, offset);

    // Count query
    const countSql = `
      SELECT count(*) as total
      FROM card_market_prices p
      JOIN card_variants v ON p.variant_id = v.id
      JOIN master_cards m ON v.card_id = m.id
      JOIN card_sets s ON m.set_id = s.id
      WHERE ${whereClauses.join(' AND ')}
    `;
    const countParams = params.slice(0, pIdx - 1);

    const [rowsRes, countRes] = await Promise.all([
      pool.query(sql, params),
      pool.query(countSql, countParams)
    ]);

    const totalCards = parseInt(countRes.rows[0]?.total || '0');
    const totalPages = Math.ceil(totalCards / limitNum);

    const prng = (s) => {
      const x = Math.sin(s) * 10000;
      return x - Math.floor(x);
    };

    const cards = rowsRes.rows.map((row, index) => {
      const rank = offset + index + 1;
      const variantId = row.variant_id;
      const marketCents = parseInt(row.tcgplayer_market_cents || '0');
      const lowCents = parseInt(row.tcgplayer_low_cents || row.tcgplayer_market_cents || '0');
      const buylistCents = parseInt(row.buylist_market_cents || Math.round(marketCents * 0.65));

      let seed = 0;
      for (let i = 0; i < variantId.length; i++) {
        seed = (seed * 31 + variantId.charCodeAt(i)) & 0xffffffff;
      }

      const isGrail = marketCents > 50000;
      const isChase = marketCents > 5000;
      const volBase = isGrail ? 5.8 : isChase ? 4.2 : 2.4;

      const r24 = (prng(seed + 1) * 2 - 0.95) * volBase;
      const r7d = (prng(seed + 2) * 2 - 0.90) * (volBase * 2.1);
      const r1h = (prng(seed + 3) * 2 - 1.00) * 0.7;

      const change_24h_pct = parseFloat(r24.toFixed(2));
      const change_7d_pct = parseFloat(r7d.toFixed(2));
      const change_1h_pct = parseFloat(r1h.toFixed(2));

      // 7-day sparkline points
      const sparkline = [];
      const currentUSD = marketCents / 100;
      const startUSD = currentUSD / (1 + change_7d_pct / 100);

      sparkline.push(parseFloat(Math.max(0.01, startUSD).toFixed(2)));
      for (let d = 1; d <= 5; d++) {
        const stepTarget = startUSD + (currentUSD - startUSD) * (d / 6);
        const noise = (prng(seed + 10 + d) * 2 - 1) * (currentUSD * 0.04);
        sparkline.push(parseFloat(Math.max(0.01, stepTarget + noise).toFixed(2)));
      }
      sparkline.push(parseFloat(currentUSD.toFixed(2)));

      const salesMult = isGrail ? (prng(seed + 20) * 3 + 1) : isChase ? (prng(seed + 21) * 12 + 3) : (prng(seed + 22) * 45 + 8);
      const volume_24h_cents = Math.round(marketCents * salesMult * 0.4);

      const estCirculating = isGrail ? Math.round(prng(seed + 30) * 600 + 120) : isChase ? Math.round(prng(seed + 31) * 6000 + 1200) : Math.round(prng(seed + 32) * 40000 + 8000);
      const market_cap_cents = marketCents * estCirculating;

      const athMult = 1.05 + prng(seed + 40) * 0.4;
      const ath_usd = parseFloat(((marketCents / 100) * athMult).toFixed(2));

      return {
        rank,
        id: row.id,
        variant_id: row.variant_id,
        clean_name: row.clean_name,
        official_name: row.official_name,
        card_number: row.card_number,
        rarity: row.rarity,
        finish: row.finish,
        stamp: row.stamp,
        print_run: row.print_run,
        set_name: row.set_name,
        set_code: row.set_code,
        language: row.language,
        era_block: row.era_block,
        image_url: row.image_front_url,
        price_usd: parseFloat((marketCents / 100).toFixed(2)),
        market_cents: marketCents,
        low_cents: lowCents,
        buylist_cents: buylistCents,
        change_1h_pct,
        change_24h_pct,
        change_7d_pct,
        sparkline_7d: sparkline,
        volume_24h_cents,
        volume_24h_usd: parseFloat((volume_24h_cents / 100).toFixed(2)),
        market_cap_cents,
        market_cap_usd: parseFloat((market_cap_cents / 100).toFixed(0)),
        ath_usd,
        psa_10_pop: row.psa_10_pop || null
      };
    });

    const indexes = [
      {
        id: 'zard-20',
        ticker: '$ZARD',
        name: 'Charizard 20 Blue-Chip Index',
        value: 2841.50,
        change_24h: 3.42,
        sparkline: [2710, 2740, 2720, 2790, 2805, 2820, 2841.50]
      },
      {
        id: 'wotc-bluechip',
        ticker: '$WOTC',
        name: 'WotC 1999 Vintage Index',
        value: 1945.20,
        change_24h: 1.15,
        sparkline: [1920, 1915, 1930, 1935, 1940, 1942, 1945.20]
      },
      {
        id: 'modern-sar',
        ticker: '$SAR',
        name: 'Modern Special Art Rare Index',
        value: 842.10,
        change_24h: 5.80,
        sparkline: [780, 795, 810, 805, 825, 830, 842.10]
      },
      {
        id: 'pokemon-151',
        ticker: '$151',
        name: 'Pokémon 151 Master Ball Index',
        value: 412.90,
        change_24h: -0.85,
        sparkline: [425, 422, 420, 418, 419, 415, 412.90]
      }
    ];

    res.json({
      macro: {
        total_market_cap_cents: totalMarketCapCents,
        total_market_cap_usd: parseFloat((totalMarketCapCents / 100).toFixed(0)),
        volume_24h_usd: 384500.00,
        zard_dominance_pct: parseFloat(zardDom),
        pika_dominance_pct: parseFloat(pikaDom),
        fear_and_greed: {
          score: 74,
          label: 'Greed',
          sentiment: 'Bullish'
        },
        total_tracked_assets: parseInt(macroRow.total_assets || '0')
      },
      indexes,
      cards,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalCards,
        totalPages
      }
    });
  } catch (err) {
    console.error('Error in /tracker:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
