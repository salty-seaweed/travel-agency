import React from 'react';
import {
  Box,
  VStack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

interface ResponsiveDesignerProps {
  settings: any;
  onChange: (settings: any) => void;
}

export const ResponsiveDesigner: React.FC<ResponsiveDesignerProps> = ({
  settings,
  onChange,
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');

  return (
    <VStack spacing={4} align="stretch" p={4}>
      <Box>
        <Text fontSize="lg" fontWeight="semibold" mb={2}>
          Responsive Designer
        </Text>
        <Text fontSize="sm" color="gray.600" mb={4}>
          Configure responsive design settings for different screen sizes.
        </Text>
      </Box>

      <Box bg={bgColor} border="1px solid" borderColor="gray.200" borderRadius="md" p={4}>
        <Text color="gray.500">Responsive design settings coming soon...</Text>
      </Box>
    </VStack>
  );
};


