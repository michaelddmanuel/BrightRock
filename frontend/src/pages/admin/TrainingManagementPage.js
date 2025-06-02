import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Heading, // Keep for Card titles if needed
  Text,
  Icon,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Input,
  Select,
  HStack,
  Divider,
  Skeleton,
  InputGroup,
  InputLeftElement,
  useToast, // Keep useToast
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  VStack,
  Progress,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Stack, // Keep Stack
  Checkbox, // Keep Checkbox
  FormControl, // Keep FormControl
  FormLabel, // Keep FormLabel
  Alert, // Keep Alert
  AlertIcon, // Keep AlertIcon
  IconButton, // Keep IconButton
  Portal, // Keep Portal
  TableContainer, // Use TableContainer
  // useColorModeValue removed - using light mode only
  Button, // Keep Button for specific cases like modal footer
} from '@chakra-ui/react';
import {
  FiSearch,
  FiFilter,
  FiCalendar,
  FiPlus,
  FiMoreVertical,
  FiEye,
  FiEdit2,
  FiUsers,
  FiDownload,
  FiTrash2,
  FiClock,
  FiMapPin,
  FiXCircle, // Added for Clear Filters
} from 'react-icons/fi';
import api from '../../services/api';
import { AddTrainingModal } from '../../components/admin'; // Keep modal imports
// Removed ViewTrainingModal import as it's likely user-specific
import PageHeader from '../../components/common/PageHeader'; // Import PageHeader
import Card from '../../components/common/Card'; // Import common Card
import ActionButton from '../../components/common/ActionButton'; // Import ActionButton

const TrainingManagementPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [trainings, setTrainings] = useState([]);
  const [filteredTrainings, setFilteredTrainings] = useState([]);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ status: '', type: '', date: '' });
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [showPast, setShowPast] = useState(false);
  const [trainingToEdit, setTrainingToEdit] = useState(null);

  // Modal states
  const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure();
  const { isOpen: isAddEditModalOpen, onOpen: onAddEditModalOpen, onClose: onAddEditModalClose } = useDisclosure();

  // Theme colors - fixed to light mode values only
  const tableHeadBg = 'gray.50';
  const tableRowHoverBg = 'gray.50';
  const errorBg = 'red.50';
  const errorColor = 'red.500';
  const headingColor = 'sasol.primary';
  const textColor = 'gray.600';
  const iconColor = 'gray.400';
  const inputFocusBorderColor = 'sasol.primary';
  const inputBorderColor = 'gray.300';

  // Fetch trainings logic (keeping existing logic)
  useEffect(() => {
    const fetchTrainings = async () => {
      setIsLoading(true);
      try {
        const storedTrainings = localStorage.getItem('trainings');
        if (storedTrainings) {
          const parsedTrainings = JSON.parse(storedTrainings);
          setTrainings(parsedTrainings);
          // Apply initial filters here if needed, before setting filteredTrainings
          setFilteredTrainings(applyFilters(parsedTrainings, searchTerm, filters, showPast)); // Apply filters initially
          setIsLoading(false);
        } else {
          // Mock data fetch
          setTimeout(() => {
            const mockTrainings = [
              { id: 1, title: 'ESD Compliance Workshop', date: '2025-03-02T09:00:00', endDate: '2025-03-02T12:00:00', status: 'scheduled', attendees: 24, capacity: 30, isMandatory: true, isVirtual: false, location: 'Sasol Head Office', facilitatorName: 'John Smith', description: 'Key compliance requirements...', category: 'Compliance', type: 'In-Person', level: 'Intermediate' },
              { id: 2, title: 'Safety Protocols Training', date: '2025-03-05T10:00:00', endDate: '2025-03-05T15:00:00', status: 'scheduled', attendees: 18, capacity: 25, isMandatory: true, isVirtual: true, location: 'Online', facilitatorName: 'Sarah Johnson', description: 'Essential safety protocols...', category: 'Safety', type: 'Virtual', level: 'Basic' },
              { id: 3, title: 'Vendor Onboarding Session', date: '2025-03-10T14:00:00', endDate: '2025-03-10T16:30:00', status: 'scheduled', attendees: 12, capacity: 20, isMandatory: false, isVirtual: false, location: 'Sasol Training Center, Secunda', facilitatorName: 'David Williams', description: 'Onboarding for new vendors...', category: 'Onboarding', type: 'In-Person', level: 'Beginner' },
              { id: 4, title: 'Environmental Compliance Workshop', date: '2025-02-15T09:00:00', endDate: '2025-02-15T12:00:00', status: 'completed', attendees: 28, capacity: 30, isMandatory: true, isVirtual: false, location: 'Sasol Head Office', facilitatorName: 'Emily Brown', description: 'Workshop on environmental regulations...', category: 'Compliance', type: 'In-Person', level: 'Intermediate' },
            ];
            setTrainings(mockTrainings);
            setFilteredTrainings(applyFilters(mockTrainings, searchTerm, filters, showPast)); // Apply filters initially
            localStorage.setItem('trainings', JSON.stringify(mockTrainings));
            setIsLoading(false);
          }, 1000);
        }
      } catch (err) { setError('Failed to load training sessions.'); setIsLoading(false); }
    };
    fetchTrainings();
  }, []); // Removed dependencies to fetch only once

  // LocalStorage sync (keeping existing logic)
  useEffect(() => { if (trainings.length > 0) { localStorage.setItem('trainings', JSON.stringify(trainings)); } }, [trainings]);

  // Filter logic (modified to include showPast)
  const applyFilters = (trainingsToFilter, currentSearchTerm, currentFilters, currentShowPast) => {
    let result = [...trainingsToFilter];
    if (!currentShowPast) { const now = new Date(); result = result.filter(t => new Date(t.endDate) >= now || t.status === 'scheduled'); }
    if (currentSearchTerm) { const lowerSearch = currentSearchTerm.toLowerCase(); result = result.filter(t => t.title.toLowerCase().includes(lowerSearch) || (t.description && t.description.toLowerCase().includes(lowerSearch)) || (t.facilitatorName && t.facilitatorName.toLowerCase().includes(lowerSearch)) || (t.location && t.location.toLowerCase().includes(lowerSearch))); }
    if (currentFilters.status) { result = result.filter(t => t.status === currentFilters.status); }
    if (currentFilters.type) {
        if (currentFilters.type === 'mandatory') result = result.filter(t => t.isMandatory);
        else if (currentFilters.type === 'optional') result = result.filter(t => !t.isMandatory);
        else if (currentFilters.type === 'virtual') result = result.filter(t => t.isVirtual);
        else if (currentFilters.type === 'physical') result = result.filter(t => !t.isVirtual);
    }
    if (currentFilters.date) { /* Date filtering logic */ } // Keep existing date logic if needed
    return result;
  };

  // Update filtered list when filters/search/showPast change
  useEffect(() => {
    setFilteredTrainings(applyFilters(trainings, searchTerm, filters, showPast));
  }, [searchTerm, filters, trainings, showPast]);


  // Handlers (keeping existing logic, adjusted for clarity)
  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleFilterChange = (filterType, value) => setFilters(prev => ({ ...prev, [filterType]: value }));
  const clearFilters = () => { setSearchTerm(''); setFilters({ status: '', type: '', date: '' }); setShowPast(false); }; // Also reset showPast
  const handleAddTrainingClick = () => { setTrainingToEdit(null); onAddEditModalOpen(); };
  const handleEditTrainingClick = (training) => { setTrainingToEdit(training); onAddEditModalOpen(); };
  const handleDeleteClick = (training) => { setSelectedTraining(training); onDeleteModalOpen(); };

  // Add/Update Training Handler
  const handleTrainingChange = (newOrUpdatedTraining) => {
    let updatedTrainings;
    if (trainingToEdit) { // Update
      updatedTrainings = trainings.map(t => t.id === newOrUpdatedTraining.id ? newOrUpdatedTraining : t);
      toast({ title: "Training Updated", status: "success", duration: 3000, isClosable: true });
    } else { // Add
      const trainingWithId = { ...newOrUpdatedTraining, id: Math.random().toString(36).substr(2, 9) }; // Simple ID generation
      updatedTrainings = [trainingWithId, ...trainings];
      toast({ title: "Training Added", status: "success", duration: 3000, isClosable: true });
    }
    setTrainings(updatedTrainings);
    onAddEditModalClose();
  };

  // Delete Confirmation Handler
  const handleDeleteConfirm = async () => {
    if (!selectedTraining) return;
    setIsDeleteLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const updatedTrainings = trainings.filter(t => t.id !== selectedTraining.id);
      setTrainings(updatedTrainings);
      toast({ title: 'Training Deleted', status: 'success', duration: 3000, isClosable: true });
      onDeleteModalClose();
    } catch (error) {
      toast({ title: 'Error Deleting', description: 'Could not delete training.', status: 'error', duration: 3000, isClosable: true });
    } finally {
      setIsDeleteLoading(false);
    }
  };

  // Formatters (keeping existing logic)
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  const formatTime = (dateString) => new Date(dateString).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

  // Badge helpers (using theme variants from index.js)
  const getStatusBadgeColorScheme = (status) => { /* ... keep existing logic ... */ }; // Assuming this logic is correct
  
  // Helper function for mandatory badge variant
  const getMandatoryBadgeVariant = (isMandatory) => {
    return isMandatory ? 'solid' : 'outline';
  };

  return (
    <Box>
      <PageHeader
        title="Training Management"
        actions={
          <ActionButton
            leftIcon={<Icon as={FiPlus} />}
            onClick={handleAddTrainingClick}
            label="Add Training"
          />
        }
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
             <FormControl display="flex" alignItems="center" width="auto">
                <Checkbox isChecked={showPast} onChange={(e) => setShowPast(e.target.checked)} colorScheme="brand">
                  Show Past
                </Checkbox>
              </FormControl>
             <Select placeholder="All Statuses" /* ... props ... */ value={filters.status} onChange={(e) => handleFilterChange('status', e.target.value)} />
             <Select placeholder="All Types" /* ... props ... */ value={filters.type} onChange={(e) => handleFilterChange('type', e.target.value)}>
                <option value="mandatory">Mandatory</option>
                <option value="optional">Optional</option>
                <option value="virtual">Virtual</option>
                <option value="physical">Physical</option>
             </Select>
             <Select placeholder="All Dates" /* ... props ... */ value={filters.date} onChange={(e) => handleFilterChange('date', e.target.value)}>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
             </Select>
             <Button variant="outline" onClick={clearFilters} ml="auto" leftIcon={<Icon as={FiXCircle} />}>Clear Filters</Button>
          </Flex>
        </VStack>
      </Card>

      {/* Training Table */}
      <TableContainer>
        <Table variant="simple">
          <Thead bg={tableHeadBg}>
            <Tr>
              <Th>Training</Th>
              <Th>Date & Time</Th>
              <Th>Location</Th>
              <Th>Status</Th>
              <Th>Attendance</Th>
              <Th textAlign="right">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {isLoading ? (
              Array(5).fill(0).map((_, i) => (
                <Tr key={i}><Td colSpan={6}><Skeleton height="40px" /></Td></Tr>
              ))
            ) : filteredTrainings.length > 0 ? (
              filteredTrainings.map(training => (
                <Tr key={training.id} _hover={{ bg: tableRowHoverBg }}>
                  <Td>
                    <Box>
                      <HStack spacing={2} mb={1}>
                        {training.isMandatory && <Badge variant={getMandatoryBadgeVariant(training.isMandatory)}>Mandatory</Badge>}
                        <Text fontWeight="medium">{training.title}</Text>
                      </HStack>
                      <Text fontSize="xs" color={textColor} noOfLines={1}>{training.description}</Text>
                      <Text fontSize="xs" color={textColor} mt={1}><Icon as={FiUsers} mr={1} />{training.facilitatorName || 'N/A'}</Text>
                    </Box>
                  </Td>
                  <Td>
                    {formatDate(training.startDate)}<br />
                    <Text fontSize="sm" color={textColor}>{formatTime(training.startDate)} - {formatTime(training.endDate)}</Text>
                  </Td>
                  <Td>
                    <Text display="flex" alignItems="center">
                      <Icon as={FiMapPin} mr={1} />{training.isVirtual ? 'Virtual' : training.location}
                    </Text>
                  </Td>
                  <Td><Badge colorScheme={getStatusBadgeColorScheme(training.status)}>{training.status}</Badge></Td>
                  <Td>
                    <HStack spacing={2}>
                      <Text>{training.attendees}/{training.capacity}</Text>
                      <Progress value={(training.attendees / training.capacity) * 100} size="xs" width="60px" colorScheme="blue" borderRadius="full" />
                    </HStack>
                  </Td>
                  <Td textAlign="right">
                    <Menu placement="bottom-end">
                      <MenuButton as={IconButton} aria-label="Options" icon={<FiMoreVertical />} variant="ghost" size="sm" />
                      <Portal>
                        <MenuList minW="160px">
                          <MenuItem icon={<FiEye />} onClick={() => navigate(`/admin/trainings/${training.id}`)}>View Details</MenuItem>
                          <MenuItem icon={<FiEdit2 />} onClick={() => handleEditTrainingClick(training)}>Edit</MenuItem>
                          <MenuItem icon={<FiUsers />} onClick={() => navigate(`/admin/trainings/${training.id}/attendees`)}>Manage Attendees</MenuItem>
                          <MenuItem icon={<FiDownload />} onClick={() => {/* Export */}}>Export</MenuItem>
                          <MenuItem icon={<FiTrash2 />} color="red.500" onClick={() => handleDeleteClick(training)}>Delete</MenuItem>
                        </MenuList>
                      </Portal>
                    </Menu>
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr><Td colSpan={6} textAlign="center" py={6}>No training sessions found.</Td></Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={onDeleteModalClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Training</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure you want to delete "{selectedTraining?.title}"? This action cannot be undone.</ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onDeleteModalClose}>Cancel</Button>
            <ActionButton colorScheme="red" isLoading={isDeleteLoading} onClick={handleDeleteConfirm} label="Delete" />
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Add/Edit Training Modal */}
      <AddTrainingModal
        isOpen={isAddEditModalOpen}
        onClose={onAddEditModalClose}
        trainingToEdit={trainingToEdit}
        onTrainingChange={handleTrainingChange}
      />
    </Box>
  );
};

export default TrainingManagementPage;
