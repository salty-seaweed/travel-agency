import React, { useState, useEffect } from 'react';
import { Box, VStack, Text, Button, Container, Heading, SimpleGrid, useColorModeValue } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { LazyImage } from '../../LazyImage';
import { LoadingSpinner } from '../../LoadingSpinner';
import { useTranslation } from '../../../i18n';
import { Resort } from '../../../types';

export const ExperiencesResortsSection: React.FC = () => {
  const { t } = useTranslation();
  const [resorts, setResorts] = useState<Resort[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.300');

  useEffect(() => {
    const fetchResorts = async () => {
      try {
        console.log('Fetching resorts...');
        setLoading(true);
        const response = await fetch('/api/resorts/?limit=6&is_featured=true');
        console.log('Featured resorts response:', response.status);
        if (response.ok) {
          const data = await response.json();
          console.log('Featured resorts data:', data);
          setResorts(data.results || []);
        } else {
          // Fallback to any resorts if no featured ones
          console.log('Trying fallback resorts...');
          const fallbackResponse = await fetch('/api/resorts/?limit=6');
          console.log('Fallback resorts response:', fallbackResponse.status);
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            console.log('Fallback resorts data:', fallbackData);
            setResorts(fallbackData.results || []);
          }
        }
      } catch (err) {
        console.error('Error fetching resorts:', err);
        setError('Failed to load resorts');
      } finally {
        setLoading(false);
      }
    };

    fetchResorts();
  }, []);

  if (loading) {
    return (
      <Box py={20} bg="white">
        <Container maxW="7xl">
          <VStack spacing={12} align="center">
            <VStack spacing={4} textAlign="center" maxW="3xl">
              <Heading size="2xl" color={textColor}>
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
    console.error('Resorts section error:', error);
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
    console.log('No resorts found, showing empty state');
    return (
      <Box py={20} bg="white">
        <Container maxW="7xl">
          <VStack spacing={12} align="center">
            <VStack spacing={4} textAlign="center" maxW="3xl">
              <Heading size="2xl" color={textColor}>
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
              borderRadius="xl"
              bg="green.400"
              color="white"
              _hover={{
                bg: 'green.500',
                transform: 'translateY(-2px)',
              }}
              transition="all 0.3s ease"
            >
              {t('homepage.resorts.viewAll', 'View All Resorts')}
            </Button>
          </VStack>
        </Container>
      </Box>
    );
  }

  return (
    <Box py={20} bg="white">
      <Container maxW="7xl">
        <VStack spacing={12} align="center">
          {/* Section Header */}
          <VStack spacing={6} textAlign="center" maxW="4xl">
            <Heading 
              size="2xl" 
              color={textColor}
            >
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
                bg="white"
                borderRadius="none"
                overflow="hidden"
                boxShadow="none"
                border="none"
                transition="all 0.4s ease"
                _hover={{
                  transform: 'translateY(-8px)',
                }}
                position="relative"
                group
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

                      <Box display="flex" alignItems="center" gap={2}>
                        <Text fontSize="sm" color={mutedTextColor}>
                          📍 {resort.full_location || `${resort.atoll}, Maldives`}
                        </Text>
                      </Box>

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
            borderRadius="xl"
            bg="green.400"
            color="white"
            _hover={{
              bg: 'green.500',
              transform: 'translateY(-2px)',
            }}
            transition="all 0.3s ease"
          >
            {t('homepage.resorts.viewAll', 'View All Resorts')}
          </Button>
        </VStack>
      </Container>
    </Box>
  );
};
