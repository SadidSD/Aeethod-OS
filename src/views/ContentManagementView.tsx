import React, { useState, useMemo } from 'react';
import {
  VideoRecord,
  ContentTopic,
  ReelFormat,
  VideoStatus,
  TOPIC_DEFINITIONS,
  FORMAT_DEFINITIONS,
  INITIAL_VIDEO_RECORDS
} from '../data/contentData';
import { useStore } from '../store';
import {
  Clapperboard,
  Plus,
  Search,
  Grid,
  List,
  ChevronRight,
  ChevronDown,
  Trash2,
  BookOpen,
  PieChart,
  Target,
  Sparkles,
  Layers,
  ArrowUpRight,
  SlidersHorizontal,
  X,
  ExternalLink,
  Flame,
  CheckCircle2,
  Clock,
  Calendar,
  BarChart3
} from 'lucide-react';

const TOPIC_LIST: ContentTopic[] = [
  'Shop Problem',
  'Education for Resellers and Shop Owners',
  'Controversy and Opinion',
  'Release Content',
  'Price Analysis and Prediction'
];

const FORMAT_LIST: ReelFormat[] = [
  'Price Breakdown and Analysis',
  'Looping',
  'Myth Blast',
  'Prevention',
  'Teardown and Challenge'
];

const STATUS_LIST: VideoStatus[] = [
  'Scripting',
  'Recording',
  'Editing',
  'Scheduled',
  'Uploaded'
];

// Topic Config
const TOPIC_CONFIG: Record<ContentTopic, { label: string; dot: string; text: string; bg: string; border: string }> = {
  'Shop Problem': {
    label: 'Shop Problem',
    dot: 'bg-rose-500',
    text: 'text-rose-600 dark:text-rose-400',
    bg: 'bg-rose-50 dark:bg-rose-500/10',
    border: 'border-rose-200 dark:border-rose-500/20'
  },
  'Education for Resellers and Shop Owners': {
    label: 'Education',
    dot: 'bg-sky-500',
    text: 'text-sky-600 dark:text-sky-400',
    bg: 'bg-sky-50 dark:bg-sky-500/10',
    border: 'border-sky-200 dark:border-sky-500/20'
  },
  'Controversy and Opinion': {
    label: 'Controversy',
    dot: 'bg-amber-500',
    text: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-500/10',
    border: 'border-amber-200 dark:border-amber-500/20'
  },
  'Release Content': {
    label: 'Release Drop',
    dot: 'bg-emerald-500',
    text: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    border: 'border-emerald-200 dark:border-emerald-500/20'
  },
  'Price Analysis and Prediction': {
    label: 'Price Analysis',
    dot: 'bg-indigo-500',
    text: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-indigo-50 dark:bg-indigo-500/10',
    border: 'border-indigo-200 dark:border-indigo-500/20'
  }
};

const STAGE_CONFIG: Record<VideoStatus, { dot: string; badge: string; text: string }> = {
  Scripting: { dot: 'bg-amber-400', badge: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20', text: 'text-amber-600 dark:text-amber-400' },
  Recording: { dot: 'bg-rose-400', badge: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/20', text: 'text-rose-600 dark:text-rose-400' },
  Editing: { dot: 'bg-purple-400', badge: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-300 dark:border-purple-500/20', text: 'text-purple-600 dark:text-purple-400' },
  Scheduled: { dot: 'bg-sky-400', badge: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:border-sky-500/20', text: 'text-sky-600 dark:text-sky-400' },
  Uploaded: { dot: 'bg-emerald-400', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20', text: 'text-emerald-600 dark:text-emerald-400' }
};

export const ContentManagementView: React.FC = () => {
  const { theme } = useStore();
  const isLight = theme === 'light';

  // Navigation
  const [activeTab, setActiveTab] = useState<'strategy' | 'sadid' | 'anika' | 'matrix'>('anika');

  // Video State
  const [videos, setVideos] = useState<VideoRecord[]>(INITIAL_VIDEO_RECORDS);

  // Filters
  const [topicFilter, setTopicFilter] = useState<string>('all');
  const [formatFilter, setFormatFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'vertical' | 'table'>('vertical');

  // Expanded card tracking
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  const toggleCard = (id: string) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Add modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newVideoCreator, setNewVideoCreator] = useState<'Sadid' | 'Anika'>('Sadid');
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoTopic, setNewVideoTopic] = useState<ContentTopic>('Shop Problem');
  const [newVideoFormat, setNewVideoFormat] = useState<ReelFormat>('Price Breakdown and Analysis');
  const [newVideoStatus, setNewVideoStatus] = useState<VideoStatus>('Scripting');
  const [newVideoHook, setNewVideoHook] = useState('');
  const [newVideoDate, setNewVideoDate] = useState('');
  const [newVideoNotes, setNewVideoNotes] = useState('');

  const updateVideo = (id: string, updates: Partial<VideoRecord>) => {
    setVideos((prev) => prev.map((v) => (v.id === id ? { ...v, ...updates } : v)));
  };

  const deleteVideo = (id: string) => {
    setVideos((prev) => prev.filter((v) => v.id !== id));
  };

  const handleCreateVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideoTitle.trim()) return;

    const newRecord: VideoRecord = {
      id: `vid-${Date.now()}`,
      creator: newVideoCreator,
      title: newVideoTitle.trim(),
      topic: newVideoTopic,
      format: newVideoFormat,
      status: newVideoStatus,
      hook: newVideoHook.trim() || 'Attention-grabbing hook...',
      publishDate: newVideoDate || undefined,
      notes: newVideoNotes || undefined
    };

    setVideos((prev) => [newRecord, ...prev]);
    setIsAddModalOpen(false);
    setNewVideoTitle('');
    setNewVideoHook('');
    setNewVideoDate('');
    setNewVideoNotes('');
  };

  // Matrix Analytics
  const analytics = useMemo(() => {
    const total = videos.length;
    const sadidTotal = videos.filter((v) => v.creator === 'Sadid').length;
    const anikaTotal = videos.filter((v) => v.creator === 'Anika').length;

    const topicCounts: Record<ContentTopic, { total: number; sadid: number; anika: number }> = {
      'Shop Problem': { total: 0, sadid: 0, anika: 0 },
      'Education for Resellers and Shop Owners': { total: 0, sadid: 0, anika: 0 },
      'Controversy and Opinion': { total: 0, sadid: 0, anika: 0 },
      'Release Content': { total: 0, sadid: 0, anika: 0 },
      'Price Analysis and Prediction': { total: 0, sadid: 0, anika: 0 }
    };

    const formatCounts: Record<ReelFormat, { total: number; sadid: number; anika: number }> = {
      'Price Breakdown and Analysis': { total: 0, sadid: 0, anika: 0 },
      Looping: { total: 0, sadid: 0, anika: 0 },
      'Myth Blast': { total: 0, sadid: 0, anika: 0 },
      Prevention: { total: 0, sadid: 0, anika: 0 },
      'Teardown and Challenge': { total: 0, sadid: 0, anika: 0 }
    };

    const combinedMatrix: Record<ContentTopic, Record<ReelFormat, number>> = {
      'Shop Problem': { 'Price Breakdown and Analysis': 0, Looping: 0, 'Myth Blast': 0, Prevention: 0, 'Teardown and Challenge': 0 },
      'Education for Resellers and Shop Owners': { 'Price Breakdown and Analysis': 0, Looping: 0, 'Myth Blast': 0, Prevention: 0, 'Teardown and Challenge': 0 },
      'Controversy and Opinion': { 'Price Breakdown and Analysis': 0, Looping: 0, 'Myth Blast': 0, Prevention: 0, 'Teardown and Challenge': 0 },
      'Release Content': { 'Price Breakdown and Analysis': 0, Looping: 0, 'Myth Blast': 0, Prevention: 0, 'Teardown and Challenge': 0 },
      'Price Analysis and Prediction': { 'Price Breakdown and Analysis': 0, Looping: 0, 'Myth Blast': 0, Prevention: 0, 'Teardown and Challenge': 0 }
    };

    const statusCounts: Record<VideoStatus, number> = {
      Scripting: 0,
      Recording: 0,
      Editing: 0,
      Scheduled: 0,
      Uploaded: 0
    };

    videos.forEach((v) => {
      if (topicCounts[v.topic]) {
        topicCounts[v.topic].total += 1;
        if (v.creator === 'Sadid') topicCounts[v.topic].sadid += 1;
        if (v.creator === 'Anika') topicCounts[v.topic].anika += 1;
      }
      if (formatCounts[v.format]) {
        formatCounts[v.format].total += 1;
        if (v.creator === 'Sadid') formatCounts[v.format].sadid += 1;
        if (v.creator === 'Anika') formatCounts[v.format].anika += 1;
      }
      if (combinedMatrix[v.topic] && combinedMatrix[v.topic][v.format] !== undefined) {
        combinedMatrix[v.topic][v.format] += 1;
      }
      if (statusCounts[v.status] !== undefined) {
        statusCounts[v.status] += 1;
      }
    });

    return { total, sadidTotal, anikaTotal, topicCounts, formatCounts, combinedMatrix, statusCounts };
  }, [videos]);

  // Render Creator Content
  const renderCreatorContent = (creator: 'Sadid' | 'Anika') => {
    const isSadid = creator === 'Sadid';
    const creatorVideos = videos.filter((v) => {
      if (v.creator !== creator) return false;
      if (topicFilter !== 'all' && v.topic !== topicFilter) return false;
      if (formatFilter !== 'all' && v.format !== formatFilter) return false;
      if (statusFilter !== 'all' && v.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          v.title.toLowerCase().includes(q) ||
          v.hook.toLowerCase().includes(q) ||
          (v.notes && v.notes.toLowerCase().includes(q))
        );
      }
      return true;
    });

    return (
      <div className="space-y-6">
        {/* Creator Header Strip */}
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b ${isLight ? 'border-[#e9e9e7]' : 'border-[#252525]'}`}>
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-base ${
                isSadid
                  ? 'bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-sm shadow-indigo-500/20'
                  : 'bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-sm shadow-emerald-500/20'
              }`}
            >
              {creator[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className={`text-base font-semibold tracking-tight ${isLight ? 'text-[#1a1a1a]' : 'text-white'}`}>{creator}'s Studio</h2>
                <span className={`text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  {isSadid ? '@sadid_aeethod' : '@anika_tcgops'}
                </span>
              </div>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                {isSadid
                  ? 'Financial auditing, unit economics & zero-latency POS inventory'
                  : 'Retail floor POV, card inspection & trade-in counter workflows'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className={`text-xs font-mono mr-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              <strong className={isLight ? 'text-black' : 'text-white'}>{creatorVideos.length}</strong> videos
            </span>
            <button
              onClick={() => {
                setNewVideoCreator(creator);
                setIsAddModalOpen(true);
              }}
              className={`text-xs font-medium px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition text-white shadow-sm ${
                isSadid ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-emerald-600 hover:bg-emerald-500'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Reel</span>
            </button>
          </div>
        </div>

        {/* Minimal Clean Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter videos or hook..."
                className={`border rounded-lg pl-8 pr-3 py-1.5 text-xs focus:outline-none transition w-52 ${
                  isLight
                    ? 'bg-white border-[#e3e2de] text-slate-900 placeholder:text-slate-400 focus:border-indigo-500'
                    : 'bg-[#202020] border-[#2a2a2a] text-slate-200 placeholder:text-slate-500 focus:border-indigo-500/50'
                }`}
              />
            </div>

            <select
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value)}
              className={`border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none ${
                isLight
                  ? 'bg-white border-[#e3e2de] text-slate-800'
                  : 'bg-[#202020] border-[#2a2a2a] text-slate-300'
              }`}
            >
              <option value="all">All Topics ({TOPIC_LIST.length})</option>
              {TOPIC_LIST.map((t) => (
                <option key={t} value={t}>
                  {TOPIC_CONFIG[t].label}
                </option>
              ))}
            </select>

            <select
              value={formatFilter}
              onChange={(e) => setFormatFilter(e.target.value)}
              className={`border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none ${
                isLight
                  ? 'bg-white border-[#e3e2de] text-slate-800'
                  : 'bg-[#202020] border-[#2a2a2a] text-slate-300'
              }`}
            >
              <option value="all">All Formats ({FORMAT_LIST.length})</option>
              {FORMAT_LIST.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          {/* View mode toggle */}
          <div className={`flex items-center p-1 rounded-lg border ${isLight ? 'bg-white border-[#e3e2de]' : 'bg-[#202020] border-[#2a2a2a]'}`}>
            <button
              onClick={() => setViewMode('vertical')}
              className={`px-2.5 py-1 rounded text-xs flex items-center gap-1.5 transition ${
                viewMode === 'vertical'
                  ? isLight
                    ? 'bg-[#f0f0ed] text-black font-semibold shadow-xs'
                    : 'bg-[#2d2d2d] text-white font-medium shadow-sm'
                  : isLight
                  ? 'text-slate-500 hover:text-black'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Stages</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1 rounded text-xs flex items-center gap-1.5 transition ${
                viewMode === 'table'
                  ? isLight
                    ? 'bg-[#f0f0ed] text-black font-semibold shadow-xs'
                    : 'bg-[#2d2d2d] text-white font-medium shadow-sm'
                  : isLight
                  ? 'text-slate-500 hover:text-black'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>
        </div>

        {/* 1. VERTICAL STAGES PIPELINE (Clean White / Notion Ivory) */}
        {viewMode === 'vertical' && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 items-start">
            {STATUS_LIST.map((stage) => {
              const stageVideos = creatorVideos.filter((v) => v.status === stage);
              const stageMeta = STAGE_CONFIG[stage];

              return (
                <div
                  key={stage}
                  className={`rounded-xl border flex flex-col min-h-[580px] overflow-hidden transition ${
                    isLight
                      ? 'bg-[#faf9f6] border-[#e9e9e7] shadow-xs'
                      : 'bg-[#1f1f1f] border-[#282828]'
                  }`}
                >
                  {/* Clean Column Header */}
                  <div
                    className={`px-3.5 py-3 border-b flex items-center justify-between ${
                      isLight
                        ? 'bg-[#f4f2ee] border-[#e9e9e7]'
                        : 'bg-[#222222]/50 border-[#282828]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${stageMeta.dot}`} />
                      <span className={`text-xs font-semibold tracking-tight ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                        {stage}
                      </span>
                    </div>
                    <span
                      className={`text-[11px] font-mono font-medium px-1.5 py-0.2 rounded-full ${
                        isLight ? 'bg-white text-slate-600 border border-[#e3e2de]' : 'text-slate-400'
                      }`}
                    >
                      {stageVideos.length}
                    </span>
                  </div>

                  {/* Column Cards */}
                  <div className="p-2.5 space-y-2.5 flex-1 overflow-y-auto">
                    {stageVideos.map((vid) => {
                      const topicMeta = TOPIC_CONFIG[vid.topic];
                      const isExpanded = expandedCards[vid.id];

                      return (
                        <div
                          key={vid.id}
                          className={`rounded-lg p-3 transition space-y-2.5 group border ${
                            isLight
                              ? 'bg-white hover:bg-[#fcfbfa] border-[#e9e9e7] hover:border-[#dcdbd7] shadow-xs'
                              : 'bg-[#242424] hover:bg-[#272727] border-[#2e2e2e] hover:border-[#383838] shadow-sm'
                          }`}
                        >
                          {/* Badges strip */}
                          <div className="flex items-center justify-between gap-1 text-[10px]">
                            <span
                              className={`px-2 py-0.5 rounded-full font-medium ${topicMeta.bg} ${topicMeta.text} border ${topicMeta.border} truncate max-w-[140px]`}
                              title={vid.topic}
                            >
                              {topicMeta.label}
                            </span>
                            <span className={`font-mono text-[10px] shrink-0 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                              {vid.format.split(' ')[0]}
                            </span>
                          </div>

                          {/* Editable Title */}
                          <input
                            type="text"
                            value={vid.title}
                            onChange={(e) => updateVideo(vid.id, { title: e.target.value })}
                            className={`w-full text-xs font-semibold bg-transparent border-0 px-1 py-0.5 rounded outline-none transition leading-snug ${
                              isLight
                                ? 'text-[#1a1a1a] hover:bg-[#f4f2ee] focus:bg-[#f4f2ee]'
                                : 'text-slate-100 hover:bg-[#2d2d2d] focus:bg-[#2d2d2d]'
                            }`}
                          />

                          {/* Hook preview */}
                          <p className={`text-[11px] italic line-clamp-2 px-1 leading-relaxed ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                            "{vid.hook}"
                          </p>

                          {/* Clean Quick Footer with details disclosure */}
                          <div className={`pt-2 border-t flex items-center justify-between text-[11px] ${isLight ? 'border-[#f0eee9]' : 'border-[#2d2d2d]'}`}>
                            <button
                              type="button"
                              onClick={() => toggleCard(vid.id)}
                              className={`text-[11px] flex items-center gap-1 font-mono transition ${
                                isLight ? 'text-slate-500 hover:text-black' : 'text-slate-400 hover:text-slate-200'
                              }`}
                            >
                              <span>{isExpanded ? 'Less' : 'Details'}</span>
                              <ChevronDown
                                className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                              />
                            </button>

                            <div className="flex items-center gap-1.5">
                              {/* Advance Stage button */}
                              {stage !== 'Uploaded' && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const nextIdx = STATUS_LIST.indexOf(vid.status) + 1;
                                    if (nextIdx < STATUS_LIST.length) {
                                      updateVideo(vid.id, { status: STATUS_LIST[nextIdx] });
                                    }
                                  }}
                                  className={`text-[10px] font-medium px-2 py-0.5 rounded transition flex items-center gap-0.5 ${
                                    isLight
                                      ? 'text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100'
                                      : 'text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10'
                                  }`}
                                  title="Advance to next stage"
                                >
                                  <span>Advance</span>
                                  <ChevronRight className="w-3 h-3" />
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => deleteVideo(vid.id)}
                                className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                                title="Delete"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          {/* Expanded Card Details (Clean Settings Pane) */}
                          {isExpanded && (
                            <div className={`pt-2.5 border-t space-y-2 text-[11px] font-mono animate-fade-in ${isLight ? 'border-[#f0eee9]' : 'border-[#2d2d2d]'}`}>
                              <div className="space-y-1">
                                <label className={`text-[10px] uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Topic Pillar</label>
                                <select
                                  value={vid.topic}
                                  onChange={(e) => updateVideo(vid.id, { topic: e.target.value as ContentTopic })}
                                  className={`w-full rounded px-2 py-1 text-[11px] border ${
                                    isLight ? 'bg-[#f7f6f3] border-[#e3e2de] text-slate-800' : 'bg-[#1e1e1e] border-[#333] text-slate-200'
                                  }`}
                                >
                                  {TOPIC_LIST.map((t) => (
                                    <option key={t} value={t}>
                                      {t}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div className="space-y-1">
                                <label className={`text-[10px] uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Format</label>
                                <select
                                  value={vid.format}
                                  onChange={(e) => updateVideo(vid.id, { format: e.target.value as ReelFormat })}
                                  className={`w-full rounded px-2 py-1 text-[11px] border ${
                                    isLight ? 'bg-[#f7f6f3] border-[#e3e2de] text-slate-800' : 'bg-[#1e1e1e] border-[#333] text-slate-200'
                                  }`}
                                >
                                  {FORMAT_LIST.map((f) => (
                                    <option key={f} value={f}>
                                      {f}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div className="space-y-1">
                                <label className={`text-[10px] uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Stage</label>
                                <select
                                  value={vid.status}
                                  onChange={(e) => updateVideo(vid.id, { status: e.target.value as VideoStatus })}
                                  className={`w-full rounded px-2 py-1 text-[11px] border ${
                                    isLight ? 'bg-[#f7f6f3] border-[#e3e2de] text-slate-800' : 'bg-[#1e1e1e] border-[#333] text-slate-200'
                                  }`}
                                >
                                  {STATUS_LIST.map((s) => (
                                    <option key={s} value={s}>
                                      {s}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div className="space-y-1">
                                <label className={`text-[10px] uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Date</label>
                                <input
                                  type="date"
                                  value={vid.publishDate || ''}
                                  onChange={(e) => updateVideo(vid.id, { publishDate: e.target.value || undefined })}
                                  className={`w-full rounded px-2 py-1 text-[11px] border ${
                                    isLight ? 'bg-[#f7f6f3] border-[#e3e2de] text-slate-800' : 'bg-[#1e1e1e] border-[#333] text-slate-200'
                                  }`}
                                />
                              </div>

                              {vid.views && (
                                <div className={`p-2 rounded text-[10px] space-y-0.5 border ${
                                  isLight ? 'bg-[#f9f8f5] border-[#e9e9e7] text-slate-700' : 'bg-[#1e1e1e] border-[#333] text-slate-300'
                                }`}>
                                  <div className="font-bold text-emerald-600 dark:text-emerald-400">{vid.views.toLocaleString()} views</div>
                                  <div className={isLight ? 'text-slate-500' : 'text-slate-400'}>
                                    ❤️ {vid.likes} • 📤 {vid.shares} shares • 🔖 {vid.saves} saves
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {stageVideos.length === 0 && (
                      <div
                        className={`h-32 rounded-lg border border-dashed flex items-center justify-center text-[11px] font-mono ${
                          isLight
                            ? 'bg-white/60 border-[#e3e2de] text-slate-400'
                            : 'border-[#2a2a2a] text-slate-500'
                        }`}
                      >
                        No videos
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 2. COMPACT TABLE SPREADSHEET */}
        {viewMode === 'table' && (
          <div className={`rounded-xl border overflow-hidden ${isLight ? 'bg-white border-[#e9e9e7]' : 'bg-[#1f1f1f] border-[#282828]'}`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className={`border-b font-mono text-[11px] ${
                    isLight ? 'bg-[#f7f6f3] border-[#e9e9e7] text-slate-600' : 'bg-[#222222]/60 border-[#282828] text-slate-400'
                  }`}>
                    <th className="py-2.5 px-3.5 font-medium">Title & Hook</th>
                    <th className="py-2.5 px-3 font-medium">Topic</th>
                    <th className="py-2.5 px-3 font-medium">Format</th>
                    <th className="py-2.5 px-3 font-medium">Stage</th>
                    <th className="py-2.5 px-3 font-medium">Date</th>
                    <th className="py-2.5 px-3 font-medium">Metrics</th>
                    <th className="py-2.5 px-3 text-right font-medium"></th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isLight ? 'divide-[#f0eee9]' : 'divide-[#282828]'}`}>
                  {creatorVideos.map((vid) => {
                    const topicMeta = TOPIC_CONFIG[vid.topic];
                    const stageMeta = STAGE_CONFIG[vid.status];

                    return (
                      <tr key={vid.id} className={`transition group ${isLight ? 'hover:bg-[#faf9f6]' : 'hover:bg-[#252525]/50'}`}>
                        <td className="py-2.5 px-3.5 max-w-sm">
                          <input
                            type="text"
                            value={vid.title}
                            onChange={(e) => updateVideo(vid.id, { title: e.target.value })}
                            className={`w-full font-medium bg-transparent border-0 px-1 py-0.5 rounded text-xs outline-none ${
                              isLight ? 'text-[#1a1a1a] hover:bg-[#f0f0ed]' : 'text-slate-200 hover:bg-[#2a2a2a]'
                            }`}
                          />
                          <div className={`text-[11px] italic px-1 line-clamp-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                            "{vid.hook}"
                          </div>
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${topicMeta.bg} ${topicMeta.text}`}>
                            {topicMeta.label}
                          </span>
                        </td>
                        <td className={`py-2.5 px-3 whitespace-nowrap font-mono text-[11px] ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                          {vid.format}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-medium border ${stageMeta.badge}`}>
                            {vid.status}
                          </span>
                        </td>
                        <td className={`py-2.5 px-3 whitespace-nowrap font-mono text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                          {vid.publishDate || '—'}
                        </td>
                        <td className={`py-2.5 px-3 whitespace-nowrap font-mono text-[11px] ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                          {vid.views ? `${vid.views.toLocaleString()} views` : '—'}
                        </td>
                        <td className="py-2.5 px-3 text-right whitespace-nowrap">
                          <button
                            onClick={() => deleteVideo(vid.id)}
                            className="p-1 rounded text-slate-400 hover:text-rose-600 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in select-text min-h-screen ${isLight ? 'bg-white text-[#37352f]' : 'bg-[#191919] text-[#e6e6e6]'}`}>
      {/* Top Header Strip */}
      <div className={`space-y-4 pb-6 border-b ${isLight ? 'border-[#e9e9e7]' : 'border-[#252525]'}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`text-[11px] font-mono font-medium px-2 py-0.5 rounded border ${
                isLight ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20'
              }`}>
                Instagram Media Studio
              </span>
              <span className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>TCG Audience Acquisition Engine</span>
            </div>
            <h1 className={`text-xl md:text-2xl font-bold tracking-tight flex items-center gap-2.5 ${isLight ? 'text-[#1a1a1a]' : 'text-white'}`}>
              <Clapperboard className="w-5 h-5 text-indigo-500" />
              <span>Content Management & Video Pipeline</span>
            </h1>
            <p className={`text-xs mt-1 max-w-2xl leading-relaxed ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              5 core industry topics &amp; 5 algorithmic retention formulas. Track production pipelines from script to upload.
            </p>
          </div>

          {/* Clean Metric Badges */}
          <div className="flex items-center gap-2 font-mono">
            <div className={`border rounded-lg px-3 py-2 text-center ${isLight ? 'bg-[#faf9f6] border-[#e9e9e7]' : 'bg-[#202020] border-[#2a2a2a]'}`}>
              <div className={`text-[10px] uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Total Reels</div>
              <div className={`text-sm font-semibold mt-0.5 ${isLight ? 'text-black' : 'text-white'}`}>{analytics.total}</div>
            </div>
            <div className={`border rounded-lg px-3 py-2 text-center ${isLight ? 'bg-[#faf9f6] border-[#e9e9e7]' : 'bg-[#202020] border-[#2a2a2a]'}`}>
              <div className="text-[10px] text-indigo-600 dark:text-indigo-400 uppercase">Sadid</div>
              <div className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">{analytics.sadidTotal}</div>
            </div>
            <div className={`border rounded-lg px-3 py-2 text-center ${isLight ? 'bg-[#faf9f6] border-[#e9e9e7]' : 'bg-[#202020] border-[#2a2a2a]'}`}>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase">Anika</div>
              <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">{analytics.anikaTotal}</div>
            </div>
          </div>
        </div>

        {/* Minimal Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <button
            onClick={() => setActiveTab('strategy')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
              activeTab === 'strategy'
                ? 'bg-indigo-600 text-white shadow-sm'
                : isLight
                ? 'bg-[#f7f6f3] hover:bg-[#efeeea] text-slate-700 border border-[#e9e9e7]'
                : 'bg-[#202020] hover:bg-[#262626] text-slate-300 border border-[#2a2a2a]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Topics &amp; Formats Framework</span>
          </button>

          <button
            onClick={() => setActiveTab('sadid')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
              activeTab === 'sadid'
                ? 'bg-indigo-600 text-white shadow-sm'
                : isLight
                ? 'bg-[#f7f6f3] hover:bg-[#efeeea] text-slate-700 border border-[#e9e9e7]'
                : 'bg-[#202020] hover:bg-[#262626] text-slate-300 border border-[#2a2a2a]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            <span>Sadid's Content ({analytics.sadidTotal})</span>
          </button>

          <button
            onClick={() => setActiveTab('anika')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
              activeTab === 'anika'
                ? 'bg-emerald-600 text-white shadow-sm'
                : isLight
                ? 'bg-[#f7f6f3] hover:bg-[#efeeea] text-slate-700 border border-[#e9e9e7]'
                : 'bg-[#202020] hover:bg-[#262626] text-slate-300 border border-[#2a2a2a]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Anika's Content ({analytics.anikaTotal})</span>
          </button>

          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
              activeTab === 'matrix'
                ? 'bg-purple-600 text-white shadow-sm'
                : isLight
                ? 'bg-[#f7f6f3] hover:bg-[#efeeea] text-slate-700 border border-[#e9e9e7]'
                : 'bg-[#202020] hover:bg-[#262626] text-slate-300 border border-[#2a2a2a]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Matrix &amp; Analytics</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: TOPICS & FORMATS STRATEGY GUIDE                                   */}
      {/* ========================================================================= */}
      {activeTab === 'strategy' && (
        <div className="space-y-8 animate-fade-in">
          {/* 5 Content Topics */}
          <div className="space-y-4">
            <div>
              <h2 className={`text-sm font-semibold tracking-tight flex items-center gap-2 ${isLight ? 'text-[#1a1a1a]' : 'text-white'}`}>
                <Target className="w-4 h-4 text-indigo-500" />
                <span>The 5 Core TCG Content Topics</span>
              </h2>
              <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Strategic topics that attract collectors while directly engaging store owners and resellers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {TOPIC_LIST.map((topicKey) => {
                const topic = TOPIC_DEFINITIONS[topicKey];
                const conf = TOPIC_CONFIG[topicKey];

                return (
                  <div
                    key={topicKey}
                    className={`rounded-xl border p-4 flex flex-col justify-between space-y-3 transition ${
                      isLight
                        ? 'bg-[#faf9f6] border-[#e9e9e7] hover:border-[#dcdbd7]'
                        : 'bg-[#1f1f1f] border-[#282828] hover:border-[#383838]'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${conf.bg} ${conf.text} border ${conf.border}`}>
                          {topic.title}
                        </span>
                        <span className={`text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                          {analytics.topicCounts[topicKey].total} in pipeline
                        </span>
                      </div>
                      <p className={`text-xs leading-relaxed font-sans ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>{topic.description}</p>
                    </div>

                    <div className={`pt-2.5 border-t space-y-2 text-[11px] ${isLight ? 'border-[#e9e9e7]' : 'border-[#282828]'}`}>
                      <div>
                        <span className={`font-mono text-[10px] uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Audience:</span>
                        <p className={`font-medium ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>{topic.targetAudience}</p>
                      </div>
                      <div>
                        <span className={`font-mono text-[10px] uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Example Angles:</span>
                        <ul className={`space-y-1 mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                          {topic.angleExamples.map((ex, i) => (
                            <li key={i} className="line-clamp-1 italic text-[11px]">
                              • "{ex}"
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 5 Algorithmic Reel Formats */}
          <div className={`space-y-4 pt-4 border-t ${isLight ? 'border-[#e9e9e7]' : 'border-[#252525]'}`}>
            <div>
              <h2 className={`text-sm font-semibold tracking-tight flex items-center gap-2 ${isLight ? 'text-[#1a1a1a]' : 'text-white'}`}>
                <Flame className="w-4 h-4 text-amber-500" />
                <span>The 5 Algorithmic Reel Formats (Script Formulas)</span>
              </h2>
              <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Structural timelines designed to maximize Watch Time, DM Shares, and Loop Completion.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
              {FORMAT_LIST.map((formatKey) => {
                const fmt = FORMAT_DEFINITIONS[formatKey];
                return (
                  <div
                    key={formatKey}
                    className={`rounded-xl border p-4 space-y-3 transition ${
                      isLight
                        ? 'bg-[#faf9f6] border-[#e9e9e7] hover:border-[#dcdbd7]'
                        : 'bg-[#1f1f1f] border-[#282828] hover:border-[#383838]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h3 className={`text-sm font-semibold ${isLight ? 'text-[#1a1a1a]' : 'text-white'}`}>{fmt.title}</h3>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${isLight ? 'bg-white border border-[#e3e2de] text-slate-700' : 'bg-[#282828] text-slate-300'}`}>
                          {fmt.idealLength}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400">
                        Fit: {fmt.bestFitCreator}
                      </span>
                    </div>

                    <p className={`text-xs leading-relaxed font-sans ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>{fmt.description}</p>

                    <div className={`p-2 rounded text-[11px] font-mono border ${
                      isLight
                        ? 'bg-indigo-50 border-indigo-100 text-indigo-800'
                        : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300'
                    }`}>
                      ⚡ <strong>Trigger:</strong> {fmt.retentionTrigger}
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <span className={`text-[10px] font-mono uppercase block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        Timeline breakdown:
                      </span>
                      <div className="space-y-1 font-mono text-[11px]">
                        {fmt.breakdownTimeline.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-slate-500 dark:text-slate-400">
                            <span className={`px-1.5 py-0.5 rounded shrink-0 text-[10px] ${
                              isLight ? 'bg-amber-100 text-amber-900' : 'bg-[#252525] text-amber-300'
                            }`}>
                              {item.second}
                            </span>
                            <span className={`leading-snug ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{item.beat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: CONTENT OF SADID                                                   */}
      {/* ========================================================================= */}
      {activeTab === 'sadid' && <div className="animate-fade-in">{renderCreatorContent('Sadid')}</div>}

      {/* ========================================================================= */}
      {/* TAB 3: CONTENT OF ANIKA                                                   */}
      {/* ========================================================================= */}
      {activeTab === 'anika' && <div className="animate-fade-in">{renderCreatorContent('Anika')}</div>}

      {/* ========================================================================= */}
      {/* TAB 4: PRODUCTION MATRIX ANALYSIS                                         */}
      {/* ========================================================================= */}
      {activeTab === 'matrix' && (
        <div className="space-y-8 animate-fade-in">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
            <div className={`border rounded-xl p-4 ${isLight ? 'bg-[#faf9f6] border-[#e9e9e7]' : 'bg-[#1f1f1f] border-[#282828]'}`}>
              <span className={`text-[10px] font-mono uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Total Pipeline</span>
              <div className={`text-2xl font-bold font-mono mt-1 ${isLight ? 'text-black' : 'text-white'}`}>{analytics.total} Reels</div>
              <div className={`text-[11px] mt-1 font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                {analytics.sadidTotal} Sadid • {analytics.anikaTotal} Anika
              </div>
            </div>

            <div className={`border rounded-xl p-4 ${isLight ? 'bg-[#faf9f6] border-[#e9e9e7]' : 'bg-[#1f1f1f] border-[#282828]'}`}>
              <span className={`text-[10px] font-mono uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Uploaded</span>
              <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                {analytics.statusCounts.Uploaded}
              </div>
              <div className={`text-[11px] mt-1 font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                {analytics.statusCounts.Scheduled} Scheduled next
              </div>
            </div>

            <div className={`border rounded-xl p-4 ${isLight ? 'bg-[#faf9f6] border-[#e9e9e7]' : 'bg-[#1f1f1f] border-[#282828]'}`}>
              <span className={`text-[10px] font-mono uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>In Production</span>
              <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-1">
                {analytics.statusCounts.Scripting + analytics.statusCounts.Recording + analytics.statusCounts.Editing}
              </div>
              <div className={`text-[11px] mt-1 font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                {analytics.statusCounts.Scripting} Script • {analytics.statusCounts.Recording} Rec • {analytics.statusCounts.Editing} Edit
              </div>
            </div>

            <div className={`border rounded-xl p-4 ${isLight ? 'bg-indigo-50/50 border-indigo-200' : 'bg-indigo-500/5 border-indigo-500/20'}`}>
              <span className="text-[10px] font-mono text-indigo-700 dark:text-indigo-400 uppercase">Dominant Format</span>
              <div className="text-base font-bold font-mono text-indigo-900 dark:text-indigo-200 mt-1 truncate">
                {Object.entries(analytics.formatCounts).sort((a, b) => b[1].total - a[1].total)[0][0]}
              </div>
              <div className={`text-[11px] mt-1 font-mono ${isLight ? 'text-indigo-700/80' : 'text-slate-400'}`}>
                {Object.entries(analytics.formatCounts).sort((a, b) => b[1].total - a[1].total)[0][1].total} Reels created
              </div>
            </div>
          </div>

          {/* Analysis 1: Distribution By Format */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className={`text-xs font-semibold uppercase tracking-wider font-mono flex items-center gap-2 ${isLight ? 'text-slate-800' : 'text-white'}`}>
                <BarChart3 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>1. Analysis by Format (Reel Structure)</span>
              </h3>
              <span className={`text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>5 structural formulas</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {FORMAT_LIST.map((fmtKey) => {
                const count = analytics.formatCounts[fmtKey];
                const pct = analytics.total > 0 ? Math.round((count.total / analytics.total) * 100) : 0;
                return (
                  <div key={fmtKey} className={`border rounded-xl p-3 space-y-2 ${isLight ? 'bg-[#faf9f6] border-[#e9e9e7]' : 'bg-[#1f1f1f] border-[#282828]'}`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-medium truncate ${isLight ? 'text-slate-800' : 'text-slate-200'}`} title={fmtKey}>
                        {fmtKey}
                      </span>
                      <span className="text-xs font-bold font-mono text-indigo-600 dark:text-indigo-400">{count.total}</span>
                    </div>

                    <div className={`w-full h-1.5 rounded-full overflow-hidden ${isLight ? 'bg-[#e9e9e7]' : 'bg-[#282828]'}`}>
                      <div className="bg-indigo-600 h-full rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
                    </div>

                    <div className={`flex items-center justify-between text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      <span>{pct}%</span>
                      <span>S: {count.sadid} | A: {count.anika}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Analysis 2: Distribution By Topic */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className={`text-xs font-semibold uppercase tracking-wider font-mono flex items-center gap-2 ${isLight ? 'text-slate-800' : 'text-white'}`}>
                <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>2. Analysis by Topic (Content Pillar)</span>
              </h3>
              <span className={`text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>5 TCG pillars</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {TOPIC_LIST.map((topKey) => {
                const count = analytics.topicCounts[topKey];
                const pct = analytics.total > 0 ? Math.round((count.total / analytics.total) * 100) : 0;
                const conf = TOPIC_CONFIG[topKey];

                return (
                  <div key={topKey} className={`border rounded-xl p-3 space-y-2 ${isLight ? 'bg-[#faf9f6] border-[#e9e9e7]' : 'bg-[#1f1f1f] border-[#282828]'}`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-medium truncate ${isLight ? 'text-slate-800' : 'text-slate-200'}`} title={topKey}>
                        {conf.label}
                      </span>
                      <span className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400">{count.total}</span>
                    </div>

                    <div className={`w-full h-1.5 rounded-full overflow-hidden ${isLight ? 'bg-[#e9e9e7]' : 'bg-[#282828]'}`}>
                      <div className="bg-emerald-600 h-full rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
                    </div>

                    <div className={`flex items-center justify-between text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      <span>{pct}%</span>
                      <span>S: {count.sadid} | A: {count.anika}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Analysis 3: Combined 2D Matrix */}
          <div className="space-y-3">
            <div>
              <h3 className={`text-xs font-semibold uppercase tracking-wider font-mono flex items-center gap-2 ${isLight ? 'text-slate-800' : 'text-white'}`}>
                <Grid className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>3. Combined Production Matrix (Topic × Format Intersection)</span>
              </h3>
              <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Heatmap showing cross-tabulation of format usage per topic to expose gaps.
              </p>
            </div>

            <div className={`rounded-xl border overflow-x-auto p-4 ${isLight ? 'bg-white border-[#e9e9e7]' : 'bg-[#1f1f1f] border-[#282828]'}`}>
              <table className="w-full text-xs font-mono border-collapse">
                <thead>
                  <tr className={`border-b text-[10px] ${isLight ? 'border-[#e9e9e7] text-slate-500' : 'border-[#282828] text-slate-400'}`}>
                    <th className="p-2.5 text-left font-medium">Topic \ Format</th>
                    {FORMAT_LIST.map((fmt) => (
                      <th key={fmt} className="p-2.5 text-center font-medium max-w-[120px] truncate" title={fmt}>
                        {fmt}
                      </th>
                    ))}
                    <th className="p-2.5 text-right font-medium text-indigo-600 dark:text-indigo-400">Total</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isLight ? 'divide-[#f0eee9]' : 'divide-[#282828]'}`}>
                  {TOPIC_LIST.map((topKey) => {
                    const rowTotal = analytics.topicCounts[topKey].total;
                    return (
                      <tr key={topKey} className={`transition ${isLight ? 'hover:bg-[#faf9f6]' : 'hover:bg-[#252525]/40'}`}>
                        <td className={`p-2.5 font-medium text-xs whitespace-nowrap ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                          {topKey}
                        </td>
                        {FORMAT_LIST.map((fmtKey) => {
                          const cellVal = analytics.combinedMatrix[topKey][fmtKey] || 0;
                          return (
                            <td key={fmtKey} className="p-2.5 text-center">
                              <span
                                className={`inline-block px-2.5 py-0.5 rounded text-xs font-semibold font-mono ${
                                  cellVal > 1
                                    ? 'bg-purple-600 text-white'
                                    : cellVal === 1
                                    ? isLight
                                      ? 'bg-purple-100 text-purple-700 border border-purple-200'
                                      : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                    : isLight
                                    ? 'text-slate-300'
                                    : 'text-slate-600'
                                }`}
                              >
                                {cellVal}
                              </span>
                            </td>
                          );
                        })}
                        <td className={`p-2.5 text-right font-bold text-xs ${isLight ? 'text-black' : 'text-white'}`}>
                          {rowTotal}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className={`border-t-2 font-bold ${
                    isLight
                      ? 'border-[#e9e9e7] bg-[#f7f6f3]'
                      : 'border-[#282828] bg-[#222222]/50'
                  }`}>
                    <td className={`p-2.5 text-[10px] uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Format Total</td>
                    {FORMAT_LIST.map((fmtKey) => (
                      <td key={fmtKey} className={`p-2.5 text-center text-xs ${isLight ? 'text-black' : 'text-white'}`}>
                        {analytics.formatCounts[fmtKey].total}
                      </td>
                    ))}
                    <td className="p-2.5 text-right text-indigo-600 dark:text-indigo-400 text-sm font-bold">
                      {analytics.total}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* QUICK ADD MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className={`rounded-2xl border w-full max-w-lg p-6 space-y-4 shadow-xl animate-fade-in ${
            isLight ? 'bg-white border-[#e9e9e7]' : 'bg-[#202020] border-[#333]'
          }`}>
            <div className={`flex items-center justify-between pb-3 border-b ${isLight ? 'border-[#e9e9e7]' : 'border-[#282828]'}`}>
              <div className="flex items-center gap-2">
                <Clapperboard className="w-5 h-5 text-indigo-500" />
                <h3 className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>Plan New Reel for {newVideoCreator}</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className={`p-1 rounded-md transition ${isLight ? 'text-slate-400 hover:text-black hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-[#282828]'}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateVideo} className="space-y-4 text-xs font-sans">
              <div>
                <label className={`block text-[11px] font-mono uppercase mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Reel Title</label>
                <input
                  type="text"
                  required
                  value={newVideoTitle}
                  onChange={(e) => setNewVideoTitle(e.target.value)}
                  placeholder="e.g. Where your $100 card sale actually goes..."
                  className={`w-full rounded-lg px-3 py-2 text-xs border focus:outline-none focus:border-indigo-500 ${
                    isLight ? 'bg-white border-[#e3e2de] text-slate-900' : 'bg-[#181818] border-[#2e2e2e] text-white'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-[11px] font-mono uppercase mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Creator</label>
                  <select
                    value={newVideoCreator}
                    onChange={(e) => setNewVideoCreator(e.target.value as 'Sadid' | 'Anika')}
                    className={`w-full rounded-lg px-2.5 py-1.5 text-xs font-mono border ${
                      isLight ? 'bg-white border-[#e3e2de] text-slate-900' : 'bg-[#181818] border-[#2e2e2e] text-slate-300'
                    }`}
                  >
                    <option value="Sadid">Sadid</option>
                    <option value="Anika">Anika</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-[11px] font-mono uppercase mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Initial Stage</label>
                  <select
                    value={newVideoStatus}
                    onChange={(e) => setNewVideoStatus(e.target.value as VideoStatus)}
                    className={`w-full rounded-lg px-2.5 py-1.5 text-xs font-mono border ${
                      isLight ? 'bg-white border-[#e3e2de] text-slate-900' : 'bg-[#181818] border-[#2e2e2e] text-slate-300'
                    }`}
                  >
                    {STATUS_LIST.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-[11px] font-mono uppercase mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Topic Pillar</label>
                  <select
                    value={newVideoTopic}
                    onChange={(e) => setNewVideoTopic(e.target.value as ContentTopic)}
                    className={`w-full rounded-lg px-2.5 py-1.5 text-xs font-mono border ${
                      isLight ? 'bg-white border-[#e3e2de] text-slate-900' : 'bg-[#181818] border-[#2e2e2e] text-slate-300'
                    }`}
                  >
                    {TOPIC_LIST.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block text-[11px] font-mono uppercase mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Reel Format</label>
                  <select
                    value={newVideoFormat}
                    onChange={(e) => setNewVideoFormat(e.target.value as ReelFormat)}
                    className={`w-full rounded-lg px-2.5 py-1.5 text-xs font-mono border ${
                      isLight ? 'bg-white border-[#e3e2de] text-slate-900' : 'bg-[#181818] border-[#2e2e2e] text-slate-300'
                    }`}
                  >
                    {FORMAT_LIST.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={`block text-[11px] font-mono uppercase mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  3-Second Hook
                </label>
                <textarea
                  rows={2}
                  value={newVideoHook}
                  onChange={(e) => setNewVideoHook(e.target.value)}
                  placeholder="First spoken line and matching text on screen..."
                  className={`w-full rounded-lg px-3 py-1.5 text-xs border focus:outline-none focus:border-indigo-500 resize-none ${
                    isLight ? 'bg-white border-[#e3e2de] text-slate-900' : 'bg-[#181818] border-[#2e2e2e] text-white'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-[11px] font-mono uppercase mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Target Date</label>
                  <input
                    type="date"
                    value={newVideoDate}
                    onChange={(e) => setNewVideoDate(e.target.value)}
                    className={`w-full rounded-lg px-2.5 py-1.5 text-xs font-mono border ${
                      isLight ? 'bg-white border-[#e3e2de] text-slate-900' : 'bg-[#181818] border-[#2e2e2e] text-slate-300'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-[11px] font-mono uppercase mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Notes</label>
                  <input
                    type="text"
                    value={newVideoNotes}
                    onChange={(e) => setNewVideoNotes(e.target.value)}
                    placeholder="B-roll, props, loupe..."
                    className={`w-full rounded-lg px-3 py-1.5 text-xs border focus:outline-none focus:border-indigo-500 ${
                      isLight ? 'bg-white border-[#e3e2de] text-slate-900' : 'bg-[#181818] border-[#2e2e2e] text-white'
                    }`}
                  />
                </div>
              </div>

              <div className={`flex items-center justify-end gap-2 pt-2 border-t ${isLight ? 'border-[#e9e9e7]' : 'border-[#282828]'}`}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className={`px-3 py-1.5 text-xs transition ${isLight ? 'text-slate-600 hover:text-black' : 'text-slate-400 hover:text-white'}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs px-4 py-1.5 rounded-lg flex items-center gap-1.5 transition shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Reel</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
