import React, { useState } from 'react';
import {
  Layers,
  Code2,
  Database,
  Server,
  Layout,
  Cpu,
  Edit3,
  Save,
  CheckCircle2,
  ArrowRight,
  Boxes,
  Package
} from 'lucide-react';
import { useStore } from '../store';
import { SaaSProductPillar } from '../data/devPlanningData';

export const TechStackView: React.FC = () => {
  const { theme, db, update } = useStore();
  const isLight = theme === 'light';

  const saasProducts: SaaSProductPillar[] = db?.saas_products || [];

  const [selectedProductFilter, setSelectedProductFilter] = useState<string>('All');

  // Inline editing state for Technical Stacks
  const [editingStackProdId, setEditingStackProdId] = useState<string | null>(null);
  const [editUiUx, setEditUiUx] = useState('');
  const [editFrontend, setEditFrontend] = useState('');
  const [editBackend, setEditBackend] = useState('');
  const [editDatabase, setEditDatabase] = useState('');
  const [editDevOps, setEditDevOps] = useState('');

  const startEditingStack = (prod: SaaSProductPillar) => {
    setEditingStackProdId(prod.id);
    setEditUiUx(prod.techStack?.uiUx || '');
    setEditFrontend(prod.techStack?.frontend || '');
    setEditBackend(prod.techStack?.backend || '');
    setEditDatabase(prod.techStack?.database || '');
    setEditDevOps(prod.techStack?.devOps || '');
  };

  const saveEditedStack = (prodId: string) => {
    update('saas_products', prodId, {
      techStack: {
        uiUx: editUiUx.trim(),
        frontend: editFrontend.trim(),
        backend: editBackend.trim(),
        database: editDatabase.trim(),
        devOps: editDevOps.trim()
      }
    });
    setEditingStackProdId(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-slide-in">
      {/* Header Banner */}
      <div
        className={`p-6 rounded-2xl border transition-all ${
          isLight
            ? 'bg-gradient-to-br from-white via-cyan-50/20 to-slate-50 border-slate-200 shadow-sm'
            : 'bg-gradient-to-br from-[#1a1a24] via-[#16161d] to-[#121216] border-[#2e2e38]'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 font-bold">
                Engineering Architecture
              </span>
              <span className="text-[11px] text-slate-500 font-mono">Full Stack Layer Specs</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1 ml-auto lg:ml-2">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                <span>Supabase Synced</span>
              </span>
            </div>
            <h1 className={`text-2xl lg:text-3xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Full Technical Stacks
            </h1>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Detailed technical stack specifications per product covering <strong>UI/UX Design, Frontend, Backend & APIs, Database Schemas, and DevOps / Deployment</strong>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#/dev/products"
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition ${
                isLight
                  ? 'border-slate-300 bg-white hover:bg-slate-100 text-slate-800 shadow-xs'
                  : 'border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200'
              }`}
            >
              <Package className="w-4 h-4 text-emerald-500" />
              <span>← Back to SaaS Products</span>
            </a>
          </div>
        </div>

        {/* Quick Summary Pill Bar */}
        <div className="flex items-center gap-4 mt-6 pt-5 border-t border-slate-800/60 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Boxes className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-400">Total Products:</span>
            <span className={isLight ? 'font-bold text-slate-900' : 'font-bold text-white'}>{saasProducts.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-400">Technical Stacks Configured:</span>
            <span className={isLight ? 'font-bold text-slate-900' : 'font-bold text-white'}>{saasProducts.length}</span>
          </div>
        </div>
      </div>

      {/* Product Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className={`text-[11px] font-semibold uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Product Filter:</span>
          <button
            onClick={() => setSelectedProductFilter('All')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition shrink-0 ${
              selectedProductFilter === 'All'
                ? 'bg-cyan-600 text-white shadow-sm'
                : isLight
                ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All Products ({saasProducts.length})
          </button>
          {saasProducts.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedProductFilter(p.id)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition shrink-0 flex items-center gap-1.5 ${
                selectedProductFilter === p.id
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : isLight
                  ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span>{p.icon}</span>
              <span>{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tech Stack Cards */}
      <div className="space-y-6">
        {saasProducts
          .filter((p) => selectedProductFilter === 'All' || p.id === selectedProductFilter)
          .map((prod) => {
            const isEditing = editingStackProdId === prod.id;

            return (
              <div
                key={prod.id}
                className={`rounded-2xl border overflow-hidden transition-all ${
                  isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#1b1b20] border-[#2e2e34]'
                }`}
              >
                {/* Product Header Row */}
                <div
                  className={`p-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isLight ? 'bg-slate-50/80 border-slate-200' : 'bg-slate-900/40 border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-2xl p-2 rounded-xl border ${
                        isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-800 border-slate-700 text-white'
                      }`}
                    >
                      {prod.icon}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <a
                          href={`#/product/${prod.id}`}
                          className={`text-base font-bold hover:underline ${isLight ? 'text-slate-900' : 'text-white'}`}
                        >
                          {prod.name}
                        </a>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                            isLight
                              ? 'bg-cyan-50 text-cyan-800 border-cyan-300 font-semibold'
                              : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
                          }`}
                        >
                          {prod.status}
                        </span>
                      </div>
                      <p className={`text-xs font-mono mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        {prod.tagline}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`#/product/${prod.id}`}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition ${
                        isLight
                          ? 'border-indigo-300 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 shadow-xs'
                          : 'border-indigo-500/40 bg-indigo-950/40 hover:bg-indigo-900/40 text-indigo-300'
                      }`}
                    >
                      <span>Product Details ➔</span>
                    </a>

                    {isEditing ? (
                      <button
                        onClick={() => saveEditedStack(prod.id)}
                        className="btn-primary text-xs px-3.5 py-1.5 flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Stack Updates</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => startEditingStack(prod)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition ${
                          isLight
                            ? 'border-slate-300 bg-white hover:bg-slate-100 text-slate-700 shadow-xs'
                            : 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200'
                        }`}
                      >
                        <Edit3 className="w-3.5 h-3.5 text-cyan-500" />
                        <span>Edit Technical Stack</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Technical Stacks Grid: UI/UX, Frontend, Backend, Database */}
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
                  {/* 1. UI/UX Layer */}
                  <div
                    className={`p-4 rounded-xl border space-y-2 ${
                      isLight
                        ? 'bg-purple-50/50 border-purple-200 text-slate-800'
                        : 'bg-slate-900/60 border-purple-500/30 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 text-purple-500 font-bold uppercase text-[10px] tracking-wider">
                      <Layout className="w-4 h-4" />
                      <span>1. UI / UX Experience</span>
                    </div>
                    {isEditing ? (
                      <textarea
                        rows={4}
                        value={editUiUx}
                        onChange={(e) => setEditUiUx(e.target.value)}
                        placeholder="Describe UI layout, design tokens, touch pads, theme..."
                        className={`w-full p-2.5 rounded-lg border text-[11px] font-mono ${
                          isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
                        }`}
                      />
                    ) : (
                      <p className="leading-relaxed text-[11px]">
                        {prod.techStack?.uiUx || 'Modern dark glassmorphism, rapid action bar, responsive kiosk/mobile layouts'}
                      </p>
                    )}
                  </div>

                  {/* 2. Frontend Layer */}
                  <div
                    className={`p-4 rounded-xl border space-y-2 ${
                      isLight
                        ? 'bg-cyan-50/50 border-cyan-200 text-slate-800'
                        : 'bg-slate-900/60 border-cyan-500/30 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 text-cyan-500 font-bold uppercase text-[10px] tracking-wider">
                      <Code2 className="w-4 h-4" />
                      <span>2. Frontend Stack</span>
                    </div>
                    {isEditing ? (
                      <textarea
                        rows={4}
                        value={editFrontend}
                        onChange={(e) => setEditFrontend(e.target.value)}
                        placeholder="React 18, HTML5 Canvas, Tailwind v4, Zustand store..."
                        className={`w-full p-2.5 rounded-lg border text-[11px] font-mono ${
                          isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
                        }`}
                      />
                    ) : (
                      <p className="leading-relaxed text-[11px]">
                        {prod.techStack?.frontend || 'React 18, TypeScript, Tailwind CSS, Vite, HTML5 Canvas'}
                      </p>
                    )}
                  </div>

                  {/* 3. Backend Layer */}
                  <div
                    className={`p-4 rounded-xl border space-y-2 ${
                      isLight
                        ? 'bg-amber-50/50 border-amber-200 text-slate-800'
                        : 'bg-slate-900/60 border-amber-500/30 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 text-amber-500 font-bold uppercase text-[10px] tracking-wider">
                      <Server className="w-4 h-4" />
                      <span>3. Backend & APIs</span>
                    </div>
                    {isEditing ? (
                      <textarea
                        rows={4}
                        value={editBackend}
                        onChange={(e) => setEditBackend(e.target.value)}
                        placeholder="Node.js, Express, Edge Functions, GraphQL endpoints..."
                        className={`w-full p-2.5 rounded-lg border text-[11px] font-mono ${
                          isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
                        }`}
                      />
                    ) : (
                      <p className="leading-relaxed text-[11px]">
                        {prod.techStack?.backend || 'Node.js, Edge Functions, WebSocket Live Engine, GraphQL REST Gateway'}
                      </p>
                    )}
                  </div>

                  {/* 4. Database Layer */}
                  <div
                    className={`p-4 rounded-xl border space-y-2 ${
                      isLight
                        ? 'bg-emerald-50/50 border-emerald-200 text-slate-800'
                        : 'bg-slate-900/60 border-emerald-500/30 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 text-emerald-500 font-bold uppercase text-[10px] tracking-wider">
                      <Database className="w-4 h-4" />
                      <span>4. Database & Tables</span>
                    </div>
                    {isEditing ? (
                      <textarea
                        rows={4}
                        value={editDatabase}
                        onChange={(e) => setEditDatabase(e.target.value)}
                        placeholder="PostgreSQL, Supabase tables, RLS policies, Redis cache..."
                        className={`w-full p-2.5 rounded-lg border text-[11px] font-mono ${
                          isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
                        }`}
                      />
                    ) : (
                      <p className="leading-relaxed text-[11px]">
                        {prod.techStack?.database || 'Supabase PostgreSQL, RLS Policies, Redis Realtime Cache'}
                      </p>
                    )}
                  </div>
                </div>

                {/* DevOps bar */}
                <div className="px-5 pb-5 pt-0">
                  <div
                    className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-slate-900/40 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                      <span className={`font-bold ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>DevOps & Hosting:</span>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editDevOps}
                          onChange={(e) => setEditDevOps(e.target.value)}
                          placeholder="Vercel + Supabase + GitHub Actions CI"
                          className={`px-2 py-1 rounded border text-xs w-72 ${
                            isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
                          }`}
                        />
                      ) : (
                        <span>{prod.techStack?.devOps || 'Vercel static deploy + Supabase Cloud'}</span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 font-sans">
                      Target Audience: {prod.targetAudience}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
