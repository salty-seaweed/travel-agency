import React from 'react';
import { Box, Container, Grid, GridItem, VStack } from '@chakra-ui/react';
import { PackageDetailVariantProvider } from '../../../contexts/PackageDetailVariantContext';
import { packageDetailVariants } from '../../../theme/packageDetailVariants';
import { VariantSwitcher } from '../VariantSwitcher';
import { PackageHero } from '../PackageHero';
import { KeyFactsBar } from '../KeyFactsBar';
import { PackageSidebar } from '../PackageSidebar';
import { PackageSection } from '../PackageSection';
import { CalendarIcon, MapIcon, SparklesIcon, CheckCircleIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { ImageGallery } from './clean/ImageGallery';
import { AboutSection } from './clean/AboutSection';
import { ItinerarySection } from './clean/ItinerarySection';
import { DestinationsSection } from './clean/DestinationsSection';
import { ActivitiesSection } from './clean/ActivitiesSection';
import { InclusionsSection } from './clean/InclusionsSection';
import { ReviewsSection } from './clean/ReviewsSection';
import type { PackageDetailLayoutProps } from '../packageDetailLayoutTypes';

export function PackageDetailClean({
  packageData,
  viewPackage,
  selectedVariantId,
  onVariantChange,
  onBookNow,
  onAddToWishlist,
  onShare,
  isWishlisted,
  variant = 'clean',
  onLayoutVariantChange,
}: PackageDetailLayoutProps) {
  const theme = packageDetailVariants.clean;
  const contentBg = theme.section.sectionBg === 'transparent' ? 'gray.50' : theme.section.sectionBg;

  return (
    <PackageDetailVariantProvider variant="clean">
      <Box bg={contentBg} minH="100vh">
        {onLayoutVariantChange && (
          <Box position="fixed" top={4} right={4} zIndex={60}>
            <VariantSwitcher value={variant} onChange={onLayoutVariantChange} />
          </Box>
        )}
        <PackageHero
          packageData={viewPackage}
          onBookNow={() => onBookNow()}
          onAddToWishlist={onAddToWishlist}
          onShare={onShare}
          isWishlisted={isWishlisted}
        />
        <Container maxW="7xl" py={4}>
          <KeyFactsBar packageData={viewPackage} variant="light" />
        </Container>
        <Container maxW="7xl" py={8}>
          <Grid
            templateColumns={{ base: '1fr', lg: '1fr 2fr' }}
            gap={8}
            alignItems="start"
          >
            <GridItem order={{ base: 2, lg: 1 }}>
              <PackageSidebar
                packageData={viewPackage}
                onBookNow={onBookNow}
                selectedVariant={
                  selectedVariantId && (packageData as { variants?: { id: number }[] }).variants
                    ? (packageData as { variants: { id: number; duration_days: number; price: string; original_price?: string; is_default?: boolean }[] }).variants.find(
                        (v) => v.id === selectedVariantId
                      )
                    : undefined
                }
                variants={(packageData as { variants?: { id: number; duration_days: number; price: string; is_default?: boolean }[] }).variants || []}
                selectedVariantId={selectedVariantId}
                onVariantChange={onVariantChange}
              />
            </GridItem>
            <GridItem order={{ base: 1, lg: 2 }}>
              <VStack spacing={8} align="stretch">
                {packageData.images && packageData.images.length > 0 && (
                  <ImageGallery images={packageData.images} packageName={packageData.name} />
                )}
                <PackageSection title="About" icon={DocumentTextIcon}>
                  <AboutSection packageData={packageData} />
                </PackageSection>
                {packageData.itinerary && packageData.itinerary.length > 0 && (
                  <PackageSection title="Detailed Itinerary" icon={CalendarIcon}>
                    <ItinerarySection itinerary={packageData.itinerary} hideHeader />
                  </PackageSection>
                )}
                {packageData.destinations?.length ? (
                  <PackageSection title="Destinations & Journey Map" icon={MapIcon}>
                    <DestinationsSection destinations={packageData.destinations} hideHeader />
                  </PackageSection>
                ) : null}
                {packageData.activities && packageData.activities.length > 0 && (
                  <PackageSection title="Activities & Experiences" icon={SparklesIcon}>
                    <ActivitiesSection activities={packageData.activities} hideHeader />
                  </PackageSection>
                )}
                {packageData.inclusions && packageData.inclusions.length > 0 && (
                  <PackageSection title="What's Included" icon={CheckCircleIcon} iconColor="emerald.500">
                    <InclusionsSection inclusions={packageData.inclusions} hideHeader />
                  </PackageSection>
                )}
                {packageData.reviews && packageData.reviews.length > 0 && (
                  <PackageSection title="Customer Reviews" icon={CheckCircleIcon}>
                    <ReviewsSection reviews={packageData.reviews} />
                  </PackageSection>
                )}
              </VStack>
            </GridItem>
          </Grid>
        </Container>
      </Box>
    </PackageDetailVariantProvider>
  );
}
