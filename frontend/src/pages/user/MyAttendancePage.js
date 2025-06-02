import React, { useState, useEffect } from 'react';
import { formatDate } from '../../utils/dateUtils';
import { useNavigate, Link as RouterLink } from 'react-router-dom'; // Added RouterLink import
import {
  Box,
  Heading,
  Text,
  Button, // Keep for specific buttons if needed
  Flex,
  Icon,
  Badge,
  Stack, // Keep Stack
  Alert,
  AlertIcon,
  CardBody, // Keep CardBody for specific Card sections if needed
  CardFooter, // Keep CardFooter for specific Card sections if needed
  HStack, // Keep HStack
  Input, // Keep Input
  InputGroup, // Keep InputGroup
  InputLeftElement, // Keep InputLeftElement
  Select, // Keep Select
  SimpleGrid, // Keep SimpleGrid
  Skeleton, // Keep Skeleton
  Spinner, // Keep Spinner
  Tabs, // Keep Tabs
  TabList, // Keep TabList
  TabPanels, // Keep TabPanels
  Tab, // Keep Tab
  TabPanel, // Keep TabPanel
  // useColorModeValue removed - using light mode only
  VStack, // Keep VStack
  Divider, // Added missing Divider import
} from '@chakra-ui/react';
import {
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiSearch,
  FiFilter,
  FiMapPin,
  FiUser,
  FiChevronRight,
  FiInfo,
  FiXCircle, // Added for Clear Filters
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
// Removed modal imports as they are not used directly on this page layout refactor
// import { AddTrainingModal } from '../../components/admin';
// import { ViewTrainingModal } from '../../components/user';
import PageHeader from '../../components/common/PageHeader'; // Import PageHeader
import Card from '../../components/common/Card'; // Import common Card
import ActionButton from '../../components/common/ActionButton'; // Import ActionButton

const MyAttendancePage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [tabIndex, setTabIndex] = useState(0);
  const [error, setError] = useState('');

  // Theme colors - fixed to light mode values only
  const headingColor = 'sasol.primary';
  const textColor = 'gray.600';
  const iconColor = 'gray.400';
  const inputFocusBorderColor = 'sasol.primary';
  const inputBorderColor = 'gray.300';
  const errorBg = 'red.50';
  const errorColor = 'red.500';
  const cardBg = 'white'; // For general cards

  // Fetch data logic (keeping existing mock logic)
  useEffect(() => {
    const fetchAttendanceData = async () => {
      setIsLoading(true);
      try {
        setTimeout(() => {
          const mockData = [
            { id: 1, trainingId: 101, trainingTitle: 'Safety Procedures Training', date: '2025-02-15', status: 'completed', duration: '4 hours', location: 'Training Center A', certified: true, score: 92, training: { category: 'Safety', title: 'Safety Procedures Training', location: 'Training Center A', instructor: 'John Doe', isRequired: true } },
            { id: 2, trainingId: 102, trainingTitle: 'Hazardous Materials Handling', date: '2025-01-28', status: 'completed', duration: '6 hours', location: 'Lab 3', certified: true, score: 88, training: { category: 'Compliance', title: 'Hazardous Materials Handling', location: 'Lab 3', instructor: 'Jane Doe', isRequired: false } },
            { id: 3, trainingId: 103, trainingTitle: 'Environmental Compliance', date: '2025-03-10', status: 'upcoming', duration: '2 hours', location: 'Conference Room B', certified: false, score: null, training: { category: 'Compliance', title: 'Environmental Compliance', location: 'Conference Room B', instructor: 'Bob Smith', isRequired: true } },
            { id: 4, trainingId: 104, trainingTitle: 'First Aid and CPR', date: '2024-12-05', status: 'completed', duration: '8 hours', location: 'Medical Wing', certified: true, score: 95, training: { category: 'Safety', title: 'First Aid and CPR', location: 'Medical Wing', instructor: 'Alice Johnson', isRequired: true } },
            { id: 5, trainingId: 105, trainingTitle: 'Fire Safety and Prevention', date: '2025-03-05', status: 'missed', duration: '3 hours', location: 'Training Center B', certified: false, score: null, training: { category: 'Safety', title: 'Fire Safety and Prevention', location: 'Training Center B', instructor: 'Mike Brown', isRequired: false } },
          ];
          setAttendanceRecords(mockData);
          setIsLoading(false);
        }, 1000);
      } catch (err) { setError('Failed to load attendance records.'); setIsLoading(false); }
    };
    fetchAttendanceData();
  }, []);

  // Filter logic (keeping existing logic, simplified tab logic)
  const filteredRecords = attendanceRecords.filter(record => {
    const lowerSearch = searchTerm.toLowerCase();
    const matchesSearch = record.trainingTitle.toLowerCase().includes(lowerSearch);
    let matchesFilter = filterStatus === 'all' || record.status === filterStatus;

    // Apply tab filter if not 'all'
    if (tabIndex === 1) matchesFilter = matchesFilter && record.status === 'completed';
    else if (tabIndex === 2) matchesFilter = matchesFilter && record.status === 'upcoming';
    else if (tabIndex === 3) matchesFilter = matchesFilter && record.status === 'missed';

    return matchesSearch && matchesFilter;
  });

  // Badge helpers (using theme variants)
  const getStatusBadgeVariant = (status) => status?.toLowerCase() || 'unknown'; // Map to theme variants
  const getMandatoryBadgeVariant = (isMandatory) => isMandatory ? 'required' : 'optional';

  // Handlers
  const handleViewDetails = (trainingId) => navigate(`/trainings/${trainingId}`); // Navigate to user training detail page
  const clearFilters = () => { setSearchTerm(''); setFilterStatus('all'); };

  // Calculate Stats
  const completedCount = attendanceRecords.filter(rec => rec.status === 'completed').length;
  const upcomingCount = attendanceRecords.filter(rec => rec.status === 'upcoming').length;
  const averageScore = Math.round(attendanceRecords.filter(rec => rec.score !== null).reduce((sum, rec) => sum + rec.score, 0) / (attendanceRecords.filter(rec => rec.score !== null).length || 1));

  return (
    <Box>
      <PageHeader
        title="My Attendance Records"
        subtitle="View your past and upcoming training attendance"
      />

      {error && (
        <Alert status="error" mb={6} borderRadius="md">
          <AlertIcon /> {error}
        </Alert>
      )}

      {/* Summary Stats */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
        <Skeleton isLoaded={!isLoading} borderRadius="lg">
          <Card> {/* Use common Card */}
            <Flex align="center">
              <Icon as={FiCheckCircle} color="green.500" boxSize={8} mr={3} />
              <Box>
                <Text fontSize="2xl" fontWeight="bold" color={headingColor}>{completedCount}</Text>
                <Text fontSize="sm" color={textColor}>Completed Trainings</Text>
              </Box>
            </Flex>
          </Card>
        </Skeleton>
        <Skeleton isLoaded={!isLoading} borderRadius="lg">
          <Card>
            <Flex align="center">
              <Icon as={FiCalendar} color="blue.500" boxSize={8} mr={3} />
              <Box>
                <Text fontSize="2xl" fontWeight="bold" color={headingColor}>{upcomingCount}</Text>
                <Text fontSize="sm" color={textColor}>Upcoming Trainings</Text>
              </Box>
            </Flex>
          </Card>
        </Skeleton>
        <Skeleton isLoaded={!isLoading} borderRadius="lg">
          <Card>
            <Flex align="center">
              <Icon as={FiCheckCircle} color="purple.500" boxSize={8} mr={3} />
              <Box>
                <Text fontSize="2xl" fontWeight="bold" color={headingColor}>{isNaN(averageScore) ? 'N/A' : `${averageScore}%`}</Text>
                <Text fontSize="sm" color={textColor}>Average Score</Text>
              </Box>
            </Flex>
          </Card>
        </Skeleton>
      </SimpleGrid>

      {/* Filters and Tabs */}
      <Card mb={6}>
        <VStack spacing={4} align="stretch">
          <Flex direction={{ base: 'column', md: 'row' }} gap={4}>
            <InputGroup flex={1}>
              <InputLeftElement pointerEvents="none">
                <Icon as={FiSearch} color={iconColor} />
              </InputLeftElement>
              <Input
                placeholder="Search by training title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                borderRadius="md"
                borderColor={inputBorderColor}
                _hover={{ borderColor: inputFocusBorderColor }}
                _focus={{ borderColor: inputFocusBorderColor, boxShadow: `0 0 0 1px ${inputFocusBorderColor}` }}
              />
            </InputGroup>
            <Select
              placeholder="All Statuses"
              icon={<Icon as={FiFilter} />}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              borderRadius="md"
              borderColor={inputBorderColor}
              _hover={{ borderColor: inputFocusBorderColor }}
              _focus={{ borderColor: inputFocusBorderColor, boxShadow: `0 0 0 1px ${inputFocusBorderColor}` }}
              width={{ base: 'full', md: '200px' }}
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="upcoming">Upcoming</option>
              <option value="missed">Missed</option>
            </Select>
             <Button variant="outline" onClick={clearFilters} leftIcon={<Icon as={FiXCircle} />}>Clear</Button>
          </Flex>

          <Tabs colorScheme="brand" index={tabIndex} onChange={(index) => setTabIndex(index)} variant="soft-rounded">
            <TabList>
              <Tab>All</Tab>
              <Tab>Completed</Tab>
              <Tab>Upcoming</Tab>
              <Tab>Missed</Tab>
            </TabList>
          </Tabs>
        </VStack>
      </Card>

      {/* Attendance List */}
      {isLoading ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {Array(6).fill(0).map((_, i) => (
            <Skeleton key={i} height="200px" borderRadius="lg" />
          ))}
        </SimpleGrid>
      ) : filteredRecords.length > 0 ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {filteredRecords.map((record) => (
            <Card key={record.id} variant="outline" _hover={{ shadow: 'md', transform: 'translateY(-4px)' }} transition="all 0.2s">
              <VStack align="stretch" spacing={3} p={0}> {/* Let Card handle padding */}
                <HStack justify="space-between" align="flex-start" px={6} pt={6}>
                  {/* Use theme badge variants */}
                  <Badge variant={getMandatoryBadgeVariant(record.training?.isRequired)}>
                    {record.training?.isRequired ? "Required" : "Optional"}
                  </Badge>
                  <Badge variant={getStatusBadgeVariant(record.status)}>
                    {record.status}
                  </Badge>
                </HStack>
                <Box px={6}>
                  <Heading size="md" mb="2" color={headingColor} noOfLines={2}>
                    {record.trainingTitle}
                  </Heading>
                </Box>
                <Stack spacing="2" px={6}>
                  <HStack>
                    <Icon as={FiCalendar} color={iconColor} />
                    <Text fontSize="sm">{formatDate(record.date)}</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FiMapPin} color={iconColor} />
                    <Text fontSize="sm">{record.location || "N/A"}</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FiClock} color={iconColor} />
                    <Text fontSize="sm">{record.duration}</Text>
                  </HStack>
                   {record.status === 'completed' && (
                     <HStack>
                       <Icon as={FiCheckCircle} color="green.500" />
                       <Text fontSize="sm" fontWeight="medium" color="green.600">
                         Score: {record.score}% {record.certified ? '(Certified)' : ''}
                       </Text>
                     </HStack>
                   )}
                </Stack>
                <Divider mt={3} />
                <HStack w="100%" justifyContent="flex-end" p={4}>
                  <ActionButton
                    size="sm"
                    rightIcon={<FiChevronRight />}
                    onClick={() => handleViewDetails(record.trainingId)}
                    variant="outline"
                    label="View Details"
                  />
                </HStack>
              </VStack>
            </Card>
          ))}
        </SimpleGrid>
      ) : (
        <Card textAlign="center" py={10}>
          <Icon as={FiInfo} fontSize="3xl" color={iconColor} mb={3} />
          <Heading as="h2" size="lg" mb={2}>No Records Found</Heading>
          <Text color={textColor}>No attendance records match your current filters.</Text>
          <Button mt={4} onClick={clearFilters} variant="link" colorScheme="brand">
            Clear All Filters
          </Button>
        </Card>
      )}

      {/* Modals are likely handled on the Training Detail page, not listed here */}
    </Box>
  );
};

export default MyAttendancePage;
