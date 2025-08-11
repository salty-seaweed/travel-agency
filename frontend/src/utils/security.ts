// Security utilities for input validation and sanitization
import { validation, security } from '../config';

// XSS prevention utilities
export const sanitizeHtml = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  
  // Remove dangerous HTML elements and attributes
  let sanitized = input
    // Remove script tags
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove javascript: URLs
    .replace(/javascript:/gi, '')
    // Remove on* event handlers
    .replace(/on\w+\s*=/gi, '')
    // Remove data: URLs (except images)
    .replace(/data:(?!image\/)/gi, '')
    // Remove style attributes
    .replace(/style\s*=/gi, '')
    // Remove link tags
    .replace(/<link\b[^>]*>/gi, '')
    // Remove meta tags
    .replace(/<meta\b[^>]*>/gi, '')
    // Remove object/embed tags
    .replace(/<(object|embed|applet)\b[^>]*>.*?<\/\1>/gi, '');
  
  return sanitized.trim();
};

// Input sanitization for different data types
export const sanitizeInput = {
  // General text input
  text: (input: string, maxLength?: number): string => {
    if (!input || typeof input !== 'string') return '';
    
    let sanitized = sanitizeHtml(input);
    
    // Apply length limit
    if (maxLength && sanitized.length > maxLength) {
      sanitized = sanitized.substring(0, maxLength);
    }
    
    return sanitized;
  },
  
  // Email input
  email: (input: string): string => {
    if (!input || typeof input !== 'string') return '';
    
    // Remove potentially dangerous characters
    const sanitized = input
      .toLowerCase()
      .trim()
      .replace(/[<>"/\\]/g, '');
    
    // Apply max length
    return sanitized.length > security.sanitization.maxLength.email 
      ? sanitized.substring(0, security.sanitization.maxLength.email)
      : sanitized;
  },
  
  // Phone number input
  phone: (input: string): string => {
    if (!input || typeof input !== 'string') return '';
    
    // Keep only digits, +, -, space, and parentheses
    const sanitized = input
      .trim()
      .replace(/[^+\d\s\-\(\)]/g, '');
    
    // Apply max length
    return sanitized.length > security.sanitization.maxLength.phone
      ? sanitized.substring(0, security.sanitization.maxLength.phone)
      : sanitized;
  },
  
  // Name input (for person names)
  name: (input: string): string => {
    if (!input || typeof input !== 'string') return '';
    
    // Allow letters, spaces, hyphens, and apostrophes
    const sanitized = input
      .trim()
      .replace(/[^a-zA-Z\s\-']/g, '');
    
    // Apply max length
    return sanitized.length > security.sanitization.maxLength.name
      ? sanitized.substring(0, security.sanitization.maxLength.name)
      : sanitized;
  },
  
  // URL input
  url: (input: string): string => {
    if (!input || typeof input !== 'string') return '';
    
    // Remove dangerous protocols
    let sanitized = input
      .trim()
      .replace(/^(javascript|data|vbscript|file):/gi, '');
    
    // Ensure HTTP/HTTPS protocol if missing
    if (sanitized && !sanitized.match(/^https?:\/\//i)) {
      sanitized = 'https://' + sanitized.replace(/^\/+/, '');
    }
    
    return sanitized;
  },
  
  // Search query input
  search: (input: string): string => {
    if (!input || typeof input !== 'string') return '';
    
    // Remove potentially dangerous characters but keep search-friendly ones
    const sanitized = input
      .trim()
      .replace(/[<>"/\\]/g, '')
      .replace(/\s+/g, ' '); // Normalize whitespace
    
    // Apply reasonable max length for search
    return sanitized.length > 100 ? sanitized.substring(0, 100) : sanitized;
  },
  
  // Number input
  number: (input: string | number): number => {
    if (typeof input === 'number') return isNaN(input) ? 0 : input;
    if (typeof input !== 'string') return 0;
    
    // Remove non-numeric characters except decimal point
    const sanitized = input.replace(/[^\d.-]/g, '');
    const parsed = parseFloat(sanitized);
    
    return isNaN(parsed) ? 0 : parsed;
  },
  
  // Price input
  price: (input: string | number): number => {
    const num = sanitizeInput.number(input);
    // Ensure positive price with max 2 decimal places
    return Math.max(0, Math.round(num * 100) / 100);
  },
};

// Input validation utilities
export const validateInput = {
  // Email validation
  email: (email: string): boolean => {
    if (!email || typeof email !== 'string') return false;
    return validation.email.test(email);
  },
  
  // Phone validation
  phone: (phone: string): boolean => {
    if (!phone || typeof phone !== 'string') return false;
    return validation.phone.test(phone);
  },
  
  // URL validation
  url: (url: string): boolean => {
    if (!url || typeof url !== 'string') return false;
    return validation.url.test(url);
  },
  
  // Price validation
  price: (price: string | number): boolean => {
    const num = typeof price === 'string' ? parseFloat(price) : price;
    return !isNaN(num) && num >= 0;
  },
  
  // Required field validation
  required: (value: any): boolean => {
    if (typeof value === 'string') return value.trim().length > 0;
    if (typeof value === 'number') return !isNaN(value);
    if (Array.isArray(value)) return value.length > 0;
    return value != null;
  },
  
  // Length validation
  length: (value: string, min?: number, max?: number): boolean => {
    if (!value || typeof value !== 'string') return false;
    const length = value.trim().length;
    
    if (min !== undefined && length < min) return false;
    if (max !== undefined && length > max) return false;
    
    return true;
  },
  
  // Rating validation (1-5)
  rating: (rating: number): boolean => {
    return typeof rating === 'number' && rating >= 1 && rating <= 5;
  },
  
  // Date validation
  date: (date: string): boolean => {
    if (!date || typeof date !== 'string') return false;
    const parsed = new Date(date);
    return !isNaN(parsed.getTime()) && parsed > new Date();
  },
};

// Form validation helper
export const validateForm = (
  data: Record<string, any>,
  rules: Record<string, {
    required?: boolean;
    type?: 'email' | 'phone' | 'url' | 'number' | 'date';
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    custom?: (value: any) => boolean;
  }>
): { isValid: boolean; errors: Record<string, string[]> } => {
  const errors: Record<string, string[]> = {};
  
  Object.entries(rules).forEach(([field, rule]) => {
    const value = data[field];
    const fieldErrors: string[] = [];
    
    // Required validation
    if (rule.required && !validateInput.required(value)) {
      fieldErrors.push('This field is required');
    }
    
    // Skip other validations if field is empty and not required
    if (!validateInput.required(value) && !rule.required) {
      return;
    }
    
    // Type validation
    if (rule.type) {
      switch (rule.type) {
        case 'email':
          if (!validateInput.email(value)) {
            fieldErrors.push('Please enter a valid email address');
          }
          break;
        case 'phone':
          if (!validateInput.phone(value)) {
            fieldErrors.push('Please enter a valid phone number');
          }
          break;
        case 'url':
          if (!validateInput.url(value)) {
            fieldErrors.push('Please enter a valid URL');
          }
          break;
        case 'number':
          if (isNaN(Number(value))) {
            fieldErrors.push('Please enter a valid number');
          }
          break;
        case 'date':
          if (!validateInput.date(value)) {
            fieldErrors.push('Please enter a valid future date');
          }
          break;
      }
    }
    
    // Length validation
    if (typeof value === 'string') {
      if (rule.minLength && value.length < rule.minLength) {
        fieldErrors.push(`Minimum ${rule.minLength} characters required`);
      }
      if (rule.maxLength && value.length > rule.maxLength) {
        fieldErrors.push(`Maximum ${rule.maxLength} characters allowed`);
      }
    }
    
    // Number range validation
    if (typeof value === 'number' || !isNaN(Number(value))) {
      const num = Number(value);
      if (rule.min !== undefined && num < rule.min) {
        fieldErrors.push(`Minimum value is ${rule.min}`);
      }
      if (rule.max !== undefined && num > rule.max) {
        fieldErrors.push(`Maximum value is ${rule.max}`);
      }
    }
    
    // Custom validation
    if (rule.custom && !rule.custom(value)) {
      fieldErrors.push('Invalid value');
    }
    
    if (fieldErrors.length > 0) {
      errors[field] = fieldErrors;
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// CSRF token utilities
export const csrfUtils = {
  // Get CSRF token from meta tag or generate one
  getToken: (): string => {
    const metaToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (metaToken) return metaToken;
    
    // Generate a simple token for client-side use
    return btoa(Math.random().toString(36).substring(2) + Date.now().toString(36));
  },
  
  // Add CSRF token to headers
  addToHeaders: (headers: Record<string, string> = {}): Record<string, string> => {
    return {
      ...headers,
      'X-CSRF-Token': csrfUtils.getToken(),
    };
  },
};

// Content Security Policy utilities
export const cspUtils = {
  // Check if URL is allowed by CSP
  isAllowedUrl: (url: string, type: 'img' | 'script' | 'style' | 'connect' = 'connect'): boolean => {
    const allowedDomains = {
      img: ['images.unsplash.com', 'via.placeholder.com'],
      script: [],
      style: ['fonts.googleapis.com'],
      connect: ['api.unsplash.com'],
    };
    
    try {
      const urlObj = new URL(url);
      return allowedDomains[type].some(domain => urlObj.hostname.endsWith(domain));
    } catch {
      return false;
    }
  },
  
  // Sanitize URL for use in CSP-compliant context
  sanitizeUrl: (url: string): string => {
    if (!url) return '';
    
    try {
      const urlObj = new URL(url);
      
      // Only allow HTTPS
      if (urlObj.protocol !== 'https:') {
        urlObj.protocol = 'https:';
      }
      
      return urlObj.toString();
    } catch {
      return '';
    }
  },
};

// Rate limiting utilities (client-side)
export const rateLimitUtils = {
  // Simple rate limiter for API calls
  createLimiter: (maxRequests: number, windowMs: number) => {
    const requests: number[] = [];
    
    return {
      isAllowed: (): boolean => {
        const now = Date.now();
        
        // Remove old requests outside the window
        while (requests.length > 0 && requests[0] <= now - windowMs) {
          requests.shift();
        }
        
        // Check if we're under the limit
        if (requests.length < maxRequests) {
          requests.push(now);
          return true;
        }
        
        return false;
      },
      
      timeUntilReset: (): number => {
        if (requests.length === 0) return 0;
        return Math.max(0, requests[0] + windowMs - Date.now());
      },
    };
  },
};

// Local storage security utilities
export const storageUtils = {
  // Secure local storage with encryption (basic)
  setSecure: (key: string, value: any): void => {
    try {
      const encoded = btoa(JSON.stringify(value));
      localStorage.setItem(key, encoded);
    } catch (error) {
      console.error('Failed to store data securely:', error);
    }
  },
  
  getSecure: (key: string): any => {
    try {
      const encoded = localStorage.getItem(key);
      if (!encoded) return null;
      
      return JSON.parse(atob(encoded));
    } catch (error) {
      console.error('Failed to retrieve data securely:', error);
      return null;
    }
  },
  
  removeSecure: (key: string): void => {
    localStorage.removeItem(key);
  },
  
  // Clear sensitive data on page unload
  clearOnUnload: (keys: string[]): void => {
    window.addEventListener('beforeunload', () => {
      keys.forEach(key => localStorage.removeItem(key));
    });
  },
};

// Security monitoring utilities
export const securityMonitor = {
  // Log security events
  logSecurityEvent: (event: string, details: any = {}): void => {
    console.warn(`🔒 Security Event: ${event}`, details);
    
    // In production, send to security monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Send to your security monitoring service
      fetch('/api/security/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...csrfUtils.addToHeaders(),
        },
        body: JSON.stringify({
          event,
          details,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href,
        }),
      }).catch(() => {
        // Silently fail if security monitoring is unavailable
      });
    }
  },
  
  // Monitor for XSS attempts
  detectXSS: (input: string): boolean => {
    const xssPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /<iframe/i,
      /<object/i,
      /<embed/i,
      /eval\s*\(/i,
      /expression\s*\(/i,
    ];
    
    const isXSS = xssPatterns.some(pattern => pattern.test(input));
    
    if (isXSS) {
      securityMonitor.logSecurityEvent('XSS_ATTEMPT', { input });
    }
    
    return isXSS;
  },
  
  // Monitor for injection attempts
  detectInjection: (input: string): boolean => {
    const injectionPatterns = [
      /union\s+select/i,
      /drop\s+table/i,
      /delete\s+from/i,
      /insert\s+into/i,
      /update\s+set/i,
      /;\s*--/,
      /\/\*.*?\*\//,
    ];
    
    const isInjection = injectionPatterns.some(pattern => pattern.test(input));
    
    if (isInjection) {
      securityMonitor.logSecurityEvent('INJECTION_ATTEMPT', { input });
    }
    
    return isInjection;
  },
};

// Export all utilities
export {
  sanitizeHtml,
  sanitizeInput,
  validateInput,
  validateForm,
  csrfUtils,
  cspUtils,
  rateLimitUtils,
  storageUtils,
  securityMonitor,
};

export default {
  sanitize: sanitizeInput,
  validate: validateInput,
  validateForm,
  csrf: csrfUtils,
  csp: cspUtils,
  rateLimit: rateLimitUtils,
  storage: storageUtils,
  monitor: securityMonitor,
}; 