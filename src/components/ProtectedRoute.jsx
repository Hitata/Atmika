import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../utils/auth';

const ProtectedRoute = ({ children }) => {
  const currentUser = authService.getCurrentUser();

  if (!currentUser) {
    // If no user is logged in, redirect to the login page
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
