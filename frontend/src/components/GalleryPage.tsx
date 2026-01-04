import React, { useState, useMemo, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Icon,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  IconButton,
  HStack,
  VStack,
  Flex,
  useDisclosure,
  Image,
  Badge,
} from '@chakra-ui/react';
import {
  PhotoIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlayIcon,
  VideoCameraIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { LazyImage } from './LazyImage';
import { LoadingSpinner } from './LoadingSpinner';
import { config } from '../config';
import type { GalleryMedia } from '../types';

interface GalleryMediaItem {
  id: number;
  media_type: 'image' | 'video' | 'gif';
  file_url: string;
  thumbnail_url: string;
  title: string;
  caption: string;
  photographer?: string;
  location?: string;
  package?: { id: number; name: string } | null;
  resort?: { id: number; name: string } | null;
  boat?: { id: number; name: string } | null;
}

export function GalleryPage() {
  const navigate = useNavigate();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [galleryItems, setGalleryItems] = useState<GalleryMediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrollPositionRef = useRef<number>(0);
  const modalRootRef = useRef<HTMLDivElement | null>(null);

  // Create a dedicated portal container that's independent of body styles
  useEffect(() => {
    if (!modalRootRef.current) {
      const modalRoot = document.createElement('div');
      modalRoot.id = 'gallery-modal-root';
      // Container should not be fixed - it's just a portal target
      // The modal content inside will be fixed relative to viewport
      document.documentElement.appendChild(modalRoot);
      modalRootRef.current = modalRoot;
    }
    return () => {
      if (modalRootRef.current && modalRootRef.current.parentNode) {
        modalRootRef.current.parentNode.removeChild(modalRootRef.current);
        modalRootRef.current = null;
      }
    };
  }, []);

  // Color scheme - minimal, elegant palette
  const bgColor = useColorModeValue('white', 'gray.900');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Lock body scroll when modal is open - preserve scroll position visually
  useEffect(() => {
    if (isOpen) {
      // Save scroll position before locking
      const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
      scrollPositionRef.current = scrollY;
      
      // Use position fixed on body to prevent scroll, but apply it in a way that doesn't interfere
      // with the modal's viewport positioning
      const body = document.body;
      const html = document.documentElement;
      
      // Store original styles
      const originalBodyOverflow = body.style.overflow;
      const originalBodyPosition = body.style.position;
      const originalBodyTop = body.style.top;
      const originalBodyWidth = body.style.width;
      const originalHtmlOverflow = html.style.overflow;
      
      // Apply scroll lock
      body.style.overflow = 'hidden';
      body.style.position = 'fixed';
      body.style.top = `-${scrollY}px`;
      body.style.width = '100%';
      html.style.overflow = 'hidden';
      
      // Cleanup function
      return () => {
        body.style.overflow = originalBodyOverflow;
        body.style.position = originalBodyPosition;
        body.style.top = originalBodyTop;
        body.style.width = originalBodyWidth;
        html.style.overflow = originalHtmlOverflow;
        
        // Restore scroll position
        requestAnimationFrame(() => {
          window.scrollTo(0, scrollPositionRef.current);
        });
      };
    }
  }, [isOpen]);

  // Fetch gallery media
  useEffect(() => {
    const fetchGalleryMedia = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${config.apiBaseUrl}/gallery-media/`);
        if (!response.ok) {
          throw new Error('Failed to fetch gallery media');
        }
        const data = await response.json();
        // Handle paginated or non-paginated response
        const items = Array.isArray(data) ? data : (data.results || []);
        setGalleryItems(items);
      } catch (err) {
        console.error('Error fetching gallery media:', err);
        setError(err instanceof Error ? err.message : 'Failed to load gallery');
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryMedia();
  }, []);

  // Handle image click
  const handleImageClick = (index: number) => {
    // Capture scroll position BEFORE opening modal to ensure modal centers correctly
    scrollPositionRef.current = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
    setSelectedImageIndex(index);
    onOpen();
  };

  // Handle navigation
  const handlePrevious = () => {
    setSelectedImageIndex(prev => 
      prev === 0 ? galleryItems.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setSelectedImageIndex(prev => 
      prev === galleryItems.length - 1 ? 0 : prev + 1
    );
  };

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedImageIndex, galleryItems.length]);

  // Reset video when modal opens/closes
  useEffect(() => {
    if (!isOpen && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isOpen]);

  const selectedItem = galleryItems[selectedImageIndex];

  // Create masonry layout with varying sizes for visual interest (art gallery style)
  const masonryItems = useMemo(() => {
    return galleryItems.map((item, index) => {
      // Create varying sizes for visual interest - larger, more captivating
      const sizePattern = index % 8;
      let height = '450px';
      
      // Vary heights to create dynamic masonry layout - make them larger
      if (sizePattern === 0 || sizePattern === 4) {
        height = '600px'; // Extra tall
      } else if (sizePattern === 1 || sizePattern === 5) {
        height = '500px'; // Tall
      } else if (sizePattern === 2 || sizePattern === 6) {
        height = '550px'; // Medium-tall
      } else {
        height = '480px'; // Standard tall
      }
      
      return { ...item, height };
    });
  }, [galleryItems]);

  if (loading) {
    return (
      <Box minH="100vh" bg={bgColor} py={20}>
        <Container maxW="7xl">
          <Flex justify="center" align="center" minH="60vh">
            <LoadingSpinner size="xl" />
          </Flex>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box minH="100vh" bg={bgColor} py={20}>
        <Container maxW="7xl">
          <VStack spacing={4} align="center" justify="center" minH="60vh">
            <Text fontSize="xl" color="red.500">{error}</Text>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </VStack>
        </Container>
      </Box>
    );
  }

  return (
    <>
      <Helmet>
        <title>Gallery - Thread Travels & Tours | Maldives Paradise</title>
        <meta 
          name="description" 
          content="Explore our stunning gallery showcasing the beauty of the Maldives through photography, videos, and immersive visual experiences." 
        />
        <meta property="og:title" content="Gallery - Thread Travels & Tours" />
        <meta property="og:description" content="Explore our stunning gallery showcasing the beauty of the Maldives." />
        <meta property="og:type" content="website" />
      </Helmet>

      <Box minH="100vh" bg={bgColor}>
        {/* Minimal Header */}
        <Box py={16} borderBottom="1px" borderColor={borderColor}>
          <Container maxW="7xl">
            <VStack spacing={4} textAlign="center">
              <Heading
                as="h1"
                size={{ base: '2xl', md: '4xl' }}
                fontWeight="200"
                letterSpacing="wider"
                color={textColor}
                fontFamily="'Playfair Display', serif"
              >
                Gallery
              </Heading>
              <Text fontSize="lg" color={mutedColor} maxW="2xl" fontWeight="300">
                A visual journey through the Maldives
              </Text>
            </VStack>
          </Container>
        </Box>

        {/* Art Gallery Style Masonry Layout */}
        <Container maxW="full" px={{ base: 4, md: 8, lg: 12 }} py={12}>
          {galleryItems.length === 0 ? (
            <Box textAlign="center" py={20}>
              <Icon as={PhotoIcon} w={16} h={16} color="gray.400" mb={4} />
              <Text fontSize="lg" color="gray.500">
                No media available yet
              </Text>
            </Box>
          ) : (
            <Box
              display="grid"
              gridTemplateColumns={{
                base: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(3, 1fr)',
                xl: 'repeat(4, 1fr)',
              }}
              gap={{ base: 2, md: 3, lg: 4 }}
              columnGap={{ base: 2, md: 3, lg: 4 }}
            >
              {masonryItems.map((item, index) => (
                <Box
                  key={item.id}
                  position="relative"
                  cursor="pointer"
                  onClick={() => handleImageClick(index)}
                  borderRadius="none"
                  overflow="hidden"
                  bg="gray.50"
                  h={item.height}
                  minH={item.height}
                  transition="all 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
                  _hover={{
                    transform: 'scale(1.03)',
                    zIndex: 10,
                    boxShadow: 'xl',
                  }}
                  style={{
                    gridRow: 'span 1',
                  }}
                >
                  {item.media_type === 'video' ? (
                    <Box position="relative" w="100%" h="100%" bg="gray.900">
                      {/* Video thumbnail using video element */}
                      <video
                        src={item.file_url}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                        muted
                        playsInline
                        preload="metadata"
                        onLoadedMetadata={(e) => {
                          // Seek to first frame for thumbnail
                          const video = e.currentTarget;
                          if (video.readyState >= 2) {
                            video.currentTime = 0.1;
                          }
                        }}
                        onError={(e) => {
                          // Fallback if video fails to load
                          console.warn('Video thumbnail failed to load:', item.file_url);
                        }}
                      />
                      <Box
                        position="absolute"
                        top="50%"
                        left="50%"
                        transform="translate(-50%, -50%)"
                        bg="blackAlpha.700"
                        borderRadius="full"
                        p={4}
                        transition="all 0.3s ease"
                        _hover={{ bg: 'blackAlpha.800', transform: 'translate(-50%, -50%) scale(1.1)' }}
                        pointerEvents="none"
                        zIndex={2}
                      >
                        <Icon as={PlayIcon} w={10} h={10} color="white" />
                      </Box>
                      <Badge
                        position="absolute"
                        top={3}
                        right={3}
                        bg="blackAlpha.800"
                        color="white"
                        borderRadius="sm"
                        px={2}
                        py={1}
                        fontSize="xs"
                        fontWeight="normal"
                        zIndex={2}
                      >
                        <Icon as={VideoCameraIcon} w={3} h={3} display="inline" mr={1} />
                        Video
                      </Badge>
                    </Box>
                  ) : item.media_type === 'gif' ? (
                    <Image
                      src={item.file_url}
                      alt={item.title || item.caption}
                      objectFit="cover"
                      w="100%"
                      h="100%"
                      loading="lazy"
                    />
                  ) : (
                    <LazyImage
                      src={item.file_url}
                      alt={item.title || item.caption}
                      objectFit="cover"
                      style={{ width: '100%', height: '100%' }}
                    />
                  )}
                </Box>
              ))}
            </Box>
          )}
        </Container>
      </Box>

      {/* Lightbox Modal - Full Screen Art Gallery Style */}
      {isOpen && modalRootRef.current && createPortal(
        <Box
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          width="100vw"
          height="100vh"
          zIndex={9999}
          bg="rgba(0, 0, 0, 0.95)"
          backdropFilter="blur(10px)"
          onClick={onClose}
          overflow="hidden"
          display="flex"
          alignItems="center"
          justifyContent="center"
          padding="20px"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            margin: 0,
            pointerEvents: 'auto',
          }}
        >
          <Box
            position="relative"
            maxW="95vw"
            maxH="90vh"
            w="auto"
            h="auto"
            onClick={(e) => e.stopPropagation()}
            display="flex"
            alignItems="center"
            justifyContent="center"
            margin="auto"
            style={{
              maxHeight: '90vh',
              maxWidth: '95vw',
            }}
          >
            <IconButton
              aria-label="Close"
              icon={<Icon as={XMarkIcon} w={6} h={6} />}
              position="absolute"
              top={-10}
              right={-10}
              bg="whiteAlpha.100"
              color="white"
              _hover={{ bg: 'whiteAlpha.200' }}
              size="lg"
              borderRadius="full"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              zIndex={10}
              backdropFilter="blur(10px)"
            />
            {selectedItem && (
              <Box
                position="relative"
                w="100%"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                {/* Navigation Buttons */}
                {galleryItems.length > 1 && (
                  <>
                    <IconButton
                      aria-label="Previous"
                      icon={<Icon as={ChevronLeftIcon} w={8} h={8} />}
                      position="absolute"
                      left={-16}
                      top="50%"
                      transform="translateY(-50%)"
                      bg="whiteAlpha.100"
                      color="white"
                      _hover={{ bg: 'whiteAlpha.200' }}
                      size="lg"
                      borderRadius="full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrevious();
                      }}
                      zIndex={10}
                      backdropFilter="blur(10px)"
                    />
                    <IconButton
                      aria-label="Next"
                      icon={<Icon as={ChevronRightIcon} w={8} h={8} />}
                      position="absolute"
                      right={-16}
                      top="50%"
                      transform="translateY(-50%)"
                      bg="whiteAlpha.100"
                      color="white"
                      _hover={{ bg: 'whiteAlpha.200' }}
                      size="lg"
                      borderRadius="full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNext();
                      }}
                      zIndex={10}
                      backdropFilter="blur(10px)"
                    />
                  </>
                )}

                {/* Media Display */}
                <Box
                  position="relative"
                  w="100%"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  {selectedItem.media_type === 'video' ? (
                    <Box w="100%" maxW="1400px" h="auto">
                      <video
                        ref={videoRef}
                        src={selectedItem.file_url}
                        controls
                        autoPlay
                        style={{
                          width: '100%',
                          maxHeight: '90vh',
                          borderRadius: '4px',
                          display: 'block',
                        }}
                      />
                    </Box>
                  ) : (
                    <Image
                      src={selectedItem.file_url}
                      alt={selectedItem.title || selectedItem.caption}
                      maxW="95vw"
                      maxH="90vh"
                      w="auto"
                      h="auto"
                      objectFit="contain"
                      borderRadius="none"
                      display="block"
                    />
                  )}

                  {/* Minimal Info Overlay - Only on hover */}
                  <Box
                    position="absolute"
                    bottom={0}
                    left={0}
                    right={0}
                    bgGradient="linear(to-t, blackAlpha.900, transparent)"
                    p={6}
                    opacity={0}
                    _hover={{ opacity: 1 }}
                    transition="opacity 0.3s ease"
                    pointerEvents="none"
                  >
                    <VStack align="start" spacing={2} color="white">
                      {selectedItem.title && (
                        <Text fontSize="xl" fontWeight="300" letterSpacing="wide">
                          {selectedItem.title}
                        </Text>
                      )}
                      <HStack spacing={4} fontSize="sm" opacity={0.8} fontWeight="300">
                        {selectedItem.photographer && (
                          <Text>{selectedItem.photographer}</Text>
                        )}
                        {selectedItem.location && (
                          <Text>📍 {selectedItem.location}</Text>
                        )}
                        <Text>
                          {selectedImageIndex + 1} / {galleryItems.length}
                        </Text>
                      </HStack>
                      {(selectedItem.package || selectedItem.resort || selectedItem.boat) && (
                        <HStack spacing={3} mt={3} pointerEvents="auto">
                          {selectedItem.package && (
                            <Button
                              size="sm"
                              variant="ghost"
                              color="white"
                              _hover={{ bg: 'whiteAlpha.200' }}
                              onClick={() => {
                                onClose();
                                navigate(`/packages/${selectedItem.package!.id}`);
                              }}
                              fontWeight="300"
                            >
                              View Package
                            </Button>
                          )}
                          {selectedItem.resort && (
                            <Button
                              size="sm"
                              variant="ghost"
                              color="white"
                              _hover={{ bg: 'whiteAlpha.200' }}
                              onClick={() => {
                                onClose();
                                navigate(`/resorts/${selectedItem.resort!.id}`);
                              }}
                              fontWeight="300"
                            >
                              View Resort
                            </Button>
                          )}
                          {selectedItem.boat && (
                            <Button
                              size="sm"
                              variant="ghost"
                              color="white"
                              _hover={{ bg: 'whiteAlpha.200' }}
                              onClick={() => {
                                onClose();
                                navigate(`/boats/${selectedItem.boat!.id}`);
                              }}
                              fontWeight="300"
                            >
                              View Boat
                            </Button>
                          )}
                        </HStack>
                      )}
                    </VStack>
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
        </Box>,
        modalRootRef.current
      )}
    </>
  );
}
