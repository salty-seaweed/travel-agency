import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Container,
  Heading,
  Badge,
  Icon,
  useColorModeValue,
  SimpleGrid,
  Grid,
  GridItem,
  Divider,
  Avatar,
  AvatarGroup,
  Card,
  CardBody,
} from '@chakra-ui/react';
import { ShieldCheckIcon, CreditCardIcon, GlobeAltIcon, UserGroupIcon, StarIcon, CheckCircleIcon, ClockIcon, ChatBubbleLeftRightIcon, HeartIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { useTranslation } from '../../../i18n';
import { getWhatsAppUrl } from '../../../config';
import { Link } from 'react-router-dom';

interface Props { homepageContent?: any; }

export const ExperiencesTrustSection: React.FC<Props> = ({ homepageContent }) => {
  const { t } = useTranslation();
  
  const bgColor = useColorModeValue('white', 'gray.900');
  const cardBg = useColorModeValue('gray.50', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.300');

  const trustFeatures = [
    { icon: ShieldCheckIcon, title: t('trust.features.secure', 'Secure Payments'), description: t('trust.features.secureDesc', 'Your bookings are protected with secure payment processing.'), color: 'green' },
    { icon: GlobeAltIcon, title: t('trust.features.local', 'Local Expertise'), description: t('trust.features.localDesc', 'Curated Maldives experiences with verified local partners.'), color: 'blue' },
    { icon: UserGroupIcon, title: t('trust.features.support', 'Personal Support'), description: t('trust.features.supportDesc', 'Friendly help from real humans—before, during, and after your trip.'), color: 'purple' },
    { icon: StarIcon, title: t('trust.features.reviews', 'Great Reviews'), description: t('trust.features.reviewsDesc', 'We strive for excellence on every trip we organize.'), color: 'yellow' },
  ];

  const whyChooseUs = [
    { icon: CheckCircleIcon, title: t('trust.why.verified', 'Verified Partners'), description: t('trust.why.verifiedDesc', 'We carefully vet our local partners for quality and reliability.') },
    { icon: CreditCardIcon, title: t('trust.why.flexible', 'Flexible Payments'), description: t('trust.why.flexibleDesc', 'Multiple payment options with industry-grade security.') },
    { icon: ChatBubbleLeftRightIcon, title: t('trust.why.assistance', '24/7 Assistance'), description: t('trust.why.assistanceDesc', 'Round-the-clock support for your peace of mind.') },
    { icon: ClockIcon, title: t('trust.why.instant', 'Instant Confirmations'), description: t('trust.why.instantDesc', 'Fast responses and quick confirmations.') },
    { icon: HeartIcon, title: t('trust.why.value', 'Best Value'), description: t('trust.why.valueDesc', 'Transparent pricing and the right package for your budget.') },
  ];

  // Remove hardcoded trust indicators - these should be managed through admin panel
  const trustIndicators: any[] = [];

  return (
    <Box bg={bgColor} py={16}>
      <Container maxW="7xl">
        <VStack spacing={16}>
          <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={12} alignItems="center">
            <GridItem>
              <VStack spacing={8} align="start">
                <VStack spacing={4} align="start">
                  <Badge colorScheme="blue" variant="solid" px={4} py={2} borderRadius="full" fontSize="sm" fontWeight="semibold">
                    <HStack spacing={2}><Icon as={ShieldCheckIcon} className="w-4 h-4" /><Text>{t('trust.badge', 'Travel Confidently')}</Text></HStack>
                  </Badge>
                  <Heading size="2xl" color={textColor} fontWeight="bold" fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }} lineHeight="1.2">{t('trust.title', 'Travel Confidently, Book Seamlessly')}</Heading>
                  <Text fontSize="lg" color={mutedTextColor} lineHeight="1.6">{t('trust.subtitle', 'Booking curated Maldives experiences is easy, safe, and transparent—so you can focus on the trip, not the logistics.')}</Text>
                </VStack>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
                  {trustFeatures.map((feature, index) => (
                    <HStack key={index} spacing={4} align="start">
                      <Box p={3} borderRadius="lg" bg={`${feature.color}.100`} color={`${feature.color}.600`}>
                        <Icon as={feature.icon} className="w-6 h-6" />
                      </Box>
                      <VStack spacing={2} align="start">
                        <Text fontWeight="semibold" color={textColor}>{feature.title}</Text>
                        <Text fontSize="sm" color={mutedTextColor} lineHeight="1.5">{feature.description}</Text>
                      </VStack>
                    </HStack>
                  ))}
                </SimpleGrid>

                <HStack spacing={3} pt={2}>
                  <a href={getWhatsAppUrl('Hi! I would like help choosing a Maldives experience')} target="_blank" rel="noopener noreferrer">
                    <Button colorScheme="whatsapp" size="lg">{t('homepage.cta.chatWhatsApp')}</Button>
                  </a>
                  <Link to="/contact">
                    <Button size="lg" variant="outline" rightIcon={<Icon as={ArrowRightIcon} className="w-5 h-5" />}>{t('homepage.cta.contactUs', 'Contact Now')}</Button>
                  </Link>
                </HStack>
              </VStack>
            </GridItem>

            <GridItem>
              <Card bg={cardBg} border="1px solid" borderColor={borderColor} shadow="xl" borderRadius="xl" overflow="hidden">
                <CardBody p={8}>
                  <VStack spacing={8}>
                    <VStack spacing={2} textAlign="center">
                      <Heading size="lg" color={textColor}>{t('trust.trustedTitle', 'Trusted by Travelers')}</Heading>
                      <Text color={mutedTextColor}>{t('trust.trustedSubtitle', "We're committed to excellent service")}</Text>
                    </VStack>

                    <SimpleGrid columns={{ base: 3, md: 3 }} spacing={6} w="full">
                      {trustIndicators.map((indicator, index) => (
                        <VStack key={index} spacing={2} textAlign="center">
                          <Text fontSize="2xl" fontWeight="bold" color="blue.600">{indicator.value}</Text>
                          <Text fontSize="sm" color={mutedTextColor} fontWeight="medium">{indicator.label}</Text>
                        </VStack>
                      ))}
                    </SimpleGrid>

                    <Divider />

                    <VStack spacing={4} w="full">
                      <HStack spacing={4} justify="center">
                        {[1,2,3,4,5].map((star) => (<Icon key={star} as={StarSolidIcon} className="w-5 h-5 text-yellow-400" />))}
                        <Text fontWeight="semibold" color={textColor}>4.8/5</Text>
                      </HStack>
                      <Text fontSize="sm" color={mutedTextColor} textAlign="center">{t('trust.aim', 'We aim to delight every traveler')}</Text>
                      <AvatarGroup size="sm" max={5}>
                        <Avatar src="/src/assets/images/ishan63.jpg" />
                        <Avatar src="/src/assets/images/ishan64.jpg" />
                        <Avatar src="/src/assets/images/ishan65.jpg" />
                        <Avatar src="/src/assets/images/ishan66.jpg" />
                        <Avatar src="/src/assets/images/ishan67.jpg" />
                      </AvatarGroup>
                    </VStack>
                  </VStack>
                </CardBody>
              </Card>
            </GridItem>
          </Grid>

          <VStack spacing={12} w="full">
            <VStack spacing={4} textAlign="center">
              <Heading size="xl" color={textColor} fontWeight="bold">{t('trust.why.title', 'Why Choose Us?')}</Heading>
              <Text fontSize="lg" color={mutedTextColor} maxW="2xl" lineHeight="1.6">{t('trust.why.subtitle', 'We make Maldives trip planning simple and stress-free.')}</Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} w="full">
              {whyChooseUs.map((feature, index) => (
                <Card key={index} bg={cardBg} border="1px solid" borderColor={borderColor} p={6} transition="all 0.3s" _hover={{ transform: 'translateY(-4px)', shadow: 'lg', borderColor: 'blue.300' }}>
                  <VStack spacing={4} align="start">
                    <Box p={3} borderRadius="lg" bg="blue.100" color="blue.600">
                      <Icon as={feature.icon} className="w-6 h-6" />
                    </Box>
                    <VStack spacing={2} align="start">
                      <Text fontWeight="semibold" color={textColor} fontSize="lg">{feature.title}</Text>
                      <Text fontSize="sm" color={mutedTextColor} lineHeight="1.5">{feature.description}</Text>
                    </VStack>
                  </VStack>
                </Card>
              ))}
            </SimpleGrid>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
};
