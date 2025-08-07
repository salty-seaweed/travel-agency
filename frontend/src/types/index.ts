// Base types
export interface BaseEntity {
  id: number;
  created_at?: string;
  updated_at?: string;
}

// Property types
export interface Property extends BaseEntity {
  name: string;
  description: string;
  price: number;
  location: number | Location;
  property_type: number | PropertyType;
  amenities: number[] | Amenity[];
  images?: PropertyImage[];
  latitude?: number;
  longitude?: number;
}

export interface PropertyType extends BaseEntity {
  name: string;
  description?: string;
}

export interface Location extends BaseEntity {
  island: string;
  atoll: string;
  latitude: number;
  longitude: number;
}

export interface Amenity extends BaseEntity {
  name: string;
  icon?: string;
}

export interface PropertyImage extends BaseEntity {
  property: number;
  image: string;
  caption?: string;
}

// Package types
export interface Package extends BaseEntity {
  name: string;
  description: string;
  price: number;
  duration: number;
  properties: number[] | Property[];
  images?: PackageImage[];
}

export interface PackageImage extends BaseEntity {
  package: number;
  image: string;
  caption?: string;
}

// Review types
export interface Review extends BaseEntity {
  name: string;
  email: string;
  rating: number;
  comment: string;
  property: number | Property;
}

// Form types
export interface PropertyFormData {
  name: string;
  description: string;
  price: number;
  location: number;
  property_type: number;
  amenities: number[];
}

export interface PackageFormData {
  name: string;
  description: string;
  price: number;
  duration: number;
  properties: number[];
}

export interface ReviewFormData {
  name: string;
  email: string;
  rating: number;
  comment: string;
  property: number;
}

export interface AmenityFormData {
  name: string;
  icon?: string;
}

export interface PropertyTypeFormData {
  name: string;
  description?: string;
}

export interface LocationFormData {
  island: string;
  atoll: string;
  latitude: number;
  longitude: number;
}

// API response types
export interface ApiResponse<T> {
  count?: number;
  next?: string;
  previous?: string;
  results?: T[];
}

export interface TokenResponse {
  access: string;
  refresh: string;
}

// UI types
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  message: string;
  type: NotificationType;
}

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type LoadingSpinnerSize = 'sm' | 'md' | 'lg';

// Filter and sort types
export interface FilterOptions {
  search?: string;
  property_type?: number;
  location?: number;
  min_price?: number;
  max_price?: number;
  rating?: number;
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

// Dashboard stats
export interface DashboardStats {
  properties: number;
  packages: number;
  reviews: number;
}

// Map types
export interface MapCoordinates {
  lat: number;
  lng: number;
}

export interface GeocodingResult {
  display_name: string;
  lat: string;
  lon: string;
} 