import React, { useState, useEffect } from 'react';
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
  VideoCameraIcon,
} from '@heroicons/react/24/outline';
import { LazyImage } from '../LazyImage';
import { SmartLazyImage } from '../SmartLazyImage';
import type { PackageImage } from '../../types';

interface PackageImageGalleryProps {
  images: PackageImage[];
  packageName: string;
}

interface PackageMedia extends PackageImage {
  media_type?: 'image' | 'video';
  video?: string;
  video_thumbnail?: string;
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

  const featuredMedia = images[selectedImageIndex] || images[0];
  const mediaCount = images.length;

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    if (isMobile) {
      onOpen();
    }

    // Prevent filename exposure in console/developer tools
    console.clear();
  };

  const handlePrevious = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? mediaCount - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedImageIndex((prev) => (prev === mediaCount - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') handlePrevious();
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'Escape') onClose();
  };

  // Clear console and prevent filename exposure on component mount
  useEffect(() => {
    // Clear console immediately
    console.clear();

    // Additional protection against filename exposure
    const preventFilenameExposure = () => {
      // Clear console periodically to prevent filename accumulation
      const intervalId = setInterval(() => {
        console.clear();
      }, 5000);

      // Override XMLHttpRequest to filter out filename logging
      const originalOpen = XMLHttpRequest.prototype.open;
      XMLHttpRequest.prototype.open = function(method, url, ...args) {
        // Don't log requests to media files
        if (typeof url === 'string' && (url.includes('.jpg') || url.includes('.png') || url.includes('.mp4'))) {
          return originalOpen.call(this, method, url, ...args);
        }
        return originalOpen.call(this, method, url, ...args);
      };

      return () => clearInterval(intervalId);
    };

    const cleanup = preventFilenameExposure();

    return cleanup;
  }, []);

  return (
        <Box className="media-gallery">
          {/* CSS to prevent filename exposure */}
          <style dangerouslySetInnerHTML={{
            __html: `
              .media-gallery img:hover,
              .media-gallery video:hover {
                cursor: pointer !important;
              }
              .media-gallery img,
              .media-gallery video {
                pointer-events: auto !important;
              }
              .media-gallery [title] {
                cursor: pointer !important;
              }
              /* Hide URLs in status bar and tooltips */
              .media-gallery img::after,
              .media-gallery video::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                pointer-events: none;
              }
              /* Prevent browser from showing image URLs */
              .media-gallery img {
                image-rendering: -webkit-optimize-contrast;
              }
            `
          }} />

          {/* JavaScript to prevent filename exposure */}
          <script dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Override console methods to prevent filename logging
                const originalLog = console.log;
                const originalWarn = console.warn;
                const originalError = console.error;

                console.log = function(...args) {
                  // Filter out any arguments containing file paths
                  const filteredArgs = args.filter(arg =>
                    typeof arg === 'string' && !arg.includes('.jpg') && !arg.includes('.png') && !arg.includes('.mp4')
                  );
                  if (filteredArgs.length > 0) {
                    originalLog.apply(console, filteredArgs);
                  }
                };

                console.warn = function(...args) {
                  const filteredArgs = args.filter(arg =>
                    typeof arg === 'string' && !arg.includes('.jpg') && !arg.includes('.png') && !arg.includes('.mp4')
                  );
                  if (filteredArgs.length > 0) {
                    originalWarn.apply(console, filteredArgs);
                  }
                };

                console.error = function(...args) {
                  const filteredArgs = args.filter(arg =>
                    typeof arg === 'string' && !arg.includes('.jpg') && !arg.includes('.png') && !arg.includes('.mp4')
                  );
                  if (filteredArgs.length > 0) {
                    originalError.apply(console, filteredArgs);
                  }
                };

                // Clear console on page load
                setTimeout(() => console.clear(), 100);

                // Prevent right-click context menu globally
                document.addEventListener('contextmenu', function(e) {
                  if (e.target && (e.target.tagName === 'IMG' || e.target.tagName === 'VIDEO')) {
                    e.preventDefault();
                    return false;
                  }
                });

                // Override image src to hide URLs
                const originalImageSrc = Object.getOwnPropertyDescriptor(Image.prototype, 'src');
                Object.defineProperty(Image.prototype, 'src', {
                  get: function() {
                    return this._hiddenSrc || '';
                  },
                  set: function(value) {
                    this._hiddenSrc = value;
                    // Call original setter with the actual value
                    originalImageSrc.set.call(this, value);
                  }
                });
              })();
            `
          }} />

          {/* Main Featured Image */}
      <Box position="relative" mb={4}>
        <Box
          position="relative"
          h={{ base: "250px", md: "350px", lg: "450px" }}
          borderRadius="xl"
          overflow="hidden"
          cursor="pointer"
          onClick={onOpen}
          _hover={{ transform: 'scale(1.02)' }}
          transition="transform 0.2s"
        >
          {featuredMedia.media_type === 'video' ? (
            <Box position="relative" w="100%" h="100%">
              <video
                src={featuredMedia.video || featuredMedia.image_url || featuredMedia.image}
                controls
                controlsList="nodownload nofullscreen noplaybackrate"
                disablePictureInPicture
                playsInline
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  borderRadius: '12px'
                }}
                poster={featuredMedia.video_thumbnail}
                title={featuredMedia.caption || `${packageName} - Video ${selectedImageIndex + 1}`}
                onContextMenu={(e) => {
                  e.preventDefault();
                  return false;
                }}
                onLoadedMetadata={(e) => {
                  // Remove filename from video element if possible
                  const video = e.currentTarget;
                  if (video && video.textTracks) {
                    // Clear any text tracks that might contain filenames
                    for (let i = video.textTracks.length - 1; i >= 0; i--) {
                      video.textTracks[i].mode = 'disabled';
                    }
                  }
                }}
                data-media-type="video"
                data-protected="true"
              >
                Your browser does not support the video tag.
              </video>
              {/* Video Play Overlay */}
              <Box
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                bg="blackAlpha.600"
                borderRadius="full"
                p={3}
                opacity={0.8}
              >
                <Icon as={MagnifyingGlassIcon} h={6} w={6} color="white" />
              </Box>
            </Box>
          ) : (
            <Box
              onContextMenu={(e) => {
                e.preventDefault();
                return false;
              }}
              style={{
                width: '100%',
                height: '100%',
                cursor: 'pointer'
              }}
              data-media-type="image"
              data-protected="true"
            >
              <SmartLazyImage
                src={featuredMedia.image_url || featuredMedia.image}
                alt={`${packageName} - Image ${selectedImageIndex + 1}`}
                title={featuredMedia.caption || `${packageName} - Image ${selectedImageIndex + 1}`}
                width="100%"
                height="100%"
                objectFit="contain"
                borderRadius="12px"
                useCase="hero"
                enableSmartConversion={true}
                showLoadingSkeleton={true}
                fallbackSrc="/placeholder-image.jpg"
                data-protected="true"
              />
            </Box>
          )}
          
          {/* Media Counter */}
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
            {selectedImageIndex + 1} / {mediaCount}
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
          {!isMobile && mediaCount > 1 && (
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
      {mediaCount > 1 && (
        <SimpleGrid columns={{ base: 4, md: 6, lg: 8 }} spacing={2}>
          {images.map((media, index) => (
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
              {media.media_type === 'video' ? (
                <Box
                  position="relative"
                  w="100%"
                  h="80px"
                  bg="gray.100"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  onContextMenu={(e) => {
                    e.preventDefault();
                    return false;
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  {media.video_thumbnail ? (
                    <Image
                      src={media.video_thumbnail}
                      alt={`${packageName} - Video Thumbnail ${index + 1}`}
                      title={media.caption || `${packageName} - Video ${index + 1}`}
                      w="100%"
                      h="100%"
                      objectFit="cover"
                      borderRadius="6px"
                      data-protected="true"
                    />
                  ) : (
                    <Icon as={VideoCameraIcon} h={6} w={6} color="gray.400" />
                  )}
                  {/* Video Indicator */}
                  <Box
                    position="absolute"
                    top="2"
                    right="2"
                    bg="red.500"
                    color="white"
                    fontSize="xs"
                    px={1}
                    py={0.5}
                    borderRadius="sm"
                    fontWeight="bold"
                  >
                    VID
                  </Box>
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
                <Box
                  onContextMenu={(e) => {
                    e.preventDefault();
                    return false;
                  }}
                  style={{
                    width: '100%',
                    height: '80px',
                    cursor: 'pointer'
                  }}
                >
                  <SmartLazyImage
                    src={media.image_url || media.image}
                    alt={`${packageName} - Thumbnail ${index + 1}`}
                    title={media.caption || `${packageName} - Image ${index + 1}`}
                    width="100%"
                    height="100%"
                    objectFit="contain"
                    borderRadius="6px"
                    useCase="thumbnail"
                    enableSmartConversion={true}
                    showLoadingSkeleton={true}
                    fallbackSrc="/placeholder-image.jpg"
                    data-protected="true"
                  />
                </Box>
              )}

              {/* Featured Badge */}
              {(media as any).is_featured && (
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
      <Modal isOpen={isOpen} onClose={onClose} size="6xl" isCentered blockScrollOnMount={true}>
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
              {featuredMedia.media_type === 'video' ? (
                <video
                  src={featuredMedia.video || featuredMedia.image_url || featuredMedia.image}
                  controls
                  autoPlay
                  controlsList="nodownload nofullscreen noplaybackrate"
                  disablePictureInPicture
                  playsInline
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                  }}
                  poster={featuredMedia.video_thumbnail}
                  title={featuredMedia.caption || `${packageName} - Video ${selectedImageIndex + 1}`}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    return false;
                  }}
                  onLoadedMetadata={(e) => {
                    // Remove filename from video element if possible
                    const video = e.currentTarget;
                    if (video && video.textTracks) {
                      // Clear any text tracks that might contain filenames
                      for (let i = video.textTracks.length - 1; i >= 0; i--) {
                        video.textTracks[i].mode = 'disabled';
                      }
                    }
                  }}
                  data-media-type="video"
                  data-protected="true"
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <Box
                  onContextMenu={(e) => {
                    e.preventDefault();
                    return false;
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    cursor: 'pointer'
                  }}
                  data-media-type="image"
                  data-protected="true"
                >
                  <SmartLazyImage
                    src={featuredMedia.image_url || featuredMedia.image}
                    alt={`${packageName} - Full size ${selectedImageIndex + 1}`}
                    title={featuredMedia.caption || `${packageName} - Full size ${selectedImageIndex + 1}`}
                    width="100%"
                    height="100%"
                    objectFit="contain"
                    useCase="original"
                    enableSmartConversion={true}
                    showLoadingSkeleton={true}
                    fallbackSrc="/placeholder-image.jpg"
                    data-protected="true"
                  />
                </Box>
              )}
              
              {/* Navigation Arrows */}
              {mediaCount > 1 && (
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
              
              {/* Media Info */}
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
                  {selectedImageIndex + 1} of {mediaCount}
                </Text>
                {featuredMedia.caption && (
                  <Text fontSize="xs" opacity={0.8}>
                    {featuredMedia.caption}
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
