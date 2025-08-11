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
  PropertyFormData,
  PackageFormData,
  ReviewFormData
} from '../types';

// Properties hooks
export const useProperties = (filters?: PropertyFilters) => {
  return useQuery({
    queryKey: queryKeys.properties.list(filters),
    queryFn: () => unifiedApi.properties.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useFeaturedProperties = () => {
  return useQuery({
    queryKey: queryKeys.properties.featured(),
    queryFn: () => unifiedApi.properties.getFeatured(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useProperty = (id: number) => {
  return useQuery({
    queryKey: queryKeys.properties.detail(id),
    queryFn: () => unifiedApi.properties.getById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const usePropertyReviews = (propertyId: number) => {
  return useQuery({
    queryKey: queryKeys.properties.reviews(propertyId),
    queryFn: () => unifiedApi.properties.getReviews(propertyId),
    enabled: !!propertyId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Packages hooks
export const usePackages = (filters?: PackageFilters) => {
  return useQuery({
    queryKey: queryKeys.packages.list(filters),
    queryFn: () => unifiedApi.packages.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useFeaturedPackages = () => {
  return useQuery({
    queryKey: queryKeys.packages.featured(),
    queryFn: () => unifiedApi.packages.getFeatured(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
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
  return useQuery({
    queryKey: queryKeys.reviews.list(approved),
    queryFn: () => approved !== undefined ? unifiedApi.reviews.getApproved() : unifiedApi.reviews.getAll(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Reference data hooks (long-lived cache)
export const usePropertyTypes = () => {
  return useQuery({
    queryKey: queryKeys.reference.propertyTypes,
    queryFn: () => unifiedApi.propertyTypes.getAll(),
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

export const useAmenities = () => {
  return useQuery({
    queryKey: queryKeys.reference.amenities,
    queryFn: () => unifiedApi.amenities.getAll(),
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

export const useLocations = () => {
  return useQuery({
    queryKey: queryKeys.reference.locations,
    queryFn: () => unifiedApi.locations.getAll(),
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

// Search hooks
export const useGlobalSearch = (query: string) => {
  return useQuery({
    queryKey: queryKeys.search.global(query),
    queryFn: () => unifiedApi.search.global(query),
    enabled: query.length >= 2, // Only search if query is at least 2 characters
    staleTime: 1 * 60 * 1000, // 1 minute
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

// Custom hook for prefetching related data
export const usePrefetchRelatedData = () => {
  const queryClient = useQueryClient();
  
  const prefetchPropertyDetails = (id: number) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.properties.detail(id),
      queryFn: () => unifiedApi.properties.getById(id),
      staleTime: 10 * 60 * 1000,
    });
  };
  
  const prefetchPackageDetails = (id: number) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.packages.detail(id),
      queryFn: () => unifiedApi.packages.getById(id),
      staleTime: 10 * 60 * 1000,
    });
  };
  
  return {
    prefetchPropertyDetails,
    prefetchPackageDetails,
  };
};

// Batch data fetcher for homepage
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
  };
};

// All hooks are already exported individually above 