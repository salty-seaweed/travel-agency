import React, { useState, useEffect } from 'react';
import { InteractiveMap, Card, LoadingSpinner } from './index';
import { useNotification } from '../hooks';
import { SEO } from './SEO';
import { getApiUrl, getWhatsAppUrl } from '../config';
import { useTranslation } from '../i18n';
import {
  MapPinIcon,
  BuildingOffice2Icon,
  CurrencyDollarIcon,
  StarIcon,
  SparklesIcon,
  GlobeAltIcon,
  MapIcon,
  ArrowRightIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
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

interface Property {
  id: number;
  name: string;
  description: string;
  price_per_night: number;
  location: {
    latitude: number;
    longitude: number;
    island: string;
    atoll: string;
  };
  property_type: {
    name: string;
  };
  amenities: Array<{
    name: string;
  }>;
  images: Array<{
    image: string;
  }>;
  rating?: number;
  review_count?: number;
  is_featured: boolean;
}

export function MapPage() {
  const { showError } = useNotification();
  const { t } = useTranslation();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch(getApiUrl('properties/'));
        if (response.ok) {
          const data = await response.json();
          setProperties(data.results || data);
        } else {
          showError('Failed to load properties');
        }
      } catch (error) {
        showError('Failed to load properties');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, [showError]);

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Interactive Map - Thread Travels & Tours"
        description="Explore our properties across the Maldives with our interactive map. Find the perfect location for your dream vacation."
        keywords="Maldives map, interactive map, property locations, island resorts, guesthouses Maldives"
      />
      
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
                Interactive Map
              </Badge>
              
              <Heading size="2xl" className="text-5xl md:text-6xl font-bold text-white">
                Explore the Maldives
              </Heading>
              
              <Text className="text-xl text-blue-200 max-w-4xl mx-auto leading-relaxed">
                Discover our handpicked properties across the beautiful islands of the Maldives. 
                Use our interactive map to find the perfect location for your dream vacation.
              </Text>

              <HStack spacing={6} flexDir={{ base: "column", sm: "row" }} justify="center" align="center">
                <a href={getWhatsAppUrl("Hi! I need help finding the perfect location in the Maldives")} target="_blank" rel="noopener noreferrer">
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
                    const element = document.getElementById('map-container');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <Icon as={InformationCircleIcon} className="w-6 h-6 mr-3" />
                  Explore Map
                  <Icon as={ArrowRightIcon} className="w-5 h-5 ml-2" />
                </Button>
              </HStack>
            </VStack>
          </Container>
        </section>

        {/* Map Container */}
        <div id="map-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Map Section */}
            <div className="lg:col-span-2">
              <InteractiveMap
                properties={properties}
                height="700px"
                showFilters={true}
                onPropertyClick={handlePropertyClick}
              />
            </div>

            {/* Property Details Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                {selectedProperty ? (
                  <Card className="p-6">
                    <div className="space-y-4">
                      {/* Property Image */}
                      {selectedProperty.images && selectedProperty.images.length > 0 && (
                        <img
                          src={selectedProperty.images[0].image}
                          alt={selectedProperty.name}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      )}

                      {/* Property Name and Type */}
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {selectedProperty.name}
                        </h3>
                        <div className="flex items-center text-sm text-gray-600">
                          <BuildingOffice2Icon className="w-4 h-4 mr-1" />
                          {selectedProperty.property_type.name}
                        </div>
                      </div>

                      {/* Location */}
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPinIcon className="w-4 h-4 mr-2" />
                        {selectedProperty.location.island}, {selectedProperty.location.atoll}
                      </div>

                      {/* Price and Rating */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <CurrencyDollarIcon className="w-4 h-4 text-green-600 mr-1" />
                          <span className="font-semibold text-green-600">
                            ${selectedProperty.price_per_night}
                          </span>
                          <span className="text-gray-500 text-sm ml-1">/night</span>
                        </div>
                        
                        {selectedProperty.rating && (
                          <div className="flex items-center">
                            <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
                            <span className="text-sm font-medium">{selectedProperty.rating}</span>
                            {selectedProperty.review_count && (
                              <span className="text-gray-500 text-sm ml-1">
                                ({selectedProperty.review_count})
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Featured Badge */}
                      {selectedProperty.is_featured && (
                        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                          ⭐ Featured Property
                        </div>
                      )}

                      {/* Description */}
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {selectedProperty.description}
                      </p>

                      {/* Amenities */}
                      {selectedProperty.amenities && selectedProperty.amenities.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Amenities</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedProperty.amenities.slice(0, 6).map((amenity, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {amenity.name}
                              </span>
                            ))}
                            {selectedProperty.amenities.length > 6 && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                +{selectedProperty.amenities.length - 6} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex space-x-3 pt-4">
                        <button
                          onClick={() => window.location.href = `/properties/${selectedProperty.id}`}
                          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => setSelectedProperty(null)}
                          className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </Card>
                ) : (
                  <Card className="p-6">
                    <div className="text-center">
                      <MapPinIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Select a Property
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Click on any property marker on the map to view details and information about the location.
                      </p>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </div>

          {/* Map Legend */}
          <div className="mt-8">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Map Legend</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center mr-3">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700">Regular Property</span>
                </div>
                
                <div className="flex items-center">
                  <div className="relative">
                    <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border border-white flex items-center justify-center">
                      <svg className="w-1.5 h-1.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </div>
                  <span className="text-sm text-gray-700 ml-3">Featured Property</span>
                </div>
                
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center mr-3">
                    <span className="text-white text-xs font-bold">3</span>
                  </div>
                  <span className="text-sm text-gray-700">Property Cluster</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Box>
    </>
  );
} 