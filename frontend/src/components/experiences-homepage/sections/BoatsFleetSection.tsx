import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Heading, Text, Button, SimpleGrid, VStack, HStack, useColorModeValue } from '@chakra-ui/react';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { useFeaturedBoats } from '../../../hooks/useBoats';
import { BoatCard } from '../../boat/BoatCard';
import { LoadingSpinner } from '../../LoadingSpinner';

export const BoatsFleetSection: React.FC = () => {
  const { boats, loading, error } = useFeaturedBoats();
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.900', 'white');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.300');

  if (loading) {
    return (
      <Box py={20} bg={bgColor}>
        <Container maxW="7xl">
          <VStack spacing={12} align="center">
            <VStack spacing={4} textAlign="center" maxW="3xl">
              <Heading size="2xl" color={textColor}>
                Our Premium Fleet
              </Heading>
              <Text fontSize="lg" color={mutedTextColor} maxW="2xl">
                State-of-the-art sportfishing boats for the ultimate big game fishing experience
              </Text>
            </VStack>
            <LoadingSpinner />
          </VStack>
        </Container>
      </Box>
    );
  }

  if (error || boats.length === 0) {
    return null;
  }

  return (
    <Box py={20} bg={bgColor}>
      <Container maxW="7xl">
        <VStack spacing={12} align="stretch">
          {/* Header */}
          <VStack spacing={4} textAlign="center" maxW="3xl" mx="auto">
            <Heading size="2xl" color={textColor}>
              Our Premium Fleet
            </Heading>
            <Text fontSize="lg" color={mutedTextColor} maxW="2xl">
              Experience world-class big game fishing with our state-of-the-art sportfishing boats, 
              equipped with the latest technology and expert crew
            </Text>
          </VStack>

          {/* Boats Grid */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
            {boats.slice(0, 2).map((boat) => (
              <BoatCard key={boat.id} boat={boat} />
            ))}
          </SimpleGrid>

          {/* Features */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mt={8}>
            <Box textAlign="center" p={6} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="lg">
              <Text fontSize="3xl" mb={2}>🚤</Text>
              <Text fontWeight="bold" mb={1} color={textColor}>High Speed</Text>
              <Text fontSize="sm" color={mutedTextColor}>Up to 58 knots top speed</Text>
            </Box>
            <Box textAlign="center" p={6} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="lg">
              <Text fontSize="3xl" mb={2}>👨‍✈️</Text>
              <Text fontWeight="bold" mb={1} color={textColor}>Expert Crew</Text>
              <Text fontSize="sm" color={mutedTextColor}>Professional Maldivian captains</Text>
            </Box>
            <Box textAlign="center" p={6} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="lg">
              <Text fontSize="3xl" mb={2}>🎣</Text>
              <Text fontWeight="bold" mb={1} color={textColor}>Premium Gear</Text>
              <Text fontSize="sm" color={mutedTextColor}>Top-quality fishing equipment</Text>
            </Box>
            <Box textAlign="center" p={6} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="lg">
              <Text fontSize="3xl" mb={2}>⭐</Text>
              <Text fontWeight="bold" mb={1} color={textColor}>Luxury Comfort</Text>
              <Text fontSize="sm" color={mutedTextColor}>Full cabin with amenities</Text>
            </Box>
          </SimpleGrid>

          {/* CTA */}
          <HStack justify="center" mt={8}>
            <Link to="/boats">
              <Button
                size="lg"
                bgGradient="linear(to-r, sky.500, blue.500)"
                color="white"
                px={8}
                py={6}
                fontSize="lg"
                fontWeight="bold"
                borderRadius="xl"
                _hover={{
                  bgGradient: 'linear(to-r, sky.600, blue.600)',
                  transform: 'translateY(-2px)',
                  boxShadow: 'xl',
                }}
                transition="all 0.3s ease"
                rightIcon={<ArrowRightIcon style={{ width: '20px', height: '20px' }} />}
              >
                Explore Our Fleet
              </Button>
            </Link>
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
};

