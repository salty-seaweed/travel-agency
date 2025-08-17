import React, { useState } from 'react';
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

export const AtollTransfersSection = React.memo(() => {
  const [selectedAtoll, setSelectedAtoll] = useState('male');

  const atollData = {
    male: {
      name: 'Male Atoll',
      description: 'The most accessible atoll with the highest concentration of resorts',
      icon: SparklesIcon,
      gradient: 'from-blue-500 to-indigo-600',
      transfers: [
        { resort: 'Adaaran Hudhuranfushi', price: 130, duration: '45 minutes' },
        { resort: 'Adaaran Rannalhi', price: 180, duration: '60 minutes' },
        { resort: 'Adaaran Vadoo', price: 80, duration: '25 minutes' },
        { resort: 'Anantara Veli', price: 115, duration: '40 minutes' },
        { resort: 'Anantara Digu', price: 115, duration: '40 minutes' },
        { resort: 'Angsana Ihuru', price: 72, duration: '25 minutes' },
        { resort: 'Bandos Island', price: 65, duration: '20 minutes' },
        { resort: 'Banyan Tree', price: 72, duration: '25 minutes' },
        { resort: 'Centara Rasfushi', price: 65, duration: '20 minutes' },
        { resort: 'Club Med Finolhu', price: 110, duration: '30 minutes' },
        { resort: 'Coco Bodu Hithi', price: 125, duration: '45 minutes' },
        { resort: 'Cinnamon Dhonveli', price: 95, duration: '30 minutes' },
        { resort: 'Sheraton Full Moon', price: 55, duration: '15 minutes' },
        { resort: 'Kurumba Maldives', price: 58, duration: '15 minutes' },
        { resort: 'Paradise Island', price: 70, duration: '20 minutes' },
        { resort: 'Velassaru', price: 90, duration: '30 minutes' },
        { resort: 'Taj Exotica', price: 75, duration: '25 minutes' },
        { resort: 'Waldorf Astoria', price: 150, duration: '40 minutes' },
      ]
    },
    baa: {
      name: 'Baa Atoll',
      description: 'UNESCO Biosphere Reserve with luxury resorts and pristine nature',
      icon: GlobeAltIcon,
      gradient: 'from-green-500 to-emerald-600',
      transfers: [
        { resort: 'Dusit Thani Maldives', price: 150, duration: '2 hours 40 minutes' },
        { resort: 'Finolhu Baa Atoll', price: 180, duration: '2 hours 40 minutes' },
        { resort: 'Four Seasons Private Island', price: 230, duration: '2 hours 40 minutes' },
        { resort: 'Four Seasons Landaa Giraavaru', price: 180, duration: '2 hours 40 minutes' },
        { resort: 'Kihaa Maldives', price: 100, duration: '2 hours 40 minutes' },
        { resort: 'Milaidhoo Island', price: 140, duration: '2 hours 40 minutes' },
        { resort: 'Reethi Beach Resort', price: 200, duration: '2 hours 40 minutes' },
        { resort: 'Royal Island Resort', price: 110, duration: '2 hours 40 minutes' },
        { resort: 'Soneva Fushi', price: 104, duration: '2 hours 40 minutes' },
        { resort: 'The Nautilus Maldives', price: 180, duration: '2 hours 40 minutes' },
        { resort: 'The Westin Maldives', price: 100, duration: '2 hours 40 minutes' },
        { resort: 'Vakkaru Maldives', price: 180, duration: '2 hours 40 minutes' },
      ]
    },
    ari: {
      name: 'Ari Atoll',
      description: 'Famous for diving and water sports with diverse accommodation options',
      icon: StarIcon,
      gradient: 'from-purple-500 to-pink-600',
      transfers: [
        { resort: 'Conrad Maldives', price: 250, duration: '3 hours' },
        { resort: 'Diamonds Athuruga', price: 180, duration: '2 hours 30 minutes' },
        { resort: 'Diamonds Thudufushi', price: 180, duration: '2 hours 30 minutes' },
        { resort: 'Ellaidhoo Maldives', price: 120, duration: '2 hours' },
        { resort: 'Fihalhohi Island', price: 145, duration: '2 hours 15 minutes' },
        { resort: 'Lily Beach Resort', price: 200, duration: '2 hours 45 minutes' },
        { resort: 'Maafushivaru Maldives', price: 160, duration: '2 hours 30 minutes' },
        { resort: 'Mirihi Island Resort', price: 140, duration: '2 hours 15 minutes' },
        { resort: 'Nika Island Resort', price: 130, duration: '2 hours' },
        { resort: 'Vakarufalhi Island Resort', price: 150, duration: '2 hours 30 minutes' },
      ]
    },
    lhaviyani: {
      name: 'Lhaviyani Atoll',
      description: 'Known for its crystal clear waters and excellent diving spots',
      icon: CheckCircleIcon,
      gradient: 'from-orange-500 to-red-600',
      transfers: [
        { resort: 'Cocoon Maldives', price: 160, duration: '2 hours 15 minutes' },
        { resort: 'Hurawalhi Island Resort', price: 180, duration: '2 hours 30 minutes' },
        { resort: 'Kuredu Island Resort', price: 140, duration: '2 hours' },
        { resort: 'Komandoo Island Resort', price: 150, duration: '2 hours 15 minutes' },
        { resort: 'Palm Beach Island Resort', price: 130, duration: '2 hours' },
        { resort: 'Sun Siyam Iru Fushi', price: 170, duration: '2 hours 30 minutes' },
      ]
    }
  };

  const currentAtoll = atollData[selectedAtoll as keyof typeof atollData];

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
          {Object.entries(atollData).map(([key, atoll]) => (
            <Button
              key={key}
              variant={selectedAtoll === key ? "solid" : "outline"}
              size="lg"
              className={`flex flex-col items-center justify-center p-6 h-auto rounded-xl transition-all duration-300 ${
                selectedAtoll === key 
                  ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xl' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => setSelectedAtoll(key)}
            >
              <Icon as={atoll.icon} className="w-8 h-8 mb-3" />
              <Text className="text-sm font-bold">{atoll.name}</Text>
            </Button>
          ))}
        </SimpleGrid>

        {/* Selected Atoll Information */}
        <Card className="shadow-2xl border-2 border-gray-200">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
            <HStack spacing={4}>
              <div className={`w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center`}>
                <Icon as={currentAtoll.icon} className="w-8 h-8 text-white" />
              </div>
              <VStack align="start" spacing={2}>
                <Heading size="lg" className="text-white">
                  {currentAtoll.name} Transfers
                </Heading>
                <Text className="text-blue-100">
                  {currentAtoll.description}
                </Text>
              </VStack>
            </HStack>
          </CardHeader>
          
          <CardBody className="p-0">
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
                  {currentAtoll.transfers.map((transfer, index) => (
                    <Tr key={index} className="hover:bg-gray-50 transition-colors">
                      <Td className="font-medium text-gray-900">{transfer.resort}</Td>
                      <Td className="text-center">
                        <Badge colorScheme="green" className="px-3 py-1 rounded-full font-bold">
                          ${transfer.price}
                        </Badge>
                      </Td>
                      <Td className="text-center text-gray-700">
                        <HStack spacing={1} justify="center">
                          <Icon as={ClockIcon} className="w-4 h-4" />
                          <Text>{transfer.duration}</Text>
                        </HStack>
                      </Td>
                      <Td className="text-center">
                        <Badge 
                          colorScheme={transfer.duration.includes('hours') ? 'purple' : 'blue'}
                          className="px-3 py-1 rounded-full"
                        >
                          {transfer.duration.includes('hours') ? 'Seaplane' : 'Speedboat'}
                        </Badge>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </CardBody>
        </Card>

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