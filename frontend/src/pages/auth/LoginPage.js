import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Stack,
  Text,
  VStack,
  InputGroup,
  InputRightElement,
  Alert,
  AlertIcon,
  FormErrorMessage,
  useToast,
  Image,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useAuth } from '../../contexts/AuthContext';

// Mock users for quick access buttons
const mockUsers = [
  {
    id: 1,
    firstName: 'Thomas',
    lastName: 'Anderson',
    email: 'thomas.anderson@brightrock.com',
    role: 'DS',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80'
  },
  {
    id: 3,
    firstName: 'Michael',
    lastName: 'Johnson',
    email: 'michael.johnson@brightrock.com',
    role: 'Manager'
  },
  {
    id: 4,
    firstName: 'Sarah',
    lastName: 'Williams',
    email: 'sarah.williams@brightrock.com',
    role: 'Executive'
  }
];

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, directAccess } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  
  // Function to handle demo/quick access buttons - COMPLETELY REWRITTEN for reliability
  const handleDemoAccess = (role) => {
    console.log(`[LoginPage] Quick access button clicked for role: ${role}`);
    
    try {
      // Use the improved directAccess method from AuthContext
      const result = directAccess(role);
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to access demo portal');
      }
      
      // Show success message
      toast({
        title: 'Success!',
        description: `Accessing ${role} dashboard...`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Navigate to the appropriate dashboard using the URL from the result
      console.log(`[LoginPage] Redirecting to ${result.redirectUrl} using window.location.href`);
      
      // Use setTimeout to ensure the toast is shown before redirect
      setTimeout(() => {
        window.location.href = result.redirectUrl;
      }, 500);
    } catch (error) {
      console.error('[LoginPage] Error in handleDemoAccess:', error);
      toast({
        title: 'Access Error',
        description: `Could not access ${role} dashboard. Please try again.`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Our login function returns {success, message}
      const result = await login(email, password);
      
      if (!result.success) {
        setError(result.message || 'Login failed. Please check your credentials.');
      }
      // If successful, the login function in AuthContext will navigate to role-selection
    } catch (err) {
      setError('An error occurred during login. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box 
      minH="100vh" 
      position="relative"
      backgroundImage="url('https://images.unsplash.com/photo-1516496636080-14fb876e029d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80')"
      backgroundSize="cover"
      backgroundPosition="center"
      overflow="hidden"
    >
      {/* Decorative elements */}
      <Box 
        position="absolute" 
        top="10%" 
        left="5%" 
        width="200px" 
        height="200px" 
        opacity="0.6"
        backgroundImage="url('https://cdn-icons-png.flaticon.com/512/6947/6947508.png')" 
        backgroundSize="contain"
        backgroundRepeat="no-repeat"
      />
      <Box 
        position="absolute" 
        bottom="15%" 
        right="5%" 
        width="180px" 
        height="180px" 
        opacity="0.4"
        backgroundImage="url('https://cdn-icons-png.flaticon.com/512/6534/6534444.png')" 
        backgroundSize="contain"
        backgroundRepeat="no-repeat"
      />
      <Box 
        position="absolute" 
        top="50%" 
        left="15%" 
        width="150px" 
        height="150px" 
        opacity="0.3"
        backgroundImage="url('https://cdn-icons-png.flaticon.com/512/4307/4307617.png')" 
        backgroundSize="contain"
        backgroundRepeat="no-repeat"
      />
      <Box 
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgGradient="linear(to-b, rgba(0,0,0,0.7), rgba(0,0,0,0.4))"
      />
      
      <Center height="100vh">
        <Container maxW="lg" py={12} px={6} position="relative" zIndex={1}>
          <Box
            bg="rgba(255,255,255,0.9)"
            p={8}
            rounded="lg"
            boxShadow="xl"
            w="full"
            maxW="md"
            mx="auto"
            borderWidth="1px"
            borderColor="orange.300"
            position="relative"
            overflow="hidden"
          >
            {/* Fingerprint background pattern */}
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              opacity="0.05"
              backgroundImage="url('https://cdn-icons-png.flaticon.com/512/3097/3097928.png')"
              backgroundSize="cover"
              backgroundPosition="center"
              zIndex={0}
            />
          <VStack spacing={6} align="stretch">
            <Box display="flex" justifyContent="center" mb={4} position="relative" zIndex={1}>
              <Image
                src="/Brightrock.png"
                alt="BrightRock Logo"
                height="70px"
              />
            </Box>
            <Heading fontSize="2xl" textAlign="center" color="#000" position="relative" zIndex={1}>
              Welcome Back
            </Heading>
            <Box 
              w="50px" 
              h="3px" 
              bg="orange.400" 
              mx="auto" 
              my={2} 
              position="relative" 
              zIndex={1}
            />
            <Text textAlign="center" color="gray.700" fontWeight="medium" position="relative" zIndex={1} mb={4}>
              Sign in to your account
            </Text>
            {error && (
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                {error}
              </Alert>
            )}
            
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl id="email">
                  <FormLabel>Email Address</FormLabel>
                  <Input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    borderColor="gray.300"
                    _hover={{ borderColor: "brand.900" }}
                    _focus={{ borderColor: "brand.900", boxShadow: "0 0 0 1px #0F3151" }}
                    required
                  />
                </FormControl>
                
                <FormControl id="password">
                  <FormLabel>Password</FormLabel>
                  <InputGroup>
                    <Input 
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      borderColor="gray.300"
                      _hover={{ borderColor: "brand.900" }}
                      _focus={{ borderColor: "brand.900", boxShadow: "0 0 0 1px #0F3151" }}
                      required
                    />
                    <InputRightElement>
                      <Button
                        variant="ghost"
                        onClick={() => setShowPassword(!showPassword)}
                        size="sm"
                      >
                        {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
                
                <Button
                  type="submit"
                  colorScheme="yellow"
                  bg="#F7B500"
                  color="black"
                  size="lg"
                  width="100%"
                  mt={4}
                  isLoading={isLoading}
                  _hover={{ bg: "#E9A800" }}
                  fontWeight="bold"
                  position="relative" 
                  zIndex={1}
                  boxShadow="md"
                >
                  Sign In
                </Button>
                
                <Button
                  colorScheme="blackAlpha"
                  variant="outline"
                  size="lg"
                  width="100%"
                  mt={2}
                  onClick={() => handleDemoAccess('DS')}
                  _hover={{ bg: 'gray.100' }}
                  borderColor="gray.800"
                  color="gray.800"
                  position="relative" 
                  zIndex={1}
                >
                  Guest Login
                </Button>
              </VStack>
            </form>
            
            {/* For testing, we can add a helper text with sample credentials */}
            <Text fontSize="sm" color="gray.500" textAlign="center" mt={4}>
              <strong>Test user:</strong><br/>
              thomas.anderson@brightrock.com<br/>
              <em>Any password will work</em>
            </Text>
          </VStack>
        </Box>
      </Container>
      </Center>
    </Box>
  );
};

export default LoginPage;
