import { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { supabase } from '../services/supabase';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession]         = useState(undefined);
  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile]         = useState(undefined);

  const loading = session === undefined;

  async function fetchProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('nickname, nickname_updated_at')
        .eq('id', userId)
        .single();
      if (error) {
        setProfile({ nickname: '', nickname_updated_at: null });
      } else {
        setProfile(data);
      }
    } catch {
      setProfile({ nickname: '', nickname_updated_at: null });
    }
  }

  async function upsertProfile(user) {
    try {
      await supabase.from('profiles').upsert(
        { id: user.id, email: user.email },
        { onConflict: 'id', ignoreDuplicates: true }
      );
    } catch {}
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (session === undefined) setSession(null);
    }, 4000);

    // Register listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        console.log('auth event:', _event, !!newSession);
        clearTimeout(timeout);
        setSession(newSession ?? null);
        setCurrentUser(newSession?.user ?? null);

        if (newSession?.user) {
          upsertProfile(newSession.user);
          fetchProfile(newSession.user.id);
        } else {
          setProfile(null);
        }
      }
    );

    if (Platform.OS === 'web') {
      // On web: check if URL has OAuth tokens (after Google redirect)
      // If yes, let onAuthStateChange handle it via detectSessionInUrl
      // If no tokens in URL, set session null immediately
      const hash = window.location.hash || window.location.search;
      const hasTokens = hash.includes('access_token');

      if (!hasTokens) {
        clearTimeout(timeout);
        setSession(null);
      }
      // If hasTokens → Supabase detectSessionInUrl fires onAuthStateChange automatically
    } else {
      // Mobile: always start at login
      clearTimeout(timeout);
      setSession(null);
    }

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    setSession(null);
    setCurrentUser(null);
    setProfile(null);
  }

  async function refreshProfile() {
    if (currentUser) await fetchProfile(currentUser.id);
  }

  return (
    <AuthContext.Provider value={{
      session, currentUser, profile, loading, signOut, refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}