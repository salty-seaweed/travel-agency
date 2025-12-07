import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Heading, Text, Button, SimpleGrid, VStack, HStack, useColorModeValue, Badge } from '@chakra-ui/react';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { useFeaturedBoatPackages } from '../../../hooks/useBoats';
import { PackageCard } from '../../boat/PackageCard';
import { LoadingSpinner } from '../../LoadingSpinner';

export const BoatPackagesSection: React.FC = () => {
  const { packages, loading, error } = useFeaturedBoatPackages();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.900', 'white');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.300');

  if (loading) {
    return (
      <Box py={20} bg={bgColor}>
        <Container maxW="7xl">
          <VStack spacing={12} align="center">
            <VStack spacing={4} textAlign="center" maxW="3xl">
              <Heading size="2xl" color={textColor}>
                Boat Charter Packages
              </Heading>
              <Text fontSize="lg" color={mutedTextColor} maxW="2xl">
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
    <Box py={20} bg={bgColor}>
      <Container maxW="7xl">
        <VStack spacing={12} align="stretch">
          {/* Header */}
          <VStack spacing={4} textAlign="center" maxW="3xl" mx="auto">
            <Badge colorScheme="blue" fontSize="sm" px={3} py={1} borderRadius="full">
              FLEXIBLE PRICING
            </Badge>
            <Heading size="2xl" color={textColor}>
              Boat Charter Packages
            </Heading>
            <Text fontSize="lg" color={mutedTextColor} maxW="2xl">
              All-inclusive fishing charters with premium equipment, expert crew, and unforgettable experiences. 
              Choose Silver for essentials or Gold for the ultimate luxury adventure.
            </Text>
          </VStack>

          {/* Packages Grid */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: packages.length >= 4 ? 4 : packages.length }} spacing={8}>
            {packages.map((pkg) => (
              <PackageCard key={pkg.id} boatPackage={pkg} />
            ))}
          </SimpleGrid>

          {/* Info Box */}
          <Box
            bg={useColorModeValue('blue.50', 'blue.900')}
            p={8}
            borderRadius="xl"
            textAlign="center"
            mt={8}
          >
            <VStack spacing={4}>
              <Text fontSize="xl" fontWeight="bold" color={textColor}>
                💡 Flexible Pricing Available
              </Text>
              <Text fontSize="md" color={mutedTextColor} maxW="2xl">
                We offer individual & flexible pricing models. Contact us via WhatsApp for custom offers. 
                The more days you book, the better the price! Minimum 48 hours advance booking required.
              </Text>
              <HStack spacing={4} mt={4}>
                <a
                  href={`https://wa.me/9607777777?text=${encodeURIComponent('Hi! I\'m interested in boat charter packages. Can you provide pricing details?')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    colorScheme="whatsapp"
                    size="lg"
                    leftIcon={
                      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    }
                  >
                    Get Custom Quote
                  </Button>
                </a>
              </HStack>
            </VStack>
          </Box>

          {/* CTA */}
          <HStack justify="center" mt={8}>
            <Link to="/boats?tab=packages">
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
                View All Packages
              </Button>
            </Link>
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
};

