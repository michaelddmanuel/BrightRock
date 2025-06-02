import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  Link,
  Image,
  Icon,
} from '@chakra-ui/react';
import { FiAlertTriangle, FiHome } from 'react-icons/fi';

const NotFoundPage = () => {
  const bgColor = 'gray.50';
  const textColor = 'sasol.navy';

  return (
    <Flex
      minHeight="70vh"
      direction="column"
      alignItems="center"
      justifyContent="center"
      bg={bgColor}
      p={8}
      borderRadius="lg"
    >
      <Icon
        as={FiAlertTriangle}
        w={24}
        h={24}
        color="sasol.blue"
        mb={8}
      />
      <Heading
        as="h1"
        size="2xl"
        mb={4}
        color={textColor}
      >
        404 - Page Not Found
      </Heading>
      <Text
        fontSize="xl"
        textAlign="center"
        mb={8}
        maxW="md"
      >
        The page you are looking for doesn't exist or has been moved.
      </Text>
      <Button
        as={RouterLink}
        to="/"
        variant="primary"
        size="lg"
        leftIcon={<FiHome />}
      >
        Return to Homepage
      </Button>
    </Flex>
  );
};

export default NotFoundPage;
