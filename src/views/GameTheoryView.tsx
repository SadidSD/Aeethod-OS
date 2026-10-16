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
  Crosshair,
  Radio,
  Activity,
  Cpu,
  Package,
  Box,
  Share2,
  FileText,
  BarChart3,
  Users,
  Scale,
  Terminal,
} from 'lucide-react';
import { fmtMoney } from '../lib/metrics';
import { navigate } from '../lib/router';

// ==========================================
// GAME THEORY MOVE INTERFACES
// ==========================================
interface GameMove {
  id: string;
  name: string;
  codename: string;
  icon: string;
  category: 'Offensive' | 'Distribution' | 'Network Moat';
  targetRival: 'SortSwift' | 'BinderPOS' | 'TCGplayer' | 'General Market';
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
    sortswift: string;
    binderpos: string;
    tcgplayer: string;
    indieTools: string;
  };
}

// ==========================================
// COMPETITOR FACTION DOSSIERS
// ==========================================
interface CompetitorFaction {
  id: string;
  name: string;
  commander: string;
  threatLevel: 'Extreme' | 'High' | 'Medium' | 'Guerrilla';
  doctrine: string;
  arsenal: string[];
  vulnerabilities: string[];
  aeethodCounter: string;
  quote: string;
}

const COMPETITOR_FACTIONS: CompetitorFaction[] = [
  {
    id: 'sortswift',
    name: 'SortSwift / MTech Cave',
    commander: 'Mikah Walters (@mtechcave)',
    threatLevel: 'High',
    doctrine: 'Hardware-Anchored Shopify Cartel & High-Touch Hustle',
    arsenal: [
      'Aggressive "Swifties" affiliate link army driving recurring referrals',
      'High-speed Ricoh fi-8170 document scanner integrations & 3D-printed parts',
      'Super Sorter hardware line ($9k Mini, $25k Full industrial)',
      'SortSwiftOS Sync Box appliance ($249) to bypass TCGplayer restrictions',
      'Upcoming private marketplace: LGS Market (lgsmarket.com)',
    ],
    vulnerabilities: [
      'Stacked Fees: Base fee ($19-$499) + expiring scan credits + auto-pricing fees + required $39-$399/mo Shopify plan',
      'Expiring Scan Meter: Unused scans vanish monthly unless users pay 2x for rollover tiers',
      'Poor Webcam Accuracy: Webcam mode drops below 25%-50% recognition, forcing users into $950 Ricoh scanners',
      'Affiliate Fatigue: Community pushback in third-party Discords against constant referral link spam',
    ],
    aeethodCounter: 'Deliver a 100% standalone web & mobile OS with zero mandatory Shopify fees, unlimited AI camera scans, and transparent flat pricing without scan-meter anxiety.',
    quote: '"We don’t have any free services here... a lot of work goes into this software we can’t be giving it away or we wouldn’t be in business 🙂"',
  },
  {
    id: 'binderpos',
    name: 'BinderPOS / You-Know-Who',
    commander: 'Corporate Enterprise Team (Legacy Incumbent)',
    threatLevel: 'Extreme',
    doctrine: 'Monopsony Lock-in & 2.5% GMV Tollbooth Extraction',
    arsenal: [
      'Exclusive certified direct API sync with TCGplayer inventory',
      'Legacy install base of 1,200+ brick-and-mortar local game stores',
      'Predatory multi-year contracts with 90-day cancellation and $1,500 termination penalties',
    ],
    vulnerabilities: [
      '2.5% GMV commission extracts $15k-$40k/yr from high-volume power stores',
      'Antiquated 2017 architecture with frequent sync outages at major game releases',
      'Customer support ticket resolution averages 4-7 days',
    ],
    aeethodCounter: 'Execute the 0% Commission Wedge: offer 24-hour automated 1-click catalog migration + $500 defector bounties to break their contract locks.',
    quote: '"All TCG singles sales on our integrated channels are subject to standard 2.5% platform transaction processing fees."',
  },
  {
    id: 'tcgtracking',
    name: 'TCGTracking / TCGT Flow',
    commander: 'Laezin (Solo Developer)',
    threatLevel: 'Guerrilla',
    doctrine: 'Free Scraper Community Guerrilla & OpenAPI Bandwidth',
    arsenal: [
      'Free Windows desktop scraping engine (TCGTracking Flow)',
      'OpenAPI handling 3.1TB bandwidth serving community card catalog data',
      'EasyPost USPS Intelligent Mail Barcode (IMb) envelope tracking integration',
      'Direct auto-repricer for ManaPool and CardTrader',
    ],
    vulnerabilities: [
      'Fragile Single-Dev Architecture: Recurring SSL certificate collapses (NET::ERR_CERT_AUTHORITY_INVALID)',
      'Brittle Scraping: TCGplayer DOM updates break export pipelines overnight',
      'High User Friction: Forces non-technical store owners to register developer EasyPost API keys manually',
      'Zero Tax/COGS: Completely lacks FIFO inventory accounting and purchase order cost basis tracking',
    ],
    aeethodCounter: 'Offer zero-configuration native $0.99 tracked letter printing directly inside the browser without requiring external EasyPost API keys or desktop scrapers.',
    quote: '"Thanks to @Bubby and some Reddit members for helping with some improvements... @Staff spam"',
  },
  {
    id: 'tcgbuddy',
    name: 'TCGBuddy.net',
    commander: 'Yianna (@yianna)',
    threatLevel: 'Medium',
    doctrine: 'Indie ManaPool Ally & Box EV Cost-Allocation Engine',
    arsenal: [
      'Free unlimited USPS PWE tracking and ManaPool automated order sync',
      'Relative Market Value "Cost Per Card" engine for cracked booster boxes',
      'Multi-order batch pull sheets with 30-day reserved location holding',
      'DeckOps MCP Server (deckops.tcgbuddy.net) for AI deckbuilding without hallucinations',
    ],
    vulnerabilities: [
      'Capped Free Tier: Restricts free users to 2,500 cards and 25 sales per month',
      'No Computer Vision: Completely lacks visual camera scanning and card recognition hardware bridges',
      'ManaPool Centric: Very limited penetration into eBay, TCGplayer Pro, or direct standalone retail storefronts',
    ],
    aeethodCounter: 'Provide full multi-channel sync (eBay + TCGplayer + ManaPool) with high-speed smartphone camera scanning while adopting relative box EV cost-basis tools.',
    quote: '"You crack a $120 box. Out come 400 cards. Be honest: what did that $200 chase actually cost you? Most of us guess. Profit numbers become fiction."',
  },
  {
    id: 'hippolink',
    name: 'HippoLink & CardChaos',
    commander: 'Zach (@zeldazach - MTGJSON Lead) & Klindel',
    threatLevel: 'High',
    doctrine: 'Data Royalty & MTGJSON Standard Dominance',
    arsenal: [
      'Direct MTGJSON and MTGStocks pedigree: unmatched metadata accuracy and UUID resolution',
      'Acquired CardChaos.net in Sept 2026 for automated warehouse chaos inventory binning',
      'Twice-daily automated repricing suite built specifically for MTG single retailers',
    ],
    vulnerabilities: [
      'MTG Hyper-Bias: Primarily focused on Magic: The Gathering; weak on Pokémon, One Piece, and Lorcana',
      'Desktop Web-Only: Zero iOS/Android native camera scanner apps for counter clerks',
      'No Native Shipping: Lacks integrated $0.99 tracked envelope label generation',
    ],
    aeethodCounter: 'Deliver equal first-class catalog support for Pokémon, Lorcana, and One Piece alongside MTG, combined with mobile scanning intake and native postage.',
    quote: '"Built for LGS owners by the team behind MTGJSON (me!) and MTGStocks... HippoLink supports full repricing twice a day, apart of the full suite."',
  },
];

// ==========================================
// STRATEGIC WAR ROOM MOVES
// ==========================================
const STRATEGIC_MOVES: GameMove[] = [
  {
    id: 'de-shopify-strike',
    name: 'Operation Independence (De-Shopify Strike)',
    codename: 'OPERATION UNCHAINED',
    icon: '⚡',
    category: 'Offensive',
    targetRival: 'SortSwift',
    description: 'Launch a 1-click standalone web storefront and direct eBay/TCGplayer sync, completely eliminating SortSwift’s mandatory $39–$399/mo Shopify tax and Shopify variant caps.',
    strategicRationale: 'Directly exploits SortSwift’s structural dependency on the Shopify ecosystem. Sellers save $400+/mo in stacked app subscriptions.',
    effects: {
      stores: 42,
      mrr: 8190,
      churnInduced: 89000,
      retaliationRisk: 'High',
      moatScore: 26,
    },
    competitorReactions: {
      sortswift: 'Mikah argues in Discord that "Shopify has superior themes and checkout conversion" while rushing his developer Steve to build a standalone hosted kiosk option.',
      binderpos: 'Dismisses the move, claiming independent storefronts cannot attract foot traffic without TCGplayer Direct integration.',
      tcgplayer: 'Monitors multichannel inventory flow to ensure seller listings remain synced.',
      indieTools: 'TCGTracking attempts to add export templates for Aeethod’s independent storefront format.',
    },
  },
  {
    id: 'unmetered-vision-strike',
    name: 'Unmetered Vision: 100% Free Camera Scanning',
    codename: 'OPERATION NO-METER',
    icon: '👁️',
    category: 'Distribution',
    targetRival: 'SortSwift',
    description: 'Provide unlimited 60fps smartphone & webcam card scanning on all plans with ZERO expiring scan credits and ZERO rollover charges.',
    strategicRationale: 'Neutralizes SortSwift’s most frustrating nickel-and-dime revenue stream (metered scan credits that vanish at month-end unless double is paid for rollover).',
    effects: {
      stores: 55,
      mrr: 10725,
      churnInduced: 68000,
      retaliationRisk: 'Medium',
      moatScore: 28,
    },
    competitorReactions: {
      sortswift: 'Mikah posts in ManaPool: "Phone cameras scratch cards and miss foils; buy the Ricoh 8170 for $950 if you want serious retail volume."',
      binderpos: 'Attempts to release a mobile scanner update; encounters camera zoom calibration errors on Android.',
      tcgplayer: 'Reviews mobile optical identification API endpoints to check for rate limit anomalies.',
      indieTools: 'TCGBuddy notes that AI camera scanning pairs well with their pull sheets; explores partnership.',
    },
  },
  {
    id: 'native-imb-mailbag',
    name: 'Zero-Click $0.99 USPS IMb Tracked Shipping',
    codename: 'OPERATION ENVELOPE',
    icon: '✉️',
    category: 'Distribution',
    targetRival: 'SortSwift',
    description: 'Embed native USPS Intelligent Mail Barcode tracked envelope label purchasing ($0.99) directly in-app without requiring external EasyPost developer accounts or extra shipping apps.',
    strategicRationale: 'Solves the #1 logistics headache for sub-$20 TCG singles. Demolishes SortSwift’s multi-app shipping complexity and TCGTracking’s manual API setup.',
    effects: {
      stores: 48,
      mrr: 9360,
      churnInduced: 54000,
      retaliationRisk: 'Low',
      moatScore: 25,
    },
    competitorReactions: {
      sortswift: 'Users in SortSwift guest-chat ask why they must pay for separate shipping extensions when Aeethod has native $0.99 envelopes.',
      binderpos: 'Continues charging standard parcel postage rates ($3.80+) via legacy ShipStation integrations.',
      tcgplayer: 'Recognizes USPS IMb tracking numbers as valid carrier shipment confirmations.',
      indieTools: 'Laezin (TCGTracking) defends his free EasyPost integration; admits native zero-config setup is cleaner.',
    },
  },
  {
    id: 'anti-shill-transparency',
    name: 'Anti-Shill Integrity & Transparent Pricing Guarantee',
    codename: 'OPERATION CLEAN SIGNAL',
    icon: '🛡️',
    category: 'Network Moat',
    targetRival: 'SortSwift',
    description: 'Commit to zero aggressive referral affiliate spam in community servers. Offer transparent, flat $195/mo all-inclusive pricing with public product teardowns.',
    strategicRationale: 'Directly capitalizes on widespread community fatigue and resentment towards "Swifties" spamming affiliate links (?ref=Greed) in ManaPool and Reddit.',
    effects: {
      stores: 34,
      mrr: 6630,
      churnInduced: 42000,
      retaliationRisk: 'Medium',
      moatScore: 32,
    },
    competitorReactions: {
      sortswift: 'Power users in ManaPool defend their affiliate links, claiming "I legit just want more people to use it and rake in my sweet coin."',
      binderpos: 'Ignores community sentiment; doubles down on enterprise sales calls.',
      tcgplayer: 'Observes independent seller communities banning affiliate promotion.',
      indieTools: 'ManaPool moderators praise Aeethod for respecting community guidelines and keeping technical channels clean.',
    },
  },
  {
    id: 'zero-commission-wedge',
    name: 'The 0% Commission Wedge',
    codename: 'OPERATION TROJAN HORSE',
    icon: '🪓',
    category: 'Offensive',
    targetRival: 'BinderPOS',
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
      sortswift: 'Mikah chimes in: "SortSwift has always had 0% commission on synced marketplaces, pricing is the best haha."',
      binderpos: 'Sends cease-and-desist threats regarding database export formats and enforces 90-day contract cancellation notice periods.',
      tcgplayer: 'Observes privately while quietly preparing seller incentives for stores that list exclusively on TCGplayer Direct.',
      indieTools: 'TCG Sync runs search ads targeting "commission-free TCG software" and claims enterprise support requires transaction cuts.',
    },
  },
  {
    id: 'defector-bounty',
    name: 'Legacy Contract Buyout Bounty',
    codename: 'OPERATION JILLBREAK',
    icon: '💰',
    category: 'Offensive',
    targetRival: 'BinderPOS',
    description: 'Offer a $500 software credit to any premier card shop that terminates their multi-year BinderPOS or locked contract early.',
    strategicRationale: 'Accelerates the defection of the highest-grossing stores ($100k+/mo GMV) who suffer the most from the 2.5% tax.',
    effects: {
      stores: 28,
      mrr: 8372,
      churnInduced: 115000,
      retaliationRisk: 'Extreme',
      moatScore: 15,
    },
    competitorReactions: {
      sortswift: 'SortSwift team watches closely; Mikah wonders if he can offer a hardware trade-in credit for old Magic Sorters.',
      binderpos: 'Files emergency lawsuits alleging tortious interference with contractual relations and freezes defector API keys.',
      tcgplayer: 'Executive leadership convenes an emergency partner summit to discuss BinderPOS merchant churn rates.',
      indieTools: 'TCG Sync launches a matching discount for European stores migrating from North American platforms.',
    },
  },
  {
    id: 'wholesale-network',
    name: 'B2B Wholesale Liquidity Clearinghouse',
    codename: 'OPERATION CARTEL CRACK',
    icon: '🤝',
    category: 'Network Moat',
    targetRival: 'TCGplayer',
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
      sortswift: 'Mikah mentions his trade mode and reveals plans for LGS Market wholesale auctions.',
      binderpos: 'Realizes they cannot copy this without violating existing distributor agreements and distributor kickbacks.',
      tcgplayer: 'Views peer-to-peer dealer clearing as an existential threat to TCGplayer Direct wholesale volume.',
      indieTools: 'MTGBan creator Koda analyzes the clearinghouse spread data to identify box EV arbitrage opportunities.',
    },
  },
  {
    id: 'convention-rigs',
    name: 'Convention & Card Show Offline Rig',
    codename: 'OPERATION ROAD WARRIOR',
    icon: '🎪',
    category: 'Network Moat',
    targetRival: 'General Market',
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
      sortswift: 'Mikah visits MagicCon in person showcasing the Super Sorter and Simple Sorter hardware line.',
      binderpos: 'Suffers embarrassing public outages at Collect-A-Con while neighboring Aeethod booths process $80,000 offline.',
      tcgplayer: 'Sends convention liaisons with swag bags to reassure frustrated legacy vendors.',
      indieTools: 'Zach (HippoLink) roams MagicCon Vegas floor in black polo sharing MTGJSON stickers.',
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

  // Faction Spotlight State
  const [activeFactionId, setActiveFactionId] = useState<string>('sortswift');

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
  const [activeMatrix, setActiveMatrix] = useState<'sortswift-dilemma' | 'commission-war' | 'merchant-dilemma' | 'api-monopsony'>('sortswift-dilemma');
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number }>({ row: 0, col: 0 });

  const activeMove = STRATEGIC_MOVES.find((m) => m.id === selectedMoveId) || STRATEGIC_MOVES[0];
  const activeFaction = COMPETITOR_FACTIONS.find((f) => f.id === activeFactionId) || COMPETITOR_FACTIONS[0];

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
      logMessage: `Turn ${round}: Executed ${activeMove.name}. Captured +${activeMove.effects.stores} stores, added +$${activeMove.effects.mrr.toLocaleString()}/mo MRR, peeled $${(activeMove.effects.churnInduced / 1000).toFixed(0)}k ARR from ${activeMove.targetRival}!`,
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
      <div className="card p-6 border-indigo-500/30 bg-[#202020] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-500/10 via-rose-500/5 to-transparent blur-3xl pointer-events-none" />
        
        <div className="space-y-1.5 max-w-3xl relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Crosshair className="w-3.5 h-3.5 text-indigo-400 animate-spin-slow" />
              <span>Tactical War Room 2.0</span>
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30 uppercase tracking-wider font-mono">
              Aeethod vs. SortSwift & Legacy Incumbents
            </span>
            <span className="text-xs text-slate-400">• Multi-Faction Game Theory Engine</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <span>TCG Market War Room & Strategic Payoff Matrix</span>
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            Command Aeethod OS against the TCG ecosystem. Exploit SortSwift’s Shopify tax and metered scan friction, 
            neutralize BinderPOS’s 2.5% tollbooth, outpace indie scrapers, and observe Nash Equilibria evolve in real time.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 relative z-10">
          <button
            onClick={() => navigate('/topic/competitors')}
            className="btn-secondary text-xs px-3.5 py-2.5 flex items-center gap-1.5"
          >
            <BarChart3 className="w-3.5 h-3.5 text-slate-400" />
            <span>Competitor Matrix</span>
          </button>
          <button
            onClick={handleResetGame}
            className="btn-secondary text-xs px-3 py-2.5 text-slate-400 hover:text-white"
            title="Reset War Game"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset War Room</span>
          </button>
        </div>
      </div>

      {/* TACTICAL HUD: REAL-TIME WAR METRICS */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {/* Campaign Quarter */}
        <div className="card p-4 space-y-1 border-[#2e2e2e] bg-[#202020]">
          <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Campaign Period</span>
          <div className="text-xl font-black text-white font-mono flex items-center gap-1.5">
            <Crown className="w-4 h-4 text-amber-400" />
            <span>Q{((round - 1) % 4) + 1} 2027</span>
          </div>
          <span className="text-[10px] text-slate-500">Operation Turn #{round}</span>
        </div>

        {/* Aeethod Active Stores */}
        <div className="card p-4 space-y-1 border-indigo-500/30 bg-[#202020]">
          <span className="text-[10px] uppercase font-bold text-indigo-400 font-mono">Aeethod Fleet</span>
          <div className="text-2xl font-black text-white font-mono flex items-center gap-1">
            <Store className="w-4 h-4 text-indigo-400" />
            <span>{stores}</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono font-medium">
            +{stores - 100} stores gained
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
          <span className="text-[10px] uppercase font-bold text-rose-400 font-mono">Rival ARR Cannibalized</span>
          <div className="text-xl font-black text-rose-400 font-mono truncate">
            {fmtMoney(churnInduced)}
          </div>
          <span className="text-[10px] text-rose-300">from SortSwift & BinderPOS</span>
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

      {/* STRATEGIC RIVALRY SPOTLIGHT: AEETHOD VS SORTSWIFT */}
      <div className="card p-6 border-indigo-500/30 bg-gradient-to-r from-[#202020] via-[#24222a] to-[#202020] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2e2e2e] pb-3">
          <div className="flex items-center gap-2">
            <Swords className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white tracking-tight">
              Primary Strategic Theater: Aeethod OS vs. SortSwift (MTech Cave)
            </h2>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            Asymmetric Battleground Analysis
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Aeethod Core Posture */}
          <div className="p-4 rounded-xl bg-[#1b1e28] border border-indigo-500/30 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-400 uppercase font-mono text-[11px] flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-indigo-400" />
                Aeethod OS Strategic Posture
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-mono text-[10px] font-bold">
                Flat $195/mo Unlimited
              </span>
            </div>
            <ul className="space-y-1.5 text-slate-300 text-[11px]">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>No Mandatory Shopify Tax:</strong> Standalone web OS with direct native eBay, TCGplayer, and ManaPool sync.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Zero-Metered Camera Vision:</strong> Unlimited scans on regular smartphones/webcams; no $950 scanner requirement.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Zero-Config $0.99 Tracked Envelopes:</strong> Instant USPS IMb printing without external developer API keys.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Clean Community Standing:</strong> Strict zero-shill policy; no spammy affiliate links polluting third-party Discords.</span>
              </li>
            </ul>
          </div>

          {/* SortSwift Posture & Flaws */}
          <div className="p-4 rounded-xl bg-[#281b1f] border border-rose-500/30 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-rose-400 uppercase font-mono text-[11px] flex items-center gap-1.5">
                <Crosshair className="w-3.5 h-3.5 text-rose-400" />
                SortSwift (Mikah Walters) Exposed Vulnerabilities
              </span>
              <span className="px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 font-mono text-[10px] font-bold">
                $250–$500+/mo Stacked Cost
              </span>
            </div>
            <ul className="space-y-1.5 text-slate-300 text-[11px]">
              <li className="flex items-start gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Shopify Variant Bottleneck:</strong> Forces users onto Shopify ($39–$399/mo) and hits strict variant limit walls.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Scan Meter Anxiety:</strong> Scan credits expire monthly; requires paying 2x more for rollover tiers.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Hardware Push:</strong> Webcam mode is unreliable (&lt;25% accuracy); tells users to buy $950 Ricoh 8170 scanners.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>"Swiftie" Shilling Backlash:</strong> Affiliate links (?ref=Greed) banned in ManaPool after community revolt.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* STRATEGIC ENGINE: CHOOSE MOVE & OBSERVE MULTI-COMPETITOR REACTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Move Selector Cards */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Available Strategic Operations (Select to Launch)</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Campaign Turn #{round}</span>
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
                        move.targetRival === 'SortSwift'
                          ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          : move.targetRival === 'BinderPOS'
                          ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                          : 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                      }`}>
                        vs {move.targetRival}
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
                  {activeMove.codename} • Target: {activeMove.targetRival}
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

            {/* Anticipated Competitor Reactions (SortSwift + BinderPOS + TCGplayer) */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Swords className="w-3.5 h-3.5 text-rose-400" />
                <span>Simulated Ecosystem Counter-Reactions</span>
              </span>

              <div className="space-y-2 text-xs">
                {/* SortSwift Reaction */}
                <div className="p-2.5 rounded-lg bg-[#252525] border border-rose-500/30 space-y-0.5">
                  <div className="font-bold text-rose-400 font-mono text-[10px] flex items-center justify-between">
                    <span>SortSwift (Mikah / MTech Cave):</span>
                    <span className="text-[9px] text-slate-400">Hyper-Active Founder</span>
                  </div>
                  <div className="text-slate-300 text-[11px] leading-relaxed">
                    {activeMove.competitorReactions.sortswift}
                  </div>
                </div>

                {/* BinderPOS Reaction */}
                <div className="p-2.5 rounded-lg bg-[#252525] border border-purple-500/25 space-y-0.5">
                  <div className="font-bold text-purple-400 font-mono text-[10px] flex items-center justify-between">
                    <span>BinderPOS Incumbent:</span>
                    <span className="text-[9px] text-slate-400">Enterprise Chokehold</span>
                  </div>
                  <div className="text-slate-300 text-[11px] leading-relaxed">
                    {activeMove.competitorReactions.binderpos}
                  </div>
                </div>

                {/* TCGplayer / Platform */}
                <div className="p-2.5 rounded-lg bg-[#252525] border border-indigo-500/25 space-y-0.5">
                  <div className="font-bold text-indigo-400 font-mono text-[10px] flex items-center justify-between">
                    <span>TCGplayer / eBay / Marketplace:</span>
                    <span className="text-[9px] text-slate-400">Platform Regulator</span>
                  </div>
                  <div className="text-slate-300 text-[11px] leading-relaxed">
                    {activeMove.competitorReactions.tcgplayer}
                  </div>
                </div>

                {/* Indie Tools Reaction */}
                <div className="p-2.5 rounded-lg bg-[#252525] border border-emerald-500/25 space-y-0.5">
                  <div className="font-bold text-emerald-400 font-mono text-[10px] flex items-center justify-between">
                    <span>Indie Tools (TCGTracking / TCGBuddy):</span>
                    <span className="text-[9px] text-slate-400">Community Ecosystem</span>
                  </div>
                  <div className="text-slate-300 text-[11px] leading-relaxed">
                    {activeMove.competitorReactions.indieTools}
                  </div>
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
            <span>Launch Operation #{round} & Shift Market Nash Equilibrium &rarr;</span>
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
            <span className="text-[10px] font-mono text-slate-400">{history.length} operations recorded</span>
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
                    <div className="font-bold text-white flex items-center gap-2">
                      <span>{entry.move.name}</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300">
                        Target: {entry.move.targetRival}
                      </span>
                    </div>
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

      {/* COMPETITOR INTELLIGENCE DOSSIERS & FACTIONS */}
      <div className="card p-6 border-[#2e2e2e] bg-[#202020] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2e2e2e] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-indigo-400 animate-pulse" />
              <h3 className="text-base font-bold text-white tracking-tight">
                War Room Competitor Dossiers & Faction Intelligence
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Select any rival faction to inspect their operational doctrine, arsenal, and how Aeethod exploits their fatal weaknesses.
            </p>
          </div>

          {/* Faction Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#252525] border border-[#2e2e2e]">
            {COMPETITOR_FACTIONS.map((faction) => (
              <button
                key={faction.id}
                onClick={() => setActiveFactionId(faction.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeFactionId === faction.id
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {faction.name.split('/')[0].trim()}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Faction Detailed Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 rounded-xl bg-[#252525] border border-indigo-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold">
                  Commander Profile
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                  activeFaction.threatLevel === 'Extreme'
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : activeFaction.threatLevel === 'High'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  Threat: {activeFaction.threatLevel}
                </span>
              </div>
              <h4 className="text-lg font-black text-white">{activeFaction.name}</h4>
              <div className="text-xs text-slate-300 font-mono flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>{activeFaction.commander}</span>
              </div>
              <div className="text-xs text-indigo-300 font-medium">
                <strong>Doctrine:</strong> {activeFaction.doctrine}
              </div>
              <div className="pt-2 border-t border-[#333] text-[11px] text-slate-400 italic font-mono bg-[#1f1f1f] p-2.5 rounded">
                {activeFaction.quote}
              </div>
            </div>

            {/* Aeethod Neutralizer */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/40 to-[#252525] border border-indigo-500/40 space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase flex items-center gap-1">
                <Target className="w-3 h-3 text-emerald-400" />
                Aeethod OS Tactical Neutralizer
              </span>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {activeFaction.aeethodCounter}
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Faction Weapons & Arsenal */}
            <div className="p-4 rounded-xl bg-[#252525] border border-[#2e2e2e] space-y-2">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Their Key Arsenal & Strengths</span>
              </span>
              <ul className="space-y-2 text-xs text-slate-300">
                {activeFaction.arsenal.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                    <span className="text-amber-400 shrink-0 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Fatal Flaws & Exploits */}
            <div className="p-4 rounded-xl bg-[#252525] border border-rose-500/20 space-y-2">
              <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>Fatal Weaknesses to Exploit</span>
              </span>
              <ul className="space-y-2 text-xs text-slate-300">
                {activeFaction.vulnerabilities.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                    <span className="text-rose-400 shrink-0 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

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

          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#252525] border border-[#2e2e2e]">
            <button
              onClick={() => {
                setActiveMatrix('sortswift-dilemma');
                setSelectedCell({ row: 0, col: 0 });
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeMatrix === 'sortswift-dilemma'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Aeethod vs. SortSwift
            </button>
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
              The Commission War (BinderPOS)
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

        {/* MATRIX 1: AEETHOD VS SORTSWIFT (SHOPIFY TAX & SCAN-METER TRAP) */}
        {activeMatrix === 'sortswift-dilemma' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 overflow-x-auto">
              <table className="w-full text-center border-collapse text-xs font-mono">
                <thead>
                  <tr>
                    <th className="p-3 text-left font-sans text-slate-400 text-xs">Aeethod \\ SortSwift</th>
                    <th className="p-3 bg-[#252525] text-rose-400 border border-[#2e2e2e]">
                      Maintain Stacked Fees + Scan Limits
                      <span className="block text-[9px] text-slate-400 font-normal">($219 Core + Scans + Shopify)</span>
                    </th>
                    <th className="p-3 bg-[#252525] text-amber-400 border border-[#2e2e2e]">
                      Pivot to Flat SaaS & Drop Shopify
                      <span className="block text-[9px] text-slate-400 font-normal">(Match Flat $195 Model)</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3 text-left font-sans font-bold text-emerald-400 bg-[#252525] border border-[#2e2e2e]">
                      Aeethod: Flat Unlimited SaaS ($195)
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
                      <div className="text-emerald-400 font-bold text-sm">+$1.8M ARR / -$1.2M ARR</div>
                      <div className="text-[10px] text-slate-400">Stores flee SortSwift stacked fee fatigue</div>
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
                      <div className="text-amber-400 font-bold text-sm">+$900k ARR / -$1.5M ARR</div>
                      <div className="text-[10px] text-slate-400">SortSwift cannibalizes own scan & Shopify app revenue</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 text-left font-sans font-bold text-slate-300 bg-[#252525] border border-[#2e2e2e]">
                      Aeethod: Metered Hybrid Pricing
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
                      <div className="text-slate-300 font-bold text-sm">+$600k ARR / -$400k ARR</div>
                      <div className="text-[10px] text-slate-400">Mild differentiation; friction remains</div>
                    </td>
                    <td
                      onClick={() => setSelectedCell({ row: 1, col: 1 })}
                      className={`p-4 border border-[#2e2e2e] cursor-pointer transition ${
                        selectedCell.row === 1 && selectedCell.col === 1
                          ? 'bg-indigo-600/20 border-indigo-500 ring-2 ring-indigo-500'
                          : 'bg-[#202020] hover:bg-[#252525]'
                      }`}
                    >
                      <div className="text-rose-400 font-bold text-sm">-$300k ARR / -$800k ARR</div>
                      <div className="text-[10px] text-slate-400">Mutual margin compression</div>
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
                Why SortSwift is Trapped in the "Shopify Innovator\'s Dilemma":
              </h4>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                SortSwift relies on three separate revenue pillars: base SaaS tiers, à la carte scan credits, and Shopify app store distribution.
              </p>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                If SortSwift matches Aeethod’s flat, unmetered standalone model, they cannibalize 45% of their scan-meter revenue and alienate their Shopify partner ecosystem. If they maintain stacked fees, merchants defect to Aeethod to eliminate the $400/mo Shopify tax.
              </p>
              <div className="pt-2 border-t border-[#2e2e2e] text-[11px] text-emerald-400 font-medium">
                <strong>Equilibrium:</strong> Aeethod has a strictly dominant strategy (Flat Unlimited SaaS) that forces SortSwift into a losing attrition box.
              </div>
            </div>
          </div>
        )}

        {/* MATRIX 2: THE COMMISSION WAR (PRISONER'S DILEMMA OF COMMISSIONS) */}
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

        {/* MATRIX 3: MERCHANT DEFECTION DILEMMA */}
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
                      className="p-4 border border-indigo-500 bg-indigo-600/20 ring-2 ring-indigo-500 relative cursor-pointer"
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

        {/* MATRIX 4: API MONOPSONY */}
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
            By architecting Aeethod from day one as a flat-rate SaaS ($0 commission, zero Shopify tax), our promise is structurally credible. 
            SortSwift and BinderPOS cannot credibly match it because cutting stacked fees and commissions destroys their cash flow.
          </p>
        </div>

        <div className="card p-5 border-[#2e2e2e] bg-[#202020] space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
            <span className="text-base">2️⃣</span>
            <span>Nash Equilibrium in Pricing</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            In our pricing matrix, no player can unilaterally deviate to improve their outcome. For Aeethod, 0% commission and unmetered AI vision 
            is the strictly dominant strategy that maximizes merchant defection from SortSwift and BinderPOS.
          </p>
        </div>

        <div className="card p-5 border-[#2e2e2e] bg-[#202020] space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
            <span className="text-base">3️⃣</span>
            <span>Asymmetric Disruption</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Following Clayton Christensen\'s disruption theory: when incumbents are paralyzed by high-margin revenue addiction (Shopify app fees & 2.5% GMV tax), 
            the entrant wins by providing a simpler, unmetered, flat-rate solution that solves the real operational bottlenecks.
          </p>
        </div>
      </div>
    </div>
  );
};
