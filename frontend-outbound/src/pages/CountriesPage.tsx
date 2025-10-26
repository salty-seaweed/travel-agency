import React, { useState } from 'react';
import { Box, Heading, SimpleGrid, Spinner, Alert, AlertIcon, Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { getContinents, getCountries } from '../services/api';
import CountryCard from '../components/CountryCard';

const CountriesPage: React.FC = () => {
  const [selectedContinent, setSelectedContinent] = useState<number | undefined>(undefined);

  const { data: continents, isLoading: continentsLoading, isError: continentsError } = useQuery({
    queryKey: ['continents'],
    queryFn: getContinents,
  });

  const { data: countries, isLoading: countriesLoading, isError, error } = useQuery({
    queryKey: ['countries', selectedContinent],
    queryFn: () => getCountries(selectedContinent),
  });

  const handleTabChange = (index: number) => {
    // Assuming the first tab is "All"
    if (index === 0) {
      setSelectedContinent(undefined);
    } else {
      // Ensure continents is an array before accessing it
      const continentsArray = Array.isArray(continents) ? continents : [];
      setSelectedContinent(continentsArray?.[index - 1]?.id);
    }
  };

  if (continentsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (continentsError) {
    return (
      <Alert status="error">
        <AlertIcon />
        Error loading continents: {(continentsError as Error).message}
      </Alert>
    );
  }

  return (
    <Box>
      <Heading as="h1" size="2xl" mb={8} textAlign="center">
        Explore Our Destinations
      </Heading>

      <Tabs onChange={handleTabChange} variant="soft-rounded" colorScheme="blue">
        <TabList mb={6}>
          <Tab>All</Tab>
          {Array.isArray(continents) && continents.map((continent) => (
            <Tab key={continent.id}>{continent.name}</Tab>
          ))}
        </TabList>
        <TabPanels>
          <TabPanel>
            {countriesLoading && <Spinner />}
            {isError && <Alert status="error"><AlertIcon />{(error as Error).message}</Alert>}
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
              {Array.isArray(countries) && countries.map((country) => (
                <CountryCard key={country.id} country={country} />
              ))}
            </SimpleGrid>
          </TabPanel>
          {Array.isArray(continents) && continents.map((continent) => (
            <TabPanel key={continent.id}>
              {countriesLoading && <Spinner />}
              {isError && <Alert status="error"><AlertIcon />{(error as Error).message}</Alert>}
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
                {Array.isArray(countries) && countries.map((country) => (
                  <CountryCard key={country.id} country={country} />
                ))}
              </SimpleGrid>
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default CountriesPage;
