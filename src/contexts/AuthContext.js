import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

// ─── AuthContext ───────────────────────────────────────────────
// Provides to entire app:
//   session       — Supabase auth session (null = not logged in)
//   currentUser   — Supabase auth user object (null = not logged in)
//   profile       — { nickname, nickname_updated_at } from profiles table
//   loading       — true while restoring session on app launch
//   signOut()     — signs out and clears all state

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession]           = useState(null);
  const [currentUser, setCurrentUser]   = useState(null);
  const [profile, setProfile]           = useState(null);
  const [loading, setLoading]           = useState(true);

  // ─── Fetch profile from Supabase ──────────────────────────
  async function fetchProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('nickname, nickname_updated_at')
        .eq('id', userId)
        .single();

      if (error) {
        console.warn('AuthContext.fetchProfile error:', error.message);
        setProfile(null);
      } else {
        setProfile(data);
      }
    } catch (err) {
      console.warn('AuthContext.fetchProfile unexpected error:', err);
      setProfile(null);
    }
  }

  // ─── Session listener ─────────────────────────────────────
  useEffect(() => {
    if (!supabase) {
      // Supabase not yet configured (.env missing)
      setLoading(false);
      return;
    }

    // 1. Restore existing session on app launch
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setCurrentUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      setLoading(false);
    });

    // 2. Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setCurrentUser(session?.user ?? null);

        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          // Logged out — clear profile
          setProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // ─── Sign out ─────────────────────────────────────────────
  async function signOut() {
    try {
      await supabase.auth.signOut();
      setSession(null);
      setCurrentUser(null);
      setProfile(null);
    } catch (err) {
      console.warn('AuthContext.signOut error:', err);
    }
  }

  // ─── Refresh profile ──────────────────────────────────────
  // Call this after updating nickname so UI reflects change immediately
  async function refreshProfile() {
    if (currentUser) await fetchProfile(currentUser.id);
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        currentUser,
        profile,
        loading,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}