import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Heading,
  SimpleGrid,
  Card,
  CardBody,
  Image,
  Badge,
  Icon,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  ClockIcon,
  ArrowRightIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import { useTranslation } from '../../../i18n';
import { useCurrency } from '../../../contexts/CurrencyContext';

interface RecentlyViewedPackage {
  id: number;
  name: string;
  image: string;
  price: string;
  duration: number;
  viewedAt: number;
}

export const RecentlyViewedSection: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedPackage[]>([]);
  
  const bgColor = useColorModeValue('white', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.300');

  useEffect(() => {
    // Load recently viewed packages from localStorage
    const stored = localStorage.getItem('recently_viewed_packages');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setRecentlyViewed(parsed.slice(0, 4)); // Show max 4
      } catch (error) {
        console.error('Error loading recently viewed:', error);
      }
    }
  }, []);

  if (recentlyViewed.length === 0) {
    return null; // Don't show section if no recently viewed
  }

  return (
    <Box bg={bgColor} py={12} borderTop="1px solid" borderColor={borderColor}>
      <Container maxW="7xl">
        <VStack spacing={8}>
          {/* Header */}
          <HStack justify="space-between" w="full">
            <HStack spacing={3}>
              <Icon as={ClockIcon} w={6} h={6} color="sky.500" />
              <Heading size="lg" color={textColor}>
                {t('homepage.recentlyViewed.title', 'Recently Viewed')}
              </Heading>
            </HStack>
            <Button
              variant="ghost"
              size="sm"
              rightIcon={<Icon as={ArrowRightIcon} w={4} h={4} />}
              onClick={() => navigate('/packages')}
              color="sky.600"
            >
              View All Packages
            </Button>
          </HStack>

          {/* Recently Viewed Cards */}
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} w="full">
            {recentlyViewed.map((pkg) => (
              <Card
                key={pkg.id}
                bg={cardBg}
                border="1px solid"
                borderColor={borderColor}
                borderRadius="xl"
                overflow="hidden"
                cursor="pointer"
                transition="all 0.3s"
                _hover={{
                  transform: 'translateY(-4px)',
                  shadow: 'lg',
                  borderColor: 'sky.300'
                }}
                onClick={() => navigate(`/packages/${pkg.id}`)}
              >
                <Box position="relative" h="140px">
                  <Image 
                    src={pkg.image} 
                    alt={pkg.name}
                    w="full" 
                    h="full" 
                    objectFit="cover" 
                  />
                  <Badge
                    position="absolute"
                    top={2}
                    left={2}
                    bg="blackAlpha.700"
                    color="white"
                    fontSize="xs"
                    px={2}
                    py={1}
                  >
                    <Icon as={EyeIcon} w={3} h={3} display="inline" mr={1} />
                    Viewed
                  </Badge>
                </Box>
                <CardBody p={3}>
                  <VStack spacing={2} align="start">
                    <Text fontSize="sm" fontWeight="bold" color={textColor} noOfLines={2}>
                      {pkg.name}
                    </Text>
                    <HStack spacing={2} justify="space-between" w="full">
                      <Text fontSize="lg" fontWeight="bold" color="emerald.600">
                        {formatPrice(parseFloat(pkg.price))}
                      </Text>
                      <Text fontSize="xs" color={mutedTextColor}>
                        {pkg.duration}D
                      </Text>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};
