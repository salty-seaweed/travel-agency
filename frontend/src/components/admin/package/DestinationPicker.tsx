import React, { useState } from 'react';
import {
  VStack,
  HStack,
  Box,
  Text,
  Button,
  Input,
  Badge,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  SimpleGrid,
  Card,
  CardBody,
  Image,
  useToast,
} from '@chakra-ui/react';
import { PlusIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useDestinations } from '../../../hooks/useQueries';
import type { Destination } from '../../../types';

interface PackageDestination {
  destination: Destination;
  duration: number;
  description: string;
  highlights: string[];
  activities: string[];
}

interface DestinationPickerProps {
  selectedDestinations: PackageDestination[];
  onDestinationsChange: (destinations: PackageDestination[]) => void;
}

export function DestinationPicker({ selectedDestinations, onDestinationsChange }: DestinationPickerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: destinations, isLoading } = useDestinations();
  const toast = useToast();

  const filteredDestinations = destinations?.filter(dest => 
    dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dest.island.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dest.atoll.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const addDestination = (destination: Destination) => {
    // Check if destination is already selected
    const isAlreadySelected = selectedDestinations.some(
      selected => selected.destination.id === destination.id
    );

    if (isAlreadySelected) {
      toast({
        title: 'Destination already added',
        description: `${destination.name} is already included in this package`,
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const newPackageDestination: PackageDestination = {
      destination,
      duration: 1,
      description: destination.description,
      highlights: [],
      activities: [],
    };

    onDestinationsChange([...selectedDestinations, newPackageDestination]);
    onClose();
  };

  const removeDestination = (destinationId: number) => {
    const newDestinations = selectedDestinations.filter(
      dest => dest.destination.id !== destinationId
    );
    onDestinationsChange(newDestinations);
  };

  const updateDestination = (destinationId: number, field: keyof PackageDestination, value: any) => {
    const newDestinations = selectedDestinations.map(dest => {
      if (dest.destination.id === destinationId) {
        return { ...dest, [field]: value };
      }
      return dest;
    });
    onDestinationsChange(newDestinations);
  };

  const updateArrayField = (destinationId: number, field: 'highlights' | 'activities', index: number, value: string) => {
    const newDestinations = selectedDestinations.map(dest => {
      if (dest.destination.id === destinationId) {
        const newArray = [...dest[field]];
        newArray[index] = value;
        return { ...dest, [field]: newArray };
      }
      return dest;
    });
    onDestinationsChange(newDestinations);
  };

  const addArrayItem = (destinationId: number, field: 'highlights' | 'activities') => {
    const newDestinations = selectedDestinations.map(dest => {
      if (dest.destination.id === destinationId) {
        return { ...dest, [field]: [...dest[field], ''] };
      }
      return dest;
    });
    onDestinationsChange(newDestinations);
  };

  const removeArrayItem = (destinationId: number, field: 'highlights' | 'activities', index: number) => {
    const newDestinations = selectedDestinations.map(dest => {
      if (dest.destination.id === destinationId) {
        const newArray = dest[field].filter((_, i) => i !== index);
        return { ...dest, [field]: newArray };
      }
      return dest;
    });
    onDestinationsChange(newDestinations);
  };

  return (
    <VStack spacing={6} align="stretch">
      {/* Header */}
      <HStack justify="space-between">
        <VStack align="start" spacing={1}>
          <Text fontSize="lg" fontWeight="semibold" color="gray.800">
            Package Destinations
          </Text>
          <Text fontSize="sm" color="gray.600">
            Select destinations and customize their details for this package
          </Text>
        </VStack>
        <Button
          leftIcon={<PlusIcon className="w-4 h-4" />}
          colorScheme="purple"
          onClick={onOpen}
        >
          Add Destination
        </Button>
      </HStack>

      {/* Selected Destinations */}
      {selectedDestinations.length === 0 ? (
        <Box
          p={8}
          border="2px dashed"
          borderColor="gray.300"
          borderRadius="lg"
          textAlign="center"
        >
          <Text color="gray.500" fontSize="lg">
            No destinations selected
          </Text>
          <Text color="gray.400" fontSize="sm" mt={2}>
            Click "Add Destination" to start building your package
          </Text>
        </Box>
      ) : (
        <VStack spacing={4} align="stretch">
          {selectedDestinations.map((packageDest, index) => (
            <Card key={packageDest.destination.id} shadow="sm" border="1px solid" borderColor="gray.200">
              <CardBody>
                <VStack spacing={4} align="stretch">
                  {/* Destination Header */}
                  <HStack justify="space-between">
                    <VStack align="start" spacing={1}>
                      <HStack>
                        <Text fontSize="lg" fontWeight="semibold">
                          {packageDest.destination.name}
                        </Text>
                        <Badge colorScheme="blue" variant="subtle">
                          {packageDest.destination.island}, {packageDest.destination.atoll}
                        </Badge>
                        {packageDest.destination.is_featured && (
                          <Badge colorScheme="yellow" variant="subtle">
                            Featured
                          </Badge>
                        )}
                      </HStack>
                      <Text fontSize="sm" color="gray.600">
                        {packageDest.destination.description}
                      </Text>
                    </VStack>
                    <IconButton
                      icon={<TrashIcon className="w-4 h-4" />}
                      colorScheme="red"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDestination(packageDest.destination.id)}
                      aria-label="Remove destination"
                    />
                  </HStack>

                  {/* Duration */}
                  <HStack>
                    <Text fontSize="sm" fontWeight="medium" minW="100px">
                      Duration (days):
                    </Text>
                    <Input
                      type="number"
                      value={packageDest.duration}
                      onChange={(e) => updateDestination(packageDest.destination.id, 'duration', parseInt(e.target.value) || 1)}
                      size="sm"
                      w="100px"
                      min="1"
                    />
                  </HStack>

                  {/* Custom Description */}
                  <Box>
                    <Text fontSize="sm" fontWeight="medium" mb={2}>
                      Custom Description (optional):
                    </Text>
                    <Input
                      value={packageDest.description}
                      onChange={(e) => updateDestination(packageDest.destination.id, 'description', e.target.value)}
                      placeholder="Custom description for this package..."
                      size="sm"
                    />
                  </Box>

                  {/* Highlights */}
                  <Box>
                    <HStack justify="space-between" mb={2}>
                      <Text fontSize="sm" fontWeight="medium">
                        Highlights:
                      </Text>
                      <Button
                        size="xs"
                        leftIcon={<PlusIcon className="w-3 h-3" />}
                        onClick={() => addArrayItem(packageDest.destination.id, 'highlights')}
                      >
                        Add
                      </Button>
                    </HStack>
                    <VStack spacing={2} align="stretch">
                      {packageDest.highlights.map((highlight, highlightIndex) => (
                        <HStack key={highlightIndex}>
                          <Input
                            value={highlight}
                            onChange={(e) => updateArrayField(packageDest.destination.id, 'highlights', highlightIndex, e.target.value)}
                            placeholder="Enter highlight..."
                            size="sm"
                          />
                          <IconButton
                            icon={<TrashIcon className="w-3 h-3" />}
                            size="sm"
                            variant="ghost"
                            colorScheme="red"
                            onClick={() => removeArrayItem(packageDest.destination.id, 'highlights', highlightIndex)}
                            aria-label="Remove highlight"
                          />
                        </HStack>
                      ))}
                    </VStack>
                  </Box>

                  {/* Activities */}
                  <Box>
                    <HStack justify="space-between" mb={2}>
                      <Text fontSize="sm" fontWeight="medium">
                        Activities:
                      </Text>
                      <Button
                        size="xs"
                        leftIcon={<PlusIcon className="w-3 h-3" />}
                        onClick={() => addArrayItem(packageDest.destination.id, 'activities')}
                      >
                        Add
                      </Button>
                    </HStack>
                    <VStack spacing={2} align="stretch">
                      {packageDest.activities.map((activity, activityIndex) => (
                        <HStack key={activityIndex}>
                          <Input
                            value={activity}
                            onChange={(e) => updateArrayField(packageDest.destination.id, 'activities', activityIndex, e.target.value)}
                            placeholder="Enter activity..."
                            size="sm"
                          />
                          <IconButton
                            icon={<TrashIcon className="w-3 h-3" />}
                            size="sm"
                            variant="ghost"
                            colorScheme="red"
                            onClick={() => removeArrayItem(packageDest.destination.id, 'activities', activityIndex)}
                            aria-label="Remove activity"
                          />
                        </HStack>
                      ))}
                    </VStack>
                  </Box>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </VStack>
      )}

      {/* Destination Selection Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select Destinations</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4} align="stretch">
              {/* Search */}
              <Box>
                <Input
                  placeholder="Search destinations by name, island, or atoll..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  leftIcon={<MagnifyingGlassIcon className="w-4 h-4" />}
                  size="lg"
                />
              </Box>

              {/* Destinations Grid */}
              {isLoading ? (
                <Text>Loading destinations...</Text>
              ) : (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                  {filteredDestinations.map((destination) => (
                    <Card
                      key={destination.id}
                      cursor="pointer"
                      _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
                      transition="all 0.2s"
                      onClick={() => addDestination(destination)}
                    >
                      <CardBody>
                        <VStack spacing={3} align="stretch">
                          {destination.image && (
                            <Image
                              src={destination.image}
                              alt={destination.name}
                              borderRadius="md"
                              h="120px"
                              objectFit="cover"
                            />
                          )}
                          <VStack align="start" spacing={1}>
                            <Text fontWeight="semibold" fontSize="md">
                              {destination.name}
                            </Text>
                            <Text fontSize="sm" color="gray.600">
                              {destination.island}, {destination.atoll}
                            </Text>
                            <Text fontSize="xs" color="gray.500" noOfLines={2}>
                              {destination.description}
                            </Text>
                            <HStack>
                              {destination.is_featured && (
                                <Badge colorScheme="yellow" size="sm">
                                  Featured
                                </Badge>
                              )}
                              {destination.is_active ? (
                                <Badge colorScheme="green" size="sm">
                                  Active
                                </Badge>
                              ) : (
                                <Badge colorScheme="gray" size="sm">
                                  Inactive
                                </Badge>
                              )}
                            </HStack>
                          </VStack>
                        </VStack>
                      </CardBody>
                    </Card>
                  ))}
                </SimpleGrid>
              )}

              {filteredDestinations.length === 0 && !isLoading && (
                <Box textAlign="center" py={8}>
                  <Text color="gray.500">No destinations found matching your search.</Text>
                </Box>
              )}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  );
}

