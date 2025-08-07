import { useState, useEffect, useCallback } from 'react';
import { propertiesApi, packagesApi, reviewsApi, propertyTypesApi, amenitiesApi, locationsApi } from '../services/api';
import type { Property, Package, Review, PropertyType, Amenity, Location } from '../services/api';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  refetch: () => Promise<void>;
  setData: (data: T) => void;
}

// Generic hook for API calls
export function useApi<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await apiCall();
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  }, [apiCall]);

  const setData = useCallback((data: T) => {
    setState(prev => ({ ...prev, data }));
  }, []);

  useEffect(() => {
    fetchData();
  }, dependencies);

  return {
    ...state,
    refetch: fetchData,
    setData,
  };
}

// Properties hooks
export const useProperties = () => {
  return useApi(() => propertiesApi.getAll());
};

export const useFeaturedProperties = () => {
  return useApi(() => propertiesApi.getFeatured());
};

export const useProperty = (id: number) => {
  return useApi(() => propertiesApi.getById(id), [id]);
};

export const useFilteredProperties = (filters: {
  property_type?: number;
  amenities?: number[];
  location?: number;
  min_price?: number;
  max_price?: number;
  is_featured?: boolean;
}) => {
  return useApi(() => propertiesApi.getFiltered(filters), [filters]);
};

export const usePropertyReviews = (propertyId: number) => {
  return useApi(() => propertiesApi.getReviews(propertyId), [propertyId]);
};

export const usePropertyPackages = (propertyId: number) => {
  return useApi(() => propertiesApi.getPackages(propertyId), [propertyId]);
};

// Packages hooks
export const usePackages = () => {
  return useApi(() => packagesApi.getAll());
};

export const useFeaturedPackages = () => {
  return useApi(() => packagesApi.getFeatured());
};

export const usePackage = (id: number) => {
  return useApi(() => packagesApi.getById(id), [id]);
};

// Reviews hooks
export const useReviews = () => {
  return useApi(() => reviewsApi.getAll());
};

export const useApprovedReviews = () => {
  return useApi(() => reviewsApi.getApproved());
};

// Property types, amenities, and locations hooks
export const usePropertyTypes = () => {
  return useApi(() => propertyTypesApi.getAll());
};

export const useAmenities = () => {
  return useApi(() => amenitiesApi.getAll());
};

export const useLocations = () => {
  return useApi(() => locationsApi.getAll());
};

// Custom hook for creating reviews
export const useCreateReview = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createReview = useCallback(async (reviewData: {
    property: number;
    name: string;
    rating: number;
    comment: string;
  }) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await reviewsApi.create(reviewData);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create review');
      setLoading(false);
      throw err;
    }
  }, []);

  return {
    createReview,
    loading,
    error,
  };
};

// Hook for managing multiple API calls
export const useMultipleApi = <T extends Record<string, any>>(
  apiCalls: T
): { [K in keyof T]: UseApiReturn<Awaited<ReturnType<T[K]>>> } => {
  const results: any = {};
  
  Object.entries(apiCalls).forEach(([key, apiCall]) => {
    results[key] = useApi(apiCall as () => Promise<any>);
  });
  
  return results;
};

// Hook for search functionality
export const useSearch = () => {
  const [searchResults, setSearchResults] = useState<{
    properties: Property[];
    packages: Package[];
  }>({ properties: [], packages: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults({ properties: [], packages: [] });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [properties, packages] = await Promise.all([
        propertiesApi.getFiltered({} as any), // You might want to implement search in the API
        packagesApi.getAll(), // You might want to implement search in the API
      ]);

      // Filter results based on query (client-side filtering for now)
      const filteredProperties = properties.filter(property =>
        property.name.toLowerCase().includes(query.toLowerCase()) ||
        property.description.toLowerCase().includes(query.toLowerCase())
      );

      const filteredPackages = packages.filter(pkg =>
        pkg.name.toLowerCase().includes(query.toLowerCase()) ||
        pkg.description.toLowerCase().includes(query.toLowerCase())
      );

      setSearchResults({
        properties: filteredProperties,
        packages: filteredPackages,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    search,
    searchResults,
    loading,
    error,
  };
};

export default {
  useProperties,
  useFeaturedProperties,
  useProperty,
  useFilteredProperties,
  usePropertyReviews,
  usePropertyPackages,
  usePackages,
  useFeaturedPackages,
  usePackage,
  useReviews,
  useApprovedReviews,
  usePropertyTypes,
  useAmenities,
  useLocations,
  useCreateReview,
  useMultipleApi,
  useSearch,
}; 