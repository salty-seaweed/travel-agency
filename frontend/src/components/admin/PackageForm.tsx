import React, { useState, useEffect } from 'react';
import { 
  CheckCircleIcon,
  PlusIcon,
  TrashIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  HStack,
  Box,
  Divider,
  useToast,
  Spinner,
  Flex,
  Heading,
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Badge,
  Icon,
} from '@chakra-ui/react';
import { ImageUpload } from './ImageUpload';
import { BasicInfoForm } from './package/BasicInfoForm';
import { PricingForm } from './package/PricingForm';
import { ItineraryForm } from './package/ItineraryForm';
import { ActivitiesForm } from './package/ActivitiesForm';
import { InclusionsForm } from './package/InclusionsForm';
import { AccommodationForm } from './package/AccommodationForm';
import { AdditionalInfoForm } from './package/AdditionalInfoForm';
import { apiGet, apiUpload } from '../../api';
import type { Package, Property } from '../../types';

interface PackageFormProps {
  isOpen: boolean;
  onClose: () => void;
  package?: Package;
  onSave: (packageData: Partial<Package>) => Promise<void>;
}

export function PackageForm({ isOpen, onClose, package: pkg, onSave }: PackageFormProps) {
  const [form, setForm] = useState<any>(getInitialForm(pkg));
  const [saving, setSaving] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  
  const toast = useToast();
  
  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (pkg) {
      setForm(getInitialForm(pkg));
      setActiveTab(0);
    } else {
      setForm(getInitialForm());
      setActiveTab(0);
    }
  }, [pkg]);

  function getInitialForm(pkg?: Package) {
    return pkg ? {
      // Basic Info
      name: pkg.name || '',
      description: pkg.description || '',
      detailed_description: pkg.detailed_description || '',
      category: pkg.category || '',
      difficulty_level: pkg.difficulty_level || 'easy',
      
      // Pricing
      price: pkg.price || '',
      original_price: pkg.original_price || pkg.price || '',
      discount_percentage: pkg.discount_percentage || 0,
      
      // Duration & Group
      duration: pkg.duration || 1,
      group_size: pkg.group_size || { min: 1, max: 4, recommended: 2 },
      
      // Properties & Dates
      properties: pkg.properties?.map((p: any) => p.id) || [],
      start_date: pkg.start_date || '',
      end_date: pkg.end_date || '',
      is_featured: pkg.is_featured || false,
      
      // Itinerary
      itinerary: pkg.itinerary || [],
      
      // Activities
      activities: pkg.activities || [],
      
      // Inclusions
      inclusions: pkg.inclusions || [],
      
      // Accommodation
      accommodation_type: pkg.accommodation_type || '',
      room_type: pkg.room_type || '',
      meal_plan: pkg.meal_plan || '',
      
      // Transportation
      transportation_details: pkg.transportation_details || '',
      airport_transfers: pkg.airport_transfers || false,
      
      // Additional Info
      best_time_to_visit: pkg.best_time_to_visit || '',
      weather_info: pkg.weather_info || '',
      what_to_bring: pkg.what_to_bring || [],
      important_notes: pkg.important_notes || [],
      
      // Seasonal Pricing
      seasonal_pricing: pkg.seasonal_pricing || {
        peak_season: '',
        off_peak_season: '',
        shoulder_season: ''
      },
      
      // Booking Info
      booking_terms: pkg.booking_terms || '',
      cancellation_policy: pkg.cancellation_policy || '',
      payment_terms: pkg.payment_terms || '',
      
    } : {
      // Default empty form
      name: '',
      description: '',
      detailed_description: '',
      category: '',
      difficulty_level: 'easy',
      price: '',
      original_price: '',
      discount_percentage: 0,
      duration: 1,
      group_size: { min: 1, max: 4, recommended: 2 },
      properties: [],
      start_date: '',
      end_date: '',
      is_featured: false,
      itinerary: [],
      activities: [],
      inclusions: [],
      accommodation_type: '',
      room_type: '',
      meal_plan: '',
      transportation_details: '',
      airport_transfers: false,
      best_time_to_visit: '',
      weather_info: '',
      what_to_bring: [],
      important_notes: [],
      seasonal_pricing: {
        peak_season: '',
        off_peak_season: '',
        shoulder_season: ''
      },
      booking_terms: '',
      cancellation_policy: '',
      payment_terms: '',
    };
  }
  
  const fetchData = async () => {
    try {
      setError(null);
      const propertiesData = await apiGet('/properties/');
      setProperties(propertiesData.results || propertiesData);
    } catch (error) {
      console.error('Failed to fetch properties:', error);
      setError('Failed to load properties. Please try again.');
    }
  };

  const updateForm = (updates: any) => {
    setForm((prev: any) => ({ ...prev, ...updates }));
  };

  const uploadAllImages = async () => {
    const newImages = images.filter(img => img.isNew && img.file);
    
    if (newImages.length === 0) return [];

    const uploadPromises = newImages.map(async (imageFile) => {
      const formData = new FormData();
      formData.append('image', imageFile.file);
      formData.append('caption', imageFile.name);
      
      const response = await apiUpload('/package-images/', formData);
      return response;
    });

    return Promise.all(uploadPromises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // Upload images first
      const uploadedImages = await uploadAllImages();
      
      // Prepare package data
      const packageData = {
        ...form,
        images: uploadedImages.map(img => img.id),
        existing_images: images.filter(img => !img.isNew).map(img => img.id)
      };

      await onSave(packageData);
      
      toast({
        title: 'Success',
        description: `Package ${pkg ? 'updated' : 'created'} successfully!`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      onClose();
    } catch (error) {
      console.error('Failed to save package:', error);
      setError('Failed to save package. Please try again.');
      
      toast({
        title: 'Error',
        description: 'Failed to save package. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSaving(false);
    }
  };

  const tabConfig = [
    { name: 'Basic Info', icon: '📝' },
    { name: 'Pricing', icon: '💰' },
    { name: 'Itinerary', icon: '🗓️' },
    { name: 'Activities', icon: '🎯' },
    { name: 'Inclusions', icon: '✅' },
    { name: 'Accommodation', icon: '🏨' },
    { name: 'Additional', icon: 'ℹ️' },
    { name: 'Images', icon: '📸' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl" scrollBehavior="inside">
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent maxW="6xl" mx={4}>
        <ModalHeader borderBottom="1px solid" borderColor="gray.200" pb={4}>
          <Flex alignItems="center" justify="space-between">
            <Box>
              <Heading size="lg" color="gray.800">
                {pkg ? 'Edit' : 'Add'} Package
              </Heading>
              <Text color="gray.600" mt={1}>
                Create a comprehensive travel package with detailed information
              </Text>
            </Box>
            <ModalCloseButton position="static" size="lg" />
          </Flex>
        </ModalHeader>
        
        <ModalBody p={0}>
          {error && (
            <Alert status="error" mx={6} mt={6} borderRadius="md">
              <AlertIcon />
              <Box>
                <AlertTitle>Error!</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Box>
            </Alert>
          )}
          
          <Box p={6}>
            <form onSubmit={handleSubmit}>
              <Tabs index={activeTab} onChange={setActiveTab} variant="enclosed" colorScheme="purple">
                <TabList>
                  {tabConfig.map((tab, index) => (
                    <Tab key={index} fontSize="sm" py={3}>
                      <HStack spacing={2}>
                        <Text>{tab.icon}</Text>
                        <Text>{tab.name}</Text>
                      </HStack>
                    </Tab>
                  ))}
                </TabList>
                
                <TabPanels>
                  {/* Basic Info Tab */}
                  <TabPanel>
                    <BasicInfoForm 
                      form={form} 
                      updateForm={updateForm}
                      properties={properties}
                    />
                  </TabPanel>
                  
                  {/* Pricing Tab */}
                  <TabPanel>
                    <PricingForm 
                      form={form} 
                      updateForm={updateForm}
                    />
                  </TabPanel>
                  
                  {/* Itinerary Tab */}
                  <TabPanel>
                    <ItineraryForm 
                      form={form} 
                      updateForm={updateForm}
                    />
                  </TabPanel>
                  
                  {/* Activities Tab */}
                  <TabPanel>
                    <ActivitiesForm 
                      form={form} 
                      updateForm={updateForm}
                    />
                  </TabPanel>
                  
                  {/* Inclusions Tab */}
                  <TabPanel>
                    <InclusionsForm 
                      form={form} 
                      updateForm={updateForm}
                    />
                  </TabPanel>
                  
                  {/* Accommodation Tab */}
                  <TabPanel>
                    <AccommodationForm 
                      form={form} 
                      updateForm={updateForm}
                    />
                  </TabPanel>
                  
                  {/* Additional Info Tab */}
                  <TabPanel>
                    <AdditionalInfoForm 
                      form={form} 
                      updateForm={updateForm}
                    />
                  </TabPanel>
                  
                  {/* Images Tab */}
                  <TabPanel>
                    <Box>
                      <Heading size="md" color="gray.700" mb={4}>
                        Package Images
                      </Heading>
                      <ImageUpload
                        images={images}
                        onImagesChange={setImages}
                        maxImages={12}
                        maxFileSize={5}
                        title="Package Images"
                        description="Upload images showcasing the package. The first image will be used as the featured image."
                      />
                    </Box>
                  </TabPanel>
                </TabPanels>
              </Tabs>
              
              <Divider my={8} />
              
              {/* Action Buttons */}
              <Flex justify="space-between" align="center">
                <HStack spacing={4}>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={onClose}
                    isDisabled={saving}
                  >
                    Cancel
                  </Button>
                  <Text fontSize="sm" color="gray.500">
                    Tab {activeTab + 1} of {tabConfig.length}
                  </Text>
                </HStack>
                
                <HStack spacing={4}>
                  {activeTab > 0 && (
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setActiveTab(activeTab - 1)}
                      isDisabled={saving}
                    >
                      Previous
                    </Button>
                  )}
                  
                  {activeTab < tabConfig.length - 1 && (
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setActiveTab(activeTab + 1)}
                      isDisabled={saving}
                    >
                      Next
                    </Button>
                  )}
                  
                  <Button
                    type="submit"
                    colorScheme="purple"
                    size="lg"
                    isLoading={saving}
                    loadingText="Saving..."
                    leftIcon={saving ? <Spinner size="sm" /> : <Icon as={CheckCircleIcon} h={5} w={5} />}
                  >
                    {pkg ? 'Update' : 'Create'} Package
                  </Button>
                </HStack>
              </Flex>
            </form>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
