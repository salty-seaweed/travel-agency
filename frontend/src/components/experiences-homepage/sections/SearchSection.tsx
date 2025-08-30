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
import { useWhatsApp } from '../../../hooks/useQueries';
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
        title: t('homepage.search.required', 'Please fill in all required fields'),
        description: t('homepage.search.requiredDesc', 'Dream trip details and email are required'),
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
      title: t('homepage.search.customSent', 'Custom trip request sent!'),
      description: t('homepage.search.customSentDesc', "We'll contact you on WhatsApp to discuss your dream trip"),
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
            <Text fontSize="2xl" fontWeight="semibold" color={textColor}>{t('homepage.search.findTitle', 'Find Maldives Packages')}</Text>
            <Text fontSize="lg" color={mutedTextColor}>{t('homepage.search.findSubtitle', 'Search, compare and book amazing curated packages')}</Text>
          </VStack>

          <Card bg={cardBg} border="1px solid" borderColor={borderColor} shadow="xl" borderRadius="xl" overflow="hidden" w="full" maxW="4xl">
            <CardBody p={8}>
              <Tabs variant="soft-rounded" colorScheme="blue">
                <Box textAlign="center" mb={6}>
                  <TabList>
                    <Tab>{t('homepage.search.tabPackages', 'Packages')}</Tab>
                    <Tab>{t('homepage.search.tabCustom', 'Custom Trip')}</Tab>
                  </TabList>
                </Box>

                <TabPanels>
                  <TabPanel>
                    <VStack spacing={6}>
                      <VStack spacing={4} w="full">
                        <InputGroup>
                          <InputLeftElement><Icon as={MapPinIcon} color="gray.400" /></InputLeftElement>
                          <Input placeholder={t('homepage.search.destinationPlaceholder', 'Which island or atoll?')} value={searchData.destination} onChange={(e) => setSearchData(prev => ({ ...prev, destination: e.target.value }))} size="lg" borderRadius="lg" />
                        </InputGroup>
                        <InputGroup>
                          <InputLeftElement><Icon as={CalendarIcon} color="gray.400" /></InputLeftElement>
                          <Input placeholder={t('homepage.search.datePlaceholder', 'When are you going?')} value={searchData.dates} onChange={(e) => setSearchData(prev => ({ ...prev, dates: e.target.value }))} size="lg" borderRadius="lg" />
                        </InputGroup>
                        <InputGroup>
                          <InputLeftElement pl={3}><Icon as={UserGroupIcon} color="gray.400" /></InputLeftElement>
                          <Select placeholder={t('homepage.search.travelers', 'Travelers')} value={searchData.travelers} onChange={(e) => setSearchData(prev => ({ ...prev, travelers: e.target.value }))} size="lg" borderRadius="lg" pl={12}>
                            <option value="1">{t('homepage.search.travelers_one', '1 Traveler')}</option>
                            <option value="2">{t('homepage.search.travelers_two', '2 Travelers')}</option>
                            <option value="3">{t('homepage.search.travelers_three', '3 Travelers')}</option>
                            <option value="4">{t('homepage.search.travelers_four', '4 Travelers')}</option>
                            <option value="5+">{t('homepage.search.travelers_five_plus', '5+ Travelers')}</option>
                          </Select>
                        </InputGroup>
                        <Button onClick={handleSearch} colorScheme="blue" size="lg" w="full" borderRadius="lg" leftIcon={<Icon as={MagnifyingGlassIcon} className="w-5 h-5" />}>{t('homepage.search.searchPackages', 'Search Packages')}</Button>
                      </VStack>

                      <VStack spacing={3} w="full">
                        <Text fontSize="sm" color={mutedTextColor} fontWeight="medium">{t('homepage.destinations.popular', 'Popular Destinations:')}</Text>
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
                        <Text fontSize="lg" color={textColor} fontWeight="semibold">{t('homepage.custom.title', 'Design Your Dream Trip')}</Text>
                        <Text fontSize="sm" color={mutedTextColor}>{t('homepage.custom.subtitle', "Tell us about your perfect Maldives experience and we'll create it for you")}</Text>
                      </VStack>
                      
                      <VStack spacing={4} w="full">
                        <VStack align="start" spacing={2} w="full">
                          <Text fontSize="sm" fontWeight="semibold" color={textColor}>{t('homepage.custom.describe', 'Describe Your Dream Trip *')}</Text>
                          <Textarea 
                            placeholder={t('homepage.custom.placeholder', "Tell us about your dream Maldives trip... What activities do you want? Any specific islands or experiences? What's most important to you?")} 
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
                          <Text fontSize="sm" fontWeight="semibold" color={textColor}>{t('homepage.custom.email', 'Your Email *')}</Text>
                          <InputGroup>
                            <InputLeftElement><Icon as={EnvelopeIcon} color="gray.400" /></InputLeftElement>
                            <Input 
                              placeholder={t('homepage.custom.emailPlaceholder', 'your.email@example.com')} 
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
                            <Text fontSize="sm" fontWeight="semibold" color={textColor}>{t('homepage.search.travelers', 'Travelers')}</Text>
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
                            <Text fontSize="sm" fontWeight="semibold" color={textColor}>{t('homepage.custom.duration', 'Duration')}</Text>
                            <Select 
                              value={customTripData.duration} 
                              onChange={(e) => setCustomTripData(prev => ({ ...prev, duration: e.target.value }))}
                              size="lg" 
                              borderRadius="lg"
                            >
                              <option value="3">{t('homepage.custom.days3', '3 Days')}</option>
                              <option value="5">{t('homepage.custom.days5', '5 Days')}</option>
                              <option value="7">{t('homepage.custom.days7', '7 Days')}</option>
                              <option value="10">{t('homepage.custom.days10', '10 Days')}</option>
                              <option value="14">{t('homepage.custom.days14', '14 Days')}</option>
                            </Select>
                          </VStack>
                        </HStack>

                        <VStack align="start" spacing={2} w="full">
                          <Text fontSize="sm" fontWeight="semibold" color={textColor}>{t('homepage.custom.budget', 'Budget Range')}</Text>
                          <Select 
                            value={customTripData.budget} 
                            onChange={(e) => setCustomTripData(prev => ({ ...prev, budget: e.target.value }))}
                            size="lg" 
                            borderRadius="lg"
                          >
                            <option value="up-to-1000">{t('homepage.custom.b0', 'Up to $1,000')}</option>
                            <option value="1000-2000">{t('homepage.custom.b1', '$1,000 - $2,000')}</option>
                            <option value="2000-5000">{t('homepage.custom.b2', '$2,000 - $5,000')}</option>
                            <option value="5000-10000">{t('homepage.custom.b3', '$5,000 - $10,000')}</option>
                            <option value="10000+">{t('homepage.custom.b4', '$10,000+')}</option>
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
                          {t('homepage.custom.send', 'Send Custom Trip Request via WhatsApp')}
                        </Button>
                      </VStack>
                    </VStack>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </CardBody>
          </Card>

          {/* Remove hardcoded stats - these will be managed through admin panel */}
        </VStack>
      </Container>
    </Box>
  );
};
