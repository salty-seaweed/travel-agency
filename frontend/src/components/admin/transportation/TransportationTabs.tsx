import React, { useState } from 'react';
import {
  VStack, HStack, Text, Card, CardBody, CardHeader, Button, Badge, Icon,
  Table, Thead, Tbody, Tr, Th, Td, TableContainer, useColorModeValue,
  Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon,
  Box, SimpleGrid, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, ModalFooter,
  FormControl, FormLabel, Input, Textarea, Select, Switch, NumberInput, NumberInputField,
  NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, IconButton,
} from '@chakra-ui/react';
import {
  PencilIcon, TrashIcon, PlusIcon, InformationCircleIcon, ChatBubbleLeftRightIcon,
  ClockIcon, ShieldCheckIcon, CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import { 
  transferFaqsApi, transferContactMethodsApi, transferBookingStepsApi, 
  transferBenefitsApi, transferPricingFactorsApi, transferContentApi 
} from '../../../services/transportationApi';
import { useNotification } from '../../../hooks';
import { FAQModal } from './FAQModal';

// FAQs Tab
interface TransferFAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  icon: string;
  is_active: boolean;
  order: number;
}

export const FAQsTab: React.FC<{ data: TransferFAQ[] }> = ({ data }) => {
  const [selectedItem, setSelectedItem] = useState<TransferFAQ | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError } = useNotification();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleAdd = () => {
    setSelectedItem(null);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleEdit = (item: TransferFAQ) => {
    setSelectedItem(item);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this FAQ?')) {
      try {
        setIsLoading(true);
        await transferFaqsApi.delete(id);
        showSuccess('FAQ deleted successfully!');
        window.location.reload();
      } catch (error) {
        showError('Failed to delete FAQ');
        console.error('Delete error:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSave = async (formData: any) => {
    try {
      setIsLoading(true);
      if (isEditMode && selectedItem) {
        await transferFaqsApi.update(selectedItem.id, formData);
        showSuccess('FAQ updated successfully!');
      } else {
        await transferFaqsApi.create(formData);
        showSuccess('FAQ created successfully!');
      }
      setIsModalOpen(false);
      window.location.reload();
    } catch (error) {
      showError('Failed to save FAQ');
      console.error('Save error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <VStack spacing={6} align="stretch">
      <HStack justify="space-between">
        <Text fontSize="xl" fontWeight="bold">Frequently Asked Questions</Text>
        <Button 
          leftIcon={<Icon as={PlusIcon} className="w-4 h-4" />} 
          colorScheme="orange" 
          onClick={handleAdd}
          isDisabled={isLoading}
        >
          Add FAQ
        </Button>
      </HStack>

      <Card bg={bgColor} border="1px solid" borderColor={borderColor}>
        <CardHeader>
          <Text fontSize="lg" fontWeight="semibold">All FAQs</Text>
        </CardHeader>
        <CardBody>
          <Accordion allowMultiple>
            {data.map((faq) => (
              <AccordionItem key={faq.id}>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <HStack>
                      <Icon as={InformationCircleIcon} className="w-5 h-5" />
                      <Text fontWeight="semibold">{faq.question}</Text>
                      <Badge colorScheme={faq.is_active ? 'green' : 'red'}>
                        {faq.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge colorScheme="blue">{faq.category}</Badge>
                    </HStack>
                  </Box>
                  <HStack spacing={1} mr={2}>
                    <Box
                      as="div"
                      p={1}
                      borderRadius="md"
                      cursor="pointer"
                      _hover={{ bg: 'gray.100' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(faq);
                      }}
                      opacity={isLoading ? 0.5 : 1}
                      pointerEvents={isLoading ? 'none' : 'auto'}
                    >
                      <Icon as={PencilIcon} className="w-3 h-3" color="gray.600" />
                    </Box>
                    <Box
                      as="div"
                      p={1}
                      borderRadius="md"
                      cursor="pointer"
                      _hover={{ bg: 'red.50' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(faq.id);
                      }}
                      opacity={isLoading ? 0.5 : 1}
                      pointerEvents={isLoading ? 'none' : 'auto'}
                    >
                      <Icon as={TrashIcon} className="w-3 h-3" color="red.500" />
                    </Box>
                  </HStack>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <VStack spacing={4} align="stretch">
                    <Text>{faq.answer}</Text>
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </CardBody>
      </Card>

      {/* FAQ Modal */}
      <FAQModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        faq={selectedItem}
        isEditMode={isEditMode}
        onSave={handleSave}
        isLoading={isLoading}
      />
    </VStack>
  );
};

// Contact Methods Tab
interface TransferContactMethod {
  id: number;
  method: string;
  icon: string;
  color: string;
  contact: string;
  description: string;
  response_time: string;
  is_active: boolean;
  order: number;
}

export const ContactMethodsTab: React.FC<{ data: TransferContactMethod[] }> = ({ data }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <VStack spacing={6} align="stretch">
      <HStack justify="space-between">
        <Text fontSize="xl" fontWeight="bold">Contact Methods</Text>
        <Button leftIcon={<Icon as={PlusIcon} className="w-4 h-4" />} colorScheme="teal">
          Add Contact Method
        </Button>
      </HStack>

      <Card bg={bgColor} border="1px solid" borderColor={borderColor}>
        <CardHeader>
          <Text fontSize="lg" fontWeight="semibold">All Contact Methods</Text>
        </CardHeader>
        <CardBody>
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Method</Th>
                  <Th>Contact</Th>
                  <Th>Response Time</Th>
                  <Th>Description</Th>
                  <Th>Status</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.map((method) => (
                  <Tr key={method.id}>
                    <Td>
                      <HStack>
                        <Icon as={ChatBubbleLeftRightIcon} className="w-4 h-4" />
                        <Text fontWeight="medium">{method.method}</Text>
                      </HStack>
                    </Td>
                    <Td>{method.contact}</Td>
                    <Td>{method.response_time}</Td>
                    <Td>
                      <Text noOfLines={2}>{method.description}</Text>
                    </Td>
                    <Td>
                      <Badge colorScheme={method.is_active ? 'green' : 'red'}>
                        {method.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </Td>
                    <Td>
                      <HStack spacing={2}>
                        <Button size="sm" variant="ghost">
                          <Icon as={PencilIcon} className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" colorScheme="red">
                          <Icon as={TrashIcon} className="w-4 h-4" />
                        </Button>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </CardBody>
      </Card>
    </VStack>
  );
};

// Booking Steps Tab
interface TransferBookingStep {
  id: number;
  step_number: number;
  title: string;
  description: string;
  icon: string;
  details: string[];
  tips: string;
  is_active: boolean;
}

export const BookingStepsTab: React.FC<{ data: TransferBookingStep[] }> = ({ data }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <VStack spacing={6} align="stretch">
      <HStack justify="space-between">
        <Text fontSize="xl" fontWeight="bold">Booking Steps</Text>
        <Button leftIcon={<Icon as={PlusIcon} className="w-4 h-4" />} colorScheme="blue">
          Add Booking Step
        </Button>
      </HStack>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        {data.map((step) => (
          <Card key={step.id} bg={bgColor} border="1px solid" borderColor={borderColor}>
            <CardHeader>
              <HStack justify="space-between">
                <HStack>
                  <Icon as={ClockIcon} className="w-5 h-5" />
                  <Text fontWeight="semibold">Step {step.step_number}</Text>
                </HStack>
                <Badge colorScheme={step.is_active ? 'green' : 'red'}>
                  {step.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </HStack>
              <Text fontSize="lg" fontWeight="bold">{step.title}</Text>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Text>{step.description}</Text>
                {step.details.length > 0 && (
                  <Box>
                    <Text fontWeight="semibold" mb={2}>Details:</Text>
                    <VStack align="stretch" spacing={1}>
                      {step.details.map((detail, index) => (
                        <Text key={index} fontSize="sm" color="gray.600">• {detail}</Text>
                      ))}
                    </VStack>
                  </Box>
                )}
                {step.tips && (
                  <Box>
                    <Text fontWeight="semibold" mb={2}>Tips:</Text>
                    <Text fontSize="sm" color="gray.600">{step.tips}</Text>
                  </Box>
                )}
                <HStack spacing={2}>
                  <Button size="sm" variant="ghost">
                    <Icon as={PencilIcon} className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" colorScheme="red">
                    <Icon as={TrashIcon} className="w-4 h-4" />
                  </Button>
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
    </VStack>
  );
};

// Benefits Tab
interface TransferBenefit {
  id: number;
  benefit: string;
  description: string;
  icon: string;
  color: string;
  is_active: boolean;
  order: number;
}

export const BenefitsTab: React.FC<{ data: TransferBenefit[] }> = ({ data }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <VStack spacing={6} align="stretch">
      <HStack justify="space-between">
        <Text fontSize="xl" fontWeight="bold">Benefits</Text>
        <Button leftIcon={<Icon as={PlusIcon} className="w-4 h-4" />} colorScheme="green">
          Add Benefit
        </Button>
      </HStack>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {data.map((benefit) => (
          <Card key={benefit.id} bg={bgColor} border="1px solid" borderColor={borderColor}>
            <CardHeader>
              <HStack justify="space-between">
                <HStack>
                  <Icon as={ShieldCheckIcon} className="w-5 h-5" />
                  <Text fontWeight="semibold">{benefit.benefit}</Text>
                </HStack>
                <Badge colorScheme={benefit.is_active ? 'green' : 'red'}>
                  {benefit.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </HStack>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Text>{benefit.description}</Text>
                <HStack spacing={2}>
                  <Button size="sm" variant="ghost">
                    <Icon as={PencilIcon} className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" colorScheme="red">
                    <Icon as={TrashIcon} className="w-4 h-4" />
                  </Button>
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
    </VStack>
  );
};

// Pricing Factors Tab
interface TransferPricingFactor {
  id: number;
  factor: string;
  description: string;
  icon: string;
  impact: string;
  examples: string[];
  is_active: boolean;
  order: number;
}

export const PricingFactorsTab: React.FC<{ data: TransferPricingFactor[] }> = ({ data }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <VStack spacing={6} align="stretch">
      <HStack justify="space-between">
        <Text fontSize="xl" fontWeight="bold">Pricing Factors</Text>
        <Button leftIcon={<Icon as={PlusIcon} className="w-4 h-4" />} colorScheme="purple">
          Add Pricing Factor
        </Button>
      </HStack>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        {data.map((factor) => (
          <Card key={factor.id} bg={bgColor} border="1px solid" borderColor={borderColor}>
            <CardHeader>
              <HStack justify="space-between">
                <HStack>
                  <Icon as={CurrencyDollarIcon} className="w-5 h-5" />
                  <Text fontWeight="semibold">{factor.factor}</Text>
                </HStack>
                <Badge colorScheme={factor.is_active ? 'green' : 'red'}>
                  {factor.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </HStack>
              <Badge colorScheme="blue">{factor.impact} Impact</Badge>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Text>{factor.description}</Text>
                {factor.examples.length > 0 && (
                  <Box>
                    <Text fontWeight="semibold" mb={2}>Examples:</Text>
                    <VStack align="stretch" spacing={1}>
                      {factor.examples.map((example, index) => (
                        <Text key={index} fontSize="sm" color="gray.600">• {example}</Text>
                      ))}
                    </VStack>
                  </Box>
                )}
                <HStack spacing={2}>
                  <Button size="sm" variant="ghost">
                    <Icon as={PencilIcon} className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" colorScheme="red">
                    <Icon as={TrashIcon} className="w-4 h-4" />
                  </Button>
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
    </VStack>
  );
};

// Content Tab
interface TransferContent {
  id: number;
  section: string;
  title: string;
  subtitle: string;
  description: string;
  badge_text: string;
  badge_icon: string;
  is_active: boolean;
  order: number;
}

export const ContentTab: React.FC<{ data: TransferContent[] }> = ({ data }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <VStack spacing={6} align="stretch">
      <HStack justify="space-between">
        <Text fontSize="xl" fontWeight="bold">Content Sections</Text>
        <Button leftIcon={<Icon as={PlusIcon} className="w-4 h-4" />} colorScheme="blue">
          Add Content Section
        </Button>
      </HStack>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        {data.map((content) => (
          <Card key={content.id} bg={bgColor} border="1px solid" borderColor={borderColor}>
            <CardHeader>
              <HStack justify="space-between">
                <HStack>
                  <Icon as={InformationCircleIcon} className="w-5 h-5" />
                  <Text fontWeight="semibold">{content.section}</Text>
                </HStack>
                <Badge colorScheme={content.is_active ? 'green' : 'red'}>
                  {content.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </HStack>
              <Text fontSize="lg" fontWeight="bold">{content.title}</Text>
              {content.subtitle && (
                <Text fontSize="md" color="gray.600">{content.subtitle}</Text>
              )}
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Text>{content.description}</Text>
                <HStack>
                  <Badge colorScheme="blue">{content.badge_text}</Badge>
                  <Text fontSize="sm" color="gray.500">Icon: {content.badge_icon}</Text>
                </HStack>
                <HStack spacing={2}>
                  <Button size="sm" variant="ghost">
                    <Icon as={PencilIcon} className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" colorScheme="red">
                    <Icon as={TrashIcon} className="w-4 h-4" />
                  </Button>
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
    </VStack>
  );
}; 