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
  category: 'Economics & Operations' | 'Forensic Science & Grading' | 'Retail & Automation' | 'Market Dynamics & Consumer Defense';
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
    id: 'ws-economics',
    niche: 'Card Shop Unit Economics & Balance Sheet Realism',
    category: 'Economics & Operations',
    viralMultiplier: '5x DM Share',
    primaryFormat: '45s Rapid Receipt Audit / Animated Fee Breakdown',
    redOceanTrap: {
      title: 'Gross Revenue Bragging & Manufactured Hype',
      flaw: 'Creators boast about selling $50,000 of cards in a month or scream opening packs without deducting a single dollar of overhead.',
      consequence: 'Zero business trust, no B2B conversion, dismissed by serious sellers as vanity brain-rot.'
    },
    blueOceanWedge: {
      title: 'The Brutal Balance Sheet Audit',
      advantage: 'Sadid performs receipt-level autopsies: wholesale COGS, marketplace commissions (10.75-13.25%), USPS shipping loss, packaging overhead, payment processing fees, and actual net cash ($100 gross -> $26.70 net cash).',
      algorithmicMoat: 'Triggers intense DM share velocity between store partners, co-owners, and flippers ("Watch this—this is why our margins are bleeding").',
      exampleHook: 'Selling a $100 card on a marketplace does NOT give you $100 in the bank. Here is the receipt.',
      creator: 'Sadid'
    },
    tacticalChecklist: [
      'Frame 0: Drop a physical $100 bill or receipt paper onto the inspection mat with loud audio.',
      'Second 3: Flash animated fee deduction bars (-$13.25 platform, -$4.20 shipping, -$3.10 tax/materials).',
      'Second 20: Reveal net cash ($26.70) vs customer expectation.',
      'Ending: Loop final sentence into the opening hook without an outro screen.'
    ]
  },
  {
    id: 'ws-forensics',
    niche: 'Forensic Counterfeit & Optical Micro-Authentication',
    category: 'Forensic Science & Grading',
    viralMultiplier: 'APW >120% Loop',
    primaryFormat: '30s 40x Jeweler Loupe Macro CSI Zoom',
    redOceanTrap: {
      title: 'Blurry Handheld "Spot The Fake" Guessing Games',
      flaw: 'Creators show low-res phone camera footage of obvious cheap fakes with giant bad fonts or missing holo stars.',
      consequence: '65% swipe-away in seconds 0–3, low completion, zero evergreen saves from serious collectors.'
    },
    blueOceanWedge: {
      title: 'Forensic CSI Micro-Loupe Lab',
      advantage: 'Anika zooms in under 40x jeweler loupe under 5000K angled lighting to expose rosette print matrices vs flat inkjet dots, 365nm UV paper reactions, and 280µm vs 320µm micrometer thickness traps.',
      algorithmicMoat: 'Viewers replay 1.4x to inspect the rosette pattern before the answer is revealed, pushing Average Percentage Watched >120%.',
      exampleHook: 'One of these is worth $800. The other came from an overseas counterfeit factory. Can you spot it in 3 seconds?',
      creator: 'Anika'
    },
    tacticalChecklist: [
      'Frame 0: Side-by-side macro view of two identical-looking cards under bright white LED.',
      'Second 2: On-screen 3-second countdown timer with rhythmic ticking audio.',
      'Second 10: 40x loupe zoom revealing authentic rosette print pattern vs counterfeit inkjet bleed.',
      'Ending: Instant snap back to opening cards for seamless looping.'
    ]
  },
  {
    id: 'ws-counter-psychology',
    niche: 'Trade Counter Psychology & Valuation Transparency',
    category: 'Economics & Operations',
    viralMultiplier: 'High Debate Comments',
    primaryFormat: '40s First-Person Trade Counter POV',
    redOceanTrap: {
      title: 'Staged Trade Night Flexes & Aggressive Lowballing',
      flaw: 'Vendors flexing stacks of cash with trap music, or predatory lowballing that makes sellers feel intimidated and cheated.',
      consequence: 'Viewers feel alienated; creates hostility toward game stores; zero actionable educational takeaway.'
    },
    blueOceanWedge: {
      title: 'Behind-the-Counter Live Triage & Valuation Transparency',
      advantage: 'Transparently explaining the exact mathematical deduction: "This vintage Venusaur is market $140 at Near Mint, but this microscopic 0.4mm binder-dent drops it to Moderately Played ($45). Here is our 70% cash offer ($31.50) vs 80% store credit ($36)."',
      algorithmicMoat: 'Radical honesty builds generational customer trust. Fierce comments debating whether the customer should take cash or grade the card.',
      exampleHook: 'A customer brought in this vintage Charizard asking for cash, but one micro-flaw changed the offer.',
      creator: 'Both'
    },
    tacticalChecklist: [
      'Frame 0: Card placed on rubber playmat with price tag overlay ($250).',
      'Second 4: Tilt card under 45-degree light to reveal hidden surface binder impression.',
      'Second 15: Show the live buylist calculation matrix on screen (NM $250 -> MP $95 -> 70% Cash $66.50).',
      'Second 30: Ask the audience: "Would you take the $66 cash or crack and risk grading?"'
    ]
  },
  {
    id: 'ws-card-doctoring',
    niche: '"Card Doctoring" & Fraudulent Restoration vs Preservation',
    category: 'Forensic Science & Grading',
    viralMultiplier: 'High Debate Comments',
    primaryFormat: '35s UV Blacklight & Digital Caliper Investigation',
    redOceanTrap: {
      title: 'Unethical "Card Cleaning Hacks" & Quick Fix Guides',
      flaw: 'Creators showing viewers how to wipe cards with baby oil, iron foils with heat, or wax scratches to artificially pass PSA grading.',
      consequence: 'Spreads illegal alteration methods, creates buyer distrust, and results in rejected "Altered Authentic" submissions.',
      },
    blueOceanWedge: {
      title: 'The Card Doctor Forensic Autopsy',
      advantage: 'Anika demonstrates how altered, pressed, trimmed, and chemically cleaned cards are detected under oblique UV lighting and edge thickness calipers, saving collectors from $500 slab traps.',
      algorithmicMoat: 'High-stakes controversy between hobby conservation vs outright fraud. High save rate from collectors inspecting high-value raw cards before purchase.',
      exampleHook: 'Someone used chemical oil and an iron on this vintage card to trick PSA. Here is how our UV light caught it instantly.',
      creator: 'Anika'
    },
    tacticalChecklist: [
      'Frame 0: Split view of an apparently flawless vintage card under standard light vs under 365nm UV blacklight.',
      'Second 5: Highlight unnatural chemical sheen and fluorescence residue on card border.',
      'Second 18: Digital caliper measurement showing 0.2mm edge shrinkage from illegal razor trimming.',
      'Ending: Warning prompt: "Save this checklist before buying raw vintage at your next card show."'
    ]
  },
  {
    id: 'ws-mystery-ev',
    niche: 'Mystery Box & "Rip-and-Ship" Expected Value (EV) Deconstruction',
    category: 'Market Dynamics & Consumer Defense',
    viralMultiplier: '5x DM Share',
    primaryFormat: '40s Financial Forensic Audit with Live Spreadsheet Overlay',
    redOceanTrap: {
      title: 'Hype Blind Purchases & Gambling Sensationalism',
      flaw: 'Influencers blindly buying $200 mystery bags on Whatnot or TikTok Shop, screaming at filler packs and pretending they got rich.',
      consequence: 'Glorifies gambling to teenagers, promotes bulk-dumping schemes, and burns viewer trust when viewers lose money.',
    },
    blueOceanWedge: {
      title: 'The Expected Value (EV) Mathematical Autopsy',
      advantage: 'Sadid buys viral mystery packs, catalogs every card onto a live spreadsheet with TCGplayer low prices, and calculates the exact Expected Value ($18.40) vs Purchase Price ($65.00), exposing repacks as bulk-dumping vehicles.',
      algorithmicMoat: 'Consumer advocacy + mathematical truth. Viewers share the video with friends to warn them against buying rip-and-ship repack boxes.',
      exampleHook: 'I spent $300 on viral TikTok "Mystery Slabs" so you don\'t have to. Here is the exact mathematical loss.',
      creator: 'Sadid'
    },
    tacticalChecklist: [
      'Frame 0: Cut open viral mystery package with large price tag "$99 Mystery Box".',
      'Second 4: Catalog all cards onto an on-screen live spreadsheet with TCGplayer low prices.',
      'Second 20: Tally total realized value ($28.40) and display net margin loss (-71.6%).',
      'Second 32: Conclude with the golden rule of repacks: If EV was positive, the seller would open it themselves.'
    ]
  },
  {
    id: 'ws-automation-tech',
    niche: 'Retail Chaos vs Computer Vision Optical Automation',
    category: 'Retail & Automation',
    viralMultiplier: '5x DM Share',
    primaryFormat: '30s Visual Split-Screen Showdown',
    redOceanTrap: {
      title: 'Dry Corporate POS Software Demos',
      flaw: 'Boring 20-minute screen recordings of someone typing into inventory fields with robotic narration.',
      consequence: 'Instant viewer bounce, zero emotional connection, viewed as boring commercial ads.'
    },
    blueOceanWedge: {
      title: 'Chaos vs Engineering Showdown',
      advantage: 'Direct visual split-screen: Clerk suffering through 3 hours of manual laptop typing vs 50 cards fed into optical scanner in 35 seconds with instant multi-platform inventory sync.',
      algorithmicMoat: 'Visceral, high-contrast visual shock that triggers store owners to immediately DM their managers: "We need this in our shop."',
      exampleHook: 'Why does every card shop in America still pay a clerk $18/hr to manually type card numbers into a laptop?',
      creator: 'Both'
    },
    tacticalChecklist: [
      'Frame 0: Split-screen clock running at 00:00:00.',
      'Second 5: Contrast the frustration of manual typing vs cards rapidly flying through optical camera intake.',
      'Second 20: Left screen finishes 4 cards; right screen finishes 100 cards and automatically updates eBay, TCGplayer, and Shopify POS.',
      'Second 28: Call to action: "Stop burning payroll on manual intake."'
    ]
  },
  {
    id: 'ws-meta-arbitrage',
    niche: 'Market Spike Anatomy: Tournament Meta Shocks to Buylist Arbitrage',
    category: 'Market Dynamics & Consumer Defense',
    viralMultiplier: '4x Save / Bookmark',
    primaryFormat: '35s Market Spike Ticker & Tournament Replay',
    redOceanTrap: {
      title: 'Vague "Top 10 Cards to Buy" Speculation',
      flaw: 'Creators posting outdated speculative lists that mislead collectors into buying at peak hype right before a reprint crash.',
      consequence: 'Viewers lose money following bad advice; zero understanding of the underlying economic mechanism.'
    },
    blueOceanWedge: {
      title: 'The 48-Hour Meta Transmission Chain',
      advantage: 'Sadid breaks down the exact transmission chain from Sunday Regional Championship Top 8 decklists to Tuesday morning bulk buyout, showing how automated buylists dynamically reprice before stores get cleaned out by arbitrage bots.',
      algorithmicMoat: 'High utility for both competitive players and card shop owners. High bookmark rate as viewers use the framework to predict the next spike.',
      exampleHook: 'A rogue deck won in Japan yesterday at 6:00 AM. By 9:00 AM, these 3 twenty-cent bulk cards were selling out at $7 across America.',
      creator: 'Sadid'
    },
    tacticalChecklist: [
      'Frame 0: Slam the obscure tournament card on desk: "This was a 15-cent bulk card on Friday."',
      'Second 4: Show the tournament Twitch stream winning play and the 1,400% price chart vertical spike.',
      'Second 18: Show how online arbitrage bots buy out TCGplayer inventory in 20 minutes.',
      'Second 28: Explain how smart store buylists protect against being drained by automated repricing.'
    ]
  },
  {
    id: 'ws-logistics-fees',
    niche: 'Packaging, Shipping & Logistics Friction Breakdown',
    category: 'Economics & Operations',
    viralMultiplier: '4x Save / Bookmark',
    primaryFormat: '30s Packaging Scale & Shipping Fee Breakdown',
    redOceanTrap: {
      title: 'Aesthetic "Pack An Order With Me" Vlogs',
      flaw: 'Cute videos with stickers, pastel tissue paper, and lo-fi music that ignore shipping weights, postal rates, and margin viability.',
      consequence: 'Teaches aspiring sellers unprofitable packing habits that guarantee negative net income on low-value cards.'
    },
    blueOceanWedge: {
      title: 'The $1.20 Shipping Slip That Kills E-Commerce Margins',
      advantage: 'Demonstrating the physics and economics of PWE (Plain White Envelope) vs Bubble Mailer with Tracking vs Slab Armor, showing how a 2-ounce weight miscalculation or non-machinable USPS surcharge destroys profits on single cards under $10.',
      algorithmicMoat: 'Actionable operational education for the 100,000+ eBay and TCGplayer power sellers. High save and comment interaction discussing postage rates.',
      exampleHook: 'If you ship raw cards under $15 inside bubble mailers with $4 tracking, you are literally paying the post office to work.',
      creator: 'Sadid'
    },
    tacticalChecklist: [
      'Frame 0: Put a single $8 card inside a padded bubble envelope with a $4.85 shipping label sticker.',
      'Second 4: Show math: $8 Sale - $1.04 TCG Fee - $4.85 Shipping - $0.60 Mailer = $1.51 Net Cash (before cost of goods).',
      'Second 16: Demonstrate the proper rigid semi-rigid mailer PWE setup at $0.69 postage with non-machinable stamp.',
      'Second 26: "Save this before you pack your next 20 orders."'
    ]
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
