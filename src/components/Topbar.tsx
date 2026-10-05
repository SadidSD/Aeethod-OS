import React from 'react';
import {
  Search,
  Plus,
  RefreshCw,
  AlertCircle,
  Star,
  PanelLeft,
  Check,
  Sun,
  Moon,
} from 'lucide-react';
import { useStore, useDb } from '../store';
import { useRoute } from '../lib/router';
import { emojiForTopic } from '../lib/constants';

export const Topbar: React.FC = () => {
  const {
    sidebarOpen,
    toggleSidebar,
    favorites,
    toggleFavorite,
    setPaletteOpen,
    setQuickAddOpen,
    sync,
    syncError,
    source,
    theme,
    toggleTheme,
  } = useStore();
  const isLight = theme === 'light';

  const db = useDb();
  const route = useRoute();

  const currentPath = route[0] || 'home';
  const currentSub = route[1];

  let pageTitle = 'Executive Overview';
  let categoryLabel = 'Workspace';
  let pageEmoji = '⚡';
  let currentId = currentPath === 'topic' ? currentSub : currentPath;

  if (currentPath === 'topic' && currentSub) {
    if (currentSub === 'economics') {
      pageTitle = 'TCG Microeconomics & Competitors';
      categoryLabel = 'Economics';
      pageEmoji = '📈';
    } else {
      const t = db.topics.find((x) => x.id === currentSub);
      if (t) {
        pageTitle = t.name;
        categoryLabel = t.category;
        pageEmoji = emojiForTopic(t.id);
      }
    }
  } else if (currentPath === 'economics') {
    categoryLabel = 'Economics';
    pageEmoji = '📈';
    pageTitle = 'TCG Microeconomics & Competitors';
  } else if (currentPath === 'game-theory') {
    categoryLabel = 'Strategy & Defense';
    pageEmoji = '♟️';
    pageTitle = 'Game Theory War Room';
  } else if (currentPath === 'dev') {
    categoryLabel = 'Engineering';
    pageEmoji = '🛠️';
    if (currentSub === 'sprints') pageTitle = 'Sprint Planning';
    else if (currentSub === 'epics') pageTitle = 'Roadmap Epics';
    else pageTitle = 'Sprint Kanban Board';
  } else if (currentPath === 'metrics') {
    categoryLabel = 'Analytics';
    pageEmoji = '📐';
    pageTitle = 'SaaS Metrics Modeler';
  } else if (currentPath === 'competitors') {
    categoryLabel = 'Intelligence';
    pageEmoji = '⚔️';
    pageTitle = 'Competitor Matrix (26)';
  } else if (currentPath === 'pricing-sim') {
    categoryLabel = 'Economics';
    pageEmoji = '🧮';
    pageTitle = 'Switching ROI Simulator';
  } else if (currentPath === 'settings') {
    categoryLabel = 'System';
    pageEmoji = '⚙️';
    pageTitle = 'Settings & Data';
  }

  const isFavorited = currentId ? favorites.includes(currentId) : false;

  return (
    <header className="h-11 border-b border-[#2e2e2e] bg-[#191919] flex items-center justify-between px-4 shrink-0 z-20 select-none text-xs">
      {/* Left: Sidebar toggle + Breadcrumb */}
      <div className="flex items-center gap-2 min-w-0">
        {!sidebarOpen && (
          <button
            onClick={() => toggleSidebar(true)}
            className="p-1 rounded-md text-[#9b9b9b] hover:text-white hover:bg-[#282828] transition"
            title="Open Sidebar (Ctrl+\)"
          >
            <PanelLeft className="w-4 h-4" />
          </button>
        )}

        <div className="flex items-center gap-1.5 text-[#9b9b9b] truncate">
          <span className="hover:text-white cursor-pointer transition truncate">
            {categoryLabel}
          </span>
          <span className="text-[#555555]">/</span>
          <span className="flex items-center gap-1.5 text-white font-medium truncate">
            <span className="text-xs">{pageEmoji}</span>
            <span className="truncate">{pageTitle}</span>
          </span>
        </div>
      </div>

      {/* Right: Controls & Persistence */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Favorite Star Button */}
        {currentId && (
          <button
            onClick={() => toggleFavorite(currentId)}
            className={`p-1.5 rounded-md transition flex items-center gap-1 text-[11px] ${
              isFavorited
                ? 'text-amber-400 hover:bg-[#282828]'
                : 'text-[#9b9b9b] hover:text-white hover:bg-[#282828]'
            }`}
            title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star className={`w-3.5 h-3.5 ${isFavorited ? 'fill-amber-400' : ''}`} />
            <span className="hidden sm:inline-block">{isFavorited ? 'Starred' : 'Star'}</span>
          </button>
        )}

        {/* Database / Persistence Status */}
        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono border ${
          isLight
            ? 'bg-slate-100 border-slate-200 text-slate-600'
            : 'bg-[#202020] border-[#2e2e2e] text-[#9b9b9b]'
        }`}>
          {sync === 'idle' && (
            <>
              <span className={`w-1.5 h-1.5 rounded-full ${source === 'supabase' ? 'bg-emerald-500 animate-pulse' : 'bg-indigo-400'}`} />
              <span className="hidden md:inline font-medium">
                {source === 'supabase' ? 'Supabase Live' : source === 'local_server' ? 'Local DB' : 'Aeethod DB'}
              </span>
            </>
          )}
          {sync === 'saving' && (
            <>
              <RefreshCw className="w-3 h-3 text-amber-500 animate-spin" />
              <span className="text-amber-500">Syncing...</span>
            </>
          )}
          {sync === 'error' && (
            <>
              <AlertCircle className="w-3 h-3 text-rose-500" />
              <span className="text-rose-500" title={syncError || ''}>
                Sync Notice
              </span>
            </>
          )}
        </div>

        {/* Search Trigger */}
        <button
          onClick={() => setPaletteOpen(true)}
          className="p-1.5 rounded-md text-[#9b9b9b] hover:text-white hover:bg-[#282828] transition flex items-center gap-1.5"
          title="Search (Ctrl+K)"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-[11px] font-mono opacity-60">Ctrl K</span>
        </button>

        {/* Theme Toggle (Light / Dark Mode) */}
        <button
          onClick={() => toggleTheme()}
          className="p-1.5 rounded-md text-[#9b9b9b] hover:text-white hover:bg-[#282828] transition flex items-center gap-1.5"
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to White Mode'}
        >
          {theme === 'light' ? (
            <Moon className="w-3.5 h-3.5 text-indigo-500" />
          ) : (
            <Sun className="w-3.5 h-3.5 text-amber-400" />
          )}
          <span className="hidden lg:inline text-[11px] font-medium">
            {theme === 'light' ? 'Dark' : 'White'}
          </span>
        </button>

        {/* Quick New Task */}
        <button
          onClick={() => setQuickAddOpen(true)}
          className="btn-primary text-xs py-1 px-2.5 shadow-none"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New</span>
        </button>
      </div>
    </header>
  );
};
