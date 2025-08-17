import { useState, useEffect } from 'react';

export function useCustomerAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [customerData, setCustomerData] = useState<any>(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('customer_token');
      const data = localStorage.getItem('customer_data');
      
      if (token && data) {
        try {
          const parsedData = JSON.parse(data);
          setIsAuthenticated(true);
          setCustomerData(parsedData);
        } catch (error) {
          // Invalid data, clear it
          localStorage.removeItem('customer_token');
          localStorage.removeItem('customer_data');
          setIsAuthenticated(false);
          setCustomerData(null);
        }
      } else {
        setIsAuthenticated(false);
        setCustomerData(null);
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = (token: string, data: any) => {
    localStorage.setItem('customer_token', token);
    localStorage.setItem('customer_data', JSON.stringify(data));
    setIsAuthenticated(true);
    setCustomerData(data);
  };

  const logout = () => {
    localStorage.removeItem('customer_token');
    localStorage.removeItem('customer_data');
    setIsAuthenticated(false);
    setCustomerData(null);
  };

  return {
    isAuthenticated,
    isLoading,
    customerData,
    login,
    logout,
  };
} 