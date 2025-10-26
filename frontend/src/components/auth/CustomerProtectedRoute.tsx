import React from 'react';
import { Navigate } from 'react-router-dom';
import { useCustomerAuth } from '../../hooks/useCustomerAuth';
import { LoadingSpinner } from '../index';

interface CustomerProtectedRouteProps {
  children: React.ReactNode;
}

export function CustomerProtectedRoute({ children }: CustomerProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useCustomerAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
} 