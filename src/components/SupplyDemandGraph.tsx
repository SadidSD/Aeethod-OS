import React, { useState } from 'react';
import { TrendingUp, Calculator, ShieldCheck, AlertOctagon, Info, ArrowRight } from 'lucide-react';
import { useStore } from '../store';

interface SupplyDemandGraphProps {
  onSelectTier?: (tier: 99 | 149 | 249) => void;
  selectedTier?: 99 | 149 | 249;
}

export const SupplyDemandGraph: React.FC<SupplyDemandGraphProps> = ({
  onSelectTier,
  selectedTier = 149,
}) => {
  const { theme } = useStore();
  const isLight = theme === 'light';

  const [modelMode, setModelMode] = useState<'flat' | 'commission'>('flat');
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);

  // Theme-aware SVG styling tokens
  const gridStroke = isLight ? '#e9e9e7' : '#2e2e2e';
  const axisStroke = isLight ? '#c5c3be' : '#4a4a4a';
  const axisText = isLight ? '#787774' : '#9b9b9b';
  const chartBg = isLight ? '#ffffff' : '#181818';
  const textPrimary = isLight ? '#37352f' : '#ffffff';

  // SVG canvas dimensions
  const width = 640;
  const height = 360;
  const padding = { top: 40, right: 40, bottom: 50, left: 60 };

  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  // Domain & Ranges
  // P: 0 to 400 $/mo
  // Q: 0 to 1800 stores
  const maxP = 400;
  const maxQ = 1800;

  const scaleX = (q: number) => padding.left + (q / maxQ) * plotWidth;
  const scaleY = (p: number) => padding.top + plotHeight - (p / maxP) * plotHeight;

  // Demand Curve Function: Linear downward sloping demand
  // Qd = 1800 - 3.75 * P  =>  P = (1800 - Q) / 3.75 = 480 - 0.266 * Q
  // At P = 0, Q = 1800
  // At P = 400, Q = 300
  const getQFromP = (p: number) => Math.max(100, Math.round(1800 - 3.75 * p));

  // Current selected equilibrium
  const currentP = selectedTier;
  const currentQ = getQFromP(currentP);

  // Legacy Tax Model values:
  // Incumbent effective price is $1,250/mo on $50k GMV (2.5% tax), which drops Q to ~520 stores
  const legacyEffectiveP = 320; // displayed on 0-400 axis as representative high barrier
  const legacyQ = getQFromP(legacyEffectiveP);

  // Marginal Cost of Cloud SaaS (almost 0: ~$2/store/mo)
  const mcP = 4;

  // Coordinates
  const ptEquilibrium = { x: scaleX(currentQ), y: scaleY(currentP) };
  const ptLegacy = { x: scaleX(legacyQ), y: scaleY(legacyEffectiveP) };
  const ptMC = { x: scaleX(currentQ), y: scaleY(mcP) };

  // Calculate welfare metrics
  const consumerSurplus = Math.round(0.5 * (maxP - currentP) * currentQ);
  const producerSurplus = Math.round((currentP - mcP) * currentQ);
  const deadweightLoss =
    modelMode === 'commission'
      ? Math.round(0.5 * (legacyEffectiveP - currentP) * (currentQ - legacyQ))
      : 0;

  // Calculate elasticity at current point: e = (dQ/dP) * (P/Q) = -3.75 * (P / Q)
  const elasticityAtPoint = ((-3.75 * currentP) / currentQ).toFixed(2);

  return (
    <div className="card p-6 border-indigo-500/30 bg-[#202020] space-y-5">
      {/* Title & Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2e2e2e] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-mono uppercase tracking-wider">
              Visual Microeconomic Model
            </span>
            <span className="text-xs text-slate-400">• Marshallian SaaS Equilibrium Graph</span>
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            <span>Interactive Supply, Demand & Welfare Curves</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Compare Aeethod's Flat SaaS equilibrium against incumbent 2.5% GMV commission deadweight loss.
          </p>
        </div>

        {/* Mode Toggle & Tier Selector */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="flex rounded-lg p-0.5 bg-[#191919] border border-[#2e2e2e] text-xs font-medium">
            <button
              onClick={() => setModelMode('flat')}
              className={`px-3 py-1 rounded-md transition font-mono ${
                modelMode === 'flat'
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              0% Flat SaaS Model
            </button>
            <button
              onClick={() => setModelMode('commission')}
              className={`px-3 py-1 rounded-md transition font-mono flex items-center gap-1 ${
                modelMode === 'commission'
                  ? 'bg-rose-600 text-white font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>2.5% Tax Distortion</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            </button>
          </div>

          <div className="flex items-center gap-1 text-xs">
            {[99, 149, 249].map((p) => (
              <button
                key={p}
                onClick={() => onSelectTier?.(p as any)}
                className={`px-2.5 py-1 rounded font-mono font-bold transition text-xs ${
                  selectedTier === p
                    ? 'bg-[#2e2e2e] text-indigo-300 border border-indigo-500/40'
                    : 'text-slate-400 hover:text-white border border-transparent'
                }`}
              >
                ${p}/mo
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main SVG Graph & Interactive Readout Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* SVG Cartesian Chart (8 Cols) */}
        <div className="lg:col-span-8 bg-[#181818] p-3 rounded-xl border border-[#2e2e2e] relative overflow-hidden">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto select-none"
            style={{ maxHeight: '340px' }}
          >
            <defs>
              {/* Shaded Areas Patterns */}
              <pattern id="dwlStripes" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="8" stroke="#f43f5e" strokeWidth="2" strokeOpacity="0.4" />
              </pattern>
              <linearGradient id="csGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="psGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.30" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.05" />
              </linearGradient>
            </defs>

            {/* Grid Lines */}
            {[100, 200, 300].map((p) => (
              <g key={`grid-p-${p}`}>
                <line
                  x1={padding.left}
                  y1={scaleY(p)}
                  x2={width - padding.right}
                  y2={scaleY(p)}
                  stroke={gridStroke}
                  strokeDasharray="3 3"
                />
                <text
                  x={padding.left - 8}
                  y={scaleY(p) + 4}
                  fill={axisText}
                  fontSize="10"
                  textAnchor="end"
                  fontFamily="monospace"
                >
                  ${p}
                </text>
              </g>
            ))}

            {[400, 800, 1200, 1600].map((q) => (
              <g key={`grid-q-${q}`}>
                <line
                  x1={scaleX(q)}
                  y1={padding.top}
                  x2={scaleX(q)}
                  y2={height - padding.bottom}
                  stroke={gridStroke}
                  strokeDasharray="3 3"
                />
                <text
                  x={scaleX(q)}
                  y={height - padding.bottom + 16}
                  fill={axisText}
                  fontSize="10"
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  {q}
                </text>
              </g>
            ))}

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

            {/* Axis Labels */}
            <text
              x={width - padding.right}
              y={height - padding.bottom + 32}
              fill={axisText}
              fontSize="11"
              fontWeight="600"
              textAnchor="end"
            >
              Quantity of Active Stores (Q) →
            </text>
            <text
              x={padding.left}
              y={padding.top - 16}
              fill={axisText}
              fontSize="11"
              fontWeight="600"
              textAnchor="start"
            >
              ↑ Price / Monthly SaaS Fee (P)
            </text>

            {/* Shaded Welfare Areas */}
            {modelMode === 'flat' ? (
              <>
                {/* Consumer Surplus Polygon (Triangle above P* and under Demand) */}
                <polygon
                  points={`
                    ${scaleX(0)},${scaleY(400)}
                    ${scaleX(0)},${scaleY(currentP)}
                    ${ptEquilibrium.x},${ptEquilibrium.y}
                  `}
                  fill="url(#csGradient)"
                  stroke="#10b981"
                  strokeWidth="0.5"
                  strokeOpacity="0.5"
                />

                {/* Producer Surplus Polygon (Rectangle under P* and above MC) */}
                <polygon
                  points={`
                    ${scaleX(0)},${scaleY(currentP)}
                    ${ptEquilibrium.x},${ptEquilibrium.y}
                    ${scaleX(currentQ)},${scaleY(mcP)}
                    ${scaleX(0)},${scaleY(mcP)}
                  `}
                  fill="url(#psGradient)"
                  stroke="#6366f1"
                  strokeWidth="0.5"
                  strokeOpacity="0.5"
                />
              </>
            ) : (
              <>
                {/* Restricted Consumer Surplus under Tax */}
                <polygon
                  points={`
                    ${scaleX(0)},${scaleY(400)}
                    ${scaleX(0)},${scaleY(legacyEffectiveP)}
                    ${ptLegacy.x},${ptLegacy.y}
                  `}
                  fill="url(#csGradient)"
                />

                {/* Deadweight Loss Wedge (Lost trades between Q_legacy and Q_flat) */}
                <polygon
                  points={`
                    ${ptLegacy.x},${ptLegacy.y}
                    ${scaleX(legacyQ)},${scaleY(currentP)}
                    ${ptEquilibrium.x},${ptEquilibrium.y}
                  `}
                  fill="url(#dwlStripes)"
                  stroke="#f43f5e"
                  strokeWidth="1.5"
                />
              </>
            )}

            {/* Cloud Supply Curve (S_cloud: Horizontal line at MC ~= $2) */}
            <line
              x1={padding.left}
              y1={scaleY(mcP)}
              x2={width - padding.right}
              y2={scaleY(mcP)}
              stroke="#10b981"
              strokeWidth="2.5"
            />
            <text
              x={width - padding.right}
              y={scaleY(mcP) - 8}
              fill="#10b981"
              fontSize="10"
              fontWeight="bold"
              textAnchor="end"
              fontFamily="monospace"
            >
              S_Cloud (MC ≈ $2/mo)
            </text>

            {/* Incumbent Supply / Wedge Line when in Tax Mode */}
            {modelMode === 'commission' && (
              <>
                <line
                  x1={padding.left}
                  y1={scaleY(legacyEffectiveP)}
                  x2={width - padding.right}
                  y2={scaleY(legacyEffectiveP)}
                  stroke="#f43f5e"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                <text
                  x={width - padding.right}
                  y={scaleY(legacyEffectiveP) - 8}
                  fill="#f43f5e"
                  fontSize="10"
                  fontWeight="bold"
                  textAnchor="end"
                  fontFamily="monospace"
                >
                  Legacy Effective Cost (P_base + 2.5% Tax ≈ $320/mo)
                </text>
              </>
            )}

            {/* Demand Curve (Downward Sloping) */}
            <line
              x1={scaleX(0)}
              y1={scaleY(400)}
              x2={scaleX(1500)}
              y2={scaleY(0)}
              stroke="#6366f1"
              strokeWidth="3"
            />
            <text
              x={scaleX(1450)}
              y={scaleY(20)}
              fill="#6366f1"
              fontSize="11"
              fontWeight="bold"
              textAnchor="end"
              fontFamily="monospace"
            >
              Demand D(P)
            </text>

            {/* Dotted lines to Equilibrium */}
            <line
              x1={padding.left}
              y1={ptEquilibrium.y}
              x2={ptEquilibrium.x}
              y2={ptEquilibrium.y}
              stroke="#6366f1"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <line
              x1={ptEquilibrium.x}
              y1={ptEquilibrium.y}
              x2={ptEquilibrium.x}
              y2={height - padding.bottom}
              stroke="#6366f1"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />

            {/* Equilibrium Point Marker */}
            <circle
              cx={ptEquilibrium.x}
              cy={ptEquilibrium.y}
              r="6"
              fill="#6366f1"
              stroke={chartBg}
              strokeWidth="2"
              className="cursor-pointer hover:scale-125 transition"
              onMouseEnter={() => setHoveredPoint('equilibrium')}
              onMouseLeave={() => setHoveredPoint(null)}
            />
            <text
              x={ptEquilibrium.x + 8}
              y={ptEquilibrium.y - 10}
              fill={textPrimary}
              fontSize="11"
              fontWeight="bold"
            >
              E* (${currentP}/mo, {currentQ} Stores)
            </text>

            {/* In Tax Mode: Show Legacy Restricted Point */}
            {modelMode === 'commission' && (
              <>
                <line
                  x1={padding.left}
                  y1={ptLegacy.y}
                  x2={ptLegacy.x}
                  y2={ptLegacy.y}
                  stroke="#f43f5e"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
                <line
                  x1={ptLegacy.x}
                  y1={ptLegacy.y}
                  x2={ptLegacy.x}
                  y2={height - padding.bottom}
                  stroke="#f43f5e"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
                <circle
                  cx={ptLegacy.x}
                  cy={ptLegacy.y}
                  r="6"
                  fill="#f43f5e"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
                <text
                  x={ptLegacy.x + 8}
                  y={ptLegacy.y - 10}
                  fill="#f43f5e"
                  fontSize="11"
                  fontWeight="bold"
                >
                  Tax Trap ({legacyQ} Stores)
                </text>
              </>
            )}
          </svg>
        </div>

        {/* Microeconomic Readout Metrics (4 Cols) */}
        <div className="lg:col-span-4 space-y-3 text-xs">
          {/* Surplus Cards */}
          <div className="p-3.5 rounded-xl bg-[#252525] border border-[#2e2e2e] space-y-1">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Merchant Consumer Surplus
              </span>
              <span className="text-white font-black font-mono">
                ${consumerSurplus.toLocaleString()}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Total economic value captured by card stores above what they pay in subscription fees.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#252525] border border-[#2e2e2e] space-y-1">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-indigo-400 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                Aeethod Producer Surplus (MRR)
              </span>
              <span className="text-white font-black font-mono">
                ${producerSurplus.toLocaleString()} / mo
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Net revenue generated across active stores minus cloud compute costs.
            </p>
          </div>

          <div
            className={`p-3.5 rounded-xl border space-y-1 transition ${
              modelMode === 'commission'
                ? 'bg-rose-500/10 border-rose-500/30'
                : 'bg-[#252525] border-[#2e2e2e]'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span
                className={`font-bold flex items-center gap-1 ${
                  modelMode === 'commission' ? 'text-rose-400' : 'text-slate-400'
                }`}
              >
                <AlertOctagon className="w-3.5 h-3.5" />
                Deadweight Loss (DWL)
              </span>
              <span
                className={`font-black font-mono ${
                  modelMode === 'commission' ? 'text-rose-400 text-sm' : 'text-emerald-400'
                }`}
              >
                {modelMode === 'commission'
                  ? `-$${deadweightLoss.toLocaleString()} / mo`
                  : '$0.00 (Zero Tax Distortion)'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              {modelMode === 'commission'
                ? 'Transactions destroyed when stores avoid listing inventory to evade 2.5% GMV fees.'
                : 'Flat rate pricing aligns incentives, expanding total market commerce to its Pareto-optimal maximum.'}
            </p>
          </div>

          {/* Elasticity Badge */}
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-between font-mono text-xs">
            <span className="text-cyan-400 font-bold">Local Point Elasticity (ε):</span>
            <span className="text-cyan-200 font-bold">{elasticityAtPoint} (Healthy Sensitivity)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
