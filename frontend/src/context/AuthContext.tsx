import {createContext,useCallback,useContext,useEffect,useState,type ReactNode,} from 'react';
import { authApi } from '../api/auth';
import type { AuthUser, LoginPayload, RegisterPayload } from '../types';

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<{ account_number: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const raw = localStorage.getItem('lebank_user');
    return raw ? JSON.parse(raw) : null;
  });

  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem('lebank_token')
  );
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    if (token && !user)
      {authApi.me().then((res) => {setUser(res.data.user ?? res.data);
          localStorage.setItem('lebank_user', JSON.stringify(res.data.user ?? res.data));
        })
        .catch(() => {
          setToken(null);
          localStorage.removeItem('lebank_token');
          localStorage.removeItem('lebank_user');
        });
    }
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    setIsLoading(true);
    try {
      const { data } = await authApi.login(payload);
      setToken(data.token);
      setUser(data.User);
      localStorage.setItem('lebank_token', data.token);
      localStorage.setItem('lebank_user', JSON.stringify(data.User));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    setIsLoading(true);
    try {
      const { data } = await authApi.register(payload);
      return data;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('lebank_token');
      localStorage.removeItem('lebank_user');
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
