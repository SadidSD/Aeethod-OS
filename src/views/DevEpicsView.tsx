import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronRight,
  Code2,
  Sparkles,
} from 'lucide-react';
import { useDb, useStore } from '../store';
import { Epic } from '../types';
import { devTypeDef, colorForName, initials } from '../lib/constants';

export const DevEpicsView: React.FC = () => {
  const db = useDb();
  const { create, update, remove, setOpenTask } = useStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingEpic, setEditingEpic] = useState<Epic | null>(null);
  const [collapsedEpics, setCollapsedEpics] = useState<Record<string, boolean>>({});

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#6366f1');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const devTasks = db.tasks.filter((t) => t.topicId === 'dev' && !t.parentId);
  const [quickTaskTitle, setQuickTaskTitle] = useState<Record<string, string>>({});

  const handleQuickAddTaskToEpic = (epicId: string) => {
    const title = (quickTaskTitle[epicId] || '').trim();
    if (!title) return;
    create('tasks', {
      topicId: 'dev',
      epicId: epicId,
      title: title,
      status: 'backlog',
      type: 'feature',
      priority: 'normal',
      assignee: db.settings.team[0] || '',
    });
    setQuickTaskTitle((prev) => ({ ...prev, [epicId]: '' }));
  };

  const toggleCollapse = (epicId: string) => {
    setCollapsedEpics((prev) => ({ ...prev, [epicId]: !prev[epicId] }));
  };

  const openCreateModal = () => {
    setEditingEpic(null);
    setName('');
    setDescription('');
    setColor('#6366f1');
    const today = new Date().toISOString().slice(0, 10);
    const end = new Date(Date.now() + 60 * 86400000).toISOString().slice(0, 10);
    setStartDate(today);
    setEndDate(end);
    setModalOpen(true);
  };

  const openEditModal = (epic: Epic) => {
    setEditingEpic(epic);
    setName(epic.name);
    setDescription(epic.description);
    setColor(epic.color);
    setStartDate(epic.startDate);
    setEndDate(epic.endDate);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingEpic) {
      update('epics', editingEpic.id, {
        name: name.trim(),
        description: description.trim(),
        color,
        startDate,
        endDate,
      });
    } else {
      create('epics', {
        name: name.trim(),
        description: description.trim(),
        color,
        startDate,
        endDate,
      });
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string, epicName: string) => {
    if (window.confirm(`Delete epic "${epicName}"? Linked tasks will remain in the backlog.`)) {
      remove('epics', id);
    }
  };

  const totalEpicPoints = devTasks.filter((t) => t.epicId).reduce((sum, t) => sum + (t.points || 0), 0);
  const completedEpicPoints = devTasks
    .filter((t) => t.epicId && t.status === 'done')
    .reduce((sum, t) => sum + (t.points || 0), 0);
  const overallProgress = totalEpicPoints > 0 ? Math.round((completedEpicPoints / totalEpicPoints) * 100) : 0;

  const colorPalette = [
    '#6366f1', '#0ea5e9', '#22c55e', '#f59e0b', '#ef4444',
    '#a855f7', '#ec4899', '#f97316', '#14b8a6', '#64748b'
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-slide-in">
      {/* Header */}
      <div className="card p-6 border-purple-500/30 bg-gradient-to-r from-ink-900 via-purple-950/20 to-ink-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 uppercase tracking-wider font-mono">
              Engineering Architecture
            </span>
            <span className="text-xs text-slate-400">• Roadmap Milestones</span>
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">
            Roadmap Epics & Strategic Capabilities
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Long-term technical initiatives structuring the Aeethod inventory ledger, camera computer
            vision, auto-repricer, and marketplace connectors.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs font-bold text-white font-mono">
              {completedEpicPoints} / {totalEpicPoints} pts ({overallProgress}%)
            </div>
            <div className="text-[10px] text-slate-400">Total Roadmap Delivery</div>
          </div>

          <button
            onClick={openCreateModal}
            className="btn-primary flex items-center gap-2 text-xs py-2 shadow-lg shadow-indigo-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>New Epic</span>
          </button>
        </div>
      </div>

      {/* Epics List */}
      <div className="space-y-4">
        {db.epics.length === 0 ? (
          <div className="card p-12 text-center space-y-3">
            <Layers className="w-10 h-10 text-slate-600 mx-auto" />
            <div className="text-base font-semibold text-white">No epics created</div>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Create an epic to group user stories and technical tasks around major product features.
            </p>
            <button onClick={openCreateModal} className="btn-primary text-xs mx-auto">
              Create Epic
            </button>
          </div>
        ) : (
          db.epics.map((epic) => {
            const epicTasks = devTasks.filter((t) => t.epicId === epic.id);
            const totalPoints = epicTasks.reduce((acc, t) => acc + (t.points || 0), 0);
            const doneTasks = epicTasks.filter((t) => t.status === 'done');
            const donePoints = doneTasks.reduce((acc, t) => acc + (t.points || 0), 0);
            const progress = totalPoints > 0 ? Math.round((donePoints / totalPoints) * 100) : 0;
            const isCollapsed = collapsedEpics[epic.id];

            return (
              <div
                key={epic.id}
                className="card p-5 border border-ink-800 bg-ink-900 transition hover:border-ink-700 space-y-4"
              >
                {/* Epic Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div
                    onClick={() => toggleCollapse(epic.id)}
                    className="flex items-center gap-3 cursor-pointer select-none group"
                  >
                    <div className="text-slate-500 group-hover:text-slate-300">
                      {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>

                    <div
                      className="w-3.5 h-3.5 rounded-md shrink-0 shadow-sm"
                      style={{ backgroundColor: epic.color }}
                    />

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition">
                          {epic.name}
                        </h3>
                        <span className="text-[11px] text-slate-400 font-mono">
                          ({epic.startDate} → {epic.endDate})
                        </span>
                      </div>

                      {epic.description && (
                        <p className="text-xs text-slate-400 pt-0.5 line-clamp-1">
                          {epic.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Metrics and Controls */}
                  <div className="flex items-center gap-4 shrink-0 pl-7 md:pl-0">
                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-white">
                        {donePoints} / {totalPoints} pts
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {doneTasks.length} / {epicTasks.length} tasks ({progress}%)
                      </div>
                    </div>

                    <div className="w-24 bg-ink-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-300 rounded-full"
                        style={{ width: `${progress}%`, backgroundColor: epic.color }}
                      />
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(epic)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-ink-800 transition"
                        title="Edit Epic"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(epic.id, epic.name)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-ink-800 transition"
                        title="Delete Epic"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Tasks List */}
                {!isCollapsed && (
                  <div className="pl-6 pt-3 border-t border-ink-800/80 space-y-3">
                    {/* Inline Task Creator & Link Existing Task */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleQuickAddTaskToEpic(epic.id);
                        }}
                        className="flex-1 flex items-center gap-2"
                      >
                        <input
                          type="text"
                          value={quickTaskTitle[epic.id] || ''}
                          onChange={(e) =>
                            setQuickTaskTitle((prev) => ({ ...prev, [epic.id]: e.target.value }))
                          }
                          placeholder={`+ Add a task directly to "${epic.name}" (press Enter)...`}
                          className="flex-1 input text-xs py-1.5 px-3 bg-ink-950/70 border-ink-800 focus:border-indigo-500/50"
                        />
                        <button
                          type="submit"
                          disabled={!quickTaskTitle[epic.id]?.trim()}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500 hover:text-white border border-indigo-500/30 transition disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1 shrink-0"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Epic</span>
                        </button>
                      </form>

                      {devTasks.filter((t) => !t.epicId).length > 0 && (
                        <select
                          value=""
                          onChange={(e) => {
                            if (e.target.value) {
                              update('tasks', e.target.value, { epicId: epic.id });
                            }
                          }}
                          className="input text-xs py-1.5 px-2 bg-ink-950/80 border-ink-800 text-slate-300 max-w-[220px] truncate shrink-0"
                        >
                          <option value="">+ Link existing task...</option>
                          {devTasks
                            .filter((t) => !t.epicId)
                            .map((ut) => (
                              <option key={ut.id} value={ut.id}>
                                {ut.title}
                              </option>
                            ))}
                        </select>
                      )}
                    </div>

                    {epicTasks.length === 0 ? (
                      <div className="text-xs text-slate-500 italic py-1">
                        No tasks linked to this epic yet. Use the field above, or assign any ticket to this epic in the task drawer or Kanban board.
                      </div>
                    ) : (
                      epicTasks.map((t) => {
                        const isDone = t.status === 'done';
                        const sprint = db.sprints.find((s) => s.id === t.sprintId);

                        return (
                          <div
                            key={t.id}
                            onClick={() => setOpenTask(t.id)}
                            className="py-1.5 px-2 rounded-md flex items-center justify-between gap-3 hover:bg-ink-800/50 cursor-pointer transition text-xs"
                          >
                            <div className="flex items-center gap-2.5 truncate">
                              <span
                                className="text-[9px] uppercase font-mono font-bold px-1.5 py-0.5 rounded border shrink-0 text-slate-300"
                                style={{
                                  backgroundColor: `${devTypeDef(t.type)?.color || '#64748b'}20`,
                                  borderColor: `${devTypeDef(t.type)?.color || '#64748b'}40`,
                                  color: devTypeDef(t.type)?.color || '#64748b',
                                }}
                              >
                                {t.type || 'feature'}
                              </span>

                              <span className={`truncate ${isDone ? 'line-through text-slate-500' : 'text-slate-300'}`}>
                                {t.title}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {sprint && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-300 font-mono">
                                  {sprint.name}
                                </span>
                              )}

                              {t.points !== null && t.points !== undefined && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-ink-800 text-slate-300 font-mono font-semibold">
                                  {t.points} pts
                                </span>
                              )}

                              <span
                                className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                                  isDone
                                    ? 'bg-emerald-500/20 text-emerald-300'
                                    : 'bg-ink-800 text-slate-400'
                                }`}
                              >
                                {t.status}
                              </span>

                              {t.assignee && (
                                <div
                                  className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white shrink-0"
                                  style={{ backgroundColor: colorForName(t.assignee) }}
                                  title={t.assignee}
                                >
                                  {initials(t.assignee)}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Create / Edit Epic Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="card w-full max-w-lg p-6 space-y-4 shadow-2xl border-purple-500/30">
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>{editingEpic ? 'Edit Epic' : 'Create New Epic'}</span>
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Epic Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Auto-Pricing Engine"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Architecture scope and objectives..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input-field text-xs resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Color Tag
                </label>
                <div className="flex items-center gap-2">
                  {colorPalette.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-6 h-6 rounded-md transition ${
                        color === c ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
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
                    Target Completion Date
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

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-ink-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-ink-800 transition"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs py-1.5 px-4">
                  {editingEpic ? 'Save Changes' : 'Create Epic'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
