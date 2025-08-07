import { useState, useEffect, useCallback } from 'react';
import { apiGet } from '../api';
import type { ApiResponse } from '../types';

interface UseFetchOptions {
  immediate?: boolean;
  dependencies?: any[];
}

export function useFetch<T>(
  endpoint: string,
  options: UseFetchOptions = {}
) {
  const { immediate = true, dependencies = [] } = options;
  
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiGet(endpoint);
      const apiResponse = response as ApiResponse<T>;
      
      if (apiResponse.results) {
        setData(apiResponse.results);
        setTotalCount(apiResponse.count || apiResponse.results.length);
      } else {
        // Handle case where response is directly an array
        setData(response as T[]);
        setTotalCount((response as T[]).length);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  }, [endpoint]);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, [fetchData, immediate, ...dependencies]);

  return {
    data,
    isLoading,
    error,
    totalCount,
    refresh,
    setData,
  };
} 