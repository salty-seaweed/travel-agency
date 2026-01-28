import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Button,
  Checkbox,
  Card,
  CardBody,
  Divider,
  Alert,
  AlertIcon,
  Spinner,
  Link,
  Icon,
  useToast,
} from '@chakra-ui/react';
import {
  CreditCardIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createPayment, getMerchantInfo } from '../../services/bml-api';
import { useCurrency } from '../../contexts/CurrencyContext';
import type { PaymentCreateRequest, MerchantInfo as MerchantInfoType } from '../../types/payment';
import { config } from '../../config';

interface PaymentCheckoutProps {
  amount: number;
  currency?: string;
  description?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  bookingId?: number;
  onSuccess?: (paymentId: number) => void;
  onCancel?: () => void;
}

export function PaymentCheckout({
  amount: propAmount,
  currency: propCurrency = 'USD',
  description: propDescription = 'Payment for travel services',
  customerName: initialCustomerName,
  customerEmail: initialCustomerEmail,
  customerPhone: initialCustomerPhone,
  bookingId: propBookingId,
  onSuccess,
  onCancel,
}: PaymentCheckoutProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { formatPrice } = useCurrency();
  
  // Get values from URL params or props
  const amount = propAmount || parseFloat(searchParams.get('amount') || '0');
  const currency = propCurrency || searchParams.get('currency') || 'USD';
  const description = propDescription || searchParams.get('description') || 'Payment for travel services';
  const bookingId = propBookingId || (searchParams.get('booking_id') ? parseInt(searchParams.get('booking_id')!) : undefined);
  
  const [customerName, setCustomerName] = useState(initialCustomerName || '');
  const [customerEmail, setCustomerEmail] = useState(initialCustomerEmail || '');
  const [customerPhone, setCustomerPhone] = useState(initialCustomerPhone || '');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [merchantInfo, setMerchantInfo] = useState<MerchantInfoType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMerchantInfo, setIsLoadingMerchantInfo] = useState(true);

  useEffect(() => {
    // Load merchant information
    getMerchantInfo()
      .then(setMerchantInfo)
      .catch(() => {
        // Use defaults if API fails
        setMerchantInfo({
          trading_name: config.companyName,
          company_name: config.companyName,
          complete_address: '',
          postal_address: '',
          email: config.supportEmail,
          phone: config.whatsappNumber,
          customer_service_phone: config.whatsappNumber,
          customer_service_email: config.supportEmail,
        });
      })
      .finally(() => setIsLoadingMerchantInfo(false));
  }, []);

  const handlePayment = async () => {
    if (!termsAccepted) {
      toast({
        title: 'Terms Required',
        description: 'Please accept the terms and conditions to proceed',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    if (!customerName || !customerEmail) {
      toast({
        title: 'Information Required',
        description: 'Please provide your name and email',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);

    try {
      const paymentData: PaymentCreateRequest = {
        amount,
        currency,
        description,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone || undefined,
        booking_id: bookingId,
        return_url: `${window.location.origin}/payment/success`,
        cancel_url: `${window.location.origin}/payment/cancel`,
      };

      const response = await createPayment(paymentData);

      if (response.payment_url) {
        // Redirect to BML payment gateway
        window.location.href = response.payment_url;
      } else {
        throw new Error('Payment URL not received');
      }
    } catch (error: any) {
      toast({
        title: 'Payment Error',
        description: error.message || 'Failed to initiate payment',
        status: 'error',
        duration: 5000,
      });
      setIsLoading(false);
    }
  };

  if (isLoadingMerchantInfo) {
    return (
      <Box p={8} textAlign="center">
        <Spinner size="xl" />
        <Text mt={4}>Loading payment information...</Text>
      </Box>
    );
  }

  return (
    <Box maxW="800px" mx="auto" p={6}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box>
          <Heading size="lg" mb={2}>
            Payment Checkout
          </Heading>
          <Text color="gray.600">
            Complete your payment securely through Bank of Maldives
          </Text>
        </Box>

        {/* Payment Summary */}
        <Card>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between">
                <Text fontWeight="semibold">Amount:</Text>
                <Text fontSize="xl" fontWeight="bold" color="blue.600">
                  {formatPrice(amount)} {currency}
                </Text>
              </HStack>
              {description && (
                <>
                  <Divider />
                  <Text color="gray.600">{description}</Text>
                </>
              )}
            </VStack>
          </CardBody>
        </Card>

        {/* Customer Information */}
        <Card>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <Heading size="md">Customer Information</Heading>
              
              <Box>
                <Text mb={2} fontWeight="medium">
                  Full Name <Text as="span" color="red.500">*</Text>
                </Text>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter your full name"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.375rem',
                  }}
                  required
                />
              </Box>

              <Box>
                <Text mb={2} fontWeight="medium">
                  Email <Text as="span" color="red.500">*</Text>
                </Text>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="Enter your email"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.375rem',
                  }}
                  required
                />
              </Box>

              <Box>
                <Text mb={2} fontWeight="medium">Phone Number</Text>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.375rem',
                  }}
                />
              </Box>
            </VStack>
          </CardBody>
        </Card>

        {/* Compliance Information */}
        <Card bg="blue.50" borderColor="blue.200">
          <CardBody>
            <VStack spacing={4} align="stretch">
              {/* Currency Disclosure */}
              <HStack>
                <Icon as={CurrencyDollarIcon} w={5} h={5} color="blue.600" />
                <Text fontWeight="semibold">Transaction Currency: {currency}</Text>
              </HStack>

              {/* Merchant Country Disclosure */}
              <HStack>
                <Icon as={GlobeAltIcon} w={5} h={5} color="blue.600" />
                <Text fontWeight="semibold">Merchant Outlet Country: Maldives</Text>
              </HStack>

              {/* Security Statement */}
              <HStack align="start">
                <Icon as={ShieldCheckIcon} w={5} h={5} color="blue.600" mt={1} />
                <Box>
                  <Text fontWeight="semibold" mb={1}>
                    Secure Payment Processing
                  </Text>
                  <Text fontSize="sm" color="gray.700">
                    Your payment card details are transmitted securely using industry-standard encryption.
                    We do not store your card information on our servers.
                  </Text>
                </Box>
              </HStack>

              {/* Merchant Information */}
              {merchantInfo && (
                <Box pt={2} borderTop="1px solid" borderColor="blue.200">
                  <Text fontSize="sm" fontWeight="semibold" mb={2}>
                    Merchant Information:
                  </Text>
                  <Text fontSize="sm" color="gray.700">
                    {merchantInfo.trading_name || merchantInfo.company_name}
                    {merchantInfo.complete_address && (
                      <>
                        <br />
                        {merchantInfo.complete_address}
                      </>
                    )}
                    {merchantInfo.email && (
                      <>
                        <br />
                        Email: {merchantInfo.email}
                      </>
                    )}
                    {merchantInfo.phone && (
                      <>
                        <br />
                        Phone: {merchantInfo.phone}
                      </>
                    )}
                  </Text>
                </Box>
              )}
            </VStack>
          </CardBody>
        </Card>

        {/* Terms and Conditions */}
        <Card>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <HStack>
                <Icon as={DocumentTextIcon} w={5} h={5} color="blue.600" />
                <Heading size="sm">Terms & Conditions</Heading>
              </HStack>
              
              <Text fontSize="sm" color="gray.700">
                By proceeding with this payment, you agree to our{' '}
                <Link href="/terms" color="blue.600" isExternal>
                  Terms & Conditions
                </Link>
                ,{' '}
                <Link href="/privacy" color="blue.600" isExternal>
                  Privacy Policy
                </Link>
                , and{' '}
                <Link href="/cancellation" color="blue.600" isExternal>
                  Refund Policy
                </Link>
                .
              </Text>

              <Checkbox
                isChecked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                colorScheme="blue"
              >
                <Text fontSize="sm">
                  I accept the Terms & Conditions, Privacy Policy, and Refund Policy{' '}
                  <Text as="span" color="red.500">*</Text>
                </Text>
              </Checkbox>
            </VStack>
          </CardBody>
        </Card>

        {/* Card Brand Logos */}
        <Box textAlign="center" py={4}>
          <Text fontSize="sm" color="gray.600" mb={2}>
            We accept the following payment methods:
          </Text>
          <HStack justify="center" spacing={4} flexWrap="wrap">
            <Text fontSize="xs" color="gray.500">
              Visa • Mastercard • American Express
            </Text>
          </HStack>
        </Box>

        {/* Action Buttons */}
        <VStack spacing={3}>
          <Button
            colorScheme="blue"
            size="lg"
            width="100%"
            onClick={handlePayment}
            isLoading={isLoading}
            leftIcon={<Icon as={CreditCardIcon} w={5} h={5} />}
            isDisabled={!termsAccepted || !customerName || !customerEmail}
          >
            Proceed to Payment
          </Button>

          {onCancel && (
            <Button
              variant="outline"
              size="md"
              width="100%"
              onClick={onCancel}
              isDisabled={isLoading}
            >
              Cancel
            </Button>
          )}
        </VStack>
      </VStack>
    </Box>
  );
}

