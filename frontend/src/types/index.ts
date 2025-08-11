// Unified type definitions - Single source of truth
export interface BaseEntity {
  id: number;
  created_at?: string;
  updated_at?: string;
}

// Location types
export interface Location extends BaseEntity {
  island: string;
  atoll: string;
  latitude: number;
  longitude: number;
}

// Property types
export interface PropertyType extends BaseEntity {
  name: string;
  description?: string;
}

export interface Amenity extends BaseEntity {
  name: string;
  icon?: string;
}

export interface PropertyImage extends BaseEntity {
  property: number;
  image: string;
  caption?: string;
  is_featured?: boolean;
}

// Unified Property interface
export interface Property extends BaseEntity {
  name: string;
  description: string;
  price_per_night: string;
  location: Location;
  property_type: PropertyType;
  amenities: Amenity[];
  images: PropertyImage[];
  latitude?: number;
  longitude?: number;
  address?: string;
  whatsapp_number?: string;
  is_featured: boolean;
  reviews: number[];
  packages: number[];
  // UI-specific computed fields
  price: number; // Computed from price_per_night
  rating: number; // Computed from reviews
  reviewCount: number; // Computed from reviews length
}

// Package types
export interface PackageImage extends BaseEntity {
  package: number;
  image: string;
  caption?: string;
}

// Unified Package interface
export interface Package extends BaseEntity {
  name: string;
  description: string;
  price: string;
  duration: number;
  properties: Property[];
  images?: PackageImage[];
  is_featured: boolean;
  start_date?: string;
  end_date?: string;
  // UI-specific computed fields
  destinations: string[]; // Computed from properties
  highlights: string[]; // Default highlights
  included: string[]; // Default included items
  maxTravelers: number; // Default max travelers
  category: string; // Default category
}

// Review types
export interface Review extends BaseEntity {
  property: number;
  name: string;
  email?: string;
  rating: number;
  comment: string;
  approved: boolean;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Form types
export interface PropertyFormData {
  name: string;
  description: string;
  price_per_night: string;
  location: number;
  property_type: number;
  amenities: number[];
  address?: string;
  whatsapp_number?: string;
  latitude?: number;
  longitude?: number;
  is_featured: boolean;
}

export interface PackageFormData {
  name: string;
  description: string;
  price: string;
  duration: number;
  properties: number[];
  is_featured: boolean;
  start_date?: string;
  end_date?: string;
}

export interface ReviewFormData {
  property: number;
  name: string;
  email?: string;
  rating: number;
  comment: string;
}

// Filter types
export interface PropertyFilters {
  property_type?: number;
  amenities?: number[];
  location?: number;
  min_price?: number;
  max_price?: number;
  is_featured?: boolean;
  search?: string;
}

export interface PackageFilters {
  is_featured?: boolean;
  min_price?: number;
  max_price?: number;
  search?: string;
}

// Authentication types
export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  is_staff: boolean;
  is_superuser: boolean;
}

export interface CustomerData {
  id: number;
  name: string;
  email: string;
  phone?: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

// Booking types
export interface Booking extends BaseEntity {
  property: Property;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  check_in: string;
  check_out: string;
  guests: number;
  total_amount: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  special_requests?: string;
}

export interface BookingFormData {
  property: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  check_in: string;
  check_out: string;
  guests: number;
  special_requests?: string;
}

// Error types
export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

// Notification types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

// Search types
export interface SearchResults {
  properties: Property[];
  packages: Package[];
  total: number;
}

// Configuration types
export interface AppConfig {
  apiBaseUrl: string;
  whatsappNumber: string;
  companyName: string;
  supportEmail: string;
  maxImageSize: number;
  defaultPageSize: number;
}

// Utility types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface LoadingStateData<T> {
  state: LoadingState;
  data: T | null;
  error: string | null;
}

// Component prop types
export interface PropertyCardProps {
  property: Property;
  className?: string;
  loading?: boolean;
  onFavorite?: (propertyId: number) => void;
}

export interface PackageCardProps {
  package: Package;
  className?: string;
  loading?: boolean;
  onBook?: (packageId: number) => void;
}

// All types are already exported above as part of their interface declarations 