import React from 'react';
import { MagnifyingGlassIcon, SparklesIcon, GlobeAltIcon, MapIcon, ArrowRightIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { PropertyCard } from './ui/PropertyCard';
import { useProperties } from '../hooks/useQueries';
import { LoadingSpinner } from './LoadingSpinner';
import { ComponentErrorBoundary } from './SimpleErrorBoundary';
import { SEO } from './SEO';
import { getWhatsAppUrl } from '../config';
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Button,
  Badge,
  Icon,
  useColorModeValue,
  Heading,
} from '@chakra-ui/react';

export function PropertyListPage() {
  const { data: properties, isLoading, error } = useProperties();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading properties</h3>
          <p className="text-gray-600">{error?.message || 'Unknown error'}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Properties - Find Your Perfect Stay"
        description="Browse our collection of luxury properties and accommodations in the Maldives"
        keywords="properties, accommodation, hotels, resorts, Maldives"
      />
      
      <ComponentErrorBoundary componentName="PropertyListPage">
        <Box bg="gray.50" className="bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
          {/* Hero Section */}
          <section className="py-24 bg-gradient-to-r from-blue-800 via-indigo-800 to-blue-900 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 animate-float">
                <Icon as={SparklesIcon} className="w-16 h-16 text-white" />
              </div>
              <div className="absolute top-20 right-20 animate-float-delayed">
                <Icon as={GlobeAltIcon} className="w-12 h-12 text-white" />
              </div>
              <div className="absolute bottom-20 left-20 animate-float-slow">
                <Icon as={MapIcon} className="w-20 h-20 text-white" />
              </div>
            </div>
            
            <Container maxW="7xl" className="relative z-10 text-center px-4">
              <VStack spacing={8}>
                <Badge 
                  className="bg-white/20 backdrop-blur-md text-white px-6 py-2 rounded-full text-sm font-bold border border-white/30"
                >
                  <Icon as={SparklesIcon} className="w-4 h-4 mr-2" />
                  Luxury Accommodations
                </Badge>
                
                <Heading size="2xl" className="text-5xl md:text-6xl font-bold text-white">
                  Our Properties
                </Heading>
                
                <Text className="text-xl text-blue-200 max-w-4xl mx-auto leading-relaxed">
                  Discover amazing accommodations for your perfect getaway. From luxury resorts to cozy guesthouses, 
                  find the perfect place to stay in the Maldives.
                </Text>

                <HStack spacing={6} flexDir={{ base: "column", sm: "row" }} justify="center" align="center">
                  <a href={getWhatsAppUrl("Hi! I need help finding the perfect property in the Maldives")} target="_blank" rel="noopener noreferrer">
                    <Button 
                      size="lg"
                      bg="green.500"
                      _hover={{ bg: "green.600", shadow: "0 0 30px rgba(34, 197, 94, 0.4)", scale: 1.05 }}
                      color="white"
                      px={8}
                      py={4}
                      fontSize="lg"
                      fontWeight="bold"
                      borderRadius="full"
                      shadow="2xl"
                      transition="all 0.3s"
                      transform="auto"
                      display="flex"
                      alignItems="center"
                    >
                      <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Get Expert Advice
                      <Icon as={ArrowRightIcon} className="w-5 h-5 ml-2" />
                    </Button>
                  </a>
                  <Button 
                    size="lg"
                    variant="outline"
                    border="2px solid"
                    borderColor="white"
                    color="white"
                    _hover={{ bg: "white", color: "blue.600", scale: 1.05 }}
                    px={8}
                    py={4}
                    fontSize="lg"
                    fontWeight="bold"
                    borderRadius="full"
                    transition="all 0.3s"
                    transform="auto"
                    backdropFilter="blur(4px)"
                    display="flex"
                    alignItems="center"
                    onClick={() => {
                      const element = document.getElementById('properties-grid');
                      element?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    <Icon as={InformationCircleIcon} className="w-6 h-6 mr-3" />
                    Browse Properties
                    <Icon as={ArrowRightIcon} className="w-5 h-5 ml-2" />
                  </Button>
                </HStack>
              </VStack>
            </Container>
          </section>

          {/* Properties Grid */}
          <div id="properties-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {!properties || properties.length === 0 ? (
              <div className="text-center py-12">
                <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
                <p className="text-gray-600">Check back later for new listings.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                  />
                ))}
              </div>
            )}
          </div>
        </Box>
      </ComponentErrorBoundary>
    </>
  );
} 