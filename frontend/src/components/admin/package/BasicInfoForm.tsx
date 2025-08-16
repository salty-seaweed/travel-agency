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
  Badge,
  Flex,
} from '@chakra-ui/react';
import type { Property } from '../../../types';

interface BasicInfoFormProps {
  form: any;
  updateForm: (updates: any) => void;
  properties: Property[];
}

export function BasicInfoForm({ form, updateForm, properties }: BasicInfoFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    updateForm({
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handlePropertyChange = (propertyId: number) => {
    const newProperties = form.properties.includes(propertyId)
      ? form.properties.filter((id: number) => id !== propertyId)
      : [...form.properties, propertyId];
    
    updateForm({ properties: newProperties });
  };

  const handleGroupSizeChange = (field: 'min' | 'max' | 'recommended', value: number) => {
    updateForm({
      group_size: {
        ...form.group_size,
        [field]: value
      }
    });
  };

  return (
    <VStack spacing={6} align="stretch">
      <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={8}>
        {/* Left Column - Basic Info */}
        <VStack spacing={6} align="stretch">
          <FormControl isRequired>
            <FormLabel fontWeight="semibold" color="gray.700">
              Package Name
            </FormLabel>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter package name"
              size="lg"
              borderRadius="lg"
              focusBorderColor="purple.500"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel fontWeight="semibold" color="gray.700">
              Short Description
            </FormLabel>
            <Textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Brief description of the package"
              size="lg"
              borderRadius="lg"
              focusBorderColor="purple.500"
              rows={3}
              resize="vertical"
            />
          </FormControl>

          <FormControl>
            <FormLabel fontWeight="semibold" color="gray.700">
              Detailed Description
            </FormLabel>
            <Textarea
              name="detailed_description"
              value={form.detailed_description}
              onChange={handleChange}
              placeholder="Comprehensive description of the package experience"
              size="lg"
              borderRadius="lg"
              focusBorderColor="purple.500"
              rows={6}
              resize="vertical"
            />
          </FormControl>

          <Grid templateColumns="1fr 1fr" gap={4}>
            <FormControl isRequired>
              <FormLabel fontWeight="semibold" color="gray.700">
                Category
              </FormLabel>
              <Select
                name="category"
                value={form.category}
                onChange={handleChange}
                size="lg"
                borderRadius="lg"
                focusBorderColor="purple.500"
              >
                <option value="">Select Category</option>
                <option value="Adventure">Adventure</option>
                <option value="Luxury">Luxury</option>
                <option value="Cultural">Cultural</option>
                <option value="Romantic">Romantic</option>
                <option value="Family">Family</option>
                <option value="Wellness">Wellness</option>
                <option value="Photography">Photography</option>
                <option value="Diving">Diving</option>
                <option value="Fishing">Fishing</option>
                <option value="Island Hopping">Island Hopping</option>
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel fontWeight="semibold" color="gray.700">
                Difficulty Level
              </FormLabel>
              <Select
                name="difficulty_level"
                value={form.difficulty_level}
                onChange={handleChange}
                size="lg"
                borderRadius="lg"
                focusBorderColor="purple.500"
              >
                <option value="easy">Easy</option>
                <option value="moderate">Moderate</option>
                <option value="challenging">Challenging</option>
                <option value="expert">Expert</option>
              </Select>
            </FormControl>
          </Grid>

          <FormControl isRequired>
            <FormLabel fontWeight="semibold" color="gray.700">
              Duration (Days)
            </FormLabel>
            <Input
              name="duration"
              value={form.duration}
              onChange={handleChange}
              placeholder="1"
              size="lg"
              borderRadius="lg"
              focusBorderColor="purple.500"
              type="number"
              min="1"
            />
          </FormControl>

          <FormControl>
            <FormLabel fontWeight="semibold" color="gray.700">
              Featured Package
            </FormLabel>
            <Checkbox
              name="is_featured"
              isChecked={form.is_featured}
              onChange={handleChange}
              colorScheme="purple"
              size="lg"
            >
              <Text fontSize="sm">Mark as featured package</Text>
            </Checkbox>
          </FormControl>
        </VStack>

        {/* Right Column - Group Size & Properties */}
        <VStack spacing={6} align="stretch">
          <FormControl>
            <FormLabel fontWeight="semibold" color="gray.700">
              Group Size
            </FormLabel>
            <Grid templateColumns="1fr 1fr 1fr" gap={4}>
              <Box>
                <Text fontSize="sm" color="gray.600" mb={2}>Minimum</Text>
                <Input
                  value={form.group_size.min}
                  onChange={(e) => handleGroupSizeChange('min', parseInt(e.target.value) || 1)}
                  size="md"
                  borderRadius="lg"
                  type="number"
                  min="1"
                />
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.600" mb={2}>Maximum</Text>
                <Input
                  value={form.group_size.max}
                  onChange={(e) => handleGroupSizeChange('max', parseInt(e.target.value) || 4)}
                  size="md"
                  borderRadius="lg"
                  type="number"
                  min="1"
                />
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.600" mb={2}>Recommended</Text>
                <Input
                  value={form.group_size.recommended}
                  onChange={(e) => handleGroupSizeChange('recommended', parseInt(e.target.value) || 2)}
                  size="md"
                  borderRadius="lg"
                  type="number"
                  min="1"
                />
              </Box>
            </Grid>
          </FormControl>

          <FormControl>
            <FormLabel fontWeight="semibold" color="gray.700">
              Select Properties (Optional)
            </FormLabel>
            <Box
              border="1px solid"
              borderColor="gray.200"
              borderRadius="lg"
              p={4}
              maxH="300px"
              overflowY="auto"
            >
              {properties.length > 0 ? (
                <VStack spacing={3} align="stretch">
                  {properties.map((property: any) => (
                    <Checkbox
                      key={property.id}
                      isChecked={form.properties.includes(property.id)}
                      onChange={() => handlePropertyChange(property.id)}
                      colorScheme="purple"
                      size="lg"
                    >
                      <Flex direction="column" align="start">
                        <Text fontSize="sm" fontWeight="medium">
                          {property.name}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          ${property.price_per_night}/night • {property.location?.island}, {property.location?.atoll}
                        </Text>
                      </Flex>
                    </Checkbox>
                  ))}
                </VStack>
              ) : (
                <Text fontSize="sm" color="gray.500" textAlign="center" py={4}>
                  No properties available. You can still create a package without properties.
                </Text>
              )}
            </Box>
            <Text fontSize="xs" color="gray.500" mt={2}>
              Select properties to include in this package, or leave empty for a standalone package
            </Text>
          </FormControl>

          {form.properties.length > 0 && (
            <Box>
              <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
                Selected Properties ({form.properties.length})
              </Text>
              <Flex wrap="wrap" gap={2}>
                {form.properties.map((propertyId: number) => {
                  const property = properties.find((p: any) => p.id === propertyId);
                  return property ? (
                    <Badge key={propertyId} colorScheme="purple" variant="subtle">
                      {property.name}
                    </Badge>
                  ) : null;
                })}
              </Flex>
            </Box>
          )}

          <Grid templateColumns="1fr 1fr" gap={4}>
            <FormControl>
              <FormLabel fontWeight="semibold" color="gray.700">
                Start Date
              </FormLabel>
              <Input
                name="start_date"
                value={form.start_date}
                onChange={handleChange}
                size="lg"
                borderRadius="lg"
                focusBorderColor="purple.500"
                type="date"
              />
            </FormControl>
            
            <FormControl>
              <FormLabel fontWeight="semibold" color="gray.700">
                End Date
              </FormLabel>
              <Input
                name="end_date"
                value={form.end_date}
                onChange={handleChange}
                size="lg"
                borderRadius="lg"
                focusBorderColor="purple.500"
                type="date"
              />
            </FormControl>
          </Grid>
        </VStack>
      </Grid>
    </VStack>
  );
}
