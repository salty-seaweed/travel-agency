// Unified API service layer - Clean implementation
import type { 
  Package, 
  Review, 
  Amenity, 
  Location,
  Destination,
  Experience,
  PackageFilters,
  ExperienceFilters,
  PackageFormData,
  ReviewFormData,
  User,
  AuthTokens,
  Booking,
  BookingFormData
} from '../types';
import { config, performance, errorMessages, security, getWhatsAppUrl } from '../config';

// API Error handling
interface ApiErrorInfo {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}

const createApiError = (info: ApiErrorInfo): Error => {
  const error = new Error(info.message);
  Object.assign(error, info);
  return error;
};

// Token management
const tokenStorage = {
  getAccessToken: (): string | null => localStorage.getItem('access'),
  getRefreshToken: (): string | null => localStorage.getItem('refresh'),
  setTokens: (tokens: AuthTokens): void => {
    localStorage.setItem('access', tokens.access);
    localStorage.setItem('refresh', tokens.refresh);
  },
  clearTokens: (): void => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
  },
  isAuthenticated: (): boolean => !!localStorage.getItem('access'),
};

// Simple cache implementation
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

const cacheUtils = {
  set: (key: string, data: any, ttl: number = performance.cacheTimeout.medium): void => {
    cache.set(key, { data, timestamp: Date.now(), ttl });
  },
  
  get: (key: string): any | null => {
    const cached = cache.get(key);
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > cached.ttl) {
      cache.delete(key);
      return null;
    }
    
    return cached.data;
  },
  
  invalidate: (pattern?: string): void => {
    if (!pattern) {
      cache.clear();
      return;
    }
    
    for (const key of cache.keys()) {
      if (key.includes(pattern)) {
        cache.delete(key);
      }
    }
  },
  
  clear: (): void => cache.clear(),
};

// Input sanitization
const sanitizeInput = (input: string, maxLength?: number): string => {
  let sanitized = input.trim();
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  sanitized = sanitized.replace(/javascript:/gi, '');
  sanitized = sanitized.replace(/on\w+\s*=/gi, '');
  
  if (maxLength && sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
  return sanitized;
};

// Core API request function for public endpoints (no authentication required)
const publicApiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {},
  useCache: boolean = false,
  cacheTtl?: number
): Promise<T> => {
  const url = `${config.apiBaseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  console.log('🔍 [MOBILE DEBUG] publicApiRequest called:', { 
    endpoint, 
    url, 
    useCache,
    configApiBaseUrl: config.apiBaseUrl,
    windowLocation: window.location.href,
    isNgrok: window.location.hostname.includes('ngrok')
  });
  
  // Check cache for GET requests
  if (useCache && (!options.method || options.method.toUpperCase() === 'GET')) {
    const cacheKey = `${url}:${JSON.stringify(options)}`;
    const cachedData = cacheUtils.get(cacheKey);
    if (cachedData) return cachedData;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), performance.apiTimeout);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.9',
    'Cache-Control': 'no-cache',
  };

  const requestOptions: RequestInit = {
    ...options,
    headers: { ...headers, ...options.headers },
    signal: controller.signal,
  };

  try {
    console.log('🔍 [MOBILE DEBUG] Making fetch request to:', url);
    console.log('🔍 [MOBILE DEBUG] Request options:', {
      method: requestOptions.method || 'GET',
      headers: requestOptions.headers,
      signal: requestOptions.signal ? 'AbortController attached' : 'No signal'
    });
    
    const response = await fetch(url, requestOptions);
    console.log('🔍 [MOBILE DEBUG] Fetch response status:', response.status, response.statusText);
    console.log('🔍 [MOBILE DEBUG] Response headers:', Object.fromEntries(response.headers.entries()));
    
    clearTimeout(timeoutId);

    let data: any;
    const contentType = response.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const errorMessage = data?.message || data?.detail || `HTTP error! status: ${response.status}`;
      throw createApiError({
        message: errorMessage,
        status: response.status,
        code: data?.code,
        details: data,
      });
    }

    // Cache successful GET requests
    if (useCache && (!options.method || options.method.toUpperCase() === 'GET')) {
      const cacheKey = `${url}:${JSON.stringify(options)}`;
      cacheUtils.set(cacheKey, data, cacheTtl);
    }

    return data;

  } catch (error: any) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      throw createApiError({ message: 'Request timeout. Please try again.', status: 408 });
    }

    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw createApiError({ message: errorMessages.network, status: 0 });
    }

    throw error;
  }
};

// Core API request function for authenticated endpoints
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {},
  useCache: boolean = false,
  cacheTtl?: number
): Promise<T> => {
  const url = `${config.apiBaseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  // Check cache for GET requests
  if (useCache && (!options.method || options.method.toUpperCase() === 'GET')) {
    const cacheKey = `${url}:${JSON.stringify(options)}`;
    const cachedData = cacheUtils.get(cacheKey);
    if (cachedData) return cachedData;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), performance.apiTimeout);

  const headers: Record<string, string> = {
    'X-Requested-With': 'XMLHttpRequest',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.9',
    'Cache-Control': 'no-cache',
  };

  // Only set Content-Type for non-FormData requests
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const accessToken = tokenStorage.getAccessToken();
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const requestOptions: RequestInit = {
    ...options,
    headers: { ...headers, ...options.headers },
    signal: controller.signal,
  };

  try {
    const response = await fetch(url, requestOptions);
    clearTimeout(timeoutId);

    let data: any;
    const contentType = response.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const errorMessage = data?.message || data?.detail || `HTTP error! status: ${response.status}`;
      throw createApiError({
        message: errorMessage,
        status: response.status,
        code: data?.code,
        details: data,
      });
    }

    // Cache successful GET requests
    if (useCache && (!options.method || options.method.toUpperCase() === 'GET')) {
      const cacheKey = `${url}:${JSON.stringify(options)}`;
      cacheUtils.set(cacheKey, data, cacheTtl);
    }

    return data;

  } catch (error: any) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      throw createApiError({ message: 'Request timeout. Please try again.', status: 408 });
    }

    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw createApiError({ message: errorMessages.network, status: 0 });
    }

    throw error;
  }
};

// Data transformers
const transformProperty = (raw: any): any => ({
  id: raw.id,
  name: sanitizeInput(raw.name || '', security.sanitization.maxLength.name),
  description: sanitizeInput(raw.description || '', security.sanitization.maxLength.description),
  price_per_night: raw.price_per_night || '0',
  price: parseFloat(raw.price_per_night) || 0,
  location: raw.location || { id: 0, island: 'Unknown', atoll: 'Unknown', latitude: 0, longitude: 0 },
  property_type: raw.property_type || { id: 0, name: 'Resort' },
  amenities: raw.amenities || [],
  images: raw.images || [],
  latitude: raw.latitude,
  longitude: raw.longitude,
  address: raw.address,
  whatsapp_number: raw.whatsapp_number,
  is_featured: raw.is_featured || false,
  reviews: raw.reviews || [],
  packages: raw.packages || [],
  rating: raw.rating || null,
  reviewCount: Array.isArray(raw.reviews) ? raw.reviews.length : 0,
  created_at: raw.created_at,
  updated_at: raw.updated_at,
});

const transformPackage = (raw: any): any => ({
  id: raw.id,
  name: sanitizeInput(raw.name || '', security.sanitization.maxLength.name),
  description: sanitizeInput(raw.description || '', security.sanitization.maxLength.description),
  price: raw.price || '0',
  original_price: raw.original_price || null,
  duration: raw.duration || 7,
  images: raw.images || [],
  is_featured: raw.is_featured || false,
  start_date: raw.start_date,
  end_date: raw.end_date,
  // Fix destinations mapping - use the PackageDestination relationship
  destinations: Array.isArray(raw.destinations) 
    ? raw.destinations.map((dest: any) => dest.location?.island || dest.location?.name || dest.island || dest.name || dest).filter(Boolean)
    : [],
  // Fix highlights mapping - use the highlights field from Package model
  highlights: Array.isArray(raw.highlights) 
    ? raw.highlights 
    : (raw.highlights ? raw.highlights.split(',').map((h: string) => h.trim()).filter(Boolean) : []),
  // Fix included mapping - use the PackageInclusion relationship
  included: Array.isArray(raw.inclusions) 
    ? raw.inclusions.filter((inc: any) => inc.category === 'included').map((inc: any) => inc.item).filter(Boolean)
    : [],
  // Fix maxTravelers mapping - use group_size fields
  maxTravelers: raw.group_size_max || raw.group_size_recommended || 4,
  // Fix category mapping
  category: raw.category || 'Adventure',
  created_at: raw.created_at,
  updated_at: raw.updated_at,
});

// API Services
export const unifiedApi = {

  // Packages
  packages: {
    getAll: async (filters?: PackageFilters): Promise<any[]> => {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString());
          }
        });
      }
      
      const endpoint = `packages/${params.toString() ? `?${params.toString()}` : ''}`;
      const data = await publicApiRequest<any>(endpoint, {}, true, performance.cacheTimeout.medium);
      // Handle paginated response
      const results = data?.results || data;
      return Array.isArray(results) ? results.map(transformPackage) : [];
    },

    getFeatured: async (): Promise<any[]> => {
      console.log('🔍 [MOBILE DEBUG] API call: getFeatured packages starting...');
      try {
        const data = await publicApiRequest<any>('packages/?is_featured=true', {}, true, performance.cacheTimeout.long);
        console.log('🔍 [MOBILE DEBUG] API call: getFeatured packages response:', data);
        // Handle paginated response
        const results = data?.results || data;
        const transformed = Array.isArray(results) ? results.map(transformPackage) : [];
        console.log('✅ [MOBILE DEBUG] API call: getFeatured packages transformed:', transformed.length, 'items');
        return transformed;
      } catch (error) {
        console.error('❌ [MOBILE DEBUG] API call: getFeatured packages error:', error);
        throw error;
      }
    },

    getById: async (id: number): Promise<any> => {
      const data = await publicApiRequest<any>(`packages/${id}/`, {}, true, performance.cacheTimeout.medium);
      return transformPackage(data);
    },

    create: async (packageData: PackageFormData): Promise<any> => {
      cacheUtils.invalidate('packages');
      const data = await apiRequest<any>('packages/', {
        method: 'POST',
        body: JSON.stringify(packageData),
      });
      return transformPackage(data);
    },

    update: async (id: number, packageData: Partial<PackageFormData>): Promise<any> => {
      cacheUtils.invalidate('packages');
      const data = await apiRequest<any>(`packages/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify(packageData),
      });
      return transformPackage(data);
    },

    delete: async (id: number): Promise<void> => {
      cacheUtils.invalidate('packages');
      await apiRequest<void>(`packages/${id}/`, { method: 'DELETE' });
    },
  },

  // Reviews
  reviews: {
    getAll: async (): Promise<Review[]> => {
      const data = await publicApiRequest<any>('reviews/', {}, true, performance.cacheTimeout.short);
      // Handle paginated response
      const results = data?.results || data;
      return Array.isArray(results) ? results : [];
    },

    getApproved: async (): Promise<Review[]> => {
      const data = await publicApiRequest<any>('reviews/?approved=true', {}, true, performance.cacheTimeout.medium);
      // Handle paginated response
      const results = data?.results || data;
      return Array.isArray(results) ? results : [];
    },

    create: async (reviewData: ReviewFormData): Promise<Review> => {
      cacheUtils.invalidate('reviews');
      const sanitizedData = {
        ...reviewData,
        name: sanitizeInput(reviewData.name, security.sanitization.maxLength.name),
        comment: sanitizeInput(reviewData.comment, security.sanitization.maxLength.comment),
      };

      const data = await apiRequest<Review>('reviews/', {
        method: 'POST',
        body: JSON.stringify(sanitizedData),
      });
      return data;
    },

    approve: async (id: number): Promise<Review> => {
      cacheUtils.invalidate('reviews');
      const data = await apiRequest<Review>(`reviews/${id}/approve/`, { method: 'POST' });
      return data;
    },

    delete: async (id: number): Promise<void> => {
      cacheUtils.invalidate('reviews');
      await apiRequest<void>(`reviews/${id}/`, { method: 'DELETE' });
    },
  },

  // Reference data
  propertyTypes: {
    getAll: async (): Promise<any[]> => {
      const data = await publicApiRequest<any>('property-types/', {}, true, performance.cacheTimeout.long);
      // Handle paginated response
      const results = data?.results || data;
      return Array.isArray(results) ? results : [];
    },
  },

  amenities: {
    getAll: async (): Promise<Amenity[]> => {
      const data = await publicApiRequest<any>('amenities/', {}, true, performance.cacheTimeout.long);
      // Handle paginated response
      const results = data?.results || data;
      return Array.isArray(results) ? results : [];
    },
  },

  locations: {
    getAll: async (): Promise<Location[]> => {
      const data = await publicApiRequest<any>('locations/', {}, true, performance.cacheTimeout.long);
      // Handle paginated response
      const results = data?.results || data;
      return Array.isArray(results) ? results : [];
    },
  },

  destinations: {
    getAll: async (featured?: boolean): Promise<Destination[]> => {
      const url = featured !== undefined ? `destinations/?featured=${featured}` : 'destinations/';
      const data = await publicApiRequest<any>(url, {}, true, performance.cacheTimeout.medium);
      // Handle paginated response
      const results = data?.results || data;
      return Array.isArray(results) ? results : [];
    },

    getFeatured: async (): Promise<Destination[]> => {
      const data = await publicApiRequest<any>('destinations/?featured=true', {}, true, performance.cacheTimeout.medium);
      // Handle paginated response
      const results = data?.results || data;
      return Array.isArray(results) ? results : [];
    },

    getById: async (id: number): Promise<Destination> => {
      return await publicApiRequest<Destination>(`destinations/${id}/`, {}, true, performance.cacheTimeout.medium);
    },

    create: async (data: any): Promise<Destination> => {
      // Check if data contains file uploads
      const hasFileUpload = data.image instanceof File;
      
      if (hasFileUpload) {
        // Use FormData for file uploads
        const formData = new FormData();
        Object.keys(data).forEach(key => {
          if (key === 'image' && data[key] instanceof File) {
            formData.append(key, data[key]);
          } else if (data[key] !== null && data[key] !== undefined) {
            formData.append(key, data[key].toString());
          }
        });
        
        return await apiRequest<Destination>('destinations/', {
          method: 'POST',
          body: formData,
        });
      } else {
        // Use JSON for non-file data
        return await apiRequest<Destination>('destinations/', {
          method: 'POST',
          body: JSON.stringify(data),
        });
      }
    },

    update: async (id: number, data: any): Promise<Destination> => {
      // Check if data contains file uploads
      const hasFileUpload = data.image instanceof File;
      
      if (hasFileUpload) {
        // Use FormData for file uploads
        const formData = new FormData();
        Object.keys(data).forEach(key => {
          if (key === 'image' && data[key] instanceof File) {
            formData.append(key, data[key]);
          } else if (data[key] !== null && data[key] !== undefined) {
            formData.append(key, data[key].toString());
          }
        });
        
        return await apiRequest<Destination>(`destinations/${id}/`, {
          method: 'PUT',
          body: formData,
        });
      } else {
        // Use JSON for non-file data
        return await apiRequest<Destination>(`destinations/${id}/`, {
          method: 'PUT',
          body: JSON.stringify(data),
        });
      }
    },

    delete: async (id: number): Promise<void> => {
      return await apiRequest<void>(`destinations/${id}/`, {
        method: 'DELETE',
      });
    },
  },

  experiences: {
    getAll: async (filters?: ExperienceFilters): Promise<Experience[]> => {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString());
          }
        });
      }
      const endpoint = `experiences/${params.toString() ? `?${params.toString()}` : ''}`;
      const data = await publicApiRequest<any>(endpoint, {}, true, performance.cacheTimeout.medium);
      const results = data?.results || data;
      return results || [];
    },

    getFeatured: async (): Promise<Experience[]> => {
      const data = await publicApiRequest<any>('experiences/?featured=true', {}, true, performance.cacheTimeout.medium);
      const results = data?.results || data;
      return results || [];
    },

    getById: async (id: number): Promise<Experience> => {
      return await publicApiRequest<Experience>(`experiences/${id}/`, {}, true, performance.cacheTimeout.medium);
    },

    create: async (data: any): Promise<Experience> => {
      // Check if data contains file uploads
      const hasFileUpload = data.image instanceof File;
      
      if (hasFileUpload) {
        // Use FormData for file uploads
        const formData = new FormData();
        Object.keys(data).forEach(key => {
          if (key === 'image' && data[key] instanceof File) {
            formData.append(key, data[key]);
          } else if (Array.isArray(data[key])) {
            // Handle arrays (like includes, excludes, requirements)
            data[key].forEach((item: any, index: number) => {
              formData.append(`${key}[${index}]`, item);
            });
          } else if (data[key] !== null && data[key] !== undefined) {
            formData.append(key, data[key].toString());
          }
        });
        
        return await apiRequest<Experience>('experiences/', {
          method: 'POST',
          body: formData,
          headers: {
            // Don't set Content-Type - let browser set it with boundary
          },
        });
      } else {
        // Use JSON for non-file data
        return await apiRequest<Experience>('experiences/', {
          method: 'POST',
          body: JSON.stringify(data),
        });
      }
    },

    update: async (id: number, data: any): Promise<Experience> => {
      // Check if data contains file uploads
      const hasFileUpload = data.image instanceof File;
      
      if (hasFileUpload) {
        // Use FormData for file uploads
        const formData = new FormData();
        Object.keys(data).forEach(key => {
          if (key === 'image' && data[key] instanceof File) {
            formData.append(key, data[key]);
          } else if (Array.isArray(data[key])) {
            // Handle arrays (like includes, excludes, requirements)
            data[key].forEach((item: any, index: number) => {
              formData.append(`${key}[${index}]`, item);
            });
          } else if (data[key] !== null && data[key] !== undefined) {
            formData.append(key, data[key].toString());
          }
        });
        
        return await apiRequest<Experience>(`experiences/${id}/`, {
          method: 'PUT',
          body: formData,
          headers: {
            // Don't set Content-Type - let browser set it with boundary
          },
        });
      } else {
        // Use JSON for non-file data
        return await apiRequest<Experience>(`experiences/${id}/`, {
          method: 'PUT',
          body: JSON.stringify(data),
        });
      }
    },

    delete: async (id: number): Promise<void> => {
      return await apiRequest<void>(`experiences/${id}/`, {
        method: 'DELETE',
      });
    },
  },

  // Authentication
  auth: {
    login: async (credentials: { username: string; password: string }): Promise<{ user: User; tokens: AuthTokens }> => {
      const data = await apiRequest<{ user: User; tokens: AuthTokens }>('auth/login/', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      
      tokenStorage.setTokens(data.tokens);
      return data;
    },

    logout: async (): Promise<void> => {
      try {
        await apiRequest<void>('auth/logout/', { method: 'POST' });
      } finally {
        tokenStorage.clearTokens();
        cacheUtils.clear();
      }
    },

    getCurrentUser: async (): Promise<User> => {
      const data = await apiRequest<User>('auth/user/', {}, true, performance.cacheTimeout.short);
      return data;
    },

    isAuthenticated: (): boolean => tokenStorage.isAuthenticated(),
  },

  // Search
  search: {
    global: async (query: string): Promise<{ properties: any[]; packages: any[] }> => {
      if (!query.trim()) {
        return { properties: [], packages: [] };
      }

      const sanitizedQuery = sanitizeInput(query, 100);
      const encodedQuery = encodeURIComponent(sanitizedQuery);
      
      try {
        const [properties, packages] = await Promise.all([
          publicApiRequest<any>(`properties/?search=${encodedQuery}`, {}, true, performance.cacheTimeout.short),
          publicApiRequest<any>(`packages/?search=${encodedQuery}`, {}, true, performance.cacheTimeout.short),
        ]);

        return {
          properties: Array.isArray(properties?.results || properties) ? (properties?.results || properties).map(transformProperty) : [],
          packages: Array.isArray(packages?.results || packages) ? (packages?.results || packages).map(transformPackage) : [],
        };
      } catch (error) {
        console.error('Search failed:', error);
        return { properties: [], packages: [] };
      }
    },
  },

  // Bookings
  bookings: {
    create: async (bookingData: BookingFormData): Promise<Booking> => {
      const sanitizedData = {
        ...bookingData,
        customer_name: sanitizeInput(bookingData.customer_name, security.sanitization.maxLength.name),
        special_requests: bookingData.special_requests 
          ? sanitizeInput(bookingData.special_requests, security.sanitization.maxLength.comment)
          : undefined,
      };

      const data = await apiRequest<Booking>('bookings/', {
        method: 'POST',
        body: JSON.stringify(sanitizedData),
      });
      return data;
    },

    getAll: async (): Promise<Booking[]> => {
      const data = await apiRequest<any>('bookings/', {}, true, performance.cacheTimeout.short);
      // Handle paginated response
      const results = data?.results || data;
      return Array.isArray(results) ? results : [];
    },

    getById: async (id: number): Promise<Booking> => {
      const data = await apiRequest<Booking>(`bookings/${id}/`, {}, true, performance.cacheTimeout.short);
      return data;
    },

    updateStatus: async (id: number, status: 'confirmed' | 'cancelled'): Promise<Booking> => {
      cacheUtils.invalidate('bookings');
      const data = await apiRequest<Booking>(`bookings/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      return data;
    },
  },

  // Utilities
  utils: {
    clearCache: cacheUtils.clear,
    invalidateCache: cacheUtils.invalidate,
    isAuthenticated: tokenStorage.isAuthenticated,
    getAccessToken: tokenStorage.getAccessToken,
    
    getOptimizedImageUrl: (url: string, size: 'thumbnail' | 'card' | 'hero' | 'gallery' = 'card'): string => {
      if (!url || url.startsWith('data:')) return url;
      
      const { width, height } = performance.imageSizes[size];
      const quality = performance.imageQuality;
      
      if (url.includes('unsplash.com')) {
        return `${url}&w=${width}&h=${height}&q=${quality}&fit=crop&crop=center`;
      }
      
      return url;
    },

    formatPrice: (price: string | number): string => {
      const numPrice = typeof price === 'string' ? parseFloat(price) : price;
      if (isNaN(numPrice)) return '$0.00';
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(numPrice);
    },

    sanitizeInput,
    
    getWhatsAppUrl: (message: string): string => getWhatsAppUrl(message),

    isNetworkError: (error: any): boolean => error?.status === 0,
    isServerError: (error: any): boolean => error?.status && error.status >= 500,
  },
};

export default unifiedApi; 