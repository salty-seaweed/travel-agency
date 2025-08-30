import React, { useState, useEffect } from 'react';
import {
  VStack,
  HStack,
  Grid,
  FormControl,
  FormLabel,
  Input,
  Button,
  Box,
  Text,
  IconButton,
  Badge,
  Flex,
  Checkbox,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Image,
  Select,
} from '@chakra-ui/react';
import { PlusIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useExperiences } from '../../../hooks/useQueries';

interface ExperiencePickerProps {
  form: any;
  updateForm: (updates: any) => void;
}

export function ExperiencePicker({ form, updateForm }: ExperiencePickerProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: experiences, isLoading } = useExperiences();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const addExperience = (experience: any) => {
    // Check if experience is already added
    const isAlreadyAdded = form.experiences?.some((exp: any) => exp.id === experience.id);
    if (isAlreadyAdded) {
      return;
    }

    const newExperience = {
      id: experience.id,
      name: experience.name,
      description: experience.description,
      experience_type: experience.experience_type,
      duration: experience.duration,
      price: experience.price,
      currency: experience.currency,
      destination: experience.destination,
      difficulty_level: experience.difficulty_level,
      is_included: true, // Default to included
      custom_price: experience.price, // Allow custom pricing for package
      custom_duration: experience.duration, // Allow custom duration for package
    };

    updateForm({
      experiences: [...(form.experiences || []), newExperience]
    });
  };

  const removeExperience = (experienceId: number) => {
    const newExperiences = form.experiences.filter((exp: any) => exp.id !== experienceId);
    updateForm({ experiences: newExperiences });
  };

  const updateExperience = (experienceId: number, field: string, value: any) => {
    const newExperiences = form.experiences.map((exp: any) => 
      exp.id === experienceId ? { ...exp, [field]: value } : exp
    );
    updateForm({ experiences: newExperiences });
  };

  const filteredExperiences = (experiences || []).filter((experience: any) => {
    const name = typeof experience?.name === 'string' ? experience.name : '';
    const desc = typeof experience?.description === 'string' ? experience.description : '';
    const type = experience?.experience_type || '';
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         desc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !selectedType || type === selectedType;
    return matchesSearch && matchesType;
  });

  const experienceTypes = [
    'water_sports', 'cultural', 'adventure', 'wellness', 'food', 
    'photography', 'fishing', 'diving', 'sailing', 'spa'
  ];

  return (
    <VStack spacing={6} align="stretch">
      <Box>
        <Text fontSize="lg" fontWeight="semibold" color="gray.700" mb={2}>
          Experiences
        </Text>
        <Text fontSize="sm" color="gray.600" mb={4}>
          Select experiences to include in this package
        </Text>
      </Box>

      {/* Selected Experiences */}
      {form.experiences?.length > 0 ? (
        <VStack spacing={4} align="stretch">
          {(form.experiences || []).map((experience: any) => (
            <Box key={experience.id} border="1px solid" borderColor="gray.200" borderRadius="lg" p={4}>
              <Flex justify="space-between" align="start" mb={3}>
                <Box flex={1}>
                  <HStack spacing={2} mb={2}>
                    <Text fontWeight="semibold" color="gray.700">
                      {experience.name}
                    </Text>
                    <Badge colorScheme="blue" variant="subtle">
                      {(experience.experience_type || '').replace('_', ' ')}
                    </Badge>
                    <Badge colorScheme={(experience.difficulty_level === 'easy' ? 'green' : 
                                       experience.difficulty_level === 'moderate' ? 'yellow' : 
                                       experience.difficulty_level === 'challenging' ? 'orange' : 'red') as any}>
                      {experience.difficulty_level || ''}
                    </Badge>
                  </HStack>
                  <Text fontSize="sm" color="gray.600" mb={2}>
                    {experience.description}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {(experience.destination?.name || '')} - {(experience.duration || '')} - ${experience.price || ''}
                  </Text>
                </Box>
                <IconButton
                  aria-label="Remove experience"
                  icon={<TrashIcon className="h-4 w-4" />}
                  size="sm"
                  colorScheme="red"
                  variant="ghost"
                  onClick={() => removeExperience(experience.id)}
                />
              </Flex>
              
              {/* Package-specific settings */}
              <Grid templateColumns="1fr 1fr 1fr" gap={4} mt={3}>
                <FormControl size="sm">
                  <FormLabel fontSize="xs">Included</FormLabel>
                  <Checkbox
                    isChecked={experience.is_included}
                    onChange={(e) => updateExperience(experience.id, 'is_included', e.target.checked)}
                  >
                    <Text fontSize="xs">Include in package</Text>
                  </Checkbox>
                </FormControl>
                
                <FormControl size="sm">
                  <FormLabel fontSize="xs">Custom Price</FormLabel>
                  <Input
                    size="sm"
                    value={experience.custom_price}
                    onChange={(e) => updateExperience(experience.id, 'custom_price', e.target.value)}
                    placeholder="Package price"
                    type="number"
                    step="0.01"
                  />
                </FormControl>
                
                <FormControl size="sm">
                  <FormLabel fontSize="xs">Custom Duration</FormLabel>
                  <Input
                    size="sm"
                    value={experience.custom_duration}
                    onChange={(e) => updateExperience(experience.id, 'custom_duration', e.target.value)}
                    placeholder="Package duration"
                  />
                </FormControl>
              </Grid>
            </Box>
          ))}
        </VStack>
      ) : (
        <Box textAlign="center" py={8} border="2px dashed" borderColor="gray.200" borderRadius="lg">
          <Text color="gray.500" mb={4}>No experiences selected yet</Text>
          <Button
            leftIcon={<PlusIcon className="h-4 w-4" />}
            colorScheme="purple"
            onClick={onOpen}
          >
            Select Experiences
          </Button>
        </Box>
      )}

      {/* Add More Button */}
      {(form.experiences || []).length > 0 && (
        <Button
          leftIcon={<PlusIcon className="h-4 w-4" />}
          colorScheme="purple"
          variant="outline"
          onClick={onOpen}
        >
          Add More Experiences
        </Button>
      )}

      {/* Experience Selection Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select Experiences</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {/* Search and Filter */}
            <HStack spacing={4} mb={6}>
              <FormControl>
                <FormLabel>Search</FormLabel>
                <Input
                  placeholder="Search experiences..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  leftIcon={<MagnifyingGlassIcon className="h-4 w-4" />}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Type</FormLabel>
                <Select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="">All Types</option>
                  {experienceTypes.map(type => (
                    <option key={type} value={type}>
                      {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </HStack>

            {/* Experiences Grid */}
            {isLoading ? (
              <Box textAlign="center" py={8}>
                <Text>Loading experiences...</Text>
              </Box>
            ) : (
              <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={4}>
                {filteredExperiences.map((experience: any) => {
                  const isSelected = (form.experiences || []).some((exp: any) => exp.id === experience.id);
                  
                  return (
                    <Box
                      key={experience.id}
                      border="1px solid"
                      borderColor={isSelected ? "purple.200" : "gray.200"}
                      borderRadius="lg"
                      p={4}
                      bg={isSelected ? "purple.50" : "white"}
                      cursor="pointer"
                      onClick={() => !isSelected && addExperience(experience)}
                      _hover={{ borderColor: "purple.300" }}
                    >
                      <HStack spacing={2} mb={2}>
                        <Text fontWeight="semibold" color="gray.700" flex={1}>
                          {experience.name}
                        </Text>
                        {isSelected && (
                          <Badge colorScheme="purple">Selected</Badge>
                        )}
                      </HStack>
                      
                      <Text fontSize="sm" color="gray.600" mb={2} noOfLines={2}>
                        {experience.description}
                      </Text>
                      
                      <HStack spacing={2} mb={2}>
                        <Badge colorScheme="blue" variant="subtle" size="sm">
                          {(experience.experience_type || '').replace('_', ' ')}
                        </Badge>
                        <Badge 
                          colorScheme={(experience.difficulty_level === 'easy' ? 'green' : 
                                     experience.difficulty_level === 'moderate' ? 'yellow' : 
                                     experience.difficulty_level === 'challenging' ? 'orange' : 'red') as any}
                          size="sm"
                        >
                          {experience.difficulty_level || ''}
                        </Badge>
                      </HStack>
                      
                      <Text fontSize="xs" color="gray.500">
                        {(experience.destination?.name || '')} • {(experience.duration || '')} • ${experience.price || ''}
                      </Text>
                    </Box>
                  );
                })}
              </Grid>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  );
}
