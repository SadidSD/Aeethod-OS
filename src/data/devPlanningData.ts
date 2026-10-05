export type DevStackLayer = 'UI/UX' | 'Frontend' | 'Backend' | 'Database' | 'DevOps & Tooling';
export type DevStatus = 'Backlog' | 'In Progress' | 'In Review' | 'Shipped' | 'Vibe Verified';
export type DevPriority = 'Critical P0' | 'High P1' | 'Medium P2' | 'Future P3';

export interface DevWorkItem {
  id: string;
  title: string;
  layer: DevStackLayer;
  status: DevStatus;
  priority: DevPriority;
  problemSolved: string;
  solutionApproach: string;
  aiVibePromptBlueprint: string;
  targetSprint: string;
  filesTargeted: string[];
  complexity: 'S' | 'M' | 'L' | 'XL';
}

export interface SaaSProductPillar {
  id: string;
  name: string;
  tagline: string;
  icon: string;
  targetCustomerProblem: string;
  theAeethodSolution: string;
  techStackSpecs: {
    uiUx: string;
    frontend: string;
    backend: string;
    database: string;
  };
  metricsToBeat: {
    legacyStatusQuo: string;
    aeethodTarget: string;
  };
}

export interface VibeCodingManifestoRule {
  step: number;
  title: string;
  description: string;
  promptExample: string;
  ruleOfThumb: string;
}

export const SAAS_PRODUCT_PILLARS: SaaSProductPillar[] = [
  {
    id: 'buylist-kiosk',
    name: '1. Automated Optical Buylist & Counter Kiosk',
    tagline: 'Singles intake in seconds with 0 manual typing',
    icon: '📸',
    targetCustomerProblem: 'Customers bring 300-card binders to the card counter. Clerks spend 3.5 hours manually typing card editions, sets, and conditions. Clerks get fatigued and misgrade Lightly Played cards as Near Mint, bleeding store cash.',
    theAeethodSolution: 'Customer or clerk lays down cards. Optical webcam/phone AI vision recognizes the card name, expansion set code, and foil stamp in 0.8s. Connects to live TCG Market API to offer instantaneous Cash (50%) vs Store Credit (65%) quotes.',
    techStackSpecs: {
      uiUx: 'Ultra-fast numeric & touch-friendly interface, high-contrast dark/light mode for bright retail counters, 1-tap accept/reject.',
      frontend: 'React 18 + HTML5 Canvas video stream analyzer + Web Worker barcode & image hashing + Tailwind v4.',
      backend: 'Node / Edge server with batch ingest queue, optimistic price caching, and distributor margin thresholds.',
      database: 'PostgreSQL relational catalog (100k+ MTG/Pokemon card records) + indexed JSONB for variant foil multipliers.'
    },
    metricsToBeat: {
      legacyStatusQuo: '60 cards/hour manual entry ($0.27 labor cost per card)',
      aeethodTarget: '600 cards/hour AI scanning ($0.027 labor cost per card — 10x faster)'
    }
  },
  {
    id: 'shopify-zero-fee',
    name: '2. Zero-Commission Shopify Catalog Engine',
    tagline: '100% singles profit retained. Zero GMV taxes.',
    icon: '⚡',
    targetCustomerProblem: 'BinderPOS charges a 2.5% GMV tax on all sales. TCGplayer extracts 10.25% to 13.5%. Stores generating $50k/mo bleed $1,250 to $6,500/mo in pure software commission penalties.',
    theAeethodSolution: 'Flat-rate subscription ($99-$299/mo) with $0 commission. Direct real-time bidirectional Shopify GraphQL sync. When a card sells in-store on the POS, it delists from Shopify in 400ms to prevent double-selling.',
    techStackSpecs: {
      uiUx: 'Clean status badges, real-time sync heartbeat pill, 1-click batch Shopify inventory push.',
      frontend: 'Optimistic UI mutations with Zustand, debounced sync notifications, delta payload diffing.',
      backend: 'Shopify Admin GraphQL Webhook receiver + idempotency key verification to guarantee zero duplicate inventory adjustments.',
      database: 'Supabase / PostgreSQL `tasks`, `products`, `inventory_levels` with row-level locks on stock counters.'
    },
    metricsToBeat: {
      legacyStatusQuo: '2.5% GMV tax ($1,500-$4,000/mo drain) + 30-min sync delays',
      aeethodTarget: '$0 GMV tax (Save $18k-$45k/year) + <500ms real-time sync'
    }
  },
  {
    id: 'custom-storefront',
    name: '3. Turn-Key TCG Headless/Custom Storefronts',
    tagline: '$2,000 productized high-converting branded web store',
    icon: '🛍️',
    targetCustomerProblem: 'Local game store owners are hobbyists, not web designers. When they try to build their own website, singles search is broken, set filters are missing, and it looks untrustworthy. 80% of local customers leave and buy from TCGplayer instead.',
    theAeethodSolution: 'Turn-key pre-engineered TCG Shopify theme provided as an onboarding upsell ($1,500-$3,000). Features instant set filtering, card condition selectors (NM/LP/MP/HP), and embedded digital customer trade-in portal.',
    techStackSpecs: {
      uiUx: 'Mobile-first collector shopping experience: full-art card modal previews, 1-tap cart drawer, animated foil card tilt effects.',
      frontend: 'Liquid / Headless React storefront with Algolia/Meilisearch instant singles auto-complete.',
      backend: 'Supabase Edge Functions for handling customer buylist submissions and quote approvals.',
      database: 'Supabase `customer_buylist_orders`, `store_credit_ledgers`, `customer_accounts`.'
    },
    metricsToBeat: {
      legacyStatusQuo: 'Amateur custom themes costing $5,000+ taking 2 months with broken singles filters',
      aeethodTarget: 'Pre-optimized TCG theme deployed in 48 hours for $1,500-$2,000 flat'
    }
  },
  {
    id: 'price-floor-ai',
    name: '4. Price Floor Defense & Repricing Matrix',
    tagline: 'Stop the algorithmic race-to-the-bottom',
    icon: '🛡️',
    targetCustomerProblem: 'Naive auto-repricing bots undercut competitors by $0.01 indefinitely, crashing market prices until cards sell below wholesale or intake cost.',
    theAeethodSolution: 'Mathematical price floor enforcement (`PriceFloor = IntakeCost * 1.35`). Reprices dynamically against TCG Market and eBay Sold history while guarding minimum gross profit thresholds.',
    techStackSpecs: {
      uiUx: 'Live margin safety indicator (Green = Safe, Red = Margin Breach), bulk markup adjustment slider.',
      frontend: 'Interactive SVG / Recharts pricing curves and profit boundary visualizations.',
      backend: 'Scheduled Node worker querying price feeds, recalculating EV boundaries, and updating external listings.',
      database: 'PostgreSQL historical price logs with temporal indexing for volatility detection.'
    },
    metricsToBeat: {
      legacyStatusQuo: 'Blind 1-cent undercutting destroying 20%+ of card gross margin',
      aeethodTarget: 'Strict 35%+ gross margin floor defense with automated velocity repricing'
    }
  }
];

export const VIBE_CODING_MANIFESTO: VibeCodingManifestoRule[] = [
  {
    step: 1,
    title: 'Atomic Vertical Slicing (Never Build Layer-by-Layer)',
    description: 'Do not spend 3 days building a database schema with zero UI, or 3 days building mock buttons with no backend. In the vibe coding era, build thin vertical slices from Database -> API -> Store -> UI in a single flow.',
    promptExample: '"Create the Buylist Intake table in Supabase, hook the CRUD methods in store.ts, and render the live Trade-In Kiosk screen with 1-tap submit."',
    ruleOfThumb: 'Every single prompt must result in a testable, clickable UI backed by persistent data.'
  },
  {
    step: 2,
    title: 'Type Safety as the AI Guardrail',
    description: 'TypeScript is not just for human syntax checking—it is the single highest-leverage steering mechanism for AI assistants. Strict interfaces in `src/types.ts` prevent AI hallucinations and keep refactors clean.',
    promptExample: '"Define the strict TypeScript interface for `BuylistItem` first with all status enums, then build the component."',
    ruleOfThumb: 'Run `npm run typecheck` after every AI code modification. Zero tolerance for compiler warnings.'
  },
  {
    step: 3,
    title: 'Dual-Write & Offline Resilient Storage',
    description: 'Never make the client crash on network hiccup or missing API server. Always maintain local seed fallbacks, optimistic client updates, and async Supabase persistence.',
    promptExample: '"Use Zustand store with optimistic update, then dispatch background supabase.from().upsert()."',
    ruleOfThumb: 'The app must load and function instantaneously even if the user is offline in a convention hall.'
  },
  {
    step: 4,
    title: 'High-Density Information Architecture (Notion/Linear Aesthetic)',
    description: 'B2B users live in this tool 8 hours a day. Avoid childish, bloated landing-page padding. Use high-density tables, monospace font for numbers, keyboard shortcuts (Ctrl+K, C), and instant inline filters.',
    promptExample: '"Design this like Linear / Raycast: compact typography, JetBrains Mono numbers, subtle borders, high information density."',
    ruleOfThumb: 'If a user has to scroll twice to see their core daily numbers, the UI is too spaced out.'
  }
];

export const INITIAL_DEV_WORK_ITEMS: DevWorkItem[] = [
  // UI/UX
  {
    id: 'dev-ui-1',
    title: 'Buylist Fast-Entry Counter Kiosk UI',
    layer: 'UI/UX',
    status: 'In Progress',
    priority: 'Critical P0',
    problemSolved: 'Counter clerks get overwhelmed during Saturday trade-in rushes.',
    solutionApproach: 'Minimalist high-speed keypad, instant search suggestions with set icons, and 1-tap cash vs store credit split buttons.',
    aiVibePromptBlueprint: 'Build a high-density, touch-friendly counter trade-in intake modal with real-time totals and store credit calculation.',
    targetSprint: 'Sprint 1 (Beachhead Wedge)',
    filesTargeted: ['src/views/BuylistKioskView.tsx', 'src/components/TradeInItemRow.tsx'],
    complexity: 'M'
  },
  {
    id: 'dev-ui-2',
    title: 'Turn-Key TCG Storefront Theme Component Library',
    layer: 'UI/UX',
    status: 'Backlog',
    priority: 'High P1',
    problemSolved: 'Stores need high-end customer-facing web stores for the $2k storefront package.',
    solutionApproach: 'Pre-built card grid with condition toggles (NM, LP, MP), foil shimmer effects, and instant set drawer.',
    aiVibePromptBlueprint: 'Create modular, reusable e-commerce card components with rarity badges and dynamic condition price pills.',
    targetSprint: 'Sprint 2 (Storefront Upsell)',
    filesTargeted: ['src/components/storefront/CardProductCard.tsx', 'src/components/storefront/FoilShimmer.tsx'],
    complexity: 'L'
  },

  // Frontend
  {
    id: 'dev-fe-1',
    title: 'Camera AI Optical Scanner Stream Handler',
    layer: 'Frontend',
    status: 'In Progress',
    priority: 'Critical P0',
    problemSolved: 'Eliminates 100% of clerk manual card typing.',
    solutionApproach: 'WebRTC video stream captured into HTML5 Canvas, downsampled, and processed with client-side frame differencing.',
    aiVibePromptBlueprint: 'Implement HTML5 webcam stream capture that sends 3fps candidate frames to recognition worker.',
    targetSprint: 'Sprint 1 (Beachhead Wedge)',
    filesTargeted: ['src/lib/scannerEngine.ts', 'src/components/ScannerCameraModal.tsx'],
    complexity: 'XL'
  },
  {
    id: 'dev-fe-2',
    title: 'Bidirectional Shopify Inventory Real-Time Sync',
    layer: 'Frontend',
    status: 'Shipped',
    priority: 'Critical P0',
    problemSolved: 'Eliminates 2.5% GMV tax and sync delays.',
    solutionApproach: 'Zustand store wired to Supabase dual-write and optimistic UI state management.',
    aiVibePromptBlueprint: 'Connect store.ts with Supabase insert/update/delete listeners and persistent local fallback.',
    targetSprint: 'Sprint 1 (Beachhead Wedge)',
    filesTargeted: ['src/store.ts', 'src/lib/supabase.ts'],
    complexity: 'M'
  },

  // Backend
  {
    id: 'dev-be-1',
    title: 'TCGplayer / PriceCharting API Normalized Scraper & Ingest',
    layer: 'Backend',
    status: 'In Progress',
    priority: 'Critical P0',
    problemSolved: 'Provides accurate real-time market prices for buylist quotes without manual lookups.',
    solutionApproach: 'Node / Edge worker pulling daily price snapshots for Pokemon, One Piece, and MTG; caches locally in PostgreSQL.',
    aiVibePromptBlueprint: 'Create scheduled ingestion script that fetches latest set market prices and updates `card_catalog`.',
    targetSprint: 'Sprint 1 (Beachhead Wedge)',
    filesTargeted: ['server/priceWorker.js', 'src/lib/priceFeeds.ts'],
    complexity: 'L'
  },
  {
    id: 'dev-be-2',
    title: 'Automated Price Floor Boundary Validator',
    layer: 'Backend',
    status: 'Backlog',
    priority: 'High P1',
    problemSolved: 'Prevents auto-repricing bots from selling cards below intake cost.',
    solutionApproach: 'Express / Edge endpoint that validates `suggested_price >= intake_cost * 1.35` before dispatching to Shopify.',
    aiVibePromptBlueprint: 'Build validation middleware enforcing 35% minimum markup on outgoing Shopify inventory price updates.',
    targetSprint: 'Sprint 2 (Storefront Upsell)',
    filesTargeted: ['server/repriceEngine.js'],
    complexity: 'M'
  },

  // Database
  {
    id: 'dev-db-1',
    title: 'Relational TCG Card Catalog Schema (100k+ Cards)',
    layer: 'Database',
    status: 'Shipped',
    priority: 'Critical P0',
    problemSolved: 'Enables instant auto-complete and variant pricing across all games.',
    solutionApproach: 'Normalized PostgreSQL schema with full-text search index on card name and variant codes.',
    aiVibePromptBlueprint: 'Write Supabase migration table for `card_catalog` with indexes on `game`, `set_code`, and `card_number`.',
    targetSprint: 'Sprint 1 (Beachhead Wedge)',
    filesTargeted: ['supabase_schema.sql', 'data/db.json'],
    complexity: 'L'
  },
  {
    id: 'dev-db-2',
    title: 'Customer Buylist & Store Credit Ledger Schema',
    layer: 'Database',
    status: 'In Review',
    priority: 'Critical P0',
    problemSolved: 'Tracks pending customer trade-in submissions and audit trails for store credit payouts.',
    solutionApproach: 'Double-entry ledger table in PostgreSQL recording credit additions and POS redemptions.',
    aiVibePromptBlueprint: 'Create `buylist_orders` and `store_credit_transactions` tables with RLS and user foreign keys.',
    targetSprint: 'Sprint 1 (Beachhead Wedge)',
    filesTargeted: ['supabase_schema.sql'],
    complexity: 'M'
  },

  // DevOps & Tooling
  {
    id: 'dev-ops-1',
    title: 'Supabase Real-Time Client Dual-Write & Vercel Deploy Pipeline',
    layer: 'DevOps & Tooling',
    status: 'Shipped',
    priority: 'Critical P0',
    problemSolved: 'Ensures zero 404 crashes on hosted environments and live cloud data persistence.',
    solutionApproach: 'Supabase client setup with static Vite build compatibility and GitHub auto-deploy to Vercel.',
    aiVibePromptBlueprint: 'Fix store load logic to fallback to compiled seed if local node server is offline.',
    targetSprint: 'Sprint 1 (Beachhead Wedge)',
    filesTargeted: ['src/store.ts', 'src/lib/supabase.ts', 'vite.config.ts'],
    complexity: 'S'
  }
];
