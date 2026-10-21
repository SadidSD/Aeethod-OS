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
import { useStore } from '../store';

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
  const { theme } = useStore();
  const isLight = theme === 'light';

  // Global Vercel Environment API Key support for shared access
  const envGroqKey = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GROQ_API_KEY) || '';

  // 1. Core State: Pre-loaded with latest Mikah Walters & custom personas
  const [personas, setPersonas] = useState<Persona[]>(() => {
    try {
      const saved = localStorage.getItem('aeethod_custom_personas');
      if (saved) {
        const parsed: Persona[] = JSON.parse(saved);
        // Exclude legacy personas and stale Mikah so latest code prompt always takes precedence
        const customOnly = parsed.filter(
          (p) => p && p.id && !LEGACY_PERSONA_IDS.has(p.id) && p.id !== MIKAH_PERSONA.id
        );
        return [MIKAH_PERSONA, ...customOnly];
      }
    } catch (e) {
      console.error('Error loading custom personas', e);
    }
    return [MIKAH_PERSONA];
  });

  const [activePersonaId, setActivePersonaId] = useState<string | null>(() => {
    return MIKAH_PERSONA.id;
  });

  // Default API configuration set to Groq Llama-3.1/3.3
  const [apiConfig, setApiConfig] = useState<ApiConfig>(() => {
    try {
      const saved = localStorage.getItem('aeethod_persona_api_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        const provider = parsed.provider === 'openai' ? 'openai' : 'groq';
        let model = parsed.model || 'llama-3.1-8b-instant';
        if (provider === 'groq' && (!model || model === 'gpt-4o' || model.startsWith('gpt-') || model.startsWith('claude-'))) {
          model = 'llama-3.1-8b-instant';
        }
        return {
          ...DEFAULT_API_CONFIG,
          ...parsed,
          provider,
          apiKey: parsed.apiKey || envGroqKey,
          model,
          baseUrl: provider === 'groq' ? 'https://api.groq.com/openai/v1' : (parsed.baseUrl || 'https://api.openai.com/v1'),
        };
      }
    } catch {}
    return {
      ...DEFAULT_API_CONFIG,
      apiKey: envGroqKey || DEFAULT_API_CONFIG.apiKey,
    };
  });

  // Live Groq connection and model detection status
  const [groqStatus, setGroqStatus] = useState<{
    checking: boolean;
    verified: boolean;
    error?: string;
    keySource?: 'vercel-env' | 'client' | 'none';
    maskedKey?: string;
    workingModel?: string;
    availableModels: string[];
  }>({
    checking: false,
    verified: false,
    availableModels: ['llama-3.1-8b-instant', 'llama-3.3-70b-versatile', 'llama-3.1-70b-versatile', 'mixtral-8x7b-32768'],
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

  // Auto-sync latest Mikah prompt definition into state on mount
  useEffect(() => {
    setPersonas((prev) => {
      const idx = prev.findIndex((p) => p.id === MIKAH_PERSONA.id);
      if (idx === -1) return [MIKAH_PERSONA, ...prev];
      if (prev[idx].systemPrompt !== MIKAH_PERSONA.systemPrompt) {
        const next = [...prev];
        next[idx] = MIKAH_PERSONA;
        return next;
      }
      return prev;
    });
  }, []);

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

  // Comprehensive Groq Model & Key Verification function
  const checkGroqConnection = async (manualKey?: string) => {
    setGroqStatus((prev) => ({ ...prev, checking: true, error: undefined }));
    try {
      const keyToUse = manualKey !== undefined ? manualKey : (apiConfig.apiKey || envGroqKey);

      // 1. Test via serverless proxy /api/groq/check (checks Vercel env or passed key)
      const res = await fetch('/api/groq/check', {
        headers: keyToUse ? { Authorization: `Bearer ${keyToUse.trim()}` } : {},
      }).catch(() => null);

      if (res && res.ok) {
        const data = await res.json();
        if (data.ok && data.workingModel) {
          setGroqStatus({
            checking: false,
            verified: true,
            keySource: data.keySource,
            maskedKey: data.maskedKey,
            workingModel: data.workingModel,
            availableModels: data.activeModels || ['llama-3.1-8b-instant', 'llama-3.3-70b-versatile'],
          });
          setApiConfig((prev) => ({
            ...prev,
            model: data.workingModel,
            baseUrl: 'https://api.groq.com/openai/v1',
          }));
          return;
        } else if (!data.ok && data.error) {
          setGroqStatus((prev) => ({
            ...prev,
            checking: false,
            verified: false,
            error: data.error,
            keySource: data.keySource,
            maskedKey: data.maskedKey,
          }));
          return;
        }
      }

      // 2. Direct browser fallback check if /api/groq/check is unreachable
      if (keyToUse) {
        const directRes = await fetch('https://api.groq.com/openai/v1/models', {
          headers: { Authorization: `Bearer ${keyToUse.trim()}` },
        });

        if (!directRes.ok) {
          const errData = await directRes.json().catch(() => ({}));
          setGroqStatus((prev) => ({
            ...prev,
            checking: false,
            verified: false,
            error: errData.error?.message || `Groq direct API HTTP ${directRes.status}`,
          }));
          return;
        }

        const data = await directRes.json();
        const models: string[] = (data.data || []).map((m: any) => m.id);
        const chatModels = models.filter((id) => !id.includes('whisper') && !id.includes('guard'));

        // Probe chat models to identify working model
        let foundWorking = 'llama-3.1-8b-instant';
        const candidates = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'llama-3.1-70b-versatile', 'llama3-70b-8192', ...chatModels];
        for (const c of candidates) {
          if (!chatModels.includes(c)) continue;
          try {
            const probe = await fetch('https://api.groq.com/openai/v1/chat/completions', {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${keyToUse.trim()}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                model: c,
                messages: [{ role: 'user', content: 'hi' }],
                max_tokens: 2,
              }),
            });
            if (probe.ok) {
              foundWorking = c;
              break;
            }
          } catch {}
        }

        setGroqStatus({
          checking: false,
          verified: true,
          keySource: 'client',
          maskedKey: keyToUse.slice(0, 7) + '...' + keyToUse.slice(-4),
          workingModel: foundWorking,
          availableModels: chatModels.length > 0 ? chatModels : ['llama-3.1-8b-instant', 'llama-3.3-70b-versatile'],
        });

        setApiConfig((prev) => ({
          ...prev,
          model: foundWorking,
        }));
      } else {
        setGroqStatus((prev) => ({
          ...prev,
          checking: false,
          verified: false,
          error: 'No Groq API key found in Vercel environment or locally.',
          keySource: 'none',
        }));
      }
    } catch (err: any) {
      setGroqStatus((prev) => ({
        ...prev,
        checking: false,
        verified: false,
        error: err.message,
      }));
    }
  };

  // Run auto-check on mount
  useEffect(() => {
    checkGroqConnection();
  }, []);

  // Quick Key Save & Verify Handler
  const handleSaveQuickKey = () => {
    if (!quickKeyInput.trim()) return;
    const cleanKey = quickKeyInput.trim();
    setApiConfig((prev) => ({
      ...prev,
      provider: 'groq',
      apiKey: cleanKey,
      baseUrl: 'https://api.groq.com/openai/v1',
    }));
    checkGroqConnection(cleanKey);
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

  // Real Streaming LLM API Caller with Vercel proxy & direct fallback
  const callRealApiStream = async (
    persona: Persona,
    history: ChatMessage[],
    config: ApiConfig,
    onChunk: (accumulatedText: string) => void
  ): Promise<string> => {
    const keyToUse = config.apiKey?.trim() || envGroqKey.trim();
    const modelToUse = groqStatus.workingModel || config.model || 'llama-3.1-8b-instant';

    // 1. Attempt streaming via serverless proxy /api/groq/chat (uses Vercel env key seamlessly)
    try {
      const proxyRes = await fetch('/api/groq/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(keyToUse ? { Authorization: `Bearer ${keyToUse}` } : {}),
        },
        body: JSON.stringify({
          model: modelToUse,
          temperature: persona.temperature ?? config.temperature ?? 0.65,
          max_tokens: persona.id === MIKAH_PERSONA.id ? Math.min(config.maxTokens ?? 1024, 300) : (config.maxTokens ?? 1024),
          stream: true,
          messages: [
            { role: 'system', content: persona.systemPrompt },
            ...history.map((m) => ({ role: m.role, content: m.content })),
          ],
        }),
      });

      if (proxyRes.ok) {
        const reader = proxyRes.body?.getReader();
        if (reader) {
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
                } catch {}
              }
            }
          }
          if (accumulated.trim()) return accumulated;
        }
      } else {
        const errJson = await proxyRes.json().catch(() => ({}));
        if (errJson.error?.message) {
          throw new Error(errJson.error.message);
        }
      }
    } catch (e: any) {
      if (!keyToUse) {
        throw new Error(e.message || 'Groq connection failed. Please check your Vercel GROQ_API_KEY.');
      }
    }

    // 2. Direct client fallback to Groq endpoint if proxy is unavailable
    if (!keyToUse) {
      throw new Error('Groq API Key is required. Please paste your key or set GROQ_API_KEY in Vercel.');
    }

    const endpoint =
      config.provider === 'groq'
        ? 'https://api.groq.com/openai/v1/chat/completions'
        : config.provider === 'openrouter'
        ? 'https://openrouter.ai/api/v1/chat/completions'
        : `${config.baseUrl.replace(/\/+$/, '')}/chat/completions`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${keyToUse}`,
      },
      body: JSON.stringify({
        model: modelToUse,
        temperature: persona.temperature ?? config.temperature ?? 0.65,
        max_tokens: persona.id === MIKAH_PERSONA.id ? Math.min(config.maxTokens ?? 1024, 300) : (config.maxTokens ?? 1024),
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
          } catch {}
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

    // Placeholder assistant message for streaming
    const assistantMsgId = `msg-resp-${Date.now()}`;
    const initialAssistantMsg: ChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      personaId: activePersona.id,
      modelUsed: `groq:${groqStatus.workingModel || apiConfig.model}`,
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
        apiConfig,
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

Please click **"Auto-Detect Working Model"** in the top bar to verify your Groq key or connect a valid model.`,
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
    <div className={`flex h-full w-full overflow-hidden select-text transition-colors duration-150 ${
      isLight ? 'bg-white text-slate-800' : 'bg-[#121214] text-[#e6e6e6]'
    }`}>
      {/* ======================================================== */}
      {/* 1. LEFT SIDEBAR: SESSIONS & PERSONA DIRECTORY */}
      {/* ======================================================== */}
      <div className={`w-72 md:w-80 border-r flex flex-col justify-between shrink-0 h-full transition-colors duration-150 ${
        isLight ? 'bg-[#fcfcfd] border-slate-200/90 text-slate-800' : 'bg-[#18181b] border-zinc-800 text-zinc-100'
      }`}>
        {/* Top Header & Actions */}
        <div className={`p-3.5 border-b space-y-3 ${
          isLight ? 'border-slate-200/80 bg-white' : 'border-zinc-800 bg-zinc-900/50'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shadow-2xs ${
                isLight ? 'bg-indigo-50 border border-indigo-200/80 text-indigo-600' : 'bg-indigo-600/30 border border-indigo-500/40 text-indigo-400'
              }`}>
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <span className={`font-bold text-xs uppercase tracking-wider block ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}>Persona Studio</span>
                <span className={`text-[10px] font-mono ${
                  isLight ? 'text-slate-400 font-medium' : 'text-zinc-500'
                }`}>Analytics & Intelligence</span>
              </div>
            </div>

            <button
              onClick={() => setIsApiSettingsOpen(true)}
              className={`p-1.5 px-2.5 rounded-lg transition flex items-center gap-1.5 text-xs font-mono border cursor-pointer ${
                isLight
                  ? 'bg-amber-50/80 hover:bg-amber-100/80 border-amber-200/80 text-amber-900 font-semibold shadow-2xs'
                  : 'hover:bg-zinc-800 text-zinc-400 border-zinc-700 bg-zinc-800/40'
              }`}
              title="Groq API & Model Settings"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span className="font-mono text-[10px] uppercase font-bold">
                {apiConfig.provider === 'groq' ? 'GROQ' : apiConfig.provider}
              </span>
            </button>
          </div>

          {/* New Chat Button */}
          <button
            onClick={() => handleCreateNewSession()}
            className={`w-full py-2 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-xs ${
              isLight
                ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/10'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>New Chat Session</span>
          </button>

          {/* Search Sessions */}
          <div className="relative">
            <Search className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 ${
              isLight ? 'text-slate-400' : 'text-zinc-500'
            }`} />
            <input
              type="text"
              value={sessionSearch}
              onChange={(e) => setSessionSearch(e.target.value)}
              placeholder="Search chat sessions..."
              className={`w-full rounded-xl pl-9 pr-3 py-1.5 text-xs focus:outline-none transition shadow-2xs ${
                isLight
                  ? 'bg-white border border-slate-200/90 text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-200 placeholder-zinc-500 focus:border-indigo-500'
              }`}
            />
          </div>
        </div>

        {/* Personas Carousel Header */}
        <div className={`px-3.5 pt-3 pb-2.5 border-b ${
          isLight ? 'border-slate-200/80 bg-slate-50/50' : 'border-zinc-800 bg-zinc-900/20'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[10px] font-mono font-semibold uppercase tracking-wider ${
              isLight ? 'text-slate-500' : 'text-zinc-400'
            }`}>
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
              className={`text-[11px] font-mono flex items-center gap-1 cursor-pointer font-semibold ${
                isLight ? 'text-indigo-600 hover:text-indigo-700' : 'text-indigo-400 hover:text-indigo-300'
              }`}
            >
              <Plus className="w-3 h-3" />
              <span>+ Create</span>
            </button>
          </div>

          {/* Horizontal mini persona avatar strip */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
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
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 transition-all cursor-pointer relative ${
                    isSelected
                      ? (isLight
                          ? 'bg-amber-50 border-2 border-amber-500 shadow-xs scale-105'
                          : 'bg-amber-600/30 border-2 border-amber-500 shadow-sm scale-105')
                      : (isLight
                          ? 'bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 shadow-2xs'
                          : 'bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300')
                  }`}
                  title={`${p.name} (${p.tagline})`}
                >
                  <span>{p.avatar}</span>
                  {isMikah ? (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-white" title="SortSwift Founder" />
                  ) : (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Chat Sessions List */}
        <div className="flex-1 overflow-y-auto p-2.5 space-y-1">
          <div className={`px-2 py-1 text-[10px] font-mono font-semibold uppercase tracking-wider ${
            isLight ? 'text-slate-400' : 'text-zinc-500'
          }`}>
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
                className={`group p-2.5 rounded-xl cursor-pointer transition flex items-start justify-between gap-2 border ${
                  isActive
                    ? (isLight
                        ? 'bg-white border-slate-200/90 shadow-xs text-slate-900 ring-1 ring-slate-200/80'
                        : 'bg-zinc-800/90 border-indigo-500/40 text-white')
                    : (isLight
                        ? 'bg-transparent hover:bg-slate-100/70 border-transparent text-slate-600 hover:text-slate-900'
                        : 'bg-transparent hover:bg-zinc-800/50 border-transparent text-zinc-400 hover:text-zinc-200')
                }`}
              >
                <div className="flex items-start gap-2.5 min-w-0 flex-1">
                  <span className="text-base shrink-0 mt-0.5">{persona?.avatar || '🤖'}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-semibold truncate ${
                        isActive
                          ? (isLight ? 'text-slate-900' : 'text-white')
                          : (isLight ? 'text-slate-700' : 'text-zinc-300')
                      }`}>
                        {session.title}
                      </span>
                    </div>
                    <p className={`text-[11px] truncate mt-0.5 ${
                      isLight ? 'text-slate-400' : 'text-zinc-500'
                    }`}>
                      {lastMessage
                        ? lastMessage.content.replace(/[#*`_]/g, '').slice(0, 42)
                        : `Ready to chat with ${persona?.name || 'Persona'}`}
                    </p>
                  </div>
                </div>

                <button
                  onClick={(e) => handleDeleteSession(session.id, e)}
                  className={`opacity-0 group-hover:opacity-100 p-1.5 rounded-lg transition shrink-0 ${
                    isLight ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50' : 'text-zinc-500 hover:text-rose-400 hover:bg-zinc-800'
                  }`}
                  title="Delete Session"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}

          {filteredSessions.length === 0 && (
            <div className={`p-6 text-center text-xs italic ${
              isLight ? 'text-slate-400' : 'text-zinc-500'
            }`}>
              No chat sessions found.
            </div>
          )}
        </div>

        {/* Bottom Status / Footer */}
        <div className={`p-3 border-t flex items-center justify-between text-xs font-mono ${
          isLight ? 'border-slate-200/80 bg-white text-slate-600' : 'border-zinc-800 bg-zinc-900 text-zinc-400'
        }`}>
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${groqStatus.verified ? 'bg-emerald-500 ring-2 ring-emerald-500/20' : 'bg-amber-400 animate-pulse'}`}
            />
            <span className="text-[11px] truncate max-w-[140px]">
              {groqStatus.workingModel || apiConfig.model}
            </span>
          </div>

          <button
            onClick={() => setIsApiSettingsOpen(true)}
            className={`p-1 px-2 rounded-lg transition flex items-center gap-1 text-[11px] border cursor-pointer ${
              isLight ? 'hover:bg-slate-100 text-slate-600 border-slate-200' : 'hover:bg-zinc-800 text-zinc-300 border-zinc-700'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Config</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. MAIN CHAT AREA */}
      {/* ======================================================== */}
      <div className={`flex-1 flex flex-col min-w-0 h-full transition-colors duration-150 ${
        isLight ? 'bg-white' : 'bg-[#121214]'
      }`}>
        {/* Chat Top Header */}
        <div className={`h-16 px-6 border-b flex items-center justify-between shrink-0 shadow-xs transition-colors ${
          isLight ? 'bg-white/95 backdrop-blur-md border-slate-200/80' : 'bg-[#18181b] border-zinc-800'
        }`}>
          {/* Active Persona Identity */}
          {activePersona ? (
            <div className="flex items-center gap-3.5 min-w-0">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl shrink-0 shadow-2xs border ${
                isLight
                  ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200/80 text-amber-900'
                  : 'bg-zinc-800 border-zinc-700 text-white'
              }`}>
                {activePersona.avatar}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className={`font-bold text-sm tracking-tight truncate ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}>
                    {activePersona.name}
                  </h2>
                  {activePersona.id === MIKAH_PERSONA.id ? (
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono border font-semibold ${
                      isLight ? 'bg-amber-50 text-amber-800 border-amber-200/90' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    }`}>
                      SortSwift Founder
                    </span>
                  ) : (
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono border ${activePersona.badgeColor}`}>
                      {activePersona.category}
                    </span>
                  )}
                  {activePersona.isCustom && activePersona.id !== MIKAH_PERSONA.id && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[10px] font-mono border border-emerald-500/30 font-medium">
                      Custom Persona
                    </span>
                  )}
                </div>
                <p className={`text-xs truncate ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                  {activePersona.tagline}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h2 className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>Persona Chat Studio</h2>
                <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>Analytics & Databases • LLM Simulation Engine</p>
              </div>
            </div>
          )}

          {/* Right Action Tools & Model Pill */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Integrated Live Model Badge */}
            <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border font-mono text-xs shadow-2xs transition ${
              isLight ? 'bg-slate-50 border-slate-200/90 text-slate-700' : 'bg-zinc-800/90 border-zinc-700 text-zinc-200'
            }`}>
              <span
                className={`w-2 h-2 rounded-full ${
                  groqStatus.verified ? 'bg-emerald-500 ring-4 ring-emerald-500/20' : 'bg-amber-400 animate-pulse'
                } shrink-0`}
              />
              <span className="font-semibold text-[11px] truncate max-w-[130px] md:max-w-[200px]">
                {groqStatus.workingModel || apiConfig.model}
              </span>
              <button
                onClick={() => checkGroqConnection()}
                disabled={groqStatus.checking}
                title="Auto-Detect & Test Groq Model"
                className={`p-1 rounded-md transition cursor-pointer ${
                  isLight ? 'hover:bg-slate-200/70 text-slate-400 hover:text-slate-700' : 'hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <RefreshCw className={`w-3 h-3 ${groqStatus.checking ? 'animate-spin text-amber-500' : ''}`} />
              </button>
            </div>

            {activePersona && (
              <>
                {/* View Persona Prompt Drawer Button */}
                <button
                  onClick={() => setIsPersonaDrawerOpen(true)}
                  className={`px-3 py-1.5 rounded-xl text-xs border transition flex items-center gap-1.5 cursor-pointer font-medium shadow-2xs ${
                    isLight
                      ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-900'
                      : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-200'
                  }`}
                  title="Inspect System Prompt & Persona Directives"
                >
                  <BrainCircuit className="w-3.5 h-3.5 text-indigo-500" />
                  <span className="hidden md:inline">Prompt & Bio</span>
                </button>

                {/* Clear Messages */}
                <button
                  onClick={handleClearCurrentSession}
                  className={`p-2 rounded-xl transition cursor-pointer border shadow-2xs ${
                    isLight ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-900' : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-400 hover:text-white'
                  }`}
                  title="Clear Session Messages"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {/* Export Conversation */}
                <button
                  onClick={() => handleExportSession('markdown')}
                  className={`p-2 rounded-xl transition cursor-pointer border shadow-2xs ${
                    isLight ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-900' : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-400 hover:text-white'
                  }`}
                  title="Export Conversation to Markdown"
                >
                  <Download className="w-4 h-4" />
                </button>

                {/* Delete Current Persona */}
                <button
                  onClick={(e) => handleDeleteCustomPersona(activePersona.id, e)}
                  className={`p-2 rounded-xl transition cursor-pointer border shadow-2xs ${
                    isLight ? 'bg-white hover:bg-rose-50 border-slate-200 text-slate-500 hover:text-rose-600' : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-400 hover:text-rose-400'
                  }`}
                  title="Delete Persona"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}

            {/* API Config Button */}
            <button
              onClick={() => setIsApiSettingsOpen(true)}
              className={`p-2 rounded-xl transition cursor-pointer border shadow-2xs ${
                isLight ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-900' : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-400 hover:text-white'
              }`}
              title="Configure Groq API and Model"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Optional Warning / Notice Bar (Only if key is missing or error occurred) */}
        {!groqStatus.verified && (
          <div className={`px-6 py-2.5 border-b flex flex-wrap items-center justify-between text-xs gap-3 ${
            isLight ? 'bg-amber-50/90 border-amber-200 text-amber-900' : 'bg-amber-950/40 border-amber-800/40 text-amber-200'
          }`}>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{groqStatus.error || 'Groq API key required for live AI responses.'}</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="password"
                value={quickKeyInput}
                onChange={(e) => setQuickKeyInput(e.target.value)}
                placeholder="Paste key (gsk_...)"
                className={`px-3 py-1 text-xs font-mono rounded-lg border outline-none shadow-2xs ${
                  isLight ? 'bg-white border-amber-300 text-slate-900 focus:border-amber-500' : 'bg-zinc-900 border-amber-500/40 text-white'
                }`}
              />
              <button
                onClick={handleSaveQuickKey}
                disabled={!quickKeyInput.trim() || groqStatus.checking}
                className="px-3.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition cursor-pointer shadow-xs"
              >
                Connect
              </button>
            </div>
          </div>
        )}

        {/* Message Stream Area */}
        <div className={`flex-1 overflow-y-auto p-4 md:p-8 space-y-6 ${
          isLight ? 'bg-[#fafafa]' : 'bg-[#121214]'
        }`}>
          {activePersona && (
            <>
              {/* Persona Welcome Card (shown if no messages in active session) */}
              {(!activeSession || activeSession.messages.length === 0) && (
                <div className={`max-w-2xl mx-auto py-10 px-8 rounded-3xl border text-center animate-fade-in shadow-xs ${
                  isLight ? 'bg-white border-slate-200/80 text-slate-800' : 'bg-zinc-900/60 border-zinc-800 text-zinc-200'
                }`}>
                  <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-4 shadow-sm border ${
                    isLight ? 'bg-gradient-to-br from-amber-50 to-orange-100/60 border-amber-200' : 'bg-zinc-800 border-zinc-700'
                  }`}>
                    {activePersona.avatar}
                  </div>

                  <h3 className={`text-xl font-bold tracking-tight mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {activePersona.name}
                  </h3>
                  <p className={`text-xs font-mono font-semibold mb-3 ${isLight ? 'text-amber-800' : 'text-amber-300'}`}>
                    {activePersona.tagline}
                  </p>
                  <p className={`text-xs max-w-md mx-auto leading-relaxed mb-6 ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
                    {activePersona.backstory}
                  </p>

                  {/* Persona Quirks / Specialties */}
                  {activePersona.quirks && activePersona.quirks.length > 0 && (
                    <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-lg mx-auto mb-6">
                      {activePersona.quirks.map((quirk, idx) => (
                        <span
                          key={idx}
                          className={`px-3 py-1 rounded-full text-[11px] font-mono border ${
                            isLight ? 'bg-slate-50 text-slate-700 border-slate-200/90 shadow-2xs' : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                          }`}
                        >
                          ✦ {quirk}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Suggested Starters Grid */}
                  {activePersona.suggestedStarters && activePersona.suggestedStarters.length > 0 && (
                    <div className="space-y-3 text-left">
                      <span className={`text-[10px] font-mono uppercase tracking-wider block font-semibold text-center ${
                        isLight ? 'text-slate-400' : 'text-zinc-500'
                      }`}>
                        Click an operational prompt to start:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {activePersona.suggestedStarters.map((starter, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSendMessage(starter)}
                            className={`p-3.5 rounded-2xl border text-xs font-medium transition flex items-center justify-between gap-3 group cursor-pointer text-left ${
                              isLight
                                ? 'bg-white hover:bg-slate-50 border-slate-200/90 hover:border-indigo-300 text-slate-800 hover:text-indigo-950 shadow-2xs hover:shadow-xs'
                                : 'bg-zinc-800/80 hover:bg-zinc-700 border-zinc-700 text-zinc-200'
                            }`}
                          >
                            <span className="leading-snug">{starter}</span>
                            <Send className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ${
                              isLight ? 'text-indigo-600' : 'text-amber-400'
                            }`} />
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
                      className={`flex gap-3 max-w-4xl mx-auto group ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {/* Assistant Avatar */}
                      {!isUser && (
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0 mt-0.5 border shadow-2xs ${
                          isLight ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-zinc-800 border-zinc-700'
                        }`}>
                          {activePersona.avatar}
                        </div>
                      )}

                      {/* Message Bubble Card */}
                      <div
                        className={`relative rounded-2xl p-4.5 text-sm leading-relaxed transition shadow-xs ${
                          isUser
                            ? (isLight
                                ? 'bg-slate-900 text-white rounded-tr-xs max-w-[80%] sm:max-w-[72%]'
                                : 'bg-indigo-600 text-white rounded-tr-xs max-w-[80%] sm:max-w-[72%]')
                            : (isLight
                                ? 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-xs max-w-[88%] sm:max-w-[82%]'
                                : 'bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-xs max-w-[88%] sm:max-w-[82%]')
                        }`}
                      >
                        {/* Assistant Header inside card */}
                        {!isUser && (
                          <div className={`flex items-center justify-between gap-3 pb-2.5 mb-3 border-b text-[11px] font-mono ${
                            isLight ? 'border-slate-100 text-slate-400' : 'border-zinc-800 text-zinc-500'
                          }`}>
                            <div className="flex items-center gap-2">
                              <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-zinc-100'}`}>
                                {activePersona.name}
                              </span>
                              {msg.modelUsed && (
                                <span className={`px-2 py-0.5 rounded-md text-[10px] border ${
                                  isLight ? 'bg-slate-100 text-slate-600 border-slate-200/80' : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                                }`}>
                                  {msg.modelUsed}
                                </span>
                              )}
                            </div>
                            <span>{msg.timestamp}</span>
                          </div>
                        )}

                        {/* Message Content with Streaming Cursor */}
                        <div className={`whitespace-pre-wrap space-y-2 leading-relaxed selection:bg-amber-100 ${
                          isUser ? 'text-slate-100' : (isLight ? 'text-slate-800' : 'text-zinc-200')
                        }`}>
                          {msg.content}
                          {!isUser && isGenerating && msg.id === activeSession.messages[activeSession.messages.length - 1]?.id && (
                            <span className="inline-block w-1.5 h-4 bg-amber-500 animate-pulse ml-0.5 align-middle rounded-full" />
                          )}
                        </div>

                        {/* Actions Bar (Copy message) */}
                        {!isUser && (
                          <div className="mt-3 pt-2 border-t flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleCopy(msg.id, msg.content)}
                              className={`p-1.5 px-2.5 rounded-lg transition flex items-center gap-1.5 text-xs font-mono cursor-pointer ${
                                isLight ? 'text-slate-400 hover:text-slate-800 hover:bg-slate-100' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                              }`}
                              title="Copy text"
                            >
                              {copiedMsgId === msg.id ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                                  <span className="text-emerald-600 font-semibold">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

              {/* Initial Thinking Indicator before first token streams */}
              {isGenerating && activeSession?.messages[activeSession.messages.length - 1]?.content === '' && (
                <div className="flex gap-3 max-w-4xl mx-auto items-start">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0 mt-0.5 border shadow-2xs ${
                    isLight ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-zinc-800 border-zinc-700'
                  }`}>
                    {activePersona.avatar}
                  </div>
                  <div className={`rounded-2xl rounded-tl-none p-4 flex items-center gap-2.5 text-xs font-mono border shadow-xs ${
                    isLight ? 'bg-white border-slate-200/90 text-slate-600' : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                  }`}>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-500" />
                    <span>Connecting to Groq live model stream...</span>
                  </div>
                </div>
              )}
            </>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Suggested Prompts Ribbon (Above Composer when chat has messages) */}
        {activePersona && activeSession && activeSession.messages.length > 0 && activePersona.suggestedStarters && (
          <div className={`px-6 py-2.5 border-t flex items-center gap-2 overflow-x-auto no-scrollbar text-xs shrink-0 ${
            isLight ? 'bg-white/80 backdrop-blur-md border-slate-200/80' : 'bg-zinc-900/80 border-zinc-800'
          }`}>
            <span className={`text-[10px] font-mono uppercase font-bold shrink-0 ${
              isLight ? 'text-slate-400' : 'text-zinc-500'
            }`}>
              Prompts:
            </span>
            {activePersona.suggestedStarters.map((starter, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(starter)}
                className={`px-3 py-1.5 rounded-xl border whitespace-nowrap text-xs font-medium transition shrink-0 cursor-pointer shadow-2xs ${
                  isLight
                    ? 'bg-white hover:bg-slate-50 border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-900'
                    : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300'
                }`}
              >
                {starter}
              </button>
            ))}
          </div>
        )}

        {/* Modern Floating Composer Dock */}
        <div className={`px-6 py-4 border-t shrink-0 ${
          isLight ? 'bg-white/95 backdrop-blur-md border-slate-200/80' : 'bg-[#18181b] border-zinc-800'
        }`}>
          <div className={`max-w-4xl mx-auto border rounded-2xl p-3 transition-all duration-200 shadow-[0_4px_24px_rgba(0,0,0,0.05)] ${
            isLight
              ? 'bg-white border-slate-200/90 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10'
              : 'bg-zinc-900 border-zinc-800 focus-within:border-amber-500'
          }`}>
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
              placeholder={`Message ${activePersona?.name || 'Mikah'} (Live Groq LLM)...`}
              className={`w-full bg-transparent px-3 py-2 text-sm outline-none resize-none leading-relaxed ${
                isLight ? 'text-slate-800 placeholder-slate-400' : 'text-zinc-200 placeholder-zinc-500'
              }`}
            />

            <div className={`px-3 pt-2 mt-1 border-t flex items-center justify-between text-xs ${
              isLight ? 'border-slate-100 text-slate-400' : 'border-zinc-800 text-zinc-500'
            }`}>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                  isLight ? 'bg-slate-100 text-slate-700' : 'bg-zinc-800 text-zinc-300'
                }`}>
                  {activePersona?.name}
                </span>
                <span>•</span>
                <span className={`font-mono text-[11px] ${
                  isLight ? 'text-amber-800 font-semibold' : 'text-amber-400'
                }`}>
                  Groq: {groqStatus.workingModel || apiConfig.model}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono hidden sm:inline">
                  Enter ↵ to send
                </span>
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() || isGenerating}
                  className={`px-4 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-xs ${
                    inputMessage.trim() && !isGenerating
                      ? (isLight
                          ? 'bg-slate-900 hover:bg-slate-800 text-white'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white')
                      : (isLight
                          ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                          : 'bg-zinc-800 text-zinc-600 cursor-not-allowed')
                  }`}
                >
                  <span>Send</span>
                  <Send className="w-3.5 h-3.5" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className={`rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl border transition-colors ${
            isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#202020] border-[#2e2e2e] text-[#e6e6e6]'
          }`}>
            {/* Modal Header */}
            <div className={`p-4 border-b flex items-center justify-between ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#242424] border-[#2e2e2e]'
            }`}>
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/15 text-amber-600 border border-amber-500/30">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    Groq API & Model Settings
                  </h3>
                  <p className={`text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-[#9b9b9b]'}`}>
                    Real-time streaming inference via Groq Cloud
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsApiSettingsOpen(false)}
                className={`p-1.5 rounded-lg transition ${isLight ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-200' : 'text-[#787774] hover:text-white'}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              {/* Provider Selection */}
              <div>
                <label className={`font-semibold block mb-1 ${isLight ? 'text-slate-800' : 'text-white'}`}>
                  LLM Provider
                </label>
                <select
                  value={apiConfig.provider}
                  onChange={(e) => {
                    const prov = e.target.value as any;
                    let defaultModel = 'llama-3.1-8b-instant';
                    let defaultUrl = 'https://api.groq.com/openai/v1';

                    if (prov === 'openai') {
                      defaultModel = 'gpt-4o';
                      defaultUrl = 'https://api.openai.com/v1';
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
                  className={`w-full rounded-xl px-3 py-2 text-xs border outline-none cursor-pointer transition ${
                    isLight
                      ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-indigo-500'
                      : 'bg-[#191919] border-[#2e2e2e] text-[#e6e6e6] focus:border-amber-500'
                  }`}
                >
                  <option value="groq">Groq Cloud (Recommended • 300+ Tokens/Sec)</option>
                  <option value="openrouter">OpenRouter (Any open-source & commercial model)</option>
                  <option value="openai">OpenAI (GPT-4o, GPT-4o-mini)</option>
                </select>
              </div>

              {/* API Key Input */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className={`font-semibold ${isLight ? 'text-slate-800' : 'text-white'}`}>
                    Groq API Key
                  </label>
                  <span className="text-[10px] font-mono text-amber-500 font-medium">Starts with gsk_...</span>
                </div>
                <input
                  type="password"
                  value={apiConfig.apiKey}
                  onChange={(e) => setApiConfig((prev) => ({ ...prev, apiKey: e.target.value }))}
                  placeholder={envGroqKey ? 'Overriding Vercel environment key...' : 'gsk_...'}
                  className={`w-full rounded-xl px-3 py-2 text-xs font-mono border outline-none transition ${
                    isLight
                      ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-indigo-500'
                      : 'bg-[#191919] border-[#2e2e2e] text-[#e6e6e6] focus:border-amber-500'
                  }`}
                />
                <p className={`text-[10px] mt-1 ${isLight ? 'text-slate-500' : 'text-[#787774]'}`}>
                  Free key from{' '}
                  <a href="https://console.groq.com/keys" target="_blank" rel="noreferrer" className="text-amber-500 underline font-semibold">
                    console.groq.com/keys
                  </a>
                  . Automatically loaded from Vercel’s <code>GROQ_API_KEY</code> if configured.
                </p>
              </div>

              {/* Model Selector */}
              <div>
                <label className={`font-semibold block mb-1 ${isLight ? 'text-slate-800' : 'text-white'}`}>
                  Model Name
                </label>
                {apiConfig.provider === 'groq' ? (
                  <select
                    value={groqStatus.workingModel || apiConfig.model}
                    onChange={(e) => {
                      const selected = e.target.value;
                      setApiConfig((prev) => ({ ...prev, model: selected }));
                      setGroqStatus((prev) => ({ ...prev, workingModel: selected }));
                    }}
                    className={`w-full rounded-xl px-3 py-2 text-xs font-mono border outline-none cursor-pointer transition ${
                      isLight
                        ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-indigo-500'
                        : 'bg-[#191919] border-[#2e2e2e] text-[#e6e6e6] focus:border-amber-500'
                    }`}
                  >
                    {groqStatus.availableModels.map((m) => (
                      <option key={m} value={m}>
                        {m} {m.includes('8b') ? '(Instant • Ultra-Fast)' : m.includes('70b') ? '(Deep Reasoning)' : ''}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={apiConfig.model}
                    onChange={(e) => setApiConfig((prev) => ({ ...prev, model: e.target.value }))}
                    placeholder="e.g. gpt-4o"
                    className={`w-full rounded-xl px-3 py-2 text-xs font-mono border outline-none transition ${
                      isLight
                        ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-indigo-500'
                        : 'bg-[#191919] border-[#2e2e2e] text-[#e6e6e6] focus:border-amber-500'
                    }`}
                  />
                )}
              </div>

              {/* Sliders: Temperature & Max Tokens */}
              <div className={`space-y-3 pt-3 border-t ${isLight ? 'border-slate-200' : 'border-[#2e2e2e]'}`}>
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className={`font-medium ${isLight ? 'text-slate-800' : 'text-white'}`}>
                      Temperature: {apiConfig.temperature}
                    </span>
                    <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-[#787774]'}`}>
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
                    <span className={`font-medium ${isLight ? 'text-slate-800' : 'text-white'}`}>
                      Max Tokens: {apiConfig.maxTokens}
                    </span>
                    <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-[#787774]'}`}>
                      Response Length Limit
                    </span>
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
              <div className={`pt-3 border-t ${isLight ? 'border-slate-200' : 'border-[#2e2e2e]'}`}>
                <button
                  onClick={() => checkGroqConnection()}
                  disabled={groqStatus.checking}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition flex items-center gap-2 cursor-pointer shadow-2xs ${
                    isLight
                      ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                      : 'bg-[#282828] hover:bg-[#323232] text-[#d4d4d4] border-[#383838]'
                  }`}
                >
                  {groqStatus.checking ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-500" />
                  ) : (
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                  )}
                  <span>Test Key & Probe Models</span>
                </button>

                {groqStatus.error && (
                  <div className="mt-2.5 p-3 rounded-xl text-xs font-mono bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/30 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                    <span>{groqStatus.error}</span>
                  </div>
                )}

                {groqStatus.verified && (
                  <div className="mt-2.5 p-3 rounded-xl text-xs font-mono bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                    <span>
                      Success! Verified model: <strong>{groqStatus.workingModel}</strong> ({groqStatus.keySource})
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className={`p-4 border-t flex items-center justify-between ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#242424] border-[#2e2e2e]'
            }`}>
              <button
                onClick={() => setApiConfig(DEFAULT_API_CONFIG)}
                className={`text-xs font-mono transition cursor-pointer ${
                  isLight ? 'text-slate-500 hover:text-slate-900' : 'text-[#787774] hover:text-white'
                }`}
              >
                Reset to Default
              </button>

              <button
                onClick={() => setIsApiSettingsOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition cursor-pointer shadow-xs"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className={`rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl border transition-colors ${
            isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#202020] border-[#2e2e2e] text-[#e6e6e6]'
          }`}>
            {/* Modal Header */}
            <div className={`p-4 border-b flex items-center justify-between ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#242424] border-[#2e2e2e]'
            }`}>
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-600 border border-indigo-500/30">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {editingPersona ? `Edit Persona: ${editingPersona.name}` : 'Create Custom Persona'}
                  </h3>
                  <p className={`text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-[#9b9b9b]'}`}>
                    Define persona system instructions, personality, quirks, and prompt starters
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsCreatePersonaOpen(false);
                  setEditingPersona(null);
                }}
                className={`p-1.5 rounded-lg transition ${isLight ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-200' : 'text-[#787774] hover:text-white'}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-3 gap-3">
                {/* Avatar Picker */}
                <div>
                  <label className={`font-semibold block mb-1 ${isLight ? 'text-slate-800' : 'text-white'}`}>
                    Avatar Emoji
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      maxLength={2}
                      value={newPersona.avatar}
                      onChange={(e) => setNewPersona((prev) => ({ ...prev, avatar: e.target.value }))}
                      className={`w-12 h-10 text-center text-xl rounded-xl border outline-none ${
                        isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#191919] border-[#2e2e2e]'
                      }`}
                    />
                    <div className="flex gap-1 flex-wrap">
                      {['⚙️', '📊', '⚡', '♟️', '🎴', '🤖', '💼'].map((emo) => (
                        <button
                          key={emo}
                          type="button"
                          onClick={() => setNewPersona((prev) => ({ ...prev, avatar: emo }))}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs transition cursor-pointer ${
                            isLight ? 'bg-slate-100 hover:bg-slate-200' : 'bg-[#282828] hover:bg-[#333333]'
                          }`}
                        >
                          {emo}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Name */}
                <div className="col-span-2">
                  <label className={`font-semibold block mb-1 ${isLight ? 'text-slate-800' : 'text-white'}`}>
                    Persona Name *
                  </label>
                  <input
                    type="text"
                    value={newPersona.name}
                    onChange={(e) => setNewPersona((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Mikah Walters, Market Quant, etc."
                    className={`w-full rounded-xl px-3 py-2 text-xs border outline-none ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-indigo-500' : 'bg-[#191919] border-[#2e2e2e] text-[#e6e6e6]'
                    }`}
                  />
                </div>
              </div>

              {/* Tagline & Category */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`font-semibold block mb-1 ${isLight ? 'text-slate-800' : 'text-white'}`}>
                    Role / Tagline
                  </label>
                  <input
                    type="text"
                    value={newPersona.tagline}
                    onChange={(e) => setNewPersona((prev) => ({ ...prev, tagline: e.target.value }))}
                    placeholder="e.g. Founder of SortSwift • Super Sorter Lead"
                    className={`w-full rounded-xl px-3 py-2 text-xs border outline-none ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-indigo-500' : 'bg-[#191919] border-[#2e2e2e] text-[#e6e6e6]'
                    }`}
                  />
                </div>

                <div>
                  <label className={`font-semibold block mb-1 ${isLight ? 'text-slate-800' : 'text-white'}`}>
                    Category
                  </label>
                  <select
                    value={newPersona.category}
                    onChange={(e) => setNewPersona((prev) => ({ ...prev, category: e.target.value as any }))}
                    className={`w-full rounded-xl px-3 py-2 text-xs border outline-none cursor-pointer ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-indigo-500' : 'bg-[#191919] border-[#2e2e2e] text-[#e6e6e6]'
                    }`}
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
                  <label className={`font-semibold ${isLight ? 'text-slate-800' : 'text-white'}`}>
                    Core System Prompt & Directives *
                  </label>
                  <span className="text-[10px] font-mono text-amber-500 font-medium">Fed directly to LLM</span>
                </div>
                <textarea
                  rows={4}
                  value={newPersona.systemPrompt}
                  onChange={(e) => setNewPersona((prev) => ({ ...prev, systemPrompt: e.target.value }))}
                  placeholder="You are [Name], a specialist in... Your tone is... You always prioritize..."
                  className={`w-full rounded-xl p-3 text-xs font-mono leading-relaxed border outline-none ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-indigo-500' : 'bg-[#191919] border-[#2e2e2e] text-[#e6e6e6]'
                  }`}
                />
              </div>

              {/* Backstory & Speaking Style */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`font-semibold block mb-1 ${isLight ? 'text-slate-800' : 'text-white'}`}>
                    Backstory & Experience
                  </label>
                  <textarea
                    rows={2}
                    value={newPersona.backstory}
                    onChange={(e) => setNewPersona((prev) => ({ ...prev, backstory: e.target.value }))}
                    placeholder="Background and career context..."
                    className={`w-full rounded-xl p-2.5 text-xs border outline-none ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-indigo-500' : 'bg-[#191919] border-[#2e2e2e] text-[#e6e6e6]'
                    }`}
                  />
                </div>

                <div>
                  <label className={`font-semibold block mb-1 ${isLight ? 'text-slate-800' : 'text-white'}`}>
                    Speaking Style & Tone
                  </label>
                  <textarea
                    rows={2}
                    value={newPersona.speakingStyle}
                    onChange={(e) => setNewPersona((prev) => ({ ...prev, speakingStyle: e.target.value }))}
                    placeholder="e.g. Conversational, energetic, uses 'haha', '🙂'..."
                    className={`w-full rounded-xl p-2.5 text-xs border outline-none ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-indigo-500' : 'bg-[#191919] border-[#2e2e2e] text-[#e6e6e6]'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className={`p-4 border-t flex items-center justify-end gap-3 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#242424] border-[#2e2e2e]'
            }`}>
              <button
                onClick={() => {
                  setIsCreatePersonaOpen(false);
                  setEditingPersona(null);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer border ${
                  isLight ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700' : 'bg-[#282828] hover:bg-[#323232] border-[#383838] text-[#d4d4d4]'
                }`}
              >
                Cancel
              </button>

              <button
                onClick={handleSaveCustomPersona}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs transition cursor-pointer"
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
          <div className={`w-full max-w-md border-l h-full flex flex-col justify-between shadow-2xl p-6 overflow-y-auto space-y-6 transition-colors ${
            isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#202020] border-[#2e2e2e] text-white'
          }`}>
            <div className="space-y-5">
              <div className={`flex items-center justify-between pb-3 border-b ${
                isLight ? 'border-slate-200' : 'border-[#2e2e2e]'
              }`}>
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl">{activePersona.avatar}</span>
                  <div>
                    <h3 className={`font-bold text-base ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {activePersona.name}
                    </h3>
                    <span className="text-xs text-amber-600 dark:text-amber-400 font-mono font-semibold">
                      {activePersona.category}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsPersonaDrawerOpen(false)}
                  className={`p-1.5 rounded-lg transition ${isLight ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100' : 'text-[#787774] hover:text-white'}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Tagline & Bio */}
              <div className="space-y-1">
                <span className={`text-[10px] font-mono uppercase font-bold ${
                  isLight ? 'text-slate-400' : 'text-[#787774]'
                }`}>
                  Professional Bio
                </span>
                <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-[#d4d4d4]'}`}>
                  {activePersona.backstory}
                </p>
              </div>

              {/* Core System Prompt Box */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-amber-600 dark:text-amber-400 font-bold">
                  Active LLM System Directives
                </span>
                <div className={`p-3.5 rounded-2xl border text-xs font-mono leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto shadow-inner ${
                  isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-[#191919] border-[#2e2e2e] text-[#d4d4d4]'
                }`}>
                  {activePersona.systemPrompt}
                </div>
              </div>

              {/* Quirks & Signature Traits */}
              {activePersona.quirks && activePersona.quirks.length > 0 && (
                <div className="space-y-1.5">
                  <span className={`text-[10px] font-mono uppercase font-bold ${
                    isLight ? 'text-slate-400' : 'text-[#787774]'
                  }`}>
                    Signature Quirks
                  </span>
                  <div className="space-y-1.5">
                    {activePersona.quirks.map((q, idx) => (
                      <div
                        key={idx}
                        className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 shadow-2xs ${
                          isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-[#252525] border-[#2e2e2e] text-[#d4d4d4]'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>{q}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sync / Refresh Mikah button */}
              {activePersona.id === MIKAH_PERSONA.id && (
                <button
                  type="button"
                  onClick={() => {
                    setPersonas((prev) => [
                      MIKAH_PERSONA,
                      ...prev.filter((p) => p.id !== MIKAH_PERSONA.id),
                    ]);
                    alert('Mikah Walters has been refreshed with the latest authentic founder directives.');
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-semibold transition flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Sync Latest Mikah Personality Prompt</span>
                </button>
              )}
            </div>

            <button
              onClick={() => setIsPersonaDrawerOpen(false)}
              className={`w-full py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer border ${
                isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800' : 'bg-[#282828] hover:bg-[#323232] text-white border-[#383838]'
              }`}
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
