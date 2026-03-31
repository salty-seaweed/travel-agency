import React from 'react';
import { Box, Text, VStack, HStack, Badge, SimpleGrid } from '@chakra-ui/react';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { Icon } from '@chakra-ui/react';
import { usePackageDetailVariant } from '../../../../contexts/PackageDetailVariantContext';
import { formatPrice } from '../../../../utils';
import type { PackageActivity } from '../../../../types';

interface ActivitiesSectionProps {
  activities: PackageActivity[];
  hideHeader?: boolean;
}

export function ActivitiesSection({ activities, hideHeader }: ActivitiesSectionProps) {
  const theme = usePackageDetailVariant();

  if (!activities || activities.length === 0) return null;

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
      {activities.map((activity, index) => (
        <Box
          key={activity.id || index}
          p={5}
          borderRadius="xl"
          bg={theme.section.sectionBg || 'white'}
          border="1px solid"
          borderColor="gray.200"
        >
          <HStack spacing={2} mb={2}>
            <Icon as={SparklesIcon} h={5} w={5} color={theme.colors.accent} />
            <Text fontWeight="semibold" color={theme.colors.textPrimary}>
              {activity.name}
            </Text>
            <Badge colorScheme={activity.included ? 'green' : 'orange'} variant="subtle" fontSize="xs">
              {activity.included ? 'Incl.' : 'Opt.'}
            </Badge>
          </HStack>
          {activity.description && (
            <Text fontSize="sm" color={theme.colors.textSecondary} noOfLines={2} mb={2}>
              {activity.description}
            </Text>
          )}
          <HStack spacing={3} fontSize="xs" color={theme.colors.textSecondary}>
            {activity.duration && <Text>{activity.duration}</Text>}
            {!activity.included && activity.price && (
              <Text fontWeight="semibold" color={theme.colors.accent}>
                {formatPrice(parseFloat(activity.price))}
              </Text>
            )}
          </HStack>
        </Box>
      ))}
    </SimpleGrid>
  );
}
