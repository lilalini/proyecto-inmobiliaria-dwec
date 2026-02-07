// src/components/admin/AuthProvider.tsx
import React, { useState, useEffect, useCallback, } from 'react';
import type { ReactNode } from 'react';
import { AuthContext } from '../../utils/AuthContext';
import type { User } from '../../utils/types';
import api from '../../services/api';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const login = useCallback(async (token: string) => {
    try {
      localStorage.setItem('authToken', token);
      const response = await api.get('/auth/verify', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setUser(response.data.data.user);
        setIsAuthenticated(true);
      } else {
        logout();
      }
    } catch {
      logout();
    }
  }, [logout]);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        await login(token);
      }
    };
    void initializeAuth();
  }, [login]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
