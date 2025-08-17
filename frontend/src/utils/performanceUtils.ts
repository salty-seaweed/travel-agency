// Simplified Performance Utilities - Working Version
import { useCallback, useMemo, useRef, useEffect, useState } from 'react';

// Debounce hook for expensive operations
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Throttle hook for limiting function calls
export const useThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const lastCall = useRef<number>(0);
  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCall.current >= delay) {
        lastCall.current = now;
        return callback(...args);
      }
    },
    [callback, delay]
  ) as T;

  return throttledCallback;
};

// Intersection Observer hook for lazy loading
export const useIntersectionObserver = (
  options: IntersectionObserverInit = {}
): [React.RefObject<HTMLElement | null>, boolean] => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const targetRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = targetRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
      observer.disconnect();
    };
  }, [options]);

  return [targetRef, isIntersecting];
};

// Memory-efficient image loading hook
export const useOptimizedImage = (src: string, alt: string) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>('');

  useEffect(() => {
    if (!src) return;

    const img = new Image();
    img.onload = () => {
      setImageSrc(src);
      setImageLoaded(true);
      setImageError(false);
    };
    img.onerror = () => {
      setImageError(true);
      setImageLoaded(true);
    };

    // Add performance optimizations to image URL
    let optimizedSrc = src;
    if (src.includes('unsplash.com')) {
      optimizedSrc += optimizedSrc.includes('?') ? '&' : '?';
      optimizedSrc += 'auto=format&q=80&fit=crop';
    }

    img.src = optimizedSrc;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return {
    src: imageSrc,
    alt,
    loaded: imageLoaded,
    error: imageError,
    loading: !imageLoaded && !imageError,
  };
};

// Performance monitoring hook
export const usePerformanceMonitor = (name: string) => {
  const startTime = useRef<number>(Date.now());

  useEffect(() => {
    startTime.current = Date.now();
  }, []);

  const measure = useCallback(
    (label: string) => {
      const duration = Date.now() - startTime.current;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`⏱️ Performance [${name}:${label}]: ${duration}ms`);
      }

      // Log slow operations
      if (duration > 2000) {
        console.warn(`🐌 Slow operation detected [${name}:${label}]: ${duration}ms`);
      }

      return duration;
    },
    [name]
  );

  return { measure };
};

// Memoization utilities
export const useMemoizedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T => {
  return useCallback(callback, deps);
};

export const useMemoizedValue = <T>(
  factory: () => T,
  deps: React.DependencyList
): T => {
  return useMemo(factory, deps);
};

// Virtual scrolling hook for large lists
export const useVirtualScrolling = <T>(
  items: T[],
  itemHeight: number,
  containerHeight: number
) => {
  const [scrollTop, setScrollTop] = useState(0);
  
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );
  
  const visibleItems = items.slice(startIndex, endIndex);
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return {
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll,
    startIndex,
    endIndex,
  };
};

// Preloading utilities
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

export const preloadImages = async (urls: string[]): Promise<void> => {
  const promises = urls.map(preloadImage);
  await Promise.allSettled(promises);
};

// Request deduplication
const requestCache = new Map<string, Promise<any>>();

export const deduplicateRequest = <T>(
  key: string,
  requestFn: () => Promise<T>
): Promise<T> => {
  if (requestCache.has(key)) {
    return requestCache.get(key)!;
  }

  const promise = requestFn().finally(() => {
    requestCache.delete(key);
  });

  requestCache.set(key, promise);
  return promise;
};

// Performance timing utilities
export const measurePerformance = {
  start: (name: string): void => {
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark(`${name}-start`);
    }
  },

  end: (name: string): number => {
    if (typeof performance !== 'undefined' && performance.mark && performance.measure) {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
      
      const entries = performance.getEntriesByName(name);
      const duration = entries[entries.length - 1]?.duration || 0;
      
      // Clean up marks
      performance.clearMarks(`${name}-start`);
      performance.clearMarks(`${name}-end`);
      performance.clearMeasures(name);
      
      return duration;
    }
    return 0;
  },

  measure: (name: string, fn: () => void): number => {
    measurePerformance.start(name);
    fn();
    return measurePerformance.end(name);
  },
};

// Memory management utilities
export const useMemoryCleanup = (cleanup: () => void, deps: React.DependencyList) => {
  useEffect(() => {
    return cleanup;
  }, deps);
};

// Performance Provider Hook (for monitoring)
export const usePerformanceProvider = () => {
  useEffect(() => {
    // Monitor long tasks
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            console.warn(`Long task detected: ${entry.duration}ms`);
          }
        }
      });

      try {
        observer.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        // Longtask API not supported, ignore
      }

      return () => observer.disconnect();
    }
  }, []);
};

// Export all utilities
export default {
  useDebounce,
  useThrottle,
  useIntersectionObserver,
  useOptimizedImage,
  usePerformanceMonitor,
  useMemoizedCallback,
  useMemoizedValue,
  useVirtualScrolling,
  preloadImage,
  preloadImages,
  measurePerformance,
  useMemoryCleanup,
  deduplicateRequest,
  usePerformanceProvider,
}; 