import React from 'react';
import { Box, Text, Stack, Link } from '@chakra-ui/react';

const Footer: React.FC = () => {
  return (
    <Box as="footer" bg="gray.800" color="gray.400" py={10} width="100%">
      <Box maxW="1400px" mx="auto" px={4}>
        <Stack
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align="center"
          spacing={6}
        >
          <Text>&copy; {new Date().getFullYear()} Thread Global Travels. All rights reserved.</Text>
          <Stack direction="row" spacing={6}>
            <Link href="#">About</Link>
            <Link href="#">Contact</Link>
            <Link href="#">Privacy Policy</Link>
            <Link href="#">Terms of Service</Link>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

export default Footer;
