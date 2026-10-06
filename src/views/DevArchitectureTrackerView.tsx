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
  ChevronRight
} from 'lucide-react';
import { useStore } from '../store';
import { SaaSProductPillar } from '../data/devPlanningData';

export const DevArchitectureTrackerView: React.FC = () => {
  const { theme, db, create, remove } = useStore();
  const isLight = theme === 'light';

  // Products from store / Supabase
  const saasProducts: SaaSProductPillar[] = db?.saas_products || [];

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'In Development' | 'In Discovery' | 'Live'>('All');

  // Modal: Add New SaaS Product
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [prodName, setProdName] = useState('');
  const [prodTagline, setProdTagline] = useState('');
  const [prodIcon, setProdIcon] = useState('📦');
  const [prodProblem, setProdProblem] = useState('');
  const [prodSolution, setProdSolution] = useState('');
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
      theAeethodSolution: prodSolution.trim(),
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

  const filteredProducts = useMemo(() => {
    return saasProducts.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.targetCustomerProblem && p.targetCustomerProblem.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.theAeethodSolution && p.theAeethodSolution.toLowerCase().includes(searchQuery.toLowerCase()));

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
              <span className="text-xs text-slate-400 dark:text-zinc-500 font-medium">Customer Problems ➔ Solutions</span>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Supabase Synced</span>
              </span>
            </div>

            <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              SaaS Products
            </h1>
            <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
              Explore our core software products, deep-dive into customer problems, friction bottlenecks, and high-impact solutions.
              Technical engineering stacks are maintained on the dedicated <strong className={isLight ? 'text-slate-800' : 'text-zinc-200'}>Tech Stack Page</strong>.
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
              <span>Total SaaS Products</span>
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
              <span>Monetization Model</span>
            </div>
            <div className={`text-xs font-bold truncate ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
              0% GMV Fee · Flat SaaS
            </div>
          </div>

          <div className="space-y-0.5">
            <div className="text-[11px] font-medium text-slate-400 dark:text-zinc-500 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-cyan-500" />
              <span>Active Pipeline</span>
            </div>
            <div className={`text-xs font-bold truncate ${isLight ? 'text-slate-800' : 'text-zinc-200'}`}>
              {counts.inDev} Dev · {counts.inDisc} Discovery
            </div>
          </div>
        </div>
      </div>

      {/* 2. Controls Toolbar: Search & Filter Tabs */}
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
              { id: 'In Discovery', label: 'In Discovery', count: counts.inDisc },
              { id: 'Live', label: 'Live', count: counts.live }
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

        {/* Search Input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products, problems, solutions..."
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

      {/* 3. SaaS Products Grid */}
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
                  ? `No products match "${searchQuery}". Try a different keyword.`
                  : 'Get started by creating your first SaaS product specification!'}
              </p>
            </div>
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-indigo-500 font-semibold hover:underline"
              >
                Clear Search Query
              </button>
            ) : (
              <button
                onClick={() => setIsProductModalOpen(true)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white inline-flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Your First SaaS Product</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filteredProducts.map((prod) => {
              const badgeStyle = getStatusBadge(prod.status);

              return (
                <div
                  key={prod.id}
                  onClick={() => (window.location.hash = `/product/${prod.id}`)}
                  className={`group relative p-6 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl ${
                    isLight
                      ? 'bg-white border-slate-200/90 hover:border-indigo-300/80 hover:shadow-indigo-500/5'
                      : 'bg-[#1a1a20] border-[#292932] hover:border-indigo-500/40 hover:shadow-black/40'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Header: Icon, Title, Status & Actions */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3.5">
                        <div
                          className={`w-12 h-12 rounded-xl border flex items-center justify-center text-2xl shrink-0 transition-transform duration-300 group-hover:scale-105 shadow-xs ${
                            isLight
                              ? 'bg-gradient-to-br from-indigo-50 to-slate-50 border-slate-200'
                              : 'bg-gradient-to-br from-indigo-950/30 to-zinc-900 border-zinc-700/60'
                          }`}
                        >
                          {getProductIcon(prod.icon, prod.name)}
                        </div>

                        <div className="space-y-0.5">
                          <h3
                            className={`text-base font-bold flex items-center gap-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors ${
                              isLight ? 'text-slate-900' : 'text-white'
                            }`}
                          >
                            <span>{prod.name}</span>
                            <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-indigo-500" />
                          </h3>
                          <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                            {prod.tagline}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                        {/* Status Badge */}
                        <div
                          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border flex items-center gap-1.5 ${badgeStyle.bgColor} ${badgeStyle.textColor}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${badgeStyle.dotColor} animate-pulse`} />
                          <span>{prod.status}</span>
                        </div>

                        {/* Delete button */}
                        <button
                          onClick={(e) => handleDeleteProduct(e, prod.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition"
                          title="Delete product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Customer Problem Section (Smooth Notion-Style Insight Container) */}
                    <div
                      className={`p-4 rounded-xl border space-y-1.5 transition-colors ${
                        isLight
                          ? 'bg-slate-50/70 border-slate-200/70'
                          : 'bg-[#151518] border-zinc-800/80'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-rose-500">
                        <Flame className="w-3.5 h-3.5 shrink-0" />
                        <span>The Customer Problem</span>
                      </div>
                      <p
                        className={`text-xs leading-relaxed line-clamp-3 ${
                          isLight ? 'text-slate-700' : 'text-zinc-300'
                        }`}
                      >
                        {prod.targetCustomerProblem || 'No problem statement defined yet.'}
                      </p>
                    </div>

                    {/* The Aeethod Solution Section */}
                    {prod.theAeethodSolution ? (
                      <div
                        className={`p-4 rounded-xl border space-y-1.5 transition-colors ${
                          isLight
                            ? 'bg-emerald-50/40 border-emerald-200/60'
                            : 'bg-emerald-950/20 border-emerald-500/20'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                          <span>The Aeethod Solution</span>
                        </div>
                        <p
                          className={`text-xs leading-relaxed line-clamp-2 ${
                            isLight ? 'text-slate-800' : 'text-emerald-100'
                          }`}
                        >
                          {prod.theAeethodSolution}
                        </p>
                      </div>
                    ) : (
                      <div
                        className={`p-3.5 rounded-xl border border-dashed flex items-center justify-between gap-3 text-xs ${
                          isLight
                            ? 'bg-slate-50/40 border-slate-200/80 text-slate-500'
                            : 'bg-zinc-900/40 border-zinc-800 text-zinc-400'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                          <span className="italic">Solution in discovery · Click to define specification</span>
                        </div>
                        <span className="text-[11px] font-semibold text-indigo-500 group-hover:underline shrink-0">
                          + Define
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Bottom: Metadata Badges & CTA */}
                  <div
                    className={`mt-4 pt-4 border-t flex flex-wrap items-center justify-between gap-3 text-xs ${
                      isLight ? 'border-slate-100' : 'border-zinc-800/80'
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[11px] font-medium border flex items-center gap-1 ${
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
                          className={`px-2 py-0.5 rounded-md text-[11px] font-medium border flex items-center gap-1 ${
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

                    <div className="flex items-center gap-1.5 font-semibold text-xs text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors ml-auto">
                      <span>Open Product Details</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
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
            className={`w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-7 rounded-2xl border shadow-2xl space-y-5 ${
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
                    Define problem statement, target customer, and value proposition.
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
                  <Flame className="w-3.5 h-3.5" /> Customer Problem Being Solved *
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the exact bottleneck, labor cost, or friction the seller currently experiences..."
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
                <label className="text-[11px] font-semibold text-emerald-500 block mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> The Aeethod Solution (Optional - Leave blank if in discovery)
                </label>
                <textarea
                  rows={3}
                  placeholder="Leave blank or describe how our software uniquely solves this problem..."
                  value={prodSolution}
                  onChange={(e) => setProdSolution(e.target.value)}
                  className={`w-full p-3 rounded-xl border outline-none leading-relaxed ${
                    isLight
                      ? 'bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-500'
                      : 'bg-zinc-900 border-zinc-700 text-white focus:border-emerald-500'
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
