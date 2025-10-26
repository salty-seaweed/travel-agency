import { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface LocationMapPickerProps {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => void;
  onLocationSelect?: (locationData: { island: string; atoll: string; fullName: string }) => void;
}

function LocationMapPicker({ lat, lng, onChange, onLocationSelect }: LocationMapPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Click outside handler to close search results
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

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  function LocationMarker() {
    useMapEvents({
      async click(e: any) {
        const newLat = e.latlng.lat;
        const newLng = e.latlng.lng;
        onChange(newLat, newLng);
        
        // Use enhanced reverse geocoding
        await enhancedReverseGeocoding(newLat, newLng);
      },
    });
    return <Marker position={[lat, lng]} />;
  }

  const parseLocationData = (data: any) => {
    const displayName = data.display_name || '';
    const address = data.address || {};
    
    // Try to extract island name and atoll from the address components
    let island = '';
    let atoll = '';
    
    // For Maldives, try different address components for island name
    // OpenStreetMap might use different field names for islands
    if (address.island) {
      island = address.island;
    } else if (address.city) {
      island = address.city;
    } else if (address.town) {
      island = address.town;
    } else if (address.village) {
      island = address.village;
    } else if (address.hamlet) {
      island = address.hamlet;
    } else if (address.suburb) {
      island = address.suburb;
    } else if (address.neighbourhood) {
      island = address.neighbourhood;
    }
    
    // For atoll, try different components
    if (address.county) {
      atoll = address.county;
    } else if (address.state) {
      atoll = address.state;
    } else if (address.region) {
      atoll = address.region;
    }
    
    // If we still don't have island/atoll, try parsing display_name more intelligently
    if (!island || !atoll) {
      const parts = displayName.split(', ');
      
      // For Maldives, the pattern is usually: Island, Atoll, Maldives
      // or sometimes: Island, Atoll, Administrative Division, Maldives
      if (parts.length >= 2) {
        // First part is usually the island
        if (!island && parts[0] && !parts[0].toLowerCase().includes('atoll')) {
          island = parts[0];
        }
        
        // Look for atoll in the parts
        for (let i = 1; i < parts.length; i++) {
          const part = parts[i];
          if (part.toLowerCase().includes('atoll') && !atoll) {
            atoll = part;
            break;
          }
        }
        
        // If no atoll found but we have multiple parts, second part might be atoll
        if (!atoll && parts.length >= 2 && parts[1] && !parts[1].toLowerCase().includes('maldives')) {
          atoll = parts[1];
        }
      }
    }
    
    // Debug logging to see what we're getting
    console.log('OpenStreetMap data:', data);
    console.log('Parsed location data:', { island, atoll, fullName: displayName });
    
    return {
      island: island || 'Unknown Island',
      atoll: atoll || 'Unknown Atoll',
      fullName: displayName
    };
  };

  // Enhanced reverse geocoding with search fallback
  const enhancedReverseGeocoding = async (lat: number, lng: number) => {
    setIsReverseGeocoding(true);
    try {
      // First try reverse geocoding
      const reverseResponse = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1&countrycodes=mv`
      );
      const reverseData = await reverseResponse.json();
      
      let locationData = parseLocationData(reverseData);
      
      // If we got "Unknown Island", try to search nearby
      if (locationData.island === 'Unknown Island') {
        // Search in a small radius around the clicked point
        const searchResponse = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${lat},${lng}&limit=10&countrycodes=mv&radius=5000`
        );
        const searchData = await searchResponse.json();
        
        if (searchData.length > 0) {
          // Filter and prioritize island names over specific locations
          const islandResults = searchData.filter((result: any) => {
            const displayName = result.display_name.toLowerCase();
            const type = result.type || '';
            
            // Prioritize results that look like island names
            const isIslandName = 
              type === 'island' ||
              type === 'city' ||
              type === 'town' ||
              type === 'village' ||
              type === 'hamlet' ||
              !displayName.includes('resort') &&
              !displayName.includes('hotel') &&
              !displayName.includes('guesthouse') &&
              !displayName.includes('villa') &&
              !displayName.includes('beach') &&
              !displayName.includes('airport') &&
              !displayName.includes('harbor') &&
              !displayName.includes('marina') &&
              !displayName.includes('dive') &&
              !displayName.includes('spa') &&
              !displayName.includes('restaurant') &&
              !displayName.includes('cafe') &&
              !displayName.includes('shop') &&
              !displayName.includes('store');
            
            return isIslandName;
          });
          
          // Use the first island result, or fall back to the first result
          const bestMatch = islandResults.length > 0 ? islandResults[0] : searchData[0];
          locationData = parseLocationData(bestMatch);
        }
      }
      
      if (locationData.island !== 'Unknown Island' && onLocationSelect) {
        onLocationSelect(locationData);
      }
      
    } catch (error) {
      console.error('Enhanced reverse geocoding error:', error);
    } finally {
      setIsReverseGeocoding(false);
    }
  };

  const searchLocation = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }
    
    console.log('Searching for:', query);
    setIsSearching(true);
    
    try {
      // Simplified search URL
      const searchUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=10&countrycodes=mv`;
      console.log('Search URL:', searchUrl);
      
      const response = await fetch(searchUrl);
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Search failed: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Raw search results:', data);
      
      // For now, show all results without filtering
      setSearchResults(data);
      setShowSearchResults(true);
      
    } catch (error) {
      console.error('Geocoding error:', error);
      setSearchResults([]);
      setShowSearchResults(false);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Search submitted:', searchQuery);
    searchLocation(searchQuery);
  };

  const handleLocationSelect = (result: any) => {
    console.log('Location selected:', result);
    const newLat = parseFloat(result.lat);
    const newLng = parseFloat(result.lon);
    onChange(newLat, newLng);
    setSearchQuery(result.display_name);
    setShowSearchResults(false);
    
    // Also trigger location data parsing for search results
    if (onLocationSelect) {
      const locationData = parseLocationData(result);
      console.log('Parsed location data:', locationData);
      onLocationSelect(locationData);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    console.log('Search query changed:', query);
    
    // Clear results if query is too short
    if (query.length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }
    
    // Add a small delay to avoid too many requests
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      searchLocation(query);
    }, 300);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent form submission on Enter key
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      searchLocation(searchQuery);
    }
    
    // Close search results on Escape key
    if (e.key === 'Escape') {
      setShowSearchResults(false);
    }
  };

  const testSearch = () => {
    console.log('Testing search with "Maafushi"');
    searchLocation('Maafushi');
  };

  return (
    <div className="space-y-3">
      {/* Search Bar */}
      <div className="relative z-50" ref={searchRef}>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search for a location in Maldives..."
            className="w-full px-4 py-2 pl-10 pr-20 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <button
            type="button"
            onClick={() => searchLocation(searchQuery)}
            disabled={isSearching || !searchQuery.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSearching ? (
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Searching...</span>
              </div>
            ) : (
              'Search'
            )}
          </button>
        </div>
        
        {/* Search Results Dropdown */}
        {showSearchResults && searchResults.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border-2 border-blue-200 rounded-lg shadow-2xl max-h-60 overflow-y-auto">
            {searchResults.map((result, index) => (
              <button
                key={index}
                onClick={() => handleLocationSelect(result)}
                className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors focus:outline-none focus:bg-blue-50"
                type="button"
              >
                <div className="font-medium text-gray-800">{result.display_name.split(',')[0]}</div>
                <div className="text-sm text-gray-500">{result.display_name}</div>
                <div className="text-xs text-blue-600 mt-1">
                  {result.lat}, {result.lon}
                </div>
              </button>
            ))}
          </div>
        )}
        
        {/* No Results Message */}
        {showSearchResults && searchResults.length === 0 && searchQuery.length > 2 && !isSearching && (
          <div className="absolute z-50 w-full mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-2xl p-4">
            <div className="text-center text-gray-500">
              <p>No locations found for "{searchQuery}"</p>
              <p className="text-xs mt-1">Try searching for island names like "Maafushi", "Hulhumale", etc.</p>
            </div>
          </div>
        )}
        
        {/* Test Button for Debugging */}
        <div className="mt-2">
          <button
            type="button"
            onClick={testSearch}
            className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded text-gray-600"
          >
            Test Search (Maafushi)
          </button>
        </div>
      </div>
      {/* Map */}
      <div className="relative z-10">
        <MapContainer 
          center={[lat, lng] as [number, number]} 
          zoom={7} 
          style={{ height: 300, width: '100%' }}
          className="rounded-lg border border-gray-200"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationMarker />
        </MapContainer>
        {/* Coordinates Display */}
        <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur px-3 py-2 rounded-lg shadow text-sm">
          <div className="font-mono text-gray-700">
            <div>Lat: {lat.toFixed(6)}</div>
            <div>Lng: {lng.toFixed(6)}</div>
          </div>
        </div>
        {/* Reverse Geocoding Indicator */}
        {isReverseGeocoding && (
          <div className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-lg text-sm shadow-lg">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Getting location details...
            </div>
          </div>
        )}
      </div>
      {/* Instructions */}
      <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
        <p className="font-medium mb-1">How to use:</p>
        <ul className="space-y-1">
          <li>• Search for a location using the search bar above</li>
          <li>• Try searching for: "Maafushi", "Hulhumale", "Male", "North Male Atoll"</li>
          <li>• Click on the map to manually set coordinates</li>
          <li>• Location details will be automatically filled</li>
          <li>• Selected coordinates will be saved automatically</li>
        </ul>
        {searchQuery && (
          <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
            <p className="text-blue-800 text-xs">
              <strong>Search Tip:</strong> Try searching for specific island names or atoll names for better results.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export { LocationMapPicker };
export default LocationMapPicker; 