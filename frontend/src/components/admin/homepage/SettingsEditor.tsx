import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  FormHelperText,
  Card,
  CardBody,
  Divider,
} from '@chakra-ui/react';

interface SettingsData {
  id?: number;
  site_title: string;
  site_description: string;
  site_keywords: string;
  contact_email: string;
  contact_phone: string;
  whatsapp_number: string;
  social_facebook: string;
  social_instagram: string;
  social_twitter: string;
  social_linkedin: string;
  footer_text: string;
}

interface SettingsEditorProps {
  data?: SettingsData;
  onChange: () => void;
}

export const SettingsEditor: React.FC<SettingsEditorProps> = ({ data, onChange }) => {
  const [settings, setSettings] = useState<SettingsData>({
    site_title: 'Thread Travels & Tours',
    site_description: '',
    site_keywords: '',
    contact_email: '',
    contact_phone: '',
    whatsapp_number: '',
    social_facebook: '',
    social_instagram: '',
    social_twitter: '',
    social_linkedin: '',
    footer_text: '',
  });

  const handleInputChange = (field: keyof SettingsData, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value,
    }));
    onChange();
  };

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        <Card>
          <CardBody>
            <VStack spacing={6} align="stretch">
              <Text fontSize="xl" fontWeight="bold">
                Site Settings
              </Text>
              
              <FormControl>
                <FormLabel>Site Title</FormLabel>
                <Input
                  value={settings.site_title}
                  onChange={(e) => handleInputChange('site_title', e.target.value)}
                  placeholder="Enter site title"
                />
                <FormHelperText>The main title of your website</FormHelperText>
              </FormControl>

              <FormControl>
                <FormLabel>Site Description</FormLabel>
                <Textarea
                  value={settings.site_description}
                  onChange={(e) => handleInputChange('site_description', e.target.value)}
                  placeholder="Enter site description"
                  rows={3}
                />
                <FormHelperText>Brief description for SEO and social sharing</FormHelperText>
              </FormControl>

              <FormControl>
                <FormLabel>Site Keywords</FormLabel>
                <Input
                  value={settings.site_keywords}
                  onChange={(e) => handleInputChange('site_keywords', e.target.value)}
                  placeholder="Enter keywords separated by commas"
                />
                <FormHelperText>SEO keywords for your website</FormHelperText>
              </FormControl>

              <Divider />

              <Text fontSize="lg" fontWeight="semibold">
                Contact Information
              </Text>

              <HStack spacing={4}>
                <FormControl>
                  <FormLabel>Contact Email</FormLabel>
                  <Input
                    type="email"
                    value={settings.contact_email}
                    onChange={(e) => handleInputChange('contact_email', e.target.value)}
                    placeholder="contact@example.com"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Contact Phone</FormLabel>
                  <Input
                    value={settings.contact_phone}
                    onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                    placeholder="+1234567890"
                  />
                </FormControl>
              </HStack>

              <FormControl>
                <FormLabel>WhatsApp Number</FormLabel>
                <Input
                  value={settings.whatsapp_number}
                  onChange={(e) => handleInputChange('whatsapp_number', e.target.value)}
                  placeholder="+1234567890"
                />
                <FormHelperText>WhatsApp number for customer support</FormHelperText>
              </FormControl>

              <Divider />

              <Text fontSize="lg" fontWeight="semibold">
                Social Media Links
              </Text>

              <HStack spacing={4}>
                <FormControl>
                  <FormLabel>Facebook</FormLabel>
                  <Input
                    value={settings.social_facebook}
                    onChange={(e) => handleInputChange('social_facebook', e.target.value)}
                    placeholder="https://facebook.com/yourpage"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Instagram</FormLabel>
                  <Input
                    value={settings.social_instagram}
                    onChange={(e) => handleInputChange('social_instagram', e.target.value)}
                    placeholder="https://instagram.com/yourpage"
                  />
                </FormControl>
              </HStack>

              <HStack spacing={4}>
                <FormControl>
                  <FormLabel>Twitter</FormLabel>
                  <Input
                    value={settings.social_twitter}
                    onChange={(e) => handleInputChange('social_twitter', e.target.value)}
                    placeholder="https://twitter.com/yourpage"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>LinkedIn</FormLabel>
                  <Input
                    value={settings.social_linkedin}
                    onChange={(e) => handleInputChange('social_linkedin', e.target.value)}
                    placeholder="https://linkedin.com/company/yourcompany"
                  />
                </FormControl>
              </HStack>

              <Divider />

              <FormControl>
                <FormLabel>Footer Text</FormLabel>
                <Textarea
                  value={settings.footer_text}
                  onChange={(e) => handleInputChange('footer_text', e.target.value)}
                  placeholder="Enter footer text"
                  rows={3}
                />
                <FormHelperText>Text to display in the website footer</FormHelperText>
              </FormControl>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
}; 