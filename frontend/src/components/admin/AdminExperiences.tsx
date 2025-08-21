import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Button,
  Badge,
  Icon,
  useColorModeValue,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Card,
  CardBody,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  SimpleGrid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
  Alert,
  AlertIcon,
  Skeleton,
  SkeletonText,
  Wrap,
  WrapItem,
  Tag,
  TagLabel,
  TagCloseButton,
  useDisclosure,
  IconButton,
  Tooltip,
  Flex,
  Spacer,
  Divider
} from '@chakra-ui/react';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  CurrencyDollarIcon,
  ClockIcon,
  UsersIcon,
  MapPinIcon,
  StarIcon,
  FireIcon
} from '@heroicons/react/24/outline';
import { useExperiences, useDestinations, useLocations, useCreateExperience, useUpdateExperience, useDeleteExperience } from '../../hooks/useQueries';
import { LoadingSpinner } from '../LoadingSpinner';
import type { Experience, Destination, Location } from '../../types';

interface ExperienceFormData {
  name: string;
  description: string;
  experience_type: string;
  duration: string;
  price: string;
  currency: string;
  location_id: number | null;
  destination_id: number | null;
  max_participants: number;
  min_age: number;
  difficulty_level: string;
  includes: string[];
  excludes: string[];
  requirements: string[];
  is_featured: boolean;
  is_active: boolean;
}

export function AdminExperiences() {
  const { data: experiences, isLoading, error, refetch } = useExperiences();
  const { data: destinations } = useDestinations();
  const { data: locations } = useLocations();
  const createExperience = useCreateExperience();
  const updateExperience = useUpdateExperience();
  const deleteExperience = useDeleteExperience();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const experienceTypes = [
    'water_sports', 'cultural', 'adventure', 'wellness', 'food', 
    'photography', 'fishing', 'diving', 'sailing', 'spa'
  ];

  const difficultyLevels = ['easy', 'moderate', 'challenging', 'expert'];

  const [formData, setFormData] = useState<ExperienceFormData>({
    name: '',
    description: '',
    experience_type: 'water_sports',
    duration: '',
    price: '',
    currency: 'USD',
    location_id: null,
    destination_id: null,
    max_participants: 10,
    min_age: 0,
    difficulty_level: 'easy',
    includes: [],
    excludes: [],
    requirements: [],
    is_featured: false,
    is_active: true,
  });

  const [newInclude, setNewInclude] = useState('');
  const [newExclude, setNewExclude] = useState('');
  const [newRequirement, setNewRequirement] = useState('');

  useEffect(() => {
    if (editingExperience) {
      setFormData({
        name: editingExperience.name,
        description: editingExperience.description,
        experience_type: editingExperience.experience_type,
        duration: editingExperience.duration,
        price: editingExperience.price,
        currency: editingExperience.currency,
        location_id: editingExperience.location?.id || null,
        destination_id: editingExperience.destination?.id || null,
        max_participants: editingExperience.max_participants,
        min_age: editingExperience.min_age,
        difficulty_level: editingExperience.difficulty_level,
        includes: editingExperience.includes || [],
        excludes: editingExperience.excludes || [],
        requirements: editingExperience.requirements || [],
        is_featured: editingExperience.is_featured,
        is_active: editingExperience.is_active,
      });
    }
  }, [editingExperience]);

  const filteredExperiences = experiences?.filter(exp => {
    const matchesSearch = exp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exp.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || exp.experience_type === selectedType;
    const matchesStatus = selectedStatus === 'all' || 
                         (selectedStatus === 'active' && exp.is_active) ||
                         (selectedStatus === 'inactive' && !exp.is_active);
    
    return matchesSearch && matchesType && matchesStatus;
  }) || [];

  const handleCreate = () => {
    setIsCreating(true);
    setEditingExperience(null);
    setFormData({
      name: '',
      description: '',
      experience_type: 'water_sports',
      duration: '',
      price: '',
      currency: 'USD',
      location_id: null,
      destination_id: null,
      max_participants: 10,
      min_age: 0,
      difficulty_level: 'easy',
      includes: [],
      excludes: [],
      requirements: [],
      is_featured: false,
      is_active: true,
    });
    onOpen();
  };

  const handleEdit = (experience: Experience) => {
    setEditingExperience(experience);
    setIsCreating(false);
    onOpen();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this experience?')) {
      try {
        await deleteExperience.mutateAsync(id);
        toast({
          title: 'Experience deleted',
          status: 'success',
          duration: 3000,
        });
      } catch (error) {
        toast({
          title: 'Error deleting experience',
          status: 'error',
          duration: 3000,
        });
      }
    }
  };

  const handleSubmit = async () => {
    try {
      if (isCreating) {
        await createExperience.mutateAsync(formData);
        toast({
          title: 'Experience created',
          status: 'success',
          duration: 3000,
        });
      } else if (editingExperience) {
        await updateExperience.mutateAsync({ id: editingExperience.id, data: formData });
        toast({
          title: 'Experience updated',
          status: 'success',
          duration: 3000,
        });
      }
      onClose();
    } catch (error) {
      toast({
        title: 'Error saving experience',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const addInclude = () => {
    if (newInclude.trim()) {
      setFormData(prev => ({
        ...prev,
        includes: [...prev.includes, newInclude.trim()]
      }));
      setNewInclude('');
    }
  };

  const removeInclude = (index: number) => {
    setFormData(prev => ({
      ...prev,
      includes: prev.includes.filter((_, i) => i !== index)
    }));
  };

  const addExclude = () => {
    if (newExclude.trim()) {
      setFormData(prev => ({
        ...prev,
        excludes: [...prev.excludes, newExclude.trim()]
      }));
      setNewExclude('');
    }
  };

  const removeExclude = (index: number) => {
    setFormData(prev => ({
      ...prev,
      excludes: prev.excludes.filter((_, i) => i !== index)
    }));
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()]
      }));
      setNewRequirement('');
    }
  };

  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  if (isLoading) {
    return (
      <Box p={8}>
        <LoadingSpinner />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={8}>
        <Alert status="error">
          <AlertIcon />
          Error loading experiences: {error.message}
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={8}>
      <Container maxW="7xl">
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <HStack justify="space-between">
            <VStack align="start" spacing={2}>
              <Heading size="lg" className="text-2xl font-bold text-gray-800">
                Custom Experiences Management
              </Heading>
              <Text className="text-gray-600">
                Manage custom experiences that users can combine to create their own packages
              </Text>
            </VStack>
            <Button
              colorScheme="blue"
              leftIcon={<Icon as={PlusIcon} />}
              onClick={handleCreate}
            >
              Add Custom Experience
            </Button>
          </HStack>

          {/* Stats Cards */}
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
            <Card bg={bgColor} border="1px solid" borderColor={borderColor}>
              <CardBody>
                <VStack spacing={2}>
                  <Icon as={FireIcon} className="w-8 h-8 text-blue-500" />
                  <Text className="text-2xl font-bold">{experiences?.length || 0}</Text>
                  <Text className="text-sm text-gray-600">Custom Experiences</Text>
                </VStack>
              </CardBody>
            </Card>
            <Card bg={bgColor} border="1px solid" borderColor={borderColor}>
              <CardBody>
                <VStack spacing={2}>
                  <Icon as={StarIcon} className="w-8 h-8 text-yellow-500" />
                  <Text className="text-2xl font-bold">
                    {experiences?.filter(exp => exp.is_featured).length || 0}
                  </Text>
                  <Text className="text-sm text-gray-600">Featured</Text>
                </VStack>
              </CardBody>
            </Card>
            <Card bg={bgColor} border="1px solid" borderColor={borderColor}>
              <CardBody>
                <VStack spacing={2}>
                  <Icon as={EyeIcon} className="w-8 h-8 text-green-500" />
                  <Text className="text-2xl font-bold">
                    {experiences?.filter(exp => exp.is_active).length || 0}
                  </Text>
                  <Text className="text-sm text-gray-600">Available</Text>
                </VStack>
              </CardBody>
            </Card>
            <Card bg={bgColor} border="1px solid" borderColor={borderColor}>
              <CardBody>
                <VStack spacing={2}>
                  <Icon as={CurrencyDollarIcon} className="w-8 h-8 text-purple-500" />
                  <Text className="text-2xl font-bold">
                    ${experiences?.reduce((sum, exp) => sum + parseFloat(exp.price), 0).toFixed(0) || 0}
                  </Text>
                  <Text className="text-sm text-gray-600">Total Value</Text>
                </VStack>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Filters */}
          <Card bg={bgColor} border="1px solid" borderColor={borderColor}>
            <CardBody>
              <HStack spacing={4} flexWrap="wrap">
                <InputGroup maxW="300px">
                  <InputLeftElement>
                    <Icon as={MagnifyingGlassIcon} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    placeholder="Search experiences..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
                <Select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  maxW="200px"
                >
                  <option value="all">All Types</option>
                  {experienceTypes.map(type => (
                    <option key={type} value={type}>
                      {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </option>
                  ))}
                </Select>
                <Select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  maxW="150px"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Select>
              </HStack>
            </CardBody>
          </Card>

          {/* Experiences Table */}
          <Card bg={bgColor} border="1px solid" borderColor={borderColor}>
            <CardBody>
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Name</Th>
                      <Th>Type</Th>
                      <Th>Duration</Th>
                      <Th>Price</Th>
                      <Th>Location</Th>
                      <Th>Status</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredExperiences.map((experience) => (
                      <Tr key={experience.id}>
                        <Td>
                          <VStack align="start" spacing={1}>
                            <Text fontWeight="semibold">{experience.name}</Text>
                            <Text fontSize="sm" color="gray.500" noOfLines={2}>
                              {experience.description}
                            </Text>
                          </VStack>
                        </Td>
                        <Td>
                          <Badge colorScheme="blue" variant="subtle">
                            {experience.experience_type.replace('_', ' ')}
                          </Badge>
                        </Td>
                        <Td>
                          <HStack spacing={1}>
                            <Icon as={ClockIcon} className="w-4 h-4 text-gray-400" />
                            <Text>{experience.duration}</Text>
                          </HStack>
                        </Td>
                        <Td>
                          <HStack spacing={1}>
                            <Icon as={CurrencyDollarIcon} className="w-4 h-4 text-green-500" />
                            <Text fontWeight="semibold">${experience.price}</Text>
                          </HStack>
                        </Td>
                        <Td>
                          <HStack spacing={1}>
                            <Icon as={MapPinIcon} className="w-4 h-4 text-gray-400" />
                            <Text fontSize="sm">{experience.location?.island}</Text>
                          </HStack>
                        </Td>
                        <Td>
                          <HStack spacing={2}>
                            {experience.is_featured && (
                              <Badge colorScheme="yellow" variant="solid" size="sm">
                                Featured
                              </Badge>
                            )}
                            <Badge
                              colorScheme={experience.is_active ? 'green' : 'red'}
                              variant="solid"
                              size="sm"
                            >
                              {experience.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </HStack>
                        </Td>
                        <Td>
                          <HStack spacing={2}>
                            <Tooltip label="Edit">
                              <IconButton
                                aria-label="Edit experience"
                                icon={<Icon as={PencilIcon} />}
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEdit(experience)}
                              />
                            </Tooltip>
                            <Tooltip label="Delete">
                              <IconButton
                                aria-label="Delete experience"
                                icon={<Icon as={TrashIcon} />}
                                size="sm"
                                variant="ghost"
                                colorScheme="red"
                                onClick={() => handleDelete(experience.id)}
                                isLoading={deleteExperience.isPending}
                              />
                            </Tooltip>
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </CardBody>
          </Card>
        </VStack>

        {/* Create/Edit Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {isCreating ? 'Create New Custom Experience' : 'Edit Custom Experience'}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack spacing={6}>
                {/* Basic Information */}
                <FormControl>
                  <FormLabel>Name</FormLabel>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Custom experience name"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe this custom experience"
                    rows={4}
                  />
                </FormControl>

                <HStack spacing={4} w="full">
                  <FormControl>
                    <FormLabel>Type</FormLabel>
                    <Select
                      value={formData.experience_type}
                      onChange={(e) => setFormData(prev => ({ ...prev, experience_type: e.target.value }))}
                    >
                      {experienceTypes.map(type => (
                        <option key={type} value={type}>
                          {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Difficulty</FormLabel>
                    <Select
                      value={formData.difficulty_level}
                      onChange={(e) => setFormData(prev => ({ ...prev, difficulty_level: e.target.value }))}
                    >
                      {difficultyLevels.map(level => (
                        <option key={level} value={level}>
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                </HStack>

                <HStack spacing={4} w="full">
                  <FormControl>
                    <FormLabel>Duration</FormLabel>
                    <Input
                      value={formData.duration}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                      placeholder="e.g., 2 hours"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Price</FormLabel>
                    <Input
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="0.00"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Currency</FormLabel>
                    <Select
                      value={formData.currency}
                      onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                    </Select>
                  </FormControl>
                </HStack>

                <HStack spacing={4} w="full">
                  <FormControl>
                    <FormLabel>Location</FormLabel>
                    <Select
                      value={formData.location_id || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, location_id: e.target.value ? parseInt(e.target.value) : null }))}
                    >
                      <option value="">Select Location</option>
                      {locations?.map(location => (
                        <option key={location.id} value={location.id}>
                          {location.island}, {location.atoll}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Destination</FormLabel>
                    <Select
                      value={formData.destination_id || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, destination_id: e.target.value ? parseInt(e.target.value) : null }))}
                    >
                      <option value="">Select Destination</option>
                      {destinations?.map(destination => (
                        <option key={destination.id} value={destination.id}>
                          {destination.name}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                </HStack>

                <HStack spacing={4} w="full">
                  <FormControl>
                    <FormLabel>Max Participants</FormLabel>
                    <NumberInput
                      value={formData.max_participants}
                      onChange={(_, value) => setFormData(prev => ({ ...prev, max_participants: value }))}
                      min={1}
                      max={100}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Min Age</FormLabel>
                    <NumberInput
                      value={formData.min_age}
                      onChange={(_, value) => setFormData(prev => ({ ...prev, min_age: value }))}
                      min={0}
                      max={18}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                </HStack>

                {/* Includes */}
                <FormControl>
                  <FormLabel>What's Included</FormLabel>
                  <VStack spacing={2} align="stretch">
                    <HStack>
                      <Input
                        value={newInclude}
                        onChange={(e) => setNewInclude(e.target.value)}
                        placeholder="Add included item"
                        onKeyPress={(e) => e.key === 'Enter' && addInclude()}
                      />
                      <Button onClick={addInclude} size="sm">Add</Button>
                    </HStack>
                    <Wrap>
                      {formData.includes.map((item, index) => (
                        <WrapItem key={index}>
                          <Tag colorScheme="green">
                            <TagLabel>{item}</TagLabel>
                            <TagCloseButton onClick={() => removeInclude(index)} />
                          </Tag>
                        </WrapItem>
                      ))}
                    </Wrap>
                  </VStack>
                </FormControl>

                {/* Excludes */}
                <FormControl>
                  <FormLabel>What's Not Included</FormLabel>
                  <VStack spacing={2} align="stretch">
                    <HStack>
                      <Input
                        value={newExclude}
                        onChange={(e) => setNewExclude(e.target.value)}
                        placeholder="Add excluded item"
                        onKeyPress={(e) => e.key === 'Enter' && addExclude()}
                      />
                      <Button onClick={addExclude} size="sm">Add</Button>
                    </HStack>
                    <Wrap>
                      {formData.excludes.map((item, index) => (
                        <WrapItem key={index}>
                          <Tag colorScheme="red">
                            <TagLabel>{item}</TagLabel>
                            <TagCloseButton onClick={() => removeExclude(index)} />
                          </Tag>
                        </WrapItem>
                      ))}
                    </Wrap>
                  </VStack>
                </FormControl>

                {/* Requirements */}
                <FormControl>
                  <FormLabel>Requirements</FormLabel>
                  <VStack spacing={2} align="stretch">
                    <HStack>
                      <Input
                        value={newRequirement}
                        onChange={(e) => setNewRequirement(e.target.value)}
                        placeholder="Add requirement"
                        onKeyPress={(e) => e.key === 'Enter' && addRequirement()}
                      />
                      <Button onClick={addRequirement} size="sm">Add</Button>
                    </HStack>
                    <Wrap>
                      {formData.requirements.map((item, index) => (
                        <WrapItem key={index}>
                          <Tag colorScheme="blue">
                            <TagLabel>{item}</TagLabel>
                            <TagCloseButton onClick={() => removeRequirement(index)} />
                          </Tag>
                        </WrapItem>
                      ))}
                    </Wrap>
                  </VStack>
                </FormControl>

                {/* Settings */}
                <HStack spacing={4} w="full">
                  <FormControl>
                    <FormLabel>Featured</FormLabel>
                    <Select
                      value={formData.is_featured ? 'true' : 'false'}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.value === 'true' }))}
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Status</FormLabel>
                    <Select
                      value={formData.is_active ? 'true' : 'false'}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.value === 'true' }))}
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </Select>
                  </FormControl>
                </HStack>

                {/* Actions */}
                <HStack spacing={4} w="full" justify="flex-end">
                  <Button onClick={onClose}>Cancel</Button>
                  <Button 
                    colorScheme="blue" 
                    onClick={handleSubmit}
                    isLoading={createExperience.isPending || updateExperience.isPending}
                    loadingText={isCreating ? 'Creating...' : 'Updating...'}
                  >
                    {isCreating ? 'Create' : 'Update'}
                  </Button>
                </HStack>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Container>
    </Box>
  );
}
