import React, { useState } from 'react';
import { Box, Text, VStack, HStack, Button, Icon, Avatar } from '@chakra-ui/react';
import { StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { usePackageDetailVariant } from '../../../../contexts/PackageDetailVariantContext';

const COMMENT_TRUNCATE = 200;

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
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  if (!reviews || reviews.length === 0) return null;

  const avgRating =
    reviews.reduce((s, r) => s + (r.rating ?? 0), 0) / (reviews.filter((r) => r.rating != null).length || 1);
  const hasRatings = reviews.some((r) => r.rating != null);
  const isGuestFavorite = hasRatings && avgRating >= 4.8;

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <VStack align="stretch" spacing={6}>
      <HStack spacing={6} align="center" flexWrap="wrap">
        <HStack spacing={3}>
          <Text fontSize="4xl" fontWeight="bold" color={theme.colors.textPrimary}>
            {avgRating > 0 ? avgRating.toFixed(2) : '–'}
          </Text>
          <VStack align="start" spacing={0}>
            <HStack spacing={1}>
              <Icon as={StarSolidIcon} h={5} w={5} color="yellow.500" />
              <Text fontSize="lg" fontWeight="medium" color={theme.colors.textPrimary}>
                {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
              </Text>
            </HStack>
            {isGuestFavorite && (
              <Text fontSize="sm" fontWeight="medium" color="green.600">
                Guest favorite
              </Text>
            )}
          </VStack>
        </HStack>
      </HStack>

      <VStack align="stretch" spacing={6} pt={2}>
        {reviews.slice(0, 5).map((r) => {
          const comment = r.comment ?? '';
          const isLong = comment.length > COMMENT_TRUNCATE;
          const isExpanded = expandedIds.has(r.id);
          const displayComment = isLong && !isExpanded ? comment.slice(0, COMMENT_TRUNCATE) + '...' : comment;

          return (
            <Box key={r.id} py={4} borderBottom="1px solid" borderColor="gray.200" _last={{ borderBottom: 'none' }}>
              <HStack align="start" spacing={4}>
                <Avatar
                  size="md"
                  name={r.name ?? '?'}
                  bg={theme.colors.accent}
                  color="white"
                />
                <VStack align="stretch" spacing={2} flex={1}>
                  <HStack justify="space-between" flexWrap="wrap">
                    <Text fontWeight="semibold" color={theme.colors.textPrimary}>
                      {r.name ?? 'Anonymous'}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      {r.created_at ? new Date(r.created_at).toLocaleDateString() : ''}
                    </Text>
                  </HStack>
                  {r.rating != null && (
                    <HStack spacing={0.5}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Icon
                          key={n}
                          as={n <= r.rating! ? StarSolidIcon : StarIcon}
                          h={4}
                          w={4}
                          color="yellow.500"
                        />
                      ))}
                    </HStack>
                  )}
                  <Text fontSize="sm" color={theme.colors.textSecondary} lineHeight="1.6" whiteSpace="pre-wrap">
                    {displayComment}
                  </Text>
                  {isLong && (
                    <Button
                      variant="ghost"
                      size="sm"
                      colorScheme="gray"
                      leftIcon={<Icon as={ChevronDownIcon} h={4} w={4} transform={isExpanded ? 'rotate(180deg)' : undefined} />}
                      onClick={() => toggleExpand(r.id)}
                    >
                      {isExpanded ? 'Show less' : 'Show more'}
                    </Button>
                  )}
                </VStack>
              </HStack>
            </Box>
          );
        })}
      </VStack>

      {reviews.length > 5 && (
        <Button variant="outline" colorScheme="sky" size="sm">
          View all {reviews.length} reviews
        </Button>
      )}
    </VStack>
  );
}
