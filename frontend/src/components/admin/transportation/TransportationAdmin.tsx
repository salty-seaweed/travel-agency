import React, { useState } from 'react';
import {
  Box, Container, VStack, Heading, Text, SimpleGrid, Card, CardBody, CardHeader,
  Button, HStack, Badge, Icon, useColorModeValue, Tabs, TabList, TabPanels, Tab, TabPanel,
  Stat, StatLabel, StatNumber, StatHelpText, StatArrow,
} from '@chakra-ui/react';
import {
  SparklesIcon, MapPinIcon, ChatBubbleLeftRightIcon, CurrencyDollarIcon,
  InformationCircleIcon, ClockIcon, ShieldCheckIcon, UserGroupIcon,
  PlusIcon, PencilIcon, EyeIcon, TrashIcon,
} from '@heroicons/react/24/outline';
import { useTransportationData } from '../../../hooks/useTransportationData';
import { TransferTypesTab } from './TransferTypesTab';
import { AtollsResortsTab } from './AtollsResortsTab';
import { 
  FAQsTab, 
  ContactMethodsTab, 
  BookingStepsTab, 
  BenefitsTab, 
  PricingFactorsTab, 
  ContentTab 
} from './TransportationTabs';
import { useNotification } from '../../../hooks';

export const TransportationAdmin = React.memo(() => {
  const { data, isLoading, error } = useTransportationData();
  const [activeTab, setActiveTab] = useState(0);
  const { showSuccess, showError } = useNotification();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'transfer-type':
        setActiveTab(0); // Transfer Types tab
        showSuccess('Navigate to Transfer Types tab to add new transfer type');
        break;
      case 'atoll':
        setActiveTab(1); // Atolls & Resorts tab
        showSuccess('Navigate to Atolls & Resorts tab to add new atoll');
        break;
      case 'resort':
        setActiveTab(1); // Atolls & Resorts tab
        showSuccess('Navigate to Atolls & Resorts tab to add new resort');
        break;
      case 'faq':
        setActiveTab(2); // FAQs tab
        showSuccess('Navigate to FAQs tab to add new FAQ');
        break;
      case 'contact':
        setActiveTab(3); // Contact Methods tab
        showSuccess('Navigate to Contact Methods tab to add new contact method');
        break;
      default:
        showError('Action not implemented yet');
    }
  };

  if (isLoading) {
    return (
      <Container maxW="7xl" py={8}>
        <VStack spacing={6}>
          <Text>Loading transportation data...</Text>
        </VStack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="7xl" py={8}>
        <VStack spacing={6}>
          <Text color="red.500">Error loading transportation data: {error}</Text>
        </VStack>
      </Container>
    );
  }

  const stats = [
    {
      label: 'Transfer Types',
      value: data?.transfer_types?.length || 0,
      icon: SparklesIcon,
      color: 'blue',
    },
    {
      label: 'Atolls',
      value: data?.atoll_transfers?.length || 0,
      icon: MapPinIcon,
      color: 'green',
    },
    {
      label: 'Resorts',
      value: data?.atoll_transfers?.reduce((acc, atoll) => acc + atoll.resorts.length, 0) || 0,
      icon: UserGroupIcon,
      color: 'purple',
    },
    {
      label: 'FAQs',
      value: data?.faqs?.length || 0,
      icon: InformationCircleIcon,
      color: 'orange',
    },
    {
      label: 'Contact Methods',
      value: data?.contact_methods?.length || 0,
      icon: ChatBubbleLeftRightIcon,
      color: 'teal',
    },
    {
      label: 'Booking Steps',
      value: data?.booking_steps?.length || 0,
      icon: ClockIcon,
      color: 'pink',
    },
  ];

  return (
    <Container maxW="7xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Box>
          <Heading size="2xl" mb={2}>Transportation Management</Heading>
          <Text color="gray.600" fontSize="lg">
            Manage all transportation content, pricing, and information
          </Text>
        </Box>

        {/* Stats Overview */}
        <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={6}>
          {stats.map((stat, index) => (
            <Card key={index} bg={bgColor} border="1px solid" borderColor={borderColor}>
              <CardBody>
                <Stat>
                  <HStack spacing={3} mb={2}>
                    <Icon as={stat.icon} className={`w-6 h-6 text-${stat.color}-500`} />
                    <StatLabel fontSize="sm" color="gray.600">{stat.label}</StatLabel>
                  </HStack>
                  <StatNumber fontSize="2xl" fontWeight="bold">{stat.value}</StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    Active
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>

        {/* Quick Actions */}
        <Card bg={bgColor} border="1px solid" borderColor={borderColor}>
          <CardHeader>
            <Heading size="md">Quick Actions</Heading>
          </CardHeader>
          <CardBody>
            <HStack spacing={4} flexWrap="wrap">
              <Button 
                leftIcon={<Icon as={PlusIcon} className="w-4 h-4" />} 
                colorScheme="blue"
                onClick={() => handleQuickAction('transfer-type')}
              >
                Add Transfer Type
              </Button>
              <Button 
                leftIcon={<Icon as={PlusIcon} className="w-4 h-4" />} 
                colorScheme="green"
                onClick={() => handleQuickAction('atoll')}
              >
                Add Atoll
              </Button>
              <Button 
                leftIcon={<Icon as={PlusIcon} className="w-4 h-4" />} 
                colorScheme="purple"
                onClick={() => handleQuickAction('resort')}
              >
                Add Resort
              </Button>
              <Button 
                leftIcon={<Icon as={PlusIcon} className="w-4 h-4" />} 
                colorScheme="orange"
                onClick={() => handleQuickAction('faq')}
              >
                Add FAQ
              </Button>
              <Button 
                leftIcon={<Icon as={PlusIcon} className="w-4 h-4" />} 
                colorScheme="teal"
                onClick={() => handleQuickAction('contact')}
              >
                Add Contact Method
              </Button>
            </HStack>
          </CardBody>
        </Card>

        {/* Main Content Tabs */}
        <Card bg={bgColor} border="1px solid" borderColor={borderColor}>
          <CardBody>
            <Tabs index={activeTab} onChange={setActiveTab}>
              <TabList>
                <Tab>Transfer Types</Tab>
                <Tab>Atolls & Resorts</Tab>
                <Tab>FAQs</Tab>
                <Tab>Contact Methods</Tab>
                <Tab>Booking Steps</Tab>
                <Tab>Benefits</Tab>
                <Tab>Pricing Factors</Tab>
                <Tab>Content</Tab>
              </TabList>

              <TabPanels>
                {/* Transfer Types Tab */}
                <TabPanel>
                  <TransferTypesTab data={data?.transfer_types || []} />
                </TabPanel>

                {/* Atolls & Resorts Tab */}
                <TabPanel>
                  <AtollsResortsTab data={data?.atoll_transfers || []} />
                </TabPanel>

                {/* FAQs Tab */}
                <TabPanel>
                  <FAQsTab data={data?.faqs || []} />
                </TabPanel>

                {/* Contact Methods Tab */}
                <TabPanel>
                  <ContactMethodsTab data={data?.contact_methods || []} />
                </TabPanel>

                {/* Booking Steps Tab */}
                <TabPanel>
                  <BookingStepsTab data={data?.booking_steps || []} />
                </TabPanel>

                {/* Benefits Tab */}
                <TabPanel>
                  <BenefitsTab data={data?.benefits || []} />
                </TabPanel>

                {/* Pricing Factors Tab */}
                <TabPanel>
                  <PricingFactorsTab data={data?.pricing_factors || []} />
                </TabPanel>

                {/* Content Tab */}
                <TabPanel>
                  <ContentTab data={data?.content || []} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
});

TransportationAdmin.displayName = 'TransportationAdmin'; 