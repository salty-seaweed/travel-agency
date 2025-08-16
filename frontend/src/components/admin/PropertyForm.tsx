import React, { useState, useEffect } from 'react';
import { XMarkIcon, MapPinIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  Textarea,
  Select,
  Checkbox,
  VStack,
  HStack,
  Grid,
  GridItem,
  Text,
  Icon,
  Box,
  Divider,
  Badge,
  useToast,
  Spinner,
  Flex,
  Heading,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { LoadingSpinner } from '../LoadingSpinner';
import { LocationMapPicker } from '../LocationMapPicker';
import { ImageUpload } from './ImageUpload';
import { apiGet, apiUpload } from '../../api';
import type { Property, PropertyType, Location, Amenity } from '../../types';

interface PropertyFormProps {
  isOpen: boolean;
  onClose: () => void;
  property?: Property;
  onSave: (propertyData: Partial<Property>) => Promise<void>;
}

export function PropertyForm({ isOpen, onClose, property, onSave }: PropertyFormProps) {
  const [form, setForm] = useState<any>(property ? {
    name: property.name || '', 
    description: property.description || '', 
    property_type: property.property_type?.id || '', 
    location: property.location?.id || '', 
    price_per_night: property.price_per_night || '', 
    whatsapp_number: property.whatsapp_number || '', 
    amenities: property.amenities?.map((a: any) => a.id) || []
  } : {
    name: '', 
    description: '', 
    property_type: '', 
    location: '', 
    price_per_night: '', 
    whatsapp_number: '', 
    amenities: []
  });
  const [saving, setSaving] = useState(false);
  const [types, setTypes] = useState<PropertyType[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<any[]>([]);
  
  const toast = useToast();
  
  // Track selected location's lat/lng for map
  const selectedLocation = locations.find((l: any) => l.id === form.location);
  const [lat, setLat] = useState(selectedLocation ? selectedLocation.latitude : 3.2028);
  const [lng, setLng] = useState(selectedLocation ? selectedLocation.longitude : 73.2207);
  
  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);
  
  useEffect(() => {
    if (selectedLocation) {
      setLat(selectedLocation.latitude);
      setLng(selectedLocation.longitude);
    }
  }, [form.location]);
  
  const fetchData = async () => {
    try {
      setError(null);
      const [typesData, locationsData, amenitiesData] = await Promise.all([
        apiGet('/property-types/'),
        apiGet('/locations/'),
        apiGet('/amenities/')
      ]);
      
      setTypes(typesData.results || typesData);
      setLocations(locationsData.results || locationsData);
      setAmenities(amenitiesData.results || amenitiesData);
    } catch (error) {
      console.error('Failed to fetch form data:', error);
      setError('Failed to load form data. Please try again.');
    }
  };
  
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((f: any) => ({ ...f, [name]: value }));
  };
  
  const handleAmenityChange = (id: number) => {
    setForm((f: any) => ({ 
      ...f, 
      amenities: f.amenities.includes(id) 
        ? f.amenities.filter((a: number) => a !== id) 
        : [...f.amenities, id] 
    }));
  };
  
  const handleMapChange = (newLat: number, newLng: number) => {
    setLat(newLat);
    setLng(newLng);
    // Update the selected location's lat/lng in the locations array
    if (form.location) {
      const idx = locations.findIndex((l: any) => l.id === form.location);
      if (idx !== -1) {
        locations[idx].latitude = newLat;
        locations[idx].longitude = newLng;
      }
    }
  };

  const uploadAllImages = async () => {
    const newImages = images.filter(img => img.isNew && img.file);
    
    if (newImages.length === 0) return;

    // Mark images as uploading
    setImages(images.map(img => 
      img.isNew && img.file 
        ? { ...img, isUploading: true, uploadProgress: 0 }
        : img
    ));

    try {
      const uploadPromises = newImages.map(async (imageFile) => {
        const formData = new FormData();
        formData.append('image', imageFile.file!);

        const response = await apiUpload('/upload-image/', formData, (progress) => {
          // Update upload progress
          setImages(images.map(img => 
            img.id === imageFile.id 
              ? { ...img, uploadProgress: progress }
              : img
          ));
        }) as any;

        return { ...imageFile, url: response.url, isUploading: false, isNew: false };
      });

      const uploadedImages = await Promise.all(uploadPromises);
      
      // Replace new images with uploaded ones
      setImages(images.map(img => {
        const uploaded = uploadedImages.find(uploaded => uploaded.id === img.id);
        return uploaded || img;
      }));

      toast({
        title: 'Success',
        description: `${uploadedImages.length} images uploaded successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Upload Failed',
        description: 'Some images failed to upload. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });

      // Reset uploading state
      setImages(images.map(img => 
        img.isNew && img.file 
          ? { ...img, isUploading: false, uploadProgress: 0 }
          : img
      ));
    }
  };
  
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    
    // Validate required fields
    if (!form.name || !form.description || !form.property_type || !form.location || !form.price_per_night) {
      setError('Please fill in all required fields');
      setSaving(false);
      return;
    }
    
    try {
      // Upload any new images first
      if (images.some(img => img.isNew && img.file)) {
        await uploadAllImages();
      }

      // Format the data properly for the API
      const propertyData = {
        name: form.name,
        description: form.description,
        property_type_id: parseInt(form.property_type),
        location_id: parseInt(form.location),
        price_per_night: parseFloat(form.price_per_night),
        whatsapp_number: form.whatsapp_number,
        amenity_ids: form.amenities,
        // Add latitude and longitude if location is selected
        ...(form.location && {
          latitude: lat,
          longitude: lng
        }),
        images: images
          .filter(img => img.url) // Only include images that have been uploaded
          .map((img, index) => ({
            image: img.url,
            caption: img.name,
            order: index
          }))
      };
      
      console.log('Sending property data:', propertyData);
      await onSave(propertyData);
      
      toast({
        title: 'Success',
        description: `Property ${property ? 'updated' : 'created'} successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      onClose();
    } catch (error) {
      console.error('Failed to save property:', error);
      setError('Failed to save property. Please try again.');
      
      toast({
        title: 'Error',
        description: 'Failed to save property. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl" scrollBehavior="inside">
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent maxW="6xl" mx={4}>
        <ModalHeader borderBottom="1px solid" borderColor="gray.200" pb={4}>
          <Flex alignItems="center" justify="space-between">
            <Box>
              <Heading size="lg" color="gray.800">
                {property ? 'Edit' : 'Add'} Property
              </Heading>
              <Text color="gray.600" mt={1}>
                Fill in the property details below
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
              <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={8}>
                {/* Left Column - Basic Info */}
                <VStack spacing={6} align="stretch">
                  <Heading size="md" color="gray.700" mb={2}>
                    Basic Information
                  </Heading>
                  
                  <FormControl isRequired>
                    <FormLabel fontWeight="semibold" color="gray.700">
                      Property Name
                    </FormLabel>
                    <Input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter property name"
                      size="lg"
                      borderRadius="lg"
                      focusBorderColor="blue.500"
                    />
                  </FormControl>
                  
                  <FormControl isRequired>
                    <FormLabel fontWeight="semibold" color="gray.700">
                      Description
                    </FormLabel>
                    <Textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      placeholder="Enter property description"
                      size="lg"
                      borderRadius="lg"
                      focusBorderColor="blue.500"
                      rows={4}
                      resize="vertical"
                    />
                  </FormControl>
                  
                  <FormControl isRequired>
                    <FormLabel fontWeight="semibold" color="gray.700">
                      Property Type
                    </FormLabel>
                    <Select
                      name="property_type"
                      value={form.property_type}
                      onChange={handleChange}
                      size="lg"
                      borderRadius="lg"
                      focusBorderColor="blue.500"
                      placeholder="Select Property Type"
                    >
                      {types.map((t: any) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <FormControl isRequired>
                    <FormLabel fontWeight="semibold" color="gray.700">
                      Location
                    </FormLabel>
                    <Select
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      size="lg"
                      borderRadius="lg"
                      focusBorderColor="blue.500"
                      placeholder="Select Location"
                    >
                      {locations.map((l: any) => (
                        <option key={l.id} value={l.id}>{l.island}</option>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <Grid templateColumns="1fr 1fr" gap={4}>
                                         <FormControl isRequired>
                       <FormLabel fontWeight="semibold" color="gray.700">
                         Price per Night
                       </FormLabel>
                       <InputGroup size="lg">
                         <InputLeftElement pointerEvents="none" color="gray.500">
                           <Text>$</Text>
                         </InputLeftElement>
                         <Input
                           name="price_per_night"
                           value={form.price_per_night}
                           onChange={handleChange}
                           placeholder="0.00"
                           borderRadius="lg"
                           focusBorderColor="blue.500"
                           type="number"
                           min="0"
                           step="0.01"
                         />
                       </InputGroup>
                     </FormControl>
                    
                    <FormControl>
                      <FormLabel fontWeight="semibold" color="gray.700">
                        WhatsApp Number
                      </FormLabel>
                      <Input
                        name="whatsapp_number"
                        value={form.whatsapp_number}
                        onChange={handleChange}
                        placeholder="+960 123 4567"
                        size="lg"
                        borderRadius="lg"
                        focusBorderColor="blue.500"
                      />
                    </FormControl>
                  </Grid>
                </VStack>
                
                {/* Right Column - Amenities & Map */}
                <VStack spacing={6} align="stretch">
                  <Heading size="md" color="gray.700" mb={2}>
                    Amenities & Location
                  </Heading>
                  
                  <FormControl>
                    <FormLabel fontWeight="semibold" color="gray.700">
                      Available Amenities
                    </FormLabel>
                  </FormControl>
                  
                  <Box
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="lg"
                    p={4}
                    maxH="200px"
                    overflowY="auto"
                  >
                    <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={3}>
                      {amenities.map((amenity: any) => (
                        <Checkbox
                          key={amenity.id}
                          isChecked={form.amenities.includes(amenity.id)}
                          onChange={() => handleAmenityChange(amenity.id)}
                          colorScheme="blue"
                          size="lg"
                        >
                          <Flex alignItems="center">
                            <Icon as={CheckCircleIcon} h={4} w={4} color="green.500" mr={2} />
                            <Text fontSize="sm">{amenity.name}</Text>
                          </Flex>
                        </Checkbox>
                      ))}
                    </Grid>
                  </Box>
                  
                  <Box>
                    <FormLabel fontWeight="semibold" color="gray.700" mb={3}>
                      Location Map
                    </FormLabel>
                    <Box
                      border="1px solid"
                      borderColor="gray.200"
                      borderRadius="lg"
                      overflow="hidden"
                      h="300px"
                    >
                                             <LocationMapPicker
                         lat={lat}
                         lng={lng}
                         onChange={handleMapChange}
                       />
                    </Box>
                    <Text fontSize="sm" color="gray.500" mt={2}>
                      Click on the map to adjust the exact location
                    </Text>
                                     </Box>
                 </VStack>
               </Grid>
               
               <Divider my={8} />
               
               {/* Images Section */}
               <ImageUpload
                 images={images}
                 onImagesChange={setImages}
                 maxImages={10}
                 maxFileSize={5}
                 title="Property Images"
                 description="Upload high-quality images of the property. The first image will be used as the featured image."
               />
              
              <Divider my={8} />
              
              {/* Action Buttons */}
              <Flex justify="flex-end" gap={4}>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={onClose}
                  isDisabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  isLoading={saving}
                  loadingText="Saving..."
                  leftIcon={saving ? <Spinner size="sm" /> : <Icon as={CheckCircleIcon} h={5} w={5} />}
                >
                  {property ? 'Update' : 'Create'} Property
                </Button>
              </Flex>
            </form>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
} 