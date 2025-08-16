import React from 'react';
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
} from '@chakra-ui/react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface AdditionalInfoFormProps {
  form: any;
  updateForm: (updates: any) => void;
}

export function AdditionalInfoForm({ form, updateForm }: AdditionalInfoFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateForm({ [name]: value });
  };

  const addWhatToBring = () => {
    updateForm({
      what_to_bring: [...form.what_to_bring, '']
    });
  };

  const removeWhatToBring = (index: number) => {
    const newList = form.what_to_bring.filter((_: any, i: number) => i !== index);
    updateForm({ what_to_bring: newList });
  };

  const updateWhatToBring = (index: number, value: string) => {
    const newList = [...form.what_to_bring];
    newList[index] = value;
    updateForm({ what_to_bring: newList });
  };

  const addImportantNote = () => {
    updateForm({
      important_notes: [...form.important_notes, '']
    });
  };

  const removeImportantNote = (index: number) => {
    const newList = form.important_notes.filter((_: any, i: number) => i !== index);
    updateForm({ important_notes: newList });
  };

  const updateImportantNote = (index: number, value: string) => {
    const newList = [...form.important_notes];
    newList[index] = value;
    updateForm({ important_notes: newList });
  };

  return (
    <VStack spacing={8} align="stretch">
      {/* Best Time to Visit & Weather */}
      <Box>
        <Text fontSize="lg" fontWeight="semibold" color="gray.700" mb={4}>
          Best Time to Visit & Weather
        </Text>
        
        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={6}>
          <FormControl>
            <FormLabel fontWeight="semibold" color="gray.700">
              Best Time to Visit
            </FormLabel>
            <Textarea
              name="best_time_to_visit"
              value={form.best_time_to_visit}
              onChange={handleChange}
              placeholder="e.g., December to April (dry season with calm seas and sunny weather)"
              size="lg"
              borderRadius="lg"
              focusBorderColor="purple.500"
              rows={3}
              resize="vertical"
            />
          </FormControl>

          <FormControl>
            <FormLabel fontWeight="semibold" color="gray.700">
              Weather Information
            </FormLabel>
            <Textarea
              name="weather_info"
              value={form.weather_info}
              onChange={handleChange}
              placeholder="e.g., Tropical climate with average temperatures of 25-30°C year-round"
              size="lg"
              borderRadius="lg"
              focusBorderColor="purple.500"
              rows={3}
              resize="vertical"
            />
          </FormControl>
        </Grid>
      </Box>

      <Divider />

      {/* What to Bring */}
      <Box>
        <Text fontSize="lg" fontWeight="semibold" color="gray.700" mb={4}>
          What to Bring
        </Text>
        <Text fontSize="sm" color="gray.600" mb={4}>
          List essential items that guests should pack for this package
        </Text>

        {form.what_to_bring.length === 0 ? (
          <Box textAlign="center" py={6} border="2px dashed" borderColor="gray.200" borderRadius="lg">
            <Text color="gray.500" mb={3}>No items added yet</Text>
            <Button
              leftIcon={<PlusIcon className="h-4 w-4" />}
              colorScheme="purple"
              size="sm"
              onClick={addWhatToBring}
            >
              Add First Item
            </Button>
          </Box>
        ) : (
          <VStack spacing={3} align="stretch">
            {form.what_to_bring.map((item: string, index: number) => (
              <HStack key={index} spacing={3}>
                <Input
                  value={item}
                  onChange={(e) => updateWhatToBring(index, e.target.value)}
                  placeholder="e.g., Swimwear, sunscreen, snorkeling gear"
                  size="lg"
                  borderRadius="lg"
                  focusBorderColor="purple.500"
                />
                <IconButton
                  aria-label="Remove item"
                  icon={<TrashIcon className="h-4 w-4" />}
                  size="lg"
                  colorScheme="red"
                  variant="ghost"
                  onClick={() => removeWhatToBring(index)}
                />
              </HStack>
            ))}
            <Button
              leftIcon={<PlusIcon className="h-4 w-4" />}
              colorScheme="purple"
              variant="outline"
              onClick={addWhatToBring}
              size="lg"
            >
              Add Another Item
            </Button>
          </VStack>
        )}
      </Box>

      <Divider />

      {/* Important Notes */}
      <Box>
        <Text fontSize="lg" fontWeight="semibold" color="gray.700" mb={4}>
          Important Notes
        </Text>
        <Text fontSize="sm" color="gray.600" mb={4}>
          Add important information, restrictions, or special requirements
        </Text>

        {form.important_notes.length === 0 ? (
          <Box textAlign="center" py={6} border="2px dashed" borderColor="gray.200" borderRadius="lg">
            <Text color="gray.500" mb={3}>No notes added yet</Text>
            <Button
              leftIcon={<PlusIcon className="h-4 w-4" />}
              colorScheme="purple"
              size="sm"
              onClick={addImportantNote}
            >
              Add First Note
            </Button>
          </Box>
        ) : (
          <VStack spacing={3} align="stretch">
            {form.important_notes.map((note: string, index: number) => (
              <HStack key={index} spacing={3}>
                <Textarea
                  value={note}
                  onChange={(e) => updateImportantNote(index, e.target.value)}
                  placeholder="e.g., Minimum age requirement: 12 years old"
                  size="lg"
                  borderRadius="lg"
                  focusBorderColor="purple.500"
                  rows={2}
                  resize="vertical"
                />
                <IconButton
                  aria-label="Remove note"
                  icon={<TrashIcon className="h-4 w-4" />}
                  size="lg"
                  colorScheme="red"
                  variant="ghost"
                  onClick={() => removeImportantNote(index)}
                />
              </HStack>
            ))}
            <Button
              leftIcon={<PlusIcon className="h-4 w-4" />}
              colorScheme="purple"
              variant="outline"
              onClick={addImportantNote}
              size="lg"
            >
              Add Another Note
            </Button>
          </VStack>
        )}
      </Box>

      <Divider />

      {/* Summary */}
      <Box p={4} bg="blue.50" borderRadius="lg" border="1px solid" borderColor="blue.200">
        <Text fontSize="sm" fontWeight="semibold" color="blue.700" mb={3}>
          Information Summary
        </Text>
        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr 1fr' }} gap={4}>
          <Box>
            <Text fontSize="xs" color="blue.600">What to Bring</Text>
            <Text fontSize="lg" fontWeight="bold" color="blue.700">
              {form.what_to_bring.length} items
            </Text>
          </Box>
          <Box>
            <Text fontSize="xs" color="blue.600">Important Notes</Text>
            <Text fontSize="lg" fontWeight="bold" color="blue.700">
              {form.important_notes.length} notes
            </Text>
          </Box>
          <Box>
            <Text fontSize="xs" color="blue.600">Weather Info</Text>
            <Text fontSize="lg" fontWeight="bold" color="blue.700">
              {form.weather_info ? 'Added' : 'Not added'}
            </Text>
          </Box>
        </Grid>
      </Box>
    </VStack>
  );
}
