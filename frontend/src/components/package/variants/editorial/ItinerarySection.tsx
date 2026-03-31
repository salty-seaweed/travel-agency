import React from 'react';
import { Box, Text, VStack, HStack, List, ListItem, ListIcon } from '@chakra-ui/react';
import { CheckCircleIcon, ClockIcon, CakeIcon, HomeIcon, TruckIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { Icon } from '@chakra-ui/react';
import { usePackageDetailVariant } from '../../../../contexts/PackageDetailVariantContext';
import { formatItineraryTime, getDayColor } from '../../utils/packageSectionUtils';
import type { PackageItinerary as ItineraryType } from '../../../../types';

interface ItinerarySectionProps {
  itinerary: ItineraryType[];
  hideHeader?: boolean;
}

export function ItinerarySection({ itinerary, hideHeader }: ItinerarySectionProps) {
  const theme = usePackageDetailVariant();

  if (!itinerary || itinerary.length === 0) return null;

  return (
    <VStack align="stretch" spacing={0}>
      {itinerary.map((day, index) => {
        const dayNumber = day.day || index + 1;
        const colorScheme = getDayColor(dayNumber);
        return (
          <Box key={`day-${dayNumber}-${day.title || ''}`} position="relative" pl={{ base: 12, md: 24 }} pb={10}>
            <Box
              position="absolute"
              left={0}
              top={0}
              fontSize={{ base: '2xl', md: '4xl' }}
              fontWeight="bold"
              color={`${colorScheme}.400`}
              fontFamily={theme.fonts.heading}
            >
              {String(dayNumber).padStart(2, '0')}
            </Box>
            {index < itinerary.length - 1 && (
              <Box
                position="absolute"
                left={{ base: 5, md: 11 }}
                top={12}
                bottom={-8}
                w="1px"
                bg="gray.200"
              />
            )}
            <Box>
              <Text fontFamily={theme.fonts.heading} fontWeight="semibold" color={theme.colors.textPrimary} fontSize="lg">
                {day.title || `Day ${dayNumber}`}
              </Text>
              {(day.start_time || day.end_time) && (
                <HStack spacing={2} mt={1} fontSize="sm" color={theme.colors.textSecondary}>
                  <Icon as={ClockIcon} h={4} w={4} />
                  {day.start_time && <Text>{formatItineraryTime(day.start_time)}</Text>}
                  {day.start_time && day.end_time && <Text>–</Text>}
                  {day.end_time && <Text>{formatItineraryTime(day.end_time)}</Text>}
                </HStack>
              )}
              {day.description && (
                <Text mt={3} color={theme.colors.textSecondary} lineHeight="1.7">
                  {day.description}
                </Text>
              )}
              {(day.activities?.length > 0 || day.experience_details?.length) && (
                <List spacing={1} mt={3}>
                  {(!day.experience_details || day.experience_details.length === 0)
                    ? day.activities?.map((a, i) => (
                        <ListItem key={i} fontSize="sm" color={theme.colors.textSecondary}>
                          <ListIcon as={CheckCircleIcon} color={`${colorScheme}.500`} />
                          {a}
                        </ListItem>
                      ))
                    : day.experience_details?.map((exp, i) => (
                        <ListItem key={i} fontSize="sm" color={theme.colors.textSecondary}>
                          <ListIcon as={CheckCircleIcon} color={exp.included ? 'green.500' : 'orange.500'} />
                          {exp.name}
                          {exp.duration && ` · ${exp.duration}`}
                        </ListItem>
                      ))}
                </List>
              )}
              {day.meals?.length > 0 && (
                <HStack mt={2} spacing={2}>
                  <Icon as={CakeIcon} h={4} w={4} color="orange.500" />
                  <Text fontSize="sm" color={theme.colors.textSecondary}>{day.meals.join(', ')}</Text>
                </HStack>
              )}
              {day.accommodation && (
                <HStack mt={2} spacing={2}>
                  <Icon as={HomeIcon} h={4} w={4} color="green.500" />
                  <Text fontSize="sm" color={theme.colors.textSecondary}>{day.accommodation}</Text>
                </HStack>
              )}
              {day.transportation && (
                <HStack mt={2} spacing={2}>
                  <Icon as={TruckIcon} h={4} w={4} color="blue.500" />
                  <Text fontSize="sm" color={theme.colors.textSecondary}>{day.transportation}</Text>
                </HStack>
              )}
              {day.location && (
                <HStack mt={2} spacing={2}>
                  <Icon as={MapPinIcon} h={4} w={4} color="gray.500" />
                  <Text fontSize="sm" color={theme.colors.textSecondary}>{day.location}</Text>
                </HStack>
              )}
            </Box>
          </Box>
        );
      })}
    </VStack>
  );
}
