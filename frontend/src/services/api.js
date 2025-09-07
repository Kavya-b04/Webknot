import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
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

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  // Admin auth
  adminSignup: (data) => api.post('/auth/admin/signup', data),
  adminLogin: (data) => api.post('/auth/admin/login', data),
  
  // Student auth
  studentSignup: (data) => api.post('/auth/student/signup', data),
  studentLogin: (data) => api.post('/auth/student/login', data),
};

// Events API
export const eventsAPI = {
  getEventsByCollege: (collegeId) => api.get(`/events/${collegeId}`),
  getAllEvents: () => api.get('/events'),
  getEventById: (id) => api.get(`/events/single/${id}`),
  createEvent: (data) => api.post('/events', data),
  updateEvent: (id, data) => api.put(`/events/${id}`, data),
  deleteEvent: (id) => api.delete(`/events/${id}`),
  getEventStats: (id) => api.get(`/events/stats/${id}`),
};

// Registrations API
export const registrationsAPI = {
  registerForEvent: (eventId) => api.post(`/registrations/${eventId}`),
  getStudentRegistrations: () => api.get('/registrations/student'),
  getEventRegistrations: (eventId) => api.get(`/registrations/event/${eventId}`),
  cancelRegistration: (eventId) => api.delete(`/registrations/${eventId}`),
};

// Attendance API
export const attendanceAPI = {
  markAttendance: (eventId, studentId, data) => api.post(`/attendance/${eventId}/${studentId}`, data),
  getEventAttendance: (eventId) => api.get(`/attendance/event/${eventId}`),
  getStudentAttendance: () => api.get('/attendance/student'),
  getAttendanceStats: (eventId) => api.get(`/attendance/stats/${eventId}`),
};

// Feedback API
export const feedbackAPI = {
  submitFeedback: (eventId, data) => api.post(`/feedback/${eventId}`, data),
  getEventFeedback: (eventId) => api.get(`/feedback/event/${eventId}`),
  getStudentFeedback: () => api.get('/feedback/student'),
  getFeedbackStats: (eventId) => api.get(`/feedback/stats/${eventId}`),
};

// Reports API
export const reportsAPI = {
  getPopularityReport: () => api.get('/reports/popularity'),
  getAttendanceReport: (eventId) => api.get(`/reports/attendance/${eventId}`),
  getFeedbackReport: (eventId) => api.get(`/reports/feedback/${eventId}`),
  getStudentReport: (studentId) => api.get(`/reports/student/${studentId}`),
  getTopStudentsReport: () => api.get('/reports/top-students'),
  getDashboardReport: () => api.get('/reports/dashboard'),
};

export default api;
