
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Clock, Award, Star, Play, Calendar, User, TrendingUp } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { mockAPI } from '@/services/mockApiService';
import { Enrollment } from '@/services/mockData';
import { toast } from '@/hooks/use-toast';

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchEnrollments();
    }
  }, [user]);

  const fetchEnrollments = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await mockAPI.getMyEnrollments(user._id);
      setEnrollments(response.data);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      toast({
        title: "Error",
        description: "Failed to load enrolled courses",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContinueLearning = async (enrollment: Enrollment) => {
    try {
      // Update last accessed
      await mockAPI.updateProgress(enrollment._id, enrollment.progress);
      
      toast({
        title: "Continuing Course",
        description: `Resuming ${enrollment.course.title}`,
      });
      
      // In a real app, this would navigate to the course content
      console.log('Continue learning:', enrollment.course.title);
    } catch (error) {
      console.error('Error continuing course:', error);
    }
  };

  // Calculate stats from real enrollment data
  const stats = [
    { 
      label: "Courses Enrolled", 
      value: enrollments.length.toString(), 
      icon: BookOpen 
    },
    { 
      label: "Hours Learned", 
      value: enrollments.reduce((total, e) => total + (e.course.duration * e.progress / 100), 0).toFixed(0), 
      icon: Clock 
    },
    { 
      label: "Certificates", 
      value: enrollments.filter(e => e.status === 'completed').length.toString(), 
      icon: Award 
    },
    { 
      label: "Avg Progress", 
      value: enrollments.length > 0 ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length).toString() + '%' : '0%', 
      icon: TrendingUp 
    },
  ];

  const achievements = [
    { title: "First Course Enrolled", date: "2024-01-15", icon: Award },
    { title: "Learning Streak", date: "2024-01-20", icon: Calendar },
    { title: "Course Completed", date: "2024-01-25", icon: Star },
  ];

  const recentActivity = enrollments.slice(0, 5).map(enrollment => ({
    action: enrollment.status === 'completed' ? 'Completed course' : 'Studying course',
    course: enrollment.course.title,
    time: new Date(enrollment.lastAccessed).toLocaleDateString()
  }));

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-blue-100 mb-4">
            Continue your learning journey and achieve your goals
          </p>
          <Button 
            className="bg-white text-blue-600 hover:bg-gray-100"
            onClick={() => navigate('/courses')}
          >
            Browse Courses
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <stat.icon className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Enrolled Courses</h2>
              <Button onClick={() => navigate('/courses')}>Browse More Courses</Button>
            </div>
            
            {enrollments.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses enrolled yet</h3>
                  <p className="text-gray-600 mb-4">Start learning by browsing our course catalog!</p>
                  <Button onClick={() => navigate('/courses')}>
                    Browse Courses
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrollments.map((enrollment) => (
                  <Card key={enrollment._id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg line-clamp-2">{enrollment.course.title}</CardTitle>
                          <CardDescription>by {enrollment.course.instructorName}</CardDescription>
                        </div>
                        <Badge variant={enrollment.status === 'completed' ? 'default' : 'secondary'}>
                          {enrollment.progress}%
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{enrollment.progress}% complete</span>
                        </div>
                        <Progress value={enrollment.progress} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Status: {enrollment.status}</p>
                        <p className="text-sm text-gray-600">
                          Enrolled: {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Button 
                        className="w-full" 
                        size="sm"
                        onClick={() => handleContinueLearning(enrollment)}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        {enrollment.status === 'completed' ? 'Review Course' : 'Continue Learning'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <h2 className="text-2xl font-bold">Learning Progress</h2>
            <div className="space-y-6">
              {enrollments.map((enrollment) => (
                <Card key={enrollment._id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold">{enrollment.course.title}</h3>
                        <p className="text-sm text-gray-600">by {enrollment.course.instructorName}</p>
                      </div>
                      <Badge variant="outline">{enrollment.progress}% Complete</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{enrollment.progress}% of {enrollment.course.duration} hours</span>
                      </div>
                      <Progress value={enrollment.progress} className="h-3" />
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Status: {enrollment.status}
                      </span>
                      <Button size="sm" onClick={() => handleContinueLearning(enrollment)}>
                        Continue
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <h2 className="text-2xl font-bold">Your Achievements</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <achievement.icon className="h-8 w-8 text-yellow-600" />
                    </div>
                    <h3 className="font-semibold mb-2">{achievement.title}</h3>
                    <p className="text-sm text-gray-600">{achievement.date}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <h2 className="text-2xl font-bold">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500">No recent activity</p>
                  </CardContent>
                </Card>
              ) : (
                recentActivity.map((activity, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{activity.action}</p>
                          <p className="text-sm text-gray-600">{activity.course}</p>
                        </div>
                        <span className="text-sm text-gray-500">{activity.time}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
