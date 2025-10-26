import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  HStack,
  VStack,
  Text,
  Button,
  Icon,
  Image,
  SimpleGrid,
  Divider,
  Badge,
  useColorModeValue,
  IconButton,
} from '@chakra-ui/react';
import {
  XMarkIcon,
  CheckIcon,
  CalendarIcon,
  UsersIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import { useCurrency } from '../contexts/CurrencyContext';
import { useTranslation } from '../i18n';

interface ComparisonToolProps {
  packages: any[];
  onRemove: (id: number) => void;
  onClear: () => void;
}

export const ComparisonTool: React.FC<ComparisonToolProps> = ({
  packages,
  onRemove,
  onClear,
}) => {
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const { t } = useTranslation();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  if (packages.length === 0) {
    return null;
  }

  return (
    <Box
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      bg={bgColor}
      borderTop="2px solid"
      borderColor="sky.500"
      shadow="2xl"
      zIndex={100}
      py={4}
    >
      <Box maxW="7xl" mx="auto" px={4}>
        <VStack spacing={3}>
          {/* Header */}
          <HStack justify="space-between" w="full">
            <HStack spacing={3}>
              <Text fontSize="lg" fontWeight="bold">
                {t('comparison.title', 'Compare Packages')} ({packages.length}/4)
              </Text>
            </HStack>
            <HStack spacing={2}>
              {packages.length >= 2 && (
                <Button
                  size="sm"
                  colorScheme="sky"
                  onClick={() => navigate(`/compare?ids=${packages.map(p => p.id).join(',')}`)}
                  aria-label="View detailed comparison"
                >
                  Compare
                </Button>
              )}
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={onClear}
                aria-label="Clear all from comparison"
              >
                Clear All
              </Button>
            </HStack>
          </HStack>

          {/* Package Cards */}
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={3} w="full">
            {packages.map((pkg) => (
              <Box
                key={pkg.id}
                position="relative"
                bg="gray.50"
                borderRadius="lg"
                overflow="hidden"
                border="1px solid"
                borderColor={borderColor}
              >
                <IconButton
                  aria-label={`Remove ${pkg.name} from comparison`}
                  icon={<Icon as={XMarkIcon} />}
                  size="xs"
                  position="absolute"
                  top={1}
                  right={1}
                  zIndex={2}
                  bg="white"
                  shadow="sm"
                  onClick={() => onRemove(pkg.id)}
                />
                <Image 
                  src={pkg.image} 
                  h="80px" 
                  w="full" 
                  objectFit="cover"
                />
                <VStack p={2} spacing={1} align="start">
                  <Text fontSize="xs" fontWeight="bold" noOfLines={2}>
                    {pkg.name}
                  </Text>
                  <Text fontSize="sm" fontWeight="bold" color="emerald.600">
                    {formatPrice(parseFloat(pkg.price))}
                  </Text>
                </VStack>
              </Box>
            ))}
            
            {/* Empty slots */}
            {[...Array(Math.max(0, 4 - packages.length))].map((_, i) => (
              <Box
                key={`empty-${i}`}
                bg="gray.50"
                borderRadius="lg"
                border="2px dashed"
                borderColor="gray.300"
                h="140px"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text fontSize="xs" color="gray.400">
                  Add package
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </VStack>
      </Box>
    </Box>
  );
};
