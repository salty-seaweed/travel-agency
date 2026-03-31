import React, { useState, useEffect, Suspense } from 'react';
import { Box, VStack, Text, Button, Heading, Icon } from '@chakra-ui/react';
import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { useHomepageData, useHomepageContent } from '../../hooks/useQueries';
import { LoadingSpinner } from '../LoadingSpinner';
import { SEO } from '../SEO';
import { PageErrorBoundary } from '../SimpleErrorBoundary';
import { usePerformanceMonitor } from '../../utils/performanceUtils';
import { useTranslation } from '../../i18n';

// Lazy load sections for better performance
const ExperiencesHeroSection = React.lazy(() => import('./sections/HeroSection').then(module => ({ default: module.ExperiencesHeroSection })));
const ExperiencesTrendingDeals = React.lazy(() => import('./sections/TrendingDeals').then(module => ({ default: module.ExperiencesTrendingDeals })));
const ExperiencesResortsSection = React.lazy(() => import('./sections/ResortsSection').then(module => ({ default: module.ExperiencesResortsSection })));
const ExperiencesTrustSection = React.lazy(() => import('./sections/TrustSection').then(module => ({ default: module.ExperiencesTrustSection })));
const ExperiencesDestinationsSection = React.lazy(() => import('./sections/DestinationsSection').then(module => ({ default: module.ExperiencesDestinationsSection })));
const ExperiencesActivitiesSection = React.lazy(() => import('./sections/ActivitiesSection').then(module => ({ default: module.ExperiencesActivitiesSection })));
const ExperiencesTestimonialsSection = React.lazy(() => import('./sections/TestimonialsSection').then(module => ({ default: module.ExperiencesTestimonialsSection })));
const ExperiencesReviewsSection = React.lazy(() => import('./sections/ReviewsSection').then(module => ({ default: module.ExperiencesReviewsSection })));
const RecentlyViewedSection = React.lazy(() => import('./sections/RecentlyViewedSection').then(module => ({ default: module.RecentlyViewedSection })));
const BoatsFleetSection = React.lazy(() => import('./sections/BoatsFleetSection').then(module => ({ default: module.BoatsFleetSection })));
const BoatPackagesSection = React.lazy(() => import('./sections/BoatPackagesSection').then(module => ({ default: module.BoatPackagesSection })));

// Section loading fallbacks
const SectionSkeleton = ({ height = '400px' }: { height?: string }) => (
  <Box
    className="rounded-2xl border border-slate-200/90 bg-white shadow-sm"
    p={6}
    height={height}
  >
    <Box mb={4}>
      <Box bg="gray.200" height="32px" width="200px" borderRadius="lg" mb={3} />
      <Box bg="gray.200" height="16px" width="300px" borderRadius="lg" />
    </Box>
    <Box bg="gray.100" height="200px" borderRadius="xl" />
  </Box>
);

export const ExperiencesHomePage = React.memo(() => {
  const { packages, isLoading, isError, error } = useHomepageData();
  const { data: homepageContent } = useHomepageContent();
  const { measure } = usePerformanceMonitor('ExperiencesHomePage');
  const { t } = useTranslation();

  // Progressive loading state with intersection observer for better performance
  const [loadedSections, setLoadedSections] = useState<Set<string>>(new Set(['hero']));
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    if (!isLoading && !isError) {
      measure('render-complete');
      
      // Use intersection observer for performance
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setIsIntersecting(true);
          }
        },
        { threshold: 0.1 }
      );

      const heroElement = document.querySelector('[data-section="hero"]');
      if (heroElement) {
        observer.observe(heroElement);
      }

      return () => observer.disconnect();
    }
  }, [isLoading, isError, measure]);

  useEffect(() => {
    if (isIntersecting) {
        // Load sections more efficiently
        const loadSections = () => {
          const sections = ['trending', 'resorts', 'trust', 'destinations', 'activities', 'testimonials', 'reviews', 'newsletter'];
          
          // Load critical sections immediately
          const criticalSections = ['trending', 'resorts'];
          criticalSections.forEach(section => {
            setLoadedSections(prev => new Set([...prev, section]));
          });

        // Load remaining sections with requestIdleCallback for better performance
        const loadRemainingSection = (index: number) => {
          if (index >= sections.length) return;
          
          const section = sections[index];
          if (!criticalSections.includes(section)) {
            if ('requestIdleCallback' in window) {
              requestIdleCallback(() => {
                setLoadedSections(prev => new Set([...prev, section]));
                loadRemainingSection(index + 1);
              });
            } else {
              setTimeout(() => {
                setLoadedSections(prev => new Set([...prev, section]));
                loadRemainingSection(index + 1);
              }, 50);
            }
          } else {
            loadRemainingSection(index + 1);
          }
        };

        loadRemainingSection(0);
      };
      
      loadSections();
    }
  }, [isIntersecting]);

  // Show skeleton loading for better perceived performance
  if (isLoading) {
    return (
      <Box className="min-h-screen bg-gray-50">
        <LoadingSpinner variant="card-skeleton" count={4} />
      </Box>
    );
  }

  if (isError) {
    return (
      <PageErrorBoundary pageName="Homepage">
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <VStack textAlign="center" spacing={6} maxW="md">
            <Icon as={ExclamationTriangleIcon} className="h-16 w-16 text-red-500" />
            <Heading size="2xl" className="font-display text-slate-900">
              {t('homepage.error.title', 'Failed to Load Homepage')}
            </Heading>
            <Text color="gray.600">{error?.message || t('homepage.error.message', 'Something went wrong. Please try again.')}</Text>
            <Button
              onClick={() => window.location.reload()}
              size="lg"
              className="!min-h-11 !rounded-lg !border !border-slate-200/90 !bg-slate-900 !px-6 !text-white !shadow-sm hover:!bg-slate-800"
            >
              <Icon as={ArrowPathIcon} className="mr-2 h-5 w-5" /> {t('homepage.error.reload', 'Reload Page')}
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
        <div data-section="hero">
          <Suspense fallback={<SectionSkeleton height="600px" />}>
            <ExperiencesHeroSection homepageContent={homepageContent} />
          </Suspense>
        </div>

        {/* Search Section - Hidden as requested */}
        {/* {loadedSections.has('search') && (
          <Suspense fallback={<SectionSkeleton height="200px" />}>
            <ExperiencesSearchSection />
          </Suspense>
        )} */}

        {/* Recently Viewed */}
        <Suspense fallback={null}>
          <RecentlyViewedSection />
        </Suspense>

        {/* Resorts Section - Above curated packages */}
        <Suspense fallback={<SectionSkeleton height="500px" />}>
          <ExperiencesResortsSection />
        </Suspense>

        {/* Boats Fleet Section */}
        <Suspense fallback={<SectionSkeleton height="500px" />}>
          <BoatsFleetSection />
        </Suspense>

        {/* Boat Packages Section */}
        <Suspense fallback={<SectionSkeleton height="500px" />}>
          <BoatPackagesSection />
        </Suspense>

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
            <ExperiencesDestinationsSection packages={packages} />
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

        {/* Reviews Section */}
        {loadedSections.has('reviews') && (
          <Suspense fallback={<SectionSkeleton height="400px" />}>
            <ExperiencesReviewsSection />
          </Suspense>
        )}

        {/* Newsletter Section - Hidden as requested (Maldives deals and insider tips) */}
        {/* {loadedSections.has('newsletter') && (
          <Suspense fallback={<SectionSkeleton height="200px" />}>
            <ExperiencesNewsletterSection />
          </Suspense>
        )} */}
      </Box>
    </>
  );
});

ExperiencesHomePage.displayName = 'ExperiencesHomePage';
