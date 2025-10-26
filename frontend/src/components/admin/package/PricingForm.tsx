import React from 'react';
import {
  VStack,
  HStack,
  Grid,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Textarea,
  Box,
  Text,
  Badge,
  Divider,
  IconButton,
  Checkbox,
  Select,
} from '@chakra-ui/react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface PricingFormProps {
  form: any;
  updateForm: (updates: any) => void;
}

export function PricingForm({ form, updateForm }: PricingFormProps) {
  // Derived default price view from variants if present
  const hasVariants = Array.isArray(form.variants) && form.variants.length > 0;
  const defaultVariant = hasVariants ? (form.variants.find((v: any) => v.is_default) || form.variants.slice().sort((a: any, b: any) => parseFloat(String(a.price)) - parseFloat(String(b.price)))[0]) : null;
  const effectiveOriginal = hasVariants && defaultVariant?.original_price ? parseFloat(String(defaultVariant.original_price)) : parseFloat(form.original_price) || 0;
  const effectiveFinal = hasVariants ? parseFloat(String(defaultVariant?.price || 0)) : (parseFloat(form.price) || 0);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    updateForm({
      [name]: value
    });

    // Auto-calculate price when original price or discount changes
    if (name === 'original_price' || name === 'discount_percentage') {
      const originalPrice = name === 'original_price' ? parseFloat(value) || 0 : parseFloat(form.original_price) || 0;
      const discountPercent = name === 'discount_percentage' ? parseFloat(value) || 0 : parseFloat(form.discount_percentage) || 0;

      // Ensure discount percentage doesn't exceed 100% and handle edge cases
      const validDiscountPercent = Math.min(100, Math.max(0, discountPercent));
      const discountedPrice = Math.max(0, originalPrice - (originalPrice * validDiscountPercent / 100));

      updateForm({ price: discountedPrice.toFixed(2) });
    }
  };

  const handleSeasonalPricingChange = (field: string, value: string) => {
    updateForm({
      seasonal_pricing: {
        ...form.seasonal_pricing,
        [field]: value
      }
    });
  };

  const originalPrice = effectiveOriginal;
  const discountPercent = parseFloat(form.discount_percentage) || 0;
  const finalPrice = effectiveFinal;
  const savings = Math.max(0, originalPrice - finalPrice);

  // Ensure final price is never negative
  const validFinalPrice = Math.max(0, finalPrice);
  const validSavings = originalPrice > 0 ? Math.max(0, savings) : 0;

  return (
    <VStack spacing={8} align="stretch">
      {/* Variants Pricing */}
      <Box>
        <Text fontSize="lg" fontWeight="semibold" color="gray.700" mb={4}>
          Duration-based Pricing (Optional)
        </Text>
        <Text fontSize="sm" color="gray.600" mb={4}>
          Add multiple durations with different prices. If you add variants, they will override the basic price and duration.
        </Text>

        {/* Header */}
        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr 1fr 1fr auto auto' }} gap={4} mb={2} alignItems="center">
          <Text fontSize="xs" color="gray.500">Duration (days)</Text>
          <Text fontSize="xs" color="gray.500">Nights</Text>
          <Text fontSize="xs" color="gray.500">Price</Text>
          <Text fontSize="xs" color="gray.500">Original Price (optional)</Text>
          <Text fontSize="xs" color="gray.500">Default</Text>
          <span />
        </Grid>

        {/* Rows */}
        <VStack spacing={3} align="stretch">
          {(form.variants || []).map((v: any, idx: number) => (
            <Grid key={v.id || idx} templateColumns={{ base: '1fr', md: '1fr 1fr 1fr 1fr auto auto' }} gap={4} alignItems="center">
              <Input
                type="number"
                min={1}
                value={v.duration_days || v.duration || ''}
                placeholder="e.g., 3"
                onChange={(e) => {
                  const variants = [...(form.variants || [])];
                  variants[idx] = { ...variants[idx], duration_days: Number(e.target.value) };
                  updateForm({ variants });
                }}
              />
              <Input
                type="number"
                min={0}
                value={v.nights || ''}
                placeholder="e.g., 2"
                onChange={(e) => {
                  const variants = [...(form.variants || [])];
                  variants[idx] = { ...variants[idx], nights: Number(e.target.value) };
                  updateForm({ variants });
                }}
              />
              <Input
                type="number"
                min={0}
                step="0.01"
                value={v.price || ''}
                placeholder="0.00"
                onChange={(e) => {
                  const variants = [...(form.variants || [])];
                  variants[idx] = { ...variants[idx], price: e.target.value };
                  updateForm({ variants });
                }}
              />
              <Input
                type="number"
                min={0}
                step="0.01"
                value={v.original_price || ''}
                placeholder="0.00"
                onChange={(e) => {
                  const variants = [...(form.variants || [])];
                  variants[idx] = { ...variants[idx], original_price: e.target.value };
                  updateForm({ variants });
                }}
              />
              <Checkbox
                isChecked={!!v.is_default}
                onChange={(e) => {
                  const variants = (form.variants || []).map((vv: any, i: number) => ({ ...vv, is_default: i === idx }));
                  updateForm({ variants });
                }}
              >
                Default
              </Checkbox>
              <IconButton
                aria-label="Remove"
                icon={<TrashIcon className="h-4 w-4" /> as any}
                variant="ghost"
                onClick={() => {
                  const variants = [...(form.variants || [])];
                  variants.splice(idx, 1);
                  updateForm({ variants });
                }}
              />
            </Grid>
          ))}
        </VStack>

        <HStack justify="flex-end" mt={3}>
          <IconButton
            aria-label="Add Variant"
            icon={<PlusIcon className="h-4 w-4" /> as any}
            onClick={() => {
              const variants = [...(form.variants || [])];
              variants.push({ duration_days: (variants[variants.length-1]?.duration_days || 1) + 1, nights: (variants[variants.length-1]?.nights || 0) + 1, price: '', original_price: '', is_default: variants.length === 0 });
              updateForm({ variants });
            }}
          />
        </HStack>
      </Box>

      <Divider />

      {/* Basic Pricing (Default Variant) */}
      <Box>
        <Text fontSize="lg" fontWeight="semibold" color="gray.700" mb={4}>
          Default Pricing
        </Text>
        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={6}>
          <FormControl isRequired>
            <FormLabel fontWeight="semibold" color="gray.700">
              Original Price *
            </FormLabel>
            <InputGroup size="lg">
              <InputLeftElement pointerEvents="none" color="gray.500">
                <Text>$</Text>
              </InputLeftElement>
              <Input
                name="original_price"
                value={hasVariants ? (defaultVariant?.original_price ?? '') : form.original_price}
                onChange={handleChange}
                placeholder="0.00"
                borderRadius="lg"
                focusBorderColor="purple.500"
                type="number"
                min="0"
                step="0.01"
                isInvalid={!hasVariants && (!form.original_price || parseFloat(form.original_price) <= 0)}
              />
            </InputGroup>
          </FormControl>

          <FormControl>
            <FormLabel fontWeight="semibold" color="gray.700">
              Discount Percentage
            </FormLabel>
            <InputGroup size="lg">
              <Input
                name="discount_percentage"
                value={form.discount_percentage}
                onChange={handleChange}
                placeholder="0"
                borderRadius="lg"
                focusBorderColor="purple.500"
                type="number"
                min="0"
                max="100"
                step="0.01"
              />
              <InputRightElement pointerEvents="none" color="gray.500">
                <Text>%</Text>
              </InputRightElement>
            </InputGroup>
          </FormControl>
        </Grid>

        <FormControl mt={4}>
          <FormLabel fontWeight="semibold" color="gray.700">
            Final Price (auto)
          </FormLabel>
          <InputGroup size="lg">
            <InputLeftElement pointerEvents="none" color="gray.500">
              <Text>$</Text>
            </InputLeftElement>
            <Input
              name="price"
              value={hasVariants ? (defaultVariant?.price ?? '') : form.price}
              onChange={handleChange}
              placeholder="0.00"
              borderRadius="lg"
              focusBorderColor="purple.500"
              type="number"
              min="0"
              step="0.01"
              bg="gray.50"
              isReadOnly={!hasVariants}
            />
          </InputGroup>
          <Text fontSize="xs" color="gray.500" mt={1}>
            Auto-calculated based on original price and discount
          </Text>
        </FormControl>

        <FormControl mt={4}>
          <FormLabel fontWeight="semibold" color="gray.700">
            Pricing Type *
          </FormLabel>
          <Select
            name="pricing_type"
            value={form.pricing_type || 'per_person'}
            onChange={handleChange}
            size="lg"
            borderRadius="lg"
            focusBorderColor="purple.500"
          >
            <option value="per_person">Per Person</option>
            <option value="per_couple">Per Couple</option>
            <option value="per_room">Per Room</option>
            <option value="per_group">Per Group</option>
          </Select>
          <Text fontSize="xs" color="gray.500" mt={1}>
            How the price is calculated and displayed to customers
          </Text>
        </FormControl>

        {/* Price Summary */}
        {originalPrice > 0 && (
          <Box mt={4} p={4} bg="purple.50" borderRadius="lg" border="1px solid" borderColor="purple.200">
            <Text fontSize="sm" fontWeight="semibold" color="purple.700" mb={2}>
              Price Summary
            </Text>
            <Grid templateColumns="1fr 1fr" gap={4}>
              <Box>
                <Text fontSize="xs" color="gray.600">Original Price</Text>
                <Text fontSize="lg" fontWeight="bold" color="gray.700">${originalPrice.toLocaleString()}</Text>
              </Box>
              <Box>
                <Text fontSize="xs" color="gray.600">Final Price</Text>
                <Text fontSize="lg" fontWeight="bold" color="green.600">${validFinalPrice.toLocaleString()}</Text>
              </Box>
              {discountPercent > 0 && (
                <>
                  <Box>
                    <Text fontSize="xs" color="gray.600">Discount</Text>
                    <Text fontSize="lg" fontWeight="bold" color="red.600">-${validSavings.toLocaleString()}</Text>
                  </Box>
                  <Box>
                    <Text fontSize="xs" color="gray.600">Savings</Text>
                    <Badge colorScheme="green" variant="subtle" fontSize="sm">
                      {discountPercent}% OFF
                    </Badge>
                  </Box>
                </>
              )}
            </Grid>
          </Box>
        )}
      </Box>

      <Divider />

      {/* Seasonal Pricing */}
      <Box>
        <Text fontSize="lg" fontWeight="semibold" color="gray.700" mb={4}>
          Seasonal Pricing (Optional)
        </Text>
        <Text fontSize="sm" color="gray.600" mb={4}>
          Define different pricing for peak, off-peak, and shoulder seasons
        </Text>
        
        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr 1fr' }} gap={6}>
          <FormControl>
            <FormLabel fontWeight="semibold" color="gray.700">
              Peak Season Price
            </FormLabel>
            <InputGroup size="lg">
              <InputLeftElement pointerEvents="none" color="gray.500">
                <Text>$</Text>
              </InputLeftElement>
              <Input
                value={form.seasonal_pricing.peak_season}
                onChange={(e) => handleSeasonalPricingChange('peak_season', e.target.value)}
                placeholder="0.00"
                borderRadius="lg"
                focusBorderColor="purple.500"
                type="number"
                min="0"
                step="0.01"
              />
            </InputGroup>
            <Text fontSize="xs" color="gray.500" mt={1}>
              Highest demand period
            </Text>
          </FormControl>

          <FormControl>
            <FormLabel fontWeight="semibold" color="gray.700">
              Shoulder Season Price
            </FormLabel>
            <InputGroup size="lg">
              <InputLeftElement pointerEvents="none" color="gray.500">
                <Text>$</Text>
              </InputLeftElement>
              <Input
                value={form.seasonal_pricing.shoulder_season}
                onChange={(e) => handleSeasonalPricingChange('shoulder_season', e.target.value)}
                placeholder="0.00"
                borderRadius="lg"
                focusBorderColor="purple.500"
                type="number"
                min="0"
                step="0.01"
              />
            </InputGroup>
            <Text fontSize="xs" color="gray.500" mt={1}>
              Moderate demand period
            </Text>
          </FormControl>

          <FormControl>
            <FormLabel fontWeight="semibold" color="gray.700">
              Off-Peak Season Price
            </FormLabel>
            <InputGroup size="lg">
              <InputLeftElement pointerEvents="none" color="gray.500">
                <Text>$</Text>
              </InputLeftElement>
              <Input
                value={form.seasonal_pricing.off_peak_season}
                onChange={(e) => handleSeasonalPricingChange('off_peak_season', e.target.value)}
                placeholder="0.00"
                borderRadius="lg"
                focusBorderColor="purple.500"
                type="number"
                min="0"
                step="0.01"
              />
            </InputGroup>
            <Text fontSize="xs" color="gray.500" mt={1}>
              Lowest demand period
            </Text>
          </FormControl>
        </Grid>
      </Box>

      <Divider />

      {/* Booking Terms */}
      <Box>
        <Text fontSize="lg" fontWeight="semibold" color="gray.700" mb={4}>
          Booking Terms & Policies
        </Text>
        
        <VStack spacing={6} align="stretch">
          <FormControl>
            <FormLabel fontWeight="semibold" color="gray.700">
              Booking Terms
            </FormLabel>
            <Textarea
              name="booking_terms"
              value={form.booking_terms}
              onChange={handleChange}
              placeholder="Enter booking terms and conditions..."
              size="lg"
              borderRadius="lg"
              focusBorderColor="purple.500"
              rows={3}
              resize="vertical"
            />
          </FormControl>

          <FormControl>
            <FormLabel fontWeight="semibold" color="gray.700">
              Cancellation Policy
            </FormLabel>
            <Textarea
              name="cancellation_policy"
              value={form.cancellation_policy}
              onChange={handleChange}
              placeholder="Enter cancellation policy details..."
              size="lg"
              borderRadius="lg"
              focusBorderColor="purple.500"
              rows={3}
              resize="vertical"
            />
          </FormControl>

          <FormControl>
            <FormLabel fontWeight="semibold" color="gray.700">
              Payment Terms
            </FormLabel>
            <Textarea
              name="payment_terms"
              value={form.payment_terms}
              onChange={handleChange}
              placeholder="Enter payment terms and conditions..."
              size="lg"
              borderRadius="lg"
              focusBorderColor="purple.500"
              rows={3}
              resize="vertical"
            />
          </FormControl>
        </VStack>
      </Box>
    </VStack>
  );
}
