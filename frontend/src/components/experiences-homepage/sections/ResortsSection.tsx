import React, { useState, useEffect } from 'react';
import { Box, VStack, Text, Button, Container, Heading, SimpleGrid, HStack, useColorModeValue } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { MapPinIcon } from '@heroicons/react/24/outline';
import { LazyImage } from '../../LazyImage';
import { LoadingSpinner } from '../../LoadingSpinner';
import { useTranslation } from '../../../i18n';
import { Resort } from '../../../types';
import { useUserCountry } from '../../../hooks/useUserCountry';
import { getFeaturedResorts, getResorts } from '../../../api';

export const ExperiencesResortsSection: React.FC = () => {
  const { t } = useTranslation();
  const userCountry = useUserCountry();
  const [resorts, setResorts] = useState<Resort[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.300');

  useEffect(() => {
    const fetchResorts = async () => {
      try {
        setLoading(true);

        try {
          const data = await getFeaturedResorts(userCountry || undefined);
          // Limit to 6 resorts for homepage display
          const limitedData = Array.isArray(data) ? data.slice(0, 6) : [];
          setResorts(limitedData);
        } catch {
          const fallbackData = await getResorts({
            page_size: 6,
            country: userCountry || undefined,
          });
          setResorts(fallbackData.results || []);
        }
      } catch (err) {
        console.error('Error fetching resorts:', err);
        setError('Failed to load resorts');
      } finally {
        setLoading(false);
      }
    };

    fetchResorts();
  }, [userCountry]);

  if (loading) {
    return (
      <Box py={20} bg="gray.50">
        <Container maxW="7xl">
          <VStack spacing={12} align="center">
            <VStack spacing={4} textAlign="center" maxW="3xl">
              <Heading size="2xl" color={textColor} className="font-display tracking-tight">
                {t('homepage.resorts.title', 'Luxury Resorts in Maldives')}
              </Heading>
              <Text fontSize="lg" color={mutedTextColor} maxW="2xl">
                {t('homepage.resorts.subtitle', 'Discover our curated selection of world-class resorts offering unparalleled luxury and breathtaking views.')}
              </Text>
            </VStack>
            <LoadingSpinner />
          </VStack>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box py={16} bg="gray.50">
        <Container maxW="7xl">
          <VStack spacing={4} textAlign="center">
            <Text color="red.500">Failed to load resorts</Text>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </VStack>
        </Container>
      </Box>
    );
  }

  if (!resorts || resorts.length === 0) {
    return (
      <Box py={20} bg="gray.50">
        <Container maxW="7xl">
          <VStack spacing={12} align="center">
            <VStack spacing={4} textAlign="center" maxW="3xl">
              <Heading size="2xl" color={textColor} className="font-display tracking-tight">
                {t('homepage.resorts.title', 'Luxury Resorts in Maldives')}
              </Heading>
              <Text fontSize="lg" color={mutedTextColor} maxW="2xl">
                {t('homepage.resorts.subtitle', 'Discover our curated selection of world-class resorts offering unparalleled luxury and breathtaking views.')}
              </Text>
            </VStack>
            <Text color={mutedTextColor}>No resorts available at the moment.</Text>
            <Button
              as={Link}
              to="/resorts"
              size="lg"
              px={8}
              py={6}
              borderRadius="lg"
              className="!border-0 !bg-slate-900 !font-semibold !text-white !shadow-sm hover:!bg-slate-800"
            >
              {t('homepage.resorts.viewAll', 'View All Resorts')}
            </Button>
          </VStack>
        </Container>
      </Box>
    );
  }

  return (
    <Box py={20} bg="gray.50">
      <Container maxW="7xl">
        <VStack spacing={12} align="center">
          {/* Section Header */}
          <VStack spacing={6} textAlign="center" maxW="4xl">
            <Heading size="2xl" color={textColor} className="font-display tracking-tight">
              {t('homepage.resorts.title', 'Luxury Resorts in Maldives')}
            </Heading>
            <Text 
              fontSize="lg" 
              color={mutedTextColor} 
              maxW="2xl"
            >
              {t('homepage.resorts.subtitle', 'Discover our curated selection of world-class resorts offering unparalleled luxury and breathtaking views.')}
            </Text>
          </VStack>

          {/* Resorts Grid */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} w="full">
            {resorts.slice(0, 6).map((resort) => (
              <Box
                key={resort.id}
                className="group overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                position="relative"
              >
                <Link to={`/resorts/${resort.id}`}>
                  {/* Resort Image */}
                  <Box 
                    position="relative" 
                    height="280px" 
                    overflow="hidden"
                    bg="gray.100"
                  >
                    <LazyImage
                      src={resort.hero_image_url || '/images/placeholder-resort.jpg'}
                      alt={resort.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.4s ease',
                      }}
                      className="group-hover:scale-105"
                    />
                    
                    {/* Overlay on hover */}
                    <Box
                      position="absolute"
                      top={0}
                      left={0}
                      right={0}
                      bottom={0}
                      bg="blackAlpha.200"
                      opacity={0}
                      transition="opacity 0.3s ease"
                      _groupHover={{
                        opacity: 1,
                      }}
                    />
                  </Box>

                  {/* Resort Info */}
                  <Box p={0} mt={4}>
                    <VStack spacing={2} align="start">
                      <Heading 
                        size="md" 
                        color={textColor} 
                        noOfLines={2}
                      >
                        {resort.name}
                      </Heading>
                      
                      <Text 
                        fontSize="sm" 
                        color={mutedTextColor} 
                        noOfLines={2}
                      >
                        {resort.description}
                      </Text>

                      <HStack spacing={1.5} alignItems="center">
                        <MapPinIcon className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
                        <Text fontSize="sm" color={mutedTextColor}>
                          {resort.full_location || `${resort.atoll}, Maldives`}
                        </Text>
                      </HStack>

                    </VStack>
                  </Box>
                </Link>
              </Box>
            ))}
          </SimpleGrid>

          {/* View All Button */}
          <Button
            as={Link}
            to="/resorts"
            size="lg"
            px={8}
            py={6}
            borderRadius="lg"
            className="!border-0 !bg-slate-900 !font-semibold !text-white !shadow-sm hover:!bg-slate-800"
          >
            {t('homepage.resorts.viewAll', 'View All Resorts')}
          </Button>
        </VStack>
      </Container>
    </Box>
  );
};
