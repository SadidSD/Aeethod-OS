import React, { useState, useEffect, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Search,
  Flame,
  Sparkles,
  BarChart3,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  Layers,
  Filter,
  RefreshCw,
  Zap,
  Star,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Activity,
  Award,
  ShieldCheck,
  Eye,
  X,
  Copy,
  Check
} from 'lucide-react';
import { useStore } from '../store';

interface TrackedCard {
  rank: number;
  id: string;
  variant_id: string;
  clean_name: string;
  official_name: string;
  card_number: string;
  rarity: string;
  finish: string;
  stamp: string;
  print_run: string;
  set_name: string;
  set_code: string;
  language: string;
  era_block: string;
  image_url: string | null;
  price_usd: number;
  market_cents: number;
  low_cents: number;
  buylist_cents: number;
  change_1h_pct: number;
  change_24h_pct: number;
  change_7d_pct: number;
  sparkline_7d: number[];
  volume_24h_usd: number;
  volume_24h_cents: number;
  market_cap_usd: number;
  ath_usd: number;
  psa_10_pop: number | null;
}

interface MarketIndex {
  id: string;
  ticker: string;
  name: string;
  value: number;
  change_24h: number;
  sparkline: number[];
}

interface MacroData {
  total_market_cap_usd: number;
  volume_24h_usd: number;
  zard_dominance_pct: number;
  pika_dominance_pct: number;
  fear_and_greed: {
    score: number;
    label: string;
    sentiment: string;
  };
  total_tracked_assets: number;
}

// Sparkline SVG Component (CoinGecko Style)
const Sparkline: React.FC<{ data: number[]; isPositive: boolean; width?: number; height?: number }> = ({
  data,
  isPositive,
  width = 135,
  height = 38
}) => {
  if (!data || data.length < 2) return <div className="w-[135px] h-[38px]" />;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = 4;
  const usableHeight = height - padding * 2;

  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * width;
    const y = height - padding - ((val - min) / range) * usableHeight;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const pathD = `M ${points.join(' L ')}`;
  const strokeColor = isPositive ? '#10b981' : '#ef4444';
  const fillColor = isPositive ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)';
  const areaD = `${pathD} L ${width},${height} L 0,${height} Z`;

  return (
    <svg width={width} height={height} className="overflow-visible block">
      <defs>
        <linearGradient id={`grad-${isPositive ? 'pos' : 'neg'}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity="0.25" />
          <stop offset="100%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#grad-${isPositive ? 'pos' : 'neg'})`} />
      <path d={pathD} fill="none" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const CardGeckoView: React.FC = () => {
  const { theme } = useStore();
  const isLight = theme === 'light';

  // Navigation & Filter state
  const [activeTab, setActiveTab] = useState<'top100' | 'grails' | 'vintage' | 'modern' | 'japanese' | 'all'>('top100');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy, setSortBy] = useState('price_desc');
  const [page, setPage] = useState(1);
  const limit = 50;

  // Data state
  const [loading, setLoading] = useState(true);
  const [macro, setMacro] = useState<MacroData | null>(null);
  const [indexes, setIndexes] = useState<MarketIndex[]>([]);
  const [cards, setCards] = useState<TrackedCard[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCards, setTotalCards] = useState(0);

  // Selected Card for Deep Financial Modal
  const [selectedCard, setSelectedCard] = useState<TrackedCard | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  // Local Watchlist
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('aeethod_card_watchlist') || '[]');
    } catch {
      return [];
    }
  });

  const toggleWatchlist = (variantId: string) => {
    setWatchlist(prev => {
      const next = prev.includes(variantId) ? prev.filter(id => id !== variantId) : [...prev, variantId];
      localStorage.setItem('aeethod_card_watchlist', JSON.stringify(next));
      return next;
    });
  };

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Fetch API data
  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        tab: activeTab,
        search: debouncedSearch,
        page: String(page),
        limit: String(limit),
        sortBy
      });

      const res = await fetch(`/api/catalog/tracker?${params.toString()}`);
      if (!res.ok) {
        // Fallback for direct route
        const res2 = await fetch(`/api/catalog/market-tracker?${params.toString()}`);
        if (!res2.ok) throw new Error(`HTTP ${res2.status}`);
        const data = await res2.json();
        setMacro(data.macro);
        setIndexes(data.indexes || []);
        setCards(data.cards || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalCards(data.pagination?.totalCards || 0);
        return;
      }
      const data = await res.json();
      setMacro(data.macro);
      setIndexes(data.indexes || []);
      setCards(data.cards || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalCards(data.pagination?.totalCards || 0);
    } catch (err) {
      console.error('Failed to load tracker data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab, debouncedSearch, page, sortBy]);

  // Top Gainers / Losers for banner
  const topGainer = useMemo(() => {
    if (cards.length === 0) return null;
    return [...cards].sort((a, b) => b.change_24h_pct - a.change_24h_pct)[0];
  }, [cards]);

  const topLoser = useMemo(() => {
    if (cards.length === 0) return null;
    return [...cards].sort((a, b) => a.change_24h_pct - b.change_24h_pct)[0];
  }, [cards]);

  const fmtCurrency = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(1)}K`;
    return `$${val.toFixed(2)}`;
  };

  return (
    <div className={`h-full w-full flex flex-col overflow-hidden select-text transition-colors duration-150 ${
      isLight ? 'bg-[#fafafb] text-slate-800' : 'bg-[#0f0f11] text-[#e6e6e6]'
    }`}>
      {/* ======================================================== */}
      {/* 1. TOP GLOBAL MACRO METRICS BAR (CoinGecko Style) */}
      {/* ======================================================== */}
      <div className={`border-b px-5 py-2.5 flex items-center justify-between text-xs shrink-0 overflow-x-auto gap-6 transition-colors ${
        isLight ? 'bg-white border-slate-200/90 text-slate-600' : 'bg-[#141416] border-zinc-800/80 text-zinc-400'
      }`}>
        <div className="flex items-center gap-6 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-slate-400 dark:text-zinc-500">Tracked Assets:</span>
            <span className="font-semibold font-mono text-slate-800 dark:text-zinc-200">
              {macro?.total_tracked_assets?.toLocaleString() || '97,875'}
            </span>
          </div>

          <div className="h-3 w-px bg-slate-200 dark:bg-zinc-800" />

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-slate-400 dark:text-zinc-500">Market Cap:</span>
            <span className="font-semibold font-mono text-slate-900 dark:text-white">
              {macro ? fmtCurrency(macro.total_market_cap_usd) : '$1.69M'}
            </span>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-1 py-0.5 rounded">
              +2.4%
            </span>
          </div>

          <div className="h-3 w-px bg-slate-200 dark:bg-zinc-800" />

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-slate-400 dark:text-zinc-500">24h Vol:</span>
            <span className="font-semibold font-mono text-slate-900 dark:text-white">
              {macro ? fmtCurrency(macro.volume_24h_usd) : '$384.5K'}
            </span>
          </div>

          <div className="h-3 w-px bg-slate-200 dark:bg-zinc-800" />

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-slate-400 dark:text-zinc-500">Dominance:</span>
            <span className="font-mono text-[11px] font-semibold text-amber-600 dark:text-amber-400">
              $ZARD {macro?.zard_dominance_pct || '5.2'}%
            </span>
            <span className="font-mono text-[11px] font-semibold text-yellow-600 dark:text-yellow-400">
              $PIKA {macro?.pika_dominance_pct || '3.8'}%
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-slate-400 dark:text-zinc-500">Fear & Greed:</span>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-[11px]">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{macro?.fear_and_greed?.score || 74}</span>
              <span className="uppercase text-[9px] tracking-wider">{macro?.fear_and_greed?.label || 'Greed'}</span>
            </div>
          </div>

          <button
            onClick={() => fetchData()}
            className={`p-1.5 rounded-md transition cursor-pointer hover:bg-slate-100 dark:hover:bg-zinc-800 ${
              loading ? 'animate-spin text-emerald-500' : 'text-slate-400 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-white'
            }`}
            title="Refresh Live Market Rates"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. CURATED SECTOR INDEX CARDS (Crypto ETF Style) */}
      {/* ======================================================== */}
      <div className={`p-4 md:px-6 border-b shrink-0 ${isLight ? 'bg-white/80 border-slate-200/80' : 'bg-[#121214]/60 border-zinc-800/60'}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {indexes.map(idx => {
            const isPos = idx.change_24h >= 0;
            return (
              <div
                key={idx.id}
                className={`p-3.5 rounded-xl border transition-all duration-150 flex items-center justify-between ${
                  isLight
                    ? 'bg-slate-50/70 hover:bg-white border-slate-200/80 shadow-2xs hover:shadow-xs'
                    : 'bg-[#18181b]/70 hover:bg-[#1f1f23] border-zinc-800'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400">{idx.ticker}</span>
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500 truncate max-w-[120px]">{idx.name}</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-base font-bold text-slate-900 dark:text-white">
                      ${idx.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                    <span className={`font-mono text-xs font-semibold flex items-center ${isPos ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {isPos ? '+' : ''}{idx.change_24h}%
                    </span>
                  </div>
                </div>
                <div className="w-24 h-10">
                  <Sparkline data={idx.sparkline} isPositive={isPos} width={96} height={36} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. CONTROLS, SEARCH & SECTOR TABS */}
      {/* ======================================================== */}
      <div className={`p-4 md:px-6 border-b flex flex-wrap items-center justify-between gap-3 shrink-0 ${
        isLight ? 'bg-[#fcfcfd] border-slate-200/80' : 'bg-[#151518] border-zinc-800/80'
      }`}>
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'top100', label: '🏆 Top 100 Assets' },
            { id: 'grails', label: '💎 Grails ($500+)' },
            { id: 'vintage', label: '📜 WotC Vintage' },
            { id: 'modern', label: '🎨 Modern SARs' },
            { id: 'japanese', label: '🗾 Japanese Exclusives' },
            { id: 'all', label: '⚡ All Cards' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer shrink-0 ${
                activeTab === tab.id
                  ? isLight
                    ? 'bg-slate-900 text-white shadow-2xs font-semibold'
                    : 'bg-white text-zinc-900 font-bold'
                  : isLight
                    ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cards, sets, or #..."
              className={`w-full pl-8.5 pr-3 py-1.5 rounded-lg text-xs font-medium border outline-none transition ${
                isLight
                  ? 'bg-white border-slate-200 focus:border-indigo-500 text-slate-800 placeholder:text-slate-400'
                  : 'bg-zinc-900/90 border-zinc-800 focus:border-indigo-500 text-white placeholder:text-zinc-500'
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border outline-none cursor-pointer transition ${
              isLight
                ? 'bg-white border-slate-200 text-slate-800'
                : 'bg-zinc-900 border-zinc-800 text-white'
            }`}
          >
            <option value="price_desc">Highest Price</option>
            <option value="price_asc">Lowest Price</option>
            <option value="pop_desc">PSA 10 Pop</option>
            <option value="name_asc">Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. MAIN FINANCIAL DATA TABLE (CoinGecko Style) */}
      {/* ======================================================== */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead className={`sticky top-0 z-10 text-[11px] font-semibold border-b tracking-wider uppercase ${
            isLight
              ? 'bg-[#fcfcfd]/95 backdrop-blur-xs text-slate-500 border-slate-200/90'
              : 'bg-[#141417]/95 backdrop-blur-xs text-zinc-400 border-zinc-800'
          }`}>
            <tr>
              <th className="py-3 px-4 w-12 text-center">#</th>
              <th className="py-3 px-4">Card Asset</th>
              <th className="py-3 px-4 text-right">Price</th>
              <th className="py-3 px-4 text-right">1h %</th>
              <th className="py-3 px-4 text-right">24h %</th>
              <th className="py-3 px-4 text-right">7d %</th>
              <th className="py-3 px-4 text-right">24h Volume</th>
              <th className="py-3 px-4 text-right">Market Cap</th>
              <th className="py-3 px-4 text-center w-36">Last 7 Days</th>
              <th className="py-3 px-4 text-center w-12"></th>
            </tr>
          </thead>

          <tbody className={`divide-y text-xs font-medium ${
            isLight ? 'divide-slate-100 bg-white' : 'divide-zinc-850 bg-[#121214]'
          }`}>
            {loading ? (
              Array.from({ length: 15 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="py-4 px-4 text-center"><div className="w-4 h-4 bg-slate-200 dark:bg-zinc-800 rounded mx-auto" /></td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-12 bg-slate-200 dark:bg-zinc-800 rounded" />
                      <div className="space-y-1.5">
                        <div className="w-32 h-3.5 bg-slate-200 dark:bg-zinc-800 rounded" />
                        <div className="w-20 h-2.5 bg-slate-200 dark:bg-zinc-800 rounded" />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right"><div className="w-16 h-3.5 bg-slate-200 dark:bg-zinc-800 rounded ml-auto" /></td>
                  <td className="py-4 px-4 text-right"><div className="w-12 h-3.5 bg-slate-200 dark:bg-zinc-800 rounded ml-auto" /></td>
                  <td className="py-4 px-4 text-right"><div className="w-12 h-3.5 bg-slate-200 dark:bg-zinc-800 rounded ml-auto" /></td>
                  <td className="py-4 px-4 text-right"><div className="w-12 h-3.5 bg-slate-200 dark:bg-zinc-800 rounded ml-auto" /></td>
                  <td className="py-4 px-4 text-right"><div className="w-16 h-3.5 bg-slate-200 dark:bg-zinc-800 rounded ml-auto" /></td>
                  <td className="py-4 px-4 text-right"><div className="w-20 h-3.5 bg-slate-200 dark:bg-zinc-800 rounded ml-auto" /></td>
                  <td className="py-4 px-4 text-center"><div className="w-24 h-6 bg-slate-200 dark:bg-zinc-800 rounded mx-auto" /></td>
                  <td className="py-4 px-4"></td>
                </tr>
              ))
            ) : cards.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-16 text-center text-slate-400 dark:text-zinc-500">
                  <Activity className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="font-semibold text-sm">No cards match your filter criteria.</p>
                  <p className="text-xs">Try clearing your search query or switching to 'All Cards'.</p>
                </td>
              </tr>
            ) : (
              cards.map((card) => {
                const is24hPos = card.change_24h_pct >= 0;
                const is7dPos = card.change_7d_pct >= 0;
                const is1hPos = card.change_1h_pct >= 0;
                const isWatched = watchlist.includes(card.variant_id);

                return (
                  <tr
                    key={card.variant_id}
                    onClick={() => setSelectedCard(card)}
                    className={`group cursor-pointer transition-colors duration-100 ${
                      isLight
                        ? 'hover:bg-slate-50/90'
                        : 'hover:bg-zinc-800/40'
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-3 px-4 text-center font-mono text-xs text-slate-400 dark:text-zinc-500">
                      {card.rank}
                    </td>

                    {/* Card Asset */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {/* Thumbnail */}
                        <div className="w-9 h-12 rounded bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700/80 overflow-hidden shrink-0 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform duration-150">
                          {card.image_url ? (
                            <img
                              src={card.image_url}
                              alt={card.clean_name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <Sparkles className="w-3.5 h-3.5 text-slate-300 dark:text-zinc-600" />
                          )}
                        </div>

                        {/* Title & Metadata */}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                              {card.clean_name}
                            </span>
                            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                              card.rarity.includes('Rare') || card.rarity.includes('SAR') || card.rarity.includes('RGB')
                                ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20'
                                : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400'
                            }`}>
                              {card.rarity}
                            </span>
                            {card.language === 'jp' && (
                              <span className="text-[10px] bg-rose-500/10 text-rose-600 dark:text-rose-400 px-1 py-0.2 rounded font-mono font-bold">
                                JP
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-zinc-500 mt-0.5">
                            <span className="truncate max-w-[140px] sm:max-w-[200px]">{card.set_name}</span>
                            <span>•</span>
                            <span className="font-mono">#{card.card_number}</span>
                            {card.finish !== 'regular' && (
                              <>
                                <span>•</span>
                                <span className="capitalize font-mono text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
                                  {card.finish.replace('_', ' ')}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white text-xs">
                      ${card.price_usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>

                    {/* 1h % */}
                    <td className={`py-3 px-4 text-right font-mono text-xs font-semibold ${is1hPos ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {is1hPos ? '+' : ''}{card.change_1h_pct}%
                    </td>

                    {/* 24h % */}
                    <td className="py-3 px-4 text-right">
                      <span className={`inline-flex items-center gap-0.5 font-mono text-xs font-semibold px-2 py-0.5 rounded-md ${
                        is24hPos
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                      }`}>
                        {is24hPos ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {Math.abs(card.change_24h_pct)}%
                      </span>
                    </td>

                    {/* 7d % */}
                    <td className={`py-3 px-4 text-right font-mono text-xs font-semibold ${is7dPos ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {is7dPos ? '+' : ''}{card.change_7d_pct}%
                    </td>

                    {/* 24h Volume */}
                    <td className="py-3 px-4 text-right font-mono text-slate-700 dark:text-zinc-300">
                      ${card.volume_24h_usd.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </td>

                    {/* Market Cap */}
                    <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900 dark:text-white">
                      ${card.market_cap_usd.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </td>

                    {/* 7d Sparkline */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center">
                        <Sparkline data={card.sparkline_7d} isPositive={is7dPos} />
                      </div>
                    </td>

                    {/* Watchlist Star */}
                    <td className="py-3 px-4 text-center" onClick={(e) => { e.stopPropagation(); toggleWatchlist(card.variant_id); }}>
                      <button className="p-1 rounded hover:bg-slate-100 dark:hover:bg-zinc-800 transition cursor-pointer">
                        <Star className={`w-4 h-4 transition ${
                          isWatched ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-zinc-600 hover:text-amber-400'
                        }`} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ======================================================== */}
      {/* 5. PAGINATION BAR */}
      {/* ======================================================== */}
      <div className={`border-t px-6 py-3 flex items-center justify-between text-xs shrink-0 ${
        isLight ? 'bg-white border-slate-200 text-slate-600' : 'bg-[#141416] border-zinc-800 text-zinc-400'
      }`}>
        <div className="font-mono text-slate-500 dark:text-zinc-400">
          Showing <span className="font-bold text-slate-800 dark:text-white">{(page - 1) * limit + 1}</span> to{' '}
          <span className="font-bold text-slate-800 dark:text-white">{Math.min(page * limit, totalCards)}</span> of{' '}
          <span className="font-bold text-slate-800 dark:text-white">{totalCards.toLocaleString()}</span> tracked assets
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className={`p-1.5 px-3 rounded-lg border font-medium flex items-center gap-1 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
              isLight ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700' : 'bg-zinc-850 hover:bg-zinc-800 border-zinc-700 text-white'
            }`}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <span className="font-mono font-semibold px-2">
            {page} / {totalPages}
          </span>

          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className={`p-1.5 px-3 rounded-lg border font-medium flex items-center gap-1 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
              isLight ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700' : 'bg-zinc-850 hover:bg-zinc-800 border-zinc-700 text-white'
            }`}
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 6. DEEP FINANCIAL ASSET MODAL (The "Coin Page" for a Card) */}
      {/* ======================================================== */}
      {selectedCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className={`w-full max-w-3xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
              isLight ? 'bg-white border-slate-200' : 'bg-[#18181b] border-zinc-800 text-zinc-100'
            }`}
          >
            {/* Modal Header */}
            <div className={`p-5 border-b flex items-center justify-between ${
              isLight ? 'bg-slate-50/80 border-slate-200' : 'bg-zinc-900/60 border-zinc-800'
            }`}>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-500/20">
                  RANK #{selectedCard.rank}
                </span>
                <div>
                  <h2 className="font-bold text-base text-slate-900 dark:text-white">
                    {selectedCard.clean_name}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    {selectedCard.set_name} • #{selectedCard.card_number} • {selectedCard.rarity}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleWatchlist(selectedCard.variant_id)}
                  className={`p-2 rounded-lg border transition cursor-pointer ${
                    watchlist.includes(selectedCard.variant_id)
                      ? 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                      : 'hover:bg-slate-100 dark:hover:bg-zinc-800 border-slate-200 dark:border-zinc-700'
                  }`}
                >
                  <Star className={`w-4 h-4 ${watchlist.includes(selectedCard.variant_id) ? 'fill-amber-400' : ''}`} />
                </button>

                <button
                  onClick={() => setSelectedCard(null)}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Top Valuation Hero Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Card Artwork Card */}
                <div className={`p-4 rounded-xl border flex flex-col items-center justify-center ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-zinc-900/80 border-zinc-800'
                }`}>
                  <div className="w-36 h-48 rounded-lg overflow-hidden border border-slate-200 dark:border-zinc-700 shadow-md">
                    {selectedCard.image_url ? (
                      <img src={selectedCard.image_url} alt={selectedCard.clean_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-200 dark:bg-zinc-800 text-slate-400">
                        No Scan
                      </div>
                    )}
                  </div>
                  <span className="mt-3 text-[11px] font-mono text-slate-500 dark:text-zinc-400 capitalize">
                    {selectedCard.finish.replace('_', ' ')} Finish
                  </span>
                </div>

                {/* Live Price & Trajectory */}
                <div className="md:col-span-2 space-y-4">
                  <div className={`p-4 rounded-xl border ${isLight ? 'bg-slate-50/70 border-slate-200' : 'bg-zinc-900/50 border-zinc-800'}`}>
                    <span className="text-[11px] font-mono uppercase text-slate-400 dark:text-zinc-500">Live TCGplayer Market Price</span>
                    <div className="flex items-baseline gap-3 mt-1">
                      <span className="font-mono text-3xl font-extrabold text-slate-900 dark:text-white">
                        ${selectedCard.price_usd.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                      <span className={`font-mono text-sm font-bold flex items-center ${selectedCard.change_24h_pct >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {selectedCard.change_24h_pct >= 0 ? '+' : ''}{selectedCard.change_24h_pct}% (24h)
                      </span>
                    </div>

                    {/* 7-Day Chart Preview */}
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-zinc-800">
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 dark:text-zinc-500 mb-2">
                        <span>7-Day Trajectory Curve</span>
                        <span className={selectedCard.change_7d_pct >= 0 ? 'text-emerald-500 font-bold' : 'text-rose-500 font-bold'}>
                          7d: {selectedCard.change_7d_pct >= 0 ? '+' : ''}{selectedCard.change_7d_pct}%
                        </span>
                      </div>
                      <div className="w-full h-20 flex items-center justify-center">
                        <Sparkline data={selectedCard.sparkline_7d} isPositive={selectedCard.change_7d_pct >= 0} width={420} height={70} />
                      </div>
                    </div>
                  </div>

                  {/* Financial Metrics Strip */}
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-zinc-900/40 border-zinc-800'}`}>
                      <span className="text-[10px] font-mono uppercase text-slate-400 dark:text-zinc-500 block">Lowest Verified</span>
                      <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                        ${(selectedCard.low_cents / 100).toFixed(2)}
                      </span>
                    </div>

                    <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-zinc-900/40 border-zinc-800'}`}>
                      <span className="text-[10px] font-mono uppercase text-slate-400 dark:text-zinc-500 block">Store Cash Buylist</span>
                      <span className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        ${(selectedCard.buylist_cents / 100).toFixed(2)}
                      </span>
                    </div>

                    <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-zinc-900/40 border-zinc-800'}`}>
                      <span className="text-[10px] font-mono uppercase text-slate-400 dark:text-zinc-500 block">All-Time High</span>
                      <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                        ${selectedCard.ath_usd.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grade-by-Grade Valuation Estimator (PSA 10 Multipliers) */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span>Graded Valuation Curve (PSA / BGS / CGC Comps)</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                  <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-zinc-900/50 border-zinc-800'}`}>
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500 block">Ungraded NM</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">${selectedCard.price_usd.toFixed(2)}</span>
                    <span className="text-[9px] text-slate-400 block mt-0.5">1.0x Baseline</span>
                  </div>

                  <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-zinc-900/50 border-zinc-800'}`}>
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500 block">PSA 9 Mint</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">${(selectedCard.price_usd * 1.35).toFixed(2)}</span>
                    <span className="text-[9px] text-emerald-500 block mt-0.5">1.35x Multiplier</span>
                  </div>

                  <div className={`p-3 rounded-xl border ${isLight ? 'bg-indigo-50/50 border-indigo-200 text-indigo-900' : 'bg-indigo-950/20 border-indigo-800/40 text-indigo-300'}`}>
                    <span className="text-[10px] block font-bold">PSA 10 Gem Mint</span>
                    <span className="text-base font-extrabold text-indigo-600 dark:text-indigo-400">${(selectedCard.price_usd * 3.4).toFixed(2)}</span>
                    <span className="text-[9px] text-indigo-500 block mt-0.5">
                      {selectedCard.psa_10_pop ? `${selectedCard.psa_10_pop} Graded Copies` : '3.4x Grail Curve'}
                    </span>
                  </div>

                  <div className={`p-3 rounded-xl border ${isLight ? 'bg-amber-50/50 border-amber-200 text-amber-900' : 'bg-amber-950/20 border-amber-800/40 text-amber-300'}`}>
                    <span className="text-[10px] block font-bold">BGS 9.5 / Pristine</span>
                    <span className="text-sm font-bold text-amber-700 dark:text-amber-400">${(selectedCard.price_usd * 4.2).toFixed(2)}</span>
                    <span className="text-[9px] text-amber-500 block mt-0.5">4.2x Black Label Est.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className={`p-4 border-t flex items-center justify-between text-xs font-medium ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-zinc-900 border-zinc-800'
            }`}>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(selectedCard.variant_id);
                  setCopiedId(true);
                  setTimeout(() => setCopiedId(false), 2000);
                }}
                className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition cursor-pointer font-mono ${
                  isLight ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700' : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300'
                }`}
              >
                {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId ? 'Copied ID' : 'Copy Variant UUID'}</span>
              </button>

              <a
                href={`https://www.tcgplayer.com/search/pokemon/product?q=${encodeURIComponent(selectedCard.clean_name)}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
              >
                <span>View on TCGplayer</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
