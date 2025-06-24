
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Clock, Award, Star, Play, Calendar, MessageSquare, User, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';

const StudentDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const enrolledCourses = [
    {
      id: 1,
      title: "Complete Web Development Bootcamp",
      instructor: "John Smith",
      progress: 65,
      totalLessons: 120,
      completedLessons: 78,
      nextLesson: "Advanced React Hooks",
      timeLeft: "2 weeks",
      image: "/placeholder.svg"
    },
    {
      id: 2,
      title: "Data Science with Python",
      instructor: "Sarah Johnson",
      progress: 30,
      totalLessons: 90,
      completedLessons: 27,
      nextLesson: "Pandas DataFrames",
      timeLeft: "6 weeks",
      image: "/placeholder.svg"
    },
    {
      id: 3,
      title: "Digital Marketing Mastery",
      instructor: "Mike Wilson",
      progress: 90,
      totalLessons: 50,
      completedLessons: 45,
      nextLesson: "Analytics Setup",
      timeLeft: "3 days",
      image: "/placeholder.svg"
    }
  ];

  const achievements = [
    { title: "First Course Completed", date: "2024-01-15", icon: Award },
    { title: "7-Day Streak", date: "2024-01-20", icon: Calendar },
    { title: "Top Performer", date: "2024-01-25", icon: Star },
  ];

  const recentActivity = [
    { action: "Completed lesson", course: "Web Development", time: "2 hours ago" },
    { action: "Started new course", course: "Data Science", time: "1 day ago" },
    { action: "Earned certificate", course: "Digital Marketing", time: "3 days ago" },
  ];

  const stats = [
    { label: "Courses Enrolled", value: "3", icon: BookOpen },
    { label: "Hours Learned", value: "127", icon: Clock },
    { label: "Certificates", value: "2", icon: Award },
    { label: "Course Rating", value: "4.8", icon: Star },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.user_metadata?.first_name}!
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                        <CardDescription>by {course.instructor}</CardDescription>
                      </div>
                      <Badge variant="secondary">{course.progress}%</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Next: {course.nextLesson}</p>
                      <p className="text-sm text-gray-600">Time left: {course.timeLeft}</p>
                    </div>
                    <Button className="w-full" size="sm">
                      <Play className="h-4 w-4 mr-2" />
                      Continue Learning
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <h2 className="text-2xl font-bold">Learning Progress</h2>
            <div className="space-y-6">
              {enrolledCourses.map((course) => (
                <Card key={course.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold">{course.title}</h3>
                        <p className="text-sm text-gray-600">by {course.instructor}</p>
                      </div>
                      <Badge variant="outline">{course.progress}% Complete</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Lessons Completed</span>
                        <span>{course.completedLessons} of {course.totalLessons}</span>
                      </div>
                      <Progress value={course.progress} className="h-3" />
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Next: {course.nextLesson}
                      </span>
                      <Button size="sm">Continue</Button>
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
              {recentActivity.map((activity, index) => (
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
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
