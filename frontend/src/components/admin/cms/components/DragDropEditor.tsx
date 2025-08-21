import React, { useState, useRef, useCallback, useEffect } from 'react';
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
  Badge,
  IconButton,
  Tooltip,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  SimpleGrid,
  Divider,
  Flex,
  Spacer,
  Select,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Switch,
  FormControl,
  FormLabel,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
} from '@chakra-ui/react';
import {
  DocumentTextIcon,
  PhotoIcon,
  VideoCameraIcon,
  ChartBarIcon,
  TableCellsIcon,
  CalendarIcon,
  MapPinIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  UserGroupIcon,
  StarIcon,
  HeartIcon,
  ShoppingCartIcon,
  CreditCardIcon,
  CogIcon,
  PlusIcon,
  TrashIcon,
  ArrowsUpDownIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon,
  EyeSlashIcon,
  DocumentDuplicateIcon,
  LockClosedIcon,
  LockOpenIcon,
  ViewColumnsIcon,
  MagnifyingGlassIcon,
  MinusIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
} from '@heroicons/react/24/outline';

// Import modular components
import { ComponentLibrary } from './ComponentLibrary';
import { PropertiesPanel } from './PropertiesPanel';
import { LayerPanel } from './LayerPanel';
import { Canvas } from './Canvas';
import { Toolbar } from './Toolbar';
import { GridSettings } from './GridSettings';
import { useDragDropHistory } from '../hooks/useDragDropHistory';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

interface DraggableItem {
  id: string;
  type: 'text' | 'image' | 'video' | 'chart' | 'table' | 'calendar' | 'map' | 'form' | 'social' | 'ecommerce';
  name: string;
  description: string;
  icon: any;
  defaultContent: string;
  defaultProps: Record<string, any>;
  defaultSize: { width: number; height: number };
}

interface DroppedItem {
  id: string;
  type: 'text' | 'image' | 'video' | 'chart' | 'table' | 'calendar' | 'map' | 'form' | 'social' | 'ecommerce';
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

interface DragDropEditorProps {
  content: DroppedItem[];
  onChange: (content: DroppedItem[]) => void;
}

export const DragDropEditor: React.FC<DragDropEditorProps> = ({ content, onChange }) => {
  // State management
  const [localContent, setLocalContent] = useState<DroppedItem[]>(content || []);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [draggedItem, setDraggedItem] = useState<DraggableItem | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState<'move' | 'select' | 'resize'>('select');
  const [gridEnabled, setGridEnabled] = useState(true);
  const [gridSize, setGridSize] = useState(20);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [showRulers, setShowRulers] = useState(true);
  const [showGuides, setShowGuides] = useState(true);
  const [canvasSize, setCanvasSize] = useState({ width: 1200, height: 800 });
  
  // History management
  const { history, currentIndex, canUndo, canRedo, pushToHistory, undo, redo } = useDragDropHistory(localContent);
  
  // Keyboard shortcuts
  useKeyboardShortcuts({
    onUndo: canUndo ? undo : undefined,
    onRedo: canRedo ? redo : undefined,
    onDelete: selectedItems.length > 0 ? () => deleteSelectedItems() : undefined,
    onDuplicate: selectedItems.length > 0 ? () => duplicateSelectedItems() : undefined,
    onSelectAll: () => selectAllItems(),
    onDeselectAll: () => setSelectedItems([]),
  });

  // Update local content when prop changes
  useEffect(() => {
    setLocalContent(content || []);
  }, [content]);

  // Update parent when local content changes
  const updateContent = useCallback((newContent: DroppedItem[]) => {
    setLocalContent(newContent);
    onChange(newContent);
    pushToHistory(newContent);
  }, [onChange, pushToHistory]);

  // Grid snapping function
  const snapToGridValue = useCallback((value: number) => {
    if (!snapToGrid) return value;
    return Math.round(value / gridSize) * gridSize;
  }, [snapToGrid, gridSize]);

  // Item management functions
  const addItem = useCallback((item: DraggableItem, position: { x: number; y: number }) => {
    const newItem: DroppedItem = {
      id: `${item.id}_${Date.now()}`,
      type: item.type,
      name: item.name,
      description: item.description,
      icon: item.icon,
      content: item.defaultContent,
      props: item.defaultProps,
      position: {
        x: snapToGridValue(position.x),
        y: snapToGridValue(position.y),
      },
      size: item.defaultSize,
      zIndex: localContent.length + 1,
      locked: false,
      visible: true,
      customStyles: {},
      data: {},
    };
    
    updateContent([...localContent, newItem]);
    setSelectedItems([newItem.id]);
  }, [localContent, updateContent, snapToGridValue]);

  const deleteSelectedItems = useCallback(() => {
    const newContent = localContent.filter(item => !selectedItems.includes(item.id));
    updateContent(newContent);
    setSelectedItems([]);
  }, [localContent, selectedItems, updateContent]);

  const duplicateSelectedItems = useCallback(() => {
    const duplicatedItems: DroppedItem[] = [];
    const newSelectedItems: string[] = [];
    
    selectedItems.forEach(itemId => {
      const originalItem = localContent.find(item => item.id === itemId);
      if (originalItem) {
        const duplicatedItem: DroppedItem = {
          ...originalItem,
          id: `${originalItem.id}_copy_${Date.now()}`,
          position: {
            x: originalItem.position.x + 20,
            y: originalItem.position.y + 20,
          },
          zIndex: Math.max(...localContent.map(item => item.zIndex)) + 1,
        };
        duplicatedItems.push(duplicatedItem);
        newSelectedItems.push(duplicatedItem.id);
      }
    });
    
    updateContent([...localContent, ...duplicatedItems]);
    setSelectedItems(newSelectedItems);
  }, [localContent, selectedItems, updateContent]);

  const selectAllItems = useCallback(() => {
    setSelectedItems(localContent.map(item => item.id));
  }, [localContent]);

  const updateItem = useCallback((itemId: string, updates: Partial<DroppedItem>) => {
    const newContent = localContent.map(item =>
      item.id === itemId ? { ...item, ...updates } : item
    );
    updateContent(newContent);
  }, [localContent, updateContent]);

  const updateSelectedItems = useCallback((updates: Partial<DroppedItem>) => {
    const newContent = localContent.map(item =>
      selectedItems.includes(item.id) ? { ...item, ...updates } : item
    );
    updateContent(newContent);
  }, [localContent, selectedItems, updateContent]);

  const bringToFront = useCallback(() => {
    if (selectedItems.length === 0) return;
    
    const maxZIndex = Math.max(...localContent.map(item => item.zIndex));
    const newContent = localContent.map(item =>
      selectedItems.includes(item.id) 
        ? { ...item, zIndex: maxZIndex + 1 }
        : item
    );
    updateContent(newContent);
  }, [localContent, selectedItems, updateContent]);

  const sendToBack = useCallback(() => {
    if (selectedItems.length === 0) return;
    
    const minZIndex = Math.min(...localContent.map(item => item.zIndex));
    const newContent = localContent.map(item =>
      selectedItems.includes(item.id) 
        ? { ...item, zIndex: minZIndex - 1 }
        : item
    );
    updateContent(newContent);
  }, [localContent, selectedItems, updateContent]);

  const toggleItemLock = useCallback((itemId: string) => {
    updateItem(itemId, { locked: !localContent.find(item => item.id === itemId)?.locked });
  }, [updateItem, localContent]);

  const toggleItemVisibility = useCallback((itemId: string) => {
    updateItem(itemId, { visible: !localContent.find(item => item.id === itemId)?.visible });
  }, [updateItem, localContent]);

  // Theme colors
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');

  return (
    <Box>
      <VStack spacing={4} align="stretch" h="calc(100vh - 200px)">
        {/* Toolbar */}
        <Toolbar
          selectedCount={selectedItems.length}
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={undo}
          onRedo={redo}
          onDelete={deleteSelectedItems}
          onDuplicate={duplicateSelectedItems}
          onSelectAll={selectAllItems}
          onDeselectAll={() => setSelectedItems([])}
          onBringToFront={bringToFront}
          onSendToBack={sendToBack}
          dragMode={dragMode}
          onDragModeChange={setDragMode}
          gridEnabled={gridEnabled}
          onGridToggle={setGridEnabled}
          snapToGrid={snapToGrid}
          onSnapToGridToggle={setSnapToGrid}
          zoom={zoom}
          onZoomChange={setZoom}
          showRulers={showRulers}
          onShowRulersToggle={setShowRulers}
          showGuides={showGuides}
          onShowGuidesToggle={setShowGuides}
        />

        {/* Main Editor Area */}
        <Flex gap={4} flex={1} minH={0}>
          {/* Component Library */}
          <Box w="280px" bg={bgColor} border="1px solid" borderColor={borderColor} borderRadius="md">
            <ComponentLibrary
              onItemSelect={(item) => {
                setDraggedItem(item);
                setIsDragging(true);
              }}
            />
          </Box>

          {/* Canvas Area */}
          <Box flex={1} bg={bgColor} border="1px solid" borderColor={borderColor} borderRadius="md" position="relative">
            <Canvas
              content={localContent}
              selectedItems={selectedItems}
              onSelectionChange={setSelectedItems}
              onItemUpdate={updateItem}
              onItemMove={(itemId, newPosition) => {
                updateItem(itemId, {
                  position: {
                    x: snapToGridValue(newPosition.x),
                    y: snapToGridValue(newPosition.y),
                  }
                });
              }}
              onItemResize={(itemId, newSize) => {
                updateItem(itemId, {
                  size: {
                    width: snapToGridValue(newSize.width),
                    height: snapToGridValue(newSize.height),
                  }
                });
              }}
              gridEnabled={gridEnabled}
              gridSize={gridSize}
              snapToGrid={snapToGrid}
              zoom={zoom}
              showRulers={showRulers}
              showGuides={showGuides}
              canvasSize={canvasSize}
              dragMode={dragMode}
              onDrop={(item, position) => {
                addItem(item, position);
                setIsDragging(false);
                setDraggedItem(null);
              }}
            />
          </Box>

          {/* Properties Panel */}
          <Box w="320px" bg={bgColor} border="1px solid" borderColor={borderColor} borderRadius="md">
            <PropertiesPanel
              selectedItems={selectedItems}
              content={localContent}
              onItemUpdate={updateItem}
              onSelectedItemsUpdate={updateSelectedItems}
            />
          </Box>
        </Flex>

        {/* Layer Panel */}
        <Box h="200px" bg={bgColor} border="1px solid" borderColor={borderColor} borderRadius="md">
          <LayerPanel
            content={localContent}
            selectedItems={selectedItems}
            onSelectionChange={setSelectedItems}
            onItemUpdate={updateItem}
            onItemLock={toggleItemLock}
            onItemVisibility={toggleItemVisibility}
            onItemDelete={(itemId) => {
              updateContent(localContent.filter(item => item.id !== itemId));
              setSelectedItems(prev => prev.filter(id => id !== itemId));
            }}
            onItemDuplicate={(itemId) => {
              const originalItem = localContent.find(item => item.id === itemId);
              if (originalItem) {
                const duplicatedItem: DroppedItem = {
                  ...originalItem,
                  id: `${originalItem.id}_copy_${Date.now()}`,
                  position: {
                    x: originalItem.position.x + 20,
                    y: originalItem.position.y + 20,
                  },
                  zIndex: Math.max(...localContent.map(item => item.zIndex)) + 1,
                };
                updateContent([...localContent, duplicatedItem]);
                setSelectedItems([duplicatedItem.id]);
              }
            }}
            onItemMove={(itemId, direction) => {
              const itemIndex = localContent.findIndex(item => item.id === itemId);
              if (itemIndex === -1) return;
              
              const newContent = [...localContent];
              if (direction === 'up' && itemIndex > 0) {
                [newContent[itemIndex], newContent[itemIndex - 1]] = [newContent[itemIndex - 1], newContent[itemIndex]];
              } else if (direction === 'down' && itemIndex < newContent.length - 1) {
                [newContent[itemIndex], newContent[itemIndex + 1]] = [newContent[itemIndex + 1], newContent[itemIndex]];
              }
              
              updateContent(newContent);
            }}
          />
        </Box>

                            {/* Grid Settings Modal - This will be triggered from the Toolbar */}
                    <GridSettings
                      gridEnabled={gridEnabled}
                      onGridToggle={setGridEnabled}
                      gridSize={gridSize}
                      onGridSizeChange={setGridSize}
                      snapToGrid={snapToGrid}
                      onSnapToGridToggle={setSnapToGrid}
                    />
      </VStack>
    </Box>
  );
};
