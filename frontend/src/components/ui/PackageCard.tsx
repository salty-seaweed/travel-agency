import React from 'react';
import { Link } from 'react-router-dom';
import { MapPinIcon, StarIcon, HeartIcon, CalendarIcon, UsersIcon } from '@heroicons/react/24/outline';

interface PackageCardProps {
  package: {
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
  };
  onBookNow?: (pkg: any) => void;
}

export function PackageCard({ package: pkg, onBookNow }: PackageCardProps) {
  const handleBookNow = () => {
    if (onBookNow) {
      onBookNow(pkg);
    } else {
      // Default WhatsApp booking
      const message = `Hi! I'm interested in booking the "${pkg.name}" package for my Maldives trip. Can you provide more information about availability and booking details?`;
      const whatsappUrl = `https://wa.me/9601234567?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
      {/* Package Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={pkg.image}
          alt={pkg.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        {pkg.featured && (
          <div className="absolute top-3 left-3">
            <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold">
              ⭐ Featured Package
            </span>
          </div>
        )}
        <button className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
          <HeartIcon className="h-4 w-4 text-gray-600" />
        </button>
        <div className="absolute top-3 right-12">
          <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
            {pkg.category}
          </span>
        </div>
      </div>

      {/* Package Info */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-1">
            {pkg.name}
          </h3>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {pkg.description}
        </p>

        {/* Package Details */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <CalendarIcon className="h-4 w-4" />
            <span>{pkg.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <UsersIcon className="h-4 w-4" />
            <span>Up to {pkg.maxTravelers}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPinIcon className="h-4 w-4" />
            <span>{pkg.destinations.length} destinations</span>
          </div>
        </div>

        {/* Highlights */}
        <div className="flex flex-wrap gap-1 mb-4">
          {pkg.highlights.slice(0, 3).map((highlight, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs"
            >
              {highlight}
            </span>
          ))}
          {pkg.highlights.length > 3 && (
            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
              +{pkg.highlights.length - 3} more
            </span>
          )}
        </div>

        {/* Included */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">What's Included:</h4>
          <div className="flex flex-wrap gap-1">
            {pkg.included.slice(0, 3).map((item, index) => (
              <span
                key={index}
                className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs"
              >
                {item}
              </span>
            ))}
            {pkg.included.length > 3 && (
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                +{pkg.included.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Rating and Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium">{pkg.rating}</span>
            </div>
            <span className="text-sm text-gray-500">
              ({pkg.reviewCount} reviews)
            </span>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-green-600">${pkg.price}</span>
              <span className="text-sm text-gray-500 line-through">${pkg.originalPrice}</span>
            </div>
            <div className="text-sm text-gray-500">per person</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <Link
            to={`/packages/${pkg.id}`}
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg text-center text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            View Details
          </Link>
          <button 
            onClick={handleBookNow}
            className="bg-green-600 text-white py-3 px-4 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default PackageCard; 