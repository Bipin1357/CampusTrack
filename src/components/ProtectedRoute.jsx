import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-bg-primary">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-accent-primary border-t-transparent mb-4"></div>
        <p className="text-text-secondary font-medium">Checking access...</p>
      </div>
    );
  }

  if (!currentUser) {
    // Store intended destination to return them after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    // Logged in but wrong role -> redirect to their correct dashboard safely
    if (currentUser.role === 'student') return <Navigate to="/student" replace />;
    if (currentUser.role === 'admin') return <Navigate to="/admin" replace />;
    // Invalid role gracefully fallback
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
