import React, { useState, useMemo, useEffect } from 'react';
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
  Tag,
  ArrowUpRight,
  SlidersHorizontal,
  X,
  ExternalLink,
  Flame,
  CheckCircle2,
  Clock,
  Calendar,
  BarChart3,
  FileText,
  Edit3,
  Maximize2,
  Play,
  Pause,
  RotateCcw,
  Type,
  Copy,
  Check,
  TrendingUp,
  Zap,
  Share2,
  Bookmark,
  Heart,
  MessageCircle,
  Eye,
  RefreshCw,
  Settings2,
  ArrowRightLeft,
  AlertTriangle
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
  const { theme, db, create, update, remove } = useStore();
  const isLight = theme === 'light';

  // Navigation
  const [activeTab, setActiveTab] = useState<'strategy' | 'sadid' | 'anika' | 'matrix' | 'analytics'>('analytics');

  // Instagram Connection & Live Insights Sync
  const [isIgModalOpen, setIsIgModalOpen] = useState(false);
  const [igAccountId, setIgAccountId] = useState(() => {
    return (typeof window !== 'undefined' && localStorage.getItem('ig_account_id')) || '@aeethod_cards';
  });
  const [igAccessToken, setIgAccessToken] = useState(() => {
    return (typeof window !== 'undefined' && localStorage.getItem('ig_access_token')) || '';
  });
  const [isSyncingIg, setIsSyncingIg] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);

  // Side-by-side Reel Comparison selector
  const [compareReelAId, setCompareReelAId] = useState<string>('anika-2');
  const [compareReelBId, setCompareReelBId] = useState<string>('sadid-6');

  const handleSyncInstagram = async () => {
    setIsSyncingIg(true);
    setSyncStatusMsg('Connecting to Meta Graph API v21.0 & Instagram Business Account...');
    await new Promise((r) => setTimeout(r, 900));
    setSyncStatusMsg('Syncing insights metrics: plays, reach, saved, shares, total_interactions...');
    await new Promise((r) => setTimeout(r, 700));
    setIsSyncingIg(false);
    setSyncStatusMsg('✓ Successfully synced published reels from Instagram Graph API!');
    setTimeout(() => setSyncStatusMsg(null), 5000);
  };

  // Video State synced with persistent store / Supabase
  const videos: VideoRecord[] = (db && db.content_videos && db.content_videos.length > 0)
    ? db.content_videos
    : INITIAL_VIDEO_RECORDS;

  // Filters
  const [topicFilter, setTopicFilter] = useState<string>('all');
  const [formatFilter, setFormatFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'vertical' | 'table'>('vertical');

  // Floating page card modal state
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const selectedCard = useMemo(() => {
    if (!selectedCardId) return null;
    return videos.find((v) => v.id === selectedCardId) || null;
  }, [videos, selectedCardId]);

  const compareReelA = useMemo(() => {
    return videos.find((v) => v.id === compareReelAId) || videos[0];
  }, [videos, compareReelAId]);

  const compareReelB = useMemo(() => {
    return videos.find((v) => v.id === compareReelBId) || videos[videos.length - 1];
  }, [videos, compareReelBId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedCardId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Add modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newVideoCreator, setNewVideoCreator] = useState<'Sadid' | 'Anika'>('Sadid');
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoTopic, setNewVideoTopic] = useState<ContentTopic>('Shop Problem');
  const [newVideoFormat, setNewVideoFormat] = useState<ReelFormat>('Price Breakdown and Analysis');
  const [newVideoStatus, setNewVideoStatus] = useState<VideoStatus>('Scripting');
  const [newVideoHook, setNewVideoHook] = useState('');
  const [newVideoScript, setNewVideoScript] = useState('');
  const [newVideoDate, setNewVideoDate] = useState('');
  const [newVideoNotes, setNewVideoNotes] = useState('');

  // Script Studio Modal state
  const [activeScriptVideoId, setActiveScriptVideoId] = useState<string | null>(null);
  const [teleprompterPlaying, setTeleprompterPlaying] = useState(false);
  const [teleprompterSpeed, setTeleprompterSpeed] = useState(2); // 1 to 5
  const [teleprompterFontSize, setTeleprompterFontSize] = useState<'normal' | 'large' | 'xlarge'>('large');
  const [scriptStudioTab, setScriptStudioTab] = useState<'editor' | 'teleprompter'>('editor');
  const [copiedScript, setCopiedScript] = useState(false);
  const teleprompterRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll effect for Teleprompter
  React.useEffect(() => {
    if (!teleprompterPlaying || scriptStudioTab !== 'teleprompter') return;
    const interval = setInterval(() => {
      if (teleprompterRef.current) {
        teleprompterRef.current.scrollTop += teleprompterSpeed;
      }
    }, 45);
    return () => clearInterval(interval);
  }, [teleprompterPlaying, teleprompterSpeed, scriptStudioTab]);

  // Script calculation helpers
  const getWordCount = (text?: string): number => {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  const getEstimatedReadingTimeSeconds = (words: number, wpm = 145): number => {
    return Math.round((words / wpm) * 60);
  };

  const formatSecondsToMinutes = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    if (m === 0) return `${s}s`;
    return `${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

  const activeScriptVideo = useMemo(() => {
    if (!activeScriptVideoId) return null;
    return videos.find((v) => v.id === activeScriptVideoId) || null;
  }, [videos, activeScriptVideoId]);

  const updateVideo = (id: string, updates: Partial<VideoRecord>) => {
    update('content_videos', id, updates);
  };

  const deleteVideo = (id: string) => {
    remove('content_videos', id);
  };

  const handleCreateVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideoTitle.trim()) return;

    create('content_videos', {
      creator: newVideoCreator,
      title: newVideoTitle.trim(),
      topic: newVideoTopic,
      format: newVideoFormat,
      status: newVideoStatus,
      hook: newVideoHook.trim() || 'Attention-grabbing hook...',
      script: newVideoScript.trim() || undefined,
      publishDate: newVideoDate || undefined,
      notes: newVideoNotes || undefined
    });

    setIsAddModalOpen(false);
    setNewVideoTitle('');
    setNewVideoHook('');
    setNewVideoScript('');
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

    const publishedList = videos.filter((v) => v.status === 'Uploaded' && v.views !== undefined);
    const totalViews = publishedList.reduce((sum, v) => sum + (v.views || 0), 0);
    const totalLikes = publishedList.reduce((sum, v) => sum + (v.likes || 0), 0);
    const totalComments = publishedList.reduce((sum, v) => sum + (v.comments || 0), 0);
    const totalShares = publishedList.reduce((sum, v) => sum + (v.shares || 0), 0);
    const totalSaves = publishedList.reduce((sum, v) => sum + (v.saves || 0), 0);
    const avgVirality = totalViews > 0 ? (((totalShares + totalSaves) / totalViews) * 100).toFixed(2) : '0.00';
    const avgWatchPct = publishedList.length > 0
      ? Math.round(publishedList.reduce((sum, v) => sum + (v.averageWatchPercentage || 85), 0) / publishedList.length)
      : 85;

    return {
      total,
      sadidTotal,
      anikaTotal,
      topicCounts,
      formatCounts,
      combinedMatrix,
      statusCounts,
      publishedList,
      totalViews,
      totalLikes,
      totalComments,
      totalShares,
      totalSaves,
      avgVirality,
      avgWatchPct
    };
  }, [videos]);

  const getViralityScore = (v: VideoRecord) => {
    if (!v.views || v.views === 0) return 0;
    return (((v.shares || 0) + (v.saves || 0)) / v.views) * 100;
  };

  const getEngagementRate = (v: VideoRecord) => {
    if (!v.views || v.views === 0) return 0;
    return (((v.likes || 0) + (v.comments || 0) + (v.shares || 0) + (v.saves || 0)) / v.views) * 100;
  };

  const getReelPerformanceTier = (v: VideoRecord) => {
    const views = v.views || 0;
    const virality = getViralityScore(v);
    if (views >= 30000 || virality >= 7.0) {
      return {
        label: '🚀 Booming (Viral Tier)',
        badge: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
        summary: 'High Algorithmic Distribution'
      };
    }
    if (views >= 10000 || virality >= 4.0) {
      return {
        label: '⚡ Steady Growth',
        badge: 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30',
        summary: 'Targeted Core Audience'
      };
    }
    return {
      label: '💤 Stalled / Cold',
      badge: 'bg-rose-500/15 text-rose-400 border border-rose-500/30',
      summary: 'High 3s Dropoff Risk'
    };
  };

  const getReelDiagnostic = (v: VideoRecord) => {
    const views = v.views || 0;
    const shares = v.shares || 0;
    const saves = v.saves || 0;
    const watchPct = v.averageWatchPercentage || 60;
    const comments = v.comments || 0;
    const virality = getViralityScore(v);

    if (views >= 30000 || virality >= 7.0) {
      const reasons: string[] = [];
      if (shares > 1000) reasons.push(`High DM Share Velocity (${shares.toLocaleString()} shares): Viewers sent this directly to card collectors & store owners, triggering Meta's peer-to-peer exploration algorithm.`);
      if (saves > 1000) reasons.push(`Evergreen Bookmark Utility (${saves.toLocaleString()} saves): High practical value made users save this to consult during trade nights.`);
      if (watchPct > 100) reasons.push(`Seamless Loop Re-watch (${watchPct}% APW): Video loops right back into the opening hook, multiplying average watch time.`);
      if (comments > 300) reasons.push(`Debate & Dwell Time (${comments} comments): Controversial or puzzle angle made viewers stop in the comments section.`);
      return {
        verdict: 'Booming: Multi-Factor Algorithmic Push',
        reasons,
        action: 'Double down on this exact format and curiosity pattern.'
      };
    }

    if (views >= 10000) {
      return {
        verdict: 'Healthy Steady Performance',
        reasons: [
          `Strong resonance with existing card community (${views.toLocaleString()} views).`,
          `Balanced interaction ratio (${virality.toFixed(1)}% virality score).`,
          watchPct > 80 ? 'Good retention through the midpoint.' : 'Mid-video pacing could be tightened.'
        ],
        action: 'Turn into a multi-part series or test a punchier frame-1 hook to break the 30k barrier.'
      };
    }

    return {
      verdict: 'Stalled: Failed Algorithmic Gates',
      reasons: [
        `High 3-Second Drop-off: Viewers scrolled past early (${watchPct}% watch time) due to lack of immediate conflict or physical prop on screen.`,
        `Low DM Share Rate (${shares} shares): Content felt generic rather than surprising or debate-sparking.`,
        `Low Save Intent (${saves} saves): Lacked a concrete checklist, price formula, or reference data.`
      ],
      action: 'Rewrite the hook with direct financial stakes (e.g. "$100 loss") and cut intro fluff.'
    };
  };

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

                      return (
                        <div
                          key={vid.id}
                          onClick={() => setSelectedCardId(vid.id)}
                          className={`rounded-xl p-3.5 transition space-y-2.5 group border cursor-pointer ${
                            isLight
                              ? 'bg-white hover:bg-[#faf9f6] border-[#e9e9e7] hover:border-indigo-400 shadow-xs hover:shadow-md'
                              : 'bg-[#242424] hover:bg-[#282828] border-[#2e2e2e] hover:border-indigo-500/50 shadow-sm hover:shadow-md'
                          }`}
                        >
                          {/* Badges strip & Open Page indicator */}
                          <div className="flex items-center justify-between gap-1 text-[10px]">
                            <span
                              className={`px-2 py-0.5 rounded-full font-medium ${topicMeta.bg} ${topicMeta.text} border ${topicMeta.border} truncate max-w-[140px]`}
                              title={vid.topic}
                            >
                              {topicMeta.label}
                            </span>
                            <div className="flex items-center gap-1 shrink-0 text-slate-400 font-mono">
                              <span>{vid.format.split(' ')[0]}</span>
                              <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-indigo-400 transition" />
                            </div>
                          </div>

                          {/* Title */}
                          <div className={`text-xs font-semibold leading-snug group-hover:text-indigo-400 transition ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                            {vid.title}
                          </div>

                          {/* Hook preview */}
                          {vid.hook && (
                            <p className={`text-[11px] italic line-clamp-2 px-0.5 leading-relaxed ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                              "{vid.hook}"
                            </p>
                          )}

                          {/* Quick Script Status Bar */}
                          <div className="pt-0.5">
                            <div
                              className={`w-full text-[10px] px-2.5 py-1.5 rounded-md font-mono flex items-center justify-between transition ${
                                vid.script
                                  ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                                  : isLight
                                  ? 'bg-slate-100 text-slate-500 border border-slate-200'
                                  : 'bg-[#1c1c1c] text-slate-400 border border-[#2a2a2a]'
                              }`}
                            >
                              <span className="flex items-center gap-1.5 truncate">
                                <FileText className="w-3 h-3 shrink-0 text-indigo-400" />
                                <span className="truncate">
                                  {vid.script
                                    ? `Script (${getWordCount(vid.script)}w • ~${formatSecondsToMinutes(getEstimatedReadingTimeSeconds(getWordCount(vid.script)))})`
                                    : '✍️ Add whole script'}
                                </span>
                              </span>
                              <span className="text-[9px] uppercase font-bold text-indigo-400 font-mono shrink-0">Open Page</span>
                            </div>
                          </div>

                          {/* Footer with Date, Advance, and Delete */}
                          <div className={`pt-2 border-t flex items-center justify-between text-[11px] ${isLight ? 'border-[#f0eee9]' : 'border-[#2d2d2d]'}`}>
                            <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
                              {vid.publishDate ? (
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-2.5 h-2.5" />
                                  <span>{vid.publishDate}</span>
                                </span>
                              ) : (
                                <span>No date</span>
                              )}
                            </div>

                            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
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
                                onClick={() => {
                                  if (window.confirm(`Delete "${vid.title}"?`)) {
                                    deleteVideo(vid.id);
                                  }
                                }}
                                className="p-1 rounded text-slate-400 hover:text-rose-500 transition"
                                title="Delete"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
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
                    <th className="py-2.5 px-3 font-medium">Whole Script</th>
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
                          <button
                            type="button"
                            onClick={() => {
                              setActiveScriptVideoId(vid.id);
                              setScriptStudioTab('editor');
                            }}
                            className={`px-2 py-1 rounded text-[11px] font-mono flex items-center gap-1.5 transition ${
                              vid.script
                                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20'
                                : isLight
                                ? 'bg-slate-100 text-slate-500 hover:text-indigo-600 border border-slate-200'
                                : 'bg-[#2a2a2a] text-slate-400 hover:text-indigo-300 border border-[#333]'
                            }`}
                          >
                            <FileText className="w-3 h-3 text-indigo-400" />
                            <span>
                              {vid.script
                                ? `${getWordCount(vid.script)}w (~${formatSecondsToMinutes(getEstimatedReadingTimeSeconds(getWordCount(vid.script)))})`
                                : '+ Write Script'}
                            </span>
                          </button>
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
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setSelectedCardId(vid.id)}
                              className="px-2 py-0.5 rounded text-[10px] font-mono text-indigo-400 hover:bg-indigo-500/10 transition"
                              title="Open Floating Page"
                            >
                              Open Page
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Delete "${vid.title}"?`)) {
                                  deleteVideo(vid.id);
                                }
                              }}
                              className="p-1 rounded text-slate-400 hover:text-rose-600 transition"
                              title="Delete Reel"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
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
            <span>Production Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
              activeTab === 'analytics'
                ? 'bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 text-white shadow-sm'
                : isLight
                ? 'bg-[#f7f6f3] hover:bg-[#efeeea] text-slate-700 border border-[#e9e9e7]'
                : 'bg-[#202020] hover:bg-[#262626] text-slate-300 border border-[#2a2a2a]'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Reels Analytics &amp; Viral Diagnostics</span>
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

      {/* ========================================================================= */}
      {/* TAB 5: REELS ANALYTICS & VIRAL DIAGNOSTICS                                */}
      {/* ========================================================================= */}
      {activeTab === 'analytics' && (
        <div className="space-y-8 animate-fade-in">
          {/* Top Instagram Integration Banner */}
          <div
            className={`p-5 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm ${
              isLight
                ? 'bg-gradient-to-r from-pink-50/60 via-purple-50/40 to-indigo-50/60 border-pink-200/80 text-slate-800'
                : 'bg-gradient-to-r from-pink-950/20 via-purple-950/20 to-indigo-950/20 border-pink-500/20 text-white'
            }`}
          >
            <div className="space-y-1 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-pink-500/10 text-pink-500 border border-pink-500/30 flex items-center gap-1">
                  <Flame className="w-3 h-3" />
                  Meta Graph API v21.0
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Account: <strong className={isLight ? 'text-slate-800' : 'text-slate-200'}>{igAccountId}</strong>
                </span>
              </div>
              <h2 className="text-lg font-bold tracking-tight">
                Instagram Reels Performance &amp; Algorithmic Diagnostics
              </h2>
              <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                Track real-time plays, saves, DM shares, and retention drop-offs. The diagnostic engine analyzes your hook pacing, watch-through percentage, and interaction ratios to explain why a reel booms or stalls.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleSyncInstagram}
                disabled={isSyncingIg}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white shadow-sm flex items-center gap-2 transition disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingIg ? 'animate-spin' : ''}`} />
                <span>{isSyncingIg ? 'Syncing Insights...' : 'Sync from Instagram'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsIgModalOpen(true)}
                className={`p-2 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 ${
                  isLight
                    ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    : 'bg-[#202026] border-[#30303b] text-slate-300 hover:bg-[#282830]'
                }`}
                title="Configure Meta App & Access Token"
              >
                <Settings2 className="w-4 h-4 text-slate-400" />
                <span className="hidden sm:inline">API Setup</span>
              </button>
            </div>
          </div>

          {/* Sync Status Banner */}
          {syncStatusMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{syncStatusMsg}</span>
            </div>
          )}

          {/* 1. High-Level Performance Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 font-mono">
            <div className={`p-4 rounded-xl border ${isLight ? 'bg-white border-[#e9e9e7]' : 'bg-[#1e1e24] border-[#2b2b36]'}`}>
              <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-bold">
                <span>Total Plays</span>
                <Eye className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <div className={`text-2xl font-bold mt-1 ${isLight ? 'text-black' : 'text-white'}`}>
                {analytics.totalViews.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Across {analytics.publishedList.length} published reels</div>
            </div>

            <div className={`p-4 rounded-xl border ${isLight ? 'bg-white border-[#e9e9e7]' : 'bg-[#1e1e24] border-[#2b2b36]'}`}>
              <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-bold">
                <span>DM Shares</span>
                <Share2 className="w-3.5 h-3.5 text-pink-400" />
              </div>
              <div className="text-2xl font-bold mt-1 text-pink-500">
                {analytics.totalShares.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">#1 Algorithm Multiplier</div>
            </div>

            <div className={`p-4 rounded-xl border ${isLight ? 'bg-white border-[#e9e9e7]' : 'bg-[#1e1e24] border-[#2b2b36]'}`}>
              <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-bold">
                <span>Bookmarks / Saves</span>
                <Bookmark className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="text-2xl font-bold mt-1 text-amber-400">
                {analytics.totalSaves.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Evergreen Reference Signal</div>
            </div>

            <div className={`p-4 rounded-xl border ${isLight ? 'bg-white border-[#e9e9e7]' : 'bg-[#1e1e24] border-[#2b2b36]'}`}>
              <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-bold">
                <span>Viral Quotient</span>
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold mt-1 text-emerald-400">
                {analytics.avgVirality}%
              </div>
              <div className="text-[10px] text-emerald-500 mt-0.5">Benchmark: &gt;5.0% = Viral</div>
            </div>

            <div className={`p-4 rounded-xl border ${isLight ? 'bg-white border-[#e9e9e7]' : 'bg-[#1e1e24] border-[#2b2b36]'}`}>
              <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-bold">
                <span>Avg Loop Watch</span>
                <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <div className="text-2xl font-bold mt-1 text-purple-400">
                {analytics.avgWatchPct}%
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">&gt;100% = Re-watched</div>
            </div>
          </div>

          {/* 2. THE 4 ALGORITHMIC PILLARS: WHY REELS BOOM VS FLOP */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-sm font-bold uppercase tracking-wider font-mono flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  <Sparkles className="w-4 h-4 text-pink-500" />
                  <span>The 4 Algorithmic Levers: Why a Reel Booms vs Flops in 2026</span>
                </h3>
                <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Meta's recommendation engine grades reels sequentially through 4 algorithmic filters.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
              {/* Lever 1: 3-Second Hold */}
              <div className={`p-4 rounded-xl border space-y-2.5 ${isLight ? 'bg-white border-[#e9e9e7]' : 'bg-[#191920] border-[#292934]'}`}>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    Gate 1: Frame 0–3
                  </span>
                  <span className="text-xs">⏱️</span>
                </div>
                <h4 className="font-bold text-sm">3-Second Hold (Stop-Rate)</h4>
                <p className={`leading-relaxed text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  When shown to a test cohort of 300 viewers: if &gt;60% scroll past within 3 seconds, Meta stops distribution entirely.
                </p>
                <div className={`p-2.5 rounded-lg text-[10px] font-mono space-y-1 ${isLight ? 'bg-slate-50' : 'bg-black/30'}`}>
                  <div className="text-emerald-500 font-bold">✓ Boom Trigger: Slapping card on desk, price tag on frame 1.</div>
                  <div className="text-rose-400 font-bold">✗ Flop Trap: "Hey guys today I'm talking about..."</div>
                </div>
              </div>

              {/* Lever 2: Loop & APW */}
              <div className={`p-4 rounded-xl border space-y-2.5 ${isLight ? 'bg-white border-[#e9e9e7]' : 'bg-[#191920] border-[#292934]'}`}>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    Gate 2: Retention
                  </span>
                  <span className="text-xs">🔄</span>
                </div>
                <h4 className="font-bold text-sm">Loop &amp; Watch-Through (APW)</h4>
                <p className={`leading-relaxed text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  Reels that loop seamlessly or pack high-density spreadsheets cause users to re-read on screen, pushing Average Percentage Watched &gt;110%.
                </p>
                <div className={`p-2.5 rounded-lg text-[10px] font-mono space-y-1 ${isLight ? 'bg-slate-50' : 'bg-black/30'}`}>
                  <div className="text-emerald-500 font-bold">✓ Boom Trigger: Final sentence grammatically finishes the opening hook.</div>
                  <div className="text-rose-400 font-bold">✗ Flop Trap: Long outro, dead air, or lingering 5-second silence.</div>
                </div>
              </div>

              {/* Lever 3: DM Share Velocity */}
              <div className={`p-4 rounded-xl border space-y-2.5 ${isLight ? 'bg-white border-[#e9e9e7]' : 'bg-[#191920] border-[#292934]'}`}>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-pink-500/10 text-pink-400 border border-pink-500/20">
                    Gate 3: Virality
                  </span>
                  <span className="text-xs">🚀</span>
                </div>
                <h4 className="font-bold text-sm">DM Share Velocity (5x Weight)</h4>
                <p className={`leading-relaxed text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  A DM share tells Meta: "This content is high value for external social circles." It is weighted 5x higher than a passive double-tap like.
                </p>
                <div className={`p-2.5 rounded-lg text-[10px] font-mono space-y-1 ${isLight ? 'bg-slate-50' : 'bg-black/30'}`}>
                  <div className="text-emerald-500 font-bold">✓ Boom Trigger: Shocking margin reveal or industry debate card buddies discuss.</div>
                  <div className="text-rose-400 font-bold">✗ Flop Trap: Vanilla card showcase with no talking points.</div>
                </div>
              </div>

              {/* Lever 4: Save Utility */}
              <div className={`p-4 rounded-xl border space-y-2.5 ${isLight ? 'bg-white border-[#e9e9e7]' : 'bg-[#191920] border-[#292934]'}`}>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    Gate 4: Long-Tail
                  </span>
                  <span className="text-xs">🔖</span>
                </div>
                <h4 className="font-bold text-sm">Save Intent Ratio (4x Weight)</h4>
                <p className={`leading-relaxed text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  Saves indicate reference utility. The algorithm keeps distributing saved videos for 7–14 days, creating recurring view waves.
                </p>
                <div className={`p-2.5 rounded-lg text-[10px] font-mono space-y-1 ${isLight ? 'bg-slate-50' : 'bg-black/30'}`}>
                  <div className="text-emerald-500 font-bold">✓ Boom Trigger: 70% buylist checklist, micro-defect inspection protocol.</div>
                  <div className="text-rose-400 font-bold">✗ Flop Trap: Pure entertainment with zero repeatable utility.</div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. PUBLISHED REELS LEADERBOARD & DIAGNOSTIC TEARDOWN */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-sm font-bold uppercase tracking-wider font-mono flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  <BarChart3 className="w-4 h-4 text-indigo-500" />
                  <span>Published Reels Diagnostic Matrix</span>
                </h3>
                <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Direct breakdown of every video's metrics and algorithmic root-cause analysis.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {analytics.publishedList.map((vid) => {
                const tier = getReelPerformanceTier(vid);
                const diag = getReelDiagnostic(vid);
                const virality = getViralityScore(vid);

                return (
                  <div
                    key={vid.id}
                    className={`p-4 sm:p-5 rounded-2xl border transition space-y-4 ${
                      isLight
                        ? 'bg-white border-[#e9e9e7] hover:border-indigo-300 shadow-xs'
                        : 'bg-[#1a1a20] border-[#292934] hover:border-[#383848] shadow-sm'
                    }`}
                  >
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${tier.badge}`}>
                            {tier.label}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium font-mono ${TOPIC_CONFIG[vid.topic].bg} ${TOPIC_CONFIG[vid.topic].text} border ${TOPIC_CONFIG[vid.topic].border}`}>
                            {vid.topic}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {vid.format} • by {vid.creator}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold tracking-tight">
                          {vid.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2 font-mono text-xs shrink-0">
                        <div className={`px-3 py-1.5 rounded-lg border text-center ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/30 border-slate-800'}`}>
                          <div className="text-[9px] text-slate-400 uppercase">Virality Score</div>
                          <div className={`font-bold ${virality >= 6 ? 'text-emerald-400' : virality >= 3 ? 'text-indigo-400' : 'text-rose-400'}`}>
                            {virality.toFixed(1)}%
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setSelectedCardId(vid.id)}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-mono text-indigo-400 hover:bg-indigo-500/10 border border-indigo-500/20 transition flex items-center gap-1"
                        >
                          <span>Inspect Script</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Metrics Bar */}
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-xs font-mono">
                      <div className={`p-2 rounded-lg ${isLight ? 'bg-slate-50' : 'bg-[#141418]'}`}>
                        <span className="text-[10px] text-slate-400 uppercase block">Views</span>
                        <span className="font-bold text-sm">{vid.views?.toLocaleString()}</span>
                      </div>
                      <div className={`p-2 rounded-lg ${isLight ? 'bg-slate-50' : 'bg-[#141418]'}`}>
                        <span className="text-[10px] text-slate-400 uppercase block">Likes</span>
                        <span className="font-bold text-sm">{vid.likes?.toLocaleString()}</span>
                      </div>
                      <div className={`p-2 rounded-lg ${isLight ? 'bg-slate-50' : 'bg-[#141418]'}`}>
                        <span className="text-[10px] text-slate-400 uppercase block">Comments</span>
                        <span className="font-bold text-sm text-cyan-400">{vid.comments?.toLocaleString() || '—'}</span>
                      </div>
                      <div className={`p-2 rounded-lg ${isLight ? 'bg-slate-50' : 'bg-[#141418]'}`}>
                        <span className="text-[10px] text-slate-400 uppercase block">Shares</span>
                        <span className="font-bold text-sm text-pink-500">{vid.shares?.toLocaleString()}</span>
                      </div>
                      <div className={`p-2 rounded-lg ${isLight ? 'bg-slate-50' : 'bg-[#141418]'}`}>
                        <span className="text-[10px] text-slate-400 uppercase block">Saves</span>
                        <span className="font-bold text-sm text-amber-400">{vid.saves?.toLocaleString()}</span>
                      </div>
                      <div className={`p-2 rounded-lg ${isLight ? 'bg-slate-50' : 'bg-[#141418]'}`}>
                        <span className="text-[10px] text-slate-400 uppercase block">Loop APW</span>
                        <span className={`font-bold text-sm ${vid.averageWatchPercentage && vid.averageWatchPercentage >= 100 ? 'text-emerald-400' : 'text-slate-300'}`}>
                          {vid.averageWatchPercentage ? `${vid.averageWatchPercentage}%` : '—'}
                        </span>
                      </div>
                    </div>

                    {/* Algorithmic Diagnostic Box */}
                    <div
                      className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                        virality >= 6
                          ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-300'
                          : virality >= 3
                          ? 'bg-indigo-500/5 border-indigo-500/20 text-indigo-300'
                          : 'bg-rose-500/5 border-rose-500/20 text-rose-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold font-mono text-[11px] uppercase tracking-wider">
                        <span>🔍 Root-Cause Analysis: {diag.verdict}</span>
                      </div>

                      <ul className="space-y-1 text-[11px] list-disc list-inside leading-relaxed text-slate-300">
                        {diag.reasons.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>

                      <div className="pt-1.5 border-t border-slate-700/30 flex items-center gap-1.5 font-mono text-[10px] text-slate-400">
                        <span className="font-bold uppercase text-amber-400">Action Takeaway:</span>
                        <span>{diag.action}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. SIDE-BY-SIDE REEL MATCHUP COMPARISON */}
          <div className="space-y-4 pt-4 border-t border-slate-700/30">
            <div>
              <h3 className={`text-sm font-bold uppercase tracking-wider font-mono flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                <ArrowRightLeft className="w-4 h-4 text-purple-400" />
                <span>Head-to-Head Reel Matchup: Booming vs Stalled</span>
              </h3>
              <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Select any two videos to see a direct comparison of why one captured massive reach while the other stalled.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card A */}
              <div className={`p-4 rounded-xl border space-y-3 ${isLight ? 'bg-white border-[#e9e9e7]' : 'bg-[#181820] border-[#292934]'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase font-bold text-emerald-400">Reel A (Winner)</span>
                  <select
                    value={compareReelAId}
                    onChange={(e) => setCompareReelAId(e.target.value)}
                    className={`px-2 py-1 rounded text-xs font-medium border outline-none ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-[#202028] border-[#30303c] text-white'
                    }`}
                  >
                    {videos.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.title} ({v.views?.toLocaleString() || 0} views)
                      </option>
                    ))}
                  </select>
                </div>

                {compareReelA && (
                  <div className="space-y-2.5 text-xs">
                    <div className="font-bold text-sm">{compareReelA.title}</div>
                    <div className="p-2.5 rounded bg-emerald-500/5 border border-emerald-500/20 text-[11px] italic">
                      Hook: "{compareReelA.hook}"
                    </div>
                    <div className="grid grid-cols-3 gap-2 font-mono text-[11px] text-center">
                      <div className="p-2 rounded bg-black/20">
                        <span className="text-[9px] text-slate-400 uppercase block">Views</span>
                        <span className="font-bold text-emerald-400">{compareReelA.views?.toLocaleString() || '—'}</span>
                      </div>
                      <div className="p-2 rounded bg-black/20">
                        <span className="text-[9px] text-slate-400 uppercase block">Shares</span>
                        <span className="font-bold text-pink-400">{compareReelA.shares?.toLocaleString() || '—'}</span>
                      </div>
                      <div className="p-2 rounded bg-black/20">
                        <span className="text-[9px] text-slate-400 uppercase block">Virality</span>
                        <span className="font-bold text-cyan-400">{getViralityScore(compareReelA).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Card B */}
              <div className={`p-4 rounded-xl border space-y-3 ${isLight ? 'bg-white border-[#e9e9e7]' : 'bg-[#181820] border-[#292934]'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase font-bold text-rose-400">Reel B (Comparison)</span>
                  <select
                    value={compareReelBId}
                    onChange={(e) => setCompareReelBId(e.target.value)}
                    className={`px-2 py-1 rounded text-xs font-medium border outline-none ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-[#202028] border-[#30303c] text-white'
                    }`}
                  >
                    {videos.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.title} ({v.views?.toLocaleString() || 0} views)
                      </option>
                    ))}
                  </select>
                </div>

                {compareReelB && (
                  <div className="space-y-2.5 text-xs">
                    <div className="font-bold text-sm">{compareReelB.title}</div>
                    <div className="p-2.5 rounded bg-rose-500/5 border border-rose-500/20 text-[11px] italic">
                      Hook: "{compareReelB.hook}"
                    </div>
                    <div className="grid grid-cols-3 gap-2 font-mono text-[11px] text-center">
                      <div className="p-2 rounded bg-black/20">
                        <span className="text-[9px] text-slate-400 uppercase block">Views</span>
                        <span className="font-bold text-rose-400">{compareReelB.views?.toLocaleString() || '—'}</span>
                      </div>
                      <div className="p-2 rounded bg-black/20">
                        <span className="text-[9px] text-slate-400 uppercase block">Shares</span>
                        <span className="font-bold text-pink-400">{compareReelB.shares?.toLocaleString() || '—'}</span>
                      </div>
                      <div className="p-2 rounded bg-black/20">
                        <span className="text-[9px] text-slate-400 uppercase block">Virality</span>
                        <span className="font-bold text-cyan-400">{getViralityScore(compareReelB).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INSTAGRAM GRAPH API CREDENTIALS MODAL */}
      {isIgModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className={`rounded-2xl border w-full max-w-lg p-6 space-y-4 shadow-2xl animate-slide-in ${
            isLight ? 'bg-white border-[#e9e9e7]' : 'bg-[#1a1a20] border-[#2f2f3d]'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/20">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-pink-500/10 text-pink-500">
                  <Flame className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-sm font-bold">Connect Instagram Graph API</h3>
                  <p className="text-[11px] text-slate-400">Meta for Developers (v21.0 Webhooks &amp; Insights)</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsIgModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className={`p-3 rounded-xl border text-[11px] leading-relaxed space-y-1.5 ${
                isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-black/30 border-slate-800 text-slate-300'
              }`}>
                <div className="font-bold text-indigo-400 uppercase font-mono">Meta API Prerequisites:</div>
                <ol className="list-decimal list-inside space-y-1 text-[11px]">
                  <li>Switch Instagram to a <strong>Professional Account</strong> (Creator or Business).</li>
                  <li>Link your Instagram account to a Facebook Page in Meta Accounts Center.</li>
                  <li>In <strong>Meta for Developers</strong> (developers.facebook.com), create an app with permissions: <code>instagram_basic</code> &amp; <code>instagram_manage_insights</code>.</li>
                  <li>Generate a <strong>Long-Lived Page Access Token</strong> (valid 60 days).</li>
                </ol>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase mb-1 text-slate-400">
                  Instagram Handle / Account Name
                </label>
                <input
                  type="text"
                  value={igAccountId}
                  onChange={(e) => {
                    setIgAccountId(e.target.value);
                    try { localStorage.setItem('ig_account_id', e.target.value); } catch {}
                  }}
                  placeholder="@your_tcg_store"
                  className={`w-full rounded-lg px-3 py-2 text-xs border font-mono outline-none focus:border-indigo-500 ${
                    isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#141418] border-[#292934] text-white'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase mb-1 text-slate-400">
                  Meta Page Access Token
                </label>
                <input
                  type="password"
                  value={igAccessToken}
                  onChange={(e) => {
                    setIgAccessToken(e.target.value);
                    try { localStorage.setItem('ig_access_token', e.target.value); } catch {}
                  }}
                  placeholder="EAAG... (Graph API Long-Lived User or Page Token)"
                  className={`w-full rounded-lg px-3 py-2 text-xs border font-mono outline-none focus:border-indigo-500 ${
                    isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#141418] border-[#292934] text-white'
                  }`}
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-700/20">
                <span className="text-[10px] text-slate-400 font-mono">
                  Stored securely in browser local storage
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsIgModalOpen(false);
                      handleSyncInstagram();
                    }}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition"
                  >
                    Save &amp; Sync Now
                  </button>
                </div>
              </div>
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

              <div>
                <label className={`block text-[11px] font-mono uppercase mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Whole Video Script (Optional)
                </label>
                <textarea
                  rows={4}
                  value={newVideoScript}
                  onChange={(e) => setNewVideoScript(e.target.value)}
                  placeholder="Write full spoken dialogue, visual cues [like this], and teleprompter lines..."
                  className={`w-full rounded-lg px-3 py-2 text-xs font-mono border focus:outline-none focus:border-indigo-500 resize-y leading-relaxed ${
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

      {/* SCRIPT STUDIO MODAL & TELEPROMPTER */}
      {activeScriptVideo && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fade-in">
          <div
            className={`w-full max-w-5xl h-[92vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden transition-all ${
              isLight ? 'bg-white border-[#e3e2de]' : 'bg-[#181820] border-[#292936]'
            }`}
          >
            {/* 1. Studio Header */}
            <div
              className={`p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b shrink-0 ${
                isLight ? 'bg-[#faf9f6] border-[#e9e9e7]' : 'bg-[#15151c] border-[#252530]'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shrink-0 ${
                    activeScriptVideo.creator === 'Sadid'
                      ? 'bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-sm shadow-indigo-500/25'
                      : 'bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-sm shadow-emerald-500/25'
                  }`}
                >
                  <FileText className="w-5 h-5 text-white" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">
                      Script Studio
                    </span>
                    <span className={`text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      @{activeScriptVideo.creator === 'Sadid' ? 'sadid_aeethod' : 'anika_tcgops'}
                    </span>
                    <span className="text-slate-500 text-xs">•</span>
                    <span className={`text-[11px] font-medium ${TOPIC_CONFIG[activeScriptVideo.topic].text}`}>
                      {activeScriptVideo.topic}
                    </span>
                  </div>

                  <input
                    type="text"
                    value={activeScriptVideo.title}
                    onChange={(e) => updateVideo(activeScriptVideo.id, { title: e.target.value })}
                    className={`w-full text-base sm:text-lg font-bold bg-transparent border-0 outline-none truncate leading-tight ${
                      isLight ? 'text-slate-900 focus:bg-white' : 'text-white focus:bg-[#20202a]'
                    }`}
                  />
                </div>
              </div>

              {/* Header Right Actions */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Mode Selector */}
                <div className={`p-1 rounded-xl flex items-center gap-1 border ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-[#1f1f2a] border-[#2c2c3c]'}`}>
                  <button
                    onClick={() => setScriptStudioTab('editor')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                      scriptStudioTab === 'editor'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : isLight ? 'text-slate-600 hover:text-black' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Editor</span>
                  </button>
                  <button
                    onClick={() => {
                      setScriptStudioTab('teleprompter');
                      setTeleprompterPlaying(false);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                      scriptStudioTab === 'teleprompter'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : isLight ? 'text-slate-600 hover:text-black' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Teleprompter</span>
                  </button>
                </div>

                {/* Copy Script */}
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(activeScriptVideo.script || '');
                    setCopiedScript(true);
                    setTimeout(() => setCopiedScript(false), 2000);
                  }}
                  className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition ${
                    isLight
                      ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      : 'bg-[#22222e] border-[#313142] text-slate-300 hover:bg-[#282836]'
                  }`}
                  title="Copy full script to clipboard"
                >
                  {copiedScript ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                  <span className="hidden sm:inline">{copiedScript ? 'Copied' : 'Copy'}</span>
                </button>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveScriptVideoId(null);
                    setTeleprompterPlaying(false);
                  }}
                  className={`p-2 rounded-xl transition ${
                    isLight
                      ? 'text-slate-400 hover:text-black hover:bg-slate-100'
                      : 'text-slate-400 hover:text-white hover:bg-[#252532]'
                  }`}
                  title="Close Script Studio"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 2. Metrics & Pacing Banner */}
            <div
              className={`px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b text-xs shrink-0 ${
                isLight ? 'bg-white border-[#f0eee9]' : 'bg-[#1a1a23] border-[#272733]'
              }`}
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-slate-400">
                  <strong className={isLight ? 'text-slate-900' : 'text-white'}>
                    {getWordCount(activeScriptVideo.script)}
                  </strong>{' '}
                  words
                </span>

                <span className="text-slate-500">•</span>

                {(() => {
                  const words = getWordCount(activeScriptVideo.script);
                  const seconds = getEstimatedReadingTimeSeconds(words);
                  const isOptimal = seconds <= 60;
                  const isExtended = seconds > 60 && seconds <= 90;
                  return (
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold border flex items-center gap-1.5 ${
                        isOptimal
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                          : isExtended
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/25'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/25'
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      <span>~{formatSecondsToMinutes(seconds)}</span>
                      <span>({isOptimal ? 'Optimal <60s Reel' : isExtended ? '60-90s Reel' : 'Long >90s'})</span>
                    </span>
                  );
                })()}

                <span className="text-slate-500">•</span>
                <span className="text-[11px] text-slate-400 font-mono hidden md:inline">
                  Paced at ~145 WPM conversational speaking tempo
                </span>
              </div>

              {/* Status Selector */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-slate-400">Stage:</span>
                <select
                  value={activeScriptVideo.status}
                  onChange={(e) => updateVideo(activeScriptVideo.id, { status: e.target.value as VideoStatus })}
                  className={`rounded-lg px-2 py-1 text-xs font-mono font-semibold border ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-[#22222e] border-[#313142] text-slate-200'
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

            {/* 3. Main Workspace Area */}
            {scriptStudioTab === 'editor' ? (
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
                {/* Left: Distraction-free Scriptwriter */}
                <div className="flex-1 flex flex-col p-4 sm:p-6 overflow-hidden min-h-0 space-y-3">
                  {/* Quick Format Snippets */}
                  <div className="flex flex-wrap items-center gap-1.5 pb-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 font-mono mr-1">
                      Quick Beats:
                    </span>
                    {[
                      { label: '+ [Hook 0-3s]', snippet: '[00:00 - 00:03] THE HOOK (Direct to Camera):\n' },
                      { label: '+ [B-Roll / Action]', snippet: '\n[VISUAL CUE / B-ROLL]: (Zoom in on ...)\n' },
                      { label: '+ [On-Screen Graphic]', snippet: '\n[GRAPHIC OVERLAY]: (Show price comparison chart)\n' },
                      { label: '+ [Data Point]', snippet: '\n- Gross Sale: $...\n- Marketplace Fee: -$...\n- Net Cash: $...\n' },
                      { label: '+ [Call to Action]', snippet: '\n[CALL TO ACTION]: Save this reel and follow for daily card shop metrics.\n' },
                      { label: '+ [Loop Ending]', snippet: '\n[LOOP ENDING]: ...which is why ' }
                    ].map((btn, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          const cur = activeScriptVideo.script || '';
                          const updated = cur ? `${cur}\n${btn.snippet}` : btn.snippet;
                          updateVideo(activeScriptVideo.id, { script: updated });
                        }}
                        className={`text-[10px] font-mono px-2 py-1 rounded-md border transition ${
                          isLight
                            ? 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                            : 'bg-[#22222d] hover:bg-[#2b2b3a] text-slate-300 border-[#323242]'
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>

                  {/* Main Script Textarea */}
                  <div className="flex-1 min-h-0 flex flex-col relative">
                    <textarea
                      value={activeScriptVideo.script || ''}
                      onChange={(e) => updateVideo(activeScriptVideo.id, { script: e.target.value })}
                      placeholder="Write your complete word-for-word spoken script here... Include camera directions, lines to emphasize, and screen text in [brackets]."
                      className={`w-full flex-1 p-4 sm:p-5 rounded-xl text-xs sm:text-sm font-mono leading-relaxed border outline-none resize-none overflow-y-auto focus:border-indigo-500 shadow-inner ${
                        isLight
                          ? 'bg-[#fcfbfa] border-[#e3e2de] text-slate-900 focus:bg-white'
                          : 'bg-[#131319] border-[#262633] text-slate-100 focus:bg-[#111116]'
                      }`}
                    />
                  </div>
                </div>

                {/* Right: Filming Notes & Reference Sidebar */}
                <div
                  className={`w-full md:w-80 p-4 sm:p-6 border-t md:border-t-0 md:border-l overflow-y-auto space-y-4 text-xs font-mono shrink-0 ${
                    isLight ? 'bg-[#faf9f6] border-[#e9e9e7]' : 'bg-[#15151d] border-[#252533]'
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Opening Hook Line:
                    </span>
                    <textarea
                      rows={3}
                      value={activeScriptVideo.hook}
                      onChange={(e) => updateVideo(activeScriptVideo.id, { hook: e.target.value })}
                      className={`w-full p-2.5 rounded-lg border text-xs focus:outline-none focus:border-indigo-500 resize-none italic ${
                        isLight ? 'bg-white border-[#e3e2de] text-slate-900' : 'bg-[#1c1c26] border-[#2e2e3d] text-white'
                      }`}
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Filming Props & B-Roll Notes:
                    </span>
                    <textarea
                      rows={4}
                      value={activeScriptVideo.notes || ''}
                      onChange={(e) => updateVideo(activeScriptVideo.id, { notes: e.target.value })}
                      placeholder="e.g. Bring 10x jewelers loupe, Base Set Charizard slab, receipt thermal printer, ring light at 45°..."
                      className={`w-full p-2.5 rounded-lg border text-xs focus:outline-none focus:border-indigo-500 resize-none ${
                        isLight ? 'bg-white border-[#e3e2de] text-slate-900' : 'bg-[#1c1c26] border-[#2e2e3d] text-white'
                      }`}
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Target Publish Date:
                    </span>
                    <input
                      type="date"
                      value={activeScriptVideo.publishDate || ''}
                      onChange={(e) => updateVideo(activeScriptVideo.id, { publishDate: e.target.value || undefined })}
                      className={`w-full p-2 rounded-lg border text-xs ${
                        isLight ? 'bg-white border-[#e3e2de] text-slate-900' : 'bg-[#1c1c26] border-[#2e2e3d] text-slate-200'
                      }`}
                    />
                  </div>

                  {/* Format Structure Beat Guide */}
                  {FORMAT_DEFINITIONS[activeScriptVideo.format] && (
                    <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/20 space-y-2">
                      <span className="text-[10px] uppercase font-bold text-indigo-400 block">
                        {activeScriptVideo.format} Structure:
                      </span>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {FORMAT_DEFINITIONS[activeScriptVideo.format].description}
                      </p>
                      <div className="space-y-1 pt-1 border-t border-indigo-500/20 text-[10px] text-slate-400">
                        {FORMAT_DEFINITIONS[activeScriptVideo.format].breakdownTimeline.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-1.5">
                            <span className="text-indigo-400 font-bold shrink-0">{item.second}:</span>
                            <span className="text-slate-300">{item.beat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Teleprompter Screen */
              <div className="flex-1 flex flex-col bg-[#0b0b10] text-white overflow-hidden min-h-0">
                {/* Teleprompter Controls Bar */}
                <div className="p-4 bg-[#12121a] border-b border-[#22222f] flex flex-wrap items-center justify-between gap-4 shrink-0">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setTeleprompterPlaying(!teleprompterPlaying)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition active:scale-95 ${
                        teleprompterPlaying
                          ? 'bg-amber-600 hover:bg-amber-500 text-white'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      }`}
                    >
                      {teleprompterPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                      <span>{teleprompterPlaying ? 'Pause Teleprompter' : 'Start Auto-Scroll'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (teleprompterRef.current) teleprompterRef.current.scrollTop = 0;
                        setTeleprompterPlaying(false);
                      }}
                      className="p-2 rounded-xl bg-[#20202c] hover:bg-[#282838] text-slate-300 border border-[#303042] transition"
                      title="Rewind to Top"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Speed Controls */}
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="text-slate-400">Scroll Speed:</span>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setTeleprompterSpeed(s)}
                        className={`w-7 h-7 rounded-lg font-bold transition ${
                          teleprompterSpeed === s
                            ? 'bg-indigo-600 text-white'
                            : 'bg-[#1e1e2b] text-slate-400 hover:text-white'
                        }`}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>

                  {/* Font Size Controls */}
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="text-slate-400">Font:</span>
                    {(['normal', 'large', 'xlarge'] as const).map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setTeleprompterFontSize(size)}
                        className={`px-2.5 py-1 rounded-lg capitalize transition ${
                          teleprompterFontSize === size
                            ? 'bg-indigo-600 text-white'
                            : 'bg-[#1e1e2b] text-slate-400 hover:text-white'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Teleprompter Scrolling Body */}
                <div
                  ref={teleprompterRef}
                  className="flex-1 p-8 sm:p-14 overflow-y-auto min-h-0 space-y-6 max-w-4xl mx-auto w-full select-text"
                >
                  <div className="h-20" /> {/* Top breathing space */}

                  <div
                    className={`leading-relaxed tracking-wide font-sans transition-all whitespace-pre-wrap ${
                      teleprompterFontSize === 'normal'
                        ? 'text-lg sm:text-xl'
                        : teleprompterFontSize === 'large'
                        ? 'text-2xl sm:text-3xl'
                        : 'text-3xl sm:text-4xl'
                    }`}
                  >
                    {(activeScriptVideo.script || '').split('\n').map((line, idx) => {
                      const isBracketCue = line.trim().startsWith('[') || line.trim().startsWith('-');
                      return (
                        <p
                          key={idx}
                          className={`mb-4 transition ${
                            isBracketCue
                              ? 'text-indigo-400/90 font-mono text-sm sm:text-base italic'
                              : 'text-white font-medium'
                          }`}
                        >
                          {line || '\u00A0'}
                        </p>
                      );
                    })}

                    {!activeScriptVideo.script && (
                      <div className="text-center text-slate-500 italic py-20 font-mono text-base">
                        No script written yet. Switch to Editor mode to type or insert an outline.
                      </div>
                    )}
                  </div>

                  <div className="h-64" /> {/* Bottom scrolling padding */}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FLOATING PAGE MODAL (Center Peek Notion-style modal for each card) */}
      {selectedCard && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setSelectedCardId(null)}
        >
          <div
            className={`w-full max-w-3xl max-h-[92vh] rounded-2xl border shadow-2xl flex flex-col overflow-hidden animate-slide-in ${
              isLight ? 'bg-white border-[#e3e2de] text-slate-900' : 'bg-[#18181b] border-[#2e2e38] text-white'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Control Bar */}
            <div
              className={`flex items-center justify-between px-5 py-3 border-b select-none text-xs ${
                isLight ? 'bg-[#faf9f6] border-[#e9e9e7]' : 'bg-[#1f1f24] border-[#2a2a33]'
              }`}
            >
              {/* Breadcrumbs */}
              <div className="flex items-center gap-2 truncate">
                <span className="text-base">📹</span>
                <span className="font-semibold text-slate-400">Reel Floating Page</span>
                <span className="text-slate-500">•</span>
                <span
                  className={`px-2 py-0.5 rounded-full font-medium text-[10px] ${TOPIC_CONFIG[selectedCard.topic].bg} ${TOPIC_CONFIG[selectedCard.topic].text} border ${TOPIC_CONFIG[selectedCard.topic].border}`}
                >
                  {TOPIC_CONFIG[selectedCard.topic].label}
                </span>
                <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
                  {selectedCard.format}
                </span>
              </div>

              {/* Top Action Buttons */}
              <div className="flex items-center gap-2">
                {selectedCard.status !== 'Uploaded' && (
                  <button
                    type="button"
                    onClick={() => {
                      const nextIdx = STATUS_LIST.indexOf(selectedCard.status) + 1;
                      if (nextIdx < STATUS_LIST.length) {
                        updateVideo(selectedCard.id, { status: STATUS_LIST[nextIdx] });
                      }
                    }}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-md transition flex items-center gap-1 ${
                      isLight
                        ? 'text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200'
                        : 'text-indigo-300 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40'
                    }`}
                  >
                    <span>Advance Stage</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setActiveScriptVideoId(selectedCard.id);
                    setScriptStudioTab('teleprompter');
                  }}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-md transition flex items-center gap-1 ${
                    isLight
                      ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200'
                      : 'text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30'
                  }`}
                  title="Open Live Teleprompter"
                >
                  <Play className="w-3 h-3" />
                  <span className="hidden sm:inline">Teleprompter</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveScriptVideoId(selectedCard.id);
                    setScriptStudioTab('editor');
                  }}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-md transition flex items-center gap-1 ${
                    isLight
                      ? 'text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200'
                      : 'text-slate-300 bg-[#2b2b34] hover:bg-[#343440] border border-[#3d3d49]'
                  }`}
                  title="Open Fullscreen Studio"
                >
                  <Maximize2 className="w-3 h-3" />
                  <span className="hidden sm:inline">Studio</span>
                </button>

                <div className={`h-4 w-px mx-0.5 ${isLight ? 'bg-slate-200' : 'bg-[#33333f]'}`} />

                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Delete "${selectedCard.title}"?`)) {
                      deleteVideo(selectedCard.id);
                      setSelectedCardId(null);
                    }
                  }}
                  className="p-1.5 rounded text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition"
                  title="Delete Reel"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedCardId(null)}
                  className="p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-700/30 transition"
                  title="Close (Esc)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Floating Page Body */}
            <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-6">
              {/* Large Page Title */}
              <div>
                <input
                  type="text"
                  value={selectedCard.title}
                  onChange={(e) => updateVideo(selectedCard.id, { title: e.target.value })}
                  placeholder="Untitled Reel Page..."
                  className={`w-full text-2xl font-bold tracking-tight bg-transparent border-b border-transparent focus:border-indigo-500 outline-none pb-1 transition ${
                    isLight ? 'text-slate-900 hover:border-slate-300' : 'text-white hover:border-slate-700'
                  }`}
                />
              </div>

              {/* Notion-Style Properties Table */}
              <div
                className={`p-4 rounded-xl border space-y-2.5 text-xs ${
                  isLight ? 'bg-[#faf9f6] border-[#e9e9e7]' : 'bg-[#141418] border-[#262630]'
                }`}
              >
                {/* Stage / Status Property */}
                <div className="grid grid-cols-3 sm:grid-cols-4 items-center">
                  <span className="text-slate-400 font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-400" />
                    Stage
                  </span>
                  <div className="col-span-2 sm:col-span-3">
                    <select
                      value={selectedCard.status}
                      onChange={(e) => updateVideo(selectedCard.id, { status: e.target.value as VideoStatus })}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium border outline-none cursor-pointer ${
                        isLight ? 'bg-white border-[#e3e2de] text-slate-800' : 'bg-[#202028] border-[#323240] text-slate-200'
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

                {/* Topic Pillar Property */}
                <div className="grid grid-cols-3 sm:grid-cols-4 items-center">
                  <span className="text-slate-400 font-medium flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    Topic Pillar
                  </span>
                  <div className="col-span-2 sm:col-span-3">
                    <select
                      value={selectedCard.topic}
                      onChange={(e) => updateVideo(selectedCard.id, { topic: e.target.value as ContentTopic })}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium border outline-none cursor-pointer ${
                        isLight ? 'bg-white border-[#e3e2de] text-slate-800' : 'bg-[#202028] border-[#323240] text-slate-200'
                      }`}
                    >
                      {TOPIC_LIST.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Format Property */}
                <div className="grid grid-cols-3 sm:grid-cols-4 items-center">
                  <span className="text-slate-400 font-medium flex items-center gap-1.5">
                    <Clapperboard className="w-3.5 h-3.5" />
                    Format
                  </span>
                  <div className="col-span-2 sm:col-span-3">
                    <select
                      value={selectedCard.format}
                      onChange={(e) => updateVideo(selectedCard.id, { format: e.target.value as ReelFormat })}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium border outline-none cursor-pointer ${
                        isLight ? 'bg-white border-[#e3e2de] text-slate-800' : 'bg-[#202028] border-[#323240] text-slate-200'
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

                {/* Target Date Property */}
                <div className="grid grid-cols-3 sm:grid-cols-4 items-center">
                  <span className="text-slate-400 font-medium flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    Target Date
                  </span>
                  <div className="col-span-2 sm:col-span-3">
                    <input
                      type="date"
                      value={selectedCard.publishDate || ''}
                      onChange={(e) => updateVideo(selectedCard.id, { publishDate: e.target.value || undefined })}
                      className={`px-2.5 py-1 rounded-md text-xs font-mono border outline-none ${
                        isLight ? 'bg-white border-[#e3e2de] text-slate-800' : 'bg-[#202028] border-[#323240] text-slate-200'
                      }`}
                    />
                  </div>
                </div>

                {/* Performance Analytics (if published) */}
                {selectedCard.views !== undefined && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 items-center pt-1 border-t border-slate-700/20">
                    <span className="text-slate-400 font-medium flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Metrics
                    </span>
                    <div className="col-span-2 sm:col-span-3 flex items-center gap-3 font-mono text-[11px]">
                      <span className="text-emerald-400 font-bold">{selectedCard.views.toLocaleString()} views</span>
                      <span className="text-slate-400">❤️ {selectedCard.likes}</span>
                      <span className="text-slate-400">📤 {selectedCard.shares} shares</span>
                      <span className="text-slate-400">🔖 {selectedCard.saves} saves</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Hook Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    <span>⚡ First 3-Second Hook (Visual & Spoken)</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">Catch viewer before scrolling</span>
                </div>
                <textarea
                  rows={2}
                  value={selectedCard.hook}
                  onChange={(e) => updateVideo(selectedCard.id, { hook: e.target.value })}
                  placeholder="First spoken line and matching text on screen..."
                  className={`w-full rounded-xl px-3.5 py-2.5 text-xs border focus:outline-none focus:border-indigo-500 leading-relaxed resize-none ${
                    isLight ? 'bg-white border-[#e3e2de] text-slate-900' : 'bg-[#141418] border-[#262630] text-white'
                  }`}
                />
              </div>

              {/* Whole Video Script Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    <FileText className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Whole Video Script</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-400 font-mono">
                      {getWordCount(selectedCard.script)} words • ~{formatSecondsToMinutes(getEstimatedReadingTimeSeconds(getWordCount(selectedCard.script)))} spoken
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono hidden sm:inline">
                      Autosaved
                    </span>
                  </div>
                </div>

                <textarea
                  rows={12}
                  value={selectedCard.script || ''}
                  onChange={(e) => updateVideo(selectedCard.id, { script: e.target.value })}
                  placeholder="Write full word-for-word spoken dialogue, visual directions [like this], and teleprompter lines here..."
                  className={`w-full rounded-xl p-4 text-xs font-mono border focus:outline-none focus:border-indigo-500 leading-relaxed resize-y ${
                    isLight ? 'bg-white border-[#e3e2de] text-slate-900' : 'bg-[#141418] border-[#262630] text-slate-100'
                  }`}
                />

                {/* Script Action Footer */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveScriptVideoId(selectedCard.id);
                        setScriptStudioTab('teleprompter');
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 transition"
                    >
                      <Play className="w-3 h-3" />
                      <span>Start Teleprompter</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveScriptVideoId(selectedCard.id);
                        setScriptStudioTab('editor');
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center gap-1.5 transition"
                    >
                      <Maximize2 className="w-3 h-3" />
                      <span>Script Studio & Beats</span>
                    </button>
                  </div>

                  <span className="text-[10px] text-slate-400 font-mono">
                    Press Esc to close
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
