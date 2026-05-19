-- ============================================================
-- M3 PR-03 | db/trigger-profile-provision
-- Supabase Project: https://cloddjuzekgaftigltrt.supabase.co
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ─── 1. DROP EXISTING (safe re-run) ──────────────────────────
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.create_profile_on_signup();

-- ─── 2. CREATE FUNCTION ───────────────────────────────────────
CREATE OR REPLACE FUNCTION public.create_profile_on_signup()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    nickname,
    nickname_updated_at,
    created_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    '',                   -- empty nickname → triggers NicknameScreen on first login
    NULL,                 -- no nickname set yet → 30-day rule won't block first change
    NOW()
  )
  ON CONFLICT (id) DO NOTHING; -- safe if row already exists

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── 3. CREATE TRIGGER ────────────────────────────────────────
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_profile_on_signup();

-- ─── 4. VERIFY ───────────────────────────────────────────────
-- Run these to confirm:
-- SELECT routine_name FROM information_schema.routines
--   WHERE routine_schema = 'public' AND routine_name = 'create_profile_on_signup';
--
-- SELECT trigger_name FROM information_schema.triggers
--   WHERE event_object_table = 'users' AND trigger_name = 'on_auth_user_created';