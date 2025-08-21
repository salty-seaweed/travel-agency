import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  SparklesIcon,
  GlobeAltIcon,
  MapIcon,
  ArrowRightIcon,
  InformationCircleIcon,
  FireIcon,
  ClockIcon,
  TagIcon,
  UsersIcon,
  HeartIcon,
  StarIcon,
  CheckIcon,
  PlusIcon,
  MinusIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { usePackages, useDestinations, useFeaturedExperiences } from '../hooks/useQueries';
import { LoadingSpinner } from './LoadingSpinner';
import { PackageCard } from './ui/PackageCard';
import type { Package as ApiPackage } from '../types';
import { getWhatsAppUrl } from '../config';
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Button,
  Badge,
  Icon,
  useColorModeValue,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  SimpleGrid,
  Card,
  CardBody,
  Image,
  Flex,
  Divider,
  Alert,
  AlertIcon,
  Skeleton,
  SkeletonText,
  Wrap,
  WrapItem,
  Tooltip,
  useToast,
  Grid,
  GridItem,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  List,
  ListItem,
  ListIcon,
  Progress,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react';

// Convert API package to PackageCard format
interface LocalPackage {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: string;
  destinations: any[];
  highlights: string[];
  included: string[];
  maxTravelers: number;
  featured: boolean;
  image: string;
  rating: number;
  reviewCount: number;
  category: string;
}

const convertApiPackageToCardFormat = (apiPackage: ApiPackage): LocalPackage => {
  return {
    id: apiPackage.id,
    name: apiPackage.name,
    description: apiPackage.description,
    price: parseFloat(apiPackage.price),
    duration: apiPackage.duration.toString(),
    destinations: apiPackage.destinations || [],
    highlights: apiPackage.highlights || [],
    included: apiPackage.included || [],
    maxTravelers: apiPackage.maxTravelers || 4,
    featured: apiPackage.is_featured,
    image: apiPackage.images?.[0]?.image || '/src/assets/images/ishan1.jpg',
    rating: apiPackage.rating || 4.5,
    reviewCount: apiPackage.review_count || 0,
    category: apiPackage.category || 'Adventure'
  };
};

export function PackagesPage() {
  const { data: apiPackages, isLoading: packagesLoading, error: packagesError } = usePackages();
  const { data: destinations } = useDestinations();
  const { data: featuredExperiences } = useFeaturedExperiences();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDestination, setSelectedDestination] = useState('all');
  const [selectedExperience, setSelectedExperience] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [duration, setDuration] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const toast = useToast();
  const hasProcessedCustomBuilder = useRef(false);

  // Custom Package Builder State
  const [customPackage, setCustomPackage] = useState({
    destination: '',
    experiences: [] as any[],
    duration: 7,
    travelers: 2,
    accommodation: '',
    startDate: '',
    endDate: ''
  });
  const { isOpen: isBuilderOpen, onOpen: onBuilderOpen, onClose: onBuilderClose } = useDisclosure();

  useEffect(() => {
    const q = searchParams.get('search');
    const c = searchParams.get('category');
    const s = searchParams.get('sort');
    const d = searchParams.get('destination');
    const e = searchParams.get('experience');
    const customBuilder = searchParams.get('custom_builder');
    const selectedExperience = searchParams.get('selected_experience');
    const experienceName = searchParams.get('experience_name');
    const dates = searchParams.get('dates');
    const travelers = searchParams.get('travelers');
    
    if (q) setSearchTerm(q);
    else if (d) setSearchTerm(d);
    if (c) setSelectedCategory(c);
    if (s) setSortBy(s);
    if (d) setSelectedDestination(d);
    if (e) setSelectedExperience(e);

    // Handle custom experience builder from homepage (only once)
    if (customBuilder === 'true' && !hasProcessedCustomBuilder.current) {
      hasProcessedCustomBuilder.current = true;
      
      // Pre-fill custom package builder with data from homepage
      const newCustomPackage = {
        destination: d || '',
        experiences: [] as any[],
        duration: 7,
        travelers: travelers ? parseInt(travelers) : 2,
        accommodation: '',
        startDate: dates || '',
        endDate: ''
      };
      
      // If a specific experience was selected from homepage
      if (selectedExperience && experienceName && featuredExperiences) {
        const experience = featuredExperiences.find(exp => exp.id.toString() === selectedExperience);
        if (experience) {
          newCustomPackage.experiences = [experience];
        }
      }
      
      setCustomPackage(newCustomPackage);
      onBuilderOpen(); // Open the custom package builder
    }
  }, [searchParams, featuredExperiences, onBuilderOpen]);

  // Scroll to custom builder section when it opens
  useEffect(() => {
    if (isBuilderOpen) {
      setTimeout(() => {
        const customBuilderSection = document.getElementById('custom-package-builder');
        if (customBuilderSection) {
          customBuilderSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [isBuilderOpen]);

  // Reset the ref when component unmounts
  useEffect(() => {
    return () => {
      hasProcessedCustomBuilder.current = false;
    };
  }, []);

  // Convert API data to the format expected by the component
  const packages: LocalPackage[] = apiPackages ? apiPackages.map(convertApiPackageToCardFormat) : [];

  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          pkg.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          pkg.destinations.some(dest => dest.toString().toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || pkg.category === selectedCategory;
    const matchesDestination = selectedDestination === 'all' || 
                              pkg.destinations.some(dest => dest.toString().toLowerCase().includes(selectedDestination.toLowerCase()));
    const matchesExperience = selectedExperience === 'all' || pkg.highlights.some(h => h.toLowerCase().includes(selectedExperience.toLowerCase()));
    const matchesPrice = pkg.price >= priceRange[0] && pkg.price <= priceRange[1];
    const matchesDuration = duration === 'all' || pkg.duration.includes(duration);

    return matchesSearch && matchesCategory && matchesDestination && matchesExperience && matchesPrice && matchesDuration;
  });

  // Sort packages
  const sortedPackages = [...filteredPackages].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'duration':
        return parseInt(a.duration) - parseInt(b.duration);
      case 'featured':
      default:
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    }
  });

  const categories = ['all', 'Adventure', 'Luxury', 'Budget', 'Family', 'Romantic'];
  const experienceTypes = ['all', 'Water Sports', 'Cultural', 'Adventure', 'Wellness', 'Food', 'Photography', 'Fishing', 'Diving', 'Sailing', 'Spa'];

  const handleWhatsAppBooking = (pkg: LocalPackage) => {
    const message = `Hi! I'm interested in booking the "${pkg.name}" package. Can you provide more details?`;
    const whatsappUrl = `https://wa.me/9607441097?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedDestination('all');
    setSelectedExperience('all');
    setPriceRange([0, 5000]);
    setDuration('all');
    setSortBy('featured');
  };

  const handleQuickSearch = (destination: string) => {
    setSelectedDestination(destination);
    setSearchTerm(destination);
    toast({
      title: `Filtering by ${destination}`,
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };

  // Custom Package Builder Functions
  const addExperience = (experience: any) => {
    setCustomPackage(prev => ({
      ...prev,
      experiences: [...prev.experiences, experience]
    }));
  };

  const removeExperience = (experienceId: number) => {
    setCustomPackage(prev => ({
      ...prev,
      experiences: prev.experiences.filter(exp => exp.id !== experienceId)
    }));
  };

  const calculateCustomPackagePrice = () => {
    const basePrice = customPackage.experiences.reduce((sum, exp) => sum + parseFloat(exp.price), 0);
    const durationMultiplier = customPackage.duration / 7; // Base price for 7 days
    const travelerMultiplier = customPackage.travelers / 2; // Base price for 2 people
    return Math.round(basePrice * durationMultiplier * travelerMultiplier);
  };

  const handleCustomPackageSubmit = () => {
    const totalPrice = calculateCustomPackagePrice();
    const message = `Hi! I'd like to create a custom package:
    
Destination: ${customPackage.destination}
Duration: ${customPackage.duration} days
Travelers: ${customPackage.travelers} people
Experiences: ${customPackage.experiences.map(exp => exp.name).join(', ')}
Estimated Budget: $${totalPrice}

Can you help me finalize this package?`;
    
    const whatsappUrl = `https://wa.me/9607441097?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    onBuilderClose();
  };

  if (packagesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (packagesError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading packages</h3>
          <p className="text-gray-600">{packagesError?.message || 'Unknown error'}</p>
        </div>
      </div>
    );
  }

  return (
    <Box bg="gray.50" className="bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Hero Banner */}
      <section className="py-16 relative overflow-hidden">
        {/* Background Images */}
        <Box position="absolute" top={0} left={0} right={0} bottom={0}>
          <Image 
            src="/src/assets/images/ishan45.jpg" 
            alt="Maldives Background"
            w="full" 
            h="full" 
            objectFit="cover" 
          />
          <Box position="absolute" top={0} left={0} right={0} bottom={0} bg="blackAlpha.500" />
        </Box>
        
        <Container maxW="7xl" className="relative z-10 text-center px-4">
          <VStack spacing={6}>
            <Badge 
              className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-bold border border-white/30"
            >
              <Icon as={FireIcon} className="w-4 h-4 mr-2" />
              Curated Packages & Custom Experiences
            </Badge>
            
            <Heading size="xl" className="text-4xl md:text-5xl font-bold text-white">
              🌟 Travel Packages & Experiences
            </Heading>
            
            <Text className="text-lg text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Choose from our curated packages or create your own custom experience. 
              From luxury getaways to adventure packages, find your perfect journey or design it yourself.
            </Text>

            {/* Quick Stats */}
            <HStack spacing={6} justify="center" flexWrap="wrap">
              <VStack spacing={1}>
                <Text className="text-2xl font-bold text-white">{packages.length}</Text>
                <Text className="text-blue-200 text-sm">Curated Packages</Text>
              </VStack>
              <VStack spacing={1}>
                <Text className="text-2xl font-bold text-white">{featuredExperiences?.length || 0}</Text>
                <Text className="text-blue-200 text-sm">Custom Experiences</Text>
              </VStack>
              <VStack spacing={1}>
                <Text className="text-2xl font-bold text-white">{destinations?.length || 0}</Text>
                <Text className="text-blue-200 text-sm">Destinations</Text>
              </VStack>
              <VStack spacing={1}>
                <Text className="text-2xl font-bold text-white">4.8★</Text>
                <Text className="text-blue-200 text-sm">Average Rating</Text>
              </VStack>
            </HStack>
          </VStack>
        </Container>
      </section>

      {/* Pre-made Packages Section */}
      <section className="py-16 bg-white">
        <Container maxW="7xl">
          <VStack spacing={12}>
            {/* Section Header */}
            <VStack spacing={4} textAlign="center">
              <Badge colorScheme="blue" variant="solid" px={4} py={2} borderRadius="full" fontSize="sm" fontWeight="semibold">
                <Icon as={StarIcon} className="w-4 h-4 mr-2" />
                Curated Packages
              </Badge>
              <Heading size="xl" className="text-3xl font-bold text-gray-800">
                Curated Maldives Packages
              </Heading>
              <Text className="text-lg text-gray-600 max-w-2xl">
                Handpicked packages combining the best accommodations, activities, and experiences for the perfect Maldives getaway
              </Text>
            </VStack>

            {/* Search and Filters */}
            <Card shadow="lg" borderRadius="xl" p={4} w="full">
              <CardBody>
                <VStack spacing={3}>
                  <HStack spacing={3} w="full" flexDir={{ base: "column", md: "row" }}>
                    <InputGroup>
                      <InputLeftElement>
                        <Icon as={MagnifyingGlassIcon} color="gray.400" />
                      </InputLeftElement>
                      <Input 
                        placeholder="Search packages, custom experiences, or destinations..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        size="md"
                        borderRadius="lg"
                      />
                    </InputGroup>
                    
                    <Select 
                      value={selectedDestination} 
                      onChange={(e) => setSelectedDestination(e.target.value)}
                      size="md"
                      borderRadius="lg"
                      w={{ base: "full", md: "auto" }}
                    >
                      <option value="all">All Destinations</option>
                      {destinations?.map(dest => (
                        <option key={dest.id} value={dest.name}>{dest.name}</option>
                      ))}
                    </Select>
                    
                    <Select 
                      value={selectedCategory} 
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      size="md"
                      borderRadius="lg"
                      w={{ base: "full", md: "auto" }}
                    >
                      <option value="all">All Categories</option>
                      {categories.slice(1).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </Select>
                  </HStack>
                  
                  <HStack spacing={3} w="full" justify="center">
                    <Button 
                      colorScheme="blue" 
                      size="md" 
                      leftIcon={<Icon as={MagnifyingGlassIcon} />}
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      Advanced Filters
                    </Button>
                    <Button 
                      variant="outline" 
                      size="md"
                      onClick={clearFilters}
                      leftIcon={<Icon as={InformationCircleIcon} />}
                    >
                      Clear All
                    </Button>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>

            {/* Advanced Filters */}
            {showFilters && (
              <Card shadow="md" borderRadius="lg" p={4} w="full">
                <CardBody>
                  <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4}>
                    <VStack align="start" spacing={2}>
                      <Text fontWeight="semibold">Duration</Text>
                      <Select value={duration} onChange={(e) => setDuration(e.target.value)}>
                        <option value="all">Any Duration</option>
                        <option value="3">3 Days</option>
                        <option value="5">5 Days</option>
                        <option value="7">7 Days</option>
                        <option value="10">10 Days</option>
                        <option value="14">14 Days</option>
                      </Select>
                    </VStack>
                    
                    <VStack align="start" spacing={2}>
                      <Text fontWeight="semibold">Sort By</Text>
                      <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="featured">Featured</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="rating">Rating</option>
                        <option value="duration">Duration</option>
                      </Select>
                    </VStack>
                    
                    <VStack align="start" spacing={2}>
                      <Text fontWeight="semibold">Price Range</Text>
                      <HStack spacing={2}>
                        <Input 
                          placeholder="Min" 
                          value={priceRange[0]} 
                          onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                        />
                        <Text>-</Text>
                        <Input 
                          placeholder="Max" 
                          value={priceRange[1]} 
                          onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 5000])}
                        />
                      </HStack>
                    </VStack>
                  </Grid>
                </CardBody>
              </Card>
            )}

            {/* Results Header */}
            <HStack justify="space-between" w="full" flexDir={{ base: "column", md: "row" }}>
              <VStack align={{ base: "center", md: "start" }} spacing={2}>
                <Heading size="lg" className="text-2xl font-bold text-gray-800">
                  {sortedPackages.length} Curated Packages Found
                </Heading>
                {searchTerm && (
                  <Text className="text-gray-600">
                    Showing results for "{searchTerm}"
                  </Text>
                )}
              </VStack>
              
              <HStack spacing={4}>
                <Button 
                  variant="outline" 
                  leftIcon={<Icon as={InformationCircleIcon} />}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  {showFilters ? 'Hide' : 'Show'} Filters
                </Button>
                <Button 
                  colorScheme="whatsapp" 
                  leftIcon={<Icon as={HeartIcon} />}
                  onClick={() => window.open(getWhatsAppUrl("Hi! I need help finding the perfect package"), '_blank')}
                >
                  Get Help
                </Button>
              </HStack>
            </HStack>

            {/* Enhanced Package Cards */}
            {sortedPackages.length > 0 ? (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} w="full">
                {sortedPackages.map(pkg => {
                  // Calculate discounted price (20% discount for featured packages, 10% for others)
                  const discountPercentage = pkg.featured ? 20 : 10;
                  const originalPrice = pkg.price;
                  const discountedPrice = originalPrice * (1 - discountPercentage / 100);
                  const savings = originalPrice - discountedPrice;

                  return (
                    <Card key={pkg.id} shadow="lg" borderRadius="xl" overflow="hidden" 
                          _hover={{ transform: 'translateY(-4px)', shadow: 'xl' }} transition="all 0.3s"
                          display="flex" flexDirection="column" h="full">
                      <Box position="relative" h="250px" flexShrink={0}>
                        <Image 
                          src={pkg.image} 
                          alt={pkg.name}
                          w="full" 
                          h="full" 
                          objectFit="cover" 
                        />
                        <Box position="absolute" top={0} left={0} right={0} bottom={0} bg="blackAlpha.400" />
                        
                        {/* Package Badges */}
                        <VStack position="absolute" top={4} left={4} align="start" spacing={2}>
                          {pkg.featured && (
                            <Badge colorScheme="yellow" variant="solid" px={3} py={1}>
                              <Icon as={StarIcon} className="w-3 h-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                          <Badge colorScheme="blue" variant="solid" px={3} py={1}>
                            {pkg.category}
                          </Badge>
                          <Badge colorScheme="green" variant="solid" px={3} py={1}>
                            {discountPercentage}% OFF
                          </Badge>
                        </VStack>

                        {/* Rating */}
                        <HStack position="absolute" top={4} right={4} bg="blackAlpha.700" px={2} py={1} borderRadius="md">
                          <Icon as={StarIcon} className="w-4 h-4 text-yellow-400" />
                          <Text color="white" fontSize="sm" fontWeight="semibold">{pkg.rating}</Text>
                          <Text color="gray-300" fontSize="sm">({pkg.reviewCount})</Text>
                        </HStack>

                        {/* Package Info Overlay */}
                        <VStack position="absolute" bottom={0} left={0} right={0} p={4} 
                                bg="linear-gradient(transparent, rgba(0,0,0,0.8))" spacing={2}>
                          <Text color="white" fontWeight="bold" fontSize="lg" textAlign="center">
                            {pkg.name}
                          </Text>
                          <HStack spacing={4} color="gray-200" fontSize="sm">
                            <HStack spacing={1}>
                              <Icon as={ClockIcon} className="w-4 h-4" />
                              <Text>{parseInt(pkg.duration)} days</Text>
                            </HStack>
                            <HStack spacing={1}>
                              <Icon as={UsersIcon} className="w-4 h-4" />
                              <Text>Up to {pkg.maxTravelers}</Text>
                            </HStack>
                          </HStack>
                        </VStack>
                      </Box>

                      <CardBody p={6} display="flex" flexDirection="column" flex={1}>
                        <VStack spacing={4} align="stretch" flex={1}>
                          <Text color="gray-600" noOfLines={3}>
                            {pkg.description}
                          </Text>

                          {/* Destinations */}
                          {pkg.destinations.length > 0 && (
                            <VStack align="start" spacing={2}>
                              <Text fontWeight="semibold" fontSize="sm" color="gray-700">Destinations:</Text>
                              <Wrap>
                                {pkg.destinations.slice(0, 3).map((dest, index) => (
                                  <WrapItem key={index}>
                                    <Badge colorScheme="green" variant="subtle">
                                      <Icon as={MapPinIcon} className="w-3 h-3 mr-1" />
                                      {dest}
                                    </Badge>
                                  </WrapItem>
                                ))}
                                {pkg.destinations.length > 3 && (
                                  <WrapItem>
                                    <Badge colorScheme="gray" variant="subtle">
                                      +{pkg.destinations.length - 3} more
                                    </Badge>
                                  </WrapItem>
                                )}
                              </Wrap>
                            </VStack>
                          )}

                          {/* Highlights */}
                          {pkg.highlights.length > 0 && (
                            <VStack align="start" spacing={2}>
                              <Text fontWeight="semibold" fontSize="sm" color="gray-700">Highlights:</Text>
                              <List spacing={1}>
                                {pkg.highlights.slice(0, 3).map((highlight, index) => (
                                  <ListItem key={index} fontSize="sm" color="gray-600">
                                    <ListIcon as={CheckIcon} color="green.500" />
                                    {highlight}
                                  </ListItem>
                                ))}
                                {pkg.highlights.length > 3 && (
                                  <ListItem fontSize="sm" color="gray-500">
                                    <ListIcon as={CheckIcon} color="green.500" />
                                    +{pkg.highlights.length - 3} more activities
                                  </ListItem>
                                )}
                              </List>
                            </VStack>
                          )}

                          {/* Included Items */}
                          {pkg.included.length > 0 && (
                            <VStack align="start" spacing={2}>
                              <Text fontWeight="semibold" fontSize="sm" color="gray-700">What's Included:</Text>
                              <List spacing={1}>
                                {pkg.included.slice(0, 2).map((item, index) => (
                                  <ListItem key={index} fontSize="sm" color="gray-600">
                                    <ListIcon as={CheckIcon} color="blue.500" />
                                    {item}
                                  </ListItem>
                                ))}
                                {pkg.included.length > 2 && (
                                  <ListItem fontSize="sm" color="gray-500">
                                    <ListIcon as={CheckIcon} color="blue.500" />
                                    +{pkg.included.length - 2} more inclusions
                                  </ListItem>
                                )}
                              </List>
                            </VStack>
                          )}

                          <Divider />

                          {/* Price and Actions - Fixed at bottom */}
                          <VStack spacing={3} mt="auto">
                            <HStack justify="space-between" w="full">
                              <VStack align="start" spacing={0}>
                                <Text fontSize="2xl" fontWeight="bold" color="green.500">
                                  ${discountedPrice.toLocaleString()}
                                </Text>
                                <Text fontSize="sm" color="gray-500" textDecoration="line-through">
                                  ${originalPrice.toLocaleString()}
                                </Text>
                                <Text fontSize="sm" color="green.600" fontWeight="semibold">
                                  Save ${savings.toLocaleString()} ({discountPercentage}% off)
                                </Text>
                              </VStack>
                              <VStack align="end" spacing={0}>
                                <Text fontSize="sm" color="gray-500">Total for {pkg.maxTravelers}</Text>
                                <Text fontSize="lg" fontWeight="semibold" color="gray-700">
                                  ${(discountedPrice * pkg.maxTravelers).toLocaleString()}
                                </Text>
                              </VStack>
                            </HStack>

                            <HStack spacing={3} w="full">
                              <Button 
                                colorScheme="green" 
                                flex={1}
                                onClick={() => handleWhatsAppBooking(pkg)}
                                leftIcon={<Icon as={HeartIcon} />}
                              >
                                Book Now
                              </Button>
                              <Button 
                                variant="outline" 
                                colorScheme="blue"
                                onClick={() => window.open(`/packages/${pkg.id}`, '_blank')}
                              >
                                Details
                              </Button>
                            </HStack>
                          </VStack>
                        </VStack>
                      </CardBody>
                    </Card>
                  );
                })}
              </SimpleGrid>
            ) : (
              <VStack spacing={6} py={12}>
                <Icon as={InformationCircleIcon} className="w-16 h-16 text-gray-400" />
                <VStack spacing={2}>
                  <Heading size="md" className="text-xl font-semibold text-gray-700">
                    No packages found
                  </Heading>
                  <Text className="text-gray-500 text-center max-w-md">
                    Try adjusting your search criteria or filters to find more packages.
                  </Text>
                </VStack>
                <Button 
                  colorScheme="blue" 
                  onClick={clearFilters}
                  leftIcon={<Icon as={InformationCircleIcon} />}
                >
                  Clear All Filters
                </Button>
              </VStack>
            )}
          </VStack>
        </Container>
      </section>

      {/* Custom Package Builder Section */}
      <section id="custom-package-builder" className="py-16 bg-gradient-to-br from-purple-50 to-indigo-50">
        <Container maxW="7xl">
          <VStack spacing={12}>
            {/* Section Header */}
            <VStack spacing={4} textAlign="center">
              <Badge colorScheme="purple" variant="solid" px={4} py={2} borderRadius="full" fontSize="sm" fontWeight="semibold">
                <Icon as={SparklesIcon} className="w-4 h-4 mr-2" />
                Custom Package Builder
              </Badge>
              <Heading size="xl" className="text-3xl font-bold text-gray-800">
                Create Your Own Package
              </Heading>
              <Text className="text-lg text-gray-600 max-w-2xl">
                Don't see a package that fits your needs? Design your own custom Maldives experience 
                by combining destinations, experiences, and accommodations exactly how you want them.
              </Text>
            </VStack>

            {/* Package Builder Card */}
            <Card shadow="2xl" borderRadius="xl" p={8} w="full" bg="white">
              <CardBody>
                <VStack spacing={8}>
                  {/* Builder Progress */}
                  <VStack spacing={4} w="full">
                    <HStack justify="space-between" w="full">
                      <Text fontWeight="semibold" color="gray-700">Package Progress</Text>
                      <Text fontSize="sm" color="gray-500">
                        {customPackage.destination ? '1' : '0'}/4 steps completed
                      </Text>
                    </HStack>
                    <Progress 
                      value={customPackage.destination ? 25 : 0} 
                      colorScheme="purple" 
                      borderRadius="full" 
                      h={2}
                    />
                  </VStack>

                  {/* Builder Steps */}
                  <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap={8} w="full">
                    {/* Left Column - Builder Form */}
                    <VStack spacing={6} align="stretch">
                      <Heading size="md" color="gray-800">Package Details</Heading>
                      
                      {/* Destination Selection */}
                      <VStack align="start" spacing={3}>
                        <Text fontWeight="semibold" color="gray-700">Choose Destination</Text>
                        <Select 
                          placeholder="Select your destination"
                          value={customPackage.destination}
                          onChange={(e) => setCustomPackage(prev => ({ ...prev, destination: e.target.value }))}
                          size="lg"
                        >
                          {destinations?.map(dest => (
                            <option key={dest.id} value={dest.name}>{dest.name}</option>
                          ))}
                        </Select>
                      </VStack>

                      {/* Duration and Travelers */}
                      <HStack spacing={4}>
                        <VStack align="start" spacing={3} flex={1}>
                          <Text fontWeight="semibold" color="gray-700">Duration (days)</Text>
                          <NumberInput 
                            value={customPackage.duration} 
                            onChange={(_, value) => setCustomPackage(prev => ({ ...prev, duration: value }))}
                            min={1} 
                            max={30}
                            size="lg"
                          >
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        </VStack>

                        <VStack align="start" spacing={3} flex={1}>
                          <Text fontWeight="semibold" color="gray-700">Number of Travelers</Text>
                          <NumberInput 
                            value={customPackage.travelers} 
                            onChange={(_, value) => setCustomPackage(prev => ({ ...prev, travelers: value }))}
                            min={1} 
                            max={20}
                            size="lg"
                          >
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        </VStack>
                      </HStack>

                      {/* Date Selection */}
                      <HStack spacing={4}>
                        <VStack align="start" spacing={3} flex={1}>
                          <Text fontWeight="semibold" color="gray-700">Start Date</Text>
                          <Input 
                            type="date"
                            value={customPackage.startDate}
                            onChange={(e) => setCustomPackage(prev => ({ ...prev, startDate: e.target.value }))}
                            size="lg"
                          />
                        </VStack>

                        <VStack align="start" spacing={3} flex={1}>
                          <Text fontWeight="semibold" color="gray-700">End Date</Text>
                          <Input 
                            type="date"
                            value={customPackage.endDate}
                            onChange={(e) => setCustomPackage(prev => ({ ...prev, endDate: e.target.value }))}
                            size="lg"
                          />
                        </VStack>
                      </HStack>
                    </VStack>

                    {/* Right Column - Selected Experiences */}
                    <VStack spacing={6} align="stretch">
                      <HStack justify="space-between">
                        <Heading size="md" color="gray-800">Selected Experiences</Heading>
                        <Text fontSize="sm" color="gray-500">
                          {customPackage.experiences.length} selected
                        </Text>
                      </HStack>

                      {customPackage.experiences.length > 0 ? (
                        <VStack spacing={3} align="stretch">
                          {customPackage.experiences.map((exp, index) => (
                            <Card key={exp.id} variant="outline" p={3}>
                              <HStack justify="space-between">
                                <VStack align="start" spacing={1} flex={1}>
                                  <Text fontWeight="semibold" fontSize="sm">{exp.name}</Text>
                                  <Text fontSize="xs" color="gray-500">{exp.duration} • ${exp.price}</Text>
                                </VStack>
                                <Button 
                                  size="sm" 
                                  colorScheme="red" 
                                  variant="ghost"
                                  onClick={() => removeExperience(exp.id)}
                                >
                                  <Icon as={MinusIcon} className="w-4 h-4" />
                                </Button>
                              </HStack>
                            </Card>
                          ))}
                        </VStack>
                      ) : (
                        <Card variant="outline" p={6} textAlign="center">
                          <VStack spacing={2}>
                            <Icon as={PlusIcon} className="w-8 h-8 text-gray-400" />
                            <Text color="gray-500">No experiences selected yet</Text>
                            <Text fontSize="sm" color="gray-400">Choose experiences from the list below</Text>
                          </VStack>
                        </Card>
                      )}

                      {/* Package Summary */}
                      {customPackage.experiences.length > 0 && (
                        <Card bg="purple.50" p={4}>
                          <VStack spacing={2}>
                            <HStack justify="space-between" w="full">
                              <Text fontWeight="semibold">Estimated Total:</Text>
                              <Text fontSize="lg" fontWeight="bold" color="purple.600">
                                ${calculateCustomPackagePrice().toLocaleString()}
                              </Text>
                            </HStack>
                            <Text fontSize="sm" color="gray-600">
                              For {customPackage.travelers} people, {customPackage.duration} days
                            </Text>
                          </VStack>
                        </Card>
                      )}
                    </VStack>
                  </Grid>

                  {/* Available Experiences */}
                  {featuredExperiences && featuredExperiences.length > 0 && (
                    <VStack spacing={6} align="stretch" w="full">
                      <Heading size="md" color="gray-800">Available Experiences</Heading>
                      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                        {featuredExperiences.map(exp => (
                          <Card 
                            key={exp.id} 
                            variant="outline" 
                            p={4} 
                            cursor="pointer"
                            _hover={{ shadow: "md", borderColor: "purple.300" }}
                            onClick={() => addExperience(exp)}
                          >
                            <VStack spacing={3} align="stretch">
                              <HStack justify="space-between">
                                <Text fontWeight="semibold" fontSize="sm">{exp.name}</Text>
                                <Badge colorScheme="purple" variant="subtle" fontSize="xs">
                                  {exp.experience_type.replace('_', ' ')}
                                </Badge>
                              </HStack>
                              <Text fontSize="xs" color="gray-600" noOfLines={2}>
                                {exp.description}
                              </Text>
                              <HStack justify="space-between" fontSize="sm">
                                <HStack spacing={1}>
                                  <Icon as={ClockIcon} className="w-3 h-3" />
                                  <Text>{exp.duration}</Text>
                                </HStack>
                                <Text fontWeight="semibold" color="purple.600">${exp.price}</Text>
                              </HStack>
                            </VStack>
                          </Card>
                        ))}
                      </SimpleGrid>
                    </VStack>
                  )}

                  {/* Submit Button */}
                  <Button 
                    colorScheme="purple" 
                    size="lg" 
                    w="full"
                    onClick={handleCustomPackageSubmit}
                    leftIcon={<Icon as={HeartIcon} />}
                    isDisabled={!customPackage.destination || customPackage.experiences.length === 0}
                  >
                    Create Custom Package & Get Quote
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          </VStack>
        </Container>
      </section>
    </Box>
  );
}

export default PackagesPage; 