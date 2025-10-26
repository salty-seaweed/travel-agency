import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  VStack,
  Text,
  Badge,
  Divider,
  Alert,
  AlertIcon,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  useDisclosure,
} from '@chakra-ui/react';
import { FaCalendarAlt, FaUsers } from 'react-icons/fa';
import { TourPackage } from '../types';

interface BookingFormProps {
  tour: TourPackage;
}

interface BookingData {
  fullName: string;
  email: string;
  phone: string;
  numberOfTravelers: number;
  travelDate: string;
  specialRequests: string;
}

const BookingForm: React.FC<BookingFormProps> = ({ tour }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [formData, setFormData] = useState<BookingData>({
    fullName: '',
    email: '',
    phone: '',
    numberOfTravelers: 1,
    travelDate: '',
    specialRequests: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<BookingData>>({});

  const handleInputChange = (field: keyof BookingData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<BookingData> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.travelDate) newErrors.travelDate = 'Travel date is required';
    else {
      const selectedDate = new Date(formData.travelDate);
      const today = new Date();
      if (selectedDate <= today) newErrors.travelDate = 'Travel date must be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: 'Please fix the errors',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Replace with actual API call
      console.log('Booking data:', formData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: 'Booking request submitted!',
        description: 'We\'ll contact you within 24 hours to confirm your booking.',
        status: 'success',
        duration: 5000,
      });

      onClose();
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        numberOfTravelers: 1,
        travelDate: '',
        specialRequests: '',
      });
    } catch (error) {
      toast({
        title: 'Booking failed',
        description: 'Please try again or contact us directly.',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPrice = parseFloat(tour.final_price) * formData.numberOfTravelers;

  return (
    <>
      <Box
        borderWidth="1px"
        borderRadius="lg"
        p={6}
        bg="white"
        boxShadow="lg"
        position="sticky"
        top={4}
      >
        <VStack spacing={6} align="stretch">
          {/* Pricing Section */}
          <Box textAlign="center">
            <Text fontSize="2xl" fontWeight="bold" color="blue.600">
              ${parseFloat(tour.final_price).toFixed(2)}
            </Text>
            <Text fontSize="sm" color="gray.500">per person</Text>
            {tour.is_on_sale && (
              <Badge colorScheme="orange" mt={2}>
                {tour.discount_percentage}% OFF
              </Badge>
            )}
          </Box>

          {/* Tour Summary */}
          <Box>
            <Text fontWeight="bold" mb={2}>Tour Summary</Text>
            <VStack spacing={1} align="start" fontSize="sm">
              <Text>📍 {tour.country_name}</Text>
              <Text>⏱️ {tour.duration_days} Days</Text>
              <Text>👥 {tour.group_size}</Text>
              <Text>📅 Difficulty: {tour.difficulty}</Text>
            </VStack>
          </Box>

          <Divider />

          {/* Travelers Selection */}
          <FormControl>
            <FormLabel>Number of Travelers</FormLabel>
            <Select
              value={formData.numberOfTravelers}
              onChange={(e) => handleInputChange('numberOfTravelers', parseInt(e.target.value))}
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'Traveler' : 'Travelers'}</option>
              ))}
            </Select>
          </FormControl>

          {/* Total Price */}
          <Box textAlign="center" p={4} bg="gray.50" borderRadius="md">
            <Text fontSize="lg" fontWeight="bold">
              Total: ${totalPrice.toFixed(2)}
            </Text>
            <Text fontSize="sm" color="gray.500">
              For {formData.numberOfTravelers} {formData.numberOfTravelers === 1 ? 'traveler' : 'travelers'}
            </Text>
          </Box>

          {/* Book Now Button */}
          <Button
            colorScheme="blue"
            size="lg"
            width="full"
            onClick={onOpen}
            leftIcon={<FaCalendarAlt />}
          >
            Book Now
          </Button>
        </VStack>
      </Box>

      {/* Booking Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Book Your Tour</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit}>
            <ModalBody>
              <VStack spacing={4}>
                {/* Tour Summary in Modal */}
                <Box p={4} bg="blue.50" borderRadius="md" width="full">
                  <Text fontWeight="bold">{tour.name}</Text>
                  <Text fontSize="sm" color="gray.600">
                    {tour.duration_days} Days • {tour.country_name} • ${totalPrice.toFixed(2)} total
                  </Text>
                </Box>

                <FormControl isRequired isInvalid={!!errors.fullName}>
                  <FormLabel>Full Name</FormLabel>
                  <Input
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && <Text color="red.500" fontSize="sm">{errors.fullName}</Text>}
                </FormControl>

                <FormControl isRequired isInvalid={!!errors.email}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email"
                  />
                  {errors.email && <Text color="red.500" fontSize="sm">{errors.email}</Text>}
                </FormControl>

                <FormControl isRequired isInvalid={!!errors.phone}>
                  <FormLabel>Phone Number</FormLabel>
                  <Input
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && <Text color="red.500" fontSize="sm">{errors.phone}</Text>}
                </FormControl>

                <FormControl isRequired isInvalid={!!errors.travelDate}>
                  <FormLabel>Preferred Travel Date</FormLabel>
                  <Input
                    type="date"
                    value={formData.travelDate}
                    onChange={(e) => handleInputChange('travelDate', e.target.value)}
                  />
                  {errors.travelDate && <Text color="red.500" fontSize="sm">{errors.travelDate}</Text>}
                </FormControl>

                <FormControl>
                  <FormLabel>Special Requests (Optional)</FormLabel>
                  <Textarea
                    value={formData.specialRequests}
                    onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                    placeholder="Any special requirements or preferences..."
                    rows={3}
                  />
                </FormControl>

                <Alert status="info" borderRadius="md">
                  <AlertIcon />
                  <Text fontSize="sm">
                    We'll contact you within 24 hours to confirm your booking and provide payment details.
                  </Text>
                </Alert>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                type="submit"
                isLoading={isSubmitting}
                loadingText="Submitting..."
              >
                Submit Booking Request
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default BookingForm;
