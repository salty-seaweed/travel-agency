import React from 'react';
import { Box, Image, Text, Badge, Flex, Heading, LinkBox, LinkOverlay, VStack } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { TourPackageListItem } from '../../types';
import { FaClock, FaTag, FaMapMarkerAlt } from 'react-icons/fa';

interface TourCardProps {
  tour: TourPackageListItem;
}

const TourCard: React.FC<TourCardProps> = ({ tour }) => {
  const placeholderImage = 'https://via.placeholder.com/400x300.png?text=Tour';

  return (
    <LinkBox
      as="article"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="md"
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-5px)', boxShadow: 'xl' }}
      display="flex"
      flexDirection="column"
      height="100%"
    >
      <Box position="relative">
        <Image src={tour.main_image || placeholderImage} alt={tour.name} objectFit="cover" height="200px" width="100%" />
        {tour.is_on_sale && tour.discount_percentage > 0 && (
          <Badge
            position="absolute"
            top="2"
            right="2"
            colorScheme="orange"
            fontSize="sm"
            px={2}
            py={1}
            borderRadius="md"
          >
            {tour.discount_percentage}% OFF
          </Badge>
        )}
      </Box>
      <VStack flex="1" p="6" spacing={3} align="stretch">
        <Flex align="center" color="gray.500" fontSize="sm">
          <FaMapMarkerAlt />
          <Text ml={2}>{tour.country_name}</Text>
        </Flex>
        <Heading size="md" flex="1">
          <LinkOverlay as={RouterLink} to={`/tours/${tour.slug}`}>
            {tour.name}
          </LinkOverlay>
        </Heading>
        <Flex justify="space-between" align="center">
          <Flex align="center" color="gray.500">
            <FaClock />
            <Text ml={2}>{tour.duration_days} Days</Text>
          </Flex>
          <Box textAlign="right">
            {tour.is_on_sale && (
              <Text as="s" color="gray.500" fontSize="sm">
                ${parseFloat(tour.price_usd).toFixed(2)}
              </Text>
            )}
            <Text color="blue.600" fontSize="xl" fontWeight="bold">
              ${parseFloat(tour.final_price).toFixed(2)}
            </Text>
          </Box>
        </Flex>
      </VStack>
    </LinkBox>
  );
};

export default TourCard;
