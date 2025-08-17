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
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  OrderedList,
} from '@chakra-ui/react';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  SparklesIcon,
  ShieldCheckIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

export const TransferGuideSection = React.memo(() => {
  const guideSteps = [
    {
      step: 1,
      title: 'Pre-Arrival Booking',
      description: 'Arrange your transfer before arriving in the Maldives',
      icon: ShieldCheckIcon,
      details: [
        'Contact us at least 48 hours before arrival',
        'Provide flight details and arrival time',
        'Confirm resort/hotel destination',
        'Receive transfer confirmation',
        'Save emergency contact numbers'
      ],
      tips: 'Early booking ensures availability and better rates'
    },
    {
      step: 2,
      title: 'Airport Arrival',
      description: 'What to expect when you arrive at Male International Airport',
      icon: MapPinIcon,
      details: [
        'Clear immigration and customs',
        'Collect luggage from baggage claim',
        'Look for our representative with signboard',
        'Proceed to transfer counter if needed',
        'Wait for transfer vehicle/boat'
      ],
      tips: 'Our team will be waiting with your name on a signboard'
    },
    {
      step: 3,
      title: 'Transfer Process',
      description: 'The actual transfer journey to your destination',
      icon: SparklesIcon,
      details: [
        'Board the designated transfer vehicle',
        'Safety briefing and life jacket fitting',
        'Comfortable journey with refreshments',
        'Arrival at your destination',
        'Assistance with luggage'
      ],
      tips: 'All transfers include safety equipment and professional crew'
    },
    {
      step: 4,
      title: 'Return Transfer',
      description: 'Arranging your departure transfer',
      icon: ClockIcon,
      details: [
        'Confirm departure time with resort',
        'Coordinate with flight departure time',
        'Pack and prepare for departure',
        'Board return transfer vehicle',
        'Arrive at airport with sufficient time'
      ],
      tips: 'Allow extra time for weather delays and security checks'
    }
  ];

  const importantTips = [
    {
      category: 'Booking Tips',
      icon: ShieldCheckIcon,
      color: 'blue',
      tips: [
        'Book transfers at least 48 hours in advance',
        'Provide accurate flight information',
        'Include special requirements in booking',
        'Keep confirmation details handy',
        'Have emergency contact numbers saved'
      ]
    },
    {
      category: 'Packing Tips',
      icon: UserGroupIcon,
      color: 'green',
      tips: [
        'Pack light for speedboat transfers',
        'Use waterproof bags for electronics',
        'Bring motion sickness medication if needed',
        'Wear comfortable, quick-dry clothing',
        'Keep important documents easily accessible'
      ]
    },
    {
      category: 'Safety Tips',
      icon: ExclamationTriangleIcon,
      color: 'red',
      tips: [
        'Always wear provided life jackets',
        'Follow crew safety instructions',
        'Stay seated during the journey',
        'Keep children supervised at all times',
        'Report any concerns to crew immediately'
      ]
    }
  ];

  return (
    <section id="transfer-guide" className="py-24 bg-white">
      <Container maxW="7xl">
        <VStack spacing={16} mb={16} textAlign="center">
          <Badge 
            className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-bold"
          >
            <Icon as={InformationCircleIcon} className="w-4 h-4 mr-2" />
            Complete Transfer Guide
          </Badge>
          
          <Heading size="2xl" className="text-5xl md:text-6xl font-bold text-gray-900">
            How to Arrange Your Transfer
          </Heading>
          
          <Text className="text-xl text-gray-800 max-w-4xl mx-auto leading-relaxed">
            A step-by-step guide to arranging and using transfers in the Maldives. 
            From pre-booking to arrival, we cover everything you need to know.
          </Text>
        </VStack>

        {/* Step-by-Step Guide */}
        <VStack spacing={8} mb={16}>
          {guideSteps.map((step) => (
            <Card key={step.step} className="w-full shadow-xl border-2 border-gray-200 hover:border-blue-300 transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <HStack spacing={4}>
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl">
                    {step.step}
                  </div>
                  <VStack align="start" spacing={2}>
                    <Heading size="lg" className="text-gray-900">
                      {step.title}
                    </Heading>
                    <Text className="text-gray-600 font-medium">
                      {step.description}
                    </Text>
                  </VStack>
                </HStack>
              </CardHeader>
              
              <CardBody>
                <VStack spacing={6} align="stretch">
                  <Box>
                    <Text className="text-lg font-semibold text-gray-800 mb-3">What to Expect</Text>
                    <OrderedList spacing={2}>
                      {step.details.map((detail, index) => (
                        <ListItem key={index} className="text-gray-700">
                          {detail}
                        </ListItem>
                      ))}
                    </OrderedList>
                  </Box>
                  
                  <Alert status="info" className="rounded-lg">
                    <AlertIcon />
                    <Box>
                      <AlertTitle>Pro Tip</AlertTitle>
                      <AlertDescription>{step.tips}</AlertDescription>
                    </Box>
                  </Alert>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </VStack>

        {/* Important Tips */}
        <VStack spacing={12}>
          <VStack spacing={6} textAlign="center">
            <Heading size="xl" className="text-4xl font-bold text-gray-900">
              Important Tips & Guidelines
            </Heading>
            <Text className="text-lg text-gray-700 max-w-3xl">
              Essential information to ensure a smooth and enjoyable transfer experience
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={8}>
            {importantTips.map((category) => (
              <Card key={category.category} className="shadow-lg border-2 border-gray-200">
                <CardHeader className="text-center pb-4">
                  <Icon as={category.icon} className={`w-12 h-12 text-${category.color}-600 mx-auto mb-4`} />
                  <Heading size="md" className="text-gray-900">
                    {category.category}
                  </Heading>
                </CardHeader>
                
                <CardBody className="pt-0">
                  <List spacing={3}>
                    {category.tips.map((tip, index) => (
                      <ListItem key={index} className="flex items-start">
                        <ListIcon as={CheckCircleIcon} color={`${category.color}.500`} className="mt-1 mr-3 flex-shrink-0" />
                        <Text className="text-gray-700">{tip}</Text>
                      </ListItem>
                    ))}
                  </List>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </VStack>

        {/* Emergency Information */}
        <Card className="mt-16 shadow-2xl border-2 border-red-200 bg-gradient-to-r from-red-50 to-pink-50">
          <CardHeader className="text-center">
            <HStack spacing={4} justify="center">
              <Icon as={ExclamationTriangleIcon} className="w-8 h-8 text-red-600" />
              <Heading size="lg" className="text-red-800">
                Emergency Contact Information
              </Heading>
            </HStack>
          </CardHeader>
          
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <Box>
                <HStack spacing={3} mb={3}>
                  <Icon as={PhoneIcon} className="w-5 h-5 text-blue-600" />
                  <Text className="font-semibold text-gray-800">Emergency Hotline</Text>
                </HStack>
                <Text className="text-gray-700">+960 777-7777 (24/7)</Text>
              </Box>
              
              <Box>
                <HStack spacing={3} mb={3}>
                  <Icon as={EnvelopeIcon} className="w-5 h-5 text-green-600" />
                  <Text className="font-semibold text-gray-800">Email Support</Text>
                </HStack>
                <Text className="text-gray-700">transfers@threadtravels.com</Text>
              </Box>
              
              <Box>
                <HStack spacing={3} mb={3}>
                  <Icon as={MapPinIcon} className="w-5 h-5 text-purple-600" />
                  <Text className="font-semibold text-gray-800">Airport Counter</Text>
                </HStack>
                <Text className="text-gray-700">Counter #7 (Ministry of Tourism)</Text>
              </Box>
              
              <Box>
                <HStack spacing={3} mb={3}>
                  <Icon as={ClockIcon} className="w-5 h-5 text-orange-600" />
                  <Text className="font-semibold text-gray-800">Response Time</Text>
                </HStack>
                <Text className="text-gray-700">Within 10 minutes of contact</Text>
              </Box>
            </SimpleGrid>
          </CardBody>
        </Card>
      </Container>
    </section>
  );
});

TransferGuideSection.displayName = 'TransferGuideSection'; 