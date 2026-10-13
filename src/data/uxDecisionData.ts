export type UxDecisionStatus = 'Draft' | 'Under Review' | 'Law Verified' | 'Shipped';

export type CoreUxTerm =
  | 'Mental Model'
  | 'Cognitive Load'
  | 'Affordance & Signifiers'
  | 'Information Architecture'
  | 'Progressive Disclosure'
  | 'Feedback Loop'
  | 'Good vs Bad Friction'
  | 'Error Forgiveness'
  | 'Time-to-Value (TTV)'
  | 'Task Success Rate'
  | 'Contextual Inquiry'
  | 'Jobs-to-be-Done (JTBD)';

export interface UxDecisionRecord {
  id: string;
  title: string;
  problem: string;
  contextPersona: string;
  decision: string;
  alternativesRejected: string;
  taggedTerms: CoreUxTerm[];
  verifiedLawIds: string[];
  status: UxDecisionStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CoreUxTermDefinition {
  term: CoreUxTerm;
  category: 'Cognitive' | 'Structural' | 'Interaction' | 'Measurement';
  definition: string;
  retailSaaSExample: string;
}

export interface UxPsychologyLaw {
  id: string;
  name: string;
  scientificLaw: string;
  summary: string;
  formulaOrRule: string;
  retailSaaSApplication: string;
}

export interface NielsenHeuristic {
  id: string;
  heuristicNumber: number;
  name: string;
  summary: string;
  retailSaaSApplication: string;
}

export const CORE_UX_TERMS: CoreUxTermDefinition[] = [
  {
    term: 'Mental Model',
    category: 'Cognitive',
    definition: 'What the user believes about how the system works, formed by prior life and retail experiences.',
    retailSaaSExample: 'Card shop owners think in terms of "Physical Binders" and "Counter Cash Drawers". Software must mirror these physical concepts rather than database tables.'
  },
  {
    term: 'Cognitive Load',
    category: 'Cognitive',
    definition: 'The total amount of working memory resources needed to process information and complete a task.',
    retailSaaSExample: 'Do not make clerks compute 30% store credit bonuses in their head during a rush. Show both Cash and Credit side-by-side automatically.'
  },
  {
    term: 'Affordance & Signifiers',
    category: 'Interaction',
    definition: 'Affordance is the possible action (e.g. clickable); signifier is the visual cue showing where and how to act.',
    retailSaaSExample: 'Table cells with a subtle pencil icon or dashed underline indicate inline editability without requiring a modal.'
  },
  {
    term: 'Information Architecture',
    category: 'Structural',
    definition: 'The structural design of shared information environments, navigation pathways, and labeling.',
    retailSaaSExample: 'Separating frontline POS checkout (/pos) from back-office pricing spreads (/settings) to avoid cluttered clerk navigation.'
  },
  {
    term: 'Progressive Disclosure',
    category: 'Interaction',
    definition: 'An interaction technique where information and advanced capabilities are deferred to secondary screens until requested.',
    retailSaaSExample: 'Show standard card pricing initially. Reveal condition grade notes and serial numbers only when clicking "Flag Flaw".'
  },
  {
    term: 'Feedback Loop',
    category: 'Interaction',
    definition: 'Immediate sensory confirmation (visual, audible, or haptic) letting the user know their action was registered.',
    retailSaaSExample: 'A crisp 880Hz audio chime and emerald pulse within <100ms when a barcode scan successfully adds a card to the trade cart.'
  },
  {
    term: 'Good vs Bad Friction',
    category: 'Interaction',
    definition: 'Bad friction slows down repeated tasks (unnecessary clicks). Good friction prevents disastrous irreversible mistakes.',
    retailSaaSExample: 'Bad friction: requiring password to approve an 80-cent common card. Good friction: requiring 2-finger confirm to de-list 5,000 cards on eBay.'
  },
  {
    term: 'Error Forgiveness',
    category: 'Interaction',
    definition: 'Designing the system so that user slips are easily reversible with zero penalty or panic.',
    retailSaaSExample: 'A persistent 6-second "Undo Item Removal" snackbar when an item is accidentally deleted from the trade intake list.'
  },
  {
    term: 'Time-to-Value (TTV)',
    category: 'Measurement',
    definition: 'The time it takes for a new user to realize the first core value benefit after onboarding.',
    retailSaaSExample: 'Store owners importing a 10,000-card CSV should see their first synced sale within 72 hours of signing up.'
  },
  {
    term: 'Task Success Rate',
    category: 'Measurement',
    definition: 'The percentage of users who successfully complete a specific workflow without external assistance or errors.',
    retailSaaSExample: '98% of clerks should complete a 20-card trade intake without asking a store manager for help.'
  },
  {
    term: 'Contextual Inquiry',
    category: 'Measurement',
    definition: 'Observing and interviewing users in their actual physical environment while they do their work.',
    retailSaaSExample: 'Standing next to the counter clerk on Friday Night Magic with an iPad to observe lighting glare and barcode scanning ergonomics.'
  },
  {
    term: 'Jobs-to-be-Done (JTBD)',
    category: 'Cognitive',
    definition: 'The underlying human progress or problem a customer hires your product to accomplish.',
    retailSaaSExample: '"When a customer dumps 100 raw cards on my counter, I want to calculate an offer in under 60 seconds, so that I don\'t lose money or create a line."'
  }
];

export const UX_PSYCHOLOGY_LAWS: UxPsychologyLaw[] = [
  {
    id: 'law-fitts',
    name: "Fitts's Law",
    scientificLaw: "T = a + b * log2(2D / W)",
    summary: "The time required to rapidly move to a target area is a function of the ratio between the distance to the target and the width of the target.",
    formulaOrRule: "Target size >= 48px on touchscreens; primary actions placed close to the user's natural resting hand position.",
    retailSaaSApplication: "Counter checkout cash/credit buttons must be at least 48px to 64px on iPads so standing clerks never miss-tap."
  },
  {
    id: 'law-hicks',
    name: "Hick's Law",
    scientificLaw: "RT = a + b * log2(n)",
    summary: "The time it takes to make a decision increases logarithmically with the number and complexity of choices presented.",
    formulaOrRule: "Minimize options to 3-5 high-probability choices; group complex filters into progressive tiers.",
    retailSaaSApplication: "During card grading, present only 5 distinct condition pills (NM, LP, MP, HP, DMG) rather than a 10-point slider."
  },
  {
    id: 'law-millers',
    name: "Miller's Law",
    scientificLaw: "Working Memory Capacity = 7 ± 2",
    summary: "The average person can only keep 7 (plus or minus 2) items in their working memory at one time.",
    formulaOrRule: "Organize complex retail data into digestible chunks (groups of 5-7 elements).",
    retailSaaSApplication: "Group card details into 3 distinct visual chunks: Identity (Name/Set), Condition (Grade/Centering), and Financials (Market/Offer)."
  },
  {
    id: 'law-jakobs',
    name: "Jakob's Law",
    scientificLaw: "Mental Transfer Effect",
    summary: "Users spend most of their time on other websites and apps. They expect your product to work like other software they already know.",
    formulaOrRule: "Adopt standard interaction paradigms (Cmd+K search, shopping cart on top right, undo snackbar on bottom left).",
    retailSaaSApplication: "Use familiar e-commerce and POS patterns instead of inventing exotic gestures that confuse seasonal retail clerks."
  },
  {
    id: 'law-doherty',
    name: "Doherty Threshold",
    scientificLaw: "Response Latency < 400ms",
    summary: "Productivity soars when a computer and its users interact at a pace (<400ms) that ensures neither has to wait on the other.",
    formulaOrRule: "Provide optimistic UI updates or skeleton waves in <100ms; avoid blocking spinners.",
    retailSaaSApplication: "When scanning a barcode, show the card row in the intake list instantly via local cache, syncing market prices asynchronously."
  },
  {
    id: 'law-postels',
    name: "Postel's Law (Robustness Principle)",
    scientificLaw: "Liberal in what you accept, conservative in what you send",
    summary: "Be empathetic and flexible in what you accept from the user, but rigorous and clear in what you output.",
    formulaOrRule: "Support typos, flexible barcode formats, and loose card abbreviations; output standardized canonical SKUs.",
    retailSaaSApplication: "If a clerk types 'char base 4' into search, automatically recognize 'Charizard #4 Base Set' without error dialogs."
  },
  {
    id: 'law-peakend',
    name: "Peak-End Rule",
    scientificLaw: "Cognitive Memory Bias",
    summary: "People judge an experience largely based on how they felt at its peak (most intense point) and at its end, rather than the average.",
    formulaOrRule: "Engineer memorable positive feedback at the final step of a stressful workflow.",
    retailSaaSApplication: "Celebrate completing a 50-card trade intake with a clean total payout card and a crisp 1-second printed voucher."
  },
  {
    id: 'law-proximity',
    name: "Law of Proximity (Gestalt)",
    scientificLaw: "Spatial Perceptual Grouping",
    summary: "Objects that are near, or proximate to each other, tend to be grouped together by the human brain.",
    formulaOrRule: "Place labels immediately adjacent to inputs; separate unrelated actions with whitespace.",
    retailSaaSApplication: "Keep the Store Credit Bonus (+30%) visually grouped with the Store Credit Payout button, not scattered across the screen."
  },
  {
    id: 'law-zeigarnik',
    name: "Zeigarnik Effect",
    scientificLaw: "Task Tension Memory Bias",
    summary: "People remember uncompleted or interrupted tasks better than completed tasks.",
    formulaOrRule: "Use progress indicators and incomplete checklists to motivate onboarding completion.",
    retailSaaSApplication: "A 4-step onboarding progress bar ('3 of 4 channels connected') dramatically increases completion rates."
  },
  {
    id: 'law-aesthetic',
    name: "Aesthetic-Usability Effect",
    scientificLaw: "Emotional Perception Bias",
    summary: "Users often perceive aesthetically pleasing design as design that is more usable and trustworthy.",
    formulaOrRule: "Maintain consistent border radiuses, clean typography, and balanced whitespace to build store owner trust.",
    retailSaaSApplication: "Store owners trust financial calculations more when rendered in clean tabular mono fonts on dark obsidian surfaces."
  }
];

export const NIELSEN_HEURISTICS: NielsenHeuristic[] = [
  {
    id: 'nh-1',
    heuristicNumber: 1,
    name: 'Visibility of System Status',
    summary: 'The design should always keep users informed about what is going on, through appropriate feedback within reasonable time.',
    retailSaaSApplication: 'Live status pill: "✓ Connected to eBay (180ms sync) • 42 listings active".'
  },
  {
    id: 'nh-2',
    heuristicNumber: 2,
    name: 'Match Between System and Real World',
    summary: 'The design should speak the users\' language, with words, phrases, and concepts familiar to the user rather than internal jargon.',
    retailSaaSApplication: 'Use terms like "Buylist Intake", "Slab", and "Trade In" instead of "Inventory Ingestion Module".'
  },
  {
    id: 'nh-3',
    heuristicNumber: 3,
    name: 'User Control and Freedom',
    summary: 'Users often perform actions by mistake. They need a clearly marked emergency exit to leave the unwanted state without extended effort.',
    retailSaaSApplication: '1-click "Undo" button on card deletion; Esc key dismisses all counter drawers.'
  },
  {
    id: 'nh-4',
    heuristicNumber: 4,
    name: 'Consistency and Standards',
    summary: 'Users should not have to wonder whether different words, situations, or actions mean the same thing. Follow platform conventions.',
    retailSaaSApplication: 'Near Mint is always emerald (#10b981), Damaged is always red (#f43f5e) across all screens.'
  },
  {
    id: 'nh-5',
    heuristicNumber: 5,
    name: 'Error Prevention',
    summary: 'Prevent problems from occurring in the first place, or check for them and confirm before users commit to the action.',
    retailSaaSApplication: 'Disable the "Cash Payout" button if store cash drawer balance is lower than the trade value.'
  },
  {
    id: 'nh-6',
    heuristicNumber: 6,
    name: 'Recognition Rather Than Recall',
    summary: 'Minimize user memory load by making elements, actions, and options visible. The user should not have to remember information from one part to another.',
    retailSaaSApplication: 'Show high-resolution card artwork thumbnails in the search dropdown so clerks recognize foil variants visually.'
  },
  {
    id: 'nh-7',
    heuristicNumber: 7,
    name: 'Flexibility and Efficiency of Use',
    summary: 'Shortcuts—unseen by novice users—may speed up the interaction for expert users such that the design caters to both.',
    retailSaaSApplication: 'Novices tap screen buttons; expert clerks use Numpad keys 1-5 for grades and Spacebar for barcode trigger.'
  },
  {
    id: 'nh-8',
    heuristicNumber: 8,
    name: 'Aesthetic and Minimalist Design',
    summary: 'Interfaces should not contain information that is irrelevant or rarely needed. Every extra unit of information competes with relevant units.',
    retailSaaSApplication: 'Strip away non-essential analytics from the counter POS screen during checkout rush.'
  },
  {
    id: 'nh-9',
    heuristicNumber: 9,
    name: 'Help Users Recognize, Diagnose, and Recover from Errors',
    summary: 'Error messages should be expressed in plain language (no error codes), precisely indicate the problem, and constructively suggest a solution.',
    retailSaaSApplication: '"Thermal printer is out of paper. Please reload roll or toggle SMS receipt." (Not "ERR_IO_504").'
  },
  {
    id: 'nh-10',
    heuristicNumber: 10,
    name: 'Help and Documentation',
    summary: 'Even though it is better if the system can be used without documentation, it may be necessary to provide help and documentation.',
    retailSaaSApplication: 'Contextual tooltips explaining buylist margin spread calculations right next to the percentage input.'
  }
];

// Clean empty starting state - Zero pre-inputted dummy records!
export const INITIAL_UX_DECISION_RECORDS: UxDecisionRecord[] = [];
