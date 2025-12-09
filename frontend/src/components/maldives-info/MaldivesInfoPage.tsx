import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  Image,
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Divider,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import {
  GlobeAltIcon,
  MapPinIcon,
  SunIcon,
  CloudIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  HeartIcon,
  SparklesIcon,
  InformationCircleIcon,
  BookOpenIcon,
  MusicalNoteIcon,
  BuildingLibraryIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  PhoneIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { MaldivesAtollMap } from './MaldivesAtollMap';

// Image URLs from Unsplash and Pexels (royalty-free)
const IMAGES = {
  hero: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1920&h=1080&fit=crop',
  overwater: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&h=600&fit=crop',
  underwater: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
  beach: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
  culture: 'https://images.unsplash.com/photo-1602002418816-5c0aeef426aa?w=800&h=600&fit=crop',
  food: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&h=600&fit=crop',
  sunset: 'https://images.unsplash.com/photo-1505881502353-a1986add3762?w=800&h=600&fit=crop',
  diving: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=800&h=600&fit=crop',
  manta: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
  turtle: 'https://images.unsplash.com/photo-1518467166778-b88f373ffec7?w=800&h=600&fit=crop',
  coral: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=800&h=600&fit=crop',
  dhoni: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=800&h=600&fit=crop',
  mosque: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
  seaplane: 'https://images.unsplash.com/photo-1540202404-d0c7fe46a087?w=800&h=600&fit=crop',
  bioluminescence: 'https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=800&h=600&fit=crop',
  sandbank: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800&h=600&fit=crop',
  resort: 'https://images.unsplash.com/photo-1439130490301-25e322d88054?w=800&h=600&fit=crop',
  male: 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=800&h=600&fit=crop',
  whaleShark: 'https://images.unsplash.com/photo-1560275619-4662e36fa65c?w=800&h=600&fit=crop',
  dolphins: 'https://images.unsplash.com/photo-1564731071754-001b53a902fb?w=800&h=600&fit=crop',
};

// Timeline data for history section
const historyTimeline = [
  { year: '5th Century BCE', event: 'First settlers from Sri Lanka and India (Buddhist era)', icon: '🏛️' },
  { year: '1153 CE', event: 'Conversion to Islam under King Dhovemi', icon: '🕌' },
  { year: '1558-1573', event: 'Portuguese occupation & liberation by Muhammad Thakurufaanu', icon: '⚔️' },
  { year: '1887-1965', event: 'British protectorate period', icon: '🇬🇧' },
  { year: '1965', event: 'Full independence from Britain', icon: '🎉' },
  { year: '1968', event: 'Became a Republic', icon: '🏴' },
  { year: '1972', event: 'First tourist resort opened (Kurumba)', icon: '🏖️' },
  { year: '2008', event: 'First democratic elections', icon: '🗳️' },
];

// Cuisine data
const cuisineData = [
  { name: 'Garudhiya', description: 'Traditional tuna broth soup, served with rice, lime, chili, and onions', icon: '🍲' },
  { name: 'Mas Huni', description: 'Shredded smoked tuna with coconut, onion, and chili – classic breakfast', icon: '🥥' },
  { name: 'Rihaakuru', description: 'Thick fish paste, a staple condiment in Maldivian cooking', icon: '🐟' },
  { name: 'Bis Keemiya', description: 'Maldivian samosa with spicy fish filling', icon: '🥟' },
  { name: 'Kulhi Boakibaa', description: 'Spicy fish cake made with tuna and grated coconut', icon: '🍰' },
  { name: 'Saagu Bondibai', description: 'Sweet sago pudding dessert with coconut milk', icon: '🍮' },
  { name: 'Roshi', description: 'Flatbread, often paired with curries and fish dishes', icon: '🫓' },
  { name: 'Huni Roshi', description: 'Coconut flatbread, a breakfast staple', icon: '🥞' },
];

// Marine life data
const marineLife = [
  { name: 'Whale Sharks', location: 'South Ari Atoll', season: 'Year-round', image: IMAGES.whaleShark, icon: '🦈' },
  { name: 'Manta Rays', location: 'Hanifaru Bay, Baa Atoll', season: 'May - November', image: IMAGES.manta, icon: '🦋' },
  { name: 'Sea Turtles', location: 'Throughout Maldives', season: 'Year-round', image: IMAGES.turtle, icon: '🐢' },
  { name: 'Dolphins', location: 'All atolls', season: 'Year-round', image: IMAGES.dolphins, icon: '🐬' },
  { name: 'Coral Gardens', location: 'Protected reefs', season: 'Year-round', image: IMAGES.coral, icon: '🪸' },
];

// Quick facts
const quickFacts = [
  { label: 'Climate', value: '28-32°C year-round', icon: SunIcon, color: 'orange' },
  { label: 'Time Zone', value: 'GMT+5', icon: ClockIcon, color: 'blue' },
  { label: 'Currency', value: 'Maldivian Rufiyaa (MVR)', icon: CurrencyDollarIcon, color: 'green' },
  { label: 'Language', value: 'Dhivehi', icon: BookOpenIcon, color: 'purple' },
  { label: 'Religion', value: '100% Muslim', icon: BuildingLibraryIcon, color: 'teal' },
  { label: 'Capital', value: 'Malé', icon: MapPinIcon, color: 'red' },
  { label: 'Islands', value: '1,200 coral islands', icon: GlobeAltIcon, color: 'cyan' },
  { label: 'Atolls', value: '26 natural atolls', icon: SparklesIcon, color: 'pink' },
];

// Etiquette tips
const etiquetteTips = {
  localIslands: [
    { do: true, tip: 'Dress modestly (cover shoulders and knees)' },
    { do: true, tip: 'Use designated "bikini beaches" for swimwear' },
    { do: true, tip: 'Respect prayer times' },
    { do: true, tip: 'Ask permission before photographing locals' },
    { do: false, tip: 'Consume alcohol (prohibited on local islands)' },
    { do: false, tip: 'Bring pork products' },
    { do: false, tip: 'Public displays of affection' },
  ],
  resortIslands: [
    { do: true, tip: 'More relaxed dress code' },
    { do: true, tip: 'Alcohol available at resort bars' },
    { do: true, tip: 'Enjoy standard resort amenities' },
    { do: true, tip: 'Spa treatments and wellness activities' },
  ],
  environmental: [
    { do: true, tip: 'Use reef-safe sunscreen' },
    { do: true, tip: 'Support marine conservation' },
    { do: true, tip: 'Dispose of waste properly' },
    { do: false, tip: 'Touch or stand on corals' },
    { do: false, tip: 'Take shells, sand, or coral' },
    { do: false, tip: 'Feed or chase marine life' },
  ],
};

// Unique experiences
const uniqueExperiences = [
  {
    title: 'Overwater Villas',
    description: 'Glass floor panels to watch marine life from your room',
    image: IMAGES.overwater,
    icon: '🏠',
  },
  {
    title: 'Underwater Dining',
    description: 'Dine 5 meters below the ocean surface at world-famous restaurants',
    image: IMAGES.underwater,
    icon: '🍽️',
  },
  {
    title: 'Sandbank Picnics',
    description: 'Private dining experience on a tiny pristine sand island',
    image: IMAGES.sandbank,
    icon: '🏝️',
  },
  {
    title: 'Sunset Dolphin Cruises',
    description: 'Watch spinner dolphins in their natural habitat',
    image: IMAGES.sunset,
    icon: '🐬',
  },
  {
    title: 'Bioluminescent Beaches',
    description: 'Experience the magical "Sea of Stars" phenomenon',
    image: IMAGES.bioluminescence,
    icon: '✨',
  },
  {
    title: 'Seaplane Transfers',
    description: 'Scenic aerial views of the stunning atolls',
    image: IMAGES.seaplane,
    icon: '✈️',
  },
];

export function MaldivesInfoPage() {
  const [activeSection, setActiveSection] = useState('overview');

  return (
    <Box bg="gray.50" minH="100vh">
      {/* Hero Section */}
      <Box position="relative" h={{ base: '70vh', md: '85vh' }} overflow="hidden">
        <Image
          src={IMAGES.hero}
          alt="Maldives Paradise"
          w="full"
          h="full"
          objectFit="cover"
        />
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bgGradient="linear(to-b, blackAlpha.400, blackAlpha.700)"
        />
        
        {/* Animated decorative elements */}
        <Box position="absolute" top="10%" left="5%" opacity={0.3} className="animate-float">
          <Text fontSize="6xl">🌊</Text>
        </Box>
        <Box position="absolute" top="20%" right="10%" opacity={0.3} className="animate-float-delayed">
          <Text fontSize="5xl">🐠</Text>
        </Box>
        <Box position="absolute" bottom="30%" left="8%" opacity={0.3} className="animate-float-slow">
          <Text fontSize="4xl">🐚</Text>
        </Box>
        
        <Container
          maxW="7xl"
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          textAlign="center"
          px={4}
        >
          <VStack spacing={6}>
            <Badge
              px={6}
              py={2}
              bg="whiteAlpha.200"
              backdropFilter="blur(10px)"
              borderRadius="full"
              border="1px solid"
              borderColor="whiteAlpha.300"
              color="white"
              fontSize="sm"
              fontWeight="bold"
              textTransform="uppercase"
              letterSpacing="wider"
            >
              <HStack spacing={2}>
                <Icon as={GlobeAltIcon} w={4} h={4} />
                <Text>Discover Paradise</Text>
              </HStack>
            </Badge>
            
            <Heading
              as="h1"
              fontSize={{ base: '4xl', md: '6xl', lg: '7xl' }}
              fontWeight="800"
              color="white"
              textShadow="0 4px 20px rgba(0,0,0,0.3)"
              lineHeight="1.1"
              fontFamily="'Playfair Display', serif"
            >
              The Maldives
            </Heading>
            
            <Text
              fontSize={{ base: 'lg', md: 'xl', lg: '2xl' }}
              color="whiteAlpha.900"
              maxW="3xl"
              lineHeight="1.6"
              fontWeight="400"
            >
              1,200 coral islands across 26 atolls in the Indian Ocean – 
              where turquoise waters meet pristine white beaches and vibrant marine life
            </Text>
            
            <HStack spacing={4} flexWrap="wrap" justify="center" pt={4}>
              <Button
                as={Link}
                to="/packages"
                size="lg"
                bg="white"
                color="blue.600"
                px={8}
                py={6}
                borderRadius="full"
                fontWeight="bold"
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                }}
                transition="all 0.3s"
              >
                Explore Packages
                <Icon as={ArrowRightIcon} ml={2} w={5} h={5} />
              </Button>
              <Button
                size="lg"
                variant="outline"
                color="white"
                borderColor="white"
                borderWidth={2}
                px={8}
                py={6}
                borderRadius="full"
                fontWeight="bold"
                _hover={{
                  bg: 'whiteAlpha.200',
                  transform: 'translateY(-2px)',
                }}
                transition="all 0.3s"
                onClick={() => {
                  const mapSection = document.getElementById('interactive-map');
                  mapSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Icon as={MapPinIcon} mr={2} w={5} h={5} />
                Explore Map
              </Button>
            </HStack>
          </VStack>
        </Container>
        
        {/* Scroll indicator */}
        <Box
          position="absolute"
          bottom={8}
          left="50%"
          transform="translateX(-50%)"
          className="animate-bounce"
        >
          <VStack spacing={2}>
            <Text color="white" fontSize="sm" fontWeight="medium">Scroll to explore</Text>
            <Box w={6} h={10} border="2px solid white" borderRadius="full" p={1}>
              <Box
                w={2}
                h={2}
                bg="white"
                borderRadius="full"
                className="animate-scroll-indicator"
              />
            </Box>
          </VStack>
        </Box>
      </Box>

      {/* Quick Facts Strip */}
      <Box bg="white" py={6} boxShadow="md" position="relative" zIndex={10}>
        <Container maxW="7xl">
          <SimpleGrid columns={{ base: 2, md: 4, lg: 8 }} spacing={4}>
            {quickFacts.map((fact, index) => (
              <VStack key={index} spacing={1} textAlign="center">
                <Icon as={fact.icon} w={6} h={6} color={`${fact.color}.500`} />
                <Text fontSize="xs" color="gray.500" fontWeight="medium" textTransform="uppercase">
                  {fact.label}
                </Text>
                <Text fontSize="sm" fontWeight="bold" color="gray.800">
                  {fact.value}
                </Text>
              </VStack>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Interactive Atoll Map Section */}
      <Box id="interactive-map" py={16} bg="gray.100">
        <Container maxW="7xl" px={4}>
          <VStack spacing={8} mb={10}>
            <Badge colorScheme="blue" px={4} py={2} borderRadius="full" fontSize="sm">
              <HStack spacing={2}>
                <Icon as={MapPinIcon} w={4} h={4} />
                <Text>Interactive Map</Text>
              </HStack>
            </Badge>
            <Heading
              as="h2"
              fontSize={{ base: '3xl', md: '4xl' }}
              textAlign="center"
              color="gray.800"
              fontFamily="'Playfair Display', serif"
            >
              Explore the 26 Atolls
            </Heading>
            <Text
              fontSize="lg"
              color="gray.600"
              textAlign="center"
              maxW="3xl"
            >
              Click on any atoll to discover its unique highlights, famous dive sites, 
              and the best experiences it has to offer
            </Text>
          </VStack>
          
          <MaldivesAtollMap />
        </Container>
      </Box>

      {/* Geography & Overview Section */}
      <Box py={20} bg="white">
        <Container maxW="7xl" px={4}>
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={12} alignItems="center">
            <VStack align="start" spacing={6}>
              <Badge colorScheme="teal" px={4} py={2} borderRadius="full">
                <HStack spacing={2}>
                  <Icon as={GlobeAltIcon} w={4} h={4} />
                  <Text>Geography & Overview</Text>
                </HStack>
              </Badge>
              
              <Heading
                as="h2"
                fontSize={{ base: '3xl', md: '4xl' }}
                color="gray.800"
                fontFamily="'Playfair Display', serif"
              >
                A Nation of Islands
              </Heading>
              
              <Text fontSize="lg" color="gray.600" lineHeight="1.8">
                The Maldives is the world's lowest-lying country, with an average ground level 
                of only 1.5 meters above sea level. This stunning archipelago stretches 
                approximately 871 kilometers from north to south and 130 kilometers from east 
                to west in the Indian Ocean.
              </Text>
              
              <Text fontSize="lg" color="gray.600" lineHeight="1.8">
                Of the approximately 1,200 coral islands, only about 200 are inhabited. 
                The remaining islands are used for tourism (over 160 resort islands), 
                agriculture, or remain uninhabited pristine paradises.
              </Text>
              
              <SimpleGrid columns={2} spacing={4} w="full" pt={4}>
                <Box bg="blue.50" p={4} borderRadius="xl">
                  <Text fontSize="3xl" fontWeight="bold" color="blue.600">1,200</Text>
                  <Text color="gray.600">Coral Islands</Text>
                </Box>
                <Box bg="teal.50" p={4} borderRadius="xl">
                  <Text fontSize="3xl" fontWeight="bold" color="teal.600">26</Text>
                  <Text color="gray.600">Natural Atolls</Text>
                </Box>
                <Box bg="cyan.50" p={4} borderRadius="xl">
                  <Text fontSize="3xl" fontWeight="bold" color="cyan.600">99%</Text>
                  <Text color="gray.600">Ocean Territory</Text>
                </Box>
                <Box bg="purple.50" p={4} borderRadius="xl">
                  <Text fontSize="3xl" fontWeight="bold" color="purple.600">500K+</Text>
                  <Text color="gray.600">Population</Text>
                </Box>
              </SimpleGrid>
            </VStack>
            
            <Box position="relative">
              <Image
                src={IMAGES.beach}
                alt="Maldives Beach"
                borderRadius="2xl"
                boxShadow="2xl"
              />
              <Box
                position="absolute"
                bottom={-6}
                right={-6}
                bg="white"
                p={4}
                borderRadius="xl"
                boxShadow="xl"
                display={{ base: 'none', md: 'block' }}
              >
                <HStack spacing={3}>
                  <Text fontSize="3xl">🌴</Text>
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="bold" color="gray.800">UNESCO Biosphere</Text>
                    <Text fontSize="sm" color="gray.500">Baa Atoll Reserve</Text>
                  </VStack>
                </HStack>
              </Box>
            </Box>
          </SimpleGrid>
        </Container>
      </Box>

      {/* History & Heritage Section */}
      <Box py={20} bg="gradient-to-br from-slate-900 to-slate-800" className="bg-gradient-to-br from-slate-900 to-slate-800">
        <Container maxW="7xl" px={4}>
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center">
              <Badge
                px={4}
                py={2}
                bg="whiteAlpha.200"
                color="white"
                borderRadius="full"
              >
                <HStack spacing={2}>
                  <Icon as={BuildingLibraryIcon} w={4} h={4} />
                  <Text>History & Heritage</Text>
                </HStack>
              </Badge>
              
              <Heading
                as="h2"
                fontSize={{ base: '3xl', md: '4xl' }}
                color="white"
                fontFamily="'Playfair Display', serif"
              >
                A Rich Historical Tapestry
              </Heading>
              
              <Text fontSize="lg" color="whiteAlpha.800" maxW="3xl">
                From ancient Buddhist kingdoms to Islamic sultanates, the Maldives 
                has a fascinating history spanning over 2,500 years
              </Text>
            </VStack>
            
            {/* Timeline */}
            <Box w="full" position="relative">
              <Box
                position="absolute"
                left="50%"
                top={0}
                bottom={0}
                w="2px"
                bg="whiteAlpha.300"
                display={{ base: 'none', md: 'block' }}
              />
              
              <VStack spacing={8}>
                {historyTimeline.map((item, index) => (
                  <Flex
                    key={index}
                    w="full"
                    justify={{ base: 'flex-start', md: index % 2 === 0 ? 'flex-start' : 'flex-end' }}
                    position="relative"
                  >
                    <Box
                      bg="whiteAlpha.100"
                      backdropFilter="blur(10px)"
                      p={6}
                      borderRadius="xl"
                      maxW={{ base: 'full', md: '45%' }}
                      border="1px solid"
                      borderColor="whiteAlpha.200"
                      _hover={{
                        bg: 'whiteAlpha.200',
                        transform: 'translateY(-2px)',
                      }}
                      transition="all 0.3s"
                    >
                      <HStack spacing={4} mb={2}>
                        <Text fontSize="2xl">{item.icon}</Text>
                        <Badge colorScheme="blue" px={3} py={1}>
                          {item.year}
                        </Badge>
                      </HStack>
                      <Text color="white" fontSize="lg">
                        {item.event}
                      </Text>
                    </Box>
                    
                    {/* Timeline dot */}
                    <Box
                      position="absolute"
                      left="50%"
                      transform="translateX(-50%)"
                      w={4}
                      h={4}
                      bg="blue.400"
                      borderRadius="full"
                      border="4px solid"
                      borderColor="slate.800"
                      display={{ base: 'none', md: 'block' }}
                    />
                  </Flex>
                ))}
              </VStack>
            </Box>
            
            {/* Historical Sites */}
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} w="full" pt={8}>
              <Box
                bg="whiteAlpha.100"
                p={6}
                borderRadius="xl"
                border="1px solid"
                borderColor="whiteAlpha.200"
              >
                <Text fontSize="3xl" mb={4}>🕌</Text>
                <Heading as="h3" size="md" color="white" mb={2}>
                  Malé Friday Mosque
                </Heading>
                <Text color="whiteAlpha.700" fontSize="sm">
                  Built in 1658, the oldest and most ornate mosque in the Maldives, 
                  constructed from coral stone with intricate carvings
                </Text>
              </Box>
              
              <Box
                bg="whiteAlpha.100"
                p={6}
                borderRadius="xl"
                border="1px solid"
                borderColor="whiteAlpha.200"
              >
                <Text fontSize="3xl" mb={4}>☪️</Text>
                <Heading as="h3" size="md" color="white" mb={2}>
                  Islamic Centre
                </Heading>
                <Text color="whiteAlpha.700" fontSize="sm">
                  Opened in 1984, featuring the striking golden-domed Grand Friday Mosque 
                  that can accommodate 5,000 worshippers
                </Text>
              </Box>
              
              <Box
                bg="whiteAlpha.100"
                p={6}
                borderRadius="xl"
                border="1px solid"
                borderColor="whiteAlpha.200"
              >
                <Text fontSize="3xl" mb={4}>🏛️</Text>
                <Heading as="h3" size="md" color="white" mb={2}>
                  National Museum
                </Heading>
                <Text color="whiteAlpha.700" fontSize="sm">
                  Established in 1952, housing artifacts from both Buddhist and 
                  Islamic eras of Maldivian history
                </Text>
              </Box>
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Culture & Traditions Section */}
      <Box py={20} bg="white">
        <Container maxW="7xl" px={4}>
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center">
              <Badge colorScheme="purple" px={4} py={2} borderRadius="full">
                <HStack spacing={2}>
                  <Icon as={MusicalNoteIcon} w={4} h={4} />
                  <Text>Culture & Traditions</Text>
                </HStack>
              </Badge>
              
              <Heading
                as="h2"
                fontSize={{ base: '3xl', md: '4xl' }}
                color="gray.800"
                fontFamily="'Playfair Display', serif"
              >
                Living Heritage
              </Heading>
            </VStack>
            
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
              {/* Dhivehi Language */}
              <Box
                bg="gradient-to-br from-purple-50 to-pink-50"
                className="bg-gradient-to-br from-purple-50 to-pink-50"
                p={8}
                borderRadius="2xl"
                border="1px solid"
                borderColor="purple.100"
              >
                <Text fontSize="4xl" mb={4}>📜</Text>
                <Heading as="h3" size="lg" color="gray.800" mb={3}>
                  Dhivehi Language
                </Heading>
                <Text color="gray.600" mb={4}>
                  The official language with a unique Thaana script, written right-to-left, 
                  developed from Arabic numerals in the 16th century.
                </Text>
                <VStack align="start" spacing={2}>
                  <HStack>
                    <Text fontWeight="bold" color="purple.600">Hello:</Text>
                    <Text>Assalaamu Alaikum</Text>
                  </HStack>
                  <HStack>
                    <Text fontWeight="bold" color="purple.600">Thank you:</Text>
                    <Text>Shukuriyyaa</Text>
                  </HStack>
                  <HStack>
                    <Text fontWeight="bold" color="purple.600">Welcome:</Text>
                    <Text>Marhabaa</Text>
                  </HStack>
                </VStack>
              </Box>
              
              {/* Traditional Arts */}
              <Box
                bg="gradient-to-br from-amber-50 to-orange-50"
                className="bg-gradient-to-br from-amber-50 to-orange-50"
                p={8}
                borderRadius="2xl"
                border="1px solid"
                borderColor="amber.100"
              >
                <Text fontSize="4xl" mb={4}>🎨</Text>
                <Heading as="h3" size="lg" color="gray.800" mb={3}>
                  Traditional Arts & Crafts
                </Heading>
                <VStack align="start" spacing={3}>
                  <HStack spacing={3}>
                    <Text fontSize="xl">🪵</Text>
                    <Box>
                      <Text fontWeight="bold">Lacquer Work (Liyēlāje)</Text>
                      <Text fontSize="sm" color="gray.600">Colorful wooden ornaments</Text>
                    </Box>
                  </HStack>
                  <HStack spacing={3}>
                    <Text fontSize="xl">🧺</Text>
                    <Box>
                      <Text fontWeight="bold">Mat Weaving (Thundu Kunaa)</Text>
                      <Text fontSize="sm" color="gray.600">Intricate reed mats from Gaaf Dhaal</Text>
                    </Box>
                  </HStack>
                  <HStack spacing={3}>
                    <Text fontSize="xl">⛵</Text>
                    <Box>
                      <Text fontWeight="bold">Dhoni Building</Text>
                      <Text fontSize="sm" color="gray.600">Traditional boat craftsmanship</Text>
                    </Box>
                  </HStack>
                </VStack>
              </Box>
              
              {/* Music & Dance */}
              <Box
                bg="gradient-to-br from-cyan-50 to-blue-50"
                className="bg-gradient-to-br from-cyan-50 to-blue-50"
                p={8}
                borderRadius="2xl"
                border="1px solid"
                borderColor="cyan.100"
              >
                <Text fontSize="4xl" mb={4}>🥁</Text>
                <Heading as="h3" size="lg" color="gray.800" mb={3}>
                  Music & Dance
                </Heading>
                <VStack align="start" spacing={3}>
                  <HStack spacing={3}>
                    <Text fontSize="xl">🎵</Text>
                    <Box>
                      <Text fontWeight="bold">Bodu Beru</Text>
                      <Text fontSize="sm" color="gray.600">Rhythmic drumming with African, Arab & Indian influences</Text>
                    </Box>
                  </HStack>
                  <HStack spacing={3}>
                    <Text fontSize="xl">💃</Text>
                    <Box>
                      <Text fontWeight="bold">Bandiyaa Jehun</Text>
                      <Text fontSize="sm" color="gray.600">Women's dance with metal water pots</Text>
                    </Box>
                  </HStack>
                  <HStack spacing={3}>
                    <Text fontSize="xl">🎶</Text>
                    <Box>
                      <Text fontWeight="bold">Thaara</Text>
                      <Text fontSize="sm" color="gray.600">Arabic-influenced devotional music</Text>
                    </Box>
                  </HStack>
                </VStack>
              </Box>
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Cuisine Section */}
      <Box py={20} bg="gradient-to-br from-amber-50 to-orange-100" className="bg-gradient-to-br from-amber-50 to-orange-100">
        <Container maxW="7xl" px={4}>
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={12} alignItems="center">
            <Box>
              <Badge colorScheme="orange" px={4} py={2} borderRadius="full" mb={6}>
                <HStack spacing={2}>
                  <Text>🍽️</Text>
                  <Text>Maldivian Cuisine</Text>
                </HStack>
              </Badge>
              
              <Heading
                as="h2"
                fontSize={{ base: '3xl', md: '4xl' }}
                color="gray.800"
                fontFamily="'Playfair Display', serif"
                mb={6}
              >
                Flavors of the Islands
              </Heading>
              
              <Text fontSize="lg" color="gray.600" mb={6}>
                Maldivian cuisine is a delightful blend of influences from Sri Lanka, 
                India, and Arabia, centered around three key ingredients: 
                <Text as="span" fontWeight="bold"> tuna, coconut, and curry leaves</Text>.
              </Text>
              
              <SimpleGrid columns={1} spacing={4}>
                {cuisineData.map((dish, index) => (
                  <HStack
                    key={index}
                    bg="white"
                    p={4}
                    borderRadius="xl"
                    boxShadow="sm"
                    _hover={{
                      transform: 'translateX(4px)',
                      boxShadow: 'md',
                    }}
                    transition="all 0.3s"
                  >
                    <Text fontSize="2xl">{dish.icon}</Text>
                    <Box>
                      <Text fontWeight="bold" color="gray.800">{dish.name}</Text>
                      <Text fontSize="sm" color="gray.600">{dish.description}</Text>
                    </Box>
                  </HStack>
                ))}
              </SimpleGrid>
            </Box>
            
            <Box position="relative">
              <Image
                src={IMAGES.food}
                alt="Maldivian Cuisine"
                borderRadius="2xl"
                boxShadow="2xl"
              />
              <Box
                position="absolute"
                top={-4}
                right={-4}
                bg="white"
                px={4}
                py={2}
                borderRadius="full"
                boxShadow="lg"
              >
                <Text fontSize="sm" fontWeight="bold" color="orange.600">
                  🥥 Coconut in everything!
                </Text>
              </Box>
            </Box>
          </SimpleGrid>
        </Container>
      </Box>

      {/* Marine Life Section */}
      <Box py={20} bg="gradient-to-br from-blue-900 to-cyan-800" className="bg-gradient-to-br from-blue-900 to-cyan-800">
        <Container maxW="7xl" px={4}>
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center">
              <Badge
                px={4}
                py={2}
                bg="whiteAlpha.200"
                color="white"
                borderRadius="full"
              >
                <HStack spacing={2}>
                  <Text>🐠</Text>
                  <Text>Marine Life & Ocean Wonders</Text>
                </HStack>
              </Badge>
              
              <Heading
                as="h2"
                fontSize={{ base: '3xl', md: '4xl' }}
                color="white"
                fontFamily="'Playfair Display', serif"
              >
                Underwater Paradise
              </Heading>
              
              <Text fontSize="lg" color="whiteAlpha.800" maxW="3xl">
                Home to over 1,000 species of fish and 200 species of coral, 
                the Maldives offers some of the world's best diving and snorkeling experiences
              </Text>
            </VStack>
            
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} w="full">
              {marineLife.map((creature, index) => (
                <Box
                  key={index}
                  bg="whiteAlpha.100"
                  backdropFilter="blur(10px)"
                  borderRadius="2xl"
                  overflow="hidden"
                  border="1px solid"
                  borderColor="whiteAlpha.200"
                  _hover={{
                    transform: 'translateY(-4px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                  }}
                  transition="all 0.3s"
                >
                  <Image
                    src={creature.image}
                    alt={creature.name}
                    h="200px"
                    w="full"
                    objectFit="cover"
                  />
                  <Box p={6}>
                    <HStack mb={3}>
                      <Text fontSize="2xl">{creature.icon}</Text>
                      <Heading as="h3" size="md" color="white">
                        {creature.name}
                      </Heading>
                    </HStack>
                    <VStack align="start" spacing={2}>
                      <HStack>
                        <Icon as={MapPinIcon} w={4} h={4} color="cyan.300" />
                        <Text color="whiteAlpha.800" fontSize="sm">{creature.location}</Text>
                      </HStack>
                      <HStack>
                        <Icon as={CalendarIcon} w={4} h={4} color="cyan.300" />
                        <Text color="whiteAlpha.800" fontSize="sm">{creature.season}</Text>
                      </HStack>
                    </VStack>
                  </Box>
                </Box>
              ))}
            </SimpleGrid>
            
            {/* Bioluminescence highlight */}
            <Box
              bg="whiteAlpha.100"
              backdropFilter="blur(10px)"
              p={8}
              borderRadius="2xl"
              border="1px solid"
              borderColor="whiteAlpha.300"
              w="full"
            >
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} alignItems="center">
                <Box>
                  <Badge colorScheme="purple" mb={4}>✨ Natural Wonder</Badge>
                  <Heading as="h3" size="lg" color="white" mb={4}>
                    Sea of Stars
                  </Heading>
                  <Text color="whiteAlpha.800" fontSize="lg" mb={4}>
                    Experience the magical bioluminescence phenomenon on certain Maldivian beaches, 
                    where microscopic phytoplankton glow blue when disturbed, creating a 
                    mesmerizing "sea of stars" effect at night.
                  </Text>
                  <Text color="cyan.300" fontSize="sm">
                    Best seen: Vaadhoo Island, Reethi Beach, and select resort locations
                  </Text>
                </Box>
                <Image
                  src={IMAGES.bioluminescence}
                  alt="Bioluminescent Beach"
                  borderRadius="xl"
                  boxShadow="xl"
                />
              </SimpleGrid>
            </Box>
          </VStack>
        </Container>
      </Box>

      {/* Weather & Best Time Section */}
      <Box py={20} bg="white">
        <Container maxW="7xl" px={4}>
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center">
              <Badge colorScheme="yellow" px={4} py={2} borderRadius="full">
                <HStack spacing={2}>
                  <Icon as={SunIcon} w={4} h={4} />
                  <Text>Weather & Seasons</Text>
                </HStack>
              </Badge>
              
              <Heading
                as="h2"
                fontSize={{ base: '3xl', md: '4xl' }}
                color="gray.800"
                fontFamily="'Playfair Display', serif"
              >
                When to Visit
              </Heading>
            </VStack>
            
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} w="full">
              {/* Dry Season */}
              <Box
                bg="gradient-to-br from-yellow-50 to-orange-50"
                className="bg-gradient-to-br from-yellow-50 to-orange-50"
                p={8}
                borderRadius="2xl"
                border="2px solid"
                borderColor="yellow.200"
              >
                <HStack mb={4}>
                  <Icon as={SunIcon} w={8} h={8} color="yellow.500" />
                  <Heading as="h3" size="lg" color="gray.800">
                    Dry Season (Iruvai)
                  </Heading>
                </HStack>
                <Badge colorScheme="green" mb={4}>November - April</Badge>
                <VStack align="start" spacing={3}>
                  <HStack>
                    <Icon as={CheckCircleIcon} w={5} h={5} color="green.500" />
                    <Text>Best weather conditions</Text>
                  </HStack>
                  <HStack>
                    <Icon as={CheckCircleIcon} w={5} h={5} color="green.500" />
                    <Text>Minimal rainfall</Text>
                  </HStack>
                  <HStack>
                    <Icon as={CheckCircleIcon} w={5} h={5} color="green.500" />
                    <Text>Calm seas, excellent visibility</Text>
                  </HStack>
                  <HStack>
                    <Icon as={CheckCircleIcon} w={5} h={5} color="green.500" />
                    <Text>Peak tourist season</Text>
                  </HStack>
                </VStack>
                <Box mt={4} p={3} bg="yellow.100" borderRadius="lg">
                  <Text fontSize="sm" color="gray.700">
                    <Text as="span" fontWeight="bold">Temperature:</Text> 28-32°C | 
                    <Text as="span" fontWeight="bold"> Humidity:</Text> 75-80%
                  </Text>
                </Box>
              </Box>
              
              {/* Wet Season */}
              <Box
                bg="gradient-to-br from-blue-50 to-cyan-50"
                className="bg-gradient-to-br from-blue-50 to-cyan-50"
                p={8}
                borderRadius="2xl"
                border="2px solid"
                borderColor="blue.200"
              >
                <HStack mb={4}>
                  <Icon as={CloudIcon} w={8} h={8} color="blue.500" />
                  <Heading as="h3" size="lg" color="gray.800">
                    Wet Season (Hulhangu)
                  </Heading>
                </HStack>
                <Badge colorScheme="blue" mb={4}>May - October</Badge>
                <VStack align="start" spacing={3}>
                  <HStack>
                    <Icon as={CheckCircleIcon} w={5} h={5} color="blue.500" />
                    <Text>More rainfall, brief showers</Text>
                  </HStack>
                  <HStack>
                    <Icon as={CheckCircleIcon} w={5} h={5} color="blue.500" />
                    <Text>Better for surfing</Text>
                  </HStack>
                  <HStack>
                    <Icon as={CheckCircleIcon} w={5} h={5} color="blue.500" />
                    <Text>Manta ray season (May-Nov)</Text>
                  </HStack>
                  <HStack>
                    <Icon as={CheckCircleIcon} w={5} h={5} color="blue.500" />
                    <Text>Lower prices, fewer crowds</Text>
                  </HStack>
                </VStack>
                <Box mt={4} p={3} bg="blue.100" borderRadius="lg">
                  <Text fontSize="sm" color="gray.700">
                    <Text as="span" fontWeight="bold">Temperature:</Text> 27-31°C | 
                    <Text as="span" fontWeight="bold"> Best for:</Text> Budget travelers
                  </Text>
                </Box>
              </Box>
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Unique Experiences Section */}
      <Box py={20} bg="gray.50">
        <Container maxW="7xl" px={4}>
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center">
              <Badge colorScheme="pink" px={4} py={2} borderRadius="full">
                <HStack spacing={2}>
                  <Icon as={SparklesIcon} w={4} h={4} />
                  <Text>Unique Experiences</Text>
                </HStack>
              </Badge>
              
              <Heading
                as="h2"
                fontSize={{ base: '3xl', md: '4xl' }}
                color="gray.800"
                fontFamily="'Playfair Display', serif"
              >
                Once-in-a-Lifetime Moments
              </Heading>
            </VStack>
            
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {uniqueExperiences.map((exp, index) => (
                <Box
                  key={index}
                  bg="white"
                  borderRadius="2xl"
                  overflow="hidden"
                  boxShadow="lg"
                  _hover={{
                    transform: 'translateY(-8px)',
                    boxShadow: '2xl',
                  }}
                  transition="all 0.3s"
                >
                  <Box position="relative">
                    <Image
                      src={exp.image}
                      alt={exp.title}
                      h="200px"
                      w="full"
                      objectFit="cover"
                    />
                    <Box
                      position="absolute"
                      top={4}
                      left={4}
                      bg="white"
                      px={3}
                      py={1}
                      borderRadius="full"
                      boxShadow="md"
                    >
                      <Text fontSize="xl">{exp.icon}</Text>
                    </Box>
                  </Box>
                  <Box p={6}>
                    <Heading as="h3" size="md" color="gray.800" mb={2}>
                      {exp.title}
                    </Heading>
                    <Text color="gray.600">
                      {exp.description}
                    </Text>
                  </Box>
                </Box>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Travel Etiquette Section */}
      <Box py={20} bg="white">
        <Container maxW="7xl" px={4}>
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center">
              <Badge colorScheme="green" px={4} py={2} borderRadius="full">
                <HStack spacing={2}>
                  <Icon as={ShieldCheckIcon} w={4} h={4} />
                  <Text>Travel Tips & Etiquette</Text>
                </HStack>
              </Badge>
              
              <Heading
                as="h2"
                fontSize={{ base: '3xl', md: '4xl' }}
                color="gray.800"
                fontFamily="'Playfair Display', serif"
              >
                Know Before You Go
              </Heading>
            </VStack>
            
            <Tabs variant="soft-rounded" colorScheme="blue" w="full">
              <TabList justifyContent="center" mb={8} flexWrap="wrap">
                <Tab>🏝️ Local Islands</Tab>
                <Tab>🏨 Resort Islands</Tab>
                <Tab>🌊 Environmental</Tab>
              </TabList>
              
              <TabPanels>
                <TabPanel>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    {etiquetteTips.localIslands.map((tip, index) => (
                      <HStack
                        key={index}
                        bg={tip.do ? 'green.50' : 'red.50'}
                        p={4}
                        borderRadius="xl"
                        border="1px solid"
                        borderColor={tip.do ? 'green.200' : 'red.200'}
                      >
                        <Icon
                          as={tip.do ? CheckCircleIcon : ExclamationTriangleIcon}
                          w={6}
                          h={6}
                          color={tip.do ? 'green.500' : 'red.500'}
                        />
                        <Text color="gray.700">{tip.tip}</Text>
                      </HStack>
                    ))}
                  </SimpleGrid>
                </TabPanel>
                
                <TabPanel>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    {etiquetteTips.resortIslands.map((tip, index) => (
                      <HStack
                        key={index}
                        bg="green.50"
                        p={4}
                        borderRadius="xl"
                        border="1px solid"
                        borderColor="green.200"
                      >
                        <Icon as={CheckCircleIcon} w={6} h={6} color="green.500" />
                        <Text color="gray.700">{tip.tip}</Text>
                      </HStack>
                    ))}
                  </SimpleGrid>
                </TabPanel>
                
                <TabPanel>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    {etiquetteTips.environmental.map((tip, index) => (
                      <HStack
                        key={index}
                        bg={tip.do ? 'green.50' : 'red.50'}
                        p={4}
                        borderRadius="xl"
                        border="1px solid"
                        borderColor={tip.do ? 'green.200' : 'red.200'}
                      >
                        <Icon
                          as={tip.do ? CheckCircleIcon : ExclamationTriangleIcon}
                          w={6}
                          h={6}
                          color={tip.do ? 'green.500' : 'red.500'}
                        />
                        <Text color="gray.700">{tip.tip}</Text>
                      </HStack>
                    ))}
                  </SimpleGrid>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </VStack>
        </Container>
      </Box>

      {/* Practical Information Section */}
      <Box py={20} bg="gray.100">
        <Container maxW="7xl" px={4}>
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center">
              <Badge colorScheme="gray" px={4} py={2} borderRadius="full">
                <HStack spacing={2}>
                  <Icon as={InformationCircleIcon} w={4} h={4} />
                  <Text>Practical Information</Text>
                </HStack>
              </Badge>
              
              <Heading
                as="h2"
                fontSize={{ base: '3xl', md: '4xl' }}
                color="gray.800"
                fontFamily="'Playfair Display', serif"
              >
                Essential Travel Info
              </Heading>
            </VStack>
            
            <Accordion allowMultiple w="full">
              <AccordionItem bg="white" borderRadius="xl" mb={4} border="none" boxShadow="sm">
                <AccordionButton p={6} _hover={{ bg: 'gray.50' }} borderRadius="xl">
                  <HStack flex="1">
                    <Text fontSize="xl">✈️</Text>
                    <Text fontWeight="bold" fontSize="lg">Entry & Visa Requirements</Text>
                  </HStack>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={6} px={6}>
                  <VStack align="start" spacing={3}>
                    <Text>• Free 30-day visa on arrival for most nationalities</Text>
                    <Text>• Valid passport required (6+ months validity)</Text>
                    <Text>• Return/onward ticket required</Text>
                    <Text>• Proof of accommodation booking</Text>
                    <Text>• Yellow fever certificate if arriving from endemic areas</Text>
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
              
              <AccordionItem bg="white" borderRadius="xl" mb={4} border="none" boxShadow="sm">
                <AccordionButton p={6} _hover={{ bg: 'gray.50' }} borderRadius="xl">
                  <HStack flex="1">
                    <Text fontSize="xl">💰</Text>
                    <Text fontWeight="bold" fontSize="lg">Currency & Payments</Text>
                  </HStack>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={6} px={6}>
                  <VStack align="start" spacing={3}>
                    <Text>• Official currency: Maldivian Rufiyaa (MVR)</Text>
                    <Text>• Exchange rate: 1 USD ≈ 15.4 MVR</Text>
                    <Text>• USD widely accepted at resorts</Text>
                    <Text>• Major credit cards accepted</Text>
                    <Text>• ATMs available in Malé and larger islands</Text>
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
              
              <AccordionItem bg="white" borderRadius="xl" mb={4} border="none" boxShadow="sm">
                <AccordionButton p={6} _hover={{ bg: 'gray.50' }} borderRadius="xl">
                  <HStack flex="1">
                    <Text fontSize="xl">🚤</Text>
                    <Text fontWeight="bold" fontSize="lg">Getting Around</Text>
                  </HStack>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={6} px={6}>
                  <VStack align="start" spacing={3}>
                    <Text>• <strong>Seaplanes:</strong> Scenic transfers to remote resorts (15-60 min)</Text>
                    <Text>• <strong>Speedboats:</strong> Common for closer islands (20-90 min)</Text>
                    <Text>• <strong>Domestic flights:</strong> For southern atolls via Maldivian Airlines</Text>
                    <Text>• <strong>Public ferries:</strong> Budget-friendly local island hopping</Text>
                    <Text>• <strong>Dhonis:</strong> Traditional boats for short distances</Text>
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
              
              <AccordionItem bg="white" borderRadius="xl" mb={4} border="none" boxShadow="sm">
                <AccordionButton p={6} _hover={{ bg: 'gray.50' }} borderRadius="xl">
                  <HStack flex="1">
                    <Text fontSize="xl">🏥</Text>
                    <Text fontWeight="bold" fontSize="lg">Health & Safety</Text>
                  </HStack>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={6} px={6}>
                  <VStack align="start" spacing={3}>
                    <Text>• No mandatory vaccinations required</Text>
                    <Text>• Drink bottled water only</Text>
                    <Text>• Strong sun – use SPF 50+ sunscreen</Text>
                    <Text>• Travel insurance highly recommended</Text>
                    <Text>• Decompression chamber available for divers</Text>
                    <Text>• Emergency: Police 119, Ambulance 102</Text>
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
              
              <AccordionItem bg="white" borderRadius="xl" border="none" boxShadow="sm">
                <AccordionButton p={6} _hover={{ bg: 'gray.50' }} borderRadius="xl">
                  <HStack flex="1">
                    <Text fontSize="xl">⚡</Text>
                    <Text fontWeight="bold" fontSize="lg">Electricity & Connectivity</Text>
                  </HStack>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={6} px={6}>
                  <VStack align="start" spacing={3}>
                    <Text>• Voltage: 230V, 50Hz</Text>
                    <Text>• Plug type: UK-style 3-pin (Type G)</Text>
                    <Text>• Good WiFi at resorts and guesthouses</Text>
                    <Text>• Mobile coverage: Dhiraagu & Ooredoo</Text>
                    <Text>• Tourist SIM cards available at airport</Text>
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </VStack>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        py={20}
        bgGradient="linear(to-r, blue.600, cyan.500)"
        position="relative"
        overflow="hidden"
      >
        {/* Background decoration */}
        <Box position="absolute" top={0} left={0} right={0} bottom={0} opacity={0.1}>
          <Text fontSize="15rem" position="absolute" top="-5rem" left="-5rem">🌴</Text>
          <Text fontSize="10rem" position="absolute" bottom="-3rem" right="-3rem">🐠</Text>
        </Box>
        
        <Container maxW="4xl" position="relative" textAlign="center" px={4}>
          <VStack spacing={8}>
            <Heading
              as="h2"
              fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
              color="white"
              fontFamily="'Playfair Display', serif"
            >
              Ready to Experience Paradise?
            </Heading>
            
            <Text fontSize="xl" color="whiteAlpha.900" maxW="2xl">
              Let us help you create unforgettable memories in the Maldives. 
              Explore our curated packages or contact us for a personalized itinerary.
            </Text>
            
            <HStack spacing={4} flexWrap="wrap" justify="center">
              <Button
                as={Link}
                to="/packages"
                size="lg"
                bg="white"
                color="blue.600"
                px={10}
                py={7}
                borderRadius="full"
                fontWeight="bold"
                fontSize="lg"
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                }}
                transition="all 0.3s"
              >
                Browse Packages
                <Icon as={ArrowRightIcon} ml={2} w={5} h={5} />
              </Button>
              
              <Button
                as={Link}
                to="/contact"
                size="lg"
                variant="outline"
                color="white"
                borderColor="white"
                borderWidth={2}
                px={10}
                py={7}
                borderRadius="full"
                fontWeight="bold"
                fontSize="lg"
                _hover={{
                  bg: 'whiteAlpha.200',
                  transform: 'translateY(-2px)',
                }}
                transition="all 0.3s"
              >
                <Icon as={PhoneIcon} mr={2} w={5} h={5} />
                Contact Us
              </Button>
            </HStack>
          </VStack>
        </Container>
      </Box>

      {/* Custom animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes scroll-indicator {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(20px); opacity: 0; }
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 5s ease-in-out infinite 1s;
        }
        
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite 0.5s;
        }
        
        .animate-scroll-indicator {
          animation: scroll-indicator 2s ease-in-out infinite;
        }
        
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&display=swap');
      `}</style>
    </Box>
  );
}

export default MaldivesInfoPage;

