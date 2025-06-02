import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  Button, // Keep for specific modal buttons if needed
  Flex,
  Icon,
  Input,
  Select,
  HStack,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  InputGroup,
  InputLeftElement,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Skeleton,
  Stack,
  Alert,
  AlertIcon,
  Avatar,
  VStack,
  Switch,
  FormControl,
  FormLabel,
  IconButton,
  Portal,
  // useColorModeValue removed - using light mode only
} from '@chakra-ui/react';
import {
  FiSearch,
  FiPlus,
  FiDownload,
  FiMoreVertical,
  FiUser,
  FiTrash2,
  FiEdit2,
  FiUsers,
  FiUserPlus,
  FiFilter,
  FiRefreshCw,
  FiMail,
  FiPhone,
  FiBriefcase
} from 'react-icons/fi';

import api from '../../services/api';
import { UnifiedTable } from '../../components/common'; // Use common UnifiedTable
import PageHeader from '../../components/common/PageHeader'; // Use common PageHeader
import Card from '../../components/common/Card'; // Use common Card
import ActionButton from '../../components/common/ActionButton'; // Use ActionButton
// Removed TableToolbar import, assuming filtering/search is handled directly or within PageHeader actions

const UserManagementPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen: isEditModalOpen, onOpen: onEditModalOpen, onClose: onEditModalClose } = useDisclosure(); // Renamed for clarity

  // State
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]); // Assuming UnifiedTable handles selection state internally if needed
  const [currentUserToEdit, setCurrentUserToEdit] = useState(null); // Renamed for clarity
  const [error, setError] = useState(null); // Added missing error state

  // Theme colors - fixed to light mode values only
  const headingColor = 'sasol.primary';
  const textColor = 'gray.600';
  const iconColor = 'gray.400';
  const inputFocusBorderColor = 'sasol.primary';
  const inputBorderColor = 'gray.300';
  const errorBg = 'red.50';
  const errorColor = 'red.500';

  // Fetch users (keeping existing mock logic)
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setTimeout(() => {
        const mockUsers = [
          { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@sasol.com', phone: '+27123456789', role: 'admin', department: 'IT', status: 'active', lastLogin: '2024-05-15T08:30:00Z', companyName: 'Sasol', avatarUrl: '' },
          { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@sasol.com', phone: '+27123456790', role: 'user', department: 'Operations', status: 'active', lastLogin: '2024-05-10T10:15:00Z', companyName: 'Sasol', avatarUrl: '' },
          { id: 3, firstName: 'Michael', lastName: 'Johnson', email: 'michael.johnson@contractor.com', phone: '+27123456791', role: 'instructor', department: 'Safety', status: 'inactive', lastLogin: '2024-04-20T14:45:00Z', companyName: 'Safety Contractors Ltd', avatarUrl: '' },
          { id: 4, firstName: 'Sarah', lastName: 'Williams', email: 'sarah.williams@sasol.com', phone: '+27123456792', role: 'user', department: 'HR', status: 'active', lastLogin: '2024-05-14T09:20:00Z', companyName: 'Sasol', avatarUrl: '' },
          { id: 5, firstName: 'Robert', lastName: 'Brown', email: 'robert.brown@sasol.com', phone: '+27123456793', role: 'admin', department: 'Finance', status: 'active', lastLogin: '2024-05-13T16:10:00Z', companyName: 'Sasol', avatarUrl: '' },
        ];
        setUsers(mockUsers);
        setIsLoading(false);
      }, 1000);
    };
    fetchUsers();
  }, []);

  // Filter users based on search and role
  const filteredUsers = users.filter(user => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const matchesSearch = !searchTerm || fullName.includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesFilter;
  });

  // Open edit/create modal
  const handleOpenModal = (user = null) => {
    setCurrentUserToEdit(user);
    onEditModalOpen();
  };

  // Delete user (simplified, no confirmation for brevity)
  const handleDeleteUser = (userId) => {
    // Simulate API call
    setUsers(users.filter(user => user.id !== userId));
    toast({ title: 'User deleted', status: 'success', duration: 3000, isClosable: true });
  };

  // Handle saving user from modal
  const handleSaveUser = (userData) => {
     // Simulate API call
     if (currentUserToEdit) { // Update
        setUsers(users.map(u => u.id === currentUserToEdit.id ? { ...u, ...userData } : u));
        toast({ title: 'User Updated', status: 'success', duration: 3000, isClosable: true });
     } else { // Create
        const newUser = { ...userData, id: Math.random().toString(36).substr(2, 9), status: 'active', lastLogin: new Date().toISOString() }; // Add default fields
        setUsers([newUser, ...users]);
        toast({ title: 'User Created', status: 'success', duration: 3000, isClosable: true });
     }
     onEditModalClose();
  };


  // Table columns definition
  const columns = [
    { key: 'name', header: 'Name', render: (user) => (
        <HStack spacing={3}>
          <Avatar size="sm" name={`${user.firstName} ${user.lastName}`} src={user.avatarUrl} bg="brand.500" color="white" />
          <Box>
            <Text fontWeight="medium">{user.firstName} {user.lastName}</Text>
            <Text fontSize="xs" color={textColor}>{user.email}</Text>
          </Box>
        </HStack>
    )},
    { key: 'department', header: 'Department' },
    { key: 'role', header: 'Role', render: (user) => (
        <Badge colorScheme={user.role === 'admin' ? 'purple' : user.role === 'instructor' ? 'blue' : 'gray'} variant="subtle">
          {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
        </Badge>
    )},
    { key: 'status', header: 'Status', type: 'status' }, // Let UnifiedTable handle status badge
    { key: 'companyName', header: 'Company' },
    { key: 'lastLogin', header: 'Last Active', type: 'datetime' }, // Let UnifiedTable handle formatting
  ];

  // Row actions
  const rowActions = [
    { label: 'Edit', action: 'edit', icon: FiEdit2 },
    { label: 'Delete', action: 'delete', icon: FiTrash2 },
  ];

  // Filter options
  const filterOptions = [
    { label: 'All Roles', value: 'all' },
    { label: 'Admins', value: 'admin' },
    { label: 'Instructors', value: 'instructor' },
    { label: 'Users', value: 'user' },
  ];

  return (
    <Box>
      <PageHeader
        title="User Management"
        subtitle="View and manage system users and their permissions"
        actions={
          <HStack>
            <ActionButton
              label="Export Users"
              icon={<Icon as={FiDownload} />}
              variant="outline"
              onClick={() => console.log('Export users')}
            />
            <ActionButton
              label="Add New User"
              icon={<Icon as={FiUserPlus} />}
              onClick={() => handleOpenModal()} // Open modal without user data for creation
            />
          </HStack>
        }
      />

      {error && (
        <Alert status="error" mb={6} borderRadius="md">
          <AlertIcon /> {error}
        </Alert>
      )}

      {/* Filters and Search Card */}
      <Card mb={6}>
        <Flex wrap="wrap" gap={4} align="center">
          <InputGroup flex={{ base: '1 1 100%', md: 1 }}>
            <InputLeftElement pointerEvents="none">
              <Icon as={FiSearch} color={iconColor} />
            </InputLeftElement>
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              borderRadius="md"
              borderColor={inputBorderColor}
              _hover={{ borderColor: inputFocusBorderColor }}
              _focus={{ borderColor: inputFocusBorderColor, boxShadow: `0 0 0 1px ${inputFocusBorderColor}` }}
            />
          </InputGroup>
          <Select
            placeholder="Filter by Role"
            icon={<Icon as={FiFilter} />}
            width={{ base: '100%', md: 'auto' }}
            minW={{ md: '180px' }}
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            borderRadius="md"
            borderColor={inputBorderColor}
            _hover={{ borderColor: inputFocusBorderColor }}
            _focus={{ borderColor: inputFocusBorderColor, boxShadow: `0 0 0 1px ${inputFocusBorderColor}` }}
          >
            {filterOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </Select>
          {/* Add more filters if needed */}
        </Flex>
      </Card>

      {/* User Table */}
      <UnifiedTable
        columns={columns}
        data={filteredUsers}
        // isSelectable={true} // Add back if bulk actions are needed
        // selectedRows={selectedUsers}
        // onSelectRow={handleSelectRow}
        // onSelectAll={handleSelectAll}
        onRowAction={(action, user) => { // Simplified action handler
            if (action === 'edit') handleOpenModal(user);
            if (action === 'delete') handleDeleteUser(user.id);
        }}
        actions={rowActions}
        isLoading={isLoading}
      />

      {/* Edit/Create User Modal */}
      <Modal isOpen={isEditModalOpen} onClose={onEditModalClose} size="lg">
        <ModalOverlay />
        <ModalContent as="form" onSubmit={(e) => {
             e.preventDefault();
             // Extract form data and call handleSaveUser
             const formData = new FormData(e.currentTarget);
             const userData = Object.fromEntries(formData.entries());
             // TODO: Add proper validation and data transformation if needed
             handleSaveUser(userData);
        }}>
          <ModalHeader>{currentUserToEdit ? 'Edit User' : 'Create New User'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4} align="stretch">
              <HStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>First Name</FormLabel>
                  <Input name="firstName" defaultValue={currentUserToEdit?.firstName || ''} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Last Name</FormLabel>
                  <Input name="lastName" defaultValue={currentUserToEdit?.lastName || ''} />
                </FormControl>
              </HStack>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input name="email" type="email" defaultValue={currentUserToEdit?.email || ''} />
              </FormControl>
              <FormControl>
                <FormLabel>Phone Number</FormLabel>
                <Input name="phoneNumber" type="tel" defaultValue={currentUserToEdit?.phone || ''} />
              </FormControl>
              <FormControl>
                <FormLabel>Company Name</FormLabel>
                <Input name="companyName" defaultValue={currentUserToEdit?.companyName || ''} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Role</FormLabel>
                <Select name="role" defaultValue={currentUserToEdit?.role || 'user'}>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="instructor">Instructor</option>
                  {/* Add other roles */}
                </Select>
              </FormControl>
              {/* Add password fields only for create mode */}
              {!currentUserToEdit && (
                 <FormControl isRequired>
                    <FormLabel>Password</FormLabel>
                    <Input name="password" type="password" placeholder="Enter initial password" />
                 </FormControl>
              )}
               {/* Add status toggle if needed */}
               {/* <FormControl display="flex" alignItems="center">
                 <FormLabel htmlFor="user-status" mb="0">Active Status</FormLabel>
                 <Switch id="user-status" name="status" defaultChecked={currentUserToEdit?.status === 'active'} />
               </FormControl> */}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onEditModalClose}>Cancel</Button>
            <ActionButton
              type="submit"
              label={currentUserToEdit ? 'Save Changes' : 'Create User'}
              isLoading={isLoading} // Need separate loading state for modal form
            />
          </ModalFooter>
        </ModalContent>
      </Modal>

    </Box>
  );
};

export default UserManagementPage;
