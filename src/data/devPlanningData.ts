export type DevStackLayer = 'UI/UX' | 'Frontend' | 'Backend' | 'Database' | 'DevOps & Tooling';
export type DevStatus = 'Backlog' | 'In Progress' | 'In Review' | 'Shipped' | 'Vibe Verified';
export type DevPriority = 'Critical P0' | 'High P1' | 'Medium P2' | 'Future P3';

export interface ProductTechStack {
  uiUx: string;
  frontend: string;
  backend: string;
  database: string;
  devOps?: string;
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
  status: 'Concept' | 'In Discovery' | 'In Development' | 'Beta' | 'Live';
  techStack: ProductTechStack;
  createdAt?: string;
  updatedAt?: string;
}

export interface DevWorkItem {
  id: string;
  productId?: string; // Optional link to a specific SaaS Product
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

// User starts with an empty list or adds their own SaaS products
export const INITIAL_SAAS_PRODUCTS: SaaSProductPillar[] = [];

// Engineering full-stack tasks
export const INITIAL_DEV_WORK_ITEMS: DevWorkItem[] = [];
