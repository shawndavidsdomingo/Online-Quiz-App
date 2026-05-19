import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession]         = useState(undefined);
  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile]         = useState(null);

  // loading = only while we haven't confirmed session yet
  const loading = session === undefined;

  async function fetchProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('nickname, nickname_updated_at')
        .eq('id', userId)
        .single();

      if (error) {
        // No row found or any error — treat as no nickname
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
    // Safety timeout — 4s max
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
          // Don't await — let loading resolve immediately
          // profile loads in background, App.js will re-render
          upsertProfile(newSession.user);
          fetchProfile(newSession.user.id);
        } else {
          setProfile(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession()
      .then(({ data: { session: s } }) => {
        if (!s) {
          clearTimeout(timeout);
          setSession(null);
        }
        // if s exists, onAuthStateChange will fire and handle it
      })
      .catch(() => {
        clearTimeout(timeout);
        setSession(null);
      });

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