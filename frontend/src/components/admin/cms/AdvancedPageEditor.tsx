import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Button,
  Text,
  useColorModeValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Divider,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { useNotification } from '../../../hooks/useNotification';
import { apiGet, apiPost, apiPut } from '../../../api';
import type { Page } from '../../../types';

// Modular Components
import { ContentEditor } from './components/ContentEditor';
import { StyleCustomizer } from './components/StyleCustomizer';
import { LayoutBuilder } from './components/LayoutBuilder';
import { AdvancedSettings } from './components/AdvancedSettings';
import { PreviewPanel } from './components/PreviewPanel';
import { CustomCSSEditor } from './components/CustomCSSEditor';
import { ComponentLibrary } from './components/ComponentLibrary';
import { ResponsiveDesigner } from './components/ResponsiveDesigner';
import { AnimationBuilder } from './components/AnimationBuilder';
import { SEOOptimizer } from './components/SEOOptimizer';
import { DragDropEditor } from './components/DragDropEditor';
import { ImageEditor } from './components/ImageEditor';
import { FormBuilder } from './components/FormBuilder';

interface AdvancedPageEditorProps {
  pageId?: string;
  onSave?: (page: Page) => void;
  onCancel?: () => void;
}

export const AdvancedPageEditor: React.FC<AdvancedPageEditorProps> = ({
  pageId,
  onSave,
  onCancel,
}) => {
  const { showSuccess, showError } = useNotification();
  const [isLoading, setIsLoading] = useState(!!pageId);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  
  const [pageData, setPageData] = useState({
    title: '',
    slug: '',
    content: '',
    customCSS: '',
    layout: 'default',
    theme: 'default',
    animations: [],
    responsiveSettings: {},
    seoSettings: {},
    advancedSettings: {},
  });

  const [customStyles, setCustomStyles] = useState({
    colors: {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      accent: '#f59e0b',
      background: '#ffffff',
      text: '#1f2937',
    },
    typography: {
      fontFamily: 'Inter, sans-serif',
      fontSize: '16px',
      lineHeight: '1.6',
      fontWeight: '400',
    },
    spacing: {
      padding: '1rem',
      margin: '0',
      gap: '1rem',
    },
    borders: {
      radius: '0.5rem',
      width: '1px',
      style: 'solid',
      color: '#e5e7eb',
    },
    shadows: {
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    },
  });

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    if (pageId) {
      loadPage();
    }
  }, [pageId]);

  const loadPage = async () => {
    try {
      setIsLoading(true);
      const response = await apiGet(`pages/${pageId}/`);
      if (response) {
        setPageData({
          title: response.title || '',
          slug: response.slug || '',
          content: response.content || '',
          customCSS: response.custom_css || '',
          layout: response.layout || 'default',
          theme: response.theme || 'default',
          animations: response.animations || [],
          responsiveSettings: response.responsive_settings || {},
          seoSettings: response.seo_settings || {},
          advancedSettings: response.advanced_settings || {},
        });
      }
    } catch (error) {
      showError('Failed to load page');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const saveData = {
        ...pageData,
        custom_css: pageData.customCSS,
        responsive_settings: pageData.responsiveSettings,
        seo_settings: pageData.seoSettings,
        advanced_settings: pageData.advancedSettings,
      };

      if (pageId) {
        await apiPut(`pages/${pageId}/`, saveData);
      } else {
        await apiPost('pages/', saveData);
      }

      showSuccess('Page saved successfully');
      onSave?.(saveData as Page);
    } catch (error) {
      showError('Failed to save page');
    } finally {
      setIsSaving(false);
    }
  };

  const handleContentChange = (content: string) => {
    setPageData(prev => ({ ...prev, content }));
  };

  const handleCustomCSSChange = (css: string) => {
    setPageData(prev => ({ ...prev, customCSS: css }));
  };

  const handleStyleChange = (newStyles: any) => {
    setCustomStyles(prev => ({ ...prev, ...newStyles }));
  };

  const handleLayoutChange = (layout: string) => {
    setPageData(prev => ({ ...prev, layout }));
  };

  const handleAnimationChange = (animations: any[]) => {
    setPageData(prev => ({ ...prev, animations }));
  };

  const handleResponsiveChange = (settings: any) => {
    setPageData(prev => ({ ...prev, responsiveSettings: settings }));
  };

  const handleSEOChange = (settings: any) => {
    setPageData(prev => ({ ...prev, seoSettings: settings }));
  };

  const handleAdvancedChange = (settings: any) => {
    setPageData(prev => ({ ...prev, advancedSettings: settings }));
  };

  if (isLoading) {
    return (
      <Box p={6}>
        <Alert status="info">
          <AlertIcon />
          <AlertTitle>Loading...</AlertTitle>
          <AlertDescription>Please wait while we load the page editor.</AlertDescription>
        </Alert>
      </Box>
    );
  }

  return (
    <Box bg={bgColor} minH="100vh">
      {/* Header */}
      <Box
        borderBottom="1px solid"
        borderColor={borderColor}
        p={4}
        bg={bgColor}
        position="sticky"
        top={0}
        zIndex={10}
      >
        <HStack justify="space-between">
          <Heading size="lg">Advanced Page Editor</Heading>
          <HStack spacing={3}>
            <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </Button>
            <Button variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleSave}
              isLoading={isSaving}
              loadingText="Saving..."
            >
              Save Page
            </Button>
          </HStack>
        </HStack>
      </Box>

      {/* Main Content */}
      <Box display="flex" h="calc(100vh - 80px)">
        {/* Editor Panel */}
        <Box flex={showPreview ? 1 : 1} overflow="auto">
          <Tabs index={activeTab} onChange={setActiveTab} variant="enclosed">
                                    <TabList px={4} pt={4}>
                          <Tab>Content</Tab>
                          <Tab>Drag & Drop</Tab>
                          <Tab>Images</Tab>
                          <Tab>Forms</Tab>
                          <Tab>Layout</Tab>
                          <Tab>Styling</Tab>
                          <Tab>CSS</Tab>
                          <Tab>Components</Tab>
                          <Tab>Responsive</Tab>
                          <Tab>Animations</Tab>
                          <Tab>SEO</Tab>
                          <Tab>Advanced</Tab>
                        </TabList>

            <TabPanels>
              {/* Content Tab */}
              <TabPanel>
                <ContentEditor
                  content={pageData.content}
                  onChange={handleContentChange}
                  customStyles={customStyles}
                />
              </TabPanel>

                             {/* Drag & Drop Tab */}
               <TabPanel>
                 <DragDropEditor
                   content={[]}
                   onChange={(content) => {
                     console.log('Drag drop content:', content);
                     // You can integrate this with the page content here
                   }}
                 />
               </TabPanel>

              {/* Images Tab */}
              <TabPanel>
                <ImageEditor
                  onImageChange={(url, filters) => {
                    console.log('Image changed:', url, filters);
                  }}
                />
              </TabPanel>

              {/* Forms Tab */}
              <TabPanel>
                <FormBuilder
                  formConfig={{
                    title: 'Contact Form',
                    fields: [],
                    submitText: 'Submit',
                    successMessage: 'Thank you for your submission!',
                    emailNotifications: false,
                    styling: {
                      theme: 'default',
                      primaryColor: '#007bff',
                      borderRadius: '8px',
                      spacing: '16px'
                    }
                  }}
                  onChange={(config) => {
                    console.log('Form config:', config);
                  }}
                />
              </TabPanel>

              {/* Layout Tab */}
              <TabPanel>
                <LayoutBuilder
                  layout={pageData.layout}
                  onChange={handleLayoutChange}
                  customStyles={customStyles}
                />
              </TabPanel>

              {/* Styling Tab */}
              <TabPanel>
                <StyleCustomizer
                  styles={customStyles}
                  onChange={handleStyleChange}
                />
              </TabPanel>

              {/* CSS Tab */}
              <TabPanel>
                <CustomCSSEditor
                  css={pageData.customCSS}
                  onChange={handleCustomCSSChange}
                  customStyles={customStyles}
                />
              </TabPanel>

              {/* Components Tab */}
              <TabPanel>
                <ComponentLibrary
                  onComponentSelect={(component) => {
                    // Handle component insertion
                    console.log('Component selected:', component);
                  }}
                />
              </TabPanel>

              {/* Responsive Tab */}
              <TabPanel>
                <ResponsiveDesigner
                  settings={pageData.responsiveSettings}
                  onChange={handleResponsiveChange}
                />
              </TabPanel>

              {/* Animations Tab */}
              <TabPanel>
                <AnimationBuilder
                  animations={pageData.animations}
                  onChange={handleAnimationChange}
                />
              </TabPanel>

              {/* SEO Tab */}
              <TabPanel>
                <SEOOptimizer
                  settings={pageData.seoSettings}
                  onChange={handleSEOChange}
                />
              </TabPanel>

              {/* Advanced Tab */}
              <TabPanel>
                <AdvancedSettings
                  settings={pageData.advancedSettings}
                  onChange={handleAdvancedChange}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>

        {/* Preview Panel */}
        {showPreview && (
          <Box
            flex={1}
            borderLeft="1px solid"
            borderColor={borderColor}
            bg="gray.50"
          >
            <PreviewPanel
              pageData={pageData}
              customStyles={customStyles}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};
