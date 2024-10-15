import React from 'react';
import { Box, Heading, Text, VStack } from '@chakra-ui/react';

export const CustomizeAndStyleCard = () => (
  <Box bg="rgba(255,255,255,0.1)" p={6} borderRadius="lg">
    <VStack align="start" spacing={4}>
      <Heading size="md" color="purple.300">Customize and Style</Heading>
      <Text color="whiteAlpha.800">Personalize your videos with custom styles and branding.</Text>
    </VStack>
  </Box>
);