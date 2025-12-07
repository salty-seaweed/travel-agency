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
import { ClockIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { BoatActivity } from '../../types';
import { LazyImage } from '../LazyImage';

interface ActivityCardProps {
  activity: BoatActivity;
  className?: string;
  loading?: boolean;
}

export function ActivityCard({ activity, className = '', loading = false }: ActivityCardProps) {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.900', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');

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
        <Box h="200px" bg="gray.200" />
        <Box p={6}>
          <Box h="24px" bg="gray.200" borderRadius="md" mb={3} />
          <Box h="40px" bg="gray.200" borderRadius="md" />
        </Box>
      </Box>
    );
  }

  return (
    <Link to={`/boats/activities/${activity.id}`} className={className}>
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
        <Box position="relative" h="200px" overflow="hidden">
          <LazyImage
            src={activity.hero_image_url || activity.hero_image || '/images/activity-placeholder.jpg'}
            alt={activity.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </Box>

        {/* Content */}
        <VStack align="stretch" p={6} spacing={4} flex={1}>
          <VStack align="stretch" spacing={2}>
            <Heading size="md" color={textColor} noOfLines={1}>
              {activity.name}
            </Heading>
            <Text color={mutedColor} fontSize="sm" noOfLines={2} minH="40px">
              {activity.description}
            </Text>
          </VStack>

          {/* Details */}
          <VStack align="stretch" spacing={2} pt={2}>
            <HStack spacing={2} fontSize="sm" color={mutedColor}>
              <Icon as={ClockIcon} boxSize={4} />
              <Text>
                {activity.duration_description || `${activity.duration_hours} hours`}
              </Text>
            </HStack>
            
            <HStack spacing={2} fontSize="sm" color={mutedColor}>
              <Icon as={UserGroupIcon} boxSize={4} />
              <Text>
                {activity.min_participants}-{activity.max_participants} guests
              </Text>
            </HStack>
          </VStack>
        </VStack>
      </Box>
    </Link>
  );
}
