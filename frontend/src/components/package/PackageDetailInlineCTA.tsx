import { Box, VStack, HStack, Text, Button, Icon } from '@chakra-ui/react';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import { useCurrency } from '../../contexts/CurrencyContext';
import { usePackageDetailVariant } from '../../contexts/PackageDetailVariantContext';
import type { Package } from '../../types';

interface PackageDetailInlineCTAProps {
  packageData: Package;
  onBookNow: () => void;
  selectedVariant?: { id: number; duration_days: number; price: string; is_default?: boolean };
  variants?: Array<{ id: number; duration_days: number; price: string; is_default?: boolean }>;
  selectedVariantId?: number | null;
  onVariantChange?: (id: number) => void;
}

export function PackageDetailInlineCTA({
  packageData,
  onBookNow,
  selectedVariant,
  variants = [],
  selectedVariantId,
  onVariantChange,
}: PackageDetailInlineCTAProps) {
  const { formatPrice } = useCurrency();
  const theme = usePackageDetailVariant();

  const currentPrice = selectedVariant
    ? parseFloat(String(selectedVariant.price))
    : parseFloat(
        typeof packageData.price === 'string'
          ? packageData.price.replace(/[^0-9.]/g, '')
          : (packageData.price as unknown as string)
      );
  const pricingText =
    packageData.pricing_type === 'per_couple'
      ? 'per couple'
      : packageData.pricing_type === 'per_room'
        ? 'per room'
        : packageData.pricing_type === 'per_group'
          ? 'per group'
          : 'per person';

  return (
    <Box
      p={8}
      borderRadius="xl"
      border="1px solid"
      borderColor="gray.200"
      bg={theme.sidebar.cardBg}
    >
      <VStack spacing={4} align="stretch">
        {variants.length > 0 && onVariantChange && (
          <HStack spacing={2} flexWrap="wrap">
            {[...variants]
              .sort((a, b) => a.duration_days - b.duration_days)
              .map((v) => (
                <Button
                  key={v.id}
                  size="sm"
                  variant={selectedVariantId === v.id ? 'solid' : 'outline'}
                  bg={selectedVariantId === v.id ? theme.colors.accent : undefined}
                  borderColor={theme.colors.accent}
                  color={selectedVariantId === v.id ? 'white' : theme.colors.accent}
                  onClick={() => onVariantChange(v.id)}
                >
                  {v.duration_days} days
                </Button>
              ))}
          </HStack>
        )}
        <HStack justify="space-between" align="center" flexWrap="wrap" gap={4}>
        <VStack align="start" spacing={0}>
          <Text fontSize="2xl" fontWeight="bold" color={theme.colors.textPrimary}>
            {formatPrice(currentPrice)}
          </Text>
          <Text fontSize="sm" color="gray.500">
            {pricingText}
          </Text>
        </VStack>
        <Button
          size="lg"
          bg={theme.colors.accent}
          _hover={{ bg: theme.colors.accentHover }}
          color="white"
          leftIcon={<Icon as={EnvelopeIcon} h={5} w={5} />}
          onClick={onBookNow}
        >
          Book Now
        </Button>
      </HStack>
      </VStack>
    </Box>
  );
}
