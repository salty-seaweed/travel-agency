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
  Button,
  Box,
  Text,
  IconButton,
  Badge,
  Flex,
} from '@chakra-ui/react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface InclusionsFormProps {
  form: any;
  updateForm: (updates: any) => void;
}

export function InclusionsForm({ form, updateForm }: InclusionsFormProps) {
  const addInclusion = () => {
    const newInclusion = {
      category: 'included',
      item: '',
      description: '',
      icon: ''
    };
    
    updateForm({
      inclusions: [...form.inclusions, newInclusion]
    });
  };

  const removeInclusion = (index: number) => {
    const newInclusions = form.inclusions.filter((_: any, i: number) => i !== index);
    updateForm({ inclusions: newInclusions });
  };

  const updateInclusion = (index: number, field: string, value: any) => {
    const newInclusions = [...form.inclusions];
    newInclusions[index] = {
      ...newInclusions[index],
      [field]: value
    };
    updateForm({ inclusions: newInclusions });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'included': return 'green';
      case 'excluded': return 'red';
      case 'optional': return 'blue';
      default: return 'gray';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'included': return '✅';
      case 'excluded': return '❌';
      case 'optional': return 'ℹ️';
      default: return '•';
    }
  };

  return (
    <VStack spacing={6} align="stretch">
      <Box>
        <Text fontSize="lg" fontWeight="semibold" color="gray.700" mb={2}>
          What's Included & Excluded
        </Text>
        <Text fontSize="sm" color="gray.600" mb={4}>
          Define what's included, excluded, or optional in this package
        </Text>
      </Box>

      {form.inclusions.length === 0 ? (
        <Box textAlign="center" py={8} border="2px dashed" borderColor="gray.200" borderRadius="lg">
          <Text color="gray.500" mb={4}>No inclusions/exclusions added yet</Text>
          <Button
            leftIcon={<PlusIcon className="h-4 w-4" />}
            colorScheme="purple"
            onClick={addInclusion}
          >
            Add First Item
          </Button>
        </Box>
      ) : (
        <VStack spacing={6} align="stretch">
          {form.inclusions.map((inclusion: any, index: number) => (
            <Box key={index} border="1px solid" borderColor="gray.200" borderRadius="lg" p={6}>
              <Flex justify="space-between" align="center" mb={4}>
                <HStack spacing={3}>
                  <Text fontSize="lg">{getCategoryIcon(inclusion.category)}</Text>
                  <Badge colorScheme={getCategoryColor(inclusion.category)} variant="subtle">
                    {inclusion.category}
                  </Badge>
                </HStack>
                <IconButton
                  aria-label="Remove inclusion"
                  icon={<TrashIcon className="h-4 w-4" />}
                  size="sm"
                  colorScheme="red"
                  variant="ghost"
                  onClick={() => removeInclusion(index)}
                />
              </Flex>

              <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={6}>
                <VStack spacing={4} align="stretch">
                  <FormControl isRequired>
                    <FormLabel fontWeight="semibold" color="gray.700">
                      Item Name
                    </FormLabel>
                    <Input
                      value={inclusion.item}
                      onChange={(e) => updateInclusion(index, 'item', e.target.value)}
                      placeholder="e.g., Airport transfers"
                      size="lg"
                      borderRadius="lg"
                      focusBorderColor="purple.500"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel fontWeight="semibold" color="gray.700">
                      Description
                    </FormLabel>
                    <Textarea
                      value={inclusion.description}
                      onChange={(e) => updateInclusion(index, 'description', e.target.value)}
                      placeholder="Additional details about this item..."
                      size="lg"
                      borderRadius="lg"
                      focusBorderColor="purple.500"
                      rows={3}
                      resize="vertical"
                    />
                  </FormControl>
                </VStack>

                <VStack spacing={4} align="stretch">
                  <FormControl isRequired>
                    <FormLabel fontWeight="semibold" color="gray.700">
                      Category
                    </FormLabel>
                    <Select
                      value={inclusion.category}
                      onChange={(e) => updateInclusion(index, 'category', e.target.value)}
                      size="lg"
                      borderRadius="lg"
                      focusBorderColor="purple.500"
                    >
                      <option value="included">✅ Included</option>
                      <option value="excluded">❌ Excluded</option>
                      <option value="optional">ℹ️ Optional</option>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel fontWeight="semibold" color="gray.700">
                      Icon (Optional)
                    </FormLabel>
                    <Input
                      value={inclusion.icon}
                      onChange={(e) => updateInclusion(index, 'icon', e.target.value)}
                      placeholder="e.g., 🚗, 🏨, 🍽️"
                      size="lg"
                      borderRadius="lg"
                      focusBorderColor="purple.500"
                    />
                    <Text fontSize="xs" color="gray.500" mt={1}>
                      Use emoji or icon name for visual representation
                    </Text>
                  </FormControl>
                </VStack>
              </Grid>
            </Box>
          ))}

          <Button
            leftIcon={<PlusIcon className="h-4 w-4" />}
            colorScheme="purple"
            variant="outline"
            onClick={addInclusion}
            size="lg"
          >
            Add Another Item
          </Button>
        </VStack>
      )}

      {/* Summary */}
      {form.inclusions.length > 0 && (
        <Box mt={6} p={4} bg="gray.50" borderRadius="lg">
          <Text fontSize="sm" fontWeight="semibold" color="gray.700" mb={3}>
            Summary
          </Text>
          <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr 1fr' }} gap={4}>
            <Box>
              <Text fontSize="xs" color="gray.600">Included</Text>
              <Text fontSize="lg" fontWeight="bold" color="green.600">
                {form.inclusions.filter((i: any) => i.category === 'included').length}
              </Text>
            </Box>
            <Box>
              <Text fontSize="xs" color="gray.600">Excluded</Text>
              <Text fontSize="lg" fontWeight="bold" color="red.600">
                {form.inclusions.filter((i: any) => i.category === 'excluded').length}
              </Text>
            </Box>
            <Box>
              <Text fontSize="xs" color="gray.600">Optional</Text>
              <Text fontSize="lg" fontWeight="bold" color="blue.600">
                {form.inclusions.filter((i: any) => i.category === 'optional').length}
              </Text>
            </Box>
          </Grid>
        </Box>
      )}
    </VStack>
  );
}
