export interface TcgGameOverview {
  id: string;
  name: string;
  icon: string;
  marketShare: number; // percentage
  annualVolume: string; // e.g. "$7.3B"
  velocityIndex: number; // 1-100
  avgDaysOnShelf: number;
  volatilityRating: 'Low' | 'Moderate' | 'High' | 'Extreme';
  primaryDriver: string;
  retailerSentiment: 'Very Bullish' | 'Bullish' | 'Neutral' | 'Cautious';
}

export interface TcgSetData {
  id: string;
  name: string;
  game: 'Pokemon' | 'One Piece' | 'MTG' | 'Lorcana' | 'Yu-Gi-Oh';
  releaseDate: string;
  msrpBox: number;
  wholesaleCost: number;
  marketBoxPrice: number;
  boxExpectedValue: number; // EV
  evRoiPercent: number; // (EV - Wholesale)/Wholesale * 100
  crackDecision: 'Strong Crack' | 'Hold Sealed' | 'Neutral' | 'Distribute Fast';
  giniConcentration: number; // 0.0 - 1.0 (Top heavy ratio)
  topCardName: string;
  topCardRawPrice: number;
  topCardPsa10Price: number;
  top3ValuePercent: number; // % of set value in top 3 cards
  reprintRisk: 'Minimal' | 'Moderate' | 'High' | 'Critical Imminent';
  printWaveStatus: 'Wave 1 Peak' | 'Wave 2 Deluge' | 'Allocation Squeeze' | 'Out of Print';
}

export interface StoreEcosystemMetric {
  yearQuarter: string;
  newStoresOpened: number;
  storesClosed: number;
  netGrowthRate: number; // percentage
  avgSealedNetMargin: number; // percentage
  avgSinglesNetMargin: number; // percentage
  primaryFailureReason: string;
}

export interface HypeDecayPhase {
  dayWindow: string;
  phaseName: string;
  priceIndex: number; // Base 100 = Release Day
  volumeIndex: number;
  actionRecommendation: string;
  riskLevel: 'Extreme' | 'High' | 'Moderate' | 'Low';
}

export const TCG_GAMES_OVERVIEW: TcgGameOverview[] = [
  {
    id: 'pokemon',
    name: 'Pokémon TCG',
    icon: '⚡',
    marketShare: 43.5,
    annualVolume: '$7.64B',
    velocityIndex: 88,
    avgDaysOnShelf: 14,
    volatilityRating: 'Low',
    primaryDriver: 'Generational Nostalgia, Graded Gem-Mint Cards, Mass Media Synergy',
    retailerSentiment: 'Very Bullish'
  },
  {
    id: 'onepiece',
    name: 'One Piece Card Game',
    icon: '🏴‍☠️',
    marketShare: 24.8,
    annualVolume: '$4.35B',
    velocityIndex: 96,
    avgDaysOnShelf: 8,
    volatilityRating: 'High',
    primaryDriver: 'Anime Collector Frenzy, Manga Rares, Severe Allocation Bottlenecks',
    retailerSentiment: 'Very Bullish'
  },
  {
    id: 'mtg',
    name: 'Magic: The Gathering',
    icon: '🔮',
    marketShare: 19.2,
    annualVolume: '$3.37B',
    velocityIndex: 72,
    avgDaysOnShelf: 22,
    volatilityRating: 'Moderate',
    primaryDriver: 'Commander Format Liquidity, Modern Horizons Power Spikes, Universes Beyond',
    retailerSentiment: 'Neutral'
  },
  {
    id: 'lorcana',
    name: 'Disney Lorcana',
    icon: '✨',
    marketShare: 7.5,
    annualVolume: '$1.31B',
    velocityIndex: 68,
    avgDaysOnShelf: 26,
    volatilityRating: 'Moderate',
    primaryDriver: 'Disney Lore Collectors, Enchanted Foils, Family & Competitive Play',
    retailerSentiment: 'Bullish'
  },
  {
    id: 'yugioh',
    name: 'Yu-Gi-Oh! TCG',
    icon: '🐉',
    marketShare: 5.0,
    annualVolume: '$0.89B',
    velocityIndex: 64,
    avgDaysOnShelf: 31,
    volatilityRating: 'Extreme',
    primaryDriver: 'High-Paced Tournament Meta, Fast Rarity Reprint Cycles, Quarter Century Rares',
    retailerSentiment: 'Cautious'
  }
];

export const TCG_SETS_DATA: TcgSetData[] = [
  {
    id: 'op-05',
    name: 'One Piece: Awakening of the New Era (OP-05)',
    game: 'One Piece',
    releaseDate: '2023-12-08',
    msrpBox: 107.76,
    wholesaleCost: 78.50,
    marketBoxPrice: 225.00,
    boxExpectedValue: 184.50,
    evRoiPercent: 135.0,
    crackDecision: 'Hold Sealed',
    giniConcentration: 0.84,
    topCardName: 'Monkey D. Luffy (Manga Rare)',
    topCardRawPrice: 3800.00,
    topCardPsa10Price: 7200.00,
    top3ValuePercent: 76.5,
    reprintRisk: 'Moderate',
    printWaveStatus: 'Allocation Squeeze'
  },
  {
    id: 'pkmn-151',
    name: 'Pokémon TCG: Scarlet & Violet 151',
    game: 'Pokemon',
    releaseDate: '2023-09-22',
    msrpBox: 120.00,
    wholesaleCost: 82.00,
    marketBoxPrice: 195.00,
    boxExpectedValue: 142.00,
    evRoiPercent: 73.1,
    crackDecision: 'Hold Sealed',
    giniConcentration: 0.68,
    topCardName: 'Charizard ex #199 (Special Illustration Rare)',
    topCardRawPrice: 135.00,
    topCardPsa10Price: 340.00,
    top3ValuePercent: 54.2,
    reprintRisk: 'High',
    printWaveStatus: 'Wave 2 Deluge'
  },
  {
    id: 'mtg-mh3',
    name: 'MTG: Modern Horizons 3',
    game: 'MTG',
    releaseDate: '2024-06-14',
    msrpBox: 250.00,
    wholesaleCost: 192.00,
    marketBoxPrice: 248.00,
    boxExpectedValue: 272.00,
    evRoiPercent: 41.6,
    crackDecision: 'Strong Crack',
    giniConcentration: 0.42,
    topCardName: 'Nadu, Winged Wisdom / Ulamog, the Defiler',
    topCardRawPrice: 75.00,
    topCardPsa10Price: 160.00,
    top3ValuePercent: 32.8,
    reprintRisk: 'Minimal',
    printWaveStatus: 'Wave 1 Peak'
  },
  {
    id: 'op-09',
    name: 'One Piece: The New Four Emperors (OP-09)',
    game: 'One Piece',
    releaseDate: '2024-12-13',
    msrpBox: 107.76,
    wholesaleCost: 79.00,
    marketBoxPrice: 155.00,
    boxExpectedValue: 168.00,
    evRoiPercent: 112.6,
    crackDecision: 'Strong Crack',
    giniConcentration: 0.79,
    topCardName: 'Shanks (Manga Rare)',
    topCardRawPrice: 1950.00,
    topCardPsa10Price: 4200.00,
    top3ValuePercent: 71.0,
    reprintRisk: 'Moderate',
    printWaveStatus: 'Wave 1 Peak'
  },
  {
    id: 'pkmn-surging',
    name: 'Pokémon: Surging Sparks',
    game: 'Pokemon',
    releaseDate: '2024-11-08',
    msrpBox: 161.64,
    wholesaleCost: 89.00,
    marketBoxPrice: 168.00,
    boxExpectedValue: 128.00,
    evRoiPercent: 43.8,
    crackDecision: 'Distribute Fast',
    giniConcentration: 0.72,
    topCardName: 'Pikachu ex #238 (Special Illustration Rare)',
    topCardRawPrice: 290.00,
    topCardPsa10Price: 680.00,
    top3ValuePercent: 62.4,
    reprintRisk: 'Critical Imminent',
    printWaveStatus: 'Wave 2 Deluge'
  },
  {
    id: 'lorcana-rotf',
    name: 'Disney Lorcana: Rise of the Floodborn',
    game: 'Lorcana',
    releaseDate: '2023-11-17',
    msrpBox: 143.76,
    wholesaleCost: 85.00,
    marketBoxPrice: 138.00,
    boxExpectedValue: 122.00,
    evRoiPercent: 43.5,
    crackDecision: 'Neutral',
    giniConcentration: 0.65,
    topCardName: 'Cinderella - Stouthearted (Enchanted)',
    topCardRawPrice: 185.00,
    topCardPsa10Price: 450.00,
    top3ValuePercent: 51.5,
    reprintRisk: 'Moderate',
    printWaveStatus: 'Out of Print'
  }
];

export const STORE_ECOSYSTEM_HISTORY: StoreEcosystemMetric[] = [
  {
    yearQuarter: '2024-Q1',
    newStoresOpened: 420,
    storesClosed: 145,
    netGrowthRate: 6.8,
    avgSealedNetMargin: 15.4,
    avgSinglesNetMargin: 48.2,
    primaryFailureReason: 'Cash lockup in non-moving sealed inventory'
  },
  {
    yearQuarter: '2024-Q2',
    newStoresOpened: 490,
    storesClosed: 168,
    netGrowthRate: 7.9,
    avgSealedNetMargin: 14.1,
    avgSinglesNetMargin: 49.0,
    primaryFailureReason: 'Heavy reliance on distributor allocations without singles intake'
  },
  {
    yearQuarter: '2024-Q3',
    newStoresOpened: 540,
    storesClosed: 185,
    netGrowthRate: 8.6,
    avgSealedNetMargin: 13.5,
    avgSinglesNetMargin: 51.2,
    primaryFailureReason: 'Overpaying for pre-order hype stock right before reprint wave'
  },
  {
    yearQuarter: '2024-Q4',
    newStoresOpened: 610,
    storesClosed: 195,
    netGrowthRate: 9.8,
    avgSealedNetMargin: 13.9,
    avgSinglesNetMargin: 50.4,
    primaryFailureReason: 'Underestimating labor cost for singles sorting and grading'
  },
  {
    yearQuarter: '2025-Q1 (Est)',
    newStoresOpened: 580,
    storesClosed: 210,
    netGrowthRate: 8.4,
    avgSealedNetMargin: 12.8,
    avgSinglesNetMargin: 52.6,
    primaryFailureReason: 'Marketplace commission creep (13.5% TCGplayer take-rate)'
  }
];

export const HYPE_DECAY_CURVE: HypeDecayPhase[] = [
  {
    dayWindow: 'Day -7 to +2',
    phaseName: 'Prerelease Speculation Spike',
    priceIndex: 260,
    volumeIndex: 90,
    actionRecommendation: 'Liquidate all cracked singles immediately. Do NOT hold singles inventory.',
    riskLevel: 'Extreme'
  },
  {
    dayWindow: 'Day 3 to 14',
    phaseName: 'Mass Distributor Influx',
    priceIndex: 175,
    volumeIndex: 100,
    actionRecommendation: 'Begin selective buylisting at 55% market price. Move fast on trending playables.',
    riskLevel: 'High'
  },
  {
    dayWindow: 'Day 15 to 45',
    phaseName: 'Supply Deluge & Undercutting Race',
    priceIndex: 110,
    volumeIndex: 75,
    actionRecommendation: 'Enforce price floors (intake cost * 1.35). Do not blindly race to the bottom.',
    riskLevel: 'Moderate'
  },
  {
    dayWindow: 'Day 46 to 90',
    phaseName: 'Competitive Meta Floor Stabilization',
    priceIndex: 95,
    volumeIndex: 60,
    actionRecommendation: 'Ideal window to acquire tournament staples at absolute cycle lows.',
    riskLevel: 'Low'
  },
  {
    dayWindow: 'Day 90+',
    phaseName: 'Sealed Scarcity & Burn Phase',
    priceIndex: 115,
    volumeIndex: 45,
    actionRecommendation: 'Store leftover sealed cases for 12-24 month sealed capital appreciation.',
    riskLevel: 'Low'
  }
];
