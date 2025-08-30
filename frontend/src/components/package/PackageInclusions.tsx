import React from 'react';
import {
  Box,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  VStack,
  HStack,
  List,
  ListItem,
  ListIcon,
  Badge,
  Icon,
  SimpleGrid,
  Divider,
  Progress,
} from '@chakra-ui/react';
import {
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  StarIcon,
  ShieldCheckIcon,
  TruckIcon,
  HomeIcon,
  CakeIcon,
  WifiIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';
import type { PackageInclusion } from '../../types';

interface PackageInclusionsProps {
  inclusions: PackageInclusion[];
}

export function PackageInclusions({ inclusions }: PackageInclusionsProps) {
  if (!inclusions || inclusions.length === 0) {
    return null;
  }

  const includedItems = inclusions.filter(item => item.category === 'included');
  const excludedItems = inclusions.filter(item => item.category === 'excluded');
  const optionalItems = inclusions.filter(item => item.category === 'optional');

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'accommodation': return HomeIcon;
      case 'transportation': return TruckIcon;
      case 'meals': return CakeIcon;
      case 'wifi': return WifiIcon;
      case 'activities': return GlobeAltIcon;
      case 'insurance': return ShieldCheckIcon;
      default: return StarIcon;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'accommodation': return 'blue';
      case 'transportation': return 'green';
      case 'meals': return 'orange';
      case 'wifi': return 'purple';
      case 'activities': return 'teal';
      case 'insurance': return 'red';
      default: return 'gray';
    }
  };

  const getCategoryStats = () => {
    const total = inclusions.length;
    const included = includedItems.length;
    const excluded = excludedItems.length;
    const optional = optionalItems.length;
    
    return {
      total,
      included,
      excluded,
      optional,
      includedPercentage: Math.round((included / total) * 100)
    };
  };

  const stats = getCategoryStats();

  return (
    <Card>
      <CardHeader>
        <VStack align="start" spacing={3}>
          <HStack justify="space-between" w="full">
            <Heading size="md" color="gray.800">What's Included</Heading>
            <Badge colorScheme="purple" variant="subtle" fontSize="sm">
              {stats.includedPercentage}% included
            </Badge>
          </HStack>
          
          {/* Progress Bar */}
          <Box w="full">
            <HStack justify="space-between" mb={2}>
              <Text fontSize="sm" color="gray.600">Package Coverage</Text>
              <Text fontSize="sm" color="gray.600" fontWeight="medium">
                {stats.included} of {stats.total} items
              </Text>
            </HStack>
            <Progress
              value={stats.includedPercentage}
              colorScheme="green"
              size="lg"
              borderRadius="full"
            />
          </Box>
        </VStack>
      </CardHeader>
      
      <CardBody>
        <VStack spacing={6} align="stretch">
          {/* Included Items */}
          {includedItems.length > 0 && (
            <Box>
              <HStack spacing={2} mb={4}>
                <Icon as={CheckCircleIcon} h={5} w={5} color="green.500" />
                <Text fontWeight="semibold" color="gray.800" fontSize="lg">
                  Included in Package
                </Text>
                <Badge colorScheme="green" variant="subtle">
                  {includedItems.length} items
                </Badge>
              </HStack>
              
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                {includedItems.map((item, index) => (
                  <InclusionItem
                    key={item.id || index}
                    item={item}
                    type="included"
                    getCategoryIcon={getCategoryIcon}
                    getCategoryColor={getCategoryColor}
                  />
                ))}
              </SimpleGrid>
            </Box>
          )}

          {/* Optional Items */}
          {optionalItems.length > 0 && (
            <Box>
              <HStack spacing={2} mb={4}>
                <Icon as={InformationCircleIcon} h={5} w={5} color="orange.500" />
                <Text fontWeight="semibold" color="gray.800" fontSize="lg">
                  Optional Add-ons
                </Text>
                <Badge colorScheme="orange" variant="subtle">
                  {optionalItems.length} items
                </Badge>
              </HStack>
              
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                {optionalItems.map((item, index) => (
                  <InclusionItem
                    key={item.id || index}
                    item={item}
                    type="optional"
                    getCategoryIcon={getCategoryIcon}
                    getCategoryColor={getCategoryColor}
                  />
                ))}
              </SimpleGrid>
            </Box>
          )}

          {/* Excluded Items */}
          {excludedItems.length > 0 && (
            <Box>
              <HStack spacing={2} mb={4}>
                <Icon as={XCircleIcon} h={5} w={5} color="red.500" />
                <Text fontWeight="semibold" color="gray.800" fontSize="lg">
                  Not Included
                </Text>
                <Badge colorScheme="red" variant="subtle">
                  {excludedItems.length} items
                </Badge>
              </HStack>
              
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                {excludedItems.map((item, index) => (
                  <InclusionItem
                    key={item.id || index}
                    item={item}
                    type="excluded"
                    getCategoryIcon={getCategoryIcon}
                    getCategoryColor={getCategoryColor}
                  />
                ))}
              </SimpleGrid>
            </Box>
          )}

          {/* Summary */}
          <Box p={4} bg="gray.50" borderRadius="lg">
            <Text fontWeight="semibold" color="gray.800" mb={3}>
              Package Summary
            </Text>
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
              <VStack spacing={1}>
                <Text fontSize="2xl" fontWeight="bold" color="green.600">
                  {stats.included}
                </Text>
                <Text fontSize="sm" color="gray.600">Included</Text>
              </VStack>
              
              {stats.optional > 0 && (
                <VStack spacing={1}>
                  <Text fontSize="2xl" fontWeight="bold" color="orange.600">
                    {stats.optional}
                  </Text>
                  <Text fontSize="sm" color="gray.600">Optional</Text>
                </VStack>
              )}
              
              {stats.excluded > 0 && (
                <VStack spacing={1}>
                  <Text fontSize="2xl" fontWeight="bold" color="red.600">
                    {stats.excluded}
                  </Text>
                  <Text fontSize="sm" color="gray.600">Not Included</Text>
                </VStack>
              )}
              
              <VStack spacing={1}>
                <Text fontSize="2xl" fontWeight="bold" color="purple.600">
                  {stats.total}
                </Text>
                <Text fontSize="sm" color="gray.600">Total Items</Text>
              </VStack>
            </SimpleGrid>
          </Box>
        </VStack>
      </CardBody>
    </Card>
  );
}

// Inclusion Item Component
interface InclusionItemProps {
  item: PackageInclusion;
  type: 'included' | 'excluded' | 'optional';
  getCategoryIcon: (category: string) => any;
  getCategoryColor: (category: string) => string;
}

function InclusionItem({ item, type, getCategoryIcon, getCategoryColor }: InclusionItemProps) {
  const getTypeColor = () => {
    switch (type) {
      case 'included': return 'green';
      case 'excluded': return 'red';
      case 'optional': return 'orange';
      default: return 'gray';
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'included': return CheckCircleIcon;
      case 'excluded': return XCircleIcon;
      case 'optional': return InformationCircleIcon;
      default: return CheckCircleIcon;
    }
  };

  const categoryColor = getCategoryColor(item.item.toLowerCase());
  const CategoryIcon = getCategoryIcon(item.item.toLowerCase());

  return (
    <Box
      p={4}
      border="1px solid"
      borderColor={`${getTypeColor()}.200`}
      borderRadius="lg"
      bg={`${getTypeColor()}.50`}
      _hover={{ bg: `${getTypeColor()}.100` }}
      transition="all 0.2s"
    >
      <HStack spacing={3} align="start">
        <Icon as={getTypeIcon()} h={5} w={5} color={`${getTypeColor()}.500`} />
        
        <VStack align="start" spacing={1} flex={1}>
          <HStack spacing={2} align="center">
            <Text fontWeight="medium" color="gray.800">
              {item.item}
            </Text>
            <Badge colorScheme={categoryColor} variant="subtle" size="sm">
              {item.item}
            </Badge>
          </HStack>
          
          {item.description && (
            <Text fontSize="sm" color="gray.600" lineHeight="1.4">
              {item.description}
            </Text>
          )}
          
          {item.icon && (
            <HStack spacing={1} mt={1}>
              <Icon as={CategoryIcon} h={3} w={3} color={`${categoryColor}.500`} />
              <Text fontSize="xs" color="gray.500">
                {item.icon}
              </Text>
            </HStack>
          )}
        </VStack>
      </HStack>
    </Box>
  );
}
