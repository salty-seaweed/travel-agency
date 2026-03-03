import React from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Divider,
} from '@chakra-ui/react';

interface PolicyPageProps {
  title: string;
  content: React.ReactNode;
}

export function PolicyPage({ title, content }: PolicyPageProps) {
  return (
    <Container maxW="4xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="xl" mb={4}>
            {title}
          </Heading>
          <Text color="gray.600" fontSize="sm">
            Last updated: {new Date().toLocaleDateString()}
          </Text>
        </Box>

        <Divider />

        <Box
          className="policy-content"
          sx={{
            '& h2': {
              fontSize: 'xl',
              fontWeight: 'bold',
              mt: 6,
              mb: 3,
            },
            '& h3': {
              fontSize: 'lg',
              fontWeight: 'semibold',
              mt: 4,
              mb: 2,
            },
            '& p': {
              mb: 4,
              lineHeight: 'tall',
            },
            '& ul, & ol': {
              ml: 6,
              mb: 4,
            },
            '& li': {
              mb: 2,
            },
          }}
        >
          {content}
        </Box>
      </VStack>
    </Container>
  );
}



