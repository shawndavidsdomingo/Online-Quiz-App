import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession]         = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile]         = useState(null);
  const [authReady, setAuthReady]     = useState(false);

  const loading = !authReady;

  async function fetchProfile(userId) {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('nickname, nickname_updated_at, email')
        .eq('id', userId)
        .maybeSingle();
      setProfile(data ?? { nickname: '', nickname_updated_at: null, email: '' });
    } catch {
      setProfile({ nickname: '', nickname_updated_at: null, email: '' });
    }
  }

  async function ensureAndFetchProfile(user) {
    try {
      await supabase.from('profiles').upsert(
        { id: user.id, email: user.email, nickname: '', nickname_updated_at: null },
        { onConflict: 'id', ignoreDuplicates: true }
      );
    } catch (err) {
      console.warn('ensureProfile warning:', err.message);
    }
    // Always fetch even if upsert had an issue — row likely already exists
    await fetchProfile(user.id);
  }

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        console.log('auth:', _event, !!newSession);

        const user = newSession?.user ?? null;
        setSession(newSession ?? null);
        setCurrentUser(user);

        if (!user) setProfile(null);

        // ✅ Unblock loading IMMEDIATELY — don't await profile fetch.
        // Clock skew or slow network on profile calls must never hang the app.
        setAuthReady(true);

        // Fire-and-forget profile fetch after state is settled
        if (user) ensureAndFetchProfile(user);
      }
    );

    // Hard fallback — in case onAuthStateChange never fires
    const fallback = setTimeout(() => setAuthReady(true), 6000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(fallback);
    };
  }, []);

  async function signOut() {
    // Clear state first so UI transitions immediately
    setSession(null);
    setCurrentUser(null);
    setProfile(null);
    await supabase.auth.signOut();
  }

  async function refreshProfile() {
    if (currentUser) await fetchProfile(currentUser.id);
  }

  return (
    <AuthContext.Provider value={{ session, currentUser, profile, loading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}