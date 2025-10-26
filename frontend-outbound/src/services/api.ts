import axios from 'axios';
import {
  HomepageData,
  Statistics,
  Continent,
  Country,
  CountryDetail,
  ActivityCategory,
  TourPackage,
  TourPackageListItem,
  SearchResult,
  Currency,
  ApiError
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api/outbound';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for handling API errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError: ApiError = {
      message: error.response?.data?.detail || error.message || 'An unexpected error occurred.',
      details: error.response?.data,
    };
    return Promise.reject(apiError);
  }
);

// =================================================================
// API Service Functions
// =================================================================

// --- Homepage & Global Data ---

export const getHomepageData = async (): Promise<HomepageData> => {
  const { data } = await apiClient.get('/homepage/');
  return data;
};

export const getStatistics = async (): Promise<Statistics> => {
  const { data } = await apiClient.get('/statistics/');
  return data;
};

export const getCurrencies = async (): Promise<Currency[]> => {
  const { data } = await apiClient.get('/currencies/');
  return data;
};

// --- Continents & Countries ---

export const getContinents = async (): Promise<Continent[]> => {
  const { data } = await apiClient.get('/continents/');
  return data;
};

export const getCountries = async (continentId?: number): Promise<Country[]> => {
  const params = continentId ? { continent: continentId } : {};
  const { data } = await apiClient.get('/countries/', { params });
  return data;
};

export const getCountryDetails = async (countryId: number): Promise<CountryDetail> => {
  const { data } = await apiClient.get(`/countries/${countryId}/`);
  return data;
};

// --- Tours ---

export const getTours = async (filters: Record<string, any> = {}): Promise<TourPackageListItem[]> => {
  const { data } = await apiClient.get('/tours/', { params: filters });
  return data;
};

export const getTourDetails = async (slug: string): Promise<TourPackage> => {
  const { data } = await apiClient.get(`/tours/${slug}/`);
  return data;
};

export const getFeaturedTours = async (): Promise<TourPackageListItem[]> => {
  const { data } = await apiClient.get('/tours/featured/');
  return data;
};

export const getDeals = async (): Promise<TourPackageListItem[]> => {
  const { data } = await apiClient.get('/tours/deals/');
  return data;
};

// --- Activities & Search ---

export const getActivityCategories = async (): Promise<ActivityCategory[]> => {
  const { data } = await apiClient.get('/activities/');
  return data;
};

export const searchTours = async (query: string): Promise<SearchResult> => {
  const { data } = await apiClient.get('/tours/search/', { params: { q: query } });
  return data;
};

// --- Bookings (Requires Auth) ---

export const createBooking = async (bookingData: any, token: string): Promise<any> => {
  const { data } = await apiClient.post('/bookings/', bookingData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const getBookingHistory = async (token: string): Promise<any> => {
  const { data } = await apiClient.get('/bookings/history/', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};
