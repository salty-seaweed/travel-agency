import React, { useState } from 'react';
import {
  Box,
  Container,
  Flex,
  VStack,
  HStack,
  Text,
  Heading,
  Icon,
  Card,
  CardBody,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
} from '@chakra-ui/react';
import { AdminAmenities } from './settings/AdminAmenities';
import { AdminPropertyTypes } from './settings/AdminPropertyTypes';
import { AdminLocations } from './settings/AdminLocations';
import { AdminContactSettings } from './settings/AdminContactSettings';
import {
  WrenchScrewdriverIcon,
  SparklesIcon,
  HomeIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';

export function AdminSettings() {
  const [activeTab, setActiveTab] = useState<'amenities' | 'types' | 'locations' | 'contact'>('amenities');

  // Color mode values
  const bg = useColorModeValue('white', 'gray.800');
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.400');

  const tabs = [
    { id: 'amenities', name: 'Amenities', icon: SparklesIcon, color: 'purple' },
    { id: 'types', name: 'Property Types', icon: HomeIcon, color: 'blue' },
    { id: 'locations', name: 'Locations', icon: MapPinIcon, color: 'emerald' },
    { id: 'contact', name: 'Contact', icon: WrenchScrewdriverIcon, color: 'pink' },
  ];

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Header */}
      <Box bg={bg} borderBottom="1px solid" borderColor={borderColor} py={6} mb={8}>
        <Container maxW="7xl">
          <HStack spacing={4}>
            <Box
              w={12}
              h={12}
              bgGradient="linear(to-br, purple.500, indigo.600)"
              borderRadius="xl"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Icon as={WrenchScrewdriverIcon} h={6} w={6} color="white" />
            </Box>
            <VStack align="start" spacing={1}>
              <Heading size="lg" color={textColor}>
                Settings
              </Heading>
              <Text color={mutedTextColor}>
                Manage amenities, property types, and locations
              </Text>
            </VStack>
          </HStack>
        </Container>
      </Box>

      <Container maxW="7xl">
        <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
          <Tabs variant="enclosed" onChange={(index) => {
            const tabIds = ['amenities', 'types', 'locations', 'contact'];
            setActiveTab(tabIds[index] as any);
          }} defaultIndex={0}>
            <TabList borderBottom="1px solid" borderColor={borderColor}>
              {tabs.map((tab) => (
                <Tab
                  key={tab.id}
                  _selected={{
                    color: `${tab.color}.600`,
                    borderColor: `${tab.color}.500`,
                    bg: `${tab.color}.50`,
                  }}
                  _hover={{
                    color: `${tab.color}.600`,
                  }}
                >
                  <HStack spacing={2}>
                    <Icon as={tab.icon} h={4} w={4} />
                    <Text>{tab.name}</Text>
                  </HStack>
                </Tab>
              ))}
            </TabList>

            <TabPanels>
              <TabPanel p={6}>
                <AdminAmenities />
              </TabPanel>
              <TabPanel p={6}>
                <AdminPropertyTypes />
              </TabPanel>
              <TabPanel p={6}>
                <AdminLocations />
              </TabPanel>
              <TabPanel p={6}>
                <AdminContactSettings />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Card>
      </Container>
    </Box>
  );
} 