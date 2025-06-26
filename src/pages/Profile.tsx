import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User, Mail, GraduationCap, BookOpen, Edit, Save, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/DashboardLayout';
import CreateCourseModal from '@/components/CreateCourseModal';
import { mockAPI } from '@/services/mockApiService';
import { Course, Enrollment } from '@/services/mockData';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<Enrollment[]>([]);
  const [createdCourses, setCreatedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    bio: user?.bio || '',
  });

  const userRole = user?.role || 'student';

  useEffect(() => {
    if (user) {
      fetchUserData();
      setProfileData({
        firstName: user.firstName,
        lastName: user.lastName,
        bio: user.bio || '',
      });
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      if (userRole === 'student') {
        const response = await mockAPI.getMyEnrollments(user._id);
        setEnrolledCourses(response.data);
      } else if (userRole === 'teacher') {
        const response = await mockAPI.getMyCourses(user._id);
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

  const handleSaveProfile = async () => {
    try {
      await updateProfile(profileData);
      setIsEditing(false);
    } catch (error) {
      console.error('Update profile error:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handleCancelEdit = () => {
    setProfileData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      bio: user?.bio || '',
    });
    setIsEditing(false);
  };

  const handleCourseCreated = async (courseData: any) => {
    try {
      if (!user) throw new Error('User not found');
      await mockAPI.createCourse(courseData, user._id);
      setShowCreateModal(false);
      fetchUserData(); // Refresh the data
      toast({
        title: "Success",
        description: "Course created successfully",
      });
    } catch (error) {
      console.error('Error creating course:', error);
      toast({
        title: "Error",
        description: "Failed to create course",
        variant: "destructive",
      });
    }
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
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center space-x-2">
                <User className="h-6 w-6" />
                <span>Profile Information</span>
              </CardTitle>
              {!isEditing ? (
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={handleCancelEdit}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleSaveProfile}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {isEditing ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={profileData.firstName}
                          onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={profileData.lastName}
                          onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={profileData.bio}
                        onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                        placeholder="Tell us about yourself..."
                        rows={3}
                      />
                    </div>
                  </>
                ) : (
                  <>
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
                    {user?.bio && (
                      <div>
                        <p className="text-sm text-gray-500">Bio</p>
                        <p className="font-medium">{user.bio}</p>
                      </div>
                    )}
                  </>
                )}
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
              <CardTitle>My Learning Journey</CardTitle>
              <CardDescription>Track your enrolled courses and progress</CardDescription>
            </CardHeader>
            <CardContent>
              {enrolledCourses.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">
                    No courses enrolled yet. Start learning by browsing our course catalog!
                  </p>
                  <Button onClick={() => window.open('/courses', '_blank')}>
                    Browse Courses
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{enrolledCourses.length}</p>
                      <p className="text-sm text-gray-600">Courses Enrolled</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">
                        {enrolledCourses.filter(e => e.status === 'completed').length}
                      </p>
                      <p className="text-sm text-gray-600">Completed</p>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <p className="text-2xl font-bold text-yellow-600">
                        {Math.round(enrolledCourses.reduce((sum, e) => sum + e.progress, 0) / enrolledCourses.length)}%
                      </p>
                      <p className="text-sm text-gray-600">Avg Progress</p>
                    </div>
                  </div>
                  
                  {enrolledCourses.map((enrollment) => (
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
                        <Button size="sm" variant="outline">
                          <BookOpen className="h-4 w-4 mr-1" />
                          Continue
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {userRole === 'teacher' && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>My Teaching Portfolio</CardTitle>
                  <CardDescription>Manage your created courses and track performance</CardDescription>
                </div>
                <Button onClick={() => setShowCreateModal(true)}>
                  Create New Course
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {createdCourses.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">
                    No courses created yet. Create your first course to start teaching!
                  </p>
                  <Button onClick={() => setShowCreateModal(true)}>
                    Create Your First Course
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{createdCourses.length}</p>
                      <p className="text-sm text-gray-600">Total Courses</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">
                        {createdCourses.filter(c => c.isPublished).length}
                      </p>
                      <p className="text-sm text-gray-600">Published</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">
                        {createdCourses.reduce((total, course) => total + (course.students?.length || 0), 0)}
                      </p>
                      <p className="text-sm text-gray-600">Total Students</p>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <p className="text-2xl font-bold text-yellow-600">
                        ${createdCourses.reduce((total, course) => total + (course.price * (course.students?.length || 0)), 0).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">Revenue</p>
                    </div>
                  </div>
                  
                  {createdCourses.map((course) => (
                    <div key={course._id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">{course.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                            <span>Students: {course.students?.length || 0}</span>
                            <span>Price: {course.price === 0 ? 'Free' : `$${course.price}`}</span>
                            <Badge variant={course.isPublished ? 'default' : 'secondary'}>
                              {course.isPublished ? 'Published' : 'Draft'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        Created: {new Date(course.createdAt).toLocaleDateString()} | 
                        Last updated: {new Date(course.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {userRole === 'admin' && (
          <Card>
            <CardHeader>
              <CardTitle>Administrator Panel</CardTitle>
              <CardDescription>System overview and administrative tools</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-600">
                  Administrative features are available in the Admin Dashboard.
                </p>
                <Button 
                  onClick={() => window.open('/dashboard/admin', '_blank')}
                  className="mt-4"
                >
                  Go to Admin Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <CreateCourseModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCourseCreated}
      />
    </DashboardLayout>
  );
};

export default Profile;
