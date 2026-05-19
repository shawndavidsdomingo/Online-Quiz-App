-- ============================================================
-- M3 PR-04 | db/rls-verification
-- Supabase Project: https://cloddjuzekgaftigltrt.supabase.co
-- Run each section in: Supabase Dashboard → SQL Editor
-- ============================================================

-- ─── SECTION 1: Confirm RLS is enabled on both tables ────────
SELECT
  schemaname,
  tablename,
  rowsecurity AS rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'score_history');

-- Expected output:
-- schemaname | tablename     | rls_enabled
-- -----------+---------------+------------
-- public     | profiles      | true
-- public     | score_history | true

-- ─── SECTION 2: List all RLS policies ────────────────────────
SELECT
  tablename,
  policyname,
  cmd        AS operation,
  qual       AS using_expression,
  with_check AS with_check_expression
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'score_history')
ORDER BY tablename, cmd;

-- Expected policies for profiles:
--   Users can select own profile     → SELECT  → auth.uid() = id
--   Users can insert own profile     → INSERT  → auth.uid() = id
--   Users can update own profile     → UPDATE  → auth.uid() = id

-- Expected policies for score_history:
--   Users can select own score history → SELECT → auth.uid() = user_id
--   Users can insert own score history → INSERT → auth.uid() = user_id

-- ─── SECTION 3: Confirm trigger exists ───────────────────────
SELECT
  trigger_name,
  event_manipulation,
  event_object_table,
  action_timing
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- Expected:
-- trigger_name          | event | table | timing
-- ----------------------+-------+-------+-------
-- on_auth_user_created  | INSERT| users | AFTER

-- ─── SECTION 4: Inspect profiles rows (service role only) ────
-- Run this in SQL Editor (uses service role, bypasses RLS)
SELECT
  id,
  email,
  nickname,
  nickname_updated_at,
  created_at
FROM public.profiles
ORDER BY created_at DESC
LIMIT 10;

-- Expected: one row per signed-up user, nickname = '' for new users

-- ─── SECTION 5: Inspect score_history rows (service role) ────
SELECT
  id,
  user_id,
  score,
  total,
  category,
  difficulty,
  completed_at
FROM public.score_history
ORDER BY completed_at DESC
LIMIT 10;

-- ─── SECTION 6: Cross-user RLS block test ────────────────────
-- Simulates what happens when User B tries to read User A's data.
-- The SQL Editor runs as service role (bypasses RLS by default).
-- To test RLS as an authenticated user, use set_config:

-- Step 1: Get a real user UUID from the profiles table above.
-- Step 2: Replace 'USER_A_UUID_HERE' with that UUID.
-- Step 3: Replace 'USER_B_UUID_HERE' with a DIFFERENT user UUID.

-- Simulate being User B trying to read User A's profile:
SET LOCAL role TO authenticated;
SET LOCAL request.jwt.claims TO '{"sub": "USER_B_UUID_HERE", "role": "authenticated"}';

SELECT * FROM public.profiles
WHERE id = 'USER_A_UUID_HERE';
-- Expected: 0 rows returned (RLS blocks cross-user read)

SELECT * FROM public.score_history
WHERE user_id = 'USER_A_UUID_HERE';
-- Expected: 0 rows returned (RLS blocks cross-user read)

-- Reset role
RESET role;
RESET request.jwt.claims;

-- ─── SECTION 7: Own-data access test ─────────────────────────
-- Simulate User A reading their OWN data (should succeed):
SET LOCAL role TO authenticated;
SET LOCAL request.jwt.claims TO '{"sub": "USER_A_UUID_HERE", "role": "authenticated"}';

SELECT * FROM public.profiles
WHERE id = 'USER_A_UUID_HERE';
-- Expected: 1 row returned ✅

SELECT * FROM public.score_history
WHERE user_id = 'USER_A_UUID_HERE';
-- Expected: User A's rows only ✅

RESET role;
RESET request.jwt.claims;