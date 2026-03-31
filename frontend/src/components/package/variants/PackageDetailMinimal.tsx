import React from 'react';
import { Box, Container, VStack } from '@chakra-ui/react';
import { PackageDetailVariantProvider } from '../../../contexts/PackageDetailVariantContext';
import { packageDetailVariants } from '../../../theme/packageDetailVariants';
import { VariantSwitcher } from '../VariantSwitcher';
import { PackageHero } from '../PackageHero';
import { KeyFactsBar } from '../KeyFactsBar';
import { PackageDetailInlineCTA } from '../PackageDetailInlineCTA';
import { PackageSection } from '../PackageSection';
import { CalendarIcon, MapIcon, SparklesIcon, CheckCircleIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { ImageGallery } from './minimal/ImageGallery';
import { AboutSection } from './minimal/AboutSection';
import { ItinerarySection } from './minimal/ItinerarySection';
import { DestinationsSection } from './minimal/DestinationsSection';
import { ActivitiesSection } from './minimal/ActivitiesSection';
import { InclusionsSection } from './minimal/InclusionsSection';
import { ReviewsSection } from './minimal/ReviewsSection';
import type { PackageDetailLayoutProps } from '../packageDetailLayoutTypes';

export function PackageDetailMinimal({
  packageData,
  viewPackage,
  selectedVariantId,
  onVariantChange,
  onBookNow,
  onAddToWishlist,
  onShare,
  isWishlisted,
  variant = 'minimal',
  onLayoutVariantChange,
}: PackageDetailLayoutProps) {
  const theme = packageDetailVariants.minimal;
  const contentBg = theme.section.sectionBg === 'transparent' ? 'gray.50' : theme.section.sectionBg;

  const selectedVariant =
    selectedVariantId && (packageData as { variants?: { id: number }[] }).variants
      ? (packageData as { variants: { id: number; duration_days: number; price: string; is_default?: boolean }[] }).variants.find(
          (v) => v.id === selectedVariantId
        )
      : undefined;

  return (
    <PackageDetailVariantProvider variant="minimal">
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
        <Container maxW="container.sm" py={4} px={4}>
          <KeyFactsBar packageData={viewPackage} variant="light" />
        </Container>
        <Container maxW="640px" py={8} px={4}>
          <VStack spacing={8} align="stretch">
            <PackageSection title="About" icon={DocumentTextIcon}>
              <AboutSection packageData={packageData} />
            </PackageSection>
            {packageData.images && packageData.images.length > 0 && (
              <ImageGallery images={packageData.images} packageName={packageData.name} />
            )}
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
            <PackageDetailInlineCTA
              packageData={viewPackage}
              onBookNow={onBookNow}
              selectedVariant={selectedVariant}
              variants={(packageData as { variants?: { id: number; duration_days: number; price: string; is_default?: boolean }[] }).variants || []}
              selectedVariantId={selectedVariantId}
              onVariantChange={onVariantChange}
            />
            {packageData.reviews && packageData.reviews.length > 0 && (
              <PackageSection title="Customer Reviews" icon={CheckCircleIcon}>
                <ReviewsSection reviews={packageData.reviews} />
              </PackageSection>
            )}
          </VStack>
        </Container>
      </Box>
    </PackageDetailVariantProvider>
  );
}
