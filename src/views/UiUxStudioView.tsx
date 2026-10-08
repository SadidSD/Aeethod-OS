import React, { useState, useMemo, useEffect } from 'react';
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
  ChevronLeft,
  Target,
  Zap,
  RotateCcw,
  Copy,
  Check,
  PanelLeft,
  PanelRight,
  GitBranch,
  Volume2,
  CreditCard,
  Printer,
  QrCode,
  FileText
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
  UxSitemapNode,
  UxScreenStateSpec,
  UxKanbanTask,
  INITIAL_UI_UX_ITEMS,
  INITIAL_UX_FLOW_PLANS,
  INITIAL_HEURISTIC_AUDITS,
  INITIAL_USER_PERSONAS,
  INITIAL_UX_METRIC_TARGETS,
  INITIAL_SITEMAP_NODES,
  INITIAL_SCREEN_STATES,
  INITIAL_UX_KANBAN_TASKS
} from '../data/uiUxData';

type WorkbenchTab = 'sitemap' | 'flows' | 'states' | 'heuristics' | 'tokens' | 'personas' | 'kanban';

export const UiUxStudioView: React.FC = () => {
  const { theme, db, create } = useStore();
  const isLight = theme === 'light';

  // 3-Pane Layout State
  const [isLeftRailOpen, setIsLeftRailOpen] = useState(true);
  const [isRightRailOpen, setIsRightRailOpen] = useState(true);
  const [activeWorkbench, setActiveWorkbench] = useState<WorkbenchTab>('flows');

  // Sitemap & IA Tree State
  const [sitemapNodes] = useState<UxSitemapNode[]>(INITIAL_SITEMAP_NODES);
  const [selectedSitemapNodeId, setSelectedSitemapNodeId] = useState<string>('site-buylist');
  const [sitemapRoleFilter, setSitemapRoleFilter] = useState<string>('All');

  // Flows State
  const [flows, setFlows] = useState<UxFlowPlan[]>(INITIAL_UX_FLOW_PLANS);
  const [selectedFlowId, setSelectedFlowId] = useState<string>('flow-buylist');
  const [selectedStepId, setSelectedStepId] = useState<string>('b-1');

  // 5-State Matrix State
  const [screenStates] = useState<UxScreenStateSpec[]>(INITIAL_SCREEN_STATES);
  const [selectedScreenId, setSelectedScreenId] = useState<string>('screen-buylist');
  const [activeStateDemo, setActiveStateDemo] = useState<'ideal' | 'empty' | 'loading' | 'partial' | 'error'>('ideal');

  // Heuristics Audit State
  const [heuristicAudits, setHeuristicAudits] = useState<HeuristicAuditItem[]>(INITIAL_HEURISTIC_AUDITS);
  const [selectedHeuristicId, setSelectedHeuristicId] = useState<number>(1);
  const [ticketToast, setTicketToast] = useState<string | null>(null);

  // Personas State
  const [personas] = useState<UserPersona[]>(INITIAL_USER_PERSONAS);
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>('persona-1');

  // Kanban Tasks State
  const [kanbanTasks, setKanbanTasks] = useState<UxKanbanTask[]>(INITIAL_UX_KANBAN_TASKS);
  const [selectedKanbanTaskId, setSelectedKanbanTaskId] = useState<string>('k-1');

  // Export / Copy Feedback
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  // Add Item Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<UiUxCategory>('Component Library');
  const [newSurface, setNewSurface] = useState<UiUxTargetSurface>('Desktop App');
  const [newStatus, setNewStatus] = useState<UiUxStatus>('In Figma / Wireframe');
  const [newUserProblem, setNewUserProblem] = useState('');
  const [newSolution, setNewSolution] = useState('');
  const [newChecklistText, setNewChecklistText] = useState('');

  // Interactive 3D Holographic Card Shader State
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});
  const [glareStyle, setGlareStyle] = useState<React.CSSProperties>({});

  // Keyboard shortcut navigation (1-7, [, ])
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.key === '1') setActiveWorkbench('sitemap');
      else if (e.key === '2') setActiveWorkbench('flows');
      else if (e.key === '3') setActiveWorkbench('states');
      else if (e.key === '4') setActiveWorkbench('heuristics');
      else if (e.key === '5') setActiveWorkbench('tokens');
      else if (e.key === '6') setActiveWorkbench('personas');
      else if (e.key === '7') setActiveWorkbench('kanban');
      else if (e.key === '[') setIsLeftRailOpen((prev) => !prev);
      else if (e.key === ']') setIsRightRailOpen((prev) => !prev);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Web Audio API Barcode Scanner Beep Simulator
  const playBarcodeScannerBeep = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtx();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // 880 Hz standard retail beep
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.12);
    } catch {
      // Ignore if audio permissions blocked
    }
  };

  // Holographic Tilt Physics
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

  // Selected Active Items
  const activeFlow = useMemo(() => {
    return flows.find((f) => f.id === selectedFlowId) || flows[0];
  }, [flows, selectedFlowId]);

  const activeStep = useMemo(() => {
    return activeFlow.steps.find((s) => s.id === selectedStepId) || activeFlow.steps[0];
  }, [activeFlow, selectedStepId]);

  const activeSitemapNode = useMemo(() => {
    return sitemapNodes.find((n) => n.id === selectedSitemapNodeId) || sitemapNodes[0];
  }, [sitemapNodes, selectedSitemapNodeId]);

  const activeScreenState = useMemo(() => {
    return screenStates.find((s) => s.screenId === selectedScreenId) || screenStates[0];
  }, [screenStates, selectedScreenId]);

  const activeHeuristic = useMemo(() => {
    return heuristicAudits.find((h) => h.id === selectedHeuristicId) || heuristicAudits[0];
  }, [heuristicAudits, selectedHeuristicId]);

  const activePersona = useMemo(() => {
    return personas.find((p) => p.id === selectedPersonaId) || personas[0];
  }, [personas, selectedPersonaId]);

  const activeKanbanTask = useMemo(() => {
    return kanbanTasks.find((k) => k.id === selectedKanbanTaskId) || kanbanTasks[0];
  }, [kanbanTasks, selectedKanbanTaskId]);

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

  const handleConvertHeuristicToTicket = (heuristic: HeuristicAuditItem) => {
    create('tasks', {
      title: `UX Debt: Fix Heuristic #${heuristic.id} (${heuristic.name}) in ${heuristic.aeethodExample.substring(0, 30)}...`,
      status: 'todo',
      priority: heuristic.severity === 'Major' ? 'high' : 'normal',
      order: 0,
      description: `Audit Action Item: ${heuristic.notes}\nRule: ${heuristic.summary}`
    });
    setTicketToast(`Converted Heuristic #${heuristic.id} into Jira/Task ticket!`);
    setTimeout(() => setTicketToast(null), 3000);
  };

  // Move Kanban Task
  const handleMoveKanban = (taskId: string, direction: 'prev' | 'next') => {
    const columns: UxKanbanTask['column'][] = ['jtbd', 'wireframe', 'figma', 'tested', 'dev_ready', 'shipped'];
    setKanbanTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const currentIndex = columns.indexOf(t.column);
        const nextIndex = direction === 'next' ? Math.min(columns.length - 1, currentIndex + 1) : Math.max(0, currentIndex - 1);
        return { ...t, column: columns[nextIndex] };
      })
    );
  };

  // Copy Markdown Dev Handoff
  const handleCopyMarkdownSpec = () => {
    const spec = `### Aeethod OS — UX Specification Handoff
**Component / Flow:** ${activeFlow.flowName}
**Selected Step:** ${activeStep.stepNumber}. ${activeStep.title}
**Target Persona:** ${activeFlow.targetPersona}
**Target Duration:** ${activeFlow.targetSeconds}s
**User Goal:** ${activeStep.userGoal}

**Branching Logic:**
${activeStep.branchCondition || 'Linear transition'}

**Physical Retail Ergonomics:**
- Touch Target Size: ${activeStep.touchTargetSize} (Rule: >=48px for iPad POS)
- Friction Rating: ${activeStep.frictionLevel}
- Hardware Trigger: ${activeStep.hardwareTrigger || 'None'}
- Keyboard Accelerator: ${activeStep.hotkey || 'None'}

**Edge Cases & Fallbacks:**
${activeStep.edgeCaseNotes}
`;
    navigator.clipboard.writeText(spec);
    setCopiedNotification('Markdown Spec copied to clipboard!');
    setTimeout(() => setCopiedNotification(null), 2500);
  };

  const handleCopyJsonTokens = () => {
    const tokens = JSON.stringify(
      {
        palette: {
          canvasDark: '#0c0c10',
          cardSurface: '#15151c',
          borderSubtle: '#262632',
          primaryIndigo: '#6366f1',
          storeCreditEmerald: '#10b981',
          cashOutRose: '#f43f5e'
        },
        typography: {
          uiHeadline: 'Plus Jakarta Sans',
          numbersAndPrices: 'JetBrains Mono',
          minTouchTarget: '48px'
        },
        activeStep: activeStep
      },
      null,
      2
    );
    navigator.clipboard.writeText(tokens);
    setCopiedNotification('Design Tokens JSON copied to clipboard!');
    setTimeout(() => setCopiedNotification(null), 2500);
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
      screensCount: 2
    });

    setIsModalOpen(false);
    setNewTitle('');
    setNewUserProblem('');
    setNewSolution('');
    setNewChecklistText('');
  };

  return (
    <div className="space-y-4 animate-fade-in pb-16 font-sans">
      {/* ========================================================================= */}
      {/* 1. TOP STUDIO CONTROL BAR & HEADER                                        */}
      {/* ========================================================================= */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border transition ${
          isLight ? 'bg-white border-[#e9e9e7] shadow-xs' : 'bg-[#15151c] border-[#262632] shadow-sm'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Workflow className="w-4 h-4" />
              </span>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-400">
                Aeethod OS • SaaS Product & UX Planning Studio
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                Linear-Grade 3-Pane Canvas
              </span>
            </div>
            <h1 className={`text-xl sm:text-2xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              The SaaS Experience Operating System
            </h1>
            <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Architect complete card shop workflows, enforce the <strong>5-State Screen Discipline</strong>, audit{' '}
              <strong>Nielsen's 10 Heuristics</strong>, and hand off bulletproof specs to engineering.
            </p>
          </div>

          {/* Quick Metrics & Pane Toggles */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div
              className={`px-3.5 py-2 rounded-xl border flex items-center gap-2.5 font-mono ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#1a1a24] border-[#2c2c3a]'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="text-[9px] text-slate-400 uppercase block">Usability Health</span>
                <span className="text-xs font-bold text-emerald-400">{usabilityScore} / 100</span>
              </div>
            </div>

            <div className="flex items-center gap-1 border-l border-slate-700/30 pl-2">
              <button
                onClick={() => setIsLeftRailOpen((prev) => !prev)}
                title="Toggle Architecture Navigator (Hotkey: [)"
                className={`p-2 rounded-xl border text-xs font-mono transition flex items-center gap-1.5 ${
                  isLeftRailOpen
                    ? 'bg-indigo-600/15 border-indigo-500/30 text-indigo-400'
                    : isLight
                    ? 'bg-slate-100 border-slate-200 text-slate-600'
                    : 'bg-[#1a1a24] border-[#2c2c3a] text-slate-400'
                }`}
              >
                <PanelLeft className="w-3.5 h-3.5" />
                <span className="text-[10px] hidden sm:inline">Nav [</span>
              </button>

              <button
                onClick={() => setIsRightRailOpen((prev) => !prev)}
                title="Toggle Contextual Inspector (Hotkey: ])"
                className={`p-2 rounded-xl border text-xs font-mono transition flex items-center gap-1.5 ${
                  isRightRailOpen
                    ? 'bg-indigo-600/15 border-indigo-500/30 text-indigo-400'
                    : isLight
                    ? 'bg-slate-100 border-slate-200 text-slate-600'
                    : 'bg-[#1a1a24] border-[#2c2c3a] text-slate-400'
                }`}
              >
                <PanelRight className="w-3.5 h-3.5" />
                <span className="text-[10px] hidden sm:inline">Inspector ]</span>
              </button>

              <button
                onClick={() => setIsModalOpen(true)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-xs transition flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Spec</span>
              </button>
            </div>
          </div>
        </div>

        {/* Global Toast Notification */}
        {copiedNotification && (
          <div className="mt-3 px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-fade-in">
            <Check className="w-3.5 h-3.5" />
            <span>{copiedNotification}</span>
          </div>
        )}

        {ticketToast && (
          <div className="mt-3 px-3 py-1.5 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-mono flex items-center gap-2 animate-fade-in">
            <Check className="w-3.5 h-3.5" />
            <span>{ticketToast}</span>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. THREE-PANE MASTER-DETAIL LAYOUT                                        */}
      {/* ========================================================================= */}
      <div className="flex gap-4 items-start min-h-[750px]">
        {/* ----------------------------------------------------------------------- */}
        {/* PANE 1: LEFT RAIL - ARCHITECTURE NAVIGATOR (260px)                      */}
        {/* ----------------------------------------------------------------------- */}
        {isLeftRailOpen && (
          <aside
            className={`w-64 shrink-0 rounded-2xl border p-4 space-y-5 transition animate-slide-in ${
              isLight ? 'bg-white border-[#e9e9e7]' : 'bg-[#15151c] border-[#262632]'
            }`}
          >
            {/* Workbench Switcher */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase text-slate-400 font-bold px-1">
                <span>7 Workbenches</span>
                <span className="text-slate-500">Keys 1-7</span>
              </div>

              <div className="space-y-1">
                {[
                  { id: 'sitemap' as WorkbenchTab, label: '1. Sitemap & IA Tree', icon: Workflow, key: '1' },
                  { id: 'flows' as WorkbenchTab, label: '2. Flow & Branching', icon: GitBranch, key: '2' },
                  { id: 'states' as WorkbenchTab, label: '3. 5-State Screen Matrix', icon: Layers, key: '3' },
                  { id: 'heuristics' as WorkbenchTab, label: '4. Nielsen 10 Auditor', icon: ShieldCheck, key: '4', badge: `${usabilityScore}%` },
                  { id: 'tokens' as WorkbenchTab, label: '5. Tokens & Shaders', icon: Palette, key: '5' },
                  { id: 'personas' as WorkbenchTab, label: '6. Personas & Vault', icon: Users, key: '6' },
                  { id: 'kanban' as WorkbenchTab, label: '7. UX Delivery Kanban', icon: CheckSquare, key: '7' }
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeWorkbench === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveWorkbench(item.id)}
                      className={`w-full px-3 py-2 rounded-xl text-xs font-medium transition flex items-center justify-between text-left ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                          : isLight
                          ? 'text-slate-700 hover:bg-slate-100'
                          : 'text-slate-400 hover:bg-[#20202a] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 font-mono text-[10px]">
                        {item.badge && (
                          <span
                            className={`px-1 rounded ${
                              isActive ? 'bg-white/20 text-white' : 'bg-emerald-500/15 text-emerald-400'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                        <span className={`px-1 py-0.2 rounded ${isActive ? 'bg-black/20' : 'bg-slate-700/20 text-slate-500'}`}>
                          {item.key}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SaaS Sitemap Quick Navigator */}
            <div className="pt-3 border-t border-slate-700/20 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase text-slate-400 font-bold px-1">
                <span>Sitemap Routes</span>
                <span className="text-slate-500">{sitemapNodes.length}</span>
              </div>

              <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
                {sitemapNodes.map((node) => {
                  const isSelected = selectedSitemapNodeId === node.id;
                  return (
                    <div
                      key={node.id}
                      onClick={() => {
                        setSelectedSitemapNodeId(node.id);
                        if (activeWorkbench !== 'sitemap') setActiveWorkbench('sitemap');
                      }}
                      className={`p-2 rounded-lg cursor-pointer transition text-xs flex items-center justify-between ${
                        isSelected
                          ? 'bg-indigo-500/15 border border-indigo-500/30 text-indigo-300'
                          : isLight
                          ? 'hover:bg-slate-100 text-slate-600'
                          : 'hover:bg-[#20202a] text-slate-400'
                      }`}
                    >
                      <div className="truncate">
                        <span className="font-mono text-[11px] block text-indigo-400 truncate">{node.route}</span>
                        <span className="text-[11px] truncate block text-slate-300">{node.title}</span>
                      </div>
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          node.status === 'Shipped'
                            ? 'bg-emerald-400'
                            : node.status === 'In Prototype'
                            ? 'bg-indigo-400'
                            : node.status === 'Wireframing'
                            ? 'bg-amber-400'
                            : 'bg-slate-500'
                        }`}
                        title={node.status}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Designer Ergonomics Banner */}
            <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-950/40 to-purple-950/40 border border-indigo-500/20 space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5 text-indigo-300 font-bold text-[11px]">
                <Target className="w-3.5 h-3.5" />
                <span>Design 1 Sprint Ahead</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Always validate 5-state matrices and run 5 store owner interviews before engineering commits code.
              </p>
            </div>
          </aside>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* PANE 2: CENTER STAGE - WORKBENCH CANVAS (Flexible)                      */}
        {/* ----------------------------------------------------------------------- */}
        <main className="flex-1 min-w-0 space-y-4">
          {/* Breadcrumb Context Bar */}
          <div
            className={`px-4 py-2.5 rounded-xl border flex items-center justify-between text-xs font-mono ${
              isLight ? 'bg-white border-[#e9e9e7] text-slate-600' : 'bg-[#15151c] border-[#262632] text-slate-400'
            }`}
          >
            <div className="flex items-center gap-2 truncate">
              <span className="text-indigo-400">Aeethod OS</span>
              <ChevronRight className="w-3 h-3 text-slate-600" />
              <span className="capitalize">{activeWorkbench} Workbench</span>
              <ChevronRight className="w-3 h-3 text-slate-600" />
              <span className="text-slate-200 font-semibold truncate">
                {activeWorkbench === 'flows' && activeFlow.flowName}
                {activeWorkbench === 'sitemap' && activeSitemapNode.title}
                {activeWorkbench === 'states' && activeScreenState.screenTitle}
                {activeWorkbench === 'heuristics' && activeHeuristic.name}
                {activeWorkbench === 'personas' && activePersona.name}
                {activeWorkbench === 'tokens' && 'Obsidian Design Tokens & Holographic Tilt'}
                {activeWorkbench === 'kanban' && activeKanbanTask.title}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-500 hidden md:inline">Press E to Export Spec</span>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* WORKBENCH 1: SITEMAP & IA TREE                                        */}
          {/* ===================================================================== */}
          {activeWorkbench === 'sitemap' && (
            <div className="space-y-4 animate-fade-in">
              <div
                className={`p-5 rounded-2xl border space-y-4 ${
                  isLight ? 'bg-white border-[#e9e9e7]' : 'bg-[#15151c] border-[#262632]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      SaaS Route Architecture & Information Hierarchy
                    </h3>
                    <p className="text-xs text-slate-400">
                      Every URL route in Aeethod OS mapped with user roles, kiosk vs desktop layout types, and 5-state completion.
                    </p>
                  </div>

                  {/* Role Filter */}
                  <div className="flex items-center gap-1.5">
                    {['All', 'Clerk', 'Manager', 'Store Owner', 'Collector'].map((role) => (
                      <button
                        key={role}
                        onClick={() => setSitemapRoleFilter(role)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono transition ${
                          sitemapRoleFilter === role
                            ? 'bg-indigo-600 text-white font-bold'
                            : isLight
                            ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            : 'bg-[#20202a] text-slate-400 hover:text-white'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Route Tree Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  {sitemapNodes
                    .filter((n) => sitemapRoleFilter === 'All' || n.role === sitemapRoleFilter)
                    .map((node) => {
                      const isSelected = node.id === selectedSitemapNodeId;
                      const definedCount = Object.values(node.statesDefined).filter(Boolean).length;
                      return (
                        <div
                          key={node.id}
                          onClick={() => setSelectedSitemapNodeId(node.id)}
                          className={`p-4 rounded-xl border cursor-pointer transition space-y-2.5 ${
                            isSelected
                              ? 'border-indigo-500 bg-indigo-500/10 shadow-xs'
                              : isLight
                              ? 'bg-slate-50 border-slate-200 hover:border-slate-300'
                              : 'bg-[#1a1a24] border-[#282836] hover:border-[#38384a]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-500/15 px-2 py-0.5 rounded">
                              {node.route}
                            </span>
                            <div className="flex items-center gap-1.5 font-mono text-[10px]">
                              <span className="px-2 py-0.5 rounded bg-slate-700/30 text-slate-300">{node.layoutType}</span>
                              <span
                                className={`px-2 py-0.5 rounded font-bold ${
                                  node.status === 'Shipped'
                                    ? 'bg-emerald-500/20 text-emerald-300'
                                    : node.status === 'In Prototype'
                                    ? 'bg-indigo-500/20 text-indigo-300'
                                    : 'bg-amber-500/20 text-amber-300'
                                }`}
                              >
                                {node.status}
                              </span>
                            </div>
                          </div>

                          <h4 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{node.title}</h4>
                          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{node.notes}</p>

                          {/* 5-States Compliance Badges */}
                          <div className="pt-2 border-t border-slate-700/20 flex items-center justify-between text-[10px] font-mono">
                            <span className="text-slate-400">5-State Spec:</span>
                            <div className="flex items-center gap-1">
                              {(['ideal', 'empty', 'loading', 'partial', 'error'] as const).map((st) => (
                                <span
                                  key={st}
                                  className={`px-1.5 py-0.2 rounded capitalize ${
                                    node.statesDefined[st]
                                      ? 'bg-emerald-500/20 text-emerald-400 font-bold'
                                      : 'bg-slate-700/20 text-slate-500'
                                  }`}
                                >
                                  {st[0].toUpperCase()}
                                </span>
                              ))}
                              <span className="text-slate-400 ml-1">({definedCount}/5)</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* WORKBENCH 2: FLOW & BRANCHING LOGIC GRAPH                             */}
          {/* ===================================================================== */}
          {activeWorkbench === 'flows' && (
            <div className="space-y-4 animate-fade-in">
              {/* Flow Selector Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {flows.map((flow) => {
                  const isSelected = flow.id === selectedFlowId;
                  return (
                    <div
                      key={flow.id}
                      onClick={() => {
                        setSelectedFlowId(flow.id);
                        setSelectedStepId(flow.steps[0].id);
                      }}
                      className={`p-3.5 rounded-xl border cursor-pointer transition space-y-2 ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-500/10 shadow-xs'
                          : isLight
                          ? 'bg-white border-[#e9e9e7] hover:border-slate-300'
                          : 'bg-[#181820] border-[#292934] hover:border-[#383848]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase font-bold text-indigo-400 bg-indigo-500/15 px-2 py-0.5 rounded">
                          {flow.category}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400">{flow.targetSeconds}s Goal</span>
                      </div>
                      <h3 className={`text-xs font-bold leading-snug ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {flow.flowName}
                      </h3>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-700/20">
                        <span>{flow.steps.length} Steps</span>
                        <span className="font-mono text-indigo-300">{flow.status}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Active Flow Detailed Step Flowchart */}
              <div
                className={`p-5 rounded-2xl border space-y-5 ${
                  isLight ? 'bg-white border-[#e9e9e7]' : 'bg-[#15151c] border-[#262632]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-700/20">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                        Flow Architecture
                      </span>
                      <span className="text-xs text-slate-400">• Persona: {activeFlow.targetPersona}</span>
                    </div>
                    <h2 className={`text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{activeFlow.flowName}</h2>
                    <p className="text-xs text-slate-400">{activeFlow.summary}</p>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                      ⚡ Target: {activeFlow.targetSeconds}s
                    </span>
                  </div>
                </div>

                {/* Steps Flowchart with Branching Logic */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-mono uppercase text-slate-400 font-bold px-1">
                    <span>Sequential Steps & Branching Decisions</span>
                    <span>Click any step to inspect</span>
                  </div>

                  <div className="space-y-3">
                    {activeFlow.steps.map((step, idx) => {
                      const isSelected = step.id === selectedStepId;
                      return (
                        <div
                          key={step.id}
                          onClick={() => setSelectedStepId(step.id)}
                          className={`p-4 rounded-xl border transition cursor-pointer space-y-2.5 ${
                            isSelected
                              ? 'border-indigo-500 bg-indigo-500/10 ring-1 ring-indigo-500/30'
                              : isLight
                              ? 'bg-slate-50 border-slate-200 hover:border-slate-300'
                              : 'bg-[#1a1a24] border-[#282836] hover:border-[#38384a]'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-3">
                              <span
                                className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                                  isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-700/30 text-slate-300'
                                }`}
                              >
                                {step.stepNumber}
                              </span>
                              <div>
                                <h4 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                                  {step.title}
                                </h4>
                                <span className="text-xs text-slate-400 font-sans block">{step.userGoal}</span>
                              </div>
                            </div>

                            {/* Tags: Hardware, Touch target, Hotkey */}
                            <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px]">
                              {step.hardwareTrigger && step.hardwareTrigger !== 'None' && (
                                <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 flex items-center gap-1">
                                  {step.hardwareTrigger === 'Barcode Scan' && <QrCode className="w-3 h-3" />}
                                  {step.hardwareTrigger === 'Thermal Print' && <Printer className="w-3 h-3" />}
                                  {step.hardwareTrigger === 'Cash Drawer Kick' && <CreditCard className="w-3 h-3" />}
                                  <span>{step.hardwareTrigger}</span>
                                </span>
                              )}

                              {step.hotkey && (
                                <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                  ⌨ {step.hotkey}
                                </span>
                              )}

                              <span
                                className={`px-2 py-0.5 rounded ${
                                  parseInt(step.touchTargetSize, 10) >= 48
                                    ? 'bg-emerald-500/15 text-emerald-400'
                                    : 'bg-amber-500/15 text-amber-400'
                                }`}
                              >
                                Touch: {step.touchTargetSize}
                              </span>

                              <span
                                className={`px-2 py-0.5 rounded font-bold ${
                                  step.frictionLevel === 'Low'
                                    ? 'bg-emerald-500/10 text-emerald-400'
                                    : step.frictionLevel === 'Medium'
                                    ? 'bg-amber-500/10 text-amber-400'
                                    : 'bg-rose-500/10 text-rose-400'
                                }`}
                              >
                                {step.frictionLevel} Friction
                              </span>
                            </div>
                          </div>

                          {/* Branching Logic Box */}
                          {step.branchCondition && (
                            <div className="p-2.5 rounded-lg bg-black/25 border border-indigo-500/20 text-xs font-mono space-y-1">
                              <span className="text-[10px] text-indigo-400 uppercase font-bold flex items-center gap-1">
                                <GitBranch className="w-3 h-3" /> Branching Logic & Error Tree:
                              </span>
                              <p className="text-slate-300 text-[11px] leading-relaxed">{step.branchCondition}</p>
                            </div>
                          )}

                          {/* Edge Case Warning */}
                          <div className="text-[11px] text-slate-400 flex items-start gap-1.5 pt-1">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                            <span>
                              <strong>Edge Case:</strong> {step.edgeCaseNotes}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* WORKBENCH 3: 5-STATE SCREEN MATRIX                                    */}
          {/* ===================================================================== */}
          {activeWorkbench === 'states' && (
            <div className="space-y-4 animate-fade-in">
              {/* Screen Selector Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {screenStates.map((s) => (
                  <button
                    key={s.screenId}
                    onClick={() => setSelectedScreenId(s.screenId)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium transition shrink-0 flex items-center gap-2 ${
                      selectedScreenId === s.screenId
                        ? 'bg-indigo-600 text-white font-bold'
                        : isLight
                        ? 'bg-white border border-[#e9e9e7] text-slate-600'
                        : 'bg-[#181820] border border-[#292934] text-slate-400 hover:text-white'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>{s.screenTitle}</span>
                    <span className="text-[10px] font-mono text-indigo-300">{s.route}</span>
                  </button>
                ))}
              </div>

              {/* State Previewer Container */}
              <div
                className={`p-6 rounded-2xl border space-y-6 ${
                  isLight ? 'bg-white border-[#e9e9e7]' : 'bg-[#15151c] border-[#262632]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      5-State Matrix Engine: {activeScreenState.screenTitle}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Engineering specification for all five states. Zero blank screens, zero layout shifts.
                    </p>
                  </div>

                  {/* 5 State Buttons */}
                  <div className="flex items-center gap-1 bg-black/25 p-1 rounded-xl border border-slate-700/20">
                    {(
                      [
                        { id: 'ideal', label: '1. Ideal' },
                        { id: 'empty', label: '2. Empty' },
                        { id: 'loading', label: '3. Loading' },
                        { id: 'partial', label: '4. Partial' },
                        { id: 'error', label: '5. Error/Offline' }
                      ] as const
                    ).map((st) => (
                      <button
                        key={st.id}
                        onClick={() => setActiveStateDemo(st.id)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition ${
                          activeStateDemo === st.id
                            ? 'bg-indigo-600 text-white font-bold shadow-xs'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* State Interactive Simulation Box */}
                <div
                  className={`p-6 rounded-xl border min-h-[320px] flex flex-col justify-center items-center text-center ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#101016] border-[#20202c]'
                  }`}
                >
                  {/* State 1: Ideal */}
                  {activeStateDemo === 'ideal' && (
                    <div className="w-full space-y-4 max-w-xl text-left animate-fade-in">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-700/20 font-mono text-xs">
                        <span className="text-emerald-400 font-bold">✓ IDEAL STATE (POPULATED DATA)</span>
                        <span className="text-slate-400">12 Items in Queue • 60 FPS</span>
                      </div>
                      <div className="space-y-2">
                        {[
                          { name: 'Charizard Base Set #4 Holo', cond: 'NM', price: '$420.00', credit: '$546.00 (+30%)' },
                          { name: 'Pikachu Illustrator Promo', cond: 'PSA 9', price: '$1,850.00', credit: '$2,405.00' },
                          { name: 'Gengar VMAX Fusion Strike Alt', cond: 'LP', price: '$210.00', credit: '$273.00' }
                        ].map((card, i) => (
                          <div
                            key={i}
                            className="p-3 rounded-xl bg-[#191922] border border-[#2c2c3e] flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="p-1.5 rounded bg-indigo-500/20 text-indigo-400 font-mono font-bold">
                                {card.cond}
                              </span>
                              <span className="font-bold text-white">{card.name}</span>
                            </div>
                            <div className="text-right font-mono">
                              <span className="text-emerald-400 font-bold block">{card.price} Cash</span>
                              <span className="text-[10px] text-indigo-400">{card.credit} Credit</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-slate-400 font-mono pt-2">{activeScreenState.idealStateNotes}</p>
                    </div>
                  )}

                  {/* State 2: Empty */}
                  {activeStateDemo === 'empty' && (
                    <div className="max-w-md space-y-3 animate-fade-in">
                      <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
                        <Sparkles className="w-7 h-7" />
                      </div>
                      <h4 className="text-base font-bold text-white">{activeScreenState.emptyStateTitle}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        No cards have been added yet. Scan a raw card barcode or press Spacebar to start a trade session.
                      </p>
                      <button
                        onClick={playBarcodeScannerBeep}
                        className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs transition flex items-center gap-2 mx-auto"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>{activeScreenState.emptyStateAction}</span>
                      </button>
                    </div>
                  )}

                  {/* State 3: Loading Skeleton */}
                  {activeStateDemo === 'loading' && (
                    <div className="w-full max-w-xl space-y-3 text-left animate-fade-in">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-700/20 font-mono text-xs text-slate-400">
                        <span>LOADING SKELETON WAVE</span>
                        <span>PERCEIVED LATENCY: &lt;250ms</span>
                      </div>
                      {[1, 2, 3].map((n) => (
                        <div key={n} className="p-3 rounded-xl bg-[#191922] border border-[#2c2c3e] flex items-center justify-between animate-pulse">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-slate-700/40" />
                            <div className="space-y-1.5">
                              <div className="w-48 h-3.5 rounded bg-slate-700/40" />
                              <div className="w-24 h-2.5 rounded bg-slate-700/30" />
                            </div>
                          </div>
                          <div className="w-16 h-4 rounded bg-slate-700/40" />
                        </div>
                      ))}
                      <p className="text-xs text-slate-400 font-mono pt-2">{activeScreenState.loadingSkeletonPattern}</p>
                    </div>
                  )}

                  {/* State 4: Partial */}
                  {activeStateDemo === 'partial' && (
                    <div className="w-full max-w-xl space-y-3 text-left animate-fade-in">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-700/20 font-mono text-xs">
                        <span className="text-indigo-400 font-bold">PARTIAL STATE (1 ITEM)</span>
                        <span className="text-slate-400">Layout must not stretch</span>
                      </div>
                      <div className="p-3 rounded-xl bg-[#191922] border border-[#2c2c3e] flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          <span className="p-1.5 rounded bg-indigo-500/20 text-indigo-400 font-mono font-bold">NM</span>
                          <span className="font-bold text-white">Lugia 1st Edition Neo Genesis #9</span>
                        </div>
                        <span className="font-mono text-emerald-400 font-bold">$780.00</span>
                      </div>
                      <div className="p-4 rounded-xl border border-dashed border-slate-700/40 text-center text-xs text-slate-500">
                        + Scan next card to build trade batch
                      </div>
                      <p className="text-xs text-slate-400 font-mono pt-2">{activeScreenState.partialStateRules}</p>
                    </div>
                  )}

                  {/* State 5: Error / Offline Fallback */}
                  {activeStateDemo === 'error' && (
                    <div className="max-w-md space-y-3 animate-fade-in">
                      <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                        <XCircle className="w-7 h-7" />
                      </div>
                      <h4 className="text-base font-bold text-white">Network Connection Dropped</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        TCGplayer API is unreachable. System automatically switched to <strong>Offline Daily Price Cache</strong>.
                      </p>
                      <div className="flex items-center justify-center gap-2 font-mono text-xs">
                        <button className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition">
                          Use Offline Cache
                        </button>
                        <button className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white transition">
                          Retry Connection
                        </button>
                      </div>
                      <p className="text-xs text-slate-400 font-mono pt-2">{activeScreenState.errorRecoveryAction}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* WORKBENCH 4: NIELSEN 10 AUDITOR                                       */}
          {/* ===================================================================== */}
          {activeWorkbench === 'heuristics' && (
            <div className="space-y-4 animate-fade-in">
              <div
                className={`p-6 rounded-2xl border space-y-5 ${
                  isLight ? 'bg-white border-[#e9e9e7]' : 'bg-[#15151c] border-[#262632]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      Nielsen's 10 Usability Heuristics Audit
                    </h3>
                    <p className="text-xs text-slate-400">
                      Live compliance scorecard for Aeethod OS. Click status tags to toggle Pass, Warning, or Fail.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right font-mono">
                      <span className="text-[10px] text-slate-400 block uppercase">Overall Health</span>
                      <span className="text-lg font-black text-emerald-400">{usabilityScore}%</span>
                    </div>
                    <div className="w-24 h-2 rounded-full bg-slate-700/40 overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${usabilityScore}%` }} />
                    </div>
                  </div>
                </div>

                {/* Scorecards */}
                <div className="space-y-2.5">
                  {heuristicAudits.map((item) => {
                    const isSelected = item.id === selectedHeuristicId;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedHeuristicId(item.id)}
                        className={`p-4 rounded-xl border transition cursor-pointer space-y-2 ${
                          isSelected
                            ? 'border-indigo-500 bg-indigo-500/10'
                            : isLight
                            ? 'bg-slate-50 border-slate-200 hover:border-slate-300'
                            : 'bg-[#1a1a24] border-[#282836] hover:border-[#38384a]'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono text-xs font-bold text-indigo-400">#{item.id}</span>
                            <h4 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                              {item.name}
                            </h4>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleHeuristicStatus(item.id);
                              }}
                              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition ${
                                item.status === 'Pass'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : item.status === 'Warning'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              }`}
                            >
                              {item.status === 'Pass' && '✓ Pass'}
                              {item.status === 'Warning' && '⚠ Warning'}
                              {item.status === 'Fail' && '✕ Fail'}
                            </button>

                            {item.status !== 'Pass' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleConvertHeuristicToTicket(item);
                                }}
                                className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-indigo-600 hover:bg-indigo-500 text-white transition flex items-center gap-1"
                              >
                                <Plus className="w-3 h-3" />
                                <span>Ticket</span>
                              </button>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-slate-400">{item.summary}</p>

                        <div className="p-2.5 rounded-lg bg-black/25 text-xs font-mono space-y-1">
                          <span className="text-[10px] text-emerald-400 uppercase font-bold block">
                            Aeethod OS Implementation:
                          </span>
                          <span className="text-slate-300">{item.aeethodExample}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* WORKBENCH 5: DESIGN TOKENS & SHADERS                                  */}
          {/* ===================================================================== */}
          {activeWorkbench === 'tokens' && (
            <div className="space-y-4 animate-fade-in">
              <div
                className={`p-6 rounded-2xl border space-y-6 ${
                  isLight ? 'bg-white border-[#e9e9e7]' : 'bg-[#15151c] border-[#262632]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      Design Tokens & Interactive Micro-Interactions
                    </h3>
                    <p className="text-xs text-slate-400">
                      WCAG 2.2 AA compliant tokens, tabular JetBrains Mono typography, and physical card shaders.
                    </p>
                  </div>

                  <button
                    onClick={playBarcodeScannerBeep}
                    className="px-3.5 py-2 rounded-xl text-xs font-mono bg-indigo-600 hover:bg-indigo-500 text-white transition flex items-center gap-1.5"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Test Scanner Beep (880Hz)</span>
                  </button>
                </div>

                {/* 3D Holographic Tilt Card Playground */}
                <div className="p-6 rounded-xl border border-indigo-500/20 bg-[#101016] flex flex-col md:flex-row items-center justify-around gap-6">
                  <div className="space-y-2 max-w-sm">
                    <span className="text-[10px] font-mono uppercase text-indigo-400 font-bold block">
                      Micro-Interaction Playground
                    </span>
                    <h4 className="text-sm font-bold text-white">3D Holographic Foil Tilt Shader</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Hover over the card to inspect dynamic perspective tilt and angle-matched holographic rainbow glare.
                      Used for showcasing high-end Manga Rares and PSA 10 slabs.
                    </p>
                    <div className="flex items-center gap-2 font-mono text-[11px] text-emerald-400">
                      <span>✓ 60 FPS GPU Acceleration</span>
                      <span>• Touch & Gyro Ready</span>
                    </div>
                  </div>

                  {/* The Tilt Card */}
                  <div
                    onMouseMove={handleCardMouseMove}
                    onMouseLeave={handleCardMouseLeave}
                    style={tiltStyle}
                    className="relative w-56 h-80 rounded-2xl p-4 shadow-2xl cursor-pointer border border-amber-400/40 overflow-hidden flex flex-col justify-between bg-gradient-to-br from-amber-950/80 via-slate-900 to-indigo-950"
                  >
                    {/* Glare Mask */}
                    <div className="absolute inset-0 pointer-events-none transition-opacity" style={glareStyle} />

                    <div className="flex items-center justify-between relative z-10">
                      <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-mono text-[10px] font-bold border border-amber-400/30">
                        PSA 10 GEM MT
                      </span>
                      <span className="text-white font-mono text-xs font-bold">$2,450</span>
                    </div>

                    <div className="text-center relative z-10 space-y-1">
                      <Sparkles className="w-10 h-10 text-amber-300 mx-auto animate-pulse" />
                      <h5 className="text-sm font-black text-white tracking-wide">Manga Shanks #OP01</h5>
                      <span className="text-[10px] font-mono text-amber-200">One Piece TCG • Super Rare</span>
                    </div>

                    <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-slate-300 border-t border-white/20 pt-2">
                      <span>Cert #78921441</span>
                      <span className="text-emerald-400">Holo Foil ✓</span>
                    </div>
                  </div>
                </div>

                {/* Color Token Swatches */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                  <div className="p-3.5 rounded-xl bg-[#0c0c10] border border-[#262632] text-white space-y-1">
                    <span className="text-[10px] text-slate-400 block">Obsidian Canvas Dark</span>
                    <span className="font-bold">#0C0C10</span>
                    <span className="text-[10px] text-emerald-400 block">WCAG AAA 14.2:1</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#10b981]/20 border border-[#10b981]/40 text-emerald-400 space-y-1">
                    <span className="text-[10px] text-slate-400 block">Store Credit Emerald</span>
                    <span className="font-bold">#10B981</span>
                    <span className="text-[10px] text-emerald-300 block">+30% Trade Boost</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#f43f5e]/20 border border-[#f43f5e]/40 text-rose-400 space-y-1">
                    <span className="text-[10px] text-slate-400 block">Cash Out Crimson</span>
                    <span className="font-bold">#F43F5E</span>
                    <span className="text-[10px] text-rose-300 block">Immediate Cash Offer</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#6366f1]/20 border border-[#6366f1]/40 text-indigo-400 space-y-1">
                    <span className="text-[10px] text-slate-400 block">Primary Action Indigo</span>
                    <span className="font-bold">#6366F1</span>
                    <span className="text-[10px] text-indigo-300 block">Primary CTA</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* WORKBENCH 6: PERSONAS & RESEARCH VAULT                                */}
          {/* ===================================================================== */}
          {activeWorkbench === 'personas' && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {personas.map((persona) => {
                  const isSelected = persona.id === selectedPersonaId;
                  return (
                    <div
                      key={persona.id}
                      onClick={() => setSelectedPersonaId(persona.id)}
                      className={`p-5 rounded-2xl border transition cursor-pointer space-y-3 ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-500/10'
                          : isLight
                          ? 'bg-white border-[#e9e9e7] hover:border-slate-300'
                          : 'bg-[#15151c] border-[#262632] hover:border-[#383848]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl p-2 rounded-xl bg-indigo-500/10">{persona.avatarEmoji}</span>
                        <div>
                          <h4 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                            {persona.name}
                          </h4>
                          <span className="text-xs text-slate-400">{persona.role}</span>
                        </div>
                      </div>

                      <div className="space-y-1 text-xs">
                        <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                          Primary Goal & JTBD:
                        </span>
                        <p className="text-slate-300 leading-relaxed">{persona.primaryGoal}</p>
                      </div>

                      <div className="space-y-1 text-xs">
                        <span className="text-[10px] font-mono uppercase text-rose-400 font-bold block">
                          Biggest Frustration:
                        </span>
                        <p className="text-rose-300/90 leading-relaxed">{persona.biggestFrustration}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-700/20 flex flex-wrap gap-1.5 font-mono text-[10px]">
                        {persona.keyUiRequirements.map((req, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300">
                            {req}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* WORKBENCH 7: UX DELIVERY KANBAN BOARD                                 */}
          {/* ===================================================================== */}
          {activeWorkbench === 'kanban' && (
            <div className="space-y-4 animate-fade-in">
              <div
                className={`p-5 rounded-2xl border space-y-4 ${
                  isLight ? 'bg-white border-[#e9e9e7]' : 'bg-[#15151c] border-[#262632]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      UX Delivery Pipeline (Design 1 Sprint Ahead)
                    </h3>
                    <p className="text-xs text-slate-400">
                      Every feature must graduate through all 6 stages before code is deployed.
                    </p>
                  </div>
                </div>

                {/* 6 Kanban Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 pt-2">
                  {(
                    [
                      { id: 'jtbd', label: '1. Problem JTBD' },
                      { id: 'wireframe', label: '2. Wireframe' },
                      { id: 'figma', label: '3. Prototype' },
                      { id: 'tested', label: '4. Tested' },
                      { id: 'dev_ready', label: '5. Dev Ready' },
                      { id: 'shipped', label: '6. Shipped' }
                    ] as const
                  ).map((col) => {
                    const tasksInCol = kanbanTasks.filter((t) => t.column === col.id);
                    return (
                      <div key={col.id} className="space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-400 px-1">
                          <span>{col.label}</span>
                          <span className="text-slate-500">({tasksInCol.length})</span>
                        </div>

                        <div className="space-y-2 min-h-[300px] p-2 rounded-xl bg-black/20 border border-slate-800/40">
                          {tasksInCol.map((task) => {
                            const isSelected = task.id === selectedKanbanTaskId;
                            return (
                              <div
                                key={task.id}
                                onClick={() => setSelectedKanbanTaskId(task.id)}
                                className={`p-3 rounded-xl border text-xs space-y-2 cursor-pointer transition ${
                                  isSelected
                                    ? 'border-indigo-500 bg-indigo-500/15'
                                    : 'bg-[#1a1a24] border-[#282836] hover:border-[#38384a]'
                                }`}
                              >
                                <div className="flex items-center justify-between text-[10px] font-mono">
                                  <span className="text-indigo-400 font-bold">{task.flowCategory}</span>
                                  <span
                                    className={`px-1.5 py-0.2 rounded ${
                                      task.priority === 'Critical' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                                    }`}
                                  >
                                    {task.priority}
                                  </span>
                                </div>
                                <h5 className="font-bold text-white text-xs leading-snug">{task.title}</h5>
                                <p className="text-[11px] text-slate-400 line-clamp-2">{task.description}</p>

                                {/* Move Controls */}
                                <div className="flex items-center justify-between pt-1 border-t border-slate-700/20">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleMoveKanban(task.id, 'prev');
                                    }}
                                    className="p-1 rounded hover:bg-slate-700/30 text-slate-400 hover:text-white"
                                  >
                                    <ChevronLeft className="w-3 h-3" />
                                  </button>
                                  <span className="text-[10px] text-slate-500 font-mono">{task.persona.split(' ')[0]}</span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleMoveKanban(task.id, 'next');
                                    }}
                                    className="p-1 rounded hover:bg-slate-700/30 text-slate-400 hover:text-white"
                                  >
                                    <ChevronRight className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </main>

        {/* ----------------------------------------------------------------------- */}
        {/* PANE 3: RIGHT RAIL - CONTEXTUAL INSPECTOR (340px)                       */}
        {/* ----------------------------------------------------------------------- */}
        {isRightRailOpen && (
          <aside
            className={`w-80 shrink-0 rounded-2xl border p-4 space-y-5 transition animate-slide-in ${
              isLight ? 'bg-white border-[#e9e9e7]' : 'bg-[#15151c] border-[#262632]'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/20">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-400" />
                <h3 className={`text-xs font-bold font-mono uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Contextual Inspector
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-500">Key: ]</span>
            </div>

            {/* If Flows is active, inspect Active Step */}
            {activeWorkbench === 'flows' && (
              <div className="space-y-3.5 text-xs">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">Selected Step</span>
                  <h4 className="text-sm font-bold text-white">
                    Step {activeStep.stepNumber}: {activeStep.title}
                  </h4>
                </div>

                <div className="p-3 rounded-xl bg-black/25 border border-slate-700/20 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-indigo-400 font-bold block">User Goal</span>
                  <p className="text-slate-300 leading-relaxed">{activeStep.userGoal}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                  <div className="p-2.5 rounded-lg bg-black/20 border border-slate-800 space-y-1">
                    <span className="text-[9px] text-slate-400 block uppercase">Touch Target</span>
                    <span
                      className={`font-bold ${
                        parseInt(activeStep.touchTargetSize, 10) >= 48 ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {activeStep.touchTargetSize}
                    </span>
                    <span className="text-[9px] text-slate-500 block">
                      {parseInt(activeStep.touchTargetSize, 10) >= 48 ? 'iPad Validated' : 'Needs Enlarge'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-black/20 border border-slate-800 space-y-1">
                    <span className="text-[9px] text-slate-400 block uppercase">Friction Level</span>
                    <span className="font-bold text-indigo-400">{activeStep.frictionLevel}</span>
                    <span className="text-[9px] text-slate-500 block">Optimized</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">Hardware Trigger</span>
                  <div className="p-2 rounded-lg bg-black/20 font-mono text-[11px] text-purple-300 flex items-center gap-1.5">
                    <QrCode className="w-3.5 h-3.5 text-purple-400" />
                    <span>{activeStep.hardwareTrigger || 'No external hardware required'}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">Edge Cases & Fallbacks</span>
                  <p className="text-[11px] text-slate-400 leading-relaxed bg-black/20 p-2.5 rounded-lg">
                    {activeStep.edgeCaseNotes}
                  </p>
                </div>
              </div>
            )}

            {/* If Sitemap is active, inspect Selected Route */}
            {activeWorkbench === 'sitemap' && (
              <div className="space-y-3.5 text-xs">
                <div>
                  <span className="text-[10px] font-mono uppercase text-indigo-400 block">{activeSitemapNode.route}</span>
                  <h4 className="text-sm font-bold text-white">{activeSitemapNode.title}</h4>
                </div>

                <div className="p-3 rounded-xl bg-black/25 border border-slate-700/20 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Access Role</span>
                  <span className="text-emerald-400 font-bold">{activeSitemapNode.role}</span>
                  <span className="text-[10px] text-slate-400 block">Layout: {activeSitemapNode.layoutType}</span>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">5-State Completion</span>
                  <div className="space-y-1 font-mono text-[11px]">
                    {Object.entries(activeSitemapNode.statesDefined).map(([key, isDone]) => (
                      <div key={key} className="flex items-center justify-between p-1.5 rounded bg-black/20">
                        <span className="capitalize text-slate-300">{key} State</span>
                        <span className={isDone ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                          {isDone ? '✓ Spec Done' : 'Pending'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* If Heuristics is active */}
            {activeWorkbench === 'heuristics' && (
              <div className="space-y-3.5 text-xs">
                <div>
                  <span className="text-[10px] font-mono uppercase text-indigo-400 block">Heuristic #{activeHeuristic.id}</span>
                  <h4 className="text-sm font-bold text-white">{activeHeuristic.name}</h4>
                </div>
                <div className="p-3 rounded-xl bg-black/25 border border-slate-700/20 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">Nielsen Rule</span>
                  <p className="text-slate-300 leading-relaxed text-[11px]">{activeHeuristic.summary}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">Action Item Note</span>
                  <p className="text-slate-400 text-[11px] bg-black/20 p-2.5 rounded-lg">{activeHeuristic.notes}</p>
                </div>
              </div>
            )}

            {/* If Personas is active */}
            {activeWorkbench === 'personas' && (
              <div className="space-y-3.5 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{activePersona.avatarEmoji}</span>
                  <div>
                    <h4 className="text-sm font-bold text-white">{activePersona.name}</h4>
                    <span className="text-[10px] text-slate-400">{activePersona.role}</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-black/25 border border-slate-700/20 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">Environment</span>
                  <p className="text-slate-300 leading-relaxed text-[11px]">{activePersona.environment}</p>
                </div>
              </div>
            )}

            {/* 1-Click Dev Spec Export & Handoff */}
            <div className="pt-4 border-t border-slate-700/20 space-y-2">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">1-Click Dev Handoff</span>
              <button
                onClick={handleCopyMarkdownSpec}
                className="w-full py-2.5 rounded-xl text-xs font-mono font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition flex items-center justify-center gap-2 shadow-xs"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Copy Markdown Spec</span>
              </button>

              <button
                onClick={handleCopyJsonTokens}
                className="w-full py-2.5 rounded-xl text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-200 transition flex items-center justify-center gap-2 border border-slate-700/40"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy JSON Tokens</span>
              </button>
            </div>
          </aside>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 4. ADD UI/UX SPEC MODAL                                                   */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div
            className={`rounded-2xl border w-full max-w-lg p-6 space-y-4 shadow-2xl animate-slide-in ${
              isLight ? 'bg-white border-[#e9e9e7]' : 'bg-[#181822] border-[#2e2e3e]'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/20">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <Plus className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-white">Create New UI/UX Specification</h3>
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
                <label className="block text-[11px] font-mono uppercase mb-1 text-slate-400">
                  Checklist Items (One per line)
                </label>
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
