import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { MapPinIcon, UserGroupIcon, BoltIcon } from '@heroicons/react/24/outline';
import { Boat } from '../../types';
import { LazyImage } from '../LazyImage';

interface BoatCardProps {
  boat: Boat;
  className?: string;
  loading?: boolean;
  compact?: boolean;
}

export function BoatCard({ boat, className = '', loading = false, compact = false }: BoatCardProps) {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.900', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');

  const imageHeight = compact ? '160px' : '250px';
  const padding = compact ? 4 : 6;

  if (loading) {
    return (
      <Box
        bg={cardBg}
        borderRadius="xl"
        overflow="hidden"
        shadow="sm"
        border="1px"
        borderColor={borderColor}
        className={className}
      >
        <Box h={imageHeight} bg="gray.200" />
        <Box p={padding}>
          <Box h="24px" bg="gray.200" borderRadius="md" mb={3} />
          <Box h="40px" bg="gray.200" borderRadius="md" />
        </Box>
      </Box>
    );
  }

  return (
    <Link to={`/boats/${boat.id}`} className={className}>
      <Box
        bg={cardBg}
        borderRadius="xl"
        overflow="hidden"
        shadow="sm"
        border="1px"
        borderColor={borderColor}
        transition="all 0.3s"
        _hover={{
          shadow: 'xl',
          transform: 'translateY(-4px)',
          borderColor: 'blue.400',
        }}
        h="full"
        display="flex"
        flexDirection="column"
      >
        {/* Image */}
        <Box position="relative" h={imageHeight} overflow="hidden">
          <LazyImage
            src={boat.hero_image_url || boat.hero_image || '/images/boat-placeholder.jpg'}
            alt={boat.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </Box>

        {/* Content */}
        <VStack align="stretch" p={padding} spacing={compact ? 2 : 4} flex={1}>
          <VStack align="stretch" spacing={compact ? 1 : 2}>
            <Heading size={compact ? 'sm' : 'md'} color={textColor} noOfLines={1}>
              {boat.name}
            </Heading>
            {!compact && (
              <Text color={mutedColor} fontSize="sm" noOfLines={2} minH="40px">
                {boat.description}
              </Text>
            )}
          </VStack>

          {/* Specs */}
          <VStack align="stretch" spacing={compact ? 1 : 2} pt={compact ? 1 : 2}>
            <HStack spacing={2} fontSize={compact ? 'xs' : 'sm'} color={mutedColor}>
              <Icon as={BoltIcon} boxSize={compact ? 3 : 4} />
              <Text>
                {boat.speed_range || `${boat.cruising_speed_knots}-${boat.top_speed_knots} knots`}
              </Text>
            </HStack>
            
            <HStack spacing={2} fontSize={compact ? 'xs' : 'sm'} color={mutedColor}>
              <Icon as={UserGroupIcon} boxSize={compact ? 3 : 4} />
              <Text>
                Up to {boat.passenger_capacity} guests
              </Text>
            </HStack>
            
            {!compact && (
              <HStack spacing={2} fontSize="sm" color={mutedColor}>
                <Icon as={MapPinIcon} boxSize={4} />
                <Text noOfLines={1}>
                  {boat.departure_location}
                </Text>
              </HStack>
            )}
          </VStack>
        </VStack>
      </Box>
    </Link>
  );
}
