import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Select,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Divider,
  SimpleGrid,
  useColorModeValue,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
} from '@chakra-ui/react';
import { SketchPicker } from 'react-color';

interface StyleCustomizerProps {
  styles: any;
  onChange: (styles: any) => void;
}

export const StyleCustomizer: React.FC<StyleCustomizerProps> = ({
  styles,
  onChange,
}) => {
  const [activeColorPicker, setActiveColorPicker] = useState<string | null>(null);
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleColorChange = (colorKey: string, color: string) => {
    onChange({
      colors: {
        ...styles.colors,
        [colorKey]: color,
      },
    });
  };

  const handleTypographyChange = (property: string, value: string) => {
    onChange({
      typography: {
        ...styles.typography,
        [property]: value,
      },
    });
  };

  const handleSpacingChange = (property: string, value: string) => {
    onChange({
      spacing: {
        ...styles.spacing,
        [property]: value,
      },
    });
  };

  const handleBorderChange = (property: string, value: string) => {
    onChange({
      borders: {
        ...styles.borders,
        [property]: value,
      },
    });
  };

  const handleShadowChange = (value: string) => {
    onChange({
      shadows: {
        boxShadow: value,
      },
    });
  };

  const ColorPicker = ({ color, onChange, label }: any) => (
    <Popover
      isOpen={activeColorPicker === label}
      onClose={() => setActiveColorPicker(null)}
    >
      <PopoverTrigger>
        <Button
          size="sm"
          onClick={() => setActiveColorPicker(label)}
          bg={color}
          border="2px solid"
          borderColor={borderColor}
          _hover={{ opacity: 0.8 }}
        >
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody>
          <SketchPicker
            color={color}
            onChange={(color) => onChange(color.hex)}
          />
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );

  return (
    <VStack spacing={6} align="stretch" p={4}>
      {/* Colors Section */}
      <Card bg={bgColor} border="1px solid" borderColor={borderColor}>
        <CardHeader>
          <Heading size="md">Colors</Heading>
        </CardHeader>
        <CardBody>
          <SimpleGrid columns={2} spacing={4}>
            <VStack align="start" spacing={2}>
              <Text fontSize="sm" fontWeight="semibold">Primary</Text>
              <ColorPicker
                color={styles.colors.primary}
                onChange={(color: string) => handleColorChange('primary', color)}
                label="Primary"
              />
            </VStack>
            <VStack align="start" spacing={2}>
              <Text fontSize="sm" fontWeight="semibold">Secondary</Text>
              <ColorPicker
                color={styles.colors.secondary}
                onChange={(color: string) => handleColorChange('secondary', color)}
                label="Secondary"
              />
            </VStack>
            <VStack align="start" spacing={2}>
              <Text fontSize="sm" fontWeight="semibold">Accent</Text>
              <ColorPicker
                color={styles.colors.accent}
                onChange={(color: string) => handleColorChange('accent', color)}
                label="Accent"
              />
            </VStack>
            <VStack align="start" spacing={2}>
              <Text fontSize="sm" fontWeight="semibold">Background</Text>
              <ColorPicker
                color={styles.colors.background}
                onChange={(color: string) => handleColorChange('background', color)}
                label="Background"
              />
            </VStack>
            <VStack align="start" spacing={2}>
              <Text fontSize="sm" fontWeight="semibold">Text</Text>
              <ColorPicker
                color={styles.colors.text}
                onChange={(color: string) => handleColorChange('text', color)}
                label="Text"
              />
            </VStack>
          </SimpleGrid>
        </CardBody>
      </Card>

      {/* Typography Section */}
      <Card bg={bgColor} border="1px solid" borderColor={borderColor}>
        <CardHeader>
          <Heading size="md">Typography</Heading>
        </CardHeader>
        <CardBody>
          <VStack spacing={4} align="stretch">
            <Box>
              <Text fontSize="sm" fontWeight="semibold" mb={2}>Font Family</Text>
              <Select
                value={styles.typography.fontFamily}
                onChange={(e) => handleTypographyChange('fontFamily', e.target.value)}
              >
                <option value="Inter, sans-serif">Inter</option>
                <option value="Roboto, sans-serif">Roboto</option>
                <option value="Open Sans, sans-serif">Open Sans</option>
                <option value="Lato, sans-serif">Lato</option>
                <option value="Poppins, sans-serif">Poppins</option>
                <option value="Montserrat, sans-serif">Montserrat</option>
                <option value="Source Sans Pro, sans-serif">Source Sans Pro</option>
                <option value="Ubuntu, sans-serif">Ubuntu</option>
              </Select>
            </Box>

            <Box>
              <Text fontSize="sm" fontWeight="semibold" mb={2}>Font Size</Text>
              <Input
                value={styles.typography.fontSize}
                onChange={(e) => handleTypographyChange('fontSize', e.target.value)}
                placeholder="16px"
              />
            </Box>

            <Box>
              <Text fontSize="sm" fontWeight="semibold" mb={2}>Line Height</Text>
              <Input
                value={styles.typography.lineHeight}
                onChange={(e) => handleTypographyChange('lineHeight', e.target.value)}
                placeholder="1.6"
              />
            </Box>

            <Box>
              <Text fontSize="sm" fontWeight="semibold" mb={2}>Font Weight</Text>
              <Select
                value={styles.typography.fontWeight}
                onChange={(e) => handleTypographyChange('fontWeight', e.target.value)}
              >
                <option value="100">100 - Thin</option>
                <option value="200">200 - Extra Light</option>
                <option value="300">300 - Light</option>
                <option value="400">400 - Normal</option>
                <option value="500">500 - Medium</option>
                <option value="600">600 - Semi Bold</option>
                <option value="700">700 - Bold</option>
                <option value="800">800 - Extra Bold</option>
                <option value="900">900 - Black</option>
              </Select>
            </Box>
          </VStack>
        </CardBody>
      </Card>

      {/* Spacing Section */}
      <Card bg={bgColor} border="1px solid" borderColor={borderColor}>
        <CardHeader>
          <Heading size="md">Spacing</Heading>
        </CardHeader>
        <CardBody>
          <VStack spacing={4} align="stretch">
            <Box>
              <Text fontSize="sm" fontWeight="semibold" mb={2}>Padding</Text>
              <Input
                value={styles.spacing.padding}
                onChange={(e) => handleSpacingChange('padding', e.target.value)}
                placeholder="1rem"
              />
            </Box>

            <Box>
              <Text fontSize="sm" fontWeight="semibold" mb={2}>Margin</Text>
              <Input
                value={styles.spacing.margin}
                onChange={(e) => handleSpacingChange('margin', e.target.value)}
                placeholder="0"
              />
            </Box>

            <Box>
              <Text fontSize="sm" fontWeight="semibold" mb={2}>Gap</Text>
              <Input
                value={styles.spacing.gap}
                onChange={(e) => handleSpacingChange('gap', e.target.value)}
                placeholder="1rem"
              />
            </Box>
          </VStack>
        </CardBody>
      </Card>

      {/* Borders Section */}
      <Card bg={bgColor} border="1px solid" borderColor={borderColor}>
        <CardHeader>
          <Heading size="md">Borders</Heading>
        </CardHeader>
        <CardBody>
          <VStack spacing={4} align="stretch">
            <Box>
              <Text fontSize="sm" fontWeight="semibold" mb={2}>Border Radius</Text>
              <Input
                value={styles.borders.radius}
                onChange={(e) => handleBorderChange('radius', e.target.value)}
                placeholder="0.5rem"
              />
            </Box>

            <Box>
              <Text fontSize="sm" fontWeight="semibold" mb={2}>Border Width</Text>
              <Input
                value={styles.borders.width}
                onChange={(e) => handleBorderChange('width', e.target.value)}
                placeholder="1px"
              />
            </Box>

            <Box>
              <Text fontSize="sm" fontWeight="semibold" mb={2}>Border Style</Text>
              <Select
                value={styles.borders.style}
                onChange={(e) => handleBorderChange('style', e.target.value)}
              >
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
                <option value="dotted">Dotted</option>
                <option value="double">Double</option>
                <option value="none">None</option>
              </Select>
            </Box>

            <Box>
              <Text fontSize="sm" fontWeight="semibold" mb={2}>Border Color</Text>
              <ColorPicker
                color={styles.borders.color}
                onChange={(color: string) => handleBorderChange('color', color)}
                label="Border"
              />
            </Box>
          </VStack>
        </CardBody>
      </Card>

      {/* Shadows Section */}
      <Card bg={bgColor} border="1px solid" borderColor={borderColor}>
        <CardHeader>
          <Heading size="md">Shadows</Heading>
        </CardHeader>
        <CardBody>
          <VStack spacing={4} align="stretch">
            <Box>
              <Text fontSize="sm" fontWeight="semibold" mb={2}>Box Shadow</Text>
              <Input
                value={styles.shadows.boxShadow}
                onChange={(e) => handleShadowChange(e.target.value)}
                placeholder="0 1px 3px 0 rgba(0, 0, 0, 0.1)"
              />
            </Box>

            <HStack spacing={4}>
              <Button
                size="sm"
                onClick={() => handleShadowChange('none')}
              >
                No Shadow
              </Button>
              <Button
                size="sm"
                onClick={() => handleShadowChange('0 1px 3px 0 rgba(0, 0, 0, 0.1)')}
              >
                Small
              </Button>
              <Button
                size="sm"
                onClick={() => handleShadowChange('0 4px 6px -1px rgba(0, 0, 0, 0.1)')}
              >
                Medium
              </Button>
              <Button
                size="sm"
                onClick={() => handleShadowChange('0 10px 15px -3px rgba(0, 0, 0, 0.1)')}
              >
                Large
              </Button>
            </HStack>
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  );
};
