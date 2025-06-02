import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  Button,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Textarea,
  Card,
  CardBody,
  Divider,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Progress,
  useToast,
  HStack,
  Flex,
  Icon,
  Radio,
  RadioGroup,
  SimpleGrid,
} from '@chakra-ui/react';
import { FiCheck, FiArrowLeft, FiAlertTriangle, FiInfo, FiCamera } from 'react-icons/fi';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const AttendanceFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [training, setTraining] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [signature, setSignature] = useState(null);
  const toast = useToast();

  // Fetch training details
  useEffect(() => {
    const fetchTrainingDetails = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/api/training/${id}`);
        setTraining(response.data.data);
        
        // Check if user is registered for this training
        const attendanceResponse = await api.get('/api/attendance/user');
        const userAttendances = attendanceResponse.data.data;
        const trainingAttendance = userAttendances.find(
          attendance => attendance.TrainingId === id
        );
        
        // If not registered or already marked attended, redirect
        if (!trainingAttendance) {
          toast({
            title: 'Not Registered',
            description: 'You are not registered for this training session.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          navigate(`/trainings/${id}`);
        } else if (trainingAttendance.status === 'attended') {
          toast({
            title: 'Already Attended',
            description: 'You have already marked your attendance for this training session.',
            status: 'info',
            duration: 5000,
            isClosable: true,
          });
          navigate(`/trainings/${id}`);
        }
      } catch (error) {
        console.error('Error fetching training details:', error);
        setError('Failed to load training details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrainingDetails();
  }, [id, navigate, toast]);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Attendance declaration validation schema
  const attendanceSchema = Yup.object().shape({
    confirmAttendance: Yup.boolean()
      .oneOf([true], 'You must confirm your attendance')
      .required('Required'),
    deviceInfo: Yup.string()
      .required('Device information is required'),
  });

  // Declaration form validation schema
  const declarationSchema = Yup.object().shape({
    understandContent: Yup.boolean()
      .oneOf([true], 'You must confirm that you understand the content')
      .required('Required'),
    commitToImplement: Yup.boolean()
      .oneOf([true], 'You must commit to implement the learnings')
      .required('Required'),
    feedbackRating: Yup.string()
      .required('Please provide a rating'),
    feedbackComments: Yup.string()
      .min(5, 'Comments must be at least 5 characters')
      .required('Please provide feedback comments'),
    acceptTerms: Yup.boolean()
      .oneOf([true], 'You must accept the terms and conditions')
      .required('Required'),
  });

  // Handle form submission for attendance confirmation
  const handleAttendanceSubmit = (values) => {
    console.log('Attendance values:', values);
    setStep(2);
  };

  // Handle form submission for declaration
  const handleDeclarationSubmit = async (values) => {
    try {
      setSubmitting(true);
      
      // Combine form data
      const formData = {
        trainingId: id,
        confirmAttendance: true,
        deviceInfo: values.deviceInfo,
        understandContent: values.understandContent,
        commitToImplement: values.commitToImplement,
        feedbackRating: values.feedbackRating,
        feedbackComments: values.feedbackComments,
        acceptTerms: values.acceptTerms,
        signature: signature,
      };
      
      // Submit attendance and declaration
      await api.post('/api/attendance/mark', formData);
      
      toast({
        title: 'Success',
        description: 'Your attendance and declaration have been submitted successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      navigate(`/trainings/${id}`);
    } catch (error) {
      console.error('Error submitting declaration:', error);
      setError('Failed to submit your attendance and declaration. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box maxW="1000px" mx="auto" pb={10}>
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Button 
          leftIcon={<FiArrowLeft />} 
          variant="ghost" 
          onClick={() => navigate(`/trainings/${id}`)}
          color="gray.700"
        >
          Back to Training
        </Button>
        
        {/* Progress indicator */}
        <HStack spacing={4} width="60%">
          <Progress 
            value={step === 1 ? 50 : 100} 
            size="sm" 
            colorScheme="blue" 
            width="100%" 
            borderRadius="full"
          />
          <Text fontSize="sm" whiteSpace="nowrap" color="gray.600">
            Step {step} of 2
          </Text>
        </HStack>
      </Flex>
      
      {error && (
        <Alert status="error" mb={6} borderRadius="md">
          <AlertIcon />
          <AlertTitle color="red.600">Error!</AlertTitle>
          <AlertDescription color="red.600">{error}</AlertDescription>
        </Alert>
      )}
      
      {isLoading ? (
        <Card bg="white" boxShadow="sm" borderWidth="1px" borderColor="gray.200">
          <CardBody>
            <Text>Loading training details...</Text>
          </CardBody>
        </Card>
      ) : training ? (
        <Box>
          <Card mb={6} bg="white" boxShadow="sm" borderWidth="1px" borderColor="gray.200">
            <CardBody>
              <Heading size="md" color="gray.800">
                {training.title}
              </Heading>
              <Text fontSize="sm" color="gray.600">
                {formatDate(training.startDate)}
              </Text>
              <Text fontSize="sm" color="gray.600">
                {training.isVirtual ? 'Virtual (Online)' : training.location}
              </Text>
            </CardBody>
          </Card>
          
          {step === 1 ? (
            // Step 1: Attendance Confirmation
            <Card bg="white" boxShadow="sm" borderWidth="1px" borderColor="gray.200">
              <CardBody>
                <Heading size="md" mb={4} color="gray.800">
                  Attendance Confirmation
                </Heading>
                
                <Alert status="info" mb={6}>
                  <AlertIcon />
                  <Box>
                    <AlertTitle color="gray.700">Important!</AlertTitle>
                    <AlertDescription color="gray.600">
                      By confirming your attendance, you acknowledge that you have participated in this training session.
                      False declarations may result in non-compliance with Sasol's training requirements.
                    </AlertDescription>
                  </Box>
                </Alert>
                
                <Formik
                  initialValues={{
                    confirmAttendance: false,
                    deviceInfo: `${
                      navigator.userAgent
                    } | ${new Date().toISOString()}`,
                  }}
                  validationSchema={attendanceSchema}
                  onSubmit={handleAttendanceSubmit}
                >
                  {({ errors, touched }) => (
                    <Form>
                      <Stack spacing={6}>
                        <Field name="confirmAttendance">
                          {({ field, form }) => (
                            <FormControl isInvalid={form.errors.confirmAttendance && form.touched.confirmAttendance}>
                              <Checkbox 
                                {...field} 
                                colorScheme="green" 
                                size="lg"
                                color="gray.700"
                              >
                                I confirm that I have attended this training session in its entirety
                              </Checkbox>
                              {form.errors.confirmAttendance && form.touched.confirmAttendance && (
                                <Text color="red.600" mt={2} fontSize="sm">
                                  {form.errors.confirmAttendance}
                                </Text>
                              )}
                            </FormControl>
                          )}
                        </Field>
                        
                        <Field name="deviceInfo">
                          {({ field, form }) => (
                            <FormControl isInvalid={form.errors.deviceInfo && form.touched.deviceInfo} hidden>
                              <Input {...field} type="hidden" />
                            </FormControl>
                          )}
                        </Field>
                        
                        <HStack mt={4} justify="flex-end">
                          <Button onClick={() => navigate(`/trainings/${id}`)} variant="outline">
                            Cancel
                          </Button>
                          <Button 
                            type="submit" 
                            variant="primary" 
                            rightIcon={<FiCheck />}
                          >
                            Continue to Declaration
                          </Button>
                        </HStack>
                      </Stack>
                    </Form>
                  )}
                </Formik>
              </CardBody>
            </Card>
          ) : (
            // Step 2: Declaration Form
            <Card bg="white" boxShadow="sm" borderWidth="1px" borderColor="gray.200">
              <CardBody>
                <Heading size="md" mb={4} color="gray.800">
                  Training Declaration Form
                </Heading>
                
                <Formik
                  initialValues={{
                    understandContent: false,
                    commitToImplement: false,
                    feedbackRating: '',
                    feedbackComments: '',
                    acceptTerms: false,
                  }}
                  validationSchema={declarationSchema}
                  onSubmit={handleDeclarationSubmit}
                >
                  {({ errors, touched }) => (
                    <Form>
                      <Stack spacing={6}>
                        <Box bg="gray.50" p={4} borderRadius="md">
                          <Heading size="sm" mb={3} color="gray.800">
                            Training Acknowledgement
                          </Heading>
                          
                          <Stack spacing={4}>
                            <Field name="understandContent">
                              {({ field, form }) => (
                                <FormControl isInvalid={form.errors.understandContent && form.touched.understandContent}>
                                  <Checkbox {...field} colorScheme="green" color="gray.700">
                                    I confirm that I understand the content presented in this training session
                                  </Checkbox>
                                  {form.errors.understandContent && form.touched.understandContent && (
                                    <Text color="red.600" mt={1} fontSize="sm">
                                      {form.errors.understandContent}
                                    </Text>
                                  )}
                                </FormControl>
                              )}
                            </Field>
                            
                            <Field name="commitToImplement">
                              {({ field, form }) => (
                                <FormControl isInvalid={form.errors.commitToImplement && form.touched.commitToImplement}>
                                  <Checkbox {...field} colorScheme="green" color="gray.700">
                                    I commit to implement the learnings from this training in my work
                                  </Checkbox>
                                  {form.errors.commitToImplement && form.touched.commitToImplement && (
                                    <Text color="red.600" mt={1} fontSize="sm">
                                      {form.errors.commitToImplement}
                                    </Text>
                                  )}
                                </FormControl>
                              )}
                            </Field>
                          </Stack>
                        </Box>
                        
                        <Divider />
                        
                        <Box>
                          <Heading size="sm" mb={3} color="gray.800">
                            Training Feedback
                          </Heading>
                          
                          <Stack spacing={4}>
                            <Field name="feedbackRating">
                              {({ field, form }) => (
                                <FormControl isInvalid={form.errors.feedbackRating && form.touched.feedbackRating}>
                                  <FormLabel color="gray.800">How would you rate this training session?</FormLabel>
                                  <RadioGroup {...field}>
                                    <SimpleGrid columns={{ base: 1, md: 5 }} spacing={2}>
                                      <Radio value="1" color="gray.700">Very Poor</Radio>
                                      <Radio value="2" color="gray.700">Poor</Radio>
                                      <Radio value="3" color="gray.700">Average</Radio>
                                      <Radio value="4" color="gray.700">Good</Radio>
                                      <Radio value="5" color="gray.700">Excellent</Radio>
                                    </SimpleGrid>
                                  </RadioGroup>
                                  {form.errors.feedbackRating && form.touched.feedbackRating && (
                                    <Text color="red.600" mt={1} fontSize="sm">
                                      {form.errors.feedbackRating}
                                    </Text>
                                  )}
                                </FormControl>
                              )}
                            </Field>
                            
                            <Field name="feedbackComments">
                              {({ field, form }) => (
                                <FormControl isInvalid={form.errors.feedbackComments && form.touched.feedbackComments}>
                                  <FormLabel color="gray.800">Please provide any comments or suggestions about the training:</FormLabel>
                                  <Textarea {...field} placeholder="Your feedback helps us improve future training sessions" />
                                  {form.errors.feedbackComments && form.touched.feedbackComments && (
                                    <Text color="red.600" mt={1} fontSize="sm">
                                      {form.errors.feedbackComments}
                                    </Text>
                                  )}
                                </FormControl>
                              )}
                            </Field>
                          </Stack>
                        </Box>
                        
                        <Divider />
                        
                        <Box>
                          <Heading size="sm" mb={3} color="gray.800">
                            Digital Signature
                          </Heading>
                          
                          <Alert status="info" mb={4}>
                            <AlertIcon as={FiInfo} />
                            <Text fontSize="sm" color="gray.600">
                              Please provide your digital signature to complete this declaration. 
                              This will be recorded as your official acknowledgement.
                            </Text>
                          </Alert>
                          
                          <Box 
                            border="1px dashed" 
                            borderColor="gray.300" 
                            borderRadius="md" 
                            p={6} 
                            textAlign="center"
                            bg="gray.50"
                            mb={4}
                          >
                            {signature ? (
                              <Text color="green.500">Signature captured</Text>
                            ) : (
                              <Button 
                                leftIcon={<FiCamera />} 
                                onClick={() => setSignature(true)}
                              >
                                Capture Signature
                              </Button>
                            )}
                          </Box>
                        </Box>
                        
                        <Field name="acceptTerms">
                          {({ field, form }) => (
                            <FormControl isInvalid={form.errors.acceptTerms && form.touched.acceptTerms}>
                              <Checkbox {...field} colorScheme="green" color="gray.700">
                                I acknowledge that this electronic declaration serves as my official record of attendance 
                                and compliance with Sasol's training requirements
                              </Checkbox>
                              {form.errors.acceptTerms && form.touched.acceptTerms && (
                                <Text color="red.600" mt={1} fontSize="sm">
                                  {form.errors.acceptTerms}
                                </Text>
                              )}
                            </FormControl>
                          )}
                        </Field>
                        
                        <HStack justify="space-between">
                          <Button 
                            onClick={() => setStep(1)} 
                            leftIcon={<FiArrowLeft />}
                            variant="outline"
                          >
                            Back
                          </Button>
                          <Button 
                            type="submit" 
                            variant="primary" 
                            rightIcon={<FiCheck />}
                            isLoading={submitting}
                            isDisabled={!signature}
                          >
                            Submit Declaration
                          </Button>
                        </HStack>
                      </Stack>
                    </Form>
                  )}
                </Formik>
              </CardBody>
            </Card>
          )}
        </Box>
      ) : (
        <Card bg="white" boxShadow="sm" borderWidth="1px" borderColor="gray.200">
          <CardBody>
            <Stack spacing={4} align="center">
              <Icon as={FiAlertTriangle} fontSize="3xl" color="red.600" />
              <Heading size="md" color="gray.800">Training Not Found</Heading>
              <Text color="gray.600">The requested training session could not be found.</Text>
              <Button onClick={() => navigate('/trainings')}>
                Back to Training List
              </Button>
            </Stack>
          </CardBody>
        </Card>
      )}
    </Box>
  );
};

export default AttendanceFormPage;
