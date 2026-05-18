import { createContext, useContext } from 'react';

// TODO: M4 PR-01 (feat/auth-context)
// Provides: currentUser, profile, session, signOut()

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  return (
    <AuthContext.Provider value={{}}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
