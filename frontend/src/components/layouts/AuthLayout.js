import React from 'react';
import { Flex, Box, Image, useColorModeValue } from '@chakra-ui/react';

const AuthLayout = ({ children }) => {
  const bgColor = useColorModeValue('gray.50', 'gray.800'); // Background for the whole page

  return (
    <Flex
      minHeight="100vh"
      align="center"
      justify="center"
      bg={bgColor}
      py={12} // Add some vertical padding
      px={4}
    >
      <Box
        maxWidth="md" // Limit width of the content area
        width="100%"
        textAlign="center"
      >
         {/* BrightRock Logo */}
         <Box
            fontSize="3xl"
            fontWeight="bold"
            color="#0F3151"
            mb={8}
          >
            BrightRock
          </Box>
        {children}
      </Box>
    </Flex>
  );
};

export default AuthLayout;
