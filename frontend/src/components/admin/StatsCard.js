import React from 'react';
import { Box, Stat, StatLabel, StatNumber, StatHelpText, StatArrow } from '@chakra-ui/react';

/**
 * StatsCard component - Displays a statistic with optional trend indicator
 * 
 * @param {string} title - The title of the statistic
 * @param {string|number} value - The value to display
 * @param {string} helpText - Optional help text to display
 * @param {string} trend - Optional trend direction ('increase', 'decrease', or null)
 * @param {string} trendValue - Optional trend value (e.g., '10%')
 * @param {React.ReactNode} icon - Optional icon to display
 */
const StatsCard = ({ title, value, helpText, trend, trendValue, icon }) => {
  const bgColor = 'white';
  const borderColor = 'gray.200';
  
  return (
    <Box
      bg={bgColor}
      boxShadow="sm"
      borderRadius="lg"
      border="1px"
      borderColor={borderColor}
      p={5}
      position="relative"
      overflow="hidden"
    >
      {icon && (
        <Box
          position="absolute"
          top="50%"
          right={4}
          transform="translateY(-50%)"
          opacity={0.15}
          fontSize="4xl"
          color="sasol.blue"
        >
          {icon}
        </Box>
      )}
      
      <Stat>
        <StatLabel color="gray.500" fontSize="sm" fontWeight="medium">
          {title}
        </StatLabel>
        <StatNumber fontSize="2xl" fontWeight="bold" mt={1}>
          {value}
        </StatNumber>
        
        {(helpText || trend) && (
          <StatHelpText mb={0} mt={2}>
            {trend && (
              <StatArrow
                type={trend}
                color={trend === 'increase' ? 'green.500' : 'red.500'}
                mr={1}
              />
            )}
            {trendValue} {helpText}
          </StatHelpText>
        )}
      </Stat>
    </Box>
  );
};

export default StatsCard;
