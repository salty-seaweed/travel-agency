import React from 'react';
import { Box } from '@chakra-ui/react';
import type { BoxProps } from '@chakra-ui/react';
import { getResponsiveValue } from '../../styles/responsive-design';

interface ResponsiveContainerProps extends BoxProps {
  children: React.ReactNode;
  variant?: 'default' | 'narrow' | 'wide' | 'full';
  padding?: 'none' | 'small' | 'medium' | 'large';
  maxWidth?: string;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  variant = 'default',
  padding = 'medium',
  maxWidth,
  ...props
}) => {
  // Define container variants
  const containerVariants = {
    default: getResponsiveValue('100%', '90%', '1200px', '1400px'),
    narrow: getResponsiveValue('100%', '80%', '900px', '1000px'),
    wide: getResponsiveValue('100%', '95%', '1400px', '1600px'),
    full: '100%',
  };

  // Define padding variants
  const paddingVariants = {
    none: '0',
    small: getResponsiveValue('0.5rem', '1rem', '1.5rem', '2rem'),
    medium: getResponsiveValue('1rem', '1.5rem', '2rem', '2.5rem'),
    large: getResponsiveValue('1.5rem', '2rem', '3rem', '4rem'),
  };

  return (
    <Box
      maxW={maxWidth || containerVariants[variant]}
      mx="auto"
      px={paddingVariants[padding]}
      w="100%"
      {...props}
    >
      {children}
    </Box>
  );
};

export default ResponsiveContainer; 