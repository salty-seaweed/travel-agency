import React, { useEffect, useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Spinner,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { getPaymentLink } from '../../services/bml-api';
import { PaymentCheckout } from './PaymentCheckout';
import type { PaymentLink } from '../../types/payment';

export function StandalonePaymentPage() {
  const { token } = useParams<{ token: string }>();
  const [paymentLink, setPaymentLink] = useState<PaymentLink | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError('Payment link token is required');
      setIsLoading(false);
      return;
    }

    getPaymentLink(token)
      .then((link) => {
        if (!link.is_valid) {
          setError('This payment link is no longer valid');
        } else {
          setPaymentLink(link);
        }
      })
      .catch((err) => {
        setError(err.message || 'Failed to load payment link');
      })
      .finally(() => setIsLoading(false));
  }, [token]);

  if (isLoading) {
    return (
      <Box p={8} textAlign="center">
        <Spinner size="xl" />
        <Text mt={4}>Loading payment link...</Text>
      </Box>
    );
  }

  if (error || !paymentLink) {
    return (
      <Box maxW="600px" mx="auto" p={6}>
        <Alert status="error">
          <AlertIcon />
          {error || 'Payment link not found'}
        </Alert>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="gray.50" py={8}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box maxW="800px" mx="auto" px={6}>
          <Heading size="lg" mb={2}>
            Payment Request
          </Heading>
          <Text color="gray.600">
            {paymentLink.description || 'Complete your payment'}
          </Text>
        </Box>

        {/* Payment Checkout */}
        <PaymentCheckout
          amount={parseFloat(paymentLink.amount)}
          currency={paymentLink.currency}
          description={paymentLink.description}
          customerName={paymentLink.customer_name || undefined}
          customerEmail={paymentLink.customer_email || undefined}
          customerPhone={paymentLink.customer_phone || undefined}
        />
      </VStack>
    </Box>
  );
}



