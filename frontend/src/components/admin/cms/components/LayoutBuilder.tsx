import React from 'react';
import {
  Box,
  VStack,
  Text,
  Select,
  useColorModeValue,
} from '@chakra-ui/react';

interface LayoutBuilderProps {
  layout: string;
  onChange: (layout: string) => void;
  customStyles: any;
}

export const LayoutBuilder: React.FC<LayoutBuilderProps> = ({
  layout,
  onChange,
  customStyles,
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');

  return (
    <VStack spacing={4} align="stretch" p={4}>
      <Box>
        <Text fontSize="lg" fontWeight="semibold" mb={2}>
          Layout Builder
        </Text>
        <Text fontSize="sm" color="gray.600" mb={4}>
          Choose and customize the layout for your page.
        </Text>
      </Box>

      <Box>
        <Text fontSize="sm" fontWeight="semibold" mb={2}>
          Page Layout
        </Text>
        <Select
          value={layout}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="default">Default Layout</option>
          <option value="full-width">Full Width</option>
          <option value="sidebar">Sidebar Layout</option>
          <option value="landing">Landing Page</option>
          <option value="blog">Blog Layout</option>
          <option value="contact">Contact Layout</option>
        </Select>
      </Box>
    </VStack>
  );
};
