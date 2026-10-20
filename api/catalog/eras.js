import { pool, normalizeEra } from '../_db.js';

export default async function handler(req, res) {
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
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    res.status(200).json(eras);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
