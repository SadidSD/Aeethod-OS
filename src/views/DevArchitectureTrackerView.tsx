import React, { useState, useMemo } from 'react';
import {
  Package,
  Cpu,
  Plus,
  Search,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Flame,
  ShieldCheck,
  ArrowRight,
  DollarSign,
  TrendingUp,
  Tag,
  Users,
  X,
  Layers,
  ChevronRight,
  Wrench,
  AlertTriangle,
  Building2,
  Maximize2,
  LayoutGrid,
  Columns,
  Target
} from 'lucide-react';
import { useStore } from '../store';
import { SaaSProductPillar, INITIAL_SAAS_PRODUCTS } from '../data/devPlanningData';

export const DevArchitectureTrackerView: React.FC = () => {
  const { theme, db, create, remove } = useStore();
  const isLight = theme === 'light';

  // Products from store / Supabase with comprehensive pillar fallbacks
  const saasProducts: SaaSProductPillar[] = useMemo(() => {
    const dbList = db?.saas_products || [];
    const mergedList = INITIAL_SAAS_PRODUCTS.map((init) => {
      const dbProd = dbList.find((p) => p.id === init.id);
      if (!dbProd) return init;
      return {
        ...init,
        ...dbProd,
        name: init.name || dbProd.name,
        tagline: init.tagline || dbProd.tagline,
        icon: init.icon || dbProd.icon,
        targetCustomerProblem:
          init.targetCustomerProblem && init.targetCustomerProblem.length > (dbProd.targetCustomerProblem?.length || 0)
            ? init.targetCustomerProblem
            : dbProd.targetCustomerProblem || init.targetCustomerProblem,
        problemsToBuild:
          init.problemsToBuild && init.problemsToBuild.length > (dbProd.problemsToBuild?.length || 0)
            ? init.problemsToBuild
            : dbProd.problemsToBuild || init.problemsToBuild,
        competitorAnalysis:
          init.competitorAnalysis && init.competitorAnalysis.length > (dbProd.competitorAnalysis?.length || 0)
            ? init.competitorAnalysis
            : dbProd.competitorAnalysis || init.competitorAnalysis,
        targetAudience: dbProd.targetAudience || init.targetAudience,
        pricingModel: dbProd.pricingModel || init.pricingModel,
        theAeethodSolution: dbProd.theAeethodSolution ?? init.theAeethodSolution,
      };
    });

    const customProds = dbList.filter((p) => !INITIAL_SAAS_PRODUCTS.some((init) => init.id === p.id));
    return [...mergedList, ...customProds];
  }, [db?.saas_products]);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'In Development' | 'In Discovery' | 'Live'>('All');
  const [profileFilter, setProfileFilter] = useState<'All' | 'Target' | 'P3' | 'P4' | 'Later'>('All');

  // Card view mode: 'tabs' (focused per card) or 'all' (all 3 pillars side-by-side)
  const [viewMode, setViewMode] = useState<'tabs' | 'all'>('tabs');
  // Track active tab per card for 'tabs' mode
  const [activeCardTabs, setActiveCardTabs] = useState<Record<string, 'problems' | 'build' | 'competitors' | 'solution'>>({});

  // Modal: Add New SaaS Product
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [prodName, setProdName] = useState('');
  const [prodTagline, setProdTagline] = useState('');
  const [prodIcon, setProdIcon] = useState('📦');
  const [prodProblem, setProdProblem] = useState('');
  const [prodProblemsToBuild, setProdProblemsToBuild] = useState('');
  const [prodCompetitorAnalysis, setProdCompetitorAnalysis] = useState('');
  const [prodSolution, setProdSolution] = useState(''); // left empty by default
  const [prodAudience, setProdAudience] = useState('Mid to high volume seller');
  const [prodPricing, setProdPricing] = useState('$99 - $299/mo (0% GMV fee)');
  const [prodStatus, setProdStatus] = useState<'Concept' | 'In Discovery' | 'In Development' | 'Beta' | 'Live'>('In Discovery');

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) return;

    create('saas_products', {
      name: prodName.trim(),
      tagline: prodTagline.trim() || 'High-impact TCG SaaS solution',
      icon: prodIcon.trim() || '📦',
      targetCustomerProblem: prodProblem.trim(),
      problemsToBuild: prodProblemsToBuild.trim(),
      competitorAnalysis: prodCompetitorAnalysis.trim(),
      theAeethodSolution: prodSolution.trim(), // Empty as requested
      targetAudience: prodAudience.trim() || 'Mid to high volume seller',
      pricingModel: prodPricing.trim() || '$99 - $299/mo',
      status: prodStatus,
      techStack: {
        uiUx: '',
        frontend: '',
        backend: '',
        database: '',
        devOps: ''
      }
    });

    setIsProductModalOpen(false);
    setProdName('');
    setProdTagline('');
    setProdProblem('');
    setProdProblemsToBuild('');
    setProdCompetitorAnalysis('');
    setProdSolution('');
  };

  const handleDeleteProduct = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this SaaS product?')) {
      remove('saas_products', id);
    }
  };

  // Status count calculations for filters
  const counts = useMemo(() => {
    return {
      all: saasProducts.length,
      inDev: saasProducts.filter((p) => p.status === 'In Development').length,
      inDisc: saasProducts.filter((p) => p.status === 'In Discovery').length,
      live: saasProducts.filter((p) => p.status === 'Live' || p.status === 'Beta').length
    };
  }, [saasProducts]);

  // Problem profile counts for targeting filters
  const problemCounts = useMemo(() => {
    let total = 0, target = 0, p3 = 0, p4 = 0, later = 0;
    saasProducts.forEach((p) => {
      const problems = p.targetCustomerProblem
        ? p.targetCustomerProblem.split(/(?:^|\n+)(?=\d+\.\s)/).map((s) => s.trim()).filter(Boolean)
        : [];
      problems.forEach((prob) => {
        total++;
        const match = prob.match(/\[(Profile[^\]]+)\]/i);
        const pStr = match ? match[1] : '';
        const isP3 = pStr.includes('3');
        const isP4 = pStr.includes('4');
        if (isP3 || isP4) target++;
        else later++;
        if (isP3) p3++;
        if (isP4) p4++;
      });
    });
    return { all: total, target, p3, p4, later };
  }, [saasProducts]);

  const filteredProducts = useMemo(() => {
    return saasProducts.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.targetCustomerProblem && p.targetCustomerProblem.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.problemsToBuild && p.problemsToBuild.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.competitorAnalysis && p.competitorAnalysis.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchStatus =
        statusFilter === 'All'
          ? true
          : statusFilter === 'Live'
          ? p.status === 'Live' || p.status === 'Beta'
          : p.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [saasProducts, searchQuery, statusFilter]);

  // Helper for status badge colors
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'In Development':
        return {
          dotColor: 'bg-amber-400',
          textColor: isLight ? 'text-amber-700' : 'text-amber-300',
          bgColor: isLight ? 'bg-amber-50 border-amber-200' : 'bg-amber-500/10 border-amber-500/20'
        };
      case 'In Discovery':
        return {
          dotColor: 'bg-sky-400',
          textColor: isLight ? 'text-sky-700' : 'text-sky-300',
          bgColor: isLight ? 'bg-sky-50 border-sky-200' : 'bg-sky-500/10 border-sky-500/20'
        };
      case 'Live':
      case 'Beta':
        return {
          dotColor: 'bg-emerald-400',
          textColor: isLight ? 'text-emerald-700' : 'text-emerald-300',
          bgColor: isLight ? 'bg-emerald-50 border-emerald-200' : 'bg-emerald-500/10 border-emerald-500/20'
        };
      default:
        return {
          dotColor: 'bg-slate-400',
          textColor: isLight ? 'text-slate-700' : 'text-slate-300',
          bgColor: isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-800 border-slate-700'
        };
    }
  };

  const getProductIcon = (icon?: string, name?: string) => {
    if (icon && !icon.includes('ð') && icon.trim() !== '') {
      return icon;
    }
    const n = (name || '').toLowerCase();
    if (n.includes('scan') || n.includes('vision') || n.includes('camera')) return '📸';
    if (n.includes('buy') || n.includes('trade') || n.includes('kiosk')) return '📋';
    if (n.includes('omni') || n.includes('sync') || n.includes('channel')) return '🔄';
    return '📦';
  };

  // Helper to render structured numbered items as clear, distinct cards
  const renderStructuredPoints = (text?: string, accent: 'rose' | 'amber' | 'sky' = 'rose') => {
    if (!text) {
      return <p className="text-xs text-slate-400 italic">No details defined yet.</p>;
    }

    const rawItems = text
      .split(/(?:^|\n+)(?=\d+\.\s)/)
      .map((s) => s.trim())
      .filter(Boolean);

    if (rawItems.length <= 1) {
      return (
        <p className={`text-xs leading-relaxed whitespace-pre-line ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>
          {text}
        </p>
      );
    }

    // Apply profile filtering if profileFilter is active
    const items = rawItems.filter((item) => {
      if (profileFilter === 'All') return true;
      const profileMatch = item.match(/\[(Profile[^\]]+)\]/i);
      if (!profileMatch) return true; // keep non-customer problem items (build/competitors)
      const pStr = profileMatch[1];
      const isP3 = pStr.includes('Profile 3') || pStr.includes('P3');
      const isP4 = pStr.includes('Profile 4') || pStr.includes('P4');
      if (profileFilter === 'Target') return isP3 || isP4;
      if (profileFilter === 'P3') return isP3;
      if (profileFilter === 'P4') return isP4;
      if (profileFilter === 'Later') return !isP3 && !isP4;
      return true;
    });

    if (items.length === 0) {
      return (
        <div className={`p-5 rounded-xl border border-dashed text-center space-y-1.5 ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-zinc-900/40 border-zinc-800'
        }`}>
          <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
            No problems match the "{profileFilter === 'Target' ? 'Core Target (P3 & P4)' : profileFilter === 'Later' ? 'Later Production (P1/P2/P5)' : profileFilter}" filter in this section.
          </p>
          <button
            onClick={() => setProfileFilter('All')}
            className="text-[11px] font-bold text-indigo-500 hover:underline"
          >
            Reset filter to show all ({rawItems.length}) problems
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {items.map((item, idx) => {
          const lines = item.trim().split('\n');
          const rawHeader = lines[0];
          const body = lines.slice(1).join('\n');

          const priorityMatch = rawHeader.match(/\[(Critical P0|High P1|Medium P2|Low P3)\]/i);
          const priority = priorityMatch ? priorityMatch[1] : null;

          const profileMatch = rawHeader.match(/\[(Profile[^\]]+)\]/i);
          const profileStr = profileMatch ? profileMatch[1] : null;

          const cleanHeader = rawHeader
            .replace(/\[(Critical P0|High P1|Medium P2|Low P3)\]\s*/gi, '')
            .replace(/\[(Profile[^\]]+)\]\s*/gi, '')
            .trim();

          const hasProfileTag = Boolean(profileStr);
          const isTargetP3orP4 = profileStr
            ? profileStr.includes('Profile 3') || profileStr.includes('Profile 4') || profileStr.includes('P3') || profileStr.includes('P4')
            : true;

          // 1. GRAYED OUT CARD FOR LATER PRODUCTION (P1, P2, P5 Storefronts)
          if (hasProfileTag && !isTargetP3orP4) {
            return (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border text-xs transition-all duration-200 ${
                  isLight
                    ? 'bg-slate-100/60 border-slate-200/90 text-slate-500 opacity-60 hover:opacity-100'
                    : 'bg-zinc-900/40 border-zinc-800/80 text-zinc-500 opacity-55 hover:opacity-100'
                }`}
              >
                <div className="font-semibold mb-1.5 flex items-center justify-between gap-2 flex-wrap text-slate-600 dark:text-zinc-400">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span>{cleanHeader}</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-md border bg-zinc-500/10 text-zinc-500 dark:text-zinc-400 border-zinc-500/20">
                      🏢 {profileStr} (Storefront)
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md border bg-zinc-500/10 text-zinc-500 dark:text-zinc-400 border-zinc-500/20">
                      ⏳ Later Production
                    </span>
                    {priority && (
                      <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md font-semibold border bg-zinc-500/10 text-zinc-500 dark:text-zinc-400 border-zinc-500/20">
                        {priority}
                      </span>
                    )}
                  </div>
                </div>
                {body && (
                  <p className={`text-xs leading-relaxed whitespace-pre-line font-normal ${
                    isLight ? 'text-slate-400' : 'text-zinc-500'
                  }`}>
                    {body}
                  </p>
                )}
              </div>
            );
          }

          // 2. GLORIFIED CARD (Profile 3 & Profile 4 Core Target Market)
          const isGlorifiedProblem = hasProfileTag && isTargetP3orP4;

          return (
            <div
              key={idx}
              className={`rounded-xl border text-xs transition-all duration-200 relative overflow-hidden ${
                isGlorifiedProblem
                  ? isLight
                    ? 'p-4 bg-white border-indigo-200/90 shadow-xs ring-1 ring-indigo-500/15 hover:border-indigo-400 text-slate-900'
                    : 'p-4 bg-gradient-to-br from-[#1d1d26] via-[#181820] to-[#131318] border-indigo-500/35 shadow-lg ring-1 ring-indigo-500/25 hover:border-indigo-400/60 text-zinc-100'
                  : accent === 'rose'
                  ? isLight
                    ? 'p-3.5 bg-rose-50/40 border-rose-200/60 text-slate-800'
                    : 'p-3.5 bg-rose-950/15 border-rose-500/25 text-zinc-200'
                  : accent === 'amber'
                  ? isLight
                    ? 'p-3.5 bg-amber-50/40 border-amber-200/60 text-slate-800'
                    : 'p-3.5 bg-amber-950/15 border-amber-500/25 text-zinc-200'
                  : isLight
                  ? 'p-3.5 bg-sky-50/40 border-sky-200/60 text-slate-800'
                  : 'p-3.5 bg-sky-950/15 border-sky-500/25 text-zinc-200'
              }`}
            >
              {isGlorifiedProblem && (
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 via-indigo-500 to-teal-400" />
              )}
              <div
                className={`font-bold mb-1.5 flex items-center justify-between gap-2 flex-wrap ${
                  isGlorifiedProblem
                    ? isLight
                      ? 'text-slate-900'
                      : 'text-white'
                    : accent === 'rose'
                    ? 'text-rose-600 dark:text-rose-400'
                    : accent === 'amber'
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-sky-600 dark:text-sky-400'
                }`}
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <span>{cleanHeader}</span>
                  {isGlorifiedProblem && (
                    <span className="text-[10px] px-2 py-0.5 rounded-md font-extrabold uppercase tracking-wide bg-gradient-to-r from-amber-500/20 to-rose-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 flex items-center gap-1 shadow-2xs">
                      ⭐ Target Launch
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {profileStr && (
                    <>
                      {profileStr.includes('3') && (
                        <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30 flex items-center gap-1 shadow-2xs">
                          🟣 Profile 3 (Online Warehouse)
                        </span>
                      )}
                      {profileStr.includes('4') && (
                        <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-500/30 flex items-center gap-1 shadow-2xs">
                          🟢 Profile 4 (Card Show / Live)
                        </span>
                      )}
                      {(profileStr.includes('1') || profileStr.includes('2')) && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded font-medium bg-slate-500/10 text-slate-500 dark:text-slate-400 border border-slate-500/20">
                          Also P1/P2
                        </span>
                      )}
                    </>
                  )}

                  {priority && (
                    <span
                      className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md font-bold border ${
                        priority.includes('P0')
                          ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30'
                          : priority.includes('P1')
                          ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
                          : priority.includes('P2')
                          ? 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30'
                          : 'bg-slate-500/15 text-slate-500 dark:text-slate-400 border-slate-500/30'
                      }`}
                    >
                      {priority}
                    </span>
                  )}
                </div>
              </div>
              {body && (
                <p className={`text-xs leading-relaxed whitespace-pre-line ${
                  isGlorifiedProblem
                    ? isLight
                      ? 'text-slate-700 font-normal'
                      : 'text-zinc-200 font-normal'
                    : isLight
                    ? 'text-slate-600 font-normal'
                    : 'text-zinc-300 font-normal'
                }`}>
                  {body}
                </p>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-slide-in">
      {/* 1. Header Banner */}
      <div
        className={`p-6 sm:p-8 rounded-2xl border transition-all duration-300 ${
          isLight
            ? 'bg-gradient-to-br from-white via-slate-50/50 to-indigo-50/20 border-slate-200/80 shadow-xs'
            : 'bg-gradient-to-br from-[#1c1c22] via-[#17171d] to-[#121216] border-[#292932] shadow-xl'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            {/* Top Tag & Status Pills */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-indigo-500" />
                <span>SaaS Portfolio</span>
              </span>
              <span className="text-xs text-slate-400 dark:text-zinc-500 font-medium">Customer Problems · Build Obstacles · Competitor Flaws</span>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Supabase Synced</span>
              </span>
            </div>

            <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              SaaS Products
            </h1>
            <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
              In-depth analysis of customer problems, technical engineering hurdles to build each product, and competitor architectural flaws. Solutions remain intentionally empty in discovery.
              Technical engineering stacks are managed on the dedicated <strong className={isLight ? 'text-slate-800' : 'text-zinc-200'}>Tech Stack Page</strong>.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#/dev/stack"
              className={`px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition duration-200 ${
                isLight
                  ? 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-xs hover:border-slate-300'
                  : 'border-zinc-700/80 bg-zinc-800/60 hover:bg-zinc-800 text-zinc-200 hover:border-zinc-600'
              }`}
            >
              <Cpu className="w-4 h-4 text-cyan-500" />
              <span>Tech Stack Architecture ➔</span>
            </a>
            <button
              onClick={() => setIsProductModalOpen(true)}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition duration-200 shadow-sm bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white"
            >
              <Plus className="w-4 h-4" />
              <span>Add SaaS Product</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Row */}
        <div
          className={`grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t ${
            isLight ? 'border-slate-200/80' : 'border-zinc-800/80'
          }`}
        >
          <div className="space-y-0.5">
            <div className="text-[11px] font-medium text-slate-400 dark:text-zinc-500 flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-indigo-500" />
              <span>Total Products</span>
            </div>
            <div className={`text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {saasProducts.length}
            </div>
          </div>

          <div className="space-y-0.5">
            <div className="text-[11px] font-medium text-slate-400 dark:text-zinc-500 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-amber-500" />
              <span>Target Segment</span>
            </div>
            <div className={`text-xs font-bold truncate ${isLight ? 'text-slate-800' : 'text-zinc-200'}`}>
              Mid to High Volume Sellers
            </div>
          </div>

          <div className="space-y-0.5">
            <div className="text-[11px] font-medium text-slate-400 dark:text-zinc-500 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
              <span>Pricing Model</span>
            </div>
            <div className={`text-xs font-bold truncate ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
              Flat SaaS · 0% GMV Cut
            </div>
          </div>

          <div className="space-y-0.5">
            <div className="text-[11px] font-medium text-slate-400 dark:text-zinc-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
              <span>Solution Status</span>
            </div>
            <div className={`text-xs font-bold truncate ${isLight ? 'text-slate-800' : 'text-zinc-200'}`}>
              In Discovery (Specs Left Empty)
            </div>
          </div>
        </div>
      </div>

      {/* 2. Controls Toolbar: Search, Filters & View Toggle */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Status Filters */}
        <div
          className={`flex items-center gap-1 p-1 rounded-xl border ${
            isLight ? 'bg-slate-100/80 border-slate-200' : 'bg-[#18181c] border-zinc-800'
          }`}
        >
          {(
            [
              { id: 'All', label: 'All Products', count: counts.all },
              { id: 'In Development', label: 'In Dev', count: counts.inDev },
              { id: 'In Discovery', label: 'In Discovery', count: counts.inDisc }
            ] as const
          ).map((tab) => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition duration-150 flex items-center gap-1.5 ${
                  isActive
                    ? isLight
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'bg-zinc-800 text-white shadow-xs font-semibold'
                    : isLight
                    ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive
                      ? isLight
                        ? 'bg-slate-100 text-slate-800'
                        : 'bg-zinc-700 text-zinc-200'
                      : isLight
                      ? 'bg-slate-200/70 text-slate-600'
                      : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* View Mode Toggle & Search Input */}
        <div className="flex items-center gap-3 flex-1 max-w-lg justify-end">
          {/* View Mode Switcher */}
          <div
            className={`hidden md:flex items-center p-1 rounded-xl border ${
              isLight ? 'bg-slate-100/80 border-slate-200' : 'bg-[#18181c] border-zinc-800'
            }`}
          >
            <button
              onClick={() => setViewMode('tabs')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                viewMode === 'tabs'
                  ? isLight
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'bg-zinc-800 text-white shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200'
              }`}
              title="Tabbed focus mode per card"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Tabbed</span>
            </button>
            <button
              onClick={() => setViewMode('all')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                viewMode === 'all'
                  ? isLight
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'bg-zinc-800 text-white shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200'
              }`}
              title="View analysis sections side-by-side in 3 columns"
            >
              <Columns className="w-3.5 h-3.5" />
              <span>3 Columns</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search problems, build challenges, competitors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-8 py-2 rounded-xl text-xs border transition outline-none ${
                isLight
                  ? 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10'
                  : 'bg-[#18181c] border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Profile Target Filter Banner */}
      <div
        className={`p-3.5 rounded-2xl border flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3.5 transition-all ${
          isLight
            ? 'bg-gradient-to-r from-purple-50/70 via-indigo-50/50 to-teal-50/70 border-indigo-200/80 shadow-2xs'
            : 'bg-gradient-to-r from-purple-950/25 via-indigo-950/20 to-teal-950/25 border-indigo-500/25 shadow-md'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <div className={`text-xs font-extrabold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              <span>Profile Problem Targeting Matrix</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                Core Focus: Profile 3 & Profile 4
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400">
              Glorified cards represent urgent friction for Profile 3 (Online Power Sellers) & Profile 4 (Card Show / Live Streamers); grayed cards represent later storefront production (P1, P2, P5).
            </p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 w-full lg:w-auto">
          {[
            { id: 'All', label: 'All Problems', count: problemCounts.all },
            { id: 'Target', label: '⭐ Core Target (P3 & P4)', count: problemCounts.target },
            { id: 'P3', label: '🟣 Profile 3 Only', count: problemCounts.p3 },
            { id: 'P4', label: '🟢 Profile 4 Only', count: problemCounts.p4 },
            { id: 'Later', label: '⏳ Later Production (P1/P2/P5)', count: problemCounts.later }
          ].map((tab) => {
            const isActive = profileFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setProfileFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 flex items-center gap-1.5 ${
                  isActive
                    ? tab.id === 'Target'
                      ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-xs font-bold'
                      : tab.id === 'P3'
                      ? 'bg-purple-600 text-white shadow-xs font-bold'
                      : tab.id === 'P4'
                      ? 'bg-teal-600 text-white shadow-xs font-bold'
                      : tab.id === 'Later'
                      ? 'bg-zinc-700 text-white shadow-xs font-bold'
                      : isLight
                      ? 'bg-slate-900 text-white shadow-xs font-bold'
                      : 'bg-zinc-100 text-slate-900 shadow-xs font-bold'
                    : isLight
                    ? 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 shadow-2xs'
                    : 'bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/60'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive
                      ? 'bg-black/25 text-white'
                      : isLight
                      ? 'bg-slate-100 text-slate-600'
                      : 'bg-zinc-900 text-zinc-400'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. SaaS Products Cards List */}
      <div className="space-y-6">
        {filteredProducts.length === 0 ? (
          <div
            className={`p-12 text-center rounded-2xl border border-dashed ${
              isLight ? 'bg-slate-50 border-slate-300' : 'bg-[#18181c] border-zinc-800'
            } space-y-4`}
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto text-xl">
              📦
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {searchQuery ? 'No matching products found' : 'No SaaS Products Added Yet'}
              </h3>
              <p className="text-xs text-slate-400 dark:text-zinc-500">
                {searchQuery
                  ? `No products match "${searchQuery}". Try a different search keyword.`
                  : 'Get started by creating your first SaaS product specification!'}
              </p>
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-indigo-500 font-semibold hover:underline"
              >
                Clear Search Query
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredProducts.map((prod) => {
              const badgeStyle = getStatusBadge(prod.status);
              const activeTab = activeCardTabs[prod.id] || 'problems';

              return (
                <div
                  key={prod.id}
                  className={`group relative p-6 sm:p-7 rounded-2xl border transition-all duration-300 flex flex-col justify-between hover:shadow-xl ${
                    isLight
                      ? 'bg-white border-slate-200/90 hover:border-indigo-300/80 hover:shadow-indigo-500/5'
                      : 'bg-[#1a1a20] border-[#292932] hover:border-indigo-500/40 hover:shadow-black/40'
                  }`}
                >
                  <div className="space-y-5">
                    {/* Header: Icon, Title, Status & Actions */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-14 h-14 rounded-2xl border flex items-center justify-center text-3xl shrink-0 transition-transform duration-300 group-hover:scale-105 shadow-xs ${
                            isLight
                              ? 'bg-gradient-to-br from-indigo-50 to-slate-50 border-slate-200'
                              : 'bg-gradient-to-br from-indigo-950/30 to-zinc-900 border-zinc-700/60'
                          }`}
                        >
                          {getProductIcon(prod.icon, prod.name)}
                        </div>

                        <div className="space-y-1">
                          <h3
                            className={`text-lg sm:text-xl font-bold flex items-center gap-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors ${
                              isLight ? 'text-slate-900' : 'text-white'
                            }`}
                          >
                            <span>{prod.name}</span>
                          </h3>
                          <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                            {prod.tagline}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0">
                        {/* Status Badge */}
                        <div
                          className={`px-3 py-1 rounded-full text-[11px] font-semibold border flex items-center gap-1.5 ${badgeStyle.bgColor} ${badgeStyle.textColor}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${badgeStyle.dotColor} animate-pulse`} />
                          <span>{prod.status}</span>
                        </div>

                        {/* Open Deep-Dive Link */}
                        <a
                          href={`#/product/${prod.id}`}
                          className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition ${
                            isLight
                              ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-indigo-600'
                              : 'bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700 hover:text-indigo-400'
                          }`}
                          title="Open dedicated product detail page"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                        </a>

                        {/* Delete button */}
                        <button
                          onClick={(e) => handleDeleteProduct(e, prod.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* VIEW MODE 1: TABBED FOCUS (DEFAULT) */}
                    {viewMode === 'tabs' ? (
                      <div className="space-y-4">
                        {/* Tab Selector Bar */}
                        <div
                          className={`flex flex-wrap items-center gap-1 p-1 rounded-xl border ${
                            isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#151518] border-zinc-800'
                          }`}
                        >
                          <button
                            onClick={() => setActiveCardTabs((prev) => ({ ...prev, [prod.id]: 'problems' }))}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                              activeTab === 'problems'
                                ? 'bg-rose-500 text-white shadow-xs'
                                : 'text-slate-500 hover:text-slate-900 dark:hover:text-zinc-200'
                            }`}
                          >
                            <Flame className="w-3.5 h-3.5" />
                            <span>1. Customer Problems & Friction</span>
                          </button>

                          <button
                            onClick={() => setActiveCardTabs((prev) => ({ ...prev, [prod.id]: 'build' }))}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                              activeTab === 'build'
                                ? 'bg-amber-500 text-white shadow-xs'
                                : 'text-slate-500 hover:text-slate-900 dark:hover:text-zinc-200'
                            }`}
                          >
                            <Wrench className="w-3.5 h-3.5" />
                            <span>2. Problems to Build This (Engineering)</span>
                          </button>

                          <button
                            onClick={() => setActiveCardTabs((prev) => ({ ...prev, [prod.id]: 'competitors' }))}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                              activeTab === 'competitors'
                                ? 'bg-sky-500 text-white shadow-xs'
                                : 'text-slate-500 hover:text-slate-900 dark:hover:text-zinc-200'
                            }`}
                          >
                            <Building2 className="w-3.5 h-3.5" />
                            <span>3. How Competitors Made This & Flaws</span>
                          </button>

                          <button
                            onClick={() => setActiveCardTabs((prev) => ({ ...prev, [prod.id]: 'solution' }))}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                              activeTab === 'solution'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'text-slate-500 hover:text-slate-900 dark:hover:text-zinc-200'
                            }`}
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>4. The Aeethod Solution (In Discovery)</span>
                          </button>
                        </div>

                        {/* Active Tab Content Area (Full Uncompressed Details) */}
                        <div className="pt-1">
                          {activeTab === 'problems' && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-rose-500 mb-1">
                                <span className="flex items-center gap-1.5">
                                  <Flame className="w-3.5 h-3.5" />
                                  <span>Customer Problems & Real-World Friction (Complete Breakdown)</span>
                                </span>
                              </div>
                              {renderStructuredPoints(prod.targetCustomerProblem, 'rose')}
                            </div>
                          )}

                          {activeTab === 'build' && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-amber-500 mb-1">
                                <span className="flex items-center gap-1.5">
                                  <Wrench className="w-3.5 h-3.5" />
                                  <span>Problems to Build This (Hard Engineering & Hardware Obstacles)</span>
                                </span>
                              </div>
                              {renderStructuredPoints(prod.problemsToBuild, 'amber')}
                            </div>
                          )}

                          {activeTab === 'competitors' && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-sky-500 mb-1">
                                <span className="flex items-center gap-1.5">
                                  <Building2 className="w-3.5 h-3.5" />
                                  <span>How Competitors Made This & Their Architectural Flaws</span>
                                </span>
                              </div>
                              {renderStructuredPoints(prod.competitorAnalysis, 'sky')}
                            </div>
                          )}

                          {activeTab === 'solution' && (
                            <div
                              className={`p-6 rounded-2xl border border-dashed text-center space-y-2.5 ${
                                isLight ? 'bg-slate-50/60 border-slate-200' : 'bg-zinc-900/30 border-zinc-800'
                              }`}
                            >
                              <Sparkles className="w-6 h-6 text-indigo-400 mx-auto opacity-70" />
                              <div className="space-y-1">
                                <h4 className={`text-xs font-bold ${isLight ? 'text-slate-800' : 'text-zinc-200'}`}>
                                  The Aeethod Solution Specification: Intentionally Empty
                                </h4>
                                <p className="text-xs text-slate-400 dark:text-zinc-500 italic max-w-lg mx-auto">
                                  As requested, the software solution specification is currently left in discovery and unfinalized. Focus remains on deeply scoping customer friction, build obstacles, and competitor pitfalls.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      /* VIEW MODE 2: ALL 3 PILLARS SIDE-BY-SIDE */
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                          {/* Column 1: Customer Problems */}
                          <div
                            className={`p-4 rounded-xl border space-y-3 transition-colors ${
                              isLight ? 'bg-rose-50/20 border-rose-200/50' : 'bg-rose-950/10 border-rose-500/20'
                            }`}
                          >
                            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-rose-500">
                              <Flame className="w-3.5 h-3.5 shrink-0" />
                              <span>1. Customer Problems & Friction</span>
                            </div>
                            <div className="max-h-96 overflow-y-auto pr-1">
                              {renderStructuredPoints(prod.targetCustomerProblem, 'rose')}
                            </div>
                          </div>

                          {/* Column 2: Problems To Build This */}
                          <div
                            className={`p-4 rounded-xl border space-y-3 transition-colors ${
                              isLight ? 'bg-amber-50/20 border-amber-200/50' : 'bg-amber-950/10 border-amber-500/20'
                            }`}
                          >
                            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                              <Wrench className="w-3.5 h-3.5 shrink-0" />
                              <span>2. Problems to Build This</span>
                            </div>
                            <div className="max-h-96 overflow-y-auto pr-1">
                              {renderStructuredPoints(prod.problemsToBuild, 'amber')}
                            </div>
                          </div>

                          {/* Column 3: How Competitors Made This */}
                          <div
                            className={`p-4 rounded-xl border space-y-3 transition-colors ${
                              isLight ? 'bg-sky-50/20 border-sky-200/50' : 'bg-sky-950/10 border-sky-500/20'
                            }`}
                          >
                            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                              <Building2 className="w-3.5 h-3.5 shrink-0" />
                              <span>3. How Competitors Made This</span>
                            </div>
                            <div className="max-h-96 overflow-y-auto pr-1">
                              {renderStructuredPoints(prod.competitorAnalysis, 'sky')}
                            </div>
                          </div>
                        </div>

                        {/* Empty Solution Banner */}
                        <div
                          className={`p-3.5 rounded-xl border border-dashed flex items-center justify-between gap-3 text-xs ${
                            isLight
                              ? 'bg-slate-50/50 border-slate-200/80 text-slate-500'
                              : 'bg-zinc-900/40 border-zinc-800 text-zinc-400'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                            <span className="font-medium text-slate-600 dark:text-zinc-300">
                              The Aeethod Solution: <span className="italic text-slate-400 dark:text-zinc-500">In discovery (specification intentionally left empty).</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Bottom: Metadata Badges & CTA */}
                  <div
                    className={`mt-6 pt-4 border-t flex flex-wrap items-center justify-between gap-3 text-xs ${
                      isLight ? 'border-slate-100' : 'border-zinc-800/80'
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[11px] font-medium border flex items-center gap-1.5 ${
                          isLight
                            ? 'bg-slate-100 text-slate-700 border-slate-200'
                            : 'bg-zinc-800/80 text-zinc-300 border-zinc-700/60'
                        }`}
                      >
                        <Users className="w-3 h-3 text-slate-400" />
                        <span>{prod.targetAudience || 'Mid to high volume seller'}</span>
                      </span>

                      {prod.pricingModel && (
                        <span
                          className={`px-2.5 py-1 rounded-md text-[11px] font-medium border flex items-center gap-1.5 ${
                            isLight
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-emerald-950/40 text-emerald-300 border-emerald-500/20'
                          }`}
                        >
                          <Tag className="w-3 h-3 text-emerald-500" />
                          <span>{prod.pricingModel}</span>
                        </span>
                      )}
                    </div>

                    <a
                      href={`#/product/${prod.id}`}
                      className="flex items-center gap-1.5 font-bold text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors ml-auto group/link"
                    >
                      <span>Open Dedicated Product Detail Workspace</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Modal: Add New SaaS Product */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div
            className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-7 rounded-2xl border shadow-2xl space-y-5 ${
              isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#1c1c22] border-zinc-700 text-white'
            }`}
          >
            <div className="flex items-center justify-between border-b pb-4 dark:border-zinc-800 border-slate-200">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
                  <Package className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold">Add New SaaS Product</h3>
                  <p className="text-xs text-slate-400 dark:text-zinc-500">
                    Define problem statements, technical build obstacles, and competitor approaches.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-1">
                  <label className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 block mb-1">
                    Icon Emoji
                  </label>
                  <input
                    type="text"
                    value={prodIcon}
                    onChange={(e) => setProdIcon(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl text-center text-lg border outline-none ${
                      isLight
                        ? 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500'
                        : 'bg-zinc-900 border-zinc-700 text-white focus:border-indigo-500'
                    }`}
                  />
                </div>
                <div className="col-span-3">
                  <label className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 block mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Automated Buylist Kiosk"
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border outline-none ${
                      isLight
                        ? 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500'
                        : 'bg-zinc-900 border-zinc-700 text-white focus:border-indigo-500'
                    }`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 block mb-1">
                  Product Value Tagline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Self-service counter trade-in valuation engine (0% GMV fee)"
                  value={prodTagline}
                  onChange={(e) => setProdTagline(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border outline-none ${
                    isLight
                      ? 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500'
                      : 'bg-zinc-900 border-zinc-700 text-white focus:border-indigo-500'
                  }`}
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-rose-500 block mb-1 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" /> Customer Problems & Friction *
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe the bottlenecks, labor burn, or financial margin tax merchants face..."
                  value={prodProblem}
                  onChange={(e) => setProdProblem(e.target.value)}
                  className={`w-full p-3 rounded-xl border outline-none leading-relaxed ${
                    isLight
                      ? 'bg-slate-50 border-slate-200 text-slate-900 focus:border-rose-400'
                      : 'bg-zinc-900 border-zinc-700 text-white focus:border-rose-400'
                  }`}
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-amber-500 block mb-1 flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5" /> Problems to Build This (Engineering Hurdles)
                </label>
                <textarea
                  rows={4}
                  placeholder="What makes this difficult to build? (e.g. CV glare, API limits, race conditions, hardware jams)..."
                  value={prodProblemsToBuild}
                  onChange={(e) => setProdProblemsToBuild(e.target.value)}
                  className={`w-full p-3 rounded-xl border outline-none leading-relaxed ${
                    isLight
                      ? 'bg-slate-50 border-slate-200 text-slate-900 focus:border-amber-400'
                      : 'bg-zinc-900 border-zinc-700 text-white focus:border-amber-400'
                  }`}
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-sky-500 block mb-1 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" /> How Competitors Made This & Their Flaws
                </label>
                <textarea
                  rows={4}
                  placeholder="How did competitors (BinderPOS, CardCastle, Decktradr) build this and why do they fail?..."
                  value={prodCompetitorAnalysis}
                  onChange={(e) => setProdCompetitorAnalysis(e.target.value)}
                  className={`w-full p-3 rounded-xl border outline-none leading-relaxed ${
                    isLight
                      ? 'bg-slate-50 border-slate-200 text-slate-900 focus:border-sky-400'
                      : 'bg-zinc-900 border-zinc-700 text-white focus:border-sky-400'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 block mb-1">
                    Target Customer Profile
                  </label>
                  <input
                    type="text"
                    value={prodAudience}
                    onChange={(e) => setProdAudience(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border outline-none ${
                      isLight
                        ? 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500'
                        : 'bg-zinc-900 border-zinc-700 text-white focus:border-indigo-500'
                    }`}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 block mb-1">
                    Pricing Model
                  </label>
                  <input
                    type="text"
                    value={prodPricing}
                    onChange={(e) => setProdPricing(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border outline-none ${
                      isLight
                        ? 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500'
                        : 'bg-zinc-900 border-zinc-700 text-white focus:border-indigo-500'
                    }`}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t dark:border-zinc-800 border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className={`px-4 py-2 rounded-xl border font-medium transition ${
                    isLight
                      ? 'border-slate-200 text-slate-600 hover:bg-slate-100'
                      : 'border-zinc-700 text-zinc-300 hover:bg-zinc-800'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md active:scale-95 transition"
                >
                  Save SaaS Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
