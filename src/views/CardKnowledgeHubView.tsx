import React, { useState } from 'react';
import {
  BookOpen,
  Layers,
  Sparkles,
  ShieldAlert,
  Cpu,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Search,
  Eye,
  Scan,
  Zap,
  Scale,
  Maximize2,
  ChevronRight,
  HelpCircle,
  Camera,
  Coins
} from 'lucide-react';
import { useStore } from '../store';
import {
  CARD_GAME_SPECS,
  VARIANT_FINISHES,
  CONDITION_RUBRICS,
  OPTICAL_CHALLENGES,
  CardGameSpec,
  VariantFinish,
  ConditionTier
} from '../data/cardKnowledgeData';

export const CardKnowledgeHubView: React.FC = () => {
  const { theme } = useStore();
  const isLight = theme === 'light';

  const [activeTab, setActiveTab] = useState<'anatomy' | 'variants' | 'conditions' | 'optics'>('anatomy');
  const [selectedGameId, setSelectedGameId] = useState<string>(CARD_GAME_SPECS[0].id);
  const [variantSearch, setVariantSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<'All' | 'Extreme' | 'High' | 'Medium'>('All');

  const selectedGame = CARD_GAME_SPECS.find((g) => g.id === selectedGameId) || CARD_GAME_SPECS[0];

  const filteredVariants = VARIANT_FINISHES.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(variantSearch.toLowerCase()) ||
      v.visualCharacteristics.toLowerCase().includes(variantSearch.toLowerCase()) ||
      v.games.some((g) => g.toLowerCase().includes(variantSearch.toLowerCase()));
    const matchesRisk = riskFilter === 'All' || v.financialRiskLevel === riskFilter;
    return matchesSearch && matchesRisk;
  });

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'Extreme':
        return 'bg-rose-500/10 text-rose-500 border-rose-500/30';
      case 'High':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/30';
      case 'Medium':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8 animate-slide-in select-text">
      {/* 1. Header Banner */}
      <div
        className={`p-6 sm:p-8 rounded-2xl border transition-all ${
          isLight
            ? 'bg-gradient-to-br from-white via-indigo-50/20 to-slate-50 border-slate-200/90 shadow-xs'
            : 'bg-gradient-to-br from-[#1c1c24] via-[#16161d] to-[#121217] border-[#292934] shadow-xl'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 uppercase tracking-wider font-mono">
                Domain Intelligence
              </span>
              <span className="text-xs text-slate-400">• Core TCG Science for Computer Vision</span>
            </div>
            <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              TCG Knowledge Hub & Card Taxonomy
            </h1>
            <p className={`text-xs sm:text-sm max-w-3xl leading-relaxed ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
              Before engineering automated scanning hardware, understand how cards are constructed: microscopic
              variant identifiers, expansion set heuristics, localized bounding boxes, and condition grading tolerances.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="#/cards/anatomy"
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition active:scale-95"
            >
              <Scan className="w-4 h-4" />
              <span>Open Visual Card Inspector</span>
              <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
            </a>
          </div>
        </div>

        {/* 2. Primary Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-6 mt-6 border-t border-slate-200/60 dark:border-zinc-800">
          <button
            onClick={() => setActiveTab('anatomy')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'anatomy'
                ? 'bg-indigo-600 text-white shadow-xs'
                : isLight
                ? 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                : 'bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 border border-zinc-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>1. Card Anatomy & Detection Zones</span>
          </button>

          <button
            onClick={() => setActiveTab('variants')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'variants'
                ? 'bg-indigo-600 text-white shadow-xs'
                : isLight
                ? 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                : 'bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 border border-zinc-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>2. Variants & Foil Finishes Matrix ({VARIANT_FINISHES.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('conditions')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'conditions'
                ? 'bg-indigo-600 text-white shadow-xs'
                : isLight
                ? 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                : 'bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 border border-zinc-800'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>3. Condition Grading Rubrics (NM → DMG)</span>
          </button>

          <button
            onClick={() => setActiveTab('optics')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'optics'
                ? 'bg-indigo-600 text-white shadow-xs'
                : isLight
                ? 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                : 'bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 border border-zinc-800'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>4. Optical & Hardware Challenges ({OPTICAL_CHALLENGES.length})</span>
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* TAB 1: CARD ANATOMY & DETECTION ZONES                                */}
      {/* =================================================================== */}
      {activeTab === 'anatomy' && (
        <div className="space-y-6">
          {/* Game Selector Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 mr-2">Select Game Spec:</span>
            {CARD_GAME_SPECS.map((game) => (
              <button
                key={game.id}
                onClick={() => setSelectedGameId(game.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                  selectedGameId === game.id
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : isLight
                    ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                }`}
              >
                {game.name}
              </button>
            ))}
          </div>

          {/* Game Overview Card */}
          <div
            className={`p-6 rounded-2xl border space-y-6 ${
              isLight ? 'bg-white border-slate-200/90 shadow-xs' : 'bg-[#1a1a22] border-[#292934]'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-zinc-800">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className={`text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {selectedGame.name}
                  </h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {selectedGame.era}
                  </span>
                </div>
                <p className="text-xs text-slate-400 pt-1">
                  Physical dimensions, cardstock weight, and optical orientation specs.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                <span className="px-2.5 py-1 rounded-lg bg-zinc-800/80 text-zinc-200 border border-zinc-700">
                  📏 {selectedGame.dimensionMm} ({selectedGame.dimensionInches})
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-zinc-800/80 text-zinc-200 border border-zinc-700">
                  ⚖️ {selectedGame.cardstockWeight}
                </span>
              </div>
            </div>

            {/* Heuristics Bullet Points */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Key Identification Heuristics</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                {selectedGame.keyIdentificationHeuristics.map((h, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-xl border text-xs leading-relaxed flex items-start gap-2.5 ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-zinc-900/60 border-zinc-800 text-zinc-300'
                    }`}
                  >
                    <span className="text-amber-500 font-bold shrink-0">#{i + 1}</span>
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Micro-Region Bounding Boxes Table */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                  <Scan className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Computer Vision Regions of Interest (ROI Coordinates)</span>
                </h4>
                <a
                  href="#/cards/anatomy"
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                >
                  <span>Inspect on interactive canvas</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-zinc-800">
                <table className="w-full text-left text-xs">
                  <thead className={isLight ? 'bg-slate-50 text-slate-700' : 'bg-zinc-900 text-zinc-400'}>
                    <tr className="border-b border-slate-200 dark:border-zinc-800">
                      <th className="py-2.5 px-4 font-semibold">Region Label</th>
                      <th className="py-2.5 px-4 font-semibold">Spatial Bounding Box</th>
                      <th className="py-2.5 px-4 font-semibold">AI Pipeline & Model</th>
                      <th className="py-2.5 px-4 font-semibold">Purpose & Target Data</th>
                      <th className="py-2.5 px-4 font-semibold">Edge Cases & Pitfalls</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/80 font-sans">
                    {selectedGame.zones.map((zone) => (
                      <tr key={zone.id} className="hover:bg-indigo-50/20 dark:hover:bg-zinc-900/40 transition">
                        <td className="py-3 px-4 font-semibold">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: zone.color }}
                            />
                            <span className={isLight ? 'text-slate-900' : 'text-white'}>{zone.label}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                          x:{zone.xPercent}%, y:{zone.yPercent}% <br />
                          {zone.widthPercent}% × {zone.heightPercent}%
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded font-mono text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                            {zone.aiPipeline}
                          </span>
                        </td>
                        <td className={`py-3 px-4 leading-relaxed ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>
                          {zone.purpose}
                        </td>
                        <td className="py-3 px-4 text-slate-400 leading-relaxed text-[11px]">
                          {zone.pitfalls}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 2: VARIANTS & FOIL FINISHES MATRIX                              */}
      {/* =================================================================== */}
      {activeTab === 'variants' && (
        <div className="space-y-6">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-xl border bg-white dark:bg-zinc-900/80 border-slate-200 dark:border-zinc-800 text-xs">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={variantSearch}
                onChange={(e) => setVariantSearch(e.target.value)}
                placeholder="Search variant name (e.g. Masterball, Reverse Holo, Serialized)..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400 shrink-0">Financial Risk:</span>
              {(['All', 'Extreme', 'High', 'Medium'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setRiskFilter(lvl)}
                  className={`px-2.5 py-1 rounded-lg border font-medium transition ${
                    riskFilter === lvl
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'border-slate-200 dark:border-zinc-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Variant Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredVariants.map((v) => (
              <div
                key={v.id}
                className={`p-6 rounded-2xl border space-y-4 transition ${
                  isLight ? 'bg-white border-slate-200/90 shadow-xs' : 'bg-[#1a1a22] border-[#292934]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {v.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-400">
                      <span>Games: {v.games.join(', ')}</span>
                      <span>•</span>
                      <span className="text-indigo-400 font-mono font-medium">{v.rarityLevel}</span>
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getRiskBadge(v.financialRiskLevel)}`}>
                    {v.financialRiskLevel} Risk
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-100 dark:border-zinc-800 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-indigo-400 font-mono font-bold">
                    <span>Market Value Premium:</span>
                    <span>{v.priceMultiplier}</span>
                  </div>
                  <p className={`leading-relaxed ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>
                    {v.visualCharacteristics}
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-semibold text-emerald-500 block mb-0.5">
                      🔬 Computer Vision Detection:
                    </span>
                    <p className="text-slate-400 leading-relaxed text-[11px]">
                      {v.scannerDetectionMethod}
                    </p>
                  </div>

                  <div>
                    <span className="font-semibold text-rose-500 block mb-0.5">
                      ⚠️ Most Common Store Mistake:
                    </span>
                    <p className="text-slate-400 leading-relaxed text-[11px]">
                      {v.commonConfusion}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 3: CONDITION GRADING RUBRICS                                    */}
      {/* =================================================================== */}
      {activeTab === 'conditions' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {CONDITION_RUBRICS.map((cond) => {
              const borderColors: Record<string, string> = {
                NM: 'border-emerald-500/40 text-emerald-400',
                LP: 'border-cyan-500/40 text-cyan-400',
                MP: 'border-amber-500/40 text-amber-400',
                HP: 'border-orange-500/40 text-orange-400',
                DMG: 'border-rose-500/40 text-rose-400'
              };

              return (
                <div
                  key={cond.id}
                  className={`p-5 rounded-2xl border space-y-4 flex flex-col justify-between ${
                    isLight ? 'bg-white border-slate-200/90 shadow-xs' : 'bg-[#1a1a22] border-[#292934]'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-2xl font-black font-mono ${borderColors[cond.code]}`}>
                        {cond.code}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400 font-semibold">
                        {cond.psaEquivalent}
                      </span>
                    </div>

                    <h4 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {cond.name}
                    </h4>

                    <div className="text-[11px] font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                      {cond.marketPriceDeduction}
                    </div>

                    <div className="space-y-2 text-xs pt-1 text-slate-300">
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">Centering:</span>
                        <p className="text-[11px] text-slate-300">{cond.centeringTolerance}</p>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">Edges:</span>
                        <p className="text-[11px] text-slate-300">{cond.edgesTolerance}</p>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">Corners:</span>
                        <p className="text-[11px] text-slate-300">{cond.cornersTolerance}</p>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">Surface:</span>
                        <p className="text-[11px] text-slate-300">{cond.surfaceTolerance}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 text-[11px]">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Buyer Dispute Risk:</span>
                    <p className="text-amber-400 font-medium">{cond.customerDisputeRisk}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 4: OPTICAL & HARDWARE CHALLENGES                                */}
      {/* =================================================================== */}
      {activeTab === 'optics' && (
        <div className="space-y-4">
          {OPTICAL_CHALLENGES.map((ch, idx) => (
            <div
              key={ch.id}
              className={`p-6 rounded-2xl border space-y-4 ${
                isLight ? 'bg-white border-slate-200/90 shadow-xs' : 'bg-[#1a1a22] border-[#292934]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-mono font-bold text-xs">
                    0{idx + 1}
                  </span>
                  <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {ch.title}
                  </h3>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                    ch.severity === 'Critical'
                      ? 'bg-rose-500/10 text-rose-500 border-rose-500/30'
                      : 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                  }`}
                >
                  {ch.severity} Obstacle
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-1">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-100 dark:border-zinc-800">
                  <span className="font-bold text-slate-400 block mb-1 uppercase tracking-wider text-[10px]">
                    Root Physical Cause:
                  </span>
                  <p className={`leading-relaxed ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>
                    {ch.cause}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-rose-500/5 border border-rose-500/20">
                  <span className="font-bold text-rose-400 block mb-1 uppercase tracking-wider text-[10px]">
                    Software Failure Mode:
                  </span>
                  <p className="text-rose-300 leading-relaxed">{ch.failureMode}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <span className="font-bold text-emerald-400 block mb-1 uppercase tracking-wider text-[10px]">
                    Engineering Solution:
                  </span>
                  <p className="text-emerald-300 leading-relaxed font-medium">{ch.engineeringSolution}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
