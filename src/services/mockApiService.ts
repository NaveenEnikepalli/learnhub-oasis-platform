
import { 
  mockCourses, 
  getCoursesByInstructor, 
  getPublishedCourses, 
  getEnrollmentsForStudent,
  searchCourses,
  createCourse,
  enrollStudent,
  deleteCourse,
  Course,
  Enrollment
} from './mockData';
import { toast } from '@/hooks/use-toast';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API responses
export const mockAPI = {
  // Course APIs
  getAllCourses: async (params?: any) => {
    await delay(500);
    const courses = params ? searchCourses(params) : getPublishedCourses();
    return { data: courses };
  },

  getCourse: async (id: string) => {
    await delay(300);
    const course = mockCourses.find(c => c._id === id);
    if (!course) {
      throw new Error('Course not found');
    }
    return { data: course };
  },

  getMyCourses: async (instructorId: string) => {
    await delay(400);
    const courses = getCoursesByInstructor(instructorId);
    return { data: courses };
  },

  createCourse: async (courseData: any, instructorId: string, instructorName: string) => {
    await delay(600);
    const newCourse = createCourse({
      ...courseData,
      instructorName
    }, instructorId);
    
    toast({
      title: "Success!",
      description: "Course created successfully",
    });
    
    return { data: newCourse };
  },

  updateCourse: async (id: string, courseData: any, instructorId: string) => {
    await delay(500);
    const courseIndex = mockCourses.findIndex(
      c => c._id === id && c.instructor === instructorId
    );
    
    if (courseIndex === -1) {
      throw new Error('Course not found or unauthorized');
    }

    mockCourses[courseIndex] = {
      ...mockCourses[courseIndex],
      ...courseData,
      updatedAt: new Date().toISOString()
    };

    toast({
      title: "Success!",
      description: "Course updated successfully",
    });

    return { data: mockCourses[courseIndex] };
  },

  deleteCourse: async (id: string, instructorId: string) => {
    await delay(400);
    const success = deleteCourse(id, instructorId);
    
    if (!success) {
      throw new Error('Course not found or unauthorized');
    }

    toast({
      title: "Success!",
      description: "Course deleted successfully",
    });

    return { data: { message: 'Course deleted successfully' } };
  },

  publishCourse: async (id: string, instructorId: string) => {
    await delay(300);
    const course = mockCourses.find(c => c._id === id && c.instructor === instructorId);
    
    if (!course) {
      throw new Error('Course not found or unauthorized');
    }

    course.isPublished = !course.isPublished;
    course.updatedAt = new Date().toISOString();

    toast({
      title: "Success!",
      description: `Course ${course.isPublished ? 'published' : 'unpublished'} successfully`,
    });

    return { data: course };
  },

  // Enrollment APIs
  getMyEnrollments: async (studentId: string) => {
    await delay(400);
    const enrollments = getEnrollmentsForStudent(studentId);
    return { data: enrollments };
  },

  enrollInCourse: async (courseId: string, studentId: string) => {
    await delay(500);
    const course = mockCourses.find(c => c._id === courseId);
    
    if (!course) {
      throw new Error('Course not found');
    }

    if (course.students.includes(studentId)) {
      throw new Error('Already enrolled in this course');
    }

    const success = enrollStudent(courseId, studentId);
    
    if (!success) {
      throw new Error('Failed to enroll');
    }

    toast({
      title: "Success!",
      description: "Successfully enrolled in the course",
    });

    return { 
      data: { 
        message: 'Enrolled successfully',
        enrollment: {
          _id: `enrollment_${studentId}_${courseId}`,
          student: studentId,
          course: course,
          enrollmentDate: new Date().toISOString(),
          progress: 0,
          status: 'enrolled',
          lastAccessed: new Date().toISOString()
        }
      }
    };
  },

  updateProgress: async (enrollmentId: string, progress: number) => {
    await delay(300);
    
    toast({
      title: "Progress Updated",
      description: `Course progress updated to ${progress}%`,
    });

    return {
      data: {
        message: 'Progress updated successfully',
        enrollment: { progress }
      }
    };
  },

  // User APIs
  getProfile: async (userId: string) => {
    await delay(300);
    return { 
      data: { 
        id: userId,
        message: 'Profile retrieved successfully' 
      } 
    };
  },

  updateProfile: async (data: any) => {
    await delay(400);
    
    toast({
      title: "Success!",
      description: "Profile updated successfully",
    });

    return { 
      data: { 
        ...data,
        message: 'Profile updated successfully' 
      } 
    };
  }
};
