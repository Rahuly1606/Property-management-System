import React, { createContext, useState, useContext, useEffect } from 'react';
import authService, { 
  login as loginService, 
  register as registerService, 
  logout as logoutService, 
  getCurrentUser, 
  isAuthenticated, 
  updateProfile 
} from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Check if user is already logged in when app loads
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setLoading(true);
        
        if (isAuthenticated()) {
          const userData = getCurrentUser();
          if (userData) {
            setCurrentUser(userData);
            setUserRole(userData.role);
            localStorage.setItem('userRole', userData.role); // Make sure role is available in localStorage
          }
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setError('Authentication check failed');
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError('');
      
      // For development mode, allow test user logins without API
      const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      if (isDevelopment && (
          email === 'admin@example.com' || 
          email === 'landlord@example.com' || 
          email === 'tenant@example.com') && 
          password === 'password') {
        
        let role = 'TENANT';
        let firstName = 'User';
        let lastName = 'Test';
        let id = '0';
        
        if (email === 'admin@example.com') {
          role = 'ADMIN';
          firstName = 'Admin';
          id = '1';
        } else if (email === 'landlord@example.com') {
          role = 'LANDLORD';
          firstName = 'Landlord';
          id = '2';
        } else {
          role = 'TENANT';
          firstName = 'Tenant';
          id = '3';
        }
        
        const userData = { 
          id, 
          firstName,
          lastName, 
          email,
          role
        };
        
        localStorage.setItem('token', `mock-jwt-token-for-${role.toLowerCase()}`);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('userRole', role);
        
        setCurrentUser(userData);
        setUserRole(role);
        
        return { success: true, userData };
      }
      
      // Use the login service for real API call
      try {
        const response = await loginService(email, password);
        
        if (response && response.token) {
          // Get user data from response or localStorage
          const userData = getCurrentUser();
          
          if (userData) {
            // Make sure user role is set in localStorage
            localStorage.setItem('userRole', userData.role);
            
            setCurrentUser(userData);
            setUserRole(userData.role);
            return { success: true, userData };
          }
        }
        
        setError('Login failed: Invalid response from server');
        return { success: false, error: 'Invalid response from server' };
      } catch (apiError) {
        console.error('Login API error:', apiError);
        setError(apiError.response?.data?.message || 'Invalid email or password');
        return { success: false, error: apiError.response?.data?.message || 'Invalid email or password' };
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Failed to log in');
      return { success: false, error: error.message || 'Failed to log in' };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      setError('');
      
      // For development mode, allow test registration without API
      const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      if (isDevelopment && localStorage.getItem('MOCK_API') === 'true') {
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        
        const newUser = { 
          id: '4', 
          firstName: userData.firstName,
          lastName: userData.lastName, 
          email: userData.email,
          role: userData.role || 'TENANT' // Default to tenant role if not specified
        };
        
        localStorage.setItem('token', `mock-jwt-token-for-${newUser.role.toLowerCase()}`);
        localStorage.setItem('user', JSON.stringify(newUser));
        localStorage.setItem('userRole', newUser.role);
        
        setCurrentUser(newUser);
        setUserRole(newUser.role);
        
        return { success: true, userData: newUser };
      }
      
      // Use the register service for real API call
      try {
        const response = await registerService(userData);
        
        if (response.data) {
          // Store user data in localStorage if not already done by service
          if (response.data.token && !localStorage.getItem('token')) {
            localStorage.setItem('token', response.data.token);
          }
          
          // Create user object from response
          const user = {
            id: response.data.id,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            email: response.data.email,
            role: response.data.role
          };
          
          // Store in localStorage
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('userRole', user.role);
          
          setCurrentUser(user);
          setUserRole(user.role);
          
          return { success: true, userData: user };
        }
        
        setError('Registration failed: Invalid response from server');
        return { success: false, error: 'Invalid response from server' };
      } catch (apiError) {
        console.error('Registration API error:', apiError);
        setError(apiError.response?.data?.message || 'Registration failed');
        return { success: false, error: apiError.response?.data?.message || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'Failed to register');
      return { success: false, error: error.message || 'Failed to register' };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      
      await logoutService();
      
      // Clear state and localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
      
      setCurrentUser(null);
      setUserRole(null);
      setError('');
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateUserProfile = async (userData) => {
    console.log("AuthContext.updateUserProfile called with:", {
      ...userData,
      profileImage: userData.profileImage ? 
        (userData.profileImage === '' ? 'REMOVING_IMAGE' : `IMAGE_DATA (${Math.round(userData.profileImage.length / 1024)}KB)`) 
        : undefined
    });
    
    try {
      setLoading(true);
      setError('');
      
      // For development mode, allow test profile update without API
      const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      if (isDevelopment && localStorage.getItem('MOCK_API') === 'true') {
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        
        // Update local user data
        const updatedUser = { ...currentUser, ...userData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        if (userData.role && userData.role !== userRole) {
          setUserRole(userData.role);
          localStorage.setItem('userRole', userData.role);
        }
        
        setCurrentUser(updatedUser);
        console.log("Profile updated successfully (mock mode)");
        return { success: true, userData: updatedUser };
      }
      
      // Use the update profile service for real API call
      try {
        console.log("Calling updateProfile API...");
        const result = await updateProfile(userData);
        console.log("API call result:", result);
        
        if (result.success) {
          // Get the updated user data
          const updatedUser = getCurrentUser();
          console.log("Updated user data:", {
            ...updatedUser,
            profileImage: updatedUser.profileImage ? 'IMAGE_URL_PRESENT' : 'NO_IMAGE'
          });
          
          setCurrentUser(updatedUser);
          
          if (updatedUser.role && updatedUser.role !== userRole) {
            setUserRole(updatedUser.role);
            localStorage.setItem('userRole', updatedUser.role);
          }
          
          return { success: true, userData: updatedUser };
        } else {
          console.error("Profile update failed with error:", result.error);
          setError(result.error || 'Failed to update profile');
          return { success: false, error: result.error || 'Failed to update profile' };
        }
      } catch (apiError) {
        console.error('Profile update API error:', apiError);
        const errorMessage = apiError.response?.data?.message || 'Failed to update profile';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setError(error.message || 'An unexpected error occurred');
      return { success: false, error: error.message || 'An unexpected error occurred' };
    } finally {
      setLoading(false);
    }
  };

  // Check if user has required role
  const hasRole = (requiredRole) => {
    if (!userRole) return false;
    return userRole === requiredRole;
  };

  // Check if user is a landlord
  const isLandlord = () => {
    return hasRole('LANDLORD');
  };

  // Check if user is a tenant
  const isTenant = () => {
    return hasRole('TENANT');
  };

  // Check if user is an admin
  const isAdmin = () => {
    return hasRole('ADMIN');
  };

  // Check if user is authenticated
  const checkAuthenticated = () => {
    return isAuthenticated() && !!currentUser;
  };

  const value = {
    currentUser,
    userRole,
    loading,
    error,
    login,
    register,
    logout,
    updateUserProfile,
    hasRole,
    isLandlord,
    isTenant,
    isAdmin,
    isAuthenticated: checkAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 