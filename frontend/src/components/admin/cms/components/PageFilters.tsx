import React from 'react';
import {
  VStack,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Text,
  Button,
  Card,
  CardBody,
} from '@chakra-ui/react';
import {
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

interface PageFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  localeFilter: string;
  onLocaleFilterChange: (value: string) => void;
  selectedCount: number;
  onBulkAction: (action: 'publish' | 'archive' | 'delete') => void;
  bulkActionLoading: boolean;
}

export const PageFilters: React.FC<PageFiltersProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  localeFilter,
  onLocaleFilterChange,
  selectedCount,
  onBulkAction,
  bulkActionLoading,
}) => {
  return (
    <Card>
      <CardBody>
        <VStack spacing={4}>
          <HStack spacing={4} width="full">
            <InputGroup>
              <InputLeftElement>
                <MagnifyingGlassIcon className="w-4 h-4" />
              </InputLeftElement>
              <Input
                placeholder="Search pages..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </InputGroup>
            
            <Select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              width="200px"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </Select>
            
            <Select
              value={localeFilter}
              onChange={(e) => onLocaleFilterChange(e.target.value)}
              width="150px"
            >
              <option value="all">All Languages</option>
              <option value="en">English</option>
              <option value="ru">Russian</option>
              <option value="zh">Chinese</option>
            </Select>
          </HStack>

          {/* Bulk Actions */}
          {selectedCount > 0 && (
            <HStack spacing={2} width="full">
              <Text fontSize="sm" color="gray.600">
                {selectedCount} pages selected
              </Text>
              <Button
                size="sm"
                colorScheme="green"
                onClick={() => onBulkAction('publish')}
                isLoading={bulkActionLoading}
              >
                Publish
              </Button>
              <Button
                size="sm"
                colorScheme="orange"
                onClick={() => onBulkAction('archive')}
                isLoading={bulkActionLoading}
              >
                Archive
              </Button>
              <Button
                size="sm"
                colorScheme="red"
                onClick={() => onBulkAction('delete')}
                isLoading={bulkActionLoading}
              >
                Delete
              </Button>
            </HStack>
          )}
        </VStack>
      </CardBody>
    </Card>
  );
};

