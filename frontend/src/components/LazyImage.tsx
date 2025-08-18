import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Skeleton } from '@chakra-ui/react';
import { useIntersectionObserver } from '../utils/performanceUtils';

interface LazyImageProps {
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
}

export const LazyImage: React.FC<LazyImageProps> = React.memo(({
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
}) => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  
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

  // Load image when in view
  useEffect(() => {
    if (!isInView || !src) return;

    const img = new Image();
    
    const handleLoad = () => {
      setImageSrc(src);
      setIsLoaded(true);
      setHasError(false);
      onLoad?.();
    };

    const handleError = () => {
      setHasError(true);
      if (fallbackSrc && fallbackSrc !== src) {
        setImageSrc(fallbackSrc);
        setIsLoaded(true);
      }
      onError?.();
    };

    img.onload = handleLoad;
    img.onerror = handleError;

    // Add performance optimizations
    let optimizedSrc = src;
    if (src.includes('unsplash.com')) {
      optimizedSrc += optimizedSrc.includes('?') ? '&' : '?';
      optimizedSrc += 'auto=format&q=80&fit=crop&w=800';
    }

    img.src = optimizedSrc;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, isInView, fallbackSrc, onLoad, onError]);

  if (!isInView) {
    return (
      <Box
        ref={combinedRef}
        width={width}
        height={height}
        borderRadius={borderRadius}
        className={className}
        style={style}
      >
        <Skeleton
          width="100%"
          height="100%"
          borderRadius={borderRadius}
          startColor="gray.200"
          endColor="gray.300"
        />
      </Box>
    );
  }

  if (hasError && !fallbackSrc) {
    return (
      <Box
        width={width}
        height={height}
        borderRadius={borderRadius}
        className={className}
        style={style}
        bg="gray.100"
        display="flex"
        alignItems="center"
        justifyContent="center"
        color="gray.500"
        fontSize="sm"
      >
        Image not available
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
      {!isLoaded && (
        <Skeleton
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
          borderRadius={borderRadius}
          startColor="gray.200"
          endColor="gray.300"
          zIndex={1}
        />
      )}
      <img
        src={imageSrc}
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
    </Box>
  );
});

LazyImage.displayName = 'LazyImage'; 