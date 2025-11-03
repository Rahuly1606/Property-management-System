import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/services/authService';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'landlord' | 'tenant';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('pms_token');
    const storedUser = localStorage.getItem('pms_user');

    if (storedToken && storedUser && storedUser !== 'undefined') {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('pms_token');
        localStorage.removeItem('pms_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password);

    // Build user object from response
    const userData = {
      id: response.id?.toString() || '',
      name: `${response.firstName || ''} ${response.lastName || ''}`.trim(),
      email: response.email || '',
      role: (response.role?.toLowerCase() || 'tenant') as 'admin' | 'landlord' | 'tenant'
    };

    setToken(response.token);
    setUser(userData);
    localStorage.setItem('pms_token', response.token);
    localStorage.setItem('pms_user', JSON.stringify(userData));
  };

  const register = async (name: string, email: string, password: string, role: string) => {
    const response = await authService.register(name, email, password, role);

    // Build user object from response
    const userData = {
      id: response.id?.toString() || '',
      name: `${response.firstName || ''} ${response.lastName || ''}`.trim(),
      email: response.email || '',
      role: (response.role?.toLowerCase() || role) as 'admin' | 'landlord' | 'tenant'
    };

    setToken(response.token);
    setUser(userData);
    localStorage.setItem('pms_token', response.token);
    localStorage.setItem('pms_user', JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('pms_token');
    localStorage.removeItem('pms_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
