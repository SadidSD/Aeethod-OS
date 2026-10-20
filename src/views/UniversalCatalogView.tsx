import React, { useState, useEffect, useMemo } from 'react';
import prebundledSetsData from '../data/prebundledSets.json';
import {
  Search,
  Filter,
  ChevronRight,
  ArrowLeft,
  Layers,
  Sparkles,
  DollarSign,
  TrendingUp,
  Calendar,
  Grid,
  List,
  ExternalLink,
  X,
  ShieldCheck,
  AlertCircle,
  Hash,
  Eye,
  RefreshCw,
  Package,
  Award,
  Zap,
  Flame,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface Game {
  id: string;
  slug: string;
  name: string;
  code: string;
  set_count: string | number;
  card_count: string | number;
  variant_count: string | number;
}

interface Era {
  id: string;
  name: string;
  order: number;
  years: string;
  description: string;
  icon: string;
  gradient: string;
  badgeColor: string;
  set_count: number;
  featuredSets: string[];
  totalCards?: number;
  totalValuation?: number;
}

interface SetSummary {
  id: string;
  set_code: string;
  slug: string;
  name: string;
  language: string;
  era_block: string;
  release_date: string;
  total_printed_cards: number;
  actual_card_count: string | number;
  variant_count: string | number;
  total_valuation_cents: string | number;
}

interface CardVariant {
  variant_id: string;
  finish: string;
  stamp: string;
  print_run: string;
  is_error: boolean;
  error_details: string | null;
  image_front_url: string | null;
  market_cents: number | null;
  low_cents: number | null;
  buylist_cents: number | null;
  pc_cents: number | null;
  psa_10_pop: number | null;
}

interface MasterCard {
  id: string;
  card_number: string;
  clean_name: string;
  official_name: string;
  rarity: string | null;
  supertype: string | null;
  subtypes: string[] | null;
  artist: string | null;
  game_metadata: any;
  primary_image_url: string | null;
  top_market_cents: number | null;
  min_market_cents: number | null;
  variants: CardVariant[];
}

type ViewLevel = 'eras' | 'sets' | 'cards';

const INITIAL_GAMES: Game[] = [
  { id: '1', slug: 'pokemon', name: 'Pokémon TCG', code: 'PKMN', set_count: 408, card_count: 39144, variant_count: 97875 },
  { id: '2', slug: 'mtg', name: 'Magic: The Gathering', code: 'MTG', set_count: 0, card_count: 0, variant_count: 0 },
  { id: '3', slug: 'one-piece', name: 'One Piece Card Game', code: 'OP', set_count: 0, card_count: 0, variant_count: 0 },
  { id: '4', slug: 'lorcana', name: 'Disney Lorcana', code: 'LORC', set_count: 0, card_count: 0, variant_count: 0 },
  { id: '5', slug: 'yugioh', name: 'Yu-Gi-Oh! TCG', code: 'YGO', set_count: 0, card_count: 0, variant_count: 0 }
];

const ERA_METADATA: Era[] = [
  {
    id: 'sv',
    name: 'Scarlet & Violet',
    order: 1,
    years: '2023 – Present',
    description: 'Terastal Pokémon ex, Ancient & Future paradox species, Special Illustration Rares, and the iconic 151 special expansion.',
    icon: '🌟',
    gradient: 'from-rose-500/20 via-purple-600/20 to-indigo-600/10 border-rose-500/30 text-rose-300',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    set_count: 69,
    featuredSets: ['151', 'Paldea Evolved', 'Surging Sparks', 'Terastal Fest ex', 'Prismatic Evolutions']
  },
  {
    id: 'swsh',
    name: 'Sword & Shield',
    order: 2,
    years: '2020 – 2023',
    description: 'VMAX Dynamax Pokémon, VSTAR mechanics, Alternate Art chase cards, Trainer Gallery subsets, and Crown Zenith / VSTAR Universe.',
    icon: '⚔️',
    gradient: 'from-cyan-500/20 via-blue-600/20 to-indigo-600/10 border-cyan-500/30 text-cyan-300',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    set_count: 140,
    featuredSets: ['Crown Zenith', 'Evolving Skies', 'VSTAR Universe', 'Brilliant Stars', 'Silver Tempest']
  },
  {
    id: 'sm',
    name: 'Sun & Moon',
    order: 3,
    years: '2017 – 2019',
    description: 'GX Pokémon, Ultra Beasts, and legendary TAG TEAM GX cards featuring dual-character full-art textures.',
    icon: '☀️',
    gradient: 'from-amber-500/20 via-orange-600/20 to-yellow-600/10 border-amber-500/30 text-amber-300',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    set_count: 20,
    featuredSets: ['Team Up', 'Cosmic Eclipse', 'Hidden Fates', 'Unified Minds', 'Ultra Prism']
  },
  {
    id: 'xy',
    name: 'XY Series',
    order: 4,
    years: '2014 – 2016',
    description: 'Mega Evolutions, Fairy Type debut, EX & Full Art Secret Rares, and the 20th Anniversary Generations celebration.',
    icon: '⚡',
    gradient: 'from-blue-500/20 via-indigo-600/20 to-sky-600/10 border-blue-500/30 text-blue-300',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    set_count: 17,
    featuredSets: ['Roaring Skies', 'Evolutions', 'Phantom Forces', 'Ancient Origins', 'Generations']
  },
  {
    id: 'bw',
    name: 'Black & White',
    order: 5,
    years: '2011 – 2013',
    description: 'Modern Full-Art cards debut, Dragon Vault, Plasma Freeze, and Legendary Treasures radiant collections.',
    icon: '⬛',
    gradient: 'from-slate-600/30 via-zinc-700/20 to-neutral-800/20 border-slate-500/30 text-slate-200',
    badgeColor: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    set_count: 15,
    featuredSets: ['Plasma Freeze', 'Dark Explorers', 'Plasma Storm', 'Legendary Treasures', 'Noble Victories']
  },
  {
    id: 'dp-hgss',
    name: 'Diamond & Pearl / Platinum / HGSS',
    order: 6,
    years: '2007 – 2010',
    description: 'Level X Pokémon, Secret Holo Shinies, Rotom Forms, and dual-card HeartGold & SoulSilver LEGEND cards.',
    icon: '💎',
    gradient: 'from-sky-500/20 via-emerald-600/20 to-teal-600/10 border-sky-500/30 text-sky-300',
    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    set_count: 19,
    featuredSets: ['HeartGold SoulSilver', 'Platinum', 'Stormfront', 'Legends Awakened', 'Unleashed']
  },
  {
    id: 'ex',
    name: 'EX Series / Advance Generation',
    order: 7,
    years: '2003 – 2007',
    description: 'Gold Star chase cards, Holofoil Delta Species, and classic EX Pokémon printed in the golden era of vintage collecting.',
    icon: '🌋',
    gradient: 'from-emerald-500/20 via-teal-600/20 to-rose-600/10 border-emerald-500/30 text-emerald-300',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    set_count: 21,
    featuredSets: ['EX Deoxys', 'EX Team Rocket Returns', 'EX Dragon Frontiers', 'EX Holon Phantoms', 'EX Ruby & Sapphire']
  },
  {
    id: 'ecard',
    name: 'e-Card Series',
    order: 8,
    years: '2001 – 2003',
    description: 'Dot-matrix barcode borders scannable via Nintendo e-Reader. Home of Crystal Pokémon in Expedition, Aquapolis, and Skyridge.',
    icon: '🎴',
    gradient: 'from-amber-600/20 via-yellow-600/20 to-orange-600/10 border-amber-500/30 text-amber-300',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    set_count: 3,
    featuredSets: ['Skyridge', 'Aquapolis', 'Expedition Base Set']
  },
  {
    id: 'neo',
    name: 'Neo Series',
    order: 9,
    years: '2000 – 2002',
    description: 'Johto region debut, Shining Magikarp & Gyarados, Dark and Light Pokémon mechanics across Genesis, Discovery, Revelation, and Destiny.',
    icon: '🌿',
    gradient: 'from-teal-500/20 via-emerald-600/20 to-green-600/10 border-teal-500/30 text-teal-300',
    badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    set_count: 8,
    featuredSets: ['Neo Destiny', 'Neo Revelation', 'Neo Discovery', 'Neo Genesis']
  },
  {
    id: 'classic',
    name: 'Original Classic / WotC Series',
    order: 10,
    years: '1996 – 2000',
    description: 'The legendary foundation: 1st Edition Base Set, Shadowless, Jungle, Fossil, Team Rocket, Gym Heroes, and Gym Challenge.',
    icon: '🏆',
    gradient: 'from-yellow-500/25 via-amber-600/20 to-orange-600/10 border-yellow-500/40 text-yellow-300',
    badgeColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    set_count: 14,
    featuredSets: ['Base Set', 'Base Set (Shadowless)', 'Jungle', 'Fossil', 'Team Rocket', 'Gym Challenge']
  },
  {
    id: 'special',
    name: 'Promos & Special Collections',
    order: 11,
    years: '1996 – Present',
    description: 'Black Star Promos, Japanese Vending series, McDonald’s collections, CoroCoro exclusives, and World Championship decks.',
    icon: '🎁',
    gradient: 'from-purple-500/20 via-fuchsia-600/20 to-pink-600/10 border-purple-500/30 text-purple-300',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    set_count: 82,
    featuredSets: ['WotC Black Star Promos', 'Japanese Vending Series', 'Best of Game', 'SV Black Star Promos']
  }
];

function normalizeEraClient(eraBlock: string | null | undefined, setCode: string | null | undefined): string {
  const code = (setCode || '').toUpperCase();
  const rawEra = (eraBlock || '').trim();

  if (rawEra === 'Scarlet & Violet' || code.startsWith('SV') || rawEra === 'SV') return 'sv';
  if (rawEra === 'Sword & Shield' || code.startsWith('SWSH') || code.startsWith('S') || rawEra === 'S') return 'swsh';
  if (rawEra === 'Sun & Moon' || code.startsWith('SM') || rawEra === 'SM') return 'sm';
  if (rawEra === 'XY' || code.startsWith('XY') || rawEra === 'XY') return 'xy';
  if (rawEra === 'Black & White' || code.startsWith('BW') || rawEra === 'BW') return 'bw';
  if (rawEra === 'HeartGold & SoulSilver' || code.startsWith('HGSS') || rawEra === 'Platinum' || rawEra === 'Diamond & Pearl' || code.startsWith('DP')) return 'dp-hgss';
  if (rawEra === 'EX' || code.startsWith('EX') || code.startsWith('ADV') || code.startsWith('PCG')) return 'ex';
  if (rawEra === 'E-Card' || code.startsWith('E') || code.startsWith('ECARD')) return 'ecard';
  if (rawEra === 'Neo' || code.startsWith('NEO')) return 'neo';
  if (rawEra === 'Base' || rawEra === 'Gym' || code.startsWith('BASE') || code.startsWith('PMCG')) return 'classic';
  return 'special';
}

export const UniversalCatalogView: React.FC = () => {
  // Navigation State: Game > Era > Expansion/Set > Cards
  const [viewLevel, setViewLevel] = useState<ViewLevel>('eras');
  const [selectedGameSlug, setSelectedGameSlug] = useState<string>('pokemon');
  const [selectedLanguage, setSelectedLanguage] = useState<'all' | 'en' | 'jp'>('all');
  const [selectedEra, setSelectedEra] = useState<Era | null>(null);
  const [selectedSet, setSelectedSet] = useState<SetSummary | null>(null);
  const [selectedCard, setSelectedCard] = useState<MasterCard | null>(null);

  // Data State
  const [games, setGames] = useState<Game[]>(INITIAL_GAMES);
  const [allSets, setAllSets] = useState<SetSummary[]>((prebundledSetsData as unknown) as SetSummary[]);
  const [cards, setCards] = useState<MasterCard[]>([]);
  const [totalCardsInSet, setTotalCardsInSet] = useState<number>(0);
  const [cardsLoading, setCardsLoading] = useState<boolean>(false);
  const [cardError, setCardError] = useState<string | null>(null);

  // Search & Filtering inside Sets & Cards
  const [setSearch, setSetSearch] = useState<string>('');
  const [cardSearch, setCardSearch] = useState<string>('');
  const [rarityFilter, setRarityFilter] = useState<string>('all');
  const [supertypeFilter, setSupertypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('number_asc');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [page, setPage] = useState<number>(1);

  // 1. Fetch Games from API
  useEffect(() => {
    fetch('/api/catalog/games')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setGames(data);
      })
      .catch(() => {});
  }, []);

  // 2. Fetch Fresh Sets from API (fallback to prebundled)
  useEffect(() => {
    fetch(`/api/catalog/sets?gameSlug=${selectedGameSlug}&language=all`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setAllSets(data);
        }
      })
      .catch(() => {});
  }, [selectedGameSlug]);

  // 3. Compute active sets for the selected era & language
  const eraSets = useMemo(() => {
    if (!selectedEra) return [];
    let list = allSets.filter((s) => normalizeEraClient(s.era_block, s.set_code) === selectedEra.id);
    if (selectedLanguage !== 'all') {
      list = list.filter((s) => s.language === selectedLanguage);
    }
    if (setSearch) {
      const q = setSearch.toLowerCase();
      list = list.filter((s) => s.name.toLowerCase().includes(q) || s.set_code.toLowerCase().includes(q));
    }
    return list;
  }, [allSets, selectedEra, selectedLanguage, setSearch]);

  // 4. Compute Era stats dynamically based on current language
  const computedEras = useMemo(() => {
    return ERA_METADATA.map((era) => {
      let filtered = allSets.filter((s) => normalizeEraClient(s.era_block, s.set_code) === era.id);
      if (selectedLanguage !== 'all') {
        filtered = filtered.filter((s) => s.language === selectedLanguage);
      }
      const totalCards = filtered.reduce((acc, s) => acc + Number(s.actual_card_count || 0), 0);
      const totalValuation = filtered.reduce((acc, s) => acc + Number(s.total_valuation_cents || 0), 0);

      return {
        ...era,
        set_count: filtered.length,
        totalCards,
        totalValuation
      };
    });
  }, [allSets, selectedLanguage]);

  // 5. Fetch Cards when a Set is selected
  useEffect(() => {
    if (!selectedSet) {
      setCards([]);
      return;
    }

    setCardsLoading(true);
    setCardError(null);
    const query = new URLSearchParams({
      setId: selectedSet.id,
      page: page.toString(),
      limit: '120',
      sortBy: sortBy,
      search: cardSearch,
      rarity: rarityFilter,
      supertype: supertypeFilter,
    });

    fetch(`/api/catalog/cards?${query.toString()}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}: Failed to load cards`);
        return r.json();
      })
      .then((data) => {
        if (data && data.cards) {
          setCards(data.cards);
          setTotalCardsInSet(data.totalCards);
        } else {
          setCards([]);
        }
      })
      .catch((e) => {
        console.error('Error fetching cards:', e);
        setCardError(e.message);
      })
      .finally(() => setCardsLoading(false));
  }, [selectedSet, cardSearch, rarityFilter, supertypeFilter, sortBy, page]);

  // Currency Formatter
  const formatUSD = (cents: number | null | undefined) => {
    if (cents === null || cents === undefined || isNaN(cents)) return '—';
    return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getRarityBadgeColor = (rarity: string | null) => {
    const r = (rarity || '').toLowerCase();
    if (r.includes('secret') || r.includes('special') || r.includes('sar')) return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    if (r.includes('ultra') || r.includes('vmax') || r.includes('ex')) return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    if (r.includes('holo')) return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
    if (r.includes('uncommon')) return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    return 'bg-slate-700/40 text-slate-300 border-slate-600/40';
  };

  // Navigation handlers
  const handleSelectEra = (era: Era) => {
    setSelectedEra(era);
    setSelectedSet(null);
    setSetSearch('');
    setViewLevel('sets');
  };

  const handleSelectSet = (set: SetSummary) => {
    setSelectedSet(set);
    setCardSearch('');
    setPage(1);
    setViewLevel('cards');
  };

  const handleBackToEras = () => {
    setSelectedEra(null);
    setSelectedSet(null);
    setViewLevel('eras');
  };

  const handleBackToSets = () => {
    setSelectedSet(null);
    setViewLevel('sets');
  };

  return (
    <div className="flex flex-col h-full bg-[#121212] text-[#e6e6e6] overflow-hidden">
      {/* ======================================================== */}
      {/* 1. TOP HEADER & INTERACTIVE DRILL-DOWN BREADCRUMBS */}
      {/* ======================================================== */}
      <div className="border-b border-[#242424] bg-[#181818] px-6 py-3 shrink-0">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Breadcrumb Path */}
          <div className="flex items-center gap-2 text-xs flex-wrap">
            <span className="font-mono text-slate-500 text-[11px] uppercase tracking-wider">Catalog Flow:</span>

            {/* Game Node */}
            <span className="px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
              {games.find((g) => g.slug === selectedGameSlug)?.name || 'Pokémon TCG'}
            </span>

            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />

            {/* Eras Node */}
            <button
              onClick={handleBackToEras}
              className={`px-2.5 py-1 rounded-md font-medium transition cursor-pointer ${
                viewLevel === 'eras'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-[#222222] text-slate-300 hover:text-white hover:bg-[#2b2b2b] border border-[#2f2f2f]'
              }`}
            >
              All Eras ({computedEras.length})
            </button>

            {/* Set Level Node */}
            {selectedEra && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                <button
                  onClick={handleBackToSets}
                  className={`px-2.5 py-1 rounded-md font-medium transition cursor-pointer flex items-center gap-1.5 ${
                    viewLevel === 'sets'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-[#222222] text-slate-300 hover:text-white hover:bg-[#2b2b2b] border border-[#2f2f2f]'
                  }`}
                >
                  <span>{selectedEra.icon}</span>
                  <span>{selectedEra.name}</span>
                </button>
              </>
            )}

            {/* Cards Level Node */}
            {selectedSet && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 font-medium border border-emerald-500/30 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5" />
                  <span>{selectedSet.name}</span>
                  <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-black/40 text-emerald-200">
                    {selectedSet.set_code}
                  </span>
                </span>
              </>
            )}
          </div>

          {/* Right Controls: Language Selector & Verification Pill */}
          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <div className="flex items-center bg-[#202020] border border-[#2d2d2d] rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setSelectedLanguage('all')}
                className={`px-2.5 py-1 rounded-md transition font-medium cursor-pointer ${
                  selectedLanguage === 'all' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                🌐 All
              </button>
              <button
                onClick={() => setSelectedLanguage('en')}
                className={`px-2.5 py-1 rounded-md transition font-medium cursor-pointer ${
                  selectedLanguage === 'en' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                🇺🇸 English
              </button>
              <button
                onClick={() => setSelectedLanguage('jp')}
                className={`px-2.5 py-1 rounded-md transition font-medium cursor-pointer ${
                  selectedLanguage === 'jp' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                🇯🇵 Japanese
              </button>
            </div>

            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-[#1c1c1c] border border-[#2c2c2c] rounded-lg text-xs font-mono text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>97,875 Variants 100% Autopriced</span>
            </div>
          </div>
        </div>

        {/* Game Tabs (Level 1) */}
        <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-[#222222] overflow-x-auto no-scrollbar">
          {games.map((g) => (
            <button
              key={g.slug}
              onClick={() => {
                setSelectedGameSlug(g.slug);
                handleBackToEras();
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 cursor-pointer ${
                selectedGameSlug === g.slug
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-[#1f1f1f] text-slate-400 hover:text-white hover:bg-[#282828] border border-[#292929]'
              }`}
            >
              <span>{g.slug === 'pokemon' ? '⚡' : g.slug === 'mtg' ? '🔮' : g.slug === 'one-piece' ? '🏴‍☠️' : g.slug === 'lorcana' ? '✨' : '⚔️'}</span>
              <span>{g.name}</span>
              {Number(g.card_count) > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  selectedGameSlug === g.slug ? 'bg-indigo-700 text-indigo-100' : 'bg-[#292929] text-slate-400'
                }`}>
                  {Number(g.card_count).toLocaleString()}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. MAIN WORKSPACE AREA ACCORDING TO VIEW LEVEL */}
      {/* ======================================================== */}
      <div className="flex-1 overflow-y-auto min-h-0 p-6">
        {/* ======================================================== */}
        {/* LEVEL 1: ALL ERAS AS CARDS */}
        {/* ======================================================== */}
        {viewLevel === 'eras' && (
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Eras Header Banner */}
            <div className="bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-[#181818] border border-[#2a2a2a] rounded-2xl p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono font-semibold uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    <span>Select an Era to Browse Expansions & Sets</span>
                  </div>
                  <h1 className="text-xl md:text-2xl font-black text-white mt-1">
                    Historical TCG Eras & Generations
                  </h1>
                  <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
                    Explore all 11 eras spanning 1996 to the present day. Click on any era card below to unlock its complete expansions, booster sets, and autopriced card singles.
                  </p>
                </div>

                {/* Census Card */}
                <div className="flex items-center gap-4 bg-[#141414]/80 border border-[#2c2c2c] rounded-xl p-3 shrink-0 font-mono text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Total Sets</span>
                    <span className="font-bold text-white text-base">{allSets.length}</span>
                  </div>
                  <div className="w-px h-8 bg-[#2d2d2d]" />
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Total Cards</span>
                    <span className="font-bold text-indigo-300 text-base">39,144</span>
                  </div>
                  <div className="w-px h-8 bg-[#2d2d2d]" />
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Catalog Value</span>
                    <span className="font-bold text-emerald-400 text-base">$1.07M+</span>
                  </div>
                </div>
              </div>
            </div>

            {/* The Grid of 11 Era Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {computedEras.map((era) => (
                <div
                  key={era.id}
                  onClick={() => handleSelectEra(era)}
                  className={`group relative rounded-2xl p-5 border bg-gradient-to-br ${era.gradient} cursor-pointer transition-all duration-300 hover:scale-[1.015] hover:shadow-2xl flex flex-col justify-between`}
                >
                  <div className="space-y-3">
                    {/* Era Top Bar: Icon + Years */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{era.icon}</span>
                        <h3 className="font-black text-base text-white group-hover:text-indigo-200 transition">
                          {era.name}
                        </h3>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold border ${era.badgeColor}`}>
                        {era.years}
                      </span>
                    </div>

                    {/* Era Description */}
                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                      {era.description}
                    </p>

                    {/* Featured Sets preview pills */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {era.featuredSets.map((setName, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-black/40 text-[10px] font-mono text-slate-300 border border-white/5"
                        >
                          {setName}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Era Bottom Stats & CTA */}
                  <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs font-mono">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">Expansions</span>
                        <span className="font-bold text-white">{era.set_count} sets</span>
                      </div>
                      <div className="w-px h-6 bg-white/10" />
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">Cards</span>
                        <span className="font-bold text-slate-200">{era.totalCards.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-semibold text-white group-hover:translate-x-1 transition-transform">
                      <span>Explore Era</span>
                      <ChevronRight className="w-4 h-4 text-indigo-400" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* LEVEL 2: EXPANSIONS & SETS OF THE SELECTED ERA */}
        {/* ======================================================== */}
        {viewLevel === 'sets' && selectedEra && (
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Top Navigation & Back Button */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <button
                onClick={handleBackToEras}
                className="px-3 py-1.5 rounded-lg bg-[#202020] hover:bg-[#2b2b2b] text-slate-300 hover:text-white text-xs font-semibold border border-[#2e2e2e] flex items-center gap-2 transition cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to All Eras</span>
              </button>

              {/* Set Search within Era */}
              <div className="relative w-72">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder={`Search in ${selectedEra.name}...`}
                  value={setSearch}
                  onChange={(e) => setSetSearch(e.target.value)}
                  className="w-full bg-[#1c1c1c] border border-[#2d2d2d] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Era Header Banner */}
            <div className={`p-6 rounded-2xl border bg-gradient-to-r ${selectedEra.gradient} relative overflow-hidden`}>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase">
                    <span>{selectedEra.icon}</span>
                    <span>Historical Era Selection</span>
                    <span>•</span>
                    <span>{selectedEra.years}</span>
                  </div>
                  <h2 className="text-2xl font-black text-white mt-1">{selectedEra.name} Expansions</h2>
                  <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                    {selectedEra.description}
                  </p>
                </div>

                {/* Era Total Valuation Badge */}
                <div className="bg-black/60 backdrop-blur-sm border border-white/10 rounded-xl p-3 shrink-0 font-mono text-xs">
                  <span className="text-[10px] text-slate-400 uppercase block">Total Era Valuation</span>
                  <span className="font-bold text-emerald-400 text-lg">
                    {formatUSD(selectedEra.totalValuation)}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {eraSets.length} Expansions Available
                  </span>
                </div>
              </div>
            </div>

            {/* The Grid of Set / Expansion Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {eraSets.map((s) => (
                <div
                  key={s.id}
                  onClick={() => handleSelectSet(s)}
                  className="group bg-[#181818] border border-[#272727] hover:border-indigo-500/50 rounded-xl p-4 transition-all duration-200 hover:shadow-xl hover:shadow-indigo-500/10 cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    {/* Top Row: Language + Set Code */}
                    <div className="flex items-center justify-between">
                      <span className="text-base">{s.language === 'en' ? '🇺🇸' : '🇯🇵'}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#242424] text-slate-300 border border-[#333333] uppercase">
                        {s.set_code}
                      </span>
                    </div>

                    {/* Expansion Name */}
                    <h4 className="font-bold text-sm text-white group-hover:text-indigo-300 transition line-clamp-2">
                      {s.name}
                    </h4>

                    {/* Release Date if present */}
                    {s.release_date && (
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        <span>{new Date(s.release_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}</span>
                      </div>
                    )}
                  </div>

                  {/* Expansion Card Bottom Stats & Button */}
                  <div className="mt-4 pt-3 border-t border-[#262626] flex items-center justify-between text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block">Cards</span>
                      <span className="font-bold text-slate-200">
                        {s.actual_card_count} cards
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 uppercase block">Valuation</span>
                      <span className="font-bold text-emerald-400">
                        {formatUSD(Number(s.total_valuation_cents))}
                      </span>
                    </div>
                  </div>

                  {/* Hover Button */}
                  <button className="w-full mt-3 py-1.5 rounded-lg bg-[#222222] group-hover:bg-indigo-600 text-slate-300 group-hover:text-white text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer">
                    <span>View Cards</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {eraSets.length === 0 && (
                <div className="col-span-full p-12 text-center text-slate-500 italic text-sm">
                  No expansions found matching your search in this era.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* LEVEL 3: INDIVIDUAL CARDS IN THE SELECTED EXPANSION */}
        {/* ======================================================== */}
        {viewLevel === 'cards' && selectedSet && (
          <div className="max-w-7xl mx-auto space-y-5">
            {/* Top Navigation & Back Button */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <button
                onClick={handleBackToSets}
                className="px-3 py-1.5 rounded-lg bg-[#202020] hover:bg-[#2b2b2b] text-slate-300 hover:text-white text-xs font-semibold border border-[#2e2e2e] flex items-center gap-2 transition cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to {selectedEra?.name || 'Era'} Sets</span>
              </button>

              {/* Card Controls & Filters */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Search Card */}
                <div className="relative w-44">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search cards..."
                    value={cardSearch}
                    onChange={(e) => setCardSearch(e.target.value)}
                    className="w-full bg-[#1c1c1c] border border-[#2d2d2d] rounded-md pl-8 pr-3 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Sort By Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-[#1c1c1c] border border-[#2d2d2d] rounded-md px-2.5 py-1 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="number_asc">Card Number (#1 → #999)</option>
                  <option value="price_desc">Market Price ($ High → Low)</option>
                  <option value="price_asc">Market Price ($ Low → High)</option>
                  <option value="name_asc">Card Name (A → Z)</option>
                </select>

                {/* View Mode Toggle */}
                <div className="flex items-center bg-[#1c1c1c] border border-[#2d2d2d] rounded-md p-0.5">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1 rounded cursor-pointer ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    title="Grid View"
                  >
                    <Grid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-1 rounded cursor-pointer ${viewMode === 'table' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    title="Table View"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Set Banner */}
            <div className="bg-[#181818] border border-[#282828] rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white text-base shadow-lg">
                  {selectedSet.language === 'en' ? 'EN' : 'JP'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-lg text-white">{selectedSet.name}</h2>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                      {selectedSet.set_code}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-0.5">
                    <span>{totalCardsInSet} Total Master Cards</span>
                    <span>•</span>
                    <span>Expansion Value: {formatUSD(Number(selectedSet.total_valuation_cents))}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cards Gallery */}
            {cardsLoading ? (
              <div className="h-64 flex flex-col items-center justify-center gap-2 text-slate-400 text-xs font-mono">
                <RefreshCw className="w-6 h-6 animate-spin text-indigo-400" />
                <span>Loading expansion cards & live market prices...</span>
              </div>
            ) : cardError ? (
              <div className="h-64 flex flex-col items-center justify-center gap-3 text-slate-400 text-xs">
                <AlertCircle className="w-8 h-8 text-rose-400" />
                <span className="font-mono text-rose-300">{cardError}</span>
                <button
                  onClick={() => setPage((p) => p)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry</span>
                </button>
              </div>
            ) : cards.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center gap-2 text-slate-500 text-xs">
                <AlertCircle className="w-8 h-8 text-slate-600" />
                <span>No cards found matching your query in this expansion.</span>
              </div>
            ) : viewMode === 'grid' ? (
              /* Grid View */
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {cards.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCard(c)}
                    className="group bg-[#181818] border border-[#262626] hover:border-indigo-500/50 rounded-xl p-2.5 transition flex flex-col justify-between cursor-pointer hover:shadow-xl hover:shadow-indigo-500/10"
                  >
                    {/* Card Scan Image */}
                    <div className="aspect-[2.5/3.5] bg-[#222222] rounded-lg overflow-hidden relative flex items-center justify-center border border-[#2d2d2d] mb-2">
                      {c.primary_image_url ? (
                        <img
                          src={c.primary_image_url}
                          alt={c.clean_name}
                          loading="lazy"
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="text-center p-3 text-slate-600 flex flex-col items-center gap-1">
                          <Layers className="w-6 h-6" />
                          <span className="text-[10px] font-mono">Scan pending</span>
                        </div>
                      )}

                      {/* Card Number on image */}
                      <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-sm text-[10px] font-mono text-white font-bold border border-white/10">
                        #{c.card_number}
                      </span>
                    </div>

                    {/* Card Details */}
                    <div className="space-y-1">
                      <span className="font-bold text-xs text-white truncate block group-hover:text-indigo-300 transition">
                        {c.clean_name}
                      </span>

                      {/* Rarity & Variants */}
                      <div className="flex items-center justify-between text-[10px]">
                        <span className={`px-1.5 py-0.2 rounded border font-mono truncate max-w-[100px] ${getRarityBadgeColor(c.rarity)}`}>
                          {c.rarity || 'Common'}
                        </span>
                        <span className="font-mono text-slate-400">
                          {c.variants.length} var
                        </span>
                      </div>

                      {/* Market Price Tag */}
                      <div className="mt-2 pt-1.5 border-t border-[#262626] flex items-center justify-between">
                        <span className="text-[10px] font-mono text-slate-400 uppercase">Market:</span>
                        <span className="font-mono font-bold text-xs text-emerald-400">
                          {formatUSD(c.top_market_cents)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Table View */
              <div className="border border-[#262626] rounded-xl overflow-hidden bg-[#181818]">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#262626] bg-[#1e1e1e] text-slate-400 font-mono text-[11px]">
                      <th className="py-2.5 px-3">Card</th>
                      <th className="py-2.5 px-3">Name</th>
                      <th className="py-2.5 px-3">Rarity</th>
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3">Artist</th>
                      <th className="py-2.5 px-3 text-right">Market Price</th>
                      <th className="py-2.5 px-3 text-right">Low Listing</th>
                      <th className="py-2.5 px-3 text-right">Buylist</th>
                      <th className="py-2.5 px-3 text-center">Variants</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#222222]">
                    {cards.map((c) => {
                      const topVariant = c.variants[0];
                      return (
                        <tr
                          key={c.id}
                          onClick={() => setSelectedCard(c)}
                          className="hover:bg-[#202020] cursor-pointer transition"
                        >
                          <td className="py-2 px-3 font-mono font-bold text-slate-300">
                            #{c.card_number}
                          </td>
                          <td className="py-2 px-3">
                            <div className="flex items-center gap-2">
                              {c.primary_image_url && (
                                <img
                                  src={c.primary_image_url}
                                  alt={c.clean_name}
                                  className="w-6 h-8 object-contain rounded shrink-0 bg-[#2b2b2b]"
                                />
                              )}
                              <span className="font-semibold text-white hover:text-indigo-300">
                                {c.clean_name}
                              </span>
                            </div>
                          </td>
                          <td className="py-2 px-3">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono border ${getRarityBadgeColor(c.rarity)}`}>
                              {c.rarity || 'Common'}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-slate-400 font-mono text-[11px]">
                            {c.supertype || 'Pokémon'}
                          </td>
                          <td className="py-2 px-3 text-slate-400 text-[11px] truncate max-w-[120px]">
                            {c.artist || '—'}
                          </td>
                          <td className="py-2 px-3 text-right font-mono font-bold text-emerald-400">
                            {formatUSD(c.top_market_cents)}
                          </td>
                          <td className="py-2 px-3 text-right font-mono text-slate-400">
                            {formatUSD(topVariant?.low_cents)}
                          </td>
                          <td className="py-2 px-3 text-right font-mono text-indigo-300">
                            {formatUSD(topVariant?.buylist_cents)}
                          </td>
                          <td className="py-2 px-3 text-center">
                            <span className="px-2 py-0.5 rounded bg-[#2b2b2b] text-[10px] font-mono text-slate-300">
                              {c.variants.length} var
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 3. CARD DEEP-DIVE MODAL & AUTOPRICING MATRIX */}
      {/* ======================================================== */}
      {selectedCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-3xl bg-[#1a1a1a] border border-[#2e2e2e] rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 border-b border-[#2e2e2e] flex items-center justify-between bg-[#202020]">
              <div className="flex items-center gap-3">
                <div className="px-2 py-1 rounded bg-indigo-600/20 text-indigo-300 font-mono font-bold text-xs border border-indigo-500/30">
                  #{selectedCard.card_number}
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">{selectedCard.clean_name}</h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Official Name: {selectedCard.official_name} • Set: {selectedSet?.name} ({selectedSet?.set_code})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCard(null)}
                className="w-8 h-8 rounded-lg bg-[#2a2a2a] hover:bg-[#333333] flex items-center justify-center text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Card Presentation Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="aspect-[2.5/3.5] bg-[#121212] rounded-xl overflow-hidden border border-[#333333] flex items-center justify-center shadow-lg">
                  {selectedCard.primary_image_url ? (
                    <img
                      src={selectedCard.primary_image_url}
                      alt={selectedCard.clean_name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-center p-4 text-slate-600 flex flex-col items-center gap-2">
                      <Layers className="w-8 h-8" />
                      <span className="text-xs font-mono">No High-Res Scan Available</span>
                    </div>
                  )}
                </div>

                {/* Metadata Details */}
                <div className="md:col-span-2 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-[#161616] border border-[#2b2b2b] rounded-xl">
                      <span className="text-[10px] font-mono uppercase text-slate-500 block">Rarity</span>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-mono border ${getRarityBadgeColor(selectedCard.rarity)}`}>
                        {selectedCard.rarity || 'Common'}
                      </span>
                    </div>

                    <div className="p-3 bg-[#161616] border border-[#2b2b2b] rounded-xl">
                      <span className="text-[10px] font-mono uppercase text-slate-500 block">Supertype / Stage</span>
                      <span className="text-xs font-semibold text-white mt-1 block font-mono">
                        {selectedCard.supertype || 'Pokémon'} {selectedCard.subtypes?.length ? `(${selectedCard.subtypes.join(', ')})` : ''}
                      </span>
                    </div>

                    <div className="p-3 bg-[#161616] border border-[#2b2b2b] rounded-xl">
                      <span className="text-[10px] font-mono uppercase text-slate-500 block">Illustrator / Artist</span>
                      <span className="text-xs font-medium text-slate-300 mt-1 block">
                        {selectedCard.artist || 'Unknown'}
                      </span>
                    </div>

                    <div className="p-3 bg-[#161616] border border-[#2b2b2b] rounded-xl">
                      <span className="text-[10px] font-mono uppercase text-slate-500 block">Top Market Valuation</span>
                      <span className="text-base font-bold text-emerald-400 font-mono mt-0.5 block">
                        {formatUSD(selectedCard.top_market_cents)}
                      </span>
                    </div>
                  </div>

                  {/* Attacks & Rules */}
                  {selectedCard.game_metadata?.attacks && (
                    <div className="p-3 bg-[#161616] border border-[#2b2b2b] rounded-xl space-y-2">
                      <span className="text-[10px] font-mono uppercase text-slate-500 block font-bold">Attacks & Moves</span>
                      <div className="space-y-1.5">
                        {selectedCard.game_metadata.attacks.map((atk: any, idx: number) => (
                          <div key={idx} className="text-xs border-b border-[#242424] pb-1 last:border-none">
                            <span className="font-bold text-white mr-2">{atk.name}</span>
                            <span className="font-mono text-amber-400 mr-2">{atk.damage ? `[${atk.damage}]` : ''}</span>
                            <span className="text-slate-400">{atk.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Complete Physical Variants & Autopricing Matrix Table */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    <span>Physical Variants & Real-Time Market Prices</span>
                  </h4>
                  <span className="text-xs font-mono text-slate-400">
                    {selectedCard.variants.length} Registered Physical Variants
                  </span>
                </div>

                <div className="border border-[#2e2e2e] rounded-xl overflow-hidden bg-[#161616]">
                  <table className="w-full text-left text-xs border-collapse font-mono">
                    <thead>
                      <tr className="border-b border-[#2e2e2e] bg-[#222222] text-slate-400 text-[11px]">
                        <th className="py-2.5 px-3">Finish</th>
                        <th className="py-2.5 px-3">Print Run</th>
                        <th className="py-2.5 px-3">Stamp</th>
                        <th className="py-2.5 px-3 text-right">TCGplayer Market</th>
                        <th className="py-2.5 px-3 text-right">Low Listing</th>
                        <th className="py-2.5 px-3 text-right">Buylist (Wholesale)</th>
                        <th className="py-2.5 px-3 text-right">PriceCharting</th>
                        <th className="py-2.5 px-3 text-center">PSA 10 Pop</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#242424]">
                      {selectedCard.variants.map((v) => (
                        <tr key={v.variant_id} className="hover:bg-[#1f1f1f] transition">
                          <td className="py-2.5 px-3 font-semibold text-white capitalize">
                            {v.finish.replace('_', ' ')}
                            {v.is_error && (
                              <span className="ml-1.5 px-1 py-0.2 rounded bg-rose-500/20 text-rose-300 text-[10px] border border-rose-500/30">
                                ERROR
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-slate-300 capitalize">
                            {v.print_run.replace('_', ' ')}
                          </td>
                          <td className="py-2.5 px-3 text-slate-400">
                            {v.stamp !== 'none' ? v.stamp : '—'}
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold text-emerald-400">
                            {formatUSD(v.market_cents)}
                          </td>
                          <td className="py-2.5 px-3 text-right text-slate-400">
                            {formatUSD(v.low_cents)}
                          </td>
                          <td className="py-2.5 px-3 text-right text-indigo-300 font-medium">
                            {formatUSD(v.buylist_cents)}
                          </td>
                          <td className="py-2.5 px-3 text-right text-slate-300">
                            {formatUSD(v.pc_cents)}
                          </td>
                          <td className="py-2.5 px-3 text-center text-slate-400">
                            {v.psa_10_pop !== null ? v.psa_10_pop.toLocaleString() : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UniversalCatalogView;
