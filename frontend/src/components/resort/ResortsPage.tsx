import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useResorts } from '../../hooks/useResorts';
import { useUserCountry } from '../../hooks/useUserCountry';
import { ResortFilters as ResortFiltersType } from '../../types';
import { LoadingSpinner } from '../LoadingSpinner';
import { ResortList } from './ResortList';
import './ResortsPage.css';

export function ResortsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const userCountry = useUserCountry();
  const [filters, setFilters] = useState<ResortFiltersType>({});

  // Initialize filters from URL params and user country
  useEffect(() => {
    const urlFilters: ResortFiltersType = {};
    
    // Parse URL parameters
    const category = searchParams.get('category');
    const starRating = searchParams.get('star_rating');
    const atoll = searchParams.get('atoll');
    const search = searchParams.get('search');

    if (category) urlFilters.category = category as any;
    if (starRating) urlFilters.star_rating = parseInt(starRating);
    if (atoll) urlFilters.atoll = atoll;
    if (search) urlFilters.search = search;
    
    // Add country from geolocation/query param (query param takes precedence in hook)
    if (userCountry) {
      urlFilters.country = userCountry;
    }

    setFilters(urlFilters);
  }, [searchParams, userCountry]);

  // Update URL when filters change
  const updateURL = (newFilters: ResortFiltersType) => {
    const params = new URLSearchParams();
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, value.toString());
      }
    });

    setSearchParams(params, { replace: true });
  };

  const handleCategoryChange = (category: string) => {
    const newFilters = category === 'all' ? {} : { ...filters, category };
    setFilters(newFilters);
    updateURL(newFilters);
  };

  const { resorts, loading, error, pagination } = useResorts(filters);

  const handleResortClick = (resort: any) => {
    window.location.href = `/resorts/${resort.id}`;
  };

  const handleBookResort = (resort: any) => {
    console.log('Book resort:', resort);
  };

  if (error) {
    return (
      <div className="resorts-page-error">
        <div className="resorts-page-error-content">
          <div className="resorts-page-error-icon">
            <svg className="resorts-page-error-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="resorts-page-error-title">Error loading resorts</h3>
          <p className="resorts-page-error-description">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="resorts-page-error-button"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const categories = [
    { value: 'all', label: 'All Properties' },
    { value: 'luxury', label: 'Luxury Resorts' },
    { value: 'honeymoon', label: 'Honeymoon' },
    { value: 'family_friendly', label: 'Family Friendly' },
    { value: 'adventure', label: 'Adventure' },
  ];

  const activeCategory = filters.category || 'all';

  return (
    <div className="resorts-page-container">
      {/* Hero Section */}
      <div className="resorts-page-hero">
        <div className="resorts-page-hero-content">
          <h1 className="resorts-page-hero-title">
            Discover Your Perfect Maldives Escape
          </h1>
          <p className="resorts-page-hero-description">
            Browse our carefully curated collection of luxury resorts and authentic local experiences
          </p>
          
          {/* Property Count */}
          {pagination && (
            <div className="resorts-page-hero-count">
              {pagination.count} Properties Found
            </div>
          )}
        </div>
      </div>

      {/* Category Filters */}
      <div className="resorts-page-filters">
        <div className="resorts-page-filters-content">
          <div className="resorts-page-filters-buttons">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => handleCategoryChange(category.value)}
                className={`resorts-page-filter-button ${
                  activeCategory === category.value ? 'active' : ''
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Resorts Grid */}
      <div className="resorts-page-content">
        {loading ? (
          <div className="resorts-page-loading">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <ResortList
            resorts={resorts}
            onResortClick={handleResortClick}
            onBookResort={handleBookResort}
          />
        )}

        {/* No results message */}
        {!loading && resorts.length === 0 && (
          <div className="resorts-page-empty">
            <h3 className="resorts-page-empty-title">No properties found</h3>
            <p className="resorts-page-empty-description">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Pagination - Simplified */}
        {pagination && pagination.count > 0 && (
          <div className="resorts-page-pagination">
            Showing {resorts.length} of {pagination.count} properties
          </div>
        )}
      </div>
    </div>
  );
}