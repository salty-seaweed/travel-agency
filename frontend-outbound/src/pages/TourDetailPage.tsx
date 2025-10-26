import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Heading, Text, SimpleGrid, VStack, HStack, Badge, Spinner, Alert, AlertIcon, Divider, List, ListItem, ListIcon } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { getTourDetails } from '../services/api';
import BookingForm from '../components/BookingForm';
import { FaClock, FaMapMarkerAlt, FaUsers, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const TourDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: tour, isLoading, isError, error } = useQuery({
    queryKey: ['tour', slug],
    queryFn: () => getTourDetails(slug!),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert status="error">
        <AlertIcon />
        Error loading tour details: {(error as Error).message}
      </Alert>
    );
  }

  if (!tour) {
    return (
      <Alert status="error">
        <AlertIcon />
        Tour not found.
      </Alert>
    );
  }

  return (
    <VStack spacing={8} align="stretch">
      {/* Hero Section */}
      <Box position="relative" height="400px" borderRadius="lg" overflow="hidden">
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bgImage={`url(${tour.main_image || 'https://via.placeholder.com/800x400.png?text=Tour+Image'})`}
          bgSize="cover"
          bgPosition="center"
        />
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="blackAlpha.600"
        />
        <VStack
          position="absolute"
          bottom={6}
          left={6}
          align="start"
          color="white"
          spacing={2}
        >
          <Heading size="2xl">{tour.name}</Heading>
          <HStack spacing={4}>
            <HStack>
              <FaMapMarkerAlt />
              <Text>{tour.country_name}</Text>
            </HStack>
            <HStack>
              <FaClock />
              <Text>{tour.duration_days} Days</Text>
            </HStack>
            <HStack>
              <FaUsers />
              <Text>{tour.group_size}</Text>
            </HStack>
          </HStack>
          {tour.is_on_sale && (
            <Badge colorScheme="orange" fontSize="md" px={3} py={1}>
              {tour.discount_percentage}% OFF
            </Badge>
          )}
        </VStack>
      </Box>

      <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={8}>
        {/* Main Content */}
        <Box gridColumn={{ base: 'span 1', lg: 'span 2' }}>
          <VStack spacing={8} align="stretch">
            {/* Overview */}
            <Box>
              <Heading size="lg" mb={4}>Overview</Heading>
              <Text fontSize="lg" mb={4}>{tour.description}</Text>

              {/* Highlights */}
              {tour.highlights && tour.highlights.length > 0 && (
                <Box>
                  <Heading size="md" mb={3}>Highlights</Heading>
                  <VStack align="start" spacing={2}>
                    {tour.highlights.map((highlight, index) => (
                      <HStack key={index} align="start">
                        <FaCheckCircle color="green" />
                        <Text>{highlight}</Text>
                      </HStack>
                    ))}
                  </VStack>
                </Box>
              )}
            </Box>

            {/* Itinerary */}
            {tour.itinerary && tour.itinerary.length > 0 && (
              <Box>
                <Heading size="lg" mb={4}>Itinerary</Heading>
                <VStack spacing={4} align="stretch">
                  {tour.itinerary.map((day) => (
                    <Box key={day.id} p={4} borderWidth="1px" borderRadius="md">
                      <Heading size="md" mb={2}>
                        Day {day.day_number}: {day.title}
                      </Heading>
                      <Text mb={2}>{day.description}</Text>
                      {day.location && (
                        <Text fontSize="sm" color="gray.600" mb={2}>
                          📍 {day.location}
                        </Text>
                      )}
                      {day.activities && day.activities.length > 0 && (
                        <Text fontSize="sm" mb={2}>
                          <strong>Activities:</strong> {day.activities.join(', ')}
                        </Text>
                      )}
                      {day.meals && day.meals.length > 0 && (
                        <Text fontSize="sm">
                          <strong>Meals:</strong> {day.meals.join(', ')}
                        </Text>
                      )}
                    </Box>
                  ))}
                </VStack>
              </Box>
            )}

            {/* Inclusions */}
            {tour.inclusions && tour.inclusions.length > 0 && (
              <Box>
                <Heading size="lg" mb={4}>What's Included</Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  {tour.inclusions.map((inclusion) => (
                    <HStack key={inclusion.id} align="start">
                      {inclusion.is_included ? (
                        <FaCheckCircle color="green" />
                      ) : (
                        <FaTimesCircle color="red" />
                      )}
                      <Text>{inclusion.item}</Text>
                    </HStack>
                  ))}
                </SimpleGrid>
              </Box>
            )}
          </VStack>
        </Box>

        {/* Sidebar with Booking Form */}
        <Box>
          <BookingForm tour={tour} />
        </Box>
      </SimpleGrid>
    </VStack>
  );
};

export default TourDetailPage;
