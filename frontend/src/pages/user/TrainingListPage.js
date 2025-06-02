import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Heading, // Keep Heading for Card titles if needed
  Flex,
  Text,
  SimpleGrid,
  Button, // Keep for specific buttons if needed
  Icon,
  Badge,
  Stack, // Keep Stack
  HStack, // Keep HStack
  Input, // Keep Input
  InputGroup, // Keep InputGroup
  InputLeftElement, // Keep InputLeftElement
  Select, // Keep Select
  Divider, // Keep Divider
  Skeleton, // Keep Skeleton
  // Tag, // Removed unused Tag
  useDisclosure,
  VStack, // Keep VStack
  // Progress, // Removed unused Progress
  useColorModeValue, // Import useColorModeValue
  Alert, // Keep Alert
  AlertIcon, // Keep AlertIcon
  // Removed Chakra Card components: Card, CardHeader, CardBody, CardFooter
} from '@chakra-ui/react';
import {
  FiSearch,
  FiFilter,
  FiCalendar,
  FiMapPin,
  FiClock,
  FiChevronRight,
  FiPlus,
  FiXCircle,
  FiInfo, // Keep FiInfo
  // FiUser, // Removed unused FiUser
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
// import api from '../../services/api'; // Removed unused api import
import { AddTrainingModal } from '../../components/admin'; // Keep modal imports
import { ViewTrainingModal } from '../../components/user'; // Keep modal imports
import PageHeader from '../../components/common/PageHeader'; // Import PageHeader
import Card from '../../components/common/Card'; // Import common Card
import ActionButton from '../../components/common/ActionButton'; // Import ActionButton

const TrainingListPage = () => {
  // const navigate = useNavigate(); // Removed unused navigate
  const { currentUser } = useAuth();
  const [trainings, setTrainings] = useState([]);
  const [filteredTrainings, setFilteredTrainings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ status: 'all', type: 'all', date: '' });
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [trainingToEdit, setTrainingToEdit] = useState(null);
  const { isOpen: isAddModalOpen, onOpen: onAddModalOpen, onClose: onAddModalClose } = useDisclosure();
  const { isOpen: isViewModalOpen, onOpen: onViewModalOpen, onClose: onViewModalClose } = useDisclosure();
  const isAdmin = currentUser && (currentUser.role === 'admin' || currentUser.role === 'esd_admin');

  // Theme colors
  const headingColor = useColorModeValue('sasol.primary', 'white');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const iconColor = useColorModeValue('gray.400', 'gray.500');
  const inputFocusBorderColor = useColorModeValue('sasol.primary', 'brand.300');
  const inputBorderColor = useColorModeValue('gray.300', 'gray.600');
  // const errorBg = useColorModeValue('red.50', 'red.900'); // Removed unused
  // const errorColor = useColorModeValue('red.500', 'red.200'); // Removed unused

  // Fetch trainings logic
  useEffect(() => {
    const fetchTrainings = async () => {
      setIsLoading(true);
      try {
        const storedTrainings = localStorage.getItem('trainings');
        let mockTrainings = [];
        if (storedTrainings) {
          mockTrainings = JSON.parse(storedTrainings);
        } else {
          // Mock data fetch if nothing in localStorage
          mockTrainings = [
            { id: 101, title: 'Safety Procedures and Protocols', description: 'Comprehensive training...', startDate: '2025-03-15T09:00:00', endDate: '2025-03-15T16:00:00', location: 'Training Center A', instructor: 'Dr. Sarah Johnson', category: 'Safety', type: 'In-Person', mandatory: true, availableSeats: 15, totalSeats: 30, status: 'upcoming', registrationDeadline: '2025-03-10', prerequisites: ['Basic Safety Orientation'], level: 'Intermediate', duration: '7 hours', imageUrl: '...' },
            { id: 102, title: 'Emergency Response Training', description: 'Learn to respond effectively...', startDate: '2025-03-22T10:00:00', endDate: '2025-03-22T17:00:00', location: 'Conference Hall B', instructor: 'Michael Kwan', category: 'Emergency', type: 'In-Person', mandatory: false, availableSeats: 8, totalSeats: 25, status: 'upcoming', registrationDeadline: '2025-03-18', prerequisites: [], level: 'All Levels', duration: '7 hours', imageUrl: '...' },
            { id: 103, title: 'Environmental Compliance', description: 'Overview of environmental regulations...', startDate: '2025-04-05T09:30:00', endDate: '2025-04-05T15:30:00', location: 'Meeting Room 103', instructor: 'Elizabeth Chen', category: 'Compliance', type: 'Hybrid', mandatory: true, availableSeats: 20, totalSeats: 40, status: 'upcoming', registrationDeadline: '2025-03-29', prerequisites: [], level: 'Basic', duration: '6 hours', imageUrl: '...' },
            { id: 106, title: 'Chemical Handling and Storage', description: 'Best practices for safely handling...', startDate: '2025-02-15T09:00:00', endDate: '2025-02-15T16:00:00', location: 'Lab Building C', instructor: 'Dr. Marcus Lee', category: 'Safety', type: 'In-Person', mandatory: true, availableSeats: 0, totalSeats: 25, status: 'completed', registrationDeadline: '2025-02-10', prerequisites: ['Basic Safety Orientation'], level: 'Intermediate', duration: '7 hours', imageUrl: '...' },
          ];
          localStorage.setItem('trainings', JSON.stringify(mockTrainings));
        }
        setTrainings(mockTrainings);
        setFilteredTrainings(applyFilters(mockTrainings, searchTerm, filters));
        setIsLoading(false);
      } catch (err) { setError('Failed to load trainings.'); setIsLoading(false); }
    };
    fetchTrainings();
  }, []); // Fetch only once on mount

  // Formatters
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  // const formatTime = (dateString) => new Date(dateString).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }); // Removed unused

  // LocalStorage sync
  useEffect(() => { if (trainings.length > 0) { localStorage.setItem('trainings', JSON.stringify(trainings)); } }, [trainings]);

  // Filter logic
  const applyFilters = (trainingsToFilter, currentSearchTerm, currentFilters) => {
    let result = [...trainingsToFilter];
    if (currentSearchTerm) { const lowerSearch = currentSearchTerm.toLowerCase(); result = result.filter(t => t.title.toLowerCase().includes(lowerSearch) || (t.description && t.description.toLowerCase().includes(lowerSearch)) || (t.instructor && t.instructor.toLowerCase().includes(lowerSearch)) || (t.category && t.category.toLowerCase().includes(lowerSearch))); }
    if (currentFilters.status && currentFilters.status !== 'all') { result = result.filter(t => t.status === currentFilters.status); }
    if (currentFilters.type && currentFilters.type !== 'all') { result = result.filter(t => t.type === currentFilters.type); }
    return result;
  };

   // Update filtered list when filters/search change
   useEffect(() => {
    setFilteredTrainings(applyFilters(trainings, searchTerm, filters));
  }, [searchTerm, filters, trainings]); // Added dependencies


  // Handlers
  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleFilterChange = (filterName, value) => setFilters(prev => ({ ...prev, [filterName]: value }));
  const handleViewTraining = (training) => { setSelectedTraining(training); onViewModalOpen(); };
  const clearFilters = () => { setSearchTerm(''); setFilters({ status: 'all', type: 'all', date: '' }); };

  // Add/Update Training Handler
  const handleTrainingChange = (newOrUpdatedTraining) => {
    let updatedTrainings;
    if (trainingToEdit) {
      updatedTrainings = trainings.map(t => t.id === newOrUpdatedTraining.id ? newOrUpdatedTraining : t);
    } else {
      const trainingWithId = { ...newOrUpdatedTraining, id: Math.random().toString(36).substr(2, 9) };
      updatedTrainings = [trainingWithId, ...trainings];
    }
    setTrainings(updatedTrainings);
    onAddModalClose();
  };

  // Badge helpers
  const getCategoryBadgeVariant = (category) => category?.toLowerCase() || 'professional';
  const getStatusBadgeVariant = (status) => status?.toLowerCase() || 'inactive';
  const getMandatoryBadgeVariant = (isMandatory) => isMandatory ? 'required' : 'optional';

  return (
    <Box>
      <PageHeader
        title="Training Programs"
        actions={isAdmin && (
          <ActionButton
            leftIcon={<Icon as={FiPlus} />}
            onClick={() => { setTrainingToEdit(null); onAddModalOpen(); }}
            label="Add Training"
          />
        )}
      />

      {error && (
        <Alert status="error" mb={6} borderRadius="md">
          <AlertIcon /> {error}
        </Alert>
      )}

      {/* Search and Filters Card */}
      <Card mb={6}>
        <VStack spacing={4} align="stretch">
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Icon as={FiSearch} color={iconColor} />
            </InputLeftElement>
            <Input
              placeholder="Search trainings..."
              value={searchTerm}
              onChange={handleSearchChange}
              borderRadius="md"
              borderColor={inputBorderColor}
              _hover={{ borderColor: inputFocusBorderColor }}
              _focus={{ borderColor: inputFocusBorderColor, boxShadow: `0 0 0 1px ${inputFocusBorderColor}` }}
            />
          </InputGroup>

          <Flex wrap="wrap" gap={4} align="center">
            <Select
              placeholder="All Statuses"
              icon={<Icon as={FiFilter} />}
              width={{ base: '100%', md: 'auto' }}
              minW={{ md: '180px' }}
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              borderRadius="md"
              borderColor={inputBorderColor}
              _hover={{ borderColor: inputFocusBorderColor }}
              _focus={{ borderColor: inputFocusBorderColor, boxShadow: `0 0 0 1px ${inputFocusBorderColor}` }}
            >
              <option value="all">All Statuses</option>
              <option value="upcoming">Upcoming</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </Select>

            <Select
              placeholder="All Types"
              icon={<Icon as={FiFilter} />}
              width={{ base: '100%', md: 'auto' }}
              minW={{ md: '180px' }}
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              borderRadius="md"
              borderColor={inputBorderColor}
              _hover={{ borderColor: inputFocusBorderColor }}
              _focus={{ borderColor: inputFocusBorderColor, boxShadow: `0 0 0 1px ${inputFocusBorderColor}` }}
            >
               <option value="all">All Types</option>
              <option value="In-Person">In-Person</option>
              <option value="Virtual">Virtual</option>
              <option value="Hybrid">Hybrid</option>
            </Select>

            <Button
              variant="outline"
              onClick={clearFilters}
              ml={{ base: 0, md: 'auto' }}
              mt={{ base: 2, md: 0 }}
              borderRadius="md"
              colorScheme="gray"
              leftIcon={<Icon as={FiXCircle} />}
            >
              Clear Filters
            </Button>
          </Flex>
        </VStack>
      </Card>

      {/* Training List */}
      {isLoading ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {Array(6).fill(0).map((_, i) => (
            <Skeleton key={i} height="250px" borderRadius="lg" />
          ))}
        </SimpleGrid>
      ) : filteredTrainings.length > 0 ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {filteredTrainings.map((training) => (
            <Card key={training.id} variant="outline" _hover={{ shadow: 'md', transform: 'translateY(-4px)' }} transition="all 0.2s" p={0}>
              <VStack align="stretch" spacing={3}>
                 <HStack justify="space-between" align="flex-start" px={6} pt={6}>
                    <Badge variant={getCategoryBadgeVariant(training.category)}>
                      {training.category}
                    </Badge>
                    <Badge variant={getStatusBadgeVariant(training.status)}>
                      {training.status}
                    </Badge>
                  </HStack>
                  <Box px={6}>
                    <Heading size="md" mb="2" color={headingColor} noOfLines={2}>
                      {training.title}
                    </Heading>
                    <Text fontSize="sm" color={textColor} mb="3" noOfLines={3}>
                      {training.description}
                    </Text>
                  </Box>
                  <Stack spacing="2" px={6}>
                    <HStack>
                      <Icon as={FiCalendar} color={iconColor} />
                      <Text fontSize="sm">{formatDate(training.startDate)}</Text>
                    </HStack>
                    <HStack>
                      <Icon as={FiMapPin} color={iconColor} />
                      <Text fontSize="sm">{training.location || "Online"}</Text>
                    </HStack>
                    <HStack>
                      <Icon as={FiClock} color={iconColor} />
                      <Text fontSize="sm">{training.duration}</Text>
                    </HStack>
                  </Stack>
                  <Divider mt={3} />
                  <HStack w="100%" justifyContent="space-between" p={4}>
                    <Badge variant={getMandatoryBadgeVariant(training.mandatory)}>
                      {training.mandatory ? "Required" : "Optional"}
                    </Badge>
                    <ActionButton
                      size="sm"
                      rightIcon={<FiChevronRight />}
                      onClick={() => handleViewTraining(training)}
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
          <Heading as="h2" size="lg" mb={2}>No Trainings Found</Heading>
          <Text color={textColor}>No training sessions match your current filters.</Text>
          <Button mt={4} onClick={clearFilters} variant="link" colorScheme="brand">
            Clear All Filters
          </Button>
        </Card>
      )}

      {/* Modals */}
      {isAdmin && (<AddTrainingModal isOpen={isAddModalOpen} onClose={onAddModalClose} onTrainingChange={handleTrainingChange} trainingToEdit={trainingToEdit} />)}
      <ViewTrainingModal isOpen={isViewModalOpen} onClose={onViewModalClose} training={selectedTraining} />
    </Box>
  );
};

export default TrainingListPage;
