import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import { Card, Button } from './index';
import { useNavigate } from 'react-router-dom';
import { LazyImage } from './LazyImage';
import {
  MapPinIcon,
  StarIcon,
  CurrencyDollarIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

// Fix for default markers in react-leaflet
import L from 'leaflet';
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Package {
  id: number;
  name: string;
  description: string;
  price: string;
  location: {
    latitude: number;
    longitude: number;
    island: string;
    atoll: string;
  };
  category: string;
  destinations: Array<{
    location: {
      island: string;
      atoll: string;
    };
  }>;
  images: Array<{
    image: string;
  }>;
  rating?: number;
  review_count?: number;
  is_featured: boolean;
}

interface InteractiveMapProps {
  packages: Package[];
  height?: string;
  showFilters?: boolean;
  onPackageClick?: (pkg: Package) => void;
}

// Custom marker icon for packages
const createPackageIcon = (isFeatured: boolean) => {
  return L.divIcon({
    html: `
      <div class="relative">
        <div class="w-8 h-8 bg-blue-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
          <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
          </svg>
        </div>
        ${isFeatured ? `
          <div class="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border border-white flex items-center justify-center">
            <svg class="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
        ` : ''}
      </div>
    `,
    className: 'custom-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

// Map controls component
function MapControls({ onResetView }: { onResetView: () => void }) {
  const map = useMap();

  const handleResetView = () => {
    // Reset to Maldives view
    map.setView([3.2028, 73.2207], 7);
    onResetView();
  };

  return (
    <div className="absolute top-4 right-4 z-[1000] space-y-2">
      <Button
        onClick={handleResetView}
        variant="secondary"
        className="bg-white shadow-lg hover:bg-gray-50"
      >
        Reset View
      </Button>
    </div>
  );
}

export function InteractiveMap({ 
  packages, 
  height = "600px", 
  showFilters = false,
  onPackageClick 
}: InteractiveMapProps) {
  const navigate = useNavigate();
  const [filteredPackages, setFilteredPackages] = useState<Package[]>(packages);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  // Maldives center coordinates
  const maldivesCenter = [3.2028, 73.2207];

  useEffect(() => {
    setFilteredPackages(packages);
  }, [packages]);

  const handleFilterChange = () => {
    let filtered = packages;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Filter by price range
    filtered = filtered.filter(p => {
      const price = parseFloat(p.price.replace(/[^0-9.]/g, ''));
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Filter by featured
    if (showFeaturedOnly) {
      filtered = filtered.filter(p => p.is_featured);
    }

    setFilteredPackages(filtered);
  };

  useEffect(() => {
    handleFilterChange();
  }, [selectedCategory, priceRange, showFeaturedOnly, packages]);

  const categories = Array.from(new Set(packages.map(p => p.category)));
  const maxPrice = Math.max(...packages.map(p => parseFloat(p.price.replace(/[^0-9.]/g, '')) || 0));

  const handlePackageClick = (pkg: Package) => {
    if (onPackageClick) {
      onPackageClick(pkg);
    } else {
      navigate(`/packages/${pkg.id}`);
    }
  };

  return (
    <div className="relative">
      {showFilters && (
        <Card className="mb-4 p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Package Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Package Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price Range (per night)
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Min"
                />
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Max"
                />
              </div>
            </div>

            {/* Featured Only Filter */}
            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showFeaturedOnly}
                  onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Featured Only</span>
              </label>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-end">
              <span className="text-sm text-gray-600">
                {filteredPackages.length} of {packages.length} packages
              </span>
            </div>
          </div>
        </Card>
      )}

      <div className="relative" style={{ height }}>
        <MapContainer
          center={maldivesCenter as [number, number]}
          zoom={7}
          style={{ height: '100%', width: '100%' }}
          className="rounded-lg"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MarkerClusterGroup
            chunkedLoading
            maxClusterRadius={60}
            spiderfyOnMaxZoom={true}
            polygonOptions={{
              fillColor: '#3B82F6',
              color: '#1E40AF',
              weight: 0.5,
              opacity: 1,
              fillOpacity: 0.3
            }}
            iconCreateFunction={(cluster: any) => {
              const count = cluster.getChildCount();
              let size = 'small';
              if (count > 10) size = 'large';
              else if (count > 5) size = 'medium';
              
              return L.divIcon({
                html: `<div><span>${count}</span></div>`,
                className: `marker-cluster marker-cluster-${size}`,
                iconSize: L.point(40, 40)
              });
            }}
          >
            {filteredPackages.map((pkg) => {
              // Get coordinates from package location (destinations don't have lat/lng)
              const latitude = pkg.location?.latitude || 3.2028;
              const longitude = pkg.location?.longitude || 73.2207;
              
              return (
                <Marker
                  key={pkg.id}
                  position={[latitude, longitude]}
                  icon={createPackageIcon(pkg.is_featured)}
                  eventHandlers={{
                    click: () => handlePackageClick(pkg),
                  }}
                >
                <Popup>
                  <div className="w-64">
                    <div className="mb-3">
                      {pkg.images && pkg.images.length > 0 && (
                        <LazyImage
                          src={pkg.images[0].image}
                          alt={pkg.name}
                          className="w-full h-32 object-cover rounded-lg mb-2"
                        />
                      )}
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-1">{pkg.name}</h3>
                    
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPinIcon className="w-4 h-4 mr-1" />
                      {pkg.destinations?.[0]?.location?.island || pkg.location.island}, {pkg.destinations?.[0]?.location?.atoll || pkg.location.atoll}
                    </div>
                    
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <CurrencyDollarIcon className="w-4 h-4 text-green-600 mr-1" />
                        <span className="font-semibold text-green-600">
                          {pkg.price}
                        </span>
                      </div>
                      
                      {pkg.rating && (
                        <div className="flex items-center">
                          <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
                          <span className="text-sm font-medium">{pkg.rating}</span>
                          {pkg.review_count && (
                            <span className="text-gray-500 text-sm ml-1">
                              ({pkg.review_count})
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {pkg.category}
                      </span>
                      {pkg.is_featured && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Featured
                        </span>
                      )}
                    </div>
                    
                    <Button
                      onClick={() => handlePackageClick(pkg)}
                      variant="primary"
                      className="w-full mt-3"
                    >
                      <EyeIcon className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </Popup>
              </Marker>
            )})}
          </MarkerClusterGroup>
          
          <MapControls onResetView={() => {
            setSelectedCategory('all');
            setPriceRange([0, maxPrice]);
            setShowFeaturedOnly(false);
          }} />
        </MapContainer>
      </div>

      <style>{`
        .custom-marker {
          background: transparent;
          border: none;
        }
        
        .leaflet-popup-content-wrapper {
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        
        .leaflet-popup-content {
          margin: 0;
          padding: 0;
        }
        
        .leaflet-popup-tip {
          background: white;
        }

        /* Custom cluster styles */
        .marker-cluster {
          background: rgba(59, 130, 246, 0.8);
          border: 2px solid #1e40af;
          border-radius: 50%;
          color: white;
          font-weight: bold;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .marker-cluster:hover {
          background: rgba(59, 130, 246, 1);
        }

        .marker-cluster-small {
          width: 40px;
          height: 40px;
          font-size: 12px;
        }

        .marker-cluster-medium {
          width: 50px;
          height: 50px;
          font-size: 14px;
        }

        .marker-cluster-large {
          width: 60px;
          height: 60px;
          font-size: 16px;
        }
      `}</style>
    </div>
  );
} 