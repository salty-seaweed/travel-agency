import React from 'react';
import {
  VStack,
  HStack,
  Grid,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Checkbox,
  Box,
  Text,
  Divider,
} from '@chakra-ui/react';

interface AccommodationFormProps {
  form: any;
  updateForm: (updates: any) => void;
}

export function AccommodationForm({ form, updateForm }: AccommodationFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    updateForm({
      [name]: type === 'checkbox' ? checked : value
    });
  };

  return (
    <VStack spacing={8} align="stretch">
      {/* Accommodation Details */}
      <Box>
        <Text fontSize="lg" fontWeight="semibold" color="gray.700" mb={4}>
          Accommodation Details
        </Text>
        
        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={6}>
          <FormControl>
            <FormLabel fontWeight="semibold" color="gray.700">
              Accommodation Type
            </FormLabel>
            <Select
              name="accommodation_type"
              value={form.accommodation_type}
              onChange={handleChange}
              size="lg"
              borderRadius="lg"
              focusBorderColor="purple.500"
            >
              <option value="">Select Type</option>
              <option value="Resort">Resort</option>
              <option value="Hotel">Hotel</option>
              <option value="Guesthouse">Guesthouse</option>
              <option value="Villa">Villa</option>
              <option value="Bungalow">Bungalow</option>
              <option value="Overwater Villa">Overwater Villa</option>
              <option value="Beach House">Beach House</option>
              <option value="Eco Lodge">Eco Lodge</option>
              <option value="Boutique Hotel">Boutique Hotel</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel fontWeight="semibold" color="gray.700">
              Room Type
            </FormLabel>
            <Select
              name="room_type"
              value={form.room_type}
              onChange={handleChange}
              size="lg"
              borderRadius="lg"
              focusBorderColor="purple.500"
            >
              <option value="">Select Room Type</option>
              <option value="Standard Room">Standard Room</option>
              <option value="Deluxe Room">Deluxe Room</option>
              <option value="Suite">Suite</option>
              <option value="Presidential Suite">Presidential Suite</option>
              <option value="Garden Villa">Garden Villa</option>
              <option value="Beach Villa">Beach Villa</option>
              <option value="Overwater Villa">Overwater Villa</option>
              <option value="Family Villa">Family Villa</option>
              <option value="Honeymoon Villa">Honeymoon Villa</option>
              <option value="Private Villa">Private Villa</option>
            </Select>
          </FormControl>
        </Grid>

        <FormControl mt={6}>
          <FormLabel fontWeight="semibold" color="gray.700">
            Meal Plan
          </FormLabel>
          <Select
            name="meal_plan"
            value={form.meal_plan}
            onChange={handleChange}
            size="lg"
            borderRadius="lg"
            focusBorderColor="purple.500"
          >
            <option value="">Select Meal Plan</option>
            <option value="Room Only">Room Only</option>
            <option value="Bed & Breakfast">Bed & Breakfast</option>
            <option value="Half Board">Half Board (Breakfast + Dinner)</option>
            <option value="Full Board">Full Board (Breakfast + Lunch + Dinner)</option>
            <option value="All Inclusive">All Inclusive</option>
            <option value="Ultra All Inclusive">Ultra All Inclusive</option>
          </Select>
        </FormControl>
      </Box>

      <Divider />

      {/* Transportation Details */}
      <Box>
        <Text fontSize="lg" fontWeight="semibold" color="gray.700" mb={4}>
          Transportation Details
        </Text>
        
        <FormControl>
          <FormLabel fontWeight="semibold" color="gray.700">
            Transportation Details
          </FormLabel>
          <Textarea
            name="transportation_details"
            value={form.transportation_details}
            onChange={handleChange}
            placeholder="Describe transportation arrangements (speedboat, seaplane, domestic flights, etc.)"
            size="lg"
            borderRadius="lg"
            focusBorderColor="purple.500"
            rows={4}
            resize="vertical"
          />
        </FormControl>

        <FormControl mt={6}>
          <FormLabel fontWeight="semibold" color="gray.700">
            Airport Transfers
          </FormLabel>
          <Checkbox
            name="airport_transfers"
            isChecked={form.airport_transfers}
            onChange={handleChange}
            colorScheme="purple"
            size="lg"
          >
            <Text fontSize="sm">Include airport pickup and drop-off transfers</Text>
          </Checkbox>
        </FormControl>
      </Box>

      <Divider />

      {/* Additional Accommodation Info */}
      <Box>
        <Text fontSize="lg" fontWeight="semibold" color="gray.700" mb={4}>
          Additional Information
        </Text>
        
        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={6}>
          <Box>
            <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={3}>
              Accommodation Features
            </Text>
            <VStack spacing={2} align="stretch">
              <Text fontSize="sm" color="gray.600">• Air conditioning</Text>
              <Text fontSize="sm" color="gray.600">• Private bathroom</Text>
              <Text fontSize="sm" color="gray.600">• Ocean view</Text>
              <Text fontSize="sm" color="gray.600">• Private terrace/balcony</Text>
              <Text fontSize="sm" color="gray.600">• WiFi access</Text>
              <Text fontSize="sm" color="gray.600">• Daily housekeeping</Text>
            </VStack>
          </Box>

          <Box>
            <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={3}>
              Transportation Options
            </Text>
            <VStack spacing={2} align="stretch">
              <Text fontSize="sm" color="gray.600">• Speedboat transfers</Text>
              <Text fontSize="sm" color="gray.600">• Seaplane flights</Text>
              <Text fontSize="sm" color="gray.600">• Domestic flights</Text>
              <Text fontSize="sm" color="gray.600">• Private transfers</Text>
              <Text fontSize="sm" color="gray.600">• Shared transfers</Text>
              <Text fontSize="sm" color="gray.600">• Local transportation</Text>
            </VStack>
          </Box>
        </Grid>
      </Box>
    </VStack>
  );
}
