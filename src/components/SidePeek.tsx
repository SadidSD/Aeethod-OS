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
  Maximize2,
  Minimize2,
  PanelRightClose,
  PanelRight,
  Layout,
  ExternalLink,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useStore, useDb } from '../store';
import { statusesFor, PRIORITIES, DEV_TYPES, POINTS, colorForName, initials, emojiForTopic } from '../lib/constants';
import { Priority, DevType } from '../types';

export const SidePeek: React.FC = () => {
  const { openTaskId, setOpenTask, update, remove, create, peekMode, setPeekMode } = useStore();
  const db = useDb();

  const [activeTab, setActiveTab] = useState<'content' | 'subtasks' | 'comments'>('content');
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
      status: isDev ? 'backlog' : 'todo',
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

  const handleDelete = () => {
    if (window.confirm(`Delete "${task.title}"?`)) {
      remove('tasks', task.id);
      setOpenTask(null);
    }
  };

  // Drawer classes based on peekMode
  const containerClasses = {
    side: 'fixed right-0 top-0 bottom-0 w-full md:w-[620px] bg-[#1e1e1e] border-l border-[#2e2e2e] shadow-2xl z-50 flex flex-col animate-slide-in',
    center: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs',
    full: 'fixed inset-0 z-50 bg-[#1e1e1e] flex flex-col',
  }[peekMode];

  const innerModalClasses = peekMode === 'center'
    ? 'w-full max-w-3xl max-h-[90vh] bg-[#1e1e1e] border border-[#2e2e2e] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-slide-in'
    : 'h-full flex flex-col overflow-hidden';

  return (
    <div className={peekMode === 'center' ? containerClasses : undefined}>
      {/* Backdrop for side peek on mobile */}
      {peekMode === 'side' && (
        <div
          onClick={() => setOpenTask(null)}
          className="fixed inset-0 bg-black/40 backdrop-blur-[1px] z-40 md:hidden"
        />
      )}

      <div className={peekMode === 'center' ? innerModalClasses : containerClasses}>
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#2e2e2e] bg-[#202020] text-xs select-none">
          <div className="flex items-center gap-2">
            <span className="text-base">{topic ? emojiForTopic(topic.id) : '📄'}</span>
            <span className="font-medium text-[#9b9b9b] truncate">
              {topic?.name || 'Task'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[#9b9b9b]">
            {/* Peek Mode Switcher */}
            <button
              onClick={() => setPeekMode('side')}
              className={`p-1 rounded hover:text-white transition ${peekMode === 'side' ? 'text-white bg-[#2c2c2c]' : ''}`}
              title="Side Peek"
            >
              <PanelRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setPeekMode('center')}
              className={`p-1 rounded hover:text-white transition ${peekMode === 'center' ? 'text-white bg-[#2c2c2c]' : ''}`}
              title="Center Peek"
            >
              <Layout className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setPeekMode('full')}
              className={`p-1 rounded hover:text-white transition ${peekMode === 'full' ? 'text-white bg-[#2c2c2c]' : ''}`}
              title="Full Page"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>

            <div className="h-4 w-px bg-[#2e2e2e] mx-1" />

            {/* Delete button */}
            <button
              onClick={handleDelete}
              className="p-1 rounded hover:text-rose-400 hover:bg-[#2c2c2c] transition"
              title="Delete page"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            {/* Close button */}
            <button
              onClick={() => setOpenTask(null)}
              className="p-1 rounded hover:text-white hover:bg-[#2c2c2c] transition"
              title="Close (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Page Title */}
          <div>
            <input
              type="text"
              value={task.title}
              onChange={(e) => update('tasks', task.id, { title: e.target.value })}
              className="text-2xl font-bold text-white bg-transparent border-b border-transparent hover:border-[#333333] focus:border-[#4f46e5] outline-none w-full transition tracking-tight py-1"
              placeholder="Page title..."
            />
          </div>

          {/* Properties Table (Notion 2-column Property List) */}
          <div className="space-y-1.5 text-xs select-none">
            {/* Status */}
            <div className="flex items-center py-1 group">
              <div className="w-32 flex items-center gap-2 text-[#9b9b9b]">
                <Tag className="w-3.5 h-3.5" />
                <span>Status</span>
              </div>
              <div className="flex-1">
                <select
                  value={task.status}
                  onChange={(e) => update('tasks', task.id, { status: e.target.value })}
                  className="bg-[#242424] hover:bg-[#2c2c2c] border border-[#2e2e2e] rounded px-2 py-1 text-white text-xs outline-none cursor-pointer transition"
                >
                  {availableStatuses.map((st) => (
                    <option key={st.id} value={st.id} className="bg-[#202020]">
                      {st.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Assignee */}
            <div className="flex items-center py-1 group">
              <div className="w-32 flex items-center gap-2 text-[#9b9b9b]">
                <User className="w-3.5 h-3.5" />
                <span>Assignee</span>
              </div>
              <div className="flex-1 flex items-center gap-2">
                <select
                  value={task.assignee || ''}
                  onChange={(e) => update('tasks', task.id, { assignee: e.target.value })}
                  className="bg-[#242424] hover:bg-[#2c2c2c] border border-[#2e2e2e] rounded px-2 py-1 text-white text-xs outline-none cursor-pointer transition"
                >
                  <option value="">Unassigned</option>
                  {(db.settings.team || []).map((m) => (
                    <option key={m} value={m} className="bg-[#202020]">
                      {m}
                    </option>
                  ))}
                </select>

                {task.assignee && (
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white shrink-0"
                    style={{ backgroundColor: colorForName(task.assignee) }}
                  >
                    {initials(task.assignee)}
                  </div>
                )}
              </div>
            </div>

            {/* Priority */}
            <div className="flex items-center py-1 group">
              <div className="w-32 flex items-center gap-2 text-[#9b9b9b]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Priority</span>
              </div>
              <div className="flex-1">
                <select
                  value={task.priority}
                  onChange={(e) => update('tasks', task.id, { priority: e.target.value as Priority })}
                  className="bg-[#242424] hover:bg-[#2c2c2c] border border-[#2e2e2e] rounded px-2 py-1 text-white text-xs outline-none cursor-pointer transition"
                >
                  {PRIORITIES.map((p) => (
                    <option key={p.id} value={p.id} className="bg-[#202020]">
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Due Date */}
            <div className="flex items-center py-1 group">
              <div className="w-32 flex items-center gap-2 text-[#9b9b9b]">
                <Calendar className="w-3.5 h-3.5" />
                <span>Due Date</span>
              </div>
              <div className="flex-1">
                <input
                  type="date"
                  value={task.dueDate || ''}
                  onChange={(e) => update('tasks', task.id, { dueDate: e.target.value || null })}
                  className="bg-[#242424] hover:bg-[#2c2c2c] border border-[#2e2e2e] rounded px-2 py-1 text-white text-xs outline-none cursor-pointer transition font-mono"
                />
              </div>
            </div>

            {/* Dev Specific Fields */}
            {isDev && (
              <>
                {/* Sprint */}
                <div className="flex items-center py-1 group">
                  <div className="w-32 flex items-center gap-2 text-[#9b9b9b]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Sprint</span>
                  </div>
                  <div className="flex-1">
                    <select
                      value={task.sprintId || ''}
                      onChange={(e) => update('tasks', task.id, { sprintId: e.target.value || null })}
                      className="bg-[#242424] hover:bg-[#2c2c2c] border border-[#2e2e2e] rounded px-2 py-1 text-white text-xs outline-none cursor-pointer transition"
                    >
                      <option value="">No sprint (Backlog)</option>
                      {db.sprints.map((s) => (
                        <option key={s.id} value={s.id} className="bg-[#202020]">
                          {s.name} ({s.status})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Epic */}
                <div className="flex items-center py-1 group">
                  <div className="w-32 flex items-center gap-2 text-[#9b9b9b]">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Roadmap Epic</span>
                  </div>
                  <div className="flex-1">
                    <select
                      value={task.epicId || ''}
                      onChange={(e) => update('tasks', task.id, { epicId: e.target.value || null })}
                      className="bg-[#242424] hover:bg-[#2c2c2c] border border-[#2e2e2e] rounded px-2 py-1 text-white text-xs outline-none cursor-pointer transition"
                    >
                      <option value="">No Epic</option>
                      {db.epics.map((ep) => (
                        <option key={ep.id} value={ep.id} className="bg-[#202020]">
                          {ep.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Story Points */}
                <div className="flex items-center py-1 group">
                  <div className="w-32 flex items-center gap-2 text-[#9b9b9b]">
                    <span className="font-mono">#</span>
                    <span>Story Points</span>
                  </div>
                  <div className="flex-1 flex items-center gap-1.5">
                    {POINTS.map((pts) => (
                      <button
                        key={pts}
                        onClick={() => update('tasks', task.id, { points: task.points === pts ? null : pts })}
                        className={`w-6 h-6 rounded text-xs font-mono font-bold transition ${
                          task.points === pts
                            ? 'bg-indigo-600 text-white'
                            : 'bg-[#242424] text-[#9b9b9b] hover:text-white hover:bg-[#2e2e2e]'
                        }`}
                      >
                        {pts}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Custom Fields */}
            {topicFields.map((field) => (
              <div key={field.id} className="flex items-center py-1 group">
                <div className="w-32 flex items-center gap-2 text-[#9b9b9b] truncate">
                  <span className="font-mono text-[10px] text-[#787774]">
                    {field.type === 'currency' ? '$' : field.type === 'percent' ? '%' : '⚙'}
                  </span>
                  <span className="truncate">{field.name}</span>
                </div>
                <div className="flex-1">
                  {field.type === 'currency' || field.type === 'number' || field.type === 'percent' ? (
                    <input
                      type="number"
                      value={(task.fields?.[field.id] as number) ?? ''}
                      onChange={(e) => handleFieldChange(field.id, e.target.value ? Number(e.target.value) : null)}
                      className="bg-[#242424] hover:bg-[#2c2c2c] border border-[#2e2e2e] rounded px-2 py-1 text-white text-xs outline-none transition font-mono w-40"
                    />
                  ) : field.type === 'select' && field.options ? (
                    <select
                      value={(task.fields?.[field.id] as string) || ''}
                      onChange={(e) => handleFieldChange(field.id, e.target.value || null)}
                      className="bg-[#242424] hover:bg-[#2c2c2c] border border-[#2e2e2e] rounded px-2 py-1 text-white text-xs outline-none transition"
                    >
                      <option value="">None</option>
                      {field.options.map((opt) => (
                        <option key={opt.id} value={opt.id} className="bg-[#202020]">
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={(task.fields?.[field.id] as string) ?? ''}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      className="bg-[#242424] hover:bg-[#2c2c2c] border border-[#2e2e2e] rounded px-2 py-1 text-white text-xs outline-none transition w-full"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-[#2e2e2e]" />

          {/* Tabs: Content / Subtasks / Comments */}
          <div className="space-y-4">
            <div className="flex items-center gap-1 border-b border-[#2e2e2e] pb-1 select-none">
              <button
                onClick={() => setActiveTab('content')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition ${
                  activeTab === 'content'
                    ? 'bg-[#2a2a2a] text-white'
                    : 'text-[#9b9b9b] hover:text-white hover:bg-[#242424]'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Notes & PRD</span>
              </button>

              <button
                onClick={() => setActiveTab('subtasks')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition ${
                  activeTab === 'subtasks'
                    ? 'bg-[#2a2a2a] text-white'
                    : 'text-[#9b9b9b] hover:text-white hover:bg-[#242424]'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Subtasks ({subtasks.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('comments')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition ${
                  activeTab === 'comments'
                    ? 'bg-[#2a2a2a] text-white'
                    : 'text-[#9b9b9b] hover:text-white hover:bg-[#242424]'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Comments ({task.comments?.length || 0})</span>
              </button>
            </div>

            {/* Tab 1: Content & Notes */}
            {activeTab === 'content' && (
              <div className="space-y-3">
                <textarea
                  rows={8}
                  placeholder="Type anything in Markdown: bullet points, checklists, code, PRDs..."
                  value={task.description}
                  onChange={(e) => update('tasks', task.id, { description: e.target.value })}
                  className="w-full bg-[#181818] border border-[#2a2a2a] rounded-lg p-3 text-xs text-[#e6e6e6] placeholder:text-[#6a6a6a] outline-none font-mono resize-y leading-relaxed focus:border-[#3e3e3e]"
                />

                {task.description && (
                  <div className="p-4 rounded-lg bg-[#202020] border border-[#282828] md">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {task.description}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Subtasks */}
            {activeTab === 'subtasks' && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  {subtasks.length === 0 ? (
                    <div className="text-xs text-[#787774] italic py-2">
                      No subtasks yet.
                    </div>
                  ) : (
                    subtasks.map((st) => (
                      <div
                        key={st.id}
                        className="flex items-center justify-between gap-2 p-2 rounded bg-[#242424] hover:bg-[#2a2a2a] transition group text-xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <input
                            type="checkbox"
                            checked={st.status === 'done'}
                            onChange={(e) =>
                              update('tasks', st.id, {
                                status: e.target.checked ? 'done' : isDev ? 'backlog' : 'todo',
                              })
                            }
                            className="accent-indigo-500 rounded"
                          />
                          <span
                            className={`truncate ${
                              st.status === 'done' ? 'line-through text-[#787774]' : 'text-white'
                            }`}
                          >
                            {st.title}
                          </span>
                        </div>

                        <button
                          onClick={() => remove('tasks', st.id)}
                          className="opacity-0 group-hover:opacity-100 text-[#787774] hover:text-rose-400 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <form onSubmit={handleAddSubtask} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Add a new subtask..."
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    className="input-field text-xs flex-1"
                  />
                  <button type="submit" className="btn-secondary text-xs py-1.5 px-3">
                    Add
                  </button>
                </form>
              </div>
            )}

            {/* Tab 3: Comments */}
            {activeTab === 'comments' && (
              <div className="space-y-4">
                <div className="space-y-3">
                  {(task.comments || []).length === 0 ? (
                    <div className="text-xs text-[#787774] italic py-2">
                      No comments yet.
                    </div>
                  ) : (
                    (task.comments || []).map((c) => (
                      <div key={c.id} className="p-3 rounded-lg bg-[#242424] border border-[#2e2e2e] space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-white">{c.author}</span>
                          <span className="text-[#787774] font-mono">
                            {new Date(c.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-[#d4d4d4] leading-relaxed">{c.text}</p>
                      </div>
                    ))
                  )}
                </div>

                <form onSubmit={handleAddComment} className="space-y-2">
                  <textarea
                    rows={2}
                    placeholder="Write a comment..."
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    className="input-field text-xs resize-none"
                  />
                  <div className="flex justify-between items-center">
                    <select
                      value={commentAuthor}
                      onChange={(e) => setCommentAuthor(e.target.value)}
                      className="bg-[#242424] text-xs text-[#9b9b9b] rounded px-2 py-1 border border-[#2e2e2e]"
                    >
                      {(db.settings.team || []).map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>

                    <button type="submit" className="btn-primary text-xs py-1 px-3">
                      Comment
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
