import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Container,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Card,
  CardBody,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
  useToast,
  Icon,
  SimpleGrid,
  Textarea,
} from '@chakra-ui/react';
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  CalendarIcon,
  UserGroupIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';
import { useTranslation } from '../../../i18n';
import { getWhatsAppUrl } from '../../../config';

export const ExperiencesSearchSection: React.FC = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const navigate = useNavigate();
  
  const bgColor = useColorModeValue('white', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.300');

  const [searchData, setSearchData] = useState({ destination: '', dates: '', travelers: '', activity: '' });
  const [customTripData, setCustomTripData] = useState({ 
    dreamTrip: '', 
    email: '',
    travelers: '2',
    duration: '7',
    budget: '2000-5000'
  });

  const popularDestinations = ['Malé', 'Maafushi', 'Hulhumalé', 'Thulusdhoo', 'Ukulhas', 'Rasdhoo'];
  const popularExperiences = ['Snorkeling', 'Diving', 'Island Hopping', 'Water Sports', 'Cultural', 'Sunset Cruise'];

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchData.destination) params.set('search', searchData.destination);
    if (searchData.activity) params.set('category', searchData.activity);
    navigate(`/packages?${params.toString()}`);
  };

  const handleCustomTripSubmit = () => {
    if (!customTripData.dreamTrip.trim() || !customTripData.email.trim()) {
      toast({
        title: "Please fill in all required fields",
        description: "Dream trip details and email are required",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const message = `Hi! I'd like to create a custom Maldives trip:

Dream Trip Details: ${customTripData.dreamTrip}
Email: ${customTripData.email}
Travelers: ${customTripData.travelers}
Duration: ${customTripData.duration} days
Budget: $${customTripData.budget}

Please help me plan this perfect trip!`;

    const whatsappUrl = getWhatsAppUrl(message);
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "Custom trip request sent!",
      description: "We'll contact you on WhatsApp to discuss your dream trip",
      status: "success",
      duration: 5000,
      isClosable: true,
    });

    // Reset form
    setCustomTripData({ 
      dreamTrip: '', 
      email: '',
      travelers: '2',
      duration: '7',
      budget: '2000-5000'
    });
  };

  return (
    <Box bg={bgColor} py={12} borderBottom="1px solid" borderColor={borderColor}>
      <Container maxW="7xl">
        <VStack spacing={8}>
          <VStack spacing={4} textAlign="center">
            <Text fontSize="2xl" fontWeight="semibold" color={textColor}>Find Maldives Packages</Text>
            <Text fontSize="lg" color={mutedTextColor}>Search, compare and book amazing curated packages</Text>
          </VStack>

          <Card bg={cardBg} border="1px solid" borderColor={borderColor} shadow="xl" borderRadius="xl" overflow="hidden" w="full" maxW="4xl">
            <CardBody p={8}>
              <Tabs variant="soft-rounded" colorScheme="blue">
                <Box textAlign="center" mb={6}>
                  <TabList>
                    <Tab>Packages</Tab>
                    <Tab>Custom Trip</Tab>
                  </TabList>
                </Box>

                <TabPanels>
                  <TabPanel>
                    <VStack spacing={6}>
                      <VStack spacing={4} w="full">
                        <InputGroup>
                          <InputLeftElement><Icon as={MapPinIcon} color="gray.400" /></InputLeftElement>
                          <Input placeholder="Which island or atoll?" value={searchData.destination} onChange={(e) => setSearchData(prev => ({ ...prev, destination: e.target.value }))} size="lg" borderRadius="lg" />
                        </InputGroup>
                        <InputGroup>
                          <InputLeftElement><Icon as={CalendarIcon} color="gray.400" /></InputLeftElement>
                          <Input placeholder="When are you going?" value={searchData.dates} onChange={(e) => setSearchData(prev => ({ ...prev, dates: e.target.value }))} size="lg" borderRadius="lg" />
                        </InputGroup>
                        <InputGroup>
                          <InputLeftElement pl={3}><Icon as={UserGroupIcon} color="gray.400" /></InputLeftElement>
                          <Select placeholder="Travelers" value={searchData.travelers} onChange={(e) => setSearchData(prev => ({ ...prev, travelers: e.target.value }))} size="lg" borderRadius="lg" pl={12}>
                            <option value="1">1 Traveler</option>
                            <option value="2">2 Travelers</option>
                            <option value="3">3 Travelers</option>
                            <option value="4">4 Travelers</option>
                            <option value="5+">5+ Travelers</option>
                          </Select>
                        </InputGroup>
                        <Button onClick={handleSearch} colorScheme="blue" size="lg" w="full" borderRadius="lg" leftIcon={<Icon as={MagnifyingGlassIcon} className="w-5 h-5" />}>Search Packages</Button>
                      </VStack>

                      <VStack spacing={3} w="full">
                        <Text fontSize="sm" color={mutedTextColor} fontWeight="medium">Popular Destinations:</Text>
                        <HStack spacing={2} flexWrap="wrap" justify="center">
                          {popularDestinations.map((destination) => (
                            <Button key={destination} size="sm" variant="outline" colorScheme="blue" borderRadius="full" fontSize="xs" onClick={() => setSearchData(prev => ({ ...prev, destination }))}>{destination}</Button>
                          ))}
                        </HStack>
                      </VStack>
                    </VStack>
                  </TabPanel>

                  <TabPanel>
                    <VStack spacing={6}>
                      <VStack spacing={2} textAlign="center">
                        <Text fontSize="lg" color={textColor} fontWeight="semibold">Design Your Dream Trip</Text>
                        <Text fontSize="sm" color={mutedTextColor}>Tell us about your perfect Maldives experience and we'll create it for you</Text>
                      </VStack>
                      
                      <VStack spacing={4} w="full">
                        <VStack align="start" spacing={2} w="full">
                          <Text fontSize="sm" fontWeight="semibold" color={textColor}>Describe Your Dream Trip *</Text>
                          <Textarea 
                            placeholder="Tell us about your dream Maldives trip... What activities do you want? Any specific islands or experiences? What's most important to you?" 
                            value={customTripData.dreamTrip}
                            onChange={(e) => setCustomTripData(prev => ({ ...prev, dreamTrip: e.target.value }))}
                            size="lg" 
                            borderRadius="lg" 
                            minH="120px" 
                            resize="vertical"
                            isRequired
                          />
                        </VStack>

                        <VStack align="start" spacing={2} w="full">
                          <Text fontSize="sm" fontWeight="semibold" color={textColor}>Your Email *</Text>
                          <InputGroup>
                            <InputLeftElement><Icon as={EnvelopeIcon} color="gray.400" /></InputLeftElement>
                            <Input 
                              placeholder="your.email@example.com" 
                              value={customTripData.email}
                              onChange={(e) => setCustomTripData(prev => ({ ...prev, email: e.target.value }))}
                              size="lg" 
                              borderRadius="lg"
                              type="email"
                              isRequired
                            />
                          </InputGroup>
                        </VStack>

                        <HStack spacing={4} w="full">
                          <VStack align="start" spacing={2} flex={1}>
                            <Text fontSize="sm" fontWeight="semibold" color={textColor}>Travelers</Text>
                            <Select 
                              value={customTripData.travelers} 
                              onChange={(e) => setCustomTripData(prev => ({ ...prev, travelers: e.target.value }))}
                              size="lg" 
                              borderRadius="lg"
                            >
                              <option value="1">1 Person</option>
                              <option value="2">2 People</option>
                              <option value="3">3 People</option>
                              <option value="4">4 People</option>
                              <option value="5+">5+ People</option>
                            </Select>
                          </VStack>

                          <VStack align="start" spacing={2} flex={1}>
                            <Text fontSize="sm" fontWeight="semibold" color={textColor}>Duration</Text>
                            <Select 
                              value={customTripData.duration} 
                              onChange={(e) => setCustomTripData(prev => ({ ...prev, duration: e.target.value }))}
                              size="lg" 
                              borderRadius="lg"
                            >
                              <option value="3">3 Days</option>
                              <option value="5">5 Days</option>
                              <option value="7">7 Days</option>
                              <option value="10">10 Days</option>
                              <option value="14">14 Days</option>
                            </Select>
                          </VStack>
                        </HStack>

                        <VStack align="start" spacing={2} w="full">
                          <Text fontSize="sm" fontWeight="semibold" color={textColor}>Budget Range</Text>
                          <Select 
                            value={customTripData.budget} 
                            onChange={(e) => setCustomTripData(prev => ({ ...prev, budget: e.target.value }))}
                            size="lg" 
                            borderRadius="lg"
                          >
                            <option value="1000-2000">$1,000 - $2,000</option>
                            <option value="2000-5000">$2,000 - $5,000</option>
                            <option value="5000-10000">$5,000 - $10,000</option>
                            <option value="10000+">$10,000+</option>
                          </Select>
                        </VStack>

                        <Button 
                          onClick={handleCustomTripSubmit} 
                          colorScheme="whatsapp" 
                          size="lg" 
                          w="full" 
                          borderRadius="lg"
                          leftIcon={<Icon as={ChatBubbleLeftRightIcon} className="w-5 h-5" />}
                        >
                          Send Custom Trip Request via WhatsApp
                        </Button>
                      </VStack>
                    </VStack>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </CardBody>
          </Card>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full" maxW="2xl">
            <VStack spacing={2} textAlign="center">
              <Text fontSize="2xl" fontWeight="bold" color="blue.600">150+</Text>
              <Text fontSize="sm" color={mutedTextColor}>Properties Available</Text>
            </VStack>
            <VStack spacing={2} textAlign="center">
              <Text fontSize="2xl" fontWeight="bold" color="blue.600">75+</Text>
              <Text fontSize="sm" color={mutedTextColor}>Curated Packages</Text>
            </VStack>
            <VStack spacing={2} textAlign="center">
              <Text fontSize="2xl" fontWeight="bold" color="blue.600">4.8</Text>
              <Text fontSize="sm" color={mutedTextColor}>Average Rating</Text>
            </VStack>
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};
