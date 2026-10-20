import { pool } from '../_db.js';

export default async function handler(req, res) {
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
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    res.status(200).json(gamesQuery.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
