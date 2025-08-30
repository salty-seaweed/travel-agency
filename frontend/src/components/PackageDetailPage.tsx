import { useState, useEffect } from 'react';
import {
  Container,
  VStack,
  HStack,
  Grid,
  GridItem,
  Center,
  Text,
  Button,
  useToast,
  Box,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useDisclosure,
  Heading,
  Divider,
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { SEO } from './SEO';
import { ErrorBoundary } from './ErrorBoundary';
import { LoadingSpinner } from './LoadingSpinner';
import { PackageHeader } from './package/PackageHeader';
import { PackageImageGallery } from './package/PackageImageGallery';
import { PackageItinerary } from './package/PackageItinerary';
import { PackageDestinations } from './package/PackageDestinations';
import { GoogleMap } from './package/GoogleMap';
import { PackageActivities } from './package/PackageActivities';
import { PackageInclusions } from './package/PackageInclusions';
import { PackageSidebar } from './package/PackageSidebar';
import { StickyBookingBar } from './package/StickyBookingBar';
import { BookingChoiceModal } from './BookingChoiceModal';
import { PackageBookingForm } from './PackageBookingForm';
import type { Package } from '../types';

export function PackageDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);

  const { data: packages, isLoading, error } = useFetch<Package>('/packages/');
  const packageData = packages?.find(pkg => pkg.id === parseInt(id || '0'));

  useEffect(() => {
    if (packageData) {
      // Set page title for SEO
      document.title = `${packageData.name} - Travel Agency`;
    }
  }, [packageData]);

  const handleBookNow = () => {
    onOpen();
  };

  const handleAddToWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted ? 'Removed from wishlist' : 'Added to wishlist',
      description: isWishlisted 
        ? 'Package removed from your wishlist' 
        : 'Package added to your wishlist',
      status: 'success',
      duration: 2000,
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: packageData?.name || 'Travel Package',
        text: packageData?.description || 'Check out this amazing travel package!',
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link copied',
        description: 'Package link copied to clipboard',
        status: 'success',
        duration: 2000,
      });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Container maxW="7xl" py={8}>
        <Center minH="60vh">
          <LoadingSpinner />
        </Center>
      </Container>
    );
  }

  // Error state
  if (error || !packageData) {
    return (
      <Container maxW="7xl" py={8}>
        <Center minH="60vh">
          <Alert status="error" borderRadius="lg" maxW="md">
            <AlertIcon />
            <Box>
              <AlertTitle>Package not found</AlertTitle>
              <AlertDescription>
                The package you're looking for doesn't exist or has been removed.
              </AlertDescription>
            </Box>
          </Alert>
        </Center>
        <Center mt={6}>
          <Button onClick={() => navigate('/packages')} colorScheme="purple">
            Back to Packages
          </Button>
        </Center>
      </Container>
    );
  }

  return (
    <ErrorBoundary level="page">
      <SEO
        title={`${packageData.name} - Travel Package`}
        description={packageData.description}
        image={packageData.images?.[0]?.image}
      />
      
      <Container maxW="7xl" py={8}>
        {/* Header Section */}
        <PackageHeader
          packageData={packageData}
          onBookNow={handleBookNow}
          onAddToWishlist={handleAddToWishlist}
          onShare={handleShare}
          isWishlisted={isWishlisted}
        />

        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8}>
          {/* Main Content */}
          <VStack spacing={8} align="stretch">
            {/* Image Gallery */}
            {packageData.images && packageData.images.length > 0 && (
              <PackageImageGallery
                images={packageData.images}
                packageName={packageData.name}
              />
            )}

            {/* Detailed Description */}
            {packageData.detailed_description && (
              <Box p={6} bg="white" borderRadius="xl" border="1px solid" borderColor="gray.200">
                <Text fontSize="lg" fontWeight="semibold" color="gray.800" mb={4}>
                  About This Package
                </Text>
                <Text color="gray.700" lineHeight="1.8" fontSize="md">
                  {packageData.detailed_description}
                </Text>
              </Box>
            )}

            {/* Itinerary Section */}
            {packageData.itinerary && packageData.itinerary.length > 0 && (
              <Box p={6} bg="white" borderRadius="xl" border="1px solid" borderColor="gray.200">
                <Heading size="lg" color="gray.800" mb={6} display="flex" alignItems="center">
                  📅 Detailed Itinerary
                </Heading>
                <PackageItinerary itinerary={packageData.itinerary} />
              </Box>
            )}

            {/* Destinations & Map Section */}
            {packageData.destinations?.length ? (
              <Box p={6} bg="white" borderRadius="xl" border="1px solid" borderColor="gray.200">
                <Heading size="lg" color="gray.800" mb={6} display="flex" alignItems="center">
                  🗺️ Destinations & Journey Map
                </Heading>
                <VStack spacing={6} align="stretch">
                  <GoogleMap destinations={packageData.destinations} height={400} />
                  <Divider />
                  <PackageDestinations destinations={packageData.destinations} />
                </VStack>
              </Box>
            ) : null}

            {/* Activities Section */}
            {packageData.activities && packageData.activities.length > 0 && (
              <Box p={6} bg="white" borderRadius="xl" border="1px solid" borderColor="gray.200">
                <Heading size="lg" color="gray.800" mb={6} display="flex" alignItems="center">
                  🎯 Activities & Experiences
                </Heading>
                <PackageActivities activities={packageData.activities} />
              </Box>
            )}

            {/* What's Included Section */}
            {packageData.inclusions && packageData.inclusions.length > 0 && (
              <Box p={6} bg="white" borderRadius="xl" border="1px solid" borderColor="gray.200">
                <Heading size="lg" color="gray.800" mb={6} display="flex" alignItems="center">
                  ✅ What's Included
                </Heading>
                <PackageInclusions inclusions={packageData.inclusions} />
              </Box>
            )}

            {/* Reviews Section */}
            {packageData.reviews && packageData.reviews.length > 0 && (
              <Box p={6} bg="white" borderRadius="xl" border="1px solid" borderColor="gray.200">
                <Heading size="lg" color="gray.800" mb={6} display="flex" alignItems="center">
                  ⭐ Customer Reviews
                </Heading>
                <VStack spacing={4} align="stretch">
                  {packageData.reviews.slice(0, 3).map((review) => (
                    <Box key={review.id} p={4} bg="gray.50" borderRadius="lg">
                      <HStack justify="space-between" mb={2}>
                        <Text fontWeight="medium" color="gray.800">
                          {review.name}
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          {new Date(review.created_at || '').toLocaleDateString()}
                        </Text>
                      </HStack>
                      <Text fontSize="sm" color="gray.600" lineHeight="1.6">
                        {review.comment}
                      </Text>
                    </Box>
                  ))}
                  {packageData.reviews.length > 3 && (
                    <Button variant="outline" colorScheme="purple" size="sm">
                      View all {packageData.reviews.length} reviews
                    </Button>
                  )}
                </VStack>
              </Box>
            )}
          </VStack>

          {/* Sidebar */}
          <GridItem>
            <PackageSidebar
              packageData={packageData}
              onBookNow={handleBookNow}
            />
          </GridItem>
                 </Grid>
       </Container>

       {/* Sticky Booking Bar for Mobile */}
       <StickyBookingBar
         packageData={packageData}
         onBookNow={handleBookNow}
         onAddToWishlist={handleAddToWishlist}
         onShare={handleShare}
         isWishlisted={isWishlisted}
       />

       {/* Booking Modal */}
      <BookingChoiceModal
        isOpen={isOpen}
        onClose={onClose}
        package={packageData}
        onFormBooking={() => {
          setShowBookingForm(true);
          onClose();
        }}
      />

      {showBookingForm && (
        <PackageBookingForm
          packageId={packageData.id}
          packageName={packageData.name}
          packagePrice={parseFloat(packageData.price as any)}
          packageDurationDays={packageData.duration}
          onClose={() => setShowBookingForm(false)}
        />
      )}
    </ErrorBoundary>
  );
} 