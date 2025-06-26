
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Home, Search, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const NotFound = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoToDashboard = () => {
    if (user) {
      navigate(`/dashboard/${user.role || 'student'}`);
    } else {
      navigate('/auth');
    }
  };

  const handleBrowseCourses = () => {
    navigate('/courses');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div 
              className="flex items-center space-x-2 cursor-pointer"
              onClick={handleGoHome}
            >
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">LearnHub</span>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <Button onClick={handleGoToDashboard}>
                  Dashboard
                </Button>
              ) : (
                <Button onClick={() => navigate('/auth')}>
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* 404 Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Card className="text-center">
            <CardHeader className="pb-4">
              <div className="mx-auto mb-4 w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-12 w-12 text-red-600" />
              </div>
              <CardTitle className="text-4xl font-bold text-gray-900 mb-2">
                404
              </CardTitle>
              <CardTitle className="text-xl text-gray-700 mb-2">
                Page Not Found
              </CardTitle>
              <CardDescription className="text-gray-600">
                The page you're looking for doesn't exist or has been moved.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Button 
                  onClick={handleGoHome}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Go to Homepage
                </Button>
                
                {user && (
                  <Button 
                    onClick={handleGoToDashboard}
                    variant="outline"
                    className="w-full"
                  >
                    Go to Dashboard
                  </Button>
                )}
                
                <Button 
                  onClick={handleBrowseCourses}
                  variant="outline"
                  className="w-full"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Browse Courses
                </Button>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-500">
                  Having trouble? Try going back to the{' '}
                  <button 
                    onClick={handleGoHome}
                    className="text-blue-600 hover:underline"
                  >
                    homepage
                  </button>
                  {' '}or{' '}
                  <button 
                    onClick={handleBrowseCourses}
                    className="text-blue-600 hover:underline"
                  >
                    browse our courses
                  </button>
                  .
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
