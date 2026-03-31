import React from 'react';
import { Box, Text, VStack } from '@chakra-ui/react';
import { usePackageDetailVariant } from '../../../../contexts/PackageDetailVariantContext';
import type { PackageActivity } from '../../../../types';

interface ActivitiesSectionProps {
  activities: PackageActivity[];
  hideHeader?: boolean;
}

export function ActivitiesSection({ activities, hideHeader }: ActivitiesSectionProps) {
  const theme = usePackageDetailVariant();

  if (!activities || activities.length === 0) return null;

  return (
    <VStack align="stretch" spacing={4}>
      {activities.map((activity, index) => (
        <Box key={activity.id || index} py={3} borderBottom="1px solid" borderColor="gray.200" _last={{ borderBottom: 'none' }}>
          <Text fontWeight="medium" color={theme.colors.textPrimary}>
            {activity.name}
          </Text>
          {activity.description && (
            <Text mt={1} fontSize="sm" color={theme.colors.textSecondary} noOfLines={1}>
              {activity.description}
            </Text>
          )}
        </Box>
      ))}
    </VStack>
  );
}
