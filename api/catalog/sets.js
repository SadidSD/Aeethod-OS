import { pool, normalizeEra } from '../_db.js';

export default async function handler(req, res) {
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

    let rows = result.rows;
    if (eraId && eraId !== 'all') {
      rows = rows.filter(s => normalizeEra(s.era_block, s.set_code).id === eraId);
    }

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
