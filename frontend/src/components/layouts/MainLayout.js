import React, { useState } from 'react';
import { Outlet, Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  VStack,
  IconButton,
  Drawer,
  DrawerContent,
  useDisclosure,
  Text,
  Icon,
  Avatar,
  Image,
  Collapse,
  HStack,
  Portal,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverHeader,
  PopoverArrow,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import {
  ChevronDownIcon,
  HamburgerIcon,
} from '@chakra-ui/icons';
import {
  FiHome,
  FiFile,
  FiUsers,
  FiSettings,
  FiCalendar,
  FiUser,
  FiLogOut,
  FiList,
  FiChevronDown,
  FiChevronRight,
  FiChevronLeft,
  FiBarChart2,
  FiShield,
  FiClipboard,
  FiClock,
  FiUserPlus,
  FiKey,
  FiEdit,
  FiPlusCircle,
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

// NavItem component for navigation links
const NavItem = ({ icon, children, to, isActive, isCollapsed, ...rest }) => {
  return (
    <RouterLink to={to} style={{ textDecoration: 'none', width: '100%' }}>
      <Flex
        align="center"
        p="3"
        mx="0"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        width="100%"
        bg={isActive ? '#0F3151' : 'transparent'}
        color={isActive ? '#FFFFFF' : 'gray.600'}
        _hover={{
          bg: isActive ? '#0F3151' : '#E1EBF0',
          color: isActive ? '#FFFFFF' : '#0F3151',
          boxShadow: isActive ? 'none' : 'sm',
        }}
        transition="all 0.2s"
        fontWeight={isActive ? "medium" : "normal"}
        justifyContent={isCollapsed ? "center" : "flex-start"}
        {...rest}
      >
        {icon && (
          <Icon
            mr={isCollapsed ? "0" : "4"}
            fontSize="16"
            color={isActive ? '#FFFFFF' : 'gray.400'}
            _groupHover={{
              color: isActive ? '#FFFFFF' : '#0F3151',
            }}
            as={icon}
          />
        )}
        {!isCollapsed && (
          <Text color={isActive ? "#FFFFFF" : "inherit"} fontWeight="inherit">{children}</Text>
        )}
      </Flex>
    </RouterLink>
  );
};

// NavSubItem component for submenu items (admin section)
const NavSubItem = ({ icon, children, to, isActive, isCollapsed, onClick, ...rest }) => {
  return (
    <RouterLink to={to} style={{ textDecoration: 'none', width: '100%' }} onClick={onClick}>
      <Flex
        align="center"
        p="3"
        ml={isCollapsed ? "0" : "2"}
        mr="0"
        borderRadius="md"
        role="group"
        cursor="pointer"
        width={isCollapsed ? "100%" : "calc(100% - 0.5rem)"}
        bg={isActive ? 'blue.600' : 'transparent'}
        color={isActive ? 'white' : 'gray.600'}
        _hover={{
          bg: isActive ? 'blue.700' : 'gray.100',
          color: isActive ? 'white' : 'gray.800',
        }}
        transition="all 0.2s"
        fontWeight={isActive ? "medium" : "normal"}
        justifyContent={isCollapsed ? "center" : "flex-start"}
        {...rest}
      >
        {icon && (
          <Icon
            mr={isCollapsed ? "0" : "3"}
            fontSize={isCollapsed ? "16" : "14"}
            color={isActive ? '#FFFFFF' : 'gray.400'}
            _groupHover={{
              color: isActive ? '#FFFFFF' : '#0F3151',
            }}
            as={icon}
          />
        )}
        {!isCollapsed && (
          <Text color={isActive ? "#FFFFFF" : "inherit"} fontWeight="inherit">{children}</Text>
        )}
      </Flex>
    </RouterLink>
  );
};

// NavGroup component for collapsible navigation sections (admin)
const NavGroup = ({ icon, title, children, isActive, isCollapsed, ...rest }) => {
  const [isOpen, setIsOpen] = React.useState(isActive);

  return (
    <Box width="100%">
      <Flex
        align="center"
        p="3"
        mx="0"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        width="100%"
        bg={isActive ? '#0F3151' : 'transparent'}
        color={isActive ? '#FFFFFF' : 'gray.600'}
        fontWeight={isActive ? "semibold" : "medium"}
        onClick={() => setIsOpen(!isOpen)}
        _hover={{
          bg: isActive ? '#0F3151' : '#E1EBF0',
          color: isActive ? '#FFFFFF' : '#0F3151',
        }}
        justifyContent={isCollapsed ? "center" : "flex-start"}
        {...rest}
      >
        {icon && (
          <Icon
            mr={isCollapsed ? "0" : "4"}
            fontSize="16"
            color={isActive ? '#FFFFFF' : 'gray.500'}
            _groupHover={{
              color: isActive ? '#FFFFFF' : '#0F3151',
            }}
            as={icon}
          />
        )}
        {!isCollapsed && (
          <>
            <Text flex="1" color={isActive ? '#FFFFFF' : 'gray.600'} fontWeight={isActive ? "semibold" : "medium"}>{title}</Text>
            <Icon
              as={isOpen ? FiChevronDown : FiChevronRight}
              color={isActive ? '#FFFFFF' : 'gray.500'}
              _groupHover={{
                color: isActive ? '#FFFFFF' : '#0F3151',
              }}
            />
          </>
        )}
      </Flex>
      <Collapse in={isOpen}>
        <VStack
          width="100%"
          spacing="2"
          pt="2"
          pb="2"
          align="stretch"
        >
          {children}
        </VStack>
      </Collapse>
    </Box>
  );
};

// Sidebar content
const SidebarContent = ({ currentUser, logout, isCollapsed, onToggleCollapse, navigate, ...rest }) => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  
  return (
    <Box
      as="nav"
      pos="fixed"
      top="0"
      left="0"
      zIndex="sticky"
      h="full"
      pb="10"
      overflowX="hidden"
      overflowY="auto"
      bg="white"
      borderRight="1px"
      borderRightColor="gray.200"
      w={isCollapsed ? "70px" : "283px"}
      transition="width 0.3s ease"
      {...rest}
    >
      <Flex h="full" direction="column" px={isCollapsed ? "2" : "6"} py="4">
        {/* Logo section with toggle button */}
        <Flex
          h="20"
          alignItems="center"
          justifyContent="center"
          mb="4"
          position="relative"
        >
          {/* Toggle button */}
          <IconButton
            aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            icon={isCollapsed ? <Icon as={FiChevronRight} color="#0F3151" /> : <Icon as={FiChevronLeft} color="#0F3151" />}
            position="absolute"
            right="-12px"
            top="4px"
            size="sm"
            rounded="full"
            bg="white"
            shadow="md"
            border="1px"
            borderColor="gray.200"
            zIndex={2}
            onClick={onToggleCollapse}
            _hover={{
              bg: "#0F3151",
              "& svg": { color: "white" }
            }}
          />
          
          {/* Logo */}
          {isCollapsed ? (
            <Flex width="100%" height="40px" align="center" justify="center" mt="2" mb="4">
              <Box 
                width="45px" 
                height="45px" 
                bg="#FDB913" 
                borderRadius="full" 
                display="flex" 
                alignItems="center" 
                justifyContent="center"
                boxShadow="0px 3px 6px rgba(0, 0, 0, 0.16)"
                position="relative"
                overflow="hidden"
              >
                <Box 
                  position="absolute" 
                  width="30px" 
                  height="30px" 
                  bg="white" 
                  transform="rotate(10deg)" 
                  borderRadius="sm"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text fontWeight="extrabold" fontSize="md" color="#FDB913">BR</Text>
                </Box>
              </Box>
            </Flex>
          ) : (
            <Image
              src="/Brightrock.png"
              alt="BrightRock Logo"
              maxW="150px"
              objectFit="contain"
            />
          )}
        </Flex>

        {/* Navigation Links */}
        <Box flex="1" overflowY="auto"> {/* Allow sidebar content to scroll if needed */}
          <VStack spacing="2" align="stretch">
            <NavItem
              icon={FiHome}
              to="/dashboard/ds"
              isActive={isActive('/dashboard/ds')}
              isCollapsed={isCollapsed}
            >
              DS Dashboard
            </NavItem>
            <NavItem
              icon={FiUsers}
              to="/dashboard/manager"
              isActive={isActive('/dashboard/manager')}
              isCollapsed={isCollapsed}
            >
              Managers Dashboard
            </NavItem>
            <NavItem
              icon={FiBarChart2}
              to="/dashboard/executive"
              isActive={isActive('/dashboard/executive')}
              isCollapsed={isCollapsed}
            >
              Executives Dashboard
            </NavItem>
          </VStack>
        </Box>

        {/* User section at the bottom */}
        <Flex
          borderTop="1px"
          borderTopColor="gray.200"
          py="4"
          mt="4"
          alignItems="center"
          justifyContent={isCollapsed ? "center" : "space-between"}
          px={isCollapsed ? "2" : "4"}
        >
          {isCollapsed ? (
            <Popover placement="right" closeOnBlur={true}>
              <PopoverTrigger>
                <IconButton
                  aria-label="User settings"
                  icon={<Icon as={FiSettings} color="gray.600" />}
                  variant="ghost"
                  size="sm"
                  _hover={{
                    bg: 'gray.100'
                  }}
                />
              </PopoverTrigger>
              <Portal>
                <PopoverContent width="200px" shadow="lg" borderRadius="md" _focus={{ outline: "none" }} bg="white">
                  <PopoverArrow bg="white" />
                  <PopoverHeader borderBottomWidth="1px" borderBottomColor="gray.200" fontWeight="semibold" py={3} px={4} color="gray.700">
                    User Options
                  </PopoverHeader>
                  <PopoverBody p={0}>
                    <VStack align="stretch" spacing={0}>
                      <Button
                        variant="ghost"
                        justifyContent="flex-start"
                        leftIcon={<Icon as={FiUser} color="gray.600" />}
                        py={3}
                        borderRadius={0}
                        onClick={() => navigate('/profile')}
                        color="gray.700"
                        _hover={{ bg: 'gray.50' }}
                      >
                        My Account
                      </Button>
                      <Button
                        variant="ghost"
                        justifyContent="flex-start"
                        leftIcon={<Icon as={FiSettings} color="gray.600" />}
                        py={3}
                        borderRadius={0}
                        onClick={() => navigate('/settings')}
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
            </Popover>
          ) : (
            <>
              <Flex alignItems="center" flex="1">
                <Avatar
                  size="sm"
                  name={currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : ''}
                  bg="blue.600"
                  mr="3"
                />
                <Box flex="1" overflow="hidden">
                  <Text
                    fontSize="sm"
                    fontWeight="medium"
                    mb={1}
                  >
                    {currentUser?.firstName} {currentUser?.lastName}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {currentUser?.role || 'User'}
                  </Text>
                </Box>
              </Flex>

              <Popover placement="top-end" closeOnBlur={true}>
                <PopoverTrigger>
                  <IconButton
                    aria-label="User settings"
                    icon={<Icon as={FiSettings} color="gray.600" />}
                    variant="ghost"
                    size="sm"
                    _hover={{
                      bg: 'gray.100'
                    }}
                  />
                </PopoverTrigger>
                <Portal>
                  <PopoverContent width="200px" shadow="lg" borderRadius="md" _focus={{ outline: "none" }} bg="white">
                    <PopoverArrow bg="white" />
                    <PopoverHeader borderBottomWidth="1px" borderBottomColor="gray.200" fontWeight="semibold" py={3} px={4} color="#0F3151">
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
                          onClick={() => navigate('/profile')}
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
                          onClick={() => navigate('/settings')}
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
              </Popover>
            </>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

const MainLayout = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { currentUser, logout: authLogout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Mobile navigation drawer */}
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="xs"
      >
        <DrawerContent>
          <SidebarContent 
            currentUser={currentUser} 
            logout={authLogout} 
            isCollapsed={false} 
            w="full" 
            borderRight="none" 
            navigate={navigate}
          />
        </DrawerContent>
      </Drawer>

      {/* Desktop sidebar */}
      <SidebarContent
        currentUser={currentUser}
        logout={authLogout}
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
        display={{ base: 'none', md: 'block' }}
        w={isCollapsed ? "70px" : "283px"}
        position="fixed"
        h="full"
        navigate={navigate}
      />

      {/* Main content area */}
      <Box
        ml={{ base: 0, md: isCollapsed ? "70px" : "283px" }}
        transition="margin-left 0.3s"
      >
        {/* Mobile header with menu button */}
        <Flex
          as="header"
          align="center"
          justify="space-between"
          w="full"
          px="4"
          bg="white"
          borderBottomWidth="1px"
          borderColor="gray.200"
          h="14"
          display={{ base: 'flex', md: 'none' }}
        >
          <IconButton
            aria-label="Open Menu"
            icon={<HamburgerIcon />}
            onClick={onOpen}
            variant="outline"
          />

          {/* Mobile logo */}
          <Box maxW="140px">
            <Image
              src="/Brightrock.png"
              alt="BrightRock Logo"
              width="100%"
              height="auto"
              objectFit="contain"
            />
          </Box>

          {/* Mobile user menu */}
          <Popover placement="bottom-end" closeOnBlur={true}>
            <PopoverTrigger>
              <IconButton
                aria-label="User settings"
                icon={<Icon as={FiSettings} color="gray.600" />}
                variant="ghost"
                size="sm"
                _hover={{
                  bg: 'gray.100'
                }}
              />
            </PopoverTrigger>
            <Portal>
              <PopoverContent width="200px" shadow="lg" borderRadius="md" _focus={{ outline: "none" }} bg="white">
                <PopoverArrow bg="white" />
                <PopoverHeader borderBottomWidth="1px" borderBottomColor="gray.200" fontWeight="semibold" py={3} px={4} color="gray.700">
                  User Options
                </PopoverHeader>
                <PopoverBody p={0}>
                  <VStack align="stretch" spacing={0}>
                    <Button
                      variant="ghost"
                      justifyContent="flex-start"
                      leftIcon={<Icon as={FiUser} color="gray.600" />}
                      py={3}
                      borderRadius={0}
                      onClick={() => navigate('/profile')}
                      color="gray.700"
                      _hover={{ bg: 'gray.50' }}
                    >
                      My Account
                    </Button>
                    <Button
                      variant="ghost"
                      justifyContent="flex-start"
                      leftIcon={<Icon as={FiSettings} color="gray.600" />}
                      py={3}
                      borderRadius={0}
                      onClick={() => navigate('/settings')}
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
                      onClick={authLogout}
                      color="red.500"
                      _hover={{ bg: 'red.50' }}
                    >
                      Logout
                    </Button>
                  </VStack>
                </PopoverBody>
              </PopoverContent>
            </Portal>
          </Popover>
        </Flex>

        {/* Page content */}
        <Box pt={{ base: 4, md: 2 }} px={4}>
          <Box mb={5}>
            <Outlet />
          </Box>

          {/* Footer */}
          <HStack
            as="footer"
            mt="8"
            py="4"
            borderTop="1px"
            borderColor="gray.200"
            justify="center"
          >
            <Text fontSize="sm" color="gray.600">
              {new Date().getFullYear()} BrightRock Efficiency Platform. All rights reserved.
            </Text>
          </HStack>
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
