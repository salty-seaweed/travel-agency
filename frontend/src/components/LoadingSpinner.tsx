import React from 'react';
import { Box, Skeleton, SkeletonText, VStack, HStack, Flex } from '@chakra-ui/react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'skeleton' | 'card-skeleton' | 'list-skeleton';
  count?: number;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  variant = 'spinner',
  count = 3 
}) => {
  if (variant === 'skeleton') {
    return (
      <Box className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <VStack spacing={6} align="center">
          <Skeleton height="60px" width="200px" borderRadius="lg" />
          <SkeletonText noOfLines={3} spacing={4} skeletonHeight="4" width="300px" />
        </VStack>
      </Box>
    );
  }

  if (variant === 'card-skeleton') {
    return (
      <Box className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <VStack spacing={6} align="stretch">
          {Array.from({ length: count }).map((_, index) => (
            <Box key={index} bg="white" p={6} borderRadius="xl" boxShadow="lg">
              <Skeleton height="200px" borderRadius="lg" mb={4} />
              <SkeletonText noOfLines={2} spacing={3} skeletonHeight="4" mb={3} />
              <HStack spacing={4}>
                <Skeleton height="8px" width="60px" borderRadius="full" />
                <Skeleton height="8px" width="80px" borderRadius="full" />
              </HStack>
            </Box>
          ))}
        </VStack>
      </Box>
    );
  }

  if (variant === 'list-skeleton') {
    return (
      <Box className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <VStack spacing={4} align="stretch">
          {Array.from({ length: count }).map((_, index) => (
            <Box key={index} bg="white" p={4} borderRadius="lg" boxShadow="md">
              <Flex align="center" justify="space-between">
                <VStack align="start" spacing={2} flex={1}>
                  <Skeleton height="6" width="60%" />
                  <Skeleton height="4" width="40%" />
                </VStack>
                <Skeleton height="8" width="16" borderRadius="full" />
              </Flex>
            </Box>
          ))}
        </VStack>
      </Box>
    );
  }

  // Default spinner
  const spinnerSizes = {
    sm: '20px',
    md: '32px',
    lg: '48px',
    xl: '64px'
  };

  return (
    <Box className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <VStack spacing={6}>
        <Box
          className="animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"
          style={{ 
            width: spinnerSizes[size], 
            height: spinnerSizes[size] 
          }}
        />
        <Box className="text-lg text-gray-600 font-medium">
          Loading your dream experiences...
        </Box>
      </VStack>
    </Box>
  );
}; 