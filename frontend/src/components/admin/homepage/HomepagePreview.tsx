import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Container,
  Image,
  Badge,
  SimpleGrid,
  Card,
  CardBody,
  Icon,
} from '@chakra-ui/react';
import {
  ArrowLeftIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';

interface HomepagePreviewProps {
  data?: any;
  onBack: () => void;
  onEdit: () => void;
}

export const HomepagePreview: React.FC<HomepagePreviewProps> = ({ data, onBack, onEdit }) => {
  return (
    <Box bg="gray.50" minH="100vh">
      <Container maxW="7xl" py={8}>
        {/* Header */}
        <HStack justify="space-between" mb={8}>
          <HStack>
            <Button
              leftIcon={<ArrowLeftIcon className="w-5 h-5" />}
              variant="outline"
              onClick={onBack}
            >
              Back to Editor
            </Button>
            <Button
              leftIcon={<PencilIcon className="w-5 h-5" />}
              colorScheme="blue"
              onClick={onEdit}
            >
              Edit
            </Button>
          </HStack>
          <Text fontSize="lg" fontWeight="semibold" color="gray.600">
            Homepage Preview
          </Text>
        </HStack>

        {/* Hero Section Preview */}
        {data?.hero && (
          <Card mb={8}>
            <CardBody>
              <VStack spacing={6} align="stretch">
                <HStack justify="space-between">
                  <Text fontSize="xl" fontWeight="bold">
                    Hero Section
                  </Text>
                  <Badge colorScheme={data.hero.is_active ? 'green' : 'gray'}>
                    {data.hero.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </HStack>
                
                {data.hero.background_image_url && (
                  <Image
                    src={data.hero.background_image_url}
                    alt="Hero background"
                    borderRadius="md"
                    maxH="300px"
                    objectFit="cover"
                  />
                )}
                
                <VStack align="start" spacing={2}>
                  <Text fontSize="2xl" fontWeight="bold">
                    {data.hero.title || 'No title'}
                  </Text>
                  <Text fontSize="lg" color="gray.600">
                    {data.hero.subtitle || 'No subtitle'}
                  </Text>
                  <Text color="gray.700">
                    {data.hero.description || 'No description'}
                  </Text>
                </VStack>
                
                <HStack spacing={4}>
                  <Button colorScheme="blue">
                    {data.hero.cta_primary_text || 'Primary CTA'}
                  </Button>
                  <Button variant="outline">
                    {data.hero.cta_secondary_text || 'Secondary CTA'}
                  </Button>
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        )}

        {/* Features Preview */}
        {data?.features && data.features.length > 0 && (
          <Card mb={8}>
            <CardBody>
              <VStack spacing={6} align="stretch">
                <Text fontSize="xl" fontWeight="bold">
                  Features ({data.features.length})
                </Text>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  {data.features.map((feature: any, index: number) => (
                    <Card key={index} variant="outline">
                      <CardBody>
                        <VStack spacing={3} align="start">
                          <HStack justify="space-between" w="full">
                            <Badge colorScheme={feature.is_active ? 'green' : 'gray'}>
                              {feature.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                            <Text fontSize="sm" color="gray.500">
                              #{feature.order}
                            </Text>
                          </HStack>
                          <Text fontWeight="semibold">
                            {feature.title || 'Untitled Feature'}
                          </Text>
                          <Text fontSize="sm" color="gray.600">
                            {feature.description || 'No description'}
                          </Text>
                          {feature.icon && (
                            <Text fontSize="sm" color="gray.500">
                              Icon: {feature.icon}
                            </Text>
                          )}
                        </VStack>
                      </CardBody>
                    </Card>
                  ))}
                </SimpleGrid>
              </VStack>
            </CardBody>
          </Card>
        )}

        {/* Testimonials Preview */}
        {data?.testimonials && data.testimonials.length > 0 && (
          <Card mb={8}>
            <CardBody>
              <VStack spacing={6} align="stretch">
                <Text fontSize="xl" fontWeight="bold">
                  Testimonials ({data.testimonials.length})
                </Text>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  {data.testimonials.map((testimonial: any, index: number) => (
                    <Card key={index} variant="outline">
                      <CardBody>
                        <VStack spacing={3} align="start">
                          <HStack justify="space-between" w="full">
                            <Badge colorScheme={testimonial.is_active ? 'green' : 'gray'}>
                              {testimonial.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                            <Text fontSize="sm" color="gray.500">
                              Rating: {testimonial.rating}/5
                            </Text>
                          </HStack>
                          <Text fontWeight="semibold">
                            {testimonial.name || 'Anonymous'}
                          </Text>
                          <Text fontSize="sm" color="gray.600">
                            {testimonial.role} {testimonial.company && `at ${testimonial.company}`}
                          </Text>
                          <Text fontSize="sm" color="gray.700" fontStyle="italic">
                            "{testimonial.content || 'No content'}"
                          </Text>
                        </VStack>
                      </CardBody>
                    </Card>
                  ))}
                </SimpleGrid>
              </VStack>
            </CardBody>
          </Card>
        )}

        {/* Statistics Preview */}
        {data?.statistics && data.statistics.length > 0 && (
          <Card mb={8}>
            <CardBody>
              <VStack spacing={6} align="stretch">
                <Text fontSize="xl" fontWeight="bold">
                  Statistics ({data.statistics.length})
                </Text>
                <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
                  {data.statistics.map((statistic: any, index: number) => (
                    <Card key={index} variant="outline" textAlign="center">
                      <CardBody>
                        <VStack spacing={2}>
                          <Badge colorScheme={statistic.is_active ? 'green' : 'gray'}>
                            {statistic.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                          <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                            {statistic.value || '0'}
                          </Text>
                          <Text fontSize="sm" fontWeight="medium">
                            {statistic.label || 'Untitled'}
                          </Text>
                        </VStack>
                      </CardBody>
                    </Card>
                  ))}
                </SimpleGrid>
              </VStack>
            </CardBody>
          </Card>
        )}

        {/* CTA Section Preview */}
        {data?.cta_section && (
          <Card mb={8}>
            <CardBody>
              <VStack spacing={6} align="stretch">
                <HStack justify="space-between">
                  <Text fontSize="xl" fontWeight="bold">
                    Call-to-Action Section
                  </Text>
                  <Badge colorScheme={data.cta_section.is_active ? 'green' : 'gray'}>
                    {data.cta_section.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </HStack>
                
                <VStack align="start" spacing={2}>
                  <Text fontSize="2xl" fontWeight="bold">
                    {data.cta_section.title || 'No title'}
                  </Text>
                  <Text color="gray.700">
                    {data.cta_section.description || 'No description'}
                  </Text>
                </VStack>
                
                <HStack spacing={4}>
                  <Button colorScheme="blue">
                    {data.cta_section.cta_primary_text || 'Primary CTA'}
                  </Button>
                  <Button variant="outline">
                    {data.cta_section.cta_secondary_text || 'Secondary CTA'}
                  </Button>
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        )}

        {/* Settings Preview */}
        {data?.settings && (
          <Card>
            <CardBody>
              <VStack spacing={6} align="stretch">
                <Text fontSize="xl" fontWeight="bold">
                  Site Settings
                </Text>
                
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <VStack align="start" spacing={2}>
                    <Text fontWeight="semibold">Site Information</Text>
                    <Text fontSize="sm"><strong>Title:</strong> {data.settings.site_title || 'Not set'}</Text>
                    <Text fontSize="sm"><strong>Description:</strong> {data.settings.site_description || 'Not set'}</Text>
                    <Text fontSize="sm"><strong>Keywords:</strong> {data.settings.site_keywords || 'Not set'}</Text>
                  </VStack>
                  
                  <VStack align="start" spacing={2}>
                    <Text fontWeight="semibold">Contact Information</Text>
                    <Text fontSize="sm"><strong>Email:</strong> {data.settings.contact_email || 'Not set'}</Text>
                    <Text fontSize="sm"><strong>Phone:</strong> {data.settings.contact_phone || 'Not set'}</Text>
                    <Text fontSize="sm"><strong>WhatsApp:</strong> {data.settings.whatsapp_number || 'Not set'}</Text>
                  </VStack>
                </SimpleGrid>
              </VStack>
            </CardBody>
          </Card>
        )}
      </Container>
    </Box>
  );
}; 