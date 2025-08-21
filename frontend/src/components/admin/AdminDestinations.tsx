import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Switch,
  useToast,
  Image,
  Skeleton,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { useDestinations } from '../../hooks/useQueries';
import { LoadingSpinner } from '../LoadingSpinner';
import type { Destination } from '../../types';

interface DestinationFormData {
  name: string;
  description: string;
  island: string;
  atoll: string;
  latitude?: number;
  longitude?: number;
  is_featured: boolean;
  is_active: boolean;
}

export function AdminDestinations() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingDestination, setEditingDestination] = useState<Destination | null>(null);
  const [formData, setFormData] = useState<DestinationFormData>({
    name: '',
    description: '',
    island: '',
    atoll: '',
    latitude: undefined,
    longitude: undefined,
    is_featured: false,
    is_active: true,
  });
  const toast = useToast();
  
  const { data: destinations, isLoading, error, refetch } = useDestinations();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');

  const handleEdit = (destination: Destination) => {
    setEditingDestination(destination);
    setFormData({
      name: destination.name,
      description: destination.description,
      island: destination.island,
      atoll: destination.atoll,
      latitude: destination.latitude || undefined,
      longitude: destination.longitude || undefined,
      is_featured: destination.is_featured,
      is_active: destination.is_active,
    });
    onOpen();
  };

  const handleCreate = () => {
    setEditingDestination(null);
    setFormData({
      name: '',
      description: '',
      island: '',
      atoll: '',
      latitude: undefined,
      longitude: undefined,
      is_featured: false,
      is_active: true,
    });
    onOpen();
  };

  const handleSubmit = async () => {
    try {
      const url = editingDestination 
        ? `/api/destinations/${editingDestination.id}/`
        : '/api/destinations/';
      
      const method = editingDestination ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access')}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save destination');
      }

      toast({
        title: editingDestination ? 'Destination updated' : 'Destination created',
        status: 'success',
        duration: 3000,
      });

      onClose();
      refetch();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Something went wrong',
        status: 'error',
        duration: 5000,
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this destination?')) {
      return;
    }

    try {
      const response = await fetch(`/api/destinations/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete destination');
      }

      toast({
        title: 'Destination deleted',
        status: 'success',
        duration: 3000,
      });

      refetch();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Something went wrong',
        status: 'error',
        duration: 5000,
      });
    }
  };

  if (isLoading) {
    return (
      <Box className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxW="7xl" py={8}>
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Error loading destinations!</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : 'Something went wrong'}
          </AlertDescription>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxW="7xl" py={8}>
      <VStack spacing={8} align="stretch">
        <HStack justify="space-between">
          <VStack align="start" spacing={2}>
            <Text fontSize="2xl" fontWeight="bold" color={textColor}>
              Manage Destinations
            </Text>
            <Text color="gray.600">
              Create and manage Maldives destinations
            </Text>
          </VStack>
          <Button
            leftIcon={<PlusIcon className="w-5 h-5" />}
            colorScheme="blue"
            onClick={handleCreate}
          >
            Add Destination
          </Button>
        </HStack>

        <Box bg={bgColor} border="1px solid" borderColor={borderColor} borderRadius="lg" overflow="hidden">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Island</Th>
                <Th>Atoll</Th>
                <Th>Properties</Th>
                <Th>Packages</Th>
                <Th>Status</Th>
                <Th>Featured</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {destinations?.map((destination) => (
                <Tr key={destination.id}>
                  <Td>
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="medium">{destination.name}</Text>
                      <Text fontSize="sm" color="gray.500" noOfLines={2}>
                        {destination.description}
                      </Text>
                    </VStack>
                  </Td>
                  <Td>{destination.island}</Td>
                  <Td>{destination.atoll}</Td>
                  <Td>
                    <Badge colorScheme="blue">{destination.property_count}</Badge>
                  </Td>
                  <Td>
                    <Badge colorScheme="green">{destination.package_count}</Badge>
                  </Td>
                  <Td>
                    <Badge colorScheme={destination.is_active ? 'green' : 'red'}>
                      {destination.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </Td>
                  <Td>
                    {destination.is_featured ? (
                      <StarSolidIcon className="w-5 h-5 text-yellow-400" />
                    ) : (
                      <StarIcon className="w-5 h-5 text-gray-400" />
                    )}
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      <IconButton
                        size="sm"
                        icon={<PencilIcon className="w-4 h-4" />}
                        aria-label="Edit"
                        onClick={() => handleEdit(destination)}
                      />
                      <IconButton
                        size="sm"
                        icon={<TrashIcon className="w-4 h-4" />}
                        aria-label="Delete"
                        colorScheme="red"
                        variant="outline"
                        onClick={() => handleDelete(destination.id)}
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        {/* Create/Edit Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {editingDestination ? 'Edit Destination' : 'Create Destination'}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Name</FormLabel>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Destination name"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Destination description"
                    rows={3}
                  />
                </FormControl>

                <HStack spacing={4} w="full">
                  <FormControl>
                    <FormLabel>Island</FormLabel>
                    <Input
                      value={formData.island}
                      onChange={(e) => setFormData({ ...formData, island: e.target.value })}
                      placeholder="Island name"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Atoll</FormLabel>
                    <Input
                      value={formData.atoll}
                      onChange={(e) => setFormData({ ...formData, atoll: e.target.value })}
                      placeholder="Atoll name"
                    />
                  </FormControl>
                </HStack>

                <HStack spacing={4} w="full">
                  <FormControl>
                    <FormLabel>Latitude</FormLabel>
                    <Input
                      type="number"
                      step="any"
                      value={formData.latitude || ''}
                      onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) || undefined })}
                      placeholder="Latitude"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Longitude</FormLabel>
                    <Input
                      type="number"
                      step="any"
                      value={formData.longitude || ''}
                      onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) || undefined })}
                      placeholder="Longitude"
                    />
                  </FormControl>
                </HStack>

                <HStack spacing={6} w="full">
                  <FormControl display="flex" alignItems="center">
                    <FormLabel mb="0">Featured</FormLabel>
                    <Switch
                      isChecked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    />
                  </FormControl>

                  <FormControl display="flex" alignItems="center">
                    <FormLabel mb="0">Active</FormLabel>
                    <Switch
                      isChecked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    />
                  </FormControl>
                </HStack>

                <HStack spacing={4} w="full" pt={4}>
                  <Button onClick={onClose} flex={1}>
                    Cancel
                  </Button>
                  <Button colorScheme="blue" onClick={handleSubmit} flex={1}>
                    {editingDestination ? 'Update' : 'Create'}
                  </Button>
                </HStack>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </Container>
  );
}
