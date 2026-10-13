export interface Competitor {
  id: string;
  name: string;
  parentCompany: string;
  category: 'all-in-one' | 'shopify-apps' | 'pos-mobile';
  categoryLabel: string;
  status: 'active' | 'paused' | 'legacy' | 'early-access' | 'kickstarter';
  statusLabel: string;
  estCustomers: string;
  estARR: string;
  arrNumberM: number;
  churnRate: string;
  churnLevel: 'high' | 'med' | 'low';
  pricing: {
    base: string;
    setupFee: string;
    commissionRate: string;
    hardwareCost: string;
    pricingModel: 'Commission-Heavy' | 'Flat SaaS' | 'Freemium' | 'Enterprise Hybrid' | 'Free / Pre-Revenue';
  };
  offerings: string[];
  moats: string[];
  weaknesses: string[];
  marketingStrategy: string[];
  marketing: {
    channels: string[];
    tactics: string[];
    primaryFunnel: string;
  };
  attackVector: string;
  techStackSummary: string;
  targetMarket: string;
}

export const competitorsData: Competitor[] = [
  // ==========================================
  // PILLAR 1: ALL-IN-ONE TCG COMMERCE PLATFORMS
  // ==========================================
  {
    id: "tcgsync",
    name: "TCG Sync (Storefront Pro)",
    parentCompany: "TCG Sync Ltd",
    category: "all-in-one",
    categoryLabel: "All-in-One Commerce",
    status: "active",
    statusLabel: "Market Leader (1,210+ Stores)",
    estCustomers: "1,210+ shops across 46 countries",
    estARR: "$3.5M – $5.2M ARR",
    arrNumberM: 4.2,
    churnRate: "Low (5% – 7%)",
    churnLevel: "low",
    pricing: {
      base: "Tiered or Enterprise plan",
      setupFee: "£1,000 setup fee",
      commissionRate: "2% of TCG item sales (0% on Enterprise)",
      hardwareCost: "Barcode scanners / POS hardware supported",
      pricingModel: "Commission-Heavy"
    },
    offerings: [
      "Integrated standalone storefront or full Shopify integration",
      "In-store retail POS and high-speed scanner terminal",
      "Automated buylist intake module with store credit payouts",
      "Tournament and event management software",
      "Integrated player deckbuilder and community tools",
      "Live auction engine and native mobile shopping apps"
    ],
    moats: [
      "Huge global scale: 1,210+ stores across 46 countries creates deep international community lock-in",
      "All-in-one feature breadth: native live auctions, deckbuilder, and event ticketing built-in",
      "Enterprise scalability for high-turnover gaming retailers"
    ],
    weaknesses: [
      "Heavy £1,000 setup fee creates high upfront barrier for opening stores",
      "2% sales tax on TCG items eats into store margins as they scale",
      "Complex feature suite can overwhelm small hobby shops wanting just simple inventory"
    ],
    marketingStrategy: [
      "Direct international reseller networks and global tournament sponsorships",
      "Aggressive SEO targeting 'BinderPOS alternative' and 'Shopify TCG store'",
      "Case studies showcasing established stores processing 100k+ monthly singles"
    ],
    marketing: {
      channels: ["Global Reseller Networks", "Tournament Sponsorships", "Google Search SEO", "Direct B2B Outbound"],
      tactics: ["Bidding on 'BinderPOS alternative' search queries", "High-volume store ROI case studies", "Live auction feature webinars"],
      primaryFunnel: "Inbound SEO & Reseller Demo -> £1,000 Setup + 2% Sales or Enterprise Contract"
    },
    attackVector: "Disrupt them with zero setup fees ($0 vs £1,000) and flat-rate pricing (0% commission) with instant 10-minute self-serve onboarding.",
    techStackSummary: "Modern cloud microservices, Node.js, GraphQL, React native mobile apps, Shopify API",
    targetMarket: "Established LGS and multi-channel international card businesses"
  },
  {
    id: "storepass",
    name: "Storepass",
    parentCompany: "Storepass Inc.",
    category: "all-in-one",
    categoryLabel: "All-in-One Commerce",
    status: "active",
    statusLabel: "Premium Enterprise",
    estCustomers: "~250 – 400 premier stores",
    estARR: "$1.4M – $2.2M ARR",
    arrNumberM: 1.8,
    churnRate: "Very Low (<4%)",
    churnLevel: "low",
    pricing: {
      base: "$99/mo (Starter) up to $4,999/mo (Enterprise)",
      setupFee: "Tiered onboarding fee",
      commissionRate: "2% on connected-product sales (Flat plans from $499/mo)",
      hardwareCost: "Modern iPad POS registers",
      pricingModel: "Enterprise Hybrid"
    },
    offerings: [
      "Native integration with Shopify and BigCommerce",
      "Automated real-time pricing engine with margin rules and price floors",
      "High-speed customer buylist with direct Shopify store credit payouts",
      "Device-agnostic POS system supporting multi-register and convention booths",
      "Smart drag-and-drop page builder for card drops and set releases",
      "Fault-tolerant search algorithms with typo tolerance across card sets"
    ],
    moats: [
      "Top-tier reputation among the highest-grossing TCG retailers in North America",
      "Enterprise headless architecture eliminating latency during heavy set drops",
      "Extremely robust buylist workflow that powers store gross margin acquisition"
    ],
    weaknesses: [
      "Flat commission-free pricing only unlocks at $499/month, pricing out smaller shops",
      "Requires existing Shopify or BigCommerce infrastructure familiarity",
      "High-touch sales consultation slows down immediate self-serve signups"
    ],
    marketingStrategy: [
      "Outbound sales to top 200 card retailers in North America and GAMA attendees",
      "Advocacy inside private store owner Discord servers and Reddit communities",
      "Live convention demos at Gen Con, MagicCons, and Collect-A-Con"
    ],
    marketing: {
      channels: ["Direct Outbound Sales", "GAMA Expo", "Private Store Owner Discords (r/magicTCG, r/LGS)", "Convention Booths (Gen Con)"],
      tactics: ["Account-Based Marketing (ABM) for Top 200 Card Retailers", "Peer advocacy from top-tier store owners", "Headless speed benchmarks vs BinderPOS"],
      primaryFunnel: "High-Touch Consultation Demo -> Custom Shopify Setup -> $499/mo Flat Tier"
    },
    attackVector: "Deliver 90% of Storepass's enterprise speed and features at an accessible self-serve $149–$249/mo flat rate tailored for mid-market game stores.",
    techStackSummary: "Next.js / Node.js, GraphQL, PostgreSQL, Redis cache layer, Shopify Headless API",
    targetMarket: "High-volume card retailers and multi-location gaming centers"
  },
  {
    id: "crystalcommerce",
    name: "Crystal Commerce",
    parentCompany: "Independent Incumbent",
    category: "all-in-one",
    categoryLabel: "All-in-One Commerce",
    status: "legacy",
    statusLabel: "Legacy Incumbent",
    estCustomers: "~527 active stores (Storeleads 2026)",
    estARR: "$2.0M – $2.6M ARR",
    arrNumberM: 2.3,
    churnRate: "Moderate-High (12% – 16%)",
    churnLevel: "high",
    pricing: {
      base: "$99 / month",
      setupFee: "$0.99 setup promo (historically $599)",
      commissionRate: "2.5% on webstore & marketplace sales (0% on POS)",
      hardwareCost: "Proprietary register hardware bundles",
      pricingModel: "Commission-Heavy"
    },
    offerings: [
      "Closed-platform web store, inventory manager, and POS system",
      "Broad multi-category catalog: TCGs, board games, miniatures, and comics",
      "Multi-channel syndication to eBay, Amazon, and TCGplayer",
      "In-store buylist trade-in kiosks and price management",
      "Automated shipping label printing and batch order fulfillment"
    ],
    moats: [
      "Deeply rooted with veteran hobby retailers operating since 2008",
      "Handles board games, comics, and tabletop miniatures in addition to card singles",
      "Proprietary all-in-one ecosystem requires no external third-party subscriptions"
    ],
    weaknesses: [
      "Dated 2010s software architecture; sluggish database searches on large catalogs",
      "Overselling issues caused by sync delays between POS and eBay/TCGplayer",
      "Closed webstore templates convert poorly on mobile compared to modern Shopify"
    ],
    marketingStrategy: [
      "Word-of-mouth in legacy game store owner networks and Facebook groups",
      "Annual exhibitor booth at GAMA Expo and distributor open houses",
      "Wholesale distributor referrals (Alliance Game Distributors, GTS)"
    ],
    marketing: {
      channels: ["Distributor Referrals (Alliance, GTS)", "GAMA Trade Show", "Legacy Retailer Facebook Groups"],
      tactics: ["$0.99 Setup Promo Deals to defend against Shopify apps", "Bundling tabletop board games & comics catalog support"],
      primaryFunnel: "Distributor Onboarding Bundle -> $99/mo + 2.5% Marketplace Sales"
    },
    attackVector: "Offer a seamless 1-click catalog import from Crystal Commerce to your platform, eliminating their sync lag and providing modern mobile storefronts.",
    techStackSummary: "Legacy PHP / MySQL monolithic architecture, custom hosting infrastructure",
    targetMarket: "Traditional brick-and-mortar hobby shops with multi-channel marketplace syndication"
  },
  {
    id: "binderpos",
    name: "BinderPOS",
    parentCompany: "Collectors / PSA (acquired via TCGplayer)",
    category: "all-in-one",
    categoryLabel: "All-in-One Commerce",
    status: "paused",
    statusLabel: "Signups Paused (Feb 2025)",
    estCustomers: "800 – 1,200 stores",
    estARR: "$6.5M – $9.5M ARR",
    arrNumberM: 8.0,
    churnRate: "High Risk (18% – 25%)",
    churnLevel: "high",
    pricing: {
      base: "$100 – $150 / month",
      setupFee: "$0 (historical)",
      commissionRate: "2.0% – 2.5% on all online sales",
      hardwareCost: "Standard iPad / Zebra barcode scanners",
      pricingModel: "Commission-Heavy"
    },
    offerings: [
      "Deep Shopify integration with instant auto-cataloging",
      "TCGplayer automated marketplace sync & real-time pricing",
      "Customer-facing buylist module with automatic store credit issuance",
      "In-store POS register system designed for high-SKU inventory",
      "Tournament and event management integration",
      "PSA Grading intake submission workflow"
    ],
    moats: [
      "Official partner ecosystem with TCGplayer & Collectors / PSA grading vault",
      "Extreme switching costs for stores with 100,000+ conditioned cards in Shopify",
      "Longstanding brand recognition as the legacy default for card shops"
    ],
    weaknesses: [
      "New store signups completely frozen in February 2025; product in maintenance mode",
      "Merchant hostility toward paying 2.5% commission on top of 10.25% TCGplayer fees & 3% processing",
      "Severe post-acquisition customer support degradation and long ticket resolution delays",
      "Webhook sync lag during high-traffic prerelease sets leading to inventory overselling"
    ],
    marketingStrategy: [
      "Direct in-app prompts inside the TCGplayer Pro seller dashboard",
      "Shopify App Store SEO dominance for 'TCG' and 'Trading Card Game'",
      "Exhibitor sponsorships at GAMA Expo and distributor trade days",
      "Currently zero active marketing acquisition spend due to onboarding halt"
    ],
    marketing: {
      channels: ["TCGplayer Pro Seller Portal Prompts", "Shopify App Store SEO", "GAMA Expo", "Distributor Trade Days"],
      tactics: ["In-app Level 4 seller upgrade notices", "PSA Grading submission workflow upsells", "Pre-installed Shopify partner app positioning"],
      primaryFunnel: "TCGplayer In-App Upgrade -> Shopify App Install -> 2.5% Online Sales Cut (Currently Frozen)"
    },
    attackVector: "Position as 'The Modern BinderPOS Upgrade': Offer 1-click Shopify catalog migration with 0% sales commission, sub-second sync, and responsive human support.",
    techStackSummary: "Ruby on Rails / Node.js backend, Shopify App API wrapper, AWS EC2, PostgreSQL",
    targetMarket: "Physical brick-and-mortar game stores running Shopify"
  },
  {
    id: "rareos",
    name: "rareOS",
    parentCompany: "rareOS Inc.",
    category: "all-in-one",
    categoryLabel: "All-in-One Commerce",
    status: "early-access",
    statusLabel: "Early Access / Buy-Sell-Trade",
    estCustomers: "~100 – 250 early stores",
    estARR: "Pre-Revenue / Early Monetization",
    arrNumberM: 0.2,
    churnRate: "Low (<5% Early Adopters)",
    churnLevel: "low",
    pricing: {
      base: "$0 / month (Early Access)",
      setupFee: "$0 upfront cost",
      commissionRate: "No monthly platform fee (currently in early access)",
      hardwareCost: "Standard mobile camera / tablet",
      pricingModel: "Free / Pre-Revenue"
    },
    offerings: [
      "Operating system designed specifically for Buy-Sell-Trade shops (TCG, retro games, comics)",
      "Standout AI-powered batch photo intake for instant trade-ins",
      "Real-time valuation pulling from PriceCharting and marketplace transaction data",
      "Omnichannel inventory tracker with multi-category condition rating",
      "In-store trade-in ticket generator and payout logging"
    ],
    moats: [
      "AI computer vision batch intake: photographs multiple items simultaneously to identify and price",
      "Cross-category support: uniquely serves retro video games, comics, and TCG in one system",
      "$0 early access entry barrier with no monthly software fee"
    ],
    weaknesses: [
      "Early stage with evolving feature maturity and potential platform stability shifts",
      "Monetization model unannounced post-early access, creating uncertainty for retailers",
      "Less mature multi-channel marketplace syndication (TCGplayer Direct / Cardmarket)"
    ],
    marketingStrategy: [
      "Viral Twitter/X and LinkedIn product videos demonstrating batch photo trade-in scanning",
      "Targeting retro video game and collectible swap meets and convention dealers",
      "Early access waitlist community with direct founder onboarding"
    ],
    marketing: {
      channels: ["Twitter/X Tech & Collector Community", "LinkedIn Product Videos", "Retro Video Game Swap Meets", "Founder Outbound"],
      tactics: ["Viral AI batch photo intake video demos", "Free Early Access with no monthly platform fee", "Direct founder Discord onboarding sessions"],
      primaryFunnel: "Viral Video Demo -> Free Early Access Beta Onboarding -> Future Monetization"
    },
    attackVector: "Offer mature multi-channel inventory syndication (eBay + TCGplayer + Cardmarket) that rareOS lacks, while matching their AI batch intake speed.",
    techStackSummary: "Next.js, Python AI computer vision models, PriceCharting API, Cloudflare Workers",
    targetMarket: "Buy-sell-trade stores dealing in TCGs, retro video games, and collectibles"
  },
  {
    id: "sortswift",
    name: "SortSwift",
    parentCompany: "SortSwift Technologies",
    category: "all-in-one",
    categoryLabel: "All-in-One Commerce",
    status: "active",
    statusLabel: "Hardware + Chaos Storage",
    estCustomers: "~400 – 700 users/stores",
    estARR: "$450K – $900K ARR",
    arrNumberM: 0.7,
    churnRate: "Moderate (9% – 12%)",
    churnLevel: "med",
    pricing: {
      base: "Free Entry (up to 5k items); 9 Bundles ($19 to $499/mo; $219/mo min for Buylist) or A La Carte",
      setupFee: "$0 ($249 one-time for TCGplayer Sync Box appliance)",
      commissionRate: "0% on POS & synced marketplaces; 2% on SortSwift storefront orders",
      hardwareCost: "Super Sorter Mini 9-bin ($8,999) or 29-bin ($24,999) + $199/mo device scan plan; Sync Box ($249)",
      pricingModel: "Freemium"
    },
    offerings: [
      "Integrated software suite: inventory management, auto-pricing via TCGplayer",
      "Buylist trade-in management with store credit payouts",
      "Shopify and multi-channel marketplace integrations",
      "Chaos-style organization: Bin-level card tracking (random slot storage with barcode locators)",
      "Mechanical hardware integration with the Super Sorter automated card sorter"
    ],
    moats: [
      "Chaos-style bin-level tracking: allows stores to store cards randomly and find them in seconds via bin IDs",
      "Mechanical card sorting hardware integration provides extreme switching cost moat",
      "Generous freemium tier with free scanning up to 5,000 items"
    ],
    weaknesses: [
      "Full efficiency requires proprietary sorting hardware investment",
      "Bin-level chaos storage requires disciplined physical barcode scanning by store staff",
      "Hardware manufacturing lead times and mechanical wear-and-tear support"
    ],
    marketingStrategy: [
      "Viral TikTok and YouTube Shorts showing automated mechanical card sorting",
      "Freemium software tier acting as a lead magnet for hardware sales",
      "Live hardware booths at trade shows (GAMA, Gen Con, Collect-A-Con)"
    ],
    marketing: {
      channels: ["TikTok & YouTube Shorts", "Shopify App Store", "Trade Shows (GAMA, Gen Con, Collect-A-Con)"],
      tactics: ["Viral mechanical sorting machine video demonstrations", "Free tier for up to 5,000 items (chaos tracking lead magnet)", "Live trade show sorting challenges"],
      primaryFunnel: "Freemium Software Signup -> Paid Bundle ($219-$499/mo) -> Hardware Upsell ($8,999 - $24,999 Super Sorter + $199/mo)"
    },
    attackVector: "Build software-based chaos bin management and 14-point Pokémon variant CV without gating exact printing/foil behind expensive monthly scan credit tiers or $8,999–$24,999 mechanical sorting machines.",
    techStackSummary: "Embedded firmware, OpenCV, React web dashboard, Shopify REST/GraphQL API",
    targetMarket: "High-volume card shops and sorting warehouses processing massive bulk singles"
  },
  {
    id: "blstr",
    name: "blstr",
    parentCompany: "blstr Software",
    category: "all-in-one",
    categoryLabel: "All-in-One Commerce",
    status: "active",
    statusLabel: "Modern SaaS Challenger",
    estCustomers: "~150 – 300 stores",
    estARR: "$180K – $360K ARR",
    arrNumberM: 0.3,
    churnRate: "Low-Moderate (6% – 8%)",
    churnLevel: "med",
    pricing: {
      base: "$100 / month",
      setupFee: "$0 (30-day free trial)",
      commissionRate: "0% (Flat SaaS subscription)",
      hardwareCost: "Standard camera / phone",
      pricingModel: "Flat SaaS"
    },
    offerings: [
      "Inventory and workflow management platform for TCG stores and card vendors",
      "Automated card pricing utilizing live TCGplayer market data feeds",
      "Smart buylist rules with dynamic profit margins and condition deductions",
      "Seamless bi-directional synchronization with Shopify storefronts",
      "30-day risk-free trial with full onboarding support"
    ],
    moats: [
      "Clean, modern UI designed specifically to avoid legacy bloat",
      "Transparent flat-rate pricing ($100/mo) with zero commission on sales",
      "Generous 30-day free trial lowers merchant adoption risk"
    ],
    weaknesses: [
      "Smaller development team with narrower marketplace syndication (lacks native Cardmarket/eBay sync)",
      "Lacks dedicated in-store POS hardware integration for physical counter barcode scanning",
      "Early brand awareness compared to TCG Sync or Storepass"
    ],
    marketingStrategy: [
      "Direct outreach in TCG store owner Facebook groups and Discord channels",
      "Offering generous 30-day full-feature free trials to converting BinderPOS users",
      "Content marketing highlighting transparent flat $100/mo pricing vs 2% commission fees"
    ],
    marketing: {
      channels: ["TCG Store Owner Facebook Groups", "LGS Discord Communities", "Content Marketing & Blogs"],
      tactics: ["Transparent flat $100/mo comparison targeting BinderPOS churn", "Generous 30-day risk-free full-feature trial", "Direct founder DM outreach in retailer chats"],
      primaryFunnel: "30-Day Free Trial (No Credit Card) -> $100/mo Flat SaaS Conversion"
    },
    attackVector: "Out-feature blstr by providing native physical POS hardware support and multi-marketplace sync (eBay + Cardmarket) alongside Shopify.",
    techStackSummary: "Next.js, Node.js, PostgreSQL, TCGplayer API integration, Shopify Webhooks",
    targetMarket: "Independent card stores and high-volume Shopify sellers looking for clean workflows"
  },
  {
    id: "shadowpos",
    name: "ShadowPOS",
    parentCompany: "ShadowPOS Inc.",
    category: "all-in-one",
    categoryLabel: "All-in-One Commerce",
    status: "active",
    statusLabel: "Hardware-Integrated POS",
    estCustomers: "~100 – 200 stores",
    estARR: "$120K – $240K ARR",
    arrNumberM: 0.2,
    churnRate: "Moderate (8% – 10%)",
    churnLevel: "med",
    pricing: {
      base: "Tiered SaaS plans (~$79 – $149/mo)",
      setupFee: "$0",
      commissionRate: "Low / 0% on flat tiers",
      hardwareCost: "CardBot hardware kiosk compatible",
      pricingModel: "Flat SaaS"
    },
    offerings: [
      "Point of sale and e-commerce platform built specifically for local game stores and TCG sellers",
      "Direct integration with CardCastle's CardBot automated card scanner for single-click listing",
      "Multi-channel inventory synchronization across POS and online storefront",
      "Integrated buylist intake with automated trade-in value calculations",
      "Event ticketing and customer loyalty tracking"
    ],
    moats: [
      "Single-click card listing through direct CardBot hardware integration",
      "Built specifically from the ground up for brick-and-mortar game store workflows",
      "Affordable entry pricing compared to Storepass"
    ],
    weaknesses: [
      "Reliance on CardBot hardware partnership for its premier card intake capability",
      "Relatively new platform with limited enterprise feature set for multi-location stores",
      "Smaller brand visibility in the broader TCG retail ecosystem"
    ],
    marketingStrategy: [
      "Co-marketing and hardware bundling with CardCastle / CardBot sales reps",
      "Regional store demonstrations at gaming conventions and tabletop events",
      "Targeting dissatisfied legacy POS stores on Reddit's r/LGS"
    ],
    marketing: {
      channels: ["CardCastle / CardBot Partner Ecosystem", "Regional Tabletop Conventions", "Reddit r/LGS"],
      tactics: ["Co-marketing with CardBot hardware sales reps", "1-click card listing workflow demonstrations", "Legacy POS replacement discount offers"],
      primaryFunnel: "CardBot Hardware Demo -> ShadowPOS Software Trial -> $79–$149/mo Subscription"
    },
    attackVector: "Offer camera-based AI scanning on any tablet or smartphone, removing the dependency on expensive third-party CardBot hardware.",
    techStackSummary: "React, Electron POS client, Cloud Firestore / PostgreSQL backend",
    targetMarket: "Local game store owners seeking integrated retail checkout and automated scanning"
  },
  {
    id: "prism",
    name: "PRISM",
    parentCompany: "PRISM Kickstarter Project",
    category: "all-in-one",
    categoryLabel: "All-in-One Commerce",
    status: "kickstarter",
    statusLabel: "Crowdfunded / Status Unclear",
    estCustomers: "Community backers (unreleased / beta)",
    estARR: "Pre-Revenue",
    arrNumberM: 0.05,
    churnRate: "Unknown",
    churnLevel: "low",
    pricing: {
      base: "$0 subscription fee (Backer model)",
      setupFee: "One-time Kickstarter backing fee",
      commissionRate: "0% commission",
      hardwareCost: "Standard hardware",
      pricingModel: "Free / Pre-Revenue"
    },
    offerings: [
      "All-in-one operating system for TCG card shops and vendors",
      "Comprehensive buying, selling, and trading interface",
      "Granular physical inventory card location tracker (binder, box, shelf, slot)",
      "Zero recurring subscription model promise",
      "Integrated customer ledger and trade balances"
    ],
    moats: [
      "Promised zero subscription fees resonated strongly with community backers",
      "Detailed physical card location tracking built into the core data schema"
    ],
    weaknesses: [
      "Kickstarter project with unclear production roadmap and delivery status",
      "Zero recurring revenue business model makes long-term cloud infrastructure support doubtful",
      "Lacks enterprise compliance, payment processing partnerships, and multi-channel API support"
    ],
    marketingStrategy: [
      "Kickstarter crowdfunding campaign targeting frustrated TCG store owners",
      "Community Reddit threads and collector Discord discussions"
    ],
    marketing: {
      channels: ["Kickstarter Crowdfunding Platform", "Reddit r/magicTCG & r/PokemonTCG", "Collector Discords"],
      tactics: ["'No Monthly Fees Ever' anti-SaaS crowdfunding pitch", "Community feature voting and backer tier badges"],
      primaryFunnel: "Kickstarter Pledge -> Lifetime Software Access (Status Unclear)"
    },
    attackVector: "Deliver a professionally maintained, cloud-backed enterprise platform that businesses can rely on without Kickstarter project delivery risks.",
    techStackSummary: "Prototype Electron / Desktop application",
    targetMarket: "Budget-conscious card shops and vendors wanting to avoid ongoing software subscriptions"
  },
  {
    id: "mykapos",
    name: "DMM マイカポス (MyKapos)",
    parentCompany: "DMM.com Group (Japan)",
    category: "all-in-one",
    categoryLabel: "All-in-One Commerce",
    status: "active",
    statusLabel: "Japanese Market Leader (200+ Stores)",
    estCustomers: "200+ physical card shops in Japan",
    estARR: "¥250M – ¥400M JPY (~$1.8M – $2.8M USD)",
    arrNumberM: 2.2,
    churnRate: "Very Low (<3%)",
    churnLevel: "low",
    pricing: {
      base: "Custom monthly subscription (JPY tiered)",
      setupFee: "Standard terminal setup",
      commissionRate: "EC integration take-rate",
      hardwareCost: "Japanese POS terminal & thermal printer bundles",
      pricingModel: "Enterprise Hybrid"
    },
    offerings: [
      "Japanese POS system engineered specifically for trading card specialty shops",
      "Seamless management of card buying (kaitori), in-store sales, and warehouse inventory",
      "Direct integration with Japanese E-Commerce (EC) marketplaces and Yahoo! Auctions",
      "High-speed barcode scanning for Japanese set printings and rarity conditions",
      "Automated tax compliance with Japanese consumption tax and invoice system regulations"
    ],
    moats: [
      "Dominates the domestic Japanese card shop market (Akihabara, Osaka Nipponbashi, Nakano)",
      "Backed by the immense corporate infrastructure of DMM.com Group",
      "Flawless handling of Japanese language, regional card conditions, and kaitori trade-in laws"
    ],
    weaknesses: [
      "Exclusively restricted to the Japanese domestic market; zero English or Western support",
      "Does not connect to Western marketplaces like TCGplayer, Cardmarket, or Whatnot",
      "Closed Japanese enterprise software architecture with rigid vendor contracts"
    ],
    marketingStrategy: [
      "Direct B2B enterprise sales across Japanese hobby chains (Card Kingdom, Yellow Submarine, Amenity Dream)",
      "Exhibitor at Japanese card game events and DMM B2B enterprise seminars",
      "Exclusive partnerships with Japanese distributors"
    ],
    marketing: {
      channels: ["DMM.com Corporate Enterprise B2B", "Japanese Hobby Retail Chains", "Japanese Card Game Seminars"],
      tactics: ["Enterprise chain-wide contracts with Akihabara & Osaka card store groups", "Kaitori (trade-in) legal compliance guarantee", "Yahoo! Auctions Japan direct integration"],
      primaryFunnel: "Enterprise B2B Proposal -> Japanese Hardware POS Terminal Install -> Monthly Maintenance"
    },
    attackVector: "Dominate Western markets (US, EU, UK) and eventually offer a cross-border bridge for Japanese card shops exporting singles to TCGplayer and eBay.",
    techStackSummary: "Enterprise Java / Spring POS architecture, Japanese cloud hosting, EC integrations",
    targetMarket: "Japanese brick-and-mortar trading card shops and specialty chains"
  },

  // ==========================================
  // PILLAR 2: SHOPIFY APPS & TOOLS
  // ==========================================
  {
    id: "tcgautomate",
    name: "TCG Automate",
    parentCompany: "TCG Automate Inc.",
    category: "shopify-apps",
    categoryLabel: "Shopify Apps & Tools",
    status: "active",
    statusLabel: "Batch AI Listing",
    estCustomers: "~500 – 1,000 sellers",
    estARR: "$600K – $1.1M ARR",
    arrNumberM: 0.8,
    churnRate: "Moderate (10% – 12%)",
    churnLevel: "med",
    pricing: {
      base: "Tiered usage pricing based on listing volume",
      setupFee: "$0",
      commissionRate: "0% on sales",
      hardwareCost: "Standard mobile camera / webcam",
      pricingModel: "Flat SaaS"
    },
    offerings: [
      "Powerful batch listing workflow turning card photos into marketplace-ready listings",
      "Instant AI card image matching across Magic, Pokémon, and modern TCGs",
      "Direct listing syndication to eBay, TCGplayer, Whatnot, Shopify, and more",
      "Automated pricing integration based on recent market transactions",
      "Batch title and description formatting with SEO card attributes"
    ],
    moats: [
      "Specialized AI vision pipeline that transforms raw card photos directly into live multi-channel listings",
      "Multi-platform syndication including live auction platforms like Whatnot"
    ],
    weaknesses: [
      "Focuses purely on listing ingestion; lacks in-store POS registers and inventory decrementing",
      "No customer buylist trade-in module for physical store customers",
      "Usage-based pricing can scale uncomfortably for massive bulk ingestions"
    ],
    marketingStrategy: [
      "Social media video ads showing hands fanning out cards and instantly generating eBay listings",
      "Sponsorships of Whatnot card breakers and YouTube card flippers",
      "Direct app store marketing on Shopify"
    ],
    marketing: {
      channels: ["YouTube Card Flipping Creators", "Whatnot Breaker Sponsorships", "Shopify App Store Ads", "Instagram Video Ads"],
      tactics: ["Fanning out cards under camera video ads generating 100 eBay listings in 60s", "Whatnot streamer workflow demos", "Free 50-card starter scan credits"],
      primaryFunnel: "Free 50 Card Batch Trial -> Usage-Based Tier ($49 - $199/mo)"
    },
    attackVector: "Incorporate their AI batch listing speed into a complete all-in-one inventory and POS platform so stores don't need a separate subscription.",
    techStackSummary: "Next.js, Python computer vision API, eBay REST API, Shopify GraphQL",
    targetMarket: "Card dealers and power sellers listing high volumes on eBay, Whatnot, and Shopify"
  },
  {
    id: "gamelocker",
    name: "Game Locker",
    parentCompany: "Game Locker Apps",
    category: "shopify-apps",
    categoryLabel: "Shopify Apps & Tools",
    status: "active",
    statusLabel: "Shopify Inventory App",
    estCustomers: "~300 – 600 stores",
    estARR: "$250K – $450K ARR",
    arrNumberM: 0.35,
    churnRate: "Low-Moderate (7% – 9%)",
    churnLevel: "med",
    pricing: {
      base: "Free tier available; Paid tiers ~$29 – $99/mo",
      setupFee: "$0",
      commissionRate: "0%",
      hardwareCost: "Standard Shopify POS hardware",
      pricingModel: "Freemium"
    },
    offerings: [
      "Real-time inventory management designed specifically for TCG stores on Shopify",
      "Smart automation rules for buying, selling, and order fulfillment",
      "Multi-location inventory routing and warehouse transfer management",
      "Automated stock level alerts and low-stock replenishment tracking",
      "Generous free pricing tier for emerging stores"
    ],
    moats: [
      "Native Shopify ecosystem integration with smooth multi-location inventory support",
      "Freemium pricing model captures new Shopify merchants early"
    ],
    weaknesses: [
      "Lacks deep external marketplace sync to TCGplayer and Cardmarket",
      "No automated AI card scanner; relies on barcode scans or manual item setup",
      "Basic buylist capabilities compared to specialized systems like Storepass"
    ],
    marketingStrategy: [
      "Shopify App Store search optimization for 'TCG inventory' and 'game store inventory'",
      "Targeting newly registered Shopify stores in the hobby & gaming category",
      "Freemium conversion funnels"
    ],
    marketing: {
      channels: ["Shopify App Store SEO", "New Shopify Merchant Onboarding Emails", "Tabletop Retail Blogs"],
      tactics: ["Free tier with full basic inventory management", "Automated multi-location transfer features", "One-click install from Shopify store"],
      primaryFunnel: "Free Shopify App Install -> Paid Tier Upgrade when exceeding SKU limits"
    },
    attackVector: "Provide deep marketplace integration (TCGplayer + eBay + Cardmarket) that Game Locker lacks, uniting online sales with Shopify.",
    techStackSummary: "Remix / React Shopify App, Node.js backend, Shopify Polaris UI",
    targetMarket: "Shopify-first game stores managing multi-location physical inventory"
  },
  {
    id: "synqtcg",
    name: "Synq ‑ TCG Manager",
    parentCompany: "Synq Apps",
    category: "shopify-apps",
    categoryLabel: "Shopify Apps & Tools",
    status: "active",
    statusLabel: "Multi-Game Auto Sync",
    estCustomers: "~400 – 750 stores",
    estARR: "$350K – $600K ARR",
    arrNumberM: 0.45,
    churnRate: "Moderate (8% – 10%)",
    churnLevel: "med",
    pricing: {
      base: "Starts at $29 / month",
      setupFee: "$0",
      commissionRate: "0% (Flat subscription)",
      hardwareCost: "POS barcode scanner support",
      pricingModel: "Flat SaaS"
    },
    offerings: [
      "Daily automated TCGplayer market price synchronization directly to Shopify products",
      "Automatic product creation and catalog updates across 16 different card games",
      "Support for Shopify POS barcode scanning at physical registers",
      "Automated variant structuring (Condition, Foil, Language) within Shopify SKU limits",
      "Real-time price rounding and margin rule adjustments"
    ],
    moats: [
      "Broad multi-game coverage: Supports 16 TCGs (Pokémon, MTG, Yu-Gi-Oh, One Piece, Lorcana, etc.)",
      "Low, affordable entry pricing starting at just $29/month with zero commission"
    ],
    weaknesses: [
      "Subject to Shopify's variant limits (100 variants per product) without complex workarounds",
      "Lacks customer-facing buylist kiosks and trade-in workflows",
      "Does not sync back to TCGplayer or eBay (one-way price fetch into Shopify)"
    ],
    marketingStrategy: [
      "Shopify App Store reviews and rankings",
      "Direct comparison posts with LGS Forge and manual CSV upload methods",
      "Word-of-mouth in retailer groups for newly popular games like One Piece and Lorcana"
    ],
    marketing: {
      channels: ["Shopify App Store Reviews & Rankings", "Shopify Community Forums", "Word of Mouth for One Piece / Lorcana"],
      tactics: ["Aggressive pricing comparison ($29/mo vs 2% commission)", "Multi-game support for 16 TCGs in one app", "High rating review generation incentives"],
      primaryFunnel: "14-Day Free Trial -> $29/mo Flat Subscription"
    },
    attackVector: "Provide bi-directional synchronization (not just one-way price updates) so sales on Shopify immediately decrement TCGplayer and eBay listings.",
    techStackSummary: "Shopify App Bridge, Node.js worker queues, TCGplayer public price APIs",
    targetMarket: "Shopify card shops wanting automated multi-game pricing without paying 2% commission"
  },
  {
    id: "tcgimporter",
    name: "TCG Importer",
    parentCompany: "Independent",
    category: "shopify-apps",
    categoryLabel: "Shopify Apps & Tools",
    status: "active",
    statusLabel: "Bulk Catalog Ingestion",
    estCustomers: "~250 – 500 stores",
    estARR: "$150K – $300K ARR",
    arrNumberM: 0.2,
    churnRate: "High (14% – 18% as stores finish importing)",
    churnLevel: "high",
    pricing: {
      base: "Tiered subscription with free trial (~$19 – $59/mo)",
      setupFee: "$0",
      commissionRate: "0%",
      hardwareCost: "Software only",
      pricingModel: "Flat SaaS"
    },
    offerings: [
      "Bulk import tool for TCG singles and sealed products directly into Shopify",
      "Automates card metadata, high-res images, pricing rules, and SEO product tags",
      "Pre-formatted set catalogs ready for one-click ingestion",
      "Handles condition variants and foil finishes cleanly",
      "Free trial period for testing catalog setups"
    ],
    moats: [
      "Specialized import utility that saves store owners hundreds of hours of manual catalog creation",
      "Pre-scraped high-resolution card imagery and official card attributes"
    ],
    weaknesses: [
      "High utility churn: Once a store finishes importing their master catalog, they may cancel",
      "Does not provide ongoing POS checkout or dynamic live repricing bots",
      "Narrow single-purpose tool that must be paired with other apps"
    ],
    marketingStrategy: [
      "Shopify App Store SEO for 'TCG bulk import' and 'card catalog importer'",
      "Targeted blog tutorials on 'How to launch a Pokémon card Shopify store in 1 day'",
      "Free trial activation campaigns"
    ],
    marketing: {
      channels: ["Shopify App Store Search", "YouTube 'How to start a Pokémon TCG store' tutorials", "Google Search Ads"],
      tactics: ["Pre-formatted CSV set catalog downloads", "Free trial for initial set import", "SEO-optimized card product descriptions"],
      primaryFunnel: "Free Trial -> 1-Month Plan to complete catalog import -> High churn"
    },
    attackVector: "Include master catalog instant pre-population natively in your core SaaS so merchants never need a separate import app.",
    techStackSummary: "Shopify GraphQL Product API, AWS S3 image delivery, Node.js background workers",
    targetMarket: "New and expanding Shopify stores importing massive card catalogs"
  },
  {
    id: "cardupkeep",
    name: "CardUpkeep",
    parentCompany: "CardUpkeep Software",
    category: "shopify-apps",
    categoryLabel: "Shopify Apps & Tools",
    status: "active",
    statusLabel: "Automated Shopify Sync",
    estCustomers: "~150 – 300 stores",
    estARR: "$100K – $200K ARR",
    arrNumberM: 0.15,
    churnRate: "Moderate (9% – 11%)",
    churnLevel: "med",
    pricing: {
      base: "Monthly SaaS (~$29 – $79/mo)",
      setupFee: "$0",
      commissionRate: "0%",
      hardwareCost: "Standard hardware",
      pricingModel: "Flat SaaS"
    },
    offerings: [
      "Automated live pricing updates directly for Shopify stores",
      "Multi-game inventory support for Magic: The Gathering, Pokémon, and Riftbound",
      "Condition matrix pricing (Near Mint, Lightly Played, etc.)",
      "Automatic out-of-stock management to hide zero-quantity singles",
      "Scheduled repricing runs based on recent market shifts"
    ],
    moats: [
      "Early support for emerging card games like Riftbound alongside MTG and Pokémon",
      "Lightweight Shopify-native setup that doesn't slow down store theme loading"
    ],
    weaknesses: [
      "Limited game catalog compared to Synq's 16 games",
      "Lacks customer buylist portal and in-store counter checkout features",
      "No multi-channel syndication to eBay or European Cardmarket"
    ],
    marketingStrategy: [
      "Direct engagement in emerging TCG communities (Riftbound, Altered, Sorcery)",
      "Shopify App Store organic listings",
      "Word-of-mouth recommendations among indie Shopify store operators"
    ],
    marketing: {
      channels: ["Emerging TCG Communities (Riftbound, Altered, Sorcery)", "Shopify App Store", "Indie Retailer Discords"],
      tactics: ["Early-adopter set support for niche card games", "Lightweight theme performance marketing", "Direct creator outreach"],
      primaryFunnel: "Free Trial -> $29–$79/mo Subscription"
    },
    attackVector: "Offer complete multi-marketplace sync (Shopify + TCGplayer + Cardmarket) with automated trade-in buylists.",
    techStackSummary: "React, Node.js, Shopify App Bridge, Scryfall / TCGplayer APIs",
    targetMarket: "Shopify stores specializing in MTG, Pokémon, and indie collectible card games"
  },
  {
    id: "koritcg",
    name: "Kori TCG Manager",
    parentCompany: "Kori Apps",
    category: "shopify-apps",
    categoryLabel: "Shopify Apps & Tools",
    status: "active",
    statusLabel: "Budget Shopify Manager",
    estCustomers: "~200 – 400 stores",
    estARR: "$80K – $160K ARR",
    arrNumberM: 0.12,
    churnRate: "Moderate (10% – 13%)",
    churnLevel: "med",
    pricing: {
      base: "$14.99 – $24.99 / month",
      setupFee: "$0 (14-day free trial)",
      commissionRate: "0%",
      hardwareCost: "Software only",
      pricingModel: "Flat SaaS"
    },
    offerings: [
      "Streamlines TCG inventory management and sales tracking on Shopify",
      "Automated card price adjustments based on market feeds",
      "Clean bulk editing tools for condition grades and stock adjustments",
      "14-day full feature free trial",
      "Low-cost budget tier ($14.99/mo) tailored for small boutique sellers"
    ],
    moats: [
      "Extremely affordable price point ($14.99/mo) making it accessible to micro-merchants",
      "Simple, unbloated interface for basic inventory adjustments"
    ],
    weaknesses: [
      "Basic feature set; lacks advanced POS workflows, buylist portals, and automated card scanning",
      "Not suitable for large stores handling 100k+ singles",
      "No marketplace integrations beyond Shopify"
    ],
    marketingStrategy: [
      "Positioned as the budget-friendly alternative to expensive $100+/mo solutions",
      "Shopify App Store visibility under budget filter searches",
      "Targeting small hobbyists turning into commercial sellers"
    ],
    marketing: {
      channels: ["Shopify App Store Budget Filters", "Micro-Seller Reddit Threads", "Side-Hustle Card Flipping Groups"],
      tactics: ["Lowest-price guarantee ($14.99/mo)", "14-day free trial", "Simplified unbloated UI for non-technical users"],
      primaryFunnel: "14-Day Trial -> $14.99/mo Entry Plan"
    },
    attackVector: "Highlight that low-cost tools lack real-time multi-channel sync, leaving stores exposed to overselling and marketplace bans.",
    techStackSummary: "Node.js, Shopify REST API, Tailwind CSS, lightweight Postgres",
    targetMarket: "Small hobby sellers and indie card shops on tight budgets"
  },
  {
    id: "lgsforge",
    name: "LGS Forge",
    parentCompany: "LGS Forge",
    category: "shopify-apps",
    categoryLabel: "Shopify Apps & Tools",
    status: "active",
    statusLabel: "Direct Synq Competitor",
    estCustomers: "~150 – 300 stores",
    estARR: "$90K – $180K ARR",
    arrNumberM: 0.14,
    churnRate: "Moderate (9% – 12%)",
    churnLevel: "med",
    pricing: {
      base: "Tiered SaaS subscription (~$29 – $69/mo)",
      setupFee: "$0",
      commissionRate: "0%",
      hardwareCost: "Standard barcode scanner support",
      pricingModel: "Flat SaaS"
    },
    offerings: [
      "Dedicated Shopify app built specifically for local game store operations",
      "Automated TCG pricing feeds and bulk inventory adjustments",
      "Direct competitor to Synq TCG Manager for Shopify catalog sync",
      "Condition and finish matrix mapping (Foil, Non-Foil, Etched)",
      "Simple barcode-ready product structuring for physical counter checkouts"
    ],
    moats: [
      "Built with direct input from local game store operators",
      "Competitive pricing aimed directly at taking market share from Synq"
    ],
    weaknesses: [
      "Frequent head-to-head competition with Synq TCG Manager without distinct technical moats",
      "Limited marketing budget; small digital footprint outside Shopify forums",
      "Does not offer a customer buylist widget or mobile AI scanner"
    ],
    marketingStrategy: [
      "Direct comparison posts against Synq on Reddit and Shopify Community forums",
      "Word-of-mouth in local game store owner groups",
      "App Store reviews and feature parity marketing"
    ],
    marketing: {
      channels: ["Shopify Community Forums", "Reddit r/LGS", "LGS Facebook Groups"],
      tactics: ["Direct comparison threads vs Synq TCG Manager", "Local game store community advocacy", "Feature parity marketing"],
      primaryFunnel: "Shopify App Store Install -> $29–$69/mo Monthly Plan"
    },
    attackVector: "Deliver an all-in-one platform that combines Shopify sync with a native buylist portal and multi-channel marketplace syndication.",
    techStackSummary: "React, Node.js, Shopify Polaris, GraphQL API",
    targetMarket: "Local game store owners running retail operations on Shopify"
  },
  {
    id: "cardsync",
    name: "CardSync",
    parentCompany: "Independent Micro-SaaS",
    category: "shopify-apps",
    categoryLabel: "Shopify Apps & Tools",
    status: "active",
    statusLabel: "Shopify Micro-SaaS",
    estCustomers: "~100 – 250 stores",
    estARR: "$60K – $120K ARR",
    arrNumberM: 0.09,
    churnRate: "Moderate-High (11% – 15%)",
    churnLevel: "med",
    pricing: {
      base: "Tiered monthly plan (~$19 – $49/mo)",
      setupFee: "$0",
      commissionRate: "0%",
      hardwareCost: "Software only",
      pricingModel: "Flat SaaS"
    },
    offerings: [
      "Shopify-native micro-SaaS for rapid catalog onboarding",
      "Bulk imports TCG inventory from CSV files or TCGPlayer catalog exports",
      "Automatically synchronizes live market prices to imported items",
      "Lightweight background worker updates prices while stores sleep",
      "Simple UI designed for non-technical card shop staff"
    ],
    moats: [
      "Frictionless CSV / TCGplayer export ingestion makes setup fast for existing TCGplayer sellers",
      "Low maintenance micro-SaaS architecture"
    ],
    weaknesses: [
      "Single-purpose micro-SaaS lacking comprehensive retail POS or buylist functionality",
      "No support for European Cardmarket pricing or inventory decrementing",
      "Vulnerable to platform changes in Shopify's catalog API"
    ],
    marketingStrategy: [
      "Targeted Google search ads for 'sync TCGplayer export to Shopify'",
      "Shopify App Store keyword rankings",
      "Reddit comments in r/Shopify and r/magicTCG"
    ],
    marketing: {
      channels: ["Google Search Ads ('sync TCGplayer export to Shopify')", "Shopify App Store", "TCGplayer Seller Facebook Groups"],
      tactics: ["Zero-friction CSV upload onboarding", "Focus on non-technical store clerks", "Low $19/mo pricing"],
      primaryFunnel: "CSV Upload Test -> $19–$49/mo Micro-SaaS Subscription"
    },
    attackVector: "Provide automated real-time API syncing that eliminates the need for manual CSV export/import entirely.",
    techStackSummary: "Next.js, Vercel serverless functions, Supabase, Shopify GraphQL",
    targetMarket: "TCGplayer sellers setting up a secondary Shopify store via CSV exports"
  },

  // ==========================================
  // PILLAR 3: POS & INVENTORY TOOLS (MOBILE/STANDALONE)
  // ==========================================
  {
    id: "cardflow",
    name: "CardFlow",
    parentCompany: "CardFlow Software",
    category: "pos-mobile",
    categoryLabel: "Mobile / Standalone POS",
    status: "active",
    statusLabel: "Offline-First POS",
    estCustomers: "~300 – 600 stores",
    estARR: "$180K – $350K ARR",
    arrNumberM: 0.25,
    churnRate: "Low (<6%)",
    churnLevel: "low",
    pricing: {
      base: "Free plan (limited records); Paid tiers ~$39 – $99/mo",
      setupFee: "$0",
      commissionRate: "0%",
      hardwareCost: "Offline iPad / Android tablet compatible",
      pricingModel: "Freemium"
    },
    offerings: [
      "All-in-one POS and inventory tool built specifically for trading card game shop owners",
      "Fully offline capability: processes transactions and lookups without internet connection",
      "Integrated buy-in and trade-in tracking at the counter",
      "Smart inventory aging: automatically flags slow-moving cards for markdown",
      "Free starter tier with limited records for testing"
    ],
    moats: [
      "100% offline-first reliability: store registers never go down during internet outages or convention hall dead-zones",
      "Dead inventory intelligence: actively flags stagnant cards eating up store capital"
    ],
    weaknesses: [
      "Offline sync can create race conditions if the store also sells online simultaneously",
      "Limited e-commerce integrations compared to cloud-native platforms like Storepass",
      "Lacks real-time automated repricing bots"
    ],
    marketingStrategy: [
      "Targeting convention dealers who suffer from terrible Wi-Fi at convention centers",
      "Freemium plan for newly opened shops testing their first POS",
      "Word-of-mouth in regional hobby shop associations"
    ],
    marketing: {
      channels: ["Traveling Convention Vendor Groups", "Regional Hobby Shop Associations", "Trade Night Meetups"],
      tactics: ["'Never lose a sale to dead convention Wi-Fi' offline marketing", "Dead stock markdown alerts", "Free offline starter plan"],
      primaryFunnel: "Free Offline Plan -> $39–$99/mo Cloud Backup & Multi-User Plan"
    },
    attackVector: "Deliver an offline-resilient local caching layer paired with sub-second cloud synchronization when connectivity is restored.",
    techStackSummary: "React Native / Electron, SQLite local database, CouchDB sync engine",
    targetMarket: "Physical card shops and traveling convention vendors needing offline resilience"
  },
  {
    id: "decktradr",
    name: "DeckTradr",
    parentCompany: "DeckTradr Technologies",
    category: "pos-mobile",
    categoryLabel: "Mobile / Standalone POS",
    status: "active",
    statusLabel: "Ultra-Fast 0.2s AI Scan",
    estCustomers: "~200 – 450 vendors",
    estARR: "$200K – $400K ARR",
    arrNumberM: 0.3,
    churnRate: "Low-Moderate (7% – 9%)",
    churnLevel: "med",
    pricing: {
      base: "Tiered subscription (~$49 – $129/mo)",
      setupFee: "$0",
      commissionRate: "0%",
      hardwareCost: "Camera-equipped smartphone or tablet",
      pricingModel: "Flat SaaS"
    },
    offerings: [
      "Point-of-sale system engineered specifically for TCG vendors and convention exhibitors",
      "Industry-leading AI scanner recognizing cards in as little as 0.2 seconds",
      "Rapid checkout workflow optimized for long lines at convention booths",
      "Instant trade-in calculator with custom cash vs store credit margins",
      "Cloud inventory lookup with real-time TCGplayer market pricing"
    ],
    moats: [
      "Blazing scan speed: 0.2-second computer vision recognition leads the market",
      "Engineered specifically for vendor booth velocity during tournament weekends"
    ],
    weaknesses: [
      "Vendor-focused: lacks full retail store features like employee permissions and accounting exports",
      "No full-fledged standalone e-commerce storefront builder",
      "Limited European Cardmarket integration"
    ],
    marketingStrategy: [
      "Live speed-test comparison videos on TikTok and YouTube challenging competitor scanner apps",
      "Physical sponsor booths at MagicCon, Regional Pokémon Championships, and Collect-A-Con",
      "Direct referrals from traveling card vendors"
    ],
    marketing: {
      channels: ["TikTok & YouTube Shorts Speed Tests", "MagicCon & Pokémon Regional Championships", "Dealer Word of Mouth"],
      tactics: ["0.2-second card scan challenge videos vs Manabox and Delver Lens", "Vendor booth sponsorships with instant line checkout", "Hardware bundle discounts"],
      primaryFunnel: "Viral Speed Test Video -> Convention Live Demo -> $49–$129/mo SaaS"
    },
    attackVector: "Match their 0.2-second mobile AI scanning while offering a complete omnichannel retail POS and Shopify storefront.",
    techStackSummary: "CoreML / TensorFlow Lite edge models, Swift/Kotlin native apps, Node.js API",
    targetMarket: "Traveling TCG vendors, convention exhibitors, and high-velocity card intake counters"
  },
  {
    id: "snapsale",
    name: "SnapSale.io",
    parentCompany: "SnapSale Inc.",
    category: "pos-mobile",
    categoryLabel: "Mobile / Standalone POS",
    status: "active",
    statusLabel: "Card Show POS",
    estCustomers: "~300 – 700 show vendors",
    estARR: "$220K – $450K ARR",
    arrNumberM: 0.35,
    churnRate: "Moderate (9% – 12%)",
    churnLevel: "med",
    pricing: {
      base: "Subscription plans (~$39 – $89/mo) or per-show pass",
      setupFee: "$0",
      commissionRate: "Flat fee or payment processing cut",
      hardwareCost: "Mobile card reader (Square / Stripe Terminal)",
      pricingModel: "Flat SaaS"
    },
    offerings: [
      "POS tool designed specifically for card dealers and vendors at card shows and trade nights",
      "Streamlined checkout with integrated mobile card payments and cash recording",
      "Live market pricing for sports cards, TCGs (Pokémon, MTG), and comic books",
      "Show-level P&L tracking (track total revenue, table costs, and net profit per convention)",
      "Instant digital receipt delivery via SMS and email"
    ],
    moats: [
      "Cross-collectible reach: handles sports cards (PSA slabs) alongside TCG singles and comics",
      "Tailored show analytics: calculates net convention ROI taking into account travel and table fees"
    ],
    weaknesses: [
      "Designed specifically for weekend shows; lacks permanent retail store register capabilities",
      "No continuous e-commerce sync with Shopify or TCGplayer marketplace",
      "Limited bulk singles sorting capabilities"
    ],
    marketingStrategy: [
      "Physical presence at The National Sports Collectors Convention, Dallas Card Show, and Collect-A-Con",
      "Sponsorships of sports card influencers and breaker podcasts",
      "Flexible weekend passes for casual show sellers"
    ],
    marketing: {
      channels: ["The National Sports Collectors Convention", "Dallas Card Show", "Breaker & Hobby Podcasts"],
      tactics: ["Flexible single-weekend show passes", "Show P&L calculator lead magnet", "Sports card slab & TCG dual support"],
      primaryFunnel: "Weekend Show Pass ($19) -> $39–$89/mo Year-Round Dealer Subscription"
    },
    attackVector: "Provide seamless continuity between card shows and permanent stores: show sales instantly delist cards from the store's website in real time.",
    techStackSummary: "React Native, Stripe Terminal SDK, PriceCharting / 130point pricing APIs",
    targetMarket: "Card dealers and vendors exhibiting at sports card and TCG weekend shows"
  },
  {
    id: "mycardwizard",
    name: "My Card Wizard",
    parentCompany: "Card Wizard Tech",
    category: "pos-mobile",
    categoryLabel: "Mobile / Standalone POS",
    status: "active",
    statusLabel: "Scanning & Export Utility",
    estCustomers: "~400 – 800 users",
    estARR: "$180K – $350K ARR",
    arrNumberM: 0.25,
    churnRate: "Moderate-High (12% – 15%)",
    churnLevel: "med",
    pricing: {
      base: "$39 / month",
      setupFee: "$0",
      commissionRate: "0%",
      hardwareCost: "Standard camera / phone",
      pricingModel: "Flat SaaS"
    },
    offerings: [
      "Cloud-based tool for sellers and collectors to scan, identify, and manage card inventory",
      "Exports formatted inventory files directly to TCGplayer and CardTrader",
      "Computer vision recognition for set symbols, card names, and numbers",
      "Collection valuation tracking based on current market averages",
      "Fast CSV batch export and inventory categorization"
    ],
    moats: [
      "Direct support for CardTrader (Europe/Global) export format alongside TCGplayer",
      "Accessible $39/mo pricing for small dealers and power collectors"
    ],
    weaknesses: [
      "Export-centric workflow: lacks live bi-directional sync (requires manual CSV uploading)",
      "No retail checkout POS, barcode printing, or customer buylist portal",
      "Higher churn as users finish scanning collections and cancel"
    ],
    marketingStrategy: [
      "Promotion on card collector forums and CardTrader developer threads",
      "YouTube tutorials on scanning card collections for bulk listing",
      "Targeting collectors transitioning into commercial selling"
    ],
    marketing: {
      channels: ["CardTrader Partner Directory (Europe/Global)", "Card Collector Forums", "YouTube Bulk Scanning Guides"],
      tactics: ["CardTrader & TCGplayer dual format exports", "Batch scanner accuracy benchmarks", "Affordable $39/mo flat fee"],
      primaryFunnel: "Free Scanner Download -> $39/mo Subscription"
    },
    attackVector: "Eliminate the export/import friction by offering direct live API synchronization to TCGplayer and Cardmarket without CSV files.",
    techStackSummary: "Python image recognition API, Next.js web client, AWS DynamoDB",
    targetMarket: "Sellers and collectors scanning cards to export to TCGplayer and CardTrader"
  },
  {
    id: "doubleholo",
    name: "Double Holo (Vendor Hub)",
    parentCompany: "Double Holo Inc.",
    category: "pos-mobile",
    categoryLabel: "Mobile / Standalone POS",
    status: "active",
    statusLabel: "Convention & Slabs",
    estCustomers: "~200 – 450 vendors",
    estARR: "$220K – $450K ARR",
    arrNumberM: 0.3,
    churnRate: "Moderate (9% – 11%)",
    churnLevel: "med",
    pricing: {
      base: "Tiered SaaS plans (~$59 – $199/mo)",
      setupFee: "$0",
      commissionRate: "0% on flat tiers",
      hardwareCost: "Mobile-first iPad / phone support",
      pricingModel: "Flat SaaS"
    },
    offerings: [
      "Mobile app combining multi-channel inventory sync (Double Holo, Shopify, eBay, TCGPlayer)",
      "Automated repricing rules for Pokémon, modern TCGs, and graded slabs",
      "Direct thermal label printing from mobile devices",
      "B2B deal tracking and wholesale batch purchase accounting",
      "Positioned as a complete business management layer for card sellers"
    ],
    moats: [
      "B2B wholesale deal tracking: tracks dealer-to-dealer purchases and trade splits cleanly",
      "Tailored specifically for Pokémon card vendors and high-value graded slab dealers",
      "Mobile-first workflow optimized for on-the-go dealmakers"
    ],
    weaknesses: [
      "Primarily centered on Pokémon; less comprehensive support for Magic or Lorcana",
      "Lacks permanent multi-register physical retail POS features",
      "Smaller development team with gradual feature rollouts"
    ],
    marketingStrategy: [
      "Vendor booth presence at Collect-A-Con, Cardparty, and Regional Pokémon tournaments",
      "Collaborations with prominent Pokémon card influencers and Whatnot streamers",
      "Word-of-mouth in vendor green rooms and dealer trade chats"
    ],
    marketing: {
      channels: ["Collect-A-Con & Cardparty Vendor Halls", "Pokémon Influencer Partnerships", "Whatnot Streamer Discords"],
      tactics: ["B2B wholesale lot purchase tracking demos", "Mobile label printing at trade nights", "Convention booth walkthroughs"],
      primaryFunnel: "Convention Trade Night Demo -> Mobile App Signup -> $59–$199/mo Subscription"
    },
    attackVector: "Deliver comprehensive multi-game coverage (MTG, One Piece, Lorcana, Star Wars) alongside Pokémon with superior physical POS register speed.",
    techStackSummary: "React Native mobile app, Firebase backend, Stripe billing, eBay/TCGplayer APIs",
    targetMarket: "Pokémon card vendors, convention circuit dealers, and graded slab specialists"
  },
  {
    id: "jarbas",
    name: "Jarbas",
    parentCompany: "Jarbas Software",
    category: "pos-mobile",
    categoryLabel: "Mobile / Standalone POS",
    status: "active",
    statusLabel: "Social Selling POS",
    estCustomers: "~1,000+ social sellers",
    estARR: "$300K – $500K ARR",
    arrNumberM: 0.4,
    churnRate: "High (14% – 18%)",
    churnLevel: "high",
    pricing: {
      base: "Freemium / Low-cost subscription (~$10 – $30/mo)",
      setupFee: "$0",
      commissionRate: "0%",
      hardwareCost: "Smartphone only",
      pricingModel: "Freemium"
    },
    offerings: [
      "Mobile POS, sales, and stock management application",
      "Deep integration with social media platforms (WhatsApp, Instagram, Facebook)",
      "Instant social media payment links and automated catalog sharing in DMs",
      "Stock inventory decrementing when items sell via chat",
      "Digital customer receipts generated and sent directly via WhatsApp"
    ],
    moats: [
      "Pioneered chat commerce: allows sellers to close card sales directly in WhatsApp/Instagram DMs",
      "Huge international appeal in markets like Latin America and Southern Europe where card sales happen on WhatsApp"
    ],
    weaknesses: [
      "Not TCG-specific: lacks card condition rating (NM/LP/HP), expansion set databases, and TCGplayer pricing feeds",
      "Must manually enter cards as generic inventory items",
      "No support for gaming tournament events or buylist store credit"
    ],
    marketingStrategy: [
      "Targeting informal micro-sellers on Instagram and WhatsApp business groups",
      "App store promotion across Latin America and Southern Europe",
      "Freemium acquisition campaigns"
    ],
    marketing: {
      channels: ["WhatsApp Business & Instagram Seller Communities", "Latin America & Southern Europe App Stores", "Facebook Marketplace Groups"],
      tactics: ["'Sell cards inside WhatsApp DMs' social checkout demo", "Freemium entry tier", "Instant digital payment links in chats"],
      primaryFunnel: "Free Mobile App Install -> Pro Social Commerce Plan ($10 - $30/mo)"
    },
    attackVector: "Provide social selling links natively inside a specialized TCG engine, combining WhatsApp order links with automatic TCGplayer market pricing.",
    techStackSummary: "Flutter mobile app, WhatsApp Business API, Firebase cloud functions",
    targetMarket: "Independent card flippers and micro-sellers closing deals via WhatsApp and Instagram DMs"
  },
  {
    id: "kyte",
    name: "Kyte",
    parentCompany: "Kyte Technologies",
    category: "pos-mobile",
    categoryLabel: "Mobile / Standalone POS",
    status: "active",
    statusLabel: "Social POS App",
    estCustomers: "~10,000+ general micro-retailers",
    estARR: "$2.5M – $4.0M ARR (General Retail)",
    arrNumberM: 3.0,
    churnRate: "Moderate (12% – 15%)",
    churnLevel: "med",
    pricing: {
      base: "Free starter; Pro plans ~$9.99 – $19.99/mo",
      setupFee: "$0",
      commissionRate: "0%",
      hardwareCost: "Smartphone / Tablet POS",
      pricingModel: "Freemium"
    },
    offerings: [
      "Mobile POS, inventory, and digital catalog app tailored for small businesses",
      "Direct selling workflows through WhatsApp and Instagram with instant order links",
      "Mobile receipt generation and sales analytics",
      "Barcode scanning via smartphone camera",
      "Multi-user employee management on mobile devices"
    ],
    moats: [
      "Millions of mobile downloads with polished mobile UX for micro-businesses",
      "Seamless social media checkout catalogs without building a full website"
    ],
    weaknesses: [
      "Horizontal retail tool with zero TCG-specific knowledge: no card conditions, set codes, or automated pricing",
      "Entering 50,000 unique card singles manually into Kyte is practically impossible",
      "Does not connect to TCGplayer, eBay, or Cardmarket"
    ],
    marketingStrategy: [
      "Global App Store & Google Play organic SEO for 'mobile POS' and 'WhatsApp catalog'",
      "Targeting small mobile entrepreneurs worldwide",
      "Massive freemium user base conversion funnels"
    ],
    marketing: {
      channels: ["Global App Store & Google Play Organic Search", "Social Media Instagram Ads", "Micro-Entrepreneur Influencers"],
      tactics: ["Free mobile register with instant social catalog", "High-volume app store rating prompts", "Localized in 15+ languages worldwide"],
      primaryFunnel: "Free App Store Download -> Kyte Pro In-App Purchase ($9.99 - $19.99/mo)"
    },
    attackVector: "Show card store owners that general retail apps cannot handle 100,000 card variations, whereas your TCG engine pre-populates the entire card universe.",
    techStackSummary: "React Native / Kotlin, AWS serverless, Stripe / WhatsApp Business API",
    targetMarket: "General micro-retailers and social sellers using mobile phones as registers"
  },
  {
    id: "tcgpowertools",
    name: "TCG PowerTools",
    parentCompany: "TCG PowerTools Inc.",
    category: "pos-mobile",
    categoryLabel: "Mobile / Standalone POS",
    status: "active",
    statusLabel: "Cardmarket Repricing Leader",
    estCustomers: "~2,500 – 4,000 active sellers",
    estARR: "€1.8M – €2.8M ARR",
    arrNumberM: 2.4,
    churnRate: "Low (<6%)",
    churnLevel: "low",
    pricing: {
      base: "Free for low inventory; ~€12/mo for 45k singles up to €239/mo",
      setupFee: "€0",
      commissionRate: "0% commission on sales (flat volume plans)",
      hardwareCost: "Software only",
      pricingModel: "Flat SaaS"
    },
    offerings: [
      "Market-leading inventory management and automatic pricing bot for Cardmarket",
      "Free tier available for new and low-inventory card sellers",
      "Ultra-affordable scaling: only ~€12/month for up to 45,000 card singles",
      "Zero commission on sales: stores keep 100% of their gross margins",
      "Batch article listing and rapid CSV inventory synchronization"
    ],
    moats: [
      "The undisputed tool of choice for European Cardmarket power sellers",
      "Remarkably cheap for large inventories (€12/mo for 45k cards) with zero commission",
      "Deeply tuned to Cardmarket's strict API rate limits and seller rules"
    ],
    weaknesses: [
      "Strictly focused on European Cardmarket; no native TCGplayer or North American presence",
      "No in-store physical POS terminal for brick-and-mortar storefronts",
      "No integration with Shopify or standalone branded webstores"
    ],
    marketingStrategy: [
      "Dominates European card vendor Discord communities and tournament circuits",
      "Direct integration and listings on Cardmarket's official partner directory",
      "Reddit word-of-mouth among European singles sellers"
    ],
    marketing: {
      channels: ["Cardmarket Official Partner / Developer Directory", "European Vendor Discord Servers", "Reddit r/magicTCG EU Threads"],
      tactics: ["Dominant automated repricing bot word-of-mouth in vendor circles", "Free tier for low-inventory sellers", "Ultra-cheap €12/mo plan for 45,000 singles with 0% fee"],
      primaryFunnel: "Free Tier -> €12/mo 45k Singles Plan -> Pro Seller Volume Tiers"
    },
    attackVector: "Build a unified transatlantic dashboard: give European sellers Cardmarket repricing AND seamless sync to Shopify and TCGplayer in one tool.",
    techStackSummary: "Python repricing workers, Cardmarket REST API, Vue.js dashboard",
    targetMarket: "European professional and power sellers on Cardmarket"
  }
];
