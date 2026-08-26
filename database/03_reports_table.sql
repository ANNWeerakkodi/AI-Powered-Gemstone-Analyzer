-- ============================================
-- CycloneGems AI - Reports Table
-- ============================================
-- Run this THIRD (depends on analyses table)

CREATE TABLE IF NOT EXISTS reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  analysis_id UUID NOT NULL REFERENCES analyses(id) ON DELETE CASCADE,
  report_type TEXT DEFAULT 'standard' CHECK (report_type IN ('standard', 'detailed', 'certificate')),
  report_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookups by analysis
CREATE INDEX IF NOT EXISTS idx_reports_analysis_id ON reports(analysis_id);
