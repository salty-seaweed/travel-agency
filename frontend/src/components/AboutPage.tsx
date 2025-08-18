import React from 'react';
import { 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  StarIcon,
  UsersIcon,
  GlobeAltIcon,
  HeartIcon,
  SparklesIcon,
  MapIcon,
  ArrowRightIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
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
  SimpleGrid,
  Heading,
} from '@chakra-ui/react';

export function AboutPage() {
  const stats = [
    { number: "500+", label: "Happy Travelers", icon: UsersIcon },
    { number: "50+", label: "Properties", icon: GlobeAltIcon },
    { number: "4.8", label: "Average Rating", icon: StarIcon },
    { number: "5+", label: "Years Experience", icon: HeartIcon }
  ];

  const values = [
    {
      title: "Authentic Experiences",
      description: "We believe in providing genuine, local experiences that connect travelers with the true essence of the Maldives.",
      icon: "🌊"
    },
    {
      title: "Quality Assurance",
      description: "Every property and package is personally verified to ensure the highest standards of quality and service.",
      icon: "⭐"
    },
    {
      title: "Sustainable Tourism",
      description: "We're committed to promoting responsible tourism that preserves the natural beauty of the Maldives.",
      icon: "🌿"
    },
    {
      title: "Customer First",
      description: "Your satisfaction is our priority. We go above and beyond to create memorable experiences.",
      icon: "❤️"
    }
  ];

  return (
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
              About Thread Travels
            </Badge>
            
            <Text fontSize={{ base: "5xl", md: "6xl" }} fontWeight="bold" color="white">
              About Maldives Travel
            </Text>
            
            <Text fontSize="xl" color="white" maxW="4xl" mx="auto" lineHeight="relaxed">
              Your trusted partner in discovering the magic of the Maldives. We specialize in creating unforgettable travel experiences 
              that connect you with the beauty and culture of this paradise destination.
            </Text>

            <HStack spacing={6} flexDir={{ base: "column", sm: "row" }} justify="center" align="center">
              <a href={getWhatsAppUrl("Hi! I'd like to learn more about Thread Travels and your services")} target="_blank" rel="noopener noreferrer">
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
                  Get in Touch
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
                  const element = document.getElementById('our-story');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Icon as={InformationCircleIcon} className="w-6 h-6 mr-3" />
                Learn More
                <Icon as={ArrowRightIcon} className="w-5 h-5 ml-2" />
              </Button>
            </HStack>
          </VStack>
        </Container>
      </section>

      {/* Stats Section */}
      <Box py={16} bg="gray.50">
        <Container maxW="7xl" px={4}>
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={8}>
            {stats.map((stat, index) => (
              <Box key={index} textAlign="center">
                <Box w={16} h={16} bg="blue.100" borderRadius="full" display="flex" alignItems="center" justifyContent="center" mx="auto" mb={4}>
                  <Icon as={stat.icon} h={8} w={8} color="blue.600" />
                </Box>
                <Text fontSize="3xl" fontWeight="bold" color="gray.900" mb={2}>{stat.number}</Text>
                <Text color="gray.600">{stat.label}</Text>
              </Box>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Story Section */}
      <section id="our-story" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-lg text-gray-600 mb-6">
                Founded with a passion for showcasing the authentic beauty of the Maldives, we've been connecting travelers with extraordinary experiences since our inception. Our journey began with a simple mission: to make the magic of the Maldives accessible to everyone.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                We believe that every traveler deserves to experience the pristine beaches, crystal-clear waters, and warm hospitality that make the Maldives truly special. That's why we've built relationships with the best local properties and created packages that offer genuine value.
              </p>
              <p className="text-lg text-gray-600">
                Today, we're proud to be your trusted partner in discovering the hidden gems and popular destinations of the Maldives, ensuring every trip is memorable and meaningful.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop"
                alt="Maldives Travel Story"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do and every experience we create.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Maldives Travel?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're not just another travel agency. Here's what makes us special.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <MapPinIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Local Expertise</h3>
              <p className="text-gray-600">Our team has deep local knowledge and connections throughout the Maldives.</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <StarIcon className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Verified Properties</h3>
              <p className="text-gray-600">Every property is personally visited and verified for quality and safety.</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <PhoneIcon className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-600">Round-the-clock support to ensure your trip goes smoothly.</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <HeartIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Personalized Service</h3>
              <p className="text-gray-600">Customized itineraries tailored to your preferences and budget.</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <GlobeAltIcon className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sustainable Tourism</h3>
              <p className="text-gray-600">We promote responsible tourism that benefits local communities.</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <EnvelopeIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Transparent Pricing</h3>
              <p className="text-gray-600">No hidden fees or surprises. Clear, upfront pricing for all services.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your Maldives Adventure?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Let us help you create memories that will last a lifetime in paradise.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/properties"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Browse Properties
            </a>
            <a
              href="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </Box>
  );
} 