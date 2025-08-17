import React from 'react';
import { Button } from '@chakra-ui/react';
import type { ButtonProps } from '@chakra-ui/react';
import { getResponsiveValue, TOUCH_TARGETS } from '../../styles/responsive-design';

interface ResponsiveButtonProps extends Omit<ButtonProps, 'size'> {
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  touchTarget?: 'minimum' | 'comfortable' | 'large';
}

export const ResponsiveButton: React.FC<ResponsiveButtonProps> = ({
  children,
  size = 'medium',
  touchTarget = 'comfortable',
  ...props
}) => {
  // Define responsive button sizes
  const buttonSizes = {
    small: {
      height: getResponsiveValue('2.25rem', '2.5rem', '2.75rem', '3rem'),
      padding: getResponsiveValue('0.5rem 1rem', '0.625rem 1.25rem', '0.75rem 1.5rem', '0.875rem 2rem'),
      fontSize: getResponsiveValue('0.75rem', '0.875rem', '1rem', '1.125rem'),
    },
    medium: {
      height: getResponsiveValue('2.75rem', '3rem', '3rem', '3.25rem'),
      padding: getResponsiveValue('0.75rem 1.5rem', '0.875rem 2rem', '1rem 2.5rem', '1.125rem 3rem'),
      fontSize: getResponsiveValue('0.875rem', '1rem', '1rem', '1.125rem'),
    },
    large: {
      height: getResponsiveValue('3.25rem', '3.5rem', '3.75rem', '4rem'),
      padding: getResponsiveValue('1rem 2rem', '1.25rem 2.5rem', '1.5rem 3rem', '1.75rem 3.5rem'),
      fontSize: getResponsiveValue('1rem', '1.125rem', '1.25rem', '1.375rem'),
    },
  };

  // Ensure minimum touch target size
  const minTouchTarget = TOUCH_TARGETS[touchTarget];
  const buttonSize = buttonSizes[size];

  return (
    <Button
      h={buttonSize.height}
      px={buttonSize.padding}
      fontSize={buttonSize.fontSize}
      minH={minTouchTarget}
      minW={minTouchTarget}
      borderRadius="xl"
      fontWeight="semibold"
      transition="all 0.3s ease"
      _hover={{
        transform: 'translateY(-2px)',
        boxShadow: 'lg',
      }}
      _active={{
        transform: 'translateY(0)',
      }}
      _focus={{
        boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.3)',
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default ResponsiveButton; 