import React from 'react';
import { Box, Text, VStack, HStack } from '@chakra-ui/react';
import { StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { Icon } from '@chakra-ui/react';
import { usePackageDetailVariant } from '../../../../contexts/PackageDetailVariantContext';

interface Review {
  id: number;
  name?: string;
  comment?: string;
  created_at?: string;
  rating?: number;
}

interface ReviewsSectionProps {
  reviews: Review[];
}

export function ReviewsSection({ reviews }: ReviewsSectionProps) {
  const theme = usePackageDetailVariant();

  if (!reviews || reviews.length === 0) return null;

  return (
    <VStack align="stretch" spacing={3}>
      {reviews.slice(0, 5).map((r) => (
        <Box key={r.id} py={3} borderBottom="1px solid" borderColor="gray.200" _last={{ borderBottom: 'none' }}>
          <HStack justify="space-between" mb={1}>
            <Text fontWeight="medium" fontSize="sm" color={theme.colors.textPrimary}>
              {r.name}
            </Text>
            <Text fontSize="xs" color={theme.colors.textSecondary}>
              {r.created_at ? new Date(r.created_at).toLocaleDateString() : ''}
            </Text>
          </HStack>
          {r.rating != null && (
            <HStack spacing={0.5} mb={1}>
              {[1, 2, 3, 4, 5].map((n) => (
                <Icon key={n} as={n <= r.rating! ? StarSolidIcon : StarIcon} h={4} w={4} color="yellow.500" />
              ))}
            </HStack>
          )}
          <Text fontSize="sm" color={theme.colors.textSecondary} noOfLines={2}>
            {r.comment}
          </Text>
        </Box>
      ))}
    </VStack>
  );
}
