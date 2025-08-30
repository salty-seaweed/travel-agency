import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPinIcon, StarIcon, CalendarIcon, UsersIcon, ArrowRightIcon, CameraIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { Button, Icon, HStack, Text } from '@chakra-ui/react';
import type { Package } from '../../types';
import { whatsappBooking } from '../../services/whatsapp-booking';
import { BookingChoiceModal } from '../BookingChoiceModal';
import { useTranslation } from '../../i18n';

interface PackageCardProps {
  package: Package;
  className?: string;
  loading?: boolean;
}

export function PackageCard({ package: pkg, className = '', loading = false }: PackageCardProps) {
  const { t, i18n } = useTranslation();
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Helper function to get translated content based on current language
  const getTranslatedContent = (field: string, fallback: string = ''): string => {
    const currentLang = i18n.language;
    const translatedField = `${field}_${currentLang}` as keyof Package;
    
    // Check if translated version exists and is not empty
    if (pkg[translatedField] && typeof pkg[translatedField] === 'string' && pkg[translatedField].trim() !== '') {
      return pkg[translatedField] as string;
    }
    
    // Fallback to original field
    return (pkg[field as keyof Package] as string) || fallback;
  };

  // Helper functions to safely access nested properties
  const getDestinationsString = (): string => {
    if (pkg.destinations && pkg.destinations.length > 0) {
      return pkg.destinations.join(', ');
    }
    return t('packageCard.defaultDestination', 'Maldives Paradise');
  };

  const getHighlightsList = (): string[] => {
    if (pkg.highlights && pkg.highlights.length > 0) {
      return pkg.highlights;
    }
    return [t('packageCard.defaultHighlights.allInclusive', 'All-inclusive'), t('packageCard.defaultHighlights.waterActivities', 'Water activities'), t('packageCard.defaultHighlights.localTours', 'Local tours')];
  };

  const getImageUrl = (): string => {
    if (pkg.images && pkg.images.length > 0) {
      return pkg.images[0].image;
    }
    // High-quality Maldives resort images
    const maldivesImages = [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop&crop=center&auto=format&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop&crop=center&auto=format&q=80',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop&crop=center&auto=format&q=80',
    ];
    return maldivesImages[Math.floor(Math.random() * maldivesImages.length)];
  };

  const highlights = getHighlightsList();
  const destinationsString = getDestinationsString();
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
    <article className={`group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 border border-gray-100 ${className}`}>
      {/* Enhanced Image Container with Error Handling */}
      <div className="relative h-64 overflow-hidden bg-gray-100">
        {!imageError ? (
          <img
            src={imageUrl}
            alt={`${pkg.name} - ${destinationsString}`}
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
              <p className="text-gray-500 text-sm">{t('packageCard.imageUnavailable', 'Image unavailable')}</p>
            </div>
          </div>
        )}
        
        {/* Simplified overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Price Badge */}
        <div className="absolute top-4 right-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg">
            <div className="text-2xl font-bold text-green-600">${pkg.price}</div>
            <div className="text-xs text-gray-500 font-medium">{t('packageCard.perPerson', 'per person')}</div>
          </div>
        </div>
        
        {pkg.is_featured && (
          <div className="absolute top-4 left-4">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg">
              ⭐ {t('packageCard.featured', 'Featured')}
            </span>
          </div>
        )}
      </div>
      
      {/* Enhanced Content with Better Information Hierarchy */}
      <div className="p-6 flex flex-col min-h-0">
        {/* Title and Location */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-1 group-hover:text-blue-600 transition-colors duration-300">
          {getTranslatedContent('name', pkg.name)}
        </h3>
        <div className="flex items-center text-gray-600 mb-4">
          <MapPinIcon className="h-4 w-4 mr-2 flex-shrink-0 text-blue-500" aria-hidden="true" />
          <span className="text-sm font-medium line-clamp-1">{destinationsString}</span>
        </div>
        
        {/* Package Details */}
        <div className="grid grid-cols-3 gap-3 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-blue-500 flex-shrink-0" aria-hidden="true" />
            <span className="font-medium text-xs">{t('packageCard.duration', '{{count}} days', { count: pkg.duration })}</span>
          </div>
          <div className="flex items-center gap-2">
            <UsersIcon className="h-4 w-4 text-purple-500 flex-shrink-0" aria-hidden="true" />
            <span className="font-medium text-xs">{t('packageCard.maxTravelers', 'Up to {{count}}', { count: pkg.maxTravelers })}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPinIcon className="h-4 w-4 text-green-500 flex-shrink-0" aria-hidden="true" />
            <span className="font-medium text-xs">{t('packageCard.islands', '{{count}} islands', { count: pkg.destinations?.length || 1 })}</span>
          </div>
        </div>
        
        {/* Highlights - Limited to prevent overflow */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {highlights.slice(0, 2).map((highlight, index) => (
              <span 
                key={index}
                className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-2 py-1 rounded-lg text-xs font-semibold border border-blue-100"
              >
                {highlight}
              </span>
            ))}
            {highlights.length > 2 && (
              <span className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 px-2 py-1 rounded-lg text-xs font-semibold border border-gray-200">
                {t('packageCard.moreHighlights', '+{{count}} more', { count: highlights.length - 2 })}
              </span>
            )}
          </div>
        </div>
        
        {/* Enhanced Action Buttons - Always visible at bottom */}
        <div className="flex flex-col sm:flex-row gap-3 mt-auto pt-2">
          <Link
            to={`/packages/${pkg.id}`}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 text-center flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-offset-2"
            aria-label={`View details for ${pkg.name} package`}
          >
            <CameraIcon className="h-4 w-4" aria-hidden="true" />
            <span>{t('packageCard.viewDetails', 'View Details')}</span>
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
            aria-label={`Book ${pkg.name} package`}
            w={{ base: 'full', sm: 'auto' }}
          >
            <HStack spacing={2}>
              <Text fontSize="base" aria-hidden="true">💬</Text>
              <Text>{t('packageCard.bookNow', 'Book Now')}</Text>
            </HStack>
          </Button>
        </div>
      </div>
      
      {/* Booking Choice Modal */}
      <BookingChoiceModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        package={pkg}
      />
    </article>
  );
}

export default PackageCard; 
