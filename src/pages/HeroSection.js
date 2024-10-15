import React from 'react';
import { VStack, Heading, Text, Button } from '@chakra-ui/react';

export const HeroSection = ({ onGetStarted }) => (
  <VStack spacing={8} align="center" textAlign="center" py={32}>
    <Heading as="h1" size="4xl" color="white">Create Faceless Accounts in One Click</Heading>
    <Text fontSize="xl" color="whiteAlpha.800">Use AI to automatically create and post custom videos daily</Text>
    <Button colorScheme="purple" size="lg" onClick={onGetStarted}>Get Started</Button>
  </VStack>
);