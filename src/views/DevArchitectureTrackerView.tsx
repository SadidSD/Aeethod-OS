import React, { useState, useMemo } from 'react';
import {
  Code2,
  Database,
  Layers,
  Layout,
  Server,
  Terminal,
  Cpu,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Plus,
  Search,
  Filter,
  Flame,
  ShieldCheck,
  Target,
  Zap,
  SlidersHorizontal,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  BookOpen,
  DollarSign
} from 'lucide-react';
import { useStore } from '../store';
import {
  DevStackLayer,
  DevStatus,
  DevPriority,
  DevWorkItem,
  SaaSProductPillar,
  SAAS_PRODUCT_PILLARS,
  VIBE_CODING_MANIFESTO,
  INITIAL_DEV_WORK_ITEMS
} from '../data/devPlanningData';

export const DevArchitectureTrackerView: React.FC = () => {
  const { theme } = useStore();
  const isLight = theme === 'light';

  // Navigation Sub-Tabs
  const [activeTab, setActiveTab] = useState<'stack-tracker' | 'saas-pillars' | 'vibe-manifesto' | 'roadmap'>('stack-tracker');

  // Work Items State
  const [workItems, setWorkItems] = useState<DevWorkItem[]>(INITIAL_DEV_WORK_ITEMS);

  // Filters
  const [selectedLayer, setSelectedLayer] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // New Work Item Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newLayer, setNewLayer] = useState<DevStackLayer>('UI/UX');
  const [newStatus, setNewStatus] = useState<DevStatus>('In Progress');
  const [newPriority, setNewPriority] = useState<DevPriority>('High P1');
  const [newProblem, setNewProblem] = useState('');
  const [newSolution, setNewSolution] = useState('');
  const [newPrompt, setNewPrompt] = useState('');
  const [newSprint, setNewSprint] = useState('Sprint 1 (Beachhead Wedge)');

  // Expanded Work Items
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    'dev-ui-1': true,
    'dev-fe-1': true
  });

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Filtered Items
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

  // Layer Metrics
  const layerStats = useMemo(() => {
    const stats: Record<DevStackLayer, { total: number; shipped: number; inProgress: number }> = {
      'UI/UX': { total: 0, shipped: 0, inProgress: 0 },
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

  const handleCreateItem = (e: React.FormEvent) => {
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
      aiVibePromptBlueprint: newPrompt.trim() || 'Build clean typed implementation with optimistic updates.',
      targetSprint: newSprint,
      filesTargeted: [],
      complexity: 'M'
    };

    setWorkItems((prev) => [newItem, ...prev]);
    setIsModalOpen(false);
    setNewTitle('');
    setNewProblem('');
    setNewSolution('');
    setNewPrompt('');
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
                Vibe Coding OS
              </span>
              <span className="text-[11px] text-slate-500 font-mono">Full-Stack Architecture & Product Roadmap</span>
            </div>
            <h1 className={`text-2xl lg:text-3xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Full-Stack Engineering & SaaS Product Engine
            </h1>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Unified telemetry across <strong>UI/UX, Frontend, Backend, Database, and SaaS Product Strategy</strong>.
              Track exactly what problem we are solving, why stores need it, and execute with precision using the Vibe Coding methodology.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary text-xs px-4 py-2.5 flex items-center gap-2 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Log Engineering Task</span>
            </button>
          </div>
        </div>

        {/* Layer Telemetry Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-5 border-t border-slate-800/60">
          {(['UI/UX', 'Frontend', 'Backend', 'Database', 'DevOps & Tooling'] as DevStackLayer[]).map((layer) => {
            const stat = layerStats[layer];
            const icon =
              layer === 'UI/UX' ? <Layout className="w-3.5 h-3.5 text-purple-400" /> :
              layer === 'Frontend' ? <Code2 className="w-3.5 h-3.5 text-cyan-400" /> :
              layer === 'Backend' ? <Server className="w-3.5 h-3.5 text-amber-400" /> :
              layer === 'Database' ? <Database className="w-3.5 h-3.5 text-emerald-400" /> :
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />;

            return (
              <div
                key={layer}
                onClick={() => setSelectedLayer(selectedLayer === layer ? 'All' : layer)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedLayer === layer
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
          <span>Full-Stack Tracker ({filteredItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('saas-pillars')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition shrink-0 ${
            activeTab === 'saas-pillars'
              ? (isLight ? 'bg-slate-900 text-white' : 'bg-white text-slate-950 font-bold')
              : 'text-slate-400 hover:text-white hover:bg-[#25252a]'
          }`}
        >
          <Target className="w-4 h-4 text-emerald-400" />
          <span>4 Core SaaS Products (Problem & Solution)</span>
        </button>

        <button
          onClick={() => setActiveTab('vibe-manifesto')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition shrink-0 ${
            activeTab === 'vibe-manifesto'
              ? (isLight ? 'bg-slate-900 text-white' : 'bg-white text-slate-950 font-bold')
              : 'text-slate-400 hover:text-white hover:bg-[#25252a]'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Vibe Coding Manifesto & Prompt Blueprints</span>
        </button>

        <button
          onClick={() => setActiveTab('roadmap')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition shrink-0 ${
            activeTab === 'roadmap'
              ? (isLight ? 'bg-slate-900 text-white' : 'bg-white text-slate-950 font-bold')
              : 'text-slate-400 hover:text-white hover:bg-[#25252a]'
          }`}
        >
          <Zap className="w-4 h-4 text-indigo-400" />
          <span>The 3-Phase Beachhead Plan</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: FULL-STACK TRACKER TABLE & DETAILS                                */}
      {/* ========================================================================= */}
      {activeTab === 'stack-tracker' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-[11px] text-slate-500 font-semibold uppercase">Layer:</span>
              {['All', 'UI/UX', 'Frontend', 'Backend', 'Database', 'DevOps & Tooling'].map((l) => (
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
                placeholder="Search problem, stack, prompt..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Work Items List */}
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
                  {/* Card Header Row */}
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
                            item.layer === 'UI/UX' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
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
                          Target: {item.targetSprint}
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

                  {/* Expanded Breakdown */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-2 border-t border-slate-800/60 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                        <span className="text-[10px] uppercase font-bold text-rose-400 flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5" /> Customer Pain / Problem Being Solved:
                        </span>
                        <p className="text-slate-300 leading-relaxed">{item.problemSolved}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                        <span className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" /> Architectural Solution Approach:
                        </span>
                        <p className="text-slate-300 leading-relaxed">{item.solutionApproach}</p>
                      </div>

                      <div className="md:col-span-2 p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/30 space-y-1.5 font-mono">
                        <span className="text-[10px] uppercase font-bold text-indigo-400 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" /> AI Vibe Coding Prompt Blueprint:
                        </span>
                        <div className="p-2.5 rounded-lg bg-slate-950/80 text-indigo-200 text-[11px] select-all border border-indigo-500/20">
                          {item.aiVibePromptBlueprint}
                        </div>
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
      {/* TAB 2: SAAS PRODUCT PILLARS (PROBLEM & SOLUTION MATRIX)                   */}
      {/* ========================================================================= */}
      {activeTab === 'saas-pillars' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl border border-indigo-500/30 bg-indigo-950/20 text-xs text-indigo-200">
            <span className="font-bold text-white">The Core Product Thesis: </span>
            Local Game Stores don't buy "software"—they buy <strong>hours of clerk labor saved</strong> and <strong>margin protection</strong>. Every pillar below directly attacks a critical financial drain in a card shop.
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {SAAS_PRODUCT_PILLARS.map((pillar) => (
              <div
                key={pillar.id}
                className={`p-6 rounded-2xl border space-y-4 ${
                  isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#1b1b20] border-[#2e2e34]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/40">
                      {pillar.icon}
                    </span>
                    <div>
                      <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {pillar.name}
                      </h3>
                      <p className="text-xs text-indigo-400 font-mono">{pillar.tagline}</p>
                    </div>
                  </div>
                </div>

                {/* Problem vs Solution */}
                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-rose-400 block">The Bleeding Problem:</span>
                    <p className="text-rose-200/90 leading-relaxed">{pillar.targetCustomerProblem}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 block">How Aeethod Solves It:</span>
                    <p className="text-emerald-200/90 leading-relaxed">{pillar.theAeethodSolution}</p>
                  </div>
                </div>

                {/* Tech Stack Specs */}
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-[11px] font-mono">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block font-sans">Full-Stack Tech Specs:</span>
                  <div className="grid grid-cols-2 gap-2 text-slate-300">
                    <div><span className="text-slate-500">UI/UX:</span> {pillar.techStackSpecs.uiUx}</div>
                    <div><span className="text-slate-500">Frontend:</span> {pillar.techStackSpecs.frontend}</div>
                    <div><span className="text-slate-500">Backend:</span> {pillar.techStackSpecs.backend}</div>
                    <div><span className="text-slate-500">Database:</span> {pillar.techStackSpecs.database}</div>
                  </div>
                </div>

                {/* Metric to Beat */}
                <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-sans">Incumbent Status Quo</span>
                    <span className="text-rose-400 font-semibold">{pillar.metricsToBeat.legacyStatusQuo}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase block font-sans">Aeethod Target</span>
                    <span className="text-emerald-400 font-bold">{pillar.metricsToBeat.aeethodTarget}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: VIBE CODING MANIFESTO & PROMPTING BLUEPRINTS                       */}
      {/* ========================================================================= */}
      {activeTab === 'vibe-manifesto' && (
        <div className="space-y-6">
          <div className="p-5 rounded-xl border border-cyan-500/30 bg-cyan-950/20 space-y-2">
            <h2 className="text-base font-bold text-cyan-300 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              How to Ship Fast in the Vibe Coding Era
            </h2>
            <p className="text-xs text-cyan-200/80 leading-relaxed">
              "Vibe coding" is not lazy coding—it is <strong>maximum-velocity architecture orchestration</strong> where human engineers design the system contracts, types, and boundaries, and AI assistants write the verbose implementation code.
              Here are the 4 non-negotiable laws that allow a single founder to out-ship a 20-person startup team.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {VIBE_CODING_MANIFESTO.map((rule) => (
              <div
                key={rule.step}
                className={`p-5 rounded-2xl border space-y-3 ${
                  isLight ? 'bg-white border-slate-200' : 'bg-[#1b1b20] border-[#2e2e34]'
                }`}
              >
                <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs font-bold">
                  <span className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/40">
                    {rule.step}
                  </span>
                  <span>{rule.title}</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {rule.description}
                </p>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1 font-mono text-[11px]">
                  <span className="text-[10px] uppercase font-bold text-cyan-400 block font-sans">
                    Ideal Vibe Prompt Formula:
                  </span>
                  <div className="text-cyan-200 select-all">{rule.promptExample}</div>
                </div>

                <div className="pt-2 border-t border-slate-800/60 text-[11px] text-amber-400 font-medium">
                  <strong>Rule of thumb: </strong>{rule.ruleOfThumb}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: THE 3-PHASE BEACHHEAD PLAN                                         */}
      {/* ========================================================================= */}
      {activeTab === 'roadmap' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className={`p-5 rounded-2xl border space-y-3 ${
              isLight ? 'bg-white border-slate-200' : 'bg-[#1b1b20] border-indigo-500/40 bg-gradient-to-b from-indigo-950/10 to-transparent'
            }`}>
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  PHASE 1 (WEEKS 1–4)
                </span>
                <span className="text-xs font-bold text-emerald-400">Current Focus</span>
              </div>
              <h3 className="text-base font-bold text-white">The Hero Wedge: Automated Buylist & $0 Fee Sync</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Build ONLY the buylist scanning kiosk and bidirectional Shopify inventory sync. Do not build POS or tournament pairing yet.
              </p>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
                <strong>Offer: </strong>"Save 20 hours/wk on trade-in typing & keep 100% of singles margin for $99/mo."
              </div>
            </div>

            <div className={`p-5 rounded-2xl border space-y-3 ${
              isLight ? 'bg-white border-slate-200' : 'bg-[#1b1b20] border-[#2e2e34]'
            }`}>
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-400">
                  PHASE 2 (MONTHS 2–3)
                </span>
                <span className="text-xs font-bold text-slate-500">Storefront Upsell</span>
              </div>
              <h3 className="text-base font-bold text-white">Productized Storefronts ($2k Package)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Sell the Turn-Key TCG Custom Shopify Storefront package for $1,500-$2,500. Generate immediate non-dilutive cash to fund AI infrastructure.
              </p>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
                <strong>Outcome: </strong>Negative churn lock-in + $10,000+ upfront cash from first 5 stores.
              </div>
            </div>

            <div className={`p-5 rounded-2xl border space-y-3 ${
              isLight ? 'bg-white border-slate-200' : 'bg-[#1b1b20] border-[#2e2e34]'
            }`}>
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-400">
                  PHASE 3 (MONTHS 4–6)
                </span>
                <span className="text-xs font-bold text-slate-500">Enterprise Expansion</span>
              </div>
              <h3 className="text-base font-bold text-white">Full Counter POS & Regional Chain Tier</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Expand to multi-location card shops with central warehouse routing, automated price floor repricing, and barcode label printing.
              </p>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
                <strong>Pricing: </strong>$299-$499/mo multi-location enterprise tier.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Log New Engineering Task */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="card w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-4 bg-[#1b1b20] border border-indigo-500/40 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Log Engineering & Product Work Item</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateItem} className="space-y-4 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Feature / Task Title</label>
                <input
                  type="text"
                  placeholder="e.g. Optical AI Card Hashing Stream"
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
                    <option value="UI/UX">UI/UX</option>
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
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">What Customer Problem Does This Solve?</label>
                <textarea
                  rows={2}
                  value={newProblem}
                  onChange={(e) => setNewProblem(e.target.value)}
                  placeholder="Explain why a card store owner cares..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Architectural Solution Approach</label>
                <textarea
                  rows={2}
                  value={newSolution}
                  onChange={(e) => setNewSolution(e.target.value)}
                  placeholder="How we build it cleanly across frontend/backend/database..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">AI Vibe Coding Prompt Blueprint</label>
                <input
                  type="text"
                  value={newPrompt}
                  onChange={(e) => setNewPrompt(e.target.value)}
                  placeholder="Exact prompt instruction to paste to the AI..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-[11px]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary px-5 py-2">
                  Create Work Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
