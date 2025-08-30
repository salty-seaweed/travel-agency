import React from 'react';
import {
  Box,
  VStack,
  Text,
  Textarea,
  useColorModeValue,
} from '@chakra-ui/react';
import { RichTextEditor } from './RichTextEditor';

interface ContentEditorProps {
  content: string;
  onChange: (content: string) => void;
  customStyles: any;
}

export const ContentEditor: React.FC<ContentEditorProps> = ({
  content,
  onChange,
  customStyles,
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');

  return (
    <VStack spacing={4} align="stretch" p={4}>
      <Box>
        <Text fontSize="lg" fontWeight="semibold" mb={2}>
          Page Content Editor
        </Text>
        <Text fontSize="sm" color="gray.600" mb={4}>
          Use the rich text editor below to create and format your page content.
        </Text>
      </Box>

      <Box bg={bgColor} border="1px solid" borderColor="gray.200" borderRadius="md">
        <RichTextEditor
          value={content}
          onChange={onChange}
          placeholder="Start writing your page content here..."
        />
      </Box>
    </VStack>
  );
};


