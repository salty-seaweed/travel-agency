import React from 'react';
import { GiftIcon, MapPinIcon, CalendarIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  HStack,
  Text,
  Icon,
  Box,
  Divider,
  Flex,
  Heading,
  Badge,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import type { Package } from '../../types';
import { formatPrice } from '../../utils';

interface PackageDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  package: Package | null;
}

export function PackageDetailModal({ isOpen, onClose, package: pkg }: PackageDetailModalProps) {
  if (!pkg) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent maxW="4xl" mx={4}>
        <ModalHeader borderBottom="1px solid" borderColor="gray.200" pb={4}>
          <Flex alignItems="center" justify="space-between">
            <Box>
              <Heading size="lg" color="gray.800">
                Package Details
              </Heading>
              <Text color="gray.600" mt={1}>
                View package information and properties
              </Text>
            </Box>
            <ModalCloseButton position="static" size="lg" />
          </Flex>
        </ModalHeader>
        
        <ModalBody p={6}>
          <VStack spacing={6} align="stretch">
            {/* Basic Information */}
            <Box>
              <Heading size="md" color="gray.700" mb={4}>
                Basic Information
              </Heading>
              <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6}>
                <VStack align="start" spacing={3}>
                  <Box>
                    <Text fontSize="sm" fontWeight="medium" color="gray.500">Package Name</Text>
                    <Text fontSize="lg" fontWeight="semibold" color="gray.800">{pkg.name}</Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" fontWeight="medium" color="gray.500">Description</Text>
                    <Text fontSize="md" color="gray.700">{pkg.description}</Text>
                  </Box>
                </VStack>
                                 <VStack align="start" spacing={3}>
                   <HStack spacing={4}>
                     <Box>
                       <Text fontSize="sm" fontWeight="medium" color="gray.500">Final Price</Text>
                       <Text fontSize="lg" fontWeight="bold" color="purple.600">
                         {formatPrice(parseFloat(pkg.price))}
                       </Text>
                       {pkg.original_price && parseFloat(pkg.original_price) > parseFloat(pkg.price) && (
                         <Text fontSize="sm" color="gray.500" textDecoration="line-through">
                           {formatPrice(parseFloat(pkg.original_price))}
                         </Text>
                       )}
                     </Box>
                     <Box>
                       <Text fontSize="sm" fontWeight="medium" color="gray.500">Duration</Text>
                       <Text fontSize="lg" fontWeight="semibold" color="gray.800">
                         {pkg.duration} days
                       </Text>
                     </Box>
                   </HStack>
                   {pkg.discount_percentage && pkg.discount_percentage > 0 && (
                     <Box>
                       <Text fontSize="sm" fontWeight="medium" color="gray.500">Discount</Text>
                       <Badge colorScheme="green" variant="subtle" fontSize="sm">
                         {pkg.discount_percentage}% OFF
                       </Badge>
                     </Box>
                   )}
                  <Box>
                    <Text fontSize="sm" fontWeight="medium" color="gray.500">Status</Text>
                    <Badge 
                      colorScheme={pkg.is_featured ? 'purple' : 'gray'} 
                      variant="subtle"
                      fontSize="sm"
                    >
                      {pkg.is_featured ? 'Featured' : 'Standard'}
                    </Badge>
                  </Box>
                </VStack>
              </Grid>
            </Box>

            <Divider />

            {/* Properties */}
            <Box>
              <Heading size="md" color="gray.700" mb={4}>
                Included Properties ({pkg.properties?.length || 0})
              </Heading>
              {pkg.properties && pkg.properties.length > 0 ? (
                <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                  {pkg.properties.map((property: any) => (
                    <Box 
                      key={property.id} 
                      p={4} 
                      border="1px solid" 
                      borderColor="gray.200" 
                      borderRadius="lg"
                      bg="gray.50"
                    >
                      <VStack align="start" spacing={2}>
                        <Text fontWeight="semibold" color="gray.800">
                          {property.name}
                        </Text>
                        <Text fontSize="sm" color="gray.600" noOfLines={2}>
                          {property.description}
                        </Text>
                        <HStack spacing={4}>
                          <HStack spacing={1}>
                            <Icon as={CurrencyDollarIcon} h={4} w={4} color="gray.500" />
                            <Text fontSize="sm" color="gray.600">
                              ${property.price_per_night}/night
                            </Text>
                          </HStack>
                          {property.location && (
                            <HStack spacing={1}>
                              <Icon as={MapPinIcon} h={4} w={4} color="gray.500" />
                              <Text fontSize="sm" color="gray.600">
                                {property.location.island}
                              </Text>
                            </HStack>
                          )}
                        </HStack>
                      </VStack>
                    </Box>
                  ))}
                </Grid>
              ) : (
                <Box textAlign="center" py={8}>
                  <Icon as={GiftIcon} h={12} w={12} color="gray.300" mx="auto" mb={4} />
                  <Text color="gray.500">No properties included in this package</Text>
                </Box>
              )}
            </Box>

            {/* Schedule */}
            {(pkg.start_date || pkg.end_date) && (
              <>
                <Divider />
                <Box>
                  <Heading size="md" color="gray.700" mb={4}>
                    Schedule
                  </Heading>
                  <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6}>
                    {pkg.start_date && (
                      <Box>
                        <Text fontSize="sm" fontWeight="medium" color="gray.500">Start Date</Text>
                        <HStack spacing={2}>
                          <Icon as={CalendarIcon} h={4} w={4} color="gray.500" />
                          <Text fontSize="md" color="gray.800">
                            {new Date(pkg.start_date).toLocaleDateString()}
                          </Text>
                        </HStack>
                      </Box>
                    )}
                    {pkg.end_date && (
                      <Box>
                        <Text fontSize="sm" fontWeight="medium" color="gray.500">End Date</Text>
                        <HStack spacing={2}>
                          <Icon as={CalendarIcon} h={4} w={4} color="gray.500" />
                          <Text fontSize="md" color="gray.800">
                            {new Date(pkg.end_date).toLocaleDateString()}
                          </Text>
                        </HStack>
                      </Box>
                    )}
                  </Grid>
                </Box>
              </>
            )}

            {/* Action Buttons */}
            <Divider />
            <Flex justify="flex-end">
              <Button
                colorScheme="purple"
                onClick={onClose}
              >
                Close
              </Button>
            </Flex>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
