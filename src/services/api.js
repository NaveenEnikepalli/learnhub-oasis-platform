
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

// User APIs
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
};

// Course APIs
export const courseAPI = {
  getAllCourses: (params) => api.get('/courses', { params }),
  getMyCourses: () => api.get('/courses/my-courses'),
  getCourse: (id) => api.get(`/courses/${id}`),
  createCourse: (formData) => api.post('/courses', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateCourse: (id, formData) => api.put(`/courses/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteCourse: (id) => api.delete(`/courses/${id}`),
  publishCourse: (id) => api.patch(`/courses/${id}/publish`),
};

// Enrollment APIs
export const enrollmentAPI = {
  getMyEnrollments: () => api.get('/enrollments/my-courses'),
  enrollInCourse: (courseId) => api.post(`/enrollments/${courseId}/enroll`),
  updateProgress: (enrollmentId, progress) => api.put(`/enrollments/${enrollmentId}/progress`, { progress }),
};

export default api;
