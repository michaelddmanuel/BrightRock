import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom'; // Keep RouterLink if used
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
  Button, // Keep Button for specific cases if needed
  Link,
  Stack, // Keep Stack
  HStack, // Keep HStack
  Progress,
  TableContainer, // Use TableContainer
  useColorModeValue,
  Select, // Keep Select
  VStack, // Keep VStack
  useToast, // Keep useToast
  Alert, // Keep Alert
  AlertIcon, // Keep AlertIcon
} from '@chakra-ui/react';
import {
  FiUsers,
  FiCalendar,
  FiCheckCircle,
  FiAlertTriangle,
  FiClock,
  FiBarChart2,
  FiArrowRight,
  FiDownload,
  FiFileText, // Keep FiFileText
} from 'react-icons/fi';
import api from '../../services/api';
// Use common components
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import ActionButton from '../../components/common/ActionButton';
// Removed DataCard, StatsCard, PrimaryButton, SecondaryButton, UntitledPageHeader imports

const ReportsAnalyticsPage = () => {
  const [isLoading, setIsLoading] = useState(true); // Keep loading state
  const [isDownloading, setIsDownloading] = useState(false);
  const [reportType, setReportType] = useState('attendance');
  const [dateRange, setDateRange] = useState('month');
  const [error, setError] = useState('');
  const [dashboardData, setDashboardData] = useState(null);
  const toast = useToast();

  // Theme colors
  const headingColor = useColorModeValue('sasol.primary', 'white');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const tableHeadBg = useColorModeValue('gray.50', 'gray.700');
  const tableRowHoverBg = useColorModeValue('gray.50', 'gray.700');
  const iconColor = useColorModeValue('sasol.primary', 'brand.200');
  const statNumberColor = useColorModeValue('sasol.primary', 'white');
  const statHelpTextColor = useColorModeValue('gray.500', 'gray.400');
  const errorBg = useColorModeValue('red.50', 'red.900');
  const errorColor = useColorModeValue('red.500', 'red.200');
  const inputFocusBorderColor = useColorModeValue('sasol.primary', 'brand.300');
  const inputBorderColor = useColorModeValue('gray.300', 'gray.600');

  // Fetch dashboard data (keeping existing logic)
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        setTimeout(() => {
          const mockData = {
            attendanceStats: { totalAttendance: 1248, lastMonthAttendance: 156, changePercent: 12.5, attendanceRate: 87.3, trainingHours: 4762, completionRate: 92.8 },
            complianceStats: { mandatoryCompletionRate: 94.6, overdueTrainings: 17, upcomingMandatory: 43, complianceTrend: [86, 88, 90, 92, 93, 94.6] },
            departmentBreakdown: [ { name: 'Operations', attendanceRate: 91.2, completionRate: 96.4 }, { name: 'Maintenance', attendanceRate: 88.5, completionRate: 92.1 }, { name: 'Safety', attendanceRate: 95.8, completionRate: 98.7 }, { name: 'HR', attendanceRate: 89.3, completionRate: 91.8 }, { name: 'Admin', attendanceRate: 82.6, completionRate: 89.5 }, ],
            recentTrainings: [ { id: 101, title: 'Safety Procedures', attendees: 28, date: '2025-02-22', completionRate: 96.4 }, { id: 102, title: 'Emergency Response', attendees: 35, date: '2025-02-18', completionRate: 91.4 }, { id: 103, title: 'Hazardous Materials', attendees: 19, date: '2025-02-15', completionRate: 94.7 }, { id: 104, title: 'Environmental Compliance', attendees: 42, date: '2025-02-10', completionRate: 88.1 }, ],
            upcomingTrainings: [ { id: 201, title: 'Workplace Safety', date: '2025-03-05', status: 'scheduled' }, { id: 202, title: 'Fire Safety', date: '2025-03-10', status: 'scheduled' }, { id: 203, title: 'First Aid Training', date: '2025-03-15', status: 'scheduled' }, { id: 204, title: 'Environmental Awareness', date: '2025-03-20', status: 'scheduled' }, ],
            pendingDeclarations: [ { id: 301, title: 'Safety Protocol Adherence', deadline: '2025-03-01', status: 'pending' }, { id: 302, title: 'Compliance Statement', deadline: '2025-03-05', status: 'pending' }, { id: 303, title: 'Quarterly Safety Review', deadline: '2025-03-10', status: 'pending' }, ]
          };
          setDashboardData(mockData);
          setIsLoading(false);
        }, 1000);
      } catch (err) { setError('Failed to load analytics data.'); setIsLoading(false); }
    };
    fetchDashboardData();
  }, []);

  // Handle report download (keeping existing logic)
  const handleDownloadReport = (reportType) => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      toast({ title: 'Report Downloaded', description: `Your ${reportType} report downloaded.`, status: 'success', duration: 5000, isClosable: true });
    }, 2000);
  };

  // Badge helpers
  const getRateBadgeColorScheme = (rate) => rate > 95 ? "green" : rate > 90 ? "yellow" : "red";
  const getStatusBadgeColorScheme = (status) => status === 'scheduled' ? 'blue' : 'gray'; // Simplified

  return (
    <Box>
      <PageHeader
        title="Reports & Analytics"
        subtitle="Track attendance metrics, compliance rates, and generate comprehensive reports"
        actions={
          <ActionButton
            label="Export Summary"
            icon={<Icon as={FiDownload} />}
            onClick={() => handleDownloadReport('analytics-summary')}
            isLoading={isDownloading}
            variant="outline"
          />
        }
      />

      {error && (
        <Alert status="error" mb={6} borderRadius="md">
          <AlertIcon /> {error}
        </Alert>
      )}

      {/* Stats Overview */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mb={8}>
        <Skeleton isLoaded={!isLoading} borderRadius="lg">
          <Card>
            <Stat>
              <StatLabel color={textColor}>Total Attendance (YTD)</StatLabel>
              <StatNumber color={statNumberColor}>{dashboardData?.attendanceStats.totalAttendance || '...'}</StatNumber>
              {/* Optional: Add StatHelpText or StatArrow if changePercent exists */}
            </Stat>
          </Card>
        </Skeleton>
        <Skeleton isLoaded={!isLoading} borderRadius="lg">
          <Card>
            <Stat>
              <StatLabel color={textColor}>Overall Attendance Rate</StatLabel>
              <StatNumber color={statNumberColor}>{dashboardData?.attendanceStats.attendanceRate || '...'}%</StatNumber>
            </Stat>
          </Card>
        </Skeleton>
        <Skeleton isLoaded={!isLoading} borderRadius="lg">
          <Card>
            <Stat>
              <StatLabel color={textColor}>Mandatory Compliance</StatLabel>
              <StatNumber color={statNumberColor}>{dashboardData?.complianceStats.mandatoryCompletionRate || '...'}%</StatNumber>
            </Stat>
          </Card>
        </Skeleton>
      </SimpleGrid>

      {/* Department Breakdown & Recent Trainings */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={8}>
        <Card>
          <Heading size="md" mb={4} color={headingColor}>Department Breakdown</Heading>
          <TableContainer>
            <Table variant="simple" size="sm">
              <Thead bg={tableHeadBg}>
                <Tr>
                  <Th>Department</Th>
                  <Th>Attendance Rate</Th>
                  <Th>Completion Rate</Th>
                </Tr>
              </Thead>
              <Tbody>
                {isLoading ? (
                  Array(3).fill(0).map((_, i) => (<Tr key={i}><Td colSpan={3}><Skeleton height="20px" /></Td></Tr>))
                ) : (
                  dashboardData?.departmentBreakdown.map((dept, index) => (
                    <Tr key={index} _hover={{ bg: tableRowHoverBg }}>
                      <Td><Text fontWeight="medium">{dept.name}</Text></Td>
                      <Td><Badge colorScheme={getRateBadgeColorScheme(dept.attendanceRate)}>{dept.attendanceRate}%</Badge></Td>
                      <Td><Badge colorScheme={getRateBadgeColorScheme(dept.completionRate)}>{dept.completionRate}%</Badge></Td>
                    </Tr>
                  ))
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </Card>

        <Card>
          <Heading size="md" mb={4} color={headingColor}>Recent Training Sessions</Heading>
           <TableContainer>
            <Table variant="simple" size="sm">
              <Thead bg={tableHeadBg}>
                <Tr>
                  <Th>Training</Th>
                  <Th>Attendees</Th>
                  <Th>Completion</Th>
                </Tr>
              </Thead>
              <Tbody>
                 {isLoading ? (
                  Array(3).fill(0).map((_, i) => (<Tr key={i}><Td colSpan={3}><Skeleton height="20px" /></Td></Tr>))
                ) : (
                  dashboardData?.recentTrainings.map((training, index) => (
                    <Tr key={index} _hover={{ bg: tableRowHoverBg }}>
                      <Td><Text fontWeight="medium" noOfLines={1}>{training.title}</Text></Td>
                      <Td>{training.attendees}</Td>
                      <Td><Badge colorScheme={getRateBadgeColorScheme(training.completionRate)}>{training.completionRate}%</Badge></Td>
                    </Tr>
                  ))
                 )}
              </Tbody>
            </Table>
          </TableContainer>
        </Card>
      </SimpleGrid>

      {/* Reports Section */}
      <Card>
        <Heading size="md" mb={4} color={headingColor}>Generate Reports</Heading>
        <VStack spacing={4} align="stretch">
          <Text color={textColor}>Download comprehensive reports.</Text>
          <HStack spacing={4} wrap="wrap">
            <Select placeholder="Select Report Type" value={reportType} onChange={(e) => setReportType(e.target.value)} borderRadius="md" borderColor={inputBorderColor} _hover={{ borderColor: inputFocusBorderColor }} _focus={{ borderColor: inputFocusBorderColor, boxShadow: `0 0 0 1px ${inputFocusBorderColor}` }} width={{ base: 'full', md: 'auto' }} minW={{ md: '200px' }}>
              <option value="attendance">Attendance Report</option>
              <option value="compliance">Compliance Report</option>
              <option value="certification">Certification Status</option>
              <option value="department">Department Analysis</option>
            </Select>
            <Select placeholder="Select Date Range" value={dateRange} onChange={(e) => setDateRange(e.target.value)} borderRadius="md" borderColor={inputBorderColor} _hover={{ borderColor: inputFocusBorderColor }} _focus={{ borderColor: inputFocusBorderColor, boxShadow: `0 0 0 1px ${inputFocusBorderColor}` }} width={{ base: 'full', md: 'auto' }} minW={{ md: '200px' }}>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
              <option value="all">All Time</option>
            </Select>
          </HStack>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} pt={2}>
            <ActionButton label="Download PDF" leftIcon={<Icon as={FiFileText} />} variant="outline" isLoading={isDownloading} onClick={() => handleDownloadReport(`${reportType} (PDF)`)} />
            <ActionButton label="Download Excel" leftIcon={<Icon as={FiFileText} />} variant="outline" isLoading={isDownloading} onClick={() => handleDownloadReport(`${reportType} (Excel)`)} />
            <ActionButton label="Download CSV" leftIcon={<Icon as={FiFileText} />} variant="outline" isLoading={isDownloading} onClick={() => handleDownloadReport(`${reportType} (CSV)`)} />
          </SimpleGrid>
        </VStack>
      </Card>
    </Box>
  );
};

export default ReportsAnalyticsPage;
