import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import axios from 'axios';
import analyzeRoutes from './routes/analyze.js';
import gemstonesRoutes from './routes/gemstones.js';

const app = express();
const PORT = process.env.PORT || 3001;
const ML_SERVER = process.env.PYTHON_ML_SERVER_URL || 'http://localhost:5000';

// ── Middleware ──
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:4173', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-session-id'],
}));
app.use(express.json());

// ── Routes ──
app.use('/api/analyze', analyzeRoutes);
app.use('/api/gemstones', gemstonesRoutes);

// ── Health Check ──
app.get('/api/health', async (_req, res) => {
  let mlStatus = 'unknown';
  try {
    const mlHealth = await axios.get(`${ML_SERVER}/health`, { timeout: 5000 });
    mlStatus = mlHealth.data?.status || 'connected';
  } catch {
    mlStatus = 'disconnected';
  }

  res.json({
    status: 'healthy',
    server: 'CycloneGems API Gateway',
    port: PORT,
    mlServer: {
      url: ML_SERVER,
      status: mlStatus,
    },
    timestamp: new Date().toISOString(),
  });
});

// ── Error Handler ──
app.use((err, _req, res, _next) => {
  console.error('[Server Error]', err.message);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// ── Start Server ──
app.listen(PORT, () => {
  console.log('');
  console.log('  ╔═══════════════════════════════════════════╗');
  console.log('  ║   🔮 CycloneGems AI - API Gateway        ║');
  console.log(`  ║   Running on http://localhost:${PORT}         ║`);
  console.log(`  ║   ML Server: ${ML_SERVER}   ║`);
  console.log('  ╚═══════════════════════════════════════════╝');
  console.log('');
});
