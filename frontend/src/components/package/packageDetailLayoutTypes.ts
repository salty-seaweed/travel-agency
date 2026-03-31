import type { Package } from '../../types';
import type { PackageDetailVariant } from '../../theme/packageDetailVariants';

export interface BookingInitialValues {
  start_date?: string;
  number_of_guests?: number;
}

export interface PackageDetailLayoutProps {
  packageData: Package;
  viewPackage: Package;
  selectedVariantId: number | null;
  onVariantChange: (id: number) => void;
  onBookNow: (init?: BookingInitialValues) => void;
  onAddToWishlist: () => void;
  onShare: () => void;
  isWishlisted: boolean;
  variant?: PackageDetailVariant;
  onLayoutVariantChange?: (variant: PackageDetailVariant) => void;
}
