import pg from 'pg';

export const pool = new pg.Pool({
  host: process.env.DB_HOST || 'aws-0-us-east-1.pooler.supabase.com',
  port: 5432,
  user: process.env.DB_USER || 'postgres.hwwspxwrctxiiutujmlh',
  password: process.env.DB_PASSWORD || 'itsyourSD@123',
  database: 'postgres',
  ssl: { rejectUnauthorized: false },
  max: 5,
  idleTimeoutMillis: 15000
});

export function normalizeEra(eraBlock, setCode, name) {
  const code = (setCode || '').toUpperCase();
  const rawEra = (eraBlock || '').trim();
  const n = (name || '').toLowerCase();

  // 1. Mega Evolution (both English and Japanese: M1S, M1L, M2, M2a, M3, M4, M5, M6, M-P, MC)
  if (
    rawEra === 'Mega Evolution' ||
    code.startsWith('ME') ||
    code.startsWith('M-') ||
    /^M[0-9]/.test(code) ||
    code === 'MC' ||
    n.includes('mega evolution') ||
    n.includes('mega dream') ||
    n.includes('pitch black') ||
    n.includes('white flare') ||
    n.includes('30th celebration') ||
    n.includes('メガ') ||
    n.includes('インフェルノ') ||
    n.includes('アビスアイ') ||
    n.includes('ストームエメラルダ') ||
    n.includes('ニンジャスピナー') ||
    n.includes('ムニキスゼロ')
  ) {
    return { id: 'mega', name: 'Mega Evolution Series', order: 1, years: '2025–Present' };
  }

  // 2. Scarlet & Violet
  if (rawEra === 'Scarlet & Violet' || rawEra === 'SV' || code.startsWith('SV') || code.startsWith('SVP') || code.includes('SV')) {
    return { id: 'sv', name: 'Scarlet & Violet Series', order: 2, years: '2023–Present' };
  }

  // 3. Sword & Shield (SWSH, S1-S12, S-P, SC)
  if (
    rawEra === 'Sword & Shield' ||
    rawEra === 'S' ||
    code.startsWith('SWSH') ||
    code.startsWith('SWSHP') ||
    code.startsWith('S-P') ||
    code.startsWith('SC') ||
    /^S[0-9]/.test(code)
  ) {
    return { id: 'swsh', name: 'Sword & Shield Series', order: 3, years: '2020–2023' };
  }

  // 4. Sun & Moon (SM, SMP, CSMP)
  if (rawEra === 'Sun & Moon' || rawEra === 'SM' || code.startsWith('SM') || code.startsWith('SMP') || code.includes('SM')) {
    return { id: 'sm', name: 'Sun & Moon Series', order: 4, years: '2017–2019' };
  }

  // 5. XY Series (XY, XYP, CP, M6a, MF)
  if (rawEra === 'XY' || rawEra === 'M' || code.startsWith('XY') || code.startsWith('XYP') || code.startsWith('CP') || code.includes('XY')) {
    return { id: 'xy', name: 'XY Series', order: 5, years: '2014–2016' };
  }

  // 6. Black & White (BW, BWP, EBB)
  if (rawEra === 'Black & White' || rawEra === 'BW' || code.startsWith('BW') || code.startsWith('BWP') || code.startsWith('EBB')) {
    return { id: 'bw', name: 'Black & White Series', order: 6, years: '2011–2013' };
  }

  // 7. HeartGold & SoulSilver / LEGEND (HGSS, L1, L2, L3, LL)
  if (
    rawEra === 'HeartGold & SoulSilver' ||
    code.startsWith('HGSS') ||
    code.startsWith('HGSSP') ||
    code.startsWith('L1') ||
    code.startsWith('L2') ||
    code.startsWith('L3') ||
    code === 'LL' ||
    n.includes('heartgold') ||
    n.includes('soulsilver') ||
    n.includes('triumphant') ||
    n.includes('undaunted') ||
    n.includes('unleashed') ||
    n.includes('よみがえる伝説') ||
    n.includes('頂上大激突') ||
    n.includes('ロストリンク')
  ) {
    return { id: 'hgss', name: 'HeartGold & SoulSilver Series', order: 7, years: '2010–2011' };
  }

  // 8. Platinum
  if (rawEra === 'Platinum' || code.startsWith('PL') || code.startsWith('PT') || code.startsWith('DPt') || n.includes('platinum') || n.includes('arceus') || n.includes('supreme victors') || n.includes('rising rivals')) {
    return { id: 'platinum', name: 'Platinum Series', order: 8, years: '2009' };
  }

  // 9. Diamond & Pearl
  if (rawEra === 'Diamond & Pearl' || code.startsWith('DP') || code.startsWith('DPP') || n.includes('diamond') || n.includes('pearl') || n.includes('stormfront') || n.includes('legends awakened') || n.includes('majestic dawn') || n.includes('great encounters') || n.includes('secret wonders') || n.includes('mysterious treasures')) {
    return { id: 'dp', name: 'Diamond & Pearl Series', order: 9, years: '2007–2008' };
  }

  // 10. EX Series (Ruby & Sapphire) / ADV & PCG
  if (
    rawEra === 'EX' ||
    code.startsWith('EX') ||
    code.startsWith('ADV') ||
    code.startsWith('PCG') ||
    n.includes('ruby') ||
    n.includes('sapphire') ||
    n.includes('deoxys') ||
    n.includes('dragon frontiers') ||
    n.includes('power keepers') ||
    n.includes('legend maker') ||
    n.includes('holon') ||
    n.includes('ホロン')
  ) {
    return { id: 'ex', name: 'EX Series (Ruby & Sapphire)', order: 10, years: '2003–2007' };
  }

  // 11. e-Card Series
  if (
    rawEra === 'E-Card' ||
    code.startsWith('ECARD') ||
    code.startsWith('E1') ||
    code.startsWith('E2') ||
    code.startsWith('E3') ||
    code.startsWith('E4') ||
    code.startsWith('E5') ||
    n.includes('skyridge') ||
    n.includes('aquapolis') ||
    n.includes('expedition') ||
    n.includes('地図にない町') ||
    n.includes('海からの風') ||
    n.includes('裂けた大地') ||
    n.includes('神秘なる山')
  ) {
    return { id: 'ecard', name: 'e-Card Series', order: 11, years: '2001–2003' };
  }

  // 12. Neo Series
  if (rawEra === 'Neo' || code.startsWith('NEO') || n.includes('neo genesis') || n.includes('neo discovery') || n.includes('neo revelation') || n.includes('neo destiny') || n.includes('新世界へ') || n.includes('遺跡をこえて') || n.includes('めざめる伝説') || n.includes('闇、そして光へ')) {
    return { id: 'neo', name: 'Neo Series', order: 12, years: '2000–2002' };
  }

  // 13. Gym Series
  if (rawEra === 'Gym' || code.startsWith('GYM') || code === 'PMCG5' || code === 'PMCG6' || n.includes('gym heroes') || n.includes('gym challenge') || n.includes('リーダーズスタジアム') || n.includes('闇からの挑戦')) {
    return { id: 'gym', name: 'Gym Series', order: 13, years: '2000' };
  }

  // 14. Base Set / Classic Series
  if (rawEra === 'Base' || code.startsWith('BASE') || code.startsWith('PMCG') || n.includes('base set') || n.includes('jungle') || n.includes('fossil') || n.includes('team rocket') || n.includes('legendary collection') || n.includes('拡張パック') || n.includes('化石の秘密') || n.includes('ロケット団')) {
    return { id: 'base', name: 'Base Set & Vintage Classic Series', order: 14, years: '1998–2000' };
  }

  return { id: 'special', name: 'Promos, POP Series & Special Sets', order: 15, years: '1998–Present' };
}
