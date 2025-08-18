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
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
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
} from '@heroicons/react/24/outline';

interface FeatureData {
  id?: number;
  title: string;
  description: string;
  icon: string;
  image?: File | string;
  image_url?: string;
  order: number;
  is_active: boolean;
}

interface FeaturesEditorProps {
  data?: FeatureData[];
  onChange: (data: FeatureData[]) => void;
}

export const FeaturesEditor: React.FC<FeaturesEditorProps> = ({ data, onChange }) => {
  const [features, setFeatures] = useState<FeatureData[]>([]);
  const [editingFeature, setEditingFeature] = useState<FeatureData | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const toast = useToast();

  useEffect(() => {
    if (data) {
      setFeatures(data);
    }
  }, [data]);

  const handleAddFeature = () => {
    const newFeature: FeatureData = {
      title: '',
      description: '',
      icon: '🌟',
      order: features.length,
      is_active: true,
    };
    setEditingFeature(newFeature);
    onOpen();
  };

  const handleEditFeature = (feature: FeatureData) => {
    setEditingFeature({ ...feature });
    onOpen();
  };

  const handleDeleteFeature = (index: number) => {
    const updatedFeatures = features.filter((_, i) => i !== index);
    // Reorder remaining features
    const reorderedFeatures = updatedFeatures.map((feature, i) => ({
      ...feature,
      order: i,
    }));
    setFeatures(reorderedFeatures);
    onChange(reorderedFeatures);
    
    toast({
      title: 'Feature deleted',
      description: 'Feature has been removed successfully',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleMoveFeature = (fromIndex: number, direction: 'up' | 'down') => {
    const updatedFeatures = [...features];
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
    
    if (toIndex >= 0 && toIndex < updatedFeatures.length) {
      [updatedFeatures[fromIndex], updatedFeatures[toIndex]] = [updatedFeatures[toIndex], updatedFeatures[fromIndex]];
      
      // Update order values
      updatedFeatures.forEach((feature, index) => {
        feature.order = index;
      });
      
      setFeatures(updatedFeatures);
      onChange(updatedFeatures);
    }
  };

  const handleSaveFeature = () => {
    if (!editingFeature) return;

    let updatedFeatures: FeatureData[];
    
    if (editingFeature.id !== undefined) {
      // Update existing feature
      updatedFeatures = features.map(feature => 
        feature.id === editingFeature.id ? editingFeature : feature
      );
    } else {
      // Add new feature
      const newFeature = {
        ...editingFeature,
        id: Date.now(), // Temporary ID for frontend
        order: features.length,
      };
      updatedFeatures = [...features, newFeature];
    }

    setFeatures(updatedFeatures);
    onChange(updatedFeatures);
    setEditingFeature(null);
    onClose();
    
    toast({
      title: 'Feature saved',
      description: 'Feature has been saved successfully',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleFeatureChange = (field: keyof FeatureData, value: any) => {
    if (!editingFeature) return;
    setEditingFeature({
      ...editingFeature,
      [field]: value,
    });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !editingFeature) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('title', editingFeature.title || 'Feature Image');
      formData.append('alt_text', editingFeature.description || '');
      formData.append('image_type', 'feature');

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
        setEditingFeature({
          ...editingFeature,
          image_url: result.image_url,
        });
        
        toast({
          title: 'Image uploaded',
          description: 'Image has been uploaded successfully',
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
        description: 'Failed to upload image',
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

  const removeImage = () => {
    if (!editingFeature) return;
    setEditingFeature({
      ...editingFeature,
      image: undefined,
      image_url: undefined,
    });
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
                  Features Management
                </Text>
                <Text color="gray.600">
                  Manage your homepage features and services
                </Text>
              </VStack>
              <Button
                leftIcon={<PlusIcon className="w-5 h-5" />}
                colorScheme="blue"
                onClick={handleAddFeature}
              >
                Add Feature
              </Button>
            </HStack>
          </CardBody>
        </Card>

        {/* Features List */}
        {features.length === 0 ? (
          <Card>
            <CardBody>
              <VStack spacing={4} py={8}>
                <Text color="gray.500">No features added yet</Text>
                <Button
                  leftIcon={<PlusIcon className="w-5 h-5" />}
                  colorScheme="blue"
                  variant="outline"
                  onClick={handleAddFeature}
                >
                  Add Your First Feature
                </Button>
              </VStack>
            </CardBody>
          </Card>
        ) : (
          <VStack spacing={4} align="stretch">
            {features.map((feature, index) => (
              <Card key={feature.id || index}>
                <CardBody>
                  <HStack justify="space-between" align="start">
                    <HStack spacing={4} align="start" flex={1}>
                      <Box
                        w="60px"
                        h="60px"
                        borderRadius="lg"
                        bg="gray.100"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        fontSize="2xl"
                      >
                        {feature.icon}
                      </Box>
                      
                      <VStack align="start" spacing={2} flex={1}>
                        <HStack spacing={2}>
                          <Text fontWeight="bold" fontSize="lg">
                            {feature.title}
                          </Text>
                          <Badge
                            colorScheme={feature.is_active ? 'green' : 'gray'}
                            variant="subtle"
                          >
                            {feature.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                          <Badge colorScheme="blue" variant="subtle">
                            Order: {feature.order + 1}
                          </Badge>
                        </HStack>
                        
                        <Text color="gray.600" noOfLines={2}>
                          {feature.description}
                        </Text>
                        
                        {feature.image_url && (
                          <Image
                            src={feature.image_url}
                            alt={feature.title}
                            borderRadius="md"
                            maxH="80px"
                            objectFit="cover"
                          />
                        )}
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
                          onClick={() => handleMoveFeature(index, 'up')}
                        />
                        <IconButton
                          aria-label="Move down"
                          icon={<ChevronDownIcon className="w-4 h-4" />}
                          size="sm"
                          variant="outline"
                          isDisabled={index === features.length - 1}
                          onClick={() => handleMoveFeature(index, 'down')}
                        />
                      </HStack>
                      
                      <HStack spacing={1}>
                        <IconButton
                          aria-label="Edit feature"
                          icon={<PencilIcon className="w-4 h-4" />}
                          size="sm"
                          colorScheme="blue"
                          onClick={() => handleEditFeature(feature)}
                        />
                        <IconButton
                          aria-label="Delete feature"
                          icon={<TrashIcon className="w-4 h-4" />}
                          size="sm"
                          colorScheme="red"
                          onClick={() => handleDeleteFeature(index)}
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

      {/* Feature Edit Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {editingFeature?.id ? 'Edit Feature' : 'Add New Feature'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {editingFeature && (
              <VStack spacing={6} align="stretch">
                <FormControl>
                  <FormLabel>Title</FormLabel>
                  <Input
                    value={editingFeature.title}
                    onChange={(e) => handleFeatureChange('title', e.target.value)}
                    placeholder="Enter feature title"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    value={editingFeature.description}
                    onChange={(e) => handleFeatureChange('description', e.target.value)}
                    placeholder="Enter feature description"
                    rows={4}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Icon (Emoji)</FormLabel>
                  <Input
                    value={editingFeature.icon}
                    onChange={(e) => handleFeatureChange('icon', e.target.value)}
                    placeholder="🌟"
                    maxLength={2}
                  />
                  <FormHelperText>Use emoji or unicode characters</FormHelperText>
                </FormControl>

                <FormControl>
                  <FormLabel>Feature Image</FormLabel>
                  <HStack spacing={4}>
                    <Button
                      leftIcon={<PhotoIcon className="w-5 h-5" />}
                      variant="outline"
                      onClick={() => document.getElementById('feature-image-input')?.click()}
                      isLoading={isUploading}
                    >
                      Upload Image
                    </Button>
                    {editingFeature.image_url && (
                      <IconButton
                        aria-label="Remove image"
                        icon={<TrashIcon className="w-4 h-4" />}
                        variant="outline"
                        colorScheme="red"
                        onClick={removeImage}
                      />
                    )}
                  </HStack>
                  <input
                    id="feature-image-input"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                </FormControl>

                {editingFeature.image_url && (
                  <Box>
                    <Text fontSize="sm" fontWeight="medium" mb={2}>
                      Image Preview:
                    </Text>
                    <Image
                      src={editingFeature.image_url}
                      alt="Feature preview"
                      borderRadius="md"
                      maxH="200px"
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
                    isChecked={editingFeature.is_active}
                    onChange={(e) => handleFeatureChange('is_active', e.target.checked)}
                  />
                </FormControl>

                <HStack spacing={4} justify="flex-end">
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button colorScheme="blue" onClick={handleSaveFeature}>
                    Save Feature
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