import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  SimpleGrid,
  VStack,
  HStack,
  Badge,
  Divider,
  Icon,
  useColorModeValue,
  Flex,
  List,
  ListItem,
  ListIcon,
} from '@chakra-ui/react';
import {
  ArrowLeftIcon,
  ClockIcon,
  UserGroupIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { useBoatActivity } from '../../hooks/useBoats';
import { LoadingSpinner } from '../LoadingSpinner';
import { SEO } from '../SEO';
import { LazyImage } from '../LazyImage';

export function ActivityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { activity, loading, error } = useBoatActivity(Number(id));

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.900', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');
  const accentColor = useColorModeValue('blue.600', 'blue.400');

  if (loading) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <LoadingSpinner />
      </Box>
    );
  }

  if (error || !activity) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg={bgColor}>
        <VStack spacing={6} textAlign="center" p={8}>
          <Heading size="xl" color={textColor}>Activity Not Found</Heading>
          <Text color={mutedColor}>{error || 'The activity you are looking for does not exist.'}</Text>
          <Link to="/boats?tab=activities">
            <Button colorScheme="blue" leftIcon={<Icon as={ArrowLeftIcon} />}>
              Back to Activities
            </Button>
          </Link>
        </VStack>
      </Box>
    );
  }

  const difficultyColors = {
    easy: 'green',
    moderate: 'yellow',
    challenging: 'orange',
    expert: 'red',
  };

  return (
    <>
      <SEO
        title={`${activity.name} - Boat Activity`}
        description={activity.description}
        keywords={`${activity.name}, boat activity, Maldives fishing`}
      />

      <Box minH="100vh" bg={bgColor}>
        {/* Hero Section */}
        <Box position="relative" h={{ base: '300px', md: '400px' }} overflow="hidden">
          {activity.hero_image_url || activity.hero_image ? (
            <LazyImage
              src={activity.hero_image_url || activity.hero_image || ''}
              alt={activity.name}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <Box
              position="absolute"
              inset={0}
              bgGradient="linear(to-r, blue.600, blue.800)"
            />
          )}
          <Box
            position="absolute"
            inset={0}
            bgGradient="linear(to-t, blackAlpha.800, blackAlpha.400)"
          />
          <Container maxW="7xl" h="full" position="relative">
            <VStack h="full" justify="flex-end" align="flex-start" pb={8} spacing={4}>
              <Link to="/boats?tab=activities">
                <Button
                  variant="ghost"
                  color="white"
                  leftIcon={<Icon as={ArrowLeftIcon} />}
                  _hover={{ bg: 'whiteAlpha.200' }}
                >
                  Back to Activities
                </Button>
              </Link>
              <HStack spacing={3}>
                <Badge
                  colorScheme={difficultyColors[activity.difficulty_level]}
                  fontSize="md"
                  px={4}
                  py={2}
                  borderRadius="full"
                  textTransform="capitalize"
                >
                  {activity.difficulty_level}
                </Badge>
                {activity.is_featured && (
                  <Badge colorScheme="orange" fontSize="md" px={4} py={2} borderRadius="full">
                    Popular Activity
                  </Badge>
                )}
              </HStack>
              <Heading size="2xl" color="white">
                {activity.name}
              </Heading>
              <Text fontSize="xl" color="whiteAlpha.900" maxW="3xl">
                {activity.description}
              </Text>
            </VStack>
          </Container>
        </Box>

        {/* Content */}
        <Container maxW="7xl" py={12}>
          <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={8}>
            {/* Main Content */}
            <VStack align="stretch" spacing={6} gridColumn={{ base: '1', lg: '1 / 3' }}>
              {/* Quick Info */}
              <Box bg={cardBg} p={6} borderRadius="xl" shadow="sm" border="1px" borderColor={borderColor}>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                  <HStack spacing={3}>
                    <Icon as={ClockIcon} boxSize={6} color={accentColor} />
                    <VStack align="flex-start" spacing={0}>
                      <Text fontSize="sm" color={mutedColor}>Duration</Text>
                      <Text fontWeight="semibold" color={textColor}>
                        {activity.duration_description || `${activity.duration_hours} hours`}
                      </Text>
                    </VStack>
                  </HStack>
                  <HStack spacing={3}>
                    <Icon as={UserGroupIcon} boxSize={6} color={accentColor} />
                    <VStack align="flex-start" spacing={0}>
                      <Text fontSize="sm" color={mutedColor}>Group Size</Text>
                      <Text fontWeight="semibold" color={textColor}>
                        {activity.min_participants}-{activity.max_participants} guests
                      </Text>
                    </VStack>
                  </HStack>
                  <HStack spacing={3}>
                    <Icon as={ExclamationCircleIcon} boxSize={6} color={accentColor} />
                    <VStack align="flex-start" spacing={0}>
                      <Text fontSize="sm" color={mutedColor}>Difficulty</Text>
                      <Text fontWeight="semibold" color={textColor} textTransform="capitalize">
                        {activity.difficulty_level}
                      </Text>
                    </VStack>
                  </HStack>
                </SimpleGrid>
              </Box>

              {/* Detailed Description */}
              {activity.detailed_description && (
                <Box bg={cardBg} p={6} borderRadius="xl" shadow="sm" border="1px" borderColor={borderColor}>
                  <Heading size="md" mb={4} color={textColor}>About This Activity</Heading>
                  <Text color={mutedColor} whiteSpace="pre-line" lineHeight="tall">
                    {activity.detailed_description}
                  </Text>
                </Box>
              )}

              {/* Target Species */}
              {activity.target_species && activity.target_species.length > 0 && (
                <Box bg={cardBg} p={6} borderRadius="xl" shadow="sm" border="1px" borderColor={borderColor}>
                  <Heading size="md" mb={4} color={textColor}>Target Species</Heading>
                  <SimpleGrid columns={{ base: 2, md: 3 }} spacing={3}>
                    {activity.target_species.map((species, index) => (
                      <HStack key={index}>
                        <Icon as={CheckCircleIcon} color="green.500" boxSize={5} />
                        <Text color={mutedColor}>{species}</Text>
                      </HStack>
                    ))}
                  </SimpleGrid>
                </Box>
              )}

              {/* What's Included */}
              {activity.includes && activity.includes.length > 0 && (
                <Box bg={cardBg} p={6} borderRadius="xl" shadow="sm" border="1px" borderColor={borderColor}>
                  <Heading size="md" mb={4} color={textColor}>What's Included</Heading>
                  <List spacing={3}>
                    {activity.includes.map((item, index) => (
                      <ListItem key={index} display="flex" alignItems="flex-start">
                        <ListIcon as={CheckCircleIcon} color="green.500" boxSize={5} mt={0.5} />
                        <Text color={mutedColor}>{item}</Text>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}

              {/* What's Not Included */}
              {activity.excludes && activity.excludes.length > 0 && (
                <Box bg={cardBg} p={6} borderRadius="xl" shadow="sm" border="1px" borderColor={borderColor}>
                  <Heading size="md" mb={4} color={textColor}>What's Not Included</Heading>
                  <List spacing={3}>
                    {activity.excludes.map((item, index) => (
                      <ListItem key={index} display="flex" alignItems="flex-start">
                        <ListIcon as={XCircleIcon} color="red.500" boxSize={5} mt={0.5} />
                        <Text color={mutedColor}>{item}</Text>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}

              {/* Requirements */}
              {activity.requirements && activity.requirements.length > 0 && (
                <Box
                  bg="yellow.50"
                  _dark={{ bg: 'yellow.900' }}
                  p={6}
                  borderRadius="xl"
                  border="2px"
                  borderColor="yellow.200"
                  _dark={{ borderColor: 'yellow.700' }}
                >
                  <Heading size="md" mb={4} color="yellow.900" _dark={{ color: 'yellow.100' }}>
                    ⚠️ Requirements & Restrictions
                  </Heading>
                  <List spacing={3}>
                    {activity.requirements.map((req, index) => (
                      <ListItem key={index} display="flex" alignItems="flex-start">
                        <ListIcon as={ExclamationCircleIcon} color="yellow.600" boxSize={5} mt={0.5} />
                        <Text color="yellow.800" _dark={{ color: 'yellow.200' }}>{req}</Text>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}

              {/* Suitable Boats */}
              {activity.suitable_boats_details && activity.suitable_boats_details.length > 0 && (
                <Box bg={cardBg} p={6} borderRadius="xl" shadow="sm" border="1px" borderColor={borderColor}>
                  <Heading size="md" mb={4} color={textColor}>Suitable Boats</Heading>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    {activity.suitable_boats_details.map((boat) => (
                      <Link key={boat.id} to={`/boats/${boat.id}`}>
                        <Flex
                          p={4}
                          border="1px"
                          borderColor={borderColor}
                          borderRadius="lg"
                          _hover={{
                            borderColor: accentColor,
                            shadow: 'md',
                            transform: 'translateY(-2px)',
                          }}
                          transition="all 0.2s"
                          gap={4}
                        >
                          {boat.hero_image_url && (
                            <Box
                              w="100px"
                              h="100px"
                              flexShrink={0}
                              borderRadius="md"
                              overflow="hidden"
                            >
                              <LazyImage
                                src={boat.hero_image_url}
                                alt={boat.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            </Box>
                          )}
                          <VStack align="flex-start" spacing={1} flex={1}>
                            <Text fontWeight="semibold" color={textColor}>
                              {boat.name}
                            </Text>
                            <Text fontSize="sm" color={mutedColor} noOfLines={2}>
                              {boat.description}
                            </Text>
                            <HStack fontSize="xs" color={mutedColor}>
                              <Text>{boat.length_feet} ft</Text>
                              <Text>•</Text>
                              <Text>Up to {boat.passenger_capacity} guests</Text>
                            </HStack>
                          </VStack>
                        </Flex>
                      </Link>
                    ))}
                  </SimpleGrid>
                </Box>
              )}

              {/* Gallery */}
              {activity.images && activity.images.length > 0 && (
                <Box bg={cardBg} p={6} borderRadius="xl" shadow="sm" border="1px" borderColor={borderColor}>
                  <Heading size="md" mb={4} color={textColor}>Gallery</Heading>
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                    {activity.images.map((image) => (
                      <Box
                        key={image.id}
                        borderRadius="lg"
                        overflow="hidden"
                        h="200px"
                        cursor="pointer"
                        _hover={{ transform: 'scale(1.05)' }}
                        transition="transform 0.2s"
                      >
                        <LazyImage
                          src={image.image}
                          alt={image.caption || activity.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </Box>
                    ))}
                  </SimpleGrid>
                </Box>
              )}
            </VStack>

            {/* Sidebar */}
            <VStack align="stretch" spacing={6}>
              {/* Booking Card */}
              <Box
                bg={cardBg}
                p={6}
                borderRadius="xl"
                shadow="lg"
                border="1px"
                borderColor={borderColor}
                position={{ base: 'relative', lg: 'sticky' }}
                top={{ base: 'auto', lg: '100px' }}
                maxH={{ base: 'none', lg: 'calc(100vh - 120px)' }}
                overflowY="auto"
              >
                <VStack align="stretch" spacing={4}>
                  <Heading size="md" color={textColor}>Book This Activity</Heading>

                  <Divider />

                  <Text fontSize="sm" color={mutedColor}>
                    Choose your preferred boat and schedule. Contact us for flexible pricing and custom packages.
                  </Text>

                  <Button
                    as="a"
                    href={`https://wa.me/9607441097?text=${encodeURIComponent(
                      `Hi! I'm interested in the ${activity.name} activity. Can you provide pricing details?`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    colorScheme="green"
                    bg="#25D366"
                    color="white"
                    size="lg"
                    w="full"
                    _hover={{
                      bg: '#20BA5A',
                      transform: 'translateY(-2px)',
                      shadow: 'lg',
                    }}
                    _active={{
                      bg: '#1DA851',
                    }}
                    leftIcon={
                      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    }
                  >
                    Book via WhatsApp
                  </Button>

                  <Link to="/boats?tab=packages">
                    <Button variant="outline" colorScheme="blue" w="full">
                      View Packages
                    </Button>
                  </Link>

                  <Text fontSize="xs" color={mutedColor} textAlign="center">
                    💡 Minimum 48 hours advance booking required
                  </Text>
                </VStack>
              </Box>

              {/* Activity Highlights */}
              {activity.featured_highlights && activity.featured_highlights.length > 0 && (
                <Box bg={cardBg} p={6} borderRadius="xl" shadow="sm" border="1px" borderColor={borderColor} mb={8}>
                  <Heading size="sm" mb={4} color={textColor}>
                    Activity Highlights
                  </Heading>
                  <VStack align="stretch" spacing={2}>
                    {activity.featured_highlights.map((highlight, index) => (
                      <HStack key={index} align="flex-start">
                        <Icon as={CheckCircleIcon} color="blue.500" boxSize={5} mt={0.5} />
                        <Text fontSize="sm" color={mutedColor}>
                          {highlight}
                        </Text>
                      </HStack>
                    ))}
                  </VStack>
                </Box>
              )}

              {/* Difficulty Info */}
              <Box bg={cardBg} p={6} borderRadius="xl" shadow="sm" border="1px" borderColor={borderColor} mb={8}>
                <Heading size="sm" mb={4} color={textColor}>
                  Difficulty Level
                </Heading>
                <Badge
                  colorScheme={difficultyColors[activity.difficulty_level]}
                  fontSize="lg"
                  px={4}
                  py={2}
                  borderRadius="full"
                  textTransform="capitalize"
                  mb={3}
                >
                  {activity.difficulty_level}
                </Badge>
                <Text fontSize="sm" color={mutedColor}>
                  {activity.difficulty_level === 'easy' && 'Suitable for beginners and families. No prior experience required.'}
                  {activity.difficulty_level === 'moderate' && 'Some physical activity required. Basic experience recommended.'}
                  {activity.difficulty_level === 'challenging' && 'Requires good physical fitness and some experience.'}
                  {activity.difficulty_level === 'expert' && 'For experienced anglers only. High physical demands.'}
                </Text>
              </Box>
            </VStack>
          </SimpleGrid>
        </Container>
      </Box>
    </>
  );
}
