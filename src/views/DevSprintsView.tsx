import React, { useState } from 'react';
import {
  Milestone,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  Play,
  CheckCheck,
  Edit2,
  Trash2,
  ChevronRight,
  Layers,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { useDb, useStore } from '../store';
import { Sprint } from '../types';
import { DEV_STATUSES, devTypeDef, colorForName, initials } from '../lib/constants';

export const DevSprintsView: React.FC = () => {
  const db = useDb();
  const { create, update, remove, setOpenTask } = useStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingSprint, setEditingSprint] = useState<Sprint | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState<Sprint['status']>('planned');

  const devTasks = db.tasks.filter((t) => t.topicId === 'dev' && !t.parentId);

  const openCreateModal = () => {
    setEditingSprint(null);
    const sprintNum = db.sprints.length + 1;
    setName(`Sprint ${sprintNum}`);
    setGoal('');
    const today = new Date().toISOString().slice(0, 10);
    const twoWeeks = new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10);
    setStartDate(today);
    setEndDate(twoWeeks);
    setStatus('planned');
    setModalOpen(true);
  };

  const openEditModal = (sprint: Sprint) => {
    setEditingSprint(sprint);
    setName(sprint.name);
    setGoal(sprint.goal);
    setStartDate(sprint.startDate);
    setEndDate(sprint.endDate);
    setStatus(sprint.status);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingSprint) {
      update('sprints', editingSprint.id, {
        name: name.trim(),
        goal: goal.trim(),
        startDate,
        endDate,
        status,
      });
    } else {
      create('sprints', {
        name: name.trim(),
        goal: goal.trim(),
        startDate,
        endDate,
        status,
      });
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string, sprintName: string) => {
    if (window.confirm(`Delete "${sprintName}"? Tasks will become unsprinted.`)) {
      remove('sprints', id);
    }
  };

  const toggleSprintStatus = (sprint: Sprint, nextStatus: Sprint['status']) => {
    update('sprints', sprint.id, { status: nextStatus });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-slide-in">
      {/* Header */}
      <div className="card p-6 border-amber-500/30 bg-gradient-to-r from-ink-900 via-amber-950/20 to-ink-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-wider font-mono">
              Scrum-Lite Cadence
            </span>
            <span className="text-xs text-slate-400">• 2-Week Iteration Delivery</span>
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">
            Sprint Planning & Velocity Tracking
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Manage bi-weekly sprint boundaries, goals, and committed story point velocity for the
            Aeethod engineering pipeline.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="btn-primary flex items-center gap-2 text-xs py-2 shadow-lg shadow-indigo-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>New Sprint</span>
        </button>
      </div>

      {/* Sprints List */}
      <div className="space-y-6">
        {db.sprints.length === 0 ? (
          <div className="card p-12 text-center space-y-3">
            <Milestone className="w-10 h-10 text-slate-600 mx-auto" />
            <div className="text-base font-semibold text-white">No sprints configured</div>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Create your first 2-week sprint to organize features, fixes, and spikes.
            </p>
            <button onClick={openCreateModal} className="btn-primary text-xs mx-auto">
              Create Sprint 1
            </button>
          </div>
        ) : (
          db.sprints.map((sprint) => {
            const sprintTasks = devTasks.filter((t) => t.sprintId === sprint.id);
            const totalPoints = sprintTasks.reduce((acc, t) => acc + (t.points || 0), 0);
            const doneTasks = sprintTasks.filter((t) => t.status === 'done');
            const donePoints = doneTasks.reduce((acc, t) => acc + (t.points || 0), 0);
            const progress = totalPoints > 0 ? Math.round((donePoints / totalPoints) * 100) : 0;

            const statusColors = {
              active: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
              planned: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
              completed: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
            }[sprint.status];

            return (
              <div
                key={sprint.id}
                className={`card p-6 border transition-all ${
                  sprint.status === 'active'
                    ? 'border-emerald-500/40 bg-ink-900/90 shadow-lg shadow-emerald-950/20 ring-1 ring-emerald-500/20'
                    : 'border-ink-800 bg-ink-900'
                }`}
              >
                {/* Sprint Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-ink-800">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded border ${statusColors}`}>
                        {sprint.status}
                      </span>
                      <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                        {sprint.name}
                      </h3>
                      <span className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        {sprint.startDate} → {sprint.endDate}
                      </span>
                    </div>

                    {sprint.goal && (
                      <p className="text-xs text-slate-300 italic pt-0.5">
                        <span className="text-amber-400 font-medium not-italic">Goal:</span> {sprint.goal}
                      </p>
                    )}
                  </div>

                  {/* Actions & Metrics */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-sm font-bold text-white font-mono">
                        {donePoints} / {totalPoints} pts
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {doneTasks.length} of {sprintTasks.length} tasks completed ({progress}%)
                      </div>
                    </div>

                    <div className="h-8 w-px bg-ink-800" />

                    <div className="flex items-center gap-1.5">
                      {sprint.status === 'planned' && (
                        <button
                          onClick={() => toggleSprintStatus(sprint, 'active')}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600 hover:text-white border border-emerald-500/30 transition flex items-center gap-1"
                          title="Start Sprint"
                        >
                          <Play className="w-3.5 h-3.5" />
                          <span>Start</span>
                        </button>
                      )}

                      {sprint.status === 'active' && (
                        <button
                          onClick={() => toggleSprintStatus(sprint, 'completed')}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-purple-600/20 text-purple-300 hover:bg-purple-600 hover:text-white border border-purple-500/30 transition flex items-center gap-1"
                          title="Complete Sprint"
                        >
                          <CheckCheck className="w-3.5 h-3.5" />
                          <span>Complete</span>
                        </button>
                      )}

                      <button
                        onClick={() => openEditModal(sprint)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-ink-800 transition"
                        title="Edit Sprint"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(sprint.id, sprint.name)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-ink-800 transition"
                        title="Delete Sprint"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="pt-4 pb-2">
                  <div className="w-full bg-ink-800 h-2 rounded-full overflow-hidden flex">
                    <div
                      className="bg-emerald-500 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Tasks in this Sprint */}
                <div className="pt-3">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Committed Tasks ({sprintTasks.length})
                  </div>

                  {sprintTasks.length === 0 ? (
                    <div className="text-xs text-slate-500 italic py-2">
                      No tasks assigned to this sprint yet. Assign tasks from the Sprint Kanban Board or Backlog.
                    </div>
                  ) : (
                    <div className="divide-y divide-ink-800/60">
                      {sprintTasks.map((t) => {
                        const epic = db.epics.find((e) => e.id === t.epicId);
                        const isDone = t.status === 'done';

                        return (
                          <div
                            key={t.id}
                            onClick={() => setOpenTask(t.id)}
                            className="py-2.5 flex items-center justify-between gap-3 group hover:bg-ink-800/40 px-2 rounded-lg cursor-pointer transition"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <span
                                className="text-[10px] uppercase font-mono font-bold px-1.5 py-0.5 rounded border shrink-0 text-slate-300"
                                style={{
                                  backgroundColor: `${devTypeDef(t.type)?.color || '#64748b'}20`,
                                  borderColor: `${devTypeDef(t.type)?.color || '#64748b'}40`,
                                  color: devTypeDef(t.type)?.color || '#64748b',
                                }}
                              >
                                {t.type || 'feature'}
                              </span>

                              <span
                                className={`text-xs font-medium truncate ${
                                  isDone ? 'line-through text-slate-500' : 'text-slate-200 group-hover:text-white'
                                }`}
                              >
                                {t.title}
                              </span>

                              {epic && (
                                <span
                                  className="text-[10px] px-1.5 py-0.5 rounded font-mono truncate hidden sm:inline-block"
                                  style={{
                                    backgroundColor: `${epic.color}20`,
                                    color: epic.color,
                                    border: `1px solid ${epic.color}40`,
                                  }}
                                >
                                  {epic.name}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                              {t.points !== null && t.points !== undefined && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-ink-800 text-slate-300 font-mono font-semibold">
                                  {t.points} pts
                                </span>
                              )}

                              <select
                                value={t.status}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => update('tasks', t.id, { status: e.target.value })}
                                className="text-[11px] bg-ink-800 text-slate-300 rounded px-2 py-0.5 border border-ink-700 outline-none"
                              >
                                {DEV_STATUSES.map((st) => (
                                  <option key={st.id} value={st.id}>
                                    {st.label}
                                  </option>
                                ))}
                              </select>

                              {t.assignee && (
                                <div
                                  className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
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
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create / Edit Sprint Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="card w-full max-w-lg p-6 space-y-4 shadow-2xl border-indigo-500/30">
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Milestone className="w-4 h-4 text-amber-400" />
              <span>{editingSprint ? 'Edit Sprint' : 'Create New Sprint'}</span>
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Sprint Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Sprint 3"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Sprint Goal
                </label>
                <textarea
                  rows={2}
                  placeholder="Primary objective or deliverables for this 2-week cycle..."
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="input-field text-xs resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="input-field text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="input-field text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Sprint['status'])}
                  className="input-field text-xs"
                >
                  <option value="planned">Planned</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-ink-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-ink-800 transition"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs py-1.5 px-4">
                  {editingSprint ? 'Save Changes' : 'Create Sprint'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
