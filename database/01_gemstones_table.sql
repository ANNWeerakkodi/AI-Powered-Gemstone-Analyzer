-- ============================================
-- CycloneGems AI - Gemstones Reference Table
-- ============================================
-- Run this FIRST in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS gemstones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  scientific_name TEXT,
  description TEXT,
  hardness_mohs DECIMAL(3,1),
  typical_colors TEXT[],
  origin_regions TEXT[],
  base_price_usd_min DECIMAL(10,2),
  base_price_usd_max DECIMAL(10,2),
  rarity_score INTEGER CHECK (rarity_score BETWEEN 1 AND 10),
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add an index on name for fast lookups
CREATE INDEX IF NOT EXISTS idx_gemstones_name ON gemstones(name);

-- Auto-update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_gemstones_updated_at
  BEFORE UPDATE ON gemstones
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
