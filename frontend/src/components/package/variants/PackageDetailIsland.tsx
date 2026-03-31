import React from 'react';
import { motion } from 'framer-motion';
import { PackageDetailVariantProvider } from '../../../contexts/PackageDetailVariantContext';
import { packageDetailVariants } from '../../../theme/packageDetailVariants';
import { VariantSwitcher } from '../VariantSwitcher';
import { PackageHero } from '../PackageHero';
import { KeyFactsBar } from '../KeyFactsBar';
import { PackageSidebar } from '../PackageSidebar';
import { PackageSection } from '../PackageSection';
import { CalendarIcon, MapIcon, SparklesIcon, CheckCircleIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { ImageGallery } from './island/ImageGallery';
import { AboutSection } from './island/AboutSection';
import { ItinerarySection } from './island/ItinerarySection';
import { DestinationsSection } from './island/DestinationsSection';
import { ActivitiesSection } from './island/ActivitiesSection';
import { InclusionsSection } from './island/InclusionsSection';
import { ReviewsSection } from './island/ReviewsSection';
import type { PackageDetailLayoutProps } from '../packageDetailLayoutTypes';
import type { PackageVariant } from '../../../types';

const sectionMotion = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
};

export function PackageDetailIsland({
  packageData,
  viewPackage,
  selectedVariantId,
  onVariantChange,
  onBookNow,
  onAddToWishlist,
  onShare,
  isWishlisted,
  variant = 'island',
  onLayoutVariantChange,
}: PackageDetailLayoutProps) {
  const theme = packageDetailVariants.island;
  const pageBgClass =
    theme.section.sectionBg === 'transparent'
      ? 'package-detail-surface min-h-screen'
      : theme.section.sectionBg === 'sky.50'
        ? 'min-h-screen bg-sky-50/70'
        : 'min-h-screen bg-editorial-linen';

  const variantsList: PackageVariant[] = packageData.variants ?? [];
  const selectedVariant =
    selectedVariantId && variantsList.length > 0
      ? variantsList.find((v) => v.id === selectedVariantId)
      : undefined;

  return (
    <PackageDetailVariantProvider variant="island">
      <div className={pageBgClass}>
        {onLayoutVariantChange && (
          <div className="fixed right-4 top-4 z-[60]">
            <VariantSwitcher value={variant} onChange={onLayoutVariantChange} />
          </div>
        )}
        <PackageHero
          packageData={viewPackage}
          onBookNow={() => onBookNow()}
          onAddToWishlist={onAddToWishlist}
          onShare={onShare}
          isWishlisted={isWishlisted}
        />
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <KeyFactsBar packageData={viewPackage} variant="light" />
        </div>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr] lg:items-start">
            <div className="flex flex-col gap-8">
              {packageData.images && packageData.images.length > 0 && (
                <motion.div {...sectionMotion}>
                  <ImageGallery images={packageData.images} packageName={packageData.name} />
                </motion.div>
              )}
              <motion.div {...sectionMotion}>
                <PackageSection title="About" icon={DocumentTextIcon}>
                  <AboutSection packageData={packageData} />
                </PackageSection>
              </motion.div>
              {packageData.itinerary && packageData.itinerary.length > 0 && (
                <motion.div {...sectionMotion}>
                  <PackageSection title="Detailed Itinerary" icon={CalendarIcon}>
                    <ItinerarySection itinerary={packageData.itinerary} hideHeader />
                  </PackageSection>
                </motion.div>
              )}
              {packageData.destinations?.length ? (
                <motion.div {...sectionMotion}>
                  <PackageSection title="Destinations & Journey Map" icon={MapIcon}>
                    <DestinationsSection destinations={packageData.destinations} hideHeader />
                  </PackageSection>
                </motion.div>
              ) : null}
              {packageData.activities && packageData.activities.length > 0 && (
                <motion.div {...sectionMotion}>
                  <PackageSection title="Activities & Experiences" icon={SparklesIcon}>
                    <ActivitiesSection activities={packageData.activities} hideHeader />
                  </PackageSection>
                </motion.div>
              )}
              {packageData.inclusions && packageData.inclusions.length > 0 && (
                <motion.div {...sectionMotion}>
                  <PackageSection
                    title="What's Included"
                    icon={CheckCircleIcon}
                    iconColor="emerald.500"
                  >
                    <InclusionsSection inclusions={packageData.inclusions} hideHeader />
                  </PackageSection>
                </motion.div>
              )}
              {packageData.reviews && packageData.reviews.length > 0 && (
                <motion.div {...sectionMotion}>
                  <PackageSection title="Customer Reviews" icon={CheckCircleIcon}>
                    <ReviewsSection reviews={packageData.reviews} />
                  </PackageSection>
                </motion.div>
              )}
            </div>
            <div className="min-w-0">
              <PackageSidebar
                packageData={viewPackage}
                onBookNow={() => onBookNow()}
                selectedVariant={selectedVariant}
                variants={variantsList}
                selectedVariantId={selectedVariantId}
                onVariantChange={onVariantChange}
              />
            </div>
          </div>
        </div>
      </div>
    </PackageDetailVariantProvider>
  );
}
