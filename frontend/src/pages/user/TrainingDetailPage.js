import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  Button, // Keep for modal footer
  Stack,
  Badge,
  Flex,
  Icon,
  Divider,
  SimpleGrid,
  List,
  ListItem,
  ListIcon,
  Skeleton,
  HStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Alert,
  AlertIcon,
  AlertTitle, // Keep AlertTitle
  AlertDescription, // Keep AlertDescription
  Spinner,
  Center,
  useColorModeValue, // Keep useColorModeValue
  VStack, // Keep VStack
} from '@chakra-ui/react';
import {
  FiCalendar,
  FiClock,
  FiMapPin,
  FiUsers,
  FiCheckSquare,
  FiBookOpen,
  FiUser,
  FiPhone,
  FiCheckCircle,
  FiInfo,
  FiChevronRight,
  FiAlertTriangle,
  FiVideo,
  FiLink,
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import useToast from '../../hooks/useToast'; // Assuming this hook exists
import PageHeader from '../../components/common/PageHeader'; // Import PageHeader
import Card from '../../components/common/Card'; // Import common Card
import ActionButton from '../../components/common/ActionButton'; // Import ActionButton

const TrainingDetailPage = () => {
  const { id: trainingId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [training, setTraining] = useState(null);
  const [attendanceStatus, setAttendanceStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const toast = useToast();
  const { isOpen: isAttendanceModalOpen, onOpen: onAttendanceModalOpen, onClose: onAttendanceModalClose } = useDisclosure();

  // Theme colors
  const headingColor = useColorModeValue('sasol.primary', 'white');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const iconColor = useColorModeValue('gray.500', 'gray.400');
  const cardBg = useColorModeValue('white', 'gray.700');
  const errorBg = useColorModeValue('red.50', 'red.900');
  const errorColor = useColorModeValue('red.500', 'red.200');
  const successBg = useColorModeValue('green.50', 'green.900');
  const successColor = useColorModeValue('green.500', 'green.200');
  const infoBg = useColorModeValue('blue.50', 'blue.900');
  const infoColor = useColorModeValue('blue.500', 'blue.200');


  // Fetch training details (keeping existing mock logic)
  useEffect(() => {
    const fetchDetails = async () => {
      if (!trainingId) { setError("Training ID not found."); setIsLoading(false); return; }
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 700));
        const storedTrainings = JSON.parse(localStorage.getItem('trainings') || '[]');
        const foundTraining = storedTrainings.find(t => t.id.toString() === trainingId);
        if (foundTraining) {
          setTraining(foundTraining);
          // Simulate fetching user attendance status
          if (foundTraining.id === 101) setAttendanceStatus('registered');
          else if (foundTraining.id === 106) setAttendanceStatus('attended');
          else setAttendanceStatus(null);
        } else { setError('Training not found.'); }
      } catch (err) { setError('Failed to load training details.'); }
      finally { setIsLoading(false); }
    };
    fetchDetails();
  }, [trainingId]);

  // Register handler (keeping existing mock logic)
  const handleRegister = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    setAttendanceStatus('registered');
    toast({ title: "Registration Successful", status: "success", duration: 3000 });
    if (isAttendanceModalOpen) onAttendanceModalClose();
  };

  // Formatters (keeping existing logic)
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const formatTime = (dateString) => new Date(dateString).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  const calculateDuration = (start, end) => `${((new Date(end) - new Date(start)) / 3600000).toFixed(1)} hours`;

  // Badge variants
  const getStatusBadgeVariant = (status) => status?.toLowerCase() || 'unknown';
  const getMandatoryBadgeVariant = (isMandatory) => isMandatory ? 'required' : 'optional';

  // Loading State
  if (isLoading) { return (<Center minH="300px"><Spinner size="xl" color="sasol.primary" /></Center>); }

  // Error State
  if (error) { return (<Alert status="error" mb={6} borderRadius="md"><AlertIcon /> {error}</Alert>); }

  // Not Found State
  if (!training) { return (<Box textAlign="center" py={10}><Heading size="lg">Training Not Found</Heading><Text mt={4}>Could not find details for this training.</Text><Button mt={6} onClick={() => navigate('/trainings')}>Back to List</Button></Box>); }

  const isPastTraining = new Date(training.endDate) < new Date();

  return (
    <Box>
      <PageHeader
        title={training.title}
        actions={
          attendanceStatus ? (
            <Badge variant={getStatusBadgeVariant(attendanceStatus)} fontSize="md" px="3" py="1.5">
              {attendanceStatus === 'registered' ? 'Registered' : attendanceStatus === 'attended' ? 'Attended' : 'Missed'}
            </Badge>
          ) : !isPastTraining ? (
            <ActionButton
              label="Register Now"
              onClick={handleRegister}
              isDisabled={training.status !== 'scheduled'}
              size="md"
            />
          ) : null
        }
      />

      {/* Use SimpleGrid for layout */}
      <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6} mt={4}>

        {/* Left Column (Details) */}
        <VStack spacing={6} align="stretch" gridColumn={{ lg: 'span 2' }}>
          <Card> {/* Use common Card */}
            <Heading size="md" mb={4} color={headingColor}>Training Information</Heading>
            <List spacing={4}>
              <ListItem><HStack><Icon as={FiCalendar} color={iconColor} /><Text fontWeight="bold">Date:</Text><Text>{formatDate(training.startDate)}</Text></HStack></ListItem>
              <ListItem><HStack><Icon as={FiClock} color={iconColor} /><Text fontWeight="bold">Time:</Text><Text>{formatTime(training.startDate)} - {formatTime(training.endDate)} ({calculateDuration(training.startDate, training.endDate)})</Text></HStack></ListItem>
              <ListItem>
                <HStack><Icon as={training.isVirtual ? FiVideo : FiMapPin} color={iconColor} /><Text fontWeight="bold">Location:</Text><Text>{training.isVirtual ? 'Virtual (Online)' : training.location}</Text></HStack>
                {training.isVirtual && training.meetingLink && <Button as="a" href={training.meetingLink} target="_blank" size="xs" mt={1} variant="link" leftIcon={<FiLink />}>Join Meeting</Button>}
              </ListItem>
              {(training.facilitatorName) && (
                <ListItem><HStack><Icon as={FiUser} color={iconColor} /><Text fontWeight="bold">Facilitator:</Text><Text>{training.facilitatorName}</Text></HStack></ListItem>
              )}
            </List>
          </Card>

          <Card> {/* Use common Card */}
            <Heading size="md" mb={3} color={headingColor}>Description</Heading>
            <Text color={textColor}>{training.description || 'No description available.'}</Text>
          </Card>

          {training.prerequisites && training.prerequisites.length > 0 && (
            <Card> {/* Use common Card */}
              <Heading size="md" mb={3} color={headingColor}>Prerequisites</Heading>
              <List styleType="disc" pl={5} spacing={1}>
                {training.prerequisites.map((prereq, i) => <ListItem key={i}>{prereq}</ListItem>)}
              </List>
            </Card>
          )}
        </VStack>

        {/* Right Column (Status & Actions) */}
        <VStack spacing={6} align="stretch">
          <Card> {/* Use common Card */}
            <Heading size="sm" mb={3} color={headingColor}>Status</Heading>
            <Stack spacing={3}>
              <HStack><Text fontWeight="bold">Type:</Text><Badge variant={getMandatoryBadgeVariant(training.isMandatory)}>{training.isMandatory ? "Mandatory" : "Optional"}</Badge></HStack>
              <HStack><Text fontWeight="bold">Category:</Text><Badge variant={training.category?.toLowerCase() || 'professional'}>{training.category}</Badge></HStack>
              <HStack><Text fontWeight="bold">Level:</Text><Badge colorScheme="purple">{training.level}</Badge></HStack>
              <HStack><Text fontWeight="bold">Current Status:</Text><Badge variant={getStatusBadgeVariant(training.status)}>{training.status}</Badge></HStack>
              {training.capacity && (
                 <HStack><Text fontWeight="bold">Capacity:</Text><Text>{training.attendees}/{training.capacity} ({training.capacity - training.attendees} seats left)</Text></HStack>
              )}
              <HStack><Text fontWeight="bold">Reg. Deadline:</Text><Text>{formatDate(training.registrationDeadline)}</Text></HStack>
            </Stack>
          </Card>

          {/* Attendance/Declaration Button */}
          {attendanceStatus === 'registered' && !isPastTraining && (
            <Card>
              <ActionButton
                colorScheme="green"
                leftIcon={<FiCheckCircle />}
                size="lg"
                width="full"
                onClick={onAttendanceModalOpen}
                label="Mark Attendance & Complete Declaration"
              />
            </Card>
          )}
        </VStack>

      </SimpleGrid>

      {/* Attendance & Declaration Modal Placeholder */}
      <Modal isOpen={isAttendanceModalOpen} onClose={onAttendanceModalClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Attendance & Declaration</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Alert status="info">
              <AlertIcon />
              This section would contain the form for confirming attendance and completing any required declarations for "{training?.title}".
            </Alert>
            <Text mt={4}>Form content goes here...</Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onAttendanceModalClose}>Cancel</Button>
            <ActionButton
              label="Submit Attendance"
              onClick={() => {
                 // Simulate submission
                 toast({ title: "Attendance Submitted (Simulated)", status: "success" });
                 onAttendanceModalClose();
                 setAttendanceStatus('attended'); // Update local state for demo
              }}
            />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default TrainingDetailPage;
