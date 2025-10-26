import { useState, useEffect, useCallback } from 'react';
import {
  getResorts,
  getResort,
  getResortsByCategory,
  getResortsByAtoll,
  getFeaturedResorts,
  getResortImages,
  getResortReviews,
  getResortAmenities,
  createResortReview,
  updateResortReview,
  deleteResortReview,
  createResort,
  updateResort,
  deleteResort,
  uploadResortImage,
  updateResortImage,
  deleteResortImage,
} from '../api';
import type {
  Resort,
  ResortImage,
  ResortReview,
  ResortAmenity,
  ResortFormData,
  ResortReviewFormData,
  ResortFilters,
  PaginatedResponse,
} from '../types';

// Hook for fetching resorts with filters
export function useResorts(filters?: ResortFilters) {
  const [resorts, setResorts] = useState<Resort[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    count: number;
    next: string | null;
    previous: string | null;
  } | null>(null);

  const fetchResorts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response: PaginatedResponse<Resort> = await getResorts(filters);
      setResorts(response.results);
      setPagination({
        count: response.count,
        next: response.next,
        previous: response.previous,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch resorts');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchResorts();
  }, [fetchResorts]);

  return {
    resorts,
    loading,
    error,
    pagination,
    refetch: fetchResorts,
  };
}

// Hook for fetching a single resort
export function useResort(id: number) {
  const [resort, setResort] = useState<Resort | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResort = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getResort(id);
      setResort(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch resort');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchResort();
    }
  }, [fetchResort]);

  return {
    resort,
    loading,
    error,
    refetch: fetchResort,
  };
}

// Hook for fetching resorts by category
export function useResortsByCategory() {
  const [resortsByCategory, setResortsByCategory] = useState<Record<string, {
    name: string;
    resorts: Resort[];
    count: number;
  }>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResortsByCategory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getResortsByCategory();
      setResortsByCategory(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch resorts by category');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResortsByCategory();
  }, [fetchResortsByCategory]);

  return {
    resortsByCategory,
    loading,
    error,
    refetch: fetchResortsByCategory,
  };
}

// Hook for fetching resorts by atoll
export function useResortsByAtoll() {
  const [resortsByAtoll, setResortsByAtoll] = useState<Record<string, {
    resorts: Resort[];
    count: number;
  }>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResortsByAtoll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getResortsByAtoll();
      setResortsByAtoll(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch resorts by atoll');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResortsByAtoll();
  }, [fetchResortsByAtoll]);

  return {
    resortsByAtoll,
    loading,
    error,
    refetch: fetchResortsByAtoll,
  };
}

// Hook for fetching featured resorts
export function useFeaturedResorts() {
  const [resorts, setResorts] = useState<Resort[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeaturedResorts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getFeaturedResorts();
      setResorts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch featured resorts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeaturedResorts();
  }, [fetchFeaturedResorts]);

  return {
    resorts,
    loading,
    error,
    refetch: fetchFeaturedResorts,
  };
}

// Hook for fetching resort images
export function useResortImages(resortId: number) {
  const [images, setImages] = useState<ResortImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getResortImages(resortId);
      setImages(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch resort images');
    } finally {
      setLoading(false);
    }
  }, [resortId]);

  useEffect(() => {
    if (resortId) {
      fetchImages();
    }
  }, [fetchImages]);

  return {
    images,
    loading,
    error,
    refetch: fetchImages,
  };
}

// Hook for fetching resort reviews
export function useResortReviews(resortId: number) {
  const [reviews, setReviews] = useState<ResortReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getResortReviews(resortId);
      setReviews(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch resort reviews');
    } finally {
      setLoading(false);
    }
  }, [resortId]);

  useEffect(() => {
    if (resortId) {
      fetchReviews();
    }
  }, [fetchReviews]);

  return {
    reviews,
    loading,
    error,
    refetch: fetchReviews,
  };
}

// Hook for fetching resort amenities
export function useResortAmenities() {
  const [amenities, setAmenities] = useState<ResortAmenity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAmenities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getResortAmenities();
      setAmenities(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch resort amenities');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAmenities();
  }, [fetchAmenities]);

  return {
    amenities,
    loading,
    error,
    refetch: fetchAmenities,
  };
}

// Hook for creating resort reviews
export function useCreateResortReview() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createReview = useCallback(async (reviewData: ResortReviewFormData) => {
    try {
      setLoading(true);
      setError(null);
      const review = await createResortReview(reviewData);
      return review;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create review');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createReview,
    loading,
    error,
  };
}

// Hook for updating resort reviews
export function useUpdateResortReview() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateReview = useCallback(async (id: number, reviewData: Partial<ResortReviewFormData>) => {
    try {
      setLoading(true);
      setError(null);
      const review = await updateResortReview(id, reviewData);
      return review;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update review');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    updateReview,
    loading,
    error,
  };
}

// Hook for deleting resort reviews
export function useDeleteResortReview() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteReview = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await deleteResortReview(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete review');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    deleteReview,
    loading,
    error,
  };
}

// Admin hooks for resort management
export function useCreateResort() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createResortData = useCallback(async (resortData: ResortFormData) => {
    try {
      setLoading(true);
      setError(null);
      const resort = await createResort(resortData);
      return resort;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create resort');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createResortData,
    loading,
    error,
  };
}

export function useUpdateResort() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateResortData = useCallback(async (id: number, resortData: Partial<ResortFormData>) => {
    try {
      setLoading(true);
      setError(null);
      const resort = await updateResort(id, resortData);
      return resort;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update resort');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    updateResortData,
    loading,
    error,
  };
}

export function useDeleteResort() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteResortData = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await deleteResort(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete resort');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    deleteResortData,
    loading,
    error,
  };
}

// Hook for resort image management
export function useResortImageManagement() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = useCallback(async (resortId: number, imageData: {
    image: File;
    image_type: ResortImage['image_type'];
    caption?: string;
    alt_text?: string;
    order?: number;
    is_featured?: boolean;
  }) => {
    try {
      setLoading(true);
      setError(null);
      const image = await uploadResortImage(resortId, imageData);
      return image;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateImage = useCallback(async (id: number, imageData: Partial<{
    image: File;
    image_type: ResortImage['image_type'];
    caption: string;
    alt_text: string;
    order: number;
    is_featured: boolean;
    is_active: boolean;
  }>) => {
    try {
      setLoading(true);
      setError(null);
      const image = await updateResortImage(id, imageData);
      return image;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update image');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteImage = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await deleteResortImage(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete image');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    uploadImage,
    updateImage,
    deleteImage,
    loading,
    error,
  };
}
