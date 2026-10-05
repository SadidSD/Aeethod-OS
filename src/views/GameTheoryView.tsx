import React, { useState } from 'react';
import {
  Swords,
  Shield,
  Zap,
  Target,
  Crown,
  RotateCcw,
  Play,
  Flame,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Percent,
  DollarSign,
  Store,
  Layers,
  Sparkles,
  HelpCircle,
  Award,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { fmtMoney } from '../lib/metrics';
import { navigate } from '../lib/router';

interface GameMove {
  id: string;
  name: string;
  codename: string;
  icon: string;
  category: 'Offensive' | 'Distribution' | 'Network Moat';
  description: string;
  strategicRationale: string;
  effects: {
    stores: number;
    mrr: number;
    churnInduced: number;
    retaliationRisk: 'Low' | 'Medium' | 'High' | 'Extreme';
    moatScore: number;
  };
  competitorReactions: {
    binderpos: string;
    tcgplayer: string;
    tcgsync: string;
  };
}

const STRATEGIC_MOVES: GameMove[] = [
  {
    id: 'zero-commission-wedge',
    name: 'The 0% Commission Wedge',
    codename: 'OPERATION TROJAN HORSE',
    icon: '🪓',
    category: 'Offensive',
    description: 'Publicly guarantee 0% sales commission forever with a 24-hour automated BinderPOS barcode and catalog ETL migration.',
    strategicRationale: 'Creates an insurmountable economic dilemma for incumbents whose revenue models rely on the 2.5% GMV tax.',
    effects: {
      stores: 35,
      mrr: 6825,
      churnInduced: 72000,
      retaliationRisk: 'High',
      moatScore: 18,
    },
    competitorReactions: {
      binderpos: 'Sends cease-and-desist threats regarding database export formats and enforces 90-day contract cancellation notice periods.',
      tcgplayer: 'Observes privately while quietly preparing seller incentives for stores that list exclusively on TCGplayer Direct.',
      tcgsync: 'Runs Google Ads targeting "Aeethod scam" and asserts that commission-free software lacks enterprise stability.',
    },
  },
  {
    id: 'ai-vision-seeding',
    name: 'Free Mobile AI Card Scanner',
    codename: 'OPERATION CARD-EYE',
    icon: '📱',
    category: 'Distribution',
    description: 'Release a free iOS/Android camera scanner app for local card shop clerks to intake single cards at 60fps.',
    strategicRationale: 'Bottom-up clerk adoption bypasses owner skepticism and creates immediate top-of-funnel inbound demo requests.',
    effects: {
      stores: 50,
      mrr: 9750,
      churnInduced: 48000,
      retaliationRisk: 'Medium',
      moatScore: 22,
    },
    competitorReactions: {
      binderpos: 'Attempts to build a rushed mobile scanner update; releases a buggy beta that frustrates existing users.',
      tcgplayer: 'Considers restricting mobile optical search API endpoints to authenticated Pro stores only.',
      tcgsync: 'Points out that hardware laser scanners are more durable than phone cameras for 8-hour retail shifts.',
    },
  },
  {
    id: 'defector-bounty',
    name: 'BinderPOS Contract Buyout Bounty',
    codename: 'OPERATION JILLBREAK',
    icon: '💰',
    category: 'Offensive',
    description: 'Offer a $500 software credit to any premier card shop that terminates their multi-year BinderPOS contract early.',
    strategicRationale: 'Accelerates the defection of the highest-grossing stores ($100k+/mo GMV) who suffer the most from the 2.5% tax.',
    effects: {
      stores: 28,
      mrr: 8372,
      churnInduced: 115000,
      retaliationRisk: 'Extreme',
      moatScore: 15,
    },
    competitorReactions: {
      binderpos: 'Files emergency lawsuits alleging tortious interference with contractual relations and freezes defector API keys.',
      tcgplayer: 'Executive leadership convenes an emergency partner summit to discuss BinderPOS merchant churn rates.',
      tcgsync: 'Launches a matching £500 discount for European stores migrating from American software.',
    },
  },
  {
    id: 'shopify-blitz',
    name: 'Shopify Plus 1-Click App Blitz',
    codename: 'OPERATION ECOSYSTEM OVERDRIVE',
    icon: '🌐',
    category: 'Distribution',
    description: 'Launch on the certified Shopify App Store with a 14-day free trial, instant catalog sync, and zero merchant setup fee.',
    strategicRationale: 'Captures the massive, fast-growing segment of e-commerce warehouse power-sellers who refuse clunky legacy POS software.',
    effects: {
      stores: 45,
      mrr: 8775,
      churnInduced: 35000,
      retaliationRisk: 'Low',
      moatScore: 20,
    },
    competitorReactions: {
      binderpos: 'Submits negative reviews on the Shopify App Store using burner accounts.',
      tcgplayer: 'Increases marketing spend on their own Shopify connector app.',
      tcgsync: 'Reiterates that their custom storefronts have better SEO than standard Shopify themes.',
    },
  },
  {
    id: 'wholesale-network',
    name: 'B2B Wholesale Liquidity Clearinghouse',
    codename: 'OPERATION CARTEL CRACK',
    icon: '🤝',
    category: 'Network Moat',
    description: 'Allow verified Aeethod stores to buy and sell sealed booster boxes and card lots directly with other stores at 0% fee.',
    strategicRationale: 'Creates an internal B2B network effect: every new store that joins increases wholesale inventory liquidity for all members.',
    effects: {
      stores: 38,
      mrr: 7410,
      churnInduced: 62000,
      retaliationRisk: 'High',
      moatScore: 30,
    },
    competitorReactions: {
      binderpos: 'Realizes they cannot copy this without violating existing distributor agreements and distributor kickbacks.',
      tcgplayer: 'Views peer-to-peer dealer clearing as an existential threat to TCGplayer Direct wholesale volume.',
      tcgsync: 'Rushes to announce a planned wholesale feature on their Q4 roadmap.',
    },
  },
  {
    id: 'convention-rigs',
    name: 'Convention & Card Show Offline Rig',
    codename: 'OPERATION ROAD WARRIOR',
    icon: '🎪',
    category: 'Network Moat',
    description: 'Deploy 50 free offline-first iPad register kits to premier vendors at Gen Con, MagicCon, and Collect-A-Con.',
    strategicRationale: 'Live convention booths face horrific convention center WiFi outages. Offline reliability creates massive public word-of-mouth.',
    effects: {
      stores: 32,
      mrr: 7968,
      churnInduced: 54000,
      retaliationRisk: 'Medium',
      moatScore: 24,
    },
    competitorReactions: {
      binderpos: 'Suffers embarrassing public outages at Collect-A-Con while neighboring Aeethod booths process $80,000 offline.',
      tcgplayer: 'Sends convention liaisons with swag bags to reassure frustrated legacy vendors.',
      tcgsync: 'Ailens convention sales teams with printed flyers emphasizing European tournament track records.',
    },
  },
];

export const GameTheoryView: React.FC = () => {
  // Game State
  const [round, setRound] = useState<number>(1);
  const [stores, setStores] = useState<number>(100);
  const [mrr, setMrr] = useState<number>(19500);
  const [churnInduced, setChurnInduced] = useState<number>(0);
  const [moatScore, setMoatScore] = useState<number>(65);
  const [retaliationLevel, setRetaliationLevel] = useState<'Low' | 'Elevated' | 'Severe' | 'Critical'>('Low');
  const [selectedMoveId, setSelectedMoveId] = useState<string>(STRATEGIC_MOVES[0].id);

  // Turn History
  const [history, setHistory] = useState<
    {
      round: number;
      move: GameMove;
      logMessage: string;
      storesGain: number;
      mrrGain: number;
    }[]
  >([]);

  // Active Payoff Matrix Selection
  const [activeMatrix, setActiveMatrix] = useState<'commission-war' | 'merchant-dilemma' | 'api-monopsony'>('commission-war');
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number }>({ row: 0, col: 0 });

  const activeMove = STRATEGIC_MOVES.find((m) => m.id === selectedMoveId) || STRATEGIC_MOVES[0];

  // Execute Move Action
  const handleExecuteMove = () => {
    const nextStores = stores + activeMove.effects.stores;
    const nextMrr = mrr + activeMove.effects.mrr;
    const nextChurn = churnInduced + activeMove.effects.churnInduced;
    const nextMoat = Math.min(100, moatScore + activeMove.effects.moatScore);

    let nextRetaliation: 'Low' | 'Elevated' | 'Severe' | 'Critical' = 'Elevated';
    if (round >= 3 || nextChurn > 150000) nextRetaliation = 'Severe';
    if (round >= 5 || nextChurn > 250000) nextRetaliation = 'Critical';

    setStores(nextStores);
    setMrr(nextMrr);
    setChurnInduced(nextChurn);
    setMoatScore(nextMoat);
    setRetaliationLevel(nextRetaliation);

    const logEntry = {
      round,
      move: activeMove,
      logMessage: `Turn ${round}: Executed ${activeMove.name}. Captured +${activeMove.effects.stores} stores, added +$${activeMove.effects.mrr.toLocaleString()}/mo MRR, peeled $${(activeMove.effects.churnInduced / 1000).toFixed(0)}k ARR from incumbents!`,
      storesGain: activeMove.effects.stores,
      mrrGain: activeMove.effects.mrr,
    };

    setHistory([logEntry, ...history]);
    setRound(round + 1);
  };

  const handleResetGame = () => {
    setRound(1);
    setStores(100);
    setMrr(19500);
    setChurnInduced(0);
    setMoatScore(65);
    setRetaliationLevel('Low');
    setHistory([]);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-slide-in">
      {/* Header & Mission Banner */}
      <div className="card p-6 border-indigo-500/30 bg-[#202020] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 uppercase tracking-wider font-mono flex items-center gap-1">
              <span>♟️</span>
              Strategic Game Theory Simulator
            </span>
            <span className="text-xs text-slate-400">• Dynamic Market Competition War Room</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            TCG Market War Room & Strategic Move Simulator
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            Take strategic turns commanding Aeethod OS, anticipate incumbent counter-moves, exploit structural economic dilemmas, 
            and observe how the market shifts in real time under game-theoretic principles.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => navigate('/topic/economics')}
            className="btn-secondary text-xs px-3.5 py-2.5"
          >
            <span>&larr; Economics Hub</span>
          </button>
          <button
            onClick={handleResetGame}
            className="btn-secondary text-xs px-3 py-2.5 text-slate-400 hover:text-white"
            title="Reset War Game"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Simulation</span>
          </button>
        </div>
      </div>

      {/* GAME HUD / REAL-TIME STATS BAR */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {/* Round / Quarter */}
        <div className="card p-4 space-y-1 border-[#2e2e2e] bg-[#202020]">
          <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Current Campaign</span>
          <div className="text-xl font-black text-white font-mono flex items-center gap-1.5">
            <Crown className="w-4 h-4 text-amber-400" />
            <span>Q{((round - 1) % 4) + 1} 2027</span>
          </div>
          <span className="text-[10px] text-slate-500">Turn #{round}</span>
        </div>

        {/* Aeethod Active Stores */}
        <div className="card p-4 space-y-1 border-indigo-500/30 bg-[#202020]">
          <span className="text-[10px] uppercase font-bold text-indigo-400 font-mono">Aeethod Stores</span>
          <div className="text-2xl font-black text-white font-mono flex items-center gap-1">
            <Store className="w-4 h-4 text-indigo-400" />
            <span>{stores}</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono font-medium">
            +{stores - 100} gained
          </span>
        </div>

        {/* Monthly Recurring Revenue */}
        <div className="card p-4 space-y-1 border-emerald-500/30 bg-[#202020]">
          <span className="text-[10px] uppercase font-bold text-emerald-400 font-mono">Monthly Revenue</span>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            {fmtMoney(mrr)}
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            ARR: {fmtMoney(mrr * 12)}
          </span>
        </div>

        {/* Market Share SAM */}
        <div className="card p-4 space-y-1 border-cyan-500/30 bg-[#202020]">
          <span className="text-[10px] uppercase font-bold text-cyan-400 font-mono">Core SAM Share</span>
          <div className="text-2xl font-black text-cyan-300 font-mono">
            {((stores / 18000) * 100).toFixed(2)}%
          </div>
          <span className="text-[10px] text-slate-400 font-mono">of 18,000 stores</span>
        </div>

        {/* Incumbent Churn Induced */}
        <div className="card p-4 space-y-1 border-rose-500/30 bg-[#202020]">
          <span className="text-[10px] uppercase font-bold text-rose-400 font-mono">Competitor ARR Killed</span>
          <div className="text-xl font-black text-rose-400 font-mono truncate">
            {fmtMoney(churnInduced)}
          </div>
          <span className="text-[10px] text-rose-300">peeled from legacy</span>
        </div>

        {/* Retaliation Level */}
        <div className="card p-4 space-y-1 border-amber-500/30 bg-[#202020]">
          <span className="text-[10px] uppercase font-bold text-amber-400 font-mono">Market Retaliation</span>
          <div className="text-xl font-black font-mono flex items-center gap-1.5">
            <AlertTriangle className={`w-4 h-4 ${
              retaliationLevel === 'Low'
                ? 'text-emerald-400'
                : retaliationLevel === 'Elevated'
                ? 'text-amber-400'
                : retaliationLevel === 'Severe'
                ? 'text-rose-400'
                : 'text-purple-400 animate-pulse'
            }`} />
            <span className={
              retaliationLevel === 'Low'
                ? 'text-emerald-400'
                : retaliationLevel === 'Elevated'
                ? 'text-amber-400'
                : retaliationLevel === 'Severe'
                ? 'text-rose-400'
                : 'text-purple-400'
            }>
              {retaliationLevel}
            </span>
          </div>
          <span className="text-[10px] text-slate-500">Defensive Moat: {moatScore}/100</span>
        </div>
      </div>

      {/* STRATEGIC ENGINE: CHOOSE MOVE & OBSERVE COUNTER-MOVE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Move Selector Cards */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Available Strategic Moves (Select One to Execute)</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Turn #{round}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {STRATEGIC_MOVES.map((move) => {
              const isSelected = selectedMoveId === move.id;
              return (
                <div
                  key={move.id}
                  onClick={() => setSelectedMoveId(move.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition select-none flex flex-col justify-between space-y-3 group ${
                    isSelected
                      ? 'border-indigo-500 bg-[#252525] shadow-lg shadow-indigo-600/10'
                      : 'border-[#2e2e2e] bg-[#202020] hover:border-[#3e3e3e] hover:bg-[#232323]'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{move.icon}</span>
                        <div className="font-bold text-white text-xs leading-snug group-hover:text-indigo-400 transition">
                          {move.name}
                        </div>
                      </div>
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                        move.category === 'Offensive'
                          ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          : move.category === 'Distribution'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                      }`}>
                        {move.category}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">{move.codename}</div>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {move.description}
                    </p>
                  </div>

                  {/* Impact preview pills */}
                  <div className="grid grid-cols-3 gap-1 pt-2 border-t border-[#2e2e2e] text-[10px] font-mono">
                    <div>
                      <span className="text-slate-500 block">Gain</span>
                      <span className="text-emerald-400 font-bold">+{move.effects.stores} stores</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">MRR Lift</span>
                      <span className="text-white font-bold">+${(move.effects.mrr / 1000).toFixed(1)}k</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Risk</span>
                      <span className={`font-bold ${
                        move.effects.retaliationRisk === 'Extreme'
                          ? 'text-purple-400'
                          : move.effects.retaliationRisk === 'High'
                          ? 'text-rose-400'
                          : move.effects.retaliationRisk === 'Medium'
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}>
                        {move.effects.retaliationRisk}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Move Preview & Execution Console */}
        <div className="lg:col-span-5 card p-6 border-indigo-500/40 bg-[#202020] space-y-6 flex flex-col justify-between shadow-xl">
          <div className="space-y-4">
            <div className="flex items-start justify-between border-b border-[#2e2e2e] pb-3">
              <div>
                <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider font-bold">
                  {activeMove.codename}
                </span>
                <h3 className="text-lg font-black text-white flex items-center gap-2 mt-0.5">
                  <span>{activeMove.icon}</span>
                  <span>{activeMove.name}</span>
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">
                Turn #{round} Move
              </span>
            </div>

            {/* Strategic Rationale */}
            <div className="p-3.5 rounded-xl bg-[#252525] border border-[#2e2e2e] space-y-1">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                Strategic Game Theory Mechanism
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeMove.strategicRationale}
              </p>
            </div>

            {/* Anticipated Competitor Reactions */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Swords className="w-3.5 h-3.5 text-rose-400" />
                <span>Anticipated Competitor Autonomous Counter-Moves</span>
              </span>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-[#252525] border border-rose-500/25 space-y-0.5">
                  <div className="font-bold text-rose-400 font-mono text-[10px]">BinderPOS Retaliation:</div>
                  <div className="text-slate-300 text-[11px]">{activeMove.competitorReactions.binderpos}</div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#252525] border border-indigo-500/25 space-y-0.5">
                  <div className="font-bold text-indigo-400 font-mono text-[10px]">TCGplayer / eBay Move:</div>
                  <div className="text-slate-300 text-[11px]">{activeMove.competitorReactions.tcgplayer}</div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#252525] border border-amber-500/25 space-y-0.5">
                  <div className="font-bold text-amber-400 font-mono text-[10px]">TCG Sync Defense:</div>
                  <div className="text-slate-300 text-[11px]">{activeMove.competitorReactions.tcgsync}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Execution Button */}
          <button
            onClick={handleExecuteMove}
            className="btn-primary w-full py-3.5 text-xs font-bold uppercase tracking-wider shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 group cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
            <span>Execute Strategic Move #{round} & Observe Market Shift &rarr;</span>
          </button>
        </div>
      </div>

      {/* GAME ACTION BATTLE LOG */}
      {history.length > 0 && (
        <div className="card p-5 border-[#2e2e2e] bg-[#202020] space-y-3">
          <div className="flex items-center justify-between border-b border-[#2e2e2e] pb-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <span>📜</span>
              <span>Campaign Execution Chronicle & Market Reaction Log</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400">{history.length} moves recorded</span>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {history.map((entry, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-[#252525] border border-[#2e2e2e] flex items-start justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <span className="text-base shrink-0 mt-0.5">{entry.move.icon}</span>
                  <div>
                    <div className="font-bold text-white">{entry.move.name}</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">{entry.logMessage}</div>
                  </div>
                </div>

                <div className="text-right shrink-0 font-mono">
                  <span className="text-emerald-400 font-bold block">+{entry.storesGain} stores</span>
                  <span className="text-slate-400 text-[10px]">+${entry.mrrGain}/mo</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* INTERACTIVE PAYOFF MATRICES (THEORY & APPLIED NASH EQUILIBRIA) */}
      <div className="card p-6 border-[#2e2e2e] bg-[#202020] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2e2e2e] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🧮</span>
              <h3 className="text-base font-bold text-white tracking-tight">
                Interactive Strategic Payoff Matrices & Game Theory Proofs
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any cell in the payoff matrix to inspect the economic payoff vectors and verify the Nash Equilibrium.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#252525] border border-[#2e2e2e]">
            <button
              onClick={() => {
                setActiveMatrix('commission-war');
                setSelectedCell({ row: 0, col: 0 });
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeMatrix === 'commission-war'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              The Commission War
            </button>
            <button
              onClick={() => {
                setActiveMatrix('merchant-dilemma');
                setSelectedCell({ row: 0, col: 0 });
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeMatrix === 'merchant-dilemma'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Merchant Defection
            </button>
            <button
              onClick={() => {
                setActiveMatrix('api-monopsony');
                setSelectedCell({ row: 0, col: 0 });
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeMatrix === 'api-monopsony'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              API Monopsony
            </button>
          </div>
        </div>

        {/* MATRIX 1: THE COMMISSION WAR (PRISONER'S DILEMMA OF COMMISSIONS) */}
        {activeMatrix === 'commission-war' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 overflow-x-auto">
              <table className="w-full text-center border-collapse text-xs font-mono">
                <thead>
                  <tr>
                    <th className="p-3 text-left font-sans text-slate-400 text-xs">Aeethod \\ BinderPOS</th>
                    <th className="p-3 bg-[#252525] text-rose-400 border border-[#2e2e2e]">
                      Maintain 2.5% GMV Tax
                    </th>
                    <th className="p-3 bg-[#252525] text-amber-400 border border-[#2e2e2e]">
                      Match 0% Flat SaaS ($149)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3 text-left font-sans font-bold text-emerald-400 bg-[#252525] border border-[#2e2e2e]">
                      Aeethod: 0% Flat SaaS ($195)
                      <span className="block text-[10px] text-slate-400 font-normal">Strictly Dominant Strategy</span>
                    </td>
                    <td
                      onClick={() => setSelectedCell({ row: 0, col: 0 })}
                      className={`p-4 border border-[#2e2e2e] cursor-pointer transition relative ${
                        selectedCell.row === 0 && selectedCell.col === 0
                          ? 'bg-indigo-600/20 border-indigo-500 ring-2 ring-indigo-500'
                          : 'bg-[#202020] hover:bg-[#252525]'
                      }`}
                    >
                      <div className="text-emerald-400 font-bold text-sm">+$2.1M / -$3.4M</div>
                      <div className="text-[10px] text-slate-400">Aeethod Wins, BinderPOS Bleeds</div>
                      <span className="absolute top-1 right-1 px-1.5 py-0.2 rounded bg-emerald-500 text-slate-950 font-bold text-[9px] uppercase">
                        NASH EQ
                      </span>
                    </td>
                    <td
                      onClick={() => setSelectedCell({ row: 0, col: 1 })}
                      className={`p-4 border border-[#2e2e2e] cursor-pointer transition ${
                        selectedCell.row === 0 && selectedCell.col === 1
                          ? 'bg-indigo-600/20 border-indigo-500 ring-2 ring-indigo-500'
                          : 'bg-[#202020] hover:bg-[#252525]'
                      }`}
                    >
                      <div className="text-amber-400 font-bold text-sm">+$1.2M / -$2.8M</div>
                      <div className="text-[10px] text-slate-400">Both Flat, BinderPOS Loses 70% ARR</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 text-left font-sans font-bold text-slate-300 bg-[#252525] border border-[#2e2e2e]">
                      Aeethod: Squeeze 1.5% Hybrid
                      <span className="block text-[10px] text-slate-400 font-normal">Compromise Strategy</span>
                    </td>
                    <td
                      onClick={() => setSelectedCell({ row: 1, col: 0 })}
                      className={`p-4 border border-[#2e2e2e] cursor-pointer transition ${
                        selectedCell.row === 1 && selectedCell.col === 0
                          ? 'bg-indigo-600/20 border-indigo-500 ring-2 ring-indigo-500'
                          : 'bg-[#202020] hover:bg-[#252525]'
                      }`}
                    >
                      <div className="text-slate-300 font-bold text-sm">+$1.4M / -$1.2M</div>
                      <div className="text-[10px] text-slate-400">Moderate Store Churn</div>
                    </td>
                    <td
                      onClick={() => setSelectedCell({ row: 1, col: 1 })}
                      className={`p-4 border border-[#2e2e2e] cursor-pointer transition ${
                        selectedCell.row === 1 && selectedCell.col === 1
                          ? 'bg-indigo-600/20 border-indigo-500 ring-2 ring-indigo-500'
                          : 'bg-[#202020] hover:bg-[#252525]'
                      }`}
                    >
                      <div className="text-rose-400 font-bold text-sm">+$400k / -$1.9M</div>
                      <div className="text-[10px] text-slate-400">Price War Attrition</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Matrix Explanation Console */}
            <div className="lg:col-span-4 p-4 rounded-xl bg-[#252525] border border-[#2e2e2e] space-y-2 text-xs">
              <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold block">
                Game Theory Analysis
              </span>
              <h4 className="font-bold text-white text-sm">
                Why 0% Flat SaaS is Aeethod\'s Dominant Strategy:
              </h4>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                BinderPOS cannot match 0% commission because 70% of their operational cash flow is generated by the 2.5% GMV tax. 
                Matching 0% would collapse their own valuation by 75%.
              </p>
              <div className="pt-2 border-t border-[#2e2e2e] text-[11px] text-amber-300 font-medium">
                <strong>Result:</strong> Aeethod possesses a <em>Credible Commitment</em> that puts the incumbent in a checkmate position (Innovator\'s Dilemma).
              </div>
            </div>
          </div>
        )}

        {/* MATRIX 2: MERCHANT DEFECTION DILEMMA */}
        {activeMatrix === 'merchant-dilemma' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 overflow-x-auto">
              <table className="w-full text-center border-collapse text-xs font-mono">
                <thead>
                  <tr>
                    <th className="p-3 text-left font-sans text-slate-400 text-xs">Merchant \\ Incumbent</th>
                    <th className="p-3 bg-[#252525] text-rose-400 border border-[#2e2e2e]">
                      Enforce Early Termination Penalty ($1,500)
                    </th>
                    <th className="p-3 bg-[#252525] text-emerald-400 border border-[#2e2e2e]">
                      Offer 50% Fee Discount Retain
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3 text-left font-sans font-bold text-emerald-400 bg-[#252525] border border-[#2e2e2e]">
                      Merchant: Switch to Aeethod (Bounty Active)
                    </td>
                    <td
                      onClick={() => setSelectedCell({ row: 0, col: 0 })}
                      className="p-4 border border-indigo-500 bg-indigo-600/20 ring-2 ring-indigo-500 relative"
                    >
                      <div className="text-emerald-400 font-bold text-sm">+$22k/yr / -$36k ARR</div>
                      <div className="text-[10px] text-slate-400">Aeethod Bounty covers fee; store saves $22k/yr</div>
                      <span className="absolute top-1 right-1 px-1.5 py-0.2 rounded bg-emerald-500 text-slate-950 font-bold text-[9px] uppercase">
                        NASH EQ
                      </span>
                    </td>
                    <td className="p-4 border border-[#2e2e2e] bg-[#202020]">
                      <div className="text-emerald-400 font-bold text-sm">+$24k/yr / -$18k ARR</div>
                      <div className="text-[10px] text-slate-400">Store switches anyway for modern UI</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 text-left font-sans font-bold text-slate-300 bg-[#252525] border border-[#2e2e2e]">
                      Merchant: Stay on Legacy POS
                    </td>
                    <td className="p-4 border border-[#2e2e2e] bg-[#202020]">
                      <div className="text-rose-400 font-bold text-sm">-$24k/yr / +$36k ARR</div>
                      <div className="text-[10px] text-slate-400">Store continues bleeding 2.5% tax</div>
                    </td>
                    <td className="p-4 border border-[#2e2e2e] bg-[#202020]">
                      <div className="text-amber-400 font-bold text-sm">-$12k/yr / +$18k ARR</div>
                      <div className="text-[10px] text-slate-400">Temporary discount, still inferior software</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="lg:col-span-4 p-4 rounded-xl bg-[#252525] border border-[#2e2e2e] space-y-2 text-xs">
              <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold block">
                Switching Analysis
              </span>
              <h4 className="font-bold text-white text-sm">The Contract Buyout Guarantee:</h4>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                By offering the $500 defector bounty, Aeethod completely neutralizes the incumbent\'s sole defensive weapon 
                (early termination penalty), making switching the dominant economic choice for the merchant.
              </p>
            </div>
          </div>
        )}

        {/* MATRIX 3: API MONOPSONY */}
        {activeMatrix === 'api-monopsony' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 overflow-x-auto">
              <table className="w-full text-center border-collapse text-xs font-mono">
                <thead>
                  <tr>
                    <th className="p-3 text-left font-sans text-slate-400 text-xs">Aeethod \\ TCGplayer/eBay</th>
                    <th className="p-3 bg-[#252525] text-emerald-400 border border-[#2e2e2e]">
                      Maintain Open API Access
                    </th>
                    <th className="p-3 bg-[#252525] text-rose-400 border border-[#2e2e2e]">
                      Lock Walled-Garden API
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3 text-left font-sans font-bold text-emerald-400 bg-[#252525] border border-[#2e2e2e]">
                      Aeethod: Multi-Channel Webhook Sync
                    </td>
                    <td className="p-4 border border-indigo-500 bg-indigo-600/20 ring-2 ring-indigo-500 relative">
                      <div className="text-emerald-400 font-bold text-sm">+250 Stores / Steady GMV</div>
                      <div className="text-[10px] text-slate-400">Optimal peaceful equilibrium</div>
                      <span className="absolute top-1 right-1 px-1.5 py-0.2 rounded bg-emerald-500 text-slate-950 font-bold text-[9px] uppercase">
                        NASH EQ
                      </span>
                    </td>
                    <td className="p-4 border border-[#2e2e2e] bg-[#202020]">
                      <div className="text-amber-400 font-bold text-sm">+180 Stores / Stores Protest</div>
                      <div className="text-[10px] text-slate-400">Stores revolt against eBay API lock</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 text-left font-sans font-bold text-slate-300 bg-[#252525] border border-[#2e2e2e]">
                      Aeethod: Direct B2B Liquidity (Bypass)
                    </td>
                    <td className="p-4 border border-[#2e2e2e] bg-[#202020]">
                      <div className="text-cyan-400 font-bold text-sm">+400 Stores / eBay Loses 8% GMV</div>
                      <div className="text-[10px] text-slate-400">Dealers trade directly at 0% fee</div>
                    </td>
                    <td className="p-4 border border-[#2e2e2e] bg-[#202020]">
                      <div className="text-rose-400 font-bold text-sm">Open Antitrust Investigation</div>
                      <div className="text-[10px] text-slate-400">Total warfare; eBay faces FTC antitrust scrutiny</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="lg:col-span-4 p-4 rounded-xl bg-[#252525] border border-[#2e2e2e] space-y-2 text-xs">
              <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold block">
                Platform Strategy
              </span>
              <h4 className="font-bold text-white text-sm">Monopsony Restraint:</h4>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                TCGplayer/eBay cannot aggressively lock their API without triggering store revolts and potential FTC antitrust scrutiny 
                for monopolizing the TCG card pricing data standard.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* GAME THEORY LEXICON & PRINCIPLES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-5 border-[#2e2e2e] bg-[#202020] space-y-2">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
            <span className="text-base">1️⃣</span>
            <span>Credible Commitment</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            By architecting Aeethod from day one as a flat-rate SaaS ($0 commission), our promise is credible. Incumbents cannot credibly match it 
            because cutting commission destroys 70% of their existing balance sheet cash flow.
          </p>
        </div>

        <div className="card p-5 border-[#2e2e2e] bg-[#202020] space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
            <span className="text-base">2️⃣</span>
            <span>Nash Equilibrium in Pricing</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            In our pricing matrix, no player can unilaterally deviate to improve their outcome. For Aeethod, 0% commission is the strictly dominant choice 
            that maximizes merchant acquisition velocity across all counter-strategies.
          </p>
        </div>

        <div className="card p-5 border-[#2e2e2e] bg-[#202020] space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
            <span className="text-base">3️⃣</span>
            <span>Asymmetric Disruption</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Following Clayton Christensen\'s disruption theory: when an incumbent is paralyzed by high-margin revenue addiction (2.5% GMV tax), 
            the entrant wins by providing a simpler, flat, lower-friction solution that serves the underserved majority.
          </p>
        </div>
      </div>
    </div>
  );
};
