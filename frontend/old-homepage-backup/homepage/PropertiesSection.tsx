import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Container,
  Heading,
  Badge,
  Grid,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { 
  BuildingOffice2Icon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { PropertyCard } from '../ui/PropertyCard';
import { Link } from 'react-router-dom';

interface PropertiesSectionProps {
  properties: any[];
  homepageContent?: any;
}

export const PropertiesSection: React.FC<PropertiesSectionProps> = ({ properties, homepageContent }) => {
  return (
    <section className="properties-section py-24 bg-gradient-to-br from-gray-50 to-white relative">
      <Container maxW="7xl">
        <VStack spacing={16} mb={16} textAlign="center">
          <Badge 
            className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-bold"
          >
            <Icon as={BuildingOffice2Icon} className="w-4 h-4 mr-2" />
            {homepageContent?.properties_section?.badge_text || 'Luxury Accommodations'}
          </Badge>
          
          <Heading size="2xl" className="text-5xl md:text-6xl font-bold text-gray-900 drop-shadow-sm">
            {homepageContent?.properties_section?.title || 'Luxury Properties'}
          </Heading>
          
          <Text className="text-xl text-gray-800 max-w-4xl mx-auto leading-relaxed font-medium drop-shadow-sm">
            {homepageContent?.properties_section?.description || 
              'Discover handpicked luxury properties in the Maldives. From overwater villas to beachfront resorts, experience the ultimate in comfort and elegance.'}
          </Text>
        </VStack>

        <Grid 
          templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
          gap={8}
          mb={16}
        >
          {properties.slice(0, 6).map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </Grid>

        {/* View All Properties Button */}
        <Box textAlign="center">
          <Link to="/properties">
            <Button 
              size="lg" 
              bgGradient="linear(to-r, purple.500, pink.600)"
              color="white"
              px={8}
              py={4}
              fontSize="lg"
              fontWeight="bold"
              borderRadius="full"
              boxShadow="xl"
              _hover={{
                bgGradient: 'linear(to-r, purple.600, pink.700)',
                boxShadow: 'lg',
                transform: 'scale(1.05)',
              }}
              transition="all 0.3s ease"
            >
              <Icon as={BuildingOffice2Icon} className="w-5 h-5 mr-2" />
              {homepageContent?.properties_section?.cta_text || 'View All Properties'}
              <Icon as={ArrowRightIcon} className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </Box>
      </Container>
    </section>
  );
}; 