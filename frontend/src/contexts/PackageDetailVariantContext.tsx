import React, { createContext, useContext } from 'react';
import {
  getActivePackageDetailVariant,
  packageDetailVariants,
  type PackageDetailVariant,
  type PackageDetailVariantTheme,
} from '../theme/packageDetailVariants';

const PackageDetailVariantContext = createContext<PackageDetailVariantTheme | null>(null);

export function PackageDetailVariantProvider({
  children,
  variant: overrideVariant,
}: {
  children: React.ReactNode;
  variant?: PackageDetailVariant;
}) {
  const variant = overrideVariant ?? getActivePackageDetailVariant();
  const theme = packageDetailVariants[variant];

  return (
    <PackageDetailVariantContext.Provider value={theme}>
      {children}
    </PackageDetailVariantContext.Provider>
  );
}

export function usePackageDetailVariant(): PackageDetailVariantTheme {
  const ctx = useContext(PackageDetailVariantContext);
  return ctx ?? packageDetailVariants[getActivePackageDetailVariant()];
}
