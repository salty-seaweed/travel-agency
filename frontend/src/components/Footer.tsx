import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Heading,
  SimpleGrid,
  Icon,
  useColorModeValue,
  Divider,
  Button,
} from '@chakra-ui/react';
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';
import { useTranslation } from '../i18n';
import { useWhatsApp, useHomepageData } from '../hooks/useQueries';

export function Footer() {
  const { t } = useTranslation();
  const { getWhatsAppUrl } = useWhatsApp();
  const { data: settings } = useHomepageData();
  
  const bgColor = useColorModeValue('gray.900', 'gray.900');
  const textColor = useColorModeValue('gray.300', 'gray.300');
  const headingColor = useColorModeValue('white', 'white');
  const linkHoverColor = useColorModeValue('blue.400', 'blue.300');

  const quickLinks = [
    { name: t('footer.links.home', 'Home'), href: '/' },
    { name: t('footer.links.packages', 'Packages'), href: '/packages' },
    { name: t('footer.links.properties', 'Properties'), href: '/properties' },
    { name: t('footer.links.transportation', 'Transportation'), href: '/transportation' },
    { name: t('footer.links.about', 'About'), href: '/about' },
    { name: t('footer.links.contact', 'Contact'), href: '/contact' },
  ];

  const services = [
    { name: t('footer.services.accommodation', 'Accommodation Booking'), href: '/properties' },
    { name: t('footer.services.packages', 'Travel Packages'), href: '/packages' },
    { name: t('footer.services.transfers', 'Airport Transfers'), href: '/transportation' },
    { name: t('footer.services.activities', 'Activities & Tours'), href: '/packages?category=activities' },
    { name: t('footer.services.custom', 'Custom Itineraries'), href: '/contact' },
  ];

  const handleWhatsAppClick = () => {
    window.open(getWhatsAppUrl("Hi! I'd like to inquire about your services"), '_blank');
  };

  return (
    <Box bg={bgColor} color={textColor} py={12}>
      <Container maxW="7xl">
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} mb={8}>
          {/* Company Info */}
          <VStack align="start" spacing={4}>
            <Heading size="md" color={headingColor}>
              {settings?.site_title || 'Thread Travels & Tours'}
            </Heading>
            <Text fontSize="sm" lineHeight="1.6">
              {settings?.site_description || t('footer.description', 'Your trusted partner for unforgettable Maldives experiences. We specialize in creating personalized travel packages and accommodation bookings.')}
            </Text>
            <Button
              colorScheme="whatsapp"
              size="sm"
              onClick={handleWhatsAppClick}
              leftIcon={<Icon as={PhoneIcon} />}
            >
              {t('footer.whatsapp', 'Chat on WhatsApp')}
            </Button>
          </VStack>

          {/* Quick Links */}
          <VStack align="start" spacing={4}>
            <Heading size="sm" color={headingColor}>
              {t('footer.quickLinks', 'Quick Links')}
            </Heading>
            <VStack align="start" spacing={2}>
              {quickLinks.map((link) => (
                <Link key={link.href} to={link.href}>
                  <Text
                    fontSize="sm"
                    _hover={{ color: linkHoverColor }}
                    transition="color 0.2s"
                  >
                    {link.name}
                  </Text>
                </Link>
              ))}
            </VStack>
          </VStack>

          {/* Services */}
          <VStack align="start" spacing={4}>
            <Heading size="sm" color={headingColor}>
              {t('footer.services.title', 'Our Services')}
            </Heading>
            <VStack align="start" spacing={2}>
              {services.map((service) => (
                <Link key={service.href} to={service.href}>
                  <Text
                    fontSize="sm"
                    _hover={{ color: linkHoverColor }}
                    transition="color 0.2s"
                  >
                    {service.name}
                  </Text>
                </Link>
              ))}
            </VStack>
          </VStack>

          {/* Contact Info */}
          <VStack align="start" spacing={4}>
            <Heading size="sm" color={headingColor}>
              {t('footer.contact.title', 'Contact Info')}
            </Heading>
            <VStack align="start" spacing={3}>
              <HStack spacing={3}>
                <Icon as={MapPinIcon} w={4} h={4} />
                <Text fontSize="sm">
                  {t('footer.contact.address', 'Malé, Maldives')}
                </Text>
              </HStack>
              <HStack spacing={3}>
                <Icon as={PhoneIcon} w={4} h={4} />
                <Text fontSize="sm">
                  {settings?.contact_phone || '+960 744 1097'}
                </Text>
              </HStack>
              <HStack spacing={3}>
                <Icon as={EnvelopeIcon} w={4} h={4} />
                <Text fontSize="sm">
                  {settings?.contact_email || 'info@threadtravels.mv'}
                </Text>
              </HStack>
              <HStack spacing={3}>
                <Icon as={GlobeAltIcon} w={4} h={4} />
                <Text fontSize="sm">
                  threadtravels.mv
                </Text>
              </HStack>
            </VStack>
          </VStack>
        </SimpleGrid>

        <Divider borderColor="gray.700" my={8} />

        <VStack spacing={4}>
          <HStack spacing={6} flexWrap="wrap" justify="center">
            <Link to="/terms">
              <Text fontSize="sm" _hover={{ color: linkHoverColor }}>
                {t('footer.legal.terms', 'Terms & Conditions')}
              </Text>
            </Link>
            <Link to="/privacy">
              <Text fontSize="sm" _hover={{ color: linkHoverColor }}>
                {t('footer.legal.privacy', 'Privacy Policy')}
              </Text>
            </Link>
            <Link to="/cancellation">
              <Text fontSize="sm" _hover={{ color: linkHoverColor }}>
                {t('footer.legal.cancellation', 'Cancellation Policy')}
              </Text>
            </Link>
          </HStack>

          <Text fontSize="sm" textAlign="center">
            {settings?.footer_text || 
             t('footer.copyright', '© 2024 Thread Travels & Tours. All rights reserved. Licensed travel agency in the Maldives.')}
          </Text>
        </VStack>
      </Container>
    </Box>
  );
}

export default Footer;
