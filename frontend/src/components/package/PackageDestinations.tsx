import React from 'react';
import {
  Box,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  VStack,
  HStack,
  List,
  ListItem,
  ListIcon,
  Badge,
  Icon,
  SimpleGrid,
  Image,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import {
  CheckCircleIcon,
  MapPinIcon,
  ClockIcon,
  StarIcon,
  GlobeAltIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';
import { LazyImage } from '../LazyImage';
import type { PackageDestination } from '../../types';

interface PackageDestinationsProps {
  destinations: PackageDestination[];
}

export function PackageDestinations({ destinations }: PackageDestinationsProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedDestination, setSelectedDestination] = React.useState<PackageDestination | null>(null);

  if (!destinations || destinations.length === 0) {
    return null;
  }

  const handleDestinationClick = (destination: PackageDestination) => {
    setSelectedDestination(destination);
    onOpen();
  };

  const getDestinationColor = (index: number) => {
    const colors = ['blue', 'green', 'purple', 'orange', 'teal', 'pink'];
    return colors[index % colors.length];
  };

  return (
    <>
      <Card>
        <CardHeader>
          <HStack justify="space-between" align="center">
            <Heading size="md" color="gray.800">Destinations</Heading>
            <Badge colorScheme="blue" variant="subtle" fontSize="sm">
              {destinations.length} locations
            </Badge>
          </HStack>
        </CardHeader>
        <CardBody>
          <VStack spacing={6} align="stretch">
            {destinations.map((dest, index) => {
              const colorScheme = getDestinationColor(index);
              const location = dest.location;
              
              return (
                <Box
                  key={dest.id || index}
                  p={6}
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="xl"
                  bg="white"
                  _hover={{ 
                    borderColor: `${colorScheme}.300`,
                    boxShadow: 'lg',
                    transform: 'translateY(-2px)'
                  }}
                  transition="all 0.3s"
                  cursor="pointer"
                  onClick={() => handleDestinationClick(dest)}
                >
                  <HStack justify="space-between" align="start" mb={4}>
                    <VStack align="start" spacing={2}>
                      <HStack spacing={3}>
                        <Badge colorScheme={colorScheme} variant="solid" fontSize="sm" px={3} py={1}>
                          Destination {index + 1}
                        </Badge>
                        <Badge colorScheme="blue" variant="subtle">
                          {dest.duration} day{dest.duration > 1 ? 's' : ''}
                        </Badge>
                      </HStack>
                      
                      <VStack align="start" spacing={1}>
                        <HStack spacing={2}>
                          <Icon as={MapPinIcon} h={4} w={4} color={`${colorScheme}.500`} />
                          <Text fontWeight="semibold" color="gray.800" fontSize="lg">
                            {location?.island || `Destination ${index + 1}`}
                          </Text>
                        </HStack>
                        
                        {location?.atoll && (
                          <Text fontSize="sm" color="gray.600" ml={6}>
                            {location.atoll} Atoll
                          </Text>
                        )}
                      </VStack>
                    </VStack>
                    
                    <Icon as={ArrowTopRightOnSquareIcon} h={5} w={5} color="gray.400" />
                  </HStack>

                  {dest.description && (
                    <Text fontSize="sm" color="gray.600" mb={4} lineHeight="1.6">
                      {dest.description}
                    </Text>
                  )}

                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    {/* Highlights */}
                    {dest.highlights && dest.highlights.length > 0 && (
                      <Box>
                        <HStack spacing={2} mb={3}>
                          <Icon as={StarIcon} h={4} w={4} color={`${colorScheme}.500`} />
                          <Text fontSize="sm" fontWeight="medium" color="gray.700">
                            Highlights
                          </Text>
                        </HStack>
                        <List spacing={2}>
                          {dest.highlights.slice(0, 3).map((highlight, hIndex) => (
                            <ListItem key={hIndex} fontSize="sm" color="gray.600">
                              <ListIcon as={CheckCircleIcon} color={`${colorScheme}.500`} />
                              {highlight}
                            </ListItem>
                          ))}
                          {dest.highlights.length > 3 && (
                            <Text fontSize="xs" color="gray.500" ml={6}>
                              +{dest.highlights.length - 3} more highlights
                            </Text>
                          )}
                        </List>
                      </Box>
                    )}

                    {/* Activities */}
                    {dest.activities && dest.activities.length > 0 && (
                      <Box>
                        <HStack spacing={2} mb={3}>
                          <Icon as={GlobeAltIcon} h={4} w={4} color={`${colorScheme}.500`} />
                          <Text fontSize="sm" fontWeight="medium" color="gray.700">
                            Activities
                          </Text>
                        </HStack>
                        <List spacing={2}>
                          {dest.activities.slice(0, 3).map((activity, aIndex) => (
                            <ListItem key={aIndex} fontSize="sm" color="gray.600">
                              <ListIcon as={CheckCircleIcon} color={`${colorScheme}.500`} />
                              {activity}
                            </ListItem>
                          ))}
                          {dest.activities.length > 3 && (
                            <Text fontSize="xs" color="gray.500" ml={6}>
                              +{dest.activities.length - 3} more activities
                            </Text>
                          )}
                        </List>
                      </Box>
                    )}
                  </SimpleGrid>

                  {/* Location Details */}
                  {location && (
                    <HStack spacing={4} mt={4} p={3} bg="gray.50" borderRadius="md">
                      {location.latitude && location.longitude && (
                        <HStack spacing={2}>
                          <Icon as={MapPinIcon} h={4} w={4} color="gray.500" />
                          <Text fontSize="xs" color="gray.600">
                            {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                          </Text>
                        </HStack>
                      )}
                      
                      <HStack spacing={2}>
                        <Icon as={ClockIcon} h={4} w={4} color="gray.500" />
                        <Text fontSize="xs" color="gray.600">
                          {dest.duration} day{dest.duration > 1 ? 's' : ''} stay
                        </Text>
                      </HStack>
                    </HStack>
                  )}
                </Box>
              );
            })}
          </VStack>
        </CardBody>
      </Card>

      {/* Destination Detail Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="2xl" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedDestination?.location?.island || 'Destination Details'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedDestination && (
              <VStack spacing={6} align="stretch">
                {/* Location Image */}
                {selectedDestination.location?.image && (
                  <Box borderRadius="lg" overflow="hidden" h="200px">
                    <LazyImage
                      src={selectedDestination.location.image}
                      alt={selectedDestination.location.island || 'Destination'}
                      w="full"
                      h="full"
                      objectFit="cover"
                      fallbackSrc="/placeholder-image.jpg"
                    />
                  </Box>
                )}

                {/* Location Info */}
                <Box>
                  <HStack spacing={3} mb={3}>
                    <Badge colorScheme="blue" variant="solid">
                      {selectedDestination.duration} day{selectedDestination.duration > 1 ? 's' : ''}
                    </Badge>
                    {selectedDestination.location?.atoll && (
                      <Badge colorScheme="green" variant="subtle">
                        {selectedDestination.location.atoll} Atoll
                      </Badge>
                    )}
                  </HStack>
                  
                  {selectedDestination.description && (
                    <Text color="gray.700" lineHeight="1.6" mb={4}>
                      {selectedDestination.description}
                    </Text>
                  )}
                </Box>

                {/* Highlights */}
                {selectedDestination.highlights && selectedDestination.highlights.length > 0 && (
                  <Box>
                    <Text fontWeight="semibold" color="gray.800" mb={3}>
                      Highlights
                    </Text>
                    <List spacing={2}>
                      {selectedDestination.highlights.map((highlight, index) => (
                        <ListItem key={index} fontSize="sm" color="gray.600">
                          <ListIcon as={CheckCircleIcon} color="green.500" />
                          {highlight}
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {/* Activities */}
                {selectedDestination.activities && selectedDestination.activities.length > 0 && (
                  <Box>
                    <Text fontWeight="semibold" color="gray.800" mb={3}>
                      Activities
                    </Text>
                    <List spacing={2}>
                      {selectedDestination.activities.map((activity, index) => (
                        <ListItem key={index} fontSize="sm" color="gray.600">
                          <ListIcon as={CheckCircleIcon} color="blue.500" />
                          {activity}
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {/* Location Details */}
                {selectedDestination.location && (
                  <Box p={4} bg="gray.50" borderRadius="md">
                    <Text fontWeight="semibold" color="gray.800" mb={3}>
                      Location Details
                    </Text>
                    <SimpleGrid columns={2} spacing={4}>
                      {selectedDestination.location.latitude && selectedDestination.location.longitude && (
                        <HStack spacing={2}>
                          <Icon as={MapPinIcon} h={4} w={4} color="gray.500" />
                          <VStack align="start" spacing={0}>
                            <Text fontSize="xs" color="gray.500">Coordinates</Text>
                            <Text fontSize="sm" fontWeight="medium" color="gray.700">
                              {selectedDestination.location.latitude.toFixed(4)}, {selectedDestination.location.longitude.toFixed(4)}
                            </Text>
                          </VStack>
                        </HStack>
                      )}
                      
                      <HStack spacing={2}>
                        <Icon as={ClockIcon} h={4} w={4} color="gray.500" />
                        <VStack align="start" spacing={0}>
                          <Text fontSize="xs" color="gray.500">Duration</Text>
                          <Text fontSize="sm" fontWeight="medium" color="gray.700">
                            {selectedDestination.duration} day{selectedDestination.duration > 1 ? 's' : ''}
                          </Text>
                        </VStack>
                      </HStack>
                    </SimpleGrid>
                  </Box>
                )}
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
