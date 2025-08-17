import React from 'react';
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

export const TransferFAQSection = React.memo(() => {
  const faqData = [
    {
      question: 'How to get to Maldives islands?',
      answer: 'To reach any island in the Maldives, you will require either a speedboat transfer or a domestic flight. The choice depends on your destination and budget. Speedboats are used for nearby islands and resorts, while domestic flights are used for inter-atoll travel to more distant locations.',
      category: 'General',
      icon: MapPinIcon
    },
    {
      question: 'Is there transfer service available at the international airport on arrival to book?',
      answer: 'No, everything needs to be pre-arranged before your arrival. However, if you are staying in Male or Hulhumale city, you can grab a taxi from the airport. All other islands require either a speedboat transfer or air transfer that must be booked in advance.',
      category: 'Booking',
      icon: ClockIcon
    },
    {
      question: 'Is it possible to visit islands by domestic flight?',
      answer: 'The total 200 inhabited islands and 158 resorts are divided into 20 atolls, and 15 atolls have domestic airports on mostly uninhabited islands. However, in many atolls, you will still require a speedboat transfer after arriving at the domestic airport to reach your final destination.',
      category: 'Transportation',
      icon: SparklesIcon
    },
    {
      question: 'What types of hotels are there in Maldives?',
      answer: 'Mostly there are village hotels and city hotels with 3-star and 4-star services. The Maldives offers a wide range of accommodation options from budget guesthouses on local islands to luxury overwater villas at exclusive resorts.',
      category: 'Accommodation',
      icon: UserGroupIcon
    },
    {
      question: 'Is it possible to book shared seaplane for any island?',
      answer: 'No. Shared seaplanes are operated on request for some resorts only. Only those resorts have the rights to book these seaplanes. However, we can arrange private seaplane transfers to any island for an additional cost.',
      category: 'Seaplane',
      icon: SparklesIcon
    },
    {
      question: 'Is it safe to travel by sea?',
      answer: 'I can tell you it\'s safer than flights. You will have floating life jackets on speedboats, but during stormy weather, it is not recommended to travel by very small boats. Some incidents have occurred, but so far not with any tourist transfers because we usually arrange bigger boats for tourists.',
      category: 'Safety',
      icon: CheckCircleIcon
    },
    {
      question: 'Why is the Maldives transfer so expensive?',
      answer: 'Because of the small populations and dispersity, it\'s very difficult to organize daily schedules on different times for an island. Additionally, speedboats consume a lot of fuel with high horsepower petrol engines to reduce travel time. The costs reflect the logistics and fuel expenses involved.',
      category: 'Pricing',
      icon: CurrencyDollarIcon
    },
    {
      question: 'When is the best time for sea transfers?',
      answer: 'During the Northeast monsoon (January to March), the sea is mostly very calm and flat. However, during other monsoon periods, we also have many calm and quiet days. It is very difficult to predict rough sea conditions in advance.',
      category: 'Weather',
      icon: ClockIcon
    },
    {
      question: 'What should I do if my transfer is delayed due to weather?',
      answer: 'If your transfer is delayed due to weather conditions, our team will keep you informed and arrange alternative transportation when safe. We recommend having flexible travel plans and allowing extra time for weather-related delays.',
      category: 'Weather',
      icon: ExclamationTriangleIcon
    },
    {
      question: 'Can I bring extra luggage on transfers?',
      answer: 'Luggage allowances vary by transfer type. Speedboats typically allow 20kg per person, while seaplanes have a 15kg limit. Additional luggage may incur extra charges. We recommend packing light and checking with us for specific requirements.',
      category: 'Luggage',
      icon: UserGroupIcon
    },
    {
      question: 'Do I need to tip the transfer crew?',
      answer: 'Tipping is not mandatory but appreciated for good service. A tip of $5-10 per person for speedboat transfers and $10-20 for seaplane transfers is customary. Tips can be given directly to the crew or included in your booking.',
      category: 'Etiquette',
      icon: CurrencyDollarIcon
    },
    {
      question: 'What happens if I miss my transfer?',
      answer: 'If you miss your scheduled transfer, contact us immediately. We will do our best to arrange an alternative transfer, but additional charges may apply. We recommend arriving at the airport with sufficient time to clear immigration and customs.',
      category: 'Booking',
      icon: ExclamationTriangleIcon
    }
  ];

  const categories = [
    { name: 'General', icon: InformationCircleIcon, color: 'blue' },
    { name: 'Booking', icon: ClockIcon, color: 'green' },
    { name: 'Transportation', icon: SparklesIcon, color: 'purple' },
    { name: 'Safety', icon: CheckCircleIcon, color: 'green' },
    { name: 'Pricing', icon: CurrencyDollarIcon, color: 'orange' },
    { name: 'Weather', icon: ExclamationTriangleIcon, color: 'red' },
    { name: 'Luggage', icon: UserGroupIcon, color: 'blue' },
    { name: 'Etiquette', icon: CurrencyDollarIcon, color: 'purple' },
  ];

  const getCategoryIcon = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category ? category.icon : InformationCircleIcon;
  };

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category ? category.color : 'blue';
  };

  return (
    <section id="faq" className="py-24 bg-white">
      <Container maxW="7xl">
        <VStack spacing={16} mb={16} textAlign="center">
          <Badge 
            className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-2 rounded-full text-sm font-bold"
          >
            <Icon as={InformationCircleIcon} className="w-4 h-4 mr-2" />
            Frequently Asked Questions
          </Badge>
          
          <Heading size="2xl" className="text-5xl md:text-6xl font-bold text-gray-900">
            Transfer FAQ
          </Heading>
          
          <Text className="text-xl text-gray-800 max-w-4xl mx-auto leading-relaxed">
            Find answers to the most common questions about transfers in the Maldives. 
            Everything you need to know about getting around the islands.
          </Text>
        </VStack>

        {/* FAQ Accordion */}
        <Accordion allowMultiple className="mb-16">
          {faqData.map((faq, index) => (
            <AccordionItem key={index} className="border-2 border-gray-200 rounded-lg mb-4 hover:border-blue-300 transition-all duration-300">
              <AccordionButton className="p-6 hover:bg-gray-50">
                <HStack spacing={4} flex="1" textAlign="left">
                  <Icon as={getCategoryIcon(faq.category)} className={`w-6 h-6 text-${getCategoryColor(faq.category)}-600`} />
                  <VStack align="start" spacing={1} flex="1">
                    <Text className="font-semibold text-gray-900 text-lg">
                      {faq.question}
                    </Text>
                    <Badge 
                      colorScheme={getCategoryColor(faq.category) as any}
                      className="text-xs"
                    >
                      {faq.category}
                    </Badge>
                  </VStack>
                  <AccordionIcon className="w-6 h-6 text-gray-500" />
                </HStack>
              </AccordionButton>
              <AccordionPanel className="px-6 pb-6">
                <Text className="text-gray-700 leading-relaxed">
                  {faq.answer}
                </Text>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Quick Tips */}
        <VStack spacing={12}>
          <VStack spacing={6} textAlign="center">
            <Heading size="xl" className="text-4xl font-bold text-gray-900">
              Quick Transfer Tips
            </Heading>
            <Text className="text-lg text-gray-700 max-w-3xl">
              Essential information to make your transfer experience smooth and enjoyable
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            <Card className="text-center p-6 border-2 border-blue-200 hover:border-blue-300 transition-all duration-300">
              <Icon as={ClockIcon} className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <Heading size="md" className="text-gray-900 mb-2">Book Early</Heading>
              <Text className="text-gray-700 text-sm">
                Arrange transfers at least 48 hours before arrival for best availability and rates.
              </Text>
            </Card>

            <Card className="text-center p-6 border-2 border-green-200 hover:border-green-300 transition-all duration-300">
              <Icon as={CheckCircleIcon} className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <Heading size="md" className="text-gray-900 mb-2">Safety First</Heading>
              <Text className="text-gray-700 text-sm">
                Always wear provided life jackets and follow crew safety instructions during transfers.
              </Text>
            </Card>

            <Card className="text-center p-6 border-2 border-purple-200 hover:border-purple-300 transition-all duration-300">
              <Icon as={CurrencyDollarIcon} className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <Heading size="md" className="text-gray-900 mb-2">Budget Wisely</Heading>
              <Text className="text-gray-700 text-sm">
                Factor transfer costs into your travel budget - they can be a significant expense.
              </Text>
            </Card>

            <Card className="text-center p-6 border-2 border-orange-200 hover:border-orange-300 transition-all duration-300">
              <Icon as={ExclamationTriangleIcon} className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <Heading size="md" className="text-gray-900 mb-2">Weather Aware</Heading>
              <Text className="text-gray-700 text-sm">
                Be prepared for weather delays and have flexible travel plans during monsoon seasons.
              </Text>
            </Card>
          </SimpleGrid>
        </VStack>

        {/* Contact Information */}
        <Alert status="info" className="mt-16 rounded-xl">
          <AlertIcon />
          <Box>
            <AlertTitle>Still Have Questions?</AlertTitle>
            <AlertDescription>
              If you couldn't find the answer to your question here, don't hesitate to contact us directly. 
              Our team is available 24/7 to help with any transfer-related inquiries.
            </AlertDescription>
          </Box>
        </Alert>

        {/* Additional Resources */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} className="mt-12">
          <Card className="shadow-lg border-2 border-blue-200">
            <CardHeader className="text-center">
              <Icon as={InformationCircleIcon} className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <Heading size="md" className="text-gray-900">
                Transfer Guide
              </Heading>
            </CardHeader>
            <CardBody className="text-center">
              <Text className="text-gray-700 mb-4">
                Complete step-by-step guide on how to arrange and use transfers in the Maldives.
              </Text>
              <Text className="text-sm text-gray-600">
                Includes arrival procedures, safety tips, and important information for a smooth experience.
              </Text>
            </CardBody>
          </Card>

          <Card className="shadow-lg border-2 border-green-200">
            <CardHeader className="text-center">
              <Icon as={CurrencyDollarIcon} className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <Heading size="md" className="text-gray-900">
                Pricing Guide
              </Heading>
            </CardHeader>
            <CardBody className="text-center">
              <Text className="text-gray-700 mb-4">
                Detailed pricing information for all types of transfers and transportation options.
              </Text>
              <Text className="text-sm text-gray-600">
                Understand costs, factors affecting pricing, and how to get the best value for your transfer.
              </Text>
            </CardBody>
          </Card>
        </SimpleGrid>
      </Container>
    </section>
  );
});

TransferFAQSection.displayName = 'TransferFAQSection'; 