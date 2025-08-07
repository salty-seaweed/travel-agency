import { useState, useEffect } from 'react';
import { isAuthenticated, logout } from '../api';

export function useAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      setIsAuth(authenticated);
      setIsLoading(false);
      
      if (!authenticated) {
        // Clear any stale tokens
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
      }
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    logout();
  };

  return {
    isAuthenticated: isAuth,
    isLoading,
    logout: handleLogout,
  };
} 