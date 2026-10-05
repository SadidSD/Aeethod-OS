import React, { useState, useMemo } from 'react';
import {
  Swords,
  Search,
  Filter,
  DollarSign,
  TrendingDown,
  AlertTriangle,
  ShieldAlert,
  Zap,
  ExternalLink,
  Copy,
  Check,
  ChevronRight,
  Info,
} from 'lucide-react';
import { competitorsData, Competitor } from '../lib/competitorsData';

export const CompetitorMatrixView: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedModel, setSelectedModel] = useState<string>('all');
  const [selectedCompetitor, setSelectedCompetitor] = useState<Competitor | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredCompetitors = useMemo(() => {
    return competitorsData.filter((c) => {
      if (selectedCategory !== 'all' && c.category !== selectedCategory) return false;
      if (selectedModel !== 'all' && c.pricing.pricingModel !== selectedModel) return false;
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchesName = c.name.toLowerCase().includes(query);
        const matchesCompany = c.parentCompany.toLowerCase().includes(query);
        const matchesOfferings = c.offerings.some((o) => o.toLowerCase().includes(query));
        const matchesWeaknesses = c.weaknesses.some((w) => w.toLowerCase().includes(query));
        if (!matchesName && !matchesCompany && !matchesOfferings && !matchesWeaknesses) return false;
      }
      return true;
    });
  }, [search, selectedCategory, selectedModel]);

  const handleCopyAttack = (comp: Competitor, e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `Aeethod vs ${comp.name}:\nAttack Vector: ${comp.attackVector}\nWeaknesses: ${comp.weaknesses.join('; ')}\nPricing: ${comp.pricing.base} + ${comp.pricing.commissionRate}`;
    navigator.clipboard.writeText(text);
    setCopiedId(comp.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusBadge = (status: Competitor['status'], label: string) => {
    switch (status) {
      case 'active':
        return <span className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 border px-2 py-0.5 rounded text-[10px] font-mono font-bold">{label}</span>;
      case 'paused':
        return <span className="bg-rose-500/20 text-rose-300 border-rose-500/40 border px-2 py-0.5 rounded text-[10px] font-mono font-bold animate-pulse">{label}</span>;
      case 'legacy':
        return <span className="bg-amber-500/20 text-amber-300 border-amber-500/40 border px-2 py-0.5 rounded text-[10px] font-mono font-bold">{label}</span>;
      default:
        return <span className="bg-[#2a2a2a] text-[#9b9b9b] border-[#3e3e3e] border px-2 py-0.5 rounded text-[10px] font-mono font-bold">{label}</span>;
    }
  };

  const getModelBadge = (model: string) => {
    if (model.includes('Commission')) {
      return <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">{model}</span>;
    }
    if (model.includes('Flat')) {
      return <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">{model}</span>;
    }
    return <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-[#2a2a2a] text-[#9b9b9b] border border-[#3e3e3e]">{model}</span>;
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-slide-in">
      {/* Header */}
      <div className="card p-6 border-rose-500/30 bg-[#202020] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40 uppercase tracking-wider font-mono">
              Competitive Intelligence
            </span>
            <span className="text-xs text-slate-400">• 26 TCG Industry Competitors Analyzed</span>
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">
            Competitor Intelligence & Battlecards
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Exhaustive database of existing TCG commerce platforms, commission rates, and strategic
            attack vectors to win merchants migrating to Aeethod.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#252525] px-4 py-2 rounded-xl border border-[#2e2e2e]">
          <div className="text-right">
            <div className="text-xs font-mono font-bold text-rose-400">
              {filteredCompetitors.length} / {competitorsData.length}
            </div>
            <div className="text-[10px] text-slate-400">Active Competitors</div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="card p-4 border border-[#2e2e2e] bg-[#202020] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search competitor, parent company, weakness, or feature..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9 text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input-field text-xs w-auto"
          >
            <option value="all">All Categories (26)</option>
            <option value="all-in-one">All-in-One Commerce</option>
            <option value="shopify-apps">Shopify Apps & Tools</option>
            <option value="pos-mobile">POS & Mobile Hardware</option>
          </select>

          {/* Model Filter */}
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="input-field text-xs w-auto"
          >
            <option value="all">All Pricing Models</option>
            <option value="Commission-Heavy">Commission-Heavy (GMV Tax)</option>
            <option value="Flat SaaS">Flat SaaS</option>
            <option value="Freemium">Freemium</option>
            <option value="Enterprise Hybrid">Enterprise Hybrid</option>
          </select>
        </div>
      </div>

      {/* Competitor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCompetitors.map((comp) => {
          const isCopied = copiedId === comp.id;

          return (
            <div
              key={comp.id}
              onClick={() => setSelectedCompetitor(comp)}
              className="card p-5 border border-[#2e2e2e] bg-[#202020] hover:border-indigo-500/50 hover:bg-[#252525] cursor-pointer transition flex flex-col justify-between space-y-4 group shadow-sm"
            >
              {/* Card Header */}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-indigo-400 transition">
                      {comp.name}
                    </h3>
                    <div className="text-[11px] text-slate-400">{comp.parentCompany}</div>
                  </div>
                  {getStatusBadge(comp.status, comp.statusLabel)}
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {getModelBadge(comp.pricing.pricingModel)}
                  <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-[#2a2a2a] text-slate-400 border border-[#3e3e3e]">
                    {comp.categoryLabel}
                  </span>
                </div>
              </div>

              {/* Pricing & Scale stats */}
              <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-[#252525] border border-[#2e2e2e] text-xs font-mono">
                <div>
                  <div className="text-[9px] uppercase font-bold text-slate-500">Base Price</div>
                  <div className="text-slate-200 truncate">{comp.pricing.base}</div>
                </div>
                <div>
                  <div className="text-[9px] uppercase font-bold text-slate-500">Commission Rate</div>
                  <div className={comp.pricing.commissionRate.includes('0%') ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {comp.pricing.commissionRate}
                  </div>
                </div>
                <div>
                  <div className="text-[9px] uppercase font-bold text-slate-500">Est. ARR</div>
                  <div className="text-slate-200">{comp.estARR}</div>
                </div>
                <div>
                  <div className="text-[9px] uppercase font-bold text-slate-500">Scale</div>
                  <div className="text-slate-200 truncate">{comp.estCustomers}</div>
                </div>
              </div>

              {/* Attack Vector Highlight */}
              <div className="space-y-1 text-xs">
                <div className="text-[10px] uppercase font-bold text-indigo-400 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-indigo-400" />
                  <span>Aeethod Attack Vector</span>
                </div>
                <p className="text-slate-300 text-[11px] line-clamp-2 leading-relaxed">
                  {comp.attackVector}
                </p>
              </div>

              {/* Card Footer */}
              <div className="pt-2 border-t border-ink-800 flex items-center justify-between text-xs">
                <button
                  onClick={(e) => handleCopyAttack(comp, e)}
                  className="flex items-center gap-1.5 text-slate-400 hover:text-white transition text-[11px]"
                  title="Copy battlecard pitch"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied Pitch</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Pitch</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-1 text-indigo-400 group-hover:translate-x-0.5 transition text-[11px] font-semibold">
                  <span>Battlecard</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Battlecard Detail Modal */}
      {selectedCompetitor && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="card w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 space-y-6 shadow-2xl border-indigo-500/40 bg-[#202020]">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[#2e2e2e]">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    {selectedCompetitor.name}
                  </h3>
                  {getStatusBadge(selectedCompetitor.status, selectedCompetitor.statusLabel)}
                </div>
                <div className="text-xs text-slate-400">
                  {selectedCompetitor.parentCompany} • {selectedCompetitor.targetMarket}
                </div>
              </div>

              <button
                onClick={() => setSelectedCompetitor(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#282828] transition"
              >
                ✕
              </button>
            </div>

            {/* Core Pricing & Financials */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-[#252525] border border-[#2e2e2e] font-mono text-xs">
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Base Pricing</div>
                <div className="text-slate-100 font-semibold mt-0.5">{selectedCompetitor.pricing.base}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Commission</div>
                <div className="text-rose-400 font-semibold mt-0.5">{selectedCompetitor.pricing.commissionRate}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Setup / Hardware</div>
                <div className="text-slate-100 mt-0.5">{selectedCompetitor.pricing.setupFee || selectedCompetitor.pricing.hardwareCost}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Est ARR</div>
                <div className="text-emerald-400 font-semibold mt-0.5">{selectedCompetitor.estARR}</div>
              </div>
            </div>

            {/* Attack Vector Banner */}
            <div className="p-4 rounded-xl bg-[#252525] border border-indigo-500/30 space-y-1.5">
              <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-indigo-400" />
                <span>Aeethod Strategic Attack Vector</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {selectedCompetitor.attackVector}
              </p>
            </div>

            {/* Moats vs Weaknesses */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  <span>Their Moats & Strengths</span>
                </div>
                <ul className="space-y-1.5">
                  {selectedCompetitor.moats.map((m, i) => (
                    <li key={i} className="text-xs text-slate-400 flex items-start gap-2">
                      <span className="text-slate-600 mt-0.5">•</span>
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  <span>Fatal Weaknesses (Our Opportunity)</span>
                </div>
                <ul className="space-y-1.5">
                  {selectedCompetitor.weaknesses.map((w, i) => (
                    <li key={i} className="text-xs text-rose-300/90 flex items-start gap-2">
                      <span className="text-rose-500 mt-0.5">•</span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Offerings list */}
            <div className="space-y-2 pt-2 border-t border-ink-800">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Platform Offerings
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {selectedCompetitor.offerings.map((off, i) => (
                  <div key={i} className="text-xs text-slate-400 flex items-start gap-1.5">
                    <span className="text-indigo-400">✓</span>
                    <span>{off}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Stack & Marketing Funnel */}
            <div className="p-3 rounded-lg bg-ink-950 border border-ink-800 space-y-1 text-xs">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Tech Stack & Architecture</div>
              <div className="text-slate-300 font-mono text-[11px]">{selectedCompetitor.techStackSummary}</div>
              <div className="text-[10px] text-slate-500 uppercase font-bold pt-2">Primary Marketing Funnel</div>
              <div className="text-slate-300 text-[11px]">{selectedCompetitor.marketing.primaryFunnel}</div>
            </div>

            <div className="flex justify-end pt-2 border-t border-ink-800">
              <button
                onClick={() => setSelectedCompetitor(null)}
                className="btn-primary text-xs py-1.5 px-4"
              >
                Close Battlecard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
