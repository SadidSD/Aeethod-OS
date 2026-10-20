import { pool } from '../_db.js';

export default async function handler(req, res) {
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

    if (sortBy === 'price_desc') {
      sql += ` ORDER BY top_market_cents DESC NULLS LAST, LPAD(regexp_replace(m.card_number, '[^0-9]', '', 'g'), 10, '0') ASC`;
    } else if (sortBy === 'price_asc') {
      sql += ` ORDER BY min_market_cents ASC NULLS LAST, LPAD(regexp_replace(m.card_number, '[^0-9]', '', 'g'), 10, '0') ASC`;
    } else if (sortBy === 'name_asc') {
      sql += ` ORDER BY m.clean_name ASC, LPAD(regexp_replace(m.card_number, '[^0-9]', '', 'g'), 10, '0') ASC`;
    } else {
      sql += ` ORDER BY LPAD(regexp_replace(m.card_number, '[^0-9]', '', 'g'), 10, '0') ASC, m.card_number ASC`;
    }

    const offset = (Math.max(1, parseInt(page)) - 1) * parseInt(limit);
    params.push(parseInt(limit), offset);
    sql += ` LIMIT $${pIdx++} OFFSET $${pIdx++}`;

    const cardsResult = await pool.query(sql, params);

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

    const setRes = await pool.query(`SELECT id, set_code, name, language, era_block, release_date, total_printed_cards FROM card_sets WHERE id = $1`, [setId]);

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    res.status(200).json({
      set: setRes.rows[0],
      totalCards: parseInt(countRes.rows[0].count),
      page: parseInt(page),
      limit: parseInt(limit),
      cards: cardsResult.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
