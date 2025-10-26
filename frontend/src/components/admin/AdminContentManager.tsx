import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Card,
  CardBody,
  CardHeader,
  Heading,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  DocumentTextIcon,
  PhotoIcon,
  Bars3Icon,
  ArrowPathIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { PageList } from './cms/PageList';
import { PageEditor } from './cms/PageEditor';
import { MediaLibrary } from './cms/MediaLibrary';
import MenuManager from './cms/MenuManager';
import RedirectManager from './cms/RedirectManager';
import { PageHeroManager } from './PageHeroManager';
import type { Page } from '../../types';
import { AdvancedPageEditor } from './cms/AdvancedPageEditor';

export const AdminContentManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [isAdvancedEditorOpen, setIsAdvancedEditorOpen] = useState(false);
  const [selectedPageForAdvanced, setSelectedPageForAdvanced] = useState<Page | null>(null);
  
  const { isOpen: isPageModalOpen, onOpen: onPageModalOpen, onClose: onPageModalClose } = useDisclosure();
  const { isOpen: isMediaModalOpen, onOpen: onMediaModalOpen, onClose: onMediaModalClose } = useDisclosure();
  const { isOpen: isMenuModalOpen, onOpen: onMenuModalOpen, onClose: onMenuModalClose } = useDisclosure();
  const { isOpen: isRedirectModalOpen, onOpen: onRedirectModalOpen, onClose: onRedirectModalClose } = useDisclosure();
  const { isOpen: isPageHeroModalOpen, onOpen: onPageHeroModalOpen, onClose: onPageHeroModalClose } = useDisclosure();
  
  const bgColor = useColorModeValue('white', 'gray.800');

  const handleCreatePage = () => {
    setSelectedPage(null);
    setIsEditing(false);
    setIsViewing(false);
    onPageModalOpen();
  };

  const handleEditPage = (page: Page) => {
    setSelectedPage(page);
    setIsEditing(true);
    setIsViewing(false);
    onPageModalOpen();
  };

  const handleViewPage = (page: Page) => {
    setSelectedPage(page);
    setIsEditing(false);
    setIsViewing(true);
    onPageModalOpen();
  };

  const handlePageSave = (page: Page) => {
    onPageModalClose();
    // Refresh the page list
    // This will be handled by the PageList component
  };

  const handlePageCancel = () => {
    onPageModalClose();
  };

  const handleRefresh = () => {
    // This will trigger a refresh in the PageList component
    // The PageList component handles its own data loading
  };

  const handleAdvancedEdit = (page: Page) => {
    setSelectedPageForAdvanced(page);
    setIsAdvancedEditorOpen(true);
  };

  const handleAdvancedSave = (page: Page) => {
    // Handle saving from advanced editor
    console.log('Advanced editor save:', page);
    setIsAdvancedEditorOpen(false);
    setSelectedPageForAdvanced(null);
    // Refresh the page list
    // This will be handled by the PageList component
  };

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <HStack justify="space-between">
          <VStack align="start" spacing={1}>
            <Heading size="lg">Content Management</Heading>
            <Text color="gray.600">Manage pages, media, menus, redirects, and page hero banners</Text>
          </VStack>
          <HStack spacing={3}>
            <Button
              leftIcon={<PlusIcon className="w-4 h-4" />}
              colorScheme="blue"
              onClick={handleCreatePage}
            >
              Create Page
            </Button>
            <Button
              leftIcon={<PhotoIcon className="w-4 h-4" />}
              variant="outline"
              onClick={onMediaModalOpen}
            >
              Media Library
            </Button>
            <Button
              leftIcon={<Bars3Icon className="w-4 h-4" />}
              variant="outline"
              onClick={onMenuModalOpen}
            >
              Menu Manager
            </Button>
            <Button
              leftIcon={<ArrowPathIcon className="w-4 h-4" />}
              variant="outline"
              onClick={onRedirectModalOpen}
            >
              Redirects
            </Button>
            <Button
              leftIcon={<SparklesIcon className="w-4 h-4" />}
              variant="outline"
              onClick={onPageHeroModalOpen}
            >
              Page Heroes
            </Button>
          </HStack>
        </HStack>

        {/* Main Content */}
        <Tabs index={activeTab} onChange={setActiveTab}>
          <TabList>
            <Tab>
              <HStack spacing={2}>
                <DocumentTextIcon className="w-4 h-4" />
                <Text>Pages</Text>
              </HStack>
            </Tab>
            <Tab>
              <HStack spacing={2}>
                <PhotoIcon className="w-4 h-4" />
                <Text>Media</Text>
              </HStack>
            </Tab>
            <Tab>
              <HStack spacing={2}>
                <Bars3Icon className="w-4 h-4" />
                <Text>Menus</Text>
              </HStack>
            </Tab>
            <Tab>
              <HStack spacing={2}>
                <ArrowPathIcon className="w-4 h-4" />
                <Text>Redirects</Text>
              </HStack>
            </Tab>
            <Tab>
              <HStack spacing={2}>
                <SparklesIcon className="w-4 h-4" />
                <Text>Page Heroes</Text>
              </HStack>
            </Tab>
          </TabList>

          <TabPanels>
            {/* Pages Tab */}
            <TabPanel>
              <PageList
                onEditPage={handleEditPage}
                onViewPage={handleViewPage}
                onCreatePage={handleCreatePage}
                onAdvancedEditPage={handleAdvancedEdit}
              />
            </TabPanel>

            {/* Media Tab */}
            <TabPanel>
              <Card>
                <CardBody>
                  <VStack spacing={4}>
                    <Text>Media management is available through the Media Library button above.</Text>
                    <Button
                      leftIcon={<PhotoIcon className="w-4 h-4" />}
                      colorScheme="blue"
                      onClick={onMediaModalOpen}
                    >
                      Open Media Library
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            </TabPanel>

            {/* Menus Tab */}
            <TabPanel>
              <Card>
                <CardBody>
                  <VStack spacing={4}>
                    <Text>Menu management is available through the Menu Manager button above.</Text>
                    <Button
                      leftIcon={<Bars3Icon className="w-4 h-4" />}
                      colorScheme="blue"
                      onClick={onMenuModalOpen}
                    >
                      Open Menu Manager
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            </TabPanel>

            {/* Redirects Tab */}
            <TabPanel>
              <Card>
                <CardBody>
                  <VStack spacing={4}>
                    <Text>Redirect management is available through the Redirects button above.</Text>
                    <Button
                      leftIcon={<ArrowPathIcon className="w-4 h-4" />}
                      colorScheme="blue"
                      onClick={onRedirectModalOpen}
                    >
                      Open Redirect Manager
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            </TabPanel>

            {/* Page Heroes Tab */}
            <TabPanel>
              <Card>
                <CardBody>
                  <VStack spacing={4}>
                    <Text>Page hero management is available through the Page Heroes button above.</Text>
                    <Button
                      leftIcon={<SparklesIcon className="w-4 h-4" />}
                      colorScheme="blue"
                      onClick={onPageHeroModalOpen}
                    >
                      Open Page Hero Manager
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>

      {/* Page Editor/Viewer Modal */}
      <Modal isOpen={isPageModalOpen} onClose={onPageModalClose} size="6xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {isViewing ? 'View Page' : (selectedPage ? 'Edit Page' : 'Create New Page')}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isViewing ? (
              <Box>
                <VStack spacing={4} align="stretch">
                  <Card>
                    <CardBody>
                      <VStack spacing={4} align="start">
                        <Heading size="md">{selectedPage?.title}</Heading>
                        <Text color="gray.600">Slug: /{selectedPage?.slug}/</Text>
                        <Text color="gray.600">Status: {selectedPage?.status}</Text>
                        <Text color="gray.600">Language: {selectedPage?.locale}</Text>
                        <Text color="gray.600">Template: {selectedPage?.template}</Text>
                      </VStack>
                    </CardBody>
                  </Card>
                  <Card>
                    <CardHeader>
                      <Heading size="md">Content</Heading>
                    </CardHeader>
                    <CardBody>
                      <Box
                        dangerouslySetInnerHTML={{ __html: selectedPage?.content || '' }}
                        className="prose max-w-none"
                      />
                    </CardBody>
                  </Card>
                </VStack>
              </Box>
            ) : (
              <PageEditor
                pageId={selectedPage?.id?.toString()}
                onSave={handlePageSave}
                onCancel={handlePageCancel}
              />
            )}
          </ModalBody>
          <ModalFooter>
            {isViewing && (
              <HStack spacing={3}>
                <Button
                  leftIcon={<PencilIcon className="w-4 h-4" />}
                  colorScheme="blue"
                  onClick={() => {
                    setIsViewing(false);
                    setIsEditing(true);
                  }}
                >
                  Edit Page
                </Button>
                <Button variant="ghost" onClick={onPageModalClose}>
                  Close
                </Button>
              </HStack>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Advanced Page Editor Modal */}
      <Modal
        isOpen={isAdvancedEditorOpen}
        onClose={() => setIsAdvancedEditorOpen(false)}
        size="full"
      >
        <ModalOverlay />
        <ModalContent maxW="100vw" maxH="100vh" m={0}>
          <ModalCloseButton zIndex={10} />
          <AdvancedPageEditor
            pageId={selectedPageForAdvanced?.id?.toString()}
            onSave={handleAdvancedSave}
            onCancel={() => setIsAdvancedEditorOpen(false)}
          />
        </ModalContent>
      </Modal>

      {/* Media Library Modal */}
      <Modal isOpen={isMediaModalOpen} onClose={onMediaModalClose} size="6xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Media Library</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <MediaLibrary />
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Menu Manager Modal */}
      <Modal isOpen={isMenuModalOpen} onClose={onMenuModalClose} size="6xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Menu Manager</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <MenuManager />
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Redirect Manager Modal */}
      <Modal isOpen={isRedirectModalOpen} onClose={onRedirectModalClose} size="6xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Redirect Manager</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <RedirectManager
              isOpen={isRedirectModalOpen}
              onClose={onRedirectModalClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Page Hero Manager Modal */}
      <PageHeroManager
        isOpen={isPageHeroModalOpen}
        onClose={onPageHeroModalClose}
      />
    </Box>
  );
}; 