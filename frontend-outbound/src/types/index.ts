// =================================================================
// API Response & Core Data Types for Outbound Platform
// =================================================================

export interface Continent {
  id: number;
  name: string;
  code: string;
  display_order: number;
  countries_count: number;
}

export interface Country {
  id: number;
  name: string;
  code: string;
  continent: number;
  continent_name: string;
  capital: string;
  currency: string;
  language: string;
  description: string;
  image: string | null;
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
  packages_count: number;
}

export interface ActivityCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  display_order: number;
  is_active: boolean;
  packages_count: number;
}

export interface TourItinerary {
  id: number;
  day_number: number;
  title: string;
  description: string;
  location: string;
  activities: string[];
  meals: string[];
}

export interface TourInclusion {
  id: number;
  item: string;
  is_included: boolean;
}

export interface TourPackage {
  id: number;
  name: string;
  slug: string;
  country: number;
  country_name: string;
  continent_name: string;
  description: string;
  highlights: string[];
  duration_days: number;
  difficulty: 'easy' | 'moderate' | 'challenging';
  group_size: string;
  price_usd: string;
  original_price_usd: string | null;
  discount_percentage: number;
  activity_categories: ActivityCategory[];
  main_image: string | null;
  images: string[];
  is_featured: boolean;
  is_active: boolean;
  meta_description: string;
  created_at: string;
  final_price: string;
  is_on_sale: boolean;
  itinerary: TourItinerary[];
  inclusions: TourInclusion[];
}

export interface TourPackageListItem {
  id: number;
  name: string;
  slug: string;
  country_name: string;
  continent_name: string;
  duration_days: number;
  difficulty: 'easy' | 'moderate' | 'challenging';
  price_usd: string;
  discount_percentage: number;
  final_price: string;
  is_on_sale: boolean;
  main_image: string | null;
  is_featured: boolean;
}

export interface CountryDetail extends Country {
  packages: TourPackageListItem[];
}

export interface Currency {
  id: number;
  name: string;
  code: string;
  symbol: string;
  exchange_rate: string;
  is_default: boolean;
  is_active: boolean;
}

export interface TourBooking {
  id: number;
  tour: number;
  tour_name: string;
  user: number;
  booking_reference: string;
  full_name: string;
  email: string;
  phone: string;
  number_of_travelers: number;
  special_requests: string;
  travel_date: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  total_amount: string;
  created_at: string;
}

// =================================================================
// API Payloads & Responses
// =================================================================

export interface HomepageData {
  continents: Continent[];
  featured_countries: Country[];
  featured_tours: TourPackageListItem[];
  deals: TourPackageListItem[];
  activity_categories: ActivityCategory[];
}

export interface Statistics {
  total_countries: number;
  total_tours: number;
  total_bookings: number;
  featured_countries: number;
  deals_count: number;
}

export interface SearchResult {
  countries: Country[];
  tours: TourPackageListItem[];
  total_countries: number;
  total_tours: number;
}

export interface ApiError {
  message: string;
  details?: Record<string, any>;
}
