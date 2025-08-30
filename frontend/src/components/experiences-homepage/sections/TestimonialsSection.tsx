import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Container,
  Heading,
  Avatar,
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

interface TestimonialsSectionProps {
  testimonials?: any[];
}

export const ExperiencesTestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  testimonials = []
}) => {
  const { t } = useTranslation();
  
  // Color mode values
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.300');

  // Mock testimonials
  const mockTestimonials = [
    {
      name: 'Sarah Johnson',
      location: 'New York, USA',
      rating: 5,
      text: 'Amazing experience! The tour was perfectly organized and the guides were incredibly knowledgeable.',
      avatar: '/src/assets/images/ishan74.jpg'
    },
    {
      name: 'Michael Chen',
      location: 'London, UK',
      rating: 5,
      text: 'Absolutely breathtaking views and excellent service. Highly recommend!',
      avatar: '/src/assets/images/ishan75.jpg'
    },
    {
      name: 'Emma Davis',
      location: 'Sydney, Australia',
      rating: 5,
      text: 'The best travel experience I\'ve ever had. Everything exceeded my expectations.',
      avatar: '/src/assets/images/ishan76.jpg'
    }
  ];

  const displayTestimonials = testimonials.length > 0 ? testimonials : mockTestimonials;

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
              {t('homepage.testimonials.title', 'What Our Travelers Say')}
            </Heading>
            <Text
              fontSize="lg"
              color={mutedTextColor}
              maxW="2xl"
              lineHeight="1.6"
            >
              {t('homepage.testimonials.subtitle', 'Read reviews from thousands of happy customers worldwide')}
            </Text>
          </VStack>

          {/* Testimonials Grid */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} w="full">
            {displayTestimonials.map((testimonial, index) => (
              <Card
                key={index}
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
                  {/* Rating */}
                  <HStack spacing={1}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Icon
                        key={star}
                        as={StarSolidIcon}
                        className="w-5 h-5 text-yellow-400"
                      />
                    ))}
                  </HStack>
                  
                  {/* Testimonial Text */}
                  <Text fontSize="sm" color={mutedTextColor} lineHeight="1.6">
                    "{testimonial.text}"
                  </Text>
                  
                  {/* Author */}
                  <HStack spacing={3}>
                    <Avatar size="sm" src={testimonial.avatar} />
                    <VStack spacing={0} align="start">
                      <Text fontWeight="semibold" color={textColor} fontSize="sm">
                        {testimonial.name}
                      </Text>
                      <Text fontSize="xs" color={mutedTextColor}>
                        {testimonial.location}
                      </Text>
                    </VStack>
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
