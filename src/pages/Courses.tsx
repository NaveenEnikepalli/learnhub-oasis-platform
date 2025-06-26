
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Clock, Users, Play, Search, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { mockAPI } from '@/services/mockApiService';
import { Course } from '@/types/mockData';

const Courses = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [sortBy, setSortBy] = useState('');

  const categories = ["All", "Web Development", "Data Science", "Marketing", "Design", "Business"];
  const levels = ["All", "Beginner", "Intermediate", "Advanced"];
  const priceRanges = ["All", "Free", "$0-$50", "$50-$100", "$100-$200", "$200+"];
  const sortOptions = [
    { value: "", label: "Newest First" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" }
  ];

  useEffect(() => {
    fetchCourses();
  }, [searchTerm, selectedCategory, selectedLevel, priceRange, sortBy]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params: Record<string, string> = {};
      
      if (searchTerm) params.search = searchTerm;
      if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedLevel && selectedLevel !== 'All') params.level = selectedLevel;
      if (priceRange && priceRange !== 'All') params.priceRange = priceRange;
      if (sortBy) params.sort = sortBy;

      const response = await mockAPI.getAllCourses(params);
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

  const enrollInCourse = async (courseId: string) => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to enroll in courses",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    if (user.role !== 'student') {
      toast({
        title: "Access Denied",
        description: "Only students can enroll in courses",
        variant: "destructive",
      });
      return;
    }

    try {
      await mockAPI.enrollInCourse(courseId, user._id);
      // Refresh courses to update student count
      fetchCourses();
    } catch (error: any) {
      console.error('Enrollment error:', error);
      toast({
        title: "Enrollment Failed",
        description: error.message || "Failed to enroll in course",
        variant: "destructive",
      });
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedLevel('');
    setPriceRange('');
    setSortBy('');
  };

  const handleViewCourse = (courseId: string) => {
    // In a real app, this would navigate to course details page
    toast({
      title: "Course Preview",
      description: "Course details page would open here",
    });
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
                <>
                  <Button 
                    variant="outline"
                    onClick={() => navigate(`/dashboard/${user.role}`)}
                  >
                    Dashboard
                  </Button>
                  <div className="flex items-center space-x-2">
                    <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium text-sm">
                        {user.firstName?.[0]}{user.lastName?.[0]}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {user.firstName} {user.lastName}
                    </span>
                  </div>
                </>
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
          <p className="text-xl text-gray-600">Discover courses and expand your skills with our comprehensive catalog</p>
        </div>

        {/* Enhanced Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {(searchTerm || selectedCategory || selectedLevel || priceRange || sortBy) && (
            <div className="mt-4">
              <Button onClick={clearFilters} variant="outline" size="sm">
                Clear All Filters
              </Button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {loading ? 'Loading...' : `Showing ${courses.length} courses`}
          </p>
        </div>

        {/* Course Grid */}
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <Card key={course._id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Play className="h-16 w-16 text-white opacity-80" />
                    </div>
                    <Badge className="absolute top-4 right-4 bg-white text-gray-900">
                      {course.level}
                    </Badge>
                    <Badge className="absolute top-4 left-4 bg-blue-600 text-white">
                      {course.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="mb-4">
                    <CardTitle className="text-lg mb-2 line-clamp-2 min-h-[3.5rem]">
                      {course.title}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600">
                      by {course.instructorName}
                    </CardDescription>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3 min-h-[4rem]">
                    {course.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {course.duration}h
                    </span>
                    <span className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {course.students?.length || 0} students
                    </span>
                  </div>

                  <div className="flex items-center mb-4">
                    <div className="flex items-center mr-2">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm font-medium">
                        {course.rating?.average || 0}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      ({course.rating?.count || 0} reviews)
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-blue-600">
                        {course.price === 0 ? 'Free' : `$${course.price}`}
                      </span>
                      {course.price > 0 && (
                        <span className="text-sm text-gray-500 line-through">
                          ${(course.price * 1.5).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="text-sm text-gray-600 flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      {course.language} Language
                    </div>
                    {course.tags && course.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {course.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => enrollInCourse(course._id)}
                      disabled={!user || user.role !== 'student'}
                    >
                      {!user 
                        ? 'Sign In to Enroll' 
                        : user.role !== 'student' 
                          ? 'Student Access Only' 
                          : 'Enroll Now'
                      }
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleViewCourse(course._id)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && courses.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or browse all courses
            </p>
            <Button 
              onClick={clearFilters}
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
