import type { PackageDetailVariant } from '../../theme/packageDetailVariants';

const STORAGE_KEY = 'pkg_detail_layout_variant';

export function getStoredLayoutVariant(): PackageDetailVariant | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (
    stored &&
    (stored === 'editorial' || stored === 'clean' || stored === 'island' || stored === 'minimal')
  ) {
    return stored;
  }
  return null;
}

export function setStoredLayoutVariant(variant: PackageDetailVariant): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, variant);
}
