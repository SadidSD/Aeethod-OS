import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Bot,
  Sparkles,
  Send,
  Plus,
  Settings,
  Trash2,
  Copy,
  Check,
  RotateCcw,
  User,
  Sliders,
  Key,
  Shield,
  Layers,
  Search,
  ExternalLink,
  ChevronDown,
  X,
  RefreshCw,
  Cpu,
  BrainCircuit,
  Award,
  Zap,
  Info,
  Edit3,
  Bookmark,
  Share2,
  Download,
  Eye,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Wand2,
  Database,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

import {
  Persona,
  ApiConfig,
  ChatMessage,
  ChatSession,
  DEFAULT_API_CONFIG,
  INITIAL_PERSONAS,
  MIKAH_PERSONA,
} from '../data/personaChatData';

// Legacy personas to purge from storage
const LEGACY_PERSONA_IDS = new Set([
  'kenji-tcg',
  'alex-saas',
  'elena-systems',
  'marcus-angel',
  'maya-ux',
]);

// Starter templates for fast 1-click persona creation
const PERSONA_STARTER_PRESETS: Array<Omit<Persona, 'id' | 'createdAt'>> = [
  {
    name: 'Market Intelligence Analyst',
    tagline: 'TCG Liquidity, Price Velocity & Arbitrage Specialist',
    avatar: '📊',
    category: 'TCG Specialist',
    systemPrompt: `You are an elite TCG Market Intelligence Analyst. You analyze market spreads, trading card price velocity, buylist margins, graded card premiums, and pop reports. Always provide concrete, data-backed reasoning and evaluate risk before opportunity. Keep answers structured with key takeaways and strategic bullet points.`,
    backstory: 'Veteran market maker and secondary card market quantitative trader with 10+ years across eBay, TCGplayer, and auction houses.',
    speakingStyle: 'Data-driven, precise, quantitative, risk-conscious',
    quirks: ['Calculates spreads on every trade', 'Cites population report scarcity', 'Warns against artificial market manipulation'],
    temperature: 0.7,
    suggestedStarters: [
      'Evaluate the margin spread between raw mint and PSA 10 slabs.',
      'How should we structure buylist pricing for vintage booster boxes?',
      'Identify the highest velocity card categories for cash flow rotation.'
    ],
    badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    isCustom: true,
  },
  {
    name: 'Database & Systems Architect',
    tagline: 'High-Concurrency PostgreSQL, Redis & API Performance',
    avatar: '⚡',
    category: 'Engineering',
    systemPrompt: `You are a Principal Database & Systems Architect. You design ultra-reliable, high-throughput architectures for card inventory, real-time price updates, and transactional APIs. Focus on indexing, read-replicas, cache invalidation, connection pooling, and resilient schema migrations.`,
    backstory: 'Former infrastructure lead handling 40,000+ QPS database clusters and low-latency inventory syncing.',
    speakingStyle: 'Direct, technical, performance-obsessed, architecture-focused',
    quirks: ['Recommends composite B-Tree indexes', 'Hates unindexed foreign keys', 'Emphasizes idempotent webhook processing'],
    temperature: 0.6,
    suggestedStarters: [
      'Design a schema for tracking real-time card price histories.',
      'How to optimize full-text card search across 500,000 items?',
      'What caching strategy prevents database locks during high-traffic drops?'
    ],
    badgeColor: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    isCustom: true,
  },
  {
    name: 'Strategic Moat Advisor',
    tagline: 'Unit Economics, Marketplace Defense & Network Effects',
    avatar: '♟️',
    category: 'Executive',
    systemPrompt: `You are an executive strategic advisor specializing in vertical marketplace defensibility, counter-positioning against incumbents, and capital-efficient scale. You scrutinize transaction take-rates, customer acquisition costs, churn, and sustainable supplier lock-in.`,
    backstory: 'Venture partner and 2x marketplace founder who scaled vertical commerce platforms to profitable exits.',
    speakingStyle: 'Razor-sharp, incisive, strategic, high-leverage',
    quirks: ['Focuses on second-order effects', 'Challenges vanity metrics', 'Demands clear operational wedges'],
    temperature: 0.7,
    suggestedStarters: [
      'How do we counter-position against eBay and TCGplayer?',
      'What prevents card dealers from taking transactions off-platform?',
      'What is our core wedge to reach 200 high-volume power sellers?'
    ],
    badgeColor: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    isCustom: true,
  },
];

export const PersonaChatView: React.FC = () => {
  // Global Vercel Environment API Key support for shared access
  const envGroqKey = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GROQ_API_KEY) || '';

  // 1. Core State: Pre-loaded with Mikah Walters & custom personas
  const [personas, setPersonas] = useState<Persona[]>(() => {
    try {
      const saved = localStorage.getItem('aeethod_custom_personas');
      if (saved) {
        const parsed: Persona[] = JSON.parse(saved);
        const validCustom = parsed.filter(
          (p) => p && p.id && !LEGACY_PERSONA_IDS.has(p.id)
        );
        const hasMikah = validCustom.some((p) => p.id === MIKAH_PERSONA.id);
        if (!hasMikah) {
          return [MIKAH_PERSONA, ...validCustom];
        }
        return validCustom;
      }
    } catch (e) {
      console.error('Error loading custom personas', e);
    }
    return [MIKAH_PERSONA];
  });

  const [activePersonaId, setActivePersonaId] = useState<string | null>(() => {
    return MIKAH_PERSONA.id;
  });

  // Default API configuration set to Groq Llama-3.3-70B
  const [apiConfig, setApiConfig] = useState<ApiConfig>(() => {
    try {
      const saved = localStorage.getItem('aeethod_persona_api_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_API_CONFIG,
          ...parsed,
          provider: 'groq',
          apiKey: parsed.apiKey || envGroqKey,
          model: parsed.model || 'llama-3.3-70b-versatile',
          baseUrl: 'https://api.groq.com/openai/v1',
        };
      }
    } catch {}
    return {
      ...DEFAULT_API_CONFIG,
      apiKey: envGroqKey || DEFAULT_API_CONFIG.apiKey,
    };
  });

  const [quickKeyInput, setQuickKeyInput] = useState('');

  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem('aeethod_persona_chat_sessions');
      if (saved) {
        const parsed: ChatSession[] = JSON.parse(saved);
        const filtered = parsed.filter(
          (s) => s && s.personaId && !LEGACY_PERSONA_IDS.has(s.personaId)
        );
        if (filtered.length > 0) return filtered;
      }
    } catch {}
    return [
      {
        id: 'session-mikah-initial',
        title: 'Chat with Mikah Walters (SortSwift)',
        personaId: MIKAH_PERSONA.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: [],
      },
    ];
  });

  const [activeSessionId, setActiveSessionId] = useState<string | null>(() => {
    return 'session-mikah-initial';
  });

  const [inputMessage, setInputMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);

  // Modals & Drawers
  const [isApiSettingsOpen, setIsApiSettingsOpen] = useState(false);
  const [isCreatePersonaOpen, setIsCreatePersonaOpen] = useState(false);
  const [isPersonaDrawerOpen, setIsPersonaDrawerOpen] = useState(false);
  const [editingPersona, setEditingPersona] = useState<Persona | null>(null);
  const [sessionSearch, setSessionSearch] = useState('');
  const [apiTestStatus, setApiTestStatus] = useState<{ loading: boolean; success?: boolean; message?: string }>({
    loading: false,
  });

  // Persona Creation Form State
  const [newPersona, setNewPersona] = useState<Partial<Persona>>({
    name: '',
    tagline: '',
    avatar: '🤖',
    category: 'Custom',
    systemPrompt: '',
    backstory: '',
    speakingStyle: 'Analytical, concise, actionable',
    quirks: [],
    temperature: 0.7,
    suggestedStarters: [
      'Analyze the strategy and suggest 3 high-impact moves.',
      'What are the primary risks with this approach?',
      'Draft a detailed implementation framework.'
    ],
    badgeColor: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
  });

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Save Personas to localStorage whenever updated
  useEffect(() => {
    const validOnes = personas.filter((p) => p && !LEGACY_PERSONA_IDS.has(p.id));
    localStorage.setItem('aeethod_custom_personas', JSON.stringify(validOnes));
  }, [personas]);

  // Save API config to localStorage
  useEffect(() => {
    localStorage.setItem('aeethod_persona_api_config', JSON.stringify(apiConfig));
  }, [apiConfig]);

  // Save sessions to localStorage
  useEffect(() => {
    const validSessions = sessions.filter((s) => s && !LEGACY_PERSONA_IDS.has(s.personaId));
    localStorage.setItem('aeethod_persona_chat_sessions', JSON.stringify(validSessions));
  }, [sessions]);

  // Active Persona & Session references
  const activePersona: Persona | null =
    personas.find((p) => p.id === activePersonaId) || personas[0] || null;

  const activeSession: ChatSession | null =
    sessions.find((s) => s.id === activeSessionId) ||
    (activePersona ? sessions.find((s) => s.personaId === activePersona.id) : null) ||
    sessions[0] ||
    null;

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession?.messages, isGenerating]);

  const effectiveApiKey = apiConfig.apiKey?.trim() || envGroqKey.trim();
  const isUsingEnvKey = !apiConfig.apiKey?.trim() && Boolean(envGroqKey.trim());

  // Quick Key Save Handler
  const handleSaveQuickKey = () => {
    if (!quickKeyInput.trim()) return;
    const cleanKey = quickKeyInput.trim();
    setApiConfig((prev) => ({
      ...prev,
      provider: 'groq',
      apiKey: cleanKey,
      model: 'llama-3.3-70b-versatile',
      baseUrl: 'https://api.groq.com/openai/v1',
    }));
    setQuickKeyInput('');
  };

  // Create New Session
  const handleCreateNewSession = (personaId?: string) => {
    const targetPersona =
      personas.find((p) => p.id === personaId) || activePersona || personas[0];

    if (!targetPersona) {
      setIsCreatePersonaOpen(true);
      return;
    }

    const newSessionId = `session-${Date.now()}`;
    const newSession: ChatSession = {
      id: newSessionId,
      title: `Chat with ${targetPersona.name}`,
      personaId: targetPersona.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [],
    };

    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSessionId);
    setActivePersonaId(targetPersona.id);
  };

  // Delete Session
  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = sessions.filter((s) => s.id !== id);
    setSessions(filtered);
    if (activeSessionId === id) {
      setActiveSessionId(filtered[0]?.id || null);
    }
  };

  // Clear Current Session Messages
  const handleClearCurrentSession = () => {
    if (!activeSession) return;
    setSessions((prev) =>
      prev.map((s) => (s.id === activeSession.id ? { ...s, messages: [], updatedAt: new Date().toISOString() } : s))
    );
  };

  // Real Streaming LLM API Caller via Fetch & ReadableStream
  const callRealApiStream = async (
    persona: Persona,
    history: ChatMessage[],
    config: ApiConfig,
    onChunk: (accumulatedText: string) => void
  ): Promise<string> => {
    const keyToUse = config.apiKey?.trim() || envGroqKey.trim();
    if (!keyToUse) {
      throw new Error('Groq API Key is required. Please paste your key to enable live LLM simulation.');
    }

    const endpoint =
      config.provider === 'groq'
        ? 'https://api.groq.com/openai/v1/chat/completions'
        : config.provider === 'openrouter'
        ? 'https://openrouter.ai/api/v1/chat/completions'
        : `${config.baseUrl.replace(/\/+$/, '')}/chat/completions`;

    const modelToUse =
      config.model || (config.provider === 'groq' ? 'llama-3.3-70b-versatile' : 'gpt-4o');

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${keyToUse}`,
      },
      body: JSON.stringify({
        model: modelToUse,
        temperature: config.temperature ?? 0.7,
        max_tokens: config.maxTokens ?? 1024,
        stream: true,
        messages: [
          { role: 'system', content: persona.systemPrompt },
          ...history.map((m) => ({ role: m.role, content: m.content })),
        ],
      }),
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.error?.message || `Groq API returned HTTP ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('Response stream not available from endpoint');

    const decoder = new TextDecoder('utf-8');
    let accumulated = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith(':')) continue;
        if (trimmed === 'data: [DONE]') break;
        if (trimmed.startsWith('data: ')) {
          try {
            const parsed = JSON.parse(trimmed.slice(6));
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              accumulated += delta;
              onChunk(accumulated);
            }
          } catch {
            // Partial JSON line
          }
        }
      }
    }

    return accumulated;
  };

  // Send Message Logic (100% LLM-Based with Real Streaming)
  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || inputMessage).trim();
    if (!messageContent || isGenerating || !activePersona) return;

    setInputMessage('');

    // Ensure valid session exists
    let currentSession = activeSession;
    let currentSessionId = activeSessionId;

    if (!currentSession) {
      const newSessionId = `session-${Date.now()}`;
      currentSession = {
        id: newSessionId,
        title: messageContent.slice(0, 30) + (messageContent.length > 30 ? '...' : ''),
        personaId: activePersona.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: [],
      };
      setSessions([currentSession, ...sessions]);
      setActiveSessionId(newSessionId);
      currentSessionId = newSessionId;
    }

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: messageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedTitle =
      currentSession.messages.length === 0
        ? messageContent.slice(0, 32) + (messageContent.length > 32 ? '...' : '')
        : currentSession.title;

    const newMessages = [...currentSession.messages, userMessage];

    // If no key is configured, prompt user to add their Groq key
    if (!effectiveApiKey) {
      const keyPromptMsg: ChatMessage = {
        id: `msg-resp-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ **Groq API Key Required for Live Simulation:**

To chat with **${activePersona.name}** in a true live LLM simulation, please connect your Groq API Key:

1. Grab a free API key at **[console.groq.com/keys](https://console.groq.com/keys)** (Takes 10 seconds, zero payment needed).
2. Paste your key in the top amber bar and click **Connect**.
3. Or configure \`VITE_GROQ_API_KEY\` in your Vercel project settings for instant public access across all visitors.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        personaId: activePersona.id,
        modelUsed: 'groq:unauthenticated',
        isSimulated: false,
      };

      setSessions((prev) =>
        prev.map((s) =>
          s.id === currentSessionId
            ? {
                ...s,
                title: updatedTitle,
                messages: [...newMessages, keyPromptMsg],
                updatedAt: new Date().toISOString(),
              }
            : s
        )
      );
      return;
    }

    // Placeholder assistant message for streaming
    const assistantMsgId = `msg-resp-${Date.now()}`;
    const initialAssistantMsg: ChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      personaId: activePersona.id,
      modelUsed: `${apiConfig.provider}:${apiConfig.model}`,
      isSimulated: false,
    };

    // Optimistically update session with user message and empty streaming bubble
    setSessions((prev) =>
      prev.map((s) =>
        s.id === currentSessionId
          ? {
              ...s,
              title: updatedTitle,
              messages: [...newMessages, initialAssistantMsg],
              updatedAt: new Date().toISOString(),
            }
          : s
      )
    );

    setIsGenerating(true);

    try {
      // Real streaming call to Groq LLM
      await callRealApiStream(
        activePersona,
        newMessages,
        { ...apiConfig, apiKey: effectiveApiKey },
        (accumulatedText) => {
          setSessions((prev) =>
            prev.map((s) =>
              s.id === currentSessionId
                ? {
                    ...s,
                    messages: s.messages.map((m) =>
                      m.id === assistantMsgId ? { ...m, content: accumulatedText } : m
                    ),
                  }
                : s
            )
          );
        }
      );
    } catch (err: any) {
      console.error('LLM API Error:', err);
      const errorMsg: ChatMessage = {
        id: assistantMsgId,
        role: 'assistant',
        content: `⚠️ **Groq LLM Connection Error:** ${err.message || 'API stream connection failed'}.

Please verify your Groq API Key or check your rate limits at [console.groq.com](https://console.groq.com).`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        personaId: activePersona.id,
        modelUsed: `${apiConfig.provider}:${apiConfig.model}`,
        isSimulated: false,
      };

      setSessions((prev) =>
        prev.map((s) =>
          s.id === currentSessionId
            ? {
                ...s,
                messages: s.messages.map((m) => (m.id === assistantMsgId ? errorMsg : m)),
                updatedAt: new Date().toISOString(),
              }
            : s
        )
      );
    } finally {
      setIsGenerating(false);
      inputRef.current?.focus();
    }
  };

  // Test API Connection
  const handleTestApi = async () => {
    setApiTestStatus({ loading: true });
    try {
      const keyToTest = apiConfig.apiKey?.trim() || envGroqKey.trim();
      if (!keyToTest) {
        setApiTestStatus({
          loading: false,
          success: false,
          message: 'Please provide an API Key or add VITE_GROQ_API_KEY in Vercel to test connection.',
        });
        return;
      }

      const probePersona: Persona = activePersona || MIKAH_PERSONA;

      const res = await callRealApiStream(
        probePersona,
        [{ id: 'test', role: 'user', content: 'Say "GROQ_LLM_CONNECTED" in 3 words or less.', timestamp: '' }],
        { ...apiConfig, apiKey: keyToTest, maxTokens: 25 },
        () => {}
      );

      setApiTestStatus({
        loading: false,
        success: true,
        message: `Success! Groq live model response: "${res.slice(0, 50)}..."`,
      });
    } catch (err: any) {
      setApiTestStatus({
        loading: false,
        success: false,
        message: `Error: ${err.message}`,
      });
    }
  };

  // Copy Message Text
  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  // Export Chat Session
  const handleExportSession = (format: 'markdown' | 'json') => {
    if (!activeSession || !activePersona) return;
    let content = '';
    let filename = `${activeSession.title.replace(/[^a-zA-Z0-9_-]/g, '_')}`;

    if (format === 'markdown') {
      content = `# ${activeSession.title}\n`;
      content += `*Persona: ${activePersona.name} (${activePersona.tagline})*\n`;
      content += `*Date: ${new Date(activeSession.createdAt).toLocaleString()}*\n\n---\n\n`;
      activeSession.messages.forEach((m) => {
        content += `### ${m.role === 'user' ? 'User' : activePersona.name} (${m.timestamp})\n`;
        content += `${m.content}\n\n`;
      });
      filename += '.md';
    } else {
      content = JSON.stringify(activeSession, null, 2);
      filename += '.json';
    }

    const blob = new Blob([content], { type: format === 'markdown' ? 'text/markdown' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Open Create Modal with a preset
  const handleOpenPreset = (preset: Omit<Persona, 'id' | 'createdAt'>) => {
    setEditingPersona(null);
    setNewPersona({
      ...preset,
    });
    setIsCreatePersonaOpen(true);
  };

  // Save / Update Persona
  const handleSaveCustomPersona = () => {
    if (!newPersona.name?.trim() || !newPersona.systemPrompt?.trim()) {
      alert('Persona Name and Core System Prompt are required!');
      return;
    }

    if (editingPersona) {
      // Update existing
      setPersonas((prev) =>
        prev.map((p) =>
          p.id === editingPersona.id
            ? ({
                ...p,
                ...newPersona,
                id: p.id,
                isCustom: p.id === MIKAH_PERSONA.id ? false : true,
              } as Persona)
            : p
        )
      );
    } else {
      // Create new
      const created: Persona = {
        id: `persona-${Date.now()}`,
        name: newPersona.name.trim(),
        tagline: newPersona.tagline?.trim() || 'Custom Expert in Aeethod OS',
        avatar: newPersona.avatar?.trim() || '🤖',
        category: (newPersona.category as any) || 'Custom',
        systemPrompt: newPersona.systemPrompt.trim(),
        backstory: newPersona.backstory?.trim() || 'Custom created persona for LLM simulation in Aeethod OS.',
        speakingStyle: newPersona.speakingStyle?.trim() || 'Concise and informative',
        quirks: newPersona.quirks && newPersona.quirks.length > 0 ? newPersona.quirks : ['Custom analytical mindset'],
        temperature: newPersona.temperature ?? 0.7,
        suggestedStarters:
          newPersona.suggestedStarters && newPersona.suggestedStarters.length > 0
            ? newPersona.suggestedStarters
            : ['Analyze the strategy and suggest 3 high-impact moves.', 'What are key risks with this approach?'],
        badgeColor: newPersona.badgeColor || 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
        createdAt: new Date().toISOString(),
        isCustom: true,
      };

      setPersonas((prev) => [...prev, created]);
      setActivePersonaId(created.id);

      // Create initial chat session
      const newSessionId = `session-${Date.now()}`;
      const newSession: ChatSession = {
        id: newSessionId,
        title: `Chat with ${created.name}`,
        personaId: created.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: [],
      };
      setSessions((prev) => [newSession, ...prev]);
      setActiveSessionId(newSessionId);
    }

    setIsCreatePersonaOpen(false);
    setEditingPersona(null);
  };

  // Open Edit Persona Modal
  const handleEditPersona = (persona: Persona, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingPersona(persona);
    setNewPersona({ ...persona });
    setIsCreatePersonaOpen(true);
  };

  // Delete Custom Persona
  const handleDeleteCustomPersona = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (id === MIKAH_PERSONA.id) {
      if (!confirm('Are you sure you want to remove Mikah Walters? You can reload him anytime.')) return;
    } else {
      if (!confirm('Are you sure you want to delete this persona?')) return;
    }
    const remaining = personas.filter((p) => p.id !== id);
    setPersonas(remaining);
    if (activePersonaId === id) {
      setActivePersonaId(remaining[0]?.id || null);
    }
  };

  // Filtered Sessions
  const filteredSessions = sessions.filter((s) => {
    if (!sessionSearch.trim()) return true;
    const q = sessionSearch.toLowerCase();
    const persona = personas.find((p) => p.id === s.personaId);
    return (
      s.title.toLowerCase().includes(q) ||
      persona?.name.toLowerCase().includes(q) ||
      s.messages.some((m) => m.content.toLowerCase().includes(q))
    );
  });

  return (
    <div className="flex h-full w-full bg-[#191919] text-[#e6e6e6] overflow-hidden select-text">
      {/* ======================================================== */}
      {/* 1. LEFT SIDEBAR: SESSIONS & PERSONA DIRECTORY */}
      {/* ======================================================== */}
      <div className="w-72 bg-[#202020] border-r border-[#2e2e2e] flex flex-col justify-between shrink-0 h-full">
        {/* Top Header & Actions */}
        <div className="p-3 border-b border-[#2e2e2e] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="font-bold text-xs text-white uppercase tracking-wider block">Persona Studio</span>
                <span className="text-[9px] text-[#787774] font-mono">Analytics & Databases</span>
              </div>
            </div>

            <button
              onClick={() => setIsApiSettingsOpen(true)}
              className="p-1 px-1.5 rounded text-[#9b9b9b] hover:text-white hover:bg-[#2c2c2c] transition flex items-center gap-1 text-[11px]"
              title="Groq API & Model Settings"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-mono text-[10px] text-amber-300 uppercase">
                {apiConfig.provider === 'groq' ? 'GROQ' : apiConfig.provider}
              </span>
            </button>
          </div>

          {/* New Chat Button */}
          <button
            onClick={() => handleCreateNewSession()}
            className="w-full py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-sm shadow-indigo-600/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Chat Session</span>
          </button>

          {/* Search Sessions */}
          <div className="relative">
            <Search className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#787774]" />
            <input
              type="text"
              value={sessionSearch}
              onChange={(e) => setSessionSearch(e.target.value)}
              placeholder="Search chat sessions..."
              className="w-full bg-[#191919] border border-[#2e2e2e] rounded-md pl-7 pr-2.5 py-1 text-xs text-[#e6e6e6] placeholder-[#6e6e6e] focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Personas Carousel Header */}
        <div className="px-3 pt-3 pb-2 border-b border-[#2e2e2e]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#787774]">
              Personas ({personas.length})
            </span>
            <button
              onClick={() => {
                setEditingPersona(null);
                setNewPersona({
                  name: '',
                  tagline: '',
                  avatar: '🤖',
                  category: 'Custom',
                  systemPrompt: '',
                  backstory: '',
                  speakingStyle: 'Direct, analytical, structured',
                  quirks: [],
                  temperature: 0.7,
                  suggestedStarters: [
                    'Analyze the strategy and suggest 3 high-impact moves.',
                    'What are the primary risks with this approach?',
                    'Draft a detailed implementation framework.'
                  ],
                  badgeColor: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
                });
                setIsCreatePersonaOpen(true);
              }}
              className="text-[11px] font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer font-semibold"
            >
              <Plus className="w-3 h-3" />
              <span>+ Create</span>
            </button>
          </div>

          {/* Horizontal mini persona avatar strip */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {personas.map((p) => {
              const isSelected = p.id === activePersona?.id;
              const isMikah = p.id === MIKAH_PERSONA.id;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setActivePersonaId(p.id);
                    if (activeSession && activeSession.messages.length === 0) {
                      setSessions((prev) =>
                        prev.map((s) => (s.id === activeSession.id ? { ...s, personaId: p.id, title: `Chat with ${p.name}` } : s))
                      );
                    } else {
                      handleCreateNewSession(p.id);
                    }
                  }}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-amber-600/30 border-2 border-amber-500 shadow-sm scale-105'
                      : 'bg-[#282828] hover:bg-[#323232] border border-[#383838]'
                  }`}
                  title={`${p.name} (${p.tagline})`}
                >
                  <span>{p.avatar}</span>
                  {isMikah ? (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400" title="SortSwift Founder" />
                  ) : (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Chat Sessions List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          <div className="px-2 py-1 text-[10px] font-mono font-semibold uppercase tracking-wider text-[#787774]">
            Recent Sessions
          </div>

          {filteredSessions.map((session) => {
            const persona = personas.find((p) => p.id === session.personaId);
            const isActive = session.id === activeSessionId;
            const lastMessage = session.messages[session.messages.length - 1];

            return (
              <div
                key={session.id}
                onClick={() => {
                  setActiveSessionId(session.id);
                  setActivePersonaId(session.personaId);
                }}
                className={`group p-2 rounded-lg cursor-pointer transition flex items-start justify-between gap-2 border ${
                  isActive
                    ? 'bg-[#282828] border-indigo-500/40 text-white'
                    : 'bg-transparent hover:bg-[#252525] border-transparent text-[#9b9b9b]'
                }`}
              >
                <div className="flex items-start gap-2.5 min-w-0 flex-1">
                  <span className="text-base shrink-0 mt-0.5">{persona?.avatar || '🤖'}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-semibold truncate ${isActive ? 'text-white' : 'text-[#d4d4d4]'}`}>
                        {session.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#787774] truncate mt-0.5">
                      {lastMessage
                        ? lastMessage.content.replace(/[#*`_]/g, '').slice(0, 42)
                        : `Ready to chat with ${persona?.name || 'Persona'}`}
                    </p>
                  </div>
                </div>

                <button
                  onClick={(e) => handleDeleteSession(session.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded text-[#787774] hover:text-rose-400 hover:bg-[#323232] transition shrink-0"
                  title="Delete Session"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            );
          })}

          {filteredSessions.length === 0 && (
            <div className="p-4 text-center text-xs text-[#787774] italic">
              No chat sessions found.
            </div>
          )}
        </div>

        {/* Bottom Status / Footer */}
        <div className="p-3 border-t border-[#2e2e2e] bg-[#1d1d1d] flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-1.5 text-[#9b9b9b]">
            <span className={`w-2 h-2 rounded-full ${effectiveApiKey ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
            <span className="text-[11px]">
              {apiConfig.provider.toUpperCase()} : {apiConfig.model}
            </span>
          </div>

          <button
            onClick={() => setIsApiSettingsOpen(true)}
            className="p-1 rounded text-[#9b9b9b] hover:text-white transition flex items-center gap-1 text-[11px]"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Config</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. MAIN CHAT AREA */}
      {/* ======================================================== */}
      <div className="flex-1 flex flex-col min-w-0 h-full bg-[#191919]">
        {/* Chat Top Header */}
        <div className="h-14 px-5 border-b border-[#2e2e2e] bg-[#202020] flex items-center justify-between shrink-0 shadow-xs">
          {/* Active Persona Identity */}
          {activePersona ? (
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-[#2a2a2a] border border-[#3a3a3a] flex items-center justify-center text-xl shrink-0 shadow-sm">
                {activePersona.avatar}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-sm text-white truncate">{activePersona.name}</h2>
                  {activePersona.id === MIKAH_PERSONA.id ? (
                    <span className="px-2 py-0.2 rounded text-[10px] font-mono border bg-amber-500/20 text-amber-300 border-amber-500/30 font-semibold">
                      SortSwift Founder
                    </span>
                  ) : (
                    <span className={`px-2 py-0.2 rounded text-[10px] font-mono border ${activePersona.badgeColor}`}>
                      {activePersona.category}
                    </span>
                  )}
                  {activePersona.isCustom && activePersona.id !== MIKAH_PERSONA.id && (
                    <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                      Custom Persona
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#9b9b9b] truncate">{activePersona.tagline}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-sm text-white">Persona Chat Studio</h2>
                <p className="text-[11px] text-[#9b9b9b]">Analytics & Databases • LLM Simulation Engine</p>
              </div>
            </div>
          )}

          {/* Right Action Tools */}
          <div className="flex items-center gap-2 shrink-0">
            {activePersona && (
              <>
                {/* Edit Persona */}
                <button
                  onClick={(e) => handleEditPersona(activePersona, e)}
                  className="p-1.5 rounded-md hover:bg-[#2c2c2c] text-[#9b9b9b] hover:text-white transition"
                  title="Edit Persona Directives & Details"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                {/* View Persona Prompt Drawer Button */}
                <button
                  onClick={() => setIsPersonaDrawerOpen(true)}
                  className="px-2.5 py-1 rounded-md bg-[#282828] hover:bg-[#323232] text-[#d4d4d4] hover:text-white text-xs border border-[#383838] transition flex items-center gap-1.5 cursor-pointer"
                  title="Inspect System Prompt & Persona Traits"
                >
                  <BrainCircuit className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="hidden md:inline">Prompt & Bio</span>
                </button>

                {/* Clear Messages */}
                <button
                  onClick={handleClearCurrentSession}
                  className="p-1.5 rounded-md hover:bg-[#2c2c2c] text-[#9b9b9b] hover:text-white transition"
                  title="Clear Session Messages"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {/* Export Dropdown */}
                <button
                  onClick={() => handleExportSession('markdown')}
                  className="p-1.5 rounded-md hover:bg-[#2c2c2c] text-[#9b9b9b] hover:text-white transition"
                  title="Export Conversation to Markdown"
                >
                  <Download className="w-4 h-4" />
                </button>

                {/* Delete Current Persona */}
                <button
                  onClick={(e) => handleDeleteCustomPersona(activePersona.id, e)}
                  className="p-1.5 rounded-md hover:bg-[#2c2c2c] text-[#9b9b9b] hover:text-rose-400 transition"
                  title="Delete Persona"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}

            {/* API Config Button */}
            <button
              onClick={() => setIsApiSettingsOpen(true)}
              className="px-2.5 py-1 rounded-md bg-[#282828] hover:bg-[#323232] text-xs border border-[#383838] transition flex items-center gap-1.5 cursor-pointer text-[#d4d4d4]"
              title="Configure Groq API and Model"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden lg:inline font-mono text-[11px]">
                {apiConfig.provider === 'groq' ? 'Groq: Llama 3.3' : apiConfig.model}
              </span>
            </button>
          </div>
        </div>

        {/* Groq Live LLM Status & Instant Key Connector Bar */}
        {apiConfig.provider === 'groq' && (
          <div className="bg-[#1c1c1c] border-b border-[#2e2e2e] px-5 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <span className={`w-2.5 h-2.5 rounded-full ${effectiveApiKey ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'} shrink-0`} />
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-white">Groq LLM Engine:</span>
                <span className="font-mono text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 text-[11px]">
                  {apiConfig.model}
                </span>
                {effectiveApiKey ? (
                  <span className="text-emerald-400 font-mono text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Live Streaming Active ({isUsingEnvKey ? 'Vercel Env' : 'Local Key'})</span>
                  </span>
                ) : (
                  <span className="text-amber-300 text-[11px] font-medium flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Connect your Groq key below for real-time 300+ tok/sec AI simulation:</span>
                  </span>
                )}
              </div>
            </div>

            {!effectiveApiKey ? (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="password"
                  value={quickKeyInput}
                  onChange={(e) => setQuickKeyInput(e.target.value)}
                  placeholder="Paste Groq Key (gsk_...)"
                  className="bg-[#141414] border border-amber-500/40 rounded-lg px-2.5 py-1 text-xs font-mono text-white placeholder-[#787878] focus:outline-none focus:border-amber-400 w-52"
                />
                <button
                  onClick={handleSaveQuickKey}
                  disabled={!quickKeyInput.trim()}
                  className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-semibold text-xs transition cursor-pointer shrink-0"
                >
                  Connect
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsApiSettingsOpen(true)}
                className="px-2.5 py-1 rounded bg-[#282828] hover:bg-[#323232] text-[#d4d4d4] hover:text-white border border-[#383838] font-mono text-[11px] transition shrink-0 cursor-pointer flex items-center gap-1.5"
              >
                <Key className="w-3 h-3 text-amber-400" />
                <span>Manage Key / Settings</span>
              </button>
            )}
          </div>
        )}

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5">
          {activePersona && (
            <>
              {/* Persona Welcome Card (shown if no messages in active session) */}
              {(!activeSession || activeSession.messages.length === 0) && (
                <div className="max-w-2xl mx-auto py-8 space-y-6 text-center animate-fade-in">
                  <div className="w-20 h-20 rounded-3xl bg-[#222222] border border-[#333333] flex items-center justify-center text-4xl mx-auto shadow-xl shadow-black/40">
                    {activePersona.avatar}
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-xl font-black text-white flex items-center justify-center gap-2">
                      <span>{activePersona.name}</span>
                    </h3>
                    <p className="text-xs text-amber-300 font-mono">{activePersona.tagline}</p>
                    <p className="text-xs text-[#9b9b9b] max-w-md mx-auto leading-relaxed pt-1">
                      {activePersona.backstory}
                    </p>
                  </div>

                  {/* Persona Quirks / Specialties */}
                  {activePersona.quirks && activePersona.quirks.length > 0 && (
                    <div className="flex flex-wrap items-center justify-center gap-2 max-w-lg mx-auto">
                      {activePersona.quirks.map((quirk, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-[#222222] text-[#d4d4d4] border border-[#2e2e2e]"
                        >
                          ✦ {quirk}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Suggested Starters */}
                  {activePersona.suggestedStarters && activePersona.suggestedStarters.length > 0 && (
                    <div className="pt-4 space-y-2 max-w-lg mx-auto">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-[#787774] block">
                        Click a prompt starter to begin:
                      </span>
                      <div className="grid grid-cols-1 gap-2 text-left">
                        {activePersona.suggestedStarters.map((starter, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSendMessage(starter)}
                            className="p-2.5 rounded-xl bg-[#222222] hover:bg-[#282828] border border-[#2e2e2e] hover:border-amber-500/50 text-xs text-[#d4d4d4] hover:text-white transition flex items-center justify-between gap-2 group cursor-pointer"
                          >
                            <span>{starter}</span>
                            <Send className="w-3 h-3 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Render Messages */}
              {activeSession &&
                activeSession.messages.map((msg) => {
                  const isUser = msg.role === 'user';
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-3 max-w-3xl mx-auto group ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {/* Assistant Avatar */}
                      {!isUser && (
                        <div className="w-8 h-8 rounded-lg bg-[#252525] border border-[#353535] flex items-center justify-center text-base shrink-0 mt-0.5 shadow-sm">
                          {activePersona.avatar}
                        </div>
                      )}

                      {/* Message Bubble */}
                      <div
                        className={`relative rounded-2xl p-4 text-xs md:text-sm leading-relaxed max-w-[85%] sm:max-w-[78%] transition shadow-sm ${
                          isUser
                            ? 'bg-indigo-600 text-white rounded-tr-none'
                            : 'bg-[#222222] text-[#e6e6e6] border border-[#2e2e2e] rounded-tl-none'
                        }`}
                      >
                        {/* Top metadata row for assistant */}
                        {!isUser && (
                          <div className="flex items-center justify-between gap-3 pb-2 mb-2 border-b border-[#2e2e2e] text-[11px] font-mono text-[#787774]">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-[#d4d4d4]">{activePersona.name}</span>
                              {msg.modelUsed && (
                                <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[9px]">
                                  {msg.modelUsed}
                                </span>
                              )}
                            </div>
                            <span>{msg.timestamp}</span>
                          </div>
                        )}

                        {/* Message Content with Streaming Cursor */}
                        <div className="whitespace-pre-wrap space-y-2 leading-relaxed">
                          {msg.content}
                          {!isUser && isGenerating && msg.id === activeSession.messages[activeSession.messages.length - 1]?.id && (
                            <span className="inline-block w-1.5 h-3.5 bg-amber-400 animate-pulse ml-0.5 align-middle" />
                          )}
                        </div>

                        {/* Actions Bar (Copy message) */}
                        <div className="mt-2 pt-1 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleCopy(msg.id, msg.content)}
                            className="p-1 rounded text-[#787774] hover:text-[#d4d4d4] transition flex items-center gap-1 text-[10px] font-mono cursor-pointer"
                            title="Copy text"
                          >
                            {copiedMsgId === msg.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* User Avatar */}
                      {isUser && (
                        <div className="w-8 h-8 rounded-lg bg-indigo-700 border border-indigo-500 flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5 shadow-sm">
                          <User className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  );
                })}

              {/* Initial Thinking Indicator before first token streams */}
              {isGenerating && activeSession?.messages[activeSession.messages.length - 1]?.content === '' && (
                <div className="flex gap-3 max-w-3xl mx-auto items-start">
                  <div className="w-8 h-8 rounded-lg bg-[#252525] border border-[#353535] flex items-center justify-center text-base shrink-0 mt-0.5">
                    {activePersona.avatar}
                  </div>
                  <div className="bg-[#222222] border border-[#2e2e2e] rounded-2xl rounded-tl-none p-3.5 flex items-center gap-2 text-xs font-mono text-[#9b9b9b]">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                    <span>Connecting to Groq Llama 3.3 70B stream...</span>
                  </div>
                </div>
              )}
            </>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input & Starter Bar */}
        <div className="p-4 border-t border-[#2e2e2e] bg-[#202020] space-y-2">
          {/* Horizontal Suggested Starters Pills when chat has messages */}
          {activePersona && activeSession && activeSession.messages.length > 0 && activePersona.suggestedStarters && (
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs">
              <span className="text-[10px] font-mono text-[#787774] uppercase shrink-0">Prompts:</span>
              {activePersona.suggestedStarters.map((starter, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(starter)}
                  className="px-2.5 py-1 rounded-full bg-[#282828] hover:bg-[#323232] text-[#d4d4d4] hover:text-white border border-[#353535] whitespace-nowrap text-[11px] font-mono transition shrink-0 cursor-pointer"
                >
                  {starter}
                </button>
              ))}
            </div>
          )}

          {/* Input Box */}
          <div className="relative bg-[#191919] border border-[#2e2e2e] focus-within:border-amber-500 rounded-xl overflow-hidden shadow-inner transition">
            <textarea
              ref={inputRef}
              rows={2}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={
                effectiveApiKey
                  ? `Message ${activePersona?.name || 'Mikah'} (Live Groq LLM)... (Press Enter to send, Shift+Enter for new line)`
                  : 'Enter your Groq key above to start live LLM simulation with Mikah...'
              }
              className="w-full bg-transparent px-3.5 py-2.5 text-xs text-[#e6e6e6] placeholder-[#6e6e6e] outline-none resize-none"
            />

            <div className="px-3 py-1.5 bg-[#1f1f1f] border-t border-[#2a2a2a] flex items-center justify-between text-[11px] font-mono text-[#787774]">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1">
                  <span>Persona:</span>
                  <span className="text-white font-bold">{activePersona?.name}</span>
                </span>
                <span>•</span>
                <span className="text-amber-400">
                  {effectiveApiKey ? `Groq: ${apiConfig.model} (Streaming)` : 'Key Required'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() || isGenerating}
                  className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                    inputMessage.trim() && !isGenerating
                      ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-xs'
                      : 'bg-[#2a2a2a] text-[#6e6e6e] cursor-not-allowed'
                  }`}
                >
                  <span>Send</span>
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. API CONFIGURATION MODAL */}
      {/* ======================================================== */}
      {isApiSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#202020] border border-[#2e2e2e] rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl text-[#e6e6e6]">
            {/* Modal Header */}
            <div className="p-4 border-b border-[#2e2e2e] flex items-center justify-between bg-[#242424]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Groq API & LLM Settings</h3>
                  <p className="text-[11px] text-[#9b9b9b] font-mono">
                    Real-time streaming inference via Groq Cloud (Llama 3.3 70B Versatile)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsApiSettingsOpen(false)}
                className="p-1 rounded text-[#787774] hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              {/* Provider Selection */}
              <div>
                <label className="font-semibold text-white block mb-1">LLM Provider</label>
                <select
                  value={apiConfig.provider}
                  onChange={(e) => {
                    const prov = e.target.value as any;
                    let defaultModel = 'llama-3.3-70b-versatile';
                    let defaultUrl = 'https://api.groq.com/openai/v1';

                    if (prov === 'openai') {
                      defaultModel = 'gpt-4o';
                      defaultUrl = 'https://api.openai.com/v1';
                    } else if (prov === 'gemini') {
                      defaultModel = 'gemini-1.5-flash';
                      defaultUrl = 'https://generativelanguage.googleapis.com';
                    } else if (prov === 'openrouter') {
                      defaultModel = 'meta-llama/llama-3.1-70b-instruct';
                      defaultUrl = 'https://openrouter.ai/api/v1';
                    }

                    setApiConfig((prev) => ({
                      ...prev,
                      provider: prov,
                      model: defaultModel,
                      baseUrl: defaultUrl,
                    }));
                  }}
                  className="w-full bg-[#191919] border border-[#2e2e2e] rounded-lg px-3 py-2 text-xs text-[#e6e6e6] focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="groq">Groq Cloud (Llama 3.3 70B Versatile - 300+ Tokens/Sec)</option>
                  <option value="openrouter">OpenRouter (Any open-source & commercial model)</option>
                  <option value="openai">OpenAI (GPT-4o, GPT-4o-mini)</option>
                </select>
                <p className="text-[11px] text-[#787774] mt-1 font-mono">
                  ✦ Ultra-fast streaming directly prompts the live model using active persona directives.
                </p>
              </div>

              {/* API Key Input */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-white">Groq API Key</label>
                  <span className="text-[10px] font-mono text-amber-400">Starts with gsk_...</span>
                </div>
                <input
                  type="password"
                  value={apiConfig.apiKey}
                  onChange={(e) => setApiConfig((prev) => ({ ...prev, apiKey: e.target.value }))}
                  placeholder={envGroqKey ? 'Overriding Vercel environment key...' : 'gsk_...'}
                  className="w-full bg-[#191919] border border-[#2e2e2e] rounded-lg px-3 py-2 text-xs text-[#e6e6e6] font-mono focus:outline-none focus:border-amber-500"
                />
                <p className="text-[10px] text-[#787774] mt-1">
                  Free key from{' '}
                  <a href="https://console.groq.com/keys" target="_blank" rel="noreferrer" className="text-amber-400 underline">
                    console.groq.com/keys
                  </a>
                  . Saved safely in local browser storage.
                </p>
              </div>

              {/* Model & Base URL */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-white block mb-1">Model Name</label>
                  <input
                    type="text"
                    value={apiConfig.model}
                    onChange={(e) => setApiConfig((prev) => ({ ...prev, model: e.target.value }))}
                    placeholder="llama-3.3-70b-versatile"
                    className="w-full bg-[#191919] border border-[#2e2e2e] rounded-lg px-3 py-2 text-xs text-[#e6e6e6] font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-white block mb-1">Base URL Endpoint</label>
                  <input
                    type="text"
                    value={apiConfig.baseUrl}
                    onChange={(e) => setApiConfig((prev) => ({ ...prev, baseUrl: e.target.value }))}
                    placeholder="https://api.groq.com/openai/v1"
                    className="w-full bg-[#191919] border border-[#2e2e2e] rounded-lg px-3 py-2 text-xs text-[#e6e6e6] font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Sliders: Temperature & Max Tokens */}
              <div className="space-y-3 pt-2 border-t border-[#2e2e2e]">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-white font-medium">Temperature: {apiConfig.temperature}</span>
                    <span className="text-[10px] font-mono text-[#787774]">
                      {apiConfig.temperature < 0.5 ? 'Precise & Deterministic' : 'Authentic & Creative'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1.5"
                    step="0.05"
                    value={apiConfig.temperature}
                    onChange={(e) => setApiConfig((prev) => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-white font-medium">Max Tokens: {apiConfig.maxTokens}</span>
                    <span className="text-[10px] font-mono text-[#787774]">Response Length Limit</span>
                  </div>
                  <input
                    type="range"
                    min="256"
                    max="4096"
                    step="128"
                    value={apiConfig.maxTokens}
                    onChange={(e) => setApiConfig((prev) => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Live Connection Test Button & Feedback */}
              <div className="pt-2 border-t border-[#2e2e2e]">
                <button
                  onClick={handleTestApi}
                  disabled={apiTestStatus.loading}
                  className="px-3 py-1.5 rounded-lg bg-[#282828] hover:bg-[#323232] text-xs font-semibold text-[#d4d4d4] border border-[#383838] transition flex items-center gap-2 cursor-pointer"
                >
                  {apiTestStatus.loading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                  ) : (
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                  )}
                  <span>Test Groq Connection Now</span>
                </button>

                {apiTestStatus.message && (
                  <div
                    className={`mt-2 p-2.5 rounded-lg text-xs font-mono flex items-center gap-2 ${
                      apiTestStatus.success
                        ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                        : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {apiTestStatus.success ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    )}
                    <span>{apiTestStatus.message}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#242424] border-t border-[#2e2e2e] flex items-center justify-between">
              <button
                onClick={() => setApiConfig(DEFAULT_API_CONFIG)}
                className="text-xs font-mono text-[#787774] hover:text-white transition"
              >
                Reset to Default
              </button>

              <button
                onClick={() => setIsApiSettingsOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition cursor-pointer shadow-xs"
              >
                Save & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. CREATE / EDIT CUSTOM PERSONA MODAL */}
      {/* ======================================================== */}
      {isCreatePersonaOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#202020] border border-[#2e2e2e] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl text-[#e6e6e6]">
            {/* Modal Header */}
            <div className="p-4 border-b border-[#2e2e2e] flex items-center justify-between bg-[#242424]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">
                    {editingPersona ? `Edit Persona: ${editingPersona.name}` : 'Create Custom Persona'}
                  </h3>
                  <p className="text-[11px] text-[#9b9b9b] font-mono">
                    Define persona system instructions, personality, quirks, and prompt starters
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsCreatePersonaOpen(false);
                  setEditingPersona(null);
                }}
                className="p-1 rounded text-[#787774] hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-3 gap-3">
                {/* Avatar Picker */}
                <div>
                  <label className="font-semibold text-white block mb-1">Avatar Emoji</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      maxLength={2}
                      value={newPersona.avatar}
                      onChange={(e) => setNewPersona((prev) => ({ ...prev, avatar: e.target.value }))}
                      className="w-12 h-10 text-center text-xl bg-[#191919] border border-[#2e2e2e] rounded-lg"
                    />
                    <div className="flex gap-1">
                      {['⚙️', '📊', '⚡', '♟️', '🎴', '🤖', '💼'].map((emo) => (
                        <button
                          key={emo}
                          type="button"
                          onClick={() => setNewPersona((prev) => ({ ...prev, avatar: emo }))}
                          className="w-7 h-7 rounded bg-[#282828] hover:bg-[#333333] flex items-center justify-center text-xs"
                        >
                          {emo}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Name */}
                <div className="col-span-2">
                  <label className="font-semibold text-white block mb-1">Persona Name *</label>
                  <input
                    type="text"
                    value={newPersona.name}
                    onChange={(e) => setNewPersona((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Mikah Walters, Market Quant, etc."
                    className="w-full bg-[#191919] border border-[#2e2e2e] rounded-lg px-3 py-2 text-xs text-[#e6e6e6]"
                  />
                </div>
              </div>

              {/* Tagline & Category */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-white block mb-1">Role / Tagline</label>
                  <input
                    type="text"
                    value={newPersona.tagline}
                    onChange={(e) => setNewPersona((prev) => ({ ...prev, tagline: e.target.value }))}
                    placeholder="e.g. Founder of SortSwift • Super Sorter Lead"
                    className="w-full bg-[#191919] border border-[#2e2e2e] rounded-lg px-3 py-2 text-xs text-[#e6e6e6]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-white block mb-1">Category</label>
                  <select
                    value={newPersona.category}
                    onChange={(e) => setNewPersona((prev) => ({ ...prev, category: e.target.value as any }))}
                    className="w-full bg-[#191919] border border-[#2e2e2e] rounded-lg px-3 py-2 text-xs text-[#e6e6e6]"
                  >
                    <option value="Custom">Custom</option>
                    <option value="Engineering">Engineering</option>
                    <option value="TCG Specialist">TCG Specialist</option>
                    <option value="Executive">Executive</option>
                    <option value="Product & UX">Product & UX</option>
                  </select>
                </div>
              </div>

              {/* Core System Prompt */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-white">Core System Prompt & Directives *</label>
                  <span className="text-[10px] font-mono text-amber-400">Fed directly to LLM</span>
                </div>
                <textarea
                  rows={4}
                  value={newPersona.systemPrompt}
                  onChange={(e) => setNewPersona((prev) => ({ ...prev, systemPrompt: e.target.value }))}
                  placeholder="You are [Name], a specialist in... Your tone is... You always prioritize..."
                  className="w-full bg-[#191919] border border-[#2e2e2e] rounded-lg p-3 text-xs text-[#e6e6e6] font-mono leading-relaxed"
                />
              </div>

              {/* Backstory & Speaking Style */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-white block mb-1">Backstory & Experience</label>
                  <textarea
                    rows={2}
                    value={newPersona.backstory}
                    onChange={(e) => setNewPersona((prev) => ({ ...prev, backstory: e.target.value }))}
                    placeholder="Background and career context..."
                    className="w-full bg-[#191919] border border-[#2e2e2e] rounded-lg p-2.5 text-xs text-[#e6e6e6]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-white block mb-1">Speaking Style & Tone</label>
                  <textarea
                    rows={2}
                    value={newPersona.speakingStyle}
                    onChange={(e) => setNewPersona((prev) => ({ ...prev, speakingStyle: e.target.value }))}
                    placeholder="e.g. Conversational, energetic, uses 'haha', '🙂'..."
                    className="w-full bg-[#191919] border border-[#2e2e2e] rounded-lg p-2.5 text-xs text-[#e6e6e6]"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#242424] border-t border-[#2e2e2e] flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setIsCreatePersonaOpen(false);
                  setEditingPersona(null);
                }}
                className="px-4 py-1.5 rounded-lg bg-[#282828] hover:bg-[#323232] text-xs font-semibold text-[#d4d4d4]"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveCustomPersona}
                className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs shadow-xs"
              >
                {editingPersona ? 'Save Changes' : 'Create Persona'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. PERSONA DETAIL & PROMPT DRAWER */}
      {/* ======================================================== */}
      {isPersonaDrawerOpen && activePersona && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-[#202020] border-l border-[#2e2e2e] h-full flex flex-col justify-between shadow-2xl p-6 overflow-y-auto space-y-6">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#2e2e2e]">
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl">{activePersona.avatar}</span>
                  <div>
                    <h3 className="font-bold text-base text-white">{activePersona.name}</h3>
                    <span className="text-xs text-amber-400 font-mono">{activePersona.category}</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsPersonaDrawerOpen(false)}
                  className="p-1 rounded text-[#787774] hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Tagline & Bio */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#787774]">Professional Bio</span>
                <p className="text-xs text-[#d4d4d4] leading-relaxed">{activePersona.backstory}</p>
              </div>

              {/* Core System Prompt Box */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">
                  Active LLM System Directives
                </span>
                <div className="p-3 bg-[#191919] border border-[#2e2e2e] rounded-xl text-xs font-mono text-[#d4d4d4] leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                  {activePersona.systemPrompt}
                </div>
              </div>

              {/* Quirks & Signature Traits */}
              {activePersona.quirks && activePersona.quirks.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-[#787774]">Signature Quirks</span>
                  <div className="space-y-1">
                    {activePersona.quirks.map((q, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded-lg bg-[#252525] border border-[#2e2e2e] text-xs text-[#d4d4d4] flex items-center gap-2"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{q}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsPersonaDrawerOpen(false)}
              className="w-full py-2 rounded-lg bg-[#282828] hover:bg-[#323232] text-xs font-semibold text-white border border-[#383838] transition cursor-pointer"
            >
              Close Drawer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonaChatView;
