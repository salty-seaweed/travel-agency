import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Button,
  Image,
  Grid,
  GridItem,
  Container,
  Heading,
  Badge,
  Icon,
  useColorModeValue,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListIcon,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Progress,
  Spinner,
} from '@chakra-ui/react';
import { 
  MapPinIcon, 
  StarIcon, 
  CheckIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightIcon,
  CalendarIcon,
  UsersIcon,
  PlayIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  SparklesIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  ClockIcon,
  CurrencyDollarIcon,
  CameraIcon,
  WifiIcon,
  BuildingOffice2Icon,
  GiftIcon,
  MapIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon,
  BookOpenIcon,
  SunIcon,
  CloudIcon,
  FireIcon,
  CreditCardIcon,
  LockClosedIcon,
  HeartIcon as HeartSolidIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { useHomepageData } from '../hooks/useQueries';
import { LoadingSpinner } from './index';
import { SEO } from './SEO';
import { PageErrorBoundary } from './SimpleErrorBoundary';
// import { EnhancedSearch } from './EnhancedSearch'; // TEMPORARILY DISABLED
import { usePerformanceMonitor } from '../utils/performanceUtils';
import { config, getWhatsAppUrl } from '../config';
import { PackageCard } from './ui/PackageCard';
import { PropertyCard } from './ui/PropertyCard';
import { useTranslation } from '../i18n';

export const HomePage = React.memo(() => {
  const { properties, packages, isLoading, isError, error } = useHomepageData();
  const { measure } = usePerformanceMonitor('HomePage');
  const { t } = useTranslation();
  const toast = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Hero background images for rotation - Using responsive sizing for better mobile experience
  const heroImages = [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop&crop=center&auto=format&q=80",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&h=800&fit=crop&crop=center&auto=format&q=80",
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=800&fit=crop&crop=center&auto=format&q=80",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&h=800&fit=crop&crop=center&auto=format&q=80",
    "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&h=800&fit=crop&crop=center&auto=format&q=80",
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=800&fit=crop&crop=center&auto=format&q=80",
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=800&fit=crop&crop=center&auto=format&q=80",
    "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=800&fit=crop&crop=center&auto=format&q=80",
  ];

  // Rotate hero images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Measure successful render only once when component mounts
  useEffect(() => {
    if (!isLoading && !isError) {
      measure('render-complete');
    }
  }, [isLoading, isError, measure]);

  // Handle loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <VStack spacing={6}>
          <Spinner size="xl" color="blue.500" thickness="4px" />
          <Text className="text-lg text-gray-600 font-medium">Loading your dream destinations...</Text>
        </VStack>
      </div>
    );
  }

  // Handle error state
  if (isError) {
    return (
      <PageErrorBoundary pageName="Homepage">
        <div className="min-h-screen flex items-center justify-center bg-red-50">
          <VStack textAlign="center" spacing={6} maxW="md">
            <Icon as={ExclamationTriangleIcon} className="w-16 h-16 text-red-500" />
            <Heading size="2xl" color="gray.900">Failed to Load Homepage</Heading>
            <Text color="gray.600">
              {error?.message || 'Something went wrong. Please try again.'}
            </Text>
            <Button 
              onClick={() => window.location.reload()}
              colorScheme="blue"
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
            >
              <Icon as={ArrowPathIcon} className="w-5 h-5 mr-2" />
              Reload Page
            </Button>
          </VStack>
        </div>
      </PageErrorBoundary>
    );
  }

  return (
    <>
      <SEO 
        title="Thread Travels & Tours - Your Trusted Maldives Travel Partner"
        description="Discover the best properties and travel packages in the Maldives. We connect you with authentic local accommodations and unforgettable experiences."
        keywords="Maldives travel, property booking, local accommodation, island hopping, Thread Travels"
      />
      
      <Box bg="gray.50">
        {/* Hero Section with Dynamic Background */}
        <section className="hero-section relative h-screen flex items-center justify-center overflow-hidden" style={{ height: '100vh', maxHeight: '100vh', minHeight: '100vh' }}>
          {/* Bottom fade transition to prevent visual artifacts */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent z-10"></div>
          {/* Dynamic Background Images */}
          <div className="absolute inset-0 overflow-hidden">
            {heroImages.map((image, index) => {
              // Create responsive image URLs for different screen sizes
              const baseUrl = image.split('?')[0];
              const mobileUrl = `${baseUrl}?w=800&h=600&fit=crop&crop=center&auto=format&q=80`;
              const tabletUrl = `${baseUrl}?w=1200&h=800&fit=crop&crop=center&auto=format&q=80`;
              const desktopUrl = `${baseUrl}?w=1920&h=1080&fit=crop&crop=center&auto=format&q=80`;
              
              return (
                <img 
                  key={index}
                  src={desktopUrl}
                  srcSet={`${mobileUrl} 800w, ${tabletUrl} 1200w, ${desktopUrl} 1920w`}
                  sizes="100vw"
                  alt={`Maldives Paradise ${index + 1}`}
                  className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ${
                    index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    objectPosition: 'center center',
                    minWidth: '100%',
                    minHeight: '100%',
                    width: '100%',
                    height: '100%',
                    willChange: 'opacity'
                  }}
                  loading="eager"
                  onLoad={(e) => {
                    // Ensure image is properly sized after load
                    const img = e.target as HTMLImageElement;
                    img.style.objectFit = 'cover';
                    img.style.objectPosition = 'center center';
                  }}
                />
              );
            })}
            {/* Stable overlay gradient - prevents color shifting during resize */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/60 via-blue-800/50 to-indigo-900/60 gradient-overlay"></div>
            <div className="absolute inset-0 bg-black/30 gradient-overlay"></div>
          </div>



          {/* Hero Content */}
          <Container maxW="7xl" className="relative z-10 text-center text-white px-4 h-full flex items-center justify-center">
            <VStack spacing={{ base: 4, md: 6, lg: 8 }} className="w-full max-w-4xl">
              <VStack spacing={{ base: 4, md: 5, lg: 6 }} className="animate-fade-in">
                <Heading 
                  size="2xl" 
                  className="text-6xl md:text-8xl font-bold leading-tight animate-slide-up"
                >
                  Discover Your
                  <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent animate-pulse">
                    Maldives Paradise
                  </span>
                </Heading>
                

              </VStack>

              {/* CTA Buttons */}
              <HStack spacing={6} flexDir={{ base: "column", sm: "row" }} justify="center" align="center" className="animate-slide-up-delayed">
                <Link to="/packages">
                  <Button 
                    size="lg" 
                    bgGradient="linear(to-r, green.500, emerald.600)"
                    color="white"
                    px={10}
                    py={6}
                    fontSize="xl"
                    fontWeight="bold"
                    borderRadius="full"
                    boxShadow="2xl"
                    _hover={{
                      bgGradient: 'linear(to-r, green.600, emerald.700)',
                      boxShadow: 'lg',
                      transform: 'scale(1.05)',
                    }}
                    transition="all 0.3s ease"
                  >
                    <Icon as={GiftIcon} className="w-7 h-7 mr-3" />
                    Explore Packages
                    <Icon as={ArrowRightIcon} className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/properties">
                  <Button 
                    size="lg" 
                    variant="outline"
                    border="3px solid"
                    borderColor="white"
                    color="white"
                    px={10}
                    py={6}
                    fontSize="xl"
                    fontWeight="bold"
                    borderRadius="full"
                    transition="all 0.3s ease"
                    _hover={{
                      bg: 'white',
                      color: 'blue.900',
                      transform: 'scale(1.05)',
                    }}
                    backdropFilter="blur(4px)"
                  >
                    <Icon as={BuildingOffice2Icon} className="w-7 h-7 mr-3" />
                    View Properties
                    <Icon as={ArrowRightIcon} className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </HStack>


            </VStack>
          </Container>

          {/* Scroll Indicator */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
            <VStack spacing={2}>
              <Text className="text-white/70 text-sm font-medium">Scroll to explore</Text>
              <Icon as={ArrowDownIcon} className="w-6 h-6 text-white" />
            </VStack>
          </div>
        </section>

        {/* Search Section - Moved from Hero - TEMPORARILY HIDDEN */}
        {/* <section className="py-12 bg-white border-b border-gray-100">
          <Container maxW="7xl">
            <VStack spacing={8}>
              <Text className="text-2xl font-semibold text-gray-800 text-center">
                Find Your Perfect Maldives Experience
              </Text>
              <div className="w-full max-w-4xl mx-auto">
                <Card className="bg-white border border-gray-200 shadow-lg">
                  <CardBody className="p-6">
                    <EnhancedSearch />
                  </CardBody>
                </Card>
              </div>
            </VStack>
          </Container>
        </section> */}

        {/* Travel Packages Section - PRIORITY */}
        <section className="travel-packages-section py-24 bg-gradient-to-br from-white to-gray.50 relative">
          {/* Smooth transition overlay to prevent visual artifacts */}
          <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-transparent to-white"></div>
          <Container maxW="7xl">
            <VStack spacing={16} mb={16} textAlign="center">
              <Badge 
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-full text-sm font-bold"
              >
                <Icon as={GiftIcon} className="w-4 h-4 mr-2" />
                Curated Experiences
              </Badge>
              
              <Heading size="2xl" className="text-5xl md:text-6xl font-bold text-gray-900">
                Curated Travel Packages
              </Heading>
              
              <Text className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                All-inclusive experiences designed to make your Maldives adventure unforgettable. 
                From romantic getaways to family adventures, we have the perfect package for every traveler.
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

            <div className="text-center">
              <Link to="/packages">
                <Button 
                  size="lg" 
                  variant="outline"
                  border="2px solid"
                  borderColor="green.600"
                  color="green.600"
                  px={10}
                  py={4}
                  fontSize="lg"
                  fontWeight="semibold"
                  borderRadius="full"
                  transition="all 0.3s ease"
                  _hover={{
                    bg: 'green.600',
                    color: 'white',
                    transform: 'scale(1.05)',
                  }}
                >
                  <Icon as={ArrowRightIcon} className="w-5 h-5 mr-2" />
                  Explore All Packages
                  <Icon as={ArrowRightIcon} className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </Container>
        </section>

        {/* Featured Properties Section */}
        <section className="py-24 bg-gradient-to-br from-gray.50 to-blue.50">
          <Container maxW="7xl">
            <VStack spacing={16} mb={16} textAlign="center">
              <Badge 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-full text-sm font-bold"
              >
                <Icon as={SparklesIcon} className="w-4 h-4 mr-2" />
                Handpicked Destinations
              </Badge>
              
              <Heading size="2xl" className="text-5xl md:text-6xl font-bold text-gray-900">
                Featured Properties
              </Heading>
              
              <Text className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Handpicked accommodations that offer the perfect blend of luxury, comfort, and authentic Maldivian experience. 
                Each property is carefully selected to ensure your dream vacation becomes reality.
              </Text>
            </VStack>

            <Grid 
              templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
              gap={8}
              mb={16}
            >
              {properties.slice(0, 6).map((property, index) => (
                <div key={property.id} style={{ animationDelay: `${index * 100}ms` }}>
                  <PropertyCard 
                    property={property}
                    className="animate-fade-in"
                  />
                </div>
              ))}
            </Grid>

            <div className="text-center">
              <Link to="/properties">
                <Button 
                  size="lg" 
                  variant="outline"
                  border="2px solid"
                  borderColor="blue.600"
                  color="blue.600"
                  px={10}
                  py={4}
                  fontSize="lg"
                  fontWeight="semibold"
                  borderRadius="full"
                  transition="all 0.3s ease"
                  _hover={{
                    bg: 'blue.600',
                    color: 'white',
                    transform: 'scale(1.05)',
                  }}
                >
                  <Icon as={ArrowRightIcon} className="w-5 h-5 mr-2" />
                  View All Properties
                  <Icon as={ArrowRightIcon} className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </Container>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-24 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100">
          <Container maxW="7xl">
            <VStack spacing={16} mb={16} textAlign="center">
              <Badge 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-full text-sm font-bold"
              >
                <Icon as={HeartIcon} className="w-4 h-4 mr-2" />
                Why Choose Us
              </Badge>
              
              <Heading size="2xl" className="text-5xl md:text-6xl font-bold text-gray-900">
                Why Choose Thread Travels?
              </Heading>
              
              <Text className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                We're not just another travel agency - we're your local experts in the Maldives. 
                Our deep connections and insider knowledge ensure you get the most authentic and memorable experience.
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
              {[
                {
                  icon: MapIcon,
                  title: "Local Expertise",
                  description: "We connect you with authentic local accommodations and experiences in the Maldives",
                  gradient: "from-blue-500 to-indigo-600",
                  delay: "0ms"
                },
                {
                  icon: ShieldCheckIcon,
                  title: "Secure Booking",
                  description: "Safe and reliable booking process for your peace of mind",
                  gradient: "from-green-500 to-emerald-600",
                  delay: "100ms"
                },
                {
                  icon: SparklesIcon,
                  title: "Curated Selection",
                  description: "Carefully selected properties and experiences for your perfect Maldives trip",
                  gradient: "from-indigo-500 to-blue-600",
                  delay: "200ms"
                },
                {
                  icon: ChatBubbleLeftRightIcon,
                  title: "Personal Support",
                  description: "Dedicated assistance to help you plan and enjoy your Maldives adventure",
                  gradient: "from-orange-500 to-red-600",
                  delay: "300ms"
                }
              ].map((feature, index) => (
                <div key={index} className="text-center group hover:-translate-y-4 transition-all duration-500" style={{ animationDelay: feature.delay }}>
                  <Card className="bg-white rounded-3xl p-8 shadow-lg group-hover:shadow-2xl transition-all duration-500 border border-gray-100">
                    <VStack spacing={6}>
                      <div className={`w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <Icon as={feature.icon} className="w-10 h-10 text-white" />
                      </div>
                      <Heading size="lg" className="text-gray-900 font-bold">
                        {feature.title}
                      </Heading>
                      <Text className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </Text>
                    </VStack>
                  </Card>
                </div>
              ))}
            </SimpleGrid>
          </Container>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 animate-float">
              <Icon as={SunIcon} className="w-16 h-16 text-white" />
            </div>
            <div className="absolute top-20 right-20 animate-float-delayed">
              <Icon as={CloudIcon} className="w-12 h-12 text-white" />
            </div>
            <div className="absolute bottom-20 left-20 animate-float-slow">
              <Icon as={FireIcon} className="w-20 h-20 text-white" />
            </div>
            <div className="absolute bottom-10 right-10 animate-float">
              <Icon as={SunIcon} className="w-24 h-24 text-yellow-400" />
            </div>
          </div>
          
          <Container maxW="5xl" className="text-center px-4 relative z-10">
            <VStack spacing={10}>
              <VStack spacing={6}>
                <Badge 
                  className="bg-white/20 backdrop-blur-md text-white px-6 py-2 rounded-full text-sm font-bold border border-white/30"
                >
                  <Icon as={SparklesIcon} className="w-4 h-4 mr-2" />
                  Ready to Start Your Adventure?
                </Badge>
                
                <Heading size="2xl" className="text-5xl md:text-6xl font-bold text-white">
                  Ready to Start Your Maldives Adventure?
                </Heading>
                
                <Text className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                  Start planning your dream Maldives vacation with Thread Travels. 
                  Your perfect island getaway is just a click away.
                </Text>
              </VStack>
              
              <HStack spacing={6} flexDir={{ base: "column", sm: "row" }} justify="center" align="center">
                <a href={getWhatsAppUrl("Hi! I'm interested in planning a Maldives trip")} target="_blank" rel="noopener noreferrer">
                  <Button 
                    size="lg"
                    className="bg-green-500 hover:bg-green-600 text-white px-10 py-6 text-xl font-bold rounded-full shadow-2xl hover:shadow-glow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    <Icon as={ChatBubbleLeftRightIcon} className="w-7 h-7 mr-3" />
                    Chat with Us
                    <Icon as={ArrowRightIcon} className="w-5 h-5 ml-2" />
                  </Button>
                </a>
                <Link to="/packages">
                  <Button 
                    size="lg"
                    variant="outline"
                    className="border-3 border-white text-white hover:bg-white hover:text-blue-600 px-10 py-6 text-xl font-bold rounded-full transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
                  >
                    <Icon as={GiftIcon} className="w-7 h-7 mr-3" />
                    Browse Packages
                    <Icon as={ArrowRightIcon} className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </HStack>
              
              {/* Trust badges */}
              <HStack spacing={8} flexWrap="wrap" justify="center" className="pt-8">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full">
                  <Icon as={LockClosedIcon} className="w-4 h-4 text-green-400" />
                  <Text className="text-white text-sm font-medium">SSL Secured</Text>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full">
                  <Icon as={CreditCardIcon} className="w-4 h-4 text-blue-300" />
                  <Text className="text-white text-sm font-medium">Secure Payments</Text>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full">
                  <Icon as={GlobeAltIcon} className="w-4 h-4 text-purple-300" />
                  <Text className="text-white text-sm font-medium">24/7 Support</Text>
                </div>
              </HStack>
            </VStack>
          </Container>
        </section>
      </Box>
    </>
  );
});

HomePage.displayName = 'HomePage'; 