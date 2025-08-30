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
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { formatPrice } from '../../utils';
import type { Package } from '../../types';

interface StickyBookingBarProps {
  packageData: Package;
  onBookNow: () => void;
  onAddToWishlist: () => void;
  onShare: () => void;
  isWishlisted?: boolean;
}

export function StickyBookingBar({
  packageData,
  onBookNow,
  onAddToWishlist,
  onShare,
  isWishlisted = false,
}: StickyBookingBarProps) {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { isOpen, onOpen, onClose } = useDisclosure();

  if (!isMobile) {
    return null;
  }

  const handleWhatsApp = () => {
    const message = `Hi! I'm interested in booking the "${packageData.name}" package.`;
    const whatsappUrl = `https://wa.me/+9601234567?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  const handleEmail = () => {
    const subject = `Inquiry about ${packageData.name} package`;
    const body = `Hi,\n\nI'm interested in booking the "${packageData.name}" package.\n\nPlease provide more information.\n\nThank you!`;
    const mailtoUrl = `mailto:info@travelagency.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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
            <Text fontSize="lg" fontWeight="bold" color="purple.600">
              {formatPrice(parseFloat(packageData.price))}
            </Text>
            <Text fontSize="xs" color="gray.500">per person</Text>
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
            
            <Button colorScheme="green" size="sm" onClick={onBookNow} flex={1} minW="120px">
              <Icon as={ChatBubbleLeftRightIcon} h={4} w={4} mr={2} />
              Book
            </Button>
          </HStack>
        </HStack>
      </Box>

      {/* Booking Modal removed: use parent modal flow */}
    </>
  );
}
