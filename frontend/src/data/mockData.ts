// Mock data for the travel agency website
// This will be replaced with API calls to the Django backend

export interface Property {
  id: number;
  name: string;
  location: string;
  price: number;
  rating: number;
  reviewCount: number;
  image: string;
  type: string;
  amenities: string[];
  description: string;
  featured: boolean;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  size: string;
  checkIn: string;
  checkOut: string;
  cancellation: string;
  contactPhone: string;
  contactEmail: string;
  latitude: number;
  longitude: number;
}

export interface Package {
  id: number;
  name: string;
  description: string;
  duration: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  image: string;
  destinations: string[];
  highlights: string[];
  included: string[];
  maxTravelers: number;
  featured: boolean;
  category: string;
}

export interface Review {
  id: number;
  author: string;
  rating: number;
  date: string;
  comment: string;
  avatar: string;
}

export const properties: Property[] = [
  {
    id: 1,
    name: "Paradise Beach Resort",
    location: "Maafushi Island",
    price: 150,
    rating: 4.8,
    reviewCount: 127,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop",
    type: "Resort",
    amenities: ["Pool", "WiFi", "Restaurant", "Beach Access"],
    description: "Luxury beachfront resort with stunning ocean views",
    featured: true,
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    size: "1,200 sq ft",
    checkIn: "2:00 PM",
    checkOut: "11:00 AM",
    cancellation: "Free cancellation up to 24 hours before check-in",
    contactPhone: "+960 123 4567",
    contactEmail: "info@paradisebeachresort.com",
    latitude: 3.2028,
    longitude: 73.2207
  },
  {
    id: 2,
    name: "Crystal Water Villa",
    location: "Hulhumale",
    price: 200,
    rating: 4.9,
    reviewCount: 89,
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&h=300&fit=crop",
    type: "Villa",
    amenities: ["Private Pool", "WiFi", "Kitchen", "Ocean View"],
    description: "Private villa with direct access to crystal clear waters",
    featured: true,
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2,
    size: "1,500 sq ft",
    checkIn: "3:00 PM",
    checkOut: "10:00 AM",
    cancellation: "Free cancellation up to 48 hours before check-in",
    contactPhone: "+960 987 6543",
    contactEmail: "info@crystalwatervilla.com",
    latitude: 4.2105,
    longitude: 73.5448
  },
  {
    id: 3,
    name: "Sunset Guesthouse",
    location: "Fulidhoo Island",
    price: 80,
    rating: 4.7,
    reviewCount: 156,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop",
    type: "Guesthouse",
    amenities: ["WiFi", "Restaurant", "Garden"],
    description: "Charming guesthouse with beautiful sunset views",
    featured: false,
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    size: "400 sq ft",
    checkIn: "2:00 PM",
    checkOut: "11:00 AM",
    cancellation: "Free cancellation up to 24 hours before check-in",
    contactPhone: "+960 555 1234",
    contactEmail: "info@sunsetguesthouse.com",
    latitude: 3.1234,
    longitude: 73.5678
  },
  {
    id: 4,
    name: "Ocean View Hotel",
    location: "Male",
    price: 120,
    rating: 4.6,
    reviewCount: 203,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
    type: "Hotel",
    amenities: ["Pool", "WiFi", "Restaurant", "Spa"],
    description: "Modern hotel in the heart of Male with ocean views",
    featured: false,
    maxGuests: 3,
    bedrooms: 1,
    bathrooms: 1,
    size: "600 sq ft",
    checkIn: "2:00 PM",
    checkOut: "11:00 AM",
    cancellation: "Free cancellation up to 24 hours before check-in",
    contactPhone: "+960 333 4444",
    contactEmail: "info@oceanviewhotel.com",
    latitude: 4.1755,
    longitude: 73.5093
  },
  {
    id: 5,
    name: "Island Paradise Resort",
    location: "Thulusdhoo Island",
    price: 180,
    rating: 4.8,
    reviewCount: 94,
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=300&fit=crop",
    type: "Resort",
    amenities: ["Private Beach", "Pool", "WiFi", "Water Sports"],
    description: "Exclusive resort on a pristine island paradise",
    featured: true,
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    size: "1,300 sq ft",
    checkIn: "3:00 PM",
    checkOut: "10:00 AM",
    cancellation: "Free cancellation up to 72 hours before check-in",
    contactPhone: "+960 777 8888",
    contactEmail: "info@islandparadise.com",
    latitude: 4.2345,
    longitude: 73.6789
  },
  {
    id: 6,
    name: "Coral Reef Villa",
    location: "Dhiffushi Island",
    price: 160,
    rating: 4.7,
    reviewCount: 67,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop",
    type: "Villa",
    amenities: ["Private Pool", "WiFi", "Kitchen", "Snorkeling"],
    description: "Villa with direct access to coral reefs",
    featured: false,
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    size: "1,100 sq ft",
    checkIn: "2:00 PM",
    checkOut: "11:00 AM",
    cancellation: "Free cancellation up to 48 hours before check-in",
    contactPhone: "+960 999 0000",
    contactEmail: "info@coralreefvilla.com",
    latitude: 4.3456,
    longitude: 73.7890
  }
];

export const packages: Package[] = [
  {
    id: 1,
    name: "Island Hopping Adventure",
    description: "Explore multiple islands with guided tours, water activities, and cultural experiences. Perfect for adventure seekers!",
    duration: "7 days",
    price: 1200,
    originalPrice: 1500,
    rating: 4.8,
    reviewCount: 89,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    destinations: ["Maafushi", "Fulidhoo", "Thulusdhoo"],
    highlights: ["Snorkeling", "Island Tours", "Cultural Visits"],
    included: ["Accommodation", "Meals", "Transport", "Activities"],
    maxTravelers: 8,
    featured: true,
    category: "Adventure"
  },
  {
    id: 2,
    name: "Luxury Honeymoon Package",
    description: "Perfect romantic getaway with private beach access, spa treatments, and exclusive dining experiences.",
    duration: "10 days",
    price: 2500,
    originalPrice: 3000,
    rating: 4.9,
    reviewCount: 67,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop",
    destinations: ["Private Island Resort"],
    highlights: ["Private Beach", "Spa Treatments", "Romantic Dinners"],
    included: ["Luxury Accommodation", "All Meals", "Spa Credits", "Private Transfers"],
    maxTravelers: 2,
    featured: true,
    category: "Luxury"
  },
  {
    id: 3,
    name: "Budget Island Explorer",
    description: "Affordable way to experience the Maldives with comfortable guesthouses and local experiences.",
    duration: "5 days",
    price: 600,
    originalPrice: 800,
    rating: 4.6,
    reviewCount: 124,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop",
    destinations: ["Maafushi", "Hulhumale"],
    highlights: ["Local Culture", "Budget Accommodation", "Water Activities"],
    included: ["Guesthouse", "Breakfast", "Local Tours"],
    maxTravelers: 6,
    featured: false,
    category: "Budget"
  },
  {
    id: 4,
    name: "Family Fun Package",
    description: "Kid-friendly activities, safe beaches, and family-oriented accommodations for the perfect family vacation.",
    duration: "8 days",
    price: 1800,
    originalPrice: 2200,
    rating: 4.7,
    reviewCount: 95,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
    destinations: ["Hulhumale", "Maafushi"],
    highlights: ["Kid Activities", "Safe Swimming", "Family Tours"],
    included: ["Family Rooms", "All Meals", "Child Care", "Activities"],
    maxTravelers: 6,
    featured: false,
    category: "Family"
  },
  {
    id: 5,
    name: "Diving Expedition",
    description: "Professional diving experiences with certified instructors and access to the best dive sites in the Maldives.",
    duration: "6 days",
    price: 1400,
    originalPrice: 1800,
    rating: 4.8,
    reviewCount: 73,
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=300&fit=crop",
    destinations: ["Multiple Dive Sites"],
    highlights: ["Professional Diving", "Coral Reefs", "Marine Life"],
    included: ["Diving Equipment", "Certified Instructor", "Accommodation", "Meals"],
    maxTravelers: 4,
    featured: true,
    category: "Adventure"
  },
  {
    id: 6,
    name: "Wellness Retreat",
    description: "Rejuvenate your mind and body with yoga sessions, meditation, spa treatments, and healthy cuisine.",
    duration: "7 days",
    price: 1600,
    originalPrice: 2000,
    rating: 4.7,
    reviewCount: 58,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop",
    destinations: ["Wellness Resort"],
    highlights: ["Yoga Classes", "Meditation", "Spa Treatments"],
    included: ["Wellness Accommodation", "Healthy Meals", "Spa Credits", "Yoga Classes"],
    maxTravelers: 4,
    featured: false,
    category: "Wellness"
  }
];

export const reviews: Review[] = [
  {
    id: 1,
    author: "Sarah Johnson",
    rating: 5,
    date: "2024-01-15",
    comment: "Absolutely stunning resort! The beach access was incredible and the staff went above and beyond. Will definitely return!",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: 2,
    author: "Michael Chen",
    rating: 4,
    date: "2024-01-10",
    comment: "Great location and beautiful property. The pool was perfect and the restaurant had excellent food. Highly recommend!",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: 3,
    author: "Emma Davis",
    rating: 5,
    date: "2024-01-05",
    comment: "Perfect honeymoon destination! The ocean view from our room was breathtaking. Staff was incredibly friendly and helpful.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
  }
];

// Helper functions for data manipulation
export const getPropertyById = (id: number): Property | undefined => {
  return properties.find(property => property.id === id);
};

export const getPackageById = (id: number): Package | undefined => {
  return packages.find(pkg => pkg.id === id);
};

export const getFeaturedProperties = (): Property[] => {
  return properties.filter(property => property.featured);
};

export const getFeaturedPackages = (): Package[] => {
  return packages.filter(pkg => pkg.featured);
}; 