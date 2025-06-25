
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Users, DollarSign, TrendingUp, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/DashboardLayout';
import CreateCourseModal from '@/components/CreateCourseModal';
import { courseAPI } from '@/services/api';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await courseAPI.getMyCourses();
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

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) {
      return;
    }

    try {
      await courseAPI.deleteCourse(courseId);
      toast({
        title: "Success",
        description: "Course deleted successfully",
      });
      fetchCourses(); // Refresh the data
    } catch (error) {
      console.error('Delete course error:', error);
      toast({
        title: "Error",
        description: "Failed to delete course",
        variant: "destructive",
      });
    }
  };

  const handleEditCourse = (courseId) => {
    console.log('Edit course:', courseId);
    toast({
      title: "Feature Coming Soon",
      description: "Course editing will be available soon",
    });
  };

  const handleViewCourse = (courseId) => {
    console.log('View course:', courseId);
    window.open(`/courses/${courseId}`, '_blank');
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
      change: `+${courses.filter(c => new Date(c.createdAt) > new Date(Date.now() - 30*24*60*60*1000)).length}` 
    },
    { 
      label: "Total Students", 
      value: courses.reduce((total, course) => total + (course.students?.length || 0), 0).toLocaleString(), 
      icon: Users, 
      change: "+0" 
    },
    { 
      label: "Total Revenue", 
      value: `$${courses.reduce((total, course) => total + (course.price * (course.students?.length || 0)), 0).toLocaleString()}`, 
      icon: DollarSign, 
      change: "+$0" 
    },
    { 
      label: "Published Courses", 
      value: courses.filter(c => c.isPublished).length.toString(), 
      icon: TrendingUp, 
      change: `+${courses.filter(c => c.isPublished && new Date(c.createdAt) > new Date(Date.now() - 30*24*60*60*1000)).length}` 
    },
  ];

  const getStatusColor = (isPublished) => {
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
                    <p className="text-sm text-green-600 font-medium">{stat.change} this month</p>
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
            <div className="space-y-4">
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
                courses.map((course) => (
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
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div>Students: {course.students?.length || 0}</div>
                            <div>Price: ${course.price}</div>
                            <div>Category: {course.category}</div>
                            <div>Duration: {course.duration}h</div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => handleViewCourse(course._id)}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleEditCourse(course._id)}>
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-600"
                            onClick={() => handleDeleteCourse(course._id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        Created: {new Date(course.createdAt).toLocaleDateString()} | 
                        Last updated: {new Date(course.updatedAt).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold">Course Analytics</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                  <CardDescription>Total earnings from all courses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    ${courses.reduce((total, course) => total + (course.price * (course.students?.length || 0)), 0).toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    From {courses.reduce((total, course) => total + (course.students?.length || 0), 0)} total enrollments
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Course Performance</CardTitle>
                  <CardDescription>Your most popular courses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {courses
                      .sort((a, b) => (b.students?.length || 0) - (a.students?.length || 0))
                      .slice(0, 3)
                      .map((course, index) => (
                        <div key={course._id} className="flex justify-between items-center">
                          <span className="text-sm">{course.title}</span>
                          <span className="text-sm font-medium">{course.students?.length || 0} students</span>
                        </div>
                      ))}
                    {courses.length === 0 && (
                      <p className="text-gray-500 text-sm">No courses created yet</p>
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
