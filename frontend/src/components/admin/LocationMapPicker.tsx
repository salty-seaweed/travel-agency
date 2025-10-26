import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Text,
  VStack,
  HStack,
  Button,
  Alert,
  AlertIcon,
  Spinner,
  FormControl,
  FormLabel,
  Input,
  Badge,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { MapPinIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Ensure Leaflet CSS is loaded
import 'leaflet/dist/leaflet.css';

// Import Leaflet CSS directly
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface LocationMapPickerProps {
  latitude?: number;
  longitude?: number;
  onLocationSelect: (lat: number, lng: number) => void;
  height?: string | number;
}

// Component to handle map events
function MapEvents({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLocationSelect(lat, lng);
    },
  });
  return null;
}

// Component to handle marker updates
function MapMarker({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);

  return <Marker position={[lat, lng]} />;
}

// Component to handle map resize
function MapResizeHandler() {
  const map = useMap();
  
  useEffect(() => {
    // Force map to resize when component mounts
    const timer = setTimeout(() => {
      try {
        map.invalidateSize();
      } catch (error) {
        console.warn('Map resize error:', error);
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [map]);

  return null;
}

export function LocationMapPicker({ 
  latitude, 
  longitude, 
  onLocationSelect, 
  height = 400
}: LocationMapPickerProps) {
  const [selectedLocation, setSelectedLocation] = useState<{lat: number, lng: number} | null>(
    latitude && longitude ? { lat: latitude, lng: longitude } : null
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [mapKey, setMapKey] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);

  // Default center for Maldives
  const defaultCenter: [number, number] = [4.1755, 73.5093]; // Malé, Maldives
  const center: [number, number] = selectedLocation 
    ? [selectedLocation.lat, selectedLocation.lng] 
    : defaultCenter;

  // Handle location selection
  const handleLocationSelect = (lat: number, lng: number) => {
    const newLocation = { lat, lng };
    setSelectedLocation(newLocation);
    onLocationSelect(lat, lng);
  };

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      // Use Nominatim (OpenStreetMap's geocoding service)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5&countrycodes=mv&addressdetails=1`
      );
      const results = await response.json();
      setSearchResults(results);
      setShowSearchResults(true);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search result selection
  const handleSearchResultSelect = (result: any) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    handleLocationSelect(lat, lng);
    setSearchQuery(result.display_name);
    setShowSearchResults(false);
  };

  // Click outside to close search results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Update selected location when props change
  useEffect(() => {
    if (latitude && longitude) {
      setSelectedLocation({ lat: latitude, lng: longitude });
    }
  }, [latitude, longitude]);

  return (
    <VStack spacing={4} w="full">
      {/* Search Bar */}
      <FormControl>
        <FormLabel>Search Location</FormLabel>
        <Box position="relative" ref={searchRef}>
          <InputGroup>
            <InputLeftElement>
              <MagnifyingGlassIcon className="w-4 h-4" />
            </InputLeftElement>
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a location in Maldives..."
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </InputGroup>
          
          {/* Search Results */}
          {showSearchResults && searchResults.length > 0 && (
            <Box
              position="absolute"
              top="100%"
              left={0}
              right={0}
              bg="white"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="md"
              boxShadow="lg"
              zIndex={1000}
              maxH="200px"
              overflowY="auto"
            >
              {searchResults.map((result, index) => (
                <Box
                  key={index}
                  p={3}
                  borderBottom="1px solid"
                  borderColor="gray.100"
                  cursor="pointer"
                  _hover={{ bg: "gray.50" }}
                  onClick={() => handleSearchResultSelect(result)}
                >
                  <Text fontSize="sm" fontWeight="medium">
                    {result.display_name}
                  </Text>
                  {result.address && (
                    <Text fontSize="xs" color="gray.600">
                      {result.address.village || result.address.city || result.address.island || ''}
                      {result.address.atoll && `, ${result.address.atoll}`}
                    </Text>
                  )}
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </FormControl>

      {/* Map Container */}
      <Box 
        w="full" 
        h={height} 
        borderRadius="md" 
        overflow="hidden" 
        border="1px solid" 
        borderColor="gray.200" 
        position="relative"
        minH="400px"
      >
        {mapError ? (
          <Box 
            w="full" 
            h="full" 
            display="flex" 
            alignItems="center" 
            justifyContent="center" 
            bg="gray.100"
            flexDirection="column"
            gap={2}
            minH="400px"
          >
            <Text color="gray.600">Map failed to load</Text>
            <Button size="sm" onClick={() => {
              setMapError(false);
              setMapKey(prev => prev + 1);
            }}>
              Retry
            </Button>
          </Box>
        ) : (
          <Box w="full" h="full" minH="400px">
            <MapContainer
              key={`map-${mapKey}`}
              center={center}
              zoom={selectedLocation ? 12 : 7}
              style={{ 
                height: '100%', 
                width: '100%', 
                minHeight: '400px',
                zIndex: 1
              }}
              scrollWheelZoom={true}
              zoomControl={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {/* Map Events */}
              <MapEvents onLocationSelect={handleLocationSelect} />
              
              {/* Map Resize Handler */}
              <MapResizeHandler />
              
              {/* Marker */}
              {selectedLocation && (
                <MapMarker lat={selectedLocation.lat} lng={selectedLocation.lng} />
              )}
            </MapContainer>
          </Box>
        )}
      </Box>

      {/* Location Info */}
      {selectedLocation && (
        <Box w="full" p={3} bg="blue.50" borderRadius="md" border="1px solid" borderColor="blue.200">
          <HStack spacing={2}>
            <MapPinIcon className="w-4 h-4" color="blue.600" />
            <Text fontSize="sm" color="blue.800">
              Selected Location: {Number(selectedLocation.lat).toFixed(6)}, {Number(selectedLocation.lng).toFixed(6)}
            </Text>
          </HStack>
        </Box>
      )}

      {/* Instructions */}
      <Alert status="info" borderRadius="md">
        <AlertIcon />
        <VStack align="start" spacing={1}>
          <Text fontSize="sm" fontWeight="medium">
            How to use:
          </Text>
          <Text fontSize="xs">
            • Click anywhere on the map to select a location
          </Text>
          <Text fontSize="xs">
            • Use the search bar to find specific places in Maldives
          </Text>
          <Text fontSize="xs">
            • Drag the map to explore different areas
          </Text>
        </VStack>
      </Alert>
    </VStack>
  );
}