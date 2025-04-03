import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Create axios instance with credentials
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
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
        localStorage.setItem('token', refreshResponse.data.token);
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
      console.log('Login attempt for:', email);
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      console.log('Login response:', response.data);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify({
          id: response.data.id,
          email: response.data.email,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          role: response.data.role,
          phoneNumber: response.data.phoneNumber,
          profileImage: response.data.profileImage,
          address: response.data.address
        }));
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (userData) => {
    try {
      console.log('Registering user with data:', userData);
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      console.log('Registration response:', response.data);
      
      // If the registration response includes a token, store it
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify({
          id: response.data.id,
          email: response.data.email,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          phoneNumber: response.data.phoneNumber,
          address: response.data.address,
          role: response.data.role,
          profileImage: response.data.profileImage
        }));
      }
      return response;
    } catch (error) {
      console.error('Registration error:', error);
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
      const response = await axiosInstance.get(`${API_URL}/users/me`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  },

  updateUserProfile: async (profileData) => {
    try {
      // Get current user ID
      const currentUser = authService.getCurrentUser();
      if (!currentUser || !currentUser.id) {
        throw new Error("User ID not found");
      }
      
      console.log("Updating profile with data:", {
        ...profileData,
        profileImage: profileData.profileImage ? 
          (typeof profileData.profileImage === 'string' && profileData.profileImage.startsWith('data:image') ? 
            '[BASE64_IMAGE_DATA]' : profileData.profileImage) : undefined
      });
      
      // Send profile data directly in the request body instead of URL parameters
      // This avoids URL length limitations and encoding issues with base64 data
      const response = await axiosInstance.post(
        `${API_URL}/users/${currentUser.id}/profile`, 
        profileData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Update stored user data if profile is updated
      if (response.data) {
        console.log("Profile updated successfully, received:", {
          ...response.data,
          profileImage: response.data.profileImage ? '[IMAGE_URL]' : null
        });
        
        const updatedUser = { 
          ...currentUser, 
          firstName: response.data.firstName || currentUser.firstName,
          lastName: response.data.lastName || currentUser.lastName,
          phoneNumber: response.data.phoneNumber || currentUser.phoneNumber,
          address: response.data.address || currentUser.address,
          profileImage: response.data.profileImage || currentUser.profileImage
        };
        
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error("Error updating user profile:", error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || "Failed to update profile"
      };
    }
  },

  changePassword: async (passwordData) => {
    try {
      // Get current user ID
      const currentUser = authService.getCurrentUser();
      if (!currentUser || !currentUser.id) {
        throw new Error("User ID not found");
      }

      console.log("Changing password for user ID:", currentUser.id);
      
      // The endpoint expects path parameters instead of a JSON body
      const response = await axiosInstance.put(
        `${API_URL}/users/${currentUser.id}/password`, 
        null, 
        { 
          params: {
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error("Error changing password:", error);
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

// Export the axios instance for use in other services
export { axiosInstance };

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
  changePassword
}; 