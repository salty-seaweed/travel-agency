import React from 'react';
import {
  Flex,
  VStack,
  HStack,
  Text,
  Button,
  Heading,
} from '@chakra-ui/react';
import {
  PlusIcon,
} from '@heroicons/react/24/outline';

interface PageHeaderProps {
  pageCount: number;
  onCreatePage: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  pageCount,
  onCreatePage,
}) => {
  return (
    <Flex justify="space-between" align="center">
      <VStack align="start" spacing={1}>
        <Heading size="md">Pages</Heading>
        <Text color="gray.600">{pageCount} pages found</Text>
      </VStack>
      <Button
        leftIcon={<PlusIcon className="w-4 h-4" />}
        colorScheme="blue"
        onClick={onCreatePage}
      >
        Create Page
      </Button>
    </Flex>
  );
};

