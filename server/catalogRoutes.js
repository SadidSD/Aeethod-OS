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

export default router;
