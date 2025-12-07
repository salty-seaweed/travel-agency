// Unified type definitions - Single source of truth
export interface BaseEntity {
  id: number;
  created_at?: string;
  updated_at?: string;
}

// CMS Types
export interface Page extends BaseEntity {
  title: string;
  slug: string;
  content: string;
  meta_description?: string;
  meta_keywords?: string;
  status: 'draft' | 'published' | 'archived';
  locale: string;
  template: string;
  path: string;
  seo_title?: string;
  seo_description?: string;
  canonical_url?: string;
  robots?: string;
  og_title?: string;
  og_description?: string;
  og_image?: MediaAsset | null;
  json_ld?: Record<string, any>;
  publish_at?: string | null;
  unpublish_at?: string | null;
  parent?: number | null;
  is_home: boolean;
  notes?: string;
  created_by?: string;
  updated_by?: string;
  version?: number;
  blocks?: Block[];
  children_count?: number;
  versions_count?: number;
  reviews_count?: number;
  full_url?: string;
}

export interface Block extends BaseEntity {
  type: 'text' | 'image' | 'gallery' | 'video' | 'quote' | 'cta';
  content: Record<string, any>;
  order: number;
  page: number;
  locale_override?: string;
  visibility_rules?: Record<string, any>;
}

export interface MediaAsset extends BaseEntity {
  file: string;
  file_url: string;
  thumbnail_url?: string;
  alt_text?: string;
  caption?: string;
  mime_type: string;
  file_size: number;
  tags?: string[];
  usage_count: number;
  created_by?: string;
}

export interface Menu extends BaseEntity {
  name: string;
  slug: string;
  locale: string;
  is_active: boolean;
  items?: MenuItem[];
}

export interface MenuItem extends BaseEntity {
  menu: number;
  title: string;
  link_type: 'internal' | 'external' | 'anchor';
  link_url: string;
  order: number;
  is_active: boolean;
  parent?: number | null;
  children?: MenuItem[];
}

export interface Redirect extends BaseEntity {
  from_path: string;
  to_path: string;
  status_code: number;
  locale: string;
  is_active: boolean;
  start_date?: string;
  end_date?: string;
}

export interface PageVersion extends BaseEntity {
  page: number;
  version_number: number;
  title: string;
  content: string;
  meta_description?: string;
  meta_keywords?: string;
  blocks_data?: Record<string, any>;
  seo_data?: Record<string, any>;
  created_by?: string;
}

export interface PageReview extends BaseEntity {
  page: number;
  reviewer: string;
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
  due_date?: string;
  completed_at?: string;
}

export interface CommentThread extends BaseEntity {
  title: string;
  page: number;
  created_by: string;
  is_resolved: boolean;
  comments?: Comment[];
}

export interface Comment extends BaseEntity {
  thread: number;
  author: string;
  content: string;
  is_internal: boolean;
}

// Location types
export interface Location extends BaseEntity {
  island: string;
  atoll: string;
  latitude: number;
  longitude: number;
}

export interface Destination extends BaseEntity {
  name: string;
  description: string;
  island: string;
  atoll: string;
  latitude?: number;
  longitude?: number;
  image?: string;
  is_featured: boolean;
  package_count: number;
  is_active: boolean;
}

// Experience types
export interface Experience extends BaseEntity {
  name: string;
  description: string;
  experience_type: 'water_sports' | 'cultural' | 'adventure' | 'wellness' | 'food' | 'photography' | 'fishing' | 'diving' | 'sailing' | 'spa';
  duration: string;
  price: string;
  currency: string;
  location: Location;
  destination?: Destination | null;
  image?: string;
  is_featured: boolean;
  is_active: boolean;
  max_participants: number;
  min_age: number;
  difficulty_level: 'easy' | 'moderate' | 'challenging' | 'expert';
  includes: string[];
  excludes: string[];
  requirements: string[];
}

// Amenity types (kept for potential future use)
export interface Amenity extends BaseEntity {
  name: string;
  icon?: string;
}

// Package types
export interface PackageImage extends BaseEntity {
  package: number;
  media_type?: 'image' | 'video';
  image?: string;
  image_url?: string;
  video?: string;
  video_thumbnail?: string;
  caption?: string;
  order?: number;
  is_featured?: boolean;
}

export interface PackageVariant extends BaseEntity {
  package: number;
  duration_days: number;
  price: string;
  original_price?: string | null;
  is_default: boolean;
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
  start_time?: string;
  end_time?: string;
  location?: string;
  // Enriched by API: matched activities for this day
  experience_details?: Array<{
    id: number;
    name: string;
    description: string;
    duration: string;
    difficulty: 'easy' | 'moderate' | 'challenging' | 'expert' | string;
    category: string;
    included: boolean;
    price?: string;
  }>;
  // Write-only (forms): explicit linkage from day to activity ids
  activity_ids?: number[];
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
  name_ru?: string;
  name_zh?: string;
  description: string;
  description_ru?: string;
  description_zh?: string;
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
  name_ru?: string;
  name_zh?: string;
  description: string;
  description_ru?: string;
  description_zh?: string;
  detailed_description?: string;
  detailed_description_ru?: string;
  detailed_description_zh?: string;
  price: string;
  original_price?: string;
  pricing_type?: 'per_person' | 'per_couple' | 'per_room' | 'per_group';
  duration: number;
  nights: number;
  variants?: PackageVariant[];
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

// Review types (package-focused)
export interface Review extends BaseEntity {
  package: number;
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

// Form types (package-focused)

export interface PackageFormData {
  name: string;
  description: string;
  detailed_description?: string;
  price: string;
  original_price?: string;
  pricing_type: 'per_person' | 'per_couple' | 'per_room' | 'per_group';
  duration: number;
  nights: number;
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
  package: number;
  name: string;
  email?: string;
  rating: number;
  comment: string;
}

// Filter types (package-focused)

export interface PackageFilters {
  is_featured?: boolean;
  min_price?: number;
  max_price?: number;
  search?: string;
  category?: string;
  destination?: string;
}

export interface ExperienceFilters {
  experience_type?: Experience['experience_type'];
  is_featured?: boolean;
  search?: string;
  destination?: string;
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

// Booking types (package-focused)
export interface Booking extends BaseEntity {
  package: Package;
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
  package: number;
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

// Search types (package-focused)
export interface SearchResults {
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

// Component prop types (package-focused)

export interface PackageCardProps {
  package: Package;
  className?: string;
  loading?: boolean;
  onBook?: (packageId: number) => void;
}

// Resort types
export interface ResortAmenity extends BaseEntity {
  name: string;
  category: 'accommodation' | 'dining' | 'wellness' | 'activities' | 'facilities' | 'services' | 'transportation';
  description?: string;
  icon?: string;
  is_active: boolean;
  order: number;
}

export interface ResortImage extends BaseEntity {
  resort: number;
  image: string;
  image_url?: string;
  image_type: 'hero' | 'gallery' | 'villa' | 'facility' | 'activity' | 'aerial' | 'beach' | 'sunset';
  caption?: string;
  alt_text?: string;
  order: number;
  is_featured: boolean;
  is_active: boolean;
}

export interface ResortReview extends BaseEntity {
  resort: number;
  guest_name: string;
  guest_email?: string;
  guest_country?: string;
  rating: 1 | 2 | 3 | 4 | 5;
  title?: string;
  comment: string;
  stay_date?: string;
  room_type?: string;
  is_verified: boolean;
  is_approved: boolean;
  is_featured: boolean;
}

export interface ResortRoomType extends BaseEntity {
  resort: number;
  name: string;
  slug?: string;
  description?: string;
  price_per_night?: string;
  currency: string;
  occupancy_adults: number;
  occupancy_children: number;
  bed_configuration?: string;
  amenities: string[];
  image?: string;
  image_url?: string;
  order: number;
  is_active: boolean;
  hide_price?: boolean;
}

export interface Resort extends BaseEntity {
  name: string;
  description: string;
  detailed_description?: string;
  category: 'luxury' | 'semi_luxury' | 'boutique' | 'adults_only' | 'family_friendly' | 'honeymoon' | 'adventure' | 'wellness';
  star_rating: 3 | 4 | 5 | 6;
  
  // Location Information
  location?: Location | null;
  atoll: string;
  island_name: string;
  coordinates?: string;
  
  // Contact Information
  phone?: string;
  email?: string;
  website?: string;
  whatsapp_number?: string;
  
  // Pricing Information
  price_per_night_from?: string;
  price_per_night_to?: string;
  currency: string;
  pricing_notes?: string;
  
  // Resort Features
  total_villas?: number;
  beach_villas?: number;
  water_villas?: number;
  overwater_villas?: number;
  garden_villas?: number;
  
  // Amenities and Facilities
  amenities: ResortAmenity[];
  restaurants: number;
  bars: number;
  spa_centers: number;
  fitness_centers: number;
  pools: number;
  dive_centers: number;
  water_sports_centers: number;
  
  // Activities and Experiences
  diving_available: boolean;
  snorkeling_available: boolean;
  fishing_available: boolean;
  sailing_available: boolean;
  spa_services: boolean;
  water_sports: boolean;
  land_activities: boolean;
  cultural_experiences: boolean;
  
  // Transportation
  transfer_type?: string;
  transfer_duration?: string;
  transfer_cost?: string;
  
  // Special Features
  is_adults_only: boolean;
  is_family_friendly: boolean;
  is_honeymoon_special: boolean;
  is_eco_friendly: boolean;
  is_private_island: boolean;
  has_house_reef: boolean;
  has_private_beach: boolean;
  is_packaged: boolean;
  is_room_type: boolean;
  
  // Media and Images
  hero_image?: string;
  hero_image_url?: string;
  gallery_images: string[];
  virtual_tour_url?: string;
  drone_video_url?: string;
  images?: ResortImage[];
  room_types?: ResortRoomType[];
  
  // SEO and Marketing
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  featured_highlights: string[];
  special_offers: string[];
  
  // Status and Visibility
  is_featured: boolean;
  is_active: boolean;
  is_available: boolean;
  display_order: number;
  
  // Internationalization
  language?: number;
  localized_name?: string;
  localized_description?: string;
  localized_highlights: string[];
  
  // Reviews and ratings
  reviews?: ResortReview[];
  average_rating?: number;
  review_count?: number;
  
  // Computed properties
  full_location?: string;
  price_range?: string;
  total_villa_count?: number;
}

// Resort form types
export interface ResortFormData {
  name: string;
  description: string;
  detailed_description?: string;
  category: Resort['category'];
  star_rating: Resort['star_rating'];
  location?: number;
  atoll: string;
  island_name: string;
  coordinates?: string;
  phone?: string;
  email?: string;
  website?: string;
  whatsapp_number?: string;
  price_per_night_from?: string;
  price_per_night_to?: string;
  currency: string;
  pricing_notes?: string;
  total_villas?: number;
  beach_villas?: number;
  water_villas?: number;
  overwater_villas?: number;
  garden_villas?: number;
  restaurants: number;
  bars: number;
  spa_centers: number;
  fitness_centers: number;
  pools: number;
  dive_centers: number;
  water_sports_centers: number;
  diving_available: boolean;
  snorkeling_available: boolean;
  fishing_available: boolean;
  sailing_available: boolean;
  spa_services: boolean;
  water_sports: boolean;
  land_activities: boolean;
  cultural_experiences: boolean;
  transfer_type?: string;
  transfer_duration?: string;
  transfer_cost?: string;
  is_adults_only: boolean;
  is_family_friendly: boolean;
  is_honeymoon_special: boolean;
  is_eco_friendly: boolean;
  is_private_island: boolean;
  has_house_reef: boolean;
  has_private_beach: boolean;
  hero_image?: File | string;
  gallery_images: string[];
  virtual_tour_url?: string;
  drone_video_url?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  featured_highlights: string[];
  special_offers: string[];
  is_featured: boolean;
  is_active: boolean;
  is_available: boolean;
  display_order: number;
  language?: number;
  localized_name?: string;
  localized_description?: string;
  localized_highlights: string[];
}

export interface ResortReviewFormData {
  resort: number;
  guest_name: string;
  guest_email?: string;
  guest_country?: string;
  rating: ResortReview['rating'];
  title?: string;
  comment: string;
  stay_date?: string;
  room_type?: string;
}

// Resort filter types
export interface ResortFilters {
  category?: Resort['category'];
  star_rating?: Resort['star_rating'];
  atoll?: string;
  min_price?: number;
  max_price?: number;
  adults_only?: boolean;
  family_friendly?: boolean;
  honeymoon?: boolean;
  eco_friendly?: boolean;
  search?: string;
  is_featured?: boolean;
  country?: string;
}

// Resort component prop types
export interface ResortCardProps {
  resort: Resort;
  className?: string;
  loading?: boolean;
  onBook?: (resortId: number) => void;
  onViewDetails?: (resortId: number) => void;
}

export interface ResortListProps {
  resorts: Resort[];
  loading?: boolean;
  onResortClick?: (resort: Resort) => void;
  onBookResort?: (resort: Resort) => void;
}

export interface ResortFiltersProps {
  filters: ResortFilters;
  onFiltersChange: (filters: ResortFilters) => void;
  onClearFilters: () => void;
}

// ============================================================================
// BOAT TYPES
// ============================================================================

export interface BoatAmenity extends BaseEntity {
  name: string;
  icon?: string;
  description?: string;
  is_active: boolean;
}

export interface BoatImage extends BaseEntity {
  boat: number;
  image: string;
  image_url?: string;
  caption?: string;
  alt_text?: string;
  display_order: number;
  is_active: boolean;
}

export interface BoatActivityImage extends BaseEntity {
  activity: number;
  image: string;
  image_url?: string;
  caption?: string;
  alt_text?: string;
  display_order: number;
  is_active: boolean;
}

export interface BoatActivity extends BaseEntity {
  name: string;
  description: string;
  detailed_description?: string;
  activity_type: 'fishing' | 'excursion' | 'wildlife_watching' | 'water_sports' | 'island_hopping' | 'custom';
  duration_hours: number;
  duration_description?: string;
  min_participants: number;
  max_participants: number;
  difficulty_level: 'easy' | 'moderate' | 'challenging' | 'expert';
  suitable_boats: number[];
  suitable_boats_details?: Boat[];
  suitable_boats_count?: number;
  includes: string[];
  excludes: string[];
  requirements: string[];
  target_species?: string[];
  hero_image?: string;
  hero_image_url?: string;
  gallery_images: string[];
  video_url?: string;
  featured_highlights: string[];
  meta_title?: string;
  meta_description?: string;
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
  language?: number;
  localized_name?: string;
  localized_description?: string;
  images?: BoatActivityImage[];
  average_rating?: number;
  review_count?: number;
}

export interface Boat extends BaseEntity {
  name: string;
  description: string;
  detailed_description?: string;
  boat_type: 'sportfishing' | 'center_console' | 'yacht' | 'speedboat' | 'catamaran';
  
  // Specifications
  length_feet: number;
  engine_details: string;
  cruising_speed_knots: number;
  top_speed_knots: number;
  passenger_capacity: number;
  crew_size: number;
  fuel_tank_liters?: number;
  live_bait_well_liters?: number;
  speed_range?: string;
  
  // Features
  has_cabin: boolean;
  has_toilet: boolean;
  has_shower: boolean;
  has_sound_system: boolean;
  has_gps: boolean;
  has_fish_finder: boolean;
  has_radar: boolean;
  has_outriggers: boolean;
  amenities: BoatAmenity[];
  amenities_list?: BoatAmenity[]; // Alternative field name from serializer
  
  // Location
  departure_location: string;
  location?: Location | null;
  location_name?: string;
  
  // Media
  hero_image?: string;
  hero_image_url?: string;
  gallery_images: string[];
  video_url?: string;
  images?: BoatImage[];
  
  // Marketing
  featured_highlights: string[];
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  
  // Status
  is_featured: boolean;
  is_active: boolean;
  is_available: boolean;
  display_order: number;
  
  // Internationalization
  language?: number;
  localized_name?: string;
  localized_description?: string;
  
  // Related data
  activities?: BoatActivity[];
  activities_count?: number;
  packages?: BoatPackage[];
  packages_count?: number;
  reviews?: BoatReview[];
  average_rating?: number;
  review_count?: number;
}

export interface BoatPackage extends BaseEntity {
  name: string;
  description: string;
  detailed_description?: string;
  boat: number;
  boat_details?: Boat;
  boat_name?: string;
  boat_id?: number;
  package_tier: 'silver' | 'gold' | 'platinum' | 'custom';
  
  // Pricing
  price: string;
  discounted_price?: string;
  currency: string;
  pricing_notes?: string;
  discount_percentage: number;
  
  // Duration
  duration_hours: number;
  duration_description: string;
  
  // Package Details
  includes: string[];
  activities_included: number[];
  activities_included_details?: BoatActivity[];
  max_participants?: number;
  additional_notes?: string;
  
  // Booking Requirements
  booking_notice_hours: number;
  booking_notice_description: string;
  
  // Special Offers
  special_offers: string[];
  
  // Media
  hero_image?: string;
  hero_image_url?: string;
  gallery_images: string[];
  
  // Marketing
  featured_highlights: string[];
  meta_title?: string;
  meta_description?: string;
  
  // Status
  is_featured: boolean;
  is_active: boolean;
  is_available: boolean;
  display_order: number;
  
  // Internationalization
  language?: number;
  localized_name?: string;
  localized_description?: string;
}

export interface BoatBooking extends BaseEntity {
  customer?: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_whatsapp?: string;
  
  boat?: number;
  boat_name?: string;
  activity?: number;
  activity_name?: string;
  package?: number;
  package_name?: string;
  
  preferred_date: string;
  preferred_time?: string;
  number_of_participants: number;
  
  special_requests?: string;
  dietary_requirements?: string;
  
  quoted_price?: string;
  currency: string;
  
  status: 'inquiry' | 'pending' | 'confirmed' | 'completed' | 'cancelled';
  admin_notes?: string;
  
  confirmed_at?: string;
  completed_at?: string;
}

export interface BoatReview extends BaseEntity {
  boat: number;
  boat_name?: string;
  activity?: number;
  activity_name?: string;
  booking?: number;
  customer?: number;
  
  reviewer_name: string;
  reviewer_email?: string;
  reviewer_country?: string;
  
  rating: 1 | 2 | 3 | 4 | 5;
  title: string;
  review_text: string;
  
  boat_condition_rating?: number;
  crew_rating?: number;
  value_rating?: number;
  
  is_verified: boolean;
  verified_booking: boolean;
  is_approved: boolean;
  is_featured: boolean;
}

// Boat form types
export interface BoatFormData {
  name: string;
  description: string;
  detailed_description?: string;
  boat_type: Boat['boat_type'];
  length_feet: number;
  engine_details: string;
  cruising_speed_knots: number;
  top_speed_knots: number;
  passenger_capacity: number;
  crew_size: number;
  fuel_tank_liters?: number;
  live_bait_well_liters?: number;
  has_cabin: boolean;
  has_toilet: boolean;
  has_shower: boolean;
  has_sound_system: boolean;
  has_gps: boolean;
  has_fish_finder: boolean;
  has_radar: boolean;
  has_outriggers: boolean;
  amenities: number[];
  departure_location: string;
  location?: number;
  hero_image?: File | string;
  gallery_images?: string[];
  video_url?: string;
  featured_highlights?: string[];
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  is_featured: boolean;
  is_active: boolean;
  is_available: boolean;
  display_order: number;
}

export interface BoatActivityFormData {
  name: string;
  description: string;
  detailed_description?: string;
  activity_type: BoatActivity['activity_type'];
  duration_hours: number;
  duration_description?: string;
  min_participants: number;
  max_participants: number;
  difficulty_level: BoatActivity['difficulty_level'];
  suitable_boats: number[];
  includes: string[];
  excludes: string[];
  requirements: string[];
  target_species?: string[];
  hero_image?: File | string;
  gallery_images?: string[];
  video_url?: string;
  featured_highlights?: string[];
  meta_title?: string;
  meta_description?: string;
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
}

export interface BoatPackageFormData {
  name: string;
  description: string;
  detailed_description?: string;
  boat: number;
  package_tier: BoatPackage['package_tier'];
  price: string;
  currency: string;
  pricing_notes?: string;
  discount_percentage: number;
  duration_hours: number;
  duration_description: string;
  includes: string[];
  activities_included: number[];
  max_participants?: number;
  additional_notes?: string;
  booking_notice_hours: number;
  booking_notice_description: string;
  special_offers?: string[];
  hero_image?: File | string;
  gallery_images?: string[];
  featured_highlights?: string[];
  meta_title?: string;
  meta_description?: string;
  is_featured: boolean;
  is_active: boolean;
  is_available: boolean;
  display_order: number;
}

export interface BoatBookingFormData {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_whatsapp?: string;
  boat?: number;
  activity?: number;
  package?: number;
  preferred_date: string;
  preferred_time?: string;
  number_of_participants: number;
  special_requests?: string;
  dietary_requirements?: string;
}

export interface BoatReviewFormData {
  boat: number;
  activity?: number;
  reviewer_name: string;
  reviewer_email?: string;
  reviewer_country?: string;
  rating: 1 | 2 | 3 | 4 | 5;
  title: string;
  review_text: string;
  boat_condition_rating?: number;
  crew_rating?: number;
  value_rating?: number;
}

// Boat filter types
export interface BoatFilters {
  boat_type?: string;
  min_capacity?: number;
  activity?: number;
  is_featured?: boolean;
  is_available?: boolean;
  search?: string;
  page?: number;
  page_size?: number;
}

export interface BoatActivityFilters {
  activity_type?: string;
  difficulty_level?: string;
  boat?: number;
  is_featured?: boolean;
  search?: string;
  page?: number;
  page_size?: number;
}

export interface BoatPackageFilters {
  boat?: number;
  package_tier?: string;
  min_price?: number;
  max_price?: number;
  is_featured?: boolean;
  is_available?: boolean;
  search?: string;
  page?: number;
  page_size?: number;
}

// All types are already exported above as part of their interface declarations 