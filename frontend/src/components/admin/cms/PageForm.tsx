import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  VStack,
  HStack,
  useToast,
} from '@chakra-ui/react';
import type { Page, PageFormData } from '../../../types';

interface PageFormProps {
  isOpen: boolean;
  onClose: () => void;
  page?: Page | null;
  isEditing: boolean;
  onSave: (pageData: PageFormData) => Promise<void>;
}

const PageForm: React.FC<PageFormProps> = ({
  isOpen,
  onClose,
  page,
  isEditing,
  onSave,
}) => {
  const [formData, setFormData] = useState<PageFormData>({
    title: '',
    slug: '',
    path: '',
    locale: 'en',
    status: 'draft',
    template: 'default',
    seo_title: '',
    seo_description: '',
    canonical_url: '',
    robots: 'index,follow',
    og_title: '',
    og_description: '',
    og_image: null,
    json_ld: {},
    publish_at: null,
    unpublish_at: null,
    parent: null,
    is_home: false,
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (page && isEditing) {
      setFormData({
        title: page.title,
        slug: page.slug,
        path: page.path,
        locale: page.locale,
        status: page.status,
        template: page.template,
        seo_title: page.seo_title,
        seo_description: page.seo_description,
        canonical_url: page.canonical_url,
        robots: page.robots,
        og_title: page.og_title,
        og_description: page.og_description,
        og_image: page.og_image,
        json_ld: page.json_ld,
        publish_at: page.publish_at,
        unpublish_at: page.unpublish_at,
        parent: page.parent,
        is_home: page.is_home,
        notes: page.notes,
      });
    } else {
      setFormData({
        title: '',
        slug: '',
        path: '',
        locale: 'en',
        status: 'draft',
        template: 'default',
        seo_title: '',
        seo_description: '',
        canonical_url: '',
        robots: 'index,follow',
        og_title: '',
        og_description: '',
        og_image: null,
        json_ld: {},
        publish_at: null,
        unpublish_at: null,
        parent: null,
        is_home: false,
        notes: '',
      });
    }
  }, [page, isEditing]);

  const handleInputChange = (field: keyof PageFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const generateUniqueSlug = async (baseSlug: string) => {
    // For now, we'll add a timestamp to make it unique
    // In a real implementation, you'd check against the backend
    const timestamp = Date.now();
    return `${baseSlug}-${timestamp}`;
  };

  const handleTitleChange = async (title: string) => {
    handleInputChange('title', title);
    if (!isEditing) {
      const baseSlug = generateSlug(title);
      const uniqueSlug = await generateUniqueSlug(baseSlug);
      handleInputChange('slug', uniqueSlug);
      handleInputChange('path', `/${uniqueSlug}`);
      handleInputChange('seo_title', title);
      handleInputChange('og_title', title);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await onSave(formData);
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save page',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {isEditing ? 'Edit Page' : 'Create New Page'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Title</FormLabel>
              <Input
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value).catch(console.error)}
                placeholder="Enter page title"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Slug</FormLabel>
              <Input
                value={formData.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                placeholder="page-url-slug"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Path</FormLabel>
              <Input
                value={formData.path}
                onChange={(e) => handleInputChange('path', e.target.value)}
                placeholder="/about"
              />
            </FormControl>

            <HStack spacing={4} width="100%">
              <FormControl>
                <FormLabel>Locale</FormLabel>
                <Select
                  value={formData.locale}
                  onChange={(e) => handleInputChange('locale', e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="ru">Russian</option>
                  <option value="zh">Chinese</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Status</FormLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                >
                  <option value="draft">Draft</option>
                  <option value="in_review">In Review</option>
                  <option value="approved">Approved</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="archived">Archived</option>
                </Select>
              </FormControl>
            </HStack>

            <FormControl>
              <FormLabel>Template</FormLabel>
              <Input
                value={formData.template}
                onChange={(e) => handleInputChange('template', e.target.value)}
                placeholder="default"
              />
            </FormControl>

            <FormControl>
              <FormLabel>SEO Title</FormLabel>
              <Input
                value={formData.seo_title}
                onChange={(e) => handleInputChange('seo_title', e.target.value)}
                placeholder="SEO title (max 60 chars)"
                maxLength={60}
              />
            </FormControl>

            <FormControl>
              <FormLabel>SEO Description</FormLabel>
              <Textarea
                value={formData.seo_description}
                onChange={(e) => handleInputChange('seo_description', e.target.value)}
                placeholder="SEO description (max 160 chars)"
                maxLength={160}
                rows={3}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Canonical URL</FormLabel>
              <Input
                value={formData.canonical_url}
                onChange={(e) => handleInputChange('canonical_url', e.target.value)}
                placeholder="https://example.com/page"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Robots</FormLabel>
              <Input
                value={formData.robots}
                onChange={(e) => handleInputChange('robots', e.target.value)}
                placeholder="index,follow"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Open Graph Title</FormLabel>
              <Input
                value={formData.og_title}
                onChange={(e) => handleInputChange('og_title', e.target.value)}
                placeholder="OG title"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Open Graph Description</FormLabel>
              <Textarea
                value={formData.og_description}
                onChange={(e) => handleInputChange('og_description', e.target.value)}
                placeholder="OG description"
                rows={3}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Notes</FormLabel>
              <Textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Internal notes"
                rows={3}
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={loading}
            loadingText="Saving..."
          >
            {isEditing ? 'Update Page' : 'Create Page'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PageForm;
