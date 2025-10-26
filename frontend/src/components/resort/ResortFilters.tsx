import React from 'react';
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  FunnelIcon,
  StarIcon,
  MapPinIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import { ResortFiltersProps } from '../../types';

const RESORT_CATEGORIES = [
  { value: 'luxury', label: 'Luxury Resort' },
  { value: 'semi_luxury', label: 'Semi Luxury' },
  { value: 'boutique', label: 'Boutique Resort' },
  { value: 'adults_only', label: 'Adults Only' },
  { value: 'family_friendly', label: 'Family Friendly' },
  { value: 'honeymoon', label: 'Honeymoon Resort' },
  { value: 'adventure', label: 'Adventure Resort' },
  { value: 'wellness', label: 'Wellness Resort' },
];

const STAR_RATINGS = [
  { value: 3, label: '3 Stars' },
  { value: 4, label: '4 Stars' },
  { value: 5, label: '5 Stars' },
  { value: 6, label: '6 Stars' },
];

const ATOLS = [
  'North Male Atoll',
  'South Male Atoll',
  'Ari Atoll',
  'Baa Atoll',
  'Raa Atoll',
  'Lhaviyani Atoll',
  'Noonu Atoll',
  'Shaviyani Atoll',
  'Haa Alifu Atoll',
  'Haa Dhaalu Atoll',
  'Thaa Atoll',
  'Laamu Atoll',
  'Gaafu Alifu Atoll',
  'Gaafu Dhaalu Atoll',
  'Gnaviyani Atoll',
  'Seenu Atoll',
];

export function ResortFilters({ filters, onFiltersChange, onClearFilters }: ResortFiltersProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [localFilters, setLocalFilters] = React.useState(filters);

  React.useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key: keyof typeof filters, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters: typeof filters = {};
    setLocalFilters(clearedFilters);
    onClearFilters();
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== null && value !== ''
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <FunnelIcon className="w-5 h-5 text-gray-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          {hasActiveFilters && (
            <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {Object.values(filters).filter(v => v !== undefined && v !== null && v !== '').length} active
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="text-sm text-gray-600 hover:text-red-600 flex items-center"
            >
              <XMarkIcon className="w-4 h-4 mr-1" />
              Clear All
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            {isExpanded ? 'Show Less' : 'Show More'}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search resorts..."
            value={localFilters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Basic Filters (Always Visible) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            value={localFilters.category || ''}
            onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {RESORT_CATEGORIES.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        {/* Star Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Star Rating</label>
          <select
            value={localFilters.star_rating || ''}
            onChange={(e) => handleFilterChange('star_rating', e.target.value ? parseInt(e.target.value) : undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Ratings</option>
            {STAR_RATINGS.map((rating) => (
              <option key={rating.value} value={rating.value}>
                {rating.label}
              </option>
            ))}
          </select>
        </div>

        {/* Atoll */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Atoll</label>
          <select
            value={localFilters.atoll || ''}
            onChange={(e) => handleFilterChange('atoll', e.target.value || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Atolls</option>
            {ATOLS.map((atoll) => (
              <option key={atoll} value={atoll}>
                {atoll}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min"
              value={localFilters.min_price || ''}
              onChange={(e) => handleFilterChange('min_price', e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="number"
              placeholder="Max"
              value={localFilters.max_price || ''}
              onChange={(e) => handleFilterChange('max_price', e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Advanced Filters (Expandable) */}
      {isExpanded && (
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-md font-medium text-gray-900 mb-4">Special Features</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Adults Only */}
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={localFilters.adults_only || false}
                onChange={(e) => handleFilterChange('adults_only', e.target.checked || undefined)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Adults Only</span>
            </label>

            {/* Family Friendly */}
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={localFilters.family_friendly || false}
                onChange={(e) => handleFilterChange('family_friendly', e.target.checked || undefined)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Family Friendly</span>
            </label>

            {/* Honeymoon */}
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={localFilters.honeymoon || false}
                onChange={(e) => handleFilterChange('honeymoon', e.target.checked || undefined)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Honeymoon</span>
            </label>

            {/* Eco Friendly */}
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={localFilters.eco_friendly || false}
                onChange={(e) => handleFilterChange('eco_friendly', e.target.checked || undefined)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Eco Friendly</span>
            </label>

            {/* Featured */}
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={localFilters.is_featured || false}
                onChange={(e) => handleFilterChange('is_featured', e.target.checked || undefined)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Featured Only</span>
            </label>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {Object.entries(filters).map(([key, value]) => {
              if (value === undefined || value === null || value === '') return null;
              
              let displayValue = value.toString();
              if (key === 'category') {
                const category = RESORT_CATEGORIES.find(c => c.value === value);
                displayValue = category?.label || value.toString();
              } else if (key === 'star_rating') {
                displayValue = `${value} Stars`;
              } else if (key === 'min_price' || key === 'max_price') {
                displayValue = `$${value}`;
              } else if (typeof value === 'boolean') {
                displayValue = key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
              }
              
              return (
                <span
                  key={key}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                >
                  {displayValue}
                  <button
                    onClick={() => handleFilterChange(key as keyof typeof filters, undefined)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
