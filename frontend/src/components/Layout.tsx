import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCustomerAuth } from '../hooks/useCustomerAuth';
import { GlobalSearch } from './GlobalSearch';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useTranslation } from '../i18n';
import logo from '../assets/logo.svg';
import { 
  Bars3Icon, 
  XMarkIcon, 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  UserIcon,
  MagnifyingGlassIcon,
  HomeIcon,
  StarIcon,
  BuildingOfficeIcon,
  MapIcon,
  InformationCircleIcon,
  ChatBubbleLeftRightIcon,
  SparklesIcon,
  HeartIcon,
  BellIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import {
  Box,
  Flex,
  HStack,
  VStack,
  Text,
  Button,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Badge,
  Icon,
  useColorModeValue,
  Container,
  Avatar,
  Divider,
  Link as ChakraLink,
  Grid,
  GridItem,
} from '@chakra-ui/react';

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, customerData, logout } = useCustomerAuth();
  const { t } = useTranslation();

  const navigation = [
    { name: t('navigation.home'), href: '/', icon: HomeIcon },
    { name: t('navigation.packages'), href: '/packages', icon: StarIcon, featured: true },
    { name: t('navigation.properties'), href: '/properties', icon: BuildingOfficeIcon },
    { name: 'Map', href: '/map', icon: MapIcon },
    { name: t('navigation.about'), href: '/about', icon: InformationCircleIcon },
    { name: t('navigation.contact'), href: '/contact', icon: ChatBubbleLeftRightIcon },
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

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bgGradient="linear(to-br, gray.50, blue.50, indigo.100)">
      {/* Enhanced Navigation Bar - Chakra UI */}
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
      >
        <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }}>
          <Flex justify="space-between" align="center" h="20">
            {/* Enhanced Logo */}
            <Flex align="center" flexShrink={0}>
              <Link to="/">
                <Flex align="center" _hover={{ transform: 'scale(1.05)' }} transition="all 0.3s ease">
                  <Box
                    w="12"
                    h="12"
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
                  <VStack align="start" ml={3} spacing={0}>
                    <Text
                      fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
                      fontWeight="bold"
                      bgGradient="linear(to-r, gray.900, blue.600)"
                      bgClip="text"
                      _hover={{
                        bgGradient: 'linear(to-r, blue.600, indigo.600)',
                      }}
                      transition="all 0.5s ease"
                      lineHeight="1"
                    >
                      Thread Travels
                    </Text>
                    <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600" fontWeight="medium" _hover={{ color: 'blue.600' }} transition="colors 0.3s ease" lineHeight="1">
                      Maldives Paradise
                    </Text>
                  </VStack>
                </Flex>
              </Link>
            </Flex>

            {/* Desktop Navigation - Chakra UI */}
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
                    fontWeight="semibold"
                    fontSize="sm"
                    bg={item.featured ? 'orange.500' : isActive(item.href) ? 'blue.50' : 'transparent'}
                    color={item.featured ? 'white' : isActive(item.href) ? 'blue.700' : 'gray.700'}
                    border={isActive(item.href) ? '2px solid' : 'none'}
                    borderColor={isActive(item.href) ? 'blue.200' : undefined}
                    _hover={{
                      transform: 'scale(1.05)',
                      boxShadow: 'md',
                      bg: item.featured ? 'orange.600' : isActive(item.href) ? 'blue.100' : 'gray.100',
                    }}
                    transition="all 0.3s ease"
                    position="relative"
                  >
                    {item.featured && (
                      <Box
                        position="absolute"
                        top="-2"
                        right="-2"
                        w="4"
                        h="4"
                        bg="red.500"
                        borderRadius="full"
                        animation="pulse 2s infinite"
                        boxShadow="lg"
                      />
                    )}
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
              
              {/* Search Button */}
              <IconButton
                aria-label="Search"
                icon={<Icon as={MagnifyingGlassIcon} h="5" w="5" />}
                variant="ghost"
                size="md"
                borderRadius="2xl"
                onClick={() => setIsSearchOpen(true)}
                _hover={{
                  transform: 'scale(1.05)',
                  boxShadow: 'md',
                }}
                transition="all 0.3s ease"
              />
              
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
                        <Text>{customerData?.user?.first_name || 'User'}</Text>
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
                <HStack spacing={3} ml={4}>
                  <Button
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
                    {t('navigation.login')}
                  </Button>
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
                    boxShadow="lg"
                    _hover={{
                      transform: 'scale(1.05)',
                      boxShadow: 'xl',
                    }}
                    transition="all 0.3s ease"
                  >
                    {t('common.book')} Now
                  </Button>
                </HStack>
              )}
            </HStack>

            {/* Mobile menu button */}
            <HStack spacing={3} display={{ base: 'flex', lg: 'none' }}>
              <IconButton
                aria-label="Search"
                icon={<Icon as={MagnifyingGlassIcon} h="5" w="5" />}
                variant="ghost"
                size="md"
                borderRadius="2xl"
                onClick={() => setIsSearchOpen(true)}
                _hover={{
                  transform: 'scale(1.05)',
                  boxShadow: 'md',
                }}
                transition="all 0.3s ease"
              />
              <IconButton
                aria-label="Toggle mobile menu"
                icon={<Icon as={isOpen ? XMarkIcon : Bars3Icon} h="6" w="6" />}
                variant="ghost"
                size="md"
                borderRadius="2xl"
                onClick={onOpen}
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
        <DrawerContent bg="white" borderRadius="2xl">
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px" borderColor={borderColor}>
            <Flex align="center">
              <Box
                w="12"
                h="12"
                borderRadius="2xl"
                display="flex"
                alignItems="center"
                justifyContent="center"
                boxShadow="lg"
                overflow="hidden"
              >
                <img 
                  src={logo} 
                  alt="Thread Travels Logo" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }}
                />
              </Box>
              <VStack align="start" ml={4} spacing={0}>
                <Text fontSize="2xl" fontWeight="bold" bgGradient="linear(to-r, gray.900, blue.600)" bgClip="text">
                  Thread Travels
                </Text>
                <Text fontSize="sm" color="gray.600" fontWeight="medium">
                  Maldives Paradise
                </Text>
              </VStack>
            </Flex>
          </DrawerHeader>

          <DrawerBody py={6}>
            <VStack spacing={2} align="stretch">
              {navigation.map((item) => (
                <Button
                  key={item.name}
                  variant={isActive(item.href) ? 'outline' : 'ghost'}
                  colorScheme={isActive(item.href) ? 'blue' : 'gray'}
                  size="lg"
                  px={6}
                  py={4}
                  borderRadius="2xl"
                  fontWeight="semibold"
                  fontSize="base"
                  as={Link}
                  to={item.href}
                  onClick={onClose}
                  justifyContent="flex-start"
                  _hover={{
                    transform: 'scale(1.02)',
                    boxShadow: 'md',
                  }}
                  transition="all 0.3s ease"
                >
                  <HStack spacing={4} w="full">
                    <Icon as={item.icon} h="5" w="5" flexShrink={0} />
                    <Text>{item.name}</Text>
                    {item.featured && (
                      <Badge
                        ml="auto"
                        colorScheme="orange"
                        variant="solid"
                        fontSize="xs"
                        px={3}
                        py={1}
                        borderRadius="full"
                        animation="pulse 2s infinite"
                      >
                        Popular
                      </Badge>
                    )}
                  </HStack>
                </Button>
              ))}
              
              <Divider my={4} />
              
              {isAuthenticated ? (
                <VStack spacing={2} align="stretch">
                  <Button
                    variant="ghost"
                    size="lg"
                    px={6}
                    py={4}
                    borderRadius="2xl"
                    fontWeight="semibold"
                    fontSize="base"
                    as={Link}
                    to="/dashboard"
                    onClick={onClose}
                    justifyContent="flex-start"
                    _hover={{
                      transform: 'scale(1.02)',
                      boxShadow: 'md',
                    }}
                    transition="all 0.3s ease"
                  >
                    <HStack spacing={4}>
                      <Icon as={UserIcon} h="5" w="5" />
                      <Text>Dashboard</Text>
                    </HStack>
                  </Button>
                  <Button
                    variant="ghost"
                    size="lg"
                    px={6}
                    py={4}
                    borderRadius="2xl"
                    fontWeight="semibold"
                    fontSize="base"
                    onClick={() => {
                      handleLogout();
                      onClose();
                    }}
                    justifyContent="flex-start"
                    color="red.600"
                    _hover={{
                      transform: 'scale(1.02)',
                      boxShadow: 'md',
                      bg: 'red.50',
                    }}
                    transition="all 0.3s ease"
                  >
                    <HStack spacing={4}>
                      <Text fontSize="lg">🚪</Text>
                      <Text>Logout</Text>
                    </HStack>
                  </Button>
                </VStack>
              ) : (
                <VStack spacing={2} align="stretch">
                  <Button
                    variant="ghost"
                    size="lg"
                    px={6}
                    py={4}
                    borderRadius="2xl"
                    fontWeight="semibold"
                    fontSize="base"
                    as={Link}
                    to="/login"
                    onClick={onClose}
                    justifyContent="flex-start"
                    _hover={{
                      transform: 'scale(1.02)',
                      boxShadow: 'md',
                    }}
                    transition="all 0.3s ease"
                  >
                    <HStack spacing={4}>
                      <Text fontSize="lg">🔑</Text>
                      <Text>{t('navigation.login')}</Text>
                    </HStack>
                  </Button>
                  <Button
                    bgGradient="linear(to-r, blue.600, indigo.600)"
                    _hover={{
                      bgGradient: 'linear(to-r, blue.700, indigo.700)',
                    }}
                    color="white"
                    size="lg"
                    px={8}
                    py={4}
                    borderRadius="2xl"
                    fontWeight="semibold"
                    fontSize="base"
                    as={Link}
                    to="/properties"
                    onClick={onClose}
                    boxShadow="lg"
                    _hover={{
                      transform: 'scale(1.02)',
                      boxShadow: 'xl',
                    }}
                    transition="all 0.3s ease"
                  >
                    <HStack spacing={3}>
                      <Text fontSize="lg">🎯</Text>
                      <Text>{t('common.book')} Now</Text>
                    </HStack>
                  </Button>
                </VStack>
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Main Content */}
      <Box as="main" flex="1">
        {children}
      </Box>

      {/* Enhanced Footer */}
      <Box as="footer" bg="gray.900" color="white" position="relative" overflow="hidden">
        {/* Background Elements */}
        <Box position="absolute" inset={0}>
          <Box
            position="absolute"
            top="20"
            left="20"
            w="40"
            h="40"
            bg="blue.500"
            opacity="0.1"
            borderRadius="full"
            filter="blur(3xl)"
            animation="pulse 4s infinite"
          />
          <Box
            position="absolute"
            bottom="20"
            right="20"
            w="60"
            h="60"
            bg="yellow.400"
            opacity="0.1"
            borderRadius="full"
            filter="blur(3xl)"
            animation="pulse 4s infinite"
          />
          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            w="80"
            h="80"
            bg="purple.500"
            opacity="0.05"
            borderRadius="full"
            filter="blur(3xl)"
          />
        </Box>
        
        <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }} py={20} position="relative" zIndex={10}>
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={12}>
            <GridItem colSpan={{ base: 1, lg: 2 }}>
              <Flex align="center" mb={8}>
                <Box
                  w="16"
                  h="16"
                  bgGradient="linear(to-br, blue.600, indigo.600, purple.600)"
                  borderRadius="3xl"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  mr={4}
                  boxShadow="xl"
                >
                  <Icon as={SparklesIcon} h="8" w="8" color="white" />
                </Box>
                <VStack align="start" spacing={0}>
                  <Text
                    fontSize="3xl"
                    fontWeight="bold"
                    bgGradient="linear(to-r, white, blue.200)"
                    bgClip="text"
                  >
                    Thread Travels & Tours
                  </Text>
                  <Text color="blue.200" fontSize="lg" fontWeight="medium">
                    Your Gateway to Paradise
                  </Text>
                </VStack>
              </Flex>
              <Text color="blue.100" mb={8} lineHeight="relaxed" fontSize="lg">
                We connect you with the most authentic and luxurious Maldives experiences. 
                From pristine beaches to crystal-clear waters, let us create your perfect paradise getaway.
              </Text>
              <VStack spacing={6} align="stretch">
                <ChakraLink
                  href="https://wa.me/9601234567"
                  color="blue.200"
                  _hover={{ color: 'white' }}
                  transition="all 0.3s ease"
                  _hover={{ transform: 'scale(1.05)' }}
                >
                  <HStack spacing={3}>
                    <Text fontSize="2xl">📱</Text>
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="semibold" fontSize="base">WhatsApp</Text>
                      <Text fontSize="sm" color="blue.300">+960 123 4567</Text>
                    </VStack>
                  </HStack>
                </ChakraLink>
                <ChakraLink
                  href="tel:+9601234567"
                  color="blue.200"
                  _hover={{ color: 'white' }}
                  transition="all 0.3s ease"
                  _hover={{ transform: 'scale(1.05)' }}
                >
                  <HStack spacing={3}>
                    <Text fontSize="2xl">📞</Text>
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="semibold" fontSize="base">Call Us</Text>
                      <Text fontSize="sm" color="blue.300">+960 123 4567</Text>
                    </VStack>
                  </HStack>
                </ChakraLink>
                <ChakraLink
                  href="mailto:info@threadtravels.mv"
                  color="blue.200"
                  _hover={{ color: 'white' }}
                  transition="all 0.3s ease"
                  _hover={{ transform: 'scale(1.05)' }}
                >
                  <HStack spacing={3}>
                    <Text fontSize="2xl">✉️</Text>
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="semibold" fontSize="base">Email</Text>
                      <Text fontSize="sm" color="blue.300">info@threadtravels.mv</Text>
                    </VStack>
                  </HStack>
                </ChakraLink>
              </VStack>
            </GridItem>
            
            <GridItem>
              <Text fontSize="xl" fontWeight="bold" mb={6} bgGradient="linear(to-r, white, blue.200)" bgClip="text">
                Quick Links
              </Text>
              <VStack spacing={4} align="start">
                <ChakraLink
                  as={Link}
                  to="/properties"
                  color="blue.200"
                  _hover={{ color: 'white' }}
                  transition="all 0.3s ease"
                  _hover={{ transform: 'scale(1.05)' }}
                  fontSize="base"
                >
                  <HStack spacing={3}>
                    <Text>🏠</Text>
                    <Text>Properties</Text>
                  </HStack>
                </ChakraLink>
                <ChakraLink
                  as={Link}
                  to="/packages"
                  color="blue.200"
                  _hover={{ color: 'white' }}
                  transition="all 0.3s ease"
                  _hover={{ transform: 'scale(1.05)' }}
                  fontSize="base"
                >
                  <HStack spacing={3}>
                    <Text>🌟</Text>
                    <Text>Travel Packages</Text>
                  </HStack>
                </ChakraLink>
                <ChakraLink
                  as={Link}
                  to="/map"
                  color="blue.200"
                  _hover={{ color: 'white' }}
                  transition="all 0.3s ease"
                  _hover={{ transform: 'scale(1.05)' }}
                  fontSize="base"
                >
                  <HStack spacing={3}>
                    <Text>🗺️</Text>
                    <Text>Interactive Map</Text>
                  </HStack>
                </ChakraLink>
                <ChakraLink
                  as={Link}
                  to="/about"
                  color="blue.200"
                  _hover={{ color: 'white' }}
                  transition="all 0.3s ease"
                  _hover={{ transform: 'scale(1.05)' }}
                  fontSize="base"
                >
                  <HStack spacing={3}>
                    <Text>ℹ️</Text>
                    <Text>About Us</Text>
                  </HStack>
                </ChakraLink>
                <ChakraLink
                  as={Link}
                  to="/contact"
                  color="blue.200"
                  _hover={{ color: 'white' }}
                  transition="all 0.3s ease"
                  _hover={{ transform: 'scale(1.05)' }}
                  fontSize="base"
                >
                  <HStack spacing={3}>
                    <Text>📞</Text>
                    <Text>Contact</Text>
                  </HStack>
                </ChakraLink>
              </VStack>
            </GridItem>
            
            <GridItem>
              <Text fontSize="xl" fontWeight="bold" mb={6} bgGradient="linear(to-r, white, blue.200)" bgClip="text">
                Support
              </Text>
              <VStack spacing={4} align="start">
                <ChakraLink
                  as={Link}
                  to="/faq"
                  color="blue.200"
                  _hover={{ color: 'white' }}
                  transition="all 0.3s ease"
                  _hover={{ transform: 'scale(1.05)' }}
                  fontSize="base"
                >
                  <HStack spacing={3}>
                    <Text>❓</Text>
                    <Text>FAQ</Text>
                  </HStack>
                </ChakraLink>
                <ChakraLink
                  as={Link}
                  to="/contact"
                  color="blue.200"
                  _hover={{ color: 'white' }}
                  transition="all 0.3s ease"
                  _hover={{ transform: 'scale(1.05)' }}
                  fontSize="base"
                >
                  <HStack spacing={3}>
                    <Text>🆘</Text>
                    <Text>24/7 Support</Text>
                  </HStack>
                </ChakraLink>
                <ChakraLink
                  href="https://wa.me/9601234567"
                  color="blue.200"
                  _hover={{ color: 'white' }}
                  transition="all 0.3s ease"
                  _hover={{ transform: 'scale(1.05)' }}
                  fontSize="base"
                >
                  <HStack spacing={3}>
                    <Text>💬</Text>
                    <Text>WhatsApp Chat</Text>
                  </HStack>
                </ChakraLink>
                <ChakraLink
                  as={Link}
                  to="/dashboard"
                  color="blue.200"
                  _hover={{ color: 'white' }}
                  transition="all 0.3s ease"
                  _hover={{ transform: 'scale(1.05)' }}
                  fontSize="base"
                >
                  <HStack spacing={3}>
                    <Text>👤</Text>
                    <Text>Customer Dashboard</Text>
                  </HStack>
                </ChakraLink>
              </VStack>
            </GridItem>
          </Grid>
          
          <Divider borderColor="blue.800" mt={12} mb={8} />
          <Text textAlign="center" color="blue.300" fontSize="sm">
            © 2024 Thread Travels & Tours. All rights reserved. | 
            <ChakraLink
              href="https://g.page/thread-travels-maldives/review"
              target="_blank"
              rel="noopener noreferrer"
              color="yellow.400"
              _hover={{ color: 'yellow.300' }}
              ml={2}
              transition="colors 0.3s ease"
            >
              Leave us a review on Google
            </ChakraLink>
          </Text>
        </Container>
      </Box>

      {/* Global Search Modal */}
      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </Box>
  );
}

export default Layout; 