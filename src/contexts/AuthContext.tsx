
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session, AuthContextType } from '@/types/auth';
import { signInUser, signUpUser, signOutUser, updateUserProfile } from '@/services/authService';
import { getStoredAuth } from '@/utils/authUtils';

// Export the AuthContext so it can be imported by useAuth hook
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider: Initializing...');
    checkStoredAuth();
  }, []);

  const checkStoredAuth = () => {
    try {
      const stored = getStoredAuth();
      console.log('AuthProvider: Stored auth:', stored);
      
      if (stored.user && stored.session) {
        // Validate that the user has a valid role
        const validRoles = ['student', 'teacher', 'admin'];
        if (validRoles.includes(stored.user.role)) {
          setUser(stored.user);
          setSession(stored.session);
          console.log('AuthProvider: User loaded from storage:', stored.user.role);
        } else {
          console.warn('AuthProvider: Invalid user role found, clearing auth');
          clearAuth();
        }
      }
    } catch (error) {
      console.error('AuthProvider: Error loading stored auth:', error);
      clearAuth();
    } finally {
      setIsLoading(false);
    }
  };

  const clearAuth = () => {
    localStorage.removeItem('learnhub_user');
    localStorage.removeItem('learnhub_session');
    setUser(null);
    setSession(null);
  };

  const signIn = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const { user: authUser, session: authSession } = await signInUser(email, password);
      setUser(authUser);
      setSession(authSession);
      console.log('AuthProvider: User signed in:', authUser.role);
    } catch (error) {
      console.error('AuthProvider: Sign in error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    role: string,
    firstName: string,
    lastName: string
  ): Promise<void> => {
    setIsLoading(true);
    try {
      const { user: authUser, session: authSession } = await signUpUser(
        email,
        password,
        role,
        firstName,
        lastName
      );
      setUser(authUser);
      setSession(authSession);
      console.log('AuthProvider: User signed up:', authUser.role);
    } catch (error) {
      console.error('AuthProvider: Sign up error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await signOutUser();
      clearAuth();
      console.log('AuthProvider: User signed out');
    } catch (error) {
      console.error('AuthProvider: Sign out error:', error);
      // Still clear local auth even if service fails
      clearAuth();
    }
  };

  const updateProfile = async (data: any): Promise<void> => {
    if (!user) throw new Error('No user logged in');
    
    try {
      const updatedUser = await updateUserProfile(user, data);
      setUser(updatedUser);
      console.log('AuthProvider: Profile updated');
    } catch (error) {
      console.error('AuthProvider: Update profile error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
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
