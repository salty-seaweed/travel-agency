import React, { useEffect, useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Button,
  Card,
  CardBody,
  Icon,
  Alert,
  AlertIcon,
  Spinner,
} from '@chakra-ui/react';
import {
  CheckCircleIcon,
  DocumentTextIcon,
  HomeIcon,
} from '@heroicons/react/24/outline';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getPaymentStatus } from '../../services/bml-api';
import { useCurrency } from '../../contexts/CurrencyContext';
import type { Payment } from '../../types/payment';

export function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  
  const [payment, setPayment] = useState<Payment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const transactionId = searchParams.get('transaction_id');
  const paymentId = searchParams.get('payment_id');

  useEffect(() => {
    if (paymentId) {
      getPaymentStatus(parseInt(paymentId))
        .then(setPayment)
        .catch((err) => setError(err.message || 'Failed to load payment details'))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
      setError('Payment ID not found');
    }
  }, [paymentId]);

  if (isLoading) {
    return (
      <Box p={8} textAlign="center">
        <Spinner size="xl" />
        <Text mt={4}>Loading payment details...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box maxW="600px" mx="auto" p={6}>
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
        <Button mt={4} onClick={() => navigate('/')}>
          Go to Home
        </Button>
      </Box>
    );
  }

  return (
    <Box maxW="600px" mx="auto" p={6}>
      <VStack spacing={6} align="stretch">
        {/* Success Icon and Message */}
        <Card bg="green.50" borderColor="green.200">
          <CardBody textAlign="center">
            <VStack spacing={4}>
              <Icon as={CheckCircleIcon} w={16} h={16} color="green.500" />
              <Heading size="lg" color="green.700">
                Payment Successful!
              </Heading>
              <Text color="gray.700">
                Your payment has been processed successfully.
              </Text>
            </VStack>
          </CardBody>
        </Card>

        {/* Payment Details */}
        {payment && (
          <Card>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Heading size="md">Payment Details</Heading>
                
                <HStack justify="space-between">
                  <Text fontWeight="semibold">Transaction ID:</Text>
                  <Text fontFamily="mono" fontSize="sm">
                    {payment.transaction_id}
                  </Text>
                </HStack>

                <HStack justify="space-between">
                  <Text fontWeight="semibold">Amount:</Text>
                  <Text fontWeight="bold" fontSize="lg" color="blue.600">
                    {formatPrice(parseFloat(payment.amount))} {payment.currency}
                  </Text>
                </HStack>

                {payment.description && (
                  <HStack justify="space-between">
                    <Text fontWeight="semibold">Description:</Text>
                    <Text>{payment.description}</Text>
                  </HStack>
                )}

                <HStack justify="space-between">
                  <Text fontWeight="semibold">Status:</Text>
                  <Text color="green.600" fontWeight="semibold">
                    {payment.status.toUpperCase()}
                  </Text>
                </HStack>

                {payment.completed_at && (
                  <HStack justify="space-between">
                    <Text fontWeight="semibold">Completed At:</Text>
                    <Text>
                      {new Date(payment.completed_at).toLocaleString()}
                    </Text>
                  </HStack>
                )}
              </VStack>
            </CardBody>
          </Card>
        )}

        {/* Transaction Record Statement */}
        <Card bg="blue.50" borderColor="blue.200">
          <CardBody>
            <VStack spacing={3} align="start">
              <HStack>
                <Icon as={DocumentTextIcon} w={5} h={5} color="blue.600" />
                <Text fontWeight="semibold">Important</Text>
              </HStack>
              <Text fontSize="sm" color="gray.700">
                Please retain a copy of this transaction record and our policies for your records.
                You can access our{' '}
                <Button
                  variant="link"
                  colorScheme="blue"
                  size="sm"
                  onClick={() => navigate('/terms')}
                >
                  Terms & Conditions
                </Button>
                ,{' '}
                <Button
                  variant="link"
                  colorScheme="blue"
                  size="sm"
                  onClick={() => navigate('/privacy')}
                >
                  Privacy Policy
                </Button>
                , and{' '}
                <Button
                  variant="link"
                  colorScheme="blue"
                  size="sm"
                  onClick={() => navigate('/cancellation')}
                >
                  Refund Policy
                </Button>
                {' '}on our website.
              </Text>
            </VStack>
          </CardBody>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardBody>
            <VStack spacing={3} align="stretch">
              <Heading size="sm">What's Next?</Heading>
              <Text fontSize="sm" color="gray.700">
                Your booking is now pending confirmation. Our team will review your payment
                and confirm your booking within 24 hours. You will receive a confirmation
                email at {payment?.customer_email || 'your registered email'}.
              </Text>
            </VStack>
          </CardBody>
        </Card>

        {/* Action Buttons */}
        <VStack spacing={3}>
          <Button
            colorScheme="blue"
            size="lg"
            width="100%"
            leftIcon={<Icon as={HomeIcon} w={5} h={5} />}
            onClick={() => navigate('/')}
          >
            Return to Home
          </Button>
        </VStack>
      </VStack>
    </Box>
  );
}

