import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as loginService, register as registerService, logout as logoutService, getCurrentUser, isAuthenticated, updateProfile } from '../services/authService';

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
      if (process.env.NODE_ENV === 'development') {
        if (email === 'admin@example.com' && password === 'password') {
          const userData = { 
            id: '1', 
            firstName: 'Admin',
            lastName: 'User', 
            email: 'admin@example.com', 
            role: 'ADMIN' 
          };
          localStorage.setItem('token', 'mock-jwt-token-for-admin');
          localStorage.setItem('userData', JSON.stringify(userData));
          setCurrentUser(userData);
          setUserRole('ADMIN');
          return { success: true };
        } else if (email === 'landlord@example.com' && password === 'password') {
          const userData = { 
            id: '2', 
            firstName: 'Landlord',
            lastName: 'User', 
            email: 'landlord@example.com', 
            role: 'LANDLORD' 
          };
          localStorage.setItem('token', 'mock-jwt-token-for-landlord');
          localStorage.setItem('userData', JSON.stringify(userData));
          setCurrentUser(userData);
          setUserRole('LANDLORD');
          return { success: true };
        } else if (email === 'tenant@example.com' && password === 'password') {
          const userData = { 
            id: '3', 
            firstName: 'Tenant',
            lastName: 'User', 
            email: 'tenant@example.com', 
            role: 'TENANT' 
          };
          localStorage.setItem('token', 'mock-jwt-token-for-tenant');
          localStorage.setItem('userData', JSON.stringify(userData));
          setCurrentUser(userData);
          setUserRole('TENANT');
          return { success: true };
        }
      }
      
      // Use the login service for real API call
      try {
        const response = await loginService({ email, password });
        
        if (response.data) {
          const userData = getCurrentUser();
          setCurrentUser(userData);
          setUserRole(userData.role);
          return { success: true };
        }
      } catch (apiError) {
        console.error('Login API error:', apiError);
        setError(apiError.response?.data?.message || 'Invalid email or password');
        return { success: false, error: apiError.response?.data?.message || 'Invalid email or password' };
      }
      
      setError('Invalid email or password');
      return { success: false, error: 'Invalid email or password' };
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
      if (process.env.NODE_ENV === 'development') {
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        
        const newUser = { 
          id: '4', 
          firstName: userData.firstName,
          lastName: userData.lastName, 
          email: userData.email,
          role: userData.role || 'TENANT' // Default to tenant role if not specified
        };
        
        localStorage.setItem('token', 'mock-jwt-token-for-new-user');
        localStorage.setItem('userData', JSON.stringify(newUser));
        setCurrentUser(newUser);
        setUserRole(newUser.role);
        
        return { success: true };
      }
      
      // Use the register service for real API call
      try {
        const response = await registerService(userData);
        
        if (response.data) {
          const userData = getCurrentUser();
          setCurrentUser(userData);
          setUserRole(userData.role);
          return { success: true };
        }
      } catch (apiError) {
        console.error('Registration API error:', apiError);
        setError(apiError.response?.data?.message || 'Registration failed');
        return { success: false, error: apiError.response?.data?.message || 'Registration failed' };
      }
      
      setError('Registration failed');
      return { success: false, error: 'Registration failed' };
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
      
      // Clear state
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
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      setError('');
      
      // For development mode, allow test profile update without API
      if (process.env.NODE_ENV === 'development') {
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        
        // Update local user data
        const updatedUser = { ...currentUser, ...userData };
        localStorage.setItem('userData', JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
        
        if (userData.role) {
          setUserRole(userData.role);
        }
        
        return { success: true };
      }
      
      // Use the auth service for real API call
      const response = await updateProfile(userData);
      
      if (response.data) {
        const userData = getCurrentUser();
        setCurrentUser(userData);
        if (userData.role) {
          setUserRole(userData.role);
        }
        return { success: true };
      }
      
      return { success: false, error: 'Failed to update profile' };
    } catch (error) {
      console.error('Profile update error:', error);
      setError(error.message || 'Failed to update profile');
      return { success: false, error: error.message || 'Failed to update profile' };
    } finally {
      setLoading(false);
    }
  };

  // Check if user has required role
  const hasRole = (requiredRole) => {
    if (!currentUser) return false;
    
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(userRole);
    }
    
    return userRole === requiredRole;
  };
  
  const value = {
    currentUser,
    userRole,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 