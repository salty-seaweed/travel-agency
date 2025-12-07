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
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from '@chakra-ui/react';
import {
  ArrowLeftIcon,
  BoltIcon,
  UserGroupIcon,
  MapPinIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { useBoat } from '../../hooks/useBoats';
import { LoadingSpinner } from '../LoadingSpinner';
import { SEO } from '../SEO';
import { LazyImage } from '../LazyImage';

export function BoatDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { boat, loading, error } = useBoat(Number(id));

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

  if (error || !boat) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg={bgColor}>
        <VStack spacing={6} textAlign="center" p={8}>
          <Heading size="xl" color={textColor}>Boat Not Found</Heading>
          <Text color={mutedColor}>{error || 'The boat you are looking for does not exist.'}</Text>
          <Link to="/boats">
            <Button colorScheme="blue" leftIcon={<Icon as={ArrowLeftIcon} />}>
              Back to Boats
            </Button>
          </Link>
        </VStack>
      </Box>
    );
  }

  return (
    <>
      <SEO
        title={`${boat.name} - Boat Charter`}
        description={boat.description}
        keywords={`${boat.name}, boat charter, Maldives fishing`}
      />

      <Box minH="100vh" bg={bgColor}>
        {/* Hero Section */}
        <Box position="relative" h={{ base: '300px', md: '450px' }} overflow="hidden">
          {boat.hero_image_url || boat.hero_image ? (
            <LazyImage
              src={boat.hero_image_url || boat.hero_image || ''}
              alt={boat.name}
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
              <Link to="/boats">
                <Button
                  variant="ghost"
                  color="white"
                  leftIcon={<Icon as={ArrowLeftIcon} />}
                  _hover={{ bg: 'whiteAlpha.200' }}
                >
                  Back to Fleet
                </Button>
              </Link>
              {boat.is_featured && (
                <Badge colorScheme="orange" fontSize="md" px={4} py={2} borderRadius="full">
                  Featured Boat
                </Badge>
              )}
              <Heading size="2xl" color="white">
                {boat.name}
              </Heading>
              <Text fontSize="xl" color="whiteAlpha.900" maxW="3xl">
                {boat.description}
              </Text>
            </VStack>
          </Container>
        </Box>

        {/* Content */}
        <Container maxW="7xl" py={12}>
          <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={8}>
            {/* Main Content */}
            <VStack align="stretch" spacing={6} gridColumn={{ base: '1', lg: '1 / 3' }}>
              {/* Specifications */}
              <Box bg={cardBg} p={6} borderRadius="xl" shadow="sm" border="1px" borderColor={borderColor}>
                <Heading size="md" mb={6} color={textColor}>Specifications</Heading>
                <SimpleGrid columns={{ base: 2, md: 3 }} spacing={6}>
                  <Stat>
                    <StatLabel color={mutedColor}>Length</StatLabel>
                    <StatNumber color={textColor}>{boat.length_feet} ft</StatNumber>
                    <StatHelpText color={mutedColor}>Overall length</StatHelpText>
                  </Stat>
                  <Stat>
                    <StatLabel color={mutedColor}>Engines</StatLabel>
                    <StatNumber color={textColor} fontSize="lg">{boat.engine_details}</StatNumber>
                    <StatHelpText color={mutedColor}>Power system</StatHelpText>
                  </Stat>
                  <Stat>
                    <StatLabel color={mutedColor}>Cruising Speed</StatLabel>
                    <StatNumber color={textColor}>{boat.cruising_speed_knots} kts</StatNumber>
                    <StatHelpText color={mutedColor}>Average speed</StatHelpText>
                  </Stat>
                  <Stat>
                    <StatLabel color={mutedColor}>Top Speed</StatLabel>
                    <StatNumber color={textColor}>{boat.top_speed_knots} kts</StatNumber>
                    <StatHelpText color={mutedColor}>Maximum speed</StatHelpText>
                  </Stat>
                  <Stat>
                    <StatLabel color={mutedColor}>Capacity</StatLabel>
                    <StatNumber color={textColor}>{boat.passenger_capacity}</StatNumber>
                    <StatHelpText color={mutedColor}>Max guests</StatHelpText>
                  </Stat>
                  <Stat>
                    <StatLabel color={mutedColor}>Crew</StatLabel>
                    <StatNumber color={textColor}>{boat.crew_size}</StatNumber>
                    <StatHelpText color={mutedColor}>Professional crew</StatHelpText>
                  </Stat>
                </SimpleGrid>
              </Box>

              {/* Detailed Description */}
              {boat.detailed_description && (
                <Box bg={cardBg} p={6} borderRadius="xl" shadow="sm" border="1px" borderColor={borderColor}>
                  <Heading size="md" mb={4} color={textColor}>About This Boat</Heading>
                  <Text color={mutedColor} whiteSpace="pre-line" lineHeight="tall">
                    {boat.detailed_description}
                  </Text>
                </Box>
              )}

              {/* Amenities */}
              {((boat.amenities && boat.amenities.length > 0) || (boat.amenities_list && boat.amenities_list.length > 0)) && (
                <Box bg={cardBg} p={6} borderRadius="xl" shadow="sm" border="1px" borderColor={borderColor}>
                  <Heading size="md" mb={4} color={textColor}>Amenities & Features</Heading>
                  <SimpleGrid columns={{ base: 2, md: 3 }} spacing={4}>
                    {(boat.amenities_list || boat.amenities || []).map((amenity: any) => (
                      <HStack key={amenity.id} spacing={2}>
                        <Icon as={CheckCircleIcon} color="green.500" boxSize={5} />
                        <Text color={mutedColor}>{amenity.name}</Text>
                      </HStack>
                    ))}
                  </SimpleGrid>
                </Box>
              )}

              {/* Additional Features */}
              <Box bg={cardBg} p={6} borderRadius="xl" shadow="sm" border="1px" borderColor={borderColor}>
                <Heading size="md" mb={4} color={textColor}>Equipment & Features</Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                  {boat.has_cabin && (
                    <HStack>
                      <Icon as={CheckCircleIcon} color="green.500" boxSize={5} />
                      <Text color={mutedColor}>Full Cabin</Text>
                    </HStack>
                  )}
                  {boat.has_toilet && (
                    <HStack>
                      <Icon as={CheckCircleIcon} color="green.500" boxSize={5} />
                      <Text color={mutedColor}>Onboard Toilet</Text>
                    </HStack>
                  )}
                  {boat.has_shower && (
                    <HStack>
                      <Icon as={CheckCircleIcon} color="green.500" boxSize={5} />
                      <Text color={mutedColor}>Freshwater Shower</Text>
                    </HStack>
                  )}
                  {boat.has_sound_system && (
                    <HStack>
                      <Icon as={CheckCircleIcon} color="green.500" boxSize={5} />
                      <Text color={mutedColor}>Premium Sound System</Text>
                    </HStack>
                  )}
                  {boat.has_gps && (
                    <HStack>
                      <Icon as={CheckCircleIcon} color="green.500" boxSize={5} />
                      <Text color={mutedColor}>GPS Navigation</Text>
                    </HStack>
                  )}
                  {boat.has_fish_finder && (
                    <HStack>
                      <Icon as={CheckCircleIcon} color="green.500" boxSize={5} />
                      <Text color={mutedColor}>Fish Finder</Text>
                    </HStack>
                  )}
                  {boat.has_radar && (
                    <HStack>
                      <Icon as={CheckCircleIcon} color="green.500" boxSize={5} />
                      <Text color={mutedColor}>Radar System</Text>
                    </HStack>
                  )}
                  {boat.has_outriggers && (
                    <HStack>
                      <Icon as={CheckCircleIcon} color="green.500" boxSize={5} />
                      <Text color={mutedColor}>Outriggers</Text>
                    </HStack>
                  )}
                  {boat.fuel_tank_liters && (
                    <HStack>
                      <Icon as={CheckCircleIcon} color="green.500" boxSize={5} />
                      <Text color={mutedColor}>{boat.fuel_tank_liters}L Fuel Tank</Text>
                    </HStack>
                  )}
                  {boat.live_bait_well_liters && (
                    <HStack>
                      <Icon as={CheckCircleIcon} color="green.500" boxSize={5} />
                      <Text color={mutedColor}>{boat.live_bait_well_liters}L Live Bait Well</Text>
                    </HStack>
                  )}
                </SimpleGrid>
              </Box>

              {/* Gallery */}
              {boat.images && boat.images.length > 0 && (
                <Box bg={cardBg} p={6} borderRadius="xl" shadow="sm" border="1px" borderColor={borderColor}>
                  <Heading size="md" mb={4} color={textColor}>Gallery</Heading>
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                    {boat.images.map((image) => (
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
                          alt={image.caption || boat.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </Box>
                    ))}
                  </SimpleGrid>
                </Box>
              )}

              {/* Available Packages */}
              {boat.packages && boat.packages.length > 0 && (
                <Box bg={cardBg} p={6} borderRadius="xl" shadow="sm" border="1px" borderColor={borderColor}>
                  <Heading size="md" mb={4} color={textColor}>Available Packages</Heading>
                  <VStack align="stretch" spacing={4}>
                    {boat.packages.map((pkg) => (
                      <Link key={pkg.id} to={`/boats/packages/${pkg.id}`}>
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
                          justify="space-between"
                          align="center"
                        >
                          <VStack align="flex-start" spacing={1}>
                            <HStack>
                              <Text fontWeight="bold" color={textColor}>
                                {pkg.name}
                              </Text>
                              <Badge colorScheme={pkg.package_tier === 'gold' ? 'yellow' : 'gray'}>
                                {pkg.package_tier}
                              </Badge>
                            </HStack>
                            <Text fontSize="sm" color={mutedColor}>
                              {pkg.description}
                            </Text>
                          </VStack>
                          <VStack align="flex-end" spacing={0}>
                            <Text fontSize="2xl" fontWeight="bold" color={accentColor}>
                              {pkg.currency} {pkg.price}
                            </Text>
                            <Text fontSize="xs" color={mutedColor}>
                              per charter
                            </Text>
                          </VStack>
                        </Flex>
                      </Link>
                    ))}
                  </VStack>
                </Box>
              )}
            </VStack>

            {/* Sidebar */}
            <VStack align="stretch" spacing={6}>
              {/* Quick Info Card */}
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
                  <Heading size="md" color={textColor}>Book This Boat</Heading>
                  
                  <VStack align="stretch" spacing={3}>
                    <HStack>
                      <Icon as={BoltIcon} color={accentColor} boxSize={5} />
                      <VStack align="flex-start" spacing={0} flex={1}>
                        <Text fontSize="xs" color={mutedColor}>Speed</Text>
                        <Text fontSize="sm" fontWeight="semibold" color={textColor}>
                          {boat.cruising_speed_knots}-{boat.top_speed_knots} knots
                        </Text>
                      </VStack>
                    </HStack>
                    <HStack>
                      <Icon as={UserGroupIcon} color={accentColor} boxSize={5} />
                      <VStack align="flex-start" spacing={0} flex={1}>
                        <Text fontSize="xs" color={mutedColor}>Capacity</Text>
                        <Text fontSize="sm" fontWeight="semibold" color={textColor}>
                          Up to {boat.passenger_capacity} guests
                        </Text>
                      </VStack>
                    </HStack>
                    <HStack>
                      <Icon as={MapPinIcon} color={accentColor} boxSize={5} />
                      <VStack align="flex-start" spacing={0} flex={1}>
                        <Text fontSize="xs" color={mutedColor}>Departure</Text>
                        <Text fontSize="sm" fontWeight="semibold" color={textColor}>
                          {boat.departure_location}
                        </Text>
                      </VStack>
                    </HStack>
                  </VStack>

                  <Divider />

                  <Text fontSize="sm" color={mutedColor}>
                    Contact us for flexible pricing and custom packages. Minimum 48 hours advance booking required.
                  </Text>

                  <Button
                    as="a"
                    href={`https://wa.me/9607441097?text=${encodeURIComponent(
                      `Hi! I'm interested in booking the ${boat.name}. Can you provide pricing details?`
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
                      View All Packages
                    </Button>
                  </Link>
                </VStack>
              </Box>

              {/* Highlights */}
              {boat.featured_highlights && boat.featured_highlights.length > 0 && (
                <Box bg={cardBg} p={6} borderRadius="xl" shadow="sm" border="1px" borderColor={borderColor} mb={8}>
                  <Heading size="sm" mb={4} color={textColor}>
                    Boat Highlights
                  </Heading>
                  <VStack align="stretch" spacing={2}>
                    {boat.featured_highlights.map((highlight, index) => (
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
            </VStack>
          </SimpleGrid>
        </Container>
      </Box>
    </>
  );
}
