import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { PropertyCard } from './ui/PropertyCard';
import { useProperties } from '../hooks/useQueries';
import { LoadingSpinner } from './LoadingSpinner';
import { ComponentErrorBoundary } from './SimpleErrorBoundary';
import { SEO } from './SEO';

export function PropertyListPage() {
  const { data: properties, isLoading, error } = useProperties();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading properties</h3>
          <p className="text-gray-600">{error?.message || 'Unknown error'}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Properties - Find Your Perfect Stay"
        description="Browse our collection of luxury properties and accommodations in the Maldives"
        keywords="properties, accommodation, hotels, resorts, Maldives"
      />
      
      <ComponentErrorBoundary componentName="PropertyListPage">
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <div className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Our Properties</h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Discover amazing accommodations for your perfect getaway
                </p>
              </div>
            </div>
          </div>

          {/* Properties Grid */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {!properties || properties.length === 0 ? (
              <div className="text-center py-12">
                <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
                <p className="text-gray-600">Check back later for new listings.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </ComponentErrorBoundary>
    </>
  );
} 