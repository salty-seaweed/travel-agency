import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Container,
  Input,
  useColorModeValue,
  useToast,
  Icon,
  Heading,
} from '@chakra-ui/react';
import {
  GiftIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { useTranslation } from '../../../i18n';

export const ExperiencesNewsletterSection: React.FC = () => {
  const { t } = useTranslation();
  const toast = useToast();
  
  const bgColor = useColorModeValue('blue.600', 'blue.700');
  const textColor = useColorModeValue('white', 'white');
  const mutedTextColor = useColorModeValue('blue.100', 'blue.200');

  const [email, setEmail] = useState('');

  const handleSubscribe = () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({ title: 'Valid email required', status: 'warning', duration: 3000, isClosable: true });
      return;
    }

    const existing = localStorage.getItem('newsletter_subscribers');
    const subscribers = existing ? JSON.parse(existing) : [];
    if (!subscribers.includes(email)) subscribers.push(email);
    localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));

    toast({ title: 'Subscribed!', description: 'We\'ll keep you posted with Maldives deals.', status: 'success', duration: 3000, isClosable: true });
    setEmail('');
  };

  return (
    <Box bg={bgColor} py={16}>
      <Container maxW="4xl">
        <VStack spacing={8} textAlign="center">
          <VStack spacing={4}>
            <Icon as={GiftIcon} className="w-12 h-12 text-white" />
            <Heading size="xl" color={textColor} fontWeight="bold" fontSize={{ base: '2xl', md: '3xl' }}>
              Maldives Deals & Insider Tips
            </Heading>
            <Text fontSize="lg" color={mutedTextColor} maxW="2xl" lineHeight="1.6">
              Get exclusive offers on Maldives stays and experiences—straight to your inbox.
            </Text>
          </VStack>

          <HStack spacing={4} w="full" maxW="md">
            <Input placeholder="Enter your email address" value={email} onChange={(e) => setEmail(e.target.value)} size="lg" borderRadius="lg" bg="white" color="gray.800" _placeholder={{ color: 'gray.500' }} />
            <Button onClick={handleSubscribe} size="lg" colorScheme="white" variant="solid" px={8} borderRadius="lg" rightIcon={<Icon as={ArrowRightIcon} className="w-5 h-5" />}>
              Subscribe
            </Button>
          </HStack>

          <Text fontSize="sm" color={mutedTextColor}>
            We respect your privacy. Unsubscribe anytime.
          </Text>
        </VStack>
      </Container>
    </Box>
  );
};
