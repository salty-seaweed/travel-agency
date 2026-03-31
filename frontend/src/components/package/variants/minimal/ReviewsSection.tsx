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
    <VStack align="stretch" spacing={8}>
      {reviews.slice(0, 3).map((r) => (
        <Box key={r.id} py={6} borderBottom="1px solid" borderColor="gray.200" _last={{ borderBottom: 'none' }}>
          <HStack spacing={2} mb={2}>
            {r.rating != null && (
              <>
                {[1, 2, 3, 4, 5].map((n) => (
                  <Icon key={n} as={n <= r.rating! ? StarSolidIcon : StarIcon} h={4} w={4} color="yellow.500" />
                ))}
              </>
            )}
            <Text fontWeight="medium" color={theme.colors.textPrimary}>
              {r.name}
            </Text>
          </HStack>
          <Text fontSize="sm" color={theme.colors.textSecondary} lineHeight="1.6">
            {r.comment}
          </Text>
          {r.created_at && (
            <Text fontSize="xs" color={theme.colors.textSecondary} mt={2}>
              {new Date(r.created_at).toLocaleDateString()}
            </Text>
          )}
        </Box>
      ))}
    </VStack>
  );
}
