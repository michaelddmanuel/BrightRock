import React from 'react';
import { Alert, AlertIcon, AlertTitle, AlertDescription, Box, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

/**
 * ErrorAlert component - Displays error messages with optional retry functionality
 * 
 * @param {string} title - Error title
 * @param {string} message - Error message details
 * @param {Function} onRetry - Optional retry function
 * @param {boolean} withHomeButton - Whether to show a Home button
 */
const ErrorAlert = ({ title = 'Error', message, onRetry, withHomeButton = false }) => {
  const navigate = useNavigate();
  
  return (
    <Alert
      status="error"
      variant="subtle"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      borderRadius="md"
      py={6}
      px={4}
    >
      <AlertIcon boxSize="40px" mr={0} />
      <AlertTitle mt={4} mb={2} fontSize="lg">
        {title}
      </AlertTitle>
      <AlertDescription maxWidth="md">
        {message}
      </AlertDescription>
      
      {(onRetry || withHomeButton) && (
        <Box mt={4} display="flex" gap={3}>
          {onRetry && (
            <Button colorScheme="red" onClick={onRetry}>
              Try Again
            </Button>
          )}
          
          {withHomeButton && (
            <Button variant="outline" onClick={() => navigate('/')}>
              Go Home
            </Button>
          )}
        </Box>
      )}
    </Alert>
  );
};

export default ErrorAlert;
