import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Badge,
  Button,
  SimpleGrid,
  Icon,
  Flex,
  Image,
} from '@chakra-ui/react';
import {
  MapPinIcon,
  StarIcon,
  EyeIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Atoll data with coordinates and information
const atollsData = [
  {
    id: 'haa-alifu',
    name: 'Haa Alifu Atoll',
    localName: 'Thiladhunmathi',
    lat: 6.95,
    lng: 72.95,
    islands: 16,
    resorts: 2,
    highlights: ['Utheemu Palace', 'Historical significance', 'Pristine beaches'],
    description: 'The northernmost administrative atoll, home to the historic Utheemu Palace where national hero Muhammad Thakurufaanu was born.',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&h=300&fit=crop',
    color: '#3B82F6',
    marineLife: ['Dolphins', 'Sea turtles', 'Reef sharks'],
    bestFor: ['History buffs', 'Cultural tourism'],
  },
  {
    id: 'haa-dhaalu',
    name: 'Haa Dhaalu Atoll',
    localName: 'Thiladhunmathi',
    lat: 6.60,
    lng: 72.95,
    islands: 16,
    resorts: 3,
    highlights: ['Kulhudhuffushi city', 'Local culture', 'Traditional fishing'],
    description: 'Features the northern regional capital Kulhudhuffushi and offers authentic local Maldivian experiences.',
    image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=400&h=300&fit=crop',
    color: '#8B5CF6',
    marineLife: ['Manta rays', 'Whale sharks', 'Coral gardens'],
    bestFor: ['Local culture', 'Diving'],
  },
  {
    id: 'shaviyani',
    name: 'Shaviyani Atoll',
    localName: 'Miladhunmadulu',
    lat: 6.20,
    lng: 73.10,
    islands: 15,
    resorts: 2,
    highlights: ['Remote beauty', 'Pristine reefs', 'Quiet getaways'],
    description: 'A quieter atoll known for its untouched natural beauty and excellent diving opportunities.',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
    color: '#EC4899',
    marineLife: ['Reef fish', 'Rays', 'Octopus'],
    bestFor: ['Secluded escapes', 'Snorkeling'],
  },
  {
    id: 'noonu',
    name: 'Noonu Atoll',
    localName: 'Miladhunmadulu',
    lat: 5.85,
    lng: 73.20,
    islands: 13,
    resorts: 4,
    highlights: ['Luxury resorts', 'Soneva Jani', 'Overwater villas'],
    description: 'Home to some of the most exclusive luxury resorts in the Maldives, including the famous Soneva Jani.',
    image: 'https://images.unsplash.com/photo-1439130490301-25e322d88054?w=400&h=300&fit=crop',
    color: '#F59E0B',
    marineLife: ['Dolphins', 'Manta rays', 'Tropical fish'],
    bestFor: ['Luxury seekers', 'Honeymoons'],
  },
  {
    id: 'raa',
    name: 'Raa Atoll',
    localName: 'Maalhosmadulu',
    lat: 5.60,
    lng: 72.95,
    islands: 15,
    resorts: 5,
    highlights: ['Beautiful lagoons', 'Traditional crafts', 'Unspoiled nature'],
    description: 'Known for its traditional lacquer work craftsmanship and stunning natural lagoons.',
    image: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=400&h=300&fit=crop',
    color: '#10B981',
    marineLife: ['Sea turtles', 'Reef sharks', 'Barracuda'],
    bestFor: ['Traditional crafts', 'Nature lovers'],
  },
  {
    id: 'baa',
    name: 'Baa Atoll',
    localName: 'Maalhosmadulu',
    lat: 5.25,
    lng: 72.98,
    islands: 13,
    resorts: 8,
    highlights: ['UNESCO Biosphere Reserve', 'Hanifaru Bay', 'Manta feeding'],
    description: 'A UNESCO World Biosphere Reserve famous for Hanifaru Bay, where hundreds of manta rays gather to feed.',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
    color: '#06B6D4',
    marineLife: ['Manta rays (200+)', 'Whale sharks', 'Diverse coral'],
    bestFor: ['Marine life enthusiasts', 'Photographers'],
  },
  {
    id: 'lhaviyani',
    name: 'Lhaviyani Atoll',
    localName: 'Faadhippolhu',
    lat: 5.40,
    lng: 73.50,
    islands: 5,
    resorts: 6,
    highlights: ['Kuredu Island', 'Underwater caves', 'Wreck diving'],
    description: 'Popular for its excellent dive sites including underwater caves and the famous Shipyard wreck.',
    image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=400&h=300&fit=crop',
    color: '#6366F1',
    marineLife: ['Nurse sharks', 'Eagle rays', 'Moray eels'],
    bestFor: ['Diving', 'Wreck exploration'],
  },
  {
    id: 'kaafu-north-male',
    name: 'North Malé Atoll',
    localName: 'Kaafu',
    lat: 4.45,
    lng: 73.50,
    islands: 50,
    resorts: 27,
    highlights: ['Capital Malé', 'Airport proximity', 'Most resorts'],
    description: 'The heart of the Maldives, home to the capital city Malé and the main international airport, with the highest concentration of resorts.',
    image: 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=400&h=300&fit=crop',
    color: '#EF4444',
    marineLife: ['Reef sharks', 'Sea turtles', 'Colorful reef fish'],
    bestFor: ['First-time visitors', 'City exploration'],
  },
  {
    id: 'kaafu-south-male',
    name: 'South Malé Atoll',
    localName: 'Kaafu',
    lat: 3.95,
    lng: 73.45,
    islands: 30,
    resorts: 17,
    highlights: ['Excellent diving', 'Surf breaks', 'Less crowded'],
    description: 'Offers excellent diving and surfing opportunities with generally fewer crowds than its northern neighbor.',
    image: 'https://images.unsplash.com/photo-1505881502353-a1986add3762?w=400&h=300&fit=crop',
    color: '#F97316',
    marineLife: ['Grey reef sharks', 'Stingrays', 'Napoleon wrasse'],
    bestFor: ['Surfing', 'Diving', 'Relaxation'],
  },
  {
    id: 'alifu-alifu',
    name: 'North Ari Atoll',
    localName: 'Alifu Alifu',
    lat: 4.10,
    lng: 72.85,
    islands: 18,
    resorts: 11,
    highlights: ['Hammerhead sharks', 'Fish Head dive site', 'Marine diversity'],
    description: 'Famous for the Fish Head dive site, one of the best places to see hammerhead sharks in the Maldives.',
    image: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=400&h=300&fit=crop',
    color: '#84CC16',
    marineLife: ['Hammerhead sharks', 'Grey reef sharks', 'Trevallies'],
    bestFor: ['Shark diving', 'Photography'],
  },
  {
    id: 'alifu-dhaalu',
    name: 'South Ari Atoll',
    localName: 'Alifu Dhaalu',
    lat: 3.55,
    lng: 72.85,
    islands: 19,
    resorts: 16,
    highlights: ['Whale shark capital', 'Year-round sightings', 'World-class diving'],
    description: 'The whale shark capital of the Maldives! This atoll offers the best year-round whale shark encounters.',
    image: 'https://images.unsplash.com/photo-1560275619-4662e36fa65c?w=400&h=300&fit=crop',
    color: '#0EA5E9',
    marineLife: ['Whale sharks (year-round)', 'Manta rays', 'Dolphins'],
    bestFor: ['Whale shark encounters', 'Marine photography'],
  },
  {
    id: 'vaavu',
    name: 'Vaavu Atoll',
    localName: 'Felidhu',
    lat: 3.40,
    lng: 73.45,
    islands: 5,
    resorts: 3,
    highlights: ['Fotteyo Kandu', 'Channel diving', 'Pristine conditions'],
    description: 'One of the least populated atolls, featuring the famous Fotteyo Kandu channel dive site.',
    image: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=400&h=300&fit=crop',
    color: '#A855F7',
    marineLife: ['Sharks', 'Rays', 'Pelagic fish'],
    bestFor: ['Advanced divers', 'Solitude seekers'],
  },
  {
    id: 'faafu',
    name: 'Faafu Atoll',
    localName: 'Nilandhe Atholhu Uthuruburi',
    lat: 3.15,
    lng: 72.95,
    islands: 5,
    resorts: 3,
    highlights: ['Remote location', 'Excellent reefs', 'Authentic experiences'],
    description: 'A small, remote atoll with excellent reef systems and authentic Maldivian island culture.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop',
    color: '#22C55E',
    marineLife: ['Reef fish', 'Sea turtles', 'Lobsters'],
    bestFor: ['Off-the-beaten-path', 'Reef snorkeling'],
  },
  {
    id: 'dhaalu',
    name: 'Dhaalu Atoll',
    localName: 'Nilandhe Atholhu Dhekunuburi',
    lat: 2.85,
    lng: 72.95,
    islands: 7,
    resorts: 4,
    highlights: ['Traditional jewelry making', 'Quiet resorts', 'Cultural heritage'],
    description: 'Known for traditional gold and silver jewelry craftsmanship and peaceful resort experiences.',
    image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=400&h=300&fit=crop',
    color: '#FACC15',
    marineLife: ['Reef sharks', 'Dolphins', 'Tropical fish'],
    bestFor: ['Cultural experiences', 'Peaceful getaways'],
  },
  {
    id: 'thaa',
    name: 'Thaa Atoll',
    localName: 'Kolhumadulu',
    lat: 2.35,
    lng: 73.10,
    islands: 13,
    resorts: 2,
    highlights: ['Archaeological sites', 'Buddhist ruins', 'Rich history'],
    description: 'Features important archaeological sites with ruins from the pre-Islamic Buddhist period.',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&h=300&fit=crop',
    color: '#F472B6',
    marineLife: ['Diverse reef life', 'Turtles', 'Rays'],
    bestFor: ['History enthusiasts', 'Archaeology'],
  },
  {
    id: 'laamu',
    name: 'Laamu Atoll',
    localName: 'Haddhunmathi',
    lat: 1.95,
    lng: 73.45,
    islands: 12,
    resorts: 2,
    highlights: ['Surfing', 'Six Senses', 'Yin Yang reef'],
    description: 'Home to world-class surf breaks and the stunning Six Senses Laamu resort with its famous Yin Yang reef.',
    image: 'https://images.unsplash.com/photo-1505881502353-a1986add3762?w=400&h=300&fit=crop',
    color: '#2DD4BF',
    marineLife: ['Reef sharks', 'Eagle rays', 'Trevally schools'],
    bestFor: ['Surfing', 'Eco-luxury'],
  },
  {
    id: 'gaafu-alifu',
    name: 'Gaafu Alifu Atoll',
    localName: 'Huvadhoo',
    lat: 0.65,
    lng: 73.15,
    islands: 10,
    resorts: 2,
    highlights: ['Huvadhoo Channel', 'Deep diving', 'Unique marine life'],
    description: 'Part of the massive Huvadhoo Atoll, featuring the deepest natural channel in the Maldives.',
    image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=400&h=300&fit=crop',
    color: '#7C3AED',
    marineLife: ['Hammerhead sharks', 'Manta rays', 'Oceanic species'],
    bestFor: ['Deep diving', 'Channel diving'],
  },
  {
    id: 'gaafu-dhaalu',
    name: 'Gaafu Dhaalu Atoll',
    localName: 'Huvadhoo',
    lat: 0.30,
    lng: 73.05,
    islands: 10,
    resorts: 2,
    highlights: ['Equator crossing', 'Large lagoon', 'Authentic culture'],
    description: 'One of the largest natural atolls in the world, straddling the equator with vast pristine lagoons.',
    image: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=400&h=300&fit=crop',
    color: '#E11D48',
    marineLife: ['Diverse pelagics', 'Reef sharks', 'Manta rays'],
    bestFor: ['Adventure seekers', 'Authentic experiences'],
  },
  {
    id: 'gnaviyani',
    name: 'Gnaviyani Atoll',
    localName: 'Fuvahmulah',
    lat: -0.30,
    lng: 73.42,
    islands: 1,
    resorts: 1,
    highlights: ['Single island atoll', 'Tiger sharks', 'Freshwater lakes'],
    description: 'A unique single-island atoll with freshwater lakes and famous for tiger shark diving.',
    image: 'https://images.unsplash.com/photo-1560275619-4662e36fa65c?w=400&h=300&fit=crop',
    color: '#DC2626',
    marineLife: ['Tiger sharks', 'Thresher sharks', 'Oceanic manta rays'],
    bestFor: ['Shark diving', 'Unique geography'],
  },
  {
    id: 'addu',
    name: 'Addu Atoll',
    localName: 'Seenu',
    lat: -0.63,
    lng: 73.15,
    islands: 6,
    resorts: 3,
    highlights: ['Southernmost atoll', 'WWII history', 'Unique culture'],
    description: 'The southernmost atoll with a distinct culture, British WWII history, and connected islands by causeway.',
    image: 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=400&h=300&fit=crop',
    color: '#059669',
    marineLife: ['Manta rays', 'Reef sharks', 'Diverse fish'],
    bestFor: ['History', 'Unique culture', 'Off-beat travel'],
  },
];

// Create custom atoll marker
const createAtollIcon = (color: string, isSelected: boolean) => {
  return L.divIcon({
    html: `
      <div class="atoll-marker ${isSelected ? 'selected' : ''}" style="--marker-color: ${color};">
        <div class="marker-inner">
          <div class="marker-pulse"></div>
          <div class="marker-dot"></div>
        </div>
      </div>
    `,
    className: 'custom-atoll-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

// Map controls component
function MapControls({ onResetView }: { onResetView: () => void }) {
  const map = useMap();

  const handleResetView = () => {
    map.setView([3.2028, 73.2207], 6);
    onResetView();
  };

  return (
    <Box position="absolute" top={4} right={4} zIndex={1000}>
      <Button
        onClick={handleResetView}
        size="sm"
        bg="white"
        boxShadow="lg"
        _hover={{ bg: 'gray.50' }}
      >
        Reset View
      </Button>
    </Box>
  );
}

export function MaldivesAtollMap() {
  const [selectedAtoll, setSelectedAtoll] = useState<typeof atollsData[0] | null>(null);

  return (
    <Box position="relative">
      {/* Map Container */}
      <Box
        borderRadius="2xl"
        overflow="hidden"
        boxShadow="2xl"
        border="4px solid"
        borderColor="blue.100"
      >
        <MapContainer
          center={[3.2028, 73.2207]}
          zoom={6}
          style={{ height: '600px', width: '100%' }}
          scrollWheelZoom={true}
        >
          {/* Beautiful ocean tile layer */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          
          {/* Atoll markers */}
          {atollsData.map((atoll) => (
            <React.Fragment key={atoll.id}>
              {/* Circle to show atoll area */}
              <Circle
                center={[atoll.lat, atoll.lng]}
                radius={25000}
                pathOptions={{
                  color: atoll.color,
                  fillColor: atoll.color,
                  fillOpacity: selectedAtoll?.id === atoll.id ? 0.3 : 0.1,
                  weight: selectedAtoll?.id === atoll.id ? 3 : 1,
                }}
                eventHandlers={{
                  click: () => setSelectedAtoll(atoll),
                }}
              />
              
              {/* Marker */}
              <Marker
                position={[atoll.lat, atoll.lng]}
                icon={createAtollIcon(atoll.color, selectedAtoll?.id === atoll.id)}
                eventHandlers={{
                  click: () => setSelectedAtoll(atoll),
                }}
              >
                <Popup>
                  <Box minW="200px" p={2}>
                    <Text fontWeight="bold" fontSize="lg" color="gray.800">
                      {atoll.name}
                    </Text>
                    <Text fontSize="sm" color="gray.500" mb={2}>
                      {atoll.localName}
                    </Text>
                    <HStack spacing={2} mb={2}>
                      <Badge colorScheme="blue" size="sm">
                        {atoll.islands} islands
                      </Badge>
                      <Badge colorScheme="green" size="sm">
                        {atoll.resorts} resorts
                      </Badge>
                    </HStack>
                    <Button
                      size="sm"
                      colorScheme="blue"
                      w="full"
                      onClick={() => setSelectedAtoll(atoll)}
                    >
                      <Icon as={EyeIcon} mr={2} w={4} h={4} />
                      View Details
                    </Button>
                  </Box>
                </Popup>
              </Marker>
            </React.Fragment>
          ))}
          
          <MapControls onResetView={() => setSelectedAtoll(null)} />
        </MapContainer>
      </Box>

      {/* Atoll List Panel (Mobile & below map) */}
      <Box mt={6}>
        <Heading as="h3" size="md" mb={4} color="gray.700">
          All 26 Atolls at a Glance
        </Heading>
        <SimpleGrid columns={{ base: 2, md: 4, lg: 5 }} spacing={3}>
          {atollsData.map((atoll) => (
            <Box
              key={atoll.id}
              bg="white"
              p={3}
              borderRadius="lg"
              border="2px solid"
              borderColor={selectedAtoll?.id === atoll.id ? atoll.color : 'gray.100'}
              cursor="pointer"
              onClick={() => setSelectedAtoll(atoll)}
              _hover={{
                borderColor: atoll.color,
                transform: 'translateY(-2px)',
                boxShadow: 'md',
              }}
              transition="all 0.2s"
            >
              <HStack spacing={2}>
                <Box
                  w={3}
                  h={3}
                  borderRadius="full"
                  bg={atoll.color}
                  flexShrink={0}
                />
                <Text fontSize="sm" fontWeight="medium" color="gray.700" noOfLines={1}>
                  {atoll.name.replace(' Atoll', '')}
                </Text>
              </HStack>
              <HStack mt={1} spacing={1}>
                <Badge size="xs" colorScheme="gray" fontSize="xs">
                  {atoll.resorts}R
                </Badge>
              </HStack>
            </Box>
          ))}
        </SimpleGrid>
      </Box>

      {/* Selected Atoll Detail Panel */}
      {selectedAtoll && (
        <Box
          position="fixed"
          bottom={{ base: 0, md: 'auto' }}
          top={{ base: 'auto', md: '50%' }}
          right={{ base: 0, md: 4 }}
          left={{ base: 0, md: 'auto' }}
          transform={{ base: 'none', md: 'translateY(-50%)' }}
          w={{ base: 'full', md: '400px' }}
          maxH={{ base: '70vh', md: '80vh' }}
          bg="white"
          borderRadius={{ base: '2xl 2xl 0 0', md: '2xl' }}
          boxShadow="2xl"
          zIndex={1100}
          overflow="hidden"
        >
          {/* Header with image */}
          <Box position="relative" h="180px">
            <Image
              src={selectedAtoll.image}
              alt={selectedAtoll.name}
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
              bgGradient="linear(to-t, blackAlpha.700, transparent)"
            />
            <Button
              position="absolute"
              top={3}
              right={3}
              size="sm"
              variant="ghost"
              color="white"
              onClick={() => setSelectedAtoll(null)}
              _hover={{ bg: 'whiteAlpha.300' }}
            >
              <Icon as={XMarkIcon} w={6} h={6} />
            </Button>
            <VStack
              position="absolute"
              bottom={4}
              left={4}
              align="start"
              spacing={1}
            >
              <Badge
                bg={selectedAtoll.color}
                color="white"
                px={2}
                py={1}
                borderRadius="md"
              >
                {selectedAtoll.localName}
              </Badge>
              <Heading as="h3" size="lg" color="white" textShadow="0 2px 4px rgba(0,0,0,0.3)">
                {selectedAtoll.name}
              </Heading>
            </VStack>
          </Box>
          
          {/* Content */}
          <Box p={5} overflowY="auto" maxH={{ base: 'calc(70vh - 180px)', md: 'calc(80vh - 180px)' }}>
            <VStack align="start" spacing={4}>
              {/* Stats */}
              <HStack spacing={4} w="full">
                <Box flex={1} bg="blue.50" p={3} borderRadius="lg" textAlign="center">
                  <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                    {selectedAtoll.islands}
                  </Text>
                  <Text fontSize="xs" color="gray.600">Islands</Text>
                </Box>
                <Box flex={1} bg="green.50" p={3} borderRadius="lg" textAlign="center">
                  <Text fontSize="2xl" fontWeight="bold" color="green.600">
                    {selectedAtoll.resorts}
                  </Text>
                  <Text fontSize="xs" color="gray.600">Resorts</Text>
                </Box>
              </HStack>
              
              {/* Description */}
              <Text color="gray.600" fontSize="sm" lineHeight="1.6">
                {selectedAtoll.description}
              </Text>
              
              {/* Highlights */}
              <Box w="full">
                <Text fontWeight="bold" color="gray.700" mb={2} fontSize="sm">
                  ✨ Highlights
                </Text>
                <Flex flexWrap="wrap" gap={2}>
                  {selectedAtoll.highlights.map((highlight, index) => (
                    <Badge key={index} colorScheme="purple" variant="subtle">
                      {highlight}
                    </Badge>
                  ))}
                </Flex>
              </Box>
              
              {/* Marine Life */}
              <Box w="full">
                <Text fontWeight="bold" color="gray.700" mb={2} fontSize="sm">
                  🐠 Marine Life
                </Text>
                <Flex flexWrap="wrap" gap={2}>
                  {selectedAtoll.marineLife.map((creature, index) => (
                    <Badge key={index} colorScheme="cyan" variant="subtle">
                      {creature}
                    </Badge>
                  ))}
                </Flex>
              </Box>
              
              {/* Best For */}
              <Box w="full">
                <Text fontWeight="bold" color="gray.700" mb={2} fontSize="sm">
                  🎯 Best For
                </Text>
                <Flex flexWrap="wrap" gap={2}>
                  {selectedAtoll.bestFor.map((item, index) => (
                    <Badge key={index} colorScheme="orange" variant="subtle">
                      {item}
                    </Badge>
                  ))}
                </Flex>
              </Box>
              
              {/* CTA */}
              <Button
                as="a"
                href={`/packages?atoll=${selectedAtoll.name}`}
                w="full"
                colorScheme="blue"
                size="lg"
                mt={2}
              >
                <Icon as={StarIcon} mr={2} w={5} h={5} />
                Explore Packages
              </Button>
            </VStack>
          </Box>
        </Box>
      )}

      {/* Overlay when detail panel is open on mobile */}
      {selectedAtoll && (
        <Box
          display={{ base: 'block', md: 'none' }}
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom="70vh"
          bg="blackAlpha.500"
          zIndex={1050}
          onClick={() => setSelectedAtoll(null)}
        />
      )}

      {/* Custom marker styles */}
      <style>{`
        .custom-atoll-marker {
          background: transparent;
          border: none;
        }
        
        .atoll-marker {
          width: 24px;
          height: 24px;
          position: relative;
        }
        
        .marker-inner {
          width: 100%;
          height: 100%;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .marker-dot {
          width: 12px;
          height: 12px;
          background: var(--marker-color);
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          z-index: 2;
        }
        
        .marker-pulse {
          position: absolute;
          width: 24px;
          height: 24px;
          background: var(--marker-color);
          border-radius: 50%;
          opacity: 0.3;
          animation: pulse 2s ease-out infinite;
        }
        
        .atoll-marker.selected .marker-dot {
          width: 16px;
          height: 16px;
          border-width: 3px;
        }
        
        .atoll-marker.selected .marker-pulse {
          animation: pulse 1s ease-out infinite;
        }
        
        @keyframes pulse {
          0% {
            transform: scale(0.5);
            opacity: 0.5;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        .leaflet-popup-content-wrapper {
          border-radius: 12px !important;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15) !important;
        }
        
        .leaflet-popup-content {
          margin: 8px !important;
        }
        
        .leaflet-popup-tip {
          background: white !important;
        }
      `}</style>
    </Box>
  );
}

export default MaldivesAtollMap;

