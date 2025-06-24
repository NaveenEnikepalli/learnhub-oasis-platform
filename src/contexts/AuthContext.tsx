
import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from '@/hooks/use-toast';

// Mock types to replace Supabase types
interface User {
  id: string;
  email: string;
  user_metadata: {
    role: string;
    first_name: string;
    last_name: string;
    full_name: string;
    created_at: string;
  };
  app_metadata: {};
  aud: string;
  created_at: string;
  updated_at: string;
  role: string;
}

interface Session {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at: number;
  token_type: string;
  user: User;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, role: string, firstName: string, lastName: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock user data for demo
const createMockUser = (email: string, role: string, firstName: string, lastName: string): User => ({
  id: `user_${Date.now()}`,
  email,
  user_metadata: {
    role,
    first_name: firstName,
    last_name: lastName,
    full_name: `${firstName} ${lastName}`,
    created_at: new Date().toISOString(),
  },
  app_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  role: 'authenticated',
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in localStorage
    const storedUser = localStorage.getItem('learnhub_user');
    const storedSession = localStorage.getItem('learnhub_session');
    
    if (storedUser && storedSession) {
      setUser(JSON.parse(storedUser));
      setSession(JSON.parse(storedSession));
    }
    
    setIsLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user exists (in a real app, this would be a server call)
      const existingUsers = JSON.parse(localStorage.getItem('learnhub_users') || '[]');
      const foundUser = existingUsers.find((u: any) => u.email === email && u.password === password);
      
      if (!foundUser) {
        throw new Error('Invalid credentials');
      }
      
      const mockUser = createMockUser(
        foundUser.email, 
        foundUser.role, 
        foundUser.firstName, 
        foundUser.lastName
      );
      
      const mockSession = {
        access_token: `token_${Date.now()}`,
        refresh_token: `refresh_${Date.now()}`,
        expires_in: 3600,
        expires_at: Date.now() + 3600000,
        token_type: 'bearer',
        user: mockUser
      };
      
      setUser(mockUser);
      setSession(mockSession as Session);
      
      localStorage.setItem('learnhub_user', JSON.stringify(mockUser));
      localStorage.setItem('learnhub_session', JSON.stringify(mockSession));
      
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to sign in",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, role: string, firstName: string, lastName: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem('learnhub_users') || '[]');
      const userExists = existingUsers.find((u: any) => u.email === email);
      
      if (userExists) {
        throw new Error('User already exists');
      }
      
      // Store user data
      const newUser = { email, password, role, firstName, lastName };
      existingUsers.push(newUser);
      localStorage.setItem('learnhub_users', JSON.stringify(existingUsers));
      
      const mockUser = createMockUser(email, role, firstName, lastName);
      const mockSession = {
        access_token: `token_${Date.now()}`,
        refresh_token: `refresh_${Date.now()}`,
        expires_in: 3600,
        expires_at: Date.now() + 3600000,
        token_type: 'bearer',
        user: mockUser
      };
      
      setUser(mockUser);
      setSession(mockSession as Session);
      
      localStorage.setItem('learnhub_user', JSON.stringify(mockUser));
      localStorage.setItem('learnhub_session', JSON.stringify(mockSession));
      
      toast({
        title: "Welcome to LearnHub!",
        description: "Your account has been created successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create account",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      setUser(null);
      setSession(null);
      localStorage.removeItem('learnhub_user');
      localStorage.removeItem('learnhub_session');
      
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: any) => {
    setIsLoading(true);
    try {
      if (!user) throw new Error('No user logged in');
      
      const updatedUser = {
        ...user,
        user_metadata: {
          ...user.user_metadata,
          ...data,
        },
      };
      
      setUser(updatedUser);
      localStorage.setItem('learnhub_user', JSON.stringify(updatedUser));
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
