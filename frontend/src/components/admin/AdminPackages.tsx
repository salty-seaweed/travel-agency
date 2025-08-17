import React, { useState } from 'react';
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
  FormControl,
  FormLabel,
  Badge,
  Image,
} from '@chakra-ui/react';
import {
  GiftIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  Squares2X2Icon,
  ListBulletIcon,
  DocumentArrowDownIcon,
  XMarkIcon,
  CalendarIcon,
  MapPinIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { LoadingSpinner } from '../LoadingSpinner';
import { PackageForm } from './PackageForm';
import { PackageDetailModal } from './PackageDetailModal';
import { useFetch, useNotification } from '../../hooks';
import { formatPrice, truncateText } from '../../utils';
import { apiPost, apiPut, apiDelete } from '../../api';
import type { Package, Property } from '../../types';

export function AdminPackages() {
  const { data: packages, isLoading, error, refresh } = useFetch<Package>('/packages/');
  const { data: properties } = useFetch<Property>('/properties/');
  
  const { showSuccess, showError } = useNotification();
  const toast = useToast();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    minDuration: '',
    maxDuration: '',
  });
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [bulkAction, setBulkAction] = useState('');
  
  // Form modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | undefined>();
  const [viewingPackage, setViewingPackage] = useState<Package | null>(null);

  // Filter and sort packages
  const filteredPackages = packages
    .filter(pkg => {
      const matchesSearch = pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           pkg.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPrice = (!filters.minPrice || parseFloat(pkg.price) >= Number(filters.minPrice)) &&
                          (!filters.maxPrice || parseFloat(pkg.price) <= Number(filters.maxPrice));
      const matchesDuration = (!filters.minDuration || pkg.duration >= Number(filters.minDuration)) &&
                             (!filters.maxDuration || pkg.duration <= Number(filters.maxDuration));
      
      return matchesSearch && matchesPrice && matchesDuration;
    })
    .sort((a, b) => {
      let aValue: any = a[sortBy as keyof Package];
      let bValue: any = b[sortBy as keyof Package];
      
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  // Calculate statistics
  const totalPackages = packages.length;
  const averagePrice = totalPackages > 0 
    ? packages.reduce((sum, pkg) => sum + parseFloat(pkg.price), 0) / totalPackages 
    : 0;
  const averageDuration = totalPackages > 0 
    ? packages.reduce((sum, pkg) => sum + pkg.duration, 0) / totalPackages 
    : 0;
  const totalProperties = packages.reduce((sum, pkg) => sum + (pkg.properties?.length || 0), 0);
  const featuredCount = packages.filter(pkg => pkg.is_featured).length;

  const handleAdd = () => {
    setEditingPackage(undefined);
    setIsFormOpen(true);
  };

  const handleView = (pkg: Package) => {
    setViewingPackage(pkg);
  };

  const handleEdit = (pkg: Package) => {
    console.log('AdminPackages: Editing package:', pkg);
    setEditingPackage(pkg);
    setIsFormOpen(true);
  };

  const handleSavePackage = async (packageData: Partial<Package>) => {
    try {
      if (editingPackage) {
        const updatedPackage = await apiPut(`packages/${editingPackage.id}/`, packageData);
        showSuccess('Package updated successfully');
      } else {
        const newPackage = await apiPost('packages/', packageData);
        showSuccess('Package created successfully');
      }
      refresh();
      setIsFormOpen(false);
      setEditingPackage(undefined);
    } catch (error) {
      showError('Failed to save package');
      throw error;
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this package?')) return;
    
    try {
      await apiDelete(`packages/${id}/`);
      showSuccess('Package deleted successfully');
      refresh();
    } catch (error) {
      showError('Failed to delete package');
    }
  };

  if (isLoading) {
    return (
      <Center minH="100vh">
        <Spinner size="xl" color="purple.500" />
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
            <Button onClick={refresh} colorScheme="purple">
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
              bgGradient="linear(to-br, purple.500, pink.600)"
              borderRadius="xl"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Icon as={GiftIcon} h={8} w={8} color="white" />
            </Box>
            <VStack align="start" spacing={2}>
              <Heading size="lg" color="gray.800">Packages</Heading>
              <Text color="gray.600">Manage travel packages and bookings</Text>
            </VStack>
          </Flex>
          <Flex direction={{ base: 'column', sm: 'row' }} gap={4}>
            <Button
              leftIcon={<Icon as={PlusIcon} />}
              colorScheme="purple"
              onClick={handleAdd}
            >
              Add Package
            </Button>
          </Flex>
        </Flex>
      </Box>

      {/* Stats Cards */}
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6} mb={8}>
        <Box bgGradient="linear(to-br, emerald.50, emerald.100)" border="1px solid" borderColor="emerald.200" borderRadius="xl" p={6}>
          <VStack spacing={2}>
            <Text fontSize="sm" fontWeight="medium" color="emerald.600">Total Packages</Text>
            <Text fontSize="3xl" fontWeight="bold" color="emerald.900">{totalPackages}</Text>
          </VStack>
        </Box>
        <Box bgGradient="linear(to-br, blue.50, blue.100)" border="1px solid" borderColor="blue.200" borderRadius="xl" p={6}>
          <VStack spacing={2}>
            <Text fontSize="sm" fontWeight="medium" color="blue.600">Avg Price</Text>
            <Text fontSize="3xl" fontWeight="bold" color="blue.900">{formatPrice(averagePrice)}</Text>
          </VStack>
        </Box>
        <Box bgGradient="linear(to-br, purple.50, purple.100)" border="1px solid" borderColor="purple.200" borderRadius="xl" p={6}>
          <VStack spacing={2}>
            <Text fontSize="sm" fontWeight="medium" color="purple.600">Avg Duration</Text>
            <Text fontSize="3xl" fontWeight="bold" color="purple.900">{averageDuration.toFixed(1)} days</Text>
          </VStack>
        </Box>
        <Box bgGradient="linear(to-br, amber.50, amber.100)" border="1px solid" borderColor="amber.200" borderRadius="xl" p={6}>
          <VStack spacing={2}>
            <Text fontSize="sm" fontWeight="medium" color="amber.600">Featured</Text>
            <Text fontSize="3xl" fontWeight="bold" color="amber.900">{featuredCount}</Text>
          </VStack>
        </Box>
      </Grid>

      {/* Filter Bar */}
      <Box bg="white" borderRadius="xl" shadow="sm" border="1px solid" borderColor="gray.200" mb={8} p={6}>
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(6, 1fr)' }} gap={6}>
          <FormControl>
            <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">Search</FormLabel>
            <Input
              placeholder="Search packages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">Min Price</FormLabel>
            <Input
              type="number"
              placeholder="Min price"
              value={filters.minPrice}
              onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
            />
          </FormControl>
          <FormControl>
            <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">Max Price</FormLabel>
            <Input
              type="number"
              placeholder="Max price"
              value={filters.maxPrice}
              onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
            />
          </FormControl>
          <FormControl>
            <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">Min Duration</FormLabel>
            <Input
              type="number"
              placeholder="Min days"
              value={filters.minDuration}
              onChange={(e) => setFilters(prev => ({ ...prev, minDuration: e.target.value }))}
            />
          </FormControl>
          <FormControl>
            <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">Max Duration</FormLabel>
            <Input
              type="number"
              placeholder="Max days"
              value={filters.maxDuration}
              onChange={(e) => setFilters(prev => ({ ...prev, maxDuration: e.target.value }))}
            />
          </FormControl>
          <FormControl>
            <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">Sort By</FormLabel>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Name</option>
              <option value="price">Price</option>
              <option value="duration">Duration</option>
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
              onClick={() => setFilters({ minPrice: '', maxPrice: '', minDuration: '', maxDuration: '' })}
            >
              Clear Filters
            </Button>
          </HStack>
          <HStack spacing={4}>
            <HStack spacing={2}>
              <IconButton
                aria-label="Grid view"
                icon={<Icon as={Squares2X2Icon} />}
                size="sm"
                variant={viewMode === 'grid' ? 'solid' : 'ghost'}
                colorScheme={viewMode === 'grid' ? 'purple' : 'gray'}
                onClick={() => setViewMode('grid')}
              />
              <IconButton
                aria-label="List view"
                icon={<Icon as={ListBulletIcon} />}
                size="sm"
                variant={viewMode === 'list' ? 'solid' : 'ghost'}
                colorScheme={viewMode === 'list' ? 'purple' : 'gray'}
                onClick={() => setViewMode('list')}
              />
            </HStack>
            <Text fontSize="sm" color="gray.600">
              {filteredPackages.length} of {packages.length} packages
            </Text>
          </HStack>
        </Flex>
      </Box>

      {/* Packages Display */}
      {viewMode === 'grid' ? (
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
          {filteredPackages.map((pkg) => (
            <Box key={pkg.id} bg="white" borderRadius="xl" shadow="sm" border="1px solid" borderColor="gray.200" overflow="hidden" _hover={{ shadow: 'xl' }} transition="all 0.3s" position="relative">
              {/* Package Image */}
              <Box position="relative" h="200px" bg="gray.100">
                {pkg.images && pkg.images.length > 0 ? (
                  <Image
                    src={pkg.images[0].image}
                    alt={pkg.name}
                    w="full"
                    h="full"
                    objectFit="cover"
                    fallback={
                      <Center h="full">
                        <VStack spacing={2}>
                          <Icon as={GiftIcon} h={8} w={8} color="gray.400" />
                          <Text fontSize="sm" color="gray.500">No Image</Text>
                        </VStack>
                      </Center>
                    }
                  />
                ) : (
                  <Center h="full">
                    <VStack spacing={2}>
                      <Icon as={GiftIcon} h={8} w={8} color="gray.400" />
                      <Text fontSize="sm" color="gray.500">No Image</Text>
                    </VStack>
                  </Center>
                )}
                {/* Image count badge */}
                {pkg.images && pkg.images.length > 1 && (
                  <Badge
                    position="absolute"
                    top={2}
                    right={2}
                    colorScheme="blackAlpha"
                    variant="solid"
                    fontSize="xs"
                  >
                    +{pkg.images.length - 1}
                  </Badge>
                )}
              </Box>
              
              <Box p={6}>
                <Flex justify="space-between" align="start" mb={4}>
                  <HStack spacing={2}>
                    <Text fontSize="sm" fontWeight="medium" color="gray.500">#{pkg.id}</Text>
                  </HStack>
                  <HStack spacing={1}>
                    <IconButton
                      aria-label="View package"
                      icon={<Icon as={EyeIcon} />}
                      size="sm"
                      variant="ghost"
                      colorScheme="blue"
                      onClick={() => handleView(pkg)}
                      _hover={{ bg: 'blue.50' }}
                    />
                    <IconButton
                      aria-label="Edit package"
                      icon={<Icon as={PencilIcon} />}
                      size="sm"
                      variant="ghost"
                      colorScheme="purple"
                      onClick={() => handleEdit(pkg)}
                      _hover={{ bg: 'purple.50' }}
                    />
                    <IconButton
                      aria-label="Delete package"
                      icon={<Icon as={TrashIcon} />}
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => handleDelete(pkg.id)}
                      _hover={{ bg: 'red.50' }}
                    />
                  </HStack>
                </Flex>
                
                <VStack align="start" spacing={3} mb={4}>
                  <Heading size="md" noOfLines={1}>{pkg.name}</Heading>
                  <Text color="gray.600" noOfLines={2}>{pkg.description}</Text>
                </VStack>
                
                <VStack spacing={2} mb={4}>
                  <HStack justify="space-between" w="full">
                    <Text fontSize="sm" color="gray.500">Duration:</Text>
                    <Text fontSize="sm" fontWeight="medium">{pkg.duration} days</Text>
                  </HStack>
                  <HStack justify="space-between" w="full">
                    <Text fontSize="sm" color="gray.500">Properties:</Text>
                    <Text fontSize="sm" fontWeight="medium">{pkg.properties?.length || 0}</Text>
                  </HStack>
                </VStack>
                
                <Divider mb={3} />
                <HStack justify="space-between" pt={4}>
                  <VStack align="start" spacing={0}>
                    <Text fontSize="lg" fontWeight="bold" color="purple.600">
                      {formatPrice(parseFloat(pkg.price))}
                    </Text>
                    {pkg.original_price && parseFloat(pkg.original_price) > parseFloat(pkg.price) && (
                      <Text fontSize="sm" color="gray.500" textDecoration="line-through">
                        {formatPrice(parseFloat(pkg.original_price))}
                      </Text>
                    )}
                    {pkg.discount_percentage && pkg.discount_percentage > 0 && (
                      <Badge colorScheme="green" variant="subtle" fontSize="xs">
                        {pkg.discount_percentage}% OFF
                      </Badge>
                    )}
                  </VStack>
                  <Text fontSize="xs" color="gray.500">per package</Text>
                </HStack>
              </Box>
            </Box>
          ))}
        </Grid>
      ) : (
        <Box bg="white" borderRadius="xl" shadow="sm" border="1px solid" borderColor="gray.200">
          <Box p={6}>
            <Heading size="md" mb={4}>Packages List</Heading>
            <VStack spacing={4} align="stretch">
              {filteredPackages.map((pkg) => (
                <Box key={pkg.id} p={4} border="1px solid" borderColor="gray.200" borderRadius="lg" _hover={{ bg: 'gray.50' }} transition="colors">
                  <Flex justify="space-between" align="center">
                    <HStack spacing={3}>
                      {/* Package Image */}
                      <Box w="60px" h="60px" borderRadius="md" overflow="hidden" bg="gray.100" flexShrink={0}>
                        {pkg.images && pkg.images.length > 0 ? (
                          <Image
                            src={pkg.images[0].image}
                            alt={pkg.name}
                            w="full"
                            h="full"
                            objectFit="cover"
                            fallback={
                              <Center h="full">
                                <Icon as={GiftIcon} h={6} w={6} color="gray.400" />
                              </Center>
                            }
                          />
                        ) : (
                          <Center h="full">
                            <Icon as={GiftIcon} h={6} w={6} color="gray.400" />
                          </Center>
                        )}
                      </Box>
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="semibold">{pkg.name}</Text>
                        <Text fontSize="sm" color="gray.600" noOfLines={1}>
                          {truncateText(pkg.description, 50)}
                        </Text>
                      </VStack>
                    </HStack>
                    <HStack spacing={4}>
                      <Text fontSize="sm" color="gray.600">
                        {pkg.duration} days
                      </Text>
                      <Text fontWeight="semibold" color="purple.600">
                        {formatPrice(parseFloat(pkg.price))}
                      </Text>
                      <HStack spacing={2}>
                        <IconButton
                          aria-label="View package"
                          icon={<Icon as={EyeIcon} />}
                          size="sm"
                          variant="ghost"
                          colorScheme="blue"
                          onClick={() => handleView(pkg)}
                        />
                        <IconButton
                          aria-label="Edit package"
                          icon={<Icon as={PencilIcon} />}
                          size="sm"
                          variant="ghost"
                          colorScheme="purple"
                          onClick={() => handleEdit(pkg)}
                        />
                        <IconButton
                          aria-label="Delete package"
                          icon={<Icon as={TrashIcon} />}
                          size="sm"
                          variant="ghost"
                          colorScheme="red"
                          onClick={() => handleDelete(pkg.id)}
                        />
                      </HStack>
                    </HStack>
                  </Flex>
                </Box>
              ))}
            </VStack>
          </Box>
        </Box>
      )}

      {filteredPackages.length === 0 && (
        <Box bg="white" borderRadius="xl" shadow="sm" border="1px solid" borderColor="gray.200">
          <Center py={12}>
            <VStack spacing={4}>
              <Icon as={GiftIcon} h={12} w={12} color="gray.300" />
              <Text color="gray.500">No packages found</Text>
            </VStack>
          </Center>
        </Box>
      )}

      {/* Package Form Modal */}
      <PackageForm
        key={editingPackage?.id || 'new'}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingPackage(undefined);
        }}
        package={editingPackage}
        onSave={handleSavePackage}
      />

      {/* Package Detail Modal */}
      <PackageDetailModal
        isOpen={!!viewingPackage}
        onClose={() => setViewingPackage(null)}
        package={viewingPackage}
      />
    </Container>
  );
} 