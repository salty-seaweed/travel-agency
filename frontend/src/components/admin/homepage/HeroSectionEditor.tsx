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
  Alert,
  AlertIcon,
  Progress,
  Spinner,
} from '@chakra-ui/react';
import {
  PhotoIcon,
  TrashIcon,
  PlusIcon,
  ArrowsUpDownIcon,
  EyeIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';

interface HeroData {
  id?: number;
  title: string;
  subtitle: string;
  description: string;
  background_image?: File | string;
  background_image_url?: string;
  background_images?: string[];
  cta_primary_text: string;
  cta_primary_url: string;
  cta_secondary_text: string;
  cta_secondary_url: string;
  is_active: boolean;
}

interface HeroSectionEditorProps {
  data?: HeroData;
  onChange: (data: HeroData) => void;
}

export const HeroSectionEditor: React.FC<HeroSectionEditorProps> = ({ data, onChange }) => {
  const [heroData, setHeroData] = useState<HeroData>({
    title: '',
    subtitle: '',
    description: '',
    cta_primary_text: 'Get Started',
    cta_primary_url: '#',
    cta_secondary_text: 'Learn More',
    cta_secondary_url: '#',
    is_active: true,
    background_images: [],
  });
  const [backgroundImage, setBackgroundImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const toast = useToast();

  useEffect(() => {
    if (data) {
      setHeroData(data);
      if (data.background_image_url) {
        setImagePreview(data.background_image_url);
      }
    }
  }, [data]);

  const handleInputChange = (field: keyof HeroData, value: any) => {
    const updatedData = {
      ...heroData,
      [field]: value,
    };
    setHeroData(updatedData);
    onChange(updatedData);
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('title', 'Hero Background Image');
      formData.append('alt_text', 'Hero section background image');
      formData.append('image_type', 'hero');

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
        setBackgroundImage(file);
        setImagePreview(result.image_url);
        
        const updatedData = {
          ...heroData,
          background_image_url: result.image_url,
        };
        setHeroData(updatedData);
        onChange(updatedData);
        
        toast({
          title: 'Image uploaded',
          description: 'Background image has been uploaded successfully',
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
        description: 'Failed to upload background image',
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

  const handleMultipleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append('images', file);
      });
      formData.append('image_type', 'hero');

      const token = localStorage.getItem('access');
      const response = await fetch('http://localhost:8001/api/homepage/images/upload_multiple/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        const newImages = result.images.map((img: any) => img.image_url);
        
        const updatedData = {
          ...heroData,
          background_images: [...(heroData.background_images || []), ...newImages],
        };
        setHeroData(updatedData);
        onChange(updatedData);
        
        toast({
          title: 'Success',
          description: `Uploaded ${files.length} images successfully`,
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
        description: 'Failed to upload images',
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
    setBackgroundImage(null);
    setImagePreview('');
    const updatedData = {
      ...heroData,
      background_image: undefined,
      background_image_url: undefined,
    };
    setHeroData(updatedData);
    onChange(updatedData);
    
    toast({
      title: 'Image removed',
      description: 'Background image has been removed',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const removeBackgroundImage = (index: number) => {
    const updatedImages = [...(heroData.background_images || [])];
    updatedImages.splice(index, 1);
    const updatedData = {
      ...heroData,
      background_images: updatedImages,
    };
    setHeroData(updatedData);
    onChange(updatedData);
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    const updatedImages = [...(heroData.background_images || [])];
    const [movedImage] = updatedImages.splice(fromIndex, 1);
    updatedImages.splice(toIndex, 0, movedImage);
    const updatedData = {
      ...heroData,
      background_images: updatedImages,
    };
    setHeroData(updatedData);
    onChange(updatedData);
  };

  const openImageModal = (index: number) => {
    setSelectedImageIndex(index);
    onOpen();
  };

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        {/* Basic Information */}
        <Card>
          <CardBody>
            <VStack spacing={6} align="stretch">
              <Text fontSize="xl" fontWeight="bold">
                Hero Section Configuration
              </Text>
              
              <FormControl>
                <FormLabel>Title</FormLabel>
                <Input
                  value={heroData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter hero title"
                />
                <FormHelperText>The main headline of your hero section</FormHelperText>
              </FormControl>

              <FormControl>
                <FormLabel>Subtitle</FormLabel>
                <Input
                  value={heroData.subtitle}
                  onChange={(e) => handleInputChange('subtitle', e.target.value)}
                  placeholder="Enter hero subtitle"
                />
                <FormHelperText>A brief subtitle or tagline</FormHelperText>
              </FormControl>

              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={heroData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter hero description"
                  rows={4}
                />
                <FormHelperText>A detailed description of your hero section</FormHelperText>
              </FormControl>
            </VStack>
          </CardBody>
        </Card>

        {/* Background Images */}
        <Card>
          <CardBody>
            <VStack spacing={6} align="stretch">
              <Text fontSize="lg" fontWeight="semibold">
                Background Images
              </Text>

              {/* Main Background Image */}
              <FormControl>
                <FormLabel>Main Background Image</FormLabel>
                <HStack spacing={4}>
                  <Button
                    leftIcon={<PhotoIcon className="w-5 h-5" />}
                    variant="outline"
                    onClick={() => document.getElementById('background-image-input')?.click()}
                    isLoading={isUploading}
                  >
                    Choose Image
                  </Button>
                  {imagePreview && (
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
                  id="background-image-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
                <FormHelperText>Upload a high-quality background image for your hero section</FormHelperText>
              </FormControl>

              {imagePreview && (
                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={2}>
                    Main Image Preview:
                  </Text>
                  <Image
                    src={imagePreview}
                    alt="Background preview"
                    borderRadius="md"
                    maxH="200px"
                    objectFit="cover"
                  />
                </Box>
              )}

              <Divider />

              {/* Multiple Background Images */}
              <FormControl>
                <FormLabel>Additional Background Images (for rotation)</FormLabel>
                <HStack spacing={4}>
                  <Button
                    leftIcon={<PlusIcon className="w-5 h-5" />}
                    variant="outline"
                    onClick={() => document.getElementById('multiple-images-input')?.click()}
                    isLoading={isUploading}
                  >
                    Upload Multiple Images
                  </Button>
                  <Badge colorScheme="blue" variant="subtle">
                    {(heroData.background_images || []).length} images
                  </Badge>
                </HStack>
                <input
                  id="multiple-images-input"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleMultipleImageUpload}
                  style={{ display: 'none' }}
                />
                <FormHelperText>Upload multiple images for background rotation</FormHelperText>
              </FormControl>

              {isUploading && (
                <Box>
                  <Progress value={uploadProgress} colorScheme="blue" size="sm" />
                  <Text fontSize="sm" mt={2}>Uploading images...</Text>
                </Box>
              )}

              {/* Image Grid */}
              {(heroData.background_images || []).length > 0 && (
                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={3}>
                    Background Images ({heroData.background_images?.length}):
                  </Text>
                  <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={4}>
                    {(heroData.background_images || []).map((imageUrl, index) => (
                      <Card key={index} size="sm">
                        <CardBody p={2}>
                          <VStack spacing={2}>
                            <Box position="relative">
                              <Image
                                src={imageUrl}
                                alt={`Background ${index + 1}`}
                                borderRadius="md"
                                h="100px"
                                w="100%"
                                objectFit="cover"
                                cursor="pointer"
                                onClick={() => openImageModal(index)}
                              />
                              <HStack
                                position="absolute"
                                top={1}
                                right={1}
                                spacing={1}
                              >
                                <IconButton
                                  aria-label="View image"
                                  icon={<EyeIcon className="w-3 h-3" />}
                                  size="xs"
                                  colorScheme="blue"
                                  onClick={() => openImageModal(index)}
                                />
                                <IconButton
                                  aria-label="Remove image"
                                  icon={<TrashIcon className="w-3 h-3" />}
                                  size="xs"
                                  colorScheme="red"
                                  onClick={() => removeBackgroundImage(index)}
                                />
                              </HStack>
                            </Box>
                            <HStack spacing={1}>
                              {index > 0 && (
                                <IconButton
                                  aria-label="Move up"
                                  icon={<ArrowsUpDownIcon className="w-3 h-3" />}
                                  size="xs"
                                  variant="outline"
                                  onClick={() => moveImage(index, index - 1)}
                                />
                              )}
                              {index < (heroData.background_images?.length || 0) - 1 && (
                                <IconButton
                                  aria-label="Move down"
                                  icon={<ArrowsUpDownIcon className="w-3 h-3" />}
                                  size="xs"
                                  variant="outline"
                                  onClick={() => moveImage(index, index + 1)}
                                />
                              )}
                            </HStack>
                            <Text fontSize="xs" textAlign="center">
                              Image {index + 1}
                            </Text>
                          </VStack>
                        </CardBody>
                      </Card>
                    ))}
                  </SimpleGrid>
                </Box>
              )}
            </VStack>
          </CardBody>
        </Card>

        {/* Call-to-Action Buttons */}
        <Card>
          <CardBody>
            <VStack spacing={6} align="stretch">
              <Text fontSize="lg" fontWeight="semibold">
                Call-to-Action Buttons
              </Text>

              <HStack spacing={4}>
                <FormControl>
                  <FormLabel>Primary CTA Text</FormLabel>
                  <Input
                    value={heroData.cta_primary_text}
                    onChange={(e) => handleInputChange('cta_primary_text', e.target.value)}
                    placeholder="Get Started"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Primary CTA URL</FormLabel>
                  <Input
                    value={heroData.cta_primary_url}
                    onChange={(e) => handleInputChange('cta_primary_url', e.target.value)}
                    placeholder="#"
                  />
                </FormControl>
              </HStack>

              <HStack spacing={4}>
                <FormControl>
                  <FormLabel>Secondary CTA Text</FormLabel>
                  <Input
                    value={heroData.cta_secondary_text}
                    onChange={(e) => handleInputChange('cta_secondary_text', e.target.value)}
                    placeholder="Learn More"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Secondary CTA URL</FormLabel>
                  <Input
                    value={heroData.cta_secondary_url}
                    onChange={(e) => handleInputChange('cta_secondary_url', e.target.value)}
                    placeholder="#"
                  />
                </FormControl>
              </HStack>
            </VStack>
          </CardBody>
        </Card>

        {/* Settings */}
        <Card>
          <CardBody>
            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="is-active" mb="0">
                Active
              </FormLabel>
              <Switch
                id="is-active"
                isChecked={heroData.is_active}
                onChange={(e) => handleInputChange('is_active', e.target.checked)}
              />
              <FormHelperText ml={3}>
                Enable or disable this hero section
              </FormHelperText>
            </FormControl>
          </CardBody>
        </Card>
      </VStack>

      {/* Image Preview Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Image Preview</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedImageIndex !== null && heroData.background_images && (
              <VStack spacing={4}>
                <Image
                  src={heroData.background_images[selectedImageIndex]}
                  alt={`Background ${selectedImageIndex + 1}`}
                  borderRadius="md"
                  maxH="400px"
                  objectFit="contain"
                />
                <Text fontSize="sm" color="gray.600">
                  Image {selectedImageIndex + 1} of {heroData.background_images.length}
                </Text>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}; 