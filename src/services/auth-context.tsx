import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { AuthSession, AuthSnapshot, AuthUser } from '../types';
import {
  getAuthSnapshot,
  loginUser,
  logoutUser,
  refreshSession,
  registerUser,
} from './auth-store';

export type AuthModalMode = 'login' | 'register' | 'status';

interface AuthContextValue {
  snapshot: AuthSnapshot;
  refresh: () => void;
  login: (email: string, password: string) => Promise<{ user: AuthUser; session: AuthSession }>;
  register: (name: string, email: string, password: string) => Promise<{ user: AuthUser; session: AuthSession }>;
  logout: () => void;
  refreshTokens: () => AuthSession;
  authorize: (label: string) => boolean;
  modalMode: AuthModalMode | null;
  openAuth: (mode: AuthModalMode) => void;
  closeAuth: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [snapshot, setSnapshot] = useState<AuthSnapshot>(() => getAuthSnapshot());
  const [modalMode, setModalMode] = useState<AuthModalMode | null>(null);

  const refresh = useCallback(() => setSnapshot(getAuthSnapshot()), []);

  const login = useCallback(
    async (email: string, password: string) => {
      const result = await loginUser({ email, password });
      refresh();
      return result;
    },
    [refresh],
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const result = await registerUser({ name, email, password });
      refresh();
      return result;
    },
    [refresh],
  );

  const logout = useCallback(() => {
    logoutUser();
    refresh();
  }, [refresh]);

  const refreshTokens = useCallback(() => {
    const session = refreshSession();
    refresh();
    return session;
  }, [refresh]);

  const openAuth = useCallback((mode: AuthModalMode) => setModalMode(mode), []);
  const closeAuth = useCallback(() => setModalMode(null), []);

  const authorize = useCallback(
    (label: string) => {
      const current = getAuthSnapshot();
      if (!current.isAuthenticated) {
        setModalMode('login');
        return false;
      }
      if (!current.accessValid) {
        refreshTokens();
      }
      return true;
    },
    [refreshTokens],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      snapshot,
      refresh,
      login,
      register,
      logout,
      refreshTokens,
      authorize,
      modalMode,
      openAuth,
      closeAuth,
    }),
    [snapshot, refresh, login, register, logout, refreshTokens, authorize, modalMode, openAuth, closeAuth],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
