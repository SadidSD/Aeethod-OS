import React, { useState } from 'react';
import {
  Plus,
  Filter,
  CheckCircle2,
  Calendar,
  Layers,
  Code2,
  Tag,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useDb, useStore } from '../store';
import { DEV_STATUSES, DEV_TYPES, colorForName, initials } from '../lib/constants';
import { DevType } from '../types';

export const DevBoardView: React.FC = () => {
  const db = useDb();
  const { update, setOpenTask, setQuickAddOpen, setPeekMode } = useStore();

  const [selectedSprintId, setSelectedSprintId] = useState<string>('all');
  const [selectedEpicId, setSelectedEpicId] = useState<string>('all');
  const [selectedAssignee, setSelectedAssignee] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const devTasks = db.tasks.filter((t) => t.topicId === 'dev' && !t.parentId);

  const filteredTasks = devTasks.filter((t) => {
    if (selectedSprintId !== 'all' && t.sprintId !== selectedSprintId) return false;
    if (selectedEpicId !== 'all' && t.epicId !== selectedEpicId) return false;
    if (selectedAssignee !== 'all' && t.assignee !== selectedAssignee) return false;
    if (selectedType !== 'all' && t.type !== selectedType) return false;
    return true;
  });

  const totalPoints = filteredTasks.reduce((sum, t) => sum + (t.points || 0), 0);
  const donePoints = filteredTasks
    .filter((t) => t.status === 'done')
    .reduce((sum, t) => sum + (t.points || 0), 0);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-slide-in">
      {/* Dev Header */}
      <div className="card p-6 border-cyan-500/30 bg-gradient-to-r from-ink-900 via-cyan-950/20 to-ink-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase tracking-wider font-mono">
              Engineering Hub
            </span>
            <span className="text-xs text-slate-400">
              • 2-Week Sprints + Unified Monorepo Workflow
            </span>
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">
            Sprint Kanban Board & Engineering Backlog
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Track full-stack delivery across core inventory ledger, 0.2s camera vision scanner,
            pricing engine, and omnichannel marketplace sync.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-ink-950 border border-ink-800 text-xs font-mono font-bold text-cyan-300">
            {donePoints} / {totalPoints} Points Completed
          </div>
          <button
            onClick={() => setQuickAddOpen(true)}
            className="btn-primary text-xs py-2 px-3.5 shadow-md shadow-indigo-600/30"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Ticket</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-2.5 p-3 rounded-xl bg-ink-900 border border-ink-800 text-xs">
        <div className="flex items-center gap-1.5 text-slate-400 font-semibold mr-1">
          <Filter className="w-3.5 h-3.5 text-indigo-400" />
          <span>Filters:</span>
        </div>

        {/* Sprint Filter */}
        <select
          value={selectedSprintId}
          onChange={(e) => setSelectedSprintId(e.target.value)}
          className="input text-xs py-1 px-2.5 w-auto"
        >
          <option value="all">All Sprints</option>
          {db.sprints.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.status})
            </option>
          ))}
        </select>

        {/* Epic Filter */}
        <select
          value={selectedEpicId}
          onChange={(e) => setSelectedEpicId(e.target.value)}
          className="input text-xs py-1 px-2.5 w-auto"
        >
          <option value="all">All Epics</option>
          {db.epics.map((ep) => (
            <option key={ep.id} value={ep.id}>
              {ep.name}
            </option>
          ))}
        </select>

        {/* Assignee Filter */}
        <select
          value={selectedAssignee}
          onChange={(e) => setSelectedAssignee(e.target.value)}
          className="input text-xs py-1 px-2.5 w-auto"
        >
          <option value="all">All Engineers</option>
          {db.settings.team.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        {/* Type Filter */}
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="input text-xs py-1 px-2.5 w-auto capitalize"
        >
          <option value="all">All Types</option>
          {DEV_TYPES.map((dt) => (
            <option key={dt.id} value={dt.id}>
              {dt.label}
            </option>
          ))}
        </select>
      </div>

      {/* 6 Kanban Columns: Backlog -> Ready -> In Progress -> In Review -> QA -> Done */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 items-start">
        {DEV_STATUSES.map((col) => {
          const tasksInCol = filteredTasks.filter((t) => t.status === col.id);
          const colPoints = tasksInCol.reduce((sum, t) => sum + (t.points || 0), 0);

          return (
            <div
              key={col.id}
              className="rounded-xl bg-ink-950/80 border border-ink-800 p-3 flex flex-col space-y-3 min-h-[550px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 border-b border-ink-800">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: col.color }}
                  />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    {col.label}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-mono">
                  <span className="text-slate-400 font-bold">{tasksInCol.length}</span>
                  {colPoints > 0 && (
                    <span className="text-cyan-400 font-semibold">({colPoints}p)</span>
                  )}
                </div>
              </div>

              {/* Tasks List */}
              <div className="space-y-2.5 flex-1">
                {tasksInCol.map((task) => {
                  const epic = db.epics.find((e) => e.id === task.epicId);
                  const subtasks = db.tasks.filter((st) => st.parentId === task.id);
                  const completedSubs = subtasks.filter((st) => st.status === 'done');

                  return (
                    <div
                      key={task.id}
                      onClick={() => {
                        setPeekMode('center');
                        setOpenTask(task.id);
                      }}
                      className="p-3.5 rounded-xl bg-ink-900 border border-ink-800 hover:border-cyan-500/40 cursor-pointer transition space-y-2.5 group shadow-xs hover:shadow-md"
                    >
                      {/* Epic Tag & Type */}
                      <div className="flex items-center justify-between text-[10px]">
                        <span
                          className="px-1.5 py-0.5 rounded font-bold uppercase tracking-wider border"
                          style={{
                            backgroundColor:
                              task.type === 'bug'
                                ? '#ef444420'
                                : task.type === 'spike'
                                ? '#a855f720'
                                : '#3b82f620',
                            borderColor:
                              task.type === 'bug'
                                ? '#ef444440'
                                : task.type === 'spike'
                                ? '#a855f740'
                                : '#3b82f640',
                            color:
                              task.type === 'bug'
                                ? '#f87171'
                                : task.type === 'spike'
                                ? '#c084fc'
                                : '#60a5fa',
                          }}
                        >
                          {task.type || 'feature'}
                        </span>

                        {task.points && (
                          <span className="font-mono font-bold text-cyan-300 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
                            {task.points} pts
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <div className="text-xs font-semibold text-white group-hover:text-cyan-300 leading-snug">
                        {task.title}
                      </div>

                      {/* Epic Name */}
                      {epic && (
                        <div
                          className="text-[10px] font-medium truncate flex items-center gap-1"
                          style={{ color: epic.color }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ backgroundColor: epic.color }}
                          />
                          <span className="truncate">{epic.name}</span>
                        </div>
                      )}

                      {/* Footer: Subtasks & Assignee */}
                      <div className="flex items-center justify-between pt-1.5 border-t border-ink-850 text-[11px] text-slate-400">
                        {subtasks.length > 0 ? (
                          <span className="text-[10px] text-slate-500 font-mono">
                            {completedSubs.length}/{subtasks.length} subs
                          </span>
                        ) : (
                          <span />
                        )}

                        {task.assignee && (
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shadow-xs"
                            style={{ backgroundColor: colorForName(task.assignee) }}
                            title={task.assignee}
                          >
                            {initials(task.assignee)}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
