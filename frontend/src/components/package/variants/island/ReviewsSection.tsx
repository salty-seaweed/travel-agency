import React from 'react';
import { Box, Text, VStack, HStack, SimpleGrid } from '@chakra-ui/react';
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
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
      {reviews.slice(0, 4).map((r) => (
        <Box
          key={r.id}
          p={5}
          borderRadius="xl"
          bg={theme.section.sectionBg || 'gray.50'}
          border="1px solid"
          borderColor="gray.200"
        >
          <HStack spacing={2} mb={2}>
            {r.rating != null && (
              <>
                {[1, 2, 3, 4, 5].map((n) => (
                  <Icon key={n} as={n <= r.rating! ? StarSolidIcon : StarIcon} h={4} w={4} color="yellow.500" />
                ))}
              </>
            )}
            <Text fontWeight="semibold" fontSize="sm" color={theme.colors.textPrimary}>
              {r.name}
            </Text>
          </HStack>
          <Text fontSize="sm" color={theme.colors.textSecondary} noOfLines={3} lineHeight="1.5">
            {r.comment}
          </Text>
          {r.created_at && (
            <Text fontSize="xs" color={theme.colors.textSecondary} mt={2}>
              {new Date(r.created_at).toLocaleDateString()}
            </Text>
          )}
        </Box>
      ))}
    </SimpleGrid>
  );
}
