
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Mail, GraduationCap, BookOpen, Edit, Trash2, Eye, Award, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/DashboardLayout';
import CreateCourseModal from '@/components/CreateCourseModal';
import { courseAPI, enrollmentAPI } from '@/services/api';

const Profile = () => {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [createdCourses, setCreatedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const userRole = user?.role || 'student';

  useEffect(() => {
    fetchUserData();
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      if (userRole === 'student') {
        const response = await enrollmentAPI.getMyEnrollments();
        setEnrolledCourses(response.data);
      } else if (userRole === 'teacher') {
        const response = await courseAPI.getMyCourses();
        setCreatedCourses(response.data);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditCourse = (courseId) => {
    console.log('Edit course:', courseId);
    // TODO: Navigate to course edit page or open edit modal
    toast({
      title: "Feature Coming Soon",
      description: "Course editing will be available soon",
    });
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
      fetchUserData(); // Refresh the data
    } catch (error) {
      console.error('Delete course error:', error);
      toast({
        title: "Error",
        description: "Failed to delete course",
        variant: "destructive",
      });
    }
  };

  const handleViewCourse = (courseId) => {
    console.log('View course:', courseId);
    // TODO: Navigate to course view page
    window.open(`/courses/${courseId}`, '_blank');
  };

  const handleCourseCreated = () => {
    setShowCreateModal(false);
    fetchUserData(); // Refresh the data
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
        {/* Profile Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-6 w-6" />
              <span>Profile Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">
                      {user?.firstName} {user?.lastName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <GraduationCap className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Role</p>
                    <Badge variant="outline" className="capitalize">
                      {userRole}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Role-specific Content */}
        {userRole === 'student' && (
          <Card>
            <CardHeader>
              <CardTitle>My Enrolled Courses</CardTitle>
              <CardDescription>Track your learning progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {enrolledCourses.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No courses enrolled yet. Start learning by browsing our course catalog!
                  </p>
                ) : (
                  enrolledCourses.map((enrollment) => (
                    <div key={enrollment._id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{enrollment.course.title}</h3>
                        <Badge 
                          variant={enrollment.status === 'completed' ? 'default' : 'secondary'}
                        >
                          {enrollment.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        by {enrollment.course.instructorName}
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                          Progress: {enrollment.progress}% | Enrolled: {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                        </div>
                        <Button size="sm" variant="outline" onClick={() => handleViewCourse(enrollment.course._id)}>
                          <BookOpen className="h-4 w-4 mr-1" />
                          Continue
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {userRole === 'teacher' && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>My Courses</CardTitle>
                  <CardDescription>Manage your created courses</CardDescription>
                </div>
                <Button onClick={() => setShowCreateModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Course
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {createdCourses.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No courses created yet. Create your first course to start teaching!
                  </p>
                ) : (
                  createdCourses.map((course) => (
                    <div key={course._id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">{course.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                            <span>Students: {course.students?.length || 0}</span>
                            <span>Price: ${course.price}</span>
                            <Badge variant={course.isPublished ? 'default' : 'secondary'}>
                              {course.isPublished ? 'Published' : 'Draft'}
                            </Badge>
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
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <CreateCourseModal 
        open={showCreateModal} 
        onClose={() => setShowCreateModal(false)}
        onCourseCreated={handleCourseCreated}
      />
    </DashboardLayout>
  );
};

export default Profile;
