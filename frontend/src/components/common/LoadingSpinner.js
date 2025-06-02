import React from 'react';
import { Flex, Spinner, Text, Box } from '@chakra-ui/react';

/**
 * LoadingSpinner component - Displays a spinner with optional text
 * 
 * @param {string} text - Optional text to display with the spinner
 * @param {string} size - Size of the spinner (xs, sm, md, lg, xl)
 * @param {string} color - Color of the spinner
 */
const LoadingSpinner = ({ text, size = 'xl', color = 'sasol.blue' }) => {
  return (
    <Flex direction="column" justify="center" align="center" h="100%" minH="200px">
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color={color}
        size={size}
      />
      {text && (
        <Box mt={4}>
          <Text color="gray.600">{text}</Text>
        </Box>
      )}
    </Flex>
  );
};

export default LoadingSpinner;
