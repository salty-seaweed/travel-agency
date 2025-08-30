import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  Switch,
  FormControl,
  FormLabel,
  Heading,
  Divider,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react';

interface DroppedItem {
  id: string;
  type: string;
  name: string;
  description: string;
  icon: any;
  content: string;
  props: Record<string, any>;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  locked: boolean;
  visible: boolean;
  customStyles?: Record<string, any>;
  data?: Record<string, any>;
}

interface PropertiesPanelProps {
  selectedItems: string[];
  content: DroppedItem[];
  onItemUpdate: (itemId: string, updates: Partial<DroppedItem>) => void;
  onSelectedItemsUpdate: (updates: Partial<DroppedItem>) => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedItems,
  content,
  onItemUpdate,
  onSelectedItemsUpdate,
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');

  const selectedItem = selectedItems.length === 1 ? content.find(item => item.id === selectedItems[0]) : null;
  const multipleSelected = selectedItems.length > 1;

  if (selectedItems.length === 0) {
    return (
      <Box p={4} bg={bgColor} height="100%">
        <VStack spacing={4} align="stretch">
          <Heading size="md" color={textColor}>
            Properties
          </Heading>
          <Text color="gray.500" fontSize="sm">
            Select an item to view its properties
          </Text>
        </VStack>
      </Box>
    );
  }

  if (multipleSelected) {
    return (
      <Box p={4} bg={bgColor} height="100%" overflowY="auto">
        <VStack spacing={4} align="stretch">
          <Heading size="md" color={textColor}>
            Properties
          </Heading>
          <Badge colorScheme="blue" alignSelf="flex-start">
            {selectedItems.length} items selected
          </Badge>
          
          <Divider />
          
          {/* Common properties for multiple selection */}
          <Accordion allowMultiple>
            <AccordionItem>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  <Text fontWeight="semibold">Position & Size</Text>
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                <VStack spacing={3} align="stretch">
                  <HStack spacing={2}>
                    <FormControl>
                      <FormLabel fontSize="xs">X</FormLabel>
                      <NumberInput
                        size="sm"
                        value={0}
                        onChange={() => {}}
                        isDisabled
                      >
                        <NumberInputField />
                      </NumberInput>
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize="xs">Y</FormLabel>
                      <NumberInput
                        size="sm"
                        value={0}
                        onChange={() => {}}
                        isDisabled
                      >
                        <NumberInputField />
                      </NumberInput>
                    </FormControl>
                  </HStack>
                  <HStack spacing={2}>
                    <FormControl>
                      <FormLabel fontSize="xs">Width</FormLabel>
                      <NumberInput
                        size="sm"
                        value={0}
                        onChange={() => {}}
                        isDisabled
                      >
                        <NumberInputField />
                      </NumberInput>
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize="xs">Height</FormLabel>
                      <NumberInput
                        size="sm"
                        value={0}
                        onChange={() => {}}
                        isDisabled
                      >
                        <NumberInputField />
                      </NumberInput>
                    </FormControl>
                  </HStack>
                </VStack>
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  <Text fontWeight="semibold">Visibility & Lock</Text>
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                <VStack spacing={3} align="stretch">
                  <FormControl display="flex" alignItems="center">
                    <FormLabel fontSize="sm" mb={0}>
                      Visible
                    </FormLabel>
                    <Switch
                      size="sm"
                      isChecked={true}
                      onChange={() => {}}
                      isDisabled
                    />
                  </FormControl>
                  <FormControl display="flex" alignItems="center">
                    <FormLabel fontSize="sm" mb={0}>
                      Locked
                    </FormLabel>
                    <Switch
                      size="sm"
                      isChecked={false}
                      onChange={() => {}}
                      isDisabled
                    />
                  </FormControl>
                </VStack>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </VStack>
      </Box>
    );
  }

  if (!selectedItem) return null;

  return (
    <Box p={4} bg={bgColor} height="100%" overflowY="auto">
      <VStack spacing={4} align="stretch">
        <Heading size="md" color={textColor}>
          Properties
        </Heading>
        
        <Badge colorScheme="blue" alignSelf="flex-start">
          {selectedItem.type}
        </Badge>

        <Divider />

        <Accordion allowMultiple defaultIndex={[0]}>
          {/* Basic Properties */}
          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                <Text fontWeight="semibold">Basic</Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              <VStack spacing={3} align="stretch">
                <FormControl>
                  <FormLabel fontSize="xs">Name</FormLabel>
                  <Input
                    size="sm"
                    value={selectedItem.name}
                    onChange={(e) => onItemUpdate(selectedItem.id, { name: e.target.value })}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="xs">Type</FormLabel>
                  <Input
                    size="sm"
                    value={selectedItem.type}
                    isReadOnly
                    bg="gray.100"
                  />
                </FormControl>
              </VStack>
            </AccordionPanel>
          </AccordionItem>

          {/* Position & Size */}
          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                <Text fontWeight="semibold">Position & Size</Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              <VStack spacing={3} align="stretch">
                <HStack spacing={2}>
                  <FormControl>
                    <FormLabel fontSize="xs">X</FormLabel>
                    <NumberInput
                      size="sm"
                      value={selectedItem.position.x}
                      onChange={(_, value) => onItemUpdate(selectedItem.id, { 
                        position: { ...selectedItem.position, x: value } 
                      })}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="xs">Y</FormLabel>
                    <NumberInput
                      size="sm"
                      value={selectedItem.position.y}
                      onChange={(_, value) => onItemUpdate(selectedItem.id, { 
                        position: { ...selectedItem.position, y: value } 
                      })}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                </HStack>
                <HStack spacing={2}>
                  <FormControl>
                    <FormLabel fontSize="xs">Width</FormLabel>
                    <NumberInput
                      size="sm"
                      value={selectedItem.size.width}
                      onChange={(_, value) => onItemUpdate(selectedItem.id, { 
                        size: { ...selectedItem.size, width: value } 
                      })}
                      min={50}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="xs">Height</FormLabel>
                    <NumberInput
                      size="sm"
                      value={selectedItem.size.height}
                      onChange={(_, value) => onItemUpdate(selectedItem.id, { 
                        size: { ...selectedItem.size, height: value } 
                      })}
                      min={50}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                </HStack>
                <FormControl>
                  <FormLabel fontSize="xs">Z-Index</FormLabel>
                  <NumberInput
                    size="sm"
                    value={selectedItem.zIndex}
                    onChange={(_, value) => onItemUpdate(selectedItem.id, { zIndex: value })}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </VStack>
            </AccordionPanel>
          </AccordionItem>

          {/* Visibility & Lock */}
          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                <Text fontWeight="semibold">Visibility & Lock</Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              <VStack spacing={3} align="stretch">
                <FormControl display="flex" alignItems="center">
                  <FormLabel fontSize="sm" mb={0}>
                    Visible
                  </FormLabel>
                  <Switch
                    size="sm"
                    isChecked={selectedItem.visible}
                    onChange={(e) => onItemUpdate(selectedItem.id, { visible: e.target.checked })}
                  />
                </FormControl>
                <FormControl display="flex" alignItems="center">
                  <FormLabel fontSize="sm" mb={0}>
                    Locked
                  </FormLabel>
                  <Switch
                    size="sm"
                    isChecked={selectedItem.locked}
                    onChange={(e) => onItemUpdate(selectedItem.id, { locked: e.target.checked })}
                  />
                </FormControl>
              </VStack>
            </AccordionPanel>
          </AccordionItem>

          {/* Content */}
          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                <Text fontWeight="semibold">Content</Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              <VStack spacing={3} align="stretch">
                <FormControl>
                  <FormLabel fontSize="xs">Content</FormLabel>
                  <Input
                    size="sm"
                    value={selectedItem.content}
                    onChange={(e) => onItemUpdate(selectedItem.id, { content: e.target.value })}
                    placeholder="Enter content..."
                  />
                </FormControl>
              </VStack>
            </AccordionPanel>
          </AccordionItem>

          {/* Custom Styles */}
          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                <Text fontWeight="semibold">Custom Styles</Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              <VStack spacing={3} align="stretch">
                <FormControl>
                  <FormLabel fontSize="xs">Background Color</FormLabel>
                  <Input
                    size="sm"
                    type="color"
                    value={selectedItem.customStyles?.backgroundColor || '#ffffff'}
                    onChange={(e) => onItemUpdate(selectedItem.id, { 
                      customStyles: { 
                        ...selectedItem.customStyles, 
                        backgroundColor: e.target.value 
                      } 
                    })}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="xs">Border Radius</FormLabel>
                  <NumberInput
                    size="sm"
                    value={selectedItem.customStyles?.borderRadius || 0}
                    onChange={(_, value) => onItemUpdate(selectedItem.id, { 
                      customStyles: { 
                        ...selectedItem.customStyles, 
                        borderRadius: value 
                      } 
                    })}
                    min={0}
                    max={50}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </VStack>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </VStack>
    </Box>
  );
};


