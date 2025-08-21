import React, { useEffect, useMemo, useState } from 'react';
import {
    Box,
    Container,
    VStack,
    Heading,
    Text,
    Badge,
    Icon,
    SimpleGrid,
    Card,
    CardBody,
    CardHeader,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Skeleton,
    HStack,
    Divider,
} from '@chakra-ui/react';
import {
    ClockIcon,
    CurrencyDollarIcon,
    CalendarIcon,
    MapPinIcon,
    InformationCircleIcon,
} from '@heroicons/react/24/outline';
import { config } from '../../config';

interface FerrySchedule {
    id: number;
    route_name: string;
    departure_time: string; // HH:MM:SS
    arrival_time: string;   // HH:MM:SS
    duration: string;
    price: string;          // DecimalField serialized as string
    days_of_week: string[];
    is_active: boolean;
    order: number;
    notes?: string;
}

const formatTime = (time: string) => {
    // Expecting HH:MM:SS → return HH:MM
    if (!time) return '';
    const parts = time.split(':');
    return parts.length >= 2 ? `${parts[0]}:${parts[1]}` : time;
};

export const FerryTimetablesSection = React.memo(() => {
    const [schedules, setSchedules] = useState<FerrySchedule[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch(`${config.apiBaseUrl}/transportation/`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setSchedules(data.ferry_schedules || []);
            } catch (err) {
                console.error('Failed to fetch ferry schedules:', err);
                setError('Failed to load ferry schedules. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchSchedules();
    }, []);

    const groupedByRoute = useMemo(() => {
        const map = new Map<string, FerrySchedule[]>();
        for (const item of schedules) {
            if (!map.has(item.route_name)) {
                map.set(item.route_name, []);
            }
            map.get(item.route_name)!.push(item);
        }
        // Sort each route's rows by departure time
        for (const [, list] of map) {
            list.sort((a, b) => a.departure_time.localeCompare(b.departure_time));
        }
        return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
    }, [schedules]);

    return (
        <section id="ferry-timetables" className="py-24 bg-gradient-to-br from-blue-50 to-indigo-50">
            <Container maxW="7xl">
                <VStack spacing={8} mb={12} textAlign="center">
                    <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-full text-sm font-bold">
                        <Icon as={CalendarIcon} className="w-4 h-4 mr-2" />
                        Ferry Timetables
                    </Badge>
                    <Heading size="2xl" className="text-5xl md:text-6xl font-bold text-gray-900">
                        Public Ferry Schedules
                    </Heading>
                    <Text className="text-lg text-gray-800 max-w-3xl mx-auto leading-relaxed">
                        Up-to-date routes, departure times, durations, prices, and operating days.
                    </Text>
                </VStack>

                {error && (
                    <Alert status="error" rounded="md" mb={8}>
                        <AlertIcon />
                        <AlertTitle>Could not load ferry schedules</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {loading ? (
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                        {[...Array(4)].map((_, i) => (
                            <Card key={i} className="shadow-lg border border-gray-200">
                                <CardHeader>
                                    <Skeleton height="24px" mb={2} />
                                    <Skeleton height="16px" width="60%" />
                                </CardHeader>
                                <CardBody>
                                    <Skeleton height="20px" mb={2} />
                                    <Skeleton height="20px" mb={2} />
                                    <Skeleton height="20px" />
                                </CardBody>
                            </Card>
                        ))}
                    </SimpleGrid>
                ) : groupedByRoute.length === 0 ? (
                    <Alert status="info" rounded="md">
                        <AlertIcon />
                        <AlertTitle>No ferry schedules available</AlertTitle>
                        <AlertDescription>Check back later for updated timetables.</AlertDescription>
                    </Alert>
                ) : (
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                        {groupedByRoute.map(([routeName, rows]) => (
                            <Card key={routeName} className="shadow-2xl border-2 border-gray-200 hover:border-blue-300 transition-all duration-300">
                                <CardHeader className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-t-xl">
                                    <VStack spacing={2} align="start">
                                        <HStack spacing={3}>
                                            <Icon as={MapPinIcon} className="w-5 h-5 text-white" />
                                            <Heading size="md" className="text-white">{routeName}</Heading>
                                        </HStack>
                                        {rows[0]?.notes && (
                                            <HStack spacing={2}>
                                                <Icon as={InformationCircleIcon} className="w-4 h-4 text-blue-100" />
                                                <Text className="text-blue-100 text-sm">{rows[0].notes}</Text>
                                            </HStack>
                                        )}
                                    </VStack>
                                </CardHeader>
                                <CardBody>
                                    <TableContainer>
                                        <Table size="sm" variant="simple">
                                            <Thead>
                                                <Tr>
                                                    <Th><HStack spacing={2}><Icon as={ClockIcon} className="w-4 h-4" /><Text>Departure</Text></HStack></Th>
                                                    <Th>Arrival</Th>
                                                    <Th>Duration</Th>
                                                    <Th><HStack spacing={2}><Icon as={CurrencyDollarIcon} className="w-4 h-4" /><Text>Price</Text></HStack></Th>
                                                    <Th>Days</Th>
                                                </Tr>
                                            </Thead>
                                            <Tbody>
                                                {rows.map((r) => (
                                                    <Tr key={r.id}>
                                                        <Td>{formatTime(r.departure_time)}</Td>
                                                        <Td>{formatTime(r.arrival_time)}</Td>
                                                        <Td>{r.duration}</Td>
                                                        <Td>${r.price}</Td>
                                                        <Td>{r.days_of_week?.join(', ')}</Td>
                                                    </Tr>
                                                ))}
                                            </Tbody>
                                        </Table>
                                    </TableContainer>
                                </CardBody>
                            </Card>
                        ))}
                    </SimpleGrid>
                )}
            </Container>
        </section>
    );
});

FerryTimetablesSection.displayName = 'FerryTimetablesSection';


