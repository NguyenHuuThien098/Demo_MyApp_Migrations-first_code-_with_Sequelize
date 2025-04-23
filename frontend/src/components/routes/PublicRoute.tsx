import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

/**
 * PublicRoute component
 * Redirects authenticated users away from routes they shouldn't access when logged in
 * For example: login and register pages
 */
const PublicRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // If user is already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // User is not authenticated, allow access to public route
  return <Outlet />;
};

export default PublicRoute;