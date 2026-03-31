import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '../../../contexts/CurrencyContext';
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
  Card,
  CardBody,
  SimpleGrid,
  List,
  ListItem,
  ListIcon,
  Divider,
} from '@chakra-ui/react';
import { HeartIcon, ArrowRightIcon, FireIcon, CheckIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { useTranslation } from '../../../i18n';
import type { Package as ApiPackage } from '../../../types';
import { useWhatsApp } from '../../../hooks/useQueries';
import { SmartLazyImage } from '../../SmartLazyImage';

interface Props { packages?: ApiPackage[]; }

interface LocalPackage {
  id: number;
  name: string;
  description: string;
  price: number;
  original_price?: string | null;
  pricing_type?: 'per_person' | 'per_couple' | 'per_room' | 'per_group';
  duration: string;
  nights: number;
  destinations: string[];
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
  // Calculate nights if not provided (usually duration - 1)
  const calculatedNights = apiPackage.nights || Math.max(0, (apiPackage.duration || 1) - 1);
  
  return {
    id: apiPackage.id,
    name: apiPackage.name,
    description: apiPackage.description,
    price: parseFloat(apiPackage.price),
    original_price: apiPackage.original_price || null,
    pricing_type: apiPackage.pricing_type || 'per_person',
    duration: apiPackage.duration.toString(),
    nights: calculatedNights,
    // Map destinations from PackageDestination relationship
    destinations: Array.isArray(apiPackage.destinations)
      ? apiPackage.destinations
          .map((dest) => dest.location?.island || 'Maldives')
          .filter(Boolean)
      : [],
    // Map highlights - handle both array and comma-separated string
    highlights: Array.isArray(apiPackage.highlights)
      ? apiPackage.highlights
      : (apiPackage.highlights && typeof apiPackage.highlights === 'string' ? (apiPackage.highlights as string).split(',').map((h: string) => h.trim()).filter(Boolean) : []),
    // Map included items from PackageInclusion relationship
    included: Array.isArray(apiPackage.inclusions)
      ? apiPackage.inclusions
          .filter((inc) => inc.category === 'included')
          .map((inc) => inc.item)
          .filter(Boolean)
      : [],
    // Map max travelers from group_size field
    maxTravelers: apiPackage.group_size?.max || apiPackage.group_size?.recommended || 4,
    featured: apiPackage.is_featured,
    // Map images from PackageImage relationship
    image: Array.isArray(apiPackage.images) && apiPackage.images.length > 0 
      ? apiPackage.images[0].image 
      : '/images/optimized/medium/ishan1.webp',
    rating: apiPackage.rating || 4.5,
    reviewCount: apiPackage.review_count || 0,
    category: apiPackage.category || 'Adventure'
  };
};

export const ExperiencesTrendingDeals: React.FC<Props> = ({ packages = [] }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getWhatsAppUrl } = useWhatsApp();
  const { formatPrice } = useCurrency();
  
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.300');

  const topPackages: LocalPackage[] = useMemo(() => 
    packages.map(convertApiPackageToCardFormat)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 6), 
    [packages]
  );

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
            <Badge colorScheme="blue" variant="subtle" px={4} py={2} borderRadius="full" fontSize="sm" fontWeight="semibold">
              <HStack spacing={2}>
                <Icon as={FireIcon} className="h-4 w-4" />
                <Text>{t('homepage.trending.badge', 'Best Maldives Deals')}</Text>
              </HStack>
            </Badge>
            <Heading
              size="2xl"
              color={textColor}
              fontWeight="bold"
              fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
              className="font-display tracking-tight"
            >
              {t('homepage.trending.title', 'Curated Maldives Packages')}
            </Heading>
            <Text fontSize="lg" color={mutedTextColor} maxW="2xl" lineHeight="1.6">
              {t('homepage.trending.subtitle', 'Handpicked packages combining the best accommodations, activities, and experiences for the perfect Maldives getaway')}
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} w="full">
            {topPackages.map((pkg) => {
              // Use backend pricing - no frontend calculations
              const currentPrice = pkg.price;
              const originalPrice = pkg.original_price && pkg.original_price !== 'null' && pkg.original_price !== '0' && pkg.original_price !== '0.00'
                ? parseFloat(pkg.original_price.replace(/[^0-9.]/g, ''))
                : null;
              const discountPercent = originalPrice && originalPrice > currentPrice
                ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
                : 0;

              return (
                <Card
                  key={pkg.id}
                  shadow="sm"
                  borderWidth="1px"
                  borderColor="gray.200"
                  borderRadius="xl"
                  overflow="hidden"
                  className="!border-slate-200/90 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                  display="flex"
                  flexDirection="column"
                  h="full"
                >
                  <Box position="relative" h="250px" flexShrink={0}>
                    <SmartLazyImage
                      src={pkg.image}
                      alt={pkg.name}
                      width="100%"
                      height="100%"
                      objectFit="cover"
                      useCase="card"
                      enableSmartConversion={true}
                      showLoadingSkeleton={true}
                    />
                  </Box>

                  <CardBody p={5} display="flex" flexDirection="column" flex={1}>
                    <VStack spacing={3} align="stretch" flex={1}>
                      {/* Package name first */}
                      <Heading size="md" color="gray.900" noOfLines={2}>
                        {pkg.name}
                      </Heading>
                      <Text color="gray.600" fontSize="sm" noOfLines={2}>
                        {pkg.description}
                      </Text>

                      {/* Destinations - Simplified */}
                      {Array.isArray(pkg.destinations) && pkg.destinations.length > 0 && (
                        <HStack spacing={1} fontSize="sm" color="gray.600">
                          <Icon as={MapPinIcon} className="h-4 w-4" color="sky.500" />
                          <Text noOfLines={1}>
                            {pkg.destinations.slice(0, 2).join(', ')}
                            {pkg.destinations.length > 2 && ` +${pkg.destinations.length - 2}`}
                          </Text>
                        </HStack>
                      )}

                      {/* Highlights */}
                      {Array.isArray(pkg.highlights) && pkg.highlights.length > 0 && (
                        <VStack align="start" spacing={2}>
                          <Text fontWeight="semibold" fontSize="sm" color="gray.700">{t('homepage.trending.highlights', 'Highlights:')}</Text>
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
                                +{pkg.highlights.length - 3} {t('homepage.trending.moreActivities', 'more activities')}
                              </ListItem>
                            )}
                          </List>
                        </VStack>
                      )}

                      {/* What's Included */}
                      {Array.isArray(pkg.included) && pkg.included.length > 0 && (
                        <VStack align="start" spacing={2}>
                          <Text fontWeight="semibold" fontSize="sm" color="gray.700">{t('homepage.trending.included', 'What\'s Included:')}</Text>
                          <List spacing={1}>
                            {pkg.included.slice(0, 3).map((item, index) => (
                              <ListItem key={index} fontSize="sm" color="gray.600">
                                <ListIcon as={CheckIcon} color="blue.500" />
                                {item}
                              </ListItem>
                            ))}
                            {pkg.included.length > 3 && (
                              <ListItem fontSize="sm" color="gray.500">
                                <ListIcon as={CheckIcon} color="blue.500" />
                                +{pkg.included.length - 3} {t('homepage.trending.moreIncluded', 'more included')}
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
                              {formatPrice(currentPrice)}
                            </Text>
                            {discountPercent > 0 && originalPrice && (
                              <>
                                <Text fontSize="sm" color="gray.500" textDecoration="line-through">
                                  {formatPrice(originalPrice)}
                                </Text>
                                <Text fontSize="sm" color="green.600" fontWeight="semibold">
                                  {t('homepage.trending.save', 'Save')} {formatPrice(originalPrice - currentPrice)} ({discountPercent}% {t('homepage.trending.off', 'off')})
                                </Text>
                              </>
                            )}
                          </VStack>
                          <VStack align="end" spacing={0}>
                            <Text fontSize="sm" color="gray.500">
                              {(() => {
                                const nights = pkg.nights || Math.max(0, (parseInt(pkg.duration) || 1) - 1);
                                return nights > 0 ? `${pkg.duration} days, ${nights} nights` : `${pkg.duration} days`;
                              })()}
                            </Text>
                            <Text fontSize="lg" fontWeight="semibold" color="gray.700">
                              {formatPrice(currentPrice)}
                            </Text>
                          </VStack>
                        </HStack>

                        <HStack spacing={2} w="full">
                          <Button
                            flex={1}
                            size="sm"
                            onClick={() => handleWhatsAppBooking(pkg)}
                            leftIcon={<Icon as={HeartIcon} />}
                            className="!rounded-lg !border-0 !bg-emerald-600 !font-semibold !text-white !shadow-sm hover:!bg-emerald-700"
                          >
                            {t('ui.buttons.bookNow')}
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => navigate(`/packages/${pkg.id}`)}
                            className="!rounded-lg !border !border-slate-200/90 !bg-white !font-semibold !text-slate-800 !shadow-sm hover:!border-slate-300 hover:!bg-slate-50"
                          >
                            {t('homepage.trending.details', 'Details')}
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
              px={8}
              py={6}
              borderRadius="lg"
              rightIcon={<Icon as={ArrowRightIcon} className="h-5 w-5" />}
              onClick={() => navigate('/packages?sort=featured')}
              className="!border-0 !bg-slate-900 !font-semibold !text-white !shadow-sm hover:!bg-slate-800"
            >
              {t('homepage.trending.viewAll', 'View All Curated Packages')}
            </Button>
            <Text fontSize="sm" color={mutedTextColor}>{t('homepage.trending.limited', 'Limited-time offers. Book now to secure the best prices!')}</Text>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
};
