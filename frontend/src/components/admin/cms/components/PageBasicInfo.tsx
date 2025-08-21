import React from 'react';
import {
  VStack,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Textarea,
} from '@chakra-ui/react';

interface PageBasicInfoProps {
  title: string;
  onTitleChange: (value: string) => void;
  slug: string;
  onSlugChange: (value: string) => void;
  metaDescription: string;
  onMetaDescriptionChange: (value: string) => void;
  metaKeywords: string;
  onMetaKeywordsChange: (value: string) => void;
}

export const PageBasicInfo: React.FC<PageBasicInfoProps> = ({
  title,
  onTitleChange,
  slug,
  onSlugChange,
  metaDescription,
  onMetaDescriptionChange,
  metaKeywords,
  onMetaKeywordsChange,
}) => {
  return (
    <VStack spacing={4}>
      <FormControl isRequired>
        <FormLabel>Title</FormLabel>
        <Input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Enter page title"
        />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Slug</FormLabel>
        <Input
          value={slug}
          onChange={(e) => onSlugChange(e.target.value)}
          placeholder="page-slug"
        />
        <FormHelperText>
          URL-friendly version of the title
        </FormHelperText>
      </FormControl>

      <FormControl>
        <FormLabel>Meta Description</FormLabel>
        <Textarea
          value={metaDescription}
          onChange={(e) => onMetaDescriptionChange(e.target.value)}
          placeholder="Brief description for search engines"
          rows={3}
        />
      </FormControl>

      <FormControl>
        <FormLabel>Keywords</FormLabel>
        <Input
          value={metaKeywords}
          onChange={(e) => onMetaKeywordsChange(e.target.value)}
          placeholder="keyword1, keyword2, keyword3"
        />
      </FormControl>
    </VStack>
  );
};
