import React, { useState } from 'react';
import {
  TrendingUp,
  Target,
  Swords,
  Layers,
  Scale,
  DollarSign,
  BarChart3,
  Network,
  Lock,
  ArrowRight,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Percent,
  Calculator,
  Compass,
  Zap,
  ShieldAlert,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Search,
  BookOpen,
  ArrowUpRight,
  LineChart,
  Server,
  Globe,
  Check,
} from 'lucide-react';
import { useDb, useStore } from '../store';
import { competitorsData, Competitor } from '../lib/competitorsData';
import { CompetitorLandscapeGraph } from '../components/CompetitorLandscapeGraph';
import { FeatureSupplyDemand } from '../components/FeatureSupplyDemand';
import { serviceableFeaturesData, ServiceableFeature } from '../data/serviceableFeatures';
import { navigate, href } from '../lib/router';
import { fmtMoney } from '../lib/metrics';
import { TcgMarketEconomicsTerminal } from '../components/TcgMarketEconomicsTerminal';

export const EconomicsView: React.FC = () => {
  const db = useDb();
  const { setOpenTask, theme } = useStore();
  const isLight = theme === 'light';

  const [activeTab, setActiveTab] = useState<'climate' | 'tcg-market' | 'micro-topics' | 'features' | 'profiles'>('tcg-market');

  const [selectedTopic, setSelectedTopic] = useState<string>('scarcity');
  const [inspectedCompetitor, setInspectedCompetitor] = useState<Competitor | null>(null);

  // Expanded state for features
  const [expandedFeatures, setExpandedFeatures] = useState<Record<string, boolean>>({});
  const [featureSearch, setFeatureSearch] = useState<string>('');
  const [featureElasticityFilter, setFeatureElasticityFilter] = useState<'all' | 'Inelastic' | 'Unit Elastic' | 'Hyper-Elastic'>('all');
  const [simulatedTier, setSimulatedTier] = useState<99 | 149 | 249>(149);

  // Economic target profiles from tasks
  const profileTasks = db.tasks.filter(
    (t) => t.topicId === 'economics' && t.tags?.includes('customer-profile')
  );

  // Core theoretical microeconomics topics
  const microTopics = [
    {
      id: 'scarcity',
      name: 'Scarcity & Print Dynamics',
      tag: 'Supply & Value',
      icon: '💎',
      summary: 'Physical supply caps, graded population pyramids, and reprint depreciation risk.',
      formula: 'P = f(Q_{printed}, R_{rate}, Pop_{PSA10}, D_{meta})',
      coreAnalysis: `In the TCG market, economic scarcity exists on three distinct layers:
1. **Absolute Manufacturing Scarcity**: Hasbro/Wizards of the Coast and The Pokémon Company engineer artificial supply constraints through serialized cards (e.g., 1-of-1 The One Ring, 1-of-500 serialized foils). Print runs are strictly confidential, creating intense speculation.
2. **Graded Condition Scarcity (Population Pyramids)**: A raw card worth $50 can trade at $1,200 if graded PSA 10 Gem Mint. Condition grading creates an exponential scarcity multiplier where top-grade supply is permanently inelastic.
3. **Reprint Risk & Depreciation Shock**: Unlike traditional commodities, card publishers hold absolute monopoly power over the money supply. When a staple card is reprinted in a 'Masters' set, market supply shifts outward instantly, causing 50%–80% price collapses overnight. Stores holding inventory face brutal mark-to-market write-downs.`,
      tradeoff: 'Stores must balance carrying deep single inventory against the perpetual catastrophic tail-risk of unannounced publisher reprints.',
    },
    {
      id: 'choice-tradeoffs',
      name: 'Choice & Economic Tradeoffs',
      tag: 'Strategic Frontier',
      icon: '⚖️',
      summary: 'Margin vs Velocity frontier: Self-hosted Shopify (0% fee, zero foot traffic) vs TCGplayer (13% fee, instant liquidity).',
      formula: 'Net Return = P \\times (1 - Commission) \\times V - HoldingCost',
      coreAnalysis: `Every card merchant operates along a Pareto frontier between Margin and Velocity:
- **High Margin / Low Velocity (Self-Hosted Storefront)**: Selling via your own Shopify store keeps 100% of the sale price (0% commission). However, customer acquisition cost (CAC) is high and organic foot traffic is low. Singles sit in inventory binders for an average of 42–90 days.
- **Low Margin / High Velocity (TCGplayer Marketplace)**: Listing on TCGplayer provides instant liquidity from millions of active buyers, but extracts a punishing 10.25% to 13.5% take-rate. High velocity comes at the cost of compressed gross margins.
- **Raw vs Graded Arbitrage**: Holding raw inventory gives fast retail turnover. Sending cards to PSA/CGC incurs $15–$25 grading fees, 45-day capital lockup, and risk of returning an 8 or 9 (wiping out the premium).`,
      tradeoff: 'Holding cards at full TCG Market price maximizes theoretical asset value but consumes working capital; liquidating at TCG Low maximizes cash turnover at margin sacrifice.',
    },
    {
      id: 'incentives',
      name: 'Incentives & Agency Problems',
      tag: 'Behavioral Economics',
      icon: '🎯',
      summary: 'Asymmetric buyer vs seller incentives, buylist store credit retention locks, and consignment splits.',
      formula: 'U_{store} = \\Delta Margin + LiquidityRetention',
      coreAnalysis: `Market participants respond to strong economic incentives:
- **Buylist Store Credit Locks (+20% to +30% Bonus)**: LGS offer a 20%–30% premium when paying for trade-ins with store credit rather than cash (e.g., $100 cash vs $130 store credit). Economically, this locks merchant working capital inside the store's micro-economy, creates a guaranteed 40%+ gross margin on the secondary purchase, and accelerates customer lifetime value (LTV).
- **Platform Bias (TCGplayer Direct Consignment)**: TCGplayer incentivizes sellers to participate in 'Direct' by taking over shipping and authentication, but charges an elevated take-rate. Sellers trade agency and pricing independence for guaranteed buybox positioning.
- **Employee Intakes**: Store clerks facing high intake volumes have an incentive to rush condition grading, creating adverse selection where damaged cards enter inventory as Near Mint.`,
      tradeoff: 'Cash payouts deplete store bank balances; store credit preserves cashflow but inflates store balance-sheet liabilities.',
    },
    {
      id: 'pricing-elasticity',
      name: 'Pricing Dynamics & Elasticity',
      tag: 'Price Sensitivity',
      icon: '📈',
      summary: 'Empirical price elasticity of card singles: Inelastic tournament staples vs hyper-elastic bulk.',
      formula: '\\epsilon_d = \\frac{\\% \\Delta Q}{\\% \\Delta P}',
      coreAnalysis: `Price elasticity of demand (\\(\\epsilon_d\\)) in TCG varies drastically by product archetype:
- **Tournament Staples (Inelastic, \\(\\epsilon_d \\approx -0.3\\) to \\(-0.5\\))**: Competitive players must own 4 copies of dominant cards to compete in Regional/Pro Tour events. A price increase from $40 to $65 does not reduce demand because substitutes do not exist in the tournament meta.
- **Collector / High-End Cards (Unit Elastic, \\(\\epsilon_d \\approx -1.0\\))**: WTP is dictated by disposable income and alternative hobby allocations.
- **Bulk & Mid-Tier Singles (Hyper-Elastic, \\(\\epsilon_d < -2.2\\))**: Buyers will immediately switch sellers over a $0.05 price discrepancy. Auto-repricing algorithms that blindly undercut competitors create a ruinous 'race to the bottom' that destroys merchant gross margin.
- **Price Floor Defense**: Smart retailers enforce mathematical price floors ($P_{floor} = P_{intake} \\times 1.35$) to prevent algorithmic downward spirals.`,
      tradeoff: 'Lowering price by 5% might win the buybox for an hour, but triggers competitor algorithmic price-matching that permanently resets market clearing price lower.',
    },
    {
      id: 'market-structure',
      name: 'Market Structure & Platform Monopsony',
      tag: 'Industrial Organization',
      icon: '🏛️',
      summary: 'Oligopolistic platform gateway (eBay/TCGplayer) controlling 70%+ US volume vs 18,000 fragmented retail fringe.',
      formula: 'HHI = \\sum s_i^2 > 3,800 \\text{ (Highly Concentrated Gateway)}',
      coreAnalysis: `The TCG secondary market exhibits an industrial structure of **Platform Monopsony & Gateway Monopoly**:
1. **The Core Gateway (TCGplayer owned by eBay)**: Controls over 70% of North American online singles liquidity. Because consumers congregate there for universal search, merchants are economically coerced into listing inventory on the platform despite 10%–13% fees.
2. **The Fragmented Retail Fringe**: ~18,000 independent local game stores and high-volume dealers compete as price-takers. Individual stores have zero market power against the platform gateway.
3. **Contestable Market Disruption**: Because BinderPOS paused signups in Feb 2025 and charges a 2.5% GMV tax, the retail software layer is ripe for disruption by Aeethod's flat-rate, 0% commission architecture.`,
      tradeoff: 'Stores cannot afford to leave TCGplayer completely without sacrificing 40%+ of sales; the optimal strategy is using Aeethod to divert repeat customers to their 0% commission direct channel.',
    },
    {
      id: 'network-effects',
      name: 'Network Effects & Catalog Moats',
      tag: 'Flywheel Moats',
      icon: '🌐',
      summary: '2-Sided marketplace liquidity vs universal card catalog metadata standards.',
      formula: 'V \\propto N^2 \\text{ (Metcalfe\'s Law applied to single-card liquidity)}',
      coreAnalysis: `Network effects create the primary barrier to entry in the TCG industry:
- **Two-Sided Liquidity**: Buyers shop where all singles are in stock (maximizing cart optimization to save shipping); sellers list where buyers shop. This creates an entrenched liquidity moat for incumbent marketplaces.
- **Card Catalog Metadata Standard (The Hidden Moat)**: There are over 100,000 distinct MTG cards, 30,000 Pokémon cards, and endless variants (foils, etched, reverse, alternate art, promo stamps). Building and maintaining a pristine, daily-updated relational card catalog is an immense technical barrier. Competitors that lack automated catalog ingest fail within months.
- **Aeethod\'s Open Catalog Strategy**: By delivering universal catalog synchronization out-of-the-box, Aeethod democratizes the metadata layer, breaking the proprietary data lock-in that BinderPOS and TCGplayer rely upon.`,
      tradeoff: 'Building a proprietary card catalog requires massive maintenance overhead; syndicating open catalog data empowers merchants to own their database forever.',
    },
    {
      id: 'switching-costs',
      name: 'Switching Costs & Lock-in Dynamics',
      tag: 'Frictional Inertia',
      icon: '🔒',
      summary: 'Why stores stay on painful legacy software: 100,000 SKUs trapped, barcode inertia, and Shopify handle sync.',
      formula: 'Switching Barrier = BarcodeReindexing + HistoricalDataLoss + StaffRetraining',
      coreAnalysis: `Switching costs in TCG retail are among the highest in any B2B SaaS vertical:
1. **Catalog Re-indexing Friction**: A typical LGS has 50,000 to 250,000 individual cards indexed under proprietary BinderPOS or CrystalCommerce internal IDs. Migrating to a new platform manually would require months of clerk labor.
2. **Physical Barcode Inertia**: Cards in physical display cases and binder sleeves are stickered with specific barcodes. Re-tagging 100,000 cards is physically impossible for small teams.
3. **Shopify Product Handle Desynchronization**: If migration alters Shopify product URLs, stores lose years of built-up Google SEO equity and customer bookmarks.
4. **Aeethod\'s Wedge Solution**: Aeethod provides an automated 24-hour lossless ETL database importer that translates legacy BinderPOS barcodes directly into Aeethod OS with zero re-stickering required.`,
      tradeoff: 'Staying on BinderPOS costs $1,500–$3,500/month in commission taxes; switching requires 1 day of guided onboarding with Aeethod.',
    },
    {
      id: 'scaling-forecasting',
      name: 'Scaling, Forecasting & Release Cycles',
      tag: 'Macro Sizing',
      icon: '📊',
      summary: 'Quarterly booster release cash conversion cycles, working capital allocation, and seasonal peaks.',
      formula: 'WorkingCapital_{required} = PreorderAllocation + IntakeBuffer - ARPU_{inflow}',
      coreAnalysis: `TCG retail revenue is heavily cyclical, dictated by publisher set releases:
- **The Quarterly Release Wave**: Every 8–10 weeks, Wizards of the Coast, Pokémon, or Bandai releases a tentpole booster set. Stores generate 35%–50% of quarterly revenue in the first 14 days of a set launch.
- **The Pre-order Working Capital Trap**: Distributors require stores to lock in and pay for distributor allocations 3 to 5 months before release. If a set underperforms (e.g., poor meta gameplay or weak collector appeal), store working capital is trapped in depreciating booster boxes.
- **Inventory Depreciation Half-life**: The value of opened card singles peaks on Day 3 of release and decays by 40%–60% by Day 45 as global booster opening floods the market. Forecasting sell-through velocity is the #1 predictor of LGS solvency.`,
      tradeoff: 'Ordering large distributor allocations unlocks tier-1 wholesale pricing but exposes the business to massive inventory balance-sheet impairment if the set flops.',
    },
    {
      id: 'demand-supply',
      name: 'Demand, Supply & Equilibrium Spikes',
      tag: 'Market Clearing',
      icon: '⚡',
      summary: 'Release day shortage spikes, post-hype surplus collapse, and dead stock liquidation velocity.',
      formula: 'P^*(t) = \\lim_{t \\to \\infty} (MC_{production} + Markup) \\ll P_{launch}',
      coreAnalysis: `Price formation in TCG cards undergoes a violent 3-phase lifecycle:
1. **Launch Shortage Spike (\\(t = 0\\) to \\(14\\) days)**: Demand severely exceeds circulating supply. Players needing cards for upcoming tournaments exhibit extreme, price-inelastic WTP. Prices surge 200%–400% above expected value.
2. **Supply Influx & Equilibrium Discovery (\\(t = 15\\) to \\(60\\) days)**: Millions of packs are cracked worldwide. Singles supply curve shifts outward rapidly. Price plummets toward true economic equilibrium.
3. **Surplus Glut & Dead Stock (\\(t > 60\\) days)**: 95% of cards in any booster set are non-playable 'bulk'. Without automated buylist margins and bulk bundling, stores accumulate massive physical cubic footage of unsellable inventory.`,
      tradeoff: 'Listing cards on release weekend captures maximum surplus; waiting 30 days risks holding inventory at 50% loss.',
    },
    {
      id: 'wtp-archetypes',
      name: 'WTP & Merchant Price Sensitivity',
      tag: 'Customer Micro-Economics',
      icon: '💵',
      summary: 'Empirical WTP across the 5 commercial retail archetypes and price sensitivity to commission taxes.',
      formula: 'Surplus_{merchant} = WTP_{archetype} - Price_{Aeethod}',
      coreAnalysis: `Willingness to Pay (WTP) for software varies systematically across merchant profiles:
- **Profile 1: Indie Single-Store LGS**: WTP is $140/mo. At Aeethod's $99/mo starter price, the merchant captures **+$41/mo consumer surplus**. Highly sensitive to setup fees.
- **Profile 2: High-Volume Premier LGS (WPN Premium)**: WTP is $500/mo. They process $80,000/mo in GMV. On BinderPOS (2.5%), they bleed $2,000/mo. At Aeethod's $299/mo Pro tier, they capture **+$201/mo software surplus** plus **+$1,701/mo in avoided commissions**!
- **Profile 3: Warehouse PowerSeller**: WTP is $350/mo. Pure e-commerce speed and API stability are everything.
- **Profile 4: Multi-Store Regional Chain**: WTP is $1,200/mo. Needs multi-location sync, central warehouse transfers, and granular employee permissions.
- **Profile 5: Traveling Show Dealer**: WTP is $180/mo. Needs offline iPad POS mode with zero latency in convention center dead zones.`,
      tradeoff: 'Commission pricing punishes high-volume stores; flat-rate pricing creates massive consumer surplus that turns stores into passionate brand evangelists.',
    },
    {
      id: 'marginal-analysis',
      name: 'Marginal Analysis & Scanning Velocity',
      tag: 'Operational Calculus',
      icon: '🔬',
      summary: 'Marginal Cost (MC) of cataloging card N+1 vs Marginal Revenue (MR). The 15-second scanning threshold.',
      formula: 'MC_{card} = \\frac{Wage_{clerk}}{CardsPerHour} \\le MR_{card} = P \\times Margin',
      coreAnalysis: `The fundamental microeconomic bottleneck of a card store is clerk labor:
- **The Manual Labor Cost**: If a clerk earning $16/hr manually types card names, sets, condition, and edition, they process ~60 cards/hour ($0.27 labor cost per card). Any card priced under $1.00 is economically unprofitable to catalog!
- **The AI Vision Scanning Revolution**: With camera-based AI scanning (processing 600 cards/hour), marginal labor cost drops to $0.027 per card. Cards priced at $0.25–$0.50 suddenly become profitable inventory.
- **Profit Maximization Condition (\\(MR = MC\\))**: A store should continue cataloging singles until the marginal revenue from selling card \\(N\\) equals the marginal cost of scanning, sorting, and shelving it.`,
      tradeoff: 'Investing in automated optical scanning lowers marginal cost, shifting the zero-profit threshold from $1.50 cards down to $0.25 bulk singles.',
    },
    {
      id: 'information-asymmetry',
      name: 'Information Asymmetry & Lemons Problem',
      tag: 'Market Failures',
      icon: '🔍',
      summary: 'Akerlof\'s Market for Lemons in card condition grading, counterfeit risks, and undisclosed print runs.',
      formula: 'P_{market} = q \\times P_{NM} + (1 - q) \\times P_{LP} \\text{ (Lemons Discount)}',
      coreAnalysis: `Information asymmetry plagues the secondary card market:
1. **The Card Condition 'Lemons Problem'**: Buyers cannot inspect raw cards physically before buying online. Sellers have an incentive to misclassify Lightly Played (LP) cards as Near Mint (NM) to capture a 20% price premium. Without trusted verification, buyers discount all online raw cards, depressing market-clearing prices.
2. **Counterfeit Infiltration**: High-value vintage cards (Black Lotus, Base Set Charizard) face sophisticated Chinese counterfeit proxies. LGS without digital inspection and micro-surface magnification risk acquiring worthless fakes.
3. **Publisher Asymmetry**: Wizards of the Coast and Pokémon possess complete knowledge of future print volumes, secret lair print runs, and ban-list timelines. Retailers trade with incomplete information, constantly exposed to regulatory shocks.`,
      tradeoff: 'Strict condition grading increases customer trust and repeat orders, but increases intake rejection rate on buylist submissions.',
    },
    {
      id: 'consumer-surplus',
      name: 'Consumer & Producer Surplus (Deadweight Loss)',
      tag: 'Welfare Economics',
      icon: '📐',
      summary: 'How 2.5% GMV commission taxes generate deadweight loss, and how Aeethod unlocks maximum economic surplus.',
      formula: 'DeadweightLoss = \\frac{1}{2} \\times \\tau \\times \\Delta Q \\text{ (Tax Distortion)}',
      coreAnalysis: `Welfare economics demonstrates the destructive impact of commission taxes:
- **The Legacy Tax Distortion**: When legacy platforms (BinderPOS, CrystalCommerce) impose a 2.0%–2.5% tax on singles GMV on top of payment processing (2.9%) and marketplace fees (10%–13%), total friction reaches 15%–18% of gross retail turnover.
- **Deadweight Loss (DWL)**: This artificial wedge raises the effective cost of commerce, pushing marginal transactions out of the market. High-volume, low-margin transactions (e.g. bulk singles, sealed cases with 8% gross margins) are abandoned because the software tax exceeds the merchant's net profit!
- **Aeethod Surplus Expansion**: By charging a flat monthly fee ($99–$299/mo) and $0 commission, Aeethod eliminates the marginal tax on volume. Every additional dollar of singles sold flows 100% to merchant producer surplus!`,
      tradeoff: 'Commission pricing extracts value from store success; flat-rate pricing aligns incentives by rewarding store growth with expanding margins.',
    },
  ];

  // Serviceable Features imported from data
  const serviceableFeatures = serviceableFeaturesData;

  const toggleFeatureExpand = (id: string) => {
    setExpandedFeatures((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAllFeatures = () => {
    const allExp: Record<string, boolean> = {};
    serviceableFeaturesData.forEach((f) => {
      allExp[f.id] = true;
    });
    setExpandedFeatures(allExp);
  };

  const collapseAllFeatures = () => {
    setExpandedFeatures({});
  };

  const filteredFeatures = serviceableFeaturesData.filter((feat) => {
    if (featureElasticityFilter !== 'all' && feat.elasticityType !== featureElasticityFilter) {
      return false;
    }
    if (featureSearch.trim()) {
      const q = featureSearch.toLowerCase();
      return (
        feat.name.toLowerCase().includes(q) ||
        feat.category.toLowerCase().includes(q) ||
        feat.economicRole.toLowerCase().includes(q) ||
        feat.featureDetails.overview.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const currentTopic = microTopics.find((t) => t.id === selectedTopic) || microTopics[0];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-slide-in">
      {/* Top Banner & Game Theory CTA */}
      <div className="card p-6 border-indigo-500/30 bg-[#202020] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 uppercase tracking-wider font-mono">
              TCG Microeconomics & Industry Intelligence
            </span>
            <span className="text-xs text-slate-400">• Full Market Structure & Competitive Dynamics</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Microeconomic Climate, Competitor Mapping & Industry Economics
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            Exhaustive structural analysis of the TCG retail ecosystem—from platform monopsonies and deadweight loss 
            to empirical price elasticities, scarcity mechanics, and competitor positioning.
          </p>
        </div>

        {/* Game Theory CTA Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full lg:w-auto">
          <button
            onClick={() => navigate('/game-theory')}
            className="btn-primary text-xs px-5 py-3 shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2.5 group"
          >
            <span className="text-base">♟️</span>
            <div className="text-left">
              <div className="font-bold">Play Game Theory War Room</div>
              <div className="text-[10px] text-indigo-200 font-normal">Execute moves & simulate competitor reactions</div>
            </div>
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Main Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 border-b border-[#2e2e2e] pb-3 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('tcg-market')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition shrink-0 ${
            activeTab === 'tcg-market'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-white hover:bg-[#252525]'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-emerald-300" />
          <span>🔴 TCG Market & Retail Dynamics Terminal</span>
        </button>

        <button
          onClick={() => setActiveTab('climate')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition shrink-0 ${
            activeTab === 'climate'
              ? 'bg-[#2c2c2c] text-white shadow-xs'
              : 'text-slate-400 hover:text-white hover:bg-[#252525]'
          }`}
        >
          <Compass className="w-4 h-4 text-cyan-400" />
          <span>Market Situation & 2D Competitor Graph</span>
        </button>

        <button
          onClick={() => setActiveTab('micro-topics')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition shrink-0 ${
            activeTab === 'micro-topics'
              ? 'bg-[#2c2c2c] text-white shadow-xs'
              : 'text-slate-400 hover:text-white hover:bg-[#252525]'
          }`}
        >
          <Scale className="w-4 h-4 text-indigo-400" />
          <span>13 Microeconomic Topics ({microTopics.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('features')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition shrink-0 ${
            activeTab === 'features'
              ? 'bg-[#2c2c2c] text-white shadow-xs'
              : 'text-slate-400 hover:text-white hover:bg-[#252525]'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-400" />
          <span>Serviceable Features & Competitor Matrix ({serviceableFeatures.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profiles')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition shrink-0 ${
            activeTab === 'profiles'
              ? 'bg-[#2c2c2c] text-white shadow-xs'
              : 'text-slate-400 hover:text-white hover:bg-[#252525]'
          }`}
        >
          <Target className="w-4 h-4 text-emerald-400" />
          <span>5 Commercial Target Profiles (WTP)</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 0: TCG MACRO & RETAIL MARKET INTELLIGENCE TERMINAL                   */}
      {/* ========================================================================= */}
      {activeTab === 'tcg-market' && (
        <TcgMarketEconomicsTerminal isLight={isLight} />
      )}

      {/* ========================================================================= */}
      {/* TAB 1: CLIMATE & COMPETITOR MAPPING GRAPH                                */}
      {/* ========================================================================= */}
      {activeTab === 'climate' && (

        <div className="space-y-8 animate-slide-in">
          {/* Executive Microeconomic Squeeze Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="card p-4 space-y-1 border-rose-500/30 bg-[#202020]">
              <div className="flex items-center justify-between text-xs text-rose-400 font-bold uppercase tracking-wider">
                <span>The 2.5% GMV Trap</span>
                <Flame className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-2xl font-black text-white font-mono">$1,500 – $4k</div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Monthly revenue extracted from an active store by BinderPOS & legacy POS providers on top of base fees.
              </p>
            </div>

            <div className="card p-4 space-y-1 border-purple-500/30 bg-[#202020]">
              <div className="flex items-center justify-between text-xs text-purple-400 font-bold uppercase tracking-wider">
                <span>BinderPOS Signup Freeze</span>
                <Lock className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-black text-purple-300 font-mono">Frozen</div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Signups halted since Feb 2025. Stores opening this year have no access to legacy incumbent software.
              </p>
            </div>

            <div className="card p-4 space-y-1 border-indigo-500/30 bg-[#202020]">
              <div className="flex items-center justify-between text-xs text-indigo-400 font-bold uppercase tracking-wider">
                <span>Platform Gateway Cut</span>
                <Scale className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-black text-white font-mono">10.25% – 13.5%</div>
              <p className="text-[11px] text-slate-400 leading-snug">
                TCGplayer/eBay take-rate. Leaving retail stores with only 4%–7% net margins unless diverted to direct SaaS.
              </p>
            </div>

            <div className="card p-4 space-y-1 border-emerald-500/30 bg-[#202020]">
              <div className="flex items-center justify-between text-xs text-emerald-400 font-bold uppercase tracking-wider">
                <span>Aeethod Wedge Surplus</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-emerald-400 font-mono">0% Commission</div>
              <p className="text-[11px] text-slate-400 leading-snug">
                $99–$299/mo flat SaaS. Returns 100% of marginal volume surplus directly to store owner balance sheets.
              </p>
            </div>
          </div>

          {/* Interactive Cartesian Perceptual Graph */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Compass className="w-4 h-4 text-cyan-400" />
                  <span>Interactive Competitor Perceptual Graph</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Cartesian coordinate mapping of all 26 TCG inventory platforms across dual economic spectrums.
                </p>
              </div>
              <button
                onClick={() => navigate('/competitors')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
              >
                <span>View Full 26 Competitor Directory</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <CompetitorLandscapeGraph
              competitors={competitorsData}
              onInspect={(comp) => setInspectedCompetitor(comp)}
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: DEEP MICROECONOMIC TOPICS ENGINE                                  */}
      {/* ========================================================================= */}
      {activeTab === 'micro-topics' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-slide-in">
          {/* Left Column: Topics Navigation List */}
          <div className="lg:col-span-4 space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1 pb-1">
              Select Microeconomic Discipline
            </div>

            <div className="space-y-1.5 max-h-[720px] overflow-y-auto pr-1">
              {microTopics.map((topic) => {
                const isSelected = selectedTopic === topic.id;
                return (
                  <div
                    key={topic.id}
                    onClick={() => setSelectedTopic(topic.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition select-none flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'border-indigo-500/60 bg-[#2c2c2c] text-white shadow-xs'
                        : 'border-[#2e2e2e] bg-[#202020] text-slate-300 hover:bg-[#252525] hover:border-[#3e3e3e]'
                    }`}
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{topic.icon}</span>
                        <span className="text-xs font-bold truncate">{topic.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 line-clamp-1">{topic.summary}</div>
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0 font-medium">
                      {topic.tag}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Detailed Topic Deep-Dive Card */}
          <div className="lg:col-span-8 card p-6 border-[#2e2e2e] bg-[#202020] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2e2e2e] pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{currentTopic.icon}</span>
                  <h2 className="text-xl font-black text-white tracking-tight">{currentTopic.name}</h2>
                </div>
                <div className="text-xs text-indigo-400 font-mono font-medium">{currentTopic.tag}</div>
              </div>

              {/* Formula Badge */}
              <div className="p-2.5 rounded-lg bg-[#252525] border border-[#2e2e2e] font-mono text-xs text-emerald-400 shrink-0 self-start sm:self-auto">
                <span className="text-slate-500 block text-[9px] uppercase font-bold">Formal Mathematical Relation</span>
                <span>{currentTopic.formula}</span>
              </div>
            </div>

            {/* Core Analysis Breakdown */}
            <div className="space-y-4">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                <span>Microeconomic Mechanics & TCG Applied Calculus</span>
              </div>
              <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line font-sans space-y-2 bg-[#252525] p-5 rounded-xl border border-[#2e2e2e]">
                {currentTopic.coreAnalysis}
              </div>
            </div>

            {/* The Critical Tradeoff Callout */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 space-y-1.5">
              <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Scale className="w-3.5 h-3.5 text-amber-400" />
                <span>The Core Economic Tradeoff</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentTopic.tradeoff}
              </p>
            </div>

            {/* Actionable Strategic Advice for Aeethod */}
            <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/25 space-y-1.5">
              <div className="text-xs font-bold text-cyan-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Aeethod Strategic Capitalization</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                By understanding this microeconomic dynamic, Aeethod designs features that exploit competitor vulnerabilities—turning 
                unannounced reprint risk, high switching friction, and information asymmetry into direct SaaS conversion vectors.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: SERVICEABLE FEATURES & COMPETITOR COMPARISON MATRIX               */}
      {/* ========================================================================= */}
      {activeTab === 'features' && (
        <div className="space-y-8 animate-slide-in">
          {/* ===================================================================== */}
          {/* 1. FEATURE ELASTICITY FILTERS (CLICK TO FILTER FEATURE LIST BELOW)     */}
          {/* ===================================================================== */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-slate-500 text-[11px] font-mono flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                <span>Feature Elasticity Filters (Filter {serviceableFeatures.length} Serviceable Features)</span>
              </span>
              {featureElasticityFilter !== 'all' && (
                <button
                  onClick={() => setFeatureElasticityFilter('all')}
                  className="text-indigo-400 hover:text-indigo-300 font-mono text-[11px]"
                >
                  Reset Filter (Show All {serviceableFeatures.length})
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 1. Inelastic Band */}
              <div
                onClick={() => setFeatureElasticityFilter(featureElasticityFilter === 'Inelastic' ? 'all' : 'Inelastic')}
                className={`p-4 rounded-xl border transition cursor-pointer select-none space-y-2.5 ${
                  featureElasticityFilter === 'Inelastic'
                    ? 'bg-indigo-500/15 border-indigo-500/60 shadow-sm'
                    : 'bg-[#252525] border-[#2e2e2e] hover:border-slate-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" />
                    <span>1. Inelastic Essentials</span>
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    ε = -0.32 to -0.62
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Zero Substitutes</strong>: Inventory Sync, POS Register, Buylist Portal, AI Scanner. Stores cannot open doors without them; extremely low churn even under price increases.
                </p>
                <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between border-t border-[#2e2e2e] pt-2">
                  <span>Pricing Power:</span>
                  <span className="text-emerald-400 font-bold">Maximal (Core Retention)</span>
                </div>
              </div>

              {/* 2. Unit Elastic Band */}
              <div
                onClick={() => setFeatureElasticityFilter(featureElasticityFilter === 'Unit Elastic' ? 'all' : 'Unit Elastic')}
                className={`p-4 rounded-xl border transition cursor-pointer select-none space-y-2.5 ${
                  featureElasticityFilter === 'Unit Elastic'
                    ? 'bg-emerald-500/15 border-emerald-500/60 shadow-sm'
                    : 'bg-[#252525] border-[#2e2e2e] hover:border-slate-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    <span>2. Unit Elastic Drivers</span>
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    ε = -0.88 to -1.25
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Direct ROI Levers</strong>: Custom Storefront, Dynamic Autopricer, 1-Click Decklists, Batch Pick Lists. Stores pay when ROI is 3x–5x, but refuse percentage revenue taxes.
                </p>
                <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between border-t border-[#2e2e2e] pt-2">
                  <span>Pricing Power:</span>
                  <span className="text-cyan-400 font-bold">Optimal Flat ($149/mo)</span>
                </div>
              </div>

              {/* 3. Hyper-Elastic Band */}
              <div
                onClick={() => setFeatureElasticityFilter(featureElasticityFilter === 'Hyper-Elastic' ? 'all' : 'Hyper-Elastic')}
                className={`p-4 rounded-xl border transition cursor-pointer select-none space-y-2.5 ${
                  featureElasticityFilter === 'Hyper-Elastic'
                    ? 'bg-rose-500/15 border-rose-500/60 shadow-sm'
                    : 'bg-[#252525] border-[#2e2e2e] hover:border-slate-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5" />
                    <span>3. Hyper-Elastic Tools</span>
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    ε &lt; -1.80
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Discretionary Luxury</strong>: Slabs Speculation, Consignment Engine, Niche Analytics. Dropped during slow quarters if unbundled. Aeethod bundles them to kill competitors!
                </p>
                <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between border-t border-[#2e2e2e] pt-2">
                  <span>Pricing Power:</span>
                  <span className="text-amber-400 font-bold">Bundle as Moat Feature</span>
                </div>
              </div>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* 2. SEARCH, FILTER & EXPAND ALL CONTROLS                                */}
          {/* ===================================================================== */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Serviceable Features Matrix ({filteredFeatures.length} of {serviceableFeatures.length})</span>
              </h3>
              <p className="text-xs text-slate-400">
                Click any feature card to expand deep-dive technical workflows, competitor teardowns, and unit economics.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Search input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={featureSearch}
                  onChange={(e) => setFeatureSearch(e.target.value)}
                  placeholder="Filter features..."
                  className="input pl-8 py-1 text-xs w-48 bg-[#202020] border-[#2e2e2e]"
                />
              </div>

              {/* Global Expand / Collapse */}
              <button
                onClick={expandAllFeatures}
                className="btn-secondary text-[11px] py-1 px-2.5"
                title="Expand all feature details"
              >
                Expand All
              </button>
              <button
                onClick={collapseAllFeatures}
                className="btn-secondary text-[11px] py-1 px-2.5 text-slate-400"
                title="Collapse all feature details"
              >
                Collapse All
              </button>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* 3. EXPANDABLE FEATURE CARDS WITH DEEP-DIVE PANELS                    */}
          {/* ===================================================================== */}
          <div className="space-y-4">
            {filteredFeatures.map((feat) => {
              const isExpanded = expandedFeatures[feat.id] ?? false;

              return (
                <div
                  key={feat.id}
                  className={`card border transition overflow-hidden ${
                    isExpanded
                      ? 'border-indigo-500/50 bg-[#202020] shadow-md'
                      : 'border-[#2e2e2e] bg-[#202020] hover:border-slate-600'
                  }`}
                >
                  {/* Collapsed Header / Summary Row (Click to toggle) */}
                  <div
                    onClick={() => toggleFeatureExpand(feat.id)}
                    className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 cursor-pointer hover:bg-[#242424] transition select-none"
                  >
                    <div className="space-y-1 min-w-0 max-w-2xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-base">{feat.icon}</span>
                        <h4 className="text-sm font-bold text-white hover:text-indigo-300 transition">
                          {feat.name}
                        </h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                          {feat.category}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          {feat.onlineModel}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                            feat.elasticityType === 'Inelastic'
                              ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                              : feat.elasticityType === 'Unit Elastic'
                              ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                              : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                          }`}
                        >
                          {feat.elasticity}
                        </span>
                        {feat.marketGap && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 hidden sm:inline-flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                            <span>Gap: {feat.marketGap.gapPercentage}% Unserved</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-2">{feat.economicRole}</p>
                    </div>

                    {/* Pricing & Supply/Demand Microeconomic Pill Row */}
                    <div className="flex items-center gap-3.5 shrink-0">
                      <div className="text-right">
                        <div className="text-[9px] uppercase font-bold text-slate-500 font-mono">Demand (WTP)</div>
                        <div className="text-xs font-bold font-mono text-emerald-400">{feat.merchantWtp.split('/')[0]}</div>
                      </div>

                      <div className="text-right hidden sm:block">
                        <div className="text-[9px] uppercase font-bold text-slate-500 font-mono">Supply (MC)</div>
                        <div className="text-xs font-bold font-mono text-indigo-400">
                          ${feat.supplyDemandModel?.marginalCost.toFixed(2) || '1.40'}/mo
                        </div>
                      </div>

                      <div className="text-right hidden md:block">
                        <div className="text-[9px] uppercase font-bold text-slate-500 font-mono">Competitor</div>
                        <div className="text-xs font-bold font-mono text-rose-400 line-clamp-1 max-w-[120px] truncate" title={feat.competitorsPrice}>
                          {feat.competitorsPrice.split('(')[0]}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-[9px] uppercase font-bold text-cyan-400 font-mono">Aeethod Flat</div>
                        <div className="text-xs font-bold font-mono text-cyan-300">{feat.suggestedPrice.split('(')[0]}</div>
                      </div>

                      <div className="text-right hidden lg:block">
                        <div className="text-[9px] uppercase font-bold text-emerald-400 font-mono">Store Surplus</div>
                        <div className="text-xs font-bold font-mono text-emerald-300">
                          +${feat.supplyDemandModel?.consumerSurplusPerStore || 150}/mo
                        </div>
                      </div>

                      <div className="text-right hidden xl:block">
                        <div className="text-[9px] uppercase font-bold text-amber-400 font-mono">Unserved Gap</div>
                        <div className="text-xs font-bold font-mono text-amber-300">
                          +{feat.marketGap?.unservedStores.toLocaleString() || 1400} Stores
                        </div>
                      </div>

                      <div className="p-1 rounded-md bg-[#282828] text-slate-400 hover:text-white transition ml-1">
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-indigo-400" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* ================================================================= */}
                  {/* EXPANDED DEEP-DIVE ACCORDION PANEL                               */}
                  {/* ================================================================= */}
                  {isExpanded && (
                    <div className="border-t border-[#2e2e2e] feature-accordion-panel p-6 space-y-6 animate-slide-in select-text">
                      {/* Sub-Section 1: Feature Architecture & 100% Online Cloud Workflow */}
                      <div className="space-y-3">
                        <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                          <Server className="w-3.5 h-3.5 text-indigo-400" />
                          <span>1. Cloud SaaS Architecture & Operational Workflow</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 ml-auto">
                            Zero Proprietary Hardware Required
                          </span>
                        </div>
                        <div className="p-4 rounded-xl feature-inner-box border border-[#2e2e2e] space-y-3 text-xs">
                          <p className="text-slate-300 leading-relaxed font-sans">
                            {feat.featureDetails.overview}
                          </p>
                          <div className="p-3 rounded-lg feature-step-pill border border-[#2e2e2e] text-[11px] text-slate-400 font-mono">
                            <span className="text-indigo-400 font-bold block mb-1">Cloud Infrastructure:</span>
                            {feat.featureDetails.cloudArchitecture}
                          </div>

                          {/* 4-Step Workflow */}
                          <div className="space-y-1.5 pt-1">
                            <span className="text-[11px] uppercase font-bold text-slate-400 font-mono block">
                              End-to-End Operational Workflow:
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {feat.featureDetails.workflow.map((step, idx) => (
                                <div key={idx} className="flex items-start gap-2 p-2 rounded-lg feature-step-pill border border-[#282828]">
                                  <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 font-bold font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                                    {idx + 1}
                                  </span>
                                  <span className="text-[11px] text-slate-300 leading-normal">{step}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Sub-Section 2: Head-to-Head Competitor Breakdown */}
                      <div className="space-y-3">
                        <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                          <Swords className="w-3.5 h-3.5 text-rose-400" />
                          <span>2. Competitor Teardown & Flaws (6 Providers Analyzed)</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {/* BinderPOS */}
                          <div className="p-3.5 rounded-xl feature-inner-box border border-[#2e2e2e] space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-white font-mono">{feat.competitorBreakdown.binderpos.name}</span>
                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400">
                                {feat.competitorBreakdown.binderpos.status}
                              </span>
                            </div>
                            <div className="text-[10px] font-mono text-amber-400 font-bold">
                              Price: {feat.competitorBreakdown.binderpos.price}
                            </div>
                            <p className="text-[11px] text-slate-400 leading-snug">
                              <strong className="text-rose-400">Fatal Flaw:</strong> {feat.competitorBreakdown.binderpos.flaw}
                            </p>
                          </div>

                          {/* TCG Sync */}
                          <div className="p-3.5 rounded-xl feature-inner-box border border-[#2e2e2e] space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-white font-mono">{feat.competitorBreakdown.tcgsync.name}</span>
                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400">
                                {feat.competitorBreakdown.tcgsync.status}
                              </span>
                            </div>
                            <div className="text-[10px] font-mono text-amber-400 font-bold">
                              Price: {feat.competitorBreakdown.tcgsync.price}
                            </div>
                            <p className="text-[11px] text-slate-400 leading-snug">
                              <strong className="text-rose-400">Fatal Flaw:</strong> {feat.competitorBreakdown.tcgsync.flaw}
                            </p>
                          </div>

                          {/* Storepass */}
                          <div className="p-3.5 rounded-xl feature-inner-box border border-[#2e2e2e] space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-white font-mono">{feat.competitorBreakdown.storepass.name}</span>
                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400">
                                {feat.competitorBreakdown.storepass.status}
                              </span>
                            </div>
                            <div className="text-[10px] font-mono text-amber-400 font-bold">
                              Price: {feat.competitorBreakdown.storepass.price}
                            </div>
                            <p className="text-[11px] text-slate-400 leading-snug">
                              <strong className="text-rose-400">Fatal Flaw:</strong> {feat.competitorBreakdown.storepass.flaw}
                            </p>
                          </div>

                          {/* DeckTradr */}
                          <div className="p-3.5 rounded-xl feature-inner-box border border-[#2e2e2e] space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-white font-mono">{feat.competitorBreakdown.decktradr.name}</span>
                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">
                                {feat.competitorBreakdown.decktradr.status}
                              </span>
                            </div>
                            <div className="text-[10px] font-mono text-slate-400">
                              Price: {feat.competitorBreakdown.decktradr.price}
                            </div>
                            <p className="text-[11px] text-slate-400 leading-snug">
                              <strong className="text-rose-400">Fatal Flaw:</strong> {feat.competitorBreakdown.decktradr.flaw}
                            </p>
                          </div>

                          {/* blstr */}
                          <div className="p-3.5 rounded-xl feature-inner-box border border-[#2e2e2e] space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-white font-mono">{feat.competitorBreakdown.blstr.name}</span>
                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                                {feat.competitorBreakdown.blstr.status}
                              </span>
                            </div>
                            <div className="text-[10px] font-mono text-emerald-400 font-bold">
                              Price: {feat.competitorBreakdown.blstr.price}
                            </div>
                            <p className="text-[11px] text-slate-400 leading-snug">
                              <strong className="text-rose-400">Fatal Flaw:</strong> {feat.competitorBreakdown.blstr.flaw}
                            </p>
                          </div>

                          {/* Crystal Commerce */}
                          <div className="p-3.5 rounded-xl feature-inner-box border border-[#2e2e2e] space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-white font-mono">{feat.competitorBreakdown.crystalcommerce.name}</span>
                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400">
                                {feat.competitorBreakdown.crystalcommerce.status}
                              </span>
                            </div>
                            <div className="text-[10px] font-mono text-amber-400 font-bold">
                              Price: {feat.competitorBreakdown.crystalcommerce.price}
                            </div>
                            <p className="text-[11px] text-slate-400 leading-snug">
                              <strong className="text-rose-400">Fatal Flaw:</strong> {feat.competitorBreakdown.crystalcommerce.flaw}
                            </p>
                          </div>
                        </div>

                        {/* Aeethod Wedge Banner */}
                        <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-start gap-2.5">
                          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                          <div className="text-xs">
                            <span className="font-bold text-cyan-300 font-mono block mb-0.5 uppercase tracking-wide">
                              ★ Aeethod OS Asymmetric Attack Wedge:
                            </span>
                            <span className="text-cyan-100 leading-relaxed font-sans">
                              {feat.competitorBreakdown.aeethodWedge}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Sub-Section 3: Pricing, WTP, Unit Economics & Margin Calculus */}
                      <div className="space-y-3">
                        <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                          <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                          <span>3. Pricing Details, WTP & Cloud Unit Economics</span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                          <div className="p-3 rounded-xl feature-inner-box border border-[#2e2e2e]">
                            <div className="text-[10px] text-slate-500 uppercase font-mono">Merchant WTP Range</div>
                            <div className="text-sm font-bold font-mono text-emerald-400 mt-1">{feat.merchantWtp}</div>
                            <div className="text-[10px] text-slate-400 mt-1">Direct labor & revenue offset</div>
                          </div>

                          <div className="p-3 rounded-xl feature-inner-box border border-[#2e2e2e]">
                            <div className="text-[10px] text-slate-500 uppercase font-mono">Competitors' Charge</div>
                            <div className="text-sm font-bold font-mono text-rose-400 mt-1 line-clamp-1">{feat.competitorsPrice}</div>
                            <div className="text-[10px] text-slate-400 mt-1">Often disguised as % GMV tax</div>
                          </div>

                          <div className="p-3 rounded-xl feature-inner-box border border-cyan-500/30 bg-cyan-500/5">
                            <div className="text-[10px] text-cyan-400 uppercase font-mono font-bold">Suggested Aeethod Price</div>
                            <div className="text-sm font-bold font-mono text-cyan-300 mt-1">{feat.suggestedPrice}</div>
                            <div className="text-[10px] text-cyan-400/80 mt-1">0% commission flat SaaS</div>
                          </div>

                          <div className="p-3 rounded-xl feature-inner-box border border-[#2e2e2e]">
                            <div className="text-[10px] text-slate-500 uppercase font-mono">Cost to Serve (Unit Econ)</div>
                            <div className="text-sm font-bold font-mono text-indigo-400 mt-1">{feat.unitCostToServe.split('(')[0]}</div>
                            <div className="text-[10px] text-emerald-400 mt-1 font-bold font-mono">{feat.grossMarginPct}% Gross Margin</div>
                          </div>
                        </div>
                      </div>

                      {/* Sub-Section 4: Feature-Specific Supply, Demand & Welfare Engine */}
                      <FeatureSupplyDemand feature={feat} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: COMMERCIAL TARGET PROFILES (WTP & UNIT ECONOMICS)                 */}
      {/* ========================================================================= */}
      {activeTab === 'profiles' && (
        <div className="space-y-6 animate-slide-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-400" />
                <span>5 Commercial Retail Archetypes (WTP & Surplus Analysis)</span>
              </h3>
              <p className="text-xs text-slate-400">
                Data-driven segmentation of North American and global card retailers with willingness to pay and surplus capture.
              </p>
            </div>

            <button
              onClick={() => navigate('/pricing-sim')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
            >
              <span>Open Switching ROI Simulator</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profileTasks.map((p) => {
              const price = p.fields?.['economics--price'];
              const wtp = p.fields?.['economics--wtp'];
              const surplus = p.fields?.['economics--surplus'];
              const sam = p.fields?.['economics--sam'];
              const elasticity = p.fields?.['economics--elasticity'];

              return (
                <div
                  key={p.id}
                  onClick={() => setOpenTask(p.id)}
                  className="card p-5 border-[#2e2e2e] bg-[#202020] hover:border-indigo-500/40 cursor-pointer transition space-y-3 group shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm font-bold text-white group-hover:text-indigo-400 transition leading-snug">
                        {p.title}
                      </div>
                      <div className="text-xs text-slate-400 mt-1 line-clamp-2">
                        {p.description || 'Target commercial segment profile.'}
                      </div>
                    </div>

                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold shrink-0">
                      ${Number(price || 0)}/mo
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 pt-2 border-t border-[#2e2e2e] text-xs font-mono">
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase font-bold">SAM Size</span>
                      <span className="text-white font-semibold">{Number(sam || 0).toLocaleString()} stores</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase font-bold">WTP</span>
                      <span className="text-white font-semibold">${Number(wtp || 0)}/mo</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase font-bold">Surplus</span>
                      <span className="text-emerald-400 font-semibold">+${Number(surplus || 0)}/mo</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase font-bold">Elasticity</span>
                      <span className="text-indigo-400 font-semibold">{String(elasticity || '-0.8')}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Competitor Detail Inspection Modal */}
      {inspectedCompetitor && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="card w-full max-w-xl max-h-[85vh] overflow-y-auto p-6 space-y-5 bg-[#202020] border-indigo-500/40 shadow-2xl">
            <div className="flex items-start justify-between border-b border-[#2e2e2e] pb-3">
              <div>
                <h3 className="text-lg font-bold text-white">{inspectedCompetitor.name}</h3>
                <div className="text-xs text-slate-400">
                  {inspectedCompetitor.parentCompany} • {inspectedCompetitor.categoryLabel}
                </div>
              </div>
              <button
                onClick={() => setInspectedCompetitor(null)}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#282828]"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[#252525] border border-[#2e2e2e] text-xs font-mono">
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-500">Base Price</span>
                <div className="text-white font-semibold">{inspectedCompetitor.pricing.base}</div>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-500">Commission</span>
                <div className="text-rose-400 font-bold">{inspectedCompetitor.pricing.commissionRate}</div>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-slate-300">
              <span className="font-bold text-white uppercase text-[10px] tracking-wider block">Attack Vector</span>
              <p className="p-3 rounded-lg bg-[#252525] border border-indigo-500/30 text-slate-300 text-xs">
                {inspectedCompetitor.attackVector}
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => {
                  setInspectedCompetitor(null);
                  navigate('/competitors');
                }}
                className="btn-secondary text-xs px-3 py-1.5"
              >
                <span>View Full Battlecard in Competitors Hub &rarr;</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
