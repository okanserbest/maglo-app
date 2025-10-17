import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getProfile, login as apiLogin, logout as apiLogout, register as apiRegister } from './api';
import type { User } from '../../types/auth';
import { token } from '../../lib/token';
import toast from 'react-hot-toast';

type AuthState = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (input: { email: string; password: string }) => Promise<void>;
  register: (input: { fullName: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const Ctx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // attempt rehydrate
        await refreshProfileInternal();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function refreshProfileInternal() {
    try {
      const profile = await getProfile();
      setUser(profile);
    } catch {
      // ignore - user not logged in
    }
  }

  const value = useMemo<AuthState>(() => ({
    user,
    loading,
    isAuthenticated: !!user,
    login: async ({ email, password }) => {
      const res = await apiLogin({ email, password });
      token.set(res.data.accessToken);
      await refreshProfileInternal();
      toast.success('Login successful');
    },
    register: async (payload) => {
      await apiRegister(payload);
      toast.success('User registered successfully');
    },
    logout: async () => {
      try {
        await apiLogout(); // server should clear HttpOnly refresh cookie here
      } finally {
        // Always clear local state even if the network call fails
        token.clear();
        setUser(null);
      }
      toast.success('Logged out');
    },
    refreshProfile: refreshProfileInternal,
  }), [user, loading]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
