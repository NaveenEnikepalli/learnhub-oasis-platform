
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, BookOpen, DollarSign, TrendingUp, Eye, Shield, Settings, BarChart3 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/DashboardLayout';
import { mockCourses, getPublishedCourses } from '@/services/mockData';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 127,
    totalCourses: mockCourses.length,
    publishedCourses: getPublishedCourses().length,
    totalRevenue: 0,
    activeStudents: 89,
    activeTeachers: 23,
  });

  useEffect(() => {
    // Calculate revenue from all courses
    const revenue = mockCourses.reduce((total, course) => 
      total + (course.price * (course.students?.length || 0)), 0
    );
    
    setStats(prev => ({
      ...prev,
      totalRevenue: revenue
    }));
  }, []);

  const systemStats = [
    { 
      label: "Total Users", 
      value: stats.totalUsers.toString(), 
      icon: Users, 
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    { 
      label: "Total Courses", 
      value: stats.totalCourses.toString(), 
      icon: BookOpen, 
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    { 
      label: "Published Courses", 
      value: stats.publishedCourses.toString(), 
      icon: TrendingUp, 
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    { 
      label: "Platform Revenue", 
      value: `$${stats.totalRevenue.toLocaleString()}`, 
      icon: DollarSign, 
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
  ];

  const userStats = [
    { label: "Active Students", value: stats.activeStudents, role: "student" },
    { label: "Active Teachers", value: stats.activeTeachers, role: "teacher" },
    { label: "Administrators", value: 3, role: "admin" },
  ];

  const recentCourses = mockCourses
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const topPerformingCourses = mockCourses
    .sort((a, b) => (b.students?.length || 0) - (a.students?.length || 0))
    .slice(0, 5);

  const handleViewCourse = (courseId: string) => {
    toast({
      title: "Course Details",
      description: "Course viewing feature coming soon",
    });
  };

  const handleModerateContent = () => {
    toast({
      title: "Content Moderation",
      description: "Content moderation tools coming soon",
    });
  };

  const handleUserManagement = () => {
    toast({
      title: "User Management",
      description: "User management features coming soon",
    });
  };

  const handleSystemSettings = () => {
    toast({
      title: "System Settings",
      description: "System configuration tools coming soon",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">
            Administrator Dashboard
          </h1>
          <p className="text-purple-100 mb-4">
            Welcome, {user?.firstName}! Manage the LearnHub platform and monitor system performance.
          </p>
          <div className="flex space-x-4">
            <Button 
              className="bg-white text-purple-600 hover:bg-gray-100"
              onClick={handleUserManagement}
            >
              <Users className="h-4 w-4 mr-2" />
              Manage Users
            </Button>
            <Button 
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-purple-600"
              onClick={handleSystemSettings}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* System Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {systemStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
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
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    User Distribution
                  </CardTitle>
                  <CardDescription>Active users by role</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userStats.map((stat, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Badge 
                            variant="outline" 
                            className={`capitalize ${
                              stat.role === 'student' ? 'border-blue-500 text-blue-700' :
                              stat.role === 'teacher' ? 'border-green-500 text-green-700' :
                              'border-purple-500 text-purple-700'
                            }`}
                          >
                            {stat.role}
                          </Badge>
                          <span className="text-sm font-medium">{stat.label}</span>
                        </div>
                        <span className="text-lg font-bold">{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Platform Health
                  </CardTitle>
                  <CardDescription>System status and metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Course Approval Rate</span>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        92%
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">User Satisfaction</span>
                      <Badge variant="default" className="bg-blue-100 text-blue-800">
                        4.8/5
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">System Uptime</span>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        99.9%
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Content Quality Score</span>
                      <Badge variant="default" className="bg-purple-100 text-purple-800">
                        4.6/5
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Recent Platform Activity</CardTitle>
                  <Button variant="outline" onClick={handleModerateContent}>
                    <Shield className="h-4 w-4 mr-2" />
                    Moderate Content
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-sm">New course published: "Advanced React Development"</span>
                    <span className="text-xs text-gray-500">2 hours ago</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-sm">User reported content in "Digital Marketing" course</span>
                    <span className="text-xs text-gray-500">4 hours ago</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-sm">Teacher "Sarah Johnson" requested course verification</span>
                    <span className="text-xs text-gray-500">1 day ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Course Management</h2>
              <Button onClick={handleModerateContent}>
                <Shield className="h-4 w-4 mr-2" />
                Review Pending
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recently Added Courses</CardTitle>
                  <CardDescription>Latest courses awaiting review</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentCourses.map((course) => (
                      <div key={course._id} className="flex justify-between items-center p-3 border rounded">
                        <div>
                          <p className="font-medium text-sm">{course.title}</p>
                          <p className="text-xs text-gray-500">by {course.instructorName}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant={course.isPublished ? 'default' : 'secondary'} className="text-xs">
                              {course.isPublished ? 'Published' : 'Draft'}
                            </Badge>
                            <span className="text-xs text-gray-500">{course.category}</span>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => handleViewCourse(course._id)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Courses</CardTitle>
                  <CardDescription>Courses with highest enrollment</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topPerformingCourses.map((course, index) => (
                      <div key={course._id} className="flex justify-between items-center p-3 border rounded">
                        <div>
                          <p className="font-medium text-sm">{course.title}</p>
                          <p className="text-xs text-gray-500">by {course.instructorName}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs text-green-600">
                              {course.students?.length || 0} students
                            </span>
                            <span className="text-xs text-gray-500">
                              ${course.price * (course.students?.length || 0)} revenue
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-blue-600">#{index + 1}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">User Management</h2>
              <Button onClick={handleUserManagement}>
                <Users className="h-4 w-4 mr-2" />
                Manage Users
              </Button>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {userStats.map((stat, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{stat.label}</span>
                      <Badge variant="outline" className="capitalize">
                        {stat.role}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-4">{stat.value}</div>
                    <Button variant="outline" className="w-full" onClick={handleUserManagement}>
                      View All {stat.role}s
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>User Activity Overview</CardTitle>
                <CardDescription>Recent user registrations and activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-sm">New student registration: john.doe@email.com</span>
                    <Badge variant="secondary">Student</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-sm">Teacher application: jane.smith@email.com</span>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-sm">Course completion: "Web Development Bootcamp"</span>
                    <Badge variant="default">Completed</Badge>
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
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Revenue Analytics
                  </CardTitle>
                  <CardDescription>Financial performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Platform Revenue</span>
                      <span className="text-xl font-bold text-green-600">
                        ${stats.totalRevenue.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Average Course Price</span>
                      <span className="text-lg font-semibold">
                        ${Math.round(mockCourses.reduce((sum, c) => sum + c.price, 0) / mockCourses.length)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Commission Earned (10%)</span>
                      <span className="text-lg font-semibold text-purple-600">
                        ${Math.round(stats.totalRevenue * 0.1).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Growth Metrics
                  </CardTitle>
                  <CardDescription>Platform growth indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Monthly Active Users</span>
                      <span className="text-xl font-bold text-blue-600">
                        {stats.activeStudents + stats.activeTeachers}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Course Completion Rate</span>
                      <span className="text-lg font-semibold text-green-600">73%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">User Retention Rate</span>
                      <span className="text-lg font-semibold text-purple-600">85%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
                <CardDescription>Course performance by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['Web Development', 'Data Science', 'Marketing', 'Design'].map((category) => {
                    const categoryStats = mockCourses.filter(c => c.category === category);
                    const totalStudents = categoryStats.reduce((sum, c) => sum + (c.students?.length || 0), 0);
                    
                    return (
                      <div key={category} className="flex justify-between items-center p-3 border rounded">
                        <div>
                          <p className="font-medium">{category}</p>
                          <p className="text-sm text-gray-600">
                            {categoryStats.length} courses • {totalStudents} students
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            ${categoryStats.reduce((sum, c) => sum + (c.price * (c.students?.length || 0)), 0).toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500">revenue</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
