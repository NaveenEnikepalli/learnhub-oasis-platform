
import { toast } from '@/hooks/use-toast';
import { User, Session } from '@/types/auth';
import { 
  createMockUser, 
  createMockSession, 
  storeAuth, 
  clearAuth, 
  storeUser, 
  findStoredUser, 
  userExists 
} from '@/utils/authUtils';

export const signInUser = async (email: string, password: string): Promise<{ user: User; session: Session }> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const foundUser = findStoredUser(email, password);
  
  if (!foundUser) {
    throw new Error('Invalid credentials');
  }
  
  const mockUser = createMockUser(
    foundUser.email, 
    foundUser.role, 
    foundUser.firstName, 
    foundUser.lastName
  );
  
  const mockSession = createMockSession(mockUser);
  
  storeAuth(mockUser, mockSession);
  
  toast({
    title: "Welcome back!",
    description: "You have successfully signed in.",
  });

  return { user: mockUser, session: mockSession };
};

export const signUpUser = async (
  email: string, 
  password: string, 
  role: string, 
  firstName: string, 
  lastName: string
): Promise<{ user: User; session: Session }> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (userExists(email)) {
    throw new Error('User already exists');
  }
  
  storeUser(email, password, role, firstName, lastName);
  
  const mockUser = createMockUser(email, role, firstName, lastName);
  const mockSession = createMockSession(mockUser);
  
  storeAuth(mockUser, mockSession);
  
  toast({
    title: "Welcome to LearnHub!",
    description: "Your account has been created successfully.",
  });

  return { user: mockUser, session: mockSession };
};

export const signOutUser = async (): Promise<void> => {
  clearAuth();
  
  toast({
    title: "Signed out",
    description: "You have been successfully signed out.",
  });
};

export const updateUserProfile = async (user: User, data: any): Promise<User> => {
  const updatedUser = {
    ...user,
    user_metadata: {
      ...user.user_metadata,
      ...data,
    },
  };
  
  const storedSession = localStorage.getItem('learnhub_session');
  if (storedSession) {
    const session = JSON.parse(storedSession);
    session.user = updatedUser;
    localStorage.setItem('learnhub_session', JSON.stringify(session));
  }
  
  localStorage.setItem('learnhub_user', JSON.stringify(updatedUser));
  
  toast({
    title: "Profile updated",
    description: "Your profile has been updated successfully.",
  });

  return updatedUser;
};
