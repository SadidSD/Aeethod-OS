import React, { useState, useMemo, useEffect } from 'react';
import {
  Palette,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  BookOpen,
  Scale,
  Sliders,
  ChevronRight,
  ChevronLeft,
  Copy,
  Check,
  FileText,
  Trash2,
  Edit3,
  Layers,
  Sparkles,
  ShieldCheck,
  PanelRight,
  Monitor,
  Layout,
  Lightbulb,
  Maximize2,
  Eye,
  Type,
  Grid,
  Sun
} from 'lucide-react';
import { useStore } from '../store';
import {
  UiDecisionRecord,
  UiDecisionStatus,
  CoreUiTerm,
  UI_PRINCIPLES,
  CORE_UI_TERMS,
  INITIAL_UI_DECISION_RECORDS
} from '../data/uiDecisionData';

const LOCAL_STORAGE_KEY = 'aeethod_ui_decisions_v1';

export const UiDesignWorkplaceView: React.FC = () => {
  const { theme } = useStore();
  const isLight = theme === 'light';

  // Decisions State (Clean, persisted via localStorage, defaults to empty array)
  const [decisions, setDecisions] = useState<UiDecisionRecord[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return INITIAL_UI_DECISION_RECORDS;
  });

  // Save to localStorage whenever decisions change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(decisions));
    } catch {
      // Ignore write errors
    }
  }, [decisions]);

  // Selected decision for inspection / verification
  const [selectedDecisionId, setSelectedDecisionId] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Right Companion State
  const [isCompanionOpen, setIsCompanionOpen] = useState(true);
  const [companionTab, setCompanionTab] = useState<'principles' | 'terms'>('principles');
  const [termSearchQuery, setTermSearchQuery] = useState('');

  // Composer Modal State
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [editingDecisionId, setEditingDecisionId] = useState<string | null>(null);
  const [composerTitle, setComposerTitle] = useState('');
  const [composerProblem, setComposerProblem] = useState('');
  const [composerSurface, setComposerSurface] = useState('Desktop Singles Grid');
  const [composerDecision, setComposerDecision] = useState('');
  const [composerAlternatives, setComposerAlternatives] = useState('');
  const [composerStatus, setComposerStatus] = useState<UiDecisionStatus>('Draft');
  const [composerTaggedTerms, setComposerTaggedTerms] = useState<CoreUiTerm[]>([]);
  const [composerVerifiedPrinciples, setComposerVerifiedPrinciples] = useState<string[]>([]);
  const [composerNotes, setComposerNotes] = useState('');

  // Feedback Toasts
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtered decisions list
  const filteredDecisions = useMemo(() => {
    return decisions.filter((d) => {
      const matchStatus = statusFilter === 'All' || d.status === statusFilter;
      const matchSearch =
        searchQuery === '' ||
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.problem.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.decision.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.taggedTerms.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchStatus && matchSearch;
    });
  }, [decisions, statusFilter, searchQuery]);

  // Active decision being inspected
  const activeDecision = useMemo(() => {
    if (!selectedDecisionId) return decisions[0] || null;
    return decisions.find((d) => d.id === selectedDecisionId) || decisions[0] || null;
  }, [decisions, selectedDecisionId]);

  // Open Composer for new item
  const handleOpenNewComposer = () => {
    setEditingDecisionId(null);
    setComposerTitle('');
    setComposerProblem('');
    setComposerSurface('Desktop Singles Grid');
    setComposerDecision('');
    setComposerAlternatives('');
    setComposerStatus('Draft');
    setComposerTaggedTerms(['Tabular Figures', 'Visual Hierarchy']);
    setComposerVerifiedPrinciples([]);
    setComposerNotes('');
    setIsComposerOpen(true);
  };

  // Open Composer for existing item
  const handleEditDecision = (d: UiDecisionRecord) => {
    setEditingDecisionId(d.id);
    setComposerTitle(d.title);
    setComposerProblem(d.problem);
    setComposerSurface(d.surfaceContext);
    setComposerDecision(d.decision);
    setComposerAlternatives(d.alternativesRejected);
    setComposerStatus(d.status);
    setComposerTaggedTerms(d.taggedTerms);
    setComposerVerifiedPrinciples(d.verifiedPrincipleIds);
    setComposerNotes(d.notes || '');
    setIsComposerOpen(true);
  };

  // Save Composer (Create or Edit)
  const handleSaveComposer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composerTitle.trim()) return;

    const now = new Date().toISOString();

    if (editingDecisionId) {
      // Update existing
      setDecisions((prev) =>
        prev.map((d) => {
          if (d.id !== editingDecisionId) return d;
          return {
            ...d,
            title: composerTitle.trim(),
            problem: composerProblem.trim(),
            surfaceContext: composerSurface,
            decision: composerDecision.trim(),
            alternativesRejected: composerAlternatives.trim(),
            taggedTerms: composerTaggedTerms,
            verifiedPrincipleIds: composerVerifiedPrinciples,
            status: composerStatus,
            notes: composerNotes.trim() || undefined,
            updatedAt: now
          };
        })
      );
      showToast('UI Decision updated successfully!');
    } else {
      // Create new
      const newRecord: UiDecisionRecord = {
        id: `ui-dec-${Date.now()}`,
        title: composerTitle.trim(),
        problem: composerProblem.trim(),
        surfaceContext: composerSurface,
        decision: composerDecision.trim(),
        alternativesRejected: composerAlternatives.trim(),
        taggedTerms: composerTaggedTerms,
        verifiedPrincipleIds: composerVerifiedPrinciples,
        status: composerStatus,
        notes: composerNotes.trim() || undefined,
        createdAt: now,
        updatedAt: now
      };
      setDecisions((prev) => [newRecord, ...prev]);
      setSelectedDecisionId(newRecord.id);
      showToast('New UI Decision logged in register!');
    }

    setIsComposerOpen(false);
  };

  // Delete decision
  const handleDeleteDecision = (id: string) => {
    if (window.confirm('Are you sure you want to delete this UI Decision?')) {
      setDecisions((prev) => prev.filter((d) => d.id !== id));
      if (selectedDecisionId === id) setSelectedDecisionId(null);
      showToast('UI Decision deleted.');
    }
  };

  // Toggle Term in Composer
  const handleToggleComposerTerm = (term: CoreUiTerm) => {
    setComposerTaggedTerms((prev) =>
      prev.includes(term) ? prev.filter((t) => t !== term) : [...prev, term]
    );
  };

  // Toggle Principle Verification on Active Decision directly
  const handleTogglePrincipleVerification = (principleId: string) => {
    if (!activeDecision) return;
    const isVerified = activeDecision.verifiedPrincipleIds.includes(principleId);
    const updatedPrinciples = isVerified
      ? activeDecision.verifiedPrincipleIds.filter((id) => id !== principleId)
      : [...activeDecision.verifiedPrincipleIds, principleId];

    const updatedStatus: UiDecisionStatus =
      updatedPrinciples.length >= 3 && activeDecision.status === 'Draft' ? 'Token Verified' : activeDecision.status;

    setDecisions((prev) =>
      prev.map((d) => {
        if (d.id !== activeDecision.id) return d;
        return {
          ...d,
          verifiedPrincipleIds: updatedPrinciples,
          status: updatedStatus,
          updatedAt: new Date().toISOString()
        };
      })
    );
  };

  // Copy Decision as ADR Markdown
  const handleCopyAdrMarkdown = (d: UiDecisionRecord) => {
    const verifiedPrinciplesList = UI_PRINCIPLES
      .filter((p) => d.verifiedPrincipleIds.includes(p.id))
      .map((p) => `- **${p.name}**: ${p.shortRule} (Standard: ${p.formulaOrStandard})`)
      .join('\n');

    const markdown = `# UI Design & System Decision Record (ADR): ${d.title}
**Status:** ${d.status}  
**Date:** ${new Date(d.createdAt).toLocaleDateString()}  
**Target Surface:** ${d.surfaceContext}  
**Core UI Tokens & Terms:** ${d.taggedTerms.join(', ')}

---

## 1. Visual Problem & Design Challenge
${d.problem}

## 2. UI Decision & Token Specification
${d.decision}

## 3. Visual Alternatives Evaluated & Rejected
${d.alternativesRejected || 'None documented.'}

## 4. Verification Against 8 UI Principles & Standards
${verifiedPrinciplesList || 'No formal principles verified yet.'}

${d.notes ? `\n## 5. CSS / Token Implementation Notes\n${d.notes}\n` : ''}
---
*Generated by Aeethod OS — UI Design & Systems Workplace*
`;

    navigator.clipboard.writeText(markdown);
    showToast('UI ADR Markdown copied to clipboard!');
  };

  return (
    <div className="space-y-4 animate-fade-in pb-16 font-sans">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & WORKPLACE OVERVIEW                                        */}
      {/* ========================================================================= */}
      <div
        className={`p-5 sm:p-6 rounded-2xl border transition ${
          isLight
            ? 'bg-white border-slate-200/90 shadow-xs'
            : 'bg-[#15151c] border-[#262632] shadow-sm'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span
                className={`p-1.5 rounded-lg border flex items-center justify-center ${
                  isLight
                    ? 'bg-purple-50 text-purple-600 border-purple-200/70'
                    : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                }`}
              >
                <Palette className="w-4 h-4" />
              </span>
              <span
                className={`text-[11px] font-mono font-bold uppercase tracking-wider ${
                  isLight ? 'text-purple-600' : 'text-purple-400'
                }`}
              >
                Aeethod OS • UI Design & Systems
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                  isLight
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold'
                    : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                }`}
              >
                Design System Decision Engine
              </span>
            </div>

            <h1
              className={`text-2xl sm:text-3xl font-black tracking-tight ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}
            >
              UI Design & Systems Workplace
            </h1>

            <p
              className={`text-xs sm:text-sm leading-relaxed ${
                isLight ? 'text-slate-600' : 'text-slate-400'
              }`}
            >
              Formulate visual architecture decisions, document token specifications (Typography, Colors, 8pt Grid, Elevation),
              and verify your components against the <strong>8 Core Principles of UI Design</strong>.
            </p>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div
              className={`px-3.5 py-2 rounded-xl border flex items-center gap-3 font-mono ${
                isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-[#1a1a24] border-[#2c2c3a] text-white'
              }`}
            >
              <Layout className={`w-4 h-4 ${isLight ? 'text-purple-600' : 'text-purple-400'}`} />
              <div>
                <span className={`text-[9px] uppercase block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  UI Decisions Logged
                </span>
                <span className="text-xs font-bold">{decisions.length} Records</span>
              </div>
            </div>

            <button
              onClick={() => setIsCompanionOpen((prev) => !prev)}
              className={`px-3 py-2 rounded-xl border text-xs font-mono transition flex items-center gap-1.5 ${
                isCompanionOpen
                  ? isLight
                    ? 'bg-purple-50 border-purple-200 text-purple-700 font-semibold'
                    : 'bg-purple-600/15 border-purple-500/30 text-purple-400 font-semibold'
                  : isLight
                  ? 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  : 'bg-[#1a1a24] border-[#2c2c3a] text-slate-400 hover:text-white'
              }`}
              title="Toggle Principles & Tokens Reference Companion"
            >
              <PanelRight className="w-3.5 h-3.5" />
              <span className="text-[11px] hidden sm:inline">UI Principles Companion</span>
            </button>

            <button
              onClick={handleOpenNewComposer}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-xs transition flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log UI Decision</span>
            </button>
          </div>
        </div>

        {/* Global Toast */}
        {toastMessage && (
          <div
            className={`mt-3.5 px-3.5 py-2 rounded-xl border text-xs font-mono flex items-center gap-2 animate-fade-in ${
              isLight
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300'
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN WORKPLACE LAYOUT (DECISION STREAM + REFERENCE COMPANION)          */}
      {/* ========================================================================= */}
      <div className="flex flex-col lg:flex-row gap-4 items-start min-h-[700px]">
        {/* ----------------------------------------------------------------------- */}
        {/* PANE 1: DECISION STREAM & REGISTER (Fluid)                             */}
        {/* ----------------------------------------------------------------------- */}
        <div className="flex-1 w-full min-w-0 space-y-4">
          {/* Controls: Search & Status Filter Toolbar */}
          <div
            className={`p-2.5 sm:p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
              isLight ? 'bg-white border-slate-200/90 shadow-2xs' : 'bg-[#15151c] border-[#262632]'
            }`}
          >
            <div
              className={`flex items-center gap-2 flex-1 max-w-md px-2.5 py-1.5 rounded-lg border ${
                isLight ? 'bg-slate-50 border-slate-200/80' : 'bg-black/20 border-slate-800'
              }`}
            >
              <Search className={`w-3.5 h-3.5 shrink-0 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search UI decisions by title, token, or surface..."
                className={`w-full bg-transparent outline-none text-xs ${
                  isLight ? 'text-slate-900 placeholder-slate-400' : 'text-white placeholder-slate-500'
                }`}
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
              {['All', 'Draft', 'Under Review', 'Token Verified', 'Implemented'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition shrink-0 ${
                    statusFilter === status
                      ? 'bg-purple-600 text-white font-semibold shadow-xs'
                      : isLight
                      ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      : 'text-slate-400 hover:bg-[#20202a] hover:text-white'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Clean State: Zero Pre-Inputted Data */}
          {decisions.length === 0 ? (
            <div
              className={`p-10 rounded-2xl border text-center space-y-4 flex flex-col items-center justify-center min-h-[420px] ${
                isLight ? 'bg-white border-slate-200/90 shadow-xs' : 'bg-[#15151c] border-[#262632]'
              }`}
            >
              <div
                className={`w-16 h-16 rounded-2xl border flex items-center justify-center ${
                  isLight
                    ? 'bg-purple-50 border-purple-200/80 text-purple-600'
                    : 'bg-purple-500/10 border-purple-500/20 text-purple-400'
                }`}
              >
                <Palette className="w-8 h-8" />
              </div>

              <div className="space-y-1.5 max-w-md">
                <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Your UI Decision Register is Clean
                </h3>
                <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  No pre-inputted dummy cards or fake tokens. This workplace is dedicated to your actual design system decisions,
                  backed by spatial grids, typography standards, and the 8 UI Principles.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
                <button
                  onClick={handleOpenNewComposer}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-xs transition flex items-center gap-2"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log First UI Decision</span>
                </button>

                <button
                  onClick={() => {
                    setIsCompanionOpen(true);
                    setCompanionTab('principles');
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs font-mono transition flex items-center gap-2 border ${
                    isLight
                      ? 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700/40'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Browse 8 UI Principles</span>
                </button>
              </div>

              {/* Starter Decision Ideas for TCG SaaS */}
              <div
                className={`pt-6 border-t w-full max-w-lg text-left space-y-2 ${
                  isLight ? 'border-slate-200/80' : 'border-slate-700/20'
                }`}
              >
                <span
                  className={`text-[10px] font-mono uppercase font-bold block ${
                    isLight ? 'text-slate-500' : 'text-slate-500'
                  }`}
                >
                  Suggested Starter UI Architecture Decisions:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div
                    onClick={() => {
                      setComposerTitle('Tabular JetBrains Mono vs Proportional Sans for Inventory Pricing Grid');
                      setComposerProblem('Price numbers in high-density tables jitter horizontally as digits change, misaligning decimals across 30,000 SKUs.');
                      setComposerSurface('Desktop Singles Grid');
                      setComposerDecision('Enforce font-variant-numeric: tabular-nums with JetBrains Mono 13px across all price, spread, and SKU cells.');
                      setComposerAlternatives('Inter / Sans-serif: rejected because digit 1 is narrower than digit 8, causing vertical decimal wobble.');
                      setComposerTaggedTerms(['Tabular Figures', 'Visual Hierarchy', 'Type Scale']);
                      setIsComposerOpen(true);
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition space-y-1 ${
                      isLight
                        ? 'bg-slate-50 border-slate-200 hover:border-purple-300 text-slate-800'
                        : 'bg-black/20 border-slate-800 hover:border-purple-500/40 text-slate-300'
                    }`}
                  >
                    <span className="font-bold text-purple-600 dark:text-purple-400 block text-xs">Tabular Pricing Figures</span>
                    <span className="text-[11px] text-slate-500 block">Click to use as starter template</span>
                  </div>

                  <div
                    onClick={() => {
                      setComposerTitle('52px Minimum Touch Target Pills for POS iPad Grading');
                      setComposerProblem('Desktop-sized 32px buttons on touchscreens cause frequent miss-taps during fast Friday Night rush hours.');
                      setComposerSurface('POS Counter Kiosk');
                      setComposerDecision('Mandate minimum 52px button height with 12px padding for all primary touch interaction targets on iPad.');
                      setComposerAlternatives('Standard 36px buttons: rejected because standing clerks with large fingers miss-tap 14% of the time.');
                      setComposerTaggedTerms(['8pt Grid Rhythm', 'Component State Anatomy']);
                      setIsComposerOpen(true);
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition space-y-1 ${
                      isLight
                        ? 'bg-slate-50 border-slate-200 hover:border-purple-300 text-slate-800'
                        : 'bg-black/20 border-slate-800 hover:border-purple-500/40 text-slate-300'
                    }`}
                  >
                    <span className="font-bold text-purple-600 dark:text-purple-400 block text-xs">52px Touch Target Sizing</span>
                    <span className="text-[11px] text-slate-500 block">Click to use as starter template</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Render Decision Cards */
            <div className="space-y-3.5">
              {filteredDecisions.length === 0 ? (
                <div
                  className={`p-8 text-center text-xs border rounded-2xl ${
                    isLight ? 'bg-white border-slate-200 text-slate-500' : 'bg-[#15151c] border-[#262632] text-slate-400'
                  }`}
                >
                  No UI decisions match your search or filter.
                </div>
              ) : (
                filteredDecisions.map((decision) => {
                  const isSelected = activeDecision?.id === decision.id;
                  const verifiedCount = decision.verifiedPrincipleIds.length;

                  return (
                    <div
                      key={decision.id}
                      onClick={() => setSelectedDecisionId(decision.id)}
                      className={`p-5 sm:p-6 rounded-2xl border transition cursor-pointer space-y-4 ${
                        isSelected
                          ? isLight
                            ? 'bg-white border-purple-500 shadow-md ring-2 ring-purple-500/10'
                            : 'bg-[#171724] border-purple-500/80 shadow-md ring-1 ring-purple-500/30'
                          : isLight
                          ? 'bg-white border-slate-200/90 hover:border-slate-300 shadow-xs'
                          : 'bg-[#15151c] border-[#262632] hover:border-[#383848]'
                      }`}
                    >
                      {/* Card Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border flex items-center gap-1.5 ${
                              decision.status === 'Token Verified'
                                ? isLight
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                : decision.status === 'Implemented'
                                ? isLight
                                  ? 'bg-purple-50 text-purple-700 border-purple-200'
                                  : 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                                : decision.status === 'Under Review'
                                ? isLight
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                : isLight
                                ? 'bg-slate-100 text-slate-600 border-slate-200'
                                : 'bg-slate-700/30 text-slate-400 border-slate-700/50'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                decision.status === 'Token Verified'
                                  ? 'bg-emerald-500'
                                  : decision.status === 'Implemented'
                                  ? 'bg-purple-500'
                                  : decision.status === 'Under Review'
                                  ? 'bg-amber-500'
                                  : 'bg-slate-400'
                              }`}
                            />
                            <span>{decision.status}</span>
                          </span>

                          <h3
                            className={`text-base sm:text-lg font-bold ${
                              isLight ? 'text-slate-900' : 'text-white'
                            }`}
                          >
                            {decision.title}
                          </h3>
                        </div>

                        {/* Surface & Actions */}
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium border flex items-center gap-1.5 ${
                              isLight
                                ? 'bg-slate-50 text-slate-700 border-slate-200'
                                : 'bg-black/20 text-slate-300 border-slate-800'
                            }`}
                          >
                            <Monitor className="w-3 h-3 text-slate-400" />
                            <span>{decision.surfaceContext}</span>
                          </span>

                          <div className="flex items-center gap-1 pl-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyAdrMarkdown(decision);
                              }}
                              title="Copy as UI ADR Markdown"
                              className={`p-1.5 rounded-lg transition ${
                                isLight
                                  ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
                              }`}
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditDecision(decision);
                              }}
                              title="Edit UI Decision"
                              className={`p-1.5 rounded-lg transition ${
                                isLight
                                  ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
                              }`}
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteDecision(decision.id);
                              }}
                              title="Delete UI Decision"
                              className={`p-1.5 rounded-lg transition ${
                                isLight
                                  ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                                  : 'text-slate-400 hover:text-rose-400 hover:bg-rose-500/10'
                              }`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Visual Problem Statement */}
                      <div
                        className={`p-3.5 sm:p-4 rounded-xl border-l-4 border transition space-y-1.5 ${
                          isLight
                            ? 'bg-amber-50/70 border-l-amber-500 border-amber-200/70 text-slate-800'
                            : 'bg-amber-950/25 border-l-amber-500 border-amber-500/20 text-amber-200/90'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <AlertTriangle className={`w-3.5 h-3.5 ${isLight ? 'text-amber-700' : 'text-amber-400'}`} />
                          <span
                            className={`text-xs font-bold ${
                              isLight ? 'text-amber-900' : 'text-amber-400'
                            }`}
                          >
                            Visual Problem & Layout Challenge
                          </span>
                        </div>
                        <p
                          className={`text-xs sm:text-sm leading-relaxed ${
                            isLight ? 'text-slate-700' : 'text-amber-100/90'
                          }`}
                        >
                          {decision.problem}
                        </p>
                      </div>

                      {/* The Chosen UI Decision */}
                      <div
                        className={`p-3.5 sm:p-4 rounded-xl border-l-4 border transition space-y-1.5 ${
                          isLight
                            ? 'bg-slate-50/90 border-l-purple-600 border-slate-200 text-slate-800'
                            : 'bg-[#101016] border-l-purple-500 border-[#262638] text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <Lightbulb className={`w-3.5 h-3.5 ${isLight ? 'text-purple-600' : 'text-purple-400'}`} />
                          <span
                            className={`text-xs font-bold ${
                              isLight ? 'text-purple-950' : 'text-emerald-400'
                            }`}
                          >
                            UI Decision & Token Specification
                          </span>
                        </div>
                        <p
                          className={`text-xs sm:text-sm leading-relaxed ${
                            isLight ? 'text-slate-700' : 'text-slate-200'
                          }`}
                        >
                          {decision.decision}
                        </p>
                      </div>

                      {/* Alternatives Rejected */}
                      {decision.alternativesRejected && (
                        <div
                          className={`p-3 rounded-xl border-l-4 border transition space-y-1 ${
                            isLight
                              ? 'bg-rose-50/50 border-l-rose-400 border-rose-200/60 text-slate-700'
                              : 'bg-rose-950/20 border-l-rose-500 border-rose-500/20 text-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <XCircle className={`w-3.5 h-3.5 ${isLight ? 'text-rose-600' : 'text-rose-400'}`} />
                            <span
                              className={`text-xs font-bold ${
                                isLight ? 'text-rose-900' : 'text-rose-400'
                              }`}
                            >
                              Visual Alternatives Evaluated & Rejected
                            </span>
                          </div>
                          <p
                            className={`text-xs leading-relaxed ${
                              isLight ? 'text-slate-600' : 'text-slate-400'
                            }`}
                          >
                            {decision.alternativesRejected}
                          </p>
                        </div>
                      )}

                      {/* Footer: Tagged Terms & Principles Count */}
                      <div
                        className={`pt-3 border-t flex flex-wrap items-center justify-between gap-2.5 text-xs ${
                          isLight ? 'border-slate-200/70' : 'border-slate-800/80'
                        }`}
                      >
                        <div className="flex flex-wrap items-center gap-1.5">
                          {decision.taggedTerms.map((term, i) => (
                            <span
                              key={i}
                              className={`px-2.5 py-0.5 rounded-lg font-mono text-[11px] border font-medium ${
                                isLight
                                  ? 'bg-purple-50 text-purple-700 border-purple-200/70'
                                  : 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                              }`}
                            >
                              {term}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-2 font-mono text-xs">
                          <span
                            className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${
                              verifiedCount > 0
                                ? isLight
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 font-bold'
                                  : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20 font-bold'
                                : isLight
                                ? 'bg-slate-100 text-slate-500 border-slate-200'
                                : 'bg-black/20 text-slate-500 border-slate-800'
                            }`}
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>{verifiedCount} UI Principles Verified</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* PANE 2: UI PRINCIPLES & TOKENS COMPANION (Docked / Collapsible)          */}
        {/* ----------------------------------------------------------------------- */}
        {isCompanionOpen && (
          <aside
            className={`w-full lg:w-80 xl:w-96 shrink-0 rounded-2xl border p-4 sm:p-5 space-y-4 transition animate-slide-in ${
              isLight
                ? 'bg-white border-slate-200/90 shadow-xs'
                : 'bg-[#15151c] border-[#262632]'
            }`}
          >
            {/* Companion Header */}
            <div
              className={`flex items-center justify-between pb-3 border-b ${
                isLight ? 'border-slate-200' : 'border-slate-700/20'
              }`}
            >
              <div className="flex items-center gap-2">
                <Layout className={`w-4 h-4 ${isLight ? 'text-purple-600' : 'text-purple-400'}`} />
                <h3
                  className={`text-xs font-bold font-mono uppercase tracking-wider ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}
                >
                  Principles Companion
                </h3>
              </div>

              {/* Segmented Control Pill Switcher */}
              <div
                className={`flex items-center gap-1 p-1 rounded-xl text-xs font-mono border ${
                  isLight ? 'bg-slate-100 border-slate-200' : 'bg-black/30 border-slate-800'
                }`}
              >
                <button
                  onClick={() => setCompanionTab('principles')}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    companionTab === 'principles'
                      ? isLight
                        ? 'bg-white text-slate-900 font-bold shadow-xs'
                        : 'bg-purple-600 text-white font-bold'
                      : isLight
                      ? 'text-slate-600 hover:text-slate-900'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  8 UI Principles
                </button>
                <button
                  onClick={() => setCompanionTab('terms')}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    companionTab === 'terms'
                      ? isLight
                        ? 'bg-white text-slate-900 font-bold shadow-xs'
                        : 'bg-purple-600 text-white font-bold'
                      : isLight
                      ? 'text-slate-600 hover:text-slate-900'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Tokens Library
                </button>
              </div>
            </div>

            {/* TAB A: 8 UI PRINCIPLES VERIFICATION */}
            {companionTab === 'principles' && (
              <div className="space-y-4">
                {activeDecision ? (
                  <div
                    className={`p-3.5 rounded-xl border space-y-2 text-xs font-mono ${
                      isLight
                        ? 'bg-purple-50/60 border-purple-200/80 text-slate-800'
                        : 'bg-black/25 border-purple-500/20 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] uppercase font-bold ${
                          isLight ? 'text-purple-700' : 'text-purple-400'
                        }`}
                      >
                        Verifying Active Decision
                      </span>
                      <span
                        className={`text-[10px] font-bold ${
                          isLight ? 'text-emerald-700' : 'text-emerald-400'
                        }`}
                      >
                        {activeDecision.verifiedPrincipleIds.length} / 8 Verified
                      </span>
                    </div>

                    <h4
                      className={`font-bold text-xs truncate ${
                        isLight ? 'text-slate-900' : 'text-white'
                      }`}
                    >
                      {activeDecision.title}
                    </h4>

                    {/* Progress Bar */}
                    <div
                      className={`w-full h-1.5 rounded-full overflow-hidden ${
                        isLight ? 'bg-slate-200' : 'bg-slate-800'
                      }`}
                    >
                      <div
                        className="h-full bg-emerald-500 transition-all rounded-full"
                        style={{
                          width: `${Math.min(100, Math.round((activeDecision.verifiedPrincipleIds.length / 8) * 100))}%`
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div
                    className={`p-3.5 rounded-xl text-xs font-mono border ${
                      isLight
                        ? 'bg-slate-50 border-slate-200 text-slate-500'
                        : 'bg-black/20 border-slate-800 text-slate-400'
                    }`}
                  >
                    Select a decision on the left to verify which UI principles apply.
                  </div>
                )}

                {/* The 8 UI Principles Checklist */}
                <div className="space-y-2">
                  <div
                    className={`flex items-center justify-between text-[10px] font-mono uppercase font-bold px-1 ${
                      isLight ? 'text-slate-500' : 'text-slate-400'
                    }`}
                  >
                    <span>The 8 Foundational Principles</span>
                    <span>Click to verify</span>
                  </div>

                  <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                    {UI_PRINCIPLES.map((principle) => {
                      const isVerified = activeDecision?.verifiedPrincipleIds.includes(principle.id) || false;
                      return (
                        <div
                          key={principle.id}
                          onClick={() => activeDecision && handleTogglePrincipleVerification(principle.id)}
                          className={`p-3 rounded-xl border text-xs space-y-1.5 transition cursor-pointer ${
                            isVerified
                              ? isLight
                                ? 'border-emerald-300 bg-emerald-50/70 shadow-2xs'
                                : 'border-emerald-500/40 bg-emerald-500/10'
                              : isLight
                              ? 'border-slate-200/90 bg-white hover:border-purple-300 hover:bg-slate-50/70 shadow-2xs'
                              : 'border-[#282836] bg-[#181822] hover:border-[#38384a]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className={`font-bold text-xs ${
                                isLight ? 'text-slate-900' : 'text-white'
                              }`}
                            >
                              {principle.principleNumber}. {principle.name}
                            </span>
                            <span
                              className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold transition ${
                                isVerified
                                  ? 'bg-emerald-600 text-white shadow-2xs'
                                  : isLight
                                  ? 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                                  : 'bg-slate-700/30 text-slate-400 hover:text-white'
                              }`}
                            >
                              {isVerified ? '✓ Verified' : '+ Verify'}
                            </span>
                          </div>

                          <p
                            className={`text-[11px] leading-snug ${
                              isLight ? 'text-slate-600' : 'text-slate-400'
                            }`}
                          >
                            {principle.shortRule}
                          </p>

                          <div
                            className={`text-[10px] p-2 rounded-lg font-mono leading-tight ${
                              isLight
                                ? 'bg-purple-50/70 text-purple-900 border border-purple-100'
                                : 'bg-black/25 text-purple-300/90 border border-slate-800'
                            }`}
                          >
                            <span className="font-bold">Standard:</span> {principle.formulaOrStandard}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB B: DESIGN TOKENS LIBRARY */}
            {companionTab === 'terms' && (
              <div className="space-y-3">
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/25 border-slate-800'
                  }`}
                >
                  <Search className={`w-3.5 h-3.5 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
                  <input
                    type="text"
                    value={termSearchQuery}
                    onChange={(e) => setTermSearchQuery(e.target.value)}
                    placeholder="Search UI terms & tokens..."
                    className={`w-full bg-transparent outline-none text-xs ${
                      isLight ? 'text-slate-900 placeholder-slate-400' : 'text-white placeholder-slate-500'
                    }`}
                  />
                </div>

                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                  {CORE_UI_TERMS.filter(
                    (t) =>
                      termSearchQuery === '' ||
                      t.term.toLowerCase().includes(termSearchQuery.toLowerCase()) ||
                      t.definition.toLowerCase().includes(termSearchQuery.toLowerCase())
                  ).map((termItem) => (
                    <div
                      key={termItem.term}
                      className={`p-3.5 rounded-xl border space-y-1.5 text-xs transition ${
                        isLight
                          ? 'bg-white border-slate-200/90 shadow-2xs hover:border-purple-300'
                          : 'bg-[#181822] border-[#282836]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`font-bold text-xs ${
                            isLight ? 'text-purple-700' : 'text-purple-400'
                          }`}
                        >
                          {termItem.term}
                        </span>
                        <span
                          className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded font-semibold ${
                            isLight ? 'bg-slate-100 text-slate-600' : 'bg-slate-700/30 text-slate-400'
                          }`}
                        >
                          {termItem.category}
                        </span>
                      </div>
                      <p
                        className={`text-[11px] leading-relaxed ${
                          isLight ? 'text-slate-600' : 'text-slate-300'
                        }`}
                      >
                        {termItem.definition}
                      </p>
                      <div
                        className={`p-2 rounded-lg text-[10px] border leading-tight ${
                          isLight
                            ? 'bg-slate-50 text-slate-700 border-slate-200'
                            : 'bg-black/20 text-slate-400 border-slate-800'
                        }`}
                      >
                        <span className="font-bold">Retail Rule:</span> {termItem.retailSaaSExample}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. LOG / EDIT UI DECISION COMPOSER MODAL                                  */}
      {/* ========================================================================= */}
      {isComposerOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div
            className={`rounded-2xl border w-full max-w-2xl p-6 space-y-4 shadow-2xl animate-slide-in max-h-[90vh] overflow-y-auto ${
              isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#181822] border-[#2e2e3e] text-white'
            }`}
          >
            <div
              className={`flex items-center justify-between pb-3 border-b ${
                isLight ? 'border-slate-200' : 'border-slate-700/20'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`p-2 rounded-xl ${
                    isLight ? 'bg-purple-50 text-purple-600' : 'bg-purple-500/10 text-purple-400'
                  }`}
                >
                  <Palette className="w-5 h-5" />
                </span>
                <div>
                  <h3
                    className={`text-base font-bold ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}
                  >
                    {editingDecisionId ? 'Edit UI System Decision' : 'Log New UI System Decision'}
                  </h3>
                  <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Document the visual challenge, token specification, and rejected alternatives
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsComposerOpen(false)}
                className={`p-1.5 rounded-lg transition ${
                  isLight ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100' : 'text-slate-400 hover:text-white'
                }`}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveComposer} className="space-y-4 text-xs">
              {/* Title */}
              <div>
                <label
                  className={`block text-[11px] font-mono uppercase mb-1 font-bold ${
                    isLight ? 'text-slate-700' : 'text-slate-400'
                  }`}
                >
                  UI Decision Title (Action-Oriented)
                </label>
                <input
                  type="text"
                  required
                  value={composerTitle}
                  onChange={(e) => setComposerTitle(e.target.value)}
                  placeholder="e.g. Tabular JetBrains Mono vs Proportional Sans for Inventory Pricing Grid"
                  className={`w-full px-3 py-2.5 rounded-xl border outline-none font-sans text-xs transition ${
                    isLight
                      ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-purple-500'
                      : 'bg-[#22222c] border-[#343444] text-white focus:border-purple-500'
                  }`}
                />
              </div>

              {/* Surface & Status Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    className={`block text-[11px] font-mono uppercase mb-1 font-bold ${
                      isLight ? 'text-slate-700' : 'text-slate-400'
                    }`}
                  >
                    Target Interface Surface
                  </label>
                  <select
                    value={composerSurface}
                    onChange={(e) => setComposerSurface(e.target.value)}
                    className={`w-full px-2.5 py-2.5 rounded-xl border outline-none font-sans text-xs ${
                      isLight
                        ? 'bg-slate-50 border-slate-200 text-slate-900'
                        : 'bg-[#22222c] border-[#343444] text-white'
                    }`}
                  >
                    <option value="Desktop Singles Grid">Desktop Singles Grid (Dense tables)</option>
                    <option value="POS Counter Kiosk">POS Counter Kiosk (Touchpads & iPad)</option>
                    <option value="Collector Storefront">Collector Storefront (High-res & 3D tilt)</option>
                    <option value="Global Design System">Global Design System (Palette & typography)</option>
                  </select>
                </div>

                <div>
                  <label
                    className={`block text-[11px] font-mono uppercase mb-1 font-bold ${
                      isLight ? 'text-slate-700' : 'text-slate-400'
                    }`}
                  >
                    Lifecycle Status
                  </label>
                  <select
                    value={composerStatus}
                    onChange={(e) => setComposerStatus(e.target.value as UiDecisionStatus)}
                    className={`w-full px-2.5 py-2.5 rounded-xl border outline-none font-sans text-xs ${
                      isLight
                        ? 'bg-slate-50 border-slate-200 text-slate-900'
                        : 'bg-[#22222c] border-[#343444] text-white'
                    }`}
                  >
                    <option value="Draft">Draft (Exploring tokens)</option>
                    <option value="Under Review">Under Review (Design critique)</option>
                    <option value="Token Verified">Token Verified (Passes 8 UI Principles)</option>
                    <option value="Implemented">Implemented (Shipped in code)</option>
                  </select>
                </div>
              </div>

              {/* Problem */}
              <div>
                <label
                  className={`block text-[11px] font-mono uppercase mb-1 font-bold ${
                    isLight ? 'text-amber-800' : 'text-amber-400'
                  }`}
                >
                  Visual Problem & Layout Challenge (What visual friction exists?)
                </label>
                <textarea
                  rows={2}
                  required
                  value={composerProblem}
                  onChange={(e) => setComposerProblem(e.target.value)}
                  placeholder="e.g. Price numbers in table columns jitter horizontally, misaligning decimals across 30,000 SKUs."
                  className={`w-full px-3 py-2.5 rounded-xl border outline-none resize-none text-xs transition ${
                    isLight
                      ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-purple-500'
                      : 'bg-[#22222c] border-[#343444] text-white focus:border-purple-500'
                  }`}
                />
              </div>

              {/* The Chosen Decision */}
              <div>
                <label
                  className={`block text-[11px] font-mono uppercase mb-1 font-bold ${
                    isLight ? 'text-purple-900' : 'text-emerald-400'
                  }`}
                >
                  UI Decision & Token Specification (What was decided and which tokens are used?)
                </label>
                <textarea
                  rows={2}
                  required
                  value={composerDecision}
                  onChange={(e) => setComposerDecision(e.target.value)}
                  placeholder="e.g. Enforce font-variant-numeric: tabular-nums with JetBrains Mono 13px across all price and spread cells."
                  className={`w-full px-3 py-2.5 rounded-xl border outline-none resize-none text-xs transition ${
                    isLight
                      ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-purple-500'
                      : 'bg-[#22222c] border-[#343444] text-white focus:border-purple-500'
                  }`}
                />
              </div>

              {/* Alternatives Rejected */}
              <div>
                <label
                  className={`block text-[11px] font-mono uppercase mb-1 font-bold ${
                    isLight ? 'text-slate-700' : 'text-slate-400'
                  }`}
                >
                  Visual Alternatives Evaluated & Rejected (Why did we reject other visual options?)
                </label>
                <textarea
                  rows={2}
                  value={composerAlternatives}
                  onChange={(e) => setComposerAlternatives(e.target.value)}
                  placeholder="e.g. Inter proportional font: rejected because digit 1 is narrower than digit 8, misaligning decimal points vertically."
                  className={`w-full px-3 py-2.5 rounded-xl border outline-none resize-none text-xs transition ${
                    isLight
                      ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-purple-500'
                      : 'bg-[#22222c] border-[#343444] text-white focus:border-purple-500'
                  }`}
                />
              </div>

              {/* Tag Core UI Terms */}
              <div className="space-y-1.5">
                <label
                  className={`block text-[11px] font-mono uppercase font-bold ${
                    isLight ? 'text-purple-700' : 'text-purple-400'
                  }`}
                >
                  Tag Core UI Terms & Tokens (Click to toggle)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {CORE_UI_TERMS.map((t) => {
                    const isTagged = composerTaggedTerms.includes(t.term);
                    return (
                      <button
                        type="button"
                        key={t.term}
                        onClick={() => handleToggleComposerTerm(t.term)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono transition border ${
                          isTagged
                            ? 'bg-purple-600 text-white font-bold border-purple-600 shadow-xs'
                            : isLight
                            ? 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                            : 'bg-black/25 text-slate-400 hover:text-white border-slate-700/30'
                        }`}
                      >
                        {isTagged ? `✓ ${t.term}` : t.term}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Buttons */}
              <div
                className={`flex justify-end gap-2 pt-3 border-t ${
                  isLight ? 'border-slate-200' : 'border-slate-700/20'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setIsComposerOpen(false)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                    isLight ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white transition shadow-xs"
                >
                  {editingDecisionId ? 'Update UI Decision' : 'Save to Register'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
