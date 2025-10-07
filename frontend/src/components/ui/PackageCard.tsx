import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPinIcon, StarIcon, CalendarIcon, UsersIcon, ArrowRightIcon, CameraIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { Button, Icon, HStack, Text } from '@chakra-ui/react';
import type { Package } from '../../types';
import { whatsappBooking } from '../../services/whatsapp-booking';
import { useTranslation } from '../../i18n';
import { useCurrency } from '../../contexts/CurrencyContext';
import { SmartLazyImage } from '../SmartLazyImage';
import { useNavigate } from 'react-router-dom';

interface PackageCardProps {
  package: Package;
  className?: string;
  loading?: boolean;
}

export function PackageCard({ package: pkg, className = '', loading = false }: PackageCardProps) {
  const { t, i18n } = useTranslation();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  // Helper function to get translated content based on current language
  const getTranslatedContent = React.useCallback((field: string, fallback: string = ''): string => {
    const currentLang = i18n.language;
    const translatedField = `${field}_${currentLang}` as keyof Package;
    
    // Check if translated version exists and is not empty
    if (pkg[translatedField] && typeof pkg[translatedField] === 'string' && pkg[translatedField].trim() !== '') {
      return pkg[translatedField] as string;
    }
    
    // Fallback to original field
    return (pkg[field as keyof Package] as string) || fallback;
  }, [pkg, i18n.language]);

  // Helper functions to safely access nested properties
  const getDestinationsString = React.useCallback((): string => {
    if (pkg.destinations && pkg.destinations.length > 0) {
      return pkg.destinations.join(', ');
    }
    return t('packageCard.defaultDestination', 'Maldives Paradise');
  }, [pkg.destinations, t]);

  const getHighlightsList = React.useCallback((): string[] => {
    if (pkg.highlights && pkg.highlights.length > 0) {
      return pkg.highlights;
    }
    return [t('packageCard.defaultHighlights.allInclusive', 'All-inclusive'), t('packageCard.defaultHighlights.waterActivities', 'Water activities'), t('packageCard.defaultHighlights.localTours', 'Local tours')];
  }, [pkg.highlights, t]);

  const getImageUrl = React.useCallback((): string => {
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
  }, [pkg.images]);

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
      {/* Smart Image Container - Clean with no text overlays */}
      <div className="relative h-64 overflow-hidden">
        <SmartLazyImage
          src={imageUrl}
          alt={`${pkg.name} - ${destinationsString}`}
          width="100%"
          height="100%"
          objectFit="cover"
          useCase="card"
          enableSmartConversion={true}
          showLoadingSkeleton={true}
          fallbackSrc={imageUrl} // Use the same image as fallback
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageError(true);
            setImageLoaded(true);
          }}
        />
        
        {/* Subtle hover overlay only */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      {/* Content Area - Package name moved under photo */}
      <div className="p-5 flex flex-col min-h-0">
        {/* Title - First thing under photo */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-sky-600 transition-colors duration-300">
          {getTranslatedContent('name', pkg.name)}
        </h3>
        <div className="flex items-center text-gray-600 mb-3">
          <MapPinIcon className="h-4 w-4 mr-1.5 flex-shrink-0 text-sky-500" aria-hidden="true" />
          <span className="text-sm font-medium line-clamp-1">{destinationsString}</span>
        </div>
        
        {/* Package Details */}
        <div className="grid grid-cols-3 gap-2 mb-3 text-sm text-gray-600">
          <div className="flex items-center gap-1.5">
            <CalendarIcon className="h-4 w-4 text-sky-500 flex-shrink-0" aria-hidden="true" />
            <span className="font-medium text-xs">
              {(() => {
                const hasVariants = Array.isArray((pkg as any).variants) && (pkg as any).variants.length > 0;
                const calculatedNights = pkg.nights || Math.max(0, (parseInt(String(pkg.duration)) || 1) - 1);
                
                if (!hasVariants) {
                  const daysText = t('packageCard.duration', '{{count}} days', { count: Number(pkg.duration) });
                  return calculatedNights > 0 ? `${daysText}, ${String(calculatedNights)} nights` : daysText;
                }
                const durations = Array.from(new Set((pkg as any).variants.map((v: any) => Number(v.duration_days)).filter((n: any) => !isNaN(n)))).sort((a: number,b: number)=>a-b);
                if (durations.length === 1) {
                  const daysText = t('packageCard.duration', '{{count}} days', { count: Number(durations[0]) });
                  return calculatedNights > 0 ? `${daysText}, ${String(calculatedNights)} nights` : daysText;
                }
                const daysRange = `${durations[0]}-${durations[durations.length-1]} days`;
                return calculatedNights > 0 ? `${daysRange}, ${String(calculatedNights)} nights` : daysRange;
              })()}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <UsersIcon className="h-4 w-4 text-teal-500 flex-shrink-0" aria-hidden="true" />
            <span className="font-medium text-xs">{t('packageCard.maxTravelers', 'Up to {{count}}', { count: pkg.maxTravelers })}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPinIcon className="h-4 w-4 text-emerald-500 flex-shrink-0" aria-hidden="true" />
            <span className="font-medium text-xs">{t('packageCard.islands', '{{count}} islands', { count: pkg.destinations?.length || 1 })}</span>
          </div>
        </div>
        
        {/* Price Display - Single mention */}
        <div className="mb-3">
          {(() => {
            // Determine starting price from variants if available
            const hasVariants = Array.isArray((pkg as any).variants) && (pkg as any).variants.length > 0;
            const variantPrices = hasVariants ? (pkg as any).variants.map((v: any) => parseFloat(String(v.price).replace(/[^0-9.]/g, ''))) : [];
            const variantOriginals = hasVariants ? (pkg as any).variants.map((v: any) => v.original_price ? parseFloat(String(v.original_price).replace(/[^0-9.]/g, '')) : null) : [];
            const minPrice = hasVariants ? Math.min(...variantPrices.filter(p => !isNaN(p))) : parseFloat(String(pkg.price).replace(/[^0-9.]/g, ''));
            const currentPrice = minPrice;
            const originalPrice = hasVariants ? (variantOriginals.filter((o): o is number => typeof o === 'number' && !isNaN(o)).sort((a,b)=>a-b)[0] || null) : (
              pkg.original_price && pkg.original_price !== null && pkg.original_price !== 'null' && pkg.original_price !== '0' && pkg.original_price !== '0.00'
                ? parseFloat((pkg.original_price as string).replace(/[^0-9.]/g, ''))
                : null
            );
            const discountPercent = originalPrice && originalPrice > currentPrice
              ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
              : 0;

            // Display the price as stored in database
            const displayPrice = currentPrice;
            const displayOriginalPrice = originalPrice;

            return (
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-2xl font-bold text-emerald-600">
                  {formatPrice(displayPrice)}
                </span>
                {discountPercent > 0 && displayOriginalPrice && (
                  <>
                    <span className="text-sm text-gray-400 line-through">
                      {formatPrice(displayOriginalPrice)}
                    </span>
                    <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                      {discountPercent}% OFF
                    </span>
                  </>
                )}
                {hasVariants && (
                  <span className="text-xs text-gray-500">from</span>
                )}
              </div>
            );
          })()}
        </div>
        
        {/* Highlights - Subtle design */}
        <div className="mb-3">
          <div className="flex flex-wrap gap-1.5">
            {highlights.slice(0, 2).map((highlight, index) => (
              <span 
                key={index}
                className="bg-sky-50 text-sky-700 px-2 py-1 rounded-md text-xs font-medium border border-sky-100"
              >
                {highlight}
              </span>
            ))}
            {highlights.length > 2 && (
              <span className="bg-gray-50 text-gray-600 px-2 py-1 rounded-md text-xs font-medium border border-gray-200">
                {t('packageCard.moreHighlights', '+{{count}} more', { count: highlights.length - 2 })}
              </span>
            )}
          </div>
        </div>
        
        {/* Action Buttons - Modern, clean design */}
        <div className="flex flex-col sm:flex-row gap-2 mt-auto pt-2">
          <Link
            to={`/packages/${pkg.id}`}
            className="flex-1 bg-gradient-to-r from-sky-500 to-blue-500 text-white py-2.5 px-3 rounded-lg text-sm font-medium hover:from-sky-600 hover:to-blue-600 transition-all duration-300 text-center flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-1"
            aria-label={`View details for ${pkg.name} package`}
          >
            <CameraIcon className="h-4 w-4" aria-hidden="true" />
            <span>{t('packageCard.viewDetails', 'View Details')}</span>
            <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Button
            onClick={() => navigate(`/packages/${pkg.id}/book`)}
            bgGradient="linear(to-r, emerald.500, teal.500)"
            color="white"
            py={2.5}
            px={3}
            borderRadius="lg"
            fontSize="sm"
            fontWeight="medium"
            boxShadow="md"
            _hover={{
              bgGradient: 'linear(to-r, emerald.600, teal.600)',
              boxShadow: 'lg',
              transform: 'scale(1.05)',
            }}
            transition="all 0.3s ease"
            _focus={{
              outline: 'none',
              ring: 2,
              ringColor: 'emerald.400',
              ringOffset: 1,
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
    </article>
  );
}

export default PackageCard; 
