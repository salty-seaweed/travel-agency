import React, { useState, useCallback, useEffect } from 'react';
import { MagnifyingGlassIcon, XMarkIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { useGlobalSearch } from '../hooks/useQueries';
import { useDebounce } from '../utils/performanceUtils';
import { ComponentErrorBoundary } from './SimpleErrorBoundary';
import { LoadingSpinner } from './index';
import type { Property, Package } from '../types';

interface SearchFilters {
  type: 'all' | 'properties' | 'packages';
  priceRange: { min: number; max: number };
  location: string;
  amenities: string[];
}

interface SearchResultsProps {
  properties: Property[];
  packages: Package[];
  isLoading: boolean;
  onResultClick: (type: 'property' | 'package', id: number) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  properties,
  packages,
  isLoading,
  onResultClick,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  const hasResults = properties.length > 0 || packages.length > 0;

  if (!hasResults) {
    return (
      <div className="text-center py-8 text-gray-500">
        <MagnifyingGlassIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p>No results found. Try adjusting your search terms.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {properties.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Properties ({properties.length})
          </h3>
          <div className="grid gap-4">
            {properties.map((property) => (
              <div
                key={property.id}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onResultClick('property', property.id)}
              >
                <div className="flex items-start gap-4">
                  <img
                    src={property.images?.[0]?.image || '/placeholder-property.jpg'}
                    alt={property.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{property.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {property.location.island}, {property.location.atoll}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {property.property_type.name}
                      </span>
                      <span className="font-semibold text-green-600">
                        ${property.price}/night
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {packages.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Packages ({packages.length})
          </h3>
          <div className="grid gap-4">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onResultClick('package', pkg.id)}
              >
                <div className="flex items-start gap-4">
                  <img
                    src="/placeholder-package.jpg"
                    alt={pkg.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{pkg.name}</h4>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {pkg.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {pkg.duration} days • {pkg.destinations.length} islands
                      </span>
                      <span className="font-semibold text-green-600">
                        ${pkg.price}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface EnhancedSearchProps {
  onClose?: () => void;
  className?: string;
}

export const EnhancedSearch: React.FC<EnhancedSearchProps> = ({
  onClose,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    type: 'all',
    priceRange: { min: 0, max: 1000 },
    location: '',
    amenities: [],
  });

  // Debounce search query to avoid excessive API calls
  const debouncedQuery = useDebounce(searchQuery, 300);

  // Use the search hook with debounced query
  const { data, isLoading, error } = useGlobalSearch(debouncedQuery);

  const properties = data?.properties || [];
  const packages = data?.packages || [];

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    // Only open search results if there's actually a query
    setIsOpen(value.length > 2);
  }, []);

  const handleClear = useCallback(() => {
    setSearchQuery('');
    setIsOpen(false);
    setShowFilters(false);
    if (onClose) onClose();
  }, [onClose]);

  const handleResultClick = useCallback((type: 'property' | 'package', id: number) => {
    // Navigate to the result
    const path = type === 'property' ? `/properties/${id}` : `/packages/${id}`;
    window.location.href = path;
    setIsOpen(false);
    if (onClose) onClose();
  }, [onClose]);

  const handleFilterChange = useCallback((newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Close search on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setShowFilters(false);
        if (onClose) onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  return (
    <ComponentErrorBoundary componentName="EnhancedSearch">
      <div className={`relative ${className}`}>
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search properties, packages, or locations..."
            value={searchQuery}
            onChange={handleInputChange}
            className="w-full pl-12 pr-20 py-3 bg-white border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-500 focus:outline-none text-base"
          />
          
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              title="Filters"
            >
              <FunnelIcon className="h-5 w-5" />
            </button>
            
            {searchQuery && (
              <button
                onClick={handleClear}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                title="Clear search"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-4 z-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Type
                </label>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange({ type: e.target.value as SearchFilters['type'] })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Results</option>
                  <option value="properties">Properties Only</option>
                  <option value="packages">Packages Only</option>
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.priceRange.min}
                    onChange={(e) => handleFilterChange({
                      priceRange: { ...filters.priceRange, min: Number(e.target.value) }
                    })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.priceRange.max}
                    onChange={(e) => handleFilterChange({
                      priceRange: { ...filters.priceRange, max: Number(e.target.value) }
                    })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Location Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Island or Atoll"
                  value={filters.location}
                  onChange={(e) => handleFilterChange({ location: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Search Results with Overlay */}
        {isOpen && debouncedQuery && debouncedQuery.length > 2 && (isLoading || properties.length > 0 || packages.length > 0 || error) && (
          <>
            {/* Overlay to close search */}
            <div
              className="fixed inset-0 bg-gray-900 bg-opacity-25 z-30"
              onClick={() => setIsOpen(false)}
              style={{ pointerEvents: 'auto' }}
            />
            
            {/* Search Results */}
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-96 overflow-y-auto z-50">
              <div className="p-4">
                {error ? (
                  <div className="text-center py-8 text-red-600">
                    <p>Error loading search results. Please try again.</p>
                  </div>
                ) : (
                  <SearchResults
                    properties={properties}
                    packages={packages}
                    isLoading={isLoading}
                    onResultClick={handleResultClick}
                  />
                )}
              </div>
            </div>
          </>
        )}

        {/* Loading indicator when searching but no results yet */}
        {isOpen && debouncedQuery && debouncedQuery.length > 2 && isLoading && properties.length === 0 && packages.length === 0 && !error && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50">
            <div className="p-4 text-center">
              <LoadingSpinner size="sm" />
              <p className="mt-2 text-gray-600">Searching...</p>
            </div>
          </div>
        )}
      </div>
    </ComponentErrorBoundary>
  );
};

export default EnhancedSearch; 