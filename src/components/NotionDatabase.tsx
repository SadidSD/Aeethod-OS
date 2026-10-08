import React, { useState, useMemo } from 'react';
import {
  Table as TableIcon,
  KanbanSquare,
  LayoutGrid,
  List as ListIcon,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  X,
  CheckCircle2,
  Calendar,
  User,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { Task, Field } from '../types';
import { useStore, useDb } from '../store';
import {
  statusesFor,
  statusDef,
  priorityDef,
  PRIORITIES,
  devTypeDef,
  colorForName,
  initials,
} from '../lib/constants';

interface NotionDatabaseProps {
  topicId: string;
  tasks: Task[];
  fields?: Field[];
  defaultView?: 'table' | 'board' | 'gallery' | 'list';
}

export const NotionDatabase: React.FC<NotionDatabaseProps> = ({
  topicId,
  tasks,
  fields = [],
  defaultView = 'table',
}) => {
  const db = useDb();
  const { create, update, remove, setOpenTask, setPeekMode } = useStore();

  const [viewMode, setViewMode] = useState<'table' | 'board' | 'gallery' | 'list'>(defaultView);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'default' | 'dueDate' | 'priority' | 'points'>('default');

  const [quickNewTitle, setQuickNewTitle] = useState('');

  const availableStatuses = statusesFor(topicId);

  // Filter and sort tasks
  const processedTasks = useMemo(() => {
    let result = [...tasks];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q) ||
          t.assignee?.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter((t) => t.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      result = result.filter((t) => t.priority === priorityFilter);
    }

    if (sortBy === 'dueDate') {
      result.sort((a, b) => (a.dueDate || '9999').localeCompare(b.dueDate || '9999'));
    } else if (sortBy === 'priority') {
      const rank = (p: string) => (p === 'urgent' ? 0 : p === 'high' ? 1 : p === 'normal' ? 2 : 3);
      result.sort((a, b) => rank(a.priority) - rank(b.priority));
    } else if (sortBy === 'points') {
      result.sort((a, b) => (b.points || 0) - (a.points || 0));
    }

    return result;
  }, [tasks, searchQuery, statusFilter, priorityFilter, sortBy]);

  const handleInlineCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickNewTitle.trim()) return;
    create('tasks', {
      topicId,
      title: quickNewTitle.trim(),
      status: availableStatuses[0]?.id || 'todo',
      priority: 'normal',
      assignee: db.settings?.team?.[0] || 'Sadid Hasan',
      tags: [],
      fields: {},
      comments: [],
      order: tasks.length + 1,
    });
    setQuickNewTitle('');
  };

  const getStatusBadge = (stId: string) => {
    const s = statusDef(topicId, stId);
    return (
      <span
        className="px-2 py-0.5 rounded text-[11px] font-medium border"
        style={{
          backgroundColor: `${s.color}20`,
          borderColor: `${s.color}40`,
          color: s.color,
        }}
      >
        {s.label}
      </span>
    );
  };

  const getPriorityBadge = (p: string) => {
    const pr = PRIORITIES.find((x) => x.id === p) || PRIORITIES[2];
    return (
      <span
        className="px-2 py-0.5 rounded text-[11px] font-medium border"
        style={{
          backgroundColor: `${pr.color}20`,
          borderColor: `${pr.color}40`,
          color: pr.color,
        }}
      >
        {pr.label}
      </span>
    );
  };

  return (
    <div className="w-full space-y-3 select-none">
      {/* Notion Database Header Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2e2e2e] pb-2">
        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition ${
              viewMode === 'table'
                ? 'bg-[#2c2c2c] text-white shadow-xs'
                : 'text-[#9b9b9b] hover:text-white hover:bg-[#252525]'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>Table</span>
          </button>

          <button
            onClick={() => setViewMode('board')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition ${
              viewMode === 'board'
                ? 'bg-[#2c2c2c] text-white shadow-xs'
                : 'text-[#9b9b9b] hover:text-white hover:bg-[#252525]'
            }`}
          >
            <KanbanSquare className="w-3.5 h-3.5" />
            <span>Board</span>
          </button>

          <button
            onClick={() => setViewMode('gallery')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition ${
              viewMode === 'gallery'
                ? 'bg-[#2c2c2c] text-white shadow-xs'
                : 'text-[#9b9b9b] hover:text-white hover:bg-[#252525]'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Gallery</span>
          </button>

          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition ${
              viewMode === 'list'
                ? 'bg-[#2c2c2c] text-white shadow-xs'
                : 'text-[#9b9b9b] hover:text-white hover:bg-[#252525]'
            }`}
          >
            <ListIcon className="w-3.5 h-3.5" />
            <span>List</span>
          </button>
        </div>

        {/* Filters, Sort & Search */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Quick Search */}
          <div className="relative">
            <Search className="w-3 h-3 text-[#787774] absolute left-2 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#202020] border border-[#2e2e2e] rounded-md pl-6 pr-2 py-0.5 text-xs text-[#e6e6e6] placeholder:text-[#6a6a6a] outline-none focus:border-[#444444] w-28 sm:w-36 transition"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#202020] border border-[#2e2e2e] rounded-md px-2 py-0.5 text-xs text-[#9b9b9b] hover:text-white outline-none cursor-pointer"
          >
            <option value="all">Status: All</option>
            {availableStatuses.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-[#202020] border border-[#2e2e2e] rounded-md px-2 py-0.5 text-xs text-[#9b9b9b] hover:text-white outline-none cursor-pointer"
          >
            <option value="all">Priority: All</option>
            {PRIORITIES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>

          {/* Sort Selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#202020] border border-[#2e2e2e] rounded-md px-2 py-0.5 text-xs text-[#9b9b9b] hover:text-white outline-none cursor-pointer"
          >
            <option value="default">Sort: Default</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="points">Points</option>
          </select>
        </div>
      </div>

      {/* Render Selected View */}
      {viewMode === 'table' && (
        <div className="overflow-x-auto border border-[#2e2e2e] rounded-lg bg-[#202020]">
          <table className="notion-table">
            <thead>
              <tr>
                <th className="w-1/3">Aa Name</th>
                <th className="w-28">🏷️ Status</th>
                <th className="w-24">🎯 Priority</th>
                <th className="w-28">👤 Assignee</th>
                <th className="w-28">📅 Due Date</th>
                {topicId === 'dev' && <th className="w-20"># Points</th>}
                {fields.map((f) => (
                  <th key={f.id} className="w-32 truncate">
                    {f.type === 'currency' ? '💲 ' : f.type === 'percent' ? '% ' : '⚙️ '}
                    {f.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {processedTasks.map((t) => (
                <tr
                  key={t.id}
                  onClick={() => {
                    setPeekMode('center');
                    setOpenTask(t.id);
                  }}
                  className="cursor-pointer group"
                >
                  {/* Title */}
                  <td className="font-medium text-[#e6e6e6] group-hover:text-white">
                    <div className="flex items-center gap-2">
                      <span className="truncate">{t.title}</span>
                      {t.tags?.length > 0 && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#2a2a2a] text-[#8a8a8a] font-mono">
                          {t.tags[0]}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Status */}
                  <td onClick={(e) => e.stopPropagation()}>
                    <select
                      value={t.status}
                      onChange={(e) => update('tasks', t.id, { status: e.target.value })}
                      className="bg-transparent text-xs text-[#9b9b9b] hover:text-white outline-none cursor-pointer"
                    >
                      {availableStatuses.map((st) => (
                        <option key={st.id} value={st.id} className="bg-[#202020] text-white">
                          {st.label}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Priority */}
                  <td onClick={(e) => e.stopPropagation()}>
                    {getPriorityBadge(t.priority)}
                  </td>

                  {/* Assignee */}
                  <td>
                    {t.assignee ? (
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                          style={{ backgroundColor: colorForName(t.assignee) }}
                        >
                          {initials(t.assignee)}
                        </div>
                        <span className="truncate text-xs text-[#9b9b9b]">{t.assignee}</span>
                      </div>
                    ) : (
                      <span className="text-[#6a6a6a] italic text-xs">Unassigned</span>
                    )}
                  </td>

                  {/* Due Date */}
                  <td className="font-mono text-xs text-[#9b9b9b]">
                    {t.dueDate || '—'}
                  </td>

                  {/* Dev Points */}
                  {topicId === 'dev' && (
                    <td className="font-mono text-xs text-slate-300">
                      {t.points ? `${t.points} pts` : '—'}
                    </td>
                  )}

                  {/* Custom Fields */}
                  {fields.map((f) => {
                    const val = t.fields?.[f.id];
                    return (
                      <td key={f.id} className="font-mono text-xs text-[#9b9b9b] truncate">
                        {f.type === 'currency' && val !== undefined && val !== null ? (
                          <span className="text-emerald-400 font-bold">${Number(val).toLocaleString()}</span>
                        ) : f.type === 'percent' && val !== undefined && val !== null ? (
                          <span className="text-amber-400 font-bold">{String(val)}%</span>
                        ) : (
                          String(val ?? '—')
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}

              {/* Bottom Quick Add Row */}
              <tr>
                <td colSpan={5 + (topicId === 'dev' ? 1 : 0) + fields.length} className="p-0">
                  <form onSubmit={handleInlineCreate} className="flex items-center px-2.5 py-1.5">
                    <Plus className="w-3.5 h-3.5 text-[#787774] mr-2" />
                    <input
                      type="text"
                      placeholder="Add a new page or task..."
                      value={quickNewTitle}
                      onChange={(e) => setQuickNewTitle(e.target.value)}
                      className="bg-transparent text-xs text-[#e6e6e6] placeholder:text-[#6a6a6a] outline-none flex-1"
                    />
                  </form>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Board View (Kanban) */}
      {viewMode === 'board' && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 overflow-x-auto pb-4">
          {availableStatuses.map((col) => {
            const colTasks = processedTasks.filter((t) => t.status === col.id);

            return (
              <div
                key={col.id}
                className="bg-[#202020] rounded-lg p-2.5 border border-[#2e2e2e] flex flex-col min-h-[350px] space-y-2"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between px-1 pb-1">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: col.color }}
                    />
                    <span className="font-medium text-xs text-white">{col.label}</span>
                    <span className="text-[11px] font-mono text-[#787774]">
                      {colTasks.length}
                    </span>
                  </div>
                </div>

                {/* Cards List */}
                <div className="space-y-2 flex-1">
                  {colTasks.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => {
                        setPeekMode('center');
                        setOpenTask(t.id);
                      }}
                      className="p-3 rounded-md bg-[#282828] hover:bg-[#303030] border border-[#333333] cursor-pointer transition space-y-2 group shadow-xs"
                    >
                      <div className="text-xs font-medium text-white group-hover:text-indigo-300 transition">
                        {t.title}
                      </div>

                      <div className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-1.5">
                          {getPriorityBadge(t.priority)}
                          {t.points && (
                            <span className="text-[10px] px-1 py-0.2 rounded bg-[#202020] text-slate-300 font-mono">
                              {t.points} pts
                            </span>
                          )}
                        </div>

                        {t.assignee && (
                          <div
                            className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white shrink-0"
                            style={{ backgroundColor: colorForName(t.assignee) }}
                          >
                            {initials(t.assignee)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Add Card Button */}
                <button
                  onClick={() => {
                    const title = prompt('New task title:');
                    if (title?.trim()) {
                      create('tasks', {
                        topicId,
                        title: title.trim(),
                        status: col.id,
                        priority: 'normal',
                        tags: [],
                        fields: {},
                        comments: [],
                        order: tasks.length + 1,
                      });
                    }
                  }}
                  className="w-full py-1 text-center text-xs text-[#787774] hover:text-white hover:bg-[#282828] rounded transition flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New</span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Gallery View */}
      {viewMode === 'gallery' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {processedTasks.map((t) => (
            <div
              key={t.id}
              onClick={() => setOpenTask(t.id)}
              className="p-4 rounded-lg bg-[#202020] hover:bg-[#262626] border border-[#2e2e2e] hover:border-[#3e3e3e] cursor-pointer transition space-y-3 shadow-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  {getStatusBadge(t.status)}
                  {getPriorityBadge(t.priority)}
                </div>
                <h4 className="text-sm font-bold text-white pt-1">{t.title}</h4>
              </div>

              {t.description && (
                <p className="text-xs text-[#9b9b9b] line-clamp-2 leading-relaxed">
                  {t.description}
                </p>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-[#2a2a2a] text-xs font-mono text-[#787774]">
                <span>{t.dueDate || 'No due date'}</span>
                {t.assignee && (
                  <span className="text-[#9b9b9b]">{t.assignee}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="border border-[#2e2e2e] rounded-lg divide-y divide-[#2a2a2a] bg-[#202020]">
          {processedTasks.map((t) => (
            <div
              key={t.id}
              onClick={() => setOpenTask(t.id)}
              className="px-3 py-2 flex items-center justify-between gap-3 hover:bg-[#262626] cursor-pointer transition group"
            >
              <div className="flex items-center gap-3 truncate">
                <span className="text-xs font-medium text-[#e6e6e6] group-hover:text-white truncate">
                  {t.title}
                </span>
                {t.tags?.length > 0 && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#2a2a2a] text-[#8a8a8a] font-mono">
                    {t.tags[0]}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {getStatusBadge(t.status)}
                {t.dueDate && (
                  <span className="text-[11px] font-mono text-[#787774]">
                    {t.dueDate}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
