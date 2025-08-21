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
  GiftIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { PackageCard } from '../ui/PackageCard';
import { Link } from 'react-router-dom';

interface PackagesSectionProps {
  packages: any[];
  homepageContent?: any;
}

export const PackagesSection: React.FC<PackagesSectionProps> = ({ packages, homepageContent }) => {
  return (
    <section className="travel-packages-section py-24 bg-gradient-to-br from-white to-blue-50 relative">
      <Container maxW="7xl">
        <VStack spacing={16} mb={16} textAlign="center">
          <Badge 
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-full text-sm font-bold"
          >
            <Icon as={GiftIcon} className="w-4 h-4 mr-2" />
            {homepageContent?.packages_section?.badge_text || 'Curated Experiences'}
          </Badge>
          
          <Heading size="2xl" className="text-5xl md:text-6xl font-bold text-gray-900 drop-shadow-sm">
            {homepageContent?.packages_section?.title || 'Curated Travel Packages'}
          </Heading>
          
          <Text className="text-xl text-gray-800 max-w-4xl mx-auto leading-relaxed font-medium drop-shadow-sm">
            {homepageContent?.packages_section?.description || 
              'All-inclusive experiences designed to make your Maldives adventure unforgettable. From romantic getaways to family adventures, we have the perfect package for every traveler.'}
          </Text>
        </VStack>

        <Grid 
          templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
          gap={8}
          mb={16}
        >
          {packages.slice(0, 6).map((pkg) => (
            <PackageCard key={pkg.id} package={pkg} />
          ))}
        </Grid>

        {/* View All Packages Button */}
        <Box textAlign="center">
          <Link to="/packages">
            <Button 
              size="lg" 
              bgGradient="linear(to-r, blue.500, indigo.600)"
              color="white"
              px={8}
              py={4}
              fontSize="lg"
              fontWeight="bold"
              borderRadius="full"
              boxShadow="xl"
              _hover={{
                bgGradient: 'linear(to-r, blue.600, indigo.700)',
                boxShadow: 'lg',
                transform: 'scale(1.05)',
              }}
              transition="all 0.3s ease"
            >
              <Icon as={GiftIcon} className="w-5 h-5 mr-2" />
              {homepageContent?.packages_section?.cta_text || 'View All Packages'}
              <Icon as={ArrowRightIcon} className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </Box>
      </Container>
    </section>
  );
}; 