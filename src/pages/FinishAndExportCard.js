import React from 'react';
import { Box, Heading, Text, VStack } from '@chakra-ui/react';

export const FinishAndExportCard = () => (
  <Box bg="rgba(255,255,255,0.1)" p={6} borderRadius="lg">
    <VStack align="start" spacing={4}>
      <Heading size="md" color="purple.300">Finish and Export</Heading>
      <Text color="whiteAlpha.800">Finalize your video and export in various formats.</Text>
    </VStack>
  </Box>
);