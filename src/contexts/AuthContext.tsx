import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { authApi, ApiError, type RegisterRequest, type UserProfile } from '../services/api';

export type UserRole = 'customer' | 'expert' | 'admin' | 'customer_service';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  // Expert-specific
  expertId?: number;
  skills?: string;
  specialization?: string;
  rating?: number;
  bio?: string;
  // Customer-specific
  loyaltyPoints?: number;
  // Admin/CS-specific
  adminId?: number;
  csId?: number;
  salary?: number;
  employeeRank?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterRequest) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapProfileToUser(profile: UserProfile): User {
  return {
    id: String(profile.userId),
    name: profile.name,
    email: profile.email,
    role: profile.userType,
    phone: profile.phone,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.email}`,
    loyaltyPoints: profile.loyaltyPoints,
    expertId: profile.expertId,
    skills: profile.skills,
    specialization: profile.specialization,
    rating: profile.rating,
    bio: profile.bio,
    adminId: profile.adminId,
    salary: profile.salary,
    employeeRank: profile.employeeRank,
    csId: profile.csId,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  // Restore session: if we have a token, fetch fresh profile
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !user) {
      setIsLoading(true);
      authApi.getProfile()
        .then((res) => {
          const userData = mapProfileToUser(res.data);
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        })
        .catch(() => {
          // Token expired or invalid
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        })
        .finally(() => setIsLoading(false));
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await authApi.login({ email, password });

      // Extract token from response data
      const token = (res.data as any)?.token || (res as any).token;
      if (token) {
        localStorage.setItem('token', token);
      }

      // Fetch user profile after login
      const profileRes = await authApi.getProfile();
      const userData = mapProfileToUser(profileRes.data);
      setUser(userData);

      return { success: true };
    } catch (err) {
      const message = err instanceof ApiError
        ? err.message
        : 'An unexpected error occurred';
      return { success: false, error: message };
    }
  };

  const register = async (data: RegisterRequest): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await authApi.register(data);

      // Extract token from response data
      const token = (res.data as any)?.token || (res as any).token;
      if (token) {
        localStorage.setItem('token', token);

        // Fetch user profile after registration
        const profileRes = await authApi.getProfile();
        const userData = mapProfileToUser(profileRes.data);
        setUser(userData);
      }

      return { success: true };
    } catch (err) {
      const message = err instanceof ApiError
        ? err.message
        : 'An unexpected error occurred';
      return { success: false, error: message };
    }
  };

  const logout = () => {
    const token = localStorage.getItem('token');
    if (token) {
      authApi.logout().catch(() => {});
    }
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const refreshProfile = async () => {
    try {
      const profileRes = await authApi.getProfile();
      const userData = mapProfileToUser(profileRes.data);
      setUser(userData);
    } catch {
      // If profile fetch fails, log out
      logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshProfile,
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
