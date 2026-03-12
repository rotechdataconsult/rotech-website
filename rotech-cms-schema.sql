-- ═══════════════════════════════════════════════════════════════════════════════
-- Rotech Data Consult — Landing Page CMS Schema
-- Run this in your Supabase SQL editor (Dashboard → SQL Editor → New query)
-- ═══════════════════════════════════════════════════════════════════════════════

-- Hero section (single row)
CREATE TABLE IF NOT EXISTS lp_hero (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  badge_text         text DEFAULT 'Africa''s Data Analytics Academy',
  headline           text DEFAULT 'Monitor. Analyse. Thrive.',
  subheadline        text DEFAULT 'Empowering individuals, teams, and businesses with the skills, tools, and insights to compete in a data-driven economy — built for Africa.',
  cta_primary_label  text DEFAULT 'Start Learning Free',
  cta_primary_href   text DEFAULT '/auth/register',
  cta_secondary_label text DEFAULT 'Business Solutions →',
  cta_secondary_href  text DEFAULT '#business',
  updated_at         timestamptz DEFAULT now()
);

-- Impact metrics (4 stat cards)
CREATE TABLE IF NOT EXISTS lp_impact_metrics (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  value      text        NOT NULL,
  label      text        NOT NULL,
  icon       text        DEFAULT '📊',
  sort_order integer     DEFAULT 0
);

-- Learning programs
CREATE TABLE IF NOT EXISTS lp_programs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text        NOT NULL,
  description text,
  icon        text        DEFAULT '📊',
  icon_bg     text        DEFAULT '#DCFCE7',
  icon_color  text        DEFAULT '#16A34A',
  level       text        DEFAULT 'Beginner',
  duration    text        DEFAULT '4 weeks',
  lessons     text        DEFAULT '12 lessons',
  skills      text[]      DEFAULT '{}',
  cta_href    text        DEFAULT '/auth/register',
  is_active   boolean     DEFAULT true,
  sort_order  integer     DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);

-- Testimonials
CREATE TABLE IF NOT EXISTS lp_testimonials (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote            text        NOT NULL,
  author_name      text        NOT NULL,
  author_role      text,
  author_location  text,
  author_initials  text,
  avatar_color     text        DEFAULT '#6C3FD4',
  photo_url        text,
  rating           integer     DEFAULT 5,
  is_active        boolean     DEFAULT true,
  sort_order       integer     DEFAULT 0,
  created_at       timestamptz DEFAULT now()
);

-- Team members
CREATE TABLE IF NOT EXISTS lp_team (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text        NOT NULL,
  role         text,
  bio          text,
  photo_url    text,
  initials     text,
  avatar_color text        DEFAULT '#6C3FD4',
  linkedin_url text,
  is_active    boolean     DEFAULT true,
  sort_order   integer     DEFAULT 0
);

-- ── Row Level Security ────────────────────────────────────────────────────────
-- Allow public (anon) to SELECT all CMS tables (landing page reads them)
-- Allow only authenticated admins to INSERT/UPDATE/DELETE

ALTER TABLE lp_hero            ENABLE ROW LEVEL SECURITY;
ALTER TABLE lp_impact_metrics  ENABLE ROW LEVEL SECURITY;
ALTER TABLE lp_programs        ENABLE ROW LEVEL SECURITY;
ALTER TABLE lp_testimonials    ENABLE ROW LEVEL SECURITY;
ALTER TABLE lp_team            ENABLE ROW LEVEL SECURITY;

-- Public SELECT (needed for landing page server-side fetch with anon key)
CREATE POLICY "public_select_hero"         ON lp_hero            FOR SELECT USING (true);
CREATE POLICY "public_select_impact"       ON lp_impact_metrics  FOR SELECT USING (true);
CREATE POLICY "public_select_programs"     ON lp_programs        FOR SELECT USING (true);
CREATE POLICY "public_select_testimonials" ON lp_testimonials    FOR SELECT USING (true);
CREATE POLICY "public_select_team"         ON lp_team            FOR SELECT USING (true);

-- Authenticated users can write (admin pages check role in app logic)
CREATE POLICY "auth_write_hero"         ON lp_hero            FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_write_impact"       ON lp_impact_metrics  FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_write_programs"     ON lp_programs        FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_write_testimonials" ON lp_testimonials    FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_write_team"         ON lp_team            FOR ALL USING (auth.role() = 'authenticated');

-- ── Seed Default Data ─────────────────────────────────────────────────────────
-- Run AFTER creating tables. Skip if you want to start with empty CMS.

INSERT INTO lp_impact_metrics (value, label, icon, sort_order) VALUES
  ('500+', 'Students Trained',     '🎓', 0),
  ('50+',  'Businesses Supported', '🏢', 1),
  ('10+',  'Courses Available',    '📚', 2),
  ('5',    'Countries Reached',    '🌍', 3)
ON CONFLICT DO NOTHING;
