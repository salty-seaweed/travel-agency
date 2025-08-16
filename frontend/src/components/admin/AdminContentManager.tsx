import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Button,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Badge,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Grid,
  GridItem,
  useDisclosure,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Divider,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useColorModeValue,
  Tooltip,
  Avatar,
  AvatarGroup,
  Progress,
  Switch,
  FormControl,
  FormLabel,
  Textarea,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  ArrowUpTrayIcon,
  DocumentTextIcon,
  PhotoIcon,
  Squares2X2Icon,
  CursorArrowRaysIcon,
  QuestionMarkCircleIcon,
  BuildingOffice2Icon,
  GiftIcon,
  MapIcon,
  ClipboardDocumentListIcon,
  GlobeAltIcon,
  Bars3Icon,
  ArrowPathIcon,
  CalendarIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ArchiveBoxIcon,
} from '@heroicons/react/24/outline';
import { apiGet, apiPost, apiPut, apiDelete } from '../../api';
import type { Page, MediaAsset, Menu as MenuType, Redirect, BlockType } from '../../types';
import { BLOCK_DEFINITIONS } from '../../types';
import { useNotification } from '../../hooks/useNotification';
import { LoadingSpinner } from '../LoadingSpinner';
import PageEditor from './cms/PageEditor';
import MediaLibrary from './cms/MediaLibrary';
import MenuManager from './cms/MenuManager';
import RedirectManager from './cms/RedirectManager';
import PageForm from './cms/PageForm';

interface ContentStats {
  total_pages: number;
  published_pages: number;
  draft_pages: number;
  total_media: number;
  total_menus: number;
  total_redirects: number;
  recent_activity: Array<{
    type: string;
    title: string;
    user: string;
    timestamp: string;
  }>;
}

const AdminContentManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('pages');
  const [pages, setPages] = useState<Page[]>([]);
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [menus, setMenus] = useState<MenuType[]>([]);
  const [redirects, setRedirects] = useState<Redirect[]>([]);
  const [stats, setStats] = useState<ContentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [localeFilter, setLocaleFilter] = useState('all');
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const { isOpen: isPageFormOpen, onOpen: onPageFormOpen, onClose: onPageFormClose } = useDisclosure();
  const { isOpen: isPageEditorOpen, onOpen: onPageEditorOpen, onClose: onPageEditorClose } = useDisclosure();
  const { isOpen: isMediaLibraryOpen, onOpen: onMediaLibraryOpen, onClose: onMediaLibraryClose } = useDisclosure();
  const { isOpen: isMenuManagerOpen, onOpen: onMenuManagerOpen, onClose: onMenuManagerClose } = useDisclosure();
  const { isOpen: isRedirectManagerOpen, onOpen: onRedirectManagerOpen, onClose: onRedirectManagerClose } = useDisclosure();
  
  const toast = useToast();
  const { showNotification } = useNotification();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [pagesRes, mediaRes, menusRes, redirectsRes, statsRes] = await Promise.all([
        apiGet('pages/'),
        apiGet('media/'),
        apiGet('menus/'),
        apiGet('redirects/'),
        apiGet('analytics/content-stats/'),
      ]);
      
      console.log('Pages response:', pagesRes);
      console.log('Pages data:', pagesRes.data);
      
      // Handle paginated response from Django REST Framework
      const pagesData = pagesRes.results || pagesRes.data || [];
      console.log('Pages data after handling pagination:', pagesData);
      
      setPages(pagesData);
      setMedia(mediaRes.results || mediaRes.data || []);
      setMenus(menusRes.results || menusRes.data || []);
      setRedirects(redirectsRes.results || redirectsRes.data || []);
      setStats(statsRes.data || null);
    } catch (error) {
      console.error('Error loading data:', error);
      showNotification('Error loading content data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePage = () => {
    setSelectedPage(null);
    setIsEditing(false);
    onPageFormOpen();
  };

  const handleEditPage = (page: Page) => {
    setSelectedPage(page);
    setIsEditing(true);
    onPageFormOpen();
  };

  const handleOpenEditor = (page: Page) => {
    setSelectedPage(page);
    onPageEditorOpen();
  };

  const handleDuplicatePage = async (page: Page) => {
    try {
      const response = await apiPost(`pages/${page.id}/duplicate/`, {});
      const newPage = response.data || response;
      setPages(prev => [newPage, ...prev]);
      showNotification('Page duplicated successfully', 'success');
    } catch (error) {
      showNotification('Error duplicating page', 'error');
    }
  };

  const handleDeletePage = async (pageId: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return;
    
    try {
      await apiDelete(`pages/${pageId}/`);
      setPages(prev => prev.filter(p => p.id !== pageId));
      showNotification('Page deleted successfully', 'success');
    } catch (error) {
      showNotification('Error deleting page', 'error');
    }
  };

  const handlePublishPage = async (pageId: string) => {
    try {
      await apiPost(`pages/${pageId}/publish/`, {});
      setPages(prev => prev.map(p => 
        p.id === pageId ? { ...p, status: 'published' as const } : p
      ));
      showNotification('Page published successfully', 'success');
    } catch (error) {
      showNotification('Error publishing page', 'error');
    }
  };

  const filteredPages = pages.filter(page => {
    // Check if page exists and has required properties
    if (!page || !page.title || !page.path) {
      return false;
    }
    
    const matchesSearch = page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         page.path.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || page.status === statusFilter;
    const matchesLocale = localeFilter === 'all' || page.locale === localeFilter;
    return matchesSearch && matchesStatus && matchesLocale;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'green';
      case 'draft': return 'gray';
      case 'in_review': return 'yellow';
      case 'approved': return 'blue';
      case 'scheduled': return 'purple';
      case 'archived': return 'red';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published': return <CheckCircleIcon className="w-4 h-4" />;
      case 'draft': return <DocumentTextIcon className="w-4 h-4" />;
      case 'in_review': return <ExclamationTriangleIcon className="w-4 h-4" />;
      case 'approved': return <CheckCircleIcon className="w-4 h-4" />;
      case 'scheduled': return <CalendarIcon className="w-4 h-4" />;
      case 'archived': return <ArchiveBoxIcon className="w-4 h-4" />;
      default: return <DocumentTextIcon className="w-4 h-4" />;
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center">
          <VStack align="start" spacing={1}>
            <Heading size="lg">Content Manager</Heading>
            <Text color="gray.600">Manage pages, media, menus, and redirects</Text>
          </VStack>
          <Button
            leftIcon={<PlusIcon className="w-4 h-4" />}
            colorScheme="blue"
            onClick={handleCreatePage}
          >
            Create Page
          </Button>
        </Flex>

        {/* Stats Cards */}
        {stats && (
          <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={4}>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Total Pages</StatLabel>
                  <StatNumber>{stats.total_pages}</StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    {stats.published_pages} published
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Media Assets</StatLabel>
                  <StatNumber>{stats.total_media}</StatNumber>
                  <StatHelpText>Images, videos, documents</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Menus</StatLabel>
                  <StatNumber>{stats.total_menus}</StatNumber>
                  <StatHelpText>Navigation menus</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Redirects</StatLabel>
                  <StatNumber>{stats.total_redirects}</StatNumber>
                  <StatHelpText>URL redirects</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </Grid>
        )}

        {/* Main Content */}
        <Card>
          <CardHeader>
            <Tabs index={['pages', 'media', 'menus', 'redirects'].indexOf(activeTab)} onChange={(index) => setActiveTab(['pages', 'media', 'menus', 'redirects'][index])}>
              <TabList>
                <Tab>
                  <HStack spacing={2}>
                    <DocumentTextIcon className="w-4 h-4" />
                    <Text>Pages</Text>
                    <Badge colorScheme="blue" variant="subtle">
                      {pages.length}
                    </Badge>
                  </HStack>
                </Tab>
                <Tab>
                  <HStack spacing={2}>
                    <PhotoIcon className="w-4 h-4" />
                    <Text>Media</Text>
                    <Badge colorScheme="green" variant="subtle">
                      {media.length}
                    </Badge>
                  </HStack>
                </Tab>
                <Tab>
                  <HStack spacing={2}>
                    <Bars3Icon className="w-4 h-4" />
                    <Text>Menus</Text>
                    <Badge colorScheme="purple" variant="subtle">
                      {menus.length}
                    </Badge>
                  </HStack>
                </Tab>
                <Tab>
                  <HStack spacing={2}>
                    <ArrowPathIcon className="w-4 h-4" />
                    <Text>Redirects</Text>
                    <Badge colorScheme="orange" variant="subtle">
                      {redirects.length}
                    </Badge>
                  </HStack>
                </Tab>
              </TabList>

              <TabPanels>
                {/* Pages Tab */}
                <TabPanel>
                  <VStack spacing={4} align="stretch">
                    {/* Filters */}
                    <HStack spacing={4}>
                      <InputGroup maxW="300px">
                        <InputLeftElement>
                          <MagnifyingGlassIcon className="w-4 h-4" />
                        </InputLeftElement>
                        <Input
                          placeholder="Search pages..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </InputGroup>
                      <Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        maxW="150px"
                      >
                        <option value="all">All Status</option>
                        <option value="draft">Draft</option>
                        <option value="in_review">In Review</option>
                        <option value="approved">Approved</option>
                        <option value="published">Published</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="archived">Archived</option>
                      </Select>
                      <Select
                        value={localeFilter}
                        onChange={(e) => setLocaleFilter(e.target.value)}
                        maxW="150px"
                      >
                        <option value="all">All Locales</option>
                        <option value="en">English</option>
                        <option value="ru">Russian</option>
                        <option value="zh">Chinese</option>
                      </Select>
                    </HStack>

                    {/* Pages Table */}
                    <Box overflowX="auto">
                      <Table variant="simple">
                        <Thead>
                          <Tr>
                            <Th>Title</Th>
                            <Th>Path</Th>
                            <Th>Status</Th>
                            <Th>Locale</Th>
                            <Th>Blocks</Th>
                            <Th>Updated</Th>
                            <Th>Actions</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {filteredPages.map((page) => (
                            <Tr key={page.id}>
                              <Td>
                                <VStack align="start" spacing={1}>
                                  <Text fontWeight="medium">{page.title}</Text>
                                  {page.is_home && (
                                    <Badge size="sm" colorScheme="blue">Home</Badge>
                                  )}
                                </VStack>
                              </Td>
                              <Td>
                                <Text fontFamily="mono" fontSize="sm">
                                  {page.path}
                                </Text>
                              </Td>
                              <Td>
                                <HStack spacing={2}>
                                  {getStatusIcon(page.status)}
                                  <Badge colorScheme={getStatusColor(page.status)}>
                                    {page.status_display}
                                  </Badge>
                                </HStack>
                              </Td>
                              <Td>
                                <Badge variant="outline">{page.locale_display}</Badge>
                              </Td>
                              <Td>
                                <Text>{page.blocks.length} blocks</Text>
                              </Td>
                              <Td>
                                <Text fontSize="sm" color="gray.600">
                                  {new Date(page.updated_at).toLocaleDateString()}
                                </Text>
                              </Td>
                              <Td>
                                <HStack spacing={1}>
                                  <Tooltip label="View">
                                    <IconButton
                                      size="sm"
                                      icon={<EyeIcon className="w-4 h-4" />}
                                      aria-label="View page"
                                      variant="ghost"
                                      onClick={() => handleOpenEditor(page)}
                                    />
                                  </Tooltip>
                                  <Tooltip label="Edit">
                                    <IconButton
                                      size="sm"
                                      icon={<PencilIcon className="w-4 h-4" />}
                                      aria-label="Edit page"
                                      variant="ghost"
                                      onClick={() => handleEditPage(page)}
                                    />
                                  </Tooltip>
                                  {page.status === 'draft' && (
                                    <Tooltip label="Publish">
                                      <IconButton
                                        size="sm"
                                        icon={<ArrowUpTrayIcon className="w-4 h-4" />}
                                        aria-label="Publish page"
                                        variant="ghost"
                                        colorScheme="green"
                                        onClick={() => handlePublishPage(page.id)}
                                      />
                                    </Tooltip>
                                  )}
                                  <Menu>
                                    <MenuButton
                                      as={IconButton}
                                      size="sm"
                                      icon={<EllipsisVerticalIcon className="w-4 h-4" />}
                                      variant="ghost"
                                      aria-label="More options"
                                    />
                                    <MenuList>
                                      <MenuItem
                                        icon={<DocumentDuplicateIcon className="w-4 h-4" />}
                                        onClick={() => handleDuplicatePage(page)}
                                      >
                                        Duplicate
                                      </MenuItem>
                                      <MenuDivider />
                                      <MenuItem
                                        icon={<TrashIcon className="w-4 h-4" />}
                                        color="red.500"
                                        onClick={() => handleDeletePage(page.id)}
                                      >
                                        Delete
                                      </MenuItem>
                                    </MenuList>
                                  </Menu>
                                </HStack>
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </Box>
                  </VStack>
                </TabPanel>

                                       {/* Media Tab */}
                       <TabPanel>
                         <VStack spacing={4} align="stretch">
                           <Flex justify="space-between" align="center">
                             <VStack align="start" spacing={1}>
                               <Heading size="md">Media Library</Heading>
                               <Text color="gray.600">
                                 {media.length} assets • Manage media files
                               </Text>
                             </VStack>
                             <Button
                               leftIcon={<PlusIcon className="w-4 h-4" />}
                               colorScheme="blue"
                               onClick={onMediaLibraryOpen}
                             >
                               Open Media Library
                             </Button>
                           </Flex>
                           <Alert status="info">
                             <AlertIcon />
                             <Text>Click "Open Media Library" to manage your media assets</Text>
                           </Alert>
                         </VStack>
                       </TabPanel>

                       {/* Menus Tab */}
                       <TabPanel>
                         <VStack spacing={4} align="stretch">
                           <Flex justify="space-between" align="center">
                             <VStack align="start" spacing={1}>
                               <Heading size="md">Menu Manager</Heading>
                               <Text color="gray.600">
                                 {menus.length} menus • Manage navigation structure
                               </Text>
                             </VStack>
                             <Button
                               leftIcon={<PlusIcon className="w-4 h-4" />}
                               colorScheme="blue"
                               onClick={onMenuManagerOpen}
                             >
                               Open Menu Manager
                             </Button>
                           </Flex>
                           <Alert status="info">
                             <AlertIcon />
                             <Text>Click "Open Menu Manager" to manage your navigation menus</Text>
                           </Alert>
                         </VStack>
                       </TabPanel>

                       {/* Redirects Tab */}
                       <TabPanel>
                         <VStack spacing={4} align="stretch">
                           <Flex justify="space-between" align="center">
                             <VStack align="start" spacing={1}>
                               <Heading size="md">Redirect Manager</Heading>
                               <Text color="gray.600">
                                 {redirects.length} redirects • Manage URL redirects
                               </Text>
                             </VStack>
                             <Button
                               leftIcon={<PlusIcon className="w-4 h-4" />}
                               colorScheme="blue"
                               onClick={onRedirectManagerOpen}
                             >
                               Open Redirect Manager
                             </Button>
                           </Flex>
                           <Alert status="info">
                             <AlertIcon />
                             <Text>Click "Open Redirect Manager" to manage your URL redirects</Text>
                           </Alert>
                         </VStack>
                       </TabPanel>
              </TabPanels>
            </Tabs>
          </CardHeader>
        </Card>
      </VStack>

      {/* Page Form Modal */}
      <PageForm
        isOpen={isPageFormOpen}
        onClose={onPageFormClose}
        page={selectedPage}
        isEditing={isEditing}
                 onSave={async (pageData) => {
           try {
             if (isEditing && selectedPage) {
               await apiPut(`pages/${selectedPage.id}/`, pageData);
               setPages(prev => prev.map(p => p.id === selectedPage.id ? { ...p, ...pageData } : p));
               showNotification('Page updated successfully', 'success');
             } else {
               console.log('Creating page with data:', pageData);
               const response = await apiPost('pages/', pageData);
               console.log('Page creation response:', response);
               // For single object creation, the response should be the object itself
               const newPage = response.data || response;
               setPages(prev => [newPage, ...prev]);
               showNotification('Page created successfully', 'success');
             }
             onPageFormClose();
             loadData();
           } catch (error) {
             console.error('Error saving page:', error);
             showNotification('Error saving page', 'error');
           }
         }}
      />

                   {/* Page Editor Modal */}
      {isPageEditorOpen && selectedPage && (
        <Modal isOpen={isPageEditorOpen} onClose={onPageEditorClose} size="6xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit Page: {selectedPage.title}</ModalHeader>
            <ModalCloseButton />
            <ModalBody p={0}>
              <PageEditor
                pageId={selectedPage.id}
                onSave={async (updatedPage) => {
                  try {
                    setPages(prev => prev.map(p => p.id === selectedPage.id ? updatedPage : p));
                    showNotification('Page updated successfully', 'success');
                    onPageEditorClose();
                    loadData();
                  } catch (error) {
                    showNotification('Error saving page', 'error');
                  }
                }}
                onCancel={onPageEditorClose}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      )}

      {/* Media Library Modal */}
      {isMediaLibraryOpen && (
        <Modal isOpen={isMediaLibraryOpen} onClose={onMediaLibraryClose} size="6xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Media Library</ModalHeader>
            <ModalCloseButton />
            <ModalBody p={0}>
              <MediaLibrary />
            </ModalBody>
          </ModalContent>
        </Modal>
      )}

      {/* Menu Manager Modal */}
      {isMenuManagerOpen && (
        <Modal isOpen={isMenuManagerOpen} onClose={onMenuManagerClose} size="6xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Menu Manager</ModalHeader>
            <ModalCloseButton />
            <ModalBody p={0}>
              <MenuManager />
            </ModalBody>
          </ModalContent>
        </Modal>
      )}

      {/* Redirect Manager Modal */}
      {isRedirectManagerOpen && (
        <Modal isOpen={isRedirectManagerOpen} onClose={onRedirectManagerClose} size="6xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Redirect Manager</ModalHeader>
            <ModalCloseButton />
            <ModalBody p={0}>
              <RedirectManager />
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
           </Box>
         );
       };

       export default AdminContentManager; 