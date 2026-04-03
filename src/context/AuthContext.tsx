import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: Record<UserRole, User> = {
  admin: { id: '1', name: 'Dr. James Mwangi', email: 'admin@uniflow.ac.ke', role: 'admin', department: 'DET' },
  cod: { id: '2', name: 'Prof. Grace Odhiambo', email: 'cod@uniflow.ac.ke', role: 'cod', department: 'Engineering' },
  lecturer: { id: '3', name: 'Dr. Sarah Kimani', email: 'lecturer@uniflow.ac.ke', role: 'lecturer', department: 'Mathematics' },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, _password: string, role: UserRole) => {
    // Mock login - replace with actual API call: POST /api/auth/login
    setUser({ ...mockUsers[role], email });
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
