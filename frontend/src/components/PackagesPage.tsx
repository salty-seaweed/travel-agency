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
  AdjustmentsHorizontalIcon,
  SparklesIcon,
  GlobeAltIcon,
  MapIcon,
  ArrowRightIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { usePackages } from '../hooks/useQueries';
import { LoadingSpinner } from './LoadingSpinner';
import { PackageCard } from './ui/PackageCard';
import type { Package as ApiPackage } from '../types';
import { getWhatsAppUrl } from '../config';
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Button,
  Badge,
  Icon,
  useColorModeValue,
  Heading,
} from '@chakra-ui/react';

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

interface LocalPackage {
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
  const packages: LocalPackage[] = apiPackages ? apiPackages.map(convertApiPackageToCardFormat) : [];

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

  const handleWhatsAppBooking = (pkg: LocalPackage) => {
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
    <Box bg="gray.50" className="bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-r from-blue-800 via-indigo-800 to-blue-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 animate-float">
            <Icon as={SparklesIcon} className="w-16 h-16 text-white" />
          </div>
          <div className="absolute top-20 right-20 animate-float-delayed">
            <Icon as={GlobeAltIcon} className="w-12 h-12 text-white" />
          </div>
          <div className="absolute bottom-20 left-20 animate-float-slow">
            <Icon as={MapIcon} className="w-20 h-20 text-white" />
          </div>
        </div>
        
        <Container maxW="7xl" className="relative z-10 text-center px-4">
          <VStack spacing={8}>
            <Badge 
              className="bg-white/20 backdrop-blur-md text-white px-6 py-2 rounded-full text-sm font-bold border border-white/30"
            >
              <Icon as={SparklesIcon} className="w-4 h-4 mr-2" />
              Premium Travel Packages
            </Badge>
            
            <Heading size="2xl" className="text-5xl md:text-6xl font-bold text-white">
              🌟 Premium Travel Packages
            </Heading>
            
            <Text className="text-xl text-blue-200 max-w-4xl mx-auto leading-relaxed">
              Curated experiences combining multiple properties and activities for the ultimate Maldives adventure. 
              From luxury getaways to adventure packages, find your perfect journey.
            </Text>

            <HStack spacing={6} flexDir={{ base: "column", sm: "row" }} justify="center" align="center">
              <a href={getWhatsAppUrl("Hi! I need help finding the perfect travel package in the Maldives")} target="_blank" rel="noopener noreferrer">
                <Button 
                  size="lg"
                  bg="green.500"
                  _hover={{ bg: "green.600", shadow: "0 0 30px rgba(34, 197, 94, 0.4)", scale: 1.05 }}
                  color="white"
                  px={8}
                  py={4}
                  fontSize="lg"
                  fontWeight="bold"
                  borderRadius="full"
                  shadow="2xl"
                  transition="all 0.3s"
                  transform="auto"
                  display="flex"
                  alignItems="center"
                >
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Get Expert Advice
                  <Icon as={ArrowRightIcon} className="w-5 h-5 ml-2" />
                </Button>
              </a>
              <Button 
                size="lg"
                variant="outline"
                border="2px solid"
                borderColor="white"
                color="white"
                _hover={{ bg: "white", color: "blue.600", scale: 1.05 }}
                px={8}
                py={4}
                fontSize="lg"
                fontWeight="bold"
                borderRadius="full"
                transition="all 0.3s"
                transform="auto"
                backdropFilter="blur(4px)"
                display="flex"
                alignItems="center"
                onClick={() => {
                  const element = document.getElementById('packages-grid');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Icon as={InformationCircleIcon} className="w-6 h-6 mr-3" />
                Browse Packages
                <Icon as={ArrowRightIcon} className="w-5 h-5 ml-2" />
              </Button>
            </HStack>
          </VStack>
        </Container>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8" id="packages-grid">
              {sortedPackages.map((pkg) => {
                // Create a simplified package object that matches what PackageCard needs
                const packageForCard = {
                  id: pkg.id,
                  name: pkg.name,
                  description: pkg.description,
                  price: pkg.price,
                  duration: parseInt(pkg.duration),
                  destinations: pkg.destinations,
                  highlights: pkg.highlights,
                  included: pkg.included,
                  maxTravelers: pkg.maxTravelers,
                  is_featured: pkg.featured,
                  images: [{ image: pkg.image }],
                  rating: pkg.rating,
                  review_count: pkg.reviewCount,
                } as any; // Using any to bypass strict typing for this conversion
                
                return (
                  <PackageCard 
                    key={pkg.id} 
                    package={packageForCard}
                    className="animate-fade-in"
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>
    </Box>
  );
}

export default PackagesPage; 