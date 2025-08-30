import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Divider,
  useColorModeValue,
  Textarea,
  Select,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Badge,
  Tooltip,
} from '@chakra-ui/react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CustomCSSEditorProps {
  css: string;
  onChange: (css: string) => void;
  customStyles: any;
}

export const CustomCSSEditor: React.FC<CustomCSSEditorProps> = ({
  css,
  onChange,
  customStyles,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [cssTemplate, setCssTemplate] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const cssTemplates = {
    modern: `
/* Modern Design System */
:root {
  --primary-color: ${customStyles.colors.primary};
  --secondary-color: ${customStyles.colors.secondary};
  --accent-color: ${customStyles.colors.accent};
  --background-color: ${customStyles.colors.background};
  --text-color: ${customStyles.colors.text};
  --font-family: ${customStyles.typography.fontFamily};
  --font-size: ${customStyles.typography.fontSize};
  --line-height: ${customStyles.typography.lineHeight};
  --font-weight: ${customStyles.typography.fontWeight};
  --border-radius: ${customStyles.borders.radius};
  --box-shadow: ${customStyles.shadows.boxShadow};
}

.cms-content {
  font-family: var(--font-family);
  font-size: var(--font-size);
  line-height: var(--line-height);
  color: var(--text-color);
  background-color: var(--background-color);
  padding: ${customStyles.spacing.padding};
  margin: ${customStyles.spacing.margin};
}

.cms-content h1, .cms-content h2, .cms-content h3 {
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.cms-content a {
  color: var(--accent-color);
  text-decoration: none;
  transition: color 0.3s ease;
}

.cms-content a:hover {
  color: var(--secondary-color);
}

.cms-content img {
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  max-width: 100%;
  height: auto;
}

.cms-content blockquote {
  border-left: 4px solid var(--accent-color);
  padding-left: 1rem;
  margin: 1rem 0;
  font-style: italic;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 0 var(--border-radius) var(--border-radius) 0;
}`,
    
    elegant: `
/* Elegant Typography */
.cms-content {
  font-family: 'Playfair Display', serif;
  line-height: 1.8;
  color: #2c3e50;
  max-width: 65ch;
  margin: 0 auto;
}

.cms-content h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 1.5rem;
  text-align: center;
  letter-spacing: -0.025em;
}

.cms-content h2 {
  font-size: 1.875rem;
  font-weight: 600;
  color: #2d3748;
  margin: 2rem 0 1rem 0;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 0.5rem;
}

.cms-content h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #4a5568;
  margin: 1.5rem 0 0.75rem 0;
}

.cms-content p {
  margin-bottom: 1.5rem;
  text-align: justify;
}

.cms-content blockquote {
  font-style: italic;
  border-left: 4px solid #cbd5e0;
  padding: 1rem 1.5rem;
  margin: 2rem 0;
  background: #f7fafc;
  border-radius: 0 0.5rem 0.5rem 0;
}

.cms-content img {
  border-radius: 0.75rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  margin: 2rem auto;
  display: block;
}`,

    minimal: `
/* Minimal Clean Design */
.cms-content {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  line-height: 1.7;
  color: #374151;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.cms-content h1 {
  font-size: 2.25rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1.5rem;
  margin-top: 2rem;
}

.cms-content h2 {
  font-size: 1.875rem;
  font-weight: 600;
  color: #1f2937;
  margin: 2rem 0 1rem 0;
}

.cms-content h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #374151;
  margin: 1.5rem 0 0.75rem 0;
}

.cms-content p {
  margin-bottom: 1.25rem;
}

.cms-content ul, .cms-content ol {
  margin: 1rem 0;
  padding-left: 1.5rem;
}

.cms-content li {
  margin-bottom: 0.5rem;
}

.cms-content blockquote {
  border-left: 3px solid #d1d5db;
  padding-left: 1rem;
  margin: 1.5rem 0;
  color: #6b7280;
  font-style: italic;
}

.cms-content img {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 1.5rem 0;
}

.cms-content a {
  color: #2563eb;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 2px;
}

.cms-content a:hover {
  color: #1d4ed8;
}`,

    dark: `
/* Dark Theme */
.cms-content {
  font-family: 'Inter', sans-serif;
  line-height: 1.7;
  color: #e5e7eb;
  background-color: #111827;
  padding: 2rem;
  border-radius: 0.75rem;
}

.cms-content h1 {
  font-size: 2.25rem;
  font-weight: 700;
  color: #f9fafb;
  margin-bottom: 1.5rem;
  margin-top: 2rem;
}

.cms-content h2 {
  font-size: 1.875rem;
  font-weight: 600;
  color: #f3f4f6;
  margin: 2rem 0 1rem 0;
}

.cms-content h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #d1d5db;
  margin: 1.5rem 0 0.75rem 0;
}

.cms-content p {
  margin-bottom: 1.25rem;
  color: #9ca3af;
}

.cms-content ul, .cms-content ol {
  margin: 1rem 0;
  padding-left: 1.5rem;
}

.cms-content li {
  margin-bottom: 0.5rem;
  color: #9ca3af;
}

.cms-content blockquote {
  border-left: 3px solid #4b5563;
  padding-left: 1rem;
  margin: 1.5rem 0;
  color: #6b7280;
  font-style: italic;
  background-color: #1f2937;
  border-radius: 0 0.5rem 0.5rem 0;
}

.cms-content img {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 1.5rem 0;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.cms-content a {
  color: #60a5fa;
  text-decoration: none;
}

.cms-content a:hover {
  color: #93c5fd;
  text-decoration: underline;
}`,

    colorful: `
/* Colorful Vibrant Design */
.cms-content {
  font-family: 'Poppins', sans-serif;
  line-height: 1.8;
  color: #2d3748;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.cms-content h1 {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  margin-bottom: 2rem;
}

.cms-content h2 {
  font-size: 2rem;
  font-weight: 600;
  color: #ff6b6b;
  margin: 2rem 0 1rem 0;
  border-bottom: 3px solid #4ecdc4;
  padding-bottom: 0.5rem;
}

.cms-content h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #45b7d1;
  margin: 1.5rem 0 0.75rem 0;
}

.cms-content p {
  margin-bottom: 1.5rem;
  background: rgba(255, 255, 255, 0.9);
  padding: 1rem;
  border-radius: 0.5rem;
  backdrop-filter: blur(10px);
}

.cms-content ul, .cms-content ol {
  margin: 1rem 0;
  padding-left: 1.5rem;
  background: rgba(255, 255, 255, 0.8);
  padding: 1rem;
  border-radius: 0.5rem;
}

.cms-content li {
  margin-bottom: 0.5rem;
  color: #2d3748;
}

.cms-content blockquote {
  border-left: 5px solid #ff6b6b;
  padding: 1.5rem;
  margin: 2rem 0;
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
  border-radius: 0 1rem 1rem 0;
  font-style: italic;
  color: #2d3748;
}

.cms-content img {
  max-width: 100%;
  height: auto;
  border-radius: 1rem;
  margin: 2rem 0;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  border: 3px solid #4ecdc4;
}

.cms-content a {
  color: #ff6b6b;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.cms-content a:hover {
  color: #4ecdc4;
  text-decoration: underline;
  transform: translateY(-2px);
}`,
  };

  const handleTemplateSelect = (templateName: string) => {
    const template = cssTemplates[templateName as keyof typeof cssTemplates];
    if (template) {
      setCssTemplate(template);
      onChange(template);
    }
  };

  const handleApplyTemplate = () => {
    if (cssTemplate) {
      onChange(cssTemplate);
    }
  };

  const handleReset = () => {
    onChange('');
  };

  const handleFormatCSS = () => {
    // Basic CSS formatting
    const formatted = css
      .replace(/\s*{\s*/g, ' {\n  ')
      .replace(/\s*}\s*/g, '\n}\n')
      .replace(/;\s*/g, ';\n  ')
      .replace(/\n\s*}\s*/g, '\n}\n');
    onChange(formatted);
  };

  return (
    <VStack spacing={6} align="stretch" p={4}>
      {/* Header */}
      <HStack justify="space-between">
        <Heading size="lg">Custom CSS Editor</Heading>
        <HStack spacing={3}>
          <Button size="sm" onClick={handleFormatCSS}>
            Format CSS
          </Button>
          <Button size="sm" variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </Button>
        </HStack>
      </HStack>

      {/* CSS Templates */}
      <Card bg={bgColor} border="1px solid" borderColor={borderColor}>
        <CardHeader>
          <Heading size="md">CSS Templates</Heading>
        </CardHeader>
        <CardBody>
          <VStack spacing={4} align="stretch">
            <Text fontSize="sm" color="gray.600">
              Choose from pre-built CSS templates or create your own custom styles.
            </Text>
            
            <HStack spacing={3} wrap="wrap">
              <Button
                size="sm"
                colorScheme="blue"
                onClick={() => handleTemplateSelect('modern')}
              >
                Modern
              </Button>
              <Button
                size="sm"
                colorScheme="purple"
                onClick={() => handleTemplateSelect('elegant')}
              >
                Elegant
              </Button>
              <Button
                size="sm"
                colorScheme="green"
                onClick={() => handleTemplateSelect('minimal')}
              >
                Minimal
              </Button>
              <Button
                size="sm"
                colorScheme="gray"
                onClick={() => handleTemplateSelect('dark')}
              >
                Dark
              </Button>
              <Button
                size="sm"
                colorScheme="orange"
                onClick={() => handleTemplateSelect('colorful')}
              >
                Colorful
              </Button>
            </HStack>

            {cssTemplate && (
              <Alert status="info">
                <AlertIcon />
                <Box>
                  <AlertTitle>Template Ready!</AlertTitle>
                  <AlertDescription>
                    A CSS template has been loaded. Click "Apply Template" to use it.
                  </AlertDescription>
                </Box>
                <Button
                  size="sm"
                  colorScheme="blue"
                  ml={4}
                  onClick={handleApplyTemplate}
                >
                  Apply Template
                </Button>
              </Alert>
            )}
          </VStack>
        </CardBody>
      </Card>

      {/* CSS Editor */}
      <Box display="flex" gap={4} h="600px">
        {/* Editor Panel */}
        <Box flex={1}>
          <Card bg={bgColor} border="1px solid" borderColor={borderColor} h="100%">
            <CardHeader>
              <Heading size="md">CSS Code</Heading>
            </CardHeader>
            <CardBody p={0}>
              <Box h="calc(100% - 60px)" overflow="hidden">
                <SyntaxHighlighter
                  language="css"
                  style={tomorrow}
                  customStyle={{
                    margin: 0,
                    height: '100%',
                    fontSize: '14px',
                    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                  }}
                  showLineNumbers
                  wrapLines
                >
                  {css || '/* Start writing your custom CSS here */'}
                </SyntaxHighlighter>
                <Textarea
                  value={css}
                  onChange={(e) => onChange(e.target.value)}
                  position="absolute"
                  top="60px"
                  left="0"
                  right="0"
                  bottom="0"
                  opacity={0}
                  zIndex={10}
                  fontFamily="Monaco, Menlo, Ubuntu Mono, monospace"
                  fontSize="14px"
                  resize="none"
                  border="none"
                  _focus={{ outline: 'none' }}
                />
              </Box>
            </CardBody>
          </Card>
        </Box>

        {/* Preview Panel */}
        {showPreview && (
          <Box flex={1}>
            <Card bg={bgColor} border="1px solid" borderColor={borderColor} h="100%">
              <CardHeader>
                <Heading size="md">Live Preview</Heading>
              </CardHeader>
              <CardBody>
                <Box
                  className="cms-content"
                  dangerouslySetInnerHTML={{
                    __html: `
                      <h1>Sample Heading</h1>
                      <p>This is a sample paragraph to preview your custom CSS styles. You can see how your typography, colors, spacing, and other styles will look.</p>
                      <h2>Subheading</h2>
                      <p>Another paragraph with <a href="#">a sample link</a> to test link styling.</p>
                      <blockquote>This is a blockquote to test your quote styling.</blockquote>
                      <ul>
                        <li>List item 1</li>
                        <li>List item 2</li>
                        <li>List item 3</li>
                      </ul>
                    `,
                  }}
                  style={{
                    // Apply custom styles for preview
                    fontFamily: customStyles.typography.fontFamily,
                    fontSize: customStyles.typography.fontSize,
                    lineHeight: customStyles.typography.lineHeight,
                    fontWeight: customStyles.typography.fontWeight,
                    color: customStyles.colors.text,
                    backgroundColor: customStyles.colors.background,
                    padding: customStyles.spacing.padding,
                    margin: customStyles.spacing.margin,
                    borderRadius: customStyles.borders.radius,
                    boxShadow: customStyles.shadows.boxShadow,
                  }}
                />
              </CardBody>
            </Card>
          </Box>
        )}
      </Box>

      {/* CSS Tips */}
      <Card bg={bgColor} border="1px solid" borderColor={borderColor}>
        <CardHeader>
          <Heading size="md">CSS Tips & Examples</Heading>
        </CardHeader>
        <CardBody>
          <VStack spacing={4} align="stretch">
            <Box>
              <Text fontSize="sm" fontWeight="semibold" mb={2}>
                Common Selectors:
              </Text>
              <Text fontSize="xs" fontFamily="mono" color="gray.600">
                .cms-content h1, .cms-content h2, .cms-content p, .cms-content a, .cms-content img, .cms-content blockquote
              </Text>
            </Box>
            
            <Box>
              <Text fontSize="sm" fontWeight="semibold" mb={2}>
                Useful Properties:
              </Text>
              <Text fontSize="xs" fontFamily="mono" color="gray.600">
                color, background-color, font-family, font-size, line-height, margin, padding, border, border-radius, box-shadow
              </Text>
            </Box>

            <Box>
              <Text fontSize="sm" fontWeight="semibold" mb={2}>
                Responsive Design:
              </Text>
              <Text fontSize="xs" fontFamily="mono" color="gray.600">
                @media (max-width: 768px) { '{ font-size: 14px; }' }
              </Text>
            </Box>
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  );
};


