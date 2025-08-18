import React, { useEffect, useRef } from 'react';
import { usePerformanceProvider } from '../utils/performanceUtils';

// Type definitions for performance entries
interface PerformanceEventTiming extends PerformanceEntry {
  processingStart: number;
  processingEnd: number;
  target?: EventTarget;
}

interface LayoutShift extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
  lastInputTime: number;
  sources?: LayoutShiftAttribution[];
}

interface LayoutShiftAttribution {
  node?: Node;
  currentRect?: DOMRectReadOnly;
  previousRect?: DOMRectReadOnly;
}

interface PerformanceMonitorProps {
  children: React.ReactNode;
  enabled?: boolean;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = React.memo(({ 
  children, 
  enabled = process.env.NODE_ENV === 'development' 
}) => {
  const startTime = useRef<number>(Date.now());
  
  // Initialize performance monitoring
  usePerformanceProvider();

  useEffect(() => {
    if (!enabled) return;

    startTime.current = Date.now();

    // Monitor Core Web Vitals
    if ('PerformanceObserver' in window) {
      // Monitor Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          console.log(`🎯 LCP: ${lastEntry.startTime}ms`);
          if (lastEntry.startTime > 2500) {
            console.warn(`⚠️ Slow LCP detected: ${lastEntry.startTime}ms`);
          }
        }
      });

      // Monitor First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const fidEntry = entry as PerformanceEventTiming;
          console.log(`⚡ FID: ${fidEntry.processingStart - fidEntry.startTime}ms`);
          if (fidEntry.processingStart - fidEntry.startTime > 100) {
            console.warn(`⚠️ Slow FID detected: ${fidEntry.processingStart - fidEntry.startTime}ms`);
          }
        });
      });

      // Monitor Cumulative Layout Shift (CLS)
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const layoutShiftEntry = entry as LayoutShift;
          if (!layoutShiftEntry.hadRecentInput) {
            clsValue += layoutShiftEntry.value;
          }
        });
        console.log(`📐 CLS: ${clsValue.toFixed(4)}`);
        if (clsValue > 0.1) {
          console.warn(`⚠️ High CLS detected: ${clsValue.toFixed(4)}`);
        }
      });

      try {
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        fidObserver.observe({ entryTypes: ['first-input'] });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        console.warn('Some performance APIs not supported:', e);
      }

      return () => {
        lcpObserver.disconnect();
        fidObserver.disconnect();
        clsObserver.disconnect();
      };
    }

    // Monitor memory usage
    const memoryInterval = setInterval(() => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);
        const totalMB = Math.round(memory.totalJSHeapSize / 1024 / 1024);
        
        if (usedMB > 100) {
          console.warn(`⚠️ High memory usage: ${usedMB}MB / ${totalMB}MB`);
        }
      }
    }, 30000); // Check every 30 seconds

    return () => {
      clearInterval(memoryInterval);
    };
  }, [enabled]);

  // Log initial load time
  useEffect(() => {
    if (!enabled) return;

    const handleLoad = () => {
      const loadTime = Date.now() - startTime.current;
      console.log(`🚀 Initial load time: ${loadTime}ms`);
      
      if (loadTime > 3000) {
        console.warn(`⚠️ Slow initial load: ${loadTime}ms`);
      }
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, [enabled]);

  return <>{children}</>;
});

PerformanceMonitor.displayName = 'PerformanceMonitor'; 