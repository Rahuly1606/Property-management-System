import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: '/api', // This will be prepended to all request URLs
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
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

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    
    // Handle authentication errors
    if (response && response.status === 401) {
      // Clear local storage and reload page
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      window.location.href = '/login';
    }
    
    // Handle server errors
    if (response && response.status >= 500) {
      console.error('Server error:', response.data);
    }
    
    return Promise.reject(error);
  }
);

export default api; 