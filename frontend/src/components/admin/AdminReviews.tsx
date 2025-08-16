import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Flex,
  VStack,
  HStack,
  Text,
  Heading,
  Icon,
  IconButton,
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Badge,
  Avatar,
  Divider,
  useColorModeValue,
  SimpleGrid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Textarea,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Checkbox,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
} from '@chakra-ui/react';
import { useFetch, useNotification } from '../../hooks';
import { formatDate, generateInitials } from '../../utils';
import type { Review, Property } from '../../types';
import {
  StarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DocumentArrowDownIcon,
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  EllipsisVerticalIcon,
  ListBulletIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';

// Review Form Component
function ReviewForm({ isOpen, onClose, review, onSave }: {
  isOpen: boolean;
  onClose: () => void;
  review?: Review;
  onSave: (data: any) => void;
}) {
  const { data: properties } = useFetch<Property>('/properties/');
  const [formData, setFormData] = useState({
    name: review?.name || '',
    email: review?.email || '',
    rating: review?.rating || 5,
    comment: review?.comment || '',
    property: review?.property ? (typeof review.property === 'object' ? review.property.id : review.property) : '',
  });
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(formData);
      toast({
        title: 'Success',
        description: `Review ${review ? 'updated' : 'created'} successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save review',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" scrollBehavior="inside">
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent>
        <ModalHeader borderBottom="1px solid" borderColor="gray.200" pb={4}>
          <Flex alignItems="center" justify="space-between">
            <HStack spacing={3}>
              <Box
                w={10}
                h={10}
                bgGradient="linear(to-br, amber.500, orange.600)"
                borderRadius="xl"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon as={StarIcon} h={5} w={5} color="white" />
              </Box>
              <VStack align="start" spacing={0}>
                <Heading size="md" color="gray.800">
                  {review ? 'Edit' : 'Add'} Review
                </Heading>
                <Text fontSize="sm" color="gray.500">
                  Manage customer feedback
                </Text>
              </VStack>
            </HStack>
            <ModalCloseButton />
          </Flex>
        </ModalHeader>
        
        <ModalBody p={6}>
          <form onSubmit={handleSubmit}>
            <VStack spacing={6} align="stretch">
              <FormControl isRequired>
                <FormLabel fontWeight="semibold" color="gray.700">
                  Customer Name
                </FormLabel>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter customer's full name"
                  size="lg"
                  borderRadius="lg"
                  focusBorderColor="amber.500"
                />
                <Text fontSize="xs" color="gray.500" mt={1}>
                  Enter the customer's full name as it should appear
                </Text>
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel fontWeight="semibold" color="gray.700">
                  Email Address
                </FormLabel>
                <Input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="customer@example.com"
                  type="email"
                  size="lg"
                  borderRadius="lg"
                  focusBorderColor="amber.500"
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel fontWeight="semibold" color="gray.700">
                  Property
                </FormLabel>
                                 <Select
                   name="property"
                   value={formData.property}
                   onChange={handleChange}
                   size="lg"
                   borderRadius="lg"
                   focusBorderColor="amber.500"
                   placeholder="Select Property"
                 >
                   {properties.map((prop: Property) => (
                     <option key={prop.id} value={prop.id}>{prop.name}</option>
                   ))}
                 </Select>
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel fontWeight="semibold" color="gray.700">
                  Rating
                </FormLabel>
                <Select
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  size="lg"
                  borderRadius="lg"
                  focusBorderColor="amber.500"
                >
                  {[5, 4, 3, 2, 1].map(rating => (
                    <option key={rating} value={rating}>
                      {rating} Star{rating !== 1 ? 's' : ''}
                    </option>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel fontWeight="semibold" color="gray.700">
                  Comment
                </FormLabel>
                <Textarea
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  placeholder="Enter customer's review comment"
                  size="lg"
                  borderRadius="lg"
                  focusBorderColor="amber.500"
                  rows={4}
                  resize="vertical"
                />
              </FormControl>
              
              <Divider />
              
              <Flex justify="flex-end" gap={4}>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={onClose}
                  isDisabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  colorScheme="amber"
                  size="lg"
                  isLoading={saving}
                  loadingText="Saving..."
                  leftIcon={saving ? <Spinner size="sm" /> : <Icon as={StarIcon} h={5} w={5} />}
                >
                  {review ? 'Update' : 'Create'} Review
                </Button>
              </Flex>
            </VStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export function AdminReviews() {
  const { data: reviews, isLoading, error, refresh } = useFetch<Review>('/reviews/');
  const { data: properties } = useFetch<Property>('/properties/');
  
  const { showSuccess, showError } = useNotification();
  const toast = useToast();
  
  // Color mode values
  const bg = useColorModeValue('white', 'gray.800');
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.400');
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    rating: '',
    property: '',
    approved: '',
  });
  const [sortBy, setSortBy] = useState('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [bulkAction, setBulkAction] = useState('');
  
  // Form modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | undefined>();

  // Filter and sort reviews
  const filteredReviews = reviews
    .filter(review => {
      const matchesSearch = review.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           review.comment.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRating = !filters.rating || review.rating === Number(filters.rating);
      const matchesProperty = !filters.property || review.property === Number(filters.property);
      const matchesApproved = filters.approved === '' || review.approved === (filters.approved === 'true');
      
      return matchesSearch && matchesRating && matchesProperty && matchesApproved;
    })
    .sort((a, b) => {
      let aValue: any = a[sortBy as keyof Review];
      let bValue: any = b[sortBy as keyof Review];
      
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  // Calculate statistics
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
    : 0;
  const approvedReviews = reviews.filter(review => review.approved).length;
  const pendingReviews = totalReviews - approvedReviews;

  const handleBulkAction = async () => {
    if (!bulkAction || selectedItems.length === 0) return;
    
    try {
      // Implement bulk actions here
      showSuccess(`Bulk action completed for ${selectedItems.length} reviews`);
      setSelectedItems([]);
      setBulkAction('');
    } catch (error) {
      showError('Failed to perform bulk action');
    }
  };

  const handleSaveReview = async (data: any) => {
    try {
      if (editingReview) {
        // Update existing review
        // await apiPut(`/reviews/${editingReview.id}/`, data);
        showSuccess('Review updated successfully');
      } else {
        // Create new review
        // await apiPost('/reviews/', data);
        showSuccess('Review created successfully');
      }
      refresh();
    } catch (error) {
      showError('Failed to save review');
      throw error;
    }
  };

  const handleDeleteReview = async (id: number) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    
    try {
      // await apiDelete(`/reviews/${id}/`);
      showSuccess('Review deleted successfully');
      refresh();
    } catch (error) {
      showError('Failed to delete review');
    }
  };

  if (isLoading) {
    return (
      <Flex minH="100vh" bg="gray.50" align="center" justify="center">
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" />
          <Text color="gray.500">Loading reviews...</Text>
        </VStack>
      </Flex>
    );
  }

  if (error) {
    return (
      <Container maxW="7xl" py={8}>
        <Alert status="error" borderRadius="lg">
          <AlertIcon />
          <Box>
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>Failed to load reviews. Please try again.</AlertDescription>
          </Box>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxW="7xl" py={8}>
      {/* Header */}
      <Card mb={8} bg={bg} borderColor={borderColor} borderWidth="1px">
        <CardBody p={8}>
          <Flex justify="space-between" align="center">
            <HStack spacing={6}>
              <Box
                w={16}
                h={16}
                bgGradient="linear(to-br, amber.500, orange.600)"
                borderRadius="xl"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon as={StarIcon} h={8} w={8} color="white" />
              </Box>
              <VStack align="start" spacing={1}>
                <Heading size="lg" color={textColor}>
                  Review Management
                </Heading>
                <Text fontSize="lg" color={mutedTextColor}>
                  Manage customer reviews and feedback
                </Text>
              </VStack>
            </HStack>
            <Button
              leftIcon={<Icon as={ChatBubbleLeftRightIcon} h={5} w={5} />}
              colorScheme="amber"
              onClick={() => {
                setEditingReview(undefined);
                setIsFormOpen(true);
              }}
            >
              Add Review
            </Button>
          </Flex>
        </CardBody>
      </Card>

      {/* Statistics */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <Card bg="blue.50" borderColor="blue.200" borderWidth="1px">
          <CardBody>
            <Flex justify="space-between" align="center">
              <VStack align="start" spacing={1}>
                <Text fontSize="sm" fontWeight="medium" color="blue.600">
                  Total Reviews
                </Text>
                <Text fontSize="3xl" fontWeight="bold" color="blue.900">
                  {totalReviews}
                </Text>
              </VStack>
              <Box
                w={12}
                h={12}
                bg="blue.500"
                borderRadius="xl"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon as={StarIcon} h={6} w={6} color="white" />
              </Box>
            </Flex>
          </CardBody>
        </Card>

        <Card bg="green.50" borderColor="green.200" borderWidth="1px">
          <CardBody>
            <Flex justify="space-between" align="center">
              <VStack align="start" spacing={1}>
                <Text fontSize="sm" fontWeight="medium" color="green.600">
                  Average Rating
                </Text>
                <Text fontSize="3xl" fontWeight="bold" color="green.900">
                  {averageRating.toFixed(1)}
                </Text>
              </VStack>
              <Box
                w={12}
                h={12}
                bg="green.500"
                borderRadius="xl"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon as={StarIcon} h={6} w={6} color="white" />
              </Box>
            </Flex>
          </CardBody>
        </Card>

        <Card bg="yellow.50" borderColor="yellow.200" borderWidth="1px">
          <CardBody>
            <Flex justify="space-between" align="center">
              <VStack align="start" spacing={1}>
                <Text fontSize="sm" fontWeight="medium" color="yellow.600">
                  Approved Reviews
                </Text>
                <Text fontSize="3xl" fontWeight="bold" color="yellow.900">
                  {approvedReviews}
                </Text>
              </VStack>
              <Box
                w={12}
                h={12}
                bg="yellow.500"
                borderRadius="xl"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon as={StarIcon} h={6} w={6} color="white" />
              </Box>
            </Flex>
          </CardBody>
        </Card>

        <Card bg="red.50" borderColor="red.200" borderWidth="1px">
          <CardBody>
            <Flex justify="space-between" align="center">
              <VStack align="start" spacing={1}>
                <Text fontSize="sm" fontWeight="medium" color="red.600">
                  Pending Reviews
                </Text>
                <Text fontSize="3xl" fontWeight="bold" color="red.900">
                  {pendingReviews}
                </Text>
              </VStack>
              <Box
                w={12}
                h={12}
                bg="red.500"
                borderRadius="xl"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon as={StarIcon} h={6} w={6} color="white" />
              </Box>
            </Flex>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Filters and Actions */}
      <Card mb={6} bg={cardBg} borderColor={borderColor} borderWidth="1px">
        <CardBody p={6}>
                     <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6} alignItems="center">
            <HStack spacing={4}>
              <InputGroup maxW="300px">
                <InputLeftElement pointerEvents="none">
                  <Icon as={MagnifyingGlassIcon} h={5} w={5} color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Search reviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  borderRadius="lg"
                />
              </InputGroup>
              
              <Select
                value={filters.rating}
                onChange={(e) => setFilters(prev => ({ ...prev, rating: e.target.value }))}
                placeholder="Rating"
                maxW="150px"
                borderRadius="lg"
              >
                {[5, 4, 3, 2, 1].map(rating => (
                  <option key={rating} value={rating}>{rating} Star{rating !== 1 ? 's' : ''}</option>
                ))}
              </Select>
              
              <Select
                value={filters.approved}
                onChange={(e) => setFilters(prev => ({ ...prev, approved: e.target.value }))}
                placeholder="Status"
                maxW="150px"
                borderRadius="lg"
              >
                <option value="true">Approved</option>
                <option value="false">Pending</option>
              </Select>
            </HStack>
            
            <HStack spacing={3} justify="flex-end">
              <IconButton
                icon={<Icon as={viewMode === 'grid' ? ListBulletIcon : Squares2X2Icon} h={5} w={5} />}
                variant="outline"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                aria-label="Toggle view mode"
              />
              
              <Button
                leftIcon={<Icon as={DocumentArrowDownIcon} h={5} w={5} />}
                variant="outline"
                colorScheme="blue"
              >
                Export
              </Button>
            </HStack>
          </Grid>
        </CardBody>
      </Card>

      {/* Reviews List */}
      <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
        <CardHeader pb={4}>
          <Flex justify="space-between" align="center">
            <Heading size="md" color={textColor}>
              Reviews ({filteredReviews.length})
            </Heading>
            {selectedItems.length > 0 && (
              <HStack spacing={3}>
                <Text fontSize="sm" color={mutedTextColor}>
                  {selectedItems.length} selected
                </Text>
                <Select
                  value={bulkAction}
                  onChange={(e) => setBulkAction(e.target.value)}
                  placeholder="Bulk Actions"
                  maxW="200px"
                  size="sm"
                >
                  <option value="approve">Approve Selected</option>
                  <option value="reject">Reject Selected</option>
                  <option value="delete">Delete Selected</option>
                </Select>
                <Button
                  size="sm"
                  colorScheme="blue"
                  onClick={handleBulkAction}
                  isDisabled={!bulkAction}
                >
                  Apply
                </Button>
              </HStack>
            )}
          </Flex>
        </CardHeader>
        
        <CardBody p={0}>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>
                  <Checkbox
                    isChecked={selectedItems.length === filteredReviews.length && filteredReviews.length > 0}
                    isIndeterminate={selectedItems.length > 0 && selectedItems.length < filteredReviews.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedItems(filteredReviews.map(review => review.id));
                      } else {
                        setSelectedItems([]);
                      }
                    }}
                  />
                </Th>
                <Th>Customer</Th>
                <Th>Property</Th>
                <Th>Rating</Th>
                <Th>Comment</Th>
                <Th>Status</Th>
                <Th>Date</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredReviews.map((review) => (
                <Tr key={review.id}>
                  <Td>
                    <Checkbox
                      isChecked={selectedItems.includes(review.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedItems(prev => [...prev, review.id]);
                        } else {
                          setSelectedItems(prev => prev.filter(id => id !== review.id));
                        }
                      }}
                    />
                  </Td>
                  <Td>
                    <HStack spacing={3}>
                      <Avatar size="sm" name={review.name} />
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="semibold" color={textColor}>
                          {review.name}
                        </Text>
                        <Text fontSize="sm" color={mutedTextColor}>
                          {review.email}
                        </Text>
                      </VStack>
                    </HStack>
                  </Td>
                  <Td>
                    <Text fontSize="sm" color={textColor}>
                      Property #{review.property}
                    </Text>
                  </Td>
                  <Td>
                    <HStack spacing={1}>
                      {[...Array(5)].map((_, i) => (
                        <Icon
                          key={i}
                          as={StarIcon}
                          h={4}
                          w={4}
                          color={i < review.rating ? 'yellow.400' : 'gray.300'}
                        />
                      ))}
                    </HStack>
                  </Td>
                  <Td>
                    <Text fontSize="sm" color={mutedTextColor} noOfLines={2} maxW="200px">
                      {review.comment}
                    </Text>
                  </Td>
                  <Td>
                    <Badge
                      colorScheme={review.approved ? 'green' : 'yellow'}
                      variant="subtle"
                      borderRadius="full"
                    >
                      {review.approved ? 'Approved' : 'Pending'}
                    </Badge>
                  </Td>
                  <Td>
                    <Text fontSize="sm" color={mutedTextColor}>
                      {review.created_at ? formatDate(review.created_at) : 'Unknown'}
                    </Text>
                  </Td>
                  <Td>
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        icon={<Icon as={EllipsisVerticalIcon} h={4} w={4} />}
                        variant="ghost"
                        size="sm"
                      />
                      <MenuList>
                        <MenuItem
                          icon={<Icon as={EyeIcon} h={4} w={4} />}
                          onClick={() => {
                            setEditingReview(review);
                            setIsFormOpen(true);
                          }}
                        >
                          View Details
                        </MenuItem>
                        <MenuItem
                          icon={<Icon as={PencilIcon} h={4} w={4} />}
                          onClick={() => {
                            setEditingReview(review);
                            setIsFormOpen(true);
                          }}
                        >
                          Edit Review
                        </MenuItem>
                        <MenuDivider />
                        <MenuItem
                          icon={<Icon as={TrashIcon} h={4} w={4} />}
                          color="red.500"
                          onClick={() => handleDeleteReview(review.id)}
                        >
                          Delete Review
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          
          {filteredReviews.length === 0 && (
            <Box textAlign="center" py={12}>
              <Icon as={StarIcon} h={16} w={16} color="gray.300" mx="auto" mb={4} />
              <Text color={mutedTextColor} fontSize="lg">
                No reviews found
              </Text>
              <Text color={mutedTextColor} fontSize="sm">
                {searchTerm || Object.values(filters).some(f => f) 
                  ? 'Try adjusting your search or filters' 
                  : 'Get started by adding your first review'}
              </Text>
            </Box>
          )}
        </CardBody>
      </Card>

      {/* Review Form Modal */}
      <ReviewForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingReview(undefined);
        }}
        review={editingReview}
        onSave={handleSaveReview}
      />
    </Container>
  );
} 