import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { usePackageDetailVariant } from '../../../../contexts/PackageDetailVariantContext';
import type { Package } from '../../../../types';

interface AboutSectionProps {
  packageData: Package;
}

export function AboutSection({ packageData }: AboutSectionProps) {
  const theme = usePackageDetailVariant();

  return (
    <Box>
      {(packageData.category || packageData.difficulty_level) && (
        <Text fontSize="sm" color={theme.colors.textSecondary} mb={4}>
          {[packageData.category, packageData.difficulty_level].filter(Boolean).join(' · ')}
        </Text>
      )}
      <Text color={theme.colors.textPrimary} lineHeight="1.8">
        {packageData.description}
      </Text>
      {packageData.detailed_description && (
        <Text mt={6} color={theme.colors.textSecondary} lineHeight="1.8" whiteSpace="pre-line">
          {packageData.detailed_description}
        </Text>
      )}
    </Box>
  );
}
