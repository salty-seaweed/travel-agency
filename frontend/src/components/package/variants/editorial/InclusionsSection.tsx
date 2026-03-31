import React, { useState } from 'react';
import { Box, Text, VStack, HStack, SimpleGrid, Button, Icon } from '@chakra-ui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { usePackageDetailVariant } from '../../../../contexts/PackageDetailVariantContext';
import {
  getInclusionCategoryIcon,
  getInclusionCategoryColor,
  getInclusionTypeIcon,
  getInclusionTypeColor,
} from '../../utils/packageSectionUtils';
import type { PackageInclusion } from '../../../../types';

const INITIAL_VISIBLE = 8;

interface InclusionsSectionProps {
  inclusions: PackageInclusion[];
  hideHeader?: boolean;
}

export function InclusionsSection({ inclusions, hideHeader }: InclusionsSectionProps) {
  const theme = usePackageDetailVariant();
  const [showAll, setShowAll] = useState(false);

  if (!inclusions || inclusions.length === 0) return null;

  const included = inclusions.filter((i) => i.category === 'included');
  const excluded = inclusions.filter((i) => i.category === 'excluded');
  const optional = inclusions.filter((i) => i.category === 'optional');
  const allItems = included;
  const visibleItems = showAll ? allItems : allItems.slice(0, INITIAL_VISIBLE);
  const hasMore = allItems.length > INITIAL_VISIBLE;

  return (
    <VStack align="stretch" spacing={6}>
      <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
        {visibleItems.map((item, i) => {
          const ItemIcon = getInclusionCategoryIcon(item.item?.toLowerCase() || '');
          const color = getInclusionCategoryColor(item.item?.toLowerCase() || '');
          return (
            <HStack key={item.id || i} spacing={3} align="start" p={2} borderRadius="md" _hover={{ bg: 'gray.50' }}>
              <Icon as={ItemIcon} h={5} w={5} color={`${color}.500`} flexShrink={0} mt={0.5} />
              <VStack align="start" spacing={0}>
                <Text fontSize="sm" fontWeight="medium" color={theme.colors.textPrimary}>
                  {item.item}
                </Text>
                {item.description && (
                  <Text fontSize="xs" color={theme.colors.textSecondary} noOfLines={1}>
                    {item.description}
                  </Text>
                )}
              </VStack>
            </HStack>
          );
        })}
      </SimpleGrid>

      {hasMore && (
        <Button
          variant="ghost"
          size="sm"
          fontWeight="semibold"
          color={theme.colors.accent}
          onClick={() => setShowAll(!showAll)}
          leftIcon={<Icon as={ChevronDownIcon} h={4} w={4} transform={showAll ? 'rotate(180deg)' : undefined} />}
        >
          {showAll ? 'Show less' : 'Show all amenities'}
        </Button>
      )}

      {(excluded.length > 0 || optional.length > 0) && showAll && (
        <VStack align="stretch" spacing={4} pt={4} borderTop="1px solid" borderColor="gray.200">
          {excluded.length > 0 && (
            <InclusionGroup
              title="Not included"
              items={excluded}
              type="excluded"
              theme={theme}
              getIcon={getInclusionCategoryIcon}
              getColor={getInclusionCategoryColor}
            />
          )}
          {optional.length > 0 && (
            <InclusionGroup
              title="Optional"
              items={optional}
              type="optional"
              theme={theme}
              getIcon={getInclusionCategoryIcon}
              getColor={getInclusionCategoryColor}
            />
          )}
        </VStack>
      )}
    </VStack>
  );
}

function InclusionGroup({
  title,
  items,
  type,
  theme,
  getIcon,
  getColor,
}: {
  title: string;
  items: PackageInclusion[];
  type: 'included' | 'excluded' | 'optional';
  theme: { fonts: { heading: string }; colors: { textPrimary: string; textSecondary: string } };
  getIcon: (s: string) => React.ComponentType<{ className?: string }>;
  getColor: (s: string) => string;
}) {
  const TypeIcon = getInclusionTypeIcon(type);
  const typeColor = getInclusionTypeColor(type);

  return (
    <Box>
      <HStack spacing={2} mb={2}>
        <Icon as={TypeIcon} h={4} w={4} color={`${typeColor}.500`} />
        <Text fontFamily={theme.fonts.heading} fontWeight="semibold" color={theme.colors.textPrimary} fontSize="sm">
          {title}
        </Text>
      </HStack>
      <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={2}>
        {items.map((item, i) => {
          const ItemIcon = getIcon(item.item?.toLowerCase() || '');
          const color = getColor(item.item?.toLowerCase() || '');
          return (
            <HStack key={item.id || i} spacing={2} align="start">
              <Icon as={ItemIcon} h={4} w={4} color={`${color}.500`} mt={0.5} flexShrink={0} />
              <Text fontSize="sm" color={theme.colors.textSecondary}>
                {item.item}
              </Text>
            </HStack>
          );
        })}
      </SimpleGrid>
    </Box>
  );
}
