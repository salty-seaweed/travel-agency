import React from 'react';
import { Box, Text, VStack, HStack, SimpleGrid } from '@chakra-ui/react';
import { CalendarIcon, ClockIcon, CakeIcon } from '@heroicons/react/24/outline';
import { Icon } from '@chakra-ui/react';
import { usePackageDetailVariant } from '../../../../contexts/PackageDetailVariantContext';
import { formatItineraryTime, getDayColor } from '../../utils/packageSectionUtils';
import type { PackageItinerary as ItineraryType } from '../../../../types';

interface ItinerarySectionProps {
  itinerary: ItineraryType[];
  hideHeader?: boolean;
}

export function ItinerarySection({ itinerary, hideHeader }: ItinerarySectionProps) {
  const theme = usePackageDetailVariant();

  if (!itinerary || itinerary.length === 0) return null;

  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
      {itinerary.map((day, index) => {
        const dayNumber = day.day || index + 1;
        const colorScheme = getDayColor(dayNumber);
        return (
          <Box
            key={`day-${dayNumber}-${day.title || ''}`}
            p={5}
            borderRadius="xl"
            bg={theme.section.sectionBg || 'white'}
            border="1px solid"
            borderColor="gray.200"
          >
            <HStack spacing={3} mb={3}>
              <Box
                px={3}
                py={1}
                borderRadius="full"
                bg={`${colorScheme}.500`}
                color="white"
                fontSize="sm"
                fontWeight="bold"
              >
                Day {dayNumber}
              </Box>
              <Text fontWeight="semibold" color={theme.colors.textPrimary}>
                {day.title || `Day ${dayNumber}`}
              </Text>
            </HStack>
            {day.description && (
              <Text fontSize="sm" color={theme.colors.textSecondary} mb={3} lineHeight="1.6">
                {day.description}
              </Text>
            )}
            {(day.start_time || day.end_time) && (
              <HStack spacing={2} fontSize="sm" color={theme.colors.textSecondary}>
                <Icon as={ClockIcon} h={4} w={4} />
                <Text>
                  {[day.start_time && formatItineraryTime(day.start_time), day.end_time && formatItineraryTime(day.end_time)]
                    .filter(Boolean)
                    .join(' – ')}
                </Text>
              </HStack>
            )}
            {day.activities?.length > 0 && (
              <VStack align="stretch" spacing={1} mt={2}>
                {day.activities.slice(0, 3).map((a, i) => (
                  <Text key={i} fontSize="xs" color={theme.colors.textSecondary}>
                    · {a}
                  </Text>
                ))}
              </VStack>
            )}
            {day.meals?.length > 0 && (
              <HStack mt={2} spacing={2}>
                <Icon as={CakeIcon} h={4} w={4} color="orange.500" />
                <Text fontSize="xs" color={theme.colors.textSecondary}>
                  {day.meals.join(', ')}
                </Text>
              </HStack>
            )}
          </Box>
        );
      })}
    </SimpleGrid>
  );
}
