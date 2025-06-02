import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  IconButton,
  Image,
  Icon,
  Avatar,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverHeader,
  PopoverArrow,
  Portal,
  VStack,
  Button,
  Spacer,
  useDisclosure, // Needed if mobile drawer trigger remains here
} from '@chakra-ui/react';
import {
  HamburgerIcon, // For mobile drawer trigger
  FiSettings,
  FiUser,
  FiLogOut,
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

// Reusable User Menu Popover Content
const UserMenuContent = ({ logout, navigate }) => (
  <Portal>
    <PopoverContent width="200px" shadow="lg" borderRadius="md" _focus={{ outline: "none" }} bg="white">
      <PopoverArrow bg="white" />
      <PopoverHeader borderBottomWidth="1px" borderBottomColor="gray.200" fontWeight="semibold" py={3} px={4} color="sasol.blue.800">
        User Options
      </PopoverHeader>
      <PopoverBody p={0}>
        <VStack align="stretch" spacing={0}>
          <Button
            variant="ghost"
            justifyContent="flex-start"
            leftIcon={<Icon as={FiUser} color="#0F3151" />}
            py={3}
            borderRadius={0}
            onClick={() => navigate('/profile')} // Assuming a /profile route exists or will be added
            color="gray.700"
            _hover={{ bg: 'gray.50' }}
          >
            My Account
          </Button>
          <Button
            variant="ghost"
            justifyContent="flex-start"
            leftIcon={<Icon as={FiSettings} color="#0F3151" />}
            py={3}
            borderRadius={0}
            onClick={() => navigate('/settings')} // Assuming a /settings route exists or will be added
            color="gray.700"
            _hover={{ bg: 'gray.50' }}
          >
            Settings
          </Button>
          <Button
            variant="ghost"
            justifyContent="flex-start"
            leftIcon={<Icon as={FiLogOut} color="red.500" />}
            py={3}
            borderRadius={0}
            onClick={logout}
            color="red.500"
            _hover={{ bg: 'red.50' }}
          >
            Logout
          </Button>
        </VStack>
      </PopoverBody>
    </PopoverContent>
  </Portal>
);


const Header = ({ onOpen, ...rest }) => { // Accept onOpen for mobile drawer
  const navigate = useNavigate();
  const { currentUser, logout: authLogout } = useAuth();

  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      w="full"
      px="4"
      bg="white" // Header background
      borderBottomWidth="1px"
      borderColor="gray.200"
      h="14" // Standard header height
      position="sticky" // Make header sticky
      top="0"
      zIndex="sticky" // Ensure header stays above content
      {...rest}
    >
      {/* Mobile Menu Button */}
      <IconButton
        display={{ base: 'flex', md: 'none' }} // Only show on mobile
        aria-label="Open Menu"
        icon={<HamburgerIcon />}
        onClick={onOpen} // Trigger drawer open
        variant="outline"
        mr="2"
      />

      {/* Logo - visible on all sizes for consistency */}
      <Image
        src="/sasol-logo-wine.png" // Use the appropriate logo
        alt="Sasol Logo"
        height="30px"
        fallbackSrc="https://download.logo.wine/logo/Sasol/Sasol-Logo.wine.png"
        display={{ base: 'none', md: 'block' }} // Hide on mobile if drawer has logo
      />
       {/* Mobile logo - centered when menu button is present */}
       <Image
        src="/sasol-logo-wine.png"
        alt="Sasol Logo"
        height="30px"
        fallbackSrc="https://download.logo.wine/logo/Sasol/Sasol-Logo.wine.png"
        display={{ base: 'block', md: 'none' }}
        mx="auto" // Center logo on mobile when menu button takes left space
      />


      <Spacer />

      {/* User Menu - consistent across sizes */}
      <Popover placement="bottom-end" closeOnBlur={true}>
        <PopoverTrigger>
           <Button
             variant="ghost"
             size="sm"
             _hover={{ bg: 'gray.100' }}
             leftIcon={<Avatar
                size="xs" // Smaller avatar in header
                name={currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : ''}
                bg="#0F3151" // Use theme color
              />}
           >
             {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'User'}
           </Button>
        </PopoverTrigger>
        <UserMenuContent logout={authLogout} navigate={navigate} />
      </Popover>

    </Flex>
  );
};

export default Header;
