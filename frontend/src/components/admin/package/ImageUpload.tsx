import React, { useState, useRef } from 'react';
import { Box, Button, Image, VStack, HStack, Text, IconButton, useToast, Progress, Icon, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Select } from '@chakra-ui/react';
import { PlusIcon, XMarkIcon, PhotoIcon, VideoCameraIcon } from '@heroicons/react/24/outline';
import { apiUpload, apiPost, apiDelete } from '../../../api';
import { MediaLibrary } from '../cms/MediaLibrary';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface MediaItem {
  id?: number;
  media_type: 'image' | 'video';
  image?: string;
  video?: string;
  video_thumbnail?: string;
  caption?: string;
  order?: number;
  is_featured?: boolean;
  file?: File; // Store original file for new packages
}

interface ImageUploadProps {
  images: Array<MediaItem>;
  onChange: (images: Array<MediaItem>) => void;
  packageId?: number;
}

// Sortable Item Component
interface SortableItemProps {
  id: string;
  media: MediaItem;
  index: number;
  onRemove: (index: number) => void;
  onSetFeatured: (index: number) => void;
  onUpdateCaption: (index: number, caption: string) => void;
}

function SortableItem({ id, media, index, onRemove, onSetFeatured, onUpdateCaption }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      border="1px"
      borderColor="gray.200"
      borderRadius="md"
      p={3}
      position="relative"
      bg={isDragging ? "gray.50" : "white"}
      _hover={{ shadow: "sm" }}
      transition="all 0.2s"
    >
      <HStack spacing={3}>
        <Box
          {...attributes}
          {...listeners}
          cursor="grab"
          _active={{ cursor: "grabbing" }}
          p={1}
          borderRadius="md"
          _hover={{ bg: "gray.100" }}
        >
          <Icon as={PhotoIcon} h={4} w={4} color="gray.400" />
        </Box>

        {/* Media Preview */}
        <Box position="relative">
          {media.media_type === 'video' ? (
            <Box
              boxSize="80px"
              borderRadius="md"
              overflow="hidden"
              bg="gray.100"
              display="flex"
              alignItems="center"
              justifyContent="center"
              position="relative"
            >
              {media.video_thumbnail || media.video ? (
                <Image
                  src={media.video_thumbnail || (media.video && media.video.includes('.') ? media.video.replace(/\.[^/.]+$/, '.jpg') : '')}
                  alt={media.caption || `Video ${index + 1}`}
                  boxSize="80px"
                  objectFit="cover"
                  borderRadius="md"
                  fallback={<Icon as={VideoCameraIcon} h={6} w={6} color="gray.400" />}
                />
              ) : (
                <Icon as={VideoCameraIcon} h={6} w={6} color="gray.400" />
              )}
              <Box
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                bg="blackAlpha.600"
                borderRadius="full"
                p={1}
              >
                <Icon as={VideoCameraIcon} h={3} w={3} color="white" />
              </Box>
            </Box>
          ) : (
            <Image
              src={media.image}
              alt={media.caption || `Image ${index + 1}`}
              boxSize="80px"
              objectFit="cover"
              borderRadius="md"
              fallbackSrc="https://via.placeholder.com/80x80?text=Image"
              onError={(e) => {
                // Handle blob URL cleanup on error
                if (media.image?.startsWith('blob:')) {
                  URL.revokeObjectURL(media.image);
                }
              }}
            />
          )}

          {/* Media Type Badge */}
          <Box
            position="absolute"
            top="-2"
            right="-2"
            bg={media.media_type === 'video' ? 'red.500' : 'blue.500'}
            color="white"
            fontSize="xs"
            px={1}
            py={0.5}
            borderRadius="sm"
            fontWeight="bold"
          >
            {media.media_type === 'video' ? 'VID' : 'IMG'}
          </Box>
        </Box>

        <VStack flex={1} align="start" spacing={2}>
          <Text
            fontSize="sm"
            fontWeight="medium"
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onUpdateCaption(index, e.currentTarget.textContent || '')}
            _hover={{ bg: 'gray.50' }}
            px={2}
            py={1}
            borderRadius="md"
            minW="200px"
          >
            {media.caption || `${media.media_type === 'video' ? 'Video' : 'Image'} ${index + 1}`}
          </Text>

          <HStack spacing={2}>
            <Button
              size="sm"
              variant={media.is_featured ? "solid" : "outline"}
              colorScheme={media.is_featured ? "green" : "gray"}
              onClick={() => onSetFeatured(index)}
            >
              {media.is_featured ? "Featured" : "Set Featured"}
            </Button>

            <Text fontSize="xs" color="gray.500">
              Order: {index + 1}
            </Text>
          </HStack>
        </VStack>

        <IconButton
          aria-label="Remove image"
          icon={<Icon as={XMarkIcon} />}
          size="sm"
          colorScheme="red"
          variant="ghost"
          onClick={() => onRemove(index)}
        />
      </HStack>
    </Box>
  );
}

const ImageUpload: React.FC<ImageUploadProps> = ({ images, onChange, packageId }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);
  const [selectedMediaType, setSelectedMediaType] = useState<'image' | 'video'>('image');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex((_, index) => `media-${index}` === active.id);
      const newIndex = images.findIndex((_, index) => `media-${index}` === over.id);

      const reorderedImages = arrayMove(images, oldIndex, newIndex);

      // Update order values
      const updatedImages = reorderedImages.map((img, index) => ({
        ...img,
        order: index
      }));

      onChange(updatedImages);

      toast({
        title: 'Media reordered',
        status: 'success',
        duration: 2000,
      });
    }
  };

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

        const newMedia: MediaItem = {
          media_type: selectedMediaType,
          caption: `${selectedMediaType === 'video' ? 'Video' : 'Image'} ${images.length + i + 1}`,
          order: images.length + i,
          is_featured: images.length === 0 && i === 0,
          file: file // Store the file for later upload
        };

        if (selectedMediaType === 'image') {
          newMedia.image = previewUrl;
        } else {
          newMedia.video = previewUrl;
        }

        newImages.push(newMedia);
      }

      onChange(newImages);

      toast({
        title: `${selectedMediaType === 'video' ? 'Videos' : 'Images'} added`,
        description: 'Media will be uploaded after you save the package.',
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
        formData.append('media_type', selectedMediaType);

        if (selectedMediaType === 'image') {
          formData.append('image', file);
        } else {
          formData.append('video', file);
        }

        // Use dedicated package media endpoint
        formData.append('package_id', packageId.toString());
        formData.append('caption', `${selectedMediaType === 'video' ? 'Video' : 'Image'} ${images.length + 1}`);
        formData.append('order', images.length.toString());
        formData.append('is_featured', images.length === 0 ? 'true' : 'false');

        const response = await apiUpload('/package-images/', formData);

        if (response.success || response.id) {
          const newMedia: MediaItem = {
            id: response.id || response.data?.id,
            media_type: selectedMediaType,
            caption: response.caption || response.data?.caption || `${selectedMediaType === 'video' ? 'Video' : 'Image'} ${images.length + 1}`,
            order: response.order || response.data?.order || images.length,
            is_featured: response.is_featured || response.data?.is_featured || images.length === 0,
            file: file // Store the original file for later use
          };

          if (selectedMediaType === 'image') {
            newMedia.image = response.image || response.data?.image;
          } else {
            newMedia.video = response.video || response.data?.video;
            newMedia.video_thumbnail = response.video_thumbnail || response.data?.video_thumbnail;
          }

          onChange([...images, newMedia]);

          toast({
            title: `${selectedMediaType === 'video' ? 'Video' : 'Image'} uploaded successfully`,
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
        description: `Failed to upload ${selectedMediaType}. Please try again.`,
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
    const mediaToRemove = images[index];

    // If we have an ID and packageId, delete from backend
    if (mediaToRemove.id && packageId) {
      try {
        await apiDelete(`/package-images/${mediaToRemove.id}/`);
      } catch (error) {
        console.error('Failed to delete media from backend:', error);
      }
    }

    // Clean up blob URLs for media that haven't been uploaded yet
    if (mediaToRemove.image && mediaToRemove.image.startsWith('blob:')) {
      URL.revokeObjectURL(mediaToRemove.image);
    }
    if (mediaToRemove.video && mediaToRemove.video.startsWith('blob:')) {
      URL.revokeObjectURL(mediaToRemove.video);
    }

    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);

    toast({
      title: `${mediaToRemove.media_type === 'video' ? 'Video' : 'Image'} removed`,
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
    console.log('Media library selection triggered with asset:', asset);

    if (!packageId) {
      toast({
        title: 'Cannot select images',
        description: 'Please save the package first before selecting images.',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    console.log('Package ID available:', packageId);

    // Create FormData for the selected media asset
    const formData = new FormData();
    formData.append('package_id', packageId.toString());
    formData.append('image_url_field', asset.file_url); // Use the media asset URL
    formData.append('caption', asset.alt_text || asset.caption || '');
    formData.append('order', images.length.toString());
    formData.append('is_featured', images.length === 0 ? 'true' : 'false');

    console.log('FormData created for package image:', {
      package_id: packageId.toString(),
      image_url_field: asset.file_url,
      caption: asset.alt_text || asset.caption || '',
      order: images.length.toString(),
      is_featured: images.length === 0 ? 'true' : 'false'
    });

    // Call the package images API to create a package image from the media asset
    apiUpload('/package-images/', formData).then((response) => {
      console.log('Package image API response:', response); // Debug logging

      // API returns data directly, not wrapped in success property
      const newImage = {
        id: response.id,
        image: response.image,
        caption: response.caption || asset.alt_text,
        order: response.order || images.length,
        is_featured: response.is_featured || images.length === 0
      };

      onChange([...images, newImage]);

      toast({
        title: 'Image selected successfully',
        status: 'success',
        duration: 3000,
      });

      // Close modal after successful selection
      setIsMediaLibraryOpen(false);
    }).catch((error) => {
      console.error('Failed to select image:', error);
      toast({
        title: 'Failed to select image',
        description: error.message || 'Please try again.',
        status: 'error',
        duration: 5000,
      });

      // Don't close modal on error so user can try again
      // setIsMediaLibraryOpen(false);
    });
  };

  return (
    <VStack spacing={4} align="stretch">
      <Box>
        <input
          ref={fileInputRef}
          type="file"
          accept={selectedMediaType === 'video' ? 'video/*' : 'image/*'}
          multiple
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        {!packageId ? (
          <Box p={4} bg="yellow.50" border="1px" borderColor="yellow.200" borderRadius="md">
            <Text fontSize="sm" color="yellow.800">
              💡 Save the package first to enable media uploads
            </Text>
          </Box>
        ) : (
          <VStack spacing={3} w="full">
            {/* Media Type Selector */}
            <HStack spacing={2} w="full">
              <Text fontSize="sm" fontWeight="medium" minW="80px">Upload:</Text>
              <Select
                value={selectedMediaType}
                onChange={(e) => setSelectedMediaType(e.target.value as 'image' | 'video')}
                size="sm"
                maxW="150px"
              >
                <option value="image">Images</option>
                <option value="video">Videos</option>
              </Select>
            </HStack>

            <HStack spacing={2} w="full">
              <Button
                leftIcon={<Icon as={selectedMediaType === 'video' ? VideoCameraIcon : PlusIcon} />}
                onClick={() => fileInputRef.current?.click()}
                isLoading={uploading}
                loadingText="Uploading..."
                colorScheme="blue"
                variant="outline"
                flex={1}
                size="sm"
              >
                Upload {selectedMediaType === 'video' ? 'Video' : 'Image'}
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
          </VStack>
        )}

        {uploading && (
          <Progress value={uploadProgress} size="sm" mt={2} />
        )}
      </Box>

      {images.length > 0 && (
        <VStack spacing={3} align="stretch">
          <HStack justify="space-between" align="center">
            <Text fontWeight="bold">Uploaded Media:</Text>
            <Text fontSize="sm" color="gray.500">
              Drag media to reorder them
            </Text>
          </HStack>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={images.map((_, index) => `media-${index}`)}
              strategy={verticalListSortingStrategy}
            >
              <VStack spacing={3} align="stretch">
                {images.map((media, index) => (
                  <SortableItem
                    key={`media-${index}`}
                    id={`media-${index}`}
                    media={media}
                    index={index}
                    onRemove={removeImage}
                    onSetFeatured={setFeatured}
                    onUpdateCaption={updateCaption}
                  />
                ))}
              </VStack>
            </SortableContext>
          </DndContext>
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
