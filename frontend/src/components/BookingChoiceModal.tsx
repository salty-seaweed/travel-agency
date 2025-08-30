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
  DocumentTextIcon,
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
import type { Package } from '../types';
import { useWhatsApp } from '../hooks/useQueries';
import { useTranslation } from '../i18n';

interface BookingChoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  package: Package;
  onFormBooking?: () => void;
}

export function BookingChoiceModal({ isOpen, onClose, package: pkg, onFormBooking }: BookingChoiceModalProps) {
  const { t } = useTranslation();
  const toast = useToast();
  const { whatsappNumber } = useWhatsApp();

  const getDestinationsLabel = (): string => {
    const dests: any = (pkg as any)?.destinations;
    if (Array.isArray(dests)) {
      const labels = dests
        .map((d) => typeof d === 'string' ? d : (d?.location?.island || d?.island || d?.name || d?.location || ''))
        .filter((s) => typeof s === 'string' && s.trim().length > 0);
      if (labels.length > 0) return labels.join(', ');
    }
    return t('packageCard.defaultDestination', 'Maldives Paradise');
  };

  const handleDirectWhatsApp = () => {
    whatsappBooking.bookPackageDirect(pkg, whatsappNumber);
    onClose();
    toast({
      title: t('bookingModal.whatsappOpened.title', 'WhatsApp opened!'),
      description: t('bookingModal.whatsappOpened.description', 'You can now chat with us directly about your booking.'),
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleFormBooking = () => {
    if (onFormBooking) {
      onFormBooking();
      onClose();
      return;
    }
    // Default: navigate to booking page when used from cards/listing
    window.location.href = `/packages/${pkg.id}/book`;
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
              {t('bookingModal.title', 'Book Your Maldives Adventure')}
            </Heading>
            <Text className="text-gray-600 mt-2">
              {t('bookingModal.subtitle', 'Choose how you\'d like to proceed with your booking')}
            </Text>
          </ModalHeader>
          
          <ModalCloseButton className="text-gray-400 hover:text-gray-600" />
          
          <ModalBody className="p-8">
            {/* Package Summary */}
            <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
              <CardBody className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Heading size="md" className="text-gray-900 mb-2">
                      {pkg.name}
                    </Heading>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Icon as={MapPinIcon} className="w-4 h-4 text-blue-500" />
                        <span>{getDestinationsLabel()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon as={CalendarIcon} className="w-4 h-4 text-green-500" />
                        <span>{pkg.duration} days</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon as={UserGroupIcon} className="w-4 h-4 text-purple-500" />
                        <span>{t('bookingModal.packageSummary.maxTravelers', 'Up to {{count}} travelers', { count: pkg.maxTravelers })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon as={CurrencyDollarIcon} className="w-4 h-4 text-yellow-500" />
                        <span>${pkg.price} per person</span>
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                                         {t('bookingModal.packageSummary.available', 'Available')}
                  </Badge>
                </div>
              </CardBody>
            </Card>

            {/* Booking Options */}
            <VStack spacing={6}>
              {/* Option 1: Direct WhatsApp */}
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
                                                     {t('bookingModal.directWhatsApp.title', 'Direct WhatsApp Booking')}
                          </Heading>
                          <Text className="text-gray-600 text-sm">
                           {t('bookingModal.directWhatsApp.description', 'Chat with us instantly for immediate assistance')}
                        </Text>
                      </div>
                    </div>
                    <Icon as={ArrowRightIcon} className="w-5 h-5 text-gray-400" />
                  </div>
                  
                  <div className="mt-4 grid grid-cols-3 gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Icon as={ClockIcon} className="w-3 h-3 text-green-500" />
                                             <span>{t('bookingModal.directWhatsApp.features.instant', 'Instant')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon as={ShieldCheckIcon} className="w-3 h-3 text-blue-500" />
                       <span>{t('bookingModal.directWhatsApp.features.secure', 'Secure')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon as={UserGroupIcon} className="w-3 h-3 text-purple-500" />
                       <span>{t('bookingModal.directWhatsApp.features.personal', 'Personal')}</span>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <div className="flex items-center w-full">
                <div className="flex-1 h-px bg-gray-200"></div>
                <Text className="px-4 text-gray-500 text-sm font-medium">{t('bookingModal.or', 'OR')}</Text>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>

              {/* Option 2: Booking Form */}
              <Card 
                className="w-full cursor-pointer hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-blue-200"
                onClick={handleFormBooking}
              >
                <CardBody className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                        <Icon as={DocumentTextIcon} className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <Heading size="md" className="text-gray-900 mb-1">
                                                     {t('bookingModal.bookingForm.title', 'Fill Booking Form')}
                          </Heading>
                          <Text className="text-gray-600 text-sm">
                           {t('bookingModal.bookingForm.description', 'Complete a detailed form for comprehensive booking')}
                        </Text>
                      </div>
                    </div>
                    <Icon as={ArrowRightIcon} className="w-5 h-5 text-gray-400" />
                  </div>
                  
                  <div className="mt-4 grid grid-cols-3 gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Icon as={CheckCircleIcon} className="w-3 h-3 text-green-500" />
                                             <span>{t('bookingModal.bookingForm.features.detailed', 'Detailed')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon as={ShieldCheckIcon} className="w-3 h-3 text-blue-500" />
                       <span>{t('bookingModal.bookingForm.features.secure', 'Secure')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon as={CalendarIcon} className="w-3 h-3 text-purple-500" />
                       <span>{t('bookingModal.bookingForm.features.structured', 'Structured')}</span>
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
                                         {t('bookingModal.importantInfo.title', 'Important Booking Information')}
                    </Text>
                    <Text className="text-sm text-yellow-700">
                     {t('bookingModal.importantInfo.availability', '• All bookings are subject to availability confirmation')}<br/>
                     {t('bookingModal.importantInfo.response', '• We\'ll check availability and get back to you within 24 hours')}<br/>
                     {t('bookingModal.importantInfo.payment', '• Payment is required to confirm your booking')}<br/>
                     {t('bookingModal.importantInfo.cancellation', '• Cancellation policies apply based on your selected package')}
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
                                         {t('bookingModal.contactInfo.title', 'Need immediate assistance?')}
                    </Text>
                    <Text className="text-sm text-blue-700">
                      {t('bookingModal.contactInfo.description', 'Call or WhatsApp us at {{num}}', { num: whatsappNumber })}
                    </Text>
                </div>
              </div>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
  );
}

export default BookingChoiceModal;
