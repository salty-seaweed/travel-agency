// API service for communicating with Django backend

const API_BASE_URL = '/api';

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface Property {
  id: number;
  name: string;
  description: string;
  property_type: {
    id: number;
    name: string;
    description: string;
  };
  location: {
    id: number;
    island: string;
    atoll: string;
    latitude: number;
    longitude: number;
  };
  address: string;
  whatsapp_number: string;
  price_per_night: string;
  amenities: Array<{
    id: number;
    name: string;
    icon: string;
  }>;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  images: Array<{
    id: number;
    image: string;
    is_featured: boolean;
  }>;
  reviews: number[];
  packages: number[];
}

export interface Package {
  id: number;
  name: string;
  description: string;
  properties: Property[];
  price: string;
  is_featured: boolean;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: number;
  property: number;
  name: string;
  rating: number;
  comment: string;
  created_at: string;
  approved: boolean;
}

export interface PropertyType {
  id: number;
  name: string;
  description: string;
}

export interface Amenity {
  id: number;
  name: string;
  icon: string;
}

export interface Location {
  id: number;
  island: string;
  atoll: string;
  latitude: number;
  longitude: number;
}

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, { ...defaultOptions, ...options });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return {
      data,
      status: response.status,
    };
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Properties API
export const propertiesApi = {
  // Get all properties
  getAll: async (): Promise<Property[]> => {
    const response = await apiRequest<Property[]>('/properties/');
    return response.data;
  },

  // Get featured properties
  getFeatured: async (): Promise<Property[]> => {
    const response = await apiRequest<Property[]>('/properties/?is_featured=true');
    return response.data;
  },

  // Get property by ID
  getById: async (id: number): Promise<Property> => {
    const response = await apiRequest<Property>(`/properties/${id}/`);
    return response.data;
  },

  // Get properties with filters
  getFiltered: async (filters: {
    property_type?: number;
    amenities?: number[];
    location?: number;
    min_price?: number;
    max_price?: number;
    is_featured?: boolean;
  }): Promise<Property[]> => {
    const params = new URLSearchParams();
    
    if (filters.property_type) params.append('property_type', filters.property_type.toString());
    if (filters.location) params.append('location', filters.location.toString());
    if (filters.is_featured !== undefined) params.append('is_featured', filters.is_featured.toString());
    if (filters.amenities?.length) {
      filters.amenities.forEach(id => params.append('amenities', id.toString()));
    }

    const response = await apiRequest<Property[]>(`/properties/?${params.toString()}`);
    return response.data;
  },

  // Get property reviews
  getReviews: async (propertyId: number): Promise<Review[]> => {
    const response = await apiRequest<Review[]>(`/properties/${propertyId}/reviews/`);
    return response.data;
  },

  // Get property packages
  getPackages: async (propertyId: number): Promise<Package[]> => {
    const response = await apiRequest<Package[]>(`/properties/${propertyId}/packages/`);
    return response.data;
  },
};

// Packages API
export const packagesApi = {
  // Get all packages
  getAll: async (): Promise<Package[]> => {
    const response = await apiRequest<Package[]>('/packages/');
    return response.data;
  },

  // Get featured packages
  getFeatured: async (): Promise<Package[]> => {
    const response = await apiRequest<Package[]>('/packages/?is_featured=true');
    return response.data;
  },

  // Get package by ID
  getById: async (id: number): Promise<Package> => {
    const response = await apiRequest<Package>(`/packages/${id}/`);
    return response.data;
  },
};

// Reviews API
export const reviewsApi = {
  // Get all reviews
  getAll: async (): Promise<Review[]> => {
    const response = await apiRequest<Review[]>('/reviews/');
    return response.data;
  },

  // Get approved reviews
  getApproved: async (): Promise<Review[]> => {
    const response = await apiRequest<Review[]>('/reviews/?approved=true');
    return response.data;
  },

  // Create new review
  create: async (reviewData: {
    property: number;
    name: string;
    rating: number;
    comment: string;
  }): Promise<Review> => {
    const response = await apiRequest<Review>('/reviews/', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
    return response.data;
  },
};

// Property Types API
export const propertyTypesApi = {
  getAll: async (): Promise<PropertyType[]> => {
    const response = await apiRequest<PropertyType[]>('/property-types/');
    return response.data;
  },
};

// Amenities API
export const amenitiesApi = {
  getAll: async (): Promise<Amenity[]> => {
    const response = await apiRequest<Amenity[]>('/amenities/');
    return response.data;
  },
};

// Locations API
export const locationsApi = {
  getAll: async (): Promise<Location[]> => {
    const response = await apiRequest<Location[]>('/locations/');
    return response.data;
  },
};

// Search API
export const searchApi = {
  // Search properties by name or description
  properties: async (query: string): Promise<Property[]> => {
    const response = await apiRequest<Property[]>(`/properties/?search=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Search packages by name or description
  packages: async (query: string): Promise<Package[]> => {
    const response = await apiRequest<Package[]>(`/packages/?search=${encodeURIComponent(query)}`);
    return response.data;
  },
};

// Utility functions
export const apiUtils = {
  // Get image URL
  getImageUrl: (imagePath: string): string => {
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    return imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  },

  // Format price
  formatPrice: (price: string | number): string => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `$${numPrice.toFixed(2)}`;
  },

  // Get average rating from reviews
  getAverageRating: (reviews: Review[]): number => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return Math.round((total / reviews.length) * 10) / 10;
  },
};

export default {
  properties: propertiesApi,
  packages: packagesApi,
  reviews: reviewsApi,
  propertyTypes: propertyTypesApi,
  amenities: amenitiesApi,
  locations: locationsApi,
  search: searchApi,
  utils: apiUtils,
}; 