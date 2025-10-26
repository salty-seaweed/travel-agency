import React, { useState, useEffect, useCallback } from 'react';
import { Box, Progress, Text, VStack, Spinner } from '@chakra-ui/react';

interface EnhancedImagePreloaderProps {
  images: string[];
  onComplete: () => void;
  onProgress?: (progress: number) => void;
  showProgress?: boolean;
  priority?: 'hero' | 'critical' | 'normal';
  timeout?: number;
  children?: React.ReactNode;
  fallbackDelay?: number;
}

interface ImageLoadResult {
  url: string;
  loaded: boolean;
  error?: boolean;
  loadTime: number;
}

export const EnhancedImagePreloader: React.FC<EnhancedImagePreloaderProps> = ({
  images,
  onComplete,
  onProgress,
  showProgress = false,
  priority = 'normal',
  timeout = 10000,
  children,
  fallbackDelay = 3000
}) => {
  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [loadResults, setLoadResults] = useState<ImageLoadResult[]>([]);

  // Preload a single image with timeout and retry logic
  const preloadImage = useCallback((src: string, retryCount = 0): Promise<ImageLoadResult> => {
    return new Promise((resolve) => {
      const startTime = Date.now();
      const img = new Image();
      
      // Set loading attribute based on priority
      if (priority === 'hero' || priority === 'critical') {
        img.loading = 'eager';
      } else {
        img.loading = 'lazy';
      }
      
      // Handle successful load
      img.onload = () => {
        const loadTime = Date.now() - startTime;
        resolve({
          url: src,
          loaded: true,
          loadTime
        });
      };
      
      // Handle load error with retry logic
      img.onerror = () => {
        const loadTime = Date.now() - startTime;
        
        // Retry once for critical images
        if (retryCount < 1 && (priority === 'hero' || priority === 'critical')) {
          setTimeout(() => {
            preloadImage(src, retryCount + 1).then(resolve);
          }, 500);
          return;
        }
        
        resolve({
          url: src,
          loaded: false,
          error: true,
          loadTime
        });
      };
      
      // Set timeout for image loading
      const timeoutId = setTimeout(() => {
        img.onload = null;
        img.onerror = null;
        resolve({
          url: src,
          loaded: false,
          error: true,
          loadTime: timeout
        });
      }, timeout);
      
      // Start loading
      img.src = src;
      
      // Clear timeout on successful load or error
      const originalOnLoad = img.onload;
      const originalOnError = img.onerror;
      
      img.onload = (e) => {
        clearTimeout(timeoutId);
        originalOnLoad?.(e);
      };
      
      img.onerror = (e) => {
        clearTimeout(timeoutId);
        originalOnError?.(e);
      };
    });
  }, [priority, timeout]);

  // Preload images with smart loading strategy
  const preloadImages = useCallback(async () => {
    if (images.length === 0) {
      setIsLoading(false);
      onComplete();
      return;
    }

    const startTime = Date.now();
    const results: ImageLoadResult[] = [];
    let completedCount = 0;

    // Determine loading strategy based on priority
    const loadingStrategy = priority === 'hero' ? 'sequential' : 'parallel';
    
    if (loadingStrategy === 'sequential') {
      // Sequential loading for hero images (ensures first image loads first)
      for (let i = 0; i < images.length; i++) {
        const result = await preloadImage(images[i]);
        results.push(result);
        completedCount++;
        
        const progress = (completedCount / images.length) * 100;
        setLoadProgress(progress);
        onProgress?.(progress);
        
        if (result.loaded) {
          setLoadedImages(prev => new Set(prev).add(result.url));
        } else {
          setFailedImages(prev => new Set(prev).add(result.url));
        }
        
        // For hero images, show content after first image loads
        if (i === 0 && result.loaded && priority === 'hero') {
          setTimeout(() => {
            setIsLoading(false);
            onComplete();
          }, 100);
        }
      }
    } else {
      // Parallel loading for normal images
      const promises = images.map(async (src, index) => {
        const result = await preloadImage(src);
        completedCount++;
        
        const progress = (completedCount / images.length) * 100;
        setLoadProgress(progress);
        onProgress?.(progress);
        
        if (result.loaded) {
          setLoadedImages(prev => new Set(prev).add(result.url));
        } else {
          setFailedImages(prev => new Set(prev).add(result.url));
        }
        
        return result;
      });
      
      const allResults = await Promise.all(promises);
      results.push(...allResults);
    }

    setLoadResults(results);
    
    const totalTime = Date.now() - startTime;
    const successfulLoads = results.filter(r => r.loaded).length;
    
    console.log(`Image preloading completed: ${successfulLoads}/${images.length} images loaded in ${totalTime}ms`);
    
    // Complete loading process
    if (loadingStrategy !== 'sequential' || priority !== 'hero') {
      setIsLoading(false);
      onComplete();
    }
  }, [images, preloadImage, priority, onComplete, onProgress]);

  // Handle fallback timeout
  useEffect(() => {
    if (fallbackDelay > 0) {
      const fallbackTimer = setTimeout(() => {
        if (isLoading) {
          console.warn('Image preloading taking too long, showing content anyway');
          setIsLoading(false);
          onComplete();
        }
      }, fallbackDelay);

      return () => clearTimeout(fallbackTimer);
    }
  }, [isLoading, fallbackDelay, onComplete]);

  // Start preloading on mount
  useEffect(() => {
    preloadImages();
  }, [preloadImages]);

  // Show loading UI if still loading and showProgress is enabled
  if (isLoading && showProgress) {
    return (
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="white"
        zIndex={9999}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <VStack spacing={6} maxW="md" textAlign="center">
          <Spinner size="xl" color="blue.500" thickness="4px" />
          <VStack spacing={2}>
            <Text fontSize="lg" fontWeight="semibold" color="gray.700">
              Loading your experience...
            </Text>
            <Text fontSize="sm" color="gray.500">
              Preparing beautiful images
            </Text>
          </VStack>
          <Box width="300px">
            <Progress 
              value={loadProgress} 
              colorScheme="blue" 
              size="lg" 
              borderRadius="full"
              bg="gray.100"
            />
            <Text fontSize="xs" color="gray.400" mt={2}>
              {Math.round(loadProgress)}% complete
            </Text>
          </Box>
        </VStack>
      </Box>
    );
  }

  // Return children when loading is complete or showProgress is false
  return <>{children}</>;
};

// Hook for using the image preloader
export const useImagePreloader = (images: string[], options?: {
  priority?: 'hero' | 'critical' | 'normal';
  timeout?: number;
  fallbackDelay?: number;
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const handleComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleProgress = useCallback((newProgress: number) => {
    setProgress(newProgress);
  }, []);

  return {
    isLoading,
    progress,
    loadedImages,
    PreloaderComponent: ({ children }: { children: React.ReactNode }) => (
      <EnhancedImagePreloader
        images={images}
        onComplete={handleComplete}
        onProgress={handleProgress}
        priority={options?.priority}
        timeout={options?.timeout}
        fallbackDelay={options?.fallbackDelay}
        showProgress={true}
      >
        {children}
      </EnhancedImagePreloader>
    )
  };
};

export default EnhancedImagePreloader;
