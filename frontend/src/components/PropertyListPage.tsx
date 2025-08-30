import React, { useEffect, useMemo, useState } from 'react';
import { MagnifyingGlassIcon, SparklesIcon, GlobeAltIcon, MapIcon, ArrowRightIcon, InformationCircleIcon, FireIcon, HomeIcon, StarIcon, UsersIcon } from '@heroicons/react/24/outline';
import { PropertyCard } from './ui/PropertyCard';
import { useProperties, useDestinations, useWhatsApp } from '../hooks/useQueries';
import { LoadingSpinner } from './LoadingSpinner';
import { ComponentErrorBoundary } from './SimpleErrorBoundary';
import { SEO } from './SEO';
import { getWhatsAppUrl } from '../config';
import { useSearchParams } from 'react-router-dom';
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
  GridItem
} from '@chakra-ui/react';

export function PropertyListPage() {
  const { data: properties, isLoading, error } = useProperties();
  const { data: destinations } = useDestinations();
  const { getWhatsAppUrl } = useWhatsApp();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('all');
  const [selectedPropertyType, setSelectedPropertyType] = useState('all');
  const [selectedAmenity, setSelectedAmenity] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const q = searchParams.get('search');
    const d = searchParams.get('destination');
    if (q) setSearchTerm(q);
    else if (d) setSearchTerm(d);
    if (d) setSelectedDestination(d);
  }, [searchParams]);

  const filtered = useMemo(() => {
    if (!properties) return [];
    
    let filteredProps = properties;
    
    // Search filter
    if (searchTerm) {
      const needle = searchTerm.toLowerCase();
      filteredProps = filteredProps.filter(p =>
        p.name.toLowerCase().includes(needle) ||
        p.description.toLowerCase().includes(needle) ||
        p.location.island.toLowerCase().includes(needle) ||
        p.location.atoll.toLowerCase().includes(needle)
      );
    }
    
    // Destination filter
    if (selectedDestination !== 'all') {
      filteredProps = filteredProps.filter(p =>
        p.location.island.toLowerCase().includes(selectedDestination.toLowerCase()) ||
        p.location.atoll.toLowerCase().includes(selectedDestination.toLowerCase())
      );
    }
    
    // Property type filter
    if (selectedPropertyType !== 'all') {
      filteredProps = filteredProps.filter(p =>
        p.property_type?.name.toLowerCase().includes(selectedPropertyType.toLowerCase())
      );
    }
    
    // Price filter
    filteredProps = filteredProps.filter(p => {
      const price = parseFloat(p.price || '0');
      return price >= priceRange[0] && price <= priceRange[1];
    });
    
    return filteredProps;
  }, [properties, searchTerm, selectedDestination, selectedPropertyType, selectedAmenity, priceRange]);

  // Sort properties
  const sortedProperties = useMemo(() => {
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return parseFloat(a.price) - parseFloat(b.price);
        case 'price-high':
          return parseFloat(b.price) - parseFloat(a.price);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'featured':
        default:
          return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
      }
    });
  }, [filtered, sortBy]);

  const propertyTypes = useMemo(() => {
    if (!properties) return [];
    const types = new Set(properties.map(p => p.property_type?.name).filter(Boolean));
    return Array.from(types);
  }, [properties]);

  const amenities = useMemo(() => {
    if (!properties) return [];
    const allAmenities = properties.flatMap(p => p.amenities?.map(a => a.name) || []);
    const uniqueAmenities = new Set(allAmenities);
    return Array.from(uniqueAmenities).slice(0, 10); // Top 10 amenities
  }, [properties]);

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

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDestination('all');
    setSelectedPropertyType('all');
    setSelectedAmenity('all');
    setPriceRange([0, 1000]);
    setSortBy('featured');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading properties</h3>
          <p className="text-gray-600">{error?.message || 'Unknown error'}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Properties - Find Your Perfect Stay"
        description="Browse our collection of luxury properties and accommodations in the Maldives"
        keywords="properties, accommodation, hotels, resorts, Maldives"
      />
      
      <ComponentErrorBoundary componentName="PropertyListPage">
        <Box bg="gray.50" className="bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
          {/* Enhanced Hero Section */}
          <section className="py-16 relative overflow-hidden">
            {/* Background Images */}
            <Box position="absolute" top={0} left={0} right={0} bottom={0}>
              <Image 
                src="/src/assets/images/ishan46.jpg" 
                alt="Maldives Properties Background"
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
                  <Icon as={HomeIcon} className="w-4 h-4 mr-2" />
                  Luxury Accommodations
                </Badge>
                
                <Heading size="xl" className="text-4xl md:text-5xl font-bold text-white">
                  🏝️ Luxury Properties
                </Heading>
                
                <Text className="text-lg text-blue-100 max-w-3xl mx-auto leading-relaxed">
                  Discover handpicked luxury properties across the Maldives. From overwater villas to beachfront resorts, 
                  find your perfect accommodation with world-class amenities and stunning locations.
                </Text>

                {/* Quick Stats */}
                <HStack spacing={6} justify="center" flexWrap="wrap">
                  <VStack spacing={1}>
                    <Text className="text-2xl font-bold text-white">{(properties?.length || 0).toString()}</Text>
                    <Text className="text-blue-200 text-sm">Total Properties</Text>
                  </VStack>
                  <VStack spacing={1}>
                    <Text className="text-2xl font-bold text-white">{(destinations?.length || 0).toString()}</Text>
                    <Text className="text-blue-200 text-sm">Destinations</Text>
                  </VStack>
                  <VStack spacing={1}>
                    <Text className="text-2xl font-bold text-white">24/7</Text>
                    <Text className="text-blue-200 text-sm">Support</Text>
                  </VStack>
                  <VStack spacing={1}>
                    <Text className="text-2xl font-bold text-white">4.9★</Text>
                    <Text className="text-blue-200 text-sm">Average Rating</Text>
                  </VStack>
                </HStack>

                {/* Enhanced Search Bar */}
                <Card bg="white" shadow="2xl" borderRadius="xl" p={4} w="full" maxW="4xl">
                  <CardBody>
                    <VStack spacing={3}>
                      <HStack spacing={3} w="full" flexDir={{ base: "column", md: "row" }}>
                        <InputGroup>
                          <InputLeftElement>
                            <Icon as={MagnifyingGlassIcon} color="gray.400" />
                          </InputLeftElement>
                          <Input 
                            placeholder="Search properties, destinations, or amenities..." 
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
                          value={selectedPropertyType} 
                          onChange={(e) => setSelectedPropertyType(e.target.value)}
                          size="md"
                          borderRadius="lg"
                          w={{ base: "full", md: "auto" }}
                        >
                          <option value="all">All Types</option>
                          {propertyTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
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
              </VStack>
            </Container>
          </section>

          {/* Popular Destinations Quick Filter */}
          {destinations && destinations.length > 0 && (
            <section className="py-12 bg-white">
              <Container maxW="7xl">
                <VStack spacing={8}>
                  <VStack spacing={2}>
                    <Heading size="lg" className="text-2xl font-bold text-gray-800">
                      Popular Destinations
                    </Heading>
                    <Text className="text-gray-600">Quick filter by popular Maldives destinations</Text>
                  </VStack>
                  
                  <Wrap spacing={4} justify="center">
                    <WrapItem>
                      <Button 
                        variant="outline" 
                        colorScheme="blue"
                        onClick={() => handleQuickSearch('')}
                        leftIcon={<Icon as={MapIcon} />}
                      >
                        All Destinations
                      </Button>
                    </WrapItem>
                    {destinations.slice(0, 8).map(dest => (
                      <WrapItem key={dest.id}>
                        <Button 
                          variant="outline" 
                          colorScheme="blue"
                          onClick={() => handleQuickSearch(dest.name)}
                          leftIcon={<Icon as={MapIcon} />}
                        >
                          {dest.name}
                        </Button>
                      </WrapItem>
                    ))}
                  </Wrap>
                </VStack>
              </Container>
            </section>
          )}

          {/* Advanced Filters */}
          {showFilters && (
            <section className="py-8 bg-white border-b">
              <Container maxW="7xl">
                <VStack spacing={6}>
                  <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6} w="full">
                    <VStack align="start" spacing={2}>
                      <Text fontWeight="semibold">Property Type</Text>
                      <Select value={selectedPropertyType} onChange={(e) => setSelectedPropertyType(e.target.value)}>
                        <option value="all">All Types</option>
                        {propertyTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </Select>
                    </VStack>
                    
                    <VStack align="start" spacing={2}>
                      <Text fontWeight="semibold">Amenity</Text>
                      <Select value={selectedAmenity} onChange={(e) => setSelectedAmenity(e.target.value)}>
                        <option value="all">All Amenities</option>
                        {amenities.map(amenity => (
                          <option key={amenity} value={amenity}>{amenity}</option>
                        ))}
                      </Select>
                    </VStack>
                    
                    <VStack align="start" spacing={2}>
                      <Text fontWeight="semibold">Sort By</Text>
                      <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="featured">Featured</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="rating">Rating</option>
                        <option value="name">Name</option>
                      </Select>
                    </VStack>
                  </Grid>
                </VStack>
              </Container>
            </section>
          )}

          {/* Results Section */}
          <section className="py-12">
            <Container maxW="7xl">
              <VStack spacing={8}>
                {/* Results Header */}
                <HStack justify="space-between" w="full" flexDir={{ base: "column", md: "row" }}>
                  <VStack align={{ base: "center", md: "start" }} spacing={2}>
                    <Heading size="lg" className="text-2xl font-bold text-gray-800">
                      {sortedProperties.length} Properties Found
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
                      leftIcon={<Icon as={StarIcon} />}
                      onClick={() => window.open(getWhatsAppUrl("Hi! I need help finding the perfect property"), '_blank')}
                    >
                      Get Help
                    </Button>
                  </HStack>
                </HStack>

                {/* Properties Grid */}
                {sortedProperties.length > 0 ? (
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} w="full">
                    {sortedProperties.map(property => (
                      <PropertyCard key={property.id} property={property} />
                    ))}
                  </SimpleGrid>
                ) : (
                  <VStack spacing={6} py={12}>
                    <Icon as={InformationCircleIcon} className="w-16 h-16 text-gray-400" />
                    <VStack spacing={2}>
                      <Heading size="md" className="text-xl font-semibold text-gray-700">
                        No properties found
                      </Heading>
                      <Text className="text-gray-500 text-center max-w-md">
                        Try adjusting your search criteria or filters to find more properties.
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
        </Box>
      </ComponentErrorBoundary>
    </>
  );
} 