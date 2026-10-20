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

export function normalizeEra(eraBlock, setCode) {
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
