
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Mail, GraduationCap, BookOpen, Edit, Trash2, Eye, Award } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import DashboardLayout from '@/components/DashboardLayout';

const Profile = () => {
  const { user } = useAuth();
  
  // Mock data for now - will be replaced with real API calls
  const enrolledCourses = [
    {
      id: 1,
      title: "Complete Web Development Bootcamp",
      instructor: "John Smith",
      progress: 65,
      status: "In Progress",
      enrolledDate: "2024-01-15",
      completionDate: null
    },
    {
      id: 2,
      title: "Data Science with Python", 
      instructor: "Sarah Johnson",
      progress: 100,
      status: "Completed",
      enrolledDate: "2023-12-01",
      completionDate: "2024-01-20"
    }
  ];

  const createdCourses = [
    {
      id: 1,
      title: "Complete Web Development Bootcamp",
      students: 1542,
      revenue: 15420,
      status: "Published",
      created: "2023-11-15",
      lastUpdated: "2024-01-20"
    },
    {
      id: 2,
      title: "Advanced JavaScript Concepts",
      students: 0,
      revenue: 0,
      status: "Draft", 
      created: "2024-01-25",
      lastUpdated: "2024-01-25"
    }
  ];

  const certificates = [
    {
      id: 1,
      courseName: "Data Science with Python",
      issuedDate: "2024-01-20",
      certificateId: "DS-2024-001"
    }
  ];

  const userRole = user?.user_metadata?.role || 'student';

  const handleEditCourse = (courseId: number) => {
    console.log('Edit course:', courseId);
    // TODO: Navigate to course edit page
  };

  const handleDeleteCourse = (courseId: number) => {
    console.log('Delete course:', courseId);
    // TODO: Implement delete course API call
  };

  const handleViewCourse = (courseId: number) => {
    console.log('View course:', courseId);
    // TODO: Navigate to course view page
  };

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
                      {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}
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
                    {user?.user_metadata?.first_name?.[0]}{user?.user_metadata?.last_name?.[0]}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Role-specific Content */}
        {userRole === 'student' && (
          <Tabs defaultValue="courses" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="courses">My Courses</TabsTrigger>
              <TabsTrigger value="certificates">Certificates</TabsTrigger>
            </TabsList>

            <TabsContent value="courses" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Enrolled Courses</CardTitle>
                  <CardDescription>Track your learning progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {enrolledCourses.map((course) => (
                      <div key={course.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{course.title}</h3>
                          <Badge 
                            variant={course.status === 'Completed' ? 'default' : 'secondary'}
                          >
                            {course.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">by {course.instructor}</p>
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-500">
                            Progress: {course.progress}% | Enrolled: {course.enrolledDate}
                          </div>
                          <Button size="sm" variant="outline">
                            <BookOpen className="h-4 w-4 mr-1" />
                            Continue
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="certificates" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>My Certificates</CardTitle>
                  <CardDescription>Your earned certificates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {certificates.map((cert) => (
                      <div key={cert.id} className="border rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                          <Award className="h-8 w-8 text-yellow-500" />
                          <div className="flex-1">
                            <h3 className="font-semibold">{cert.courseName}</h3>
                            <p className="text-sm text-gray-600">
                              Issued: {cert.issuedDate} | ID: {cert.certificateId}
                            </p>
                          </div>
                          <Button size="sm" variant="outline">
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {userRole === 'teacher' && (
          <Card>
            <CardHeader>
              <CardTitle>My Courses</CardTitle>
              <CardDescription>Manage your created courses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {createdCourses.map((course) => (
                  <div key={course.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{course.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <span>Students: {course.students}</span>
                          <span>Revenue: ${course.revenue}</span>
                          <Badge variant={course.status === 'Published' ? 'default' : 'secondary'}>
                            {course.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleViewCourse(course.id)}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleEditCourse(course.id)}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600"
                          onClick={() => handleDeleteCourse(course.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      Created: {course.created} | Last updated: {course.lastUpdated}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Profile;
