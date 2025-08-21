import React from 'react';
import {
  Box,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading...',
  size = 'xl',
}) => {
  return (
    <Box textAlign="center" py={8}>
      <VStack spacing={4}>
        <Spinner size={size} color="blue.500" />
        <Text>{message}</Text>
      </VStack>
    </Box>
  );
};
