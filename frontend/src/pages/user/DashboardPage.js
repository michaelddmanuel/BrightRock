import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Heading,
  Flex,
  Text,
  SimpleGrid,
  Button, // Keep for modal footer and specific cases
  Icon,
  Badge,
  // Removed Chakra Card components: CardHeader, CardBody, CardFooter
  Stack,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  // Progress, // Removed unused
  // Spinner, // Removed unused
  Alert, // Keep Alert
  AlertIcon, // Keep AlertIcon
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  // List, // Removed unused
  ListItem, // Keep ListItem
  UnorderedList, // Keep UnorderedList
  Divider,
  Skeleton,
  TableContainer,
  useColorModeValue,
  VStack, // Keep VStack
} from '@chakra-ui/react';
import {
  FiCalendar,
  FiClock,
  FiMapPin,
  FiUsers,
  // FiCheckSquare, // Removed unused
  FiAlertCircle,
  FiAward,
  // FiTrendingUp, // Removed unused
  // FiBarChart2, // Removed unused
  FiArrowRight,
  // FiChevronRight, // Removed unused
  // FiInfo, // Removed unused
  // FiAlertTriangle, // Removed unused
  // FiEdit, // Removed unused
  FiCheckCircle,
  // FiX, // Removed unused
  // FiMoreVertical, // Removed unused
  FiLink, // Added FiLink
} from 'react-icons/fi';

// Use ActionButton instead of Primary/SecondaryButton
import ActionButton from '../../components/common/ActionButton';
import { useAuth } from '../../contexts/AuthContext';
// import api from '../../services/api'; // Removed unused api import
import useToast from '../../hooks/useToast';
import Card from '../../components/common/Card'; // Use the common Card component

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate(); // Keep navigate hook
  const [upcomingTrainings, setUpcomingTrainings] = useState([]);
  const [mandatoryTrainings, setMandatoryTrainings] = useState([]);
  const [stats, setStats] = useState({
    totalAttended: 0,
    pendingDeclarations: 0,
    upcomingMandatory: 0,
    completedTrainings: 0,
    upcomingTrainings: 0,
    pendingTrainings: 0,
    complianceScore: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(''); // Add back error state
  const [selectedTraining, setSelectedTraining] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Theme colors defined at top level
  const headingColor = useColorModeValue('sasol.primary', 'white');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const iconColor = useColorModeValue('sasol.primary', 'brand.200');
  const statNumberColor = useColorModeValue('sasol.primary', 'white');
  const iconBg = useColorModeValue('sasol.secondary', 'gray.600');
  const tableHeadBg = useColorModeValue('gray.50', 'gray.700');
  const tableRowHoverBg = useColorModeValue('gray.50', 'gray.700');
  const cardBorderColor = useColorModeValue('gray.200', 'gray.600');
  const availableBadgeBg = useColorModeValue('green.100', 'green.900');
  const availableBadgeColor = useColorModeValue('green.700', 'green.200');
  const fullBadgeBg = useColorModeValue('red.100', 'red.900');
  const fullBadgeColor = useColorModeValue('red.700', 'red.200');
  const modalHeaderBg = useColorModeValue('sasol.primary', 'gray.800');
  const cardBg = useColorModeValue('white', 'gray.700');
  const errorBg = useColorModeValue('red.50', 'red.900'); // Add back errorBg
  const errorColor = useColorModeValue('red.500', 'red.200'); // Add back errorColor

  const handleViewDetails = (training) => {
    setSelectedTraining(training);
    onOpen();
  };

  const handleRegister = (trainingId, trainingTitle) => {
    toast.success(
      "Registration Successful",
      `You have successfully registered for "${trainingTitle}"`,
      { duration: 5000, isClosable: true, position: 'top-right' }
    );
    if (isOpen) { onClose(); }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        setTimeout(() => {
          const mockUpcomingTrainings = [ { id: 101, title: 'Safety Procedures and Protocols', startDate: '2025-03-15T09:00:00', endDate: '2025-03-15T16:00:00', location: 'Training Center A', mandatory: true, registrationDeadline: '2025-03-10', availableSeats: 15, totalSeats: 30, category: 'Safety', level: 'Intermediate', isMandatory: true, isVirtual: false, description: 'Comprehensive training...' }, { id: 102, title: 'Emergency Response Training', startDate: '2025-03-22T10:00:00', endDate: '2025-03-22T17:00:00', location: 'Conference Hall B', mandatory: false, registrationDeadline: '2025-03-18', availableSeats: 8, totalSeats: 25, category: 'Emergency', level: 'All Levels', isMandatory: false, isVirtual: false, description: 'Learn to respond effectively...' }, { id: 103, title: 'Environmental Compliance', startDate: '2025-04-05T09:30:00', endDate: '2025-04-05T15:30:00', location: 'Meeting Room 103', mandatory: true, registrationDeadline: '2025-03-29', availableSeats: 20, totalSeats: 40, category: 'Compliance', level: 'Basic', isMandatory: true, isVirtual: false, description: 'Overview of environmental regulations...' } ];
          const mockMandatoryTrainings = [ { id: 201, title: 'Annual Safety Certification', dueDate: '2025-06-30', status: 'pending', completionRequired: true, category: 'Certification', priority: 'High' }, { id: 202, title: 'Hazardous Materials Handling', dueDate: '2025-04-15', status: 'pending', completionRequired: true, category: 'Safety', priority: 'Critical' } ];
          const mockStats = { totalAttended: 14, pendingDeclarations: 2, upcomingMandatory: 3, completedTrainings: 10, upcomingTrainings: 5, pendingTrainings: 2, complianceScore: 92 };
          setUpcomingTrainings(mockUpcomingTrainings);
          setMandatoryTrainings(mockMandatoryTrainings);
          setStats(mockStats);
          setIsLoading(false);
        }, 1000);
      } catch (err) { setError('Failed to load dashboard data'); setIsLoading(false); }
    };
    fetchDashboardData();
  }, []);

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  const formatTime = (dateString) => new Date(dateString).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  const calculateDuration = (start, end) => `${((new Date(end) - new Date(start)) / 3600000).toFixed(1)} hours`;

  // Badge variants
  const getStatusBadgeVariant = (status) => status?.toLowerCase() || 'unknown';
  const getMandatoryBadgeVariant = (isMandatory) => isMandatory ? 'required' : 'optional';

  return (
    <Box>
      {/* Welcome Section */}
      <Box mb={8}>
        <Heading as="h1" size="xl" mb={2} color={headingColor}>
          Welcome back, {currentUser?.firstName || 'User'}
        </Heading>
        <Text color={textColor}>
          View your upcoming trainings and manage your compliance requirements
        </Text>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert status="error" mb={6} borderRadius="md" bg={errorBg} color={errorColor}>
          <AlertIcon color={errorColor} />
          {error}
        </Alert>
      )}

      {/* Statistics - Refactored */}
      <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={6} mb={10}>
        <Skeleton isLoaded={!isLoading} borderRadius="lg">
          <Card>
            <Flex alignItems="center">
              <Flex alignItems="center" justifyContent="center" borderRadius="full" bg={iconBg} p={3} mr={4}>
                <Icon as={FiCheckCircle} boxSize={5} color={iconColor} />
              </Flex>
              <Stack spacing={0}>
                <Text fontSize="sm" color={textColor}>Completed Trainings</Text>
                <Text fontSize="2xl" fontWeight="bold" color={statNumberColor}>{stats.completedTrainings}</Text>
              </Stack>
            </Flex>
          </Card>
        </Skeleton>
         <Skeleton isLoaded={!isLoading} borderRadius="lg">
          <Card>
            <Flex alignItems="center">
              <Flex alignItems="center" justifyContent="center" borderRadius="full" bg={iconBg} p={3} mr={4}>
                <Icon as={FiCalendar} boxSize={5} color={iconColor} />
              </Flex>
              <Stack spacing={0}>
                <Text fontSize="sm" color={textColor}>Upcoming Trainings</Text>
                <Text fontSize="2xl" fontWeight="bold" color={statNumberColor}>{stats.upcomingTrainings}</Text>
              </Stack>
            </Flex>
          </Card>
        </Skeleton>
         <Skeleton isLoaded={!isLoading} borderRadius="lg">
          <Card>
            <Flex alignItems="center">
              <Flex alignItems="center" justifyContent="center" borderRadius="full" bg={iconBg} p={3} mr={4}>
                <Icon as={FiAlertCircle} boxSize={5} color={iconColor} />
              </Flex>
              <Stack spacing={0}>
                <Text fontSize="sm" color={textColor}>Pending Trainings</Text>
                <Text fontSize="2xl" fontWeight="bold" color={statNumberColor}>{stats.pendingTrainings}</Text>
              </Stack>
            </Flex>
          </Card>
        </Skeleton>
         <Skeleton isLoaded={!isLoading} borderRadius="lg">
          <Card>
            <Flex alignItems="center">
              <Flex alignItems="center" justifyContent="center" borderRadius="full" bg={iconBg} p={3} mr={4}>
                <Icon as={FiAward} boxSize={5} color={iconColor} />
              </Flex>
              <Stack spacing={0}>
                <Text fontSize="sm" color={textColor}>Compliance Score</Text>
                <Text fontSize="2xl" fontWeight="bold" color={statNumberColor}>{stats.complianceScore}%</Text>
              </Stack>
            </Flex>
          </Card>
        </Skeleton>
      </SimpleGrid>

      {/* Upcoming Trainings */}
      <Box mb={8}>
        <Flex justifyContent="space-between" alignItems="center" mb={4}>
          <Heading as="h2" size="lg" color={headingColor}>Upcoming Trainings</Heading>
          <ActionButton as={RouterLink} to="/trainings" rightIcon={<Icon as={FiArrowRight} />} size="sm" variant="outline" label="View All" />
        </Flex>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (<Skeleton key={i} height="200px" borderRadius="lg" />))
          ) : upcomingTrainings.length > 0 ? (
            upcomingTrainings.map(training => (
              <Card key={training.id} variant="outline" _hover={{ shadow: 'md', transform: 'translateY(-4px)' }} transition="all 0.2s" p={0}>
                <VStack align="stretch" spacing={3}>
                  <Flex justifyContent="space-between" alignItems="flex-start" px={6} pt={6}>
                    <Heading size="md" fontWeight="medium" color={headingColor} noOfLines={2}>{training.title}</Heading>
                    <Badge variant={getMandatoryBadgeVariant(training.isMandatory)}>{training.isMandatory ? 'Mandatory' : 'Optional'}</Badge>
                  </Flex>
                  <Stack spacing={3} px={6} py={3}>
                    <Flex align="center"><Icon as={FiCalendar} color="gray.500" mr={2} fontSize="14px" /><Text fontSize="sm" color={textColor}>{formatDate(training.startDate)}</Text></Flex>
                    <Flex align="center"><Icon as={FiClock} color="gray.500" mr={2} fontSize="14px" /><Text fontSize="sm" color={textColor}>{formatTime(training.startDate)} - {formatTime(training.endDate)}</Text></Flex>
                    <Flex align="center"><Icon as={FiMapPin} color="gray.500" mr={2} fontSize="14px" /><Text fontSize="sm" color={textColor}>{training.isVirtual ? 'Virtual (Online)' : training.location}</Text></Flex>
                  </Stack>
                  <Divider mt={3} />
                  <HStack w="100%" justifyContent="flex-end" p={4}>
                    <ActionButton onClick={() => handleViewDetails(training)} size="sm" variant="solid" colorScheme="brand" label="View Details" />
                  </HStack>
                </VStack>
              </Card>
            ))
          ) : (
            <Card p={4} bg="gray.50" borderRadius="md" width="100%"><Text>No upcoming training sessions found.</Text></Card>
          )}
        </SimpleGrid>
      </Box>

      {/* Available Trainings */}
      <Box mt={10}>
        <Flex justifyContent="space-between" alignItems="center" mb={4}>
          <Heading as="h2" size="lg" color={headingColor}>Available Trainings</Heading>
          <ActionButton as={RouterLink} to="/trainings" rightIcon={<Icon as={FiArrowRight} />} size="sm" variant="outline" label="View All" />
        </Flex>
        <Card p={0} overflow="hidden">
          <TableContainer>
            <Table variant="simple" width="100%">
              <Thead bg={tableHeadBg}>
                <Tr><Th>Training</Th><Th>Date</Th><Th>Time</Th><Th>Location</Th><Th>Capacity</Th><Th>Actions</Th></Tr>
              </Thead>
              <Tbody>
                {upcomingTrainings.map(training => (
                  <Tr key={training.id} _hover={{ bg: tableRowHoverBg }}>
                    <Td>
                      <Box>
                        <HStack spacing={2} mb={1}><Text fontWeight="medium">{training.title}</Text>{training.isMandatory && <Badge variant="required">Mandatory</Badge>}</HStack>
                        <HStack fontSize="xs" color={textColor} mt={1}><Text>{training.category}</Text><Text>•</Text><Text>{training.level}</Text></HStack>
                      </Box>
                    </Td>
                    <Td>{formatDate(training.startDate)}</Td>
                    <Td>{formatTime(training.startDate)}</Td>
                    <Td><Text noOfLines={1}>{training.location}</Text></Td>
                    <Td>
                      <HStack><Text>{training.availableSeats}/{training.totalSeats}</Text><Badge bg={training.availableSeats > 0 ? availableBadgeBg : fullBadgeBg} color={training.availableSeats > 0 ? availableBadgeColor : fullBadgeColor}>{training.availableSeats > 0 ? "Available" : "Full"}</Badge></HStack>
                    </Td>
                    <Td><ActionButton onClick={() => handleRegister(training.id, training.title)} size="sm" label="Register" /></Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Card>
      </Box>

      {/* Mandatory Requirements */}
      <Box mt={10}>
        <Heading as="h2" size="lg" mb={6} color={headingColor}>Mandatory Requirements</Heading>
        {isLoading ? (
          <Skeleton height="100px" borderRadius="lg" />
        ) : mandatoryTrainings.length > 0 ? (
          <Card>
            <UnorderedList spacing={4} styleType="none" ml={0}>
              {mandatoryTrainings.map(training => (
                <ListItem key={training.id} p={4} borderRadius="lg" bg={cardBg} borderWidth="1px" borderColor={cardBorderColor} _hover={{ bg: tableRowHoverBg, borderColor: 'gray.300' }} transition="all 0.2s">
                  <Flex justifyContent="space-between" alignItems="center">
                    <Box>
                      <HStack mb={1}><Text fontWeight="medium">{training.title}</Text><Badge variant="required">Required</Badge></HStack>
                      <Text fontSize="sm" color={textColor}>Due by: {formatDate(training.dueDate)}</Text>
                    </Box>
                    <ActionButton as={RouterLink} to={`/trainings/${training.id}`} size="sm" label="Start Now" />
                  </Flex>
                </ListItem>
              ))}
            </UnorderedList>
          </Card>
        ) : (
          <Card textAlign="center" py={10}>
            <Icon as={FiCheckCircle} boxSize="12" color={headingColor} mb={4} />
            <Heading as="h3" size="md" mb={2} color={headingColor}>All caught up!</Heading>
            <Text color={textColor}>You have no pending mandatory trainings.</Text>
          </Card>
        )}
      </Box>

      {/* View Details Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent borderRadius="xl">
          <ModalHeader bg={modalHeaderBg} color="white" borderTopRadius="xl" py={4} px={6}>
            {selectedTraining?.title}
            {selectedTraining?.isMandatory && <Badge ml={2} variant="required">Mandatory</Badge>}
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody p={6}>
            {selectedTraining && (
              <Stack spacing={4}>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <Box><Text fontWeight="bold" mb={1}>Date</Text><Flex align="center"><Icon as={FiCalendar} color="gray.500" mr={2} /><Text>{formatDate(selectedTraining.startDate)}</Text></Flex></Box>
                  <Box><Text fontWeight="bold" mb={1}>Time</Text><Flex align="center"><Icon as={FiClock} color="gray.500" mr={2} /><Text>{formatTime(selectedTraining.startDate)} - {formatTime(selectedTraining.endDate)}</Text></Flex></Box>
                  <Box><Text fontWeight="bold" mb={1}>Location</Text><Flex align="center"><Icon as={FiMapPin} color="gray.500" mr={2} /><Text>{selectedTraining.isVirtual ? 'Virtual (Online)' : selectedTraining.location}</Text></Flex></Box>
                  <Box><Text fontWeight="bold" mb={1}>Availability</Text><Flex align="center"><Icon as={FiUsers} color="gray.500" mr={2} /><Text>{selectedTraining.availableSeats}/{selectedTraining.totalSeats} seats available</Text></Flex></Box>
                </SimpleGrid>
                <Divider my={2} />
                <Box><Text fontWeight="bold" mb={2}>Category</Text><Badge variant={selectedTraining.category?.toLowerCase() || 'professional'}>{selectedTraining.category}</Badge><Badge colorScheme="purple" ml={2}>{selectedTraining.level}</Badge></Box>
                <Divider my={2} />
                <Box><Text fontWeight="bold" mb={2}>Registration Deadline</Text><Text>{formatDate(selectedTraining.registrationDeadline)}</Text></Box>
              </Stack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>Cancel</Button>
            <ActionButton onClick={() => handleRegister(selectedTraining.id, selectedTraining.title)} label="Register" />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default DashboardPage;
