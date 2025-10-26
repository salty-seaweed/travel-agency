import React, { useMemo, useState } from 'react';
import {
  VStack,
  HStack,
  Grid,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  Box,
  Text,
  IconButton,
  Divider,
  Badge,
  Flex,
  Tag,
  TagLabel,
  TagCloseButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
} from '@chakra-ui/react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface ItineraryFormProps {
  form: any;
  updateForm: (updates: any) => void;
}

export function ItineraryForm({ form, updateForm }: ItineraryFormProps) {
  const [search, setSearch] = useState<string>('');
  const allActivities = useMemo(() => (form.activities || []).map((a: any, i: number) => ({ id: a.id || i + 1, name: a.name })), [form.activities]);
  const getAllActivities = () => allActivities;

  const addDay = () => {
    const newDay = {
      day: form.itinerary.length + 1,
      title: '',
      description: '',
      activities: [''],
      meals: [''],
      accommodation: '',
      transportation: ''
    };
    
    updateForm({
      itinerary: [...form.itinerary, newDay]
    });
  };

  const removeDay = (index: number) => {
    const newItinerary = form.itinerary.filter((_: any, i: number) => i !== index);
    // Reorder days
    const reorderedItinerary = newItinerary.map((day: any, i: number) => ({
      ...day,
      day: i + 1
    }));
    
    updateForm({ itinerary: reorderedItinerary });
  };

  const updateDay = (index: number, field: string, value: any) => {
    const newItinerary = [...form.itinerary];
    newItinerary[index] = {
      ...newItinerary[index],
      [field]: value
    };
    updateForm({ itinerary: newItinerary });
  };

  const updateArrayField = (dayIndex: number, field: 'activities' | 'meals', itemIndex: number, value: string) => {
    const newItinerary = [...form.itinerary];
    newItinerary[dayIndex][field][itemIndex] = value;
    updateForm({ itinerary: newItinerary });
  };

  const addArrayItem = (dayIndex: number, field: 'activities' | 'meals') => {
    const newItinerary = [...form.itinerary];
    newItinerary[dayIndex][field].push('');
    updateForm({ itinerary: newItinerary });
  };

  const removeArrayItem = (dayIndex: number, field: 'activities' | 'meals', itemIndex: number) => {
    const newItinerary = [...form.itinerary];
    newItinerary[dayIndex][field] = newItinerary[dayIndex][field].filter((_: any, i: number) => i !== itemIndex);
    updateForm({ itinerary: newItinerary });
  };

  return (
    <VStack spacing={6} align="stretch">
      <Box>
        <Text fontSize="lg" fontWeight="semibold" color="gray.700" mb={2}>
          Daily Itinerary
        </Text>
        <Text fontSize="sm" color="gray.600" mb={4}>
          Create a detailed day-by-day breakdown of the package experience
        </Text>
      </Box>

      {form.itinerary.length === 0 ? (
        <Box textAlign="center" py={8} border="2px dashed" borderColor="gray.200" borderRadius="lg">
          <Text color="gray.500" mb={4}>No itinerary days added yet</Text>
          <Button
            leftIcon={<PlusIcon className="h-4 w-4" />}
            colorScheme="purple"
            onClick={addDay}
          >
            Add First Day
          </Button>
        </Box>
      ) : (
        <VStack spacing={6} align="stretch">
          {form.itinerary.map((day: any, dayIndex: number) => (
            <Box key={dayIndex} border="1px solid" borderColor="gray.200" borderRadius="lg" p={6}>
              <Flex justify="space-between" align="center" mb={4}>
                <Badge colorScheme="purple" variant="subtle" fontSize="md">
                  Day {day.day}
                </Badge>
                <IconButton
                  aria-label="Remove day"
                  icon={<TrashIcon className="h-4 w-4" />}
                  size="sm"
                  colorScheme="red"
                  variant="ghost"
                  onClick={() => removeDay(dayIndex)}
                />
              </Flex>

              <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={6}>
                <VStack spacing={4} align="stretch">
                  <FormControl>
                    <FormLabel fontWeight="semibold" color="gray.700">
                      Day Title
                    </FormLabel>
                    <Input
                      value={day.title}
                      onChange={(e) => updateDay(dayIndex, 'title', e.target.value)}
                      placeholder="e.g., Arrival & Welcome Dinner"
                      size="lg"
                      borderRadius="lg"
                      focusBorderColor="purple.500"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel fontWeight="semibold" color="gray.700">
                      Day Description
                    </FormLabel>
                    <Textarea
                      value={day.description}
                      onChange={(e) => updateDay(dayIndex, 'description', e.target.value)}
                      placeholder="Describe what happens on this day..."
                      size="lg"
                      borderRadius="lg"
                      focusBorderColor="purple.500"
                      rows={3}
                      resize="vertical"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel fontWeight="semibold" color="gray.700">
                      Accommodation
                    </FormLabel>
                    <Input
                      value={day.accommodation}
                      onChange={(e) => updateDay(dayIndex, 'accommodation', e.target.value)}
                      placeholder="e.g., Beachfront Villa"
                      size="lg"
                      borderRadius="lg"
                      focusBorderColor="purple.500"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel fontWeight="semibold" color="gray.700">
                      Transportation
                    </FormLabel>
                    <Input
                      value={day.transportation}
                      onChange={(e) => updateDay(dayIndex, 'transportation', e.target.value)}
                      placeholder="e.g., Speedboat transfer"
                      size="lg"
                      borderRadius="lg"
                      focusBorderColor="purple.500"
                    />
                  </FormControl>
                </VStack>

                <VStack spacing={4} align="stretch">
                  {/* Activities (free text) */}
                  <Box>
                    <Flex justify="space-between" align="center" mb={2}>
                      <FormLabel fontWeight="semibold" color="gray.700" mb={0}>
                        Activities
                      </FormLabel>
                      <Button
                        size="sm"
                        leftIcon={<PlusIcon className="h-3 w-3" />}
                        colorScheme="blue"
                        variant="ghost"
                        onClick={() => addArrayItem(dayIndex, 'activities')}
                      >
                        Add
                      </Button>
                    </Flex>
                    <VStack spacing={2} align="stretch">
                      {day.activities.map((activity: string, activityIndex: number) => (
                        <Flex key={activityIndex} gap={2}>
                          <Input
                            value={activity}
                            onChange={(e) => updateArrayField(dayIndex, 'activities', activityIndex, e.target.value)}
                            placeholder="e.g., Snorkeling at coral reef"
                            size="md"
                            borderRadius="lg"
                            focusBorderColor="purple.500"
                          />
                          <IconButton
                            aria-label="Remove activity"
                            icon={<TrashIcon className="h-3 w-3" />}
                            size="sm"
                            colorScheme="red"
                            variant="ghost"
                            onClick={() => removeArrayItem(dayIndex, 'activities', activityIndex)}
                          />
                        </Flex>
                      ))}
                    </VStack>
                  </Box>

                  {/* Linked Activities (picker) */}
                  <Box>
                    <FormLabel fontWeight="semibold" color="gray.700" mb={1}>
                      Link Existing Activities (optional)
                    </FormLabel>
                    <Popover placement="bottom-start">
                      <PopoverTrigger>
                        <Button size="sm" variant="outline" colorScheme="purple">
                          Add from existing
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent w="sm">
                        <PopoverArrow />
                        <PopoverBody>
                          <Input
                            placeholder="Search activities..."
                            size="sm"
                            borderRadius="md"
                            mb={2}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            focusBorderColor="purple.500"
                          />
                          <VStack align="stretch" spacing={1} maxH="240px" overflowY="auto">
                            {getAllActivities()
                              .filter((opt: any) => !search || (opt.name || '').toLowerCase().includes(search.toLowerCase()))
                              .map((opt: any) => (
                              <Button
                                key={opt.id}
                                size="sm"
                                justifyContent="flex-start"
                                onClick={() => {
                                  const current = day.activity_ids || [];
                                  if (!current.includes(opt.id)) {
                                    updateDay(dayIndex, 'activity_ids', [...current, opt.id]);
                                  }
                                }}
                                variant="ghost"
                              >
                                {opt.name}
                              </Button>
                              ))}
                          </VStack>
                        </PopoverBody>
                      </PopoverContent>
                    </Popover>

                    {/* Selected tags */}
                    <HStack spacing={2} mt={2} wrap="wrap">
                      {(day.activity_ids || []).map((id: number) => {
                        const match = getAllActivities().find((a: any) => a.id === id);
                        const label = match ? match.name : `#${id}`;
                        return (
                          <Tag key={id} colorScheme="purple" variant="subtle" borderRadius="full">
                            <TagLabel>{label}</TagLabel>
                            <TagCloseButton onClick={() => updateDay(dayIndex, 'activity_ids', (day.activity_ids || []).filter((x: number) => x !== id))} />
                          </Tag>
                        );
                      })}
                    </HStack>
                  </Box>

                  {/* Meals */}
                  <Box>
                    <Flex justify="space-between" align="center" mb={2}>
                      <FormLabel fontWeight="semibold" color="gray.700" mb={0}>
                        Meals
                      </FormLabel>
                      <Button
                        size="sm"
                        leftIcon={<PlusIcon className="h-3 w-3" />}
                        colorScheme="green"
                        variant="ghost"
                        onClick={() => addArrayItem(dayIndex, 'meals')}
                      >
                        Add
                      </Button>
                    </Flex>
                    <VStack spacing={2} align="stretch">
                      {day.meals.map((meal: string, mealIndex: number) => (
                        <Flex key={mealIndex} gap={2}>
                          <Input
                            value={meal}
                            onChange={(e) => updateArrayField(dayIndex, 'meals', mealIndex, e.target.value)}
                            placeholder="e.g., Breakfast at resort"
                            size="md"
                            borderRadius="lg"
                            focusBorderColor="purple.500"
                          />
                          <IconButton
                            aria-label="Remove meal"
                            icon={<TrashIcon className="h-3 w-3" />}
                            size="sm"
                            colorScheme="red"
                            variant="ghost"
                            onClick={() => removeArrayItem(dayIndex, 'meals', mealIndex)}
                          />
                        </Flex>
                      ))}
                    </VStack>
                  </Box>
                </VStack>
              </Grid>
            </Box>
          ))}

          <Button
            leftIcon={<PlusIcon className="h-4 w-4" />}
            colorScheme="purple"
            variant="outline"
            onClick={addDay}
            size="lg"
          >
            Add Another Day
          </Button>
        </VStack>
      )}
    </VStack>
  );
}
