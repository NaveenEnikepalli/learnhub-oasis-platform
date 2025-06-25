
import { ReactNode, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('ProtectedRoute: user:', user, 'isLoading:', isLoading);
    
    if (!isLoading && !user) {
      console.log('ProtectedRoute: No user, redirecting to /auth');
      navigate('/auth');
      return;
    }

    if (!isLoading && user) {
      const userRole = user.role;
      console.log('ProtectedRoute: User role:', userRole, 'Allowed roles:', allowedRoles);
      
      // Validate that userRole is one of the valid roles
      const validRoles = ['student', 'teacher', 'admin'];
      if (!validRoles.includes(userRole)) {
        console.error('ProtectedRoute: Invalid user role:', userRole);
        // Default to student if role is invalid
        navigate('/dashboard/student');
        return;
      }
      
      if (!allowedRoles.includes(userRole)) {
        console.log('ProtectedRoute: Role not allowed, redirecting to user dashboard');
        // Redirect to appropriate dashboard based on user role
        navigate(`/dashboard/${userRole}`);
        return;
      }
    }
  }, [user, isLoading, navigate, allowedRoles]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const userRole = user.role;
  const validRoles = ['student', 'teacher', 'admin'];
  
  if (!validRoles.includes(userRole) || !allowedRoles.includes(userRole)) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
