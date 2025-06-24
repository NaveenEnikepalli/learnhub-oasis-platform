
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Users, DollarSign, TrendingUp, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import CreateCourseModal from '@/components/CreateCourseModal';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const courses = [
    {
      id: 1,
      title: "Complete Web Development Bootcamp",
      status: "Published",
      students: 1542,
      revenue: 15420,
      rating: 4.8,
      lessons: 120,
      created: "2023-11-15",
      lastUpdated: "2024-01-20"
    },
    {
      id: 2,
      title: "Advanced JavaScript Concepts",
      status: "Draft",
      students: 0,
      revenue: 0,
      rating: 0,
      lessons: 45,
      created: "2024-01-25",
      lastUpdated: "2024-01-25"
    },
    {
      id: 3,
      title: "React.js Masterclass",
      status: "Published",
      students: 892,
      revenue: 8920,
      rating: 4.9,
      lessons: 80,
      created: "2023-12-10",
      lastUpdated: "2024-01-18"
    }
  ];

  const stats = [
    { label: "Total Courses", value: "3", icon: BookOpen, change: "+1" },
    { label: "Total Students", value: "2,434", icon: Users, change: "+123" },
    { label: "Total Revenue", value: "$24,340", icon: DollarSign, change: "+$1,240" },
    { label: "Average Rating", value: "4.85", icon: TrendingUp, change: "+0.1" },
  ];

  const recentEnrollments = [
    { student: "John Doe", course: "Web Development Bootcamp", date: "2024-01-25", amount: "$99" },
    { student: "Jane Smith", course: "React.js Masterclass", date: "2024-01-24", amount: "$79" },
    { student: "Mike Johnson", course: "Web Development Bootcamp", date: "2024-01-23", amount: "$99" },
    { student: "Sarah Wilson", course: "React.js Masterclass", date: "2024-01-22", amount: "$79" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published': return 'bg-green-100 text-green-800';
      case 'Draft': return 'bg-yellow-100 text-yellow-800';
      case 'Under Review': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">
            Welcome, {user?.user_metadata?.first_name}!
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
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
              {courses.map((course) => (
                <Card key={course.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold">{course.title}</h3>
                          <Badge className={getStatusColor(course.status)}>
                            {course.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>Students: {course.students.toLocaleString()}</div>
                          <div>Revenue: ${course.revenue.toLocaleString()}</div>
                          <div>Rating: {course.rating > 0 ? course.rating : 'No ratings'}</div>
                          <div>Lessons: {course.lessons}</div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      Created: {course.created} | Last updated: {course.lastUpdated}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold">Course Analytics</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trends</CardTitle>
                  <CardDescription>Monthly revenue from all courses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                    <p className="text-gray-500">Revenue chart would go here</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Student Enrollments</CardTitle>
                  <CardDescription>New enrollments over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                    <p className="text-gray-500">Enrollment chart would go here</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <h2 className="text-2xl font-bold">Recent Enrollments</h2>
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr>
                        <th className="text-left p-4 font-medium">Student</th>
                        <th className="text-left p-4 font-medium">Course</th>
                        <th className="text-left p-4 font-medium">Date</th>
                        <th className="text-left p-4 font-medium">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentEnrollments.map((enrollment, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-4">{enrollment.student}</td>
                          <td className="p-4">{enrollment.course}</td>
                          <td className="p-4">{enrollment.date}</td>
                          <td className="p-4 font-medium text-green-600">{enrollment.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <CreateCourseModal 
        open={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
      />
    </DashboardLayout>
  );
};

export default TeacherDashboard;
