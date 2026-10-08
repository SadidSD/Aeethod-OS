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

export interface UxFlowStep {
  id: string;
  stepNumber: number;
  title: string;
  userGoal: string;
  branchCondition?: string;
  hardwareTrigger?: 'Barcode Scan' | 'Thermal Print' | 'Cash Drawer Kick' | 'Camera OCR' | 'None';
  hotkey?: string;
  touchTargetSize: string; // e.g. "48px"
  frictionLevel: 'Low' | 'Medium' | 'High';
  edgeCaseNotes: string;
  figmaUrl?: string;
}

export interface UxSitemapNode {
  id: string;
  title: string;
  route: string;
  parentRoute?: string;
  role: 'Clerk' | 'Manager' | 'Store Owner' | 'Collector';
  layoutType: 'POS Kiosk' | 'Desktop Grid' | 'Center Peek Drawer' | 'Mobile View';
  status: 'Concept' | 'Wireframing' | 'In Prototype' | 'Shipped';
  icon: string;
  notes: string;
  statesDefined: {
    ideal: boolean;
    empty: boolean;
    loading: boolean;
    partial: boolean;
    error: boolean;
  };
}

export interface UxScreenStateSpec {
  screenId: string;
  screenTitle: string;
  route: string;
  idealStateNotes: string;
  emptyStateTitle: string;
  emptyStateAction: string;
  loadingSkeletonPattern: string;
  partialStateRules: string;
  errorRecoveryAction: string;
  designComplete: boolean;
}

export interface UxKanbanTask {
  id: string;
  title: string;
  flowCategory: 'POS' | 'Buylist' | 'Inventory' | 'Tournaments' | 'Storefront';
  column: 'jtbd' | 'wireframe' | 'figma' | 'tested' | 'dev_ready' | 'shipped';
  priority: 'High' | 'Medium' | 'Critical';
  persona: string;
  description: string;
}

export interface UxFlowPlan {
  id: string;
  flowName: string;
  category: 'Onboarding' | 'Buylist' | 'Inventory' | 'Sync' | 'Tournaments';
  targetPersona: string;
  targetSeconds: number;
  steps: UxFlowStep[];
  status: 'Draft' | 'Wireframing' | 'In Prototype' | 'Validated';
  summary: string;
}

export interface HeuristicAuditItem {
  id: number;
  name: string;
  summary: string;
  aeethodExample: string;
  status: 'Pass' | 'Warning' | 'Fail';
  notes: string;
  severity: 'None' | 'Cosmetic' | 'Minor' | 'Major';
}

export interface UserPersona {
  id: string;
  name: string;
  role: string;
  environment: string;
  primaryGoal: string;
  biggestFrustration: string;
  keyUiRequirements: string[];
  avatarEmoji: string;
}

export interface UxMetricTarget {
  id: string;
  name: string;
  category: 'Activation' | 'Speed' | 'Quality' | 'Satisfaction';
  targetValue: string;
  currentValue: string;
  status: 'On Track' | 'Needs Attention' | 'Exceeding';
  businessImpact: string;
}

export const INITIAL_USER_PERSONAS: UserPersona[] = [
  {
    id: 'persona-1',
    name: 'Counter Clerk Jake',
    role: 'Retail Frontline Specialist (22 yrs)',
    environment: 'Physical Store Counter, standing on feet, iPad POS & barcode scanner, loud rush hours',
    primaryGoal: 'Process customer trade-ins and checkout sales in under 30 seconds with 0 math errors',
    biggestFrustration: 'Nested dropdown menus, slow loading spinners, and tiny buttons that cause mis-clicks',
    keyUiRequirements: ['Touch pads >= 48px', 'Numpad keyboard shortcuts', 'Audible barcode beep confirmation', 'High-contrast lighting compatibility'],
    avatarEmoji: '⚡'
  },
  {
    id: 'persona-2',
    name: 'Store Owner Sadid',
    role: 'LGS Founder & Multi-Channel Director (34 yrs)',
    environment: 'Back-office desk laptop and floor iPad, managing cash flow & inventory risk',
    primaryGoal: 'Maintain positive gross margin spreads and ensure physical cards never double-sell on eBay',
    biggestFrustration: 'Cluttered SaaS with low data density, hidden fees, and inventory lag',
    keyUiRequirements: ['High-density 28px table rows', 'Instant buy-margin calculators', '180ms webhook sync status', 'Multi-channel conflict alerts'],
    avatarEmoji: '💼'
  },
  {
    id: 'persona-3',
    name: 'Content Host Anika',
    role: 'Brand Evangelist & Media Producer (26 yrs)',
    environment: 'Studio desk, ring lights, mobile phone, direct-to-camera filming',
    primaryGoal: 'Identify viral market trends, unbox high-value tins, and record engaging talking-head reels',
    biggestFrustration: 'Generic analytics charts that show numbers without diagnosing why a reel boomed or flopped',
    keyUiRequirements: ['Real-time Meta insights sync', 'Clean teleprompter script view', 'Root-cause algorithmic diagnostics', 'High-res card zoom'],
    avatarEmoji: '🎙️'
  },
  {
    id: 'persona-4',
    name: 'Grail Collector Sarah',
    role: 'High-End Vintage Investor (28 yrs)',
    environment: 'Mobile collector app, trade night meetups, high financial vigilance ($5,000+ slabs)',
    primaryGoal: 'Verify card authenticity, corner whitening, centering ratios, and holographic foil patterns',
    biggestFrustration: 'Flat low-resolution scans that hide micro-creases and edge wear',
    keyUiRequirements: ['Interactive 3D foil/hologram tilt', 'PSA/BGS cert verification badge', 'Price history delta sparklines', 'Instant condition audit'],
    avatarEmoji: '💎'
  }
];

export const INITIAL_UX_FLOW_PLANS: UxFlowPlan[] = [
  {
    id: 'flow-buylist',
    flowName: '30-Second Counter Buylist Intake',
    category: 'Buylist',
    targetPersona: 'Counter Clerk Jake',
    targetSeconds: 30,
    status: 'In Prototype',
    summary: 'The critical frontline workflow where a customer brings 50 raw cards to the trade counter. Eliminates manual search lag and typing.',
    steps: [
      {
        id: 'b-1',
        stepNumber: 1,
        title: 'Optical / Barcode Scanner Intake',
        userGoal: 'Identify the exact card expansion set and variant without typing',
        branchCondition: 'Branch A: Card in local DB -> Auto-price | Branch B: Unknown SKU -> 2-keystroke fuzzy search | Branch C: Damaged/Fake -> Flag Flaw Modal',
        hardwareTrigger: 'Barcode Scan',
        hotkey: 'Space or Barcode Trigger',
        touchTargetSize: '64px',
        frictionLevel: 'Low',
        edgeCaseNotes: 'Card is un-sleeved or barcode is scratched: Falls back to instant 2-keystroke fuzzy search.'
      },
      {
        id: 'b-2',
        stepNumber: 2,
        title: '1-Tap Condition Grading Pills',
        userGoal: 'Assign physical condition (NM/LP/MP/HP/DMG) in exactly 1 touch',
        branchCondition: 'Branch A: NM/LP -> Standard margin | Branch B: HP/DMG -> High-risk warning discount',
        hardwareTrigger: 'None',
        hotkey: 'Keys 1 to 5',
        touchTargetSize: '52px',
        frictionLevel: 'Low',
        edgeCaseNotes: 'Card has micro-indent: Clerk clicks "Flag Flaw" to attach grading note for store audit.'
      },
      {
        id: 'b-3',
        stepNumber: 3,
        title: 'Live Market Margin Calculation',
        userGoal: 'Calculate store buy-offer based on real-time TCGplayer market prices',
        branchCondition: 'Branch A: Live API connected -> Real-time pricing | Branch B: Offline -> Daily cached rate sheet',
        hardwareTrigger: 'None',
        hotkey: 'Auto-computed',
        touchTargetSize: '48px',
        frictionLevel: 'Low',
        edgeCaseNotes: 'Network drops: System uses cached offline daily buylist rate table.'
      },
      {
        id: 'b-4',
        stepNumber: 4,
        title: 'Cash vs Store Credit Split Decision',
        userGoal: 'Present customer with Cash ($120) vs Store Credit ($156 @ +30% boost)',
        branchCondition: 'Branch A: Store Credit selected -> Instant card balance injection | Branch B: Cash -> Drawer balance validation',
        hardwareTrigger: 'Cash Drawer Kick',
        hotkey: 'Tab + Enter',
        touchTargetSize: '60px',
        frictionLevel: 'Medium',
        edgeCaseNotes: 'Store cash drawer has insufficient physical bills: System highlights Store Credit bonus.'
      },
      {
        id: 'b-5',
        stepNumber: 5,
        title: 'Receipt Print & Multi-Channel Injection',
        userGoal: 'Print intake voucher and add card into active store inventory immediately',
        branchCondition: 'Branch A: Thermal printer active -> Cut voucher | Branch B: Paper out -> SMS/Email voucher',
        hardwareTrigger: 'Thermal Print',
        hotkey: 'Enter',
        touchTargetSize: '48px',
        frictionLevel: 'Low',
        edgeCaseNotes: 'Thermal printer runs out of paper: Digital SMS/email voucher toggle available.'
      }
    ]
  },
  {
    id: 'flow-inventory',
    flowName: 'High-Density Singles Inventory & Multi-Channel Sync',
    category: 'Inventory',
    targetPersona: 'Store Owner Sadid',
    targetSeconds: 15,
    status: 'Wireframing',
    summary: 'Desktop data grid built for managing 30,000+ card SKUs with inline editing and zero modal clutter.',
    steps: [
      {
        id: 'i-1',
        stepNumber: 1,
        title: 'Global Fast Filter & Set Selection',
        userGoal: 'Instantly isolate Base Set Charizard holos from 30,000 SKUs',
        branchCondition: 'Branch A: Direct set code match -> Filter grid | Branch B: Loose card name -> Fuzzy suggest',
        hardwareTrigger: 'None',
        hotkey: '⌘K / Ctrl+K',
        touchTargetSize: '36px',
        frictionLevel: 'Low',
        edgeCaseNotes: 'Query returns 500+ variants: Virtualized windowing maintains 60 FPS scrolling.'
      },
      {
        id: 'i-2',
        stepNumber: 2,
        title: 'Inline Cell Pricing & Condition Adjustment',
        userGoal: 'Update price from $420 to $450 without opening an inspection modal',
        branchCondition: 'Branch A: Price within 15% range -> Commit | Branch B: >30% divergence -> Confirmation tooltip',
        hardwareTrigger: 'None',
        hotkey: 'Double Click or Enter',
        touchTargetSize: '32px',
        frictionLevel: 'Low',
        edgeCaseNotes: 'Typing error (e.g. $4500 instead of $450): System warns on >30% market divergence.'
      },
      {
        id: 'i-3',
        stepNumber: 3,
        title: 'Multi-Select Bulk Action Execution',
        userGoal: 'Select 20 singles and sync them to eBay with a 10% premium',
        branchCondition: 'Branch A: Channels authorized -> Push webhook | Branch B: Channel token expired -> Re-auth badge',
        hardwareTrigger: 'None',
        hotkey: 'Shift + Click',
        touchTargetSize: '40px',
        frictionLevel: 'Medium',
        edgeCaseNotes: 'eBay API rate limit: Actions queue gracefully in a background worker.'
      },
      {
        id: 'i-4',
        stepNumber: 4,
        title: 'Live Channel Webhook Health Verification',
        userGoal: 'Confirm that physical in-store sale decremented the online listing in <200ms',
        branchCondition: 'Branch A: Success -> Green pulse indicator | Branch B: Lag/Failure -> Retry queue indicator',
        hardwareTrigger: 'None',
        hotkey: 'Auto-monitored',
        touchTargetSize: '32px',
        frictionLevel: 'Low',
        edgeCaseNotes: 'Shopify sync failure: Persistent amber warning badge triggers manual retry.'
      }
    ]
  },
  {
    id: 'flow-onboarding',
    flowName: 'Store Owner 3-Day Time-to-Value Onboarding',
    category: 'Onboarding',
    targetPersona: 'Store Owner Sadid',
    targetSeconds: 180,
    status: 'In Prototype',
    summary: 'Gets a brand-new card shop from signup to their first synced sale in under 3 days.',
    steps: [
      {
        id: 'o-1',
        stepNumber: 1,
        title: 'Welcome & Legacy Inventory Importer',
        userGoal: 'Upload existing BinderPOS, CrystalCommerce, or Excel CSV sheet in 1 click',
        branchCondition: 'Branch A: Standard CSV format -> Auto-map columns | Branch B: Custom format -> Drag-drop column mapper',
        hardwareTrigger: 'None',
        hotkey: 'Drag & Drop',
        touchTargetSize: '64px',
        frictionLevel: 'Medium',
        edgeCaseNotes: 'CSV has missing columns: Smart auto-column mapping reconciles column headers.'
      },
      {
        id: 'o-2',
        stepNumber: 2,
        title: 'Connect Primary Sales Channels',
        userGoal: 'Authorize eBay, Shopify, and TCGplayer seller accounts',
        branchCondition: 'Branch A: OAuth success -> Instant test ping | Branch B: Auth failed -> Direct API troubleshooting drawer',
        hardwareTrigger: 'None',
        hotkey: 'OAuth 1-Click',
        touchTargetSize: '48px',
        frictionLevel: 'Medium',
        edgeCaseNotes: 'User lacks developer keys: In-app guided walkthrough opens direct auth links.'
      },
      {
        id: 'o-3',
        stepNumber: 3,
        title: 'Configure Automated Buylist Spread Rules',
        userGoal: 'Establish default store margins (e.g. 65% cash / 80% store credit)',
        branchCondition: 'Branch A: Accept preset chips -> 1-click apply | Branch B: Custom formula -> Advanced tier matrix',
        hardwareTrigger: 'None',
        hotkey: 'Preset Chips',
        touchTargetSize: '48px',
        frictionLevel: 'Low',
        edgeCaseNotes: 'User unsure of competitive margins: System recommends regional industry defaults.'
      },
      {
        id: 'o-4',
        stepNumber: 4,
        title: 'First Transaction Simulation & Celebration',
        userGoal: 'Run a sample trade-in to experience zero-latency checkout',
        branchCondition: 'Branch A: Simulation complete -> Confetti burst + Live mode activated | Branch B: Skip -> Direct to dashboard',
        hardwareTrigger: 'Thermal Print',
        hotkey: 'Enter to Complete',
        touchTargetSize: '56px',
        frictionLevel: 'Low',
        edgeCaseNotes: 'User wants live test: Provides a sandbox toggle with instant reset.'
      }
    ]
  },
  {
    id: 'flow-tournaments',
    flowName: 'Friday Night Tournament Swiss Pairing & Check-in',
    category: 'Tournaments',
    targetPersona: 'Counter Clerk Jake',
    targetSeconds: 60,
    status: 'Draft',
    summary: 'Rapid check-in and automated Swiss pairing for 64-player competitive card nights.',
    steps: [
      {
        id: 't-1',
        stepNumber: 1,
        title: 'Player QR / Name Search Check-in',
        userGoal: 'Confirm player attendance and collect tournament entry fee in 3 seconds',
        branchCondition: 'Branch A: Player registered -> 1-tap mark present | Branch B: Walk-in player -> Quick 5-second guest registration',
        hardwareTrigger: 'Barcode Scan',
        hotkey: 'Barcode Scan or Enter',
        touchTargetSize: '52px',
        frictionLevel: 'Low',
        edgeCaseNotes: 'Player pays with store credit: Register automatically deducts from customer balance.'
      },
      {
        id: 't-2',
        stepNumber: 2,
        title: '1-Click Swiss Round Pairing Algorithm',
        userGoal: 'Generate mathematically balanced pairings and table assignments',
        branchCondition: 'Branch A: Even player count -> Standard pairing | Branch B: Odd player count -> Auto-grant 3-point bye',
        hardwareTrigger: 'None',
        hotkey: '⌘P',
        touchTargetSize: '52px',
        frictionLevel: 'Low',
        edgeCaseNotes: 'Odd player count: System grants bye to lowest-ranked player automatically.'
      },
      {
        id: 't-3',
        stepNumber: 3,
        title: 'Store Screen Projector & Mobile Display',
        userGoal: 'Broadcast pairings to store wall TV and player mobile phones via QR code',
        branchCondition: 'Branch A: HDMI/Chromecast connected -> Fullscreen TV kiosk | Branch B: Mobile only -> Host web URL',
        hardwareTrigger: 'None',
        hotkey: 'Auto-broadcast',
        touchTargetSize: '48px',
        frictionLevel: 'Low',
        edgeCaseNotes: 'Player dispute: Clerk can manually swap table seating in 1 click.'
      },
      {
        id: 't-4',
        stepNumber: 4,
        title: 'Rapid Match Slip Result Entry',
        userGoal: 'Record 2-0 / 2-1 match outcomes as players report to the desk',
        branchCondition: 'Branch A: Normal result -> Enter score | Branch B: Draw / Time expired -> Tiebreaker rule applied',
        hardwareTrigger: 'None',
        hotkey: 'Numpad 2-0 / 2-1',
        touchTargetSize: '48px',
        frictionLevel: 'Low',
        edgeCaseNotes: 'Tied match: Automatically logs tiebreaker percentages.'
      }
    ]
  }
];

export const INITIAL_SITEMAP_NODES: UxSitemapNode[] = [
  {
    id: 'site-pos',
    title: 'Counter Checkout Register',
    route: '/pos',
    role: 'Clerk',
    layoutType: 'POS Kiosk',
    status: 'Shipped',
    icon: 'Zap',
    notes: 'Fast-touch counter checkout kiosk with 48px+ buttons, barcode scanner integration, and cash drawer solenoid control.',
    statesDefined: { ideal: true, empty: true, loading: true, partial: true, error: true }
  },
  {
    id: 'site-pos-split',
    title: 'Split-Tender Payment Drawer',
    route: '/pos/split-tender',
    parentRoute: '/pos',
    role: 'Clerk',
    layoutType: 'Center Peek Drawer',
    status: 'In Prototype',
    icon: 'Sliders',
    notes: 'Interactive dual-slider allowing customers to pay partly in cash and partly using store credit balance.',
    statesDefined: { ideal: true, empty: true, loading: true, partial: true, error: true }
  },
  {
    id: 'site-buylist',
    title: 'Buylist Optical Intake Queue',
    route: '/buylist',
    role: 'Clerk',
    layoutType: 'POS Kiosk',
    status: 'In Prototype',
    icon: 'Workflow',
    notes: 'High-speed card acquisition engine with 1-tap condition grading, real-time TCGplayer market spreads, and instant trade voucher generation.',
    statesDefined: { ideal: true, empty: true, loading: true, partial: true, error: true }
  },
  {
    id: 'site-buylist-vault',
    title: 'High-End Vault Safe Drop',
    route: '/buylist/vault-drop',
    parentRoute: '/buylist',
    role: 'Manager',
    layoutType: 'Center Peek Drawer',
    status: 'Wireframing',
    icon: 'ShieldCheck',
    notes: 'Verification modal for cards valued >$250 requiring manager approval pin and serialized security envelope scan.',
    statesDefined: { ideal: true, empty: true, loading: true, partial: false, error: true }
  },
  {
    id: 'site-inventory',
    title: 'Singles Inventory Grid Matrix',
    route: '/inventory',
    role: 'Store Owner',
    layoutType: 'Desktop Grid',
    status: 'Shipped',
    icon: 'Layout',
    notes: 'Linear-inspired 28px row desktop matrix for managing 30,000+ card SKUs with inline pricing and multi-channel sync badges.',
    statesDefined: { ideal: true, empty: true, loading: true, partial: true, error: true }
  },
  {
    id: 'site-inventory-rules',
    title: 'Automated Margin & Sync Rules',
    route: '/inventory/bulk-price',
    parentRoute: '/inventory',
    role: 'Store Owner',
    layoutType: 'Desktop Grid',
    status: 'Wireframing',
    icon: 'TrendingUp',
    notes: 'Global rule engine for setting channel markup (+12% eBay, 0% in-store) and competitive market price recalculations.',
    statesDefined: { ideal: true, empty: true, loading: true, partial: false, error: false }
  },
  {
    id: 'site-tournaments',
    title: 'Swiss Tournament Pairing Engine',
    route: '/tournaments',
    role: 'Clerk',
    layoutType: 'Desktop Grid',
    status: 'Concept',
    icon: 'Target',
    notes: 'Algorithmic bracket manager with 3-second player check-in, automated round pairings, and TV projector broadcast view.',
    statesDefined: { ideal: true, empty: true, loading: true, partial: false, error: false }
  },
  {
    id: 'site-tournaments-timer',
    title: 'Wall Projector Round Timer Kiosk',
    route: '/tournaments/timer',
    parentRoute: '/tournaments',
    role: 'Clerk',
    layoutType: 'POS Kiosk',
    status: 'Concept',
    icon: 'Clock',
    notes: 'High-visibility 50-minute round clock and table seating assignment display designed for store wall monitors.',
    statesDefined: { ideal: true, empty: true, loading: false, partial: false, error: false }
  },
  {
    id: 'site-collector',
    title: 'Collector Storefront & 3D Tilt Vault',
    route: '/collector',
    role: 'Collector',
    layoutType: 'Mobile View',
    status: 'In Prototype',
    icon: 'Eye',
    notes: 'Signature collector storefront featuring responsive 3D card tilt with realistic holographic glare and PSA certification checks.',
    statesDefined: { ideal: true, empty: true, loading: true, partial: true, error: true }
  },
  {
    id: 'site-settings-margins',
    title: 'Hardware Hub & Buy/Sell Margins',
    route: '/settings/margins',
    role: 'Store Owner',
    layoutType: 'Desktop Grid',
    status: 'Shipped',
    icon: 'Sliders',
    notes: 'Central configuration for thermal printer ESC/POS baud rates, barcode scanner prefixes, and gross margin floors.',
    statesDefined: { ideal: true, empty: true, loading: true, partial: true, error: true }
  }
];

export const INITIAL_SCREEN_STATES: UxScreenStateSpec[] = [
  {
    screenId: 'screen-buylist',
    screenTitle: 'Counter Buylist Intake Queue',
    route: '/buylist',
    idealStateNotes: 'Displays 12 active trade queues, live TCGplayer market prices, condition badges, and total cash/credit payout tabs.',
    emptyStateTitle: 'No Active Trade-Ins',
    emptyStateAction: '+ Scan First Raw Card (Barcode or Space)',
    loadingSkeletonPattern: 'Subtle pulse skeleton matching 4-column card row geometry (<250ms perceived).',
    partialStateRules: 'When only 1 card is present, table row does not stretch awkwardly; shows quick-add next slot.',
    errorRecoveryAction: 'Offline fallback: Uses daily local SQLite cache with 1-tap manual sync retry.',
    designComplete: true
  },
  {
    screenId: 'screen-inventory',
    screenTitle: 'Singles Inventory Matrix',
    route: '/inventory',
    idealStateNotes: 'Dense 28px rows with virtualized infinite scrolling across 30,000+ SKUs with live eBay/TCGplayer badges.',
    emptyStateTitle: 'Your Inventory is Empty',
    emptyStateAction: 'Import CSV from BinderPOS or TCGplayer',
    loadingSkeletonPattern: 'Linear skeleton rows with shimmer wave animation matching column widths.',
    partialStateRules: 'Maintains fixed table headers with subtle empty rows indicator.',
    errorRecoveryAction: 'Shows connection alert toast with background retry queue.',
    designComplete: true
  },
  {
    screenId: 'screen-pos',
    screenTitle: 'Fast-Touch Counter Register',
    route: '/pos',
    idealStateNotes: '48px+ quick-touch buttons, active cart with subtotal, tax calculation, and 1-tap customer loyalty.',
    emptyStateTitle: 'Cart Ready for Next Customer',
    emptyStateAction: 'Scan Barcode or Tap Fast-Add Category',
    loadingSkeletonPattern: 'Instant optimistic local state; zero spinner during checkout.',
    partialStateRules: 'Cart list scrolls smoothly with sticky bottom checkout bar.',
    errorRecoveryAction: 'Receipt printer timeout falls back to instant SMS/Email digital slip.',
    designComplete: true
  },
  {
    screenId: 'screen-tournaments',
    screenTitle: 'Swiss Tournament Bracket Matrix',
    route: '/tournaments',
    idealStateNotes: '32-player live pairings with table numbers, match scores (2-0, 2-1), and round countdown timer.',
    emptyStateTitle: 'No Active Tournaments Scheduled',
    emptyStateAction: 'Create Friday Night Magic Event',
    loadingSkeletonPattern: 'Grid cards pulse with round placeholder numbers.',
    partialStateRules: 'Handles odd-player counts by auto-assigning 3-point bye.',
    errorRecoveryAction: 'Allows manual table override and pairing re-computation.',
    designComplete: false
  },
  {
    screenId: 'screen-collector',
    screenTitle: 'Collector Showcase & 3D Tilt Vault',
    route: '/collector',
    idealStateNotes: 'High-res card scans with interactive 3D holographic tilt, PSA slab certification badges, and market sparklines.',
    emptyStateTitle: 'No Showcase Cards Featured',
    emptyStateAction: 'Add Top 10 High-End Slabs to Showcase',
    loadingSkeletonPattern: 'Holographic shimmer card placeholder with 3:4 aspect ratio.',
    partialStateRules: 'Single card renders centered in gallery mode with inspection controls.',
    errorRecoveryAction: 'High-res image load error gracefully falls back to vector card placeholder.',
    designComplete: true
  }
];

export const INITIAL_UX_KANBAN_TASKS: UxKanbanTask[] = [
  {
    id: 'k-1',
    title: 'Counter trade bottleneck during rush hour',
    flowCategory: 'Buylist',
    column: 'jtbd',
    priority: 'Critical',
    persona: 'Counter Clerk Jake',
    description: 'Map out the 30-second trade-in goal and interview 3 clerks regarding un-sleeved card grading delays.'
  },
  {
    id: 'k-2',
    title: 'Split-payment dual slider drawer wireframes',
    flowCategory: 'POS',
    column: 'wireframe',
    priority: 'High',
    persona: 'Counter Clerk Jake',
    description: 'Create low-fidelity wireframes for balancing store credit vs cash payouts with touch pads >= 48px.'
  },
  {
    id: 'k-3',
    title: 'Interactive 3D Holographic Tilt Card prototype',
    flowCategory: 'Storefront',
    column: 'figma',
    priority: 'High',
    persona: 'Grail Collector Sarah',
    description: 'Build interactive Figma and Framer prototypes demonstrating gyroscope and cursor angle glare shader.'
  },
  {
    id: 'k-4',
    title: '2-Keystroke fuzzy search usability testing',
    flowCategory: 'Buylist',
    column: 'tested',
    priority: 'Critical',
    persona: 'Counter Clerk Jake',
    description: 'Run 5 usability test sessions measuring time-to-find vintage Base Set holos vs TCGplayer search.'
  },
  {
    id: 'k-5',
    title: 'Dense 28px inventory row inline pricing cells spec',
    flowCategory: 'Inventory',
    column: 'dev_ready',
    priority: 'Critical',
    persona: 'Store Owner Sadid',
    description: 'Finalize design token specs, keyboard hotkeys (Enter/Tab), and WCAG contrast ratios for developer handoff.'
  },
  {
    id: 'k-6',
    title: 'Nielsen heuristic status banners in production',
    flowCategory: 'POS',
    column: 'shipped',
    priority: 'Medium',
    persona: 'Store Owner Sadid',
    description: 'Verified live status pill and 1-click undo snackbar in production register with zero console errors.'
  }
];

export const INITIAL_HEURISTIC_AUDITS: HeuristicAuditItem[] = [
  {
    id: 1,
    name: '1. Visibility of System Status',
    summary: 'Keep users informed about what is happening through appropriate feedback within reasonable time.',
    aeethodExample: 'Live status pill displays: "✓ Connected to @the_tcg_baddie (511 followers) • Syncing 6 reels..."',
    status: 'Pass',
    notes: 'Real-time banners provide instant verification during Meta API syncing.',
    severity: 'None'
  },
  {
    id: 2,
    name: '2. Match Between System and the Real World',
    summary: 'Speak the users\' language with words, phrases, and concepts familiar to the user rather than internal jargon.',
    aeethodExample: 'Using "Buylist Intake" and "PSA 10 Slab" instead of "Inventory Acquisition Sub-Module".',
    status: 'Pass',
    notes: 'Terminology matches real retail card counter conversations perfectly.',
    severity: 'None'
  },
  {
    id: 3,
    name: '3. User Control and Freedom',
    summary: 'Provide a clearly marked emergency exit to leave the unwanted state without an extended dialogue.',
    aeethodExample: '1-click "Undo" snackbar when an item is deleted from the counter trade cart.',
    status: 'Pass',
    notes: 'Esc key dismisses modals; non-destructive actions feature quick undo.',
    severity: 'None'
  },
  {
    id: 4,
    name: '4. Consistency and Standards',
    summary: 'Users should not have to wonder whether different words, situations, or actions mean the same thing.',
    aeethodExample: 'Condition badges (Near Mint, Lightly Played, etc.) maintain identical colors across all views.',
    status: 'Pass',
    notes: 'Standardized on Plus Jakarta Sans for UI and JetBrains Mono for pricing numbers.',
    severity: 'None'
  },
  {
    id: 5,
    name: '5. Error Prevention',
    summary: 'Eliminate error-prone conditions or check for them and present users with a confirmation option.',
    aeethodExample: 'Disabling Cash Payout button if store cash drawer balance is lower than trade payout.',
    status: 'Pass',
    notes: 'Prevents negative cash balances before transactions can be committed.',
    severity: 'None'
  },
  {
    id: 6,
    name: '6. Recognition Rather than Recall',
    summary: 'Minimize user memory load by making elements, actions, and options visible.',
    aeethodExample: 'Fuzzy search dropdown shows card artwork thumbnails as the clerk types.',
    status: 'Pass',
    notes: 'Visual recognition allows clerks to verify foil cards in 1 second.',
    severity: 'None'
  },
  {
    id: 7,
    name: '7. Flexibility and Efficiency of Use',
    summary: 'Accelerators unseen by novice users may speed up the interaction for expert users.',
    aeethodExample: 'Numpad shortcuts (1-5 for card conditions, Enter to accept trade) allow mouse-free counter ops.',
    status: 'Pass',
    notes: 'Both touchscreen tap and keyboard power-user shortcuts are supported.',
    severity: 'None'
  },
  {
    id: 8,
    name: '8. Aesthetic and Minimalist Design',
    summary: 'Dialogues should not contain information that is irrelevant or rarely needed.',
    aeethodExample: 'POS counter view strips away all non-critical widgets; only card, grade, and payout are shown.',
    status: 'Pass',
    notes: 'High signal-to-noise ratio prevents clerk fatigue during long shifts.',
    severity: 'None'
  },
  {
    id: 9,
    name: '9. Help Users Recognize, Diagnose, and Recover from Errors',
    summary: 'Error messages should be expressed in plain language, indicate the problem, and suggest a solution.',
    aeethodExample: 'Instead of "Error 500", displays: "Card SKU #402 not found in Base Set. Did you mean Base Set 2?"',
    status: 'Pass',
    notes: 'All API exceptions are mapped to human-readable recovery suggestions.',
    severity: 'None'
  },
  {
    id: 10,
    name: '10. Help and Documentation',
    summary: 'Provide documentation that is easy to search, focused on user tasks, and lists concrete steps.',
    aeethodExample: 'Inline tooltips on margin calculations explain how the 65% cash vs 80% credit formula works.',
    status: 'Pass',
    notes: 'Contextual tooltips exist on all complex economic levers.',
    severity: 'None'
  }
];

export const INITIAL_UX_METRIC_TARGETS: UxMetricTarget[] = [
  {
    id: 'm-1',
    name: 'Activation Rate (First Value <48h)',
    category: 'Activation',
    targetValue: '> 60%',
    currentValue: '64%',
    status: 'Exceeding',
    businessImpact: 'Stores reach positive ROI within 2 days of signup, cutting early trial churn.'
  },
  {
    id: 'm-2',
    name: '50-Card Buylist Intake Velocity',
    category: 'Speed',
    targetValue: '< 45s',
    currentValue: '32s',
    status: 'Exceeding',
    businessImpact: 'Saves 38 minutes per trade day, allowing stores to handle 3x more weekend trade-ins.'
  },
  {
    id: 'm-3',
    name: 'Clerk Mis-click & Error Rate',
    category: 'Quality',
    targetValue: '< 3.0%',
    currentValue: '1.8%',
    status: 'On Track',
    businessImpact: 'Prevents expensive inventory mis-pricings and double-sale chargebacks.'
  },
  {
    id: 'm-4',
    name: 'System Usability Scale (SUS Score)',
    category: 'Satisfaction',
    targetValue: '> 75 / 100',
    currentValue: '84 / 100',
    status: 'Exceeding',
    businessImpact: 'Grade A usability drives organic word-of-mouth referrals across LGS store owners.'
  },
  {
    id: 'm-5',
    name: 'Time to First Live Sale (TTV)',
    category: 'Activation',
    targetValue: '< 3 days',
    currentValue: '2.1 days',
    status: 'On Track',
    businessImpact: 'Fastest onboarding in the TCG industry compared to 3-week legacy setups.'
  },
  {
    id: 'm-6',
    name: 'Net Promoter Score (NPS)',
    category: 'Satisfaction',
    targetValue: '> +40',
    currentValue: '+48',
    status: 'Exceeding',
    businessImpact: 'High customer loyalty ensures recurring $149/mo subscription durability.'
  }
];

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
