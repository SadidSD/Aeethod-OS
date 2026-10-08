export interface AudienceCohort {
  id: 'lgs_owner' | 'reseller' | 'collector' | 'dreamer';
  title: string;
  tag: string;
  badgeColor: string;
  avatarIcon: string;
  demographics: string;
  primaryNightmare: string;
  greedDesire: string;
  algorithmicHabit: string;
  keyInteractionTrigger: 'DM Sends' | 'Bookmarks & Saves' | 'Loop Replays & Comments' | 'Watch Time';
  triggerKeywords: string[];
  winningHooks: string[];
  creatorFit: 'Sadid' | 'Anika' | 'Both';
}

export interface WhiteSpaceGap {
  id: string;
  niche: string;
  redOceanTrap: {
    title: string;
    flaw: string;
    consequence: string;
  };
  blueOceanWedge: {
    title: string;
    advantage: string;
    algorithmicMoat: string;
    creator: 'Sadid' | 'Anika' | 'Both';
  };
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

export const AUDIENCE_COHORTS: AudienceCohort[] = [
  {
    id: 'lgs_owner',
    title: 'The Overworked LGS Owner & Store Manager',
    tag: 'B2B Core Buyer',
    badgeColor: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
    avatarIcon: '🏢',
    demographics: 'Age 28–52 • Owns or operates physical card shops with 2–15 retail clerks',
    primaryNightmare:
      'Bleeding cash on hourly sorting payroll, 6-hour inventory intake marathons, double-selling $400 slabs across eBay & in-store POS, and 75% distributor allocation cuts.',
    greedDesire:
      'Predictable gross margin return on investment (GMROI), automated optical intake, zero-latency multi-channel syncing, and leaving the shop at 9:00 PM without unpaid sorting overtime.',
    algorithmicHabit:
      'High DM Share Velocity (5x multiplier) — DMs reels directly to store partners, co-owners, and head clerks: "We need this exact system in our shop."',
    keyInteractionTrigger: 'DM Sends',
    triggerKeywords: ['Buylist formula', 'Clerk payroll', 'Double sold', 'Allocation cut', 'Sync delay', 'Net profit'],
    winningHooks: [
      'Selling a $100 card on a marketplace does NOT give you $100 in the bank.',
      'A store owner boasted about an $18,000 cash-out day. Here is what they actually netted.',
      'Selling the same $300 slab in-store and on eBay at the exact same minute is NOT bad luck.'
    ],
    creatorFit: 'Sadid'
  },
  {
    id: 'reseller',
    title: 'The Full-Time Reseller & Power Flipper',
    tag: 'High-Volume Transactional',
    badgeColor: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    avatarIcon: '📦',
    demographics: 'Age 20–38 • Flips singles and sealed cases from home, card shows, eBay, and TCGplayer',
    primaryNightmare:
      'Platform fee inflation (TCGplayer Direct micro-fee hikes), return fraud, shipping chargebacks, and buying binder collections with undetected micro-creases.',
    greedDesire:
      'The 70% buylist formula, rapid 7-day inventory velocity, buying at 50% cash value without customer pushback, and mathematical margin guardrails.',
    algorithmicHabit:
      'High Save / Bookmark Rate (4x multiplier) — Saves videos to consult pricing deduction formulas and fee tables during trade negotiations.',
    keyInteractionTrigger: 'Bookmarks & Saves',
    triggerKeywords: ['TCGplayer fee update', 'Gross vs Net', 'Buylist 70%', 'Binder buyout', 'Packaging loss'],
    winningHooks: [
      'If you sell cards under $2.49 on TCGplayer Direct, you are working for free.',
      'How to calculate cash vs store credit margins without losing money on fees.',
      'Do NOT order your Q4 sealed inventory until you run these 3 working-capital numbers.'
    ],
    creatorFit: 'Sadid'
  },
  {
    id: 'collector',
    title: 'The Serious Collector & Slab Investor',
    tag: 'High-Ticket Capital',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    avatarIcon: '💎',
    demographics: 'Age 24–48 • High disposable income, purchasing $150 to $10,000+ raw vintage and PSA/CGC slabs',
    primaryNightmare:
      'Paying PSA 9 prices for a card with an invisible binder ring compression ding, buying counterfeit factory fakes, or holding pumped cards right before a reprint crash.',
    greedDesire:
      'Spotting undervalued raw cards that will grade PSA 10, forensic counterfeit detection skills, and timing the secondary market print cycles.',
    algorithmicHabit:
      'High Loop Replay (APW >120%) & Fierce Comment Debates — Loops videos 2x to inspect the foil under 10x jeweler loupe and argues authentication in the comments.',
    keyInteractionTrigger: 'Loop Replays & Comments',
    triggerKeywords: ['Loupe zoom', 'Foil pattern fake', 'PSA 8 to PSA 5', 'Hairline indent', 'Reprint crash'],
    winningHooks: [
      'A customer brought in this vintage Charizard asking for cash, but one micro-flaw changed the offer.',
      'Can you spot the Super Fake 30th Celebration Mew ex in 5 seconds?',
      'One of these is worth $800. The other came from an overseas counterfeit factory.'
    ],
    creatorFit: 'Anika'
  },
  {
    id: 'dreamer',
    title: 'The Hobby Dreamer & Casual Player',
    tag: 'Viral Reach & Community',
    badgeColor: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
    avatarIcon: '🎮',
    demographics: 'Age 15–32 • Plays local weekly tournaments, opens packs, dreams of opening an LGS one day',
    primaryNightmare:
      'Missing out on chase cards, paying scalper markups, and intimidation at the store trade-in counter.',
    greedDesire:
      'Behind-the-scenes reality of what running a card store is actually like, and experiencing huge binder unboxing reveals.',
    algorithmicHabit:
      'High Raw Watch Time & Casual Likes — Watches narrative storytelling arcs from start to finish, driving baseline algorithm distribution.',
    keyInteractionTrigger: 'Watch Time',
    triggerKeywords: ['Saturday night rush', 'Behind the counter', 'Card shop reality', 'Tournament night'],
    winningHooks: [
      'People think working at a card shop is opening packs all day. Here is what Saturday night actually looks like.',
      'Saturday 8:30 PM: 30 tournament players rush the trade-in counter with 1,500 unsorted foils.'
    ],
    creatorFit: 'Anika'
  }
];

export const WHITE_SPACE_GAPS: WhiteSpaceGap[] = [
  {
    id: 'ws-1',
    niche: 'Card Shop Profitability & Economics',
    redOceanTrap: {
      title: 'Gross Revenue Bragging & Box Ripping',
      flaw: 'Creators boast about selling $50,000 of cards in a month or scream at opening booster packs.',
      consequence: 'Zero business trust, no B2B conversion, viewed as pure dopamine brain-rot.'
    },
    blueOceanWedge: {
      title: 'The Brutal Balance Sheet Audit',
      advantage: 'Sadid breaks down receipt by receipt: wholesale cost, platform fees, payment fees, packaging overhead, and actual net cash ($100 -> $26.70).',
      algorithmicMoat: 'Triggers intense DM share velocity among business partners and store co-owners.',
      creator: 'Sadid'
    }
  },
  {
    id: 'ws-2',
    niche: 'Card Grading & Triage Inspection',
    redOceanTrap: {
      title: 'Shaky Handheld Card Show Tours',
      flaw: 'Creators walk down convention aisles showing glass cases without stakes or forensic details.',
      consequence: '65% swipe-away in seconds 0–3, low completion, zero evergreen saves.'
    },
    blueOceanWedge: {
      title: 'Forensic Trade Counter CSI',
      advantage: 'Anika zooms in under 10x jeweler loupe under 5000K angled lighting to expose micro-flaws that swing pricing by hundreds of dollars.',
      algorithmicMoat: 'Viewers replay 1.3x to spot the flaw before the reveal, pushing APW >120%.',
      creator: 'Anika'
    }
  },
  {
    id: 'ws-3',
    niche: 'Retail Technology & Automation',
    redOceanTrap: {
      title: 'Dry Corporate POS Software Demos',
      flaw: 'Boring screencasts demonstrating inventory software with robotic narration.',
      consequence: 'Instant viewer bounce, zero emotional connection.'
    },
    blueOceanWedge: {
      title: 'Chaos vs Engineering Showdown',
      advantage: 'Direct visual split-screen: Clerk suffering through 3 hours of manual laptop typing vs 50 cards fed into optical scanner in 35 seconds.',
      algorithmicMoat: 'Emotional relief and shock contrast driving software signups and inquiries.',
      creator: 'Both'
    }
  }
];

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
