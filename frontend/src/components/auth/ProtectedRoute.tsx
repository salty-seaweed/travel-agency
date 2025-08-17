import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks';
import { LoadingSpinner } from '../index';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/ttm/login" replace />;
  }

  return <>{children}</>;
} 