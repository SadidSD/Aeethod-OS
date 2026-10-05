import React, { useState } from 'react';
import {
  Plus,
  Table as TableIcon,
  KanbanSquare,
  FileText,
  Sliders,
  CheckCircle2,
  Calendar,
  User,
  Trash2,
  X,
  Search,
  Check,
  Sparkles,
  Edit2,
  Lightbulb,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useDb, useStore } from '../store';
import { emojiForTopic, OPTION_COLORS } from '../lib/constants';
import { Priority, FieldType, SelectOption } from '../types';
import { NotionPageHeader } from '../components/NotionPageHeader';
import { NotionDatabase } from '../components/NotionDatabase';

interface TopicViewProps {
  topicId: string;
}

export const TopicView: React.FC<TopicViewProps> = ({ topicId }) => {
  const db = useDb();
  const { create, update, remove, setOpenTask } = useStore();

  const topic = db.topics.find((t) => t.id === topicId);
  const tasks = db.tasks.filter((t) => t.topicId === topicId && !t.parentId);
  const docs = db.docs.filter((d) => d.topicId === topicId);
  const fields = db.fields.filter((f) => f.topicId === topicId);

  const [activeTab, setActiveTab] = useState<'database' | 'docs' | 'fields'>('database');

  // Field Creator Modal State
  const [showFieldModal, setShowFieldModal] = useState(false);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState<FieldType>('text');
  const [newFieldOptions, setNewFieldOptions] = useState<string>('');

  // Doc Editor State
  const [selectedDocId, setSelectedDocId] = useState<string | null>(docs[0]?.id || null);
  const [isEditingDoc, setIsEditingDoc] = useState(false);
  const [docTitle, setDocTitle] = useState('');
  const [docContent, setDocContent] = useState('');

  if (!topic) {
    return (
      <div className="p-8 text-center text-[#787774]">
        Topic not found.
      </div>
    );
  }

  const emoji = emojiForTopic(topic.id);

  const handleCreateField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFieldName.trim()) return;

    let options: SelectOption[] | undefined;
    if (newFieldType === 'select' && newFieldOptions.trim()) {
      options = newFieldOptions
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .map((label, idx) => ({
          id: label.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          label,
          color: OPTION_COLORS[idx % OPTION_COLORS.length],
        }));
    }

    create('fields', {
      topicId,
      name: newFieldName.trim(),
      type: newFieldType,
      order: fields.length + 1,
      options,
    });

    setShowFieldModal(false);
    setNewFieldName('');
    setNewFieldType('text');
    setNewFieldOptions('');
  };

  const activeDoc = docs.find((d) => d.id === selectedDocId) || docs[0];

  const startEditDoc = () => {
    if (!activeDoc) return;
    setDocTitle(activeDoc.title);
    setDocContent(activeDoc.content);
    setIsEditingDoc(true);
  };

  const saveDoc = () => {
    if (!activeDoc) return;
    update('docs', activeDoc.id, {
      title: docTitle.trim() || activeDoc.title,
      content: docContent,
    });
    setIsEditingDoc(false);
  };

  const createNewDoc = () => {
    const title = prompt('Doc / PRD title:');
    if (title?.trim()) {
      const created = create('docs', {
        topicId,
        title: title.trim(),
        content: `# ${title.trim()}\n\nWrite strategy, PRDs, or operational playbooks here...`,
      });
      setSelectedDocId(created.id);
      setIsEditingDoc(true);
      setDocTitle(created.title);
      setDocContent(created.content);
    }
  };

  return (
    <div className="min-h-full pb-16 bg-[#191919] select-text">
      {/* Notion Page Header (Cover, Emoji, Editable Title) */}
      <NotionPageHeader
        title={topic.name}
        emoji={emoji}
        category={`Topic #${topic.num} • ${topic.category}`}
        description={topic.description}
        onTitleChange={(newTitle) => update('topics', topic.id, { name: newTitle })}
      />

      {/* Notion Body Container */}
      <div className="max-w-5xl mx-auto px-8 pt-6 space-y-6">
        {/* Navigation Tabs (Database / Notes & PRDs / Custom Fields) */}
        <div className="flex items-center gap-1 border-b border-[#2e2e2e] pb-1 select-none">
          <button
            onClick={() => setActiveTab('database')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition ${
              activeTab === 'database'
                ? 'bg-[#282828] text-white shadow-xs'
                : 'text-[#9b9b9b] hover:text-white hover:bg-[#222222]'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5 text-indigo-400" />
            <span>Database ({tasks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('docs')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition ${
              activeTab === 'docs'
                ? 'bg-[#282828] text-white shadow-xs'
                : 'text-[#9b9b9b] hover:text-white hover:bg-[#222222]'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span>Notes & PRDs ({docs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('fields')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition ${
              activeTab === 'fields'
                ? 'bg-[#282828] text-white shadow-xs'
                : 'text-[#9b9b9b] hover:text-white hover:bg-[#222222]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>Properties ({fields.length})</span>
          </button>
        </div>

        {/* ============================================================== */}
        {/* TAB 1: NOTION MULTI-VIEW DATABASE */}
        {/* ============================================================== */}
        {activeTab === 'database' && (
          <div className="space-y-4">
            <NotionDatabase
              topicId={topicId}
              tasks={tasks}
              fields={fields}
              defaultView={topicId === 'economics' ? 'gallery' : 'table'}
            />
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: NOTION DOCUMENT & PRDs */}
        {/* ============================================================== */}
        {activeTab === 'docs' && (
          <div className="space-y-6">
            {/* Docs Selector / Tabs */}
            <div className="flex items-center justify-between gap-3 border-b border-[#2e2e2e] pb-2">
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {docs.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => {
                      setSelectedDocId(d.id);
                      setIsEditingDoc(false);
                    }}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition whitespace-nowrap ${
                      (activeDoc?.id === d.id)
                        ? 'bg-[#2c2c2c] text-white'
                        : 'text-[#9b9b9b] hover:text-white hover:bg-[#222222]'
                    }`}
                  >
                    📄 {d.title}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={createNewDoc}
                  className="btn-secondary text-xs py-1 px-2.5 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Page</span>
                </button>

                {activeDoc && !isEditingDoc && (
                  <button
                    onClick={startEditDoc}
                    className="btn-secondary text-xs py-1 px-2.5 flex items-center gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                )}

                {activeDoc && isEditingDoc && (
                  <button
                    onClick={saveDoc}
                    className="btn-primary text-xs py-1 px-3 flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Done</span>
                  </button>
                )}
              </div>
            </div>

            {/* Doc Body */}
            {activeDoc ? (
              <div className="space-y-4">
                {isEditingDoc ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={docTitle}
                      onChange={(e) => setDocTitle(e.target.value)}
                      className="text-2xl font-bold text-white bg-transparent border-b border-[#333333] outline-none w-full py-1"
                    />

                    <textarea
                      rows={18}
                      value={docContent}
                      onChange={(e) => setDocContent(e.target.value)}
                      className="w-full bg-[#1c1c1c] border border-[#2e2e2e] rounded-lg p-4 text-xs font-mono text-[#e6e6e6] leading-relaxed outline-none focus:border-[#444444]"
                    />
                  </div>
                ) : (
                  <div className="p-6 rounded-xl bg-[#202020] border border-[#2a2a2a] md">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {activeDoc.content}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-12 text-center text-[#787774] card">
                No documents found. Click "New Page" to create one.
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: CUSTOM PROPERTIES SCHEMA (NO LIMITS) */}
        {/* ============================================================== */}
        {activeTab === 'fields' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Database Property Schema</h3>
                <p className="text-xs text-[#9b9b9b]">
                  Unlimited custom fields with zero plan limits or paywalls.
                </p>
              </div>

              <button
                onClick={() => setShowFieldModal(true)}
                className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Property</span>
              </button>
            </div>

            <div className="border border-[#2e2e2e] rounded-lg divide-y divide-[#2a2a2a] bg-[#202020]">
              {fields.map((f) => (
                <div key={f.id} className="p-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#2a2a2a] text-indigo-300 border border-[#333333]">
                      {f.type}
                    </span>
                    <span className="font-semibold text-white">{f.name}</span>
                    {f.options && (
                      <span className="text-[11px] text-[#787774]">
                        ({f.options.length} options)
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      if (confirm(`Delete property "${f.name}"?`)) remove('fields', f.id);
                    }}
                    className="p-1 text-[#787774] hover:text-rose-400 rounded transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Field Creator Modal */}
      {showFieldModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="card w-full max-w-md p-6 space-y-4 shadow-2xl border-[#3a3a3a]">
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <span>Create Custom Property</span>
            </h3>

            <form onSubmit={handleCreateField} className="space-y-4 text-xs">
              <div>
                <label className="text-[#9b9b9b] font-medium block mb-1">Property Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Estimated WTP"
                  value={newFieldName}
                  onChange={(e) => setNewFieldName(e.target.value)}
                  className="input-field text-xs"
                />
              </div>

              <div>
                <label className="text-[#9b9b9b] font-medium block mb-1">Type</label>
                <select
                  value={newFieldType}
                  onChange={(e) => setNewFieldType(e.target.value as FieldType)}
                  className="input-field text-xs"
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="currency">Currency ($)</option>
                  <option value="percent">Percentage (%)</option>
                  <option value="select">Select (Dropdown)</option>
                  <option value="date">Date</option>
                  <option value="checkbox">Checkbox</option>
                  <option value="url">URL</option>
                </select>
              </div>

              {newFieldType === 'select' && (
                <div>
                  <label className="text-[#9b9b9b] font-medium block mb-1">
                    Select Options (comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="High, Medium, Low"
                    value={newFieldOptions}
                    onChange={(e) => setNewFieldOptions(e.target.value)}
                    className="input-field text-xs"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-[#2e2e2e]">
                <button
                  type="button"
                  onClick={() => setShowFieldModal(false)}
                  className="btn-ghost text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs py-1.5 px-3">
                  Create Property
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
