import { useToast as useChakraToast } from '@chakra-ui/react';

/**
 * Custom hook for showing toast notifications with consistent styling
 * 
 * @returns {Object} toast helper functions
 */
const useToast = () => {
  const toast = useChakraToast();
  
  const defaultConfig = {
    position: 'top-right',
    duration: 5000,
    isClosable: true,
  };
  
  return {
    /**
     * Show a success toast
     * 
     * @param {string} title - Toast title
     * @param {string} description - Toast description
     * @param {Object} options - Additional toast options
     */
    success: (title, description = '', options = {}) => {
      toast({
        title,
        description,
        status: 'success',
        ...defaultConfig,
        ...options,
      });
    },
    
    /**
     * Show an error toast
     * 
     * @param {string} title - Toast title
     * @param {string} description - Toast description
     * @param {Object} options - Additional toast options
     */
    error: (title, description = '', options = {}) => {
      toast({
        title,
        description,
        status: 'error',
        ...defaultConfig,
        ...options,
      });
    },
    
    /**
     * Show a warning toast
     * 
     * @param {string} title - Toast title
     * @param {string} description - Toast description
     * @param {Object} options - Additional toast options
     */
    warning: (title, description = '', options = {}) => {
      toast({
        title,
        description,
        status: 'warning',
        ...defaultConfig,
        ...options,
      });
    },
    
    /**
     * Show an info toast
     * 
     * @param {string} title - Toast title
     * @param {string} description - Toast description
     * @param {Object} options - Additional toast options
     */
    info: (title, description = '', options = {}) => {
      toast({
        title,
        description,
        status: 'info',
        ...defaultConfig,
        ...options,
      });
    },
  };
};

export default useToast;
