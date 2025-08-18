import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Flex,
  HStack,
  VStack,
  Text,
  Button,
  IconButton,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Icon,
  Avatar,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Divider,
} from '@chakra-ui/react';
import {
  HomeIcon,
  StarIcon,
  BuildingOfficeIcon,
  MapIcon,
  InformationCircleIcon,
  ChatBubbleLeftRightIcon,
  // MagnifyingGlassIcon, // TEMPORARILY DISABLED
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  HeartIcon,
  BellIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { useCustomerAuth } from '../hooks/useCustomerAuth';
import { useSmartTranslation } from '../hooks/useSmartTranslation';
import logo from '../assets/logo.svg';

interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  featured?: boolean;
}

export const Navigation = React.memo(() => {
  const location = useLocation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, customerData, logout } = useCustomerAuth();
  // const { translateNav, translateButton } = useSmartTranslation(); // TEMPORARILY DISABLED

  const navigation: NavigationItem[] = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'Packages', href: '/packages', icon: StarIcon, featured: true },
    { name: 'Properties', href: '/properties', icon: BuildingOfficeIcon },
    { name: 'Transportation', href: '/transportation', icon: SparklesIcon },
    { name: 'Map', href: '/map', icon: MapIcon },
    { name: 'About', href: '/about', icon: InformationCircleIcon },
    { name: 'Contact', href: '/contact', icon: ChatBubbleLeftRightIcon },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    onClose();
  }, [location.pathname, onClose]);

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <Box
        as="nav"
        position="sticky"
        top={0}
        zIndex={50}
        backdropFilter={isScrolled ? 'blur(20px)' : 'blur(10px)'}
        borderBottom="1px solid"
        borderColor="gray.200"
        boxShadow={isScrolled ? '2xl' : 'lg'}
        transition="all 0.3s ease"
        bgGradient={isScrolled ? 'linear(to-r, white, gray.50)' : 'linear(to-r, white, blue.50)'}
        className="notranslate"
        style={{ paddingLeft: '0', paddingRight: '45px' }}
      >
        <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }}>
          <Flex justify="space-between" align="center" h={{ base: '4rem', md: '5rem' }}>
            {/* Logo */}
            <Flex align="center" flexShrink={0}>
              <Link to="/" style={{ paddingRight: '0px', marginRight: '30px', marginLeft: '-50px' }}>
                <Flex align="center" _hover={{ transform: 'scale(1.05)' }} transition="all 0.3s ease">
                  <Box
                    w={{ base: '10', md: '12' }}
                    h={{ base: '10', md: '12' }}
                    borderRadius="2xl"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    boxShadow="xl"
                    _hover={{ boxShadow: '2xl' }}
                    transition="all 0.5s ease"
                    position="relative"
                    overflow="hidden"
                  >
                    <img 
                      src={logo} 
                      alt="Thread Travels Logo" 
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                    <Box
                      position="absolute"
                      inset={0}
                      bg="whiteAlpha.200"
                      borderRadius="2xl"
                      _hover={{ bg: 'whiteAlpha.300' }}
                      transition="all 0.5s ease"
                    />
                    <Box
                      position="absolute"
                      top="-1"
                      right="-1"
                      w="3"
                      h="3"
                      bg="yellow.400"
                      borderRadius="full"
                      animation="pulse 2s infinite"
                    />
                  </Box>
                  <VStack align="start" ml={1} spacing={0} className="notranslate">
                    <Text
                      fontSize={{ base: "lg", md: "2xl", lg: "3xl" }}
                      fontWeight="extrabold"
                      bgGradient="linear(to-r, blue.600, purple.600)"
                      bgClip="text"
                      lineHeight="0.9"
                      letterSpacing="tight"
                      className="notranslate"
                    >
                      Thread Travels
                    </Text>
                    <Text
                      fontSize={{ base: "xs", md: "sm" }}
                      color="gray.700"
                      fontWeight="semibold"
                      lineHeight="1"
                      letterSpacing="wide"
                      textTransform="uppercase"
                      className="notranslate"
                    >
                      & Tours
                    </Text>
                  </VStack>
                </Flex>
              </Link>
            </Flex>

            {/* Desktop Navigation */}
            <HStack spacing={3} display={{ base: 'none', lg: 'flex' }}>
              {navigation.map((item) => (
                <Link key={item.name} to={item.href}>
                  <Button
                    variant={item.featured ? 'solid' : isActive(item.href) ? 'outline' : 'ghost'}
                    colorScheme={item.featured ? 'orange' : isActive(item.href) ? 'blue' : 'gray'}
                    size="md"
                    px={6}
                    py={3}
                    borderRadius="2xl"
                    fontWeight="medium"
                    fontSize="sm"
                    bg={item.featured ? 'blue.500' : isActive(item.href) ? 'blue.50' : 'transparent'}
                    color={item.featured ? 'white' : isActive(item.href) ? 'blue.600' : 'gray.600'}
                    border={isActive(item.href) ? '1px solid' : 'none'}
                    borderColor={isActive(item.href) ? 'blue.200' : undefined}
                    _hover={{
                      transform: 'scale(1.02)',
                      boxShadow: 'sm',
                      bg: item.featured ? 'blue.600' : isActive(item.href) ? 'blue.100' : 'gray.50',
                    }}
                    transition="all 0.3s ease"
                    position="relative"
                  >

                    <HStack spacing={2}>
                      <Icon as={item.icon} h="4" w="4" />
                      <Text>{item.name}</Text>
                    </HStack>
                    {isActive(item.href) && !item.featured && (
                      <Box
                        position="absolute"
                        bottom="0"
                        left="50%"
                        transform="translateX(-50%)"
                        w="1"
                        h="1"
                        bg="blue.600"
                        borderRadius="full"
                      />
                    )}
                  </Button>
                </Link>
              ))}
            </HStack>

            {/* Right Side Actions */}
            <HStack spacing={3}>
              {/* Search Button - TEMPORARILY HIDDEN */}
              {/* <IconButton
                aria-label="Search"
                icon={<Icon as={MagnifyingGlassIcon} h="5" w="5" />}
                variant="ghost"
                size="md"
                borderRadius="2xl"
                onClick={() => {}} // TODO: Open search
                _hover={{
                  transform: 'scale(1.05)',
                  boxShadow: 'md',
                }}
                transition="all 0.3s ease"
              /> */}

              {/* User Menu */}
              {isAuthenticated ? (
                <HStack spacing={3} ml={4}>
                  <IconButton
                    aria-label="Notifications"
                    icon={<Icon as={BellIcon} h="5" w="5" />}
                    variant="ghost"
                    size="md"
                    borderRadius="2xl"
                    position="relative"
                    _hover={{
                      transform: 'scale(1.05)',
                      boxShadow: 'md',
                    }}
                    transition="all 0.3s ease"
                  >
                    <Box
                      position="absolute"
                      top="-1"
                      right="-1"
                      w="3"
                      h="3"
                      bg="red.500"
                      borderRadius="full"
                      animation="pulse 2s infinite"
                    />
                  </IconButton>
                  
                  {/* User Dropdown */}
                  <Menu>
                    <MenuButton
                      as={Button}
                      variant="ghost"
                      size="md"
                      px={4}
                      py={3}
                      borderRadius="2xl"
                      fontWeight="semibold"
                      fontSize="sm"
                      _hover={{
                        transform: 'scale(1.05)',
                        boxShadow: 'md',
                      }}
                      transition="all 0.3s ease"
                    >
                      <HStack spacing={3}>
                        <Avatar
                          size="sm"
                          bgGradient="linear(to-br, blue.500, indigo.600)"
                          icon={<Icon as={UserIcon} h="4" w="4" color="white" />}
                        />
                        <Text display={{ base: 'none', md: 'block' }}>
                          {customerData?.user?.first_name || 'User'}
                        </Text>
                        <Icon as={ChevronDownIcon} h="4" w="4" />
                      </HStack>
                    </MenuButton>
                    
                    <MenuList
                      bg="white"
                      borderRadius="2xl"
                      boxShadow="2xl"
                      border="1px solid"
                      borderColor="gray.200"
                      py={2}
                    >
                      <MenuItem
                        icon={<Icon as={UserIcon} h="4" w="4" />}
                        onClick={() => onClose()}
                        as={Link}
                        to="/dashboard"
                      >
                        Dashboard
                      </MenuItem>
                      <MenuItem
                        icon={<Icon as={UserIcon} h="4" w="4" />}
                        onClick={() => onClose()}
                        as={Link}
                        to="/profile"
                      >
                        Profile
                      </MenuItem>
                      <MenuDivider />
                      <MenuItem 
                        icon={<Text fontSize="lg">🚪</Text>}
                        onClick={() => {
                          handleLogout();
                          onClose();
                        }}
                        color="red.600"
                        _hover={{ bg: 'red.50' }}
                      >
                        Logout
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </HStack>
              ) : (
                <HStack spacing={3} ml={4} display={{ base: 'none', md: 'flex' }}>
                  {/* Login button temporarily hidden */}
                  {/* <Button
                    variant="ghost"
                    size="md"
                    px={6}
                    py={3}
                    borderRadius="2xl"
                    fontWeight="semibold"
                    fontSize="sm"
                    as={Link}
                    to="/login"
                    _hover={{
                      transform: 'scale(1.05)',
                      boxShadow: 'md',
                    }}
                    transition="all 0.3s ease"
                  >
                    Login
                  </Button> */}
                  <Button
                    bgGradient="linear(to-r, blue.600, indigo.600)"
                    _hover={{
                      bgGradient: 'linear(to-r, blue.700, indigo.700)',
                    }}
                    color="white"
                    size="md"
                    px={8}
                    py={3}
                    borderRadius="2xl"
                    fontWeight="semibold"
                    fontSize="sm"
                    as={Link}
                    to="/properties"
                    _hover={{
                      transform: 'scale(1.05)',
                      boxShadow: 'xl',
                    }}
                    transition="all 0.3s ease"
                  >
                    Book Now
                  </Button>
                </HStack>
              )}

              {/* Mobile menu button */}
              <IconButton
                aria-label="Toggle mobile menu"
                icon={<Icon as={isOpen ? XMarkIcon : Bars3Icon} h="6" w="6" />}
                variant="ghost"
                size="md"
                borderRadius="2xl"
                onClick={onOpen}
                display={{ base: 'flex', lg: 'none' }}
                _hover={{
                  transform: 'scale(1.05)',
                  boxShadow: 'md',
                }}
                transition="all 0.3s ease"
              />
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* Mobile Navigation Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="full">
        <DrawerOverlay />
        <DrawerContent bg="white">
          <DrawerCloseButton size="lg" />
          <DrawerHeader borderBottomWidth="1px" borderColor="gray.200">
            <Flex align="center">
              <Box
                w="12"
                h="12"
                borderRadius="2xl"
                display="flex"
                alignItems="center"
                justifyContent="center"
                boxShadow="xl"
                mr={2}
              >
                <img 
                  src={logo} 
                  alt="Thread Travels Logo" 
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </Box>
              <VStack align="start" spacing={0}>
                <Text 
                  fontSize="xl" 
                  fontWeight="extrabold" 
                  bgGradient="linear(to-r, blue.600, purple.600)" 
                  bgClip="text"
                  lineHeight="0.9"
                  letterSpacing="tight"
                >
                  Thread Travels
                </Text>
                <Text 
                  fontSize="sm" 
                  color="gray.700" 
                  fontWeight="semibold"
                  letterSpacing="wide"
                  textTransform="uppercase"
                >
                  & Tours
                </Text>
              </VStack>
            </Flex>
          </DrawerHeader>

          <DrawerBody py={6}>
            <VStack spacing={4} align="stretch">
              {/* Mobile Navigation Links */}
              {navigation.map((item) => (
                <Link key={item.name} to={item.href} onClick={onClose}>
                  <Button
                    variant={item.featured ? 'solid' : isActive(item.href) ? 'outline' : 'ghost'}
                    colorScheme={item.featured ? 'orange' : isActive(item.href) ? 'blue' : 'gray'}
                    size="lg"
                    w="full"
                    justifyContent="flex-start"
                    px={6}
                    py={4}
                    borderRadius="xl"
                    fontWeight="semibold"
                    fontSize="md"
                    bg={item.featured ? 'orange.500' : isActive(item.href) ? 'blue.50' : 'transparent'}
                    color={item.featured ? 'white' : isActive(item.href) ? 'blue.700' : 'gray.700'}
                    border={isActive(item.href) ? '2px solid' : 'none'}
                    borderColor={isActive(item.href) ? 'blue.200' : undefined}
                    _hover={{
                      bg: item.featured ? 'orange.600' : isActive(item.href) ? 'blue.100' : 'gray.100',
                    }}
                    transition="all 0.3s ease"
                  >
                    <HStack spacing={4} w="full">
                      <Icon as={item.icon} h="5" w="5" />
                      <Text>{item.name}</Text>
                      {item.featured && (
                        <Box
                          w="3"
                          h="3"
                          bg="red.500"
                          borderRadius="full"
                          animation="pulse 2s infinite"
                          ml="auto"
                        />
                      )}
                    </HStack>
                  </Button>
                </Link>
              ))}

              <Divider my={6} />

              {/* Mobile User Actions */}
              {isAuthenticated ? (
                <VStack spacing={4} align="stretch">
                  <Text fontSize="lg" fontWeight="semibold" color="gray.700" px={2}>
                    Welcome, {customerData?.user?.first_name || 'User'}
                  </Text>
                  <Button
                    variant="ghost"
                    size="lg"
                    w="full"
                    justifyContent="flex-start"
                    px={6}
                    py={4}
                    borderRadius="xl"
                    as={Link}
                    to="/customer/dashboard"
                    onClick={onClose}
                  >
                    <HStack spacing={4}>
                      <Icon as={UserIcon} h="5" w="5" />
                      <Text>Dashboard</Text>
                    </HStack>
                  </Button>
                  <Button
                    variant="ghost"
                    size="lg"
                    w="full"
                    justifyContent="flex-start"
                    px={6}
                    py={4}
                    borderRadius="xl"
                    color="red.600"
                    onClick={() => {
                      handleLogout();
                      onClose();
                    }}
                  >
                    <HStack spacing={4}>
                      <Text fontSize="lg">🚪</Text>
                      <Text>Logout</Text>
                    </HStack>
                  </Button>
                </VStack>
              ) : (
                <VStack spacing={4} align="stretch">
                  {/* Login button temporarily hidden */}
                  {/* <Button
                    variant="outline"
                    size="lg"
                    w="full"
                    px={6}
                    py={4}
                    borderRadius="xl"
                    fontWeight="semibold"
                    as={Link}
                    to="/customer/login"
                    onClick={onClose}
                  >
                    Login
                  </Button> */}
                  <Button
                    bgGradient="linear(to-r, blue.600, indigo.600)"
                    _hover={{
                      bgGradient: 'linear(to-r, blue.700, indigo.700)',
                    }}
                    color="white"
                    size="lg"
                    w="full"
                    px={6}
                    py={4}
                    borderRadius="xl"
                    fontWeight="semibold"
                    as={Link}
                    to="/properties"
                    onClick={onClose}
                  >
                    Book Now
                  </Button>
                </VStack>
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
});

Navigation.displayName = 'Navigation';

export default Navigation; 