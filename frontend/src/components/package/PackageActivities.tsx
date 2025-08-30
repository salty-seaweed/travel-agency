import React from 'react';
import {
  Box,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Icon,
  SimpleGrid,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Progress,
  Tooltip,
} from '@chakra-ui/react';
import {
  ClockIcon,
  StarIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';
import { formatPrice } from '../../utils';
import type { PackageActivity } from '../../types';

interface PackageActivitiesProps {
  activities: PackageActivity[];
}

export function PackageActivities({ activities }: PackageActivitiesProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedActivity, setSelectedActivity] = React.useState<PackageActivity | null>(null);

  if (!activities || activities.length === 0) {
    return null;
  }

  const handleActivityClick = (activity: PackageActivity) => {
    setSelectedActivity(activity);
    onOpen();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'green';
      case 'moderate': return 'yellow';
      case 'challenging': return 'orange';
      case 'expert': return 'red';
      default: return 'gray';
    }
  };

  const getDifficultyProgress = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 25;
      case 'moderate': return 50;
      case 'challenging': return 75;
      case 'expert': return 100;
      default: return 25;
    }
  };

  const includedActivities = activities.filter(activity => activity.included);
  const optionalActivities = activities.filter(activity => !activity.included);

  return (
    <>
      <Card>
        <CardHeader>
          <HStack justify="space-between" align="center">
            <Heading size="md" color="gray.800">Activities & Experiences</Heading>
            <HStack spacing={2}>
              <Badge colorScheme="green" variant="subtle" fontSize="sm">
                {includedActivities.length} included
              </Badge>
              {optionalActivities.length > 0 && (
                <Badge colorScheme="orange" variant="subtle" fontSize="sm">
                  {optionalActivities.length} optional
                </Badge>
              )}
            </HStack>
          </HStack>
        </CardHeader>
        <CardBody>
          <VStack spacing={6} align="stretch">
            {/* Included Activities */}
            {includedActivities.length > 0 && (
              <Box>
                <HStack spacing={2} mb={4}>
                  <Icon as={CheckCircleIcon} h={5} w={5} color="green.500" />
                  <Text fontWeight="semibold" color="gray.800" fontSize="lg">
                    Included Activities
                  </Text>
                </HStack>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  {includedActivities.map((activity, index) => (
                    <ActivityCard
                      key={activity.id || index}
                      activity={activity}
                      onClick={() => handleActivityClick(activity)}
                      getDifficultyColor={getDifficultyColor}
                      getDifficultyProgress={getDifficultyProgress}
                    />
                  ))}
                </SimpleGrid>
              </Box>
            )}

            {/* Optional Activities */}
            {optionalActivities.length > 0 && (
              <Box>
                <HStack spacing={2} mb={4}>
                  <Icon as={InformationCircleIcon} h={5} w={5} color="orange.500" />
                  <Text fontWeight="semibold" color="gray.800" fontSize="lg">
                    Optional Activities
                  </Text>
                </HStack>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  {optionalActivities.map((activity, index) => (
                    <ActivityCard
                      key={activity.id || index}
                      activity={activity}
                      onClick={() => handleActivityClick(activity)}
                      getDifficultyColor={getDifficultyColor}
                      getDifficultyProgress={getDifficultyProgress}
                    />
                  ))}
                </SimpleGrid>
              </Box>
            )}
          </VStack>
        </CardBody>
      </Card>

      {/* Activity Detail Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="2xl" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedActivity?.name || 'Activity Details'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedActivity && (
              <VStack spacing={6} align="stretch">
                {/* Activity Header */}
                <Box>
                  <HStack justify="space-between" align="start" mb={3}>
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="bold" fontSize="xl" color="gray.800">
                        {selectedActivity.name}
                      </Text>
                      <HStack spacing={2}>
                        <Badge
                          colorScheme={selectedActivity.included ? "green" : "orange"}
                          variant="solid"
                        >
                          {selectedActivity.included ? "Included" : "Optional"}
                        </Badge>
                        {selectedActivity.category && (
                          <Badge colorScheme="blue" variant="subtle">
                            {selectedActivity.category}
                          </Badge>
                        )}
                      </HStack>
                    </VStack>
                    
                    {!selectedActivity.included && selectedActivity.price && (
                      <Text fontSize="2xl" fontWeight="bold" color="purple.600">
                        {formatPrice(parseFloat(selectedActivity.price))}
                      </Text>
                    )}
                  </HStack>

                  {selectedActivity.description && (
                    <Text color="gray.700" lineHeight="1.6">
                      {selectedActivity.description}
                    </Text>
                  )}
                </Box>

                {/* Activity Details */}
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  {/* Duration */}
                  {selectedActivity.duration && (
                    <Box p={4} bg="blue.50" borderRadius="md">
                      <HStack spacing={3}>
                        <Icon as={ClockIcon} h={5} w={5} color="blue.500" />
                        <VStack align="start" spacing={0}>
                          <Text fontSize="sm" color="gray.500">Duration</Text>
                          <Text fontWeight="medium" color="gray.800">
                            {selectedActivity.duration}
                          </Text>
                        </VStack>
                      </HStack>
                    </Box>
                  )}

                  {/* Difficulty */}
                  <Box p={4} bg="orange.50" borderRadius="md">
                    <HStack spacing={3}>
                      <Icon as={StarIcon} h={5} w={5} color="orange.500" />
                      <VStack align="start" spacing={1}>
                        <Text fontSize="sm" color="gray.500">Difficulty</Text>
                        <HStack spacing={2}>
                          <Text fontWeight="medium" color="gray.800" textTransform="capitalize">
                            {selectedActivity.difficulty}
                          </Text>
                          <Progress
                            value={getDifficultyProgress(selectedActivity.difficulty)}
                            size="sm"
                            colorScheme={getDifficultyColor(selectedActivity.difficulty)}
                            w="60px"
                            borderRadius="full"
                          />
                        </HStack>
                      </VStack>
                    </HStack>
                  </Box>

                  {/* Price (if optional) */}
                  {!selectedActivity.included && selectedActivity.price && (
                    <Box p={4} bg="purple.50" borderRadius="md">
                      <HStack spacing={3}>
                        <Icon as={CurrencyDollarIcon} h={5} w={5} color="purple.500" />
                        <VStack align="start" spacing={0}>
                          <Text fontSize="sm" color="gray.500">Price</Text>
                          <Text fontWeight="medium" color="gray.800">
                            {formatPrice(parseFloat(selectedActivity.price))}
                          </Text>
                        </VStack>
                      </HStack>
                    </Box>
                  )}

                  {/* Category */}
                  {selectedActivity.category && (
                    <Box p={4} bg="green.50" borderRadius="md">
                      <HStack spacing={3}>
                        <Icon as={InformationCircleIcon} h={5} w={5} color="green.500" />
                        <VStack align="start" spacing={0}>
                          <Text fontSize="sm" color="gray.500">Category</Text>
                          <Text fontWeight="medium" color="gray.800">
                            {selectedActivity.category}
                          </Text>
                        </VStack>
                      </HStack>
                    </Box>
                  )}
                </SimpleGrid>

                {/* Additional Information */}
                <Box p={4} bg="gray.50" borderRadius="md">
                  <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
                    What to expect:
                  </Text>
                  <Text fontSize="sm" color="gray.600" lineHeight="1.6">
                    {selectedActivity.description || 'Detailed information about this activity will be provided by your guide.'}
                  </Text>
                </Box>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

// Activity Card Component
interface ActivityCardProps {
  activity: PackageActivity;
  onClick: () => void;
  getDifficultyColor: (difficulty: string) => string;
  getDifficultyProgress: (difficulty: string) => number;
}

function ActivityCard({ activity, onClick, getDifficultyColor, getDifficultyProgress }: ActivityCardProps) {
  return (
    <Box
      p={4}
      border="1px solid"
      borderColor="gray.200"
      borderRadius="lg"
      bg="white"
      cursor="pointer"
      _hover={{
        borderColor: `${getDifficultyColor(activity.difficulty)}.300`,
        boxShadow: 'md',
        transform: 'translateY(-2px)'
      }}
      transition="all 0.2s"
      onClick={onClick}
    >
      <HStack justify="space-between" align="start" mb={3}>
        <VStack align="start" spacing={1} flex={1}>
          <Text fontWeight="semibold" color="gray.800" fontSize="md">
            {activity.name}
          </Text>
          <HStack spacing={2}>
            <Badge
              colorScheme={activity.included ? "green" : "orange"}
              variant="subtle"
              size="sm"
            >
              {activity.included ? "Included" : "Optional"}
            </Badge>
            {activity.category && (
              <Badge colorScheme="blue" variant="subtle" size="sm">
                {activity.category}
              </Badge>
            )}
          </HStack>
        </VStack>
        
        <Icon as={ArrowTopRightOnSquareIcon} h={4} w={4} color="gray.400" />
      </HStack>

      {activity.description && (
        <Text fontSize="sm" color="gray.600" mb={3} noOfLines={2}>
          {activity.description}
        </Text>
      )}

      <HStack spacing={4} fontSize="xs" color="gray.500">
        {activity.duration && (
          <HStack spacing={1}>
            <Icon as={ClockIcon} h={3} w={3} />
            <Text>{activity.duration}</Text>
          </HStack>
        )}
        
        <Tooltip label={`Difficulty: ${activity.difficulty}`}>
          <HStack spacing={1}>
            <Icon as={StarIcon} h={3} w={3} />
            <Text textTransform="capitalize">{activity.difficulty}</Text>
          </HStack>
        </Tooltip>
        
        {!activity.included && activity.price && (
          <HStack spacing={1}>
            <Icon as={CurrencyDollarIcon} h={3} w={3} />
            <Text>{formatPrice(parseFloat(activity.price))}</Text>
          </HStack>
        )}
      </HStack>
    </Box>
  );
}