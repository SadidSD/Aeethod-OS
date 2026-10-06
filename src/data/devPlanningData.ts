export type DevStackLayer = 'UI/UX' | 'Frontend' | 'Backend' | 'Database' | 'DevOps & Tooling';
export type DevStatus = 'Backlog' | 'In Progress' | 'In Review' | 'Shipped' | 'Vibe Verified';
export type DevPriority = 'Critical P0' | 'High P1' | 'Medium P2' | 'Future P3';

export interface ProductTechStack {
  uiUx: string;
  frontend: string;
  backend: string;
  database: string;
  devOps?: string;
}

export interface SaaSProductPillar {
  id: string;
  name: string;
  tagline: string;
  icon: string;
  targetCustomerProblem: string;
  problemsToBuild?: string;
  competitorAnalysis?: string;
  theAeethodSolution: string;
  targetAudience?: string;
  keyFeatures?: string[];
  pricingModel?: string;
  status: 'Concept' | 'In Discovery' | 'In Development' | 'Beta' | 'Live';
  techStack: ProductTechStack;
  createdAt?: string;
  updatedAt?: string;
}

export interface DevWorkItem {
  id: string;
  productId?: string; // Optional link to a specific SaaS Product
  title: string;
  layer: DevStackLayer;
  status: DevStatus;
  priority: DevPriority;
  problemSolved: string;
  solutionApproach: string;
  aiVibePromptBlueprint?: string;
  targetSprint?: string;
  filesTargeted?: string[];
  complexity?: 'S' | 'M' | 'L' | 'XL';
}

// Default initial SaaS products
export const INITIAL_SAAS_PRODUCTS: SaaSProductPillar[] = [
  {
    id: "prod-scanning-cards",
    name: "Scanning Cards",
    tagline: "High-speed AI computer-vision card scanning & bulk identification",
    icon: "📸",
    targetAudience: "Mid to high volume seller (5,000–50,000+ cards/week)",
    targetCustomerProblem: "High-volume card shops and power sellers receive thousands of singles weekly through collections, box-openings, and trade-ins. Manually cataloging singles creates massive friction:\n1. Intake Labor Burn: Employees spend 30–60 seconds per card manually reading copyright dates, set abbreviations, and rarity symbols, costing $15–$25/hr in repetitive payroll.\n2. Variant & Edition Misidentifications: Distinguishing between Unlimited vs Revised, 1st Edition vs Unlimited, Shadowless, reverse holos, pre-release stamps, and subtle language prints leads to frequent human mislabeling.\n3. Grading Subjectivity & Buyer Disputes: Inconsistent manual condition grading (Near Mint vs Lightly Played) leads to negative marketplace reviews and costly return claims.\n4. Capital Deadweight: Collections sit in unsorted binders for 2 to 4 weeks while market hype fades and card values drop.",
    problemsToBuild: "1. Fine-Grained Visual Recognition at Scale: Distinguishing subtle 10px expansion symbols, foil texture etching, and copyright years across 150,000+ card variants in sub-50ms.\n2. Foil Glare & Sensor Invariance: Holographic foil reflections and protective sleeves blind camera sensors; computer vision models must handle severe glare, tilt angles, and varying store lighting.\n3. Inference Latency vs Edge Compute: Cloud APIs introduce 1,500ms–3,000ms network roundtrips. Achieving continuous bulk scanning requires running quantized models locally on edge devices (Apple Neural Engine, WebGPU, or local ONNX).\n4. Mechanical Feed & Jam Risk: Automated hopper mechanisms frequently jam on warped foil cards, risking physical damage to valuable cards.",
    competitorAnalysis: "1. CardCastle (CardBot): Built a physical sorting robot costing $5,000–$10,000+. Flaws: Prohibitive upfront cost, mechanical belt jams on warped cards, capped at ~600 cards/hr, locked in closed ecosystem.\n2. Mobile Phone Apps (Decktradr, Ludex, Delver Lens, TCGplayer App): Flaws: Designed for single-card scanning, phones overheat and drain battery after 20 minutes, 2-second cloud latency per card, lack bulk batch intake queues for Shopify POS.\n3. Rocata / BinderPOS Scanners: Desktop webcam/flatbed integrations with primitive OCR. Flaws: Frequent misidentifications on foil variations and alternate arts, requiring tedious manual confirmation clicks on almost every card.",
    theAeethodSolution: "",
    pricingModel: "$99 - $299/mo ($0 commission)",
    status: "In Development",
    techStack: {
      uiUx: "",
      frontend: "",
      backend: "",
      database: "",
      devOps: ""
    },
    createdAt: "2026-10-06T15:10:59.184Z",
    updatedAt: "2026-10-06T15:10:59.184Z"
  },
  {
    id: "prod-buylist",
    name: "Buylist",
    tagline: "Automated self-service counter trade-in & valuation engine (0% GMV fee)",
    icon: "📋",
    targetAudience: "Brick-and-mortar game stores & high-volume trade-in merchants",
    targetCustomerProblem: "Buying singles over the counter is the lifeblood of game store gross margin, but existing trade-in workflows are broken:\n1. Counter Congestion: Customers bringing in trade-in binders cause 20–45 minute counter bottlenecks during peak retail hours, forcing staff to look up cards one by one while paying retail customers leave.\n2. Pricing Guesswork & Discrepancies: Calculating cash vs store credit payout percentages with condition deductions on paper or spreadsheets results in inconsistent offers between clerks, causing customer mistrust and profit margin leaks.\n3. The 2.5% Incumbent Commission Tax: Incumbent buylist platforms (like BinderPOS) charge up to 2.5% GMV commission on every single trade-in transaction, extracting thousands of dollars monthly.\n4. Delayed Intake: Acquired inventory sits in plastic trays for days before being entered into Shopify or POS inventory, freezing working capital.",
    problemsToBuild: "1. Real-Time Cascading Pricing Rule Engine: Evaluating complex tiered formulas (e.g. 'Pay 65% for cards > $20 in NM, 50% for cards < $5, auto-cap maximum store cash outlay at $500/day for any single card, apply 20% trade credit bonus') across 150,000 catalog items with sub-second response times.\n2. Frictionless Kiosk UX & Fraud Prevention: Designing an intuitive self-service touch interface hardened against kiosk crashes, automated customer session timeouts, phone number authentication, and anti-tamper controls.\n3. Bi-Directional POS Credit & Accounting Sync: Automatically issuing store credit directly into Shopify POS, Lightspeed, or gift card ledgers without clerk double-entry or financial discrepancies.\n4. Fast Clerk Inspection & Downgrade Flow: An efficient clerk review interface where staff can swiftly inspect the customer's submitted batch, downgrade conditions (NM to LP), recalculate totals instantly, and print barcodes in seconds.",
    competitorAnalysis: "1. BinderPOS / TCGplayer Buylist: Imposes a mandatory 2.5% GMV tax on all buylist intake. Flaws: Massive cumulative commission tax; clunky unbranded legacy iframe widget; sluggish mobile autocomplete; locked into closed ecosystem.\n2. Crystal Commerce: Antiquated 2010-era buylist module. Flaws: Slow database lookups during market price updates; zero self-service kiosk capabilities; requires customers to pre-submit submissions online days in advance; frequent inventory sync failures.\n3. Decktradr / blstr: Basic flat-rate buylist apps. Flaws: Lack physical in-store kiosk workflows; no native POS barcode label printing; no integrated condition downgrade dispute workflow for counter clerks.",
    theAeethodSolution: "",
    pricingModel: "$99 - $299/mo (0% GMV fee)",
    status: "In Development",
    techStack: {
      uiUx: "",
      frontend: "",
      backend: "",
      database: "",
      devOps: ""
    },
    createdAt: "2026-10-06T15:10:59.184Z",
    updatedAt: "2026-10-06T15:10:59.184Z"
  },
  {
    id: "prod-omnichannel-sync",
    name: "Omnichannel Sync",
    tagline: "Real-time multi-channel inventory sync across Shopify, eBay, TCGplayer & POS",
    icon: "🔄",
    targetAudience: "Omnichannel TCG sellers managing physical POS + multiple online marketplaces",
    targetCustomerProblem: "High-value singles are unique items where inventory quantity is usually 1. Selling across Shopify, eBay, TCGplayer, Cardmarket, and in-store POS simultaneously exposes merchants to severe inventory collisions:\n1. The Double-Sale Nightmare: An in-store customer purchases a $300 serialized or rare card at the physical counter. If online marketplace sync lags by even 3 to 10 minutes, an online buyer simultaneously purchases the identical card.\n2. Marketplace Account Penalties & Suspensions: Canceling an order due to out-of-stock inventory severely hurts seller defect rates. eBay and TCGplayer penalize sellers with downgraded search placement, higher fees, loss of Top Rated Seller status, or permanent bans.\n3. Multi-Portal Administrative Fatigue: Merchants waste 2 to 4 hours every single day logging into separate seller portals (TCGplayer Pro, eBay Seller Hub, Shopify Admin) to manually adjust inventory quantities and delist sold stock.\n4. Volatile Market Crash Latency: During set release weekends, prices fluctuate hourly; lack of unified cross-channel repricing causes stores to sell underpriced cards or sit on overpriced unsold stock.",
    problemsToBuild: "1. Sub-Second Distributed Locking & Race Condition Prevention: Acquiring distributed locks and de-listing items across 3 external APIs in parallel within 500ms when an in-store barcode is scanned at the register.\n2. Throttled Marketplace API Rate Limits: eBay and TCGplayer enforce strict API call limits and throttled webhooks. Store-wide price updates during market events require smart delta batching, exponential backoff, and prioritized queueing to avoid 429 errors.\n3. Disparate Catalog Schemas & Normalization: Normalizing radically different condition descriptors (e.g. TCGplayer NM vs eBay Ungraded), language editions, and foil treatments into a unified schema without metadata loss.\n4. Webhook Reliability & Eventual Consistency: Handling out-of-order webhook delivery, dropped packets, and Shopify API outages without creating split-brain inventory states or desynced databases.",
    competitorAnalysis: "1. BinderPOS: Monolithic legacy queue architecture. Flaws: Routinely experiences 5 to 20 minute synchronization queues during major prerelease set launches, leading to massive waves of overselling; locks sellers into their proprietary Shopify template; charges transaction cuts.\n2. TCGplayer Pro / Crystal Commerce: Ancient batch-based sync engines. Flaws: Syncs inventory in slow 15-minute polling intervals instead of real-time webhooks; frequent silent sync disconnects without seller notification; lacks robust eBay REST integrations.\n3. Generic Multi-Channel Tools (Sellbrite, ChannelEngine): Designed for standard retail (apparel, electronics) with SKU barcoding. Flaws: Incapable of understanding condition variations (NM, LP, MP, HP), language editions, foil textures, or TCG market price indexing; costs thousands in enterprise fees.\n4. Decktradr: Early-stage inventory tool. Flaws: Lacks enterprise-grade distributed webhook queues and comprehensive real-time bi-directional sync across both eBay and physical point-of-sale registers simultaneously.",
    theAeethodSolution: "",
    pricingModel: "$99 - $299/mo ($0 commission)",
    status: "In Discovery",
    techStack: {
      uiUx: "",
      frontend: "",
      backend: "",
      database: "",
      devOps: ""
    },
    createdAt: "2026-10-06T15:10:59.184Z",
    updatedAt: "2026-10-06T15:10:59.184Z"
  }
];

// Engineering full-stack tasks
export const INITIAL_DEV_WORK_ITEMS: DevWorkItem[] = [];
