import React, { useState } from 'react';
import {
  VStack, HStack, Text, Card, CardBody, CardHeader, Button, Badge, Icon,
  Table, Thead, Tbody, Tr, Th, Td, TableContainer, useColorModeValue,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton,
  FormControl, FormLabel, Input, Textarea, Select, Switch, NumberInput,
  NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper,
  useDisclosure, Box, SimpleGrid,
} from '@chakra-ui/react';
import {
  PencilIcon, TrashIcon, PlusIcon, EyeIcon, CheckIcon, XMarkIcon,
} from '@heroicons/react/24/outline';
import { transferTypesApi } from '../../../services/transportationApi';
import { useNotification } from '../../../hooks';

interface TransferType {
  id: number;
  name: string;
  description: string;
  icon: string;
  gradient: string;
  features: string[];
  pricing_range: string;
  best_for: string;
  pros: string[];
  cons: string[];
  is_active: boolean;
  order: number;
}

interface TransferTypesTabProps {
  data: TransferType[];
}

export const TransferTypesTab: React.FC<TransferTypesTabProps> = ({ data }) => {
  const [selectedItem, setSelectedItem] = useState<TransferType | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { showSuccess, showError } = useNotification();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleEdit = (item: TransferType) => {
    setSelectedItem(item);
    setIsEditMode(true);
    onOpen();
  };

  const handleAdd = () => {
    setSelectedItem(null);
    setIsEditMode(false);
    onOpen();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this transfer type?')) {
      try {
        setIsLoading(true);
        await transferTypesApi.delete(id);
        showSuccess('Transfer type deleted successfully!');
        // Refresh the page to update the data
        window.location.reload();
      } catch (error) {
        showError('Failed to delete transfer type');
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
        await transferTypesApi.update(selectedItem.id, formData);
        showSuccess('Transfer type updated successfully!');
      } else {
        await transferTypesApi.create(formData);
        showSuccess('Transfer type created successfully!');
      }
      onClose();
      // Refresh the page to update the data
      window.location.reload();
    } catch (error) {
      showError('Failed to save transfer type');
      console.error('Save error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <VStack spacing={6} align="stretch">
      {/* Header */}
      <HStack justify="space-between">
        <Text fontSize="xl" fontWeight="bold">Transfer Types</Text>
        <Button 
          leftIcon={<Icon as={PlusIcon} className="w-4 h-4" />} 
          colorScheme="blue" 
          onClick={handleAdd}
          isDisabled={isLoading}
        >
          Add Transfer Type
        </Button>
      </HStack>

      {/* Transfer Types Table */}
      <Card bg={bgColor} border="1px solid" borderColor={borderColor}>
        <CardHeader>
          <Text fontSize="lg" fontWeight="semibold">All Transfer Types</Text>
        </CardHeader>
        <CardBody>
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Pricing Range</Th>
                  <Th>Best For</Th>
                  <Th>Features</Th>
                  <Th>Status</Th>
                  <Th>Order</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.map((item) => (
                  <Tr key={item.id}>
                    <Td fontWeight="medium">{item.name}</Td>
                    <Td>{item.pricing_range}</Td>
                    <Td>{item.best_for}</Td>
                    <Td>
                      <Text noOfLines={2}>{item.features.join(', ')}</Text>
                    </Td>
                    <Td>
                      <Badge colorScheme={item.is_active ? 'green' : 'red'}>
                        {item.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </Td>
                    <Td>{item.order}</Td>
                                         <Td>
                       <HStack spacing={2}>
                         <Button 
                           size="sm" 
                           variant="ghost" 
                           onClick={() => handleEdit(item)}
                           isDisabled={isLoading}
                         >
                           <Icon as={PencilIcon} className="w-4 h-4" />
                         </Button>
                         <Button 
                           size="sm" 
                           variant="ghost" 
                           colorScheme="red" 
                           onClick={() => handleDelete(item.id)}
                           isDisabled={isLoading}
                         >
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

      {/* Edit/Add Modal */}
             <TransferTypeModal
         isOpen={isOpen}
         onClose={onClose}
         item={selectedItem}
         isEditMode={isEditMode}
         onSave={handleSave}
         isLoading={isLoading}
       />
    </VStack>
  );
};

// Modal Component
interface TransferTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: TransferType | null;
  isEditMode: boolean;
  onSave: (data: any) => void;
  isLoading: boolean;
}

const TransferTypeModal: React.FC<TransferTypeModalProps> = ({
  isOpen,
  onClose,
  item,
  isEditMode,
  onSave,
  isLoading,
}) => {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    description: item?.description || '',
    icon: item?.icon || '',
    gradient: item?.gradient || '',
    pricing_range: item?.pricing_range || '',
    best_for: item?.best_for || '',
    features: item?.features || [],
    pros: item?.pros || [],
    cons: item?.cons || [],
    is_active: item?.is_active ?? true,
    order: item?.order || 0,
  });

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (isOpen) {
      setFormData({
        name: item?.name || '',
        description: item?.description || '',
        icon: item?.icon || '',
        gradient: item?.gradient || '',
        pricing_range: item?.pricing_range || '',
        best_for: item?.best_for || '',
        features: item?.features || [],
        pros: item?.pros || [],
        cons: item?.cons || [],
        is_active: item?.is_active ?? true,
        order: item?.order || 0,
      });
    }
  }, [isOpen, item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {isEditMode ? 'Edit Transfer Type' : 'Add Transfer Type'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Speedboat Transfers"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Fast and efficient transfers for nearby islands and resorts"
                  rows={3}
                />
              </FormControl>

              <SimpleGrid columns={2} spacing={4} w="full">
                <FormControl>
                  <FormLabel>Icon</FormLabel>
                  <Input
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="SparklesIcon"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Gradient</FormLabel>
                  <Input
                    value={formData.gradient}
                    onChange={(e) => setFormData({ ...formData, gradient: e.target.value })}
                    placeholder="from-blue-500 to-indigo-600"
                  />
                </FormControl>
              </SimpleGrid>

              <FormControl isRequired>
                <FormLabel>Pricing Range</FormLabel>
                <Input
                  value={formData.pricing_range}
                  onChange={(e) => setFormData({ ...formData, pricing_range: e.target.value })}
                  placeholder="From $50 to $300 per person"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Best For</FormLabel>
                <Input
                  value={formData.best_for}
                  onChange={(e) => setFormData({ ...formData, best_for: e.target.value })}
                  placeholder="Resort transfers, nearby islands"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Order</FormLabel>
                <NumberInput
                  value={formData.order}
                  onChange={(value) => setFormData({ ...formData, order: parseInt(value) || 0 })}
                  min={0}
                >
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

                             <HStack spacing={4} w="full" justify="flex-end">
                 <Button onClick={onClose} isDisabled={isLoading}>Cancel</Button>
                 <Button type="submit" colorScheme="blue" isLoading={isLoading}>
                   {isEditMode ? 'Update' : 'Create'}
                 </Button>
               </HStack>
            </VStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}; 