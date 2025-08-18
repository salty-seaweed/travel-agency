import React, { useState } from 'react';
import { 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  SparklesIcon,
  GlobeAltIcon,
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

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 2000);
  };

  const contactInfo = [
    {
      icon: PhoneIcon,
      title: "Phone",
      details: ["+960 744 1097", "+960 987 6543"],
      description: "Call us for immediate assistance",
      action: "Call Now",
      actionUrl: "tel:+9607441097"
    },
    {
      icon: EnvelopeIcon,
      title: "Email",
      details: ["info@maldives-travel.com", "bookings@maldives-travel.com"],
      description: "Send us an email anytime",
      action: "Send Email",
      actionUrl: "mailto:info@maldives-travel.com"
    },
    {
      icon: MapPinIcon,
      title: "Office",
      details: ["123 Travel Street", "Male, Maldives 20000"],
      description: "Visit our office in Male",
      action: "Get Directions",
      actionUrl: "https://maps.google.com"
    },
    {
      icon: ClockIcon,
      title: "Business Hours",
      details: ["Mon-Fri: 9:00 AM - 6:00 PM", "Sat: 10:00 AM - 4:00 PM"],
      description: "We're here to help you",
      action: "WhatsApp",
      actionUrl: "https://wa.me/9607441097"
    }
  ];

  const faqs = [
    {
      question: "How do I book a property?",
      answer: "You can book properties through WhatsApp, email, or by calling us directly. We'll guide you through the entire process."
    },
    {
      question: "What's included in the travel packages?",
      answer: "Our packages typically include accommodation, some meals, transportation, and guided activities. Specific inclusions vary by package."
    },
    {
      question: "Do you offer airport transfers?",
      answer: "Yes, we can arrange airport transfers for most properties. This service is often included in our packages."
    },
    {
      question: "What's the best time to visit the Maldives?",
      answer: "The Maldives is a year-round destination, but the best weather is typically from November to April during the dry season."
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
              Get in Touch
            </Badge>
            
            <Heading size="2xl" className="text-5xl md:text-6xl font-bold text-white">
              Contact Us
            </Heading>
            
            <Text className="text-xl text-blue-200 max-w-4xl mx-auto leading-relaxed">
              Ready to start your Maldives adventure? We're here to help you plan the perfect trip. 
              Get in touch with us through any of the channels below.
            </Text>

            <HStack spacing={6} flexDir={{ base: "column", sm: "row" }} justify="center" align="center">
              <a href={getWhatsAppUrl("Hi! I'd like to get in touch about planning my Maldives trip")} target="_blank" rel="noopener noreferrer">
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
                  WhatsApp Us
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
                  const element = document.getElementById('contact-form');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Icon as={InformationCircleIcon} className="w-6 h-6 mr-3" />
                Send Message
                <Icon as={ArrowRightIcon} className="w-5 h-5 ml-2" />
              </Button>
            </HStack>
          </VStack>
        </Container>
      </section>

      {/* Success Message */}
      {isSubmitted && (
        <Box
          position="fixed"
          top="4"
          left="4"
          right="4"
          zIndex="50"
          bg="green.50"
          border="1px solid"
          borderColor="green.200"
          borderRadius="lg"
          p="4"
          shadow="lg"
        >
          <HStack alignItems="center">
            <Icon as={CheckCircleIcon} className="h-5 w-5 text-green-600 mr-3" />
            <Box>
              <Text fontSize="sm" fontWeight="medium" color="green.800">Message sent successfully!</Text>
              <Text fontSize="sm" color="green.700">We'll get back to you within 24 hours.</Text>
            </Box>
          </HStack>
        </Box>
      )}

             {/* FAQ Section - Improved Mobile */}
       <Box mt={{ base: 12, sm: 16, lg: 20 }}>
         <Container maxW="7xl" px={4}>
           <VStack alignItems="center" mb={{ base: 8, sm: 12 }}>
             <Text fontSize={{ base: "2xl", sm: "3xl", lg: "4xl" }} fontWeight="bold" color="gray.900" mb={4}>Frequently Asked Questions</Text>
             <Text fontSize={{ base: "base", sm: "lg" }} color="gray.600" maxW="3xl" mx="auto">
               Find quick answers to common questions about our services and the Maldives.
             </Text>
           </VStack>

           <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 4, sm: 6 }}>
             {faqs.map((faq, index) => (
               <Box key={index} bg="white" borderRadius={{ base: "lg", sm: "xl" }} p={4} shadow="sm" border="1px solid" borderColor="gray.200">
                 <Text fontSize={{ base: "lg", sm: "xl" }} fontWeight="semibold" color="gray.900" mb={3}>{faq.question}</Text>
                 <Text fontSize={{ base: "sm", sm: "base" }} color="gray.600" lineHeight="relaxed">{faq.answer}</Text>
               </Box>
             ))}
           </SimpleGrid>
         </Container>
       </Box>
    </Box>
  );
}

export default ContactPage; 