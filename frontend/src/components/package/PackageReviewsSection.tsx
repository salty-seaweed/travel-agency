import React, { useState } from 'react';
import { Box, VStack, HStack, Text, Button, Icon, Heading, Avatar } from '@chakra-ui/react';
import { StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { usePackageDetailVariant } from '../../contexts/PackageDetailVariantContext';

const COMMENT_TRUNCATE = 200;

interface Review {
  id: number;
  name?: string;
  comment?: string;
  created_at?: string;
  rating?: number;
}

interface PackageReviewsSectionProps {
  reviews: Review[];
}

export function PackageReviewsSection({ reviews }: PackageReviewsSectionProps) {
  const theme = usePackageDetailVariant();
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  if (!reviews || reviews.length === 0) return null;

  const avgRating =
    reviews.reduce((sum, r) => sum + (r.rating ?? 0), 0) / (reviews.filter((r) => r.rating != null).length || 1);
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
    <Box
      p={6}
      bg={theme.section.sectionBg}
      borderRadius="xl"
      border={theme.section.sectionBorder}
      borderColor={theme.section.cardStyle === 'bordered' ? 'gray.200' : undefined}
    >
      <HStack spacing={4} mb={6} flexWrap="wrap">
        <Heading size="lg" fontFamily={theme.fonts.heading} color={theme.colors.textPrimary} display="flex" alignItems="center" gap={2}>
          <Icon as={StarIcon} h={6} w={6} color="yellow.500" />
          Customer Reviews
        </Heading>
        <HStack spacing={2}>
          {hasRatings && avgRating > 0 && (
            <Text fontSize="2xl" fontWeight="bold" color={theme.colors.textPrimary}>
              {avgRating.toFixed(2)}
            </Text>
          )}
          {isGuestFavorite && (
            <Text fontSize="sm" fontWeight="medium" color="green.600">
              Guest favorite
            </Text>
          )}
        </HStack>
      </HStack>
      <VStack spacing={4} align="stretch">
        {reviews.slice(0, 3).map((review) => {
          const comment = review.comment ?? '';
          const isLong = comment.length > COMMENT_TRUNCATE;
          const isExpanded = expandedIds.has(review.id);
          const displayComment = isLong && !isExpanded ? comment.slice(0, COMMENT_TRUNCATE) + '...' : comment;

          return (
            <Box key={review.id} p={4} bg="gray.50" borderRadius="lg">
              <HStack align="start" spacing={4}>
                <Avatar size="md" name={review.name ?? '?'} bg={theme.colors.accent} color="white" />
                <VStack align="stretch" spacing={2} flex={1}>
                  <HStack justify="space-between" flexWrap="wrap">
                    <Text fontWeight="medium" color={theme.colors.textPrimary}>
                      {review.name ?? 'Anonymous'}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      {review.created_at ? new Date(review.created_at).toLocaleDateString() : ''}
                    </Text>
                  </HStack>
                  {review.rating != null && (
                    <HStack spacing={0.5}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Icon key={n} as={n <= review.rating! ? StarSolidIcon : StarIcon} h={4} w={4} color="yellow.500" />
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
                      onClick={() => toggleExpand(review.id)}
                    >
                      {isExpanded ? 'Show less' : 'Show more'}
                    </Button>
                  )}
                </VStack>
              </HStack>
            </Box>
          );
        })}
        {reviews.length > 3 && (
          <Button variant="outline" colorScheme="sky" size="sm">
            View all {reviews.length} reviews
          </Button>
        )}
      </VStack>
    </Box>
  );
}
