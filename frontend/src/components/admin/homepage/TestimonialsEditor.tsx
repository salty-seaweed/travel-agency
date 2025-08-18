import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Textarea,
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
  Switch,
  Image,
  IconButton,
  useToast,
  Card,
  CardBody,
  Divider,
  SimpleGrid,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Progress,
  Spinner,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import {
  PhotoIcon,
  TrashIcon,
  PlusIcon,
  ArrowsUpDownIcon,
  EyeIcon,
  PencilIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  StarIcon,
} from '@heroicons/react/24/outline';

interface TestimonialData {
  id?: number;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar?: File | string;
  avatar_url?: string;
  order: number;
  is_active: boolean;
}

interface TestimonialsEditorProps {
  data?: TestimonialData[];
  onChange: (data: TestimonialData[]) => void;
}

export const TestimonialsEditor: React.FC<TestimonialsEditorProps> = ({ data, onChange }) => {
  const [testimonials, setTestimonials] = useState<TestimonialData[]>([]);
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialData | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    if (data) {
      setTestimonials(data);
    }
  }, [data]);

  const handleAddTestimonial = () => {
    const newTestimonial: TestimonialData = {
      name: '',
      role: '',
      company: '',
      content: '',
      rating: 5,
      order: testimonials.length,
      is_active: true,
    };
    setEditingTestimonial(newTestimonial);
    onOpen();
  };

  const handleEditTestimonial = (testimonial: TestimonialData) => {
    setEditingTestimonial({ ...testimonial });
    onOpen();
  };

  const handleDeleteTestimonial = (index: number) => {
    const updatedTestimonials = testimonials.filter((_, i) => i !== index);
    // Reorder remaining testimonials
    const reorderedTestimonials = updatedTestimonials.map((testimonial, i) => ({
      ...testimonial,
      order: i,
    }));
    setTestimonials(reorderedTestimonials);
    onChange(reorderedTestimonials);
    
    toast({
      title: 'Testimonial deleted',
      description: 'Testimonial has been removed successfully',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleMoveTestimonial = (fromIndex: number, direction: 'up' | 'down') => {
    const updatedTestimonials = [...testimonials];
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
    
    if (toIndex >= 0 && toIndex < updatedTestimonials.length) {
      [updatedTestimonials[fromIndex], updatedTestimonials[toIndex]] = [updatedTestimonials[toIndex], updatedTestimonials[fromIndex]];
      
      // Update order values
      updatedTestimonials.forEach((testimonial, index) => {
        testimonial.order = index;
      });
      
      setTestimonials(updatedTestimonials);
      onChange(updatedTestimonials);
    }
  };

  const handleSaveTestimonial = () => {
    if (!editingTestimonial) return;

    let updatedTestimonials: TestimonialData[];
    
    if (editingTestimonial.id !== undefined) {
      // Update existing testimonial
      updatedTestimonials = testimonials.map(testimonial => 
        testimonial.id === editingTestimonial.id ? editingTestimonial : testimonial
      );
    } else {
      // Add new testimonial
      const newTestimonial = {
        ...editingTestimonial,
        id: Date.now(), // Temporary ID for frontend
        order: testimonials.length,
      };
      updatedTestimonials = [...testimonials, newTestimonial];
    }

    setTestimonials(updatedTestimonials);
    onChange(updatedTestimonials);
    setEditingTestimonial(null);
    onClose();
    
    toast({
      title: 'Testimonial saved',
      description: 'Testimonial has been saved successfully',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleTestimonialChange = (field: keyof TestimonialData, value: any) => {
    if (!editingTestimonial) return;
    setEditingTestimonial({
      ...editingTestimonial,
      [field]: value,
    });
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !editingTestimonial) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('title', `${editingTestimonial.name} Avatar`);
      formData.append('alt_text', `${editingTestimonial.name} profile picture`);
      formData.append('image_type', 'testimonial');

      const token = localStorage.getItem('access');
      const response = await fetch('http://localhost:8001/api/homepage/images/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setEditingTestimonial({
          ...editingTestimonial,
          avatar_url: result.image_url,
        });
        
        toast({
          title: 'Avatar uploaded',
          description: 'Avatar has been uploaded successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload avatar',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      // Clear the input
      event.target.value = '';
    }
  };

  const removeAvatar = () => {
    if (!editingTestimonial) return;
    setEditingTestimonial({
      ...editingTestimonial,
      avatar: undefined,
      avatar_url: undefined,
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Card>
          <CardBody>
            <HStack justify="space-between" align="center">
              <VStack align="start" spacing={2}>
                <Text fontSize="xl" fontWeight="bold">
                  Testimonials Management
                </Text>
                <Text color="gray.600">
                  Manage customer testimonials and reviews
                </Text>
              </VStack>
              <Button
                leftIcon={<PlusIcon className="w-5 h-5" />}
                colorScheme="blue"
                onClick={handleAddTestimonial}
              >
                Add Testimonial
              </Button>
            </HStack>
          </CardBody>
        </Card>

        {/* Testimonials List */}
        {testimonials.length === 0 ? (
          <Card>
            <CardBody>
              <VStack spacing={4} py={8}>
                <Text color="gray.500">No testimonials added yet</Text>
                <Button
                  leftIcon={<PlusIcon className="w-5 h-5" />}
                  colorScheme="blue"
                  variant="outline"
                  onClick={handleAddTestimonial}
                >
                  Add Your First Testimonial
                </Button>
              </VStack>
            </CardBody>
          </Card>
        ) : (
          <VStack spacing={4} align="stretch">
            {testimonials.map((testimonial, index) => (
              <Card key={testimonial.id || index}>
                <CardBody>
                  <HStack justify="space-between" align="start">
                    <HStack spacing={4} align="start" flex={1}>
                      <Box
                        w="60px"
                        h="60px"
                        borderRadius="full"
                        overflow="hidden"
                        bg="gray.100"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        {testimonial.avatar_url ? (
                          <Image
                            src={testimonial.avatar_url}
                            alt={testimonial.name}
                            w="100%"
                            h="100%"
                            objectFit="cover"
                          />
                        ) : (
                          <Text fontSize="xl" color="gray.500">
                            {testimonial.name.charAt(0).toUpperCase()}
                          </Text>
                        )}
                      </Box>
                      
                      <VStack align="start" spacing={2} flex={1}>
                        <HStack spacing={2}>
                          <Text fontWeight="bold" fontSize="lg">
                            {testimonial.name}
                          </Text>
                          <Badge
                            colorScheme={testimonial.is_active ? 'green' : 'gray'}
                            variant="subtle"
                          >
                            {testimonial.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                          <Badge colorScheme="blue" variant="subtle">
                            Order: {testimonial.order + 1}
                          </Badge>
                        </HStack>
                        
                        <Text color="gray.600" fontSize="sm">
                          {testimonial.role} at {testimonial.company}
                        </Text>
                        
                        <HStack spacing={1}>
                          {renderStars(testimonial.rating)}
                          <Text fontSize="sm" color="gray.500">
                            ({testimonial.rating}/5)
                          </Text>
                        </HStack>
                        
                        <Text color="gray.700" noOfLines={3}>
                          "{testimonial.content}"
                        </Text>
                      </VStack>
                    </HStack>
                    
                    <VStack spacing={2}>
                      <HStack spacing={1}>
                        <IconButton
                          aria-label="Move up"
                          icon={<ChevronUpIcon className="w-4 h-4" />}
                          size="sm"
                          variant="outline"
                          isDisabled={index === 0}
                          onClick={() => handleMoveTestimonial(index, 'up')}
                        />
                        <IconButton
                          aria-label="Move down"
                          icon={<ChevronDownIcon className="w-4 h-4" />}
                          size="sm"
                          variant="outline"
                          isDisabled={index === testimonials.length - 1}
                          onClick={() => handleMoveTestimonial(index, 'down')}
                        />
                      </HStack>
                      
                      <HStack spacing={1}>
                        <IconButton
                          aria-label="Edit testimonial"
                          icon={<PencilIcon className="w-4 h-4" />}
                          size="sm"
                          colorScheme="blue"
                          onClick={() => handleEditTestimonial(testimonial)}
                        />
                        <IconButton
                          aria-label="Delete testimonial"
                          icon={<TrashIcon className="w-4 h-4" />}
                          size="sm"
                          colorScheme="red"
                          onClick={() => handleDeleteTestimonial(index)}
                        />
                      </HStack>
                    </VStack>
                  </HStack>
                </CardBody>
              </Card>
            ))}
          </VStack>
        )}
      </VStack>

      {/* Testimonial Edit Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {editingTestimonial?.id ? 'Edit Testimonial' : 'Add New Testimonial'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {editingTestimonial && (
              <VStack spacing={6} align="stretch">
                <HStack spacing={4}>
                  <FormControl>
                    <FormLabel>Name</FormLabel>
                    <Input
                      value={editingTestimonial.name}
                      onChange={(e) => handleTestimonialChange('name', e.target.value)}
                      placeholder="Enter customer name"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Role</FormLabel>
                    <Input
                      value={editingTestimonial.role}
                      onChange={(e) => handleTestimonialChange('role', e.target.value)}
                      placeholder="e.g., CEO, Manager"
                    />
                  </FormControl>
                </HStack>

                <FormControl>
                  <FormLabel>Company</FormLabel>
                  <Input
                    value={editingTestimonial.company}
                    onChange={(e) => handleTestimonialChange('company', e.target.value)}
                    placeholder="Enter company name"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Rating</FormLabel>
                  <NumberInput
                    value={editingTestimonial.rating}
                    onChange={(_, value) => handleTestimonialChange('rating', value)}
                    min={1}
                    max={5}
                    step={1}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <FormHelperText>Rate from 1 to 5 stars</FormHelperText>
                </FormControl>

                <FormControl>
                  <FormLabel>Testimonial Content</FormLabel>
                  <Textarea
                    value={editingTestimonial.content}
                    onChange={(e) => handleTestimonialChange('content', e.target.value)}
                    placeholder="Enter the customer's testimonial"
                    rows={4}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Avatar</FormLabel>
                  <HStack spacing={4}>
                    <Button
                      leftIcon={<PhotoIcon className="w-5 h-5" />}
                      variant="outline"
                      onClick={() => document.getElementById('avatar-input')?.click()}
                      isLoading={isUploading}
                    >
                      Upload Avatar
                    </Button>
                    {editingTestimonial.avatar_url && (
                      <IconButton
                        aria-label="Remove avatar"
                        icon={<TrashIcon className="w-4 h-4" />}
                        variant="outline"
                        colorScheme="red"
                        onClick={removeAvatar}
                      />
                    )}
                  </HStack>
                  <input
                    id="avatar-input"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    style={{ display: 'none' }}
                  />
                </FormControl>

                {editingTestimonial.avatar_url && (
                  <Box>
                    <Text fontSize="sm" fontWeight="medium" mb={2}>
                      Avatar Preview:
                    </Text>
                    <Image
                      src={editingTestimonial.avatar_url}
                      alt="Avatar preview"
                      borderRadius="full"
                      maxH="100px"
                      maxW="100px"
                      objectFit="cover"
                    />
                  </Box>
                )}

                <FormControl display="flex" alignItems="center">
                  <FormLabel htmlFor="is-active" mb="0">
                    Active
                  </FormLabel>
                  <Switch
                    id="is-active"
                    isChecked={editingTestimonial.is_active}
                    onChange={(e) => handleTestimonialChange('is_active', e.target.checked)}
                  />
                </FormControl>

                <HStack spacing={4} justify="flex-end">
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button colorScheme="blue" onClick={handleSaveTestimonial}>
                    Save Testimonial
                  </Button>
                </HStack>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}; 