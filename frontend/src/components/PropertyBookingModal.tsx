import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  Text,
  Box,
  Icon,
  useToast,
  Card,
  CardBody,
  Heading,
  Badge,
} from '@chakra-ui/react';
import {
  ChatBubbleLeftRightIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  CalendarIcon,
  MapPinIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import { whatsappBooking } from '../services/whatsapp-booking';
import type { Property } from '../types';
import { useWhatsApp } from '../hooks/useQueries';

interface PropertyBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
}

export function PropertyBookingModal({ isOpen, onClose, property }: PropertyBookingModalProps) {
  const toast = useToast();
  const { whatsappNumber } = useWhatsApp();

  const handleDirectWhatsApp = () => {
    whatsappBooking.bookPropertyDirect(property);
    onClose();
    toast({
      title: "WhatsApp opened!",
      description: "You can now chat with us directly about your booking.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleDetailedWhatsApp = () => {
    // Create a detailed WhatsApp message with property information
    const message = `Hi! I'm interested in booking "${property.name}".

📋 *Property Details:*
• Property: ${property.name}
• Location: ${property.location?.island}, ${property.location?.atoll}
• Price: $${property.price} per night
• Property Type: ${property.property_type?.name}
• Rating: ${property.rating}/5 (${property.reviewCount} reviews)

📝 *Please provide the following information:*
• Check-in date
• Check-out date
• Number of guests
• Any special requirements
• Contact information

I'd like to check availability for these dates. Thank you!`;

    whatsappBooking.openWhatsApp(message, whatsappNumber);
    
    onClose();
    toast({
      title: "WhatsApp opened!",
      description: "We've prepared a detailed message with all the information needed for your booking.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" isCentered>
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent className="bg-white rounded-3xl shadow-2xl border border-gray-100">
        <ModalHeader className="text-center border-b border-gray-100 pb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
              <Icon as={CalendarIcon} className="w-8 h-8 text-white" />
            </div>
          </div>
          <Heading size="lg" className="text-gray-900">
            Book Your Maldives Property
          </Heading>
          <Text className="text-gray-600 mt-2">
            Choose how you'd like to proceed with your booking
          </Text>
        </ModalHeader>
        
        <ModalCloseButton className="text-gray-400 hover:text-gray-600" />
        
        <ModalBody className="p-8">
          {/* Property Summary */}
          <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
            <CardBody className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Heading size="md" className="text-gray-900 mb-2">
                    {property.name}
                  </Heading>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Icon as={MapPinIcon} className="w-4 h-4 text-blue-500" />
                      <span>{property.location?.island}, {property.location?.atoll}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon as={CurrencyDollarIcon} className="w-4 h-4 text-green-500" />
                      <span>${property.price} per night</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon as={UserGroupIcon} className="w-4 h-4 text-purple-500" />
                      <span>{property.property_type?.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon as={CheckCircleIcon} className="w-4 h-4 text-yellow-500" />
                      <span>{property.rating}/5 ({property.reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                  Available
                </Badge>
              </div>
            </CardBody>
          </Card>

          {/* Booking Options */}
          <VStack spacing={6}>
            {/* Option 1: Quick WhatsApp */}
            <Card 
              className="w-full cursor-pointer hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-green-200"
              onClick={handleDirectWhatsApp}
            >
              <CardBody className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                      <Icon as={ChatBubbleLeftRightIcon} className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <Heading size="md" className="text-gray-900 mb-1">
                        Quick WhatsApp Booking
                      </Heading>
                      <Text className="text-gray-600 text-sm">
                        Start a simple chat for immediate assistance
                      </Text>
                    </div>
                  </div>
                  <Icon as={ArrowRightIcon} className="w-5 h-5 text-gray-400" />
                </div>
                
                <div className="mt-4 grid grid-cols-3 gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Icon as={ClockIcon} className="w-3 h-3 text-green-500" />
                    <span>Instant</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon as={ShieldCheckIcon} className="w-3 h-3 text-blue-500" />
                    <span>Secure</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon as={UserGroupIcon} className="w-3 h-3 text-purple-500" />
                    <span>Simple</span>
                  </div>
                </div>
              </CardBody>
            </Card>

            <div className="flex items-center w-full">
              <div className="flex-1 h-px bg-gray-200"></div>
              <Text className="px-4 text-gray-500 text-sm font-medium">OR</Text>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Option 2: Detailed WhatsApp */}
            <Card 
              className="w-full cursor-pointer hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-blue-200"
              onClick={handleDetailedWhatsApp}
            >
              <CardBody className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                      <Icon as={ChatBubbleLeftRightIcon} className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <Heading size="md" className="text-gray-900 mb-1">
                        Detailed WhatsApp Booking
                      </Heading>
                      <Text className="text-gray-600 text-sm">
                        Send a comprehensive message with all details
                      </Text>
                    </div>
                  </div>
                  <Icon as={ArrowRightIcon} className="w-5 h-5 text-gray-400" />
                </div>
                
                <div className="mt-4 grid grid-cols-3 gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Icon as={CheckCircleIcon} className="w-3 h-3 text-green-500" />
                    <span>Detailed</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon as={ShieldCheckIcon} className="w-3 h-3 text-blue-500" />
                    <span>Secure</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon as={CalendarIcon} className="w-3 h-3 text-purple-500" />
                    <span>Complete</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </VStack>

          {/* Instructions */}
          <Box className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <div className="flex items-start gap-3">
              <Icon as={CheckCircleIcon} className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <Text className="text-sm font-semibold text-yellow-800 mb-1">
                  Important Booking Information
                </Text>
                <Text className="text-sm text-yellow-700">
                  • All bookings are subject to availability confirmation<br/>
                  • We'll check availability and get back to you within 24 hours<br/>
                  • Payment is required to confirm your booking<br/>
                  • Cancellation policies apply based on your selected property
                </Text>
              </div>
            </div>
          </Box>

          {/* Contact Information */}
          <Box className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-center gap-3">
              <Icon as={ChatBubbleLeftRightIcon} className="w-5 h-5 text-blue-600" />
              <div>
                <Text className="text-sm font-semibold text-blue-800">
                  Need immediate assistance?
                </Text>
                <Text className="text-sm text-blue-700">
                  Call us at {whatsappNumber} or WhatsApp us anytime
                </Text>
              </div>
            </div>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default PropertyBookingModal;
