import React from 'react';
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
} from '@chakra-ui/react';
import {
  XCircleIcon,
  HomeIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { useNavigate, useSearchParams } from 'react-router-dom';

export function PaymentFailure() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const transactionId = searchParams.get('transaction_id');
  const error = searchParams.get('error') || 'Payment was cancelled or failed';

  return (
    <Box maxW="600px" mx="auto" p={6}>
      <VStack spacing={6} align="stretch">
        {/* Failure Icon and Message */}
        <Card bg="red.50" borderColor="red.200">
          <CardBody textAlign="center">
            <VStack spacing={4}>
              <Icon as={XCircleIcon} w={16} h={16} color="red.500" />
              <Heading size="lg" color="red.700">
                Payment Failed
              </Heading>
              <Text color="gray.700">
                {error}
              </Text>
            </VStack>
          </CardBody>
        </Card>

        {/* Transaction ID if available */}
        {transactionId && (
          <Card>
            <CardBody>
              <VStack spacing={2} align="stretch">
                <Text fontWeight="semibold">Transaction ID:</Text>
                <Text fontFamily="mono" fontSize="sm">
                  {transactionId}
                </Text>
              </VStack>
            </CardBody>
          </Card>
        )}

        {/* Help Information */}
        <Alert status="info">
          <AlertIcon />
          <Box>
            <Text fontWeight="semibold" mb={1}>
              Need Help?
            </Text>
            <Text fontSize="sm">
              If you believe this is an error, please contact our customer service.
              Your payment may still be processing - please check your email for updates.
            </Text>
          </Box>
        </Alert>

        {/* Action Buttons */}
        <VStack spacing={3}>
          <Button
            colorScheme="blue"
            size="lg"
            width="100%"
            leftIcon={<Icon as={ArrowPathIcon} w={5} h={5} />}
            onClick={() => navigate(-1)}
          >
            Try Again
          </Button>

          <Button
            variant="outline"
            size="md"
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

