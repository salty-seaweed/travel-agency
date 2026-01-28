import React from 'react';
import {
  Box,
  HStack,
  VStack,
  Text,
  Button,
  Icon,
  useBreakpointValue,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import {
  GlobeAltIcon,
  EnvelopeIcon,
  HeartIcon,
  ShareIcon,
  ChatBubbleLeftRightIcon,
  CreditCardIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useCurrency } from '../../contexts/CurrencyContext';
import { useWhatsApp } from '../../hooks/useQueries';
import type { Package } from '../../types';

interface StickyBookingBarProps {
  packageData: Package;
  onBookNow: () => void;
  onAddToWishlist: () => void;
  onShare: () => void;
  isWishlisted?: boolean;
  selectedVariant?: any;
}

export function StickyBookingBar({
  packageData,
  onBookNow,
  onAddToWishlist,
  onShare,
  isWishlisted = false,
  selectedVariant,
}: StickyBookingBarProps) {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { formatPrice } = useCurrency();
  const { getWhatsAppUrl } = useWhatsApp();

  if (!isMobile) {
    return null;
  }

  const handleWhatsApp = () => {
    const message = `Hi! I'm interested in booking the "${packageData.name}" package.`;
    const whatsappUrl = getWhatsAppUrl(message);
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  const handleEmail = () => {
    const subject = `Inquiry about ${packageData.name} package`;
    const body = `Hi,\n\nI'm interested in booking the "${packageData.name}" package.\n\nPlease provide more information.\n\nThank you!`;
    const mailtoUrl = `mailto:info@threadtravels.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl);
    onClose();
  };

  return (
    <>
      <Box
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        bg="white"
        borderTop="1px solid"
        borderColor="gray.200"
        p={4}
        zIndex={1000}
        boxShadow="lg"
      >
        <HStack justify="space-between" align="center">
          {/* Price */}
          <VStack align="start" spacing={0}>
            {(() => {
              const currentPrice = selectedVariant
                ? parseFloat(String(selectedVariant.price))
                : parseFloat(typeof packageData.price === 'string' ? packageData.price.replace(/[^0-9.]/g, '') : (packageData.price as any));
              const originalPrice = selectedVariant && selectedVariant.original_price
                ? parseFloat(String(selectedVariant.original_price))
                : (packageData.original_price && packageData.original_price !== null && packageData.original_price !== 'null' && packageData.original_price !== '0' && packageData.original_price !== '0.00'
                  ? parseFloat(String(packageData.original_price).replace(/[^0-9.]/g, ''))
                  : null);

              return (
                <>
                  {originalPrice && originalPrice !== currentPrice && (
                    <Text fontSize="sm" color="gray.400" textDecoration="line-through">
                      {formatPrice(originalPrice)}
                    </Text>
                  )}
                  <Text fontSize="lg" fontWeight="bold" color="purple.600">
                    {formatPrice(currentPrice)}
                  </Text>
                  {!selectedVariant && (packageData as any).variants && (packageData as any).variants.length > 0 && (
                    <Text fontSize="9px" color="gray.500" textTransform="uppercase">Starting from</Text>
                  )}
                  {originalPrice && originalPrice !== currentPrice && (
                    <Text fontSize="xs" color="green.600" fontWeight="semibold">
                      Save {Math.round(((originalPrice - currentPrice) / originalPrice) * 100)}%
                    </Text>
                  )}
                  <Text fontSize="xs" color="gray.500">
                    {packageData.pricing_type === 'per_couple' ? 'per couple' : 
                     packageData.pricing_type === 'per_room' ? 'per room' :
                     packageData.pricing_type === 'per_group' ? 'per group' :
                     'per person'}
                  </Text>
                </>
              );
            })()}
          </VStack>

          {/* Action Buttons */}
          <HStack spacing={2}>
            <Button
              size="sm"
              variant="ghost"
              onClick={onAddToWishlist}
              colorScheme={isWishlisted ? "red" : "gray"}
              p={2}
            >
              <Icon as={isWishlisted ? HeartSolidIcon : HeartIcon} h={4} w={4} />
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={onShare}
              p={2}
            >
              <Icon as={ShareIcon} h={4} w={4} />
            </Button>
            
            <Button 
              colorScheme="purple" 
              size="sm" 
              onClick={() => {
                const currentPrice = selectedVariant
                  ? parseFloat(String(selectedVariant.price))
                  : parseFloat(typeof packageData.price === 'string' ? packageData.price.replace(/[^0-9.]/g, '') : (packageData.price as any));
                const description = `${packageData.name} - Package Booking`;
                window.location.href = `/payment/checkout?amount=${currentPrice}&description=${encodeURIComponent(description)}&currency=USD`;
              }}
              flex={1}
              minW="100px"
            >
              <Icon as={CreditCardIcon} h={4} w={4} mr={1} />
              Pay Now
            </Button>
            
            <Button colorScheme="green" size="sm" onClick={onBookNow} flex={1} minW="100px">
              <Icon as={ChatBubbleLeftRightIcon} h={4} w={4} mr={1} />
              Book
            </Button>
          </HStack>
        </HStack>
      </Box>

      {/* Booking Modal removed: use parent modal flow */}
    </>
  );
}
