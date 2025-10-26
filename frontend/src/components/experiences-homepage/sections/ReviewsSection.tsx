import React from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useTranslation } from '../../../i18n';
import GoogleReviews from '../../GoogleReviews';

export const ExperiencesReviewsSection: React.FC = () => {
  const { t } = useTranslation();
  
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.300');

  return (
    <Box bg={bgColor} py={16}>
      <Container maxW="7xl">
        <VStack spacing={12}>
          <VStack spacing={4} textAlign="center">
            <Heading size="xl" color={textColor} fontWeight="bold">
              {t('homepage.reviews.title', 'What Our Travelers Say')}
            </Heading>
            <Text fontSize="lg" color={mutedTextColor} maxW="2xl" lineHeight="1.6">
              {t('homepage.reviews.subtitle', 'Real experiences from travelers who have booked with Thread Travels')}
            </Text>
          </VStack>

          <GoogleReviews 
            maxReviews={6}
            showHeader={false}
            compact={false}
            className="w-full"
          />
        </VStack>
      </Container>
    </Box>
  );
};
