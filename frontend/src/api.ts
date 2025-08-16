import { config } from './config';

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
    const response = await fetch(url, secureOptions);
    
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
      if (response.status === 403) {
        throw new Error('Access denied. You do not have permission to perform this action.');
      } else if (response.status >= 500) {
        throw new Error('Server error. Please try again later.');
      } else {
        throw new Error(`Request failed: ${response.status} ${response.statusText}`);
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
  const response = await secureRequest(`${API_BASE}/${cleanPath}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.json();
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