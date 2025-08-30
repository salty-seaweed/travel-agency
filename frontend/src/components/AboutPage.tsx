import {
  SparklesIcon,
  GlobeAltIcon,
  MapIcon,
  ArrowRightIcon,
  InformationCircleIcon,
  UsersIcon,
  StarIcon,
  HeartIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { useTranslation } from '../i18n';
import { useWhatsApp, usePageHero, useAboutPageData } from '../hooks/useQueries';
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Button,
  Badge,
  Icon,
  SimpleGrid,
  Heading,
  Image
} from '@chakra-ui/react';

export function AboutPage() {
  const { t } = useTranslation();
  const { getWhatsAppUrl } = useWhatsApp();
  const { data: hero } = usePageHero('about');
  const { data: aboutData, isLoading: aboutLoading } = useAboutPageData();
  
  // Use API data for stats if available, otherwise fallback to defaults
  const stats = aboutData?.statistics?.length > 0 ? aboutData.statistics.map((stat: any) => ({
    label: stat.label,
    value: stat.value,
    icon: stat.icon === 'UsersIcon' ? UsersIcon : 
          stat.icon === 'GlobeAltIcon' ? GlobeAltIcon :
          stat.icon === 'HeartIcon' ? HeartIcon :
          stat.icon === 'StarIcon' ? StarIcon : UsersIcon,
    description: stat.description
  })) : [
    {
      label: t('about.stats.happyTravelers.label', 'Happy Travelers'),
      value: '500+',
      icon: UsersIcon,
      description: t('about.stats.happyTravelers.description', 'Satisfied customers worldwide')
    },
    {
      label: t('about.stats.destinations.label', 'Destinations'),
      value: '50+',
      icon: GlobeAltIcon,
      description: t('about.stats.destinations.description', 'Beautiful locations across Maldives')
    },
    {
      label: t('about.stats.yearsExperience.label', 'Years Experience'),
      value: '5+',
      icon: HeartIcon,
      description: t('about.stats.yearsExperience.description', 'Professional travel expertise')
    },
    {
      label: t('about.stats.averageRating.label', 'Average Rating'),
      value: '4.8',
      icon: StarIcon,
      description: t('about.stats.averageRating.description', 'Customer satisfaction score')
    }
  ];

  // Use API data for values if available, otherwise fallback to defaults
  const values = aboutData?.values?.length > 0 ? aboutData.values.map((value: any) => ({
    title: value.title,
    description: value.description,
    icon: value.icon || "⭐"
  })) : [
    {
      title: t('about.values.authenticExperiences.title', 'Authentic Experiences'),
      description: t('about.values.authenticExperiences.description', 'We believe in providing genuine, local experiences that connect travelers with the true essence of the Maldives.'),
      icon: "🌊"
    },
    {
      title: t('about.values.qualityAssurance.title', 'Quality Assurance'),
      description: t('about.values.qualityAssurance.description', 'Every package is personally verified to ensure the highest standards of quality and service.'),
      icon: "⭐"
    },
    {
      title: t('about.values.sustainableTourism.title', 'Sustainable Tourism'),
      description: t('about.values.sustainableTourism.description', 'We\'re committed to promoting responsible tourism that preserves the natural beauty of the Maldives.'),
      icon: "🌿"
    },
    {
      title: t('about.values.customerFirst.title', 'Customer First'),
      description: t('about.values.customerFirst.description', 'Your satisfaction is our priority. We go above and beyond to create memorable experiences.'),
      icon: "❤️"
    }
  ];

  return (
    <Box bg="gray.50" className="bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Background Image (Admin-controlled) */}
        <Box position="absolute" top={0} left={0} right={0} bottom={0}>
          <Image
            src={hero?.image_url || '/src/assets/images/ishan116.jpg'}
            alt={hero?.title || 'Maldives About Background'}
            w="full"
            h="full"
            objectFit="cover"
          />
          <Box position="absolute" top={0} left={0} right={0} bottom={0} bg={`blackAlpha.${Math.round((hero?.overlay_opacity ?? 0.6) * 100)}`} />
        </Box>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 animate-float">
            <Icon as={SparklesIcon} className="w-16 h-16 text-white" />
          </div>
          <div className="absolute top-20 right-20 animate-float-delayed">
            <Icon as={GlobeAltIcon} className="w-12 h-12 text-white" />
          </div>
          <div className="absolute bottom-20 left-20 animate-float-slow">
            <Icon as={MapIcon} className="w-20 h-20 text-white" />
          </div>
        </div>
        
        <Container maxW="7xl" className="relative z-10 text-center px-4">
          <VStack spacing={8}>
            <Badge 
              className="bg-white/20 backdrop-blur-md text-white px-6 py-2 rounded-full text-sm font-bold border border-white/30"
            >
              <Icon as={SparklesIcon} className="w-4 h-4 mr-2" />
              {t('about.hero.badge', 'About Thread Travels')}
            </Badge>
            
            <Text fontSize={{ base: "5xl", md: "6xl" }} fontWeight="bold" color="white">
              {hero?.title || t('about.hero.title', 'About Maldives Travel')}
            </Text>
            
            <Text fontSize="xl" color="white" maxW="4xl" mx="auto" lineHeight="relaxed">
              {hero?.subtitle || t('about.hero.subtitle', 'Your trusted partner in discovering the magic of the Maldives. We specialize in creating unforgettable travel experiences that connect you with the beauty and culture of this paradise destination.')}
            </Text>

            <HStack spacing={6} flexDir={{ base: "column", sm: "row" }} justify="center" align="center">
              <a href={getWhatsAppUrl("Hi! I'd like to learn more about Thread Travels and your services")} target="_blank" rel="noopener noreferrer">
                <Button 
                  size="lg"
                  bg="green.500"
                  _hover={{ bg: "green.600", shadow: "0 0 30px rgba(34, 197, 94, 0.4)", scale: 1.05 }}
                  color="white"
                  px={8}
                  py={4}
                  fontSize="lg"
                  fontWeight="bold"
                  borderRadius="full"
                  shadow="2xl"
                  transition="all 0.3s"
                  transform="auto"
                  display="flex"
                  alignItems="center"
                >
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {t('about.hero.getInTouch', 'Get in Touch')}
                  <Icon as={ArrowRightIcon} className="w-5 h-5 ml-2" />
                </Button>
              </a>
              <Button 
                size="lg"
                variant="outline"
                border="2px solid"
                borderColor="white"
                color="white"
                _hover={{ bg: "white", color: "blue.600", scale: 1.05 }}
                px={8}
                py={4}
                fontSize="lg"
                fontWeight="bold"
                borderRadius="full"
                transition="all 0.3s"
                transform="auto"
                backdropFilter="blur(4px)"
                display="flex"
                alignItems="center"
                onClick={() => {
                  const element = document.getElementById('our-story');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Icon as={InformationCircleIcon} className="w-6 h-6 mr-3" />
                {t('about.hero.learnMore', 'Learn More')}
                <Icon as={ArrowRightIcon} className="w-5 h-5 ml-2" />
              </Button>
            </HStack>
          </VStack>
        </Container>
      </section>

      {/* Stats Section */}
      <Box py={16} bg="gray.50">
        <Container maxW="7xl" px={4}>
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={8}>
            {stats.map((stat, index) => (
              <Box key={index} textAlign="center">
                <Box w={16} h={16} bg="blue.100" borderRadius="full" display="flex" alignItems="center" justifyContent="center" mx="auto" mb={4}>
                  <Icon as={stat.icon} h={8} w={8} color="blue.600" />
                </Box>
                <Text fontSize="3xl" fontWeight="bold" color="gray.900" mb={2}>{stat.value}</Text>
                <Text color="gray.600">{stat.description}</Text>
              </Box>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Story Section */}
      <Box id="our-story" py={20}>
        <Container maxW="7xl" px={4}>
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={12} alignItems="center">
            <VStack align="start" spacing={6}>
              <Heading as="h2" size="xl" color="gray.900" mb={6}>
                {aboutData?.content_sections?.find((section: any) => section.section_type === 'story')?.title || t('about.story.title', 'Our Story')}
              </Heading>
              <Text fontSize="lg" color="gray.600" mb={6}>
                {aboutData?.content_sections?.find((section: any) => section.section_type === 'story')?.content || 
                 t('about.story.paragraph1', 'Founded with a passion for showcasing the authentic beauty of the Maldives, we\'ve been connecting travelers with extraordinary experiences since our inception. Our journey began with a simple mission: to make the magic of the Maldives accessible to everyone.')}
              </Text>
              {aboutData?.content_sections?.find((section: any) => section.section_type === 'story')?.subtitle && (
                <Text fontSize="lg" color="gray.600" mb={6}>
                  {aboutData.content_sections.find((section: any) => section.section_type === 'story').subtitle}
                </Text>
              )}
            </VStack>
            <Box position="relative">
              <Image
                src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop"
                alt="Maldives Travel Story"
                borderRadius="lg"
                shadow="lg"
              />
            </Box>
          </SimpleGrid>
        </Container>
      </Box>

      {/* Values Section */}
      <Box py={20} bg="gray.50">
        <Container maxW="7xl" px={4}>
          <VStack spacing={16} textAlign="center" mb={16}>
            <Heading as="h2" size="xl" color="gray.900" mb={4}>
              {t('about.values.title', 'Our Values')}
            </Heading>
            <Text fontSize="xl" color="gray.600" maxW="3xl" mx="auto">
              {t('about.values.subtitle', 'The principles that guide everything we do and every experience we create.')}
            </Text>
          </VStack>
          
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
            {values.map((value, index) => (
              <VStack key={index} textAlign="center" spacing={4}>
                <Text fontSize="4xl" mb={4}>{value.icon}</Text>
                <Heading as="h3" size="md" color="gray.900" mb={2}>
                  {value.title}
                </Heading>
                <Text color="gray.600">{value.description}</Text>
              </VStack>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Why Choose Us Section */}
      <Box py={20} bg="gray.50">
        <Container maxW="7xl" px={4}>
          <VStack spacing={16} textAlign="center" mb={16}>
            <Heading as="h2" size="xl" color="gray.900" mb={4}>
              {t('about.whyChoose.title', 'Why Choose Maldives Travel?')}
            </Heading>
            <Text fontSize="xl" color="gray.600" maxW="3xl" mx="auto">
              {t('about.whyChoose.subtitle', 'We\'re not just another travel agency. Here\'s what makes us special.')}
            </Text>
          </VStack>
          
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
            <Box bg="white" borderRadius="lg" p={6} shadow="sm">
              <Box w={12} h={12} bg="blue.100" borderRadius="lg" display="flex" alignItems="center" justifyContent="center" mb={4}>
                <Icon as={MapIcon} h={6} w={6} color="blue.600" />
              </Box>
              <Heading as="h3" size="md" color="gray.900" mb={2}>
                {t('about.whyChoose.localExpertise.title', 'Local Expertise')}
              </Heading>
              <Text color="gray.600">
                {t('about.whyChoose.localExpertise.description', 'Our team has deep local knowledge and connections throughout the Maldives.')}
              </Text>
            </Box>
            
            <Box bg="white" borderRadius="lg" p={6} shadow="sm">
              <Box w={12} h={12} bg="green.100" borderRadius="lg" display="flex" alignItems="center" justifyContent="center" mb={4}>
                <Icon as={StarIcon} h={6} w={6} color="green.600" />
              </Box>
              <Heading as="h3" size="md" color="gray.900" mb={2}>
                {t('about.whyChoose.verifiedPackages.title', 'Verified Packages')}
              </Heading>
              <Text color="gray.600">
                {t('about.whyChoose.verifiedPackages.description', 'Every package is personally visited and verified for quality and safety.')}
              </Text>
            </Box>
            
            <Box bg="white" borderRadius="lg" p={6} shadow="sm">
              <Box w={12} h={12} bg="purple.100" borderRadius="lg" display="flex" alignItems="center" justifyContent="center" mb={4}>
                <Icon as={CalendarIcon} h={6} w={6} color="purple.600" />
              </Box>
              <Heading as="h3" size="md" color="gray.900" mb={2}>
                {t('about.whyChoose.support.title', '24/7 Support')}
              </Heading>
              <Text color="gray.600">
                {t('about.whyChoose.support.description', 'Round-the-clock support to ensure your trip goes smoothly.')}
              </Text>
            </Box>
            
            <Box bg="white" borderRadius="lg" p={6} shadow="sm">
              <Box w={12} h={12} bg="yellow.100" borderRadius="lg" display="flex" alignItems="center" justifyContent="center" mb={4}>
                <Icon as={HeartIcon} h={6} w={6} color="yellow.600" />
              </Box>
              <Heading as="h3" size="md" color="gray.900" mb={2}>
                {t('about.whyChoose.personalizedService.title', 'Personalized Service')}
              </Heading>
              <Text color="gray.600">
                {t('about.whyChoose.personalizedService.description', 'Customized itineraries tailored to your preferences and budget.')}
              </Text>
            </Box>
            
            <Box bg="white" borderRadius="lg" p={6} shadow="sm">
              <Box w={12} h={12} bg="red.100" borderRadius="lg" display="flex" alignItems="center" justifyContent="center" mb={4}>
                <Icon as={GlobeAltIcon} h={6} w={6} color="red.600" />
              </Box>
              <Heading as="h3" size="md" color="gray.900" mb={2}>
                {t('about.whyChoose.sustainableTourism.title', 'Sustainable Tourism')}
              </Heading>
              <Text color="gray.600">
                {t('about.whyChoose.sustainableTourism.description', 'We promote responsible tourism that benefits local communities.')}
              </Text>
            </Box>
            
            <Box bg="white" borderRadius="lg" p={6} shadow="sm">
              <Box w={12} h={12} bg="indigo.100" borderRadius="lg" display="flex" alignItems="center" justifyContent="center" mb={4}>
                <Icon as={InformationCircleIcon} h={6} w={6} color="indigo.600" />
              </Box>
              <Heading as="h3" size="md" color="gray.900" mb={2}>
                {t('about.whyChoose.transparentPricing.title', 'Transparent Pricing')}
              </Heading>
              <Text color="gray.600">
                {t('about.whyChoose.transparentPricing.description', 'No hidden fees or surprises. Clear, upfront pricing for all services.')}
              </Text>
            </Box>
          </SimpleGrid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box py={20} bgGradient="linear(to-r, blue.600, indigo.600)" color="white">
        <Container maxW="4xl" textAlign="center" px={4}>
          <Heading as="h2" size="xl" mb={6}>
            {t('about.cta.title', 'Ready to Start Your Maldives Adventure?')}
          </Heading>
          <Text fontSize="xl" color="blue.100" mb={8}>
            {t('about.cta.subtitle', 'Let us help you create memories that will last a lifetime in paradise.')}
          </Text>
          <HStack spacing={4} justify="center" flexDir={{ base: "column", sm: "row" }}>
            <Button
              as="a"
              href="/packages"
              bg="white"
              color="blue.600"
              px={8}
              py={4}
              borderRadius="lg"
              fontWeight="semibold"
              _hover={{ bg: "gray.100" }}
              transition="colors 0.2s"
            >
              {t('about.cta.browsePackages', 'Browse Packages')}
            </Button>
            <Button
              as="a"
              href="/contact"
              variant="outline"
              border="2px solid"
              borderColor="white"
              color="white"
              px={8}
              py={4}
              borderRadius="lg"
              fontWeight="semibold"
              _hover={{ bg: "white", color: "blue.600" }}
              transition="colors 0.2s"
            >
              {t('about.cta.contactUs', 'Contact Us')}
            </Button>
          </HStack>
        </Container>
      </Box>
    </Box>
  );
} 