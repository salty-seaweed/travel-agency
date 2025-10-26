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
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Divider,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Skeleton,
} from '@chakra-ui/react';
import {
  MapPinIcon,
  ClockIcon,
  CurrencyDollarIcon,
  InformationCircleIcon,
  SparklesIcon,
  GlobeAltIcon,
  StarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { config } from '../../config';

// Icon mapping for dynamic icons
const iconMap: { [key: string]: any } = {
  'SparklesIcon': SparklesIcon,
  'GlobeAltIcon': GlobeAltIcon,
  'StarIcon': StarIcon,
  'CheckCircleIcon': CheckCircleIcon,
  'MapPinIcon': MapPinIcon,
  'ClockIcon': ClockIcon,
  'CurrencyDollarIcon': CurrencyDollarIcon,
  'InformationCircleIcon': InformationCircleIcon,
  'ExclamationTriangleIcon': ExclamationTriangleIcon,
};

interface AtollTransfer {
  id: number;
  atoll_name: string;
  description: string;
  icon: string;
  gradient: string;
  is_active: boolean;
  order: number;
  resorts: ResortTransfer[];
}

interface ResortTransfer {
  id: number;
  resort_name: string;
  price: string;
  duration: string;
  transfer_type: string;
  is_active: boolean;
  order: number;
}

export const AtollTransfersSection = React.memo(() => {
  const [atollTransfers, setAtollTransfers] = useState<AtollTransfer[]>([]);
  const [selectedAtoll, setSelectedAtoll] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAtollTransfers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${config.apiBaseUrl}/transportation/`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const atolls = data.atoll_transfers || [];
        setAtollTransfers(atolls);
        
        // Set the first atoll as selected by default
        if (atolls.length > 0 && !selectedAtoll) {
          setSelectedAtoll(atolls[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch atoll transfers:', err);
        setError('Failed to load atoll transfer information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAtollTransfers();
  }, [selectedAtoll]);

  const currentAtoll = atollTransfers.find(atoll => atoll.id === selectedAtoll);

  if (loading) {
    return (
      <section className="py-24 bg-gradient-to-br from-blue-50 to-indigo-50">
        <Container maxW="7xl">
          <VStack spacing={16} mb={16} textAlign="center">
            <Skeleton height="40px" width="300px" />
            <Skeleton height="60px" width="600px" />
            <Skeleton height="24px" width="800px" />
          </VStack>
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={12}>
            {[1, 2, 3, 4].map((i) => (
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
      <section className="py-24 bg-gradient-to-br from-blue-50 to-indigo-50">
        <Container maxW="7xl">
          <Alert status="error" className="rounded-xl">
            <AlertIcon />
            <Box>
              <AlertTitle>Error Loading Atoll Transfer Information</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Box>
          </Alert>
        </Container>
      </section>
    );
  }

  if (atollTransfers.length === 0) {
    return (
      <section className="py-24 bg-gradient-to-br from-blue-50 to-indigo-50">
        <Container maxW="7xl">
          <Alert status="info" className="rounded-xl">
            <AlertIcon />
            <Box>
              <AlertTitle>No Atoll Transfer Information Available</AlertTitle>
              <AlertDescription>
                Atoll transfer information is currently being updated. Please check back later or contact us directly for assistance.
              </AlertDescription>
            </Box>
          </Alert>
        </Container>
      </section>
    );
  }

  return (
    <section id="atoll-transfers" className="py-24 bg-gradient-to-br from-blue-50 to-indigo-50">
      <Container maxW="7xl">
        <VStack spacing={16} mb={16} textAlign="center">
          <Badge 
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-full text-sm font-bold"
          >
            <Icon as={MapPinIcon} className="w-4 h-4 mr-2" />
            Atoll Transfer Guide
          </Badge>
          
          <Heading size="2xl" className="text-5xl md:text-6xl font-bold text-gray-900">
            Atoll Transfer Information
          </Heading>
          
          <Text className="text-xl text-gray-800 max-w-4xl mx-auto leading-relaxed">
            Comprehensive transfer information for major atolls in the Maldives. 
            Find the perfect transfer option for your chosen destination.
          </Text>
        </VStack>

        {/* Atoll Selection */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={12}>
          {atollTransfers.map((atoll) => {
            const IconComponent = iconMap[atoll.icon] || SparklesIcon;
            
            return (
              <Button
                key={atoll.id}
                variant={selectedAtoll === atoll.id ? "solid" : "outline"}
                size="lg"
                className={`flex flex-col items-center justify-center p-6 h-auto rounded-xl transition-all duration-300 ${
                  selectedAtoll === atoll.id 
                    ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xl' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => setSelectedAtoll(atoll.id)}
              >
                <Icon as={IconComponent} className="w-8 h-8 mb-3" />
                <Text className="text-sm font-bold">{atoll.atoll_name}</Text>
              </Button>
            );
          })}
        </SimpleGrid>

        {/* Selected Atoll Information */}
        {currentAtoll && (
          <Card className="shadow-2xl border-2 border-gray-200">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
              <HStack spacing={4}>
                <div className={`w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center`}>
                  <Icon as={iconMap[currentAtoll.icon] || SparklesIcon} className="w-8 h-8 text-white" />
                </div>
                <VStack align="start" spacing={2}>
                  <Heading size="lg" className="text-white">
                    {currentAtoll.atoll_name} Transfers
                  </Heading>
                  <Text className="text-blue-100">
                    {currentAtoll.description}
                  </Text>
                </VStack>
              </HStack>
            </CardHeader>
            
            <CardBody className="p-0">
              {currentAtoll.resorts && currentAtoll.resorts.length > 0 ? (
                <TableContainer>
                  <Table variant="simple">
                    <Thead className="bg-gray-50">
                      <Tr>
                        <Th className="text-gray-800 font-bold">Resort/Hotel</Th>
                        <Th className="text-gray-800 font-bold text-center">Price (USD)</Th>
                        <Th className="text-gray-800 font-bold text-center">Duration</Th>
                        <Th className="text-gray-800 font-bold text-center">Transfer Type</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {currentAtoll.resorts.map((resort) => (
                        <Tr key={resort.id} className="hover:bg-gray-50 transition-colors">
                          <Td className="font-medium text-gray-900">{resort.resort_name}</Td>
                          <Td className="text-center">
                            <Badge colorScheme="green" className="px-3 py-1 rounded-full font-bold">
                              ${resort.price}
                            </Badge>
                          </Td>
                          <Td className="text-center text-gray-700">
                            <HStack spacing={1} justify="center">
                              <Icon as={ClockIcon} className="w-4 h-4" />
                              <Text>{resort.duration}</Text>
                            </HStack>
                          </Td>
                          <Td className="text-center">
                            <Badge 
                              colorScheme={resort.transfer_type === 'seaplane' ? 'purple' : 'blue'}
                              className="px-3 py-1 rounded-full"
                            >
                              {resort.transfer_type === 'seaplane' ? 'Seaplane' : 'Speedboat'}
                            </Badge>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              ) : (
                <Box className="p-8 text-center">
                  <Text className="text-gray-500">No resort transfers available for this atoll at the moment.</Text>
                </Box>
              )}
            </CardBody>
          </Card>
        )}

        {/* Important Notes */}
        <Alert status="info" className="mt-8 rounded-xl">
          <AlertIcon />
          <Box>
            <AlertTitle>Important Transfer Information</AlertTitle>
            <AlertDescription>
              All prices are per person for round-trip transfers. Children under 2 years travel free, 
              children 2-12 years pay half price. Transfers must be pre-arranged before arrival. 
              Weather conditions may affect transfer schedules.
            </AlertDescription>
          </Box>
        </Alert>

        {/* Additional Information */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} className="mt-12">
          <Card className="text-center p-6 border-2 border-blue-200">
            <Icon as={InformationCircleIcon} className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <Heading size="md" className="text-gray-900 mb-2">Pre-Booking Required</Heading>
            <Text className="text-gray-700">
              All transfers must be arranged in advance. No on-the-spot bookings available at the airport.
            </Text>
          </Card>
          
          <Card className="text-center p-6 border-2 border-green-200">
            <Icon as={ClockIcon} className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <Heading size="md" className="text-gray-900 mb-2">Flexible Scheduling</Heading>
            <Text className="text-gray-700">
              We coordinate with your flight arrival times to ensure seamless transfers to your destination.
            </Text>
          </Card>
          
          <Card className="text-center p-6 border-2 border-purple-200">
            <Icon as={ExclamationTriangleIcon} className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <Heading size="md" className="text-gray-900 mb-2">Weather Dependent</Heading>
            <Text className="text-gray-700">
              Transfers may be delayed or rescheduled due to weather conditions for your safety.
            </Text>
          </Card>
        </SimpleGrid>
      </Container>
    </section>
  );
});

AtollTransfersSection.displayName = 'AtollTransfersSection'; 