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
  category: 'Economics & Operations' | 'Retail & Automation' | 'Market Dynamics & Pricing Defense';
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
    id: 'ws-platform-tax',
    niche: 'The 2.5% Incumbent Commission Tax (Freeing Store GMV)',
    category: 'Economics & Operations',
    viralMultiplier: '5x DM Share',
    primaryFormat: '45s Rapid P&L Audit / Commission Calculator Breakdown',
    redOceanTrap: {
      title: 'Dry Software Pricing Feature Lists & Generic Ads',
      flaw: 'SaaS providers show boring feature comparison matrices with robotic voiceovers that store owners ignore.',
      consequence: 'Zero engagement; merchants remain unaware they are losing tens of thousands of dollars each year.'
    },
    blueOceanWedge: {
      title: 'The Brutal Commission Autopsy (0% GMV Revolution)',
      advantage: 'Auditing a real store ledger: BinderPOS taking 2.5% of GMV ($1,250/mo on $50k singles) after freezing new signups; TCG Sync demanding a £1,000 setup ransom + 2% tax. Demonstrating how Aeethod flat $149/mo (0% commission) returns $15,000/year directly to the store owner\'s bottom line.',
      algorithmicMoat: 'Violent financial clarity triggers store owners and business partners to DM each other: "Look how much cash we\'re bleeding every single month."',
      exampleHook: 'If your card shop sells $60,000 a month in singles, your software vendor is quietly stealing $1,500 of your net profit every 30 days.',
      creator: 'Sadid'
    },
    tacticalChecklist: [
      'Frame 0: Slam a physical store P&L statement or calculator on desk showing -$1,500 circled in red marker.',
      'Second 3: Flash incumbent fee comparison table (BinderPOS 2.5% vs TCG Sync 2% + £1,000 vs Aeethod 0%).',
      'Second 18: Show the 3-year compounding cash loss ($45,000) vs flat-fee software.',
      'Ending: Seamless loop: "Which is why selling cards on your own website should never mean..."'
    ]
  },
  {
    id: 'ws-sync-latency',
    niche: 'The $400 Double-Selling Disaster (Sub-500ms Omnichannel Sync)',
    category: 'Retail & Automation',
    viralMultiplier: '5x DM Share',
    primaryFormat: '35s Concurrency Stress Test & Split Screen',
    redOceanTrap: {
      title: 'Vague "We Connect to Marketplaces" Marketing Claims',
      flaw: 'Software vendors claim multi-channel sync while concealing their 15-to-45 minute batch polling delay.',
      consequence: 'Stores double-sell high-value singles, triggering eBay Transaction Defects, 5% fee penalties, and TCGplayer Direct bans.'
    },
    blueOceanWedge: {
      title: 'Zero-Latency Distributed Lock Showdown',
      advantage: 'Demonstrating why 1-of-1 cards ($400 slabs, serialized foils) double-sell on Saturday afternoon. Simulating an in-store POS barcode scan with live screen recording of eBay and TCGplayer delisting simultaneously in 320ms via Aeethod Redis locking before the paper receipt finishes printing.',
      algorithmicMoat: 'Solves the #1 terror of high-volume sellers: marketplace defect penalties and losing TCGplayer Direct privileges.',
      exampleHook: 'Selling the same $400 slab in your shop and on eBay at the exact same minute is NOT bad luck. It\'s a 15-minute polling bug in your software.',
      creator: 'Both'
    },
    tacticalChecklist: [
      'Frame 0: Hold up an eBay "Transaction Defect: Item Out of Stock" cancellation notice on mobile screen.',
      'Second 4: Explain the 15-minute cron job vulnerability that legacy software (BinderPOS/Crystal) relies on.',
      'Second 15: Run live split-screen test: Barcode scanned at register -> sub-350ms instant delist on eBay/Shopify.',
      'Ending: Seamless loop into opening hook.'
    ]
  },
  {
    id: 'ws-intake-automation',
    niche: 'The $0.27 vs $0.02 Intake Labor Crisis (The 10,000-Card Backlog)',
    category: 'Retail & Automation',
    viralMultiplier: '5x DM Share',
    primaryFormat: '30s Visual Split-Screen Speed Challenge',
    redOceanTrap: {
      title: '$10,000 Mechanical Sorting Machines & Clunky Flatbeds',
      flaw: 'Pushing expensive physical robotic sorters (CardCastle, Roca) that cost $10k-$30k and jam on warped foils.',
      consequence: 'Completely inaccessible for 90% of local game stores; collections pile up in shoeboxes.'
    },
    blueOceanWedge: {
      title: 'Zero-Hardware Browser Neural Vision Ingest',
      advantage: 'Timer battle: Clerk manually typing card numbers and checking set symbols (30 hours for 3,000 cards = $0.27/card labor) vs Aeethod 60fps browser neural scanner identifying Masterball vs reverse holo, Unlimited vs Revised, at 0.2s/card on a standard iPad webcam ($0.02/card).',
      algorithmicMoat: 'Visceral contrast between messy cardboard chaos and effortless automated speed. Drives inbound trial requests.',
      exampleHook: 'Every unsorted shoebox behind your register is burning $450 in clerk payroll while the card prices crash 40%.',
      creator: 'Both'
    },
    tacticalChecklist: [
      'Frame 0: Drop a dusty 3,200-count cardboard card box on the counter with a stopwatch.',
      'Second 4: Show the math: 30 hours of clerk typing = $540 payroll before a single card is sold.',
      'Second 14: Show camera scanning 40 cards in 15 seconds directly into POS inventory without touching a keyboard.',
      'Ending: "Stop burning payroll on manual intake."'
    ]
  },
  {
    id: 'ws-buylist-bottleneck',
    niche: 'The Friday 7:30 PM Counter Bottleneck (The $1,200 Walk-Out)',
    category: 'Economics & Operations',
    viralMultiplier: 'High Debate Comments',
    primaryFormat: '40s In-Store Counter Drama & Kiosk Workflow',
    redOceanTrap: {
      title: 'Generic "How to Grade Cards" Collector Advice',
      flaw: 'Focusing on hobby grading theory while ignoring the commercial disaster of lines backing up at the cash register.',
      consequence: 'Stores lose paying retail customers who leave rather than waiting 40 minutes for a trade appraisal.'
    },
    blueOceanWedge: {
      title: 'The Self-Service Buylist Kiosk Revolution',
      advantage: 'Exposing the Friday Night Magic crisis: A customer brings a 120-card binder at 7:30 PM, locking the register for 40 minutes while paying customers put down booster boxes and walk out ($1,200 loss). Demonstrating Aeethod iPad Customer Kiosk where players scan & submit their own trade-ins, locking strict 70% cash / 85% credit rules in 2 minutes.',
      algorithmicMoat: 'Extreme resonance with overworked store owners who dread peak-hour trade binder submissions.',
      exampleHook: 'How one customer trading in a binder at 7:30 PM just cost your game store $1,200 in lost Friday night sales.',
      creator: 'Sadid'
    },
    tacticalChecklist: [
      'Frame 0: Point camera at a long line of agitated customers waiting behind one person flipping through a binder.',
      'Second 5: Calculate the cost: $400 in abandoned sales + 45 minutes of wasted clerk attention.',
      'Second 18: Demo the Aeethod customer-facing iPad kiosk where players scan & submit their trade-in in 2 minutes.',
      'Ending: "Free up your registers on Friday night."'
    ]
  },
  {
    id: 'ws-arbitrage-defense',
    niche: 'Tournament Metagame Shocks & 6:00 AM Arbitrage Bot Defense',
    category: 'Market Dynamics & Pricing Defense',
    viralMultiplier: '4x Save / Bookmark',
    primaryFormat: '35s Market Spike Ticker & API Alert Breakdown',
    redOceanTrap: {
      title: 'Speculative "Top 10 Cards to Buy" Consumer Lists',
      flaw: 'Telling hobbyists what cards to speculate on, offering zero protective value to store owners.',
      consequence: 'Stores get picked clean by scraping bots while owners sleep, losing hundreds in inventory margin.'
    },
    blueOceanWedge: {
      title: 'The 6:00 AM Bot Drain Defense',
      advantage: 'Breaking down the merchant nightmare: Sunday at 6:00 AM, a rogue deck wins a Champions League tournament in Japan using an obscure $0.25 bulk trainer. By 7:00 AM, scraping arbitrage bots clean out your Shopify store of 50 copies at $0.25, reselling them on TCGplayer at $8.00 by 9:00 AM. Demonstrating Aeethod Dynamic Autopricer freezing inventory or raising buylists automatically before stores get drained.',
      algorithmicMoat: 'Critical defensive intelligence for store owners who hate losing margin to online scraping arbitrageurs.',
      exampleHook: 'While your store was closed Sunday morning, arbitrage bots bought 40 copies of this bulk card for $10. They\'re already reselling them for $320.',
      creator: 'Sadid'
    },
    tacticalChecklist: [
      'Frame 0: Slam a 25-cent uncommon trainer card on the desk with an $8.50 TCGplayer price overlay.',
      'Second 4: Show the Japanese tournament stream victory at 6:00 AM and the instant bot buyout on Shopify.',
      'Second 16: Show how Aeethod\'s Dynamic Repricer detects market velocity surges and updates inventory prices automatically.',
      'Ending: Loop into start without outro.'
    ]
  },
  {
    id: 'ws-decklist-friction',
    niche: 'Why Players Abandon Local Store Websites (The 60-Card Decklist)',
    category: 'Retail & Automation',
    viralMultiplier: '5x DM Share',
    primaryFormat: '30s Side-by-Side E-Commerce Friction Test',
    redOceanTrap: {
      title: 'Guilt-Tripping "Support Your Local Game Store" Posts',
      flaw: 'Store owners begging players on social media to buy local instead of TCGplayer without fixing their broken website UX.',
      consequence: 'Players still buy on TCGplayer because searching 60 singles manually on a slow Shopify theme takes 25 minutes.'
    },
    blueOceanWedge: {
      title: '1-Click Tournament Decklist Ingest ("Paste & Buy")',
      advantage: 'Demonstrating the cart abandonment crisis: A tournament player has to search 60 times and click 60 dropdown menus on standard Shopify (takes 25 minutes). They give up and use TCGplayer Cart Optimizer. Demonstrating Aeethod\'s Decklist Ingest: Player pastes raw tournament text export, system maps 60 cards to local inventory in 2.8 seconds, 1 tap to checkout.',
      algorithmicMoat: 'Solves the fundamental reason local store websites fail to capture competitive tournament singles GMV.',
      exampleHook: 'Your local players aren\'t buying singles on TCGplayer because they\'re cheap. They\'re doing it because your Shopify site takes 25 minutes to build a deck.',
      creator: 'Sadid'
    },
    tacticalChecklist: [
      'Frame 0: Show someone typing card names into a sluggish Shopify search bar with a clock ticking.',
      'Second 5: Highlight the 82% cart abandonment rate on multi-card tournament singles orders.',
      'Second 15: Demo Aeethod Decklist Ingest: Paste raw text -> 60 cards added to cart in 3 seconds.',
      'Ending: "Turn your local players into direct webstore buyers."'
    ]
  },
  {
    id: 'ws-convention-offline',
    niche: 'Convention Center Chaos: When Trade Show Wi-Fi Dies at 11:00 AM',
    category: 'Retail & Automation',
    viralMultiplier: '4x Save / Bookmark',
    primaryFormat: '35s High-Stakes Convention Floor Breakdown',
    redOceanTrap: {
      title: 'Aesthetic Card Show Showcase Vlogs with Trap Beats',
      flaw: 'Filming flashy glass cases while completely ignoring the logistical chaos of selling at card conventions.',
      consequence: 'Zero utility for professional traveling vendors who need rock-solid POS hardware.'
    },
    blueOceanWedge: {
      title: 'The Offline-First PWA Survival Architecture',
      advantage: 'Breaking down the Collect-A-Con / Regional Championship disaster: 8,000 collectors enter the hall at 10:00 AM. Cellular networks jam; venue Wi-Fi drops to 0 kbps. Cloud POS registers crash. Vendors cannot look up prices or track inventory. Demonstrating Aeethod Offline-First PWA mode with local IndexedDB/SQLite caching that completes barcode sales offline and reconciles inventory the instant connection returns.',
      algorithmicMoat: 'Mission-critical software positioning that proves Aeethod was engineered by real card show veterans.',
      exampleHook: 'What happens when 5,000 collectors jam the convention Wi-Fi and your cloud POS completely dies at 11:00 AM?',
      creator: 'Both'
    },
    tacticalChecklist: [
      'Frame 0: Camera moving through a packed convention hall with red "NO INTERNET CONNECTION" overlay on an iPad.',
      'Second 5: Show vendors scrambling with pen and paper, losing card tracking and making math errors.',
      'Second 18: Demo Aeethod offline mode scanning barcodes and completing transactions with zero Wi-Fi.',
      'Ending: "Never lose a trade show sale to dropped Wi-Fi."'
    ]
  },
  {
    id: 'ws-distributor-traps',
    niche: 'Distributor Allocation Ratios & The Sealed Working Capital Trap',
    category: 'Economics & Operations',
    viralMultiplier: '5x DM Share',
    primaryFormat: '40s Whiteboard Financial Ledger Teardown',
    redOceanTrap: {
      title: 'Influencers Whining "Distributors Are Scammers"',
      flaw: 'Sensationalizing distributor drama without explaining wholesale economics or working capital mechanics.',
      consequence: 'Zero business insight; leaves opening store owners unprepared for wholesale ordering reality.'
    },
    blueOceanWedge: {
      title: 'The Wholesale Distributor Ratio Autopsy',
      advantage: 'Demystifying wholesale allocation rules: How distributors tie tier allocations of hot sets (151, Team Rocket) to buying 40% dead stock (board games, miniatures). Showing how stores over-leverage cash on customer pre-orders and get crushed when distributor delivery delays happen. Demonstrating Aeethod\'s Pre-Order Allocation Modeler.',
      algorithmicMoat: 'Pure insider B2B commercial truth that establishes Aeethod as the trusted financial advisor to LGS owners.',
      exampleHook: 'Ordering $30,000 in sealed product does NOT mean you\'re getting 30 cases. Here is the distributor ratio they won\'t tell you.',
      creator: 'Sadid'
    },
    tacticalChecklist: [
      'Frame 0: Draw a wholesale distributor invoice on whiteboard showing $30,000 total order vs $6,200 actual allocation.',
      'Second 5: Explain the tie-in ratio and why stores go cash-poor right before major set releases.',
      'Second 18: Show how Aeethod models cash flow and pre-order limits to protect store liquidity.',
      'Ending: Seamless loop into opening hook.'
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
