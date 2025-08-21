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
  Button,
  HStack,
  useToast,
} from '@chakra-ui/react';
import {
  CurrencyDollarIcon,
  InformationCircleIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightIcon,
  SparklesIcon,
  GlobeAltIcon,
  CalendarIcon,
  MapIcon,
} from '@heroicons/react/24/outline';
import { SEO } from './SEO';
import { PageErrorBoundary } from './SimpleErrorBoundary';
import { getWhatsAppUrl } from '../config';
import { useTranslation } from '../i18n';

// Import sub-components
import { TransferTypesSection } from './transportation/TransferTypesSection';
import { AtollTransfersSection } from './transportation/AtollTransfersSection';
import { TransferGuideSection } from './transportation/TransferGuideSection';
import { TransferPricingSection } from './transportation/TransferPricingSection';
import { TransferFAQSection } from './transportation/TransferFAQSection';
import { TransferBookingSection } from './transportation/TransferBookingSection';
import { FerryTimetablesSection } from './transportation/FerryTimetablesSection';

export const TransportationPage = React.memo(() => {
  useTranslation();
  useToast();

  return (
    <>
      <SEO 
        title="Maldives Transportation & Transfers - Speedboat, Ferry & Seaplane Services"
        description="Comprehensive guide to Maldives transportation including speedboat transfers, ferry schedules, seaplane services, and airport transfers. Book your transfer with Thread Travels."
        keywords="Maldives transportation, speedboat transfers, ferry schedules, seaplane transfers, airport transfers, Maldives transfers, Thread Travels"
      />
      
      <PageErrorBoundary pageName="Transportation">
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
                  Maldives Transportation Guide
                </Badge>
                
                <Heading size="2xl" className="text-5xl md:text-6xl font-bold text-white">
                  Maldives Transportation & Transfers
                </Heading>
                
                <Text className="text-xl text-blue-200 max-w-4xl mx-auto leading-relaxed">
                  Your complete guide to getting around the Maldives. From speedboat transfers to seaplane flights, 
                  we provide comprehensive transportation services to make your island hopping seamless and memorable.
                </Text>

                <HStack spacing={6} flexDir={{ base: "column", sm: "row" }} justify="center" align="center">
                  <a href={getWhatsAppUrl("Hi! I need help with Maldives transportation and transfers")} target="_blank" rel="noopener noreferrer">
                    <Button 
                      size="lg"
                      className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 text-lg font-bold rounded-full shadow-2xl hover:shadow-glow-lg transition-all duration-300 transform hover:scale-105"
                    >
                      <Icon as={ChatBubbleLeftRightIcon} className="w-6 h-6 mr-3" />
                      Book Transfer Now
                      <Icon as={ArrowRightIcon} className="w-5 h-5 ml-2" />
                    </Button>
                  </a>
                  <Button 
                    size="lg"
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-bold rounded-full transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
                    onClick={() => {
                      const element = document.getElementById('transfer-guide');
                      element?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    <Icon as={InformationCircleIcon} className="w-6 h-6 mr-3" />
                    View Transfer Guide
                    <Icon as={ArrowRightIcon} className="w-5 h-5 ml-2" />
                  </Button>
                </HStack>
              </VStack>
            </Container>
          </section>

          {/* Quick Navigation */}
          <section className="py-8 bg-white border-b border-gray-200">
            <Container maxW="7xl">
              <SimpleGrid columns={{ base: 2, md: 5 }} spacing={4}>
                {[
                  { id: 'transfer-types', label: 'Transfer Types', icon: SparklesIcon },
                  { id: 'atoll-transfers', label: 'Atoll Transfers', icon: MapIcon },
                  { id: 'ferry-timetables', label: 'Ferry Timetables', icon: CalendarIcon },
                  { id: 'pricing', label: 'Pricing Guide', icon: CurrencyDollarIcon },
                  { id: 'faq', label: 'FAQ', icon: InformationCircleIcon },
                ].map((item) => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    size="lg"
                    className="flex flex-col items-center justify-center p-4 h-auto text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300"
                    onClick={() => {
                      const element = document.getElementById(item.id);
                      element?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    <Icon as={item.icon} className="w-8 h-8 mb-2" />
                    <Text className="text-sm font-medium">{item.label}</Text>
                  </Button>
                ))}
              </SimpleGrid>
            </Container>
          </section>

          {/* Transfer Types Section */}
          <TransferTypesSection />

          {/* Atoll Transfers Section */}
          <AtollTransfersSection />

          {/* Transfer Guide Section */}
          <TransferGuideSection />

          {/* Ferry Timetables Section */}
          <FerryTimetablesSection />

          {/* Transfer Pricing Section */}
          <TransferPricingSection />

          {/* Transfer FAQ Section */}
          <TransferFAQSection />

          {/* Transfer Booking Section */}
          <TransferBookingSection />
        </Box>
      </PageErrorBoundary>
    </>
  );
});

TransportationPage.displayName = 'TransportationPage'; 