import React from 'react';
import { Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react';

const ErrorMessage = ({ message }) => {
  return (
    <Alert status="error">
      <AlertIcon />
      <AlertTitle mr={2}>Error!</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};

export default ErrorMessage;