import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
// import theme from './theme'; // Remove import of the separate theme file if not used
import { AuthProvider } from './contexts/AuthContext';

// Color palette based on BrightRock brand colors (primary blue)
const colors = {
  brand: {
    50: '#E1EBF0',  // Light shades of blue
    100: '#BFD4E2',
    200: '#9DBDD4',
    300: '#7AA6C5',
    400: '#588FB7',
    500: '#3579A9',  // BrightRock blue variants
    600: '#2A6287',
    700: '#1F4B65',
    800: '#143443',
    900: '#0F3151',  // BrightRock Primary Blue
  },
  // Keep existing gray scale and other semantic colors if needed
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  blue: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },
  green: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#10B981',
    600: '#059669',
    700: '#047857',
    800: '#065F46',
    900: '#064E3B',
  },
  red: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  }
  // Removed the extra closing brace for 'sasol' object here
}; // Correct closing brace for the main 'colors' object

// Create a custom theme with our color palette
const customTheme = extendTheme({
  colors, // Use the updated colors object
  styles: {
    global: {
      body: {
        bg: 'white',
        color: 'gray.800' // Use a neutral default text color
      },
      // Force light mode styles for all components
      '.chakra-ui-light': { display: 'block' },
      '.chakra-ui-dark': { display: 'none' }
    }
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
    disableTransitionOnChange: true
  },
  components: {
    Heading: {
      baseStyle: {
        color: 'brand.700', // Use brand color for headings
      }
    },
    Text: {
      baseStyle: {
        color: 'gray.700', // Keep neutral text color
      }
    },
    FormLabel: {
      baseStyle: {
        color: 'gray.800', // Keep neutral form label color
        fontWeight: 'medium',
        fontSize: 'sm',
        marginBottom: '2px',
      }
    },
    FormControl: {
      baseStyle: {
        label: {
          color: 'gray.800', // Keep neutral form label color
          fontWeight: 'medium',
          fontSize: 'sm',
          marginBottom: '2px',
        }
      }
    },
    Input: {
      defaultProps: {
        focusBorderColor: 'brand.500', // Use brand color for focus
      },
      baseStyle: {
        field: {
          color: 'gray.800', // Keep neutral input text color
          borderColor: 'gray.300', // Keep neutral border color
          _placeholder: {
            color: 'gray.500', // Keep neutral placeholder color
          },
        }
      }
    },
    Modal: { // Ensure Modal styles are defined only once
      baseStyle: {
        dialog: {
          bg: 'white',
          borderRadius: 'xl',
          boxShadow: '0px 20px 24px -4px rgba(16, 24, 40, 0.1), 0px 8px 8px -4px rgba(16, 24, 40, 0.04)'
        },
        header: {
          color: 'gray.800', // Keep neutral modal header color
          fontWeight: 'semibold',
          fontSize: 'lg',
          px: '6',
          pt: '6',
          pb: '4'
        },
        body: {
          color: 'gray.700', // Keep neutral modal body color
          px: '6',
          py: '2'
        },
        footer: {
          borderTopWidth: '1px',
          borderColor: 'gray.200', // Keep neutral border color
          px: '6',
          pt: '4',
          pb: '6'
        }
      }
    },
    Select: {
      baseStyle: {
        field: {
          color: 'gray.800', // Keep neutral select text color
          borderColor: 'gray.300', // Keep neutral border color
        }
      },
      defaultProps: {
        focusBorderColor: 'brand.500', // Use brand color for focus
      }
    },
    Card: { // Keep original Card styles from Sasol project if needed, or remove if common Card handles all cases
      baseStyle: {
        container: {
          bg: 'white',
          boxShadow: '0px 1px 3px rgba(16, 24, 40, 0.1), 0px 1px 2px rgba(16, 24, 40, 0.06)',
          borderRadius: 'lg',
          borderWidth: '1px',
          borderColor: 'gray.200', // Keep neutral border color
          overflow: 'hidden'
        },
        header: {
          py: '4',
          px: '6'
        },
        body: {
          py: '4',
          px: '6'
        },
        footer: {
          py: '4',
          px: '6',
          borderTopWidth: '1px',
          borderTopColor: 'gray.200' // Keep neutral border color
        }
      },
      variants: {
        elevated: {
          container: {
            boxShadow: '0px 4px 6px -1px rgba(16, 24, 40, 0.1), 0px 2px 4px -2px rgba(16, 24, 40, 0.1)'
          }
        },
        outline: {
          container: {
            boxShadow: 'none'
          }
        },
        filled: {
          container: {
            bg: 'gray.100', // Example: Use light gray for filled
            borderColor: 'transparent'
          }
        }
      }
    },
    Button: {
      baseStyle: { // Add base style for consistency
        fontWeight: 'medium',
        borderRadius: 'md',
      },
      variants: {
        solid: { // Default solid variant uses brand color
          bg: 'brand.500',
          color: 'white',
          _hover: {
            bg: 'brand.600', // Darker shade on hover
            _disabled: { // Ensure disabled state is clear
              bg: 'brand.300',
            }
          }
        },
        outline: { // Outline variant uses brand color
          borderColor: 'brand.500',
          color: 'brand.500',
          _hover: {
            bg: 'brand.50' // Light brand color background on hover
          }
        }
      }
    },
    Badge: {
      baseStyle: { // Standardize base badge styles
        px: '2.5', // Slightly more padding
        py: '0.5',
        textTransform: 'capitalize',
        fontWeight: 'medium',
        fontSize: 'xs',
        borderRadius: 'full',
        letterSpacing: '0.5px'
      },
      variants: {
        // Define variants based on ABB ELDS POC needs
        // Example status variants:
        completed: { bg: 'green.100', color: 'green.800' },
        pending_review: { bg: 'yellow.100', color: 'yellow.800' },
        in_progress: { bg: 'blue.100', color: 'blue.800' },
        overdue: { bg: 'red.100', color: 'red.800' },
        not_started: { bg: 'gray.100', color: 'gray.800' },
        // Example type variants:
        required: { bg: 'brand.500', color: 'white' }, // Use brand color
        optional: { bg: 'gray.100', color: 'gray.800' },
        // Add other specific variants as needed (e.g., safety, technical)
        // using appropriate color schemes (e.g., blue, teal, purple)
        safety: { bg: 'orange.100', color: 'orange.800' },
        technical: { bg: 'cyan.100', color: 'cyan.800' },
        compliance: { bg: 'purple.100', color: 'purple.800' },
        // Active/Inactive status
        active: { bg: 'green.100', color: 'green.800' },
        inactive: { bg: 'gray.100', color: 'gray.800' },
      }
    },
    Table: { // Style table headers
      baseStyle: {
        th: {
          color: 'gray.600', // Use neutral header color
          fontWeight: 'medium',
          textTransform: 'uppercase',
          letterSpacing: 'wider',
          fontSize: 'xs',
        },
        td: {
          color: 'gray.700', // Keep neutral cell text color
        }
      }
    },
    // Removed duplicate Modal style definition
    Stat: {
      baseStyle: {
        label: {
          color: 'gray.600', // Keep neutral label color
        },
        number: {
          color: 'brand.700', // Use brand color for stat number
          fontSize: 'xl',
          fontWeight: 'bold',
        },
        helpText: {
          color: 'gray.500', // Keep neutral help text color
        },
      }
    },
    Tabs: {
      baseStyle: {
        tab: {
          color: 'gray.600', // Neutral tab color
          _selected: {
            color: 'brand.600', // Brand color for selected tab
            borderColor: 'brand.500', // Brand color for border
          }
        }
      }
    }
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ChakraProvider theme={customTheme} colorModeManager={{ type: 'localStorage', get: () => 'light', set: () => {} }}>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
);
