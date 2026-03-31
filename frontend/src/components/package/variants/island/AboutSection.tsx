import React from 'react';
import { Box, Text, VStack, HStack, SimpleGrid } from '@chakra-ui/react';
import { usePackageDetailVariant } from '../../../../contexts/PackageDetailVariantContext';
import type { Package } from '../../../../types';

interface AboutSectionProps {
  packageData: Package;
}

function getFirstImageUrl(pkg: Package): string | null {
  const img = pkg.images?.find((m) => m.media_type !== 'video' && (m.image_url || m.image));
  return img ? (img.image_url || img.image || null) : null;
}

export function AboutSection({ packageData }: AboutSectionProps) {
  const theme = usePackageDetailVariant();
  const imageUrl = getFirstImageUrl(packageData);
  const highlights = packageData.highlights
    ? Array.isArray(packageData.highlights)
      ? packageData.highlights
      : String(packageData.highlights).split(',').map((s) => s.trim())
    : [];
  const points = [
    { label: 'Duration', value: `${packageData.duration} days` },
    { label: 'Group size', value: `${packageData.group_size?.min || 1}-${packageData.group_size?.max || 4} people` },
    { label: 'Difficulty', value: packageData.difficulty_level || '—' },
    { label: 'Best time', value: packageData.best_time_to_visit || 'Year-round' },
  ];

  return (
    <VStack align="stretch" spacing={6}>
      {imageUrl && (
        <Box
          w="100%"
          h="200px"
          borderRadius="xl"
          overflow="hidden"
          bgImage={`url(${imageUrl})`}
          bgSize="cover"
          bgPosition="center"
        />
      )}
      <Text color={theme.colors.textSecondary} lineHeight="1.7">
        {packageData.description}
      </Text>
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
        {points.map((p) => (
          <Box
            key={p.label}
            p={4}
            borderRadius="xl"
            bg={theme.section.sectionBg || 'sky.50'}
            border="1px solid"
            borderColor="gray.200"
          >
            <Text fontSize="xs" color={theme.colors.textSecondary} mb={1}>
              {p.label}
            </Text>
            <Text fontWeight="semibold" color={theme.colors.textPrimary}>
              {p.value}
            </Text>
          </Box>
        ))}
      </SimpleGrid>
      {highlights.length > 0 && (
        <Box p={4} borderRadius="xl" bg="white" border="1px solid" borderColor="gray.200">
          <Text fontSize="sm" fontWeight="semibold" color={theme.colors.textPrimary} mb={3}>
            Highlights
          </Text>
          <VStack align="stretch" spacing={2}>
            {highlights.slice(0, 5).map((h, i) => (
              <Text key={i} fontSize="sm" color={theme.colors.textSecondary}>
                {h}
              </Text>
            ))}
          </VStack>
        </Box>
      )}
      {packageData.detailed_description && (
        <Text color={theme.colors.textSecondary} lineHeight="1.7" whiteSpace="pre-line">
          {packageData.detailed_description}
        </Text>
      )}
    </VStack>
  );
}
