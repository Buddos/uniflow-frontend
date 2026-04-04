import { createContext, useContext, useState, ReactNode } from 'react';
import type { User, UserRole } from '@/types';
import { loginUser, registerUser } from '@/services/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const data = await loginUser(email, password);
      if (data.success && data.user) {
        setUser({
          ...data.user,
          role: data.user.role.toLowerCase() as UserRole
        });
        return true;
      }
      return false;
    } catch (e) {
      console.error('Login error:', e);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string, role: string): Promise<boolean> => {
    try {
      const registeredUser = await registerUser({ name, email, password, role: role.toUpperCase() });
      if (registeredUser && registeredUser.id) {
        setUser({
          ...registeredUser,
          role: registeredUser.role.toLowerCase() as UserRole
        });
        return true;
      }
      return false;
    } catch (e) {
      console.error('Registration error:', e);
      return false;
    }
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
