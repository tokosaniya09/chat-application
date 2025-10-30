
"use client";

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import api from '../lib/api';
import { jwtDecode } from 'jwt-decode';

interface User {
  _id: string;
  email: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const setAuthToken = (token: string | null) => {
    if (token) {
      document.cookie = `token=${token}; path=/; max-age=2592000; SameSite=Lax`; // 30 days
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
      delete api.defaults.headers.common['Authorization'];
    }
  };

  const loadUser = useCallback(async () => {
    const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
            logout();
            return;
        }
        setAuthToken(token);
        const res = await api.get('/auth/me');
        setUser(res.data);
      } catch (err) {
        setUser(null);
        setAuthToken(null);
      }
    }
    setLoading(false);
  }, []);


  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    const { token } = res.data;
    setAuthToken(token);
    await loadUser();
  };
  
  const signup = async (email: string, username: string, password: string) => {
    const res = await api.post('/auth/register', { email, username, password });
    const { token } = res.data;
    setAuthToken(token);
    await loadUser();
  };

  const logout = () => {
    setUser(null);
    setAuthToken(null);
    router.push('/login');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    signup,
    logout,
  };

  if(loading) return <div className="flex h-screen items-center justify-center">Loading application...</div>;

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
