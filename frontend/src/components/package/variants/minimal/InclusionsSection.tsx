import React from 'react';
import { Box, Text, VStack } from '@chakra-ui/react';
import { usePackageDetailVariant } from '../../../../contexts/PackageDetailVariantContext';
import type { PackageInclusion } from '../../../../types';

interface InclusionsSectionProps {
  inclusions: PackageInclusion[];
  hideHeader?: boolean;
}

export function InclusionsSection({ inclusions, hideHeader }: InclusionsSectionProps) {
  const theme = usePackageDetailVariant();

  if (!inclusions || inclusions.length === 0) return null;

  const included = inclusions.filter((i) => i.category === 'included');
  const excluded = inclusions.filter((i) => i.category === 'excluded');

  return (
    <VStack align="stretch" spacing={4}>
      {included.length > 0 && (
        <Box>
          <Text fontSize="sm" fontWeight="medium" color={theme.colors.textPrimary} mb={1}>
            Included:
          </Text>
          <Text fontSize="sm" color={theme.colors.textSecondary}>
            {included.map((i) => i.item).join(', ')}
          </Text>
        </Box>
      )}
      {excluded.length > 0 && (
        <Box>
          <Text fontSize="sm" fontWeight="medium" color={theme.colors.textPrimary} mb={1}>
            Not included:
          </Text>
          <Text fontSize="sm" color={theme.colors.textSecondary}>
            {excluded.map((i) => i.item).join(', ')}
          </Text>
        </Box>
      )}
    </VStack>
  );
}
