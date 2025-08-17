import React from 'react';
import {
  VStack,
  HStack,
  Grid,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Button,
  Box,
  Text,
  IconButton,
  Badge,
  Flex,
  Checkbox,
} from '@chakra-ui/react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface ActivitiesFormProps {
  form: any;
  updateForm: (updates: any) => void;
}

export function ActivitiesForm({ form, updateForm }: ActivitiesFormProps) {
  const addActivity = () => {
    const newActivity = {
      name: '',
      description: '',
      duration: '',
      difficulty: 'easy',
      category: '',
      included: true,
      price: ''
    };
    
    updateForm({
      activities: [...form.activities, newActivity]
    });
  };

  const removeActivity = (index: number) => {
    const newActivities = form.activities.filter((_: any, i: number) => i !== index);
    updateForm({ activities: newActivities });
  };

  const updateActivity = (index: number, field: string, value: any) => {
    const newActivities = [...form.activities];
    newActivities[index] = {
      ...newActivities[index],
      [field]: value
    };
    updateForm({ activities: newActivities });
  };

  return (
    <VStack spacing={6} align="stretch">
      <Box>
        <Text fontSize="lg" fontWeight="semibold" color="gray.700" mb={2}>
          Activities & Experiences
        </Text>
        <Text fontSize="sm" color="gray.600" mb={4}>
          Define all activities and experiences included in this package
        </Text>
      </Box>

      {form.activities.length === 0 ? (
        <Box textAlign="center" py={8} border="2px dashed" borderColor="gray.200" borderRadius="lg">
          <Text color="gray.500" mb={4}>No activities added yet</Text>
          <Button
            leftIcon={<PlusIcon className="h-4 w-4" />}
            colorScheme="purple"
            onClick={addActivity}
          >
            Add First Activity
          </Button>
        </Box>
      ) : (
        <VStack spacing={6} align="stretch">
          {form.activities.map((activity: any, index: number) => (
            <Box key={index} border="1px solid" borderColor="gray.200" borderRadius="lg" p={6}>
              <Flex justify="space-between" align="center" mb={4}>
                <Text fontWeight="semibold" color="gray.700">
                  Activity {index + 1}
                </Text>
                <IconButton
                  aria-label="Remove activity"
                  icon={<TrashIcon className="h-4 w-4" />}
                  size="sm"
                  colorScheme="red"
                  variant="ghost"
                  onClick={() => removeActivity(index)}
                />
              </Flex>

              <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={6}>
                <VStack spacing={4} align="stretch">
                  <FormControl isRequired>
                    <FormLabel fontWeight="semibold" color="gray.700">
                      Activity Name
                    </FormLabel>
                    <Input
                      value={activity.name}
                      onChange={(e) => updateActivity(index, 'name', e.target.value)}
                      placeholder="e.g., Snorkeling Adventure"
                      size="lg"
                      borderRadius="lg"
                      focusBorderColor="purple.500"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel fontWeight="semibold" color="gray.700">
                      Description
                    </FormLabel>
                    <Textarea
                      value={activity.description}
                      onChange={(e) => updateActivity(index, 'description', e.target.value)}
                      placeholder="Describe the activity..."
                      size="lg"
                      borderRadius="lg"
                      focusBorderColor="purple.500"
                      rows={3}
                      resize="vertical"
                    />
                  </FormControl>

                  <Grid templateColumns="1fr 1fr" gap={4}>
                    <FormControl>
                      <FormLabel fontWeight="semibold" color="gray.700">
                        Duration
                      </FormLabel>
                      <Input
                        value={activity.duration}
                        onChange={(e) => updateActivity(index, 'duration', e.target.value)}
                        placeholder="e.g., 2 hours"
                        size="lg"
                        borderRadius="lg"
                        focusBorderColor="purple.500"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel fontWeight="semibold" color="gray.700">
                        Difficulty
                      </FormLabel>
                      <Select
                        value={activity.difficulty}
                        onChange={(e) => updateActivity(index, 'difficulty', e.target.value)}
                        size="lg"
                        borderRadius="lg"
                        focusBorderColor="purple.500"
                      >
                        <option value="easy">Easy</option>
                        <option value="moderate">Moderate</option>
                        <option value="challenging">Challenging</option>
                      </Select>
                    </FormControl>
                  </Grid>
                </VStack>

                <VStack spacing={4} align="stretch">
                  <FormControl>
                    <FormLabel fontWeight="semibold" color="gray.700">
                      Category
                    </FormLabel>
                    <Select
                      value={activity.category}
                      onChange={(e) => updateActivity(index, 'category', e.target.value)}
                      size="lg"
                      borderRadius="lg"
                      focusBorderColor="purple.500"
                    >
                      <option value="">Select Category</option>
                      <option value="Water Sports">Water Sports</option>
                      <option value="Adventure">Adventure</option>
                      <option value="Cultural">Cultural</option>
                      <option value="Relaxation">Relaxation</option>
                      <option value="Dining">Dining</option>
                      <option value="Sightseeing">Sightseeing</option>
                      <option value="Wellness">Wellness</option>
                      <option value="Photography">Photography</option>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel fontWeight="semibold" color="gray.700">
                      Included in Package
                    </FormLabel>
                    <Checkbox
                      isChecked={activity.included}
                      onChange={(e) => updateActivity(index, 'included', e.target.checked)}
                      colorScheme="purple"
                      size="lg"
                    >
                      <Text fontSize="sm">This activity is included in the package price</Text>
                    </Checkbox>
                  </FormControl>

                  {!activity.included && (
                    <FormControl>
                      <FormLabel fontWeight="semibold" color="gray.700">
                        Additional Price
                      </FormLabel>
                      <Input
                        value={activity.price}
                        onChange={(e) => updateActivity(index, 'price', e.target.value)}
                        placeholder="0.00"
                        size="lg"
                        borderRadius="lg"
                        focusBorderColor="purple.500"
                        type="number"
                        min="0"
                        step="0.01"
                      />
                    </FormControl>
                  )}

                  <Box>
                    <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
                      Activity Status
                    </Text>
                    <Flex gap={2}>
                      <Badge 
                        colorScheme={activity.included ? "green" : "orange"} 
                        variant="subtle"
                      >
                        {activity.included ? "Included" : "Optional"}
                      </Badge>
                      <Badge 
                        colorScheme={
                          activity.difficulty === 'easy' ? 'green' : 
                          activity.difficulty === 'moderate' ? 'yellow' : 'red'
                        } 
                        variant="subtle"
                      >
                        {activity.difficulty}
                      </Badge>
                    </Flex>
                  </Box>
                </VStack>
              </Grid>
            </Box>
          ))}

          <Button
            leftIcon={<PlusIcon className="h-4 w-4" />}
            colorScheme="purple"
            variant="outline"
            onClick={addActivity}
            size="lg"
          >
            Add Another Activity
          </Button>
        </VStack>
      )}
    </VStack>
  );
}
