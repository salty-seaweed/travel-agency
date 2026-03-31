import React from 'react';
import { Box, Text, VStack, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Table, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { usePackageDetailVariant } from '../../../../contexts/PackageDetailVariantContext';
import { formatItineraryTime } from '../../utils/packageSectionUtils';
import type { PackageItinerary as ItineraryType } from '../../../../types';

interface ItinerarySectionProps {
  itinerary: ItineraryType[];
  hideHeader?: boolean;
}

export function ItinerarySection({ itinerary, hideHeader }: ItinerarySectionProps) {
  const theme = usePackageDetailVariant();

  if (!itinerary || itinerary.length === 0) return null;

  return (
    <Accordion allowMultiple defaultIndex={[0]}>
      {itinerary.map((day, index) => {
        const dayNumber = day.day || index + 1;
        return (
          <AccordionItem key={`day-${dayNumber}-${day.title || ''}`} border="1px solid" borderColor="gray.200" borderRadius="md" mb={2}>
            <AccordionButton py={3} _hover={{ bg: 'gray.50' }}>
              <Box flex={1} textAlign="left">
                <Text as="span" fontWeight="semibold" color={theme.colors.textPrimary}>
                  Day {dayNumber}
                </Text>
                <Text as="span" ml={2} color={theme.colors.textSecondary}>
                  {day.title || `Day ${dayNumber}`}
                </Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <VStack align="stretch" spacing={4}>
                {day.description && (
                  <Text fontSize="sm" color={theme.colors.textSecondary} lineHeight="1.6">
                    {day.description}
                  </Text>
                )}
                <Table size="sm">
                  <Tbody>
                    {(day.start_time || day.end_time) && (
                      <Tr>
                        <Th w="80px">Time</Th>
                        <Td>{[day.start_time && formatItineraryTime(day.start_time), day.end_time && formatItineraryTime(day.end_time)].filter(Boolean).join(' – ')}</Td>
                      </Tr>
                    )}
                    {day.location && (
                      <Tr>
                        <Th>Location</Th>
                        <Td>{day.location}</Td>
                      </Tr>
                    )}
                    {day.activities?.length > 0 && (
                      <Tr>
                        <Th valign="top">Activities</Th>
                        <Td>{day.activities.join(', ')}</Td>
                      </Tr>
                    )}
                    {day.meals?.length > 0 && (
                      <Tr>
                        <Th>Meals</Th>
                        <Td>{day.meals.join(', ')}</Td>
                      </Tr>
                    )}
                    {day.accommodation && (
                      <Tr>
                        <Th>Accommodation</Th>
                        <Td>{day.accommodation}</Td>
                      </Tr>
                    )}
                    {day.transportation && (
                      <Tr>
                        <Th>Transport</Th>
                        <Td>{day.transportation}</Td>
                      </Tr>
                    )}
                  </Tbody>
                </Table>
              </VStack>
            </AccordionPanel>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
