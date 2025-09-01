/**
 * Error handling utilities for better user experience
 */

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: any;
}

export const getErrorMessage = (error: any): string => {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  if (error?.detail) {
    return error.detail;
  }
  
  if (error?.status === 400) {
    return 'Invalid data provided. Please check all required fields.';
  }
  
  if (error?.status === 401) {
    return 'Authentication required. Please log in again.';
  }
  
  if (error?.status === 403) {
    return 'Access denied. You do not have permission to perform this action.';
  }
  
  if (error?.status === 404) {
    return 'Resource not found. Please check the URL and try again.';
  }
  
  if (error?.status === 500) {
    return 'Server error. Please try again later.';
  }
  
  return 'An unexpected error occurred. Please try again.';
};

export const getValidationErrors = (error: any): Record<string, string> => {
  const validationErrors: Record<string, string> = {};
  
  if (error?.details && typeof error.details === 'object') {
    // Handle Django REST framework validation errors
    Object.keys(error.details).forEach(field => {
      if (Array.isArray(error.details[field])) {
        validationErrors[field] = error.details[field][0];
      } else {
        validationErrors[field] = error.details[field];
      }
    });
  }
  
  return validationErrors;
};

export const isValidationError = (error: any): boolean => {
  return error?.status === 400 && error?.details;
};

export const formatFieldName = (fieldName: string): string => {
  return fieldName
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
};
