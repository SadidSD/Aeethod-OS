import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  Scan,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Database,
  Globe,
  Cpu,
  Key,
  ShieldAlert,
  Copy,
  Check,
  ExternalLink,
  Zap,
  Filter,
  Award,
  Hash,
  Eye,
  Server,
  HardDrive,
  GitBranch,
  Flame
} from 'lucide-react';
import { useStore } from '../store';
import {
  FOURTEEN_POINT_FINGERPRINTS,
  FINGERPRINT_KEY_EXAMPLES,
  HISTORICAL_ERAS,
  PRINT_RUN_RULES,
  WOTC_1ST_EDITION_SETS,
  OFFICIAL_LANGUAGES,
  FOIL_BULK_SPECS,
  STAMP_ZONE_SPECS,
  COLLECTOR_NUMBER_EDGE_CASES,
  RARITY_SYMBOLS,
  ETL_PIPELINE_STAGES,
  PRODUCTION_SUPABASE_SQL,
  ALL_26_COMPETITORS_MATRIX
} from '../data/pokemonMasterArchitectureData';

type MasterTab = 'fingerprint' | 'eras-languages' | 'variants-stamps' | 'scanner-cv' | 'database-etl';

export const CardKnowledgeHubView: React.FC = () => {
  const { theme } = useStore();
  const isLight = theme === 'light';

  const [activeTab, setActiveTab] = useState<MasterTab>('fingerprint');
  const [selectedKeyExampleId, setSelectedKeyExampleId] = useState<string>(FINGERPRINT_KEY_EXAMPLES[0].id);
  const [layerFilter, setLayerFilter] = useState<'All' | 'Layer 1: Identity' | 'Layer 2: SKU Variant' | 'Layer 3: Physical Instance'>('All');
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | 'Easy' | 'Hard' | 'Impossible'>('All');
  const [langTierFilter, setLangTierFilter] = useState<string>('All');
  const [copiedSql, setCopiedSql] = useState(false);

  const selectedKeyExample =
    FINGERPRINT_KEY_EXAMPLES.find((ex) => ex.id === selectedKeyExampleId) || FINGERPRINT_KEY_EXAMPLES[0];

  const filteredFingerprints = FOURTEEN_POINT_FINGERPRINTS.filter((fp) => {
    const matchesLayer = layerFilter === 'All' || fp.layer === layerFilter;
    const matchesDiff = difficultyFilter === 'All' || fp.scanDifficulty === difficultyFilter;
    return matchesLayer && matchesDiff;
  });

  const filteredLanguages = OFFICIAL_LANGUAGES.filter((l) => {
    if (langTierFilter === 'All') return true;
    return l.saasTier.startsWith(langTierFilter);
  });

  const handleCopySql = () => {
    navigator.clipboard.writeText(PRODUCTION_SUPABASE_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const getLayerBadge = (layer: string) => {
    if (layer.startsWith('Layer 1')) {
      return isLight
        ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
        : 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30';
    }
    if (layer.startsWith('Layer 2')) {
      return isLight
        ? 'bg-amber-50 text-amber-700 border-amber-200'
        : 'bg-amber-500/15 text-amber-300 border-amber-500/30';
    }
    return isLight
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
  };

  const getDifficultyBadge = (diff: 'Easy' | 'Hard' | 'Impossible') => {
    switch (diff) {
      case 'Easy':
        return isLight
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
          : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'Hard':
        return isLight
          ? 'bg-amber-50 text-amber-700 border-amber-200'
          : 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'Impossible':
        return isLight
          ? 'bg-rose-50 text-rose-700 border-rose-200'
          : 'bg-rose-500/15 text-rose-400 border-rose-500/30';
    }
  };

  const getBulkBadge = (status: string) => {
    switch (status) {
      case 'Massive Bulk':
        return 'bg-sky-500/15 text-sky-400 border-sky-500/30';
      case 'Semi-Bulk':
        return 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30';
      case 'Hidden in Bulk by Accident':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      default:
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8 animate-slide-in select-text">
      {/* =================================================================== */}
      {/* HERO HEADER BANNER                                                  */}
      {/* =================================================================== */}
      <div
        className={`p-6 sm:p-8 rounded-2xl border transition-all ${
          isLight
            ? 'bg-gradient-to-br from-white via-indigo-50/30 to-slate-50 border-slate-200 shadow-xs'
            : 'bg-gradient-to-br from-[#1b1b26] via-[#15151e] to-[#111117] border-[#2a2a38] shadow-xl'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 uppercase tracking-wider font-mono">
                Master Engineering Blueprint
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 uppercase tracking-wider font-mono">
                14-Point Card Fingerprint
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider font-mono">
                Supabase + pgvector
              </span>
            </div>

            <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Pokémon Card Database &amp; Scanner Master Architecture
            </h1>

            <p className={`text-xs sm:text-sm max-w-3xl leading-relaxed ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
              Why a flat <code className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-mono">cards</code> table bankrupts a card shop:
              a single card number can have <strong>5 to 15 distinct printings</strong> ranging from <strong>$0.25 to $10,000+</strong>.
              Explore the complete <strong>14-Point Card Fingerprint</strong>, historical eras, foil bulk rules, optical scanner pipeline, and dual-schema Supabase architecture.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="#/cards/anatomy"
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition active:scale-95"
            >
              <Scan className="w-4 h-4" />
              <span>Interactive ROI Canvas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Quick Architecture KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-slate-200/70 dark:border-zinc-800/80">
          <div className={`p-3.5 rounded-xl border ${isLight ? 'bg-white border-slate-200/80' : 'bg-zinc-900/60 border-zinc-800/90'}`}>
            <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-bold block">
              3-Layer Taxonomy
            </span>
            <span className={`text-lg font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>
              14 Fingerprints
            </span>
            <span className="text-[11px] text-slate-400 block">
              6 Identity • 6 SKU • 2 Instance
            </span>
          </div>

          <div className={`p-3.5 rounded-xl border ${isLight ? 'bg-white border-slate-200/80' : 'bg-zinc-900/60 border-zinc-800/90'}`}>
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block">
              EN + JP Global Catalog
            </span>
            <span className={`text-lg font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>
              ~45k Cards → 160k SKUs
            </span>
            <span className="text-[11px] text-slate-400 block">
              Covers 96%+ of Store Revenue
            </span>
          </div>

          <div className={`p-3.5 rounded-xl border ${isLight ? 'bg-white border-slate-200/80' : 'bg-zinc-900/60 border-zinc-800/90'}`}>
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">
              Scanner Competitor Gap
            </span>
            <span className={`text-lg font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>
              7 Untouched Layers
            </span>
            <span className="text-[11px] text-slate-400 block">
              Dims #7–#13 Blind on Current Apps
            </span>
          </div>

          <div className={`p-3.5 rounded-xl border ${isLight ? 'bg-white border-slate-200/80' : 'bg-zinc-900/60 border-zinc-800/90'}`}>
            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold block">
              Supabase Free Tier Fit
            </span>
            <span className={`text-lg font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>
              ~284 MB / 500 MB
            </span>
            <span className="text-[11px] text-slate-400 block">
              Using halfvec(512) + External CDN
            </span>
          </div>
        </div>

        {/* 5 Primary Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-6 mt-6 border-t border-slate-200/70 dark:border-zinc-800/80">
          {[
            { id: 'fingerprint', label: '1. The 14-Point Fingerprint', icon: Key },
            { id: 'eras-languages', label: '2. Eras, Print Runs & 15 Languages', icon: Globe },
            { id: 'variants-stamps', label: '3. Foils, Stamps, Numbers & Bulk', icon: Sparkles },
            { id: 'scanner-cv', label: '4. Scanner CV vs. Competitors', icon: Eye },
            { id: 'database-etl', label: '5. Supabase Schema & 5-Stage ETL', icon: Database }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as MasterTab)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                  active
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : isLight
                    ? 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                    : 'bg-zinc-900/70 hover:bg-zinc-800 text-zinc-300 border border-zinc-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =================================================================== */}
      {/* TAB 1: THE 14-POINT CARD FINGERPRINT & 3-LAYER TAXONOMY             */}
      {/* =================================================================== */}
      {activeTab === 'fingerprint' && (
        <div className="space-y-8">
          {/* 1A. Visual 3-Layer Architecture Flow */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Layer 1 */}
            <div
              className={`p-5 rounded-2xl border space-y-3 ${
                isLight ? 'bg-white border-indigo-200 shadow-xs' : 'bg-[#171824] border-indigo-500/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                  Layer 1 • Dimensions #1–#6
                </span>
                <span className="text-xs font-mono text-slate-400">~45,000 Rows</span>
              </div>
              <h3 className={`text-base font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Card Identity (&ldquo;What Card Is This?&rdquo;)
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Stored in <code className="text-indigo-400 font-mono">catalog.expansions</code> &amp;{' '}
                <code className="text-indigo-400 font-mono">catalog.card_identities</code>. Shares the same illustration,
                attacks, artist, and 512-d artwork vector embedding.
              </p>
              <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px] font-medium">
                {[
                  '1. Language & Region',
                  '2. Era / Series Block',
                  '3. Set & Sub-Set (TG/GG)',
                  '4. Artwork / Version',
                  '5. Collector # & Suffix',
                  '6. Rarity Tier'
                ].map((item) => (
                  <div
                    key={item}
                    className={`px-2.5 py-1.5 rounded-lg border ${
                      isLight ? 'bg-indigo-50/50 border-indigo-100 text-slate-700' : 'bg-zinc-900/70 border-zinc-800 text-zinc-300'
                    }`}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Layer 2 */}
            <div
              className={`p-5 rounded-2xl border space-y-3 ${
                isLight ? 'bg-white border-amber-200 shadow-xs' : 'bg-[#1f1b16] border-amber-500/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  Layer 2 • Dimensions #7–#12
                </span>
                <span className="text-xs font-mono text-slate-400">~160,000 Rows</span>
              </div>
              <h3 className={`text-base font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Catalog SKU (&ldquo;Which Printing Is This?&rdquo;)
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Stored in <code className="text-amber-400 font-mono">catalog.card_sku_variants</code>. Even with the exact
                same Layer 1 identity, these 6 print attributes turn a $0.50 card into a $500+ chase SKU.
              </p>
              <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px] font-medium">
                {[
                  '7. Edition Print Run',
                  '8. Foil & Surface Finish',
                  '9. Promo & Event Stamps',
                  '10. Deck / Border / Back',
                  '11. EX-Era Serial Code',
                  '12. Copyright & Reg Mark'
                ].map((item) => (
                  <div
                    key={item}
                    className={`px-2.5 py-1.5 rounded-lg border ${
                      isLight ? 'bg-amber-50/50 border-amber-100 text-slate-700' : 'bg-zinc-900/70 border-zinc-800 text-zinc-300'
                    }`}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Layer 3 */}
            <div
              className={`p-5 rounded-2xl border space-y-3 ${
                isLight ? 'bg-white border-emerald-200 shadow-xs' : 'bg-[#141f1c] border-emerald-500/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Layer 3 • Dimensions #13–#14
                </span>
                <span className="text-xs font-mono text-slate-400">Per Shop Instance</span>
              </div>
              <h3 className={`text-base font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Physical Instance (&ldquo;This Card in Hand&rdquo;)
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Stored in <code className="text-emerald-400 font-mono">public.inventory_items</code> (isolated per store
                via RLS). Tracks factory misprints, raw condition (NM→DMG), or graded slabs (PSA/BGS/CGC Cert #).
              </p>
              <div className="grid grid-cols-1 gap-1.5 pt-1 text-[11px] font-medium">
                {[
                  '13. Factory Error / Misprint (Red Cheeks, No Symbol, Miscut)',
                  '14. Physical Condition (NM–DMG) OR Graded Slab + Cert Barcode'
                ].map((item) => (
                  <div
                    key={item}
                    className={`px-2.5 py-1.5 rounded-lg border ${
                      isLight ? 'bg-emerald-50/50 border-emerald-100 text-slate-700' : 'bg-zinc-900/70 border-zinc-800 text-zinc-300'
                    }`}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 1B. Interactive Deterministic 13-Point SKU Fingerprint Key Inspector */}
          <div
            className={`p-6 rounded-2xl border space-y-5 ${
              isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-[#181820] border-[#292935]'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-amber-400" />
                  <h2 className={`text-base font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    Deterministic SKU Fingerprint Key Builder (Collision-Proof Database Key)
                  </h2>
                </div>
                <p className="text-xs text-slate-400 pt-0.5">
                  Click any real-world card below to inspect how the 9-segment <code className="text-indigo-400 font-mono">fingerprint_key</code> separates a $3 card from a $6,500 card.
                </p>
              </div>
              <span className="px-3 py-1 rounded-lg font-mono text-[11px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {'{LANG}:{SET}:{NUM}:{EDITION}:{FOIL}:{STAMP}:{DECK}:{SERIAL}:{ERROR}'}
              </span>
            </div>

            {/* Example Selector Pills */}
            <div className="flex flex-wrap gap-2">
              {FINGERPRINT_KEY_EXAMPLES.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => setSelectedKeyExampleId(ex.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition text-left ${
                    selectedKeyExampleId === ex.id
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : isLight
                      ? 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 border-zinc-800'
                  }`}
                >
                  {ex.title}
                </button>
              ))}
            </div>

            {/* Active Fingerprint Breakdown Box */}
            <div
              className={`p-5 rounded-xl border space-y-4 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-zinc-950/90 border-zinc-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-zinc-800">
                <div>
                  <h4 className={`text-sm font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {selectedKeyExample.title}
                  </h4>
                  <p className="text-xs text-slate-400">{selectedKeyExample.subtitle}</p>
                </div>
                <span className="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  💰 {selectedKeyExample.priceComparison}
                </span>
              </div>

              {/* Full String Display */}
              <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 font-mono text-xs sm:text-sm text-amber-300 overflow-x-auto">
                <span className="text-zinc-500 select-none mr-2">fingerprint_key =</span>
                <span className="font-bold tracking-wide">{selectedKeyExample.fingerprintKey}</span>
              </div>

              {/* 9 Segment Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2">
                {selectedKeyExample.segments.map((seg, i) => (
                  <div
                    key={i}
                    className={`p-2.5 rounded-xl border flex flex-col justify-between ${
                      seg.isCriticalDifferentiator
                        ? 'bg-amber-500/15 border-amber-500/50 ring-1 ring-amber-500/30'
                        : isLight
                        ? 'bg-white border-slate-200'
                        : 'bg-zinc-900/70 border-zinc-800'
                    }`}
                  >
                    <div>
                      <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 block">
                        {seg.dimension}
                      </span>
                      <span
                        className={`font-mono text-xs font-black block mt-0.5 break-all ${
                          seg.isCriticalDifferentiator
                            ? 'text-amber-400'
                            : isLight
                            ? 'text-indigo-600'
                            : 'text-indigo-300'
                        }`}
                      >
                        {seg.code}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-snug mt-2">{seg.meaning}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 1C. Summary Checklist: The 14-Point Card Fingerprint Table */}
          <div
            className={`p-6 rounded-2xl border space-y-5 ${
              isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-[#181820] border-[#292935]'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h2 className={`text-lg font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Summary Checklist: The 14-Point Card Fingerprint
                </h2>
                <p className="text-xs text-slate-400">
                  Filter by Database Layer or Camera Scanner Difficulty to inspect every dimension.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                {(['All', 'Layer 1: Identity', 'Layer 2: SKU Variant', 'Layer 3: Physical Instance'] as const).map(
                  (lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setLayerFilter(lvl)}
                      className={`px-2.5 py-1 rounded-lg border font-semibold transition ${
                        layerFilter === lvl
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : isLight
                          ? 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {lvl === 'All' ? 'All Layers (14)' : lvl}
                    </button>
                  )
                )}

                <span className="text-slate-600 mx-1">|</span>

                {(['All', 'Easy', 'Hard', 'Impossible'] as const).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setDifficultyFilter(diff)}
                    className={`px-2.5 py-1 rounded-lg border font-semibold transition ${
                      difficultyFilter === diff
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : isLight
                        ? 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {diff === 'All' ? 'All Scan Levels' : diff}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-zinc-800">
              <table className="w-full text-left text-xs">
                <thead className={isLight ? 'bg-slate-100 text-slate-700' : 'bg-zinc-900/90 text-zinc-300'}>
                  <tr className="border-b border-slate-200 dark:border-zinc-800">
                    <th className="py-3 px-3.5 font-bold w-10">#</th>
                    <th className="py-3 px-3.5 font-bold">Dimension &amp; SQL Column</th>
                    <th className="py-3 px-3.5 font-bold">Database Layer</th>
                    <th className="py-3 px-3.5 font-bold">Example Disambiguation &amp; Financial Gap</th>
                    <th className="py-3 px-3.5 font-bold">Camera Scannability</th>
                    <th className="py-3 px-3.5 font-bold">Competitor App Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/70 dark:divide-zinc-800/80">
                  {filteredFingerprints.map((fp) => (
                    <tr
                      key={fp.number}
                      className="hover:bg-indigo-500/5 transition align-top"
                    >
                      <td className="py-3.5 px-3.5 font-mono font-black text-sm text-indigo-400">
                        {fp.number}
                      </td>
                      <td className="py-3.5 px-3.5">
                        <div className={`font-bold text-xs ${isLight ? 'text-slate-900' : 'text-white'}`}>
                          {fp.name}
                        </div>
                        <code className="text-[10px] font-mono text-slate-400 block mt-0.5">
                          {fp.sqlColumn}
                        </code>
                      </td>
                      <td className="py-3.5 px-3.5">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border whitespace-nowrap ${getLayerBadge(
                            fp.layer
                          )}`}
                        >
                          {fp.layer}
                        </span>
                      </td>
                      <td className="py-3.5 px-3.5 space-y-1 max-w-md">
                        <div className={isLight ? 'text-slate-700 font-medium' : 'text-zinc-200 font-medium'}>
                          {fp.exampleDisambiguation}
                        </div>
                        <div className="text-[11px] font-mono text-amber-400">
                          ⚡ {fp.priceGapExample}
                        </div>
                      </td>
                      <td className="py-3.5 px-3.5 space-y-1 max-w-xs">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${getDifficultyBadge(
                              fp.scanDifficulty
                            )}`}
                          >
                            {fp.scanDifficulty === 'Easy'
                              ? '🟢 Easy'
                              : fp.scanDifficulty === 'Hard'
                              ? '🟡 Hard'
                              : '🔴 1-Frame Impossible'}
                          </span>
                          <span className="font-mono text-[10px] text-slate-400">
                            {fp.autoScanAccuracy}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          {fp.scanExplanation}
                        </p>
                      </td>
                      <td className="py-3.5 px-3.5">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase mb-1 ${
                            fp.marketGapStatus === 'Solved'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : fp.marketGapStatus === 'Partial'
                              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                              : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {fp.marketGapStatus === 'Untouched' ? '🔴 Untouched Gap' : fp.marketGapStatus}
                        </span>
                        <div className="text-[11px] text-slate-400">
                          {fp.collectorAppsStatus}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 2: HISTORICAL ERAS, PRINT RUNS & 15 OFFICIAL LANGUAGES          */}
      {/* =================================================================== */}
      {activeTab === 'eras-languages' && (
        <div className="space-y-8">
          {/* 2A. The 7 Historical Eras & Layout Shifts */}
          <div className="space-y-4">
            <div>
              <h2 className={`text-lg font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                1. The 7 Historical Eras &amp; Template Shifts (1996–Present)
              </h2>
              <p className="text-xs text-slate-400">
                 English and Japanese eras had slightly different names from 1996–2010 (e.g. Japan&apos;s exclusive VS/Web era and ADV/PCG split), and became 100% identical from Black &amp; White (2011) onward.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {HISTORICAL_ERAS.map((era) => (
                <div
                  key={era.id}
                  className={`p-5 rounded-2xl border space-y-3 ${
                    isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-[#181820] border-[#292935]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase text-indigo-400">
                        Era Block 0{era.eraNumber} • {era.years}
                      </span>
                      <h3 className={`text-base font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {era.nameEn}
                      </h3>
                      <span className="text-[11px] text-slate-400 block">
                        🇯🇵 JP Equivalent: <strong>{era.nameJp}</strong>
                      </span>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold border shrink-0 ${
                        era.borderColor === 'Silver'
                          ? 'bg-slate-400/15 text-slate-300 border-slate-400/30'
                          : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {era.borderColor} Border
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs font-mono text-indigo-300">
                    📍 {era.setAndNumberPosition}
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {era.keyMechanics.map((m) => (
                      <span
                        key={m}
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                          isLight ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-zinc-900 border-zinc-800 text-zinc-300'
                        }`}
                      >
                        {m}
                      </span>
                    ))}
                  </div>

                  <div className="space-y-1.5 pt-1 text-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                      Scanner &amp; Database Quirks:
                    </span>
                    {era.criticalScannerQuirks.map((q, i) => (
                      <div key={i} className="flex items-start gap-2 text-[11px] text-slate-400 leading-relaxed">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{q}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2B. The 5 Print-Run Rules & The 10 English WotC 1st Edition Sets */}
          <div
            className={`p-6 rounded-2xl border space-y-6 ${
              isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-[#181820] border-[#292935]'
            }`}
          >
            <div>
              <h2 className={`text-lg font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                2. Edition &amp; Print-Run Rules (Did It Happen Only in Base Set?)
              </h2>
              <p className="text-xs text-slate-400">
                <strong>Shadowless</strong> happened ONLY in 1999 English Base Set. <strong>©1999-2000 4th Print</strong> happened in Base Set &amp; Fossil.
                <strong> 1st Edition</strong> happened in 10 English WotC sets (1999–2002)—and then Japan started printing <strong>1ED</strong> from 2001 to 2016!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {PRINT_RUN_RULES.map((rule) => (
                <div
                  key={rule.enumCode}
                  className={`p-4 rounded-xl border space-y-2.5 flex flex-col justify-between ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-zinc-900/70 border-zinc-800'
                  }`}
                >
                  <div className="space-y-2">
                    <code className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 font-mono text-[10px] font-bold block w-fit">
                      {rule.enumCode}
                    </code>
                    <h4 className={`text-xs font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {rule.title}
                    </h4>
                    <div className="text-[11px] space-y-1 text-slate-400">
                      <div>
                        <strong className="text-indigo-400">🇺🇸 EN:</strong> {rule.validSetsEn}
                      </div>
                      <div>
                        <strong className="text-rose-400">🇯🇵 JP:</strong> {rule.validSetsJp}
                      </div>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-200 dark:border-zinc-800 text-[10px] text-emerald-400 font-mono">
                    {rule.priceImpact}
                  </div>
                </div>
              ))}
            </div>

            {/* Table of the 10 WotC 1st Edition Sets */}
            <div className="space-y-2">
              <h3 className={`text-sm font-bold ${isLight ? 'text-slate-800' : 'text-zinc-200'}`}>
                Complete English WotC Print-Run Matrix (1999–2002)
              </h3>
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-zinc-800">
                <table className="w-full text-left text-xs">
                  <thead className={isLight ? 'bg-slate-100 text-slate-700' : 'bg-zinc-900 text-zinc-300'}>
                    <tr className="border-b border-slate-200 dark:border-zinc-800">
                      <th className="py-2.5 px-3 font-bold">#</th>
                      <th className="py-2.5 px-3 font-bold">Expansion Set</th>
                      <th className="py-2.5 px-3 font-bold">Year</th>
                      <th className="py-2.5 px-3 font-bold">1st Edition</th>
                      <th className="py-2.5 px-3 font-bold">Shadowless</th>
                      <th className="py-2.5 px-3 font-bold">Unlimited</th>
                      <th className="py-2.5 px-3 font-bold">©1999–2000 4th Print</th>
                      <th className="py-2.5 px-3 font-bold">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/60 dark:divide-zinc-800">
                    {WOTC_1ST_EDITION_SETS.map((s, idx) => (
                      <tr key={idx} className={s.num === 0 ? 'opacity-65 bg-rose-500/5' : ''}>
                        <td className="py-2 px-3 font-mono font-bold text-indigo-400">
                          {s.num > 0 ? s.num : '—'}
                        </td>
                        <td className={`py-2 px-3 font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                          {s.setName}
                        </td>
                        <td className="py-2 px-3 font-mono text-slate-400">{s.releaseYear}</td>
                        <td className="py-2 px-3">
                          {s.has1stEdition ? (
                            <span className="text-emerald-400 font-bold">✅ Yes</span>
                          ) : (
                            <span className="text-rose-400 font-bold">❌ No</span>
                          )}
                        </td>
                        <td className="py-2 px-3">
                          {s.hasShadowless ? (
                            <span className="text-amber-400 font-bold">✅ Base Set Only</span>
                          ) : (
                            <span className="text-slate-500">—</span>
                          )}
                        </td>
                        <td className="py-2 px-3 text-emerald-400 font-bold">✅ Yes</td>
                        <td className="py-2 px-3 font-mono text-[11px] text-amber-300">
                          {s.has4thPrint1999_2000}
                        </td>
                        <td className="py-2 px-3 text-[11px] text-slate-400">{s.specialNotes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* 2C. All 15 Official Languages & 3-Tier SaaS Rollout Strategy */}
          <div
            className={`p-6 rounded-2xl border space-y-5 ${
              isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-[#181820] border-[#292935]'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h2 className={`text-lg font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  3. All 15 Official Languages &amp; What to Put in Your SaaS
                </h2>
                <p className="text-xs text-slate-400">
                  12 Active Languages + 3 Discontinued Historical Languages. <strong>English (72%) + Japanese (24%) = 96% of store volume.</strong>
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 text-xs">
                {['All', 'Tier 1', 'Tier 2', 'Tier 3', 'Skip'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setLangTierFilter(t)}
                    className={`px-3 py-1 rounded-lg border font-semibold transition ${
                      langTierFilter === t
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : isLight
                        ? 'bg-slate-50 border-slate-200 text-slate-600'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                    }`}
                  >
                    {t === 'All' ? 'All 15 Languages' : t}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-zinc-800">
              <table className="w-full text-left text-xs">
                <thead className={isLight ? 'bg-slate-100 text-slate-700' : 'bg-zinc-900 text-zinc-300'}>
                  <tr className="border-b border-slate-200 dark:border-zinc-800">
                    <th className="py-2.5 px-3 font-bold">#</th>
                    <th className="py-2.5 px-3 font-bold">Language</th>
                    <th className="py-2.5 px-3 font-bold">Code</th>
                    <th className="py-2.5 px-3 font-bold">SaaS Priority Tier</th>
                    <th className="py-2.5 px-3 font-bold">Share</th>
                    <th className="py-2.5 px-3 font-bold">Active Years</th>
                    <th className="py-2.5 px-3 font-bold">Card Back</th>
                    <th className="py-2.5 px-3 font-bold">Database &amp; Scanner Rules</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60 dark:divide-zinc-800">
                  {filteredLanguages.map((lang) => (
                    <tr key={lang.num} className="hover:bg-indigo-500/5">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-400">{lang.num}</td>
                      <td className={`py-2.5 px-3 font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {lang.language}
                      </td>
                      <td className="py-2.5 px-3">
                        <code className="px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-400 font-mono font-bold">
                          {lang.dbCode}
                        </code>
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            lang.saasTier.startsWith('Tier 1')
                              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                              : lang.saasTier.startsWith('Tier 2')
                              ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                              : lang.saasTier.startsWith('Tier 3')
                              ? 'bg-sky-500/15 text-sky-400 border-sky-500/30'
                              : 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30'
                          }`}
                        >
                          {lang.saasTier}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">{lang.marketShare}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-400">{lang.activeYears}</td>
                      <td className="py-2.5 px-3 text-slate-300">{lang.cardBack}</td>
                      <td className="py-2.5 px-3 text-[11px] text-slate-400 max-w-md">{lang.scannerAndDbNotes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 3: FOILS, STAMPS, COLLECTOR NUMBERS & BULK SIFTER MATRIX        */}
      {/* =================================================================== */}
      {activeTab === 'variants-stamps' && (
        <div className="space-y-8">
          {/* 3A. Foil Bulk & "Threshold Sifter Mode" Highlight */}
          <div className="p-6 rounded-2xl border bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-emerald-500/10 border-amber-500/30 space-y-3">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400" />
              <h2 className={`text-base sm:text-lg font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Do Foil Cards Come in Bulk? YES (30% of Modern Bulk is Foil!) — &ldquo;Threshold Sifter Mode&rdquo;
              </h2>
            </div>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>
              Every Scarlet &amp; Violet pack guarantees <strong>2 Reverse Holos + 1 Holo Rare</strong> (~95 cheap foils per box bought at <strong>$0.04 bulk</strong>).
              However, sitting inside a customer&apos;s 2,000-card $80 foil bulk box are usually <strong>40–80 hidden hits worth $2 to $100+</strong>
              (playable Trainer Reverse Holos, 151 Metapod, Master Ball Foils mixed with Poké Balls, and Blister Cosmo Holos).
              In Aeethod OS&apos;s <strong>Threshold Sifter Mode ($1.50 floor)</strong>, the scanner flashes ⚪ <strong>PASS</strong> on $0.10 bulk and plays a 🟢 <strong>DING! PULL CARD</strong> chime when a $4+ foil passes under the lens!
            </p>
          </div>

          {/* Foil & Surface Finish Cards */}
          <div className="space-y-4">
            <h3 className={`text-lg font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>
              1. Foil &amp; Surface Finishes Matrix (Bulk vs. Singles)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {FOIL_BULK_SPECS.map((foil) => (
                <div
                  key={foil.id}
                  className={`p-5 rounded-2xl border space-y-3 ${
                    isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-[#181820] border-[#292935]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <code className="text-[10px] font-mono text-indigo-400 font-bold">{foil.dbEnum}</code>
                      <h4 className={`text-sm font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {foil.name}
                      </h4>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${getBulkBadge(foil.comesInBulk)}`}>
                      {foil.comesInBulk}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-900/70 border border-slate-200/70 dark:border-zinc-800 text-[11px]">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Shop Bulk Buy Rate:</span>
                      <strong className={isLight ? 'text-slate-800' : 'text-zinc-200'}>{foil.bulkBuyRate}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Real Retail Range:</span>
                      <strong className="text-emerald-400 font-mono">{foil.retailRange}</strong>
                    </div>
                  </div>

                  <div className="text-xs space-y-1.5">
                    <p className="text-slate-400 leading-relaxed">
                      <strong className="text-slate-300">Surface Physics:</strong> {foil.visualPhysics}
                    </p>
                    <p className="text-indigo-300/90 leading-relaxed text-[11px]">
                      <strong className="text-indigo-400">Scanner Strategy:</strong> {foil.scannerStrategy}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3B. High-Value Promotional & Edition Stamp Zones */}
          <div
            className={`p-6 rounded-2xl border space-y-5 ${
              isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-[#181820] border-[#292935]'
            }`}
          >
            <div>
              <h3 className={`text-lg font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                2. High-Value Stamp Zones &amp; Reprint Guardrails (Dimension #9 &amp; #10)
              </h3>
              <p className="text-xs text-slate-400">
                A 4mm × 8mm stamp can multiply a card&apos;s price by 15x—or prove that a &ldquo;$1,400&rdquo; card is actually a $25 Celebrations / World Championship reprint!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {STAMP_ZONE_SPECS.map((st) => (
                <div
                  key={st.id}
                  className={`p-4 rounded-xl border space-y-2.5 flex flex-col justify-between ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-zinc-900/70 border-zinc-800'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <code className="px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-400 font-mono text-[10px] font-bold">
                        {st.dbEnum}
                      </code>
                      <span className="text-[11px] font-mono font-bold text-amber-400">{st.priceMultiplier}</span>
                    </div>
                    <h4 className={`text-sm font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {st.name}
                    </h4>
                    <div className="text-[11px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded border border-cyan-500/20">
                      📍 {st.cardLocation} ({st.coordinatesLabel})
                    </div>
                    <p className="text-xs text-emerald-400 font-medium">{st.realWorldExample}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-200 dark:border-zinc-800 text-[11px] text-rose-400 leading-snug">
                    ⚠️ {st.scannerTrapWarning}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3C. Collector Number Edge Cases & Modern Rarity Symbols */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Collector Numbers */}
            <div
              className={`p-6 rounded-2xl border space-y-4 ${
                isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-[#181820] border-[#292935]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-indigo-400" />
                <h3 className={`text-base font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  3. Collector Number Edge Cases (Why INT Columns Fail)
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                Always store 3 columns: <code className="text-indigo-400">number_raw</code> (exact string),{' '}
                <code className="text-indigo-400">number_clean</code> (stripped for 2-keystroke POS search), and{' '}
                <code className="text-indigo-400">number_sort</code> (integer weight).
              </p>
              <div className="space-y-2.5">
                {COLLECTOR_NUMBER_EDGE_CASES.map((ec) => (
                  <div
                    key={ec.category}
                    className={`p-3 rounded-xl border text-xs space-y-1 ${
                      isLight ? 'bg-slate-50 border-slate-200' : 'bg-zinc-900/70 border-zinc-800'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{ec.category}</span>
                      <div className="flex gap-1">
                        {ec.examples.map((ex) => (
                          <code
                            key={ex}
                            className="px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-300 font-mono text-[10px]"
                          >
                            {ex}
                          </code>
                        ))}
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400">{ec.explanation}</p>
                    <code className="text-[10px] font-mono text-emerald-400 block">{ec.sqlNormalization}</code>
                  </div>
                ))}
              </div>
            </div>

            {/* Rarity Symbols */}
            <div
              className={`p-6 rounded-2xl border space-y-4 ${
                isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-[#181820] border-[#292935]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <h3 className={`text-base font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  4. Modern Scarlet &amp; Violet Rarity Tier Decoder (EN vs. JP)
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                Determines pull rate, expected surface texture (smooth vs. micro-etched), and baseline price tier.
              </p>
              <div className="space-y-2.5">
                {RARITY_SYMBOLS.map((r) => (
                  <div
                    key={r.code}
                    className={`p-3 rounded-xl border text-xs flex items-start justify-between gap-3 ${
                      isLight ? 'bg-slate-50 border-slate-200' : 'bg-zinc-900/70 border-zinc-800'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 font-mono font-bold text-[10px]">
                          EN: {r.code}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-rose-500/15 text-rose-400 font-mono font-bold text-[10px]">
                          JP: {r.jpEquivalent}
                        </span>
                        <strong className={isLight ? 'text-slate-900' : 'text-white'}>{r.name}</strong>
                      </div>
                      <p className="text-[11px] text-slate-400 pt-0.5">{r.surfaceFinish}</p>
                    </div>
                    <span className="font-mono text-xs font-bold text-indigo-400 shrink-0">{r.symbol}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 4: SCANNER CV PIPELINE VS. COMPETITORS                          */}
      {/* =================================================================== */}
      {activeTab === 'scanner-cv' && (
        <div className="space-y-8">
          {/* 4A. How Competitors Work Under the Hood */}
          <div
            className={`p-6 rounded-2xl border space-y-5 ${
              isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-[#181820] border-[#292935]'
            }`}
          >
            <div>
              <h2 className={`text-lg font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                1. How Existing Card Scanners Work Under the Hood (And Why They Fail on Layer 2)
              </h2>
              <p className="text-xs text-slate-400">
                No production scanner sends live camera frames to OpenAI GPT-4o or Gemini Vision ($0.004/scan &amp; 3-second lag).
                Every app maintains its <strong>own pre-indexed database</strong> using one of 3 mechanisms:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`p-4 rounded-xl border space-y-2 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-zinc-900/70 border-zinc-800'}`}>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-500/15 text-sky-400">
                  Mechanism 1 • Dragon Shield / TCGplayer App
                </span>
                <h4 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  On-Device 16×16 Perceptual Hash (pHash)
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Downloads a ~20 MB file of 45,000 hashes to the phone. Shrinks the camera frame to a blurry <strong>16×16 grayscale grid</strong> and matches in 2ms offline.
                </p>
                <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-300">
                  <strong>Why It Fails:</strong> Shrinking a card to 16×16 completely destroys 1st Edition stamps, Pokémon Center stamps, collector numbers, and Master Ball textures!
                </div>
              </div>

              <div className={`p-4 rounded-xl border space-y-2 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-zinc-900/70 border-zinc-800'}`}>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/15 text-indigo-400">
                  Mechanism 2 • Collectr / PriceCharting / Rare Candy
                </span>
                <h4 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Whole-Card CNN Vector Embedding
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Converts the entire card image into 512 numbers (MobileNet/ResNet) and queries their own Vector + SQL database in ~15ms.
                </p>
                <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-300">
                  <strong>Why It Fails:</strong> 95% of a whole-card vector is dominated by the center artwork! A $10,000 1st Ed Charizard, $80 Celebrations Charizard, and $30 World Champ Charizard have 99.5% identical global vectors!
                </div>
              </div>

              <div className={`p-4 rounded-xl border space-y-2 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-zinc-900/70 border-zinc-800'}`}>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400">
                  Aeethod OS • 4-Stage Coordinate Pipeline
                </span>
                <h4 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Artwork Vector + Era-Specific Micro-Crops
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Uses <code className="text-emerald-400">halfvec(512)</code> + <code className="text-emerald-400">dHash</code> on the <strong>cropped artwork window</strong> to lock Layer 1 in &lt;8ms, then automatically crops that Era&apos;s exact Set, Stamp, and Border coordinates!
                </p>
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300">
                  <strong>Unfair Advantage:</strong> Catches 1st Ed, Shadowless, 25th Anniversary, Pokémon Center, and World Championship traps automatically at $0.00/scan!
                </div>
              </div>
            </div>
          </div>

          {/* 4B. The 4-Stage Aeethod OS Computer Vision Pipeline */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              {
                stage: 'Stage 1 (5ms)',
                title: 'YOLOv8-nano 4-Corner Homography Dewarp',
                desc: 'Detects the 4 physical card corners on the mat and warps tilted/angled cards into a flat 630×880px upright canvas.'
              },
              {
                stage: 'Stage 2 (8ms)',
                title: 'Artwork Window halfvec(512) + dHash Lookup',
                desc: 'Queries Supabase pgvector HNSW index on the artwork crop only. Locks Layer 1 Card Identity even on unnumbered 1996 JP cards.'
              },
              {
                stage: 'Stage 3 (15ms)',
                title: 'Coordinate Micro-Zone OCR Verification',
                desc: 'Uses the matched Era template to crop the exact Set Pill (MEW EN vs sv2a), Collector Number, and Copyright Year (©1999-2000).'
              },
              {
                stage: 'Stage 4 (20ms)',
                title: 'Stamp Guardrails + 1-Tap POS Variant Pills',
                desc: 'Checks the 5 Stamp Zones (1st Ed, Shadowless, PC, 25th Anniv, WC Sig) and surfaces 1-key [1: Normal] [2: Reverse] [3: Master Ball] pills.'
              }
            ].map((s, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl border space-y-2 ${
                  isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-[#181820] border-[#292935]'
                }`}
              >
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                  {s.stage}
                </span>
                <h4 className={`text-sm font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {s.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          {/* 4C. Full 14-Fingerprint Competitive Matrix */}
          <div
            className={`p-6 rounded-2xl border space-y-4 ${
              isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-[#181820] border-[#292935]'
            }`}
          >
            <h3 className={`text-base font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>
              2. Complete 14-Fingerprint Competitor Comparison Matrix
            </h3>
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-zinc-800">
              <table className="w-full text-left text-xs">
                <thead className={isLight ? 'bg-slate-100 text-slate-700' : 'bg-zinc-900 text-zinc-300'}>
                  <tr className="border-b border-slate-200 dark:border-zinc-800">
                    <th className="py-2.5 px-3 font-bold">#</th>
                    <th className="py-2.5 px-3 font-bold">Fingerprint Dimension</th>
                    <th className="py-2.5 px-3 font-bold">TCGplayer App</th>
                    <th className="py-2.5 px-3 font-bold">Collectr / PriceCharting / Dragon Shield</th>
                    <th className="py-2.5 px-3 font-bold">Hardware Sorters (Roca)</th>
                    <th className="py-2.5 px-3 font-bold">Market Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60 dark:divide-zinc-800">
                  {FOURTEEN_POINT_FINGERPRINTS.map((fp) => (
                    <tr key={fp.number} className="hover:bg-indigo-500/5">
                      <td className="py-2.5 px-3 font-mono font-bold text-indigo-400">{fp.number}</td>
                      <td className={`py-2.5 px-3 font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {fp.name}
                      </td>
                      <td className="py-2.5 px-3 text-slate-400">{fp.tcgplayerAppStatus}</td>
                      <td className="py-2.5 px-3 text-slate-400">{fp.collectorAppsStatus}</td>
                      <td className="py-2.5 px-3 text-slate-400">{fp.hardwareSorterStatus}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            fp.marketGapStatus === 'Solved'
                              ? 'bg-emerald-500/15 text-emerald-400'
                              : fp.marketGapStatus === 'Partial'
                              ? 'bg-amber-500/15 text-amber-400'
                              : 'bg-rose-500/15 text-rose-400'
                          }`}
                        >
                          {fp.marketGapStatus === 'Untouched' ? '🔴 100% Untouched' : fp.marketGapStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 4D. All 26 Competitors vs. The 3 Core Pillars (Scanning + Buylist + Sync/Auto-Pricing) */}
          <div
            className={`p-6 rounded-2xl border space-y-4 ${
              isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-[#181820] border-[#292935]'
            }`}
          >
            <div>
              <h3 className={`text-base font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                3. All 26 Industry Competitors vs. The 3 Core Pillars (Scanning • Buylist • Sync &amp; Auto-Pricing)
              </h3>
              <p className="text-xs text-slate-400">
                Complete audit of every competitor tracked in Aeethod OS across (1) Optical Card Scanning, (2) Counter &amp; Online Buylist, and (3) Multi-Channel Sync &amp; Auto-Pricing.
              </p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-zinc-800">
              <table className="w-full text-left text-xs">
                <thead className={isLight ? 'bg-slate-100 text-slate-700' : 'bg-zinc-900 text-zinc-300'}>
                  <tr className="border-b border-slate-200 dark:border-zinc-800">
                    <th className="py-2.5 px-3 font-bold">#</th>
                    <th className="py-2.5 px-3 font-bold">Competitor &amp; Pricing</th>
                    <th className="py-2.5 px-3 font-bold">1. Optical Card Scanning</th>
                    <th className="py-2.5 px-3 font-bold">2. Buylist Engine</th>
                    <th className="py-2.5 px-3 font-bold">3. Inventory Sync &amp; Auto-Pricing</th>
                    <th className="py-2.5 px-3 font-bold">Has All 3?</th>
                    <th className="py-2.5 px-3 font-bold">Fatal Flaw for Pokémon Shops</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60 dark:divide-zinc-800">
                  {ALL_26_COMPETITORS_MATRIX.map((comp) => (
                    <tr key={comp.num} className="hover:bg-indigo-500/5 align-top">
                      <td className="py-2.5 px-3 font-mono font-bold text-indigo-400">{comp.num}</td>
                      <td className="py-2.5 px-3">
                        <div className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{comp.name}</div>
                        <div className="text-[10px] font-mono text-amber-400">{comp.pricingSummary}</div>
                        <div className="text-[10px] text-slate-500">{comp.pillarCategory}</div>
                      </td>
                      <td className="py-2.5 px-3 text-slate-300 max-w-xs">{comp.opticalScanning}</td>
                      <td className="py-2.5 px-3 text-slate-300 max-w-xs">{comp.buylistEngine}</td>
                      <td className="py-2.5 px-3 text-slate-300 max-w-xs">{comp.syncAndAutoPricing}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase whitespace-nowrap ${
                            comp.hasAllThree.startsWith('Partial')
                              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                              : comp.hasAllThree.startsWith('Hardware')
                              ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                              : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {comp.hasAllThree}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-[11px] text-slate-400 max-w-sm leading-relaxed">
                        {comp.pokemonShopWeakness}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 5: SUPABASE ARCHITECTURE, SQL & 5-STAGE ETL                     */}
      {/* =================================================================== */}
      {activeTab === 'database-etl' && (
        <div className="space-y-8">
          {/* 5A. Single Supabase DB, Dual Schemas + Free Tier Math */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Dual Schema Card */}
            <div
              className={`p-6 rounded-2xl border space-y-4 ${
                isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-[#181820] border-[#292935]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-indigo-400" />
                <h3 className={`text-base font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  1. Single Supabase Database, Two PostgreSQL Schemas
                </h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Keep your Global Card Catalog and Multi-Tenant SaaS Data in the <strong>same Supabase project</strong> so Inventory tables, Buylist counters, and Auto-Pricing rules can <code className="text-indigo-400">JOIN</code> in <strong>&lt;5ms</strong> with strict Foreign Key integrity.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 space-y-1.5">
                  <span className="font-mono font-bold text-indigo-400 block">Schema 1: catalog.*</span>
                  <p className="text-[11px] text-slate-300">
                    Global Read-Only Reference Data (<code className="font-mono">expansions</code>, <code className="font-mono">card_identities</code>, <code className="font-mono">card_sku_variants</code>).
                  </p>
                  <span className="text-[10px] font-mono text-emerald-400 block">
                    • 1 shared copy for all 1,000 shops
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1.5">
                  <span className="font-mono font-bold text-emerald-400 block">Schema 2: public.*</span>
                  <p className="text-[11px] text-slate-300">
                    Multi-Tenant Shop Data (<code className="font-mono">shops</code>, <code className="font-mono">inventory_items</code>, <code className="font-mono">pos_orders</code>, <code className="font-mono">buylists</code>).
                  </p>
                  <span className="text-[10px] font-mono text-amber-400 block">
                    • Isolated via shop_id + Supabase RLS
                  </span>
                </div>
              </div>
            </div>

            {/* Supabase Free Tier 500MB Budget Card */}
            <div
              className={`p-6 rounded-2xl border space-y-4 ${
                isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-[#181820] border-[#292935]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-emerald-400" />
                  <h3 className={`text-base font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    2. Supabase $0 Free-Tier Storage Budget (284 MB / 500 MB)
                  </h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  56.8% Used
                </span>
              </div>

              {/* Visual Progress Bar */}
              <div className="w-full h-3 rounded-full bg-zinc-800 overflow-hidden flex">
                <div className="bg-indigo-500 h-full" style={{ width: '6%' }} title="Card Identities (~28 MB)" />
                <div className="bg-amber-500 h-full" style={{ width: '19%' }} title="160k SKUs + Rolling Prices (~95 MB)" />
                <div className="bg-emerald-500 h-full" style={{ width: '23%' }} title="halfvec(512) HNSW Index (~115 MB)" />
                <div className="bg-cyan-500 h-full" style={{ width: '9%' }} title="Store Inventory (~45 MB)" />
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800 flex justify-between">
                  <span className="text-indigo-400">● 45k Card Identities:</span>
                  <strong className="font-mono text-white">~28 MB</strong>
                </div>
                <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800 flex justify-between">
                  <span className="text-amber-400">● 160k SKUs + Prices:</span>
                  <strong className="font-mono text-white">~95 MB</strong>
                </div>
                <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800 flex justify-between">
                  <span className="text-emerald-400">● halfvec(512) + HNSW:</span>
                  <strong className="font-mono text-white">~115 MB</strong>
                </div>
                <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800 flex justify-between">
                  <span className="text-cyan-400">● First 10 Shops Stock:</span>
                  <strong className="font-mono text-white">~45 MB</strong>
                </div>
              </div>
            </div>
          </div>

          {/* 5B. The 5-Stage Automated Data Ingestion Pipeline (ETL) */}
          <div
            className={`p-6 rounded-2xl border space-y-5 ${
              isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-[#181820] border-[#292935]'
            }`}
          >
            <div>
              <h2 className={`text-lg font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                3. The 5-Stage Automated Ingestion Pipeline (How to Seed All 160,000 SKUs)
              </h2>
              <p className="text-xs text-slate-400">
                Never type cards manually. Run these 5 automated scripts in sequence to build the complete 14-point database:
              </p>
            </div>

            <div className="space-y-3">
              {ETL_PIPELINE_STAGES.map((st) => (
                <div
                  key={st.stage}
                  className={`p-4 rounded-xl border space-y-2 ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-zinc-900/70 border-zinc-800'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                        {st.stage}
                      </span>
                      <h4 className={`text-sm font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {st.title}
                      </h4>
                    </div>
                    <span className="px-2.5 py-0.5 rounded font-mono text-[10px] bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                      Target: {st.targetTables}
                    </span>
                  </div>

                  <div className="pl-8 space-y-1.5 text-xs">
                    <div className="text-slate-400">
                      <strong className="text-slate-300">Data Source:</strong> {st.sourceName}
                    </div>
                    <ul className="list-disc list-inside text-[11px] text-slate-400 space-y-0.5">
                      {st.whatItPopulates.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                    <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300">
                      💡 <strong>Engineering Trick:</strong> {st.engineeringTrick}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5C. Reference Website Coverage Matrix */}
          <div
            className={`p-6 rounded-2xl border space-y-4 ${
              isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-[#181820] border-[#292935]'
            }`}
          >
            <div>
              <h3 className={`text-base font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                4. Reference Websites: Where to Visually Inspect All 14 Fingerprints
              </h3>
              <p className="text-xs text-slate-400">
                On <strong>TCGCollector.com</strong>, click any card and scroll to the <strong>&ldquo;Card Variants&rdquo;</strong> section (or enable <em>Settings → Additional Card Variants</em>) to see Layer 2 Foils, Stamps, 1999–2000 4th Prints, and EX Serial Codes.
              </p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-zinc-800">
              <table className="w-full text-left text-xs">
                <thead className={isLight ? 'bg-slate-100 text-slate-700' : 'bg-zinc-900 text-zinc-300'}>
                  <tr className="border-b border-slate-200 dark:border-zinc-800">
                    <th className="py-2.5 px-3 font-bold">Fingerprint Dimension</th>
                    <th className="py-2.5 px-3 font-bold">TCGCollector.com</th>
                    <th className="py-2.5 px-3 font-bold">Bulbapedia (&ldquo;Additional Cards&rdquo;)</th>
                    <th className="py-2.5 px-3 font-bold">TCGplayer / TCGCSV.com</th>
                    <th className="py-2.5 px-3 font-bold">PSA Pop Report / PriceCharting</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60 dark:divide-zinc-800">
                  <tr>
                    <td className="py-2 px-3 font-bold">#1–#6 Layer 1 Identity</td>
                    <td className="py-2 px-3 text-emerald-400">✅ EN &amp; JP</td>
                    <td className="py-2 px-3 text-emerald-400">✅ All 15 Languages</td>
                    <td className="py-2 px-3 text-emerald-400">✅ EN &amp; JP</td>
                    <td className="py-2 px-3 text-emerald-400">✅ All Languages</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold">#7 Print Runs (incl. 1999–2000)</td>
                    <td className="py-2 px-3 text-emerald-400 font-bold">✅ All 5 Print Runs</td>
                    <td className="py-2 px-3 text-emerald-400">✅ All 5 Print Runs</td>
                    <td className="py-2 px-3 text-amber-400">⚠️ 1st Ed / Shadowless / Unl</td>
                    <td className="py-2 px-3 text-emerald-400 font-bold">✅ All 5 (incl. JP No Rarity)</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold">#8–#10 Foils, Stamps &amp; Deck Variants</td>
                    <td className="py-2 px-3 text-emerald-400 font-bold">✅ Attached to each card page</td>
                    <td className="py-2 px-3 text-emerald-400 font-bold">✅ Full release history tables</td>
                    <td className="py-2 px-3 text-amber-400">⚠️ Split into &ldquo;Deck Exclusives&rdquo; &amp; &ldquo;Misc&rdquo;</td>
                    <td className="py-2 px-3 text-emerald-400">✅ Yes</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold">#11 EX-Era 3x Common Serial Codes</td>
                    <td className="py-2 px-3 text-emerald-400 font-bold">✅ Tracks all 3 A/B/C codes</td>
                    <td className="py-2 px-3 text-emerald-400 font-bold">✅ Lists all 3 A/B/C codes</td>
                    <td className="py-2 px-3 text-rose-400">❌ Merged into 1 SKU</td>
                    <td className="py-2 px-3 text-amber-400">⚠️ Partial</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold">#13–#14 Factory Errors &amp; Graded Slabs</td>
                    <td className="py-2 px-3 text-amber-400">⚠️ Raw tracking only</td>
                    <td className="py-2 px-3 text-emerald-400">✅ &ldquo;Error cards (TCG)&rdquo; wiki</td>
                    <td className="py-2 px-3 text-emerald-400 font-bold">✅ Gold Standard for Raw (NM–DMG)</td>
                    <td className="py-2 px-3 text-emerald-400 font-bold">✅ Gold Standard for Slabs (PSA 1–10)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 5D. Copyable Production PostgreSQL + pgvector SQL Schema */}
          <div
            className={`p-6 rounded-2xl border space-y-4 ${
              isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-[#181820] border-[#292935]'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-base font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  5. Production Supabase PostgreSQL + halfvec(512) SQL Schema
                </h3>
                <p className="text-xs text-slate-400">
                  Ready to paste into the Supabase SQL Editor. Creates the <code className="text-indigo-400">catalog</code> and <code className="text-emerald-400">public</code> schemas with HNSW and Trigram indexes.
                </p>
              </div>
              <button
                onClick={handleCopySql}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 transition"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? 'Copied SQL!' : 'Copy SQL Schema'}</span>
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-zinc-950 text-zinc-200 border border-zinc-800 text-[11px] font-mono overflow-x-auto leading-relaxed max-h-[460px]">
              {PRODUCTION_SUPABASE_SQL}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
