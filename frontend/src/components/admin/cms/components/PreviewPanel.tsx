import React from 'react';
import {
  Box,
  VStack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

interface PreviewPanelProps {
  pageData: any;
  customStyles: any;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  pageData,
  customStyles,
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');

  return (
    <VStack spacing={4} align="stretch" p={4}>
      <Box>
        <Text fontSize="lg" fontWeight="semibold" mb={2}>
          Page Preview
        </Text>
        <Text fontSize="sm" color="gray.600" mb={4}>
          Live preview of your page with applied styles and content.
        </Text>
      </Box>

      <Box
        bg={bgColor}
        border="1px solid"
        borderColor="gray.200"
        borderRadius="md"
        p={4}
        minH="400px"
      >
        <Box
          className="cms-content"
          dangerouslySetInnerHTML={{ __html: pageData.content || '<p>Preview content will appear here...</p>' }}
          style={{
            fontFamily: customStyles.typography?.fontFamily,
            fontSize: customStyles.typography?.fontSize,
            lineHeight: customStyles.typography?.lineHeight,
            fontWeight: customStyles.typography?.fontWeight,
            color: customStyles.colors?.text,
            backgroundColor: customStyles.colors?.background,
            padding: customStyles.spacing?.padding,
            margin: customStyles.spacing?.margin,
            borderRadius: customStyles.borders?.radius,
            boxShadow: customStyles.shadows?.boxShadow,
          }}
        />
        {pageData.customCSS && (
          <style>{pageData.customCSS}</style>
        )}
      </Box>
    </VStack>
  );
};
