import React, { useState } from 'react';
import {
  Scan,
  Layers,
  Sparkles,
  Maximize2,
  Eye,
  Camera,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Sliders,
  ZoomIn,
  Target,
  ArrowLeft,
  ChevronRight,
  Info,
  ShieldAlert,
  Zap,
  Grid,
  Cpu
} from 'lucide-react';
import { useStore } from '../store';
import { CARD_GAME_SPECS, BoundingBoxZone, CardGameSpec } from '../data/cardKnowledgeData';

export const CardAnatomyView: React.FC = () => {
  const { theme } = useStore();
  const isLight = theme === 'light';

  const [selectedGameId, setSelectedGameId] = useState<string>(CARD_GAME_SPECS[0].id);
  const [activeZoneId, setActiveZoneId] = useState<string | null>(null);
  const [showAllZones, setShowAllZones] = useState<boolean>(true);
  const [activeVariant, setActiveVariant] = useState<'regular' | 'holo' | 'reverse' | 'masterball' | 'first-edition'>('regular');
  const [inspectionMode, setInspectionMode] = useState<'anatomy' | 'centering' | 'corners' | 'edges'>('anatomy');

  const currentGame: CardGameSpec =
    CARD_GAME_SPECS.find((g) => g.id === selectedGameId) || CARD_GAME_SPECS[0];
  const activeZone: BoundingBoxZone | undefined =
    currentGame.zones.find((z) => z.id === activeZoneId) || currentGame.zones[0];

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 animate-slide-in select-text">
      {/* 1. Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <a
            href="#/knowledge/cards"
            className="p-2 rounded-xl border border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 hover:text-white transition"
            title="Back to Knowledge Hub"
          >
            <ArrowLeft className="w-4 h-4" />
          </a>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider font-mono">
                Interactive Canvas
              </span>
              <span className="text-xs text-slate-400">• Computer Vision Bounding Box Inspector</span>
            </div>
            <h1 className={`text-xl sm:text-2xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Card Anatomy & ROI Localizer
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {CARD_GAME_SPECS.map((game) => (
            <button
              key={game.id}
              onClick={() => {
                setSelectedGameId(game.id);
                setActiveZoneId(null);
              }}
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
      </div>

      {/* 2. Mode & Variant Control Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-3.5 rounded-2xl border bg-white dark:bg-zinc-900/80 border-slate-200 dark:border-zinc-800 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-400 font-semibold mr-1 flex items-center gap-1">
            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            <span>Inspection Mode:</span>
          </span>

          {(
            [
              { id: 'anatomy', label: '📐 Anatomy & ROIs' },
              { id: 'centering', label: '🎯 Centering Grid' },
              { id: 'corners', label: '🔍 4-Corner Zoom' },
              { id: 'edges', label: '⚡ Edge Whitening' }
            ] as const
          ).map((m) => (
            <button
              key={m.id}
              onClick={() => setInspectionMode(m.id)}
              className={`px-2.5 py-1.5 rounded-lg border font-medium transition ${
                inspectionMode === m.id
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'border-slate-200 dark:border-zinc-800 text-slate-400 hover:text-white'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Variant Finishes Simulator Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-400 font-semibold mr-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Finish Simulator:</span>
          </span>

          {(
            [
              { id: 'regular', label: 'Non-Foil' },
              { id: 'holo', label: 'Traditional Holo' },
              { id: 'reverse', label: 'Reverse Holo' },
              { id: 'masterball', label: 'Masterball Mirror' },
              { id: 'first-edition', label: '1st Edition' }
            ] as const
          ).map((v) => (
            <button
              key={v.id}
              onClick={() => setActiveVariant(v.id)}
              className={`px-2.5 py-1.5 rounded-lg border font-medium transition ${
                activeVariant === v.id
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-xs'
                  : 'border-slate-200 dark:border-zinc-800 text-slate-400 hover:text-white'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Visual Card Canvas (7 Cols) */}
        <div
          className={`lg:col-span-7 p-6 sm:p-8 rounded-2xl border flex flex-col items-center justify-center relative overflow-hidden ${
            isLight
              ? 'bg-gradient-to-b from-slate-100 to-slate-200/60 border-slate-300 shadow-inner'
              : 'bg-gradient-to-b from-[#14141a] to-[#0c0c10] border-[#22222c] shadow-2xl'
          }`}
        >
          {/* Card Dimensions Pill */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 font-mono text-[11px] text-slate-400 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
            <span>{currentGame.dimensionMm}</span>
            <span>•</span>
            <span className="text-cyan-400">{currentGame.aspectRatio} Aspect</span>
          </div>

          <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
            <button
              onClick={() => setShowAllZones(!showAllZones)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition ${
                showAllZones
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-black/60 text-slate-400 border-white/10 hover:text-white'
              }`}
            >
              {showAllZones ? 'Hide ROIs' : 'Show All ROIs'}
            </button>
          </div>

          {/* The Physical Card Stage Container */}
          <div
            className={`relative rounded-2xl overflow-hidden shadow-2xl border-4 transition-all duration-300 select-none ${
              activeVariant === 'masterball'
                ? 'ring-4 ring-purple-500/50 shadow-purple-950/40'
                : activeVariant === 'holo'
                ? 'ring-4 ring-amber-400/30'
                : 'border-slate-800/80'
            }`}
            style={{
              width: '320px',
              height: '448px', // Exact 1 : 1.4 Aspect Ratio
              background: '#18181b'
            }}
          >
            {/* Base Card Graphic Image */}
            <img
              src={currentGame.sampleFrontImage}
              alt={currentGame.name}
              className={`w-full h-full object-cover transition duration-300 pointer-events-none ${
                activeVariant === 'reverse'
                  ? 'contrast-125 brightness-110'
                  : activeVariant === 'holo'
                  ? 'contrast-110'
                  : ''
              }`}
            />

            {/* Finish Overlay Simulations */}
            {activeVariant === 'holo' && (
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-amber-300/15 to-transparent mix-blend-color-dodge animate-pulse" />
            )}

            {activeVariant === 'reverse' && (
              <div className="absolute inset-0 pointer-events-none border-[14px] border-cyan-400/20 mix-blend-overlay shadow-inner" />
            )}

            {activeVariant === 'masterball' && (
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-500/25 via-pink-500/15 to-transparent mix-blend-screen flex flex-col justify-between p-4">
                <div className="text-[10px] font-mono font-black text-purple-300 tracking-widest bg-purple-950/80 px-2 py-0.5 rounded border border-purple-400/40 w-fit">
                  ★ MASTERBALL MIRROR PATTERN
                </div>
                <div className="w-12 h-12 rounded-full border-2 border-purple-300/60 flex items-center justify-center font-bold text-lg text-purple-200 shadow-lg shadow-purple-500/50 self-end mb-12">
                  M
                </div>
              </div>
            )}

            {activeVariant === 'first-edition' && (
              <div className="absolute bottom-[44%] left-[6%] z-20 pointer-events-none">
                <div className="w-6 h-6 rounded-full bg-black/90 border border-amber-400 flex items-center justify-center text-[8px] font-black text-amber-400 shadow-md">
                  1st
                </div>
              </div>
            )}

            {/* Mode 1: Anatomy ROIs Overlays */}
            {inspectionMode === 'anatomy' && showAllZones && (
              <div className="absolute inset-0 pointer-events-auto">
                {currentGame.zones.map((zone) => {
                  const isSelected = activeZoneId === zone.id;

                  return (
                    <div
                      key={zone.id}
                      onClick={() => setActiveZoneId(zone.id)}
                      onMouseEnter={() => setActiveZoneId(zone.id)}
                      className={`absolute rounded-md cursor-pointer transition-all duration-150 border-2 flex items-center justify-center group ${
                        isSelected
                          ? 'border-white bg-white/20 shadow-lg shadow-black/80 z-20 ring-2 ring-white/50 scale-[1.02]'
                          : 'border-dashed opacity-85 hover:opacity-100 hover:border-solid hover:bg-white/10 z-10'
                      }`}
                      style={{
                        left: `${zone.xPercent}%`,
                        top: `${zone.yPercent}%`,
                        width: `${zone.widthPercent}%`,
                        height: `${zone.heightPercent}%`,
                        borderColor: isSelected ? '#ffffff' : zone.color,
                        backgroundColor: isSelected ? `${zone.color}30` : undefined
                      }}
                      title={zone.label}
                    >
                      <span
                        className="text-[9px] font-black px-1 py-0.2 rounded shadow-sm text-white truncate max-w-full"
                        style={{ backgroundColor: zone.color }}
                      >
                        {zone.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Mode 2: Centering Crosshairs Grid */}
            {inspectionMode === 'centering' && (
              <div className="absolute inset-0 pointer-events-none border-4 border-dashed border-emerald-400/80 bg-emerald-950/10 flex items-center justify-center">
                {/* 50/50 Target Lines */}
                <div className="absolute top-0 bottom-0 w-px bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                <div className="absolute left-0 right-0 h-px bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />

                {/* Outer Margins Rulers */}
                <div className="absolute top-2 left-3 text-[10px] font-mono text-emerald-300 bg-black/80 px-1.5 py-0.5 rounded border border-emerald-500/40">
                  L: 50.2% | R: 49.8% (GEM MINT)
                </div>
                <div className="absolute bottom-2 left-3 text-[10px] font-mono text-emerald-300 bg-black/80 px-1.5 py-0.5 rounded border border-emerald-500/40">
                  T: 51.0% | B: 49.0% (51/49)
                </div>
              </div>
            )}

            {/* Mode 3: 4-Corner Zoom Overlays */}
            {inspectionMode === 'corners' && (
              <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-2">
                <div className="flex justify-between">
                  <div className="w-10 h-10 border-2 border-cyan-400 rounded-tl-xl bg-cyan-950/40 flex items-center justify-center text-[9px] font-mono font-bold text-cyan-300 shadow-md">
                    TL 4x
                  </div>
                  <div className="w-10 h-10 border-2 border-cyan-400 rounded-tr-xl bg-cyan-950/40 flex items-center justify-center text-[9px] font-mono font-bold text-cyan-300 shadow-md">
                    TR 4x
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="w-10 h-10 border-2 border-cyan-400 rounded-bl-xl bg-cyan-950/40 flex items-center justify-center text-[9px] font-mono font-bold text-cyan-300 shadow-md">
                    BL 4x
                  </div>
                  <div className="w-10 h-10 border-2 border-cyan-400 rounded-br-xl bg-cyan-950/40 flex items-center justify-center text-[9px] font-mono font-bold text-cyan-300 shadow-md">
                    BR 4x
                  </div>
                </div>
              </div>
            )}

            {/* Mode 4: Edge Whitening Heatmap */}
            {inspectionMode === 'edges' && (
              <div className="absolute inset-0 pointer-events-none border-[6px] border-rose-500/40 shadow-[inset_0_0_12px_rgba(244,63,94,0.6)]">
                <div className="absolute top-1 left-1/2 -translate-x-1/2 bg-black/90 text-rose-400 px-2 py-0.5 rounded font-mono text-[10px] border border-rose-500/40">
                  ⚠️ Edge Wear Detection: 0.04% (Near Mint)
                </div>
              </div>
            )}
          </div>

          <p className="text-[11px] text-slate-400 pt-4 text-center max-w-sm">
            Hover or tap any highlighted bounding box on the card to inspect the exact spatial coordinates,
            AI recognition model, and validation logic.
          </p>
        </div>

        {/* Right Column: Zone Inspector & Model Telemetry (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {activeZone ? (
            <div
              className={`p-6 rounded-2xl border space-y-5 animate-pop-in ${
                isLight ? 'bg-white border-slate-200/90 shadow-xs' : 'bg-[#1a1a22] border-[#292934] shadow-xl'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3.5 h-3.5 rounded-full"
                    style={{ backgroundColor: activeZone.color }}
                  />
                  <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {activeZone.label}
                  </h3>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider font-mono border ${
                    activeZone.importance === 'Critical P0'
                      ? 'bg-rose-500/10 text-rose-500 border-rose-500/30'
                      : 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                  }`}
                >
                  {activeZone.importance}
                </span>
              </div>

              {/* Coordinates Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800">
                  <span className="text-slate-400 block text-[10px] uppercase">X / Y Origin:</span>
                  <span className="text-indigo-400 font-bold">
                    {activeZone.xPercent}% , {activeZone.yPercent}%
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800">
                  <span className="text-slate-400 block text-[10px] uppercase">Width × Height:</span>
                  <span className="text-cyan-400 font-bold">
                    {activeZone.widthPercent}% × {activeZone.heightPercent}%
                  </span>
                </div>
              </div>

              {/* AI Pipeline */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Target AI Pipeline & Architecture:
                </span>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono font-semibold">
                  <Cpu className="w-4 h-4 shrink-0 text-indigo-400" />
                  <span>{activeZone.aiPipeline}</span>
                </div>
              </div>

              {/* Purpose */}
              <div className="space-y-1 text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Classification Purpose:
                </span>
                <p className={`leading-relaxed ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>
                  {activeZone.purpose}
                </p>
              </div>

              {/* Edge Case Warning */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold text-[11px] uppercase tracking-wider">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Scanner Edge Cases & Optical Pitfalls:</span>
                </div>
                <p className="text-amber-200/90 leading-relaxed text-[11px]">
                  {activeZone.pitfalls}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center border rounded-2xl border-dashed border-zinc-800 text-slate-400 text-xs">
              Select or hover a bounding box on the card to inspect telemetry.
            </div>
          )}

          {/* Quick Zone Picker List */}
          <div
            className={`p-5 rounded-2xl border space-y-3 ${
              isLight ? 'bg-white border-slate-200/90' : 'bg-[#1a1a22] border-[#292934]'
            }`}
          >
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              All Active ROIs for {currentGame.name}:
            </h4>
            <div className="space-y-1.5">
              {currentGame.zones.map((z) => (
                <div
                  key={z.id}
                  onClick={() => setActiveZoneId(z.id)}
                  className={`flex items-center justify-between p-2 rounded-xl text-xs cursor-pointer transition ${
                    activeZoneId === z.id
                      ? 'bg-indigo-600 text-white font-medium'
                      : isLight
                      ? 'hover:bg-slate-50 text-slate-700'
                      : 'hover:bg-zinc-900 text-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: z.color }}
                    />
                    <span className="truncate">{z.label}</span>
                  </div>
                  <span className="text-[10px] font-mono opacity-60 shrink-0">{z.aiPipeline}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
