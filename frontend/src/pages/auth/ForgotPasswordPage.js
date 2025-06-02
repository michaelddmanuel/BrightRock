import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
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
  FormErrorMessage,
  Icon,
  VStack, // Added VStack
} from '@chakra-ui/react';
import { FiArrowLeft, FiMail } from 'react-icons/fi';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../../services/api';
import AuthLayout from '../../components/layouts/AuthLayout'; // Import AuthLayout
import Card from '../../components/common/Card'; // Import Card
import ActionButton from '../../components/common/ActionButton'; // Import ActionButton

const ForgotPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Form validation schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      setError('');
      setSuccess(false); // Reset success state on new submission

      try {
        // Simulate API call - In real app, call backend
        // const response = await api.post('/api/auth/forgot-password', { email: values.email });
        console.log("Simulating forgot password request for:", values.email);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
        setSuccess(true);
      } catch (err) {
        // For security, show success even on error in production
        // For debugging, you might show an error
        setSuccess(true); // Simulate success regardless of actual outcome in POC
        console.error('Forgot password error:', err);
        // setError('Failed to send reset link. Please try again.'); // Optional: show generic error
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <AuthLayout> {/* Use AuthLayout */}
      <Card p={{ base: 6, md: 8 }}> {/* Use Card component */}
        <VStack spacing={6} w="100%">
          <VStack spacing={2} align="center" w="100%">
            <Heading fontSize={'2xl'} color="sasol.primary">Reset your password</Heading>
            {!success && ( // Only show subtitle if form is visible
              <Text fontSize={'md'} color={'gray.600'}>
                Enter your email address and we'll send you instructions
              </Text>
            )}
          </VStack>

          {error && (
            <Alert status="error" borderRadius="md" w="100%">
              <AlertIcon />
              {error}
            </Alert>
          )}

          {success ? (
            <Alert
              status="success"
              variant="subtle"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              py={10} // Add padding
              borderRadius="md"
            >
              <AlertIcon boxSize="40px" mr={0} />
              <AlertTitle mt={4} mb={1} fontSize="lg">
                Check your email
              </AlertTitle>
              <AlertDescription maxWidth="sm">
                We've sent password reset instructions to **{formik.values.email}**. Please check your inbox (and spam folder).
              </AlertDescription>
              <Button
                 as={RouterLink}
                 to="/login"
                 variant="link" // Use link variant
                 colorScheme="brand" // Use brand color
                 mt={6}
                 size="sm"
              >
                Back to Login
              </Button>
            </Alert>
          ) : (
            <Box w="100%">
              <form onSubmit={formik.handleSubmit}>
                <VStack spacing={4} align="stretch">
                  <FormControl
                    id="email"
                    isInvalid={!!(formik.touched.email && formik.errors.email)}
                  >
                    <FormLabel>Email address</FormLabel>
                    <Input
                      type="email"
                      {...formik.getFieldProps('email')}
                    />
                    <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
                  </FormControl>

                  <ActionButton // Use ActionButton
                    mt={4}
                    w="100%"
                    type="submit"
                    isLoading={isLoading}
                    loadingText="Sending..."
                    leftIcon={<Icon as={FiMail} />}
                    label="Send Reset Link"
                    // colorScheme="brand" // Default
                  />

                  <Button
                    as={RouterLink}
                    to="/login"
                    variant="ghost" // Keep ghost variant for subtle back link
                    leftIcon={<Icon as={FiArrowLeft} />}
                    size="sm"
                    mt={2}
                    color="gray.600"
                    alignSelf="center" // Center the back button
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

export default ForgotPasswordPage;
