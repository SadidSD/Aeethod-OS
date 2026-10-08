export interface AudienceCohort {
  id: 'lgs_owner' | 'reseller' | 'collector' | 'dreamer';
  title: string;
  tag: string;
  badgeColor: string;
  avatarIcon: string;
  demographics: string;
  
  // Funnel Mapping Attributes
  funnelStage: 'BOFU (Core SaaS Buyer)' | 'MOFU (Margin Multiplier)' | 'TOFU-MOFU (Validation Bridge)' | 'TOFU (Algorithmic Seed)';
  funnelStageBadge: string;
  funnelStagePill: 'TOFU' | 'MOFU' | 'BOFU' | 'TOFU-MOFU';
  funnelRole: string;
  commercialValueToSaaS: string;
  
  // 3-Tier Funnel Triggers (How this persona moves through TOFU -> MOFU -> BOFU)
  funnelTriggers: {
    tofuHook: {
      headline: string;
      mechanism: string;
      sampleHook: string;
    };
    mofuResonance: {
      headline: string;
      mechanism: string;
      targetMetric: string;
    };
    bofuConversion: {
      headline: string;
      mechanism: string;
      action: string;
    };
  };

  // Psychological & Operational Reality
  primaryNightmare: string;
  greedDesire: string;
  objectionToSaaS: string;
  aeethodKillerFeature: {
    name: string;
    description: string;
  };
  
  // Algorithmic Mechanics & Outro Blueprint
  algorithmicHabit: string;
  keyInteractionTrigger: 'DM Sends' | 'Bookmarks & Saves' | 'Loop Replays & Comments' | 'Watch Time';
  triggerKeywords: string[];
  winningHooks: string[];
  funnelCtaBlueprint: {
    ctaType: string;
    spokenScript: string;
  };
  creatorFit: 'Sadid' | 'Anika' | 'Both';
}

export interface ContentSpaceRecurringSeries {
  seriesId: string;
  title: string;
  format: string;
  cadence: string;
  description: string;
}

export interface ContentSpaceVideoAngle {
  angleId: string;
  seriesTitle: string;
  title: string;
  targetAudience: string;
  hook: string;
  coreMechanism: string;
  executionChecklist: string[];
}

export interface ContentSpace {
  id: string;
  spaceNumber: number;
  title: string;
  tagline: string;
  strategicDomain: string;
  category: 'Economics & Operations' | 'Retail & Automation' | 'Market Dynamics & Pricing Defense' | 'Live Operations & Conventions';
  viralMultiplier: '5x DM Share' | '4x Save / Bookmark' | 'APW >120% Loop' | 'High Debate Comments';
  targetAudienceB2B: string;
  whyItIsAWhiteSpace: {
    competitorBlindSpot: string;
    audiencePainAndDemand: string;
    strategicMoat: string;
  };
  aeethodSaaSAnchor: {
    featureName: string;
    productAdvantage: string;
    commercialPayoff: string;
  };
  recurringSeries: ContentSpaceRecurringSeries[];
  videoAnglesLibrary: ContentSpaceVideoAngle[];
}

export interface WhiteSpaceGap {
  id: string;
  niche: string;
  category: 'Economics & Operations' | 'Retail & Automation' | 'Market Dynamics & Pricing Defense' | 'Live Operations & Conventions';
  viralMultiplier: '5x DM Share' | '4x Save / Bookmark' | 'APW >120% Loop' | 'High Debate Comments';
  primaryFormat: string;
  redOceanTrap: {
    title: string;
    flaw: string;
    consequence: string;
  };
  blueOceanWedge: {
    title: string;
    advantage: string;
    algorithmicMoat: string;
    exampleHook: string;
    creator: 'Sadid' | 'Anika' | 'Both';
  };
  tacticalChecklist: string[];
}

export interface CompetitorAnalysis {
  id: string;
  category: string;
  representativePlayers: string;
  coreStrength: string;
  fatalBlindspot: string;
  aeethodWedge: string;
}

export interface DemandSupplyMatrixItem {
  id: string;
  quadrant: 'goldmine' | 'trend' | 'flop';
  quadrantName: string;
  badge: string;
  allocationPct: string;
  demandLevel: 'High' | 'Low';
  supplyLevel: 'High' | 'Low';
  strategicDirective: string;
  examples: {
    topic: string;
    mechanism: string;
    hookPreview: string;
  }[];
}

export interface PreFlightChecklistRule {
  id: string;
  stepNumber: number;
  gateName: string;
  coreQuestion: string;
  passIndicator: string;
  killTrigger: string;
  algorithmicReward: string;
}

export interface FunnelStage {
  id: 'tofu' | 'mofu' | 'bofu';
  stageName: string;
  funnelLabel: string;
  badgeColor: string;
  targetAudience: string;
  strategicObjective: string;
  psychologicalTriggers: string[];
  contentFormats: {
    formatTitle: string;
    description: string;
    testedHookExample: string;
    runtime: string;
    primaryCreator: 'Sadid' | 'Anika' | 'Both';
  }[];
  algorithmicGates: {
    gate: string;
    metricTarget: string;
    mechanism: string;
  }[];
  callToAction: {
    ctaType: string;
    sampleCopy: string;
    conversionAsset: string;
  };
}

export interface TcgIndustryAnalysis {
  macroMarketOverview: {
    totalEstimatedGmv: string;
    activeStoresGlobal: string;
    powerSellersCount: string;
    contentLandscapeSummary: string;
  };
  supplyDemandParadox: {
    consumerHypeShare: string;
    gameplayShare: string;
    collectorShare: string;
    b2bRetailShare: string;
    unmetNeedDescription: string;
  };
  theThreeTraps: {
    trapName: string;
    trapFlaw: string;
    aeethodCounterMove: string;
  }[];
}

export const AUDIENCE_COHORTS: AudienceCohort[] = [
  {
    id: 'lgs_owner',
    title: 'The Overworked LGS Owner & Store Manager',
    tag: 'B2B Core Buyer',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    avatarIcon: '🏢',
    demographics: 'Age 28–52 • Owns or operates physical card shops with 2–15 retail clerks',
    funnelStage: 'BOFU (Core SaaS Buyer)',
    funnelStageBadge: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25',
    funnelStagePill: 'BOFU',
    funnelRole: 'Primary Commercial Buyer ($149/mo Flat SaaS Revenue)',
    commercialValueToSaaS:
      'Direct MRR Generation. Each store pays $149/mo flat with 0% GMV commission, recovering $1,250/mo vs BinderPOS 2.5% tax. Extremely high LTV (>36 months) with near-zero churn once cloud POS & inventory sync are active.',
    funnelTriggers: {
      tofuHook: {
        headline: 'The 11:30 PM Midnight Exhaustion Trigger',
        mechanism: 'Clerk typing speed vs optical scanner battles, and night-shift sorting overtime.',
        sampleHook:
          'Selling the same $300 slab in-store and on eBay at the exact same minute is NOT bad luck — it is legacy software latency.'
      },
      mofuResonance: {
        headline: 'The 2.5% Commission Autopsy',
        mechanism: 'Exposing the hidden $1,500/mo GMV tax charged by incumbent vendors, employee intake payroll burn, and distributor tie-in cash traps.',
        targetMetric: '5x DM Share to store partners & co-owners ("Look at this. We are bleeding cash.")'
      },
      bofuConversion: {
        headline: 'The 320ms Multi-Channel Delist Demo',
        mechanism: 'Live split-screen showing a card selling on physical counter and automatically delisting from eBay/TCGplayer in under 320ms.',
        action: 'Taps bio link, books a 15-minute migration demo, and signs up for $149/mo flat.'
      }
    },
    primaryNightmare:
      'Bleeding cash on hourly sorting payroll, 6-hour inventory intake marathons, double-selling $400 slabs across eBay & in-store POS, and losing $18,000/year to BinderPOS 2.5% GMV commission.',
    greedDesire:
      'Predictable gross margin return on investment (GMROI), automated optical intake, sub-500ms multi-channel syncing, 0% GMV commission, and leaving the shop at 9:00 PM without unpaid sorting overtime.',
    objectionToSaaS:
      'Migration is too painful: "Our 25,000 singles are already stuck in Shopify/BinderPOS and re-cataloging would take months."',
    aeethodKillerFeature: {
      name: '1-Click Legacy Store Importer & Sub-320ms Redis Channel Sync',
      description:
        'Zero-downtime migration from BinderPOS/Shopify plus real-time inventory delisting across in-store POS, eBay, and TCGplayer in under 320ms.'
    },
    algorithmicHabit:
      'High DM Share Velocity (5x multiplier) — DMs reels directly to store partners, co-owners, and head clerks: "We need this exact system in our shop."',
    keyInteractionTrigger: 'DM Sends',
    triggerKeywords: ['Buylist formula', 'Clerk payroll', 'Double sold', 'Allocation cut', 'Sync delay', 'Net profit', 'BinderPOS fee'],
    winningHooks: [
      'Selling a $100 card on a marketplace does NOT give you $100 in the bank.',
      'A store owner boasted about an $18,000 cash-out day. Here is what they actually netted after fees and clerk labor.',
      'Selling the same $300 slab in-store and on eBay at the exact same minute is NOT bad luck.'
    ],
    funnelCtaBlueprint: {
      ctaType: 'Direct Demo Booking & Ledger Audit',
      spokenScript:
        'If your POS vendor takes 2.5% of your card sales, DM us "AUDIT" or tap the bio link to run your store\'s migration calculator.'
    },
    creatorFit: 'Sadid'
  },
  {
    id: 'reseller',
    title: 'The Full-Time Reseller & Power Flipper',
    tag: 'High-Volume Transactional',
    badgeColor: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
    avatarIcon: '📦',
    demographics: 'Age 20–38 • Flips singles and sealed cases from home, card shows, eBay, and TCGplayer',
    funnelStage: 'MOFU (Margin Multiplier)',
    funnelStageBadge: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/25',
    funnelStagePill: 'MOFU',
    funnelRole: 'High-Volume Intake Multiplier & Future Store Founder',
    commercialValueToSaaS:
      'High-Volume Product Advocacy & Top-of-Funnel Word of Mouth. Generates 1,000+ card scans per week, recommends Aeethod to convention vendors, and represents the next cohort of physical card shop founders.',
    funnelTriggers: {
      tofuHook: {
        headline: 'The Trade Counter Dilemma',
        mechanism: '"$50 Cash vs $85 Store Credit" trade negotiations, bulk lot margin traps, and fast inventory turnover puzzles.',
        sampleHook:
          'If you sell cards under $2.49 on TCGplayer Direct, you are literally working for free after postage and handling.'
      },
      mofuResonance: {
        headline: 'The 70% Buylist Margin Guardrail',
        mechanism: 'Calculating cash-flow cycles, platform fee deductions (TCGplayer fee increases), and inventory holding cost decay.',
        targetMetric: '4x Save & Bookmark Rate (saving fee formulas to check during live collection buyouts).'
      },
      bofuConversion: {
        headline: 'The 60fps Optical Camera Batch Scanner',
        mechanism: 'Scanning 100 raw cards in 3 minutes via mobile phone camera without manual typing, syncing instantly to eBay draft listings.',
        action: 'Adopts Aeethod Solo/Power Seller tier or registers for the beta intake scanner.'
      }
    },
    primaryNightmare:
      'Platform fee inflation (TCGplayer Direct micro-fee hikes), return fraud, shipping chargebacks, and buying binder collections with undetected micro-creases that destroy margin.',
    greedDesire:
      'The 70% buylist formula, rapid 7-day inventory velocity, buying at 50% cash value without customer pushback, and mathematical margin guardrails.',
    objectionToSaaS:
      'I don\'t have a physical retail storefront yet, so enterprise POS systems are too expensive and clunky for my card show setup.',
    aeethodKillerFeature: {
      name: 'Browser Neural Vision Scanner & Mobile Convention POS',
      description:
        '60fps optical card recognition that works on any phone or laptop camera with offline cache mode for card shows and conventions.'
    },
    algorithmicHabit:
      'High Save / Bookmark Rate (4x multiplier) — Saves videos to consult pricing deduction formulas and fee tables during trade negotiations.',
    keyInteractionTrigger: 'Bookmarks & Saves',
    triggerKeywords: ['TCGplayer fee update', 'Gross vs Net', 'Buylist 70%', 'Binder buyout', 'Packaging loss', 'Convention POS'],
    winningHooks: [
      'If you sell cards under $2.49 on TCGplayer Direct, you are working for free.',
      'How to calculate cash vs store credit margins without losing money on fees.',
      'Do NOT order your Q4 sealed inventory until you run these 3 working-capital numbers.'
    ],
    funnelCtaBlueprint: {
      ctaType: 'Buylist Cheat-Sheet & Scanner Beta',
      spokenScript:
        'Save this video for your next binder buyout, and comment "SCANNER" to test the 60fps card recognition tool free.'
    },
    creatorFit: 'Sadid'
  },
  {
    id: 'collector',
    title: 'The Serious Collector & Slab Investor',
    tag: 'High-Ticket Capital',
    badgeColor: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
    avatarIcon: '💎',
    demographics: 'Age 24–48 • High disposable income, purchasing $150 to $10,000+ raw vintage and PSA/CGC slabs',
    funnelStage: 'TOFU-MOFU (Validation Bridge)',
    funnelStageBadge: 'bg-purple-500/10 text-purple-400 border border-purple-500/25',
    funnelStagePill: 'TOFU-MOFU',
    funnelRole: 'Authenticity Validation & Comment Debate Multiplier',
    commercialValueToSaaS:
      'Technical Credibility & Algorithmic Debate Engine. Drives fierce comment wars (debating foil patterns, PSA grading grades, and counterfeit tells), validating that Aeethod\'s neural vision model is technically elite.',
    funnelTriggers: {
      tofuHook: {
        headline: 'The 10x Jeweler Loupe Mystery',
        mechanism: 'Inspecting counterfeit rosette patterns, micro-creases, hairline surface scratches, and fake vs real comparison splits.',
        sampleHook:
          'A customer brought in this vintage Charizard asking for $1,200 cash, but one micro-flaw under the loupe changed our offer to $0.'
      },
      mofuResonance: {
        headline: 'Condition Grading & Value Defense',
        mechanism: 'Deep-dive teardowns on how hidden factory print lines knock a PSA 10 down to a PSA 7, destroying $1,500 in value.',
        targetMetric: 'High Comment Velocity (debating grading subjectivity and authentication tells).'
      },
      bofuConversion: {
        headline: 'The Verified Store Standard',
        mechanism: 'Showing card shops that use Aeethod optical grading kiosks to give fair, transparent, non-subjective buy prices.',
        action: 'Demands local card shops adopt Aeethod transparent intake; follows Aeethod social channels for market data.'
      }
    },
    primaryNightmare:
      'Paying PSA 9 prices for a card with an invisible binder ring compression ding, buying counterfeit factory fakes, or holding pumped cards right before a reprint crash.',
    greedDesire:
      'Spotting undervalued raw cards that will grade PSA 10, forensic counterfeit detection skills, and timing the secondary market print cycles.',
    objectionToSaaS:
      'I am an individual collector, not a commercial retailer — why do I need inventory software?',
    aeethodKillerFeature: {
      name: 'Micro-Flaw Condition & Optical Authentication Vision',
      description:
        'Computer vision trained on thousands of authentic TCG cards to detect surface indents, rosette print errors, and centering ratios.'
    },
    algorithmicHabit:
      'High Loop Replay (APW >120%) & Fierce Comment Debates — Loops videos 2x to inspect the foil under 10x jeweler loupe and argues authentication in the comments.',
    keyInteractionTrigger: 'Loop Replays & Comments',
    triggerKeywords: ['Loupe zoom', 'Foil pattern fake', 'PSA 8 to PSA 5', 'Hairline indent', 'Reprint crash', 'Surface ding'],
    winningHooks: [
      'A customer brought in this vintage Charizard asking for cash, but one micro-flaw changed the offer.',
      'Can you spot the Super Fake 30th Celebration Mew ex in 5 seconds?',
      'One of these is worth $800. The other came from an overseas counterfeit factory.'
    ],
    funnelCtaBlueprint: {
      ctaType: 'Comment Debate & Condition Checklist',
      spokenScript:
        'Did you spot the counterfeit tell before we zoomed in? Drop your guess in the comments and save this for your next slab purchase.'
    },
    creatorFit: 'Anika'
  },
  {
    id: 'dreamer',
    title: 'The Hobby Dreamer & Casual Player',
    tag: 'Viral Reach & Community',
    badgeColor: 'bg-pink-500/10 text-pink-400 border border-pink-500/20',
    avatarIcon: '🎮',
    demographics: 'Age 15–32 • Plays local weekly tournaments, opens packs, dreams of opening an LGS one day',
    funnelStage: 'TOFU (Algorithmic Seed)',
    funnelStageBadge: 'bg-pink-500/10 text-pink-400 border border-pink-500/25',
    funnelStagePill: 'TOFU',
    funnelRole: 'Viral Velocity Multiplier & Baseline Watch Time Seed',
    commercialValueToSaaS:
      'Top-of-Funnel Algorithmic Fuel. Supplies the raw watch time, loop completions, and casual likes that signal Instagram and YouTube algorithms to push Aeethod videos to millions of viewers, inevitably reaching lurking store owners.',
    funnelTriggers: {
      tofuHook: {
        headline: 'The Saturday Night Card Shop Reality',
        mechanism: 'Dramatic behind-the-counter storytelling, tournament chaos, trade desk rush hour, and opening massive vintage binder collections.',
        sampleHook:
          'People think owning a card shop is opening packs all day. Here is what 8:45 PM on a Saturday night tournament actually looks like.'
      },
      mofuResonance: {
        headline: 'The Economics of Card Shop Ownership',
        mechanism: 'Transparent breakdowns of store P&Ls, what wholesale booster boxes cost vs retail, and how prize support works.',
        targetMetric: 'Raw Watch Time (watching 45s-60s narrative videos to 100% completion).'
      },
      bofuConversion: {
        headline: 'The Future Store Founder Onboarding',
        mechanism: 'Showing how modern card shops run smoothly with self-service kiosks and automated scanners instead of stressed clerks.',
        action: 'Advocates for Aeethod at their local LGS ("Hey, why don\'t you guys use that Aeethod scanner?") and plans future store around it.'
      }
    },
    primaryNightmare:
      'Missing out on chase cards, paying scalper markups, and intimidation at the store trade-in counter.',
    greedDesire:
      'Behind-the-scenes reality of what running a card store is actually like, and experiencing huge binder unboxing reveals.',
    objectionToSaaS:
      'I don\'t have a business yet, I just love playing and collecting cards.',
    aeethodKillerFeature: {
      name: 'Self-Service Buylist Kiosk & Decklist Webstore Ingest',
      description:
        'Customer-facing kiosk where players drop decklists or singles and get immediate cash/credit valuation without clerk friction.'
    },
    algorithmicHabit:
      'High Raw Watch Time & Casual Likes — Watches narrative storytelling arcs from start to finish, driving baseline algorithm distribution.',
    keyInteractionTrigger: 'Watch Time',
    triggerKeywords: ['Saturday night rush', 'Behind the counter', 'Card shop reality', 'Tournament night', 'Decklist intake'],
    winningHooks: [
      'People think working at a card shop is opening packs all day. Here is what Saturday night actually looks like.',
      'Saturday 8:30 PM: 30 tournament players rush the trade-in counter with 1,500 unsorted foils.'
    ],
    funnelCtaBlueprint: {
      ctaType: 'Community Engagement & LGS Tagging',
      spokenScript:
        'Tag your local card shop in the comments to see if their trade counter looks like this on Saturday night!'
    },
    creatorFit: 'Anika'
  }
];

export const CONTENT_SPACES: ContentSpace[] = [
  {
    id: 'cs-margin-tax',
    spaceNumber: 1,
    title: 'Retail Financial Forensics & Platform Tax Space',
    tagline: 'The Store Margin, Commission Audit & Ledger Space',
    strategicDomain: 'Card Shop Margin Math, 2.5% GMV Incumbent Taxes, Distributor Tie-In Ratios & Cash Conversion Cycles',
    category: 'Economics & Operations',
    viralMultiplier: '5x DM Share',
    targetAudienceB2B: 'LGS Owners, Store Partners, Operations Directors & Power Flippers',
    whyItIsAWhiteSpace: {
      competitorBlindSpot:
        'Competitor creators only talk about consumer pack pulls or vague "investing in cards", while SaaS providers post generic sterile pricing grids with zero viewer retention.',
      audiencePainAndDemand:
        'Card store owners work 70-hour weeks but have empty bank accounts. They are desperate for transparent mathematical autopsies showing where their gross revenue bleeds into commissions, distributor dead stock, and fees.',
      strategicMoat:
        'Zero creators talk about cold retail ledger forensics. Revealing exact math triggers instant DM share velocity among business partners and store co-owners.'
    },
    aeethodSaaSAnchor: {
      featureName: '0% GMV Flat SaaS Architecture ($149/mo)',
      productAdvantage:
        'Flat-rate cloud POS and webstore engine that takes 0% commission on merchant revenue, eliminating the 2.5% BinderPOS tax and £1,000 TCG Sync setup ransom.',
      commercialPayoff: 'Returns $15,000 to $45,000 directly to net profit annually for stores doing $50,000+/mo in singles.'
    },
    recurringSeries: [
      {
        seriesId: 'series-pnl-audit',
        title: 'The 2.5% Commission Autopsy',
        format: '45s Rapid P&L Audit / Screen Recording',
        cadence: 'Bi-Weekly Evergreen',
        description:
          'Tearing down real merchant statements showing exactly how much cash legacy POS platforms extract each month from store gross sales.'
      },
      {
        seriesId: 'series-lgs-ledger',
        title: 'Real Store Financial Forensics',
        format: '60s Whiteboard Balance Sheet Teardown',
        cadence: 'Monthly Deep Dive',
        description:
          'Dismantling a $1M/yr card shop P&L: Rent, payroll, wholesale COGS, dead inventory carrying costs, and true net profit.'
      },
      {
        seriesId: 'series-wholesale-desk',
        title: 'The Wholesale Distributor Ratio Desk',
        format: '35s Distributor Invoice Audit',
        cadence: 'Post-Release Window',
        description:
          'Exposing distributor tie-in ratios, pre-order allocation traps, and working capital deadlocks across major set releases.'
      }
    ],
    videoAnglesLibrary: [
      {
        angleId: 'ang-1-1',
        seriesTitle: 'The 2.5% Commission Autopsy',
        title: 'The 3-Year $45,000 Commission Bleed',
        targetAudience: 'LGS Owners with >$40k/mo singles GMV',
        hook: 'If your card shop sells $60,000 a month in singles, your software vendor is quietly stealing $1,500 of your net profit every 30 days.',
        coreMechanism:
          'Slamming a real store P&L statement on desk, circling -$1,500 in red, and contrasting the 3-year compounding loss of 2.5% GMV vs flat $149/mo software.',
        executionChecklist: [
          'Frame 0: Slam physical monthly invoice on counter with -$1,500 circled in bright red marker.',
          'Second 3: Flash incumbent fee table: BinderPOS 2.5% vs TCG Sync 2% + £1,000 vs Aeethod 0%.',
          'Second 18: Project 3-year compounding cash loss ($45,000) reinvested into high-margin inventory.',
          'Ending: Seamless replay loop into opening hook sentence.'
        ]
      },
      {
        angleId: 'ang-1-2',
        seriesTitle: 'The Wholesale Distributor Ratio Desk',
        title: 'Distributor Tie-In Ratios & The Dead Stock Trap',
        targetAudience: 'Store Owners ordering sealed allocations',
        hook: 'Ordering $30,000 in sealed product does NOT mean you\'re getting 30 cases. Here is the distributor ratio they won\'t tell you.',
        coreMechanism:
          'Auditing a wholesale allocation invoice: Showing how distributors force stores to purchase 40% slow-moving board games to get tier allocations of Pokémon 151.',
        executionChecklist: [
          'Frame 0: Draw distributor invoice formula on whiteboard: $30,000 order = $6,200 actual chase product.',
          'Second 4: Explain the hidden carrying cost of dead stock sitting on shelves for 9 months.',
          'Second 18: Demonstrate how Aeethod\'s Pre-Order Allocation Modeler prevents liquidity starvation.',
          'Ending: Loop seamlessly back into opening question.'
        ]
      },
      {
        angleId: 'ang-1-3',
        seriesTitle: 'Real Store Financial Forensics',
        title: 'The 70% Buylist Margin Illusion',
        targetAudience: 'Shop Owners & Counter Clerks',
        hook: 'Paying 60% cash for a collection feels like an easy 40% profit. Here is why it\'s actually margin suicide.',
        coreMechanism:
          'Step-by-step mathematical deduction: Factoring sales tax, marketplace commission, shipping supplies, clerk grading labor, and 60-day price decay.',
        executionChecklist: [
          'Frame 0: Hand a customer a $60 cash bill for a $100 card, then slap down a digital deduction calculator.',
          'Second 5: Deduct 13.25% eBay fee, $4 tracked shipping, $3 clerk grading time, and $8 carrying depreciation.',
          'Second 18: Reveal the net in-pocket cash: $11.75 on a $60 risk capital layout.',
          'Ending: "Which is why blind 60% cash payouts are..."'
        ]
      },
      {
        angleId: 'ang-1-4',
        seriesTitle: 'The 2.5% Commission Autopsy',
        title: 'The $2.49 TCGplayer Direct Death Spiral',
        targetAudience: 'High-Volume TCGplayer Power Sellers',
        hook: 'If you sell raw cards under $2.49 on TCGplayer Direct, you are literally donating your clerk\'s hourly labor to Jeff Bezos.',
        coreMechanism:
          'Unpacking TCGplayer Direct micro-fees, replacement card fees, and handling deductions on sub-$3 uncommons.',
        executionChecklist: [
          'Frame 0: Hold up three 75-cent uncommon singles and toss a $1 bill into the trash.',
          'Second 4: Calculate the Direct intake fee + sorting time + commission netting negative 12 cents per card.',
          'Second 16: Show how shifting bulk uncommons to local webstore decklist pickup restores 85% gross margin.',
          'Ending: Seamless audio loop to opening statement.'
        ]
      },
      {
        angleId: 'ang-1-5',
        seriesTitle: 'Real Store Financial Forensics',
        title: 'GMROI: The Single Metric That Saves Local Card Shops',
        targetAudience: 'LGS Owners & Retail Managers',
        hook: 'Card shops don\'t go bankrupt from lack of sales. They go bankrupt from high revenue and zero GMROI.',
        coreMechanism:
          'Explaining Gross Margin Return on Investment: Why a card that sells in 3 days at 25% margin generates 4x more profit than a slab sitting for 10 months at 60% margin.',
        executionChecklist: [
          'Frame 0: Point to a dusty $1,000 vintage graded slab sitting in glass display case for 11 months.',
          'Second 5: Compare inventory turns: 12x turns on modern singles vs 1x turn on vintage trophy assets.',
          'Second 18: Demonstrate Aeethod GMROI automated inventory tagging flagging dead capital.',
          'Ending: Loop into start.'
        ]
      },
      {
        angleId: 'ang-1-6',
        seriesTitle: 'The Wholesale Distributor Ratio Desk',
        title: 'The Pre-Order Working Capital Hostage Crisis',
        targetAudience: 'Store Owners launching set pre-orders',
        hook: 'Collecting $40,000 in customer pre-orders can bankrupt your card shop before release day. Here is the math.',
        coreMechanism:
          'Showing what happens when distributor product allocations get slashed 50% after the store already collected customer funds and spent capital on distributor deposits.',
        executionChecklist: [
          'Frame 0: Flash 200 customer pre-order emails notification on screen next to a red "ALLOCATION CUT 55%" distributor notice.',
          'Second 5: Detail the refund chargeback fees and cash shortfall that strangles store liquidity.',
          'Second 17: Show Aeethod\'s Dynamic Pre-Order Safeguard linking allocation caps directly to verified distributor POs.',
          'Ending: Loop back to hook.'
        ]
      }
    ]
  },
  {
    id: 'cs-intake-velocity',
    spaceNumber: 2,
    title: 'Backroom Intake, Vision AI & Inventory Velocity Space',
    tagline: 'The Operations, Labor Economics & Optical Ingest Space',
    strategicDomain: 'Automated Optical Ingestion, Card Sorting Economics, Clerk Payroll Burn & Variant Identification',
    category: 'Retail & Automation',
    viralMultiplier: '5x DM Share',
    targetAudienceB2B: 'Inventory Managers, Head Clerks, Warehouse Breakers & High-Volume Sorting Staff',
    whyItIsAWhiteSpace: {
      competitorBlindSpot:
        'Competitors sell $15,000–$30,000 mechanical sorters that jam on warped foils, or post boring vlogs of amateurs opening envelopes for 2 hours with no speed benchmark.',
      audiencePainAndDemand:
        'Every LGS has 10,000 to 50,000 cards sitting in unsorted shoeboxes behind the counter. Entering them manually takes 40 clerk hours ($600+ payroll), while market prices crash 30% before the cards go live.',
      strategicMoat:
        'Demonstrating zero-hardware, 60fps browser neural vision on raw cards produces instant visual shock value and visceral relief for exhausted store clerks.'
    },
    aeethodSaaSAnchor: {
      featureName: 'Zero-Hardware 60fps Browser Neural Vision Scanner',
      productAdvantage:
        'Real-time optical card scanner running in any standard web browser or iPad webcam at 0.2s/card, instantly detecting set, card number, finish (foil/reverse), and language without typing.',
      commercialPayoff:
        'Cuts intake labor cost from $0.27/card (manual keyboard typing) to $0.02/card, processing 1,000 cards in 15 minutes.'
    },
    recurringSeries: [
      {
        seriesId: 'series-speed-trials',
        title: 'The Intake Speed Trials',
        format: '30s Split-Screen Stopwatch Battle',
        cadence: 'Weekly Evergreen',
        description:
          'Side-by-side timer face-offs: Manual keyboard data entry vs $20k mechanical sorter vs Aeethod browser camera neural vision.'
      },
      {
        seriesId: 'series-variant-traps',
        title: 'Variant & Foil Identification Traps',
        format: '35s Optical Accuracy Test',
        cadence: 'Bi-Weekly Tech Spotlight',
        description:
          'Putting browser AI to the test on the hardest visual distinctions: Masterball vs Pokéball, Unlimited vs Revised, 1st Edition stamps, and texture foils.'
      },
      {
        seriesId: 'series-shoebox-backlog',
        title: 'The Shoebox Backlog Teardown',
        format: '40s Operational Audit',
        cadence: 'Monthly Retail Reality',
        description:
          'Calculating the compounding cash loss of dead inventory sitting in backroom shoeboxes waiting for clerk sorting hours.'
      }
    ],
    videoAnglesLibrary: [
      {
        angleId: 'ang-2-1',
        seriesTitle: 'The Intake Speed Trials',
        title: 'The $0.27 vs $0.02 Intake Labor Battle',
        targetAudience: 'LGS Owners paying hourly clerk wages',
        hook: 'Every unsorted shoebox behind your register is burning $450 in clerk payroll while the card prices crash 40%.',
        coreMechanism:
          'Stopwatch challenge: Clerk manually typing set numbers into Shopify (30 hrs for 3k cards = $0.27/card) vs iPad webcam scanning 40 cards in 15 seconds directly into live inventory.',
        executionChecklist: [
          'Frame 0: Drop a dusty 3,200-count cardboard card box on counter with a physical digital stopwatch.',
          'Second 4: Calculate clerk payroll math: 30 hours of typing @ $18/hr = $540 before card #1 sells.',
          'Second 14: Show camera scanning 40 cards in 15 seconds with green bounding boxes live into POS.',
          'Ending: "Stop burning payroll on manual intake."'
        ]
      },
      {
        angleId: 'ang-2-2',
        seriesTitle: 'Variant & Foil Identification Traps',
        title: 'Masterball vs Pokéball Reverse Foil AI Test',
        targetAudience: 'Pokemon Retailers & Trade Clerks',
        hook: 'A clerk mistaking a Masterball holo for a regular reverse holo just lost your store an $85 margin swing in 2 seconds.',
        coreMechanism:
          'Testing human eye under store fluorescent lighting vs Aeethod neural vision detecting the micro-pattern stamp in 0.18s.',
        executionChecklist: [
          'Frame 0: Hold up two virtually identical Japanese 151 reverse holos under counter light.',
          'Second 4: Point out why tired clerks mislabel them after 6 hours on their feet.',
          'Second 15: Slide cards under iPad webcam: Aeethod flags Masterball stamp and auto-prices at $92.50.',
          'Ending: Loop seamlessly into opening statement.'
        ]
      },
      {
        angleId: 'ang-2-3',
        seriesTitle: 'The Intake Speed Trials',
        title: 'Why $15,000 Robotic Card Sorters Jam and Fail',
        targetAudience: 'Store Owners debating buying robotic sorters',
        hook: 'Before you spend $15,000 on a robotic card sorting machine, watch what happens when a card is slightly warped.',
        coreMechanism:
          'Demonstrating the mechanical jam crisis of physical feed rollers on curled foils vs non-contact optical browser scanning.',
        executionChecklist: [
          'Frame 0: Show close-up of a curled foil card jamming a mechanical belt feeder.',
          'Second 5: Breakdown the true ROI: $15k hardware + annual maintenance contracts + mechanical jams.',
          'Second 16: Show Aeethod\'s software-only optical scanner working on any phone or iPad camera with zero jams.',
          'Ending: Loop back to hook.'
        ]
      },
      {
        angleId: 'ang-2-4',
        seriesTitle: 'Variant & Foil Identification Traps',
        title: 'Revised vs Unlimited MTG Under 0.5 Seconds',
        targetAudience: 'Vintage MTG Sellers & Store Owners',
        hook: 'Unlimited vs Revised: One is a $600 dual land, the other is $300. Can neural vision spot the difference faster than your best clerk?',
        coreMechanism:
          'Testing optical boundary analysis: Bevel edge line and copyright dates recognized instantly without loupe manual squinting.',
        executionChecklist: [
          'Frame 0: Place two vintage Dual Lands side-by-side with identical artwork.',
          'Second 5: Explain the bevel edge and copyright spacing that causes human clerk misgrades.',
          'Second 16: Scan with Aeethod: Instant correct set identification and auto-populated buylist value.',
          'Ending: "Which is why manual vintage intake is..."'
        ]
      },
      {
        angleId: 'ang-2-5',
        seriesTitle: 'The Shoebox Backlog Teardown',
        title: 'The 14-Day Price Depreciation Trap',
        targetAudience: 'Store Managers with intake backlogs',
        hook: 'That 5,000-card collection you bought last Monday has already lost $1,200 in value because nobody had time to enter it.',
        coreMechanism:
          'Illustrating the secondary market decay curve: Release week singles losing 8% per day while sitting in backlog boxes.',
        executionChecklist: [
          'Frame 0: Slap a calendar with dates crossed out next to an unopened bulk collection box.',
          'Second 5: Show the price chart dropping from $45 to $22 over 10 days of intake delay.',
          'Second 17: Show Aeethod batch intake completing the entire box before the end of the shift.',
          'Ending: Loop to start.'
        ]
      },
      {
        angleId: 'ang-2-6',
        seriesTitle: 'The Intake Speed Trials',
        title: 'From Collection Drop-Off to Webstore in 4 Minutes',
        targetAudience: 'Fast-Turnaround Card Flippers & LGS Owners',
        hook: 'A customer dropped off 60 high-end singles at 2:00 PM. By 2:04 PM, all 60 are live on Shopify, eBay, and TCGplayer.',
        coreMechanism:
          'End-to-end continuous workflow: Camera scans cards -> AI grades condition -> Sync engine publishes across 3 channels in 240 seconds.',
        executionChecklist: [
          'Frame 0: Customer slides a deck box across counter; start countdown timer on screen: 04:00.',
          'Second 6: Rapid camera sweep scans 60 cards into pending intake queue.',
          'Second 18: One-tap bulk publish pushes live listings to webstore and eBay with sub-500ms sync.',
          'Ending: Seamless replay loop into opening hook.'
        ]
      }
    ]
  },
  {
    id: 'cs-concurrency-sync',
    spaceNumber: 3,
    title: 'Omnichannel Concurrency & Marketplace Defense Space',
    tagline: 'The Software Engineering, Concurrency & Market Defense Space',
    strategicDomain: 'Sub-500ms Multi-Marketplace Syncing, Double-Selling Prevention, eBay Defect Defense & Arbitrage Protection',
    category: 'Market Dynamics & Pricing Defense',
    viralMultiplier: '5x DM Share',
    targetAudienceB2B: 'E-commerce Directors, High-Volume Multi-Channel Sellers, eBay PowerSellers & LGS Owners',
    whyItIsAWhiteSpace: {
      competitorBlindSpot:
        'Legacy POS providers claim "multi-channel sync" while secretly running 15-to-45-minute cron batch polling. Creators never explain the technical architecture behind why stores get penalized.',
      audiencePainAndDemand:
        'Double-selling a 1-of-1 $400 card across eBay and the physical store is every merchant\'s nightmare. It triggers eBay Out-of-Stock Defects, 5% fee penalties across their ENTIRE catalog, and bans from TCGplayer Direct.',
      strategicMoat:
        'Live split-screen demonstrations proving sub-500ms distributed Redis locking delivers visual proof that establishes Aeethod as an elite engineering platform.'
    },
    aeethodSaaSAnchor: {
      featureName: 'Distributed Redis Locking & Sub-500ms Multi-Platform Delist Engine',
      productAdvantage:
        'When a barcode is scanned at the register, Aeethod locks the SKU and delists it across Shopify, eBay, and TCGplayer in under 350ms, before the receipt printer even triggers.',
      commercialPayoff:
        'Completely eliminates double-selling defects, protects Top Rated Seller status, and defends against 5% marketplace defect fee penalties.'
    },
    recurringSeries: [
      {
        seriesId: 'series-concurrency-test',
        title: 'The Concurrency Stress Test',
        format: '35s Live Split-Screen Stress Demo',
        cadence: 'Bi-Weekly Showcase',
        description:
          'In-store POS scan vs live screen capture of eBay/TCGplayer delisting simultaneously in real time with milliseconds counter.'
      },
      {
        seriesId: 'series-defect-autopsy',
        title: 'Marketplace Account Autopsies',
        format: '40s Forensic Policy Breakdown',
        cadence: 'Monthly Risk Management',
        description:
          'Breaking down real seller suspensions, eBay Out-of-Stock Defect cascades, and the compounding financial penalty of sync latency.'
      },
      {
        seriesId: 'series-bot-defense',
        title: '6:00 AM Bot Arbitrage Defense',
        format: '35s Market Spike Ticker Breakdown',
        cadence: 'Post-Tournament Window',
        description:
          'Showing real case studies of scraping bots draining underpriced webstore inventory during international tournament metagame shifts.'
      }
    ],
    videoAnglesLibrary: [
      {
        angleId: 'ang-3-1',
        seriesTitle: 'The Concurrency Stress Test',
        title: 'The $400 Out-of-Stock Death Spiral',
        targetAudience: 'Multi-channel sellers on eBay & Shopify',
        hook: 'Selling the same $400 slab in your shop and on eBay at the exact same minute is NOT bad luck. It\'s a 15-minute polling bug in your software.',
        coreMechanism:
          'Simulating an in-store barcode scan with live screen recording of eBay and TCGplayer delisting simultaneously in 320ms via Aeethod Redis locking.',
        executionChecklist: [
          'Frame 0: Hold up an eBay "Transaction Defect: Item Out of Stock" cancellation notice on mobile screen.',
          'Second 4: Explain the 15-minute cron job vulnerability that legacy software (BinderPOS/Crystal) relies on.',
          'Second 15: Run live split-screen test: Barcode scanned at register -> sub-350ms instant delist on eBay/Shopify.',
          'Ending: Seamless loop into opening hook.'
        ]
      },
      {
        angleId: 'ang-3-2',
        seriesTitle: 'Marketplace Account Autopsies',
        title: 'How a 1% eBay Defect Rate Costs You $8,000 in Fees',
        targetAudience: 'Top Rated eBay Card Sellers',
        hook: 'If you cancel just 3 out-of-stock orders on eBay this month, eBay will increase fees by 5% across your entire $150,000 store inventory.',
        coreMechanism:
          'Auditing eBay Below Standard fee penalization rules: How sync latency leads directly to thousands in automated platform penalties.',
        executionChecklist: [
          'Frame 0: Highlight eBay Seller Dashboard dropping from "Top Rated" to "Below Standard" in red text.',
          'Second 5: Calculate the 5% additional final value fee penalty applied to every single card transaction.',
          'Second 17: Show how sub-second inventory locking guarantees 0% out-of-stock cancellations.',
          'Ending: "Which is why relying on 15-minute polling is..."'
        ]
      },
      {
        angleId: 'ang-3-3',
        seriesTitle: '6:00 AM Bot Arbitrage Defense',
        title: 'The Sunday 6:00 AM Tokyo Tournament Bot Drain',
        targetAudience: 'LGS Webstore Owners & Resellers',
        hook: 'While your store was closed Sunday morning, arbitrage bots bought 40 copies of this bulk card for $10. They\'re already reselling them for $320.',
        coreMechanism:
          'Connecting Japanese Champions League tournament streams at 6 AM to instant scraper bot sweeps on unprotected Shopify stores.',
        executionChecklist: [
          'Frame 0: Slam a 25-cent uncommon trainer card on desk with an $8.50 TCGplayer price ticker overlay.',
          'Second 4: Show Japanese tournament stream win and the instant bot purchase timestamps at 6:12 AM.',
          'Second 16: Show Aeethod\'s Dynamic Repricer detecting velocity spikes and freezing sales before stores get drained.',
          'Ending: Loop into start without outro.'
        ]
      },
      {
        angleId: 'ang-3-4',
        seriesTitle: 'The Concurrency Stress Test',
        title: 'Redis Distributed Locks vs Database Polling',
        targetAudience: 'Tech-forward Store Operators & E-com Managers',
        hook: 'Here is the engineering reason your current POS software can\'t stop double-selling cards on Saturday afternoon.',
        coreMechanism:
          'Visualizing cron polling queues vs in-memory distributed locks in 30 seconds for non-technical store owners.',
        executionChecklist: [
          'Frame 0: Show two customers buying the same item at the exact same second on different screens.',
          'Second 6: Draw the 15-minute blind spot of batch sync vs 300ms Redis mutex lock.',
          'Second 18: Show Aeethod architecture completing the multi-channel broadcast in 0.3 seconds.',
          'Ending: Loop back to hook.'
        ]
      },
      {
        angleId: 'ang-3-5',
        seriesTitle: '6:00 AM Bot Arbitrage Defense',
        title: 'Dynamic Repricing Without Race Conditions',
        targetAudience: 'Stores running automated repricers',
        hook: 'A competitor set their bot to undercut by $0.01. Watch how an algorithmic price war crashed a $50 card to $4 in 12 minutes.',
        coreMechanism:
          'Exposing automated repricing death spirals and showing Aeethod\'s floor/ceiling margin safeguards.',
        executionChecklist: [
          'Frame 0: Graph showing two competing software bots undercutting each other into the floor.',
          'Second 5: Explain the lack of min-margin guardrails on legacy repricing software.',
          'Second 17: Demo Aeethod\'s margin floor rules preventing algorithmic liquidation.',
          'Ending: Loop into start.'
        ]
      },
      {
        angleId: 'ang-3-6',
        seriesTitle: 'Marketplace Account Autopsies',
        title: 'The 2-Store 1-Warehouse Inventory Nightmare',
        targetAudience: 'Multi-Location Card Shop Owners',
        hook: 'Opening a second card shop is the dream. Syncing inventory between 2 stores and 3 websites is where most owners go bankrupt.',
        coreMechanism:
          'Auditing multi-location inventory chaos and how unified cloud routing keeps stock synchronized across physical registers.',
        executionChecklist: [
          'Frame 0: Split screen showing Store A and Store B cash registers ringing up cards simultaneously.',
          'Second 6: Breakdown warehouse transfer confusion and phantom inventory stockouts.',
          'Second 18: Demo Aeethod Multi-Location Inventory Routing with automated inter-store transfers.',
          'Ending: Seamless loop into opening statement.'
        ]
      }
    ]
  },
  {
    id: 'cs-counter-kiosk',
    spaceNumber: 4,
    title: 'Front-Counter Trade Economics & Kiosk Psychology Space',
    tagline: 'The Retail Floor, Buylist Ops & Counter Psychology Space',
    strategicDomain: 'Buylist Turnaround Times, Customer Trade-In Friction, Self-Service Kiosks & Secondhand Legal Compliance',
    category: 'Retail & Automation',
    viralMultiplier: 'High Debate Comments',
    targetAudienceB2B: 'Store Managers, Counter Staff, Retail Clerks & Front-Desk Cashiers',
    whyItIsAWhiteSpace: {
      competitorBlindSpot:
        'YouTube trade videos show theatrical staged pawn-shop style screaming matches or generic collector grading. Nobody addresses the commercial reality of a customer with a 120-card binder locking up the only register during Friday night rush.',
      audiencePainAndDemand:
        'Clerks dread trade submissions during peak hours. Customers feel lowballed when offered 60% cash. Paying retail customers walk out when lines back up, losing thousands in peak-hour booster sales.',
      strategicMoat:
        'Self-service iPad kiosk workflows and transparent math de-escalate customer tension while freeing up cash registers for paying retail sales.'
    },
    aeethodSaaSAnchor: {
      featureName: 'Customer-Facing Self-Service Buylist Kiosk & Compliance Engine',
      productAdvantage:
        'Dedicated customer iPad station where sellers scan & submit their trade-ins, automatically calculating condition deductions, cash vs credit tiers, and logging legal ID verification.',
      commercialPayoff:
        'Eliminates the 45-minute register freeze, captures trade-ins without clerk burnout, and stops the $1,200 peak-hour retail walk-out.'
    },
    recurringSeries: [
      {
        seriesId: 'series-counter-crisis',
        title: 'The Friday Night Counter Crisis',
        format: '40s In-Store Counter Drama & Workflow',
        cadence: 'Bi-Weekly Realities',
        description:
          'Exposing how peak-hour trade binder submissions freeze retail registers and drive away paying tournament customers.'
      },
      {
        seriesId: 'series-buylist-psychology',
        title: 'Counter Psychology & The Buylist Formula',
        format: '35s Negotiation Roleplay & De-escalation',
        cadence: 'Weekly Tactical',
        description:
          'Teaching clerks how to explain 70% cash / 85% credit policies mathematically so customers never feel insulted or lowballed.'
      },
      {
        seriesId: 'series-kiosk-showdown',
        title: 'Kiosk vs Counter Showdowns',
        format: '30s Side-by-Side Throughput Benchmark',
        cadence: 'Monthly Workflow Test',
        description:
          'Comparing trade turnaround times: Customer self-scanning on iPad kiosk vs clerk manually typing cards into register.'
      }
    ],
    videoAnglesLibrary: [
      {
        angleId: 'ang-4-1',
        seriesTitle: 'The Friday Night Counter Crisis',
        title: 'The Friday 7:30 PM $1,200 Walk-Out',
        targetAudience: 'LGS Owners with crowded Friday Night tournaments',
        hook: 'How one customer trading in a binder at 7:30 PM just cost your game store $1,200 in lost Friday night sales.',
        coreMechanism:
          'Exposing the bottleneck: A trade submission locks the only cashier for 40 minutes while 6 paying retail customers put down booster boxes and walk out.',
        executionChecklist: [
          'Frame 0: Camera pans over long line of agitated customers waiting behind one person flipping through a binder.',
          'Second 5: Calculate the cost: $400 in abandoned box sales + 45 minutes of wasted clerk attention.',
          'Second 18: Demo Aeethod customer-facing iPad kiosk where players submit trades independently in 2 minutes.',
          'Ending: "Free up your registers on Friday night."'
        ]
      },
      {
        angleId: 'ang-4-2',
        seriesTitle: 'Counter Psychology & The Buylist Formula',
        title: 'Why Customers Scream "Lowball" (And How to Fix It)',
        targetAudience: 'Front-Desk Retail Staff & Store Owners',
        hook: 'When a customer screams that you\'re lowballing them on a $200 card, do NOT argue. Hand them this 1-page transparent breakdown.',
        coreMechanism:
          'Teaching clerks to show automated on-screen buylist deductions (marketplace fees, cash float, grading risks) rather than personal opinions.',
        executionChecklist: [
          'Frame 0: Customer throws hands up at counter: "TCGplayer says it\'s worth $200!"',
          'Second 4: Clerk swivels Aeethod transparent customer display showing exact market breakdown.',
          'Second 17: Customer sees 70% cash ($140) or 85% store credit ($170) and happily takes the credit.',
          'Ending: "Turn angry sellers into repeat store-credit buyers."'
        ]
      },
      {
        angleId: 'ang-4-3',
        seriesTitle: 'Kiosk vs Counter Showdowns',
        title: 'Customer Self-Scanning: 45 Cards in 90 Seconds',
        targetAudience: 'Store Managers looking to scale trade volume',
        hook: 'Stop paying your clerks to flip through customer binders. Let the customer do the work for you.',
        coreMechanism:
          'Showing customer using iPad camera kiosk to scan their own 45-card submission while clerk focuses on ringing up sales.',
        executionChecklist: [
          'Frame 0: Customer placing cards under Aeethod iPad kiosk; instant beep audio confirmations.',
          'Second 5: Kiosk generates itemized ticket with condition estimates and customer digital signature.',
          'Second 16: Clerk receives completed ticket in POS dashboard with 1-click inspection verification.',
          'Ending: Loop to opening statement.'
        ]
      },
      {
        angleId: 'ang-4-4',
        seriesTitle: 'Counter Psychology & The Buylist Formula',
        title: 'The 85% Store Credit Margin Multiplier',
        targetAudience: 'Store Owners managing cash flow',
        hook: 'Why offering 85% store credit instead of 65% cash actually increases your net retail profit margin by 18%.',
        coreMechanism:
          'Unpacking retail margin cycles: Store credit keeps capital inside the store ecosystem and recaptures wholesale product margins.',
        executionChecklist: [
          'Frame 0: Whiteboard with $100 card: $65 Cash payout vs $85 Store Credit payout.',
          'Second 5: Trace the $85 credit being spent on sealed product with 40% retail markup.',
          'Second 17: Calculate actual cost of goods sold: Store only spent $51 cash equivalent for a $100 card.',
          'Ending: Loop back to hook.'
        ]
      },
      {
        angleId: 'ang-4-5',
        seriesTitle: 'The Friday Night Counter Crisis',
        title: 'Secondhand Dealer Laws & The Police Confiscation Trap',
        targetAudience: 'LGS Owners buying collections over the counter',
        hook: 'Buying cards over the counter without these 2 legal steps could result in local police confiscating $10,000 of your inventory.',
        coreMechanism:
          'Detailing municipal pawn/secondhand dealer requirements: Government ID verification, thumbprints, and statutory 14-day hold periods.',
        executionChecklist: [
          'Frame 0: Red municipal police violation notice overlay on card shop counter.',
          'Second 5: Explain stolen collection tracing and secondhand dealer reporting mandates.',
          'Second 16: Show Aeethod\'s built-in ID scanner and legal hold vault tracking compliance automatically.',
          'Ending: "Protect your shop from stolen collection liability."'
        ]
      },
      {
        angleId: 'ang-4-6',
        seriesTitle: 'Counter Psychology & The Buylist Formula',
        title: 'Condition Dispute De-escalation: LP vs MP',
        targetAudience: 'Counter Clerks & Card Graders',
        hook: 'A customer swears their card is Near Mint. Here is how our automated counter camera proves Moderate Play in 10 seconds without an argument.',
        coreMechanism:
          'Using high-magnification overhead camera zoom to show edge whitening and surface scuffs on a customer-facing display.',
        executionChecklist: [
          'Frame 0: Card looks NM under normal room lighting; loupe zoom reveals invisible foil scratching.',
          'Second 5: Side-by-side condition criteria chart displayed to customer.',
          'Second 17: Customer agrees with condition downgrade without feeling cheated.',
          'Ending: Seamless replay loop into opening hook.'
        ]
      }
    ]
  },
  {
    id: 'cs-decklist-ecommerce',
    spaceNumber: 5,
    title: 'Modern Player E-Commerce & Deckbuilding Conversion Space',
    tagline: 'The Webstore, Search Latency & Tournament Conversion Space',
    strategicDomain: 'Local Game Store Webstores, 60-Card Decklist Ingestion, Faceted Search Speeds & Cart Abandonment',
    category: 'Retail & Automation',
    viralMultiplier: '5x DM Share',
    targetAudienceB2B: 'LGS Webstore Managers, Tournament Organizers, E-Commerce Directors & Modern Retailers',
    whyItIsAWhiteSpace: {
      competitorBlindSpot:
        'Store owners plead on social media for locals to "support local game stores instead of TCGplayer", while completely ignoring that their Shopify webstore takes 25 minutes of painful searching to assemble one tournament deck.',
      audiencePainAndDemand:
        'Competitive tournament players have zero loyalty to broken webstores. When faced with searching 60 individual singles across 60 separate pages, 82% abandon the cart and buy on TCGplayer Cart Optimizer.',
      strategicMoat:
        'Solving the 60-card tournament decklist friction captures the high-margin competitive singles market for local stores before players leave for national aggregators.'
    },
    aeethodSaaSAnchor: {
      featureName: '1-Click Tournament Decklist Ingest & Sub-100ms Faceted Search Engine',
      productAdvantage:
        'Players paste raw text exports from Limitless, Moxfield, or MTGGoldfish; Aeethod maps all 60 cards against local in-stock inventory in 2.8 seconds with 1 tap to checkout for in-store pickup.',
      commercialPayoff:
        'Recovers the 82% cart abandonment rate and turns Friday Night Magic attendees into recurring Monday morning webstore buyers.'
    },
    recurringSeries: [
      {
        seriesId: 'series-checkout-friction',
        title: 'The 60-Card Checkout Friction Test',
        format: '30s Side-by-Side E-Commerce Race',
        cadence: 'Bi-Weekly Showcase',
        description:
          'Screen recording players assembling a 60-card tournament list: Standard Shopify (25 mins) vs TCGplayer (4 mins) vs Aeethod Decklist Ingest (3 seconds).'
      },
      {
        seriesId: 'series-cart-abandonment',
        title: 'Why Players Abandon Local Store Carts',
        format: '35s Web Analytics Teardown',
        cadence: 'Monthly Conversion Teardown',
        description:
          'Analyzing why local stores convert <1% of webstore visitors into buyers on tournament singles.'
      },
      {
        seriesId: 'series-tournament-pickup',
        title: 'The Tournament Night Pickup Engine',
        format: '35s Operational Workflow',
        cadence: 'Pre-Tournament Friday',
        description:
          'Demonstrating frictionless in-store pickup workflows where players order decks online Friday afternoon and pick them up sorted 15 minutes before Round 1.'
      }
    ],
    videoAnglesLibrary: [
      {
        angleId: 'ang-5-1',
        seriesTitle: 'The 60-Card Checkout Friction Test',
        title: 'Why Players Abandon Local Store Websites',
        targetAudience: 'LGS Owners running basic Shopify themes',
        hook: 'Your local players aren\'t buying singles on TCGplayer because they\'re cheap. They\'re doing it because your Shopify site takes 25 minutes to build a deck.',
        coreMechanism:
          'Side-by-side timer test: Searching 60 cards manually on standard Shopify vs pasting raw tournament text into Aeethod (ready to checkout in 2.8 seconds).',
        executionChecklist: [
          'Frame 0: Show someone typing card names into a sluggish Shopify search bar with a clock ticking.',
          'Second 5: Highlight the 82% cart abandonment rate on multi-card tournament singles orders.',
          'Second 15: Demo Aeethod Decklist Ingest: Paste raw text -> 60 cards added to cart in 3 seconds.',
          'Ending: "Turn your local players into direct webstore buyers."'
        ]
      },
      {
        angleId: 'ang-5-2',
        seriesTitle: 'The 60-Card Checkout Friction Test',
        title: 'The Sub-100ms Search Difference',
        targetAudience: 'Webstore Developers & LGS Owners',
        hook: 'If your webstore search takes more than 1 second per card, 40% of your online shoppers leave before looking at card #2.',
        coreMechanism:
          'Demonstrating search latency benchmarks: Standard Shopify SQL database lagging on 80,000 card variants vs Aeethod sub-100ms indexed search.',
        executionChecklist: [
          'Frame 0: Typing "Charizard" into a spinning wheel loader on mobile screen.',
          'Second 5: Benchmark bounce rates against page load latency metrics.',
          'Second 16: Show instant keystroke response and faceted condition filtering in Aeethod webstore.',
          'Ending: Loop back to hook.'
        ]
      },
      {
        angleId: 'ang-5-3',
        seriesTitle: 'Why Players Abandon Local Store Carts',
        title: 'The "Missing 3 Cards" Dilemma',
        targetAudience: 'E-commerce Managers & Shop Operators',
        hook: 'When a player has 57 cards in their cart and you\'re missing 3, they don\'t buy 57. They empty the entire cart and buy all 60 on TCGplayer.',
        coreMechanism:
          'Exposing the all-or-nothing tournament psychology and how Aeethod\'s Smart Deck Alternative Suggester keeps the order.',
        executionChecklist: [
          'Frame 0: Show cart total dropping from $240 to $0 as user clicks "Empty Cart".',
          'Second 5: Explain player panic: Needing the full 60-card list ready for Friday night tournament.',
          'Second 17: Show Aeethod\'s AI Suggester offering alternative art/condition copies to complete the list locally.',
          'Ending: "Stop losing full deck orders over 3 missing cards."'
        ]
      },
      {
        angleId: 'ang-5-4',
        seriesTitle: 'The Tournament Night Pickup Engine',
        title: 'Friday 6:00 PM Express Pickup Fulfillment',
        targetAudience: 'Tournament Organizers & Shop Clerks',
        hook: 'How to fulfill 35 tournament deck orders between 5:00 PM and 6:30 PM without delaying Round 1.',
        coreMechanism:
          'Showcasing bin-sorted pick slips and express barcode scan pickup bags ready at the counter.',
        executionChecklist: [
          'Frame 0: Clock showing 6:15 PM with 30 players rushing into the store before Round 1.',
          'Second 5: Show chaos of manual search through binders vs numbered pick-station cubbies.',
          'Second 17: Player scans pickup QR code on phone; bag handed over in 6 seconds flat.',
          'Ending: Loop to start.'
        ]
      },
      {
        angleId: 'ang-5-5',
        seriesTitle: 'Why Players Abandon Local Store Carts',
        title: 'Local Webstore vs TCGplayer Direct Pricing',
        targetAudience: 'LGS Owners pricing webstore inventory',
        hook: 'Why matching TCGplayer Market Price on your webstore is actually underpricing your local competitive advantage.',
        coreMechanism:
          'Explaining the "Immediate In-Hand" premium: Players willingly pay 8–12% more for singles they can pick up tonight vs waiting 6 days for mail.',
        executionChecklist: [
          'Frame 0: Compare $20 card arriving next Tuesday vs $22 card in hand for tonight\'s locals.',
          'Second 5: Unpack player willingness-to-pay economics for tournament deadlines.',
          'Second 16: Show how Aeethod auto-tunes local webstore margins above race-to-the-bottom online floors.',
          'Ending: Seamless loop to start.'
        ]
      },
      {
        angleId: 'ang-5-6',
        seriesTitle: 'The Tournament Night Pickup Engine',
        title: 'The Prerelease Singles Webstore Playbook',
        targetAudience: 'Stores hosting official prerelease weekends',
        hook: 'Prerelease weekend is when singles prices are at their all-time peak. Here is how to sell them on your webstore before Monday morning.',
        coreMechanism:
          'Fast-tracking prerelease pack openings directly into local webstore inventory for immediate tournament trade action.',
        executionChecklist: [
          'Frame 0: Stacks of newly opened prerelease singles on Sunday afternoon.',
          'Second 5: The 48-hour price cliff: Why waiting until Wednesday to list cards loses 50% margin.',
          'Second 17: Show rapid ingest and automated local webstore launch via Aeethod.',
          'Ending: Loop back to hook.'
        ]
      }
    ]
  },
  {
    id: 'cs-convention-resilience',
    spaceNumber: 6,
    title: 'High-Stakes Live Operations & Convention Resiliency Space',
    tagline: 'The Card Show, Event Logistics & Offline Hardware Space',
    strategicDomain: 'Card Conventions, Pop-Up Vendor Logistics, Wi-Fi Failures, Offline POS Hardware & Multi-Item Trade Math',
    category: 'Live Operations & Conventions',
    viralMultiplier: '4x Save / Bookmark',
    targetAudienceB2B: 'Traveling Card Show Dealers, Regional Vendors, Convention Booth Operators & Pop-Up Sellers',
    whyItIsAWhiteSpace: {
      competitorBlindSpot:
        'Social media is flooded with aesthetic card show showcase vlogs with trap beats, but nobody covers the high-stress logistical nightmare when convention center Wi-Fi drops to 0 kbps and cloud registers crash.',
      audiencePainAndDemand:
        'Traveling dealers pay $1,500–$5,000 for convention booths. When cell towers jam and cloud POS systems fail, dealers lose thousands in sales, scramble with paper receipts, and ruin inventory tracking.',
      strategicMoat:
        'Demonstrating real offline-first PWA resilience under airplane mode proves Aeethod was engineered by battle-tested convention veterans.'
    },
    aeethodSaaSAnchor: {
      featureName: 'Offline-First PWA Mode & Local IndexedDB/SQLite Sync Engine',
      productAdvantage:
        'Full point-of-sale functionality with zero internet: Scans barcodes, calculates taxes, issues receipts, and caches transactions locally, syncing with the master catalog the millisecond connection returns.',
      commercialPayoff:
        'Guarantees zero dropped sales during high-density convention network blackouts and automates show inventory reconciliation.'
    },
    recurringSeries: [
      {
        seriesId: 'series-wifi-autopsy',
        title: 'Convention Wi-Fi Autopsy Desk',
        format: '35s High-Stakes Convention Stress Test',
        cadence: 'Post-Major Convention (Monthly)',
        description:
          'Simulating the peak 11:00 AM convention network blackout and demonstrating how offline POS software keeps revenue flowing.'
      },
      {
        seriesId: 'series-traveling-dealer',
        title: 'The Traveling Dealer Tech Stack',
        format: '40s Hardware & Workflow Teardown',
        cadence: 'Bi-Weekly Showcase',
        description:
          'Teardowns of compact pelican case mobile POS setups, thermal receipt printers, and battery-backed hardware for traveling dealers.'
      },
      {
        seriesId: 'series-show-reconciliation',
        title: 'Show Inventory Reconciliation',
        format: '30s Financial Balance Teardown',
        cadence: 'Post-Show Monday',
        description:
          'Auditing what happened over a 3-day card show: Cash collected, trades absorbed, booth fee break-even, and restock logistics.'
      }
    ],
    videoAnglesLibrary: [
      {
        angleId: 'ang-6-1',
        seriesTitle: 'Convention Wi-Fi Autopsy Desk',
        title: 'Convention Wi-Fi Collapse Survival',
        targetAudience: 'Traveling Card Show Vendors & Dealers',
        hook: 'What happens when 5,000 collectors jam the convention Wi-Fi and your cloud POS completely dies at 11:00 AM?',
        coreMechanism:
          'Breaking down the Collect-A-Con / Regional Championship disaster: Wi-Fi crashes, cellular drops, cloud POS fails. Demonstrating Aeethod Offline-First PWA running in Airplane Mode with local SQLite caching.',
        executionChecklist: [
          'Frame 0: Camera moving through packed convention hall with red "NO INTERNET CONNECTION" overlay on iPad.',
          'Second 5: Show vendors scrambling with pen and paper, losing card tracking and making calculation mistakes.',
          'Second 18: Demo Aeethod offline mode scanning barcodes and completing transactions with zero Wi-Fi.',
          'Ending: "Never lose a trade show sale to dropped Wi-Fi."'
        ]
      },
      {
        angleId: 'ang-6-2',
        seriesTitle: 'Convention Wi-Fi Autopsy Desk',
        title: 'The Airplane Mode POS Challenge',
        targetAudience: 'Convention Booth Managers',
        hook: 'Can your store POS complete a 5-card transaction, apply sales tax, and print a receipt with Airplane Mode turned ON?',
        coreMechanism:
          'Live test: Flipping iPad to Airplane Mode, ringing up $1,400 in slabs, scanning barcode, and printing thermal receipt.',
        executionChecklist: [
          'Frame 0: Swipe down on iPad, toggle Airplane Mode ON, show zero bars and zero Wi-Fi icon.',
          'Second 5: Scan 3 slabs with Bluetooth barcode scanner into Aeethod POS with instant beep response.',
          'Second 16: Complete payment and show local transaction queue ready for background cloud sync.',
          'Ending: Loop back to hook.'
        ]
      },
      {
        angleId: 'ang-6-3',
        seriesTitle: 'The Traveling Dealer Tech Stack',
        title: 'The 1-Pelican-Case Convention Booth Setup',
        targetAudience: 'Traveling Dealers & Road Warriors',
        hook: 'Everything inside this single Pelican case runs an entire $50,000 convention booth for 3 days without plugging into a wall.',
        coreMechanism:
          'Unboxing the ultimate mobile vendor stack: iPad, Anker power bank, mobile Bluetooth scanner, thermal printer, and Aeethod offline PWA.',
        executionChecklist: [
          'Frame 0: Unlatch heavy-duty Pelican case on a convention banquet table.',
          'Second 5: Lay out the streamlined hardware components and total battery run time (14 hours).',
          'Second 18: Show system operational and scanning in under 90 seconds from unboxing.',
          'Ending: "Stop packing 4 duffle bags of tangled cables."'
        ]
      },
      {
        angleId: 'ang-6-4',
        seriesTitle: 'Show Inventory Reconciliation',
        title: 'The Monday Post-Convention Ledger Shock',
        targetAudience: 'Card Show Dealers counting cash on Monday',
        hook: 'You brought home $15,000 in cash from the card show. Here is why you might have actually lost $800 over the weekend.',
        coreMechanism:
          'Accounting for the full cost equation: Booth table fees ($1,200), hotel ($600), gas ($150), food ($200), replacement inventory costs, and cash discounts.',
        executionChecklist: [
          'Frame 0: Stacks of cash envelopes on desk with celebratory green emoji, followed by red deduction pen.',
          'Second 5: Tally up overhead costs and the cost to replace the inventory sold under market value.',
          'Second 17: Show Aeethod\'s Event Profitability Calculator revealing true net ROI.',
          'Ending: "Never confuse gross cash with net booth profit."'
        ]
      },
      {
        angleId: 'ang-6-5',
        seriesTitle: 'The Traveling Dealer Tech Stack',
        title: 'The 30-Second Multi-Card Trade Calculator',
        targetAudience: 'Dealers doing high-volume convention trades',
        hook: 'A customer offers 7 raw singles and $120 cash for your PSA 10 slab. How do you calculate your net margin in under 30 seconds?',
        coreMechanism:
          'High-pressure convention trade calculations: Using Aeethod Quick Trade matrix to calculate composite offer value before the customer walks away.',
        executionChecklist: [
          'Frame 0: Customer slides a messy stack of 7 raw cards onto display case next to a PSA 10 slab.',
          'Second 5: Show mental math panic vs rapid tap barcode intake.',
          'Second 16: Screen displays composite offer margin: +$42 net profit; deal accepted instantly.',
          'Ending: Loop to start.'
        ]
      },
      {
        angleId: 'ang-6-6',
        seriesTitle: 'Show Inventory Reconciliation',
        title: 'Monday Morning 200-Item Inventory Re-Sync',
        targetAudience: 'Store Owners returning from weekend shows',
        hook: 'It\'s Monday 9:00 AM. Your physical shop is opening, but you have 200 sold cards to reconcile from this weekend\'s show.',
        coreMechanism:
          'Eliminating manual spreadsheet reconciliation: When convention iPad connects to store Wi-Fi, 200 sold items are automatically deducted from webstore and shop POS.',
        executionChecklist: [
          'Frame 0: Weary dealer unlocking store door with boxes of leftover show inventory.',
          'Second 5: Show the dread of spending all Monday morning manually adjusting inventory.',
          'Second 16: iPad connects to store Wi-Fi -> 1-click reconcile updates all channels in 4 seconds.',
          'Ending: Seamless replay loop into opening hook.'
        ]
      }
    ]
  }
];

export const WHITE_SPACE_GAPS: WhiteSpaceGap[] = CONTENT_SPACES.map((space) => {
  const primaryAngle = space.videoAnglesLibrary[0];
  return {
    id: space.id,
    niche: `${space.title} (${space.tagline})`,
    category: space.category,
    viralMultiplier: space.viralMultiplier,
    primaryFormat: space.recurringSeries[0]?.format || '35s Short-Form Video',
    redOceanTrap: {
      title: 'The Saturated Flaw',
      flaw: space.whyItIsAWhiteSpace.competitorBlindSpot,
      consequence: 'Zero commercial resonance and severe operational friction for card retailers.'
    },
    blueOceanWedge: {
      title: space.aeethodSaaSAnchor.featureName,
      advantage: space.whyItIsAWhiteSpace.audiencePainAndDemand,
      algorithmicMoat: space.whyItIsAWhiteSpace.strategicMoat,
      exampleHook: primaryAngle.hook,
      creator: 'Both'
    },
    tacticalChecklist: primaryAngle.executionChecklist
  };
});

export const COMPETITOR_ANALYSIS: CompetitorAnalysis[] = [
  {
    id: 'comp-1',
    category: 'The Hype Pack Openers',
    representativePlayers: 'PokeRev, Leonhart, DeepPocketMonster',
    coreStrength: 'Massive mainstream consumer audience, high energy, dramatic clickbait thumbnails.',
    fatalBlindspot:
      'Zero B2B operational understanding. Cannot explain unit economics, GMROI, inventory turns, or store survival.',
    aeethodWedge:
      'Position as the "Adults in the Room": Cold financial reality, mathematical precision, and real store operations.'
  },
  {
    id: 'comp-2',
    category: 'The High-End Vintage Houses',
    representativePlayers: 'PWCC / Fanatics, Heritage Auctions, smpratte',
    coreStrength: 'High credibility on six-figure museum-tier vintage collectibles.',
    fatalBlindspot:
      'Slow, dry, corporate presentation disconnected from modern short-form 20-second dopamine pacing.',
    aeethodWedge:
      'Deliver deep forensic expertise with rapid-fire modern pacing, on-screen receipt overlays, and seamless loop hooks.'
  },
  {
    id: 'comp-3',
    category: 'The Average Local Card Shop',
    representativePlayers: 'Small town LGS channels, amateur vloggers',
    coreStrength: 'Authentic physical store backdrop and organic community.',
    fatalBlindspot:
      'Crippled by weak hooks ("Hey guys, welcome back..."), poor audio, zero retention editing, and no viral loops.',
    aeethodWedge:
      'Master the 4 Algorithmic Gates: Frame 0 pattern interrupts, loop sentences, and high-stakes financial tension.'
  }
];

export const DEMAND_SUPPLY_MATRIX: DemandSupplyMatrixItem[] = [
  {
    id: 'ds-goldmine',
    quadrant: 'goldmine',
    quadrantName: 'The Viral Arbitrage Goldmine',
    badge: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    allocationPct: '80% of All Content',
    demandLevel: 'High',
    supplyLevel: 'Low',
    strategicDirective: 'High search volume and viral curiosity, but almost zero creators are producing it with rigor.',
    examples: [
      {
        topic: 'Forensic Counterfeit Triage',
        mechanism: 'Spot-the-fake in 5 seconds under loupe zoom.',
        hookPreview: 'One of these is worth $800. The other came from an overseas counterfeit factory.'
      },
      {
        topic: 'Unit Economic Autopsies',
        mechanism: 'Dismantling gross sales into brutal net cash deductions.',
        hookPreview: 'Selling a $100 card on a marketplace does NOT give you $100 in the bank.'
      },
      {
        topic: 'Trade Counter Dilemmas',
        mechanism: 'Micro-damage reveal on high-value vintage card.',
        hookPreview: 'A customer brought in this vintage Charizard asking for cash, but one micro-flaw changed the offer.'
      },
      {
        topic: 'Optical Scanner vs Manual Typing',
        mechanism: '35-second automated intake vs 3 hours of clerk burnout.',
        hookPreview: 'Why does every card shop in America still tolerate a 45-second inventory sync delay?'
      },
      {
        topic: 'Mystery Box EV Autopsies',
        mechanism: 'Monte Carlo pull simulations cataloging repack loss.',
        hookPreview: 'I spent $300 on viral TikTok "Mystery Slabs" so you don\'t have to. Here is the exact mathematical loss.'
      },
      {
        topic: 'Card Doctor Forensic Traps',
        mechanism: 'Exposing chemical oils, edge trimming, and UV residue.',
        hookPreview: 'Someone used chemical oil and an iron on this vintage card to trick PSA. Here is how our UV light caught it instantly.'
      },
      {
        topic: '48-Hour Tournament Meta Arbitrage',
        mechanism: 'Connecting Sunday stream wins to Tuesday bulk buyouts.',
        hookPreview: 'A rogue deck won in Japan yesterday at 6:00 AM. By 9:00 AM, these 3 twenty-cent bulk cards were selling out at $7 across America.'
      },
      {
        topic: 'E-Commerce Logistics & PWE Economics',
        mechanism: 'Physics of mailers vs bubble packaging margin suicide.',
        hookPreview: 'If you ship raw cards under $15 inside bubble mailers with $4 tracking, you are literally paying the post office to work.'
      }
    ]
  },
  {
    id: 'ds-trend',
    quadrant: 'trend',
    quadrantName: 'High-Velocity Set & Meta Windows',
    badge: 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30',
    allocationPct: '20% of All Content',
    demandLevel: 'High',
    supplyLevel: 'High',
    strategicDirective: 'Timed around prereleases and tournament price spikes to ride short-term algorithmic search waves.',
    examples: [
      {
        topic: 'Prerelease Allocation Survival',
        mechanism: 'Top 3 cards to buy/sell on release weekend.',
        hookPreview: 'Delta Reign prerelease night: 3 cards every shop needs in stock before Friday.'
      },
      {
        topic: 'Meta-to-Pricing Rapid Spikes',
        mechanism: 'Connecting tournament deck wins to 48-hour card spikes.',
        hookPreview: 'If you sold your Dragapult ex singles on Friday, you left $40 on the table.'
      }
    ]
  },
  {
    id: 'ds-flop',
    quadrant: 'flop',
    quadrantName: 'The Algorithmic Flop Trap',
    badge: 'bg-rose-500/15 text-rose-400 border border-rose-500/30',
    allocationPct: '0% (BANNED FROM PRODUCTION)',
    demandLevel: 'Low',
    supplyLevel: 'High',
    strategicDirective: 'Guaranteed to stall under 2,000 views due to >65% scroll-past in first 3 seconds. Never record.',
    examples: [
      {
        topic: 'Generic Philosophy Rants',
        mechanism: 'Vague talking head with no receipts, numbers, or tension.',
        hookPreview: 'Today I want to talk about why community matters more than money in our card shop.'
      },
      {
        topic: 'Casual Unboxing & Sorting Vlogs',
        mechanism: 'Shaky camera organizing commons without conflict or loupe zoom.',
        hookPreview: 'Hey guys, just doing some basic organizing behind the register today.'
      }
    ]
  }
];

export const PRE_FLIGHT_CHECKLIST_RULES: PreFlightChecklistRule[] = [
  {
    id: 'gate-1',
    stepNumber: 1,
    gateName: 'Specific Cohort Target',
    coreQuestion: 'Can you name the exact person in the room watching this?',
    passIndicator: 'Identifies one specific profile (LGS Owner, Flipper, Slab Investor, or Dreamer).',
    killTrigger: 'Answering "anyone who likes cards" — content targeting everyone reaches no one.',
    algorithmicReward: 'Establishes clear user affinity clustering in Meta Graph.'
  },
  {
    id: 'gate-2',
    stepNumber: 2,
    gateName: 'Frame 0 Pattern Interrupt',
    coreQuestion: 'What physical action happens in the first 0.5 seconds?',
    passIndicator: 'Card slapped on desk, receipt deduction displayed, loupe zoomed into surface ding, loud sound.',
    killTrigger: 'Talking head saying: "Hey guys, today I want to talk about..."',
    algorithmicReward: 'Stops >60% of test cohort from scrolling in seconds 0–3.'
  },
  {
    id: 'gate-3',
    stepNumber: 3,
    gateName: 'Financial or Authenticity Stakes',
    coreQuestion: 'What is the immediate monetary or grading conflict?',
    passIndicator: '$120 offer cut, 10.75% platform fee deduction, counterfeit vs $800 authentic card.',
    killTrigger: 'Passive storytelling with no tension or price discrepancy.',
    algorithmicReward: 'Drives viewers through second 10 of the video.'
  },
  {
    id: 'gate-4',
    stepNumber: 4,
    gateName: 'DM Share Catalyst (5x Multiplier)',
    coreQuestion: 'Why would someone send this to a friend or partner via DM?',
    passIndicator: 'Shocking platform fees, a debate on card offers ("Would you take $160?"), or trade-in warnings.',
    killTrigger: 'Selfish consumption — viewer enjoys it quietly but has zero reason to message a colleague.',
    algorithmicReward: 'Triggers Meta peer-to-peer distribution to non-follower Explore feeds.'
  },
  {
    id: 'gate-5',
    stepNumber: 5,
    gateName: 'Save Utility (4x Multiplier)',
    coreQuestion: 'Why would a viewer bookmark this video for later?',
    passIndicator: 'The 70% buylist formula, fee breakdown table, or counterfeit inspection checklist.',
    killTrigger: 'One-off entertainment with no reference or actionable educational takeaway.',
    algorithmicReward: 'Evergreen distribution pushes the reel for 7 to 14 days.'
  },
  {
    id: 'gate-6',
    stepNumber: 6,
    gateName: 'Seamless Replay Loop',
    coreQuestion: 'Does the final sentence grammatically complete the opening hook?',
    passIndicator: 'The final word flows seamlessly into word 1 of the hook, prompting an unintended second watch.',
    killTrigger: 'Awkward pauses, outro screens, or saying "Thanks for watching, like and subscribe".',
    algorithmicReward: 'Pushes Average Percentage Watched (APW) >110%.'
  }
];

export const FUNNEL_STAGES: FunnelStage[] = [
  {
    id: 'tofu',
    stageName: 'Top of Funnel (TOFU)',
    funnelLabel: 'Viral Curiosity & Operational Discovery Engine',
    badgeColor: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
    targetAudience: 'Broad TCG Ecosystem: Collectors, Casual Players, Hobby Dreamers, Flippers & Lurking Store Owners',
    strategicObjective:
      'Beat algorithmic gatekeepers (3-Second Hook Retention >65%, APW >100%) to capture massive cold organic reach across Instagram Reels & YouTube Shorts without paying for ads.',
    psychologicalTriggers: [
      'Visceral Curiosity (What went wrong with this transaction?)',
      'Frame 0 Pattern Interrupt (Slamming graded slabs or props on desk)',
      'Counterfeit & Micro-Flaw Mysteries under Loupe Zoom',
      'Behind-the-Counter Card Shop Reality on Saturday Night'
    ],
    contentFormats: [
      {
        formatTitle: 'Forensic Loupe Zoom & Fake Triage',
        runtime: '25–35s Rapid Loop',
        primaryCreator: 'Anika',
        description: 'Spot the counterfeit card under 10x magnification in 5s. Drives loop re-watches and intense comment debate.',
        testedHookExample: 'One of these is worth $800. The other came from an overseas counterfeit factory.'
      },
      {
        formatTitle: 'Real Counter Dilemmas ("Would You Take This Deal?")',
        runtime: '35–45s Conflict Arc',
        primaryCreator: 'Both',
        description: 'Customer brings vintage card asking cash; inspecting surface dings to reveal why the offer was lowered.',
        testedHookExample: 'A customer brought in this vintage Charizard asking for $400 cash, but one micro-flaw changed our offer.'
      },
      {
        formatTitle: '30-Second Hardware/Speed Showdowns',
        runtime: '30s Split-Screen Race',
        primaryCreator: 'Both',
        description: 'Optical camera neural scanner scanning 40 cards in 15 seconds vs clerk typing manually with stopwatch.',
        testedHookExample: 'Every unsorted shoebox behind your register is burning $450 in clerk payroll while the card prices crash 40%.'
      }
    ],
    algorithmicGates: [
      {
        gate: '3-Second Hold Rate',
        metricTarget: '>65% Retention',
        mechanism: 'Stops scroll with physical prop or high cash stakes in first 0.5s.'
      },
      {
        gate: 'Average Percentage Watched (APW)',
        metricTarget: '>105% Loop Rate',
        mechanism: 'Driven by seamless replay sentence loops where final sentence completes the hook.'
      },
      {
        gate: 'Comments & Dwell Time',
        metricTarget: 'High Comment Volume',
        mechanism: 'Drives fierce authentication debate ("Look at the bottom rosette pattern!").'
      }
    ],
    callToAction: {
      ctaType: 'Micro-Engagement / Loop Replay',
      sampleCopy: '"Would you have taken $240 cash or $310 store credit? Drop your answer below." (or seamless audio loop without outro)',
      conversionAsset: 'Profile Visit & Discovery Algorithmic Tagging'
    }
  },
  {
    id: 'mofu',
    stageName: 'Middle of Funnel (MOFU)',
    funnelLabel: 'Operational Authority & Financial Agitation Engine',
    badgeColor: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
    targetAudience: 'Overworked LGS Owners, Retail Managers, Full-Time Power Flippers, Convention Dealers',
    strategicObjective:
      'Shift viewers from entertained spectators into agitated merchants realizing their current software, distributor tie-ins, and manual intake are draining tens of thousands of dollars in profit.',
    psychologicalTriggers: [
      'Financial Outrage (The 2.5% Commission Tax)',
      'Defensive Terror (Double-selling $400 slabs, eBay defects)',
      'Save/Bookmark Practical Utility (Formulas and fee tables)',
      'Insiders-vs-Outsiders Commercial Truth'
    ],
    contentFormats: [
      {
        formatTitle: 'The 2.5% Platform Tax Autopsy',
        runtime: '45s Ledger Teardown',
        primaryCreator: 'Sadid',
        description: 'Auditing real store P&L statements showing BinderPOS taking $1,500/mo ($18,000/yr) on $60k GMV.',
        testedHookExample: 'If your card shop sells $60,000 a month in singles, your software vendor is quietly stealing $1,500 of your net profit every 30 days.'
      },
      {
        formatTitle: 'The $400 Double-Selling Concurrency Nightmare',
        runtime: '35s Concurrency Demo',
        primaryCreator: 'Both',
        description: 'Simulating register scan delisting in 320ms vs 15-minute cron bug that causes eBay Out-of-Stock Defects.',
        testedHookExample: 'Selling the same $400 slab in your shop and on eBay at the exact same minute is NOT bad luck. It\'s a 15-minute polling bug.'
      },
      {
        formatTitle: 'The 70% Buylist Margin Illusion',
        runtime: '40s Whiteboard Math',
        primaryCreator: 'Sadid',
        description: 'Mathematical deduction of marketplace fees, packaging, clerk labor, and 60-day price decay.',
        testedHookExample: 'Paying 60% cash for a collection feels like an easy 40% profit. Here is why it\'s actually margin suicide.'
      },
      {
        formatTitle: 'Distributor Allocation Ratio Desk',
        runtime: '40s Invoice Audit',
        primaryCreator: 'Sadid',
        description: 'Wholesale invoices exposing dead stock tie-ins (buying $4k dead board games to get 6 cases of 151).',
        testedHookExample: 'Ordering $30,000 in sealed product does NOT mean you\'re getting 30 cases. Here is the distributor ratio they won\'t tell you.'
      }
    ],
    algorithmicGates: [
      {
        gate: 'DM Share Velocity',
        metricTarget: '5x Multiplier',
        mechanism: 'Store partners forwarding to co-owners: "Look how much cash we\'re bleeding every month."'
      },
      {
        gate: 'Save / Bookmark Rate',
        metricTarget: '4x Multiplier',
        mechanism: 'Viewers save fee formulas and buylist deduction tables to consult during trade nights.'
      },
      {
        gate: 'Profile Visit Rate',
        metricTarget: '>8% Profile Visits',
        mechanism: 'Viewers tap profile bio to verify operational credentials and tooling.'
      }
    ],
    callToAction: {
      ctaType: 'Partner Alignment & Lead Magnet DM',
      sampleCopy: '"Send this to your store partner before you sign next year\'s POS contract. Comment \'AUDIT\' for our free 0% GMV fee auditor."',
      conversionAsset: 'Interactive Fee Audit Tool & Warm DM Pipeline'
    }
  },
  {
    id: 'bofu',
    stageName: 'Bottom of Funnel (BOFU)',
    funnelLabel: 'Aeethod OS Product Moat & Commercial Acquisition Engine',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    targetAudience: 'High-Intent LGS Owners, Store Partners, Warehouse Breakers & Power Sellers Ready to Switch',
    strategicObjective:
      'Direct commercial conversion into paying Aeethod OS subscriptions ($149/mo flat SaaS), software migration bookings, and self-service buylist kiosk deployments.',
    psychologicalTriggers: [
      'Immediate Mathematical ROI ($15,000+ net cash back in pocket)',
      'Operational Relief (Eliminating Friday night counter freezes)',
      'Zero-Downtime Migration Confidence (10-minute catalog import)',
      'Fear of Falling Behind Tech Competitors'
    ],
    contentFormats: [
      {
        formatTitle: 'Zero-Latency POS & Concurrency Stress Test',
        runtime: '35s Live Software Demo',
        primaryCreator: 'Sadid',
        description: 'Screen capture of in-store barcode beep delisting on eBay in 320ms via distributed Redis lock + 0% GMV flat pricing.',
        testedHookExample: 'Watch eBay and TCGplayer delist this $400 card in 320 milliseconds before the receipt finishes printing.'
      },
      {
        formatTitle: '1-Click Tournament Decklist Webstore Ingest',
        runtime: '30s Webstore Friction Race',
        primaryCreator: 'Both',
        description: 'Pasting raw Moxfield/Limitless decklist into local webstore in 2.8s, eliminating the 82% cart abandonment.',
        testedHookExample: 'Your local players aren\'t buying singles on TCGplayer because they\'re cheap. They\'re doing it because your Shopify site takes 25 minutes to build a deck.'
      },
      {
        formatTitle: 'The Self-Service Buylist Kiosk In Action',
        runtime: '40s In-Store Deployment',
        primaryCreator: 'Anika',
        description: 'Friday Night Magic customer scans 45 cards in 90 seconds while cashier rings up sales, eliminating walk-outs.',
        testedHookExample: 'How one customer trading in a binder at 7:30 PM just cost your game store $1,200 in lost Friday night sales.'
      },
      {
        formatTitle: 'Offline Airplane Mode Convention Stress Test',
        runtime: '35s Hardware Stress Test',
        primaryCreator: 'Both',
        description: 'Ringing up $1,400 in slabs at Collect-A-Con with zero Wi-Fi, caching sales locally in SQLite.',
        testedHookExample: 'Can your store POS complete a 5-card transaction and print a receipt with Airplane Mode turned ON?'
      }
    ],
    algorithmicGates: [
      {
        gate: 'Bio Link Click-Through Rate (CTR)',
        metricTarget: '>4% Bio Link Clicks',
        mechanism: 'High conversion from video watch to landing page demo scheduling.'
      },
      {
        gate: 'Inbound High-Intent DMs',
        metricTarget: 'Direct Inbound Inquiries',
        mechanism: 'Store owners messaging: "How fast can I migrate my inventory from BinderPOS?"'
      },
      {
        gate: 'Trial Activation Rate',
        metricTarget: 'Rapid SaaS Onboarding',
        mechanism: 'Instant catalog sync and POS terminal login.'
      }
    ],
    callToAction: {
      ctaType: 'Direct SaaS Trial / Migration Booking',
      sampleCopy: '"Stop paying 2.5% of your gross sales. Tap the link in bio to book your 15-minute live migration demo and start your 14-day free trial."',
      conversionAsset: 'Aeethod OS Flat $149/mo Subscription ($0 GMV Commission)'
    }
  }
];

export const TCG_INDUSTRY_ANALYSIS: TcgIndustryAnalysis = {
  macroMarketOverview: {
    totalEstimatedGmv: '$12.5 Billion+ Annual Global Collectibles GMV (Pokémon, MTG, One Piece, Lorcana, Sports)',
    activeStoresGlobal: '8,500–12,000 Brick-and-Mortar Local Game Stores (LGS) worldwide',
    powerSellersCount: '45,000+ High-Volume Multi-Channel Power Sellers (eBay Top Rated, TCGplayer Direct)',
    contentLandscapeSummary:
      'Over 90% of views in the TCG creator economy are saturated by consumer unboxing hype and speculative bag-pumping, leaving the multi-billion-dollar retail operations infrastructure completely unserved.'
  },
  supplyDemandParadox: {
    consumerHypeShare: '85% (Over-saturated red ocean: pack openings, screaming thumbnails, mystery box gambling)',
    gameplayShare: '10% (Competitive deck tech, tournament streams, tier lists)',
    collectorShare: '4% (High-end vintage auction showcases, PSA grading reveals)',
    b2bRetailShare: '<1% (Virtually zero creators cover store P&Ls, intake economics, inventory velocity, or POS software)',
    unmetNeedDescription:
      'Store owners and power sellers are running $1M+ retail operations on 2012 legacy software that charges 2.5% GMV or takes 15 minutes to sync. They do not read LinkedIn whitepapers; they watch Instagram Reels and YouTube Shorts after closing the store at 11 PM.'
  },
  theThreeTraps: [
    {
      trapName: 'The Consumer Clown Trap',
      trapFlaw:
        'Chasing 14-year-old pack openers with screaming thumbnails. Generates vanity views with zero software buyer intent.',
      aeethodCounterMove:
        'Anchor all content in cold retail math, physical trade counter reality, and operational tension.'
    },
    {
      trapName: 'The Corporate SaaS Bore Trap',
      trapFlaw:
        'Posting sterile software feature matrices and dry screencasts. Fails the 3-second algorithmic hook test and gets 80 views.',
      aeethodCounterMove:
        'Frame 0 pattern interrupts, physical cash props, split-screen stopwatch races, and dramatic trade disputes.'
    },
    {
      trapName: 'The Philosophical Hobbyist Trap',
      trapFlaw:
        'Whining about distributor politics or begging community members to "support local stores" without fixing broken webstore UX.',
      aeethodCounterMove:
        'Cold mathematical analysis showing why buyers leave and how Aeethod automation recovers lost revenue.'
    }
  ]
};
