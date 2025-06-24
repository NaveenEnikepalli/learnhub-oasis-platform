
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, Award, Star, Play, Clock, UserCheck, GraduationCap, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const featuredCourses = [
    {
      id: 1,
      title: "Complete Web Development Bootcamp",
      instructor: "John Smith",
      price: 99.99,
      rating: 4.8,
      students: 15420,
      duration: "40 hours",
      level: "Beginner",
      image: "/placeholder.svg",
      description: "Learn HTML, CSS, JavaScript, React, Node.js and MongoDB"
    },
    {
      id: 2,
      title: "Data Science with Python",
      instructor: "Sarah Johnson",
      price: 149.99,
      rating: 4.9,
      students: 8930,
      duration: "60 hours",
      level: "Intermediate",
      image: "/placeholder.svg",
      description: "Master data analysis, visualization, and machine learning"
    },
    {
      id: 3,
      title: "Digital Marketing Mastery",
      instructor: "Mike Wilson",
      price: 79.99,
      rating: 4.7,
      students: 12100,
      duration: "25 hours",
      level: "Beginner",
      image: "/placeholder.svg",
      description: "SEO, Social Media, Content Marketing, and Analytics"
    }
  ];

  const stats = [
    { icon: Users, label: "Active Students", value: "50,000+" },
    { icon: BookOpen, label: "Courses Available", value: "1,200+" },
    { icon: UserCheck, label: "Expert Instructors", value: "500+" },
    { icon: Award, label: "Certificates Issued", value: "25,000+" }
  ];

  const features = [
    {
      icon: GraduationCap,
      title: "Expert-Led Courses",
      description: "Learn from industry professionals with years of experience"
    },
    {
      icon: Play,
      title: "Interactive Learning",
      description: "Hands-on projects, quizzes, and practical assignments"
    },
    {
      icon: Award,
      title: "Certification",
      description: "Earn recognized certificates upon course completion"
    },
    {
      icon: Shield,
      title: "Lifetime Access",
      description: "Access your courses anytime, anywhere, forever"
    }
  ];

  const handleGetStarted = () => {
    if (user) {
      const role = user.user_metadata?.role || 'student';
      navigate(`/dashboard/${role}`);
    } else {
      navigate('/auth');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">LearnHub</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/courses" className="text-gray-600 hover:text-blue-600 transition-colors">Courses</Link>
              <Link to="/instructors" className="text-gray-600 hover:text-blue-600 transition-colors">Instructors</Link>
              <Link to="/about" className="text-gray-600 hover:text-blue-600 transition-colors">About</Link>
              <Link to="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</Link>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <Button 
                  onClick={() => navigate(`/dashboard/${user.user_metadata?.role || 'student'}`)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Dashboard
                </Button>
              ) : (
                <>
                  <Link to="/auth">
                    <Button variant="outline">Sign In</Button>
                  </Link>
                  <Link to="/auth">
                    <Button className="bg-blue-600 hover:bg-blue-700">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Learn Without
              <span className="text-blue-600 block">Limits</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Unlock your potential with our comprehensive online learning platform. 
              Access thousands of courses, learn from experts, and advance your career.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={handleGetStarted}
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4"
              >
                Start Learning Today
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-4"
                onClick={() => navigate('/courses')}
              >
                Explore Courses
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Courses</h2>
            <p className="text-xl text-gray-600">Discover our most popular and highly-rated courses</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="p-0">
                  <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Play className="h-16 w-16 text-white opacity-80" />
                    </div>
                    <Badge className="absolute top-4 left-4 bg-white text-gray-900">
                      {course.level}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle className="text-lg mb-2 line-clamp-2">{course.title}</CardTitle>
                  <CardDescription className="text-sm text-gray-600 mb-4">
                    {course.description}
                  </CardDescription>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {course.duration}
                    </span>
                    <span className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {course.students.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm font-medium">{course.rating}</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">${course.price}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button 
              onClick={() => navigate('/courses')}
              variant="outline" 
              size="lg"
            >
              View All Courses
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose LearnHub?</h2>
            <p className="text-xl text-gray-600">Experience the best in online education</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of learners who are already advancing their careers with LearnHub
          </p>
          <Button 
            onClick={handleGetStarted}
            size="lg" 
            className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4"
          >
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <GraduationCap className="h-8 w-8 text-blue-400" />
                <span className="text-2xl font-bold">LearnHub</span>
              </div>
              <p className="text-gray-400">
                Empowering learners worldwide with quality education and expert instruction.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Learn</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/courses" className="hover:text-white transition-colors">Courses</Link></li>
                <li><Link to="/instructors" className="hover:text-white transition-colors">Instructors</Link></li>
                <li><Link to="/certificates" className="hover:text-white transition-colors">Certificates</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 LearnHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
