
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Users, DollarSign, TrendingUp, Plus, Edit, Trash2, Eye, BarChart3 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/DashboardLayout';
import CreateCourseModal from '@/components/CreateCourseModal';
import { mockAPI } from '@/services/mockApiService';
import { Course } from '@/services/mockData';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchCourses();
    }
  }, [user]);

  const fetchCourses = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await mockAPI.getMyCourses(user._id);
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast({
        title: "Error",
        description: "Failed to load courses",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }

    if (!user) return;

    try {
      await mockAPI.deleteCourse(courseId, user._id);
      fetchCourses(); // Refresh the data
    } catch (error: any) {
      console.error('Delete course error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete course",
        variant: "destructive",
      });
    }
  };

  const handlePublishToggle = async (courseId: string) => {
    if (!user) return;

    try {
      await mockAPI.publishCourse(courseId, user._id);
      fetchCourses(); // Refresh the data
    } catch (error: any) {
      console.error('Publish course error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update course status",
        variant: "destructive",
      });
    }
  };

  const handleEditCourse = (courseId: string) => {
    console.log('Edit course:', courseId);
    toast({
      title: "Feature Coming Soon",
      description: "Course editing will be available soon",
    });
  };

  const handleViewCourse = (courseId: string) => {
    console.log('View course:', courseId);
    toast({
      title: "Course Details",
      description: "Course viewing feature coming soon",
    });
  };

  const handleCourseCreated = () => {
    setShowCreateModal(false);
    fetchCourses(); // Refresh the data
  };

  // Calculate stats from real data
  const stats = [
    { 
      label: "Total Courses", 
      value: courses.length.toString(), 
      icon: BookOpen, 
      change: `+${courses.filter(c => new Date(c.createdAt) > new Date(Date.now() - 30*24*60*60*1000)).length} this month`
    },
    { 
      label: "Total Students", 
      value: courses.reduce((total, course) => total + (course.students?.length || 0), 0).toLocaleString(), 
      icon: Users, 
      change: "across all courses"
    },
    { 
      label: "Total Revenue", 
      value: `$${courses.reduce((total, course) => total + (course.price * (course.students?.length || 0)), 0).toLocaleString()}`, 
      icon: DollarSign, 
      change: "estimated earnings"
    },
    { 
      label: "Published Courses", 
      value: courses.filter(c => c.isPublished).length.toString(), 
      icon: TrendingUp, 
      change: `${Math.round((courses.filter(c => c.isPublished).length / Math.max(courses.length, 1)) * 100)}% of total`
    },
  ];

  const getStatusColor = (isPublished: boolean) => {
    return isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

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
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">
            Welcome, {user?.firstName}!
          </h1>
          <p className="text-green-100 mb-4">
            Share your knowledge and inspire learners worldwide
          </p>
          <Button 
            className="bg-white text-green-600 hover:bg-gray-100"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Course
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
                    <p className="text-sm text-green-600 font-medium">{stat.change}</p>
                  </div>
                  <stat.icon className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Courses</h2>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Course
              </Button>
            </div>
            
            {courses.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses yet</h3>
                  <p className="text-gray-600 mb-4">Create your first course to start teaching</p>
                  <Button onClick={() => setShowCreateModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Course
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {courses.map((course) => (
                  <Card key={course._id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold">{course.title}</h3>
                            <Badge className={getStatusColor(course.isPublished)}>
                              {course.isPublished ? 'Published' : 'Draft'}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-2">
                            <div>Students: {course.students?.length || 0}</div>
                            <div>Price: {course.price === 0 ? 'Free' : `$${course.price}`}</div>
                            <div>Category: {course.category}</div>
                            <div>Duration: {course.duration}h</div>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
                        </div>
                        <div className="flex flex-col space-y-2 ml-4">
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={() => handleViewCourse(course._id)}>
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleEditCourse(course._id)}>
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant={course.isPublished ? "secondary" : "default"}
                              onClick={() => handlePublishToggle(course._id)}
                            >
                              {course.isPublished ? 'Unpublish' : 'Publish'}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteCourse(course._id)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        Created: {new Date(course.createdAt).toLocaleDateString()} | 
                        Last updated: {new Date(course.updatedAt).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold">Course Analytics</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Revenue Overview
                  </CardTitle>
                  <CardDescription>Total earnings from all courses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    ${courses.reduce((total, course) => total + (course.price * (course.students?.length || 0)), 0).toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    From {courses.reduce((total, course) => total + (course.students?.length || 0), 0)} total enrollments
                  </p>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Published Courses:</span>
                      <span>{courses.filter(c => c.isPublished).length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Draft Courses:</span>
                      <span>{courses.filter(c => !c.isPublished).length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Course Performance
                  </CardTitle>
                  <CardDescription>Your most popular courses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {courses.length === 0 ? (
                      <p className="text-gray-500 text-sm">No courses created yet</p>
                    ) : (
                      courses
                        .sort((a, b) => (b.students?.length || 0) - (a.students?.length || 0))
                        .slice(0, 5)
                        .map((course, index) => (
                          <div key={course._id} className="flex justify-between items-center">
                            <div>
                              <span className="text-sm font-medium">{course.title}</span>
                              <div className="text-xs text-gray-500">
                                ${course.price} • {course.category}
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-medium">{course.students?.length || 0}</span>
                              <div className="text-xs text-gray-500">students</div>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <CreateCourseModal 
        open={showCreateModal} 
        onClose={() => setShowCreateModal(false)}
        onCourseCreated={handleCourseCreated}
      />
    </DashboardLayout>
  );
};

export default TeacherDashboard;
