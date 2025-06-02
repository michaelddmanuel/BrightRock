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
  useToast,
  Divider,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  InputGroup,
  Image,
  InputLeftElement,
  InputRightElement,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Input,
  Select,
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
} from '@chakra-ui/react';
import { FiPlus, FiAlertCircle, FiCheck, FiClock, FiFilter, FiMoreVertical, FiDownload, FiSearch, FiTrash2, FiEdit } from 'react-icons/fi';
import { CloseIcon } from '@chakra-ui/icons';
import { useAuth } from '../../contexts/AuthContext';

// Mock data for DS dashboard
const mockTasks = [
  {
    id: 1,
    quoteId: 'Q12345',
    policyNumber: 'POL-987-654-321',
    clientName: 'John Smith',
    status: 'pending',
    priority: 'high',
    dueDate: '2025-06-03T16:30:00Z',
    createdAt: '2025-06-01T09:15:00Z',
    description: 'Review and process client application',
  },
  {
    id: 2,
    quoteId: 'Q12346',
    policyNumber: 'POL-987-654-322',
    clientName: 'Alice Johnson',
    status: 'in_progress',
    priority: 'medium',
    dueDate: '2025-06-02T12:00:00Z',
    createdAt: '2025-05-31T14:30:00Z',
    description: 'Verify client information and update records',
  },
  {
    id: 3,
    quoteId: 'Q12347',
    policyNumber: 'POL-987-654-323',
    clientName: 'Robert Brown',
    status: 'completed',
    priority: 'low',
    dueDate: '2025-06-01T17:00:00Z',
    createdAt: '2025-05-31T10:00:00Z',
    description: 'Process policy renewal',
  },
  {
    id: 4,
    quoteId: 'Q12348',
    policyNumber: 'POL-987-654-324',
    clientName: 'Emily Davis',
    status: 'sla_warning',
    priority: 'high',
    dueDate: '2025-06-01T23:59:00Z',
    createdAt: '2025-05-30T11:45:00Z',
    description: 'Follow up on client request for policy amendment',
  },
  {
    id: 5,
    quoteId: 'Q12349',
    policyNumber: 'POL-987-654-325',
    clientName: 'Michael Wilson',
    status: 'sla_breach',
    priority: 'critical',
    dueDate: '2025-05-31T16:00:00Z',
    createdAt: '2025-05-29T09:30:00Z',
    description: 'Resolve client complaint regarding premium calculation',
  },
];

const mockStats = {
  tasksCompleted: 27,
  tasksInProgress: 5,
  tasksPending: 12,
  totalQuotes: 155,
  conversionRate: 78.5,
  averageDailyCases: 8.3,
  slaBreaches: 2
};

// Helper function to format dates
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
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

// Create New Task Modal component
const NewTaskModal = ({ isOpen, onClose, onTaskCreate }) => {
  const [newTask, setNewTask] = useState({
    quoteId: '',
    policyNumber: '',
    clientName: '',
    status: 'pending',
    priority: 'medium',
    description: '',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString().split('T')[0]
  });
  
  const toast = useChakraToast();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = () => {
    // Validation
    if (!newTask.quoteId || !newTask.clientName || !newTask.description) {
      toast({
        title: 'Missing fields',
        description: 'Please fill all required fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    // Create a new task with a unique ID
    const taskToCreate = {
      ...newTask,
      id: Date.now(), // Generate a unique ID
      createdAt: new Date().toISOString(),
      dueDate: new Date(newTask.dueDate + 'T12:00:00').toISOString()
    };
    
    onTaskCreate(taskToCreate);
    
    // Reset form and close modal
    setNewTask({
      quoteId: '',
      policyNumber: '',
      clientName: '',
      status: 'pending',
      priority: 'medium',
      description: '',
      dueDate: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString().split('T')[0]
    });
    onClose();
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Task</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl mb={4} isRequired>
            <FormLabel>Quote ID</FormLabel>
            <Input 
              name="quoteId" 
              value={newTask.quoteId} 
              onChange={handleChange} 
              placeholder="Q12350"
            />
            <FormHelperText>Enter a unique quote identifier</FormHelperText>
          </FormControl>
          
          <FormControl mb={4}>
            <FormLabel>Policy Number</FormLabel>
            <Input 
              name="policyNumber" 
              value={newTask.policyNumber} 
              onChange={handleChange} 
              placeholder="POL-987-654-326"
            />
          </FormControl>
          
          <FormControl mb={4} isRequired>
            <FormLabel>Client Name</FormLabel>
            <Input 
              name="clientName" 
              value={newTask.clientName} 
              onChange={handleChange} 
              placeholder="Full client name"
            />
          </FormControl>
          
          <Grid templateColumns="repeat(2, 1fr)" gap={4} mb={4}>
            <FormControl>
              <FormLabel>Priority</FormLabel>
              <Select name="priority" value={newTask.priority} onChange={handleChange}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </Select>
            </FormControl>
            
            <FormControl>
              <FormLabel>Due Date</FormLabel>
              <Input 
                name="dueDate" 
                type="date" 
                value={newTask.dueDate} 
                onChange={handleChange}
              />
            </FormControl>
          </Grid>
          
          <FormControl mb={4} isRequired>
            <FormLabel>Description</FormLabel>
            <Textarea
              name="description"
              value={newTask.description}
              onChange={handleChange}
              placeholder="Describe the task..."
              rows={3}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            Create Task
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

// Delete Task Confirmation Dialog
const DeleteTaskDialog = ({ isOpen, onClose, taskId, onDelete }) => {
  const cancelRef = useRef();
  
  const handleDelete = () => {
    onDelete(taskId);
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
            Delete Task
          </AlertDialogHeader>

          <AlertDialogBody>
            Are you sure you want to delete this task? This action cannot be undone.
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

// Task detail modal component
const TaskDetailModal = ({ isOpen, onClose, task, onEdit }) => {
  if (!task) return null;
  
  const status = getStatusBadge(task.status);
  const StatusIcon = status.icon;
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Flex align="center">
            <Text>Task Details: {task.quoteId}</Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Grid templateColumns="repeat(2, 1fr)" gap={4} mb={4}>
            <Box>
              <Text fontWeight="bold" mb={1}>Client</Text>
              <Text>{task.clientName}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold" mb={1}>Policy Number</Text>
              <Text>{task.policyNumber}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold" mb={1}>Status</Text>
              <Badge colorScheme={status.colorScheme} variant="subtle" px={2} py={1} borderRadius="full">
                {StatusIcon && <Box as={StatusIcon} display="inline" mr={1} />}
                {status.text}
              </Badge>
            </Box>
            <Box>
              <Text fontWeight="bold" mb={1}>Priority</Text>
              <Badge 
                colorScheme={
                  task.priority === 'critical' ? 'red' : 
                  task.priority === 'high' ? 'orange' : 
                  task.priority === 'medium' ? 'blue' : 'green'
                }
              >
                {task.priority}
              </Badge>
            </Box>
          </Grid>
          
          <Box mb={4}>
            <Text fontWeight="bold" mb={1}>Description</Text>
            <Text>{task.description}</Text>
          </Box>
          
          <Grid templateColumns="repeat(2, 1fr)" gap={4} mb={4}>
            <Box>
              <Text fontWeight="bold" mb={1}>Due Date</Text>
              <Text>{formatDate(task.dueDate)}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold" mb={1}>Created</Text>
              <Text>{formatDate(task.createdAt)}</Text>
            </Box>
          </Grid>
          
          <Divider my={4} />
          
          <Box>
            <Text fontWeight="bold" mb={3}>Task Timeline</Text>
            <Box pl={4} borderLeftWidth="2px" borderLeftColor="gray.200">
              <Box mb={3} position="relative">
                <Box position="absolute" left="-9px" top="0" w="16px" h="16px" borderRadius="full" bg="blue.500" />
                <Text fontSize="sm" color="gray.600">{formatDate(task.createdAt)}</Text>
                <Text>Task created and assigned</Text>
              </Box>
              {task.status === 'in_progress' && (
                <Box mb={3} position="relative">
                  <Box position="absolute" left="-9px" top="0" w="16px" h="16px" borderRadius="full" bg="green.500" />
                  <Text fontSize="sm" color="gray.600">Today</Text>
                  <Text>Task started</Text>
                </Box>
              )}
              {task.status === 'completed' && (
                <>
                  <Box mb={3} position="relative">
                    <Box position="absolute" left="-9px" top="0" w="16px" h="16px" borderRadius="full" bg="green.500" />
                    <Text fontSize="sm" color="gray.600">Yesterday</Text>
                    <Text>Task started</Text>
                  </Box>
                  <Box position="relative">
                    <Box position="absolute" left="-9px" top="0" w="16px" h="16px" borderRadius="full" bg="green.500" />
                    <Text fontSize="sm" color="gray.600">Today</Text>
                    <Text>Task completed</Text>
                  </Box>
                </>
              )}
            </Box>
          </Box>
        </ModalBody>
        <ModalFooter>
          {task.status !== 'in_progress' && task.status !== 'completed' && (
            <Button colorScheme="blue" mr={3} onClick={onClose}>Start Task</Button>
          )}
          {task.status !== 'completed' && (
            <Button colorScheme="green" mr={3} onClick={onClose}>Mark as Complete</Button>
          )}
          <Button onClick={onClose}>Close</Button>
          <Button colorScheme="red" ml={3} onClick={() => onEdit('delete', task.id)}>
            Delete Task
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const DSDashboard = () => {
  const { currentUser } = useAuth();
  const toast = useToast();
  const [tasks, setTasks] = useState(mockTasks);
  
  // Multiple modals management
  const taskDetailDisclosure = useDisclosure();
  const newTaskDisclosure = useDisclosure();
  const deleteTaskDisclosure = useDisclosure();
  
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  
  // Generate a mock download file
  const handleDownloadTasks = () => {
    toast({
      title: 'Preparing download',
      description: 'Your task list is being prepared for download',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
    
    // Simulate file generation delay
    setTimeout(() => {
      toast({
        title: 'Download ready',
        description: 'Task list has been downloaded',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }, 2000);
  };
  
  // Function to create a new task
  const createTask = (newTask) => {
    setTasks([newTask, ...tasks]);
    
    toast({
      title: 'Task created',
      description: `New task ${newTask.quoteId} has been created`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };
  
  // Function to delete a task
  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    
    toast({
      title: 'Task deleted',
      description: 'The task has been permanently removed',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };
  
  // Function to mark task as complete
  const completeTask = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? {...task, status: 'completed'} : task
    ));
    
    toast({
      title: 'Task completed',
      description: 'The task has been marked as completed',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    
    // In a real app, this would also update the backend
  };
  
  // Function to start task
  const startTask = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? {...task, status: 'in_progress'} : task
    ));
    
    toast({
      title: 'Task started',
      description: 'The task has been marked as in progress',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
    
    // In a real app, this would also update the backend
  };
  
  // Function to handle task selection and open modal
  const handleTaskSelect = (task) => {
    setSelectedTask(task);
    taskDetailDisclosure.onOpen();
  };
  
  // Function to handle task edits (update, delete, etc)
  const handleTaskEdit = (action, taskId) => {
    if (action === 'delete') {
      setTaskToDelete(taskId);
      taskDetailDisclosure.onClose();
      deleteTaskDisclosure.onOpen();
    }
  };
  
  // Filter tasks based on search term and filters
  const filteredTasks = tasks.filter(task => {
    // Search term filter
    const matchesSearch = 
      task.quoteId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    
    // Priority filter
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <Box bg="white" minH="100vh">
      {/* Page header */}
      <Box px={4} py={3} borderBottom="1px solid" borderColor="gray.200">
        <Flex justifyContent="space-between" alignItems="center" width="100%">
          <Box>
            <Heading size="lg" mb={2}>Distribution Specialist Dashboard</Heading>
            <Flex alignItems="center">
              <Image
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
                alt="Thomas Anderson"
                boxSize="32px"
                borderRadius="full"
                mr={2}
              />
              <Text fontSize="md" color="gray.600">Welcome, Thomas Anderson</Text>
            </Flex>
          </Box>
          <Button leftIcon={<FiPlus />} colorScheme="blue" onClick={newTaskDisclosure.onOpen}>
            Create New Task
          </Button>
        </Flex>
      </Box>
      
      {/* Stats Grid */}
      <Box p={4}>
        <Grid templateColumns="repeat(4, 1fr)" gap={4}>
          <GridItem>
            <Box p={4} bg="white" borderRadius="md" border="1px solid" borderColor="gray.200">
              <Stat>
                <StatLabel>Tasks Completed</StatLabel>
                <StatNumber>{mockStats.tasksCompleted}</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  23% more than last week
                </StatHelpText>
              </Stat>
            </Box>
          </GridItem>
          <GridItem>
            <Box p={4} bg="white" borderRadius="md" border="1px solid" borderColor="gray.200">
              <Stat>
                <StatLabel>Tasks In Progress</StatLabel>
                <StatNumber>{mockStats.tasksInProgress}</StatNumber>
                <StatHelpText>
                  Currently active tasks
                </StatHelpText>
              </Stat>
            </Box>
          </GridItem>
          <GridItem>
            <Box p={4} bg="white" borderRadius="md" border="1px solid" borderColor="gray.200">
              <Stat>
                <StatLabel>Tasks Pending</StatLabel>
                <StatNumber>{mockStats.tasksPending}</StatNumber>
                <StatHelpText>
                  Awaiting action
                </StatHelpText>
              </Stat>
            </Box>
          </GridItem>
          <GridItem>
            <Box p={4} bg="white" borderRadius="md" border="1px solid" borderColor="gray.200">
              <Stat>
                <StatLabel>SLA Breaches</StatLabel>
                <StatNumber color="red.500">{mockStats.slaBreaches}</StatNumber>
                <StatHelpText color="red.500">
                  Requires immediate attention
                </StatHelpText>
              </Stat>
            </Box>
          </GridItem>
        </Grid>
      </Box>
      
      {/* Tasks Table */}
      <Box px={4} py={2}>
        <Box bg="white" borderRadius="md" border="1px solid" borderColor="gray.200">
          <Flex justify="space-between" align="center" mb={4}>
            <Heading size="md">My Tasks</Heading>
            <HStack>
              <Button 
                leftIcon={<FiDownload />} 
                size="sm" 
                variant="outline"
                onClick={handleDownloadTasks}
              >
                Export
              </Button>
              <Button 
                leftIcon={<FiPlus />} 
                colorScheme="blue" 
                size="sm"
                onClick={newTaskDisclosure.onOpen}
              >
                New Task
              </Button>
            </HStack>
          </Flex>
          
          {/* Search and Filter Bar */}
          <Flex mb={4} gap={4} direction={{ base: 'column', md: 'row' }}>
            <InputGroup size="md" flex="1">
              <InputLeftElement pointerEvents="none">
                <FiSearch color="gray.300" />
              </InputLeftElement>
              <Input 
                placeholder="Search tasks..." 
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
              width={{ base: '100%', md: '200px' }}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="sla_warning">SLA Warning</option>
              <option value="sla_breach">SLA Breach</option>
            </Select>
            
            <Select 
              width={{ base: '100%', md: '200px' }}
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </Select>
          </Flex>
          <Table variant="simple" size="md">
            <Thead>
              <Tr>
                <Th>Quote ID</Th>
                <Th>Client</Th>
                <Th>Description</Th>
                <Th>Due Date</Th>
                <Th>Status</Th>
                <Th>Priority</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredTasks.length === 0 ? (
                <Tr>
                  <Td colSpan={7} textAlign="center" py={4}>
                    <Text color="gray.500">No tasks match your search criteria</Text>
                  </Td>
                </Tr>
              ) : filteredTasks.map((task) => {
                const status = getStatusBadge(task.status);
                const StatusIcon = status.icon;
                
                return (
                  <Tr 
                    key={task.id}
                    _hover={{ bg: 'blue.50', cursor: 'pointer' }}
                    onClick={() => handleTaskSelect(task)}
                  >
                    <Td>{task.quoteId}</Td>
                    <Td>{task.clientName}</Td>
                    <Td>{task.description}</Td>
                    <Td>{formatDate(task.dueDate)}</Td>
                    <Td>
                      <Badge colorScheme={status.colorScheme} variant="subtle" px={2} py={1} borderRadius="full">
                        {StatusIcon && <Box as={StatusIcon} display="inline" mr={1} />}
                        {status.text}
                      </Badge>
                    </Td>
                    <Td>
                      <Badge 
                        colorScheme={
                          task.priority === 'critical' ? 'red' : 
                          task.priority === 'high' ? 'orange' : 
                          task.priority === 'medium' ? 'blue' : 'green'
                        }
                      >
                        {task.priority}
                      </Badge>
                    </Td>
                    <Td onClick={(e) => e.stopPropagation()}>
                      <Menu>
                        <MenuButton
                          as={IconButton}
                          icon={<FiMoreVertical />}
                          variant="ghost"
                          size="sm"
                          aria-label="Task actions"
                        />
                        <MenuList>
                          {task.status !== 'in_progress' && task.status !== 'completed' && (
                            <MenuItem onClick={() => startTask(task.id)}>Start Task</MenuItem>
                          )}
                          {task.status !== 'completed' && (
                            <MenuItem onClick={() => completeTask(task.id)}>Mark as Complete</MenuItem>
                          )}
                          <MenuItem onClick={() => handleTaskSelect(task)}>View Details</MenuItem>
                          <MenuItem>Reassign</MenuItem>
                        </MenuList>
                      </Menu>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </Box>
      </Box>
      
      {/* SLA Alert Section */}
      <Box px={4} py={2}>
        {tasks.some(task => task.status === 'sla_warning' || task.status === 'sla_breach') && (
          <Box bg="red.50" p={3} borderRadius="md" borderLeft="4px solid" borderLeftColor="red.500" mb={4}>
            <Flex align="center">
              <Box as={FiAlertCircle} color="red.500" boxSize={5} mr={2} />
              <Box>
                <Text fontWeight="bold">SLA Attention Required</Text>
                <Text fontSize="sm">
                  You have {tasks.filter(task => task.status === 'sla_breach').length} breached task(s) and {tasks.filter(task => task.status === 'sla_warning').length} at risk. Please prioritize these tasks.
                </Text>
              </Box>
            </Flex>
          </Box>
        )}
      </Box>
      
      {/* Recent Activity / Audit Log Section */}
      <Box px={4} py={2} mb={4}>
        <Box bg="white" borderRadius="md" border="1px solid" borderColor="gray.200">
          <Flex justify="space-between" align="center" p={3} borderBottomWidth="1px">
            <Heading size="md">Recent Activity</Heading>
          </Flex>
          <Box p={3}>
            <Box p={3} borderBottom="1px solid" borderColor="gray.100" mb={1}>
              <Text fontSize="sm" color="gray.600">Today, 09:45 AM</Text>
              <Text>You marked task <b>Q12347</b> as completed</Text>
            </Box>
            <Box p={3} borderBottom="1px solid" borderColor="gray.100" mb={1}>
              <Text fontSize="sm" color="gray.600">Today, 08:30 AM</Text>
              <Text>You started working on <b>Q12346</b></Text>
            </Box>
            <Box p={3}>
              <Text fontSize="sm" color="gray.600">Yesterday, 04:15 PM</Text>
              <Text>New task <b>Q12345</b> assigned to you</Text>
            </Box>
          </Box>
        </Box>
      </Box>
      
      {/* Task Detail Modal */}
      <TaskDetailModal
        isOpen={taskDetailDisclosure.isOpen}
        onClose={taskDetailDisclosure.onClose}
        task={selectedTask}
        onEdit={handleTaskEdit}
      />
      
      {/* New Task Modal */}
      <NewTaskModal
        isOpen={newTaskDisclosure.isOpen}
        onClose={newTaskDisclosure.onClose}
        onTaskCreate={createTask}
      />
      
      {/* Delete Task Confirmation */}
      <DeleteTaskDialog
        isOpen={deleteTaskDisclosure.isOpen}
        onClose={deleteTaskDisclosure.onClose}
        taskId={taskToDelete}
        onDelete={deleteTask}
      />
    </Box>
  );
};

export default DSDashboard;
