import React, { useState, useMemo } from 'react';
import {
  Code2,
  Database,
  Layers,
  Server,
  Cpu,
  CheckCircle2,
  Plus,
  Search,
  Filter,
  Flame,
  ShieldCheck,
  Target,
  Zap,
  ChevronDown,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Trash2,
  Package
} from 'lucide-react';
import { useStore } from '../store';
import {
  DevStackLayer,
  DevStatus,
  DevPriority,
  DevWorkItem,
  SaaSProductPillar,
  INITIAL_SAAS_PRODUCTS,
  INITIAL_DEV_WORK_ITEMS
} from '../data/devPlanningData';

export const DevArchitectureTrackerView: React.FC = () => {
  const { theme } = useStore();
  const isLight = theme === 'light';

  // Navigation Sub-Tabs: ONLY 2 Tabs now (Full-Stack Tracker & My SaaS Products)
  const [activeTab, setActiveTab] = useState<'stack-tracker' | 'saas-products'>('stack-tracker');

  // Work Items State
  const [workItems, setWorkItems] = useState<DevWorkItem[]>(INITIAL_DEV_WORK_ITEMS);

  // User-defined SaaS Products State (starts empty as requested)
  const [saasProducts, setSaasProducts] = useState<SaaSProductPillar[]>(INITIAL_SAAS_PRODUCTS);

  // Filters for Stack Tracker
  const [selectedLayer, setSelectedLayer] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal: Add Work Item
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newLayer, setNewLayer] = useState<DevStackLayer>('Frontend');
  const [newStatus, setNewStatus] = useState<DevStatus>('In Progress');
  const [newPriority, setNewPriority] = useState<DevPriority>('High P1');
  const [newProblem, setNewProblem] = useState('');
  const [newSolution, setNewSolution] = useState('');
  const [newSprint, setNewSprint] = useState('Sprint 1');

  // Modal: Add SaaS Product
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [prodName, setProdName] = useState('');
  const [prodTagline, setProdTagline] = useState('');
  const [prodIcon, setProdIcon] = useState('⚡');
  const [prodProblem, setProdProblem] = useState('');
  const [prodSolution, setProdSolution] = useState('');
  const [prodAudience, setProdAudience] = useState('');
  const [prodPricing, setProdPricing] = useState('');
  const [prodStatus, setProdStatus] = useState<'Concept' | 'In Discovery' | 'In Development' | 'Beta' | 'Live'>('In Discovery');

  // Expanded Work Items
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    'dev-fe-1': true,
    'dev-be-1': true
  });

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Filtered Stack Items
  const filteredItems = useMemo(() => {
    return workItems.filter((item) => {
      const matchLayer = selectedLayer === 'All' || item.layer === selectedLayer;
      const matchStatus = selectedStatus === 'All' || item.status === selectedStatus;
      const matchSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.problemSolved.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.solutionApproach.toLowerCase().includes(searchQuery.toLowerCase());
      return matchLayer && matchStatus && matchSearch;
    });
  }, [workItems, selectedLayer, selectedStatus, searchQuery]);

  // Layer Stats
  const layerStats = useMemo(() => {
    const stats: Record<DevStackLayer, { total: number; shipped: number; inProgress: number }> = {
      'Frontend': { total: 0, shipped: 0, inProgress: 0 },
      'Backend': { total: 0, shipped: 0, inProgress: 0 },
      'Database': { total: 0, shipped: 0, inProgress: 0 },
      'DevOps & Tooling': { total: 0, shipped: 0, inProgress: 0 }
    };

    workItems.forEach((item) => {
      if (stats[item.layer]) {
        stats[item.layer].total++;
        if (item.status === 'Shipped' || item.status === 'Vibe Verified') stats[item.layer].shipped++;
        if (item.status === 'In Progress') stats[item.layer].inProgress++;
      }
    });

    return stats;
  }, [workItems]);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: DevWorkItem = {
      id: `dev-${Date.now()}`,
      title: newTitle.trim(),
      layer: newLayer,
      status: newStatus,
      priority: newPriority,
      problemSolved: newProblem.trim() || 'Core customer operational bottleneck',
      solutionApproach: newSolution.trim() || 'Modern scalable implementation',
      targetSprint: newSprint,
      complexity: 'M'
    };

    setWorkItems((prev) => [newItem, ...prev]);
    setIsTaskModalOpen(false);
    setNewTitle('');
    setNewProblem('');
    setNewSolution('');
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) return;

    const newProd: SaaSProductPillar = {
      id: `prod-${Date.now()}`,
      name: prodName.trim(),
      tagline: prodTagline.trim() || 'High-impact SaaS solution',
      icon: prodIcon.trim() || '📦',
      targetCustomerProblem: prodProblem.trim(),
      theAeethodSolution: prodSolution.trim(),
      targetAudience: prodAudience.trim() || 'Card stores & online merchants',
      pricingModel: prodPricing.trim() || '$99 - $299/mo',
      status: prodStatus
    };

    setSaasProducts((prev) => [newProd, ...prev]);
    setIsProductModalOpen(false);
    setProdName('');
    setProdTagline('');
    setProdProblem('');
    setProdSolution('');
    setProdAudience('');
    setProdPricing('');
  };

  const deleteProduct = (id: string) => {
    setSaasProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const updateItemStatus = (id: string, nextStatus: DevStatus) => {
    setWorkItems((prev) => prev.map((item) => (item.id === id ? { ...item, status: nextStatus } : item)));
  };

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
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wider uppercase bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                Vibe Coding Architecture
              </span>
              <span className="text-[11px] text-slate-500 font-mono">Frontend • Backend • Database • SaaS Products</span>
            </div>
            <h1 className={`text-2xl lg:text-3xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Full-Stack Engineering & SaaS Products Hub
            </h1>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Manage your technical development stack (<strong>Frontend, Backend, Database, DevOps</strong>) and plan what SaaS products to build, what problems they solve, and how we will solve them.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'stack-tracker' ? (
              <button
                onClick={() => setIsTaskModalOpen(true)}
                className="btn-primary text-xs px-4 py-2.5 flex items-center gap-2 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Log Stack Task</span>
              </button>
            ) : (
              <button
                onClick={() => setIsProductModalOpen(true)}
                className="btn-primary text-xs px-4 py-2.5 flex items-center gap-2 shadow-md bg-emerald-600 hover:bg-emerald-500"
              >
                <Plus className="w-4 h-4" />
                <span>Add SaaS Product</span>
              </button>
            )}
          </div>
        </div>

        {/* Layer Telemetry Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/60">
          {(['Frontend', 'Backend', 'Database', 'DevOps & Tooling'] as DevStackLayer[]).map((layer) => {
            const stat = layerStats[layer];
            const icon =
              layer === 'Frontend' ? <Code2 className="w-3.5 h-3.5 text-cyan-400" /> :
              layer === 'Backend' ? <Server className="w-3.5 h-3.5 text-amber-400" /> :
              layer === 'Database' ? <Database className="w-3.5 h-3.5 text-emerald-400" /> :
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />;

            return (
              <div
                key={layer}
                onClick={() => {
                  setSelectedLayer(selectedLayer === layer ? 'All' : layer);
                  setActiveTab('stack-tracker');
                }}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedLayer === layer && activeTab === 'stack-tracker'
                    ? 'border-indigo-500 bg-indigo-500/10'
                    : isLight
                    ? 'bg-white border-slate-200 hover:border-slate-300'
                    : 'bg-[#222226] border-[#2e2e34] hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                  <span className="flex items-center gap-1.5 font-bold">{icon} {layer}</span>
                  <span className="font-mono text-white font-bold">{stat.shipped}/{stat.total}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 mt-2 overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: `${stat.total > 0 ? (stat.shipped / stat.total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Sub-Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-[#2e2e34] pb-3 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('stack-tracker')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition shrink-0 ${
            activeTab === 'stack-tracker'
              ? (isLight ? 'bg-slate-900 text-white' : 'bg-white text-slate-950 font-bold')
              : 'text-slate-400 hover:text-white hover:bg-[#25252a]'
          }`}
        >
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>Technical Stack Tracker ({filteredItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('saas-products')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition shrink-0 ${
            activeTab === 'saas-products'
              ? (isLight ? 'bg-slate-900 text-white' : 'bg-white text-slate-950 font-bold')
              : 'text-slate-400 hover:text-white hover:bg-[#25252a]'
          }`}
        >
          <Package className="w-4 h-4 text-emerald-400" />
          <span>SaaS Products & Problem-Solving Roadmap ({saasProducts.length})</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: FULL-STACK TECHNICAL TRACKER                                       */}
      {/* ========================================================================= */}
      {activeTab === 'stack-tracker' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-[11px] text-slate-500 font-semibold uppercase">Layer:</span>
              {['All', 'Frontend', 'Backend', 'Database', 'DevOps & Tooling'].map((l) => (
                <button
                  key={l}
                  onClick={() => setSelectedLayer(l)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition shrink-0 ${
                    selectedLayer === l
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search technical stack..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredItems.map((item) => {
              const isExpanded = expandedItems[item.id];
              return (
                <div
                  key={item.id}
                  className={`rounded-xl border transition-all ${
                    isLight
                      ? 'bg-white border-slate-200 shadow-xs'
                      : 'bg-[#1b1b20] border-[#2c2c34] hover:border-slate-700'
                  }`}
                >
                  <div
                    onClick={() => toggleExpand(item.id)}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-3">
                      <button className="text-slate-500 hover:text-white">
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </button>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            item.layer === 'Frontend' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' :
                            item.layer === 'Backend' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                            item.layer === 'Database' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                            'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                          }`}>
                            {item.layer}
                          </span>

                          <h3 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                            {item.title}
                          </h3>
                        </div>

                        <div className="text-[11px] text-slate-500 font-mono">
                          Target: {item.targetSprint || 'Sprint 1'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        item.priority === 'Critical P0' ? 'bg-rose-500/20 text-rose-400' :
                        item.priority === 'High P1' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {item.priority}
                      </span>

                      <select
                        value={item.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => updateItemStatus(item.id, e.target.value as DevStatus)}
                        className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg border bg-slate-900 ${
                          item.status === 'Shipped' || item.status === 'Vibe Verified'
                            ? 'text-emerald-400 border-emerald-500/30'
                            : item.status === 'In Progress'
                            ? 'text-cyan-400 border-cyan-500/30'
                            : item.status === 'In Review'
                            ? 'text-amber-400 border-amber-500/30'
                            : 'text-slate-400 border-slate-700'
                        }`}
                      >
                        <option value="Backlog">Backlog</option>
                        <option value="In Progress">In Progress</option>
                        <option value="In Review">In Review</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Vibe Verified">Vibe Verified</option>
                      </select>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-2 border-t border-slate-800/60 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                        <span className="text-[10px] uppercase font-bold text-rose-400 flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5" /> Problem Being Solved:
                        </span>
                        <p className="text-slate-300 leading-relaxed">{item.problemSolved}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                        <span className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" /> Technical Solution Approach:
                        </span>
                        <p className="text-slate-300 leading-relaxed">{item.solutionApproach}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: SAAS PRODUCTS (PLANNING WHAT WE ARE SOLVING)                        */}
      {/* ========================================================================= */}
      {activeTab === 'saas-products' && (
        <div className="space-y-6">
          {saasProducts.length === 0 ? (
            <div className={`p-12 text-center rounded-2xl border border-dashed ${
              isLight ? 'bg-slate-50 border-slate-300' : 'bg-[#1b1b20] border-slate-700'
            } space-y-4`}>
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto text-2xl">
                📦
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  No SaaS Products Added Yet
                </h3>
                <p className="text-xs text-slate-400">
                  You requested to input your own SaaS products! Click the button below to add your product idea, what pain point it solves, and how you will solve it.
                </p>
              </div>
              <button
                onClick={() => setIsProductModalOpen(true)}
                className="btn-primary text-xs px-5 py-2.5 inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Your First SaaS Product</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {saasProducts.map((prod) => (
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
                        onClick={() => deleteProduct(prod.id)}
                        className="p-1 text-slate-500 hover:text-rose-400"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-rose-400 block">The Customer Problem:</span>
                      <p className="text-rose-200/90 leading-relaxed">{prod.targetCustomerProblem}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-emerald-400 block">How We Solve It:</span>
                      <p className="text-emerald-200/90 leading-relaxed">{prod.theAeethodSolution}</p>
                    </div>
                  </div>

                  {(prod.targetAudience || prod.pricingModel) && (
                    <div className="pt-3 border-t border-slate-800/60 grid grid-cols-2 gap-2 text-xs font-mono">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase block font-sans">Target Audience</span>
                        <span className="text-slate-300">{prod.targetAudience}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 uppercase block font-sans">Pricing Model</span>
                        <span className="text-emerald-400 font-bold">{prod.pricingModel}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal: Add SaaS Product */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="card w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-4 bg-[#1b1b20] border border-emerald-500/40 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Add New SaaS Product Spec</h3>
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
                    placeholder="e.g. Automated Buylist Kiosk"
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
                  placeholder="e.g. Singles intake in 10 seconds with 0 manual typing"
                  value={prodTagline}
                  onChange={(e) => setProdTagline(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">What Customer Problem Does It Solve?</label>
                <textarea
                  rows={3}
                  value={prodProblem}
                  onChange={(e) => setProdProblem(e.target.value)}
                  placeholder="Describe the exact pain, money loss, or friction store owners face..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">How Will We Solve It?</label>
                <textarea
                  rows={3}
                  value={prodSolution}
                  onChange={(e) => setProdSolution(e.target.value)}
                  placeholder="Describe our software feature and technological solution..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Target Audience</label>
                  <input
                    type="text"
                    placeholder="e.g. LGS Card Shops"
                    value={prodAudience}
                    onChange={(e) => setProdAudience(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Pricing Model</label>
                  <input
                    type="text"
                    placeholder="e.g. $99/mo + $0 fee"
                    value={prodPricing}
                    onChange={(e) => setProdPricing(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Status</label>
                  <select
                    value={prodStatus}
                    onChange={(e) => setProdStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  >
                    <option value="Concept">Concept</option>
                    <option value="In Discovery">In Discovery</option>
                    <option value="In Development">In Development</option>
                    <option value="Beta">Beta</option>
                    <option value="Live">Live</option>
                  </select>
                </div>
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
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Technical Task */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="card w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-4 bg-[#1b1b20] border border-indigo-500/40 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Log Technical Stack Task</h3>
              <button onClick={() => setIsTaskModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Task Title</label>
                <input
                  type="text"
                  placeholder="e.g. Optical Video Stream Capture Handler"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Stack Layer</label>
                  <select
                    value={newLayer}
                    onChange={(e) => setNewLayer(e.target.value as DevStackLayer)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Database">Database</option>
                    <option value="DevOps & Tooling">DevOps & Tooling</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as DevStatus)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  >
                    <option value="Backlog">Backlog</option>
                    <option value="In Progress">In Progress</option>
                    <option value="In Review">In Review</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Vibe Verified">Vibe Verified</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as DevPriority)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  >
                    <option value="Critical P0">Critical P0</option>
                    <option value="High P1">High P1</option>
                    <option value="Medium P2">Medium P2</option>
                    <option value="Future P3">Future P3</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Problem Being Solved</label>
                <textarea
                  rows={2}
                  value={newProblem}
                  onChange={(e) => setNewProblem(e.target.value)}
                  placeholder="Why does this task matter..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Technical Solution Approach</label>
                <textarea
                  rows={2}
                  value={newSolution}
                  onChange={(e) => setNewSolution(e.target.value)}
                  placeholder="Implementation approach across files and libraries..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary px-5 py-2">
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
