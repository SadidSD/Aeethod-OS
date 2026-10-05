import React, { useState } from 'react';
import { Competitor } from '../lib/competitorsData';
import {
  Compass,
  ScatterChart,
  Grid,
  Car,
  SlidersHorizontal,
  ArrowUpRight,
  ExternalLink,
  Info,
} from 'lucide-react';

interface CompetitorLandscapeGraphProps {
  competitors: Competitor[];
  onInspect?: (c: Competitor) => void;
}

type DimensionMode = 'scope-vs-commission' | 'budget-vs-automation';

export const CompetitorLandscapeGraph: React.FC<CompetitorLandscapeGraphProps> = ({
  competitors,
  onInspect,
}) => {
  const [activeView, setActiveView] = useState<'perceptual' | 'matrix'>('perceptual');
  const [dimensionMode, setDimensionMode] = useState<DimensionMode>('scope-vs-commission');
  const [hoveredComp, setHoveredComp] = useState<Competitor | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'all-in-one' | 'shopify-apps' | 'pos-mobile'>('all');

  // Filtered competitors
  const filteredCompetitors = competitors.filter((c) => {
    if (activeFilter === 'all') return true;
    return c.category === activeFilter;
  });

  // Coordinates for Dimension 1:
  // X Axis: LEFT (-100) = Online-Only / Single-Channel <-----> RIGHT (+100) = Physical Brick & Mortar / Omnichannel POS
  // Y Axis: BOTTOM (-100) = Commission Heavy (2.0%-2.5% Tax) <-----> TOP (+100) = 0% Commission (Pure Flat SaaS)
  const coordsScopeVsCommission: Record<string, { x: number; y: number; labelPos: 'top' | 'bottom' | 'left' | 'right' }> = {
    // Quadrant I: Top-Right (Omnichannel + 0% Commission) -> The Sweet Spot
    rareos: { x: 55, y: 78, labelPos: 'top' },
    blstr: { x: 42, y: 55, labelPos: 'left' },
    shadowpos: { x: 62, y: 40, labelPos: 'right' },
    sortswift: { x: 74, y: 58, labelPos: 'top' },
    storepass: { x: 82, y: 32, labelPos: 'bottom' },

    // Quadrant II: Bottom-Right (Omnichannel + 2.0% - 2.5% Commission Tax) -> Legacy Traps
    tcgsync: { x: 86, y: -48, labelPos: 'top' },
    binderpos: { x: 78, y: -68, labelPos: 'left' },
    crystalcommerce: { x: 65, y: -78, labelPos: 'bottom' },
    mykapos: { x: 50, y: -52, labelPos: 'right' },

    // Quadrant III: Top-Left (Online-Only / Single-Channel + 0% Commission) -> Shopify Micro Tools
    synqtcg: { x: -48, y: 68, labelPos: 'top' },
    gamelocker: { x: -35, y: 50, labelPos: 'right' },
    cardsync: { x: -70, y: 62, labelPos: 'left' },
    tcgautomate: { x: -28, y: 40, labelPos: 'top' },
    cardupkeep: { x: -58, y: 36, labelPos: 'bottom' },
    koritcg: { x: -82, y: 75, labelPos: 'bottom' },
    tcgimporter: { x: -76, y: 44, labelPos: 'left' },
    lgsforge: { x: -64, y: 22, labelPos: 'top' },

    // Quadrant IV: Bottom-Left (Single-Purpose / Mobile + Niche Fees) -> Point Solutions
    decktradr: { x: -18, y: -20, labelPos: 'right' },
    cardflow: { x: -38, y: -26, labelPos: 'top' },
    snapsale: { x: -28, y: -45, labelPos: 'bottom' },
    mycardwizard: { x: -62, y: -35, labelPos: 'left' },
    tcgpowertools: { x: -16, y: 22, labelPos: 'right' },
    doubleholo: { x: -12, y: 8, labelPos: 'top' },
    jarbas: { x: -72, y: -60, labelPos: 'right' },
    kyte: { x: -84, y: -68, labelPos: 'bottom' },
    prism: { x: -44, y: 12, labelPos: 'top' },
  };

  // Coordinates for Dimension 2:
  // X Axis: LEFT (-100) = Budget / Micro-Tool ($10-$50/mo) <-----> RIGHT (+100) = Enterprise / High-End ($200-$1,000+/mo)
  // Y Axis: BOTTOM (-100) = Manual / Basic Sync <-----> TOP (+100) = AI Vision & Live Automated Repricing
  const coordsBudgetVsAutomation: Record<string, { x: number; y: number; labelPos: 'top' | 'bottom' | 'left' | 'right' }> = {
    rareos: { x: 20, y: 85, labelPos: 'top' },
    decktradr: { x: -10, y: 80, labelPos: 'right' },
    tcgautomate: { x: -25, y: 65, labelPos: 'top' },
    sortswift: { x: 45, y: 55, labelPos: 'top' },
    storepass: { x: 75, y: 48, labelPos: 'right' },
    blstr: { x: 15, y: 42, labelPos: 'left' },
    synqtcg: { x: -55, y: 35, labelPos: 'top' },
    tcgsync: { x: 80, y: 25, labelPos: 'right' },
    doubleholo: { x: -15, y: 30, labelPos: 'bottom' },
    cardupkeep: { x: -65, y: 15, labelPos: 'left' },
    tcgpowertools: { x: -70, y: 25, labelPos: 'top' },
    binderpos: { x: 70, y: -20, labelPos: 'right' },
    crystalcommerce: { x: 60, y: -55, labelPos: 'bottom' },
    gamelocker: { x: -45, y: -15, labelPos: 'left' },
    cardsync: { x: -75, y: -30, labelPos: 'bottom' },
    koritcg: { x: -82, y: -25, labelPos: 'left' },
    tcgimporter: { x: -70, y: -45, labelPos: 'bottom' },
    lgsforge: { x: -60, y: -35, labelPos: 'top' },
    cardflow: { x: -40, y: -40, labelPos: 'right' },
    snapsale: { x: -30, y: -50, labelPos: 'bottom' },
    mycardwizard: { x: -50, y: -60, labelPos: 'left' },
    mykapos: { x: 55, y: -35, labelPos: 'right' },
    jarbas: { x: -78, y: -70, labelPos: 'bottom' },
    kyte: { x: -85, y: -75, labelPos: 'left' },
    shadowpos: { x: 35, y: 10, labelPos: 'right' },
    prism: { x: -20, y: -15, labelPos: 'top' },
  };

  const activeCoords = dimensionMode === 'scope-vs-commission'
    ? coordsScopeVsCommission
    : coordsBudgetVsAutomation;

  // Convert Cartesian [-100, 100] to SVG canvas coordinates [1100 x 640]
  const mapToSvg = (cartX: number, cartY: number) => {
    const svgX = 550 + (cartX / 100) * 460;
    const svgY = 320 - (cartY / 100) * 250;
    return { x: svgX, y: svgY };
  };

  return (
    <div className="space-y-6">
      {/* Top Analogy & Dimension Selector */}
      <div className="card p-6 border-indigo-500/30 bg-[#202020] space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 flex items-center gap-1 font-mono">
                <Compass className="w-3 h-3 text-indigo-400" />
                Cartesian Perceptual Graph
              </span>
              <span className="text-xs text-slate-400">• Opposite-Poles Coordinate Map</span>
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">
              TCG Software Market Perceptual Map
            </h2>
            <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
              Just like plotting automobiles between <strong>Economic ↔ Luxury</strong> on the X-axis and <strong>Family ↔ Sports</strong> on the Y-axis, 
              this graph maps all 26 TCG competitors across two fundamental trade-off spectrums with polar opposite ends.
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#252525] border border-[#2e2e2e] shrink-0">
            <button
              onClick={() => setActiveView('perceptual')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeView === 'perceptual'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ScatterChart className="w-3.5 h-3.5" />
              Perceptual Map (2D)
            </button>
            <button
              onClick={() => setActiveView('matrix')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeView === 'matrix'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              2x2 Matrix Cards
            </button>
          </div>
        </div>

        {/* The Car Comparison Analogy Callout */}
        <div className="pt-3 border-t border-[#2e2e2e] flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-cyan-400 font-medium">
            <Car className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              <strong>The Car Comparison:</strong> Ferrari = <em>Sports + Luxury (Top-Right)</em>. Honda Civic = <em>Sports + Economic (Top-Left)</em>. 
              In TCG: <strong>★ Aeethod OS</strong> = <em>Full In-Store Omnichannel + 0% Commission (The Top-Right Sweet Spot)</em>.
            </span>
          </div>

          {/* Dimension Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3 text-slate-400" />
              Axis Spectrum:
            </span>
            <select
              value={dimensionMode}
              onChange={(e) => setDimensionMode(e.target.value as DimensionMode)}
              className="bg-[#252525] border border-[#2e2e2e] text-white text-xs rounded-lg px-2.5 py-1 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="scope-vs-commission">X: Online ↔ Omnichannel | Y: Commission ↔ 0% Flat Fee</option>
              <option value="budget-vs-automation">X: Budget ↔ Enterprise | Y: Basic Manual ↔ AI Automated</option>
            </select>
          </div>
        </div>
      </div>

      {/* VIEW 1: TRUE CARTESIAN PERCEPTUAL MAP */}
      {activeView === 'perceptual' && (
        <div className="card p-6 space-y-4 shadow-sm relative overflow-hidden bg-[#202020] border-[#2e2e2e]">
          {/* Top Filter and Legend Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2e2e2e] pb-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Filter Category:</span>
              <div className="flex items-center gap-1">
                {(['all', 'all-in-one', 'shopify-apps', 'pos-mobile'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveFilter(cat)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition ${
                      activeFilter === cat
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'text-slate-400 hover:text-white bg-[#252525]'
                    }`}
                  >
                    {cat === 'all'
                      ? 'All (26)'
                      : cat === 'all-in-one'
                      ? 'All-in-One Suites'
                      : cat === 'shopify-apps'
                      ? 'Shopify Apps'
                      : 'POS / Standalone'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" /> All-in-One
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Shopify Apps
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> POS & Mobile
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" /> Aeethod Target
              </span>
            </div>
          </div>

          {/* The Main Cartesian Coordinate Canvas */}
          <div className="relative w-full h-[640px] bg-[#191919] rounded-xl border border-[#2e2e2e] overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 1100 640" preserveAspectRatio="none">
              <defs>
                <marker id="arrow-right" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#f59e0b" />
                </marker>
                <marker id="arrow-left" viewBox="0 0 10 10" refX="4" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 10 1 L 0 5 L 10 9 z" fill="#818cf8" />
                </marker>
                <marker id="arrow-up" viewBox="0 0 10 10" refX="5" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 1 10 L 5 0 L 9 10 z" fill="#10b981" />
                </marker>
                <marker id="arrow-down" viewBox="0 0 10 10" refX="5" refY="6" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 1 0 L 5 10 L 9 0 z" fill="#f43f5e" />
                </marker>

                <radialGradient id="saasGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* 4 Quadrants Soft Tints */}
              <rect x="550" y="30" width="530" height="290" fill="#083344" fillOpacity="0.18" rx="14" />
              <rect x="550" y="320" width="530" height="290" fill="#4c0519" fillOpacity="0.15" rx="14" />
              <rect x="20" y="30" width="530" height="290" fill="#064e3b" fillOpacity="0.14" rx="14" />
              <rect x="20" y="320" width="530" height="290" fill="#451a03" fillOpacity="0.14" rx="14" />

              {/* Quadrant Titles */}
              <text x="570" y="55" fill="#22d3ee" fontSize="11" fontWeight="bold" letterSpacing="1">
                {dimensionMode === 'scope-vs-commission'
                  ? 'QUADRANT I • FULL OMNICHANNEL + 0% COMMISSION (THE SWEET SPOT)'
                  : 'QUADRANT I • ENTERPRISE SUITE + AI AUTOMATION'}
              </text>
              <text x="570" y="595" fill="#f43f5e" fontSize="11" fontWeight="bold" letterSpacing="1">
                {dimensionMode === 'scope-vs-commission'
                  ? 'QUADRANT II • FULL OMNICHANNEL + 2.5% COMMISSION TAX (LEGACY TRAPS)'
                  : 'QUADRANT II • ENTERPRISE SUITE + MANUAL / BASIC'}
              </text>
              <text x="40" y="55" fill="#34d399" fontSize="11" fontWeight="bold" letterSpacing="1">
                {dimensionMode === 'scope-vs-commission'
                  ? 'QUADRANT III • ONLINE-ONLY SHOPIFY APPS (FLAT $15-$49/MO)'
                  : 'QUADRANT III • BUDGET TOOLS ($15-$49) + HIGH AUTOMATION'}
              </text>
              <text x="40" y="595" fill="#fbbf24" fontSize="11" fontWeight="bold" letterSpacing="1">
                {dimensionMode === 'scope-vs-commission'
                  ? 'QUADRANT IV • NICHE STANDALONE TOOLS & CARD SHOW APPS'
                  : 'QUADRANT IV • BUDGET TOOLS + BASIC / MANUAL CSV'}
              </text>

              {/* Reference Grid lines */}
              {[-75, -50, -25, 25, 50, 75].map((val) => {
                const vertX = 550 + (val / 100) * 460;
                const horizY = 320 - (val / 100) * 250;
                return (
                  <g key={val} opacity={0.2}>
                    <line x1={vertX} y1="35" x2={vertX} y2="605" stroke="#475569" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="25" y1={horizY} x2="1075" y2={horizY} stroke="#475569" strokeWidth="1" strokeDasharray="3 3" />
                  </g>
                );
              })}

              {/* Solid Bidirectional Axes */}
              <line
                x1="40"
                y1="320"
                x2="1060"
                y2="320"
                stroke="#64748b"
                strokeWidth="2.5"
                markerEnd="url(#arrow-right)"
                markerStart="url(#arrow-left)"
              />
              <line
                x1="550"
                y1="600"
                x2="550"
                y2="40"
                stroke="#64748b"
                strokeWidth="2.5"
                markerEnd="url(#arrow-up)"
                markerStart="url(#arrow-down)"
              />

              <circle cx="550" cy="320" r="4" fill="#94a3b8" />
              <text x="558" y="335" fill="#64748b" fontSize="10" fontFamily="monospace">(0, 0)</text>

              {/* Pole Badges */}
              {/* TOP (+Y) */}
              <g transform="translate(550, 26)">
                <rect x="-180" y="-18" width="360" height="28" rx="8" fill="#064e3b" stroke="#10b981" strokeWidth="1.5" />
                <text x="0" y="1" fill="#ecfdf5" fontSize="11" fontWeight="bold" textAnchor="middle">
                  {dimensionMode === 'scope-vs-commission'
                    ? '▲ 0% SALES COMMISSION (PURE FLAT SAAS)'
                    : '▲ AI COMPUTER VISION & DYNAMIC REPRICING'}
                </text>
              </g>

              {/* BOTTOM (-Y) */}
              <g transform="translate(550, 618)">
                <rect x="-185" y="-12" width="370" height="28" rx="8" fill="#4c0519" stroke="#f43f5e" strokeWidth="1.5" />
                <text x="0" y="7" fill="#fff1f2" fontSize="11" fontWeight="bold" textAnchor="middle">
                  {dimensionMode === 'scope-vs-commission'
                    ? '▼ 2.0% – 2.5% REVENUE CUT (COMMISSION TAX)'
                    : '▼ MANUAL ENTRY & BASIC INVENTORY ONLY'}
                </text>
              </g>

              {/* LEFT (-X) */}
              <g transform="translate(130, 320)">
                <rect x="-115" y="-30" width="230" height="24" rx="6" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1.5" />
                <text x="0" y="-14" fill="#e0e7ff" fontSize="10" fontWeight="bold" textAnchor="middle">
                  {dimensionMode === 'scope-vs-commission'
                    ? '◄ ONLINE-ONLY / SINGLE CHANNEL'
                    : '◄ BUDGET / MICRO-SAAS ($10–$50/MO)'}
                </text>
              </g>

              {/* RIGHT (+X) */}
              <g transform="translate(970, 320)">
                <rect x="-115" y="-30" width="230" height="24" rx="6" fill="#451a03" stroke="#f59e0b" strokeWidth="1.5" />
                <text x="0" y="-14" fill="#fef3c7" fontSize="10" fontWeight="bold" textAnchor="middle">
                  {dimensionMode === 'scope-vs-commission'
                    ? 'BRICK & MORTAR / OMNICHANNEL ►'
                    : 'ENTERPRISE / FULL-STACK ($200–$1K) ►'}
                </text>
              </g>

              {/* Plotted Competitor Nodes */}
              {filteredCompetitors.map((comp) => {
                const rawCoord = activeCoords[comp.id] || { x: 0, y: 0, labelPos: 'top' };
                const svgPos = mapToSvg(rawCoord.x, rawCoord.y);
                const isHovered = hoveredComp?.id === comp.id;

                const nodeColor = comp.category === 'all-in-one'
                  ? '#818cf8'
                  : comp.category === 'shopify-apps'
                  ? '#34d399'
                  : '#fbbf24';

                return (
                  <g
                    key={comp.id}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredComp(comp)}
                    onMouseLeave={() => setHoveredComp(null)}
                    onClick={() => onInspect && onInspect(comp)}
                  >
                    {isHovered && (
                      <circle cx={svgPos.x} cy={svgPos.y} r="26" fill={nodeColor} fillOpacity="0.25" className="animate-ping" />
                    )}

                    <circle
                      cx={svgPos.x}
                      cy={svgPos.y}
                      r={isHovered ? 13 : 9}
                      fill={nodeColor}
                      stroke="#ffffff"
                      strokeWidth={isHovered ? 2.5 : 1.5}
                      className="transition-all duration-150 drop-shadow-md"
                    />

                    {comp.id === 'binderpos' && (
                      <g>
                        <rect
                          x={svgPos.x - 22}
                          y={svgPos.y + 14}
                          width="44"
                          height="14"
                          rx="3"
                          fill="#7e22ce"
                          stroke="#a855f7"
                          strokeWidth="1"
                        />
                        <text x={svgPos.x} y={svgPos.y + 24} fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">
                          FROZEN
                        </text>
                      </g>
                    )}

                    <text
                      x={svgPos.x}
                      y={
                        rawCoord.labelPos === 'top'
                          ? svgPos.y - 14
                          : rawCoord.labelPos === 'bottom'
                          ? svgPos.y + (comp.id === 'binderpos' ? 38 : 20)
                          : svgPos.y + 4
                      }
                      dx={rawCoord.labelPos === 'left' ? -14 : rawCoord.labelPos === 'right' ? 14 : 0}
                      textAnchor={
                        rawCoord.labelPos === 'left'
                          ? 'end'
                          : rawCoord.labelPos === 'right'
                          ? 'start'
                          : 'middle'
                      }
                      fill="#ffffff"
                      fontSize={isHovered ? 12 : 11}
                      fontWeight={isHovered ? 'bold' : '600'}
                      className="select-none pointer-events-none drop-shadow"
                    >
                      {comp.name}
                    </text>
                  </g>
                );
              })}

              {/* ★ AEETHOD OS TARGET POSITION */}
              {(() => {
                const saasCartPos = dimensionMode === 'scope-vs-commission'
                  ? { x: 88, y: 84 }
                  : { x: 50, y: 88 };
                const saasSvgPos = mapToSvg(saasCartPos.x, saasCartPos.y);

                return (
                  <g className="cursor-pointer">
                    <circle cx={saasSvgPos.x} cy={saasSvgPos.y} r="36" fill="url(#saasGlow)" className="animate-pulse" />
                    <circle cx={saasSvgPos.x} cy={saasSvgPos.y} r="22" fill="#06b6d4" fillOpacity="0.25" stroke="#22d3ee" strokeWidth="2" strokeDasharray="4 4" />
                    <circle cx={saasSvgPos.x} cy={saasSvgPos.y} r="15" fill="#06b6d4" stroke="#ffffff" strokeWidth="2.5" />
                    <text x={saasSvgPos.x} y={saasSvgPos.y + 5} fill="#ffffff" fontSize="13" fontWeight="900" textAnchor="middle">★</text>

                    <rect x={saasSvgPos.x - 55} y={saasSvgPos.y - 40} width="110" height="20" rx="4" fill="#083344" stroke="#22d3ee" strokeWidth="1.5" />
                    <text x={saasSvgPos.x} y={saasSvgPos.y - 26} fill="#67e8f9" fontSize="11" fontWeight="bold" textAnchor="middle">
                      ★ AEETHOD OS
                    </text>
                    <text x={saasSvgPos.x} y={saasSvgPos.y + 32} fill="#a5f3fc" fontSize="9.5" fontWeight="600" textAnchor="middle">
                      Omnichannel + 0% Cut
                    </text>
                  </g>
                );
              })()}
            </svg>

            {/* Hover Floating Details Card */}
            {hoveredComp && (
              <div className="absolute top-4 right-4 z-40 bg-[#202020] border border-indigo-500/50 rounded-2xl p-4 shadow-2xl backdrop-blur-md max-w-xs animate-in fade-in">
                <div className="flex items-center justify-between border-b border-[#2e2e2e] pb-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{
                        backgroundColor:
                          hoveredComp.category === 'all-in-one'
                            ? '#818cf8'
                            : hoveredComp.category === 'shopify-apps'
                            ? '#34d399'
                            : '#fbbf24',
                      }}
                    />
                    <h4 className="font-bold text-white text-xs">{hoveredComp.name}</h4>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{hoveredComp.estARR}</span>
                </div>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Base Price:</span>
                    <strong className="text-white">{hoveredComp.pricing.base}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Commission Cut:</span>
                    <strong
                      className={
                        hoveredComp.pricing.commissionRate.includes('2')
                          ? 'text-rose-400 font-bold'
                          : 'text-emerald-400 font-bold'
                      }
                    >
                      {hoveredComp.pricing.commissionRate}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Churn Level:</span>
                    <span className="text-amber-400 font-semibold capitalize">{hoveredComp.churnLevel}</span>
                  </div>
                  <div className="pt-2 border-t border-[#2e2e2e] text-[10px] text-rose-300">
                    <strong>Fatal Flaw: </strong>
                    {hoveredComp.weaknesses[0]}
                  </div>
                  {onInspect && (
                    <div
                      onClick={() => onInspect(hoveredComp)}
                      className="pt-1 text-[9px] text-cyan-400 flex items-center justify-end gap-1 cursor-pointer hover:underline"
                    >
                      <span>Click to open full battlecard</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Coordinate Spectrum Legend */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-[#252525] border border-[#2e2e2e] text-xs flex items-center gap-3">
              <span className="px-2 py-1 rounded bg-indigo-500/20 text-indigo-400 font-mono font-bold text-[11px]">
                X-AXIS
              </span>
              <span className="text-slate-300">
                <strong>Left:</strong> Online-Only / Shopify plugins{' '}
                <span className="text-slate-500">⟵ ⟷ ⟶</span>{' '}
                <strong>Right:</strong> Physical Store Omnichannel (POS + Buylist)
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#252525] border border-[#2e2e2e] text-xs flex items-center gap-3">
              <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold text-[11px]">
                Y-AXIS
              </span>
              <span className="text-slate-300">
                <strong>Bottom:</strong> 2.0%–2.5% Sales Commission Tax{' '}
                <span className="text-slate-500">⟵ ⟷ ⟶</span>{' '}
                <strong>Top:</strong> 0% Commission (Pure Flat SaaS)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: STRATEGIC 2x2 QUADRANT MATRIX */}
      {activeView === 'matrix' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quadrant 1: The Sweet Spot */}
          <div className="card p-6 border-2 border-cyan-500/40 bg-[#202020] space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-cyan-500 text-slate-950 font-mono">
                  QUADRANT I • THE SWEET SPOT
                </span>
                <span className="text-xs text-cyan-400 font-semibold">High Omnichannel + 0% Commission</span>
              </div>
              <h3 className="text-base font-bold text-white">★ Aeethod OS, RareOS, SortSwift</h3>
              <p className="text-xs text-slate-400">
                Full-featured POS and multi-channel card inventory with zero take-rate on singles GMV. Highly defensible against incumbent fee creep.
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {['Aeethod OS (Leader)', 'RareOS', 'SortSwift', 'Storepass (Enterprise)'].map((name) => (
                <span key={name} className="px-2 py-1 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-medium">
                  {name}
                </span>
              ))}
            </div>
          </div>

          {/* Quadrant 2: Legacy Traps */}
          <div className="card p-6 border border-rose-500/30 bg-[#202020] space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-400 font-mono">
                  QUADRANT II • LEGACY GMV TRAPS
                </span>
                <span className="text-xs text-rose-400 font-semibold">Omnichannel + 2.0% - 2.5% Tax</span>
              </div>
              <h3 className="text-base font-bold text-white">BinderPOS, TCG Sync, CrystalCommerce</h3>
              <p className="text-xs text-slate-400">
                Incumbents with legacy tech stacks taking \$1,000s/mo in commission from stores. BinderPOS signups halted since Feb 2025.
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {['BinderPOS (Paused)', 'TCG Sync', 'CrystalCommerce', 'MykaPOS'].map((name) => (
                <span key={name} className="px-2 py-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-medium">
                  {name}
                </span>
              ))}
            </div>
          </div>

          {/* Quadrant 3: Shopify Micro Apps */}
          <div className="card p-6 border border-emerald-500/30 bg-[#202020] space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 font-mono">
                  QUADRANT III • SHOPIFY POINT APPS
                </span>
                <span className="text-xs text-emerald-400 font-semibold">Online-Only + Flat \$15-\$49/mo</span>
              </div>
              <h3 className="text-base font-bold text-white">Synq, Kori, CardSync, GameLocker</h3>
              <p className="text-xs text-slate-400">
                Lightweight Shopify sync apps. Cheap and clean, but lack in-store retail POS, barcode terminals, and physical customer buylist kiosks.
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {['Synq TCG', 'Kori TCG', 'CardSync', 'GameLocker', 'TCG Automate'].map((name) => (
                <span key={name} className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-medium">
                  {name}
                </span>
              ))}
            </div>
          </div>

          {/* Quadrant 4: Point Solutions & Mobile */}
          <div className="card p-6 border border-amber-500/30 bg-[#202020] space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 font-mono">
                  QUADRANT IV • POINT & CARD SHOW TOOLS
                </span>
                <span className="text-xs text-amber-400 font-semibold">Single-Purpose Tools</span>
              </div>
              <h3 className="text-base font-bold text-white">DeckTradr, SnapSale, MyCardWizard</h3>
              <p className="text-xs text-slate-400">
                Specialized convention apps or manual card listing tools. Low integration footprint, vulnerable to full-suite disruption.
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {['DeckTradr', 'SnapSale', 'CardFlow', 'TCG PowerTools', 'Kyte'].map((name) => (
                <span key={name} className="px-2 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-medium">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
