
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  studentId?: string;
  yearOfStudy?: number;
  role: 'STUDENT' | 'PROFESSOR';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('examai_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const validateUniversityEmail = (email: string): boolean => {
    return email.endsWith('@umib.net');
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    if (!validateUniversityEmail(email)) {
      throw new Error('Please use your university email (@umib.net)');
    }

    try {
      // Mock login - in real app, this would be an API call
      const mockUser: User = {
        id: '1',
        email,
        firstName: 'John',
        lastName: 'Doe',
        role: email.includes('prof') ? 'PROFESSOR' : 'STUDENT',
        studentId: email.includes('prof') ? undefined : 'ST001',
        yearOfStudy: email.includes('prof') ? undefined : 3,
        isVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setUser(mockUser);
      localStorage.setItem('examai_user', JSON.stringify(mockUser));
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    if (!validateUniversityEmail(userData.email)) {
      throw new Error('Please use your university email (@umib.net)');
    }

    try {
      // Mock registration - in real app, this would be an API call
      const newUser: User = {
        id: Date.now().toString(),
        ...userData,
        isVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setUser(newUser);
      localStorage.setItem('examai_user', JSON.stringify(newUser));
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('examai_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
