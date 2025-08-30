import React from 'react';
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
  Skeleton,
} from '@chakra-ui/react';
import { MapPinIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useTranslation } from '../../../i18n';
import { useDestinations } from '../../../hooks/useQueries';

interface Props { packages?: any[]; }

export const ExperiencesDestinationsSection: React.FC<Props> = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.300');

  const { data: destinations, isLoading, error } = useDestinations();

  const getImage = (destination: any) => {
    return destination.image || `/src/assets/images/ishan${Math.floor(Math.random() * 20) + 51}.jpg`;
  };

  const handleDestinationClick = (destination: any) => {
    navigate(`/packages?destination=${encodeURIComponent(destination.name)}`);
  };

  if (isLoading) {
    return (
      <Box bg={bgColor} py={16}>
        <Container maxW="7xl">
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center">
              <Heading size="2xl" color={textColor} fontWeight="bold">{t('homepage.destinations.exploreTitle', 'Explore Maldives Destinations')}</Heading>
              <Text fontSize="lg" color={mutedTextColor} maxW="2xl" lineHeight="1.6">
                {t('homepage.destinations.exploreSubtitle', 'Discover the most popular islands and atolls in the Maldives')}
              </Text>
            </VStack>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} w="full">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} height="200px" borderRadius="lg" />
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>
    );
  }

  // Use real destinations only - no fallback data
  const displayDestinations = destinations && destinations.length > 0 
    ? destinations.slice(0, 8) 
    : [];

  return (
    <Box bg={bgColor} py={16}>
      <Container maxW="7xl">
        <VStack spacing={12}>
          <VStack spacing={4} textAlign="center">
            <Badge colorScheme="blue" variant="solid" px={4} py={2} borderRadius="full" fontSize="sm" fontWeight="semibold">
              <Icon as={MapPinIcon} className="w-4 h-4 mr-2" />
              {t('homepage.destinations.badge', 'Popular Destinations')}
            </Badge>
            <Heading size="2xl" color={textColor} fontWeight="bold">{t('homepage.destinations.exploreTitle', 'Explore Maldives Destinations')}</Heading>
            <Text fontSize="lg" color={mutedTextColor} maxW="2xl" lineHeight="1.6">
              {t('homepage.destinations.exploreSubtitleFull', 'Discover the most popular islands and atolls in the Maldives with amazing packages and experiences')}
            </Text>
          </VStack>

          {displayDestinations.length > 0 ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} w="full">
              {displayDestinations.map((destination) => (
                <Card 
                  key={destination.name} 
                  bg={cardBg} 
                  border="1px solid" 
                  borderColor={borderColor} 
                  overflow="hidden" 
                  cursor="pointer" 
                  transition="all 0.3s" 
                  _hover={{ transform: 'translateY(-4px)', shadow: 'xl', borderColor: 'blue.300' }}
                  onClick={() => handleDestinationClick(destination)}
                >
                  <Box position="relative" h="200px">
                    <Image src={getImage(destination)} alt={destination.name} w="full" h="full" objectFit="cover" />
                    <Box position="absolute" top={0} left={0} right={0} bottom={0} bg="blackAlpha.400" />
                    
                    {/* Destination Badge */}
                    <Badge 
                      position="absolute" 
                      top={4} 
                      left={4} 
                      colorScheme="blue" 
                      variant="solid" 
                      px={3} 
                      py={1}
                    >
                      {destination.atoll || 'Maldives'}
                    </Badge>
                    
                    <VStack position="absolute" top={0} left={0} right={0} bottom={0} justify="center" spacing={2}>
                      <Text color="white" fontWeight="bold" fontSize="lg" textAlign="center">{destination.name}</Text>
                      <Text color="gray.200" fontSize="sm" textAlign="center">
                        {destination.property_count} {t('homepage.destinations.properties', 'properties')}
                      </Text>
                      <Text color="gray.300" fontSize="xs" textAlign="center">
                        {destination.island || destination.name}, {destination.atoll || 'Maldives'}
                      </Text>
                    </VStack>
                  </Box>
                </Card>
              ))}
            </SimpleGrid>
          ) : (
            <VStack spacing={4} textAlign="center">
              <Text fontSize="lg" color={mutedTextColor}>{t('homepage.destinations.empty', 'No destinations available at the moment.')}</Text>
              <Text fontSize="sm" color={mutedTextColor}>{t('homepage.destinations.emptyHelp', 'Please check back later or contact us for more information.')}</Text>
            </VStack>
          )}

          <VStack spacing={4}>
            <Button 
              size="lg" 
              colorScheme="blue" 
              variant="outline" 
              px={8} 
              py={6} 
              borderRadius="lg" 
              rightIcon={<Icon as={ArrowRightIcon} className="w-5 h-5" />} 
              onClick={() => navigate('/properties')}
            >
              {t('homepage.destinations.viewAll', 'View All Destinations')}
            </Button>
            <Text fontSize="sm" color={mutedTextColor} textAlign="center">
              {t('homepage.destinations.helper', 'Click on any destination to explore properties and experiences')}
            </Text>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
};
