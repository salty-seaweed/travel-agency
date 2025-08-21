// Modern React Query hooks for data fetching
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys, invalidateQueries } from '../lib/query-client';
import { unifiedApi } from '../services/unified-api';
import type { 
  Property, 
  Package, 
  Review, 
  PropertyFilters, 
  PackageFilters,
  ExperienceFilters,
  PropertyFormData,
  PackageFormData,
  ReviewFormData,
  Destination,
  Experience
} from '../types';

// Optimized default query options for better performance
const defaultQueryOptions = {
  staleTime: 10 * 60 * 1000, // 10 minutes - increased from 5
  gcTime: 30 * 60 * 1000, // 30 minutes - increased from 10
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  refetchOnReconnect: true,
  retry: 1, // Reduced from 2 for faster failure
  retryDelay: (attemptIndex: number) => Math.min(500 * 2 ** attemptIndex, 5000), // Faster retry
};

// Critical data options - for above-the-fold content
const criticalQueryOptions = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 15 * 60 * 1000, // 15 minutes
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  refetchOnReconnect: true,
  retry: 2,
  retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 10000),
};

// Properties hooks
export const useProperties = (filters?: PropertyFilters) => {
  return useQuery({
    queryKey: queryKeys.properties.list(filters),
    queryFn: () => unifiedApi.properties.getAll(filters),
    ...defaultQueryOptions,
  });
};

export const useFeaturedProperties = () => {
  const query = useQuery({
    queryKey: queryKeys.properties.featured(),
    queryFn: () => {
      console.log('🔍 [MOBILE DEBUG] Fetching featured properties...');
      return unifiedApi.properties.getFeatured();
    },
    staleTime: 30 * 60 * 1000, // 30 minutes for featured content
    gcTime: 60 * 60 * 1000, // 1 hour
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
    // Add placeholder data for better perceived performance
    placeholderData: (previousData) => previousData,
  });

  // Debug logging
  if (query.isSuccess) {
    console.log('✅ [MOBILE DEBUG] Featured properties loaded:', query.data?.length || 0, 'items');
  }
  if (query.isError) {
    console.error('❌ [MOBILE DEBUG] Featured properties error:', query.error);
  }

  return query;
};

export const useProperty = (id: number) => {
  return useQuery({
    queryKey: queryKeys.properties.detail(id),
    queryFn: () => unifiedApi.properties.getById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const usePropertyReviews = (propertyId: number) => {
  return useQuery({
    queryKey: queryKeys.properties.reviews(propertyId),
    queryFn: () => unifiedApi.properties.getReviews(propertyId),
    enabled: !!propertyId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Packages hooks
export const usePackages = (filters?: PackageFilters) => {
  return useQuery({
    queryKey: queryKeys.packages.list(filters),
    queryFn: () => unifiedApi.packages.getAll(filters),
    ...defaultQueryOptions,
  });
};

export const useFeaturedPackages = () => {
  const query = useQuery({
    queryKey: queryKeys.packages.featured(),
    queryFn: () => {
      console.log('🔍 [MOBILE DEBUG] Fetching featured packages...');
      return unifiedApi.packages.getFeatured();
    },
    staleTime: 30 * 60 * 1000, // 30 minutes for featured content
    gcTime: 60 * 60 * 1000, // 1 hour
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
    // Add placeholder data for better perceived performance
    placeholderData: (previousData) => previousData,
  });

  // Debug logging
  if (query.isSuccess) {
    console.log('✅ [MOBILE DEBUG] Featured packages loaded:', query.data?.length || 0, 'items');
  }
  if (query.isError) {
    console.error('❌ [MOBILE DEBUG] Featured packages error:', query.error);
  }

  return query;
};

export const usePackage = (id: number) => {
  return useQuery({
    queryKey: queryKeys.packages.detail(id),
    queryFn: () => unifiedApi.packages.getById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Reviews hooks
export const useReviews = (approved?: boolean) => {
  const query = useQuery({
    queryKey: queryKeys.reviews.list(approved),
    queryFn: () => {
      console.log('🔍 [MOBILE DEBUG] Fetching reviews, approved:', approved);
      return approved !== undefined ? unifiedApi.reviews.getApproved() : unifiedApi.reviews.getAll();
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Debug logging
  if (query.isSuccess) {
    console.log('✅ [MOBILE DEBUG] Reviews loaded:', query.data?.length || 0, 'items');
  }
  if (query.isError) {
    console.error('❌ [MOBILE DEBUG] Reviews error:', query.error);
  }

  return query;
};

// Reference data hooks (long-lived cache) - optimized for performance
export const usePropertyTypes = () => {
  return useQuery({
    queryKey: queryKeys.reference.propertyTypes,
    queryFn: () => unifiedApi.propertyTypes.getAll(),
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

export const useAmenities = () => {
  return useQuery({
    queryKey: queryKeys.reference.amenities,
    queryFn: () => unifiedApi.amenities.getAll(),
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

export const useLocations = () => {
  return useQuery({
    queryKey: queryKeys.reference.locations,
    queryFn: () => unifiedApi.locations.getAll(),
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

export const useDestinations = (featured?: boolean) => {
  return useQuery({
    queryKey: queryKeys.reference.destinations(featured),
    queryFn: () => unifiedApi.destinations.getAll(featured),
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

export const useFeaturedDestinations = () => {
  return useQuery({
    queryKey: queryKeys.reference.featuredDestinations,
    queryFn: () => unifiedApi.destinations.getFeatured(),
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

// Experiences hooks
export const useExperiences = (filters?: ExperienceFilters) => {
  return useQuery({
    queryKey: ['experiences', filters],
    queryFn: () => unifiedApi.experiences.getAll(filters),
    ...defaultQueryOptions,
  });
};

export const useFeaturedExperiences = () => {
  return useQuery({
    queryKey: ['experiences', 'featured'],
    queryFn: () => unifiedApi.experiences.getFeatured(),
    ...defaultQueryOptions,
  });
};

// Experience mutation hooks
export const useCreateExperience = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => unifiedApi.experiences.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
    },
    onError: (error) => {
      console.error('Failed to create experience:', error);
    },
  });
};

export const useUpdateExperience = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      unifiedApi.experiences.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
      queryClient.invalidateQueries({ queryKey: ['experiences', 'featured'] });
    },
    onError: (error) => {
      console.error('Failed to update experience:', error);
    },
  });
};

export const useDeleteExperience = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => unifiedApi.experiences.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
      queryClient.invalidateQueries({ queryKey: ['experiences', 'featured'] });
    },
    onError: (error) => {
      console.error('Failed to delete experience:', error);
    },
  });
};

// Search hooks
export const useGlobalSearch = (query: string) => {
  return useQuery({
    queryKey: queryKeys.search.global(query),
    queryFn: () => unifiedApi.search.global(query),
    enabled: query.length >= 2, // Only search if query is at least 2 characters
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Mutation hooks for data modifications
export const useCreateProperty = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: PropertyFormData) => unifiedApi.properties.create(data),
    onSuccess: () => {
      invalidateQueries.properties();
    },
    onError: (error) => {
      console.error('Failed to create property:', error);
    },
  });
};

export const useUpdateProperty = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<PropertyFormData> }) => 
      unifiedApi.properties.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.detail(id) });
      invalidateQueries.properties();
    },
    onError: (error) => {
      console.error('Failed to update property:', error);
    },
  });
};

export const useDeleteProperty = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => unifiedApi.properties.delete(id),
    onSuccess: () => {
      invalidateQueries.properties();
    },
    onError: (error) => {
      console.error('Failed to delete property:', error);
    },
  });
};

export const useCreatePackage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: PackageFormData) => unifiedApi.packages.create(data),
    onSuccess: () => {
      invalidateQueries.packages();
    },
    onError: (error) => {
      console.error('Failed to create package:', error);
    },
  });
};

export const useUpdatePackage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<PackageFormData> }) => 
      unifiedApi.packages.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.packages.detail(id) });
      invalidateQueries.packages();
    },
    onError: (error) => {
      console.error('Failed to update package:', error);
    },
  });
};

export const useDeletePackage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => unifiedApi.packages.delete(id),
    onSuccess: () => {
      invalidateQueries.packages();
    },
    onError: (error) => {
      console.error('Failed to delete package:', error);
    },
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: ReviewFormData) => unifiedApi.reviews.create(data),
    onSuccess: (_, { property: propertyId }) => {
      // Invalidate property reviews
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.reviews(propertyId) });
      invalidateQueries.reviews();
    },
    onError: (error) => {
      console.error('Failed to create review:', error);
    },
  });
};

export const useApproveReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => unifiedApi.reviews.approve(id),
    onSuccess: () => {
      invalidateQueries.reviews();
    },
    onError: (error) => {
      console.error('Failed to approve review:', error);
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => unifiedApi.reviews.delete(id),
    onSuccess: () => {
      invalidateQueries.reviews();
    },
    onError: (error) => {
      console.error('Failed to delete review:', error);
    },
  });
};

// Optimistic updates hook
export const useOptimisticFavorite = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ propertyId, isFavorited }: { propertyId: number; isFavorited: boolean }) => {
      // Simulate API call - replace with actual favorite API when available
      await new Promise(resolve => setTimeout(resolve, 500));
      return { propertyId, isFavorited };
    },
    onMutate: async ({ propertyId, isFavorited }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.properties.all });
      
      // Snapshot the previous value
      const previousData = queryClient.getQueriesData({ queryKey: queryKeys.properties.all });
      
      // Optimistically update to the new value
      queryClient.setQueriesData(
        { queryKey: queryKeys.properties.all },
        (old: any) => {
          if (!old) return old;
          
          const updateProperty = (property: any) => 
            property.id === propertyId 
              ? { ...property, isFavorited } 
              : property;
              
          if (Array.isArray(old)) {
            return old.map(updateProperty);
          }
          
          return updateProperty(old);
        }
      );
      
      // Return a context object with the snapshotted value
      return { previousData };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      invalidateQueries.properties();
    },
  });
};

// Enhanced prefetching hook with better performance
export const usePrefetchRelatedData = () => {
  const queryClient = useQueryClient();
  
  const prefetchPropertyDetails = (id: number) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.properties.detail(id),
      queryFn: () => unifiedApi.properties.getById(id),
      staleTime: 10 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
    });
  };
  
  const prefetchPackageDetails = (id: number) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.packages.detail(id),
      queryFn: () => unifiedApi.packages.getById(id),
      staleTime: 10 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
    });
  };

  const prefetchCriticalData = () => {
    // Prefetch critical data for better performance
    queryClient.prefetchQuery({
      queryKey: queryKeys.properties.featured(),
      queryFn: () => unifiedApi.properties.getFeatured(),
      staleTime: 30 * 60 * 1000,
      gcTime: 60 * 60 * 1000,
    });

    queryClient.prefetchQuery({
      queryKey: queryKeys.packages.featured(),
      queryFn: () => unifiedApi.packages.getFeatured(),
      staleTime: 30 * 60 * 1000,
      gcTime: 60 * 60 * 1000,
    });
  };
  
  return {
    prefetchPropertyDetails,
    prefetchPackageDetails,
    prefetchCriticalData,
  };
};

// Optimized batch data fetcher for homepage with better performance
export const useHomepageData = () => {
  const propertiesQuery = useFeaturedProperties();
  const packagesQuery = useFeaturedPackages();
  const reviewsQuery = useReviews(true); // Only approved reviews
  
  return {
    properties: propertiesQuery.data || [],
    packages: packagesQuery.data || [],
    reviews: reviewsQuery.data || [],
    isLoading: propertiesQuery.isLoading || packagesQuery.isLoading || reviewsQuery.isLoading,
    isError: propertiesQuery.isError || packagesQuery.isError || reviewsQuery.isError,
    error: propertiesQuery.error || packagesQuery.error || reviewsQuery.error,
    // Add individual loading states for progressive loading
    propertiesLoading: propertiesQuery.isLoading,
    packagesLoading: packagesQuery.isLoading,
    reviewsLoading: reviewsQuery.isLoading,
  };
};

// Database-driven homepage content with optimized caching
export const useHomepageContent = () => {
  return useQuery({
    queryKey: ['homepage-content'],
    queryFn: async () => {
      const response = await fetch('http://localhost:8001/api/homepage/public/');
      if (!response.ok) {
        throw new Error('Failed to fetch homepage content');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - data is fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes - keep in cache for 10 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: false, // Don't refetch on mount if data exists
    refetchOnReconnect: true, // Only refetch on reconnect
    refetchInterval: false, // Disable automatic refetching
    // Add placeholder data for better perceived performance
    placeholderData: (previousData) => previousData,
  });
};

// All hooks are already exported individually above 