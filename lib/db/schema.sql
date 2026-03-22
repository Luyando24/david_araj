-- David Araj Portfolio - Idempotent Database Schema

-- Helper to drop policies safely before recreating them
DO $$ 
BEGIN
    -- Player Details
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'player_details') THEN
        DROP POLICY IF EXISTS "Allow public read player_details" ON player_details;
        DROP POLICY IF EXISTS "Service Role Full Access" ON player_details;
    END IF;

    -- Career Highlights
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'career_highlights') THEN
        DROP POLICY IF EXISTS "Allow public read highlights" ON career_highlights;
        DROP POLICY IF EXISTS "Service Role Full Access" ON career_highlights;
    END IF;

    -- Player Stats
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'player_stats') THEN
        DROP POLICY IF EXISTS "Allow public read stats" ON player_stats;
        DROP POLICY IF EXISTS "Service Role Full Access" ON player_stats;
    END IF;

    -- Testimonials
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'testimonials') THEN
        DROP POLICY IF EXISTS "Allow public read testimonials" ON testimonials;
        DROP POLICY IF EXISTS "Service Role Full Access" ON testimonials;
    END IF;

    -- Contact Submissions
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'contact_submissions') THEN
        DROP POLICY IF EXISTS "Allow public insert contacts" ON contact_submissions;
        DROP POLICY IF EXISTS "Allow admins read submissions" ON contact_submissions;
        DROP POLICY IF EXISTS "Allow admins delete submissions" ON contact_submissions;
        DROP POLICY IF EXISTS "Service Role Full Access" ON contact_submissions;
    END IF;

    -- Gallery Photos
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'gallery_photos') THEN
        DROP POLICY IF EXISTS "Allow public read photos" ON gallery_photos;
        DROP POLICY IF EXISTS "Service Role Full Access" ON gallery_photos;
    END IF;

    -- Gallery Videos
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'gallery_videos') THEN
        DROP POLICY IF EXISTS "Allow public read videos" ON gallery_videos;
        DROP POLICY IF EXISTS "Service Role Full Access" ON gallery_videos;
    END IF;

    -- Admins
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'admins') THEN
        DROP POLICY IF EXISTS "Allow auth select admins" ON admins;
        DROP POLICY IF EXISTS "Service Role Full Access" ON admins;
    END IF;
END $$;

-- 1. Create Tables IF NOT EXISTS
CREATE TABLE IF NOT EXISTS player_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  age INTEGER,
  height TEXT,
  weight TEXT,
  nationality TEXT[],
  position TEXT,
  footedness TEXT,
  location TEXT,
  tagline TEXT,
  email TEXT,
  phone TEXT,
  whatsapp TEXT,
  instagram TEXT,
  youtube TEXT,
  training_volume TEXT,
  gpa TEXT,
  attendance TEXT,
  family_environment TEXT,
  summary TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS career_highlights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  details TEXT[],
  icon TEXT,
  year TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS player_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  category TEXT NOT NULL, -- technical, cognitive, physical
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT,
  content TEXT NOT NULL,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'new'
);

CREATE TABLE IF NOT EXISTS gallery_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  label TEXT,
  category TEXT DEFAULT 'Match Action',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gallery_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  thumbnail TEXT,
  category TEXT DEFAULT 'Match Highlights',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable RLS on all tables
ALTER TABLE player_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- 3. REDEFINE POLICIES
-- PUBLIC READ POLICIES
CREATE POLICY "Allow public read player_details" ON player_details FOR SELECT USING (true);
CREATE POLICY "Allow public read highlights" ON career_highlights FOR SELECT USING (true);
CREATE POLICY "Allow public read stats" ON player_stats FOR SELECT USING (true);
CREATE POLICY "Allow public read testimonials" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Allow public read photos" ON gallery_photos FOR SELECT USING (true);
CREATE POLICY "Allow public read videos" ON gallery_videos FOR SELECT USING (true);

-- PUBLIC INSERT FOR CONTACTS
CREATE POLICY "Allow public insert contacts" ON contact_submissions FOR INSERT WITH CHECK (true);

-- ADMIN AUTHENTICATED POLICIES (Supabase Auth)
CREATE POLICY "Allow admins read submissions" ON contact_submissions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow admins delete submissions" ON contact_submissions FOR DELETE TO authenticated USING (true);
CREATE POLICY "Allow auth select admins" ON admins FOR SELECT TO authenticated USING (true);

-- FULL ACCESS FOR ALL TABLES (SERVICE ROLE)
CREATE POLICY "Service Role Full Access" ON player_details FOR ALL TO service_role USING (true);
CREATE POLICY "Service Role Full Access" ON career_highlights FOR ALL TO service_role USING (true);
CREATE POLICY "Service Role Full Access" ON player_stats FOR ALL TO service_role USING (true);
CREATE POLICY "Service Role Full Access" ON testimonials FOR ALL TO service_role USING (true);
CREATE POLICY "Service Role Full Access" ON contact_submissions FOR ALL TO service_role USING (true);
CREATE POLICY "Service Role Full Access" ON gallery_photos FOR ALL TO service_role USING (true);
CREATE POLICY "Service Role Full Access" ON gallery_videos FOR ALL TO service_role USING (true);
CREATE POLICY "Service Role Full Access" ON admins FOR ALL TO service_role USING (true);

-- 4. UTILITY FUNCTIONS
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Safely recreate trigger
DROP TRIGGER IF EXISTS update_player_details_updated_at ON player_details;
CREATE TRIGGER update_player_details_updated_at BEFORE UPDATE ON player_details FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
