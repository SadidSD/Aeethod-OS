import React, { useEffect } from 'react';
import { useStore } from './store';
import { useRoute } from './lib/router';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { CommandPalette } from './components/CommandPalette';
import { QuickAddTask } from './components/QuickAddTask';
import { SidePeek } from './components/SidePeek';

// Views
import { HomeView } from './views/HomeView';
import { TopicView } from './views/TopicView';
import { DevBoardView } from './views/DevBoardView';
import { DevSprintsView } from './views/DevSprintsView';
import { DevEpicsView } from './views/DevEpicsView';
import { SaaSMetricsView } from './views/SaaSMetricsView';
import { CompetitorMatrixView } from './views/CompetitorMatrixView';
import { PricingSimulatorView } from './views/PricingSimulatorView';
import { SettingsView } from './views/SettingsView';
import { EconomicsView } from './views/EconomicsView';
import { GameTheoryView } from './views/GameTheoryView';
import { ContentManagementView } from './views/ContentManagementView';
import { DevArchitectureTrackerView } from './views/DevArchitectureTrackerView';
import { UiUxStudioView } from './views/UiUxStudioView';
import { WhiteboardView } from './views/WhiteboardView';
import { TechStackView } from './views/TechStackView';
import { ProductDetailView } from './views/ProductDetailView';
import { CardKnowledgeHubView } from './views/CardKnowledgeHubView';
import { CardAnatomyView } from './views/CardAnatomyView';

import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';



export const App: React.FC = () => {
  const {
    db,
    loadError,
    load,
    openTaskId,
    setOpenTask,
    paletteOpen,
    setPaletteOpen,
    quickAddOpen,
    setQuickAddOpen,
    toggleSidebar,
  } = useStore();

  const route = useRoute();

  // Load database on initial mount
  useEffect(() => {
    load();
  }, [load]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing inside an input or textarea or contentEditable
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable;

      // Ctrl+\: Toggle Sidebar
      if ((e.ctrlKey || e.metaKey) && e.key === '\\') {
        e.preventDefault();
        toggleSidebar();
        return;
      }

      // Ctrl+K or Cmd+K: Command Palette
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen(!paletteOpen);
        return;
      }

      // 'c' or 'C': Quick Add Task (only if not in an input)
      if (!isInput && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
        setQuickAddOpen(true);
        return;
      }

      // Escape: Close active modals
      if (e.key === 'Escape') {
        if (openTaskId) setOpenTask(null);
        if (paletteOpen) setPaletteOpen(false);
        if (quickAddOpen) setQuickAddOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openTaskId, paletteOpen, quickAddOpen, setOpenTask, setPaletteOpen, setQuickAddOpen]);

  // Loading Screen
  if (!db && !loadError) {
    return (
      <div className="h-screen w-screen bg-ink-950 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center font-black text-white text-2xl shadow-xl shadow-indigo-600/30 animate-pulse">
          A
        </div>
        <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
          <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
          <span>Loading Aeethod OS...</span>
        </div>
      </div>
    );
  }

  // Error Screen
  if (loadError) {
    return (
      <div className="h-screen w-screen bg-ink-950 flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-950/80 border border-rose-800 flex items-center justify-center text-rose-400">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-white">Failed to connect to Aeethod OS</h2>
          <p className="text-xs text-rose-300 font-mono max-w-md">{loadError}</p>
        </div>
        <button
          onClick={() => load()}
          className="btn-primary flex items-center gap-2 text-xs py-2 px-4"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Connection</span>
        </button>
      </div>
    );
  }

  // Render View based on hash route
  const renderCurrentView = () => {
    const main = route[0] || 'home';
    const sub = route[1];

    switch (main) {
      case 'home':
        return <HomeView />;
      case 'topic':
        if (sub === 'economics') return <EconomicsView />;
        return <TopicView topicId={sub || 'strategy'} />;
      case 'economics':
        return <EconomicsView />;
      case 'game-theory':
        return <GameTheoryView />;
      case 'content':
      case 'content-management':
        return <ContentManagementView />;
      case 'product':
      case 'saas-product':
        if (sub) return <ProductDetailView productId={sub} />;
        return <DevArchitectureTrackerView />;
      case 'products':
      case 'saas-products':
        if (sub) return <ProductDetailView productId={sub} />;
        return <DevArchitectureTrackerView />;
      case 'dev':
        if (sub === 'ui-ux' || sub === 'ui' || sub === 'ux') return <UiUxStudioView />;
        if (sub === 'stack' || sub === 'tech-stack' || sub === 'stacks') return <TechStackView />;
        if (sub === 'product' && route[2]) return <ProductDetailView productId={route[2]} />;
        if (sub === 'products' || sub === 'architecture' || sub === 'plan') return <DevArchitectureTrackerView />;
        if (sub === 'sprints') return <DevSprintsView />;
        if (sub === 'epics') return <DevEpicsView />;
        return <DevBoardView />;
      case 'stack':
      case 'tech-stack':
      case 'stacks':
        return <TechStackView />;
      case 'ui-ux':
      case 'ui':
      case 'ux':
        return <UiUxStudioView />;
      case 'architecture':
      case 'vibe':
      case 'plan':
        return <DevArchitectureTrackerView />;
      case 'whiteboard':
      case 'miro':
      case 'board-canvas':
        return <WhiteboardView />;

      case 'knowledge':
        if (sub === 'cards' || sub === 'card' || !sub) return <CardKnowledgeHubView />;
        return <CardKnowledgeHubView />;
      case 'card-knowledge':
      case 'tcg-knowledge':
        return <CardKnowledgeHubView />;
      case 'cards':
      case 'card':
        if (sub === 'anatomy' || sub === 'explorer') return <CardAnatomyView />;
        return <CardKnowledgeHubView />;
      case 'card-anatomy':
      case 'anatomy':
        return <CardAnatomyView />;

      case 'metrics':
        return <SaaSMetricsView />;
      case 'competitors':
        return <CompetitorMatrixView />;
      case 'pricing-sim':
        return <PricingSimulatorView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#191919] text-[#e6e6e6] select-none">
      {/* Fixed Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-[#191919]">
        {/* Topbar */}
        <Topbar />

        {/* Scrollable View Container */}
        <main className="flex-1 overflow-y-auto min-h-0 bg-[#191919] select-text">
          {renderCurrentView()}
        </main>
      </div>

      {/* Global Modals */}
      <CommandPalette />
      <QuickAddTask />
      <SidePeek />
    </div>
  );
};

export default App;
