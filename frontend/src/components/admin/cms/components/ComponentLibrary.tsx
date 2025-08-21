import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Badge,
  IconButton,
  Tooltip,
  SimpleGrid,
  Divider,
  useColorModeValue,
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
  ShoppingCartIcon,
  StarIcon,
  HeartIcon,
  CreditCardIcon,
  CogIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

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

interface ComponentLibraryProps {
  onItemSelect: (item: DraggableItem) => void;
}

const componentLibrary: DraggableItem[] = [
  {
    id: 'paragraph',
    type: 'text',
    name: 'Paragraph',
    description: 'Add a paragraph of text',
    icon: DocumentTextIcon,
    defaultContent: '<p>Enter your text here...</p>',
    defaultProps: {},
    defaultSize: { width: 300, height: 100 },
  },
  {
    id: 'heading',
    type: 'text',
    name: 'Heading',
    description: 'Add a heading',
    icon: DocumentTextIcon,
    defaultContent: '<h2>Heading</h2>',
    defaultProps: {},
    defaultSize: { width: 300, height: 60 },
  },
  {
    id: 'image',
    type: 'image',
    name: 'Image',
    description: 'Add an image',
    icon: PhotoIcon,
    defaultContent: '<img src="https://via.placeholder.com/300x200" alt="Image" />',
    defaultProps: { src: 'https://via.placeholder.com/300x200', alt: 'Image' },
    defaultSize: { width: 300, height: 200 },
  },
  {
    id: 'video',
    type: 'video',
    name: 'Video',
    description: 'Add a video player',
    icon: VideoCameraIcon,
    defaultContent: '<video controls><source src="" type="video/mp4">Your browser does not support the video tag.</video>',
    defaultProps: { src: '', controls: true },
    defaultSize: { width: 400, height: 300 },
  },
  {
    id: 'chart',
    type: 'chart',
    name: 'Chart',
    description: 'Add a chart or graph',
    icon: ChartBarIcon,
    defaultContent: '<div class="chart-placeholder">Chart Component</div>',
    defaultProps: { type: 'bar', data: [] },
    defaultSize: { width: 400, height: 300 },
  },
  {
    id: 'table',
    type: 'table',
    name: 'Table',
    description: 'Add a data table',
    icon: TableCellsIcon,
    defaultContent: '<table><thead><tr><th>Header 1</th><th>Header 2</th></tr></thead><tbody><tr><td>Data 1</td><td>Data 2</td></tr></tbody></table>',
    defaultProps: { rows: 3, columns: 3 },
    defaultSize: { width: 400, height: 200 },
  },
  {
    id: 'calendar',
    type: 'calendar',
    name: 'Calendar',
    description: 'Add a calendar widget',
    icon: CalendarIcon,
    defaultContent: '<div class="calendar-placeholder">Calendar Component</div>',
    defaultProps: { view: 'month' },
    defaultSize: { width: 350, height: 300 },
  },
  {
    id: 'map',
    type: 'map',
    name: 'Map',
    description: 'Add a map component',
    icon: MapPinIcon,
    defaultContent: '<div class="map-placeholder">Map Component</div>',
    defaultProps: { center: { lat: 0, lng: 0 }, zoom: 10 },
    defaultSize: { width: 400, height: 300 },
  },
  {
    id: 'contact-form',
    type: 'form',
    name: 'Contact Form',
    description: 'Add a contact form',
    icon: EnvelopeIcon,
    defaultContent: '<form><input type="text" placeholder="Name" /><input type="email" placeholder="Email" /><textarea placeholder="Message"></textarea><button type="submit">Send</button></form>',
    defaultProps: { fields: ['name', 'email', 'message'] },
    defaultSize: { width: 350, height: 250 },
  },
  {
    id: 'social-links',
    type: 'social',
    name: 'Social Links',
    description: 'Add social media links',
    icon: UserGroupIcon,
    defaultContent: '<div class="social-links"><a href="#"><i class="icon-facebook"></i></a><a href="#"><i class="icon-twitter"></i></a><a href="#"><i class="icon-instagram"></i></a></div>',
    defaultProps: { platforms: ['facebook', 'twitter', 'instagram'] },
    defaultSize: { width: 200, height: 50 },
  },
  {
    id: 'product-card',
    type: 'ecommerce',
    name: 'Product Card',
    description: 'Add a product display card',
    icon: ShoppingCartIcon,
    defaultContent: '<div class="product-card"><img src="https://via.placeholder.com/150" alt="Product" /><h3>Product Name</h3><p>$99.99</p><button>Add to Cart</button></div>',
    defaultProps: { price: 99.99, image: 'https://via.placeholder.com/150' },
    defaultSize: { width: 200, height: 250 },
  },
  {
    id: 'testimonial',
    type: 'text',
    name: 'Testimonial',
    description: 'Add a customer testimonial',
    icon: StarIcon,
    defaultContent: '<blockquote>"This is an amazing product!" - John Doe</blockquote>',
    defaultProps: { author: 'John Doe', rating: 5 },
    defaultSize: { width: 300, height: 120 },
  },
];

export const ComponentLibrary: React.FC<ComponentLibraryProps> = ({ onItemSelect }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const hoverBgColor = useColorModeValue('gray.50', 'gray.700');

  const handleItemClick = (item: DraggableItem) => {
    onItemSelect(item);
  };

  const groupedComponents = componentLibrary.reduce((acc, component) => {
    if (!acc[component.type]) {
      acc[component.type] = [];
    }
    acc[component.type].push(component);
    return acc;
  }, {} as Record<string, DraggableItem[]>);

  return (
    <Box p={4} bg={bgColor} height="100%" overflowY="auto">
      <VStack spacing={4} align="stretch">
        <Heading size="md" color={textColor}>
          Components
        </Heading>
        
        <Text fontSize="sm" color="gray.500">
          Drag components to the canvas
        </Text>

        <Divider />

        {Object.entries(groupedComponents).map(([type, components]) => (
          <Box key={type}>
            <HStack justify="space-between" mb={2}>
              <Text fontWeight="semibold" color={textColor} textTransform="capitalize">
                {type}
              </Text>
              <Badge colorScheme="blue" variant="subtle">
                {components.length}
              </Badge>
            </HStack>
            
            <SimpleGrid columns={1} spacing={2}>
              {components.map((component) => (
                <Card
                  key={component.id}
                  size="sm"
                  cursor="pointer"
                  _hover={{ bg: hoverBgColor, transform: 'translateY(-1px)' }}
                  transition="all 0.2s"
                  onClick={() => handleItemClick(component)}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('application/json', JSON.stringify(component));
                  }}
                >
                  <CardBody p={3}>
                    <HStack spacing={3}>
                      <Box
                        w={8}
                        h={8}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        color="blue.500"
                      >
                        {React.createElement(component.icon, { className: 'w-5 h-5' })}
                      </Box>
                      <VStack align="start" spacing={1} flex={1}>
                        <Text fontSize="sm" fontWeight="medium" color={textColor}>
                          {component.name}
                        </Text>
                        <Text fontSize="xs" color="gray.500" noOfLines={2}>
                          {component.description}
                        </Text>
                      </VStack>
                    </HStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};
