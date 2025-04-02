import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Create axios instance with credentials
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle case where response doesn't exist (CORS error or network issue)
    if (!error.response) {
      console.error('Network error or CORS issue:', error.message);
      return Promise.reject(new Error('Network error or CORS issue. Please check if the backend server is running.'));
    }

    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await axios.post(`${API_URL}/auth/refresh-token`, {}, { withCredentials: true });
        localStorage.setItem('token', refreshResponse.data.accessToken);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If refresh fails, logout
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

const authService = {
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      if (response.data.accessToken) {
        localStorage.setItem('token', response.data.accessToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  register: async (userData) => {
    try {
      return await axios.post(`${API_URL}/auth/register`, userData);
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  getUserRole: () => {
    const user = authService.getCurrentUser();
    return user ? user.role : null;
  },

  isAdmin: () => {
    const role = authService.getUserRole();
    return role === 'ADMIN';
  },

  isLandlord: () => {
    const role = authService.getUserRole();
    return role === 'LANDLORD';
  },

  isTenant: () => {
    const role = authService.getUserRole();
    return role === 'TENANT';
  },

  getUserProfile: async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}/users/profile`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateUserProfile: async (profileData) => {
    try {
      const response = await axiosInstance.put(`${API_URL}/users/profile`, profileData);
      // Update stored user data if profile is updated
      if (response.data) {
        const currentUser = authService.getCurrentUser();
        const updatedUser = { ...currentUser, ...response.data };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  changePassword: async (passwordData) => {
    try {
      return await axiosInstance.put(`${API_URL}/users/change-password`, passwordData);
    } catch (error) {
      throw error;
    }
  }
};

// Extract individual functions for named exports
const login = authService.login;
const register = authService.register;
const logout = authService.logout;
const getCurrentUser = authService.getCurrentUser;
const isAuthenticated = authService.isAuthenticated;
const getToken = authService.getToken;
const getUserRole = authService.getUserRole;
const isAdmin = authService.isAdmin;
const isLandlord = authService.isLandlord;
const isTenant = authService.isTenant;
const getUserProfile = authService.getUserProfile;
const updateProfile = authService.updateUserProfile;
const changePassword = authService.changePassword;

export default authService;
export {
  login,
  register,
  logout,
  getCurrentUser,
  isAuthenticated,
  getToken,
  getUserRole,
  isAdmin,
  isLandlord,
  isTenant,
  getUserProfile,
  updateProfile,
  changePassword,
  axiosInstance
}; 