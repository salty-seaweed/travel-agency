import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Badge,
  Icon,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  HStack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Skeleton,
  Button,
} from '@chakra-ui/react';
import {
  InformationCircleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  UserGroupIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { config } from '../../config';

// Icon mapping for dynamic icons
const iconMap: { [key: string]: any } = {
  'InformationCircleIcon': InformationCircleIcon,
  'ExclamationTriangleIcon': ExclamationTriangleIcon,
  'CheckCircleIcon': CheckCircleIcon,
  'ClockIcon': ClockIcon,
  'CurrencyDollarIcon': CurrencyDollarIcon,
  'MapPinIcon': MapPinIcon,
  'UserGroupIcon': UserGroupIcon,
  'SparklesIcon': SparklesIcon,
};

interface TransferFAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  icon: string;
  is_active: boolean;
  order: number;
}

export const TransferFAQSection = React.memo(() => {
  const [faqs, setFaqs] = useState<TransferFAQ[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${config.apiBaseUrl}/transportation/`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setFaqs(data.faqs || []);
      } catch (err) {
        console.error('Failed to fetch FAQs:', err);
        setError('Failed to load FAQ information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(faqs.map(faq => faq.category)))];

  // Filter FAQs by selected category
  const filteredFaqs = selectedCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  if (loading) {
    return (
      <section className="py-24 bg-gradient-to-br from-purple-50 to-pink-50">
        <Container maxW="7xl">
          <VStack spacing={16} mb={16} textAlign="center">
            <Skeleton height="40px" width="300px" />
            <Skeleton height="60px" width="600px" />
            <Skeleton height="24px" width="800px" />
          </VStack>
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={12}>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} height="60px" />
            ))}
          </SimpleGrid>
          <Skeleton height="400px" />
        </Container>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-24 bg-gradient-to-br from-purple-50 to-pink-50">
        <Container maxW="7xl">
          <Alert status="error" className="rounded-xl">
            <AlertIcon />
            <Box>
              <AlertTitle>Error Loading FAQ Information</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Box>
          </Alert>
        </Container>
      </section>
    );
  }

  if (faqs.length === 0) {
    return (
      <section className="py-24 bg-gradient-to-br from-purple-50 to-pink-50">
        <Container maxW="7xl">
          <Alert status="info" className="rounded-xl">
            <AlertIcon />
            <Box>
              <AlertTitle>No FAQ Information Available</AlertTitle>
              <AlertDescription>
                FAQ information is currently being updated. Please check back later or contact us directly for assistance.
              </AlertDescription>
            </Box>
          </Alert>
        </Container>
      </section>
    );
  }

  return (
    <section id="faq" className="py-24 bg-gradient-to-br from-purple-50 to-pink-50">
      <Container maxW="7xl">
        <VStack spacing={16} mb={16} textAlign="center">
          <Badge 
            className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-bold"
          >
            <Icon as={InformationCircleIcon} className="w-4 h-4 mr-2" />
            Frequently Asked Questions
          </Badge>
          
          <Heading size="2xl" className="text-5xl md:text-6xl font-bold text-gray-900">
            Transfer FAQ
          </Heading>
          
          <Text className="text-xl text-gray-800 max-w-4xl mx-auto leading-relaxed">
            Find answers to common questions about transportation and transfers in the Maldives. 
            Everything you need to know for a smooth travel experience.
          </Text>
        </VStack>

        {/* Category Filter */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={12}>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "solid" : "outline"}
              size="lg"
              className={`flex flex-col items-center justify-center p-4 h-auto rounded-xl transition-all duration-300 ${
                selectedCategory === category 
                  ? 'bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-xl' 
                  : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50 border-2 border-gray-200 hover:border-purple-300'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              <Text className="text-sm font-bold capitalize">
                {category === 'all' ? 'All Questions' : category}
              </Text>
            </Button>
          ))}
        </SimpleGrid>

        {/* FAQ Accordion */}
        <Card className="shadow-2xl border-2 border-gray-200">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-700 text-white">
            <HStack spacing={4}>
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Icon as={InformationCircleIcon} className="w-8 h-8 text-white" />
              </div>
              <VStack align="start" spacing={2}>
                <Heading size="lg" className="text-white">
                  Transfer FAQ
                </Heading>
                <Text className="text-purple-100">
                  {filteredFaqs.length} question{filteredFaqs.length !== 1 ? 's' : ''} in {selectedCategory === 'all' ? 'all categories' : selectedCategory}
                </Text>
              </VStack>
            </HStack>
          </CardHeader>
          
          <CardBody className="p-0">
            {filteredFaqs.length > 0 ? (
              <Accordion allowMultiple className="divide-y divide-gray-200">
                {filteredFaqs.map((faq) => {
                  const IconComponent = iconMap[faq.icon] || InformationCircleIcon;
                  
                  return (
                    <AccordionItem key={faq.id} className="border-0">
                      <AccordionButton className="p-6 hover:bg-gray-50 transition-colors">
                        <HStack spacing={4} flex="1" align="start">
                          <Icon as={IconComponent} className="w-6 h-6 text-purple-600 mt-1 flex-shrink-0" />
                          <VStack align="start" spacing={1} flex="1">
                            <Text className="font-semibold text-gray-900 text-left">
                              {faq.question}
                            </Text>
                            <Badge 
                              colorScheme="purple" 
                              className="text-xs"
                            >
                              {faq.category}
                            </Badge>
                          </VStack>
                          <AccordionIcon className="text-purple-600" />
                        </HStack>
                      </AccordionButton>
                      <AccordionPanel className="px-6 pb-6">
                        <Text className="text-gray-700 leading-relaxed">
                          {faq.answer}
                        </Text>
                      </AccordionPanel>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            ) : (
              <Box className="p-8 text-center">
                <Text className="text-gray-500">No questions available for this category.</Text>
              </Box>
            )}
          </CardBody>
        </Card>

        {/* Contact Information */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} className="mt-12">
          <Card className="text-center p-6 border-2 border-purple-200">
            <Icon as={InformationCircleIcon} className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <Heading size="md" className="text-gray-900 mb-2">Still Have Questions?</Heading>
            <Text className="text-gray-700">
              Can't find what you're looking for? Our team is here to help with any specific questions.
            </Text>
          </Card>
          
          <Card className="text-center p-6 border-2 border-pink-200">
            <Icon as={ClockIcon} className="w-12 h-12 text-pink-600 mx-auto mb-4" />
            <Heading size="md" className="text-gray-900 mb-2">24/7 Support</Heading>
            <Text className="text-gray-700">
              We provide round-the-clock support for all your transportation and transfer needs.
            </Text>
          </Card>
          
          <Card className="text-center p-6 border-2 border-purple-200">
            <Icon as={CheckCircleIcon} className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <Heading size="md" className="text-gray-900 mb-2">Expert Guidance</Heading>
            <Text className="text-gray-700">
              Get personalized advice from our experienced travel and transportation specialists.
            </Text>
          </Card>
        </SimpleGrid>
      </Container>
    </section>
  );
});

TransferFAQSection.displayName = 'TransferFAQSection'; 