// Simplified lazy loading for existing components
import React, { Suspense, lazy } from 'react';
import { LoadingSpinner } from './index';
import { ComponentErrorBoundary } from './SimpleErrorBoundary';

// Loading fallback component
const LazyLoadingFallback: React.FC<{ name?: string }> = ({ name }) => (
  <div className="flex items-center justify-center py-8">
    <div className="text-center">
      <LoadingSpinner size="lg" />
      <p className="text-gray-600 mt-4">Loading {name}...</p>
    </div>
  </div>
);

// Generic wrapper for lazy components
const withLazyLoading = <P extends object>(
  LazyComponent: React.LazyExoticComponent<React.ComponentType<P>>,
  name: string
) => {
  return React.forwardRef<any, P>((props, ref) => (
    <ComponentErrorBoundary componentName={name}>
      <Suspense fallback={<LazyLoadingFallback name={name} />}>
        <LazyComponent {...props} ref={ref} />
      </Suspense>
    </ComponentErrorBoundary>
  ));
};

// Lazy load heavy components that exist
const LazyInteractiveMap = lazy(() => import('./InteractiveMap'));
const LazyGoogleReviews = lazy(() => import('./GoogleReviews'));
const LazyBookingForm = lazy(() => import('./BookingForm'));
const LazyGlobalSearch = lazy(() => import('./GlobalSearch'));

// Wrapped components with error boundaries
export const InteractiveMapLazy = withLazyLoading(LazyInteractiveMap, 'Interactive Map');
export const GoogleReviewsLazy = withLazyLoading(LazyGoogleReviews, 'Google Reviews');
export const BookingFormLazy = withLazyLoading(LazyBookingForm, 'Booking Form');
export const GlobalSearchLazy = withLazyLoading(LazyGlobalSearch, 'Global Search');

// Preloading utilities for performance
export const preloadComponents = {
  // Preload heavy components
  heavy: async () => {
    const promises = [
      import('./InteractiveMap'),
      import('./GoogleReviews'),
      import('./BookingForm'),
      import('./GlobalSearch'),
    ];
    
    await Promise.allSettled(promises);
  },
  
  // Preload on user interaction
  onInteraction: async () => {
    const promises = [
      import('./BookingForm'),
      import('./GlobalSearch'),
    ];
    
    await Promise.allSettled(promises);
  },
};

// Hook for component preloading
export const usePreloader = () => {
  const [preloaded, setPreloaded] = React.useState<Set<string>>(new Set());
  
  const preload = React.useCallback(async (type: keyof typeof preloadComponents) => {
    if (preloaded.has(type)) return;
    
    try {
      await preloadComponents[type]();
      setPreloaded(prev => new Set(prev).add(type));
    } catch (error) {
      console.warn(`Failed to preload ${type} components:`, error);
    }
  }, [preloaded]);
  
  // Preload heavy components after initial load
  React.useEffect(() => {
    const timer = setTimeout(() => {
      preload('heavy');
    }, 2000); // Delay to not interfere with initial page load
    
    return () => clearTimeout(timer);
  }, [preload]);
  
  return { preload, preloaded: preloaded.size > 0 };
};

// Component that triggers preloading on hover/focus
export const PreloadTrigger: React.FC<{
  type: keyof typeof preloadComponents;
  children: React.ReactNode;
  className?: string;
}> = ({ type, children, className }) => {
  const { preload } = usePreloader();
  
  const handlePreload = React.useCallback(() => {
    preload(type);
  }, [type, preload]);
  
  return (
    <div
      className={className}
      onMouseEnter={handlePreload}
      onFocus={handlePreload}
    >
      {children}
    </div>
  );
};

// Export all lazy components
export {
  LazyInteractiveMap,
  LazyGoogleReviews,
  LazyBookingForm,
  LazyGlobalSearch,
};

export default {
  InteractiveMap: InteractiveMapLazy,
  GoogleReviews: GoogleReviewsLazy,
  BookingForm: BookingFormLazy,
  GlobalSearch: GlobalSearchLazy,
  preloadComponents,
  usePreloader,
  PreloadTrigger,
}; 