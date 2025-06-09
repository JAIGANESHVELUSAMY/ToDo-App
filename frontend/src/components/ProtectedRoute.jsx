import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const token = localStorage.getItem('authToken');
  if (!token && !isAuthenticated) return <Navigate to="/" replace />;
  if (token && !isAuthenticated) return <div>Loading session...</div>;
  return children;
};
export default ProtectedRoute;