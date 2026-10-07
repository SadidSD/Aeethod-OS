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

// Default initial SaaS products with exhaustive customer problems, build obstacles, competitor analysis, and empty solutions
export const INITIAL_SAAS_PRODUCTS: SaaSProductPillar[] = [
  {
    id: "prod-scanning-cards",
    name: "Scanning Cards",
    tagline: "High-speed AI computer-vision card scanning & bulk identification",
    icon: "📸",
    targetAudience: "Mid to high volume seller (processing 5,000–50,000+ cards/week)",
    pricingModel: "$99 - $299/mo ($0 commission)",
    status: "In Development",
    targetCustomerProblem: `1. Massive Intake Labor Burn & Payroll Overhead:
High-volume game stores and power sellers receive thousands of singles weekly from collection buyouts, draft events, sealed box cracks, and player trade-ins. A standard collection of 3,000 cards takes an experienced clerk 25 to 40 hours of manual labor to inspect, identify, condition-grade, price-check on TCGplayer, and manually type into Shopify/POS. At $18/hour, that represents $450–$720 in direct labor cost per collection before selling a single card.

2. Catastrophic Misidentification of High-Value Variants:
Modern TCGs (Pokémon, MTG, Yu-Gi-Oh!, Lorcana, One Piece) release dozens of visual variants for identical card art. For example: Pokémon non-holo, reverse holo, cosmos holo, Pokéball pattern, Masterball mirror pattern, pre-release stamp, staff promo, and regional print differences. In Magic: Alpha vs. Beta vs. Unlimited vs. Revised, Mystery Booster prints, List versions, extended art, borderless, serialized, and etched foil vs. traditional foil. A clerk mistaking an Unlimited Dual Land for Revised or a Masterball mirror as a standard reverse holo results in $100s to $1,000s in lost margin or buyer chargebacks.

3. Grading Subjectivity & Buyer Dispute Liabilities:
Subjective grading between different staff members (one clerk grading a card Near Mint, another Lightly Played) leads to negative marketplace feedback on TCGplayer/eBay. When an online buyer receives an LP card sold as NM, the merchant incurs return shipping costs ($4–$5), marketplace defect penalties, and restocking labor.

4. Price Depreciation & Opportunity Cost of Stale Inventory:
Because manual intake creates a 2-to-4 week backlog, cards sit in storage boxes while the secondary market price crashes. For new set releases, 60% of single sales volume occurs in the first 72 hours of launch. Backlogged cards miss this peak pricing window and drop 30–50% in value before they ever hit the digital shelf.

5. Employee Burnout & Turnover:
Repetitive, tedious data entry causes severe eye strain and high employee turnover, requiring perpetual re-training of junior retail staff on intricate 30-year card histories.`,

    problemsToBuild: `1. Ultra Fine-Grained Visual Classification at Massive Scale:
Modern card databases span over 200,000 unique card prints across 5+ languages. Many cards share 99% identical artwork and only differ by a microscopic 2mm expansion set symbol, copyright line text ('1995' vs '1999-2000'), artist credit line, or font weight. Standard ResNet or generic YOLO object detection models fail because global feature embeddings blend these tiny differences. Training a model that can localize and classify microscopic localized sub-regions (set symbol, copyright year, rarity code, foil stamp) with 99.8%+ accuracy requires multi-stage cascading neural networks.

2. Holographic Foil Glare, Surface Texture & Lighting Invariance:
Foil cards have micro-etched prismatic diffraction gratings. Under overhead fluorescent store lights or point-source LEDs, direct specular reflections blow out camera sensors (pure white saturation over card text and art). Sized sleeves, plastic toploaders, and semi-rigid holders add additional glare, scratches, and dust artifacts. The vision pipeline must normalize lighting, detect surface texture without blinding reflections, or require polarized cross-illumination diffusion hardware.

3. Edge Inference Latency vs. Cloud API Cost/Lag:
Bulk sorting requires sub-100ms per card throughput (at least 10–20 cards per second in an automated feed or under 200ms in manual hand placement). Sending 4K video frames or high-res photos to cloud APIs (AWS Rekognition, Google Cloud Vision, OpenAI GPT-4o) takes 1,200ms–2,500ms per card and costs $0.01–$0.03 per image. At 50,000 cards per month, cloud inference costs $500–$1,500/month in compute bills alone. Achieving commercial viability requires quantized ONNX/TensorRT models running locally on edge devices (Apple Neural Engine, Nvidia Jetson, or WebGPU/WASM in browser) without requiring expensive GPUs.

4. Hardware Mechanics & Card-Damaging Feeder Jamming:
Designing mechanical automated feeder hardware is notoriously difficult because cards vary in thickness (standard 300gsm paper vs. thick 55pt/100pt relic cards vs. foiled curled 'pringle' cards). Rubber pick-up rollers can scuff glossy card surfaces or ding fragile corners, turning a $500 Gem Mint card into an LP card and causing massive liability.

5. Sub-Second Catalog & Market Price Indexing:
Once a card image is classified into a set and card number, the engine must immediately fetch real-time market pricing (TCGplayer Market, Low, Mid, Direct, Cardmarket 7-day average, eBay Sold listings) and map it to the merchant's exact POS inventory schema in <50ms without hitting rate limits.`,

    competitorAnalysis: `1. CardCastle (CardBot):
• Architecture & Implementation: Engineered a custom mechanical desktop sorting machine with 3D-printed hopper chutes, stepper motors, rubber drive belts, and an internal camera wired to an on-board Raspberry Pi that sends crops to their cloud servers.
• Fatal Flaws & Shortcomings: Prohibitively expensive ($5,000–$10,000+ upfront lease/purchase price, putting it out of reach for 90% of local game stores); physical belt jams frequently on slightly warped/curled foil cards; max throughput capped at only 500–600 cards per hour; frequent mechanical maintenance required; tightly locked into CardCastle's proprietary software subscription with no direct sync into Shopify or BinderPOS.

2. Rocata / Roca Sorter:
• Architecture & Implementation: High-end industrial sorting machine with pneumatic suction cups and conveyor belts designed for large commercial distributors.
• Fatal Flaws & Shortcomings: Enormous industrial footprint; costs $25,000 to $40,000+; requires high-pressure air compressors and dedicated facility space; completely inaccessible to ordinary brick-and-mortar retail shops.

3. Mobile Phone Apps (Decktradr, Ludex, Delver Lens, Dragon Shield, TCGplayer App):
• Architecture & Implementation: Mobile iOS/Android camera apps using phone cameras. Captured single frames are pre-processed with OpenCV edge detection and sent to cloud backend servers for embedding matching against card databases.
• Fatal Flaws & Shortcomings: Strictly designed for casual hobbyists scanning one card at a time from their personal desk; clerks cannot feasibly hold an iPhone for 6 hours without extreme wrist fatigue; phone cameras quickly overheat and throttle performance after 15–20 minutes of continuous scanning; reliance on cloud APIs causes 1.5–3 second latency per card; no bulk batch processing queues, no barcode label printing, and no bi-directional synchronization with physical POS cash registers.

4. BinderPOS / Crystal Commerce Scanners:
• Architecture & Implementation: Basic web-browser webcam or flatbed document scanner integration with elementary OCR (optical character recognition) reading card title text.
• Fatal Flaws & Shortcomings: Hopelessly inaccurate on non-English cards (Japanese, Korean, German), alternate art variants, textless cards, and foil stamps; requires manual confirmation clicks on 80% of cards scanned; zero condition detection; slow and clunky.`,

    theAeethodSolution: "",
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
    pricingModel: "$99 - $299/mo (0% GMV fee)",
    status: "In Development",
    targetCustomerProblem: `1. The Peak-Hours Counter Congestion Trap:
Customer trade-ins represent 60–80% of a card store's gross profit margin (buying singles at 50–70% of market value to sell at 100%). However, customers bring in binders with 50 to 300 cards during peak store hours (evenings, Friday Night Magic, Saturday Pokémon leagues). A single clerk has to manually look up each card on TCGplayer, check the condition, type numbers into a calculator, and calculate trade-in totals. This locks up the cash register for 25 to 50 minutes. Meanwhile, paying retail customers waiting in line to buy packs, sleeves, or drinks get frustrated and walk out, resulting in lost immediate revenue.

2. Discretionary Pricing Errors & Margin Bleed:
Different clerks offer wildly different prices based on their personal mood, card knowledge, or memory. Junior clerks frequently pay NM prices for LP/MP cards or miscalculate store credit bonuses (e.g., offering cash when store credit was required), bleeding hundreds of dollars of store margin daily. Store owners have no centralized guardrails to enforce strict margin formulas.

3. The Predatory 2.5% GMV Incumbent Platform Tax:
Incumbents like BinderPOS (owned by TCGplayer/eBay) charge up to a 2.5% GMV commission fee on every single buylist transaction processed. If a busy store buys $40,000 in singles per month, BinderPOS takes $1,000 every month just in buylist transaction fees on top of high monthly software subscription fees. Over a year, that is $12,000+ taken directly out of the merchant's margin.

4. Customer Mistrust & Price Haggling Arguments:
When a clerk arbitrarily writes a number on a piece of paper, customers feel lowballed and argue over card prices, condition deductions, and market fluctuations. Without a transparent, customer-facing digital kiosk showing live TCG Market prices and clear mathematical deductions, negotiations turn hostile and harm customer retention.

5. Cash Flow Risk & Dangerous Over-Acquisition:
Stores have finite working capital. Without automated daily budget caps per card or set, a store might accidentally buy 25 copies of a newly reprinted card from three different walk-in customers in one afternoon, tying up $2,000 in cash on inventory that drops 40% in value the following week.

6. Intake Inventory Freezing:
Cards accepted at the counter are placed in plastic bins or shoeboxes behind the counter. Because clerks dread manual data entry, these trade-in cards sit uncataloged for days or weeks, meaning the store cannot immediately sell them on Shopify or eBay, severely hurting capital velocity.`,

    problemsToBuild: `1. Complex Real-Time Cascading Pricing Rule Engine:
A robust buylist engine cannot rely on static price lists. It must evaluate complex mathematical rule matrices in sub-50ms across 150,000+ SKUs:
• Multi-tier price thresholds (e.g., 'Pay 65% of TCG Market for cards over $25; pay 50% for cards $5–$25; pay 35% for cards under $5').
• Dynamic cash vs. store credit bonus multipliers (e.g., 'Apply +25% trade credit bonus, but cap maximum store credit bonus at $100 per transaction').
• Max quantity & inventory balancing constraints (e.g., 'If store inventory count >= 8 copies, reduce buylist offer by 20%; if store inventory >= 16 copies, auto-disable buylist for this SKU').
• Daily and weekly cash outlay budgets (e.g., 'Max $300 cash payout per customer per day; enforce manager override code for payouts > $500').

2. Hardened, Crash-Proof Self-Service Kiosk UX:
Designing an in-store customer kiosk on iPad or touchscreen PC that non-technical customers can navigate without staff assistance. Requires:
• Kiosk mode sandboxing (preventing customers from exiting app, accessing settings, or navigating to unauthorized sites).
• Idle session timeouts with automatic state wiping to protect customer personal information.
• Fast fuzzy search that handles misspelled Pokémon names and card nicknames in under 30ms.
• Mobile phone SMS / QR code handoff so customers can start their buylist at home and scan a QR code at the in-store kiosk.

3. Bi-Directional POS Accounting & Store Credit Integration:
Issuing store credit directly into Shopify POS, Lightspeed, or Square customer accounts without generating duplicate customer profiles, ledger mismatches, or race conditions. If an API call fails mid-transaction, the system must guarantee idempotent transaction rollbacks to prevent unbacked store credit creation.

4. Rapid Clerk Batch Review & Condition Downgrade Flow:
When the customer hands over the physical cards corresponding to their kiosk submission, the clerk needs a 10-second inspection interface:
• 1-click condition adjustments (e.g., changing a card from NM to LP instantly updates payout and prints a breakdown receipt).
• Customer signature capture for legal pawn/secondhand dealer compliance (many US states and municipalities require ID scanning, customer thumbprints, and photo recording for cash trade-ins).
• Instant generation of thermal barcode labels (Zebra/Dymo) for each approved single so cards go directly from counter to display case in 60 seconds.`,

    competitorAnalysis: `1. BinderPOS (TCGplayer / eBay):
• Architecture & Implementation: Built a generic Shopify iframe widget connected to a monolithic Ruby on Rails backend that syncs pricing from TCGplayer's proprietary price feed.
• Fatal Flaws & Shortcomings: Enforces a mandatory 2.5% GMV commission tax on all buylist intake; embedded iframe is slow, clunky, and fails on mobile viewports; zero physical counter kiosk workflows; cannot be customized with custom CSS/branding; store owners cannot override pricing formulas with custom tiered margin rules; completely locked into TCGplayer.

2. Crystal Commerce Buylist:
• Architecture & Implementation: Legacy early-2010s PHP/MySQL monolithic architecture where customers submit an online buylist order that clerks manually verify through a desktop admin portal.
• Fatal Flaws & Shortcomings: Painfully sluggish search queries during high-traffic prereleases; no in-store touchscreen kiosk mode; requires customers to submit buylists online 24–48 hours in advance rather than walking into the shop; inventory sync between buylist intake and physical POS regularly crashes and corrupts database stock.

3. Decktradr / blstr:
• Architecture & Implementation: Cloud web apps offering flat-fee buylist widgets with basic TCGplayer price multipliers.
• Fatal Flaws & Shortcomings: Completely lacks physical hardware support (no Zebra barcode label printing, no counter kiosk terminal sandboxing, no customer ID/signature compliance capture for state secondhand laws); lacks tight bi-directional integration with Shopify POS customer store credit balances; rudimentary rule configuration with no inventory-aware supply/demand dynamic discounting.`,

    theAeethodSolution: "",
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
    pricingModel: "$99 - $299/mo ($0 commission)",
    status: "In Discovery",
    targetCustomerProblem: `1. The Nightmare of Double-Selling Unique Singles:
In the collectible card business, the vast majority of high-value inventory consists of unique, single-quantity items (quantity = 1 for a $150 serialized card, a $400 Charizard Base Set, or a $1,200 Black Lotus). Sellers list these cards across Shopify, eBay, TCGplayer Pro, Cardmarket, and their physical store POS simultaneously to maximize visibility. When a walk-in customer purchases that single card at the physical counter on a busy Saturday, incumbent sync systems take 5 to 20 minutes to notify external platforms. During that window, an online buyer purchases the identical card on eBay or TCGplayer, resulting in an immediate out-of-stock collision.

2. Disastrous Marketplace Penalties, Defect Rates & Account Suspensions:
When an overselling double-sale occurs, the merchant is forced to cancel the order on eBay or TCGplayer with the reason 'Item Out of Stock'. Marketplaces treat out-of-stock cancellations with zero tolerance:
• On eBay, item-out-of-stock cancellations trigger a Transaction Defect. If defects exceed 0.5%–2%, eBay demotes the store's search placement algorithmically, slashes seller limits, adds a 5% penalty fee to all future sales, and revokes Top Rated Plus discounts.
• On TCGplayer, out-of-stock cancellation spikes result in instant tier demotions, loss of the TCGplayer Direct program (which drives 40–60% of top-tier store volume), and eventual permanent account bans.
• Loss of buyer trust, negative 1-star feedback, and chargeback disputes.

3. Severe Administrative Fatigue & Multi-Portal Fragmentation:
Store managers spend 2 to 4 hours every single day manually logging into three disparate portals (Shopify Admin, eBay Seller Hub, and TCGplayer Pro Admin) to cross-check inventory counts, adjust prices, edit descriptions, and manually delist cards that sold in other channels. This manual busywork robs owners of time needed to run tournaments, acquire collections, or engage with their community.

4. High-Volatility Release-Day Price Lag & Profit Bleed:
During set prereleases or tournament metagame shifts (e.g., a card winning a Pro Tour on Sunday), secondary market prices fluctuate wildly by 50–200% within hours. Without automated real-time cross-channel repricing, stores sell underpriced singles online to opportunistic arbitrage bots before staff can manually update prices, losing hundreds of dollars in realized gains.

5. Listing Creation Inefficiency Across Disparate Taxonomies:
Creating a single card listing on Shopify requires a title, price, images, tags, and metafields. Listing that same card on eBay requires categorizing it under 'CCG Individual Cards', setting specific condition item specifics ('Graded: No', 'Card Name: Charizard', 'Attribute: Fire', 'Finish: Foil'), and on TCGplayer requires selecting the exact Product ID, SKU, and condition enum. Listing 500 cards across all three platforms manually takes days.`,

    problemsToBuild: `1. Distributed Concurrency, Race Conditions & Sub-500ms Locking:
To prevent double-sales, the system must process real-time inventory delisting in under 500 milliseconds. When an in-store POS barcode scan triggers a sale event:
• The system must immediately acquire a distributed lock (e.g., Redis distributed lock / Redlock) on that card's universal product UUID.
• Fan out asynchronous API requests concurrently to eBay Trading/Inventory API, TCGplayer Catalog API, and Shopify Admin REST/GraphQL APIs.
• If any marketplace API is slow or timing out, the system must handle idempotent retries with guaranteed delivery queues without blocking the POS register.

2. Brutal Marketplace API Rate Limits & Throttling:
• eBay enforces strict call limits (e.g., 5,000 calls per day on basic tiers, throttled burst limits per minute).
• TCGplayer APIs enforce aggressive per-second rate limits.
• When a store initiates a bulk catalog update (e.g., repricing 25,000 singles after a new banlist announcement or set release), sending 25,000 individual HTTP requests instantly triggers HTTP 429 'Too Many Requests' rate limit errors, causing the sync engine to drop requests and fall out of sync. The engine requires sophisticated token bucket algorithms, bulk payload delta batching, and intelligent prioritized queueing (prioritizing high-value $50+ cards over $0.25 bulk cards).

3. Extreme Taxonomy & Schema Normalization Across Disparate APIs:
Every marketplace uses a completely incompatible data structure:
• TCGplayer uses strict internal Product IDs, Category IDs, and standard conditions (Near Mint, Lightly Played, Moderately Played, Heavily Played, Damaged).
• eBay uses open-ended Item Specifics, category-specific aspect dictionaries, and custom condition IDs (1000 = Brand New, 3000 = Used, plus custom graded/ungraded attributes).
• Shopify uses unstructured variants, tags, and metafields.
• Normalizing these conflicting schemas into a single canonical data model—without stripping crucial metadata (e.g., foil etching, artist proof, serial numbers, Japanese language tags)—is an architectural minefield.

4. Out-of-Order Webhooks & Eventual Consistency Split-Brain Risks:
Webhooks from Shopify and eBay do not guarantee in-order delivery. If an update webhook arrives before a creation webhook, or if network latency delays a Shopify webhook during high Black Friday traffic, a naive sync engine will overwrite fresh inventory with stale data (split-brain condition). The architecture must implement monotonic version timestamps, event sourcing, or vector clocks to guarantee strict causality.`,

    competitorAnalysis: `1. BinderPOS:
• Architecture & Implementation: Monolithic multi-tenant Ruby on Rails application using background Sidekiq queues syncing to Shopify and TCGplayer.
• Fatal Flaws & Shortcomings: Notoriously plagued by sync queues backing up during major set releases (like Pokémon Scarlet & Violet or MTG Modern Horizons), causing 15 to 45 minute sync lags that result in massive waves of overselling; locks merchants into their proprietary, dated Shopify frontend theme with zero developer freedom; charges punitive commission transaction fees; lacks reliable, native eBay integration with automated item specific mapping.

2. TCGplayer Pro / Crystal Commerce:
• Architecture & Implementation: Built on 15-year-old legacy server architectures that rely on periodic batch polling (syncing inventory every 15 to 30 minutes via scheduled cron jobs) rather than real-time event-driven webhooks.
• Fatal Flaws & Shortcomings: 15-minute polling windows leave a massive vulnerability gap where items are double-sold constantly; silent sync failures where API connections drop without notifying the merchant; archaic, slow admin interfaces that freeze during peak catalog imports.

3. Generic Multi-Channel Tools (Sellbrite, ChannelEngine, ChannelAdvisor):
• Architecture & Implementation: Designed for traditional standardized retail goods (apparel, consumer electronics) where products have uniform UPC barcodes and fixed specs.
• Fatal Flaws & Shortcomings: Completely incapable of handling collectible card nuances (condition grading tiers, foil finishes, language editions, set symbols, or real-time TCG market price indexing); exorbitantly expensive (costing $500–$2,000/month plus implementation fees) without solving the fundamental TCG double-selling dilemma.

4. Decktradr:
• Architecture & Implementation: Early-stage cloud web application with basic inventory synchronization.
• Fatal Flaws & Shortcomings: Lacks industrial-grade distributed queue infrastructure; cannot handle high-throughput physical POS register concurrency simultaneously with eBay and TCGplayer; lacks real-time algorithmic repricing rules and automated rate limit backoff.`,

    theAeethodSolution: "",
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
