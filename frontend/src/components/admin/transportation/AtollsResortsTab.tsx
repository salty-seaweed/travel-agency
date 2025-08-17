import React, { useState } from 'react';
import {
  VStack, HStack, Text, Card, CardBody, CardHeader, Button, Badge, Icon,
  Table, Thead, Tbody, Tr, Th, Td, TableContainer, useColorModeValue,
  Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon,
  Box, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, ModalFooter,
  FormControl, FormLabel, Input, Textarea, Select, Switch, NumberInput, NumberInputField,
  NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper,
} from '@chakra-ui/react';
import {
  PencilIcon, TrashIcon, PlusIcon, MapPinIcon,
} from '@heroicons/react/24/outline';
import { atollTransfersApi, resortTransfersApi } from '../../../services/transportationApi';
import { useNotification } from '../../../hooks';

interface ResortTransfer {
  id: number;
  resort_name: string;
  price: number;
  duration: string;
  transfer_type: string;
  is_active: boolean;
  order: number;
  atoll: string;
}

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

interface AtollsResortsTabProps {
  data: AtollTransfer[];
}

export const AtollsResortsTab: React.FC<AtollsResortsTabProps> = ({ data }) => {
  const [selectedAtoll, setSelectedAtoll] = useState<AtollTransfer | null>(null);
  const [selectedResort, setSelectedResort] = useState<ResortTransfer | null>(null);
  const [isAtollModalOpen, setIsAtollModalOpen] = useState(false);
  const [isResortModalOpen, setIsResortModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError } = useNotification();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleAddAtoll = () => {
    setSelectedAtoll(null);
    setIsEditMode(false);
    setIsAtollModalOpen(true);
  };

  const handleEditAtoll = (atoll: AtollTransfer) => {
    setSelectedAtoll(atoll);
    setIsEditMode(true);
    setIsAtollModalOpen(true);
  };

  const handleDeleteAtoll = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this atoll?')) {
      try {
        setIsLoading(true);
        await atollTransfersApi.delete(id);
        showSuccess('Atoll deleted successfully!');
        window.location.reload();
      } catch (error) {
        showError('Failed to delete atoll');
        console.error('Delete error:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSaveAtoll = async (formData: any) => {
    try {
      setIsLoading(true);
      if (isEditMode && selectedAtoll) {
        await atollTransfersApi.update(selectedAtoll.id, formData);
        showSuccess('Atoll updated successfully!');
      } else {
        await atollTransfersApi.create(formData);
        showSuccess('Atoll created successfully!');
      }
      setIsAtollModalOpen(false);
      window.location.reload();
    } catch (error) {
      showError('Failed to save atoll');
      console.error('Save error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddResort = (atollId: number) => {
    setSelectedResort(null);
    setIsEditMode(false);
    setSelectedAtoll(data.find(a => a.id === atollId) || null);
    setIsResortModalOpen(true);
  };

  const handleEditResort = (resort: ResortTransfer) => {
    setSelectedResort(resort);
    setIsEditMode(true);
    setIsResortModalOpen(true);
  };

  const handleDeleteResort = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this resort?')) {
      try {
        setIsLoading(true);
        await resortTransfersApi.delete(id);
        showSuccess('Resort deleted successfully!');
        window.location.reload();
      } catch (error) {
        showError('Failed to delete resort');
        console.error('Delete error:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSaveResort = async (formData: any) => {
    try {
      setIsLoading(true);
      if (isEditMode && selectedResort) {
        await resortTransfersApi.update(selectedResort.id, formData);
        showSuccess('Resort updated successfully!');
      } else {
        // Add the atoll ID to the form data for new resorts
        if (selectedAtoll) {
          formData.atoll = selectedAtoll.id;
        }
        await resortTransfersApi.create(formData);
        showSuccess('Resort created successfully!');
      }
      setIsResortModalOpen(false);
      window.location.reload();
    } catch (error) {
      showError('Failed to save resort');
      console.error('Save error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <VStack spacing={6} align="stretch">
      <HStack justify="space-between">
        <Text fontSize="xl" fontWeight="bold">Atolls & Resorts</Text>
        <HStack spacing={2}>
          <Button 
            leftIcon={<Icon as={PlusIcon} className="w-4 h-4" />} 
            colorScheme="green"
            onClick={handleAddAtoll}
            isDisabled={isLoading}
          >
            Add Atoll
          </Button>
        </HStack>
      </HStack>

      <Card bg={bgColor} border="1px solid" borderColor={borderColor}>
        <CardHeader>
          <Text fontSize="lg" fontWeight="semibold">Atolls & Their Resorts</Text>
        </CardHeader>
        <CardBody>
          <Accordion allowMultiple>
            {data.map((atoll) => (
              <AccordionItem key={atoll.id}>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <HStack>
                      <Icon as={MapPinIcon} className="w-5 h-5" />
                      <Text fontWeight="semibold">{atoll.atoll_name}</Text>
                      <Badge colorScheme={atoll.is_active ? 'green' : 'red'}>
                        {atoll.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge colorScheme="blue">{atoll.resorts.length} resorts</Badge>
                    </HStack>
                  </Box>
                  <HStack spacing={1} mr={2}>
                    <Button 
                      size="xs" 
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditAtoll(atoll);
                      }}
                      isDisabled={isLoading}
                    >
                      <Icon as={PencilIcon} className="w-3 h-3" />
                    </Button>
                    <Button 
                      size="xs" 
                      variant="ghost" 
                      colorScheme="red"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAtoll(atoll.id);
                      }}
                      isDisabled={isLoading}
                    >
                      <Icon as={TrashIcon} className="w-3 h-3" />
                    </Button>
                  </HStack>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <VStack spacing={4} align="stretch">
                    <HStack justify="space-between">
                      <Text fontSize="sm" color="gray.600">{atoll.description}</Text>
                      <Button 
                        size="sm" 
                        leftIcon={<Icon as={PlusIcon} className="w-3 h-3" />} 
                        colorScheme="purple"
                        onClick={() => handleAddResort(atoll.id)}
                        isDisabled={isLoading}
                      >
                        Add Resort
                      </Button>
                    </HStack>
                    
                    <TableContainer>
                      <Table size="sm">
                        <Thead>
                          <Tr>
                            <Th>Resort Name</Th>
                            <Th>Price</Th>
                            <Th>Duration</Th>
                            <Th>Transfer Type</Th>
                            <Th>Status</Th>
                            <Th>Actions</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {atoll.resorts.map((resort) => (
                            <Tr key={resort.id}>
                              <Td fontWeight="medium">{resort.resort_name}</Td>
                              <Td>${resort.price}</Td>
                              <Td>{resort.duration}</Td>
                              <Td>
                                <Badge colorScheme="purple">{resort.transfer_type}</Badge>
                              </Td>
                              <Td>
                                <Badge colorScheme={resort.is_active ? 'green' : 'red'}>
                                  {resort.is_active ? 'Active' : 'Inactive'}
                                </Badge>
                              </Td>
                              <Td>
                                <HStack spacing={1}>
                                  <Button 
                                    size="xs" 
                                    variant="ghost"
                                    onClick={() => handleEditResort(resort)}
                                    isDisabled={isLoading}
                                  >
                                    <Icon as={PencilIcon} className="w-3 h-3" />
                                  </Button>
                                  <Button 
                                    size="xs" 
                                    variant="ghost" 
                                    colorScheme="red"
                                    onClick={() => handleDeleteResort(resort.id)}
                                    isDisabled={isLoading}
                                  >
                                    <Icon as={TrashIcon} className="w-3 h-3" />
                                  </Button>
                                </HStack>
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </CardBody>
      </Card>

      {/* Atoll Modal */}
      <AtollModal
        isOpen={isAtollModalOpen}
        onClose={() => setIsAtollModalOpen(false)}
        atoll={selectedAtoll}
        isEditMode={isEditMode}
        onSave={handleSaveAtoll}
        isLoading={isLoading}
      />

      {/* Resort Modal */}
      <ResortModal
        isOpen={isResortModalOpen}
        onClose={() => setIsResortModalOpen(false)}
        resort={selectedResort}
        atoll={selectedAtoll}
        isEditMode={isEditMode}
        onSave={handleSaveResort}
        isLoading={isLoading}
      />
    </VStack>
  );
};

// Atoll Modal Component
interface AtollModalProps {
  isOpen: boolean;
  onClose: () => void;
  atoll: AtollTransfer | null;
  isEditMode: boolean;
  onSave: (data: any) => void;
  isLoading: boolean;
}

const AtollModal: React.FC<AtollModalProps> = ({
  isOpen,
  onClose,
  atoll,
  isEditMode,
  onSave,
  isLoading,
}) => {
  const [formData, setFormData] = useState({
    atoll_name: atoll?.atoll_name || '',
    description: atoll?.description || '',
    is_active: atoll?.is_active ?? true,
    order: atoll?.order || 0,
  });

  React.useEffect(() => {
    if (isOpen) {
      setFormData({
        atoll_name: atoll?.atoll_name || '',
        description: atoll?.description || '',
        is_active: atoll?.is_active ?? true,
        order: atoll?.order || 0,
      });
    }
  }, [isOpen, atoll]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{isEditMode ? 'Edit Atoll' : 'Add New Atoll'}</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Atoll Name</FormLabel>
                <Input
                  value={formData.atoll_name}
                  onChange={(e) => setFormData({ ...formData, atoll_name: e.target.value })}
                  placeholder="Enter atoll name"
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter atoll description"
                  rows={3}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Order</FormLabel>
                <NumberInput value={formData.order} onChange={(_, value) => setFormData({ ...formData, order: value })}>
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
              
              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0">Active</FormLabel>
                <Switch
                  isChecked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack spacing={4} w="full" justify="flex-end">
              <Button onClick={onClose} isDisabled={isLoading}>Cancel</Button>
              <Button type="submit" colorScheme="blue" isLoading={isLoading}>
                {isEditMode ? 'Update' : 'Create'}
              </Button>
            </HStack>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

// Resort Modal Component
interface ResortModalProps {
  isOpen: boolean;
  onClose: () => void;
  resort: ResortTransfer | null;
  atoll: AtollTransfer | null;
  isEditMode: boolean;
  onSave: (data: any) => void;
  isLoading: boolean;
}

const ResortModal: React.FC<ResortModalProps> = ({
  isOpen,
  onClose,
  resort,
  atoll,
  isEditMode,
  onSave,
  isLoading,
}) => {
  const [formData, setFormData] = useState({
    resort_name: resort?.resort_name || '',
    price: resort?.price || 0,
    duration: resort?.duration || '',
    transfer_type: resort?.transfer_type || '',
    is_active: resort?.is_active ?? true,
    order: resort?.order || 0,
  });

  React.useEffect(() => {
    if (isOpen) {
      setFormData({
        resort_name: resort?.resort_name || '',
        price: resort?.price || 0,
        duration: resort?.duration || '',
        transfer_type: resort?.transfer_type || '',
        is_active: resort?.is_active ?? true,
        order: resort?.order || 0,
      });
    }
  }, [isOpen, resort]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {isEditMode ? 'Edit Resort' : `Add New Resort${atoll ? ` to ${atoll.atoll_name}` : ''}`}
        </ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Resort Name</FormLabel>
                <Input
                  value={formData.resort_name}
                  onChange={(e) => setFormData({ ...formData, resort_name: e.target.value })}
                  placeholder="Enter resort name"
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Price (USD)</FormLabel>
                <NumberInput value={formData.price} onChange={(_, value) => setFormData({ ...formData, price: value })}>
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Duration</FormLabel>
                <Input
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="e.g., 45 minutes"
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Transfer Type</FormLabel>
                <Select
                  value={formData.transfer_type}
                  onChange={(e) => setFormData({ ...formData, transfer_type: e.target.value })}
                >
                  <option value="">Select transfer type</option>
                  <option value="speedboat">Speedboat</option>
                  <option value="ferry">Ferry</option>
                  <option value="seaplane">Seaplane</option>
                  <option value="domestic_flight">Domestic Flight</option>
                </Select>
              </FormControl>
              
              <FormControl>
                <FormLabel>Order</FormLabel>
                <NumberInput value={formData.order} onChange={(_, value) => setFormData({ ...formData, order: value })}>
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
              
              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0">Active</FormLabel>
                <Switch
                  isChecked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack spacing={4} w="full" justify="flex-end">
              <Button onClick={onClose} isDisabled={isLoading}>Cancel</Button>
              <Button type="submit" colorScheme="blue" isLoading={isLoading}>
                {isEditMode ? 'Update' : 'Create'}
              </Button>
            </HStack>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}; 