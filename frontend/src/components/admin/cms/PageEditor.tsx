import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Input,
  Textarea,
  Select,
  Switch,
  FormControl,
  FormLabel,
  FormHelperText,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Badge,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Spinner,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  DocumentTextIcon,
  PhotoIcon,
  LinkIcon,
  GlobeAltIcon,
  CalendarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { apiGet, apiPost, apiPut } from '../../../api';
import { useNotification } from '../../../hooks/useNotification';
import { MediaLibrary } from './MediaLibrary';
import type { Page } from '../../../types';
import { TemplateSelector } from './components/TemplateSelector';
import { RichTextEditor } from './components/RichTextEditor';

// Local MediaAsset interface to match MediaLibrary component
interface MediaAsset {
  id: number;
  file: string;
  file_url: string;
  thumbnail_url?: string;
  alt_text: string;
  caption?: string;
  mime_type: string;
  file_size: number;
  usage_count: number;
  created_at: string;
  created_by?: number;
}

interface PageEditorProps {
  pageId?: string;
  onSave?: (page: Page) => void;
  onCancel?: () => void;
}

interface PageFormData {
  title: string;
  slug: string;
  content: string;
  meta_description: string;
  meta_keywords: string;
  status: 'draft' | 'published' | 'archived';
  locale: string;
  template: string;
  seo_title: string;
  seo_description: string;
  canonical_url: string;
  robots: string;
  og_title: string;
  og_description: string;
  og_image: string | null;
  publish_at: string | null;
  unpublish_at: string | null;
  is_home: boolean;
  notes: string;
}

const TEMPLATES = [
  { id: 'default', name: 'Default Template' },
  { id: 'full-width', name: 'Full Width' },
  { id: 'sidebar', name: 'Sidebar Layout' },
  { id: 'landing', name: 'Landing Page' },
  { id: 'blog', name: 'Blog Post' },
  { id: 'contact', name: 'Contact Page' },
  { id: 'about', name: 'About Page' },
];

export const PageEditor: React.FC<PageEditorProps> = ({
  pageId,
  onSave,
  onCancel,
}) => {
  const [isLoading, setIsLoading] = useState(!!pageId);
  const [isSaving, setIsSaving] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  
  const [formData, setFormData] = useState<PageFormData>({
    title: '',
    slug: '',
    content: '',
    meta_description: '',
    meta_keywords: '',
    status: 'draft',
    locale: 'en',
    template: 'default',
    seo_title: '',
    seo_description: '',
    canonical_url: '',
    robots: 'index,follow',
    og_title: '',
    og_description: '',
    og_image: null,
    publish_at: null,
    unpublish_at: null,
    is_home: false,
    notes: '',
  });

  const { showNotification } = useNotification();

  useEffect(() => {
    if (pageId) {
      loadPage();
    }
  }, [pageId]);

  const loadPage = async () => {
    try {
      setIsLoading(true);
      const response = await apiGet(`pages/${pageId}/`);
      const page = response.data || response;
      
      setFormData({
        title: page.title || '',
        slug: page.slug || '',
        content: page.content || '',
        meta_description: page.meta_description || '',
        meta_keywords: page.meta_keywords || '',
        status: page.status || 'draft',
        locale: page.locale || 'en',
        template: page.template || 'default',
        seo_title: page.seo_title || '',
        seo_description: page.seo_description || '',
        canonical_url: page.canonical_url || '',
        robots: page.robots || 'index,follow',
        og_title: page.og_title || '',
        og_description: page.og_description || '',
        og_image: page.og_image || null,
        publish_at: page.publish_at || null,
        unpublish_at: page.unpublish_at || null,
        is_home: page.is_home || false,
        notes: page.notes || '',
      });
    } catch (error) {
      showNotification('Failed to load page', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      showNotification('Title is required', 'error');
      return;
    }

    if (!formData.slug.trim()) {
      showNotification('Slug is required', 'error');
      return;
    }

    try {
      setIsSaving(true);
      const url = pageId ? `/api/pages/${pageId}/` : '/api/pages/';
      const method = pageId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access')}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const savedPage = await response.json();
        showNotification(`Page ${pageId ? 'updated' : 'created'} successfully`, 'success');
        onSave?.(savedPage);
      } else {
        const errorData = await response.json();
        showNotification(errorData.message || 'Failed to save page', 'error');
      }
    } catch (error) {
      showNotification('Failed to save page', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({ ...prev, title }));
    
    // Auto-generate slug if empty
    if (!formData.slug) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const insertMedia = (asset: MediaAsset) => {
    const imageMarkdown = `![${asset.alt_text || 'Image'}](${asset.file_url})`;
    setFormData(prev => ({
      ...prev,
      content: prev.content + '\n' + imageMarkdown,
    }));
    setShowMediaLibrary(false);
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    const text = prompt('Enter link text:');
    
    if (url && text) {
      const linkMarkdown = `[${text}](${url})`;
      setFormData(prev => ({
        ...prev,
        content: prev.content + '\n' + linkMarkdown,
      }));
    }
  };

  if (isLoading) {
    return (
      <Box textAlign="center" py={8}>
        <Spinner size="xl" color="blue.500" />
        <Text mt={4}>Loading page...</Text>
      </Box>
    );
  }

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <HStack justify="space-between">
          <VStack align="start" spacing={1}>
            <Heading size="lg">
              {pageId ? 'Edit Page' : 'Create New Page'}
            </Heading>
            <Text color="gray.600">
              {pageId ? 'Update page content and settings' : 'Create a new page'}
            </Text>
          </VStack>
          <HStack spacing={3}>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleSave}
              isLoading={isSaving}
              loadingText="Saving..."
            >
              {pageId ? 'Update Page' : 'Create Page'}
            </Button>
          </HStack>
        </HStack>

        <Tabs variant="enclosed">
          <TabList>
            <Tab>Content</Tab>
            <Tab>SEO & Meta</Tab>
            <Tab>Settings</Tab>
          </TabList>

          <TabPanels>
            {/* Content Tab */}
            <TabPanel>
              <VStack spacing={6} align="stretch">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <Heading size="md">Basic Information</Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={4}>
                      <FormControl isRequired>
                        <FormLabel>Title</FormLabel>
                        <Input
                          value={formData.title}
                          onChange={(e) => handleTitleChange(e.target.value)}
                          placeholder="Enter page title"
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>Slug</FormLabel>
                        <Input
                          value={formData.slug}
                          onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                          placeholder="page-slug"
                        />
                        <FormHelperText>
                          URL-friendly version of the title
                        </FormHelperText>
                      </FormControl>

                      <FormControl>
                        <FormLabel>Meta Description</FormLabel>
                        <Textarea
                          value={formData.meta_description}
                          onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                          placeholder="Brief description for search engines"
                          rows={3}
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Keywords</FormLabel>
                        <Input
                          value={formData.meta_keywords}
                          onChange={(e) => setFormData(prev => ({ ...prev, meta_keywords: e.target.value }))}
                          placeholder="keyword1, keyword2, keyword3"
                        />
                      </FormControl>
                    </VStack>
                  </CardBody>
                </Card>

                {/* Content Editor */}
                <Card>
                  <CardHeader>
                    <HStack justify="space-between">
                      <Heading size="md">Content</Heading>
                      <HStack spacing={2}>
                        <Button
                          size="sm"
                          variant="outline"
                          leftIcon={<PhotoIcon className="w-4 h-4" />}
                          onClick={() => setShowMediaLibrary(true)}
                        >
                          Insert Media
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          leftIcon={<LinkIcon className="w-4 h-4" />}
                          onClick={insertLink}
                        >
                          Insert Link
                        </Button>
                      </HStack>
                    </HStack>
                  </CardHeader>
                  <CardBody>
                    <FormControl>
                        <FormLabel>Content</FormLabel>
                        <RichTextEditor
                          value={formData.content}
                          onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                          placeholder="Write your page content here..."
                        />
                      </FormControl>
                  </CardBody>
                </Card>
              </VStack>
            </TabPanel>

            {/* SEO & Meta Tab */}
            <TabPanel>
              <VStack spacing={6} align="stretch">
                <Card>
                  <CardHeader>
                    <Heading size="md">SEO Settings</Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={4}>
                      <FormControl>
                        <FormLabel>SEO Title</FormLabel>
                        <Input
                          value={formData.seo_title}
                          onChange={(e) => setFormData(prev => ({ ...prev, seo_title: e.target.value }))}
                          placeholder="SEO optimized title"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>SEO Description</FormLabel>
                        <Textarea
                          value={formData.seo_description}
                          onChange={(e) => setFormData(prev => ({ ...prev, seo_description: e.target.value }))}
                          placeholder="SEO description for search results"
                          rows={3}
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Canonical URL</FormLabel>
                        <Input
                          value={formData.canonical_url}
                          onChange={(e) => setFormData(prev => ({ ...prev, canonical_url: e.target.value }))}
                          placeholder="https://example.com/page"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Robots</FormLabel>
                        <Select
                          value={formData.robots}
                          onChange={(e) => setFormData(prev => ({ ...prev, robots: e.target.value }))}
                        >
                          <option value="index,follow">Index, Follow</option>
                          <option value="noindex,follow">No Index, Follow</option>
                          <option value="index,nofollow">Index, No Follow</option>
                          <option value="noindex,nofollow">No Index, No Follow</option>
                        </Select>
                      </FormControl>
                    </VStack>
                  </CardBody>
                </Card>

                <Card>
                  <CardHeader>
                    <Heading size="md">Open Graph</Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={4}>
                      <FormControl>
                        <FormLabel>OG Title</FormLabel>
                        <Input
                          value={formData.og_title}
                          onChange={(e) => setFormData(prev => ({ ...prev, og_title: e.target.value }))}
                          placeholder="Title for social media sharing"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>OG Description</FormLabel>
                        <Textarea
                          value={formData.og_description}
                          onChange={(e) => setFormData(prev => ({ ...prev, og_description: e.target.value }))}
                          placeholder="Description for social media sharing"
                          rows={3}
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>OG Image URL</FormLabel>
                        <Input
                          value={formData.og_image || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, og_image: e.target.value }))}
                          placeholder="https://example.com/image.jpg"
                        />
                      </FormControl>
                    </VStack>
                  </CardBody>
                </Card>
              </VStack>
            </TabPanel>

            {/* Settings Tab */}
            <TabPanel>
              <VStack spacing={6} align="stretch">
                <Card>
                  <CardHeader>
                    <Heading size="md">Page Settings</Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={4}>
                      <FormControl>
                        <FormLabel>Status</FormLabel>
                        <Select
                          value={formData.status}
                          onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                        >
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                          <option value="archived">Archived</option>
                        </Select>
                      </FormControl>

                      <FormControl>
                        <FormLabel>Language</FormLabel>
                        <Select
                          value={formData.locale}
                          onChange={(e) => setFormData(prev => ({ ...prev, locale: e.target.value }))}
                        >
                          <option value="en">English</option>
                          <option value="ru">Russian</option>
                          <option value="zh">Chinese</option>
                        </Select>
                      </FormControl>

                      <FormControl>
                        <FormLabel>Template</FormLabel>
                        <TemplateSelector
                          selectedTemplate={formData.template}
                          onTemplateSelect={(template) => setFormData(prev => ({ ...prev, template }))}
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Publish Date</FormLabel>
                        <Input
                          type="datetime-local"
                          value={formData.publish_at || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, publish_at: e.target.value }))}
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Unpublish Date</FormLabel>
                        <Input
                          type="datetime-local"
                          value={formData.unpublish_at || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, unpublish_at: e.target.value }))}
                        />
                      </FormControl>

                      <FormControl display="flex" alignItems="center">
                        <FormLabel mb="0">
                          Set as Homepage
                        </FormLabel>
                        <Switch
                          isChecked={formData.is_home}
                          onChange={(e) => setFormData(prev => ({ ...prev, is_home: e.target.checked }))}
                        />
                      </FormControl>
                    </VStack>
                  </CardBody>
                </Card>

                <Card>
                  <CardHeader>
                    <Heading size="md">Notes</Heading>
                  </CardHeader>
                  <CardBody>
                    <Textarea
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Internal notes about this page..."
                      rows={4}
                    />
                  </CardBody>
                </Card>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>

      {/* Media Library Modal */}
      {showMediaLibrary && (
        <Modal isOpen={showMediaLibrary} onClose={() => setShowMediaLibrary(false)} size="6xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Media Library</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <MediaLibrary
                onSelect={insertMedia}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};
