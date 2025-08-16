import React, { useState, useCallback, useRef } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Icon,
  Button,
  Image,
  IconButton,
  Progress,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast,
  Flex,
  Badge,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import {
  PhotoIcon,
  XMarkIcon,
  StarIcon,
  ArrowsUpDownIcon,
  EyeIcon,
  TrashIcon,
  CloudArrowUpIcon,
} from '@heroicons/react/24/outline';
import { apiUpload } from '../../api';

interface ImageFile {
  id: string;
  file?: File;
  url?: string;
  name: string;
  size: number;
  isUploading: boolean;
  uploadProgress: number;
  isFeatured: boolean;
  isNew: boolean;
}

interface ImageUploadProps {
  images: ImageFile[];
  onImagesChange: (images: ImageFile[]) => void;
  maxImages?: number;
  maxFileSize?: number; // in MB
  acceptedTypes?: string[];
  title?: string;
  description?: string;
}

export function ImageUpload({
  images,
  onImagesChange,
  maxImages = 10,
  maxFileSize = 5,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  title = 'Images',
  description = 'Upload images for this item'
}: ImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewImage, setPreviewImage] = useState<ImageFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;

    const newImages: ImageFile[] = [];
    const errors: string[] = [];

    Array.from(files).forEach((file) => {
      // Validate file type
      if (!acceptedTypes.includes(file.type)) {
        errors.push(`${file.name} is not a supported image type`);
        return;
      }

      // Validate file size
      if (file.size > maxFileSize * 1024 * 1024) {
        errors.push(`${file.name} is too large (max ${maxFileSize}MB)`);
        return;
      }

      // Check if we've reached max images
      if (images.length + newImages.length >= maxImages) {
        errors.push(`Maximum ${maxImages} images allowed`);
        return;
      }

      const imageFile: ImageFile = {
        id: `new-${Date.now()}-${Math.random()}`,
        file,
        name: file.name,
        size: file.size,
        isUploading: false,
        uploadProgress: 0,
        isFeatured: false,
        isNew: true,
      };

      newImages.push(imageFile);
    });

    if (errors.length > 0) {
      toast({
        title: 'Upload Errors',
        description: errors.join(', '),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }

    if (newImages.length > 0) {
      onImagesChange([...images, ...newImages]);
    }
  }, [images, maxImages, maxFileSize, acceptedTypes, onImagesChange, toast]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [handleFileSelect]);

  const uploadImage = async (imageFile: ImageFile): Promise<string> => {
    if (!imageFile.file) {
      throw new Error('No file to upload');
    }

    const formData = new FormData();
    formData.append('image', imageFile.file);

    try {
      const response = await apiUpload('/upload-image/', formData, (progress) => {
        // Update upload progress
        onImagesChange(images.map(img => 
          img.id === imageFile.id 
            ? { ...img, uploadProgress: progress }
            : img
        ));
      });

      return response.url || response.image_url;
    } catch (error) {
      throw new Error('Failed to upload image');
    }
  };

  const uploadAllImages = async () => {
    const newImages = images.filter(img => img.isNew && img.file);
    
    if (newImages.length === 0) return;

    // Mark images as uploading
    onImagesChange(images.map(img => 
      img.isNew && img.file 
        ? { ...img, isUploading: true, uploadProgress: 0 }
        : img
    ));

    try {
      const uploadPromises = newImages.map(async (imageFile) => {
        const url = await uploadImage(imageFile);
        return { ...imageFile, url, isUploading: false, isNew: false };
      });

      const uploadedImages = await Promise.all(uploadPromises);
      
      // Replace new images with uploaded ones
      onImagesChange(images.map(img => {
        const uploaded = uploadedImages.find(uploaded => uploaded.id === img.id);
        return uploaded || img;
      }));

      toast({
        title: 'Success',
        description: `${uploadedImages.length} images uploaded successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Upload Failed',
        description: 'Some images failed to upload. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });

      // Reset uploading state
      onImagesChange(images.map(img => 
        img.isNew && img.file 
          ? { ...img, isUploading: false, uploadProgress: 0 }
          : img
      ));
    }
  };

  const removeImage = (imageId: string) => {
    onImagesChange(images.filter(img => img.id !== imageId));
  };

  const setFeaturedImage = (imageId: string) => {
    onImagesChange(images.map(img => ({
      ...img,
      isFeatured: img.id === imageId
    })));
  };

  const moveImage = (imageId: string, direction: 'up' | 'down') => {
    const currentIndex = images.findIndex(img => img.id === imageId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= images.length) return;

    const newImages = [...images];
    [newImages[currentIndex], newImages[newIndex]] = [newImages[newIndex], newImages[currentIndex]];
    onImagesChange(newImages);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const hasNewImages = images.some(img => img.isNew && img.file);
  const hasUploadingImages = images.some(img => img.isUploading);

  return (
    <VStack spacing={4} align="stretch">
      <Box>
        <Text fontSize="lg" fontWeight="semibold" color="gray.700" mb={1}>
          {title}
        </Text>
        <Text fontSize="sm" color="gray.500">
          {description}
        </Text>
      </Box>

      {/* Upload Area */}
      <Box
        border="2px dashed"
        borderColor={isDragOver ? "purple.400" : "gray.300"}
        borderRadius="lg"
        p={6}
        textAlign="center"
        bg={isDragOver ? "purple.50" : "gray.50"}
        transition="all 0.2s"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        cursor="pointer"
        onClick={() => fileInputRef.current?.click()}
        _hover={{ borderColor: "purple.400", bg: "purple.50" }}
      >
        <VStack spacing={3}>
          <Icon as={CloudArrowUpIcon} h={8} w={8} color="gray.400" />
          <Text fontSize="sm" color="gray.600">
            Drag and drop images here, or click to select
          </Text>
          <Text fontSize="xs" color="gray.500">
            Max {maxImages} images, {maxFileSize}MB each. Supported: JPG, PNG, WebP
          </Text>
        </VStack>
      </Box>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(',')}
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
      />

      {/* Upload Button */}
      {hasNewImages && !hasUploadingImages && (
        <Button
          colorScheme="purple"
          leftIcon={<Icon as={CloudArrowUpIcon} h={4} w={4} />}
          onClick={uploadAllImages}
        >
          Upload {images.filter(img => img.isNew && img.file).length} Images
        </Button>
      )}

      {/* Images Grid */}
      {images.length > 0 && (
        <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={4}>
          {images.map((image, index) => (
            <GridItem key={image.id}>
              <Box
                border="1px solid"
                borderColor="gray.200"
                borderRadius="lg"
                overflow="hidden"
                position="relative"
                role="group"
              >
                {/* Image Preview */}
                <Box
                  h="150px"
                  bg="gray.100"
                  position="relative"
                  cursor="pointer"
                  onClick={() => setPreviewImage(image)}
                >
                  {image.url ? (
                    <Image
                      src={image.url}
                      alt={image.name}
                      w="full"
                      h="full"
                      objectFit="cover"
                    />
                  ) : image.file ? (
                    <Box
                      w="full"
                      h="full"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <VStack spacing={2}>
                        <Icon as={PhotoIcon} h={8} w={8} color="gray.400" />
                        <Text fontSize="xs" color="gray.500" textAlign="center">
                          {image.name}
                        </Text>
                      </VStack>
                    </Box>
                  ) : null}

                  {/* Upload Progress */}
                  {image.isUploading && (
                    <Box
                      position="absolute"
                      bottom={0}
                      left={0}
                      right={0}
                      bg="blackAlpha.700"
                      p={2}
                    >
                      <Progress
                        value={image.uploadProgress}
                        size="sm"
                        colorScheme="purple"
                        borderRadius="full"
                      />
                      <Text fontSize="xs" color="white" textAlign="center" mt={1}>
                        {image.uploadProgress}%
                      </Text>
                    </Box>
                  )}

                  {/* Featured Badge */}
                  {image.isFeatured && (
                    <Badge
                      position="absolute"
                      top={2}
                      left={2}
                      colorScheme="yellow"
                      variant="solid"
                      fontSize="xs"
                    >
                      Featured
                    </Badge>
                  )}

                  {/* Action Buttons */}
                  <Box
                    position="absolute"
                    top={2}
                    right={2}
                    opacity={0}
                    _groupHover={{ opacity: 1 }}
                    transition="opacity 0.2s"
                  >
                    <HStack spacing={1}>
                      <Tooltip label="Preview">
                        <IconButton
                          aria-label="Preview image"
                          icon={<Icon as={EyeIcon} h={3} w={3} />}
                          size="xs"
                          colorScheme="blue"
                          variant="solid"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewImage(image);
                          }}
                        />
                      </Tooltip>
                      <Tooltip label="Set as featured">
                        <IconButton
                          aria-label="Set as featured"
                          icon={<Icon as={StarIcon} h={3} w={3} />}
                          size="xs"
                          colorScheme={image.isFeatured ? "yellow" : "gray"}
                          variant="solid"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFeaturedImage(image.id);
                          }}
                        />
                      </Tooltip>
                      <Tooltip label="Remove">
                        <IconButton
                          aria-label="Remove image"
                          icon={<Icon as={TrashIcon} h={3} w={3} />}
                          size="xs"
                          colorScheme="red"
                          variant="solid"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage(image.id);
                          }}
                        />
                      </Tooltip>
                    </HStack>
                  </Box>
                </Box>

                {/* Image Info */}
                <Box p={3}>
                  <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
                    {image.name}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {formatFileSize(image.size)}
                  </Text>
                  
                  {/* Reorder Buttons */}
                  <HStack spacing={1} mt={2}>
                    <IconButton
                      aria-label="Move up"
                      icon={<Icon as={ArrowsUpDownIcon} h={3} w={3} />}
                      size="xs"
                      variant="ghost"
                      isDisabled={index === 0}
                      onClick={() => moveImage(image.id, 'up')}
                    />
                    <IconButton
                      aria-label="Move down"
                      icon={<Icon as={ArrowsUpDownIcon} h={3} w={3} />}
                      size="xs"
                      variant="ghost"
                      isDisabled={index === images.length - 1}
                      onClick={() => moveImage(image.id, 'down')}
                    />
                  </HStack>
                </Box>
              </Box>
            </GridItem>
          ))}
        </Grid>
      )}

      {/* Image Preview Modal */}
      <Modal isOpen={!!previewImage} onClose={() => setPreviewImage(null)} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Image Preview</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {previewImage && (
              <VStack spacing={4}>
                <Image
                  src={previewImage.url || URL.createObjectURL(previewImage.file!)}
                  alt={previewImage.name}
                  maxH="400px"
                  objectFit="contain"
                />
                <VStack spacing={2}>
                  <Text fontWeight="semibold">{previewImage.name}</Text>
                  <Text fontSize="sm" color="gray.500">
                    {formatFileSize(previewImage.size)}
                  </Text>
                  {previewImage.isFeatured && (
                    <Badge colorScheme="yellow">Featured Image</Badge>
                  )}
                </VStack>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  );
}
