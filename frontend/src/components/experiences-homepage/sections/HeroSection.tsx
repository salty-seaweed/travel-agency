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
  Badge,
  Icon,
  useColorModeValue,
  Image,
  SimpleGrid,
  useToast,
} from '@chakra-ui/react';
import {
  MapPinIcon,
  CalendarIcon,
  UserGroupIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { getWhatsAppUrl } from '../../../config';
import { useDestinations } from '../../../hooks/useQueries';

interface HeroSectionProps {
  homepageContent?: any;
}

export const ExperiencesHeroSection: React.FC<HeroSectionProps> = ({
  homepageContent
}) => {
  const toast = useToast();
  const navigate = useNavigate();
  const { data: destinations } = useDestinations();
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.300');

  const [searchData, setSearchData] = useState({
    destination: '',
    dates: '',
    travelers: '2',
    activity: ''
  });

  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);
  const [filteredDestinations, setFilteredDestinations] = useState<any[]>([]);

  const heroImages = useMemo(() => [
    "/src/assets/images/ishan45.jpg",
    "/src/assets/images/ishan46.jpg", 
    "/src/assets/images/ishan47.jpg",
    "/src/assets/images/ishan48.jpg",
    "/src/assets/images/ishan49.jpg",
    "/src/assets/images/ishan50.jpg",
  ], []);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

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

  const handleDestinationSelect = (destination: any) => {
    setSearchData(prev => ({ ...prev, destination: destination.name }));
    setShowDestinationDropdown(false);
  };

  const handleCreateCustomExperience = () => {
    if (!searchData.destination.trim()) {
      toast({
        title: "Please select a destination",
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

  const handlePopularDestinationClick = (destination: any) => {
    setSearchData(prev => ({ ...prev, destination: destination.name }));
  };

  // Get trending destinations from backend only - no fallback
  const trendingDestinations = useMemo(() => {
    if (destinations && destinations.length > 0) {
      return destinations.slice(0, 4).map(dest => ({
        name: dest.name,
        image: dest.image || `/src/assets/images/ishan${Math.floor(Math.random() * 20) + 51}.jpg`,
        properties: dest.property_count || 0
      }));
    }
    
    // No fallback data - return empty array
    return [];
  }, [destinations]);

  return (
    <Box position="relative" minH="100vh" overflow="hidden">
      <Box position="absolute" top={0} left={0} right={0} bottom={0} backgroundImage={`url(${heroImages[currentImageIndex]})`} backgroundSize="cover" backgroundPosition="center" backgroundRepeat="no-repeat" transition="background-image 1s ease-in-out">
        <Box position="absolute" top={0} left={0} right={0} bottom={0} bg="blackAlpha.600" />
      </Box>

      <Container maxW="7xl" position="relative" zIndex={2} py={20}>
        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={12} alignItems="center" minH="80vh">
          <GridItem>
            <VStack spacing={8} align="start" textAlign="left">
                  <Badge 
                    className="bg-white/20 backdrop-blur-md text-white px-6 py-2 rounded-full text-sm font-bold border border-white/30"
                  >
                    <Icon as={SparklesIcon} className="w-4 h-4 mr-2" />
                    Your Dream Maldives Vacation Awaits
                  </Badge>
                  
                  <Heading size="2xl" className="text-5xl md:text-6xl font-bold text-white">
                    🌊 Discover Paradise in the Maldives
                  </Heading>
                  
                  <Text className="text-xl text-blue-200 max-w-4xl mx-auto leading-relaxed">
                    Experience crystal-clear turquoise waters, pristine white sand beaches, and overwater bungalows. 
                    Create your perfect Maldives getaway with personalized experiences, luxury accommodations, and unforgettable adventures.
                  </Text>

              <HStack spacing={4} pt={2}>
                <a href={getWhatsAppUrl("Hi! I'd like help planning a Maldives experience")} target="_blank" rel="noopener noreferrer">
                  <Button colorScheme="whatsapp" size="md">Chat on WhatsApp</Button>
                </a>
                <Link to="/contact">
                  <Button variant="outline" colorScheme="whiteAlpha" size="md">Contact Us</Button>
                </Link>
              </HStack>
            </VStack>
          </GridItem>

          <GridItem>
            <Card bg={cardBg} border="1px solid" borderColor={borderColor} shadow="2xl" borderRadius="xl" overflow="hidden">
              <CardBody p={8}>
                <VStack spacing={6}>
                  <VStack spacing={2} textAlign="center">
                    <Heading size="lg" color={textColor}>Plan Your Perfect Maldives Trip</Heading>
                    <Text color={mutedTextColor}>Choose your destination and let us create your dream vacation</Text>
                  </VStack>

                  <VStack spacing={4} w="full">
                    <Box position="relative" w="full">
                      <InputGroup>
                        <InputLeftElement><Icon as={MapPinIcon} color="gray.400" /></InputLeftElement>
                        <Input 
                          placeholder="Which island or atoll?" 
                          value={searchData.destination} 
                          onChange={(e) => setSearchData(prev => ({ ...prev, destination: e.target.value }))} 
                          size="lg" 
                          borderRadius="lg"
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
                          zIndex={10}
                          maxH="200px"
                          overflowY="auto"
                          shadow="lg"
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
                              <Text fontWeight="medium">{destination.name}</Text>
                              <Text fontSize="sm" color="gray.500">{destination.island}, {destination.atoll}</Text>
                            </Box>
                          ))}
                        </Box>
                      )}
                    </Box>

                    <InputGroup>
                      <InputLeftElement><Icon as={CalendarIcon} color="gray.400" /></InputLeftElement>
                      <Input 
                        placeholder="When are you going? (Optional)" 
                        value={searchData.dates} 
                        onChange={(e) => setSearchData(prev => ({ ...prev, dates: e.target.value }))} 
                        size="lg" 
                        borderRadius="lg" 
                      />
                    </InputGroup>

                    <InputGroup>
                      <InputLeftElement><Icon as={UserGroupIcon} color="gray.400" /></InputLeftElement>
                      <Select 
                        placeholder="Travelers" 
                        value={searchData.travelers} 
                        onChange={(e) => setSearchData(prev => ({ ...prev, travelers: e.target.value }))} 
                        size="lg" 
                        borderRadius="lg"
                      >
                        <option value="1">1 Traveler</option>
                        <option value="2">2 Travelers</option>
                        <option value="3">3 Travelers</option>
                        <option value="4">4 Travelers</option>
                        <option value="5+">5+ Travelers</option>
                      </Select>
                    </InputGroup>

                    <Button 
                      colorScheme="blue" 
                      size="lg" 
                      w="full" 
                      onClick={handleCreateCustomExperience}
                      leftIcon={<Icon as={SparklesIcon} />}
                    >
                      Start Planning My Trip
                    </Button>
                  </VStack>
                </VStack>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>

        <Box mt={16}>
          <VStack spacing={8}>
            <VStack spacing={2} textAlign="center">
              <Text color="white" fontSize="lg" fontWeight="medium">Popular Maldives Destinations</Text>
              <Text color="gray.300" fontSize="sm">Most sought-after islands and atolls for your perfect getaway</Text>
            </VStack>

            {trendingDestinations.length > 0 ? (
              <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6} w="full">
                {trendingDestinations.map((destination) => (
                  <Card 
                    key={destination.name} 
                    bg="whiteAlpha.900" 
                    backdropFilter="blur(10px)" 
                    border="1px solid" 
                    borderColor="whiteAlpha.200" 
                    overflow="hidden" 
                    cursor="pointer" 
                    transition="all 0.3s" 
                    _hover={{ transform: 'translateY(-4px)', shadow: 'xl' }}
                    onClick={() => handlePopularDestinationClick(destination)}
                  >
                    <Box position="relative" h="120px">
                      <Image src={destination.image} alt={destination.name} w="full" h="full" objectFit="cover" />
                      <Box position="absolute" top={0} left={0} right={0} bottom={0} bg="blackAlpha.400" />
                      <VStack position="absolute" top={0} left={0} right={0} bottom={0} justify="center" spacing={1}>
                        <Text color="white" fontWeight="bold" fontSize="lg">{destination.name}</Text>
                        <Text color="gray.200" fontSize="sm">{destination.properties} properties</Text>
                      </VStack>
                    </Box>
                  </Card>
                ))}
              </SimpleGrid>
            ) : (
              <VStack spacing={4} textAlign="center">
                <Text color="gray.300" fontSize="sm">No destinations available at the moment.</Text>
                <Text color="gray.400" fontSize="xs">Please check back later or contact us for more information.</Text>
              </VStack>
            )}
          </VStack>
        </Box>
      </Container>
    </Box>
  );
};
