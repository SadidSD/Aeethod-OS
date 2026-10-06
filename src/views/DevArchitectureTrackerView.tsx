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

  // Inline editing state for Technical Stacks on the Tech Stack page
  const [editingStackProdId, setEditingStackProdId] = useState<string | null>(null);
  const [editUiUx, setEditUiUx] = useState('');
  const [editFrontend, setEditFrontend] = useState('');
  const [editBackend, setEditBackend] = useState('');
  const [editDatabase, setEditDatabase] = useState('');
  const [editDevOps, setEditDevOps] = useState('');

  // Start inline editing of a product's tech stack
  const startEditingStack = (prod: SaaSProductPillar) => {
    setEditingStackProdId(prod.id);
    setEditUiUx(prod.techStack?.uiUx || '');
    setEditFrontend(prod.techStack?.frontend || '');
    setEditBackend(prod.techStack?.backend || '');
    setEditDatabase(prod.techStack?.database || '');
    setEditDevOps(prod.techStack?.devOps || '');
  };

  // Save updated tech stack to store & Supabase
  const saveEditedStack = (prodId: string) => {
    update('saas_products', prodId, {
      techStack: {
        uiUx: editUiUx.trim(),
        frontend: editFrontend.trim(),
        backend: editBackend.trim(),
        database: editDatabase.trim(),
        devOps: editDevOps.trim()
      }
    });
    setEditingStackProdId(null);
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
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wider uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Product & Tech Architecture
              </span>
              <span className="text-[11px] text-slate-500 font-mono">From Customer Problem ➔ Full Technical Stack</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1 ml-auto lg:ml-2">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                <span>Supabase Database Synced</span>
              </span>
            </div>
            <h1 className={`text-2xl lg:text-3xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              SaaS Products & Technical Stacks Hub
            </h1>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Define what SaaS products you are building, the exact customer problem they solve, and automatically manage their
              complete full-stack technical specs (<strong>UI/UX, Frontend, Backend, Database, and DevOps</strong>).
            </p>
          </div>

          <div>
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
            <span className="text-slate-400">Active Technical Stacks:</span>
            <span className="font-bold text-white">{saasProducts.length} Configured</span>
          </div>
        </div>
      </div>

      {/* 2. Sub-Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-[#2e2e34] pb-3 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('saas-products')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition shrink-0 ${
            activeTab === 'saas-products'
              ? (isLight ? 'bg-slate-900 text-white' : 'bg-white text-slate-950 font-bold')
              : 'text-slate-400 hover:text-white hover:bg-[#25252a]'
          }`}
        >
          <Package className="w-4 h-4 text-emerald-400" />
          <span>1. SaaS Products & Problem Solving ({saasProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('stack-matrix')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition shrink-0 ${
            activeTab === 'stack-matrix'
              ? (isLight ? 'bg-slate-900 text-white' : 'bg-white text-slate-950 font-bold')
              : 'text-slate-400 hover:text-white hover:bg-[#25252a]'
          }`}
        >
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>2. Full Technical Stacks (UI/UX ➔ Backend ➔ DB) ({saasProducts.length})</span>
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
                className="btn-primary text-xs px-5 py-2.5 inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500"
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
                  className={`p-6 rounded-2xl border space-y-4 ${
                    isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#1b1b20] border-[#2e2e34]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/40">
                        {prod.icon}
                      </span>
                      <div>
                        <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                          {prod.name}
                        </h3>
                        <p className="text-xs text-indigo-400 font-mono">{prod.tagline}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {prod.status}
                      </span>
                      <button
                        onClick={() => handleDeleteProduct(prod.id)}
                        className="p-1 text-slate-500 hover:text-rose-400 transition"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-rose-400 block flex items-center gap-1.5">
                        <Flame className="w-3 h-3" /> The Customer Problem:
                      </span>
                      <p className="text-rose-200/90 leading-relaxed">{prod.targetCustomerProblem}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-emerald-400 block flex items-center gap-1.5">
                        <ShieldCheck className="w-3 h-3" /> How We Solve It:
                      </span>
                      <p className="text-emerald-200/90 leading-relaxed">{prod.theAeethodSolution}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                    <div className="font-mono text-slate-400">
                      Pricing: <span className="text-emerald-400 font-bold">{prod.pricingModel}</span>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedProductFilter(prod.id);
                        setActiveTab('stack-matrix');
                      }}
                      className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group"
                    >
                      <span>View Technical Stacks</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
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
              <span className="text-[11px] text-slate-500 font-semibold uppercase">Product Filter:</span>
              <button
                onClick={() => setSelectedProductFilter('All')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition shrink-0 ${
                  selectedProductFilter === 'All'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                All Products ({saasProducts.length})
              </button>
              {saasProducts.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProductFilter(p.id)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition shrink-0 flex items-center gap-1 ${
                    selectedProductFilter === p.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
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
                className="btn-primary text-xs px-4 py-2 inline-flex items-center gap-2"
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
                  const isEditing = editingStackProdId === prod.id;

                  return (
                    <div
                      key={prod.id}
                      className={`rounded-2xl border overflow-hidden transition-all ${
                        isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#1b1b20] border-[#2e2e34]'
                      }`}
                    >
                      {/* Product Header Row */}
                      <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/40">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl p-2 rounded-xl bg-slate-800 border border-slate-700">
                            {prod.icon}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                                {prod.name}
                              </h3>
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                {prod.status}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 font-mono mt-0.5">{prod.tagline}</p>
                          </div>
                        </div>

                        <div>
                          {isEditing ? (
                            <button
                              onClick={() => saveEditedStack(prod.id)}
                              className="btn-primary text-xs px-3.5 py-1.5 flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500"
                            >
                              <Save className="w-3.5 h-3.5" />
                              <span>Save Stack Updates</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => startEditingStack(prod)}
                              className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
                              <span>Edit Full Technical Stack</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Technical Stacks Grid: UI/UX, Frontend, Backend, Database, DevOps */}
                      <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                        {/* 1. UI/UX Layer */}
                        <div className="p-4 rounded-xl bg-slate-900/60 border border-purple-500/30 space-y-2">
                          <div className="flex items-center gap-2 text-purple-400 font-bold uppercase text-[10px] tracking-wider">
                            <Layout className="w-4 h-4" />
                            <span>1. UI / UX Experience</span>
                          </div>
                          {isEditing ? (
                            <textarea
                              rows={4}
                              value={editUiUx}
                              onChange={(e) => setEditUiUx(e.target.value)}
                              placeholder="Describe UI layout, design tokens, touch pads, theme..."
                              className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono text-[11px]"
                            />
                          ) : (
                            <p className="text-slate-300 leading-relaxed font-mono text-[11px]">
                              {prod.techStack?.uiUx || 'No UI/UX spec defined yet. Click edit to add.'}
                            </p>
                          )}
                        </div>

                        {/* 2. Frontend Layer */}
                        <div className="p-4 rounded-xl bg-slate-900/60 border border-cyan-500/30 space-y-2">
                          <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase text-[10px] tracking-wider">
                            <Code2 className="w-4 h-4" />
                            <span>2. Frontend Stack</span>
                          </div>
                          {isEditing ? (
                            <textarea
                              rows={4}
                              value={editFrontend}
                              onChange={(e) => setEditFrontend(e.target.value)}
                              placeholder="React 18, HTML5 Canvas, Tailwind v4, Zustand store..."
                              className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono text-[11px]"
                            />
                          ) : (
                            <p className="text-slate-300 leading-relaxed font-mono text-[11px]">
                              {prod.techStack?.frontend || 'No Frontend spec defined yet. Click edit to add.'}
                            </p>
                          )}
                        </div>

                        {/* 3. Backend Layer */}
                        <div className="p-4 rounded-xl bg-slate-900/60 border border-amber-500/30 space-y-2">
                          <div className="flex items-center gap-2 text-amber-400 font-bold uppercase text-[10px] tracking-wider">
                            <Server className="w-4 h-4" />
                            <span>3. Backend & APIs</span>
                          </div>
                          {isEditing ? (
                            <textarea
                              rows={4}
                              value={editBackend}
                              onChange={(e) => setEditBackend(e.target.value)}
                              placeholder="Node.js, Express, Edge Functions, GraphQL endpoints..."
                              className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono text-[11px]"
                            />
                          ) : (
                            <p className="text-slate-300 leading-relaxed font-mono text-[11px]">
                              {prod.techStack?.backend || 'No Backend spec defined yet. Click edit to add.'}
                            </p>
                          )}
                        </div>

                        {/* 4. Database Layer */}
                        <div className="p-4 rounded-xl bg-slate-900/60 border border-emerald-500/30 space-y-2">
                          <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase text-[10px] tracking-wider">
                            <Database className="w-4 h-4" />
                            <span>4. Database & Tables</span>
                          </div>
                          {isEditing ? (
                            <textarea
                              rows={4}
                              value={editDatabase}
                              onChange={(e) => setEditDatabase(e.target.value)}
                              placeholder="PostgreSQL, Supabase tables, RLS policies, Redis cache..."
                              className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono text-[11px]"
                            />
                          ) : (
                            <p className="text-slate-300 leading-relaxed font-mono text-[11px]">
                              {prod.techStack?.database || 'No Database spec defined yet. Click edit to add.'}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Optional DevOps bar */}
                      <div className="px-5 pb-5 pt-0">
                        <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono text-slate-400">
                          <div className="flex items-center gap-2">
                            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                            <span className="font-bold text-slate-300">DevOps & Hosting:</span>
                            {isEditing ? (
                              <input
                                type="text"
                                value={editDevOps}
                                onChange={(e) => setEditDevOps(e.target.value)}
                                placeholder="Vercel + Supabase + GitHub Actions CI"
                                className="px-2 py-1 rounded bg-slate-950 border border-slate-700 text-white text-xs w-72"
                              />
                            ) : (
                              <span>{prod.techStack?.devOps || 'Vercel static deploy + Supabase Cloud'}</span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500 font-sans">
                            Problem being solved: {prod.targetCustomerProblem.slice(0, 50)}...
                          </span>
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
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">How Will We Solve It?</label>
                <textarea
                  rows={2}
                  value={prodSolution}
                  onChange={(e) => setProdSolution(e.target.value)}
                  placeholder="Describe how our software feature solves this pain point..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  required
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
