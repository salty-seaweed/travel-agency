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
  Switch,
  Card,
  CardBody,
} from '@chakra-ui/react';

interface CTASectionData {
  id?: number;
  title: string;
  description: string;
  background_image?: File | string;
  background_image_url?: string;
  cta_primary_text: string;
  cta_primary_url: string;
  cta_secondary_text: string;
  cta_secondary_url: string;
  is_active: boolean;
}

interface CTASectionEditorProps {
  data?: CTASectionData;
  onChange: () => void;
}

export const CTASectionEditor: React.FC<CTASectionEditorProps> = ({ data, onChange }) => {
  const [ctaData, setCtaData] = useState<CTASectionData>({
    title: '',
    description: '',
    cta_primary_text: 'Get Started',
    cta_primary_url: '#',
    cta_secondary_text: 'Learn More',
    cta_secondary_url: '#',
    is_active: true,
  });

  const handleInputChange = (field: keyof CTASectionData, value: any) => {
    setCtaData(prev => ({
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
                Call-to-Action Section Configuration
              </Text>
              
              <FormControl>
                <FormLabel>Title</FormLabel>
                <Input
                  value={ctaData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter CTA title"
                />
                <FormHelperText>The main headline of your CTA section</FormHelperText>
              </FormControl>

              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={ctaData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter CTA description"
                  rows={4}
                />
                <FormHelperText>A compelling description to encourage action</FormHelperText>
              </FormControl>

              <HStack spacing={4}>
                <FormControl>
                  <FormLabel>Primary CTA Text</FormLabel>
                  <Input
                    value={ctaData.cta_primary_text}
                    onChange={(e) => handleInputChange('cta_primary_text', e.target.value)}
                    placeholder="Get Started"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Primary CTA URL</FormLabel>
                  <Input
                    value={ctaData.cta_primary_url}
                    onChange={(e) => handleInputChange('cta_primary_url', e.target.value)}
                    placeholder="#"
                  />
                </FormControl>
              </HStack>

              <HStack spacing={4}>
                <FormControl>
                  <FormLabel>Secondary CTA Text</FormLabel>
                  <Input
                    value={ctaData.cta_secondary_text}
                    onChange={(e) => handleInputChange('cta_secondary_text', e.target.value)}
                    placeholder="Learn More"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Secondary CTA URL</FormLabel>
                  <Input
                    value={ctaData.cta_secondary_url}
                    onChange={(e) => handleInputChange('cta_secondary_url', e.target.value)}
                    placeholder="#"
                  />
                </FormControl>
              </HStack>

              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="cta-is-active" mb="0">
                  Active
                </FormLabel>
                <Switch
                  id="cta-is-active"
                  isChecked={ctaData.is_active}
                  onChange={(e) => handleInputChange('is_active', e.target.checked)}
                />
                <FormHelperText ml={3}>
                  Enable or disable this CTA section
                </FormHelperText>
              </FormControl>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
}; 