import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Checkbox,
  VStack,
  HStack,
  Box,
  FormHelperText,
  InputGroup,
  InputLeftAddon,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
  FormErrorMessage,
  Switch,
} from '@chakra-ui/react';

const AddTrainingModal = ({ isOpen, onClose, trainingToEdit, onTrainingChange }) => {
  const initialFormState = {
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    instructor: '',
    category: '',
    type: 'In-Person',
    mandatory: false,
    totalSeats: 30,
    registrationDeadline: '',
    level: 'All Levels',
    prerequisites: '',
    imageUrl: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const toast = useToast();

  useEffect(() => {
    if (trainingToEdit) {
      setFormData(trainingToEdit);
    } else {
      setFormData(initialFormState);
    }
  }, [trainingToEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const handleNumberChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const handleSubmit = async () => {
    // Validate form
    const newErrors = {};
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (formData.type !== 'Virtual' && !formData.location) newErrors.location = 'Location is required';
    if (!formData.instructor) newErrors.instructor = 'Instructor is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.registrationDeadline) newErrors.registrationDeadline = 'Registration deadline is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Process the form data to match expected data structure
      const newTraining = {
        ...formData,
        id: trainingToEdit ? trainingToEdit.id : Math.floor(Math.random() * 1000) + 200, // Keep existing ID if editing
        status: trainingToEdit?.status || 'scheduled',
        attendees: trainingToEdit?.attendees || 0,
        capacity: parseInt(formData.totalSeats),
        isMandatory: formData.mandatory,
        facilitatorName: formData.instructor,
        isVirtual: formData.type === 'Virtual',
      };
      
      // Call the parent component's handler with the new training data
      onTrainingChange(newTraining);
      
      // Reset form
      setFormData(initialFormState);
      setErrors({});
      
      // Close modal
      onClose();
      
      // Show success toast
      toast({
        title: trainingToEdit ? 'Training Updated' : 'Training Added',
        description: trainingToEdit ? 'The training session has been successfully updated.' : 'The training session has been successfully added.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: 'Error',
        description: 'There was an error processing your request. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent borderRadius="lg" boxShadow="xl">
        <ModalHeader color="sasol.gray.900" borderBottomWidth="1px" borderBottomColor="sasol.gray.200" py={4}>{trainingToEdit ? 'Edit Training Session' : 'Add New Training Session'}</ModalHeader>
        <ModalCloseButton color="sasol.gray.700" />
        <ModalBody py={5}>
          <VStack spacing={5} align="stretch">
            <FormControl isRequired isInvalid={errors.title}>
              <FormLabel color="sasol.gray.800" fontWeight="medium" _required={{ color: "red.500" }}>Training Title</FormLabel>
              <Input 
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                placeholder="e.g. Safety Procedures and Protocols"
                borderColor="sasol.gray.300"
                _placeholder={{ color: 'sasol.gray.500' }}
                color="sasol.gray.800"
                _hover={{ borderColor: 'sasol.gray.400' }}
                _focus={{ borderColor: 'sasol.primary', boxShadow: '0 0 0 1px #0F3151' }}
              />
              {errors.title && <FormErrorMessage color="red.600">{errors.title}</FormErrorMessage>}
            </FormControl>

            <FormControl isRequired isInvalid={errors.description}>
              <FormLabel color="sasol.gray.800" fontWeight="medium" _required={{ color: "red.500" }}>Description</FormLabel>
              <Textarea 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                placeholder="Provide a detailed description of the training..."
                rows={3}
                borderColor="sasol.gray.300"
                _placeholder={{ color: 'sasol.gray.500' }}
                color="sasol.gray.800"
                _hover={{ borderColor: 'sasol.gray.400' }}
                _focus={{ borderColor: 'sasol.primary', boxShadow: '0 0 0 1px #0F3151' }}
              />
              {errors.description && <FormErrorMessage color="red.600">{errors.description}</FormErrorMessage>}
            </FormControl>

            <HStack spacing={4} alignItems="flex-start">
              <FormControl isRequired isInvalid={errors.startDate}>
                <FormLabel color="sasol.gray.800" fontWeight="medium" _required={{ color: "red.500" }}>Start Date & Time</FormLabel>
                <Input 
                  name="startDate" 
                  type="datetime-local" 
                  value={formData.startDate} 
                  onChange={handleChange} 
                  borderColor="sasol.gray.300"
                  color="sasol.gray.800"
                  _hover={{ borderColor: 'sasol.gray.400' }}
                  _focus={{ borderColor: 'sasol.primary', boxShadow: '0 0 0 1px #0F3151' }}
                />
                {errors.startDate && <FormErrorMessage color="red.600">{errors.startDate}</FormErrorMessage>}
              </FormControl>

              <FormControl isRequired isInvalid={errors.endDate}>
                <FormLabel color="sasol.gray.800" fontWeight="medium" _required={{ color: "red.500" }}>End Date & Time</FormLabel>
                <Input 
                  name="endDate" 
                  type="datetime-local" 
                  value={formData.endDate} 
                  onChange={handleChange}
                  borderColor="sasol.gray.300"
                  color="sasol.gray.800"
                  _hover={{ borderColor: 'sasol.gray.400' }}
                  _focus={{ borderColor: 'sasol.primary', boxShadow: '0 0 0 1px #0F3151' }}
                />
                {errors.endDate && <FormErrorMessage color="red.600">{errors.endDate}</FormErrorMessage>}
              </FormControl>
            </HStack>

            <FormControl isRequired isInvalid={errors.type}>
              <FormLabel color="sasol.gray.800" fontWeight="medium" _required={{ color: "red.500" }}>Training Type</FormLabel>
              <Select 
                name="type" 
                value={formData.type} 
                onChange={handleChange}
                borderColor="sasol.gray.300"
                color="sasol.gray.800"
                _hover={{ borderColor: 'sasol.gray.400' }}
                _focus={{ borderColor: 'sasol.primary', boxShadow: '0 0 0 1px #0F3151' }}
              >
                <option value="In-Person">In-Person</option>
                <option value="Virtual">Virtual</option>
                <option value="Hybrid">Hybrid</option>
              </Select>
            </FormControl>

            <FormControl isRequired={formData.type !== 'Virtual'} isInvalid={errors.location}>
              <FormLabel color="sasol.gray.800" fontWeight="medium" _required={{ color: "red.500" }}>Location</FormLabel>
              <Input 
                name="location" 
                value={formData.location} 
                onChange={handleChange} 
                placeholder={formData.type === 'Virtual' ? 'e.g. Microsoft Teams (optional)' : 'e.g. Training Center A'}
                borderColor="sasol.gray.300"
                _placeholder={{ color: 'sasol.gray.500' }}
                color="sasol.gray.800"
                _hover={{ borderColor: 'sasol.gray.400' }}
                _focus={{ borderColor: 'sasol.primary', boxShadow: '0 0 0 1px #0F3151' }}
              />
              {errors.location && <FormErrorMessage color="red.600">{errors.location}</FormErrorMessage>}
              {formData.type === 'Virtual' && (
                <FormHelperText color="sasol.gray.600">Optional for virtual trainings</FormHelperText>
              )}
            </FormControl>

            <HStack spacing={4} alignItems="flex-start">
              <FormControl isRequired isInvalid={errors.instructor}>
                <FormLabel color="sasol.gray.800" fontWeight="medium" _required={{ color: "red.500" }}>Instructor</FormLabel>
                <Input 
                  name="instructor" 
                  value={formData.instructor} 
                  onChange={handleChange} 
                  placeholder="e.g. Dr. Sarah Johnson"
                  borderColor="sasol.gray.300"
                  _placeholder={{ color: 'sasol.gray.500' }}
                  color="sasol.gray.800"
                  _hover={{ borderColor: 'sasol.gray.400' }}
                  _focus={{ borderColor: 'sasol.primary', boxShadow: '0 0 0 1px #0F3151' }}
                />
                {errors.instructor && <FormErrorMessage color="red.600">{errors.instructor}</FormErrorMessage>}
              </FormControl>

              <FormControl isRequired isInvalid={errors.category}>
                <FormLabel color="sasol.gray.800" fontWeight="medium" _required={{ color: "red.500" }}>Category</FormLabel>
                <Select 
                  name="category" 
                  value={formData.category} 
                  onChange={handleChange}
                  placeholder="Select category"
                  borderColor="sasol.gray.300"
                  color="sasol.gray.800"
                  _hover={{ borderColor: 'sasol.gray.400' }}
                  _focus={{ borderColor: 'sasol.primary', boxShadow: '0 0 0 1px #0F3151' }}
                >
                  <option value="Safety">Safety</option>
                  <option value="Compliance">Compliance</option>
                  <option value="Technical">Technical</option>
                  <option value="Professional Development">Professional Development</option>
                  <option value="Emergency">Emergency</option>
                  <option value="Leadership">Leadership</option>
                  <option value="Other">Other</option>
                </Select>
                {errors.category && <FormErrorMessage color="red.600">{errors.category}</FormErrorMessage>}
              </FormControl>
            </HStack>

            <HStack spacing={4} alignItems="flex-start">
              <FormControl isRequired isInvalid={errors.registrationDeadline}>
                <FormLabel color="sasol.gray.800" fontWeight="medium" _required={{ color: "red.500" }}>Registration Deadline</FormLabel>
                <Input 
                  name="registrationDeadline" 
                  type="date" 
                  value={formData.registrationDeadline} 
                  onChange={handleChange} 
                  borderColor="sasol.gray.300"
                  color="sasol.gray.800"
                  _hover={{ borderColor: 'sasol.gray.400' }}
                  _focus={{ borderColor: 'sasol.primary', boxShadow: '0 0 0 1px #0F3151' }}
                />
                {errors.registrationDeadline && <FormErrorMessage color="red.600">{errors.registrationDeadline}</FormErrorMessage>}
              </FormControl>

              <FormControl>
                <FormLabel color="sasol.gray.800" fontWeight="medium">Level</FormLabel>
                <Select name="level" value={formData.level} onChange={handleChange}>
                  <option value="All Levels">All Levels</option>
                  <option value="Basic">Basic</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </Select>
              </FormControl>
            </HStack>

            <FormControl>
              <FormLabel color="sasol.gray.800" fontWeight="medium">Capacity</FormLabel>
              <NumberInput 
                min={1} 
                max={500} 
                defaultValue={30}
                value={formData.totalSeats}
                onChange={(valueString) => handleNumberChange('totalSeats', parseInt(valueString))}
                borderColor="sasol.gray.300"
                color="sasol.gray.800"
                _hover={{ borderColor: 'sasol.gray.400' }}
                _focus={{ borderColor: 'sasol.primary', boxShadow: '0 0 0 1px #0F3151' }}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <FormHelperText color="sasol.gray.600">Maximum number of participants</FormHelperText>
            </FormControl>

            <FormControl>
              <FormLabel color="sasol.gray.800" fontWeight="medium">Prerequisites (comma separated)</FormLabel>
              <Input 
                name="prerequisites" 
                value={formData.prerequisites} 
                onChange={handleChange} 
                placeholder="e.g. Basic Safety Orientation, 2+ years in technical role"
                borderColor="sasol.gray.300"
                _placeholder={{ color: 'sasol.gray.500' }}
                color="sasol.gray.800"
                _hover={{ borderColor: 'sasol.gray.400' }}
                _focus={{ borderColor: 'sasol.primary', boxShadow: '0 0 0 1px #0F3151' }}
              />
              <FormHelperText color="sasol.gray.600">Leave blank if none</FormHelperText>
            </FormControl>

            <FormControl>
              <FormLabel color="sasol.gray.800" fontWeight="medium">Image URL</FormLabel>
              <Input 
                name="imageUrl" 
                value={formData.imageUrl} 
                onChange={handleChange} 
                placeholder="https://example.com/image.jpg"
                borderColor="sasol.gray.300"
                _placeholder={{ color: 'sasol.gray.500' }}
                color="sasol.gray.800"
                _hover={{ borderColor: 'sasol.gray.400' }}
                _focus={{ borderColor: 'sasol.primary', boxShadow: '0 0 0 1px #0F3151' }}
              />
              <FormHelperText color="sasol.gray.600">Optional - URL to training image</FormHelperText>
            </FormControl>

            <FormControl display="flex" alignItems="center">
              <Switch 
                id="mandatory" 
                name="mandatory"
                isChecked={formData.mandatory}
                onChange={handleChange}
                colorScheme="red"
                mr={3}
              />
              <FormLabel htmlFor="mandatory" mb={0} color="sasol.gray.800" fontWeight="medium">This is a mandatory training</FormLabel>
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter borderTopWidth="1px" borderTopColor="sasol.gray.200" py={4}>
          <Button 
            variant="outline" 
            mr={3} 
            onClick={onClose}
            color="sasol.gray.700"
            borderColor="sasol.gray.300"
            _hover={{ bg: 'sasol.gray.100', borderColor: 'sasol.gray.400' }}
          >
            Cancel
          </Button>
          <Button 
            bg="sasol.primary"
            color="white"
            _hover={{ bg: 'sasol.primaryDark' }}
            _active={{ bg: 'sasol.primaryDarker' }}
            onClick={handleSubmit}
            isLoading={isLoading}
          >
            {trainingToEdit ? 'Update Training' : 'Add Training'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddTrainingModal;
