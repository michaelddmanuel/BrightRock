import React from 'react';
import { Box, Heading, Text, Flex } from '@chakra-ui/react';

/**
 * PageHeader component - Used for consistent page headers across the application
 * 
 * @param {string} title - The main title of the page
 * @param {string} subtitle - Optional subtitle or description
 * @param {React.ReactNode} actions - Optional actions (buttons, links, etc.) to display on the right
 */
const PageHeader = ({ title, subtitle, actions }) => {
  return (
    <Box mb={6} py={2}>
      <Flex justifyContent="space-between" alignItems="center">
        <Box>
          {/* Optionally ensure heading uses primary theme color */}
          <Heading as="h1" size="xl" mb={subtitle ? 2 : 0} color="sasol.primary">
            {title}
          </Heading>
          {subtitle && (
            <Text color="gray.600">{subtitle}</Text>
          )}
        </Box>
        {actions && (
          <Box>{actions}</Box>
        )}
      </Flex>
    </Box>
  );
};

export default PageHeader;
