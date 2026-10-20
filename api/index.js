import express from 'express';
import catalogRoutes from '../server/catalogRoutes.js';

const app = express();
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true, environment: 'vercel-serverless' });
});

// Catalog routes
app.use('/api/catalog', catalogRoutes);

export default app;
