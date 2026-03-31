import React from 'react';
import { Box, Text, VStack, HStack, SimpleGrid } from '@chakra-ui/react';
import { MapPinIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { Icon } from '@chakra-ui/react';
import { usePackageDetailVariant } from '../../../../contexts/PackageDetailVariantContext';
import { getDestinationColor } from '../../utils/packageSectionUtils';
import { GoogleMap } from '../../GoogleMap';
import { SmartLazyImage } from '../../../SmartLazyImage';
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
      <GoogleMap destinations={destinations} height={300} />
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        {destinations.map((dest, index) => {
          const colorScheme = getDestinationColor(index);
          const location = dest.location;
          const name = location?.island || `Destination ${index + 1}`;
          const imgSrc = location?.image;
          return (
            <Box
              key={dest.id || index}
              borderRadius="xl"
              overflow="hidden"
              bg="white"
              border="1px solid"
              borderColor="gray.200"
            >
              {imgSrc && (
                <Box h="120px" overflow="hidden">
                  <SmartLazyImage
                    src={imgSrc}
                    alt={name}
                    width="100%"
                    height="120"
                    objectFit="cover"
                    fallbackSrc="/placeholder-image.jpg"
                  />
                </Box>
              )}
              <Box p={4}>
                <HStack spacing={2} mb={2}>
                  <Icon as={MapPinIcon} h={4} w={4} color={`${colorScheme}.500`} />
                  <Text fontWeight="semibold" color={theme.colors.textPrimary}>
                    {name}
                  </Text>
                  <Text fontSize="sm" color={theme.colors.textSecondary}>
                    {dest.duration} day{dest.duration > 1 ? 's' : ''}
                  </Text>
                </HStack>
                {dest.description && (
                  <Text fontSize="sm" color={theme.colors.textSecondary} noOfLines={2}>
                    {dest.description}
                  </Text>
                )}
                {dest.highlights?.length > 0 && (
                  <VStack align="stretch" spacing={1} mt={2}>
                    {dest.highlights.slice(0, 2).map((h, i) => (
                      <HStack key={i} spacing={2}>
                        <Icon as={CheckCircleIcon} h={3} w={3} color={`${colorScheme}.500`} />
                        <Text fontSize="xs" color={theme.colors.textSecondary}>
                          {h}
                        </Text>
                      </HStack>
                    ))}
                  </VStack>
                )}
              </Box>
            </Box>
          );
        })}
      </SimpleGrid>
    </VStack>
  );
}
