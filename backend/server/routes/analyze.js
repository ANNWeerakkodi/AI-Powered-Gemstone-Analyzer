import { Router } from 'express';
import multer from 'multer';
import axios from 'axios';
import { randomUUID } from 'crypto';
import { supabase } from '../lib/supabase.js';

const router = Router();

// Configure multer for in-memory file handling
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

const ML_SERVER = process.env.PYTHON_ML_SERVER_URL || 'http://localhost:5000';

/**
 * POST /api/analyze
 * Receives single or multi-image uploads, forwards to Python ML server, saves result to Supabase.
 */
router.post('/', upload.any(), async (req, res) => {
  try {
    const files = req.files || [];
    if (!files.length) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    console.log(`[Analyze] Processing ${files.length} specimen image(s)`);

    // Forward image(s) to Python ML server
    const FormData = (await import('form-data')).default;
    const formData = new FormData();
    for (const f of files) {
      formData.append('images', f.buffer, {
        filename: f.originalname,
        contentType: f.mimetype,
      });
    }

    if (req.body.carat) {
      formData.append('carat', req.body.carat);
    }

    const mlResponse = await axios.post(`${ML_SERVER}/predict`, formData, {
      headers: formData.getHeaders(),
      timeout: 60000,
      maxContentLength: 50 * 1024 * 1024,
    });

    const result = mlResponse.data;

    // Save analysis to Supabase (if connected)
    let analysisId = null;
    if (supabase) {
      try {
        const sessionId = req.headers['x-session-id'] || randomUUID();

        // Try to look up gemstone_id by name
        let gemstoneId = null;
        try {
          const { data: gemData } = await supabase
            .from('gemstones')
            .select('id')
            .eq('name', result.gemstone)
            .single();
          
          if (gemData) {
            gemstoneId = gemData.id;
          }
        } catch (e) {
          console.warn('[Supabase] Could not find gemstone_id for', result.gemstone);
        }

        const { data, error } = await supabase
          .from('analyses')
          .insert({
            session_id: sessionId,
            gemstone_id: gemstoneId,
            predicted_name: result.gemstone,
            confidence: result.confidence,
            top_predictions: result.topPredictions,
            quality_grade: result.qualityGrade,
            quality_score: result.qualityScore,
            price_min_usd: result.priceRange.minUsd,
            price_max_usd: result.priceRange.maxUsd,
            price_suggested_usd: result.priceRange.suggestedUsd,
            price_min_lkr: result.priceRange.minLkr,
            price_max_lkr: result.priceRange.maxLkr,
            price_suggested_lkr: result.priceRange.suggestedLkr,
            analysis_details: {
              qualityDetails: result.qualityDetails,
              marketTrend: result.priceRange.marketTrend,
            },
          })
          .select('id')
          .single();

        if (error) {
          console.warn('[Supabase] Failed to save analysis:', error.message);
        } else {
          analysisId = data?.id;
          console.log(`[Supabase] Analysis saved: ${analysisId}`);
        }
      } catch (dbErr) {
        console.warn('[Supabase] Database error:', dbErr.message);
      }
    }

    return res.json({
      ...result,
      analysisId,
    });
  } catch (err) {
    console.error('[Analyze] Error:', err.message);

    if (err.code === 'ECONNREFUSED') {
      return res.status(503).json({
        error: 'ML server is not running. Start the Python server: cd ml-server && python app.py',
      });
    }

    const status = err.response?.status || 500;
    return res.status(status).json({
      error: err.response?.data?.error || 'Analysis failed. Please try again.',
      ...(err.response?.data || {})
    });
  }
});

/**
 * GET /api/analyze/history
 * Fetch analysis history from Supabase.
 */
router.get('/history', async (_req, res) => {
  if (!supabase) {
    return res.json({ analyses: [], message: 'Database not connected' });
  }

  try {
    const { data, error } = await supabase
      .from('analyses')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;
    return res.json({ analyses: data });
  } catch (err) {
    console.error('[History] Error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch history' });
  }
});

/**
 * GET /api/analyze/:id
 * Fetch a single analysis by ID.
 */
router.get('/:id', async (req, res) => {
  if (!supabase) {
    return res.status(404).json({ error: 'Database not connected' });
  }

  try {
    const { data, error } = await supabase
      .from('analyses')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Analysis not found' });

    return res.json(data);
  } catch (err) {
    console.error('[Analysis] Error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch analysis' });
  }
});

export default router;
