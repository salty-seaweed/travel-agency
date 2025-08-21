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
  Icon,
} from '@chakra-ui/react';
import { HeartIcon } from '@heroicons/react/24/outline';

interface FeatureData {
  id?: number;
  title: string;
  description: string;
  icon: string;
  image_url?: string;
  order: number;
  is_active: boolean;
}

interface FeaturesSectionProps {
  features?: FeatureData[];
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = React.memo(({ features = [] }) => {
  // Filter active features and sort by order - memoized for performance
  const activeFeatures = useMemo(() => 
    features
      .filter(feature => feature.is_active)
      .sort((a, b) => a.order - b.order),
    [features]
  );

  // If no features from database, don't render the section
  if (activeFeatures.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-gradient-to-br from-blue-50 to-indigo-50 relative">
      <Container maxW="7xl">
        <VStack spacing={16} mb={16} textAlign="center">
          <Badge 
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-full text-sm font-bold"
          >
            <Icon as={HeartIcon} className="w-4 h-4 mr-2" />
            Why Choose Us
          </Badge>
          
          <Heading size="2xl" className="text-5xl md:text-6xl font-bold text-gray-900 drop-shadow-sm">
            Why Choose Thread Travels?
          </Heading>
          
          <Text className="text-xl text-gray-800 max-w-4xl mx-auto leading-relaxed font-medium drop-shadow-sm">
            We're not just another travel agency - we're your local experts in the Maldives. 
            Our deep connections and insider knowledge ensure you get the most authentic and memorable experience.
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
          {activeFeatures.map((feature, index) => (
            <Box 
              key={feature.id || index} 
              textAlign="center" 
              className="group"
              transform="auto"
              _hover={{ 
                transform: "translateY(-16px)",
                transition: "all 0.5s"
              }}
            >
              <Box 
                bg="white"
                borderRadius="3xl"
                p={8}
                shadow="2xl"
                transition="all 0.5s"
                border="2px solid"
                borderColor="gray.200"
                _groupHover={{ 
                  shadow: "3xl",
                  borderColor: "gray.300"
                }}
                h="320px"
                display="flex"
                flexDirection="column"
              >
                <VStack spacing={4} flex="1" justify="space-between">
                  {/* Icon */}
                  <Box 
                    w="80px" 
                    h="80px" 
                    bgGradient="linear(to-br, blue.500, indigo.600)"
                    borderRadius="2xl"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    transform="auto"
                    _groupHover={{ scale: 1.1 }}
                    transition="transform 0.3s"
                    shadow="lg"
                    flexShrink={0}
                  >
                    <Text fontSize="3xl">{feature.icon}</Text>
                  </Box>
                  
                  {/* Title */}
                  <Heading 
                    size="md" 
                    color="gray.900" 
                    fontWeight="bold"
                    flexShrink={0}
                    noOfLines={2}
                    lineHeight="tight"
                    textAlign="center"
                  >
                    {feature.title}
                  </Heading>
                  
                  {/* Description */}
                  <Text 
                    color="gray.700" 
                    lineHeight="relaxed" 
                    fontWeight="medium"
                    flex="1"
                    noOfLines={4}
                    overflow="hidden"
                    textAlign="center"
                  >
                    {feature.description}
                  </Text>
                </VStack>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      </Container>
    </section>
  );
}); 