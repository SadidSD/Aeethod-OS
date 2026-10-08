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
  comments?: number;
  shares?: number;
  saves?: number;
  averageWatchPercentage?: number; // e.g. 125% means looped/re-watched
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
    comments: 215,
    shares: 480,
    saves: 890,
    averageWatchPercentage: 94,
    notes: 'Massive DM share rate among store partners and power sellers.'
  },
  {
    id: 'sadid-6',
    creator: 'Sadid',
    title: 'Why our card store values customer community over profit margins',
    topic: 'Shop Problem',
    format: 'Myth Blast',
    status: 'Uploaded',
    hook: 'Today I want to talk about why community matters more than money in our card shop.',
    script: `Today I want to talk about why community matters more than money in our card shop. When we started, we thought about numbers, but now we care about people. Make sure you stop by our store this weekend for open play.`,
    publishDate: '2026-09-15',
    views: 1650,
    likes: 95,
    comments: 8,
    shares: 12,
    saves: 14,
    averageWatchPercentage: 34,
    notes: 'Stalled: Generic slow opening without tension. 68% drop-off before second 3. Low share & save utility.'
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
  {
    id: 'sadid-7',
    creator: 'Sadid',
    title: 'I audited an $18,000 card shop cash-out: Here is what they actually netted',
    topic: 'Education for Resellers and Shop Owners',
    format: 'Price Breakdown and Analysis',
    status: 'Uploaded',
    hook: 'A store owner boasted about an $18,000 cash-out day. When we audited the receipts, the truth was brutal.',
    script: `[00:00 - 00:03] THE HOOK
A store owner boasted about an $18,000 cash-out day. When we audited the receipts, the truth was brutal.

[00:03 - 00:16] THE AUDIT
Here is where that $18,000 actually went:
- Wholesale inventory cost: $11,400 (63.3%)
- Merchant processing & terminal fees: $576
- Sales tax reserve: $1,440
- Store credit liability accrued: $2,100
- Staff commission & overtime: $650

[00:16 - 00:32] THE PROFIT REALITY
Gross register total: $18,000.
Real cash left for overhead & net margin: $1,834.
That is roughly 10.1% true net margin.

[00:32 - 00:48] THE LESSON
If you run your card shop on top-line vanity numbers, you will go bankrupt with full registers. Focus on gross margin return on investment (GMROI), not gross transaction volume.

[00:48 - 00:60] THE LOOP
Track your net retention every single evening... because an $18,000 cash-out day does NOT mean you made $18,000.`,
    publishDate: '2026-10-02',
    views: 62400,
    likes: 4890,
    comments: 512,
    shares: 3400,
    saves: 2890,
    averageWatchPercentage: 128,
    notes: 'Mega viral hit. Huge share velocity among store owners, GMROI debate in comments.'
  },

  // Anika Videos (@the_tcg_baddie) - Pulled live from Instagram
  {
    id: 'anika-1',
    creator: 'Anika',
    title: 'A $8.4M Pokémon card… but was that really its market value?',
    topic: 'Price Analysis and Prediction',
    format: 'Price Breakdown and Analysis',
    status: 'Uploaded',
    hook: 'A $8.4M Pokémon card… but was that really its market value?',
    script: `[00:00 - 00:03] THE HOOK (Direct to Camera)
A $8.4M Pokémon card… but was that really its market value?

[00:03 - 00:18] THE AUCTION ANATOMY
Everyone saw the headline for the PSA 10 Pikachu Illustrator sale. But when you look at the private transaction mechanics, the trade-in escrow, and the actual cash settlement, was it market value or an unprecedented brand PR event?

[00:18 - 00:38] THE REAL LIQUIDITY SPREAD
In high-end TCG, auction hammer prices do not equal daily liquidity. If you hold vintage grail slabs, you cannot cash out at public record high without absorbing a 25% auction house fee and a 6-month private treaty wait.

[00:38 - 00:52] THE TAKEAWAY
True market value is defined by repeatable bid-ask spread, not a one-off trophy auction.

[00:52 - 00:60] THE LOOP
Which is why whenever you see a record-shattering sale, always ask: was that really its market value?`,
    publishDate: '2026-10-07',
    views: 3120,
    likes: 6,
    comments: 0,
    shares: 48,
    saves: 72,
    averageWatchPercentage: 94,
    notes: 'Market value teardown of Illustrator Pikachu sale. Analyzes auction liquidity vs repeatable market price. Live URL: https://www.instagram.com/reel/DeMtsSUB75q/'
  },
  {
    id: 'anika-2',
    creator: 'Anika',
    title: '10 tins, 2 hidden artworks!? Would you collect all 10?',
    topic: 'Release Content',
    format: 'Looping',
    status: 'Uploaded',
    hook: '10 tins, 2 hidden artworks!? Would you collect all 10?',
    script: `[00:00 - 00:03] THE HOOK (Unboxing Case)
10 tins, 2 hidden artworks!? Would you collect all 10?

[00:03 - 00:18] THE PRODUCT REVEAL
Pokémon just dropped the 30th Anniversary mini tin collection, and the packaging hides a secret panoramic mural when you line up all 10 lids edge-to-edge.

[00:18 - 00:38] THE VARIANT HUNT
Two of these tins contain exclusive promo stamps that aren’t even highlighted on the outer cardboard wrap. Collectors are cracking cases just to verify the batch numbers.

[00:38 - 00:52] THE VERDICT
For sealed collectors, the full 10-tin display case holds a 40% premium over loose singles.

[00:52 - 00:60] THE LOOP
So before you rip these open, let me know: would you collect all 10?`,
    publishDate: '2026-10-05',
    views: 8940,
    likes: 36,
    comments: 0,
    shares: 182,
    saves: 240,
    averageWatchPercentage: 122,
    notes: 'Top performing reel. 30th Anniversary tin unboxing with hidden panoramic art. Live URL: https://www.instagram.com/reel/DeHibRnBnv3/'
  },
  {
    id: 'anika-3',
    creator: 'Anika',
    title: 'Pokémon is reportedly making its FIRST Valentine’s Day TCG box and it turns into a mailbox?!',
    topic: 'Release Content',
    format: 'Looping',
    status: 'Uploaded',
    hook: 'Pokémon is reportedly making its FIRST Valentine’s Day TCG box and it turns into a mailbox?!',
    script: `[00:00 - 00:03] THE HOOK
Pokémon is reportedly making its FIRST Valentine’s Day TCG box and it turns into a mailbox?!

[00:03 - 00:18] THE LEAK TEARDOWN
The upcoming holiday release features a buildable cardboard mailbox package with mini booster packs, stickers, and heart-stamped Pikachu promos designed for classroom exchanges.

[00:18 - 00:38] RETAIL IMPACT
Holiday seasonal boxes usually sit on shelves, but this novelty packaging is driving parent and casual collector preorders before distributor cutoffs.

[00:38 - 00:52] THE COLLECTOR PLAY
Keep one sealed. First-time seasonal gimmick boxes have historically appreciated once out of print.

[00:52 - 00:60] THE LOOP
Because who ever expected a Pokémon box that actually turns into a mailbox?!`,
    publishDate: '2026-10-03',
    views: 2850,
    likes: 7,
    comments: 0,
    shares: 54,
    saves: 68,
    averageWatchPercentage: 88,
    notes: 'Valentine’s Day specialty product reveal and packaging novelty analysis. Live URL: https://www.instagram.com/reel/DeChasPppnW/'
  },
  {
    id: 'anika-4',
    creator: 'Anika',
    title: 'Pokémon is taking anti-scalping VERY seriously.',
    topic: 'Controversy and Opinion',
    format: 'Prevention',
    status: 'Uploaded',
    hook: 'Pokémon is taking anti-scalping VERY seriously.',
    script: `[00:00 - 00:03] THE HOOK
Pokémon is taking anti-scalping VERY seriously.

[00:03 - 00:18] THE NEW RULES
The Pokémon Company just issued strict retailer allocation clauses: stores that sell above MSRP during release week or leak street dates risk losing their tier-1 direct distribution account.

[00:18 - 00:38] THE STORE COUNTERMEASURES
Card shops are now requiring customers to cut the plastic shrink wrap at the checkout register to prevent immediate bot-listing on resale apps.

[00:38 - 00:52] THE DEBATE
Does shrink-cutting protect real players, or does it hurt legitimate sealed investment collectors?

[00:52 - 00:60] THE LOOP
Either way, the message from the factory is loud and clear: they are taking anti-scalping very seriously.`,
    publishDate: '2026-10-02',
    views: 3410,
    likes: 8,
    comments: 0,
    shares: 68,
    saves: 85,
    averageWatchPercentage: 91,
    notes: 'Retail anti-scalping distribution rules and shrink-wrap cutting debate. Live URL: https://www.instagram.com/reel/Dd_y4Z_BZU7/'
  },
  {
    id: 'anika-5',
    creator: 'Anika',
    title: 'Why are TCG stores still doing this manually?',
    topic: 'Shop Problem',
    format: 'Myth Blast',
    status: 'Uploaded',
    hook: 'Why are TCG stores still doing this manually?',
    script: `[00:00 - 00:03] THE HOOK
Why are TCG stores still doing this manually?

[00:03 - 00:18] THE TRADE-IN BOTTLENECK
A customer brings in a 500-card trade binder. The clerk sits there typing every card name into a search bar, picking the foil type, matching the expansion code, and entering condition.

[00:18 - 00:38] THE HIDDEN PAYROLL COST
It takes 45 minutes for one customer. Meanwhile, three players waiting to buy tournament entries walk out because the line is frozen.

[00:38 - 00:52] THE MODERN SOLUTION
Optical AI scanning and zero-latency buylist sync identify 50 cards in 30 seconds. Stop burning staff hours on data entry.

[00:52 - 00:60] THE LOOP
Next time you see a 40-minute trade counter queue, ask yourself: why are TCG stores still doing this manually?`,
    publishDate: '2026-10-01',
    views: 5240,
    likes: 15,
    comments: 2,
    shares: 142,
    saves: 165,
    averageWatchPercentage: 104,
    notes: 'High audience resonance on retail floor trade-in bottlenecks and automation. Live URL: https://www.instagram.com/reel/Dd9PdPjBmA7/'
  },
  {
    id: 'anika-6',
    creator: 'Anika',
    title: 'I found a gap in TCG software. So I’m building it.',
    topic: 'Education for Resellers and Shop Owners',
    format: 'Price Breakdown and Analysis',
    status: 'Uploaded',
    hook: 'I found a gap in TCG software. So I’m building it.',
    script: `[00:00 - 00:03] THE HOOK
I found a gap in TCG software. So I’m building it.

[00:03 - 00:18] THE CORE PROBLEM
Existing POS systems charge up to 2.5% of gross store turnover just to sync your inventory with online channels. If your shop does $50,000 a month, you're paying $1,250 every month on top of monthly subscription fees.

[00:18 - 00:38] WHAT AEETHOD SOLVES
Flat $149/mo pricing. 0% GMV commission tax. Instant optical card scanning, local tournament queue management, and real-time buylist cash control in one unified OS.

[00:38 - 00:52] THE FOUNDER VISION
Card shops deserve specialized tools built by people who actually understand card inventory, not repurposed general retail software.

[00:52 - 00:60] THE LOOP
That’s why I saw the massive gap in TCG retail tech... and why we are building it.`,
    publishDate: '2026-09-30',
    views: 6180,
    likes: 14,
    comments: 6,
    shares: 195,
    saves: 210,
    averageWatchPercentage: 112,
    notes: 'Foundational SaaS manifesto reel for Aeethod OS. Highest comments & direct founder engagement. Live URL: https://www.instagram.com/reel/Dd6tPEFB5HH/'
  }
];
