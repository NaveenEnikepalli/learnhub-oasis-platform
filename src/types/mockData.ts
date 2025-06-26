
export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'teacher' | 'admin';
  profileImage?: string;
  bio?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

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
  materials: CourseMaterial[];
  students: string[];
  rating: {
    average: number;
    count: number;
  };
  isPublished: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CourseMaterial {
  title: string;
  type: 'video' | 'document' | 'quiz' | 'assignment';
  content: string;
  order: number;
}

export interface Enrollment {
  _id: string;
  student: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  course: Course;
  enrollmentDate: string;
  progress: number;
  status: 'enrolled' | 'in-progress' | 'completed' | 'dropped';
  completionDate: string | null;
  lastAccessed: string;
}

export interface Analytics {
  totalCourses: number;
  totalEnrollments: number;
  totalUsers: number;
  activeUsers: number;
  revenue: number;
  completionRate: number;
  popularCourses: Course[];
  recentEnrollments: Enrollment[];
}
