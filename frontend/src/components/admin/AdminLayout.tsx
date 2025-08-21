import React, { useState, useEffect, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks';
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Icon,
  IconButton,
  Button,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Divider,
  Badge,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useColorModeValue,
  Container,
} from '@chakra-ui/react';
import {
  HomeIcon,
  BuildingOffice2Icon,
  GiftIcon,
  StarIcon,
  WrenchScrewdriverIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowLeftOnRectangleIcon,
  BellIcon,
  UserCircleIcon,
  CogIcon,
  DocumentTextIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const adminNav = [
  { name: 'Dashboard', href: '/dashboard/overview', icon: HomeIcon, description: 'Overview and analytics' },
  { name: 'Properties', href: '/dashboard/properties', icon: BuildingOffice2Icon, description: 'Manage properties' },
  { name: 'Packages', href: '/dashboard/packages', icon: GiftIcon, description: 'Manage packages' },
  { name: 'Destinations', href: '/dashboard/destinations', icon: SparklesIcon, description: 'Manage destinations' },
  { name: 'Experiences', href: '/dashboard/experiences', icon: SparklesIcon, description: 'Manage experiences' },
  { name: 'Reviews', href: '/dashboard/reviews', icon: StarIcon, description: 'Customer reviews' },
  { name: 'Transportation', href: '/dashboard/transportation', icon: SparklesIcon, description: 'Manage transportation' },
  { name: 'Content Management', href: '/dashboard/content', icon: DocumentTextIcon, description: 'Create and manage pages' },
  { name: 'Settings', href: '/dashboard/settings', icon: WrenchScrewdriverIcon, description: 'Amenities & locations' },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const currentPath = window.location.pathname;
  const { logout } = useAuth();
  
  // Color mode values
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const sidebarBg = useColorModeValue('white', 'gray.900');
  const activeBg = useColorModeValue('blue.50', 'blue.900');
  const activeColor = useColorModeValue('blue.700', 'blue.200');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  
  // Session monitoring
  useEffect(() => {
    const checkSession = () => {
      // This will be handled by the ProtectedRoute component
    };

    // Check session every 30 seconds
    const interval = setInterval(checkSession, 30000);
    
    // Check on window focus
    const handleFocus = () => checkSession();
    window.addEventListener('focus', handleFocus);
    
    // Check on visibility change
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkSession();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
  
  const handleLogout = () => {
    logout();
  };

  const NavItem = ({ item }: { item: typeof adminNav[0] }) => {
    const isActive = currentPath === item.href;
    return (
      <Box
        as="a"
        href={item.href}
        display="flex"
        alignItems="center"
        px={4}
        py={3}
        borderRadius="xl"
        transition="all 0.2s"
        bg={isActive ? activeBg : 'transparent'}
        color={isActive ? activeColor : textColor}
        border={isActive ? '1px solid' : '1px solid transparent'}
        borderColor={isActive ? 'blue.200' : 'transparent'}
        _hover={{
          bg: isActive ? activeBg : hoverBg,
          textDecoration: 'none',
        }}
        _active={{
          transform: 'scale(0.98)',
        }}
      >
        <Icon
          as={item.icon}
          mr={3}
          h={5}
          w={5}
          color={isActive ? 'blue.500' : 'gray.400'}
        />
        <Box>
          <Text fontWeight="semibold" fontSize="sm">{item.name}</Text>
          <Text fontSize="xs" color="gray.500">{item.description}</Text>
        </Box>
      </Box>
    );
  };

  return (
    <Flex minH="100vh" bg="gray.50">
      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">
        <DrawerOverlay />
        <DrawerContent bg={sidebarBg} borderRight="1px solid" borderColor={borderColor}>
          <DrawerCloseButton />
          <DrawerHeader borderBottom="1px solid" borderColor={borderColor}>
            <Flex alignItems="center">
              <Box
                w={10}
                h={10}
                bgGradient="linear(to-br, blue.500, indigo.600)"
                borderRadius="xl"
                display="flex"
                alignItems="center"
                justifyContent="center"
                mr={3}
              >
                <Icon as={BuildingOffice2Icon} h={6} w={6} color="white" />
              </Box>
              <Box>
                <Text fontSize="lg" fontWeight="bold" color={textColor}>Maldives Admin</Text>
                <Text fontSize="xs" color="gray.500">Travel Agency</Text>
              </Box>
            </Flex>
          </DrawerHeader>
          
          <DrawerBody p={0}>
            <VStack spacing={2} p={3} align="stretch">
              {adminNav.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </VStack>
            
            <Divider my={4} />
            
            <Box p={4}>
              <Flex alignItems="center" mb={3}>
                <Avatar size="sm" name="Admin User" bg="gray.400" />
                <Box ml={3}>
                  <Text fontSize="sm" fontWeight="medium" color={textColor}>Admin User</Text>
                  <Text fontSize="xs" color="gray.500">admin@threadtravels.mv</Text>
                </Box>
              </Flex>
              <Button
                leftIcon={<Icon as={ArrowLeftOnRectangleIcon} h={5} w={5} />}
                variant="ghost"
                size="sm"
                w="full"
                onClick={handleLogout}
                colorScheme="gray"
              >
                Sign out
              </Button>
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Desktop Sidebar */}
      <Box
        display={{ base: 'none', lg: 'block' }}
        w={72}
        bg={sidebarBg}
        borderRight="1px solid"
        borderColor={borderColor}
        shadow="lg"
      >
        <VStack h="full" spacing={0}>
          {/* Header */}
          <Flex
            alignItems="center"
            h={16}
            px={6}
            borderBottom="1px solid"
            borderColor={borderColor}
            w="full"
          >
            <Box
              w={10}
              h={10}
              bgGradient="linear(to-br, blue.500, indigo.600)"
              borderRadius="xl"
              display="flex"
              alignItems="center"
              justifyContent="center"
              mr={3}
            >
              <Icon as={BuildingOffice2Icon} h={6} w={6} color="white" />
            </Box>
            <Box>
              <Text fontSize="lg" fontWeight="bold" color={textColor}>Maldives Admin</Text>
              <Text fontSize="xs" color="gray.500">Travel Agency</Text>
            </Box>
          </Flex>
          
          {/* Navigation */}
          <VStack spacing={2} p={3} align="stretch" flex={1} w="full">
            {adminNav.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </VStack>
          
          {/* User Menu */}
          <Box
            borderTop="1px solid"
            borderColor={borderColor}
            p={4}
            w="full"
          >
            <Flex alignItems="center" justify="space-between">
              <Flex alignItems="center">
                <Avatar size="sm" name="Admin User" bg="gray.400" />
                <Box ml={3}>
                  <Text fontSize="sm" fontWeight="medium" color={textColor}>Admin User</Text>
                  <Text fontSize="xs" color="gray.500">admin@threadtravels.mv</Text>
                </Box>
              </Flex>
              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={<Icon as={ArrowLeftOnRectangleIcon} h={5} w={5} />}
                  variant="ghost"
                  size="sm"
                  colorScheme="gray"
                  onClick={handleLogout}
                />
              </Menu>
            </Flex>
          </Box>
        </VStack>
      </Box>

      {/* Main Content */}
      <Flex flex={1} direction="column" minH="100vh">
        {/* Top Navigation */}
        <Box
          position="sticky"
          top={0}
          zIndex={40}
          h={16}
          bg={bg}
          borderBottom="1px solid"
          borderColor={borderColor}
          shadow="sm"
          px={{ base: 4, sm: 6, lg: 8 }}
        >
          <Flex h="full" alignItems="center" justify="space-between">
            <HStack spacing={4}>
              <IconButton
                display={{ base: 'flex', lg: 'none' }}
                icon={<Icon as={Bars3Icon} h={6} w={6} />}
                variant="ghost"
                onClick={onOpen}
                aria-label="Open sidebar"
              />
              <Divider orientation="vertical" h={6} display={{ base: 'block', lg: 'none' }} />
            </HStack>
            
            <HStack spacing={4}>
              <IconButton
                icon={<Icon as={BellIcon} h={6} w={6} />}
                variant="ghost"
                colorScheme="gray"
                aria-label="View notifications"
              />
              <Divider orientation="vertical" h={6} display={{ base: 'none', lg: 'block' }} />
              
              <Menu>
                <MenuButton
                  as={Button}
                  variant="ghost"
                  rightIcon={<Icon as={UserCircleIcon} h={5} w={5} />}
                  colorScheme="gray"
                >
                  <Flex alignItems="center">
                    <Avatar size="sm" name="Admin User" bg="gray.400" mr={3} />
                    <Box textAlign="left">
                      <Text fontSize="sm" fontWeight="medium" color={textColor}>Admin User</Text>
                      <Text fontSize="xs" color="gray.500">admin@threadtravels.mv</Text>
                    </Box>
                  </Flex>
                </MenuButton>
                <MenuList>
                  <MenuItem icon={<Icon as={UserCircleIcon} h={4} w={4} />}>
                    Profile
                  </MenuItem>
                  <MenuItem icon={<Icon as={CogIcon} h={4} w={4} />}>
                    Settings
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem icon={<Icon as={ArrowLeftOnRectangleIcon} h={4} w={4} />} onClick={handleLogout}>
                    Sign out
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </Flex>
        </Box>

        {/* Page Content */}
        <Box flex={1} bg="gray.50" as="main">
          <Container maxW="full" py={8}>
            {children}
          </Container>
        </Box>
      </Flex>
    </Flex>
  );
} 