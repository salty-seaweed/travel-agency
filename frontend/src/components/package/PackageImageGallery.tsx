import React, { useState } from 'react';
import {
  Box,
  Image,
  SimpleGrid,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  HStack,
  VStack,
  Text,
  Badge,
  Icon,
  useBreakpointValue,
} from '@chakra-ui/react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';
import { LazyImage } from '../LazyImage';
import type { PackageImage } from '../../types';

interface PackageImageGalleryProps {
  images: PackageImage[];
  packageName: string;
}

export function PackageImageGallery({ images, packageName }: PackageImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });

  if (!images || images.length === 0) {
    return (
      <Box
        h="400px"
        bg="gray.100"
        borderRadius="xl"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <Icon as={PhotoIcon} h={16} w={16} color="gray.400" mb={4} />
        <Text color="gray.500" fontSize="lg">No images available</Text>
      </Box>
    );
  }

  const featuredImage = images[selectedImageIndex] || images[0];
  const imageCount = images.length;

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    if (isMobile) {
      onOpen();
    }
  };

  const handlePrevious = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? imageCount - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedImageIndex((prev) => (prev === imageCount - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') handlePrevious();
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'Escape') onClose();
  };

  return (
    <Box>
      {/* Main Featured Image */}
      <Box position="relative" mb={4}>
        <Box
          position="relative"
          h={{ base: "300px", md: "400px", lg: "500px" }}
          borderRadius="xl"
          overflow="hidden"
          cursor="pointer"
          onClick={onOpen}
          _hover={{ transform: 'scale(1.02)' }}
          transition="transform 0.2s"
        >
          <LazyImage
            src={featuredImage.image_url || featuredImage.image}
            alt={`${packageName} - Image ${selectedImageIndex + 1}`}
            w="full"
            h="full"
            objectFit="cover"
            fallbackSrc="/placeholder-image.jpg"
          />
          
          {/* Image Counter */}
          <Box
            position="absolute"
            top={4}
            right={4}
            bg="blackAlpha.700"
            color="white"
            px={3}
            py={1}
            borderRadius="full"
            fontSize="sm"
            fontWeight="medium"
          >
            {selectedImageIndex + 1} / {imageCount}
          </Box>

          {/* Zoom Icon */}
          <Box
            position="absolute"
            top={4}
            left={4}
            bg="blackAlpha.700"
            color="white"
            p={2}
            borderRadius="full"
          >
            <Icon as={MagnifyingGlassIcon} h={4} w={4} />
          </Box>

          {/* Navigation Arrows (Desktop) */}
          {!isMobile && imageCount > 1 && (
            <>
              <IconButton
                aria-label="Previous image"
                icon={<Icon as={ChevronLeftIcon} />}
                position="absolute"
                left={4}
                top="50%"
                transform="translateY(-50%)"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevious();
                }}
                bg="blackAlpha.700"
                color="white"
                _hover={{ bg: 'blackAlpha.800' }}
                size="lg"
                borderRadius="full"
              />
              <IconButton
                aria-label="Next image"
                icon={<Icon as={ChevronRightIcon} />}
                position="absolute"
                right={4}
                top="50%"
                transform="translateY(-50%)"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                bg="blackAlpha.700"
                color="white"
                _hover={{ bg: 'blackAlpha.800' }}
                size="lg"
                borderRadius="full"
              />
            </>
          )}
        </Box>
      </Box>

      {/* Thumbnail Grid */}
      {imageCount > 1 && (
        <SimpleGrid columns={{ base: 4, md: 6, lg: 8 }} spacing={2}>
          {images.map((image, index) => (
            <Box
              key={index}
              position="relative"
              cursor="pointer"
              borderRadius="md"
              overflow="hidden"
              border={selectedImageIndex === index ? "3px solid" : "1px solid"}
              borderColor={selectedImageIndex === index ? "purple.500" : "gray.200"}
              _hover={{ transform: 'scale(1.05)' }}
              transition="all 0.2s"
              onClick={() => handleImageClick(index)}
            >
              <LazyImage
                src={image.image_url || image.image}
                alt={`${packageName} - Thumbnail ${index + 1}`}
                h="80px"
                w="full"
                objectFit="cover"
                fallbackSrc="/placeholder-image.jpg"
              />
              
              {/* Featured Badge */}
              {image.is_featured && (
                <Badge
                  position="absolute"
                  top={1}
                  right={1}
                  colorScheme="yellow"
                  size="sm"
                  fontSize="xs"
                >
                  Featured
                </Badge>
              )}
            </Box>
          ))}
        </SimpleGrid>
      )}

      {/* Lightbox Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="6xl" isCentered>
        <ModalOverlay bg="blackAlpha.800" />
        <ModalContent bg="transparent" boxShadow="none" maxW="90vw" maxH="90vh">
          <ModalCloseButton
            color="white"
            bg="blackAlpha.700"
            borderRadius="full"
            _hover={{ bg: 'blackAlpha.800' }}
            zIndex={10}
          />
          <ModalBody p={0} position="relative">
            <Box
              position="relative"
              h="80vh"
              display="flex"
              alignItems="center"
              justifyContent="center"
              onKeyDown={handleKeyDown}
              tabIndex={0}
            >
              <LazyImage
                src={featuredImage.image_url || featuredImage.image}
                alt={`${packageName} - Full size ${selectedImageIndex + 1}`}
                maxW="full"
                maxH="full"
                objectFit="contain"
                fallbackSrc="/placeholder-image.jpg"
              />
              
              {/* Navigation Arrows */}
              {imageCount > 1 && (
                <>
                  <IconButton
                    aria-label="Previous image"
                    icon={<Icon as={ChevronLeftIcon} />}
                    position="absolute"
                    left={4}
                    top="50%"
                    transform="translateY(-50%)"
                    onClick={handlePrevious}
                    bg="blackAlpha.700"
                    color="white"
                    _hover={{ bg: 'blackAlpha.800' }}
                    size="lg"
                    borderRadius="full"
                  />
                  <IconButton
                    aria-label="Next image"
                    icon={<Icon as={ChevronRightIcon} />}
                    position="absolute"
                    right={4}
                    top="50%"
                    transform="translateY(-50%)"
                    onClick={handleNext}
                    bg="blackAlpha.700"
                    color="white"
                    _hover={{ bg: 'blackAlpha.800' }}
                    size="lg"
                    borderRadius="full"
                  />
                </>
              )}
              
              {/* Image Info */}
              <VStack
                position="absolute"
                bottom={4}
                left="50%"
                transform="translateX(-50%)"
                bg="blackAlpha.700"
                color="white"
                px={4}
                py={2}
                borderRadius="full"
                spacing={0}
              >
                <Text fontSize="sm" fontWeight="medium">
                  {selectedImageIndex + 1} of {imageCount}
                </Text>
                {featuredImage.caption && (
                  <Text fontSize="xs" opacity={0.8}>
                    {featuredImage.caption}
                  </Text>
                )}
              </VStack>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
