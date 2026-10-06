import React, { useState, useMemo } from 'react';
import {
  Package,
  Layers,
  Cpu,
  Plus,
  Search,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Flame,
  ShieldCheck,
  Save,
  ArrowRight,
  DollarSign,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { useStore } from '../store';
import { SaaSProductPillar } from '../data/devPlanningData';

export const DevArchitectureTrackerView: React.FC = () => {
  const { theme, db, create, update, remove } = useStore();
  const isLight = theme === 'light';

  // Navigation Sub-Tabs
  const [activeTab, setActiveTab] = useState<'overview' | 'problems-solutions'>('overview');

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
  const [prodAudience, setProdAudience] = useState('Mid to high volume seller');
  const [prodPricing, setProdPricing] = useState('$99 - $299/mo ($0 commission)');
  const [prodStatus, setProdStatus] = useState<'Concept' | 'In Discovery' | 'In Development' | 'Beta' | 'Live'>('In Discovery');

  // Inline editing state for Problem & Solution Breakdown
  const [editingProblemProdId, setEditingProblemProdId] = useState<string | null>(null);
  const [editProblemText, setEditProblemText] = useState('');
  const [editSolutionText, setEditSolutionText] = useState('');
  const [editAudienceText, setEditAudienceText] = useState('');
  const [editTaglineText, setEditTaglineText] = useState('');

  // Start inline editing of a product's problem/solution breakdown
  const startEditingProblem = (prod: SaaSProductPillar) => {
    setEditingProblemProdId(prod.id);
    setEditProblemText(prod.targetCustomerProblem || '');
    setEditSolutionText(prod.theAeethodSolution || '');
    setEditAudienceText(prod.targetAudience || '');
    setEditTaglineText(prod.tagline || '');
  };

  // Save updated customer problem & solution to store & Supabase
  const saveEditedProblem = (prodId: string) => {
    update('saas_products', prodId, {
      targetCustomerProblem: editProblemText.trim(),
      theAeethodSolution: editSolutionText.trim(),
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

    setActiveTab('overview');
  };

  const handleDeleteProduct = (id: string) => {
    remove('saas_products', id);
  };

  const filteredProducts = useMemo(() => {
    return saasProducts.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.targetCustomerProblem.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.theAeethodSolution.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSearch;
    });
  }, [saasProducts, searchQuery]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-slide-in">
      {/* 1. Header Banner */}
      <div
        className={`p-6 rounded-2xl border transition-all ${
          isLight
            ? 'bg-gradient-to-br from-indigo-50/70 via-white to-slate-50 border-indigo-100 shadow-sm'
            : 'bg-gradient-to-br from-indigo-950/20 via-[#1c1c1f] to-[#161618] border-indigo-500/20 shadow-xl'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wider uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Product Discovery
              </span>
              <span className="text-[11px] text-slate-500 font-mono">Customer Problems ➔ Solutions</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1 ml-auto lg:ml-2">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                <span>Supabase Database Synced</span>
              </span>
            </div>
            <h1 className={`text-2xl lg:text-3xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              SaaS Products
            </h1>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Define and explore each SaaS product, deep-dive into customer problems, friction bottlenecks, and high-impact solutions.
              Technical engineering stacks are managed on the separate <strong>Tech Stack Page</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#/dev/stack"
              className={`px-3.5 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition shadow-sm ${
                isLight
                  ? 'border-cyan-300 bg-cyan-50 hover:bg-cyan-100 text-cyan-800'
                  : 'border-cyan-500/30 bg-cyan-950/40 hover:bg-cyan-900/40 text-cyan-300'
              }`}
            >
              <Cpu className="w-4 h-4 text-cyan-500" />
              <span>Go to Tech Stack Page ➔</span>
            </a>
            <button
              onClick={() => setIsProductModalOpen(true)}
              className="btn-primary text-xs px-4 py-2.5 flex items-center gap-2 shadow-md bg-emerald-600 hover:bg-emerald-500 text-white"
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
            <Flame className="w-4 h-4 text-amber-400" />
            <span className="text-slate-400">Target Segment:</span>
            <span className="font-bold text-white">Mid to High Volume Sellers</span>
          </div>
        </div>
      </div>

      {/* SaaS Products Grid */}
      <div className="space-y-6">
        {saasProducts.length === 0 ? (
          <div
            className={`p-12 text-center rounded-2xl border border-dashed ${
              isLight ? 'bg-slate-50 border-slate-300' : 'bg-[#1b1b20] border-slate-700'
            } space-y-4`}
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto text-2xl">
              📦
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                No SaaS Products Added Yet
              </h3>
              <p className="text-xs text-slate-400">
                Click the button below to add your first SaaS product with its customer problem and solution specification!
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
                onClick={() => (window.location.hash = `/product/${prod.id}`)}
                className={`p-6 rounded-2xl border space-y-4 cursor-pointer transition-all hover:scale-[1.01] hover:shadow-lg ${
                  isLight
                    ? 'bg-white border-slate-200 shadow-sm hover:border-indigo-300'
                    : 'bg-[#1b1b20] border-[#2e2e34] hover:border-indigo-500/50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-3xl p-2.5 rounded-xl border ${
                        isLight ? 'bg-slate-100 border-slate-200 text-slate-800' : 'bg-slate-800/40 border-slate-700/40 text-white'
                      }`}
                    >
                      {prod.icon}
                    </span>
                    <div>
                      <h3
                        className={`text-base font-bold flex items-center gap-1.5 group-hover:text-indigo-400 ${
                          isLight ? 'text-slate-900' : 'text-white'
                        }`}
                      >
                        <span>{prod.name}</span>
                        <span className="text-xs text-indigo-400 opacity-60">➔</span>
                      </h3>
                      <p className={`text-xs font-mono ${isLight ? 'text-indigo-600 font-semibold' : 'text-indigo-400'}`}>
                        {prod.tagline}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                        isLight
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200 font-semibold'
                          : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                      }`}
                    >
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

                {/* Customer Problem Block */}
                <div
                  className={`p-3.5 rounded-xl border space-y-1.5 ${
                    isLight ? 'bg-rose-50/60 border-rose-200 text-slate-800' : 'bg-rose-950/20 border-rose-500/30 text-rose-200'
                  }`}
                >
                  <div className={`flex items-center gap-1.5 font-bold uppercase text-[10px] tracking-wider ${
                    isLight ? 'text-rose-700' : 'text-rose-400'
                  }`}>
                    <Flame className="w-3.5 h-3.5" />
                    <span>The Customer Problem:</span>
                  </div>
                  <p className="text-xs leading-relaxed line-clamp-3">
                    {prod.targetCustomerProblem || 'No problem statement defined yet.'}
                  </p>
                </div>

                {/* Solution Block */}
                <div
                  className={`p-3.5 rounded-xl border space-y-1.5 ${
                    isLight ? 'bg-emerald-50/60 border-emerald-200 text-slate-800' : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                  }`}
                >
                  <div className={`flex items-center gap-1.5 font-bold uppercase text-[10px] tracking-wider ${
                    isLight ? 'text-emerald-700' : 'text-emerald-400'
                  }`}>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>The Aeethod Solution:</span>
                  </div>
                  <p className="text-xs leading-relaxed line-clamp-2">
                    {prod.theAeethodSolution ? (
                      prod.theAeethodSolution
                    ) : (
                      <span className="text-slate-400 italic">Solution spec left blank / in discovery. Click to define.</span>
                    )}
                  </p>
                </div>

                {/* Card Footer */}
                <div
                  className={`pt-3 border-t flex items-center justify-between text-xs ${
                    isLight ? 'border-slate-200' : 'border-slate-800/60'
                  }`}
                >
                  <div className="font-mono text-slate-500">
                    Target: <span className={isLight ? 'text-slate-800 font-semibold' : 'text-slate-300'}>{prod.targetAudience}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <a
                      href={`#/product/${prod.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className={`text-xs font-semibold flex items-center gap-1 group ${
                        isLight ? 'text-indigo-600 hover:text-indigo-800' : 'text-indigo-400 hover:text-indigo-300'
                      }`}
                    >
                      <span>Open Product Details</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>


      {/* Modal: Add New SaaS Product */}
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
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Product Value Tagline</label>
                <input
                  type="text"
                  placeholder="e.g. Automated self-service counter trade-in & valuation engine (0% GMV fee)"
                  value={prodTagline}
                  onChange={(e) => setProdTagline(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] text-rose-400 uppercase font-bold block mb-1 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" /> The Customer Problem Being Solved:
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the exact friction, labor waste, bottleneck, or risk the merchant faces..."
                  value={prodProblem}
                  onChange={(e) => setProdProblem(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-emerald-400 uppercase font-bold block mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> The Aeethod Solution (Optional - Leave empty if in discovery):
                </label>
                <textarea
                  rows={3}
                  placeholder="Leave empty or describe how the product solves the customer problem..."
                  value={prodSolution}
                  onChange={(e) => setProdSolution(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Target Customer Profile</label>
                  <input
                    type="text"
                    value={prodAudience}
                    onChange={(e) => setProdAudience(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Pricing Model</label>
                  <input
                    type="text"
                    value={prodPricing}
                    onChange={(e) => setProdPricing(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary px-5 py-2 bg-emerald-600 hover:bg-emerald-500 font-bold text-white shadow-md"
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
