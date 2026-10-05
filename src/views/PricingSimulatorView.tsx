import React, { useState, useMemo } from 'react';
import {
  Calculator,
  DollarSign,
  TrendingDown,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Sparkles,
  HelpCircle,
  Store,
} from 'lucide-react';
import { fmtMoney } from '../lib/metrics';

interface IncumbentProfile {
  id: string;
  name: string;
  baseFee: number;
  commissionRate: number; // e.g. 0.025 for 2.5%
  appliesTo: 'online' | 'total';
  notes: string;
}

const INCUMBENTS: IncumbentProfile[] = [
  {
    id: 'binderpos',
    name: 'BinderPOS (TCGplayer / eBay)',
    baseFee: 150,
    commissionRate: 0.025,
    appliesTo: 'online',
    notes: 'Base $150/mo + 2.5% on all online sales. Signups currently paused.',
  },
  {
    id: 'crystal',
    name: 'Crystal Commerce',
    baseFee: 129,
    commissionRate: 0.025,
    appliesTo: 'online',
    notes: 'Base $129/mo + 2.5% webstore & marketplace sales commission.',
  },
  {
    id: 'tcgsync',
    name: 'TCG Sync (Storefront Pro)',
    baseFee: 199,
    commissionRate: 0.020,
    appliesTo: 'online',
    notes: 'Base ~$199/mo + 2.0% of TCG item sales (+ £1,000 upfront setup).',
  },
  {
    id: 'storepass',
    name: 'Storepass (Starter/Growth)',
    baseFee: 149,
    commissionRate: 0.020,
    appliesTo: 'online',
    notes: 'Base $149/mo + 2.0% on connected sales (0% commission requires $499/mo tier).',
  },
];

const AEETHOD_TIERS = [
  { id: 'indie', name: 'Starter (Indie LGS)', price: 99, targetGmv: '$15k – $35k' },
  { id: 'warehouse', name: 'Warehouse PowerSeller', price: 249, targetGmv: '$50k – $250k' },
  { id: 'premier', name: 'Pro Retail (Premier LGS)', price: 299, targetGmv: '$60k – $180k' },
  { id: 'enterprise', name: 'Enterprise Multi-Store', price: 699, targetGmv: '$150k – $800k+' },
];

export const PricingSimulatorView: React.FC = () => {
  const [gmvTotal, setGmvTotal] = useState(80000);
  const [onlinePercent, setOnlinePercent] = useState(45);
  const [selectedIncumbentId, setSelectedIncumbentId] = useState('binderpos');
  const [selectedAeethodTierId, setSelectedAeethodTierId] = useState('premier');
  const [copiedPitch, setCopiedPitch] = useState(false);

  const incumbent = INCUMBENTS.find((i) => i.id === selectedIncumbentId) || INCUMBENTS[0];
  const aeethodTier = AEETHOD_TIERS.find((t) => t.id === selectedAeethodTierId) || AEETHOD_TIERS[2];

  const onlineGmv = (gmvTotal * onlinePercent) / 100;
  const taxableGmv = incumbent.appliesTo === 'online' ? onlineGmv : gmvTotal;

  // Costs
  const incumbentCommission = taxableGmv * incumbent.commissionRate;
  const incumbentMonthlyTotal = incumbent.baseFee + incumbentCommission;
  const incumbentAnnualTotal = incumbentMonthlyTotal * 12;

  const aeethodMonthlyTotal = aeethodTier.price;
  const aeethodAnnualTotal = aeethodMonthlyTotal * 12;

  const monthlySavings = Math.max(0, incumbentMonthlyTotal - aeethodMonthlyTotal);
  const annualSavings = monthlySavings * 12;
  const threeYearSavings = annualSavings * 3;

  const savingsPercent = incumbentMonthlyTotal > 0
    ? Math.round((monthlySavings / incumbentMonthlyTotal) * 100)
    : 0;

  const handleCopyPitch = () => {
    const pitch = `Hey! Did quick math on your current software costs vs Aeethod:
At ~$${(gmvTotal / 1000).toFixed(0)}k/mo singles GMV (${onlinePercent}% online = $${(onlineGmv / 1000).toFixed(1)}k online), on ${incumbent.name} you are paying:
- Base fee: $${incumbent.baseFee}/mo
- ${(incumbent.commissionRate * 100).toFixed(1)}% GMV Tax: ~$${Math.round(incumbentCommission)}/mo
Total current spend: ~$${Math.round(incumbentMonthlyTotal)}/mo ($${Math.round(incumbentAnnualTotal).toLocaleString()}/year)

With Aeethod ${aeethodTier.name}:
- Flat $${aeethodTier.price}/mo with ZERO commission (0% GMV tax)
- Net cash kept in your business: ~$${Math.round(monthlySavings).toLocaleString()}/mo ($${Math.round(annualSavings).toLocaleString()}/year)

That puts $${Math.round(annualSavings).toLocaleString()} back in your pocket in year 1 alone, with free 24-hr catalog migration. Want to see a 10-minute demo?`;

    navigator.clipboard.writeText(pitch);
    setCopiedPitch(true);
    setTimeout(() => setCopiedPitch(false), 2500);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-slide-in">
      {/* Header */}
      <div className="card p-6 border-amber-500/30 bg-[#202020] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 uppercase tracking-wider font-mono">
              Merchant Value Proposition
            </span>
            <span className="text-xs text-slate-400">• Anti-Commission Switching Calculator</span>
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">
            Switching ROI & Savings Simulator
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Demonstrate the exact dollar savings an LGS saves by eliminating the 2.0% – 2.5% GMV tax
            imposed by BinderPOS and legacy providers.
          </p>
        </div>

        <button
          onClick={handleCopyPitch}
          className="btn-primary flex items-center gap-2 text-xs py-2 shadow-lg shadow-indigo-600/20 shrink-0"
        >
          {copiedPitch ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Pitch Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy Custom Sales Pitch</span>
            </>
          )}
        </button>
      </div>

      {/* Big Impact Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-6 border border-emerald-500/40 bg-[#202020] space-y-1">
          <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
            Annual Cash Kept by Store
          </div>
          <div className="text-3xl font-black text-white font-mono">
            {fmtMoney(annualSavings)}
          </div>
          <div className="text-xs text-slate-400 pt-1">
            Store saves <span className="text-emerald-400 font-bold">{savingsPercent}%</span> of their software bill each year.
          </div>
        </div>

        <div className="card p-6 border border-[#2e2e2e] bg-[#202020] space-y-1">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Monthly Cost Comparison
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-rose-400 line-through font-mono">
              {fmtMoney(incumbentMonthlyTotal)}
            </span>
            <ArrowRight className="w-4 h-4 text-slate-500" />
            <span className="text-3xl font-black text-emerald-400 font-mono">
              {fmtMoney(aeethodMonthlyTotal)}
            </span>
            <span className="text-xs text-slate-400">/mo</span>
          </div>
          <div className="text-xs text-slate-400 pt-1">
            Flat pricing with 0% commission tax on inventory sales.
          </div>
        </div>

        <div className="card p-6 border border-indigo-500/30 bg-[#202020] space-y-1">
          <div className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
            3-Year Compounded Savings
          </div>
          <div className="text-3xl font-black text-white font-mono">
            {fmtMoney(threeYearSavings)}
          </div>
          <div className="text-xs text-slate-400 pt-1">
            Enough to hire a full-time card grader or buy inventory.
          </div>
        </div>
      </div>

      {/* Simulator Inputs & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-6 card p-6 border border-[#2e2e2e] bg-[#202020] space-y-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Calculator className="w-4 h-4 text-indigo-400" />
            <span>Store Profile & Financial Sliders</span>
          </h3>

          {/* Slider 1: Total GMV */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Total Monthly Singles GMV:</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">
                {fmtMoney(gmvTotal)}
              </span>
            </div>
            <input
              type="range"
              min="10000"
              max="250000"
              step="5000"
              value={gmvTotal}
              onChange={(e) => setGmvTotal(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>$10,000</span>
              <span>$100,000 (Avg Premier)</span>
              <span>$250,000 (High Volume)</span>
            </div>
          </div>

          {/* Slider 2: Online % */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Online Sales Share (%):</span>
              <span className="font-mono font-bold text-indigo-400 text-sm">
                {onlinePercent}% ({fmtMoney(onlineGmv)} / mo)
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={onlinePercent}
              onChange={(e) => setOnlinePercent(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>10% (Mostly Counter)</span>
              <span>45% (Typical LGS)</span>
              <span>100% (Warehouse)</span>
            </div>
          </div>

          {/* Selector 1: Incumbent */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">
              Current Competitor Platform:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {INCUMBENTS.map((inc) => (
                <div
                  key={inc.id}
                  onClick={() => setSelectedIncumbentId(inc.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition select-none ${
                    selectedIncumbentId === inc.id
                      ? 'border-rose-500 bg-rose-950/20 text-white'
                      : 'border-ink-800 bg-ink-950/60 text-slate-400 hover:text-slate-200 hover:border-ink-700'
                  }`}
                >
                  <div className="text-xs font-bold">{inc.name}</div>
                  <div className="text-[10px] text-rose-400 font-mono mt-0.5">
                    ${inc.baseFee}/mo + {(inc.commissionRate * 100).toFixed(1)}% tax
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selector 2: Aeethod Tier */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">
              Proposed Aeethod Plan:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {AEETHOD_TIERS.map((tier) => (
                <div
                  key={tier.id}
                  onClick={() => setSelectedAeethodTierId(tier.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition select-none ${
                    selectedAeethodTierId === tier.id
                      ? 'border-indigo-500 bg-indigo-950/30 text-white'
                      : 'border-ink-800 bg-ink-950/60 text-slate-400 hover:text-slate-200 hover:border-ink-700'
                  }`}
                >
                  <div className="text-xs font-bold">{tier.name}</div>
                  <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
                    ${tier.price}/mo • Flat (0% GMV tax)
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Breakdown Card */}
        <div className="lg:col-span-6 card p-6 border border-ink-800 bg-ink-900 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-emerald-400" />
              <span>Cost Breakdown & Financial Comparison</span>
            </h3>

            {/* Incumbent Cost Card */}
            <div className="p-4 rounded-xl bg-ink-950 border border-rose-900/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400">{incumbent.name}</span>
                <span className="text-sm font-mono font-black text-rose-400">
                  {fmtMoney(incumbentMonthlyTotal)} / mo
                </span>
              </div>

              <div className="space-y-1 text-xs font-mono text-slate-400 pt-1 border-t border-ink-800">
                <div className="flex justify-between">
                  <span>Base Subscription:</span>
                  <span className="text-slate-200">${incumbent.baseFee}.00</span>
                </div>
                <div className="flex justify-between">
                  <span>
                    {(incumbent.commissionRate * 100).toFixed(1)}% Commission ({fmtMoney(taxableGmv)} GMV):
                  </span>
                  <span className="text-rose-400 font-bold">+{fmtMoney(incumbentCommission)}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-ink-800/80 font-bold">
                  <span>Annualized Cost:</span>
                  <span className="text-rose-300">{fmtMoney(incumbentAnnualTotal)}</span>
                </div>
              </div>
            </div>

            {/* Aeethod Cost Card */}
            <div className="p-4 rounded-xl bg-ink-950 border border-emerald-900/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400">Aeethod ({aeethodTier.name})</span>
                <span className="text-sm font-mono font-black text-emerald-400">
                  {fmtMoney(aeethodMonthlyTotal)} / mo
                </span>
              </div>

              <div className="space-y-1 text-xs font-mono text-slate-400 pt-1 border-t border-ink-800">
                <div className="flex justify-between">
                  <span>Flat Subscription:</span>
                  <span className="text-slate-200">${aeethodTier.price}.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Commission on Sales (0%):</span>
                  <span className="text-emerald-400 font-bold">$0.00</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-ink-800/80 font-bold">
                  <span>Annualized Cost:</span>
                  <span className="text-emerald-300">{fmtMoney(aeethodAnnualTotal)}</span>
                </div>
              </div>
            </div>

            {/* Visual Comparison Bar */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Annual Expense Comparison:</span>
                <span className="text-emerald-400 font-mono font-bold">
                  Save {fmtMoney(annualSavings)}/yr
                </span>
              </div>
              <div className="h-4 w-full bg-ink-950 rounded-full overflow-hidden flex border border-ink-800">
                <div
                  className="bg-emerald-500 h-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, Math.max(10, Math.round((aeethodAnnualTotal / incumbentAnnualTotal) * 100)))}%`,
                  }}
                  title={`Aeethod: ${fmtMoney(aeethodAnnualTotal)}`}
                />
                <div
                  className="bg-rose-500/80 h-full transition-all duration-300 flex-1"
                  title={`Wasted on Commission: ${fmtMoney(annualSavings)}`}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span className="text-emerald-400">■ Aeethod Cost</span>
                <span className="text-rose-400">■ Incumbent GMV Tax Saved</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-slate-300 space-y-1">
            <div className="font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Founder Closing Pitch Note:</span>
            </div>
            <p className="leading-relaxed text-slate-300 text-[11px]">
              "Why pay {incumbent.name} a {fmtMoney(incumbentCommission)}/month tax just because your card inventory is moving fast? With Aeethod, you own 100% of your margin with zero sales commission."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
