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

export interface AuthenticationCheck {
  id: string;
  testName: string;
  targetGames: string[];
  equipmentNeeded: string;
  passCriteria: string;
  failCriteria: string;
  riskMitigation: string;
  aiFeasibility: 'Fully Automatable (Macro/Camera)' | 'Sensor Rig Required' | 'Manual Physical Test';
}

export interface CardThicknessSpec {
  id: string;
  pointSize: string;
  thicknessMm: string;
  thicknessInches: string;
  cardTypes: string[];
  adfSafe: boolean;
  scannerFeedRule: string;
  weightGramsAvg: string;
}

export interface MisprintClassification {
  id: string;
  name: string;
  collectorName: string;
  rarity: string;
  marketImpact: string;
  visualCharacteristics: string;
  cvDetectionStrategy: string;
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
  },
  {
    id: 'disney-lorcana',
    name: 'Disney Lorcana (Ravensburger)',
    era: 'The First Chapter to Present (2023–Present)',
    dimensionMm: '63 x 88 mm',
    dimensionInches: '2.48 x 3.46 in',
    cardstockWeight: '320 gsm Ravensburger German cardstock',
    aspectRatio: '1 : 1.4',
    borderType: 'Black, Ink-colored, or Borderless (Enchanted)',
    cardBackDescription: 'Dark blue starry galaxy with golden Lorcana ornate compass and lore ink logo',
    sampleFrontImage: 'https://images.lorcania.com/cards/tfc/214_en_elsa.webp',
    rarityScheme: ['Common', 'Uncommon', 'Rare', 'Super Rare', 'Legendary', 'Enchanted (Alt-Art Foil)'],
    keyIdentificationHeuristics: [
      'Ink Cost hex symbol located at top-left corner with well ink well swirl.',
      'Card Title and Subtitle located in header bar.',
      'Lore Value: Diamond pips on the right side of the text box (1 to 4 diamonds).',
      'Collector number and set symbol at bottom-center: formatted as XXX/YYY · EN · 1.',
      'Enchanted Rarity: Borderless art with full shimmering rainbow foil pattern ($200 to $1,500+ value).'
    ],
    zones: [
      {
        id: 'lor-ink-cost',
        label: 'Ink Cost Hexagon',
        xPercent: 4,
        yPercent: 3.5,
        widthPercent: 14,
        heightPercent: 10,
        color: '#6366f1',
        aiPipeline: 'OCR + Hexagon Shape Localizer',
        purpose: 'Extracts the card ink play cost and inkable ring status.',
        importance: 'Critical P0',
        pitfalls: 'Cards without circular swirl rim around the hex cost are non-inkable in gameplay.'
      },
      {
        id: 'lor-title',
        label: 'Card Title & Subtitle',
        xPercent: 19,
        yPercent: 4.5,
        widthPercent: 77,
        heightPercent: 8,
        color: '#f59e0b',
        aiPipeline: 'Double-Line Text OCR',
        purpose: 'Extracts character name (e.g. Elsa) and version epithet (e.g. Spirit of Winter).',
        importance: 'Critical P0',
        pitfalls: 'Subtitle text is smaller and italicized below main character name.'
      },
      {
        id: 'lor-art',
        label: 'Artwork Canvas / Enchanted Foil',
        xPercent: 6,
        yPercent: 15,
        widthPercent: 88,
        heightPercent: 45,
        color: '#3b82f6',
        aiPipeline: 'Enchanted Micro-Shimmer Texture Classifier',
        purpose: 'Cross-references Disney character artwork and detects rare Enchanted borderless foil treatment.',
        importance: 'Critical P0',
        pitfalls: 'Enchanted cards share identical rules text and set number prefix as normal foil legendaries.'
      },
      {
        id: 'lor-stats',
        label: 'Strength, Willpower & Lore Pips',
        xPercent: 76,
        yPercent: 56,
        widthPercent: 18,
        heightPercent: 28,
        color: '#ec4899',
        aiPipeline: 'Digit & Glyph Parser',
        purpose: 'Extracts combat attack, willpower defense shield, and diamond lore counter symbols.',
        importance: 'High P1',
        pitfalls: 'Action and Song cards do not have strength/willpower stats.'
      },
      {
        id: 'lor-footer-code',
        label: 'Collector Number (XXX/YYY) & Rarity',
        xPercent: 15,
        yPercent: 93,
        widthPercent: 70,
        heightPercent: 4,
        color: '#10b981',
        aiPipeline: 'Footer Regex Matcher',
        purpose: 'Authoritative identification code (e.g. "214/204 · EN · 1") and rarity symbol shape.',
        importance: 'Critical P0',
        pitfalls: 'Enchanted cards exceed set denominator (e.g. 214/204 is an Enchanted Elsa).'
      }
    ]
  },
  {
    id: 'flesh-and-blood',
    name: 'Flesh and Blood (Legend Story Studios)',
    era: 'Welcome to Rathe to Present (2019–Present)',
    dimensionMm: '63 x 88 mm',
    dimensionInches: '2.48 x 3.46 in',
    cardstockWeight: '310 gsm Cartamundi black core stock',
    aspectRatio: '1 : 1.4',
    borderType: 'Dark textured frame with red/yellow/blue pitch bars',
    cardBackDescription: 'Intricate red and gold runic circular seal with cross blades and FAB crest',
    sampleFrontImage: 'https://storage.googleapis.com/fabmaster/media/images/WTR001.png',
    rarityScheme: ['Common', 'Rare', 'Majestic', 'Legendary', 'Fabled', 'Marvel (Cold Foil Special)'],
    keyIdentificationHeuristics: [
      'Pitch Value: 1 (Red), 2 (Yellow), 3 (Blue) pitch dots on top-left bar. Crucial: Same card name has 3 pitch versions with different market values!',
      '1st Edition vs Unlimited: "1st Edition" micro-text on bottom edge; Cold Foils only exist in 1st Edition booster boxes for early sets ($10x to $50x value difference).',
      'Cold Foil vs Rainbow Foil: Cold foil has a metallic matte sheen on borders without rainbow dispersion; rainbow foil shimmers across art.',
      'Collector code located at bottom: e.g. WTR001 or OUT045.'
    ],
    zones: [
      {
        id: 'fab-pitch',
        label: 'Pitch Bar & Color Value',
        xPercent: 4.5,
        yPercent: 3.5,
        widthPercent: 14,
        heightPercent: 8,
        color: '#ef4444',
        aiPipeline: 'Color Dominance + Circle Pip Counter',
        purpose: 'Detects Red (1-pitch), Yellow (2-pitch), or Blue (3-pitch). Different pitch copies have different prices!',
        importance: 'Critical P0',
        pitfalls: 'Mistaking a red pitch copy for a blue pitch copy causes pricing inventory errors.'
      },
      {
        id: 'fab-title',
        label: 'Card Title & Resource Cost',
        xPercent: 19,
        yPercent: 4,
        widthPercent: 76,
        heightPercent: 7,
        color: '#f59e0b',
        aiPipeline: 'OCR + Resource Cost parser',
        purpose: 'Reads card name and resource play cost in top-right corner.',
        importance: 'Critical P0',
        pitfalls: 'Card name font is gothic serif; spacing must be preserved.'
      },
      {
        id: 'fab-art',
        label: 'Artwork Box & Cold Foil Edge',
        xPercent: 6,
        yPercent: 13,
        widthPercent: 88,
        heightPercent: 46,
        color: '#3b82f6',
        aiPipeline: 'ResNet-50 Embedding + Cold Foil Specular Sensor',
        purpose: 'Visual art matching and boundary check for Cold Foil metallic border reflection.',
        importance: 'Critical P0',
        pitfalls: 'Cold foil does NOT reflect rainbow prism light; it reflects bright silver metallic light.'
      },
      {
        id: 'fab-stats',
        label: 'Attack, Defense & Health Values',
        xPercent: 5,
        yPercent: 88,
        widthPercent: 90,
        heightPercent: 8,
        color: '#ec4899',
        aiPipeline: 'OCR Triplets',
        purpose: 'Reads attack power value, defense shield stat, and life health counter.',
        importance: 'High P1',
        pitfalls: 'Non-attack actions do not have bottom attack stats.'
      },
      {
        id: 'fab-edition-footer',
        label: '1st Edition Stamp & Set Code',
        xPercent: 20,
        yPercent: 95,
        widthPercent: 60,
        heightPercent: 3.5,
        color: '#10b981',
        aiPipeline: 'High-DPI Micro-Line OCR',
        purpose: 'Verifies 1st Edition vs Unlimited print run and reads set code (e.g. WTR001).',
        importance: 'Critical P0',
        pitfalls: '1st Edition text is extremely tiny (3pt) located adjacent to copyright info.'
      }
    ]
  },
  {
    id: 'sports-cards-modern',
    name: 'Sports Cards (Panini / Topps / Bowman)',
    era: 'Modern Chrome, Prizm & Relic Era (2015–Present)',
    dimensionMm: '63.5 x 88.9 mm (Standard 2.5 x 3.5 in)',
    dimensionInches: '2.5 x 3.5 in',
    cardstockWeight: 'Variable: 35 pt (0.89mm) to 180 pt (4.5mm) Relic Patch',
    aspectRatio: '1 : 1.4',
    borderType: 'Opti-chrome, refractor, or borderless',
    cardBackDescription: 'Player career statistics, scouting report, and manufacturer authentication guarantee',
    sampleFrontImage: 'https://images.beckett.com/images/items/12345/prizm_silver_sample.png',
    rarityScheme: ['Base', 'Silver / Prizm Refractor', 'Numbered Parallel (/299, /99, /25, /10)', '1-of-1 SuperFractor / Nebula', 'Game-Used Relic Patch', 'On-Card Rookie Autograph'],
    keyIdentificationHeuristics: [
      'Rookie Card "RC" Shield or Bowman 1st Logo: Multiplies base value by 3x to 10x over veteran cards.',
      'Serial Numbering: Foil-stamped numeric sequence (e.g. "07/25" or "1/1") designating exact rarity print run.',
      'Card Thickness Hazard: Relic cards measure 75pt–180pt thick. NEVER run thick sports cards through an ADF document feeder (instant mechanical crunch).',
      'Autograph Type: On-card hand-signed ink commands a 30%–100% price premium over adhesive sticker autographs.'
    ],
    zones: [
      {
        id: 'sports-rc-shield',
        label: 'Rookie Card "RC" / 1st Bowman Shield',
        xPercent: 6,
        yPercent: 6,
        widthPercent: 14,
        heightPercent: 10,
        color: '#ef4444',
        aiPipeline: 'Logo Template Matcher (YOLOv8)',
        purpose: 'Detects presence of "RC" Rookie Card badge or "1st Bowman" foil emblem.',
        importance: 'Critical P0',
        pitfalls: 'Rookie card badges vary in style between Panini, Topps, and Upper Deck.'
      },
      {
        id: 'sports-serial-number',
        label: 'Laser Stamped Serial Number',
        xPercent: 68,
        yPercent: 8,
        widthPercent: 26,
        heightPercent: 6,
        color: '#ec4899',
        aiPipeline: 'Foil Digit Recognizer (Numerator/Denominator)',
        purpose: 'Verifies limited print run (e.g. 05/25 or 1/1).',
        importance: 'Critical P0',
        pitfalls: 'Gold/silver foil stamped digits reflect light and wash out without cross-polarized lens.'
      },
      {
        id: 'sports-player-name',
        label: 'Player Name & Team Banner',
        xPercent: 8,
        yPercent: 80,
        widthPercent: 84,
        heightPercent: 10,
        color: '#f59e0b',
        aiPipeline: 'OCR + Player Roster Database Lookup',
        purpose: 'Extracts superstar/rookie athlete name and team.',
        importance: 'Critical P0',
        pitfalls: 'Stylized foil typography and curved text baselines require polygonal text contour OCR.'
      },
      {
        id: 'sports-autograph',
        label: 'Autograph & Ink Verification Window',
        xPercent: 14,
        yPercent: 60,
        widthPercent: 72,
        heightPercent: 18,
        color: '#8b5cf6',
        aiPipeline: 'Stroke Density Analyzer + Sticker Edge Detector',
        purpose: 'Validates athlete signature and classifies whether it is On-Card or Sticker Auto.',
        importance: 'Critical P0',
        pitfalls: 'Sticker autographs show a visible rectangular adhesive tape edge.'
      },
      {
        id: 'sports-relic-patch',
        label: 'Game-Used Relic Patch Window',
        xPercent: 20,
        yPercent: 35,
        widthPercent: 60,
        heightPercent: 24,
        color: '#06b6d4',
        aiPipeline: 'Fabric Texture & Color Count Analyzer',
        purpose: 'Inspects jersey swatch cloth (multi-color prime patches with seam stitches are worth 5x more than single-color napkin swatches).',
        importance: 'High P1',
        pitfalls: 'Relic cards are thick (75pt - 180pt); dangerous for automated ADF feed rollers.'
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
  },
  {
    id: 'cold-foil',
    name: 'Cold Foil (Flesh and Blood)',
    games: ['Flesh and Blood'],
    rarityLevel: '1st Edition Booster Box Exclusive',
    priceMultiplier: '5x – 25x over Rainbow Foil',
    financialRiskLevel: 'Extreme',
    visualCharacteristics: 'Distinct silver/metallic mirror sheen baked directly into card frames and borders. Lacks rainbow spectrum light dispersion.',
    scannerDetectionMethod: 'Angular reflectance colorimetry: Cold Foil yields high white/silver specular peak without hue rotation under rotating illumination.',
    commonConfusion: 'Confused with standard Rainbow Foil, which shimmers with full rainbow colors across the entire art box.'
  },
  {
    id: 'enchanted-foil',
    name: 'Enchanted Borderless Foil',
    games: ['Disney Lorcana'],
    rarityLevel: '1 in ~96 packs (1 per case)',
    priceMultiplier: '15x – 50x over standard Legendary',
    financialRiskLevel: 'Extreme',
    visualCharacteristics: 'Full borderless character illustration overlaid with a distinctive soft hexagonal shimmer foil across the whole card face.',
    scannerDetectionMethod: 'Edge borderlessness detector combined with full-face micro-shimmer Fourier frequency transform.',
    commonConfusion: 'Cataloged as base foil legendary due to identical rules text.'
  },
  {
    id: 'god-rare-gdr',
    name: 'God Rare (GDR)',
    games: ['Dragon Ball Super Card Game'],
    rarityLevel: 'Ultra-Mythic (1 in ~3 cases)',
    priceMultiplier: '20x – 80x over Secret Rare ($800–$2,500)',
    financialRiskLevel: 'Extreme',
    visualCharacteristics: 'Intense 24k gold foil leaf stamping with heavy holographic relief etching and gold Japanese kanji.',
    scannerDetectionMethod: 'Gold pigment reflectance signature + 3D tactile relief height mapping under directional LEDs.',
    commonConfusion: 'Mistaken for standard Secret Rare (SCR), losing thousands of dollars.'
  },
  {
    id: 'refractor-prizm',
    name: 'Silver Prizm / Chrome Refractor',
    games: ['Sports Cards (Panini / Topps / Bowman)'],
    rarityLevel: 'Parallel Case Hit',
    priceMultiplier: '2x – 15x over base paper',
    financialRiskLevel: 'High',
    visualCharacteristics: 'High-gloss opti-chrome cardstock that diffracts ambient light into vertical/diagonal rainbow light ribbons.',
    scannerDetectionMethod: 'Diffraction grating response: dual-sensor light angle checks for directional light streak.',
    commonConfusion: 'Base paper cards mistagged as silver prizms in poor scanner lighting.'
  },
  {
    id: 'on-card-autograph',
    name: 'On-Card Authentic Autograph',
    games: ['Sports Cards', 'Magic: The Gathering', 'Pokémon Artist Signatures'],
    rarityLevel: 'Hand-Signed Collectible',
    priceMultiplier: '5x – 50x',
    financialRiskLevel: 'Extreme',
    visualCharacteristics: 'Real ballpoint, paint pen, or blue Sharpie ink signed directly on the card surface with natural ink pooling and pressure tapering.',
    scannerDetectionMethod: 'Specular ink reflection + sticker boundary edge exclusion. Checks for absence of clear adhesive tape rectangle border.',
    commonConfusion: 'Sticker autographs sold as on-card autos, or printed facsimile signatures treated as real hand-signed ink.'
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

// ---------------------------------------------------------------------------
// 5. AUTHENTICATION & COUNTERFEIT DETECTION PROTOCOLS
// ---------------------------------------------------------------------------
export const AUTHENTICATION_CHECKS: AuthenticationCheck[] = [
  {
    id: 'mtg-green-dot',
    testName: 'MTG Green Dot Test (60x Magnification)',
    targetGames: ['Magic: The Gathering (All Eras)'],
    equipmentNeeded: '60x–120x Micro-Zoom Camera or USB Microscope',
    passCriteria: 'Inside the green mana circle on the card back, 4 distinct red sub-dots forming an "L" shape (or backwards L) are visible in the yellow background grid. The black circular boundary line has crisp, unbroken rosette edges.',
    failCriteria: 'Red dots are missing, scattered randomly, or the black boundary line is printed with CMYK dithering instead of solid black ink.',
    riskMitigation: 'Stops $500–$50,000 counterfeit Vintage/Reserved List cards (Black Lotus, Dual Lands, Moxen).',
    aiFeasibility: 'Fully Automatable (Macro/Camera)'
  },
  {
    id: 'rosette-screen',
    testName: 'Halftone Rosette Screen vs Inkjet Droplet Test',
    targetGames: ['Pokémon', 'Magic: The Gathering', 'Yu-Gi-Oh!', 'One Piece', 'Disney Lorcana'],
    equipmentNeeded: 'Macro Lens (1200+ DPI Optical Resolution)',
    passCriteria: 'Card artwork shows traditional offset lithographic circular rosette dot patterns. Black text, mana symbols, and card borders are printed as a separate crisp solid black layer (K-plate) on top of the rosettes with razor-sharp edges.',
    failCriteria: 'Artwork exhibits erratic micro-droplet spatter (inkjet) or toner melting beads (color laser). Black text has jagged CMYK colored halos rather than solid black ink.',
    riskMitigation: 'Detects 95% of retail bootlegs and proxy cards within 200 milliseconds of image capture.',
    aiFeasibility: 'Fully Automatable (Macro/Camera)'
  },
  {
    id: 'blue-black-core-light',
    testName: 'Paper Core Sandwich Light Transmission Test',
    targetGames: ['Pokémon (Black Core)', 'Magic: The Gathering (Blue Core)'],
    equipmentNeeded: 'Backlit Transillumination LED Bed (4000+ Lumens)',
    passCriteria: 'Light shining through the card reveals a faint, deep bluish or blackish opaque silhouette. Card core blocks 80%+ of direct light transmission.',
    failCriteria: 'Light penetrates cleanly with a bright yellow or white glow, revealing cheap single-ply cardboard stock lacking the interior anti-translucency sandwich core.',
    riskMitigation: 'Instantly identifies counterfeit cards made on standard cardstock without industrial security cores.',
    aiFeasibility: 'Sensor Rig Required'
  },
  {
    id: 'uv-blacklight-fluorescence',
    testName: 'UV 365nm Optical Brightener Test',
    targetGames: ['Pokémon Vintage', 'Magic: The Gathering Vintage', 'Yu-Gi-Oh!'],
    equipmentNeeded: '365nm UV-A Blacklight Illumination Diode',
    passCriteria: 'Genuine vintage cards absorb UV light and remain dull/dark, as authentic vintage cardstock did not utilize artificial chemical optical brighteners (OBAs).',
    failCriteria: 'Card glows in radiant neon violet/blue, indicating modern bleached wood pulp containing synthetic whitening agents typical of Chinese counterfeits.',
    riskMitigation: 'Catches re-backed, bleached, and modern counterfeit vintage cards.',
    aiFeasibility: 'Sensor Rig Required'
  },
  {
    id: 'weight-micrometer-density',
    testName: 'Precision Gravimetric & Caliper Thickness Tolerance',
    targetGames: ['All Card Games'],
    equipmentNeeded: 'Precision Digital Milligram Scale (0.001g) + Digital Micrometer',
    passCriteria: 'Pokémon: 1.72g ± 0.05g (Thickness: 0.30mm ± 0.01mm). MTG: 1.75g ± 0.05g (Thickness: 0.31mm). Yu-Gi-Oh!: 1.65g ± 0.04g (Thickness: 0.28mm).',
    failCriteria: 'Card weight deviates by >0.10g or thickness exceeds 0.33mm or falls below 0.27mm.',
    riskMitigation: 'Filters out counterfeit paper stock, fake foil laminates, and trimmed cards.',
    aiFeasibility: 'Sensor Rig Required'
  },
  {
    id: 'microprinting-security',
    testName: 'Security Microprinting & Holographic Grating Check',
    targetGames: ['Yu-Gi-Oh! (Eye of Anubis)', 'Magic: The Gathering (M15 Stamp)'],
    equipmentNeeded: 'High-Res Optical Scanner (>2400 DPI)',
    passCriteria: 'Yu-Gi-Oh!: Microscopic "KONAMI" text repeats across the Eye of Anubis holographic surface in 50-micron letters. MTG: Oval stamp contains repeating "Wizards" and mana glyphs in holographic relief.',
    failCriteria: 'Flat reflective foil sticker with no microscopic text or blurry static holographic imitation.',
    riskMitigation: 'Detects counterfeit high-end singles with fake aftermarket glued holograms.',
    aiFeasibility: 'Fully Automatable (Macro/Camera)'
  }
];

// ---------------------------------------------------------------------------
// 6. CARD THICKNESS & SCANNER HARDWARE LIMITS (POINT GAUGE)
// ---------------------------------------------------------------------------
export const CARD_THICKNESS_SPECS: CardThicknessSpec[] = [
  {
    id: 'thick-35pt',
    pointSize: '35 pt',
    thicknessMm: '0.89 mm (0.035 in)',
    thicknessInches: '0.035 in',
    cardTypes: [
      'Standard Pokémon (Base & Modern)',
      'Magic: The Gathering (Standard Blue Core)',
      'Yu-Gi-Oh! (Standard OCG/TCG)',
      'One Piece Card Game',
      'Disney Lorcana',
      'Standard Base Sports Cards'
    ],
    adfSafe: true,
    scannerFeedRule: 'SAFE: Supported in high-speed ADF document scanners (Ricoh fi-8170, Fujitsu) at up to 70–90 cards/min with proper cardstock guides.',
    weightGramsAvg: '1.65g – 1.78g'
  },
  {
    id: 'thick-55pt',
    pointSize: '55 pt',
    thicknessMm: '1.40 mm (0.055 in)',
    thicknessInches: '0.055 in',
    cardTypes: [
      'Chrome Refractor Parallels (Sports)',
      'WotC Vintage Promo Heavy Foil Stock',
      'Acetate Clear Cards',
      'Double-Sleeved TCG Gaming Cards'
    ],
    adfSafe: false,
    scannerFeedRule: 'CAUTION: Single-feed bypass only. Automated batch ADF feeding risks severe roller friction, double feeds, and surface scratching.',
    weightGramsAvg: '2.50g – 2.90g'
  },
  {
    id: 'thick-75-100pt',
    pointSize: '75 pt – 100 pt',
    thicknessMm: '1.90 mm – 2.54 mm',
    thicknessInches: '0.075 – 0.100 in',
    cardTypes: [
      'Sports Event-Worn Jersey Patch Cards',
      'Dual-Layer Embossed Metal Cards',
      'Triple-Thick Memorabilia Insets'
    ],
    adfSafe: false,
    scannerFeedRule: 'PROHIBITED IN ADF: Will cause instant mechanical paper jams and destroy card corners. MUST use flatbed scanner or automated robotic vacuum arm.',
    weightGramsAvg: '3.80g – 5.20g'
  },
  {
    id: 'thick-130-180pt',
    pointSize: '130 pt – 180 pt',
    thicknessMm: '3.30 mm – 4.57 mm',
    thicknessInches: '0.130 – 0.180 in',
    cardTypes: [
      'Prime Multi-Color Game-Used Patch Cards',
      'Autographed Relic Shield Cards',
      'Bat Knobs / Cleat Relics'
    ],
    adfSafe: false,
    scannerFeedRule: 'PROHIBITED IN FEEDERS: Thickness exceeds all document scanner throat gaps. Manual flatbed placement or overhead multi-angle camera booth only.',
    weightGramsAvg: '6.50g – 9.50g'
  },
  {
    id: 'thick-240-360pt',
    pointSize: '240 pt – 360 pt',
    thicknessMm: '6.10 mm – 9.14 mm',
    thicknessInches: '0.240 – 0.360 in',
    cardTypes: [
      'Booklet Cards (Fold-out)',
      'Shoe Sneaker Patch Relics',
      'Solid Metal Printing Plates'
    ],
    adfSafe: false,
    scannerFeedRule: 'PROHIBITED IN ALL FEEDERS: Museum-grade ultra-thick memorabilia. Requires specialized depth-of-field overhead camera rig with telecentric lens.',
    weightGramsAvg: '12.0g – 24.0g'
  }
];

// ---------------------------------------------------------------------------
// 7. FACTORY ERRORS & MISPRINTS TAXONOMY
// ---------------------------------------------------------------------------
export const MISPRINT_TYPES: MisprintClassification[] = [
  {
    id: 'miscut-alignment',
    name: 'Miscut with Visible Alignment Dot',
    collectorName: 'Alignment Dot Miscut (MC)',
    rarity: '1 in ~5,000 packs',
    marketImpact: '3x – 15x Premium to specialized error collectors (CGC/PSA "MC" qualifier)',
    visualCharacteristics: 'Card is cut so severely off-center that the black or white crosshair alignment dot in the sheet corner is clearly visible, or part of the neighboring card is shown.',
    cvDetectionStrategy: 'Corner bounding box template check looks for high-contrast circular alignment dots; border width on opposing side approaches 0.0mm.'
  },
  {
    id: 'factory-crimp',
    name: 'Factory Packaging Heat Crimp',
    collectorName: 'Crimped Error',
    rarity: '1 in ~2,500 packs',
    marketImpact: '1.5x – 5x Premium on desirable characters; minor penalty on bulk',
    visualCharacteristics: 'Top or bottom edge of the card features deep corrugated serration ridges caused by booster pack heat-sealing machinery teeth grabbing the card.',
    cvDetectionStrategy: 'Edge profile analysis: detects regular repeating sinusoidal indentations (depth 0.2mm–0.5mm) along top or bottom margin.'
  },
  {
    id: 'holo-bleed',
    name: 'Holo Bleed / Opacity Failure',
    collectorName: 'Full Surface Holo Bleed',
    rarity: 'Batch-specific (common in certain print waves like Neo Revelation & Scarlet/Violet)',
    marketImpact: '1.2x – 3x Premium depending on intensity',
    visualCharacteristics: 'The holographic prism substrate shines brightly through the text box and borders where white opaque underprint ink was applied too thinly.',
    cvDetectionStrategy: 'Dual-zone reflectance differential: measures specular rainbow reflectance values within non-artwork matte text regions.'
  },
  {
    id: 'ink-layer-missing',
    name: 'Missing Ink Layer / Albino Card',
    collectorName: 'Missing Color Plate (No-Black, No-Cyan)',
    rarity: 'Extremely Rare (< 1 in 50,000)',
    marketImpact: '10x – 50x Premium',
    visualCharacteristics: 'Card appears in ghostly monochrome or lacks all black text/art lines because one offset printing tower ran out of ink or experienced a feeder skip.',
    cvDetectionStrategy: 'Color channel histogram: detects complete zero-distribution in Cyan, Magenta, Yellow, or Black color planes.'
  },
  {
    id: 'registration-shift',
    name: 'CMYK Registration Shift / Double Vision',
    collectorName: 'Misaligned Print Plate Shift',
    rarity: '1 in ~10,000 packs',
    marketImpact: '2x – 8x Premium',
    visualCharacteristics: 'Card text or artwork appears blurred like a 3D movie without glasses, with noticeable cyan and magenta ghost edges offset by 0.5mm–2mm.',
    cvDetectionStrategy: 'Phase correlation and edge gradient disparity: detects dual parallel edges where a single sharp boundary contour should exist.'
  }
];

