import React from 'react';
// Ensure useColorModeValue is imported correctly
import { Box, Heading, Text, Flex, useColorModeValue } from '@chakra-ui/react';

/**
 * Card component - A reusable card container with title and icon
 *
 * @param {string} title - The card title
 * @param {React.ReactNode} icon - Optional icon to display
 * @param {string} subtitle - Optional subtitle
 * @param {React.ReactNode} children - Card content
 * @param {Object} props - Additional props to pass to the Box component
 */
const Card = ({ title, icon, subtitle, children, ...props }) => {
  // Use theme token for background, potentially supporting dark mode
  const bgColor = useColorModeValue('white', 'gray.700'); // Example dark mode color
  const borderColor = useColorModeValue('gray.200', 'gray.600'); // Example dark mode border
  const iconColor = useColorModeValue('brand.900', 'brand.200'); // Use BrightRock primary blue

  return (
    <Box
      bg={bgColor} // Use theme-aware background
      boxShadow="sm"
      borderRadius="lg"
      border="1px"
      borderColor={borderColor}
      overflow="hidden"
      p={6} // Default padding applied by the common Card
      height="100%"
      {...props}
    >
      {(title || icon) && (
        <Flex alignItems="center" mb={4}>
          {/* Use theme-aware icon color */}
          {icon && <Box mr={3} color={iconColor}>{icon}</Box>}
          <Box>
            {/* Use theme color for heading */}
            {title && <Heading as="h3" size="md" color="brand.900">{title}</Heading>}
            {subtitle && <Text color="gray.600" mt={1}>{subtitle}</Text>}
          </Box>
        </Flex>
      )}
      {children}
    </Box>
  );
};

export default Card;
