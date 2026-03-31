import React from 'react';
import { PackageDetailEditorial } from './variants/PackageDetailEditorial';
import { PackageDetailClean } from './variants/PackageDetailClean';
import { PackageDetailIsland } from './variants/PackageDetailIsland';
import { PackageDetailMinimal } from './variants/PackageDetailMinimal';
import type { PackageDetailLayoutProps } from './packageDetailLayoutTypes';
import type { PackageDetailVariant } from '../../theme/packageDetailVariants';

export type { PackageDetailLayoutProps } from './packageDetailLayoutTypes';

export function PackageDetailLayout(props: PackageDetailLayoutProps) {
  const variant = props.variant ?? 'island';

  switch (variant) {
    case 'editorial':
      return <PackageDetailEditorial {...props} variant={variant} />;
    case 'clean':
      return <PackageDetailClean {...props} variant={variant} />;
    case 'island':
      return <PackageDetailIsland {...props} variant={variant} />;
    case 'minimal':
      return <PackageDetailMinimal {...props} variant={variant} />;
    default:
      return <PackageDetailIsland {...props} variant="island" />;
  }
}
