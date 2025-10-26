import React, { useState, useRef, useEffect } from 'react';
import { Box, Skeleton, Image as ChakraImage, ImageProps } from '@chakra-ui/react';

interface ResponsiveImageProps extends Omit<ImageProps, 'loading'> {
  src: string;
  alt: string;
  sizes?: string;
  lazy?: boolean;
  placeholder?: string;
  fallback?: string;
  onLoad?: () => void;
  onError?: () => void;
  priority?: boolean;
}

// Image size configurations
const IMAGE_SIZES = {
  thumbnail: { width: 150, height: 150 },
  small: { width: 400, height: 300 },
  medium: { width: 800, height: 600 },
  large: { width: 1200, height: 900 },
  hero: { width: 1920, height: 1080 }
};

// Default sizes for different use cases
const DEFAULT_SIZES = {
  thumbnail: '(max-width: 768px) 150px, 150px',
  small: '(max-width: 768px) 400px, 400px',
  medium: '(max-width: 768px) 800px, (max-width: 1200px) 800px, 1200px',
  large: '(max-width: 768px) 1200px, (max-width: 1200px) 1200px, 1920px',
  hero: '(max-width: 768px) 1920px, 1920px'
};

export function ResponsiveImage({
  src,
  alt,
  sizes,
  lazy = true,
  placeholder,
  fallback = '/images/optimized/thumbnail/ishan1.webp',
  onLoad,
  onError,
  priority = false,
  ...props
}: ResponsiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(!lazy || priority);
  const [hasError, setHasError] = useState(false);
  const [supportsWebP, setSupportsWebP] = useState(false);
  const [supportsAvif, setSupportsAvif] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Check browser support for modern formats
  useEffect(() => {
    const checkFormatSupport = async () => {
      // Check WebP support
      const webpSupported = await new Promise((resolve) => {
        const webp = new Image();
        webp.onload = webp.onerror = () => resolve(webp.width === 1);
        webp.src = 'data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAADsAD+JaQAA3AAAAAA';
      });
      setSupportsWebP(webpSupported);

      // Check AVIF support
      const avifSupported = await new Promise((resolve) => {
        const avif = new Image();
        avif.onload = avif.onerror = () => resolve(avif.width === 1);
        avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
      });
      setSupportsAvif(avifSupported);
    };

    checkFormatSupport();
  }, []);

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
        rootMargin: '50px',
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

  // Generate optimized image sources
  const generateImageSources = (originalSrc: string) => {
    // If it's already an external URL, return as-is
    if (originalSrc.startsWith('http')) {
      return { src: originalSrc, srcSet: undefined };
    }

    // Extract base name and extension
    const pathParts = originalSrc.split('/');
    const filename = pathParts[pathParts.length - 1];
    const baseName = filename.split('.')[0];
    const basePath = pathParts.slice(0, -1).join('/');

    // Determine the best format based on browser support
    let preferredFormat = 'jpg';
    if (supportsAvif) {
      preferredFormat = 'avif';
    } else if (supportsWebP) {
      preferredFormat = 'webp';
    }

    // Generate srcSet for responsive images
    const srcSet = Object.entries(IMAGE_SIZES)
      .map(([size, dimensions]) => {
        const optimizedPath = `${basePath}/optimized/${size}/${baseName}.${preferredFormat}`;
        return `${optimizedPath} ${dimensions.width}w`;
      })
      .join(', ');

    // Use the most appropriate size as the main src
    const mainSrc = `${basePath}/optimized/medium/${baseName}.${preferredFormat}`;

    return {
      src: mainSrc,
      srcSet,
      sizes: sizes || DEFAULT_SIZES.medium
    };
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

  const { src: optimizedSrc, srcSet, sizes: imageSizes } = generateImageSources(src);

  return (
    <Box position="relative" {...props}>
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
          src={optimizedSrc}
          srcSet={srcSet}
          sizes={imageSizes}
          alt={alt}
          width="100%"
          height="100%"
          objectFit="cover"
          onLoad={handleLoad}
          onError={handleError}
          opacity={isLoaded ? 1 : 0}
          transition="opacity 0.3s ease-in-out"
          loading={lazy ? 'lazy' : 'eager'}
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

// Utility function to get optimized image URL
export function getOptimizedImageUrl(originalSrc: string, size: keyof typeof IMAGE_SIZES = 'medium', format?: 'jpg' | 'webp' | 'avif') {
  if (originalSrc.startsWith('http')) {
    return originalSrc;
  }

  const pathParts = originalSrc.split('/');
  const filename = pathParts[pathParts.length - 1];
  const baseName = filename.split('.')[0];
  const basePath = pathParts.slice(0, -1).join('/');

  // Auto-detect best format if not specified
  if (!format) {
    // You could implement browser detection here
    format = 'webp'; // Default to WebP for better compression
  }

  return `${basePath}/optimized/${size}/${baseName}.${format}`;
}
