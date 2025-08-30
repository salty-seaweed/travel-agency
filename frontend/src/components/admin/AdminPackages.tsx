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
  AlertIcon,
  AlertTitle,
  AlertDescription,
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
  StarIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import { LoadingSpinner } from '../LoadingSpinner';
import { PackageForm } from './PackageForm';
import { PackageDetailModal } from './PackageDetailModal';
import { useFetch, useNotification } from '../../hooks';
import { formatPrice, truncateText } from '../../utils';
import { apiPost, apiPut, apiDelete } from '../../api';
import type { Package } from '../../types';

export function AdminPackages() {
  const { data: packages, isLoading, error, refresh } = useFetch<Package>('/packages/');
  
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
  const stats = {
    total: packages.length,
    featured: packages.filter(pkg => pkg.is_featured).length,
    active: packages.filter(pkg => pkg.is_featured).length, // Assuming featured = active
    totalValue: packages.reduce((sum, pkg) => sum + parseFloat(pkg.price), 0),
  };

  const handleSavePackage = async (packageData: Partial<Package>) => {
    try {
      if (editingPackage) {
        await apiPut(`/packages/${editingPackage.id}/`, packageData);
        showSuccess('Package updated successfully');
      } else {
        await apiPost('/packages/', packageData);
        showSuccess('Package created successfully');
      }
      refresh();
    } catch (error) {
      console.error('Failed to save package:', error);
      showError('Failed to save package');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        await apiDelete(`/packages/${id}/`);
        showSuccess('Package deleted successfully');
        refresh();
      } catch (error) {
        console.error('Failed to delete package:', error);
        showError('Failed to delete package');
      }
    }
  };

  const handleEdit = (pkg: Package) => {
    setEditingPackage(pkg);
    setIsFormOpen(true);
  };

  const handleView = (pkg: Package) => {
    setViewingPackage(pkg);
  };

  const handleBulkAction = async () => {
    if (selectedItems.length === 0) {
      toast({
        title: 'No items selected',
        description: 'Please select at least one package to perform bulk actions.',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    try {
      switch (bulkAction) {
        case 'delete':
          if (window.confirm(`Are you sure you want to delete ${selectedItems.length} packages?`)) {
            await Promise.all(selectedItems.map(id => apiDelete(`/packages/${id}/`)));
            showSuccess(`${selectedItems.length} packages deleted successfully`);
            setSelectedItems([]);
            refresh();
          }
          break;
        case 'feature':
          await Promise.all(selectedItems.map(id => apiPut(`/packages/${id}/`, { is_featured: true })));
          showSuccess(`${selectedItems.length} packages featured successfully`);
          setSelectedItems([]);
          refresh();
          break;
        case 'unfeature':
          await Promise.all(selectedItems.map(id => apiPut(`/packages/${id}/`, { is_featured: false })));
          showSuccess(`${selectedItems.length} packages unfeatured successfully`);
          setSelectedItems([]);
          refresh();
          break;
      }
    } catch (error) {
      console.error('Bulk action failed:', error);
      showError('Bulk action failed');
    }
  };

  const toggleItemSelection = (id: number) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const toggleAllSelection = () => {
    if (selectedItems.length === filteredPackages.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredPackages.map(pkg => pkg.id));
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <Container maxW="7xl" py={8}>
        <Alert status="error" borderRadius="lg">
          <AlertIcon />
          <Box>
            <AlertTitle>Error loading packages!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Box>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxW="7xl" py={8}>
      {/* Header */}
      <Flex justify="space-between" align="center" mb={8}>
        <Box>
          <Heading size="lg" color="gray.800" mb={2}>
            Package Management
          </Heading>
          <Text color="gray.600">
            Manage travel packages, pricing, and availability
          </Text>
        </Box>
        <Button
          leftIcon={<Icon as={PlusIcon} />}
          colorScheme="purple"
          size="lg"
          onClick={() => {
            setEditingPackage(undefined);
            setIsFormOpen(true);
          }}
        >
          Add Package
        </Button>
      </Flex>

      {/* Statistics */}
      <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={6} mb={8}>
        <Box bg="white" p={6} borderRadius="xl" shadow="sm" border="1px solid" borderColor="gray.200">
          <HStack spacing={3}>
            <Icon as={GiftIcon} h={6} w={6} color="purple.500" />
            <Box>
              <Text fontSize="sm" color="gray.600">Total Packages</Text>
              <Text fontSize="2xl" fontWeight="bold" color="gray.800">{stats.total}</Text>
            </Box>
          </HStack>
        </Box>
        <Box bg="white" p={6} borderRadius="xl" shadow="sm" border="1px solid" borderColor="gray.200">
          <HStack spacing={3}>
            <Icon as={StarIcon} h={6} w={6} color="yellow.500" />
            <Box>
              <Text fontSize="sm" color="gray.600">Featured</Text>
              <Text fontSize="2xl" fontWeight="bold" color="gray.800">{stats.featured}</Text>
            </Box>
          </HStack>
        </Box>
        <Box bg="white" p={6} borderRadius="xl" shadow="sm" border="1px solid" borderColor="gray.200">
          <HStack spacing={3}>
            <Icon as={CheckCircleIcon} h={6} w={6} color="green.500" />
            <Box>
              <Text fontSize="sm" color="gray.600">Active</Text>
              <Text fontSize="2xl" fontWeight="bold" color="gray.800">{stats.active}</Text>
            </Box>
          </HStack>
        </Box>
        <Box bg="white" p={6} borderRadius="xl" shadow="sm" border="1px solid" borderColor="gray.200">
          <HStack spacing={3}>
            <Icon as={CurrencyDollarIcon} h={6} w={6} color="green.500" />
            <Box>
              <Text fontSize="sm" color="gray.600">Total Value</Text>
              <Text fontSize="2xl" fontWeight="bold" color="gray.800">{formatPrice(stats.totalValue)}</Text>
            </Box>
          </HStack>
        </Box>
      </Grid>

      {/* Filters and Actions */}
      <Box bg="white" p={6} borderRadius="xl" shadow="sm" border="1px solid" borderColor="gray.200" mb={6}>
        <Flex direction={{ base: 'column', lg: 'row' }} gap={6} align={{ base: 'stretch', lg: 'center' }}>
          {/* Search */}
          <FormControl maxW="300px">
            <FormLabel fontSize="sm" fontWeight="medium">Search Packages</FormLabel>
            <Input
              placeholder="Search by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </FormControl>

          {/* Price Range */}
          <HStack spacing={4}>
            <FormControl maxW="150px">
              <FormLabel fontSize="sm" fontWeight="medium">Min Price</FormLabel>
              <Input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
              />
            </FormControl>
            <FormControl maxW="150px">
              <FormLabel fontSize="sm" fontWeight="medium">Max Price</FormLabel>
              <Input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
              />
            </FormControl>
          </HStack>

          {/* Duration Range */}
          <HStack spacing={4}>
            <FormControl maxW="150px">
              <FormLabel fontSize="sm" fontWeight="medium">Min Duration</FormLabel>
              <Input
                type="number"
                placeholder="Days"
                value={filters.minDuration}
                onChange={(e) => setFilters(prev => ({ ...prev, minDuration: e.target.value }))}
              />
            </FormControl>
            <FormControl maxW="150px">
              <FormLabel fontSize="sm" fontWeight="medium">Max Duration</FormLabel>
              <Input
                type="number"
                placeholder="Days"
                value={filters.maxDuration}
                onChange={(e) => setFilters(prev => ({ ...prev, maxDuration: e.target.value }))}
              />
            </FormControl>
          </HStack>

          {/* Sort */}
          <FormControl maxW="200px">
            <FormLabel fontSize="sm" fontWeight="medium">Sort By</FormLabel>
            <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="name">Name</option>
              <option value="price">Price</option>
              <option value="duration">Duration</option>
              <option value="created_at">Date Created</option>
            </Select>
          </FormControl>

          {/* Sort Direction */}
          <FormControl maxW="150px">
            <FormLabel fontSize="sm" fontWeight="medium">Order</FormLabel>
            <Select value={sortDirection} onChange={(e) => setSortDirection(e.target.value as 'asc' | 'desc')}>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </Select>
          </FormControl>

          {/* View Mode */}
          <HStack spacing={2}>
            <IconButton
              aria-label="Grid view"
              icon={<Icon as={Squares2X2Icon} />}
              variant={viewMode === 'grid' ? 'solid' : 'outline'}
              colorScheme="purple"
              onClick={() => setViewMode('grid')}
            />
            <IconButton
              aria-label="List view"
              icon={<Icon as={ListBulletIcon} />}
              variant={viewMode === 'list' ? 'solid' : 'outline'}
              colorScheme="purple"
              onClick={() => setViewMode('list')}
            />
          </HStack>
        </Flex>

        {/* Bulk Actions */}
        {selectedItems.length > 0 && (
          <Box mt={6} p={4} bg="purple.50" borderRadius="lg" border="1px solid" borderColor="purple.200">
            <Flex justify="space-between" align="center">
              <Text fontSize="sm" color="purple.800" fontWeight="medium">
                {selectedItems.length} package(s) selected
              </Text>
              <HStack spacing={3}>
                <Select
                  value={bulkAction}
                  onChange={(e) => setBulkAction(e.target.value)}
                  maxW="200px"
                  size="sm"
                >
                  <option value="">Choose action...</option>
                  <option value="delete">Delete Selected</option>
                  <option value="feature">Feature Selected</option>
                  <option value="unfeature">Unfeature Selected</option>
                </Select>
                <Button
                  size="sm"
                  colorScheme="purple"
                  onClick={handleBulkAction}
                  isDisabled={!bulkAction}
                >
                  Apply
                </Button>
                <IconButton
                  aria-label="Clear selection"
                  icon={<Icon as={XMarkIcon} />}
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedItems([])}
                />
              </HStack>
            </Flex>
          </Box>
        )}
      </Box>

      {/* Packages Grid */}
      {viewMode === 'grid' ? (
        <Grid templateColumns="repeat(auto-fill, minmax(350px, 1fr))" gap={6}>
          {filteredPackages.map(pkg => (
            <Box
              key={pkg.id}
              bg="white"
              borderRadius="xl"
              shadow="sm"
              border="1px solid"
              borderColor="gray.200"
              overflow="hidden"
              transition="all 0.2s"
              _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
            >
              {/* Package Image */}
              <Box h="200px" position="relative">
                {pkg.images && pkg.images.length > 0 ? (
                  <Image
                    src={(pkg.images[0] as any).image_url || pkg.images[0].image}
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
                
                {/* Featured Badge */}
                {pkg.is_featured && (
                  <Badge
                    position="absolute"
                    top={3}
                    right={3}
                    colorScheme="yellow"
                    variant="solid"
                    fontSize="xs"
                  >
                    Featured
                  </Badge>
                )}
                
                {/* Selection Checkbox */}
                <Checkbox
                  position="absolute"
                  top={3}
                  left={3}
                  isChecked={selectedItems.includes(pkg.id)}
                  onChange={() => toggleItemSelection(pkg.id)}
                  colorScheme="purple"
                />
              </Box>

              {/* Package Info */}
              <Box p={6}>
                <VStack align="start" spacing={3}>
                  <Box w="full">
                    <Text fontWeight="bold" fontSize="lg" color="gray.800" mb={1}>
                      {pkg.name}
                    </Text>
                    <Text fontSize="sm" color="gray.600" noOfLines={2}>
                      {pkg.description}
                    </Text>
                  </Box>

                  <HStack spacing={4} w="full" justify="space-between">
                    <HStack spacing={2}>
                      <Icon as={CalendarIcon} h={4} w={4} color="gray.500" />
                      <Text fontSize="sm" color="gray.600">
                        {pkg.duration} days
                      </Text>
                    </HStack>
                    <HStack spacing={2}>
                      <Icon as={MapPinIcon} h={4} w={4} color="gray.500" />
                      <Text fontSize="sm" color="gray.600">
                        {pkg.destinations?.length || 0} destinations
                      </Text>
                    </HStack>
                  </HStack>

                  <HStack spacing={4} w="full" justify="space-between" align="center">
                    <VStack align="start" spacing={0}>
                      <Text fontSize="lg" fontWeight="bold" color="purple.600">
                        {formatPrice(parseFloat(pkg.price))}
                      </Text>
                      {(pkg as any).discount_percentage > 0 && (
                        <Text fontSize="sm" color="gray.500" textDecoration="line-through">
                          {formatPrice(parseFloat(pkg.price) * (1 + (pkg as any).discount_percentage / 100))}
                        </Text>
                      )}
                    </VStack>
                    
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
                </VStack>
              </Box>
            </Box>
          ))}
        </Grid>
      ) : (
        /* List View */
        <Box bg="white" borderRadius="xl" shadow="sm" border="1px solid" borderColor="gray.200">
          <VStack spacing={0} divider={<Divider />}>
            {filteredPackages.map(pkg => (
              <Flex
                key={pkg.id}
                p={6}
                align="center"
                justify="space-between"
                _hover={{ bg: 'gray.50' }}
              >
                <HStack spacing={4} flex={1}>
                  <Checkbox
                    isChecked={selectedItems.includes(pkg.id)}
                    onChange={() => toggleItemSelection(pkg.id)}
                    colorScheme="purple"
                  />
                  
                  <Box w="60px" h="60px" borderRadius="md" overflow="hidden" flexShrink={0}>
                    {pkg.images && pkg.images.length > 0 ? (
                      <Image
                        src={(pkg.images[0] as any).image_url || pkg.images[0].image}
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
                  
                  <VStack align="start" spacing={1} flex={1}>
                    <HStack spacing={2}>
                      <Text fontWeight="semibold">{pkg.name}</Text>
                      {pkg.is_featured && (
                        <Badge colorScheme="yellow" variant="solid" fontSize="xs">
                          Featured
                        </Badge>
                      )}
                    </HStack>
                    <Text fontSize="sm" color="gray.600" noOfLines={1}>
                      {truncateText(pkg.description, 50)}
                    </Text>
                  </VStack>
                  
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
                </HStack>
              </Flex>
            ))}
          </VStack>
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
        onPackageSaved={refresh}
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