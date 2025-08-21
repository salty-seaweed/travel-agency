import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Container,
  Heading,
  Icon,
  useColorModeValue,
  SimpleGrid,
  Card,
  CardBody,
} from '@chakra-ui/react';
import {
  StarIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { useTranslation } from '../../../i18n';

export const BookmundiPartnersSection: React.FC = () => {
  const { t } = useTranslation();
  
  // Color mode values
  const bgColor = useColorModeValue('white', 'gray.900');
  const cardBg = useColorModeValue('gray.50', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.300');

  // Partners
  const partners = [
    { name: 'Intrepid Travel', rating: 4.6, reviews: 206 },
    { name: 'Travel Talk', rating: 4.6, reviews: 108 },
    { name: 'G Adventures', rating: 4.9, reviews: 116 },
    { name: 'Trafalgar', rating: 4.6, reviews: 38 },
    { name: 'TruTravels', rating: 4.9, reviews: 1727 },
    { name: 'Bamba', rating: 4.8, reviews: 412 },
  ];

  return (
    <Box bg={bgColor} py={16}>
      <Container maxW="7xl">
        <VStack spacing={12}>
          {/* Header */}
          <VStack spacing={4} textAlign="center">
            <Heading
              size="2xl"
              color={textColor}
              fontWeight="bold"
              fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
            >
              Trusted by the Largest Travel Brands
            </Heading>
            <Text
              fontSize="lg"
              color={mutedTextColor}
              maxW="2xl"
              lineHeight="1.6"
            >
              Explore our extensive network of leading travel operator partners
            </Text>
          </VStack>

          {/* Partners Grid */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} w="full">
            {partners.map((partner, index) => (
              <Card
                key={partner.name}
                bg={cardBg}
                border="1px solid"
                borderColor={borderColor}
                p={6}
                transition="all 0.3s"
                _hover={{
                  transform: 'translateY(-4px)',
                  shadow: 'lg',
                  borderColor: 'blue.300'
                }}
              >
                <VStack spacing={4} align="start">
                  <Text fontWeight="bold" color={textColor} fontSize="lg">
                    {partner.name}
                  </Text>
                  
                  <HStack spacing={2}>
                    <HStack spacing={1}>
                      <Icon as={StarSolidIcon} className="w-4 h-4 text-yellow-400" />
                      <Text fontSize="sm" color={mutedTextColor}>
                        {partner.rating}
                      </Text>
                    </HStack>
                    <Text fontSize="sm" color={mutedTextColor}>
                      ({partner.reviews} reviews)
                    </Text>
                  </HStack>
                </VStack>
              </Card>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};
