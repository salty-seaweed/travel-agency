import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  HStack,
  Button,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

export const HomepageSwitcher: React.FC = () => {
  const location = useLocation();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  const isExperiences = location.pathname === '/experiences';
  const isOriginal = location.pathname === '/';

  return (
    <Box
      position="fixed"
      top={4}
      right={4}
      zIndex={1000}
      bg={bgColor}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="lg"
      p={2}
      shadow="lg"
    >
      <HStack spacing={2}>
        <Text fontSize="sm" fontWeight="medium" color="gray.600">
          Homepage:
        </Text>
        <Link to="/">
          <Button
            size="sm"
            variant={isOriginal ? "solid" : "outline"}
            colorScheme="blue"
          >
            Original
          </Button>
        </Link>
        <Link to="/experiences">
          <Button
            size="sm"
            variant={isExperiences ? "solid" : "outline"}
            colorScheme="purple"
          >
            Experiences
          </Button>
        </Link>
      </HStack>
    </Box>
  );
};
