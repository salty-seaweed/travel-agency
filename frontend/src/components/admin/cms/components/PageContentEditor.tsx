import React from 'react';
import {
  HStack,
  Button,
  Textarea,
  Card,
  CardHeader,
  CardBody,
  Heading,
} from '@chakra-ui/react';
import {
  PhotoIcon,
  LinkIcon,
} from '@heroicons/react/24/outline';

interface PageContentEditorProps {
  content: string;
  onContentChange: (value: string) => void;
  onInsertMedia: () => void;
  onInsertLink: () => void;
}

export const PageContentEditor: React.FC<PageContentEditorProps> = ({
  content,
  onContentChange,
  onInsertMedia,
  onInsertLink,
}) => {
  return (
    <Card>
      <CardHeader>
        <HStack justify="space-between">
          <Heading size="md">Content</Heading>
          <HStack spacing={2}>
            <Button
              size="sm"
              variant="outline"
              leftIcon={<PhotoIcon className="w-4 h-4" />}
              onClick={onInsertMedia}
            >
              Insert Media
            </Button>
            <Button
              size="sm"
              variant="outline"
              leftIcon={<LinkIcon className="w-4 h-4" />}
              onClick={onInsertLink}
            >
              Insert Link
            </Button>
          </HStack>
        </HStack>
      </CardHeader>
      <CardBody>
        <Textarea
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder="Write your page content here..."
          rows={15}
          fontFamily="mono"
        />
      </CardBody>
    </Card>
  );
};


