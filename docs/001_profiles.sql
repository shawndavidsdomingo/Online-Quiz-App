-- ============================================================
-- M3 PR-01 | db/profiles-table
-- Supabase Project: https://cloddjuzekgaftigltrt.supabase.co
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ─── 1. CREATE TABLE ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id                   UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email                TEXT        NOT NULL,
  nickname             TEXT        NOT NULL DEFAULT '',
  nickname_updated_at  TIMESTAMPTZ,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── 2. ENABLE ROW LEVEL SECURITY ────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ─── 3. RLS POLICIES ─────────────────────────────────────────

-- SELECT: users can only read their own row
CREATE POLICY "Users can select own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- INSERT: users can only insert their own row
CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- UPDATE: users can only update their own row
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ─── 4. AUTO-CREATE PROFILE ON SIGN UP ───────────────────────
-- Trigger: when a new user signs in via Google OAuth,
-- automatically insert a row into profiles.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nickname, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    '',
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger first to avoid duplicate errors on re-run
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ─── 5. VERIFY ───────────────────────────────────────────────
-- Run this to confirm everything was created:
-- SELECT * FROM public.profiles LIMIT 5;
-- SELECT * FROM pg_policies WHERE tablename = 'profiles';