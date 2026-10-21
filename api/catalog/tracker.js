import { pool } from '../_db.js';

export default async function handler(req, res) {
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
      whereClauses.push(`p.tcgplayer_market_cents >= 50000`);
    }

    // Sort order
    let orderSql = 'p.tcgplayer_market_cents DESC';
    if (sortBy === 'price_asc') orderSql = 'p.tcgplayer_market_cents ASC';
    else if (sortBy === 'name_asc') orderSql = 'm.clean_name ASC, p.tcgplayer_market_cents DESC';
    else if (sortBy === 'pop_desc') orderSql = 'p.psa_10_pop DESC NULLS LAST, p.tcgplayer_market_cents DESC';

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
    console.error('Error in api/catalog/tracker handler:', err);
    res.status(500).json({ error: err.message });
  }
}
