import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Icon,
  Button,
  Card,
  CardHeader,
  CardBody,
  List,
  ListItem,
  ListIcon,
} from '@chakra-ui/react';
import {
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  StarIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  HomeIcon,
  TruckIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { useWhatsApp } from '../../hooks/useQueries';
import type { Package } from '../../types';

interface PackageSidebarProps {
  packageData: Package;
  onBookNow: () => void;
}

export function PackageSidebar({ packageData, onBookNow }: PackageSidebarProps) {
  const { getWhatsAppUrl } = useWhatsApp();

  const handleWhatsApp = () => {
    const message = `Hi! I'd like to book the "${packageData.name}" package.`;
    const whatsappUrl = getWhatsAppUrl(message);
    window.open(whatsappUrl, '_blank');
  };

  return (
    <VStack spacing={6} align="stretch" position="sticky" top={4}>
      {/* Pricing Card */}
      <Card bg="purple.50" borderColor="purple.200">
        <CardBody>
          <VStack spacing={3}>
            <Text fontSize="sm" color="gray.600" textAlign="center">Starting from</Text>
            <HStack align="baseline" justify="center">
              {packageData.original_price && packageData.original_price !== packageData.price && (
                <Text fontSize="lg" color="gray.400" textDecoration="line-through">
                  {packageData.original_price}
                </Text>
              )}
              <Text fontSize="3xl" fontWeight="bold" color="purple.600">
                {packageData.price}
              </Text>
            </HStack>
            <Text fontSize="sm" color="gray.600" textAlign="center">
              per person • {packageData.duration} days
            </Text>
            {packageData.original_price && packageData.original_price !== packageData.price && (
              <Badge colorScheme="green" size="sm">
                Save {Math.round(((parseFloat(packageData.original_price.replace(/[^0-9.]/g, '')) - parseFloat(packageData.price.replace(/[^0-9.]/g, ''))) / parseFloat(packageData.original_price.replace(/[^0-9.]/g, ''))) * 100)}%
              </Badge>
            )}
          </VStack>
        </CardBody>
      </Card>

      {/* Package Details */}
      <Card>
        <CardHeader>
          <Text fontWeight="bold" fontSize="lg" color="gray.800">Package Details</Text>
        </CardHeader>
        <CardBody>
          <VStack spacing={4} align="stretch">
            <HStack justify="space-between">
              <HStack spacing={2}>
                <Icon as={CalendarIcon} h={4} w={4} color="purple.500" />
                <Text color="gray.600">Duration:</Text>
              </HStack>
              <Text fontWeight="medium">{packageData.duration} days</Text>
            </HStack>
            
            <HStack justify="space-between">
              <HStack spacing={2}>
                <Icon as={UsersIcon} h={4} w={4} color="purple.500" />
                <Text color="gray.600">Group Size:</Text>
              </HStack>
              <Text fontWeight="medium">
                {packageData.group_size?.min || 1}-{packageData.group_size?.max || 4} people
              </Text>
            </HStack>
            
            <HStack justify="space-between">
              <HStack spacing={2}>
                <Icon as={StarIcon} h={4} w={4} color="purple.500" />
                <Text color="gray.600">Difficulty:</Text>
              </HStack>
              <Text fontWeight="medium" textTransform="capitalize">
                {packageData.difficulty_level || 'Easy'}
              </Text>
            </HStack>
            
            <HStack justify="space-between">
              <HStack spacing={2}>
                <Icon as={MapPinIcon} h={4} w={4} color="purple.500" />
                <Text color="gray.600">Category:</Text>
              </HStack>
              <Text fontWeight="medium" textTransform="capitalize">
                {packageData.category || 'Adventure'}
              </Text>
            </HStack>
          </VStack>
        </CardBody>
      </Card>

      {/* Accommodation Info */}
      {(packageData.accommodation_type || packageData.room_type || packageData.meal_plan) && (
        <Card>
          <CardHeader>
            <HStack spacing={2}>
              <Icon as={HomeIcon} h={5} w={5} color="green.500" />
              <Text fontWeight="bold" fontSize="lg" color="gray.800">Accommodation</Text>
            </HStack>
          </CardHeader>
          <CardBody>
            <VStack spacing={3} align="stretch">
              {packageData.accommodation_type && (
                <HStack justify="space-between">
                  <Text color="gray.600">Type:</Text>
                  <Text fontWeight="medium">{packageData.accommodation_type}</Text>
                </HStack>
              )}
              {packageData.room_type && (
                <HStack justify="space-between">
                  <Text color="gray.600">Room:</Text>
                  <Text fontWeight="medium">{packageData.room_type}</Text>
                </HStack>
              )}
              {packageData.meal_plan && (
                <HStack justify="space-between">
                  <Text color="gray.600">Meals:</Text>
                  <Text fontWeight="medium">{packageData.meal_plan}</Text>
                </HStack>
              )}
            </VStack>
          </CardBody>
        </Card>
      )}

      {/* Transportation */}
      {(packageData.transportation_details || packageData.airport_transfers) && (
        <Card>
          <CardHeader>
            <HStack spacing={2}>
              <Icon as={TruckIcon} h={5} w={5} color="blue.500" />
              <Text fontWeight="bold" fontSize="lg" color="gray.800">Transportation</Text>
            </HStack>
          </CardHeader>
          <CardBody>
            {packageData.transportation_details && (
              <Text color="gray.700" fontSize="sm" mb={3}>
                {packageData.transportation_details}
              </Text>
            )}
            {packageData.airport_transfers && (
              <HStack spacing={2}>
                <Icon as={CheckCircleIcon} h={4} w={4} color="green.500" />
                <Text fontSize="sm" color="gray.600">Airport transfers included</Text>
              </HStack>
            )}
          </CardBody>
        </Card>
      )}

      {/* Additional Info - Always show with helpful defaults */}
      <Card>
        <CardHeader>
          <Text fontWeight="bold" fontSize="lg" color="gray.800">Additional Information</Text>
        </CardHeader>
        <CardBody>
          <VStack spacing={4} align="stretch">
            {/* What to Bring */}
            <Box>
              <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>What to Bring:</Text>
              <List spacing={1}>
                {packageData.what_to_bring && packageData.what_to_bring.length > 0 ? (
                  packageData.what_to_bring.slice(0, 4).map((item, index) => (
                    <ListItem key={index} fontSize="sm" color="gray.600">
                      <ListIcon as={CheckCircleIcon} color="blue.500" />
                      {item}
                    </ListItem>
                  ))
                ) : (
                  // Default items based on package category
                  <>
                    <ListItem fontSize="sm" color="gray.600">
                      <ListIcon as={CheckCircleIcon} color="blue.500" />
                      Comfortable walking shoes
                    </ListItem>
                    <ListItem fontSize="sm" color="gray.600">
                      <ListIcon as={CheckCircleIcon} color="blue.500" />
                      Sun protection (hat, sunscreen)
                    </ListItem>
                    <ListItem fontSize="sm" color="gray.600">
                      <ListIcon as={CheckCircleIcon} color="blue.500" />
                      Camera for memories
                    </ListItem>
                    {packageData.category?.toLowerCase().includes('water') && (
                      <ListItem fontSize="sm" color="gray.600">
                        <ListIcon as={CheckCircleIcon} color="blue.500" />
                        Swimwear & towel
                      </ListItem>
                    )}
                  </>
                )}
              </List>
            </Box>
            
            {/* Important Notes */}
            <Box>
              <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>Important Notes:</Text>
              <List spacing={1}>
                {packageData.important_notes && packageData.important_notes.length > 0 ? (
                  packageData.important_notes.slice(0, 3).map((note, index) => (
                    <ListItem key={index} fontSize="sm" color="gray.600">
                      <ListIcon as={ExclamationTriangleIcon} color="orange.500" />
                      {note}
                    </ListItem>
                  ))
                ) : (
                  // Default helpful notes
                  <>
                    <ListItem fontSize="sm" color="gray.600">
                      <ListIcon as={ExclamationTriangleIcon} color="orange.500" />
                      Weather conditions may affect activities
                    </ListItem>
                    <ListItem fontSize="sm" color="gray.600">
                      <ListIcon as={ExclamationTriangleIcon} color="orange.500" />
                      Advance booking recommended
                    </ListItem>
                    <ListItem fontSize="sm" color="gray.600">
                      <ListIcon as={ExclamationTriangleIcon} color="orange.500" />
                      Contact us for special requirements
                    </ListItem>
                  </>
                )}
              </List>
            </Box>

            {/* Best Time to Visit */}
            {(packageData.best_time_to_visit || packageData.weather_info) && (
              <Box>
                <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>Best Time to Visit:</Text>
                <Text fontSize="sm" color="gray.600">
                  {packageData.best_time_to_visit || packageData.weather_info || 'Year-round destination with tropical climate'}
                </Text>
              </Box>
            )}
          </VStack>
        </CardBody>
      </Card>

      {/* Contact & Booking */}
      <Card>
        <CardHeader>
          <Text fontWeight="bold" fontSize="lg" color="gray.800">Ready to Book?</Text>
        </CardHeader>
        <CardBody>
          <VStack spacing={4}>
            <Button
              variant="outline"
              size="lg"
              w="full"
              leftIcon={<Icon as={ChatBubbleLeftRightIcon} />}
              onClick={handleWhatsApp}
              _hover={{ transform: 'translateY(-2px)' }}
              transition="all 0.2s"
            >
              Book via WhatsApp
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              w="full"
              leftIcon={<Icon as={EnvelopeIcon} />}
              onClick={onBookNow}
              _hover={{ transform: 'translateY(-2px)' }}
              transition="all 0.2s"
            >
              Fill Booking Form
            </Button>
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  );
}
