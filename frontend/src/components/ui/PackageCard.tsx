import React from 'react';
import { Link } from 'react-router-dom';
import { MapPinIcon, CalendarIcon, UsersIcon, ArrowRightIcon, StarIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import type { Package } from '../../types';

interface PackageCardProps {
  pkg: Package;
  className?: string;
  loading?: boolean;
}

export function PackageCard({ pkg, className = '', loading = false }: PackageCardProps) {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  const handleBookNow = () => {
    const message = `Hi! I'm interested in the ${pkg.name} package. Can you provide more details?`;
    const whatsappUrl = `https://wa.me/+9601234567?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Helper functions to safely access nested properties
  const getImageUrl = (): string => {
    if (pkg.images && pkg.images.length > 0) {
      return pkg.images[0].image;
    }
    // High-quality Maldives package images with better optimization
    const maldivesPackageImages = [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop&crop=center&auto=format&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop&crop=center&auto=format&q=80',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop&crop=center&auto=format&q=80',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&h=400&fit=crop&crop=center&auto=format&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=400&fit=crop&crop=center&auto=format&q=80',
      'https://images.unsplash.com/photo-1552733407-5d8c8c0e8b5a?w=600&h=400&fit=crop&crop=center&auto=format&q=80',
    ];
    return maldivesPackageImages[Math.floor(Math.random() * maldivesPackageImages.length)];
  };

  const getDestinationsList = (properties: number[] | any[]): string[] => {
    if (properties.length === 0) return ['Maldives Paradise'];
    if (typeof properties[0] === 'number') return ['Maldives Paradise'];
    return (properties as any[]).map(prop => {
      if (prop.location && typeof prop.location === 'object') {
        return prop.location.island;
      }
      return 'Maldives Paradise';
    });
  };

  const getDurationString = (): string => {
    if (typeof pkg.duration === 'number') {
      return `${pkg.duration} days`;
    }
    return '7 days';
  };

  const imageUrl = getImageUrl();
  const destinations = getDestinationsList(pkg.properties);
  const durationString = getDurationString();

  // Loading skeleton
  if (loading) {
    return (
      <div className={`bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 animate-pulse ${className}`}>
        <div className="h-64 bg-gray-200"></div>
        <div className="p-6">
          <div className="h-6 bg-gray-200 rounded mb-3"></div>
          <div className="h-4 bg-gray-200 rounded mb-4 w-full"></div>
          <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
          <div className="flex gap-2 mb-6">
            <div className="h-6 bg-gray-200 rounded w-20"></div>
            <div className="h-6 bg-gray-200 rounded w-24"></div>
            <div className="h-6 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1 h-12 bg-gray-200 rounded-xl"></div>
            <div className="flex-1 h-12 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <article className={`group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 border border-gray-100 ${className}`}>
      {/* Enhanced Package Image with Error Handling */}
      <div className="relative h-64 overflow-hidden bg-gray-100">
        {!imageError ? (
          <img 
            src={imageUrl} 
            alt={`${pkg.name} - Maldives travel package`}
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
              <SparklesIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Image unavailable</p>
            </div>
          </div>
        )}
        
        {/* Simplified overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Enhanced Price Badge */}
        <div className="absolute top-4 right-4">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-2 rounded-xl shadow-lg border border-white/20">
            <div className="text-xl font-bold">${pkg.price}</div>
            <div className="text-xs opacity-90">per person</div>
          </div>
        </div>

        {/* Featured Badge - Remove for now since not in type */}

        {/* Rating Badge */}
        <div className="absolute bottom-4 left-4">
          <div className="bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg flex items-center gap-1">
            <StarSolidIcon className="h-4 w-4 text-yellow-400" aria-hidden="true" />
            <span className="font-bold text-sm">4.9</span>
          </div>
        </div>
      </div>
      
      {/* Enhanced Package Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
          {pkg.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">{pkg.description}</p>
        
        {/* Enhanced Package Details */}
        <div className="grid grid-cols-3 gap-3 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-blue-500 flex-shrink-0" aria-hidden="true" />
            <span className="font-medium">{durationString}</span>
          </div>
          <div className="flex items-center gap-2">
            <UsersIcon className="h-4 w-4 text-purple-500 flex-shrink-0" aria-hidden="true" />
            <span className="font-medium">Up to 4</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPinIcon className="h-4 w-4 text-green-500 flex-shrink-0" aria-hidden="true" />
            <span className="font-medium">{destinations.length} islands</span>
          </div>
        </div>
        
        {/* Enhanced Highlights */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {['All-inclusive', 'Water activities', 'Local tours'].map((highlight, idx) => (
              <span 
                key={idx}
                className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-3 py-1 rounded-xl text-xs font-semibold border border-blue-100"
              >
                {highlight}
              </span>
            ))}
            <span className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 px-3 py-1 rounded-xl text-xs font-semibold border border-gray-200">
              +2 more
            </span>
          </div>
        </div>
        
        {/* Enhanced Action Buttons with Better Accessibility */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link 
            to={`/packages/${pkg.id}`} 
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 text-center flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-offset-2"
            aria-label={`View details for ${pkg.name} package`}
          >
            <SparklesIcon className="h-4 w-4" aria-hidden="true" />
            <span>View Details</span>
            <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
          </Link>
          <button 
            onClick={handleBookNow}
            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-xl text-sm font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-offset-2"
            aria-label={`Book ${pkg.name} package via WhatsApp`}
          >
            <span className="text-base" aria-hidden="true">💬</span>
            <span>Book Now</span>
          </button>
        </div>
      </div>
    </article>
  );
} 