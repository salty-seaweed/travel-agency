import React, { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Box, VStack, Text, Button, Container, Heading, Icon, useToast, useColorModeValue } from '@chakra-ui/react';
import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { useHomepageData, useHomepageContent } from '../../hooks/useQueries';
import { LoadingSpinner } from '../LoadingSpinner';
import { SEO } from '../SEO';
import { PageErrorBoundary } from '../SimpleErrorBoundary';
import { usePerformanceMonitor } from '../../utils/performanceUtils';
import { useTranslation } from '../../i18n';

// Lazy load sections for better performance
const ExperiencesHeroSection = React.lazy(() => import('./sections/HeroSection').then(module => ({ default: module.ExperiencesHeroSection })));
const ExperiencesSearchSection = React.lazy(() => import('./sections/SearchSection').then(module => ({ default: module.ExperiencesSearchSection })));
const ExperiencesTrendingDeals = React.lazy(() => import('./sections/TrendingDeals').then(module => ({ default: module.ExperiencesTrendingDeals })));
const ExperiencesTrustSection = React.lazy(() => import('./sections/TrustSection').then(module => ({ default: module.ExperiencesTrustSection })));
const ExperiencesDestinationsSection = React.lazy(() => import('./sections/DestinationsSection').then(module => ({ default: module.ExperiencesDestinationsSection })));
const ExperiencesActivitiesSection = React.lazy(() => import('./sections/ActivitiesSection').then(module => ({ default: module.ExperiencesActivitiesSection })));
const ExperiencesTestimonialsSection = React.lazy(() => import('./sections/TestimonialsSection').then(module => ({ default: module.ExperiencesTestimonialsSection })));
const ExperiencesNewsletterSection = React.lazy(() => import('./sections/NewsletterSection').then(module => ({ default: module.ExperiencesNewsletterSection })));

// Section loading fallbacks
const SectionSkeleton = ({ height = "400px" }: { height?: string }) => (
  <Box bg="white" p={6} borderRadius="xl" boxShadow="lg" height={height}>
    <Box mb={4}>
      <Box bg="gray.200" height="32px" width="200px" borderRadius="lg" mb={3} />
      <Box bg="gray.200" height="16px" width="300px" borderRadius="lg" />
    </Box>
    <Box bg="gray.200" height="200px" borderRadius="lg" />
  </Box>
);

export const ExperiencesHomePage = React.memo(() => {
  const { properties, packages, isLoading, isError, error } = useHomepageData();
  const { data: homepageContent } = useHomepageContent();
  const { measure } = usePerformanceMonitor('ExperiencesHomePage');
  const { t } = useTranslation();
  const toast = useToast();

  // Progressive loading state
  const [loadedSections, setLoadedSections] = useState<Set<string>>(new Set(['hero']));

  useEffect(() => {
    if (!isLoading && !isError) {
      measure('render-complete');
      
      // Progressively load sections
      const loadSections = async () => {
        const sections = ['search', 'trending', 'trust', 'destinations', 'activities', 'testimonials', 'newsletter'];
        
        for (const section of sections) {
          await new Promise(resolve => setTimeout(resolve, 100)); // Small delay for smooth loading
          setLoadedSections(prev => new Set([...prev, section]));
        }
      };
      
      loadSections();
    }
  }, [isLoading, isError, measure]);

  // Show skeleton loading for better perceived performance
  if (isLoading) {
    return (
      <Box className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <LoadingSpinner variant="card-skeleton" count={4} />
      </Box>
    );
  }

  if (isError) {
    return (
      <PageErrorBoundary pageName="Homepage">
        <div className="min-h-screen flex items-center justify-center bg-red-50">
          <VStack textAlign="center" spacing={6} maxW="md">
            <Icon as={ExclamationTriangleIcon} className="w-16 h-16 text-red-500" />
            <Heading size="2xl" color="gray.900">Failed to Load Homepage</Heading>
            <Text color="gray.600">{error?.message || 'Something went wrong. Please try again.'}</Text>
            <Button onClick={() => window.location.reload()} colorScheme="blue" size="lg" className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
              <Icon as={ArrowPathIcon} className="w-5 h-5 mr-2" /> Reload Page
            </Button>
          </VStack>
        </div>
      </PageErrorBoundary>
    );
  }

  return (
    <>
      <SEO title="Maldives Experiences & Packages" description="Discover curated Maldives experiences, stays and tours. Book safely with local experts." keywords="Maldives, experiences, packages, stays, tours" />
      
      <Box className="relative">
        {/* Hero Section - Always loaded first */}
        <Suspense fallback={<SectionSkeleton height="600px" />}>
          <ExperiencesHeroSection homepageContent={homepageContent} />
        </Suspense>

        {/* Search Section */}
        {loadedSections.has('search') && (
          <Suspense fallback={<SectionSkeleton height="200px" />}>
            <ExperiencesSearchSection />
          </Suspense>
        )}

        {/* Trending Deals */}
        {loadedSections.has('trending') && (
          <Suspense fallback={<SectionSkeleton height="400px" />}>
            <ExperiencesTrendingDeals packages={packages} />
          </Suspense>
        )}

        {/* Trust Section */}
        {loadedSections.has('trust') && (
          <Suspense fallback={<SectionSkeleton height="300px" />}>
            <ExperiencesTrustSection homepageContent={homepageContent} />
          </Suspense>
        )}

        {/* Destinations Section */}
        {loadedSections.has('destinations') && (
          <Suspense fallback={<SectionSkeleton height="500px" />}>
            <ExperiencesDestinationsSection properties={properties} packages={packages} />
          </Suspense>
        )}

        {/* Activities Section */}
        {loadedSections.has('activities') && (
          <Suspense fallback={<SectionSkeleton height="400px" />}>
            <ExperiencesActivitiesSection homepageContent={homepageContent} />
          </Suspense>
        )}

        {/* Testimonials Section */}
        {loadedSections.has('testimonials') && (
          <Suspense fallback={<SectionSkeleton height="300px" />}>
            <ExperiencesTestimonialsSection testimonials={homepageContent?.testimonials} />
          </Suspense>
        )}

        {/* Newsletter Section */}
        {loadedSections.has('newsletter') && (
          <Suspense fallback={<SectionSkeleton height="200px" />}>
            <ExperiencesNewsletterSection />
          </Suspense>
        )}
      </Box>
    </>
  );
});

ExperiencesHomePage.displayName = 'ExperiencesHomePage';
