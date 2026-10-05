import React, { useState } from 'react';
import {
  X,
  Trash2,
  Calendar,
  CheckCircle2,
  Plus,
  Tag,
  Layers,
  Sparkles,
  MessageSquare,
  FileText,
  User,
  Clock,
  ArrowRight,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useStore, useDb } from '../store';
import { statusesFor, PRIORITIES, DEV_TYPES, POINTS } from '../lib/constants';
import { Priority, DevType } from '../types';

export const TaskModal: React.FC = () => {
  const { openTaskId, setOpenTask, update, remove, create } = useStore();
  const db = useDb();
  const [activeTab, setActiveTab] = useState<'details' | 'preview'>('details');
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [commentAuthor, setCommentAuthor] = useState(db.settings.team[0] || 'Sadid Hasan');

  if (!openTaskId) return null;

  const task = db.tasks.find((t) => t.id === openTaskId);
  if (!task) return null;

  const topic = db.topics.find((t) => t.id === task.topicId);
  const isDev = task.topicId === 'dev';
  const availableStatuses = statusesFor(task.topicId);
  const topicFields = db.fields.filter((f) => f.topicId === task.topicId);
  const subtasks = db.tasks.filter((t) => t.parentId === task.id);

  const handleFieldChange = (fieldId: string, val: unknown) => {
    update('tasks', task.id, {
      fields: {
        ...(task.fields || {}),
        [fieldId]: val,
      },
    });
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    create('tasks', {
      topicId: task.topicId,
      parentId: task.id,
      title: newSubtaskTitle.trim(),
      status: isDev ? 'ready' : 'todo',
      priority: task.priority,
      assignee: task.assignee,
    });
    setNewSubtaskTitle('');
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    const newComment = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2),
      author: commentAuthor,
      text: newCommentText.trim(),
      createdAt: new Date().toISOString(),
    };
    update('tasks', task.id, {
      comments: [...(task.comments || []), newComment],
    });
    setNewCommentText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="w-full max-w-4xl max-h-[90vh] bg-ink-900 border border-ink-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-pop-in">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-ink-700 bg-ink-850">
          <div className="flex items-center gap-3">
            <span
              className="px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider"
              style={{
                backgroundColor: `${topic?.color || '#6366f1'}20`,
                color: topic?.color || '#818cf8',
              }}
            >
              {topic?.name || 'General Task'}
            </span>
            {task.type && (
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-ink-800 text-slate-300 border border-ink-700 uppercase">
                {task.type}
              </span>
            )}
            {task.points && (
              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {task.points} pts
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (confirm('Delete this task and all its subtasks?')) {
                  remove('tasks', task.id);
                }
              }}
              className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition"
              title="Delete Task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setOpenTask(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-ink-800 transition"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body: Split Left (Details) & Right (Properties / Metadata) */}
        <div className="flex-1 overflow-y-auto flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-ink-700">
          {/* Left Column: Title, Description, Subtasks, Comments */}
          <div className="flex-1 p-6 space-y-6">
            <div>
              <input
                type="text"
                value={task.title}
                onChange={(e) => update('tasks', task.id, { title: e.target.value })}
                className="w-full bg-transparent text-xl font-bold text-white outline-none border-b border-transparent focus:border-indigo-500 pb-1"
                placeholder="Task title..."
              />
            </div>

            {/* Description Tab Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-ink-800 pb-1.5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                  Description & Markdown
                </span>
                <div className="flex items-center gap-1 bg-ink-950 p-0.5 rounded-lg border border-ink-800 text-xs">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`px-2.5 py-1 rounded-md transition ${
                      activeTab === 'details'
                        ? 'bg-indigo-600 text-white font-medium'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setActiveTab('preview')}
                    className={`px-2.5 py-1 rounded-md transition ${
                      activeTab === 'preview'
                        ? 'bg-indigo-600 text-white font-medium'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Preview
                  </button>
                </div>
              </div>

              {activeTab === 'details' ? (
                <textarea
                  rows={8}
                  value={task.description}
                  onChange={(e) => update('tasks', task.id, { description: e.target.value })}
                  placeholder="Add a detailed description, markdown tables, competitor battlecard notes, or formulas..."
                  className="w-full bg-ink-950 border border-ink-700/80 rounded-xl p-3 text-sm text-slate-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono leading-relaxed resize-y"
                />
              ) : (
                <div className="p-4 rounded-xl bg-ink-950/80 border border-ink-800 min-h-[160px] md">
                  {task.description ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {task.description}
                    </ReactMarkdown>
                  ) : (
                    <span className="text-slate-500 text-xs italic">No description provided.</span>
                  )}
                </div>
              )}
            </div>

            {/* Subtasks Section */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Subtasks & Competitor Breakdown ({subtasks.length})
                </span>
              </div>

              <div className="space-y-1.5">
                {subtasks.map((st) => (
                  <div
                    key={st.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-ink-950 border border-ink-800 hover:border-ink-700 group transition"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <input
                        type="checkbox"
                        checked={st.status === 'done'}
                        onChange={(e) =>
                          update('tasks', st.id, {
                            status: e.target.checked ? 'done' : isDev ? 'ready' : 'todo',
                          })
                        }
                        className="rounded border-ink-600 text-indigo-600 focus:ring-indigo-500 w-4 h-4 bg-ink-800"
                      />
                      <input
                        type="text"
                        value={st.title}
                        onChange={(e) => update('tasks', st.id, { title: e.target.value })}
                        className={`bg-transparent text-sm text-slate-200 outline-none w-full ${
                          st.status === 'done' ? 'line-through text-slate-500' : ''
                        }`}
                      />
                    </div>
                    <button
                      onClick={() => remove('tasks', st.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                <form onSubmit={handleAddSubtask} className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    placeholder="Add a new subtask or competitor item..."
                    className="flex-1 input text-xs py-1.5"
                  />
                  <button type="submit" className="btn-secondary text-xs py-1.5 px-3">
                    <Plus className="w-3.5 h-3.5" />
                    Add
                  </button>
                </form>
              </div>
            </div>

            {/* Comments Stream */}
            <div className="space-y-3 pt-4 border-t border-ink-800">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                Comments & Activity ({task.comments?.length || 0})
              </span>

              <div className="space-y-2">
                {task.comments?.map((c) => (
                  <div key={c.id} className="p-3 rounded-lg bg-ink-950 border border-ink-800 space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-semibold text-indigo-300">{c.author}</span>
                      <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed">{c.text}</p>
                  </div>
                ))}

                <form onSubmit={handleAddComment} className="flex gap-2 pt-1">
                  <select
                    value={commentAuthor}
                    onChange={(e) => setCommentAuthor(e.target.value)}
                    className="bg-ink-950 border border-ink-700 rounded-lg text-xs text-slate-300 px-2 py-1 outline-none"
                  >
                    {db.settings.team.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder="Write a comment or note..."
                    className="flex-1 input text-xs py-1.5"
                  />
                  <button type="submit" className="btn-primary text-xs py-1.5 px-3">
                    Post
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Right Column: Status, Priority, Custom Fields (No Limits!) */}
          <div className="w-full md:w-80 p-6 bg-ink-950/60 space-y-5">
            {/* Core Status & Assignee Controls */}
            <div className="space-y-3.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Workflow Metadata
              </span>

              {/* Status */}
              <div>
                <label className="text-xs text-slate-400 block mb-1">Status</label>
                <select
                  value={task.status}
                  onChange={(e) => update('tasks', task.id, { status: e.target.value })}
                  className="w-full input text-xs capitalize py-1.5"
                >
                  {availableStatuses.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="text-xs text-slate-400 block mb-1">Priority</label>
                <select
                  value={task.priority}
                  onChange={(e) => update('tasks', task.id, { priority: e.target.value as Priority })}
                  className="w-full input text-xs capitalize py-1.5"
                >
                  {PRIORITIES.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Assignee */}
              <div>
                <label className="text-xs text-slate-400 block mb-1">Assignee</label>
                <select
                  value={task.assignee || ''}
                  onChange={(e) => update('tasks', task.id, { assignee: e.target.value })}
                  className="w-full input text-xs py-1.5"
                >
                  <option value="">Unassigned</option>
                  {db.settings.team.map((member) => (
                    <option key={member} value={member}>
                      {member}
                    </option>
                  ))}
                </select>
              </div>

              {/* Due Date */}
              <div>
                <label className="text-xs text-slate-400 block mb-1">Due Date</label>
                <input
                  type="date"
                  value={task.dueDate || ''}
                  onChange={(e) => update('tasks', task.id, { dueDate: e.target.value || null })}
                  className="w-full input text-xs py-1.5"
                />
              </div>

              {/* Dev Specific Fields */}
              {isDev && (
                <div className="space-y-3 pt-3 border-t border-ink-800">
                  <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">
                    Engineering Specs
                  </span>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Item Type</label>
                    <select
                      value={task.type || 'feature'}
                      onChange={(e) => update('tasks', task.id, { type: e.target.value as DevType })}
                      className="w-full input text-xs capitalize py-1.5"
                    >
                      {DEV_TYPES.map((dt) => (
                        <option key={dt.id} value={dt.id}>
                          {dt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Story Points</label>
                    <select
                      value={task.points || ''}
                      onChange={(e) =>
                        update('tasks', task.id, {
                          points: e.target.value ? Number(e.target.value) : null,
                        })
                      }
                      className="w-full input text-xs py-1.5"
                    >
                      <option value="">Unestimated</option>
                      {POINTS.map((pt) => (
                        <option key={pt} value={pt}>
                          {pt} Points
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Sprint</label>
                    <select
                      value={task.sprintId || ''}
                      onChange={(e) => update('tasks', task.id, { sprintId: e.target.value || null })}
                      className="w-full input text-xs py-1.5"
                    >
                      <option value="">No Sprint (Backlog)</option>
                      {db.sprints.map((sp) => (
                        <option key={sp.id} value={sp.id}>
                          {sp.name} ({sp.status})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Epic</label>
                    <select
                      value={task.epicId || ''}
                      onChange={(e) => update('tasks', task.id, { epicId: e.target.value || null })}
                      className="w-full input text-xs py-1.5"
                    >
                      <option value="">No Epic</option>
                      {db.epics.map((ep) => (
                        <option key={ep.id} value={ep.id}>
                          {ep.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* UNLIMITED Custom Fields Section */}
            {topicFields.length > 0 && (
              <div className="space-y-3 pt-3 border-t border-ink-800">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider block">
                    Custom Fields (Unlimited)
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                    0 Paywalls
                  </span>
                </div>

                <div className="space-y-2.5">
                  {topicFields.map((f) => {
                    const currentVal = task.fields?.[f.id];

                    return (
                      <div key={f.id} className="space-y-1">
                        <label className="text-xs text-slate-300 font-medium flex items-center justify-between">
                          <span>{f.name}</span>
                          <span className="text-[10px] text-slate-500 font-mono uppercase">{f.type}</span>
                        </label>

                        {f.type === 'select' && f.options ? (
                          <select
                            value={String(currentVal || '')}
                            onChange={(e) => handleFieldChange(f.id, e.target.value)}
                            className="w-full input text-xs py-1.5"
                          >
                            <option value="">Select option...</option>
                            {f.options.map((opt) => (
                              <option key={opt.id} value={opt.id}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        ) : f.type === 'currency' ? (
                          <div className="relative">
                            <span className="absolute left-2.5 top-1.5 text-xs text-slate-500">$</span>
                            <input
                              type="number"
                              value={currentVal !== undefined && currentVal !== null ? Number(currentVal) : ''}
                              onChange={(e) =>
                                handleFieldChange(
                                  f.id,
                                  e.target.value === '' ? null : Number(e.target.value)
                                )
                              }
                              placeholder="0"
                              className="w-full input text-xs py-1.5 pl-6"
                            />
                          </div>
                        ) : f.type === 'percent' ? (
                          <div className="relative">
                            <input
                              type="number"
                              value={currentVal !== undefined && currentVal !== null ? Number(currentVal) : ''}
                              onChange={(e) =>
                                handleFieldChange(
                                  f.id,
                                  e.target.value === '' ? null : Number(e.target.value)
                                )
                              }
                              placeholder="0"
                              className="w-full input text-xs py-1.5 pr-6"
                            />
                            <span className="absolute right-2.5 top-1.5 text-xs text-slate-500">%</span>
                          </div>
                        ) : f.type === 'number' ? (
                          <input
                            type="number"
                            value={currentVal !== undefined && currentVal !== null ? Number(currentVal) : ''}
                            onChange={(e) =>
                              handleFieldChange(
                                f.id,
                                e.target.value === '' ? null : Number(e.target.value)
                              )
                            }
                            placeholder="0"
                            className="w-full input text-xs py-1.5"
                          />
                        ) : (
                          <input
                            type="text"
                            value={String(currentVal || '')}
                            onChange={(e) => handleFieldChange(f.id, e.target.value)}
                            placeholder="Enter value..."
                            className="w-full input text-xs py-1.5"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
