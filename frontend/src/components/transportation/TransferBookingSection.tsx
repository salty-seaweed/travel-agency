import React from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Badge,
  Icon,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  Button,
  HStack,
  Divider,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  List,
  ListItem,
  ListIcon,
} from '@chakra-ui/react';
import {
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  SparklesIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { config, getWhatsAppUrl } from '../../config';

export const TransferBookingSection = React.memo(() => {
  const bookingSteps = [
    {
      step: 1,
      title: 'Contact Us',
      description: 'Reach out through your preferred method',
      icon: ChatBubbleLeftRightIcon,
      details: [
        'WhatsApp: +960 744-1097',
        'Email: transfers@threadtravels.com',
        'Phone: +960 744-1097',
        'Online form available'
      ]
    },
    {
      step: 2,
      title: 'Provide Details',
      description: 'Share your travel information',
      icon: InformationCircleIcon,
      details: [
        'Flight arrival/departure times',
        'Resort/hotel destination',
        'Number of passengers',
        'Special requirements',
        'Preferred transfer type'
      ]
    },
    {
      step: 3,
      title: 'Receive Quote',
      description: 'Get your personalized pricing',
      icon: ShieldCheckIcon,
      details: [
        'Detailed cost breakdown',
        'Transfer schedule options',
        'Payment instructions',
        'Confirmation details',
        'Emergency contact information'
      ]
    },
    {
      step: 4,
      title: 'Confirm Booking',
      description: 'Secure your transfer reservation',
      icon: CheckCircleIcon,
      details: [
        'Payment processing',
        'Booking confirmation',
        'Transfer details sent',
        'Pre-arrival instructions',
        '24/7 support access'
      ]
    }
  ];

  const contactMethods = [
    {
      method: 'WhatsApp',
      icon: ChatBubbleLeftRightIcon,
      color: 'green',
      contact: '+960 744-1097',
      description: 'Fastest response time, available 24/7',
      response: 'Within 5 minutes'
    },
    {
      method: 'Phone',
      icon: PhoneIcon,
      color: 'blue',
      contact: '+960 744-1097',
      description: 'Direct conversation with our team',
      response: 'Immediate'
    },
    {
      method: 'Email',
      icon: EnvelopeIcon,
      color: 'purple',
      contact: 'transfers@threadtravels.com',
      description: 'Detailed inquiries and documentation',
      response: 'Within 2 hours'
    }
  ];

  const bookingBenefits = [
    {
      benefit: '24/7 Support',
      description: 'Round-the-clock assistance for all your transfer needs',
      icon: ClockIcon,
      color: 'blue'
    },
    {
      benefit: 'Competitive Rates',
      description: 'Best prices guaranteed with transparent pricing',
      icon: ShieldCheckIcon,
      color: 'green'
    },
    {
      benefit: 'Flexible Options',
      description: 'Multiple transfer types and scheduling options',
      icon: SparklesIcon,
      color: 'purple'
    },
    {
      benefit: 'Safety Assured',
      description: 'Licensed operators with full safety equipment',
      icon: CheckCircleIcon,
      color: 'orange'
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-r from-blue-800 via-indigo-800 to-blue-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 animate-float">
          <Icon as={SparklesIcon} className="w-16 h-16 text-white" />
        </div>
        <div className="absolute top-20 right-20 animate-float-delayed">
          <Icon as={UserGroupIcon} className="w-12 h-12 text-white" />
        </div>
        <div className="absolute bottom-20 left-20 animate-float-slow">
          <Icon as={ShieldCheckIcon} className="w-20 h-20 text-white" />
        </div>
      </div>
      
      <Container maxW="7xl" className="relative z-10">
        <VStack spacing={16} mb={16} textAlign="center">
          <Badge 
            className="bg-white/20 backdrop-blur-md text-white px-6 py-2 rounded-full text-sm font-bold border border-white/30"
          >
            <Icon as={SparklesIcon} className="w-4 h-4 mr-2" />
            Book Your Transfer
          </Badge>
          
          <Heading size="2xl" className="text-5xl md:text-6xl font-bold text-white">
            Ready to Book Your Transfer?
          </Heading>
          
          <Text className="text-xl text-white max-w-4xl mx-auto leading-relaxed font-medium">
            Secure your Maldives transfer with Thread Travels. Our simple booking process 
            ensures a smooth and reliable transportation experience.
          </Text>
        </VStack>

        {/* Booking Steps */}
        <VStack spacing={8} mb={16}>
          <VStack spacing={6} textAlign="center">
            <Heading size="xl" className="text-4xl font-bold text-white">
              Simple 4-Step Booking Process
            </Heading>
            <Text className="text-lg text-white max-w-3xl font-medium">
              From initial contact to confirmation, we make booking your transfer effortless
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
            {bookingSteps.map((step) => (
              <Card key={step.step} className="bg-white/10 backdrop-blur-md border-2 border-white/20 hover:border-white/30 transition-all duration-300">
                <CardHeader>
                  <HStack spacing={4}>
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl">
                      {step.step}
                    </div>
                    <VStack align="start" spacing={2}>
                      <Heading size="lg" className="text-white">
                        {step.title}
                      </Heading>
                      <Text className="text-gray-700 font-medium">
                        {step.description}
                      </Text>
                    </VStack>
                  </HStack>
                </CardHeader>
                
                <CardBody className="pt-0">
                  <List spacing={2}>
                    {step.details.map((detail, index) => (
                      <ListItem key={index} className="flex items-start">
                        <ListIcon as={CheckCircleIcon} color="green.400" className="mt-1 mr-3 flex-shrink-0" />
                        <Text className="text-gray-700">{detail}</Text>
                      </ListItem>
                    ))}
                  </List>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </VStack>

        {/* Contact Methods */}
        <VStack spacing={12}>
          <VStack spacing={6} textAlign="center">
            <Heading size="xl" className="text-4xl font-bold text-white">
              Contact Us Today
            </Heading>
            <Text className="text-lg text-white max-w-3xl font-medium">
              Choose your preferred method to get in touch and start planning your transfer
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            {contactMethods.map((method) => (
              <Card key={method.method} className="bg-white/10 backdrop-blur-md border-2 border-white/20 hover:border-white/30 transition-all duration-300 text-center">
                <CardBody className="p-8">
                  <Icon as={method.icon} className={`w-12 h-12 text-${method.color}-400 mx-auto mb-4`} />
                  <Heading size="md" className="text-gray-800 mb-2">
                    {method.method}
                  </Heading>
                  <Text className="text-gray-800 font-bold text-lg mb-2">
                    {method.contact}
                  </Text>
                  <Text className="text-gray-600 text-sm mb-3">
                    {method.description}
                  </Text>
                  <Badge colorScheme={method.color as any} className="text-xs">
                    {method.response}
                  </Badge>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </VStack>

        {/* CTA Buttons */}
        <VStack spacing={6} className="mt-16">
          <HStack spacing={6} flexDir={{ base: "column", sm: "row" }} justify="center" align="center">
            <a href={getWhatsAppUrl("Hi! I need to book a transfer in the Maldives. Can you help me?")} target="_blank" rel="noopener noreferrer">
              <Button 
                size="lg"
                className="bg-green-500 hover:bg-green-600 text-white px-10 py-6 text-xl font-bold rounded-full shadow-2xl hover:shadow-glow-lg transition-all duration-300 transform hover:scale-105"
              >
                <Icon as={ChatBubbleLeftRightIcon} className="w-7 h-7 mr-3" />
                Book via WhatsApp
                <Icon as={ArrowRightIcon} className="w-5 h-5 ml-2" />
              </Button>
            </a>
            <Button 
              size="lg"
              variant="outline"
              className="border-3 border-white text-white hover:bg-white hover:text-blue-600 px-10 py-6 text-xl font-bold rounded-full transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
              onClick={() => {
                const element = document.getElementById('faq');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <Icon as={InformationCircleIcon} className="w-7 h-7 mr-3" />
              View FAQ First
              <Icon as={ArrowRightIcon} className="w-5 h-5 ml-2" />
            </Button>
          </HStack>
        </VStack>

        {/* Benefits */}
        <VStack spacing={12} className="mt-20">
          <VStack spacing={6} textAlign="center">
            <Heading size="xl" className="text-4xl font-bold text-white">
              Why Choose Thread Travels?
            </Heading>
            <Text className="text-lg text-white max-w-3xl font-medium">
              Experience the difference with our professional transfer services
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            {bookingBenefits.map((benefit) => (
              <Card key={benefit.benefit} className="bg-white/10 backdrop-blur-md border-2 border-white/20 text-center">
                <CardBody className="p-6">
                  <Icon as={benefit.icon} className={`w-12 h-12 text-${benefit.color}-400 mx-auto mb-4`} />
                  <Heading size="md" className="text-gray-800 mb-2">
                    {benefit.benefit}
                  </Heading>
                  <Text className="text-gray-600 text-sm">
                    {benefit.description}
                  </Text>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </VStack>

        {/* Important Information */}
        <Alert status="info" className="mt-16 rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
          <AlertIcon />
          <Box>
            <AlertTitle className="text-white">Important Booking Information</AlertTitle>
            <AlertDescription className="text-white">
              All transfers must be booked at least 48 hours in advance. We recommend booking as early as possible 
              to ensure availability and secure the best rates. Our team is available 24/7 to assist with your booking.
            </AlertDescription>
          </Box>
        </Alert>
      </Container>
    </section>
  );
});

TransferBookingSection.displayName = 'TransferBookingSection'; 