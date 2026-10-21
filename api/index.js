import express from 'express';
import catalogRoutes from '../server/catalogRoutes.js';
import groqRoutes from '../server/groqRoutes.js';

const app = express();
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true, environment: 'vercel-serverless' });
});
app.get('/health', (req, res) => {
  res.json({ ok: true, environment: 'vercel-serverless' });
});

// Groq API check & streaming proxy (Vercel serverless)
app.use('/api/groq', groqRoutes);
app.use('/groq', groqRoutes);

// Catalog routes
app.use('/api/catalog', catalogRoutes);
app.use('/catalog', catalogRoutes);

export default app;
