
import React, { createContext, useEffect, useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { User, Session, AuthContextType } from '@/types/auth';
import { getStoredAuth } from '@/utils/authUtils';
import { signInUser, signUpUser, signOutUser, updateUserProfile } from '@/services/authService';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { user: storedUser, session: storedSession } = getStoredAuth();
    
    if (storedUser && storedSession) {
      setUser(storedUser);
      setSession(storedSession);
    }
    
    setIsLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { user: newUser, session: newSession } = await signInUser(email, password);
      setUser(newUser);
      setSession(newSession);
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
      const { user: newUser, session: newSession } = await signUpUser(email, password, role, firstName, lastName);
      setUser(newUser);
      setSession(newSession);
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
      await signOutUser();
      setUser(null);
      setSession(null);
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
      
      const updatedUser = await updateUserProfile(user, data);
      setUser(updatedUser);
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
