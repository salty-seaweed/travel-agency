import React from 'react';
import { SimpleGrid } from '@chakra-ui/react';
import type { SimpleGridProps } from '@chakra-ui/react';
import { getResponsiveValue } from '../../styles/responsive-design';

interface ResponsiveGridProps extends Omit<SimpleGridProps, 'columns'> {
  children: React.ReactNode;
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
    largeDesktop?: number;
  };
  spacing?: 'small' | 'medium' | 'large';
  minChildWidth?: string;
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  columns = { mobile: 1, tablet: 2, desktop: 3, largeDesktop: 4 },
  spacing = 'medium',
  minChildWidth,
  ...props
}) => {
  // Define spacing variants
  const spacingVariants = {
    small: getResponsiveValue('0.5rem', '0.75rem', '1rem', '1.25rem'),
    medium: getResponsiveValue('1rem', '1.5rem', '2rem', '2.5rem'),
    large: getResponsiveValue('1.5rem', '2rem', '3rem', '4rem'),
  };

  // Calculate responsive columns
  const responsiveColumns = getResponsiveValue(
    columns.mobile || 1,
    columns.tablet || columns.mobile || 1,
    columns.desktop || columns.tablet || columns.mobile || 1,
    columns.largeDesktop || columns.desktop || columns.tablet || columns.mobile || 1
  );

  return (
    <SimpleGrid
      columns={responsiveColumns}
      spacing={spacingVariants[spacing]}
      minChildWidth={minChildWidth}
      {...props}
    >
      {children}
    </SimpleGrid>
  );
};

export default ResponsiveGrid; 