
import { Course, User } from '@/types/mockData';
import { Enrollment } from '@/services/mockData';
import { toast } from '@/hooks/use-toast';

// Enhanced mock data with persistence
class MockApiService {
  private getStoredData<T>(key: string, defaultValue: T): T {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return defaultValue;
    }
  }

  private setStoredData<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing ${key} to localStorage:`, error);
    }
  }

  private generateId(): string {
    return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Initialize with comprehensive sample data
  private initializeData(): void {
    const existingCourses = this.getStoredData('learnhub_courses', []);
    if (existingCourses.length === 0) {
      const sampleCourses: Course[] = [
        {
          _id: this.generateId(),
          title: "Complete React Development Course",
          description: "Master React from basics to advanced concepts including hooks, context, and testing. Build real-world projects and learn industry best practices.",
          category: "Web Development",
          level: "Intermediate",
          price: 89.99,
          duration: 40,
          language: "English",
          instructor: "instructor_1",
          instructorName: "Sarah Johnson",
          thumbnail: "",
          materials: [],
          students: [],
          rating: { average: 4.8, count: 156 },
          isPublished: true,
          tags: ["React", "JavaScript", "Frontend"],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: this.generateId(),
          title: "Python Data Science Fundamentals",
          description: "Learn data analysis, visualization, and machine learning with Python. Perfect for beginners wanting to enter the data science field.",
          category: "Data Science",
          level: "Beginner",
          price: 0,
          duration: 25,
          language: "English",
          instructor: "instructor_2",
          instructorName: "Dr. Michael Chen",
          thumbnail: "",
          materials: [],
          students: [],
          rating: { average: 4.6, count: 203 },
          isPublished: true,
          tags: ["Python", "Data Science", "Machine Learning"],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: this.generateId(),
          title: "Digital Marketing Mastery",
          description: "Complete digital marketing course covering SEO, social media, email marketing, and analytics. Grow your business online.",
          category: "Marketing",
          level: "Intermediate",
          price: 129.99,
          duration: 35,
          language: "English",
          instructor: "instructor_3",
          instructorName: "Emma Rodriguez",
          thumbnail: "",
          materials: [],
          students: [],
          rating: { average: 4.7, count: 89 },
          isPublished: true,
          tags: ["Marketing", "SEO", "Social Media"],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: this.generateId(),
          title: "UI/UX Design Principles",
          description: "Learn design thinking, user research, wireframing, and prototyping. Create beautiful and functional user interfaces.",
          category: "Design",
          level: "Beginner",
          price: 79.99,
          duration: 30,
          language: "English",
          instructor: "instructor_4",
          instructorName: "Alex Thompson",
          thumbnail: "",
          materials: [],
          students: [],
          rating: { average: 4.9, count: 112 },
          isPublished: true,
          tags: ["Design", "UI", "UX"],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: this.generateId(),
          title: "Business Strategy & Leadership",
          description: "Develop strategic thinking and leadership skills. Learn how to make decisions, manage teams, and drive business growth.",
          category: "Business",
          level: "Advanced",
          price: 199.99,
          duration: 50,
          language: "English",
          instructor: "instructor_5",
          instructorName: "David Wilson",
          thumbnail: "",
          materials: [],
          students: [],
          rating: { average: 4.5, count: 67 },
          isPublished: true,
          tags: ["Business", "Leadership", "Strategy"],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: this.generateId(),
          title: "Advanced JavaScript & Node.js",
          description: "Deep dive into JavaScript ES6+, async programming, and Node.js backend development. Build full-stack applications.",
          category: "Web Development",
          level: "Advanced",
          price: 149.99,
          duration: 60,
          language: "English",
          instructor: "instructor_6",
          instructorName: "James Martinez",
          thumbnail: "",
          materials: [],
          students: [],
          rating: { average: 4.8, count: 134 },
          isPublished: true,
          tags: ["JavaScript", "Node.js", "Backend"],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      this.setStoredData('learnhub_courses', sampleCourses);
    }

    const existingEnrollments = this.getStoredData('learnhub_enrollments', []);
    if (existingEnrollments.length === 0) {
      this.setStoredData('learnhub_enrollments', []);
    }
  }

  constructor() {
    this.initializeData();
  }

  // Course APIs
  async getAllCourses(params: Record<string, string> = {}): Promise<{ data: Course[] }> {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
    
    let courses = this.getStoredData<Course[]>('learnhub_courses', []);
    
    // Apply filters
    if (params.search) {
      const searchTerm = params.search.toLowerCase();
      courses = courses.filter(course => 
        course.title.toLowerCase().includes(searchTerm) ||
        course.description.toLowerCase().includes(searchTerm) ||
        course.instructorName.toLowerCase().includes(searchTerm)
      );
    }
    
    if (params.category && params.category !== 'All') {
      courses = courses.filter(course => course.category === params.category);
    }
    
    if (params.level && params.level !== 'All') {
      courses = courses.filter(course => course.level === params.level);
    }
    
    if (params.priceRange && params.priceRange !== 'All') {
      switch (params.priceRange) {
        case 'Free':
          courses = courses.filter(course => course.price === 0);
          break;
        case '$0-$50':
          courses = courses.filter(course => course.price <= 50);
          break;
        case '$50-$100':
          courses = courses.filter(course => course.price > 50 && course.price <= 100);
          break;
        case '$100-$200':
          courses = courses.filter(course => course.price > 100 && course.price <= 200);
          break;
        case '$200+':
          courses = courses.filter(course => course.price > 200);
          break;
      }
    }
    
    // Apply sorting
    if (params.sort) {
      switch (params.sort) {
        case 'price-low':
          courses.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          courses.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          courses.sort((a, b) => (b.rating?.average || 0) - (a.rating?.average || 0));
          break;
        default:
          courses.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
    }
    
    return { data: courses.filter(course => course.isPublished) };
  }

  async getMyCourses(userId: string): Promise<{ data: Course[] }> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const courses = this.getStoredData<Course[]>('learnhub_courses', []);
    const userCourses = courses.filter(course => course.instructor === userId);
    
    return { data: userCourses };
  }

  async getCourse(id: string): Promise<{ data: Course }> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const courses = this.getStoredData<Course[]>('learnhub_courses', []);
    const course = courses.find(c => c._id === id);
    
    if (!course) {
      throw new Error('Course not found');
    }
    
    return { data: course };
  }

  async createCourse(courseData: Partial<Course>, userId: string): Promise<{ data: Course }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const courses = this.getStoredData<Course[]>('learnhub_courses', []);
    const user = this.getStoredData('learnhub_user', null);
    
    const newCourse: Course = {
      _id: this.generateId(),
      title: courseData.title || '',
      description: courseData.description || '',
      category: courseData.category || '',
      level: courseData.level || 'Beginner',
      price: courseData.price || 0,
      duration: courseData.duration || 0,
      language: courseData.language || 'English',
      instructor: userId,
      instructorName: user ? `${user.firstName} ${user.lastName}` : 'Unknown Instructor',
      thumbnail: courseData.thumbnail || '',
      materials: [],
      students: [],
      rating: { average: 0, count: 0 },
      isPublished: false,
      tags: courseData.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    courses.push(newCourse);
    this.setStoredData('learnhub_courses', courses);
    
    toast({
      title: "Success!",
      description: "Course created successfully",
    });
    
    return { data: newCourse };
  }

  async updateCourse(id: string, courseData: Partial<Course>): Promise<{ data: Course }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const courses = this.getStoredData<Course[]>('learnhub_courses', []);
    const courseIndex = courses.findIndex(c => c._id === id);
    
    if (courseIndex === -1) {
      throw new Error('Course not found');
    }
    
    courses[courseIndex] = {
      ...courses[courseIndex],
      ...courseData,
      updatedAt: new Date().toISOString()
    };
    
    this.setStoredData('learnhub_courses', courses);
    
    toast({
      title: "Success!",
      description: "Course updated successfully",
    });
    
    return { data: courses[courseIndex] };
  }

  async deleteCourse(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const courses = this.getStoredData<Course[]>('learnhub_courses', []);
    const filteredCourses = courses.filter(c => c._id !== id);
    
    // Also remove related enrollments
    const enrollments = this.getStoredData<Enrollment[]>('learnhub_enrollments', []);
    const filteredEnrollments = enrollments.filter(e => e.course._id !== id);
    
    this.setStoredData('learnhub_courses', filteredCourses);
    this.setStoredData('learnhub_enrollments', filteredEnrollments);
    
    toast({
      title: "Success!",
      description: "Course deleted successfully",
    });
  }

  async publishCourse(id: string): Promise<{ data: Course }> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const courses = this.getStoredData<Course[]>('learnhub_courses', []);
    const courseIndex = courses.findIndex(c => c._id === id);
    
    if (courseIndex === -1) {
      throw new Error('Course not found');
    }
    
    courses[courseIndex].isPublished = !courses[courseIndex].isPublished;
    courses[courseIndex].updatedAt = new Date().toISOString();
    
    this.setStoredData('learnhub_courses', courses);
    
    const status = courses[courseIndex].isPublished ? 'published' : 'unpublished';
    toast({
      title: "Success!",
      description: `Course ${status} successfully`,
    });
    
    return { data: courses[courseIndex] };
  }

  // Enrollment APIs
  async getMyEnrollments(userId: string): Promise<{ data: Enrollment[] }> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const enrollments = this.getStoredData<Enrollment[]>('learnhub_enrollments', []);
    const userEnrollments = enrollments.filter(e => e.student._id === userId);
    
    return { data: userEnrollments };
  }

  async enrollInCourse(courseId: string, userId: string): Promise<{ data: Enrollment }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const courses = this.getStoredData<Course[]>('learnhub_courses', []);
    const enrollments = this.getStoredData<Enrollment[]>('learnhub_enrollments', []);
    const user = this.getStoredData('learnhub_user', null);
    
    const course = courses.find(c => c._id === courseId);
    if (!course) {
      throw new Error('Course not found');
    }
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Check if already enrolled
    const existingEnrollment = enrollments.find(e => 
      e.student._id === userId && e.course._id === courseId
    );
    
    if (existingEnrollment) {
      throw new Error('Already enrolled in this course');
    }
    
    const newEnrollment: Enrollment = {
      _id: this.generateId(),
      student: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      },
      course: course,
      enrollmentDate: new Date().toISOString(),
      progress: 0,
      status: 'enrolled',
      completionDate: null,
      lastAccessed: new Date().toISOString()
    };
    
    enrollments.push(newEnrollment);
    this.setStoredData('learnhub_enrollments', enrollments);
    
    // Update course students count
    const courseIndex = courses.findIndex(c => c._id === courseId);
    if (courseIndex !== -1) {
      if (!courses[courseIndex].students) {
        courses[courseIndex].students = [];
      }
      courses[courseIndex].students.push(userId);
      this.setStoredData('learnhub_courses', courses);
    }
    
    toast({
      title: "Success!",
      description: `Enrolled in "${course.title}" successfully`,
    });
    
    return { data: newEnrollment };
  }

  async updateProgress(enrollmentId: string, progress: number): Promise<{ data: Enrollment }> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const enrollments = this.getStoredData<Enrollment[]>('learnhub_enrollments', []);
    const enrollmentIndex = enrollments.findIndex(e => e._id === enrollmentId);
    
    if (enrollmentIndex === -1) {
      throw new Error('Enrollment not found');
    }
    
    enrollments[enrollmentIndex].progress = progress;
    enrollments[enrollmentIndex].lastAccessed = new Date().toISOString();
    
    if (progress >= 100) {
      enrollments[enrollmentIndex].status = 'completed';
      enrollments[enrollmentIndex].completionDate = new Date().toISOString();
    } else if (progress > 0) {
      enrollments[enrollmentIndex].status = 'in-progress';
    }
    
    this.setStoredData('learnhub_enrollments', enrollments);
    
    return { data: enrollments[enrollmentIndex] };
  }

  // Analytics for admin dashboard
  async getAnalytics(): Promise<{ data: any }> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const courses = this.getStoredData<Course[]>('learnhub_courses', []);
    const enrollments = this.getStoredData<Enrollment[]>('learnhub_enrollments', []);
    const users = this.getStoredData('learnhub_users', []);
    
    return {
      data: {
        totalCourses: courses.length,
        totalEnrollments: enrollments.length,
        totalUsers: users.length,
        activeUsers: users.length, // Mock active users
        revenue: enrollments.reduce((sum, e) => sum + (e.course.price || 0), 0),
        completionRate: enrollments.length > 0 
          ? (enrollments.filter(e => e.status === 'completed').length / enrollments.length) * 100 
          : 0,
        popularCourses: courses
          .sort((a, b) => (b.students?.length || 0) - (a.students?.length || 0))
          .slice(0, 5),
        recentEnrollments: enrollments
          .sort((a, b) => new Date(b.enrollmentDate).getTime() - new Date(a.enrollmentDate).getTime())
          .slice(0, 10)
      }
    };
  }
}

export const mockAPI = new MockApiService();
