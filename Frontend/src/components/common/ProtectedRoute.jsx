import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { currentUser, userRole, loading } = useAuth();
  
  // While checking authentication status, show nothing
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  // Check if user is logged in
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  // Check if user has required role
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  // If all checks pass, render the child routes
  return <Outlet />;
};

export default ProtectedRoute; 