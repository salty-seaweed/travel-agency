import React from 'react';
import { Box, Text, VStack, HStack, Table, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { usePackageDetailVariant } from '../../../../contexts/PackageDetailVariantContext';
import type { Package } from '../../../../types';

interface AboutSectionProps {
  packageData: Package;
}

export function AboutSection({ packageData }: AboutSectionProps) {
  const theme = usePackageDetailVariant();
  const groupSize = packageData.group_size;
  const gsMin = groupSize?.min ?? 1;
  const gsMax = groupSize?.max ?? 10;

  return (
    <VStack align="stretch" spacing={6}>
      <Table size="sm" variant="simple">
        <Tbody>
          <Tr>
            <Th w="140px" color={theme.colors.textSecondary}>Duration</Th>
            <Td color={theme.colors.textPrimary}>{packageData.duration} days</Td>
          </Tr>
          <Tr>
            <Th color={theme.colors.textSecondary}>Group size</Th>
            <Td color={theme.colors.textPrimary}>{gsMin}–{gsMax} people</Td>
          </Tr>
          <Tr>
            <Th color={theme.colors.textSecondary}>Difficulty</Th>
            <Td color={theme.colors.textPrimary} textTransform="capitalize">{packageData.difficulty_level || '—'}</Td>
          </Tr>
          <Tr>
            <Th color={theme.colors.textSecondary}>Category</Th>
            <Td color={theme.colors.textPrimary}>{packageData.category || '—'}</Td>
          </Tr>
        </Tbody>
      </Table>
      <Text color={theme.colors.textSecondary} lineHeight="1.6">
        {packageData.description}
      </Text>
      {packageData.detailed_description && (
        <Text color={theme.colors.textSecondary} lineHeight="1.6" whiteSpace="pre-line">
          {packageData.detailed_description}
        </Text>
      )}
    </VStack>
  );
}
