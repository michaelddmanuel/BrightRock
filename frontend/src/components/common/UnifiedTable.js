import React from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Flex,
  Icon,
  Badge,
  Checkbox,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Skeleton,
  Portal,
  TableContainer, // Import TableContainer
  useColorModeValue, // Import useColorModeValue
} from '@chakra-ui/react';
import { FiMoreVertical, FiChevronDown } from 'react-icons/fi';

/**
 * UnifiedTable - A standardized table component following Untitled UI design principles
 * 
 * @param {Object} props
 * @param {Array} props.columns - Column definitions with at least { key, header } properties
 * @param {Array} props.data - Data array to display in the table
 * @param {Boolean} props.isSelectable - Whether rows can be selected with checkboxes
 * @param {Array} props.selectedRows - Array of selected row indices
 * @param {Function} props.onSelectRow - Callback when a row is selected/deselected
 * @param {Function} props.onSelectAll - Callback when all rows are selected/deselected
 * @param {Function} props.onRowAction - Callback when a row action is triggered
 * @param {Array} props.actions - Available actions for rows [{label, action}]
 * @param {Boolean} props.isLoading - Whether the table is in loading state
 */
const UnifiedTable = ({
  columns,
  data,
  isSelectable = false,
  selectedRows = [],
  onSelectRow,
  onSelectAll,
  onRowAction,
  actions = [],
  isLoading = false,
  onRowClick,
}) => {
  // Check if all rows are selected
  const allSelected = data.length > 0 && selectedRows.length === data.length;
  const tableContainerBg = useColorModeValue('white', 'gray.700'); // Use theme background
  const theadBg = useColorModeValue('gray.50', 'gray.800'); // Use theme background for header

  // Handle row selection
  const handleSelectRow = (index) => {
    if (onSelectRow) {
      onSelectRow(index);
    }
  };
  
  // Handle select all
  const handleSelectAll = () => {
    if (onSelectAll) {
      onSelectAll(!allSelected);
    }
  };
  
  // Get status badge styling
  const getStatusBadge = (status) => {
    let colorScheme;
    switch(status?.toLowerCase()) {
      case 'active':
      case 'completed':
      case 'approved':
        colorScheme = 'green';
        break;
      case 'pending':
      case 'in progress':
      case 'in-progress':
        colorScheme = 'blue';
        break;
      case 'inactive':
      case 'cancelled':
      case 'failed':
        colorScheme = 'red';
        break;
      default:
        colorScheme = 'gray';
    }
    
    return (
      <Badge 
        colorScheme={colorScheme} 
        fontSize="xs" 
        fontWeight="medium" 
        borderRadius="full" 
        px={2.5} 
        py={0.5}
      >
        {typeof status === 'string' ? status.charAt(0).toUpperCase() + status.slice(1) : status}
      </Badge>
    );
  };
  
  // Render a cell based on its type
  const renderCell = (column, item) => {
    const value = item[column.key];
    
    if (column.render) {
      return column.render(item);
    }
    
    if (column.type === 'status') {
      return getStatusBadge(value);
    }
    
    if (column.type === 'date') {
      return <Text>{new Date(value).toLocaleDateString()}</Text>;
    }
    
    if (column.type === 'datetime') {
      return <Text>{new Date(value).toLocaleString()}</Text>;
    }
    
    return <Text>{value}</Text>;
  };

  return (
    <TableContainer bg={tableContainerBg} borderRadius="lg" shadow="sm" borderWidth="1px" borderColor={useColorModeValue('gray.200', 'gray.600')}>
      <Table variant="simple" width="100%"> {/* Remove inline styles */}
        <Thead bg={theadBg}> {/* Use theme background */}
          <Tr>
            {isSelectable && (
              <Th py={4} px={4} width="40px">
                <Checkbox
                  isChecked={allSelected}
                  onChange={handleSelectAll}
                  colorScheme="blue"
                />
              </Th>
            )}
            
            {columns.map((column, index) => (
              <Th 
                key={index}
                py={4} 
                px={4}
                fontSize="xs" 
                fontWeight="medium"
                textTransform="uppercase" 
                color="gray.600"
                letterSpacing="0.5px"
              >
                {column.header}
              </Th>
            ))}
            
            {actions.length > 0 && (
              <Th
                py={4}
                px={4}
                width="80px"
                fontSize="xs"
                textTransform="uppercase" 
                color="gray.600"
                textAlign="right"
              >
                Actions
              </Th>
            )}
          </Tr>
        </Thead>
        
        <Tbody>
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <Tr key={i}>
                {isSelectable && <Td px={4} py={4}><Skeleton height="20px" width="20px" /></Td>}
                {columns.map((_, colIndex) => (
                  <Td key={colIndex} px={4} py={4}><Skeleton height="20px" width="120px" /></Td>
                ))}
                {actions.length > 0 && <Td px={4} py={4}><Skeleton height="20px" width="80px" /></Td>}
              </Tr>
            ))
          ) : data.length === 0 ? (
            <Tr>
              <Td colSpan={isSelectable ? columns.length + 2 : columns.length + 1} textAlign="center" py={8}>
                <Text color="gray.500">No data available</Text>
              </Td>
            </Tr>
          ) : (
            data.map((row, rowIndex) => (
              <Tr 
                key={rowIndex}
                _hover={{ bg: "#F7FAFC" }}
                cursor="pointer"
                onClick={() => onRowClick && onRowClick(row)}
              >
                {isSelectable && (
                  <Td px={4} py={4}>
                    <Checkbox
                      isChecked={selectedRows.includes(rowIndex)}
                      onChange={() => handleSelectRow(rowIndex)}
                      colorScheme="blue"
                    />
                  </Td>
                )}
                
                {columns.map((column) => (
                  <Td 
                    key={`${row.id || rowIndex}-${column.key}`}
                    py={4}
                    px={4}
                    fontSize="sm"
                  >
                    {renderCell(column, row)}
                  </Td>
                ))}
                
                {actions.length > 0 && (
                  <Td py={4} px={4} textAlign="right">
                    <Menu placement="bottom-end" closeOnSelect>
                      <MenuButton
                        as={IconButton}
                        aria-label="Options"
                        icon={<FiMoreVertical color="#0F3151" />}
                        variant="ghost"
                        size="sm"
                        borderRadius="full"
                        _hover={{ bg: 'gray.100' }}
                      />
                      <Portal>
                        <MenuList 
                          minWidth="160px" 
                          shadow="lg" 
                          borderRadius="md" 
                          py={2}
                          borderColor="gray.200"
                          border="1px solid"
                          bg="white"
                          color="gray.700"
                          zIndex={10}
                        >
                          {actions.map((action, actionIndex) => (
                            <MenuItem 
                              key={actionIndex}
                              onClick={() => onRowAction(action.action, row, rowIndex)}
                              py={2}
                              fontSize="sm"
                              bg="white"
                              color={action.action === 'delete' ? "red.500" : "gray.700"}
                              _hover={{ bg: action.action === 'delete' ? 'red.50' : '#F7FAFC' }}
                              icon={action.icon && <Icon as={action.icon} fontSize="14px" color={action.action === 'delete' ? "red.500" : "#0F3151"} />}
                            >
                              {action.label}
                            </MenuItem>
                          ))}
                        </MenuList>
                      </Portal>
                    </Menu>
                  </Td>
                )}
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
    </TableContainer> // Close TableContainer
  );
};

export default UnifiedTable;
