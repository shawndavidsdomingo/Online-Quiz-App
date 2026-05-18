import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Values come from app.json → expo.extra, populated from .env
// NEVER hardcode these values — always use .env
const SUPABASE_URL = Constants.expoConfig?.extra?.supabaseUrl;
const SUPABASE_ANON_KEY = Constants.expoConfig?.extra?.supabaseAnonKey;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    'supabase.js: Missing SUPABASE_URL or SUPABASE_ANON_KEY.\n' +
    'Copy .env.example → .env and fill in your Supabase project values.'
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);