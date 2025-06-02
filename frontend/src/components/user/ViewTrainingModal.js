import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  HStack,
  Box,
  Heading,
  Text,
  Badge,
  Icon,
  SimpleGrid,
  Progress
} from '@chakra-ui/react';
import { FiCalendar, FiClock, FiMapPin } from 'react-icons/fi';

const ViewTrainingModal = ({ isOpen, onClose, training }) => {
  if (!training) return null;
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent bg="white">
        <ModalHeader color="gray.800">
          {training.title}
          {training.mandatory && (
            <Badge colorScheme="red" ml={2}>
              Mandatory
            </Badge>
          )}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack align="stretch" spacing={4}>
            {training.imageUrl && (
              <Box
                bgImage={`url(${training.imageUrl})`}
                bgSize="cover"
                bgPosition="center"
                borderRadius="md"
                height="200px"
                mb={4}
              />
            )}
            
            <Box>
              <Heading size="sm" mb={1} color="gray.800">Description</Heading>
              <Text color="gray.700">{training.description}</Text>
            </Box>
            
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <Box>
                <Heading size="sm" mb={1} color="gray.800">Date & Time</Heading>
                <HStack>
                  <Icon as={FiCalendar} color="gray.500" />
                  <Text>
                    {new Date(training.startDate).toLocaleDateString()} - {new Date(training.endDate).toLocaleDateString()}
                  </Text>
                </HStack>
                <HStack mt={1}>
                  <Icon as={FiClock} color="gray.500" />
                  <Text>
                    {new Date(training.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(training.endDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </Text>
                </HStack>
              </Box>
              
              <Box>
                <Heading size="sm" mb={1} color="gray.800">Location</Heading>
                <HStack>
                  <Icon as={FiMapPin} color="gray.500" />
                  <Text>
                    {training.type === 'Virtual' ? 'Virtual (Online)' : training.location}
                  </Text>
                </HStack>
              </Box>
              
              <Box>
                <Heading size="sm" mb={1} color="gray.800">Instructor</Heading>
                <Text color="gray.700">{training.instructor}</Text>
              </Box>
              
              <Box>
                <Heading size="sm" mb={1} color="gray.800">Category</Heading>
                <Badge>{training.category}</Badge>
              </Box>
              
              <Box>
                <Heading size="sm" mb={1} color="gray.800">Type</Heading>
                <Badge colorScheme={training.type === 'Virtual' ? 'purple' : 'blue'}>
                  {training.type}
                </Badge>
              </Box>
              
              <Box>
                <Heading size="sm" mb={1} color="gray.800">Level</Heading>
                <Text color="gray.700">{training.level}</Text>
              </Box>
              
              <Box>
                <Heading size="sm" mb={1} color="gray.800">Duration</Heading>
                <Text color="gray.700">{training.duration}</Text>
              </Box>
              
              <Box>
                <Heading size="sm" mb={1} color="gray.800">Capacity</Heading>
                <Text color="gray.700">{training.availableSeats} available / {training.totalSeats} total</Text>
                {training.status === 'upcoming' && (
                  <Progress 
                    value={((training.totalSeats - training.availableSeats) / training.totalSeats) * 100} 
                    size="xs" 
                    colorScheme={training.availableSeats < 5 ? "red" : "green"} 
                    mt={1}
                  />
                )}
              </Box>
            </SimpleGrid>
            
            {training.prerequisites && training.prerequisites.length > 0 && (
              <Box>
                <Heading size="sm" mb={1} color="gray.800">Prerequisites</Heading>
                {training.prerequisites.map((prereq, index) => (
                  <Badge key={index} mr={2} mb={2} colorScheme="yellow">
                    {prereq}
                  </Badge>
                ))}
              </Box>
            )}
            
            <Box>
              <Heading size="sm" mb={1} color="gray.800">Registration Deadline</Heading>
              <Text color="gray.700">{new Date(training.registrationDeadline).toLocaleDateString()}</Text>
            </Box>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Close
          </Button>
          {training.status === 'upcoming' && training.availableSeats > 0 && (
            <Button colorScheme="green">
              Register for Training
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ViewTrainingModal;
