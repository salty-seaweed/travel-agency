import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getApiUrl } from '../config';

interface HomepageData {
  hero?: any;
  features?: any[];
  testimonials?: any[];
  statistics?: any[];
  cta_section?: any;
  settings?: any;
}

export const useHomepageManagement = () => {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async (data: HomepageData) => {
      const token = localStorage.getItem('access');
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(getApiUrl('homepage/bulk_update/'), {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update homepage data');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch homepage data
      queryClient.invalidateQueries({ queryKey: ['homepage-data'] });
      queryClient.invalidateQueries({ queryKey: ['homepage-content'] });
      // Force refetch the public content immediately
      queryClient.refetchQueries({ queryKey: ['homepage-content'] });
      
      // Also invalidate any related queries
      queryClient.invalidateQueries({ queryKey: ['homepage'] });
      
      // Force a complete cache clear for homepage content
      queryClient.removeQueries({ queryKey: ['homepage-content'] });
    },
  });

  return {
    updateHomepageData: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
  };
}; 