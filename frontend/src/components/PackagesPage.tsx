import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPinIcon, 
  StarIcon, 
  FunnelIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  CalendarIcon,
  UsersIcon,
  CurrencyDollarIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import { usePackages } from '../hooks/useQueries';
import { LoadingSpinner } from './LoadingSpinner';
import { PackageCard } from './ui/PackageCard';
import type { Package as ApiPackage } from '../types';

// Convert API package to PackageCard format
const convertApiPackageToCardFormat = (pkg: ApiPackage) => ({
  id: pkg.id,
  name: pkg.name,
  description: pkg.description,
  duration: '7 days', // You might want to calculate this from start/end dates
  price: parseFloat(pkg.price),
  originalPrice: parseFloat(pkg.price) * 1.2, // 20% discount
  rating: 4.8,
  reviewCount: 12,
  image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
  destinations: pkg.properties.map((p: any) => p.location.island),
  highlights: ['All-inclusive', 'Water activities', 'Local tours'],
  included: ['Accommodation', 'Meals', 'Transfers', 'Activities'],
  maxTravelers: 4,
  featured: pkg.is_featured,
  category: 'Adventure',
});

interface Package {
  id: number;
  name: string;
  description: string;
  duration: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  image: string;
  destinations: string[];
  highlights: string[];
  included: string[];
  maxTravelers: number;
  featured: boolean;
  category: string;
}

export function PackagesPage() {
  const { data: apiPackages, isLoading: packagesLoading, error: packagesError } = usePackages();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [duration, setDuration] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Convert API data to the format expected by the component
  const packages: Package[] = apiPackages ? apiPackages.map(convertApiPackageToCardFormat) : [];

  // Filter packages based on search and filters
  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pkg.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pkg.destinations.some(dest => dest.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || pkg.category === selectedCategory;
    const matchesPrice = pkg.price >= priceRange[0] && pkg.price <= priceRange[1];
    const matchesDuration = duration === 'all' || pkg.duration.includes(duration);

    return matchesSearch && matchesCategory && matchesPrice && matchesDuration;
  });

  // Sort packages
  const sortedPackages = [...filteredPackages].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'duration':
        return parseInt(a.duration) - parseInt(b.duration);
      case 'featured':
      default:
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    }
  });

  const categories = ['all', 'Adventure', 'Luxury', 'Budget', 'Family', 'Romantic'];

  const handleWhatsAppBooking = (pkg: Package) => {
    const message = `Hi! I'm interested in booking the "${pkg.name}" package. Can you provide more details?`;
    const whatsappUrl = `https://wa.me/9607441097?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setPriceRange([0, 5000]);
    setDuration('all');
    setSortBy('featured');
  };

  if (packagesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (packagesError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading packages</h3>
          <p className="text-gray-600">{packagesError?.message || 'Unknown error'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section - Improved Mobile */}
      <section className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
            🌟 Premium Travel Packages
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto px-4">
            Curated experiences combining multiple properties and activities for the ultimate Maldives adventure
          </p>
        </div>
      </section>

      {/* Search and Filters - Improved Mobile */}
      <section className="py-4 sm:py-6 lg:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex flex-col gap-4">
              {/* Search Bar - Improved Mobile */}
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search packages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                  />
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
                  {(selectedCategory !== 'all' || priceRange[1] !== 5000 || duration !== 'all' || sortBy !== 'featured') && (
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">Active</span>
                  )}
                </button>
                
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Clear All
                </button>
              </div>

              {/* Desktop Filters */}
              <div className="hidden sm:flex flex-wrap gap-3">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="duration">Duration</option>
                </select>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <FunnelIcon className="h-5 w-5" />
                  More Filters
                </button>
              </div>

              {/* Additional Desktop Filters */}
              {showFilters && (
                <div className="hidden sm:block mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          placeholder="Min"
                          value={priceRange[0]}
                          onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <span className="text-gray-500">-</span>
                        <input
                          type="number"
                          placeholder="Max"
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 5000])}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                      <select
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">Any Duration</option>
                        <option value="3">3 days</option>
                        <option value="5">5 days</option>
                        <option value="7">7 days</option>
                        <option value="10">10 days</option>
                        <option value="14">14 days</option>
                      </select>
                    </div>

                    <div className="flex items-end">
                      <button
                        onClick={clearFilters}
                        className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Clear All Filters
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Filters Overlay */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 sm:hidden">
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
              {/* Category Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Category</h3>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                        selectedCategory === category
                          ? 'bg-blue-50 border-blue-200 text-blue-700'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {category === 'all' ? 'All Categories' : category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Sort By</h3>
                <div className="space-y-2">
                  {[
                    { value: 'featured', label: 'Featured' },
                    { value: 'price-low', label: 'Price: Low to High' },
                    { value: 'price-high', label: 'Price: High to Low' },
                    { value: 'rating', label: 'Highest Rated' },
                    { value: 'duration', label: 'Duration' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSortBy(option.value)}
                      className={`w-full p-3 rounded-lg border text-left transition-colors ${
                        sortBy === option.value
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
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>

              {/* Duration */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Duration</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'all', label: 'Any Duration' },
                    { value: '3', label: '3 days' },
                    { value: '5', label: '5 days' },
                    { value: '7', label: '7 days' },
                    { value: '10', label: '10 days' },
                    { value: '14', label: '14 days' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setDuration(option.value)}
                      className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                        duration === option.value
                          ? 'bg-blue-50 border-blue-200 text-blue-700'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile Filter Actions */}
            <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={clearFilters}
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

      {/* Packages Grid - Improved Mobile */}
      <section className="pb-8 sm:pb-12 lg:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {sortedPackages.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <div className="text-gray-400 mb-4">
                <MagnifyingGlassIcon className="h-12 w-12 sm:h-16 sm:w-16 mx-auto" />
              </div>
              <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">No packages found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {sortedPackages.map((pkg) => {
                // Convert the local Package format to the unified Package format
                const unifiedPackage: ApiPackage = {
                  id: pkg.id,
                  name: pkg.name,
                  description: pkg.description,
                  price: pkg.price.toString(),
                  duration: parseInt(pkg.duration),
                  properties: pkg.destinations.map((dest, index) => ({
                    id: index + 1,
                    name: `${dest} Resort`,
                    description: `Beautiful resort in ${dest}`,
                    price_per_night: '200',
                    price: 200,
                    location: { id: index + 1, island: dest, atoll: 'Maldives', latitude: 0, longitude: 0 },
                    property_type: { id: 1, name: 'Resort' },
                    amenities: [],
                    images: [],
                    is_featured: false,
                    reviews: [],
                    packages: [],
                    rating: pkg.rating,
                    reviewCount: pkg.reviewCount,
                  })),
                  images: [{ id: 1, package: pkg.id, image: pkg.image }],
                  is_featured: pkg.featured,
                  start_date: undefined,
                  end_date: undefined,
                  destinations: pkg.destinations,
                  highlights: pkg.highlights,
                  included: pkg.included,
                  maxTravelers: pkg.maxTravelers,
                  category: pkg.category,
                  created_at: undefined,
                  updated_at: undefined,
                };
                
                return (
                  <PackageCard 
                    key={pkg.id} 
                    package={unifiedPackage}
                    className="animate-fade-in"
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default PackagesPage; 