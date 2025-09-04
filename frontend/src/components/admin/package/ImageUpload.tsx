import React, { useState, useRef } from 'react';
import { Box, Button, Image, VStack, HStack, Text, IconButton, useToast, Progress, Icon, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import { PlusIcon, XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { apiUpload, apiPost, apiDelete } from '../../../api';
import { MediaLibrary } from '../cms/MediaLibrary';

interface ImageUploadProps {
  images: Array<{
    id?: number;
    image: string;
    caption?: string;
    order?: number;
    is_featured?: boolean;
    file?: File; // Store original file for new packages
  }>;
  onChange: (images: Array<{
    id?: number;
    image: string;
    caption?: string;
    order?: number;
    is_featured?: boolean;
    file?: File; // Store original file for new packages
  }>) => void;
  packageId?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ images, onChange, packageId }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // If no packageId is available, we'll store the files for later upload
    if (!packageId) {
      // Create preview URLs and store files for later upload
      const newImages = [...images];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const previewUrl = URL.createObjectURL(file);

        newImages.push({
          image: previewUrl,
          caption: file.name,
          order: images.length + i,
          is_featured: images.length === 0 && i === 0,
          file: file // Store the file for later upload
        });
      }

      onChange(newImages);

      toast({
        title: 'Images added',
        description: 'Images will be uploaded after you save the package.',
        status: 'info',
        duration: 3000,
      });

      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Create FormData for file upload
        const formData = new FormData();
        formData.append('image', file);

        // Use dedicated package image endpoint
        formData.append('package_id', packageId.toString());
        formData.append('caption', file.name);
        formData.append('order', images.length.toString());
        formData.append('is_featured', images.length === 0 ? 'true' : 'false');

        const response = await apiUpload('/package-images/', formData);

        if (response.success) {
          const newImage = {
            id: response.data.id,
            image: response.data.image,
            caption: response.data.caption || file.name,
            order: response.data.order || images.length,
            is_featured: response.data.is_featured || images.length === 0,
            file: file // Store the original file for later use
          };

          onChange([...images, newImage]);

          toast({
            title: 'Image uploaded successfully',
            status: 'success',
            duration: 3000,
          });
        }

        setUploadProgress(((i + 1) / files.length) * 100);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: 'Failed to upload image. Please try again.',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = async (index: number) => {
    const imageToRemove = images[index];

    // If we have an ID and packageId, delete from backend
    if (imageToRemove.id && packageId) {
      try {
        await apiDelete(`/package-images/${imageToRemove.id}/`);
      } catch (error) {
        console.error('Failed to delete image from backend:', error);
      }
    }

    // Clean up blob URLs for images that haven't been uploaded yet
    if (imageToRemove.image.startsWith('blob:')) {
      URL.revokeObjectURL(imageToRemove.image);
    }

    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);

    toast({
      title: 'Image removed',
      status: 'info',
      duration: 2000,
    });
  };

  const setFeatured = (index: number) => {
    const newImages = images.map((img, i) => ({
      ...img,
      is_featured: i === index
    }));
    onChange(newImages);
  };

  const updateCaption = (index: number, caption: string) => {
    const newImages = [...images];
    newImages[index] = { ...newImages[index], caption };
    onChange(newImages);
  };

  const handleMediaLibrarySelect = (asset: any) => {
    if (!packageId) {
      toast({
        title: 'Cannot select images',
        description: 'Please save the package first before selecting images.',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    // Create FormData for the selected media asset
    const formData = new FormData();
    formData.append('package_id', packageId.toString());
    formData.append('image_url_field', asset.file_url); // Use the media asset URL
    formData.append('caption', asset.alt_text || asset.caption || '');
    formData.append('order', images.length.toString());
    formData.append('is_featured', images.length === 0 ? 'true' : 'false');

    // Call the package images API to create a package image from the media asset
    apiUpload('/package-images/', formData).then((response) => {
      if (response.success) {
        const newImage = {
          id: response.data.id,
          image: response.data.image,
          caption: response.data.caption || asset.alt_text,
          order: response.data.order || images.length,
          is_featured: response.data.is_featured || images.length === 0
        };

        onChange([...images, newImage]);

        toast({
          title: 'Image selected successfully',
          status: 'success',
          duration: 3000,
        });
      }
    }).catch((error) => {
      console.error('Failed to select image:', error);
      toast({
        title: 'Failed to select image',
        description: 'Please try again.',
        status: 'error',
        duration: 5000,
      });
    });

    setIsMediaLibraryOpen(false);
  };

  return (
    <VStack spacing={4} align="stretch">
      <Box>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        {!packageId ? (
          <Box p={4} bg="yellow.50" border="1px" borderColor="yellow.200" borderRadius="md">
            <Text fontSize="sm" color="yellow.800">
              💡 Save the package first to enable image uploads
            </Text>
          </Box>
        ) : (
          <HStack spacing={2} w="full">
            <Button
              leftIcon={<Icon as={PlusIcon} />}
              onClick={() => fileInputRef.current?.click()}
              isLoading={uploading}
              loadingText="Uploading..."
              colorScheme="blue"
              variant="outline"
              flex={1}
              size="sm"
            >
              Upload New
            </Button>
            <Button
              leftIcon={<Icon as={PhotoIcon} />}
              onClick={() => setIsMediaLibraryOpen(true)}
              colorScheme="green"
              variant="outline"
              flex={1}
              size="sm"
            >
              Select Existing
            </Button>
          </HStack>
        )}

        {uploading && (
          <Progress value={uploadProgress} size="sm" mt={2} />
        )}
      </Box>

      {images.length > 0 && (
        <VStack spacing={3} align="stretch">
          <Text fontWeight="bold">Uploaded Images:</Text>
          {images.map((image, index) => (
            <Box
              key={index}
              border="1px"
              borderColor="gray.200"
              borderRadius="md"
              p={3}
              position="relative"
            >
              <HStack spacing={3}>
                <Image
                  src={image.image}
                  alt={image.caption || `Image ${index + 1}`}
                  boxSize="80px"
                  objectFit="cover"
                  borderRadius="md"
                  fallbackSrc="https://via.placeholder.com/80x80?text=Image"
                  onError={(e) => {
                    // Handle blob URL cleanup on error
                    if (image.image.startsWith('blob:')) {
                      URL.revokeObjectURL(image.image);
                    }
                  }}
                />
                
                <VStack flex={1} align="start" spacing={2}>
                  <Text
                    fontSize="sm"
                    fontWeight="medium"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => updateCaption(index, e.currentTarget.textContent || '')}
                    _hover={{ bg: 'gray.50' }}
                    px={2}
                    py={1}
                    borderRadius="md"
                  >
                    {image.caption || `Image ${index + 1}`}
                  </Text>
                  
                  <HStack spacing={2}>
                    <Button
                      size="sm"
                      variant={image.is_featured ? "solid" : "outline"}
                      colorScheme={image.is_featured ? "green" : "gray"}
                      onClick={() => setFeatured(index)}
                    >
                      {image.is_featured ? "Featured" : "Set Featured"}
                    </Button>
                    
                    <Text fontSize="xs" color="gray.500">
                      Order: {image.order || index}
                    </Text>
                  </HStack>
                </VStack>
                
                <IconButton
                  aria-label="Remove image"
                  icon={<Icon as={XMarkIcon} />}
                  size="sm"
                  colorScheme="red"
                  variant="ghost"
                  onClick={() => removeImage(index)}
                />
              </HStack>
            </Box>
          ))}
        </VStack>
      )}

      {/* Media Library Modal */}
      {isMediaLibraryOpen && (
        <Modal isOpen={isMediaLibraryOpen} onClose={() => setIsMediaLibraryOpen(false)} size="6xl">
          <ModalOverlay />
          <ModalContent maxW="90vw" maxH="90vh">
            <ModalHeader>Select Package Images</ModalHeader>
            <ModalCloseButton />
            <ModalBody p={0} maxH="calc(90vh - 80px)" overflow="hidden">
              <MediaLibrary
                usageContext="package-image"
                showUsageInfo={false}
                onSelect={handleMediaLibrarySelect}
                multiSelect={false} // Single select for now to keep it simple
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </VStack>
  );
};

export default ImageUpload;
