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
  Coins,
  ShieldCheck,
  Gauge,
  AlertOctagon,
  Microscope,
  Clapperboard,
  Target,
  Compass,
  Share2,
  Bookmark,
  Users,
  CheckSquare,
  TrendingUp,
  BarChart3,
  Crosshair,
  Play
} from 'lucide-react';
import { useStore } from '../store';
import {
  CARD_GAME_SPECS,
  VARIANT_FINISHES,
  CONDITION_RUBRICS,
  OPTICAL_CHALLENGES,
  AUTHENTICATION_CHECKS,
  CARD_THICKNESS_SPECS,
  MISPRINT_TYPES,
  CardGameSpec,
  VariantFinish,
  ConditionTier,
  AuthenticationCheck,
  CardThicknessSpec,
  MisprintClassification
} from '../data/cardKnowledgeData';
import {
  AUDIENCE_COHORTS,
  WHITE_SPACE_GAPS,
  COMPETITOR_ANALYSIS,
  DEMAND_SUPPLY_MATRIX,
  PRE_FLIGHT_CHECKLIST_RULES,
  AudienceCohort
} from '../data/contentStrategyData';

export const CardKnowledgeHubView: React.FC = () => {
  const { theme } = useStore();
  const isLight = theme === 'light';

  const [activeTab, setActiveTab] = useState<'anatomy' | 'variants' | 'conditions' | 'auth' | 'thickness' | 'errors' | 'optics' | 'strategy'>('strategy');
  const [selectedGameId, setSelectedGameId] = useState<string>(CARD_GAME_SPECS[0].id);
  const [variantSearch, setVariantSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<'All' | 'Extreme' | 'High' | 'Medium'>('All');

  // Content Strategy & Market Intelligence state
  const [strategyModule, setStrategyModule] = useState<'audiences' | 'gaps' | 'competitors' | 'matrix' | 'checklist'>('audiences');
  const [selectedCohortId, setSelectedCohortId] = useState<string>('lgs_owner');
  const [checkedGates, setCheckedGates] = useState<Record<string, boolean>>({
    'gate-1': true,
    'gate-2': true,
    'gate-3': true
  });
  const [testerHook, setTesterHook] = useState('Selling a $100 card on a marketplace does NOT give you $100 in the bank.');

  const toggleGate = (id: string) => {
    setCheckedGates((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const selectedCohort = AUDIENCE_COHORTS.find((c) => c.id === selectedCohortId) || AUDIENCE_COHORTS[0];

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
            <span>1. Card Anatomy ({CARD_GAME_SPECS.length} Games)</span>
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
            <span>2. Variants & Finishes ({VARIANT_FINISHES.length})</span>
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
            <span>3. Condition Rubric (NM→DMG)</span>
          </button>

          <button
            onClick={() => setActiveTab('auth')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'auth'
                ? 'bg-indigo-600 text-white shadow-xs'
                : isLight
                ? 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                : 'bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 border border-zinc-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>4. Counterfeit & Auth ({AUTHENTICATION_CHECKS.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('thickness')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'thickness'
                ? 'bg-indigo-600 text-white shadow-xs'
                : isLight
                ? 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                : 'bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 border border-zinc-800'
            }`}
          >
            <Gauge className="w-3.5 h-3.5 text-amber-400" />
            <span>5. Thickness & Feeder Rules ({CARD_THICKNESS_SPECS.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('errors')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'errors'
                ? 'bg-indigo-600 text-white shadow-xs'
                : isLight
                ? 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                : 'bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 border border-zinc-800'
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
            <span>6. Errors & Misprints ({MISPRINT_TYPES.length})</span>
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
            <Camera className="w-3.5 h-3.5 text-cyan-400" />
            <span>7. Optical Hardware ({OPTICAL_CHALLENGES.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('strategy')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'strategy'
                ? 'bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 text-white shadow-md'
                : isLight
                ? 'bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200'
                : 'bg-purple-950/30 hover:bg-purple-900/40 text-purple-300 border border-purple-500/30'
            }`}
          >
            <Clapperboard className="w-3.5 h-3.5 text-pink-400" />
            <span>8. Content Strategy & Audience Intelligence (Blueprint)</span>
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
      {/* TAB 4: AUTHENTICATION & COUNTERFEIT DETECTION                       */}
      {/* =================================================================== */}
      {activeTab === 'auth' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3 text-xs">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-emerald-300">Automated Counterfeit Deterrence:</span>
              <p className="text-emerald-200/90 leading-relaxed">
                Counterfeits ("proxies") create massive inventory liability. An automated scanner must evaluate multi-spectral signals (micro-halftone rosettes, light transmission core density, 365nm UV fluorescence, and microprinting) before accepting a card into inventory.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {AUTHENTICATION_CHECKS.map((check) => (
              <div
                key={check.id}
                className={`p-6 rounded-2xl border space-y-4 ${
                  isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-[#1a1a22] border-[#292934]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                      {check.targetGames.join(', ')}
                    </span>
                    <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {check.testName}
                    </h3>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold border shrink-0 uppercase tracking-wider ${
                      check.aiFeasibility.includes('Fully Automatable')
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}
                  >
                    {check.aiFeasibility}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-100 dark:border-zinc-800 text-xs">
                  <span className="font-bold text-slate-400 block mb-0.5 text-[10px] uppercase">Required Hardware:</span>
                  <span className="font-mono text-indigo-400">{check.equipmentNeeded}</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                    <span className="font-bold text-emerald-400 block mb-1 text-[10px] uppercase">
                      Pass Criteria (Authentic Signal):
                    </span>
                    <p className="text-emerald-200/90 leading-relaxed">{check.passCriteria}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/20">
                    <span className="font-bold text-rose-400 block mb-1 text-[10px] uppercase">
                      Fail Criteria (Counterfeit / Re-backed Flag):
                    </span>
                    <p className="text-rose-200/90 leading-relaxed">{check.failCriteria}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-300">Financial Risk Prevented: </span>
                  {check.riskMitigation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 5: CARD THICKNESS & SCANNER FEEDER RULES (POINT GAUGE)          */}
      {/* =================================================================== */}
      {activeTab === 'thickness' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3 text-xs">
            <Gauge className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-amber-300">ADF Hardware Damage Warning:</span>
              <p className="text-amber-200/90 leading-relaxed">
                Automated Document Feeder (ADF) rollers (Ricoh fi-8170) have a strict physical throat clearance of 0.95mm. Feeding thick cards (&gt;55 pt) into a high-speed auto-feeder will result in severe mechanical jamming and permanent crease damage.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {CARD_THICKNESS_SPECS.map((spec) => (
              <div
                key={spec.id}
                className={`p-6 rounded-2xl border space-y-4 ${
                  isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-[#1a1a22] border-[#292934]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-black font-mono text-base">
                      {spec.pointSize}
                    </span>
                    <div>
                      <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {spec.thicknessMm} ({spec.thicknessInches})
                      </h3>
                      <span className="text-xs text-slate-400">Average Weight: {spec.weightGramsAvg}</span>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider shrink-0 ${
                      spec.adfSafe
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : spec.pointSize.includes('55')
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : 'bg-rose-500/10 text-rose-500 border-rose-500/30'
                    }`}
                  >
                    {spec.adfSafe ? 'ADF Auto-Feed Safe' : spec.pointSize.includes('55') ? 'Caution: Single-Feed Only' : 'PROHIBITED IN ADF'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-100 dark:border-zinc-800">
                    <span className="font-bold text-slate-400 block mb-1 text-[10px] uppercase">
                      Typical Card Types In This Gauge:
                    </span>
                    <ul className="space-y-1 list-disc list-inside text-slate-300">
                      {spec.cardTypes.map((type, i) => (
                        <li key={i}>{type}</li>
                      ))}
                    </ul>
                  </div>

                  <div
                    className={`p-3.5 rounded-xl border ${
                      spec.adfSafe
                        ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-300'
                        : 'bg-rose-500/5 border-rose-500/20 text-rose-300'
                    }`}
                  >
                    <span className="font-bold block mb-1 text-[10px] uppercase">
                      Scanner Engineering Protocol:
                    </span>
                    <p className="leading-relaxed font-medium">{spec.scannerFeedRule}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 6: FACTORY ERRORS & MISPRINTS TAXONOMY                          */}
      {/* =================================================================== */}
      {activeTab === 'errors' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-start gap-3 text-xs">
            <AlertOctagon className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-purple-300">Error Recognition vs Defect Penalties:</span>
              <p className="text-purple-200/90 leading-relaxed">
                Standard grading algorithms would penalize miscuts and crimps as "Damaged". However, verified factory errors command a 3x to 50x price premium in collector communities. The AI must differentiate genuine factory errors from user damage.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MISPRINT_TYPES.map((err) => (
              <div
                key={err.id}
                className={`p-6 rounded-2xl border space-y-4 ${
                  isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-[#1a1a22] border-[#292934]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider">
                      {err.collectorName}
                    </span>
                    <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {err.name}
                    </h3>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30 shrink-0">
                    {err.rarity}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/20 text-xs">
                  <span className="font-bold text-purple-300 block mb-0.5 text-[10px] uppercase">
                    Collector Market Value Impact:
                  </span>
                  <span className="font-semibold text-white">{err.marketImpact}</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-bold text-slate-400 block mb-1 text-[10px] uppercase">
                      Physical Visual Cues:
                    </span>
                    <p className={`leading-relaxed ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>
                      {err.visualCharacteristics}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-100 dark:border-zinc-800">
                    <span className="font-bold text-indigo-400 block mb-1 text-[10px] uppercase">
                      Computer Vision Detection Strategy:
                    </span>
                    <p className="text-slate-300 leading-relaxed font-mono text-[11px]">
                      {err.cvDetectionStrategy}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 7: OPTICAL & HARDWARE CHALLENGES                                */}
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

      {/* =================================================================== */}
      {/* TAB 8: TCG CONTENT STRATEGY & AUDIENCE INTELLIGENCE                  */}
      {/* =================================================================== */}
      {activeTab === 'strategy' && (
        <div className="space-y-8 animate-fade-in">
          {/* Top Mission & Pre-Production Banner */}
          <div
            className={`p-6 sm:p-8 rounded-2xl border transition ${
              isLight
                ? 'bg-gradient-to-br from-white via-purple-50/40 to-pink-50/30 border-purple-200/90 shadow-xs'
                : 'bg-gradient-to-br from-[#1d1b28] via-[#161520] to-[#121118] border-[#302c42] shadow-xl'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    Content Engine Pre-Production Blueprint
                  </span>
                  <span className="text-xs text-slate-400">• Audience Psychographics, Market Gaps & Algorithmic Levers</span>
                </div>
                <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  TCG Content Strategy & Audience Intelligence
                </h2>
                <p className={`text-xs sm:text-sm max-w-3xl leading-relaxed ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
                  Before writing scripts or turning on cameras, understand the 4 viewer psychographics, exploit the
                  unfilled market gaps, and pass every video through the 6-gate algorithmic filter to guarantee views.
                </p>
              </div>

              {/* Quick Strategy Stat Badges */}
              <div className="flex items-center gap-2.5 font-mono">
                <div className={`p-3 rounded-xl border text-center ${isLight ? 'bg-white border-purple-200 shadow-2xs' : 'bg-black/30 border-purple-500/20'}`}>
                  <span className="text-[10px] uppercase text-slate-400 block">Cohorts</span>
                  <strong className="text-base font-bold text-purple-400">4 Profiles</strong>
                </div>
                <div className={`p-3 rounded-xl border text-center ${isLight ? 'bg-white border-purple-200 shadow-2xs' : 'bg-black/30 border-purple-500/20'}`}>
                  <span className="text-[10px] uppercase text-slate-400 block">Arbitrage</span>
                  <strong className="text-base font-bold text-emerald-400">80% Focus</strong>
                </div>
                <div className={`p-3 rounded-xl border text-center ${isLight ? 'bg-white border-purple-200 shadow-2xs' : 'bg-black/30 border-purple-500/20'}`}>
                  <span className="text-[10px] uppercase text-slate-400 block">Pre-Flight</span>
                  <strong className="text-base font-bold text-pink-400">6 Gates</strong>
                </div>
              </div>
            </div>

            {/* Sub-Module Switcher */}
            <div className="flex flex-wrap items-center gap-2 pt-6 mt-6 border-t border-purple-500/15">
              {[
                { id: 'audiences', label: '1. Audience Anatomy (4 Profiles)', icon: Users },
                { id: 'gaps', label: '2. White Space Gaps (Red vs Blue)', icon: Compass },
                { id: 'competitors', label: '3. Competitor Teardown', icon: Target },
                { id: 'matrix', label: '4. Demand vs Supply Matrix', icon: BarChart3 },
                { id: 'checklist', label: '5. Pre-Flight 6-Gate Tester', icon: CheckSquare }
              ].map((m) => {
                const Icon = m.icon;
                const isActive = strategyModule === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setStrategyModule(m.id as any)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
                      isActive
                        ? 'bg-purple-600 text-white shadow-sm'
                        : isLight
                        ? 'bg-white hover:bg-purple-50 text-slate-700 border border-slate-200'
                        : 'bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 border border-zinc-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ================================================================= */}
          {/* SUB-MODULE 1: AUDIENCE ANATOMY (4 PROFILES)                       */}
          {/* ================================================================= */}
          {strategyModule === 'audiences' && (
            <div className="space-y-6">
              {/* Cohort Chips */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-xs font-semibold text-slate-400 mr-1">Select Cohort Profile:</span>
                {AUDIENCE_COHORTS.map((cohort) => {
                  const isSelected = cohort.id === selectedCohortId;
                  return (
                    <button
                      key={cohort.id}
                      onClick={() => setSelectedCohortId(cohort.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-2 transition ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : isLight
                          ? 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                          : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 border border-zinc-800'
                      }`}
                    >
                      <span>{cohort.avatarIcon}</span>
                      <span>{cohort.title.split(' ')[1] || cohort.title}</span>
                    </button>
                  );
                })}
              </div>

              {/* Detailed Active Cohort Card */}
              <div
                className={`p-6 sm:p-7 rounded-2xl border space-y-6 ${
                  isLight ? 'bg-white border-slate-200/90 shadow-sm' : 'bg-[#181820] border-[#292934] shadow-md'
                }`}
              >
                {/* Cohort Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-zinc-800">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-2xl">
                      {selectedCohort.avatarIcon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                          {selectedCohort.title}
                        </h3>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${selectedCohort.badgeColor}`}>
                          {selectedCohort.tag}
                        </span>
                      </div>
                      <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        {selectedCohort.demographics}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400">Creator Best Fit:</span>
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono ${
                      selectedCohort.creatorFit === 'Sadid'
                        ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                        : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {selectedCohort.creatorFit}
                    </span>
                  </div>
                </div>

                {/* Primary Nightmare vs Primary Desire (Two Columns) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Nightmare */}
                  <div className={`p-4 rounded-xl border space-y-2 ${
                    isLight ? 'bg-rose-50/50 border-rose-200/80 text-rose-950' : 'bg-rose-950/15 border-rose-500/20 text-rose-200'
                  }`}>
                    <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px] text-rose-500 font-mono">
                      <span>⚠️</span>
                      <span>Primary Nightmare (Pain / Anxiety Trigger)</span>
                    </div>
                    <p className="leading-relaxed text-[11px]">
                      {selectedCohort.primaryNightmare}
                    </p>
                  </div>

                  {/* Desire */}
                  <div className={`p-4 rounded-xl border space-y-2 ${
                    isLight ? 'bg-emerald-50/50 border-emerald-200/80 text-emerald-950' : 'bg-emerald-950/15 border-emerald-500/20 text-emerald-200'
                  }`}>
                    <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px] text-emerald-500 font-mono">
                      <span>🎯</span>
                      <span>Primary Desire (Greed / Relief Trigger)</span>
                    </div>
                    <p className="leading-relaxed text-[11px]">
                      {selectedCohort.greedDesire}
                    </p>
                  </div>
                </div>

                {/* Algorithmic Interaction Habit */}
                <div className={`p-4 rounded-xl border space-y-2.5 ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/25 border-[#282834]'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase font-bold text-purple-400">
                      Algorithmic Distribution Mechanism & Interaction Habit
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-pink-500/10 text-pink-400 border border-pink-500/20">
                      Target Action: {selectedCohort.keyInteractionTrigger}
                    </span>
                  </div>
                  <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    {selectedCohort.algorithmicHabit}
                  </p>

                  <div className="pt-2 border-t border-slate-200/60 dark:border-zinc-800">
                    <span className="text-[10px] text-slate-400 font-mono block mb-1.5 uppercase font-bold">
                      High-Affinity Trigger Keywords:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedCohort.triggerKeywords.map((kw, i) => (
                        <span
                          key={i}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                            isLight ? 'bg-white text-slate-700 border border-slate-200' : 'bg-white/5 text-slate-300 border border-white/10'
                          }`}
                        >
                          #{kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tested Winning Hooks */}
                <div className="space-y-2.5">
                  <span className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Play className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Tested Winning Hooks for This Cohort:</span>
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                    {selectedCohort.winningHooks.map((hook, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border text-xs italic ${
                          isLight ? 'bg-indigo-50/30 border-indigo-200/70 text-slate-800' : 'bg-indigo-950/15 border-indigo-500/20 text-slate-200'
                        }`}
                      >
                        "{hook}"
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* SUB-MODULE 2: WHITE SPACE GAPS (RED OCEAN VS BLUE OCEAN)          */}
          {/* ================================================================= */}
          {strategyModule === 'gaps' && (
            <div className="space-y-6">
              <div>
                <h3 className={`text-sm font-bold uppercase tracking-wider font-mono flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  <Compass className="w-4 h-4 text-purple-400" />
                  <span>The White Space: Saturated Commodities vs Aeethod's Blue Ocean</span>
                </h3>
                <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  How to systematically avoid what 99% of creators do and exploit what the audience is starved to see.
                </p>
              </div>

              <div className="space-y-4">
                {WHITE_SPACE_GAPS.map((gap) => (
                  <div
                    key={gap.id}
                    className={`p-5 rounded-2xl border space-y-4 ${
                      isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#181820] border-[#292934]'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
                      <h4 className="font-bold text-sm text-indigo-400 font-mono">{gap.niche}</h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        Assigned: {gap.blueOceanWedge.creator}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      {/* Red Ocean Trap */}
                      <div className={`p-4 rounded-xl border space-y-2 ${
                        isLight ? 'bg-rose-50/40 border-rose-200' : 'bg-rose-950/15 border-rose-500/20'
                      }`}>
                        <div className="flex items-center gap-2 font-bold font-mono text-[11px] text-rose-500 uppercase">
                          <span>✗</span>
                          <span>The Saturated Red Ocean (What Competitors Do)</span>
                        </div>
                        <div className="font-semibold text-rose-400">{gap.redOceanTrap.title}</div>
                        <p className={`text-[11px] leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                          {gap.redOceanTrap.flaw}
                        </p>
                        <div className="text-[10px] font-mono text-rose-400 pt-1 border-t border-rose-500/20">
                          Result: {gap.redOceanTrap.consequence}
                        </div>
                      </div>

                      {/* Blue Ocean Wedge */}
                      <div className={`p-4 rounded-xl border space-y-2 ${
                        isLight ? 'bg-emerald-50/40 border-emerald-200' : 'bg-emerald-950/15 border-emerald-500/20'
                      }`}>
                        <div className="flex items-center gap-2 font-bold font-mono text-[11px] text-emerald-500 uppercase">
                          <span>✓</span>
                          <span>The Blue Ocean Wedge (Aeethod OS Moat)</span>
                        </div>
                        <div className="font-semibold text-emerald-400">{gap.blueOceanWedge.title}</div>
                        <p className={`text-[11px] leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                          {gap.blueOceanWedge.advantage}
                        </p>
                        <div className="text-[10px] font-mono text-emerald-400 pt-1 border-t border-emerald-500/20">
                          Algorithmic Moat: {gap.blueOceanWedge.algorithmicMoat}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* SUB-MODULE 3: COMPETITOR TEARDOWN & POSITIONING                   */}
          {/* ================================================================= */}
          {strategyModule === 'competitors' && (
            <div className="space-y-6">
              <div>
                <h3 className={`text-sm font-bold uppercase tracking-wider font-mono flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  <Target className="w-4 h-4 text-purple-400" />
                  <span>Competitor Teardown: Why Existing Players Leave Money on the Table</span>
                </h3>
                <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Analysis of the 3 competitor archetypes in the collectibles ecosystem and how Aeethod takes their audience.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {COMPETITOR_ANALYSIS.map((comp) => (
                  <div
                    key={comp.id}
                    className={`p-5 rounded-2xl border space-y-3.5 flex flex-col justify-between ${
                      isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#181820] border-[#292934]'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs uppercase font-mono text-purple-400">
                          {comp.category}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">
                        E.g.: {comp.representativePlayers}
                      </div>

                      <div className="pt-2 space-y-2 text-xs">
                        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-black/20 space-y-1">
                          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                            Core Strength:
                          </span>
                          <p className={`text-[11px] ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                            {comp.coreStrength}
                          </p>
                        </div>

                        <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 space-y-1 text-rose-300">
                          <span className="text-[10px] font-mono uppercase text-rose-400 font-bold block">
                            Fatal Blindspot:
                          </span>
                          <p className="text-[11px] text-rose-200">
                            {comp.fatalBlindspot}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs">
                      <span className="text-[10px] font-mono uppercase text-indigo-400 font-bold block mb-1">
                        How Aeethod OS Wins:
                      </span>
                      <p className="text-[11px] font-medium leading-relaxed">
                        {comp.aeethodWedge}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Master Positioning Callout */}
              <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                isLight ? 'bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200' : 'bg-gradient-to-r from-purple-950/25 to-indigo-950/25 border-purple-500/20'
              }`}>
                <div>
                  <h4 className="font-bold text-sm font-mono uppercase text-purple-400">
                    Aeethod OS Strategic Positioning Statement
                  </h4>
                  <p className={`text-xs mt-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    "The Bloomberg Terminal & CSI Crime Scene Unit of the Trading Card Industry."
                  </p>
                </div>
                <span className="px-3 py-1 rounded-xl bg-purple-600 text-white text-xs font-bold font-mono shrink-0 shadow-sm">
                  Forensic Precision &gt; Commodity Hype
                </span>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* SUB-MODULE 4: DEMAND VS SUPPLY MATRIX (CONTENT ARBITRAGE)         */}
          {/* ================================================================= */}
          {strategyModule === 'matrix' && (
            <div className="space-y-6">
              <div>
                <h3 className={`text-sm font-bold uppercase tracking-wider font-mono flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  <BarChart3 className="w-4 h-4 text-purple-400" />
                  <span>Demand vs. Supply Matrix: Content Arbitrage Allocation</span>
                </h3>
                <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Focus 80% of production on high-demand, near-zero supply formats. Never film the flop traps.
                </p>
              </div>

              <div className="space-y-4">
                {DEMAND_SUPPLY_MATRIX.map((item) => (
                  <div
                    key={item.id}
                    className={`p-5 rounded-2xl border space-y-4 ${
                      isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#181820] border-[#292934]'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-zinc-800">
                      <div className="flex items-center gap-2.5">
                        <span className={`px-2.5 py-0.5 rounded text-xs font-bold font-mono ${item.badge}`}>
                          {item.allocationPct}
                        </span>
                        <h4 className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>
                          {item.quadrantName}
                        </h4>
                      </div>
                      <div className="flex items-center gap-3 font-mono text-xs text-slate-400">
                        <span>Demand: <strong className={item.demandLevel === 'High' ? 'text-emerald-400' : 'text-rose-400'}>{item.demandLevel}</strong></span>
                        <span>•</span>
                        <span>Supply: <strong className={item.supplyLevel === 'Low' ? 'text-indigo-400' : 'text-amber-400'}>{item.supplyLevel}</strong></span>
                      </div>
                    </div>

                    <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                      {item.strategicDirective}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      {item.examples.map((ex, idx) => (
                        <div
                          key={idx}
                          className={`p-3.5 rounded-xl border space-y-1.5 ${
                            isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/25 border-[#282834]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <strong className="text-xs text-indigo-400 font-mono">{ex.topic}</strong>
                            <span className="text-[10px] text-slate-400">{ex.mechanism}</span>
                          </div>
                          <div className="text-[11px] italic text-slate-300">
                            "{ex.hookPreview}"
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* SUB-MODULE 5: PRE-FLIGHT 6-GATE TESTER                            */}
          {/* ================================================================= */}
          {strategyModule === 'checklist' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className={`text-sm font-bold uppercase tracking-wider font-mono flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    <CheckSquare className="w-4 h-4 text-purple-400" />
                    <span>The 6-Gate Pre-Flight Verification Checklist</span>
                  </h3>
                  <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    Test any video idea before filming. A video must pass all 6 gates to receive algorithmic distribution.
                  </p>
                </div>

                {/* Score Pill */}
                <div className="flex items-center gap-2 shrink-0 font-mono">
                  <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold ${
                    Object.values(checkedGates).filter(Boolean).length === 6
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      : Object.values(checkedGates).filter(Boolean).length >= 4
                      ? 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30'
                      : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                  }`}>
                    {Object.values(checkedGates).filter(Boolean).length} / 6 Gates Cleared
                  </div>
                </div>
              </div>

              {/* Interactive Hook Tester */}
              <div className={`p-4 rounded-xl border space-y-2.5 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#1c1c26] border-[#2d2d3e]'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-purple-400 uppercase">
                    Interactive Hook Diagnostic Tester
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">Simulate Concept Gate</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={testerHook}
                    onChange={(e) => setTesterHook(e.target.value)}
                    placeholder="Type or paste your video hook sentence here..."
                    className={`w-full px-3 py-2 rounded-lg text-xs font-medium border outline-none ${
                      isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-black/30 border-[#38384a] text-white'
                    }`}
                  />
                  <button
                    onClick={() => {
                      setCheckedGates({
                        'gate-1': true,
                        'gate-2': true,
                        'gate-3': true,
                        'gate-4': true,
                        'gate-5': true,
                        'gate-6': true
                      });
                    }}
                    className="px-3.5 py-2 rounded-lg text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shrink-0 transition"
                  >
                    Pass All 6
                  </button>
                </div>
              </div>

              {/* The 6 Checklist Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PRE_FLIGHT_CHECKLIST_RULES.map((rule) => {
                  const isChecked = Boolean(checkedGates[rule.id]);

                  return (
                    <div
                      key={rule.id}
                      onClick={() => toggleGate(rule.id)}
                      className={`p-4 rounded-xl border space-y-3 cursor-pointer transition select-none ${
                        isChecked
                          ? isLight
                            ? 'bg-emerald-50/40 border-emerald-300 shadow-2xs'
                            : 'bg-emerald-950/15 border-emerald-500/30'
                          : isLight
                          ? 'bg-white border-slate-200 hover:border-slate-300'
                          : 'bg-[#181820] border-[#292934] hover:border-[#38384a]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-5 h-5 rounded flex items-center justify-center text-xs font-bold transition ${
                              isChecked
                                ? 'bg-emerald-500 text-white'
                                : 'border border-slate-400 text-transparent'
                            }`}
                          >
                            ✓
                          </div>
                          <span className="font-mono text-xs font-bold text-slate-200">
                            Gate {rule.stepNumber}: {rule.gateName}
                          </span>
                        </div>

                        <span className="text-[10px] font-mono text-emerald-400">
                          {rule.algorithmicReward}
                        </span>
                      </div>

                      <div className="text-xs font-semibold pl-7 text-slate-200">
                        {rule.coreQuestion}
                      </div>

                      <div className="pl-7 space-y-1 text-[11px] font-mono">
                        <div className="text-emerald-500">✓ Pass: {rule.passIndicator}</div>
                        <div className="text-rose-400">✗ Flop Trap: {rule.killTrigger}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
