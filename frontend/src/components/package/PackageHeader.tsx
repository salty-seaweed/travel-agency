import React from 'react';
import {
  Box,
  Heading,
  Text,
  HStack,
  VStack,
  Badge,
  Button,
  Icon,
  SimpleGrid,
  useToast,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/react';
import {
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  StarIcon,
  ArrowLeftIcon,
  PhoneIcon,
  HeartIcon,
  ShareIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../../utils';
import type { Package } from '../../types';

interface PackageHeaderProps {
  packageData: Package;
  onBookNow: () => void;
  onAddToWishlist: () => void;
  onShare: () => void;
  isWishlisted?: boolean;
}

export function PackageHeader({
  packageData,
  onBookNow,
  onAddToWishlist,
  onShare,
  isWishlisted = false,
}: PackageHeaderProps) {
  const navigate = useNavigate();
  const toast = useToast();

  const handleBookNow = () => {
    onBookNow();
    toast({
      title: 'Booking initiated',
      description: 'Contact us to book this package',
      status: 'success',
      duration: 3000,
    });
  };

  return (
    <Box mb={8}>
      {/* Breadcrumb Navigation */}
      <Breadcrumb mb={4} fontSize="sm" color="gray.600">
        <BreadcrumbItem>
          <BreadcrumbLink onClick={() => navigate('/')}>Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink onClick={() => navigate('/packages')}>Packages</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>{packageData.name}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      {/* Back Button */}
      <Button
        leftIcon={<Icon as={ArrowLeftIcon} />}
        variant="ghost"
        onClick={() => navigate('/packages')}
        mb={4}
        size="sm"
      >
        Back to Packages
      </Button>
      
      {/* Main Header */}
      <HStack justify="space-between" align="start" mb={6} wrap="wrap" gap={4}>
        <Box flex={1} minW="300px">
          <HStack spacing={3} mb={3} wrap="wrap">
            <Heading size="lg" color="gray.800" lineHeight="1.2">
              {packageData.name}
            </Heading>
            {packageData.is_featured && (
              <Badge colorScheme="yellow" variant="solid" fontSize="sm" px={3} py={1}>
                Featured
              </Badge>
            )}
            {packageData.rating && (
              <HStack spacing={1}>
                <Icon as={StarIcon} h={4} w={4} color="yellow.400" />
                <Text fontSize="sm" fontWeight="medium">
                  {packageData.rating.toFixed(1)} ({packageData.review_count || 0} reviews)
                </Text>
              </HStack>
            )}
          </HStack>
          
          <Text fontSize="lg" color="gray.600" mb={4} lineHeight="1.6">
            {packageData.description}
          </Text>
          
          {/* Quick Stats */}
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={6}>
            <HStack spacing={2} p={3} bg="gray.50" borderRadius="md">
              <Icon as={CalendarIcon} h={5} w={5} color="purple.500" />
              <VStack align="start" spacing={0}>
                <Text fontSize="sm" fontWeight="medium" color="gray.800">
                  {packageData.duration} days
                </Text>
                <Text fontSize="xs" color="gray.500">Duration</Text>
              </VStack>
            </HStack>
            
            <HStack spacing={2} p={3} bg="gray.50" borderRadius="md">
              <Icon as={MapPinIcon} h={5} w={5} color="purple.500" />
              <VStack align="start" spacing={0}>
                <Text fontSize="sm" fontWeight="medium" color="gray.800">
                  {packageData.destinations?.length || 0}
                </Text>
                <Text fontSize="xs" color="gray.500">Destinations</Text>
              </VStack>
            </HStack>
            
            <HStack spacing={2} p={3} bg="gray.50" borderRadius="md">
              <Icon as={UsersIcon} h={5} w={5} color="purple.500" />
              <VStack align="start" spacing={0}>
                <Text fontSize="sm" fontWeight="medium" color="gray.800">
                  {packageData.group_size?.min || 1}-{packageData.group_size?.max || 4}
                </Text>
                <Text fontSize="xs" color="gray.500">Group Size</Text>
              </VStack>
            </HStack>
            
            <HStack spacing={2} p={3} bg="gray.50" borderRadius="md">
              <Icon as={StarIcon} h={5} w={5} color="purple.500" />
              <VStack align="start" spacing={0}>
                <Text fontSize="sm" fontWeight="medium" color="gray.800" textTransform="capitalize">
                  {packageData.difficulty_level || 'Easy'}
                </Text>
                <Text fontSize="xs" color="gray.500">Difficulty</Text>
              </VStack>
            </HStack>
          </SimpleGrid>
        </Box>
        
        {/* Price and Actions */}
        <VStack align="end" spacing={4} minW="280px">
          <VStack align="end" spacing={2} p={4} bg="purple.50" borderRadius="lg" w="full">
            <VStack align="end" spacing={0}>
              <Text fontSize="3xl" fontWeight="bold" color="purple.600">
                {formatPrice(parseFloat(packageData.price))}
              </Text>
              {packageData.original_price && parseFloat(packageData.original_price) > parseFloat(packageData.price) && (
                <Text fontSize="sm" color="gray.500" textDecoration="line-through">
                  {formatPrice(parseFloat(packageData.original_price))}
                </Text>
              )}
              <Text fontSize="sm" color="gray.500">per person</Text>
            </VStack>
          </VStack>
          
          <HStack spacing={3} w="full">
            <Button
              colorScheme="purple"
              size="lg"
              flex={1}
              leftIcon={<Icon as={PhoneIcon} />}
              onClick={handleBookNow}
              _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
              transition="all 0.2s"
            >
              Book Now
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={onAddToWishlist}
              colorScheme={isWishlisted ? "red" : "gray"}
              _hover={{ transform: 'translateY(-2px)' }}
              transition="all 0.2s"
            >
              <Icon as={isWishlisted ? HeartSolidIcon : HeartIcon} h={5} w={5} />
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={onShare}
              _hover={{ transform: 'translateY(-2px)' }}
              transition="all 0.2s"
            >
              <Icon as={ShareIcon} h={5} w={5} />
            </Button>
          </HStack>
        </VStack>
      </HStack>
    </Box>
  );
}
