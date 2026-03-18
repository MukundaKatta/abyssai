-- AbyssAI Database Schema for Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Conversations table
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  thinking TEXT,
  reasoning_tree JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_created ON messages(created_at);

-- Benchmark entries table
CREATE TABLE benchmark_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  model_name TEXT NOT NULL,
  provider TEXT NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('OpenLLM', 'ChatbotArena', 'LMSYS', 'Custom')),
  metrics JSONB NOT NULL DEFAULT '{}',
  elo_rating INTEGER,
  rank INTEGER,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_benchmarks_model ON benchmark_entries(model_name);
CREATE INDEX idx_benchmarks_source ON benchmark_entries(source);

-- Research papers table
CREATE TABLE papers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  authors TEXT[] NOT NULL,
  abstract TEXT NOT NULL,
  summary TEXT DEFAULT '',
  url TEXT NOT NULL UNIQUE,
  source TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  published_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_papers_published ON papers(published_at DESC);
CREATE INDEX idx_papers_tags ON papers USING GIN(tags);

-- Model downloads table
CREATE TABLE downloads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  model_name TEXT NOT NULL,
  repo_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  sha256 TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'downloading', 'verifying', 'complete', 'failed')),
  progress REAL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Distillation runs table
CREATE TABLE distillation_runs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_model TEXT NOT NULL,
  student_model TEXT NOT NULL,
  dataset TEXT NOT NULL,
  config JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'idle' CHECK (status IN ('idle', 'running', 'complete', 'failed')),
  progress REAL DEFAULT 0,
  logs TEXT[] DEFAULT '{}',
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE benchmark_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE distillation_runs ENABLE ROW LEVEL SECURITY;

-- Public read access policies (adjust for auth as needed)
CREATE POLICY "Public read access" ON conversations FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON conversations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read access" ON messages FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read access" ON benchmark_entries FOR SELECT USING (true);
CREATE POLICY "Public read access" ON papers FOR SELECT USING (true);
CREATE POLICY "Public read access" ON downloads FOR SELECT USING (true);
CREATE POLICY "Public all access" ON distillation_runs FOR ALL USING (true);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER benchmarks_updated_at
  BEFORE UPDATE ON benchmark_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
