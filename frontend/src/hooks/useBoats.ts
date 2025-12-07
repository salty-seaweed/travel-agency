import { useState, useEffect, useCallback } from 'react';
import {
  getBoats,
  getBoat,
  getFeaturedBoats,
  getBoatImages,
  getBoatReviews,
  getBoatAmenities,
  createBoatReview,
  updateBoatReview,
  deleteBoatReview,
  createBoat,
  updateBoat,
  deleteBoat,
  getBoatActivities,
  getBoatActivity,
  getBoatActivitiesByType,
  createBoatActivity,
  updateBoatActivity,
  deleteBoatActivity,
  getBoatPackages,
  getBoatPackage,
  getFeaturedBoatPackages,
  createBoatPackage,
  updateBoatPackage,
  deleteBoatPackage,
  createBoatBooking,
  getBoatBookings,
  getBoatBooking,
  updateBoatBooking,
} from '../api';
import type {
  Boat,
  BoatImage,
  BoatReview,
  BoatAmenity,
  BoatFormData,
  BoatReviewFormData,
  BoatFilters,
  PaginatedResponse,
  BoatActivity,
  BoatActivityFormData,
  BoatActivityFilters,
  BoatPackage,
  BoatPackageFormData,
  BoatPackageFilters,
  BoatBooking,
  BoatBookingFormData,
} from '../types';

// Hook for fetching boats with filters
export function useBoats(filters?: BoatFilters) {
  const [boats, setBoats] = useState<Boat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    count: number;
    next: string | null;
    previous: string | null;
  } | null>(null);

  // Stringify filters to avoid infinite loops from object reference changes
  const filtersStr = JSON.stringify(filters);

  const fetchBoats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const parsedFilters = filtersStr ? JSON.parse(filtersStr) : undefined;
      const response: PaginatedResponse<Boat> = await getBoats(parsedFilters);
      setBoats(response.results);
      setPagination({
        count: response.count,
        next: response.next,
        previous: response.previous,
      });
    } catch (err) {
      console.error('Error fetching boats:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch boats');
    } finally {
      setLoading(false);
    }
  }, [filtersStr]);

  useEffect(() => {
    fetchBoats();
  }, [fetchBoats]);

  return {
    boats,
    loading,
    error,
    pagination,
    refetch: fetchBoats,
  };
}

// Hook for fetching a single boat
export function useBoat(id: number) {
  const [boat, setBoat] = useState<Boat | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBoat = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getBoat(id);
      setBoat(data);
    } catch (err) {
      console.error('Error fetching boat:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch boat');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchBoat();
    }
  }, [fetchBoat, id]);

  return {
    boat,
    loading,
    error,
    refetch: fetchBoat,
  };
}

// Hook for fetching featured boats
export function useFeaturedBoats() {
  const [boats, setBoats] = useState<Boat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeaturedBoats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getFeaturedBoats();
      setBoats(data);
    } catch (err) {
      console.error('Error fetching featured boats:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch featured boats');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeaturedBoats();
  }, [fetchFeaturedBoats]);

  return {
    boats,
    loading,
    error,
    refetch: fetchFeaturedBoats,
  };
}

// Hook for fetching boat images
export function useBoatImages(boatId: number) {
  const [images, setImages] = useState<BoatImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getBoatImages(boatId);
      setImages(data);
    } catch (err) {
      console.error('Error fetching boat images:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch boat images');
    } finally {
      setLoading(false);
    }
  }, [boatId]);

  useEffect(() => {
    if (boatId) {
      fetchImages();
    }
  }, [fetchImages, boatId]);

  return {
    images,
    loading,
    error,
    refetch: fetchImages,
  };
}

// Hook for fetching boat reviews
export function useBoatReviews(boatId: number) {
  const [reviews, setReviews] = useState<BoatReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getBoatReviews(boatId);
      setReviews(data);
    } catch (err) {
      console.error('Error fetching boat reviews:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch boat reviews');
    } finally {
      setLoading(false);
    }
  }, [boatId]);

  useEffect(() => {
    if (boatId) {
      fetchReviews();
    }
  }, [fetchReviews, boatId]);

  return {
    reviews,
    loading,
    error,
    refetch: fetchReviews,
  };
}

// Hook for fetching boat amenities
export function useBoatAmenities() {
  const [amenities, setAmenities] = useState<BoatAmenity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAmenities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getBoatAmenities();
      setAmenities(data);
    } catch (err) {
      console.error('Error fetching boat amenities:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch boat amenities');
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

// Hook for fetching boat activities
export function useBoatActivities(filters?: BoatActivityFilters) {
  const [activities, setActivities] = useState<BoatActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    count: number;
    next: string | null;
    previous: string | null;
  } | null>(null);

  // Stringify filters to avoid infinite loops from object reference changes
  const filtersStr = JSON.stringify(filters);

  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const parsedFilters = filtersStr ? JSON.parse(filtersStr) : undefined;
      const response: PaginatedResponse<BoatActivity> = await getBoatActivities(parsedFilters);
      setActivities(response.results);
      setPagination({
        count: response.count,
        next: response.next,
        previous: response.previous,
      });
    } catch (err) {
      console.error('Error fetching boat activities:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch boat activities');
    } finally {
      setLoading(false);
    }
  }, [filtersStr]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return {
    activities,
    loading,
    error,
    pagination,
    refetch: fetchActivities,
  };
}

// Hook for fetching a single boat activity
export function useBoatActivity(id: number) {
  const [activity, setActivity] = useState<BoatActivity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivity = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getBoatActivity(id);
      setActivity(data);
    } catch (err) {
      console.error('Error fetching boat activity:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch boat activity');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchActivity();
    }
  }, [fetchActivity, id]);

  return {
    activity,
    loading,
    error,
    refetch: fetchActivity,
  };
}

// Hook for fetching activities by type
export function useBoatActivitiesByType() {
  const [activitiesByType, setActivitiesByType] = useState<Record<string, {
    name: string;
    activities: BoatActivity[];
    count: number;
  }>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivitiesByType = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getBoatActivitiesByType();
      setActivitiesByType(data);
    } catch (err) {
      console.error('Error fetching activities by type:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch activities by type');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivitiesByType();
  }, [fetchActivitiesByType]);

  return {
    activitiesByType,
    loading,
    error,
    refetch: fetchActivitiesByType,
  };
}

// Hook for fetching boat packages
export function useBoatPackages(filters?: BoatPackageFilters) {
  const [packages, setPackages] = useState<BoatPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    count: number;
    next: string | null;
    previous: string | null;
  } | null>(null);

  // Stringify filters to avoid infinite loops from object reference changes
  const filtersStr = JSON.stringify(filters);

  const fetchPackages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const parsedFilters = filtersStr ? JSON.parse(filtersStr) : undefined;
      const response: PaginatedResponse<BoatPackage> = await getBoatPackages(parsedFilters);
      setPackages(response.results);
      setPagination({
        count: response.count,
        next: response.next,
        previous: response.previous,
      });
    } catch (err) {
      console.error('Error fetching boat packages:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch boat packages');
    } finally {
      setLoading(false);
    }
  }, [filtersStr]);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  return {
    packages,
    loading,
    error,
    pagination,
    refetch: fetchPackages,
  };
}

// Hook for fetching a single boat package
export function useBoatPackage(id: number) {
  const [boatPackage, setBoatPackage] = useState<BoatPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPackage = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getBoatPackage(id);
      setBoatPackage(data);
    } catch (err) {
      console.error('Error fetching boat package:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch boat package');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchPackage();
    }
  }, [fetchPackage, id]);

  return {
    boatPackage,
    loading,
    error,
    refetch: fetchPackage,
  };
}

// Hook for fetching featured boat packages
export function useFeaturedBoatPackages() {
  const [packages, setPackages] = useState<BoatPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeaturedPackages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getFeaturedBoatPackages();
      setPackages(data);
    } catch (err) {
      console.error('Error fetching featured boat packages:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch featured boat packages');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeaturedPackages();
  }, [fetchFeaturedPackages]);

  return {
    packages,
    loading,
    error,
    refetch: fetchFeaturedPackages,
  };
}

// Hook for fetching boat bookings
export function useBoatBookings() {
  const [bookings, setBookings] = useState<BoatBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getBoatBookings();
      setBookings(data);
    } catch (err) {
      console.error('Error fetching boat bookings:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch boat bookings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return {
    bookings,
    loading,
    error,
    refetch: fetchBookings,
  };
}

