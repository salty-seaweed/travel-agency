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
  CheckBadgeIcon,
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

  // Mock testimonials with profile icons
  const mockTestimonials = [
    {
      name: 'Sarah Johnson',
      location: 'New York, USA',
      rating: 5,
      text: 'Thread Travels made our honeymoon unforgettable! The resort was paradise, the staff amazing, and every detail was perfect. We can\'t wait to come back!',
      avatar: '/images/optimized/medium/ishan74.webp',
      verified: true,
      date: '2 weeks ago'
    },
    {
      name: 'Michael Chen',
      location: 'Singapore',
      rating: 5,
      text: 'Best vacation ever! The multi-island package was incredible - crystal clear waters, amazing food, and seamless transfers. Worth every penny!',
      avatar: '/images/optimized/medium/ishan75.webp',
      verified: true,
      date: '1 month ago'
    },
    {
      name: 'Emma Davis',
      location: 'Sydney, Australia',
      rating: 5,
      text: 'Absolutely stunning! From booking to checkout, everything was smooth. The diving experience was breathtaking. Highly recommend Thread Travels!',
      avatar: '/images/optimized/medium/ishan76.webp',
      verified: true,
      date: '3 weeks ago'
    },
    {
      name: 'James Wilson',
      location: 'London, UK',
      rating: 5,
      text: 'Perfect family vacation! The kids loved the water activities and we enjoyed the luxury resort. Great value for money and excellent customer service.',
      avatar: '/images/optimized/medium/ishan77.webp',
      verified: true,
      date: '1 week ago'
    },
    {
      name: 'Priya Sharma',
      location: 'Mumbai, India',
      rating: 5,
      text: 'Dream come true! The sunset cruise and private beach dinner were magical. Thread Travels took care of everything. 10/10 experience!',
      avatar: '/images/optimized/medium/ishan78.webp',
      verified: true,
      date: '2 months ago'
    },
    {
      name: 'David Martinez',
      location: 'Barcelona, Spain',
      rating: 5,
      text: 'Incredible adventure! The island hopping tour was well planned. Beautiful resorts, friendly staff, and crystal blue waters everywhere. Highly recommended!',
      avatar: '/images/optimized/medium/ishan79.webp',
      verified: true,
      date: '1 month ago'
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
            {displayTestimonials.slice(0, 6).map((testimonial, index) => (
              <Card
                key={index}
                bg={cardBg}
                border="1px solid"
                borderColor={borderColor}
                borderRadius="xl"
                overflow="hidden"
                transition="all 0.3s"
                _hover={{
                  transform: 'translateY(-4px)',
                  shadow: 'xl',
                  borderColor: 'sky.300'
                }}
              >
                <CardBody p={6}>
                  <VStack spacing={4} align="start" h="full">
                    {/* Rating & Verified Badge */}
                    <HStack spacing={2} justify="space-between" w="full">
                      <HStack spacing={1}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Icon
                            key={star}
                            as={StarSolidIcon}
                            className="w-4 h-4 text-yellow-400"
                          />
                        ))}
                      </HStack>
                      {testimonial.verified && (
                        <HStack spacing={1}>
                          <Icon as={CheckBadgeIcon} className="w-4 h-4 text-emerald-500" />
                          <Text fontSize="xs" color="emerald.600" fontWeight="medium">
                            Verified
                          </Text>
                        </HStack>
                      )}
                    </HStack>
                    
                    {/* Testimonial Text */}
                    <Text fontSize="sm" color={mutedTextColor} lineHeight="1.7" flex={1}>
                      "{testimonial.text}"
                    </Text>
                    
                    {/* Author with larger avatar */}
                    <HStack spacing={3} pt={2} borderTop="1px solid" borderColor={borderColor} w="full">
                      <Avatar 
                        size="md" 
                        src={testimonial.avatar}
                        name={testimonial.name}
                        border="2px solid"
                        borderColor="sky.100"
                      />
                      <VStack spacing={0} align="start" flex={1}>
                        <Text fontWeight="bold" color={textColor} fontSize="sm">
                          {testimonial.name}
                        </Text>
                        <Text fontSize="xs" color={mutedTextColor}>
                          {testimonial.location}
                        </Text>
                        {testimonial.date && (
                          <Text fontSize="xs" color="gray.400">
                            {testimonial.date}
                          </Text>
                        )}
                      </VStack>
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
