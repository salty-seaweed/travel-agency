import React, { useState, useRef } from 'react';
import {
  Box, Container, VStack, Heading, Text, SimpleGrid, Card, CardBody, CardHeader,
  Button, HStack, Icon, useColorModeValue, Tabs, TabList, TabPanels, Tab, TabPanel,
  Stat, StatLabel, StatNumber, StatHelpText, StatArrow, useToast, Modal, ModalOverlay,
  ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, useDisclosure,
  Alert, AlertIcon, Progress, Input, FormControl, FormLabel,
} from '@chakra-ui/react';
import {
  SparklesIcon, MapPinIcon, ChatBubbleLeftRightIcon,
  InformationCircleIcon, ClockIcon, UserGroupIcon,
  PlusIcon, DocumentArrowDownIcon, DocumentArrowUpIcon,
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
  const { data, isLoading, error, refetch } = useTransportationData();
  const [activeTab, setActiveTab] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const { showSuccess, showError } = useNotification();
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isOpen: isImportModalOpen, onOpen: onImportModalOpen, onClose: onImportModalClose } = useDisclosure();

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

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const token = localStorage.getItem('access');
      const response = await fetch('/api/transportation/export/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to export transportation data');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `transportation-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: 'Export Successful',
        description: 'Transportation data has been exported successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: error instanceof Error ? error.message : 'Failed to export data',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportData = async (file: File) => {
    setIsImporting(true);
    setImportProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('access');
      const response = await fetch('/api/transportation/import/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to import transportation data');
      }

      const result = await response.json();
      
      toast({
        title: 'Import Successful',
        description: `Successfully imported ${result.imported_count || 0} transportation records`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Refresh the data
      refetch();
      onImportModalClose();
    } catch (error) {
      toast({
        title: 'Import Failed',
        description: error instanceof Error ? error.message : 'Failed to import data',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsImporting(false);
      setImportProgress(0);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
        toast({
          title: 'Invalid File Type',
          description: 'Please select a JSON file',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      handleImportData(file);
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
            <VStack spacing={4} align="stretch">
              {/* Add Actions */}
              <Box>
                <Text fontSize="sm" color="gray.600" mb={3} fontWeight="medium">Add New Items</Text>
                <HStack spacing={4} flexWrap="wrap">
                  <Button 
                    leftIcon={<Icon as={PlusIcon} className="w-4 h-4" />} 
                    colorScheme="blue"
                    size="sm"
                    onClick={() => handleQuickAction('transfer-type')}
                  >
                    Add Transfer Type
                  </Button>
                  <Button 
                    leftIcon={<Icon as={PlusIcon} className="w-4 h-4" />} 
                    colorScheme="green"
                    size="sm"
                    onClick={() => handleQuickAction('atoll')}
                  >
                    Add Atoll
                  </Button>
                  <Button 
                    leftIcon={<Icon as={PlusIcon} className="w-4 h-4" />} 
                    colorScheme="purple"
                    size="sm"
                    onClick={() => handleQuickAction('resort')}
                  >
                    Add Resort
                  </Button>
                  <Button 
                    leftIcon={<Icon as={PlusIcon} className="w-4 h-4" />} 
                    colorScheme="orange"
                    size="sm"
                    onClick={() => handleQuickAction('faq')}
                  >
                    Add FAQ
                  </Button>
                  <Button 
                    leftIcon={<Icon as={PlusIcon} className="w-4 h-4" />} 
                    colorScheme="teal"
                    size="sm"
                    onClick={() => handleQuickAction('contact')}
                  >
                    Add Contact Method
                  </Button>
                </HStack>
              </Box>

              {/* Data Management Actions */}
              <Box>
                <Text fontSize="sm" color="gray.600" mb={3} fontWeight="medium">Data Management</Text>
                <HStack spacing={4} flexWrap="wrap">
                  <Button 
                    leftIcon={<Icon as={DocumentArrowDownIcon} className="w-4 h-4" />} 
                    colorScheme="cyan"
                    variant="outline"
                    size="sm"
                    onClick={handleExportData}
                    isLoading={isExporting}
                    loadingText="Exporting..."
                  >
                    Export All Data
                  </Button>
                  <Button 
                    leftIcon={<Icon as={DocumentArrowUpIcon} className="w-4 h-4" />} 
                    colorScheme="pink"
                    variant="outline"
                    size="sm"
                    onClick={onImportModalOpen}
                  >
                    Import Data
                  </Button>
                </HStack>
              </Box>
            </VStack>
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

      {/* Import Modal */}
      <Modal isOpen={isImportModalOpen} onClose={onImportModalClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Import Transportation Data</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={6}>
              <Alert status="info">
                <AlertIcon />
                <VStack align="start" spacing={2}>
                  <Text fontWeight="medium">Import Instructions</Text>
                  <Text fontSize="sm">
                    Upload a JSON file containing transportation data. This will replace existing data, 
                    so make sure to export your current data first as a backup.
                  </Text>
                </VStack>
              </Alert>

              {isImporting ? (
                <VStack spacing={4} w="full">
                  <Text>Importing data...</Text>
                  <Progress value={importProgress} size="lg" colorScheme="blue" w="full" />
                  <Text fontSize="sm" color="gray.600">
                    Please wait while we process your data...
                  </Text>
                </VStack>
              ) : (
                <VStack spacing={4} w="full">
                  <FormControl>
                    <FormLabel>Select JSON File</FormLabel>
                    <Input
                      ref={fileInputRef}
                      type="file"
                      accept=".json,application/json"
                      onChange={handleFileSelect}
                      p={1}
                    />
                  </FormControl>
                  
                  <Box
                    border="2px dashed"
                    borderColor="gray.300"
                    borderRadius="lg"
                    p={8}
                    textAlign="center"
                    w="full"
                    _hover={{ borderColor: "blue.400" }}
                    transition="border-color 0.2s"
                    cursor="pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <VStack spacing={3}>
                      <DocumentArrowUpIcon className="w-12 h-12 text-gray-400" />
                      <VStack spacing={1}>
                        <Text fontWeight="medium">Click to select file</Text>
                        <Text fontSize="sm" color="gray.500">
                          Or drag and drop your JSON file here
                        </Text>
                      </VStack>
                    </VStack>
                  </Box>
                </VStack>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack spacing={3}>
              <Button variant="ghost" onClick={onImportModalClose} isDisabled={isImporting}>
                Cancel
              </Button>
              <Button 
                colorScheme="blue" 
                onClick={handleExportData}
                isDisabled={isImporting}
                leftIcon={<DocumentArrowDownIcon className="w-4 h-4" />}
              >
                Export Current Data First
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
});

TransportationAdmin.displayName = 'TransportationAdmin'; 