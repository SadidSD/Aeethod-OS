import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, CheckSquare, FileText, ArrowRight, Folder, Sun, Moon } from 'lucide-react';
import { useStore } from '../store';
import { navigate } from '../lib/router';
import { iconFor } from '../lib/constants';

export const CommandPalette: React.FC = () => {
  const { paletteOpen, setPaletteOpen, db, setOpenTask, theme, toggleTheme } = useStore();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setPaletteOpen(!paletteOpen);
      }
      if (e.key === 'Escape' && paletteOpen) {
        setPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [paletteOpen, setPaletteOpen]);

  useEffect(() => {
    if (paletteOpen) setQuery('');
  }, [paletteOpen]);

  const results = useMemo(() => {
    if (!db || !query.trim()) return { topics: [], tasks: [], docs: [], customPages: [] };
    const q = query.toLowerCase();

    const staticPages = [
      { id: 'economics', name: 'TCG Microeconomics & Competitors Hub', path: '/topic/economics', category: 'Economics & Industry', emoji: '📈' },
      { id: 'game-theory', name: 'Game Theory War Room (Payoff Matrices & Battles)', path: '/game-theory', category: 'Strategy & Defense', emoji: '♟️' },
      { id: 'competitors', name: 'Competitor Matrix (26 Providers Analyzed)', path: '/competitors', category: 'Intelligence', emoji: '⚔️' },
      { id: 'metrics', name: 'SaaS Metrics & Unit Economics Modeler', path: '/metrics', category: 'Analytics', emoji: '📐' },
      { id: 'pricing-sim', name: 'Switching ROI & GMV Tax Calculator', path: '/pricing-sim', category: 'Economics', emoji: '🧮' },
    ].filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.id.includes(q));

    const matchedTopics = db.topics
      .filter((t) => t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q))
      .slice(0, 5);

    const matchedTasks = db.tasks
      .filter((t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))
      .slice(0, 8);

    const matchedDocs = db.docs
      .filter((d) => d.title.toLowerCase().includes(q) || d.content.toLowerCase().includes(q))
      .slice(0, 5);

    return { topics: matchedTopics, tasks: matchedTasks, docs: matchedDocs, customPages: staticPages };
  }, [db, query]);

  if (!paletteOpen || !db) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-2xl bg-ink-900 border border-ink-700 rounded-xl shadow-2xl overflow-hidden animate-pop-in">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-ink-700 bg-ink-850">
          <Search className="w-5 h-5 text-indigo-400 shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, topic, task, or doc... (Esc to close)"
            className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 outline-none"
          />
          <button
            onClick={() => setPaletteOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-200 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-4">
          {!query.trim() && (
            <div className="p-3 text-xs text-slate-400 space-y-2">
              <span className="font-semibold uppercase tracking-wider text-slate-500 block">
                Quick Jumps
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    navigate('/home');
                    setPaletteOpen(false);
                  }}
                  className="flex items-center gap-2 p-2 rounded-lg bg-ink-800 hover:bg-ink-700 text-slate-200 transition text-left"
                >
                  <Folder className="w-4 h-4 text-indigo-400" />
                  <span>Executive Home</span>
                </button>
                <button
                  onClick={() => {
                    navigate('/game-theory');
                    setPaletteOpen(false);
                  }}
                  className="flex items-center gap-2 p-2 rounded-lg bg-ink-800 hover:bg-ink-700 text-slate-200 transition text-left border border-indigo-500/30"
                >
                  <span className="text-sm">♟️</span>
                  <span className="font-medium text-indigo-300">Game Theory War Room</span>
                </button>
                <button
                  onClick={() => {
                    navigate('/topic/economics');
                    setPaletteOpen(false);
                  }}
                  className="flex items-center gap-2 p-2 rounded-lg bg-ink-800 hover:bg-ink-700 text-slate-200 transition text-left"
                >
                  <span className="text-sm">📈</span>
                  <span>TCG Microeconomics</span>
                </button>
                <button
                  onClick={() => {
                    navigate('/dev/board');
                    setPaletteOpen(false);
                  }}
                  className="flex items-center gap-2 p-2 rounded-lg bg-ink-800 hover:bg-ink-700 text-slate-200 transition text-left"
                >
                  <CheckSquare className="w-4 h-4 text-emerald-400" />
                  <span>Dev Sprint Board</span>
                </button>
                <button
                  onClick={() => {
                    navigate('/metrics');
                    setPaletteOpen(false);
                  }}
                  className="flex items-center gap-2 p-2 rounded-lg bg-ink-800 hover:bg-ink-700 text-slate-200 transition text-left"
                >
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                  <span>SaaS Metrics Engine</span>
                </button>
                <button
                  onClick={() => {
                    navigate('/competitors');
                    setPaletteOpen(false);
                  }}
                  className="flex items-center gap-2 p-2 rounded-lg bg-ink-800 hover:bg-ink-700 text-slate-200 transition text-left"
                >
                  <ArrowRight className="w-4 h-4 text-rose-400" />
                  <span>Competitor Matrix</span>
                </button>
                <button
                  onClick={() => {
                    toggleTheme();
                    setPaletteOpen(false);
                  }}
                  className="flex items-center gap-2 p-2 rounded-lg bg-ink-800 hover:bg-ink-700 text-slate-200 transition text-left col-span-2"
                >
                  {theme === 'light' ? (
                    <Moon className="w-4 h-4 text-indigo-400" />
                  ) : (
                    <Sun className="w-4 h-4 text-amber-400" />
                  )}
                  <span>Toggle Theme: Switch to {theme === 'light' ? 'Dark Mode' : 'White Mode'}</span>
                </button>
              </div>
            </div>
          )}

          {results.customPages.length > 0 && (
            <div>
              <span className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                Strategic Engines & Hubs
              </span>
              <div className="space-y-1">
                {results.customPages.map((page) => (
                  <button
                    key={page.id}
                    onClick={() => {
                      navigate(page.path);
                      setPaletteOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-ink-800 text-left transition group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded flex items-center justify-center text-sm bg-ink-800 border border-ink-700">
                        {page.emoji}
                      </span>
                      <div>
                        <div className="text-sm font-medium text-slate-100 group-hover:text-indigo-300">
                          {page.name}
                        </div>
                        <div className="text-xs text-slate-400">{page.category}</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 opacity-0 group-hover:opacity-100 transition" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {results.topics.length > 0 && (
            <div>
              <span className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                Topics & Business Areas
              </span>
              <div className="space-y-1">
                {results.topics.map((t) => {
                  const Icon = iconFor(t.icon);
                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        navigate(t.id === 'dev' ? '/dev/board' : `/topic/${t.id}`);
                        setPaletteOpen(false);
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-ink-800 text-left transition group"
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-6 h-6 rounded flex items-center justify-center text-xs"
                          style={{ backgroundColor: `${t.color}20`, color: t.color }}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </span>
                        <div>
                          <div className="text-sm font-medium text-slate-100 group-hover:text-indigo-300">
                            {t.name}
                          </div>
                          <div className="text-xs text-slate-400">{t.category}</div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500 opacity-0 group-hover:opacity-100 transition" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {results.tasks.length > 0 && (
            <div>
              <span className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                Tasks & Features
              </span>
              <div className="space-y-1">
                {results.tasks.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => {
                      setOpenTask(task.id);
                      setPaletteOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-ink-800 text-left transition group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <CheckSquare className="w-4 h-4 text-slate-400 shrink-0" />
                      <div className="truncate">
                        <div className="text-sm font-medium text-slate-100 group-hover:text-indigo-300 truncate">
                          {task.title}
                        </div>
                        <div className="text-xs text-slate-400">
                          {db.topics.find((t) => t.id === task.topicId)?.name || task.topicId} •{' '}
                          <span className="capitalize">{task.status.replace('_', ' ')}</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-slate-500 uppercase tracking-wide px-2 py-0.5 rounded bg-ink-950">
                      {task.priority}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {results.docs.length > 0 && (
            <div>
              <span className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                Documents & Strategy Specs
              </span>
              <div className="space-y-1">
                {results.docs.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => {
                      navigate(`/topic/${d.topicId}`);
                      setPaletteOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-ink-800 text-left transition group"
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                      <div>
                        <div className="text-sm font-medium text-slate-100 group-hover:text-indigo-300">
                          {d.title}
                        </div>
                        <div className="text-xs text-slate-400">
                          In {db.topics.find((t) => t.id === d.topicId)?.name || d.topicId}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 opacity-0 group-hover:opacity-100 transition" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {query.trim() &&
            results.customPages.length === 0 &&
            results.topics.length === 0 &&
            results.tasks.length === 0 &&
            results.docs.length === 0 && (
              <div className="p-8 text-center text-slate-400 text-sm">
                No results found for "{query}".
              </div>
            )}
        </div>
      </div>
    </div>
  );
};
