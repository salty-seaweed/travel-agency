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

export const TransferPricingSection = React.memo(() => {
  const [selectedCategory, setSelectedCategory] = useState('speedboat');

  const pricingData = {
    speedboat: {
      title: 'Speedboat Transfers',
      description: 'Fast and efficient transfers for nearby destinations',
      icon: SparklesIcon,
      gradient: 'from-blue-500 to-indigo-600',
      pricing: [
        { distance: '15-30 minutes', price: '50-80', resorts: 'Sheraton, Kurumba, Paradise Island' },
        { distance: '30-45 minutes', price: '80-120', resorts: 'Anantara, Cinnamon, Centara' },
        { distance: '45-60 minutes', price: '120-180', resorts: 'Adaaran, Club Med, Coco' },
        { distance: '60+ minutes', price: '180-300', resorts: 'Remote resorts, outer islands' },
      ],
      features: [
        'Round-trip transfers included',
        'Children under 2: Free',
        'Children 2-12: 50% discount',
        'Luggage allowance: 20kg per person',
        'Refreshments provided',
        'Professional crew'
      ]
    },
    seaplane: {
      title: 'Seaplane Transfers',
      description: 'Luxury aerial transfers to remote resorts',
      icon: StarIcon,
      gradient: 'from-purple-500 to-pink-600',
      pricing: [
        { distance: '30-45 minutes', price: '200-300', resorts: 'Baa Atoll resorts' },
        { distance: '45-60 minutes', price: '300-400', resorts: 'Ari Atoll resorts' },
        { distance: '60+ minutes', price: '400-500', resorts: 'Remote luxury resorts' },
      ],
      features: [
        'Round-trip transfers included',
        'Children under 2: Free (lap child)',
        'Children 2-12: 50% discount',
        'Luggage allowance: 15kg per person',
        'Breathtaking aerial views',
        'Professional pilots'
      ]
    },
    ferry: {
      title: 'Public Ferry Services',
      description: 'Budget-friendly transportation between local islands',
      icon: UserGroupIcon,
      gradient: 'from-green-500 to-emerald-600',
      pricing: [
        { distance: 'Local routes', price: '2-5', resorts: 'Local island connections' },
        { distance: 'Inter-atoll routes', price: '5-15', resorts: 'Major island connections' },
        { distance: 'Long distance', price: '15-25', resorts: 'Remote local islands' },
      ],
      features: [
        'One-way tickets available',
        'Children under 2: Free',
        'Children 2-12: 50% discount',
        'Luggage: No weight restrictions',
        'Local experience',
        'Scheduled departures'
      ]
    }
  };

  const pricingFactors = [
    {
      factor: 'Distance',
      description: 'Longer distances generally cost more',
      icon: MapPinIcon,
      impact: 'High',
      examples: ['Male to nearby islands: $50-80', 'Male to Baa Atoll: $150-200', 'Male to Ari Atoll: $200-300']
    },
    {
      factor: 'Transfer Type',
      description: 'Different transportation methods have different costs',
      icon: SparklesIcon,
      impact: 'High',
      examples: ['Speedboat: $50-300', 'Seaplane: $200-500', 'Ferry: $2-25']
    },
    {
      factor: 'Season',
      description: 'Peak season may have higher rates',
      icon: StarIcon,
      impact: 'Medium',
      examples: ['Peak season (Dec-Apr): +10-20%', 'Off-season (May-Nov): Standard rates', 'Holiday periods: +15-25%']
    },
    {
      factor: 'Group Size',
      description: 'Larger groups may get discounts',
      icon: UserGroupIcon,
      impact: 'Medium',
      examples: ['Individual: Standard rates', 'Group 4-8: 5-10% discount', 'Group 8+: 10-15% discount']
    },
    {
      factor: 'Booking Time',
      description: 'Early booking often gets better rates',
      icon: ClockIcon,
      impact: 'Medium',
      examples: ['Last minute: +20-30%', '2-4 weeks advance: Standard rates', '1+ month advance: 5-10% discount']
    },
    {
      factor: 'Special Requirements',
      description: 'Additional services may incur extra costs',
      icon: ExclamationTriangleIcon,
      impact: 'Low',
      examples: ['Wheelchair assistance: +$20', 'Extra luggage: +$10-30', 'Private transfer: +50-100%']
    }
  ];

  const currentCategory = pricingData[selectedCategory as keyof typeof pricingData];

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
          {Object.entries(pricingData).map(([key, category]) => (
            <Button
              key={key}
              variant={selectedCategory === key ? "solid" : "outline"}
              size="lg"
              className={`flex flex-col items-center justify-center p-6 h-auto rounded-xl transition-all duration-300 ${
                selectedCategory === key 
                  ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-xl' 
                  : 'text-gray-700 hover:text-green-600 hover:bg-green-50 border-2 border-gray-200 hover:border-green-300'
              }`}
              onClick={() => setSelectedCategory(key)}
            >
              <Icon as={category.icon} className="w-8 h-8 mb-3" />
              <Text className="text-sm font-bold">{category.title}</Text>
            </Button>
          ))}
        </SimpleGrid>

        {/* Selected Category Pricing */}
        <Card className="shadow-2xl border-2 border-gray-200 mb-12">
          <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-700 text-white">
            <HStack spacing={4}>
              <div className={`w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center`}>
                <Icon as={currentCategory.icon} className="w-8 h-8 text-white" />
              </div>
              <VStack align="start" spacing={2}>
                <Heading size="lg" className="text-white">
                  {currentCategory.title}
                </Heading>
                <Text className="text-green-100">
                  {currentCategory.description}
                </Text>
              </VStack>
            </HStack>
          </CardHeader>
          
          <CardBody>
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
              {/* Pricing Table */}
              <Box>
                <Heading size="md" className="text-gray-900 mb-4">Pricing by Distance</Heading>
                <TableContainer>
                  <Table variant="simple">
                    <Thead className="bg-gray-50">
                      <Tr>
                        <Th className="text-gray-800 font-bold">Distance</Th>
                        <Th className="text-gray-800 font-bold text-center">Price (USD)</Th>
                        <Th className="text-gray-800 font-bold">Example Destinations</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {currentCategory.pricing.map((item, index) => (
                        <Tr key={index} className="hover:bg-gray-50 transition-colors">
                          <Td className="font-medium text-gray-900">{item.distance}</Td>
                          <Td className="text-center">
                            <Badge colorScheme="green" className="px-3 py-1 rounded-full font-bold">
                              ${item.price}
                            </Badge>
                          </Td>
                          <Td className="text-gray-700 text-sm">{item.resorts}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
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

        {/* Pricing Factors */}
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
            {pricingFactors.map((factor) => (
              <Card key={factor.factor} className="shadow-lg border-2 border-gray-200 hover:border-green-300 transition-all duration-300">
                <CardHeader>
                  <HStack spacing={4}>
                    <Icon as={factor.icon} className="w-8 h-8 text-green-600" />
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
            ))}
          </SimpleGrid>
        </VStack>

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