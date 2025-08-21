import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Container,
  Heading,
  Badge,
  Icon,
  useColorModeValue,
  Image,
  Card,
  CardBody,
  SimpleGrid,
  Progress,
  List,
  ListItem,
  ListIcon,
  Divider,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { 
  HeartIcon, 
  ClockIcon, 
  UserGroupIcon, 
  ArrowRightIcon, 
  FireIcon,
  StarIcon,
  CheckIcon,
  MapPinIcon,
  UsersIcon,
  MinusIcon,
  PlusIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { useTranslation } from '../../../i18n';
import type { Package as ApiPackage } from '../../../types';
import { getWhatsAppUrl } from '../../../config';

interface Props { packages?: ApiPackage[]; properties?: any[]; }

interface LocalPackage {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: string;
  destinations: any[];
  highlights: string[];
  included: string[];
  maxTravelers: number;
  featured: boolean;
  image: string;
  rating: number;
  reviewCount: number;
  category: string;
}

const convertApiPackageToCardFormat = (apiPackage: ApiPackage): LocalPackage => {
  return {
    id: apiPackage.id,
    name: apiPackage.name,
    description: apiPackage.description,
    price: parseFloat(apiPackage.price),
    duration: apiPackage.duration.toString(),
    destinations: apiPackage.destinations || [],
    highlights: apiPackage.highlights || [],
    included: apiPackage.included || [],
    maxTravelers: apiPackage.maxTravelers || 4,
    featured: apiPackage.is_featured,
    image: apiPackage.images?.[0]?.image || '/src/assets/images/ishan1.jpg',
    rating: apiPackage.rating || 4.5,
    reviewCount: apiPackage.review_count || 0,
    category: apiPackage.category || 'Adventure'
  };
};

export const ExperiencesTrendingDeals: React.FC<Props> = ({ packages = [] }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.300');

  const [wishlist, setWishlist] = useState<number[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('wishlist_packages');
    if (saved) {
      try { setWishlist(JSON.parse(saved)); } catch { /* noop */ }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('wishlist_packages', JSON.stringify(wishlist));
  }, [wishlist]);

  const topPackages: LocalPackage[] = useMemo(() => 
    packages.map(convertApiPackageToCardFormat)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 6), 
    [packages]
  );

  const toggleWishlist = (id: number) => {
    setWishlist((prev) => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const isWished = (id: number) => wishlist.includes(id);

  const handleWhatsAppBooking = (pkg: LocalPackage) => {
    const message = `Hi! I'm interested in booking the "${pkg.name}" package. Can you provide more details?`;
    const whatsappUrl = getWhatsAppUrl(message);
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Box bg={bgColor} py={16}>
      <Container maxW="7xl">
        <VStack spacing={12}>
          <VStack spacing={4} textAlign="center">
            <Badge colorScheme="green" variant="solid" px={4} py={2} borderRadius="full" fontSize="sm" fontWeight="semibold">
              <HStack spacing={2}>
                <Icon as={FireIcon} className="w-4 h-4" />
                <Text>Best Maldives Deals</Text>
              </HStack>
            </Badge>
            <Heading size="2xl" color={textColor} fontWeight="bold" fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}>
              Curated Maldives Packages
            </Heading>
            <Text fontSize="lg" color={mutedTextColor} maxW="2xl" lineHeight="1.6">
              Handpicked packages combining the best accommodations, activities, and experiences for the perfect Maldives getaway
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} w="full">
            {topPackages.map((pkg) => {
              // Calculate discounted price (20% discount for featured packages, 10% for others)
              const discountPercentage = pkg.featured ? 20 : 10;
              const originalPrice = pkg.price;
              const discountedPrice = originalPrice * (1 - discountPercentage / 100);
              const savings = originalPrice - discountedPrice;
              const wished = isWished(pkg.id);

              return (
                <Card 
                  key={pkg.id} 
                  shadow="lg" 
                  borderRadius="xl" 
                  overflow="hidden"
                  _hover={{ transform: 'translateY(-4px)', shadow: 'xl' }} 
                  transition="all 0.3s"
                  display="flex" 
                  flexDirection="column" 
                  h="full"
                >
                  <Box position="relative" h="250px" flexShrink={0}>
                    <Image
                      src={pkg.image}
                      alt={pkg.name}
                      w="full"
                      h="full"
                      objectFit="cover"
                    />
                    <Box position="absolute" top={0} left={0} right={0} bottom={0} bg="blackAlpha.400" />

                    {/* Package Badges */}
                    <VStack position="absolute" top={4} left={4} align="start" spacing={2}>
                      {pkg.featured && (
                        <Badge colorScheme="yellow" variant="solid" px={3} py={1}>
                          <Icon as={StarIcon} className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                      <Badge colorScheme="blue" variant="solid" px={3} py={1}>
                        {pkg.category}
                      </Badge>
                      <Badge colorScheme="green" variant="solid" px={3} py={1}>
                        {discountPercentage}% OFF
                      </Badge>
                    </VStack>

                    {/* Wishlist Button */}
                    <Box 
                      position="absolute" 
                      top={4} 
                      right={4} 
                      bg={wished ? 'red.500' : 'whiteAlpha.900'} 
                      borderRadius="full" 
                      p={2} 
                      cursor="pointer" 
                      zIndex={2} 
                      onClick={(e) => { e.stopPropagation(); toggleWishlist(pkg.id); }}
                    >
                      <Icon as={HeartIcon} className={wished ? 'w-4 h-4 text-white' : 'w-4 h-4 text-gray-600'} />
                    </Box>

                    {/* Rating */}
                    <HStack position="absolute" top={4} right={4} bg="blackAlpha.700" px={2} py={1} borderRadius="md">
                      <Icon as={StarSolidIcon} className="w-4 h-4 text-yellow-400" />
                      <Text color="white" fontSize="sm" fontWeight="semibold">{pkg.rating}</Text>
                      <Text color="gray.300" fontSize="sm">({pkg.reviewCount})</Text>
                    </HStack>

                    {/* Package Info Overlay */}
                    <VStack position="absolute" bottom={0} left={0} right={0} p={4}
                            bg="linear-gradient(transparent, rgba(0,0,0,0.8))" spacing={2}>
                      <Text color="white" fontWeight="bold" fontSize="lg" textAlign="center">
                        {pkg.name}
                      </Text>
                      <HStack spacing={4} color="gray.200" fontSize="sm">
                        <HStack spacing={1}>
                          <Icon as={ClockIcon} className="w-4 h-4" />
                          <Text>{parseInt(pkg.duration)} days</Text>
                        </HStack>
                        <HStack spacing={1}>
                          <Icon as={UsersIcon} className="w-4 h-4" />
                          <Text>Up to {pkg.maxTravelers}</Text>
                        </HStack>
                      </HStack>
                    </VStack>
                  </Box>

                  <CardBody p={6} display="flex" flexDirection="column" flex={1}>
                    <VStack spacing={4} align="stretch" flex={1}>
                      <Text color="gray.600" noOfLines={3}>
                        {pkg.description}
                      </Text>

                      {/* Destinations */}
                      {pkg.destinations.length > 0 && (
                        <VStack align="start" spacing={2}>
                          <Text fontWeight="semibold" fontSize="sm" color="gray.700">Destinations:</Text>
                          <Wrap>
                            {pkg.destinations.slice(0, 3).map((dest, index) => (
                              <WrapItem key={index}>
                                <Badge colorScheme="green" variant="subtle">
                                  <Icon as={MapPinIcon} className="w-3 h-3 mr-1" />
                                  {dest.name || dest}
                                </Badge>
                              </WrapItem>
                            ))}
                            {pkg.destinations.length > 3 && (
                              <WrapItem>
                                <Badge colorScheme="gray" variant="subtle">
                                  +{pkg.destinations.length - 3} more
                                </Badge>
                              </WrapItem>
                            )}
                          </Wrap>
                        </VStack>
                      )}

                      {/* Highlights */}
                      {pkg.highlights.length > 0 && (
                        <VStack align="start" spacing={2}>
                          <Text fontWeight="semibold" fontSize="sm" color="gray.700">Highlights:</Text>
                          <List spacing={1}>
                            {pkg.highlights.slice(0, 3).map((highlight, index) => (
                              <ListItem key={index} fontSize="sm" color="gray.600">
                                <ListIcon as={CheckIcon} color="green.500" />
                                {highlight}
                              </ListItem>
                            ))}
                            {pkg.highlights.length > 3 && (
                              <ListItem fontSize="sm" color="gray.500">
                                <ListIcon as={CheckIcon} color="green.500" />
                                +{pkg.highlights.length - 3} more activities
                              </ListItem>
                            )}
                          </List>
                        </VStack>
                      )}

                      <Divider />

                      {/* Price and Actions - Fixed at bottom */}
                      <VStack spacing={3} mt="auto">
                        <HStack justify="space-between" w="full">
                          <VStack align="start" spacing={0}>
                            <Text fontSize="2xl" fontWeight="bold" color="green.500">
                              ${discountedPrice.toLocaleString()}
                            </Text>
                            <Text fontSize="sm" color="gray.500" textDecoration="line-through">
                              ${originalPrice.toLocaleString()}
                            </Text>
                            <Text fontSize="sm" color="green.600" fontWeight="semibold">
                              Save ${savings.toLocaleString()} ({discountPercentage}% off)
                            </Text>
                          </VStack>
                          <VStack align="end" spacing={0}>
                            <Text fontSize="sm" color="gray.500">Total for {pkg.maxTravelers}</Text>
                            <Text fontSize="lg" fontWeight="semibold" color="gray.700">
                              ${(discountedPrice * pkg.maxTravelers).toLocaleString()}
                            </Text>
                          </VStack>
                        </HStack>

                        <HStack spacing={3} w="full">
                          <Button
                            colorScheme="green"
                            flex={1}
                            onClick={() => handleWhatsAppBooking(pkg)}
                            leftIcon={<Icon as={HeartIcon} />}
                          >
                            Book Now
                          </Button>
                          <Button
                            variant="outline"
                            colorScheme="blue"
                            onClick={() => navigate(`/packages/${pkg.id}`)}
                          >
                            Details
                          </Button>
                        </HStack>
                      </VStack>
                    </VStack>
                  </CardBody>
                </Card>
              );
            })}
          </SimpleGrid>

          <VStack spacing={4}>
            <Button 
              size="lg" 
              colorScheme="blue" 
              variant="solid" 
              px={8} 
              py={6} 
              borderRadius="lg" 
              rightIcon={<Icon as={ArrowRightIcon} className="w-5 h-5" />} 
              onClick={() => navigate('/packages?sort=featured')}
            >
              View All Curated Packages
            </Button>
            <Text fontSize="sm" color={mutedTextColor}>Limited-time offers. Book now to secure the best prices!</Text>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
};
