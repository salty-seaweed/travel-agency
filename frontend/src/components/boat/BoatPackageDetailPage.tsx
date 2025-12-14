import React, { useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  SimpleGrid,
  VStack,
  HStack,
  Badge,
  Divider,
  Icon,
  useColorModeValue,
  Flex,
  List,
  ListItem,
  ListIcon,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import {
  CheckCircleIcon,
  ClockIcon,
  UserGroupIcon,
  ArrowLeftIcon,
  SparklesIcon,
  BoltIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PhotoIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';
import { useBoatPackage } from '../../hooks/useBoats';
import { LoadingSpinner } from '../LoadingSpinner';
import { SEO } from '../SEO';
import { LazyImage } from '../LazyImage';

export function BoatPackageDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { boatPackage, loading, error } = useBoatPackage(Number(id));
  
  // Gallery state
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.900', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');
  const accentColor = useColorModeValue('blue.600', 'blue.400');

  // Get gallery images
  const galleryImages = boatPackage?.gallery_images || [];
  const hasGallery = galleryImages.length > 0;

  const handlePrevious = useCallback(() => {
    setSelectedIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  }, [galleryImages.length]);

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  }, [galleryImages.length]);

  const openGalleryAt = useCallback((index: number) => {
    setSelectedIndex(index);
    onOpen();
  }, [onOpen]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') handlePrevious();
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'Escape') onClose();
  }, [handlePrevious, handleNext, onClose]);

  if (loading) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <LoadingSpinner />
      </Box>
    );
  }

  if (error || !boatPackage) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg={bgColor}>
        <VStack spacing={6} textAlign="center" p={8}>
          <Heading size="xl" color={textColor}>Package Not Found</Heading>
          <Text color={mutedColor}>{error || 'The package you are looking for does not exist.'}</Text>
          <Link to="/boats?tab=packages">
            <Button colorScheme="blue" leftIcon={<Icon as={ArrowLeftIcon} />}>
              Back to Packages
            </Button>
          </Link>
        </VStack>
      </Box>
    );
  }

  const hasDiscount = boatPackage.discount_percentage > 0;
  const displayPrice = hasDiscount ? boatPackage.discounted_price : boatPackage.price;
  const currentImage = hasGallery ? galleryImages[selectedIndex] : (boatPackage.hero_image_url || boatPackage.hero_image);

  const tierColors: Record<string, string> = {
    silver: 'gray',
    gold: 'yellow',
    platinum: 'purple',
    custom: 'blue',
  };

  // Get images for the grid (max 5 for display)
  const gridImages = hasGallery ? galleryImages.slice(0, 5) : [];
  const remainingCount = hasGallery ? Math.max(0, galleryImages.length - 5) : 0;

  return (
    <>
      <SEO
        title={`${boatPackage.name} - Boat Charter Package`}
        description={boatPackage.description}
        keywords={`${boatPackage.name}, boat package, Maldives fishing charter`}
      />

      <Box minH="100vh" bg={bgColor}>
        {/* Header */}
        <Box bg={cardBg} borderBottom="1px" borderColor={borderColor} py={4}>
          <Container maxW="7xl">
            <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
              <HStack spacing={4}>
                <Link to="/boats?tab=packages">
                  <Button
                    variant="ghost"
                    leftIcon={<Icon as={ArrowLeftIcon} boxSize={4} />}
                    size="sm"
                    color={mutedColor}
                    _hover={{ color: textColor }}
                  >
                    Back
                  </Button>
                </Link>
                <Box>
                  <HStack spacing={2} mb={1}>
                    <Badge
                      colorScheme={tierColors[boatPackage.package_tier]}
                      fontSize="xs"
                      px={2}
                      py={0.5}
                      borderRadius="md"
                      textTransform="uppercase"
                    >
                      {boatPackage.package_tier} Package
                    </Badge>
                    {boatPackage.is_featured && (
                      <Badge colorScheme="orange" fontSize="xs" px={2} py={0.5} borderRadius="md">
                        Best Value
                      </Badge>
                    )}
                    {hasDiscount && (
                      <Badge colorScheme="red" fontSize="xs" px={2} py={0.5} borderRadius="md">
                        {boatPackage.discount_percentage}% OFF
                      </Badge>
                    )}
                  </HStack>
                  <Heading size="md" color={textColor}>{boatPackage.name}</Heading>
                </Box>
              </HStack>
              <HStack spacing={3}>
                <VStack align="flex-end" spacing={0}>
                  <HStack spacing={1}>
                    <Text fontSize="xl" fontWeight="bold" color={accentColor}>
                      Contact for Price
                    </Text>
                  </HStack>
                </VStack>
              </HStack>
            </Flex>
          </Container>
        </Box>

        {/* Image Gallery Grid */}
        <Container maxW="7xl" py={6}>
          {hasGallery && gridImages.length > 0 ? (
            <Box position="relative" borderRadius="xl" overflow="hidden">
              <Grid
                templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }}
                templateRows={{ base: 'repeat(2, 200px)', md: 'repeat(2, 180px)' }}
                gap={2}
              >
                {/* Main large image */}
                <GridItem
                  colSpan={{ base: 1, md: 2 }}
                  rowSpan={2}
                  position="relative"
                  cursor="pointer"
                  onClick={() => openGalleryAt(0)}
                  _hover={{ '& img': { transform: 'scale(1.02)' } }}
                  overflow="hidden"
                  borderRadius={{ base: 'xl', md: 'none' }}
                  borderLeftRadius={{ md: 'xl' }}
                >
                  <Box overflow="hidden" h="100%">
                    <LazyImage
                      src={gridImages[0]}
                      alt={`${boatPackage.name} - Main`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease',
                      }}
                    />
                  </Box>
                </GridItem>

                {/* Smaller images */}
                {gridImages.slice(1, 5).map((image, index) => (
                  <GridItem
                    key={index}
                    position="relative"
                    cursor="pointer"
                    onClick={() => openGalleryAt(index + 1)}
                    _hover={{ '& img': { transform: 'scale(1.05)' } }}
                    overflow="hidden"
                    display={{ base: index < 2 ? 'block' : 'none', md: 'block' }}
                    borderTopRightRadius={index === 1 ? { md: 'xl' } : undefined}
                    borderBottomRightRadius={index === 3 ? { md: 'xl' } : undefined}
                  >
                    <Box overflow="hidden" h="100%">
                      <LazyImage
                        src={image}
                        alt={`${boatPackage.name} - ${index + 2}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.3s ease',
                        }}
                      />
                    </Box>
                    {/* Show remaining count on last visible image */}
                    {index === 3 && remainingCount > 0 && (
                      <Box
                        position="absolute"
                        inset={0}
                        bg="blackAlpha.500"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        _hover={{ bg: 'blackAlpha.600' }}
                        transition="background 0.2s"
                      >
                        <VStack spacing={1}>
                          <Icon as={Squares2X2Icon} boxSize={6} color="white" />
                          <Text color="white" fontWeight="semibold" fontSize="sm">
                            +{remainingCount} more
                          </Text>
                        </VStack>
                      </Box>
                    )}
                  </GridItem>
                ))}
              </Grid>

              {/* Show all photos button */}
              <Button
                position="absolute"
                bottom={4}
                right={4}
                size="sm"
                bg="white"
                color="gray.800"
                leftIcon={<Icon as={Squares2X2Icon} boxSize={4} />}
                onClick={() => openGalleryAt(0)}
                _hover={{ bg: 'gray.100' }}
                shadow="md"
              >
                Show all photos
              </Button>
            </Box>
          ) : (
            // Fallback if no gallery
            <Box
              h="400px"
              borderRadius="xl"
              overflow="hidden"
              bg="gray.200"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              {boatPackage.hero_image_url || boatPackage.hero_image ? (
                <LazyImage
                  src={boatPackage.hero_image_url || boatPackage.hero_image || ''}
                  alt={boatPackage.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <VStack spacing={2} color="gray.400">
                  <Icon as={PhotoIcon} boxSize={16} />
                  <Text>No images available</Text>
                </VStack>
              )}
            </Box>
          )}
        </Container>

        {/* Content */}
        <Container maxW="7xl" pb={12}>
          <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={8}>
            {/* Main Content */}
            <VStack align="stretch" spacing={6} gridColumn={{ base: '1', lg: '1 / 3' }}>
              {/* Description */}
              <Box>
                <Text fontSize="lg" color={mutedColor} lineHeight="tall">
                  {boatPackage.description}
                </Text>
              </Box>

              <Divider />

              {/* Quick Info */}
              <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={6}>
                <HStack spacing={3}>
                  <Box p={3} bg={useColorModeValue('blue.50', 'blue.900')} borderRadius="lg">
                    <Icon as={ClockIcon} boxSize={6} color={accentColor} />
                  </Box>
                  <VStack align="flex-start" spacing={0}>
                    <Text fontSize="sm" color={mutedColor}>Duration</Text>
                    <Text fontWeight="semibold" color={textColor}>
                      {boatPackage.duration_description}
                    </Text>
                  </VStack>
                </HStack>
                {boatPackage.max_participants && (
                  <HStack spacing={3}>
                    <Box p={3} bg={useColorModeValue('green.50', 'green.900')} borderRadius="lg">
                      <Icon as={UserGroupIcon} boxSize={6} color="green.500" />
                    </Box>
                    <VStack align="flex-start" spacing={0}>
                      <Text fontSize="sm" color={mutedColor}>Capacity</Text>
                      <Text fontWeight="semibold" color={textColor}>
                        Up to {boatPackage.max_participants} guests
                      </Text>
                    </VStack>
                  </HStack>
                )}
                <HStack spacing={3}>
                  <Box p={3} bg={useColorModeValue('orange.50', 'orange.900')} borderRadius="lg">
                    <Icon as={BoltIcon} boxSize={6} color="orange.500" />
                  </Box>
                  <VStack align="flex-start" spacing={0}>
                    <Text fontSize="sm" color={mutedColor}>Booking</Text>
                    <Text fontWeight="semibold" color={textColor}>
                      {boatPackage.booking_notice_description}
                    </Text>
                  </VStack>
                </HStack>
              </SimpleGrid>

              <Divider />

              {/* Detailed Description */}
              {boatPackage.detailed_description && (
                <Box>
                  <Heading size="md" mb={4} color={textColor}>About This Package</Heading>
                  <Text color={mutedColor} whiteSpace="pre-line" lineHeight="tall">
                    {boatPackage.detailed_description}
                  </Text>
                </Box>
              )}

              {/* What's Included */}
              {boatPackage.includes && boatPackage.includes.length > 0 && (
                <Box>
                  <Heading size="md" mb={4} color={textColor}>What's Included</Heading>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                    {boatPackage.includes.map((item, index) => (
                      <HStack key={index} align="flex-start" spacing={3}>
                        <Icon as={CheckCircleIcon} color="green.500" boxSize={5} mt={0.5} flexShrink={0} />
                        <Text color={mutedColor}>{item}</Text>
                      </HStack>
                    ))}
                  </SimpleGrid>
                </Box>
              )}

              {/* Special Offers */}
              {boatPackage.special_offers && boatPackage.special_offers.length > 0 && (
                <Box
                  p={6}
                  bgGradient="linear(to-r, orange.50, yellow.50)"
                  _dark={{ bgGradient: 'linear(to-r, orange.900, yellow.900)' }}
                  borderRadius="xl"
                  border="1px"
                  borderColor="orange.200"
                  _dark2={{ borderColor: 'orange.700' }}
                >
                  <HStack mb={4}>
                    <Text fontSize="xl">🎉</Text>
                    <Heading size="md" color="orange.700" _dark={{ color: 'orange.200' }}>
                      Special Offers
                    </Heading>
                  </HStack>
                  <VStack align="stretch" spacing={2}>
                    {boatPackage.special_offers.map((offer, index) => (
                      <HStack key={index} align="flex-start" spacing={3}>
                        <Icon as={SparklesIcon} color="orange.500" boxSize={5} mt={0.5} />
                        <Text color="orange.800" _dark={{ color: 'orange.200' }}>{offer}</Text>
                      </HStack>
                    ))}
                  </VStack>
                </Box>
              )}

              {/* The Boat */}
              {boatPackage.boat_details && (
                <Box>
                  <Heading size="md" mb={4} color={textColor}>Your Boat</Heading>
                  <Link to={`/boats/${boatPackage.boat_details.id}`}>
                    <Flex
                      p={4}
                      bg={cardBg}
                      border="1px"
                      borderColor={borderColor}
                      borderRadius="xl"
                      _hover={{
                        borderColor: accentColor,
                        shadow: 'md',
                        transform: 'translateY(-2px)',
                      }}
                      transition="all 0.2s"
                      gap={4}
                      direction={{ base: 'column', sm: 'row' }}
                    >
                      {boatPackage.boat_details.hero_image_url && (
                        <Box
                          w={{ base: '100%', sm: '160px' }}
                          h={{ base: '150px', sm: '120px' }}
                          flexShrink={0}
                          borderRadius="lg"
                          overflow="hidden"
                        >
                          <LazyImage
                            src={boatPackage.boat_details.hero_image_url}
                            alt={boatPackage.boat_details.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </Box>
                      )}
                      <VStack align="flex-start" spacing={2} flex={1}>
                        <Heading size="sm" color={textColor}>
                          {boatPackage.boat_details.name}
                        </Heading>
                        <Text color={mutedColor} fontSize="sm" noOfLines={2}>
                          {boatPackage.boat_details.description}
                        </Text>
                        <HStack spacing={3} fontSize="sm" color={mutedColor} flexWrap="wrap">
                          <Badge colorScheme="blue" variant="subtle">{boatPackage.boat_details.length_feet} ft</Badge>
                          <Badge colorScheme="gray" variant="subtle">{boatPackage.boat_details.engine_details}</Badge>
                          <Badge colorScheme="green" variant="subtle">{boatPackage.boat_details.passenger_capacity} guests</Badge>
                        </HStack>
                      </VStack>
                    </Flex>
                  </Link>
                </Box>
              )}

              {/* Activities Included */}
              {boatPackage.activities_included_details && boatPackage.activities_included_details.length > 0 && (
                <Box>
                  <Heading size="md" mb={4} color={textColor}>Activities Included</Heading>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    {boatPackage.activities_included_details.map((activity) => (
                      <Link key={activity.id} to={`/boats/activities/${activity.id}`}>
                        <Flex
                          p={4}
                          bg={cardBg}
                          border="1px"
                          borderColor={borderColor}
                          borderRadius="xl"
                          _hover={{
                            borderColor: accentColor,
                            shadow: 'md',
                            transform: 'translateY(-2px)',
                          }}
                          transition="all 0.2s"
                          gap={3}
                        >
                          {activity.hero_image_url && (
                            <Box
                              w="70px"
                              h="70px"
                              flexShrink={0}
                              borderRadius="lg"
                              overflow="hidden"
                            >
                              <LazyImage
                                src={activity.hero_image_url}
                                alt={activity.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            </Box>
                          )}
                          <VStack align="flex-start" spacing={1} flex={1}>
                            <Text fontWeight="semibold" color={textColor} fontSize="sm">
                              {activity.name}
                            </Text>
                            <Text fontSize="xs" color={mutedColor} noOfLines={2}>
                              {activity.description}
                            </Text>
                          </VStack>
                        </Flex>
                      </Link>
                    ))}
                  </SimpleGrid>
                </Box>
              )}

              {/* Additional Notes */}
              {boatPackage.additional_notes && (
                <Box>
                  <Heading size="md" mb={4} color={textColor}>Important Information</Heading>
                  <Text color={mutedColor} whiteSpace="pre-line">
                    {boatPackage.additional_notes}
                  </Text>
                </Box>
              )}
            </VStack>

            {/* Sidebar */}
            <VStack align="stretch" spacing={6}>
              {/* Booking Card */}
              <Box
                bg={cardBg}
                p={6}
                borderRadius="xl"
                shadow="lg"
                border="1px"
                borderColor={borderColor}
                position={{ base: 'relative', lg: 'sticky' }}
                top={{ base: 'auto', lg: '100px' }}
              >
                <VStack align="stretch" spacing={5}>
                  <VStack align="flex-start" spacing={1}>
                    <Heading size="lg" color={textColor}>
                      Contact for Price
                    </Heading>
                    <Text fontSize="sm" color={mutedColor}>per charter</Text>
                  </VStack>

                  <Divider />

                  <Text fontSize="sm" color={mutedColor}>
                    Contact us for flexible pricing. The more days you book, the better the price!
                  </Text>

                  <Button
                    as="a"
                    href={`https://wa.me/9607441097?text=${encodeURIComponent(
                      `Hi! I'm interested in the ${boatPackage.name}. Can you provide more details?`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    bg="#25D366"
                    color="white"
                    size="lg"
                    w="full"
                    _hover={{
                      bg: '#20BA5A',
                      transform: 'translateY(-2px)',
                      shadow: 'lg',
                    }}
                    leftIcon={
                      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    }
                  >
                    Book via WhatsApp
                  </Button>

                  <Text fontSize="xs" color={mutedColor} textAlign="center">
                    💡 {boatPackage.booking_notice_description}
                  </Text>
                </VStack>
              </Box>

              {/* Highlights */}
              {boatPackage.featured_highlights && boatPackage.featured_highlights.length > 0 && (
                <Box bg={cardBg} p={6} borderRadius="xl" border="1px" borderColor={borderColor}>
                  <Heading size="sm" mb={4} color={textColor}>
                    ✨ Package Highlights
                  </Heading>
                  <VStack align="stretch" spacing={3}>
                    {boatPackage.featured_highlights.map((highlight, index) => (
                      <HStack key={index} align="flex-start" spacing={3}>
                        <Box w={2} h={2} bg="yellow.400" borderRadius="full" mt={2} flexShrink={0} />
                        <Text fontSize="sm" color={mutedColor}>
                          {highlight}
                        </Text>
                      </HStack>
                    ))}
                  </VStack>
                </Box>
              )}
            </VStack>
          </SimpleGrid>
        </Container>

        {/* Lightbox Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="full" isCentered>
          <ModalOverlay bg="blackAlpha.900" />
          <ModalContent bg="transparent" boxShadow="none" m={0}>
            <ModalCloseButton
              color="white"
              bg="whiteAlpha.200"
              borderRadius="full"
              _hover={{ bg: 'whiteAlpha.300' }}
              size="lg"
              top={4}
              right={4}
              zIndex={10}
            />
            <ModalBody 
              p={0} 
              display="flex" 
              alignItems="center" 
              justifyContent="center"
              onKeyDown={handleKeyDown}
              tabIndex={0}
              h="100vh"
            >
              <Box position="relative" w="full" h="full" display="flex" alignItems="center" justifyContent="center">
                {/* Main Image */}
                <Box maxW="90vw" maxH="80vh">
                  <LazyImage
                    src={currentImage || ''}
                    alt={`${boatPackage.name} - ${selectedIndex + 1}`}
                    style={{
                      maxWidth: '90vw',
                      maxHeight: '80vh',
                      objectFit: 'contain',
                    }}
                  />
                </Box>

                {/* Navigation */}
                {hasGallery && galleryImages.length > 1 && (
                  <>
                    <IconButton
                      aria-label="Previous"
                      icon={<Icon as={ChevronLeftIcon} boxSize={8} />}
                      position="fixed"
                      left={4}
                      top="50%"
                      transform="translateY(-50%)"
                      onClick={handlePrevious}
                      bg="whiteAlpha.200"
                      color="white"
                      _hover={{ bg: 'whiteAlpha.300' }}
                      size="lg"
                      borderRadius="full"
                    />
                    <IconButton
                      aria-label="Next"
                      icon={<Icon as={ChevronRightIcon} boxSize={8} />}
                      position="fixed"
                      right={4}
                      top="50%"
                      transform="translateY(-50%)"
                      onClick={handleNext}
                      bg="whiteAlpha.200"
                      color="white"
                      _hover={{ bg: 'whiteAlpha.300' }}
                      size="lg"
                      borderRadius="full"
                    />
                  </>
                )}

                {/* Counter */}
                <Box
                  position="fixed"
                  bottom={6}
                  left="50%"
                  transform="translateX(-50%)"
                  bg="blackAlpha.700"
                  color="white"
                  px={4}
                  py={2}
                  borderRadius="full"
                  fontSize="sm"
                >
                  {selectedIndex + 1} / {galleryImages.length}
                </Box>

                {/* Thumbnails */}
                {hasGallery && galleryImages.length > 1 && (
                  <HStack
                    position="fixed"
                    bottom={16}
                    left="50%"
                    transform="translateX(-50%)"
                    spacing={2}
                    maxW="90vw"
                    overflowX="auto"
                    p={2}
                    bg="blackAlpha.500"
                    borderRadius="lg"
                  >
                    {galleryImages.map((image, index) => (
                      <Box
                        key={index}
                        w="50px"
                        h="50px"
                        flexShrink={0}
                        cursor="pointer"
                        borderRadius="md"
                        overflow="hidden"
                        border="2px solid"
                        borderColor={selectedIndex === index ? 'white' : 'transparent'}
                        opacity={selectedIndex === index ? 1 : 0.6}
                        _hover={{ opacity: 1 }}
                        transition="all 0.2s"
                        onClick={() => setSelectedIndex(index)}
                      >
                        <LazyImage
                          src={image}
                          alt={`Thumb ${index + 1}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </Box>
                    ))}
                  </HStack>
                )}
              </Box>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    </>
  );
}
