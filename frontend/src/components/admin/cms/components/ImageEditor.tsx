import React, { useState, useRef, useCallback } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  useColorModeValue,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Input,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Select,
  Switch,
  FormControl,
  FormLabel,
  IconButton,
  Tooltip,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  SimpleGrid,
  Divider,
  Image,
  Badge,
} from '@chakra-ui/react';
import {
  PhotoIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  MagnifyingGlassIcon,
  CropIcon,
  AdjustmentsHorizontalIcon,
  EyeIcon,
  EyeSlashIcon,
  TrashIcon,
  PlusIcon,
  ArrowUpTrayIcon,
} from '@heroicons/react/24/outline';

interface ImageFilter {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  grayscale: boolean;
  sepia: boolean;
}

interface ImageEditorProps {
  imageUrl?: string;
  onImageChange: (imageUrl: string, filters: ImageFilter) => void;
  onClose?: () => void;
}

export const ImageEditor: React.FC<ImageEditorProps> = ({ 
  imageUrl, 
  onImageChange, 
  onClose 
}) => {
  const [selectedImage, setSelectedImage] = useState<string>(imageUrl || '');
  const [filters, setFilters] = useState<ImageFilter>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    grayscale: false,
    sepia: false,
  });
  const [cropMode, setCropMode] = useState(false);
  const [zoom, setZoom] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setSelectedImage(result);
        onImageChange(result, filters);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFilterChange = (filter: keyof ImageFilter, value: number | boolean) => {
    const newFilters = { ...filters, [filter]: value };
    setFilters(newFilters);
    onImageChange(selectedImage, newFilters);
  };

  const resetFilters = () => {
    const defaultFilters: ImageFilter = {
      brightness: 100,
      contrast: 100,
      saturation: 100,
      blur: 0,
      grayscale: false,
      sepia: false,
    };
    setFilters(defaultFilters);
    onImageChange(selectedImage, defaultFilters);
  };

  const generateFilterStyle = () => {
    const filterString = [
      `brightness(${filters.brightness}%)`,
      `contrast(${filters.contrast}%)`,
      `saturate(${filters.saturation}%)`,
      `blur(${filters.blur}px)`,
      filters.grayscale ? 'grayscale(100%)' : '',
      filters.sepia ? 'sepia(100%)' : '',
    ].filter(Boolean).join(' ');
    
    return filterString;
  };

  const presetFilters = [
    { name: 'Original', filters: { brightness: 100, contrast: 100, saturation: 100, blur: 0, grayscale: false, sepia: false } },
    { name: 'Vintage', filters: { brightness: 110, contrast: 120, saturation: 80, blur: 0, grayscale: false, sepia: true } },
    { name: 'Black & White', filters: { brightness: 100, contrast: 120, saturation: 0, blur: 0, grayscale: true, sepia: false } },
    { name: 'Bright', filters: { brightness: 120, contrast: 110, saturation: 120, blur: 0, grayscale: false, sepia: false } },
    { name: 'Moody', filters: { brightness: 80, contrast: 130, saturation: 70, blur: 1, grayscale: false, sepia: false } },
    { name: 'Warm', filters: { brightness: 105, contrast: 110, saturation: 130, blur: 0, grayscale: false, sepia: true } },
  ];

  const applyPreset = (preset: typeof presetFilters[0]) => {
    setFilters(preset.filters);
    onImageChange(selectedImage, preset.filters);
  };

  if (!selectedImage) {
    return (
      <Box>
        <VStack spacing={6} align="stretch">
          <Box>
            <Heading size="lg" color={textColor} mb={2}>
              Image Editor
            </Heading>
            <Text color="gray.600">
              Upload an image to start editing
            </Text>
          </Box>

          <Card bg={bgColor} border="1px solid" borderColor={borderColor}>
            <CardBody>
              <VStack spacing={4}>
                <Box
                  border="2px dashed"
                  borderColor="gray.300"
                  borderRadius="md"
                  p={8}
                  textAlign="center"
                  cursor="pointer"
                  onClick={() => fileInputRef.current?.click()}
                  _hover={{ borderColor: 'blue.400', bg: 'blue.50' }}
                  transition="all 0.2s"
                >
                  <ArrowUpTrayIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <Text fontWeight="semibold" color={textColor}>
                    Click to upload image
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    PNG, JPG, GIF up to 10MB
                  </Text>
                </Box>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Box>
    );
  }

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box>
          <Heading size="lg" color={textColor} mb={2}>
            Image Editor
          </Heading>
          <Text color="gray.600">
            Edit your image with filters, adjustments, and effects
          </Text>
        </Box>

        <Box display="flex" gap={6} h="600px">
          {/* Image Preview */}
          <Box flex={1} bg={bgColor} border="1px solid" borderColor={borderColor} borderRadius="md" p={4}>
            <Box
              h="100%"
              bg="gray.100"
              borderRadius="md"
              display="flex"
              alignItems="center"
              justifyContent="center"
              overflow="hidden"
              position="relative"
            >
              <Image
                src={selectedImage}
                alt="Editing preview"
                maxW="100%"
                maxH="100%"
                objectFit="contain"
                style={{
                  filter: generateFilterStyle(),
                  transform: `scale(${zoom})`,
                }}
                transition="all 0.3s ease"
              />
            </Box>
          </Box>

          {/* Controls Panel */}
          <Box w="350px" bg={bgColor} border="1px solid" borderColor={borderColor} borderRadius="md" p={4} overflowY="auto">
            <VStack spacing={6} align="stretch">
              {/* Preset Filters */}
              <Box>
                <Heading size="md" mb={3} color={textColor}>
                  Preset Filters
                </Heading>
                <SimpleGrid columns={2} spacing={2}>
                  {presetFilters.map((preset) => (
                    <Button
                      key={preset.name}
                      size="sm"
                      variant="outline"
                      onClick={() => applyPreset(preset)}
                    >
                      {preset.name}
                    </Button>
                  ))}
                </SimpleGrid>
              </Box>

              <Divider />

              {/* Basic Adjustments */}
              <Box>
                <Heading size="md" mb={3} color={textColor}>
                  Adjustments
                </Heading>
                <VStack spacing={4} align="stretch">
                  <FormControl>
                    <FormLabel fontSize="sm">Brightness</FormLabel>
                    <Slider
                      value={filters.brightness}
                      onChange={(value) => handleFilterChange('brightness', value)}
                      min={0}
                      max={200}
                      step={1}
                    >
                      <SliderTrack>
                        <SliderFilledTrack />
                      </SliderTrack>
                      <SliderThumb />
                    </Slider>
                    <Text fontSize="xs" color="gray.500">{filters.brightness}%</Text>
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm">Contrast</FormLabel>
                    <Slider
                      value={filters.contrast}
                      onChange={(value) => handleFilterChange('contrast', value)}
                      min={0}
                      max={200}
                      step={1}
                    >
                      <SliderTrack>
                        <SliderFilledTrack />
                      </SliderTrack>
                      <SliderThumb />
                    </Slider>
                    <Text fontSize="xs" color="gray.500">{filters.contrast}%</Text>
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm">Saturation</FormLabel>
                    <Slider
                      value={filters.saturation}
                      onChange={(value) => handleFilterChange('saturation', value)}
                      min={0}
                      max={200}
                      step={1}
                    >
                      <SliderTrack>
                        <SliderFilledTrack />
                      </SliderTrack>
                      <SliderThumb />
                    </Slider>
                    <Text fontSize="xs" color="gray.500">{filters.saturation}%</Text>
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm">Blur</FormLabel>
                    <Slider
                      value={filters.blur}
                      onChange={(value) => handleFilterChange('blur', value)}
                      min={0}
                      max={10}
                      step={0.1}
                    >
                      <SliderTrack>
                        <SliderFilledTrack />
                      </SliderTrack>
                      <SliderThumb />
                    </Slider>
                    <Text fontSize="xs" color="gray.500">{filters.blur}px</Text>
                  </FormControl>
                </VStack>
              </Box>

              <Divider />

              {/* Effects */}
              <Box>
                <Heading size="md" mb={3} color={textColor}>
                  Effects
                </Heading>
                <VStack spacing={3} align="stretch">
                  <FormControl display="flex" alignItems="center">
                    <FormLabel fontSize="sm" mb={0}>
                      Grayscale
                    </FormLabel>
                    <Switch
                      isChecked={filters.grayscale}
                      onChange={(e) => handleFilterChange('grayscale', e.target.checked)}
                    />
                  </FormControl>

                  <FormControl display="flex" alignItems="center">
                    <FormLabel fontSize="sm" mb={0}>
                      Sepia
                    </FormLabel>
                    <Switch
                      isChecked={filters.sepia}
                      onChange={(e) => handleFilterChange('sepia', e.target.checked)}
                    />
                  </FormControl>
                </VStack>
              </Box>

              <Divider />

              {/* Zoom Control */}
              <Box>
                <Heading size="md" mb={3} color={textColor}>
                  Zoom
                </Heading>
                <FormControl>
                  <Slider
                    value={zoom}
                    onChange={setZoom}
                    min={0.1}
                    max={3}
                    step={0.1}
                  >
                    <SliderTrack>
                      <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb />
                  </Slider>
                  <Text fontSize="xs" color="gray.500">{Math.round(zoom * 100)}%</Text>
                </FormControl>
              </Box>

              <Divider />

              {/* Actions */}
              <VStack spacing={3} align="stretch">
                <Button
                  leftIcon={<ArrowUturnLeftIcon className="w-4 h-4" />}
                  onClick={resetFilters}
                  variant="outline"
                >
                  Reset Filters
                </Button>
                
                <Button
                  leftIcon={<PlusIcon className="w-4 h-4" />}
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                >
                  Upload New Image
                </Button>

                {onClose && (
                  <Button
                    onClick={onClose}
                    colorScheme="blue"
                  >
                    Done
                  </Button>
                )}
              </VStack>
            </VStack>
          </Box>
        </Box>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
        />
      </VStack>
    </Box>
  );
};
