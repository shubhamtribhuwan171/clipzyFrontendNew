import React from 'react';
import { Box, VStack, Heading, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const Generate = () => {
  const navigate = useNavigate();

  return (
    <Box p={8}>
      <VStack spacing={4} align="stretch">
        <Heading as="h1" size="xl">Generate</Heading>
        <Button colorScheme="blue" onClick={() => navigate('/dashboard/generate-ai-video')}>
          Generate AI Video
        </Button>
        <Button colorScheme="blue" onClick={() => navigate('/dashboard/generate-custom-background')}>
          Generate Custom Background
        </Button>
        {/* Add more options as needed */}
      </VStack>
    </Box>
  );
};

export default Generate;