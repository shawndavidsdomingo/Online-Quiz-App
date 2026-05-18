-- ============================================================
-- M3 PR-02 | db/score-history-table
-- Supabase Project: https://cloddjuzekgaftigltrt.supabase.co
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ─── 1. CREATE TABLE ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.score_history (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  score         INTEGER     NOT NULL,
  total         INTEGER     NOT NULL,
  category      TEXT        NOT NULL DEFAULT 'All',
  difficulty    TEXT        NOT NULL DEFAULT 'medium',
  completed_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── 2. ENABLE ROW LEVEL SECURITY ────────────────────────────
ALTER TABLE public.score_history ENABLE ROW LEVEL SECURITY;

-- ─── 3. RLS POLICIES ─────────────────────────────────────────

-- SELECT: users can only read their own rows
CREATE POLICY "Users can select own score history"
  ON public.score_history
  FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: users can only insert their own rows
CREATE POLICY "Users can insert own score history"
  ON public.score_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ─── 4. INDEX ─────────────────────────────────────────────────
-- Speeds up fetching history sorted by date (HistoryScreen)
CREATE INDEX IF NOT EXISTS score_history_user_id_completed_at_idx
  ON public.score_history (user_id, completed_at DESC);

-- ─── 5. VERIFY ───────────────────────────────────────────────
-- SELECT * FROM public.score_history LIMIT 5;
-- SELECT * FROM pg_policies WHERE tablename = 'score_history';