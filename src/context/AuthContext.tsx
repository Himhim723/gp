'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';

interface Customer {
  customerId: number;
  name: string;
  email: string;
  telephone: string;
  customerType: string;
  companyName: string | null;
  emailVerified: boolean;
  role: string;
}

interface AuthContextType {
  customer: Customer | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const res = await api.get('/auth/me');
      setCustomer(res.data);
    } catch {
      setCustomer(null);
      setToken(null);
      localStorage.removeItem('token');
    }
  }, []);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      refreshUser().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: newToken, customer: newCustomer } = res.data;
    localStorage.setItem('token', newToken);
    localStorage.setItem('customer', JSON.stringify(newCustomer));
    setToken(newToken);
    setCustomer(newCustomer);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('customer');
    setToken(null);
    setCustomer(null);
  };

  return (
    <AuthContext.Provider
      value={{
        customer,
        token,
        isAuthenticated: !!customer,
        isAdmin: customer?.role === 'ADMIN',
        loading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
