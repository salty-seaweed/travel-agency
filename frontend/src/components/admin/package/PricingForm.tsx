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
} from '@chakra-ui/react';

interface PricingFormProps {
  form: any;
  updateForm: (updates: any) => void;
}

export function PricingForm({ form, updateForm }: PricingFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    updateForm({
      [name]: value
    });

    // Auto-calculate price when original price or discount changes
    if (name === 'original_price' || name === 'discount_percentage') {
      const originalPrice = parseFloat(form.original_price) || 0;
      const discountPercent = parseFloat(form.discount_percentage) || 0;
      const discountedPrice = originalPrice - (originalPrice * discountPercent / 100);
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

  const originalPrice = parseFloat(form.original_price) || 0;
  const discountPercent = parseFloat(form.discount_percentage) || 0;
  const finalPrice = parseFloat(form.price) || 0;
  const savings = originalPrice - finalPrice;

  return (
    <VStack spacing={8} align="stretch">
      {/* Basic Pricing */}
      <Box>
        <Text fontSize="lg" fontWeight="semibold" color="gray.700" mb={4}>
          Basic Pricing
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
                value={form.original_price}
                onChange={handleChange}
                placeholder="0.00"
                borderRadius="lg"
                focusBorderColor="purple.500"
                type="number"
                min="0"
                step="0.01"
                isInvalid={!form.original_price || parseFloat(form.original_price) <= 0}
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
            Final Price
          </FormLabel>
          <InputGroup size="lg">
            <InputLeftElement pointerEvents="none" color="gray.500">
              <Text>$</Text>
            </InputLeftElement>
            <Input
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="0.00"
              borderRadius="lg"
              focusBorderColor="purple.500"
              type="number"
              min="0"
              step="0.01"
              bg="gray.50"
              isReadOnly
            />
          </InputGroup>
          <Text fontSize="xs" color="gray.500" mt={1}>
            Auto-calculated based on original price and discount
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
                <Text fontSize="lg" fontWeight="bold" color="green.600">${finalPrice.toLocaleString()}</Text>
              </Box>
              {discountPercent > 0 && (
                <>
                  <Box>
                    <Text fontSize="xs" color="gray.600">Discount</Text>
                    <Text fontSize="lg" fontWeight="bold" color="red.600">-${savings.toLocaleString()}</Text>
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
