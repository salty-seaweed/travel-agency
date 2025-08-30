import React from 'react';
import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  HStack,
  Text,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { ChevronDownIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { useCurrency } from '../contexts/CurrencyContext';

interface CurrencySelectorProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'solid' | 'outline' | 'ghost';
  showLabel?: boolean;
}

export function CurrencySelector({ 
  size = 'md', 
  variant = 'outline',
  showLabel = true 
}: CurrencySelectorProps) {
  const { selectedCurrency, currencies, changeCurrency } = useCurrency();
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon className="w-4 h-4" />}
        size={size}
        variant={variant}
        borderColor={borderColor}
        _hover={{ bg: hoverBg }}
      >
        <HStack spacing={2}>
          <Icon as={CurrencyDollarIcon} className="w-4 h-4" />
          <Text fontSize={size === 'sm' ? 'sm' : 'md'}>
            {selectedCurrency.symbol} {selectedCurrency.code}
          </Text>
          {showLabel && size !== 'sm' && (
            <Text fontSize="sm" color="gray.500">
              ({selectedCurrency.name})
            </Text>
          )}
        </HStack>
      </MenuButton>
      <MenuList maxH="300px" overflowY="auto">
        {currencies.map((currency) => (
          <MenuItem
            key={currency.code}
            onClick={() => changeCurrency(currency.code)}
            bg={selectedCurrency.code === currency.code ? 'blue.50' : 'transparent'}
            _hover={{ bg: selectedCurrency.code === currency.code ? 'blue.100' : hoverBg }}
          >
            <HStack spacing={3} w="full">
              <Text fontWeight="medium" minW="12">
                {currency.symbol}
              </Text>
              <Box flex={1}>
                <Text fontSize="sm" fontWeight="medium">
                  {currency.code}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  {currency.name}
                </Text>
              </Box>
              {selectedCurrency.code === currency.code && (
                <Box w={2} h={2} bg="blue.500" borderRadius="full" />
              )}
            </HStack>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
