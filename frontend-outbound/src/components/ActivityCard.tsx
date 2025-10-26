import React from 'react';
import { Box, Text, VStack, Icon, LinkBox, LinkOverlay } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FaMountain, FaLandmark, FaUtensils, FaTree, FaUmbrellaBeach, FaCity } from 'react-icons/fa';
import { ActivityCategory } from '../../types';

interface ActivityCardProps {
  activity: ActivityCategory;
}

const iconMap: { [key: string]: React.ElementType } = {
  mountain: FaMountain,
  landmark: FaLandmark,
  utensils: FaUtensils,
  tree: FaTree,
  'umbrella-beach': FaUmbrellaBeach,
  city: FaCity,
};

const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
  const ActivityIcon = iconMap[activity.icon] || FaMountain;

  return (
    <LinkBox
      as="article"
      p={5}
      borderWidth="1px"
      borderRadius="lg"
      textAlign="center"
      boxShadow="md"
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-5px)', boxShadow: 'xl', color: 'blue.600' }}
    >
      <VStack spacing={4}>
        <Icon as={ActivityIcon} w={10} h={10} />
        <Text fontWeight="bold" fontSize="lg">
          <LinkOverlay as={RouterLink} to={`/search?activity=${activity.slug}`}>
            {activity.name}
          </LinkOverlay>
        </Text>
      </VStack>
    </LinkBox>
  );
};

export default ActivityCard;
