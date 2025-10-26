import React, { useState, useEffect } from 'react';
import { CalendarIcon, UsersIcon } from '@heroicons/react/24/outline';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  HStack,
  Text,
  Button,
  Input,
  Textarea,
  Select,
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
  useToast,
  Icon,
} from '@chakra-ui/react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { LoadingSpinner } from './LoadingSpinner';
import { useNotification } from '../hooks';
import { useWhatsApp } from '../hooks/useQueries';

interface PackageBookingFormProps {
  packageId: number;
  packageName: string;
  packagePrice: number;
  packageDurationDays: number;
  isOpen: boolean;
  onClose: () => void;
}

export function PackageBookingForm({ packageId, packageName, packagePrice, packageDurationDays, isOpen, onClose }: PackageBookingFormProps) {
  const { showSuccess, showError } = useNotification();
  const { getWhatsAppUrl } = useWhatsApp();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    number_of_guests: 2,
    start_date: '',
    duration_days: packageDurationDays || 1,
    special_requests: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'number_of_guests' || name === 'duration_days' ? Number(value) : value }));
    
    // Real-time validation
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (fieldName: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    validateField(fieldName, formData[fieldName as keyof typeof formData]);
  };

  const validateField = (fieldName: string, value: any) => {
    let error = '';
    
    switch (fieldName) {
      case 'customer_name':
        if (!value || value.trim().length < 2) {
          error = 'Please enter your full name (at least 2 characters)';
        }
        break;
      case 'customer_email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value || !emailRegex.test(value)) {
          error = 'Please enter a valid email address (e.g., name@example.com)';
        }
        break;
      case 'customer_phone':
        const phoneRegex = /^[\d\s\+\-\(\)]+$/;
        if (!value || !phoneRegex.test(value) || value.length < 10) {
          error = 'Please enter a valid phone number with country code (e.g., +960 123 4567)';
        }
        break;
    }
    
    setErrors(prev => ({...prev, [fieldName]: error }));
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);
    return maxDate.toISOString().split('T')[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const message = `Hi! I'd like to book the package ${packageName} (ID: ${packageId}).\n\n` +
`📋 *Booking Details:*\n` +
`• Start date: ${formData.start_date || 'Flexible'}\n` +
`• Duration: ${formData.duration_days} days\n` +
`• Guests: ${formData.number_of_guests}\n` +
`• Package price (per person): $${packagePrice}\n\n` +
`👤 *Guest Information:*\n` +
`• Name: ${formData.customer_name}\n` +
`• Email: ${formData.customer_email}\n` +
`• Phone: ${formData.customer_phone}\n\n` +
`${formData.special_requests ? `📝 *Special Requests:*\n${formData.special_requests}\n\n` : ''}` +
`Please assist with availability and next steps. Thank you!`;

      const url = getWhatsAppUrl(message);
      window.open(url, '_blank');
      showSuccess('Booking request sent to WhatsApp!');
      onClose();
    } catch (err) {
      showError('Failed to send booking request');
    } finally {
      setLoading(false);
    }
  };


  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      isCentered
      scrollBehavior="inside"
    >
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent>
        <ModalHeader>
          <VStack align="start" spacing={1}>
            <Text fontSize="xl" fontWeight="bold">Book This Package</Text>
            <Text fontSize="sm" color="gray.600">{packageName}</Text>
          </VStack>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody pb={6}>
          <form onSubmit={handleSubmit}>
            <VStack spacing={6}>
              {/* Guest Info */}
              <VStack spacing={4} w="full">
                <HStack spacing={4} w="full">
                  <FormControl isRequired isInvalid={!!errors.customer_name && touched.customer_name}>
                    <FormLabel>Full Name</FormLabel>
                    <Input
                      name="customer_name"
                      value={formData.customer_name}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('customer_name')}
                      placeholder="John Doe"
                    />
                    <FormErrorMessage>{errors.customer_name}</FormErrorMessage>
                    {!errors.customer_name && touched.customer_name && formData.customer_name && (
                      <FormHelperText color="emerald.600">
                        <Icon as={CheckCircleIcon} w={3} h={3} display="inline" mr={1} />
                        Looks good!
                      </FormHelperText>
                    )}
                  </FormControl>
                  <FormControl isRequired isInvalid={!!errors.customer_email && touched.customer_email}>
                    <FormLabel>Email</FormLabel>
                    <Input
                      type="email"
                      name="customer_email"
                      value={formData.customer_email}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('customer_email')}
                      placeholder="your@email.com"
                    />
                    <FormErrorMessage fontSize="xs">{errors.customer_email}</FormErrorMessage>
                    {!errors.customer_email && touched.customer_email && formData.customer_email && (
                      <FormHelperText color="emerald.600" fontSize="xs">
                        <Icon as={CheckCircleIcon} w={3} h={3} display="inline" mr={1} />
                        We'll send confirmation here
                      </FormHelperText>
                    )}
                  </FormControl>
                </HStack>

                <HStack spacing={4} w="full">
                  <FormControl isRequired isInvalid={!!errors.customer_phone && touched.customer_phone}>
                    <FormLabel>Phone</FormLabel>
                    <Input
                      type="tel"
                      name="customer_phone"
                      value={formData.customer_phone}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('customer_phone')}
                      placeholder="+960 123 4567"
                    />
                    <FormErrorMessage fontSize="xs">{errors.customer_phone}</FormErrorMessage>
                    {!errors.customer_phone && touched.customer_phone && formData.customer_phone && (
                      <FormHelperText color="emerald.600" fontSize="xs">
                        <Icon as={CheckCircleIcon} w={3} h={3} display="inline" mr={1} />
                        Valid format
                      </FormHelperText>
                    )}
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Number of Guests</FormLabel>
                    <Select
                      name="number_of_guests"
                      value={formData.number_of_guests}
                      onChange={handleInputChange}
                    >
                      {[1,2,3,4,5,6,7,8,9,10].map(n => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? 'Guest' : 'Guests'}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                </HStack>
              </VStack>

              {/* Dates + Duration */}
              <VStack spacing={4} w="full">
                <HStack spacing={4} w="full">
                  <FormControl>
                    <FormLabel>Preferred Start Date</FormLabel>
                    <Input
                      type="date"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleInputChange}
                      min={getMinDate()}
                      max={getMaxDate()}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Duration (days)</FormLabel>
                    <Select
                      name="duration_days"
                      value={formData.duration_days}
                      onChange={handleInputChange}
                    >
                      {[...Array(21)].map((_, i) => i+1).map(n => (
                        <option key={n} value={n}>
                          {n} day{n > 1 ? 's' : ''}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                </HStack>
              </VStack>

              {/* Special Requests */}
              <FormControl>
                <FormLabel>Special Requests (Optional)</FormLabel>
                <Textarea
                  name="special_requests"
                  value={formData.special_requests}
                  onChange={handleInputChange}
                  placeholder="Any special requests or requirements..."
                  rows={3}
                />
              </FormControl>

              {/* Submit Buttons */}
              <HStack spacing={4} w="full">
                <Button
                  type="button"
                  onClick={onClose}
                  variant="outline"
                  flex={1}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  colorScheme="green"
                  flex={1}
                  isLoading={loading}
                  loadingText="Submitting..."
                >
                  Send to WhatsApp
                </Button>
              </HStack>
            </VStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default PackageBookingForm;
