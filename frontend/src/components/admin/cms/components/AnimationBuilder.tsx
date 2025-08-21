import React, { useState } from 'react';
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
  SimpleGrid,
  useColorModeValue,
  Input,
  Select,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Switch,
  FormControl,
  FormLabel,
  Textarea,
  Badge,
  IconButton,
  Tooltip,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import {
  PlayIcon,
  PauseIcon,
  ArrowPathIcon,
  PlusIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';

interface Animation {
  id: string;
  name: string;
  type: 'keyframe' | 'transition' | 'transform';
  target: string;
  duration: number;
  delay: number;
  easing: string;
  properties: any;
  enabled: boolean;
}

interface AnimationBuilderProps {
  animations: Animation[];
  onChange: (animations: Animation[]) => void;
}

export const AnimationBuilder: React.FC<AnimationBuilderProps> = ({
  animations,
  onChange,
}) => {
  const [selectedAnimation, setSelectedAnimation] = useState<Animation | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const easingFunctions = [
    { value: 'linear', label: 'Linear' },
    { value: 'ease', label: 'Ease' },
    { value: 'ease-in', label: 'Ease In' },
    { value: 'ease-out', label: 'Ease Out' },
    { value: 'ease-in-out', label: 'Ease In Out' },
    { value: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', label: 'Bounce' },
    { value: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', label: 'Smooth' },
  ];

  const animationTemplates = [
    {
      name: 'Fade In',
      type: 'keyframe' as const,
      properties: {
        opacity: [0, 1],
        transform: ['translateY(20px)', 'translateY(0)'],
      },
      duration: 600,
      easing: 'ease-out',
    },
    {
      name: 'Slide In Left',
      type: 'keyframe' as const,
      properties: {
        transform: ['translateX(-100%)', 'translateX(0)'],
        opacity: [0, 1],
      },
      duration: 500,
      easing: 'ease-out',
    },
    {
      name: 'Scale Up',
      type: 'keyframe' as const,
      properties: {
        transform: ['scale(0.8)', 'scale(1)'],
        opacity: [0, 1],
      },
      duration: 400,
      easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
    {
      name: 'Rotate In',
      type: 'keyframe' as const,
      properties: {
        transform: ['rotate(-180deg) scale(0.5)', 'rotate(0deg) scale(1)'],
        opacity: [0, 1],
      },
      duration: 800,
      easing: 'ease-out',
    },
    {
      name: 'Bounce',
      type: 'keyframe' as const,
      properties: {
        transform: ['translateY(0)', 'translateY(-20px)', 'translateY(0)'],
      },
      duration: 1000,
      easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
    {
      name: 'Hover Scale',
      type: 'transition' as const,
      properties: {
        transform: 'scale(1.05)',
      },
      duration: 200,
      easing: 'ease-in-out',
    },
  ];

  const handleAddAnimation = () => {
    const newAnimation: Animation = {
      id: `animation-${Date.now()}`,
      name: 'New Animation',
      type: 'keyframe',
      target: '.cms-content h1',
      duration: 500,
      delay: 0,
      easing: 'ease-out',
      properties: {
        opacity: [0, 1],
        transform: ['translateY(20px)', 'translateY(0)'],
      },
      enabled: true,
    };
    onChange([...animations, newAnimation]);
    setSelectedAnimation(newAnimation);
  };

  const handleDeleteAnimation = (id: string) => {
    const updatedAnimations = animations.filter(anim => anim.id !== id);
    onChange(updatedAnimations);
    if (selectedAnimation?.id === id) {
      setSelectedAnimation(null);
    }
  };

  const handleUpdateAnimation = (id: string, updates: Partial<Animation>) => {
    const updatedAnimations = animations.map(anim =>
      anim.id === id ? { ...anim, ...updates } : anim
    );
    onChange(updatedAnimations);
    if (selectedAnimation?.id === id) {
      setSelectedAnimation({ ...selectedAnimation, ...updates });
    }
  };

  const handleApplyTemplate = (template: any) => {
    const newAnimation: Animation = {
      id: `animation-${Date.now()}`,
      name: template.name,
      type: template.type,
      target: '.cms-content h1',
      duration: template.duration,
      delay: 0,
      easing: template.easing,
      properties: template.properties,
      enabled: true,
    };
    onChange([...animations, newAnimation]);
    setSelectedAnimation(newAnimation);
  };

  const generateCSS = (animation: Animation) => {
    if (animation.type === 'keyframe') {
      const keyframes = Object.entries(animation.properties).map(([prop, values]) => {
        if (Array.isArray(values)) {
          return `${prop}: ${values[0]};`;
        }
        return `${prop}: ${values};`;
      }).join('\n  ');

      return `@keyframes ${animation.name.replace(/\s+/g, '-').toLowerCase()} {
  0% {
    ${keyframes}
  }
  100% {
    ${Object.entries(animation.properties).map(([prop, values]) => {
      if (Array.isArray(values)) {
        return `${prop}: ${values[values.length - 1]};`;
      }
      return `${prop}: ${values};`;
    }).join('\n    ')}
  }
}

${animation.target} {
  animation: ${animation.name.replace(/\s+/g, '-').toLowerCase()} ${animation.duration}ms ${animation.easing} ${animation.delay}ms forwards;
}`;
    } else if (animation.type === 'transition') {
      return `${animation.target} {
  transition: all ${animation.duration}ms ${animation.easing};
}

${animation.target}:hover {
  ${Object.entries(animation.properties).map(([prop, value]) => `${prop}: ${value};`).join('\n  ')}
}`;
    }
    return '';
  };

  const generateAllCSS = () => {
    return animations
      .filter(anim => anim.enabled)
      .map(anim => generateCSS(anim))
      .join('\n\n');
  };

  return (
    <VStack spacing={6} align="stretch" p={4}>
      {/* Header */}
      <HStack justify="space-between">
        <Box>
          <Heading size="lg" mb={2}>Animation Builder</Heading>
          <Text color="gray.600">
            Create custom animations and transitions for your page elements.
          </Text>
        </Box>
        <HStack spacing={3}>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </Button>
          <Button
            size="sm"
            colorScheme="blue"
            onClick={handleAddAnimation}
          >
            <PlusIcon className="w-4 h-4" />
            Add Animation
          </Button>
        </HStack>
      </HStack>

      <Box display="flex" gap={6} h="600px">
        {/* Animation List */}
        <Box flex={1}>
          <Card bg={bgColor} border="1px solid" borderColor={borderColor} h="100%">
            <CardHeader>
              <Heading size="md">Animations ({animations.length})</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={3} align="stretch" maxH="calc(100% - 80px)" overflowY="auto">
                {animations.length === 0 ? (
                  <Alert status="info">
                    <AlertIcon />
                    <Box>
                      <AlertTitle>No animations yet!</AlertTitle>
                      <AlertDescription>
                        Create your first animation or choose from templates below.
                      </AlertDescription>
                    </Box>
                  </Alert>
                ) : (
                  animations.map(animation => (
                    <Card
                      key={animation.id}
                      bg={selectedAnimation?.id === animation.id ? 'blue.50' : bgColor}
                      border="1px solid"
                      borderColor={selectedAnimation?.id === animation.id ? 'blue.200' : borderColor}
                      cursor="pointer"
                      onClick={() => setSelectedAnimation(animation)}
                    >
                      <CardBody p={3}>
                        <HStack justify="space-between">
                          <VStack align="start" spacing={1}>
                            <HStack>
                              <Text fontWeight="semibold">{animation.name}</Text>
                              <Badge colorScheme={animation.enabled ? 'green' : 'gray'} size="sm">
                                {animation.enabled ? 'Active' : 'Disabled'}
                              </Badge>
                            </HStack>
                            <Text fontSize="sm" color="gray.600">
                              {animation.target} • {animation.duration}ms
                            </Text>
                          </VStack>
                          <HStack>
                            <Switch
                              size="sm"
                              isChecked={animation.enabled}
                              onChange={(e) => handleUpdateAnimation(animation.id, { enabled: e.target.checked })}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <IconButton
                              size="sm"
                              variant="ghost"
                              icon={<TrashIcon className="w-4 h-4" />}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteAnimation(animation.id);
                              }}
                              aria-label="Delete animation"
                            />
                          </HStack>
                        </HStack>
                      </CardBody>
                    </Card>
                  ))
                )}
              </VStack>
            </CardBody>
          </Card>
        </Box>

        {/* Animation Editor */}
        <Box flex={1}>
          <Card bg={bgColor} border="1px solid" borderColor={borderColor} h="100%">
            <CardHeader>
              <Heading size="md">
                {selectedAnimation ? `Edit: ${selectedAnimation.name}` : 'Animation Editor'}
              </Heading>
            </CardHeader>
            <CardBody>
              {selectedAnimation ? (
                <VStack spacing={4} align="stretch">
                  <FormControl>
                    <FormLabel>Animation Name</FormLabel>
                    <Input
                      value={selectedAnimation.name}
                      onChange={(e) => handleUpdateAnimation(selectedAnimation.id, { name: e.target.value })}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Target Selector</FormLabel>
                    <Input
                      value={selectedAnimation.target}
                      onChange={(e) => handleUpdateAnimation(selectedAnimation.id, { target: e.target.value })}
                      placeholder=".cms-content h1"
                    />
                  </FormControl>

                  <HStack spacing={4}>
                    <FormControl>
                      <FormLabel>Duration (ms)</FormLabel>
                      <Input
                        type="number"
                        value={selectedAnimation.duration}
                        onChange={(e) => handleUpdateAnimation(selectedAnimation.id, { duration: parseInt(e.target.value) })}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Delay (ms)</FormLabel>
                      <Input
                        type="number"
                        value={selectedAnimation.delay}
                        onChange={(e) => handleUpdateAnimation(selectedAnimation.id, { delay: parseInt(e.target.value) })}
                      />
                    </FormControl>
                  </HStack>

                  <FormControl>
                    <FormLabel>Easing Function</FormLabel>
                    <Select
                      value={selectedAnimation.easing}
                      onChange={(e) => handleUpdateAnimation(selectedAnimation.id, { easing: e.target.value })}
                    >
                      {easingFunctions.map(easing => (
                        <option key={easing.value} value={easing.value}>
                          {easing.label}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Properties (CSS)</FormLabel>
                    <Textarea
                      value={JSON.stringify(selectedAnimation.properties, null, 2)}
                      onChange={(e) => {
                        try {
                          const properties = JSON.parse(e.target.value);
                          handleUpdateAnimation(selectedAnimation.id, { properties });
                        } catch (error) {
                          // Invalid JSON, ignore
                        }
                      }}
                      placeholder='{"opacity": [0, 1], "transform": ["translateY(20px)", "translateY(0)"]}'
                      fontFamily="mono"
                      fontSize="sm"
                      rows={6}
                    />
                  </FormControl>

                  <HStack justify="space-between">
                    <Text fontSize="sm" fontWeight="semibold">Generated CSS:</Text>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigator.clipboard.writeText(generateCSS(selectedAnimation))}
                    >
                      Copy CSS
                    </Button>
                  </HStack>
                  <Box
                    bg="gray.900"
                    color="green.400"
                    p={3}
                    borderRadius="md"
                    fontFamily="mono"
                    fontSize="xs"
                    overflowX="auto"
                    maxH="200px"
                    overflowY="auto"
                  >
                    {generateCSS(selectedAnimation)}
                  </Box>
                </VStack>
              ) : (
                <Box textAlign="center" py={12}>
                  <Text color="gray.500">Select an animation to edit its properties</Text>
                </Box>
              )}
            </CardBody>
          </Card>
        </Box>

        {/* Preview Panel */}
        {showPreview && (
          <Box flex={1}>
            <Card bg={bgColor} border="1px solid" borderColor={borderColor} h="100%">
              <CardHeader>
                <HStack justify="space-between">
                  <Heading size="md">Live Preview</Heading>
                  <HStack spacing={2}>
                    <IconButton
                      size="sm"
                      icon={isPlaying ? <PauseIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4" />}
                      onClick={() => setIsPlaying(!isPlaying)}
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                    />
                    <IconButton
                      size="sm"
                      icon={<ArrowPathIcon className="w-4 h-4" />}
                      onClick={() => setIsPlaying(false)}
                      aria-label="Reset"
                    />
                  </HStack>
                </HStack>
              </CardHeader>
              <CardBody>
                <Box
                  className="cms-content"
                  dangerouslySetInnerHTML={{
                    __html: `
                      <h1>Animated Heading</h1>
                      <p>This paragraph will show animation effects.</p>
                      <div style="width: 100px; height: 100px; background: blue; border-radius: 8px;"></div>
                    `,
                  }}
                  style={{
                    // Apply animations
                    ...(isPlaying && {
                      animation: animations
                        .filter(anim => anim.enabled)
                        .map(anim => `${anim.name.replace(/\s+/g, '-').toLowerCase()} ${anim.duration}ms ${anim.easing} ${anim.delay}ms`)
                        .join(', '),
                    }),
                  }}
                />
                <style>{generateAllCSS()}</style>
              </CardBody>
            </Card>
          </Box>
        )}
      </Box>

      {/* Animation Templates */}
      <Card bg={bgColor} border="1px solid" borderColor={borderColor}>
        <CardHeader>
          <Heading size="md">Animation Templates</Heading>
        </CardHeader>
        <CardBody>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            {animationTemplates.map(template => (
              <Card
                key={template.name}
                bg={bgColor}
                border="1px solid"
                borderColor={borderColor}
                cursor="pointer"
                transition="all 0.2s"
                _hover={{
                  borderColor: 'blue.300',
                  transform: 'translateY(-2px)',
                  shadow: 'lg',
                }}
                onClick={() => handleApplyTemplate(template)}
              >
                <CardBody>
                  <VStack spacing={2} align="stretch">
                    <Heading size="sm">{template.name}</Heading>
                    <Text fontSize="sm" color="gray.600">
                      {template.type} • {template.duration}ms
                    </Text>
                    <Badge colorScheme="blue" size="sm" alignSelf="start">
                      {template.type}
                    </Badge>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </CardBody>
      </Card>
    </VStack>
  );
};
