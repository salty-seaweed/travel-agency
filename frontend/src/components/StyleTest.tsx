import React from 'react';
import { Box, Button as ChakraButton, Text, VStack, HStack } from '@chakra-ui/react';
import { Button } from './Button';

export function StyleTest() {
  return (
    <Box p={8} bg="gray.50" minH="100vh">
      <VStack spacing={8} align="start">
        <Text fontSize="2xl" fontWeight="bold" color="gray.800">
          Style Test - Chakra UI + Tailwind CSS
        </Text>
        
        {/* Chakra UI Components */}
        <Box>
          <Text fontSize="lg" fontWeight="semibold" mb={4}>
            Chakra UI Components:
          </Text>
          <VStack spacing={4} align="start">
            <ChakraButton colorScheme="blue" size="md">
              Chakra Button
            </ChakraButton>
            <Box p={4} bg="white" borderRadius="md" shadow="md">
              <Text>Chakra Box with shadow</Text>
            </Box>
          </VStack>
        </Box>

        {/* Tailwind CSS Components */}
        <Box>
          <Text fontSize="lg" fontWeight="semibold" mb={4}>
            Tailwind CSS Components:
          </Text>
          <VStack spacing={4} align="start">
            <Button variant="primary" size="md">
              Tailwind Button
            </Button>
            <div className="p-4 bg-white rounded-lg shadow-md">
              <p className="text-gray-800">Tailwind div with shadow</p>
            </div>
          </VStack>
        </Box>

        {/* Mixed Usage */}
        <Box>
          <Text fontSize="lg" fontWeight="semibold" mb={4}>
            Mixed Usage:
          </Text>
          <HStack spacing={4}>
            <div className="p-4 bg-blue-500 text-white rounded-lg">
              <Text color="white">Tailwind bg + Chakra Text</Text>
            </div>
            <Box p={4} className="bg-green-500 text-white rounded-lg">
              <Text>Chakra Box + Tailwind classes</Text>
            </Box>
          </HStack>
        </Box>

        {/* Responsive Test */}
        <Box>
          <Text fontSize="lg" fontWeight="semibold" mb={4}>
            Responsive Test:
          </Text>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-purple-500 text-white rounded-lg">
              <p>Responsive Grid 1</p>
            </div>
            <div className="p-4 bg-purple-600 text-white rounded-lg">
              <p>Responsive Grid 2</p>
            </div>
            <div className="p-4 bg-purple-700 text-white rounded-lg">
              <p>Responsive Grid 3</p>
            </div>
          </div>
        </Box>
      </VStack>
    </Box>
  );
}

export default StyleTest;
