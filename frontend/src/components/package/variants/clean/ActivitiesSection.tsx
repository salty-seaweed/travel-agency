import React from 'react';
import { Box, Text, VStack, HStack } from '@chakra-ui/react';
import { CheckCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
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

  const included = activities.filter((a) => a.included);
  const optional = activities.filter((a) => !a.included);

  return (
    <VStack align="stretch" spacing={6}>
      {included.length > 0 && (
        <Box>
          <Text fontSize="sm" fontWeight="semibold" color={theme.colors.textPrimary} mb={3}>
            Included
          </Text>
          <VStack align="stretch" spacing={2}>
            {included.map((a, i) => (
              <ActivityRow key={a.id || i} activity={a} theme={theme} />
            ))}
          </VStack>
        </Box>
      )}
      {optional.length > 0 && (
        <Box>
          <Text fontSize="sm" fontWeight="semibold" color={theme.colors.textPrimary} mb={3}>
            Optional
          </Text>
          <VStack align="stretch" spacing={2}>
            {optional.map((a, i) => (
              <ActivityRow key={a.id || i} activity={a} theme={theme} />
            ))}
          </VStack>
        </Box>
      )}
    </VStack>
  );
}

function ActivityRow({ activity, theme }: { activity: PackageActivity; theme: { colors: { textPrimary: string; textSecondary: string } } }) {
  return (
    <HStack spacing={3} py={1} justify="space-between">
      <HStack spacing={2}>
        <Icon as={activity.included ? CheckCircleIcon : InformationCircleIcon} h={4} w={4} color={activity.included ? 'green.500' : 'orange.500'} />
        <Text fontSize="sm" color={theme.colors.textPrimary}>
          {activity.name}
        </Text>
      </HStack>
      {(activity.duration || (!activity.included && activity.price)) && (
        <Text fontSize="xs" color={theme.colors.textSecondary}>
          {activity.duration}
          {!activity.included && activity.price && ` · ${formatPrice(parseFloat(activity.price))}`}
        </Text>
      )}
    </HStack>
  );
}
