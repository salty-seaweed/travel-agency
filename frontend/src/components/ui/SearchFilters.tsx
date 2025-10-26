import React, { useState } from 'react';
import { FunnelIcon, MagnifyingGlassIcon, XMarkIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

interface SearchFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filters: {
    type: string;
    priceRange: [number, number];
    sortBy: string;
  };
  onFilterChange: (filterType: string, value: any) => void;
  onClearFilters: () => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  filterOptions: {
    types: string[];
    sortOptions: { value: string; label: string }[];
    maxPrice: number;
  };
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export function SearchFilters({
  searchTerm,
  onSearchChange,
  filters,
  onFilterChange,
  onClearFilters,
  showFilters,
  onToggleFilters,
  filterOptions,
  title,
  subtitle,
  children
}: SearchFiltersProps) {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  return (
    <>
      {/* Header - Improved Mobile */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col gap-4">
            {/* Title and Search Row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1">{subtitle}</p>
              </div>
              
              {/* Search Bar - Improved Mobile */}
              <div className="flex-1 sm:max-w-md">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search properties..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                  />
                </div>
              </div>
            </div>

            {/* Mobile Filter Toggle */}
            <div className="flex items-center justify-between sm:hidden">
              <button
                onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium"
              >
                <AdjustmentsHorizontalIcon className="h-5 w-5" />
                Filters
                {Object.values(filters).some(v => v !== 'featured' && v !== 'all' && (Array.isArray(v) ? v[0] !== 0 || v[1] !== filterOptions.maxPrice : true)) && (
                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">Active</span>
                )}
              </button>
              
              <button
                onClick={onClearFilters}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filters Overlay */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileFiltersOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Type Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Property Type</h3>
                <div className="grid grid-cols-2 gap-2">
                  {filterOptions.types.map((type) => (
                    <button
                      key={type}
                      onClick={() => onFilterChange('type', type)}
                      className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                        filters.type === type
                          ? 'bg-blue-50 border-blue-200 text-blue-700'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {type === 'all' ? 'All Types' : type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Sort By</h3>
                <div className="space-y-2">
                  {filterOptions.sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => onFilterChange('sortBy', option.value)}
                      className={`w-full p-3 rounded-lg border text-left transition-colors ${
                        filters.sortBy === option.value
                          ? 'bg-blue-50 border-blue-200 text-blue-700'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Price Range</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>${filters.priceRange[0]}</span>
                    <span>${filters.priceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={filterOptions.maxPrice}
                    value={filters.priceRange[1]}
                    onChange={(e) => onFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>
            </div>

            {/* Mobile Filter Actions */}
            <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={onClearFilters}
                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
              >
                Clear All
              </button>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block lg:w-80">
            <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button
                  onClick={onClearFilters}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-6">
                {/* Type Filter - Improved */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Property Type</h3>
                  <div className="space-y-2">
                    {filterOptions.types.map((type) => (
                      <label key={type} className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          name="type"
                          value={type}
                          checked={filters.type === type}
                          onChange={(e) => onFilterChange('type', e.target.value)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-3 text-sm text-gray-700 capitalize">
                          {type === 'all' ? 'All Types' : type}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Sort Options - Improved */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Sort By</h3>
                  <div className="space-y-2">
                    {filterOptions.sortOptions.map((option) => (
                      <label key={option.value} className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          name="sortBy"
                          value={option.value}
                          checked={filters.sortBy === option.value}
                          onChange={(e) => onFilterChange('sortBy', e.target.value)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-3 text-sm text-gray-700">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range - Improved */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Price Range</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>${filters.priceRange[0]}</span>
                      <span>${filters.priceRange[1]}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={filterOptions.maxPrice}
                      value={filters.priceRange[1]}
                      onChange={(e) => onFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}

export default SearchFilters; 