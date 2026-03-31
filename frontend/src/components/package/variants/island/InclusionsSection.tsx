import React from 'react';
import { Box, Text, VStack, HStack } from '@chakra-ui/react';
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { Icon } from '@chakra-ui/react';
import { usePackageDetailVariant } from '../../../../contexts/PackageDetailVariantContext';
import { getInclusionCategoryIcon, getInclusionCategoryColor } from '../../utils/packageSectionUtils';
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
    <Box
      p={6}
      borderRadius="xl"
      bg={theme.section.sectionBg || 'white'}
      border="1px solid"
      borderColor="gray.200"
    >
      <VStack align="stretch" spacing={6}>
        {included.length > 0 && (
          <Box>
            <HStack spacing={2} mb={3}>
              <Icon as={CheckCircleIcon} h={5} w={5} color="green.500" />
              <Text fontWeight="semibold" color={theme.colors.textPrimary}>
                Included
              </Text>
            </HStack>
            <VStack align="stretch" spacing={2}>
              {included.map((item, i) => (
                <InclusionItem key={item.id || i} item={item} type="included" theme={theme} />
              ))}
            </VStack>
          </Box>
        )}
        {excluded.length > 0 && (
          <Box>
            <HStack spacing={2} mb={3}>
              <Icon as={XCircleIcon} h={5} w={5} color="red.500" />
              <Text fontWeight="semibold" color={theme.colors.textPrimary}>
                Not included
              </Text>
            </HStack>
            <VStack align="stretch" spacing={2}>
              {excluded.map((item, i) => (
                <InclusionItem key={item.id || i} item={item} type="excluded" theme={theme} />
              ))}
            </VStack>
          </Box>
        )}
        {optional.length > 0 && (
          <Box>
            <HStack spacing={2} mb={3}>
              <Icon as={InformationCircleIcon} h={5} w={5} color="orange.500" />
              <Text fontWeight="semibold" color={theme.colors.textPrimary}>
                Optional
              </Text>
            </HStack>
            <VStack align="stretch" spacing={2}>
              {optional.map((item, i) => (
                <InclusionItem key={item.id || i} item={item} type="optional" theme={theme} />
              ))}
            </VStack>
          </Box>
        )}
      </VStack>
    </Box>
  );
}

function InclusionItem({
  item,
  type,
  theme,
}: {
  item: PackageInclusion;
  type: 'included' | 'excluded' | 'optional';
  theme: { colors: { textPrimary: string; textSecondary: string } };
}) {
  const TypeIcon = type === 'included' ? CheckCircleIcon : type === 'excluded' ? XCircleIcon : InformationCircleIcon;
  const color = type === 'included' ? 'green' : type === 'excluded' ? 'red' : 'orange';

  return (
    <HStack spacing={2} align="start">
      <Icon as={TypeIcon} h={4} w={4} color={`${color}.500`} mt={0.5} flexShrink={0} />
      <VStack align="start" spacing={0}>
        <Text fontSize="sm" fontWeight="medium" color={theme.colors.textPrimary}>
          {item.item}
        </Text>
        {item.description && (
          <Text fontSize="xs" color={theme.colors.textSecondary}>
            {item.description}
          </Text>
        )}
      </VStack>
    </HStack>
  );
}
