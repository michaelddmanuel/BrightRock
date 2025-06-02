import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Divider,
  Avatar,
  AvatarGroup,
  Progress,
  Select,
  SimpleGrid,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Textarea,
  FormControl,
  FormLabel,
  FormHelperText,
  useToast as useChakraToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Tooltip,
  Switch,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton
} from '@chakra-ui/react';
import { 
  FiUser, 
  FiAlertCircle, 
  FiCheck, 
  FiClock,
  FiTrendingUp,
  FiTrendingDown,
  FiFilter,
  FiChevronDown,
  FiDownload,
  FiPlus,
  FiSearch,
  FiTrash2,
  FiEdit,
  FiRefreshCw,
  FiMail,
  FiMessageSquare,
  FiMessageCircle,
  FiFileText,
  FiMoreVertical,
  FiBarChart2
} from 'react-icons/fi';
import { CloseIcon } from '@chakra-ui/icons';
import { useAuth } from '../../contexts/AuthContext';

// Mock data for Manager dashboard
const mockTeamStats = {
  totalCases: 245,
  processingRate: 82.5,
  slaCompliance: 94.2,
  teamEfficiency: 88.7,
  targetProcessingRate: 80,
  previousPeriodCases: 198,
  previousPeriodEfficiency: 82.1
};

// Mock data
const mockTeamMembers = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@brightrock.com',
    role: 'DS',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
    tasksCompleted: 27,
    tasksInProgress: 5,
    tasksPending: 12,
    conversionRate: 78.5,
    averageDailyCases: 8.3,
    slaBreaches: 2,
    performance: 92,
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@brightrock.com',
    role: 'DS',
    avatarUrl: 'https://i.pravatar.cc/150?img=2',
    tasksCompleted: 19,
    tasksInProgress: 3,
    tasksPending: 8,
    conversionRate: 82.1,
    averageDailyCases: 7.5,
    slaBreaches: 0,
    performance: 95,
  },
  {
    id: 3,
    firstName: 'David',
    lastName: 'Johnson',
    email: 'david.johnson@brightrock.com',
    role: 'DS',
    avatarUrl: 'https://i.pravatar.cc/150?img=3',
    tasksCompleted: 15,
    tasksInProgress: 7,
    tasksPending: 14,
    conversionRate: 68.5,
    averageDailyCases: 6.2,
    slaBreaches: 3,
    performance: 75,
  },
  {
    id: 4,
    firstName: 'Sarah',
    lastName: 'Williams',
    email: 'sarah.williams@brightrock.com',
    role: 'DS',
    avatarUrl: 'https://i.pravatar.cc/150?img=4',
    tasksCompleted: 31,
    tasksInProgress: 2,
    tasksPending: 5,
    conversionRate: 85.3,
    averageDailyCases: 9.1,
    slaBreaches: 1,
    performance: 88,
  },
];



// Mock task data
const mockTeamTasks = [
  {
    id: 1,
    quoteId: 'Q12345',
    clientName: 'John Smith',
    assignedTo: 'John Doe',
    status: 'pending',
    dueDate: '2025-06-03T16:30:00Z',
    description: 'Review and process client application',
  },
  {
    id: 2,
    quoteId: 'Q12346',
    clientName: 'Alice Johnson',
    assignedTo: 'Jane Smith',
    status: 'in_progress',
    dueDate: '2025-06-02T12:00:00Z',
    description: 'Verify client information and update records',
  },
  {
    id: 3,
    quoteId: 'Q12347',
    clientName: 'Robert Brown',
    assignedTo: 'David Johnson',
    status: 'completed',
    dueDate: '2025-06-01T17:00:00Z',
    description: 'Process policy renewal',
  },
  {
    id: 4,
    quoteId: 'Q12348',
    clientName: 'Emily Davis',
    assignedTo: 'Sarah Williams',
    status: 'sla_warning',
    dueDate: '2025-06-01T23:59:00Z',
    description: 'Follow up on client request for policy amendment',
  },
  {
    id: 5,
    quoteId: 'Q12349',
    clientName: 'Michael Wilson',
    assignedTo: 'John Doe',
    status: 'sla_breach',
    dueDate: '2025-05-31T16:00:00Z',
    description: 'Resolve client complaint regarding premium calculation',
  },
];

// Helper function to format dates
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-GB', options);
};

// Helper function to get status badge color
const getStatusBadge = (status) => {
  switch (status) {
    case 'completed':
      return { colorScheme: 'green', text: 'Completed', icon: FiCheck };
    case 'in_progress':
      return { colorScheme: 'blue', text: 'In Progress', icon: FiClock };
    case 'pending':
      return { colorScheme: 'gray', text: 'Pending', icon: null };
    case 'sla_warning':
      return { colorScheme: 'orange', text: 'SLA Warning', icon: FiAlertCircle };
    case 'sla_breach':
      return { colorScheme: 'red', text: 'SLA Breach', icon: FiAlertCircle };
    default:
      return { colorScheme: 'gray', text: status, icon: null };
  }
};

// Team member performance detail modal
const TeamMemberDetailModal = ({ isOpen, onClose, member }) => {
  const toast = useChakraToast();
  
  if (!member) return null;
  
  const handleGenerateReport = () => {
    toast({
      title: "Generating Report",
      description: `Performance report for ${member.firstName} ${member.lastName} is being generated`,
      status: "info",
      duration: 2000,
      isClosable: true,
    });
    
    // Simulate report generation
    setTimeout(() => {
      toast({
        title: "Report Ready",
        description: `PDF Report: ${member.firstName}_${member.lastName}_Performance.pdf has been generated`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }, 2000);
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>DS Performance Details</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex mb={6} align="center">
            <Avatar size="lg" src={member.avatarUrl} name={`${member.firstName} ${member.lastName}`} mr={4} />
            <Box>
              <Heading size="md">{member.firstName} {member.lastName}</Heading>
              <Text color="gray.600">{member.email}</Text>
            </Box>
          </Flex>
          
          <Tabs variant="enclosed" colorScheme="blue">
            <TabList>
              <Tab>Performance</Tab>
              <Tab>Tasks</Tab>
              <Tab>SLA Compliance</Tab>
            </TabList>
            
            <TabPanels>
              <TabPanel>
                <SimpleGrid columns={2} spacing={4} mb={6}>
                  <Stat>
                    <StatLabel>Conversion Rate</StatLabel>
                    <StatNumber>{member.conversionRate}%</StatNumber>
                    <StatHelpText>
                      <StatArrow type="increase" />
                      3.2% increase
                    </StatHelpText>
                  </Stat>
                  
                  <Stat>
                    <StatLabel>Average Daily Cases</StatLabel>
                    <StatNumber>{member.averageDailyCases}</StatNumber>
                    <StatHelpText>
                      <StatArrow type="increase" />
                      0.5 cases more than team average
                    </StatHelpText>
                  </Stat>
                </SimpleGrid>
                
                <Box mb={6}>
                  <Text mb={2}>Overall Performance</Text>
                  <Progress value={member.performance} colorScheme="green" size="lg" borderRadius="md" />
                  <Flex justify="space-between" mt={1}>
                    <Text fontSize="sm" color="gray.500">0%</Text>
                    <Text fontSize="sm" color="gray.500">100%</Text>
                  </Flex>
                </Box>
                
                <Divider my={4} />
                
                <Heading size="sm" mb={4}>Performance History</Heading>
                <Text fontSize="sm" color="gray.500">Performance trend over the last 6 months would appear here as a chart</Text>
              </TabPanel>
              
              <TabPanel>
                <SimpleGrid columns={3} spacing={4} mb={6}>
                  <Stat bg="green.50" p={3} borderRadius="md">
                    <StatLabel>Completed</StatLabel>
                    <StatNumber>{member.tasksCompleted}</StatNumber>
                  </Stat>
                  
                  <Stat bg="blue.50" p={3} borderRadius="md">
                    <StatLabel>In Progress</StatLabel>
                    <StatNumber>{member.tasksInProgress}</StatNumber>
                  </Stat>
                  
                  <Stat bg="gray.50" p={3} borderRadius="md">
                    <StatLabel>Pending</StatLabel>
                    <StatNumber>{member.tasksPending}</StatNumber>
                  </Stat>
                </SimpleGrid>
                
                <Text>Active tasks would appear here in a table</Text>
              </TabPanel>
              
              <TabPanel>
                <Stat mb={6} bg={member.slaBreaches > 0 ? "red.50" : "green.50"} p={4} borderRadius="md">
                  <StatLabel>SLA Breaches</StatLabel>
                  <StatNumber>{member.slaBreaches}</StatNumber>
                  <StatHelpText color={member.slaBreaches > 0 ? "red.500" : "green.500"}>
                    {member.slaBreaches > 0 ? "Requires attention" : "Good standing"}
                  </StatHelpText>
                </Stat>
                
                <Text>SLA compliance history would appear here as a chart</Text>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
        
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button variant="ghost" onClick={handleGenerateReport}>Generate Report</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

// Team Member Form Modal component
const TeamMemberFormModal = ({ isOpen, onClose, member, onSave }) => {
  const isEditing = Boolean(member);
  const [formData, setFormData] = useState(
    member ? { ...member } : {
      firstName: '',
      lastName: '',
      email: '',
      role: 'DS',
      performance: 85,
      avatarUrl: 'https://i.pravatar.cc/150?img=' + Math.floor(Math.random() * 70)
    }
  );
  
  const toast = useChakraToast();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = () => {
    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast({
        title: 'Missing fields',
        description: 'Please fill all required fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    // Create or update team member
    const memberToSave = {
      ...formData,
      id: isEditing ? member.id : Date.now(),
      tasksCompleted: isEditing ? member.tasksCompleted : 0,
      tasksInProgress: isEditing ? member.tasksInProgress : 0,
      tasksPending: isEditing ? member.tasksPending : 0,
      conversionRate: isEditing ? member.conversionRate : 75.0,
      averageDailyCases: isEditing ? member.averageDailyCases : 5.0,
      slaBreaches: isEditing ? member.slaBreaches : 0
    };
    
    onSave(memberToSave, isEditing);
    onClose();
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{isEditing ? 'Edit Team Member' : 'Add Team Member'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Grid templateColumns="repeat(2, 1fr)" gap={4}>
            <FormControl mb={4} isRequired>
              <FormLabel>First Name</FormLabel>
              <Input 
                name="firstName" 
                value={formData.firstName} 
                onChange={handleChange} 
                placeholder="First name"
              />
            </FormControl>
            
            <FormControl mb={4} isRequired>
              <FormLabel>Last Name</FormLabel>
              <Input 
                name="lastName" 
                value={formData.lastName} 
                onChange={handleChange} 
                placeholder="Last name"
              />
            </FormControl>
          </Grid>
          
          <FormControl mb={4} isRequired>
            <FormLabel>Email</FormLabel>
            <Input 
              name="email" 
              type="email"
              value={formData.email} 
              onChange={handleChange} 
              placeholder="email@brightrock.com"
            />
          </FormControl>
          
          <Grid templateColumns="repeat(2, 1fr)" gap={4}>
            <FormControl mb={4}>
              <FormLabel>Role</FormLabel>
              <Select name="role" value={formData.role} onChange={handleChange}>
                <option value="DS">DS</option>
                <option value="Senior DS">Senior DS</option>
                <option value="Team Lead">Team Lead</option>
              </Select>
            </FormControl>
            
            <FormControl mb={4}>
              <FormLabel>Performance Rating (%)</FormLabel>
              <Input 
                name="performance"
                type="number"
                min="0"
                max="100"
                value={formData.performance}
                onChange={handleChange}
              />
            </FormControl>
          </Grid>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            {isEditing ? 'Save Changes' : 'Add Member'}
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

// Delete Confirmation Dialog
const DeleteConfirmationDialog = ({ isOpen, onClose, itemId, itemType, onDelete }) => {
  const cancelRef = useRef();
  
  const handleDelete = () => {
    onDelete(itemId);
    onClose();
  };
  
  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Delete {itemType}
          </AlertDialogHeader>

          <AlertDialogBody>
            Are you sure you want to delete this {itemType.toLowerCase()}? This action cannot be undone.
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleDelete} ml={3}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

const ManagerDashboard = () => {
  const { currentUser } = useAuth();
  const searchRef = useRef();
  const memberDetailDisclosure = useDisclosure();
  const taskDetailDisclosure = useDisclosure();
  const newTaskDisclosure = useDisclosure();
  const memberFormDisclosure = useDisclosure();
  const deleteConfirmationDisclosure = useDisclosure();
  const toast = useChakraToast();
  
  // State management
  const [selectedMember, setSelectedMember] = useState(null);
  const [teamMembers, setTeamMembers] = useState(mockTeamMembers);
  const [teamTasks, setTeamTasks] = useState(mockTeamTasks);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteItemType, setDeleteItemType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [dataRefreshing, setDataRefreshing] = useState(false);
  const [showLowPerformers, setShowLowPerformers] = useState(false);
  const [filterPeriod, setFilterPeriod] = useState('this-month');
  
  // Export data function
  const handleExportData = (type) => {
    toast({
      title: 'Preparing export',
      description: `Preparing ${type} data for download`,
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
    
    // Simulate export delay
    setTimeout(() => {
      toast({
        title: 'Export ready',
        description: `${type} data has been downloaded as CSV`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }, 2000);
  };
  
  // Refresh data function
  const refreshData = () => {
    setDataRefreshing(true);
    toast({
      title: 'Refreshing data',
      description: 'Fetching latest team performance data',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
    
    // Simulate refresh delay
    setTimeout(() => {
      setDataRefreshing(false);
      toast({
        title: 'Data refreshed',
        description: 'Team performance data is now up to date',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }, 2000);
  };
  
  // Save team member (create/update)
  const handleSaveMember = (member, isEditing) => {
    if (isEditing) {
      setTeamMembers(teamMembers.map(m => m.id === member.id ? member : m));
      toast({
        title: 'Member updated',
        description: `${member.firstName} ${member.lastName}'s profile has been updated`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } else {
      setTeamMembers([...teamMembers, member]);
      toast({
        title: 'Member added',
        description: `${member.firstName} ${member.lastName} has been added to the team`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  // Delete team member
  const handleDeleteMember = (memberId) => {
    setTeamMembers(teamMembers.filter(member => member.id !== memberId));
    toast({
      title: 'Member removed',
      description: 'Team member has been removed from the system',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };
  
  // Handle edit member
  const handleEditMember = (member) => {
    setSelectedMember(member);
    memberFormDisclosure.onOpen();
  };
  
  // Handle delete confirmation
  const handleDeleteConfirmation = (id, type) => {
    setItemToDelete(id);
    setDeleteItemType(type);
    deleteConfirmationDisclosure.onOpen();
  };
  
  // Handle task deletion
  const handleDeleteTask = (taskId) => {
    setTeamTasks(teamTasks.filter(task => task.id !== taskId));
    toast({
      title: 'Task deleted',
      description: 'The task has been removed from the system',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };
  
  // Handle task reassignment
  const handleReassignTask = (taskId, memberId) => {
    const memberName = teamMembers.find(m => m.id === memberId);
    setTeamTasks(teamTasks.map(task => 
      task.id === taskId ? {...task, assignedTo: `${memberName.firstName} ${memberName.lastName}`} : task
    ));
    
    toast({
      title: 'Task reassigned',
      description: `Task has been reassigned to ${memberName.firstName} ${memberName.lastName}`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };
  
  // Filter team members based on search and filter criteria
  const filteredMembers = teamMembers.filter(member => {
    // Search term filter
    const matchesSearch = 
      `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Role filter
    const matchesRole = filterRole === 'all' || member.role === filterRole;
    
    // Performance filter
    const matchesPerformance = !showLowPerformers || member.performance < 80;
    
    return matchesSearch && matchesRole && matchesPerformance;
  });
  
  // Filter tasks requiring attention
  const tasksRequiringAttention = teamTasks.filter(task => 
    task.status === 'sla_warning' || task.status === 'sla_breach'
  );
  
  const handleMemberSelect = (member) => {
    setSelectedMember(member);
    memberDetailDisclosure.onOpen();
  };

  return (
    <Box bg="white" minH="100vh">
      <Box px={8} py={6} borderBottom="1px solid" borderColor="gray.200">
        <Flex justifyContent="space-between" alignItems="center" width="100%">
          <Box>
            <Heading size="lg" mb={2}>Manager Dashboard</Heading>
            <Text fontSize="md" color="gray.600">
              Welcome, {currentUser?.firstName} {currentUser?.lastName}
            </Text>
          </Box>
        </Flex>
      </Box>

      <Box py={6} px={6}>
        <Box mb={6}>
          <HStack spacing={4}>
            <Select 
              value={filterPeriod} 
              onChange={(e) => setFilterPeriod(e.target.value)}
              w="150px"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
              <option value="last-week">Last Week</option>
              <option value="last-month">Last Month</option>
              <option value="last-quarter">Last Quarter</option>
            </Select>
            <Menu>
              <MenuButton as={Button} rightIcon={<FiChevronDown />} colorScheme="blue">
                Export
              </MenuButton>
              <MenuList>
                <MenuItem icon={<FiDownload />}>Download PDF Report</MenuItem>
                <MenuItem icon={<FiDownload />}>Download Excel Data</MenuItem>
                <MenuItem icon={<FiDownload />}>Schedule Reports</MenuItem>
              </MenuList>
            </Menu>
            <Button colorScheme="blue" onClick={() => handleExportData('Performance Report')}>Generate Report</Button>
          </HStack>
        </Box>

        {/* Key metrics */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
          <Box bg="white" p={6} borderRadius="lg" boxShadow="md">
            <Stat>
              <StatLabel>Total Cases</StatLabel>
              <StatNumber>{mockTeamStats.totalCases}</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                23% from last {filterPeriod}
              </StatHelpText>
            </Stat>
          </Box>
          <Box bg="white" p={6} borderRadius="lg" boxShadow="md">
            <Stat>
              <StatLabel>Processing Rate</StatLabel>
              <StatNumber>{mockTeamStats.processingRate}%</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                5% improvement from previous {filterPeriod}
              </StatHelpText>
            </Stat>
          </Box>
          <Box bg="white" p={6} borderRadius="lg" boxShadow="md">
            <Stat>
              <StatLabel>SLA Compliance</StatLabel>
              <StatNumber>{mockTeamStats.slaCompliance}%</StatNumber>
              <StatHelpText color="red.500">
                <StatArrow type="decrease" />
                3% decrease from target
              </StatHelpText>
            </Stat>
          </Box>
          <Box bg="white" p={6} borderRadius="lg" boxShadow="md">
            <Stat>
              <StatLabel>Team Efficiency</StatLabel>
              <StatNumber>{mockTeamStats.teamEfficiency}%</StatNumber>
              <StatHelpText color="green.500">
                <StatArrow type="increase" />
                8% improvement from last {filterPeriod}
              </StatHelpText>
            </Stat>
          </Box>
        </SimpleGrid>

        {/* Team members performance */}
        <Box bg="white" borderRadius="lg" boxShadow="sm" overflow="hidden" mb={6}>
          <Flex justify="space-between" align="center" p={4} borderBottomWidth="1px">
            <Heading size="md">Team Members</Heading>
            <HStack>
              <Button
                size="sm"
                leftIcon={<FiPlus />}
                colorScheme="blue"
                onClick={() => {
                  setSelectedMember(null);
                  memberFormDisclosure.onOpen();
                }}
              >
                Add Member
              </Button>
            </HStack>
          </Flex>
          
          {/* Search and Filter */}
          <Flex p={4} gap={4} borderBottomWidth="1px" direction={{ base: 'column', md: 'row' }}>
            <InputGroup size="md" flex="1">
              <InputLeftElement pointerEvents="none">
                <FiSearch color="gray.300" />
              </InputLeftElement>
              <Input 
                placeholder="Search team members..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <InputRightElement>
                  <IconButton
                    aria-label="Clear search"
                    icon={<CloseIcon />}
                    size="sm"
                    variant="ghost"
                    onClick={() => setSearchTerm('')}
                  />
                </InputRightElement>
              )}
            </InputGroup>
            
            <Select 
              size="md" 
              w={{ base: '100%', md: '200px' }} 
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="DS">DS</option>
              <option value="Senior DS">Senior DS</option>
              <option value="Team Lead">Team Lead</option>
            </Select>
            
            <FormControl display="flex" alignItems="center" width="auto">
              <FormLabel htmlFor="show-low-performers" mb="0" fontSize="sm" whiteSpace="nowrap">
                Show Low Performers
              </FormLabel>
              <Switch 
                id="show-low-performers" 
                colorScheme="red" 
                isChecked={showLowPerformers}
                onChange={(e) => setShowLowPerformers(e.target.checked)}
              />
            </FormControl>
          </Flex>

          <Box overflowX="auto" p={4}>
            <Table variant="simple" size="md">
              <Thead>
                <Tr>
                  <Th>Member</Th>
                  <Th>Role</Th>
                  <Th>Cases</Th>
                  <Th>Processing Rate</Th>
                  <Th>SLA</Th>
                  <Th>Performance</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredMembers.length === 0 ? (
                  <Tr>
                    <Td colSpan={7} textAlign="center" py={4}>
                      <Text color="gray.500">No team members match your search criteria</Text>
                    </Td>
                  </Tr>
                ) : filteredMembers.map((member) => (
                  <Tr 
                    key={member.id}
                    _hover={{ bg: 'gray.50', cursor: 'pointer' }}
                    onClick={() => handleMemberSelect(member)}
                  >
                    <Td>
                      <HStack>
                        <Avatar size="sm" name={member.firstName + ' ' + member.lastName} src={member.avatarUrl} />
                        <Box>
                          <Text fontWeight="medium">{member.firstName} {member.lastName}</Text>
                          <Text fontSize="sm" color="gray.500">{member.email}</Text>
                        </Box>
                      </HStack>
                    </Td>
                    <Td>{member.role}</Td>
                    <Td>{member.tasksCompleted + member.tasksInProgress + member.tasksPending}</Td>
                    <Td>                      <HStack>
                        <Text>{member.conversionRate}%</Text>
                        {member.conversionRate >= mockTeamStats.averageConversionRate ? (
                          <Box as={FiTrendingUp} color="green.500" />
                        ) : (
                          <Box as={FiTrendingDown} color="red.500" />
                        )}
                      </HStack>
                    </Td>
                    <Td>
                      <Badge colorScheme={member.slaBreaches > 0 ? "red" : "green"}>
                        {member.slaBreaches} breaches
                      </Badge>
                    </Td>
                    <Td>
                      <Box w="100px">
                        <Progress 
                          value={member.performance} 
                          size="sm" 
                          colorScheme={member.performance >= 90 ? "green" : 
                            member.performance >= 75 ? "blue" : 
                            member.performance >= 60 ? "yellow" : "red"
                          }
                          borderRadius="full"
                        />
                        <Text fontSize="xs" mt={1}>{member.performance}%</Text>
                      </Box>
                    </Td>
                    <Td>
                      <HStack spacing={2}>
                        <IconButton
                          icon={<FiBarChart2 />}
                          size="sm"
                          aria-label="View statistics"
                          colorScheme="blue"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMemberSelect(member);
                          }}
                        />
                        <IconButton
                          icon={<FiMessageCircle />}
                          size="sm"
                          aria-label="Message"
                          colorScheme="green"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            toast({
                              title: "Message sent",
                              description: `Message sent to ${member.firstName} ${member.lastName}`,
                              status: "success",
                              duration: 3000,
                              isClosable: true
                            });
                          }}
                        />
                        <IconButton
                          icon={<FiFileText />}
                          size="sm"
                          aria-label="Generate report"
                          colorScheme="orange"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            toast({
                              title: "Generating report",
                              description: `Report for ${member.firstName} ${member.lastName} is being generated`,
                              status: "info",
                              duration: 3000,
                              isClosable: true
                            });
                          }}
                        />
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Box>
        
        {/* Tasks requiring attention */}
        <Box bg="white" borderRadius="lg" boxShadow="sm" mb={6} overflow="hidden">
          <Flex justify="space-between" align="center" p={4} borderBottomWidth="1px">
            <Heading size="md">Tasks Requiring Attention</Heading>
            <Badge colorScheme="red">
              {mockTeamTasks.filter(task => task.status === 'sla_warning' || task.status === 'sla_breach').length} items
            </Badge>
          </Flex>
          
          <Box overflowX="auto" p={4}>
            <Table variant="simple" size="md">
              <Thead>
                <Tr>
                  <Th>Quote ID</Th>
                  <Th>Client</Th>
                  <Th>Assigned To</Th>
                  <Th>Description</Th>
                  <Th>Due Date</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {mockTeamTasks
                  .filter(task => task.status === 'sla_warning' || task.status === 'sla_breach')
                  .map((task) => {
                    const status = getStatusBadge(task.status);
                    const StatusIcon = status.icon;
                    
                    return (
                      <Tr key={task.id}>
                        <Td>{task.quoteId}</Td>
                        <Td>{task.clientName}</Td>
                        <Td>{task.assignedTo}</Td>
                        <Td>{task.description}</Td>
                        <Td>{formatDate(task.dueDate)}</Td>
                        <Td>
                          <Badge colorScheme={status.colorScheme} variant="subtle" px={2} py={1} borderRadius="full">
                            {StatusIcon && <Box as={StatusIcon} display="inline" mr={1} />}
                            {status.text}
                          </Badge>
                        </Td>
                      </Tr>
                    );
                  })}
                {mockTeamTasks.filter(task => task.status === 'sla_warning' || task.status === 'sla_breach').length === 0 && (
                  <Tr>
                    <Td colSpan={6} textAlign="center" py={4}>
                      <Text color="gray.500">No tasks requiring attention</Text>
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </Box>
        </Box>
        
        {/* Member detail modal */}
        <TeamMemberDetailModal
          isOpen={memberDetailDisclosure.isOpen}
          onClose={memberDetailDisclosure.onClose}
          member={selectedMember}
        />
        
        {/* Member form modal */}
        <TeamMemberFormModal
          isOpen={memberFormDisclosure.isOpen}
          onClose={memberFormDisclosure.onClose}
          member={selectedMember}
          onSave={handleSaveMember}
        />
        
        {/* Delete confirmation dialog */}
        <DeleteConfirmationDialog
          isOpen={deleteConfirmationDisclosure.isOpen}
          onClose={deleteConfirmationDisclosure.onClose}
          itemId={itemToDelete}
          itemType={deleteItemType}
          onDelete={deleteItemType === 'Team Member' ? handleDeleteMember : handleDeleteTask}
        />
      </Box>
    </Box>
  );
};

export default ManagerDashboard;
