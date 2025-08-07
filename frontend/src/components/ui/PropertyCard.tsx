import React from 'react';
import { Link } from 'react-router-dom';
import { MapPinIcon, StarIcon, HeartIcon } from '@heroicons/react/24/outline';

interface PropertyCardProps {
  property: {
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
  };
  showAmenities?: boolean;
  showDescription?: boolean;
}

export function PropertyCard({ property, showAmenities = true, showDescription = true }: PropertyCardProps) {
  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow duration-300">
      {/* Property Image */}
      <div className="relative h-48 sm:h-52 overflow-hidden">
        <img
          src={property.image}
          alt={property.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        {property.featured && (
          <div className="absolute top-3 left-3">
            <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
              Featured
            </span>
          </div>
        )}
        <button className="absolute top-3 right-3 p-1.5 sm:p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
          <HeartIcon className="h-4 w-4 text-gray-600" />
        </button>
        <div className="absolute top-3 right-12">
          <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
            {property.type}
          </span>
        </div>
      </div>

      {/* Property Info */}
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-1 flex-1 pr-2">
            {property.name}
          </h3>
        </div>
        
        <div className="flex items-center gap-1 text-gray-600 mb-3">
          <MapPinIcon className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm truncate">{property.location}</span>
        </div>

        {showDescription && (
          <p className="text-gray-600 text-sm mb-3 sm:mb-4 line-clamp-2">
            {property.description}
          </p>
        )}

        {/* Amenities - Improved Mobile */}
        {showAmenities && (
          <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
            {property.amenities.slice(0, 3).map((amenity, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
              >
                {amenity}
              </span>
            ))}
            {property.amenities.length > 3 && (
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                +{property.amenities.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Rating and Price - Improved Mobile */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium">{property.rating}</span>
            </div>
            <span className="text-xs sm:text-sm text-gray-500 hidden sm:inline">
              ({property.reviewCount} reviews)
            </span>
            <span className="text-xs text-gray-500 sm:hidden">
              ({property.reviewCount})
            </span>
          </div>
          <div className="text-right">
            <div className="text-base sm:text-lg font-bold text-blue-600">
              ${property.price}
            </div>
            <div className="text-xs text-gray-500">per night</div>
          </div>
        </div>

        {/* Action Button - Improved Mobile */}
        <div className="mt-3 sm:mt-4">
          <Link
            to={`/properties/${property.id}`}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 sm:py-3 px-4 rounded-lg font-semibold text-sm sm:text-base hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-center block"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PropertyCard; 