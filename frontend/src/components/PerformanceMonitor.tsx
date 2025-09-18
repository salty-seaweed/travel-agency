import { useEffect } from 'react';

interface PerformanceMetrics {
  lcp?: number;
  fid?: number;
  cls?: number;
  fcp?: number;
  ttfb?: number;
}

export const PerformanceMonitor = () => {
  useEffect(() => {
    const metrics: PerformanceMetrics = {};

    // Monitor Largest Contentful Paint (LCP)
    const observeLCP = () => {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          metrics.lcp = lastEntry.startTime;
          
          // Log if LCP is poor (> 2.5s)
          if (metrics.lcp > 2500) {
            console.warn(`Poor LCP: ${metrics.lcp}ms (should be < 2500ms)`);
          }
        });
        
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
        
        // Cleanup observer after 10 seconds
        setTimeout(() => observer.disconnect(), 10000);
      } catch (e) {
        console.warn('LCP monitoring not supported');
      }
    };

    // Monitor First Input Delay (FID)
    const observeFID = () => {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            metrics.fid = entry.processingStart - entry.startTime;
            
            // Log if FID is poor (> 100ms)
            if (metrics.fid > 100) {
              console.warn(`Poor FID: ${metrics.fid}ms (should be < 100ms)`);
            }
          });
        });
        
        observer.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        console.warn('FID monitoring not supported');
      }
    };

    // Monitor Cumulative Layout Shift (CLS)
    const observeCLS = () => {
      try {
        let clsValue = 0;
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          
          metrics.cls = clsValue;
          
          // Log if CLS is poor (> 0.1)
          if (metrics.cls > 0.1) {
            console.warn(`Poor CLS: ${metrics.cls} (should be < 0.1)`);
          }
        });
        
        observer.observe({ entryTypes: ['layout-shift'] });
        
        // Cleanup observer after 10 seconds
        setTimeout(() => observer.disconnect(), 10000);
      } catch (e) {
        console.warn('CLS monitoring not supported');
      }
    };

    // Monitor First Contentful Paint (FCP)
    const observeFCP = () => {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            metrics.fcp = entry.startTime;
            
            // Log if FCP is poor (> 1.8s)
            if (metrics.fcp > 1800) {
              console.warn(`Poor FCP: ${metrics.fcp}ms (should be < 1800ms)`);
            }
          });
        });
        
        observer.observe({ entryTypes: ['paint'] });
      } catch (e) {
        console.warn('FCP monitoring not supported');
      }
    };

    // Monitor Time to First Byte (TTFB)
    const observeTTFB = () => {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (entry.entryType === 'navigation') {
              metrics.ttfb = entry.responseStart - entry.requestStart;
              
              // Log if TTFB is poor (> 600ms)
              if (metrics.ttfb > 600) {
                console.warn(`Poor TTFB: ${metrics.ttfb}ms (should be < 600ms)`);
              }
            }
          });
        });
        
        observer.observe({ entryTypes: ['navigation'] });
      } catch (e) {
        console.warn('TTFB monitoring not supported');
      }
    };

    // Monitor resource loading performance
    const observeResources = () => {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            // Log slow resources (> 3s)
            if (entry.duration > 3000) {
              console.warn(`Slow resource: ${entry.name} took ${entry.duration}ms`);
            }
            
            // Log large resources (> 1MB)
            if (entry.transferSize > 1024 * 1024) {
              console.warn(`Large resource: ${entry.name} is ${(entry.transferSize / 1024 / 1024).toFixed(2)}MB`);
            }
          });
        });
        
        observer.observe({ entryTypes: ['resource'] });
        
        // Cleanup observer after 30 seconds
        setTimeout(() => observer.disconnect(), 30000);
      } catch (e) {
        console.warn('Resource monitoring not supported');
      }
    };

    // Start all observers
    observeLCP();
    observeFID();
    observeCLS();
    observeFCP();
    observeTTFB();
    observeResources();

    // Report metrics after page load
    const reportMetrics = () => {
      setTimeout(() => {
        console.group('🚀 Performance Metrics');
        console.log('LCP (Largest Contentful Paint):', metrics.lcp ? `${metrics.lcp}ms` : 'Not measured');
        console.log('FID (First Input Delay):', metrics.fid ? `${metrics.fid}ms` : 'Not measured');
        console.log('CLS (Cumulative Layout Shift):', metrics.cls ? metrics.cls.toFixed(3) : 'Not measured');
        console.log('FCP (First Contentful Paint):', metrics.fcp ? `${metrics.fcp}ms` : 'Not measured');
        console.log('TTFB (Time to First Byte):', metrics.ttfb ? `${metrics.ttfb}ms` : 'Not measured');
        console.groupEnd();
      }, 5000);
    };

    // Check if page is already loaded
    if (document.readyState === 'complete') {
      reportMetrics();
    } else {
      window.addEventListener('load', reportMetrics);
    }

    // Cleanup
    return () => {
      window.removeEventListener('load', reportMetrics);
    };
  }, []);

  return null; // This component doesn't render anything
};

// Hook for performance monitoring
export const usePerformanceMonitor = () => {
  useEffect(() => {
    // Add performance optimization CSS
    const style = document.createElement('style');
    style.textContent = `
      /* Optimize font loading */
      @font-face {
        font-display: swap;
      }
      
      /* Optimize image loading */
      img {
        image-rendering: -webkit-optimize-contrast;
      }
      
      /* Optimize animations */
      * {
        will-change: auto;
      }
      
      /* Reduce motion for users who prefer it */
      @media (prefers-reduced-motion: reduce) {
        * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }
      
      /* Optimize scrolling */
      * {
        scroll-behavior: smooth;
      }
      
      /* Optimize focus indicators */
      :focus-visible {
        outline: 2px solid #1e40af;
        outline-offset: 2px;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);
};

export default PerformanceMonitor;