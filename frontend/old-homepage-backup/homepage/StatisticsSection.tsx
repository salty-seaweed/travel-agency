import React, { useMemo } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Heading,
  Badge,
  SimpleGrid,
  Icon,
} from '@chakra-ui/react';
import { ChartBarIcon } from '@heroicons/react/24/outline';

interface StatisticData {
  id?: number;
  label: string;
  value: string;
  description: string;
  order: number;
  is_active: boolean;
}

interface StatisticsSectionProps {
  statistics?: StatisticData[];
}

export const StatisticsSection: React.FC<StatisticsSectionProps> = React.memo(({ statistics = [] }) => {
  // Filter active statistics and sort by order - memoized for performance
  const activeStatistics = useMemo(() => 
    statistics
      .filter(statistic => statistic.is_active)
      .sort((a, b) => a.order - b.order),
    [statistics]
  );

  // If no statistics from database, don't render the section
  if (activeStatistics.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-gradient-to-r from-blue-800 via-indigo-800 to-blue-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 animate-float">
          <Icon as={ChartBarIcon} className="w-16 h-16 text-white" />
        </div>
        <div className="absolute top-20 right-20 animate-float-delayed">
          <Icon as={ChartBarIcon} className="w-12 h-12 text-white" />
        </div>
        <div className="absolute bottom-20 left-20 animate-float-slow">
          <Icon as={ChartBarIcon} className="w-20 h-20 text-white" />
        </div>
        <div className="absolute bottom-10 right-10 animate-float">
          <Icon as={ChartBarIcon} className="w-24 h-24 text-yellow-400" />
        </div>
      </div>
      
      <Container maxW="7xl" className="relative z-10">
        <VStack spacing={16} mb={16} textAlign="center">
          <Badge 
            className="bg-white/20 backdrop-blur-md text-white px-6 py-2 rounded-full text-sm font-bold border border-white/30"
          >
            <Icon as={ChartBarIcon} className="w-4 h-4 mr-2" />
            Our Numbers
          </Badge>
          
          <Heading size="2xl" className="text-5xl md:text-6xl font-bold text-white">
            Thread Travels by the Numbers
          </Heading>
          
          <Text className="text-xl text-blue-200 max-w-4xl mx-auto leading-relaxed">
            We're proud of our track record in creating unforgettable Maldives experiences for our valued customers.
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={8}>
          {activeStatistics.map((statistic, index) => (
            <div key={statistic.id || index} className="text-center group hover:-translate-y-2 transition-all duration-500">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 group-hover:border-white/40 transition-all duration-500">
                <VStack spacing={4}>
                  <Text className="text-4xl md:text-5xl font-bold text-white group-hover:scale-110 transition-transform duration-300">
                    {statistic.value}
                  </Text>
                  <Text className="text-lg font-semibold text-blue-200">
                    {statistic.label}
                  </Text>
                  <Text className="text-sm text-blue-100">
                    {statistic.description}
                  </Text>
                </VStack>
              </div>
            </div>
          ))}
        </SimpleGrid>
      </Container>
    </section>
  );
}); 