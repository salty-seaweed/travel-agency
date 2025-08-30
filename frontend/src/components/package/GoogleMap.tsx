import React, { useEffect, useRef, useState } from 'react';
import { Box, Text, VStack, HStack, Badge } from '@chakra-ui/react';
import type { PackageDestination } from '../../types';

interface GoogleMapProps {
  destinations: PackageDestination[];
  height?: string | number;
  apiKey?: string;
}

declare global {
  interface Window {
    google: any;
    initGoogleMaps: () => void;
  }
}

export function GoogleMap({ destinations, height = 360, apiKey }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [mapError, setMapError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showBothViews, setShowBothViews] = useState(true);

  useEffect(() => {
    const loadGoogleMaps = () => {
      // Check if we have a valid API key
      const googleApiKey = apiKey || process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
      
      // If no valid API key, skip Google Maps but still show journey route
      if (!googleApiKey || googleApiKey === 'AIzaSyBFw0Qbyq9zTFTd-tUY6dOWTgHz-TrU_T4') {
        console.warn('No valid Google Maps API key provided, showing journey route only');
        setMapError(true);
        setIsLoading(false);
        return;
      }

      // If Google Maps is already loaded, initialize the map
      if (window.google && window.google.maps) {
        initializeMap();
        return;
      }

      // Create a callback function
      window.initGoogleMaps = initializeMap;

      // Load Google Maps script
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&callback=initGoogleMaps`;
      script.async = true;
      script.defer = true;
      script.onerror = () => {
        console.warn('Failed to load Google Maps, showing destination list instead');
        setMapError(true);
        setIsLoading(false);
      };
      document.head.appendChild(script);

      // Cleanup function
      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
        delete window.initGoogleMaps;
      };
    };

    const initializeMap = () => {
      if (!mapRef.current || !window.google) return;
      
      setIsLoading(false);

      // Get valid coordinates from destinations
      const points = destinations
        .map(d => {
          const lat = (d.location as any)?.latitude;
          const lng = (d.location as any)?.longitude;
          const label = (d.location as any)?.island || 'Stop';
          if (typeof lat === 'number' && typeof lng === 'number') {
            return { lat, lng, label };
          }
          return null;
        })
        .filter(Boolean);

      // Default center (Maldives)
      const center = points.length > 0 
        ? { lat: points[0]!.lat, lng: points[0]!.lng }
        : { lat: 3.2028, lng: 73.2207 };

      // Initialize map
      const map = new window.google.maps.Map(mapRef.current, {
        zoom: points.length > 1 ? 8 : 10,
        center,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        styles: [
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#e9e9e9' }, { lightness: 17 }]
          },
          {
            featureType: 'landscape',
            elementType: 'geometry',
            stylers: [{ color: '#f5f5f5' }, { lightness: 20 }]
          }
        ]
      });

      mapInstanceRef.current = map;

      // Add markers for each destination
      const markers: any[] = [];
      const bounds = new window.google.maps.LatLngBounds();

      points.forEach((point, index) => {
        const marker = new window.google.maps.Marker({
          position: { lat: point!.lat, lng: point!.lng },
          map,
          title: `Stop ${index + 1}: ${point!.label}`,
          label: {
            text: `${index + 1}`,
            color: 'white',
            fontWeight: 'bold'
          },
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: '#7c3aed',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
            scale: 12
          }
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; min-width: 120px;">
              <strong>Stop ${index + 1}</strong><br/>
              <span style="color: #666;">${point!.label}</span>
            </div>
          `
        });

        marker.addListener('click', () => {
          // Close all other info windows
          markers.forEach(m => m.infoWindow?.close());
          infoWindow.open(map, marker);
        });

        markers.push({ marker, infoWindow });
        bounds.extend({ lat: point!.lat, lng: point!.lng });
      });

      // Draw path between destinations if there are multiple points
      if (points.length > 1) {
        const path = points.map(p => ({ lat: p!.lat, lng: p!.lng }));
        
        new window.google.maps.Polyline({
          path,
          geodesic: true,
          strokeColor: '#7c3aed',
          strokeOpacity: 1.0,
          strokeWeight: 3,
          map
        });

        // Fit map to show all markers
        map.fitBounds(bounds);
        
        // Ensure minimum zoom level
        const listener = window.google.maps.event.addListener(map, 'idle', () => {
          if (map.getZoom() > 12) map.setZoom(12);
          window.google.maps.event.removeListener(listener);
        });
      }
    };

    loadGoogleMaps();
  }, [destinations, apiKey]);

  if (!destinations || destinations.length === 0) {
    return null;
  }

  // Create the journey route component
  const renderJourneyRoute = () => {
    const points = destinations
      .map((d, index) => {
        const label = (d.location as any)?.island || `Destination ${index + 1}`;
        const atoll = (d.location as any)?.atoll || '';
        const description = d.description || '';
        const duration = d.duration || 0;
        return { label, atoll, description, duration };
      });

    return (
      <Box borderRadius="lg" border="1px solid" borderColor="gray.200" p={6} bg="linear-gradient(135deg, #EBF8FF 0%, #FAF5FF 100%)">
        <VStack spacing={5} align="stretch">
          <VStack spacing={2}>
            <Text fontSize="xl" fontWeight="bold" color="gray.800" textAlign="center">
              🗺️ Journey Route
            </Text>
            <Text fontSize="sm" color="gray.600" textAlign="center">
              Your adventure through {points.length} amazing {points.length === 1 ? 'destination' : 'destinations'}
            </Text>
          </VStack>
          
          <VStack spacing={4} align="stretch">
            {points.map((point, index) => (
              <Box 
                key={index} 
                p={4} 
                bg="white" 
                borderRadius="lg" 
                border="1px solid" 
                borderColor="gray.200"
                boxShadow="sm"
                position="relative"
                _hover={{ boxShadow: 'md', transform: 'translateY(-1px)' }}
                transition="all 0.2s"
              >
                <HStack spacing={3} align="start">
                  <Box
                    minW={8}
                    h={8}
                    bg="purple.500"
                    color="white"
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize="sm"
                    fontWeight="bold"
                  >
                    {index + 1}
                  </Box>
                  <VStack align="start" spacing={2} flex={1}>
                    <HStack justify="space-between" w="full">
                      <Text fontWeight="bold" color="gray.800" fontSize="md">
                        {point.label}
                      </Text>
                      {point.duration > 0 && (
                        <Badge colorScheme="blue" variant="subtle">
                          {point.duration} {point.duration === 1 ? 'day' : 'days'}
                        </Badge>
                      )}
                    </HStack>
                    
                    {point.atoll && (
                      <Badge colorScheme="purple" size="sm">
                        📍 {point.atoll}
                      </Badge>
                    )}
                    
                    {point.description && (
                      <Text fontSize="sm" color="gray.600" lineHeight="1.5">
                        {point.description.length > 100 
                          ? `${point.description.substring(0, 100)}...` 
                          : point.description
                        }
                      </Text>
                    )}
                  </VStack>
                </HStack>
                
                {/* Connection line to next destination */}
                {index < points.length - 1 && (
                  <Box
                    position="absolute"
                    left="19px"
                    bottom="-16px"
                    w="2px"
                    h="16px"
                    bg="purple.300"
                    zIndex={1}
                  />
                )}
              </Box>
            ))}
          </VStack>
          
        </VStack>
      </Box>
    );
  };

  // Show both journey route and Google Maps when available
  if (mapError) {
    return (
      <VStack spacing={6} align="stretch">
        {renderJourneyRoute()}
        <Box textAlign="center" p={4} bg="blue.50" borderRadius="lg" border="1px solid" borderColor="blue.200">
          <Text fontSize="sm" color="blue.700" fontWeight="medium" mb={2}>
            🗺️ Want to see an interactive map?
          </Text>
          <Text fontSize="xs" color="blue.600">
            Coming Soon
          </Text>
        </Box>
      </VStack>
    );
  }

  // Show both journey route and interactive map when Google Maps is available
  return (
    <VStack spacing={6} align="stretch">
      {renderJourneyRoute()}
      
      <Box>
        <Text fontSize="lg" fontWeight="bold" color="gray.800" mb={4} textAlign="center">
          🌍 Interactive Map
        </Text>
        <Box borderRadius="lg" overflow="hidden" border="1px solid" borderColor="gray.200">
          {isLoading && (
            <Box 
              position="absolute" 
              top="50%" 
              left="50%" 
              transform="translate(-50%, -50%)" 
              zIndex={10}
              bg="white" 
              p={4} 
              borderRadius="md" 
              boxShadow="md"
            >
              <Text fontSize="sm" color="gray.600">Loading interactive map...</Text>
            </Box>
          )}
          <div 
            ref={mapRef} 
            style={{ 
              height: typeof height === 'number' ? `${height}px` : height,
              width: '100%',
              minHeight: '300px'
            }} 
          />
        </Box>
      </Box>
    </VStack>
  );
}
