import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { FiUser, FiUsers, FiBarChart2 } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

const RoleSelectionPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { currentUser, setUserRole } = useAuth();

  // Direct navigation functions for each role
  const goToDSDashboard = () => {
    setUserRole('DS');
    toast({
      title: 'DS Role Selected',
      description: 'You are now viewing the Distribution Specialist dashboard',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    navigate('/ds-dashboard');
  };
  
  const goToManagerDashboard = () => {
    setUserRole('Manager');
    toast({
      title: 'Manager Role Selected',
      description: 'You are now viewing the Manager dashboard',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    navigate('/manager-dashboard');
  };
  
  const goToExecutiveDashboard = () => {
    setUserRole('Executive');
    toast({
      title: 'Executive Role Selected',
      description: 'You are now viewing the Executive dashboard',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    navigate('/executive-dashboard');
  };

  return (
    <Center minH="100vh" bg="gray.50">
      <Box
        maxW="800px"
        w="full"
        bg="white"
        p={8}
        borderRadius="lg"
        boxShadow="lg"
        textAlign="center"
      >
        <VStack spacing={8}>
          <Heading
            fontSize="4xl"
            fontWeight="bold"
            color="#0F3151"
          >
            BrightRock
          </Heading>
          
          <Heading size="lg" color="gray.700">
            Welcome to the BrightRock Efficiency Platform
          </Heading>
          
          <Text fontSize="md" color="gray.600">
            Please select your role to continue
          </Text>
          
          <Flex 
            direction={{ base: 'column', md: 'row' }} 
            w="full" 
            justify="center" 
            align="center"
            spacing={6}
            gap={6}
          >
            <RoleCard
              icon={FiUser}
              title="Distribution Specialist"
              description="Manage your quotes, tasks, and SLA compliance"
              onClick={goToDSDashboard}
              accentColor="blue.500"
            />
            
            <RoleCard
              icon={FiUsers}
              title="Manager"
              description="Monitor team performance and DS metrics"
              onClick={goToManagerDashboard}
              accentColor="green.500"
            />
            
            <RoleCard
              icon={FiBarChart2}
              title="Executive"
              description="View high-level organizational performance"
              onClick={goToExecutiveDashboard}
              accentColor="purple.500"
            />
          </Flex>
        </VStack>
      </Box>
    </Center>
  );
};

// Role selection card component
const RoleCard = ({ icon, title, description, onClick, accentColor }) => {
  return (
    <Box
      bg="white"
      borderWidth="1px"
      borderRadius="lg"
      borderColor="gray.200"
      overflow="hidden"
      p={5}
      _hover={{
        boxShadow: 'md',
        borderColor: accentColor,
      }}
      transition="all 0.3s ease"
      flex="1"
      minW={{ base: "full", md: "200px" }}
      maxW={{ base: "full", md: "250px" }}
    >
      <Stack align="center" spacing={4}>
        <Center
          bg={`${accentColor}`}
          w="60px"
          h="60px"
          borderRadius="full"
          color="white"
        >
          <Box as={icon} size="24px" />
        </Center>
        <Heading size="md" textAlign="center" color="gray.700">
          {title}
        </Heading>
        <Text fontSize="sm" color="gray.500" textAlign="center">
          {description}
        </Text>
        <Button 
          colorScheme={accentColor.split('.')[0]} 
          size="md" 
          width="full"
          onClick={onClick}
          fontWeight="bold"
          _hover={{ 
            transform: 'translateY(-2px)', 
            boxShadow: 'md' 
          }}
          py={6}
        >
          Access {title} Portal
        </Button>
      </Stack>
    </Box>
  );
};

export default RoleSelectionPage;
