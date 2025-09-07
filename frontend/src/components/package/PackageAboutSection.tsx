import React from 'react';
import {
  Box,
  Text,
  Heading,
  VStack,
  HStack,
  Badge,
  Divider,
  Icon,
  useColorModeValue,
  SimpleGrid,
} from '@chakra-ui/react';
import { 
  UserGroupIcon, 
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

import type { Package } from '../../types';

interface PackageAboutSectionProps {
  packageData: Package;
}

export function PackageAboutSection({ packageData }: PackageAboutSectionProps) {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.700', 'gray.300');
  const headingColor = useColorModeValue('gray.800', 'gray.100');
  const badgeColor = useColorModeValue('purple.100', 'purple.800');
  const badgeTextColor = useColorModeValue('purple.800', 'purple.100');

  const getDifficultyColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'easy': return 'green';
      case 'moderate': return 'yellow';
      case 'challenging': return 'orange';
      case 'expert': return 'red';
      default: return 'gray';
    }
  };

  const getCategoryIcon = (category: string) => {
    if (!category) return '🎯';
    
    const cat = category.toLowerCase();
    if (cat.includes('adventure')) return '🏔️';
    if (cat.includes('honeymoon')) return '💕';
    if (cat.includes('family')) return '👨‍👩‍👧‍👦';
    if (cat.includes('luxury')) return '✨';
    if (cat.includes('budget')) return '💰';
    if (cat.includes('cultural')) return '🏛️';
    if (cat.includes('beach')) return '🏖️';
    if (cat.includes('mountain')) return '⛰️';
    if (cat.includes('fishing')) return '🎣';
    if (cat.includes('diving')) return '🤿';
    if (cat.includes('sailing')) return '⛵';
    if (cat.includes('wellness')) return '🧘';
    if (cat.includes('spa')) return '💆';
    if (cat.includes('food')) return '🍽️';
    if (cat.includes('photography')) return '📸';
    if (cat.includes('water')) return '🏊';
    return '🎯';
  };

  return (
    <Box 
      bg={bgColor} 
      borderRadius="2xl" 
      border="1px solid" 
      borderColor={borderColor}
      overflow="hidden"
      boxShadow="lg"
    >
      {/* Simple header */}
      <Box
        bg={useColorModeValue('gray.50', 'gray.700')}
        borderBottom="1px solid"
        borderColor={borderColor}
        p={6}
      >
        <VStack spacing={3} align="start">
          <HStack spacing={3} flexWrap="wrap">
            <Badge
              bg={useColorModeValue('blue.100', 'blue.800')}
              color={useColorModeValue('blue.800', 'blue.100')}
              px={3}
              py={1}
              borderRadius="full"
              fontSize="sm"
              fontWeight="semibold"
            >
              {getCategoryIcon(packageData.category)} {packageData.category || 'Travel'}
            </Badge>
            {packageData.difficulty_level && (
              <Badge
                colorScheme={getDifficultyColor(packageData.difficulty_level)}
                px={3}
                py={1}
                borderRadius="full"
                fontSize="sm"
                fontWeight="semibold"
              >
                {packageData.difficulty_level}
              </Badge>
            )}
          </HStack>
          
          <Heading size="lg" color={headingColor}>
            About This Package
          </Heading>
          
          <Text color={textColor} fontSize="md">
            {packageData.description}
          </Text>
        </VStack>
      </Box>

      {/* Content */}
      <Box p={6}>
        <VStack spacing={6} align="stretch">
          {/* Essential Package Info - Only what's not in sidebar */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <Box
              p={4}
              bg={useColorModeValue('gray.50', 'gray.700')}
              borderRadius="lg"
              border="1px solid"
              borderColor={useColorModeValue('gray.200', 'gray.600')}
            >
              <HStack spacing={3} mb={2}>
                <Icon as={ClockIcon} w={5} h={5} color="green.500" />
                <Text fontWeight="semibold" color={headingColor}>
                  Best Time to Visit
                </Text>
              </HStack>
              <Text color={textColor} fontSize="sm">
                {packageData.best_time_to_visit || 'Year-round'}
              </Text>
            </Box>

            <Box
              p={4}
              bg={useColorModeValue('gray.50', 'gray.700')}
              borderRadius="lg"
              border="1px solid"
              borderColor={useColorModeValue('gray.200', 'gray.600')}
            >
              <HStack spacing={3} mb={2}>
                <Icon as={UserGroupIcon} w={5} h={5} color="blue.500" />
                <Text fontWeight="semibold" color={headingColor}>
                  Group Size
                </Text>
              </HStack>
              <Text color={textColor} fontSize="sm">
                {(packageData as any).group_size_min || 1}-{(packageData as any).group_size_max || 10} people
                {(packageData as any).group_size_recommended && (
                  <Text as="span" color="gray.500" ml={1}>
                    (recommended: {(packageData as any).group_size_recommended})
                  </Text>
                )}
              </Text>
            </Box>
          </SimpleGrid>

          <Divider />

          {/* Detailed Description */}
          {packageData.detailed_description && (
            <Box>
              <Heading size="md" color={headingColor} mb={4}>
                Package Details
              </Heading>
              <Text 
                color={textColor} 
                lineHeight="1.8" 
                fontSize="md"
                whiteSpace="pre-line"
              >
                {packageData.detailed_description}
              </Text>
            </Box>
          )}

          {/* Highlights */}
          {packageData.highlights && (
            <Box>
              <Heading size="md" color={headingColor} mb={4}>
                Package Highlights
              </Heading>
              <VStack spacing={2} align="stretch">
                {Array.isArray(packageData.highlights) 
                  ? packageData.highlights.map((highlight, index) => (
                      <HStack key={index} spacing={3}>
                        <Icon as={CheckCircleIcon} w={4} h={4} color="green.500" />
                        <Text color={textColor} fontSize="sm">
                          {highlight}
                        </Text>
                      </HStack>
                    ))
                  : (packageData.highlights as string).split(',').map((highlight, index) => (
                      <HStack key={index} spacing={3}>
                        <Icon as={CheckCircleIcon} w={4} h={4} color="green.500" />
                        <Text color={textColor} fontSize="sm">
                          {highlight.trim()}
                        </Text>
                      </HStack>
                    ))
                }
              </VStack>
            </Box>
          )}

          {/* What to Bring */}
          {packageData.what_to_bring && packageData.what_to_bring.length > 0 && (
            <Box>
              <Heading size="md" color={headingColor} mb={4}>
                What to Bring
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
                {packageData.what_to_bring.map((item, index) => (
                  <HStack key={index} spacing={3}>
                    <Icon as={CheckCircleIcon} w={4} h={4} color="blue.500" />
                    <Text color={textColor} fontSize="sm">
                      {item}
                    </Text>
                  </HStack>
                ))}
              </SimpleGrid>
            </Box>
          )}

          {/* Important Notes */}
          {packageData.important_notes && packageData.important_notes.length > 0 && (
            <Box>
              <Heading size="md" color={headingColor} mb={4}>
                Important Notes
              </Heading>
              <VStack spacing={2} align="stretch">
                {packageData.important_notes.map((note, index) => (
                  <HStack key={index} spacing={3} align="start">
                    <Icon as={XCircleIcon} w={4} h={4} color="orange.500" mt={0.5} />
                    <Text color={textColor} fontSize="sm">
                      {note}
                    </Text>
                  </HStack>
                ))}
              </VStack>
            </Box>
          )}
        </VStack>
      </Box>
    </Box>
  );
}
