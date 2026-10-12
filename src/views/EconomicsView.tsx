import React, { useState, useEffect } from 'react';
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
  Store,
} from 'lucide-react';
import { useDb, useStore } from '../store';
import { competitorsData, Competitor } from '../lib/competitorsData';
import { CompetitorLandscapeGraph } from '../components/CompetitorLandscapeGraph';
import { FeatureSupplyDemand } from '../components/FeatureSupplyDemand';
import { serviceableFeaturesData, ServiceableFeature } from '../data/serviceableFeatures';
import { navigate, href } from '../lib/router';
import { fmtMoney } from '../lib/metrics';
import { TcgMarketEconomicsTerminal } from '../components/TcgMarketEconomicsTerminal';

interface CommercialArchetype {
  id: string;
  title: string;
  merchantType: 'Physical Storefront' | 'Non-Storefront Vendor' | 'Physical Store Chain';
  unitLabel: 'stores' | 'vendors' | 'chains';
  sam: number;
  samSharePct: string;
  websiteOwnership: string;
  noWebsitePct: number;
  who: string;
  monthlyGmv: string;
  skus: string;
  currentStack: string;
  wedge: string;
  price: number;
  wtp: number;
  surplus: number;
  savings: number;
  elasticity: string;
  phase: string;
  taskDescription: string;
}

const COMMERCIAL_ARCHETYPES: CommercialArchetype[] = [
  {
    id: 'ff112c61-dfc3-4735-951c-ae28165a995c',
    title: 'Profile 1 — Indie Single-Store LGS (Brick-and-Mortar)',
    merchantType: 'Physical Storefront',
    unitLabel: 'stores',
    sam: 7500,
    samSharePct: '25.2%',
    websiteOwnership: '~55% Basic Site · ~45% No Singles/Buylist Site',
    noWebsitePct: 45,
    who: 'Neighbourhood physical hobby shop (WPN / Play! Pokémon / Bandai TCG+), 1–3 staff, 1 counter register.',
    monthlyGmv: '$12k – $35k/mo',
    skus: '10k – 35k SKUs',
    currentStack: 'Shopify/Square POS + TCGplayer + Spreadsheets',
    wedge: 'Instant Hosted/Embedded Buylist + Camera Foil Trade-In Scanner at $99 flat (saves ~$150/mo vs BinderPOS/SortSwift).',
    price: 99,
    wtp: 149,
    surplus: 50,
    savings: 150,
    elasticity: 'elastic (ε ≈ −1.2)',
    phase: 'Phase 2 Scale',
    taskDescription: `**Who:** Neighbourhood physical hobby shop, 1–3 staff, 1 counter register (WPN / Play! Pokémon / Bandai TCG+).\n\n| Metric | Value |\n|---|---|\n| Merchant Type | Physical Storefront (25.2% of total SAM) |\n| SAM Size | 7,500 stores (US, CA, UK, W. Europe, ANZ) |\n| Website Ownership | ~55% have basic Shopify/Square site · ~45% have NO singles/buylist site |\n| Monthly singles GMV | $12k – $35k |\n| Singles SKUs | 10k – 35k |\n| Current stack | Shopify/Square POS + TCGplayer + spreadsheets / manual counter calculator |\n| Current software spend | $49 – $150/mo |\n\n**Elasticity:** elastic (ε ≈ −1.2) — sensitive to fixed monthly overhead and avoids % commissions.\n\n**Savings vs incumbent:** vs SortSwift Core ($249/mo) or BinderPOS ($150 base + 2.5% commission ≈ $275/mo) → saves ~$150+/mo.\n\n**Killer features:** Instant hosted/embedded Buylist Portal, phone-camera foil/variant trade-in scanner, 0% commission.`,
  },
  {
    id: 'e6862dfd-b601-4327-8eb1-54f498160789',
    title: 'Profile 2 — High-Volume Premier LGS (Destination Storefront)',
    merchantType: 'Physical Storefront',
    unitLabel: 'stores',
    sam: 2400,
    samSharePct: '8.1%',
    websiteOwnership: '~95% Dedicated Storefront · ~5% Marketplace Only',
    noWebsitePct: 5,
    who: 'Large tournament & destination store, 5–15 staff, 2–4 registers, dedicated walk-in trade-in counter.',
    monthlyGmv: '$60k – $180k/mo',
    skus: '75k – 250k+ SKUs',
    currentStack: 'BinderPOS ($150–$350 + 2.5%) / SortSwift ($369) / Storepass',
    wedge: 'Eliminates $900–$1,688/mo in 2.5% GMV commission taxes + replaces slow manual counter trade-ins with optical scanning.',
    price: 299,
    wtp: 599,
    surplus: 300,
    savings: 1000,
    elasticity: 'extremely-inelastic (ε ≈ −0.3)',
    phase: 'Phase 1 Beachhead',
    taskDescription: `**Who:** Large tournament/destination store, 5–15 staff, 2–4 registers, dedicated walk-in trade-in counter.\n\n| Metric | Value |\n|---|---|\n| Merchant Type | Physical Storefront (Top ~23% of brick-and-mortar shops) |\n| SAM Size | 2,400 stores (US, CA, UK, W. Europe, ANZ) |\n| Website Ownership | ~95% have a dedicated webstore (Shopify / BinderPOS / Storepass) |\n| Monthly singles GMV | $60k – $180k (≈45% online) |\n| Singles SKUs | 75k – 250k+ |\n| Current stack | BinderPOS ($150–$350 + 2.5%) / SortSwift Core+ ($369) / Storepass ($99–$999) |\n\n**Incumbent cost:**\n- $80k GMV → ~$36k online → $150 + $900 ≈ **$1,050/mo**\n- $150k GMV → ~$67.5k online → $150 + $1,688 ≈ **$1,840/mo**\n\nSavings at $299 flat: **~$750 – $1,540/mo**. BinderPOS paused new signups in Feb 2025 & TCGplayer shut down Direct Buylist in July 2024.\n\n**Elasticity:** extremely inelastic (ε ≈ −0.3). **Phase 1 beachhead.**`,
  },
  {
    id: '400b5daf-d8a2-42c5-9f29-49433289b381',
    title: 'Profile 3 — Online Warehouse PowerSeller (Non-Storefront Vendor)',
    merchantType: 'Non-Storefront Vendor',
    unitLabel: 'vendors',
    sam: 5500,
    samSharePct: '18.5%',
    websiteOwnership: '~25% Have Website · ~75% Have NO Website (Marketplaces Only)',
    noWebsitePct: 75,
    who: 'Commercial online-only vendor (TCGplayer Level 4 / Direct, eBay Top-Rated, Cardmarket Powerseller), 2–8 staff, ZERO walk-in store.',
    monthlyGmv: '$40k – $250k/mo',
    skus: '50k – 500k+ listings',
    currentStack: 'SortSwift ($219–$499 + $249 Box) + Card Dealer Pro ($99)',
    wedge: 'TCGplayer killed Direct Buylist (July 2024); Aeethod gives the 75% without a website an Instant Hosted Buylist + 2-way Sync + Bulk/Foil Scanner.',
    price: 249,
    wtp: 499,
    surplus: 250,
    savings: 375,
    elasticity: 'inelastic (ε ≈ −0.5)',
    phase: 'Phase 1 Beachhead',
    taskDescription: `**Who:** Commercial online-only vendor (TCGplayer Level 4 / Direct, eBay Top-Rated, Cardmarket Powerseller), 2–8 warehouse/office staff, ZERO walk-in storefront.\n\n| Metric | Value |\n|---|---|\n| Merchant Type | Non-Storefront Commercial Vendor (No physical retail shop) |\n| SAM Size | 5,500 operations ($300k – $3M+/yr singles across US, EU, UK, CA) |\n| Website Ownership | Only ~25% have a website · ~75% sell ONLY on TCGplayer/eBay/Cardmarket |\n| Monthly singles GMV | $40k – $250k |\n| Listings | 50k – 500k+ |\n| Current stack | SortSwift ($219–$499/mo + $249 Sync Box) + Card Dealer Pro ($99) + TCG PowerTools |\n| Current software spend | $250 – $750/mo across 2–4 disconnected tools |\n\n**Pain:** TCGplayer killed its central Direct Buylist (July 2024), leaving online vendors with no website unable to run a public buylist; cross-channel double-sales between TCGplayer & eBay.\n\n**Elasticity:** inelastic (ε ≈ −0.5) — judged on intake speed & Hosted Buylist Portal (buylist.aeethod.com/vendor). **Phase 1 beachhead.**`,
  },
  {
    id: 'fb124dd7-a62e-4768-9857-39805e2c16ec',
    title: 'Profile 4 — Card-Show Booth Dealer & Live-Stream Vendor (Non-Storefront)',
    merchantType: 'Non-Storefront Vendor',
    unitLabel: 'vendors',
    sam: 14000,
    samSharePct: '47.1%',
    websiteOwnership: '<8% Have Website · 92%+ Have ZERO Website (IG / Whatnot / eBay)',
    noWebsitePct: 92,
    who: 'Weekend convention/card-show booth vendors (~6,500 across Collect-A-Con, Regionals & local hotel shows) + ~7,500 full-time Whatnot / TikTok / IG breakers & slab dealers.',
    monthlyGmv: '$8k – $60k/mo',
    skus: '500 – 15,000 slabs & singles',
    currentStack: 'Collectr / Shiny / Rare Candy ($0–$15) + Manual eBay/TCGplayer',
    wedge: 'Instant Hosted Buylist URL (`buylist.aeethod.com/vendor`) + Event Drop-Off QR Table Tent + 3-second Camera Trade-In Calculator + Auto-Delist.',
    price: 79,
    wtp: 149,
    surplus: 70,
    savings: 65,
    elasticity: 'bifurcated',
    phase: 'Phase 2 Scale',
    taskDescription: `**Who:** Weekend convention/card-show table vendors (Collect-A-Con 900–1,300 booths/show, Pokémon Regionals, local hotel shows) & full-time Whatnot / TikTok Live / IG slab & singles dealers (1–3 staff, ZERO physical store).\n\n| Metric | Value |\n|---|---|\n| Merchant Type | Non-Storefront Commercial Vendor (47.1% of total commercial SAM!) |\n| SAM Size | 14,000 active commercial vendors (~6,500 circuit booth dealers + ~7,500 live-stream/IG vendors) |\n| Website Ownership | <8% have a website · 92%+ have ZERO website (rely on IG bio, Whatnot, eBay) |\n| Revenue | $8k – $60k/mo ($10k – $50k per major show weekend) |\n| SKUs | 500 – 15,000 high-velocity singles, holos & PSA/CGC slabs |\n| Current stack | Collectr / Shiny / Rare Candy calculator ($0–$15/mo) + manual eBay/TCGplayer delisting |\n\n**Pain:** 92% have no website to accept pre-show Event Drop-Off buylists; 25-minute manual calculator bottleneck at crowded show booths; selling a slab at a show leaves it live on eBay.\n\n**Pricing:** $79/mo (includes Instant Hosted Buylist Portal + QR Table Sign + Camera Trade-In Calculator + eBay/TCGplayer auto-delist). **Elasticity:** bifurcated.`,
  },
  {
    id: '724948ae-5c88-46eb-9b65-a4c9b5da0366',
    title: 'Profile 5 — Multi-Location Enterprise Chain (Brick-and-Mortar)',
    merchantType: 'Physical Store Chain',
    unitLabel: 'chains',
    sam: 350,
    samSharePct: '1.2%',
    websiteOwnership: '100% Enterprise Webstore (~1,400 physical rooftops)',
    noWebsitePct: 0,
    who: 'Regional & national retail chains operating 3–15 physical storefronts + central fulfillment warehouse, 20–100 staff.',
    monthlyGmv: '$150k – $800k+/mo',
    skus: '500k – 2M+ SKUs',
    currentStack: 'Storepass Enterprise ($1.5k–$5k/mo) / TCG Sync ($2.5k/mo)',
    wedge: 'Unified multi-warehouse inventory ledger, inter-store transfer routing, and 0% GMV tax at flat enterprise pricing.',
    price: 699,
    wtp: 1499,
    surplus: 800,
    savings: 2500,
    elasticity: 'completely-inelastic (ε ≈ −0.1)',
    phase: 'Phase 3 Expansion',
    taskDescription: `**Who:** 3–15 physical stores + central fulfillment depot, 20–100 staff.\n\n| Metric | Value |\n|---|---|\n| Merchant Type | Physical Storefront Chain (~1,400 total rooftops across 350 parent organizations) |\n| SAM Size | 350 enterprise chains (~500 globally) |\n| Website Ownership | 100% have enterprise websites |\n| Monthly singles GMV | $150k – $800k+ |\n| SKUs | 500k – 2M+ |\n| Current stack | Storepass Enterprise ($1,500 – $4,999/mo), TCG Sync Enterprise ($2,499/mo), custom ERP |\n\n**Pain:** Inventory siloed per store, no automated inter-store transfers, high per-location software fees.\n\n**Elasticity:** completely inelastic (ε ≈ −0.1) — decided on uptime, RBAC, SLA. **Phase 3.**`,
  },
];

export const EconomicsView: React.FC = () => {
  const db = useDb();
  const { setOpenTask, update, theme } = useStore();
  const isLight = theme === 'light';

  const [activeTab, setActiveTab] = useState<'climate' | 'tcg-market' | 'micro-topics' | 'features' | 'profiles'>('tcg-market');

  const [selectedTopic, setSelectedTopic] = useState<string>('scarcity');
  const [inspectedCompetitor, setInspectedCompetitor] = useState<Competitor | null>(null);

  // Expanded state for features
  const [expandedFeatures, setExpandedFeatures] = useState<Record<string, boolean>>({});
  const [featureSearch, setFeatureSearch] = useState<string>('');
  const [featureElasticityFilter, setFeatureElasticityFilter] = useState<'all' | 'Inelastic' | 'Unit Elastic' | 'Hyper-Elastic'>('all');
  const [simulatedTier, setSimulatedTier] = useState<99 | 149 | 249>(149);

  // Sync canonical Store vs Vendor market census into live task records so task modals also stay up-to-date
  useEffect(() => {
    COMMERCIAL_ARCHETYPES.forEach((arch) => {
      const existing = db.tasks.find((t) => t.id === arch.id);
      if (
        existing &&
        (existing.title !== arch.title || Number(existing.fields?.['economics--sam']) !== arch.sam)
      ) {
        update('tasks', arch.id, {
          title: arch.title,
          description: arch.taskDescription,
          fields: {
            ...existing.fields,
            'economics--price': arch.price,
            'economics--wtp': arch.wtp,
            'economics--surplus': arch.surplus,
            'economics--savings': arch.savings,
            'economics--sam': arch.sam,
          },
        });
      }
    });
  }, [db.tasks, update]);

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
      summary: 'Oligopolistic platform gateway (eBay/TCGplayer) controlling 70%+ US volume vs 29,750 commercial stores & vendors.',
      formula: 'HHI = \\sum s_i^2 > 3,800 \\text{ (Highly Concentrated Gateway)}',
      coreAnalysis: `The TCG secondary market exhibits an industrial structure of **Platform Monopsony & Gateway Monopoly**:
1. **The Core Gateway (TCGplayer owned by eBay)**: Controls over 70% of North American online singles liquidity. Because consumers congregate there for universal search, merchants are economically coerced into listing inventory on the platform despite 10%–13.5% fees.
2. **The Fragmented Commercial Fringe (29,750 SAM across US/CA/UK/EU/ANZ)**: Consists of **10,250 physical brick-and-mortar store accounts (34.5%)** and **19,500 commercial non-storefront vendors (65.5% — warehouse power sellers, card-show booth dealers, and live-stream breakers)**, plus ~57,000 casual side-hustle sellers.
3. **The Post-July 2024 Buylist Vacuum**: When TCGplayer shut down its centralized Direct Buylist in July 2024 and BinderPOS paused signups in Feb 2025, the 64.2% of commercial sellers without a website were left stranded without a buylist—creating a massive opening for Aeethod's Instant Hosted Buylist + Flat-Rate OS.`,
      tradeoff: 'Stores cannot afford to leave TCGplayer completely without sacrificing 40%+ of sales; the optimal strategy is using Aeethod to divert repeat customers and trade-ins to their 0% commission direct channel.',
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
      summary: 'Empirical WTP across the 5 commercial retail archetypes (10,250 Physical Stores vs 19,500 Commercial Vendors).',
      formula: 'Surplus_{merchant} = WTP_{archetype} - Price_{Aeethod}',
      coreAnalysis: `Willingness to Pay (WTP) for software varies systematically across the 29,750 commercial merchants:
- **Profile 1: Indie Single-Store LGS (7,500 stores — 45% lack a singles website)**: WTP is $149/mo. At Aeethod's $99/mo starter price, the merchant captures **+$50/mo consumer surplus** plus an instant hosted buylist.
- **Profile 2: High-Volume Premier LGS (2,400 stores — 95% have webstores)**: WTP is $599/mo. Processing $80k+/mo in GMV on BinderPOS (2.5%) costs $1,050+/mo. At Aeethod's $299/mo Pro tier, they capture **+$300/mo software surplus** plus **+$750–$1,540/mo in avoided commissions**!
- **Profile 3: Online Warehouse PowerSeller (5,500 non-storefront vendors — 75% lack a website)**: WTP is $499/mo. Needs bulk foil scanning, multi-marketplace sync, and a Hosted Buylist Portal since TCGplayer killed Direct Buylist.
- **Profile 4: Card-Show Booth & Live-Stream Vendor (14,000 non-storefront vendors — 92% lack a website)**: WTP is $149/mo. Needs an instant Hosted Buylist with Event Drop-Off QR codes, camera trade-in calculator, and eBay/TCGplayer auto-delist at $79/mo.
- **Profile 5: Multi-Store Regional Chain (350 chains / ~1,400 rooftops)**: WTP is $1,499/mo. Needs multi-location sync, central warehouse transfers, and RBAC at $699/mo.`,
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
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-400" />
                <span>5 Commercial Retail Archetypes — Physical Stores vs. Non-Storefront Vendors</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Empirical census across US, Canada, UK, Western Europe & ANZ (86,750 Total Sellers · 29,750 Commercial B2B SAM).
              </p>
            </div>

            <button
              onClick={() => navigate('/pricing-sim')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 shrink-0"
            >
              <span>Open Switching ROI Simulator</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* ===================================================================== */}
          {/* MARKET CENSUS BANNER: PHYSICAL STORES vs. NON-STOREFRONT VENDORS      */}
          {/* ===================================================================== */}
          <div className="card p-5 border-indigo-500/30 bg-[#1c1c21] space-y-5 shadow-md">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#2e2e36] pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    Verified Industry Census
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    US · Canada · UK · Western Europe · ANZ
                  </span>
                </div>
                <h4 className="text-base font-black text-white">
                  Why 65.5% of Commercial TCG Businesses Are Non-Storefront Vendors (Not Physical Shops)
                </h4>
                <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
                  Legacy ERPs (BinderPOS, CrystalCommerce, Storepass) only target the <strong className="text-white">10,250 physical brick-and-mortar store accounts (34.5% of SAM)</strong>. They ignore the <strong className="text-cyan-300">19,500 commercial non-storefront vendors (65.5% of SAM)</strong>—and across both groups, <strong className="text-amber-300">19,100 businesses (64.2%) have NO functional singles/buylist website</strong>.
                </p>
              </div>

              {/* 4 Macro Census Counters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 shrink-0 font-mono">
                <div className="p-3 rounded-xl bg-[#25252c] border border-[#32323c]">
                  <div className="text-[9px] uppercase text-slate-400 font-bold">Total Active Sellers (TAM)</div>
                  <div className="text-base font-black text-white mt-0.5">86,750</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Incl. 57k casuals</div>
                </div>
                <div className="p-3 rounded-xl bg-[#25252c] border border-indigo-500/30">
                  <div className="text-[9px] uppercase text-indigo-300 font-bold">Physical Store Accounts</div>
                  <div className="text-base font-black text-indigo-400 mt-0.5">10,250</div>
                  <div className="text-[10px] text-indigo-300/80 mt-0.5">34.5% of B2B SAM</div>
                </div>
                <div className="p-3 rounded-xl bg-[#25252c] border border-cyan-500/30">
                  <div className="text-[9px] uppercase text-cyan-300 font-bold">Commercial Vendors</div>
                  <div className="text-base font-black text-cyan-400 mt-0.5">19,500</div>
                  <div className="text-[10px] text-cyan-300/80 mt-0.5">65.5% of B2B SAM</div>
                </div>
                <div className="p-3 rounded-xl bg-[#25252c] border border-amber-500/30">
                  <div className="text-[9px] uppercase text-amber-300 font-bold">No Buylist Website</div>
                  <div className="text-base font-black text-amber-400 mt-0.5">19,100</div>
                  <div className="text-[10px] text-amber-300/80 mt-0.5">64.2% of B2B SAM</div>
                </div>
              </div>
            </div>

            {/* Visual Split Bar: Commercial SAM (29,750) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-indigo-300 font-bold">
                  🏪 PHYSICAL BRICK-AND-MORTAR STORES: 10,250 Accounts (34.5% of SAM · ~11,300 Rooftops)
                </span>
                <span className="text-cyan-300 font-bold">
                  🎒 NON-STOREFRONT COMMERCIAL VENDORS: 19,500 Operations (65.5% of SAM · Zero Physical Store)
                </span>
              </div>
              <div className="h-3.5 w-full rounded-full overflow-hidden flex bg-[#2a2a32] p-0.5 gap-0.5">
                <div
                  style={{ width: '25.2%' }}
                  className="bg-indigo-500 h-full rounded-l-full"
                  title="Profile 1: Indie Single-Store LGS — 7,500 stores (25.2%)"
                />
                <div
                  style={{ width: '8.1%' }}
                  className="bg-violet-500 h-full"
                  title="Profile 2: Premier Destination LGS — 2,400 stores (8.1%)"
                />
                <div
                  style={{ width: '1.2%' }}
                  className="bg-fuchsia-500 h-full"
                  title="Profile 5: Multi-Location Chains — 350 chains (1.2%)"
                />
                <div
                  style={{ width: '18.5%' }}
                  className="bg-cyan-500 h-full"
                  title="Profile 3: Online Warehouse PowerSellers — 5,500 vendors (18.5%)"
                />
                <div
                  style={{ width: '47.0%' }}
                  className="bg-emerald-500 h-full rounded-r-full"
                  title="Profile 4: Card-Show Booth & Live-Stream Vendors — 14,000 vendors (47.1%)"
                />
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-slate-400 pt-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-xs bg-indigo-500 inline-block" />
                    Indie LGS: 7,500 (25.2%)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-xs bg-violet-500 inline-block" />
                    Premier LGS: 2,400 (8.1%)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-xs bg-fuchsia-500 inline-block" />
                    Chains: 350 (1.2%)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-xs bg-cyan-500 inline-block" />
                    Warehouse PowerSellers: 5,500 (18.5%)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500 inline-block" />
                    Card-Show & Stream Vendors: 14,000 (47.1%)
                  </span>
                </div>
                <span className="text-slate-500">
                  +57,000 Casual / Binder Flippers excluded from B2B SAM (&lt;$1.5k/mo GMV)
                </span>
              </div>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* 5 COMMERCIAL RETAIL ARCHETYPE CARDS                                   */}
          {/* ===================================================================== */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COMMERCIAL_ARCHETYPES.map((arch) => {
              const isVendor = arch.merchantType === 'Non-Storefront Vendor';

              return (
                <div
                  key={arch.id}
                  onClick={() => setOpenTask(arch.id)}
                  className="card p-5 border-[#2e2e2e] bg-[#202020] hover:border-indigo-500/40 cursor-pointer transition space-y-3.5 group shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Top Badges & Price */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span
                            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                              isVendor
                                ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                                : 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                            }`}
                          >
                            {isVendor ? '🎒 Non-Storefront Vendor' : '🏪 Physical Storefront'}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#2a2a30] text-slate-300 border border-[#383842]">
                            {arch.samSharePct} of SAM
                          </span>
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                              arch.noWebsitePct >= 40
                                ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                                : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25'
                            }`}
                          >
                            🌐 {arch.websiteOwnership}
                          </span>
                        </div>

                        <div className="text-sm font-bold text-white group-hover:text-indigo-400 transition leading-snug pt-0.5">
                          {arch.title}
                        </div>
                      </div>

                      <span className="text-xs font-mono px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold shrink-0">
                        ${arch.price}/mo
                      </span>
                    </div>

                    {/* Clean Who Summary */}
                    <p className="text-xs text-slate-300 leading-relaxed">
                      <strong className="text-white">Who:</strong> {arch.who}
                    </p>

                    {/* Structured 2x2 Operational Details Grid */}
                    <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-[#18181c] border border-[#2a2a30] text-[11px]">
                      <div>
                        <span className="text-[9px] font-mono uppercase text-slate-500 block">Monthly Singles GMV</span>
                        <span className="font-mono font-semibold text-white">{arch.monthlyGmv}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono uppercase text-slate-500 block">Catalog Depth</span>
                        <span className="font-mono font-semibold text-white">{arch.skus}</span>
                      </div>
                      <div className="col-span-2 pt-1 border-t border-[#26262c]">
                        <span className="text-[9px] font-mono uppercase text-slate-500 block">Current Incumbent Stack</span>
                        <span className="font-mono text-slate-300">{arch.currentStack}</span>
                      </div>
                    </div>

                    {/* Aeethod Wedge Callout */}
                    <div className="text-[11px] text-cyan-200/90 bg-cyan-500/8 border border-cyan-500/20 rounded-lg px-3 py-2 leading-snug">
                      <strong className="text-cyan-400 font-mono uppercase text-[10px] mr-1">Why They Buy:</strong>
                      {arch.wedge}
                    </div>
                  </div>

                  {/* Bottom 4-Column Economic Telemetry */}
                  <div className="grid grid-cols-4 gap-2 pt-3 border-t border-[#2e2e2e] text-xs font-mono">
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase font-bold">SAM Size</span>
                      <span className="text-white font-semibold">
                        {arch.sam.toLocaleString()} {arch.unitLabel}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase font-bold">WTP</span>
                      <span className="text-white font-semibold">${arch.wtp}/mo</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase font-bold">Surplus</span>
                      <span className="text-emerald-400 font-semibold">+${arch.surplus}/mo</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase font-bold">Elasticity</span>
                      <span className="text-indigo-400 font-semibold">{arch.elasticity.split(' ')[0]}</span>
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
