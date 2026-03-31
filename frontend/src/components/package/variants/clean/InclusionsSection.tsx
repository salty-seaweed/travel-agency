import React from 'react';
import { Box, Text, VStack, HStack, SimpleGrid } from '@chakra-ui/react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { Icon } from '@chakra-ui/react';
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
  const optional = inclusions.filter((i) => i.category === 'optional');

  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
      <Box>
        <HStack spacing={2} mb={3}>
          <Icon as={CheckCircleIcon} h={4} w={4} color="green.500" />
          <Text fontWeight="semibold" color={theme.colors.textPrimary}>
            Included
          </Text>
        </HStack>
        <VStack align="stretch" spacing={1}>
          {included.map((item, i) => (
            <HStack key={item.id || i} spacing={2}>
              <Icon as={CheckCircleIcon} h={4} w={4} color="green.500" flexShrink={0} />
              <Text fontSize="sm" color={theme.colors.textPrimary}>
                {item.item}
              </Text>
            </HStack>
          ))}
        </VStack>
      </Box>
      <Box>
        <HStack spacing={2} mb={3}>
          <Icon as={XCircleIcon} h={4} w={4} color="red.500" />
          <Text fontWeight="semibold" color={theme.colors.textPrimary}>
            Not included
          </Text>
        </HStack>
        <VStack align="stretch" spacing={1}>
          {excluded.map((item, i) => (
            <HStack key={item.id || i} spacing={2}>
              <Icon as={XCircleIcon} h={4} w={4} color="red.500" flexShrink={0} />
              <Text fontSize="sm" color={theme.colors.textPrimary}>
                {item.item}
              </Text>
            </HStack>
          ))}
        </VStack>
        {optional.length > 0 && (
          <>
            <Text fontSize="xs" fontWeight="medium" color={theme.colors.textSecondary} mt={4} mb={2}>
              Optional
            </Text>
            {optional.map((item, i) => (
              <HStack key={item.id || i} spacing={2} py={0.5}>
                <Text fontSize="sm" color={theme.colors.textSecondary}>
                  {item.item}
                </Text>
              </HStack>
            ))}
          </>
        )}
      </Box>
    </SimpleGrid>
  );
}
