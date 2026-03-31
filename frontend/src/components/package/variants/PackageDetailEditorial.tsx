import React from 'react';
import { motion } from 'framer-motion';
import { PackageDetailVariantProvider } from '../../../contexts/PackageDetailVariantContext';
import { packageDetailVariants } from '../../../theme/packageDetailVariants';
import { VariantSwitcher } from '../VariantSwitcher';
import { PackageHero } from '../PackageHero';
import { KeyFactsBar } from '../KeyFactsBar';
import { PackageDetailCompactSidebar } from '../PackageDetailCompactSidebar';
import { PackageSection } from '../PackageSection';
import { CalendarIcon, MapIcon, SparklesIcon, CheckCircleIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { ImageGallery } from './editorial/ImageGallery';
import { AboutSection } from './editorial/AboutSection';
import { ItinerarySection } from './editorial/ItinerarySection';
import { DestinationsSection } from './editorial/DestinationsSection';
import { ActivitiesSection } from './editorial/ActivitiesSection';
import { InclusionsSection } from './editorial/InclusionsSection';
import { ReviewsSection } from './editorial/ReviewsSection';
import type { PackageDetailLayoutProps } from '../packageDetailLayoutTypes';
import type { PackageVariant } from '../../../types';

const sectionMotion = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
};

export function PackageDetailEditorial({
  packageData,
  viewPackage,
  selectedVariantId,
  onVariantChange,
  onBookNow,
  onAddToWishlist,
  onShare,
  isWishlisted,
  variant = 'editorial',
  onLayoutVariantChange,
}: PackageDetailLayoutProps) {
  const theme = packageDetailVariants.editorial;
  const pageBgClass =
    theme.section.sectionBg === 'transparent'
      ? 'package-detail-surface min-h-screen'
      : 'min-h-screen bg-neutral-50';

  const variantsList: PackageVariant[] = packageData.variants ?? [];
  const selectedVariant =
    selectedVariantId && variantsList.length > 0
      ? variantsList.find((v) => v.id === selectedVariantId)
      : undefined;

  return (
    <PackageDetailVariantProvider variant="editorial">
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
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8">
          <KeyFactsBar packageData={viewPackage} variant="light" />
        </div>
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,720px)_400px]">
            <div className="flex min-w-0 flex-col gap-8 lg:gap-9 lg:rounded-[2rem] lg:bg-white/30 lg:p-6 lg:ring-1 lg:ring-editorial-espresso/[0.06] xl:p-8">
              {packageData.images && packageData.images.length > 0 && (
                <motion.div className="w-full overflow-hidden" {...sectionMotion}>
                  <ImageGallery images={packageData.images} packageName={packageData.name} />
                </motion.div>
              )}
              <motion.div {...sectionMotion}>
                <PackageSection title="About" icon={DocumentTextIcon}>
                  <AboutSection packageData={packageData} />
                </PackageSection>
              </motion.div>
              {packageData.inclusions && packageData.inclusions.length > 0 && (
                <motion.div {...sectionMotion}>
                  <PackageSection
                    title="What this package offers"
                    icon={CheckCircleIcon}
                    iconColor="emerald.500"
                  >
                    <InclusionsSection inclusions={packageData.inclusions} hideHeader />
                  </PackageSection>
                </motion.div>
              )}
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
              {packageData.reviews && packageData.reviews.length > 0 && (
                <motion.div {...sectionMotion}>
                  <PackageSection title="Customer Reviews" icon={CheckCircleIcon}>
                    <ReviewsSection reviews={packageData.reviews} />
                  </PackageSection>
                </motion.div>
              )}
            </div>
            <div className="hidden min-w-0 lg:block">
              <PackageDetailCompactSidebar
                packageData={viewPackage}
                onBookNow={onBookNow}
                selectedVariant={selectedVariant}
                variants={variantsList}
                selectedVariantId={selectedVariantId}
                onVariantChange={onVariantChange}
                variant="floating"
              />
            </div>
          </div>
        </div>
      </div>
    </PackageDetailVariantProvider>
  );
}
