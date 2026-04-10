import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { User, UserRole } from '@/types';
import { HttpError, fetchAuthenticatedUser, loginUser, registerUser, type AuthResponse, type ApiUser } from '@/services/api';

declare global {
  interface Window {
    __USER_ROLE?: string;
  }
}

const ROLE_STORAGE_KEY = 'userRole';

const normalizeRole = (role?: string | null): UserRole | undefined => {
  const normalized = role?.toLowerCase();
  if (
    normalized === 'admin' ||
    normalized === 'cod' ||
    normalized === 'lecturer' ||
    normalized === 'timetabling_admin' ||
    normalized === 'class_rep' ||
    normalized === 'student'
  ) {
    return normalized;
  }
  return undefined;
};

const resolveInitialRole = (): UserRole | undefined => {
  if (typeof window === 'undefined') return undefined;
  return normalizeRole(window.__USER_ROLE) ?? normalizeRole(sessionStorage.getItem(ROLE_STORAGE_KEY));
};

const toUser = (user: ApiUser, fallbackRole: UserRole): User => ({
  ...user,
  role: normalizeRole(user.role) ?? fallbackRole,
});

interface AuthContextType {
  user: User | null;
  currentRole?: UserRole;
  isStudent: boolean;
  authChecking: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [currentRole, setCurrentRole] = useState<UserRole | undefined>(() => resolveInitialRole());
  const [authChecking, setAuthChecking] = useState(true);

  useEffect(() => {
    let mounted = true;

    const verifySession = async () => {
      try {
        const sessionUser = await fetchAuthenticatedUser();
        if (!mounted) return;

        if (sessionUser) {
          const role = normalizeRole(sessionUser.role) ?? resolveInitialRole() ?? 'lecturer';
          setUser(toUser(sessionUser, role));
          setCurrentRole(role);
          sessionStorage.setItem(ROLE_STORAGE_KEY, role);
          return;
        }

        setUser(null);
      } catch (error) {
        if (!mounted) return;

        if (error instanceof HttpError && (error.status === 401 || error.status === 403)) {
          setUser(null);
          setCurrentRole(undefined);
          sessionStorage.removeItem(ROLE_STORAGE_KEY);
        } else {
          const persistedRole = resolveInitialRole();
          if (!persistedRole) return;
          setUser({
            id: 'session-user',
            name: 'Session User',
            email: '',
            role: persistedRole,
          });
        }
      } finally {
        if (mounted) setAuthChecking(false);
      }
    };

    verifySession();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (user?.role) {
      setCurrentRole(user.role);
      sessionStorage.setItem(ROLE_STORAGE_KEY, user.role);
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const data: AuthResponse = await loginUser(email, password);
      if (data.success && data.user) {
        const role = normalizeRole(data.user.role);
        setUser(toUser(data.user, role ?? 'lecturer'));
        if (role) {
          setCurrentRole(role);
          sessionStorage.setItem(ROLE_STORAGE_KEY, role);
        }
        setAuthChecking(false);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Login error:', e);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string, role: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response: AuthResponse = await registerUser({ name, email, password, role: role.toUpperCase() });
      if (response && response.success && response.user && response.user.id) {
        const normalizedRole = normalizeRole(response.user.role);
        setUser(toUser(response.user, normalizedRole ?? 'lecturer'));
        if (normalizedRole) {
          setCurrentRole(normalizedRole);
          sessionStorage.setItem(ROLE_STORAGE_KEY, normalizedRole);
        }
        return { success: true, message: response.message || 'Account created successfully' };
      }
      return { success: false, message: 'Registration failed' };
    } catch (error: unknown) {
      console.error('Registration error:', error);
      const message = error instanceof Error ? error.message : 'Registration failed';
      return { success: false, message };
    }
  };

  const logout = () => {
    setUser(null);
    setCurrentRole(undefined);
    sessionStorage.removeItem(ROLE_STORAGE_KEY);
    setAuthChecking(false);
  };

  return (
    <AuthContext.Provider value={{ user, currentRole, isStudent: currentRole === 'student', authChecking, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
