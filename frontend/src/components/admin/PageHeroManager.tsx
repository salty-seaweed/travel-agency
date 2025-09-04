import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Input,
  Textarea,
  Select,
  Image,
  useToast,
  SimpleGrid,
  Badge,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Progress,
  Alert,
  AlertIcon,
  Spinner,
} from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import {
  PhotoIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  EyeIcon,
  CloudArrowUpIcon,
} from '@heroicons/react/24/outline';
import { ImagePicker } from './cms/MediaLibrary';

interface PageHero {
  id?: number;
  page_key: string;
  title: string;
  subtitle: string;
  image_url: string;
  background_image?: File;
  media_asset?: any; // MediaAsset from MediaLibrary
  overlay_opacity: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

interface PageHeroManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

const PAGE_KEYS = [
  { key: 'about', name: 'About Page', description: 'Hero banner for the About Us page' },
  { key: 'contact', name: 'Contact Page', description: 'Hero banner for the Contact page' },
  { key: 'transportation', name: 'Transportation Page', description: 'Hero banner for the Transportation page' },
  { key: 'faq', name: 'FAQ Page', description: 'Hero banner for the FAQ page' },
  { key: 'blog', name: 'Blog Page', description: 'Hero banner for the Blog page' },
  { key: 'packages', name: 'Packages Page', description: 'Hero banner for the Packages page' },
];

export const PageHeroManager: React.FC<PageHeroManagerProps> = ({ isOpen, onClose }) => {
  const [pageHeroes, setPageHeroes] = useState<PageHero[]>([]);
  const [selectedHero, setSelectedHero] = useState<PageHero | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [selectedMediaAsset, setSelectedMediaAsset] = useState<any>(null);
  const toast = useToast();
  const queryClient = useQueryClient();
  
  const { isOpen: isEditModalOpen, onOpen: onEditModalOpen, onClose: onEditModalClose } = useDisclosure();

  // Load page heroes on component mount
  useEffect(() => {
    if (isOpen) {
      loadPageHeroes();
    }
  }, [isOpen]);

  const loadPageHeroes = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/page-heroes/');
      if (response.ok) {
        const data = await response.json();
        // Ensure data is always an array
        setPageHeroes(Array.isArray(data) ? data : []);
      } else {
        throw new Error('Failed to load page heroes');
      }
    } catch (error) {
      console.error('Error loading page heroes:', error);
      toast({
        title: 'Error',
        description: 'Failed to load page heroes',
        status: 'error',
        duration: 3000,
      });
      // Set empty array on error
      setPageHeroes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateHero = () => {
    setSelectedHero({
      page_key: '',
      title: '',
      subtitle: '',
      image_url: '',
      overlay_opacity: 0.6,
      is_active: true,
    });
    setIsEditing(false);
    setImagePreview('');
    setSelectedMediaAsset(null);
    onEditModalOpen();
  };

  const handleEditHero = (hero: PageHero) => {
    setSelectedHero(hero);
    setIsEditing(true);
    setImagePreview(hero.image_url || '');
    setSelectedMediaAsset(hero.media_asset || null);
    onEditModalOpen();
  };


  const handleSaveHero = async () => {
    if (!selectedHero) return;

    setIsLoading(true);
    try {
      // First, try to find existing hero by page_key
      let existingHero = null;
      if (!selectedHero.id) {
        try {
          const checkResponse = await fetch(`/api/page-heroes/?page_key=${selectedHero.page_key}`);
          console.log('Check response status:', checkResponse.status);
          if (checkResponse.ok) {
            const existingData = await checkResponse.json();
            console.log('Existing data from API:', existingData);
            
            // Handle paginated response format
            const heroes = existingData.results || existingData;
            console.log('Heroes array:', heroes);
            console.log('Is array:', Array.isArray(heroes));
            console.log('Length:', heroes?.length);
            
            if (Array.isArray(heroes) && heroes.length > 0) {
              existingHero = heroes[0];
              console.log('Found existing hero:', existingHero);
            } else {
              console.log('No heroes found in response');
            }
          } else {
            console.log('Check response not ok:', checkResponse.status);
          }
        } catch (e) {
          console.log('Error checking for existing hero:', e);
        }
      }
      
      const heroId = selectedHero.id || existingHero?.id;
      const url = heroId ? `/api/page-heroes/${heroId}/` : '/api/page-heroes/';
      const method = heroId ? 'PUT' : 'POST';
      
      // Prepare data for submission (exclude File object)
      const heroData = {
        page_key: selectedHero.page_key,
        title: selectedHero.title,
        subtitle: selectedHero.subtitle,
        background_image_url: selectedHero.image_url, // Use background_image_url field
        overlay_opacity: selectedHero.overlay_opacity,
        is_active: selectedHero.is_active,
      };

      console.log('Saving hero data:', heroData);
      console.log('Selected hero:', selectedHero);
      console.log('Existing hero:', existingHero);
      console.log('Hero ID:', heroId);
      console.log('Is editing:', isEditing);
      console.log('URL:', url);
      console.log('Method:', method);

      const token = localStorage.getItem('access');
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(heroData),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Page hero ${isEditing ? 'updated' : 'created'} successfully`,
          status: 'success',
          duration: 3000,
        });
        onEditModalClose();
        setImagePreview('');
        loadPageHeroes();
        
        // Invalidate the page hero cache for the frontend
        console.log('Invalidating cache for page-hero:', selectedHero.page_key);
        await queryClient.invalidateQueries({ queryKey: ['page-hero', selectedHero.page_key] });
        await queryClient.invalidateQueries({ queryKey: ['page-hero'] });
        console.log('Cache invalidated successfully');
      } else {
        throw new Error('Failed to save page hero');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save page hero',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteHero = async (heroId: number) => {
    if (!confirm('Are you sure you want to delete this page hero?')) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/page-heroes/${heroId}/`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Page hero deleted successfully',
          status: 'success',
          duration: 3000,
        });
        loadPageHeroes();
      } else {
        throw new Error('Failed to delete page hero');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete page hero',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPageName = (pageKey: string) => {
    const page = PAGE_KEYS.find(p => p.key === pageKey);
    return page ? page.name : pageKey;
  };

  const getHeroForPage = (pageKey: string) => {
    if (!Array.isArray(pageHeroes)) {
      return null;
    }
    return pageHeroes.find(hero => hero.page_key === pageKey);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="6xl" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent maxH="90vh">
          <ModalHeader>Page Hero Manager</ModalHeader>
          <ModalCloseButton />
          <ModalBody overflowY="auto" maxH="calc(90vh - 120px)">
            <VStack spacing={6} align="stretch">
              {/* Header */}
              <HStack justify="space-between">
                <VStack align="start" spacing={1}>
                  <Heading size="md">Manage Page Hero Banners</Heading>
                  <Text color="gray.600">Configure hero banners for different pages</Text>
                </VStack>
                <Button
                  leftIcon={<PlusIcon className="w-4 h-4" />}
                  colorScheme="blue"
                  onClick={handleCreateHero}
                >
                  Create Hero Banner
                </Button>
              </HStack>

              {/* Page Heroes Grid */}
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {PAGE_KEYS.map((page) => {
                  const hero = getHeroForPage(page.key);
                  return (
                    <Card key={page.key} shadow="md">
                      <CardHeader>
                        <VStack align="start" spacing={2}>
                          <Heading size="sm">{page.name}</Heading>
                          <Text fontSize="sm" color="gray.600">{page.description}</Text>
                          <Badge colorScheme={hero ? 'green' : 'gray'}>
                            {hero ? 'Configured' : 'Not Configured'}
                          </Badge>
                        </VStack>
                      </CardHeader>
                      <CardBody>
                        {hero ? (
                          <VStack spacing={4}>
                            {/* Hero Preview */}
                            <Box position="relative" w="full" h="32" borderRadius="lg" overflow="hidden">
                              <Image
                                src={hero.image_url}
                                alt={hero.title}
                                w="full"
                                h="full"
                                objectFit="cover"
                              />
                              <Box
                                position="absolute"
                                top={0}
                                left={0}
                                right={0}
                                bottom={0}
                                bg={`blackAlpha.${Math.round(hero.overlay_opacity * 100)}`}
                              />
                              <Box
                                position="absolute"
                                top={2}
                                left={2}
                                right={2}
                                bottom={2}
                                color="white"
                                fontSize="xs"
                                fontWeight="bold"
                                textAlign="center"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                              >
                                {hero.title}
                              </Box>
                            </Box>
                            
                            <VStack spacing={2} align="start" w="full">
                              <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
                                {hero.title}
                              </Text>
                              <Text fontSize="xs" color="gray.600" noOfLines={2}>
                                {hero.subtitle}
                              </Text>
                            </VStack>

                            <HStack spacing={2} w="full">
                              <Button
                                size="sm"
                                leftIcon={<PencilIcon className="w-3 h-3" />}
                                onClick={() => handleEditHero(hero)}
                                flex={1}
                              >
                                Edit
                              </Button>
                              <IconButton
                                size="sm"
                                icon={<TrashIcon className="w-3 h-3" />}
                                colorScheme="red"
                                variant="outline"
                                onClick={() => hero.id && handleDeleteHero(hero.id)}
                                aria-label="Delete hero"
                              />
                            </HStack>
                          </VStack>
                        ) : (
                          <VStack spacing={4}>
                            <Box
                              w="full"
                              h="32"
                              bg="gray.100"
                              borderRadius="lg"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                            >
                              <VStack spacing={2}>
                                <PhotoIcon className="w-8 h-8 text-gray-400" />
                                <Text fontSize="sm" color="gray.500">No hero configured</Text>
                              </VStack>
                            </Box>
                            <Button
                              size="sm"
                              leftIcon={<PlusIcon className="w-3 h-3" />}
                              onClick={() => {
                                setSelectedHero({
                                  page_key: page.key,
                                  title: '',
                                  subtitle: '',
                                  image_url: '',
                                  overlay_opacity: 0.6,
                                  is_active: true,
                                });
                                setIsEditing(false);
                                setImagePreview('');
                                onEditModalOpen();
                              }}
                              w="full"
                            >
                              Configure Hero
                            </Button>
                          </VStack>
                        )}
                      </CardBody>
                    </Card>
                  );
                })}
              </SimpleGrid>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Edit/Create Hero Modal */}
      <Modal isOpen={isEditModalOpen} onClose={onEditModalClose} size="2xl" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent maxH="90vh">
          <ModalHeader>
            {isEditing ? 'Edit Page Hero' : 'Create Page Hero'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody overflowY="auto" maxH="calc(90vh - 160px)">
            <VStack spacing={6}>
              <FormControl>
                <FormLabel>Page</FormLabel>
                <Select
                  value={selectedHero?.page_key || ''}
                  onChange={(e) => setSelectedHero(prev => prev ? { ...prev, page_key: e.target.value } : null)}
                  isDisabled={isEditing}
                >
                  <option value="">Select a page</option>
                  {PAGE_KEYS.map((page) => (
                    <option key={page.key} value={page.key}>
                      {page.name}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Title</FormLabel>
                <Input
                  value={selectedHero?.title || ''}
                  onChange={(e) => setSelectedHero(prev => prev ? { ...prev, title: e.target.value } : null)}
                  placeholder="Enter hero title"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Subtitle</FormLabel>
                <Textarea
                  value={selectedHero?.subtitle || ''}
                  onChange={(e) => setSelectedHero(prev => prev ? { ...prev, subtitle: e.target.value } : null)}
                  placeholder="Enter hero subtitle"
                  rows={3}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Background Image</FormLabel>
                <ImagePicker
                  value={selectedMediaAsset}
                  onChange={(asset) => {
                    setSelectedMediaAsset(asset);
                    if (asset) {
                      setSelectedHero(prev => prev ? {
                        ...prev,
                        image_url: asset.file_url,
                        media_asset: asset
                      } : null);
                      setImagePreview(asset.file_url);
                    } else {
                      setSelectedHero(prev => prev ? {
                        ...prev,
                        image_url: '',
                        media_asset: null
                      } : null);
                      setImagePreview('');
                    }
                  }}
                  usageContext="page-hero"
                  placeholder="Select a background image for the hero section"
                />

                {/* Manual URL Input (Fallback) */}
                <Box mt={4}>
                  <Text fontSize="sm" color="gray.600" mb={2}>Or enter image URL directly:</Text>
                  <Input
                    value={selectedHero?.image_url || ''}
                    onChange={(e) => {
                      const url = e.target.value;
                      setSelectedHero(prev => prev ? { ...prev, image_url: url } : null);
                      setImagePreview(url);
                      setSelectedMediaAsset(null); // Clear media asset when using manual URL
                    }}
                    placeholder="https://example.com/image.jpg"
                    size="sm"
                  />
                </Box>
              </FormControl>

              <FormControl>
                <FormLabel>Overlay Opacity</FormLabel>
                <NumberInput
                  value={selectedHero?.overlay_opacity || 0.6}
                  onChange={(_, value) => setSelectedHero(prev => prev ? { ...prev, overlay_opacity: value } : null)}
                  min={0}
                  max={1}
                  step={0.1}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <Text fontSize="sm" color="gray.600">
                  Controls the darkness of the overlay on the background image (0 = transparent, 1 = black)
                </Text>
              </FormControl>

              <FormControl>
                <FormLabel>Status</FormLabel>
                <Select
                  value={selectedHero?.is_active ? 'true' : 'false'}
                  onChange={(e) => setSelectedHero(prev => prev ? { ...prev, is_active: e.target.value === 'true' } : null)}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </Select>
              </FormControl>

              {/* Preview */}
              {(imagePreview || selectedHero?.image_url) && (
                <FormControl>
                  <FormLabel>Preview</FormLabel>
                  <Box position="relative" w="full" h="48" borderRadius="lg" overflow="hidden">
                    <Image
                      src={imagePreview || selectedHero?.image_url}
                      alt="Preview"
                      w="full"
                      h="full"
                      objectFit="cover"
                    />
                    <Box
                      position="absolute"
                      top={0}
                      left={0}
                      right={0}
                      bottom={0}
                      bg={`blackAlpha.${Math.round((selectedHero?.overlay_opacity || 0.6) * 100)}`}
                    />
                    <Box
                      position="absolute"
                      top={4}
                      left={4}
                      right={4}
                      bottom={4}
                      color="white"
                      textAlign="center"
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Text fontSize="lg" fontWeight="bold" mb={2}>
                        {selectedHero?.title || 'Title'}
                      </Text>
                      <Text fontSize="sm">
                        {selectedHero?.subtitle || 'Subtitle'}
                      </Text>
                    </Box>
                  </Box>
                </FormControl>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack spacing={3}>
              <Button variant="ghost" onClick={onEditModalClose}>
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleSaveHero}
                isLoading={isLoading}
                isDisabled={!selectedHero?.page_key || !selectedHero?.title}
              >
                {isEditing ? 'Update' : 'Create'}
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
