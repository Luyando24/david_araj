-- Player Info Table (Single row)
CREATE TABLE player_details (
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

-- Career Highlights Table
CREATE TABLE career_highlights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  details TEXT[],
  icon TEXT,
  year TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Player Stats Table
CREATE TABLE player_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  category TEXT NOT NULL, -- technical, cognitive, physical
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Testimonials Table
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL,
  coach TEXT NOT NULL,
  title TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE player_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Allow public read
CREATE POLICY "Allow public read player_details" ON player_details FOR SELECT TO anon USING (true);
CREATE POLICY "Allow public read career_highlights" ON career_highlights FOR SELECT TO anon USING (true);
CREATE POLICY "Allow public read player_stats" ON player_stats FOR SELECT TO anon USING (true);
CREATE POLICY "Allow public read testimonials" ON testimonials FOR SELECT TO anon USING (true);

-- Allow authenticated CRUD (for admin)
CREATE POLICY "Allow admin CRUD player_details" ON player_details FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow admin CRUD career_highlights" ON career_highlights FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow admin CRUD player_stats" ON player_stats FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow admin CRUD testimonials" ON testimonials FOR ALL TO authenticated USING (true);
