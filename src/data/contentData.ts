export type ContentTopic =
  | 'Shop Problem'
  | 'Education for Resellers and Shop Owners'
  | 'Controversy and Opinion'
  | 'Release Content'
  | 'Price Analysis and Prediction';

export type ReelFormat =
  | 'Price Breakdown and Analysis'
  | 'Looping'
  | 'Myth Blast'
  | 'Prevention'
  | 'Teardown and Challenge';

export type VideoStatus = 'Scripting' | 'Recording' | 'Editing' | 'Scheduled' | 'Uploaded';

export interface TopicDefinition {
  id: ContentTopic;
  title: string;
  badgeColor: string;
  targetAudience: string;
  coreObjective: string;
  description: string;
  angleExamples: string[];
  recommendedHookKeywords: string[];
}

export interface FormatDefinition {
  id: ReelFormat;
  title: string;
  structure: string;
  retentionTrigger: string;
  idealLength: string;
  bestFitCreator: 'Sadid' | 'Anika' | 'Both';
  description: string;
  breakdownTimeline: { second: string; beat: string }[];
}

export interface VideoRecord {
  id: string;
  title: string;
  creator: 'Sadid' | 'Anika';
  topic: ContentTopic;
  format: ReelFormat;
  status: VideoStatus;
  hook: string;
  script?: string; // Full written video script & teleprompter text
  publishDate?: string;
  views?: number;
  likes?: number;
  shares?: number;
  saves?: number;
  notes?: string;
}

export const TOPIC_DEFINITIONS: Record<ContentTopic, TopicDefinition> = {
  'Shop Problem': {
    id: 'Shop Problem',
    title: 'Shop Problem',
    badgeColor: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
    targetAudience: 'Local Game Store (LGS) Owners, Retail Managers, Trade Counter Staff',
    coreObjective: 'Expose the daily operational bottlenecks, retail chaos, customer friction, and clerk burnout that drain profits.',
    description: 'Focuses on the ground-level reality of running a brick-and-mortar trading card shop. Uncovers high-friction scenarios such as tournament night trade-in lines, manual barcode chaos, inventory double-sales, and cashflow crunches during high-traffic weekends.',
    angleExamples: [
      'Saturday 8:30 PM: 35 players hit the trade-in counter with 1,500 unsorted cards',
      'The double-sale disaster: selling the same $400 slab in-store and on eBay at the exact same minute',
      'Why 60% of card shops fail within 2 years despite weekend sellouts'
    ],
    recommendedHookKeywords: ['Trade-in rush', 'Counter line', 'Double sold', 'Clerk panic', 'Allocation cut']
  },
  'Education for Resellers and Shop Owners': {
    id: 'Education for Resellers and Shop Owners',
    title: 'Education for Resellers and Shop Owners',
    badgeColor: 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30',
    targetAudience: 'TCG Power Sellers, eBay/TCGplayer Sellers, Flippers transitioning to full-time retail',
    coreObjective: 'Deliver actionable business systems, unit economic breakdowns, intake workflows, and inventory velocity playbooks.',
    description: 'High-utility masterclasses designed to generate saves and bookmarks. Teaches sellers how to stop running card businesses on emotion and spreadsheets, transitioning to margin-driven operations, automated repricing, condition-aware grading, and multi-channel synchronization.',
    angleExamples: [
      'The 70% buylist formula: how to calculate cash vs store credit margins without losing money',
      'How to organize 50,000 common cards in 2 hours instead of spending all weekend sorting',
      'The Singles vs Sealed liquidity ratio: why high-revenue shops still run out of payroll cash'
    ],
    recommendedHookKeywords: ['Buylist formula', 'Unit economics', 'Gross margin', 'Inventory turnover', 'True profit']
  },
  'Controversy and Opinion': {
    id: 'Controversy and Opinion',
    title: 'Controversy and Opinion',
    badgeColor: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    targetAudience: 'Collectors, Competitive Players, Store Owners, TCG Investors',
    coreObjective: 'Spark high comment velocity and algorithmic engagement by dismantling sacred cows and sharing contrarian takes.',
    description: 'Exploits the tension between collectors, retail stores, distributors, and mega-marketplaces. Focuses on hot-button debates like platform fee hikes, artificial scarcity, distributor favoritism, grading company backlogs, and scalper policies.',
    angleExamples: [
      'Unpopular opinion: Selling raw cards on TCGplayer Direct under $2.50 is working for free',
      'Distributor allocations are rigged against mom-and-pop stores: here is the proof',
      'Why card grading companies want you to crack and re-grade your 9.5 slabs'
    ],
    recommendedHookKeywords: ['Unpopular truth', 'Marketplace tax', 'Rigged allocation', 'Stop grading', 'The scam']
  },
  'Release Content': {
    id: 'Release Content',
    title: 'Release Content',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    targetAudience: 'Casual Collectors, Competitive Deck Builders, Store Owners preparing stock',
    coreObjective: 'Capture high-velocity search traffic and non-follower reach during set launch windows and prerelease events.',
    description: 'Timed around major set calendars (e.g. Pokémon 30th Celebration, Delta Reign, Lorcana Hyperia City, One Piece EB-05). Covers product allocations, unboxing chase pulls, singles supply shock, tournament staples, and release weekend retailer survival.',
    angleExamples: [
      'Delta Reign prerelease guide: which 3 cards will spike on day one',
      'We opened 100 packs of 30th Celebration so your store doesn’t have to',
      'What happens inside a card shop 12 hours before midnight release'
    ],
    recommendedHookKeywords: ['Prerelease night', 'Chase card pull', 'Set launch', 'Day 1 EV', 'Midnight release']
  },
  'Price Analysis and Prediction': {
    id: 'Price Analysis and Prediction',
    title: 'Price Analysis and Prediction',
    badgeColor: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30',
    targetAudience: 'TCG Investors, Singles Speculators, Resellers, Store Owners pricing display cases',
    coreObjective: 'Provide data-driven market tracking, print run evaluations, and price trajectory models that drive DM sends.',
    description: 'Analyzes why specific singles or sealed boxes are pumping or dumping. Connects secondary market spikes to tournament meta shifts, print run reprints, buyouts, and economic supply/demand curves.',
    angleExamples: [
      'Why modern sealed booster boxes are dropping 20% while vintage continues to climb',
      'Dragapult ex tournament dominance: tracking the 48-hour price spike across all variants',
      'Is the 30th Anniversary Mew ex a hold or an immediate sell?'
    ],
    recommendedHookKeywords: ['Price crash', 'Market pump', 'Reprint dump', 'EV calculation', 'Hold or sell']
  }
};

export const FORMAT_DEFINITIONS: Record<ReelFormat, FormatDefinition> = {
  'Price Breakdown and Analysis': {
    id: 'Price Breakdown and Analysis',
    title: 'Price Breakdown and Analysis',
    structure: 'Tension Proof Hook (0-3s) → Siphon Breakdown (4-12s) → Mathematical Truth (13-22s) → Strategic Takeaway (23-28s)',
    retentionTrigger: 'High DM Shares (Sends per Reach). Partners send it to co-owners saying "we need to see this".',
    idealLength: '20–30 Seconds',
    bestFitCreator: 'Sadid',
    description: 'A visual balance-sheet audit. Dismantles gross sales numbers to reveal hidden platform fees, shipping losses, labor overhead, and actual net profit on card transactions.',
    breakdownTimeline: [
      { second: '0:00 - 0:03', beat: 'Slams card slab/order slip on desk. "A $100 card sale does not make you $100."' },
      { second: '0:03 - 0:10', beat: 'Fast visual deductions: 10.75% commission, $3.20 Stripe fee, $4.85 bubble mailer.' },
      { second: '0:10 - 0:20', beat: 'Buylist cost deduction ($70). Reveals net residual margin: $11.20.' },
      { second: '0:20 - 0:28', beat: 'The moral: stop renting customer traffic; build your direct channel.' }
    ]
  },
  'Looping': {
    id: 'Looping',
    title: 'Looping',
    structure: 'Mystery Dilemma (0-2s) → Micro Inspection (3-12s) → Climax Verdict (13-18s) → Seamless Loop Hook (19-22s)',
    retentionTrigger: '100%+ Completion & Replay Velocity. Last sentence grammatically connects to first sentence.',
    idealLength: '15–22 Seconds',
    bestFitCreator: 'Anika',
    description: 'Fast-paced, suspenseful inspection or challenge designed so the viewer replays the video before realizing it ended, skyrocketing Instagram algorithm rank.',
    breakdownTimeline: [
      { second: '0:00 - 0:02', beat: '"A customer walked into the shop with this $500 vintage card, but..."' },
      { second: '0:02 - 0:09', beat: 'Passes light test, holo shine looks crisp, centering is clean...' },
      { second: '0:09 - 0:15', beat: 'Zoom under 30x loupe: micro-indentation on the back top border.' },
      { second: '0:15 - 0:22', beat: 'Verdict: cash offer drops to $160. "Would you take it, or are you the one who..." (Loops).' }
    ]
  },
  'Myth Blast': {
    id: 'Myth Blast',
    title: 'Myth Blast',
    structure: 'The Popular Lie (0-2s) → The Reality Check (3-10s) → Proof & Data (11-18s) → Actionable Rule (19-25s)',
    retentionTrigger: 'Controversy & Comment Velocity. Triggers debate between casuals and veteran sellers.',
    idealLength: '18–25 Seconds',
    bestFitCreator: 'Both',
    description: 'Attacks a widespread misconception in the TCG industry and replaces it with cold hard data or retailer experience.',
    breakdownTimeline: [
      { second: '0:00 - 0:02', beat: '"Stop believing that selling sealed booster boxes is how card shops survive."' },
      { second: '0:02 - 0:10', beat: 'Show invoice: distributor cost $92, retail price $110, shipping $12. Margin is $6.' },
      { second: '0:10 - 0:18', beat: 'Compare to singles: bought at 60%, sold at 100%. Singles pay the rent.' },
      { second: '0:18 - 0:25', beat: 'Rule of thumb: use sealed product for foot traffic, monetize with singles.' }
    ]
  },
  'Prevention': {
    id: 'Prevention',
    title: 'Prevention',
    structure: 'Warning Pattern Interrupt (0-3s) → Risk Scenario (4-10s) → 3-Step Safety Filter (11-24s) → Save Bookmark Prompt (25-30s)',
    retentionTrigger: 'Highest Saves per Reach. High practical utility bookmarking.',
    idealLength: '24–32 Seconds',
    bestFitCreator: 'Both',
    description: 'Urgent advice alerting sellers or collectors before they make an expensive mistake (e.g. buying counterfeit collections, overpaying on reprints, falling for middle-binder traps).',
    breakdownTimeline: [
      { second: '0:00 - 0:03', beat: '"Do NOT buy a single Pokémon collection this weekend until you do this."' },
      { second: '0:03 - 0:11', beat: 'The Middle-Card Trap: real cards on outer pages, super-fakes nested inside.' },
      { second: '0:11 - 0:22', beat: 'Filter 2: Check reprint calendar. Filter 3: calculate bulk liquidity ratio.' },
      { second: '0:22 - 0:28', beat: '"Bookmark this checklist before heading to your next trade-in night."' }
    ]
  },
  'Teardown and Challenge': {
    id: 'Teardown and Challenge',
    title: 'Teardown and Challenge',
    structure: 'Callout of Legacy Tool (0-3s) → Audit the Flaw (4-12s) → Superior Live Proof (13-20s) → Challenge Question (21-26s)',
    retentionTrigger: 'B2B Authority & Inbound DMs. Positions creator as the modern technical standard.',
    idealLength: '20–28 Seconds',
    bestFitCreator: 'Sadid',
    description: 'Audits a legacy workflow or competitor software (e.g. BinderPOS, manual Shopify inventory sheets) and demonstrates modern, zero-latency automation.',
    breakdownTimeline: [
      { second: '0:00 - 0:03', beat: '"Why does every card shop in America still tolerate a 45-second inventory sync delay?"' },
      { second: '0:03 - 0:11', beat: 'Explain the double-sale horror story: card sells in store, someone buys on eBay before sync.' },
      { second: '0:11 - 0:19', beat: 'Live demo: barcode scan at register decrements eBay, website, and POS in 180ms.' },
      { second: '0:19 - 0:26', beat: '"How much money did order cancellations cost your shop last quarter?"' }
    ]
  }
};

export const INITIAL_VIDEO_RECORDS: VideoRecord[] = [
  // Sadid Videos
  {
    id: 'sadid-1',
    creator: 'Sadid',
    title: 'Where your $100 card sale actually goes (The 10.75% marketplace trap)',
    topic: 'Education for Resellers and Shop Owners',
    format: 'Price Breakdown and Analysis',
    status: 'Uploaded',
    hook: 'Selling a $100 card on a marketplace does NOT give you $100 in the bank.',
    script: `[00:00 - 00:03] THE HOOK (Direct to Camera, Slapping a $100 bill on the desk)
Selling a $100 card on a marketplace does NOT give you $100 in the bank. In fact, you'll be lucky to keep $72.

[00:03 - 00:18] THE SPREADSHEET TEARDOWN (B-Roll: Receipt breakdown on screen)
Here is the exact math the platforms don't want you to calculate:
- Platform transaction fee: 12.75% ($12.75)
- Payment processing fee: 2.9% + 30¢ ($3.20)
- Tracked bubble mailer & top-loader: $4.85
- Return reserve / lost package risk: 2.5% ($2.50)
- Buylist acquisition cost (assuming you bought it at 50% cash): $50.00

[00:18 - 00:38] THE OPERATIONAL TRUTH (Looking right into lens)
Your gross sale was $100.
Your direct marketplace deductions were $23.30.
After your $50 inventory intake cost, you took home exactly $26.70.
And that’s BEFORE paying your clerk, rent, and packaging labor.

[00:38 - 00:52] THE STRATEGY
The shops that actually get rich don't sell $100 singles on open marketplaces. They use their website, local tournaments, and POS buylist credit at 70% to recycle the cash three times over.

[00:52 - 00:60] THE LOOP
So stop celebrating $10,000 revenue months until you calculate your real take-home cash... because selling a $100 card does NOT give you $100 in the bank.`,
    publishDate: '2026-09-28',
    views: 18450,
    likes: 1240,
    shares: 480,
    saves: 890,
    notes: 'Massive DM share rate among store partners and power sellers.'
  },
  {
    id: 'sadid-2',
    creator: 'Sadid',
    title: 'Why every card shop still tolerates 45-second inventory lag',
    topic: 'Shop Problem',
    format: 'Teardown and Challenge',
    status: 'Scheduled',
    hook: 'Selling the same $300 card in-store and online at the exact same minute is a solvable bug.',
    script: `[00:00 - 00:04] THE HOOK (Holding up two identical slabs)
Selling the same $300 card in-store and on eBay at the exact same minute is NOT bad luck. It's an architecture failure.

[00:04 - 00:18] THE DOUBLE-SALE DISASTER (Split screen: POS register vs eBay Sold notification)
Imagine this: A customer is at your counter paying $300 for a Charizard VMAX Alt Art. 
At 2:14 PM, your clerk taps "Complete Sale".
At 2:14 PM, a buyer in Germany buys the exact same card on your eBay store because your sync webhook takes 45 seconds to update.

[00:18 - 00:36] THE REPERCUSSIONS
Now you have to cancel the eBay order.
eBay dings your seller rating.
The buyer leaves negative feedback.
And if you do this twice in a quarter, your search algorithm placement drops 40%.

[00:36 - 00:50] THE ZERO-LATENCY FIX (Showing terminal & distributed sync engine)
In modern engineering, 45-second polling is obsolete. 
By running an in-memory lock on the physical inventory ID the microsecond a clerk scans the barcode, the card is delisted across eBay, TCGplayer, and Shopify in under 80 milliseconds.

[00:50 - 00:60] THE LOOP
Fix your sync latency before you lose your top-rated seller badge... because double-selling a $300 card is a 100% solvable bug.`,
    publishDate: '2026-10-08',
    notes: 'Direct demonstration of zero-latency sync engine.'
  },
  {
    id: 'sadid-3',
    creator: 'Sadid',
    title: 'Why modern sealed Pokémon is dipping while vintage keeps climbing',
    topic: 'Price Analysis and Prediction',
    format: 'Myth Blast',
    status: 'Recording',
    hook: 'Stop treating every modern booster box like a guaranteed retirement fund.',
    notes: 'Uses print run data and 30th celebration supply adjustments.'
  },
  {
    id: 'sadid-4',
    creator: 'Sadid',
    title: 'TCGplayer Direct 50% micro-card fee: Are sellers working for free?',
    topic: 'Controversy and Opinion',
    format: 'Price Breakdown and Analysis',
    status: 'Editing',
    hook: 'If you sell singles under $2.49, you are subsidizing the marketplace.',
    notes: 'Deep dive on June 18 fee update.'
  },
  {
    id: 'sadid-5',
    creator: 'Sadid',
    title: '3 inventory calculations every card shop must run before holiday restocks',
    topic: 'Education for Resellers and Shop Owners',
    format: 'Prevention',
    status: 'Scripting',
    hook: 'Do NOT order your Q4 sealed inventory until you run these 3 numbers.',
    notes: 'Focus on inventory turnover vs tied-up working capital.'
  },

  // Anika Videos
  {
    id: 'anika-1',
    creator: 'Anika',
    title: 'Customer brought in a $500 vintage Charizard... but look at the back corner',
    topic: 'Shop Problem',
    format: 'Looping',
    status: 'Uploaded',
    hook: 'A customer brought in this vintage Charizard asking for cash, but one micro-flaw changed the offer.',
    script: `[00:00 - 00:03] THE HOOK (Close-up of Base Set Charizard under 10x jewelers loupe)
A customer brought in this vintage Charizard asking for cash, but one micro-flaw changed the offer.

[00:03 - 00:18] THE EXAMINATION (POV: Turning card under angled 5000K light)
At first glance from across the counter, the front looks clean. The holo foil has zero surface clouding, no silvering on the yellow border, and the centering is an easy 55/45.
He looked up TCGplayer market price and asked for 70% cash: roughly $280.

[00:18 - 00:38] THE MICRO-FLAW REVEAL (Macro zoom on top-right back edge)
Then I flipped it over.
Right here along the blue border edge—look at this tiny white hairline indent. That is not just edge whitening; that’s a minor binder ring compression ding that breached the blue ink layer.
To a novice, that’s "Near Mint with slight wear". To PSA or Beckett, that single compression takes this card from a PSA 8 down to a PSA 5.

[00:38 - 00:50] THE TRADE COUNTER RESOLUTION
A PSA 8 is worth $350. A PSA 5 is worth $160.
If I gave him $280 cash, my shop would have lost $120 the moment we listed it.

[00:50 - 00:60] THE LOOP
Always inspect the back before you hand over cash... which is why when a customer brought in this vintage Charizard, one micro-flaw changed the offer.`,
    publishDate: '2026-09-30',
    views: 34200,
    likes: 2890,
    shares: 1120,
    saves: 640,
    notes: 'High completion rate. Loops back to the opening statement.'
  },
  {
    id: 'anika-2',
    creator: 'Anika',
    title: 'Can you spot the Super Fake 30th Celebration Mew ex in 5 seconds?',
    topic: 'Education for Resellers and Shop Owners',
    format: 'Looping',
    status: 'Uploaded',
    hook: 'One of these is worth $800. The other came from an overseas counterfeit factory.',
    publishDate: '2026-10-03',
    views: 48900,
    likes: 4120,
    shares: 2100,
    saves: 1450,
    notes: 'Highest comment velocity. Viewers arguing over the holo pattern.'
  },
  {
    id: 'anika-3',
    creator: 'Anika',
    title: 'Delta Reign prerelease night: 3 cards every shop needs in stock',
    topic: 'Release Content',
    format: 'Prevention',
    status: 'Editing',
    hook: 'Do not head into Delta Reign prerelease weekend without checking these 3 staple singles.',
    publishDate: '2026-10-12',
    notes: 'Covers competitive deck staples.'
  },
  {
    id: 'anika-4',
    creator: 'Anika',
    title: 'Saturday night 8:30 PM: 30 tournament players rush the trade-in counter',
    topic: 'Shop Problem',
    format: 'Myth Blast',
    status: 'Recording',
    hook: 'People think working at a card shop is opening packs all day. Here is what Saturday night actually looks like.',
    script: `[00:00 - 00:03] THE HOOK (Handheld phone POV walking past a line of 25 players)
People think working at a card shop is opening packs all day. Here is what Saturday night actually looks like.

[00:03 - 00:18] THE SITUATION (Panning over 4 giant plastic tubs of unsorted foils)
It is 8:35 PM. Round 4 of the local modern tournament just ended.
I have twenty-two players standing at my trade-in counter, and every single one of them dumped three binders of trade bait onto the glass.
Closing time is supposed to be 9:00 PM.

[00:18 - 00:38] THE BOTTLE-NECK (Showing manual scanner typing)
Most card shops make clerks manually search every single card on a laptop.
Type the card name, select the expansion set, check if it's reverse holo or regular, check condition, enter price.
Doing that for 800 cards takes over three hours of unpaid overtime.

[00:38 - 00:52] THE TRANSFORMATION (Dropping a stack of 50 cards into the optical feeder)
Watch this: We put the whole 50-card stack into the feeder.
The cameras read both sides simultaneously, match the collector code against live buylist market prices, and spit out the exact trade receipt in 35 seconds.

[00:52 - 00:60] THE LOOP
The line is gone, the register balances out, and we actually get to go home on time... even though people still think working at a card shop is just opening packs all day.`,
    notes: 'Real shop POV with customer lines and sorting chaos.'
  },
  {
    id: 'anika-5',
    creator: 'Anika',
    title: 'Distributor allocation cuts: what owners do when promised 50 boxes and given 12',
    topic: 'Controversy and Opinion',
    format: 'Teardown and Challenge',
    status: 'Scripting',
    hook: 'Your local card shop did not hoard the new set. Their distributor just cut their allocation by 75%.',
    notes: 'Empathy bridge between store owners and frustrated collectors.'
  },
  {
    id: 'anika-6',
    creator: 'Anika',
    title: 'Dragapult ex tournament spike: why singles jumped 35% in 48 hours',
    topic: 'Price Analysis and Prediction',
    format: 'Price Breakdown and Analysis',
    status: 'Scripting',
    hook: 'If you sold your Dragapult ex singles on Friday, you left $40 on the table.',
    notes: 'Meta-to-pricing speed analysis.'
  }
];
