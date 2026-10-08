import React, { useState, useMemo } from 'react';
import {
  Palette,
  Sparkles,
  Layout,
  MousePointerClick,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  Filter,
  Layers,
  Eye,
  CheckSquare,
  Wand2,
  ArrowRight,
  Workflow,
  Users,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  TrendingUp,
  Smartphone,
  Monitor,
  ExternalLink,
  Sliders,
  ChevronRight,
  Target,
  Sparkle,
  Zap,
  RotateCcw
} from 'lucide-react';
import { useStore } from '../store';
import {
  UiUxCategory,
  UiUxStatus,
  UiUxTargetSurface,
  UiUxItem,
  UxFlowPlan,
  UxFlowStep,
  HeuristicAuditItem,
  UserPersona,
  UxMetricTarget,
  INITIAL_UI_UX_ITEMS,
  INITIAL_UX_FLOW_PLANS,
  INITIAL_HEURISTIC_AUDITS,
  INITIAL_USER_PERSONAS,
  INITIAL_UX_METRIC_TARGETS
} from '../data/uiUxData';

type StudioTab = 'flows' | 'states' | 'heuristics' | 'personas' | 'tokens' | 'metrics';

export const UiUxStudioView: React.FC = () => {
  const { theme, db, create, update } = useStore();
  const isLight = theme === 'light';

  const [activeTab, setActiveTab] = useState<StudioTab>('flows');

  // Specs List (Store or default)
  const items: UiUxItem[] = db?.ui_ux_items && db.ui_ux_items.length > 0
    ? db.ui_ux_items
    : INITIAL_UI_UX_ITEMS;

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSurface, setSelectedSurface] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Flow Planner State
  const [selectedFlowId, setSelectedFlowId] = useState<string>('flow-buylist');
  const [selectedStepId, setSelectedStepId] = useState<string>('b-1');

  // Heuristic Audit State (Editable in-memory / local)
  const [heuristicAudits, setHeuristicAudits] = useState<HeuristicAuditItem[]>(INITIAL_HEURISTIC_AUDITS);

  // 5-State Preview Demo Selector
  const [activeStateDemo, setActiveStateDemo] = useState<'ideal' | 'empty' | 'loading' | 'partial' | 'error'>('ideal');

  // Add Item Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<UiUxCategory>('Component Library');
  const [newSurface, setNewSurface] = useState<UiUxTargetSurface>('Desktop App');
  const [newStatus, setNewStatus] = useState<UiUxStatus>('In Figma / Wireframe');
  const [newUserProblem, setNewUserProblem] = useState('');
  const [newSolution, setNewSolution] = useState('');
  const [newChecklistText, setNewChecklistText] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Interactive Foil Tilt Demo State
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});
  const [glareStyle, setGlareStyle] = useState<React.CSSProperties>({});

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - card.left;
    const y = e.clientY - card.top;
    const centerX = card.width / 2;
    const centerY = card.height / 2;
    const rotateX = ((y - centerY) / centerY) * -16;
    const rotateY = ((x - centerX) / centerX) * 16;

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.04, 1.04, 1.04)`,
      transition: 'transform 75ms ease-out'
    });

    setGlareStyle({
      background: `radial-gradient(circle at ${(x / card.width) * 100}% ${(y / card.height) * 100}%, rgba(255, 230, 150, 0.45) 0%, rgba(255, 0, 128, 0.25) 40%, rgba(0, 220, 255, 0.2) 70%, transparent 90%)`,
      opacity: 0.95
    });
  };

  const handleCardMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 350ms ease-out'
    });
    setGlareStyle({ opacity: 0, transition: 'opacity 350ms ease-out' });
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchSurface = selectedSurface === 'All' || item.surface === selectedSurface;
      const matchSearch =
        searchQuery === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.userProblem.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.uxDesignSolution.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSurface && matchSearch;
    });
  }, [items, selectedCategory, selectedSurface, searchQuery]);

  const activeFlow = useMemo(() => {
    return INITIAL_UX_FLOW_PLANS.find((f) => f.id === selectedFlowId) || INITIAL_UX_FLOW_PLANS[0];
  }, [selectedFlowId]);

  const activeStep = useMemo(() => {
    return activeFlow.steps.find((s) => s.id === selectedStepId) || activeFlow.steps[0];
  }, [activeFlow, selectedStepId]);

  // Usability score computation
  const usabilityScore = useMemo(() => {
    const passCount = heuristicAudits.filter((h) => h.status === 'Pass').length;
    const warnCount = heuristicAudits.filter((h) => h.status === 'Warning').length;
    return Math.round(((passCount * 10 + warnCount * 5) / 100) * 100);
  }, [heuristicAudits]);

  const handleToggleHeuristicStatus = (id: number) => {
    setHeuristicAudits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;
        const nextStatus = h.status === 'Pass' ? 'Warning' : h.status === 'Warning' ? 'Fail' : 'Pass';
        return { ...h, status: nextStatus };
      })
    );
  };

  const handleCreateSpec = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const checklist = newChecklistText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    create('ui_ux_items', {
      title: newTitle.trim(),
      category: newCategory,
      surface: newSurface,
      status: newStatus,
      userProblem: newUserProblem.trim() || 'Unspecified user problem',
      uxDesignSolution: newSolution.trim() || 'Standard UX solution',
      designChecklist: checklist.length > 0 ? checklist : ['Follow design token standards', 'Test on touchscreen'],
      figmaOrPreviewNotes: newNotes.trim() || undefined,
      screensCount: 2
    });

    setIsModalOpen(false);
    setNewTitle('');
    setNewUserProblem('');
    setNewSolution('');
    setNewChecklistText('');
    setNewNotes('');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* 1. Header & Studio Overview */}
      <div className={`p-6 sm:p-7 rounded-2xl border ${
        isLight ? 'bg-white border-[#e9e9e7] shadow-xs' : 'bg-[#15151a] border-[#272732] shadow-sm'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Workflow className="w-4 h-4" />
              </span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400">
                Aeethod OS • Product & UX Architecture Hub
              </span>
            </div>
            <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              SaaS UX Planning Studio
            </h1>
            <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              The central workbench for your UI/UX designer to architect customer journeys, inspect the <strong>5 screen states</strong>,
              audit compliance against <strong>Nielsen's 10 Heuristics</strong>, and engineer zero-friction retail workflows.
            </p>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <div className={`px-4 py-3 rounded-xl border flex items-center gap-3 font-mono ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#1a1a22] border-[#2e2e3c]'
            }`}>
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Usability Health</span>
                <span className="text-base font-bold text-emerald-400">{usabilityScore} / 100</span>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-3 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-sm transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add UI/UX Spec</span>
            </button>
          </div>
        </div>

        {/* Studio Tabs Navigation */}
        <div className="mt-6 pt-5 border-t border-slate-700/20 flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('flows')}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium transition flex items-center gap-2 shrink-0 ${
              activeTab === 'flows'
                ? 'bg-indigo-600 text-white shadow-xs'
                : isLight
                ? 'text-slate-600 hover:bg-slate-100'
                : 'text-slate-400 hover:bg-[#22222a] hover:text-slate-200'
            }`}
          >
            <Workflow className="w-3.5 h-3.5" />
            <span>1. SaaS Flow Planner</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/20">4 Flows</span>
          </button>

          <button
            onClick={() => setActiveTab('states')}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium transition flex items-center gap-2 shrink-0 ${
              activeTab === 'states'
                ? 'bg-indigo-600 text-white shadow-xs'
                : isLight
                ? 'text-slate-600 hover:bg-slate-100'
                : 'text-slate-400 hover:bg-[#22222a] hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>2. 5-State Screen Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('heuristics')}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium transition flex items-center gap-2 shrink-0 ${
              activeTab === 'heuristics'
                ? 'bg-indigo-600 text-white shadow-xs'
                : isLight
                ? 'text-slate-600 hover:bg-slate-100'
                : 'text-slate-400 hover:bg-[#22222a] hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>3. Nielsen 10 Auditor</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
              {heuristicAudits.filter((h) => h.status === 'Pass').length}/10
            </span>
          </button>

          <button
            onClick={() => setActiveTab('personas')}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium transition flex items-center gap-2 shrink-0 ${
              activeTab === 'personas'
                ? 'bg-indigo-600 text-white shadow-xs'
                : isLight
                ? 'text-slate-600 hover:bg-slate-100'
                : 'text-slate-400 hover:bg-[#22222a] hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>4. Personas & Research</span>
          </button>

          <button
            onClick={() => setActiveTab('tokens')}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium transition flex items-center gap-2 shrink-0 ${
              activeTab === 'tokens'
                ? 'bg-indigo-600 text-white shadow-xs'
                : isLight
                ? 'text-slate-600 hover:bg-slate-100'
                : 'text-slate-400 hover:bg-[#22222a] hover:text-slate-200'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>5. Design Tokens & Shaders</span>
          </button>

          <button
            onClick={() => setActiveTab('metrics')}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium transition flex items-center gap-2 shrink-0 ${
              activeTab === 'metrics'
                ? 'bg-indigo-600 text-white shadow-xs'
                : isLight
                ? 'text-slate-600 hover:bg-slate-100'
                : 'text-slate-400 hover:bg-[#22222a] hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>6. UX Metrics & HEART</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: SAAS FLOW PLANNER                                                  */}
      {/* ========================================================================= */}
      {activeTab === 'flows' && (
        <div className="space-y-6">
          {/* Flow Selector Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {INITIAL_UX_FLOW_PLANS.map((flow) => {
              const isSelected = flow.id === selectedFlowId;
              return (
                <div
                  key={flow.id}
                  onClick={() => {
                    setSelectedFlowId(flow.id);
                    setSelectedStepId(flow.steps[0].id);
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition space-y-2.5 ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-500/10 shadow-xs'
                      : isLight
                      ? 'bg-white border-[#e9e9e7] hover:border-slate-300'
                      : 'bg-[#181820] border-[#292934] hover:border-[#383848]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400">
                      {flow.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 font-bold">
                      ⏱ {flow.targetSeconds}s Goal
                    </span>
                  </div>
                  <h4 className={`text-xs font-bold line-clamp-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {flow.flowName}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {flow.summary}
                  </p>
                  <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-700/20 font-mono text-slate-400">
                    <span>{flow.steps.length} Steps</span>
                    <span className="text-emerald-400 font-semibold">{flow.status}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Flow Canvas & Step Inspector */}
          <div className={`p-6 rounded-2xl border space-y-6 ${
            isLight ? 'bg-white border-[#e9e9e7]' : 'bg-[#16161c] border-[#292936]'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-indigo-400">Active User Flow Architecture</span>
                <h3 className={`text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {activeFlow.flowName}
                </h3>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
                <span>Target Persona:</span>
                <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 font-bold border border-purple-500/20">
                  {activeFlow.targetPersona}
                </span>
              </div>
            </div>

            {/* Visual Step Pipeline Nodes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {activeFlow.steps.map((step, idx) => {
                const isStepSelected = step.id === selectedStepId;
                return (
                  <div
                    key={step.id}
                    onClick={() => setSelectedStepId(step.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition space-y-2 relative ${
                      isStepSelected
                        ? 'border-indigo-500 bg-indigo-500/15 shadow-sm'
                        : isLight
                        ? 'bg-slate-50 border-slate-200 hover:border-indigo-300'
                        : 'bg-[#1c1c24] border-[#2e2e3c] hover:border-indigo-500/50'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-[10px]">
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                        {step.stepNumber}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded font-bold ${
                        step.frictionLevel === 'Low' ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10'
                      }`}>
                        {step.frictionLevel} Friction
                      </span>
                    </div>

                    <div className="font-bold text-xs line-clamp-1">{step.title}</div>
                    <div className="text-[10px] text-slate-400 line-clamp-2 leading-tight">
                      {step.userGoal}
                    </div>

                    {step.hotkey && (
                      <div className="pt-1 text-[9px] font-mono text-indigo-400">
                        ⚡ {step.hotkey}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Step Detail Inspector Card */}
            {activeStep && (
              <div className={`p-5 rounded-xl border space-y-4 ${
                isLight ? 'bg-indigo-50/40 border-indigo-200' : 'bg-[#1b1b24] border-[#313144]'
              }`}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-mono font-bold text-xs flex items-center justify-center">
                      #{activeStep.stepNumber}
                    </span>
                    <h4 className="font-bold text-sm">{activeStep.title}</h4>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-xs">
                    <span className="text-slate-400">Touch Target: <strong className="text-emerald-400">{activeStep.touchTargetSize}</strong></span>
                    {activeStep.hotkey && <span className="text-slate-400">Hotkey: <strong className="text-indigo-400">{activeStep.hotkey}</strong></span>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 rounded-lg bg-black/20 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">User Intent & Goal</span>
                    <p className="text-slate-300 leading-relaxed">{activeStep.userGoal}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-black/20 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block">Edge Cases & Fallbacks</span>
                    <p className="text-slate-300 leading-relaxed">{activeStep.edgeCaseNotes}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: 5-STATE SCREEN STUDIO                                              */}
      {/* ========================================================================= */}
      {activeTab === 'states' && (
        <div className="space-y-6">
          {/* Interactive State Demo Switcher */}
          <div className={`p-6 rounded-2xl border space-y-5 ${
            isLight ? 'bg-white border-[#e9e9e7]' : 'bg-[#16161c] border-[#292936]'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-purple-400">Mandatory UX Rule</span>
                <h3 className={`text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  The 5 Essential States of Every Screen
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Never hand off a screen to engineering with only the "Ideal State". Toggle states below to preview standard patterns:
                </p>
              </div>

              {/* State Pills */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/30 border border-slate-700/30 overflow-x-auto">
                {(['ideal', 'empty', 'loading', 'partial', 'error'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setActiveStateDemo(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase font-bold transition ${
                      activeStateDemo === st
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Interactive State Canvas */}
            <div className={`p-6 rounded-xl border min-h-[220px] flex items-center justify-center ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#111115] border-[#252530]'
            }`}>
              {activeStateDemo === 'ideal' && (
                <div className="w-full space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-700/20">
                    <span className="text-emerald-400 font-bold">✓ IDEAL STATE: Healthy Data Loaded (50 SKUs)</span>
                    <span className="text-slate-400">Total Valuation: $24,850.00</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
                    <div className="p-2.5 rounded-lg bg-black/30">Charizard Holo #4 • NM • $420.00</div>
                    <div className="p-2.5 rounded-lg bg-black/30">Pikachu Illustrator • PSA 10 • $8.4M</div>
                    <div className="p-2.5 rounded-lg bg-black/30">Gengar VMAX Alt Art • NM • $310.00</div>
                    <div className="p-2.5 rounded-lg bg-black/30">Umbreon Moonbreon • NM • $890.00</div>
                  </div>
                </div>
              )}

              {activeStateDemo === 'empty' && (
                <div className="text-center space-y-3 max-w-sm py-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mx-auto text-xl">
                    📦
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Your Counter Buylist Queue is Empty</h4>
                    <p className="text-xs text-slate-400 mt-1">Scan a card barcode or tap manual search to begin your first trade-in.</p>
                  </div>
                  <button className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white font-mono transition">
                    + Scan First Card Now
                  </button>
                </div>
              )}

              {activeStateDemo === 'loading' && (
                <div className="w-full space-y-3 animate-pulse">
                  <div className="h-4 bg-slate-700/30 rounded w-1/3" />
                  <div className="h-10 bg-slate-700/20 rounded w-full" />
                  <div className="h-10 bg-slate-700/20 rounded w-full" />
                  <div className="h-10 bg-slate-700/20 rounded w-full" />
                </div>
              )}

              {activeStateDemo === 'partial' && (
                <div className="w-full space-y-3 text-xs font-mono">
                  <div className="text-amber-400 font-bold">⚠️ PARTIAL STATE: Only 1 SKU matches filter "Manga Rare"</div>
                  <div className="p-3 rounded-lg bg-black/30 flex items-center justify-between">
                    <span>Monkey D. Luffy #OP05-119 • PSA 10 GEM</span>
                    <span className="text-emerald-400 font-bold">$3,850.00</span>
                  </div>
                  <button className="text-[11px] text-indigo-400 underline">Clear active filters</button>
                </div>
              )}

              {activeStateDemo === 'error' && (
                <div className="text-center space-y-3 max-w-md py-4">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto text-xl">
                    ⚠️
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-rose-400">Market Price Sync Interrupted</h4>
                    <p className="text-xs text-slate-400 mt-1">Could not connect to TCGplayer API. Offline daily buylist cache rate is active.</p>
                  </div>
                  <button className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white font-mono transition flex items-center gap-1.5 mx-auto">
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retry Live Connection</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Active UI/UX Specs Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Documented UI/UX Specifications ({filteredItems.length})
              </h3>
              <span className="text-xs text-slate-400 font-mono">Click cards to review checklists</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className={`p-5 rounded-2xl border space-y-4 transition ${
                    isLight ? 'bg-white border-[#e9e9e7]' : 'bg-[#181820] border-[#292934]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-400">
                      {item.category}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-bold">
                      {item.status}
                    </span>
                  </div>

                  <h4 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {item.title}
                  </h4>

                  <div className="space-y-2 text-xs">
                    <div className="p-3 rounded-xl bg-black/20 space-y-1">
                      <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">User Problem</span>
                      <p className="text-slate-300 leading-relaxed">{item.userProblem}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-black/20 space-y-1">
                      <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">UX Solution</span>
                      <p className="text-slate-300 leading-relaxed">{item.uxDesignSolution}</p>
                    </div>
                  </div>

                  {item.designChecklist && (
                    <div className="space-y-1 pt-2 border-t border-slate-700/20">
                      <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Design Checklist</span>
                      <div className="space-y-1">
                        {item.designChecklist.map((c, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-slate-300 font-mono">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                            <span>{c}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: NIELSEN 10 AUDITOR                                                 */}
      {/* ========================================================================= */}
      {activeTab === 'heuristics' && (
        <div className="space-y-6">
          <div className={`p-6 rounded-2xl border space-y-4 ${
            isLight ? 'bg-white border-[#e9e9e7]' : 'bg-[#16161c] border-[#292936]'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-emerald-400">Jakob Nielsen's Usability Gold Standard</span>
                <h3 className={`text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Aeethod OS Heuristic Audit Scorecard
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Click status tags to toggle between <strong className="text-emerald-400">Pass</strong>, <strong className="text-amber-400">Warning</strong>, and <strong className="text-rose-400">Fail</strong>.
                </p>
              </div>

              <div className="flex items-center gap-3 font-mono text-xs">
                <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  ✓ {heuristicAudits.filter((h) => h.status === 'Pass').length} Passing
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                  ! {heuristicAudits.filter((h) => h.status === 'Warning').length} Warnings
                </span>
              </div>
            </div>

            {/* Heuristics Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {heuristicAudits.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border space-y-3 transition ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#1b1b24] border-[#2d2d3c]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs">{item.name}</h4>
                    <button
                      type="button"
                      onClick={() => handleToggleHeuristicStatus(item.id)}
                      className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer transition ${
                        item.status === 'Pass'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : item.status === 'Warning'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {item.status} (Click to toggle)
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {item.summary}
                  </p>

                  <div className="p-2.5 rounded-lg bg-black/30 font-mono text-[11px] space-y-1">
                    <span className="text-[9px] uppercase text-indigo-400 font-bold block">Aeethod Implementation</span>
                    <p className="text-slate-300">{item.aeethodExample}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: PERSONAS & USER RESEARCH                                           */}
      {/* ========================================================================= */}
      {activeTab === 'personas' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {INITIAL_USER_PERSONAS.map((persona) => (
              <div
                key={persona.id}
                className={`p-6 rounded-2xl border space-y-4 ${
                  isLight ? 'bg-white border-[#e9e9e7]' : 'bg-[#181820] border-[#292934]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-2xl">
                    {persona.avatarEmoji}
                  </span>
                  <div>
                    <h4 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {persona.name}
                    </h4>
                    <span className="text-xs font-mono text-indigo-400">{persona.role}</span>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-black/20 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Environment & Context</span>
                    <p className="text-slate-300 leading-relaxed">{persona.environment}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">Primary Goal</span>
                    <p className="text-slate-200 leading-relaxed">{persona.primaryGoal}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-rose-400 font-bold block">Biggest Frustration</span>
                    <p className="text-slate-200 leading-relaxed">{persona.biggestFrustration}</p>
                  </div>

                  <div className="pt-2 space-y-1.5 font-mono text-[11px]">
                    <span className="text-[10px] uppercase text-slate-400 font-bold block">Essential UI Requirements</span>
                    <div className="flex flex-wrap gap-1.5">
                      {persona.keyUiRequirements.map((req, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-slate-700/20 text-slate-300 border border-slate-700/30">
                          ✓ {req}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: DESIGN TOKENS & SHADERS                                            */}
      {/* ========================================================================= */}
      {activeTab === 'tokens' && (
        <div className="space-y-6">
          {/* 3D Hologram Shader Playground */}
          <div className={`p-6 sm:p-7 rounded-2xl border ${isLight ? 'bg-white border-[#e9e9e7]' : 'bg-[#181820] border-[#292934]'}`}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 max-w-lg">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider font-mono">
                  <Sparkles className="w-4 h-4" />
                  <span>Live Micro-Interaction Shader</span>
                </div>
                <h3 className={`text-xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Dynamic 3D Holographic Card Tilt
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Hover your cursor or tilt the card below. Notice the realistic perspective rotation and radial shimmer glare mask.
                  Engineered with hardware acceleration (<code className="text-purple-300">will-change: transform</code>) for our premium collector storefronts.
                </p>
              </div>

              {/* Interactive Card Canvas */}
              <div
                onMouseMove={handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
                style={tiltStyle}
                className="w-56 h-76 rounded-2xl p-4 bg-gradient-to-br from-indigo-900 via-purple-950 to-slate-900 border-2 border-amber-400/60 shadow-2xl relative overflow-hidden cursor-pointer select-none shrink-0"
              >
                <div
                  style={glareStyle}
                  className="absolute inset-0 pointer-events-none mix-blend-color-dodge transition-opacity duration-150"
                />

                <div className="flex items-center justify-between text-[10px] font-mono font-bold text-amber-300">
                  <span>SPECIAL FOIL</span>
                  <span>PSA 10 GEM</span>
                </div>

                <div className="my-6 text-center space-y-1">
                  <div className="text-4xl">🏴‍☠️</div>
                  <div className="font-black text-sm text-white tracking-wide">Monkey D. Luffy</div>
                  <div className="text-[10px] text-amber-400 font-mono">Manga Rare #OP05-119</div>
                </div>

                <div className="absolute bottom-4 left-4 right-4 p-2.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-between font-mono text-xs">
                  <span className="text-slate-400 text-[10px]">Market Price</span>
                  <span className="text-emerald-400 font-bold">$3,850.00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Design System Token Swatches */}
          <div className={`p-6 rounded-2xl border space-y-4 ${
            isLight ? 'bg-white border-[#e9e9e7]' : 'bg-[#181820] border-[#292934]'
          }`}>
            <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Semantic Design Tokens (WCAG AA Certified)
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-[#0e0e12] border border-[#272732] text-white space-y-1">
                <span className="text-[10px] text-slate-400 block">Obsidian Dark</span>
                <span className="font-bold">#0E0E12</span>
                <span className="text-[10px] text-emerald-400 block">Canvas Root</span>
              </div>

              <div className="p-3 rounded-xl bg-[#10b981]/20 border border-[#10b981]/40 text-emerald-400 space-y-1">
                <span className="text-[10px] text-slate-400 block">Store Credit Green</span>
                <span className="font-bold">#10B981</span>
                <span className="text-[10px] text-emerald-400 block">Positive Spread</span>
              </div>

              <div className="p-3 rounded-xl bg-[#f43f5e]/20 border border-[#f43f5e]/40 text-rose-400 space-y-1">
                <span className="text-[10px] text-slate-400 block">Cash Out Crimson</span>
                <span className="font-bold">#F43F5E</span>
                <span className="text-[10px] text-rose-400 block">Payout Alert</span>
              </div>

              <div className="p-3 rounded-xl bg-[#6366f1]/20 border border-[#6366f1]/40 text-indigo-400 space-y-1">
                <span className="text-[10px] text-slate-400 block">Primary Action Indigo</span>
                <span className="font-bold">#6366F1</span>
                <span className="text-[10px] text-indigo-400 block">Global CTA</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: UX METRICS & HEART TARGETS                                         */}
      {/* ========================================================================= */}
      {activeTab === 'metrics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {INITIAL_UX_METRIC_TARGETS.map((metric) => (
              <div
                key={metric.id}
                className={`p-5 rounded-2xl border space-y-3 ${
                  isLight ? 'bg-white border-[#e9e9e7]' : 'bg-[#181820] border-[#292934]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-400">
                    {metric.category}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10">
                    {metric.status}
                  </span>
                </div>

                <h4 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {metric.name}
                </h4>

                <div className="flex items-center justify-between font-mono pt-1">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Target Benchmark</span>
                    <span className="text-sm font-bold text-slate-300">{metric.targetValue}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Current Status</span>
                    <span className="text-lg font-black text-emerald-400">{metric.currentValue}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-black/20 text-xs text-slate-400 leading-relaxed border-t border-slate-700/20">
                  {metric.businessImpact}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADD UI/UX SPEC MODAL                                                      */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className={`rounded-2xl border w-full max-w-lg p-6 space-y-4 shadow-2xl animate-slide-in ${
            isLight ? 'bg-white border-[#e9e9e7]' : 'bg-[#1a1a22] border-[#2f2f3d]'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/20">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <Plus className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-sm font-bold">Create New UI/UX Specification</h3>
                  <p className="text-[11px] text-slate-400">Add a component, flow, or ergonomic guideline</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSpec} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-mono uppercase mb-1 text-slate-400">Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Rapid Barcode Scanner Buffer & Audio Ping"
                  className={`w-full px-3 py-2 rounded-lg border outline-none font-sans text-xs ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-[#22222c] border-[#343444] text-white'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase mb-1 text-slate-400">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as UiUxCategory)}
                    className={`w-full px-2.5 py-2 rounded-lg border outline-none font-sans text-xs ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-[#22222c] border-[#343444] text-white'
                    }`}
                  >
                    <option value="Component Library">Component Library</option>
                    <option value="Wireframe & Flow">Wireframe & Flow</option>
                    <option value="Design System & Tokens">Design System & Tokens</option>
                    <option value="Micro-Interaction">Micro-Interaction</option>
                    <option value="Usability Audit">Usability Audit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase mb-1 text-slate-400">Target Surface</label>
                  <select
                    value={newSurface}
                    onChange={(e) => setNewSurface(e.target.value as UiUxTargetSurface)}
                    className={`w-full px-2.5 py-2 rounded-lg border outline-none font-sans text-xs ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-[#22222c] border-[#343444] text-white'
                    }`}
                  >
                    <option value="Desktop App">Desktop App</option>
                    <option value="POS Counter Kiosk">POS Counter Kiosk</option>
                    <option value="Mobile Collector">Mobile Collector</option>
                    <option value="Customer Storefront">Customer Storefront</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase mb-1 text-slate-400">User Problem</label>
                <textarea
                  rows={2}
                  value={newUserProblem}
                  onChange={(e) => setNewUserProblem(e.target.value)}
                  placeholder="What friction or delay is the clerk or customer facing?"
                  className={`w-full px-3 py-2 rounded-lg border outline-none resize-none ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-[#22222c] border-[#343444] text-white'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase mb-1 text-slate-400">UX Design Solution</label>
                <textarea
                  rows={2}
                  value={newSolution}
                  onChange={(e) => setNewSolution(e.target.value)}
                  placeholder="How does your layout, hotkey, or component eliminate the problem?"
                  className={`w-full px-3 py-2 rounded-lg border outline-none resize-none ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-[#22222c] border-[#343444] text-white'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase mb-1 text-slate-400">Checklist Items (One per line)</label>
                <textarea
                  rows={2}
                  value={newChecklistText}
                  onChange={(e) => setNewChecklistText(e.target.value)}
                  placeholder="e.g. Touch target >= 48px&#10;Numpad enter shortcut"
                  className={`w-full px-3 py-2 rounded-lg border outline-none resize-none font-mono text-xs ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-[#22222c] border-[#343444] text-white'
                  }`}
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-700/20">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-sm"
                >
                  Save Specification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
