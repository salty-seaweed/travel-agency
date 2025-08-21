import React, { useState, useRef, useCallback } from 'react';
import {
  Box,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

interface DraggableItem {
  id: string;
  type: string;
  name: string;
  description: string;
  icon: any;
  content: string;
  props: Record<string, any>;
}

interface DroppedItem extends DraggableItem {
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  locked: boolean;
  visible: boolean;
  customStyles?: Record<string, any>;
  data?: Record<string, any>;
}

interface CanvasProps {
  content: DroppedItem[];
  selectedItems: string[];
  onSelectionChange: (selectedItems: string[]) => void;
  onItemUpdate: (itemId: string, updates: Partial<DroppedItem>) => void;
  onItemMove: (itemId: string, newPosition: { x: number; y: number }) => void;
  onItemResize: (itemId: string, newSize: { width: number; height: number }) => void;
  gridEnabled: boolean;
  gridSize: number;
  snapToGrid: boolean;
  zoom: number;
  showRulers: boolean;
  showGuides: boolean;
  canvasSize: { width: number; height: number };
  dragMode: 'move' | 'select' | 'resize';
  onDrop: (item: DraggableItem, position: { x: number; y: number }) => void;
}

export const Canvas: React.FC<CanvasProps> = ({
  content,
  selectedItems,
  onSelectionChange,
  onItemUpdate,
  onItemMove,
  onItemResize,
  gridEnabled,
  gridSize,
  snapToGrid,
  zoom,
  showRulers,
  showGuides,
  canvasSize,
  dragMode,
  onDrop,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const gridColor = useColorModeValue('gray.300', 'gray.600');

  // Grid snapping function
  const snapToGridValue = useCallback((value: number) => {
    if (!snapToGrid) return value;
    return Math.round(value / gridSize) * gridSize;
  }, [snapToGrid, gridSize]);

  // Handle canvas click for selection
  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      onSelectionChange([]);
    }
  }, [onSelectionChange]);

  // Handle item selection
  const handleItemClick = useCallback((e: React.MouseEvent, itemId: string) => {
    e.stopPropagation();
    
    if (e.ctrlKey || e.metaKey) {
      // Multi-select
      const newSelection = selectedItems.includes(itemId)
        ? selectedItems.filter(id => id !== itemId)
        : [...selectedItems, itemId];
      onSelectionChange(newSelection);
    } else {
      // Single select
      onSelectionChange([itemId]);
    }
  }, [selectedItems, onSelectionChange]);

  // Handle drag start
  const handleDragStart = useCallback((e: React.MouseEvent, itemId: string) => {
    if (dragMode === 'select') return;
    
    setDragStart({ x: e.clientX, y: e.clientY });
    setIsDragging(true);
  }, [dragMode]);

  // Handle drag move
  const handleDragMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !dragStart || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    selectedItems.forEach(itemId => {
      const item = content.find(c => c.id === itemId);
      if (item && !item.locked) {
        const newX = snapToGridValue(item.position.x + deltaX);
        const newY = snapToGridValue(item.position.y + deltaY);
        onItemMove(itemId, { x: newX, y: newY });
      }
    });

    setDragStart({ x: e.clientX, y: e.clientY });
  }, [isDragging, dragStart, selectedItems, content, onItemMove, snapToGridValue]);

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    setDragStart(null);
  }, []);

  // Handle resize start
  const handleResizeStart = useCallback((e: React.MouseEvent, handle: string) => {
    e.stopPropagation();
    setResizeHandle(handle);
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  }, []);

  // Handle resize move
  const handleResizeMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !dragStart || !resizeHandle || selectedItems.length !== 1) return;

    const itemId = selectedItems[0];
    const item = content.find(c => c.id === itemId);
    if (!item || item.locked) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    let newWidth = item.size.width;
    let newHeight = item.size.height;
    let newX = item.position.x;
    let newY = item.position.y;

    switch (resizeHandle) {
      case 'nw':
        newWidth = snapToGridValue(item.size.width - deltaX);
        newHeight = snapToGridValue(item.size.height - deltaY);
        newX = snapToGridValue(item.position.x + deltaX);
        newY = snapToGridValue(item.position.y + deltaY);
        break;
      case 'ne':
        newWidth = snapToGridValue(item.size.width + deltaX);
        newHeight = snapToGridValue(item.size.height - deltaY);
        newY = snapToGridValue(item.position.y + deltaY);
        break;
      case 'sw':
        newWidth = snapToGridValue(item.size.width - deltaX);
        newHeight = snapToGridValue(item.size.height + deltaY);
        newX = snapToGridValue(item.position.x + deltaX);
        break;
      case 'se':
        newWidth = snapToGridValue(item.size.width + deltaX);
        newHeight = snapToGridValue(item.size.height + deltaY);
        break;
      case 'n':
        newHeight = snapToGridValue(item.size.height - deltaY);
        newY = snapToGridValue(item.position.y + deltaY);
        break;
      case 's':
        newHeight = snapToGridValue(item.size.height + deltaY);
        break;
      case 'w':
        newWidth = snapToGridValue(item.size.width - deltaX);
        newX = snapToGridValue(item.position.x + deltaX);
        break;
      case 'e':
        newWidth = snapToGridValue(item.size.width + deltaX);
        break;
    }

    // Ensure minimum size
    newWidth = Math.max(50, newWidth);
    newHeight = Math.max(50, newHeight);

    onItemResize(itemId, { width: newWidth, height: newHeight });
    onItemMove(itemId, { x: newX, y: newY });

    setDragStart({ x: e.clientX, y: e.clientY });
  }, [isDragging, dragStart, resizeHandle, selectedItems, content, onItemResize, onItemMove, snapToGridValue]);

  // Handle resize end
  const handleResizeEnd = useCallback(() => {
    setIsDragging(false);
    setDragStart(null);
    setResizeHandle(null);
  }, []);

  // Handle drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const itemData = e.dataTransfer.getData('application/json');
    if (!itemData || !canvasRef.current) return;

    try {
      const item = JSON.parse(itemData);
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / (zoom / 100);
      const y = (e.clientY - rect.top) / (zoom / 100);
      
      onDrop(item, { x: snapToGridValue(x), y: snapToGridValue(y) });
    } catch (error) {
      console.error('Failed to parse dropped item:', error);
    }
  }, [onDrop, zoom, snapToGridValue]);

  // Handle drag over
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  // Mouse event handlers
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (dragMode === 'move') {
      handleDragMove(e);
    } else if (dragMode === 'resize') {
      handleResizeMove(e);
    }
  }, [dragMode, handleDragMove, handleResizeMove]);

  const handleMouseUp = useCallback(() => {
    if (dragMode === 'move') {
      handleDragEnd();
    } else if (dragMode === 'resize') {
      handleResizeEnd();
    }
  }, [dragMode, handleDragEnd, handleResizeEnd]);

  // Render grid
  const renderGrid = () => {
    if (!gridEnabled) return null;

    const gridPattern = `repeating-linear-gradient(
      0deg,
      transparent,
      transparent ${gridSize - 1}px,
      ${gridColor} 1px
    ),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent ${gridSize - 1}px,
      ${gridColor} 1px
    )`;

    return (
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        background={gridPattern}
        pointerEvents="none"
        opacity={0.3}
      />
    );
  };

  // Render rulers
  const renderRulers = () => {
    if (!showRulers) return null;

    return (
      <>
        {/* Horizontal ruler */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          height="20px"
          bg="gray.100"
          borderBottom="1px solid"
          borderColor={borderColor}
          fontSize="xs"
          color="gray.600"
          display="flex"
          alignItems="center"
          px={2}
        >
          {Math.round(canvasSize.width)}px
        </Box>
        {/* Vertical ruler */}
        <Box
          position="absolute"
          top={0}
          left={0}
          bottom={0}
          width="20px"
          bg="gray.100"
          borderRight="1px solid"
          borderColor={borderColor}
          fontSize="xs"
          color="gray.600"
          display="flex"
          alignItems="center"
          justifyContent="center"
          style={{
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
          }}
        >
          {Math.round(canvasSize.height)}px
        </Box>
      </>
    );
  };

  // Render resize handles
  const renderResizeHandles = (item: DroppedItem) => {
    if (!selectedItems.includes(item.id) || selectedItems.length > 1) return null;

    const handles = [
      { position: 'nw', cursor: 'nw-resize' },
      { position: 'n', cursor: 'n-resize' },
      { position: 'ne', cursor: 'ne-resize' },
      { position: 'w', cursor: 'w-resize' },
      { position: 'e', cursor: 'e-resize' },
      { position: 'sw', cursor: 'sw-resize' },
      { position: 's', cursor: 's-resize' },
      { position: 'se', cursor: 'se-resize' },
    ];

    return handles.map(({ position, cursor }) => (
      <Box
        key={position}
        position="absolute"
        width="8px"
        height="8px"
        bg="blue.500"
        border="1px solid"
        borderColor="white"
        borderRadius="50%"
        cursor={cursor}
        onMouseDown={(e) => handleResizeStart(e, position)}
        style={{
          top: position.includes('n') ? '-4px' : position.includes('s') ? 'calc(100% - 4px)' : '50%',
          left: position.includes('w') ? '-4px' : position.includes('e') ? 'calc(100% - 4px)' : '50%',
          transform: position.includes('n') || position.includes('s') ? 'translateX(-50%)' : 
                    position.includes('w') || position.includes('e') ? 'translateY(-50%)' : 'translate(-50%, -50%)',
        }}
      />
    ));
  };

  return (
    <Box
      ref={canvasRef}
      position="relative"
      width="100%"
      height="100%"
      bg={bgColor}
      border="1px solid"
      borderColor={borderColor}
      overflow="hidden"
      onClick={handleCanvasClick}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      style={{
        transform: `scale(${zoom / 100})`,
        transformOrigin: 'top left',
      }}
    >
      {/* Rulers */}
      {renderRulers()}

      {/* Grid */}
      {renderGrid()}

      {/* Canvas content */}
      <Box
        position="absolute"
        top={showRulers ? "20px" : "0"}
        left={showRulers ? "20px" : "0"}
        width={canvasSize.width}
        height={canvasSize.height}
        bg="white"
        border="1px solid"
        borderColor={borderColor}
      >
        {/* Dropped items */}
        {content
          .filter(item => item.visible)
          .sort((a, b) => a.zIndex - b.zIndex)
          .map((item) => (
            <Box
              key={item.id}
              position="absolute"
              left={item.position.x}
              top={item.position.y}
              width={item.size.width}
              height={item.size.height}
              border={selectedItems.includes(item.id) ? "2px solid" : "1px solid"}
              borderColor={selectedItems.includes(item.id) ? "blue.500" : "gray.300"}
              borderRadius="md"
              bg="white"
              cursor={item.locked ? "not-allowed" : dragMode === 'move' ? "move" : "pointer"}
              opacity={item.locked ? 0.6 : 1}
              onClick={(e) => handleItemClick(e, item.id)}
              onMouseDown={(e) => handleDragStart(e, item.id)}
              _hover={{ shadow: 'md' }}
              transition="all 0.2s"
            >
              {/* Item content */}
              <Box p={3} h="100%" overflow="auto">
                <div dangerouslySetInnerHTML={{ __html: item.content }} />
              </Box>

              {/* Resize handles */}
              {renderResizeHandles(item)}
            </Box>
          ))}

                 {/* Empty state */}
         {content.length === 0 && (
           <Box
             position="absolute"
             top="50%"
             left="50%"
             transform="translate(-50%, -50%)"
             textAlign="center"
             color="gray.500"
           >
             <Text fontSize="lg" fontWeight="semibold">
               Drop components here
             </Text>
             <Text fontSize="sm">
               Drag items from the component library to get started
             </Text>
           </Box>
         )}
      </Box>
    </Box>
  );
};
