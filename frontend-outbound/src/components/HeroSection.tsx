import React, { useState } from 'react';
import { Box, Heading, Text, Input, InputGroup, InputLeftElement, Button, VStack, HStack, usePrefersReducedMotion } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import { useImageSlider } from '../hooks/useImageSlider';

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1502602898657-3e91760c0337?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1549892301-e6241a20a435?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=2070&auto=format&fit=crop',
];

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const HeroSection: React.FC = () => {
  const { currentImage } = useImageSlider(HERO_IMAGES);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const prefersReducedMotion = usePrefersReducedMotion();

  const animation = prefersReducedMotion ? undefined : `${fadeIn} 1s ease-out`;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <Box
      as="section"
      position="relative"
      height={{ base: '60vh', md: '80vh' }}
      display="flex"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      color="white"
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `url(${currentImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: 'background-image 1s ease-in-out',
        zIndex: -1,
      }}
      _after={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bg: 'blackAlpha.600',
        zIndex: -1,
      }}
    >
      <VStack spacing={8} p={4} animation={animation}>
        <Heading as="h1" size={{ base: '2xl', md: '4xl' }} fontWeight="bold">
          Discover Your Next Adventure
        </Heading>
        <Text fontSize={{ base: 'lg', md: '2xl' }} maxW="2xl">
          Explore thousands of tours and activities around the world. Your dream trip starts here.
        </Text>
        <Box width="100%" maxW="600px">
          <form onSubmit={handleSearch}>
            <HStack>
              <InputGroup size="lg">
                <InputLeftElement pointerEvents="none">
                  <FaMapMarkerAlt color="gray.300" />
                </InputLeftElement>
                <Input
                  placeholder="Search for a destination or activity"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  bg="white"
                  color="black"
                  borderRadius="md"
                  _placeholder={{ color: 'gray.500' }}
                />
              </InputGroup>
              <Button
                type="submit"
                colorScheme="orange"
                size="lg"
                px={8}
                leftIcon={<FaSearch />}
                disabled={!searchQuery.trim()}
              >
                Search
              </Button>
            </HStack>
          </form>
        </Box>
      </VStack>
    </Box>
  );
};

export default HeroSection;
