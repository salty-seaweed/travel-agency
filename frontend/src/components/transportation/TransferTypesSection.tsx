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
  List,
  ListItem,
  ListIcon,
  HStack,
  Divider,
  Skeleton,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import {
  CheckCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  MapPinIcon,
  SparklesIcon,
  GlobeAltIcon,
  UserGroupIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { config } from '../../config';

// Icon mapping for dynamic icons
const iconMap: { [key: string]: any } = {
  'SparklesIcon': SparklesIcon,
  'GlobeAltIcon': GlobeAltIcon,
  'UserGroupIcon': UserGroupIcon,
  'ShieldCheckIcon': ShieldCheckIcon,
  'ClockIcon': ClockIcon,
  'CurrencyDollarIcon': CurrencyDollarIcon,
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

export const TransferTypesSection = React.memo(() => {
  const [transferTypes, setTransferTypes] = useState<TransferType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransferTypes = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${config.apiBaseUrl}/transportation/`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setTransferTypes(data.transfer_types || []);
      } catch (err) {
        console.error('Failed to fetch transfer types:', err);
        setError('Failed to load transportation information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransferTypes();
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-gradient-to-br from-blue-50 to-indigo-50">
        <Container maxW="7xl">
          <VStack spacing={16} mb={16} textAlign="center">
            <Skeleton height="40px" width="300px" />
            <Skeleton height="60px" width="600px" />
            <Skeleton height="24px" width="800px" />
          </VStack>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} height="400px" />
            ))}
          </SimpleGrid>
        </Container>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-24 bg-gradient-to-br from-blue-50 to-indigo-50">
        <Container maxW="7xl">
          <Alert status="error" className="rounded-xl">
            <AlertIcon />
            <Box>
              <AlertTitle>Error Loading Transportation Information</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Box>
          </Alert>
        </Container>
      </section>
    );
  }

  if (transferTypes.length === 0) {
    return (
      <section className="py-24 bg-gradient-to-br from-blue-50 to-indigo-50">
        <Container maxW="7xl">
          <Alert status="info" className="rounded-xl">
            <AlertIcon />
            <Box>
              <AlertTitle>No Transportation Information Available</AlertTitle>
              <AlertDescription>
                Transportation information is currently being updated. Please check back later or contact us directly for assistance.
              </AlertDescription>
            </Box>
          </Alert>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gradient-to-br from-blue-50 to-indigo-50">
      <Container maxW="7xl">
        <VStack spacing={16} mb={16} textAlign="center">
          <Badge 
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-full text-sm font-bold"
          >
            <Icon as={SparklesIcon} className="w-4 h-4 mr-2" />
            Transportation Options
          </Badge>
          
          <Heading size="2xl" className="text-5xl md:text-6xl font-bold text-gray-900">
            Transfer Types & Services
          </Heading>
          
          <Text className="text-xl text-gray-800 max-w-4xl mx-auto leading-relaxed">
            Choose the perfect transportation option for your Maldives adventure. 
            From budget-friendly ferries to luxury seaplane transfers, we have you covered.
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
          {transferTypes.map((type) => {
            const IconComponent = iconMap[type.icon] || SparklesIcon;
            const isDomestic = typeof type.name === 'string' && type.name.toLowerCase().includes('domestic');
            const headerClasses = isDomestic
              ? 'bg-gradient-to-br from-blue-700 to-indigo-700 text-white rounded-t-xl'
              : `bg-gradient-to-br ${type.gradient} text-white rounded-t-xl`;
            
            return (
              <Card key={type.id} className="shadow-2xl border-2 border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-glow-lg">
                <CardHeader className={headerClasses}>
                  <VStack spacing={4} align="center">
                    <div className={`w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center`}>
                      <Icon as={IconComponent} className="w-8 h-8 text-white" />
                    </div>
                    <VStack spacing={2} align="center">
                      <Heading size="md" className="text-white text-center">
                        {type.name}
                      </Heading>
                      <Text className="text-blue-100 text-center text-sm">
                        {type.description}
                      </Text>
                    </VStack>
                  </VStack>
                </CardHeader>
                
                <CardBody className="p-6">
                  <VStack spacing={6} align="stretch">
                    {/* Features */}
                    <Box>
                      <Heading size="sm" className="text-gray-900 mb-3">Features</Heading>
                      <List spacing={2}>
                        {type.features.map((feature, index) => (
                          <ListItem key={index} className="flex items-start">
                            <ListIcon as={CheckCircleIcon} color="green.500" className="mt-1 mr-3 flex-shrink-0" />
                            <Text className="text-gray-700 text-sm">{feature}</Text>
                          </ListItem>
                        ))}
                      </List>
                    </Box>

                    <Divider />

                    {/* Pricing */}
                    <Box>
                      <HStack spacing={2} mb={2}>
                        <Icon as={CurrencyDollarIcon} className="w-4 h-4 text-green-600" />
                        <Text className="font-semibold text-gray-900">Pricing</Text>
                      </HStack>
                      <Text className="text-gray-700 text-sm">{type.pricing_range}</Text>
                    </Box>

                    {/* Best For */}
                    <Box>
                      <HStack spacing={2} mb={2}>
                        <Icon as={MapPinIcon} className="w-4 h-4 text-blue-600" />
                        <Text className="font-semibold text-gray-900">Best For</Text>
                      </HStack>
                      <Text className="text-gray-700 text-sm">{type.best_for}</Text>
                    </Box>

                    <Divider />

                    {/* Pros & Cons */}
                    <SimpleGrid columns={2} spacing={4}>
                      <Box>
                        <Heading size="sm" className="text-green-700 mb-2">Pros</Heading>
                        <List spacing={1}>
                          {type.pros.map((pro, index) => (
                            <ListItem key={index} className="text-xs text-green-600">
                              <ListIcon as={CheckCircleIcon} color="green.500" className="w-3 h-3" />
                              {pro}
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                      
                      <Box>
                        <Heading size="sm" className="text-red-700 mb-2">Cons</Heading>
                        <List spacing={1}>
                          {type.cons.map((con, index) => (
                            <ListItem key={index} className="text-xs text-red-600">
                              <ListIcon as={ExclamationTriangleIcon} color="red.500" className="w-3 h-3" />
                              {con}
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    </SimpleGrid>
                  </VStack>
                </CardBody>
              </Card>
            );
          })}
        </SimpleGrid>
      </Container>
    </section>
  );
});

TransferTypesSection.displayName = 'TransferTypesSection'; 