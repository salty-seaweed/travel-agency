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
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Icon,
  SimpleGrid,
  Divider,
} from '@chakra-ui/react';
import {
  CheckCircleIcon,
  ClockIcon,
  MapPinIcon,
  HomeIcon,
  TruckIcon,
  CakeIcon,
} from '@heroicons/react/24/outline';
import { Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverBody, Button, Image as ChakraImage } from '@chakra-ui/react';
import type { PackageItinerary } from '../../types';

interface PackageItineraryProps {
  itinerary: PackageItinerary[];
}

export function PackageItinerary({ itinerary }: PackageItineraryProps) {
  if (!itinerary || itinerary.length === 0) {
    return null;
  }

  const getDayColor = (day: number) => {
    const colors = ['blue', 'green', 'purple', 'orange', 'teal', 'pink', 'cyan'];
    return colors[(day - 1) % colors.length];
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return '';
    try {
      const time = new Date(`2000-01-01T${timeString}`);
      return time.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } catch {
      return timeString;
    }
  };

  return (
    <Card>
      <CardHeader>
        <HStack justify="space-between" align="center">
          <Heading size="md" color="gray.800">Daily Itinerary</Heading>
          <Badge colorScheme="purple" variant="subtle" fontSize="sm">
            {itinerary.length} days
          </Badge>
        </HStack>
      </CardHeader>
      <CardBody>
        <Accordion allowMultiple defaultIndex={[0]}>
          {itinerary.map((day, index) => {
            const dayNumber = day.day || index + 1;
            const colorScheme = getDayColor(dayNumber);
            
            return (
              <AccordionItem key={index} border="1px solid" borderColor="gray.200" borderRadius="md" mb={3}>
                <AccordionButton
                  py={4}
                  _hover={{ bg: `${colorScheme}.50` }}
                  transition="all 0.2s"
                >
                  <Box flex="1" textAlign="left">
                    <HStack spacing={3} align="center">
                      <Badge colorScheme={colorScheme} variant="solid" fontSize="sm" px={2} py={1}>
                        Day {dayNumber}
                      </Badge>
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="semibold" color="gray.800">
                          {day.title || `Day ${dayNumber}`}
                        </Text>
                        {day.description && (
                          <Text fontSize="sm" color="gray.600" noOfLines={1}>
                            {day.description}
                          </Text>
                        )}
                      </VStack>
                    </HStack>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                
                <AccordionPanel pb={6}>
                  <VStack align="start" spacing={4}>
                    {/* Day Description */}
                    {day.description && (
                      <Box w="full">
                        <Text color="gray.700" lineHeight="1.6">
                          {day.description}
                        </Text>
                      </Box>
                    )}
                    
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
                      {/* Activities (only show if no linked experiences) */}
                      {(!day.experience_details || day.experience_details.length === 0) && day.activities && day.activities.length > 0 && (
                        <Box w="full">
                          <HStack spacing={2} mb={3}>
                            <Icon as={ClockIcon} h={4} w={4} color={`${colorScheme}.500`} />
                            <Text fontSize="sm" fontWeight="medium" color="gray.700">
                              Activities
                            </Text>
                          </HStack>
                          <List spacing={2}>
                            {day.activities.map((activity, aIndex) => (
                              <ListItem key={aIndex} fontSize="sm" color="gray.600">
                                <ListIcon as={CheckCircleIcon} color={`${colorScheme}.500`} />
                                {activity}
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      )}
                      
                      {/* Matched Experience Details (rich cards) */}
                      {day.experience_details && day.experience_details.length > 0 && (
                        <Box w="full">
                          <HStack spacing={2} mb={3}>
                            <Icon as={ClockIcon} h={4} w={4} color={`${colorScheme}.500`} />
                            <Text fontSize="sm" fontWeight="medium" color="gray.700">
                              Linked Experiences
                            </Text>
                          </HStack>
                          <List spacing={2}>
                            {day.experience_details.map((exp, eIndex) => (
                              <ListItem key={eIndex} fontSize="sm" color="gray.700">
                                <Popover placement="bottom-start" trigger="hover" openDelay={200} closeDelay={100}>
                                  <PopoverTrigger>
                                    <Button variant="ghost" size="sm" p={0} height="auto" _hover={{ bg: 'transparent' }}>
                                      <HStack spacing={3} align="center">
                                        <ListIcon as={CheckCircleIcon} color={exp.included ? 'green.500' : 'orange.500'} />
                                        <Text fontWeight="semibold">{exp.name}</Text>
                                        {exp.duration && (
                                          <Text color="gray.500">• {exp.duration}</Text>
                                        )}
                                        <Text color={exp.included ? 'green.600' : 'orange.600'} fontSize="xs">
                                          {exp.included ? 'Included' : 'Optional'}
                                        </Text>
                                        {!exp.included && exp.price && (
                                          <Text color="purple.600" fontSize="xs">• {exp.price}</Text>
                                        )}
                                      </HStack>
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent w="sm">
                                    <PopoverArrow />
                                    <PopoverBody>
                                      <VStack align="start" spacing={2}>
                                        <Text fontWeight="semibold" color="gray.800">{exp.name}</Text>
                                        {exp.image && (
                                          <ChakraImage src={exp.image as any} alt={exp.name} borderRadius="md" w="100%" h="120px" objectFit="cover" />
                                        )}
                                        {exp.description && (
                                          <Text fontSize="sm" color="gray.600">{exp.description}</Text>
                                        )}
                                        <HStack spacing={2} fontSize="xs" color="gray.500" mt={1}>
                                          {exp.duration && <Text>Duration: {exp.duration}</Text>}
                                          <Text>• Difficulty: {exp.difficulty}</Text>
                                          {!exp.included && exp.price && <Text>• Price: {exp.price}</Text>}
                                        </HStack>
                                      </VStack>
                                    </PopoverBody>
                                  </PopoverContent>
                                </Popover>
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      )}

                      {/* Meals */}
                      {day.meals && day.meals.length > 0 && (
                        <Box w="full">
                          <HStack spacing={2} mb={3}>
                            <Icon as={CakeIcon} h={4} w={4} color="orange.500" />
                            <Text fontSize="sm" fontWeight="medium" color="gray.700">
                              Meals
                            </Text>
                          </HStack>
                          <List spacing={2}>
                            {day.meals.map((meal, mIndex) => (
                              <ListItem key={mIndex} fontSize="sm" color="gray.600">
                                <ListIcon as={CheckCircleIcon} color="orange.500" />
                                {meal}
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      )}
                    </SimpleGrid>
                    
                    {/* Accommodation */}
                    {day.accommodation && (
                      <Box w="full" p={3} bg="gray.50" borderRadius="md">
                        <HStack spacing={2} mb={2}>
                          <Icon as={HomeIcon} h={4} w={4} color="green.500" />
                          <Text fontSize="sm" fontWeight="medium" color="gray.700">
                            Accommodation
                          </Text>
                        </HStack>
                        <Text fontSize="sm" color="gray.600">
                          {day.accommodation}
                        </Text>
                      </Box>
                    )}
                    
                    {/* Transportation */}
                    {day.transportation && (
                      <Box w="full" p={3} bg="gray.50" borderRadius="md">
                        <HStack spacing={2} mb={2}>
                          <Icon as={TruckIcon} h={4} w={4} color="blue.500" />
                          <Text fontSize="sm" fontWeight="medium" color="gray.700">
                            Transportation
                          </Text>
                        </HStack>
                        <Text fontSize="sm" color="gray.600">
                          {day.transportation}
                        </Text>
                      </Box>
                    )}
                    
                    {/* Additional Details */}
                    {(day.start_time || day.end_time || day.location) && (
                      <Box w="full" p={3} bg={`${colorScheme}.50`} borderRadius="md">
                        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={3}>
                          {day.start_time && (
                            <HStack spacing={2}>
                              <Icon as={ClockIcon} h={4} w={4} color={`${colorScheme}.600`} />
                              <VStack align="start" spacing={0}>
                                <Text fontSize="xs" color="gray.500">Start</Text>
                                <Text fontSize="sm" fontWeight="medium" color="gray.700">
                                  {formatTime(day.start_time)}
                                </Text>
                              </VStack>
                            </HStack>
                          )}
                          
                          {day.end_time && (
                            <HStack spacing={2}>
                              <Icon as={ClockIcon} h={4} w={4} color={`${colorScheme}.600`} />
                              <VStack align="start" spacing={0}>
                                <Text fontSize="xs" color="gray.500">End</Text>
                                <Text fontSize="sm" fontWeight="medium" color="gray.700">
                                  {formatTime(day.end_time)}
                                </Text>
                              </VStack>
                            </HStack>
                          )}
                          
                          {day.location && (
                            <HStack spacing={2}>
                              <Icon as={MapPinIcon} h={4} w={4} color={`${colorScheme}.600`} />
                              <VStack align="start" spacing={0}>
                                <Text fontSize="xs" color="gray.500">Location</Text>
                                <Text fontSize="sm" fontWeight="medium" color="gray.700">
                                  {day.location}
                                </Text>
                              </VStack>
                            </HStack>
                          )}
                        </SimpleGrid>
                      </Box>
                    )}
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
            );
          })}
        </Accordion>
      </CardBody>
    </Card>
  );
}
