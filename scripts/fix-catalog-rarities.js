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

const CACHE_DIR = path.resolve('data/tcgplayer_cache');

function normNum(n) {
  if (!n) return '';
  return String(n)
    .split('/')[0]
    .replace(/^0+/, '')
    .trim()
    .toLowerCase();
}

function normName(name) {
  if (!name) return '';
  return String(name)
    .toLowerCase()
    .replace(/^pokemon\s+(japan\s+)?/i, '')
    .replace(/^pokémon\s+(japan\s+)?/i, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

async function main() {
  console.log('=== AEETHOD OS: UNLOGGED STAGING REPAIR ===\n');
  const start = Date.now();
  await client.connect();

  // 1. LOAD SETS
  console.log('1. Loading card sets from database...');
  const setsRes = await client.query('SELECT id, set_code, slug, name, language FROM card_sets');
  const allDbSets = setsRes.rows;
  console.log(`   ✓ Loaded ${allDbSets.length} sets.\n`);

  const enSets = allDbSets.filter(s => s.language === 'en');
  const jpSets = allDbSets.filter(s => s.language === 'jp');

  const enSetByCode = new Map(enSets.map(s => [s.set_code.toLowerCase(), s]));
  const enSetByName = new Map(enSets.map(s => [normName(s.name), s]));
  const jpSetByCode = new Map(jpSets.map(s => [s.set_code.toUpperCase(), s]));

  // 2. MAP GROUPS
  const cat3Groups = JSON.parse(fs.readFileSync(path.join(CACHE_DIR, 'cat_3/groups.json'), 'utf8'));
  const cat85Groups = JSON.parse(fs.readFileSync(path.join(CACHE_DIR, 'cat_85/groups.json'), 'utf8'));

  const enOverrides = {
    604: 'base1', 1663: 'base1', 605: 'base4', 1418: 'basep', 1423: 'np', 1455: 'bp',
    1393: 'ex1', 1430: 'dp1', 1421: 'dpp', 1453: 'hsp', 1407: 'bwp', 1451: 'xyp',
    1861: 'smp', 2545: 'swshp', 22872: 'svp', 23237: 'sv3pt5', 22873: 'sv1',
    2585: 'swsh1', 1863: 'sm1', 1387: 'xy1', 1406: 'bw1', 1454: 'hgss1',
    24722: 'me55', 24837: 'me55c'
  };

  const jpOverrides = {
    23730: 'PMCG1', 23722: 'PMCG2', 23723: 'PMCG3', 23724: 'PMCG4',
    24141: 'web1', 24180: 'VS1', 23599: 'SV2a', 23645: 'S12a',
    23606: 'SV1V', 23909: 'SV8a', 23600: 'SV3a'
  };

  const jobs = [];

  for (const g of cat3Groups) {
    if (enOverrides[g.groupId]) {
      const dbSet = enSetByCode.get(enOverrides[g.groupId].toLowerCase());
      if (dbSet) {
        jobs.push({ catId: 3, groupId: g.groupId, setCode: dbSet.set_code });
        continue;
      }
    }
    const normGroupName = normName(g.name);
    let matched = enSetByName.get(normGroupName);
    if (!matched) {
      matched = enSets.find(s => {
        const sNorm = normName(s.name);
        return normGroupName.includes(sNorm) || sNorm.includes(normGroupName);
      });
    }
    if (matched) {
      jobs.push({ catId: 3, groupId: g.groupId, setCode: matched.set_code });
    }
  }

  for (const g of cat85Groups) {
    if (jpOverrides[g.groupId]) {
      const dbSet = jpSetByCode.get(jpOverrides[g.groupId].toUpperCase());
      if (dbSet) {
        jobs.push({ catId: 85, groupId: g.groupId, setCode: dbSet.set_code });
        continue;
      }
    }
    if (g.abbreviation) {
      const byAbbr = jpSetByCode.get(g.abbreviation.toUpperCase());
      if (byAbbr) {
        jobs.push({ catId: 85, groupId: g.groupId, setCode: byAbbr.set_code });
        continue;
      }
    }
    const prefixMatch = g.name.match(/^([a-zA-Z0-9.\-_]+):/);
    if (prefixMatch) {
      const byPrefix = jpSetByCode.get(prefixMatch[1].toUpperCase());
      if (byPrefix) {
        jobs.push({ catId: 85, groupId: g.groupId, setCode: byPrefix.set_code });
        continue;
      }
    }
  }

  console.log(`   ✓ Mapped ${jobs.length} set files.\n`);

  // 3. EXTRACT ALL RARITIES IN RAM
  console.log('2. Aggregating rarities from local cache into memory...');
  const stagingRows = [];
  const seenKey = new Set();

  for (const j of jobs) {
    const prodFile = path.join(CACHE_DIR, `cat_${j.catId}/${j.groupId}_products.json`);
    if (!fs.existsSync(prodFile)) continue;

    const prods = JSON.parse(fs.readFileSync(prodFile, 'utf8'));
    for (const p of prods) {
      const rarity = p.extendedData?.find(e => e.name === 'Rarity')?.value;
      if (!rarity || rarity.toLowerCase() === 'none') continue;

      const extNum = p.extendedData?.find(e => e.name === 'Number')?.value;
      const numMatch = extNum || p.name.match(/-\s*([0-9a-zA-Z]+(?:\/[0-9a-zA-Z]+)?)/)?.[1];
      const cardNum = normNum(numMatch);
      const cleanName = normName(p.cleanName || p.name);

      const k = `${j.setCode}_${cardNum}_${cleanName}`;
      if (seenKey.has(k)) continue;
      seenKey.add(k);

      stagingRows.push({
        setCode: j.setCode,
        cardNum: cardNum,
        cleanName: cleanName,
        rarity: rarity
      });
    }
  }

  // Also extract from TCGdex for Japanese
  const tcgdexBase = path.resolve('data/tcgdex-cards-database/data-asia');
  if (fs.existsSync(tcgdexBase)) {
    const seriesList = fs.readdirSync(tcgdexBase);
    for (const series of seriesList) {
      const sp = path.join(tcgdexBase, series);
      if (!fs.statSync(sp).isDirectory()) continue;
      for (const setDir of fs.readdirSync(sp)) {
        const sdp = path.join(sp, setDir);
        if (!fs.statSync(sdp).isDirectory()) continue;

        const setFiles = fs.readdirSync(sdp).filter(f => f.endsWith('.ts'));
        for (const cf of setFiles) {
          const cardNum = normNum(cf.replace(/\.ts$/, ''));
          const content = fs.readFileSync(path.join(sdp, cf), 'utf8');
          const rMatch = content.match(/rarity:\s*['"]([^'"]+)['"]/);
          if (rMatch && rMatch[1] && rMatch[1].toLowerCase() !== 'common') {
            const k = `${setDir}_${cardNum}`;
            if (seenKey.has(k)) continue;
            seenKey.add(k);
            stagingRows.push({
              setCode: setDir,
              cardNum: cardNum,
              cleanName: '',
              rarity: rMatch[1]
            });
          }
        }
      }
    }
  }

  console.log(`   ✓ Extracted ${stagingRows.length.toLocaleString()} verified rarities in memory.\n`);

  // 4. CREATE UNLOGGED TABLE & BULK INSERT
  console.log('3. Streaming staging table into PostgreSQL...');
  await client.query(`
    CREATE UNLOGGED TABLE IF NOT EXISTS tmp_card_rarities (
      set_code text,
      card_num text,
      clean_name text,
      rarity text
    );
    TRUNCATE TABLE tmp_card_rarities;
  `);

  const batchSize = 1000;
  for (let i = 0; i < stagingRows.length; i += batchSize) {
    const chunk = stagingRows.slice(i, i + batchSize);
    const values = [];
    const params = [];
    let p = 1;

    for (const r of chunk) {
      values.push(`($${p++}, $${p++}, $${p++}, $${p++})`);
      params.push(r.setCode, r.cardNum, r.cleanName, r.rarity);
    }

    await client.query(`
      INSERT INTO tmp_card_rarities (set_code, card_num, clean_name, rarity)
      VALUES ${values.join(', ')}
    `, params);

    if ((i + batchSize) % 10000 === 0 || i + batchSize >= stagingRows.length) {
      console.log(`   Pushed: ${Math.min(i + batchSize, stagingRows.length)} / ${stagingRows.length} rows.`);
    }
  }

  // 5. RUN INSTANT SET-LEVEL UPDATE VIA STAGING TABLE
  console.log('\n4. Executing high-speed JOIN UPDATE on master_cards...');
  const updateRes1 = await client.query(`
    UPDATE master_cards m
    SET rarity = t.rarity
    FROM tmp_card_rarities t
    JOIN card_sets s ON LOWER(s.set_code) = LOWER(t.set_code)
    WHERE m.set_id = s.id
      AND t.card_num <> ''
      AND (
        LOWER(TRIM(LEADING '0' FROM m.card_number)) = LOWER(TRIM(LEADING '0' FROM t.card_num))
        OR LOWER(split_part(m.card_number, '/', 1)) = LOWER(t.card_num)
        OR LOWER(m.card_number) = LOWER(t.card_num)
      )
      AND m.rarity <> t.rarity;
  `);
  console.log(`   ✓ By-Card-Number Update: ${updateRes1.rowCount} master cards updated.`);

  const updateRes2 = await client.query(`
    UPDATE master_cards m
    SET rarity = t.rarity
    FROM tmp_card_rarities t
    JOIN card_sets s ON LOWER(s.set_code) = LOWER(t.set_code)
    WHERE m.set_id = s.id
      AND t.clean_name <> ''
      AND LOWER(REGEXP_REPLACE(m.clean_name, '[^a-zA-Z0-9]', '', 'g')) = LOWER(t.clean_name)
      AND m.rarity = 'Common'
      AND t.rarity <> 'Common';
  `);
  console.log(`   ✓ By-Clean-Name Update: ${updateRes2.rowCount} additional cards updated.`);

  // 6. UPGRADE CARD VARIANTS FROM 'REGULAR' TO 'HOLO' FOR HOLO-EXCLUSIVE RARITIES
  console.log('\n5. Upgrading card_variants to "holo" for special chase cards...');
  const variantUpgradeRes = await client.query(`
    UPDATE card_variants v
    SET finish = 'holo'
    FROM master_cards m
    WHERE v.card_id = m.id
      AND v.finish = 'regular'
      AND (
        m.rarity ILIKE '%RGB%'
        OR m.rarity ILIKE '%Illustration%'
        OR m.rarity ILIKE '%Special%'
        OR m.rarity ILIKE '%Secret%'
        OR m.rarity ILIKE '%Ultra%'
        OR m.rarity ILIKE '%Hyper%'
        OR m.rarity ILIKE '%Futuristic%'
        OR m.rarity ILIKE '%SAR%'
        OR m.rarity ILIKE '%Art Rare%'
        OR m.rarity ILIKE '%Double Rare%'
        OR m.rarity ILIKE '%Triple Rare%'
        OR m.rarity ILIKE '%Radiant%'
        OR m.rarity ILIKE '%Super Rare%'
        OR m.rarity ILIKE '%Amazing Rare%'
        OR m.rarity ILIKE '%Shiny Secret%'
      );
  `);
  console.log(`   ✓ Upgraded ${variantUpgradeRes.rowCount} variants from 'regular' to 'holo'.\n`);

  // Drop staging table
  await client.query('DROP TABLE IF EXISTS tmp_card_rarities;');

  // 7. VERIFY MEW 30TH CELEBRATION SPECIFICALLY
  console.log('6. Verifying 30th Celebration Mew cards in master_cards:');
  const verifyMews = await client.query(`
    SELECT m.card_number, m.clean_name, m.rarity, v.id as variant_id, v.finish
    FROM master_cards m
    JOIN card_sets s ON m.set_id = s.id
    JOIN card_variants v ON v.card_id = m.id
    WHERE s.set_code = 'me55' AND m.card_number IN ('R', 'G', 'B')
    ORDER BY m.card_number, v.finish;
  `);
  console.table(verifyMews.rows);

  console.log(`\n=== STAGING REPAIR COMPLETED IN ${((Date.now() - start) / 1000).toFixed(1)}s ===\n`);
  await client.end();
}

main().catch(console.error);
