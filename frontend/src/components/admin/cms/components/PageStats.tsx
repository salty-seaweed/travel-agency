import React from 'react';
import {
  VStack,
  HStack,
  Text,
  Badge,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  SimpleGrid,
} from '@chakra-ui/react';
import {
  DocumentTextIcon,
  EyeIcon,
  ClockIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

interface PageStatsProps {
  totalPages: number;
  publishedPages: number;
  draftPages: number;
  archivedPages: number;
  recentActivity?: Array<{
    type: string;
    title: string;
    timestamp: string;
  }>;
}

export const PageStats: React.FC<PageStatsProps> = ({
  totalPages,
  publishedPages,
  draftPages,
  archivedPages,
  recentActivity = [],
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published': return <CheckCircleIcon className="w-4 h-4" />;
      case 'draft': return <ClockIcon className="w-4 h-4" />;
      case 'archived': return <DocumentTextIcon className="w-4 h-4" />;
      default: return <DocumentTextIcon className="w-4 h-4" />;
    }
  };

  return (
    <VStack spacing={6} align="stretch">
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Total Pages</StatLabel>
              <StatNumber>{totalPages}</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                {publishedPages} published
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Published</StatLabel>
              <StatNumber color="green.500">{publishedPages}</StatNumber>
              <StatHelpText>Live pages</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Drafts</StatLabel>
              <StatNumber color="yellow.500">{draftPages}</StatNumber>
              <StatHelpText>In progress</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Archived</StatLabel>
              <StatNumber color="red.500">{archivedPages}</StatNumber>
              <StatHelpText>Hidden pages</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      {recentActivity.length > 0 && (
        <Card>
          <CardBody>
            <VStack align="start" spacing={4}>
              <Text fontWeight="bold" fontSize="lg">Recent Activity</Text>
              <VStack align="start" spacing={2} width="full">
                {recentActivity.slice(0, 5).map((activity, index) => (
                  <HStack key={index} spacing={3} width="full">
                    <Badge colorScheme="blue" size="sm">
                      {activity.type}
                    </Badge>
                    <Text fontSize="sm" flex={1}>
                      {activity.title}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </Text>
                  </HStack>
                ))}
              </VStack>
            </VStack>
          </CardBody>
        </Card>
      )}
    </VStack>
  );
};
