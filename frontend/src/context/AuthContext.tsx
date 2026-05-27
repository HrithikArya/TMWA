import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import type { User } from '../types/auth.types';
import { registerLogout } from '../utils/logoutBridge';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api';

const isTokenExpired = (token: string): boolean => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    const payload = JSON.parse(atob(parts[1])) as { exp?: number };
    return typeof payload.exp === 'number' && payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('tf_user');
      return stored ? (JSON.parse(stored) as User) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    const stored = localStorage.getItem('tf_token');
    if (stored && !isTokenExpired(stored)) return stored;
    localStorage.removeItem('tf_token');
    localStorage.removeItem('tf_user');
    return null;
  });

  useEffect(() => {
    if (token && isTokenExpired(token)) {
      localStorage.removeItem('tf_token');
      localStorage.removeItem('tf_user');
      setToken(null);
      setUser(null);
    }
  }, [token]);

  const persist = (newToken: string, newUser: User) => {
    localStorage.setItem('tf_token', newToken);
    localStorage.setItem('tf_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const json = (await res.json()) as {
      success: boolean;
      message: string;
      data?: { token: string; user: User };
    };
    if (!res.ok || !json.success || !json.data) {
      throw new Error(json.message ?? 'Login failed');
    }
    persist(json.data.token, json.data.user);
  }, []);

  const signup = useCallback(
    async (name: string, email: string, password: string): Promise<void> => {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const json = (await res.json()) as {
        success: boolean;
        message: string;
        data?: { token: string; user: User };
      };
      if (!res.ok || !json.success || !json.data) {
        throw new Error(json.message ?? 'Signup failed');
      }
      persist(json.data.token, json.data.user);
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem('tf_token');
    localStorage.removeItem('tf_user');
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    registerLogout(logout);
  }, [logout]);

  const value = useMemo(
    () => ({
      user,
      token,
      login,
      signup,
      logout,
      isAuthenticated: !!token && !!user,
      isAdmin: user?.role === 'admin',
    }),
    [user, token, login, signup, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
