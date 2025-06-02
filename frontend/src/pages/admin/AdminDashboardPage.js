import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Flex,
  SimpleGrid,
  Heading,
  Text,
  Icon,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Skeleton,
  Button, // Keep Button for Quick Links section styling
  Link,
  CardBody, // Keep for specific Card sections if needed
  CardFooter, // Keep for specific Card sections if needed
  Divider,
  List,
  ListItem,
  HStack,
  Progress,
  TableContainer, // Use TableContainer
  useColorModeValue,
} from '@chakra-ui/react';
import {
  FiUsers,
  FiCalendar,
  FiCheckCircle,
  FiAlertTriangle,
  FiClock,
  FiBarChart2,
  FiArrowRight,
  FiExternalLink,
} from 'react-icons/fi';
import api from '../../services/api';
// Use ActionButton instead of Primary/SecondaryButton if desired, or ensure those use theme
import ActionButton from '../../components/common/ActionButton';
import Card from '../../components/common/Card'; // Use the common Card component

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalTrainings: 0,
    upcomingTrainings: 0,
    activeUsers: 0,
    complianceRate: 0,
  });
  const [recentTrainings, setRecentTrainings] = useState([]);
  const [pendingDeclarations, setPendingDeclarations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Theme colors
  const headingColor = useColorModeValue('sasol.primary', 'white');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const tableHeadBg = useColorModeValue('gray.50', 'gray.700');
  const tableRowHoverBg = useColorModeValue('gray.50', 'gray.700');
  const iconColor = useColorModeValue('sasol.primary', 'brand.200'); // Use theme primary color
  const statNumberColor = useColorModeValue('sasol.primary', 'white'); // Use theme primary color
  const statHelpTextColor = useColorModeValue('gray.500', 'gray.400');
  const errorBg = useColorModeValue('red.50', 'red.900');
  const errorColor = useColorModeValue('red.500', 'red.200');
  const quickLinkBg = useColorModeValue('sasol.primary', 'brand.500');
  const quickLinkHoverBg = useColorModeValue('sasol.blue.800', 'brand.600');
  const quickLinkActiveBg = useColorModeValue('sasol.blue.900', 'brand.700');


  // Fetch dashboard data (keeping existing logic)
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setTimeout(() => {
          const statsData = { totalTrainings: 48, upcomingTrainings: 12, activeUsers: 156, complianceRate: 87.5 };
          const recentTrainingsData = [
            { id: 1, title: 'ESD Compliance Workshop', date: '2025-03-02T09:00:00', status: 'scheduled', attendees: 24, capacity: 30 },
            { id: 2, title: 'Safety Protocols Training', date: '2025-03-05T10:00:00', status: 'scheduled', attendees: 18, capacity: 25 },
            { id: 3, title: 'Vendor Onboarding Session', date: '2025-03-10T14:00:00', status: 'scheduled', attendees: 12, capacity: 20 },
          ];
          const pendingDeclarationsData = [
            { id: 1, trainingTitle: 'ESD Compliance Workshop', count: 10, lastUpdated: '2025-02-25T15:30:00' },
            { id: 2, trainingTitle: 'Safety Protocols Training', count: 5, lastUpdated: '2025-02-26T12:45:00' },
          ];
          setStats(statsData);
          setRecentTrainings(recentTrainingsData);
          setPendingDeclarations(pendingDeclarationsData);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching admin dashboard data:', error);
        setError('Failed to load dashboard data. Please try again later.');
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // Formatters (keeping existing logic)
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  const formatTime = (dateString) => new Date(dateString).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString); const now = new Date(); const diffMs = now - date;
    const diffDays = Math.floor(diffMs / 86400000); const diffHours = Math.floor((diffMs % 86400000) / 3600000);
    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  };

  // Helper for badge colors (using theme colors)
  const getStatusBadgeColorScheme = (status) => {
    switch (status?.toLowerCase()) {
      case 'scheduled': return 'blue';
      case 'completed': return 'green';
      default: return 'gray';
    }
  };
  const getMandatoryBadgeColorScheme = (isMandatory) => isMandatory ? 'red' : 'gray';
  const getAvailabilityBadgeColorScheme = (available) => available > 0 ? 'green' : 'red';
  const getPendingBadgeColorScheme = () => 'red'; // Always red for pending

  return (
    <Box>
      <Heading as="h1" size="xl" mb={6} color={headingColor}>
        Admin Dashboard
      </Heading>

      {error && (
        <Box mb={6} p={4} bg={errorBg} color={errorColor} borderRadius="md">
          {error}
        </Box>
      )}

      {/* Stats Overview - Refactored */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <Skeleton isLoaded={!isLoading} borderRadius="lg">
          <Card> {/* Use common Card */}
            <Flex direction="column">
              <Flex align="center" mb={2}>
                <Icon as={FiCalendar} mr={2} color={iconColor} fontSize="xl" />
                <Text fontWeight="medium">Total Trainings</Text>
              </Flex>
              <Stat>
                <StatNumber fontSize="3xl" fontWeight="bold" color={statNumberColor}>{stats.totalTrainings}</StatNumber>
                <StatHelpText color={statHelpTextColor}>{stats.upcomingTrainings} upcoming</StatHelpText>
              </Stat>
            </Flex>
          </Card>
        </Skeleton>
        <Skeleton isLoaded={!isLoading} borderRadius="lg">
          <Card>
            <Flex direction="column">
              <Flex align="center" mb={2}>
                <Icon as={FiUsers} mr={2} color={iconColor} fontSize="xl" />
                <Text fontWeight="medium">Active Users</Text>
              </Flex>
              <Stat>
                <StatNumber fontSize="3xl" fontWeight="bold" color={statNumberColor}>{stats.activeUsers}</StatNumber>
                <StatHelpText color={statHelpTextColor}>Across all roles</StatHelpText>
              </Stat>
            </Flex>
          </Card>
        </Skeleton>
        <Skeleton isLoaded={!isLoading} borderRadius="lg">
          <Card>
            <Flex direction="column">
              <Flex align="center" mb={2}>
                <Icon as={FiCheckCircle} mr={2} color={iconColor} fontSize="xl" />
                <Text fontWeight="medium">Compliance Rate</Text>
              </Flex>
              <Stat>
                <StatNumber fontSize="3xl" fontWeight="bold" color={statNumberColor}>{stats.complianceRate}%</StatNumber>
                <Box mt={2}>
                  <Progress value={stats.complianceRate} size="sm" colorScheme={stats.complianceRate >= 90 ? "green" : stats.complianceRate >= 75 ? "blue" : stats.complianceRate >= 60 ? "yellow" : "red"} borderRadius="full" />
                </Box>
              </Stat>
            </Flex>
          </Card>
        </Skeleton>
        <Skeleton isLoaded={!isLoading} borderRadius="lg">
          <Card>
            <Flex direction="column">
              <Flex align="center" mb={2}>
                <Icon as={FiAlertTriangle} mr={2} color="orange.500" fontSize="xl" /> {/* Keep orange */}
                <Text fontWeight="medium">Pending Declarations</Text>
              </Flex>
              <Stat>
                <StatNumber fontSize="3xl" fontWeight="bold" color={statNumberColor}>{pendingDeclarations.reduce((sum, item) => sum + item.count, 0)}</StatNumber>
                <StatHelpText color={statHelpTextColor}>Requires follow-up</StatHelpText>
              </Stat>
            </Flex>
          </Card>
        </Skeleton>
      </SimpleGrid>

      {/* Upcoming Trainings */}
      <Box mb={8}>
        <Flex justify="space-between" align="center" mb={4}>
          <Heading as="h2" size="lg" color={headingColor}>Upcoming Trainings</Heading>
          {/* Use ActionButton */}
          <ActionButton
            as={RouterLink}
            to="/admin/trainings"
            size="sm"
            rightIcon={<Icon as={FiArrowRight} />}
            variant="outline"
            colorScheme="brand"
            label="Manage Trainings"
          />
        </Flex>
        {/* Use common Card for table container */}
        <Card p={0} overflow="hidden"> {/* Remove padding from Card, let TableContainer handle */}
          <TableContainer>
            <Table variant="simple">
              <Thead bg={tableHeadBg}>
                <Tr>
                  <Th>Training</Th>
                  <Th>Date & Time</Th>
                  <Th>Status</Th>
                  <Th>Attendance</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {isLoading ? (
                  Array(3).fill(0).map((_, i) => (
                    <Tr key={i}>
                      <Td><Skeleton height="20px" /></Td>
                      <Td><Skeleton height="20px" /></Td>
                      <Td><Skeleton height="20px" /></Td>
                      <Td><Skeleton height="20px" /></Td>
                      <Td><Skeleton height="20px" /></Td>
                    </Tr>
                  ))
                ) : recentTrainings.length > 0 ? (
                  recentTrainings.map(training => (
                    <Tr key={training.id} _hover={{ bg: tableRowHoverBg }}>
                      <Td>
                        <Text fontWeight="medium">{training.title}</Text>
                        <Text fontSize="xs" color={textColor} mt={1}>{training.type || 'Regular Training'}</Text>
                      </Td>
                      <Td>
                        {formatDate(training.date)}<br />
                        <Text fontSize="sm" color={textColor}>{formatTime(training.date)}</Text>
                      </Td>
                      {/* Use theme badge variant if defined, otherwise keep colorScheme */}
                      <Td><Badge colorScheme={getStatusBadgeColorScheme(training.status)}>{training.status}</Badge></Td>
                      <Td>
                        <HStack spacing={2}>
                          <Text>{training.attendees}/{training.capacity}</Text>
                          <Progress value={(training.attendees / training.capacity) * 100} size="xs" width="60px" colorScheme="blue" borderRadius="full" />
                        </HStack>
                      </Td>
                      <Td>
                        {/* Use ActionButton */}
                        <ActionButton
                          as={RouterLink}
                          to={`/admin/trainings/${training.id}`}
                          size="sm"
                          variant="solid"
                          colorScheme="brand"
                          label="View"
                        />
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr><Td colSpan={5} textAlign="center" py={4}>No upcoming training sessions found.</Td></Tr>
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </Card>
      </Box>

      {/* Pending Declarations */}
      <Box mb={8}>
        <Flex justify="space-between" align="center" mb={4}>
          <Heading as="h2" size="lg" color={headingColor}>Pending Declarations</Heading>
           {/* Use ActionButton */}
          <ActionButton
            as={RouterLink}
            to="/admin/declarations"
            size="sm"
            rightIcon={<Icon as={FiArrowRight} />}
            variant="outline"
            colorScheme="brand"
            label="View All"
          />
        </Flex>
         {/* Use common Card for table container */}
        <Card p={0} overflow="hidden"> {/* Remove padding from Card */}
          <TableContainer>
            <Table variant="simple">
              <Thead bg={tableHeadBg}>
                <Tr>
                  <Th>Training</Th>
                  <Th>Pending Count</Th>
                  <Th>Last Updated</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {isLoading ? (
                  Array(2).fill(0).map((_, i) => (
                    <Tr key={i}>
                      <Td><Skeleton height="20px" /></Td>
                      <Td><Skeleton height="20px" /></Td>
                      <Td><Skeleton height="20px" /></Td>
                      <Td><Skeleton height="20px" /></Td>
                    </Tr>
                  ))
                ) : pendingDeclarations.length > 0 ? (
                  pendingDeclarations.map(item => (
                    <Tr key={item.id} _hover={{ bg: tableRowHoverBg }}>
                      <Td>
                        <Text fontWeight="medium">{item.trainingTitle}</Text>
                        <Text fontSize="xs" color={textColor} mt={1}>{item.category || 'Standard Declaration'}</Text>
                      </Td>
                      {/* Use theme badge variant if defined */}
                      <Td><Badge colorScheme={getPendingBadgeColorScheme()}>{item.count} pending</Badge></Td>
                      <Td>{formatTimeAgo(item.lastUpdated)}</Td>
                      <Td>
                         {/* Use ActionButton */}
                        <ActionButton
                          as={RouterLink}
                          to={`/admin/declarations/${item.id}`}
                          size="sm"
                          variant="solid"
                          colorScheme="brand"
                          label="Review"
                        />
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr><Td colSpan={4} textAlign="center" py={4}>No pending declarations found.</Td></Tr>
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </Card>
      </Box>

      {/* Quick Links */}
      <Box>
        <Heading as="h2" size="md" mb={6} color={headingColor}>Quick Actions</Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          {/* Using Chakra Button directly for custom layout inside */}
          <Button
            as={RouterLink} to="/admin/trainings/new" leftIcon={<Icon as={FiCalendar} boxSize={5} />}
            variant="solid" bg={quickLinkBg} color="white"
            _hover={{ bg: quickLinkHoverBg, transform: 'translateY(-2px)', color: "white" }}
            _active={{ bg: quickLinkActiveBg, color: "white" }}
            size="lg" height="auto" py={6} px={5} borderRadius="xl" boxShadow="md" transition="all 0.2s"
          >
            <Flex direction="column" align="start" w="full">
              <Text fontWeight="bold" fontSize="lg" color="white">Create Training</Text>
              <Text fontSize="sm" fontWeight="normal" opacity={0.9} mt={1} color="white">Schedule a new training session</Text>
            </Flex>
          </Button>
          <Button
            as={RouterLink} to="/admin/users" leftIcon={<Icon as={FiUsers} boxSize={5} />}
            variant="solid" bg={quickLinkBg} color="white"
            _hover={{ bg: quickLinkHoverBg, transform: 'translateY(-2px)', color: "white" }}
            _active={{ bg: quickLinkActiveBg, color: "white" }}
            size="lg" height="auto" py={6} px={5} borderRadius="xl" boxShadow="md" transition="all 0.2s"
          >
            <Flex direction="column" align="start" w="full">
              <Text fontWeight="bold" fontSize="lg" color="white">Manage Users</Text>
              <Text fontSize="sm" fontWeight="normal" opacity={0.9} mt={1} color="white">View and edit user accounts</Text>
            </Flex>
          </Button>
          <Button
            as={RouterLink} to="/admin/reports" leftIcon={<Icon as={FiBarChart2} boxSize={5} />}
            variant="solid" bg={quickLinkBg} color="white"
            _hover={{ bg: quickLinkHoverBg, transform: 'translateY(-2px)', color: "white" }}
            _active={{ bg: quickLinkActiveBg, color: "white" }}
            size="lg" height="auto" py={6} px={5} borderRadius="xl" boxShadow="md" transition="all 0.2s"
          >
            <Flex direction="column" align="start" w="full">
              <Text fontWeight="bold" fontSize="lg" color="white">View Reports</Text>
              <Text fontSize="sm" fontWeight="normal" opacity={0.9} mt={1} color="white">Access compliance and attendance reports</Text>
            </Flex>
          </Button>
        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default AdminDashboardPage;
