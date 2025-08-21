import React from 'react';
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Switch,
  Textarea,
  Card,
  CardHeader,
  CardBody,
  Heading,
} from '@chakra-ui/react';

interface PageSettingsProps {
  status: string;
  onStatusChange: (value: string) => void;
  locale: string;
  onLocaleChange: (value: string) => void;
  template: string;
  onTemplateChange: (value: string) => void;
  publishAt: string;
  onPublishAtChange: (value: string) => void;
  unpublishAt: string;
  onUnpublishAtChange: (value: string) => void;
  isHome: boolean;
  onIsHomeChange: (value: boolean) => void;
  notes: string;
  onNotesChange: (value: string) => void;
  templates: Array<{ id: string; name: string }>;
}

export const PageSettings: React.FC<PageSettingsProps> = ({
  status,
  onStatusChange,
  locale,
  onLocaleChange,
  template,
  onTemplateChange,
  publishAt,
  onPublishAtChange,
  unpublishAt,
  onUnpublishAtChange,
  isHome,
  onIsHomeChange,
  notes,
  onNotesChange,
  templates,
}) => {
  return (
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
                value={status}
                onChange={(e) => onStatusChange(e.target.value)}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Language</FormLabel>
              <Select
                value={locale}
                onChange={(e) => onLocaleChange(e.target.value)}
              >
                <option value="en">English</option>
                <option value="ru">Russian</option>
                <option value="zh">Chinese</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Template</FormLabel>
              <Select
                value={template}
                onChange={(e) => onTemplateChange(e.target.value)}
              >
                {templates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Publish Date</FormLabel>
              <Input
                type="datetime-local"
                value={publishAt}
                onChange={(e) => onPublishAtChange(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Unpublish Date</FormLabel>
              <Input
                type="datetime-local"
                value={unpublishAt}
                onChange={(e) => onUnpublishAtChange(e.target.value)}
              />
            </FormControl>

            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0">
                Set as Homepage
              </FormLabel>
              <Switch
                isChecked={isHome}
                onChange={(e) => onIsHomeChange(e.target.checked)}
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
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="Internal notes about this page..."
            rows={4}
          />
        </CardBody>
      </Card>
    </VStack>
  );
};
