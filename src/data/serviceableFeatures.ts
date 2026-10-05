export interface FeatureCompetitorInfo {
  name: string;
  price: string;
  status: string;
  flaw: string;
}

export interface MarketGapAnalysis {
  totalStoresNeeding: number;
  marketNeedPercentage: number;
  urgencyLevel: 'Critical (Showstopper)' | 'High (Direct Revenue Loss)' | 'Moderate (Operational Friction)';
  demandPainDescription: string;
  competitorSuppliedStores: number;
  competitorSupplyStatus: 'Severely Constrained' | 'Hardware Gated' | 'Pricing Prohibitive' | 'Legacy Deficient' | 'Signups Frozen' | 'Incumbents Structurally Trapped' | 'High Latency / High Commission' | 'Pricing Prohibitive / Race to Bottom' | 'Signups Frozen / High Commission' | 'Pricing Prohibitive / Rare';
  competitorSupplyBottleneck: string;
  unservedStores: number;
  gapPercentage: number;
  unservedWorkaround: string;
  aeethodGapSolution: string;
}

export interface FeatureSupplyDemandModel {
  reservationPrice: number;
  marketCapacity: number;
  marginalCost: number;
  cloudCostBreakdown: string;
  competitorEffectivePrice: number;
  competitorPriceLabel: string;
  equilibriumQuantity: number;
  competitorQuantity: number;
  consumerSurplusPerStore: number;
  producerSurplusPerStore: number;
  deadweightLossMonthly: number;
  demandBehavior: string;
  supplyElasticityDescription: string;
  substituteThreat: string;
  bundlingStrategy: string;
}

export interface ServiceableFeature {
  supplyDemandModel?: FeatureSupplyDemandModel;
  marketGap?: MarketGapAnalysis;
  id: string;
  name: string;
  shortName: string;
  category: string;
  onlineModel: '100% Cloud Web' | 'Browser PWA' | 'Cloud Webhooks' | 'Serverless AI';
  icon: string;
  economicRole: string;

  // Pricing & Value
  merchantWtp: string;
  wtpRange: { min: number; max: number };
  competitorsPrice: string;
  suggestedPrice: string;
  suggestedPriceNum: number;
  unitCostToServe: string;
  grossMarginPct: number;

  // Supply, Demand & Elasticity
  elasticity: string;
  elasticityNum: number;
  elasticityType: 'Inelastic' | 'Unit Elastic' | 'Hyper-Elastic';
  demandDriver: string;
  supplyDynamics: string;
  deadweightLossRisk: string;

  devComplexity: string;
  switchingLeverage: string;

  // Deep Dive Details
  featureDetails: {
    overview: string;
    cloudArchitecture: string;
    workflow: string[];
    keyBenefits: string[];
  };

  // Competitor Comparison
  competitorBreakdown: {
    binderpos: FeatureCompetitorInfo;
    tcgsync: FeatureCompetitorInfo;
    storepass: FeatureCompetitorInfo;
    decktradr: FeatureCompetitorInfo;
    blstr: FeatureCompetitorInfo;
    crystalcommerce: FeatureCompetitorInfo;
    aeethodWedge: string;
  };
}

export const serviceableFeaturesData: ServiceableFeature[] = [
  {
    id: 'custom-storefront',
    marketGap: {
      "totalStoresNeeding": 2750,
      "marketNeedPercentage": 91.7,
      "urgencyLevel": "Critical (Showstopper)",
      "demandPainDescription": "Stores lose 13% of their top-line revenue selling on TCGplayer/eBay; they desperately need their own high-speed webstore to capture direct sales and build customer brand loyalty.",
      "competitorSuppliedStores": 1120,
      "competitorSupplyStatus": "Signups Frozen / High Commission",
      "competitorSupplyBottleneck": "BinderPOS froze all new signups in Feb 2025; TCG Sync charges £1,000 upfront setup + 2% sales tax; Storepass costs $499/mo.",
      "unservedStores": 1630,
      "gapPercentage": 59.3,
      "unservedWorkaround": "Relying exclusively on TCGplayer/eBay (giving away 13% fees) or struggling with slow generic Shopify themes with 4-second load times on 50k+ singles.",
      "aeethodGapSolution": "Instant sub-100ms faceted singles webstore on custom domain with $0 setup fee and 0% GMV commission."
},
    supplyDemandModel: {
      "reservationPrice": 450,
      "marketCapacity": 1600,
      "marginalCost": 1.4,
      "cloudCostBreakdown": "Cloudflare Pages edge routing ($0.60) + Typesense catalog search queries ($0.80)",
      "competitorEffectivePrice": 1250,
      "competitorPriceLabel": "$1,250/mo (2.5% GMV tax on $50k singles volume)",
      "equilibriumQuantity": 1240,
      "competitorQuantity": 540,
      "consumerSurplusPerStore": 301,
      "producerSurplusPerStore": 147.6,
      "deadweightLossMonthly": 385350,
      "demandBehavior": "Unit Elastic (ε = -0.88). Direct revenue lever; stores pay readily when ROI is clear, but vigorously resist percentage turnover taxes.",
      "supplyElasticityDescription": "Infinitely Elastic (e_s ≈ ∞). Multi-tenant edge caching renders incremental store webstore hosting negligible.",
      "substituteThreat": "Shopify standard themes ($39/mo) or generic WooCommerce; both choke on 100k+ singles SKU variants with 4-second load times.",
      "bundlingStrategy": "Anchors the Core $149/mo bundle. Serves as primary storefront, locking merchant data into Aeethod ecosystem."
},
    name: 'Custom Hosted TCG Storefront & Visual Webstore Builder',
    shortName: 'Custom Storefront',
    category: 'Cloud SaaS E-Commerce',
    onlineModel: '100% Cloud Web',
    icon: '🛍️',
    economicRole: 'Enables stores to sell directly to players at 0% platform commission with sub-second singles search, custom domains, and decklist importers.',
    
    merchantWtp: '$150 – $350 / mo',
    wtpRange: { min: 150, max: 350 },
    competitorsPrice: '2.5% GMV (BinderPOS) or £1,000 setup + 2% GMV (TCG Sync) = $1,200–$3,500/mo',
    suggestedPrice: 'Included in Core ($149/mo flat, 0% commission)',
    suggestedPriceNum: 149,
    unitCostToServe: '$1.40/mo per store (Cloudflare Pages edge routing + CDN cache)',
    grossMarginPct: 99.1,

    elasticity: 'ε = -0.88 (Unit Elastic)',
    elasticityNum: -0.88,
    elasticityType: 'Unit Elastic',
    demandDriver: 'Directly driven by store singles GMV and customer desire to escape 10%–13% TCGplayer/eBay fees.',
    supplyDynamics: 'Zero marginal reproduction cost via multi-tenant headless Next.js cloud clusters.',
    deadweightLossRisk: '2.5% commission taxes push high-volume stores to avoid listing inventory; 0% flat SaaS unlocks 100% catalog availability.',

    devComplexity: 'High (Faceted search over 100k SKUs, responsive card visual grids, customer cart & checkout)',
    switchingLeverage: 'Maximum (Primary digital customer acquisition & brand equity hub)',

    featureDetails: {
      overview: 'A hyper-fast, white-label modern webstore designed specifically for collectible card singles. Unlike general Shopify themes that grind to a halt on large inventories, Aeethod Storefront renders 100,000+ card variations with instant sub-100ms filtering by Set, Condition, Foil, and Language.',
      cloudArchitecture: 'Multi-tenant Edge-rendered Next.js running on Cloudflare Workers with cached Typesense search index. Connects directly to Aeethod unified database with zero on-premise servers.',
      workflow: [
        'Store connects their custom domain (e.g. cards.gameshop.com) in 1 click.',
        'Single cards added to Aeethod automatically publish to the storefront with high-resolution scans and live market pricing.',
        'Customers search cards using compact binder grid or list view with instantaneous filtering.',
        'Checkout completes via Stripe, Apple Pay, Google Pay, or Store Credit with instant stock lock.'
      ],
      keyBenefits: [
        'Sub-100ms faceted search eliminates the 3-5 second lag of legacy Shopify apps.',
        'Zero commission on sales saves an average store $1,500–$3,200/mo compared to BinderPOS.',
        'Built-in Decklist Ingest lets tournament players paste decklists and buy 60 cards in 10 seconds.'
      ]
    },

    competitorBreakdown: {
      binderpos: {
        name: 'BinderPOS',
        price: '2.5% GMV tax on all sales ($1,250/mo on $50k GMV)',
        status: 'Legacy Monolith (Signups paused Feb 2025)',
        flaw: 'Sluggish Shopify theme, restrictive design customization, and forces store into a ruinous 2.5% revenue tax.'
      },
      tcgsync: {
        name: 'TCG Sync (Storefront Pro)',
        price: '£1,000 setup fee + 2% sales tax',
        status: 'Active (1,210+ stores)',
        flaw: 'Heavy upfront setup fee creates high barrier for opening stores; 2% tax penalizes scale.'
      },
      storepass: {
        name: 'Storepass',
        price: '$499/mo (Enterprise flat tier)',
        status: 'Active (Premium)',
        flaw: 'High-performance headless architecture, but pricing is prohibitively expensive for sub-$1M retailers.'
      },
      decktradr: {
        name: 'DeckTradr',
        price: 'N/A',
        status: 'Mobile Trade-in Only',
        flaw: 'Does not offer a customer-facing e-commerce webstore.'
      },
      blstr: {
        name: 'blstr',
        price: '$149/mo flat',
        status: 'Active (Growing)',
        flaw: 'Requires existing Shopify store knowledge and lacks native community deckbuilder integration.'
      },
      crystalcommerce: {
        name: 'Crystal Commerce',
        price: '$99/mo + 2.5% marketplace commission',
        status: 'Legacy Incumbent',
        flaw: 'Outdated 2010s templates that convert poorly on modern mobile browsers.'
      },
      aeethodWedge: 'Deliver Storepass-level sub-100ms headless speed at a self-serve $149/mo flat rate with $0 setup fee and 0% commission.'
    }
  },

  {
    id: 'ai-scanner',
    marketGap: {
      "totalStoresNeeding": 2850,
      "marketNeedPercentage": 95,
      "urgencyLevel": "Critical (Showstopper)",
      "demandPainDescription": "Intake backlogs are the #1 operational killer. 10,000+ cards sit unlisted in shoe boxes while payroll costs $15/hr per clerk ($0.27/card).",
      "competitorSuppliedStores": 740,
      "competitorSupplyStatus": "Hardware Gated",
      "competitorSupplyBottleneck": "TCG Sync requires £800 proprietary hardware purchase; BinderPOS only scans barcodes; others lack camera OCR entirely.",
      "unservedStores": 2110,
      "gapPercentage": 74,
      "unservedWorkaround": "Clerks manually typing card names and set codes into search bars for 30+ hours a week, or turning away customer trade-ins.",
      "aeethodGapSolution": "Zero-hardware optical 60fps neural scanner running directly in any Chrome/Safari browser window on phones, iPads, or webcams."
},
    supplyDemandModel: {
      "reservationPrice": 350,
      "marketCapacity": 1750,
      "marginalCost": 0.8,
      "cloudCostBreakdown": "Client-side WASM neural execution ($0.00) + lightweight vector fingerprint verification ($0.80/mo)",
      "competitorEffectivePrice": 240,
      "competitorPriceLabel": "£800 hardware device amortized (~$120/mo) + $0.05/scan fees (~$240/mo)",
      "equilibriumQuantity": 1450,
      "competitorQuantity": 680,
      "consumerSurplusPerStore": 201,
      "producerSurplusPerStore": 148.2,
      "deadweightLossMonthly": 35000,
      "demandBehavior": "Inelastic (ε = -0.45). Solves acute clerk labor shortage. Once staff adopts 60fps scanning, they refuse to type cards manually.",
      "supplyElasticityDescription": "Perfect elasticity. Browser-based ONNX execution harnesses merchant phone/PC GPU; zero server GPU hardware required.",
      "substituteThreat": "Manual manual typing at $15/hr clerk wage ($0.27/card) or standalone consumer phone apps that export messy CSVs.",
      "bundlingStrategy": "Include unlimited scans in Core to destroy hardware scanner competitors (TCG Sync £800 lock-in)."
},
    name: 'Card Scanning & Computer Vision (Web & Mobile AI Scanner)',
    shortName: 'AI Card Scanner',
    category: 'Online Browser & Mobile Ingest',
    onlineModel: 'Serverless AI',
    icon: '📷',
    economicRole: 'Collapses marginal labor cost of inventory intake from $0.27 to $0.02 per card via optical recognition in any browser.',
    
    merchantWtp: '$150 – $250 / mo',
    wtpRange: { min: 150, max: 250 },
    competitorsPrice: 'TCG Sync charges £800+ for hardware; others charge $0.05/scan or lack camera OCR completely.',
    suggestedPrice: 'Included in Core ($149/mo with unlimited scans)',
    suggestedPriceNum: 149,
    unitCostToServe: '$0.0008 per scan (Client-side ONNX / WebAssembly + lightweight cloud verification)',
    grossMarginPct: 96.8,

    elasticity: 'ε = -0.45 (Inelastic Once Adopted)',
    elasticityNum: -0.45,
    elasticityType: 'Inelastic',
    demandDriver: 'Clerk labor shortage and massive intake backlogs. Average store has 10,000+ unprocessed cards sitting in boxes.',
    supplyDynamics: 'WASM edge execution runs on the merchant device, driving server cost down asymptotically to zero.',
    deadweightLossRisk: 'Manual intake causes thousands of cards to sit unsellable in backrooms, generating zero economic value.',

    devComplexity: 'High (Mobile Neural Engine, set symbol recognition, foil/promo detection, angle compensation)',
    switchingLeverage: 'Extreme (Clerks refuse to revert to manual typing once adopted)',

    featureDetails: {
      overview: 'Sub-second optical card recognition running directly inside any web browser (Chrome, Safari, Edge) or mobile camera. Point the camera at a stack of cards to automatically identify game, set, collector number, foil finish, and current market price.',
      cloudArchitecture: 'Hybrid Edge/Cloud pipeline: Client-side WebAssembly ONNX model extracts card art vectors; cloud neural embedding matches against 120,000+ card fingerprints in 45 milliseconds.',
      workflow: [
        'Clerk opens Aeethod Scanner on any phone, tablet, or USB webcam.',
        'Cards are slid under the camera at 60fps; recognition takes under 0.3 seconds per card.',
        'Condition grade (NM, LP, MP) and foil status are confirmed with 1 tap.',
        'Cards instantly publish to online inventory and retail POS register.'
      ],
      keyBenefits: [
        'Replaces £800+ proprietary physical flatbed scanners with standard smartphones or webcams.',
        'Cuts intake labor cost from $0.27 to $0.02 per card—saving 30+ hours of clerk payroll per week.',
        'Dramatically accelerates cash conversion cycle on trade-ins.'
      ]
    },

    competitorBreakdown: {
      binderpos: {
        name: 'BinderPOS',
        price: 'Included, but barcode only',
        status: 'Legacy',
        flaw: 'No live optical camera OCR for raw cards; only recognizes pre-existing barcode stickers.'
      },
      tcgsync: {
        name: 'TCG Sync',
        price: '£800+ proprietary scanner purchase required',
        status: 'Active',
        flaw: 'Stores are forced to buy an expensive, bulky mechanical hardware scanner that cannot be used at conventions.'
      },
      storepass: {
        name: 'Storepass',
        price: 'Relies on 3rd-party apps',
        status: 'Active',
        flaw: 'No native camera scanner; stores must export CSVs from third-party mobile scanning tools.'
      },
      decktradr: {
        name: 'DeckTradr',
        price: 'Included in app',
        status: 'Active',
        flaw: 'Mobile app scanning suffers from high false-positive rates on alternate art, promos, and foil variants.'
      },
      blstr: {
        name: 'blstr',
        price: 'Included',
        status: 'Active',
        flaw: 'Fast camera scanner, but limited desktop webcam support.'
      },
      crystalcommerce: {
        name: 'Crystal Commerce',
        price: 'Barcode laser only',
        status: 'Legacy',
        flaw: 'Completely lacks computer vision; all cards must be manually entered or barcode-scanned.'
      },
      aeethodWedge: 'Zero hardware cost: 100% in-browser 60fps optical AI vision running on any phone, iPad, or desktop camera.'
    }
  },

  {
    id: 'auto-repricer',
    marketGap: {
      "totalStoresNeeding": 2400,
      "marketNeedPercentage": 80,
      "urgencyLevel": "High (Direct Revenue Loss)",
      "demandPainDescription": "Card prices spike or crash by 30%–50% overnight following tournament outcomes; unadjusted stock gets sniped by arbitrage bots.",
      "competitorSuppliedStores": 950,
      "competitorSupplyStatus": "Pricing Prohibitive / Race to Bottom",
      "competitorSupplyBottleneck": "Incumbent repricers trigger destructive price-slashing wars that erode profit margins down to pennies, without customizable profit floors.",
      "unservedStores": 1450,
      "gapPercentage": 60.4,
      "unservedWorkaround": "Manual price-checking during transactions, or discovering hours later that 20 copies of a spiked card were sold at half price.",
      "aeethodGapSolution": "Rules-based algorithmic repricing with automated profit margin floors and buybox protection."
},
    supplyDemandModel: {
      "reservationPrice": 320,
      "marketCapacity": 1550,
      "marginalCost": 3.5,
      "cloudCostBreakdown": "Hourly scraping queue workers ($2.10) + Redis live market price cache ($1.40)",
      "competitorEffectivePrice": 180,
      "competitorPriceLabel": "$79–$199/mo standalone SaaS or 2% GMV add-on",
      "equilibriumQuantity": 1180,
      "competitorQuantity": 620,
      "consumerSurplusPerStore": 171,
      "producerSurplusPerStore": 145.5,
      "deadweightLossMonthly": 8680,
      "demandBehavior": "Unit Elastic (ε = -0.95). Stores calculate direct profit capture on high-volatility tournament spikes vs tool subscription fee.",
      "supplyElasticityDescription": "Shared multi-tenant price scrapers. One price fetch serves 1,000+ stores simultaneously, creating massive supply-side economies of scale.",
      "substituteThreat": "Manual price checks on TCGplayer/eBay during counter transactions, causing massive checkout line delays.",
      "bundlingStrategy": "Built-in automated price floors prevent race-to-the-bottom while proving 5x ROI on the $149/mo flat fee."
},
    name: 'Dynamic Autopricing Engine (Real-Time Repricer with Floors)',
    shortName: 'Dynamic Autopricer',
    category: 'Cloud Background Automation',
    onlineModel: 'Cloud Webhooks',
    icon: '⚡',
    economicRole: 'Preserves buybox share while enforcing automated price floors to prevent destructive margin erosion.',
    
    merchantWtp: '$100 – $220 / mo',
    wtpRange: { min: 100, max: 220 },
    competitorsPrice: '$50–$150/mo or bundled with 2%–2.5% GMV commission.',
    suggestedPrice: 'Included in Core ($149/mo flat)',
    suggestedPriceNum: 149,
    unitCostToServe: '$3.50/mo per store (Hourly queue worker compute & Redis pricing cache)',
    grossMarginPct: 97.6,

    elasticity: 'ε = -0.95 (Unit Elastic)',
    elasticityNum: -0.95,
    elasticityType: 'Unit Elastic',
    demandDriver: 'Single-card price volatility. A single tournament result on Sunday can spike or crash card values by 40% before Monday morning.',
    supplyDynamics: 'Centralized scraping and pricing API cache shared across all tenant stores.',
    deadweightLossRisk: 'Without dynamic pricing, stores either underprice staples (losing thousands to arbitrage bots) or overprice dead stock (zero liquidity).',

    devComplexity: 'High (Low-latency TCGplayer/eBay scrapers, rules engine & webhooks)',
    switchingLeverage: 'High (Immediate 12–18% revenue lift on fast-moving tournament singles)',

    featureDetails: {
      overview: 'An intelligent algorithmic repricing engine that continuously monitors TCGplayer Market, TCG Low, eBay Sold, and Cardmarket comps. Automatically recalibrates store inventory to maximize buybox velocity while respecting merchant margin rules and hard price floors.',
      cloudArchitecture: 'Cloud worker cluster with distributed Redis cache polling market pricing APIs. Emits batch delta update webhooks to Shopify, eBay, and Aeethod POS registers in under 60 seconds.',
      workflow: [
        'Store sets pricing strategy (e.g. "TCG Market -2%", "Match TCG Direct Low", or "Fixed Margin +40%").',
        'Merchant defines safety rules: Price Floor = Intake Cost × 1.35 (never sell at a loss).',
        'Engine monitors tournament spikes and publisher announcements 24/7.',
        'Prices update automatically across webstore, POS, and online channels with full audit logs.'
      ],
      keyBenefits: [
        'Captures 12%–18% higher gross margins by instantly raising prices during tournament hype spikes.',
        'Stops algorithmic undercutting spirals with mathematical price floor protection.',
        'Eliminates 15+ hours per week of clerks manually searching TCGplayer to re-sticker cards.'
      ]
    },

    competitorBreakdown: {
      binderpos: {
        name: 'BinderPOS',
        price: 'Bundled with 2.5% tax',
        status: 'Legacy',
        flaw: 'Notoriously slow 12-hour sync cycles; frequent pricing desync bugs where items revert to $0.00.'
      },
      tcgsync: {
        name: 'TCG Sync',
        price: 'Included with 2% tax',
        status: 'Active',
        flaw: 'Advanced rules, but lacks automated machine-learning margin floor recommendations.'
      },
      storepass: {
        name: 'Storepass',
        price: 'Included in $499 plan',
        status: 'Active',
        flaw: 'Excellent headless repricer, but locked into high-end enterprise tier.'
      },
      decktradr: {
        name: 'DeckTradr',
        price: 'None',
        status: 'Active',
        flaw: 'No dynamic repricing; requires manual pricing updates.'
      },
      blstr: {
        name: 'blstr',
        price: 'Daily sync',
        status: 'Active',
        flaw: 'Only syncs once daily; misses fast intraday tournament spikes.'
      },
      crystalcommerce: {
        name: 'Crystal Commerce',
        price: 'Bundled',
        status: 'Legacy',
        flaw: 'Sluggish batch processing that frequently triggers marketplace API rate limits.'
      },
      aeethodWedge: 'Sub-minute cloud repricing with microeconomic floor protection ($P_{floor} = P_{intake} \\times 1.35$) to prevent destructive race-to-the-bottom undercutting.'
    }
  },

  {
    id: 'buylist-kiosk',
    marketGap: {
      "totalStoresNeeding": 2550,
      "marketNeedPercentage": 85,
      "urgencyLevel": "Critical (Showstopper)",
      "demandPainDescription": "Counter trade-in queues take 45+ minutes per customer on Saturday game nights, frustrating customers and stalling store clerks.",
      "competitorSuppliedStores": 890,
      "competitorSupplyStatus": "Severely Constrained",
      "competitorSupplyBottleneck": "Competitor buylist modules require expensive subscription add-ons ($199/mo) and lack automated customer-facing kiosk modes.",
      "unservedStores": 1660,
      "gapPercentage": 65.1,
      "unservedWorkaround": "Handwritten trade-in submission slips and paper clipboards with 48-to-72 hour valuation turnaround.",
      "aeethodGapSolution": "Self-serve trade-in submission on customer smartphones or counter iPads with instant live pricing and store credit incentives."
},
    supplyDemandModel: {
      "reservationPrice": 380,
      "marketCapacity": 1650,
      "marginalCost": 0.9,
      "cloudCostBreakdown": "Web kiosk session state ($0.40) + automated payout ledger compute ($0.50)",
      "competitorEffectivePrice": 199,
      "competitorPriceLabel": "$199/mo (BinderPOS Buylist add-on) or £250 setup",
      "equilibriumQuantity": 1320,
      "competitorQuantity": 710,
      "consumerSurplusPerStore": 231,
      "producerSurplusPerStore": 148.1,
      "deadweightLossMonthly": 15250,
      "demandBehavior": "Inelastic (ε = -0.52). Buylisting is the primary inventory supply engine for card shops; stores cannot acquire singles without it.",
      "supplyElasticityDescription": "Responsive browser web application running on any customer smartphone or store iPad; zero proprietary kiosk terminals.",
      "substituteThreat": "Counter paper clipboards and handwritten trade-in receipts with 48-hour manual pricing backlogs.",
      "bundlingStrategy": "Self-serve player submission cuts store counter intake time by 75%, generating instant store credit turnover."
},
    name: 'Buylist Portal & In-Store Kiosk (Cash & Store Credit)',
    shortName: 'Buylist Kiosk',
    category: 'Online & In-Store Intake',
    onlineModel: '100% Cloud Web',
    icon: '📥',
    economicRole: 'Acquires inventory at 50%–65% margins and locks liquidity via +20% to +30% store credit bonuses.',
    
    merchantWtp: '$120 – $220 / mo',
    wtpRange: { min: 120, max: 220 },
    competitorsPrice: '$99/mo or bundled into high-commission plans.',
    suggestedPrice: 'Included in Core ($149/mo flat)',
    suggestedPriceNum: 149,
    unitCostToServe: '$1.10/mo per store (Cloud web app hosting + PostgreSQL transaction storage)',
    grossMarginPct: 99.2,

    elasticity: 'ε = -0.55 (Inelastic Core Value)',
    elasticityNum: -0.55,
    elasticityType: 'Inelastic',
    demandDriver: 'LGS make their highest margins (50%–65%) on buying singles from players. Without a buylist, inventory drying up is an existential threat.',
    supplyDynamics: 'Self-serve web UI embeddable on any website or tablet browser.',
    deadweightLossRisk: 'Manual trade-in negotiations frustrate players and lead to intake rejection, forcing players to sell on eBay instead.',

    devComplexity: 'Medium (Customer portal, condition grading deductions, cash vs credit ledger)',
    switchingLeverage: 'Extreme (Core acquisition channel for rare singles and local inventory)',

    featureDetails: {
      overview: 'A turnkey self-service buylist portal where players can submit trade-ins online or at an in-store counter tablet. Players select cards, view live payout rates (e.g. 60% cash, 80% store credit), and drop off submissions for swift clerk verification.',
      cloudArchitecture: 'Cloud web application with real-time pricing feeds. Runs as a fullscreen PWA on any cheap in-store iPad or embeds as a widget into any Shopify/WordPress webstore.',
      workflow: [
        'Player searches cards they wish to sell on the store buylist portal.',
        'System automatically applies payout rules (e.g. 50% TCG Market for cash, 70% for store credit).',
        'Customer submits list and hands cards to clerk with submission ID barcode.',
        'Clerk reviews card conditions with 1 click; payout issues instantly to customer balance or cash drawer.'
      ],
      keyBenefits: [
        'Locks customer capital inside the store through attractive +25% store credit bonuses.',
        'Eliminates trade-in line bottlenecks during busy Friday Night Magic events.',
        'Guarantees predictable gross margins on all secondary market card intake.'
      ]
    },

    competitorBreakdown: {
      binderpos: {
        name: 'BinderPOS',
        price: 'Included with 2.5% tax',
        status: 'Legacy',
        flaw: 'Clunky, confusing user interface that frequently bugs out when calculating tiered condition deductions.'
      },
      tcgsync: {
        name: 'TCG Sync',
        price: 'Supported',
        status: 'Active',
        flaw: 'Solid functionality, but setup requires lengthy manual configuration.'
      },
      storepass: {
        name: 'Storepass',
        price: 'Supported in enterprise',
        status: 'Active',
        flaw: 'Excellent Shopify account credit sync, but restricted to high-tier plans.'
      },
      decktradr: {
        name: 'DeckTradr',
        price: 'Included',
        status: 'Active',
        flaw: 'Card show trade-in focus; weak customer self-serve web portal.'
      },
      blstr: {
        name: 'blstr',
        price: 'Included in $149 plan',
        status: 'Active',
        flaw: 'Modern UI, but lacks custom grading deduction sliders per game.'
      },
      crystalcommerce: {
        name: 'Crystal Commerce',
        price: 'Included',
        status: 'Legacy',
        flaw: 'Outdated portal layout that turns away younger Pokémon and One Piece collectors.'
      },
      aeethodWedge: 'Omnichannel self-serve kiosk that runs on any tablet or webstore with automated condition deductions and instant store credit balancing.'
    }
  },

  {
    id: 'omnichannel-pos',
    name: 'Cloud Web POS & Virtual Register (Browser / iPad / PC)',
    shortName: 'Cloud Web POS',
    category: 'Cloud SaaS Operations',
    onlineModel: '100% Cloud Web',
    icon: '🖥️',
    economicRole: 'Turns any iPad, laptop, or phone browser into a retail counter register with zero hardware lock-in.',
    
    merchantWtp: '$100 – $250 / mo',
    wtpRange: { min: 100, max: 250 },
    competitorsPrice: 'TCG Sync (£800+ hardware); BinderPOS ($1,200+ hardware bundle); Shopify POS ($89/mo/register).',
    suggestedPrice: 'Included in Core ($149/mo with unlimited registers)',
    suggestedPriceNum: 149,
    unitCostToServe: '$2.00/mo per store (Websocket connections + Stripe Terminal SDK)',
    grossMarginPct: 98.6,

    elasticity: 'ε = -0.32 (Deeply Inelastic)',
    elasticityNum: -0.32,
    elasticityType: 'Inelastic',
    demandDriver: 'Retail stores cannot ring up customers without a cash register. High replacement barrier.',
    supplyDynamics: 'Pure cloud web application using WebUSB and WebHID browser APIs to talk to receipt printers and barcode guns.',
    deadweightLossRisk: 'Sync lag between physical counter sales and online stock creates catastrophic overselling cancellations.',

    devComplexity: 'Medium-High (WebHID barcode reader support, websocket stock locking, receipt printer driver)',
    switchingLeverage: 'Very High (Zero setup cost compared to £1,000 legacy hardware bundles)',

    featureDetails: {
      overview: 'A zero-install retail point-of-sale register running inside any browser. Supports barcode scanning, cash drawer kicks, receipt printing, customer lookup, and split payments (cash + store credit). Immediately deducts inventory from online Shopify and TCGplayer channels in <50 milliseconds.',
      cloudArchitecture: 'React PWA communicating via secure WebSockets to Aeethod cloud event bus. Uses modern browser WebHID/WebUSB APIs for hardware peripherals without requiring proprietary Windows drivers.',
      workflow: [
        'Clerk opens pos.aeethod.com on an iPad, Mac, or PC.',
        'Scans card barcodes or searches player name in 100k SKU database.',
        'Selects payment: Credit Card (Stripe Terminal), Cash, or Store Credit.',
        'Sale finalizes in 2 seconds; stock instantly decrements across all channels worldwide.'
      ],
      keyBenefits: [
        'No $1,500 proprietary POS terminals required; runs on iPads already owned by the store.',
        'Zero-latency inventory deduction eliminates embarrassing online overselling defects.',
        'Native store credit and player loyalty accounts integrated directly into checkout.'
      ]
    },

    competitorBreakdown: {
      binderpos: {
        name: 'BinderPOS',
        price: 'Included with 2.5% tax',
        status: 'Legacy',
        flaw: 'Old Windows-based desktop client that requires dedicated PC hardware and frequent local patches.'
      },
      tcgsync: {
        name: 'TCG Sync',
        price: '£800+ hardware bundle',
        status: 'Active',
        flaw: 'Heavy hardware lock-in; requires specific register peripherals.'
      },
      storepass: {
        name: 'Storepass',
        price: 'Supported',
        status: 'Active',
        flaw: 'Fast iPad app, but restricted to high-tier enterprise subscriptions.'
      },
      decktradr: {
        name: 'DeckTradr',
        price: 'N/A',
        status: 'Active',
        flaw: 'Lacks retail counter POS features (no receipt printing or multi-register lane support).'
      },
      blstr: {
        name: 'blstr',
        price: 'In Development',
        status: 'Beta',
        flaw: 'Retail counter POS is still in development; currently relies on external Shopify POS.'
      },
      crystalcommerce: {
        name: 'Crystal Commerce',
        price: 'Proprietary register',
        status: 'Legacy',
        flaw: 'Clunky legacy hardware that frequently loses connection to card readers.'
      },
      aeethodWedge: '100% Cloud Web POS: Runs in any modern browser on iPad, Mac, or PC with zero installation and unlimited register lanes.'
    }
  },

  {
    id: 'shopify-2way',
    name: 'Multi-Platform Integration & Sync (Shopify, TCGplayer, eBay, Cardmarket)',
    shortName: 'Multi-Platform Sync',
    category: 'Multi-Channel E-Commerce',
    onlineModel: 'Cloud Webhooks',
    icon: '🔄',
    economicRole: 'Unifies inventory across all channels, eliminating overselling penalties and defect cancels ($15 defect fee).',
    
    merchantWtp: '$100 – $200 / mo',
    wtpRange: { min: 100, max: 200 },
    competitorsPrice: 'Synq ($69–$199/mo), Game Locker ($49–$149/mo), or bundled with 2%–2.5% sales commission.',
    suggestedPrice: 'Included in Core ($149/mo flat)',
    suggestedPriceNum: 149,
    unitCostToServe: '$2.80/mo per store (Cloudflare Queue workers & webhook deduplication engine)',
    grossMarginPct: 98.1,

    elasticity: 'ε = -0.38 (Highly Inelastic)',
    elasticityNum: -0.38,
    elasticityType: 'Inelastic',
    demandDriver: 'Marketplace seller metrics. If a store cancels 2% of TCGplayer orders due to inventory desync, TCGplayer penalizes their account ranking and charges a $15 cancel fee.',
    supplyDynamics: 'Event-driven serverless webhooks with idempotency keys and automatic exponential backoff.',
    deadweightLossRisk: 'Without sync, stores must manually divide inventory across platforms, reducing liquidity on every channel by 50%.',

    devComplexity: 'Medium-High (Multi-channel rate limits, queue workers & webhook deduplication)',
    switchingLeverage: 'High (Core multi-channel online distribution pipe)',

    featureDetails: {
      overview: 'Universal inventory synchronization hub. When a card sells at the in-store physical counter, Aeethod transmits sub-100ms webhooks to instantly decrement stock on Shopify, TCGplayer, eBay, and Cardmarket—ensuring zero double-selling.',
      cloudArchitecture: 'Distributed event bus (Kafka / RabbitMQ-style serverless queues) with transactional locks and automatic rate-limit throttling for marketplace partner APIs.',
      workflow: [
        'Merchant authorizes Shopify, eBay, TCGplayer, or Cardmarket accounts with OAuth.',
        'Initial catalog reconciliation maps SKUs and variations automatically.',
        'When an order occurs anywhere, the cloud queue locks the SKU and updates all channels in parallel.',
        'Full event audit log shows exact millisecond timestamps of every inventory deduction.'
      ],
      keyBenefits: [
        'Eliminates $15 per-defect cancellation fines and protected seller status on TCGplayer/eBay.',
        'Allows 100% of store inventory to be listed on all channels simultaneously without risk of overselling.',
        'Unified order fulfillment dashboard consolidates orders from all platforms into one screen.'
      ]
    },

    competitorBreakdown: {
      binderpos: {
        name: 'BinderPOS',
        price: 'Included with 2.5% tax',
        status: 'Legacy',
        flaw: 'Infamous for "ghost listings" where cards sold in-store remain active on TCGplayer for hours, causing order cancels.'
      },
      tcgsync: {
        name: 'TCG Sync',
        price: 'Supported',
        status: 'Active',
        flaw: 'Solid Shopify sync, but secondary marketplace connections require expensive custom integrations.'
      },
      storepass: {
        name: 'Storepass',
        price: 'Native Shopify Plus',
        status: 'Active',
        flaw: 'Best-in-class Shopify sync, but requires $499/mo commitment.'
      },
      decktradr: {
        name: 'DeckTradr',
        price: 'None',
        status: 'Active',
        flaw: 'Standalone app; does not sync to Shopify or external marketplaces.'
      },
      blstr: {
        name: 'blstr',
        price: 'Supported',
        status: 'Active',
        flaw: 'Fast Shopify sync, but eBay and Cardmarket connectors are limited.'
      },
      crystalcommerce: {
        name: 'Crystal Commerce',
        price: 'Included with 2.5% tax',
        status: 'Legacy',
        flaw: 'Lagged sync queue causes frequent overselling during flash set releases.'
      },
      aeethodWedge: 'Universal Multi-Platform Hub: Instant 2-way sync across Shopify, TCGplayer, eBay & Cardmarket (<100ms) with zero commission.'
    }
  },

  {
    id: 'convention-mode',
    name: 'Offline-First Convention & Card Show Mode (PWA Web)',
    shortName: 'Convention Mode',
    category: 'Event Commerce',
    onlineModel: 'Browser PWA',
    icon: '🎪',
    economicRole: 'Unlocks $25k–$100k gross sales at MagicCons and Collect-A-Cons without relying on arena WiFi.',
    
    merchantWtp: '$100 – $180 / mo',
    wtpRange: { min: 100, max: 180 },
    competitorsPrice: 'SnapSale / Double Holo charge $49–$99/month; others crash without internet.',
    suggestedPrice: 'Included in Core ($149/mo flat)',
    suggestedPriceNum: 149,
    unitCostToServe: '$0.50/mo per store (IndexedDB local sync cache)',
    grossMarginPct: 99.6,

    elasticity: 'ε = -0.62 (Inelastic for Road Warriors)',
    elasticityNum: -0.62,
    elasticityType: 'Inelastic',
    demandDriver: 'High-grossing weekend card shows where venue WiFi fails 80% of the time due to thousands of attendees congesting cellular bands.',
    supplyDynamics: 'Local IndexedDB encrypted database running in mobile browser service worker.',
    deadweightLossRisk: 'A dealer unable to process sales during a 3-day MagicCon loses $30k–$80k in high-margin liquidity.',

    devComplexity: 'High (IndexedDB local sync, conflict resolution on cellular reconnect)',
    switchingLeverage: 'Very High (Traveling power dealers rely on this to survive)',

    featureDetails: {
      overview: 'A resilient Progressive Web App designed specifically for traveling dealers at convention booths. Allows dealers to look up prices, scan barcodes, register sales, and issue digital receipts even when completely offline with zero WiFi or cellular service.',
      cloudArchitecture: 'Client-side Service Worker caching store catalog inside browser IndexedDB. Sales queue locally with cryptographic signatures and auto-sync to cloud when connection is restored.',
      workflow: [
        'Dealer pre-loads booth inventory onto mobile phone or tablet before leaving hotel.',
        'At convention floor, dealer processes cash/card transactions with zero latency.',
        'Orders and buylist trade-in submissions queue safely in local browser storage.',
        'When cellular returns, background worker syncs transactions and deducts main store inventory.'
      ],
      keyBenefits: [
        'Zero downtime at $50k+ weekend events when convention center WiFi drops.',
        'Eliminates manual paper tally sheets and post-convention inventory reconciliation.',
        'Immediate competitive advantage over booth neighbors whose cloud apps are frozen.'
      ]
    },

    competitorBreakdown: {
      binderpos: {
        name: 'BinderPOS',
        price: 'None',
        status: 'Legacy',
        flaw: 'Crashes completely without an active internet connection; unusable at convention booths.'
      },
      tcgsync: {
        name: 'TCG Sync',
        price: 'Partial',
        status: 'Active',
        flaw: 'Mobile register exists, but high latency over congested convention cellular connections.'
      },
      storepass: {
        name: 'Storepass',
        price: 'Supported',
        status: 'Active',
        flaw: 'iPad booth mode exists for premier accounts, but expensive.'
      },
      decktradr: {
        name: 'DeckTradr',
        price: 'Supported',
        status: 'Active',
        flaw: 'Great for card show trade-ins, but lacks unified retail counter sync.'
      },
      blstr: {
        name: 'blstr',
        price: 'None',
        status: 'Active',
        flaw: 'Requires live internet connection for Shopify sync.'
      },
      crystalcommerce: {
        name: 'Crystal Commerce',
        price: 'None',
        status: 'Legacy',
        flaw: 'Requires fixed internet connection and physical register hardware.'
      },
      aeethodWedge: 'True Offline IndexedDB Queue with automatic zero-conflict cloud synchronization on cellular reconnect.'
    }
  },

  {
    id: 'decklist-ingest',
    marketGap: {
      "totalStoresNeeding": 2300,
      "marketNeedPercentage": 76.7,
      "urgencyLevel": "High (Direct Revenue Loss)",
      "demandPainDescription": "Competitive players refuse to search 60 cards one-by-one; they want to paste a decklist text block and buy all in-stock cards at once.",
      "competitorSuppliedStores": 480,
      "competitorSupplyStatus": "Pricing Prohibitive / Rare",
      "competitorSupplyBottleneck": "Only available on $499/mo Storepass tier or requires hiring third-party web agencies to code custom Shopify apps.",
      "unservedStores": 1820,
      "gapPercentage": 79.1,
      "unservedWorkaround": "Players abandon carts (80% abandonment rate) or buy only 3 key cards and purchase the remaining 57 cards on TCGplayer.",
      "aeethodGapSolution": "Built-in decklist ingest that parses raw text or MTGGoldfish/Limitless links, auto-filling baskets in 3 seconds (340% AOV boost)."
},
    supplyDemandModel: {
      "reservationPrice": 220,
      "marketCapacity": 1400,
      "marginalCost": 0.4,
      "cloudCostBreakdown": "Text parsing regex engine + Typesense batch matching ($0.40)",
      "competitorEffectivePrice": 89,
      "competitorPriceLabel": "$49–$99/mo Shopify plugin or custom developer contract",
      "equilibriumQuantity": 950,
      "competitorQuantity": 480,
      "consumerSurplusPerStore": 71,
      "producerSurplusPerStore": 148.6,
      "deadweightLossMonthly": 14100,
      "demandBehavior": "Unit Elastic (ε = -1.10). Directly correlates with competitive player base (Magic, Pokémon, Yu-Gi-Oh!, One Piece tourneys).",
      "supplyElasticityDescription": "Pure algorithmic text parser running in client-side JS and edge worker.",
      "substituteThreat": "Player typing 60 individual card names into webstore search bar, resulting in 80% cart abandonment.",
      "bundlingStrategy": "Increases webstore average order value (AOV) by 340% ($18 singles basket jumps to $85 complete deck)."
},
    name: '1-Click Tournament Decklist Ingest ("Paste & Buy" Web Widget)',
    shortName: 'Decklist Ingest',
    category: 'Cloud SaaS E-Commerce',
    onlineModel: '100% Cloud Web',
    icon: '🃏',
    economicRole: 'Increases customer Average Order Value (AOV) by +42% by converting competitive players into bulk buyers.',
    
    merchantWtp: '$80 – $150 / mo',
    wtpRange: { min: 80, max: 150 },
    competitorsPrice: 'TCG Sync ($150/mo add-on); others have no deckbuilder integration.',
    suggestedPrice: 'Included in Core ($149/mo flat)',
    suggestedPriceNum: 149,
    unitCostToServe: '$0.80/mo per store (Decklist parsing worker & inventory matching algorithm)',
    grossMarginPct: 99.4,

    elasticity: 'ε = -1.10 (Unit Elastic Value-Add)',
    elasticityNum: -1.10,
    elasticityType: 'Unit Elastic',
    demandDriver: 'Competitive tournament players who refuse to type 60 individual card names into a search bar. They shop at whoever lets them paste their decklist.',
    supplyDynamics: 'Client-side text parser matching Moxfield, MTGGoldfish, Limitless, and Pokémon TCG Live formats.',
    deadweightLossRisk: 'Frictional search effort causes competitive players to leave store websites and buy on TCGplayer cart optimizer instead.',

    devComplexity: 'Medium (Regex decklist parser, condition fallback matching, cart optimizer)',
    switchingLeverage: 'High (Players bookmark stores that support 1-click deck importing)',

    featureDetails: {
      overview: 'An embeddable web widget and storefront feature that lets players paste a 60–100 card tournament decklist URL or text file. Aeethod instantly matches available in-stock cards, displays condition/price options, and adds all available singles to cart in one click.',
      cloudArchitecture: 'Cloud parser supporting all major TCG formats (MTG Arena, Moxfield, Archidekt, Limitless Pokémon, Yu-Gi-Oh YGOPro). Queries local store inventory with fuzzy string matching.',
      workflow: [
        'Player pastes decklist URL or text into store website or in-store counter kiosk.',
        'Engine instantly identifies which 52 of 60 cards are in stock in store inventory.',
        'Displays cheapest matching printing with 1-click condition toggle (Near Mint vs Played).',
        'Adds all matched cards to shopping cart with single checkout button.'
      ],
      keyBenefits: [
        'Boosts store Average Order Value (AOV) from $24 to $115 by capturing entire 60-card decks.',
        'Diverts tournament players away from TCGplayer Cart Optimizer directly to store website.',
        'Eliminates 10 minutes of clerk search time per deck inquiry at the counter.'
      ]
    },

    competitorBreakdown: {
      binderpos: {
        name: 'BinderPOS',
        price: 'None',
        status: 'Legacy',
        flaw: 'Completely lacks decklist importing; players must manually search every single card.'
      },
      tcgsync: {
        name: 'TCG Sync',
        price: 'Supported',
        status: 'Active',
        flaw: 'Supported, but complex and difficult for players to use on mobile devices.'
      },
      storepass: {
        name: 'Storepass',
        price: 'Supported',
        status: 'Active',
        flaw: 'Fast search, but lacks native Moxfield/Limitless direct URL resolution.'
      },
      decktradr: {
        name: 'DeckTradr',
        price: 'None',
        status: 'Active',
        flaw: 'No consumer webstore deckbuilder.'
      },
      blstr: {
        name: 'blstr',
        price: 'None',
        status: 'Active',
        flaw: 'No built-in decklist ingest feature.'
      },
      crystalcommerce: {
        name: 'Crystal Commerce',
        price: 'None',
        status: 'Legacy',
        flaw: 'No decklist integration.'
      },
      aeethodWedge: 'Universal 1-click decklist importer supporting Moxfield, Limitless, and MTGGoldfish with automatic in-stock cart optimization.'
    }
  },

  {
    id: 'batch-pick-fulfillment',
    name: 'Digital Pick-Lists & Batch Fulfillment Routing (Mobile / Web Binder Bin Locator)',
    shortName: 'Digital Pick-Lists',
    category: 'Cloud SaaS Operations',
    onlineModel: '100% Cloud Web',
    icon: '📦',
    economicRole: 'Cuts fulfillment labor time by 60% by route-optimizing physical single-card retrieval.',
    
    merchantWtp: '$90 – $180 / mo',
    wtpRange: { min: 90, max: 180 },
    competitorsPrice: 'TCGplayer Direct charges 10%–13% fee to handle fulfillment; ShipStation is $30–$100/mo.',
    suggestedPrice: 'Included in Core ($149/mo flat)',
    suggestedPriceNum: 149,
    unitCostToServe: '$0.90/mo per store (Cloud database queries & PDF generation)',
    grossMarginPct: 99.3,

    elasticity: 'ε = -0.70 (Inelastic for High-Volume Stores)',
    elasticityNum: -0.70,
    elasticityType: 'Inelastic',
    demandDriver: 'Stores processing 50+ online orders a day lose 3-4 hours of clerk payroll having staff walk back and forth looking through random binders.',
    supplyDynamics: 'Algorithmic Traveling Salesman route optimization over store physical locations.',
    deadweightLossRisk: 'Clerks hunting for cards make picking errors, leading to mis-ships and expensive return postage.',

    devComplexity: 'Medium-High (Bin location taxonomy, batch order grouping, packing verification)',
    switchingLeverage: 'High (Fulfillment staff refuse to work without digital pick slips)',

    featureDetails: {
      overview: 'An intelligent digital picking list accessible on any clerk’s mobile phone or tablet. Groups 20+ orders together and sorts cards by physical location: `[Showcase A] -> [Modern Horizons Binder] -> [Page 4] -> [Slot 2]`, allowing a clerk to pick 100 cards in a single linear pass.',
      cloudArchitecture: 'Cloud web app with mobile-friendly touch UI. Synchronizes with thermal label printers (Brother, Zebra, Rollo) via browser print dialogs.',
      workflow: [
        'Clerk clicks "Generate Batch Pick-List" for morning orders across Shopify, eBay, and TCGplayer.',
        'Aeethod sorts all 140 cards into a single optimized walking route through store shelves.',
        'Clerk taps cards off on phone screen as they are pulled into fulfillment bins.',
        'System automatically prints packing slips and thermal shipping labels.'
      ],
      keyBenefits: [
        'Drops order picking time from 15 minutes to 90 seconds per multi-card order.',
        'Eliminates picking errors with on-screen card image confirmation.',
        'Allows stores to handle 3x higher online sales volume with the exact same staff size.'
      ]
    },

    competitorBreakdown: {
      binderpos: {
        name: 'BinderPOS',
        price: 'Included',
        status: 'Legacy',
        flaw: 'Basic single-order packing slips with no physical binder bin location routing or batch grouping.'
      },
      tcgsync: {
        name: 'TCG Sync',
        price: 'Supported',
        status: 'Active',
        flaw: 'Good order management, but lacks mobile phone pick-and-pack optimization.'
      },
      storepass: {
        name: 'Storepass',
        price: 'Enterprise',
        status: 'Active',
        flaw: 'Robust fulfillment, but locked into $499+/mo tier.'
      },
      decktradr: {
        name: 'DeckTradr',
        price: 'None',
        status: 'Active',
        flaw: 'No warehouse fulfillment features.'
      },
      blstr: {
        name: 'blstr',
        price: 'Basic',
        status: 'Active',
        flaw: 'Relies on standard Shopify order lists which are not optimized for single-card binders.'
      },
      crystalcommerce: {
        name: 'Crystal Commerce',
        price: 'Included',
        status: 'Legacy',
        flaw: 'Ancient print templates that waste paper and do not support modern mobile tablets.'
      },
      aeethodWedge: 'Mobile-first batch pick routing that maps cards directly to physical binder pages and shelf slots, cutting labor by 60%.'
    }
  },

  {
    id: 'sealed-allocation',
    marketGap: {
      "totalStoresNeeding": 2250,
      "marketNeedPercentage": 75,
      "urgencyLevel": "High (Direct Revenue Loss)",
      "demandPainDescription": "Releasing pre-orders causes store phones to blow up, webstores to crash, and scalper bots to buy out allocations, angering local regulars.",
      "competitorSuppliedStores": 390,
      "competitorSupplyStatus": "Severely Constrained",
      "competitorSupplyBottleneck": "Incumbents offer standard Shopify product listings with zero bot mitigation or local customer loyalty weighting.",
      "unservedStores": 1860,
      "gapPercentage": 82.7,
      "unservedWorkaround": "Messy manual Google Forms, Discord lottery drawings, or taking handwritten cash deposits behind the counter.",
      "aeethodGapSolution": "Weighted lottery & tier-gated pre-order system that guarantees verified local tournament attendees get first access."
},
    supplyDemandModel: {
      "reservationPrice": 180,
      "marketCapacity": 1300,
      "marginalCost": 0.2,
      "cloudCostBreakdown": "Pre-order database locks + loyalty points weighted scoring ledger ($0.20)",
      "competitorEffectivePrice": 75,
      "competitorPriceLabel": "Google Sheets & Discord DMs (~$75/mo in lost staff time and customer drama)",
      "equilibriumQuantity": 840,
      "competitorQuantity": 360,
      "consumerSurplusPerStore": 31,
      "producerSurplusPerStore": 148.8,
      "deadweightLossMonthly": 17760,
      "demandBehavior": "Elastic (ε = -1.40). Seasonal demand surges around major set releases (4 times/year per game).",
      "supplyElasticityDescription": "Simple relational database tables and scheduled email alerts.",
      "substituteThreat": "First-come first-served pre-order chaos or manual Google Forms vulnerable to scalper bot raids.",
      "bundlingStrategy": "Eliminates distributor pre-order allocation headaches and rewards loyal local players over scalpers."
},
    name: 'Sealed Product Pre-Order & Distributor Allocation Modeler',
    shortName: 'Sealed Allocation Modeler',
    category: 'Working Capital & Inventory',
    onlineModel: '100% Cloud Web',
    icon: '📊',
    economicRole: 'Prevents working capital insolvency by forecasting booster box sell-through velocity before distributor cutoff dates.',
    
    merchantWtp: '$70 – $140 / mo',
    wtpRange: { min: 70, max: 140 },
    competitorsPrice: 'Basic Shopify drops or custom spreadsheets.',
    suggestedPrice: 'Included in Core ($149/mo flat)',
    suggestedPriceNum: 149,
    unitCostToServe: '$0.40/mo per store (Statistical forecasting worker)',
    grossMarginPct: 99.7,

    elasticity: 'ε = -1.25 (Unit Elastic / Elastic)',
    elasticityNum: -1.25,
    elasticityType: 'Unit Elastic',
    demandDriver: 'Distributor pre-order deadlines occur 3-5 months before release. Over-ordering on weak sets freezes $20k–$80k in dead capital.',
    supplyDynamics: 'Predictive sell-through models based on pre-order velocity and historical set performance.',
    deadweightLossRisk: 'Stores over-allocated on failed sets are forced to dump booster boxes below distributor invoice cost to survive.',

    devComplexity: 'Medium (Distributor invoice parsing, customer deposit logic, allocation ceilings)',
    switchingLeverage: 'Medium-High (Protects store balance sheet)',

    featureDetails: {
      overview: 'A forecasting and pre-order management system for sealed booster boxes, collector boxes, and bundles. Matches incoming customer pre-order deposits against wholesale distributor allocation quotas (Southern Hobby, Alliance, GTS) to prevent over-purchasing.',
      cloudArchitecture: 'Cloud analytics service parsing distributor purchase orders and comparing pre-order velocity against past 12 release cycles.',
      workflow: [
        'Store inputs distributor allocation caps and wholesale wholesale costs.',
        'Launches customer pre-order campaign with custom deposit thresholds (20% or 100% upfront).',
        'Modeler forecasts Day 1, Day 14, and Day 45 sell-through rates based on local community traffic.',
        'System flags over-allocation risks before distributor cancel deadlines pass.'
      ],
      keyBenefits: [
        'Prevents cashflow crunches caused by unsellable dead booster cases.',
        'Automates customer pre-order deposit collections and release-day pickup manifests.',
        'Maximizes gross margin by allocating sealed product between online pre-orders and in-store draft events.'
      ]
    },

    competitorBreakdown: {
      binderpos: {
        name: 'BinderPOS',
        price: 'None',
        status: 'Legacy',
        flaw: 'Only standard Shopify product listings; zero distributor allocation forecasting.'
      },
      tcgsync: {
        name: 'TCG Sync',
        price: 'Supported',
        status: 'Active',
        flaw: 'Supports reservations, but lacks predictive sell-through analytics.'
      },
      storepass: {
        name: 'Storepass',
        price: 'High-traffic drop page',
        status: 'Active',
        flaw: 'Excellent drop page queue protection, but lacks distributor allocation optimization.'
      },
      decktradr: {
        name: 'DeckTradr',
        price: 'None',
        status: 'Active',
        flaw: 'No sealed product management.'
      },
      blstr: {
        name: 'blstr',
        price: 'Basic',
        status: 'Active',
        flaw: 'Basic Shopify pre-order handling.'
      },
      crystalcommerce: {
        name: 'Crystal Commerce',
        price: 'Basic',
        status: 'Legacy',
        flaw: 'Manual pre-order tracking prone to double-booking allocations.'
      },
      aeethodWedge: 'Distributor Allocation vs Demand Velocity Engine that prevents store balance-sheet impairment on weak set releases.'
    }
  },

  {
    id: 'raw-to-graded',
    name: 'Raw-to-Graded Arbitrage & Slabs ROI Modeler',
    shortName: 'Grading Arbitrage Modeler',
    category: 'Margin Expansion Analytics',
    onlineModel: '100% Cloud Web',
    icon: '💎',
    economicRole: 'Identifies cards in store inventory where grading fees ($20) yield +$150 premium at PSA 10.',
    
    merchantWtp: '$60 – $110 / mo',
    wtpRange: { min: 60, max: 110 },
    competitorsPrice: 'Third-party slab tools charge $30–$60/mo; zero competitors offer this natively.',
    suggestedPrice: 'Included in Core ($149/mo flat)',
    suggestedPriceNum: 149,
    unitCostToServe: '$0.60/mo per store (PSA / BGS population report scrapers & eBay slab comps)',
    grossMarginPct: 99.4,

    elasticity: 'ε = -2.10 (Hyper-Elastic Discretionary)',
    elasticityNum: -2.10,
    elasticityType: 'Hyper-Elastic',
    demandDriver: 'High-margin collector card dealers and vintage specialists seeking to turn $30 raw singles into $300 slabs.',
    supplyDynamics: 'Historical PSA/BGS population reports and eBay sold comps scraped and cached in cloud DB.',
    deadweightLossRisk: 'Under-grading cards leaves tens of thousands of dollars in unrealized consumer surplus on the table.',

    devComplexity: 'Medium (eBay sold slab comps vs raw TCG Market, PSA population ratios)',
    switchingLeverage: 'Medium (High-profit feature for collectible card dealers)',

    featureDetails: {
      overview: 'An arbitrage scanner that cross-references store inventory against historical PSA, BGS, and CGC grading population reports and eBay slab auction results. Identifies which raw cards in stock have high PSA 10 gem mint rates and lucrative price spreads.',
      cloudArchitecture: 'Cloud scraping and statistical regression service monitoring eBay completed sales for graded slabs vs raw TCGplayer market prices.',
      workflow: [
        'Engine scans store singles inventory with market values over $15.',
        'Calculates Expected Value: $EV = (Pop_{PSA10} \\times P_{10}) + (Pop_{PSA9} \\times P_9) - GradingFee - P_{raw}$.',
        'Flags top 50 cards with highest expected grading ROI directly on merchant dashboard.',
        'Prepares grading submission submission manifests with automatic barcode tracking.'
      ],
      keyBenefits: [
        'Unlocks $2,000–$8,000/mo in added gross profit by grading the right singles instead of selling raw.',
        'Eliminates guesswork on whether submitting a modern Pokémon chase card to PSA is profitable.',
        'Tracks grading submission batches from submission to slab return with automated catalog updates.'
      ]
    },

    competitorBreakdown: {
      binderpos: { name: 'BinderPOS', price: 'None', status: 'Legacy', flaw: 'Zero slab or grading analytics.' },
      tcgsync: { name: 'TCG Sync', price: 'None', status: 'Active', flaw: 'Does not support grading spread modeling.' },
      storepass: { name: 'Storepass', price: 'None', status: 'Active', flaw: 'No slab arbitrage tools.' },
      decktradr: { name: 'DeckTradr', price: 'Basic raw grading', status: 'Active', flaw: 'Basic condition guide; no market arbitrage formulas.' },
      blstr: { name: 'blstr', price: 'None', status: 'Active', flaw: 'No grading features.' },
      crystalcommerce: { name: 'Crystal Commerce', price: 'None', status: 'Legacy', flaw: 'Completely unaware of grading population dynamics.' },
      aeethodWedge: 'Built-in Graded Spread Modeler with historical PSA/BGS 10 population ratios and expected value arbitrage calculators.'
    }
  },

  {
    id: 'consign-payouts',
    name: 'Automated Consignment & Community Payout Engine',
    shortName: 'Consignment Engine',
    category: 'Financial Ledger & Community',
    onlineModel: '100% Cloud Web',
    icon: '🤝',
    economicRole: 'Enables stores to sell $10k+ grail cards with zero inventory risk on a 15% store commission.',
    
    merchantWtp: '$90 – $150 / mo',
    wtpRange: { min: 90, max: 150 },
    competitorsPrice: 'Storepass ($499/mo tier); others require messy manual Excel sheets.',
    suggestedPrice: 'Included in Core ($149/mo flat)',
    suggestedPriceNum: 149,
    unitCostToServe: '$0.50/mo per store (Consignor portal logins & ledger)',
    grossMarginPct: 99.6,

    elasticity: 'ε = -1.80 (Elastic Discretionary)',
    elasticityNum: -1.80,
    elasticityType: 'Hyper-Elastic',
    demandDriver: 'Stores wanting to showcase high-value vintage cards (Alpha Black Lotus, Base Set Charizard) without risking $10,000+ of store working capital.',
    supplyDynamics: 'Multi-vendor ledger with automated commission splits and ACH/Store Credit payouts.',
    deadweightLossRisk: 'Without automated consignment, collectors take their grail cards to eBay or PWCC, bypassing the local game store.',

    devComplexity: 'Medium-High (Multi-vendor ledger, customer consignor portals, automated payouts)',
    switchingLeverage: 'High (B2B local collector community lock-in)',

    featureDetails: {
      overview: 'A complete consignment management system. Local collectors can consign high-value single cards or sealed vintage products at the store. The store lists them across webstore and POS, takes a 10%–20% cut upon sale, and issues automated payouts via bank transfer or store credit.',
      cloudArchitecture: 'Cloud multi-tenant ledger tracking consignor balances, sales history, fee schedules, and payout statements.',
      workflow: [
        'Consignor creates account on store portal and drops off high-value cards.',
        'Cards are tagged to consignor ID and published to webstore and showcase POS.',
        'When card sells, system automatically deducts store cut (e.g. 15%) and credits consignor ledger.',
        'Consignor views sales in real time on their private mobile portal and requests payout.'
      ],
      keyBenefits: [
        'Fills display showcases with $50k+ in grail inventory with $0 store capital deployed.',
        'Converts local power collectors into loyal brand ambassadors for the store.',
        'Replaces messy, error-prone manual spreadsheets with an automated, auditable ledger.'
      ]
    },

    competitorBreakdown: {
      binderpos: { name: 'BinderPOS', price: 'Manual spreadsheets', status: 'Legacy', flaw: 'No native consignment; stores must manage spreadsheets.' },
      tcgsync: { name: 'TCG Sync', price: 'Partial', status: 'Active', flaw: 'Basic vendor tracking, but lacks self-serve consignor customer portal.' },
      storepass: { name: 'Storepass', price: 'Enterprise only', status: 'Active', flaw: 'Advanced consignment module, but locked into $499+/mo tier.' },
      decktradr: { name: 'DeckTradr', price: 'None', status: 'Active', flaw: 'No consignment tracking.' },
      blstr: { name: 'blstr', price: 'None', status: 'Active', flaw: 'No consignment module.' },
      crystalcommerce: { name: 'Crystal Commerce', price: 'Clunky', status: 'Legacy', flaw: 'Antiquated vendor payout module with frequent accounting discrepancies.' },
      aeethodWedge: 'Automated Consignor Mobile Portals with real-time sales notifications, automated fee splits, and store credit bonuses.'
    }
  },

  {
    id: 'zero-commission-model',
    marketGap: {
      "totalStoresNeeding": 3000,
      "marketNeedPercentage": 100,
      "urgencyLevel": "Critical (Showstopper)",
      "demandPainDescription": "Paying 2%–2.5% GMV commission ($1,200–$3,500/mo) on top of Stripe (2.9%) and card cost-of-goods destroys store net profit.",
      "competitorSuppliedStores": 210,
      "competitorSupplyStatus": "Incumbents Structurally Trapped",
      "competitorSupplyBottleneck": "Incumbents (BinderPOS, TCG Sync, Crystal Commerce) cannot eliminate commissions without bankrupting their parent company revenue.",
      "unservedStores": 2790,
      "gapPercentage": 93,
      "unservedWorkaround": "Paying thousands in monthly revenue tax to software vendors, or artificially restricting online sales to avoid reaching higher tax tiers.",
      "aeethodGapSolution": "Strictly flat $99–$249/mo SaaS with 0% GMV commission forever, saving stores $15,000–$35,000 annually."
},
    supplyDemandModel: {
      "reservationPrice": 2500,
      "marketCapacity": 1800,
      "marginalCost": 0,
      "cloudCostBreakdown": "$0.00 (Pure business model commitment with automated Stripe billing)",
      "competitorEffectivePrice": 1250,
      "competitorPriceLabel": "$1,250–$3,500/mo (2.5% GMV commission on standard $50k singles volume)",
      "equilibriumQuantity": 1680,
      "competitorQuantity": 520,
      "consumerSurplusPerStore": 2351,
      "producerSurplusPerStore": 149,
      "deadweightLossMonthly": 638000,
      "demandBehavior": "Inelastic (ε = -0.15). Absolute economic dominant strategy. Stores universally prefer flat pricing over GMV revenue sharing.",
      "supplyElasticityDescription": "Cloud architecture has no marginal physical costs, making flat subscriptions vastly more profitable at scale.",
      "substituteThreat": "Accepting 2%–2.5% GMV tribute to legacy software cartels (BinderPOS/TCG Sync).",
      "bundlingStrategy": "The overarching philosophical moat that renders incumbent software obsolete overnight."
},
    name: '0% GMV Commission Architecture (Flat SaaS Guarantee)',
    shortName: '0% Commission Architecture',
    category: 'Economic Business Model',
    onlineModel: '100% Cloud Web',
    icon: '🛡️',
    economicRole: 'Puts $1,500 – $4,000/mo back into store pockets by killing the 2.5% GMV software tax.',
    
    merchantWtp: 'PRICELESS ($20k+ annual savings)',
    wtpRange: { min: 300, max: 800 },
    competitorsPrice: 'BinderPOS (2.5% GMV), TCG Sync (2.0% GMV), Crystal Commerce (2.5% GMV).',
    suggestedPrice: '$99 – $249 / mo flat rate (0% commission forever)',
    suggestedPriceNum: 149,
    unitCostToServe: '$0 (Pure business model commitment)',
    grossMarginPct: 100,

    elasticity: 'ε = -0.15 (Absolute Preference Multiplier)',
    elasticityNum: -0.15,
    elasticityType: 'Inelastic',
    demandDriver: 'Retailers despise paying percentage taxes on top of Stripe (2.9%) and marketplaces (10%–13%). Commission fatigue is at an all-time peak.',
    supplyDynamics: 'Enabled by efficient modern cloud microservices that do not have the high overhead of legacy incumbents.',
    deadweightLossRisk: '2.5% software tax creates deadweight loss by making low-margin sales unprofitable, depressing overall industry commerce.',

    devComplexity: 'Zero software complexity (Credible business model commitment)',
    switchingLeverage: 'UNBEATABLE (The ultimate wedge to conquer market share)',

    featureDetails: {
      overview: 'Aeethod OS operates strictly on a predictable, flat monthly subscription ($99 to $249/mo) with zero commission on singles GMV. Whether a store sells $10,000 or $500,000 of cards in a month, Aeethod never takes a single percentage point of their revenue.',
      cloudArchitecture: 'Cloud billing managed via Stripe Subscriptions. No transaction revenue meters or GMV audit hooks.',
      workflow: [
        'Store chooses flat subscription tier based on store size ($99 Core or $249 Pro).',
        'Processes unlimited sales across webstore, POS, and conventions.',
        '100% of sales revenue deposits directly into store bank account.',
        'Predictable, transparent invoice every month with zero hidden fees.'
      ],
      keyBenefits: [
        'Saves a store doing $60,000/mo singles volume exactly $1,500 every single month ($18,000/yr).',
        'Aligns incentives: Aeethod only succeeds when providing software that helps stores grow, not by taxing transactions.',
        'Removes the Innovator\'s Dilemma trap that prevents BinderPOS and TCG Sync from competing.'
      ]
    },

    competitorBreakdown: {
      binderpos: { name: 'BinderPOS', price: '2.5% GMV Tax', status: 'Trapped', flaw: 'Signups paused Feb 2025; cutting commission to 0% would destroy 70% of parent company cashflow.' },
      tcgsync: { name: 'TCG Sync', price: '2.0% TCG Sales Tax', status: 'Trapped', flaw: 'Relies on 2% GMV to subsidize high customer support overhead.' },
      storepass: { name: 'Storepass', price: '$499/mo to escape tax', status: 'Active', flaw: '0% commission only available on $499+/mo enterprise plan; smaller plans pay 2% tax.' },
      decktradr: { name: 'DeckTradr', price: 'Niche transaction fees', status: 'Active', flaw: 'Charges fees on trade-in transactions.' },
      blstr: { name: 'blstr', price: '$149 flat', status: 'Active', flaw: 'Flat pricing, but limited to basic Shopify stores.' },
      crystalcommerce: { name: 'Crystal Commerce', price: '2.5% Marketplace fee', status: 'Legacy', flaw: 'Extracts 2.5% tax on webstore and channel sales.' },
      aeethodWedge: 'Strictly Dominant Strategy: 100% Flat Subscription ($99–$249/mo) with Zero GMV Tax Forever.'
    }
  }
];
