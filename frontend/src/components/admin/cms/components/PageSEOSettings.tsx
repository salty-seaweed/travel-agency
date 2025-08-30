import React from 'react';
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
} from '@chakra-ui/react';

interface PageSEOSettingsProps {
  seoTitle: string;
  onSeoTitleChange: (value: string) => void;
  seoDescription: string;
  onSeoDescriptionChange: (value: string) => void;
  canonicalUrl: string;
  onCanonicalUrlChange: (value: string) => void;
  robots: string;
  onRobotsChange: (value: string) => void;
  ogTitle: string;
  onOgTitleChange: (value: string) => void;
  ogDescription: string;
  onOgDescriptionChange: (value: string) => void;
  ogImage: string;
  onOgImageChange: (value: string) => void;
}

export const PageSEOSettings: React.FC<PageSEOSettingsProps> = ({
  seoTitle,
  onSeoTitleChange,
  seoDescription,
  onSeoDescriptionChange,
  canonicalUrl,
  onCanonicalUrlChange,
  robots,
  onRobotsChange,
  ogTitle,
  onOgTitleChange,
  ogDescription,
  onOgDescriptionChange,
  ogImage,
  onOgImageChange,
}) => {
  return (
    <VStack spacing={6} align="stretch">
      <VStack spacing={4}>
        <FormControl>
          <FormLabel>SEO Title</FormLabel>
          <Input
            value={seoTitle}
            onChange={(e) => onSeoTitleChange(e.target.value)}
            placeholder="SEO optimized title"
          />
        </FormControl>

        <FormControl>
          <FormLabel>SEO Description</FormLabel>
          <Textarea
            value={seoDescription}
            onChange={(e) => onSeoDescriptionChange(e.target.value)}
            placeholder="SEO description for search results"
            rows={3}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Canonical URL</FormLabel>
          <Input
            value={canonicalUrl}
            onChange={(e) => onCanonicalUrlChange(e.target.value)}
            placeholder="https://example.com/page"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Robots</FormLabel>
          <Select
            value={robots}
            onChange={(e) => onRobotsChange(e.target.value)}
          >
            <option value="index,follow">Index, Follow</option>
            <option value="noindex,follow">No Index, Follow</option>
            <option value="index,nofollow">Index, No Follow</option>
            <option value="noindex,nofollow">No Index, No Follow</option>
          </Select>
        </FormControl>
      </VStack>

      <VStack spacing={4}>
        <FormControl>
          <FormLabel>OG Title</FormLabel>
          <Input
            value={ogTitle}
            onChange={(e) => onOgTitleChange(e.target.value)}
            placeholder="Title for social media sharing"
          />
        </FormControl>

        <FormControl>
          <FormLabel>OG Description</FormLabel>
          <Textarea
            value={ogDescription}
            onChange={(e) => onOgDescriptionChange(e.target.value)}
            placeholder="Description for social media sharing"
            rows={3}
          />
        </FormControl>

        <FormControl>
          <FormLabel>OG Image URL</FormLabel>
          <Input
            value={ogImage}
            onChange={(e) => onOgImageChange(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
        </FormControl>
      </VStack>
    </VStack>
  );
};


