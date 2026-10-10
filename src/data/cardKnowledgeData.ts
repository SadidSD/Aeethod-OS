export interface BoundingBoxZone {
  id: string;
  label: string;
  xPercent: number;
  yPercent: number;
  widthPercent: number;
  heightPercent: number;
  color: string;
  aiPipeline: string;
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

export const CARD_GAME_SPECS: CardGameSpec[] = [
  {
    id: 'pokemon-modern',
    name: 'Pokémon (Modern S&V / SwSh Era)',
    era: 'Scarlet & Violet / Sword & Shield (2020–Present)',
    dimensionMm: '63 x 88 mm',
    dimensionInches: '2.48 x 3.46 in',
    cardstockWeight: '300–320 gsm black/blue core cardstock',
    aspectRatio: '1 : 1.4',
    borderType: 'Silver border (S&V Global) or Yellow border (SwSh)',
    cardBackDescription: 'Standard International Blue Pokéball back (EN) or Gold-Rimmed Pokéball back (JP)',
    sampleFrontImage: 'https://images.pokemontcg.io/sv3pt5/25_hires.png',
    rarityScheme: [
      'Common (●)',
      'Uncommon (◆)',
      'Rare Holo (★)',
      'Double Rare (★★)',
      'Ultra Rare (☆☆)',
      'Illustration Rare (IR ★)',
      'Special Illustration Rare (SIR ★★)',
      'Hyper Rare Gold (★★★)',
      'ACE SPEC (Pink ★)'
    ],
    keyIdentificationHeuristics: [
      'Bottom-Left Set Pill: 3-letter expansion code (MEW, OBF, PRE) + 2-letter Language Tag (EN, JP) + Regulation Mark (G, H).',
      'Collector Number: Formatted as XXX/YYY (025/165), Secret Rare (199/165), or Gallery Prefix (TG15/TG30, GG68/GG70).',
      'Stamp Zones: Pokémon Center ETB stamp & Prerelease/STAFF stamps sit inside the bottom corners of the artwork box.',
      'Reverse Holo Foil Zone: Mid-card text box & borders reflect Poké Ball vs. Master Ball ("M" + two bumps) patterns.'
    ],
    zones: [
      {
        id: 'pkmn-title',
        label: 'Card Name, Stage & HP',
        xPercent: 6,
        yPercent: 4,
        widthPercent: 88,
        heightPercent: 7.5,
        color: '#f59e0b',
        aiPipeline: 'Micro-OCR + Language Script Classifier',
        purpose: 'Extracts Pokémon name, mechanical suffix (ex, V, VSTAR), evolution stage, and HP.',
        importance: 'Critical P0',
        pitfalls: 'Distinguishes English Latin script from Japanese Katakana/Hiragana on Full Arts.'
      },
      {
        id: 'pkmn-art',
        label: 'Artwork Window (Layer 1 Vector Crop)',
        xPercent: 6,
        yPercent: 12.5,
        widthPercent: 88,
        heightPercent: 44,
        color: '#3b82f6',
        aiPipeline: 'MobileNetV3 / DINOv2 halfvec(512) + 64-bit dHash',
        purpose: 'Matches card illustration against 45,000 catalog identities in <8ms via Supabase pgvector HNSW.',
        importance: 'Critical P0',
        pitfalls: 'Same-artwork reprints (e.g. Ultra Ball across 6 sets) require Stage 3 bottom-left OCR disambiguation.'
      },
      {
        id: 'pkmn-promo-stamp',
        label: 'Artwork Corner Stamp Zone (PC / Prerelease / STAFF)',
        xPercent: 64,
        yPercent: 43,
        widthPercent: 28,
        heightPercent: 8,
        color: '#ef4444',
        aiPipeline: 'Targeted ROI Stamp Classifier',
        purpose: 'Detects Pokémon Center ETB stamps ($95 vs $8), Prerelease set logos, and 25th Anniversary Pikachu stamps.',
        importance: 'Critical P0',
        pitfalls: 'Ignored by 100% of competitor mobile apps, causing massive buylist pricing errors.'
      },
      {
        id: 'pkmn-set-code',
        label: '3-Letter Set Code, Language & Reg Mark',
        xPercent: 5,
        yPercent: 91.5,
        widthPercent: 14,
        heightPercent: 5,
        color: '#8b5cf6',
        aiPipeline: 'High-Contrast Pill OCR',
        purpose: 'Reads the S&V 3-letter set pill (MEW, PRE, sv2a), language tag (EN), and Regulation Mark (G, H).',
        importance: 'Critical P0',
        pitfalls: 'Separates English cards from Indonesian cards (which use English Pokémon names but Japanese sv4a set codes).'
      },
      {
        id: 'pkmn-collector-no',
        label: 'Collector Number & Rarity Symbol',
        xPercent: 19.5,
        yPercent: 91.5,
        widthPercent: 26,
        heightPercent: 5,
        color: '#10b981',
        aiPipeline: 'Fine-Tuned Sequence OCR',
        purpose: 'Reads numerator/denominator (199/165), gallery prefix (GG68/GG70), and rarity stars.',
        importance: 'Critical P0',
        pitfalls: 'Gold Hyper Rares can wash out white bottom numbers under direct top-down LED glare.'
      }
    ]
  },
  {
    id: 'pokemon-vintage',
    name: 'Pokémon (WotC Vintage 1999–2002)',
    era: 'Base Set to Neo Destiny (10 First-Edition Sets)',
    dimensionMm: '63 x 88 mm',
    dimensionInches: '2.48 x 3.46 in',
    cardstockWeight: '300 gsm Wizards of the Coast stock',
    aspectRatio: '1 : 1.4',
    borderType: 'Thick Yellow border (English) / Old Back (1996 JP)',
    cardBackDescription: 'Original International Blue back or 1996 Japanese "Pocket Monsters" back',
    sampleFrontImage: 'https://images.pokemontcg.io/base1/4_hires.png',
    rarityScheme: [
      '1st Edition Shadowless',
      'Shadowless (1999 Base Set Only)',
      'Unlimited',
      '©1999-2000 UK 4th Print (Base & Fossil)',
      '1996 JP No Rarity Symbol'
    ],
    keyIdentificationHeuristics: [
      '1st Edition Stamp: Black circular "Edition 1" icon below the bottom-left corner of the artwork frame.',
      'Shadowless Check: Missing dark drop-shadow along the right edge of the artwork box + "©1995, 96, 98, 99" copyright.',
      'Set Symbol: Below the bottom-right of the artwork frame (Base Set has NO symbol; Jungle/Fossil/Base 2 have symbols).',
      'UK 4th Print Check: Bottom-right copyright reads "©1999-2000 Wizards" instead of "©1999 Wizards".'
    ],
    zones: [
      {
        id: 'pkmn-vint-1st-edition',
        label: '1st Edition Stamp Zone (Dim #7)',
        xPercent: 6,
        yPercent: 49.5,
        widthPercent: 12,
        heightPercent: 6,
        color: '#ef4444',
        aiPipeline: 'Binary Stamp CNN Classifier',
        purpose: 'Detects the black "Edition 1" stamp across the 10 English WotC 1st Edition sets ($400 vs $6,500+).',
        importance: 'Critical P0',
        pitfalls: 'Base Set 2 and Legendary Collection never had 1st Edition stamps.'
      },
      {
        id: 'pkmn-vint-art-shadow',
        label: 'Shadowless Right Art Border (Dim #7)',
        xPercent: 88,
        yPercent: 14,
        widthPercent: 7,
        heightPercent: 36,
        color: '#06b6d4',
        aiPipeline: 'Luminance Strip Differential',
        purpose: 'Measures whether the right edge of the Base Set artwork box has a dark drop-shadow (Unlimited) or clean yellow border (Shadowless).',
        importance: 'Critical P0',
        pitfalls: '100% exclusive to 1999 English Base Set (Jungle and Fossil already had shadows on 1st Edition).'
      },
      {
        id: 'pkmn-vint-set-symbol',
        label: 'Expansion Set Symbol & Error Zone (Dim #3 & #13)',
        xPercent: 82,
        yPercent: 49.5,
        widthPercent: 12,
        heightPercent: 6,
        color: '#8b5cf6',
        aiPipeline: 'Symbol Template Matcher',
        purpose: 'Disambiguates Base Set (no symbol) vs Base Set 2 vs Legendary Collection, and flags "No Symbol" Jungle error holos!',
        importance: 'Critical P0',
        pitfalls: 'Celebrations 2021 reprints place the 25th Anniversary Pikachu stamp near this exact zone.'
      },
      {
        id: 'pkmn-vint-copyright',
        label: '©1999–2000 4th Print Copyright Line (Dim #7 & #12)',
        xPercent: 10,
        yPercent: 92,
        widthPercent: 62,
        heightPercent: 4.5,
        color: '#f59e0b',
        aiPipeline: '4pt Macro Copyright OCR',
        purpose: 'Checks for "©1999-2000 Wizards" to identify UK 4th Print Base Set and Australian Red Logo Fossil non-holos.',
        importance: 'High P1',
        pitfalls: 'Only 5 characters ("-2000") in 4pt font separate a $400 Unlimited Charizard from a $950 4th Print!'
      },
      {
        id: 'pkmn-vint-number',
        label: 'Bottom-Right Number & JP No-Rarity Zone (Dim #5 & #6)',
        xPercent: 75,
        yPercent: 92,
        widthPercent: 20,
        heightPercent: 5,
        color: '#10b981',
        aiPipeline: 'Corner OCR + Rarity Symbol Detector',
        purpose: 'Reads 4/102 in English, or checks if the ★ rarity symbol is missing on 1996 Japanese Base Set ("No Rarity").',
        importance: 'Critical P0',
        pitfalls: '1996–2000 Japanese cards have NO printed collector number here—rely on Stage 2 artwork vector!'
      }
    ]
  },
  {
    id: 'pokemon-ex-era',
    name: 'Pokémon (EX Series & World Champ Traps 2003–2007)',
    era: 'EX Ruby & Sapphire to EX Power Keepers (16 Sets)',
    dimensionMm: '63 x 88 mm',
    dimensionInches: '2.48 x 3.46 in',
    cardstockWeight: '305 gsm Nintendo / Pokémon USA stock',
    aspectRatio: '1 : 1.4',
    borderType: 'Yellow border (Regular) / Silver Holo border (ex & Gold Star)',
    cardBackDescription: 'Standard Blue Back (Pack Pull) vs. World Championships Deck Back',
    sampleFrontImage: 'https://images.pokemontcg.io/ex14/100_hires.png',
    rarityScheme: [
      'Common (3x Serial Codes A/B/C)',
      'Stamped Reverse Holo (Set Logo in Art Box)',
      'Rare Reverse Holo (Gold Foil Name + Stamp)',
      'Pokémon-ex (Silver Holo Border)',
      'Gold Star ★ (1 per 2–3 Booster Boxes)'
    ],
    keyIdentificationHeuristics: [
      'Stamped Reverse Holos: Reverse Holos carry the expansion logo stamped inside the bottom-right of the artwork window.',
      'World Championship Guardrail: Check artwork for printed player signature and matte silver border ($45 reprint vs $1,400 Gold Star!).',
      'Bottom-Left 9-Character Serial Code: Every Common card has 3 distinct serial code suffixes (Code A, B, C).'
    ],
    zones: [
      {
        id: 'pkmn-ex-wc-sig',
        label: 'World Championship Signature & Set Stamp Zone (Dim #9 & #10)',
        xPercent: 52,
        yPercent: 36,
        widthPercent: 38,
        heightPercent: 14,
        color: '#ef4444',
        aiPipeline: 'Signature & Set Logo Overlay Detector',
        purpose: 'Detects EX-era Reverse Holo Set Stamps (+10x value) AND catches World Championship Deck player signatures (-95% value).',
        importance: 'Critical P0',
        pitfalls: 'World Championship reprints keep the exact same EX Deoxys / Dragon Frontiers set symbol and number!'
      },
      {
        id: 'pkmn-ex-serial',
        label: '9-Character Sub-Print Serial Code (Dim #11)',
        xPercent: 6,
        yPercent: 92,
        widthPercent: 28,
        heightPercent: 4.5,
        color: '#8b5cf6',
        aiPipeline: 'Alphanumeric Micro-OCR',
        purpose: 'Reads the 9-character serial code (e.g. KRF-92A-11X) where Commons have 3 distinct code variants per set.',
        importance: 'High P1',
        pitfalls: 'Tracked as 3 separate variants on TCGCollector.com and Bulbapedia.'
      },
      {
        id: 'pkmn-ex-number',
        label: 'Bottom-Right Set Symbol & Number (Dim #3 & #5)',
        xPercent: 72,
        yPercent: 91.5,
        widthPercent: 22,
        heightPercent: 5,
        color: '#10b981',
        aiPipeline: 'Corner OCR + Symbol Matcher',
        purpose: 'Locks collector number and expansion symbol (e.g. 105/107 EX Deoxys).',
        importance: 'Critical P0',
        pitfalls: 'Japanese ADV/PCG cards also place their 1ED (1st Edition) icon in the bottom-left corner.'
      }
    ]
  }
];
