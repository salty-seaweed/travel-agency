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
import { useTranslation } from '../i18n';
import logo from '../assets/logo.svg';
import { LanguageSwitcher } from './LanguageSwitcher';
import { CurrencySelector } from './CurrencySelector';

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
  const { t } = useTranslation();
  // const { translateNav, translateButton } = useSmartTranslation(); // TEMPORARILY DISABLED

  const navigation: NavigationItem[] = [
    { name: t('navigation.home'), href: '/', icon: HomeIcon },
    { name: t('navigation.packages'), href: '/packages', icon: StarIcon, featured: true },
    { name: t('navigation.resorts'), href: '/resorts', icon: BuildingOfficeIcon, featured: true },
    { name: t('navigation.boats'), href: '/boats', icon: SparklesIcon, featured: true },
    { name: t('navigation.transportation'), href: '/transportation', icon: SparklesIcon },
    { name: t('navigation.maldivesInfo', 'Maldives Info'), href: '/maldives-info', icon: InformationCircleIcon, featured: true },
    { name: t('navigation.about'), href: '/about', icon: InformationCircleIcon },
    // Contact removed from navigation (available in footer)
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
        backdropFilter="blur(12px)"
        borderBottom="1px solid"
        borderColor={isScrolled ? "gray.200" : "gray.100"}
        boxShadow={isScrolled ? 'md' : 'sm'}
        transition="all 0.2s ease"
        bg={isScrolled ? 'white' : 'whiteAlpha.900'}
        style={{ paddingLeft: '0', paddingRight: '45px' }}
      >
        <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }}>
          <Flex justify="space-between" align="center" h={{ base: '3.5rem', md: '4rem' }}>
            {/* Logo - Normal size with full text */}
            <Flex align="center" flexShrink={0}>
              <Link to="/">
                <Flex align="center" gap={2} _hover={{ opacity: 0.8 }} transition="all 0.2s ease">
                  <Box
                    w={{ base: '12', md: '14' }}
                    h={{ base: '12', md: '14' }}
                    borderRadius="xl"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexShrink={0}
                  >
                    <img 
                      src={logo} 
                      alt="Thread Travels Logo" 
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </Box>
                  <VStack align="start" spacing={0} display={{ base: 'none', sm: 'flex' }}>
                    <Text
                      fontSize={{ base: "xl", md: "2xl" }}
                      fontWeight="700"
                      color="gray.900"
                      lineHeight="1.1"
                      letterSpacing="-0.02em"
                    >
                      Thread Travels
                    </Text>
                    <Text
                      fontSize={{ base: "xs", md: "sm" }}
                      color="gray.600"
                      fontWeight="500"
                      lineHeight="1.2"
                      letterSpacing="0.01em"
                      textTransform="uppercase"
                    >
                      Travels & Tours Maldives
                    </Text>
                  </VStack>
                </Flex>
              </Link>
            </Flex>

            {/* Desktop Navigation - Clean, no icons */}
            <HStack spacing={1} display={{ base: 'none', lg: 'flex' }}>
              {navigation.map((item) => (
                <Link key={item.name} to={item.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    px={4}
                    py={2}
                    borderRadius="lg"
                    fontWeight="medium"
                    fontSize="sm"
                    color={isActive(item.href) ? 'sky.600' : 'gray.700'}
                    bg={isActive(item.href) ? 'sky.50' : 'transparent'}
                    _hover={{
                      bg: isActive(item.href) ? 'sky.100' : 'gray.100',
                      color: isActive(item.href) ? 'sky.700' : 'gray.900',
                    }}
                    transition="all 0.2s ease"
                    position="relative"
                    aria-label={`Navigate to ${item.name} page`}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                  >
                    <Text>{item.name}</Text>
                    {isActive(item.href) && (
                      <Box
                        position="absolute"
                        bottom="-2px"
                        left="50%"
                        transform="translateX(-50%)"
                        w="20px"
                        h="2px"
                        bg="sky.600"
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

                  {/* Currency Selector */}
                  <CurrencySelector size="sm" variant="outline" showLabel={false} />

                  {/* Language Switcher */}
                  <LanguageSwitcher 
                    variant="dropdown" 
                    showLabels={true}
                    className="hidden md:flex"
                  />
                </HStack>
              ) : (
                <HStack spacing={3} ml={4} display={{ base: 'none', md: 'flex' }}>
                  {/* Currency Selector */}
                  <CurrencySelector size="sm" variant="outline" showLabel={false} />

                  {/* Language Switcher */}
                  <LanguageSwitcher 
                    variant="dropdown" 
                    showLabels={true}
                    className="hidden md:flex"
                  />

                  {/* Book Now Button - Simplified */}
                  <Button
                    bgGradient="linear(to-r, sky.500, blue.500)"
                    color="white"
                    size="sm"
                    px={6}
                    py={2}
                    borderRadius="lg"
                    fontWeight="medium"
                    fontSize="sm"
                    as={Link}
                    to="/packages"
                    _hover={{
                      bgGradient: 'linear(to-r, sky.600, blue.600)',
                      transform: 'translateY(-1px)',
                      boxShadow: 'md',
                    }}
                    transition="all 0.2s ease"
                    aria-label="Browse and book travel packages"
                  >
                    {t('ui.buttons.bookNow')}
                  </Button>
                </HStack>
              )}
              
              {/* Mobile language switcher removed as requested */}

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
                borderRadius="xl"
                display="flex"
                alignItems="center"
                justifyContent="center"
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
                  fontWeight="700" 
                  color="gray.900"
                  lineHeight="1.1"
                  letterSpacing="-0.02em"
                >
                  Thread Travels
                </Text>
                <Text 
                  fontSize="xs" 
                  color="gray.600" 
                  fontWeight="500"
                  letterSpacing="0.01em"
                  textTransform="uppercase"
                  lineHeight="1.2"
                >
                  Travels & Tours Maldives
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
                    variant="ghost"
                    size="lg"
                    w="full"
                    justifyContent="flex-start"
                    px={6}
                    py={4}
                    borderRadius="xl"
                    fontWeight="semibold"
                    fontSize="md"
                    color={isActive(item.href) ? 'sky.700' : 'gray.700'}
                    bg={isActive(item.href) ? 'sky.50' : 'transparent'}
                    _hover={{
                      bg: isActive(item.href) ? 'sky.100' : 'gray.100',
                    }}
                    transition="all 0.2s ease"
                    aria-label={`Navigate to ${item.name} page`}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                  >
                    <Text>{item.name}</Text>
                  </Button>
                </Link>
              ))}

              <Divider my={6} />

              {/* Mobile Language Switcher */}
              <VStack spacing={4} align="stretch">
                <Text fontSize="lg" fontWeight="semibold" color="gray.700" px={2}>
                  Currency
                </Text>
                <Box px={2}>
                  <CurrencySelector size="md" variant="outline" showLabel={true} />
                </Box>

                <Text fontSize="lg" fontWeight="semibold" color="gray.700" px={2}>
                  Language
                </Text>
                <Box px={2}>
                  <LanguageSwitcher 
                    variant="buttons" 
                    showLabels={true}
                    className="w-full"
                  />
                </Box>
              </VStack>

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
                    bgGradient="linear(to-r, sky.500, blue.500)"
                    _hover={{
                      bgGradient: 'linear(to-r, sky.600, blue.600)',
                    }}
                    color="white"
                    size="lg"
                    w="full"
                    px={6}
                    py={4}
                    borderRadius="xl"
                    fontWeight="semibold"
                    as={Link}
                    to="/packages"
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