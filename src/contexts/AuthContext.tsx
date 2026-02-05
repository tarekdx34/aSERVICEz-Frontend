import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type UserRole = 'customer' | 'expert';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, accountType: UserRole) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo credentials
const DEMO_USERS = {
  expert: {
    id: '1',
    name: 'أحمد محمد',
    email: 'expert@aservicea.com',
    password: 'Expert123!',
    role: 'expert' as UserRole,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed',
  },
  customer: {
    id: '2',
    name: 'سارة أحمد',
    email: 'customer@aservicea.com',
    password: 'Customer123!',
    role: 'customer' as UserRole,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sara',
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Try to restore user from localStorage
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    // Save user to localStorage
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (email: string, password: string, accountType: UserRole): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check demo credentials
    const demoUser = DEMO_USERS[accountType];
    if (email === demoUser.email && password === demoUser.password) {
      const { password: _, ...userData } = demoUser;
      setUser(userData);
      return true;
    }

    // For demo: allow any email/password combination if it looks valid
    if (email.includes('@') && password.length >= 6) {
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: email.split('@')[0],
        email,
        role: accountType,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      };
      setUser(newUser);
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user,
        login,
        logout,
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
