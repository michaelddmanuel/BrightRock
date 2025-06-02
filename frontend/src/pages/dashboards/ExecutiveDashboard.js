import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  VStack,
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
  Image,
  Progress,
  Select,
  Divider,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  IconButton,
  SimpleGrid,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useToast,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  FormControl,
  FormLabel,
  Switch,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Tooltip,
  CloseIcon,
} from '@chakra-ui/react';
import { 
  FiCalendar, 
  FiTrendingUp, 
  FiTrendingDown, 
  FiUsers, 
  FiBarChart2, 
  FiDollarSign, 
  FiActivity,
  FiChevronDown,
  FiDownload,
  FiFilter,
  FiRefreshCw,
  FiSearch,
  FiPrinter,
  FiMail,
  FiFileText,
  FiShare2,
  FiSettings,
  FiSliders,
  FiEye,
  FiEdit,
  FiMoreVertical,
  FiExternalLink,
  FiPlus,
  FiMaximize,
  FiAlertCircle
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

// Mock data for Executive dashboard
const mockRegions = [
  {
    id: 1,
    name: 'North Region',
    conversionRate: 82.4,
    totalQuotes: 412,
    totalPolicies: 340,
    slaBreaches: 1,
    avgDailyCases: 9.1,
    performance: 92,
    teams: [
      {
        id: 1,
        name: 'Team Alpha',
        manager: 'Michael Johnson',
        conversionRate: 83.5,
        totalQuotes: 215,
        totalPolicies: 180,
        slaBreaches: 1,
        avgDailyCases: 9.2
      },
      {
        id: 2,
        name: 'Team Beta',
        manager: 'Amanda Wilson',
        conversionRate: 78.9,
        totalQuotes: 213,
        totalPolicies: 168,
        slaBreaches: 2,
        avgDailyCases: 8.1
      }
    ]
  },
  {
    id: 2,
    name: 'South Region',
    conversionRate: 76.8,
    totalQuotes: 382,
    totalPolicies: 294,
    slaBreaches: 5,
    avgDailyCases: 8.5,
    performance: 85,
    teams: [
      {
        id: 3,
        name: 'Team Gamma',
        manager: 'Robert Brown',
        conversionRate: 79.2,
        totalQuotes: 197,
        totalPolicies: 156,
        slaBreaches: 2,
        avgDailyCases: 8.3
      },
      {
        id: 4,
        name: 'Team Delta',
        manager: 'Jennifer Davis',
        conversionRate: 74.1,
        totalQuotes: 185,
        totalPolicies: 138,
        slaBreaches: 3,
        avgDailyCases: 7.5
      }
    ]
  },
  {
    id: 3,
    name: 'East Region',
    conversionRate: 85.3,
    totalQuotes: 401,
    totalPolicies: 342,
    slaBreaches: 1,
    avgDailyCases: 9.3,
    performance: 95,
    teams: [
      {
        id: 5,
        name: 'Team Epsilon',
        manager: 'Daniel Miller',
        conversionRate: 87.1,
        totalQuotes: 209,
        totalPolicies: 182,
        slaBreaches: 0,
        avgDailyCases: 9.8
      },
      {
        id: 6,
        name: 'Team Zeta',
        manager: 'Elizabeth Taylor',
        conversionRate: 83.3,
        totalQuotes: 192,
        totalPolicies: 160,
        slaBreaches: 1,
        avgDailyCases: 8.9
      }
    ]
  },
  {
    id: 4,
    name: 'West Region',
    conversionRate: 79.5,
    totalQuotes: 395,
    totalPolicies: 314,
    slaBreaches: 4,
    avgDailyCases: 8.1,
    performance: 88,
    teams: [
      {
        id: 7,
        name: 'Team Eta',
        manager: 'Christopher Anderson',
        conversionRate: 81.2,
        totalQuotes: 202,
        totalPolicies: 164,
        slaBreaches: 1,
        avgDailyCases: 8.4
      },
      {
        id: 8,
        name: 'Team Theta',
        manager: 'Melissa Thomas',
        conversionRate: 77.7,
        totalQuotes: 193,
        totalPolicies: 150,
        slaBreaches: 3,
        avgDailyCases: 7.8
      }
    ]
  }
];

// Organization-wide metrics
const mockOrgStats = {
  totalQuotes: 1606,
  totalPolicies: 1298,
  avgConversionRate: 80.8,
  totalSlaBreaches: 13,
  targetConversionRate: 78,
  targetDailyCases: 8.0
};

// Historical trend data (for charts)
const mockTrendData = {
  conversionRates: [78.2, 79.1, 79.8, 80.3, 80.8, 81.0],
  slaBreaches: [22, 19, 16, 15, 13, 11],
  dailyCases: [7.1, 7.4, 7.8, 8.1, 8.5, 8.6],
  // Months for x-axis (shortened for display)
  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
};

// Simple line chart component
const SimpleLineChart = ({ data, color, height = 100, label = '' }) => {
  // Find the min and max values to scale the chart properly
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min;
  
  return (
    <Box height={`${height}px`} position="relative" mt={4}>
      <Flex height="100%" alignItems="flex-end" position="relative">
        {data.map((value, index) => {
          // Calculate height percentage
          const heightPercentage = range === 0 ? 50 : ((value - min) / range) * 100;
          
          // Calculate the y position for the line
          const y = 100 - heightPercentage;
          
          return (
            <Box 
              key={index} 
              position="relative" 
              height={`${heightPercentage}%`}
              width="100%"
              bg={color}
              mx={1}
              borderRadius="sm"
              _hover={{ opacity: 0.8 }}
            >
              <Tooltip label={`${mockTrendData.months[index]}: ${value}${label}`}>
                <Box 
                  position="absolute" 
                  top={0} 
                  left={0} 
                  right={0} 
                  bottom={0} 
                  cursor="pointer"
                />
              </Tooltip>
            </Box>
          );
        })}
      </Flex>
      
      {/* X-axis labels */}
      <Flex justifyContent="space-between" mt={1}>
        {mockTrendData.months.map((month, index) => (
          <Text key={index} fontSize="xs" color="gray.500">
            {month}
          </Text>
        ))}
      </Flex>
    </Box>
  );
};

// Team/Region detail modal
const DetailViewModal = ({ isOpen, onClose, data, type }) => {
  if (!data) return null;
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{type === 'region' ? 'Region Details' : 'Team Details'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Heading size="md" mb={4}>{data.name}</Heading>
          
          <Tabs variant="enclosed" colorScheme="blue">
            <TabList>
              <Tab>Performance</Tab>
              <Tab>SLA Compliance</Tab>
              {type === 'region' && <Tab>Teams</Tab>}
            </TabList>
            
            <TabPanels>
              <TabPanel>
                <Grid templateColumns="repeat(2, 1fr)" gap={4} mb={6}>
                  <Stat bg="blue.50" p={3} borderRadius="md">
                    <StatLabel>Conversion Rate</StatLabel>
                    <StatNumber>{data.conversionRate}%</StatNumber>
                    <StatHelpText>
                      <StatArrow type={data.conversionRate > mockOrgStats.targetConversionRate ? 'increase' : 'decrease'} />
                      {Math.abs(data.conversionRate - mockOrgStats.targetConversionRate).toFixed(1)}% {data.conversionRate > mockOrgStats.targetConversionRate ? 'above' : 'below'} target
                    </StatHelpText>
                  </Stat>
                  
                  <Stat bg="green.50" p={3} borderRadius="md">
                    <StatLabel>Average Daily Cases</StatLabel>
                    <StatNumber>{data.avgDailyCases}</StatNumber>
                    <StatHelpText>
                      <StatArrow type={data.avgDailyCases > mockOrgStats.targetDailyCases ? 'increase' : 'decrease'} />
                      {Math.abs(data.avgDailyCases - mockOrgStats.targetDailyCases).toFixed(1)} {data.avgDailyCases > mockOrgStats.targetDailyCases ? 'above' : 'below'} target
                    </StatHelpText>
                  </Stat>
                </Grid>
                
                <Box bg="gray.50" p={3} borderRadius="md" mb={4}>
                  <Flex justify="space-between" mb={2}>
                    <Text>Total Quotes</Text>
                    <Text fontWeight="bold">{data.totalQuotes}</Text>
                  </Flex>
                  <Flex justify="space-between">
                    <Text>Total Policies</Text>
                    <Text fontWeight="bold">{data.totalPolicies}</Text>
                  </Flex>
                </Box>
                
                <Text fontSize="sm" color="gray.500">Performance trend over the last 6 months would appear here as a chart</Text>
              </TabPanel>
              
              <TabPanel>
                <Stat mb={6} bg={data.slaBreaches > 0 ? "red.50" : "green.50"} p={4} borderRadius="md">
                  <StatLabel>SLA Breaches</StatLabel>
                  <StatNumber>{data.slaBreaches}</StatNumber>
                  <StatHelpText color={data.slaBreaches > 0 ? "red.500" : "green.500"}>
                    {data.slaBreaches > 0 ? "Requires attention" : "Good standing"}
                  </StatHelpText>
                </Stat>
                
                <Text fontSize="sm" color="gray.500">SLA compliance history would appear here as a chart</Text>
              </TabPanel>
              
              {type === 'region' && (
                <TabPanel>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Team Name</Th>
                        <Th>Manager</Th>
                        <Th>Conversion</Th>
                        <Th>SLA Breaches</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data.teams.map(team => (
                        <Tr key={team.id}>
                          <Td>{team.name}</Td>
                          <Td>{team.manager}</Td>
                          <Td>{team.conversionRate}%</Td>
                          <Td>
                            <Badge colorScheme={team.slaBreaches > 0 ? 'red' : 'green'}>
                              {team.slaBreaches}
                            </Badge>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TabPanel>
              )}
            </TabPanels>
          </Tabs>
        </ModalBody>
        
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button leftIcon={<FiDownload />} variant="ghost">Export Data</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

// Report Settings Modal
const ReportSettingsModal = ({ isOpen, onClose, onSave }) => {
  const [settings, setSettings] = useState({
    showTrends: true,
    includeInactiveMembers: false,
    dailyUpdates: true,
    alertsThreshold: 85,
    reportFormat: 'detailed'
  });
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSave = () => {
    onSave(settings);
    onClose();
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Report Settings</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl display="flex" alignItems="center" mb={4}>
            <FormLabel htmlFor="showTrends" mb="0" flex="1">
              Show Performance Trends
            </FormLabel>
            <Switch
              id="showTrends"
              name="showTrends"
              isChecked={settings.showTrends}
              onChange={handleChange}
              colorScheme="blue"
            />
          </FormControl>
          
          <FormControl display="flex" alignItems="center" mb={4}>
            <FormLabel htmlFor="includeInactiveMembers" mb="0" flex="1">
              Include Inactive Members
            </FormLabel>
            <Switch
              id="includeInactiveMembers"
              name="includeInactiveMembers"
              isChecked={settings.includeInactiveMembers}
              onChange={handleChange}
              colorScheme="blue"
            />
          </FormControl>
          
          <FormControl display="flex" alignItems="center" mb={4}>
            <FormLabel htmlFor="dailyUpdates" mb="0" flex="1">
              Receive Daily Updates
            </FormLabel>
            <Switch
              id="dailyUpdates"
              name="dailyUpdates"
              isChecked={settings.dailyUpdates}
              onChange={handleChange}
              colorScheme="blue"
            />
          </FormControl>
          
          <FormControl mb={4}>
            <FormLabel htmlFor="alertsThreshold">Alerts Threshold (%)</FormLabel>
            <Input
              id="alertsThreshold"
              name="alertsThreshold"
              type="number"
              min="0"
              max="100"
              value={settings.alertsThreshold}
              onChange={handleChange}
            />
          </FormControl>
          
          <FormControl mb={4}>
            <FormLabel htmlFor="reportFormat">Default Report Format</FormLabel>
            <Select
              id="reportFormat"
              name="reportFormat"
              value={settings.reportFormat}
              onChange={handleChange}
            >
              <option value="summary">Summary</option>
              <option value="detailed">Detailed</option>
              <option value="visual">Visual Dashboard</option>
            </Select>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSave}>
            Save Settings
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

// Sharing Dialog
const ShareReportDialog = ({ isOpen, onClose }) => {
  const cancelRef = useRef();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [includeNotes, setIncludeNotes] = useState(true);
  
  const handleShare = () => {
    if (!email) {
      toast({
        title: 'Email required',
        description: 'Please enter an email address',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    toast({
      title: 'Report shared',
      description: `Report has been shared with ${email}`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    
    setEmail('');
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
            Share Performance Report
          </AlertDialogHeader>

          <AlertDialogBody>
            <FormControl mb={4}>
              <FormLabel>Recipient Email</FormLabel>
              <Input 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="email@brightrock.com"
              />
            </FormControl>
            
            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="include-notes" mb="0">
                Include Analysis Notes
              </FormLabel>
              <Switch 
                id="include-notes" 
                isChecked={includeNotes} 
                onChange={(e) => setIncludeNotes(e.target.checked)}
                colorScheme="blue"
              />
            </FormControl>
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleShare} ml={3}>
              Share Report
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

const ExecutiveDashboard = () => {
  const { currentUser } = useAuth();
  const toast = useToast();
  const [timeframe, setTimeframe] = useState('this-month');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterPerformance, setFilterPerformance] = useState('all');
  
  // Disclosures for modals and dialogs
  const settingsDisclosure = useDisclosure();
  const shareDisclosure = useDisclosure();
  
  // Mock data state with additional properties
  const [departmentData, setDepartmentData] = useState(mockRegions);
  const [trendsData, setTrendsData] = useState(mockTrendData);
  
  // Function to refresh dashboard data
  const refreshData = () => {
    setIsLoading(true);
    toast({
      title: 'Refreshing data',
      description: 'Fetching latest performance metrics',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
    
    // Simulate refresh delay
    setTimeout(() => {
      // Randomly adjust some metrics to simulate dynamic data
      const updatedDepartments = departmentData.map(dept => ({
        ...dept,
        performance: Math.min(100, Math.max(50, dept.performance + (Math.random() * 6 - 3))),
        slaCompliance: Math.min(100, Math.max(60, dept.slaCompliance + (Math.random() * 8 - 4))),
        costEfficiency: Math.min(100, Math.max(70, dept.costEfficiency + (Math.random() * 4 - 2))),
      }));
      
      setDepartmentData(updatedDepartments);
      setIsLoading(false);
      
      toast({
        title: 'Data updated',
        description: 'Dashboard now shows the latest metrics',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }, 2000);
  };
  
  // Function to handle report download
  const handleDownload = (reportType) => {
    toast({
      title: 'Preparing download',
      description: `Generating ${reportType} report`,
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
    
    // Simulate download delay
    setTimeout(() => {
      toast({
        title: 'Download ready',
        description: `${reportType} report has been downloaded`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }, 2000);
  };
  
  // Function to save report settings
  const saveSettings = (settings) => {
    toast({
      title: 'Settings saved',
      description: 'Your report preferences have been updated',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };
  
  // Filter departments based on search and filters
  const filteredDepartments = departmentData.filter(dept => {
    const matchesSearch = dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          dept.manager.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = filterDepartment === 'all' || dept.id === filterDepartment;
    
    const matchesPerformance = 
      (filterPerformance === 'all') ||
      (filterPerformance === 'high' && dept.performance > 85) ||
      (filterPerformance === 'medium' && dept.performance >= 70 && dept.performance <= 85) ||
      (filterPerformance === 'low' && dept.performance < 70);
    
    return matchesSearch && matchesDepartment && matchesPerformance;
  });
  
  // Simulating updating data for the first render
  useEffect(() => {
    refreshData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Use disclosure for the detail modal
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedItem, setSelectedItem] = useState(null);
  const [viewType, setViewType] = useState(null); // 'region' or 'team'
  
  // Function to get timeframe label
  const getTimeframeLabel = (timeframe) => {
    const labels = {
      'today': 'Today',
      'this-week': 'This Week',
      'this-month': 'This Month',
      'this-quarter': 'This Quarter',
      'this-year': 'This Year',
      'custom': 'Custom Range'
    };
    return labels[timeframe] || 'This Month';
  };
  
  // Function to handle region/team selection
  const handleItemSelect = (item, type) => {
    setSelectedItem(item);
    setViewType(type);
    onOpen();
  };
  
  return (
    <Box bg="white" minH="100vh" w="100%">
      {/* Dashboard Header */}
      <Box as="header" bg="white" boxShadow="sm" mb={6} py={4} px={8}>
        <Flex justifyContent="space-between" alignItems="center" width="100%">
          <Box>
            <Heading size="lg" mb={2}>Executive Dashboard</Heading>
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
          <HStack spacing={3}>
              <Menu>
                <MenuButton as={Button} rightIcon={<FiChevronDown />} size="sm">
                  {getTimeframeLabel(timeframe)}
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => setTimeframe('today')}>Today</MenuItem>
                  <MenuItem onClick={() => setTimeframe('this-week')}>This Week</MenuItem>
                  <MenuItem onClick={() => setTimeframe('this-month')}>This Month</MenuItem>
                  <MenuItem onClick={() => setTimeframe('this-quarter')}>This Quarter</MenuItem>
                  <MenuItem onClick={() => setTimeframe('this-year')}>This Year</MenuItem>
                  <MenuDivider />
                  <MenuItem onClick={() => setTimeframe('custom')}>Custom Range...</MenuItem>
                </MenuList>
              </Menu>
              
              <Popover placement="bottom-end">
                <PopoverTrigger>
                  <Button leftIcon={<FiDownload />} size="sm" variant="outline">
                    Export
                  </Button>
                </PopoverTrigger>
                <PopoverContent width="200px">
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverHeader fontWeight="bold">Export Options</PopoverHeader>
                  <PopoverBody>
                    <VStack align="stretch" spacing={2}>
                      <Button size="sm" justifyContent="flex-start" variant="ghost" leftIcon={<FiFileText />} onClick={() => handleDownload('PDF Report')}>
                        PDF Report
                      </Button>
                      <Button size="sm" justifyContent="flex-start" variant="ghost" leftIcon={<FiFileText />} onClick={() => handleDownload('Excel Dashboard')}>
                        Excel Dashboard
                      </Button>
                      <Button size="sm" justifyContent="flex-start" variant="ghost" leftIcon={<FiPrinter />} onClick={() => handleDownload('Print Version')}>
                        Print Version
                      </Button>
                    </VStack>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
              
              <IconButton
                icon={<FiShare2 />}
                size="sm"
                variant="ghost"
                aria-label="Share dashboard"
                onClick={shareDisclosure.onOpen}
              />
              
              <IconButton
                icon={<FiSettings />}
                size="sm"
                variant="ghost"
                aria-label="Dashboard settings"
                onClick={settingsDisclosure.onOpen}
              />
              
              <Tooltip label="Refresh data">
                <IconButton
                  icon={<FiRefreshCw />}
                  size="sm"
                  variant="ghost"
                  aria-label="Refresh data"
                  isLoading={isLoading}
                  onClick={refreshData}
                />
              </Tooltip>
            </HStack>
          </Flex>
      </Box>
      <Box px={6} py={4}>
        <Grid templateColumns="repeat(4, 1fr)" gap={6} mb={6}>
          <GridItem>
            <Stat bg="white" p={6} borderRadius="lg" boxShadow="md">
              <StatLabel>Average Conversion Rate</StatLabel>
              <StatNumber>{mockOrgStats.avgConversionRate}%</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                {(mockOrgStats.avgConversionRate - mockOrgStats.targetConversionRate).toFixed(1)}% above target
              </StatHelpText>
            </Stat>
          </GridItem>
          <GridItem>
            <Stat bg="white" p={6} borderRadius="lg" boxShadow="md">
              <StatLabel>Total Quotes</StatLabel>
              <StatNumber>{mockOrgStats.totalQuotes}</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                12% from previous {timeframe}
              </StatHelpText>
            </Stat>
          </GridItem>
          <GridItem>
            <Stat bg="white" p={6} borderRadius="lg" boxShadow="md">
              <StatLabel>Total Policies</StatLabel>
              <StatNumber>{mockOrgStats.totalPolicies}</StatNumber>
              <StatHelpText>
                <Box as={FiTrendingUp} display="inline-block" mr={1} color="green.500" />
                15% increase
              </StatHelpText>
            </Stat>
          </GridItem>
          <GridItem>
            <Stat bg="white" p={6} borderRadius="lg" boxShadow="md">
              <StatLabel>SLA Breaches</StatLabel>
              <StatNumber>{mockOrgStats.totalSlaBreaches}</StatNumber>
              <StatHelpText color={mockOrgStats.totalSlaBreaches > 0 ? "orange.500" : "green.500"}>
                <Box as={FiTrendingDown} display="inline-block" mr={1} />
                8% decrease from last {timeframe}
              </StatHelpText>
            </Stat>
          </GridItem>
        </Grid>
        
        {/* Trend charts section */}
        <Box bg="white" borderRadius="lg" boxShadow="md" p={6} mb={6}>
          <Flex justify="space-between" align="center" mb={4}>
            <Heading size="md">Performance Trends</Heading>
            <HStack>
              <IconButton icon={<FiFilter />} variant="ghost" aria-label="Filter trends" />
              <IconButton icon={<FiMaximize />} variant="ghost" aria-label="Expand view" />
            </HStack>
          </Flex>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mb={6}>
            <Box bg="gray.50" p={4} borderRadius="md" h="200px" position="relative">
              <Heading size="sm" mb={4}>Conversion Rate Trend</Heading>
              <SimpleLineChart 
                data={mockTrendData.conversionRates} 
                color="green.400"
                label="%"
              />
              <Text position="absolute" bottom={4} right={4} fontWeight="bold">
                {mockTrendData.conversionRates[mockTrendData.conversionRates.length - 1]}%
              </Text>
            </Box>
            <Box bg="gray.50" p={4} borderRadius="md" h="200px" position="relative">
              <Heading size="sm" mb={4}>SLA Compliance Trend</Heading>
              <SimpleLineChart 
                data={mockTrendData.slaBreaches} 
                color="red.400"
                label=" breaches"
              />
              <Text position="absolute" bottom={4} right={4} fontWeight="bold">
                {mockTrendData.slaBreaches[mockTrendData.slaBreaches.length - 1]} breaches
              </Text>
            </Box>
            <Box bg="gray.50" p={4} borderRadius="md" h="200px" position="relative">
              <Heading size="sm" mb={4}>Daily Cases Trend</Heading>
              <SimpleLineChart 
                data={mockTrendData.dailyCases} 
                color="blue.400"
                label=" avg"
              />
              <Text position="absolute" bottom={4} right={4} fontWeight="bold">
                {mockTrendData.dailyCases[mockTrendData.dailyCases.length - 1]} avg
              </Text>
            </Box>
          </SimpleGrid>
        </Box>
        
        {/* Regional performance */}
        <Box bg="white" borderRadius="lg" boxShadow="sm" overflow="hidden" mb={6}>
          <Flex justify="space-between" align="center" p={4} borderBottomWidth="1px">
            <Heading size="md">Regional Performance</Heading>
            <HStack>
              <IconButton 
                aria-label="Filter regions" 
                icon={<FiFilter />} 
                variant="ghost" 
                size="sm"
              />
            </HStack>
          </Flex>
          
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Region</Th>
                  <Th>Conversion Rate</Th>
                  <Th>Quotes</Th>
                  <Th>Policies</Th>
                  <Th>Daily Cases</Th>
                  <Th>SLA Breaches</Th>
                  <Th>Performance</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredDepartments.map((region) => (
                  <Tr 
                    key={region.id}
                    _hover={{ bg: 'gray.50', cursor: 'pointer' }}
                    onClick={() => handleItemSelect(region, 'region')}
                  >
                    <Td fontWeight="medium">{region.name}</Td>
                    <Td>
                      <HStack>
                        <Text>{region.conversionRate}%</Text>
                        {region.conversionRate > mockOrgStats.targetConversionRate ? (
                          <Box as={FiTrendingUp} color="green.500" />
                        ) : (
                          <Box as={FiTrendingDown} color="red.500" />
                        )}
                      </HStack>
                    </Td>
                    <Td>{region.totalQuotes}</Td>
                    <Td>{region.totalPolicies}</Td>
                    <Td>{region.avgDailyCases}</Td>
                    <Td>
                      <Badge colorScheme={region.slaBreaches > 0 ? "red" : "green"}>
                        {region.slaBreaches}
                      </Badge>
                    </Td>
                    <Td>
                      <Box w="100px">
                        <Progress 
                          value={region.performance} 
                          size="sm" 
                          colorScheme={region.performance >= 90 ? "green" : 
                            region.performance >= 75 ? "blue" : 
                            region.performance >= 60 ? "yellow" : "red"
                          }
                          borderRadius="full"
                        />
                        <Text fontSize="xs" mt={1}>{region.performance}%</Text>
                      </Box>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Box>
        
        {/* SLA Alert Section */}
        {mockOrgStats.totalSlaBreaches > 0 && (
          <Box bg="red.50" p={3} borderRadius="md" borderLeft="4px solid" borderLeftColor="red.500" mb={6}>
            <Flex align="center">
              <Box as={FiAlertCircle} color="red.500" boxSize={5} mr={2} />
              <Box>
                <Heading size="sm" color="red.600">SLA Compliance Alert</Heading>
                <Text color="red.700" fontSize="sm">
                  There are currently {mockOrgStats.totalSlaBreaches} SLA breaches across the organization. Review regional performance for more details.
                </Text>
              </Box>
            </Flex>
          </Box>
        )}
        
        {/* Item detail modal */}
      </Box>
      <DetailViewModal
        isOpen={isOpen}
        onClose={onClose}
        data={selectedItem}
        type={viewType}
      />
      <ReportSettingsModal
        isOpen={settingsDisclosure.isOpen}
        onClose={settingsDisclosure.onClose}
        onSave={saveSettings}
      />
      <ShareReportDialog
        isOpen={shareDisclosure.isOpen}
        onClose={shareDisclosure.onClose}
      />
    </Box>
  );
};

export default ExecutiveDashboard;
