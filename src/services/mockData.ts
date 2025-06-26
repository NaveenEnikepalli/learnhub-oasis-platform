
import { User } from '@/types/auth';

export interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  price: number;
  duration: number;
  language: string;
  instructor: string;
  instructorName: string;
  thumbnail: string;
  students: string[];
  rating: {
    average: number;
    count: number;
  };
  isPublished: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  materials?: Array<{
    title: string;
    type: 'video' | 'document' | 'quiz' | 'assignment';
    content: string;
    order: number;
  }>;
}

export interface Enrollment {
  _id: string;
  student: string;
  course: Course;
  enrollmentDate: string;
  progress: number;
  status: 'enrolled' | 'in-progress' | 'completed' | 'dropped';
  completionDate?: string;
  lastAccessed: string;
}

// Mock courses data
export const mockCourses: Course[] = [
  {
    _id: 'course_1',
    title: 'Complete Web Development Bootcamp',
    description: 'Learn HTML, CSS, JavaScript, React, Node.js and MongoDB. Build real-world projects and become a full-stack developer.',
    category: 'Web Development',
    level: 'Beginner',
    price: 99.99,
    duration: 40,
    language: 'English',
    instructor: 'instructor_1',
    instructorName: 'John Smith',
    thumbnail: '',
    students: ['student_1', 'student_2'],
    rating: { average: 4.8, count: 1542 },
    isPublished: true,
    tags: ['HTML', 'CSS', 'JavaScript', 'React'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
    materials: [
      { title: 'Introduction to HTML', type: 'video', content: 'HTML basics', order: 1 },
      { title: 'CSS Fundamentals', type: 'video', content: 'CSS styling', order: 2 },
      { title: 'JavaScript Essentials', type: 'video', content: 'JS programming', order: 3 },
    ]
  },
  {
    _id: 'course_2',
    title: 'Data Science with Python',
    description: 'Master data analysis, visualization, and machine learning with Python. Work with real datasets and build predictive models.',
    category: 'Data Science',
    level: 'Intermediate',
    price: 149.99,
    duration: 60,
    language: 'English',
    instructor: 'instructor_2',
    instructorName: 'Sarah Johnson',
    thumbnail: '',
    students: ['student_1'],
    rating: { average: 4.9, count: 893 },
    isPublished: true,
    tags: ['Python', 'Pandas', 'Machine Learning'],
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-25T12:00:00Z',
    materials: [
      { title: 'Python Basics for Data Science', type: 'video', content: 'Python fundamentals', order: 1 },
      { title: 'Pandas DataFrames', type: 'video', content: 'Data manipulation', order: 2 },
    ]
  },
  {
    _id: 'course_3',
    title: 'Digital Marketing Mastery',
    description: 'Learn SEO, Social Media Marketing, Content Marketing, and Analytics. Build comprehensive marketing strategies.',
    category: 'Marketing',
    level: 'Beginner',
    price: 79.99,
    duration: 25,
    language: 'English',
    instructor: 'instructor_3',
    instructorName: 'Mike Wilson',
    thumbnail: '',
    students: ['student_2'],
    rating: { average: 4.7, count: 1210 },
    isPublished: true,
    tags: ['SEO', 'Social Media', 'Analytics'],
    createdAt: '2024-01-05T14:00:00Z',
    updatedAt: '2024-01-22T09:15:00Z',
  },
  {
    _id: 'course_4',
    title: 'UI/UX Design Fundamentals',
    description: 'Master the principles of user interface and user experience design. Create stunning and functional designs.',
    category: 'Design',
    level: 'Beginner',
    price: 89.99,
    duration: 35,
    language: 'English',
    instructor: 'instructor_2',
    instructorName: 'Sarah Johnson',
    thumbnail: '',
    students: [],
    rating: { average: 4.6, count: 645 },
    isPublished: true,
    tags: ['UI', 'UX', 'Figma', 'Design'],
    createdAt: '2024-01-12T11:00:00Z',
    updatedAt: '2024-01-28T16:45:00Z',
  },
  {
    _id: 'course_5',
    title: 'Advanced React Development',
    description: 'Deep dive into React hooks, context, performance optimization, and advanced patterns.',
    category: 'Web Development',
    level: 'Advanced',
    price: 129.99,
    duration: 45,
    language: 'English',
    instructor: 'instructor_1',
    instructorName: 'John Smith',
    thumbnail: '',
    students: ['student_1'],
    rating: { average: 4.9, count: 432 },
    isPublished: false,
    tags: ['React', 'Hooks', 'Performance'],
    createdAt: '2024-01-20T13:00:00Z',
    updatedAt: '2024-01-30T10:20:00Z',
  }
];

// Get courses for a specific instructor
export const getCoursesByInstructor = (instructorId: string): Course[] => {
  return mockCourses.filter(course => course.instructor === instructorId);
};

// Get published courses only
export const getPublishedCourses = (): Course[] => {
  return mockCourses.filter(course => course.isPublished);
};

// Get enrollments for a student
export const getEnrollmentsForStudent = (studentId: string): Enrollment[] => {
  const enrolledCourses = mockCourses.filter(course => 
    course.students.includes(studentId)
  );
  
  return enrolledCourses.map((course, index) => ({
    _id: `enrollment_${studentId}_${course._id}`,
    student: studentId,
    course,
    enrollmentDate: new Date(Date.now() - (index * 7 * 24 * 60 * 60 * 1000)).toISOString(),
    progress: index === 0 ? 65 : index === 1 ? 30 : 90,
    status: index === 2 ? 'completed' : 'in-progress',
    completionDate: index === 2 ? new Date().toISOString() : undefined,
    lastAccessed: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)).toISOString(),
  }));
};

// Search and filter courses
export const searchCourses = (params: {
  search?: string;
  category?: string;
  level?: string;
  priceRange?: string;
}): Course[] => {
  let filtered = getPublishedCourses();

  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filtered = filtered.filter(course => 
      course.title.toLowerCase().includes(searchLower) ||
      course.description.toLowerCase().includes(searchLower) ||
      course.instructorName.toLowerCase().includes(searchLower)
    );
  }

  if (params.category && params.category !== 'All') {
    filtered = filtered.filter(course => course.category === params.category);
  }

  if (params.level && params.level !== 'All') {
    filtered = filtered.filter(course => course.level === params.level);
  }

  if (params.priceRange && params.priceRange !== 'All') {
    filtered = filtered.filter(course => {
      switch (params.priceRange) {
        case 'Free':
          return course.price === 0;
        case '$0-$50':
          return course.price <= 50;
        case '$50-$100':
          return course.price > 50 && course.price <= 100;
        case '$100-$200':
          return course.price > 100 && course.price <= 200;
        case '$200+':
          return course.price > 200;
        default:
          return true;
      }
    });
  }

  return filtered;
};

// Create new course
export const createCourse = (courseData: Partial<Course>, instructorId: string): Course => {
  const newCourse: Course = {
    _id: `course_${Date.now()}`,
    title: courseData.title || '',
    description: courseData.description || '',
    category: courseData.category || 'Other',
    level: courseData.level || 'Beginner',
    price: courseData.price || 0,
    duration: courseData.duration || 1,
    language: courseData.language || 'English',
    instructor: instructorId,
    instructorName: courseData.instructorName || '',
    thumbnail: '',
    students: [],
    rating: { average: 0, count: 0 },
    isPublished: false,
    tags: courseData.tags || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  mockCourses.push(newCourse);
  return newCourse;
};

// Enroll student in course
export const enrollStudent = (courseId: string, studentId: string): boolean => {
  const course = mockCourses.find(c => c._id === courseId);
  if (course && !course.students.includes(studentId)) {
    course.students.push(studentId);
    return true;
  }
  return false;
};

// Delete course
export const deleteCourse = (courseId: string, instructorId: string): boolean => {
  const courseIndex = mockCourses.findIndex(
    c => c._id === courseId && c.instructor === instructorId
  );
  if (courseIndex !== -1) {
    mockCourses.splice(courseIndex, 1);
    return true;
  }
  return false;
};
