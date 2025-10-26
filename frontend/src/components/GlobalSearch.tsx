import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../hooks/useDebounce';
import { LazyImage } from './LazyImage';
import { unifiedApi } from '../services/unified-api';
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  StarIcon,
  BuildingOffice2Icon,
  GiftIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

interface SearchResult {
  id: number;
  type: 'property' | 'package';
  name: string;
  description: string;
  image?: string;
  price?: number;
  location?: string;
  rating?: number;
  review_count?: number;
  is_featured?: boolean;
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
      // Focus input after modal opens
      setTimeout(() => inputRef.current?.focus(), 100);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (debouncedQuery.trim().length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const performSearch = async () => {
      setIsLoading(true);
      try {
        const searchResults = await unifiedApi.search.global(debouncedQuery);
        
        const results: SearchResult[] = [
          ...searchResults.properties.map((property: any) => ({
            id: property.id,
            type: 'property' as const,
            name: property.name,
            description: property.description,
            image: property.images?.[0]?.image,
            price: property.price_per_night,
            location: property.location ? `${property.location.island}, ${property.location.atoll}` : '',
            rating: property.rating,
            review_count: property.review_count,
            is_featured: property.is_featured,
          })),
          ...searchResults.packages.map((pkg: any) => ({
            id: pkg.id,
            type: 'package' as const,
            name: pkg.name,
            description: pkg.description,
            image: pkg.images?.[0]?.image,
            price: pkg.price,
            is_featured: pkg.is_featured,
          }))
        ];

        setResults(results);
        setShowResults(true);
      } catch (error) {
        console.error('Search failed:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [debouncedQuery]);

  const handleResultClick = (result: SearchResult) => {
    if (result.type === 'property') {
      navigate(`/properties/${result.id}`);
    } else {
      navigate(`/packages/${result.id}`);
    }
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-4 sm:pt-20 px-4">
      <div ref={searchRef} className="w-full max-w-2xl mx-auto animate-slide-down">
        <div className="bg-white rounded-2xl shadow-strong overflow-hidden">
          {/* Search Input - Mobile Optimized */}
          <div className="relative p-4 sm:p-6 border-b border-gray-200">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search properties, packages, locations..."
                className="w-full pl-12 pr-12 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base sm:text-lg transition-all duration-200"
                autoFocus
              />
              {isLoading && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                </div>
              )}
              <button
                onClick={onClose}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <XMarkIcon className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Search Results - Mobile Optimized */}
          {showResults && (
            <div className="max-h-96 sm:max-h-[70vh] overflow-y-auto scrollbar-hide">
              {results.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <MagnifyingGlassIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">No results found for "{query}"</p>
                  <p className="text-sm mt-2 text-gray-400">Try searching for different keywords</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {results.map((result) => (
                    <div
                      key={`${result.type}-${result.id}`}
                      onClick={() => handleResultClick(result)}
                      className="p-4 sm:p-6 hover:bg-gray-50 cursor-pointer transition-all duration-200 active:bg-gray-100"
                    >
                      <div className="flex items-start space-x-4">
                        {/* Image - Mobile Optimized */}
                        <div className="flex-shrink-0">
                          {result.image ? (
                            <LazyImage
                              src={result.image}
                              alt={result.name}
                              className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl"
                            />
                          ) : (
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-xl flex items-center justify-center">
                              {result.type === 'property' ? (
                                <BuildingOffice2Icon className="h-8 w-8 text-gray-400" />
                              ) : (
                                <GiftIcon className="h-8 w-8 text-gray-400" />
                              )}
                            </div>
                          )}
                        </div>

                        {/* Content - Mobile Optimized */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 line-clamp-2">
                              {result.name}
                            </h3>
                            <div className="flex items-center gap-2 flex-wrap">
                              {result.is_featured && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  Featured
                                </span>
                              )}
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                result.type === 'property' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-purple-100 text-purple-800'
                              }`}>
                                {result.type === 'property' ? 'Property' : 'Package'}
                              </span>
                            </div>
                          </div>

                          <p className="text-sm sm:text-base text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                            {result.description}
                          </p>

                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-3 gap-2">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-500">
                              {result.location && (
                                <div className="flex items-center">
                                  <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                                  <span className="truncate">{result.location}</span>
                                </div>
                              )}
                              {result.rating && (
                                <div className="flex items-center">
                                  <StarIcon className="h-4 w-4 text-yellow-400 mr-1 flex-shrink-0" />
                                  <span className="font-medium">{result.rating}</span>
                                  {result.review_count && (
                                    <span className="ml-1">({result.review_count})</span>
                                  )}
                                </div>
                              )}
                            </div>

                            {result.price && (
                              <div className="flex items-center text-sm font-semibold text-green-600">
                                <CurrencyDollarIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                                <span className="text-lg">${result.price}</span>
                                {result.type === 'property' && <span className="ml-1">/night</span>}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Footer - Mobile Optimized */}
          <div className="p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm text-gray-500 gap-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <span>Press Enter to search</span>
                <span className="hidden sm:inline">•</span>
                <span>Press Esc to close</span>
              </div>
              {results.length > 0 && (
                <span className="font-medium">{results.length} result{results.length !== 1 ? 's' : ''}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 