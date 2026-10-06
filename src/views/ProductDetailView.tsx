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
  BarChart3,
  Tag,
  Users,
  X,
  Wrench,
  Building2,
  Layers
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

  // Editing state for Product Details, Problems, Build Obstacles, Competitors, and Solutions
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(product?.name || '');
  const [tagline, setTagline] = useState(product?.tagline || '');
  const [icon, setIcon] = useState(product?.icon || '📦');
  const [problem, setProblem] = useState(product?.targetCustomerProblem || '');
  const [problemsToBuild, setProblemsToBuild] = useState(product?.problemsToBuild || '');
  const [competitorAnalysis, setCompetitorAnalysis] = useState(product?.competitorAnalysis || '');
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
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white inline-flex items-center gap-2 shadow-sm"
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
      problemsToBuild: problemsToBuild.trim(),
      competitorAnalysis: competitorAnalysis.trim(),
      theAeethodSolution: solution.trim(), // Left empty as requested
      targetAudience: targetAudience.trim(),
      pricingModel: pricingModel.trim(),
      status: status
    });
    setIsEditing(false);
  };

  const getStatusBadge = (st: string) => {
    switch (st) {
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

  const getProductIcon = (ic?: string, nm?: string) => {
    if (ic && !ic.includes('ð') && ic.trim() !== '') {
      return ic;
    }
    const n = (nm || '').toLowerCase();
    if (n.includes('scan') || n.includes('vision') || n.includes('camera')) return '📸';
    if (n.includes('buy') || n.includes('trade') || n.includes('kiosk')) return '📋';
    if (n.includes('omni') || n.includes('sync') || n.includes('channel')) return '🔄';
    return '📦';
  };

  const badgeStyle = getStatusBadge(product.status);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-slide-in">
      {/* 1. Top Breadcrumb & Action Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <a
          href="#/dev/products"
          className={`flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-xl border transition ${
            isLight
              ? 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-xs'
              : 'border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-200'
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to SaaS Products</span>
        </a>

        <div className="flex items-center gap-3">
          <a
            href="#/dev/stack"
            className={`flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl border transition ${
              isLight
                ? 'border-cyan-200 bg-cyan-50/70 hover:bg-cyan-100 text-cyan-800'
                : 'border-cyan-500/30 bg-cyan-950/40 hover:bg-cyan-900/40 text-cyan-300'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-cyan-500" />
            <span>View Technical Stack ➔</span>
          </a>

          {isEditing ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border ${
                  isLight ? 'border-slate-200 text-slate-600 hover:bg-slate-100' : 'border-zinc-700 text-zinc-300 hover:bg-zinc-800'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setName(product.name);
                setTagline(product.tagline);
                setIcon(product.icon);
                setProblem(product.targetCustomerProblem || '');
                setProblemsToBuild(product.problemsToBuild || '');
                setCompetitorAnalysis(product.competitorAnalysis || '');
                setSolution(product.theAeethodSolution || '');
                setTargetAudience(product.targetAudience || '');
                setPricingModel(product.pricingModel || '');
                setStatus(product.status);
                setIsEditing(true);
              }}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl border transition ${
                isLight
                  ? 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800 shadow-xs'
                  : 'border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-200'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5 text-indigo-500" />
              <span>Edit Details</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Hero Header Banner */}
      <div
        className={`p-6 sm:p-8 rounded-2xl border transition-all duration-300 ${
          isLight
            ? 'bg-gradient-to-br from-white via-slate-50/50 to-indigo-50/20 border-slate-200/80 shadow-xs'
            : 'bg-gradient-to-br from-[#1c1c22] via-[#17171d] to-[#121216] border-[#292932] shadow-xl'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <span
              className={`text-3xl sm:text-4xl p-3 sm:p-4 rounded-2xl border shrink-0 ${
                isLight
                  ? 'bg-gradient-to-br from-indigo-50 to-slate-50 border-slate-200 text-slate-900'
                  : 'bg-gradient-to-br from-indigo-950/40 to-zinc-900 border-zinc-700/60 text-white'
              }`}
            >
              {isEditing ? (
                <input
                  type="text"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="w-12 text-center bg-transparent border-b border-indigo-400 outline-none"
                />
              ) : (
                getProductIcon(product.icon, product.name)
              )}
            </span>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                {isEditing ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`text-xl sm:text-2xl font-bold px-2.5 py-1 rounded-xl border outline-none ${
                      isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-zinc-900 border-zinc-700 text-white'
                    }`}
                  />
                ) : (
                  <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {product.name}
                  </h1>
                )}

                <div
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border flex items-center gap-1.5 ${badgeStyle.bgColor} ${badgeStyle.textColor}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${badgeStyle.dotColor} animate-pulse`} />
                  <span>{product.status}</span>
                </div>

                <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  <span>Synced in Supabase</span>
                </span>
              </div>

              {isEditing ? (
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className={`text-xs w-full px-2.5 py-1.5 rounded-xl border mt-1 outline-none ${
                    isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-zinc-900 border-zinc-700 text-white'
                  }`}
                  placeholder="Tagline / positioning statement"
                />
              ) : (
                <p className={`text-xs sm:text-sm font-medium ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
                  {product.tagline}
                </p>
              )}
            </div>
          </div>

          {/* Audience & Pricing Badges */}
          <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-2 text-xs">
            <div
              className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 ${
                isLight ? 'bg-white border-slate-200' : 'bg-zinc-900/60 border-zinc-800'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400">Target: </span>
              {isEditing ? (
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className={`px-1.5 py-0.5 rounded text-xs border outline-none ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-zinc-950 border-zinc-700 text-white'
                  }`}
                />
              ) : (
                <span className={`font-semibold ${isLight ? 'text-slate-800' : 'text-zinc-200'}`}>
                  {product.targetAudience || 'Mid to high volume seller'}
                </span>
              )}
            </div>

            <div
              className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 ${
                isLight ? 'bg-white border-slate-200' : 'bg-zinc-900/60 border-zinc-800'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-slate-400">Pricing: </span>
              {isEditing ? (
                <input
                  type="text"
                  value={pricingModel}
                  onChange={(e) => setPricingModel(e.target.value)}
                  className={`px-1.5 py-0.5 rounded text-xs border outline-none ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-zinc-950 border-zinc-700 text-white'
                  }`}
                />
              ) : (
                <span className={`font-semibold ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
                  {product.pricingModel || '$99 - $299/mo'}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Deep Dive Section 1: Detailed Customer Problems */}
      <div
        className={`p-6 sm:p-7 rounded-2xl border space-y-4 ${
          isLight ? 'bg-white border-slate-200/90 shadow-xs' : 'bg-[#1a1a20] border-[#292932]'
        }`}
      >
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-zinc-800 text-rose-500 font-bold uppercase text-xs tracking-wider">
          <Flame className="w-4 h-4 text-rose-500" />
          <span>1. Detailed Customer Problems & Operational Friction</span>
        </div>

        {isEditing ? (
          <textarea
            rows={6}
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            className={`w-full p-3 rounded-xl border text-xs leading-relaxed outline-none font-sans ${
              isLight ? 'bg-white border-slate-300 text-slate-900 focus:border-rose-400' : 'bg-zinc-900 border-zinc-700 text-white focus:border-rose-400'
            }`}
          />
        ) : (
          <p className={`text-xs sm:text-sm leading-relaxed whitespace-pre-line ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>
            {product.targetCustomerProblem || 'No problem statement defined yet.'}
          </p>
        )}

        {/* Friction Breakdown Micro-cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 ${
              isLight ? 'bg-rose-50/40 border-rose-200/60' : 'bg-rose-950/20 border-rose-500/20'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block text-rose-500 text-[11px] uppercase tracking-wide">
                Operational Waste & Bottlenecks
              </span>
              <span className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
                {product.id === 'prod-scanning-cards'
                  ? 'Manual card identification, sorting, and typing creates massive intake backlogs, grading subjectivity, and high labor costs.'
                  : product.id === 'prod-buylist'
                  ? 'In-store trade-ins take 20–45 minutes per customer, causing counter congestion, lost walk-in sales, and pricing disputes.'
                  : product.id === 'prod-omnichannel-sync'
                  ? 'Selling singles simultaneously across in-store POS, Shopify webstore, eBay, and TCGplayer causes inventory desync and out-of-stock double sales.'
                  : 'Manual repetitive effort, labor cost, and human input latency.'}
              </span>
            </div>
          </div>

          <div
            className={`p-4 rounded-xl border flex items-start gap-3 ${
              isLight ? 'bg-amber-50/40 border-amber-200/60' : 'bg-amber-950/20 border-amber-500/20'
            }`}
          >
            <DollarSign className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block text-amber-500 text-[11px] uppercase tracking-wide">
                Margin Tax & Revenue Leakage
              </span>
              <span className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
                {product.id === 'prod-scanning-cards'
                  ? 'High labor cost ($15–$25/hr) spent on repetitive intake; unsorted inventory sits in binders for weeks while market prices crash.'
                  : product.id === 'prod-buylist'
                  ? 'Incumbent platforms charge up to 2.5% GMV commission on every single card traded in, siphoning thousands monthly.'
                  : product.id === 'prod-omnichannel-sync'
                  ? 'Out-of-stock cancellations result in marketplace penalties, downgraded search visibility, and seller account bans.'
                  : 'High commission fees or revenue leakage due to unoptimized systems.'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Deep Dive Section 2: Problems to Build This & Competitor Flaws */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pillar 2: Problems to Build This */}
        <div
          className={`p-6 sm:p-7 rounded-2xl border space-y-4 ${
            isLight ? 'bg-white border-slate-200/90 shadow-xs' : 'bg-[#1a1a20] border-[#292932]'
          }`}
        >
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-zinc-800 text-amber-600 dark:text-amber-400 font-bold uppercase text-xs tracking-wider">
            <Wrench className="w-4 h-4 text-amber-500" />
            <span>2. Problems to Build This (Engineering Obstacles)</span>
          </div>

          {isEditing ? (
            <textarea
              rows={8}
              value={problemsToBuild}
              onChange={(e) => setProblemsToBuild(e.target.value)}
              placeholder="What makes this difficult to build? (e.g. CV models, edge inference, rate limits, race conditions)..."
              className={`w-full p-3 rounded-xl border text-xs leading-relaxed outline-none font-sans ${
                isLight ? 'bg-white border-slate-300 text-slate-900 focus:border-amber-400' : 'bg-zinc-900 border-zinc-700 text-white focus:border-amber-400'
              }`}
            />
          ) : (
            <p className={`text-xs sm:text-sm leading-relaxed whitespace-pre-line ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>
              {product.problemsToBuild || 'Engineering hurdles & implementation obstacles to be defined.'}
            </p>
          )}

          <div
            className={`p-3.5 rounded-xl border flex items-center gap-2 text-xs ${
              isLight ? 'bg-amber-50/30 border-amber-200/50 text-amber-900' : 'bg-amber-950/20 border-amber-500/20 text-amber-300'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Hard engineering trade-offs between local edge execution speed, sensor glare, and multi-channel concurrency.</span>
          </div>
        </div>

        {/* Pillar 3: How Competitors Made This & Their Flaws */}
        <div
          className={`p-6 sm:p-7 rounded-2xl border space-y-4 ${
            isLight ? 'bg-white border-slate-200/90 shadow-xs' : 'bg-[#1a1a20] border-[#292932]'
          }`}
        >
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-zinc-800 text-sky-600 dark:text-sky-400 font-bold uppercase text-xs tracking-wider">
            <Building2 className="w-4 h-4 text-sky-500" />
            <span>3. How Competitors Made This & Why They Fail</span>
          </div>

          {isEditing ? (
            <textarea
              rows={8}
              value={competitorAnalysis}
              onChange={(e) => setCompetitorAnalysis(e.target.value)}
              placeholder="How did competitors (BinderPOS, CardCastle, Decktradr) build this and what are their fatal flaws?..."
              className={`w-full p-3 rounded-xl border text-xs leading-relaxed outline-none font-sans ${
                isLight ? 'bg-white border-slate-300 text-slate-900 focus:border-sky-400' : 'bg-zinc-900 border-zinc-700 text-white focus:border-sky-400'
              }`}
            />
          ) : (
            <p className={`text-xs sm:text-sm leading-relaxed whitespace-pre-line ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>
              {product.competitorAnalysis || 'Incumbent competitor landscape and shortcomings to be analyzed.'}
            </p>
          )}

          <div
            className={`p-3.5 rounded-xl border flex items-center gap-2 text-xs ${
              isLight ? 'bg-sky-50/30 border-sky-200/50 text-sky-900' : 'bg-sky-950/20 border-sky-500/20 text-sky-300'
            }`}
          >
            <Layers className="w-4 h-4 text-sky-500 shrink-0" />
            <span>Incumbents suffer from heavy commission cuts, slow batch sync, mechanical hardware jams, and vendor lock-in.</span>
          </div>
        </div>
      </div>

      {/* 5. Deep Dive Section 3: The Aeethod Solution (Left Empty as Requested) */}
      <div
        className={`p-6 sm:p-7 rounded-2xl border space-y-4 ${
          isLight ? 'bg-white border-slate-200/90 shadow-xs' : 'bg-[#1a1a20] border-[#292932]'
        }`}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold uppercase text-xs tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>4. The Aeethod Solution Architecture</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
            In Discovery
          </span>
        </div>

        {isEditing ? (
          <textarea
            rows={4}
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
            placeholder="Solution specification is currently left empty for discovery. Enter details when ready..."
            className={`w-full p-3 rounded-xl border text-xs leading-relaxed outline-none ${
              isLight ? 'bg-white border-slate-300 text-slate-900 focus:border-emerald-500' : 'bg-zinc-900 border-zinc-700 text-white focus:border-emerald-500'
            }`}
          />
        ) : product.theAeethodSolution ? (
          <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>
            {product.theAeethodSolution}
          </p>
        ) : (
          <div
            className={`p-8 rounded-xl border border-dashed text-center space-y-2.5 ${
              isLight ? 'bg-slate-50/50 border-slate-200' : 'bg-zinc-900/30 border-zinc-800'
            }`}
          >
            <Sparkles className="w-7 h-7 text-indigo-400 mx-auto opacity-70" />
            <div className="space-y-1">
              <p className={`text-xs font-semibold ${isLight ? 'text-slate-800' : 'text-zinc-200'}`}>
                Solution Specification Left Blank
              </p>
              <p className="text-xs text-slate-400 dark:text-zinc-500 italic max-w-md mx-auto">
                As specified, the Aeethod software solution for this product is currently in discovery and left unfinalized.
              </p>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="text-xs text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 font-semibold hover:underline pt-1 inline-block"
            >
              + Define Solution When Ready
            </button>
          </div>
        )}
      </div>

      {/* 6. Link to Tech Stack Page */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs ${
          isLight ? 'bg-cyan-50/60 border-cyan-200/80 text-slate-700' : 'bg-cyan-950/20 border-cyan-500/30 text-slate-300'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-500">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold block text-slate-900 dark:text-white">
              Looking for Engineering & Technical Architecture?
            </span>
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">
              Full UI/UX, Frontend, Backend, Database, and DevOps layers are managed separately on the Tech Stack page.
            </span>
          </div>
        </div>

        <a
          href="#/dev/stack"
          className="font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 flex items-center gap-1.5 shrink-0"
        >
          <span>Open Full Tech Stack</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
