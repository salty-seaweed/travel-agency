import React, { useState, useRef, useEffect } from 'react';
import { Box, Skeleton, Image as ChakraImage, ImageProps } from '@chakra-ui/react';

interface OptimizedImageProps extends Omit<ImageProps, 'loading'> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: number;
  lazy?: boolean;
  placeholder?: string;
  fallback?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  quality = 80,
  lazy = true,
  placeholder,
  fallback = '/src/assets/images/placeholder.jpg',
  onLoad,
  onError,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || isInView) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observerRef.current?.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before the image comes into view
        threshold: 0.1,
      }
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [lazy, isInView]);

  // Generate optimized image URL
  const getOptimizedSrc = (originalSrc: string) => {
    // If it's already an external URL, return as-is
    if (originalSrc.startsWith('http')) {
      return originalSrc;
    }

    // For local images, we could add query parameters for optimization
    // This would work with a service like Cloudinary or similar
    const params = new URLSearchParams();
    if (width) params.append('w', width.toString());
    if (height) params.append('h', height.toString());
    if (quality) params.append('q', quality.toString());
    params.append('f', 'auto'); // Auto format (WebP, AVIF when supported)

    const queryString = params.toString();
    return queryString ? `${originalSrc}?${queryString}` : originalSrc;
  };

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Don't render anything if lazy loading and not in view
  if (lazy && !isInView) {
    return (
      <Box
        ref={imgRef}
        width={width}
        height={height}
        bg="gray.100"
        display="flex"
        alignItems="center"
        justifyContent="center"
        {...props}
      >
        {placeholder && (
          <ChakraImage
            src={placeholder}
            alt=""
            width="100%"
            height="100%"
            objectFit="cover"
            opacity={0.3}
          />
        )}
      </Box>
    );
  }

  return (
    <Box position="relative" width={width} height={height} {...props}>
      {/* Loading skeleton */}
      {!isLoaded && !hasError && (
        <Skeleton
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
          borderRadius={props.borderRadius}
        />
      )}

      {/* Main image */}
      {!hasError && (
        <ChakraImage
          ref={imgRef}
          src={getOptimizedSrc(src)}
          alt={alt}
          width="100%"
          height="100%"
          objectFit="cover"
          onLoad={handleLoad}
          onError={handleError}
          opacity={isLoaded ? 1 : 0}
          transition="opacity 0.3s ease-in-out"
          {...props}
        />
      )}

      {/* Fallback image */}
      {hasError && (
        <ChakraImage
          src={fallback}
          alt={alt}
          width="100%"
          height="100%"
          objectFit="cover"
          opacity={0.7}
          {...props}
        />
      )}
    </Box>
  );
}
