import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  DocumentTextIcon,
  PhotoIcon,
  Bars3Icon,
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  HomeIcon,
} from '@heroicons/react/24/outline';

interface Template {
  id: string;
  name: string;
  description: string;
  icon: any;
  features: string[];
  preview: string;
}

const TEMPLATES: Template[] = [
  {
    id: 'default',
    name: 'Default Template',
    description: 'Standard page layout with clean typography',
    icon: DocumentTextIcon,
    features: ['Clean typography', 'Responsive design', 'SEO optimized'],
    preview: 'A clean, professional layout perfect for general content pages.',
  },
  {
    id: 'full-width',
    name: 'Full Width',
    description: 'Full-width layout with hero section',
    icon: PhotoIcon,
    features: ['Hero section', 'Full-width content', 'Modern design'],
    preview: 'Modern full-width layout with a prominent hero section and spacious content area.',
  },
  {
    id: 'sidebar',
    name: 'Sidebar Layout',
    description: 'Content with sidebar navigation',
    icon: Bars3Icon,
    features: ['Sidebar navigation', 'Quick links', 'Contact info'],
    preview: 'Two-column layout with main content and a sidebar for navigation and additional information.',
  },
  {
    id: 'landing',
    name: 'Landing Page',
    description: 'Conversion-focused landing page',
    icon: SparklesIcon,
    features: ['Hero section', 'Call-to-action buttons', 'Conversion focused'],
    preview: 'High-impact landing page template designed to convert visitors into customers.',
  },
  {
    id: 'blog',
    name: 'Blog Post',
    description: 'Blog post with social features',
    icon: DocumentTextIcon,
    features: ['Blog styling', 'Social sharing', 'Comments section'],
    preview: 'Blog post template with social sharing buttons and comment section.',
  },
  {
    id: 'contact',
    name: 'Contact Page',
    description: 'Contact form with information',
    icon: ChatBubbleLeftRightIcon,
    features: ['Contact form', 'Contact info', 'Map integration'],
    preview: 'Contact page with form and contact information in a two-column layout.',
  },
];

interface TemplateSelectorProps {
  selectedTemplate: string;
  onTemplateSelect: (templateId: string) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onTemplateSelect,
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const selectedBorderColor = useColorModeValue('blue.500', 'blue.400');

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="md" mb={2}>
            Choose a Template
          </Heading>
          <Text color="gray.600">
            Select a template that best fits your content and purpose
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {TEMPLATES.map((template) => {
            const isSelected = selectedTemplate === template.id;
            const IconComponent = template.icon;

            return (
              <Card
                key={template.id}
                bg={bgColor}
                border="2px solid"
                borderColor={isSelected ? selectedBorderColor : borderColor}
                cursor="pointer"
                transition="all 0.2s"
                _hover={{
                  borderColor: isSelected ? selectedBorderColor : 'blue.300',
                  transform: 'translateY(-2px)',
                  shadow: 'lg',
                }}
                onClick={() => onTemplateSelect(template.id)}
              >
                <CardHeader pb={3}>
                  <HStack spacing={3}>
                    <Box
                      w={10}
                      h={10}
                      bg={isSelected ? 'blue.500' : 'gray.100'}
                      color={isSelected ? 'white' : 'gray.600'}
                      borderRadius="lg"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <IconComponent className="w-5 h-5" />
                    </Box>
                    <Box flex={1}>
                      <Heading size="sm" color={isSelected ? 'blue.600' : 'gray.800'}>
                        {template.name}
                      </Heading>
                      <Text fontSize="xs" color="gray.500" mt={1}>
                        {template.description}
                      </Text>
                    </Box>
                    {isSelected && (
                      <Badge colorScheme="blue" size="sm">
                        Selected
                      </Badge>
                    )}
                  </HStack>
                </CardHeader>

                <CardBody pt={0}>
                  <VStack spacing={3} align="stretch">
                    <Text fontSize="sm" color="gray.600">
                      {template.preview}
                    </Text>

                    <Box>
                      <Text fontSize="xs" fontWeight="semibold" color="gray.700" mb={2}>
                        Features:
                      </Text>
                      <VStack spacing={1} align="stretch">
                        {template.features.map((feature, index) => (
                          <Text key={index} fontSize="xs" color="gray.600">
                            • {feature}
                          </Text>
                        ))}
                      </VStack>
                    </Box>

                    <Button
                      size="sm"
                      variant={isSelected ? 'solid' : 'outline'}
                      colorScheme="blue"
                      onClick={(e) => {
                        e.stopPropagation();
                        onTemplateSelect(template.id);
                      }}
                    >
                      {isSelected ? 'Selected' : 'Select Template'}
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            );
          })}
        </SimpleGrid>
      </VStack>
    </Box>
  );
};
