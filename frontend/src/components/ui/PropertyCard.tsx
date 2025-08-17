import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPinIcon, StarIcon, HeartIcon, ArrowRightIcon, UsersIcon, WifiIcon, CameraIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { Button, Icon, HStack, Text } from '@chakra-ui/react';
import type { Property, Location, Amenity, PropertyType } from '../../types';
import { PropertyBookingModal } from '../PropertyBookingModal';

interface PropertyCardProps {
  property: Property;
  className?: string;
  loading?: boolean;
}

export function PropertyCard({ property, className = '', loading = false }: PropertyCardProps) {
  const [isLiked, setIsLiked] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  // Helper functions to safely access nested properties
  const getLocationString = (location: number | Location | undefined): string => {
    if (!location) return 'Maldives Paradise';
    if (typeof location === 'number') return 'Maldives Paradise';
    return `${location.island}, ${location.atoll}`;
  };

  const getPropertyTypeName = (propertyType: number | PropertyType | undefined): string => {
    if (!propertyType) return 'Luxury Resort';
    if (typeof propertyType === 'number') return 'Luxury Resort';
    return propertyType.name;
  };

  const getAmenitiesList = (amenities: number[] | Amenity[] | undefined): string[] => {
    if (!amenities || amenities.length === 0) return ['WiFi', 'Ocean View', 'Private Beach'];
    if (typeof amenities[0] === 'number') return ['WiFi', 'Ocean View', 'Private Beach'];
    return (amenities as Amenity[]).map(amenity => amenity.name);
  };

  const getImageUrl = (): string => {
    if (property.images && property.images.length > 0) {
      return property.images[0].image;
    }
    // High-quality Maldives resort images with better optimization
    const maldivesImages = [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop&crop=center&auto=format&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop&crop=center&auto=format&q=80',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop&crop=center&auto=format&q=80',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&h=400&fit=crop&crop=center&auto=format&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=400&fit=crop&crop=center&auto=format&q=80',
    ];
    return maldivesImages[Math.floor(Math.random() * maldivesImages.length)];
  };

  const amenities = getAmenitiesList(property.amenities);
  const locationString = getLocationString(property.location);
  const propertyTypeName = getPropertyTypeName(property.property_type);
  const imageUrl = getImageUrl();

  // Loading skeleton
  if (loading) {
    return (
      <div className={`bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 animate-pulse ${className}`}>
        <div className="h-64 bg-gray-200"></div>
        <div className="p-6">
          <div className="h-6 bg-gray-200 rounded mb-3"></div>
          <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
          <div className="flex justify-between mb-6">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          </div>
          <div className="flex gap-2 mb-6">
            <div className="h-6 bg-gray-200 rounded w-16"></div>
            <div className="h-6 bg-gray-200 rounded w-20"></div>
            <div className="h-6 bg-gray-200 rounded w-24"></div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1 h-12 bg-gray-200 rounded-xl"></div>
            <div className="h-12 w-32 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <article className={`group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 border border-gray-100 min-h-[600px] flex flex-col ${className}`}>
      {/* Enhanced Image Container with Error Handling */}
      <div className="relative h-64 overflow-hidden bg-gray-100 flex-shrink-0">
        {!imageError ? (
          <img
            src={imageUrl}
            alt={`${property.name} - ${locationString}`}
            className={`w-full h-full object-cover transition-all duration-500 ${
              imageLoaded ? 'opacity-100 group-hover:scale-105' : 'opacity-0'
            }`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true);
              setImageLoaded(true);
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100">
            <div className="text-center">
              <CameraIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Image unavailable</p>
            </div>
          </div>
        )}
        
        {/* Simplified overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Enhanced Like Button with Better Accessibility */}
        <button
          onClick={handleLike}
          className="absolute top-4 right-4 p-2 bg-white/95 backdrop-blur-sm rounded-xl hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label={`${isLiked ? 'Remove from' : 'Add to'} favorites: ${property.name}`}
        >
          <HeartIcon className={`h-5 w-5 transition-colors duration-200 ${isLiked ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
        </button>
        
        {/* Property Type Badge */}
        <div className="absolute bottom-4 left-4">
          <span className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl text-sm font-semibold text-gray-800 shadow-lg border border-white/50">
            {propertyTypeName}
          </span>
        </div>

        {/* Price Badge */}
        <div className="absolute top-4 left-4">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-2 rounded-xl shadow-lg">
            <div className="text-lg font-bold">${property.price}</div>
            <div className="text-xs opacity-90">per night</div>
          </div>
        </div>
      </div>
      
      {/* Enhanced Content with Better Information Hierarchy */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Title and Location */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-1 group-hover:text-blue-600 transition-colors duration-300">
          {property.name}
        </h3>
        <div className="flex items-center text-gray-600 mb-4">
          <MapPinIcon className="h-4 w-4 mr-2 flex-shrink-0 text-blue-500" aria-hidden="true" />
          <span className="text-sm font-medium">{locationString}</span>
        </div>
        
        {/* Enhanced Rating and Reviews */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <StarSolidIcon className="h-4 w-4 text-yellow-400" aria-hidden="true" />
              <span className="font-bold text-lg">4.8</span>
            </div>
            <span className="text-gray-500 text-sm">(24 reviews)</span>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">${property.price}</div>
            <div className="text-sm text-gray-500">per night</div>
          </div>
        </div>
        
        {/* Enhanced Amenities with Better Mobile Layout */}
        {amenities.length > 0 && (
          <div className="mb-6 flex-grow">
            <div className="flex flex-wrap gap-2">
              {amenities.slice(0, 3).map((amenity, index) => (
                <span 
                  key={index}
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-3 py-1 rounded-xl text-xs font-semibold border border-blue-100"
                >
                  {amenity}
                </span>
              ))}
              {amenities.length > 3 && (
                <span className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 px-3 py-1 rounded-xl text-xs font-semibold border border-gray-200">
                  +{amenities.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
        
        {/* Enhanced Action Buttons with Better Mobile Design - Fixed Positioning */}
        <div className="flex flex-col sm:flex-row gap-3 mt-auto">
          <Link
            to={`/properties/${property.id}`}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 text-center flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-offset-2"
            aria-label={`View details for ${property.name}`}
          >
            <CameraIcon className="h-4 w-4" aria-hidden="true" />
            <span>View Details</span>
            <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Button
            onClick={() => setIsBookingModalOpen(true)}
            bgGradient="linear(to-r, green.600, emerald.600)"
            color="white"
            py={3}
            px={4}
            borderRadius="xl"
            fontSize="sm"
            fontWeight="semibold"
            boxShadow="lg"
            _hover={{
              bgGradient: 'linear(to-r, green.700, emerald.700)',
              boxShadow: 'xl',
              transform: 'scale(1.05)',
            }}
            transition="all 0.3s ease"
            _focus={{
              outline: 'none',
              ring: 4,
              ringColor: 'green.300',
              ringOffset: 2,
            }}
            aria-label={`Book ${property.name}`}
            w={{ base: 'full', sm: 'auto' }}
          >
            <HStack spacing={2}>
              <Text fontSize="base" aria-hidden="true">💬</Text>
              <Text>Book Now</Text>
            </HStack>
          </Button>
        </div>
      </div>
      
      {/* Property Booking Modal */}
      <PropertyBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        property={property}
      />
    </article>
  );
} 