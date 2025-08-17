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
  Card,
  CardBody,
  CardHeader,
  List,
  ListItem,
  ListIcon,
  HStack,
  Divider,
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

export const TransferTypesSection = React.memo(() => {
  const transferTypes = [
    {
      id: 'speedboat',
      title: 'Speedboat Transfers',
      description: 'Fast and efficient transfers for nearby islands and resorts',
      icon: SparklesIcon,
      gradient: 'from-blue-500 to-indigo-600',
      features: [
        '15-60 minutes travel time',
        'Available 24/7 for resort guests',
        'Comfortable seating with shade',
        'Life jackets provided',
        'Direct transfers from airport',
        'Suitable for all weather conditions'
      ],
      pricing: 'From $50 to $300 per person',
      bestFor: 'Resort transfers, nearby islands',
      pros: ['Fastest option for nearby destinations', 'Flexible scheduling', 'Direct service'],
      cons: ['Limited to nearby islands', 'Weather dependent', 'Can be expensive']
    },
    {
      id: 'ferry',
      title: 'Public Ferry Services',
      description: 'Budget-friendly transportation between local islands',
      icon: GlobeAltIcon,
      gradient: 'from-green-500 to-emerald-600',
      features: [
        'Scheduled departures',
        'Very affordable rates',
        'Local island connections',
        'Regular schedules',
        'Authentic local experience',
        'Luggage space available'
      ],
      pricing: 'From $2 to $15 per person',
      bestFor: 'Budget travelers, local island hopping',
      pros: ['Most affordable option', 'Regular schedules', 'Local experience'],
      cons: ['Limited schedules', 'Longer travel times', 'Basic amenities']
    },
    {
      id: 'seaplane',
      title: 'Seaplane Transfers',
      description: 'Luxury aerial transfers to remote resorts and islands',
      icon: UserGroupIcon,
      gradient: 'from-purple-500 to-pink-600',
      features: [
        'Breathtaking aerial views',
        'Fast transfers to remote locations',
        'Luxury experience',
        'Professional pilots',
        'Baggage included',
        'Resort coordination'
      ],
      pricing: 'From $200 to $500 per person',
      bestFor: 'Luxury resorts, remote islands',
      pros: ['Stunning views', 'Fast to remote locations', 'Luxury experience'],
      cons: ['Most expensive option', 'Weather dependent', 'Limited luggage']
    },
    {
      id: 'domestic-flight',
      title: 'Domestic Flights',
      description: 'Domestic air travel between atolls and major islands',
      icon: ShieldCheckIcon,
      gradient: 'from-orange-500 to-red-600',
      features: [
        'Inter-atoll connections',
        'Regular scheduled flights',
        'Air-conditioned comfort',
        'Professional service',
        'Reliable schedules',
        'Baggage allowance'
      ],
      pricing: 'From $80 to $200 per person',
      bestFor: 'Inter-atoll travel, major islands',
      pros: ['Reliable schedules', 'Comfortable travel', 'Good for long distances'],
      cons: ['Limited destinations', 'Additional transfer needed', 'Weather dependent']
    }
  ];

  return (
    <section id="transfer-types" className="py-24 bg-white">
      <Container maxW="7xl">
        <VStack spacing={16} mb={16} textAlign="center">
          <Badge 
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-full text-sm font-bold"
          >
            <Icon as={SparklesIcon} className="w-4 h-4 mr-2" />
            Transportation Options
          </Badge>
          
          <Heading size="2xl" className="text-5xl md:text-6xl font-bold text-gray-900">
            Types of Transfers in Maldives
          </Heading>
          
          <Text className="text-xl text-gray-800 max-w-4xl mx-auto leading-relaxed">
            From budget-friendly ferries to luxury seaplane transfers, discover the perfect 
            transportation option for your Maldives adventure.
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
          {transferTypes.map((type) => (
            <Card 
              key={type.id}
              className="group hover:-translate-y-2 transition-all duration-500 border-2 border-gray-200 hover:border-gray-300 shadow-xl hover:shadow-2xl"
            >
              <CardHeader className="pb-4">
                <HStack spacing={4}>
                  <div className={`w-16 h-16 bg-gradient-to-br ${type.gradient} rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <Icon as={type.icon} className="w-8 h-8 text-white" />
                  </div>
                  <VStack align="start" spacing={2}>
                    <Heading size="lg" className="text-gray-900 font-bold">
                      {type.title}
                    </Heading>
                    <Text className="text-gray-600 font-medium">
                      {type.description}
                    </Text>
                  </VStack>
                </HStack>
              </CardHeader>
              
              <CardBody className="pt-0">
                <VStack spacing={6} align="stretch">
                  {/* Features */}
                  <Box>
                    <Text className="text-lg font-semibold text-gray-800 mb-3">Key Features</Text>
                    <List spacing={2}>
                      {type.features.map((feature, index) => (
                        <ListItem key={index} className="flex items-start">
                          <ListIcon as={CheckCircleIcon} color="green.500" className="mt-1 mr-3 flex-shrink-0" />
                          <Text className="text-gray-700">{feature}</Text>
                        </ListItem>
                      ))}
                    </List>
                  </Box>

                  <Divider />

                  {/* Pricing & Best For */}
                  <SimpleGrid columns={2} spacing={4}>
                    <Box>
                      <HStack spacing={2} mb={2}>
                        <Icon as={CurrencyDollarIcon} className="w-5 h-5 text-green-600" />
                        <Text className="font-semibold text-gray-800">Pricing</Text>
                      </HStack>
                      <Text className="text-gray-700 text-sm">{type.pricing}</Text>
                    </Box>
                    <Box>
                      <HStack spacing={2} mb={2}>
                        <Icon as={MapPinIcon} className="w-5 h-5 text-blue-600" />
                        <Text className="font-semibold text-gray-800">Best For</Text>
                      </HStack>
                      <Text className="text-gray-700 text-sm">{type.bestFor}</Text>
                    </Box>
                  </SimpleGrid>

                  <Divider />

                  {/* Pros & Cons */}
                  <SimpleGrid columns={2} spacing={4}>
                    <Box>
                      <Text className="font-semibold text-green-700 mb-2">Pros</Text>
                      <List spacing={1}>
                        {type.pros.map((pro, index) => (
                          <ListItem key={index} className="text-sm text-gray-700">
                            <ListIcon as={CheckCircleIcon} color="green.500" className="w-4 h-4" />
                            {pro}
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                    <Box>
                      <Text className="font-semibold text-red-700 mb-2">Cons</Text>
                      <List spacing={1}>
                        {type.cons.map((con, index) => (
                          <ListItem key={index} className="text-sm text-gray-700">
                            <ListIcon as={ExclamationTriangleIcon} color="red.500" className="w-4 h-4" />
                            {con}
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  </SimpleGrid>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      </Container>
    </section>
  );
});

TransferTypesSection.displayName = 'TransferTypesSection'; 