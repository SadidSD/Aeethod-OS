export type UiDecisionStatus = 'Draft' | 'Under Review' | 'Token Verified' | 'Implemented';

export type CoreUiTerm =
  | 'Visual Hierarchy'
  | '8pt Grid Rhythm'
  | 'WCAG 2.2 Contrast'
  | 'Type Scale'
  | 'Leading & Tracking'
  | 'Tabular Figures'
  | 'Semantic Palette'
  | 'Component State Anatomy'
  | 'Surface Elevation'
  | '1px Border Hierarchy'
  | 'Functional Motion'
  | 'Macro vs Micro Whitespace';

export interface UiDecisionRecord {
  id: string;
  title: string;
  problem: string;
  surfaceContext: string;
  decision: string;
  alternativesRejected: string;
  taggedTerms: CoreUiTerm[];
  verifiedPrincipleIds: string[];
  status: UiDecisionStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UiPrinciple {
  id: string;
  principleNumber: number;
  name: string;
  shortRule: string;
  detailedGuideline: string;
  formulaOrStandard: string;
  retailSaaSApplication: string;
}

export interface CoreUiTermDefinition {
  term: CoreUiTerm;
  category: 'Typography' | 'Color & Light' | 'Spatial & Layout' | 'Components & Motion';
  definition: string;
  retailSaaSExample: string;
}

export const UI_PRINCIPLES: UiPrinciple[] = [
  {
    id: 'uip-hierarchy',
    principleNumber: 1,
    name: 'Visual Hierarchy (Scale & Weight)',
    shortRule: 'Guide the eye in natural F- or Z-patterns using intentional scale, weight, and contrast.',
    detailedGuideline: 'Primary elements must be visually dominant; secondary metadata must quietly recede. Never make every element compete for attention.',
    formulaOrStandard: 'Title: 20-24px Bold (100% contrast) > Body: 13-14px Medium (80% contrast) > Caption: 11-12px (60% contrast)',
    retailSaaSApplication: 'On trade payout cards, the total payout ($546.00) is large and bold (24px tabular); the card set name is muted 12px secondary text.'
  },
  {
    id: 'uip-grid',
    principleNumber: 2,
    name: 'Spatial Rhythm & The 8pt Grid',
    shortRule: 'All spacing, margins, padding, and element heights must follow multiples of 8 (or 4 for micro-spacing).',
    detailedGuideline: 'Eliminate arbitrary pixel margins. An 8pt spatial system creates mathematical harmony and crisp multi-screen alignment.',
    formulaOrStandard: 'Spacing scale: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px. Zero odd numbers (no 7px, 13px, 19px).',
    retailSaaSApplication: 'Table row heights are locked to 32px (4 x 8); card padding is 16px; modal margins are 24px.'
  },
  {
    id: 'uip-contrast',
    principleNumber: 3,
    name: 'Contrast & Accessibility (WCAG 2.2)',
    shortRule: 'Text and interactive controls must pass WCAG contrast ratios and never rely on color alone to convey state.',
    detailedGuideline: 'Ensure readability under bright fluorescent card shop lights. Pair color indicators with an icon and textual label.',
    formulaOrStandard: 'Normal text: >= 4.5:1 (AA) or 7:1 (AAA). Large text: >= 3:1. Focus rings: 2px offset.',
    retailSaaSApplication: 'Inventory warning badges feature amber text + alert icon on high-contrast tinted surface, not just plain colored text.'
  },
  {
    id: 'uip-consistency',
    principleNumber: 4,
    name: 'Consistency & Design System Tokens',
    shortRule: 'Identical UI elements must look, behave, and respond identically across every screen.',
    detailedGuideline: 'Button radiuses, input heights, and modal animations must be derived from tokenized variables, preserving muscle memory.',
    formulaOrStandard: 'Global tokens for radiuses (rounded-xl), borders (border-slate-200 / border-[#262632]), and focus outlines.',
    retailSaaSApplication: 'Primary CTA buttons always use the same 12px padding, 8px radius, and indigo color whether at POS checkout or CSV import.'
  },
  {
    id: 'uip-whitespace',
    principleNumber: 5,
    name: 'Whitespace & Visual Breathing Room',
    shortRule: 'Use negative space intentionally to reduce cognitive clutter and convey software prestige.',
    detailedGuideline: 'Whitespace is not empty space; it is an active design tool that groups related clusters and gives critical figures prominence.',
    formulaOrStandard: 'Macro whitespace separates independent containers; micro whitespace (140-160% line-height) ensures effortless text scanning.',
    retailSaaSApplication: 'Surround high-value vintage slab certification details with generous whitespace so authentication numbers feel prestigious.'
  },
  {
    id: 'uip-states',
    principleNumber: 6,
    name: 'Affordance & The 6 Component States',
    shortRule: 'Every interactive element must explicitly support all 6 interactive visual states.',
    detailedGuideline: 'Users must never wonder if an element is clickable, disabled, or currently processing an API transaction.',
    formulaOrStandard: '1. Default, 2. Hover (<100ms lift), 3. Focus-Visible (2px ring), 4. Active (scale 0.98), 5. Loading (skeleton wave), 6. Disabled (40% opacity).',
    retailSaaSApplication: 'The "Accept Trade" button dims to 40% when the cash drawer is empty, and pulses a skeleton spinner while printing the voucher.'
  },
  {
    id: 'uip-elevation',
    principleNumber: 7,
    name: 'Surface Depth & 1px Border Elevation',
    shortRule: 'Layer interfaces on a clear z-index elevation scale using subtle 1px border luminance rather than heavy drop shadows.',
    detailedGuideline: 'On dark surfaces, traditional black shadows disappear. Communicate depth by making higher elevation surfaces subtly brighter with 1px border glows.',
    formulaOrStandard: 'Level 0 (Canvas #0c0c10) < Level 1 (Card #15151c) < Level 2 (Hover/Dropdown #1a1a24 + 1px border #38384a) < Level 3 (Modal backdrop-blur).',
    retailSaaSApplication: 'Modals and command palettes float over a backdrop blur with subtle border glow, grounding them above the dense singles inventory grid.'
  },
  {
    id: 'uip-motion',
    principleNumber: 8,
    name: 'Functional Motion (<300ms Duration)',
    shortRule: 'Motion exists to communicate spatial continuity and causality, never for decorative fluff.',
    detailedGuideline: 'Animations must feel crisp and instantaneous. Slow animations make fast software feel sluggish.',
    formulaOrStandard: 'Toggles/buttons: 100-150ms. Drawers/modals: 200-250ms with ease-out curve (cubic-bezier(0, 0, 0.2, 1)). Never exceed 300ms.',
    retailSaaSApplication: 'The buylist side-drawer snaps open in 200ms with ease-out physics so clerks never wait for the interface.'
  }
];

export const CORE_UI_TERMS: CoreUiTermDefinition[] = [
  {
    term: 'Visual Hierarchy',
    category: 'Spatial & Layout',
    definition: 'The spatial and typographic arrangement that communicates relative importance and reading order.',
    retailSaaSExample: 'Pricing ($420.00) is bold and prominent; set code (BS-004) is quiet secondary caption text.'
  },
  {
    term: '8pt Grid Rhythm',
    category: 'Spatial & Layout',
    definition: 'A spatial constraint where all dimensions, margins, and gaps are multiples of 8px (with 4px sub-grid).',
    retailSaaSExample: 'Padding 16px, table row 32px, modal gap 24px, POS touch target 48px.'
  },
  {
    term: 'WCAG 2.2 Contrast',
    category: 'Color & Light',
    definition: 'Scientific standards ensuring text and interactive elements are legible across all vision levels and lighting.',
    retailSaaSExample: 'Dark slate text on white cards maintaining a minimum 4.5:1 ratio under retail store lighting.'
  },
  {
    term: 'Type Scale',
    category: 'Typography',
    definition: 'A mathematically proportioned hierarchy of font sizes that maintains harmonious optical balance.',
    retailSaaSExample: 'Major Third ratio: 11px caption, 13px table cell, 14px body, 16px section, 20px card header, 24px page title.'
  },
  {
    term: 'Leading & Tracking',
    category: 'Typography',
    definition: 'Leading is line-height; tracking is character spacing across a string.',
    retailSaaSExample: 'Uppercase badges use +0.05em tracking (tracking-wider); headlines use -0.02em tracking (tracking-tight).'
  },
  {
    term: 'Tabular Figures',
    category: 'Typography',
    definition: 'Numbers designed with identical horizontal widths (monospace numerals) so columns align without jitter.',
    retailSaaSExample: 'JetBrains Mono for prices so decimal points align in a perfectly straight vertical line in 30,000-row grids.'
  },
  {
    term: 'Semantic Palette',
    category: 'Color & Light',
    definition: 'Colors assigned strictly to meaning: Emerald for trade profit, Rose for cash deficit, Amber for sync lag.',
    retailSaaSExample: 'Store Credit bonus (+30%) is permanently emerald (#10b981); Cash Payout is permanently crimson (#f43f5e).'
  },
  {
    term: 'Component State Anatomy',
    category: 'Components & Motion',
    definition: 'The 6 explicit interactive states of an interface element: default, hover, focus, active, loading, disabled.',
    retailSaaSExample: 'Every button displays a distinct active compression (scale-98) and focus outline ring for keyboard power-users.'
  },
  {
    term: 'Surface Elevation',
    category: 'Color & Light',
    definition: 'Layering components along the z-axis to communicate spatial depth and modal focus.',
    retailSaaSExample: 'Canvas background (#0c0c10) -> Card table (#15151c) -> Slide-over inspection drawer with ambient border.'
  },
  {
    term: '1px Border Hierarchy',
    category: 'Color & Light',
    definition: 'Communicating elevation on dark interfaces using subtle 1px border luminance rather than invisible black shadows.',
    retailSaaSExample: 'Resting cards have a 1px border of #262632; hovered cards illuminate to #38384a.'
  },
  {
    term: 'Functional Motion',
    category: 'Components & Motion',
    definition: 'Purposeful micro-interactions under 250ms with ease-out curves that reinforce spatial continuity.',
    retailSaaSExample: 'Smooth 150ms cross-fade when toggling between Cash and Store Credit calculation tabs.'
  },
  {
    term: 'Macro vs Micro Whitespace',
    category: 'Spatial & Layout',
    definition: 'Macro whitespace separates major structural layouts; micro whitespace separates inline table rows and labels.',
    retailSaaSExample: 'Generous 32px macro margins around cards, with tight 8px micro gaps inside compact 28px table rows.'
  }
];

// Clean empty starting state - Zero pre-inputted dummy records!
export const INITIAL_UI_DECISION_RECORDS: UiDecisionRecord[] = [];
