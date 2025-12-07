import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  SimpleGrid,
  VStack,
  HStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Badge,
  useColorModeValue,
  Icon,
  Flex,
} from '@chakra-ui/react';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { useBoats, useBoatActivities, useBoatPackages } from '../../hooks/useBoats';
import { LoadingSpinner } from '../LoadingSpinner';
import { BoatCard } from './BoatCard';
import { ActivityCard } from './ActivityCard';
import { PackageCard } from './PackageCard';
import { SEO } from '../SEO';

export function BoatsPage() {
  const { boats, loading: boatsLoading, error: boatsError } = useBoats({ is_active: true });
  const { activities, loading: activitiesLoading, error: activitiesError } = useBoatActivities({ is_active: true });
  const { packages, loading: packagesLoading, error: packagesError } = useBoatPackages({ is_active: true });

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.900', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');
  const accentColor = useColorModeValue('blue.600', 'blue.400');

  return (
    <>
      <SEO
        title="Boats & Big Game Fishing - Maldives"
        description="Experience premium big game fishing and boat excursions in the Maldives. Choose from our fleet of sportfishing boats and exciting activities."
        keywords="Maldives fishing, big game fishing, boat charter, sportfishing, trolling, jigging, island hopping"
      />

      <Box minH="100vh" bg={bgColor}>
        {/* Hero Section */}
        <Box
          position="relative"
          bgGradient="linear(to-r, blue.600, blue.800)"
          py={{ base: 16, md: 24 }}
          overflow="hidden"
        >
          <Box
            position="absolute"
            inset={0}
            opacity={0.1}
            bgImage="url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
          />
          <Container maxW="7xl" position="relative">
            <VStack spacing={6} textAlign="center">
              <Badge
                colorScheme="blue"
                fontSize="md"
                px={4}
                py={2}
                borderRadius="full"
                bg="whiteAlpha.200"
                color="white"
              >
                Premium Fishing Charters
              </Badge>
              <Heading
                size="3xl"
                color="white"
                fontWeight="extrabold"
                letterSpacing="tight"
              >
                Big Game Fishing & Boat Charters
              </Heading>
              <Text
                fontSize="xl"
                color="whiteAlpha.900"
                maxW="3xl"
                lineHeight="tall"
              >
                Experience the thrill of big game fishing and luxury boat excursions in the crystal-clear waters of the Maldives
              </Text>
            </VStack>
          </Container>
        </Box>

        {/* Content */}
        <Container maxW="7xl" py={12}>
          <Tabs variant="soft-rounded" colorScheme="blue" defaultIndex={0}>
            <TabList
              mb={8}
              bg={cardBg}
              p={2}
              borderRadius="xl"
              shadow="sm"
              display="flex"
              flexWrap="wrap"
              gap={2}
            >
              <Tab
                fontWeight="semibold"
                _selected={{
                  bg: accentColor,
                  color: 'white',
                }}
                borderRadius="lg"
                px={6}
                py={3}
              >
                <HStack spacing={2}>
                  <Text>Packages</Text>
                  {packages.length > 0 && (
                    <Badge colorScheme="blue" borderRadius="full">
                      {packages.length}
                    </Badge>
                  )}
                </HStack>
              </Tab>
              <Tab
                fontWeight="semibold"
                _selected={{
                  bg: accentColor,
                  color: 'white',
                }}
                borderRadius="lg"
                px={6}
                py={3}
              >
                <HStack spacing={2}>
                  <Text>Our Fleet</Text>
                  {boats.length > 0 && (
                    <Badge colorScheme="blue" borderRadius="full">
                      {boats.length}
                    </Badge>
                  )}
                </HStack>
              </Tab>
              <Tab
                fontWeight="semibold"
                _selected={{
                  bg: accentColor,
                  color: 'white',
                }}
                borderRadius="lg"
                px={6}
                py={3}
              >
                <HStack spacing={2}>
                  <Text>Activities</Text>
                  {activities.length > 0 && (
                    <Badge colorScheme="blue" borderRadius="full">
                      {activities.length}
                    </Badge>
                  )}
                </HStack>
              </Tab>
            </TabList>

            <TabPanels>
              {/* Packages Tab */}
              <TabPanel px={0}>
                {packagesLoading ? (
                  <Flex justify="center" py={12}>
                    <LoadingSpinner />
                  </Flex>
                ) : packagesError ? (
                  <Box textAlign="center" py={12}>
                    <Text color="red.500">{packagesError}</Text>
                  </Box>
                ) : packages.length === 0 ? (
                  <Box textAlign="center" py={12}>
                    <Text color={mutedColor}>No packages available at the moment.</Text>
                  </Box>
                ) : (
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {packages.map((pkg) => (
                      <PackageCard key={pkg.id} boatPackage={pkg} />
                    ))}
                  </SimpleGrid>
                )}
              </TabPanel>

              {/* Fleet Tab */}
              <TabPanel px={0}>
                {boatsLoading ? (
                  <Flex justify="center" py={12}>
                    <LoadingSpinner />
                  </Flex>
                ) : boatsError ? (
                  <Box textAlign="center" py={12}>
                    <Text color="red.500">{boatsError}</Text>
                  </Box>
                ) : boats.length === 0 ? (
                  <Box textAlign="center" py={12}>
                    <Text color={mutedColor}>No boats available at the moment.</Text>
                  </Box>
                ) : (
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    {boats.map((boat) => (
                      <BoatCard key={boat.id} boat={boat} />
                    ))}
                  </SimpleGrid>
                )}
              </TabPanel>

              {/* Activities Tab */}
              <TabPanel px={0}>
                {activitiesLoading ? (
                  <Flex justify="center" py={12}>
                    <LoadingSpinner />
                  </Flex>
                ) : activitiesError ? (
                  <Box textAlign="center" py={12}>
                    <Text color="red.500">{activitiesError}</Text>
                  </Box>
                ) : activities.length === 0 ? (
                  <Box textAlign="center" py={12}>
                    <Text color={mutedColor}>No activities available at the moment.</Text>
                  </Box>
                ) : (
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {activities.map((activity) => (
                      <ActivityCard key={activity.id} activity={activity} />
                    ))}
                  </SimpleGrid>
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Container>

        {/* Info Section */}
        <Box bg={cardBg} py={16} mt={12}>
          <Container maxW="7xl">
            <VStack spacing={12}>
              <VStack spacing={4} textAlign="center">
                <Heading size="xl" color={textColor}>
                  Why Choose Our Boat Charters?
                </Heading>
                <Text fontSize="lg" color={mutedColor} maxW="2xl">
                  Experience world-class fishing and luxury boat excursions with our premium fleet and expert crew
                </Text>
              </VStack>

              <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} w="full">
                <VStack
                  spacing={4}
                  p={6}
                  bg={bgColor}
                  borderRadius="xl"
                  textAlign="center"
                  transition="all 0.2s"
                  _hover={{ transform: 'translateY(-4px)', shadow: 'lg' }}
                >
                  <Box fontSize="4xl">🚤</Box>
                  <Heading size="md" color={textColor}>
                    Premium Fleet
                  </Heading>
                  <Text color={mutedColor} fontSize="sm">
                    State-of-the-art sportfishing boats with top speeds up to 58 knots
                  </Text>
                </VStack>

                <VStack
                  spacing={4}
                  p={6}
                  bg={bgColor}
                  borderRadius="xl"
                  textAlign="center"
                  transition="all 0.2s"
                  _hover={{ transform: 'translateY(-4px)', shadow: 'lg' }}
                >
                  <Box fontSize="4xl">👨‍✈️</Box>
                  <Heading size="md" color={textColor}>
                    Expert Crew
                  </Heading>
                  <Text color={mutedColor} fontSize="sm">
                    Professional Maldivian crew with deep local knowledge
                  </Text>
                </VStack>

                <VStack
                  spacing={4}
                  p={6}
                  bg={bgColor}
                  borderRadius="xl"
                  textAlign="center"
                  transition="all 0.2s"
                  _hover={{ transform: 'translateY(-4px)', shadow: 'lg' }}
                >
                  <Box fontSize="4xl">🎣</Box>
                  <Heading size="md" color={textColor}>
                    World-Class Fishing
                  </Heading>
                  <Text color={mutedColor} fontSize="sm">
                    Target Yellowfin Tuna, Sailfish, Wahoo, and more
                  </Text>
                </VStack>

                <VStack
                  spacing={4}
                  p={6}
                  bg={bgColor}
                  borderRadius="xl"
                  textAlign="center"
                  transition="all 0.2s"
                  _hover={{ transform: 'translateY(-4px)', shadow: 'lg' }}
                >
                  <Box fontSize="4xl">⭐</Box>
                  <Heading size="md" color={textColor}>
                    Luxury Experience
                  </Heading>
                  <Text color={mutedColor} fontSize="sm">
                    Full cabin comfort with premium amenities
                  </Text>
                </VStack>
              </SimpleGrid>
            </VStack>
          </Container>
        </Box>

      </Box>
    </>
  );
}
