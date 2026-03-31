import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Heading, Text, Button, SimpleGrid, VStack, HStack, useColorModeValue, Badge } from '@chakra-ui/react';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { useFeaturedBoatPackages } from '../../../hooks/useBoats';
import { PackageCard } from '../../boat/PackageCard';
import { LoadingSpinner } from '../../LoadingSpinner';

export const BoatPackagesSection: React.FC = () => {
  const { packages, loading, error } = useFeaturedBoatPackages();
  
  // All hooks must be called at the top level, before any conditional returns
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.900', 'white');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.300');

  if (loading) {
    return (
      <Box py={16} bg={bgColor}>
        <Container maxW="7xl">
          <VStack spacing={8} align="center">
            <VStack spacing={3} textAlign="center" maxW="3xl">
              <Heading size="xl" color={textColor} className="font-display tracking-tight">
                Boat Charter Packages
              </Heading>
              <Text fontSize="md" color={mutedTextColor} maxW="2xl">
                Choose from our Silver and Gold packages for the perfect fishing adventure
              </Text>
            </VStack>
            <LoadingSpinner />
          </VStack>
        </Container>
      </Box>
    );
  }

  if (error || packages.length === 0) {
    return null;
  }

  return (
    <Box py={16} bg={bgColor}>
      <Container maxW="7xl">
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <VStack spacing={3} textAlign="center" maxW="3xl" mx="auto">
            <Badge colorScheme="blue" fontSize="xs" px={2} py={0.5} borderRadius="full">
              FLEXIBLE PRICING
            </Badge>
            <Heading size="xl" color={textColor} className="font-display tracking-tight">
              Boat Charter Packages
            </Heading>
            <Text fontSize="md" color={mutedTextColor} maxW="2xl">
              All-inclusive fishing charters with premium equipment and expert crew
            </Text>
          </VStack>

          {/* Packages Grid - Compact cards */}
          <SimpleGrid columns={{ base: 1, sm: 2, lg: packages.length >= 4 ? 4 : packages.length }} spacing={5}>
            {packages.map((pkg) => (
              <PackageCard key={pkg.id} boatPackage={pkg} compact />
            ))}
          </SimpleGrid>

          {/* CTA */}
          <HStack justify="center" mt={4}>
            <Link to="/boats?tab=packages">
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
                View All Packages
              </Button>
            </Link>
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
};
