import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Heading, Text, SimpleGrid, VStack, Spinner, Alert, AlertIcon, HStack, Badge } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { searchTours } from '../services/api';
import TourCard from '../components/TourCard';

const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['search', query],
    queryFn: () => searchTours(query),
    enabled: !!query,
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
        Error searching tours: {(error as Error).message}
      </Alert>
    );
  }

  return (
    <VStack spacing={8} align="stretch">
      <Box textAlign="center">
        <Heading size="2xl" mb={4}>
          Search Results
        </Heading>
        <Text fontSize="lg" color="gray.600">
          {query ? `Results for "${query}"` : 'No search query provided'}
        </Text>
      </Box>

      {data && (
        <VStack spacing={6} align="stretch">
          {/* Results Summary */}
          <HStack spacing={4} justify="center">
            <Badge colorScheme="blue" fontSize="md" px={3} py={1}>
              {data.total_countries} Countries
            </Badge>
            <Badge colorScheme="green" fontSize="md" px={3} py={1}>
              {data.total_tours} Tours
            </Badge>
          </HStack>

          {/* Countries Section */}
          {data.countries && data.countries.length > 0 && (
            <Box>
              <Heading size="lg" mb={4}>
                Countries
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {data.countries.map((country) => (
                  <Box key={country.id} p={4} borderWidth="1px" borderRadius="md">
                    <Heading size="md" mb={2}>
                      {country.name}
                    </Heading>
                    <Text fontSize="sm" color="gray.600" mb={2}>
                      {country.capital}, {country.continent_name}
                    </Text>
                    <Text fontSize="sm">{country.packages_count} tours available</Text>
                  </Box>
                ))}
              </SimpleGrid>
            </Box>
          )}

          {/* Tours Section */}
          {data.tours && data.tours.length > 0 && (
            <Box>
              <Heading size="lg" mb={4}>
                Tours
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {data.tours.map((tour) => (
                  <TourCard key={tour.id} tour={tour} />
                ))}
              </SimpleGrid>
            </Box>
          )}

          {/* No Results */}
          {data.total_countries === 0 && data.total_tours === 0 && (
            <Box textAlign="center" py={10}>
              <Text fontSize="lg" color="gray.500">
                No results found for "{query}"
              </Text>
              <Text fontSize="sm" color="gray.400" mt={2}>
                Try searching for a different destination or activity
              </Text>
            </Box>
          )}
        </VStack>
      )}
    </VStack>
  );
};

export default SearchResultsPage;
