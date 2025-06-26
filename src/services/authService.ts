
import { User, Session } from '@/types/auth';
import { 
  createMockUser, 
  createMockSession, 
  storeAuth, 
  findStoredUser, 
  userExists, 
  storeUser 
} from '@/utils/authUtils';
import { toast } from '@/hooks/use-toast';

export const signInUser = async (email: string, password: string): Promise<{ user: User; session: Session }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const foundUser = findStoredUser(email, password);
  
  if (!foundUser) {
    toast({
      title: "Error",
      description: "Invalid email or password",
      variant: "destructive",
    });
    throw new Error('Invalid credentials');
  }
  
  const user = createMockUser(foundUser.email, foundUser.role, foundUser.firstName, foundUser.lastName);
  const session = createMockSession(user);
  
  storeAuth(user, session);
  
  toast({
    title: "Success!",
    description: "Successfully signed in",
  });
  
  return { user, session };
};

export const signUpUser = async (
  email: string, 
  password: string, 
  role: string, 
  firstName: string, 
  lastName: string
): Promise<{ user: User; session: Session }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (userExists(email)) {
    toast({
      title: "Error",
      description: "User already exists with this email",
      variant: "destructive",
    });
    throw new Error('User already exists');
  }
  
  storeUser(email, password, role, firstName, lastName);
  
  const user = createMockUser(email, role, firstName, lastName);
  const session = createMockSession(user);
  
  storeAuth(user, session);
  
  toast({
    title: "Success!",
    description: "Account created successfully",
  });
  
  return { user, session };
};

export const signOutUser = async (): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  toast({
    title: "Signed Out",
    description: "You have been successfully signed out",
  });
};

export const updateUserProfile = async (user: User, data: any): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const updatedUser: User = {
    ...user,
    firstName: data.firstName || user.firstName,
    lastName: data.lastName || user.lastName,
    bio: data.bio || user.bio,
    updatedAt: new Date().toISOString(),
  };
  
  // Update stored user data
  const storedSession = localStorage.getItem('learnhub_session');
  if (storedSession) {
    const session = JSON.parse(storedSession);
    session.user = updatedUser;
    localStorage.setItem('learnhub_session', JSON.stringify(session));
  }
  localStorage.setItem('learnhub_user', JSON.stringify(updatedUser));
  
  toast({
    title: "Success!",
    description: "Profile updated successfully",
  });
  
  return updatedUser;
};
