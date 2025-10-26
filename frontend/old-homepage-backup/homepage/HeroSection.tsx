import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Container,
  Heading,
  Icon,
} from '@chakra-ui/react';
import { 
  GiftIcon,
  BuildingOffice2Icon,
  ArrowRightIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/outline';

interface HeroSectionProps {
  homepageContent?: any;
  heroImages: string[];
}

export const HeroSection: React.FC<HeroSectionProps> = ({ homepageContent, heroImages }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Memoize the background images to prevent unnecessary re-renders
  const backgroundImages = useMemo(() => {
    if (homepageContent?.hero?.background_images && homepageContent.hero.background_images.length > 0) {
      return homepageContent.hero.background_images;
    } else if (homepageContent?.hero?.background_image_url) {
      return [homepageContent.hero.background_image_url];
    } else {
      return heroImages;
    }
  }, [homepageContent?.hero?.background_images, homepageContent?.hero?.background_image_url, heroImages]);

  // Auto-rotate background images
  useEffect(() => {
    if (backgroundImages.length <= 1) return; // Don't rotate if only one image
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  return (
    <section className="hero-section relative h-screen flex items-center justify-center overflow-hidden" style={{ height: '100vh', maxHeight: '100vh', minHeight: '100vh' }}>
      {/* Bottom fade transition to prevent visual artifacts */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent z-10"></div>
      
      {/* Dynamic Background Images */}
      <div className="absolute inset-0 overflow-hidden">
        {backgroundImages.map((imageUrl: string, index: number) => {
          const isActive = index === currentImageIndex;
          return (
            <img 
              key={`hero-image-${index}`}
              src={imageUrl}
              alt={`Maldives Paradise ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                isActive ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                objectPosition: 'center 30%',
                minWidth: '100%',
                minHeight: '100%',
                width: '100%',
                height: '100%',
                willChange: 'opacity'
              }}
              loading={index === 0 ? "eager" : "lazy"}
              onLoad={(e: React.SyntheticEvent<HTMLImageElement>) => {
                const img = e.target as HTMLImageElement;
                img.style.objectFit = 'cover';
                img.style.objectPosition = 'center 30%';
              }}
            />
          );
        })}
        
        {/* Stable overlay gradient - prevents color shifting during resize */}
        <div className="absolute inset-0 bg-black/30 gradient-overlay"></div>
      </div>

      {/* Hero Content */}
      <Container maxW="7xl" className="relative z-10 text-center text-white px-4 h-full flex items-center justify-center">
        <VStack spacing={{ base: 4, md: 6, lg: 8 }} className="w-full max-w-4xl">
          <VStack spacing={{ base: 4, md: 5, lg: 6 }} className="animate-fade-in">
            <Heading 
              size="2xl" 
              className="text-6xl md:text-8xl font-bold leading-tight animate-slide-up"
            >
              {homepageContent?.hero?.title || 'Discover Your'}
              <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent animate-pulse">
                {homepageContent?.hero?.subtitle || 'Maldives Paradise'}
              </span>
            </Heading>
            
            {homepageContent?.hero?.description && (
              <Text 
                fontSize={{ base: "lg", md: "xl" }} 
                className="text-blue-100 max-w-3xl mx-auto leading-relaxed animate-slide-up-delayed"
              >
                {homepageContent.hero.description}
              </Text>
            )}
          </VStack>

          {/* CTA Buttons */}
          <HStack spacing={6} flexDir={{ base: "column", sm: "row" }} justify="center" align="center" className="animate-slide-up-delayed">
            <Link to={homepageContent?.hero?.cta_primary_url || "/packages"}>
              <Button 
                size="lg" 
                bgGradient="linear(to-r, green.500, emerald.600)"
                color="white"
                px={10}
                py={6}
                fontSize="xl"
                fontWeight="bold"
                borderRadius="full"
                boxShadow="2xl"
                _hover={{
                  bgGradient: 'linear(to-r, green.600, emerald.700)',
                  boxShadow: 'lg',
                  transform: 'scale(1.05)',
                }}
                transition="all 0.3s ease"
              >
                <Icon as={GiftIcon} className="w-7 h-7 mr-3" />
                {homepageContent?.hero?.cta_primary_text || 'Explore Packages'}
                <Icon as={ArrowRightIcon} className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to={homepageContent?.hero?.cta_secondary_url || "/properties"}>
              <Button 
                size="lg" 
                variant="outline"
                border="3px solid"
                borderColor="white"
                color="white"
                px={10}
                py={6}
                fontSize="xl"
                fontWeight="bold"
                borderRadius="full"
                transition="all 0.3s ease"
                _hover={{
                  bg: 'white',
                  color: 'blue.900',
                  transform: 'scale(1.05)',
                }}
                backdropFilter="blur(4px)"
              >
                <Icon as={BuildingOffice2Icon} className="w-7 h-7 mr-3" />
                {homepageContent?.hero?.cta_secondary_text || 'View Properties'}
                <Icon as={ArrowRightIcon} className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </HStack>
        </VStack>
      </Container>

      {/* Scroll Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
        <VStack spacing={2}>
          <Text className="text-white/70 text-sm font-medium">Scroll to explore</Text>
          <Icon as={ArrowDownIcon} className="w-6 h-6 text-white" />
        </VStack>
      </div>
    </section>
  );
}; 