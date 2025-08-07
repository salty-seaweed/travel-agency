import { useState, useMemo } from 'react';

interface FilterState {
  searchTerm: string;
  type: string;
  priceRange: [number, number];
  sortBy: string;
}

interface UseFiltersOptions<T> {
  data: T[];
  searchFields: (keyof T)[];
  filterConfig: {
    typeField?: keyof T;
    priceField?: keyof T;
    sortOptions: { value: string; label: string }[];
    maxPrice: number;
  };
}

export function useFilters<T>({ data, searchFields, filterConfig }: UseFiltersOptions<T>) {
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    type: 'all',
    priceRange: [0, filterConfig.maxPrice],
    sortBy: 'featured'
  });

  const [showFilters, setShowFilters] = useState(false);

  const filteredData = useMemo(() => {
    let result = [...data];

    // Search filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      result = result.filter(item => 
        searchFields.some(field => {
          const value = item[field];
          return value && String(value).toLowerCase().includes(searchLower);
        })
      );
    }

    // Type filter
    if (filters.type !== 'all' && filterConfig.typeField) {
      result = result.filter(item => 
        item[filterConfig.typeField!] === filters.type
      );
    }

    // Price filter
    if (filterConfig.priceField) {
      result = result.filter(item => {
        const price = Number(item[filterConfig.priceField!]);
        return price >= filters.priceRange[0] && price <= filters.priceRange[1];
      });
    }

    // Sort
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-low':
          if (filterConfig.priceField) {
            return Number(a[filterConfig.priceField]) - Number(b[filterConfig.priceField]);
          }
          return 0;
        case 'price-high':
          if (filterConfig.priceField) {
            return Number(b[filterConfig.priceField]) - Number(a[filterConfig.priceField]);
          }
          return 0;
        case 'rating':
          // Assuming there's a rating field
          const ratingField = 'rating' as keyof T;
          if (a[ratingField] && b[ratingField]) {
            return Number(b[ratingField]) - Number(a[ratingField]);
          }
          return 0;
        case 'reviews':
          // Assuming there's a reviewCount field
          const reviewField = 'reviewCount' as keyof T;
          if (a[reviewField] && b[reviewField]) {
            return Number(b[reviewField]) - Number(a[reviewField]);
          }
          return 0;
        default:
          // Featured sorting (assuming there's a featured field)
          const featuredField = 'featured' as keyof T;
          if (a[featuredField] && b[featuredField]) {
            return Boolean(b[featuredField]) ? 1 : -1;
          }
          return 0;
      }
    });

    return result;
  }, [data, filters, searchFields, filterConfig]);

  const updateFilter = (filterType: keyof FilterState, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      type: 'all',
      priceRange: [0, filterConfig.maxPrice],
      sortBy: 'featured'
    });
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return {
    filters,
    filteredData,
    showFilters,
    updateFilter,
    clearFilters,
    toggleFilters
  };
} 