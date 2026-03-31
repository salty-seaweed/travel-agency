import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Heading, Text, Button, SimpleGrid, VStack, HStack, useColorModeValue } from '@chakra-ui/react';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { useFeaturedBoats } from '../../../hooks/useBoats';
import { BoatCard } from '../../boat/BoatCard';
import { LoadingSpinner } from '../../LoadingSpinner';

export const BoatsFleetSection: React.FC = () => {
  const { boats, loading, error } = useFeaturedBoats();
  
  // All hooks must be called at the top level, before any conditional returns
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.900', 'white');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.300');

  if (loading) {
    return (
      <Box py={16} bg={bgColor}>
        <Container maxW="7xl">
          <VStack spacing={8} align="center">
            <VStack spacing={3} textAlign="center" maxW="3xl">
              <Heading size="xl" color={textColor} className="font-display tracking-tight">
                Our Premium Fleet
              </Heading>
              <Text fontSize="md" color={mutedTextColor} maxW="2xl">
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
    <Box py={16} bg={bgColor}>
      <Container maxW="7xl">
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <VStack spacing={3} textAlign="center" maxW="3xl" mx="auto">
            <Heading size="xl" color={textColor} className="font-display tracking-tight">
              Our Premium Fleet
            </Heading>
            <Text fontSize="md" color={mutedTextColor} maxW="2xl">
              Experience world-class big game fishing with our state-of-the-art sportfishing boats
            </Text>
          </VStack>

          {/* Boats Grid - Compact cards */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {boats.slice(0, 3).map((boat) => (
              <BoatCard key={boat.id} boat={boat} compact />
            ))}
          </SimpleGrid>

          {/* CTA */}
          <HStack justify="center" mt={4}>
            <Link to="/boats">
              <Button
                size="md"
                px={6}
                py={5}
                fontSize="md"
                fontWeight="bold"
                borderRadius="lg"
                rightIcon={<ArrowRightIcon style={{ width: '16px', height: '16px' }} />}
                className="!border-0 !bg-slate-900 !text-white !shadow-sm hover:!bg-slate-800"
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
