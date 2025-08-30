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
import { useTranslation } from '../i18n';
import { useWhatsApp, usePageHero } from '../hooks/useQueries';
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
  Image
} from '@chakra-ui/react';

export function ContactPage() {
  const { t } = useTranslation();
  const { getWhatsAppUrl, whatsappNumber } = useWhatsApp();
  const { data: hero } = usePageHero('contact');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 2000);
  };

  const contactInfo = [
    {
      icon: EnvelopeIcon,
      title: t('contact.info.email.title', 'Email'),
      details: ["info@threadtravels.mv"],
      description: t('contact.info.email.description', 'Send us an email anytime'),
      action: t('contact.info.email.action', 'Send Email'),
      actionUrl: "mailto:info@threadtravels.mv"
    },
    {
      icon: PhoneIcon,
      title: t('contact.info.phone.title', 'Phone'),
      details: [whatsappNumber],
      description: t('contact.info.phone.description', 'Call us for immediate assistance'),
      action: t('contact.info.phone.action', 'Call Now'),
      actionUrl: `tel:${whatsappNumber}`
    },
    {
      icon: MapPinIcon,
      title: t('contact.info.address.title', 'Address'),
      details: ["Male, Maldives"],
      description: t('contact.info.address.description', 'Visit our office'),
      action: t('contact.info.address.action', 'Get Directions'),
      actionUrl: "https://maps.google.com/?q=Male,Maldives"
    }
  ];

  const faqs = [
    {
      question: t('contact.faq.booking.question', 'How do I book a package?'),
      answer: t('contact.faq.booking.answer', "You can book packages through WhatsApp, email, or by calling us directly. We'll guide you through the entire process.")
    },
    {
      question: t('contact.faq.inclusions.question', "What's included in the travel packages?"),
      answer: t('contact.faq.inclusions.answer', 'Our packages typically include accommodation, some meals, transportation, and guided activities. Specific inclusions vary by package.')
    },
    {
      question: t('contact.faq.transfers.question', 'Do you offer airport transfers?'),
      answer: t('contact.faq.transfers.answer', 'Yes, we can arrange airport transfers for most packages. This service is often included in our packages.')
    },
    {
      question: t('contact.faq.bestTime.question', "What's the best time to visit the Maldives?"),
      answer: t('contact.faq.bestTime.answer', 'The Maldives is a year-round destination, but the best weather is typically from November to April during the dry season.')
    }
  ];

  return (
    <Box bg="gray.50" className="bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Background Image (Admin-controlled) */}
        <Box position="absolute" top={0} left={0} right={0} bottom={0}>
          <Image
            src={hero?.image_url || '/src/assets/images/ishan115.jpg'}
            alt={hero?.title || 'Maldives Contact Background'}
            w="full"
            h="full"
            objectFit="cover"
          />
          <Box position="absolute" top={0} left={0} right={0} bottom={0} bg={`blackAlpha.${Math.round((hero?.overlay_opacity ?? 0.6) * 100)}`} />
        </Box>
        
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
              {t('contact.hero.badge', 'Get in Touch')}
            </Badge>
            
            <Heading size="2xl" className="text-5xl md:text-6xl font-bold text-white">
              {hero?.title || t('contact.hero.title', 'Contact Us')}
            </Heading>
            
            <Text className="text-xl text-blue-200 max-w-4xl mx-auto leading-relaxed">
              {hero?.subtitle || t('contact.hero.subtitle', "Ready to start your Maldives adventure? We're here to help you plan the perfect trip. Get in touch with us through any of the channels below.")}
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
                  {t('contact.hero.whatsapp', 'WhatsApp Us')}
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
                {t('contact.hero.sendMessage', 'Send Message')}
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
              <Text fontSize="sm" fontWeight="medium" color="green.800">{t('contact.success.title', 'Message sent successfully!')}</Text>
              <Text fontSize="sm" color="green.700">{t('contact.success.message', "We'll get back to you within 24 hours.")}</Text>
            </Box>
          </HStack>
        </Box>
      )}

             {/* FAQ Section - Improved Mobile */}
       <Box mt={{ base: 12, sm: 16, lg: 20 }}>
         <Container maxW="7xl" px={4}>
           <VStack alignItems="center" mb={{ base: 8, sm: 12 }}>
             <Text fontSize={{ base: "2xl", sm: "3xl", lg: "4xl" }} fontWeight="bold" color="gray.900" mb={4}>{t('contact.faq.title', 'Frequently Asked Questions')}</Text>
             <Text fontSize={{ base: "base", sm: "lg" }} color="gray.600" maxW="3xl" mx="auto">
               {t('contact.faq.subtitle', 'Find quick answers to common questions about our services and the Maldives.')}
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