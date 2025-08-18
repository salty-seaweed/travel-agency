import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Card,
  CardBody,
  IconButton,
  Badge,
} from '@chakra-ui/react';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

interface Statistic {
  id?: number;
  label: string;
  value: string;
  icon: string;
  order: number;
  is_active: boolean;
}

interface StatisticsEditorProps {
  data?: Statistic[];
  onChange: () => void;
}

export const StatisticsEditor: React.FC<StatisticsEditorProps> = ({ data = [], onChange }) => {
  const [statistics, setStatistics] = useState<Statistic[]>(data);

  const addStatistic = () => {
    const newStatistic: Statistic = {
      label: '',
      value: '',
      icon: '',
      order: statistics.length,
      is_active: true,
    };
    setStatistics([...statistics, newStatistic]);
    onChange();
  };

  const removeStatistic = (index: number) => {
    setStatistics(statistics.filter((_, i) => i !== index));
    onChange();
  };

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <Text fontSize="xl" fontWeight="bold">
            Statistics Management
          </Text>
          <Button
            leftIcon={<PlusIcon className="w-5 h-5" />}
            colorScheme="blue"
            onClick={addStatistic}
          >
            Add Statistic
          </Button>
        </HStack>

        {statistics.length === 0 ? (
          <Card>
            <CardBody>
              <VStack spacing={4}>
                <Text color="gray.500">No statistics added yet</Text>
                <Button
                  leftIcon={<PlusIcon className="w-5 h-5" />}
                  variant="outline"
                  onClick={addStatistic}
                >
                  Add Your First Statistic
                </Button>
              </VStack>
            </CardBody>
          </Card>
        ) : (
          <VStack spacing={4}>
            {statistics.map((statistic, index) => (
              <Card key={index}>
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    <HStack justify="space-between">
                      <HStack>
                        <Badge colorScheme={statistic.is_active ? 'green' : 'gray'}>
                          {statistic.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        <Text fontSize="sm" color="gray.500">
                          Order: {statistic.order}
                        </Text>
                      </HStack>
                      <HStack>
                        <IconButton
                          aria-label="Edit statistic"
                          icon={<PencilIcon className="w-4 h-4" />}
                          size="sm"
                          variant="outline"
                        />
                        <IconButton
                          aria-label="Remove statistic"
                          icon={<TrashIcon className="w-4 h-4" />}
                          size="sm"
                          variant="outline"
                          colorScheme="red"
                          onClick={() => removeStatistic(index)}
                        />
                      </HStack>
                    </HStack>
                    
                    <HStack spacing={4}>
                      <Text fontWeight="semibold">{statistic.label || 'Untitled'}</Text>
                      <Text fontSize="lg" color="blue.600" fontWeight="bold">
                        {statistic.value || '0'}
                      </Text>
                    </HStack>
                    
                    <Text fontSize="sm" color="gray.600">
                      Icon: {statistic.icon || 'None'}
                    </Text>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </VStack>
        )}
      </VStack>
    </Box>
  );
}; 