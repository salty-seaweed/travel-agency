import { config } from './config';
import { apiRequest } from './services/unified-api';

// Get the base API URL without trailing slash
const API_BASE = config.apiBaseUrl.replace(/\/$/, '');

// Security configuration
const TOKEN_EXPIRY_BUFFER = 5 * 60 * 1000; // 5 minutes before expiry
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Token management
function getToken() {
  return localStorage.getItem('access');
}

function getRefreshToken() {
  return localStorage.getItem('refresh');
}

function setTokens(access: string, refresh: string) {
  localStorage.setItem('access', access);
  localStorage.setItem('refresh', refresh);
}

function clearTokens() {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
}

// Token validation
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiryTime = payload.exp * 1000; // Convert to milliseconds
    return Date.now() >= (expiryTime - TOKEN_EXPIRY_BUFFER);
  } catch (error) {
    return true; // If we can't parse the token, consider it expired
  }
}

// Token refresh
async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    clearTokens();
    return false;
  }

  try {
    const response = await fetch(`${API_BASE}/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      clearTokens();
      return false;
    }

    const data = await response.json();
    setTokens(data.access, data.refresh || refreshToken);
    return true;
  } catch (error) {
    clearTokens();
    return false;
  }
}

// Public (non-authenticated) request wrapper
export async function apiPublicGet(path: string) {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const response = await fetch(`${API_BASE}/${cleanPath}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'Accept': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function apiPublicPost(path: string, data: any) {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const response = await fetch(`${API_BASE}/${cleanPath}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

// Secure request wrapper
async function secureRequest(
  url: string, 
  options: RequestInit = {}, 
  retryCount = 0
): Promise<Response> {
  let token = getToken();
  
  // Check if token is expired and refresh if needed
  if (token && isTokenExpired(token)) {
    const refreshed = await refreshAccessToken();
    if (!refreshed) {
      // Redirect to login if refresh fails
      window.location.href = '/admin/login';
      throw new Error('Authentication required');
    }
    token = getToken();
  }

  // Add security headers
  const secureOptions: RequestInit = {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest', // CSRF protection
      ...options.headers,
    },
  };

  try {
    console.log('🔧 [SECURE REQUEST] Making request to:', url);
    console.log('🔧 [SECURE REQUEST] Request options:', {
      method: secureOptions.method,
      headers: secureOptions.headers,
      body: secureOptions.body ? 'Present' : 'None'
    });

    const response = await fetch(url, secureOptions);

    console.log('🔧 [SECURE REQUEST] Response received:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries())
    });

    // Handle 401 Unauthorized
    if (response.status === 401 && retryCount < MAX_RETRIES) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        // Retry the request with new token
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return secureRequest(url, options, retryCount + 1);
      } else {
        clearTokens();
        window.location.href = '/ttm/login';
        throw new Error('Authentication required');
      }
    }

    // Handle other errors
    if (!response.ok) {
      let errorMessage = `Request failed: ${response.status} ${response.statusText}`;
      
      // Try to get detailed error information from response body
      try {
        const errorData = await response.clone().json();
        if (errorData && typeof errorData === 'object') {
          if (errorData.detail) {
            errorMessage = errorData.detail;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          } else if (typeof errorData === 'object') {
            // Handle validation errors
            const validationErrors = Object.entries(errorData)
              .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
              .join('; ');
            if (validationErrors) {
              errorMessage = `Validation errors: ${validationErrors}`;
            }
          }
        }
      } catch (e) {
        // If we can't parse the error response, use the default message
      }
      
      if (response.status === 403) {
        throw new Error('Access denied. You do not have permission to perform this action.');
      } else if (response.status >= 500) {
        throw new Error('Server error. Please try again later.');
      } else {
        throw new Error(errorMessage);
      }
    }

    return response;
  } catch (error) {
    if (error instanceof Error && error.message === 'Authentication required') {
      throw error;
    }
    
    // Network errors
    if (error instanceof TypeError) {
      throw new Error('Network error. Please check your connection.');
    }
    
    throw error;
  }
}

// Enhanced API functions with security
export async function apiGet(path: string) {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const response = await secureRequest(`${API_BASE}/${cleanPath}`);
  return response.json();
}

export async function apiPost(path: string, data: any) {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  console.log('🚀 [API POST] Starting request:', `${API_BASE}/${cleanPath}`);
  console.log('🚀 [API POST] Request data:', data);
  console.log('🚀 [API POST] API_BASE:', API_BASE);

  try {
    const response = await secureRequest(`${API_BASE}/${cleanPath}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    console.log('✅ [API POST] Response status:', response.status);
    console.log('✅ [API POST] Response ok:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [API POST] Error response:', errorText);
      throw new Error(`Request failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ [API POST] Success response:', result);
    return result;
  } catch (error) {
    console.error('❌ [API POST] Request failed:', error);
    throw error;
  }
}

export async function apiPut(path: string, data: any) {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const response = await secureRequest(`${API_BASE}/${cleanPath}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function apiDelete(path: string) {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const response = await secureRequest(`${API_BASE}/${cleanPath}`, {
    method: 'DELETE',
  });
  return response;
}

export async function apiUpload(path: string, formData: FormData) {
  const token = getToken();
  
  if (token && isTokenExpired(token)) {
    const refreshed = await refreshAccessToken();
    if (!refreshed) {
      window.location.href = '/ttm/login';
      throw new Error('Authentication required');
    }
  }

  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const response = await fetch(`${API_BASE}/${cleanPath}`, {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${getToken()}`,
      'X-Requested-With': 'XMLHttpRequest',
    },
    body: formData,
  });

  if (!response.ok) {
    if (response.status === 401) {
      clearTokens();
      window.location.href = '/ttm/login';
      throw new Error('Authentication required');
    }
    throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Authentication utilities
export function isAuthenticated(): boolean {
  const token = getToken();
  return token !== null && !isTokenExpired(token);
}

export function logout() {
  clearTokens();
  window.location.href = '/ttm/login';
}

// Export for use in components
export { clearTokens, refreshAccessToken };

// Resort API functions
export async function getResorts(filters?: {
  category?: string;
  star_rating?: number;
  atoll?: string;
  min_price?: number;
  max_price?: number;
  adults_only?: boolean;
  family_friendly?: boolean;
  honeymoon?: boolean;
  eco_friendly?: boolean;
  search?: string;
  is_featured?: boolean;
  page?: number;
  page_size?: number;
  country?: string;
}): Promise<PaginatedResponse<Resort>> {
  const params = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
  }
  
  const queryString = params.toString();
  const endpoint = queryString ? `/resorts/?${queryString}` : `/resorts/`;
  
  const response = await apiRequest(endpoint);
  return response;
}

export async function getResort(id: number, country?: string): Promise<Resort> {
  const endpoint = country ? `/resorts/${id}/?country=${country}` : `/resorts/${id}/`;
  const response = await apiRequest(endpoint);
  return response;
}

export async function getResortsByCategory(country?: string): Promise<Record<string, {
  name: string;
  resorts: Resort[];
  count: number;
}>> {
  const endpoint = country ? `/resorts/by-category/?country=${country}` : `/resorts/by-category/`;
  const response = await apiRequest(endpoint);
  return response;
}

export async function getResortsByAtoll(country?: string): Promise<Record<string, {
  resorts: Resort[];
  count: number;
}>> {
  const endpoint = country ? `/resorts/by-atoll/?country=${country}` : `/resorts/by-atoll/`;
  const response = await apiRequest(endpoint);
  return response;
}

export async function getFeaturedResorts(country?: string): Promise<Resort[]> {
  const endpoint = country ? `/resorts/featured/?country=${country}` : `/resorts/featured/`;
  const response = await apiRequest(endpoint);
  return response;
}

export async function getResortImages(resortId: number): Promise<ResortImage[]> {
  const response = await apiRequest(`/resort-images/?resort=${resortId}`);
  return response.results || response;
}

export async function getResortReviews(resortId: number): Promise<ResortReview[]> {
  const response = await apiRequest(`/resort-reviews/?resort=${resortId}`);
  return response.results || response;
}

export async function getResortAmenities(): Promise<ResortAmenity[]> {
  const response = await apiRequest(`/resort-amenities/`);
  return response.results || response;
}

export async function createResortReview(reviewData: ResortReviewFormData): Promise<ResortReview> {
  const response = await apiRequest(`/resort-reviews/`, {
    method: 'POST',
    body: JSON.stringify(reviewData),
  });
  return response;
}

export async function updateResortReview(id: number, reviewData: Partial<ResortReviewFormData>): Promise<ResortReview> {
  const response = await apiRequest(`/resort-reviews/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(reviewData),
  });
  return response;
}

export async function deleteResortReview(id: number): Promise<void> {
  await apiRequest(`/resort-reviews/${id}/`, {
    method: 'DELETE',
  });
}

// Admin functions for resort management
export async function createResort(resortData: ResortFormData): Promise<Resort> {
  const formData = new FormData();
  
  // Add all form fields to FormData
  Object.entries(resortData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (key === 'hero_image' && value instanceof File) {
        formData.append(key, value);
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          formData.append(`${key}[${index}]`, item);
        });
      } else if (typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value.toString());
      }
    }
  });
  
  const response = await apiRequest(`/resorts/`, {
    method: 'POST',
    body: formData,
  });
  return response;
}

export async function updateResort(id: number, resortData: Partial<ResortFormData>): Promise<Resort> {
  const formData = new FormData();
  
  // Add only provided fields to FormData
  Object.entries(resortData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (key === 'hero_image' && value instanceof File) {
        formData.append(key, value);
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          formData.append(`${key}[${index}]`, item);
        });
      } else if (typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value.toString());
      }
    }
  });
  
  const response = await apiRequest(`/resorts/${id}/`, {
    method: 'PATCH',
    body: formData,
  });
  return response;
}

export async function deleteResort(id: number): Promise<void> {
  await apiRequest(`/resorts/${id}/`, {
    method: 'DELETE',
  });
}

export async function uploadResortImage(resortId: number, imageData: {
  image: File;
  image_type: ResortImage['image_type'];
  caption?: string;
  alt_text?: string;
  order?: number;
  is_featured?: boolean;
}): Promise<ResortImage> {
  const formData = new FormData();
  formData.append('resort', resortId.toString());
  formData.append('image', imageData.image);
  formData.append('image_type', imageData.image_type);
  
  if (imageData.caption) formData.append('caption', imageData.caption);
  if (imageData.alt_text) formData.append('alt_text', imageData.alt_text);
  if (imageData.order !== undefined) formData.append('order', imageData.order.toString());
  if (imageData.is_featured !== undefined) formData.append('is_featured', imageData.is_featured.toString());
  
  const response = await apiRequest(`/resort-images/`, {
    method: 'POST',
    body: formData,
  });
  return response;
}

export async function updateResortImage(id: number, imageData: Partial<{
  image: File;
  image_type: ResortImage['image_type'];
  caption: string;
  alt_text: string;
  order: number;
  is_featured: boolean;
  is_active: boolean;
}>): Promise<ResortImage> {
  const formData = new FormData();
  
  Object.entries(imageData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (key === 'image' && value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, value.toString());
      }
    }
  });
  
  const response = await apiRequest(`/resort-images/${id}/`, {
    method: 'PATCH',
    body: formData,
  });
  return response;
}

export async function deleteResortImage(id: number): Promise<void> {
  await apiRequest(`/resort-images/${id}/`, {
    method: 'DELETE',
  });
} 