export type DevStackLayer = 'Frontend' | 'Backend' | 'Database' | 'DevOps & Tooling';
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
  aiVibePromptBlueprint?: string;
  targetSprint?: string;
  filesTargeted?: string[];
  complexity?: 'S' | 'M' | 'L' | 'XL';
}

export interface SaaSProductPillar {
  id: string;
  name: string;
  tagline: string;
  icon: string;
  targetCustomerProblem: string;
  theAeethodSolution: string;
  targetAudience?: string;
  keyFeatures?: string[];
  pricingModel?: string;
  status?: 'Concept' | 'In Discovery' | 'In Development' | 'Beta' | 'Live';
}

// User starts with an empty list or adds their own SaaS products
export const INITIAL_SAAS_PRODUCTS: SaaSProductPillar[] = [];

// Engineering full-stack tasks (Frontend, Backend, Database, DevOps)
export const INITIAL_DEV_WORK_ITEMS: DevWorkItem[] = [
  {
    id: 'dev-fe-1',
    title: 'Camera AI Optical Scanner Stream Handler',
    layer: 'Frontend',
    status: 'In Progress',
    priority: 'Critical P0',
    problemSolved: 'Eliminates clerk manual card typing and reduces intake friction.',
    solutionApproach: 'WebRTC video stream captured into HTML5 Canvas, downsampled, and processed with client-side frame differencing.',
    targetSprint: 'Sprint 1',
    complexity: 'XL'
  },
  {
    id: 'dev-fe-2',
    title: 'Bidirectional Shopify Inventory Real-Time Sync',
    layer: 'Frontend',
    status: 'Shipped',
    priority: 'Critical P0',
    problemSolved: 'Eliminates GMV taxes and slow synchronization lag.',
    solutionApproach: 'Zustand store wired to Supabase dual-write and optimistic UI state management.',
    targetSprint: 'Sprint 1',
    complexity: 'M'
  },
  {
    id: 'dev-be-1',
    title: 'Marketplace Price Feeds Normalized Scraper & Ingest',
    layer: 'Backend',
    status: 'In Progress',
    priority: 'Critical P0',
    problemSolved: 'Provides accurate real-time market prices for buylist quotes without manual lookups.',
    solutionApproach: 'Node / Edge worker pulling daily price snapshots for Pokemon, One Piece, and MTG; caches locally.',
    targetSprint: 'Sprint 1',
    complexity: 'L'
  },
  {
    id: 'dev-be-2',
    title: 'Automated Price Floor Boundary Validator',
    layer: 'Backend',
    status: 'Backlog',
    priority: 'High P1',
    problemSolved: 'Prevents auto-repricing bots from selling cards below intake cost.',
    solutionApproach: 'Express / Edge endpoint that validates suggested prices against intake cost before dispatching.',
    targetSprint: 'Sprint 2',
    complexity: 'M'
  },
  {
    id: 'dev-db-1',
    title: 'Relational TCG Card Catalog Schema',
    layer: 'Database',
    status: 'Shipped',
    priority: 'Critical P0',
    problemSolved: 'Enables instant search auto-complete and variant pricing across all games.',
    solutionApproach: 'Normalized PostgreSQL schema with full-text search index on card name and variant codes.',
    targetSprint: 'Sprint 1',
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
    targetSprint: 'Sprint 1',
    complexity: 'M'
  },
  {
    id: 'dev-ops-1',
    title: 'Supabase Real-Time Client Dual-Write & Vercel Deploy Pipeline',
    layer: 'DevOps & Tooling',
    status: 'Shipped',
    priority: 'Critical P0',
    problemSolved: 'Ensures zero 404 crashes on hosted environments and live cloud data persistence.',
    solutionApproach: 'Supabase client setup with static Vite build compatibility and GitHub auto-deploy to Vercel.',
    targetSprint: 'Sprint 1',
    complexity: 'S'
  }
];
