import type { MetricRow } from '../types';

export interface ComputedMetrics {
  row: MetricRow;
  arr: number | null;
  arpa: number | null;
  growth: number | null;
  churn: number | null;
  grossMargin: number | null;
  cac: number | null;
  ltv: number | null;
  ltvCac: number | null;
  payback: number | null;
  burn: number | null;
  runway: number | null;
}

const n = (v: number | null | undefined): v is number => typeof v === 'number' && Number.isFinite(v);
const div = (a: number | null | undefined, b: number | null | undefined) => (n(a) && n(b) && b !== 0 ? a / b : null);

/** Compute derived SaaS metrics for a series of months of the same kind (sorted ascending). */
export function computeSeries(rows: MetricRow[]): ComputedMetrics[] {
  const sorted = [...rows].sort((a, b) => a.month.localeCompare(b.month));
  return sorted.map((row, i) => {
    const prev = i > 0 ? sorted[i - 1] : null;
    const arr = n(row.mrr) ? row.mrr * 12 : null;
    const arpa = div(row.mrr, row.customers);
    const growth = prev && n(prev.mrr) && prev.mrr > 0 && n(row.mrr) ? (row.mrr - prev.mrr) / prev.mrr : null;
    const churn = prev ? div(row.churnedCustomers, prev.customers) : null;
    const grossMargin = n(row.mrr) && row.mrr > 0 && n(row.cogs) ? (row.mrr - row.cogs) / row.mrr : null;
    const cac = div(row.salesMarketingSpend, row.newCustomers);
    const ltv = n(arpa) && n(grossMargin) && n(churn) && churn > 0 ? (arpa * grossMargin) / churn : null;
    const ltvCac = div(ltv, cac);
    const payback = n(cac) && n(arpa) && n(grossMargin) && arpa * grossMargin > 0 ? cac / (arpa * grossMargin) : null;
    const costs = [row.cogs, row.salesMarketingSpend, row.opex];
    const burn = costs.every(n) && n(row.mrr) ? (costs as number[]).reduce((a, b) => a + b, 0) - row.mrr : null;
    const runway = n(row.cash) && n(burn) ? (burn > 0 ? row.cash / burn : Infinity) : null;
    return { row, arr, arpa, growth, churn, grossMargin, cac, ltv, ltvCac, payback, burn, runway };
  });
}

export const fmtMoney = (v: number | null | undefined, compact = false) => {
  if (!n(v)) return '—';
  if (compact && Math.abs(v) >= 1000) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 }).format(v);
  }
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: Math.abs(v) < 100 && v % 1 ? 2 : 0 }).format(v);
};
export const fmtPct = (v: number | null | undefined, digits = 1) => (n(v) ? `${(v * 100).toFixed(digits)}%` : '—');
export const fmtNum = (v: number | null | undefined, digits = 0) =>
  v === Infinity ? '∞' : n(v) ? new Intl.NumberFormat('en-US', { maximumFractionDigits: digits }).format(v) : '—';
export const fmtMonth = (m: string) => {
  const [y, mo] = m.split('-').map(Number);
  return new Date(Date.UTC(y, mo - 1, 1)).toLocaleDateString('en-US', { month: 'short', year: '2-digit', timeZone: 'UTC' });
};
export const nextMonth = (m: string) => {
  const [y, mo] = m.split('-').map(Number);
  return new Date(Date.UTC(y, mo, 1)).toISOString().slice(0, 7);
};
