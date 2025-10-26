import React from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Heading,
  Badge,
  Button,
  Icon,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { 
  SparklesIcon, 
  ChatBubbleLeftRightIcon, 
  ArrowRightIcon, 
  GiftIcon,
  LockClosedIcon,
  CreditCardIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';
import { config, getWhatsAppUrl } from '../../config';

interface CTAData {
  id?: number;
  title: string;
  subtitle: string;
  description: string;
  cta_primary_text: string;
  cta_primary_url: string;
  cta_secondary_text: string;
  cta_secondary_url: string;
  background_image_url?: string;
  is_active: boolean;
}

interface CTASectionProps {
  ctaData?: CTAData;
}

export const CTASection: React.FC<CTASectionProps> = ({ ctaData }) => {
  // If no CTA data from database, don't render the section
  if (!ctaData || !ctaData.is_active) {
    return null;
  }

  return (
    <section className="py-24 bg-gradient-to-r from-blue-800 via-indigo-800 to-blue-900 relative overflow-hidden">
      {/* Background Image */}
      {ctaData.background_image_url && (
        <div className="absolute inset-0">
          <img
            src={ctaData.background_image_url}
            alt="CTA Background"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
      )}
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 animate-float">
          <Icon as={SparklesIcon} className="w-16 h-16 text-white" />
        </div>
        <div className="absolute top-20 right-20 animate-float-delayed">
          <Icon as={SparklesIcon} className="w-12 h-12 text-white" />
        </div>
        <div className="absolute bottom-20 left-20 animate-float-slow">
          <Icon as={SparklesIcon} className="w-20 h-20 text-white" />
        </div>
        <div className="absolute bottom-10 right-10 animate-float">
          <Icon as={SparklesIcon} className="w-24 h-24 text-yellow-400" />
        </div>
      </div>
      
      <Container maxW="5xl" className="text-center px-4 relative z-10">
        <VStack spacing={10}>
          <VStack spacing={6}>
            <Badge 
              className="bg-white/20 backdrop-blur-md text-white px-6 py-2 rounded-full text-sm font-bold border border-white/30"
            >
              <Icon as={SparklesIcon} className="w-4 h-4 mr-2" />
              {ctaData.subtitle}
            </Badge>
            
            <Heading size="2xl" className="text-5xl md:text-6xl font-bold text-white">
              {ctaData.title}
            </Heading>
            
            <Text className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
              {ctaData.description}
            </Text>
          </VStack>
          
          <HStack spacing={6} flexDir={{ base: "column", sm: "row" }} justify="center" align="center">
            <a href={getWhatsAppUrl("Hi! I'm interested in planning a Maldives trip")} target="_blank" rel="noopener noreferrer">
              <Button 
                size="lg"
                className="bg-green-500 hover:bg-green-600 text-white px-10 py-6 text-xl font-bold rounded-full shadow-2xl hover:shadow-glow-lg transition-all duration-300 transform hover:scale-105"
              >
                <Icon as={ChatBubbleLeftRightIcon} className="w-7 h-7 mr-3" />
                {ctaData.cta_primary_text}
                <Icon as={ArrowRightIcon} className="w-5 h-5 ml-2" />
              </Button>
            </a>
            <Link to={ctaData.cta_secondary_url}>
              <Button 
                size="lg"
                variant="outline"
                className="border-3 border-white text-white hover:bg-white hover:text-blue-600 px-10 py-6 text-xl font-bold rounded-full transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
              >
                <Icon as={GiftIcon} className="w-7 h-7 mr-3" />
                {ctaData.cta_secondary_text}
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
  );
}; 