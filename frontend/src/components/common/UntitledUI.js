import React from 'react';
import {
  Box,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Text,
  Button,
  Flex,
  Icon,
  Badge,
  HStack,
  VStack,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Tabs,
  TabList,
  Tab
} from '@chakra-ui/react';
import { FiPlus, FiSearch, FiFilter, FiDownload, FiExternalLink } from 'react-icons/fi';

/**
 * PageHeader - A standardized page header component with title, description, and actions
 */
export const PageHeader = ({ 
  title, 
  description, 
  actions = [], 
  mb = 6
}) => {
  return (
    <Flex 
      direction={{ base: 'column', md: 'row' }} 
      justify="space-between" 
      align={{ base: 'flex-start', md: 'center' }}
      mb={mb}
      gap={4}
    >
      <Box>
        <Heading 
          as="h1" 
          size="lg" 
          color="gray.800" 
          fontWeight="semibold"
          lineHeight="1.2"
        >
          {title}
        </Heading>
        {description && (
          <Text 
            mt={1} 
            color="gray.600" 
            fontSize="md"
          >
            {description}
          </Text>
        )}
      </Box>
      
      {actions.length > 0 && (
        <HStack spacing={3}>
          {actions.map((action, index) => {
            if (action.type === 'primary') {
              return (
                <PrimaryButton 
                  key={index}
                  leftIcon={action.icon && <Icon as={action.icon} />}
                  onClick={action.onClick}
                >
                  {action.label}
                </PrimaryButton>
              );
            }
            
            return (
              <SecondaryButton 
                key={index}
                leftIcon={action.icon && <Icon as={action.icon} />}
                onClick={action.onClick}
              >
                {action.label}
              </SecondaryButton>
            );
          })}
        </HStack>
      )}
    </Flex>
  );
};

/**
 * StatsCard - A standardized stats card component for dashboards
 */
export const StatsCard = ({ 
  title, 
  value, 
  change, 
  icon, 
  colorScheme = 'blue',
  format,
  helpText
}) => {
  // Always use light mode colors
  const blue50 = 'blue.50';
  const green50 = 'green.50';
  const purple50 = 'purple.50';
  const orange50 = 'orange.50';
  const red50 = 'red.50';
  
  const blue500 = 'blue.500';
  const green500 = 'green.500';
  const purple500 = 'purple.500';
  const orange500 = 'orange.500';
  const red500 = 'red.500';
  
  const getBgColor = () => {
    const colors = {
      blue: blue50,
      green: green50,
      purple: purple50,
      orange: orange50,
      red: red50,
    };
    return colors[colorScheme] || colors.blue;
  };
  
  const getIconColor = () => {
    const colors = {
      blue: blue500,
      green: green500,
      purple: purple500,
      orange: orange500,
      red: red500,
    };
    return colors[colorScheme] || colors.blue;
  };
  
  const formattedValue = format ? format(value) : value;
  
  return (
    <Card 
      borderRadius="xl" 
      boxShadow="sm" 
      overflow="hidden"
      borderWidth="1px"
      borderColor="gray.200"
    >
      <CardBody p={6}>
        <Flex justify="space-between" align="flex-start">
          <Box>
            <Text 
              fontSize="sm" 
              fontWeight="medium" 
              color="gray.500" 
              mb={1}
            >
              {title}
            </Text>
            <Heading 
              size="lg" 
              fontWeight="semibold" 
              color="gray.900" 
              lineHeight="1"
            >
              {formattedValue}
            </Heading>
            
            {change && (
              <Stat mt={1}>
                <StatHelpText fontSize="sm" m={0}>
                  <StatArrow type={change > 0 ? 'increase' : 'decrease'} />
                  {Math.abs(change)}% {helpText || (change > 0 ? 'increase' : 'decrease')}
                </StatHelpText>
              </Stat>
            )}
          </Box>
          
          {icon && (
            <Flex 
              align="center" 
              justify="center" 
              bg={getBgColor()} 
              h="42px" 
              w="42px" 
              borderRadius="lg"
            >
              <Icon 
                as={icon} 
                color={getIconColor()} 
                boxSize={5} 
              />
            </Flex>
          )}
        </Flex>
      </CardBody>
    </Card>
  );
};

/**
 * TableToolbar - A standardized toolbar for tables with search, filters, and actions
 */
export const TableToolbar = ({
  searchPlaceholder = 'Search...',
  onSearch,
  searchValue,
  filterOptions = [],
  selectedFilter,
  onFilterChange,
  actions = [],
  mb = 4
}) => {
  return (
    <Flex 
      justify="space-between" 
      mb={mb}
      direction={{ base: 'column', md: 'row' }}
      gap={4}
    >
      <Flex 
        flex={{ base: '1', md: '2' }}
        gap={4}
        wrap={{ base: 'wrap', md: 'nowrap' }}
      >
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Icon as={FiSearch} color="#0F3151" />
          </InputLeftElement>
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearch(e.target.value)}
            borderRadius="lg"
            borderColor="gray.200"
            _hover={{ borderColor: 'gray.300' }}
            _focus={{ 
              borderColor: "#0F3151",
              boxShadow: "0 0 0 1px #0F3151"
            }}
          />
        </InputGroup>
        
        {filterOptions.length > 0 && (
          <Select
            placeholder="Filter by"
            value={selectedFilter}
            onChange={(e) => onFilterChange(e.target.value)}
            borderRadius="lg"
            borderColor="gray.200"
            _hover={{ borderColor: 'gray.300' }}
            _focus={{ 
              borderColor: "#0F3151",
              boxShadow: "0 0 0 1px #0F3151"
            }}
            icon={<FiFilter color="#0F3151" />}
            iconSize={18}
          >
            {filterOptions.map((option, index) => (
              <option key={index} value={option.value}>{option.label}</option>
            ))}
          </Select>
        )}
      </Flex>
      
      {actions.length > 0 && (
        <Flex gap={2} justify={{ base: 'flex-start', md: 'flex-end' }} wrap="wrap">
          {actions.map((action, index) => (
            <Button
              key={index}
              leftIcon={action.icon && <Icon as={action.icon} color="#0F3151" />}
              onClick={action.onClick}
              isDisabled={action.disabled}
              size="md"
              variant="outline"
              borderRadius="lg"
              borderColor="gray.200"
              _hover={{ bg: 'gray.50' }}
            >
              {action.label}
            </Button>
          ))}
        </Flex>
      )}
    </Flex>
  );
};

/**
 * PrimaryButton - A styled primary button component
 */
export const PrimaryButton = ({ children, size = "md", ...rest }) => {
  return (
    <Button
      bg="#0F3151"
      color="white"
      _hover={{ bg: '#1A4B76', transform: 'translateY(-1px)', color: "white" }}
      _active={{ bg: '#0A2A40', color: "white" }}
      borderRadius="lg"
      boxShadow="sm"
      transition="all 0.2s"
      size={size}
      fontWeight="medium"
      px={size === "sm" ? 3 : 4}
      {...rest}
    >
      {children}
    </Button>
  );
};

/**
 * SecondaryButton - A styled secondary button component
 */
export const SecondaryButton = ({ children, size = "md", ...rest }) => {
  return (
    <Button
      bg="white"
      color="#0F3151"
      border="1px solid"
      borderColor="#E2E8F0"
      _hover={{ bg: '#F7FAFC', transform: 'translateY(-1px)' }}
      _active={{ bg: '#EDF2F7' }}
      borderRadius="lg"
      boxShadow="sm"
      transition="all 0.2s"
      size={size}
      fontWeight="medium"
      px={size === "sm" ? 3 : 4}
      {...rest}
    >
      {children}
    </Button>
  );
};

/**
 * UntitledTabs - A standardized tabs component with Untitled UI styling
 */
export const UntitledTabs = ({ 
  tabs = [], 
  activeTab, 
  onChange, 
  variant = 'line',
  mb = 6
}) => {
  // Always use light mode colors
  const textColor = 'gray.600';
  const selectedColor = 'brand.600';
  const selectedBorderColor = 'brand.600';
  
  return (
    <Tabs 
      variant={variant} 
      mb={mb} 
      index={activeTab} 
      onChange={onChange}
      colorScheme="brand"
    >
      <TabList overflowX="auto" py={1}>
        {tabs.map((tab, idx) => (
          <Tab 
            key={idx}
            py={3}
            px={4}
            fontWeight="medium"
            color={textColor}
            _selected={{ 
              color: selectedColor,
              fontWeight: 'semibold',
              borderColor: selectedBorderColor
            }}
          >
            {tab.label}
            {tab.count !== undefined && (
              <Badge 
                ml={2} 
                borderRadius="full" 
                px={2} 
                py={0.5} 
                colorScheme="brand" 
                fontSize="xs"
              >
                {tab.count}
              </Badge>
            )}
          </Tab>
        ))}
      </TabList>
    </Tabs>
  );
};

/**
 * DataCard - A standardized card component for displaying various types of information
 */
export const DataCard = ({ 
  title, 
  headerRight, 
  children, 
  footer, 
  isFullHeight = false
}) => {
  // Always use light mode colors
  const borderColor = '#EDF2F7';
  const gray800 = '#0F3151';
  
  return (
    <Card
      borderRadius="xl"
      boxShadow="sm"
      borderWidth="1px"
      borderColor={borderColor}
      height={isFullHeight ? "100%" : "auto"}
      overflow="hidden"
      bg="white"
    >
      {title && (
        <CardHeader py={5} px={6}>
          <Flex justify="space-between" align="center">
            <Heading as="h3" size="md" fontWeight="semibold" color={gray800}>
              {title}
            </Heading>
            {headerRight && (
              <Box>{headerRight}</Box>
            )}
          </Flex>
        </CardHeader>
      )}
      
      <CardBody px={6} py={5}>
        {children}
      </CardBody>
      
      {footer && (
        <CardFooter 
          py={4} 
          px={6}
          borderTopWidth="1px"
          borderColor={borderColor}
        >
          {footer}
        </CardFooter>
      )}
    </Card>
  );
};

// Export all components
export default {
  PageHeader,
  StatsCard,
  TableToolbar,
  UntitledTabs,
  DataCard,
  PrimaryButton,
  SecondaryButton
};
