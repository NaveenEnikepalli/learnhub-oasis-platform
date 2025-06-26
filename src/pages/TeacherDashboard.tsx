
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Users, DollarSign, Eye, Edit, Trash2, Plus, BarChart3 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import DashboardLayout from '@/components/DashboardLayout';
import CreateCourseModal from '@/components/CreateCourseModal';
import { mockAPI } from '@/services/mockApiService';
import { Course } from '@/types/mockData';
import { toast } from '@/hooks/use-toast';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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

  const handleCreateCourse = async (courseData: any) => {
    if (!user) return;
    
    try {
      await mockAPI.createCourse(courseData, user._id);
      setIsCreateModalOpen(false);
      fetchCourses(); // Refresh courses list
    } catch (error) {
      console.error('Error creating course:', error);
      toast({
        title: "Error",
        description: "Failed to create course",
        variant: "destructive",
      });
    }
  };

  const handlePublishToggle = async (courseId: string) => {
    try {
      await mockAPI.publishCourse(courseId);
      fetchCourses(); // Refresh courses list
    } catch (error) {
      console.error('Error toggling publish status:', error);
      toast({
        title: "Error",
        description: "Failed to update course status",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCourse = async (courseId: string, courseTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${courseTitle}"? This action cannot be undone.`)) {
      try {
        await mockAPI.deleteCourse(courseId);
        fetchCourses(); // Refresh courses list
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

  const handleEditCourse = (courseId: string) => {
    toast({
      title: "Edit Course",
      description: "Course editing functionality would open here",
    });
  };

  const handleViewCourse = (courseId: string) => {
    toast({
      title: "View Course",
      description: "Course preview would open here",
    });
  };

  // Calculate stats from real course data
  const totalStudents = courses.reduce((sum, course) => sum + (course.students?.length || 0), 0);
  const publishedCourses = courses.filter(course => course.isPublished).length;
  const totalRevenue = courses.reduce((sum, course) => sum + (course.price * (course.students?.length || 0)), 0);
  const avgRating = courses.length > 0 
    ? courses.reduce((sum, course) => sum + (course.rating?.average || 0), 0) / courses.length 
    : 0;

  const stats = [
    { 
      label: "Total Courses", 
      value: courses.length.toString(), 
      icon: BookOpen,
      color: "text-blue-600"
    },
    { 
      label: "Total Students", 
      value: totalStudents.toString(), 
      icon: Users,
      color: "text-green-600"
    },
    { 
      label: "Revenue", 
      value: `$${totalRevenue.toFixed(2)}`, 
      icon: DollarSign,
      color: "text-yellow-600"
    },
    { 
      label: "Avg Rating", 
      value: avgRating.toFixed(1), 
      icon: BarChart3,
      color: "text-purple-600"
    },
  ];

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
            {courses.length === 0 
              ? "Ready to share your knowledge? Create your first course today!"
              : `You have ${courses.length} courses with ${totalStudents} total students. Keep up the great work!`
            }
          </p>
          <Button 
            className="bg-white text-green-600 hover:bg-gray-100"
            onClick={() => setIsCreateModalOpen(true)}
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
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Courses</h2>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Course
              </Button>
            </div>
            
            {courses.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses created yet</h3>
                  <p className="text-gray-600 mb-4">Create your first course and start sharing your knowledge!</p>
                  <Button onClick={() => setIsCreateModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Course
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <Card key={course._id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                          <CardDescription>{course.category} • {course.level}</CardDescription>
                        </div>
                        <Badge variant={course.isPublished ? 'default' : 'secondary'}>
                          {course.isPublished ? 'Published' : 'Draft'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {course.description}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Students:</span>
                          <span className="font-medium ml-1">{course.students?.length || 0}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Price:</span>
                          <span className="font-medium ml-1">
                            {course.price === 0 ? 'Free' : `$${course.price}`}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Duration:</span>
                          <span className="font-medium ml-1">{course.duration}h</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Rating:</span>
                          <span className="font-medium ml-1">{course.rating?.average || 0}/5</span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewCourse(course._id)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEditCourse(course._id)}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant={course.isPublished ? "default" : "outline"}
                          onClick={() => handlePublishToggle(course._id)}
                        >
                          {course.isPublished ? 'Unpublish' : 'Publish'}
                        </Button>
                      </div>
                      
                      <Button 
                        size="sm" 
                        variant="destructive"
                        className="w-full"
                        onClick={() => handleDeleteCourse(course._id, course.title)}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete Course
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold">Course Analytics</h2>
            
            {courses.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No analytics yet</h3>
                  <p className="text-gray-600">Create courses to see detailed analytics</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Course Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {courses.slice(0, 5).map((course) => (
                          <div key={course._id} className="flex justify-between items-center">
                            <div>
                              <p className="font-medium truncate">{course.title}</p>
                              <p className="text-sm text-gray-500">{course.students?.length || 0} students</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">${((course.price || 0) * (course.students?.length || 0)).toFixed(2)}</p>
                              <p className="text-sm text-gray-500">Revenue</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Student Engagement</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span>Total Enrollments</span>
                          <span className="font-medium">{totalStudents}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Published Courses</span>
                          <span className="font-medium">{publishedCourses}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Draft Courses</span>
                          <span className="font-medium">{courses.length - publishedCourses}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Average Rating</span>
                          <span className="font-medium">{avgRating.toFixed(1)}/5</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <h2 className="text-2xl font-bold">Student Overview</h2>
            
            {totalStudents === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No students yet</h3>
                  <p className="text-gray-600">Publish your courses to start getting students</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Student Distribution by Course</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {courses
                        .filter(course => (course.students?.length || 0) > 0)
                        .sort((a, b) => (b.students?.length || 0) - (a.students?.length || 0))
                        .map((course) => (
                          <div key={course._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                              <h4 className="font-medium">{course.title}</h4>
                              <p className="text-sm text-gray-600">{course.category}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-blue-600">{course.students?.length || 0}</p>
                              <p className="text-sm text-gray-500">students</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Create Course Modal */}
        <CreateCourseModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateCourse}
        />
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
