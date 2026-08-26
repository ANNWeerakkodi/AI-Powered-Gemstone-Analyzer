-- ============================================
-- CycloneGems AI - Row Level Security Policies
-- ============================================
-- Run this SIXTH (after all tables are created)

-- Enable RLS on all tables
ALTER TABLE gemstones ENABLE ROW LEVEL SECURITY;
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- ── Gemstones Table Policies ──
-- Everyone can read gemstone reference data
CREATE POLICY "Public read access for gemstones"
  ON gemstones FOR SELECT
  USING (true);

-- Only service role can modify gemstone data
CREATE POLICY "Service role can manage gemstones"
  ON gemstones FOR ALL
  USING (auth.role() = 'service_role');

-- ── Analyses Table Policies ──
-- Everyone can read analyses (public tool)
CREATE POLICY "Public read access for analyses"
  ON analyses FOR SELECT
  USING (true);

-- Everyone can create analyses (public tool)
CREATE POLICY "Public insert access for analyses"
  ON analyses FOR INSERT
  WITH CHECK (true);

-- Only service role can update/delete analyses
CREATE POLICY "Service role can manage analyses"
  ON analyses FOR UPDATE
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can delete analyses"
  ON analyses FOR DELETE
  USING (auth.role() = 'service_role');

-- ── Reports Table Policies ──
-- Everyone can read reports
CREATE POLICY "Public read access for reports"
  ON reports FOR SELECT
  USING (true);

-- Everyone can create reports
CREATE POLICY "Public insert access for reports"
  ON reports FOR INSERT
  WITH CHECK (true);

-- Only service role can delete reports
CREATE POLICY "Service role can delete reports"
  ON reports FOR DELETE
  USING (auth.role() = 'service_role');
