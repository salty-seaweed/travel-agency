import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  IconButton,
  Badge,
  Divider,
} from '@chakra-ui/react';
import {
  Cog6ToothIcon as SettingsIcon,
  PencilIcon as EditIcon,
  EyeIcon as ViewIcon,
  ArrowDownTrayIcon as SaveIcon,
  ArrowPathIcon as RefreshIcon,
  PlusIcon,
  TrashIcon as DeleteIcon,
} from '@heroicons/react/24/outline';
import { HeroSectionEditor } from './homepage/HeroSectionEditor';
import { FeaturesEditor } from './homepage/FeaturesEditor';
import { TestimonialsEditor } from './homepage/TestimonialsEditor';
import { StatisticsEditor } from './homepage/StatisticsEditor';
import { CTASectionEditor } from './homepage/CTASectionEditor';
import { SettingsEditor } from './homepage/SettingsEditor';
import { HomepagePreview } from './homepage/HomepagePreview';
import { useHomepageData } from '../../hooks/useHomepageData';
import { useHomepageManagement } from '../../hooks/useHomepageManagement';

interface HomepageAdminProps {
  onBack?: () => void;
}

export const HomepageAdmin: React.FC<HomepageAdminProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [localHomepageData, setLocalHomepageData] = useState<any>(null);
  const toast = useToast();

  const {
    data: homepageData,
    isLoading,
    error,
    refetch,
  } = useHomepageData();

  // Update local data when homepageData changes
  useEffect(() => {
    if (homepageData) {
      setLocalHomepageData(homepageData);
    }
  }, [homepageData]);

  // Check if user is authenticated
  const isAuthenticated = !!localStorage.getItem('access');

  const {
    updateHomepageData,
    isUpdating,
    updateError,
  } = useHomepageManagement();

  const handleSave = async () => {
    try {
      await updateHomepageData(localHomepageData);
      setHasUnsavedChanges(false);
      
      // Update the local state to match what was saved
      setLocalHomepageData(localHomepageData);
      
      toast({
        title: 'Success',
        description: 'Homepage updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update homepage',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleTabChange = (index: number) => {
    if (hasUnsavedChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to switch tabs?')) {
        setActiveTab(index);
        setHasUnsavedChanges(false);
      }
    } else {
      setActiveTab(index);
    }
  };

  const handleContentChange = (section: string, data: any) => {
    setLocalHomepageData((prev: any) => ({
      ...prev,
      [section]: data
    }));
    setHasUnsavedChanges(true);
  };

  if (!isAuthenticated) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="400px">
        <VStack spacing={6}>
          <Text fontSize="xl" fontWeight="bold" color="gray.600">
            Authentication Required
          </Text>
          <Text color="gray.500" textAlign="center">
            Please log in to access the homepage management panel.
          </Text>
          <Button
            colorScheme="blue"
            onClick={() => window.location.href = '/ttm/login'}
          >
            Go to Login
          </Button>
        </VStack>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="400px">
        <VStack spacing={4}>
          <Spinner size="xl" />
          <Text>Loading homepage data...</Text>
        </VStack>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={6}>
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Error loading homepage data!</AlertTitle>
          <AlertDescription>
            {error.message || 'Failed to load homepage data. Please try again.'}
          </AlertDescription>
        </Alert>
        <Button mt={4} onClick={() => refetch()}>
          Retry
        </Button>
      </Box>
    );
  }

  if (isPreviewMode) {
    return (
      <HomepagePreview
        data={localHomepageData || homepageData}
        onBack={() => setIsPreviewMode(false)}
        onEdit={() => setIsPreviewMode(false)}
      />
    );
  }

  return (
    <Box bg="gray.50" minH="100vh">
      <Container maxW="7xl" py={8}>
        {/* Header */}
        <VStack spacing={6} align="stretch">
          <HStack justify="space-between" align="center">
            <VStack align="start" spacing={2}>
              <Text fontSize="3xl" fontWeight="bold" color="gray.800">
                Homepage Management
              </Text>
              <Text color="gray.600">
                Manage your homepage content, hero section, features, testimonials, and more
              </Text>
            </VStack>
            
            <HStack spacing={4}>
              <Button
                leftIcon={<ViewIcon className="w-5 h-5" />}
                variant="outline"
                onClick={() => setIsPreviewMode(true)}
              >
                Preview
              </Button>
              
              <Button
                leftIcon={<RefreshIcon className="w-5 h-5" />}
                variant="outline"
                onClick={() => refetch()}
                isLoading={isLoading}
              >
                Refresh
              </Button>
              
              <Button
                leftIcon={<SaveIcon className="w-5 h-5" />}
                colorScheme="blue"
                onClick={handleSave}
                isLoading={isUpdating}
                isDisabled={!hasUnsavedChanges}
              >
                Save Changes
              </Button>
            </HStack>
          </HStack>

          {hasUnsavedChanges && (
            <Alert status="warning">
              <AlertIcon />
              <AlertTitle>Unsaved Changes</AlertTitle>
              <AlertDescription>
                You have unsaved changes. Click "Save Changes" to persist your updates.
              </AlertDescription>
            </Alert>
          )}

          {updateError && (
            <Alert status="error">
              <AlertIcon />
              <AlertTitle>Update Error</AlertTitle>
              <AlertDescription>
                {updateError.message || 'Failed to update homepage data.'}
              </AlertDescription>
            </Alert>
          )}

          <Divider />
        </VStack>

        {/* Main Content */}
        <Box mt={8}>
          <Tabs index={activeTab} onChange={handleTabChange} variant="enclosed">
            <TabList>
              <Tab>
                <HStack spacing={2}>
                  <SettingsIcon className="w-4 h-4" />
                  <Text>Hero Section</Text>
                </HStack>
              </Tab>
              <Tab>
                <HStack spacing={2}>
                  <EditIcon className="w-4 h-4" />
                  <Text>Features</Text>
                  {(localHomepageData?.features || homepageData?.features) && (localHomepageData?.features || homepageData?.features).length > 0 && (
                    <Badge colorScheme="blue" variant="subtle">
                      {(localHomepageData?.features || homepageData?.features).length}
                    </Badge>
                  )}
                </HStack>
              </Tab>
              <Tab>
                <HStack spacing={2}>
                  <EditIcon className="w-4 h-4" />
                  <Text>Testimonials</Text>
                  {(localHomepageData?.testimonials || homepageData?.testimonials) && (localHomepageData?.testimonials || homepageData?.testimonials).length > 0 && (
                    <Badge colorScheme="green" variant="subtle">
                      {(localHomepageData?.testimonials || homepageData?.testimonials).length}
                    </Badge>
                  )}
                </HStack>
              </Tab>
              <Tab>
                <HStack spacing={2}>
                  <EditIcon className="w-4 h-4" />
                  <Text>Statistics</Text>
                  {(localHomepageData?.statistics || homepageData?.statistics) && (localHomepageData?.statistics || homepageData?.statistics).length > 0 && (
                    <Badge colorScheme="purple" variant="subtle">
                      {(localHomepageData?.statistics || homepageData?.statistics).length}
                    </Badge>
                  )}
                </HStack>
              </Tab>
              <Tab>
                <HStack spacing={2}>
                  <EditIcon className="w-4 h-4" />
                  <Text>CTA Section</Text>
                </HStack>
              </Tab>
              <Tab>
                <HStack spacing={2}>
                  <SettingsIcon className="w-4 h-4" />
                  <Text>Settings</Text>
                </HStack>
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <HeroSectionEditor
                  data={localHomepageData?.hero || homepageData?.hero}
                  onChange={(data) => handleContentChange('hero', data)}
                />
              </TabPanel>
              
              <TabPanel>
                <FeaturesEditor
                  data={localHomepageData?.features || homepageData?.features}
                  onChange={(data) => handleContentChange('features', data)}
                />
              </TabPanel>
              
              <TabPanel>
                <TestimonialsEditor
                  data={localHomepageData?.testimonials || homepageData?.testimonials}
                  onChange={(data) => handleContentChange('testimonials', data)}
                />
              </TabPanel>
              
              <TabPanel>
                <StatisticsEditor
                  data={localHomepageData?.statistics || homepageData?.statistics}
                  onChange={(data) => handleContentChange('statistics', data)}
                />
              </TabPanel>
              
              <TabPanel>
                <CTASectionEditor
                  data={localHomepageData?.cta_section || homepageData?.cta_section}
                  onChange={(data) => handleContentChange('cta_section', data)}
                />
              </TabPanel>
              
              <TabPanel>
                <SettingsEditor
                  data={localHomepageData?.settings || homepageData?.settings}
                  onChange={(data) => handleContentChange('settings', data)}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
    </Box>
  );
}; 