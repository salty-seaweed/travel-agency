import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Container,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Card,
  CardBody,
  Grid,
  GridItem,
  Icon,
  useColorModeValue,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import { MapPinIcon, CalendarIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { useDestinations } from '../../../hooks/useQueries';
import { useWhatsApp } from '../../../hooks/useQueries';
import { useTranslation } from '../../../i18n';
import { EnhancedImagePreloader } from '../../EnhancedImagePreloader';

interface HeroSectionProps {
  homepageContent?: unknown;
}

type DestinationList = NonNullable<ReturnType<typeof useDestinations>['data']>;
type DestinationRow = DestinationList[number];

export const ExperiencesHeroSection: React.FC<HeroSectionProps> = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const navigate = useNavigate();
  const { data: destinations } = useDestinations();
  const { getWhatsAppUrl } = useWhatsApp();

  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');

  const [searchData, setSearchData] = useState({
    destination: '',
    dates: '',
    travelers: '2',
    activity: ''
  });

  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);
  const [filteredDestinations, setFilteredDestinations] = useState<DestinationRow[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Support both images and GIFs for hero banner
  const heroImages = useMemo(() => [
    "/images/optimized/hero/hero4.webp",
    "/images/optimized/hero/hero5.webp", 
    "/images/optimized/hero/ishan69.webp",
    "/images/optimized/hero/ishan62.webp",
    "/images/optimized/hero/sunset.jpg",
  ], []);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-rotate images only after all are loaded
  useEffect(() => {
    if (imagesLoaded) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [heroImages.length, imagesLoaded]);

  // Filter destinations based on input
  useEffect(() => {
    if (searchData.destination && destinations) {
      const filtered = destinations.filter(dest => 
        dest.name.toLowerCase().includes(searchData.destination.toLowerCase()) ||
        dest.island.toLowerCase().includes(searchData.destination.toLowerCase()) ||
        dest.atoll.toLowerCase().includes(searchData.destination.toLowerCase())
      ).slice(0, 5);
      setFilteredDestinations(filtered);
      setShowDestinationDropdown(true);
    } else {
      setFilteredDestinations([]);
      setShowDestinationDropdown(false);
    }
  }, [searchData.destination, destinations]);

  const handleDestinationSelect = (destination: DestinationRow) => {
    setSearchData((prev) => ({ ...prev, destination: destination.name }));
    setShowDestinationDropdown(false);
  };

  const handleCreateCustomExperience = () => {
    if (!searchData.destination.trim()) {
      toast({
        title: t('homepage.search.selectDestination', 'Please select a destination'),
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Navigate to packages page with custom experience builder pre-filled
    const params = new URLSearchParams();
    if (searchData.destination) params.set('destination', searchData.destination);
    if (searchData.dates) params.set('dates', searchData.dates);
    if (searchData.travelers) params.set('travelers', searchData.travelers);
    if (searchData.activity) params.set('activity', searchData.activity);
    params.set('custom_builder', 'true');
    
    navigate(`/packages?${params.toString()}`);
  };

  const handleWhatsAppClick = () => {
    window.open(getWhatsAppUrl("Hi! I'd like help planning a Maldives experience"), '_blank');
  };

  return (
    <EnhancedImagePreloader
      images={heroImages}
      onComplete={() => setImagesLoaded(true)}
      priority="hero"
      showProgress={true}
      fallbackDelay={2000}
    >
      {!imagesLoaded ? (
        <Box 
          position="relative" 
          minH="100vh" 
          display="flex" 
          alignItems="center" 
          justifyContent="center"
          bg="gray.900"
        >
          <VStack spacing={4}>
            <Spinner size="xl" color="white" thickness="4px" />
            <Text color="white" fontSize="lg">Loading...</Text>
          </VStack>
        </Box>
      ) : (
        <Box position="relative" minH="100vh" overflow="hidden">
        <Box 
          position="absolute" 
          top={0} 
          left={0} 
          right={0} 
          bottom={0} 
          backgroundImage={`url(${heroImages[currentImageIndex]})`}
          backgroundSize="cover" 
          backgroundPosition="center" 
          backgroundRepeat="no-repeat" 
          transition="background-image 1s ease-in-out"
        >
          <Box position="absolute" top={0} left={0} right={0} bottom={0} bg="blackAlpha.600" />
        </Box>

      <Container maxW="7xl" position="relative" zIndex={2} py={12}>
        <VStack spacing={8} alignItems="center" minH="60vh" justify="center">
          {/* Hero Title and CTAs */}
          <VStack spacing={4} textAlign="center" maxW="3xl">
            <Heading
              size="2xl"
              className="font-display text-4xl font-semibold tracking-tight text-white md:text-5xl md:font-medium"
            >
              {t('homepage.hero.title')}
            </Heading>

            <HStack spacing={3} pt={2}>
              <Button
                colorScheme="whatsapp"
                size="md"
                onClick={handleWhatsAppClick}
                className="!rounded-lg !font-semibold shadow-sm"
                aria-label="Chat with us on WhatsApp for travel planning assistance"
              >
                WhatsApp
              </Button>
              <Link to="/contact">
                <Button
                  size="md"
                  className="!rounded-lg !border !border-white/80 !bg-white/10 !font-semibold !text-white backdrop-blur-sm hover:!bg-white/20"
                  aria-label="Go to contact page to send us a message"
                >
                  Contact
                </Button>
              </Link>
            </HStack>
          </VStack>

          {/* Horizontal Search Bar - Bookmundi Style */}
          <Box w="full" maxW="5xl">
            <Card
              bg={cardBg}
              border="1px solid"
              borderColor="gray.200"
              shadow="lg"
              borderRadius="2xl"
              overflow="visible"
              className="!border-slate-200/90 !shadow-md"
            >
              <CardBody p={4}>
                <Grid 
                  templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} 
                  gap={3}
                  alignItems="end"
                >
                  {/* Destination Field */}
                  <GridItem position="relative">
                    <VStack align="start" spacing={1}>
                      <Text fontSize="xs" fontWeight="semibold" color={textColor} px={1}>
                        Destination
                      </Text>
                      <InputGroup size="lg">
                        <InputLeftElement>
                          <Icon as={MapPinIcon} color="gray.400" h={5} w={5} />
                        </InputLeftElement>
                        <Input 
                          placeholder={t('homepage.search.destinationPlaceholder', 'Which island?')} 
                          value={searchData.destination} 
                          onChange={(e) => setSearchData(prev => ({ ...prev, destination: e.target.value }))} 
                          borderRadius="lg"
                          border="none"
                          bg="gray.50"
                          _hover={{ bg: "gray.100" }}
                          _focus={{ bg: "white", boxShadow: "0 0 0 1px #0ea5e9" }}
                          onFocus={() => setShowDestinationDropdown(true)}
                        />
                      </InputGroup>
                      {showDestinationDropdown && filteredDestinations.length > 0 && (
                        <Box 
                          position="absolute" 
                          top="100%" 
                          left={0} 
                          right={0} 
                          bg="white" 
                          border="1px solid" 
                          borderColor="gray.200" 
                          borderRadius="lg" 
                          mt={1} 
                          zIndex={20}
                          maxH="200px"
                          overflowY="auto"
                          shadow="xl"
                        >
                          {filteredDestinations.map((destination) => (
                            <Box 
                              key={destination.id}
                              px={4} 
                              py={3} 
                              cursor="pointer" 
                              _hover={{ bg: "gray.50" }}
                              onClick={() => handleDestinationSelect(destination)}
                            >
                              <Text fontWeight="medium" fontSize="sm">{destination.name}</Text>
                              <Text fontSize="xs" color="gray.500">{destination.island}, {destination.atoll}</Text>
                            </Box>
                          ))}
                        </Box>
                      )}
                    </VStack>
                  </GridItem>

                  {/* Dates Field */}
                  <GridItem>
                    <VStack align="start" spacing={1}>
                      <Text fontSize="xs" fontWeight="semibold" color={textColor} px={1}>
                        Dates
                      </Text>
                      <InputGroup size="lg">
                        <InputLeftElement>
                          <Icon as={CalendarIcon} color="gray.400" h={5} w={5} />
                        </InputLeftElement>
                        <Input 
                          placeholder={t('homepage.search.datePlaceholder', 'When?')} 
                          value={searchData.dates} 
                          onChange={(e) => setSearchData(prev => ({ ...prev, dates: e.target.value }))} 
                          borderRadius="lg"
                          border="none"
                          bg="gray.50"
                          _hover={{ bg: "gray.100" }}
                          _focus={{ bg: "white", boxShadow: "0 0 0 1px #0ea5e9" }}
                        />
                      </InputGroup>
                    </VStack>
                  </GridItem>

                  {/* Travelers Field */}
                  <GridItem>
                    <VStack align="start" spacing={1}>
                      <Text fontSize="xs" fontWeight="semibold" color={textColor} px={1}>
                        Travelers
                      </Text>
                      <InputGroup size="lg">
                        <InputLeftElement>
                          <Icon as={UserGroupIcon} color="gray.400" h={5} w={5} />
                        </InputLeftElement>
                        <Select 
                          placeholder={t('homepage.search.travelers', 'How many?')} 
                          value={searchData.travelers} 
                          onChange={(e) => setSearchData(prev => ({ ...prev, travelers: e.target.value }))} 
                          borderRadius="lg"
                          border="none"
                          bg="gray.50"
                          paddingLeft="2.5rem"
                          _hover={{ bg: "gray.100" }}
                          _focus={{ bg: "white", boxShadow: "0 0 0 1px #0ea5e9" }}
                        >
                          <option value="1">{t('homepage.search.travelers_one', '1 Traveler')}</option>
                          <option value="2">{t('homepage.search.travelers_two', '2 Travelers')}</option>
                          <option value="3">{t('homepage.search.travelers_three', '3 Travelers')}</option>
                          <option value="4">{t('homepage.search.travelers_four', '4 Travelers')}</option>
                          <option value="5+">{t('homepage.search.travelers_five_plus', '5+ Travelers')}</option>
                        </Select>
                      </InputGroup>
                    </VStack>
                  </GridItem>

                  {/* Search Button */}
                  <GridItem>
                    <Button
                      size="lg"
                      w="full"
                      h="50px"
                      onClick={handleCreateCustomExperience}
                      borderRadius="lg"
                      fontWeight="semibold"
                      className="!border-0 !bg-slate-900 !text-white !shadow-sm hover:!bg-slate-800"
                      _active={{ transform: 'scale(0.98)' }}
                      aria-label="Search for packages matching your destination, dates, and traveler count"
                    >
                      {t('homepage.search.startPlanning', 'Search')}
                    </Button>
                  </GridItem>
                </Grid>
              </CardBody>
            </Card>
          </Box>
        </VStack>
      </Container>
        </Box>
      )}
      {/* Popular Destinations Section - Hidden as requested */}
      {/* Trending destinations can be re-enabled later if needed */}
    </EnhancedImagePreloader>
  );
};
