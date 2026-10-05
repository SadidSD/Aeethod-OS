import React, { useState, useMemo } from 'react';
import {
  Palette,
  Sparkles,
  Layout,
  MousePointerClick,
  Smartphone,
  Monitor,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  Filter,
  Layers,
  Sliders,
  Eye,
  CheckSquare,
  Wand2,
  ArrowRight
} from 'lucide-react';
import { useStore } from '../store';
import {
  UiUxCategory,
  UiUxStatus,
  UiUxTargetSurface,
  UiUxItem,
  INITIAL_UI_UX_ITEMS
} from '../data/uiUxData';

export const UiUxStudioView: React.FC = () => {
  const { theme } = useStore();
  const isLight = theme === 'light';

  const [items, setItems] = useState<UiUxItem[]>(INITIAL_UI_UX_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSurface, setSelectedSurface] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

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

    const rotateX = ((y - centerY) / centerY) * -14;
    const rotateY = ((x - centerX) / centerX) * 14;

    setTiltStyle({
      transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`,
      transition: 'transform 0.05s ease-out'
    });

    setGlareStyle({
      background: `radial-gradient(circle at ${(x / card.width) * 100}% ${(y / card.height) * 100}%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%)`
    });
  };

  const handleCardMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.4s ease-out'
    });
    setGlareStyle({ background: 'none' });
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchSurface = selectedSurface === 'All' || item.surface === selectedSurface;
      const matchSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.userProblem.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.uxDesignSolution.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSurface && matchSearch;
    });
  }, [items, selectedCategory, selectedSurface, searchQuery]);

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const checklist = newChecklistText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const newItem: UiUxItem = {
      id: `ux-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      surface: newSurface,
      status: newStatus,
      userProblem: newUserProblem.trim() || 'Friction point identified during user observation',
      uxDesignSolution: newSolution.trim() || 'Ergonomic, accessible interface solution',
      designChecklist: checklist.length > 0 ? checklist : ['Accessible contrast ratio >= 4.5:1', 'Zero layout shift'],
      figmaOrPreviewNotes: newNotes.trim() || undefined
    };

    setItems((prev) => [newItem, ...prev]);
    setIsModalOpen(false);
    setNewTitle('');
    setNewUserProblem('');
    setNewSolution('');
    setNewChecklistText('');
    setNewNotes('');
  };

  const updateItemStatus = (id: string, status: UiUxStatus) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-slide-in">
      {/* 1. Header Banner */}
      <div className={`p-6 rounded-2xl border transition-all ${
        isLight
          ? 'bg-gradient-to-br from-purple-50/70 via-white to-slate-50 border-purple-100 shadow-sm'
          : 'bg-gradient-to-br from-purple-950/20 via-[#1c1c1f] to-[#161618] border-purple-500/20 shadow-xl'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wider uppercase bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5" />
                UI / UX Design & Interaction Studio
              </span>
              <span className="text-[11px] text-slate-500 font-mono">Ergonomics, Tokens & Micro-Interactions</span>
            </div>
            <h1 className={`text-2xl lg:text-3xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              UI, UX & Retail Experience Engineering
            </h1>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Dedicated workspace to design and track <strong>design systems, POS counter ergonomics, mobile collector experiences, and interactive card shaders</strong>.
              Ensures every pixel is built for high-speed retail workflows and premium collector delight.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary text-xs px-4 py-2.5 flex items-center gap-2 shadow-md bg-purple-600 hover:bg-purple-500"
            >
              <Plus className="w-4 h-4" />
              <span>Add UI/UX Spec</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Interactive Holographic Foil Card Micro-Interaction Playground */}
      <div className={`p-6 rounded-2xl border ${isLight ? 'bg-white border-slate-200' : 'bg-[#1b1b20] border-[#2c2c34]'}`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-lg">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider font-mono">
              <Sparkles className="w-4 h-4" />
              <span>Live UI/UX Micro-Interaction Prototype</span>
            </div>
            <h3 className={`text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
              3D Dynamic Foil & Hologram Shader Shader
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Hover over or tilt the card below. Notice the realistic perspective rotation and radial shimmer glare.
              This interactive component is engineered for our <strong>$2,000 Custom Storefront Theme</strong> to drive high conversion rates on high-value single cards.
            </p>
          </div>

          {/* Interactive Card Canvas */}
          <div
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
            style={tiltStyle}
            className="w-56 h-76 rounded-2xl p-4 bg-gradient-to-br from-indigo-900 via-purple-950 to-slate-900 border-2 border-amber-400/60 shadow-2xl relative overflow-hidden cursor-pointer select-none shrink-0"
          >
            {/* Shimmer Overlay */}
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

      {/* 3. Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[11px] text-slate-500 font-semibold uppercase">Category:</span>
          {['All', 'Component Library', 'Design System & Tokens', 'Micro-Interaction', 'Wireframe & Flow'].map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition shrink-0 ${
                selectedCategory === c
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search UI specs, ergonomics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-purple-500"
          />
        </div>
      </div>

      {/* 4. UI/UX Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`p-5 rounded-2xl border space-y-4 transition-all ${
              isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-[#1b1b20] border-[#2c2c34] hover:border-purple-500/40'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                    {item.category}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                    {item.surface}
                  </span>
                </div>
                <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {item.title}
                </h3>
              </div>

              <select
                value={item.status}
                onChange={(e) => updateItemStatus(item.id, e.target.value as UiUxStatus)}
                className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg border bg-slate-900 ${
                  item.status === 'Polished & Done'
                    ? 'text-emerald-400 border-emerald-500/30'
                    : item.status === 'In Code / Prototyping'
                    ? 'text-cyan-400 border-cyan-500/30'
                    : 'text-amber-400 border-amber-500/30'
                }`}
              >
                <option value="Concept">Concept</option>
                <option value="In Figma / Wireframe">In Figma / Wireframe</option>
                <option value="In Code / Prototyping">In Code / Prototyping</option>
                <option value="Polished & Done">Polished & Done</option>
              </select>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-1">
                <span className="text-[10px] uppercase font-bold text-rose-400 block">User Friction / Problem:</span>
                <p className="text-rose-200/90 leading-relaxed">{item.userProblem}</p>
              </div>

              <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-1">
                <span className="text-[10px] uppercase font-bold text-purple-400 block">Ergonomic UX Solution:</span>
                <p className="text-purple-200/90 leading-relaxed">{item.uxDesignSolution}</p>
              </div>
            </div>

            {/* Design Checklist */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Design & Polish Checklist:</span>
              <ul className="space-y-1 text-xs text-slate-300">
                {item.designChecklist.map((c, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            {item.figmaOrPreviewNotes && (
              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 font-mono">
                {item.figmaOrPreviewNotes}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="card w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-4 bg-[#1b1b20] border border-purple-500/40 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Add UI / UX Design Spec</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateItem} className="space-y-4 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Feature / Component Name</label>
                <input
                  type="text"
                  placeholder="e.g. 1-Tap POS Checkout Pad"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as UiUxCategory)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  >
                    <option value="Component Library">Component Library</option>
                    <option value="Design System & Tokens">Design System & Tokens</option>
                    <option value="Micro-Interaction">Micro-Interaction</option>
                    <option value="Wireframe & Flow">Wireframe & Flow</option>
                    <option value="Usability Audit">Usability Audit</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Target Surface</label>
                  <select
                    value={newSurface}
                    onChange={(e) => setNewSurface(e.target.value as UiUxTargetSurface)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  >
                    <option value="Desktop App">Desktop App</option>
                    <option value="POS Counter Kiosk">POS Counter Kiosk</option>
                    <option value="Mobile Collector">Mobile Collector</option>
                    <option value="Customer Storefront">Customer Storefront</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as UiUxStatus)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  >
                    <option value="Concept">Concept</option>
                    <option value="In Figma / Wireframe">In Figma / Wireframe</option>
                    <option value="In Code / Prototyping">In Code / Prototyping</option>
                    <option value="Polished & Done">Polished & Done</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">User Friction / Problem</label>
                <textarea
                  rows={2}
                  value={newUserProblem}
                  onChange={(e) => setNewUserProblem(e.target.value)}
                  placeholder="Why is the current interaction slow or confusing?"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Ergonomic UX Solution</label>
                <textarea
                  rows={2}
                  value={newSolution}
                  onChange={(e) => setNewSolution(e.target.value)}
                  placeholder="How will this design improve speed, clarity, and satisfaction?"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Design Checklist (One item per line)</label>
                <textarea
                  rows={3}
                  value={newChecklistText}
                  onChange={(e) => setNewChecklistText(e.target.value)}
                  placeholder="Touch target >= 48px&#10;Dark/Light contrast ratio >= 4.5:1&#10;Subtle hover feedback"
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
                <button type="submit" className="btn-primary px-5 py-2 bg-purple-600 hover:bg-purple-500">
                  Save Spec
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
