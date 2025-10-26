import React, { useState } from 'react';
import { Box, Container, Flex, Heading, Link as ChakraLink, Stack, Input, InputGroup, InputLeftElement, Button, HStack, VStack } from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <Box as="header" bg="blue.800" color="white" py={4} shadow="md" width="100%">
      <Box maxW="1400px" mx="auto" px={4}>
        <VStack spacing={4}>
          <Flex justify="space-between" align="center" width="100%">
            <Heading as="h1" size="lg">
              <RouterLink to="/" style={{ textDecoration: 'none', color: 'white' }}>
                Thread Global Travels
              </RouterLink>
            </Heading>
            <Stack as="nav" direction="row" spacing={6} display={{ base: 'none', md: 'flex' }}>
              <ChakraLink as={RouterLink} to="/">Home</ChakraLink>
              <ChakraLink as={RouterLink} to="/countries">Destinations</ChakraLink>
              <ChakraLink as={RouterLink} to="/deals">Deals</ChakraLink>
            </Stack>
          </Flex>

          {/* Search Bar */}
          <Box width="100%" maxW="600px">
            <form onSubmit={handleSearch}>
              <HStack spacing={0}>
                <InputGroup>
                  <InputLeftElement>
                    <FaMapMarkerAlt color="gray" />
                  </InputLeftElement>
                  <Input
                    placeholder="Search destinations, tours, or activities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    bg="white"
                    color="black"
                    _placeholder={{ color: 'gray.500' }}
                    borderRadius="md 0 0 md"
                  />
                </InputGroup>
                <Button
                  type="submit"
                  colorScheme="orange"
                  borderRadius="0 md md 0"
                  px={6}
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
    </Box>
  );
};

export default Header;
