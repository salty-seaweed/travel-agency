import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../hooks/useDebounce';
import { LazyImage } from './LazyImage';
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  StarIcon,
  BuildingOffice2Icon,
  GiftIcon,
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
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
        const [propertiesResponse, packagesResponse] = await Promise.all([
          fetch(`http://127.0.0.1:8000/api/properties/?search=${encodeURIComponent(debouncedQuery)}`),
          fetch(`http://127.0.0.1:8000/api/packages/?search=${encodeURIComponent(debouncedQuery)}`)
        ]);

        const properties = propertiesResponse.ok ? await propertiesResponse.json() : { results: [] };
        const packages = packagesResponse.ok ? await packagesResponse.json() : { results: [] };

        const searchResults: SearchResult[] = [
          ...(properties.results || properties).map((property: any) => ({
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
          ...(packages.results || packages).map((pkg: any) => ({
            id: pkg.id,
            type: 'package' as const,
            name: pkg.name,
            description: pkg.description,
            image: pkg.image,
            price: pkg.price,
            is_featured: pkg.is_featured,
          }))
        ];

        setResults(searchResults);
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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
      <div ref={searchRef} className="w-full max-w-2xl mx-4">
        <div className="bg-white rounded-lg shadow-xl">
          {/* Search Input */}
          <div className="relative p-4 border-b border-gray-200">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search properties, packages, locations..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                autoFocus
              />
              {isLoading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                </div>
              )}
            </div>
          </div>

          {/* Search Results */}
          {showResults && (
            <div className="max-h-96 overflow-y-auto">
              {results.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <MagnifyingGlassIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No results found for "{query}"</p>
                  <p className="text-sm mt-2">Try searching for different keywords</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {results.map((result) => (
                    <div
                      key={`${result.type}-${result.id}`}
                      onClick={() => handleResultClick(result)}
                      className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-start space-x-4">
                        {/* Image */}
                        <div className="flex-shrink-0">
                          {result.image ? (
                            <LazyImage
                              src={result.image}
                              alt={result.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                              {result.type === 'property' ? (
                                <BuildingOffice2Icon className="h-6 w-6 text-gray-400" />
                              ) : (
                                <GiftIcon className="h-6 w-6 text-gray-400" />
                              )}
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-900 truncate">
                              {result.name}
                            </h3>
                            <div className="flex items-center space-x-2">
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

                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {result.description}
                          </p>

                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              {result.location && (
                                <div className="flex items-center">
                                  <MapPinIcon className="h-4 w-4 mr-1" />
                                  {result.location}
                                </div>
                              )}
                              {result.rating && (
                                <div className="flex items-center">
                                  <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                                  {result.rating}
                                  {result.review_count && (
                                    <span className="ml-1">({result.review_count})</span>
                                  )}
                                </div>
                              )}
                            </div>

                            {result.price && (
                              <div className="flex items-center text-sm font-medium text-green-600">
                                <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                                {result.price}
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

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <span>Press Enter to search</span>
                <span>•</span>
                <span>Press Esc to close</span>
              </div>
              {results.length > 0 && (
                <span>{results.length} result{results.length !== 1 ? 's' : ''}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 