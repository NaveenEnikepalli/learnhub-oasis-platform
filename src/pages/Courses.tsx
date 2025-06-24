
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Clock, Users, Play, Search, Filter, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Courses = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [priceRange, setPriceRange] = useState('');

  const courses = [
    {
      id: 1,
      title: "Complete Web Development Bootcamp",
      instructor: "John Smith",
      price: 99.99,
      originalPrice: 199.99,
      rating: 4.8,
      students: 15420,
      duration: "40 hours",
      level: "Beginner",
      category: "Web Development",
      image: "/placeholder.svg",
      description: "Learn HTML, CSS, JavaScript, React, Node.js and MongoDB from scratch",
      features: ["Lifetime Access", "Certificate", "30-day Money Back"],
      bestseller: true
    },
    {
      id: 2,
      title: "Data Science with Python",
      instructor: "Sarah Johnson",
      price: 149.99,
      originalPrice: 249.99,
      rating: 4.9,
      students: 8930,
      duration: "60 hours",
      level: "Intermediate",
      category: "Data Science",
      image: "/placeholder.svg",
      description: "Master data analysis, visualization, and machine learning with Python",
      features: ["Hands-on Projects", "Real Datasets", "Career Support"],
      bestseller: false
    },
    {
      id: 3,
      title: "Digital Marketing Mastery",
      instructor: "Mike Wilson",
      price: 79.99,
      originalPrice: 159.99,
      rating: 4.7,
      students: 12100,
      duration: "25 hours",
      level: "Beginner",
      category: "Marketing",
      image: "/placeholder.svg",
      description: "Complete guide to SEO, Social Media, Content Marketing, and Analytics",
      features: ["Marketing Tools", "Templates", "Live Support"],
      bestseller: true
    },
    {
      id: 4,
      title: "React.js Complete Guide",
      instructor: "Emily Davis",
      price: 89.99,
      originalPrice: 179.99,
      rating: 4.8,
      students: 9500,
      duration: "35 hours",
      level: "Intermediate",
      category: "Web Development",
      image: "/placeholder.svg",
      description: "Build modern web applications with React, Redux, and related technologies",
      features: ["Modern React", "Redux Toolkit", "Testing"],
      bestseller: false
    },
    {
      id: 5,
      title: "UI/UX Design Fundamentals",
      instructor: "Alex Chen",
      price: 119.99,
      originalPrice: 199.99,
      rating: 4.6,
      students: 7200,
      duration: "30 hours",
      level: "Beginner",
      category: "Design",
      image: "/placeholder.svg",
      description: "Learn design principles, user research, wireframing, and prototyping",
      features: ["Design Tools", "Portfolio Projects", "Industry Insights"],
      bestseller: false
    },
    {
      id: 6,
      title: "Machine Learning A-Z",
      instructor: "Dr. Robert Kim",
      price: 179.99,
      originalPrice: 299.99,
      rating: 4.9,
      students: 11300,
      duration: "80 hours",
      level: "Advanced",
      category: "Data Science",
      image: "/placeholder.svg",
      description: "Complete machine learning course covering all major algorithms and techniques",
      features: ["Python & R", "Real Projects", "Expert Support"],
      bestseller: true
    }
  ];

  const categories = ["All", "Web Development", "Data Science", "Marketing", "Design", "Business"];
  const levels = ["All", "Beginner", "Intermediate", "Advanced"];
  const priceRanges = ["All", "Free", "$0-$50", "$50-$100", "$100-$200", "$200+"];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || selectedCategory === 'All' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === '' || selectedLevel === 'All' || course.level === selectedLevel;
    
    let matchesPrice = true;
    if (priceRange && priceRange !== 'All') {
      switch (priceRange) {
        case 'Free':
          matchesPrice = course.price === 0;
          break;
        case '$0-$50':
          matchesPrice = course.price <= 50;
          break;
        case '$50-$100':
          matchesPrice = course.price > 50 && course.price <= 100;
          break;
        case '$100-$200':
          matchesPrice = course.price > 100 && course.price <= 200;
          break;
        case '$200+':
          matchesPrice = course.price > 200;
          break;
      }
    }
    
    return matchesSearch && matchesCategory && matchesLevel && matchesPrice;
  });

  const enrollInCourse = (courseId: number) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    // Simulate enrollment
    alert('Enrolled successfully! Redirecting to course...');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div 
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => navigate('/')}
            >
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">LearnHub</span>
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
                <Button 
                  onClick={() => navigate('/auth')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Explore Courses</h1>
          <p className="text-xl text-gray-600">Discover thousands of courses and expand your skills</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                {levels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger>
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                {priceRanges.map((range) => (
                  <SelectItem key={range} value={range}>
                    {range}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredCourses.length} of {courses.length} courses
          </p>
        </div>

        {/* Course Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
                <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Play className="h-16 w-16 text-white opacity-80" />
                  </div>
                  {course.bestseller && (
                    <Badge className="absolute top-4 left-4 bg-orange-500 text-white">
                      Bestseller
                    </Badge>
                  )}
                  <Badge className="absolute top-4 right-4 bg-white text-gray-900">
                    {course.level}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="mb-4">
                  <CardTitle className="text-lg mb-2 line-clamp-2">{course.title}</CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    by {course.instructor}
                  </CardDescription>
                </div>
                
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {course.description}
                </p>

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

                <div className="flex items-center mb-4">
                  <div className="flex items-center mr-2">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm font-medium">{course.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    ({course.students.toLocaleString()} students)
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-blue-600">${course.price}</span>
                    {course.originalPrice > course.price && (
                      <span className="text-lg text-gray-500 line-through">
                        ${course.originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {course.features.slice(0, 2).map((feature, index) => (
                    <div key={index} className="text-sm text-gray-600 flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      {feature}
                    </div>
                  ))}
                </div>

                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => enrollInCourse(course.id)}
                >
                  Enroll Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No courses found matching your criteria</p>
            <Button 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
                setSelectedLevel('');
                setPriceRange('');
              }}
              className="mt-4"
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
