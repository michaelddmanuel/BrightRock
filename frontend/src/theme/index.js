import { extendTheme } from '@chakra-ui/react';

// Define the color palette (using Sasol Blue as primary - adjust hex if needed)
const colors = {
  brand: {
    50: '#e6f0ff',
    100: '#b9d4fe',
    200: '#8cb9fd',
    300: '#5e9dfc',
    400: '#3182fc',
    500: '#004494', // Sasol-like Blue (adjust as needed)
    600: '#003676',
    700: '#002858',
    800: '#001a3b',
    900: '#000c1f',
  },
};

// Define fonts (using system defaults for now, can be customized)
const fonts = {
  heading: `system-ui, sans-serif`,
  body: `system-ui, sans-serif`,
};

// Define global styles (optional)
const styles = {
  global: {
    'html, body': {
      color: 'gray.800', // Default text color
      lineHeight: 'tall',
    },
    a: {
      color: 'brand.500', // Use brand color for links
      _hover: {
        textDecoration: 'underline',
      },
    },
  },
};

// Extend the default theme
const theme = extendTheme({
  colors,
  fonts,
  styles,
  // Add component style overrides here if needed later
});

export default theme;
