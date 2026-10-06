import React, { useState, useMemo } from 'react';
import {
  Package,
  Layers,
  Code2,
  Database,
  Server,
  Layout,
  Cpu,
  Plus,
  Search,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Flame,
  ShieldCheck,
  Save,
  ArrowRight
} from 'lucide-react';
import { useStore } from '../store';
import {
  SaaSProductPillar,
  ProductTechStack,
  DevStackLayer,
  DevStatus,
  DevPriority
} from '../data/devPlanningData';

export const DevArchitectureTrackerView: React.FC = () => {
  const { theme, db, create, update, remove } = useStore();
  const isLight = theme === 'light';

  // Navigation Sub-Tabs
  const [activeTab, setActiveTab] = useState<'saas-products' | 'stack-matrix'>('saas-products');

  // Products from persistent store / Supabase
  const saasProducts: SaaSProductPillar[] = db?.saas_products || [];

  // Filter / Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductFilter, setSelectedProductFilter] = useState<string>('All');

  // Modal: Add New SaaS Product Spec
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [prodName, setProdName] = useState('');
  const [prodTagline, setProdTagline] = useState('');
  const [prodIcon, setProdIcon] = useState('⚡');
  const [prodProblem, setProdProblem] = useState('');
  const [prodSolution, setProdSolution] = useState('');
  const [prodAudience, setProdAudience] = useState('Card Store Owners & TCG Sellers');
  const [prodPricing, setProdPricing] = useState('$99 - $299/mo ($0 commission)');
  const [prodStatus, setProdStatus] = useState<'Concept' | 'In Discovery' | 'In Development' | 'Beta' | 'Live'>('In Discovery');

  // Inline editing state for Customer Problem Breakdown
  const [editingProblemProdId, setEditingProblemProdId] = useState<string | null>(null);
  const [editProblemText, setEditProblemText] = useState('');
  const [editAudienceText, setEditAudienceText] = useState('');
  const [editTaglineText, setEditTaglineText] = useState('');

  // Start inline editing of a product's problem breakdown
  const startEditingProblem = (prod: SaaSProductPillar) => {
    setEditingProblemProdId(prod.id);
    setEditProblemText(prod.targetCustomerProblem || '');
    setEditAudienceText(prod.targetAudience || '');
    setEditTaglineText(prod.tagline || '');
  };

  // Save updated customer problem to store & Supabase
  const saveEditedProblem = (prodId: string) => {
    update('saas_products', prodId, {
      targetCustomerProblem: editProblemText.trim(),
      targetAudience: editAudienceText.trim(),
      tagline: editTaglineText.trim()
    });
    setEditingProblemProdId(null);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) return;

    create('saas_products', {
      name: prodName.trim(),
      tagline: prodTagline.trim() || 'High-impact TCG SaaS solution',
      icon: prodIcon.trim() || '📦',
      targetCustomerProblem: prodProblem.trim(),
      theAeethodSolution: prodSolution.trim(),
      targetAudience: prodAudience.trim() || 'Card stores & online merchants',
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

    setActiveTab('saas-products');
  };

  const handleDeleteProduct = (id: string) => {
    remove('saas_products', id);
  };

  const filteredProducts = useMemo(() => {
    return saasProducts.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.targetCustomerProblem.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.theAeethodSolution.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.techStack?.frontend || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchSearch;
    });
  }, [saasProducts, searchQuery]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-slide-in">
      {/* 1. Header Banner */}
      <div className={`p-6 rounded-2xl border transition-all ${
        isLight
          ? 'bg-gradient-to-br from-indigo-50/70 via-white to-slate-50 border-indigo-100 shadow-sm'
          : 'bg-gradient-to-br from-indigo-950/20 via-[#1c1c1f] to-[#161618] border-indigo-500/20 shadow-xl'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wider uppercase bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                Technical Architecture
              </span>
              <span className="text-[11px] text-slate-500 font-mono">UI/UX ➔ Frontend ➔ Backend ➔ Database</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1 ml-auto lg:ml-2">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                <span>Supabase Database Synced</span>
              </span>
            </div>
            <h1 className={`text-2xl lg:text-3xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              SaaS Products & Technical Stacks Hub
            </h1>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Review the technical stacks (UI/UX, Frontend, Backend, Database, and DevOps) engineered for each SaaS product.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#/dev/stack"
              className="px-3.5 py-2.5 rounded-xl border border-cyan-500/30 bg-cyan-950/40 hover:bg-cyan-900/40 text-cyan-300 text-xs font-semibold flex items-center gap-2 transition shadow-sm"
            >
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Full Tech Stacks Editor ➔</span>
            </a>
            <button
              onClick={() => setIsProductModalOpen(true)}
              className="btn-primary text-xs px-4 py-2.5 flex items-center gap-2 shadow-md bg-emerald-600 hover:bg-emerald-500"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add SaaS Product</span>
            </button>
          </div>
        </div>

        {/* Quick Summary Pill Bar */}
        <div className="flex items-center gap-4 mt-6 pt-5 border-t border-slate-800/60 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-400">Total SaaS Products:</span>
            <span className="font-bold text-white">{saasProducts.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-400">Active Tech Stacks:</span>
            <span className="font-bold text-white">{saasProducts.length} Configured</span>
          </div>
        </div>
      </div>

      {/* 2. Sub-Navigation Tabs */}
      <div className={`flex items-center gap-1.5 border-b pb-3 text-xs overflow-x-auto ${isLight ? 'border-slate-200' : 'border-[#2e2e34]'}`}>
        <button
          onClick={() => setActiveTab('saas-products')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition shrink-0 ${
            activeTab === 'saas-products'
              ? (isLight ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-950 font-bold')
              : (isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-[#25252a]')
          }`}
        >
          <Code2 className="w-4 h-4 text-cyan-400" />
          <span>1. Technical Stacks Overview ({saasProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('stack-matrix')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition shrink-0 ${
            activeTab === 'stack-matrix'
              ? (isLight ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-950 font-bold')
              : (isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-[#25252a]')
          }`}
        >
          <Flame className="w-4 h-4 text-amber-400" />
          <span>2. Customer Problems & Pain Points ({saasProducts.length})</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: SAAS PRODUCTS & PROBLEM SOLVING                                    */}
      {/* ========================================================================= */}
      {activeTab === 'saas-products' && (
        <div className="space-y-6">
          {saasProducts.length === 0 ? (
            <div className={`p-12 text-center rounded-2xl border border-dashed ${
              isLight ? 'bg-slate-50 border-slate-300' : 'bg-[#1b1b20] border-slate-700'
            } space-y-4`}>
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto text-2xl">
                📦
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  No SaaS Products Added Yet
                </h3>
                <p className="text-xs text-slate-400">
                  Click the button below to upload your first SaaS product. It will automatically create a technical stack workspace on the Technical Stacks page where you can define UI/UX, Frontend, Backend, and Database specs!
                </p>
              </div>
              <button
                onClick={() => setIsProductModalOpen(true)}
                className="btn-primary text-xs px-5 py-2.5 inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Your First SaaS Product</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredProducts.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => window.location.hash = `/product/${prod.id}`}
                  className={`p-6 rounded-2xl border space-y-4 cursor-pointer transition-all hover:scale-[1.01] hover:shadow-lg ${
                    isLight
                      ? 'bg-white border-slate-200 shadow-sm hover:border-indigo-300'
                      : 'bg-[#1b1b20] border-[#2e2e34] hover:border-indigo-500/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className={`text-3xl p-2.5 rounded-xl border ${
                        isLight ? 'bg-slate-100 border-slate-200 text-slate-800' : 'bg-slate-800/40 border-slate-700/40 text-white'
                      }`}>
                        {prod.icon}
                      </span>
                      <div>
                        <h3 className={`text-base font-bold flex items-center gap-1.5 group-hover:text-indigo-400 ${
                          isLight ? 'text-slate-900' : 'text-white'
                        }`}>
                          <span>{prod.name}</span>
                          <span className="text-xs text-indigo-400 opacity-60">➔</span>
                        </h3>
                        <p className={`text-xs font-mono ${isLight ? 'text-indigo-600 font-semibold' : 'text-indigo-400'}`}>{prod.tagline}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                        isLight
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200 font-semibold'
                          : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                      }`}>
                        {prod.status}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProduct(prod.id);
                        }}
                        className="p-1 text-slate-400 hover:text-rose-500 transition"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Technical Stack Grid for the Product */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                    <div className={`p-2.5 rounded-xl border space-y-1 ${
                      isLight ? 'bg-purple-50/70 border-purple-200 text-slate-800' : 'bg-purple-950/20 border-purple-500/25 text-slate-300'
                    }`}>
                      <div className={`flex items-center gap-1.5 font-bold uppercase text-[9px] tracking-wider ${
                        isLight ? 'text-purple-700' : 'text-purple-400'
                      }`}>
                        <Layout className="w-3 h-3" />
                        <span>UI / UX Experience</span>
                      </div>
                      <p className="leading-snug line-clamp-2">
                        {prod.techStack?.uiUx || 'Modern dark glassmorphism, rapid action bar, responsive kiosk/mobile layouts'}
                      </p>
                    </div>

                    <div className={`p-2.5 rounded-xl border space-y-1 ${
                      isLight ? 'bg-cyan-50/70 border-cyan-200 text-slate-800' : 'bg-cyan-950/20 border-cyan-500/25 text-slate-300'
                    }`}>
                      <div className={`flex items-center gap-1.5 font-bold uppercase text-[9px] tracking-wider ${
                        isLight ? 'text-cyan-700' : 'text-cyan-400'
                      }`}>
                        <Code2 className="w-3 h-3" />
                        <span>Frontend Stack</span>
                      </div>
                      <p className="leading-snug line-clamp-2">
                        {prod.techStack?.frontend || 'React 18, TypeScript, Tailwind CSS, Vite, HTML5 Canvas'}
                      </p>
                    </div>

                    <div className={`p-2.5 rounded-xl border space-y-1 ${
                      isLight ? 'bg-amber-50/70 border-amber-200 text-slate-800' : 'bg-amber-950/20 border-amber-500/25 text-slate-300'
                    }`}>
                      <div className={`flex items-center gap-1.5 font-bold uppercase text-[9px] tracking-wider ${
                        isLight ? 'text-amber-700' : 'text-amber-400'
                      }`}>
                        <Server className="w-3 h-3" />
                        <span>Backend & APIs</span>
                      </div>
                      <p className="leading-snug line-clamp-2">
                        {prod.techStack?.backend || 'Node.js, Edge Functions, WebSocket Live Engine, GraphQL REST Gateway'}
                      </p>
                    </div>

                    <div className={`p-2.5 rounded-xl border space-y-1 ${
                      isLight ? 'bg-emerald-50/70 border-emerald-200 text-slate-800' : 'bg-emerald-950/20 border-emerald-500/25 text-slate-300'
                    }`}>
                      <div className={`flex items-center gap-1.5 font-bold uppercase text-[9px] tracking-wider ${
                        isLight ? 'text-emerald-700' : 'text-emerald-400'
                      }`}>
                        <Database className="w-3 h-3" />
                        <span>Database & Cache</span>
                      </div>
                      <p className="leading-snug line-clamp-2">
                        {prod.techStack?.database || 'Supabase PostgreSQL, RLS Policies, Redis Realtime Cache'}
                      </p>
                    </div>
                  </div>

                  <div className={`pt-3 border-t flex items-center justify-between text-xs ${
                    isLight ? 'border-slate-200' : 'border-slate-800/60'
                  }`}>
                    <div className="font-mono text-slate-500">
                      DevOps: <span className={isLight ? 'text-indigo-600 font-semibold' : 'text-indigo-400 font-semibold'}>
                        {prod.techStack?.devOps || 'Vercel + Supabase + GitHub CI'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <a
                        href={`#/product/${prod.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className={`text-xs font-semibold flex items-center gap-1 group ${
                          isLight ? 'text-indigo-600 hover:text-indigo-800' : 'text-indigo-400 hover:text-indigo-300'
                        }`}
                      >
                        <span>Product Details</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </a>

                      <a
                        href="#/dev/stack"
                        onClick={(e) => e.stopPropagation()}
                        className={`text-xs font-semibold flex items-center gap-1 group ${
                          isLight ? 'text-cyan-700 hover:text-cyan-800' : 'text-cyan-400 hover:text-cyan-300'
                        }`}
                      >
                        <span>Tech Stack</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: TECHNICAL STACKS MATRIX (FROM UI/UX TO BACKEND & DATABASE)          */}
      {/* ========================================================================= */}
      {activeTab === 'stack-matrix' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <span className={`text-[11px] font-semibold uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Product Filter:</span>
              <button
                onClick={() => setSelectedProductFilter('All')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition shrink-0 ${
                  selectedProductFilter === 'All'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : isLight
                      ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                All Products ({saasProducts.length})
              </button>
              {saasProducts.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProductFilter(p.id)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition shrink-0 flex items-center gap-1.5 ${
                    selectedProductFilter === p.id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : isLight
                        ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <span>{p.icon}</span>
                  <span>{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          {saasProducts.length === 0 ? (
            <div className={`p-12 text-center rounded-2xl border border-dashed ${
              isLight ? 'bg-slate-50 border-slate-300' : 'bg-[#1b1b20] border-slate-700'
            } space-y-3`}>
              <p className="text-xs text-slate-400">
                No SaaS products have been created yet. Add a product in Tab 1 to define its technical stack.
              </p>
              <button
                onClick={() => {
                  setActiveTab('saas-products');
                  setIsProductModalOpen(true);
                }}
                className="btn-primary text-xs px-4 py-2 inline-flex items-center gap-2 text-white"
              >
                <Plus className="w-4 h-4" />
                <span>Add SaaS Product</span>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {saasProducts
                .filter((p) => selectedProductFilter === 'All' || p.id === selectedProductFilter)
                .map((prod) => {
                  const isEditing = editingProblemProdId === prod.id;

                  return (
                    <div
                      key={prod.id}
                      className={`rounded-2xl border overflow-hidden transition-all ${
                        isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#1b1b20] border-[#2e2e34]'
                      }`}
                    >
                      {/* Product Header Row */}
                      <div className={`p-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isLight ? 'bg-slate-50/80 border-slate-200' : 'bg-slate-900/40 border-slate-800'
                      }`}>
                        <div className="flex items-center gap-3">
                          <span className={`text-2xl p-2 rounded-xl border ${
                            isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-800 border-slate-700 text-white'
                          }`}>
                            {prod.icon}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <a
                                href={`#/product/${prod.id}`}
                                className={`text-base font-bold hover:underline flex items-center gap-1.5 ${
                                  isLight ? 'text-slate-900 hover:text-indigo-600' : 'text-white hover:text-indigo-400'
                                }`}
                              >
                                <span>{prod.name}</span>
                              </a>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                                isLight
                                  ? 'bg-amber-50 text-amber-800 border-amber-300 font-semibold'
                                  : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                              }`}>
                                {prod.status}
                              </span>
                            </div>
                            {isEditing ? (
                              <input
                                type="text"
                                value={editTaglineText}
                                onChange={(e) => setEditTaglineText(e.target.value)}
                                className={`text-xs px-2 py-1 mt-1 rounded border font-mono w-full sm:w-96 ${
                                  isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
                                }`}
                                placeholder="Sub-headline / value proposition"
                              />
                            ) : (
                              <p className={`text-xs font-mono mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                                {prod.tagline}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={`#/product/${prod.id}`}
                            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition ${
                              isLight
                                ? 'border-indigo-300 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 shadow-xs'
                                : 'border-indigo-500/40 bg-indigo-950/40 hover:bg-indigo-900/40 text-indigo-300'
                            }`}
                            title="Open dedicated Product Detail Page"
                          >
                            <span>Open Details ➔</span>
                          </a>

                          <a
                            href="#/dev/stack"
                            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition ${
                              isLight
                                ? 'border-cyan-300 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 shadow-xs'
                                : 'border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-cyan-400'
                            }`}
                            title="View technical stack on Tech Stack Page"
                          >
                            <Cpu className="w-3.5 h-3.5" />
                            <span>Tech Stacks Page ➔</span>
                          </a>

                          {isEditing ? (
                            <button
                              onClick={() => saveEditedProblem(prod.id)}
                              className="btn-primary text-xs px-3.5 py-1.5 flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white"
                            >
                              <Save className="w-3.5 h-3.5" />
                              <span>Save Problem</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => startEditingProblem(prod)}
                              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition ${
                                isLight
                                  ? 'border-slate-300 bg-white hover:bg-slate-100 text-slate-700 shadow-xs'
                                  : 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200'
                              }`}
                            >
                              <Edit3 className={`w-3.5 h-3.5 ${isLight ? 'text-amber-600' : 'text-amber-400'}`} />
                              <span>Edit Problem Details</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Customer Problem & Friction Breakdown Layout */}
                      <div className="p-6 space-y-6">
                        {/* Target Audience Profile */}
                        <div className={`flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border ${
                          isLight
                            ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                            : 'bg-amber-50/5 border-amber-500/20'
                        }`}>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] uppercase font-bold tracking-wider font-mono px-2 py-0.5 rounded border ${
                              isLight
                                ? 'text-amber-800 bg-amber-100 border-amber-300'
                                : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                            }`}>
                              Target Customer Profile
                            </span>
                            {isEditing ? (
                              <input
                                type="text"
                                value={editAudienceText}
                                onChange={(e) => setEditAudienceText(e.target.value)}
                                className={`text-xs px-2 py-1 rounded border font-mono w-72 ${
                                  isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
                                }`}
                              />
                            ) : (
                              <span className={`text-xs font-semibold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                                {prod.targetAudience}
                              </span>
                            )}
                          </div>
                          <div className={`text-[11px] font-mono ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                            Category: <span className="text-emerald-600 dark:text-emerald-400 font-bold">{prod.pricingModel}</span>
                          </div>
                        </div>

                        {/* Core Problem Statement */}
                        <div className={`p-5 rounded-xl border space-y-2 ${
                          isLight
                            ? 'bg-rose-50/60 border-rose-200 text-slate-800'
                            : 'bg-rose-500/5 border-rose-500/20 text-slate-200'
                        }`}>
                          <div className={`flex items-center gap-2 font-bold uppercase text-[11px] tracking-wider ${
                            isLight ? 'text-rose-700' : 'text-rose-400'
                          }`}>
                            <Flame className="w-4 h-4" />
                            <span>Core Customer Problem Statement</span>
                          </div>
                          {isEditing ? (
                            <textarea
                              rows={4}
                              value={editProblemText}
                              onChange={(e) => setEditProblemText(e.target.value)}
                              placeholder="Describe the exact friction, labor waste, bottleneck, or risk the merchant faces..."
                              className={`w-full p-3 rounded-lg border text-xs leading-relaxed ${
                                isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
                              }`}
                            />
                          ) : (
                            <p className={`text-sm font-medium leading-relaxed ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                              {prod.targetCustomerProblem || 'No problem statement defined yet. Click edit to add.'}
                            </p>
                          )}
                        </div>

                        {/* Friction & Bottleneck Dimensions Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                          {/* Friction 1: Operational Waste */}
                          <div className={`p-4 rounded-xl border space-y-2 ${
                            isLight
                              ? 'bg-slate-50 border-slate-200 text-slate-700'
                              : 'bg-slate-900/60 border-slate-800 text-slate-400'
                          }`}>
                            <div className={`flex items-center gap-2 font-bold uppercase text-[10px] tracking-wider ${
                              isLight ? 'text-amber-700' : 'text-amber-400'
                            }`}>
                              <AlertCircle className="w-3.5 h-3.5" />
                              <span>1. Operational Bottleneck</span>
                            </div>
                            <p className="leading-relaxed text-[11px]">
                              {prod.id === 'prod-scanning-cards' || prod.id === 'prod_scanner'
                                ? 'Manual card identification, sorting, and typing creates massive intake bottlenecks, condition grading discrepancies, and high labor costs for high-volume inventory.'
                                : prod.id === 'prod-buylist' || prod.id === 'prod_buylist'
                                ? 'In-person trade-ins take 15–30 minutes per customer, causing counter congestion, lost walk-in sales, pricing disputes, and incumbent software charging 2.5% GMV commission taxes.'
                                : prod.id === 'prod-omnichannel-sync' || prod.id === 'prod_omnichannel'
                                ? 'Selling singles simultaneously across in-store POS, Shopify webstore, eBay, and TCGplayer causes inventory desync, out-of-stock double sales, and harsh marketplace penalties.'
                                : 'Manual repetitive effort, labor cost, and human input latency.'}
                            </p>
                          </div>

                          {/* Friction 2: Financial & Margin Loss */}
                          <div className={`p-4 rounded-xl border space-y-2 ${
                            isLight
                              ? 'bg-slate-50 border-slate-200 text-slate-700'
                              : 'bg-slate-900/60 border-slate-800 text-slate-400'
                          }`}>
                            <div className={`flex items-center gap-2 font-bold uppercase text-[10px] tracking-wider ${
                              isLight ? 'text-emerald-700' : 'text-emerald-400'
                            }`}>
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>2. Margin & Financial Tax</span>
                            </div>
                            <p className="leading-relaxed text-[11px]">
                              {prod.id === 'prod-scanning-cards' || prod.id === 'prod_scanner'
                                ? 'High labor cost ($15–$25/hr) spent on repetitive intake rather than selling or community events.'
                                : prod.id === 'prod-buylist' || prod.id === 'prod_buylist'
                                ? 'Incumbents charge up to 2.5% GMV platform tax on every single card trade-in transaction.'
                                : prod.id === 'prod-omnichannel-sync' || prod.id === 'prod_omnichannel'
                                ? 'Out-of-stock cancellations result in marketplace penalties, negative reviews, and seller account bans.'
                                : 'High commission fees or revenue leakage due to unoptimized systems.'}
                            </p>
                          </div>

                          {/* Friction 3: Seller Frustration */}
                          <div className={`p-4 rounded-xl border space-y-2 ${
                            isLight
                              ? 'bg-slate-50 border-slate-200 text-slate-700'
                              : 'bg-slate-900/60 border-slate-800 text-slate-400'
                          }`}>
                            <div className={`flex items-center gap-2 font-bold uppercase text-[10px] tracking-wider ${
                              isLight ? 'text-cyan-700' : 'text-cyan-400'
                            }`}>
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>3. Merchant Impact</span>
                            </div>
                            <p className="leading-relaxed text-[11px]">
                              {prod.id === 'prod-scanning-cards' || prod.id === 'prod_scanner'
                                ? 'Catalog backlogs pile up in binders while card market prices fluctuate daily.'
                                : prod.id === 'prod-buylist' || prod.id === 'prod_buylist'
                                ? 'Customers leave the store without trading because of counter delays and inconsistent grading pricing.'
                                : prod.id === 'prod-omnichannel-sync' || prod.id === 'prod_omnichannel'
                                ? 'Seller forced to manually log in to 3 different portals multiple times per day to update inventory counts.'
                                : 'Inconsistent seller workflow hindering scale across multiple sales channels.'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}

      {/* Modal: Add New SaaS Product & Initial Stack */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-4 bg-[#1b1b20] border border-emerald-500/40 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Add New SaaS Product</h3>
              <button onClick={() => setIsProductModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-1">
                  <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Emoji Icon</label>
                  <input
                    type="text"
                    value={prodIcon}
                    onChange={(e) => setProdIcon(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-center text-lg"
                  />
                </div>
                <div className="col-span-3">
                  <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Product Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Automated Buylist & Counter Kiosk"
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">One-Line Value Tagline</label>
                <input
                  type="text"
                  placeholder="e.g. Singles intake in seconds with 0 manual typing"
                  value={prodTagline}
                  onChange={(e) => setProdTagline(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">What Customer Problem Does It Solve?</label>
                <textarea
                  rows={2}
                  value={prodProblem}
                  onChange={(e) => setProdProblem(e.target.value)}
                  placeholder="Describe the exact friction, clerk labor waste, or margin loss store owners face..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">How Will We Solve It? (Optional)</label>
                <textarea
                  rows={2}
                  value={prodSolution}
                  onChange={(e) => setProdSolution(e.target.value)}
                  placeholder="Describe how our software feature solves this pain point (or leave blank)..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary px-5 py-2 bg-emerald-600 hover:bg-emerald-500">
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
