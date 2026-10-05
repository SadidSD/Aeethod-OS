import React, { useState } from 'react';
import { TrendingUp, Scale, AlertOctagon, CheckCircle2, DollarSign, Server, Zap, ShieldAlert, Sparkles, Layers, Users, Target, AlertCircle } from 'lucide-react';
import { useStore } from '../store';
import { ServiceableFeature } from '../data/serviceableFeatures';

interface FeatureSupplyDemandProps {
  feature: ServiceableFeature;
}

export const FeatureSupplyDemand: React.FC<FeatureSupplyDemandProps> = ({ feature }) => {
  const { theme } = useStore();
  const isLight = theme === 'light';

  const model = feature.supplyDemandModel;
  const gap = feature.marketGap;

  // Local interactive simulation state for this specific feature
  const [activeModel, setActiveModel] = useState<'flat' | 'competitor'>('flat');
  const [simulatedPrice, setSimulatedPrice] = useState<number>(feature.suggestedPriceNum || 149);

  // SVG Theme Tokens
  const gridStroke = isLight ? '#e9e9e7' : '#2e2e2e';
  const axisStroke = isLight ? '#c5c3be' : '#4a4a4a';
  const axisText = isLight ? '#787774' : '#9b9b9b';
  const textPrimary = isLight ? '#37352f' : '#ffffff';
  const chartBg = isLight ? '#ffffff' : '#181818';

  // SVG Dimensions
  const width = 560;
  const height = 260;
  const padding = { top: 30, right: 35, bottom: 42, left: 55 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  // Marshallian Parameters for this specific feature
  const pMax = model ? Math.max(model.reservationPrice, model.competitorEffectivePrice * 1.15) : 400;
  const qMax = model ? model.marketCapacity : 1600;
  const mc = model ? model.marginalCost : 1.50;
  const competitorP = model ? model.competitorEffectivePrice : 300;

  // Scale Functions
  const scaleX = (q: number) => padding.left + (Math.max(0, Math.min(qMax, q)) / qMax) * plotWidth;
  const scaleY = (p: number) => padding.top + plotHeight - (Math.max(0, Math.min(pMax, p)) / pMax) * plotHeight;

  // Linear Demand Curve: Qd = qMax * (1 - P / reservationPrice)
  const reservationP = model?.reservationPrice || 350;
  const getQd = (price: number) => {
    if (price >= reservationP) return 0;
    const ratio = (reservationP - price) / reservationP;
    return Math.round(qMax * Math.max(0.05, ratio));
  };

  const currentQ = getQd(simulatedPrice);
  const competitorQ = getQd(competitorP);

  // Welfare metrics at current simulated price
  const csPerStore = Math.max(0, reservationP - simulatedPrice);
  const psPerStore = Math.max(0, simulatedPrice - mc);
  const totalConsumerSurplus = Math.round(0.5 * csPerStore * currentQ);
  const totalProducerSurplus = Math.round(psPerStore * currentQ);
  const deadweightLoss = activeModel === 'competitor'
    ? Math.round(0.5 * (competitorP - simulatedPrice) * Math.max(0, currentQ - competitorQ))
    : 0;

  // Simulated Revenue & Scale Metrics
  const simulatedMonthlyRevenue = simulatedPrice * currentQ;
  const simulatedAnnualRevenue = simulatedMonthlyRevenue * 12;
  const simulatedNetGrossProfit = Math.round(psPerStore * currentQ);
  const penetrationRate = qMax > 0 ? ((currentQ / qMax) * 100).toFixed(1) : '0';

  // Coordinates for SVG plotting
  const ptEquilibrium = { x: scaleX(currentQ), y: scaleY(simulatedPrice) };
  const ptCompetitor = { x: scaleX(competitorQ), y: scaleY(competitorP) };
  const ptMC = { x: scaleX(currentQ), y: scaleY(mc) };

  return (
    <div className="space-y-4 pt-1">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2e2e2e] pb-3">
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-indigo-400" />
          <h5 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Microeconomic Supply, Demand & Welfare Curve
          </h5>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
            {feature.elasticity}
          </span>
        </div>

        {/* Interactive Mode Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg p-0.5 bg-[#191919] border border-[#2e2e2e] text-[11px] font-mono">
            <button
              onClick={() => setActiveModel('flat')}
              className={`px-2.5 py-1 rounded transition ${
                activeModel === 'flat'
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Aeethod 0% Flat Model
            </button>
            <button
              onClick={() => setActiveModel('competitor')}
              className={`px-2.5 py-1 rounded transition flex items-center gap-1 ${
                activeModel === 'competitor'
                  ? 'bg-rose-600 text-white font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Competitor Tax Wedge</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Chart + Live Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        {/* SVG Cartesian Marshallian Diagram (7 Cols) */}
        <div className="lg:col-span-7 p-3 rounded-xl feature-inner-box border border-[#2e2e2e] relative overflow-hidden">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto select-none" style={{ maxHeight: '250px' }}>
            <defs>
              <pattern id={`dwlPattern-${feature.id}`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="6" stroke="#f43f5e" strokeWidth="1.5" strokeOpacity="0.45" />
              </pattern>
              <linearGradient id={`csGrad-${feature.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id={`psGrad-${feature.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.30" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.05" />
              </linearGradient>
            </defs>

            {/* Grid Lines */}
            {[0.25, 0.5, 0.75].map((pct, idx) => {
              const pVal = Math.round(pMax * pct);
              return (
                <g key={`grid-p-${idx}`}>
                  <line
                    x1={padding.left}
                    y1={scaleY(pVal)}
                    x2={width - padding.right}
                    y2={scaleY(pVal)}
                    stroke={gridStroke}
                    strokeDasharray="2 2"
                  />
                  <text
                    x={padding.left - 6}
                    y={scaleY(pVal) + 3}
                    fill={axisText}
                    fontSize="9"
                    textAnchor="end"
                    fontFamily="monospace"
                  >
                    ${pVal}
                  </text>
                </g>
              );
            })}

            {[0.25, 0.5, 0.75].map((pct, idx) => {
              const qVal = Math.round(qMax * pct);
              return (
                <g key={`grid-q-${idx}`}>
                  <line
                    x1={scaleX(qVal)}
                    y1={padding.top}
                    x2={scaleX(qVal)}
                    y2={height - padding.bottom}
                    stroke={gridStroke}
                    strokeDasharray="2 2"
                  />
                  <text
                    x={scaleX(qVal)}
                    y={height - padding.bottom + 12}
                    fill={axisText}
                    fontSize="9"
                    textAnchor="middle"
                    fontFamily="monospace"
                  >
                    {qVal}
                  </text>
                </g>
              );
            })}

            {/* Axes */}
            <line
              x1={padding.left}
              y1={height - padding.bottom}
              x2={width - padding.right}
              y2={height - padding.bottom}
              stroke={axisStroke}
              strokeWidth="1.5"
            />
            <line
              x1={padding.left}
              y1={padding.top}
              x2={padding.left}
              y2={height - padding.bottom}
              stroke={axisStroke}
              strokeWidth="1.5"
            />

            {/* Axis Titles */}
            <text
              x={width - padding.right}
              y={height - padding.bottom + 26}
              fill={axisText}
              fontSize="10"
              fontWeight="600"
              textAnchor="end"
            >
              Quantity of Active Stores (Q) →
            </text>
            <text
              x={padding.left}
              y={padding.top - 12}
              fill={axisText}
              fontSize="10"
              fontWeight="600"
              textAnchor="start"
            >
              ↑ Price / Mo ($P)
            </text>

            {/* Welfare Polygons */}
            {activeModel === 'flat' ? (
              <>
                {/* Consumer Surplus (Green) */}
                <polygon
                  points={`
                    ${scaleX(0)},${scaleY(reservationP)}
                    ${scaleX(0)},${scaleY(simulatedPrice)}
                    ${ptEquilibrium.x},${ptEquilibrium.y}
                  `}
                  fill={`url(#csGrad-${feature.id})`}
                  stroke="#10b981"
                  strokeWidth="0.5"
                  strokeOpacity="0.5"
                />

                {/* Producer Surplus (Indigo) */}
                <polygon
                  points={`
                    ${scaleX(0)},${scaleY(simulatedPrice)}
                    ${ptEquilibrium.x},${ptEquilibrium.y}
                    ${scaleX(currentQ)},${scaleY(mc)}
                    ${scaleX(0)},${scaleY(mc)}
                  `}
                  fill={`url(#psGrad-${feature.id})`}
                  stroke="#6366f1"
                  strokeWidth="0.5"
                  strokeOpacity="0.5"
                />
              </>
            ) : (
              <>
                {/* Restricted CS under competitor tax */}
                <polygon
                  points={`
                    ${scaleX(0)},${scaleY(reservationP)}
                    ${scaleX(0)},${scaleY(competitorP)}
                    ${ptCompetitor.x},${ptCompetitor.y}
                  `}
                  fill={`url(#csGrad-${feature.id})`}
                />

                {/* Deadweight Loss Wedge (Rose Stripes) */}
                <polygon
                  points={`
                    ${ptCompetitor.x},${ptCompetitor.y}
                    ${scaleX(competitorQ)},${scaleY(simulatedPrice)}
                    ${ptEquilibrium.x},${ptEquilibrium.y}
                  `}
                  fill={`url(#dwlPattern-${feature.id})`}
                  stroke="#f43f5e"
                  strokeWidth="1.2"
                />
              </>
            )}

            {/* Cloud Supply Curve (S_cloud: Horizontal line at MC) */}
            <line
              x1={padding.left}
              y1={scaleY(mc)}
              x2={width - padding.right}
              y2={scaleY(mc)}
              stroke="#10b981"
              strokeWidth="2.5"
            />
            <text
              x={width - padding.right}
              y={scaleY(mc) - 6}
              fill="#10b981"
              fontSize="9"
              fontWeight="bold"
              textAnchor="end"
              fontFamily="monospace"
            >
              S_Cloud (MC ≈ ${mc.toFixed(2)}/mo)
            </text>

            {/* Competitor Price Line (Dashed Red) */}
            {activeModel === 'competitor' && (
              <>
                <line
                  x1={padding.left}
                  y1={scaleY(competitorP)}
                  x2={width - padding.right}
                  y2={scaleY(competitorP)}
                  stroke="#f43f5e"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />
                <text
                  x={width - padding.right}
                  y={scaleY(competitorP) - 6}
                  fill="#f43f5e"
                  fontSize="9"
                  fontWeight="bold"
                  textAnchor="end"
                  fontFamily="monospace"
                >
                  Competitor Tax Wedge (${competitorP}/mo)
                </text>
              </>
            )}

            {/* Demand Curve D(P) */}
            <line
              x1={scaleX(0)}
              y1={scaleY(reservationP)}
              x2={scaleX(qMax)}
              y2={scaleY(0)}
              stroke="#6366f1"
              strokeWidth="2.5"
            />
            <text
              x={scaleX(qMax * 0.95)}
              y={scaleY(pMax * 0.08)}
              fill="#6366f1"
              fontSize="10"
              fontWeight="bold"
              textAnchor="end"
              fontFamily="monospace"
            >
              Demand D(P)
            </text>

            {/* Equilibrium Dotted Guidelines */}
            <line
              x1={padding.left}
              y1={ptEquilibrium.y}
              x2={ptEquilibrium.x}
              y2={ptEquilibrium.y}
              stroke="#6366f1"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            <line
              x1={ptEquilibrium.x}
              y1={ptEquilibrium.y}
              x2={ptEquilibrium.x}
              y2={height - padding.bottom}
              stroke="#6366f1"
              strokeWidth="1"
              strokeDasharray="3 3"
            />

            {/* Equilibrium Marker */}
            <circle
              cx={ptEquilibrium.x}
              cy={ptEquilibrium.y}
              r="5"
              fill="#6366f1"
              stroke={chartBg}
              strokeWidth="2"
            />
            <text
              x={ptEquilibrium.x + 6}
              y={ptEquilibrium.y - 8}
              fill={textPrimary}
              fontSize="10"
              fontWeight="bold"
            >
              E* (${simulatedPrice}, {currentQ.toLocaleString()} Stores • ${simulatedMonthlyRevenue >= 1000000 ? `$${(simulatedMonthlyRevenue / 1000000).toFixed(2)}M` : `$${Math.round(simulatedMonthlyRevenue / 1000)}k`}/mo)
            </text>

            {/* In Competitor Mode: Show Restrictive Tax Dot */}
            {activeModel === 'competitor' && (
              <>
                <circle
                  cx={ptCompetitor.x}
                  cy={ptCompetitor.y}
                  r="5"
                  fill="#f43f5e"
                  stroke={chartBg}
                  strokeWidth="2"
                />
                <text
                  x={ptCompetitor.x + 6}
                  y={ptCompetitor.y - 8}
                  fill="#f43f5e"
                  fontSize="10"
                  fontWeight="bold"
                >
                  Tax Trap ({competitorQ} Stores)
                </text>
              </>
            )}
          </svg>
        </div>

        {/* Live Metrics & Simulation Readout (5 Cols) */}
        <div className="lg:col-span-5 space-y-2.5 text-xs">
          {/* Interactive Price Selector for this Feature */}
          <div className="p-3 rounded-xl feature-inner-box border border-[#2e2e2e] space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-mono text-slate-400">Simulate Feature Tier:</span>
              <span className="font-mono font-bold text-cyan-400">${simulatedPrice} / mo</span>
            </div>
            <div className="flex items-center gap-1.5">
              {[49, 99, 149, 249].map((p) => (
                <button
                  key={p}
                  onClick={() => setSimulatedPrice(p)}
                  className={`flex-1 py-1 rounded text-center font-mono text-[11px] font-bold transition ${
                    simulatedPrice === p
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'feature-step-pill text-slate-400 hover:text-white'
                  }`}
                >
                  ${p}
                </button>
              ))}
            </div>
          </div>

          {/* Simulated Revenue Engine Card */}
          <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500/15 via-cyan-500/10 to-transparent border border-indigo-500/40 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="font-bold text-cyan-400 uppercase flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-cyan-400" />
                <span>Simulated Revenue Engine</span>
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {currentQ.toLocaleString()} Stores ({penetrationRate}%)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded-lg feature-step-pill border border-[#2e2e2e]">
                <div className="text-[9px] uppercase font-bold text-slate-400 font-mono">Monthly Revenue (MRR)</div>
                <div className="text-sm font-black font-mono text-cyan-300 mt-0.5">
                  ${simulatedMonthlyRevenue.toLocaleString()}
                  <span className="text-[9px] font-normal text-slate-400"> / mo</span>
                </div>
                <div className="text-[9px] text-cyan-400/80 font-mono mt-0.5">
                  ${simulatedPrice}/mo × {currentQ.toLocaleString()} stores
                </div>
              </div>

              <div className="p-2 rounded-lg feature-step-pill border border-[#2e2e2e]">
                <div className="text-[9px] uppercase font-bold text-slate-400 font-mono">Annualized Run-Rate (ARR)</div>
                <div className="text-sm font-black font-mono text-emerald-400 mt-0.5">
                  ${simulatedAnnualRevenue >= 1000000 
                    ? `$${(simulatedAnnualRevenue / 1000000).toFixed(2)}M` 
                    : `$${(simulatedAnnualRevenue / 1000).toFixed(0)}k`}
                  <span className="text-[9px] font-normal text-slate-400"> / yr</span>
                </div>
                <div className="text-[9px] text-emerald-400/80 font-mono mt-0.5">
                  Net Profit: ${simulatedNetGrossProfit.toLocaleString()}/mo
                </div>
              </div>
            </div>
          </div>

          {/* Surplus Metrics */}
          <div className="p-3 rounded-xl feature-inner-box border border-[#2e2e2e] space-y-1">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Merchant Consumer Surplus
              </span>
              <span className="text-emerald-400 font-bold font-mono">
                +${csPerStore.toLocaleString()} / store / mo
              </span>
            </div>
            <div className="text-[10px] text-slate-400">
              Value delivered above subscription cost (${(csPerStore * 12).toLocaleString()}/yr savings).
            </div>
          </div>

          <div className="p-3 rounded-xl feature-inner-box border border-[#2e2e2e] space-y-1">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-indigo-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                Aeethod Gross Margin (PS)
              </span>
              <span className="text-indigo-300 font-bold font-mono">
                {(((simulatedPrice - mc) / simulatedPrice) * 100).toFixed(1)}% (${psPerStore.toFixed(2)}/store)
              </span>
            </div>
            <div className="text-[10px] text-slate-400">
              Server compute is &lt; ${mc.toFixed(2)}/mo on serverless edge architecture.
            </div>
          </div>

          <div
            className={`p-3 rounded-xl border space-y-1 transition ${
              activeModel === 'competitor'
                ? 'bg-rose-500/10 border-rose-500/30'
                : 'feature-inner-box border-[#2e2e2e]'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span
                className={`font-bold flex items-center gap-1 ${
                  activeModel === 'competitor' ? 'text-rose-400' : 'text-slate-400'
                }`}
              >
                <AlertOctagon className="w-3.5 h-3.5" />
                Deadweight Loss (DWL)
              </span>
              <span
                className={`font-bold font-mono ${
                  activeModel === 'competitor' ? 'text-rose-400' : 'text-cyan-400'
                }`}
              >
                {activeModel === 'competitor'
                  ? `-$${deadweightLoss.toLocaleString()} / mo`
                  : '$0.00 (Zero Tax Distortion)'}
              </span>
            </div>
            <div className="text-[10px] text-slate-400">
              {activeModel === 'competitor'
                ? `${Math.max(0, currentQ - competitorQ)} stores priced out by competitor fees.`
                : '0% flat pricing unlocks 100% addressable store participation.'}
            </div>
          </div>
        </div>
      </div>

      {/* 3-Column Microeconomic Teardown Triad */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
        {/* Column 1: Demand Dynamics */}
        <div className="p-3.5 rounded-xl feature-inner-box border border-[#2e2e2e] space-y-2">
          <div className="flex items-center justify-between border-b border-[#2e2e2e] pb-1.5">
            <span className="text-[11px] font-bold text-cyan-400 uppercase font-mono flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>1. Demand Dynamics</span>
            </span>
            <span className="text-[10px] font-mono font-bold text-cyan-300">
              WTP: {feature.merchantWtp}
            </span>
          </div>
          <div className="space-y-1.5 text-[11px]">
            <div>
              <span className="text-slate-500 uppercase font-mono text-[9px] block">Price Elasticity (ε):</span>
              <span className="text-slate-300 font-medium">{feature.elasticity}</span>
            </div>
            <div>
              <span className="text-slate-500 uppercase font-mono text-[9px] block">Primary Demand Driver:</span>
              <span className="text-slate-300 leading-snug">{feature.demandDriver}</span>
            </div>
            {model && (
              <div>
                <span className="text-slate-500 uppercase font-mono text-[9px] block">Substitute Threat / Alternatives:</span>
                <span className="text-slate-400 leading-snug">{model.substituteThreat}</span>
              </div>
            )}
          </div>
        </div>

        {/* Column 2: Cloud Supply Dynamics */}
        <div className="p-3.5 rounded-xl feature-inner-box border border-[#2e2e2e] space-y-2">
          <div className="flex items-center justify-between border-b border-[#2e2e2e] pb-1.5">
            <span className="text-[11px] font-bold text-emerald-400 uppercase font-mono flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5" />
              <span>2. Cloud Supply Curve</span>
            </span>
            <span className="text-[10px] font-mono font-bold text-emerald-400">
              MC ≈ ${mc.toFixed(2)}/mo
            </span>
          </div>
          <div className="space-y-1.5 text-[11px]">
            <div>
              <span className="text-slate-500 uppercase font-mono text-[9px] block">Cloud Infrastructure & Margin:</span>
              <span className="text-slate-300 font-medium">{feature.grossMarginPct}% Gross Margin</span>
            </div>
            {model && (
              <div>
                <span className="text-slate-500 uppercase font-mono text-[9px] block">Infrastructure Cost Breakdown:</span>
                <span className="text-slate-300 leading-snug">{model.cloudCostBreakdown}</span>
              </div>
            )}
            <div>
              <span className="text-slate-500 uppercase font-mono text-[9px] block">Supply Elasticity (e_s):</span>
              <span className="text-slate-400 leading-snug">{feature.supplyDynamics}</span>
            </div>
          </div>
        </div>

        {/* Column 3: Market Welfare & Strategy */}
        <div className="p-3.5 rounded-xl feature-inner-box border border-[#2e2e2e] space-y-2">
          <div className="flex items-center justify-between border-b border-[#2e2e2e] pb-1.5">
            <span className="text-[11px] font-bold text-indigo-400 uppercase font-mono flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>3. Market Welfare & Moat</span>
            </span>
            <span className="text-[10px] font-mono font-bold text-indigo-300">
              Pareto-Optimal
            </span>
          </div>
          <div className="space-y-1.5 text-[11px]">
            <div>
              <span className="text-slate-500 uppercase font-mono text-[9px] block">Deadweight Loss Prevention:</span>
              <span className="text-slate-300 leading-snug">{feature.deadweightLossRisk}</span>
            </div>
            {model && (
              <div>
                <span className="text-slate-500 uppercase font-mono text-[9px] block">Bundling & Retention Moat:</span>
                <span className="text-slate-300 leading-snug">{model.bundlingStrategy}</span>
              </div>
            )}
            <div>
              <span className="text-slate-500 uppercase font-mono text-[9px] block">Competitor Tax Benchmark:</span>
              <span className="text-rose-400 font-mono text-[10px] font-bold">{model?.competitorPriceLabel || feature.competitorsPrice}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Market Demand Need vs Existing Competitor Supply (The Market Gap Analysis) */}
      {gap && (
        <div className="p-4 rounded-xl feature-inner-box border border-amber-500/30 bg-amber-500/5 space-y-3.5 text-xs">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2e2e2e] pb-2.5">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-white uppercase tracking-wider font-mono text-[11px]">
                Market Need vs. Competitor Supply Deficit (The Gap Analysis)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                  gap.urgencyLevel.includes('Critical')
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                    : gap.urgencyLevel.includes('High')
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    : 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
                }`}
              >
                {gap.urgencyLevel}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                {gap.gapPercentage}% Market Gap
              </span>
            </div>
          </div>

          {/* Comparative Progress / Gap Meter */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">
                Total Merchant Need: <strong className="text-white">{gap.totalStoresNeeding.toLocaleString()} Stores</strong> ({gap.marketNeedPercentage}% of LGS)
              </span>
              <span className="text-rose-400 font-bold">
                Unserved Gap: +{gap.unservedStores.toLocaleString()} Stores ({gap.gapPercentage}%)
              </span>
            </div>

            {/* Segmented Progress Bar */}
            <div className="h-3 w-full rounded-full bg-[#181818] border border-[#2e2e2e] overflow-hidden flex">
              {/* Competitor Supplied Segment (Indigo) */}
              <div
                style={{ width: `${100 - gap.gapPercentage}%` }}
                className="h-full bg-indigo-500/60 transition-all flex items-center justify-center text-[9px] font-mono font-bold text-white"
                title={`Competitor Supplied: ${gap.competitorSuppliedStores} stores`}
              >
                {gap.competitorSuppliedStores} Supplied
              </div>
              {/* Gap Segment (Striped Amber/Rose) */}
              <div
                style={{ width: `${gap.gapPercentage}%` }}
                className="h-full bg-gradient-to-r from-rose-500/70 to-amber-500/70 transition-all flex items-center justify-center text-[9px] font-mono font-bold text-white shadow-xs"
                title={`Unserved Market Gap: ${gap.unservedStores} stores`}
              >
                +{gap.unservedStores} Unserved Gap ({gap.gapPercentage}%)
              </div>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>Competitors Supply: {gap.competitorSuppliedStores.toLocaleString()} stores</span>
              <span className="text-rose-400 font-medium">Aeethod Growth Addressable Space: {gap.unservedStores.toLocaleString()} stores</span>
            </div>
          </div>

          {/* 3-Column Detailed Teardown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            {/* 1. How Many People Need This? */}
            <div className="p-3 rounded-lg feature-step-pill border border-[#2e2e2e] space-y-1.5">
              <div className="text-[10px] font-mono uppercase font-bold text-cyan-400 flex items-center gap-1">
                <Target className="w-3 h-3 text-cyan-400" />
                <span>1. People Needing This</span>
              </div>
              <div className="text-sm font-bold font-mono text-white">
                {gap.totalStoresNeeding.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">/ 3,000 LGS ({gap.marketNeedPercentage}%)</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                {gap.demandPainDescription}
              </p>
            </div>

            {/* 2. Existing Competitor Supply */}
            <div className="p-3 rounded-lg feature-step-pill border border-[#2e2e2e] space-y-1.5">
              <div className="text-[10px] font-mono uppercase font-bold text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-rose-400" />
                <span>2. Competitor Supply</span>
              </div>
              <div className="text-sm font-bold font-mono text-white flex items-center justify-between">
                <span>{gap.competitorSuppliedStores.toLocaleString()} Stores</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 font-mono font-normal">
                  {gap.competitorSupplyStatus}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                <strong className="text-slate-300">Bottleneck:</strong> {gap.competitorSupplyBottleneck}
              </p>
            </div>

            {/* 3. Are There A Gap? (Opportunity & Solution) */}
            <div className="p-3 rounded-lg feature-step-pill border border-emerald-500/30 bg-emerald-500/5 space-y-1.5">
              <div className="text-[10px] font-mono uppercase font-bold text-emerald-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>3. The Market Gap</span>
              </div>
              <div className="text-sm font-bold font-mono text-emerald-300">
                +{gap.unservedStores.toLocaleString()} Stores <span className="text-[10px] font-normal text-emerald-400/80">({gap.gapPercentage}% Deficit)</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                <strong className="text-amber-400">Current Workaround:</strong> {gap.unservedWorkaround}
              </p>
              <div className="text-[10px] text-emerald-300/90 pt-1 border-t border-emerald-500/20 font-mono">
                <strong>Aeethod Solution:</strong> {gap.aeethodGapSolution}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
