import React from 'react';
import { Text } from '@chakra-ui/react';
import type { TextProps } from '@chakra-ui/react';
import { TYPOGRAPHY_SCALE } from '../../styles/responsive-design';

interface ResponsiveTextProps extends Omit<TextProps, 'fontSize'> {
  children: React.ReactNode;
  variant?: 'display' | 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'small';
  fontSize?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
    largeDesktop?: string;
  };
}

export const ResponsiveText: React.FC<ResponsiveTextProps> = ({
  children,
  variant = 'body',
  fontSize,
  ...props
}) => {
  // Use predefined typography scale or custom fontSize
  const responsiveFontSize = fontSize || {
    mobile: TYPOGRAPHY_SCALE[variant].mobile,
    tablet: TYPOGRAPHY_SCALE[variant].tablet,
    desktop: TYPOGRAPHY_SCALE[variant].desktop,
    largeDesktop: TYPOGRAPHY_SCALE[variant].largeDesktop,
  };

  return (
    <Text
      fontSize={{
        base: responsiveFontSize.mobile,
        md: responsiveFontSize.tablet,
        lg: responsiveFontSize.desktop,
        xl: responsiveFontSize.largeDesktop,
      }}
      {...props}
    >
      {children}
    </Text>
  );
};

export default ResponsiveText; 