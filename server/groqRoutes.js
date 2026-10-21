import express from 'express';

const router = express.Router();

// Helper to sanitize and pick working chat model
const PREFERRED_MODELS = [
  'llama-3.3-70b-versatile',
  'llama-3.1-8b-instant',
  'llama-3.1-70b-versatile',
  'llama3-70b-8192',
  'llama3-8b-8192',
  'mixtral-8x7b-32768',
  'gemma2-9b-it',
];

// Check if Groq key in Vercel or headers works, and verify which models work
router.all('/check', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const clientKey = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
    const envKey = process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY || '';
    const keyToTest = clientKey || envKey;

    if (!keyToTest) {
      return res.status(200).json({
        ok: false,
        error: 'No Groq API key found in Vercel environment variables (GROQ_API_KEY or VITE_GROQ_API_KEY) or in client storage.',
        keySource: 'none',
      });
    }

    // 1. Fetch available models from Groq
    const groqRes = await fetch('https://api.groq.com/openai/v1/models', {
      headers: {
        Authorization: `Bearer ${keyToTest}`,
        'Content-Type': 'application/json',
      },
    });

    if (!groqRes.ok) {
      const errJson = await groqRes.json().catch(() => ({}));
      return res.status(200).json({
        ok: false,
        error: errJson.error?.message || `Groq API returned HTTP ${groqRes.status}: Authentication failed`,
        keySource: clientKey ? 'client' : 'vercel-env',
        maskedKey: keyToTest.slice(0, 7) + '...' + keyToTest.slice(-4),
      });
    }

    const data = await groqRes.json();
    const allModels = (data.data || []).map((m) => m.id);

    // Filter to text chat/generation models
    const chatModels = allModels.filter(
      (id) => !id.includes('whisper') && !id.includes('guard') && !id.includes('embed')
    );

    // 2. Perform live probe to verify which model actually accepts completion requests
    let workingModel = null;
    let probeError = null;

    // Test preferred models first, then any available chat model
    const candidatesToTest = [
      ...PREFERRED_MODELS.filter((m) => chatModels.includes(m)),
      ...chatModels,
    ];
    // Remove duplicates
    const uniqueCandidates = Array.from(new Set(candidatesToTest));

    for (const modelCandidate of uniqueCandidates) {
      try {
        const probeRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${keyToTest}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: modelCandidate,
            messages: [{ role: 'user', content: 'hi' }],
            max_tokens: 3,
          }),
        });

        if (probeRes.ok) {
          workingModel = modelCandidate;
          break;
        } else {
          const errData = await probeRes.json().catch(() => ({}));
          probeError = errData.error?.message;
        }
      } catch (e) {
        probeError = e.message;
      }
    }

    if (!workingModel) {
      return res.status(200).json({
        ok: false,
        error: `Key is valid, but model completion failed: ${probeError || 'No models accessible'}`,
        keySource: clientKey ? 'client' : 'vercel-env',
        maskedKey: keyToTest.slice(0, 7) + '...' + keyToTest.slice(-4),
        allModels,
      });
    }

    return res.json({
      ok: true,
      keySource: clientKey ? 'client' : 'vercel-env',
      maskedKey: keyToTest.slice(0, 7) + '...' + keyToTest.slice(-4),
      workingModel,
      activeModels: uniqueCandidates,
      allModels,
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
});

// Streaming Chat Proxy via Vercel or Client Key
router.post('/chat', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const clientKey = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
    const envKey = process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY || '';
    const keyToUse = clientKey || envKey;

    if (!keyToUse) {
      return res.status(400).json({
        error: { message: 'No Groq API key found in Vercel environment or request headers.' },
      });
    }

    const { messages, model = 'llama-3.1-8b-instant', temperature = 0.7, max_tokens = 1024, stream = true } = req.body;

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${keyToUse}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens,
        stream,
      }),
    });

    if (!groqRes.ok) {
      const errJson = await groqRes.json().catch(() => ({}));
      return res.status(groqRes.status).json(errJson);
    }

    if (!stream) {
      const data = await groqRes.json();
      return res.json(data);
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const reader = groqRes.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(decoder.decode(value, { stream: true }));
    }

    res.end();
  } catch (err) {
    console.error('Groq proxy error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: { message: err.message } });
    } else {
      res.end();
    }
  }
});

export default router;
