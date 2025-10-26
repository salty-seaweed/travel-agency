/**
 * Image Preloader Hook
 * Preloads and converts images for better performance
 */

import { useEffect, useState, useRef, useCallback } from 'react';
import { imageConverter } from '../services/imageConverter';

interface UseImagePreloaderOptions {
  packages?: any[];
  enablePreloading?: boolean;
  onProgress?: (progress: number) => void;
}

export const useImagePreloader = ({ 
  packages = [], 
  enablePreloading = true,
  onProgress 
}: UseImagePreloaderOptions) => {
  const [isPreloading, setIsPreloading] = useState(false);
  const [preloadProgress, setPreloadProgress] = useState(0);
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(new Set());
  const processedPackagesRef = useRef<Set<string>>(new Set());
  const isProcessingRef = useRef(false);

  // Helper function to check if image is local and doesn't need conversion
  const isLocalImage = useCallback((url: string): boolean => {
    return url.startsWith('/') || 
           url.includes('localhost') || 
           url.includes('127.0.0.1') ||
           url.startsWith(window.location.origin);
  }, []);

  // Create a stable packages key for comparison
  const packagesKey = useCallback(() => {
    return packages.map(pkg => `${pkg.id}-${pkg.images?.length || 0}`).join('|');
  }, [packages]);

  const preloadImages = useCallback(async () => {
    if (!enablePreloading || !packages.length || isProcessingRef.current) return;

    const currentKey = packagesKey();
    if (processedPackagesRef.current.has(currentKey)) return;

    isProcessingRef.current = true;
    setIsPreloading(true);
    setPreloadProgress(0);

    try {
      // Extract all image URLs from packages
      const imageUrls = packages
        .flatMap(pkg => pkg.images || [])
        .map(img => img.image || img.image_url)
        .filter(Boolean)
        .filter((url, index, array) => array.indexOf(url) === index); // Remove duplicates

      if (imageUrls.length === 0) {
        setIsPreloading(false);
        isProcessingRef.current = false;
        return;
      }

      // Filter out local images that don't need conversion
      const imagesToProcess = imageUrls.filter(url => !isLocalImage(url));
      const localImages = imageUrls.filter(url => isLocalImage(url));

      // Add local images to preloaded set immediately (no conversion needed)
      const preloaded = new Set<string>(localImages);

      if (imagesToProcess.length === 0) {
        setPreloadedImages(preloaded);
        processedPackagesRef.current.add(currentKey);
        setIsPreloading(false);
        isProcessingRef.current = false;
        onProgress?.(100);
        return;
      }

      // Preload external images in batches for better performance
      const batchSize = 2; // Reduced batch size to prevent overwhelming
      const batches = [];
      
      for (let i = 0; i < imagesToProcess.length; i += batchSize) {
        batches.push(imagesToProcess.slice(i, i + batchSize));
      }

      for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        
        // Process batch in parallel
        const batchPromises = batch.map(async (url) => {
          try {
            await imageConverter.getOptimizedImage(url, 'card');
            preloaded.add(url);
          } catch (error) {
            console.warn(`Failed to preload image: ${url}`, error);
            // Still add to preloaded set to avoid retrying
            preloaded.add(url);
          }
        });

        await Promise.all(batchPromises);
        
        // Update progress
        const progress = ((i + 1) / batches.length) * 100;
        setPreloadProgress(progress);
        onProgress?.(progress);
      }

      setPreloadedImages(preloaded);
      processedPackagesRef.current.add(currentKey);
    } catch (error) {
      console.error('Image preloading failed:', error);
    } finally {
      setIsPreloading(false);
      isProcessingRef.current = false;
    }
  }, [packages, enablePreloading, onProgress, packagesKey, isLocalImage]);

  useEffect(() => {
    preloadImages();
  }, [preloadImages]);

  return {
    isPreloading,
    preloadProgress,
    preloadedImages,
    isImagePreloaded: (url: string) => preloadedImages.has(url)
  };
};
