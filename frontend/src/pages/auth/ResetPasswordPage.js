import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button, // Keep for Back to Login link styling
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  Link,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  InputGroup,
  InputRightElement,
  IconButton, // Keep for password visibility toggle
  FormErrorMessage,
  Icon,
  Spinner,
  Center,
  VStack, // Added VStack
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { FiCheck, FiArrowLeft } from 'react-icons/fi'; // Added FiArrowLeft
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../../services/api';
import AuthLayout from '../../components/layouts/AuthLayout'; // Import AuthLayout
import Card from '../../components/common/Card'; // Import Card
import ActionButton from '../../components/common/ActionButton'; // Import ActionButton

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Validate token on component mount (keeping existing logic)
  useEffect(() => {
    const validateToken = async () => {
      try {
        setIsValidating(true);
        // Simulate API call
        // const response = await api.get(`/api/auth/reset-password/validate/${token}`);
        console.log("Simulating token validation for:", token);
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
        // Simulate valid/invalid token for testing
        if (token === "valid-token") { // Example condition
             setIsTokenValid(true);
        } else {
             throw new Error("Invalid token");
        }
      } catch (err) {
        console.error('Token validation error:', err);
        setIsTokenValid(false);
        setError('The password reset link is invalid or has expired. Please request a new one.');
      } finally {
        setIsValidating(false);
      }
    };
    validateToken();
  }, [token]);

  // Form validation schema (keeping existing logic)
  const validationSchema = Yup.object({
    password: Yup.string().required('Password is required').min(8, 'Password must be at least 8 characters').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Confirm password is required'),
  });

  // Formik setup (keeping existing logic)
  const formik = useFormik({
    initialValues: { password: '', confirmPassword: '' },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      setError('');
      try {
        // Simulate API call
        // const response = await api.post(`/api/auth/reset-password/${token}`, { password: values.password });
        console.log("Simulating password reset for token:", token);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSuccess(true);
        setTimeout(() => {
          navigate('/login', { state: { message: 'Password reset successfully. Please login.' } });
        }, 3000);
      } catch (err) {
        console.error('Password reset error:', err);
        setError('Failed to reset password. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
  });

  // Loading state while validating token
  if (isValidating) {
    return (
      <AuthLayout>
        <Center minH="200px">
          <VStack spacing={4}>
            <Spinner size="xl" color="sasol.primary" />
            <Text>Validating link...</Text>
          </VStack>
        </Center>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout> {/* Use AuthLayout */}
      <Card p={{ base: 6, md: 8 }}> {/* Use Card component */}
        <VStack spacing={6} w="100%">
          <VStack spacing={2} align="center" w="100%">
            <Heading fontSize={'2xl'} color="sasol.primary">
              {isTokenValid ? 'Create new password' : 'Link Invalid'}
            </Heading>
            {!isTokenValid && !success && (
                 <Text fontSize={'md'} color={'gray.600'}>
                    This link may have expired or is incorrect.
                 </Text>
            )}
             {isTokenValid && !success && (
                 <Text fontSize={'md'} color={'gray.600'}>
                    Enter a new secure password for your account.
                 </Text>
            )}
          </VStack>

          {error && !success && ( // Show general errors only if not in success/invalid token state
            <Alert status="error" borderRadius="md" w="100%">
              <AlertIcon />
              {error}
            </Alert>
          )}

          {!isTokenValid ? (
            // Invalid Token State
            <Alert status="error" variant="subtle" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center" py={10} borderRadius="md">
              <AlertIcon boxSize="40px" mr={0} />
              <AlertTitle mt={4} mb={1} fontSize="lg">Invalid or Expired Link</AlertTitle>
              <AlertDescription maxWidth="sm">The password reset link is invalid or has expired.</AlertDescription>
              <Button as={RouterLink} to="/forgot-password" colorScheme="brand" mt={6} size="sm">
                Request New Link
              </Button>
            </Alert>
          ) : success ? (
            // Success State
            <Alert status="success" variant="subtle" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center" py={10} borderRadius="md">
              <AlertIcon boxSize="40px" mr={0} />
              <AlertTitle mt={4} mb={1} fontSize="lg">Password Reset Successful</AlertTitle>
              <AlertDescription maxWidth="sm">You will be redirected to login shortly.</AlertDescription>
              <Spinner mt={4} />
            </Alert>
          ) : (
            // Password Reset Form State
            <Box w="100%">
              <form onSubmit={formik.handleSubmit}>
                <VStack spacing={4} align="stretch">
                  <FormControl id="password" isInvalid={!!(formik.touched.password && formik.errors.password)}>
                    <FormLabel>New Password</FormLabel>
                    <InputGroup>
                      <Input type={showPassword ? 'text' : 'password'} {...formik.getFieldProps('password')} />
                      <InputRightElement h={'full'}>
                        <IconButton // Use IconButton for consistency
                          aria-label={showPassword ? "Hide password" : "Show password"}
                          variant={'ghost'}
                          icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                          onClick={() => setShowPassword(show => !show)}
                        />
                      </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
                  </FormControl>

                  <FormControl id="confirmPassword" isInvalid={!!(formik.touched.confirmPassword && formik.errors.confirmPassword)}>
                    <FormLabel>Confirm New Password</FormLabel>
                    <Input type={showPassword ? 'text' : 'password'} {...formik.getFieldProps('confirmPassword')} />
                    <FormErrorMessage>{formik.errors.confirmPassword}</FormErrorMessage>
                  </FormControl>

                  <ActionButton // Use ActionButton
                    mt={4}
                    w="100%"
                    type="submit"
                    isLoading={isLoading}
                    loadingText="Resetting..."
                    leftIcon={<Icon as={FiCheck} />}
                    label="Reset Password"
                    // colorScheme="brand" // Default
                  />
                   <Button
                    as={RouterLink}
                    to="/login"
                    variant="link" // Use link variant
                    leftIcon={<Icon as={FiArrowLeft} />}
                    size="sm"
                    mt={2}
                    color="gray.600"
                    alignSelf="center"
                  >
                    Back to Login
                  </Button>
                </VStack>
              </form>
            </Box>
          )}
        </VStack>
      </Card>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
