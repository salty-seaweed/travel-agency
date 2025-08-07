import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { PropertyCard } from './ui/PropertyCard';
import { SearchFilters } from './ui/SearchFilters';
import { useProperties, usePropertyTypes, useAmenities, useLocations } from '../hooks/useApi';
import { LoadingSpinner } from './LoadingSpinner';
import type { Property as ApiProperty } from '../services/api';

// Convert API property to PropertyCard format
const convertApiPropertyToCardFormat = (property: ApiProperty) => ({
  id: property.id,
  name: property.name,
  location: `${property.location.island}, ${property.location.atoll}`,
  price: parseFloat(property.price_per_night),
  rating: 4.5, // You might want to calculate this from reviews
  reviewCount: property.reviews?.length || 0,
  image: property.images?.[0]?.image || 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop',
  type: property.property_type.name,
  amenities: property.amenities.map(a => a.name),
  description: property.description,
  featured: property.is_featured,
});

export function PropertyListPage() {
  const { data: properties, loading: propertiesLoading, error: propertiesError } = useProperties();
  const { data: propertyTypes } = usePropertyTypes();
  const { data: amenities } = useAmenities();
  const { data: locations } = useLocations();

  // Convert API data to the format expected by PropertyCard
  const convertedProperties = properties ? properties.map(convertApiPropertyToCardFormat) : [];

  const propertyTypeOptions = ['all', ...(propertyTypes?.map(pt => pt.name) || [])];
  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'reviews', label: 'Most Reviewed' }
  ];

  // Filter and sort properties
  const [filters, setFilters] = React.useState({
    searchTerm: '',
    selectedType: 'all',
    selectedLocation: 'all',
    selectedAmenities: [] as string[],
    priceRange: [0, 1000] as [number, number],
    sortBy: 'featured'
  });

  const filteredProperties = React.useMemo(() => {
    let filtered = [...convertedProperties];

    // Search filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(property =>
        property.name.toLowerCase().includes(searchLower) ||
        property.location.toLowerCase().includes(searchLower) ||
        property.description.toLowerCase().includes(searchLower)
      );
    }

    // Type filter
    if (filters.selectedType !== 'all') {
      filtered = filtered.filter(property => property.type === filters.selectedType);
    }

    // Location filter
    if (filters.selectedLocation !== 'all') {
      filtered = filtered.filter(property => property.location.includes(filters.selectedLocation));
    }

    // Amenities filter
    if (filters.selectedAmenities.length > 0) {
      filtered = filtered.filter(property =>
        filters.selectedAmenities.every(amenity => property.amenities.includes(amenity))
      );
    }

    // Price filter
    filtered = filtered.filter(property =>
      property.price >= filters.priceRange[0] && property.price <= filters.priceRange[1]
    );

    // Sort
    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'reviews':
        filtered.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'featured':
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return filtered;
  }, [convertedProperties, filters]);

  const updateFilter = (filterType: string, value: any) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      selectedType: 'all',
      selectedLocation: 'all',
      selectedAmenities: [],
      priceRange: [0, 1000] as [number, number],
      sortBy: 'featured'
    });
  };

  const locationOptions = ['all', ...(locations?.map(loc => loc.island) || [])];
  const amenityOptions = amenities?.map(a => a.name) || [];

  const filterOptions = {
    types: propertyTypeOptions,
    locations: locationOptions,
    amenities: amenityOptions,
    sortOptions,
    maxPrice: 1000
  };

  if (propertiesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (propertiesError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading properties</h3>
          <p className="text-gray-600">{propertiesError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SearchFilters
        searchTerm={filters.searchTerm}
        onSearchChange={(value) => updateFilter('searchTerm', value)}
        filters={{
          type: filters.selectedType,
          priceRange: filters.priceRange,
          sortBy: filters.sortBy
        }}
        onFilterChange={(filterType, value) => {
          if (filterType === 'type') {
            updateFilter('selectedType', value);
          } else {
            updateFilter(filterType, value);
          }
        }}
        onClearFilters={clearFilters}
        showFilters={true}
        onToggleFilters={() => {}} // Always show filters for now
        filterOptions={filterOptions}
        title="Properties"
        subtitle={`${filteredProperties.length} properties found`}
      >
        {/* Content Area */}
        <div className="flex-1">
          {filteredProperties.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <MagnifyingGlassIcon className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  showAmenities={true}
                  showDescription={true}
                />
              ))}
            </div>
          )}
        </div>
      </SearchFilters>
    </div>
  );
}

export default PropertyListPage; 