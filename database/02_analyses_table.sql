-- ============================================
-- CycloneGems AI - Analyses Table
-- ============================================
-- Run this SECOND (depends on gemstones table)

CREATE TABLE IF NOT EXISTS analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  image_url TEXT,
  gemstone_id UUID REFERENCES gemstones(id) ON DELETE SET NULL,
  predicted_name TEXT NOT NULL,
  confidence DECIMAL(5,4) NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  top_predictions JSONB DEFAULT '[]'::jsonb,
  quality_grade TEXT NOT NULL CHECK (quality_grade IN ('AAA', 'AA', 'A', 'B', 'C')),
  quality_score DECIMAL(5,2) CHECK (quality_score >= 0 AND quality_score <= 100),
  price_min_usd DECIMAL(10,2),
  price_max_usd DECIMAL(10,2),
  price_suggested_usd DECIMAL(10,2),
  price_min_lkr DECIMAL(12,2),
  price_max_lkr DECIMAL(12,2),
  price_suggested_lkr DECIMAL(12,2),
  analysis_details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_analyses_session ON analyses(session_id);
CREATE INDEX IF NOT EXISTS idx_analyses_predicted_name ON analyses(predicted_name);
CREATE INDEX IF NOT EXISTS idx_analyses_created_at ON analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analyses_quality_grade ON analyses(quality_grade);
