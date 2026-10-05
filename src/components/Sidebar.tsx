import React, { useState } from 'react';
import {
  Search,
  Settings,
  ChevronDown,
  ChevronRight,
  Plus,
  Star,
  PanelLeftClose,
  PanelLeft,
  Sparkles,
  BarChart3,
  Swords,
  Calculator,
  KanbanSquare,
  Milestone,
  Layers,
  LayoutDashboard,
  Check,
  Sun,
  Moon,
  Clapperboard,
  Cpu,
  Palette,
  PenTool,
} from 'lucide-react';


import { useDb, useStore } from '../store';
import { emojiForTopic, CATEGORY_ORDER } from '../lib/constants';
import { useRoute, href } from '../lib/router';

export const Sidebar: React.FC = () => {
  const db = useDb();
  const route = useRoute();
  const {
    sidebarOpen,
    toggleSidebar,
    favorites,
    toggleFavorite,
    setQuickAddOpen,
    setPaletteOpen,
    theme,
    toggleTheme,
  } = useStore();

  const currentPath = route[0] || 'home';
  const currentSub = route[1];

  const [devOpen, setDevOpen] = useState(true);
  const [databasesOpen, setDatabasesOpen] = useState(true);
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({
    Operations: true,
    Systems: true,
    People: true,
    Foundation: true,
  });

  const toggleCategory = (cat: string) => {
    setCollapsedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  // Group topics by category
  const groupedTopics = React.useMemo(() => {
    const map: Record<string, typeof db.topics> = {};
    for (const t of db.topics) {
      if (t.id === 'dev') continue;
      if (!map[t.category]) map[t.category] = [];
      map[t.category].push(t);
    }
    return map;
  }, [db.topics]);

  // If sidebar is collapsed, show minimal floating icon strip or hidden
  if (!sidebarOpen) {
    return (
      <div className="w-12 bg-[#202020] border-r border-[#2e2e2e] flex flex-col items-center py-3 justify-between shrink-0 h-screen select-none z-30 transition-all">
        <div className="space-y-3 flex flex-col items-center">
          <button
            onClick={() => toggleSidebar(true)}
            className="w-8 h-8 rounded-md hover:bg-[#2c2c2c] flex items-center justify-center text-[#9b9b9b] hover:text-white transition"
            title="Expand Sidebar (Ctrl+\)"
          >
            <PanelLeft className="w-4 h-4" />
          </button>

          <a
            href="#/home"
            className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-xs shadow-sm hover:bg-indigo-500 transition"
            title="Executive Home"
          >
            A
          </a>

          <button
            onClick={() => setPaletteOpen(true)}
            className="w-8 h-8 rounded-md hover:bg-[#2c2c2c] flex items-center justify-center text-[#9b9b9b] hover:text-white transition"
            title="Search (Ctrl+K)"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            onClick={() => setQuickAddOpen(true)}
            className="w-8 h-8 rounded-md hover:bg-[#2c2c2c] flex items-center justify-center text-[#9b9b9b] hover:text-white transition"
            title="Quick Add (C)"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => toggleTheme()}
            className="w-8 h-8 rounded-md hover:bg-[#2c2c2c] flex items-center justify-center text-[#9b9b9b] hover:text-white transition"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to White Mode'}
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-indigo-400" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>

          <a
            href="#/game-theory"
            className="w-8 h-8 rounded-md hover:bg-[#2c2c2c] flex items-center justify-center text-[#9b9b9b] hover:text-white transition"
            title="Game Theory War Room"
          >
            <span className="text-sm">♟️</span>
          </a>

          <a
            href="#/whiteboard"
            className="w-8 h-8 rounded-md hover:bg-[#2c2c2c] flex items-center justify-center text-[#9b9b9b] hover:text-white transition"
            title="Miro Whiteboard Canvas"
          >
            <PenTool className="w-4 h-4 text-amber-400" />
          </a>

          <a
            href="#/content"
            className="w-8 h-8 rounded-md hover:bg-[#2c2c2c] flex items-center justify-center text-[#9b9b9b] hover:text-white transition"
            title="Content Studio & Planning"
          >
            <Clapperboard className="w-4 h-4 text-indigo-400" />
          </a>

          <a
            href="#/settings"
            className="w-8 h-8 rounded-md hover:bg-[#2c2c2c] flex items-center justify-center text-[#9b9b9b] hover:text-white transition"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <aside className="w-64 bg-[#202020] border-r border-[#2e2e2e] flex flex-col justify-between shrink-0 h-screen select-none text-[13px] z-30 transition-all">
      <div className="flex flex-col min-h-0 flex-1">
        {/* Workspace Switcher Header */}
        <div className="p-3 pb-2 flex items-center justify-between group">
          <div className="flex items-center gap-2 px-1.5 py-1 rounded-md hover:bg-[#2c2c2c] cursor-pointer transition flex-1 min-w-0">
            <div className="w-5 h-5 rounded bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
              A
            </div>
            <div className="font-semibold text-white truncate text-xs flex items-center gap-1.5">
              <span>{db.settings?.company || 'Aeethod'} OS</span>
              <span className="text-[10px] px-1 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                B2B
              </span>
            </div>
            <ChevronDown className="w-3 h-3 text-[#9b9b9b] ml-auto shrink-0 opacity-70 group-hover:opacity-100" />
          </div>

          <button
            onClick={() => toggleSidebar(false)}
            className="p-1 rounded-md text-[#9b9b9b] hover:text-white hover:bg-[#2c2c2c] transition opacity-0 group-hover:opacity-100"
            title="Collapse Sidebar (Ctrl+\)"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        {/* Global Action Items */}
        <div className="px-2 space-y-0.5 pb-2">
          <button
            onClick={() => setPaletteOpen(true)}
            className="w-full flex items-center justify-between px-2.5 py-1 rounded-md text-[#9b9b9b] hover:text-white hover:bg-[#282828] transition group text-xs"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-[#9b9b9b]" />
              <span>Search</span>
            </div>
            <span className="text-[10px] font-mono opacity-50 group-hover:opacity-80">Ctrl K</span>
          </button>

          <a
            href="#/home"
            className={`w-full flex items-center gap-2 px-2.5 py-1 rounded-md text-xs transition ${
              currentPath === 'home'
                ? 'bg-[#2c2c2c] text-white font-medium'
                : 'text-[#9b9b9b] hover:text-white hover:bg-[#282828]'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-indigo-400" />
            <span>Executive Home</span>
          </a>

          <a
            href="#/settings"
            className={`w-full flex items-center gap-2 px-2.5 py-1 rounded-md text-xs transition ${
              currentPath === 'settings'
                ? 'bg-[#2c2c2c] text-white font-medium'
                : 'text-[#9b9b9b] hover:text-white hover:bg-[#282828]'
            }`}
          >
            <Settings className="w-3.5 h-3.5 text-slate-400" />
            <span>Settings & Members</span>
          </a>

          <button
            onClick={() => toggleTheme()}
            className="w-full flex items-center justify-between px-2.5 py-1 rounded-md text-xs text-[#9b9b9b] hover:text-white hover:bg-[#282828] transition group"
          >
            <div className="flex items-center gap-2">
              {theme === 'light' ? (
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
              ) : (
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              )}
              <span>{theme === 'light' ? 'Dark Mode' : 'White Mode'}</span>
            </div>
            <span className="text-[10px] font-mono opacity-50 group-hover:opacity-80">
              {theme === 'light' ? 'Dark' : 'Light'}
            </span>
          </button>
        </div>

        {/* Scrollable Navigation Tree */}
        <div className="flex-1 overflow-y-auto px-2 space-y-4 pt-1">
          {/* Favorites / Starred */}
          {favorites.length > 0 && (
            <div className="space-y-0.5">
              <div className="px-2 text-[11px] font-medium text-[#787774] flex items-center gap-1.5 uppercase tracking-wider">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span>Favorites</span>
              </div>

              {favorites.map((favId) => {
                const topic = db.topics.find((t) => t.id === favId);
                const isSpecial = ['metrics', 'competitors', 'pricing-sim', 'game-theory'].includes(favId);
                const isActive = (currentPath === 'topic' && currentSub === favId) || currentPath === favId;

                let name = topic?.name || favId;
                let emoji = topic ? emojiForTopic(topic.id) : '📊';
                let link = href(topic ? `/topic/${topic.id}` : `/${favId}`);

                if (favId === 'metrics') {
                  name = 'SaaS Metrics Modeler';
                  emoji = '📐';
                } else if (favId === 'competitors') {
                  name = 'Competitor Matrix';
                  emoji = '⚔️';
                } else if (favId === 'pricing-sim') {
                  name = 'Switching ROI Simulator';
                  emoji = '🧮';
                } else if (favId === 'game-theory') {
                  name = 'Game Theory War Room';
                  emoji = '♟️';
                } else if (favId === 'whiteboard') {
                  name = 'Whiteboard (Miro Canvas)';
                  emoji = '🎨';
                  link = '#/whiteboard';
                }

                return (
                  <div key={favId} className="group/item flex items-center justify-between">
                    <a
                      href={link}
                      className={`flex items-center gap-2 px-2 py-1 rounded-md text-xs flex-1 truncate transition ${
                        isActive
                          ? 'bg-[#2c2c2c] text-white font-medium'
                          : 'text-[#9b9b9b] hover:text-white hover:bg-[#282828]'
                      }`}
                    >
                      <span className="text-xs">{emoji}</span>
                      <span className="truncate">{name}</span>
                    </a>

                    <button
                      onClick={() => toggleFavorite(favId)}
                      className="p-1 rounded text-[#787774] hover:text-amber-400 opacity-0 group-hover/item:opacity-100 transition"
                      title="Remove from favorites"
                    >
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Development Workspace */}
          <div className="space-y-0.5">
            <div
              onClick={() => setDevOpen(!devOpen)}
              className="px-2 text-[11px] font-medium text-[#787774] flex items-center justify-between uppercase tracking-wider cursor-pointer hover:text-[#d4d4d4]"
            >
              <span className="flex items-center gap-1.5">
                <span>🛠️</span>
                <span>Engineering Hub</span>
              </span>
              {devOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </div>

            {devOpen && (
              <div className="space-y-0.5 pl-2 pt-0.5 border-l border-[#2e2e2e] ml-2.5">
                <a
                  href="#/dev/architecture"
                  className={`flex items-center gap-2 px-2 py-1 rounded-md text-xs transition ${
                    currentPath === 'dev' && (currentSub === 'architecture' || currentSub === 'stack' || currentSub === 'plan')
                      ? 'bg-[#2c2c2c] text-white font-medium'
                      : 'text-[#9b9b9b] hover:text-white hover:bg-[#282828]'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-semibold text-white">Full-Stack Architecture & Plan</span>
                </a>
                <a
                  href="#/dev/ui-ux"
                  className={`flex items-center gap-2 px-2 py-1 rounded-md text-xs transition ${
                    (currentPath === 'dev' && currentSub === 'ui-ux') || currentPath === 'ui-ux'
                      ? 'bg-[#2c2c2c] text-white font-medium'
                      : 'text-[#9b9b9b] hover:text-white hover:bg-[#282828]'
                  }`}
                >
                  <Palette className="w-3.5 h-3.5 text-purple-400" />
                  <span className="font-semibold text-white">UI & UX Design Studio</span>
                </a>
                <a
                  href="#/whiteboard"
                  className={`flex items-center gap-2 px-2 py-1 rounded-md text-xs transition ${
                    currentPath === 'whiteboard'
                      ? 'bg-[#2c2c2c] text-white font-medium'
                      : 'text-[#9b9b9b] hover:text-white hover:bg-[#282828]'
                  }`}
                >
                  <PenTool className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-semibold text-amber-300">Whiteboard (Miro Canvas)</span>
                </a>
                <a
                  href="#/dev/board"
                  className={`flex items-center gap-2 px-2 py-1 rounded-md text-xs transition ${
                    currentPath === 'dev' && (currentSub === 'board' || !currentSub)
                      ? 'bg-[#2c2c2c] text-white font-medium'
                      : 'text-[#9b9b9b] hover:text-white hover:bg-[#282828]'
                  }`}
                >
                  <KanbanSquare className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Sprint Kanban Board</span>
                </a>


                <a
                  href="#/dev/sprints"
                  className={`flex items-center gap-2 px-2 py-1 rounded-md text-xs transition ${
                    currentPath === 'dev' && currentSub === 'sprints'
                      ? 'bg-[#2c2c2c] text-white font-medium'
                      : 'text-[#9b9b9b] hover:text-white hover:bg-[#282828]'
                  }`}
                >
                  <Milestone className="w-3.5 h-3.5 text-amber-400" />
                  <span>Sprints ({db.sprints.length})</span>
                </a>
                <a
                  href="#/dev/epics"
                  className={`flex items-center gap-2 px-2 py-1 rounded-md text-xs transition ${
                    currentPath === 'dev' && currentSub === 'epics'
                      ? 'bg-[#2c2c2c] text-white font-medium'
                      : 'text-[#9b9b9b] hover:text-white hover:bg-[#282828]'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-purple-400" />
                  <span>Roadmap Epics ({db.epics.length})</span>
                </a>
              </div>
            )}
          </div>

          {/* Cross-Company Databases */}
          <div className="space-y-0.5">
            <div
              onClick={() => setDatabasesOpen(!databasesOpen)}
              className="px-2 text-[11px] font-medium text-[#787774] flex items-center justify-between uppercase tracking-wider cursor-pointer hover:text-[#d4d4d4]"
            >
              <span className="flex items-center gap-1.5">
                <span>📊</span>
                <span>Analytics & Databases</span>
              </span>
              {databasesOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </div>

            {databasesOpen && (
              <div className="space-y-0.5 pl-2 pt-0.5 border-l border-[#2e2e2e] ml-2.5">
                <a
                  href="#/metrics"
                  className={`flex items-center gap-2 px-2 py-1 rounded-md text-xs transition ${
                    currentPath === 'metrics'
                      ? 'bg-[#2c2c2c] text-white font-medium'
                      : 'text-[#9b9b9b] hover:text-white hover:bg-[#282828]'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>SaaS Metrics & Modeler</span>
                </a>

                <a
                  href="#/competitors"
                  className={`flex items-center gap-2 px-2 py-1 rounded-md text-xs transition ${
                    currentPath === 'competitors'
                      ? 'bg-[#2c2c2c] text-white font-medium'
                      : 'text-[#9b9b9b] hover:text-white hover:bg-[#282828]'
                  }`}
                >
                  <Swords className="w-3.5 h-3.5 text-rose-400" />
                  <span>Competitor Matrix (26)</span>
                </a>

                <a
                  href="#/pricing-sim"
                  className={`flex items-center gap-2 px-2 py-1 rounded-md text-xs transition ${
                    currentPath === 'pricing-sim'
                      ? 'bg-[#2c2c2c] text-white font-medium'
                      : 'text-[#9b9b9b] hover:text-white hover:bg-[#282828]'
                  }`}
                >
                  <Calculator className="w-3.5 h-3.5 text-amber-400" />
                  <span>Switching ROI Simulator</span>
                </a>

                <a
                  href="#/game-theory"
                  className={`flex items-center gap-2 px-2 py-1 rounded-md text-xs transition ${
                    currentPath === 'game-theory'
                      ? 'bg-[#2c2c2c] text-white font-medium'
                      : 'text-[#9b9b9b] hover:text-white hover:bg-[#282828]'
                  }`}
                >
                  <span className="text-xs">♟️</span>
                  <span>Game Theory War Room</span>
                </a>

                <a
                  href="#/content"
                  className={`flex items-center gap-2 px-2 py-1 rounded-md text-xs transition ${
                    currentPath === 'content' || currentPath === 'content-management'
                      ? 'bg-[#2c2c2c] text-white font-medium'
                      : 'text-[#9b9b9b] hover:text-white hover:bg-[#282828]'
                  }`}
                >
                  <Clapperboard className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Content Studio &amp; Planning</span>
                </a>
              </div>
            )}
          </div>

          {/* Business Disciplines Pages Tree */}
          <div className="space-y-2 pt-1">
            <div className="px-2 text-[11px] font-medium text-[#787774] flex items-center justify-between uppercase tracking-wider">
              <span>Business Disciplines</span>
              <span className="text-[10px] font-mono">22</span>
            </div>

            {CATEGORY_ORDER.map((cat) => {
              const topicsInCat = groupedTopics[cat];
              if (!topicsInCat || topicsInCat.length === 0) return null;
              const isCollapsed = collapsedCategories[cat];

              return (
                <div key={cat} className="space-y-0.5">
                  <div
                    onClick={() => toggleCategory(cat)}
                    className="flex items-center justify-between px-2 py-0.5 text-[11px] font-medium text-[#8a8a8a] hover:text-[#d4d4d4] cursor-pointer rounded hover:bg-[#252525]"
                  >
                    <span>{cat}</span>
                    {isCollapsed ? (
                      <ChevronRight className="w-3 h-3 text-[#6a6a6a]" />
                    ) : (
                      <ChevronDown className="w-3 h-3 text-[#6a6a6a]" />
                    )}
                  </div>

                  {!isCollapsed && (
                    <div className="space-y-0.5 pl-2 border-l border-[#2e2e2e] ml-2.5">
                      {topicsInCat.map((t) => {
                        const emoji = emojiForTopic(t.id);
                        const isActive = currentPath === 'topic' && currentSub === t.id;
                        const taskCount = db.tasks.filter((task) => task.topicId === t.id && !task.parentId).length;
                        const isFav = favorites.includes(t.id);

                        return (
                          <div
                            key={t.id}
                            className={`group/topic flex items-center justify-between px-2 py-1 rounded-md text-xs transition ${
                              isActive
                                ? 'bg-[#2c2c2c] text-white font-medium'
                                : 'text-[#9b9b9b] hover:text-white hover:bg-[#282828]'
                            }`}
                          >
                            <a
                              href={href(`/topic/${t.id}`)}
                              className="flex items-center gap-2 truncate flex-1 min-w-0"
                            >
                              <span className="text-xs shrink-0">{emoji}</span>
                              <span className="truncate">{t.name}</span>
                            </a>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => toggleFavorite(t.id)}
                                className={`p-0.5 rounded text-[#787774] hover:text-amber-400 transition ${
                                  isFav ? 'opacity-100 text-amber-400 fill-amber-400' : 'opacity-0 group-hover/topic:opacity-100'
                                }`}
                                title={isFav ? 'Remove favorite' : 'Add to favorites'}
                              >
                                <Star className={`w-3 h-3 ${isFav ? 'fill-amber-400' : ''}`} />
                              </button>

                              {taskCount > 0 && (
                                <span className="text-[10px] font-mono text-[#6a6a6a] group-hover/topic:text-[#9b9b9b]">
                                  {taskCount}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sidebar Footer: New Page Button & User Info */}
      <div className="p-2 border-t border-[#2a2a2a] bg-[#1e1e1e] space-y-1">
        <button
          onClick={() => setQuickAddOpen(true)}
          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium text-[#9b9b9b] hover:text-white hover:bg-[#282828] transition group"
        >
          <Plus className="w-3.5 h-3.5 text-[#9b9b9b] group-hover:text-white" />
          <span>New page or task</span>
          <span className="ml-auto text-[10px] font-mono opacity-50">C</span>
        </button>
      </div>
    </aside>
  );
};
