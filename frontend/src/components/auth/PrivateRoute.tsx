import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface PrivateRouteProps {
  allowedRoles?: string[];
}

/**
 * PrivateRoute component to protect routes based on authentication status and role
 * 
 * @param allowedRoles - Optional array of roles allowed to access the route
 */
const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  
  // If authentication is still loading, show a loading spinner
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If roles are specified and user doesn't have the required role, redirect to unauthorized
  if (allowedRoles && allowedRoles.length > 0) {
    if (!user || !allowedRoles.includes(user.role)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }
  
  // If authenticated and authorized, render the child routes
  return <Outlet />;
};

export default PrivateRoute;