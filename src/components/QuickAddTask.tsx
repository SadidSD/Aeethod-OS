import React, { useState, useEffect } from 'react';
import { X, Plus, Calendar, Tag, User, Layers } from 'lucide-react';
import { useStore, useDb } from '../store';
import { Priority, DevType } from '../types';
import { PRIORITIES, DEV_TYPES } from '../lib/constants';
import { useRoute } from '../lib/router';

export const QuickAddTask: React.FC = () => {
  const { quickAddOpen, setQuickAddOpen, create, setOpenTask } = useStore();
  const db = useDb();
  const route = useRoute();
  const isDevRoute = route[0] === 'dev';

  const [title, setTitle] = useState('');
  const [topicId, setTopicId] = useState(isDevRoute ? 'dev' : (db.topics[0]?.id || 'strategy'));
  const [priority, setPriority] = useState<Priority>('normal');
  const [assignee, setAssignee] = useState(db.settings.team[0] || '');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');
  const [devType, setDevType] = useState<DevType>('feature');
  const [points, setPoints] = useState<number | null>(null);
  const [sprintId, setSprintId] = useState<string>('');
  const [epicId, setEpicId] = useState<string>('');

  useEffect(() => {
    if (quickAddOpen && isDevRoute) {
      setTopicId('dev');
    }
  }, [quickAddOpen, isDevRoute]);

  if (!quickAddOpen) return null;

  const isDev = topicId === 'dev';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask = create('tasks', {
      topicId,
      title: title.trim(),
      description: description.trim(),
      status: isDev ? 'backlog' : 'todo',
      priority,
      assignee,
      dueDate: dueDate || null,
      ...(isDev ? { type: devType, points, sprintId: sprintId || null, epicId: epicId || null } : {}),
    });

    setQuickAddOpen(false);
    setTitle('');
    setDescription('');
    setDueDate('');
    setSprintId('');
    setEpicId('');
    if (newTask && newTask.id) {
      setOpenTask(newTask.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-ink-900 border border-ink-700 rounded-2xl shadow-2xl p-6 space-y-5 animate-pop-in">
        <div className="flex items-center justify-between pb-3 border-b border-ink-800">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-600/20 text-indigo-400">
              <Plus className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-white">Create New Task / Feature</h3>
          </div>
          <button
            onClick={() => setQuickAddOpen(false)}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-ink-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-slate-300 font-semibold block mb-1">Title</label>
            <input
              autoFocus
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full input font-medium"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">Topic / Area</label>
              <select
                value={topicId}
                onChange={(e) => setTopicId(e.target.value)}
                className="w-full input text-xs py-1.5"
              >
                {db.topics.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.num > 0 ? `${t.num}. ` : ''}
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full input text-xs py-1.5 capitalize"
              >
                {PRIORITIES.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">Assignee</label>
              <select
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="w-full input text-xs py-1.5"
              >
                <option value="">Unassigned</option>
                {db.settings.team.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full input text-xs py-1.5"
              />
            </div>
          </div>

          {isDev && (
            <div className="space-y-3 p-3 rounded-xl bg-ink-950 border border-ink-800">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-cyan-400 font-semibold block mb-1">Type</label>
                  <select
                    value={devType}
                    onChange={(e) => setDevType(e.target.value as DevType)}
                    className="w-full input text-xs py-1.5 capitalize"
                  >
                    {DEV_TYPES.map((dt) => (
                      <option key={dt.id} value={dt.id}>
                        {dt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-cyan-400 font-semibold block mb-1">Story Points</label>
                  <select
                    value={points ?? ''}
                    onChange={(e) => setPoints(e.target.value ? Number(e.target.value) : null)}
                    className="w-full input text-xs py-1.5"
                  >
                    <option value="">Unestimated</option>
                    {[1, 2, 3, 5, 8, 13].map((pt) => (
                      <option key={pt} value={pt}>
                        {pt} Points
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-ink-800/80">
                <div>
                  <label className="text-xs text-amber-400 font-semibold block mb-1">Sprint</label>
                  <select
                    value={sprintId}
                    onChange={(e) => setSprintId(e.target.value)}
                    className="w-full input text-xs py-1.5"
                  >
                    <option value="">No Sprint (Backlog)</option>
                    {db.sprints.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.status})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-purple-400 font-semibold block mb-1">Roadmap Epic</label>
                  <select
                    value={epicId}
                    onChange={(e) => setEpicId(e.target.value)}
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
            </div>
          )}

          <div>
            <label className="text-xs text-slate-300 font-semibold block mb-1">Description (Optional)</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add extra context, specs or links..."
              className="w-full input text-xs resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-ink-800">
            <button
              type="button"
              onClick={() => setQuickAddOpen(false)}
              className="btn-ghost text-xs px-3 py-1.5"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary text-xs px-4 py-1.5">
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
