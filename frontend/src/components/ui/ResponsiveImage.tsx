import React, { useState } from 'react';
import { Image, Skeleton, Box } from '@chakra-ui/react';
import type { ImageProps } from '@chakra-ui/react';
import { RESPONSIVE_IMAGES } from '../../styles/responsive-design';

interface ResponsiveImageProps extends Omit<ImageProps, 'src' | 'sizes' | 'fallback'> {
  src: string;
  alt: string;
  variant?: 'thumbnail' | 'card' | 'hero' | 'gallery';
  responsiveSizes?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
    largeDesktop?: string;
  };
  lazy?: boolean;
  fallbackSrc?: string;
  aspectRatio?: number;
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  variant = 'card',
  responsiveSizes,
  lazy = true,
  fallbackSrc,
  aspectRatio,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Use predefined image sizes or custom sizes
  const imageSizes = responsiveSizes || {
    mobile: RESPONSIVE_IMAGES[variant].mobile,
    tablet: RESPONSIVE_IMAGES[variant].tablet,
    desktop: RESPONSIVE_IMAGES[variant].desktop,
    largeDesktop: RESPONSIVE_IMAGES[variant].largeDesktop,
  };

  // Generate responsive srcSet for different screen sizes
  const generateSrcSet = (baseSrc: string) => {
    const sizes = [
      { width: 320, suffix: '?w=320' },
      { width: 768, suffix: '?w=768' },
      { width: 1024, suffix: '?w=1024' },
      { width: 1440, suffix: '?w=1440' },
    ];

    return sizes
      .map(({ width, suffix }) => `${baseSrc}${suffix} ${width}w`)
      .join(', ');
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  const imageSrc = hasError && fallbackSrc ? fallbackSrc : src;

  return (
    <Box position="relative" overflow="hidden">
      <Skeleton
        isLoaded={isLoaded}
        startColor="gray.200"
        endColor="gray.400"
        borderRadius={props.borderRadius || 'md'}
      >
        <Image
          src={imageSrc}
          alt={alt}
          loading={lazy ? 'lazy' : 'eager'}
          srcSet={generateSrcSet(src)}
          sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, (max-width: 1439px) 33vw, 25vw"
          onLoad={handleLoad}
          onError={handleError}
          objectFit="cover"
          w="100%"
          h="auto"
          transition="transform 0.3s ease"
          _hover={{ transform: 'scale(1.05)' }}
          {...props}
        />
      </Skeleton>
    </Box>
  );
};

export default ResponsiveImage; 