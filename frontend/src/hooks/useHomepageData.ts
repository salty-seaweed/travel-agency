import { useQuery } from '@tanstack/react-query';
import { getApiUrl } from '../config';

interface HomepageData {
  hero?: any;
  features?: any[];
  testimonials?: any[];
  statistics?: any[];
  cta_section?: any;
  settings?: any;
}

export const useHomepageData = () => {
  return useQuery<HomepageData>({
    queryKey: ['homepage-data'],
    queryFn: async () => {
      const token = localStorage.getItem('access');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(getApiUrl('homepage/dashboard_data/'), {
        headers,
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch homepage data');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}; 