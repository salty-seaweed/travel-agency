import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Switch,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Divider,
  useColorModeValue,
} from '@chakra-ui/react';

interface GridSettingsProps {
  gridEnabled: boolean;
  onGridToggle: (enabled: boolean) => void;
  gridSize: number;
  onGridSizeChange: (size: number) => void;
  snapToGrid: boolean;
  onSnapToGridToggle: (enabled: boolean) => void;
}

export const GridSettings: React.FC<GridSettingsProps> = ({
  gridEnabled,
  onGridToggle,
  gridSize,
  onGridSizeChange,
  snapToGrid,
  onSnapToGridToggle,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <>
      {/* Grid Settings Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Grid Settings</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={6} align="stretch">
              {/* Grid Toggle */}
              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="grid-enabled" mb="0" fontWeight="semibold">
                  Enable Grid
                </FormLabel>
                <Switch
                  id="grid-enabled"
                  isChecked={gridEnabled}
                  onChange={(e) => onGridToggle(e.target.checked)}
                />
              </FormControl>

              <Divider />

              {/* Grid Size */}
              <FormControl>
                <FormLabel fontWeight="semibold">Grid Size</FormLabel>
                <NumberInput
                  value={gridSize}
                  onChange={(_, value) => onGridSizeChange(value)}
                  min={5}
                  max={100}
                  step={5}
                  isDisabled={!gridEnabled}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <Text fontSize="sm" color="gray.500" mt={1}>
                  Size in pixels (5-100px)
                </Text>
              </FormControl>

              <Divider />

              {/* Snap to Grid */}
              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="snap-to-grid" mb="0" fontWeight="semibold">
                  Snap to Grid
                </FormLabel>
                <Switch
                  id="snap-to-grid"
                  isChecked={snapToGrid}
                  onChange={(e) => onSnapToGridToggle(e.target.checked)}
                  isDisabled={!gridEnabled}
                />
              </FormControl>

              <Text fontSize="sm" color="gray.500">
                When enabled, items will snap to the nearest grid intersection when moved or resized.
              </Text>

              <Divider />

              {/* Grid Preview */}
              <Box>
                <Text fontWeight="semibold" mb={3}>
                  Grid Preview
                </Text>
                <Box
                  width="200px"
                  height="120px"
                  bg="gray.50"
                  border="1px solid"
                  borderColor={borderColor}
                  borderRadius="md"
                  position="relative"
                  overflow="hidden"
                >
                  {gridEnabled && (
                    <Box
                      position="absolute"
                      top={0}
                      left={0}
                      right={0}
                      bottom={0}
                      background={`repeating-linear-gradient(
                        0deg,
                        transparent,
                        transparent ${gridSize - 1}px,
                        ${borderColor} 1px
                      ),
                      repeating-linear-gradient(
                        90deg,
                        transparent,
                        transparent ${gridSize - 1}px,
                        ${borderColor} 1px
                      )`}
                      opacity={0.3}
                    />
                  )}
                  <Box
                    position="absolute"
                    top="50%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                    width="60px"
                    height="40px"
                    bg="blue.500"
                    borderRadius="md"
                    opacity={0.7}
                  />
                </Box>
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="blue" onClick={onClose}>
              Apply
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};


