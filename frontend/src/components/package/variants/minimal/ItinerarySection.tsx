import React from 'react';
import { Box, Text, VStack } from '@chakra-ui/react';
import { usePackageDetailVariant } from '../../../../contexts/PackageDetailVariantContext';
import type { PackageItinerary as ItineraryType } from '../../../../types';

interface ItinerarySectionProps {
  itinerary: ItineraryType[];
  hideHeader?: boolean;
}

export function ItinerarySection({ itinerary, hideHeader }: ItinerarySectionProps) {
  const theme = usePackageDetailVariant();

  if (!itinerary || itinerary.length === 0) return null;

  return (
    <VStack align="stretch" spacing={6}>
      {itinerary.map((day, index) => {
        const dayNumber = day.day || index + 1;
        return (
          <Box key={`day-${dayNumber}-${day.title || ''}`} pb={6} borderBottom="1px solid" borderColor="gray.200" _last={{ borderBottom: 'none' }}>
            <Text fontWeight="semibold" color={theme.colors.textPrimary}>
              Day {dayNumber} — {day.title || `Day ${dayNumber}`}
            </Text>
            {day.description && (
              <Text mt={2} fontSize="sm" color={theme.colors.textSecondary} lineHeight="1.6">
                {day.description}
              </Text>
            )}
          </Box>
        );
      })}
    </VStack>
  );
}
