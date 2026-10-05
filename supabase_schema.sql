-- ==============================================================================
-- Aeethod OS Database Schema for Supabase
-- Run this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/lgskrbzmcuipxvgxqjur/sql/new
-- ==============================================================================

-- 1. Topics Table
CREATE TABLE IF NOT EXISTS public.topics (
  id TEXT PRIMARY KEY,
  num INTEGER NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  description TEXT DEFAULT '',
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tasks Table
CREATE TABLE IF NOT EXISTS public.tasks (
  id TEXT PRIMARY KEY,
  "topicId" TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  status TEXT NOT NULL,
  priority TEXT NOT NULL,
  assignee TEXT NOT NULL,
  "dueDate" TEXT,
  tags TEXT[] DEFAULT '{}',
  "parentId" TEXT,
  fields JSONB DEFAULT '{}',
  comments JSONB DEFAULT '[]',
  "order" NUMERIC NOT NULL,
  type TEXT,
  points NUMERIC,
  "sprintId" TEXT,
  "epicId" TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Docs Table
CREATE TABLE IF NOT EXISTS public.docs (
  id TEXT PRIMARY KEY,
  "topicId" TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT DEFAULT '',
  pinned BOOLEAN DEFAULT FALSE,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Custom Fields Table
CREATE TABLE IF NOT EXISTS public.fields (
  id TEXT PRIMARY KEY,
  "topicId" TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  "order" NUMERIC NOT NULL,
  options JSONB,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Metrics Table
CREATE TABLE IF NOT EXISTS public.metrics (
  id TEXT PRIMARY KEY,
  month TEXT NOT NULL,
  kind TEXT NOT NULL,
  mrr NUMERIC,
  customers NUMERIC,
  "newCustomers" NUMERIC,
  "churnedCustomers" NUMERIC,
  "salesMarketingSpend" NUMERIC,
  cogs NUMERIC,
  opex NUMERIC,
  cash NUMERIC,
  notes TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Sprints Table
CREATE TABLE IF NOT EXISTS public.sprints (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  goal TEXT DEFAULT '',
  "startDate" TEXT NOT NULL,
  "endDate" TEXT NOT NULL,
  status TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Epics Table
CREATE TABLE IF NOT EXISTS public.epics (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  description TEXT DEFAULT '',
  "startDate" TEXT NOT NULL,
  "endDate" TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Content Videos Table (Content Studio & Reel Planning)
CREATE TABLE IF NOT EXISTS public.content_videos (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  creator TEXT NOT NULL,
  topic TEXT NOT NULL,
  format TEXT NOT NULL,
  status TEXT NOT NULL,
  hook TEXT DEFAULT '',
  "publishDate" TEXT,
  views NUMERIC DEFAULT 0,
  likes NUMERIC DEFAULT 0,
  shares NUMERIC DEFAULT 0,
  saves NUMERIC DEFAULT 0,
  notes TEXT DEFAULT '',
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Settings Table
CREATE TABLE IF NOT EXISTS public.settings (
  id TEXT PRIMARY KEY DEFAULT 'current',
  team TEXT[] DEFAULT '{}',
  company TEXT DEFAULT 'Aeethod',
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS & Add Public Access Policies for Web Client
DO $$
DECLARE
  tbl text;
BEGIN
  FOR tbl IN SELECT unnest(ARRAY['topics', 'tasks', 'docs', 'fields', 'metrics', 'sprints', 'epics', 'content_videos', 'settings'])
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', tbl);
    EXECUTE format('DROP POLICY IF EXISTS "Public access on %s" ON public.%I;', tbl, tbl);
    EXECUTE format('CREATE POLICY "Public access on %s" ON public.%I FOR ALL USING (true) WITH CHECK (true);', tbl, tbl);
  END LOOP;
END $$;
