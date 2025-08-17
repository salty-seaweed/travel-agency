// Centralized configuration management
import type { AppConfig } from '../types';

// Environment detection
const isDevelopment = import.meta.env.MODE === 'development';
const isProduction = import.meta.env.MODE === 'production';
const isTesting = import.meta.env.MODE === 'test';

// Detect if we're accessing through ngrok
const isNgrokAccess = window.location.hostname.includes('ngrok-free.app') || 
                     window.location.hostname.includes('ngrok.io') ||
                     window.location.hostname.includes('ngrok.app');

// API Configuration
const API_CONFIG = {
  development: {
    baseUrl: isNgrokAccess 
      ? `${window.location.protocol}//${window.location.host}/api`  // Use ngrok URL when accessing through ngrok
      : import.meta.env.VITE_API_BASE_URL || '/api',
    timeout: 10000,
  },
  production: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
    timeout: 30000,
  },
  test: {
    baseUrl: '/api',
    timeout: 5000,
  },
} as const;

// Application Configuration
export const config: AppConfig = {
  // API Settings
  apiBaseUrl: isDevelopment 
    ? API_CONFIG.development.baseUrl 
    : isProduction 
    ? API_CONFIG.production.baseUrl 
    : API_CONFIG.test.baseUrl,
  
  // Contact Information
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || '+9607441097',
  supportEmail: import.meta.env.VITE_SUPPORT_EMAIL || 'support@threadtravels.com',
  companyName: import.meta.env.VITE_COMPANY_NAME || 'Thread Travels & Tours',
  
  // File Upload Settings
  maxImageSize: parseInt(import.meta.env.VITE_MAX_IMAGE_SIZE || '5242880'), // 5MB default
  
  // Pagination Settings
  defaultPageSize: parseInt(import.meta.env.VITE_DEFAULT_PAGE_SIZE || '12'),
} as const;

// Feature Flags
export const features = {
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  enablePWA: import.meta.env.VITE_ENABLE_PWA === 'true',
  enableOfflineMode: import.meta.env.VITE_ENABLE_OFFLINE === 'true',
  enableDebugMode: isDevelopment,
  enableMockData: import.meta.env.VITE_USE_MOCK_DATA === 'true',
} as const;

// Performance Configuration
export const performance = {
  // Image optimization
  imageQuality: 80,
  imageSizes: {
    thumbnail: { width: 150, height: 150 },
    card: { width: 400, height: 300 },
    hero: { width: 1920, height: 1080 },
    gallery: { width: 800, height: 600 },
  },
  
  // Caching
  cacheTimeout: {
    short: 5 * 60 * 1000, // 5 minutes
    medium: 30 * 60 * 1000, // 30 minutes
    long: 24 * 60 * 60 * 1000, // 24 hours
  },
  
  // Request settings
  apiTimeout: isDevelopment ? 10000 : 30000,
  retryAttempts: 3,
  retryDelay: 1000,
} as const;

// UI Configuration
export const ui = {
  // Animation settings
  animation: {
    duration: {
      fast: 150,
      normal: 300,
      slow: 500,
    },
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  
  // Notification settings
  notification: {
    defaultDuration: 5000,
    position: 'top-right' as const,
    maxVisible: 3,
  },
  
  // Modal settings
  modal: {
    closeOnOverlayClick: true,
    closeOnEscape: true,
    preventScroll: true,
  },
  
  // Theme settings
  theme: {
    colorScheme: 'light' as const,
    enableDarkMode: false,
  },
} as const;

// Security Configuration
export const security = {
  // Content Security Policy
  csp: {
    'default-src': ["'self'"],
    'img-src': ["'self'", 'data:', 'blob:', 'http://localhost:8000', 'https://images.unsplash.com', 'https://via.placeholder.com'],
    'script-src': ["'self'", "'unsafe-inline'"],
    'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
    'font-src': ["'self'", 'https://fonts.gstatic.com'],
    'connect-src': ["'self'", config.apiBaseUrl],
  },
  
  // Input sanitization
  sanitization: {
    allowedTags: ['b', 'i', 'em', 'strong', 'p', 'br'],
    maxLength: {
      name: 100,
      description: 1000,
      comment: 500,
      email: 254,
      phone: 20,
    },
  },
} as const;

// Validation Rules
export const validation = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[\d\s\-\(\)]+$/,
  price: /^\d+(\.\d{1,2})?$/,
  url: /^https?:\/\/.+/,
  
  // Length constraints
  minLengths: {
    name: 2,
    description: 10,
    password: 8,
    comment: 5,
  },
  
  maxLengths: {
    name: 100,
    description: 1000,
    comment: 500,
    email: 254,
    phone: 20,
  },
} as const;

// External Service URLs
export const externalServices = {
  whatsapp: {
    baseUrl: 'https://wa.me',
    getUrl: (message: string) => 
      `${externalServices.whatsapp.baseUrl}/${config.whatsappNumber.replace('+', '')}?text=${encodeURIComponent(message)}`,
  },
  
  maps: {
    provider: 'openstreetmap' as const,
    attribution: '© OpenStreetMap contributors',
  },
  
  analytics: {
    gtag: import.meta.env.VITE_GA_TRACKING_ID,
    enabled: features.enableAnalytics && !!import.meta.env.VITE_GA_TRACKING_ID,
  },
} as const;

// Error Messages
export const errorMessages = {
  network: 'Network error. Please check your connection and try again.',
  server: 'Server error. Please try again later.',
  unauthorized: 'You are not authorized to perform this action.',
  forbidden: 'Access denied. You do not have permission to perform this action.',
  notFound: 'The requested resource was not found.',
  validation: 'Please check your input and try again.',
  unknown: 'An unexpected error occurred. Please try again.',
  
  // Form validation messages
  form: {
    required: 'This field is required',
    email: 'Please enter a valid email address',
    phone: 'Please enter a valid phone number',
    minLength: (min: number) => `Minimum ${min} characters required`,
    maxLength: (max: number) => `Maximum ${max} characters allowed`,
    price: 'Please enter a valid price',
    url: 'Please enter a valid URL',
  },
} as const;

// Success Messages
export const successMessages = {
  save: 'Successfully saved!',
  update: 'Successfully updated!',
  delete: 'Successfully deleted!',
  create: 'Successfully created!',
  submit: 'Successfully submitted!',
  login: 'Successfully logged in!',
  logout: 'Successfully logged out!',
  register: 'Account created successfully!',
  booking: 'Booking request sent successfully!',
  review: 'Review submitted successfully!',
} as const;

// Default Data
export const defaults = {
  // Default images for fallbacks
  images: {
    property: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop&crop=center&auto=format&q=80',
    package: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop&crop=center&auto=format&q=80',
    avatar: 'https://via.placeholder.com/150x150/e2e8f0/64748b?text=User',
  },
  
  // Default package highlights
  packageHighlights: [
    'All-inclusive',
    'Water activities',
    'Local tours',
    'Island hopping',
    'Snorkeling',
    'Sunset cruises',
  ],
  
  // Default package included items
  packageIncluded: [
    'Accommodation',
    'Meals',
    'Transfers',
    'Activities',
    'Local guide',
    'Equipment',
  ],
  
  // Default property amenities
  propertyAmenities: [
    'WiFi',
    'Ocean View',
    'Private Beach',
    'Pool',
    'Restaurant',
    'Spa',
  ],
} as const;

// Environment-specific overrides
if (isDevelopment) {
  // Development-specific configuration
  Object.assign(config, {
    // Add any dev-specific overrides here
  });
}

if (isProduction) {
  // Production-specific configuration
  Object.assign(config, {
    // Add any prod-specific overrides here
  });
}

// Export configuration groups
export {
  isDevelopment,
  isProduction,
  isTesting,
};

// Utility functions for configuration
export const getApiUrl = (endpoint: string): string => {
  const baseUrl = config.apiBaseUrl.endsWith('/') 
    ? config.apiBaseUrl.slice(0, -1) 
    : config.apiBaseUrl;
  
  if (!endpoint) return baseUrl;
  
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${baseUrl}/${cleanEndpoint}`;
};

export const getWhatsAppUrl = (message: string): string => {
  return externalServices.whatsapp.getUrl(message);
};

export const validateConfig = (): boolean => {
  const required = [
    config.apiBaseUrl,
    config.whatsappNumber,
    config.supportEmail,
    config.companyName,
  ];
  
  return required.every(value => value && value.length > 0);
};

// Log configuration in development
if (isDevelopment) {
  console.group('🔧 App Configuration');
  console.log('Environment:', import.meta.env.MODE);
  console.log('API Base URL:', config.apiBaseUrl);
  console.log('Features:', features);
  console.log('Valid Config:', validateConfig());
  console.groupEnd();
} 