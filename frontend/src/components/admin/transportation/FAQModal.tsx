import React, { useState, useEffect } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, ModalFooter,
  FormControl, FormLabel, Input, Textarea, Select, Switch, NumberInput, NumberInputField,
  NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, VStack, HStack, Button,
} from '@chakra-ui/react';

interface TransferFAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  icon: string;
  is_active: boolean;
  order: number;
}

interface FAQModalProps {
  isOpen: boolean;
  onClose: () => void;
  faq: TransferFAQ | null;
  isEditMode: boolean;
  onSave: (data: any) => void;
  isLoading: boolean;
}

export const FAQModal: React.FC<FAQModalProps> = ({
  isOpen,
  onClose,
  faq,
  isEditMode,
  onSave,
  isLoading,
}) => {
  const [formData, setFormData] = useState({
    question: faq?.question || '',
    answer: faq?.answer || '',
    category: faq?.category || '',
    icon: faq?.icon || '',
    is_active: faq?.is_active ?? true,
    order: faq?.order || 0,
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        question: faq?.question || '',
        answer: faq?.answer || '',
        category: faq?.category || '',
        icon: faq?.icon || '',
        is_active: faq?.is_active ?? true,
        order: faq?.order || 0,
      });
    }
  }, [isOpen, faq]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{isEditMode ? 'Edit FAQ' : 'Add New FAQ'}</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Question</FormLabel>
                <Input
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="Enter question"
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Answer</FormLabel>
                <Textarea
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  placeholder="Enter answer"
                  rows={4}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Category</FormLabel>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Pricing, Booking, General"
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Icon</FormLabel>
                <Input
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="Icon name"
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