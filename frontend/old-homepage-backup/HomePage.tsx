import React, { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Container,
  Heading,
  Badge,
  Icon,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import { 
  ChatBubbleLeftRightIcon,
  ArrowRightIcon,
  GlobeAltIcon,
  SparklesIcon,
  GiftIcon,
  CreditCardIcon,
  LockClosedIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { useHomepageData, useHomepageContent } from '../hooks/useQueries';
import { LoadingSpinner } from './index';
import { SEO } from './SEO';
import { PageErrorBoundary } from './SimpleErrorBoundary';
// import { EnhancedSearch } from './EnhancedSearch'; // TEMPORARILY DISABLED
import { usePerformanceMonitor, useIntersectionObserver } from '../utils/performanceUtils';
import { config, getWhatsAppUrl } from '../config';
import { useTranslation } from '../i18n';
import { HeroSection } from './homepage/HeroSection';
import { PackagesSection } from './homepage/PackagesSection';
import { PropertiesSection } from './homepage/PropertiesSection';
import { FeaturesSection } from './homepage/FeaturesSection';
import { TestimonialsSection } from './homepage/TestimonialsSection';
import { StatisticsSection } from './homepage/StatisticsSection';
import { CTASection } from './homepage/CTASection';

// Lazy load non-critical sections
const LazyFeaturesSection = React.lazy(() => import('./homepage/FeaturesSection').then(module => ({ default: module.FeaturesSection })));
const LazyTestimonialsSection = React.lazy(() => import('./homepage/TestimonialsSection').then(module => ({ default: module.TestimonialsSection })));
const LazyStatisticsSection = React.lazy(() => import('./homepage/StatisticsSection').then(module => ({ default: module.StatisticsSection })));

export const HomePage = React.memo(() => {
  const { properties, packages, isLoading, isError, error } = useHomepageData();
  const { data: homepageContent, isLoading: contentLoading, error: contentError } = useHomepageContent();
  
  const { measure } = usePerformanceMonitor('HomePage');
  const { t } = useTranslation();
  const toast = useToast();

  // Intersection observer for lazy loading
  const [featuresRef, isFeaturesVisible] = useIntersectionObserver({ threshold: 0.1 });
  const [testimonialsRef, isTestimonialsVisible] = useIntersectionObserver({ threshold: 0.1 });
  const [statsRef, isStatsVisible] = useIntersectionObserver({ threshold: 0.1 });

  // Hero background images for rotation - Using greenery and ocean views (no faces)
  const heroImages = useMemo(() => [
    "/src/assets/images/ishan45.jpg", // Ocean view
    "/src/assets/images/ishan46.jpg", // Greenery
    "/src/assets/images/ishan47.jpg", // Ocean
    "/src/assets/images/ishan48.jpg", // Beach with greenery
    "/src/assets/images/ishan49.jpg", // Ocean view
    "/src/assets/images/ishan50.jpg", // Tropical greenery
    "/src/assets/images/ishan51.jpg", // Ocean
    "/src/assets/images/ishan52.jpg", // Beach with trees
  ], []);

  // Memoized data for better performance
  const memoizedProperties = useMemo(() => properties, [properties]);
  const memoizedPackages = useMemo(() => packages, [packages]);
  const memoizedHomepageContent = useMemo(() => homepageContent, [homepageContent]);

  // Optimized error handling
  const handleError = useCallback((error: any) => {
    console.error('Homepage error:', error);
    toast({
      title: 'Error',
      description: error?.message || 'Something went wrong. Please try again.',
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  }, [toast]);

  // Measure successful render only once when component mounts
  useEffect(() => {
    if (!isLoading && !isError) {
      measure('render-complete');
    }
  }, [isLoading, isError, measure]);

  // Handle loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <VStack spacing={6}>
          <Spinner size="xl" color="blue.500" thickness="4px" />
          <Text className="text-lg text-gray-600 font-medium">Loading your dream destinations...</Text>
        </VStack>
      </div>
    );
  }

  // Handle error state
  if (isError) {
    return (
      <PageErrorBoundary pageName="Homepage">
        <div className="min-h-screen flex items-center justify-center bg-red-50">
          <VStack textAlign="center" spacing={6} maxW="md">
            <Icon as={ExclamationTriangleIcon} className="w-16 h-16 text-red-500" />
            <Heading size="2xl" color="gray.900">Failed to Load Homepage</Heading>
            <Text color="gray.600">
              {error?.message || 'Something went wrong. Please try again.'}
            </Text>
            <Button 
              onClick={() => window.location.reload()}
              colorScheme="blue"
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
            >
              <Icon as={ArrowPathIcon} className="w-5 h-5 mr-2" />
              Reload Page
            </Button>
          </VStack>
        </div>
      </PageErrorBoundary>
    );
  }

  return (
    <>
      <SEO 
        title="Thread Travels & Tours - Your Trusted Maldives Travel Partner"
        description="Discover the best properties and travel packages in the Maldives. We connect you with authentic local accommodations and unforgettable experiences."
        keywords="Maldives travel, property booking, local accommodation, island hopping, Thread Travels"
      />
      
      <Box bg="gray.50" className="bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 relative">

        
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        {/* Hero Section */}
        <HeroSection homepageContent={homepageContent} heroImages={heroImages} />

        {/* Search Section - Moved from Hero - TEMPORARILY HIDDEN */}
        {/* <section className="py-12 bg-white border-b border-gray-100">
          <Container maxW="7xl">
            <VStack spacing={8}>
              <Text className="text-2xl font-semibold text-gray-800 text-center">
                Find Your Perfect Maldives Experience
              </Text>
              <div className="w-full max-w-4xl mx-auto">
                <Card className="bg-white border border-gray-200 shadow-lg">
                  <CardBody className="p-6">
                    <EnhancedSearch />
                  </CardBody>
                </Card>
              </div>
            </VStack>
          </Container>
        </section> */}

        {/* Travel Packages Section */}
        <PackagesSection packages={packages} homepageContent={homepageContent} />

        {/* Featured Properties Section */}
        <PropertiesSection properties={properties} homepageContent={homepageContent} />

        {/* Features Section */}
        <FeaturesSection features={homepageContent?.features} />

        {/* Statistics Section */}
        <StatisticsSection statistics={homepageContent?.statistics} />

        {/* Testimonials Section */}
        <TestimonialsSection testimonials={homepageContent?.testimonials} />

        {/* CTA Section */}
        <CTASection ctaData={homepageContent?.cta_section} />
      </Box>
    </>
  );
});

HomePage.displayName = 'HomePage'; 