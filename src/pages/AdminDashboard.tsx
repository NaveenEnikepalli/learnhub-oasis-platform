
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  BookOpen, 
  DollarSign, 
  TrendingUp, 
  UserCheck, 
  GraduationCap, 
  BarChart3,
  Eye,
  Trash2,
  Ban,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import DashboardLayout from '@/components/DashboardLayout';
import { mockAPI } from '@/services/mockApiService';
import { Course, Enrollment } from '@/types/mockData';
import { toast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<any>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, coursesRes] = await Promise.all([
        mockAPI.getAnalytics(),
        mockAPI.getAllCourses()
      ]);
      
      setAnalytics(analyticsRes.data);
      setCourses(coursesRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId: string, courseTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${courseTitle}"? This action cannot be undone.`)) {
      try {
        await mockAPI.deleteCourse(courseId);
        fetchDashboardData();
        toast({
          title: "Success",
          description: "Course deleted successfully",
        });
      } catch (error) {
        console.error('Error deleting course:', error);
        toast({
          title: "Error",
          description: "Failed to delete course",
          variant: "destructive",
        });
      }
    }
  };

  const handleTogglePublish = async (courseId: string) => {
    try {
      await mockAPI.publishCourse(courseId);
      fetchDashboardData();
    } catch (error) {
      console.error('Error toggling course status:', error);
      toast({
        title: "Error",
        description: "Failed to update course status",
        variant: "destructive",
      });
    }
  };

  const stats = analytics ? [
    { 
      label: "Total Users", 
      value: analytics.totalUsers.toString(), 
      icon: Users,
      color: "text-blue-600",
      change: "+12%"
    },
    { 
      label: "Total Courses", 
      value: analytics.totalCourses.toString(), 
      icon: BookOpen,
      color: "text-green-600",
      change: "+8%"
    },
    { 
      label: "Total Revenue", 
      value: `$${analytics.revenue.toFixed(2)}`, 
      icon: DollarSign,
      color: "text-yellow-600",
      change: "+23%"
    },
    { 
      label: "Completion Rate", 
      value: `${analytics.completionRate.toFixed(1)}%`, 
      icon: TrendingUp,
      color: "text-purple-600",
      change: "+5%"
    },
  ] : [];

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
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">
            Admin Dashboard
          </h1>
          <p className="text-purple-100 mb-4">
            Welcome, {user?.firstName}! Monitor platform performance and manage the learning ecosystem.
          </p>
          <div className="flex space-x-4">
            <Button className="bg-white text-purple-600 hover:bg-gray-100">
              <BarChart3 className="h-4 w-4 mr-2" />
              View Full Analytics
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
              <Users className="h-4 w-4 mr-2" />
              Manage Users
            </Button>
          </div>
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
                    <p className="text-sm text-green-600 font-medium">{stat.change} from last month</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Popular Courses</CardTitle>
                  <CardDescription>Most enrolled courses this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics?.popularCourses?.slice(0, 5).map((course: Course, index: number) => (
                      <div key={course._id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-medium text-sm">{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium truncate max-w-[200px]">{course.title}</p>
                            <p className="text-sm text-gray-500">{course.instructorName}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{course.students?.length || 0}</p>
                          <p className="text-sm text-gray-500">students</p>
                        </div>
                      </div>
                    )) || (
                      <p className="text-gray-500 text-center py-4">No course data available</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest platform activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics?.recentEnrollments?.slice(0, 5).map((enrollment: Enrollment, index: number) => (
                      <div key={enrollment._id} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-medium">{enrollment.student.firstName} {enrollment.student.lastName}</span>
                            {' '}enrolled in{' '}
                            <span className="font-medium">{enrollment.course.title}</span>
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )) || (
                      <p className="text-gray-500 text-center py-4">No recent activity</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Course Management</h2>
              <div className="text-sm text-gray-500">
                Total: {courses.length} courses
              </div>
            </div>
            
            <div className="grid gap-4">
              {courses.map((course) => (
                <Card key={course._id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold">{course.title}</h3>
                          <Badge variant={course.isPublished ? 'default' : 'secondary'}>
                            {course.isPublished ? 'Published' : 'Draft'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{course.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>By {course.instructorName}</span>
                          <span>•</span>
                          <span>{course.category}</span>
                          <span>•</span>
                          <span>{course.students?.length || 0} students</span>
                          <span>•</span>
                          <span>{course.price === 0 ? 'Free' : `$${course.price}`}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => toast({ title: "Course Preview", description: "Course preview would open here" })}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button 
                          size="sm" 
                          variant={course.isPublished ? "default" : "outline"}
                          onClick={() => handleTogglePublish(course._id)}
                        >
                          {course.isPublished ? (
                            <>
                              <Ban className="h-3 w-3 mr-1" />
                              Unpublish
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Publish
                            </>
                          )}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDeleteCourse(course._id, course.title)}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">User Management</h2>
              <div className="text-sm text-gray-500">
                Total: {analytics?.totalUsers || 0} users
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <UserCheck className="h-5 w-5 text-blue-600" />
                    <span>Students</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {Math.floor((analytics?.totalUsers || 0) * 0.7)}
                  </div>
                  <p className="text-sm text-gray-600">Active learners on platform</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <GraduationCap className="h-5 w-5 text-green-600" />
                    <span>Teachers</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {Math.floor((analytics?.totalUsers || 0) * 0.25)}
                  </div>
                  <p className="text-sm text-gray-600">Course instructors</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    <span>Admins</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {Math.floor((analytics?.totalUsers || 0) * 0.05) || 1}
                  </div>
                  <p className="text-sm text-gray-600">Platform administrators</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>User Activity</CardTitle>
                <CardDescription>Recent user registrations and activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center py-8 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>User management interface would be implemented here</p>
                    <p className="text-sm">Features: User list, role management, activity logs</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold">Platform Analytics</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total Revenue</span>
                      <span className="text-2xl font-bold text-green-600">
                        ${analytics?.revenue?.toFixed(2) || '0.00'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Average Course Price</span>
                      <span className="font-medium">
                        ${courses.length > 0 
                          ? (courses.reduce((sum, c) => sum + c.price, 0) / courses.length).toFixed(2)
                          : '0.00'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Free Courses</span>
                      <span className="font-medium">
                        {courses.filter(c => c.price === 0).length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Engagement Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total Enrollments</span>
                      <span className="text-2xl font-bold text-blue-600">
                        {analytics?.totalEnrollments || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Completion Rate</span>
                      <span className="font-medium">
                        {analytics?.completionRate?.toFixed(1) || 0}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Active Courses</span>
                      <span className="font-medium">
                        {courses.filter(c => c.isPublished).length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
