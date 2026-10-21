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
} from 'lucide-react';

import {
  Persona,
  ApiConfig,
  ChatMessage,
  ChatSession,
  DEFAULT_API_CONFIG,
  INITIAL_PERSONAS,
  generateSimulatedReply,
} from '../data/personaChatData';

export const PersonaChatView: React.FC = () => {
  // 1. Core State
  const [personas, setPersonas] = useState<Persona[]>(() => {
    try {
      const saved = localStorage.getItem('aeethod_custom_personas');
      if (saved) {
        const parsed: Persona[] = JSON.parse(saved);
        // Merge with built-in personas so built-ins stay fresh
        const builtInIds = new Set(INITIAL_PERSONAS.map((p) => p.id));
        const customOnly = parsed.filter((p) => !builtInIds.has(p.id));
        return [...INITIAL_PERSONAS, ...customOnly];
      }
    } catch {}
    return INITIAL_PERSONAS;
  });

  const [activePersonaId, setActivePersonaId] = useState<string>(INITIAL_PERSONAS[0].id);

  const [apiConfig, setApiConfig] = useState<ApiConfig>(() => {
    try {
      const saved = localStorage.getItem('aeethod_persona_api_config');
      if (saved) return { ...DEFAULT_API_CONFIG, ...JSON.parse(saved) };
    } catch {}
    return DEFAULT_API_CONFIG;
  });

  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem('aeethod_persona_chat_sessions');
      if (saved) {
        const parsed: ChatSession[] = JSON.parse(saved);
        if (parsed.length > 0) return parsed;
      }
    } catch {}
    // Initial default session
    return [
      {
        id: 'session-default',
        title: 'Akihabara Market Intelligence & Grails',
        personaId: INITIAL_PERSONAS[0].id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: [
          {
            id: 'msg-init-1',
            role: 'assistant',
            content: `Konnichiwa! I am **Kenji Takahashi (高橋 健二)**, your Tokyo TCG & Vintage Grail Specialist.

Whether you're analyzing Japanese **151 SV2a** Master Ball print runs, tracking **s6a Eevee Heroes Moonbreon**, or grading vintage **1996 PMCG Base Set** holos, I am at your service.

What market signals or card valuations would you like to explore today?`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            personaId: INITIAL_PERSONAS[0].id,
            isSimulated: true,
          },
        ],
      },
    ];
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(() => {
    return sessions[0]?.id || 'session-default';
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
    speakingStyle: 'Professional, articulate, insightful',
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
    const customOnes = personas.filter((p) => p.isCustom);
    localStorage.setItem('aeethod_custom_personas', JSON.stringify(customOnes));
  }, [personas]);

  // Save API config to localStorage
  useEffect(() => {
    localStorage.setItem('aeethod_persona_api_config', JSON.stringify(apiConfig));
  }, [apiConfig]);

  // Save sessions to localStorage
  useEffect(() => {
    localStorage.setItem('aeethod_persona_chat_sessions', JSON.stringify(sessions));
  }, [sessions]);

  // Active Session & Persona helpers
  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];
  const activePersona = personas.find((p) => p.id === (activeSession?.personaId || activePersonaId)) || personas[0];

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession?.messages, isGenerating]);

  // Create New Session
  const handleCreateNewSession = (personaId?: string) => {
    const targetPersonaId = personaId || activePersona.id;
    const targetPersona = personas.find((p) => p.id === targetPersonaId) || activePersona;
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
    if (sessions.length <= 1) {
      // If last session, reset it instead of deleting
      setSessions([
        {
          id: `session-${Date.now()}`,
          title: `New Session with ${activePersona.name}`,
          personaId: activePersona.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          messages: [],
        },
      ]);
      return;
    }

    const filtered = sessions.filter((s) => s.id !== id);
    setSessions(filtered);
    if (activeSessionId === id) {
      setActiveSessionId(filtered[0]?.id || '');
    }
  };

  // Clear Current Session Messages
  const handleClearCurrentSession = () => {
    if (!activeSession) return;
    setSessions((prev) =>
      prev.map((s) => (s.id === activeSession.id ? { ...s, messages: [], updatedAt: new Date().toISOString() } : s))
    );
  };

  // Send Message Logic (Supports Real API with Intelligent Fallback)
  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || inputMessage).trim();
    if (!messageContent || isGenerating || !activeSession) return;

    setInputMessage('');

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: messageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Update session title if first user message
    const updatedTitle =
      activeSession.messages.length === 0
        ? messageContent.slice(0, 32) + (messageContent.length > 32 ? '...' : '')
        : activeSession.title;

    const newMessages = [...activeSession.messages, userMessage];

    // Optimistically update session
    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSession.id
          ? {
              ...s,
              title: updatedTitle,
              messages: newMessages,
              updatedAt: new Date().toISOString(),
            }
          : s
      )
    );

    setIsGenerating(true);

    try {
      // 1. Check if user configured a real LLM API Key
      if (apiConfig.provider !== 'simulation' && apiConfig.apiKey.trim()) {
        const assistantReplyText = await callRealApi(activePersona, newMessages, apiConfig);

        const assistantMsg: ChatMessage = {
          id: `msg-resp-${Date.now()}`,
          role: 'assistant',
          content: assistantReplyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          personaId: activePersona.id,
          modelUsed: `${apiConfig.provider}:${apiConfig.model}`,
          isSimulated: false,
        };

        setSessions((prev) =>
          prev.map((s) =>
            s.id === activeSession.id
              ? {
                  ...s,
                  messages: [...newMessages, assistantMsg],
                  updatedAt: new Date().toISOString(),
                }
              : s
          )
        );
      } else {
        // 2. Intelligent In-Character Simulation Engine
        await new Promise((resolve) => setTimeout(resolve, apiConfig.simulationDelayMs));
        const simulatedText = generateSimulatedReply(activePersona, messageContent, newMessages);

        const assistantMsg: ChatMessage = {
          id: `msg-sim-${Date.now()}`,
          role: 'assistant',
          content: simulatedText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          personaId: activePersona.id,
          modelUsed: 'aeethod-simulated-engine',
          isSimulated: true,
        };

        setSessions((prev) =>
          prev.map((s) =>
            s.id === activeSession.id
              ? {
                  ...s,
                  messages: [...newMessages, assistantMsg],
                  updatedAt: new Date().toISOString(),
                }
              : s
          )
        );
      }
    } catch (err: any) {
      console.error('API Error:', err);
      // Fallback message with option to simulate
      const errorMsg: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ **API Connection Error:** ${err.message || 'Failed to connect to API endpoint'}.

> **Simulation Fallback:**
${generateSimulatedReply(activePersona, messageContent, newMessages)}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        personaId: activePersona.id,
        modelUsed: 'fallback-simulation',
        isSimulated: true,
      };

      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSession.id
            ? {
                ...s,
                messages: [...newMessages, errorMsg],
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

  // Real LLM API caller
  const callRealApi = async (persona: Persona, history: ChatMessage[], config: ApiConfig): Promise<string> => {
    // 1. OpenAI / OpenRouter / Groq Format
    if (config.provider === 'openai' || config.provider === 'openrouter' || config.provider === 'groq') {
      const endpoint =
        config.provider === 'openrouter'
          ? 'https://openrouter.ai/api/v1/chat/completions'
          : config.provider === 'groq'
          ? 'https://api.groq.com/openai/v1/chat/completions'
          : `${config.baseUrl.replace(/\/+$/, '')}/chat/completions`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
          model: config.model,
          temperature: config.temperature,
          max_tokens: config.maxTokens,
          messages: [
            { role: 'system', content: persona.systemPrompt },
            ...history.map((m) => ({ role: m.role, content: m.content })),
          ],
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error?.message || `HTTP ${response.status}: API Call Failed`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || 'No response returned from model.';
    }

    // 2. Ollama Localhost
    if (config.provider === 'ollama') {
      const endpoint = `${config.baseUrl.replace(/\/+$/, '')}/api/chat`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: config.model || 'llama3',
          stream: false,
          messages: [
            { role: 'system', content: persona.systemPrompt },
            ...history.map((m) => ({ role: m.role, content: m.content })),
          ],
        }),
      });

      if (!response.ok) throw new Error(`Ollama returned status ${response.status}`);
      const data = await response.json();
      return data.message?.content || 'No response from Ollama.';
    }

    // 3. Google Gemini
    if (config.provider === 'gemini') {
      const model = config.model || 'gemini-1.5-flash';
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${config.apiKey}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: persona.systemPrompt }] },
          contents: history.map((m) => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }],
          })),
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error?.message || `Gemini HTTP ${response.status}`);
      }

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini.';
    }

    // Default simulation
    return generateSimulatedReply(persona, history[history.length - 1].content, history);
  };

  // Test API Connection
  const handleTestApi = async () => {
    setApiTestStatus({ loading: true });
    try {
      if (apiConfig.provider === 'simulation') {
        await new Promise((r) => setTimeout(r, 400));
        setApiTestStatus({
          loading: false,
          success: true,
          message: 'Simulation Engine Ready. No API key required!',
        });
        return;
      }

      if (!apiConfig.apiKey.trim()) {
        setApiTestStatus({
          loading: false,
          success: false,
          message: 'Please provide an API Key to test connection.',
        });
        return;
      }

      // Simple test ping
      const res = await callRealApi(
        activePersona,
        [{ id: 'test', role: 'user', content: 'Respond with exactly: CONNECTION_SUCCESSFUL', timestamp: '' }],
        { ...apiConfig, maxTokens: 20 }
      );

      setApiTestStatus({
        loading: false,
        success: true,
        message: `Success! Response received: "${res.slice(0, 40)}..."`,
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
    if (!activeSession) return;
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
                isCustom: true,
              } as Persona)
            : p
        )
      );
    } else {
      // Create new
      const created: Persona = {
        id: `persona-${Date.now()}`,
        name: newPersona.name || 'Custom Persona',
        tagline: newPersona.tagline || 'Custom Expert in Aeethod OS',
        avatar: newPersona.avatar || '🤖',
        category: (newPersona.category as any) || 'Custom',
        systemPrompt: newPersona.systemPrompt || '',
        backstory: newPersona.backstory || 'Custom created persona for simulation in Aeethod OS.',
        speakingStyle: newPersona.speakingStyle || 'Concise and informative',
        quirks: newPersona.quirks || [],
        temperature: newPersona.temperature || 0.7,
        suggestedStarters: newPersona.suggestedStarters || ['Hello! How can you help me today?'],
        badgeColor: newPersona.badgeColor || 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
        createdAt: new Date().toISOString(),
        isCustom: true,
      };

      setPersonas((prev) => [...prev, created]);
      setActivePersonaId(created.id);
      handleCreateNewSession(created.id);
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
    if (!confirm('Are you sure you want to delete this custom persona?')) return;
    setPersonas((prev) => prev.filter((p) => p.id !== id));
    if (activePersonaId === id) {
      setActivePersonaId(INITIAL_PERSONAS[0].id);
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
              <span className="font-bold text-xs text-white uppercase tracking-wider">Persona Studio</span>
            </div>

            <button
              onClick={() => setIsApiSettingsOpen(true)}
              className="p-1 rounded text-[#9b9b9b] hover:text-white hover:bg-[#2c2c2c] transition flex items-center gap-1 text-[11px]"
              title="API Configuration"
            >
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-mono text-[10px] text-amber-300">
                {apiConfig.provider === 'simulation' ? 'SIM' : apiConfig.provider.toUpperCase()}
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
        <div className="px-3 pt-3 pb-1 border-b border-[#2e2e2e]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#787774]">
              Active Personas ({personas.length})
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
                  speakingStyle: 'Professional, articulate, insightful',
                  quirks: [],
                  temperature: 0.7,
                  suggestedStarters: ['How can I help you today?'],
                  badgeColor: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
                });
                setIsCreatePersonaOpen(true);
              }}
              className="text-[11px] font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>Create</span>
            </button>
          </div>

          {/* Horizontal mini persona avatar strip */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2">
            {personas.map((p) => {
              const isSelected = p.id === activePersona.id;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setActivePersonaId(p.id);
                    // If in current session without messages, rebind persona
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
                      ? 'bg-indigo-600/30 border-2 border-indigo-500 shadow-sm scale-105'
                      : 'bg-[#282828] hover:bg-[#323232] border border-[#383838]'
                  }`}
                  title={`${p.name} (${p.category})`}
                >
                  <span>{p.avatar}</span>
                  {p.isCustom && (
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
            const persona = personas.find((p) => p.id === session.personaId) || personas[0];
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
                  <span className="text-base shrink-0 mt-0.5">{persona.avatar}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-semibold truncate ${isActive ? 'text-white' : 'text-[#d4d4d4]'}`}>
                        {session.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#787774] truncate mt-0.5">
                      {lastMessage ? lastMessage.content.replace(/[#*`_]/g, '').slice(0, 42) : `Ready to chat with ${persona.name}`}
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
            <span
              className={`w-2 h-2 rounded-full ${
                apiConfig.provider === 'simulation' ? 'bg-amber-400' : 'bg-emerald-400'
              } animate-pulse`}
            />
            <span className="text-[11px]">
              {apiConfig.provider === 'simulation' ? 'Offline Simulator' : apiConfig.provider}
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
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#2a2a2a] border border-[#3a3a3a] flex items-center justify-center text-xl shrink-0 shadow-sm">
              {activePersona.avatar}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-sm text-white truncate">{activePersona.name}</h2>
                {activePersona.japaneseName && (
                  <span className="text-xs text-rose-400 font-mono hidden sm:inline">
                    {activePersona.japaneseName}
                  </span>
                )}
                <span className={`px-2 py-0.2 rounded text-[10px] font-mono border ${activePersona.badgeColor}`}>
                  {activePersona.category}
                </span>
                {activePersona.isCustom && (
                  <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                    Custom
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#9b9b9b] truncate">{activePersona.tagline}</p>
            </div>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2 shrink-0">
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

            {/* API Config Button */}
            <button
              onClick={() => setIsApiSettingsOpen(true)}
              className="px-2.5 py-1 rounded-md bg-[#282828] hover:bg-[#323232] text-xs border border-[#383838] transition flex items-center gap-1.5 cursor-pointer text-[#d4d4d4]"
              title="Configure API and Model"
            >
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden lg:inline font-mono text-[11px]">
                {apiConfig.provider === 'simulation' ? 'Simulator' : apiConfig.model}
              </span>
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5">
          {/* Persona Hero Welcome (shown if no messages) */}
          {activeSession.messages.length === 0 && (
            <div className="max-w-2xl mx-auto py-8 space-y-6 text-center animate-fade-in">
              <div className="w-20 h-20 rounded-3xl bg-[#222222] border border-[#333333] flex items-center justify-center text-4xl mx-auto shadow-xl shadow-black/40">
                {activePersona.avatar}
              </div>

              <div className="space-y-1.5">
                <h3 className="text-xl font-black text-white flex items-center justify-center gap-2">
                  <span>{activePersona.name}</span>
                  {activePersona.japaneseName && (
                    <span className="text-sm font-mono text-rose-400">({activePersona.japaneseName})</span>
                  )}
                </h3>
                <p className="text-xs text-indigo-300 font-mono">{activePersona.tagline}</p>
                <p className="text-xs text-[#9b9b9b] max-w-md mx-auto leading-relaxed pt-1">
                  {activePersona.backstory}
                </p>
              </div>

              {/* Persona Quirks / Specialties */}
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

              {/* Suggested Starters */}
              <div className="pt-4 space-y-2 max-w-lg mx-auto">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#787774] block">
                  Click a prompt starter to begin simulation:
                </span>
                <div className="grid grid-cols-1 gap-2 text-left">
                  {activePersona.suggestedStarters.map((starter, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(starter)}
                      className="p-2.5 rounded-xl bg-[#222222] hover:bg-[#282828] border border-[#2e2e2e] hover:border-indigo-500/50 text-xs text-[#d4d4d4] hover:text-white transition flex items-center justify-between gap-2 group cursor-pointer"
                    >
                      <span>{starter}</span>
                      <Send className="w-3 h-3 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Render Messages */}
          {activeSession.messages.map((msg) => {
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
                        {msg.isSimulated && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[9px]">
                            Simulated
                          </span>
                        )}
                        {msg.modelUsed && !msg.isSimulated && (
                          <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[9px]">
                            {msg.modelUsed}
                          </span>
                        )}
                      </div>
                      <span>{msg.timestamp}</span>
                    </div>
                  )}

                  {/* Message Content */}
                  <div className="whitespace-pre-wrap space-y-2">
                    {msg.content}
                  </div>

                  {/* Actions Bar (Copy message) */}
                  <div className="mt-2 pt-1 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="p-1 rounded text-[#787774] hover:text-[#d4d4d4] transition flex items-center gap-1 text-[10px] font-mono"
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

          {/* Typing Indicator */}
          {isGenerating && (
            <div className="flex gap-3 max-w-3xl mx-auto items-start">
              <div className="w-8 h-8 rounded-lg bg-[#252525] border border-[#353535] flex items-center justify-center text-base shrink-0 mt-0.5">
                {activePersona.avatar}
              </div>
              <div className="bg-[#222222] border border-[#2e2e2e] rounded-2xl rounded-tl-none p-3.5 flex items-center gap-2 text-xs font-mono text-[#9b9b9b]">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                <span>{activePersona.name} is thinking & drafting response...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input & Starter Bar */}
        <div className="p-4 border-t border-[#2e2e2e] bg-[#202020] space-y-2">
          {/* Horizontal Suggested Starters Pills when chat has started */}
          {activeSession.messages.length > 0 && (
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
          <div className="relative bg-[#191919] border border-[#2e2e2e] focus-within:border-indigo-500 rounded-xl overflow-hidden shadow-inner transition">
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
              placeholder={`Message ${activePersona.name}... (Press Enter to send, Shift+Enter for new line)`}
              className="w-full bg-transparent px-3.5 py-2.5 text-xs text-[#e6e6e6] placeholder-[#6e6e6e] outline-none resize-none"
            />

            <div className="px-3 py-1.5 bg-[#1f1f1f] border-t border-[#2a2a2a] flex items-center justify-between text-[11px] font-mono text-[#787774]">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1">
                  <span>Persona:</span>
                  <span className="text-white font-bold">{activePersona.name}</span>
                </span>
                <span>•</span>
                <span className="text-amber-400">
                  {apiConfig.provider === 'simulation' ? 'Simulated Response' : `API: ${apiConfig.provider}`}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() || isGenerating}
                  className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                    inputMessage.trim() && !isGenerating
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs'
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
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">API & LLM Simulation Settings</h3>
                  <p className="text-[11px] text-[#9b9b9b] font-mono">
                    Connect real LLM endpoints or simulate in-character chat offline
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
                    let defaultModel = 'gpt-4o';
                    let defaultUrl = 'https://api.openai.com/v1';

                    if (prov === 'gemini') {
                      defaultModel = 'gemini-1.5-flash';
                      defaultUrl = 'https://generativelanguage.googleapis.com';
                    } else if (prov === 'groq') {
                      defaultModel = 'llama-3.3-70b-versatile';
                      defaultUrl = 'https://api.groq.com/openai/v1';
                    } else if (prov === 'openrouter') {
                      defaultModel = 'meta-llama/llama-3.1-70b-instruct';
                      defaultUrl = 'https://openrouter.ai/api/v1';
                    } else if (prov === 'ollama') {
                      defaultModel = 'llama3';
                      defaultUrl = 'http://localhost:11434';
                    }

                    setApiConfig((prev) => ({
                      ...prev,
                      provider: prov,
                      model: defaultModel,
                      baseUrl: defaultUrl,
                    }));
                  }}
                  className="w-full bg-[#191919] border border-[#2e2e2e] rounded-lg px-3 py-2 text-xs text-[#e6e6e6] focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="simulation">Offline Simulation Mode (No API key needed • Smart In-Character Engine)</option>
                  <option value="openai">OpenAI (GPT-4o, GPT-4o-mini, o1-preview)</option>
                  <option value="gemini">Google Gemini (Gemini 1.5 Pro, Gemini 1.5 Flash)</option>
                  <option value="groq">Groq Cloud (Llama 3.3 70B, Mixtral - Ultra Fast)</option>
                  <option value="openrouter">OpenRouter (Any open-source & commercial model)</option>
                  <option value="ollama">Ollama (Localhost:11434 - 100% Free & Private)</option>
                </select>
                <p className="text-[11px] text-[#787774] mt-1 font-mono">
                  {apiConfig.provider === 'simulation'
                    ? '✦ Runs the built-in collector & persona logic directly in your browser.'
                    : '✦ Directly prompts your model using the active persona’s full system prompt.'}
                </p>
              </div>

              {/* API Key Input (if not simulation) */}
              {apiConfig.provider !== 'simulation' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-white">API Key</label>
                    <span className="text-[10px] font-mono text-[#787774]">Stored in local browser storage</span>
                  </div>
                  <input
                    type="password"
                    value={apiConfig.apiKey}
                    onChange={(e) => setApiConfig((prev) => ({ ...prev, apiKey: e.target.value }))}
                    placeholder={`Enter your ${apiConfig.provider} API key (e.g. sk-...)`}
                    className="w-full bg-[#191919] border border-[#2e2e2e] rounded-lg px-3 py-2 text-xs text-[#e6e6e6] font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              )}

              {/* Model & Base URL */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-white block mb-1">Model Name</label>
                  <input
                    type="text"
                    value={apiConfig.model}
                    onChange={(e) => setApiConfig((prev) => ({ ...prev, model: e.target.value }))}
                    placeholder="e.g. gpt-4o or gemini-1.5-flash"
                    className="w-full bg-[#191919] border border-[#2e2e2e] rounded-lg px-3 py-2 text-xs text-[#e6e6e6] font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-white block mb-1">Base URL Endpoint</label>
                  <input
                    type="text"
                    value={apiConfig.baseUrl}
                    onChange={(e) => setApiConfig((prev) => ({ ...prev, baseUrl: e.target.value }))}
                    placeholder="https://api.openai.com/v1"
                    className="w-full bg-[#191919] border border-[#2e2e2e] rounded-lg px-3 py-2 text-xs text-[#e6e6e6] font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Sliders: Temperature & Max Tokens */}
              <div className="space-y-3 pt-2 border-t border-[#2e2e2e]">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-white font-medium">Temperature: {apiConfig.temperature}</span>
                    <span className="text-[10px] font-mono text-[#787774]">
                      {apiConfig.temperature < 0.5 ? 'Precise & Deterministic' : 'Creative & Dynamic'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1.5"
                    step="0.05"
                    value={apiConfig.temperature}
                    onChange={(e) => setApiConfig((prev) => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                    className="w-full accent-indigo-500 cursor-pointer"
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
                    className="w-full accent-indigo-500 cursor-pointer"
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
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                  ) : (
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                  )}
                  <span>Test Connection Now</span>
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
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition cursor-pointer shadow-xs"
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
                      {['🎴', '📐', '⚡', '♟️', '🎨', '💼', '🧙‍♂️'].map((emo) => (
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
                  <label className="font-semibold text-white block mb-1">Persona Name</label>
                  <input
                    type="text"
                    value={newPersona.name}
                    onChange={(e) => setNewPersona((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Satoshi Nakamoto or Ruthless VC"
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
                    placeholder="e.g. Lead Tokenomics Engineer"
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
                    <option value="Executive">Executive</option>
                    <option value="TCG Specialist">TCG Specialist</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Product & UX">Product & UX</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>
              </div>

              {/* Core System Prompt */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-white">Core System Prompt & Persona Directives</label>
                  <span className="text-[10px] font-mono text-indigo-400">Sent directly to LLM</span>
                </div>
                <textarea
                  rows={4}
                  value={newPersona.systemPrompt}
                  onChange={(e) => setNewPersona((prev) => ({ ...prev, systemPrompt: e.target.value }))}
                  placeholder="You are [Name], a world-class expert in... Your tone is... You always prioritize..."
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
                    placeholder="Brief history of their career and expertise..."
                    className="w-full bg-[#191919] border border-[#2e2e2e] rounded-lg p-2.5 text-xs text-[#e6e6e6]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-white block mb-1">Speaking Style & Tone</label>
                  <textarea
                    rows={2}
                    value={newPersona.speakingStyle}
                    onChange={(e) => setNewPersona((prev) => ({ ...prev, speakingStyle: e.target.value }))}
                    placeholder="e.g. Sarcastic, razor-sharp, bullet-points..."
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
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-xs"
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
      {isPersonaDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-[#202020] border-l border-[#2e2e2e] h-full flex flex-col justify-between shadow-2xl p-6 overflow-y-auto space-y-6">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#2e2e2e]">
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl">{activePersona.avatar}</span>
                  <div>
                    <h3 className="font-bold text-base text-white">{activePersona.name}</h3>
                    <span className="text-xs text-indigo-400 font-mono">{activePersona.category}</span>
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
                <span className="text-[10px] font-mono uppercase text-indigo-400 font-bold">
                  Active System Prompt Directives
                </span>
                <div className="p-3 bg-[#191919] border border-[#2e2e2e] rounded-xl text-xs font-mono text-[#d4d4d4] leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                  {activePersona.systemPrompt}
                </div>
              </div>

              {/* Quirks & Signature Traits */}
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
