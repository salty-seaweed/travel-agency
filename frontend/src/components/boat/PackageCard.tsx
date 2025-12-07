import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  HStack,
  VStack,
  Icon,
  Badge,
  useColorModeValue,
  Flex,
} from '@chakra-ui/react';
import { ClockIcon, CheckIcon, UserGroupIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { BoatPackage } from '../../types';
import { LazyImage } from '../LazyImage';

interface PackageCardProps {
  boatPackage: BoatPackage;
  className?: string;
  loading?: boolean;
}

export function PackageCard({ boatPackage, className = '', loading = false }: PackageCardProps) {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.900', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');
  const accentColor = useColorModeValue('blue.600', 'blue.400');

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
        <Box h="200px" bg="gray.200" className="animate-pulse" />
        <Box p={5}>
          <Box h="20px" bg="gray.200" borderRadius="md" mb={3} className="animate-pulse" />
          <Box h="16px" bg="gray.200" borderRadius="md" mb={2} w="80%" className="animate-pulse" />
          <Box h="16px" bg="gray.200" borderRadius="md" w="60%" className="animate-pulse" />
        </Box>
      </Box>
    );
  }

  const hasDiscount = boatPackage.discount_percentage > 0;
  const displayPrice = hasDiscount ? boatPackage.discounted_price : boatPackage.price;
  const originalPrice = boatPackage.price;

  // Get image - prioritize gallery_images first, then hero_image_url
  const packageImage = boatPackage.gallery_images?.[0] || boatPackage.hero_image_url || boatPackage.hero_image;

  const tierConfig: Record<string, { color: string; gradient: string }> = {
    silver: { color: 'gray', gradient: 'linear(to-r, gray.400, gray.600)' },
    gold: { color: 'yellow', gradient: 'linear(to-r, yellow.400, orange.400)' },
    platinum: { color: 'purple', gradient: 'linear(to-r, purple.400, pink.400)' },
    custom: { color: 'blue', gradient: 'linear(to-r, blue.400, cyan.400)' },
  };

  const tier = tierConfig[boatPackage.package_tier] || tierConfig.custom;

  return (
    <Link to={`/boats/packages/${boatPackage.id}`} className={className}>
      <Box
        bg={cardBg}
        borderRadius="xl"
        overflow="hidden"
        shadow="sm"
        border="1px"
        borderColor={borderColor}
        transition="all 0.3s ease"
        _hover={{
          shadow: 'xl',
          transform: 'translateY(-6px)',
          borderColor: 'blue.400',
        }}
        h="full"
        display="flex"
        flexDirection="column"
      >
        {/* Image Section */}
        <Box position="relative" h="200px" overflow="hidden">
          {packageImage ? (
            <LazyImage
              src={packageImage}
              alt={boatPackage.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.3s ease',
              }}
            />
          ) : (
            <Box
              w="100%"
              h="100%"
              bgGradient={tier.gradient}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Icon as={SparklesIcon} boxSize={12} color="white" opacity={0.5} />
            </Box>
          )}
          
          {/* Gradient overlay */}
          <Box
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            h="50%"
            bgGradient="linear(to-t, blackAlpha.600, transparent)"
          />

          {/* Top badges */}
          <HStack position="absolute" top={3} left={3} spacing={2}>
            <Badge
              bgGradient={tier.gradient}
              color="white"
              fontSize="xs"
              px={2}
              py={1}
              borderRadius="md"
              textTransform="uppercase"
              fontWeight="bold"
            >
              {boatPackage.package_tier}
            </Badge>
            {boatPackage.is_featured && (
              <Badge
                bg="orange.400"
                color="white"
                fontSize="xs"
                px={2}
                py={1}
                borderRadius="md"
              >
                <HStack spacing={1}>
                  <Icon as={SparklesIcon} boxSize={3} />
                  <Text>Best Value</Text>
                </HStack>
              </Badge>
            )}
          </HStack>

          {/* Discount badge */}
          {hasDiscount && (
            <Badge
              position="absolute"
              top={3}
              right={3}
              bg="red.500"
              color="white"
              fontSize="sm"
              px={2}
              py={1}
              borderRadius="md"
              fontWeight="bold"
            >
              {boatPackage.discount_percentage}% OFF
            </Badge>
          )}

          {/* Price on image */}
          <Box position="absolute" bottom={3} left={3}>
            <VStack align="flex-start" spacing={0}>
              {hasDiscount && (
                <Text fontSize="xs" color="whiteAlpha.800" textDecoration="line-through">
                  {boatPackage.currency} {originalPrice}
                </Text>
              )}
              <HStack spacing={1} align="baseline">
                <Text fontSize="xl" fontWeight="bold" color="white" textShadow="0 2px 4px rgba(0,0,0,0.3)">
                  {boatPackage.currency} {displayPrice}
                </Text>
                <Text fontSize="xs" color="whiteAlpha.900">/charter</Text>
              </HStack>
            </VStack>
          </Box>
        </Box>

        {/* Content Section */}
        <VStack align="stretch" p={5} spacing={3} flex={1}>
          {/* Title */}
          <Heading size="sm" color={textColor} noOfLines={1}>
            {boatPackage.name}
          </Heading>

          {/* Description */}
          <Text color={mutedColor} fontSize="sm" noOfLines={2} lineHeight="tall">
            {boatPackage.description}
          </Text>

          {/* Boat & Duration Info */}
          <HStack spacing={4} fontSize="xs" color={mutedColor}>
            {boatPackage.boat_name && (
              <HStack spacing={1}>
                <Box w={1.5} h={1.5} bg={accentColor} borderRadius="full" />
                <Text>{boatPackage.boat_name}</Text>
              </HStack>
            )}
            <HStack spacing={1}>
              <Icon as={ClockIcon} boxSize={3.5} />
              <Text>{boatPackage.duration_description}</Text>
            </HStack>
          </HStack>

          {/* Inclusions Preview */}
          {boatPackage.includes && boatPackage.includes.length > 0 && (
            <VStack align="stretch" spacing={1.5} pt={2}>
              {boatPackage.includes.slice(0, 3).map((item, index) => (
                <HStack key={index} spacing={2} fontSize="xs" color={mutedColor}>
                  <Icon as={CheckIcon} boxSize={3.5} color="green.500" flexShrink={0} />
                  <Text noOfLines={1}>{item}</Text>
                </HStack>
              ))}
              {boatPackage.includes.length > 3 && (
                <Text fontSize="xs" color={accentColor} fontWeight="medium" pl={5}>
                  +{boatPackage.includes.length - 3} more included
                </Text>
              )}
            </VStack>
          )}

          {/* Spacer to push button to bottom */}
          <Box flex={1} minH={2} />

          {/* CTA hint */}
          <Flex
            justify="center"
            align="center"
            py={2}
            px={4}
            bg={useColorModeValue('blue.50', 'blue.900')}
            borderRadius="lg"
            color={accentColor}
            fontWeight="medium"
            fontSize="sm"
          >
            View Package Details →
          </Flex>
        </VStack>
      </Box>
    </Link>
  );
}
