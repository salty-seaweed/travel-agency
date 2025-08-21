import React from 'react';
import {
  VStack,
  HStack,
  Text,
  Badge,
  Card,
  CardBody,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Checkbox,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  IconButton,
} from '@chakra-ui/react';
import {
  EllipsisVerticalIcon,
  EyeIcon,
  PencilIcon,
  DocumentDuplicateIcon,
  TrashIcon,
  CheckCircleIcon,
  ClockIcon,
  ArchiveBoxIcon,
  GlobeAltIcon,
  CogIcon,
} from '@heroicons/react/24/outline';
import type { Page } from '../../../../types';

interface PageTableProps {
  pages: Page[];
  selectedPages: string[];
  onSelectAll: (checked: boolean) => void;
  onSelectPage: (pageId: string, checked: boolean) => void;
  onViewPage: (page: Page) => void;
  onEditPage: (page: Page) => void;
  onAdvancedEditPage?: (page: Page) => void;
  onDuplicatePage: (pageId: string) => void;
  onDeletePage: (pageId: string) => void;
}

export const PageTable: React.FC<PageTableProps> = ({
  pages,
  selectedPages,
  onSelectAll,
  onSelectPage,
  onViewPage,
  onEditPage,
  onAdvancedEditPage,
  onDuplicatePage,
  onDeletePage,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'green';
      case 'draft': return 'yellow';
      case 'archived': return 'red';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published': return <CheckCircleIcon className="w-4 h-4" />;
      case 'draft': return <ClockIcon className="w-4 h-4" />;
      case 'archived': return <ArchiveBoxIcon className="w-4 h-4" />;
      default: return <ClockIcon className="w-4 h-4" />;
    }
  };

  return (
    <Card>
      <CardBody p={0}>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th px={4}>
                <Checkbox
                  isChecked={selectedPages.length === pages.length && pages.length > 0}
                  isIndeterminate={selectedPages.length > 0 && selectedPages.length < pages.length}
                  onChange={(e) => onSelectAll(e.target.checked)}
                />
              </Th>
              <Th>Title</Th>
              <Th>Slug</Th>
              <Th>Status</Th>
              <Th>Language</Th>
              <Th>Template</Th>
              <Th>Updated</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {pages.map((page) => (
              <Tr key={page.id}>
                <Td px={4}>
                  <Checkbox
                    isChecked={selectedPages.includes(page.id.toString())}
                    onChange={(e) => onSelectPage(page.id.toString(), e.target.checked)}
                  />
                </Td>
                <Td>
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="medium">{page.title}</Text>
                    {page.is_home && (
                      <Badge size="sm" colorScheme="blue">Home</Badge>
                    )}
                  </VStack>
                </Td>
                <Td>
                  <Text fontSize="sm" color="gray.600" fontFamily="mono">
                    /{page.slug}/
                  </Text>
                </Td>
                <Td>
                  <Badge
                    colorScheme={getStatusColor(page.status)}
                  >
                    {getStatusIcon(page.status)}
                    {page.status}
                  </Badge>
                </Td>
                <Td>
                  <HStack spacing={1}>
                    <GlobeAltIcon className="w-4 h-4" />
                    <Text fontSize="sm">{page.locale.toUpperCase()}</Text>
                  </HStack>
                </Td>
                <Td>
                  <Text fontSize="sm">{page.template || 'default'}</Text>
                </Td>
                <Td>
                  <VStack align="start" spacing={1}>
                    <Text fontSize="sm">
                      {page.updated_at ? new Date(page.updated_at).toLocaleDateString() : 'N/A'}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      by {page.updated_by || 'Unknown'}
                    </Text>
                  </VStack>
                </Td>
                <Td>
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      icon={<EllipsisVerticalIcon className="w-4 h-4" />}
                      variant="ghost"
                      size="sm"
                    />
                    <MenuList>
                      <MenuItem onClick={() => onViewPage(page)}>
                        <HStack>
                          <EyeIcon className="w-4 h-4" />
                          <Text>View</Text>
                        </HStack>
                      </MenuItem>
                      <MenuItem onClick={() => onEditPage(page)}>
                        <HStack>
                          <PencilIcon className="w-4 h-4" />
                          <Text>Edit</Text>
                        </HStack>
                      </MenuItem>
                      {onAdvancedEditPage && (
                        <MenuItem onClick={() => onAdvancedEditPage(page)}>
                          <HStack>
                            <CogIcon className="w-4 h-4" />
                            <Text>Advanced Edit</Text>
                          </HStack>
                        </MenuItem>
                      )}
                      <MenuItem onClick={() => onDuplicatePage(page.id.toString())}>
                        <HStack>
                          <DocumentDuplicateIcon className="w-4 h-4" />
                          <Text>Duplicate</Text>
                        </HStack>
                      </MenuItem>
                      <MenuDivider />
                      <MenuItem onClick={() => onDeletePage(page.id.toString())} color="red.500">
                        <HStack>
                          <TrashIcon className="w-4 h-4" />
                          <Text>Delete</Text>
                        </HStack>
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </CardBody>
    </Card>
  );
};
