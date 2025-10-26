import React from 'react';
import { GiftIcon, MapPinIcon, CalendarIcon, CurrencyDollarIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
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
  Image,
  SimpleGrid,
  List,
  ListItem,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
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

  const images = (pkg as any).images || [];
  const destinations = (pkg as any).destinations || [];
  const itinerary = (pkg as any).itinerary || [];
  const activities = (pkg as any).activities || [];
  const inclusions = (pkg as any).inclusions || [];
  const experiences = (pkg as any).experiences || [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl" scrollBehavior="inside">
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent maxW="6xl" mx={4}>
        <ModalHeader borderBottom="1px solid" borderColor="gray.200" pb={4}>
          <Flex alignItems="center" justify="space-between">
            <Box>
              <Heading size="lg" color="gray.800">
                {pkg.name}
              </Heading>
              <Text color="gray.600" mt={1} noOfLines={2}>
                {pkg.description}
              </Text>
            </Box>
            <ModalCloseButton position="static" size="lg" />
          </Flex>
        </ModalHeader>
        <ModalBody p={6}>
          <VStack spacing={8} align="stretch">
            {/* Images */}
            {images.length > 0 && (
              <Box>
                <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} gap={3}>
                  {images.map((img: any) => (
                    <Image key={img.id || img.image} src={img.image} alt={img.caption || pkg.name} borderRadius="md" objectFit="cover" h="160px" />
                  ))}
                </SimpleGrid>
              </Box>
            )}

            {/* Summary */}
            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6}>
              <VStack align="start" spacing={3}>
                <HStack spacing={4}>
                  <Box>
                    <Text fontSize="sm" fontWeight="medium" color="gray.500">Final Price</Text>
                    <Text fontSize="lg" fontWeight="bold" color="purple.600">
                      {formatPrice(parseFloat(pkg.price as any))}
                    </Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" fontWeight="medium" color="gray.500">Duration</Text>
                    <Text fontSize="lg" fontWeight="semibold" color="gray.800">{pkg.duration} days</Text>
                  </Box>
                </HStack>
                {(pkg as any).original_price && parseFloat((pkg as any).original_price) > parseFloat(pkg.price as any) && (
                  <Text fontSize="sm" color="gray.500" textDecoration="line-through">
                    {formatPrice(parseFloat((pkg as any).original_price))}
                  </Text>
                )}
                {(pkg as any).discount_percentage && (pkg as any).discount_percentage > 0 && (
                  <Badge colorScheme="green" variant="subtle" fontSize="sm">{(pkg as any).discount_percentage}% OFF</Badge>
                )}
                <Badge colorScheme={(pkg as any).is_featured ? 'purple' : 'gray'} variant="subtle" fontSize="sm">
                  {(pkg as any).is_featured ? 'Featured' : 'Standard'}
                </Badge>
              </VStack>
              <VStack align="start" spacing={2}>
                {(pkg as any).start_date && (
                  <HStack>
                    <Icon as={CalendarIcon} h={4} w={4} color="gray.500" />
                    <Text>Start: {new Date((pkg as any).start_date).toLocaleDateString()}</Text>
                  </HStack>
                )}
                {(pkg as any).end_date && (
                  <HStack>
                    <Icon as={CalendarIcon} h={4} w={4} color="gray.500" />
                    <Text>End: {new Date((pkg as any).end_date).toLocaleDateString()}</Text>
                  </HStack>
                )}
                {(pkg as any).category && <Text>Category: {(pkg as any).category}</Text>}
                {(pkg as any).difficulty_level && <Text>Difficulty: {(pkg as any).difficulty_level}</Text>}
              </VStack>
            </Grid>

            <Tabs variant="enclosed" colorScheme="purple">
              <TabList>
                <Tab>Destinations ({destinations.length})</Tab>
                <Tab>Itinerary ({itinerary.length})</Tab>
                <Tab>Activities ({activities.length})</Tab>
                <Tab>Experiences ({experiences.length})</Tab>
                <Tab>Inclusions ({inclusions.length})</Tab>
                <Tab>Accommodation</Tab>
                <Tab>Additional</Tab>
              </TabList>
              <TabPanels>
                {/* Destinations */}
                <TabPanel>
                  {destinations.length === 0 ? (
                    <Text color="gray.500">No destinations.</Text>
                  ) : (
                    <VStack align="stretch" spacing={4}>
                      {destinations.map((d: any) => (
                        <Box key={d.id} p={4} border="1px solid" borderColor="gray.200" borderRadius="md">
                          <HStack justify="space-between">
                            <Text fontWeight="semibold">{d.location?.island}{d.location?.atoll ? `, ${d.location.atoll}` : ''}</Text>
                            <Badge>{d.duration} days</Badge>
                          </HStack>
                          {d.description && <Text mt={2} color="gray.600">{d.description}</Text>}
                          {(d.highlights || []).length > 0 && (
                            <Box mt={2}>
                              <Text fontWeight="medium">Highlights:</Text>
                              <List spacing={1} mt={1}>
                                {(d.highlights || []).map((h: string, idx: number) => (
                                  <ListItem key={idx}>
                                    <HStack spacing={2}>
                                      <Icon as={CheckCircleIcon} h={4} w={4} color="green.500" />
                                      <Text>{h}</Text>
                                    </HStack>
                                  </ListItem>
                                ))}
                              </List>
                            </Box>
                          )}
                        </Box>
                      ))}
                    </VStack>
                  )}
                </TabPanel>

                {/* Itinerary */}
                <TabPanel>
                  {itinerary.length === 0 ? (
                    <Text color="gray.500">No itinerary.</Text>
                  ) : (
                    <VStack align="stretch" spacing={4}>
                      {itinerary.map((i: any) => (
                        <Box key={`${i.day}-${i.title}`} p={4} border="1px solid" borderColor="gray.200" borderRadius="md">
                          <HStack justify="space-between">
                            <Text fontWeight="semibold">Day {i.day}: {i.title}</Text>
                            {(i.meals || []).length > 0 && <Badge>Meals: {(i.meals || []).join(', ')}</Badge>}
                          </HStack>
                          {i.description && <Text mt={2} color="gray.600">{i.description}</Text>}
                          {(i.activities || []).length > 0 && (
                            <Text mt={1} fontSize="sm" color="gray.700">Activities: {(i.activities || []).join(', ')}</Text>
                          )}
                        </Box>
                      ))}
                    </VStack>
                  )}
                </TabPanel>

                {/* Activities */}
                <TabPanel>
                  {activities.length === 0 ? (
                    <Text color="gray.500">No activities.</Text>
                  ) : (
                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                      {activities.map((a: any) => (
                        <Box key={a.id || a.name} p={4} border="1px solid" borderColor="gray.200" borderRadius="md">
                          <Text fontWeight="semibold">{a.name}</Text>
                          {a.description && <Text color="gray.600">{a.description}</Text>}
                          <HStack mt={1} spacing={3}>
                            {a.duration && <Badge>{a.duration}</Badge>}
                            {a.difficulty && <Badge>{a.difficulty}</Badge>}
                            {a.category && <Badge>{a.category}</Badge>}
                          </HStack>
                        </Box>
                      ))}
                    </SimpleGrid>
                  )}
                </TabPanel>

                {/* Experiences */}
                <TabPanel>
                  {experiences.length === 0 ? (
                    <Text color="gray.500">No experiences.</Text>
                  ) : (
                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                      {experiences.map((e: any) => (
                        <Box key={e.id || e.name} p={4} border="1px solid" borderColor="gray.200" borderRadius="md">
                          <Text fontWeight="semibold">{e.name}</Text>
                          {e.description && <Text color="gray.600">{e.description}</Text>}
                          <HStack mt={1} spacing={3}>
                            {e.duration && <Badge>{e.duration}</Badge>}
                            <Badge>experience</Badge>
                          </HStack>
                        </Box>
                      ))}
                    </SimpleGrid>
                  )}
                </TabPanel>

                {/* Inclusions */}
                <TabPanel>
                  {inclusions.length === 0 ? (
                    <Text color="gray.500">No inclusions.</Text>
                  ) : (
                    <VStack align="stretch" spacing={3}>
                      {inclusions.map((inc: any, idx: number) => (
                        <HStack key={idx} justify="space-between" p={3} border="1px solid" borderColor="gray.200" borderRadius="md">
                          <Text>{inc.item}</Text>
                          <Badge colorScheme={inc.category === 'included' ? 'green' : inc.category === 'optional' ? 'blue' : 'red'}>
                            {inc.category}
                          </Badge>
                        </HStack>
                      ))}
                    </VStack>
                  )}
                </TabPanel>

                {/* Accommodation */}
                <TabPanel>
                  <VStack align="start" spacing={2}>
                    <Text>Accommodation: {(pkg as any).accommodation_type || '-'}</Text>
                    <Text>Room Type: {(pkg as any).room_type || '-'}</Text>
                    <Text>Meal Plan: {(pkg as any).meal_plan || '-'}</Text>
                    <Text>Transportation: {(pkg as any).transportation_details || '-'}</Text>
                    <Text>Airport Transfers: {((pkg as any).airport_transfers ? 'Yes' : 'No')}</Text>
                  </VStack>
                </TabPanel>

                {/* Additional */}
                <TabPanel>
                  <VStack align="start" spacing={2}>
                    <Text>Best Time to Visit: {(pkg as any).best_time_to_visit || '-'}</Text>
                    {(pkg as any).weather_info && <Text>Weather: {(pkg as any).weather_info}</Text>}
                    {(pkg as any).what_to_bring && (pkg as any).what_to_bring.length > 0 && (
                      <Box>
                        <Text fontWeight="semibold">What to bring</Text>
                        <List spacing={1} mt={1}>
                          {(pkg as any).what_to_bring.map((w: string, i: number) => (
                            <ListItem key={i}>
                              <HStack spacing={2}>
                                <Icon as={CheckCircleIcon} h={4} w={4} color="green.500" />
                                <Text>{w}</Text>
                              </HStack>
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    )}
                    {(pkg as any).important_notes && (pkg as any).important_notes.length > 0 && (
                      <Box>
                        <Text fontWeight="semibold">Important notes</Text>
                        <List spacing={1} mt={1}>
                          {(pkg as any).important_notes.map((n: string, i: number) => (
                            <ListItem key={i}>
                              <HStack spacing={2}>
                                <Icon as={CheckCircleIcon} h={4} w={4} color="green.500" />
                                <Text>{n}</Text>
                              </HStack>
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    )}
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>

            <Divider />
            <Flex justify="flex-end">
              <Button colorScheme="purple" onClick={onClose}>Close</Button>
            </Flex>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
