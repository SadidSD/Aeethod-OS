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

  // Funnel & Cohort Alignment
  funnelStage: 'TOFU (Viral Curiosity)' | 'TOFU-MOFU (Validation Bridge)' | 'MOFU (Margin & Operations)' | 'BOFU (Speed & SaaS Conversion)';
  funnelStagePill: 'TOFU' | 'MOFU' | 'BOFU' | 'TOFU-MOFU' | 'MOFU-BOFU';
  primaryCohortId: 'lgs_owner' | 'reseller' | 'collector' | 'dreamer';
  cohortsServed: {
    cohortName: string;
    cohortRole: string;
    icon: string;
  }[];
  funnelProgressionMechanism: string;
  spokenCtaOutro: {
    ctaType: string;
    script: string;
  };

  // Talking Head & Personal Brand Alignment
  talkingHeadFormat?: {
    cameraSetup: string;
    propsInHand: string;
    founderRole: string;
    funnelAllocation: string;
  };

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
    id: 'cs-tcg-whistleblower',
    spaceNumber: 1,
    title: 'The TCG Whistleblower & Market Reality Space',
    tagline: 'The Industry Black Box, Distributor Traps & Market Math Space',
    strategicDomain: 'Distributor Allocation Mafias, Distributor Tie-In Ratios, Modern Sealed Liquidity Traps, Pop-Report Manipulation & Marketplace Hidden Fees',
    category: 'Economics & Operations',
    viralMultiplier: '5x DM Share',
    funnelStage: 'TOFU (Viral Curiosity)',
    funnelStagePill: 'TOFU',
    primaryCohortId: 'lgs_owner',
    cohortsServed: [
      {
        cohortName: 'The Overworked LGS Owner & Store Manager',
        cohortRole: 'Wholesale Truth — Discovers how distributor tie-in ratios and dead board games quietly strangle store liquidity.',
        icon: '🏢'
      },
      {
        cohortName: 'The Full-Time Reseller & Power Flipper',
        cohortRole: 'Margin Defense — Audits marketplace commission cascades, shipping loss, and sealed product liquidity traps.',
        icon: '📦'
      },
      {
        cohortName: 'The Serious Collector & Investor',
        cohortRole: 'Reality Check — Deconstructs grading pop-report drops and the financial illusion of modern sealed compounding.',
        icon: '💎'
      }
    ],
    funnelProgressionMechanism:
      'Shocking distributor invoice autopsy or marketplace fee teardown hooks broad TCG audience -> Shared to business partner / co-owner (5x DM multiplier) -> Viewers identify founder as the only unbought industry whistleblower -> Transitions into Aeethod SaaS operational solutions.',
    spokenCtaOutro: {
      ctaType: 'Wholesale Allocation & Fee Calculator',
      script:
        'If you want to see our free wholesale allocation calculator that proves which distributor products are draining your store\'s cash flow, DM me "TRUTH" or check the link in bio.'
    },
    talkingHeadFormat: {
      cameraSetup: 'Direct-to-camera eye contact, desktop Shure SM7B mic in frame, crisp studio lighting, fast rhetorical cadence',
      propsInHand: 'Real printed wholesale distributor invoices, red marker, physical sealed booster boxes, and desktop calculator',
      founderRole: 'The Unbought Industry Whistleblower — Exposing the hidden predatory math that sponsored influencers and distributors hide',
      funnelAllocation: '35% of Total Content Output (Top Funnel / TOFU)'
    },
    targetAudienceB2B: 'LGS Owners, Store Partners, Power Resellers & TCG Capital Allocators',
    whyItIsAWhiteSpace: {
      competitorBlindSpot:
        'Competitor creators only post consumer pack openings or vague "investing in cards" hype, while SaaS vendors post sterile feature tables with zero human voice.',
      audiencePainAndDemand:
        'Card store owners and resellers are exhausted by distributor blackmail, pre-order allocation cuts, and marketplace fees eating 30% of their gross cash. They crave an unbought insider who validates their reality.',
      strategicMoat:
        'Zero creators speak with real ledger-level mathematical precision. Dropping real numbers and distributor invoices creates immediate authority and viral DM velocity.'
    },
    aeethodSaaSAnchor: {
      featureName: 'Pre-Order Allocation Modeler & Wholesale PO Safeguard',
      productAdvantage:
        'Links customer pre-orders directly to verified distributor POs and margin floors, preventing stores from taking capital hostage on dead allocation lines.',
      commercialPayoff: 'Protects $20,000–$50,000 in working capital from getting locked in slow-moving distributor tie-in stock.'
    },
    recurringSeries: [
      {
        seriesId: 'series-distributor-desk',
        title: 'The Wholesale Distributor Ratio Desk',
        format: '45s Invoice Breakdown with physical paperwork',
        cadence: 'Bi-Weekly Evergreen',
        description:
          'Exposing distributor tie-in ratios, pre-order allocation traps, and working capital deadlocks across major set releases.'
      },
      {
        seriesId: 'series-liquidity-trap',
        title: 'The Modern Sealed Liquidity Trap',
        format: '40s Whiteboard Cash Flow Reality',
        cadence: 'Weekly Tactical',
        description:
          'Deconstructing why holding 40 cases of modern booster boxes is an illiquid dead-capital trap compared to inventory turns.'
      },
      {
        seriesId: 'series-fee-autopsies',
        title: 'Marketplace Fee Autopsies',
        format: '35s Desktop Deduction Calculator Breakdown',
        cadence: 'Bi-Weekly Deep Dive',
        description:
          'Auditing real transaction statements across eBay, TCGplayer Direct, and payment processors showing true net profit margins.'
      }
    ],
    videoAnglesLibrary: [
      {
        angleId: 'ang-1-1',
        seriesTitle: 'The Wholesale Distributor Ratio Desk',
        title: 'The $30,000 Distributor Allocation Lie',
        targetAudience: 'Card Shop Owners & Sealed Investors',
        hook: 'Ordering $30,000 in sealed product does NOT mean you\'re getting 30 cases. Here is the distributor ratio they won\'t tell you.',
        coreMechanism:
          'Auditing a wholesale allocation invoice on camera: Showing how distributors force stores to purchase 40% slow-moving board games to get tier allocations of Pokémon 151.',
        executionChecklist: [
          'Frame 0: Hold up actual distributor wholesale invoice with -$30,000 highlighted.',
          'Second 4: Break down ratio: $30,000 spent = $6,200 actual chase product + $23,800 slow stock.',
          'Second 18: Explain how Aeethod\'s Allocation Modeler calculates true blended break-even.',
          'Ending: Seamless audio replay loop into opening hook.'
        ]
      },
      {
        angleId: 'ang-1-2',
        seriesTitle: 'Marketplace Fee Autopsies',
        title: 'The $2.49 TCGplayer Direct Labor Drain',
        targetAudience: 'High-Volume TCGplayer Power Sellers',
        hook: 'If you sell raw cards under $2.49 on TCGplayer Direct, you are literally donating your clerk\'s hourly labor to Jeff Bezos.',
        coreMechanism:
          'Tossing three 75-cent uncommon singles into trash on desk, calculating Direct intake fees, sorting labor, and packaging netting negative 12 cents per card.',
        executionChecklist: [
          'Frame 0: Hold three 75-cent uncommon singles to camera; slam $1 bill into trash can.',
          'Second 5: Calculate fee cascade: 13% commission + $0.30 fixed fee + $0.50 envelope + 3 mins clerk time.',
          'Second 17: Show how shifting bulk uncommons to local decklist pickup recovers 85% gross margin.',
          'Ending: "Which is why selling sub-$3 singles on national marketplaces is..."'
        ]
      },
      {
        angleId: 'ang-1-3',
        seriesTitle: 'The Modern Sealed Liquidity Trap',
        title: 'Why 40 Cases in Your Closet Won\'t Make You Rich',
        targetAudience: 'Sealed Product Investors & Resellers',
        hook: 'Before you put another $5,000 into modern sealed booster boxes, let me show you the liquidity trap nobody on YouTube warns you about.',
        coreMechanism:
          'Whiteboard breakdown: Comparing the 3-year carrying cost, shipping weight fee ($18/case), marketplace fee (13%), and zero cash flow vs 12x singles turns.',
        executionChecklist: [
          'Frame 0: Sit in front of stacked sealed booster cases; tap calculator with $5,000 layout.',
          'Second 6: Walk through selling 20 cases on eBay: 13.25% fee + $40 insured shipping + buyer scam risk.',
          'Second 18: Contrast with turning $5,000 through local singles buylists every 30 days.',
          'Ending: Loop back to opening question.'
        ]
      },
      {
        angleId: 'ang-1-4',
        seriesTitle: 'Marketplace Fee Autopsies',
        title: 'The Real Reason 90% of Card Shops Are Quietly Broke',
        targetAudience: 'LGS Owners & Prospective Shop Founders',
        hook: 'A local game store doing $1,000,000 in gross sales can easily lose $20,000 net profit by December. Here is the exact ledger math.',
        coreMechanism:
          'Dismantling a $1M card shop P&L on whiteboard: $680k wholesale COGS, $140k rent & utilities, $150k payroll, and $45k platform/merchant fees.',
        executionChecklist: [
          'Frame 0: Write $1,000,000 on whiteboard in green; strike through with red line to -$20,000.',
          'Second 5: Step through the four major cash leaks that kill retail game shops.',
          'Second 17: Reveal why software GMV commissions are the single easiest leak to eliminate.',
          'Ending: Seamless loop into opening statement.'
        ]
      },
      {
        angleId: 'ang-1-5',
        seriesTitle: 'The Wholesale Distributor Ratio Desk',
        title: 'The Pre-Order Working Capital Hostage Crisis',
        targetAudience: 'Store Owners launching new set pre-orders',
        hook: 'Collecting $40,000 in customer pre-orders can bankrupt your card shop before release day. Here is the math.',
        coreMechanism:
          'Explaining distributor allocation cuts: Store collects 200 pre-orders, distributor slashes allocation by 55%, forcing refund fees and emergency market buys.',
        executionChecklist: [
          'Frame 0: Hold up customer pre-order spreadsheet next to red "ALLOCATION SLASHED 55%" notice.',
          'Second 5: Detail merchant processing chargeback fees on refunds and damaged customer trust.',
          'Second 17: Show how Aeethod links allocation caps directly to confirmed distributor POs.',
          'Ending: Loop back to hook.'
        ]
      },
      {
        angleId: 'ang-1-6',
        seriesTitle: 'The Modern Sealed Liquidity Trap',
        title: 'The PSA 10 Population Drop Illusion',
        targetAudience: 'High-End Graded Slab Collectors & Flippers',
        hook: 'You think PSA 10 gem rates are dropping because cards are worse quality? Here is the financial incentive behind pop-report tightening.',
        coreMechanism:
          'Connecting grading company fee structures to secondary market slab liquidity: Why artificial population scarcity drives repeat submissions.',
        executionChecklist: [
          'Frame 0: Hold two identical graded slabs to camera; point to population report on phone.',
          'Second 5: Explain the submission volume flywheel and upcharge tiers on high-grade cards.',
          'Second 17: How to audit true liquidity before buying low-pop modern cards.',
          'Ending: "Which is why blind pop-report investing is..."'
        ]
      }
    ]
  },
  {
    id: 'cs-counter-buylist',
    spaceNumber: 2,
    title: 'Behind-The-Counter Forensics & Buylist Psychology Space',
    tagline: 'The Retail Counter, Buylist Psychology & Collection Valuation Space',
    strategicDomain: 'Buylist Formulas (60% Cash vs 85% Credit), Customer Lowball Psychology, Friday Night Line Freezes, LP vs NM Grading Disputes & Collection Appraisals',
    category: 'Retail & Automation',
    viralMultiplier: 'High Debate Comments',
    funnelStage: 'TOFU (Viral Curiosity)',
    funnelStagePill: 'TOFU',
    primaryCohortId: 'collector',
    cohortsServed: [
      {
        cohortName: 'The Serious Collector & High-End Buyer',
        cohortRole: 'Grading Truth — Engages with microscopic foil scratch debates, objective condition standards, and fair trade math.',
        icon: '💎'
      },
      {
        cohortName: 'The Overworked LGS Owner & Store Manager',
        cohortRole: 'Counter Sanity — Learns how to mathematically de-escalate "you lowballed me" shouting matches and save peak-hour sales.',
        icon: '🏢'
      },
      {
        cohortName: 'The Hobby Dreamer & Casual Fan',
        cohortRole: 'Curiosity & Drama — Captivated by what really happens when someone drops a $10,000 collection on a card shop counter.',
        icon: '🎮'
      }
    ],
    funnelProgressionMechanism:
      'Talking head card debate or counter dispute hooks massive comment arguments (High Debate) -> Viewers respect founder\'s master-level retail competence -> Store owners recognize the Friday night line freeze crisis -> Primes interest for Aeethod\'s self-service buylist kiosk.',
    spokenCtaOutro: {
      ctaType: 'Buylist Formula & Trade-In Breakdown Guide',
      script:
        'Want our exact 1-page buylist formula that explains 70% cash and 85% credit mathematically so customers never feel insulted? DM me "BUYLIST" or grab it from the link in bio.'
    },
    talkingHeadFormat: {
      cameraSetup: 'Intimate eye-level desk shot with overhead inspection light, rapid zoom-ins on physical cards',
      propsInHand: 'Two identical raw cards, 10x jeweler\'s loupe, high-res magnification lens, customer buylist intake ticket',
      founderRole: 'The Master Retail Operator — Demystifies retail friction, defending store clerks while educating collectors with mathematical fairness',
      funnelAllocation: '35% of Total Content Output (Top Funnel / TOFU)'
    },
    targetAudienceB2B: 'Store Managers, Counter Staff, Retail Clerks, Card Graders & Serious Collectors',
    whyItIsAWhiteSpace: {
      competitorBlindSpot:
        'YouTube trade content consists of sensationalized staged pawn-shop shouting matches or amateur card grading. Nobody explains the economic formula behind counter trade-ins.',
      audiencePainAndDemand:
        'Clerks dread binder drop-offs during tournament rush. Customers feel insulted by 60% cash offers. Retail owners lose thousands in walked-out booster box sales.',
      strategicMoat:
        'Explaining the retail math transparently transforms angry customer sentiment into trust, establishing the founder as the undisputed operational voice in TCG retail.'
    },
    aeethodSaaSAnchor: {
      featureName: 'Customer-Facing Self-Service Buylist Kiosk & Compliance Engine',
      productAdvantage:
        'Customer iPad station that lets sellers self-scan submissions, calculates tier payouts, and handles ID compliance in 2 minutes without locking the cashier register.',
      commercialPayoff: 'Eliminates peak-hour register freezes and stops $1,200/night in retail customer walk-outs.'
    },
    recurringSeries: [
      {
        seriesId: 'series-shop-said-no',
        title: 'Why Your Local Shop Said "No"',
        format: '40s Collection Rejection & Appraisal Teardown',
        cadence: 'Weekly Tactical',
        description:
          'Teardowns of why cards get rejected or lowballed: Liquidity drag, condition damage, reprint risk, and capital velocity.'
      },
      {
        seriesId: 'series-buylist-formula',
        title: 'The 70% Cash vs 85% Credit Formula',
        format: '35s Whiteboard Margin Multiplier',
        cadence: 'Bi-Weekly Evergreen',
        description:
          'The mathematical proof showing why store credit generates 18% higher net margins while making customers happier.'
      },
      {
        seriesId: 'series-condition-wars',
        title: 'Condition Wars: NM vs LP Under 10x Light',
        format: '30s Close-Up Optical Loupe Challenge',
        cadence: 'Weekly Viral Debate',
        description:
          'Showing invisible micro-scratches and edge wear under desk lighting that turn a $200 Near Mint card into a $90 Lightly Played card.'
      }
    ],
    videoAnglesLibrary: [
      {
        angleId: 'ang-2-1',
        seriesTitle: 'The 70% Cash vs 85% Credit Formula',
        title: 'The Friday 7:30 PM $1,200 Trade Walk-Out',
        targetAudience: 'LGS Owners with crowded weekend tournaments',
        hook: 'How one customer trading in a binder at 7:30 PM just cost your game store $1,200 in lost Friday night sales.',
        coreMechanism:
          'Talking head breakdown: A 100-card trade locks your only cashier for 40 minutes while 6 paying retail customers put down booster boxes and walk out.',
        executionChecklist: [
          'Frame 0: Address camera with urgency: "Friday night 7:30 PM. Your store is packed."',
          'Second 4: Breakdown math: $400 in abandoned booster boxes + 45 mins of clerk wages spent on 1 customer.',
          'Second 17: Introduce the self-service iPad station concept where customers submit trades independently.',
          'Ending: "Stop letting trade binders lock your front registers."'
        ]
      },
      {
        angleId: 'ang-2-2',
        seriesTitle: 'The 70% Cash vs 85% Credit Formula',
        title: 'Why 65% Cash for Your Collection Isn\'t a Robbery',
        targetAudience: 'Collectors complaining about buylist payouts',
        hook: 'When a card shop offers you 65% cash for your collection, they aren\'t robbing you. Here is where the other 35% actually goes.',
        coreMechanism:
          'Deduction math on desk: 13.25% eBay fee + $4 tracked shipping + $3 clerk inspection + 60 days price depreciation risk.',
        executionChecklist: [
          'Frame 0: Hand $65 cash across table for a $100 raw card; look directly into camera.',
          'Second 5: Subtract the real commercial deductions on a desktop calculator: net store profit is only $11.75.',
          'Second 18: Explain why store credit at 85% is the true win-win for both parties.',
          'Ending: Loop seamlessly back into opening hook.'
        ]
      },
      {
        angleId: 'ang-2-3',
        seriesTitle: 'The 70% Cash vs 85% Credit Formula',
        title: 'The 85% Store Credit Margin Multiplier',
        targetAudience: 'Store Owners managing cash flow',
        hook: 'Why offering 85% store credit instead of 65% cash actually increases your net retail profit margin by 18%.',
        coreMechanism:
          'Tracing the cash cycle: Store credit stays in the ecosystem and gets spent on sealed product with 40% retail markup.',
        executionChecklist: [
          'Frame 0: Hold $65 cash bill in left hand, $85 store credit voucher in right hand.',
          'Second 5: Map where the $85 credit goes: spent on booster boxes with wholesale COGS of $51.',
          'Second 17: Show how the store acquired a $100 single for only $51 cash equivalent.',
          'Ending: Loop back to hook.'
        ]
      },
      {
        angleId: 'ang-2-4',
        seriesTitle: 'Condition Wars: NM vs LP Under 10x Light',
        title: 'Micro-Scratch Wars: The $150 Condition Disagreement',
        targetAudience: 'Counter Clerks & Card Collectors',
        hook: 'A customer swore this Charizard was Near Mint. Look at what happens when I put it under a 10x inspection light.',
        coreMechanism:
          'Close-up camera zoom: Showing invisible foil clouding and back-edge silvering that drops card value from NM to MP.',
        executionChecklist: [
          'Frame 0: Hold up pristine-looking holographic card to lens; looks NM under room light.',
          'Second 4: Angle under 10x inspection light: reveal micro-scratches across holographic window.',
          'Second 16: Show how transparent customer displays de-escalate arguments without feelings hurt.',
          'Ending: "Which is why judging condition with the naked eye is..."'
        ]
      },
      {
        angleId: 'ang-2-5',
        seriesTitle: 'Why Your Local Shop Said "No"',
        title: 'What Happens When Someone Drops a $25,000 Estate Collection',
        targetAudience: 'Card Resellers & Shop Owners',
        hook: 'A walk-in just dropped a $25,000 vintage collection on your counter. Here are the 4 legal steps before you touch a dollar.',
        coreMechanism:
          'Walking through high-stakes collection appraisals: Cash flow reserve requirements, secondhand dealer laws, and consignment options.',
        executionChecklist: [
          'Frame 0: Point to a heavy vintage binder on counter: "25 thousand dollars in raw vintage."',
          'Second 5: Explain working capital rules: Never commit more than 20% of monthly cash reserves to 1 buy.',
          'Second 17: Detail statutory police hold requirements on high-value collection cash payouts.',
          'Ending: Loop back to hook.'
        ]
      },
      {
        angleId: 'ang-2-6',
        seriesTitle: 'Why Your Local Shop Said "No"',
        title: 'Secondhand Dealer Laws & The Police Confiscation Trap',
        targetAudience: 'LGS Owners buying collections over the counter',
        hook: 'Buying cards over the counter without these 2 legal steps could result in local police confiscating $10,000 of your inventory.',
        coreMechanism:
          'Detailing municipal pawn/secondhand dealer requirements: Government ID verification, thumbprints, and statutory 14-day hold periods.',
        executionChecklist: [
          'Frame 0: Hold up red municipal police violation notice overlay on card counter.',
          'Second 5: Explain stolen collection tracing and secondhand dealer reporting mandates.',
          'Second 16: Show Aeethod\'s built-in ID scanner and legal hold vault tracking compliance automatically.',
          'Ending: "Protect your shop from stolen collection liability."'
        ]
      }
    ]
  },
  {
    id: 'cs-anti-commission-saas',
    spaceNumber: 3,
    title: 'The Anti-Commission SaaS Manifesto Space',
    tagline: 'The 0% GMV Revolution, Incumbent Fee Audits & SaaS ROI Space',
    strategicDomain: '2.5% GMV Incumbent Software Taxes, BinderPOS/Crystal Commerce Commission Bleed, Flat $149/mo SaaS Architecture & Card Shop Net Margin Recovery',
    category: 'Economics & Operations',
    viralMultiplier: '5x DM Share',
    funnelStage: 'BOFU (Speed & SaaS Conversion)',
    funnelStagePill: 'BOFU',
    primaryCohortId: 'lgs_owner',
    cohortsServed: [
      {
        cohortName: 'The Overworked LGS Owner & Store Manager',
        cohortRole: 'Primary SaaS Buyer — Audits the $1,500/mo BinderPOS 2.5% tax bleed and books an Aeethod migration demo.',
        icon: '🏢'
      },
      {
        cohortName: 'The Full-Time Reseller & Power Flipper',
        cohortRole: 'High-Volume Merchant — Calculates net profit recovery from eliminating gross revenue take-rates.',
        icon: '📦'
      }
    ],
    funnelProgressionMechanism:
      'Talking head slams real merchant statement with -$1,500 platform fee circled in red -> Explains why Aeethod charges flat $149/mo with 0% GMV tax -> Store owner realizes they save $15k-$45k/yr -> DMs "AUDIT" or books 15-minute migration demo.',
    spokenCtaOutro: {
      ctaType: 'Platform Fee Audit & Migration Demo',
      script:
        'If your current card store software takes 2.5% of your gross sales, DM me "AUDIT" or go to aeethod.com to see how our flat $149/mo system saves you $1,250 every single month.'
    },
    talkingHeadFormat: {
      cameraSetup: 'Clean high-authority founder framing, screen overlay showing real merchant statements and fee comparators',
      propsInHand: 'Physical monthly software invoices with -$1,500 circled in bright red marker, printed comparison sheet',
      founderRole: 'The Founder Champion of Retailers — The tech founder taking a fearless stand against predatory software take-rates to protect shop margins',
      funnelAllocation: '15% of Total Content Output (Bottom Funnel / BOFU)'
    },
    targetAudienceB2B: 'LGS Owners, Multi-Store Operators, General Managers & High-Volume Singles Sellers',
    whyItIsAWhiteSpace: {
      competitorBlindSpot:
        'Incumbent software vendors hide their 2.5% GMV commission behind complicated pricing tiers. No founder dares to call out the exact dollar extraction on social video.',
      audiencePainAndDemand:
        'Card store owners work 70 hours a week with razor-thin net profits. Discovering that their software vendor is taking $18,000/year of their net margin creates instant outrage and demand for alternatives.',
      strategicMoat:
        'Our flat $149/mo model is an unassailable commercial moat. Showing real P&L math makes staying with BinderPOS mathematically indefensible.'
    },
    aeethodSaaSAnchor: {
      featureName: '0% GMV Flat SaaS Architecture ($149/mo)',
      productAdvantage:
        'Flat-rate cloud POS and webstore engine with 0% take-rate, eliminating the 2.5% BinderPOS commission and £1,000 setup ransoms.',
      commercialPayoff: 'Returns $15,000 to $45,000 directly to store net profits annually.'
    },
    recurringSeries: [
      {
        seriesId: 'series-commission-autopsy',
        title: 'The 2.5% Commission Autopsy',
        format: '45s Rapid P&L Audit / Screen Recording',
        cadence: 'Bi-Weekly Evergreen',
        description:
          'Tearing down real merchant statements showing exactly how much cash legacy POS platforms extract each month from store gross sales.'
      },
      {
        seriesId: 'series-founder-manifesto',
        title: 'Why I Built Aeethod OS',
        format: '60s Founder Ethics & SaaS Philosophy',
        cadence: 'Monthly Deep Dive',
        description:
          'Direct-to-camera founder talks explaining why taking a cut of a store\'s inventory revenue is fundamentally broken.'
      },
      {
        seriesId: 'series-pnl-recovery',
        title: 'The Card Shop P&L Recovery Playbook',
        format: '40s Store Turnaround Case Study',
        cadence: 'Bi-Weekly Showcase',
        description:
          'Real case studies showing how card shops redirected thousands in recovered software fees into high-margin inventory.'
      }
    ],
    videoAnglesLibrary: [
      {
        angleId: 'ang-3-1',
        seriesTitle: 'The 2.5% Commission Autopsy',
        title: 'The 3-Year $45,000 Commission Bleed',
        targetAudience: 'LGS Owners with >$40k/mo singles GMV',
        hook: 'If your card shop sells $60,000 a month in singles, your software vendor is quietly stealing $1,500 of your net profit every 30 days.',
        coreMechanism:
          'Slamming a real store P&L statement on desk, circling -$1,500 in red marker, and contrasting the 3-year compounding loss of 2.5% GMV vs flat $149/mo software.',
        executionChecklist: [
          'Frame 0: Slam physical monthly invoice on counter with -$1,500 circled in bright red marker.',
          'Second 4: Flash incumbent fee table: BinderPOS 2.5% vs TCG Sync 2% + £1,000 vs Aeethod 0%.',
          'Second 17: Project 3-year compounding cash loss ($45,000) reinvested into high-margin inventory.',
          'Ending: Seamless replay loop into opening hook sentence.'
        ]
      },
      {
        angleId: 'ang-3-2',
        seriesTitle: 'Why I Built Aeethod OS',
        title: 'Why I Refuse to Charge a 2.5% Take-Rate on Your Card Shop',
        targetAudience: 'Store Owners frustrated with software vendors',
        hook: 'I built Aeethod because I think charging a 2.5% commission on a card shop\'s gross singles revenue is criminal. Here is why.',
        coreMechanism:
          'Founder talking head: Explaining why software compute costs are flat, so charging percentage-based GMV tax is pure rent-seeking.',
        executionChecklist: [
          'Frame 0: Direct eye contact: "I built Aeethod because charging 2.5% of your gross sales is wrong."',
          'Second 6: Explain tech reality: Cloud servers don\'t work harder when you sell a $500 card vs a $5 card.',
          'Second 17: Reiterate Aeethod\'s pledge: $149 flat per month, 0% commission, forever.',
          'Ending: Loop back to opening statement.'
        ]
      },
      {
        angleId: 'ang-3-3',
        seriesTitle: 'The Card Shop P&L Recovery Playbook',
        title: 'How One Store Recovered $14,200 in 12 Months',
        targetAudience: 'Mid-sized Game Stores ($500k/yr singles GMV)',
        hook: 'Here is how a game store owner in Texas saved $14,200 in software fees in 12 months simply by switching to a flat $149 plan.',
        coreMechanism:
          'Before-and-after ledger walkthrough: Showing exact fee statements before and after migrating from BinderPOS to Aeethod OS.',
        executionChecklist: [
          'Frame 0: Split-screen graphic showing old fee statement ($1,350/mo) vs Aeethod ($149/mo).',
          'Second 5: Trace where the owner invested the recovered $1,200/mo: into local collection buylists.',
          'Second 17: Show net revenue growth resulting from reinvested trade capital.',
          'Ending: "Stop paying software taxes."'
        ]
      },
      {
        angleId: 'ang-3-4',
        seriesTitle: 'The 2.5% Commission Autopsy',
        title: 'The £1,000 Setup Ransom & The Vendor Lock-In Trap',
        targetAudience: 'Store Owners considering legacy software',
        hook: 'Before you sign a contract with legacy POS providers, watch out for the £1,000 data setup ransom hidden in page 4.',
        coreMechanism:
          'Exposing how legacy platforms charge massive setup fees and make data export nearly impossible to trap stores.',
        executionChecklist: [
          'Frame 0: Hold up page 4 of a legacy SaaS contract with £1,000 setup fee underlined.',
          'Second 5: Explain vendor lock-in mechanisms and data hostage policies.',
          'Second 17: Show Aeethod\'s 1-click free CSV catalog importer transferring 20,000 items in 3 minutes.',
          'Ending: Loop back to hook.'
        ]
      },
      {
        angleId: 'ang-3-5',
        seriesTitle: 'The Card Shop P&L Recovery Playbook',
        title: 'GMROI: The Metric That Saves Local Card Shops',
        targetAudience: 'LGS Owners & Retail Managers',
        hook: 'Card shops don\'t go bankrupt from lack of sales. They go bankrupt from high revenue and zero GMROI.',
        coreMechanism:
          'Explaining Gross Margin Return on Investment: Why modern singles turning 12x/yr produce 4x more profit than slabs sitting for 10 months.',
        executionChecklist: [
          'Frame 0: Point to a dusty $1,000 vintage graded slab sitting on shelf for 11 months.',
          'Second 5: Compare inventory turns: 12x turns on modern singles vs 1x turn on vintage trophy assets.',
          'Second 18: Demonstrate Aeethod GMROI automated inventory tagging flagging dead capital.',
          'Ending: Loop into start.'
        ]
      },
      {
        angleId: 'ang-3-6',
        seriesTitle: 'Why I Built Aeethod OS',
        title: 'The 2-Store 1-Warehouse Inventory Chaos',
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
    id: 'cs-velocity-tech-lab',
    spaceNumber: 4,
    title: 'The 60fps Velocity & Tech Demonstration Lab',
    tagline: 'The Browser Neural Vision, Sub-320ms Sync & Retail Automation Space',
    strategicDomain: '60fps Browser Optical Card Scanning, Sub-320ms Distributed Redis Concurrency, 1-Click 60-Card Decklist Ingestion & Self-Service Kiosks',
    category: 'Retail & Automation',
    viralMultiplier: '4x Save / Bookmark',
    funnelStage: 'BOFU (Speed & SaaS Conversion)',
    funnelStagePill: 'BOFU',
    primaryCohortId: 'lgs_owner',
    cohortsServed: [
      {
        cohortName: 'The Overworked LGS Owner & Store Manager',
        cohortRole: 'SaaS Product Magic — Slashes 40 clerk hours of sorting payroll and eliminates eBay double-selling defect penalties.',
        icon: '🏢'
      },
      {
        cohortName: 'The Full-Time Reseller & Power Flipper',
        cohortRole: 'Mobile Speed Tool — Scans 500-card convention hauls in 15 minutes right from phone browser without manual typing.',
        icon: '📦'
      },
      {
        cohortName: 'The Serious Collector & Competitive Player',
        cohortRole: 'Frictionless Webstore — Tests 1-click tournament decklist checkout that maps 60 cards in 2.8 seconds.',
        icon: '💎'
      }
    ],
    funnelProgressionMechanism:
      'Talking head holds phone to camera and scans 20 cards in 5 seconds live -> Viewers save/bookmark video (4x Save multiplier) -> Viewer tests browser camera demo at aeethod.com/scan -> Books full OS onboarding.',
    spokenCtaOutro: {
      ctaType: 'Interactive Optical Scanner Demo',
      script:
        'You can test our 60fps neural vision scanner right now from your own phone browser with zero apps to install. DM me "SCAN" or try it free at aeethod.com/scan.'
    },
    talkingHeadFormat: {
      cameraSetup: 'Dynamic handheld or desk shot: Founder addresses camera, then holds phone/iPad directly in front of lens showing live screen',
      propsInHand: 'Smartphone or iPad running Aeethod OS in browser, stack of 40 raw cards, barcode scanner, live split-screen monitor',
      founderRole: 'The Elite Technical Innovator — Shows actual working software running in real time with zero cuts, proving technical supremacy over dinosaur incumbents',
      funnelAllocation: '15% of Total Content Output (Bottom Funnel / BOFU)'
    },
    targetAudienceB2B: 'Inventory Managers, E-commerce Directors, Head Clerks, Multi-Channel PowerSellers & Store Owners',
    whyItIsAWhiteSpace: {
      competitorBlindSpot:
        'Competitors sell $15k–$30k mechanical sorting machines that jam on curled foils, or hide behind 15-minute cron batch syncing. Nobody demonstrates instant zero-hardware optical AI live on video.',
      audiencePainAndDemand:
        'Stores waste 40 clerk hours entering cards into keyboards, and live in terror of double-selling $400 slabs on eBay during Saturday afternoon rushes.',
      strategicMoat:
        'Instant visual proof: Seeing cards scanned at 60fps in a regular Safari/Chrome browser window on an iPad creates undeniable "how did they do that" tech credibility.'
    },
    aeethodSaaSAnchor: {
      featureName: 'Zero-Hardware 60fps Browser Neural Vision & Sub-320ms Redis Engine',
      productAdvantage:
        'Scans cards at 0.2s each on any web browser, and locks/delists SKUs across Shopify, eBay, and TCGplayer in under 320ms when rung up at the register.',
      commercialPayoff: 'Cuts intake labor cost from $0.27 to $0.02/card and guarantees 0% out-of-stock cancellation defects on eBay.'
    },
    recurringSeries: [
      {
        seriesId: 'series-stopwatch-trials',
        title: 'The 30-Second Stopwatch Speed Trials',
        format: '30s Split-Screen: Keyboard Typing vs Aeethod Optical Vision',
        cadence: 'Weekly Evergreen',
        description:
          'Side-by-side timer face-offs: Manual keyboard typing into Shopify vs Aeethod browser neural vision scanning 40 cards in 15 seconds.'
      },
      {
        seriesId: 'series-redis-demo',
        title: 'The Live 320ms Redis Delist Demo',
        format: '35s Register Scan vs Live eBay Screen Capture',
        cadence: 'Bi-Weekly Showcase',
        description:
          'Proving distributed Redis locking: Physical barcode beeped at POS while simultaneous screen recording shows eBay listing vanish in 320ms.'
      },
      {
        seriesId: 'series-decklist-race',
        title: 'The 1-Click Tournament Decklist Checkout Race',
        format: '30s Side-by-Side Webstore Assembly',
        cadence: 'Bi-Weekly Feature',
        description:
          'Screen recording: Player assembling 60 cards on Shopify (25 minutes) vs pasting raw text into Aeethod (ready to checkout in 2.8s).'
      }
    ],
    videoAnglesLibrary: [
      {
        angleId: 'ang-4-1',
        seriesTitle: 'The 30-Second Stopwatch Speed Trials',
        title: 'Stop Typing Card Numbers Into Shopify',
        targetAudience: 'LGS Owners paying hourly clerk sorting wages',
        hook: 'If you or your clerks are still typing set numbers and card names into a keyboard, stop. Watch this.',
        coreMechanism:
          'Founder talking head: Holding phone up to lens, sliding 20 raw cards under camera, green boxes flashing, cards instantly live in POS catalog.',
        executionChecklist: [
          'Frame 0: Address camera: "Every unsorted card on your counter is burning 27 cents in typing payroll."',
          'Second 4: Bring phone into frame; slide raw cards under camera; instant audio beep confirmations.',
          'Second 15: Show 20 cards cataloged with set, condition, and market pricing in under 5 seconds.',
          'Ending: "Stop burning payroll on manual intake."'
        ]
      },
      {
        angleId: 'ang-4-2',
        seriesTitle: 'The Live 320ms Redis Delist Demo',
        title: 'The $400 Double-Selling Disaster Prevented in 320ms',
        targetAudience: 'Multi-channel sellers on eBay & Shopify',
        hook: 'Selling the same $400 slab in your shop and on eBay at the exact same minute is NOT bad luck. It\'s a 15-minute polling bug.',
        coreMechanism:
          'Simulating in-store register scan with live screen recording of eBay and TCGplayer delisting simultaneously in 320ms via Aeethod Redis locking.',
        executionChecklist: [
          'Frame 0: Hold up an eBay Out-of-Stock Defect cancellation email on phone screen.',
          'Second 4: Explain the 15-minute cron batch sync vulnerability in BinderPOS/Crystal Commerce.',
          'Second 15: Live split-screen test: Barcode scanned at register -> sub-320ms instant delist on eBay.',
          'Ending: Seamless loop into opening hook.'
        ]
      },
      {
        angleId: 'ang-4-3',
        seriesTitle: 'The 30-Second Stopwatch Speed Trials',
        title: 'Masterball vs Pokéball Reverse Foil AI Test',
        targetAudience: 'Pokemon Retailers & Trade Clerks',
        hook: 'A clerk mistaking a Masterball holo for a regular reverse holo just lost your store an $85 margin swing in 2 seconds.',
        coreMechanism:
          'Testing human eye under store lighting vs Aeethod neural vision detecting the micro-pattern stamp in 0.18s.',
        executionChecklist: [
          'Frame 0: Hold up two virtually identical Japanese 151 reverse holos under counter light.',
          'Second 4: Point out why tired clerks mislabel them after 6 hours on their feet.',
          'Second 15: Slide cards under phone camera: Aeethod flags Masterball stamp and auto-prices at $92.50.',
          'Ending: Loop seamlessly into opening statement.'
        ]
      },
      {
        angleId: 'ang-4-4',
        seriesTitle: 'The 30-Second Stopwatch Speed Trials',
        title: 'Why $15,000 Robotic Card Sorters Jam and Fail',
        targetAudience: 'Store Owners debating robotic hardware',
        hook: 'Before you spend $15,000 on a robotic card sorting machine, watch what happens when a card is slightly warped.',
        coreMechanism:
          'Demonstrating the mechanical jam crisis of physical feed rollers on curled foils vs non-contact optical browser scanning.',
        executionChecklist: [
          'Frame 0: Show curled foil jamming a mechanical belt feeder.',
          'Second 5: Breakdown the true ROI: $15k hardware + annual maintenance contracts + mechanical jams.',
          'Second 16: Show Aeethod\'s software-only optical scanner working on any phone or iPad camera with zero jams.',
          'Ending: Loop back to hook.'
        ]
      },
      {
        angleId: 'ang-4-5',
        seriesTitle: 'The 1-Click Tournament Decklist Checkout Race',
        title: 'The 60-Card Tournament Decklist Checkout Race',
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
        angleId: 'ang-4-6',
        seriesTitle: 'The Live 320ms Redis Delist Demo',
        title: 'From Collection Drop-Off to 3 Marketplaces in 4 Minutes',
        targetAudience: 'Fast-Turnaround Card Flippers & LGS Owners',
        hook: 'A customer dropped off 60 high-end singles at 2:00 PM. By 2:04 PM, all 60 are live on Shopify, eBay, and TCGplayer.',
        coreMechanism:
          'End-to-end continuous workflow: Camera scans cards -> AI grades condition -> Sync engine publishes across 3 channels in 240 seconds.',
        executionChecklist: [
          'Frame 0: Customer slides a deck box across counter; start countdown timer on screen: 04:00.',
          'Second 6: Rapid camera sweep scans 60 cards into pending intake queue.',
          'Second 18: One-tap bulk publish pushes live listings to webstore and eBay with sub-320ms sync.',
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
