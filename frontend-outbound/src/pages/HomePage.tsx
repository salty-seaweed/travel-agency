import React from 'react';
import { Box, Heading, Text, SimpleGrid, VStack, Spinner, Alert, AlertIcon } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { getHomepageData } from '../services/api';
import CountryCard from '../components/CountryCard';
import TourCard from '../components/TourCard';
import ActivityCard from '../components/ActivityCard';
import HeroSection from '../components/HeroSection';

const HomePage: React.FC = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['homepageData'],
    queryFn: getHomepageData,
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
        Error fetching data: {(error as Error).message}
      </Alert>
    );
  }

  return (
    <VStack spacing={12} align="stretch">
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Destinations Section */}
      <Box>
        <Heading as="h2" size="xl" mb={6}>
          Featured Destinations
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
          {data?.featured_countries.map((country) => (
            <CountryCard key={country.id} country={country} />
          ))}
        </SimpleGrid>
      </Box>

      {/* Top Deals Section */}
      <Box>
        <Heading as="h2" size="xl" mb={6}>
          Top Deals
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
          {data?.deals.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </SimpleGrid>
      </Box>

      {/* Featured Tours Section */}
      <Box>
        <Heading as="h2" size="xl" mb={6}>
          Featured Tours
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
          {data?.featured_tours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </SimpleGrid>
      </Box>

      {/* Activity Categories Section */}
      <Box>
        <Heading as="h2" size="xl" mb={6}>
          Browse by Activity
        </Heading>
        <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={8}>
          {data?.activity_categories.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </SimpleGrid>
      </Box>
    </VStack>
  );
};

export default HomePage;
