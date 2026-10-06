import React, { useState } from 'react';
import {
  ArrowLeft,
  Flame,
  ShieldCheck,
  Cpu,
  CheckCircle2,
  Save,
  Edit3,
  DollarSign,
  Sparkles,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Target,
  BarChart3
} from 'lucide-react';
import { useStore } from '../store';
import { SaaSProductPillar } from '../data/devPlanningData';

interface ProductDetailViewProps {
  productId: string;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({ productId }) => {
  const { theme, db, update } = useStore();
  const isLight = theme === 'light';

  const saasProducts: SaaSProductPillar[] = db?.saas_products || [];
  const product = saasProducts.find((p) => p.id === productId);

  // Editing state for Product Details, Problems, and Solutions
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(product?.name || '');
  const [tagline, setTagline] = useState(product?.tagline || '');
  const [icon, setIcon] = useState(product?.icon || '📦');
  const [problem, setProblem] = useState(product?.targetCustomerProblem || '');
  const [solution, setSolution] = useState(product?.theAeethodSolution || '');
  const [targetAudience, setTargetAudience] = useState(product?.targetAudience || '');
  const [pricingModel, setPricingModel] = useState(product?.pricingModel || '');
  const [status, setStatus] = useState(product?.status || 'In Discovery');

  if (!product) {
    return (
      <div className="p-12 text-center space-y-4 max-w-xl mx-auto">
        <div className="text-4xl">🔍</div>
        <h2 className={`text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
          Product Not Found
        </h2>
        <p className="text-xs text-slate-400">
          We could not find the SaaS product with ID <code className="font-mono text-cyan-400">{productId}</code>.
        </p>
        <a
          href="#/dev/products"
          className="btn-primary text-xs px-4 py-2 inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to SaaS Products</span>
        </a>
      </div>
    );
  }

  const handleSave = () => {
    update('saas_products', product.id, {
      name: name.trim(),
      tagline: tagline.trim(),
      icon: icon.trim(),
      targetCustomerProblem: problem.trim(),
      theAeethodSolution: solution.trim(),
      targetAudience: targetAudience.trim(),
      pricingModel: pricingModel.trim(),
      status: status
    });
    setIsEditing(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-slide-in">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex items-center justify-between gap-4">
        <a
          href="#/dev/products"
          className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg border transition ${
            isLight
              ? 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700 shadow-xs'
              : 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200'
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>← Back to SaaS Products</span>
        </a>

        <div className="flex items-center gap-3">
          <a
            href="#/dev/stack"
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition ${
              isLight
                ? 'border-cyan-200 bg-cyan-50 hover:bg-cyan-100 text-cyan-800'
                : 'border-cyan-500/30 bg-cyan-950/40 hover:bg-cyan-900/40 text-cyan-300'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>View Technical Stack on Tech Stack Page ➔</span>
          </a>

          {isEditing ? (
            <button
              onClick={handleSave}
              className="btn-primary text-xs px-4 py-1.5 flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setName(product.name);
                setTagline(product.tagline);
                setIcon(product.icon);
                setProblem(product.targetCustomerProblem);
                setSolution(product.theAeethodSolution);
                setTargetAudience(product.targetAudience || '');
                setPricingModel(product.pricingModel || '');
                setStatus(product.status);
                setIsEditing(true);
              }}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition ${
                isLight
                  ? 'border-slate-300 bg-white hover:bg-slate-100 text-slate-800 shadow-xs'
                  : 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-500" />
              <span>Edit Product Details</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Hero Header */}
      <div
        className={`p-6 sm:p-8 rounded-2xl border transition-all ${
          isLight
            ? 'bg-gradient-to-br from-white via-slate-50 to-indigo-50/30 border-slate-200 shadow-sm'
            : 'bg-gradient-to-br from-[#1c1c22] via-[#17171d] to-[#121216] border-[#2e2e38]'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <span
              className={`text-4xl p-3.5 rounded-2xl border ${
                isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-800/80 border-slate-700 text-white'
              }`}
            >
              {isEditing ? (
                <input
                  type="text"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="w-12 text-center bg-transparent border-b border-indigo-400"
                />
              ) : (
                product.icon
              )}
            </span>
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                {isEditing ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`text-2xl font-black px-2 py-0.5 rounded border ${
                      isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
                    }`}
                  />
                ) : (
                  <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {product.name}
                  </h1>
                )}

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono border font-bold ${
                    isLight
                      ? 'bg-amber-50 text-amber-800 border-amber-300'
                      : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                  }`}
                >
                  {product.status}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  <span>Synced in Supabase</span>
                </span>
              </div>

              {isEditing ? (
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className={`text-xs font-mono w-full px-2 py-1 rounded border mt-1 ${
                    isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
                  }`}
                  placeholder="Tagline / positioning statement"
                />
              ) : (
                <p className={`text-xs font-mono ${isLight ? 'text-indigo-600 font-semibold' : 'text-indigo-400'}`}>
                  {product.tagline}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-2 text-xs font-mono">
            <div className={`px-3 py-1.5 rounded-lg border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
              <span className="text-slate-400">Target Audience: </span>
              {isEditing ? (
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-700 text-white text-xs font-bold"
                />
              ) : (
                <span className={`font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}>
                  {product.targetAudience || 'Mid to high volume seller'}
                </span>
              )}
            </div>
            <div className={`px-3 py-1.5 rounded-lg border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
              <span className="text-slate-400">Pricing / Monetization: </span>
              {isEditing ? (
                <input
                  type="text"
                  value={pricingModel}
                  onChange={(e) => setPricingModel(e.target.value)}
                  className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-700 text-white text-xs font-bold"
                />
              ) : (
                <span className="font-bold text-emerald-500">
                  {product.pricingModel || 'SaaS Subscription'}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Problems & Pain Points vs Aeethod Solution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Customer Problem */}
        <div
          className={`p-6 rounded-2xl border space-y-4 ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#1b1b20] border-[#2e2e34]'
          }`}
        >
          <div className="flex items-center gap-2 pb-3 border-b border-rose-500/20 text-rose-500 font-bold uppercase text-xs tracking-wider">
            <Flame className="w-4 h-4 text-rose-500" />
            <span>The Customer Problem & Friction</span>
          </div>

          {isEditing ? (
            <textarea
              rows={5}
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              className={`w-full p-3 rounded-xl border text-xs leading-relaxed font-sans ${
                isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
              }`}
            />
          ) : (
            <p className={`text-sm leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-200'}`}>
              {product.targetCustomerProblem || 'No problem defined yet.'}
            </p>
          )}

          {/* Friction breakdown pillars */}
          <div className="pt-2 space-y-2 text-xs">
            <div className={`p-3.5 rounded-xl border flex items-start gap-2.5 ${
              isLight ? 'bg-rose-50/50 border-rose-200 text-slate-700' : 'bg-rose-950/20 border-rose-500/20 text-slate-300'
            }`}>
              <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-rose-500 text-[11px] uppercase">1. Operational Bottleneck</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {product.id === 'prod-scanning-cards'
                    ? 'Manual card identification, sorting, and typing creates massive intake bottlenecks and high labor costs.'
                    : product.id === 'prod-buylist'
                    ? 'In-store trade-ins take 15–30 minutes per customer, causing counter congestion and lost walk-in sales.'
                    : product.id === 'prod-omnichannel-sync'
                    ? 'Selling singles simultaneously across in-store POS, Shopify webstore, eBay, and TCGplayer causes inventory desync and out-of-stock double sales.'
                    : 'Manual repetitive effort, labor cost, and human input latency.'}
                </span>
              </div>
            </div>

            <div className={`p-3.5 rounded-xl border flex items-start gap-2.5 ${
              isLight ? 'bg-amber-50/50 border-amber-200 text-slate-700' : 'bg-amber-950/20 border-amber-500/20 text-slate-300'
            }`}>
              <DollarSign className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-amber-500 text-[11px] uppercase">2. Margin Tax & Financial Waste</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {product.id === 'prod-scanning-cards'
                    ? 'High labor cost ($15–$25/hr) spent on repetitive intake rather than selling or high-margin activities.'
                    : product.id === 'prod-buylist'
                    ? 'Incumbent software charging up to 2.5% GMV platform tax on every single card trade-in transaction.'
                    : product.id === 'prod-omnichannel-sync'
                    ? 'Out-of-stock cancellations result in marketplace penalties, negative seller ratings, and account suspensions.'
                    : 'High commission fees or revenue leakage due to unoptimized systems.'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Aeethod Solution Spec */}
        <div
          className={`p-6 rounded-2xl border space-y-4 ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#1b1b20] border-[#2e2e34]'
          }`}
        >
          <div className="flex items-center gap-2 pb-3 border-b border-emerald-500/20 text-emerald-500 font-bold uppercase text-xs tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>The Aeethod Solution Architecture</span>
          </div>

          {isEditing ? (
            <textarea
              rows={5}
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              placeholder="Leave blank or describe the high-impact solution..."
              className={`w-full p-3 rounded-xl border text-xs leading-relaxed font-sans ${
                isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
              }`}
            />
          ) : product.theAeethodSolution ? (
            <p className={`text-sm leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-200'}`}>
              {product.theAeethodSolution}
            </p>
          ) : (
            <div className={`p-6 rounded-xl border border-dashed text-center space-y-2 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/40 border-slate-800'
            }`}>
              <Sparkles className="w-6 h-6 text-emerald-500 mx-auto opacity-70" />
              <p className="text-xs text-slate-400 italic">
                Solution specification intentionally left blank / in discovery.
              </p>
              <button
                onClick={() => setIsEditing(true)}
                className="text-xs text-emerald-500 font-semibold hover:underline"
              >
                + Define Solution Spec Now
              </button>
            </div>
          )}

          <div className="pt-2">
            <div className={`p-3.5 rounded-xl border flex items-start gap-2.5 ${
              isLight ? 'bg-emerald-50/50 border-emerald-200 text-slate-700' : 'bg-emerald-950/20 border-emerald-500/20 text-slate-300'
            }`}>
              <TrendingUp className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-emerald-500 text-[11px] uppercase">Competitive Advantage</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Flat monthly pricing with 0% GMV commission, millisecond synchronization, and local-first execution.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick link banner to Technical Stack Page */}
      <div
        className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
          isLight ? 'bg-cyan-50/70 border-cyan-200 text-slate-700' : 'bg-cyan-950/20 border-cyan-500/30 text-slate-300'
        }`}
      >
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-500" />
          <span>
            Looking for this product's engineering architecture (UI/UX, Frontend, Backend, Database)?
          </span>
        </div>

        <a
          href="#/dev/stack"
          className="font-bold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 shrink-0"
        >
          <span>Open Full Tech Stack Page</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
