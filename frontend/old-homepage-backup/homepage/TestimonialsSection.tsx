import React, { useMemo } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Heading,
  Badge,
  SimpleGrid,
  Image,
  Icon,
} from '@chakra-ui/react';
import { ChatBubbleLeftRightIcon, StarIcon } from '@heroicons/react/24/outline';

interface TestimonialData {
  id?: number;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar_url?: string;
  order: number;
  is_active: boolean;
}

interface TestimonialsSectionProps {
  testimonials?: TestimonialData[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = React.memo(({ testimonials = [] }) => {
  // Filter active testimonials and sort by order - memoized for performance
  const activeTestimonials = useMemo(() => 
    testimonials
      .filter(testimonial => testimonial.is_active)
      .sort((a, b) => a.order - b.order),
    [testimonials]
  );

  // If no testimonials from database, don't render the section
  if (activeTestimonials.length === 0) {
    return null;
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <section className="py-24 bg-white relative">
      <Container maxW="7xl">
        <VStack spacing={16} mb={16} textAlign="center">
          <Badge 
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-full text-sm font-bold"
          >
            <Icon as={ChatBubbleLeftRightIcon} className="w-4 h-4 mr-2" />
            Customer Reviews
          </Badge>
          
          <Heading size="2xl" className="text-5xl md:text-6xl font-bold text-gray-900 drop-shadow-sm">
            What Our Customers Say
          </Heading>
          
          <Text className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-medium">
            Don't just take our word for it - hear from our satisfied customers about their amazing Maldives experiences.
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
          {activeTestimonials.map((testimonial, index) => (
            <div key={testimonial.id || index} className="group hover:-translate-y-2 transition-all duration-500">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 shadow-xl group-hover:shadow-2xl transition-all duration-500 border border-gray-200 group-hover:border-blue-300 h-full">
                <VStack spacing={6} align="start" h="full">
                  {/* Rating */}
                  <HStack spacing={1}>
                    {renderStars(testimonial.rating)}
                    <Text className="text-sm text-gray-500 ml-2">
                      ({testimonial.rating}/5)
                    </Text>
                  </HStack>

                  {/* Testimonial Content */}
                  <Text className="text-gray-700 leading-relaxed font-medium italic text-lg">
                    "{testimonial.content}"
                  </Text>

                  {/* Customer Info */}
                  <HStack spacing={4} mt="auto">
                    <Box
                      w="60px"
                      h="60px"
                      borderRadius="full"
                      overflow="hidden"
                      bg="gray.200"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      {testimonial.avatar_url ? (
                        <Image
                          src={testimonial.avatar_url}
                          alt={testimonial.name}
                          w="100%"
                          h="100%"
                          objectFit="cover"
                        />
                      ) : (
                        <Text fontSize="xl" color="gray.500" fontWeight="bold">
                          {testimonial.name.charAt(0).toUpperCase()}
                        </Text>
                      )}
                    </Box>
                    
                    <VStack align="start" spacing={1}>
                      <Text className="font-bold text-gray-900">
                        {testimonial.name}
                      </Text>
                      <Text className="text-sm text-gray-600">
                        {testimonial.role} at {testimonial.company}
                      </Text>
                    </VStack>
                  </HStack>
                </VStack>
              </div>
            </div>
          ))}
        </SimpleGrid>
      </Container>
    </section>
  );
}); 