-- ============================================
-- CycloneGems AI - Storage Bucket
-- ============================================
-- Run this FIFTH in your Supabase SQL Editor
-- Creates a storage bucket for uploaded gemstone images

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gemstone-images',
  'gemstone-images',
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to the bucket
CREATE POLICY "Public read access for gemstone images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'gemstone-images');

-- Allow authenticated uploads
CREATE POLICY "Allow uploads to gemstone images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'gemstone-images');
