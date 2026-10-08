export type UiUxCategory = 'Design System & Tokens' | 'Wireframe & Flow' | 'Component Library' | 'Micro-Interaction' | 'Usability Audit';
export type UiUxStatus = 'Concept' | 'In Figma / Wireframe' | 'In Code / Prototyping' | 'Polished & Done';
export type UiUxTargetSurface = 'Desktop App' | 'POS Counter Kiosk' | 'Mobile Collector' | 'Customer Storefront';

export interface UiUxItem {
  id: string;
  title: string;
  category: UiUxCategory;
  surface: UiUxTargetSurface;
  status: UiUxStatus;
  userProblem: string;
  uxDesignSolution: string;
  designChecklist: string[];
  figmaOrPreviewNotes?: string;
  screensCount?: number;
}

export const INITIAL_UI_UX_ITEMS: UiUxItem[] = [
  {
    id: 'ux-1',
    title: 'High-Speed Counter Buylist Intake Kiosk',
    category: 'Component Library',
    surface: 'POS Counter Kiosk',
    status: 'In Code / Prototyping',
    userProblem: 'Card store counter clerks have greasy fingers, fast-moving customers, and bright retail lighting. Small buttons and nested dropdowns cause miss-clicks and slow lines.',
    uxDesignSolution: 'Large touch target pads (minimum 48px), high-contrast ivory & dark-slate tokens, tactile audio-click feedback, 1-tap accept/reject toggle.',
    designChecklist: [
      'Touch targets >= 48px for retail iPads',
      'Instant keyboard numeric shortcuts (Numpad enter)',
      'Clear split between Cash (Red/Rose) vs Store Credit (Emerald)',
      'High-contrast readability under retail fluorescent lights'
    ],
    figmaOrPreviewNotes: 'Designed with Linear + Square Terminal aesthetic. Minimal visual clutter.',
    screensCount: 3
  },
  {
    id: 'ux-2',
    title: 'Adaptive Dual-Theme System (Clean Ivory White & Charcoal Obsidian)',
    category: 'Design System & Tokens',
    surface: 'Desktop App',
    status: 'Polished & Done',
    userProblem: 'Cluttered all-black dark mode makes dense tabular data look heavy, while uncalibrated bright white strains eyes during 8-hour inventory sorting sessions.',
    uxDesignSolution: 'Neutral ivory/slate surfaces (#f8fafc / #191919), clean JetBrains Mono numbers, subtle 1px border hierarchy, and zero pitch-black OLED contrast fatigue.',
    designChecklist: [
      'Tokenized CSS variables for background, card, and borders',
      'JetBrains Mono for currency & numeric matrix data',
      'Plus Jakarta Sans for readable UI headers',
      'Smooth 150ms theme transition'
    ],
    figmaOrPreviewNotes: 'Implemented across all views with instant localStorage sync.',
    screensCount: 12
  },
  {
    id: 'ux-3',
    title: 'Holographic & Foil Card Tilt Micro-Interaction',
    category: 'Micro-Interaction',
    surface: 'Customer Storefront',
    status: 'In Code / Prototyping',
    userProblem: 'Online buyers cannot appreciate the beauty or authenticity of expensive Manga Rares or Special Illustration Rares from a flat static image.',
    uxDesignSolution: 'Gyroscope (mobile) & cursor-responsive (desktop) CSS 3D card tilt with realistic dynamic holographic glare gradient.',
    designChecklist: [
      'Subtle 3D perspective matrix transform on mousemove',
      'Radial glare gradient mask that follows cursor angle',
      'Hardware-accelerated CSS transforms (will-change: transform)',
      'Graceful fallback on reduced-motion preference'
    ],
    figmaOrPreviewNotes: 'Creates the signature collector premium feel on product pages.',
    screensCount: 2
  },
  {
    id: 'ux-4',
    title: 'Singles Condition Selector & Grading State Pills',
    category: 'Wireframe & Flow',
    surface: 'Desktop App',
    status: 'In Code / Prototyping',
    userProblem: 'Selecting card condition (Near Mint, Lightly Played, Moderately Played, Heavily Played, Damaged) is tedious in generic e-commerce platforms.',
    uxDesignSolution: 'Single-row segmented pill group with color-coded condition badges and instant market price delta indicators.',
    designChecklist: [
      '5 distinct condition tiers with color-coded dots',
      'Price percentage modifier preview (+0%, -15%, -30%)',
      '1-tap condition swapping with keyboard hotkeys (1-5)'
    ],
    screensCount: 4
  },
  {
    id: 'ux-5',
    title: 'High-Density Singles Inventory Table & Multi-Channel Status',
    category: 'Wireframe & Flow',
    surface: 'Desktop App',
    status: 'In Figma / Wireframe',
    userProblem: 'Store owners manage 20,000+ card singles across eBay, TCGplayer, and Shopify. Generic tables waste vertical space and lack instant bulk editing.',
    uxDesignSolution: 'Compact 28px row height, sticky header with instant filtering, inline price & condition editing, and multi-channel sync status indicators.',
    designChecklist: [
      'Compact row layout with JetBrains Mono numbers',
      'Inline edit cell without opening modal dialog',
      'Sticky column sorting & filter chips bar',
      'Bulk action bar (Change Price, Print Barcode, De-list)'
    ],
    figmaOrPreviewNotes: 'Prioritizes maximum data density similar to Linear / Bloomberg Terminal.',
    screensCount: 6
  },
  {
    id: 'ux-6',
    title: 'Fast-Touch Counter Register & Split-Payment Flow',
    category: 'Component Library',
    surface: 'POS Counter Kiosk',
    status: 'Concept',
    userProblem: 'Long lines during tournament nights freeze if a customer wants to pay with 50% store credit and 50% cash/card.',
    uxDesignSolution: '1-tap split payment slider, automatic store credit balance check, hold/resume cart buffer, and high-visibility digital change display.',
    designChecklist: [
      'Touch pads >= 48px for quick register taps',
      'Automatic dual balance calculator (Credit vs Cash)',
      '1-button Hold Order buffer to service next customer in line',
      'Customer-facing display toggle'
    ],
    figmaOrPreviewNotes: 'Optimized for high-velocity Friday Night Magic counter rush.',
    screensCount: 5
  }
];
