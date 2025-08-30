import React, { useState, useEffect } from 'react';
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
  Text,
  Box,
  Heading,
  Divider,
  Flex,
  useToast,
  Spinner,
  Badge,
  Icon,
} from '@chakra-ui/react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import ImageUpload from './package/ImageUpload';
import { BasicInfoForm } from './package/BasicInfoForm';
import { PricingForm } from './package/PricingForm';
import { DestinationsForm } from './package/DestinationsForm';
import { ItineraryForm } from './package/ItineraryForm';
import { ActivitiesForm } from './package/ActivitiesForm';
import { ExperiencePicker } from './package/ExperiencePicker';
import { InclusionsForm } from './package/InclusionsForm';
import { AccommodationForm } from './package/AccommodationForm';
import { AdditionalInfoForm } from './package/AdditionalInfoForm';
import { apiGet } from '../../api';
import type { Package } from '../../types';

interface PackageFormProps {
  isOpen: boolean;
  onClose: () => void;
  package?: Package;
  onSave: (packageData: Partial<Package>) => Promise<void>;
  onPackageSaved?: () => void;
}

export function PackageForm({ isOpen, onClose, package: pkg, onSave, onPackageSaved }: PackageFormProps) {
  const [form, setForm] = useState<any>(getInitialForm(pkg));
  const [saving, setSaving] = useState(false);
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
      setImages(pkg.images || []);
      setActiveTab(0);
    } else {
      setForm(getInitialForm());
      setImages([]);
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
      discount_percentage: (pkg as any).discount_percentage || 0,
      
      // Duration & Group
      duration: pkg.duration || 1,
      group_size: {
        min: (pkg as any).group_size_min || 1,
        max: (pkg as any).group_size_max || 4,
        recommended: (pkg as any).group_size_recommended || 2
      },
      
      // Dates
      start_date: pkg.start_date || '',
      end_date: pkg.end_date || '',
      is_featured: pkg.is_featured || false,
      
      // Package Highlights
      highlights: pkg.highlights || '',
      
      // Destinations - transform from backend format to frontend format
      destinations: pkg.destinations?.map((dest: any) => ({
        destination: dest.location || dest.destination || dest.destination_obj, // Backend returns 'location' object
        duration: dest.duration || 1,
        description: dest.description || '',
        highlights: Array.isArray(dest.highlights) ? dest.highlights : [],
        activities: Array.isArray(dest.activities) ? dest.activities : []
      })) || [],
      
      // Itinerary
      itinerary: pkg.itinerary || [],
      
      // Activities
      activities: pkg.activities || [],
      
      // Experiences
      experiences: (pkg as any).experiences || [],
      
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
      seasonal_pricing: {
        peak_season: (pkg as any).seasonal_pricing_peak || '',
        off_peak_season: (pkg as any).seasonal_pricing_off_peak || '',
        shoulder_season: (pkg as any).seasonal_pricing_shoulder || ''
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

      start_date: '',
      end_date: '',
      is_featured: false,
      highlights: '',
      destinations: [],
      itinerary: [],
      activities: [],
      experiences: [],
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
      // No properties to fetch - package-focused approach
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setError('Failed to load data. Please try again.');
    }
  };

  const updateForm = (updates: any) => {
    setForm((prev: any) => ({ ...prev, ...updates }));
  };

  const isFormValid = () => {
    const validations = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: form.price && parseFloat(form.price) > 0,
      duration: form.duration > 0,
      groupSize: form.group_size.min > 0 && form.group_size.max >= form.group_size.min,
      destinations: form.destinations.length > 0,
      experiencesOrActivities: (form.experiences?.length > 0 || form.activities?.length > 0)
    };
    
    console.log('Form validation:', validations);
    console.log('Form data:', {
      name: form.name,
      description: form.description,
      price: form.price,
      duration: form.duration,
      group_size: form.group_size,
      destinations: form.destinations,
      experiences: form.experiences,
      activities: form.activities
    });
    
    return (
      validations.name &&
      validations.description &&
      validations.price &&
      validations.duration &&
      validations.groupSize &&
      validations.destinations &&
      validations.experiencesOrActivities
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      toast({
        title: 'Please fill in all required fields',
        description: 'Required fields: Name, Description, Price, Duration, Group Size, at least one Destination, and Experiences/Activities',
        status: 'error',
        duration: 3000,
      });
      return;
    }
    
    setSaving(true);
    setError(null);

    try {
      // Transform form data to match backend expectations
      const packageData = {
        ...form,
        // Transform group_size object to individual fields
        group_size_min: form.group_size?.min || 1,
        group_size_max: form.group_size?.max || 4,
        group_size_recommended: form.group_size?.recommended || 2,
        
        // Transform seasonal_pricing object to individual fields
        seasonal_pricing_peak: form.seasonal_pricing?.peak_season || '',
        seasonal_pricing_off_peak: form.seasonal_pricing?.off_peak_season || '',
        seasonal_pricing_shoulder: form.seasonal_pricing?.shoulder_season || '',
        
        // Ensure JSON fields are properly formatted
        what_to_bring: Array.isArray(form.what_to_bring) ? form.what_to_bring : [],
        important_notes: Array.isArray(form.important_notes) ? form.important_notes : [],
        
        // Convert price fields to numbers
        price: parseFloat(form.price) || 0,
        original_price: form.original_price ? parseFloat(form.original_price) : null,
        discount_percentage: form.discount_percentage ? parseFloat(form.discount_percentage) : null,
        
        // Format dates properly
        start_date: form.start_date || null,
        end_date: form.end_date || null,
        
        // Transform destinations to match backend expectations
        destination_data: form.destinations?.map((dest: any) => ({
          location_id: dest.destination.id, // Backend expects location_id, not destination
          duration: dest.duration || 1,
          description: dest.description || '',
          highlights: Array.isArray(dest.highlights) ? dest.highlights : [],
          activities: Array.isArray(dest.activities) ? dest.activities : []
        })) || [],
        
        // Write data for related tabs
        itinerary_data: (form.itinerary || []).map((it: any, idx: number) => ({
          day: it.day || idx + 1,
          title: it.title || '',
          description: it.description || '',
          activities: Array.isArray(it.activities) ? it.activities : [],
          meals: Array.isArray(it.meals) ? it.meals : [],
          accommodation: it.accommodation || '',
          transportation: it.transportation || '',
        })),
        inclusions_data: (form.inclusions || []).map((inc: any) => ({
          category: inc.category || 'included',
          item: inc.item || '',
          description: inc.description || '',
          icon: inc.icon || '',
        })),
        activities_data: (form.activities || []).map((act: any) => ({
          name: act.name || '',
          description: act.description || '',
          duration: act.duration || '',
          difficulty: act.difficulty || 'easy',
          category: act.category || '',
          included: act.included !== false,
          price: act.price || '',
        })),
        
        // Remove the nested objects that don't exist in the backend
        group_size: undefined,
        seasonal_pricing: undefined,
        destinations: undefined, // Using destination_data instead
        
        // Include experiences data
        experiences: form.experiences || [],
        
        // Remove images from main payload - they're managed separately now
        // images: undefined,
        // existing_images: undefined,
      };

      await onSave(packageData);
      
      toast({
        title: 'Success',
        description: `Package ${pkg ? 'updated' : 'created'} successfully!`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Refresh the packages list
      if (onPackageSaved) {
        onPackageSaved();
      }
      
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
    { name: 'Destinations', icon: '🗺️' },
    { name: 'Itinerary', icon: '🗓️' },
    { name: 'Activities', icon: '🎯' },
    { name: 'Experiences', icon: '🌟' },
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
            <ModalCloseButton />
          </Flex>
        </ModalHeader>

        <ModalBody py={6}>
          <form onSubmit={handleSubmit}>
            <Tabs index={activeTab} onChange={setActiveTab} variant="enclosed" colorScheme="purple">
              <TabList>
                {tabConfig.map((tab, index) => (
                  <Tab key={index} fontSize="sm">
                    <HStack spacing={2}>
                      <Text>{tab.icon}</Text>
                      <Text display={{ base: 'none', md: 'block' }}>{tab.name}</Text>
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
                  />
                </TabPanel>
                
                {/* Pricing Tab */}
                <TabPanel>
                  <PricingForm 
                    form={form} 
                    updateForm={updateForm}
                  />
                </TabPanel>
                
                {/* Destinations Tab */}
                <TabPanel>
                  <DestinationsForm 
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
                
                {/* Experiences Tab */}
                <TabPanel>
                  <ExperiencePicker 
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
                  <VStack spacing={4} align="stretch">
                    <ImageUpload
                      images={images}
                      onChange={setImages}
                      packageId={pkg?.id}
                    />
                  </VStack>
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
                  isDisabled={!isFormValid()}
                  leftIcon={saving ? <Spinner size="sm" /> : <Icon as={CheckCircleIcon} h={5} w={5} />}
                >
                  {pkg ? 'Update' : 'Create'} Package
                </Button>
              </HStack>
            </Flex>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
