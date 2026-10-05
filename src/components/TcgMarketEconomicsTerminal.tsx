import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Store,
  Box,
  Flame,
  AlertTriangle,
  Scale,
  Sparkles,
  BarChart3,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  Layers,
  ShieldAlert,
  Search,
  Filter,
  RefreshCw,
  Zap,
  Info,
  Calendar,
  Compass,
  CheckCircle2,
  Clock,
  ExternalLink
} from 'lucide-react';
import {
  TCG_GAMES_OVERVIEW,
  TCG_SETS_DATA,
  STORE_ECOSYSTEM_HISTORY,
  HYPE_DECAY_CURVE,
  TcgSetData,
  TcgGameOverview
} from '../data/tcgMarketEconomicsData';

interface Props {
  isLight: boolean;
}

export const TcgMarketEconomicsTerminal: React.FC<Props> = ({ isLight }) => {
  // Navigation / View Tabs inside the Terminal
  const [subView, setSubView] = useState<'overview' | 'store-velocity' | 'sets-ev' | 'hype-decay' | 'simulator'>('overview');

  // Filter state
  const [selectedGameFilter, setSelectedGameFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Box Crack Simulator Interactive State
  const [simSelectedSet, setSimSelectedSet] = useState<string>('op-05');
  const [simBoxCount, setSimBoxCount] = useState<number>(3); // number of booster boxes
  const [simLaborCostPerHour, setSimLaborCostPerHour] = useState<number>(18); // store sorting clerk wage

  // LGS Financial Stress Calculator
  const [calcMonthlyRent, setCalcMonthlyRent] = useState<number>(4500);
  const [calcStaffSalaries, setCalcStaffSalaries] = useState<number>(7500);
  const [calcSealedMonthlySales, setCalcSealedMonthlySales] = useState<number>(35000);
  const [calcSinglesMonthlySales, setCalcSinglesMonthlySales] = useState<number>(22000);

  // Filtered Sets
  const filteredSets = useMemo(() => {
    return TCG_SETS_DATA.filter((s) => {
      const matchGame = selectedGameFilter === 'All' || s.game.toLowerCase().includes(selectedGameFilter.toLowerCase());
      const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.topCardName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchGame && matchSearch;
    });
  }, [selectedGameFilter, searchQuery]);

  // Selected set object for simulator
  const activeSimSet = useMemo(() => {
    return TCG_SETS_DATA.find((s) => s.id === simSelectedSet) || TCG_SETS_DATA[0];
  }, [simSelectedSet]);

  // Calculation for Box Simulator
  const simResults = useMemo(() => {
    const wholesaleTotal = activeSimSet.wholesaleCost * simBoxCount;
    const marketBoxTotal = activeSimSet.marketBoxPrice * simBoxCount;
    const rawEvTotal = activeSimSet.boxExpectedValue * simBoxCount;
    
    // Labor cost: ~45 mins per box to crack, sort, sleeve, and catalog
    const sortingHours = (simBoxCount * 45) / 60;
    const totalLaborCost = sortingHours * simLaborCostPerHour;
    const packagingCost = simBoxCount * 6; // sleeves, top-loaders, team bags
    
    const netCrackingProfit = rawEvTotal - wholesaleTotal - totalLaborCost - packagingCost;
    const netHoldingProfit = marketBoxTotal - wholesaleTotal;

    const crackRoi = ((netCrackingProfit / wholesaleTotal) * 100);
    const holdRoi = ((netHoldingProfit / wholesaleTotal) * 100);

    return {
      wholesaleTotal,
      marketBoxTotal,
      rawEvTotal,
      totalLaborCost,
      packagingCost,
      netCrackingProfit,
      netHoldingProfit,
      crackRoi,
      holdRoi,
      verdict: netCrackingProfit > netHoldingProfit ? 'CRACK FOR SINGLES' : 'HOLD / SELL SEALED'
    };
  }, [activeSimSet, simBoxCount, simLaborCostPerHour]);

  // LGS Monthly P&L Breakdown
  const lgsFinancials = useMemo(() => {
    const sealedGrossMargin = calcSealedMonthlySales * 0.14; // ~14% gross margin on sealed
    const singlesGrossMargin = calcSinglesMonthlySales * 0.52; // ~52% gross margin on buylisted singles
    const totalGrossProfit = sealedGrossMargin + singlesGrossMargin;
    const totalFixedCosts = calcMonthlyRent + calcStaffSalaries + 1200; // 1200 utilities/pos/misc
    const netMonthlyOperatingIncome = totalGrossProfit - totalFixedCosts;
    const singlesRevenueContribution = ((singlesGrossMargin / (totalGrossProfit || 1)) * 100);

    return {
      sealedGrossMargin,
      singlesGrossMargin,
      totalGrossProfit,
      totalFixedCosts,
      netMonthlyOperatingIncome,
      singlesRevenueContribution,
      isSolvent: netMonthlyOperatingIncome > 0
    };
  }, [calcMonthlyRent, calcStaffSalaries, calcSealedMonthlySales, calcSinglesMonthlySales]);

  return (
    <div className="space-y-6 animate-slide-in">
      {/* 1. Header Banner */}
      <div className={`p-6 rounded-2xl border transition-all ${
        isLight
          ? 'bg-gradient-to-br from-indigo-50/70 via-white to-slate-50 border-indigo-100 shadow-sm'
          : 'bg-gradient-to-br from-indigo-950/20 via-[#1c1c1f] to-[#161618] border-indigo-500/20 shadow-xl'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wider uppercase bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Market Macro Terminal
              </span>
              <span className="text-[11px] text-slate-500 font-mono">Industry Model 2025–2026</span>
            </div>
            <h2 className={`text-2xl lg:text-3xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              TCG Economics, Market Liquidity & Retail Dynamics
            </h2>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Institutional quantitative telemetry across the \$17.5B Trading Card Game industry.
              Analyze retail store mortality, distributor allocation squeezes, pack EV yield curves, and the secondary market pricing frontier.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
            <div className={`p-3 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-[#222226] border-[#2e2e34]'}`}>
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Total Market Size</div>
              <div className={`text-base font-black font-mono mt-0.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>$17.56B</div>
              <div className="text-[10px] text-emerald-500 font-mono flex items-center gap-0.5 mt-0.5">
                <ArrowUpRight className="w-3 h-3" /> +11.4% CAGR
              </div>
            </div>

            <div className={`p-3 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-[#222226] border-[#2e2e34]'}`}>
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Net LGS Growth</div>
              <div className={`text-base font-black font-mono mt-0.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>+8.4%/yr</div>
              <div className="text-[10px] text-indigo-400 font-mono mt-0.5">
                ~580 New/Qtr
              </div>
            </div>

            <div className={`p-3 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-[#222226] border-[#2e2e34]'}`}>
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Sealed Net Margin</div>
              <div className="text-base font-black font-mono mt-0.5 text-rose-400">12.8% – 15%</div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                Compressed by fees
              </div>
            </div>

            <div className={`p-3 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-[#222226] border-[#2e2e34]'}`}>
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Singles Gross Margin</div>
              <div className="text-base font-black font-mono mt-0.5 text-emerald-400">48% – 55%</div>
              <div className="text-[10px] text-emerald-500 font-mono mt-0.5">
                Store Survival Engine
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Sub-Navigation Bar */}
      <div className="flex items-center gap-1.5 border-b border-[#2e2e34] pb-3 text-xs overflow-x-auto">
        <button
          onClick={() => setSubView('overview')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition shrink-0 ${
            subView === 'overview'
              ? (isLight ? 'bg-slate-900 text-white' : 'bg-white text-slate-950 font-bold')
              : 'text-slate-400 hover:text-white hover:bg-[#25252a]'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-cyan-400" />
          <span>Major Games Market Share</span>
        </button>

        <button
          onClick={() => setSubView('store-velocity')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition shrink-0 ${
            subView === 'store-velocity'
              ? (isLight ? 'bg-slate-900 text-white' : 'bg-white text-slate-950 font-bold')
              : 'text-slate-400 hover:text-white hover:bg-[#25252a]'
          }`}
        >
          <Store className="w-4 h-4 text-amber-400" />
          <span>Store Openings & 18-Mo Mortality Radar</span>
        </button>

        <button
          onClick={() => setSubView('sets-ev')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition shrink-0 ${
            subView === 'sets-ev'
              ? (isLight ? 'bg-slate-900 text-white' : 'bg-white text-slate-950 font-bold')
              : 'text-slate-400 hover:text-white hover:bg-[#25252a]'
          }`}
        >
          <Box className="w-4 h-4 text-emerald-400" />
          <span>Set Economics & Box EV Forensics</span>
        </button>

        <button
          onClick={() => setSubView('hype-decay')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition shrink-0 ${
            subView === 'hype-decay'
              ? (isLight ? 'bg-slate-900 text-white' : 'bg-white text-slate-950 font-bold')
              : 'text-slate-400 hover:text-white hover:bg-[#25252a]'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-rose-400" />
          <span>30-Day Hype Decay Curve</span>
        </button>

        <button
          onClick={() => setSubView('simulator')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition shrink-0 ${
            subView === 'simulator'
              ? (isLight ? 'bg-slate-900 text-white' : 'bg-white text-slate-950 font-bold')
              : 'text-slate-400 hover:text-white hover:bg-[#25252a]'
          }`}
        >
          <Zap className="w-4 h-4 text-indigo-400" />
          <span>Interactive Crack vs Hold Calculator</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: MAJOR GAMES MARKET SHARE & TURNOVER VELOCITY                     */}
      {/* ========================================================================= */}
      {subView === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-[#1e1e24] border-[#2e2e34]'}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Top 2 Games Dominance</span>
                <Sparkles className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-black font-mono mt-1 text-indigo-400">68.3%</div>
              <p className="text-[11px] text-slate-400 mt-1">
                Pokémon (43.5%) + One Piece (24.8%) account for more than two-thirds of all North American retail store revenue.
              </p>
            </div>

            <div className={`p-4 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-[#1e1e24] border-[#2e2e34]'}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Fastest Inventory Velocity</span>
                <Flame className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-2xl font-black font-mono mt-1 text-rose-400">8 Days on Shelf</div>
              <p className="text-[11px] text-slate-400 mt-1">
                One Piece Card Game booster boxes and tournament meta staples turn over in an average of 8 days due to chronic print allocation shortages.
              </p>
            </div>

            <div className={`p-4 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-[#1e1e24] border-[#2e2e34]'}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">High Reprint Risk Warning</span>
                <ShieldAlert className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black font-mono mt-1 text-amber-400">Yu-Gi-Oh! & MTG Masters</div>
              <p className="text-[11px] text-slate-400 mt-1">
                Frequent reprint cadences compress long-term card values by up to 75% overnight when staples are re-issued in mega-tins or reprint sets.
              </p>
            </div>
          </div>

          {/* Detailed Game Breakdown Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {TCG_GAMES_OVERVIEW.map((game) => (
              <div
                key={game.id}
                className={`p-5 rounded-xl border transition-all ${
                  isLight
                    ? 'bg-white border-slate-200 hover:border-indigo-300 shadow-xs'
                    : 'bg-[#1a1a1f] border-[#2e2e34] hover:border-indigo-500/40'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-2 rounded-lg bg-slate-800/40 border border-slate-700/40">
                      {game.icon}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                          {game.name}
                        </h4>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          game.retailerSentiment === 'Very Bullish'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : game.retailerSentiment === 'Bullish'
                            ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                            : game.retailerSentiment === 'Neutral'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}>
                          {game.retailerSentiment}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">
                        Est. Annual Volume: {game.annualVolume}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-black font-mono text-indigo-400">
                      {game.marketShare}%
                    </div>
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">
                      Market Share
                    </div>
                  </div>
                </div>

                {/* Progress Visualizer */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                    <span>Turnover Velocity Score</span>
                    <span className="font-bold text-white">{game.velocityIndex} / 100</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"
                      style={{ width: `${game.velocityIndex}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/60 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Average Days on Shelf</span>
                    <span className="font-mono font-bold text-slate-200">{game.avgDaysOnShelf} Days</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Secondary Volatility</span>
                    <span className={`font-mono font-bold ${
                      game.volatilityRating === 'Extreme' ? 'text-rose-400' :
                      game.volatilityRating === 'High' ? 'text-amber-400' :
                      game.volatilityRating === 'Moderate' ? 'text-indigo-400' : 'text-emerald-400'
                    }`}>
                      {game.volatilityRating}
                    </span>
                  </div>
                </div>

                <div className="mt-3 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-300">
                  <span className="font-bold text-indigo-400">Primary Demand Driver: </span>
                  {game.primaryDriver}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: STORE OPENINGS VELOCITY & 18-MONTH MORTALITY RADAR               */}
      {/* ========================================================================= */}
      {subView === 'store-velocity' && (
        <div className="space-y-6">
          {/* Executive Mortality Alert */}
          <div className="p-5 rounded-xl border border-rose-500/30 bg-rose-950/20 space-y-3">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>The "Sealed-Product Trap": Why 32% of New Card Shops Fail in Months 6–18</span>
            </div>
            <p className="text-xs text-rose-200/80 leading-relaxed">
              When hobby enthusiasts open a Local Game Store (LGS) during a hype wave, they typically budget around distributor sealed booster boxes.
              However, distributor margins on sealed boxes hover between <strong>12% and 15% net</strong>. After paying commercial lease, employee wages, credit card processing fees (2.9%), and freight, <strong>sealed products alone operate at a net loss</strong>.
              Stores only achieve financial solvency when they establish an automated buylist and sell <strong>high-margin singles (48%–55% gross margin)</strong>.
            </p>
          </div>

          {/* Quarterly Trend Table */}
          <div className={`rounded-xl border overflow-hidden ${isLight ? 'bg-white border-slate-200' : 'bg-[#1c1c21] border-[#2e2e34]'}`}>
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Quarterly LGS Openings vs Closures Trend
                </h3>
                <p className="text-xs text-slate-500">Tracking retail footprint expansion and store mortality rates</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Net Growth: +8.4% YoY
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className={`border-b text-[11px] uppercase tracking-wider font-semibold ${
                  isLight ? 'bg-slate-50 border-slate-200 text-slate-500' : 'bg-[#16161a] border-[#2a2a30] text-slate-400'
                }`}>
                  <tr>
                    <th className="py-3 px-4">Quarter</th>
                    <th className="py-3 px-4">New Stores Opened</th>
                    <th className="py-3 px-4">Stores Closed</th>
                    <th className="py-3 px-4">Net Expansion Rate</th>
                    <th className="py-3 px-4">Sealed Box Margin</th>
                    <th className="py-3 px-4">Singles Margin</th>
                    <th className="py-3 px-4">Dominant Failure Mode</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {STORE_ECOSYSTEM_HISTORY.map((row) => (
                    <tr key={row.yearQuarter} className="hover:bg-slate-800/20 transition-colors">
                      <td className="py-3 px-4 font-bold text-white">{row.yearQuarter}</td>
                      <td className="py-3 px-4 text-emerald-400 font-bold">+{row.newStoresOpened}</td>
                      <td className="py-3 px-4 text-rose-400">-{row.storesClosed}</td>
                      <td className="py-3 px-4 text-indigo-400">+{row.netGrowthRate}%</td>
                      <td className="py-3 px-4 text-slate-300">{row.avgSealedNetMargin}%</td>
                      <td className="py-3 px-4 text-emerald-300 font-bold">{row.avgSinglesNetMargin}%</td>
                      <td className="py-3 px-4 font-sans text-slate-400 text-[11px] max-w-xs">{row.primaryFailureReason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Interactive LGS Financial Stress Calculator */}
          <div className={`p-5 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-[#1c1c21] border-[#2e2e34]'}`}>
            <div className="flex items-center gap-2 mb-4">
              <Scale className="w-5 h-5 text-indigo-400" />
              <div>
                <h3 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  LGS Unit Economics & Survival Simulator
                </h3>
                <p className="text-xs text-slate-500">Test if a card shop can survive on sealed boxes vs singles intake</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                  Monthly Store Rent ($)
                </label>
                <input
                  type="number"
                  value={calcMonthlyRent}
                  onChange={(e) => setCalcMonthlyRent(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                  Staff Wages ($/mo)
                </label>
                <input
                  type="number"
                  value={calcStaffSalaries}
                  onChange={(e) => setCalcStaffSalaries(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                  Sealed Sales ($/mo @ 14% margin)
                </label>
                <input
                  type="number"
                  value={calcSealedMonthlySales}
                  onChange={(e) => setCalcSealedMonthlySales(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                  Singles Sales ($/mo @ 52% margin)
                </label>
                <input
                  type="number"
                  value={calcSinglesMonthlySales}
                  onChange={(e) => setCalcSinglesMonthlySales(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-hidden focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Results Grid */}
            <div className="mt-5 p-4 rounded-xl bg-slate-900/80 border border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-sans">Gross Profit</span>
                <span className="text-base font-bold text-white font-mono">
                  ${Math.round(lgsFinancials.totalGrossProfit).toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Sealed: ${Math.round(lgsFinancials.sealedGrossMargin)} | Singles: ${Math.round(lgsFinancials.singlesGrossMargin)}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-sans">Fixed Overheads</span>
                <span className="text-base font-bold text-slate-300 font-mono">
                  ${Math.round(lgsFinancials.totalFixedCosts).toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Rent + Payroll + Utilities</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-sans">Net Operating Income</span>
                <span className={`text-base font-black font-mono ${lgsFinancials.isSolvent ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {lgsFinancials.isSolvent ? '+' : ''}${Math.round(lgsFinancials.netMonthlyOperatingIncome).toLocaleString()}/mo
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5 font-sans">
                  {lgsFinancials.isSolvent ? 'Profitable & Sustainable' : 'Burning Cash Each Month'}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-sans">Singles Margin Share</span>
                <span className="text-base font-bold text-indigo-400 font-mono">
                  {Math.round(lgsFinancials.singlesRevenueContribution)}%
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5 font-sans">Of all store gross profit</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: SET ECONOMICS & BOX EV (EXPECTED VALUE) FORENSICS                 */}
      {/* ========================================================================= */}
      {subView === 'sets-ev' && (
        <div className="space-y-6">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {['All', 'Pokemon', 'One Piece', 'MTG', 'Lorcana'].map((game) => (
                <button
                  key={game}
                  onClick={() => setSelectedGameFilter(game)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 ${
                    selectedGameFilter === game
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {game}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search set or chase card..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Sets Table */}
          <div className={`rounded-xl border overflow-hidden ${isLight ? 'bg-white border-slate-200' : 'bg-[#1c1c21] border-[#2e2e34]'}`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className={`border-b text-[11px] uppercase tracking-wider font-semibold ${
                  isLight ? 'bg-slate-50 border-slate-200 text-slate-500' : 'bg-[#16161a] border-[#2a2a30] text-slate-400'
                }`}>
                  <tr>
                    <th className="py-3 px-4">Set Name</th>
                    <th className="py-3 px-4">Game</th>
                    <th className="py-3 px-4">Wholesale</th>
                    <th className="py-3 px-4">Market Sealed</th>
                    <th className="py-3 px-4">Box EV (Cards)</th>
                    <th className="py-3 px-4">Crack vs Hold</th>
                    <th className="py-3 px-4">Top Chase Card (Raw / PSA 10)</th>
                    <th className="py-3 px-4">Gini (Top 3 %)</th>
                    <th className="py-3 px-4">Reprint Risk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {filteredSets.map((set) => (
                    <tr key={set.id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="py-3.5 px-4 font-sans font-bold text-white max-w-xs">
                        {set.name}
                        <div className="text-[10px] text-slate-500 font-mono">Released {set.releaseDate}</div>
                      </td>
                      <td className="py-3.5 px-4 font-sans">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300">
                          {set.game}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">${set.wholesaleCost.toFixed(2)}</td>
                      <td className="py-3.5 px-4 text-white font-bold">${set.marketBoxPrice.toFixed(2)}</td>
                      <td className="py-3.5 px-4">
                        <span className={`font-bold ${set.boxExpectedValue > set.marketBoxPrice ? 'text-emerald-400' : 'text-slate-300'}`}>
                          ${set.boxExpectedValue.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-sans">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                          set.crackDecision === 'Strong Crack'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : set.crackDecision === 'Hold Sealed'
                            ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}>
                          {set.crackDecision}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-sans text-slate-300">
                        <div className="font-semibold text-xs text-white">{set.topCardName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          Raw: ${set.topCardRawPrice.toLocaleString()} | PSA 10: ${set.topCardPsa10Price.toLocaleString()}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-amber-400 font-bold">{set.top3ValuePercent}%</span>
                        <div className="text-[10px] text-slate-500 font-sans">Gini: {set.giniConcentration}</div>
                      </td>
                      <td className="py-3.5 px-4 font-sans">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          set.reprintRisk === 'Critical Imminent' ? 'bg-rose-500/20 text-rose-400' :
                          set.reprintRisk === 'High' ? 'bg-amber-500/20 text-amber-400' :
                          set.reprintRisk === 'Moderate' ? 'bg-indigo-500/20 text-indigo-400' :
                          'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {set.reprintRisk}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 4: 30-DAY HYPE DECAY CURVE                                           */}
      {/* ========================================================================= */}
      {subView === 'hype-decay' && (
        <div className="space-y-6">
          <div className="p-5 rounded-xl border border-indigo-500/30 bg-indigo-950/20 space-y-2">
            <h3 className="text-sm font-bold text-indigo-300 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              The Standard 90-Day Single-Card Price Decay Dynamic
            </h3>
            <p className="text-xs text-indigo-200/80 leading-relaxed">
              Every major modern TCG set follows a predictable speculative decay path.
              Singles hit an astronomical speculative peak during Prerelease weekend (Day -7 to +2), followed by a brutal <strong>50%–65% price compression</strong> as thousands of booster boxes flood the market during distributor waves 1 and 2.
            </p>
          </div>

          {/* Lifecycle Beat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {HYPE_DECAY_CURVE.map((phase, idx) => (
              <div
                key={phase.dayWindow}
                className={`p-4 rounded-xl border flex flex-col justify-between ${
                  isLight ? 'bg-white border-slate-200' : 'bg-[#1c1c21] border-[#2e2e34]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-indigo-400 font-bold">{phase.dayWindow}</span>
                    <span className="text-slate-500">Phase {idx + 1}</span>
                  </div>
                  <h4 className="font-bold text-xs text-white mt-1.5">{phase.phaseName}</h4>

                  <div className="mt-3 flex items-baseline gap-2 font-mono">
                    <span className="text-2xl font-black text-white">{phase.priceIndex}</span>
                    <span className="text-[10px] text-slate-500 uppercase">Price Index</span>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                    {phase.actionRecommendation}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px]">
                  <span className="text-slate-500 uppercase font-semibold">Inventory Risk</span>
                  <span className={`font-bold px-2 py-0.5 rounded ${
                    phase.riskLevel === 'Extreme' ? 'bg-rose-500/20 text-rose-400' :
                    phase.riskLevel === 'High' ? 'bg-amber-500/20 text-amber-400' :
                    phase.riskLevel === 'Moderate' ? 'bg-indigo-500/20 text-indigo-400' :
                    'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {phase.riskLevel}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 5: INTERACTIVE CRACK VS HOLD SIMULATOR                               */}
      {/* ========================================================================= */}
      {subView === 'simulator' && (
        <div className="space-y-6">
          <div className={`p-6 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-[#1c1c21] border-[#2e2e34]'}`}>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-indigo-400" />
              <div>
                <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Monte Carlo Box Crack vs Hold Decision Engine
                </h3>
                <p className="text-xs text-slate-500">
                  Calculates whether cracking sealed boxes into singles yields a higher risk-adjusted return than holding or wholesaling sealed stock
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                  Select Booster Set
                </label>
                <select
                  value={simSelectedSet}
                  onChange={(e) => setSimSelectedSet(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-indigo-500"
                >
                  {TCG_SETS_DATA.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} (${s.marketBoxPrice}/box)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                  Box Quantity to Simulate ({simBoxCount} Boxes)
                </label>
                <input
                  type="range"
                  min="1"
                  max="24"
                  value={simBoxCount}
                  onChange={(e) => setSimBoxCount(Number(e.target.value))}
                  className="w-full accent-indigo-500 mt-2"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                  Store Sorting Labor Rate ($/hr)
                </label>
                <input
                  type="number"
                  value={simLaborCostPerHour}
                  onChange={(e) => setSimLaborCostPerHour(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-hidden focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Verdict Box */}
            <div className="mt-6 p-5 rounded-xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-indigo-950/40 border border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block font-sans">
                    Recommended Retail Action
                  </span>
                  <div className="text-xl sm:text-2xl font-black font-mono text-emerald-400 flex items-center gap-2 mt-0.5">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    <span>{simResults.verdict}</span>
                  </div>
                </div>

                <div className="flex items-center gap-6 font-mono text-right">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-sans">Crack Net Profit</span>
                    <span className="text-lg font-bold text-emerald-400">
                      +${Math.round(simResults.netCrackingProfit).toLocaleString()} ({Math.round(simResults.crackRoi)}% ROI)
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-sans">Hold Sealed Profit</span>
                    <span className="text-lg font-bold text-indigo-300">
                      +${Math.round(simResults.netHoldingProfit).toLocaleString()} ({Math.round(simResults.holdRoi)}% ROI)
                    </span>
                  </div>
                </div>
              </div>

              {/* Cost Accounting Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-sans block">Wholesale Acquisition</span>
                  <span className="text-slate-300 font-bold">${Math.round(simResults.wholesaleTotal).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-sans block">Labor & Sorting Cost</span>
                  <span className="text-slate-300 font-bold">${Math.round(simResults.totalLaborCost).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-sans block">Gross Singles EV</span>
                  <span className="text-slate-300 font-bold">${Math.round(simResults.rawEvTotal).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-sans block">Top Chase Multiplier</span>
                  <span className="text-amber-400 font-bold">{activeSimSet.top3ValuePercent}% of EV</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
