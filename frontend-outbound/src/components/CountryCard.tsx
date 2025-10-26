import React from 'react';
import { Box, Image, Text, LinkBox, LinkOverlay, Heading } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { Country } from '../../types';

interface CountryCardProps {
  country: Country;
}

const CountryCard: React.FC<CountryCardProps> = ({ country }) => {
  const placeholderImage = 'https://via.placeholder.com/400x300.png?text=Destination';

  return (
    <LinkBox
      as="article"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="md"
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-5px)', boxShadow: 'xl' }}
    >
      <Image src={country.image || placeholderImage} alt={`Image of ${country.name}`} objectFit="cover" height="200px" width="100%" />
      <Box p="6">
        <Heading size="md" my="2">
          <LinkOverlay as={RouterLink} to={`/countries/${country.code.toLowerCase()}`}>
            {country.name}
          </LinkOverlay>
        </Heading>
        <Text noOfLines={2}>{country.description || `Explore the wonders of ${country.name}.`}</Text>
        <Text mt={4} color="gray.500" fontSize="sm">
          {country.packages_count} Tours Available
        </Text>
      </Box>
    </LinkBox>
  );
};

export default CountryCard;
