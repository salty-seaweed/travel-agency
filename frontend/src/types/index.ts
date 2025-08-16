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
  is_featured?: boolean;
}

export interface PackageItinerary extends BaseEntity {
  package: number;
  day: number;
  title: string;
  description: string;
  activities: string[];
  meals: string[];
  accommodation?: string;
  transportation?: string;
}

export interface PackageInclusion extends BaseEntity {
  package: number;
  category: 'included' | 'excluded' | 'optional';
  item: string;
  description?: string;
  icon?: string;
}

export interface PackageActivity extends BaseEntity {
  package: number;
  name: string;
  description: string;
  duration: string;
  difficulty: 'easy' | 'moderate' | 'challenging';
  category: string;
  included: boolean;
  price?: string;
}

export interface PackageDestination extends BaseEntity {
  package: number;
  location: Location;
  duration: number; // days at this destination
  description: string;
  highlights: string[];
  activities: string[];
}

// Enhanced Package interface with comprehensive information
export interface Package extends BaseEntity {
  name: string;
  description: string;
  detailed_description?: string;
  price: string;
  original_price?: string;
  duration: number;
  properties: Property[];
  images?: PackageImage[];
  is_featured: boolean;
  start_date?: string;
  end_date?: string;
  
  // Enhanced package information
  category: string;
  difficulty_level: 'easy' | 'moderate' | 'challenging' | 'expert';
  group_size: {
    min: number;
    max: number;
    recommended: number;
  };
  
  // Destinations and itinerary
  destinations: PackageDestination[];
  itinerary: PackageItinerary[];
  
  // What's included/excluded
  inclusions: PackageInclusion[];
  
  // Activities and experiences
  activities: PackageActivity[];
  
  // Accommodation details
  accommodation_type: string;
  room_type: string;
  meal_plan: string;
  
  // Transportation
  transportation_details: string;
  airport_transfers: boolean;
  
  // Additional information
  best_time_to_visit: string;
  weather_info: string;
  what_to_bring: string[];
  important_notes: string[];
  
  // Pricing and availability
  seasonal_pricing?: {
    peak_season: string;
    off_peak_season: string;
    shoulder_season: string;
  };
  availability_calendar?: string;
  
  // Reviews and ratings
  rating: number;
  review_count: number;
  reviews: Review[];
  
  // Booking information
  booking_terms: string;
  cancellation_policy: string;
  payment_terms: string;
  
  // UI-specific computed fields (for backward compatibility)
  highlights: string[]; // Computed from activities and destinations
  included: string[]; // Computed from inclusions
  maxTravelers: number; // Computed from group_size.max
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
  detailed_description?: string;
  price: string;
  original_price?: string;
  duration: number;
  properties: number[];
  is_featured: boolean;
  start_date?: string;
  end_date?: string;
  
  // Enhanced package information
  category: string;
  difficulty_level: 'easy' | 'moderate' | 'challenging' | 'expert';
  group_size: {
    min: number;
    max: number;
    recommended: number;
  };
  
  // Destinations and itinerary
  destinations: {
    location: number;
    duration: number;
    description: string;
    highlights: string[];
    activities: string[];
  }[];
  
  itinerary: {
    day: number;
    title: string;
    description: string;
    activities: string[];
    meals: string[];
    accommodation?: string;
    transportation?: string;
  }[];
  
  // What's included/excluded
  inclusions: {
    category: 'included' | 'excluded' | 'optional';
    item: string;
    description?: string;
    icon?: string;
  }[];
  
  // Activities and experiences
  activities: {
    name: string;
    description: string;
    duration: string;
    difficulty: 'easy' | 'moderate' | 'challenging';
    category: string;
    included: boolean;
    price?: string;
  }[];
  
  // Accommodation details
  accommodation_type: string;
  room_type: string;
  meal_plan: string;
  
  // Transportation
  transportation_details: string;
  airport_transfers: boolean;
  
  // Additional information
  best_time_to_visit: string;
  weather_info: string;
  what_to_bring: string[];
  important_notes: string[];
  
  // Pricing and availability
  seasonal_pricing?: {
    peak_season: string;
    off_peak_season: string;
    shoulder_season: string;
  };
  
  // Booking information
  booking_terms: string;
  cancellation_policy: string;
  payment_terms: string;
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