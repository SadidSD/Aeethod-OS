export interface FingerprintDimension {
  number: number;
  name: string;
  layer: 'Layer 1: Identity' | 'Layer 2: SKU Variant' | 'Layer 3: Physical Instance';
  sqlColumn: string;
  exampleDisambiguation: string;
  priceGapExample: string;
  scanDifficulty: 'Easy' | 'Hard' | 'Impossible';
  autoScanAccuracy: string;
  scanExplanation: string;
  tcgplayerAppStatus: string;
  collectorAppsStatus: string;
  hardwareSorterStatus: string;
  marketGapStatus: 'Solved' | 'Partial' | 'Untouched';
}

export interface FingerprintKeyExample {
  id: string;
  title: string;
  subtitle: string;
  priceComparison: string;
  fingerprintKey: string;
  segments: {
    label: string;
    code: string;
    dimension: string;
    meaning: string;
    isCriticalDifferentiator?: boolean;
  }[];
}

export interface HistoricalEraSpec {
  id: string;
  eraNumber: number;
  nameEn: string;
  nameJp: string;
  years: string;
  borderColor: 'Yellow' | 'Silver' | 'Yellow / Silver';
  setAndNumberPosition: string;
  keyMechanics: string[];
  criticalScannerQuirks: string[];
}

export interface PrintRunRule {
  enumCode: string;
  title: string;
  validSetsEn: string;
  validSetsJp: string;
  visualIdentifier: string;
  scannerRule: string;
  priceImpact: string;
}

export interface WotcSetPrintMatrix {
  num: number;
  setName: string;
  releaseYear: number;
  has1stEdition: boolean;
  hasShadowless: boolean;
  hasUnlimited: boolean;
  has4thPrint1999_2000: string;
  specialNotes: string;
}

export interface OfficialLanguageSpec {
  num: number;
  language: string;
  dbCode: string;
  ecosystem: 'Western (TPCi)' | 'Asian (TPC Japan)' | 'Discontinued Historical';
  saasTier: 'Tier 1: Day-1 Mandatory (96%)' | 'Tier 2: Collector Expansion (3%)' | 'Tier 3: EU Regional' | 'Skip (Manual Override)';
  marketShare: string;
  activeYears: string;
  cardBack: string;
  scannerAndDbNotes: string;
}

export interface FoilBulkSpec {
  id: string;
  name: string;
  dbEnum: string;
  comesInBulk: 'Massive Bulk' | 'Semi-Bulk' | 'Hidden in Bulk by Accident' | 'Never Bulk';
  bulkBuyRate: string;
  retailRange: string;
  visualPhysics: string;
  scannerStrategy: string;
}

export interface StampZoneSpec {
  id: string;
  name: string;
  dbEnum: string;
  cardLocation: string;
  coordinatesLabel: string;
  priceMultiplier: string;
  realWorldExample: string;
  scannerTrapWarning: string;
}

export interface CollectorNumberEdgeCase {
  category: string;
  examples: string[];
  explanation: string;
  sqlNormalization: string;
}

export interface RaritySymbolSpec {
  code: string;
  name: string;
  jpEquivalent: string;
  symbol: string;
  era: string;
  surfaceFinish: string;
}

export interface EtlPipelineStage {
  stage: number;
  title: string;
  sourceName: string;
  sourceUrl: string;
  targetTables: string;
  whatItPopulates: string[];
  engineeringTrick: string;
}

// ============================================================================
// 1. THE 14-POINT CARD FINGERPRINT MASTER MATRIX
// ============================================================================
export const FOURTEEN_POINT_FINGERPRINTS: FingerprintDimension[] = [
  {
    number: 1,
    name: 'Language & Regional Print',
    layer: 'Layer 1: Identity',
    sqlColumn: 'expansions.language',
    exampleDisambiguation: 'English (EN) vs. Japanese (JP) vs. Simplified Chinese (ZH-CN)',
    priceGapExample: 'EN Moonbreon ($1,200) vs. ZH-CN Moonbreon ($280)',
    scanDifficulty: 'Easy',
    autoScanAccuracy: '99.9%',
    scanExplanation: 'Japanese kana/kanji + sv2a set pills vs. English Latin text + MEW EN pills separate instantly.',
    tcgplayerAppStatus: '❌ Manual toggle (EN only)',
    collectorAppsStatus: '⚠️ Confuses EN/JP on Full Arts',
    hardwareSorterStatus: '✅ Reads language code',
    marketGapStatus: 'Partial'
  },
  {
    number: 2,
    name: 'Era / Series Block',
    layer: 'Layer 1: Identity',
    sqlColumn: 'expansions.era_block',
    exampleDisambiguation: 'WotC (1999) vs. EX Series (2004) vs. Scarlet & Violet (2023)',
    priceGapExample: 'Defines template geometry & where the scanner looks for numbers/stamps',
    scanDifficulty: 'Easy',
    autoScanAccuracy: '99.8%',
    scanExplanation: 'Border color (Yellow vs. Silver), HP placement, and template layout lock the Era immediately.',
    tcgplayerAppStatus: '✅ Derived from card match',
    collectorAppsStatus: '✅ Derived from card match',
    hardwareSorterStatus: '✅ Derived from card match',
    marketGapStatus: 'Solved'
  },
  {
    number: 3,
    name: 'Expansion Set & Sub-Set / Gallery',
    layer: 'Layer 1: Identity',
    sqlColumn: 'expansions.set_code + subset_type',
    exampleDisambiguation: 'Crown Zenith Main Set vs. Galarian Gallery (GG); Base Set vs. Base Set 2',
    priceGapExample: '1999 Base Set Charizard ($400) vs. Base Set 2 Charizard ($180)',
    scanDifficulty: 'Hard',
    autoScanAccuracy: '99% (Unique Art) / 85% (Reprints)',
    scanExplanation: 'Unique artwork matches in <8ms. Same-artwork reprints (Base vs Base 2, or Ultra Ball across 6 sets) require reading the tiny set symbol/code.',
    tcgplayerAppStatus: '⚠️ Confuses same-art reprints',
    collectorAppsStatus: '⚠️ Picks wrong set on Trainer reprints',
    hardwareSorterStatus: '✅ Reads set symbol',
    marketGapStatus: 'Partial'
  },
  {
    number: 4,
    name: 'Artwork / Mechanical Version',
    layer: 'Layer 1: Identity',
    sqlColumn: 'card_identities.art_embedding',
    exampleDisambiguation: 'Pikachu ex Regular (#057) vs. Full Art (#219) vs. Special Illustration Rare (#238)',
    priceGapExample: 'Surging Sparks Pikachu ex Regular ($4) vs. SIR #238 ($420)',
    scanDifficulty: 'Easy',
    autoScanAccuracy: '99.9%',
    scanExplanation: 'The easiest part of scanning. pgvector + dHash separates Regular ex, Full Art, and SIR in <8ms even at a 25° angle.',
    tcgplayerAppStatus: '✅ Matches artwork',
    collectorAppsStatus: '✅ Matches artwork',
    hardwareSorterStatus: '✅ Matches artwork',
    marketGapStatus: 'Solved'
  },
  {
    number: 5,
    name: 'Collector Number & Alphanumeric Suffix',
    layer: 'Layer 1: Identity',
    sqlColumn: 'card_identities.number_raw / number_suffix',
    exampleDisambiguation: '004/102 (Standard), 199/165 (Secret Rare), 105a/124 (Yellow A-Box Alt Art), Unnumbered (1996 JP)',
    priceGapExample: 'N #105/124 ($3) vs. N #105a/124 Alternate Art ($115)',
    scanDifficulty: 'Easy',
    autoScanAccuracy: '96%',
    scanExplanation: 'Easy on standard cards. Hard on shiny Gold Hyper Rares under glare. Note: 1996–2000 Japanese cards have NO printed numbers (rely 100% on artwork vector).',
    tcgplayerAppStatus: '✅ Standard / ❌ Fails on 105a',
    collectorAppsStatus: '✅ Standard / ❌ Fails on Gold glare',
    hardwareSorterStatus: '✅ High-res OCR',
    marketGapStatus: 'Solved'
  },
  {
    number: 6,
    name: 'Rarity Tier',
    layer: 'Layer 1: Identity',
    sqlColumn: 'card_identities.rarity',
    exampleDisambiguation: 'Common (●), Double Rare (★★), Illustration Rare (IR), Special Illustration Rare (SIR), Hyper Rare (★★★)',
    priceGapExample: '1996 JP Base Set With Rarity ($40) vs. No Rarity Symbol ($1,500+)',
    scanDifficulty: 'Easy',
    autoScanAccuracy: '99.5%',
    scanExplanation: 'Automatically known from the database once Layer 1 Card Identity is locked (except 1996 JP No Rarity error check).',
    tcgplayerAppStatus: '✅ Inherited from card',
    collectorAppsStatus: '✅ Inherited from card',
    hardwareSorterStatus: '✅ Inherited from card',
    marketGapStatus: 'Solved'
  },
  {
    number: 7,
    name: 'Edition & Print Run',
    layer: 'Layer 2: SKU Variant',
    sqlColumn: 'card_sku_variants.edition_print_run',
    exampleDisambiguation: '1st Edition vs. Shadowless vs. Unlimited vs. ©1999-2000 UK 4th Print vs. JP 1ED',
    priceGapExample: 'Base Set Charizard Unlimited ($400) vs. Shadowless ($1,400) vs. 1st Edition ($6,500+)',
    scanDifficulty: 'Hard',
    autoScanAccuracy: '98% (Shadowless) / 75% (4th Print)',
    scanExplanation: 'Shadowless (missing right art-box shadow) is easy. 1st Edition stamp needs a clean crop. ©1999-2000 4th Print is 4pt microscopic text at the bottom edge.',
    tcgplayerAppStatus: '❌ Blind! Defaults to Unlimited',
    collectorAppsStatus: '❌ Blind! Forces manual dropdown',
    hardwareSorterStatus: '⚠️ EN 1st Ed only; blind to 4th Print',
    marketGapStatus: 'Untouched'
  },
  {
    number: 8,
    name: 'Foil & Surface Finish',
    layer: 'Layer 2: SKU Variant',
    sqlColumn: 'card_sku_variants.foil_finish',
    exampleDisambiguation: 'Non-Holo vs. Standard Holo vs. Reverse Holo vs. Poké Ball vs. Master Ball vs. Cosmo Holo',
    priceGapExample: '151 Pikachu Poké Ball Foil ($3) vs. Master Ball Foil ($240)',
    scanDifficulty: 'Impossible',
    autoScanAccuracy: '80% (Multi-Frame Video) / <40% (1 Still Photo)',
    scanExplanation: 'In a single still photo (especially inside a sleeve), Non-Holo, Holo, Reverse Holo, and Master Ball look identical unless angled light reflects off the foil.',
    tcgplayerAppStatus: '❌ Blind! Manual dropdown only',
    collectorAppsStatus: '❌ Blind! Cannot tell Poké vs Master Ball',
    hardwareSorterStatus: '⚠️ Basic Holo only; blind to Master Ball',
    marketGapStatus: 'Untouched'
  },
  {
    number: 9,
    name: 'Promotional, Event & Retailer Stamps',
    layer: 'Layer 2: SKU Variant',
    sqlColumn: 'card_sku_variants.stamp_type',
    exampleDisambiguation: 'Unstamped ETB Promo vs. Pokémon Center Stamp vs. Prerelease / STAFF vs. 25th Anniversary',
    priceGapExample: 'SVP #044 Charmander Unstamped ($8) vs. Pokémon Center Stamped ($95)',
    scanDifficulty: 'Hard',
    autoScanAccuracy: '92%',
    scanExplanation: 'High-contrast stamps (25th Anniversary, Play! Pokémon) are easy. Gold STAFF stamps or white Pokémon Center text over bright artwork require targeted ROI crops.',
    tcgplayerAppStatus: '❌ Blind! Prices $95 card as $8 card',
    collectorAppsStatus: '❌ Blind! Confuses Celebrations w/ Base Set',
    hardwareSorterStatus: '❌ Untouched on Pokémon stamps',
    marketGapStatus: 'Untouched'
  },
  {
    number: 10,
    name: 'Deck, Border & Card Back Exclusivity',
    layer: 'Layer 2: SKU Variant',
    sqlColumn: 'card_sku_variants.deck_back_type',
    exampleDisambiguation: 'Pack-Pulled Holo vs. World Championships Deck Card (Printed Signature + Silver Border + WC Back)',
    priceGapExample: '2006 Latias Gold Star Pack Pull ($1,400) vs. World Championships Deck Version ($45)',
    scanDifficulty: 'Easy',
    autoScanAccuracy: '95% (Front Sig/Border) / 0% (Back-Only)',
    scanExplanation: 'World Championship cards have a printed player signature on the art and silver border on the front. Back-only differences require flipping the card.',
    tcgplayerAppStatus: '❌ Major Bug: Scans $45 WC as $1,400 card!',
    collectorAppsStatus: '❌ Major Bug: Scans WC as pack pull!',
    hardwareSorterStatus: '❌ Requires manual separation',
    marketGapStatus: 'Untouched'
  },
  {
    number: 11,
    name: 'Sub-Print Serial Code (EX-Era)',
    layer: 'Layer 2: SKU Variant',
    sqlColumn: 'card_sku_variants.serial_code',
    exampleDisambiguation: '2003–2007 EX-Era Commons printed with 3 distinct bottom-left codes (Code A vs. Code B vs. Code C)',
    priceGapExample: 'Tracked separately by Grandmaster Set collectors on TCGCollector & Bulbapedia',
    scanDifficulty: 'Hard',
    autoScanAccuracy: '82%',
    scanExplanation: '9-character alphanumeric code (e.g., KRF-92A-11X) printed in 4.5pt font on the bottom-left yellow border. Requires 1080p+ close-up OCR.',
    tcgplayerAppStatus: '❌ Does not exist in catalog',
    collectorAppsStatus: '❌ Ignored by camera',
    hardwareSorterStatus: '❌ Ignored by camera',
    marketGapStatus: 'Untouched'
  },
  {
    number: 12,
    name: 'Copyright Year & Regulation Mark',
    layer: 'Layer 2: SKU Variant',
    sqlColumn: 'card_sku_variants.copyright_override',
    exampleDisambiguation: 'Regulation Mark D vs. G vs. H; ©1999 Wizards vs. ©1999-2000 Wizards',
    priceGapExample: 'Base Set Unlimited ©1999 ($3) vs. UK 4th Print ©1999-2000 ($35)',
    scanDifficulty: 'Hard',
    autoScanAccuracy: '97% (Reg Mark) / 75% (Copyright Year)',
    scanExplanation: 'Regulation Mark (G, H) sits inside a high-contrast box (Easy). Copyright year is tiny 4pt text at the bottom edge (Hard).',
    tcgplayerAppStatus: '❌ Ignored by camera',
    collectorAppsStatus: '❌ Ignored by camera',
    hardwareSorterStatus: '⚠️ Reads Reg Mark only',
    marketGapStatus: 'Untouched'
  },
  {
    number: 13,
    name: 'Factory Misprints & Error Classifications',
    layer: 'Layer 3: Physical Instance',
    sqlColumn: 'card_sku_variants.catalog_error_type',
    exampleDisambiguation: 'Red Cheeks vs. Yellow Cheeks Pikachu; No Symbol Jungle; No Stage Blastoise; Miscut / Crimped',
    priceGapExample: 'Base Set Pikachu Yellow Cheeks ($3) vs. Red Cheeks ($45); Jungle Snorlax No Symbol ($250)',
    scanDifficulty: 'Hard',
    autoScanAccuracy: '90% (2D Ink/Miscut) / 0% (3D Crimp/Texture)',
    scanExplanation: 'Miscuts and Red Cheeks Pikachu are detectable via RGB/border math. 3D surface errors (Missing Texture, Pack Crimps) cannot be seen by a flat 2D camera.',
    tcgplayerAppStatus: '❌ Scans Red Cheeks as $3 Pikachu',
    collectorAppsStatus: '❌ Scans No Symbol as regular Unlimited',
    hardwareSorterStatus: '❌ Untouched',
    marketGapStatus: 'Untouched'
  },
  {
    number: 14,
    name: 'Physical Condition & Graded Slab State',
    layer: 'Layer 3: Physical Instance',
    sqlColumn: 'inventory_items.raw_condition / cert_number',
    exampleDisambiguation: 'Raw (NM / LP / MP / HP / DMG) vs. Graded Slab (PSA / BGS / CGC 1–10 + Unique Barcode Cert #)',
    priceGapExample: 'Raw NM ($400) vs. Raw HP ($140) vs. PSA 10 Slab ($8,500)',
    scanDifficulty: 'Impossible',
    autoScanAccuracy: '100% (Graded Slabs) / 0% (Raw Front-Only)',
    scanExplanation: 'Slabs are 100% easy (barcode/label OCR). True Raw Condition is IMPOSSIBLE from a single front photo because 90% of Pokémon wear is whitening on the BACK blue edges!',
    tcgplayerAppStatus: '❌ Cannot scan slabs; manual raw grade',
    collectorAppsStatus: '✅ Scans slabs / ❌ Manual raw grade',
    hardwareSorterStatus: '⚠️ Basic front centering only',
    marketGapStatus: 'Partial'
  }
];

// ============================================================================
// 2. INTERACTIVE DETERMINISTIC FINGERPRINT KEY EXAMPLES
// ============================================================================
export const FINGERPRINT_KEY_EXAMPLES: FingerprintKeyExample[] = [
  {
    id: 'zard-1ed',
    title: '1999 Base Set Charizard (1st Edition)',
    subtitle: 'WotC 1st Print Run • Shadowless Frame',
    priceComparison: '$6,500+ Raw NM (vs. $400 Unlimited)',
    fingerprintKey: 'EN:BS1:004:1ED:HOLO:NONE:STD:NONE:NONE',
    segments: [
      { label: 'LANG', code: 'EN', dimension: '#1 Language', meaning: 'English Western Print' },
      { label: 'SET', code: 'BS1', dimension: '#3 Expansion', meaning: '1999 Base Set (102 Cards)' },
      { label: 'NUM', code: '004', dimension: '#5 Collector #', meaning: 'Card 4/102' },
      { label: 'EDITION', code: '1ED', dimension: '#7 Print Run', meaning: '1st Edition Stamp + Shadowless Frame', isCriticalDifferentiator: true },
      { label: 'FOIL', code: 'HOLO', dimension: '#8 Foil Finish', meaning: 'Starlight Holofoil Art Box' },
      { label: 'STAMP', code: 'NONE', dimension: '#9 Promo Stamp', meaning: 'No Promo Overlay Stamp' },
      { label: 'DECK', code: 'STD', dimension: '#10 Deck/Back', meaning: 'Standard Blue Back (Tournament Legal)' },
      { label: 'SERIAL', code: 'NONE', dimension: '#11 Serial Code', meaning: 'Pre-EX Era (No Serial Code)' },
      { label: 'ERROR', code: 'NONE', dimension: '#13 Factory Error', meaning: 'Standard Print (No Error)' }
    ]
  },
  {
    id: 'zard-4th',
    title: 'Base Set Charizard (UK 4th Print 1999–2000)',
    subtitle: 'Identical to Unlimited except 5 tiny characters at bottom right',
    priceComparison: '$950+ Raw NM (vs. $400 Standard Unlimited)',
    fingerprintKey: 'EN:BS1:004:4TH_1999_2000:HOLO:NONE:STD:NONE:NONE',
    segments: [
      { label: 'LANG', code: 'EN', dimension: '#1 Language', meaning: 'English (UK / Australia Distribution)' },
      { label: 'SET', code: 'BS1', dimension: '#3 Expansion', meaning: 'Base Set' },
      { label: 'NUM', code: '004', dimension: '#5 Collector #', meaning: 'Card 4/102' },
      { label: 'EDITION', code: '4TH_1999_2000', dimension: '#7 & #12 Print Run', meaning: 'Bottom copyright reads ©1999-2000 Wizards', isCriticalDifferentiator: true },
      { label: 'FOIL', code: 'HOLO', dimension: '#8 Foil Finish', meaning: 'Standard Holofoil' },
      { label: 'STAMP', code: 'NONE', dimension: '#9 Promo Stamp', meaning: 'No Promo Stamp' },
      { label: 'DECK', code: 'STD', dimension: '#10 Deck/Back', meaning: 'Standard Blue Back' },
      { label: 'SERIAL', code: 'NONE', dimension: '#11 Serial Code', meaning: 'None' },
      { label: 'ERROR', code: 'NONE', dimension: '#13 Factory Error', meaning: 'None' }
    ]
  },
  {
    id: 'pikachu-red-cheeks',
    title: 'Base Set Pikachu (Shadowless Red Cheeks Error)',
    subtitle: 'Early WotC Color Misprint Corrected Mid-Run',
    priceComparison: '$45.00 Raw NM (vs. $3.00 Unlimited Yellow Cheeks)',
    fingerprintKey: 'EN:BS1:058:SHADOWLESS:NON_HOLO:NONE:STD:NONE:RED_CHEEKS',
    segments: [
      { label: 'LANG', code: 'EN', dimension: '#1 Language', meaning: 'English Print' },
      { label: 'SET', code: 'BS1', dimension: '#3 Expansion', meaning: '1999 Base Set' },
      { label: 'NUM', code: '058', dimension: '#5 Collector #', meaning: 'Card 58/102' },
      { label: 'EDITION', code: 'SHADOWLESS', dimension: '#7 Print Run', meaning: '2nd Print Wave (No Drop Shadow)', isCriticalDifferentiator: true },
      { label: 'FOIL', code: 'NON_HOLO', dimension: '#8 Foil Finish', meaning: 'Matte Common Cardstock' },
      { label: 'STAMP', code: 'NONE', dimension: '#9 Promo Stamp', meaning: 'None' },
      { label: 'DECK', code: 'STD', dimension: '#10 Deck/Back', meaning: 'Standard Blue Back' },
      { label: 'SERIAL', code: 'NONE', dimension: '#11 Serial Code', meaning: 'None' },
      { label: 'ERROR', code: 'RED_CHEEKS', dimension: '#13 Factory Error', meaning: 'Red Ink Cheeks Instead of Yellow', isCriticalDifferentiator: true }
    ]
  },
  {
    id: 'pikachu-masterball',
    title: '151 Pikachu (Japanese Master Ball Reverse Holo)',
    subtitle: '1-Per-Booster-Box Chase Reverse Foil',
    priceComparison: '$240.00 Raw NM (vs. $3.00 Poké Ball Reverse Holo)',
    fingerprintKey: 'JP:SV2A:025:UNL:MASTER_BALL:NONE:STD:NONE:NONE',
    segments: [
      { label: 'LANG', code: 'JP', dimension: '#1 Language', meaning: 'Japanese Print (Gold-Rim Back)', isCriticalDifferentiator: true },
      { label: 'SET', code: 'SV2A', dimension: '#3 Expansion', meaning: 'Pokémon Card 151 (Japanese)' },
      { label: 'NUM', code: '025', dimension: '#5 Collector #', meaning: 'Card 025/165' },
      { label: 'EDITION', code: 'UNL', dimension: '#7 Print Run', meaning: 'Standard Print Run' },
      { label: 'FOIL', code: 'MASTER_BALL', dimension: '#8 Foil Finish', meaning: 'Etched Master Ball ("M" + Two Bumps)', isCriticalDifferentiator: true },
      { label: 'STAMP', code: 'NONE', dimension: '#9 Promo Stamp', meaning: 'None' },
      { label: 'DECK', code: 'STD', dimension: '#10 Deck/Back', meaning: 'Standard Japanese Back' },
      { label: 'SERIAL', code: 'NONE', dimension: '#11 Serial Code', meaning: 'None' },
      { label: 'ERROR', code: 'NONE', dimension: '#13 Factory Error', meaning: 'None' }
    ]
  },
  {
    id: 'charmander-pkmn-center',
    title: 'Obsidian Flames Charmander (Pokémon Center Stamp)',
    subtitle: 'Pokémon Center Exclusive ETB Promo',
    priceComparison: '$95.00 Raw NM (vs. $8.00 Regular ETB Promo)',
    fingerprintKey: 'EN:SVP:044:UNL:HOLO:POKEMON_CENTER:STD:NONE:NONE',
    segments: [
      { label: 'LANG', code: 'EN', dimension: '#1 Language', meaning: 'English Print' },
      { label: 'SET', code: 'SVP', dimension: '#3 Expansion', meaning: 'Scarlet & Violet Black Star Promos' },
      { label: 'NUM', code: '044', dimension: '#5 Collector #', meaning: 'Promo #044' },
      { label: 'EDITION', code: 'UNL', dimension: '#7 Print Run', meaning: 'Unlimited' },
      { label: 'FOIL', code: 'HOLO', dimension: '#8 Foil Finish', meaning: 'Standard S&V Holofoil' },
      { label: 'STAMP', code: 'POKEMON_CENTER', dimension: '#9 Promo Stamp', meaning: 'Pokémon Center Logo in Art Box Right', isCriticalDifferentiator: true },
      { label: 'DECK', code: 'STD', dimension: '#10 Deck/Back', meaning: 'Standard Blue Back' },
      { label: 'SERIAL', code: 'NONE', dimension: '#11 Serial Code', meaning: 'None' },
      { label: 'ERROR', code: 'NONE', dimension: '#13 Factory Error', meaning: 'None' }
    ]
  },
  {
    id: 'latias-wc-deck',
    title: 'Latias Gold Star (World Championships Signed Deck)',
    subtitle: 'The #1 Counterfeit/Reprint Buylist Trap in TCG Stores',
    priceComparison: '$45.00 Reprint (vs. $1,400+ Pack-Pulled EX Deoxys Gold Star)',
    fingerprintKey: 'EN:DX:105:UNL:NON_HOLO:NONE:WORLD_CHAMP_SIGNED:NONE:NONE',
    segments: [
      { label: 'LANG', code: 'EN', dimension: '#1 Language', meaning: 'English Print' },
      { label: 'SET', code: 'DX', dimension: '#3 Expansion', meaning: 'EX Deoxys Set Symbol & Number Kept!' },
      { label: 'NUM', code: '105', dimension: '#5 Collector #', meaning: 'Card 105/107' },
      { label: 'EDITION', code: 'UNL', dimension: '#7 Print Run', meaning: 'Unlimited' },
      { label: 'FOIL', code: 'NON_HOLO', dimension: '#8 Foil Finish', meaning: 'Matte Non-Holo Reprint', isCriticalDifferentiator: true },
      { label: 'STAMP', code: 'NONE', dimension: '#9 Promo Stamp', meaning: 'None' },
      { label: 'DECK', code: 'WORLD_CHAMP_SIGNED', dimension: '#10 Deck/Back', meaning: 'Silver Border + Player Signature + WC Back', isCriticalDifferentiator: true },
      { label: 'SERIAL', code: 'NONE', dimension: '#11 Serial Code', meaning: 'Has Serial Code, But Overridden by WC Deck' },
      { label: 'ERROR', code: 'NONE', dimension: '#13 Factory Error', meaning: 'None' }
    ]
  }
];

// ============================================================================
// 3. HISTORICAL ERAS & PRINT RUN MATRICES
// ============================================================================
export const HISTORICAL_ERAS: HistoricalEraSpec[] = [
  {
    id: 'wotc',
    eraNumber: 1,
    nameEn: 'Wizards of the Coast (Original, Gym, Neo, e-Card)',
    nameJp: 'Original (PMCG), Neo, Pokémon VS/Web, e-Card',
    years: '1996 (JP) / 1999–2003 (EN)',
    borderColor: 'Yellow',
    setAndNumberPosition: 'Set Symbol: Middle-Right below Art Box • Number: Bottom-Right (4/102)',
    keyMechanics: ['Basic / Stage 1 / Stage 2', 'Dark & Light Pokémon', 'Shining Pokémon', 'e-Reader Dot Strips'],
    criticalScannerQuirks: [
      'Base Set (1999) has 4 English Print Runs: 1st Edition, Shadowless, Unlimited, and UK 4th Print (©1999-2000).',
      '1996–2000 Japanese Sets (Base through Gym) have ZERO collector numbers printed on the card—rely 100% on pgvector artwork matching.',
      'Legendary Collection (2002) introduced the first Reverse Holos (Fireworks foil pattern).'
    ]
  },
  {
    id: 'ex',
    eraNumber: 2,
    nameEn: 'EX Series (16 Expansions)',
    nameJp: 'ADV Era (2003–2004) & PCG Era (2004–2006)',
    years: '2003–2007',
    borderColor: 'Yellow / Silver',
    setAndNumberPosition: 'Set Symbol & Number: Bottom-Right • 9-Char Serial Code: Bottom-Left',
    keyMechanics: ['Pokémon-ex (Silver Holo Border)', 'Gold Star (★) Pokémon', 'Delta Species (δ)'],
    criticalScannerQuirks: [
      'Stamped Reverse Holos: From EX Team Rocket Returns onward, Reverse Holos have the expansion logo stamped inside the artwork box (and Gold Foil names on Rares)!',
      '3x Common Serial Codes: Every Common card has 3 distinct 9-character serial codes (Code A, B, C) printed in the bottom-left border.'
    ]
  },
  {
    id: 'dp-hgss',
    eraNumber: 3,
    nameEn: 'Diamond & Pearl, Platinum & HeartGold SoulSilver',
    nameJp: 'DP Era, DPt Era & LEGEND Era',
    years: '2007–2011',
    borderColor: 'Yellow / Silver',
    setAndNumberPosition: 'Set Symbol & Number: Bottom-Right',
    keyMechanics: ['Pokémon LV.X', 'Pokémon Prime', 'Pokémon LEGEND (2-Card Horizontal Art)', 'SP (Gym/Galactic) Pokémon'],
    criticalScannerQuirks: [
      'LEGEND Cards span two physical horizontal cards (Top Half #111/123 + Bottom Half #112/123) that must be cataloged as separate SKUs.',
      'Alph Lithograph secret rares use Roman/English word numbers (ONE, TWO, THREE, FOUR).'
    ]
  },
  {
    id: 'bw-xy',
    eraNumber: 4,
    nameEn: 'Black & White & XY Series',
    nameJp: 'Black & White (BW) & XY / XY BREAK',
    years: '2011–2016',
    borderColor: 'Yellow',
    setAndNumberPosition: 'Bottom-Right (BW) → Transitioned to Bottom-Left (XY)',
    keyMechanics: ['Pokémon-EX', 'Mega Evolution (M EX)', 'Pokémon BREAK (Horizontal Gold)', 'Full Art Textured Cards', 'Team Plasma (Blue Border)'],
    criticalScannerQuirks: [
      'First Era with 100% Full-Card Micro-Etched Fingerprint Textures on Full Arts and Secret Rares.',
      'Yellow "A" Alternate Art reprints (e.g., N #105a/124) kept their original set symbol and added an "a" suffix.',
      'In Japanese BW & XY sets, 1st Edition (1ED) was 90% of the print run—making Japanese Unlimited much rarer!'
    ]
  },
  {
    id: 'sm',
    eraNumber: 5,
    nameEn: 'Sun & Moon Series',
    nameJp: 'Sun & Moon (SM)',
    years: '2017–2019',
    borderColor: 'Yellow',
    setAndNumberPosition: 'Standardized at Bottom-Left (Set Symbol + Number)',
    keyMechanics: ['Pokémon-GX', 'Tag Team GX (Alternate Arts)', 'Prism Star (◇)', 'Rainbow Rares (Hyper Rares)', 'Shiny Vault (SV) Sub-Set'],
    criticalScannerQuirks: [
      'Japan permanently retired the 1ED (1st Edition) stamp starting with Sun & Moon Base Set.',
      'Introduced the first massive Shiny Vault (SV1/SV94) sub-set inside Hidden Fates.'
    ]
  },
  {
    id: 'swsh',
    eraNumber: 6,
    nameEn: 'Sword & Shield Series',
    nameJp: 'Sword & Shield (S Series)',
    years: '2020–2023',
    borderColor: 'Yellow / Silver',
    setAndNumberPosition: 'Bottom-Left: Set Symbol + Regulation Mark (D, E, F) + Number',
    keyMechanics: ['Pokémon V / VMAX / VSTAR', 'Alternate Art Secret Rares', 'Radiant Pokémon', 'Trainer Gallery (TG) & Galarian Gallery (GG)'],
    criticalScannerQuirks: [
      'Dual-Numbered Packs: Sets like Crown Zenith and Lost Origin have both a Main Set (001/196) and a Trainer/Galarian Gallery (TG01/TG30, GG01/GG70) in the reverse slot.',
      'Celebrations (2021) Classic Collection reprinted vintage cards with their original 1999 numbers (4/102)—must detect the 25th Anniversary Pikachu Stamp!'
    ]
  },
  {
    id: 'sv',
    eraNumber: 7,
    nameEn: 'Scarlet & Violet Series',
    nameJp: 'Scarlet & Violet (SV Series)',
    years: '2023–Present',
    borderColor: 'Silver',
    setAndNumberPosition: 'Bottom-Left: 3-Letter Set Pill (MEW, OBF, PRE) + Lang (EN) + Reg Mark (G, H) + Number',
    keyMechanics: ['Pokémon ex (Lowercase)', 'Terastal Crystalline ex', 'Illustration Rare (IR)', 'Special Illustration Rare (SIR)', 'ACE SPEC (Pink Foil)'],
    criticalScannerQuirks: [
      'Global Silver Borders: Western cards finally switched from Yellow to Silver borders to match Japan.',
      'Graphical Set Symbols Replaced by 3-Letter Text Pills (MEW, PAL, OBF, SSP, PRE)—making bottom-left OCR 10x more reliable!',
      'Every pack guarantees 3 foils (2 Reverse Holos + 1 Holo Rare), plus Poké Ball vs. Master Ball Reverse Holos in special sets.'
    ]
  }
];

export const PRINT_RUN_RULES: PrintRunRule[] = [
  {
    enumCode: 'UNLIMITED',
    title: 'Unlimited Print Run (Default)',
    validSetsEn: '100% of English Sets (1999–Present)',
    validSetsJp: '100% of Japanese Sets (Rare in 2001–2016 BW/XY sets!)',
    visualIdentifier: 'Has drop-shadow on Base Set art box; no 1st Edition stamp.',
    scannerRule: 'Default fallback when no 1st Edition stamp, Shadowless frame, or 1999-2000 copyright is detected.',
    priceImpact: '1.0x Baseline Market Price (except JP BW/XY where Unlimited is 2x–5x 1st Ed)'
  },
  {
    enumCode: 'FIRST_EDITION',
    title: '1st Edition Print Run (Edition 1 / 1ED)',
    validSetsEn: 'ONLY 10 WotC Sets (1999 Base Set → 2002 Neo Destiny). Base Set 2 & Legendary Collection have NO 1st Edition.',
    validSetsJp: '2001–2016 Sets ONLY (Pokémon VS / e-Card → XY 20th Anniversary). Retired in Sun & Moon.',
    visualIdentifier: 'EN: Black circular "Edition 1" stamp below bottom-left of art box. JP: Black rectangular "1ED" icon in bottom-left corner.',
    scannerRule: 'Crop [x:6%, y:49%, w:12%, h:6%] on WotC cards or bottom-left corner on 2001–2016 JP cards.',
    priceImpact: '2.5x to 20x+ over Unlimited on English WotC sets'
  },
  {
    enumCode: 'SHADOWLESS',
    title: 'Shadowless (2nd Print Wave)',
    validSetsEn: '100% Exclusive to 1999 English Base Set (All 102 Cards)',
    validSetsJp: 'Does NOT exist in Japanese',
    visualIdentifier: 'Missing dark drop-shadow along right/bottom of art box + thinner HP font + "©1995, 96, 98, 99" copyright line (no Edition 1 stamp).',
    scannerRule: 'Measure luminance strip along right vertical edge of artwork frame [x:91%, y:15%–48%] + check for absence of 1st Ed stamp.',
    priceImpact: '3x to 6x over Unlimited Base Set'
  },
  {
    enumCode: 'FOURTH_PRINT_1999_2000',
    title: '©1999–2000 UK / Australian 4th Print Run',
    validSetsEn: 'ONLY 1999 English Base Set (All 102 Cards) & 1999 English Fossil (Non-Holos #16–#62)',
    validSetsJp: 'Does NOT exist in Japanese',
    visualIdentifier: 'Identical to Unlimited, except bottom-right copyright line reads "©1999-2000 Wizards" instead of "©1999 Wizards".',
    scannerRule: 'High-res macro OCR on bottom-right copyright strip when card is identified as Base Set or Fossil.',
    priceImpact: '2x to 10x over Standard Unlimited (Especially Base Set Holos)'
  },
  {
    enumCode: 'NO_RARITY_SYMBOL',
    title: '1996 Japanese "No Rarity Symbol" (True JP 1st Print)',
    validSetsEn: 'Does NOT exist in English',
    validSetsJp: '100% Exclusive to 1996 Japanese Base Set (Expansion Pack)',
    visualIdentifier: 'Missing the black ● / ◆ / ★ rarity symbol in the bottom-right corner.',
    scannerRule: 'When scanning a 1996 Old-Back Japanese Base Set card, inspect bottom-right corner for empty rarity slot.',
    priceImpact: '10x to 50x+ over standard 1996 Japanese Base Set'
  }
];

export const WOTC_1ST_EDITION_SETS: WotcSetPrintMatrix[] = [
  { num: 1, setName: 'Base Set', releaseYear: 1999, has1stEdition: true, hasShadowless: true, hasUnlimited: true, has4thPrint1999_2000: 'Yes (All 102 Cards)', specialNotes: 'Only set in history with Shadowless print run.' },
  { num: 2, setName: 'Jungle', releaseYear: 1999, has1stEdition: true, hasShadowless: false, hasUnlimited: true, has4thPrint1999_2000: 'No', specialNotes: 'Has "No Set Symbol" error run on Unlimited Holos/Rares & "d Edition" Butterfree.' },
  { num: 3, setName: 'Fossil', releaseYear: 1999, has1stEdition: true, hasShadowless: false, hasUnlimited: true, has4thPrint1999_2000: 'Yes (Non-Holos #16–62)', specialNotes: 'Australian Red Logo booster boxes contained ©1999-2000 non-holos.' },
  { num: 0, setName: 'Base Set 2 (Reprint)', releaseYear: 2000, has1stEdition: false, hasShadowless: false, hasUnlimited: true, has4thPrint1999_2000: 'Native ©1999-2000', specialNotes: 'UNLIMITED ONLY — Never printed in 1st Edition.' },
  { num: 4, setName: 'Team Rocket', releaseYear: 2000, has1stEdition: true, hasShadowless: false, hasUnlimited: true, has4thPrint1999_2000: 'Native ©1999-2000', specialNotes: 'Introduced first Secret Rare in English (Dark Raichu 83/82).' },
  { num: 5, setName: 'Gym Heroes', releaseYear: 2000, has1stEdition: true, hasShadowless: false, hasUnlimited: true, has4thPrint1999_2000: 'No', specialNotes: '1st Edition & Unlimited.' },
  { num: 6, setName: 'Gym Challenge', releaseYear: 2000, has1stEdition: true, hasShadowless: false, hasUnlimited: true, has4thPrint1999_2000: 'No', specialNotes: '1st Edition & Unlimited.' },
  { num: 7, setName: 'Neo Genesis', releaseYear: 2000, has1stEdition: true, hasShadowless: false, hasUnlimited: true, has4thPrint1999_2000: 'No', specialNotes: '1st Edition & Unlimited (Lugia #9).' },
  { num: 8, setName: 'Neo Discovery', releaseYear: 2001, has1stEdition: true, hasShadowless: false, hasUnlimited: true, has4thPrint1999_2000: 'No', specialNotes: '1st Edition & Unlimited.' },
  { num: 9, setName: 'Neo Revelation', releaseYear: 2001, has1stEdition: true, hasShadowless: false, hasUnlimited: true, has4thPrint1999_2000: 'No', specialNotes: 'Introduced Shining Gyarados & Shining Magikarp.' },
  { num: 10, setName: 'Neo Destiny', releaseYear: 2002, has1stEdition: true, hasShadowless: false, hasUnlimited: true, has4thPrint1999_2000: 'No', specialNotes: 'FINAL English set ever printed with a 1st Edition stamp.' },
  { num: 0, setName: 'Legendary Collection & e-Card Series', releaseYear: 2002, has1stEdition: false, hasShadowless: false, hasUnlimited: true, has4thPrint1999_2000: 'No', specialNotes: 'WotC retired 1st Edition permanently and introduced Reverse Holos in every pack.' }
];

// ============================================================================
// 4. ALL 15 OFFICIAL LANGUAGES & SAAS ROLLOUT STRATEGY
// ============================================================================
export const OFFICIAL_LANGUAGES: OfficialLanguageSpec[] = [
  {
    num: 1,
    language: 'English',
    dbCode: 'EN',
    ecosystem: 'Western (TPCi)',
    saasTier: 'Tier 1: Day-1 Mandatory (96%)',
    marketShare: '~72%',
    activeYears: '1999–Present',
    cardBack: 'International Blue Back',
    scannerAndDbNotes: 'Global secondary market baseline. 100% automated daily pricing via TCGCSV (Category 3).'
  },
  {
    num: 2,
    language: 'Japanese',
    dbCode: 'JP',
    ecosystem: 'Asian (TPC Japan)',
    saasTier: 'Tier 1: Day-1 Mandatory (96%)',
    marketShare: '~24%',
    activeYears: '1996–Present',
    cardBack: 'JP Gold-Rim Back (1996–2001 Old Back)',
    scannerAndDbNotes: 'Sets release 2–3 months early with finer SAR micro-etching. 100% automated daily pricing via TCGCSV (Category 85).'
  },
  {
    num: 3,
    language: 'Simplified Chinese',
    dbCode: 'ZH-CN',
    ecosystem: 'Asian (TPC Japan)',
    saasTier: 'Tier 2: Collector Expansion (3%)',
    marketShare: '~2.0% (Fastest Growing)',
    activeYears: '2022–Present',
    cardBack: 'International Blue Back',
    scannerAndDbNotes: 'Printed in Japan. Rares/Holos feature a laser-embossed Pokémon security logo stamped into the bottom-left border!'
  },
  {
    num: 4,
    language: 'Korean',
    dbCode: 'KR',
    ecosystem: 'Asian (TPC Japan)',
    saasTier: 'Tier 2: Collector Expansion (3%)',
    marketShare: '~0.7%',
    activeYears: '2004–Present',
    cardBack: 'International Blue Back',
    scannerAndDbNotes: 'Follows Japanese set numbering, but printed in Korea on Korean cardstock.'
  },
  {
    num: 5,
    language: 'Traditional Chinese',
    dbCode: 'ZH-TW',
    ecosystem: 'Asian (TPC Japan)',
    saasTier: 'Tier 2: Collector Expansion (3%)',
    marketShare: '~0.3%',
    activeYears: '2000 (Base), 2019–Present',
    cardBack: 'International Blue Back',
    scannerAndDbNotes: 'Sold in Hong Kong & Taiwan; printed in Japan. Also had a 1st Edition Base Set print in 2000.'
  },
  {
    num: 6,
    language: 'German',
    dbCode: 'DE',
    ecosystem: 'Western (TPCi)',
    saasTier: 'Tier 3: EU Regional',
    marketShare: 'EU Local Market',
    activeYears: '1999–Present',
    cardBack: 'International Blue Back',
    scannerAndDbNotes: 'Uses English set numbers & artwork vectors (0 extra vector RAM). Prints "DE" pill in bottom-left on S&V cards.'
  },
  {
    num: 7,
    language: 'French',
    dbCode: 'FR',
    ecosystem: 'Western (TPCi)',
    saasTier: 'Tier 3: EU Regional',
    marketShare: 'EU Local Market',
    activeYears: '1999–Present',
    cardBack: 'International Blue Back',
    scannerAndDbNotes: 'Commands highest European prices on Cardmarket. Shares English set numbers & vectors ("FR" tag).'
  },
  {
    num: 8,
    language: 'Italian',
    dbCode: 'IT',
    ecosystem: 'Western (TPCi)',
    saasTier: 'Tier 3: EU Regional',
    marketShare: 'EU Local Market',
    activeYears: '1999–Present',
    cardBack: 'International Blue Back',
    scannerAndDbNotes: 'Shares English set numbers & vectors ("IT" tag in bottom-left).'
  },
  {
    num: 9,
    language: 'Spanish',
    dbCode: 'ES',
    ecosystem: 'Western (TPCi)',
    saasTier: 'Tier 3: EU Regional',
    marketShare: 'EU & LATAM Market',
    activeYears: '1999–Present',
    cardBack: 'International Blue Back',
    scannerAndDbNotes: 'Includes both European Spanish and Latin American (ES-MX) distribution ("ES" tag).'
  },
  {
    num: 10,
    language: 'Portuguese',
    dbCode: 'PT',
    ecosystem: 'Western (TPCi)',
    saasTier: 'Tier 3: EU Regional',
    marketShare: 'Brazil Market',
    activeYears: '1999–Present',
    cardBack: 'International Blue Back',
    scannerAndDbNotes: 'Printed in Brazil by Copag ("PT" tag in bottom-left).'
  },
  {
    num: 11,
    language: 'Thai',
    dbCode: 'TH',
    ecosystem: 'Asian (TPC Japan)',
    saasTier: 'Skip (Manual Override)',
    marketShare: '<0.1%',
    activeYears: '2019–Present',
    cardBack: 'International Blue Back',
    scannerAndDbNotes: 'Printed in Japan; follows Japanese set structure.'
  },
  {
    num: 12,
    language: 'Indonesian',
    dbCode: 'ID',
    ecosystem: 'Asian (TPC Japan)',
    saasTier: 'Skip (Manual Override)',
    marketShare: '<0.1%',
    activeYears: '2019–Present',
    cardBack: 'International Blue Back',
    scannerAndDbNotes: 'SCANNER TRAP: Uses Latin alphabet & English Pokémon names, but has Japanese set codes (SV4a) at bottom-left!'
  },
  {
    num: 13,
    language: 'Dutch (Discontinued)',
    dbCode: 'NL',
    ecosystem: 'Discontinued Historical',
    saasTier: 'Skip (Manual Override)',
    marketShare: 'Vintage Only',
    activeYears: '1999–2000 Only',
    cardBack: 'International Blue Back',
    scannerAndDbNotes: 'Only 3 sets ever printed: Base Set, Jungle, and Fossil (1st Edition & Unlimited).'
  },
  {
    num: 14,
    language: 'Polish (Discontinued)',
    dbCode: 'PL',
    ecosystem: 'Discontinued Historical',
    saasTier: 'Skip (Manual Override)',
    marketShare: 'Vintage Only',
    activeYears: '2010–2011 Only',
    cardBack: 'International Blue Back',
    scannerAndDbNotes: 'Only 2 sets ever printed: Diamond & Pearl and Mysterious Treasures.'
  },
  {
    num: 15,
    language: 'Russian (Discontinued)',
    dbCode: 'RU',
    ecosystem: 'Discontinued Historical',
    saasTier: 'Skip (Manual Override)',
    marketShare: 'Mid-Era Only',
    activeYears: '2014–2016 Only',
    cardBack: 'International Blue Back',
    scannerAndDbNotes: 'Only printed for 6 XY-era expansions (XY Base through BREAKpoint).'
  }
];

// ============================================================================
// 5. FOIL & SURFACE FINISHES + BULK SIFTER MATRIX
// ============================================================================
export const FOIL_BULK_SPECS: FoilBulkSpec[] = [
  {
    id: 'modern-holo',
    name: 'Modern Standard Holo Rare (S&V / SwSh)',
    dbEnum: 'HOLO',
    comesInBulk: 'Massive Bulk',
    bulkBuyRate: '$0.03 – $0.05 each ($35/1,000)',
    retailRange: '$0.15 – $0.50 (95%) • $2 – $8 (Meta Playables)',
    visualPhysics: 'Metallic reflection restricted to the rectangular artwork box (+ silver foil border in S&V).',
    scannerStrategy: 'Guaranteed 1 per pack in S&V. Use "Threshold Sifter Mode" ($1.50 floor) to skip 95% bulk and ding on playable hits like Dusknoir.'
  },
  {
    id: 'modern-rev-holo',
    name: 'Modern Standard Reverse Holo',
    dbEnum: 'REVERSE_HOLO',
    comesInBulk: 'Massive Bulk',
    bulkBuyRate: '$0.03 – $0.05 each ($35/1,000)',
    retailRange: '$0.15 – $0.50 (90%) • $2 – $12 (Playable Trainers & 151)',
    visualPhysics: 'Card body/frame is holographic (with energy watermarks or flat sheen), while the artwork box is matte non-foil.',
    scannerStrategy: 'Guaranteed 2 per pack in S&V. Customers dump thousands in bulk boxes—sift for $5–$10 playable Trainer reverses (Night Stretcher, Arven) & 151 Metapod!'
  },
  {
    id: 'ultra-bulk-ex-v',
    name: 'Regular Double Rare (ex / V / GX "Ultra Bulk")',
    dbEnum: 'HOLO_DOUBLE_RARE',
    comesInBulk: 'Semi-Bulk',
    bulkBuyRate: '$0.35 – $0.50 each',
    retailRange: '$0.75 – $1.50 (80%) • $5 – $25 (Meta Staples)',
    visualPhysics: 'Smooth diagonal/starlight holo across card face with no fingerprint micro-etching.',
    scannerStrategy: 'Shops buy unplayable ex/V stacks at $0.40, scanning to pull out $15+ tournament staples (e.g., Fezandipiti ex, Charizard ex).'
  },
  {
    id: 'pokeball-vs-masterball',
    name: 'Poké Ball vs. Master Ball Reverse Holo (151 / Prismatic)',
    dbEnum: 'POKE_BALL_HOLO / MASTER_BALL_HOLO',
    comesInBulk: 'Hidden in Bulk by Accident',
    bulkBuyRate: 'Poké Ball: $0.20 semi-bulk • Master Ball: NEVER BULK',
    retailRange: 'Poké Ball: $0.50–$5 • Master Ball: $15 – $400+',
    visualPhysics: 'Circular ball pattern etched into mid-card foil. Master Ball has an "M" in the center and two top dome bumps.',
    scannerStrategy: 'Customers frequently mix a $100 Master Ball into a stack of $0.50 Poké Ball foils! Use multi-frame angled LED burst + 1-tap POS confirmation.'
  },
  {
    id: 'cosmo-cracked-ice',
    name: 'Cosmo Holo, Cracked Ice & Deck Non-Holos',
    dbEnum: 'COSMO_HOLO / CRACKED_ICE / NON_HOLO_DECK',
    comesInBulk: 'Hidden in Bulk by Accident',
    bulkBuyRate: 'Often tossed into $0.04 bulk by clueless sellers',
    retailRange: '$1.50 – $45.00+',
    visualPhysics: 'Cosmo has swirling circular galaxy bubbles (blister exclusives). Cracked Ice has triangular prism shards.',
    scannerStrategy: 'Whenever a scanned card has a known Blister Cosmo or Theme Deck variant in catalog.card_sku_variants, flash a variant pill on the POS.'
  },
  {
    id: 'vintage-rev-holo',
    name: 'Vintage & Mid-Era Reverse Holos (2002–2013)',
    dbEnum: 'FIREWORKS_HOLO / EX_STAMPED_REV',
    comesInBulk: 'Never Bulk',
    bulkBuyRate: 'Individually Priced Only',
    retailRange: '$10.00 – $500.00+',
    visualPhysics: 'Legendary Collection has dazzling Fireworks foil; 2004–2007 EX Reverse Holos have the Set Logo stamped inside the artwork box.',
    scannerStrategy: 'Immediate high-value alert if a pre-2013 card exhibits reverse-frame specular reflection.'
  },
  {
    id: 'textured-full-art',
    name: 'Textured / Micro-Etched Foils (IR, SIR, HR, ACE SPEC)',
    dbEnum: 'TEXTURED_ETCHED',
    comesInBulk: 'Never Bulk',
    bulkBuyRate: 'Individually Priced Only',
    retailRange: '$2.00 – $1,500.00+',
    visualPhysics: 'Physical raised fingerprint ridges (SIR/UR/HR) giving high Laplacian edge variance under oblique raking light. Fake cards are smooth.',
    scannerStrategy: '100% individual scan. Doubles as an automatic anti-counterfeit check (smooth SIR = Fake Flag).'
  }
];

// ============================================================================
// 6. HIGH-VALUE PROMOTIONAL & EDITION STAMP ZONES
// ============================================================================
export const STAMP_ZONE_SPECS: StampZoneSpec[] = [
  {
    id: 'stamp-1st-ed',
    name: '1st Edition Stamp (WotC & JP 1ED)',
    dbEnum: 'FIRST_EDITION',
    cardLocation: 'Below Bottom-Left of Artwork Box (EN) / Bottom-Left Corner (JP)',
    coordinatesLabel: 'x: 6%, y: 49.5%, w: 12%, h: 6%',
    priceMultiplier: '2.5x – 20x+',
    realWorldExample: '1st Edition Base Set Charizard ($6,500+) vs. Unlimited ($400)',
    scannerTrapWarning: 'Current mobile apps completely ignore this zone and default every scan to Unlimited!'
  },
  {
    id: 'stamp-pkmn-center',
    name: 'Pokémon Center Exclusive ETB Stamp',
    dbEnum: 'POKEMON_CENTER',
    cardLocation: 'Inside Artwork Box — Bottom-Right Corner',
    coordinatesLabel: 'x: 66%, y: 44%, w: 26%, h: 6%',
    priceMultiplier: '5x – 15x',
    realWorldExample: 'Charmander SVP #044 Unstamped ($8) vs. Pokémon Center Stamped ($95)',
    scannerTrapWarning: 'White/silver logo printed over artwork. Every competitor app scans the $95 stamped card as the $8 regular promo.'
  },
  {
    id: 'stamp-prerelease-staff',
    name: 'Prerelease Set Logo & Gold STAFF Stamp',
    dbEnum: 'PRERELEASE / STAFF',
    cardLocation: 'Inside Artwork Box — Bottom-Left (STAFF) & Bottom-Right (Set Logo)',
    coordinatesLabel: 'x: 8% & 68%, y: 43%, w: 24%, h: 7%',
    priceMultiplier: '3x – 30x',
    realWorldExample: 'Charizard Vivid Voltage Prerelease ($60) vs. Gold STAFF Stamp ($450+)',
    scannerTrapWarning: 'Gold foil STAFF stamp looks dark/black at flat lighting angles unless angled LED catches the metallic ink.'
  },
  {
    id: 'stamp-25th-celebrations',
    name: '25th Anniversary Pikachu Stamp (Celebrations)',
    dbEnum: 'ANNIVERSARY_25TH',
    cardLocation: 'Below Artwork Box — Right Side (or Inside Art Box)',
    coordinatesLabel: 'x: 76%, y: 50%, w: 16%, h: 8%',
    priceMultiplier: '0.01x – 0.15x of Original Vintage Card!',
    realWorldExample: '2005 Umbreon Gold Star 17/17 ($5,000) vs. 2021 Celebrations Reprint 17/17 ($25)',
    scannerTrapWarning: 'CRITICAL GUARDRAIL: Celebrations reprints keep their original 1999/2005 collector numbers (4/102, 17/17)! Missing this stamp causes a $4,900 buylist loss.'
  },
  {
    id: 'stamp-play-pokemon',
    name: 'Play! Pokémon Prize Pack Stamp',
    dbEnum: 'PLAY_POKEMON',
    cardLocation: 'Below Artwork Box — Right Side',
    coordinatesLabel: 'x: 74%, y: 50%, w: 18%, h: 7%',
    priceMultiplier: '2x – 15x',
    realWorldExample: 'Prize Pack Series Stamped Holo/ex vs. Standard Set Card',
    scannerTrapWarning: 'Shares the exact same set code and collector number as the main expansion card—only differentiated by the red/blue Play! Pokéball logo.'
  },
  {
    id: 'stamp-world-champ',
    name: 'World Championships Deck Signature & Border',
    dbEnum: 'WORLD_CHAMP_SIGNED',
    cardLocation: 'Across Artwork Window + Silver Border + WC Back',
    coordinatesLabel: 'x: 15%–85%, y: 20%–45% (Signature Overlay)',
    priceMultiplier: '0.02x – 0.08x of Pack-Pulled Card!',
    realWorldExample: 'EX Deoxys Latias Gold Star ($1,400) vs. 2006 World Championships Signed Deck Reprint ($45)',
    scannerTrapWarning: 'THE #1 STORE LOSS TRAP: Keeps the original set symbol & number (105/107). Scanner must flag the silver border and foil signature!'
  }
];

// ============================================================================
// 7. COLLECTOR NUMBER EDGE CASES & MODERN RARITY SYMBOLS
// ============================================================================
export const COLLECTOR_NUMBER_EDGE_CASES: CollectorNumberEdgeCase[] = [
  {
    category: 'Standard Zero-Padded',
    examples: ['004/102', '025/165', '060/193'],
    explanation: 'Numerator is the card index; denominator is the printed base set size.',
    sqlNormalization: "number_raw='004/102', number_clean='4', number_sort=4"
  },
  {
    category: 'Over-Numbered Secret Rares',
    examples: ['199/165', '228/193', '83/82'],
    explanation: 'Numerator is strictly greater than the denominator.',
    sqlNormalization: "number_raw='199/165', number_clean='199', number_sort=199"
  },
  {
    category: 'Sub-Set / Gallery Prefixes',
    examples: ['TG15/TG30', 'GG68/GG70', 'SV107/SV122', 'RC24/RC25'],
    explanation: 'Trainer Gallery, Galarian Gallery, Shiny Vault, and Radiant Collection subsets.',
    sqlNormalization: "number_raw='GG68/GG70', number_clean='GG68', number_sort=1068"
  },
  {
    category: 'Yellow "A" Alternate Art Suffixes',
    examples: ['69a/106', '105a/124', '115b/124'],
    explanation: 'XY & Sun/Moon premium box alternate arts that kept their original set symbol and number, adding a lowercase letter suffix.',
    sqlNormalization: "number_raw='105a/124', number_clean='105a', number_suffix='a'"
  },
  {
    category: 'Black Star Promo Codes',
    examples: ['SWSH050', 'SVP 044', 'SM210', 'XY121'],
    explanation: 'Promos have no denominator and use era prefix letters.',
    sqlNormalization: "number_raw='SVP 044', number_clean='44', number_sort=44"
  },
  {
    category: 'Celebrations Classic Reprints',
    examples: ['4/102', '15/102', '17/17'],
    explanation: '2021 Celebrations reprints carry the original vintage numerator/denominator from 1999–2011.',
    sqlNormalization: "Stored under expansion_id='cel25c' with stamp_type='ANNIVERSARY_25TH'"
  },
  {
    category: 'Unnumbered Vintage & Trophy Cards',
    examples: ['No Number (1996 JP)', 'ONE', 'TWO', 'Unnumbered'],
    explanation: 'All 1996–2000 Japanese sets (Base through Gym), Ancient Mew, and Alph Lithograph have no numeric collector number.',
    sqlNormalization: "number_raw='UNNUMBERED', matched 100% via pgvector art_embedding"
  }
];

export const RARITY_SYMBOLS: RaritySymbolSpec[] = [
  { code: 'C', name: 'Common', jpEquivalent: 'C', symbol: '● (Black Circle)', era: 'All Eras', surfaceFinish: 'Matte + Reverse Holo in Pack' },
  { code: 'U', name: 'Uncommon', jpEquivalent: 'U', symbol: '◆ (Black Diamond)', era: 'All Eras', surfaceFinish: 'Matte + Reverse Holo in Pack' },
  { code: 'R', name: 'Rare (Holo Rare)', jpEquivalent: 'R', symbol: '★ (Black Star)', era: 'All Eras', surfaceFinish: 'Guaranteed Standard Holo in S&V (Deck reprints are Non-Holo)' },
  { code: 'RR', name: 'Double Rare', jpEquivalent: 'RR', symbol: '★★ (Two Black Stars)', era: 'Scarlet & Violet', surfaceFinish: 'Regular-frame Pokémon ex / Tera ex with starlight/diagonal foil' },
  { code: 'UR', name: 'Ultra Rare (Full Art)', jpEquivalent: 'SR (Super Rare)', symbol: '☆☆ (Two Silver Stars)', era: 'Scarlet & Violet', surfaceFinish: 'Full-card illustration with physical micro-etched fingerprint ridges' },
  { code: 'IR', name: 'Illustration Rare', jpEquivalent: 'AR (Art Rare)', symbol: '★ (One Gold Star)', era: 'Scarlet & Violet', surfaceFinish: 'Full-card alternate art of non-ex Pokémon (Smooth vertical holo sheen)' },
  { code: 'SIR', name: 'Special Illustration Rare', jpEquivalent: 'SAR (Special Art Rare)', symbol: '★★ (Two Gold Stars)', era: 'Scarlet & Violet', surfaceFinish: 'High-end full-card alternate art ex/Supporter with deep micro-etched texture' },
  { code: 'HR', name: 'Hyper Rare (Gold)', jpEquivalent: 'UR (Ultra Rare Gold)', symbol: '★★★ (Three Gold Stars)', era: 'Scarlet & Violet', surfaceFinish: 'Gold-foil micro-etched secret rare' },
  { code: 'ACE', name: 'ACE SPEC Rare', jpEquivalent: 'ACE', symbol: '★ (Magenta/Pink Star)', era: 'BW & Scarlet/Violet', surfaceFinish: 'Vivid magenta/pink cyber-etched textured foil (1 per deck limit)' }
];

// ============================================================================
// 8. 5-STAGE AUTOMATED ETL PIPELINE & PRODUCTION SQL SCHEMA
// ============================================================================
export const ETL_PIPELINE_STAGES: EtlPipelineStage[] = [
  {
    stage: 1,
    title: 'Seed Layer 1: All Sets & Card Identities (EN + JP)',
    sourceName: 'GitHub: PokemonTCG/pokemon-tcg-data + tcgdex/cards-database',
    sourceUrl: 'https://github.com/PokemonTCG/pokemon-tcg-data',
    targetTables: 'catalog.expansions, catalog.card_identities',
    whatItPopulates: [
      'All ~450 English & Japanese expansions, release dates, and set codes (BS1, MEW, sv2a)',
      'All ~45,000 Layer 1 card identities, collector numbers, rarities, regulation marks, artists, and high-res image URLs'
    ],
    engineeringTrick: 'Never store the 6.5 GB of PNG images inside Supabase Storage. Keep only the CDN URLs (images.pokemontcg.io / Cloudflare R2) so database size stays <30 MB!'
  },
  {
    stage: 2,
    title: 'Seed Layer 2: Financial SKUs & Daily Market Prices',
    sourceName: 'TCGCSV.com (Daily Free TCGplayer Catalog & Price Mirror)',
    sourceUrl: 'https://tcgcsv.com',
    targetTables: 'catalog.card_sku_variants',
    whatItPopulates: [
      'Standard pack variants: Normal, Holofoil, Reverse Holofoil, 1st Edition, Shadowless, Poké Ball Foil, Master Ball Foil',
      'Live daily market_price, low_price, and rolling 7d/30d/90d price columns for Category 3 (EN) & Category 85 (JP)'
    ],
    engineeringTrick: 'Write a 30-line Regex Linker for TCGplayer groups like "Deck Exclusives" and "Miscellaneous Cards": parse "Baxcalibur - 060/193 (Cosmo Holo)" and attach it directly to your Paldea Evolved 060/193 card_identity_id!'
  },
  {
    stage: 3,
    title: 'Enrich Obscure Layer 2 Variants (Stamps, Blisters & EX Serials)',
    sourceName: 'Bulbapedia MediaWiki API (w/api.php)',
    sourceUrl: 'https://bulbapedia.bulbagarden.net/w/api.php',
    targetTables: 'catalog.card_sku_variants',
    whatItPopulates: [
      'Parses the ==Additional cards== wikitable on every expansion page for Cosmo Holos, Theme Deck Non-Holos, STAFF stamps, and Retailer stamps (GameStop, Best Buy, EB Games)',
      'Extracts all 3 bottom-left alphanumeric serial codes (Code A, B, C) for Common cards across all 16 EX-Era sets (2003–2007)'
    ],
    engineeringTrick: 'Use action=parse&prop=wikitext on Bulbapedia API—returns structured tables in JSON with zero HTML scraping needed.'
  },
  {
    stage: 4,
    title: 'Run Deterministic Print-Run & Famous Error Rules',
    sourceName: 'Internal Rule Engine + PSA Pop Report Error Seed (errors_seed.json)',
    sourceUrl: 'https://www.psacard.com/pop/tcg-cards/156940',
    targetTables: 'catalog.card_sku_variants',
    whatItPopulates: [
      'Auto-generates FOURTH_PRINT_1999_2000 SKUs for all 102 Base Set cards and Fossil Non-Holos (#16–#62)',
      'Auto-generates FIRST_EDITION and UNLIMITED SKUs for 2001–2016 Japanese sets + NO_RARITY_SYMBOL for 1996 JP Base Set',
      'Seeds ~120 officially graded factory errors (Red Cheeks Pikachu, No Symbol Jungle, No Stage Blastoise, d Edition Butterfree)'
    ],
    engineeringTrick: 'Constructs the deterministic 13-point fingerprint_key on every insert (ON CONFLICT (fingerprint_key) DO UPDATE) so duplicates are impossible.'
  },
  {
    stage: 5,
    title: 'Compute Optical Scanner Vectors & Perceptual Hashes',
    sourceName: 'Offline GPU Worker (MobileNetV3 / DINOv2 + 64-bit dHash)',
    sourceUrl: 'https://github.com/pgvector/pgvector',
    targetTables: 'catalog.card_identities (art_embedding, art_dhash)',
    whatItPopulates: [
      'Crops the artwork window of all 45,000 cards and computes a 512-dim halfvec(512) embedding + 64-bit dHash integer',
      'Builds the pgvector HNSW cosine similarity index for <8ms camera lookups'
    ],
    engineeringTrick: 'Use halfvec(512) (16-bit float quantization) instead of vector(512)—cuts vector RAM and disk usage in HALF (to ~115 MB) so the entire catalog fits in Supabase Free Tier!'
  }
];

export const PRODUCTION_SUPABASE_SQL = `-- Enable extensions for <8ms visual scanning & <10ms typo-tolerant POS search
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Separate Global Card Catalog from Multi-Tenant Shop Data inside 1 Supabase Project
CREATE SCHEMA IF NOT EXISTS catalog;

-- 1. GLOBAL EXPANSIONS (Dims #1 Language, #2 Era, #3 Set & Sub-Set)
CREATE TABLE catalog.expansions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  language TEXT NOT NULL DEFAULT 'EN',        -- Dim #1: 'EN', 'JP', 'ZH-CN', 'KR'
  era_block TEXT NOT NULL,                    -- Dim #2: 'WOTC', 'EX', 'DP', 'BW', 'XY', 'SM', 'SWSH', 'SV'
  set_code TEXT NOT NULL,                     -- Dim #3: 'BS1', 'MEW', 'PRE', 'SV2A'
  name TEXT NOT NULL,                         -- e.g., 'Scarlet & Violet—151'
  subset_type TEXT NOT NULL DEFAULT 'MAIN',   -- 'MAIN', 'TRAINER_GALLERY', 'GALARIAN_GALLERY', 'SHINY_VAULT', 'PROMO'
  printed_total INT NOT NULL,                 -- Denominator printed on card (e.g., 165)
  release_date DATE,
  has_first_edition BOOLEAN DEFAULT FALSE,
  tcgplayer_group_id INT,
  UNIQUE(language, set_code)
);

-- 2. LAYER 1: CARD IDENTITIES (Dims #4 Artwork, #5 Number & Suffix, #6 Rarity, #12 Reg Mark)
CREATE TABLE catalog.card_identities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expansion_id UUID NOT NULL REFERENCES catalog.expansions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,                         -- Dim #4: 'Pikachu ex'
  mechanical_version TEXT DEFAULT 'Regular',  -- Dim #4: 'Regular', 'Full Art', 'SIR', 'Hyper Rare'
  number_raw TEXT NOT NULL,                   -- Dim #5: '105a/124', '199/165', 'TG15/TG30'
  number_clean TEXT NOT NULL,                 -- Indexed stripped numerator: '105a', '199', 'TG15'
  number_sort INT NOT NULL,                   -- Numeric sort order: 105, 199, 1015
  number_suffix TEXT,                         -- Dim #5: 'a', 'b', 'TG', 'GG', 'SV'
  rarity TEXT NOT NULL,                       -- Dim #6: 'C', 'U', 'R', 'RR', 'UR', 'IR', 'SIR', 'HR', 'ACE'
  regulation_mark TEXT,                       -- Dim #12: 'D', 'E', 'F', 'G', 'H'
  image_cdn_url TEXT NOT NULL,                -- External CDN / Cloudflare R2 (0 MB Supabase storage)
  art_dhash BIGINT,                           -- 64-bit Perceptual Hash for <2ms bitwise scan
  art_embedding halfvec(512),                 -- 16-bit quantized vector (~115 MB total with HNSW index!)
  tcgplayer_product_id INT
);

-- 3. LAYER 2: FINANCIAL CATALOG SKUS (Dims #7–#13 + Rolling Auto-Pricing Columns)
CREATE TABLE catalog.card_sku_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_identity_id UUID NOT NULL REFERENCES catalog.card_identities(id) ON DELETE CASCADE,
  fingerprint_key TEXT NOT NULL UNIQUE,       -- Deterministic: EN:BS1:004:1ED:HOLO:NONE:STD:NONE:NONE
  edition_print_run TEXT NOT NULL DEFAULT 'UNL', -- Dim #7: '1ED', 'SHADOWLESS', 'UNL', '4TH_1999_2000', 'NO_RARITY'
  foil_finish TEXT NOT NULL DEFAULT 'NON_HOLO',  -- Dim #8: 'NON_HOLO', 'HOLO', 'REV_HOLO', 'POKE_BALL', 'MASTER_BALL', 'COSMO', 'ETCHED'
  stamp_type TEXT NOT NULL DEFAULT 'NONE',       -- Dim #9: 'NONE', 'POKEMON_CENTER', 'PRERELEASE', 'STAFF', 'ANNIV_25TH', 'PLAY_PKMN'
  deck_back_type TEXT NOT NULL DEFAULT 'STD',    -- Dim #10: 'STD', 'WORLD_CHAMP_SIGNED', 'HALF_DECK'
  serial_code TEXT NOT NULL DEFAULT 'NONE',      -- Dim #11: EX-Era Common Serial Code ('A', 'B', 'C')
  copyright_override TEXT,                       -- Dim #12: '1999-2000'
  catalog_error_type TEXT NOT NULL DEFAULT 'NONE', -- Dim #13: 'NONE', 'RED_CHEEKS', 'NO_SYMBOL', 'NO_STAGE'
  tcgplayer_sku_id INT,
  market_price NUMERIC(10, 2),                -- Live NM price (updated daily in-place = 0 MB table growth)
  low_price NUMERIC(10, 2),
  price_7d_ago NUMERIC(10, 2),
  price_30d_ago NUMERIC(10, 2),
  price_updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. LAYER 3: MULTI-TENANT STORE INVENTORY (Dim #14 Condition / Graded Slab)
CREATE TABLE public.inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID NOT NULL,                      -- Isolated per store via Supabase RLS
  sku_variant_id UUID NOT NULL REFERENCES catalog.card_sku_variants(id),
  is_graded BOOLEAN DEFAULT FALSE,            -- Dim #14: Raw vs Graded Slab
  raw_condition TEXT DEFAULT 'NM',            -- Dim #14: 'NM', 'LP', 'MP', 'HP', 'DMG'
  grading_company TEXT,                       -- Dim #14: 'PSA', 'BGS', 'CGC', 'TAG'
  grade_score NUMERIC(3, 1),                  -- Dim #14: 10.0, 9.5, 9.0
  cert_number TEXT UNIQUE,                    -- Dim #14: Unique Slab Barcode
  custom_oddity_note TEXT,                    -- Dim #13: One-off Miscut / Crimp note
  language_override TEXT,                     -- Optional override for rare NL/DE/FR/ZH copies
  quantity INT NOT NULL DEFAULT 1,
  cost_basis NUMERIC(10, 2),
  retail_price NUMERIC(10, 2),
  auto_price_enabled BOOLEAN DEFAULT TRUE
);

-- High-Speed Scanner & POS Indexes
CREATE INDEX idx_identities_embedding ON catalog.card_identities USING hnsw (art_embedding halfvec_cosine_ops);
CREATE INDEX idx_identities_name_trgm ON catalog.card_identities USING gin (name gin_trgm_ops);
CREATE INDEX idx_identities_num_clean ON catalog.card_identities (number_clean);`;
