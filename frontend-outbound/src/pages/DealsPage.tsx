import React from 'react';
import { Box, Heading, Text, SimpleGrid, VStack, Spinner, Alert, AlertIcon, Badge } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { getDeals } from '../services/api';
import TourCard from '../components/TourCard';

const DealsPage: React.FC = () => {
  const { data: deals, isLoading, isError, error } = useQuery({
    queryKey: ['deals'],
    queryFn: getDeals,
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
        Error loading deals: {(error as Error).message}
      </Alert>
    );
  }

  return (
    <VStack spacing={8} align="stretch">
      {/* Header */}
      <Box textAlign="center" py={8} bg="orange.50" borderRadius="lg">
        <Heading size="2xl" mb={4} color="orange.600">
          🔥 Hot Deals & Special Offers
        </Heading>
        <Text fontSize="lg" color="gray.600">
          Limited-time offers on amazing destinations. Don't miss out!
        </Text>
      </Box>

      {/* Deals Grid */}
      {deals && deals.length > 0 ? (
        <>
          <Box textAlign="center">
            <Badge colorScheme="orange" fontSize="lg" px={4} py={2}>
              {deals.length} Amazing Deals Available
            </Badge>
          </Box>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
            {deals.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </SimpleGrid>
        </>
      ) : (
        <Box textAlign="center" py={16}>
          <Heading size="lg" mb={4} color="gray.500">
            No deals available right now
          </Heading>
          <Text color="gray.400">
            Check back soon for amazing offers on our tours!
          </Text>
        </Box>
      )}

      {/* Call to Action */}
      <Box textAlign="center" py={8} bg="blue.50" borderRadius="lg">
        <Heading size="lg" mb={4}>
          Want to stay updated on deals?
        </Heading>
        <Text mb={4}>
          Sign up for our newsletter to get exclusive offers and early access to new deals.
        </Text>
        <Text fontSize="sm" color="gray.600">
          Newsletter signup coming soon!
        </Text>
      </Box>
    </VStack>
  );
};

export default DealsPage;
