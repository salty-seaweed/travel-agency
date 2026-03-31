import React from 'react';
import { Box, Text, VStack, HStack, Badge } from '@chakra-ui/react';
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

  const included = activities.filter((a) => a.included);
  const optional = activities.filter((a) => !a.included);

  return (
    <VStack align="stretch" spacing={10}>
      {included.length > 0 && (
        <VStack align="stretch" spacing={6}>
          <Text fontFamily={theme.fonts.heading} fontSize="lg" fontWeight="semibold" color={theme.colors.textPrimary}>
            Included Activities
          </Text>
          {included.map((activity, index) => (
            <ActivityBlock key={activity.id || index} activity={activity} theme={theme} />
          ))}
        </VStack>
      )}
      {optional.length > 0 && (
        <VStack align="stretch" spacing={6}>
          <Text fontFamily={theme.fonts.heading} fontSize="lg" fontWeight="semibold" color={theme.colors.textPrimary}>
            Optional Activities
          </Text>
          {optional.map((activity, index) => (
            <ActivityBlock key={activity.id || index} activity={activity} theme={theme} />
          ))}
        </VStack>
      )}
    </VStack>
  );
}

function ActivityBlock({ activity, theme }: { activity: PackageActivity; theme: { fonts: { heading: string }; colors: { textPrimary: string; textSecondary: string }; accent: string } }) {
  return (
    <Box py={4} borderBottom="1px solid" borderColor="gray.200" _last={{ borderBottom: 'none' }}>
      <HStack spacing={3} mb={2}>
        <Text fontFamily={theme.fonts.heading} fontSize="xl" fontWeight="semibold" color={theme.colors.textPrimary}>
          {activity.name}
        </Text>
        <Badge colorScheme={activity.included ? 'green' : 'orange'} variant="subtle" fontSize="xs">
          {activity.included ? 'Included' : 'Optional'}
        </Badge>
        {!activity.included && activity.price && (
          <Text fontWeight="semibold" color={theme.colors.accent}>
            {formatPrice(parseFloat(activity.price))}
          </Text>
        )}
      </HStack>
      {activity.description && (
        <Text color={theme.colors.textSecondary} lineHeight="1.7" fontSize="sm">
          {activity.description}
        </Text>
      )}
      {activity.duration && (
        <Text mt={2} fontSize="xs" color={theme.colors.textSecondary}>
          Duration: {activity.duration} · Difficulty: {activity.difficulty}
        </Text>
      )}
    </Box>
  );
}
