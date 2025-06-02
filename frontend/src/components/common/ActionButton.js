import React from 'react';
import { Button, Tooltip, Box } from '@chakra-ui/react';

/**
 * ActionButton - A customizable button with optional icon and tooltip
 *
 * @param {string} label - Button label
 * @param {function} onClick - Click handler
 * @param {React.ReactNode} icon - Optional icon
 * @param {string} tooltip - Optional tooltip text
 * @param {string} variant - Button variant
 * @param {string} colorScheme - Button color scheme
 * @param {boolean} isLoading - Whether the button is loading
 * @param {boolean} isDisabled - Whether the button is disabled
 * @param {Object} props - Additional props to pass to the Button component
 */
const ActionButton = ({
  label,
  onClick,
  icon,
  tooltip,
  variant = 'solid',
  colorScheme = 'brand', // Default to 'brand' to use theme primary color
  isLoading = false,
  isDisabled = false,
  ...props
}) => {
  const button = (
    <Button
      leftIcon={icon}
      variant={variant}
      colorScheme={colorScheme}
      onClick={onClick}
      isLoading={isLoading}
      isDisabled={isDisabled}
      {...props}
    >
      {label}
    </Button>
  );

  if (tooltip) {
    return (
      <Tooltip label={tooltip} hasArrow placement="top">
        <Box display="inline-block">
          {button}
        </Box>
      </Tooltip>
    );
  }

  return button;
};

export default ActionButton;
