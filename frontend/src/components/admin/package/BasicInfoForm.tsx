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
}

export function BasicInfoForm({ form, updateForm }: BasicInfoFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    updateForm({
      [name]: type === 'checkbox' ? checked : value
    });
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
              Package Name (English) *
            </FormLabel>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter package name"
              size="lg"
              borderRadius="lg"
              focusBorderColor="purple.500"
              isInvalid={!form.name.trim()}
            />
          </FormControl>

          <FormControl>
            <FormLabel fontWeight="semibold" color="gray.700">
              Package Name (Russian)
            </FormLabel>
            <Input
              name="name_ru"
              value={form.name_ru || ''}
              onChange={handleChange}
              placeholder="Введите название пакета"
              size="lg"
              borderRadius="lg"
              focusBorderColor="purple.500"
            />
          </FormControl>

          <FormControl>
            <FormLabel fontWeight="semibold" color="gray.700">
              Package Name (Chinese)
            </FormLabel>
            <Input
              name="name_zh"
              value={form.name_zh || ''}
              onChange={handleChange}
              placeholder="输入套餐名称"
              size="lg"
              borderRadius="lg"
              focusBorderColor="purple.500"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel fontWeight="semibold" color="gray.700">
              Short Description (English) *
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
              isInvalid={!form.description.trim()}
            />
          </FormControl>

          <FormControl>
            <FormLabel fontWeight="semibold" color="gray.700">
              Short Description (Russian)
            </FormLabel>
            <Textarea
              name="description_ru"
              value={form.description_ru || ''}
              onChange={handleChange}
              placeholder="Краткое описание пакета"
              size="lg"
              borderRadius="lg"
              focusBorderColor="purple.500"
              rows={3}
              resize="vertical"
            />
          </FormControl>

          <FormControl>
            <FormLabel fontWeight="semibold" color="gray.700">
              Short Description (Chinese)
            </FormLabel>
            <Textarea
              name="description_zh"
              value={form.description_zh || ''}
              onChange={handleChange}
              placeholder="套餐简介"
              size="lg"
              borderRadius="lg"
              focusBorderColor="purple.500"
              rows={3}
              resize="vertical"
            />
          </FormControl>

          <FormControl>
            <FormLabel fontWeight="semibold" color="gray.700">
              Detailed Description (English)
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

          <FormControl>
            <FormLabel fontWeight="semibold" color="gray.700">
              Detailed Description (Russian)
            </FormLabel>
            <Textarea
              name="detailed_description_ru"
              value={form.detailed_description_ru || ''}
              onChange={handleChange}
              placeholder="Подробное описание опыта пакета"
              size="lg"
              borderRadius="lg"
              focusBorderColor="purple.500"
              rows={6}
              resize="vertical"
            />
          </FormControl>

          <FormControl>
            <FormLabel fontWeight="semibold" color="gray.700">
              Detailed Description (Chinese)
            </FormLabel>
            <Textarea
              name="detailed_description_zh"
              value={form.detailed_description_zh || ''}
              onChange={handleChange}
              placeholder="套餐体验的详细描述"
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

          <FormControl>
            <FormLabel fontWeight="semibold" color="gray.700">
              Package Highlights
            </FormLabel>
            <Textarea
              name="highlights"
              value={form.highlights || ''}
              onChange={handleChange}
              placeholder="Enter package highlights, one per line or separated by commas"
              size="lg"
              borderRadius="lg"
              focusBorderColor="purple.500"
              rows={4}
              resize="vertical"
            />
            <Text fontSize="xs" color="gray.500" mt={1}>
              Add key highlights that make this package special (e.g., "Private beach access", "All-inclusive meals", "Sunset cruise")
            </Text>
          </FormControl>
        </VStack>

        {/* Right Column - Group Size & Dates */}
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
