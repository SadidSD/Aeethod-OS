export interface BoundingBoxZone {
  id: string;
  label: string;
  xPercent: number; // Percentage from left (0 - 100)
  yPercent: number; // Percentage from top (0 - 100)
  widthPercent: number; // Width as percentage of card (0 - 100)
  heightPercent: number; // Height as percentage of card (0 - 100)
  color: string;
  aiPipeline: string; // e.g. "YOLOv8 Localizer", "EasyOCR Text Line", "ResNet-50 Embedding"
  purpose: string;
  importance: 'Critical P0' | 'High P1' | 'Medium P2';
  pitfalls: string;
}

export interface CardGameSpec {
  id: string;
  name: string;
  era: string;
  dimensionMm: string;
  dimensionInches: string;
  cardstockWeight: string;
  aspectRatio: string;
  borderType: string;
  cardBackDescription: string;
  cardBackImage?: string;
  sampleFrontImage: string;
  rarityScheme: string[];
  zones: BoundingBoxZone[];
  keyIdentificationHeuristics: string[];
}

export interface VariantFinish {
  id: string;
  name: string;
  games: string[];
  rarityLevel: string;
  priceMultiplier: string; // e.g. "1.5x - 5x" or "10x - 50x"
  visualCharacteristics: string;
  scannerDetectionMethod: string;
  financialRiskLevel: 'Extreme' | 'High' | 'Medium' | 'Low';
  commonConfusion: string;
}

export interface ConditionTier {
  id: string;
  code: 'NM' | 'LP' | 'MP' | 'HP' | 'DMG';
  name: string;
  psaEquivalent: string;
  centeringTolerance: string;
  edgesTolerance: string;
  cornersTolerance: string;
  surfaceTolerance: string;
  marketPriceDeduction: string;
  customerDisputeRisk: string;
}

export interface OpticalHardwareChallenge {
  id: string;
  title: string;
  severity: 'Critical' | 'High' | 'Medium';
  cause: string;
  failureMode: string;
  engineeringSolution: string;
}

// ---------------------------------------------------------------------------
// 1. GAME ANATOMY SPECS
// ---------------------------------------------------------------------------
export const CARD_GAME_SPECS: CardGameSpec[] = [
  {
    id: 'pokemon-modern',
    name: 'Pokémon (Modern Era)',
    era: 'Scarlet & Violet / Sword & Shield (2020–Present)',
    dimensionMm: '63 x 88 mm',
    dimensionInches: '2.48 x 3.46 in',
    cardstockWeight: '300–320 gsm standard paper core',
    aspectRatio: '1 : 1.4',
    borderType: 'Silver border (S&V) or Yellow border (SwSh)',
    cardBackDescription: 'Standard English Pokéball blue background with Pokémon logo',
    sampleFrontImage: 'https://images.pokemontcg.io/sv3pt5/25_hires.png',
    rarityScheme: ['Common (C)', 'Uncommon (U)', 'Rare (R)', 'Double Rare (RR)', 'Illustration Rare (IR)', 'Special Illustration Rare (SIR)', 'Hyper Rare (Gold)'],
    keyIdentificationHeuristics: [
      'Set code abbreviation (e.g. MEW, PAR, SVI) located at bottom-left corner with expansion symbol.',
      'Collector number formatted as XXX/YYY (e.g. 025/165) or secret rare exceeding base set (e.g. 198/165).',
      'Language identifier tag (EN, JP, DE, FR) stamped right next to set code.',
      'Silver borders standard in modern S&V era, aligning with Japanese print standard.'
    ],
    zones: [
      {
        id: 'pkmn-title',
        label: 'Card Name & HP',
        xPercent: 6,
        yPercent: 4,
        widthPercent: 88,
        heightPercent: 7.5,
        color: '#f59e0b',
        aiPipeline: 'EasyOCR + String Fuzzy Match',
        purpose: 'Extracts exact Pokémon name, form (ex, V, VMAX), stage, and HP amount.',
        importance: 'Critical P0',
        pitfalls: 'Bold fonts or specialty stage banners (e.g. "Stage 2") can confuse bounding box heights.'
      },
      {
        id: 'pkmn-art',
        label: 'Artwork Box Frame',
        xPercent: 6,
        yPercent: 12.5,
        widthPercent: 88,
        heightPercent: 44,
        color: '#3b82f6',
        aiPipeline: 'ResNet-50 / ViT Image Embedding',
        purpose: 'Deep visual embedding to cross-reference card illustration against 250k card database.',
        importance: 'Critical P0',
        pitfalls: 'Full art and Special Illustration Rares break traditional frame boundaries and extend to 100% card face.'
      },
      {
        id: 'pkmn-set-code',
        label: 'Set Code & Symbol',
        xPercent: 5,
        yPercent: 91.5,
        widthPercent: 14,
        heightPercent: 5,
        color: '#8b5cf6',
        aiPipeline: 'YOLOv8 Localizer + CNN Classifier',
        purpose: 'Directly reads the 3-letter expansion set code (e.g. SVI, MEW, OBF).',
        importance: 'Critical P0',
        pitfalls: 'Only 3mm tall; requires sharp lens resolution (>300 DPI) to prevent character blur (e.g. MEW vs MEV).'
      },
      {
        id: 'pkmn-collector-no',
        label: 'Collector Number (XXX/YYY)',
        xPercent: 19.5,
        yPercent: 91.5,
        widthPercent: 22,
        heightPercent: 5,
        color: '#10b981',
        aiPipeline: 'Tesseract OCR / Fine-tuned Number Model',
        purpose: 'Reads card sequence number and total set count to definitively lock exact catalog SKU.',
        importance: 'Critical P0',
        pitfalls: 'Secret rares have numbers like 205/165 where numerator is larger than denominator.'
      },
      {
        id: 'pkmn-rarity-code',
        label: 'Rarity Symbol & Holo Stamp',
        xPercent: 42,
        yPercent: 91.5,
        widthPercent: 12,
        heightPercent: 5,
        color: '#ec4899',
        aiPipeline: 'Symbol Template Matcher',
        purpose: 'Identifies rarity stars/diamonds and promo regulation marks (e.g. "G" or "H").',
        importance: 'High P1',
        pitfalls: 'Rarity symbols changed from shapes (Circle, Diamond, Star) to letters in modern S&V.'
      },
      {
        id: 'pkmn-copyright',
        label: 'Copyright & Artist Credit',
        xPercent: 55,
        yPercent: 91.5,
        widthPercent: 40,
        heightPercent: 5,
        color: '#64748b',
        aiPipeline: 'Edge Text OCR',
        purpose: 'Verifies print year (e.g. ©2023 Pokémon / Nintendo) and identifies card illustrator.',
        importance: 'Medium P2',
        pitfalls: 'Extremely small 4pt font; prone to distortion from scanner roller jitter.'
      }
    ]
  },
  {
    id: 'pokemon-vintage',
    name: 'Pokémon (WotC Vintage Era)',
    era: 'Base Set to Neo Destiny (1999–2002)',
    dimensionMm: '63 x 88 mm',
    dimensionInches: '2.48 x 3.46 in',
    cardstockWeight: '300 gsm Wizards of the Coast stock',
    aspectRatio: '1 : 1.4',
    borderType: 'Thick Yellow border (English)',
    cardBackDescription: 'Original blue Pokéball logo backing',
    sampleFrontImage: 'https://images.pokemontcg.io/base1/4_hires.png',
    rarityScheme: ['Common (●)', 'Uncommon (◆)', 'Rare (★)', 'Holo Rare (★ Holo)', '1st Edition Stamp'],
    keyIdentificationHeuristics: [
      '1st Edition Stamp: Located on the left side below the artwork frame.',
      'Shadowless: Lack of dark drop-shadow on the right edge of the artwork box, plus "99" in the copyright year.',
      'Set Symbol: Located on the right side below the artwork frame (Base Set has NO symbol).',
      'Collector number located at bottom-right corner formatted as XX/102 or XX/64.'
    ],
    zones: [
      {
        id: 'pkmn-vint-title',
        label: 'Card Name & HP',
        xPercent: 7,
        yPercent: 4.5,
        widthPercent: 86,
        heightPercent: 7,
        color: '#f59e0b',
        aiPipeline: 'OCR + Title Index',
        purpose: 'Identifies vintage Pokémon name and HP.',
        importance: 'Critical P0',
        pitfalls: 'Red HP font in vintage Base Set can cause lower contrast against background art.'
      },
      {
        id: 'pkmn-vint-1st-edition',
        label: '1st Edition Stamp Area',
        xPercent: 6,
        yPercent: 49.5,
        widthPercent: 12,
        heightPercent: 6,
        color: '#ef4444',
        aiPipeline: 'Micro-Patch Binary Classifier',
        purpose: 'Detects presence of "Edition 1" circular stamp. Differentiates $500 vs $5,000 cards.',
        importance: 'Critical P0',
        pitfalls: 'Fake stamped cards with aftermarket ink stamps; thickness of the "1" (thick vs thin stamp).'
      },
      {
        id: 'pkmn-vint-set-symbol',
        label: 'Expansion Set Symbol',
        xPercent: 82,
        yPercent: 49.5,
        widthPercent: 12,
        heightPercent: 6,
        color: '#8b5cf6',
        aiPipeline: 'Symbol Template Matcher',
        purpose: 'Detects Jungle flower, Fossil hand, Team Rocket R, or absence of symbol (Base Set).',
        importance: 'Critical P0',
        pitfalls: 'Base Set has NO symbol; if missing and not 1st Edition, must check for Shadowless.'
      },
      {
        id: 'pkmn-vint-art-shadow',
        label: 'Art Box Shadow Region',
        xPercent: 88,
        yPercent: 14,
        widthPercent: 7,
        heightPercent: 36,
        color: '#06b6d4',
        aiPipeline: 'Pixel Luminance Differential',
        purpose: 'Checks if right border of art box has a dark drop shadow (Unlimited) or clean border (Shadowless).',
        importance: 'Critical P0',
        pitfalls: 'Determines whether a Base Set card is Shadowless ($5x to $20x price difference).'
      },
      {
        id: 'pkmn-vint-number',
        label: 'Collector Number & Rarity',
        xPercent: 75,
        yPercent: 92,
        widthPercent: 20,
        heightPercent: 5,
        color: '#10b981',
        aiPipeline: 'OCR Sequence Parser',
        purpose: 'Reads sequence number (e.g. 4/102 for Charizard) and shape rarity symbol.',
        importance: 'Critical P0',
        pitfalls: 'Base Set 2 has a tiny "2" stamp over the Pokeball symbol.'
      },
      {
        id: 'pkmn-vint-copyright',
        label: 'Copyright Year Line',
        xPercent: 10,
        yPercent: 92,
        widthPercent: 62,
        heightPercent: 4.5,
        color: '#64748b',
        aiPipeline: 'Text Tokenizer',
        purpose: 'Checks if copyright has "1999" vs "1999-2000" (4th print UK edition).',
        importance: 'High P1',
        pitfalls: '1999-2000 prints have subtle value premiums and distinct print textures.'
      }
    ]
  },
  {
    id: 'mtg-modern',
    name: 'Magic: The Gathering (MTG)',
    era: 'Modern Frame (M15 / 2015–Present)',
    dimensionMm: '63 x 88 mm',
    dimensionInches: '2.48 x 3.46 in',
    cardstockWeight: '310–330 gsm Blue Core cardstock',
    aspectRatio: '1 : 1.4',
    borderType: 'Black border standard (or borderless)',
    cardBackDescription: 'Classic brown Deckmaster back with infamous blue pen smudge on the "o"',
    sampleFrontImage: 'https://cards.scryfall.io/large/front/d/e/de467888-c70a-4712-9844-3069b24ce8e4.jpg',
    rarityScheme: ['Common (Black)', 'Uncommon (Silver)', 'Rare (Gold)', 'Mythic Rare (Orange/Red)', 'Special / Bonus Sheet (Purple)'],
    keyIdentificationHeuristics: [
      'Expansion set symbol located on middle-right line dividing artwork from text box.',
      'Set symbol color dictates rarity: Black=Common, Silver=Uncommon, Gold=Rare, Orange=Mythic.',
      'Bottom-left machine-readable info line: [3-letter Set Code] · [Card #] · [Rarity Letter] · [Language].',
      'Holofoil security stamp: Oval holofoil stamp embedded at bottom-center on all Rares and Mythics.'
    ],
    zones: [
      {
        id: 'mtg-title-mana',
        label: 'Card Name & Mana Cost',
        xPercent: 6,
        yPercent: 4.5,
        widthPercent: 88,
        heightPercent: 6,
        color: '#f59e0b',
        aiPipeline: 'OCR + Mana Symbol Parser',
        purpose: 'Extracts spell name and exact mana casting cost symbols ({U}{B}{R}).',
        importance: 'Critical P0',
        pitfalls: 'Split cards, Adventure cards, and Flip cards have dual names.'
      },
      {
        id: 'mtg-art',
        label: 'Artwork Box',
        xPercent: 6,
        yPercent: 11,
        widthPercent: 88,
        heightPercent: 43,
        color: '#3b82f6',
        aiPipeline: 'ResNet-50 Visual Matcher',
        purpose: 'Visual fingerprinting against Scryfall card image database.',
        importance: 'Critical P0',
        pitfalls: 'Secret Lair drops have radical, unconventional art styles that break all visual norms.'
      },
      {
        id: 'mtg-type-symbol',
        label: 'Type Line & Set Symbol',
        xPercent: 6,
        yPercent: 54.5,
        widthPercent: 88,
        heightPercent: 5.5,
        color: '#8b5cf6',
        aiPipeline: 'Symbol Matcher + Color K-Means',
        purpose: 'Reads expansion symbol on the right edge and measures dominant color (Gold vs Silver).',
        importance: 'Critical P0',
        pitfalls: 'Rarity symbol color is the primary indicator of Rare vs Uncommon.'
      },
      {
        id: 'mtg-security-stamp',
        label: 'Oval Security Holo Stamp',
        xPercent: 43.5,
        yPercent: 89.5,
        widthPercent: 13,
        heightPercent: 4,
        color: '#ec4899',
        aiPipeline: 'Hologram Micro-Detector',
        purpose: 'Detects presence of counter-fit deterrent oval holofoil or acorn stamp (Un-sets).',
        importance: 'High P1',
        pitfalls: 'Cards printed on "The List" have a small white planeswalker symbol in the bottom-left corner.'
      },
      {
        id: 'mtg-footer-info',
        label: 'Machine-Readable Footer',
        xPercent: 6,
        yPercent: 93.5,
        widthPercent: 45,
        heightPercent: 4,
        color: '#10b981',
        aiPipeline: 'High-Precision OCR Line',
        purpose: 'Parses set code, collector number, rarity letter (e.g. "MH3 · 045 · M · EN").',
        importance: 'Critical P0',
        pitfalls: 'The most authoritative single line on any modern MTG card.'
      }
    ]
  },
  {
    id: 'yugioh-standard',
    name: 'Yu-Gi-Oh! (Official Card Game)',
    era: 'Standard / Master Rule Era',
    dimensionMm: '59 x 86 mm (Small Japanese Size)',
    dimensionInches: '2.32 x 3.39 in',
    cardstockWeight: '280–300 gsm Konami cardstock',
    aspectRatio: '1 : 1.45',
    borderType: 'Frame-colored borders (Orange=Effect, Blue=Ritual, White=Synchro, Black=Xyz, Purple=Fusion)',
    cardBackDescription: 'Dark brown swirl with Yu-Gi-Oh! logo and Eye of Anubis hologram bottom-right',
    sampleFrontImage: 'https://images.ygoprodeck.com/images/cards/46986414.jpg',
    rarityScheme: ['Common', 'Rare (Silver title)', 'Super Rare (Holo art)', 'Ultra Rare (Gold title + Holo art)', 'Secret Rare (Rainbow foil + diagonal lines)', 'Starlight / Quarter Century Secret Rare'],
    keyIdentificationHeuristics: [
      'Card size is smaller than Pokémon and MTG (59x86mm vs 63x88mm); requires calibrated scanner guides.',
      'Set code located below the bottom-right corner of the artwork box (e.g. LOB-EN001).',
      'Card passcode: 8-digit unique number located at the bottom-left corner.',
      'Eye of Anubis Security Hologram: Located at the bottom-right corner (Gold = 1st Edition, Silver = Unlimited).'
    ],
    zones: [
      {
        id: 'ygo-title',
        label: 'Card Name & Foil Foil',
        xPercent: 6.5,
        yPercent: 3.5,
        widthPercent: 78,
        heightPercent: 6,
        color: '#f59e0b',
        aiPipeline: 'OCR + Foil Reflectance Analyzer',
        purpose: 'Reads card name and detects title foil color (Plain black, Silver, Gold, or Prismatic).',
        importance: 'Critical P0',
        pitfalls: 'Title foil color is the key differentiator between Super Rare (no title foil) and Ultra Rare (gold title).'
      },
      {
        id: 'ygo-attribute',
        label: 'Attribute Kanji / Symbol',
        xPercent: 86,
        yPercent: 3.5,
        widthPercent: 8.5,
        heightPercent: 6,
        color: '#ef4444',
        aiPipeline: 'Icon Matcher',
        purpose: 'Identifies attribute (DARK, LIGHT, FIRE, WATER, EARTH, WIND, DIVINE, SPELL, TRAP).',
        importance: 'High P1',
        pitfalls: 'Spell and Trap cards have green/pink background frames with specialized symbol glyphs.'
      },
      {
        id: 'ygo-art',
        label: 'Artwork Box',
        xPercent: 12.5,
        yPercent: 17,
        widthPercent: 75,
        heightPercent: 42,
        color: '#3b82f6',
        aiPipeline: 'ResNet-50 Visual Embedding',
        purpose: 'Fingerprints artwork against YGOPRODeck card catalog.',
        importance: 'Critical P0',
        pitfalls: 'Prismatic Secret Rare foil crosses artwork and borders with diagonal rainbow streaks.'
      },
      {
        id: 'ygo-set-code',
        label: 'Set Identifier (SET-ENXXX)',
        xPercent: 60,
        yPercent: 60,
        widthPercent: 28,
        heightPercent: 4.5,
        color: '#8b5cf6',
        aiPipeline: 'Localized OCR',
        purpose: 'Directly reads set abbreviation and card number (e.g. RA01-EN001).',
        importance: 'Critical P0',
        pitfalls: '1st Edition text is located immediately underneath or in bottom-left.'
      },
      {
        id: 'ygo-passcode',
        label: '8-Digit Card Passcode',
        xPercent: 5.5,
        yPercent: 93,
        widthPercent: 22,
        heightPercent: 4,
        color: '#10b981',
        aiPipeline: 'Digit Recognizer',
        purpose: 'Reads 8-digit official Konami database index number.',
        importance: 'Critical P0',
        pitfalls: 'Normal Monster cards, Egyptian God cards, and promo cards can have "This card cannot be used in a Duel" instead of passcode.'
      },
      {
        id: 'ygo-anubis-holo',
        label: 'Eye of Anubis Hologram',
        xPercent: 90,
        yPercent: 92.5,
        widthPercent: 6.5,
        heightPercent: 4.5,
        color: '#eab308',
        aiPipeline: 'Color & Pattern Hologram Classifier',
        purpose: 'Verifies Gold (1st Edition) vs Silver (Unlimited) stamp and detects counterfeit cards.',
        importance: 'Critical P0',
        pitfalls: 'Gold hologram with "1st Edition" text vs Silver hologram for reprint sets.'
      }
    ]
  },
  {
    id: 'onepiece-cardgame',
    name: 'One Piece Card Game (Bandai)',
    era: 'OP-01 to Present (2022–Present)',
    dimensionMm: '63 x 88 mm',
    dimensionInches: '2.48 x 3.46 in',
    cardstockWeight: '320 gsm Premium glossy Bandai stock',
    aspectRatio: '1 : 1.4',
    borderType: 'Black, White, or Manga Borderless',
    cardBackDescription: 'Red and deep blue compass with One Piece logo and Straw Hat jolly roger',
    sampleFrontImage: 'https://images.onepiece-cardgame.com/images/cardlist/card/OP05-119.png',
    rarityScheme: ['Common (C)', 'Uncommon (UC)', 'Rare (R)', 'Super Rare (SR)', 'Secret Rare (SEC)', 'Manga Rare (Alternate Art with comic panels)'],
    keyIdentificationHeuristics: [
      'Card code format: OP0X-YYY (e.g. OP05-119) or ST0X-YYY located at bottom-right.',
      'Manga Alternate Art: Background illustration features original black-and-white Oda manga panels. Worth $500–$4,000+.',
      'Card type: Leader, Character, Event, Stage displayed on the side/top.',
      'Life & Power values printed in circular stamps on the card margin.'
    ],
    zones: [
      {
        id: 'op-title',
        label: 'Character Name',
        xPercent: 20,
        yPercent: 5,
        widthPercent: 60,
        heightPercent: 6,
        color: '#f59e0b',
        aiPipeline: 'OCR Line Parser',
        purpose: 'Extracts pirate/marine character name (e.g. Monkey.D.Luffy, Roronoa Zoro).',
        importance: 'Critical P0',
        pitfalls: 'Manga alt-arts overlay large stylized calligraphy letters.'
      },
      {
        id: 'op-cost-power',
        label: 'Cost & Power Badges',
        xPercent: 5,
        yPercent: 4,
        widthPercent: 15,
        heightPercent: 12,
        color: '#ef4444',
        aiPipeline: 'Badge OCR',
        purpose: 'Reads play cost number and power stat badge.',
        importance: 'High P1',
        pitfalls: 'Leader cards have Life icons instead of Cost icons.'
      },
      {
        id: 'op-art',
        label: 'Illustration Canvas',
        xPercent: 5,
        yPercent: 18,
        widthPercent: 90,
        heightPercent: 50,
        color: '#3b82f6',
        aiPipeline: 'Manga Pattern Detection + ViT',
        purpose: 'Crucial: Differentiates standard Super Rare from Manga Rare comic background.',
        importance: 'Critical P0',
        pitfalls: 'Manga cards share the exact same card code as standard cards but are worth 50x more.'
      },
      {
        id: 'op-code-rarity',
        label: 'Card Code & Rarity (OP0X-YYY)',
        xPercent: 65,
        yPercent: 93,
        widthPercent: 30,
        heightPercent: 4.5,
        color: '#10b981',
        aiPipeline: 'Bandai Code Parser',
        purpose: 'Reads OP05-119 and rarity code (SEC, SR, R).',
        importance: 'Critical P0',
        pitfalls: 'Alt-arts have identical code; visual texture classifier must confirm alt-art status.'
      }
    ]
  }
];

// ---------------------------------------------------------------------------
// 2. VARIANT & FINISH TAXONOMY
// ---------------------------------------------------------------------------
export const VARIANT_FINISHES: VariantFinish[] = [
  {
    id: 'masterball-mirror',
    name: 'Masterball Mirror Holo',
    games: ['Pokémon (151, SV4a, etc.)'],
    rarityLevel: '1 per Booster Box',
    priceMultiplier: '5x – 40x over standard card',
    financialRiskLevel: 'Extreme',
    visualCharacteristics: 'Full-card mirror foil sheen embedded with repeating circular Master Ball icons featuring the letter "M".',
    scannerDetectionMethod: 'High-resolution localized pattern match. Convolutional filter checks for the distinct horizontal split and "M" symbol across the foil layer.',
    commonConfusion: 'Frequently misidentified as standard Pokéball Reverse Holo (worth $1.50 instead of $80 for Pikachu or Gengar).'
  },
  {
    id: 'pokeball-reverse',
    name: 'Pokéball Reverse Holofoil',
    games: ['Pokémon (Modern S&V)'],
    rarityLevel: 'Common / Regular Reverse',
    priceMultiplier: '1.2x – 2x',
    financialRiskLevel: 'Medium',
    visualCharacteristics: 'Standard reverse foil featuring watermark repeating classic red/white Pokéball silhouettes.',
    scannerDetectionMethod: 'Specular reflection check detecting repeating spherical boundary outlines.',
    commonConfusion: 'Mistaken for Masterball mirror by clerks not looking closely for the "M" crest.'
  },
  {
    id: 'traditional-reverse',
    name: 'Standard Reverse Holo',
    games: ['Pokémon'],
    rarityLevel: 'Standard Pack Infill',
    priceMultiplier: '1.1x – 1.5x',
    financialRiskLevel: 'Low',
    visualCharacteristics: 'The artwork box is completely matte non-foil, while the entire outer card frame, text box, and border shimmer with rainbow foil.',
    scannerDetectionMethod: 'Dual-zone reflectance: measures luminosity difference between artwork crop and outer frame.',
    commonConfusion: 'Clerks accidentally cataloging card as standard Non-Foil common.'
  },
  {
    id: 'foil-etched',
    name: 'Textured / Etched Holo',
    games: ['Pokémon', 'Magic: The Gathering'],
    rarityLevel: 'Ultra Rare / Secret Rare',
    priceMultiplier: '3x – 15x',
    financialRiskLevel: 'High',
    visualCharacteristics: 'Micro-embossed physical texture ridges (fingerprint-like concentric patterns) etched into the foil surface. Non-slip tactile feel.',
    scannerDetectionMethod: 'Oblique directional lighting: surface texture scatters angled light into distinctive high-frequency contrast noise.',
    commonConfusion: 'Mistaken for flat traditional holos when viewed strictly under diffuse flatbed lighting.'
  },
  {
    id: 'serialized',
    name: 'Serialized Numbered Cards',
    games: ['Magic: The Gathering', 'Sports Cards', 'Weiss Schwarz'],
    rarityLevel: 'Extremely Limited (e.g. #/500)',
    priceMultiplier: '10x – 100x+',
    financialRiskLevel: 'Extreme',
    visualCharacteristics: 'A small metallic banner box with laser-stamped numeric sequence (e.g. "042/500").',
    scannerDetectionMethod: 'Targeted ROI bounding box with strict OCR digits verification (numerator / denominator validation).',
    commonConfusion: 'Treated as the non-serialized version of the same borderless mythic, losing thousands in value.'
  },
  {
    id: 'first-edition-stamp',
    name: '1st Edition Stamp',
    games: ['Pokémon Vintage', 'Yu-Gi-Oh! Vintage'],
    rarityLevel: 'Print Run 1 Only',
    priceMultiplier: '4x – 25x over Unlimited',
    financialRiskLevel: 'Extreme',
    visualCharacteristics: 'Circular black ink stamp with "Edition 1" logo located under the bottom-left corner of the art box.',
    scannerDetectionMethod: 'Dedicated binary classifier trained on genuine WotC 1st Edition vector masks (checks font thickness, spacing, and absence of ink bleed).',
    commonConfusion: 'Unlimited copies sold as 1st Edition, or fake counterfeit stamps added by scammers to genuine unlimited cards.'
  },
  {
    id: 'stamped-promos',
    name: 'Prerelease / Staff / League Stamp',
    games: ['Pokémon', 'Magic: The Gathering', 'One Piece'],
    rarityLevel: 'Event Exclusive',
    priceMultiplier: '2x – 10x',
    financialRiskLevel: 'High',
    visualCharacteristics: 'Foil embossed text (e.g. "STAFF", "PRERELEASE", or event date) stamped directly into the bottom-right of the artwork.',
    scannerDetectionMethod: 'Artwork bottom-right ROI inspects for high-specular metallic lettering overlaying background paint.',
    commonConfusion: 'Staff stamped cards sold as regular prerelease promos ($20 vs $300 difference).'
  }
];

// ---------------------------------------------------------------------------
// 3. CONDITION GRADING RUBRIC
// ---------------------------------------------------------------------------
export const CONDITION_RUBRICS: ConditionTier[] = [
  {
    id: 'cond-nm',
    code: 'NM',
    name: 'Near Mint',
    psaEquivalent: 'PSA 7 – 9 / Gem Mint 10',
    centeringTolerance: 'Front: 60/40 or better | Back: 70/30 or better',
    edgesTolerance: 'Virtually flawless. Max 1 microscopic pin-point nick (<0.5mm) on back edge.',
    cornersTolerance: 'Sharp, clean factory cut. Zero fraying or layer separation.',
    surfaceTolerance: 'Pristine gloss. No scratches under normal light. Zero print lines, dents, or bends.',
    marketPriceDeduction: '100% of TCG Market (Full value benchmark)',
    customerDisputeRisk: 'Low (Industry standard expectation for modern singles)'
  },
  {
    id: 'cond-lp',
    code: 'LP',
    name: 'Lightly Played',
    psaEquivalent: 'PSA 5 – 6',
    centeringTolerance: 'Front: 70/30 or better',
    edgesTolerance: 'Minor edge wear or silvering along 1–2 borders (white paper core exposed <2mm total).',
    cornersTolerance: 'Faint whitening on 1 or 2 corner tips. No blunt crush deformations.',
    surfaceTolerance: 'Minor hairline scuffs visible only under angled light. Minor foil clouding. Zero creases.',
    marketPriceDeduction: '80% – 85% of Near Mint value',
    customerDisputeRisk: 'High if sold as NM. Main source of marketplace buyer chargebacks.'
  },
  {
    id: 'cond-mp',
    code: 'MP',
    name: 'Moderately Played',
    psaEquivalent: 'PSA 3 – 4',
    centeringTolerance: 'Severe off-centering tolerated (up to 85/15)',
    edgesTolerance: 'Noticeable edge whitening along multiple borders. Flaking ink.',
    cornersTolerance: 'Visible corner fraying, rounded tips, or slight layer separation.',
    surfaceTolerance: 'Visible scratching, binder ring indentation, small faint surface crease not breaching cardstock.',
    marketPriceDeduction: '60% – 70% of Near Mint value',
    customerDisputeRisk: 'Low when accurately graded. Highly desirable for tournament players.'
  },
  {
    id: 'cond-hp',
    code: 'HP',
    name: 'Heavily Played',
    psaEquivalent: 'PSA 1 – 2',
    centeringTolerance: 'Any centering',
    edgesTolerance: 'Severe, continuous whitening and silvering on all four edges.',
    cornersTolerance: 'Blunt, deformed, bent or peeling corners.',
    surfaceTolerance: 'Major deep scratches, heavy clouding, ink fading, noticeable non-structural crease.',
    marketPriceDeduction: '40% – 50% of Near Mint value',
    customerDisputeRisk: 'Low if explicitly disclosed with photos.'
  },
  {
    id: 'cond-dmg',
    code: 'DMG',
    name: 'Damaged',
    psaEquivalent: 'Authentic / Incomplete',
    centeringTolerance: 'Any',
    edgesTolerance: 'Torn, shredded, or cut edges.',
    cornersTolerance: 'Missing corner fragments or deep dog-ear folds.',
    surfaceTolerance: 'Structural creases through both layers, liquid/water damage, warping, pen marks, pinholes.',
    marketPriceDeduction: '15% – 30% of Near Mint value',
    customerDisputeRisk: 'Requires detailed real photos. Never sell raw bulk damaged.'
  }
];

// ---------------------------------------------------------------------------
// 4. OPTICAL & SCANNER HARDWARE CHALLENGES
// ---------------------------------------------------------------------------
export const OPTICAL_CHALLENGES: OpticalHardwareChallenge[] = [
  {
    id: 'opt-foil-glare',
    title: 'Foil Specular Glare & Sensor Saturation',
    severity: 'Critical',
    cause: 'Prismatic micro-gratings on holofoil cards reflect point-source LEDs directly back into camera sensors.',
    failureMode: 'Pure white blown-out blown highlights (RGB 255, 255, 255) completely obscuring card title, art, and set symbols.',
    engineeringSolution: 'Cross-Polarization Filtering: Place a linear polarizing sheet over light sources and a cross-polarized (90° offset) analyzer filter on the camera lens. Eliminates 99% of surface glare while preserving true ink color.'
  },
  {
    id: 'opt-sleeves-toploaders',
    title: 'Plastic Sleeves & Scratched Toploaders',
    severity: 'High',
    cause: 'Sellers submit cards in polypropylene penny sleeves, matte dragon shield sleeves, or scratched semi-rigid toploaders.',
    failureMode: 'Scratches and dust on the plastic sleeve get falsely identified by AI as surface scratches on the physical card.',
    engineeringSolution: 'Multi-Exposure Focus Stacking or mandatory raw card policy for bulk ADF feeds. High-value kiosk cards use polarized illumination + depth-map differential focus to separate sleeve surface from card plane.'
  },
  {
    id: 'opt-pringling',
    title: 'Card Curling / "Pringling" (Humidity Warping)',
    severity: 'High',
    cause: 'Foil cardstock layers expand at different rates in humid environments, causing foil cards to curl into a curved U-shape.',
    failureMode: 'Curled cards create optical perspective distortion (keystoning), focal plane defocus, and mechanical feeder jams in document scanners.',
    engineeringSolution: 'Weighted glass feeder flattener or mechanical guide pressure rollers. Software applies 4-point mesh homography warp correction before passing image to OCR models.'
  },
  {
    id: 'opt-edge-jitter',
    title: 'ADF Feeder Jitter & Roller Skew',
    severity: 'Medium',
    cause: 'High-speed document scanners (Ricoh fi-8170) feed cards at 70–90 cards per minute; mechanical rollers can introduce slight 1°–3° angular rotation.',
    failureMode: 'Centering calculation algorithms give incorrect 45/55 scores to cards that are actually 50/50 factory cut.',
    engineeringSolution: 'Automated OpenCV Deskewing pipeline: Detect exact 4 outer card boundaries using minimum-bounding-rectangle rotated box algorithms and rotate canvas to strict 0.00° before calculating centering.'
  },
  {
    id: 'opt-japanese-cardstock',
    title: 'Card Dimensions & Cardstock Variances',
    severity: 'Medium',
    cause: 'Yu-Gi-Oh! cards are 59x86mm (small), standard TCGs are 63x88mm, and vintage cards have softer cardstock than modern rigid foils.',
    failureMode: 'Yu-Gi-Oh! cards shift sideways inside standard 63mm scanner feeder trays, causing crooked feeds and sensor edge clipping.',
    engineeringSolution: '3D-printed adjustable feeder guide adapters with spring-loaded tension arms that keep cards centered along the optical scanning axis.'
  }
];
