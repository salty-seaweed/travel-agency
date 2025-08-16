import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Button,
  IconButton,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Badge,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Switch,
  useDisclosure,
  useToast,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Textarea,
  Progress,
  Spinner,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  DocumentDuplicateIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon,
  InformationCircleIcon,
  GlobeAltIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { apiGet, apiPost, apiPut, apiDelete } from '../../../api';
import type { Redirect } from '../../../types';
import { useNotification } from '../../../hooks/useNotification';
import { LoadingSpinner } from '../../LoadingSpinner';

interface RedirectManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RedirectFormData {
  from_path: string;
  to_path: string;
  status_code: number;
  locale: 'en' | 'ru' | 'zh';
  is_active: boolean;
  start_date: string;
  end_date: string;
}

interface BulkImportData {
  redirects: Array<{
    from_path: string;
    to_path: string;
    status_code: number;
    locale: string;
  }>;
}

const RedirectManager: React.FC<RedirectManagerProps> = ({
  isOpen,
  onClose,
}) => {
  const [redirects, setRedirects] = useState<Redirect[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [localeFilter, setLocaleFilter] = useState('all');
  const [selectedRedirect, setSelectedRedirect] = useState<Redirect | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<RedirectFormData>({
    from_path: '',
    to_path: '',
    status_code: 301,
    locale: 'en',
    is_active: true,
    start_date: '',
    end_date: '',
  });
  const [bulkImportText, setBulkImportText] = useState('');
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);

  const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();
  const { isOpen: isBulkImportOpen, onOpen: onBulkImportOpen, onClose: onBulkImportClose } = useDisclosure();

  const toast = useToast();
  const { showNotification } = useNotification();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    if (isOpen) {
      loadRedirects();
    }
  }, [isOpen]);

  const loadRedirects = async () => {
    setLoading(true);
    try {
      const response = await apiGet('redirects/');
      setRedirects(response.data.results || response.data);
    } catch (error) {
      showNotification('Error loading redirects', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRedirect = () => {
    setSelectedRedirect(null);
    setFormData({
      from_path: '',
      to_path: '',
      status_code: 301,
      locale: 'en',
      is_active: true,
      start_date: '',
      end_date: '',
    });
    setIsEditing(false);
    onFormOpen();
  };

  const handleEditRedirect = (redirect: Redirect) => {
    setSelectedRedirect(redirect);
    setFormData({
      from_path: redirect.from_path,
      to_path: redirect.to_path,
      status_code: redirect.status_code,
      locale: redirect.locale,
      is_active: redirect.is_active,
      start_date: redirect.start_date || '',
      end_date: redirect.end_date || '',
    });
    setIsEditing(true);
    onFormOpen();
  };

  const handleSaveRedirect = async () => {
    try {
      if (isEditing && selectedRedirect) {
        const response = await apiPut(`redirects/${selectedRedirect.id}/`, formData);
        setRedirects(prev => prev.map(r => r.id === selectedRedirect.id ? response.data : r));
        showNotification('Redirect updated successfully', 'success');
      } else {
        const response = await apiPost('redirects/', formData);
        setRedirects(prev => [response.data, ...prev]);
        showNotification('Redirect created successfully', 'success');
      }
      onFormClose();
    } catch (error) {
      showNotification('Error saving redirect', 'error');
    }
  };

  const handleDeleteRedirect = async (redirectId: string) => {
    try {
              await apiDelete(`redirects/${redirectId}/`);
      setRedirects(prev => prev.filter(r => r.id !== redirectId));
      showNotification('Redirect deleted successfully', 'success');
    } catch (error) {
      showNotification('Error deleting redirect', 'error');
    }
  };

  const handleBulkImport = async () => {
    if (!bulkImportText.trim()) {
      showNotification('Please enter redirect data', 'error');
      return;
    }

    setImporting(true);
    setImportProgress(0);

    try {
      // Parse the bulk import text
      const lines = bulkImportText.trim().split('\n');
      const redirects = lines
        .filter(line => line.trim())
        .map((line, index) => {
          const [from_path, to_path, status_code = '301', locale = 'en'] = line.split(',').map(s => s.trim());
          return {
            from_path,
            to_path,
            status_code: parseInt(status_code),
            locale,
          };
        });

      // Validate the data
      const validRedirects = redirects.filter(r => r.from_path && r.to_path);
      
      if (validRedirects.length === 0) {
        showNotification('No valid redirects found in the input', 'error');
        return;
      }

      // Import redirects in batches
      const batchSize = 10;
      const totalBatches = Math.ceil(validRedirects.length / batchSize);
      
      for (let i = 0; i < totalBatches; i++) {
        const batch = validRedirects.slice(i * batchSize, (i + 1) * batchSize);
        
        const promises = batch.map(redirect => 
          apiPost('redirects/', {
            ...redirect,
            is_active: true,
            start_date: '',
            end_date: '',
          })
        );

        await Promise.all(promises);
        setImportProgress(((i + 1) / totalBatches) * 100);
      }

      await loadRedirects(); // Reload the list
      showNotification(`${validRedirects.length} redirects imported successfully`, 'success');
      onBulkImportClose();
      setBulkImportText('');
    } catch (error) {
      showNotification('Error importing redirects', 'error');
    } finally {
      setImporting(false);
      setImportProgress(0);
    }
  };

  const handleExportRedirects = () => {
    const csvContent = [
      'From Path,To Path,Status Code,Locale,Active,Start Date,End Date',
      ...redirects.map(r => 
        `${r.from_path},${r.to_path},${r.status_code},${r.locale},${r.is_active},${r.start_date || ''},${r.end_date || ''}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'redirects.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    showNotification('Redirects exported successfully', 'success');
  };

  const filteredRedirects = redirects.filter(redirect => {
    const matchesSearch = redirect.from_path.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         redirect.to_path.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || redirect.status_code.toString() === statusFilter;
    const matchesLocale = localeFilter === 'all' || redirect.locale === localeFilter;
    return matchesSearch && matchesStatus && matchesLocale;
  });

  const getStatusColor = (statusCode: number) => {
    if (statusCode === 301) return 'blue';
    if (statusCode === 302) return 'green';
    if (statusCode === 307) return 'orange';
    if (statusCode === 308) return 'purple';
    return 'gray';
  };

  const getStatusText = (statusCode: number) => {
    switch (statusCode) {
      case 301: return 'Permanent';
      case 302: return 'Temporary';
      case 307: return 'Temporary (Preserve Method)';
      case 308: return 'Permanent (Preserve Method)';
      default: return 'Unknown';
    }
  };

  const renderRedirectForm = () => (
    <Modal isOpen={isFormOpen} onClose={onFormClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {isEditing ? 'Edit Redirect' : 'Create New Redirect'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>From Path</FormLabel>
              <Input
                value={formData.from_path}
                onChange={(e) => setFormData(prev => ({ ...prev, from_path: e.target.value }))}
                placeholder="/old-page"
              />
            </FormControl>
            
            <FormControl isRequired>
              <FormLabel>To Path</FormLabel>
              <Input
                value={formData.to_path}
                onChange={(e) => setFormData(prev => ({ ...prev, to_path: e.target.value }))}
                placeholder="/new-page or https://example.com"
              />
            </FormControl>
            
            <FormControl isRequired>
              <FormLabel>Status Code</FormLabel>
              <Select
                value={formData.status_code}
                onChange={(e) => setFormData(prev => ({ ...prev, status_code: parseInt(e.target.value) }))}
              >
                <option value={301}>301 - Permanent Redirect</option>
                <option value={302}>302 - Temporary Redirect</option>
                <option value={307}>307 - Temporary Redirect (Preserve Method)</option>
                <option value={308}>308 - Permanent Redirect (Preserve Method)</option>
              </Select>
            </FormControl>
            
            <FormControl>
              <FormLabel>Locale</FormLabel>
              <Select
                value={formData.locale}
                onChange={(e) => setFormData(prev => ({ ...prev, locale: e.target.value as any }))}
              >
                <option value="en">English</option>
                <option value="ru">Russian</option>
                <option value="zh">Chinese</option>
              </Select>
            </FormControl>
            
            <HStack spacing={4}>
              <FormControl>
                <FormLabel>Active</FormLabel>
                <Switch
                  isChecked={formData.is_active}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                />
              </FormControl>
            </HStack>
            
            <HStack spacing={4} w="100%">
              <FormControl>
                <FormLabel>Start Date (Optional)</FormLabel>
                <Input
                  type="datetime-local"
                  value={formData.start_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>End Date (Optional)</FormLabel>
                <Input
                  type="datetime-local"
                  value={formData.end_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                />
              </FormControl>
            </HStack>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onFormClose}>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={handleSaveRedirect}>
            {isEditing ? 'Update' : 'Create'} Redirect
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  const renderBulkImportModal = () => (
    <Modal isOpen={isBulkImportOpen} onClose={onBulkImportClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Bulk Import Redirects</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <Alert status="info">
              <AlertIcon />
              <Box>
                <AlertTitle>Import Format</AlertTitle>
                <AlertDescription>
                  Enter one redirect per line in the format: from_path, to_path, status_code, locale
                  <br />
                  Example: /old-page,/new-page,301,en
                </AlertDescription>
              </Box>
            </Alert>
            
            <FormControl>
              <FormLabel>Redirect Data</FormLabel>
              <Textarea
                value={bulkImportText}
                onChange={(e) => setBulkImportText(e.target.value)}
                placeholder="/old-page,/new-page,301,en&#10;/old-blog,/new-blog,302,en&#10;/old-product,/new-product,301,en"
                rows={10}
              />
            </FormControl>
            
            {importing && (
              <Box w="100%">
                <Text mb={2}>Importing redirects...</Text>
                <Progress value={importProgress} colorScheme="blue" />
              </Box>
            )}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onBulkImportClose}>
            Cancel
          </Button>
          <Button 
            colorScheme="blue" 
            onClick={handleBulkImport}
            isLoading={importing}
            loadingText="Importing..."
          >
            Import Redirects
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent maxW="90vw" h="90vh">
        <ModalHeader>
          <Flex justify="space-between" align="center">
            <VStack align="start" spacing={1}>
              <Heading size="lg">Redirect Manager</Heading>
              <Text color="gray.600">
                {redirects.length} redirects • Manage URL redirects
              </Text>
            </VStack>
            <HStack spacing={3}>
              <Button
                leftIcon={<ArrowDownTrayIcon className="w-4 h-4" />}
                variant="outline"
                onClick={handleExportRedirects}
              >
                Export
              </Button>
              <Button
                leftIcon={<ArrowUpTrayIcon className="w-4 h-4" />}
                variant="outline"
                onClick={onBulkImportOpen}
              >
                Bulk Import
              </Button>
              <Button
                leftIcon={<PlusIcon className="w-4 h-4" />}
                colorScheme="blue"
                onClick={handleCreateRedirect}
              >
                Create Redirect
              </Button>
              <IconButton
                icon={<XMarkIcon className="w-4 h-4" />}
                variant="ghost"
                onClick={onClose}
              />
            </HStack>
          </Flex>
        </ModalHeader>
        
        <ModalBody p={6} overflowY="auto">
          <VStack spacing={6} align="stretch">
            {/* Filters */}
            <Card>
              <CardBody>
                <HStack spacing={4}>
                  <InputGroup>
                    <InputLeftElement>
                      <MagnifyingGlassIcon className="w-4 h-4" />
                    </InputLeftElement>
                    <Input
                      placeholder="Search redirects..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                  
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    w="150px"
                  >
                    <option value="all">All Status</option>
                    <option value="301">301 - Permanent</option>
                    <option value="302">302 - Temporary</option>
                    <option value="307">307 - Temp (Preserve)</option>
                    <option value="308">308 - Perm (Preserve)</option>
                  </Select>
                  
                  <Select
                    value={localeFilter}
                    onChange={(e) => setLocaleFilter(e.target.value)}
                    w="120px"
                  >
                    <option value="all">All Locales</option>
                    <option value="en">English</option>
                    <option value="ru">Russian</option>
                    <option value="zh">Chinese</option>
                  </Select>
                </HStack>
              </CardBody>
            </Card>

            {/* Redirects Table */}
            <Card>
              <CardBody>
                {filteredRedirects.length === 0 ? (
                  <Alert status="info">
                    <AlertIcon />
                    <Box>
                      <AlertTitle>No redirects found</AlertTitle>
                      <AlertDescription>
                        {searchTerm || statusFilter !== 'all' || localeFilter !== 'all'
                          ? 'Try adjusting your search or filters'
                          : 'Create your first redirect to get started'
                        }
                      </AlertDescription>
                    </Box>
                  </Alert>
                ) : (
                  <Box overflowX="auto">
                    <Table variant="simple" size="sm">
                      <Thead>
                        <Tr>
                          <Th>From Path</Th>
                          <Th>To Path</Th>
                          <Th>Status</Th>
                          <Th>Locale</Th>
                          <Th>Active</Th>
                          <Th>Dates</Th>
                          <Th>Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {filteredRedirects.map(redirect => (
                          <Tr key={redirect.id}>
                            <Td>
                              <Text fontWeight="medium" fontSize="sm">
                                {redirect.from_path}
                              </Text>
                            </Td>
                            <Td>
                              <Text fontSize="sm" color="gray.600">
                                {redirect.to_path}
                              </Text>
                            </Td>
                            <Td>
                              <Badge colorScheme={getStatusColor(redirect.status_code)} size="sm">
                                {redirect.status_code} - {getStatusText(redirect.status_code)}
                              </Badge>
                            </Td>
                            <Td>
                              <Badge variant="subtle" size="sm">
                                {redirect.locale}
                              </Badge>
                            </Td>
                            <Td>
                              {redirect.is_active ? (
                                <Badge colorScheme="green" size="sm">Active</Badge>
                              ) : (
                                <Badge colorScheme="red" size="sm">Inactive</Badge>
                              )}
                            </Td>
                            <Td>
                              <VStack align="start" spacing={0}>
                                {redirect.start_date && (
                                  <Text fontSize="xs" color="gray.500">
                                    From: {new Date(redirect.start_date).toLocaleDateString()}
                                  </Text>
                                )}
                                {redirect.end_date && (
                                  <Text fontSize="xs" color="gray.500">
                                    To: {new Date(redirect.end_date).toLocaleDateString()}
                                  </Text>
                                )}
                              </VStack>
                            </Td>
                            <Td>
                              <HStack spacing={1}>
                                <Tooltip label="Edit">
                                  <IconButton
                                    size="sm"
                                    icon={<PencilIcon className="w-3 h-3" />}
                                    variant="ghost"
                                    onClick={() => handleEditRedirect(redirect)}
                                  />
                                </Tooltip>
                                <Tooltip label="Delete">
                                  <IconButton
                                    size="sm"
                                    icon={<TrashIcon className="w-3 h-3" />}
                                    variant="ghost"
                                    colorScheme="red"
                                    onClick={() => handleDeleteRedirect(redirect.id)}
                                  />
                                </Tooltip>
                              </HStack>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>
                )}
              </CardBody>
            </Card>
          </VStack>
        </ModalBody>

        {renderRedirectForm()}
        {renderBulkImportModal()}
      </ModalContent>
    </Modal>
  );
};

export default RedirectManager;
