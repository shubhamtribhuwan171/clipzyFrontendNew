import React from 'react';
import { Box, Heading, Text, VStack } from '@chakra-ui/react';

export const SchedulingCard = () => (
  <Box bg="rgba(255,255,255,0.1)" p={6} borderRadius="lg">
    <VStack align="start" spacing={4}>
      <Heading size="md" color="purple.300">Scheduling</Heading>
      <Text color="whiteAlpha.800">Schedule your videos for optimal posting times.</Text>
    </VStack>
  </Box>
);