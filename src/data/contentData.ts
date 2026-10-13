export type ContentSpaceId = 'space_01' | 'space_02' | 'space_03' | 'space_04' | 'space_05';

export type ContentTopic =
  | 'Pokémon Discoveries, Culture & Nostalgia'
  | 'TCG Economics & Market Psychology'
  | 'TCG Scams, Fakes & Market Traps'
  | 'TCG Store Business Breakdown'
  | 'Building Aeethod in Public + Store UX';

// Legacy topic names for backwards compatibility
export type LegacyTopic =
  | 'Shop Problem'
  | 'Education for Resellers and Shop Owners'
  | 'Controversy and Opinion'
  | 'Release Content'
  | 'Price Analysis and Prediction';

export type AnyTopic = ContentTopic | LegacyTopic;

export type ReelFormat =
  | 'Price Breakdown and Analysis'
  | 'Looping'
  | 'Myth Blast'
  | 'Prevention'
  | 'Teardown and Challenge';

export type VideoStatus = 'Scripting' | 'Recording' | 'Editing' | 'Scheduled' | 'Uploaded';

export interface ContentCategory {
  id: string; // '01', '02', etc.
  code: string; // 'S01-01', 'S02-03', etc.
  title: string;
  description: string;
}

export interface ContentSpaceDefinition {
  id: ContentTopic;
  spaceNum: '01' | '02' | '03' | '04' | '05';
  title: string;
  shortTitle: string;
  stage: 'TOF • REACH' | 'MOF • TRUST' | 'TOF + MOF' | 'MOF + BOF' | 'BOF • CONVERSION';
  funnelTier: 'TOF' | 'MOF' | 'BOF' | 'TOF + MOF' | 'MOF + BOF';
  goal: string;
  badgeColor: string;
  badgeStyle: { dot: string; text: string; bg: string; border: string };
  testMixReels: number; // Mix count in the first 10 reels (4, 2, 2, 1, 1)
  targetAudience: string;
  description: string;
  categories: ContentCategory[];
  angleExamples: string[];
  recommendedHookKeywords: string[];
}

export type TopicDefinition = ContentSpaceDefinition;

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
  category?: string; // One of the 38 categories (e.g. '01 Hidden Product Details')
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
  averageWatchPercentage?: number;
  notes?: string;
}

// -----------------------------------------------------------------------------
// AEETHOD INSTAGRAM CONTENT STRATEGY ARCHITECTURE (FROM CONTENT MAP)
// 5 Spaces • 38 Categories • One Connected Strategy
// -----------------------------------------------------------------------------

export const STRATEGY_BIG_PICTURE = {
  title: 'Instagram Content Map',
  subtitle: '5 spaces • 38 categories • one connected strategy',
  stages: [
    {
      id: 'TOF',
      label: 'TOF — GET DISCOVERED',
      badgeColor: 'bg-purple-500/10 text-purple-400 border border-purple-500/25',
      summary: 'Pokémon discoveries + selected scam/fake stories',
      role: 'Earn top-of-funnel reach & attention'
    },
    {
      id: 'MOF',
      label: 'MOF — EARN TRUST',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25',
      summary: 'Market psychology + collector education + store insights',
      role: 'Build credibility & evidence-based buyer education'
    },
    {
      id: 'BOF',
      label: 'BOF — CONNECT TO AEETHOD',
      badgeColor: 'bg-sky-500/10 text-sky-400 border border-sky-500/25',
      summary: 'Store workflows + real product-building updates',
      role: 'Connect store problems to Aeethod product solutions'
    }
  ],
  flowSteps: [
    {
      step: '01 · Discover',
      text: 'Pokémon stories earn attention.',
      spaceRef: 'Space 01',
      color: 'border-purple-500/30 bg-purple-500/5 text-purple-400'
    },
    {
      step: '02 + 03 · Educate',
      text: 'Market insights and buyer protection build trust.',
      spaceRef: 'Space 02 & 03',
      color: 'border-pink-500/30 bg-pink-500/5 text-pink-400'
    },
    {
      step: '04 + 05 · Build',
      text: 'Store problems connect relevant viewers to Aeethod.',
      spaceRef: 'Space 04 & 05',
      color: 'border-sky-500/30 bg-sky-500/5 text-sky-400'
    }
  ],
  first10Mix: [
    {
      spaceId: 'Pokémon Discoveries, Culture & Nostalgia' as ContentTopic,
      label: 'Pokémon discoveries',
      count: 4,
      spaceNum: '01',
      badge: 'bg-purple-500/15 text-purple-400 border-purple-500/30'
    },
    {
      spaceId: 'TCG Scams, Fakes & Market Traps' as ContentTopic,
      label: 'Scams & fakes',
      count: 2,
      spaceNum: '03',
      badge: 'bg-rose-500/15 text-rose-400 border-rose-500/30'
    },
    {
      spaceId: 'TCG Economics & Market Psychology' as ContentTopic,
      label: 'TCG economics',
      count: 2,
      spaceNum: '02',
      badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
    },
    {
      spaceId: 'TCG Store Business Breakdown' as ContentTopic,
      label: 'Store business',
      count: 1,
      spaceNum: '04',
      badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30'
    },
    {
      spaceId: 'Building Aeethod in Public + Store UX' as ContentTopic,
      label: 'Aeethod build',
      count: 1,
      spaceNum: '05',
      badge: 'bg-sky-500/15 text-sky-400 border-sky-500/30'
    }
  ],
  trackedMetrics: [
    'Reach',
    'Average Watch Time',
    'Sends / DM Shares',
    'Saves / Bookmarks',
    'Profile Visits',
    'Follows',
    'Relevant Store-Owner Conversations'
  ],
  editorialGuideline:
    'This is a starting experiment, not a guaranteed algorithm formula. Keep factual claims sourced and label rumors clearly.'
};

// -----------------------------------------------------------------------------
// THE 5 CORE SPACES & 38 CATEGORIES DEFINITIONS
// -----------------------------------------------------------------------------

export const CONTENT_SPACES: Record<ContentTopic, ContentSpaceDefinition> = {
  'Pokémon Discoveries, Culture & Nostalgia': {
    id: 'Pokémon Discoveries, Culture & Nostalgia',
    spaceNum: '01',
    title: 'Pokémon Discoveries, Culture & Nostalgia',
    shortTitle: 'Pokémon Discoveries',
    stage: 'TOF • REACH',
    funnelTier: 'TOF',
    goal: 'Attract new viewers through surprising, visual stories.',
    badgeColor: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
    badgeStyle: {
      dot: 'bg-purple-500',
      text: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-500/10',
      border: 'border-purple-200 dark:border-purple-500/20'
    },
    testMixReels: 4,
    targetAudience: 'Broad Pokémon Fans, Vintage Enthusiasts, Nostalgia Collectors, New TCG Players',
    description: 'Top-of-funnel reach engine. Attracts massive casual and nostalgic viewers through overlooked details, historical mysteries, and visual reveals before introducing TCG economics.',
    categories: [
      {
        id: '01',
        code: 'S01-01',
        title: 'Hidden Product Details',
        description: 'Overlooked details, connected artwork, unusual packaging.'
      },
      {
        id: '02',
        code: 'S01-02',
        title: 'Unusual Releases & Promos',
        description: 'Exclusive cards, special distribution, unusual products.'
      },
      {
        id: '03',
        code: 'S01-03',
        title: 'Forgotten Pokémon History',
        description: 'Old promotions, discontinued products, nostalgic stories.'
      },
      {
        id: '04',
        code: 'S01-04',
        title: 'First-Time-Ever Moments',
        description: 'Genuinely unusual milestones in Pokémon TCG.'
      },
      {
        id: '05',
        code: 'S01-05',
        title: 'Set & Artwork Mysteries',
        description: 'Visual clues, illustration connections, design choices.'
      },
      {
        id: '06',
        code: 'S01-06',
        title: 'News, Leaks & Future Releases',
        description: 'Official announcements and clearly labeled rumors.'
      },
      {
        id: '07',
        code: 'S01-07',
        title: 'Unexpected Pokémon Stories',
        description: 'Surprising facts with a strong visual reveal.'
      }
    ],
    angleExamples: [
      'The connected illustrator easter egg hidden across 3 different 2004 expansions',
      'The rarest Pokémon promo given only to Tokyo train commuters in 2002',
      'Why Nintendo discontinued this specific booster pack tear-strip in 2007'
    ],
    recommendedHookKeywords: ['Hidden detail', 'Never noticed', 'Discontinued promo', 'Unusual release', 'First time ever']
  },

  'TCG Economics & Market Psychology': {
    id: 'TCG Economics & Market Psychology',
    spaceNum: '02',
    title: 'TCG Economics & Market Psychology',
    shortTitle: 'TCG Economics',
    stage: 'MOF • TRUST',
    funnelTier: 'MOF',
    goal: 'Build credibility by explaining prices, supply, and collector decisions.',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    badgeStyle: {
      dot: 'bg-emerald-500',
      text: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-500/10',
      border: 'border-emerald-200 dark:border-emerald-500/20'
    },
    testMixReels: 2,
    targetAudience: 'TCG Investors, Singles Speculators, Resellers, Competitive Players, Serious Collectors',
    description: 'Middle-of-funnel trust builder. Establishes deep analytical authority by explaining price crash mechanics, reprint schedules, expected value odds, and collector herd behavior.',
    categories: [
      {
        id: '01',
        code: 'S02-01',
        title: 'Price Crash Anatomy',
        description: 'Why a specific card or set lost value.'
      },
      {
        id: '02',
        code: 'S02-02',
        title: 'Reprint & Supply Analysis',
        description: 'How new supply and reprint expectations affect the market.'
      },
      {
        id: '03',
        code: 'S02-03',
        title: 'FOMO & Collector Psychology',
        description: 'Hype, panic buying, and herd behavior.'
      },
      {
        id: '04',
        code: 'S02-04',
        title: 'Pull-Rate Math & Expected Value',
        description: 'Odds, probabilities, and the cost of chasing a card.'
      },
      {
        id: '05',
        code: 'S02-05',
        title: 'Real Profit & Cost Breakdown',
        description: 'Fees, shipping, grading costs, break-even prices.'
      },
      {
        id: '06',
        code: 'S02-06',
        title: 'Scalper Economics',
        description: 'Margins, availability, and resale incentives.'
      },
      {
        id: '07',
        code: 'S02-07',
        title: 'Buyer vs. Seller Decisions',
        description: 'How market participants react to the same event.'
      }
    ],
    angleExamples: [
      'Anatomy of a $600 card crash: why this chase single dropped 70% in 90 days',
      'The mathematical Expected Value of opening a modern booster box vs buying singles',
      'Why reprint rumors cause sellers to panic dump before official distributor confirmation'
    ],
    recommendedHookKeywords: ['Price crash', 'Reprint dump', 'Expected value', 'Pull rate math', 'True profit']
  },

  'TCG Scams, Fakes & Market Traps': {
    id: 'TCG Scams, Fakes & Market Traps',
    spaceNum: '03',
    title: 'TCG Scams, Fakes & Market Traps',
    shortTitle: 'Scams & Fakes',
    stage: 'TOF + MOF',
    funnelTier: 'TOF + MOF',
    goal: 'Earn shares and saves with evidence-based buyer education.',
    badgeColor: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
    badgeStyle: {
      dot: 'bg-rose-500',
      text: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-500/10',
      border: 'border-rose-200 dark:border-rose-500/20'
    },
    testMixReels: 2,
    targetAudience: 'Every Card Buyer, Marketplace Shoppers, Parents, Novice Collectors, Shop Clerks',
    description: 'High-utility viral share magnet. Generates massive bookmarks and DM shares by equipping buyers with forensic inspection techniques, reseal spot-checks, and dispute playbooks.',
    categories: [
      {
        id: '01',
        code: 'S03-01',
        title: 'Fake Card Spot Checks',
        description: 'Visible differences backed by reliable evidence.'
      },
      {
        id: '02',
        code: 'S03-02',
        title: 'Resealed Product Investigations',
        description: 'Warning signs and what they do—or do not—prove.'
      },
      {
        id: '03',
        code: 'S03-03',
        title: 'Misleading Listing Decodes',
        description: 'Confusing titles, photos, conditions, and versions.'
      },
      {
        id: '04',
        code: 'S03-04',
        title: 'Marketplace Scam Cases',
        description: 'Documented incidents and lessons buyers can learn.'
      },
      {
        id: '05',
        code: 'S03-05',
        title: 'Preorder & Hype Traps',
        description: 'Risks of paying inflated prices before release.'
      },
      {
        id: '06',
        code: 'S03-06',
        title: 'Buyer Protection Playbook',
        description: 'Documentation, dispute steps, refund options.'
      },
      {
        id: '07',
        code: 'S03-07',
        title: 'Authenticity & Grading Mistakes',
        description: 'Common identification errors and how to avoid them.'
      }
    ],
    angleExamples: [
      'Can you spot the counterfeit holo foil pattern under 10x magnification?',
      'The 3 warning signs of a resealed Japanese booster box that eBay authenticators missed',
      'The step-by-step documentation you need to win a chargeback against fake singles'
    ],
    recommendedHookKeywords: ['Super fake', 'Resealed box', 'Listing trap', 'Buyer protection', 'Grading error']
  },

  'TCG Store Business Breakdown': {
    id: 'TCG Store Business Breakdown',
    spaceNum: '04',
    title: 'TCG Store Business Breakdown',
    shortTitle: 'Store Business',
    stage: 'MOF + BOF',
    funnelTier: 'MOF + BOF',
    goal: 'Connect collector interest to real card-shop operations.',
    badgeColor: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    badgeStyle: {
      dot: 'bg-amber-500',
      text: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-500/10',
      border: 'border-amber-200 dark:border-amber-500/20'
    },
    testMixReels: 1,
    targetAudience: 'Local Game Store (LGS) Owners, Retail Managers, Trade Counter Clerks, Shopify Merchants',
    description: 'Retail operational reality bridge. Explores multi-channel sync bugs, inventory variant fatigue, overhead breakdown, and distribution allocation realities.',
    categories: [
      {
        id: '01',
        code: 'S04-01',
        title: 'Inventory & Variant Complexity',
        description: 'Printings, conditions, languages, and versions.'
      },
      {
        id: '02',
        code: 'S04-02',
        title: 'Marketplace Sync Problems',
        description: 'Overselling, outdated stock, and manual updates.'
      },
      {
        id: '03',
        code: 'S03-03',
        title: 'Store Margin Breakdown',
        description: 'Fees, labor, fulfillment, and actual profit.'
      },
      {
        id: '04',
        code: 'S04-04',
        title: 'Shopify TCG Store Challenges',
        description: 'Product organization, catalog complexity, usability.'
      },
      {
        id: '05',
        code: 'S04-05',
        title: 'Inventory Management Workflows',
        description: 'Scanning, identification, pricing, and listing.'
      },
      {
        id: '06',
        code: 'S04-06',
        title: 'Distribution & Stock Availability',
        description: 'How sourcing and allocation affect shops.'
      },
      {
        id: '07',
        code: 'S04-07',
        title: 'The Real Cost of Running a Card Shop',
        description: 'Time, software, operational mistakes, overhead.'
      }
    ],
    angleExamples: [
      'The double-sale disaster: selling the same $400 slab in-store and on eBay at the exact same minute',
      'Why managing 50,000 card variants on standard Shopify breaks your checkout',
      'The real cashflow cost of trade-in weekends: gross revenue vs true cash profit'
    ],
    recommendedHookKeywords: ['Double sold', 'Sync latency', 'Trade counter', 'Clerk burnout', 'Store margin']
  },

  'Building Aeethod in Public + Store UX': {
    id: 'Building Aeethod in Public + Store UX',
    spaceNum: '05',
    title: 'Building Aeethod in Public + Store UX',
    shortTitle: 'Aeethod Build & UX',
    stage: 'BOF • CONVERSION',
    funnelTier: 'BOF',
    goal: 'Show real product-building work and earn founder/developer credibility.',
    badgeColor: 'bg-sky-500/20 text-sky-400 border border-sky-500/30',
    badgeStyle: {
      dot: 'bg-sky-500',
      text: 'text-sky-600 dark:text-sky-400',
      bg: 'bg-sky-50 dark:bg-sky-500/10',
      border: 'border-sky-200 dark:border-sky-500/20'
    },
    testMixReels: 1,
    targetAudience: 'Store Owners looking for solutions, B2B SaaS Founders, Developers, Early Adopters',
    description: 'Bottom-of-funnel conversion powerhouse. Showcases actual software engineering, UI fixes, seller critiques, and product progression, driving qualified inbound trial requests.',
    categories: [
      {
        id: '01',
        code: 'S05-01',
        title: 'UI Fix in 60 Seconds',
        description: 'Demonstrate a real usability improvement.'
      },
      {
        id: '02',
        code: 'S05-02',
        title: 'Store Roast & Rebuild',
        description: 'Critique a storefront constructively and show a redesign.'
      },
      {
        id: '03',
        code: 'S05-03',
        title: 'Problem to Prototype',
        description: 'Connect a real seller problem to your design process.'
      },
      {
        id: '04',
        code: 'S05-04',
        title: 'Frontend & Product Decisions',
        description: 'Explain why a workflow was designed a certain way.'
      },
      {
        id: '05',
        code: 'S05-05',
        title: 'Building Inventory Workflows',
        description: 'Document actual scanning, variant, or inventory implementation.'
      },
      {
        id: '06',
        code: 'S05-06',
        title: 'Failed Builds & Lessons',
        description: 'Share genuine mistakes, debugging, and what changed.'
      },
      {
        id: '07',
        code: 'S05-07',
        title: 'Feature Prioritization',
        description: 'Explain what you are building first and why.'
      },
      {
        id: '08',
        code: 'S05-08',
        title: 'User Feedback & Validation',
        description: 'Show how real conversations influence the product.'
      },
      {
        id: '09',
        code: 'S05-09',
        title: 'Before-and-After UX',
        description: 'Compare a starting point with a working improvement.'
      },
      {
        id: '10',
        code: 'S05-10',
        title: 'Aeethod Progress Diary',
        description: 'Share milestones, prototypes, challenges, honest updates.'
      }
    ],
    angleExamples: [
      'Refactoring a card trade-in modal from 7 clicks down to 1 keyboard shortcut',
      'Roasting a card shop’s Shopify mobile UX: here is how to double mobile conversions',
      'Why we rewrote our inventory sync engine in Rust for 180ms multi-channel updates'
    ],
    recommendedHookKeywords: ['UI Fix', 'Store roast', 'Prototype demo', 'Before and after', 'Progress diary']
  }
};

// Backwards-compatible map
export const TOPIC_DEFINITIONS: Record<string, ContentSpaceDefinition> = {
  ...CONTENT_SPACES,
  // Mapping legacy topics to their modern spaces
  'Shop Problem': CONTENT_SPACES['TCG Store Business Breakdown'],
  'Education for Resellers and Shop Owners': CONTENT_SPACES['TCG Economics & Market Psychology'],
  'Controversy and Opinion': CONTENT_SPACES['TCG Scams, Fakes & Market Traps'],
  'Release Content': CONTENT_SPACES['Pokémon Discoveries, Culture & Nostalgia'],
  'Price Analysis and Prediction': CONTENT_SPACES['TCG Economics & Market Psychology']
};

export const SPACES_LIST: ContentTopic[] = [
  'Pokémon Discoveries, Culture & Nostalgia',
  'TCG Economics & Market Psychology',
  'TCG Scams, Fakes & Market Traps',
  'TCG Store Business Breakdown',
  'Building Aeethod in Public + Store UX'
];

export function normalizeTopic(topic: string): ContentTopic {
  if (topic === 'Shop Problem') return 'TCG Store Business Breakdown';
  if (topic === 'Education for Resellers and Shop Owners') return 'TCG Economics & Market Psychology';
  if (topic === 'Controversy and Opinion') return 'TCG Scams, Fakes & Market Traps';
  if (topic === 'Release Content') return 'Pokémon Discoveries, Culture & Nostalgia';
  if (topic === 'Price Analysis and Prediction') return 'TCG Economics & Market Psychology';
  if (SPACES_LIST.includes(topic as ContentTopic)) return topic as ContentTopic;
  return 'Pokémon Discoveries, Culture & Nostalgia';
}

// -----------------------------------------------------------------------------
// REEL FORMATS DEFINITIONS
// -----------------------------------------------------------------------------

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

// -----------------------------------------------------------------------------
// INITIAL REEL RECORDS ORGANIZED BY SPACE & CATEGORY
// -----------------------------------------------------------------------------

export const INITIAL_VIDEO_RECORDS: VideoRecord[] = [
  // Sadid Videos
  {
    id: 'sadid-1',
    creator: 'Sadid',
    title: 'Where your $100 card sale actually goes (The 10.75% marketplace trap)',
    topic: 'TCG Economics & Market Psychology',
    category: '05 Real Profit & Cost Breakdown',
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
    id: 'sadid-2',
    creator: 'Sadid',
    title: 'Why every card shop still tolerates 45-second inventory lag',
    topic: 'Building Aeethod in Public + Store UX',
    category: '05 Building Inventory Workflows',
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
    views: 12500,
    likes: 980,
    comments: 140,
    shares: 380,
    saves: 420,
    notes: 'Direct demonstration of zero-latency sync engine.'
  },
  {
    id: 'sadid-3',
    creator: 'Sadid',
    title: 'Why modern sealed Pokémon is dipping while vintage keeps climbing',
    topic: 'TCG Economics & Market Psychology',
    category: '02 Reprint & Supply Analysis',
    format: 'Myth Blast',
    status: 'Recording',
    hook: 'Stop treating every modern booster box like a guaranteed retirement fund.',
    notes: 'Uses print run data and 30th celebration supply adjustments.'
  },
  {
    id: 'sadid-4',
    creator: 'Sadid',
    title: 'TCGplayer Direct 50% micro-card fee: Are sellers working for free?',
    topic: 'TCG Economics & Market Psychology',
    category: '05 Real Profit & Cost Breakdown',
    format: 'Price Breakdown and Analysis',
    status: 'Editing',
    hook: 'If you sell singles under $2.49, you are subsidizing the marketplace.',
    notes: 'Deep dive on June 18 fee update.'
  },
  {
    id: 'sadid-5',
    creator: 'Sadid',
    title: '3 inventory calculations every card shop must run before holiday restocks',
    topic: 'TCG Store Business Breakdown',
    category: '01 Inventory & Variant Complexity',
    format: 'Prevention',
    status: 'Scripting',
    hook: 'Do NOT order your Q4 sealed inventory until you run these 3 numbers.',
    notes: 'Focus on inventory turnover vs tied-up working capital.'
  },
  {
    id: 'sadid-6',
    creator: 'Sadid',
    title: 'Why our card store values customer community over profit margins',
    topic: 'TCG Store Business Breakdown',
    category: '03 Store Margin Breakdown',
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
    id: 'sadid-7',
    creator: 'Sadid',
    title: 'I audited an $18,000 card shop cash-out: Here is what they actually netted',
    topic: 'TCG Store Business Breakdown',
    category: '03 Store Margin Breakdown',
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

  // Anika Videos (@the_tcg_baddie) - Pulled live from Instagram & Strategic Spaces
  {
    id: 'anika-1',
    creator: 'Anika',
    title: 'A $8.4M Pokémon card… but was that really its market value?',
    topic: 'TCG Economics & Market Psychology',
    category: '05 Real Profit & Cost Breakdown',
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
    likes: 6,
    comments: 0,
    notes: 'Market value teardown of Illustrator Pikachu sale. Analyzes auction liquidity vs repeatable market price. Live URL: https://www.instagram.com/reel/DeMtsSUB75q/'
  },
  {
    id: 'anika-2',
    creator: 'Anika',
    title: '10 tins, 2 hidden artworks!? Would you collect all 10?',
    topic: 'Pokémon Discoveries, Culture & Nostalgia',
    category: '01 Hidden Product Details',
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
    likes: 36,
    comments: 0,
    notes: '30th Anniversary tin unboxing with hidden panoramic art. Live URL: https://www.instagram.com/reel/DeHibRnBnv3/'
  },
  {
    id: 'anika-3',
    creator: 'Anika',
    title: 'Pokémon is reportedly making its FIRST Valentine’s Day TCG box and it turns into a mailbox?!',
    topic: 'Pokémon Discoveries, Culture & Nostalgia',
    category: '06 News, Leaks & Future Releases',
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
    likes: 7,
    comments: 0,
    notes: 'Valentine’s Day specialty product reveal and packaging novelty analysis. Live URL: https://www.instagram.com/reel/DeChasPppnW/'
  },
  {
    id: 'anika-4',
    creator: 'Anika',
    title: 'Pokémon is taking anti-scalping VERY seriously.',
    topic: 'TCG Scams, Fakes & Market Traps',
    category: '06 Buyer Protection Playbook',
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
    likes: 8,
    comments: 0,
    notes: 'Retail anti-scalping distribution rules and shrink-wrap cutting debate. Live URL: https://www.instagram.com/reel/Dd_y4Z_BZU7/'
  },
  {
    id: 'anika-5',
    creator: 'Anika',
    title: 'Why are TCG stores still doing this manually?',
    topic: 'TCG Store Business Breakdown',
    category: '05 Inventory Management Workflows',
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
    likes: 15,
    comments: 2,
    notes: 'High audience resonance on retail floor trade-in bottlenecks and automation. Live URL: https://www.instagram.com/reel/Dd9PdPjBmA7/'
  },
  {
    id: 'anika-6',
    creator: 'Anika',
    title: 'I found a gap in TCG software. So I’m building it.',
    topic: 'Building Aeethod in Public + Store UX',
    category: '04 Why Aeethod Exists',
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
    likes: 14,
    comments: 6,
    notes: 'Foundational SaaS manifesto reel for Aeethod OS. Highest comments & direct founder engagement. Live URL: https://www.instagram.com/reel/Dd6tPEFB5HH/'
  },
  {
    id: 'anika-7',
    creator: 'Anika',
    title: 'Just casually organizing random cards behind the counter today',
    topic: 'TCG Store Business Breakdown',
    category: '07 The Real Cost of Running a Card Shop',
    format: 'Myth Blast',
    status: 'Uploaded',
    hook: 'Hey guys, just doing some basic organizing behind the register today.',
    script: `Hey guys, just doing some basic organizing behind the register today. Sorting commons into white boxes. Nothing crazy happening, just another shift. Let me know in the comments how your day is going.`,
    publishDate: '2026-09-12',
    views: 2100,
    likes: 110,
    comments: 12,
    shares: 18,
    saves: 22,
    averageWatchPercentage: 38,
    notes: 'Stalled: Zero tension, no hook conflict or inspection element. 64% swipe-away in first 3s.'
  },
  // Additional Space 01 & Space 05 Discovery & Build Videos to round out the 10-mix test
  {
    id: 'poke-disc-1',
    creator: 'Anika',
    title: 'The connected illustrator easter egg hidden across 3 different 2004 expansions',
    topic: 'Pokémon Discoveries, Culture & Nostalgia',
    category: '01 Hidden Product Details',
    format: 'Looping',
    status: 'Scripting',
    hook: 'Nobody realized that these 3 cards from 2004 tell one continuous story.',
    notes: 'Space 01 Category 01 · Overlooked details, connected artwork.'
  },
  {
    id: 'poke-disc-2',
    creator: 'Sadid',
    title: 'The rarest Pokémon card given only to Tokyo train commuters in 2002',
    topic: 'Pokémon Discoveries, Culture & Nostalgia',
    category: '02 Unusual Releases & Promos',
    format: 'Myth Blast',
    status: 'Recording',
    hook: 'This card was never sold in stores or booster packs. You had to ride a Tokyo train in 2002 to get it.',
    notes: 'Space 01 Category 02 · Exclusive cards, special distribution.'
  },
  {
    id: 'aeethod-ux-1',
    creator: 'Sadid',
    title: 'Refactoring card shop trade-in intake from 7 clicks to 1 keystroke',
    topic: 'Building Aeethod in Public + Store UX',
    category: '01 UI Fix in 60 Seconds',
    format: 'Teardown and Challenge',
    status: 'Editing',
    hook: 'Here is how we saved retail card shop clerks 45 minutes of sorting per shift with one UI fix.',
    notes: 'Space 05 Category 01 · UI Fix in 60 Seconds.'
  }
];
