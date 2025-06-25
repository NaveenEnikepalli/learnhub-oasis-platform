
import { User, Session } from '@/types/auth';

export const createMockUser = (email: string, role: string, firstName: string, lastName: string): User => {
  // Ensure role is one of the valid values
  const validRoles = ['student', 'teacher', 'admin'];
  const validRole = validRoles.includes(role) ? role as 'student' | 'teacher' | 'admin' : 'student';
  
  return {
    _id: `user_${Date.now()}`,
    email,
    firstName,
    lastName,
    role: validRole,
    profileImage: '',
    bio: '',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export const createMockSession = (user: User): Session => ({
  access_token: `token_${Date.now()}`,
  refresh_token: `refresh_${Date.now()}`,
  expires_in: 3600,
  expires_at: Date.now() + 3600000,
  token_type: 'bearer',
  user
});

export const getStoredAuth = () => {
  const storedUser = localStorage.getItem('learnhub_user');
  const storedSession = localStorage.getItem('learnhub_session');
  
  return {
    user: storedUser ? JSON.parse(storedUser) : null,
    session: storedSession ? JSON.parse(storedSession) : null
  };
};

export const storeAuth = (user: User, session: Session) => {
  localStorage.setItem('learnhub_user', JSON.stringify(user));
  localStorage.setItem('learnhub_session', JSON.stringify(session));
};

export const clearAuth = () => {
  localStorage.removeItem('learnhub_user');
  localStorage.removeItem('learnhub_session');
};

export const getStoredUsers = () => {
  return JSON.parse(localStorage.getItem('learnhub_users') || '[]');
};

export const storeUser = (email: string, password: string, role: string, firstName: string, lastName: string) => {
  const existingUsers = getStoredUsers();
  const newUser = { email, password, role, firstName, lastName };
  existingUsers.push(newUser);
  localStorage.setItem('learnhub_users', JSON.stringify(existingUsers));
};

export const findStoredUser = (email: string, password: string) => {
  const existingUsers = getStoredUsers();
  return existingUsers.find((u: any) => u.email === email && u.password === password);
};

export const userExists = (email: string) => {
  const existingUsers = getStoredUsers();
  return existingUsers.find((u: any) => u.email === email);
};
