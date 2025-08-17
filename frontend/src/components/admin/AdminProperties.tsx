import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  Icon,
  Input,
  Select,
  Text,
  HStack,
  VStack,
  IconButton,
  Checkbox,
  Divider,
  Alert,
  Spinner,
  Center,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  FormControl,
  FormLabel,
  Image,
  Badge,
} from '@chakra-ui/react';
import {
  BuildingOffice2Icon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  DocumentArrowDownIcon,
  Squares2X2Icon,
  ListBulletIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { LoadingSpinner } from '../LoadingSpinner';
import { PropertyForm } from './PropertyForm';
import { apiGet, apiDelete, apiPost, apiPut } from '../../api';
import type { Property, PropertyType, Location, Amenity } from '../../types';
import { formatPrice, truncateText } from '../../utils/formatting';

interface Filters {
  propertyType: string;
  location: string;
  priceRange: string;
}

export function AdminProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | undefined>();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Filters>({
    propertyType: '',
    location: '',
    priceRange: ''
  });
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [bulkAction, setBulkAction] = useState('');
  
  const toast = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [propertiesData, typesData, locationsData, amenitiesData] = await Promise.all([
        apiGet('properties/'),
        apiGet('property-types/'),
        apiGet('locations/'),
        apiGet('amenities/')
      ]);

      setProperties(propertiesData.results || propertiesData);
      setPropertyTypes(typesData.results || typesData);
      setLocations(locationsData.results || locationsData);
      setAmenities(amenitiesData.results || amenitiesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      toast({
        title: 'Error',
        description: 'Failed to fetch properties data',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refresh = () => {
    setError(null);
    fetchData();
  };

  const handleAdd = () => {
    setEditingProperty(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this property?')) return;
    
    try {
      await apiDelete(`properties/${id}/`);
      setProperties(properties.filter(p => p.id !== id));
      toast({
        title: 'Success',
        description: 'Property deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to delete property',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleSaveProperty = async (propertyData: Partial<Property>) => {
    try {
      if (editingProperty) {
        const updatedProperty = await apiPut(`properties/${editingProperty.id}/`, propertyData);
        setProperties(properties.map(p => p.id === editingProperty.id ? updatedProperty : p));
        toast({
          title: 'Success',
          description: 'Property updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        const newProperty = await apiPost('properties/', propertyData);
        setProperties([...properties, newProperty]);
        toast({
          title: 'Success',
          description: 'Property created successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      setIsFormOpen(false);
      setEditingProperty(undefined);
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to save property',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const toggleSelection = (id: number) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedItems(filteredProperties.map(p => p.id));
  };

  const clearSelection = () => {
    setSelectedItems([]);
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedItems.length} properties?`)) return;
    
    try {
      await Promise.all(selectedItems.map(id => apiDelete(`properties/${id}/`)));
      setProperties(properties.filter(p => !selectedItems.includes(p.id)));
      setSelectedItems([]);
      toast({
        title: 'Success',
        description: `${selectedItems.length} properties deleted successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to delete some properties',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({ propertyType: '', location: '', priceRange: '' });
  };

  const handleExport = () => {
    toast({
      title: 'Coming Soon',
      description: 'Export functionality will be available soon',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  // Filter and sort properties
  const filteredProperties = properties
    .filter(property => {
      const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           property.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = !filters.propertyType || 
        (typeof property.property_type === 'object' ? property.property_type.id.toString() : property.property_type) === filters.propertyType;
      const matchesLocation = !filters.location || 
        (typeof property.location === 'object' ? property.location.id.toString() : property.location) === filters.location;
      
      return matchesSearch && matchesType && matchesLocation;
    })
    .sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'price':
          aValue = parseFloat(a.price_per_night);
          bValue = parseFloat(b.price_per_night);
          break;
        case 'property_type':
          aValue = typeof a.property_type === 'object' ? a.property_type.name : a.property_type;
          bValue = typeof b.property_type === 'object' ? b.property_type.name : b.property_type;
          break;
        case 'location':
          aValue = typeof a.location === 'object' ? a.location.island : a.location;
          bValue = typeof b.location === 'object' ? b.location.island : b.location;
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  if (isLoading) {
    return (
      <Center minH="100vh">
        <Spinner size="xl" color="blue.500" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center minH="100vh">
        <Alert status="error" maxW="md">
          <Icon as={ExclamationTriangleIcon} color="red.500" />
          <VStack align="start" spacing={4}>
            <Text>{error}</Text>
            <Button onClick={refresh} colorScheme="blue">
              Retry
            </Button>
          </VStack>
        </Alert>
      </Center>
    );
  }

  return (
    <Container maxW="7xl" py={8}>
      {/* Header */}
      <Box bg="white" borderRadius="xl" shadow="sm" border="1px solid" borderColor="gray.200" p={8} mb={8}>
        <Flex direction={{ base: 'column', lg: 'row' }} align={{ base: 'start', lg: 'center' }} justify="space-between">
          <Flex align="center" gap={6} mb={{ base: 6, lg: 0 }}>
            <Box
              w={16}
              h={16}
              bgGradient="linear(to-br, blue.500, blue.600)"
              borderRadius="xl"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Icon as={BuildingOffice2Icon} h={8} w={8} color="white" />
            </Box>
            <VStack align="start" spacing={2}>
              <Heading size="lg" color="gray.800">Properties</Heading>
              <Text color="gray.600">Manage your property listings and bookings</Text>
            </VStack>
          </Flex>
          <Flex direction={{ base: 'column', sm: 'row' }} gap={4}>
            <Button
              leftIcon={<Icon as={PlusIcon} />}
              colorScheme="blue"
              onClick={handleAdd}
            >
              Add Property
            </Button>
            {selectedItems.length > 0 && (
              <Button
                leftIcon={<Icon as={TrashIcon} />}
                colorScheme="red"
                onClick={handleBulkDelete}
              >
                Delete Selected ({selectedItems.length})
              </Button>
            )}
          </Flex>
        </Flex>
      </Box>

      {/* Filter Bar */}
      <Box bg="white" borderRadius="xl" shadow="sm" border="1px solid" borderColor="gray.200" mb={8} p={6}>
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(5, 1fr)' }} gap={6}>
          <FormControl>
            <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">Search</FormLabel>
            <Input
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">Property Type</FormLabel>
            <Select
              value={filters.propertyType}
              onChange={(e) => setFilters(prev => ({ ...prev, propertyType: e.target.value }))}
              placeholder="All Types"
            >
              {propertyTypes.map((type) => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">Location</FormLabel>
            <Select
              value={filters.location}
              onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
              placeholder="All Locations"
            >
              {locations.map((location) => (
                <option key={location.id} value={location.id}>{location.island}</option>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">Sort By</FormLabel>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Name</option>
              <option value="price">Price</option>
              <option value="property_type">Type</option>
              <option value="location">Location</option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">Order</FormLabel>
            <Select
              value={sortDirection}
              onChange={(e) => setSortDirection(e.target.value as 'asc' | 'desc')}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </Select>
          </FormControl>
        </Grid>
        <Divider my={6} />
        <Flex justify="space-between" align="center">
          <HStack spacing={3}>
            <Button
              leftIcon={<Icon as={FunnelIcon} />}
              variant="outline"
              size="sm"
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
            <Button
              leftIcon={<Icon as={DocumentArrowDownIcon} />}
              variant="outline"
              size="sm"
              onClick={handleExport}
            >
              Export CSV
            </Button>
          </HStack>
          <HStack spacing={4}>
            <HStack spacing={2}>
              <IconButton
                aria-label="Grid view"
                icon={<Icon as={Squares2X2Icon} />}
                size="sm"
                variant={viewMode === 'grid' ? 'solid' : 'ghost'}
                colorScheme={viewMode === 'grid' ? 'blue' : 'gray'}
                onClick={() => setViewMode('grid')}
              />
              <IconButton
                aria-label="List view"
                icon={<Icon as={ListBulletIcon} />}
                size="sm"
                variant={viewMode === 'list' ? 'solid' : 'ghost'}
                colorScheme={viewMode === 'list' ? 'blue' : 'gray'}
                onClick={() => setViewMode('list')}
              />
            </HStack>
            <Text fontSize="sm" color="gray.600">
              {filteredProperties.length} of {properties.length} properties
            </Text>
          </HStack>
        </Flex>
      </Box>

      {/* Bulk Selection Header */}
      {selectedItems.length > 0 && (
        <Box bg="blue.50" border="1px solid" borderColor="blue.200" borderRadius="xl" mb={6} p={4}>
          <Flex justify="space-between" align="center">
            <HStack spacing={3}>
              <Checkbox
                isChecked={selectedItems.length === filteredProperties.length}
                onChange={selectedItems.length === filteredProperties.length ? clearSelection : selectAll}
              />
              <Text fontWeight="medium" color="blue.900">
                {selectedItems.length} property{selectedItems.length !== 1 ? 'ies' : 'y'} selected
              </Text>
            </HStack>
            <HStack spacing={2}>
              <Select
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
                size="sm"
                maxW="200px"
              >
                <option value="">Choose action...</option>
                <option value="delete">Delete Selected</option>
              </Select>
              <Button
                colorScheme="red"
                size="sm"
                onClick={handleBulkDelete}
                isDisabled={!bulkAction}
              >
                Apply
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearSelection}
              >
                Clear Selection
              </Button>
            </HStack>
          </Flex>
        </Box>
      )}

      {/* Properties Display */}
      {viewMode === 'grid' ? (
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
          {filteredProperties.map((property) => (
            <Box key={property.id} bg="white" borderRadius="xl" shadow="sm" border="1px solid" borderColor="gray.200" overflow="hidden" _hover={{ shadow: 'xl' }} transition="all 0.3s">
              {/* Property Image */}
              <Box position="relative" h="200px" bg="gray.100">
                {property.images && property.images.length > 0 ? (
                  <Image
                    src={property.images[0].image}
                    alt={property.name}
                    w="full"
                    h="full"
                    objectFit="cover"
                    fallback={
                      <Center h="full">
                        <VStack spacing={2}>
                          <Icon as={BuildingOffice2Icon} h={8} w={8} color="gray.400" />
                          <Text fontSize="sm" color="gray.500">No Image</Text>
                        </VStack>
                      </Center>
                    }
                  />
                ) : (
                  <Center h="full">
                    <VStack spacing={2}>
                      <Icon as={BuildingOffice2Icon} h={8} w={8} color="gray.400" />
                      <Text fontSize="sm" color="gray.500">No Image</Text>
                    </VStack>
                  </Center>
                )}
                {/* Image count badge */}
                {property.images && property.images.length > 1 && (
                  <Badge
                    position="absolute"
                    top={2}
                    right={2}
                    colorScheme="blackAlpha"
                    variant="solid"
                    fontSize="xs"
                  >
                    +{property.images.length - 1}
                  </Badge>
                )}
              </Box>
              
              <Box p={6}>
                <Flex justify="space-between" align="start" mb={4}>
                  <HStack spacing={2}>
                    <Checkbox
                      isChecked={selectedItems.includes(property.id)}
                      onChange={() => toggleSelection(property.id)}
                    />
                    <Text fontSize="sm" fontWeight="medium" color="gray.500">#{property.id}</Text>
                  </HStack>
                  <HStack spacing={1}>
                    <IconButton
                      aria-label="View property"
                      icon={<Icon as={EyeIcon} />}
                      size="sm"
                      variant="ghost"
                    />
                    <IconButton
                      aria-label="Edit property"
                      icon={<Icon as={PencilIcon} />}
                      size="sm"
                      variant="ghost"
                      colorScheme="blue"
                      onClick={() => handleEdit(property)}
                    />
                    <IconButton
                      aria-label="Delete property"
                      icon={<Icon as={TrashIcon} />}
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => handleDelete(property.id)}
                    />
                  </HStack>
                </Flex>
                
                <VStack align="start" spacing={3} mb={4}>
                  <Heading size="md" noOfLines={1}>{property.name}</Heading>
                  <Text color="gray.600" noOfLines={2}>{property.description}</Text>
                  <HStack justify="space-between" w="full">
                    <Text color="gray.500" fontSize="sm">
                      {typeof property.location === 'object' ? property.location.island : 'Unknown'}
                    </Text>
                    <Text fontWeight="semibold" color="blue.600">
                      {formatPrice(parseFloat(property.price_per_night))}
                    </Text>
                  </HStack>
                </VStack>
                
                <Divider mb={3} />
                <HStack justify="space-between" fontSize="xs" color="gray.500">
                  <Text>Type: {typeof property.property_type === 'object' ? property.property_type.name : 'Unknown'}</Text>
                  <Text>{property.amenities?.length || 0} amenities</Text>
                </HStack>
              </Box>
            </Box>
          ))}
        </Grid>
      ) : (
        <Box bg="white" borderRadius="xl" shadow="sm" border="1px solid" borderColor="gray.200">
          <Box p={6}>
            <Text fontSize="lg" fontWeight="semibold" mb={4}>Properties List</Text>
            <VStack spacing={4} align="stretch">
              {filteredProperties.map((property) => (
                <Box key={property.id} p={4} border="1px solid" borderColor="gray.200" borderRadius="lg" _hover={{ bg: 'gray.50' }}>
                  <Flex justify="space-between" align="center">
                    <HStack spacing={3}>
                      <Checkbox
                        isChecked={selectedItems.includes(property.id)}
                        onChange={() => toggleSelection(property.id)}
                      />
                      {/* Property Image */}
                      <Box w="60px" h="60px" borderRadius="md" overflow="hidden" bg="gray.100" flexShrink={0}>
                        {property.images && property.images.length > 0 ? (
                          <Image
                            src={property.images[0].image}
                            alt={property.name}
                            w="full"
                            h="full"
                            objectFit="cover"
                            fallback={
                              <Center h="full">
                                <Icon as={BuildingOffice2Icon} h={6} w={6} color="gray.400" />
                              </Center>
                            }
                          />
                        ) : (
                          <Center h="full">
                            <Icon as={BuildingOffice2Icon} h={6} w={6} color="gray.400" />
                          </Center>
                        )}
                      </Box>
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="semibold">{property.name}</Text>
                        <Text fontSize="sm" color="gray.600" noOfLines={1}>
                          {truncateText(property.description, 50)}
                        </Text>
                      </VStack>
                    </HStack>
                    <HStack spacing={2}>
                      <Text fontSize="sm" color="gray.600">
                        {typeof property.location === 'object' ? property.location.island : 'Unknown'}
                      </Text>
                      <Text fontWeight="semibold" color="blue.600">
                        {formatPrice(parseFloat(property.price_per_night))}
                      </Text>
                      <IconButton
                        aria-label="Edit property"
                        icon={<Icon as={PencilIcon} />}
                        size="sm"
                        variant="ghost"
                        colorScheme="blue"
                        onClick={() => handleEdit(property)}
                      />
                      <IconButton
                        aria-label="Delete property"
                        icon={<Icon as={TrashIcon} />}
                        size="sm"
                        variant="ghost"
                        colorScheme="red"
                        onClick={() => handleDelete(property.id)}
                      />
                    </HStack>
                  </Flex>
                </Box>
              ))}
            </VStack>
          </Box>
        </Box>
      )}

      {filteredProperties.length === 0 && (
        <Box bg="white" borderRadius="xl" shadow="sm" border="1px solid" borderColor="gray.200">
          <Center py={12}>
            <VStack spacing={4}>
              <Icon as={BuildingOffice2Icon} h={12} w={12} color="gray.300" />
              <Text color="gray.500">No properties found</Text>
            </VStack>
          </Center>
        </Box>
      )}

      {/* Property Form Modal */}
      <PropertyForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingProperty(undefined);
        }}
        property={editingProperty}
        onSave={handleSaveProperty}
      />
    </Container>
  );
} 