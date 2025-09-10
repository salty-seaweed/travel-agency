import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import Header from './Header';
import Footer from './Footer';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Flex direction="column" minHeight="100vh" width="100%">
      <Header />
      <Box as="main" flex="1" width="100%" px={4} py={8}>
        <Box maxW="1400px" mx="auto" width="100%">
          {children}
        </Box>
      </Box>
      <Footer />
    </Flex>
  );
};

export default Layout;
