export interface Persona {
  id: string;
  name: string;
  japaneseName?: string;
  tagline: string;
  avatar: string;
  category: 'Executive' | 'TCG Specialist' | 'Engineering' | 'Product & UX' | 'Custom';
  systemPrompt: string;
  backstory: string;
  speakingStyle: string;
  quirks: string[];
  temperature: number;
  suggestedStarters: string[];
  badgeColor: string;
  createdAt: string;
  isCustom?: boolean;
}

export interface ApiConfig {
  provider: 'simulation' | 'openai' | 'anthropic' | 'gemini' | 'openrouter' | 'groq' | 'ollama';
  apiKey: string;
  model: string;
  baseUrl: string;
  temperature: number;
  maxTokens: number;
  streamResponse: boolean;
  simulationDelayMs: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  personaId?: string;
  modelUsed?: string;
  tokensEstimated?: number;
  isSimulated?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  personaId: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  pinned?: boolean;
}

export const DEFAULT_API_CONFIG: ApiConfig = {
  provider: 'simulation',
  apiKey: '',
  model: 'gpt-4o',
  baseUrl: 'https://api.openai.com/v1',
  temperature: 0.7,
  maxTokens: 1024,
  streamResponse: true,
  simulationDelayMs: 500,
};

// All initial hardcoded personas removed per user request:
export const INITIAL_PERSONAS: Persona[] = [];

// Intelligent in-character simulator for custom personas created by the user
export function generateSimulatedReply(persona: Persona, userMessage: string, history: ChatMessage[]): string {
  const q = userMessage.trim();
  const lowerQ = q.toLowerCase();

  // Extract key persona attributes
  const roleName = persona.name || 'Custom Persona';
  const roleTagline = persona.tagline || 'Specialist Advisor';
  const systemPrompt = persona.systemPrompt || '';
  const speakingStyle = persona.speakingStyle || 'Concise and strategic';

  // In-character simulated response tailored to their custom prompt
  let responseHeader = `### ${persona.avatar || '🤖'} ${roleName} Response\n`;
  if (persona.tagline) {
    responseHeader += `*${roleTagline}*\n\n`;
  }

  // Generate customized simulation body
  let simulationBody = '';

  if (lowerQ.includes('hello') || lowerQ.includes('hi') || lowerQ.includes('hey') || lowerQ.length < 15) {
    simulationBody = `Greetings! I am **${roleName}**, initialized with my custom system directives and ready for simulation in Aeethod OS.

> **Active Persona Directives:**
> ${systemPrompt.slice(0, 220)}${systemPrompt.length > 220 ? '...' : ''}

How would you like to direct our session today? Share your inquiry, challenge, or scenario and I will evaluate it adhering strictly to my profile.`;
  } else {
    simulationBody = `Addressing your point from the perspective of **${roleName}**:

> *"Adhering to my profile: ${speakingStyle}."*

#### 1. Strategic Evaluation
Regarding your question:
*"${q.slice(0, 160)}${q.length > 160 ? '...' : ''}"*

- **Core Assessment:** When applying my core directives, the immediate focus is high-leverage execution, minimizing blind spots, and validating underlying assumptions.
- **Critical Considerations:** We must evaluate both immediate second-order effects and longer-term sustainability before committing resources.

#### 2. Actionable Recommendations
1. **Define Measurable Benchmarks:** Establish clear success metrics and boundaries before executing on this workflow.
2. **Mitigate Primary Vulnerabilities:** Stress-test the weakest link in this assumption to prevent unforced errors.
3. **Iterative Verification:** Run a tight feedback loop to ensure outcomes align with expectations.

How would you like to dive deeper into this?`;
  }

  return `${responseHeader}${simulationBody}`;
}
