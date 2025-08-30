import React from 'react';
import {
  Box,
  HStack,
  Button,
  IconButton,
  Tooltip,
  Divider,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Switch,
  FormControl,
  FormLabel,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  CursorArrowRaysIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ViewColumnsIcon,
  EyeIcon,
  EyeSlashIcon,
  MagnifyingGlassIcon,
  MinusIcon,
  PlusIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

interface ToolbarProps {
  selectedCount: number;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onBringToFront: () => void;
  onSendToBack: () => void;
  dragMode: 'move' | 'select' | 'resize';
  onDragModeChange: (mode: 'move' | 'select' | 'resize') => void;
  gridEnabled: boolean;
  onGridToggle: (enabled: boolean) => void;
  snapToGrid: boolean;
  onSnapToGridToggle: (enabled: boolean) => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  showRulers: boolean;
  onShowRulersToggle: (enabled: boolean) => void;
  showGuides: boolean;
  onShowGuidesToggle: (enabled: boolean) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  selectedCount,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onDelete,
  onDuplicate,
  onSelectAll,
  onDeselectAll,
  onBringToFront,
  onSendToBack,
  dragMode,
  onDragModeChange,
  gridEnabled,
  onGridToggle,
  snapToGrid,
  onSnapToGridToggle,
  zoom,
  onZoomChange,
  showRulers,
  onShowRulersToggle,
  showGuides,
  onShowGuidesToggle,
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');

  return (
    <Box
      bg={bgColor}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="md"
      p={3}
    >
      <HStack spacing={4} justify="space-between">
        {/* Left side - History and Selection */}
        <HStack spacing={2}>
          {/* History */}
          <Tooltip label="Undo (Ctrl+Z)">
            <IconButton
              size="sm"
              variant="ghost"
              icon={<ArrowUturnLeftIcon className="w-4 h-4" />}
              onClick={onUndo}
              isDisabled={!canUndo}
              aria-label="Undo"
            />
          </Tooltip>
          <Tooltip label="Redo (Ctrl+Y)">
            <IconButton
              size="sm"
              variant="ghost"
              icon={<ArrowUturnRightIcon className="w-4 h-4" />}
              onClick={onRedo}
              isDisabled={!canRedo}
              aria-label="Redo"
            />
          </Tooltip>

          <Divider orientation="vertical" height="24px" />

          {/* Selection */}
          <Tooltip label="Select All (Ctrl+A)">
            <Button size="sm" variant="ghost" onClick={onSelectAll}>
              Select All
            </Button>
          </Tooltip>
          <Tooltip label="Deselect All (Esc)">
            <Button size="sm" variant="ghost" onClick={onDeselectAll}>
              Deselect
            </Button>
          </Tooltip>

          {selectedCount > 0 && (
            <>
              <Divider orientation="vertical" height="24px" />
              
              {/* Item Actions */}
              <Tooltip label="Delete (Del)">
                <IconButton
                  size="sm"
                  variant="ghost"
                  icon={<TrashIcon className="w-4 h-4" />}
                  onClick={onDelete}
                  aria-label="Delete"
                />
              </Tooltip>
              <Tooltip label="Duplicate (Ctrl+D)">
                <IconButton
                  size="sm"
                  variant="ghost"
                  icon={<DocumentDuplicateIcon className="w-4 h-4" />}
                  onClick={onDuplicate}
                  aria-label="Duplicate"
                />
              </Tooltip>
              <Tooltip label="Bring to Front">
                <IconButton
                  size="sm"
                  variant="ghost"
                  icon={<ArrowUpIcon className="w-4 h-4" />}
                  onClick={onBringToFront}
                  aria-label="Bring to Front"
                />
              </Tooltip>
              <Tooltip label="Send to Back">
                <IconButton
                  size="sm"
                  variant="ghost"
                  icon={<ArrowDownIcon className="w-4 h-4" />}
                  onClick={onSendToBack}
                  aria-label="Send to Back"
                />
              </Tooltip>
            </>
          )}
        </HStack>

        {/* Center - Tools */}
        <HStack spacing={2}>
          {/* Drag Mode */}
          <Select
            size="sm"
            width="120px"
            value={dragMode}
            onChange={(e) => onDragModeChange(e.target.value as 'move' | 'select' | 'resize')}
          >
            <option value="select">Select</option>
            <option value="move">Move</option>
            <option value="resize">Resize</option>
          </Select>

          <Divider orientation="vertical" height="24px" />

          {/* Grid Controls */}
          <Tooltip label="Toggle Grid">
            <IconButton
              size="sm"
              variant={gridEnabled ? "solid" : "ghost"}
              colorScheme={gridEnabled ? "blue" : "gray"}
              icon={<ViewColumnsIcon className="w-4 h-4" />}
              onClick={() => onGridToggle(!gridEnabled)}
              aria-label="Toggle Grid"
            />
          </Tooltip>
          <FormControl display="flex" alignItems="center" width="auto">
            <FormLabel fontSize="xs" mb={0} mr={2}>
              Snap
            </FormLabel>
            <Switch
              size="sm"
              isChecked={snapToGrid}
              onChange={(e) => onSnapToGridToggle(e.target.checked)}
            />
          </FormControl>
        </HStack>

        {/* Right side - View Controls */}
        <HStack spacing={2}>
          {/* Zoom Controls */}
          <Tooltip label="Zoom Out">
            <IconButton
              size="sm"
              variant="ghost"
              icon={<MinusIcon className="w-4 h-4" />}
              onClick={() => onZoomChange(Math.max(25, zoom - 25))}
              aria-label="Zoom Out"
            />
          </Tooltip>
          <NumberInput
            size="sm"
            width="80px"
            value={zoom}
            onChange={(_, value) => onZoomChange(value)}
            min={25}
            max={400}
            step={25}
          >
            <NumberInputField textAlign="center" />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Text fontSize="xs" color="gray.500">%</Text>
          <Tooltip label="Zoom In">
            <IconButton
              size="sm"
              variant="ghost"
              icon={<PlusIcon className="w-4 h-4" />}
              onClick={() => onZoomChange(Math.min(400, zoom + 25))}
              aria-label="Zoom In"
            />
          </Tooltip>

          <Divider orientation="vertical" height="24px" />

          {/* View Options */}
          <Tooltip label="Toggle Rulers">
            <IconButton
              size="sm"
              variant={showRulers ? "solid" : "ghost"}
              colorScheme={showRulers ? "blue" : "gray"}
              icon={<MagnifyingGlassIcon className="w-4 h-4" />}
              onClick={() => onShowRulersToggle(!showRulers)}
              aria-label="Toggle Rulers"
            />
          </Tooltip>
          <Tooltip label="Toggle Guides">
            <IconButton
              size="sm"
              variant={showGuides ? "solid" : "ghost"}
              colorScheme={showGuides ? "blue" : "gray"}
              icon={<EyeIcon className="w-4 h-4" />}
              onClick={() => onShowGuidesToggle(!showGuides)}
              aria-label="Toggle Guides"
            />
          </Tooltip>

          <Divider orientation="vertical" height="24px" />

          {/* Settings */}
          <Tooltip label="Settings">
            <IconButton
              size="sm"
              variant="ghost"
              icon={<Cog6ToothIcon className="w-4 h-4" />}
              aria-label="Settings"
            />
          </Tooltip>
        </HStack>
      </HStack>

      {/* Selection Info */}
      {selectedCount > 0 && (
        <Box mt={2} pt={2} borderTop="1px solid" borderColor={borderColor}>
          <Text fontSize="sm" color="gray.600">
            {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
          </Text>
        </Box>
      )}
    </Box>
  );
};


