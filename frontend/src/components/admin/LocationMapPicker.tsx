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
} from '@chakra-ui/react';
import { MapPinIcon } from '@heroicons/react/24/outline';

interface LocationMapPickerProps {
  latitude?: number;
  longitude?: number;
  onLocationSelect: (lat: number, lng: number) => void;
  height?: string | number;
  apiKey?: string;
}

declare global {
  interface Window {
    google: any;
    initLocationMapPicker: () => void;
  }
}

export function LocationMapPicker({ 
  latitude, 
  longitude, 
  onLocationSelect, 
  height = 400, 
  apiKey 
}: LocationMapPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [mapError, setMapError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<{lat: number, lng: number} | null>(
    latitude && longitude ? { lat: latitude, lng: longitude } : null
  );

  const initializeMap = () => {
    if (!mapRef.current || !window.google) {
      setMapError(true);
      setIsLoading(false);
      return;
    }

    try {
      // Default to Maldives center if no coordinates provided
      const defaultCenter = { lat: 3.2028, lng: 73.2207 };
      const center = selectedLocation || defaultCenter;

      const map = new window.google.maps.Map(mapRef.current, {
        zoom: selectedLocation ? 12 : 7,
        center: center,
        mapTypeId: window.google.maps.MapTypeId.SATELLITE,
        styles: [
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#0099cc' }]
          },
          {
            featureType: 'landscape',
            elementType: 'geometry',
            stylers: [{ color: '#f0f8ff' }]
          }
        ]
      });

      mapInstanceRef.current = map;

      // Add existing marker if coordinates are provided
      if (selectedLocation) {
        addMarker(selectedLocation.lat, selectedLocation.lng);
      }

      // Add click listener to map
      map.addListener('click', (event: any) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        
        setSelectedLocation({ lat, lng });
        onLocationSelect(lat, lng);
        
        // Remove existing marker
        if (markerRef.current) {
          markerRef.current.setMap(null);
        }
        
        // Add new marker
        addMarker(lat, lng);
      });

      setIsLoading(false);
      setMapError(false);
    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError(true);
      setIsLoading(false);
    }
  };

  const addMarker = (lat: number, lng: number) => {
    if (!mapInstanceRef.current || !window.google) return;

    const marker = new window.google.maps.Marker({
      position: { lat, lng },
      map: mapInstanceRef.current,
      title: 'Selected Location',
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: '#FF0000',
        fillOpacity: 1,
        strokeColor: '#FFFFFF',
        strokeWeight: 2,
      }
    });

    markerRef.current = marker;
  };

  const handleManualInput = (field: 'lat' | 'lng', value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    const newLocation = {
      lat: field === 'lat' ? numValue : selectedLocation?.lat || 0,
      lng: field === 'lng' ? numValue : selectedLocation?.lng || 0
    };

    setSelectedLocation(newLocation);
    onLocationSelect(newLocation.lat, newLocation.lng);

    // Update map center and marker
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setCenter(newLocation);
      mapInstanceRef.current.setZoom(12);
      
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
      addMarker(newLocation.lat, newLocation.lng);
    }
  };

  const centerOnMaldives = () => {
    const maldivesCenter = { lat: 3.2028, lng: 73.2207 };
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setCenter(maldivesCenter);
      mapInstanceRef.current.setZoom(7);
    }
  };

  useEffect(() => {
    const loadGoogleMaps = () => {
      const googleApiKey = apiKey || process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
      
      if (!googleApiKey || googleApiKey === 'AIzaSyBFw0Qbyq9zTFTd-tUY6dOWTgHz-TrU_T4') {
        console.warn('No valid Google Maps API key provided');
        setMapError(true);
        setIsLoading(false);
        return;
      }

      if (window.google && window.google.maps) {
        initializeMap();
        return;
      }

      window.initLocationMapPicker = initializeMap;

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&callback=initLocationMapPicker`;
      script.async = true;
      script.defer = true;
      script.onerror = () => {
        setMapError(true);
        setIsLoading(false);
      };
      
      document.head.appendChild(script);
    };

    loadGoogleMaps();

    return () => {
      // Cleanup
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
    };
  }, []);

  // Update marker when props change
  useEffect(() => {
    if (latitude && longitude && mapInstanceRef.current) {
      const newLocation = { lat: latitude, lng: longitude };
      setSelectedLocation(newLocation);
      
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
      addMarker(latitude, longitude);
      mapInstanceRef.current.setCenter(newLocation);
    }
  }, [latitude, longitude]);

  if (isLoading) {
    return (
      <Box 
        height={height} 
        display="flex" 
        alignItems="center" 
        justifyContent="center"
        bg="gray.100"
        borderRadius="md"
      >
        <VStack spacing={3}>
          <Spinner size="lg" color="blue.500" />
          <Text>Loading map...</Text>
        </VStack>
      </Box>
    );
  }

  if (mapError) {
    return (
      <VStack spacing={4}>
        <Alert status="warning" borderRadius="md">
          <AlertIcon />
          <VStack align="start" spacing={2}>
            <Text fontWeight="medium">Map not available</Text>
            <Text fontSize="sm">
              Please configure Google Maps API key or enter coordinates manually below.
            </Text>
          </VStack>
        </Alert>
        
        <VStack spacing={4} w="full">
          <Text fontWeight="medium">Manual Coordinate Entry</Text>
          <HStack spacing={4} w="full">
            <FormControl>
              <FormLabel fontSize="sm">Latitude</FormLabel>
              <Input
                type="number"
                step="any"
                value={selectedLocation?.lat || ''}
                onChange={(e) => handleManualInput('lat', e.target.value)}
                placeholder="3.2028"
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">Longitude</FormLabel>
              <Input
                type="number"
                step="any"
                value={selectedLocation?.lng || ''}
                onChange={(e) => handleManualInput('lng', e.target.value)}
                placeholder="73.2207"
              />
            </FormControl>
          </HStack>
        </VStack>
      </VStack>
    );
  }

  return (
    <VStack spacing={4} align="stretch">
      {/* Instructions */}
      <Box bg="blue.50" p={3} borderRadius="md">
        <HStack spacing={2}>
          <MapPinIcon className="w-5 h-5 text-blue-600" />
          <Text fontSize="sm" color="blue.800">
            Click on the map to select a location, or enter coordinates manually below.
          </Text>
        </HStack>
      </Box>

      {/* Map Container */}
      <Box position="relative">
        <Box
          ref={mapRef}
          height={height}
          width="100%"
          borderRadius="md"
          overflow="hidden"
          border="1px solid"
          borderColor="gray.200"
        />
        
        {/* Map Controls */}
        <Box position="absolute" top={2} right={2}>
          <Button size="sm" onClick={centerOnMaldives} bg="white" shadow="md">
            Center on Maldives
          </Button>
        </Box>
      </Box>

      {/* Selected Coordinates Display */}
      {selectedLocation && (
        <Box bg="green.50" p={3} borderRadius="md">
          <HStack justify="space-between" align="center">
            <VStack align="start" spacing={1}>
              <Text fontSize="sm" fontWeight="medium" color="green.800">
                Selected Location:
              </Text>
              <HStack spacing={4}>
                <Badge colorScheme="green">
                  Lat: {selectedLocation.lat.toFixed(6)}
                </Badge>
                <Badge colorScheme="green">
                  Lng: {selectedLocation.lng.toFixed(6)}
                </Badge>
              </HStack>
            </VStack>
          </HStack>
        </Box>
      )}

      {/* Manual Input */}
      <VStack spacing={3}>
        <Text fontSize="sm" fontWeight="medium" color="gray.600">
          Or enter coordinates manually:
        </Text>
        <HStack spacing={4} w="full">
          <FormControl>
            <FormLabel fontSize="sm">Latitude</FormLabel>
            <Input
              type="number"
              step="any"
              value={selectedLocation?.lat || ''}
              onChange={(e) => handleManualInput('lat', e.target.value)}
              placeholder="3.2028"
              size="sm"
            />
          </FormControl>
          <FormControl>
            <FormLabel fontSize="sm">Longitude</FormLabel>
            <Input
              type="number"
              step="any"
              value={selectedLocation?.lng || ''}
              onChange={(e) => handleManualInput('lng', e.target.value)}
              placeholder="73.2207"
              size="sm"
            />
          </FormControl>
        </HStack>
      </VStack>
    </VStack>
  );
}
