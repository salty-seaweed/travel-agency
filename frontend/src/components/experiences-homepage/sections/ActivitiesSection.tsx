import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Container,
  Heading,
  Icon,
  useColorModeValue,
  SimpleGrid,
  Card,
  CardBody,
  Badge,
  Image,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import {
  MapPinIcon,
  ArrowRightIcon,
  GlobeAltIcon,
  CameraIcon,
  HeartIcon,
  SparklesIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import { useTranslation } from '../../../i18n';
import { useNavigate } from 'react-router-dom';
import { useFeaturedExperiences } from '../../../hooks/useQueries';
import { getWhatsAppUrl } from '../../../config';

interface ExperiencesActivitiesSectionProps {
  homepageContent?: any;
}

export const ExperiencesActivitiesSection: React.FC<ExperiencesActivitiesSectionProps> = ({
  homepageContent
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.300');

  const { data: experiences, isLoading } = useFeaturedExperiences();

  const handleViewAllExperiences = () => {
    navigate('/packages');
  };

  const handleExperienceClick = (experience: any) => {
    // Navigate to packages page with the selected experience pre-selected
    const params = new URLSearchParams();
    params.set('custom_builder', 'true');
    params.set('selected_experience', experience.id.toString());
    params.set('experience_name', experience.name);
    navigate(`/packages?${params.toString()}`);
  };

  const getExperienceIcon = (type: string) => {
    switch (type) {
      case 'water_sports': return GlobeAltIcon;
      case 'cultural': return CameraIcon;
      case 'adventure': return HeartIcon;
      case 'wellness': return SparklesIcon;
      case 'food': return CameraIcon;
      case 'photography': return CameraIcon;
      case 'fishing': return GlobeAltIcon;
      case 'diving': return GlobeAltIcon;
      case 'sailing': return GlobeAltIcon;
      case 'spa': return SparklesIcon;
      default: return SparklesIcon;
    }
  };

  const getExperienceColor = (type: string) => {
    switch (type) {
      case 'water_sports': return 'blue';
      case 'cultural': return 'purple';
      case 'adventure': return 'red';
      case 'wellness': return 'green';
      case 'food': return 'orange';
      case 'photography': return 'pink';
      case 'fishing': return 'teal';
      case 'diving': return 'cyan';
      case 'sailing': return 'blue';
      case 'spa': return 'purple';
      default: return 'gray';
    }
  };

  const displayExperiences = experiences && experiences.length > 0 ? experiences.slice(0, 6) : [
    { 
      id: 1, 
      name: 'Snorkeling Adventure', 
      description: 'Explore vibrant coral reefs and marine life in crystal clear waters',
      experience_type: 'water_sports',
      duration: '3 hours',
      price: '75',
      currency: 'USD',
      max_participants: 8,
      difficulty_level: 'easy'
    },
    { 
      id: 2, 
      name: 'Scuba Diving', 
      description: 'Discover underwater wonders with certified instructors',
      experience_type: 'diving',
      duration: '4 hours',
      price: '150',
      currency: 'USD',
      max_participants: 6,
      difficulty_level: 'moderate'
    },
    { 
      id: 3, 
      name: 'Island Hopping', 
      description: 'Visit multiple islands and experience different cultures',
      experience_type: 'cultural',
      duration: '8 hours',
      price: '120',
      currency: 'USD',
      max_participants: 12,
      difficulty_level: 'easy'
    },
    { 
      id: 4, 
      name: 'Water Sports', 
      description: 'Jet skiing, parasailing, and other thrilling water activities',
      experience_type: 'water_sports',
      duration: '2 hours',
      price: '95',
      currency: 'USD',
      max_participants: 4,
      difficulty_level: 'moderate'
    },
    { 
      id: 5, 
      name: 'Cultural Tours', 
      description: 'Experience local Maldivian culture and traditions',
      experience_type: 'cultural',
      duration: '5 hours',
      price: '60',
      currency: 'USD',
      max_participants: 15,
      difficulty_level: 'easy'
    },
    { 
      id: 6, 
      name: 'Adventure Activities', 
      description: 'Rock climbing, zip lining, and other thrilling adventures',
      experience_type: 'adventure',
      duration: '6 hours',
      price: '110',
      currency: 'USD',
      max_participants: 10,
      difficulty_level: 'challenging'
    },
  ];

  return (
    <Box bg={bgColor} py={16}>
      <Container maxW="7xl">
        <VStack spacing={12}>
          <VStack spacing={4}>
            <Badge colorScheme="purple" variant="solid" px={4} py={2} borderRadius="full" fontSize="sm" fontWeight="semibold">
              <Icon as={SparklesIcon} className="w-4 h-4 mr-2" />
              Custom Experiences
            </Badge>
            <Heading size="xl" fontWeight="bold">
              Build Your Custom Package
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              Choose from these experiences to build your own custom Maldives package. Mix and match activities to create your perfect trip.
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} w="full">
            {displayExperiences.map((experience: any) => {
              const IconComponent = getExperienceIcon(experience.experience_type);
              const colorScheme = getExperienceColor(experience.experience_type);
              
              return (
                <Card 
                  key={experience.id} 
                  bg={cardBg} 
                  border="1px solid" 
                  borderColor={borderColor} 
                  shadow="md"
                  borderRadius="xl"
                  overflow="hidden"
                  transition="all 0.3s" 
                  _hover={{ transform: 'translateY(-4px)', shadow: 'xl', borderColor: `${colorScheme}.300` }}
                  cursor="pointer"
                  onClick={() => handleExperienceClick(experience)}
                >
                  <Box position="relative" h="200px">
                    <Image
                      src={experience.image || `/src/assets/images/ishan${experience.id + 50}.jpg`}
                      alt={experience.name}
                      w="full"
                      h="full"
                      objectFit="cover"
                    />
                    <Box position="absolute" top={0} left={0} right={0} bottom={0} bg="blackAlpha.400" />
                    
                    {/* Experience Badge */}
                    <Badge 
                      position="absolute" 
                      top={4} 
                      left={4} 
                      colorScheme={colorScheme} 
                      variant="solid" 
                      px={3} 
                      py={1}
                    >
                      {experience.experience_type.replace('_', ' ')}
                    </Badge>

                    {/* Price */}
                    <VStack 
                      position="absolute" 
                      top={4} 
                      right={4} 
                      bg="whiteAlpha.900" 
                      px={3} 
                      py={2} 
                      borderRadius="lg"
                      spacing={0}
                    >
                      <Text fontSize="lg" fontWeight="bold" color={`${colorScheme}.600`}>
                        ${experience.price}
                      </Text>
                      <Text fontSize="xs" color="gray.500">per person</Text>
                    </VStack>

                    {/* Experience Info Overlay */}
                    <VStack 
                      position="absolute" 
                      bottom={0} 
                      left={0} 
                      right={0} 
                      p={4}
                      bg="linear-gradient(transparent, rgba(0,0,0,0.8))" 
                      spacing={2}
                    >
                      <Text color="white" fontWeight="bold" fontSize="lg" textAlign="center">
                        {experience.name}
                      </Text>
                      <HStack spacing={4} color="gray.200" fontSize="sm">
                        <HStack spacing={1}>
                          <Icon as={ClockIcon} className="w-4 h-4" />
                          <Text>{experience.duration}</Text>
                        </HStack>
                        <HStack spacing={1}>
                          <Icon as={UsersIcon} className="w-4 h-4" />
                          <Text>Up to {experience.max_participants}</Text>
                        </HStack>
                      </HStack>
                    </VStack>
                  </Box>

                  <CardBody p={6}>
                    <VStack spacing={4} align="stretch">
                      <Text fontSize="sm" color="gray.600" lineHeight="1.5">
                        {experience.description}
                      </Text>

                      {/* Difficulty Level */}
                      <HStack justify="space-between">
                        <Text fontSize="sm" color="gray.500">
                          Difficulty: <Badge colorScheme={colorScheme} variant="subtle" fontSize="xs">
                            {experience.difficulty_level}
                          </Badge>
                        </Text>
                        <Icon as={IconComponent} className={`w-5 h-5 text-${colorScheme}-500`} />
                      </HStack>

                      {/* Includes */}
                      {experience.includes && experience.includes.length > 0 && (
                        <VStack align="start" spacing={2}>
                          <Text fontSize="sm" fontWeight="semibold" color="gray.700">Includes:</Text>
                          <Wrap>
                            {experience.includes.slice(0, 3).map((item: string, index: number) => (
                              <WrapItem key={index}>
                                <Badge colorScheme="green" variant="subtle" fontSize="xs">
                                  {item}
                                </Badge>
                              </WrapItem>
                            ))}
                            {experience.includes.length > 3 && (
                              <WrapItem>
                                <Badge colorScheme="gray" variant="subtle" fontSize="xs">
                                  +{experience.includes.length - 3} more
                                </Badge>
                              </WrapItem>
                            )}
                          </Wrap>
                        </VStack>
                      )}
                    </VStack>
                  </CardBody>
                </Card>
              );
            })}
          </SimpleGrid>

          <VStack spacing={4}>
            <Button
              colorScheme="purple"
              size="lg"
              onClick={handleViewAllExperiences}
              rightIcon={<Icon as={ArrowRightIcon} />}
            >
              View All Custom Experiences
            </Button>
            <Text fontSize="sm" color="gray.500" textAlign="center">
              Click on any experience to get more details via WhatsApp
            </Text>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
};
