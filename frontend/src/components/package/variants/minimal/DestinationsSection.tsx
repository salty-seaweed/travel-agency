import React from 'react';
import { Box, Text, VStack, HStack } from '@chakra-ui/react';
import { usePackageDetailVariant } from '../../../../contexts/PackageDetailVariantContext';
import { GoogleMap } from '../../GoogleMap';
import type { PackageDestination } from '../../../../types';

interface DestinationsSectionProps {
  destinations: PackageDestination[];
  hideHeader?: boolean;
}

export function DestinationsSection({ destinations, hideHeader }: DestinationsSectionProps) {
  const theme = usePackageDetailVariant();

  if (!destinations || destinations.length === 0) return null;

  return (
    <VStack align="stretch" spacing={6}>
      <GoogleMap destinations={destinations} height={240} />
      <VStack align="stretch" spacing={2}>
        {destinations.map((dest, index) => {
          const name = dest.location?.island || `Destination ${index + 1}`;
          return (
            <HStack key={dest.id || index} justify="space-between" py={2}>
              <Text fontSize="sm" color={theme.colors.textPrimary}>
                {name}
              </Text>
              <Text fontSize="sm" color={theme.colors.textSecondary}>
                {dest.duration} day{dest.duration > 1 ? 's' : ''}
              </Text>
            </HStack>
          );
        })}
      </VStack>
    </VStack>
  );
}
