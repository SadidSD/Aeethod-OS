import React, { useState, useMemo, useEffect } from 'react';
import {
  Compass,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  BookOpen,
  Scale,
  BrainCircuit,
  Sliders,
  ChevronRight,
  ChevronLeft,
  Copy,
  Check,
  FileText,
  Trash2,
  Edit3,
  ExternalLink,
  Layers,
  Sparkles,
  ShieldCheck,
  HelpCircle,
  Eye,
  PanelRight,
  User,
  Lightbulb,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { useStore } from '../store';
import {
  UxDecisionRecord,
  UxDecisionStatus,
  CoreUxTerm,
  CORE_UX_TERMS,
  UX_PSYCHOLOGY_LAWS,
  NIELSEN_HEURISTICS,
  INITIAL_UX_DECISION_RECORDS
} from '../data/uxDecisionData';

const LOCAL_STORAGE_KEY = 'aeethod_ux_decisions_v1';

export const UxResearchWorkplaceView: React.FC = () => {
  const { theme } = useStore();
  const isLight = theme === 'light';

  // Decisions State (Clean, persisted via localStorage, defaults to empty array)
  const [decisions, setDecisions] = useState<UxDecisionRecord[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return INITIAL_UX_DECISION_RECORDS;
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
  const [companionTab, setCompanionTab] = useState<'laws' | 'terms'>('laws');
  const [termSearchQuery, setTermSearchQuery] = useState('');

  // Composer Modal State
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [editingDecisionId, setEditingDecisionId] = useState<string | null>(null);
  const [composerTitle, setComposerTitle] = useState('');
  const [composerProblem, setComposerProblem] = useState('');
  const [composerPersona, setComposerPersona] = useState('Counter Clerk Jake');
  const [composerDecision, setComposerDecision] = useState('');
  const [composerAlternatives, setComposerAlternatives] = useState('');
  const [composerStatus, setComposerStatus] = useState<UxDecisionStatus>('Draft');
  const [composerTaggedTerms, setComposerTaggedTerms] = useState<CoreUxTerm[]>([]);
  const [composerVerifiedLaws, setComposerVerifiedLaws] = useState<string[]>([]);
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
    setComposerPersona('Counter Clerk Jake');
    setComposerDecision('');
    setComposerAlternatives('');
    setComposerStatus('Draft');
    setComposerTaggedTerms(['Cognitive Load']);
    setComposerVerifiedLaws([]);
    setComposerNotes('');
    setIsComposerOpen(true);
  };

  // Open Composer for existing item
  const handleEditDecision = (d: UxDecisionRecord) => {
    setEditingDecisionId(d.id);
    setComposerTitle(d.title);
    setComposerProblem(d.problem);
    setComposerPersona(d.contextPersona);
    setComposerDecision(d.decision);
    setComposerAlternatives(d.alternativesRejected);
    setComposerStatus(d.status);
    setComposerTaggedTerms(d.taggedTerms);
    setComposerVerifiedLaws(d.verifiedLawIds);
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
            contextPersona: composerPersona,
            decision: composerDecision.trim(),
            alternativesRejected: composerAlternatives.trim(),
            taggedTerms: composerTaggedTerms,
            verifiedLawIds: composerVerifiedLaws,
            status: composerStatus,
            notes: composerNotes.trim() || undefined,
            updatedAt: now
          };
        })
      );
      showToast('UX Decision updated successfully!');
    } else {
      // Create new
      const newRecord: UxDecisionRecord = {
        id: `ux-dec-${Date.now()}`,
        title: composerTitle.trim(),
        problem: composerProblem.trim(),
        contextPersona: composerPersona,
        decision: composerDecision.trim(),
        alternativesRejected: composerAlternatives.trim(),
        taggedTerms: composerTaggedTerms,
        verifiedLawIds: composerVerifiedLaws,
        status: composerStatus,
        notes: composerNotes.trim() || undefined,
        createdAt: now,
        updatedAt: now
      };
      setDecisions((prev) => [newRecord, ...prev]);
      setSelectedDecisionId(newRecord.id);
      showToast('New UX Decision logged in register!');
    }

    setIsComposerOpen(false);
  };

  // Delete decision
  const handleDeleteDecision = (id: string) => {
    if (window.confirm('Are you sure you want to delete this UX Decision?')) {
      setDecisions((prev) => prev.filter((d) => d.id !== id));
      if (selectedDecisionId === id) setSelectedDecisionId(null);
      showToast('UX Decision deleted.');
    }
  };

  // Toggle Term in Composer
  const handleToggleComposerTerm = (term: CoreUxTerm) => {
    setComposerTaggedTerms((prev) =>
      prev.includes(term) ? prev.filter((t) => t !== term) : [...prev, term]
    );
  };

  // Toggle Law Verification on Active Decision directly
  const handleToggleLawVerification = (lawId: string) => {
    if (!activeDecision) return;
    const isVerified = activeDecision.verifiedLawIds.includes(lawId);
    const updatedLaws = isVerified
      ? activeDecision.verifiedLawIds.filter((id) => id !== lawId)
      : [...activeDecision.verifiedLawIds, lawId];

    const updatedStatus: UxDecisionStatus =
      updatedLaws.length >= 3 && activeDecision.status === 'Draft' ? 'Law Verified' : activeDecision.status;

    setDecisions((prev) =>
      prev.map((d) => {
        if (d.id !== activeDecision.id) return d;
        return {
          ...d,
          verifiedLawIds: updatedLaws,
          status: updatedStatus,
          updatedAt: new Date().toISOString()
        };
      })
    );
  };

  // Copy Decision as ADR Markdown
  const handleCopyAdrMarkdown = (d: UxDecisionRecord) => {
    const verifiedLawsList = [...UX_PSYCHOLOGY_LAWS, ...NIELSEN_HEURISTICS]
      .filter((law) => d.verifiedLawIds.includes(law.id))
      .map((l) => `- **${l.name}**: ${l.summary}`)
      .join('\n');

    const markdown = `# UX Architecture Decision Record (ADR): ${d.title}
**Status:** ${d.status}  
**Date:** ${new Date(d.createdAt).toLocaleDateString()}  
**Target Persona:** ${d.contextPersona}  
**Core UX Concepts:** ${d.taggedTerms.join(', ')}

---

## 1. Context & User Problem
${d.problem}

## 2. UX Decision & Interaction Architecture
${d.decision}

## 3. Alternatives Evaluated & Rejected
${d.alternativesRejected || 'None documented.'}

## 4. Verification Against UX Principles & Scientific Laws
${verifiedLawsList || 'No formal laws checked yet.'}

${d.notes ? `\n## 5. Additional Research Notes\n${d.notes}\n` : ''}
---
*Generated by Aeethod OS — UX Research & Decision Workplace*
`;

    navigator.clipboard.writeText(markdown);
    showToast('ADR Markdown copied to clipboard!');
  };

  // Total verified count across decisions
  const totalVerifiedLaws = useMemo(() => {
    const unique = new Set<string>();
    decisions.forEach((d) => d.verifiedLawIds.forEach((id) => unique.add(id)));
    return unique.size;
  }, [decisions]);

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
                    ? 'bg-indigo-50 text-indigo-600 border-indigo-200/70'
                    : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                }`}
              >
                <BrainCircuit className="w-4 h-4" />
              </span>
              <span
                className={`text-[11px] font-mono font-bold uppercase tracking-wider ${
                  isLight ? 'text-indigo-600' : 'text-indigo-400'
                }`}
              >
                Aeethod OS • UX Research & Decisions
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                  isLight
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold'
                    : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                }`}
              >
                ADR-Grade Research System
              </span>
            </div>

            <h1
              className={`text-2xl sm:text-3xl font-black tracking-tight ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}
            >
              UX Research & Decision Workplace
            </h1>

            <p
              className={`text-xs sm:text-sm leading-relaxed ${
                isLight ? 'text-slate-600' : 'text-slate-400'
              }`}
            >
              Formulate behavioral decisions, tag foundational UX terms (Mental Models, Cognitive Load, Affordances),
              and scientifically verify design choices against <strong>Nielsen's 10 Heuristics</strong> and{' '}
              <strong>10 Fundamental UX Psychology Laws</strong>.
            </p>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div
              className={`px-3.5 py-2 rounded-xl border flex items-center gap-3 font-mono ${
                isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-[#1a1a24] border-[#2c2c3a] text-white'
              }`}
            >
              <Scale className={`w-4 h-4 ${isLight ? 'text-indigo-600' : 'text-indigo-400'}`} />
              <div>
                <span className={`text-[9px] uppercase block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Decisions Logged
                </span>
                <span className="text-xs font-bold">{decisions.length} Records</span>
              </div>
            </div>

            <button
              onClick={() => setIsCompanionOpen((prev) => !prev)}
              className={`px-3 py-2 rounded-xl border text-xs font-mono transition flex items-center gap-1.5 ${
                isCompanionOpen
                  ? isLight
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold'
                    : 'bg-indigo-600/15 border-indigo-500/30 text-indigo-400 font-semibold'
                  : isLight
                  ? 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  : 'bg-[#1a1a24] border-[#2c2c3a] text-slate-400 hover:text-white'
              }`}
              title="Toggle Laws & Terms Reference Companion"
            >
              <PanelRight className="w-3.5 h-3.5" />
              <span className="text-[11px] hidden sm:inline">Reference Companion</span>
            </button>

            <button
              onClick={handleOpenNewComposer}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-xs transition flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log UX Decision</span>
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
                placeholder="Search decisions by title, problem, or UX term..."
                className={`w-full bg-transparent outline-none text-xs ${
                  isLight ? 'text-slate-900 placeholder-slate-400' : 'text-white placeholder-slate-500'
                }`}
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
              {['All', 'Draft', 'Under Review', 'Law Verified', 'Shipped'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition shrink-0 ${
                    statusFilter === status
                      ? 'bg-indigo-600 text-white font-semibold shadow-xs'
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
                    ? 'bg-indigo-50 border-indigo-200/80 text-indigo-600'
                    : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
                }`}
              >
                <Compass className="w-8 h-8" />
              </div>

              <div className="space-y-1.5 max-w-md">
                <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Your UX Decision Register is Clean
                </h3>
                <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  No pre-inputted dummy cards or fake data. This workplace is dedicated to your actual product decisions,
                  backed by real user research and verified against scientific UX laws.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
                <button
                  onClick={handleOpenNewComposer}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs transition flex items-center gap-2"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Formulate First UX Decision</span>
                </button>

                <button
                  onClick={() => {
                    setIsCompanionOpen(true);
                    setCompanionTab('laws');
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs font-mono transition flex items-center gap-2 border ${
                    isLight
                      ? 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700/40'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Browse UX Psychology Laws</span>
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
                  Suggested First Research Decisions:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div
                    onClick={() => {
                      setComposerTitle('Inline Cell Price Editing vs Modal Inspection Drawer');
                      setComposerProblem('Clerks lose 4 seconds per card opening inspection modals when editing prices in bulk.');
                      setComposerPersona('Counter Clerk Jake');
                      setComposerDecision('Implement inline 28px cell editing with Enter-key commit to optimize keyboard velocity.');
                      setComposerAlternatives('Modal drawer on click: rejected because it introduces 2 extra clicks per card.');
                      setComposerTaggedTerms(['Cognitive Load', 'Good vs Bad Friction']);
                      setIsComposerOpen(true);
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition space-y-1 ${
                      isLight
                        ? 'bg-slate-50 border-slate-200 hover:border-indigo-300 text-slate-800'
                        : 'bg-black/20 border-slate-800 hover:border-indigo-500/40 text-slate-300'
                    }`}
                  >
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 block text-xs">Inline vs Modal Editing</span>
                    <span className="text-[11px] text-slate-500 block">Click to use as starter template</span>
                  </div>

                  <div
                    onClick={() => {
                      setComposerTitle('5-Tier Segmented Condition Grading Pills (NM/LP/MP/HP/DMG)');
                      setComposerProblem('10-point condition sliders take too long to decide under retail counter rush hours.');
                      setComposerPersona('Counter Clerk Jake');
                      setComposerDecision('Adopt 5 discrete 52px condition pills mapped to Numpad keys 1-5.');
                      setComposerAlternatives('10-point numeric slider: rejected as a direct violation of Hick\'s Law.');
                      setComposerTaggedTerms(['Mental Model', 'Affordance & Signifiers']);
                      setIsComposerOpen(true);
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition space-y-1 ${
                      isLight
                        ? 'bg-slate-50 border-slate-200 hover:border-indigo-300 text-slate-800'
                        : 'bg-black/20 border-slate-800 hover:border-indigo-500/40 text-slate-300'
                    }`}
                  >
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 block text-xs">5 Condition Pills</span>
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
                  No decisions match your search or filter.
                </div>
              ) : (
                filteredDecisions.map((decision) => {
                  const isSelected = activeDecision?.id === decision.id;
                  const verifiedLawsCount = decision.verifiedLawIds.length;

                  return (
                    <div
                      key={decision.id}
                      onClick={() => setSelectedDecisionId(decision.id)}
                      className={`p-5 sm:p-6 rounded-2xl border transition cursor-pointer space-y-4 ${
                        isSelected
                          ? isLight
                            ? 'bg-white border-indigo-500 shadow-md ring-2 ring-indigo-500/10'
                            : 'bg-[#171724] border-indigo-500/80 shadow-md ring-1 ring-indigo-500/30'
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
                              decision.status === 'Law Verified'
                                ? isLight
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                : decision.status === 'Shipped'
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
                                decision.status === 'Law Verified'
                                  ? 'bg-emerald-500'
                                  : decision.status === 'Shipped'
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

                        {/* Persona & Actions */}
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium border flex items-center gap-1.5 ${
                              isLight
                                ? 'bg-slate-50 text-slate-700 border-slate-200'
                                : 'bg-black/20 text-slate-300 border-slate-800'
                            }`}
                          >
                            <User className="w-3 h-3 text-slate-400" />
                            <span>{decision.contextPersona}</span>
                          </span>

                          <div className="flex items-center gap-1 pl-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyAdrMarkdown(decision);
                              }}
                              title="Copy as ADR Markdown"
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
                              title="Edit Decision"
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
                              title="Delete Decision"
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

                      {/* Problem Statement (Warm Amber Accent) */}
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
                            User Friction & Pain Point
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

                      {/* The Chosen Decision (Indigo/Slate Clean Card) */}
                      <div
                        className={`p-3.5 sm:p-4 rounded-xl border-l-4 border transition space-y-1.5 ${
                          isLight
                            ? 'bg-slate-50/90 border-l-indigo-600 border-slate-200 text-slate-800'
                            : 'bg-[#101016] border-l-indigo-500 border-[#262638] text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <Lightbulb className={`w-3.5 h-3.5 ${isLight ? 'text-indigo-600' : 'text-indigo-400'}`} />
                          <span
                            className={`text-xs font-bold ${
                              isLight ? 'text-indigo-950' : 'text-emerald-400'
                            }`}
                          >
                            UX Decision & Interaction Architecture
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

                      {/* Alternatives Rejected (Soft Rose Accent) */}
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
                              Alternatives Evaluated & Rejected
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

                      {/* Footer: Tagged Terms & Scientific Laws Count */}
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
                                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200/70'
                                  : 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                              }`}
                            >
                              {term}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-2 font-mono text-xs">
                          <span
                            className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${
                              verifiedLawsCount > 0
                                ? isLight
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 font-bold'
                                  : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20 font-bold'
                                : isLight
                                ? 'bg-slate-100 text-slate-500 border-slate-200'
                                : 'bg-black/20 text-slate-500 border-slate-800'
                            }`}
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>{verifiedLawsCount} Laws Verified</span>
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
        {/* PANE 2: UX LAWS & TERMS REFERENCE COMPANION (Docked / Collapsible)       */}
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
                <Scale className={`w-4 h-4 ${isLight ? 'text-indigo-600' : 'text-indigo-400'}`} />
                <h3
                  className={`text-xs font-bold font-mono uppercase tracking-wider ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}
                >
                  Verification Companion
                </h3>
              </div>

              {/* Segmented Control Pill Switcher */}
              <div
                className={`flex items-center gap-1 p-1 rounded-xl text-xs font-mono border ${
                  isLight ? 'bg-slate-100 border-slate-200' : 'bg-black/30 border-slate-800'
                }`}
              >
                <button
                  onClick={() => setCompanionTab('laws')}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    companionTab === 'laws'
                      ? isLight
                        ? 'bg-white text-slate-900 font-bold shadow-xs'
                        : 'bg-indigo-600 text-white font-bold'
                      : isLight
                      ? 'text-slate-600 hover:text-slate-900'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Laws & Heuristics
                </button>
                <button
                  onClick={() => setCompanionTab('terms')}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    companionTab === 'terms'
                      ? isLight
                        ? 'bg-white text-slate-900 font-bold shadow-xs'
                        : 'bg-indigo-600 text-white font-bold'
                      : isLight
                      ? 'text-slate-600 hover:text-slate-900'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Core Terms
                </button>
              </div>
            </div>

            {/* TAB A: LAWS & HEURISTICS VERIFICATION */}
            {companionTab === 'laws' && (
              <div className="space-y-4">
                {activeDecision ? (
                  <div
                    className={`p-3.5 rounded-xl border space-y-2 text-xs font-mono ${
                      isLight
                        ? 'bg-indigo-50/60 border-indigo-200/80 text-slate-800'
                        : 'bg-black/25 border-indigo-500/20 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] uppercase font-bold ${
                          isLight ? 'text-indigo-700' : 'text-indigo-400'
                        }`}
                      >
                        Verifying Active Decision
                      </span>
                      <span
                        className={`text-[10px] font-bold ${
                          isLight ? 'text-emerald-700' : 'text-emerald-400'
                        }`}
                      >
                        {activeDecision.verifiedLawIds.length} / 20 Verified
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
                          width: `${Math.min(100, Math.round((activeDecision.verifiedLawIds.length / 5) * 100))}%`
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
                    Select a decision on the left to verify which UX laws apply.
                  </div>
                )}

                {/* 10 UX Psychology Laws Checklist */}
                <div className="space-y-2">
                  <div
                    className={`flex items-center justify-between text-[10px] font-mono uppercase font-bold px-1 ${
                      isLight ? 'text-slate-500' : 'text-slate-400'
                    }`}
                  >
                    <span>10 Psychology Laws</span>
                    <span>Click to verify</span>
                  </div>

                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {UX_PSYCHOLOGY_LAWS.map((law) => {
                      const isVerified = activeDecision?.verifiedLawIds.includes(law.id) || false;
                      return (
                        <div
                          key={law.id}
                          onClick={() => activeDecision && handleToggleLawVerification(law.id)}
                          className={`p-3 rounded-xl border text-xs space-y-1.5 transition cursor-pointer ${
                            isVerified
                              ? isLight
                                ? 'border-emerald-300 bg-emerald-50/70 shadow-2xs'
                                : 'border-emerald-500/40 bg-emerald-500/10'
                              : isLight
                              ? 'border-slate-200/90 bg-white hover:border-indigo-300 hover:bg-slate-50/70 shadow-2xs'
                              : 'border-[#282836] bg-[#181822] hover:border-[#38384a]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className={`font-bold text-xs ${
                                isLight ? 'text-slate-900' : 'text-white'
                              }`}
                            >
                              {law.name}
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
                            {law.summary}
                          </p>

                          <div
                            className={`text-[10px] p-2 rounded-lg font-mono leading-tight ${
                              isLight
                                ? 'bg-indigo-50/70 text-indigo-900 border border-indigo-100'
                                : 'bg-black/25 text-indigo-300/90 border border-slate-800'
                            }`}
                          >
                            <span className="font-bold">Retail Rule:</span> {law.retailSaaSApplication}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Nielsen's 10 Heuristics */}
                <div
                  className={`pt-3 border-t space-y-2 ${
                    isLight ? 'border-slate-200' : 'border-slate-800'
                  }`}
                >
                  <div
                    className={`flex items-center justify-between text-[10px] font-mono uppercase font-bold px-1 ${
                      isLight ? 'text-slate-500' : 'text-slate-400'
                    }`}
                  >
                    <span>Nielsen's 10 Heuristics</span>
                    <span>1–10</span>
                  </div>

                  <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                    {NIELSEN_HEURISTICS.map((nh) => {
                      const isVerified = activeDecision?.verifiedLawIds.includes(nh.id) || false;
                      return (
                        <div
                          key={nh.id}
                          onClick={() => activeDecision && handleToggleLawVerification(nh.id)}
                          className={`p-2.5 rounded-xl border text-xs space-y-1 transition cursor-pointer ${
                            isVerified
                              ? isLight
                                ? 'border-emerald-300 bg-emerald-50/70 shadow-2xs'
                                : 'border-emerald-500/40 bg-emerald-500/10'
                              : isLight
                              ? 'border-slate-200/90 bg-white hover:border-indigo-300 hover:bg-slate-50/70'
                              : 'border-[#282836] bg-[#181822] hover:border-[#38384a]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className={`font-bold text-xs ${
                                isLight ? 'text-slate-900' : 'text-white'
                              }`}
                            >
                              {nh.heuristicNumber}. {nh.name}
                            </span>
                            <span
                              className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                                isVerified
                                  ? 'bg-emerald-600 text-white'
                                  : isLight
                                  ? 'bg-slate-100 text-slate-600'
                                  : 'bg-slate-700/30 text-slate-400'
                              }`}
                            >
                              {isVerified ? '✓' : '+'}
                            </span>
                          </div>
                          <p
                            className={`text-[11px] leading-snug ${
                              isLight ? 'text-slate-600' : 'text-slate-400'
                            }`}
                          >
                            {nh.summary}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB B: CORE UX TERMS TAXONOMY */}
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
                    placeholder="Search core UX terms..."
                    className={`w-full bg-transparent outline-none text-xs ${
                      isLight ? 'text-slate-900 placeholder-slate-400' : 'text-white placeholder-slate-500'
                    }`}
                  />
                </div>

                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                  {CORE_UX_TERMS.filter(
                    (t) =>
                      termSearchQuery === '' ||
                      t.term.toLowerCase().includes(termSearchQuery.toLowerCase()) ||
                      t.definition.toLowerCase().includes(termSearchQuery.toLowerCase())
                  ).map((termItem) => (
                    <div
                      key={termItem.term}
                      className={`p-3.5 rounded-xl border space-y-1.5 text-xs transition ${
                        isLight
                          ? 'bg-white border-slate-200/90 shadow-2xs hover:border-indigo-300'
                          : 'bg-[#181822] border-[#282836]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`font-bold text-xs ${
                            isLight ? 'text-indigo-700' : 'text-indigo-400'
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
                        <span className="font-bold">Retail Application:</span> {termItem.retailSaaSExample}
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
      {/* 3. LOG / EDIT UX DECISION COMPOSER MODAL                                  */}
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
                    isLight ? 'bg-indigo-50 text-indigo-600' : 'bg-indigo-500/10 text-indigo-400'
                  }`}
                >
                  <BrainCircuit className="w-5 h-5" />
                </span>
                <div>
                  <h3
                    className={`text-base font-bold ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}
                  >
                    {editingDecisionId ? 'Edit UX Architecture Decision' : 'Formulate New UX Decision'}
                  </h3>
                  <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Document the user friction, design decision, and alternatives rejected
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
                  Decision Title (Action-Oriented)
                </label>
                <input
                  type="text"
                  required
                  value={composerTitle}
                  onChange={(e) => setComposerTitle(e.target.value)}
                  placeholder="e.g. Inline Cell Price Editing vs Modal Inspection Drawer"
                  className={`w-full px-3 py-2.5 rounded-xl border outline-none font-sans text-xs transition ${
                    isLight
                      ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-indigo-500'
                      : 'bg-[#22222c] border-[#343444] text-white focus:border-indigo-500'
                  }`}
                />
              </div>

              {/* Persona & Status Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    className={`block text-[11px] font-mono uppercase mb-1 font-bold ${
                      isLight ? 'text-slate-700' : 'text-slate-400'
                    }`}
                  >
                    Target Persona
                  </label>
                  <select
                    value={composerPersona}
                    onChange={(e) => setComposerPersona(e.target.value)}
                    className={`w-full px-2.5 py-2.5 rounded-xl border outline-none font-sans text-xs ${
                      isLight
                        ? 'bg-slate-50 border-slate-200 text-slate-900'
                        : 'bg-[#22222c] border-[#343444] text-white'
                    }`}
                  >
                    <option value="Counter Clerk Jake">Counter Clerk Jake (POS & Buylist speed)</option>
                    <option value="Store Owner Sadid">Store Owner Sadid (Back-office & Sync margins)</option>
                    <option value="Content Host Anika">Content Host Anika (Meta insights & Unboxing)</option>
                    <option value="Grail Collector Sarah">Grail Collector Sarah (Vintage slabs & 3D tilt)</option>
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
                    onChange={(e) => setComposerStatus(e.target.value as UxDecisionStatus)}
                    className={`w-full px-2.5 py-2.5 rounded-xl border outline-none font-sans text-xs ${
                      isLight
                        ? 'bg-slate-50 border-slate-200 text-slate-900'
                        : 'bg-[#22222c] border-[#343444] text-white'
                    }`}
                  >
                    <option value="Draft">Draft (Hypothesis formulating)</option>
                    <option value="Under Review">Under Review (Team discussion)</option>
                    <option value="Law Verified">Law Verified (Backed by UX laws)</option>
                    <option value="Shipped">Shipped (Built in production)</option>
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
                  User Problem & Friction (What struggle are we solving?)
                </label>
                <textarea
                  rows={2}
                  required
                  value={composerProblem}
                  onChange={(e) => setComposerProblem(e.target.value)}
                  placeholder="e.g. Card clerks lose 4 seconds per card opening modals during 50-card trade rushes, causing line bottlenecks."
                  className={`w-full px-3 py-2.5 rounded-xl border outline-none resize-none text-xs transition ${
                    isLight
                      ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-indigo-500'
                      : 'bg-[#22222c] border-[#343444] text-white focus:border-indigo-500'
                  }`}
                />
              </div>

              {/* The Chosen Decision */}
              <div>
                <label
                  className={`block text-[11px] font-mono uppercase mb-1 font-bold ${
                    isLight ? 'text-indigo-900' : 'text-emerald-400'
                  }`}
                >
                  The UX Decision & Interaction Architecture (What did we choose and why?)
                </label>
                <textarea
                  rows={2}
                  required
                  value={composerDecision}
                  onChange={(e) => setComposerDecision(e.target.value)}
                  placeholder="e.g. Implement inline 28px cell editing with Enter-key commit and double-click activation to optimize keyboard velocity."
                  className={`w-full px-3 py-2.5 rounded-xl border outline-none resize-none text-xs transition ${
                    isLight
                      ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-indigo-500'
                      : 'bg-[#22222c] border-[#343444] text-white focus:border-indigo-500'
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
                  Alternatives Evaluated & Rejected (Why did we say NO to other options?)
                </label>
                <textarea
                  rows={2}
                  value={composerAlternatives}
                  onChange={(e) => setComposerAlternatives(e.target.value)}
                  placeholder="e.g. Modal drawer on click: rejected because it violates Fitts's Law and adds 2 unnecessary clicks per row."
                  className={`w-full px-3 py-2.5 rounded-xl border outline-none resize-none text-xs transition ${
                    isLight
                      ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-indigo-500'
                      : 'bg-[#22222c] border-[#343444] text-white focus:border-indigo-500'
                  }`}
                />
              </div>

              {/* Tag Core UX Terms */}
              <div className="space-y-1.5">
                <label
                  className={`block text-[11px] font-mono uppercase font-bold ${
                    isLight ? 'text-indigo-700' : 'text-indigo-400'
                  }`}
                >
                  Tag Core UX Concepts (Click to toggle)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {CORE_UX_TERMS.map((t) => {
                    const isTagged = composerTaggedTerms.includes(t.term);
                    return (
                      <button
                        type="button"
                        key={t.term}
                        onClick={() => handleToggleComposerTerm(t.term)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono transition border ${
                          isTagged
                            ? 'bg-indigo-600 text-white font-bold border-indigo-600 shadow-xs'
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
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-xs"
                >
                  {editingDecisionId ? 'Update Decision' : 'Save to Register'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
