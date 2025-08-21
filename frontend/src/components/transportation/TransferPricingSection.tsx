import React, { useState, useEffect } from 'react';
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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
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
  Skeleton,
} from '@chakra-ui/react';
import {
  CurrencyDollarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  SparklesIcon,
  UserGroupIcon,
  MapPinIcon,
  CheckCircleIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { config } from '../../config';

// Icon mapping for dynamic icons
const iconMap: { [key: string]: any } = {
  'SparklesIcon': SparklesIcon,
  'StarIcon': StarIcon,
  'UserGroupIcon': UserGroupIcon,
  'CurrencyDollarIcon': CurrencyDollarIcon,
  'ClockIcon': ClockIcon,
  'MapPinIcon': MapPinIcon,
  'CheckCircleIcon': CheckCircleIcon,
  'ExclamationTriangleIcon': ExclamationTriangleIcon,
  'InformationCircleIcon': InformationCircleIcon,
};

interface TransferType {
  id: number;
  name: string;
  description: string;
  icon: string;
  gradient: string;
  features: string[];
  pricing_range: string;
  best_for: string;
  pros: string[];
  cons: string[];
  is_active: boolean;
  order: number;
}

interface TransferPricingFactor {
  id: number;
  factor: string;
  description: string;
  icon: string;
  impact: 'High' | 'Medium' | 'Low';
  examples: string[];
  is_active: boolean;
  order: number;
}

export const TransferPricingSection = React.memo(() => {
  const [transferTypes, setTransferTypes] = useState<TransferType[]>([]);
  const [pricingFactors, setPricingFactors] = useState<TransferPricingFactor[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPricingData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${config.apiBaseUrl}/transportation/`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const types = data.transfer_types || [];
        const factors = data.pricing_factors || [];
        
        setTransferTypes(types);
        setPricingFactors(factors);
        
        // Set the first transfer type as selected by default
        if (types.length > 0 && !selectedCategory) {
          setSelectedCategory(types[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch pricing data:', err);
        setError('Failed to load pricing information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPricingData();
  }, [selectedCategory]);

  const currentCategory = transferTypes.find(type => type.id === selectedCategory);

  if (loading) {
    return (
      <section id="pricing" className="py-24 bg-gradient-to-br from-green-50 to-emerald-50">
        <Container maxW="7xl">
          <VStack spacing={16} mb={16} textAlign="center">
            <Skeleton height="40px" width="300px" />
            <Skeleton height="60px" width="600px" />
            <Skeleton height="24px" width="800px" />
          </VStack>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={12}>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} height="100px" />
            ))}
          </SimpleGrid>
          <Skeleton height="400px" />
        </Container>
      </section>
    );
  }

  if (error) {
    return (
      <section id="pricing" className="py-24 bg-gradient-to-br from-green-50 to-emerald-50">
        <Container maxW="7xl">
          <Alert status="error" className="rounded-xl">
            <AlertIcon />
            <Box>
              <AlertTitle>Error Loading Pricing Information</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Box>
          </Alert>
        </Container>
      </section>
    );
  }

  if (transferTypes.length === 0) {
    return (
      <section id="pricing" className="py-24 bg-gradient-to-br from-green-50 to-emerald-50">
        <Container maxW="7xl">
          <Alert status="info" className="rounded-xl">
            <AlertIcon />
            <Box>
              <AlertTitle>No Pricing Information Available</AlertTitle>
              <AlertDescription>
                Pricing information is currently being updated. Please check back later or contact us directly for assistance.
              </AlertDescription>
            </Box>
          </Alert>
        </Container>
      </section>
    );
  }

  return (
    <section id="pricing" className="py-24 bg-gradient-to-br from-green-50 to-emerald-50">
      <Container maxW="7xl">
        <VStack spacing={16} mb={16} textAlign="center">
          <Badge 
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-full text-sm font-bold"
          >
            <Icon as={CurrencyDollarIcon} className="w-4 h-4 mr-2" />
            Transfer Pricing Guide
          </Badge>
          
          <Heading size="2xl" className="text-5xl md:text-6xl font-bold text-gray-900">
            Transfer Pricing & Costs
          </Heading>
          
          <Text className="text-xl text-gray-800 max-w-4xl mx-auto leading-relaxed">
            Transparent pricing information for all types of transfers in the Maldives. 
            Understand the costs and factors that influence transfer pricing.
          </Text>
        </VStack>

        {/* Transfer Type Selection */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={12}>
          {transferTypes.map((type) => {
            const IconComponent = iconMap[type.icon] || SparklesIcon;
            
            return (
              <Button
                key={type.id}
                variant={selectedCategory === type.id ? "solid" : "outline"}
                size="lg"
                className={`flex flex-col items-center justify-center p-6 h-auto rounded-xl transition-all duration-300 ${
                  selectedCategory === type.id 
                    ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-xl' 
                    : 'text-gray-700 hover:text-green-600 hover:bg-green-50 border-2 border-gray-200 hover:border-green-300'
                }`}
                onClick={() => setSelectedCategory(type.id)}
              >
                <Icon as={IconComponent} className="w-8 h-8 mb-3" />
                <Text className="text-sm font-bold">{type.name}</Text>
              </Button>
            );
          })}
        </SimpleGrid>

        {/* Selected Category Pricing */}
        {currentCategory && (
          <Card className="shadow-2xl border-2 border-gray-200 mb-12">
            <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-700 text-white">
              <HStack spacing={4}>
                <div className={`w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center`}>
                  <Icon as={iconMap[currentCategory.icon] || SparklesIcon} className="w-8 h-8 text-white" />
                </div>
                <VStack align="start" spacing={2}>
                  <Heading size="lg" className="text-white">
                    {currentCategory.name}
                  </Heading>
                  <Text className="text-green-100">
                    {currentCategory.description}
                  </Text>
                </VStack>
              </HStack>
            </CardHeader>
            
            <CardBody>
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
                {/* Pricing Information */}
                <Box>
                  <Heading size="md" className="text-gray-900 mb-4">Pricing Information</Heading>
                  <VStack spacing={4} align="stretch">
                    <Box>
                      <HStack spacing={2} mb={2}>
                        <Icon as={CurrencyDollarIcon} className="w-5 h-5 text-green-600" />
                        <Text className="font-semibold text-gray-800">Price Range</Text>
                      </HStack>
                      <Text className="text-gray-700">{currentCategory.pricing_range}</Text>
                    </Box>
                    
                    <Box>
                      <HStack spacing={2} mb={2}>
                        <Icon as={MapPinIcon} className="w-5 h-5 text-blue-600" />
                        <Text className="font-semibold text-gray-800">Best For</Text>
                      </HStack>
                      <Text className="text-gray-700">{currentCategory.best_for}</Text>
                    </Box>
                  </VStack>
                </Box>

                {/* Features */}
                <Box>
                  <Heading size="md" className="text-gray-900 mb-4">What's Included</Heading>
                  <List spacing={3}>
                    {currentCategory.features.map((feature, index) => (
                      <ListItem key={index} className="flex items-start">
                        <ListIcon as={CheckCircleIcon} color="green.500" className="mt-1 mr-3 flex-shrink-0" />
                        <Text className="text-gray-700">{feature}</Text>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </SimpleGrid>
            </CardBody>
          </Card>
        )}

        {/* Pricing Factors */}
        {pricingFactors.length > 0 && (
          <VStack spacing={12}>
            <VStack spacing={6} textAlign="center">
              <Heading size="xl" className="text-4xl font-bold text-gray-900">
                Factors Affecting Transfer Pricing
              </Heading>
              <Text className="text-lg text-gray-700 max-w-3xl">
                Understanding what influences transfer costs helps you plan and budget effectively
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
              {pricingFactors.map((factor) => {
                const IconComponent = iconMap[factor.icon] || InformationCircleIcon;
                
                return (
                  <Card key={factor.id} className="shadow-lg border-2 border-gray-200 hover:border-green-300 transition-all duration-300">
                    <CardHeader>
                      <HStack spacing={4}>
                        <Icon as={IconComponent} className="w-8 h-8 text-green-600" />
                        <VStack align="start" spacing={1}>
                          <Heading size="md" className="text-gray-900">
                            {factor.factor}
                          </Heading>
                          <Badge 
                            colorScheme={factor.impact === 'High' ? 'red' : factor.impact === 'Medium' ? 'orange' : 'green'}
                            className="text-xs"
                          >
                            {factor.impact} Impact
                          </Badge>
                        </VStack>
                      </HStack>
                    </CardHeader>
                    
                    <CardBody className="pt-0">
                      <Text className="text-gray-700 mb-4">{factor.description}</Text>
                      <List spacing={2}>
                        {factor.examples.map((example, index) => (
                          <ListItem key={index} className="text-sm text-gray-600">
                            <ListIcon as={CheckCircleIcon} color="green.500" className="w-3 h-3" />
                            {example}
                          </ListItem>
                        ))}
                      </List>
                    </CardBody>
                  </Card>
                );
              })}
            </SimpleGrid>
          </VStack>
        )}

        {/* Important Notes */}
        <Alert status="info" className="mt-12 rounded-xl">
          <AlertIcon />
          <Box>
            <AlertTitle>Important Pricing Information</AlertTitle>
            <AlertDescription>
              All prices are per person for round-trip transfers unless otherwise specified. Prices include all taxes and fees. 
              Children under 2 years typically travel free, while children 2-12 years usually pay half price. 
              Prices may vary based on availability, season, and special requirements.
            </AlertDescription>
          </Box>
        </Alert>

        {/* Booking CTA */}
        <Card className="mt-8 shadow-xl border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <CardBody className="text-center p-8">
            <VStack spacing={4}>
              <Icon as={InformationCircleIcon} className="w-12 h-12 text-green-600" />
              <Heading size="lg" className="text-gray-900">
                Need a Custom Quote?
              </Heading>
              <Text className="text-gray-700 max-w-2xl">
                Contact us for personalized pricing based on your specific requirements, 
                group size, and travel dates. We offer competitive rates and flexible options.
              </Text>
              <Button 
                size="lg"
                colorScheme="green"
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-full shadow-lg"
              >
                <Icon as={CurrencyDollarIcon} className="w-5 h-5 mr-2" />
                Get Custom Quote
              </Button>
            </VStack>
          </CardBody>
        </Card>
      </Container>
    </section>
  );
});

TransferPricingSection.displayName = 'TransferPricingSection'; 