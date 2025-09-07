/**
 * Smart Lazy Image Component
 * Enhanced version of LazyImage that uses the image converter for optimal display
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Skeleton } from '@chakra-ui/react';
import { useIntersectionObserver } from '../utils/performanceUtils';
import { imageConverter, convertImageForCard, convertImageForThumbnail } from '../services/imageConverter';

interface SmartLazyImageProps {
  src: string;
  alt: string;
  width?: string | number;
  height?: string | number;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  borderRadius?: string;
  fallbackSrc?: string;
  priority?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
  useCase?: 'thumbnail' | 'card' | 'hero' | 'original';
  enableSmartConversion?: boolean;
  showLoadingSkeleton?: boolean;
}

export const SmartLazyImage: React.FC<SmartLazyImageProps> = React.memo(({
  src,
  alt,
  width = '100%',
  height = 'auto',
  objectFit = 'cover',
  borderRadius,
  fallbackSrc,
  priority = false,
  className,
  style,
  onLoad,
  onError,
  useCase = 'card',
  enableSmartConversion = true,
  showLoadingSkeleton = true,
}) => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [isConverting, setIsConverting] = useState(false);
  
  const imgRef = useRef<HTMLImageElement>(null);
  const [intersectionRef, isIntersecting] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px',
  });

  // Combine refs
  const combinedRef = useCallback((node: HTMLImageElement | null) => {
    if (intersectionRef.current !== node) {
      intersectionRef.current = node;
    }
    imgRef.current = node;
  }, [intersectionRef]);

  // Handle intersection
  useEffect(() => {
    if (isIntersecting || priority) {
      setIsInView(true);
    }
  }, [isIntersecting, priority]);

  // Load and convert image when in view
  useEffect(() => {
    if (!isInView || !src || src.trim() === '') return;

    const loadImage = async () => {
      try {
        setIsConverting(true);
        
        let optimizedSrc: string;
        
        if (enableSmartConversion) {
          try {
            // Use smart conversion
            optimizedSrc = await imageConverter.getOptimizedImage(src, useCase);
          } catch (conversionError) {
            console.warn('Smart conversion failed, falling back to original image:', conversionError);
            optimizedSrc = src;
          }
        } else {
          // Use original image
          optimizedSrc = src;
        }
        
        setImageSrc(optimizedSrc);
        setIsLoaded(true);
        setHasError(false);
        onLoad?.();
      } catch (error) {
        console.warn('Smart conversion failed, falling back to original:', error);
        
        // Fallback to original image
        try {
          setImageSrc(src);
          setIsLoaded(true);
          setHasError(false);
          onLoad?.();
        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError);
          setHasError(true);
          if (fallbackSrc && fallbackSrc !== src) {
            setImageSrc(fallbackSrc);
            setIsLoaded(true);
          }
          onError?.();
        }
      } finally {
        setIsConverting(false);
      }
    };

    loadImage();
  }, [src, isInView, enableSmartConversion, useCase, fallbackSrc, onLoad, onError]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (imageSrc && imageSrc.startsWith('blob:')) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [imageSrc]);

  // Show loading skeleton
  if (showLoadingSkeleton && (!isLoaded || isConverting)) {
    return (
      <Box
        ref={combinedRef}
        width={width}
        height={height}
        borderRadius={borderRadius}
        className={className}
        style={style}
        position="relative"
        overflow="hidden"
      >
        <Skeleton
          width="100%"
          height="100%"
          startColor="gray.200"
          endColor="gray.300"
        />
        {isConverting && (
          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            fontSize="xs"
            color="gray.500"
            bg="white"
            px={2}
            py={1}
            borderRadius="md"
            boxShadow="sm"
          >
            Optimizing...
          </Box>
        )}
      </Box>
    );
  }

  return (
    <Box
      ref={combinedRef}
      width={width}
      height={height}
      borderRadius={borderRadius}
      className={className}
      style={style}
      position="relative"
      overflow="hidden"
    >
      {!isLoaded && !hasError && (
        <Skeleton
          width="100%"
          height="100%"
          startColor="gray.200"
          endColor="gray.300"
          zIndex={1}
        />
      )}
      <img
        src={imageSrc || undefined}
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit,
          borderRadius,
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out',
        }}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />
      {hasError && (
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          textAlign="center"
          color="gray.500"
          fontSize="sm"
        >
          <Box mb={2}>📷</Box>
          <Box>Image unavailable</Box>
        </Box>
      )}
    </Box>
  );
});

SmartLazyImage.displayName = 'SmartLazyImage';
