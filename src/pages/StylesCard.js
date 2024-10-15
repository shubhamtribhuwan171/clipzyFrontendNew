import React from 'react';
import { Box, Heading, Text, VStack } from '@chakra-ui/react';

export const StylesCard = () => (
  <Box bg="rgba(255,255,255,0.1)" p={6} borderRadius="lg">
    <VStack align="start" spacing={4}>
      <Heading size="md" color="purple.300">Video Styles</Heading>
      <Text color="whiteAlpha.800">Choose from various video styles to match your brand.</Text>
    </VStack>
  </Box>
);