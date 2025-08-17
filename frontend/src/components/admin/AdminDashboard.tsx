import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  GridItem,
  Flex,
  VStack,
  HStack,
  Text,
  Heading,
  Icon,
  IconButton,
  Button,
  Card,
  CardBody,
  CardHeader,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Progress,
  Badge,
  Avatar,
  Divider,
  useColorModeValue,
  SimpleGrid,
} from '@chakra-ui/react';
import { useNotification } from '../../hooks';
import { apiGet } from '../../api';
import type { Review } from '../../types';
import {
  BuildingOffice2Icon,
  GiftIcon,
  StarIcon,
  ChartBarIcon,
  PlusIcon,
  ClockIcon,
  WrenchScrewdriverIcon,
  UsersIcon,
  CurrencyDollarIcon,
  EyeIcon,
  CalendarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

interface DashboardStats {
  properties: number;
  packages: number;
  reviews: number;
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const { notification, showError } = useNotification();
  const [stats, setStats] = useState<DashboardStats>({ properties: 0, packages: 0, reviews: 0 });
  const [recentReviews, setRecentReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalBookings: 0,
    monthlyRevenue: 0,
    activeUsers: 0,
    conversionRate: 0,
  });

  // Color mode values
  const bg = useColorModeValue('white', 'gray.800');
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.400');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [properties, packages, reviews, analyticsData] = await Promise.all([
          apiGet('/properties/'),
          apiGet('/packages/'),
          apiGet('/reviews/?ordering=-created_at&limit=5'),
          apiGet('/analytics/'),
        ]);
        
        setStats({ 
          properties: properties.count || properties.length, 
          packages: packages.count || packages.length, 
          reviews: reviews.count || reviews.length 
        });
        setRecentReviews(reviews.results ? reviews.results.slice(0, 5) : reviews.slice(0, 5));
        
        // Set analytics data (mock for now)
        setAnalytics({
          totalBookings: 156,
          monthlyRevenue: 28450,
          activeUsers: 89,
          conversionRate: 12.5,
        });
      } catch (error) {
        showError('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [showError]);

  if (isLoading) {
    return (
      <Flex minH="100vh" bg="gray.50" align="center" justify="center">
        <VStack spacing={4}>
          <Box className="animate-spin">
            <Icon as={ChartBarIcon} h={8} w={8} color="blue.500" />
          </Box>
          <Text color="gray.500">Loading dashboard...</Text>
        </VStack>
      </Flex>
    );
  }

  const StatCard = ({ 
    title, 
    value, 
    icon, 
    colorScheme, 
    change = '+12%', 
    changeType = 'increase' 
  }: {
    title: string;
    value: string | number;
    icon: any;
    colorScheme: string;
    change?: string;
    changeType?: 'increase' | 'decrease';
  }) => (
    <Card bg={`${colorScheme}.50`} borderColor={`${colorScheme}.200`} borderWidth="1px">
      <CardBody>
        <Flex justify="space-between" align="center">
          <VStack align="start" spacing={1}>
            <Text fontSize="sm" fontWeight="medium" color={`${colorScheme}.600`}>
              {title}
            </Text>
            <Text fontSize="3xl" fontWeight="bold" color={`${colorScheme}.900`}>
              {value}
            </Text>
            <HStack spacing={1}>
              <Icon 
                as={changeType === 'increase' ? ArrowUpIcon : ArrowDownIcon} 
                h={3} 
                w={3} 
                color={`${colorScheme}.600`} 
              />
              <Text fontSize="xs" color={`${colorScheme}.600`}>
                {change} from last month
              </Text>
            </HStack>
          </VStack>
          <Box
            w={12}
            h={12}
            bg={`${colorScheme}.500`}
            borderRadius="xl"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Icon as={icon} h={6} w={6} color="white" />
          </Box>
        </Flex>
      </CardBody>
    </Card>
  );

  return (
    <Container maxW="7xl" py={8}>
      {/* Header */}
      <Card mb={8} bg={bg} borderColor={borderColor} borderWidth="1px">
        <CardBody p={8}>
          <Flex justify="space-between" align="center">
            <HStack spacing={6}>
              <Box
                w={16}
                h={16}
                bgGradient="linear(to-br, blue.500, indigo.600)"
                borderRadius="xl"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon as={ChartBarIcon} h={8} w={8} color="white" />
              </Box>
              <VStack align="start" spacing={1}>
                <Heading size="lg" color={textColor}>
                  Admin Dashboard
                </Heading>
                <Text fontSize="lg" color={mutedTextColor}>
                  Welcome back! Here's what's happening with your business.
                </Text>
              </VStack>
            </HStack>
            <HStack spacing={4}>
              <Button
                leftIcon={<Icon as={PlusIcon} h={5} w={5} />}
                variant="outline"
                colorScheme="blue"
                onClick={() => navigate('/dashboard/properties')}
              >
                Add Property
              </Button>
              <Button
                leftIcon={<Icon as={PlusIcon} h={5} w={5} />}
                colorScheme="blue"
                onClick={() => navigate('/dashboard/packages')}
              >
                Create Package
              </Button>
            </HStack>
          </Flex>
        </CardBody>
      </Card>

      {/* Key Metrics */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <StatCard
          title="Total Properties"
          value={stats.properties}
          icon={BuildingOffice2Icon}
          colorScheme="blue"
        />
        <StatCard
          title="Active Packages"
          value={stats.packages}
          icon={GiftIcon}
          colorScheme="green"
          change="+8%"
        />
        <StatCard
          title="Total Reviews"
          value={stats.reviews}
          icon={StarIcon}
          colorScheme="yellow"
          change="+15%"
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${analytics.monthlyRevenue.toLocaleString()}`}
          icon={CurrencyDollarIcon}
          colorScheme="purple"
          change="+23%"
        />
      </SimpleGrid>

      {/* Analytics Charts */}
      <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={6} mb={8}>
        <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
          <CardHeader pb={4}>
            <Flex justify="space-between" align="center">
              <Heading size="md" color={textColor}>
                Revenue Trend
              </Heading>
              <Button variant="outline" size="sm" colorScheme="blue">
                View Details
              </Button>
            </Flex>
          </CardHeader>
          <CardBody>
            <Box
              h={64}
              bg="gray.50"
              borderRadius="lg"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <VStack spacing={2}>
                <Icon as={ChartBarIcon} h={12} w={12} color="gray.400" />
                <Text color="gray.500">Revenue chart will be displayed here</Text>
              </VStack>
            </Box>
          </CardBody>
        </Card>

        <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
          <CardHeader pb={4}>
            <Flex justify="space-between" align="center">
              <Heading size="md" color={textColor}>
                Booking Analytics
              </Heading>
              <Button variant="outline" size="sm" colorScheme="blue">
                View Details
              </Button>
            </Flex>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <Flex justify="space-between" align="center">
                <Text fontSize="sm" color={mutedTextColor}>Total Bookings</Text>
                <Text fontWeight="semibold">{analytics.totalBookings}</Text>
              </Flex>
              <Flex justify="space-between" align="center">
                <Text fontSize="sm" color={mutedTextColor}>Active Users</Text>
                <Text fontWeight="semibold">{analytics.activeUsers}</Text>
              </Flex>
              <Flex justify="space-between" align="center">
                <Text fontSize="sm" color={mutedTextColor}>Conversion Rate</Text>
                <Text fontWeight="semibold">{analytics.conversionRate}%</Text>
              </Flex>
              <Divider />
              <Box>
                <Text fontSize="sm" color={mutedTextColor} mb={2}>
                  Monthly Progress
                </Text>
                <Progress value={75} colorScheme="blue" borderRadius="full" />
                <Text fontSize="xs" color={mutedTextColor} mt={1}>
                  75% of monthly target achieved
                </Text>
              </Box>
            </VStack>
          </CardBody>
        </Card>
      </Grid>

      {/* Recent Activity */}
      <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6}>
        <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
          <CardHeader pb={4}>
            <Flex justify="space-between" align="center">
              <Heading size="md" color={textColor}>
                Recent Reviews
              </Heading>
              <Button variant="outline" size="sm" colorScheme="blue" onClick={() => navigate('/dashboard/reviews')}>
                View All
              </Button>
            </Flex>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              {recentReviews.length > 0 ? (
                recentReviews.map((review) => (
                  <Box key={review.id} p={4} borderWidth="1px" borderRadius="lg" borderColor={borderColor}>
                    <Flex justify="space-between" align="start" mb={2}>
                                             <HStack spacing={3}>
                         <Avatar size="sm" name={review.name} />
                         <VStack align="start" spacing={0}>
                           <Text fontWeight="semibold" color={textColor}>
                             {review.name}
                           </Text>
                           <Text fontSize="sm" color={mutedTextColor}>
                             Property #{review.property}
                           </Text>
                         </VStack>
                       </HStack>
                      <HStack spacing={1}>
                        {[...Array(5)].map((_, i) => (
                          <Icon
                            key={i}
                            as={StarIcon}
                            h={4}
                            w={4}
                            color={i < review.rating ? 'yellow.400' : 'gray.300'}
                          />
                        ))}
                      </HStack>
                    </Flex>
                    <Text fontSize="sm" color={mutedTextColor} noOfLines={2}>
                      {review.comment}
                    </Text>
                                         <Text fontSize="xs" color={mutedTextColor} mt={2}>
                       {review.created_at ? new Date(review.created_at).toLocaleDateString() : 'Unknown date'}
                     </Text>
                  </Box>
                ))
              ) : (
                <Box textAlign="center" py={8}>
                  <Icon as={StarIcon} h={12} w={12} color="gray.300" mx="auto" mb={4} />
                  <Text color={mutedTextColor}>No reviews yet</Text>
                </Box>
              )}
            </VStack>
          </CardBody>
        </Card>

        <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
          <CardHeader pb={4}>
            <Heading size="md" color={textColor}>
              Quick Actions
            </Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={3} align="stretch">
              <Button
                leftIcon={<Icon as={BuildingOffice2Icon} h={5} w={5} />}
                variant="outline"
                colorScheme="blue"
                onClick={() => navigate('/dashboard/properties')}
                size="lg"
                justifyContent="flex-start"
              >
                Manage Properties
              </Button>
              <Button
                leftIcon={<Icon as={GiftIcon} h={5} w={5} />}
                variant="outline"
                colorScheme="green"
                onClick={() => navigate('/dashboard/packages')}
                size="lg"
                justifyContent="flex-start"
              >
                Manage Packages
              </Button>
              <Button
                leftIcon={<Icon as={StarIcon} h={5} w={5} />}
                variant="outline"
                colorScheme="yellow"
                onClick={() => navigate('/dashboard/reviews')}
                size="lg"
                justifyContent="flex-start"
              >
                View Reviews
              </Button>
              <Button
                leftIcon={<Icon as={WrenchScrewdriverIcon} h={5} w={5} />}
                variant="outline"
                colorScheme="purple"
                onClick={() => navigate('/dashboard/settings')}
                size="lg"
                justifyContent="flex-start"
              >
                Settings
              </Button>
              <Button
                leftIcon={<Icon as={SparklesIcon} h={5} w={5} />}
                variant="outline"
                colorScheme="teal"
                onClick={() => navigate('/dashboard/transportation')}
                size="lg"
                justifyContent="flex-start"
              >
                Transportation
              </Button>
            </VStack>
          </CardBody>
        </Card>
      </Grid>
    </Container>
  );
} 