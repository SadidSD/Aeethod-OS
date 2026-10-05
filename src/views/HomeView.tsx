import React from 'react';
import {
  TrendingUp,
  Target,
  Swords,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Code2,
  ArrowRight,
  Calculator,
  Store,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useDb, useStore } from '../store';
import { fmtMoney } from '../lib/metrics';
import { priorityDef, statusDef, initials, colorForName } from '../lib/constants';
import { relativeDue } from '../lib/dates';
import { navigate } from '../lib/router';

export const HomeView: React.FC = () => {
  const db = useDb();
  const { setOpenTask, setQuickAddOpen } = useStore();

  const activeSprint = db.sprints.find((s) => s.status === 'active') || db.sprints[0];
  const devTasksInSprint = activeSprint
    ? db.tasks.filter((t) => t.topicId === 'dev' && t.sprintId === activeSprint.id)
    : [];

  const completedDevTasks = devTasksInSprint.filter((t) => t.status === 'done');
  const sprintPointsTotal = devTasksInSprint.reduce((acc, t) => acc + (t.points || 0), 0);
  const sprintPointsDone = completedDevTasks.reduce((acc, t) => acc + (t.points || 0), 0);

  // Urgent and high priority tasks across all topics
  const urgentTasks = db.tasks
    .filter((t) => (t.priority === 'urgent' || t.priority === 'high') && t.status !== 'done')
    .slice(0, 6);

  // Tasks due soon
  const dueSoonTasks = db.tasks
    .filter((t) => t.dueDate && t.status !== 'done')
    .sort((a, b) => (a.dueDate! > b.dueDate! ? 1 : -1))
    .slice(0, 5);

  // Profiles from economics
  const profileTasks = db.tasks.filter(
    (t) => t.topicId === 'economics' && t.tags?.includes('customer-profile')
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-slide-in">
      {/* Welcome Banner */}
      <div className="card p-6 border-indigo-500/30 bg-[#202020] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 uppercase tracking-wider font-mono">
              Aeethod Founder Command OS
            </span>
            <span className="text-xs text-slate-400">• Local Disk Persistence Active</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Company Dashboard & Strategic Execution
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Unifying all 22 business disciplines with engineering sprints, TCG competitor
            intelligence, and microeconomic pricing models—with zero SaaS paywalls or arbitrary
            field limits.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/metrics')}
            className="btn-secondary text-xs px-3.5 py-2"
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>SaaS Modeler</span>
          </button>
          <button
            onClick={() => setQuickAddOpen(true)}
            className="btn-primary text-xs px-4 py-2"
          >
            <span>+ Quick Add Task</span>
          </button>
        </div>
      </div>

      {/* Top Level Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Year 1 Target */}
        <div className="card p-4 space-y-1 hover:border-indigo-500/40 transition">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Year 1 Target ARR</span>
            <Target className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">$234,000</div>
          <p className="text-[11px] text-slate-400">
            Based on ~100 stores at <strong>$195/mo blended ARPU</strong>.
          </p>
        </div>

        {/* SAM Opportunity */}
        <div className="card p-4 space-y-1 hover:border-indigo-500/40 transition">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Core SAM Universe</span>
            <Store className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white">18,000</div>
          <p className="text-[11px] text-slate-400">
            9,900 LGS + 8,100 High-Volume Dealers in US/CA/EU/ANZ.
          </p>
        </div>

        {/* Active Sprint Progress */}
        <div className="card p-4 space-y-1 hover:border-cyan-500/40 transition">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Active Sprint ({activeSprint?.name || 'Sprint 1'})</span>
            <Code2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {sprintPointsDone} / {sprintPointsTotal}{' '}
            <span className="text-xs font-normal text-slate-400">pts done</span>
          </div>
          <div className="w-full bg-[#2e2e2e] rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-cyan-500 h-1.5 rounded-full transition-all"
              style={{
                width: `${
                  sprintPointsTotal > 0 ? (sprintPointsDone / sprintPointsTotal) * 100 : 0
                }%`,
              }}
            />
          </div>
        </div>

        {/* Competitor Churn Opportunity */}
        <div className="card p-4 space-y-1 hover:border-rose-500/40 transition">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Incumbent Vulnerability</span>
            <Swords className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-rose-400">BinderPOS</div>
          <p className="text-[11px] text-slate-400">
            Signups <strong>paused since Feb 2025</strong>. 2.5% tax ripe for disruption.
          </p>
        </div>
      </div>

      {/* Main Grid: Urgent Priorities + Sprint Workflow + 5 Customer Profiles */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: High Priority Tasks & Sprint Focus */}
        <div className="lg:col-span-2 space-y-6">
          {/* Urgent / High Priority Work */}
          <div className="card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#2e2e2e] pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">
                  High Priority Strategic & Engineering Focus
                </h3>
              </div>
              <span className="text-xs text-slate-400">{urgentTasks.length} open items</span>
            </div>

            <div className="divide-y divide-[#2e2e2e]">
              {urgentTasks.map((t) => {
                const topic = db.topics.find((x) => x.id === t.topicId);
                const p = priorityDef(t.priority);
                const s = statusDef(t.topicId, t.status);

                return (
                  <div
                    key={t.id}
                    onClick={() => setOpenTask(t.id)}
                    className="py-3 flex items-center justify-between hover:bg-[#282828] px-2 rounded-lg cursor-pointer transition group"
                  >
                    <div className="space-y-1 min-w-0 pr-4">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: p.color }}
                        />
                        <span className="text-sm font-semibold text-white group-hover:text-indigo-300 truncate">
                          {t.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span
                          className="px-1.5 py-0.2 rounded font-medium text-[10px]"
                          style={{
                            backgroundColor: `${topic?.color || '#6366f1'}20`,
                            color: topic?.color || '#818cf8',
                          }}
                        >
                          {topic?.name}
                        </span>
                        {t.dueDate && (
                          <span className="flex items-center gap-1 text-slate-400">
                            <Calendar className="w-3 h-3 text-slate-500" />
                            {t.dueDate}
                          </span>
                        )}
                        {t.points && (
                          <span className="font-mono text-cyan-400 font-bold">{t.points} pts</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className="px-2 py-0.5 rounded text-xs capitalize font-medium"
                        style={{ backgroundColor: `${s.color}20`, color: s.color }}
                      >
                        {s.label}
                      </span>
                      {t.assignee && (
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-xs"
                          style={{ backgroundColor: colorForName(t.assignee) }}
                          title={t.assignee}
                        >
                          {initials(t.assignee)}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Customer Profiles Snapshot from Economics */}
          <div className="card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#2e2e2e] pb-3">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">
                  5 Commercial Target Profiles (WTP & Economics)
                </h3>
              </div>
              <button
                onClick={() => navigate('/topic/economics')}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
              >
                <span>View Full Economics</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {profileTasks.map((p) => {
                const price = p.fields?.['economics--price'];
                const wtp = p.fields?.['economics--wtp'];
                const surplus = p.fields?.['economics--surplus'];
                const sam = p.fields?.['economics--sam'];
                const elasticity = p.fields?.['economics--elasticity'];

                return (
                  <div
                    key={p.id}
                    onClick={() => setOpenTask(p.id)}
                    className="p-3.5 rounded-xl bg-[#252525] border border-[#2e2e2e] hover:border-indigo-500/40 cursor-pointer transition space-y-2 group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="text-xs font-bold text-white group-hover:text-indigo-300 leading-snug">
                        {p.title}
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                        ${Number(price || 0)}/mo
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-1 pt-1 border-t border-[#2e2e2e] text-[10px] text-slate-400 font-mono">
                      <div>
                        <span className="text-slate-500 block">SAM</span>
                        <span className="text-white font-semibold">{Number(sam || 0).toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">WTP</span>
                        <span className="text-white font-semibold">${Number(wtp || 0)}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Surplus</span>
                        <span className="text-emerald-400 font-semibold">+${Number(surplus || 0)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Deadlines, Active Sprints & Quick Tools */}
        <div className="space-y-6">
          {/* Active Sprint Summary */}
          <div className="card p-5 space-y-3 border-cyan-500/30">
            <div className="flex items-center justify-between border-b border-[#2e2e2e] pb-2">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5" />
                Current Sprint
              </span>
              <button
                onClick={() => navigate('/dev/board')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
              >
                Board &rarr;
              </button>
            </div>

            <div>
              <div className="text-base font-bold text-white">{activeSprint?.name}</div>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {activeSprint?.goal}
              </p>
            </div>

            <div className="pt-2 text-xs text-slate-300 space-y-1.5 border-t border-[#2e2e2e]">
              <div className="flex justify-between text-slate-400">
                <span>Timeline:</span>
                <span className="text-white font-mono">
                  {activeSprint?.startDate} &rarr; {activeSprint?.endDate}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Tasks in Sprint:</span>
                <span className="text-white font-mono">{devTasksInSprint.length}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Completed Tasks:</span>
                <span className="text-emerald-400 font-mono font-bold">
                  {completedDevTasks.length}
                </span>
              </div>
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="card p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-[#2e2e2e] pb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                Upcoming Milestones
              </span>
            </div>

            <div className="space-y-2">
              {dueSoonTasks.map((t) => {
                const rel = relativeDue(t.dueDate);
                return (
                  <div
                    key={t.id}
                    onClick={() => setOpenTask(t.id)}
                    className="p-2.5 rounded-lg bg-[#252525] border border-[#2e2e2e] hover:border-[#3e3e3e] cursor-pointer transition flex items-center justify-between"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="text-xs font-medium text-white truncate">{t.title}</div>
                      <div className="text-[10px] text-slate-500">
                        {db.topics.find((x) => x.id === t.topicId)?.name}
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold shrink-0 ${
                        rel.tone === 'overdue'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      }`}
                    >
                      {rel.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="card p-4 space-y-2">
            <div className="text-xs font-bold text-[#787774] uppercase tracking-wider">
              Keyboard Shortcuts
            </div>
            <div className="space-y-1 text-xs text-[#9b9b9b]">
              <div className="flex justify-between">
                <span>Search everything</span>
                <kbd className="font-mono bg-[#282828] px-1.5 py-0.5 rounded border border-[#3e3e3e] text-[#9b9b9b] text-[10px]">
                  Ctrl+K
                </kbd>
              </div>
              <div className="flex justify-between">
                <span>Quick Add Task</span>
                <kbd className="font-mono bg-[#282828] px-1.5 py-0.5 rounded border border-[#3e3e3e] text-[#9b9b9b] text-[10px]">
                  C
                </kbd>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
