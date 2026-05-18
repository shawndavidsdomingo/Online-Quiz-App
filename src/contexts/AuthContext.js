import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

// AuthContext — provides session state to entire app
// Full implementation: M4 PR-01 (feat/auth-context)
// For now: session is null (not logged in) → shows AuthStack

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session on app launch
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setLoading(false);
      });

      // Listen for login / logout events
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setSession(session);
        }
      );

      return () => subscription.unsubscribe();
    } else {
      // supabase not yet configured — stay on login screen
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}